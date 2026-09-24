"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { AnimationItem } from "lottie-web";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { holdBoot, markBooted, whenBooted } from "@/lib/boot";
import { scroller } from "@/components/motion/SmoothScroll";

/**
 * O véu da troca de página: o mesmo fundo e o mesmo tamanho de marca do
 * Preloader (a primeira entrada no site), com outra animação — a marca se
 * monta e fica pulsando enquanto a página nova não chega.
 *
 * A animação (`/anim/transition.json`) tem dois trechos, e o véu usa os dois:
 *
 *   ENTRY — quadros 0 a 58: símbolo e nome se montam (prontos no ~40) e a
 *           escala volta ao repouso. Tocado a 1,7×, a marca fica montada em
 *           ~0,8 s, que é o tempo mínimo do véu na tela (MIN_MS): menos que
 *           isso e a entrada seria cortada no meio;
 *   PULSE — quadros 58 a 120: um ciclo inteiro do pulso de escala (100 → 104
 *           → 100), em loop, na velocidade original. O 58 é o fundo da
 *           escala, então a emenda entre os dois trechos não tem tranco.
 *
 * O caminho de uma troca:
 *
 *   1. o clique num link para outra página é segurado (o `next/link` respeita
 *      `defaultPrevented`); o portão do boot fecha (`holdBoot`) e a rolagem
 *      trava;
 *   2. o véu cobre a tela e a marca começa a entrada;
 *   3. com o véu opaco, a rolagem volta a zero **antes** de a rota mudar — a
 *      página nova precisa montar os ScrollTriggers com a janela no topo (ver
 *      o script inline em layout.tsx: montar rolado corrompe o ScrollTrigger);
 *   4. a rota muda; o véu espera o tempo mínimo e as imagens da primeira
 *      dobra, pulsando se preciso, com um teto (MAX_MS) contra rede ruim;
 *   5. sai como uma cortina: a marca sobe e some, e o véu inteiro sobe
 *      atrás dela, revelando a página de baixo para cima. O portão abre no
 *      começo do gesto: a entrada do hero novo acontece enquanto a cortina
 *      sobe.
 *
 * Voltar e avançar do navegador não passam por clique: aí o véu cobre de uma
 * vez (a rota já está mudando) e segue do passo 3.
 */

/** Tempo mínimo na tela, a partir do começo da entrada da marca. */
const MIN_MS = 800;
/** Teto: passado isto o véu sai, tenha a página carregado o que tiver. */
const MAX_MS = 8000;
/** Quanto o véu leva para cobrir a tela depois do clique. */
const COVER_S = 0.25;

const ENTRY: [number, number] = [0, 58];
const PULSE: [number, number] = [58, 120];
const ENTRY_SPEED = 1.7;

/* O centro vertical exato da marca: o desenho fica 0,93% da altura da
   composição abaixo do centro dela (medido no quadro 58), e o palco sobe isso
   além dos 50% da centralização. */
const STAGE_Y = -50.93;

type Phase = "idle" | "covering" | "waiting" | "leaving";

export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const veil = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  /* O estado mora em refs: a troca é uma sequência de efeitos e tweens, e
     nada disso precisa de re-render. */
  const phase = useRef<Phase>("idle");
  const shownAt = useRef(0);
  const player = useRef<AnimationItem | null>(null);
  const loading = useRef<Promise<AnimationItem | null> | null>(null);
  const lastPath = useRef(pathname);
  const cap = useRef<number | undefined>(undefined);
  const finish = useRef<() => void>(() => {});
  const scrollWas = useRef("");

  /* ------------------------------------------------------------ o player */

  /** Sobe o player uma vez só. O JSON é pequeno, mas não entra no bundle: ele
      é buscado depois da primeira entrada, quando a rede está livre. */
  const load = () => {
    if (!loading.current) {
      loading.current = (async () => {
        try {
          const [mod, data] = await Promise.all([
            import("lottie-web/build/player/lottie_light"),
            fetch("/anim/transition.json").then((r) => r.json()),
          ]);
          if (!stage.current) return null;
          const item = mod.default.loadAnimation({
            container: stage.current,
            renderer: "svg",
            loop: false,
            autoplay: false,
            animationData: data,
          });
          player.current = item;
          return item;
        } catch {
          /* Sem animação o véu continua fazendo o trabalho dele: cobrir. */
          return null;
        }
      })();
    }
    return loading.current;
  };

  /** A entrada, e o pulso em loop quando ela termina. */
  const play = (item: AnimationItem) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      item.goToAndStop(ENTRY[1], true);
      return;
    }
    item.loop = false;
    item.setSpeed(ENTRY_SPEED);
    const toPulse = () => {
      item.removeEventListener("complete", toPulse);
      if (phase.current === "idle") return;
      item.loop = true;
      item.setSpeed(1);
      item.playSegments(PULSE, true);
    };
    item.addEventListener("complete", toPulse);
    item.playSegments(ENTRY, true);
  };

  /* --------------------------------------------------- pré-carregamento */

  useEffect(() => {
    gsap.set(stage.current, { xPercent: -50, yPercent: STAGE_Y });
  }, []);

  useEffect(() => {
    let alive = true;
    void whenBooted().then(() => {
      if (!alive) return;
      const idle = window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 1200));
      idle(() => {
        if (alive) void load();
      });
    });
    return () => {
      alive = false;
      player.current?.destroy();
      player.current = null;
      loading.current = null;
    };
  }, []);

  /* ----------------------------------------------------- abrir o véu */

  useEffect(() => {
    const html = document.documentElement;

    const begin = (go: (() => void) | null, instant: boolean) => {
      if (phase.current !== "idle") {
        /* Um segundo clique com o véu já subindo: segue para o destino novo. */
        go?.();
        return;
      }
      const el = veil.current;
      if (!el) {
        go?.();
        return;
      }
      phase.current = "covering";
      holdBoot();

      /* A página não rola com o véu de pé. */
      scroller()?.stop();
      scrollWas.current = html.style.overflow;
      html.style.overflow = "hidden";

      shownAt.current = performance.now();
      void load().then((item) => {
        if (!item || phase.current === "idle") return;
        /* O mínimo conta do começo da entrada, não do clique: se o player
           demorou a subir, a marca ainda precisa do tempo inteiro. */
        shownAt.current = performance.now();
        gsap.set(stage.current, { opacity: 1, y: 0 });
        play(item);
      });

      const covered = () => {
        /* Com o véu opaco: o topo da página, e só então a rota. */
        scroller()?.scrollTo(0, { immediate: true, force: true });
        window.scrollTo(0, 0);
        go?.();
      };

      gsap.killTweensOf([el, stage.current]);
      gsap.set(el, { display: "grid", yPercent: 0 });
      if (instant) {
        gsap.set(el, { opacity: 1 });
        covered();
      } else {
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: COVER_S, ease: "power2.out", onComplete: covered });
      }

      /* O teto vale desde o clique: rota que não muda, página que não chega. */
      window.clearTimeout(cap.current);
      cap.current = window.setTimeout(() => finish.current(), MAX_MS);
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor || anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      /* Mesma página (âncora, ou só a query): nada de véu — a rota não muda
         e o véu ficaria esperando uma troca que não vem. */
      if (url.pathname === window.location.pathname) return;

      event.preventDefault();
      begin(() => router.push(url.pathname + url.search + url.hash, { scroll: false }), false);
    };

    const onPop = () => {
      if (window.location.pathname === lastPath.current) return;
      begin(null, true);
    };

    /* Captura: roda antes do onClick do `next/link`, que então vê o clique
       já cancelado e não navega por conta própria. */
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
      window.clearTimeout(cap.current);
    };
  }, [router]);

  /* ----------------------------------------------------- fechar o véu */

  useEffect(() => {
    const html = document.documentElement;

    finish.current = () => {
      if (phase.current === "idle" || phase.current === "leaving") return;
      phase.current = "leaving";
      window.clearTimeout(cap.current);

      html.style.overflow = scrollWas.current;
      window.scrollTo(0, 0);
      /* As seções novas mediram a página com o véu por cima e a rolagem
         travada. */
      ScrollTrigger.refresh();
      scroller()?.start();

      /* O refresh ocupou um quadro inteiro e `lagSmoothing(0)` não perdoa
         quadro longo: a saída começaria adiantada. Um tick do relógio do GSAP
         depois, ela parte de um quadro limpo (mesmo cuidado do Preloader). */
      gsap.ticker.add(function start() {
        gsap.ticker.remove(start);
        /* A entrada do hero novo começa junto com a saída, como na primeira
           entrada no site. */
        markBooted();

        gsap
          .timeline({
            onComplete: () => {
              gsap.set(veil.current, { display: "none", yPercent: 0 });
              player.current?.stop();
              phase.current = "idle";
            },
          })
          /* A marca sai primeiro, subindo um pouco mais depressa que o véu —
             é ela que puxa a cortina. */
          .to(stage.current, { opacity: 0, y: "-12vh", duration: 0.5, ease: "power2.in" }, 0)
          /* A cortina: o véu inteiro sobe e sai pelo alto. Opaco até o fim —
             o que revela a página é a borda de baixo passando, não um
             esmaecimento. */
          .to(veil.current, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, 0.1);
      });
    };
  });

  /* A rota mudou: espera o mínimo e a primeira dobra, e sai. */
  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    if (phase.current !== "covering") return;
    phase.current = "waiting";

    let alive = true;
    const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

    void (async () => {
      /* Dois quadros: a página nova pintada, com as imagens já no DOM. */
      await frame();
      await frame();
      /* Só as fotos que a página marcou como prioridade (o hero: `priority`
         no next/image, `fetchPriority="high"` no <img>) e que estão na tela.
         Esperar "toda imagem na área da tela" prendia o véu em camadas
         escondidas de seções mais abaixo — no Aminosan, três PNGs de 1,5 MB
         empilhados no topo de uma cena presa seguravam a troca até o teto. */
      const images = [...document.querySelectorAll<HTMLImageElement>('main img[fetchpriority="high"]')].filter((img) => {
        if (img.complete) return false;
        const box = img.getBoundingClientRect();
        return box.bottom > 0 && box.top < window.innerHeight && box.width > 0;
      });
      const wait = Math.max(0, MIN_MS - (performance.now() - shownAt.current));
      await Promise.all([
        new Promise((r) => window.setTimeout(r, wait)),
        document.fonts?.ready,
        ...images.map(
          (img) =>
            new Promise<void>((r) => {
              img.addEventListener("load", () => r(), { once: true });
              img.addEventListener("error", () => r(), { once: true });
            }),
        ),
      ]);
      /* O mínimo pode ter passado enquanto as imagens chegavam no meio de
         uma volta do pulso; sair ali é o esperado — o gesto de saída leva a
         marca embora de qualquer ponto. */
      if (alive) finish.current();
    })();

    return () => {
      alive = false;
    };
  }, [pathname]);

  return (
    <div
      ref={veil}
      aria-hidden
      style={{ display: "none", opacity: 0 }}
      className="fixed inset-0 z-[190] overflow-hidden bg-white"
    >
      {/* O mesmo tamanho de marca do Preloader. A composição daqui é vertical
          (1080 × 1920, a marca a 60%), e a do Preloader deitada (1920 ×
          1080): medidas as duas, o selo sai do mesmo tamanho com este palco
          a 93,6% da largura do de lá.

          Posição absoluta, e não o centro do grid: o palco vertical é mais
          alto que a tela, e um item de grid maior que o contêiner encosta no
          topo em vez de centralizar — a marca descia ~50 px. A centralização
          e o ajuste óptico são do GSAP (ver STAGE_Y), para não brigar com o
          `y` da saída. */}
      <div
        ref={stage}
        className="absolute top-1/2 left-1/2 aspect-[9/16] w-[calc(min(600px,78vw)*0.936)] min-w-[393px]"
      />
    </div>
  );
}
