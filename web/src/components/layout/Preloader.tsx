"use client";

import { useEffect, useRef, useState } from "react";
import type { AnimationItem } from "lottie-web";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { markBooted, markCovered, whenPrepared } from "@/lib/boot";
import { lockScroll } from "@/lib/scroll-lock";

/**
 * Véu de carregamento com a animação da marca (Lottie).
 *
 * Existe por dois motivos, nesta ordem:
 *
 *   1. o hero é feito de cinco imagens grandes, e sem véu a página abre com a
 *      cena meio montada;
 *   2. a entrada do hero é uma animação, e ela precisa começar com o leitor
 *      olhando — atrás do véu, ela rodava sozinha e a cena aparecia parada.
 *
 * O véu sai quando os recursos da primeira dobra chegam, respeitado um tempo
 * mínimo em tela (senão ele pisca) e um teto (rede ruim não prende a página).
 * Ver src/lib/boot.ts.
 *
 * O JSON não entra no bundle: são ~575 KB que só o primeiro paint usa, então
 * ele é buscado de /anim e o player entra por import dinâmico.
 */

/**
 * Teto: passado isto a página abre, tenha carregado o que tiver e tenha a
 * animação chegado onde chegou. É a rede contra rede ruim e contra o player
 * não subir.
 */
const MAX_MS = 9000;

/**
 * O player e o JSON começam a vir quando este módulo é avaliado, e não no
 * efeito do componente: o efeito só roda depois da hidratação da página
 * inteira, e aí a rede já teria ficado parada esperando por ela. Assim o
 * download corre junto com a hidratação, e o que sobra para depois dela é só
 * montar a animação.
 */
const assets: Promise<[typeof import("lottie-web/build/player/lottie_light"), unknown] | null> | null =
  typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? Promise.all([
        import("lottie-web/build/player/lottie_light"),
        fetch("/anim/preloader.json").then((r) => r.json() as Promise<unknown>),
      ]).catch(() => null)
    : null;

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const veil = root.current;
    if (!veil) return;

    let killed = false;
    let player: AnimationItem | null = null;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Enquanto o véu está de pé a página não rola: a cena do hero avançaria
       por baixo sem ninguém ver. A barra de rolagem continua na tela, e a
       trava é só de entrada (ver lib/scroll-lock.ts): esconder a barra com
       `overflow: hidden` e devolvê-la na saída mudava a largura da página no
       primeiro quadro da cortina. */
    const lock = lockScroll();

    /* O zero da rolagem já aconteceu — ver o script inline em layout.tsx,
       que roda antes de qualquer hidratação. useGSAP usa useLayoutEffect, que
       dispara antes deste useEffect; se o zero morasse aqui, toda seção já
       teria montado seu ScrollTrigger com a posição antiga. */

    const unlock = () => {
      lock.release();
      /* As medidas do ScrollTrigger foram tiradas com a página parada. Rodar
         isto é caro e é síncrono: por isso acontece com o véu ainda opaco e
         parado, antes da saída, e não no meio dela. */
      ScrollTrigger.refresh();
    };

    /* --------------------------------------------------------- o player */
    /* A animação toca uma vez e o véu espera ela terminar: é a marca se
       montando, não um giro de espera — cortar no meio é perder o desenho. */
    const played = new Promise<void>((resolve) => {
      if (reduce) {
        resolve();
        return;
      }
      void (async () => {
        try {
          const loaded = await assets;
          if (!loaded || killed || !stage.current) {
            resolve();
            return;
          }
          const [mod, data] = loaded;
          const item = mod.default.loadAnimation({
            container: stage.current,
            renderer: "svg",
            loop: false,
            autoplay: true,
            animationData: data,
            /* Monta os elementos conforme cada camada entra, e não os ~250 de
               uma vez no primeiro quadro — que era a travada do começo. */
            rendererSettings: { progressiveLoad: true },
          });
          /* Mais rápido que o original: como véu, a marca precisa se montar
             sem virar espera. */
          item.setSpeed(1.7);
          player = item;
          item.addEventListener("complete", () => resolve());
        } catch {
          /* Sem animação o véu continua fazendo o trabalho dele: cobrir. */
          resolve();
        }
      })();
    });

    /* ------------------------------------------------------- o gatilho */
    const loaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });

    const capped = new Promise<void>((resolve) => window.setTimeout(resolve, MAX_MS));

    void Promise.race([
      Promise.all([loaded, played, document.fonts?.ready]),
      capped,
    ]).then(async () => {
      if (killed) return;
      /* A animação terminou e a marca está parada, inteira: é aqui que a
         página faz o trabalho pesado (cena de partículas, amostragem da
         foto — ver lib/boot.ts). Feito na saída do véu, congelava a cortina;
         feito durante a animação, travava a marca. */
      markCovered();
      await whenPrepared();
      if (killed) return;
      unlock();
      /* O refresh acima ocupou um quadro inteiro. Com `lagSmoothing(0)` o
         GSAP não perdoa quadro longo: uma linha do tempo criada agora
         herdaria o tempo do quadro perdido e a saída começaria já adiantada,
         como um tranco. Esperar um tick do relógio dele começa a saída — e a
         entrada do hero, junto — de um quadro limpo. */
      gsap.ticker.add(function start() {
        gsap.ticker.remove(start);
        if (killed) return;
        /* A entrada do hero começa junto com a saída do véu: as duas se
           sobrepõem, e a cena já está andando quando aparece. */
        markBooted();
        /* A saída é a cortina do véu da troca de página (PageTransition.tsx):
           a marca sobe e some primeiro, puxando o véu, que sobe inteiro e sai
           pelo alto, opaco até o fim — o que revela a página é a borda de
           baixo passando. A entrada do hero já está andando por baixo dela. */
        gsap
          .timeline({ onComplete: () => setGone(true) })
          /* Relativo, e não `y` absoluto: o palco já está erguido pela classe
             de centralização (`-translate-y-[8.9%]`), que o GSAP lê como `y`. */
          .to(stage.current, { opacity: 0, y: `-=${window.innerHeight * 0.12}`, duration: 0.5, ease: "power2.in" }, 0)
          .to(veil, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, 0.1);
      });
    });

    return () => {
      killed = true;
      player?.destroy();
      lock.release();
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      aria-hidden
      className="fixed inset-0 z-[200] grid place-content-center place-items-center overflow-hidden bg-white"
    >
      {/* A composição é 1920 × 1080 e o player encaixa dentro do palco
          (`meet`), então a proporção precisa estar declarada — sem ela o SVG
          fica com altura zero. A largura mínima impede a marca de virar um
          selo em telas estreitas: o que sobra sai pelas laterais e o véu
          corta. A marca (selo e bandeiras) fica 8,9% da altura da composição
          abaixo do centro dela, e o palco sobe exatamente isso: o desenho
          fica no centro vertical da tela, como no véu da troca de página.
          `place-content-center` centra a trilha do grid: em telas mais
          estreitas que a largura mínima (iPhone de 375 a 393px) o palco
          transborda e, sem isso, encostava à esquerda e sobrava tudo à
          direita — a marca aparecia deslocada. */}
      <div
        ref={stage}
        className="aspect-video w-[min(600px,78vw)] min-w-[420px] -translate-y-[8.9%]"
      />
    </div>
  );
}
