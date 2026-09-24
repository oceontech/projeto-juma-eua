"use client";

import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { whenBooted } from "@/lib/boot";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { buildField, cover, paintStill, shapeClouds } from "@/lib/origin/build";
import { createField, type Field, type Uniforms } from "@/lib/origin/field";
import { microCaps } from "./ui";

/**
 * O hero se desfazendo em partículas, e a cadeia que nasce delas.
 *
 * A cena é uma só, travada em tela cheia, e o scroll é o transporte. A ordem
 * da abertura importa e é literal: **primeiro a foto se aproxima** — o zoom
 * do parallax, com a foto ainda inteira —, **depois** ela se fragmenta, e só
 * então a nuvem ganha volume e sai para o primeiro desenho. Dali em diante é
 * a cadeia da assimilação de nitrogênio, um desenho por etapa: a planta com
 * raiz, onde a cadeia acontece; o nitrato que a raiz recebe; o amônio que
 * sobra das reduções; e o aminoácido no fim.
 *
 * Três coisas governam o ritmo:
 *
 *   o texto quase não falta — a copy da etapa seguinte entra logo no começo
 *   do morph, e não depois dele, então o leitor lê enquanto a forma se monta;
 *
 *   o trilho da rota é contínuo — nasce uma vez e fica, enchendo com o
 *   scroll, em vez de aparecer e sumir junto com cada painel;
 *
 *   a cena é plana — sem z, sem giro, sem perspectiva. As formas são
 *   traçado visto de frente, e o desenho é o que ele parece ser.
 *
 * Este componente **embrulha o hero** (`children`) em vez de vir depois dele.
 * É o que permite travar os dois juntos: a foto precisa continuar no lugar
 * enquanto se aproxima e se desmancha, e um pin que começasse abaixo do hero
 * já o teria empurrado para fora da tela.
 */

/* O mesmo corte do hero, que troca a foto e o enquadramento no celular. */
const NARROW = "(max-width: 860px)";

/* Onde a cena vira duas colunas — o mesmo `lg:` que o JSX usa para mandar a
   copy para a esquerda. Os dois precisam ser o mesmo número, senão existe uma
   faixa de larguras com o desenho já à direita e o texto ainda no pé. */
const TWO_COLUMN = "(min-width: 1024px)";

/* Contagem de partículas. O mesmo N vale para os cinco estados — é o que
   permite morfar sem criar nem destruir nada. */
const COUNT = { wide: 12_000, narrow: 8_000 };

/** Estado inicial dos uniforms. Um objeto novo por montagem: o GSAP escreve nele. */
const uniforms = (): Uniforms => ({
  phase: 0,
  saturation: 1,
  opacity: 0,
  size: 1.5,
  noise: 5,
  flow: 0.16,
  orbit: 0.5,
  halo: 150,
  burst: 90,
  /* Alto de propósito: quanto mais espalhados os instantes de partida, mais
     longa e mais orgânica fica a travessia de uma forma para a outra. */
  stagger: 0.6,
  push: 40,
  mouseRadius: 215,
  /* Grafite da referência: o ponto escurece onde a imagem era escura, e o
     papel continua sendo o fundo da seção. */
  inkDark: [0.06, 0.06, 0.05],
  inkLight: [0.34, 0.34, 0.31],
  heroSize: [1, 1],
  heroOffset: [0, 0],
  shapeSize: [1, 1],
  shapeOffset: [0, 0],
  /* Longe da tela: sem cursor, ninguém é empurrado. */
  mouse: [1e5, 1e5],
  heroZoom: 1,
  /* O rótulo da bombona, no espaço de `aHero`: centro da foto em x, um sexto
     abaixo dele em y. É para lá que a câmera anda antes de a foto se desfazer. */
  heroFocus: [-0.005, -0.16],
  order: 0.78,
  shatter: 2.1,
});

/* ------------------------------------------------ o compasso da cena */

/* Tudo em fração da cena inteira. Mexer num número é mexer no ritmo todo, e é
   por isso que eles moram juntos aqui em cima em vez de espalhados pela linha
   do tempo. */

/** Onde cada morph começa, e quanto dura.

    A proporção é o ponto: o morph ocupa 0,20 e a parada entre um e outro fica
    em 0,05. A travessia é o espetáculo, a parada é só o respiro para ler — o
    contrário disso é uma cena em que se rola muito esperando, e a troca passa
    num átimo quando enfim vem. O primeiro começa quase no alto, ainda dentro
    do zoom: a foto tem de se despedaçar enquanto se aproxima. */
const MORPH = [0.035, 0.28, 0.51, 0.74];
const RUN = 0.2;

/** A copy entra no começo do morph, não no fim: quem lê acompanha a forma se
    montando em vez de esperar por ela. */
const TEXT_IN = MORPH.map((at, i) => (i === 0 ? 0.15 : at + 0.05));

/* O último morph fecha em 0,94 e a cena ainda corre até o fim: é o único
   trecho parado que importa, porque é onde o atalho do produto aparece. */
const TEXT_OUT = MORPH.slice(1);

/** Quantas etapas da rota estão acesas ao fim de cada morph. */
const LIT = [0, 1, 3, 5];

/** Espera a primeira folga do navegador, com teto. */
const idle = (timeout = 600) =>
  new Promise<void>((resolve) => {
    if (typeof requestIdleCallback === "function") requestIdleCallback(() => resolve(), { timeout });
    else setTimeout(resolve, 200);
  });

export function Origin({ children }: { children: React.ReactNode }) {
  const { origin } = useContent().aminosanB;
  const scope = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      const surface = canvas.current;
      const stage = root?.querySelector<HTMLElement>(".og-stage");
      const hero = root?.querySelector<HTMLElement>(".og-hero");
      if (!root || !surface || !stage || !hero) return;

      /* O caminho sem movimento: a cena vira seções empilhadas com o
         pontilhado desenhado uma vez, e o trilho da rota aparece inteiro no
         fim. Serve tanto a `prefers-reduced-motion` quanto ao aparelho sem
         WebGL2 — ver o bloco .og-still em globals.css. */
      const goStill = () => {
        root.classList.add("og-still");
        root.querySelectorAll(".og-pill").forEach((pill) => pill.classList.add("is-on"));
        const rail = root.querySelector<HTMLElement>(".og-rail");
        rail?.style.setProperty("--draw", "0");
        rail?.style.setProperty("--draw2", "0");
        const clouds = shapeClouds(9000);
        const frames = root.querySelectorAll<HTMLCanvasElement>(".og-frame");
        const paint = () =>
          frames.forEach((frame, i) => {
            if (clouds[i]) paintStill(frame, clouds[i], "#22221c");
          });
        paint();
        const ro = new ResizeObserver(paint);
        frames.forEach((frame) => ro.observe(frame));
        ScrollTrigger.refresh();
        return () => ro.disconnect();
      };

      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { animate } = context.conditions as { animate: boolean };
          if (!animate) return goStill();

          const u = uniforms();
          const narrow = window.matchMedia(NARROW).matches;
          let field: Field | null = null;
          let heroAspect = 2752 / 1536;
          let visible = true;
          let alive = true;
          let gui: { destroy(): void } | null = null;
          let splits: SplitText[] = [];
          /* A linha do tempo nasce depois, num `await`, e por isso **fora** do
             contexto do useGSAP — quem a recolhe é a limpeza aqui embaixo, na
             mão. Sem isso o ScrollTrigger dela sobrevive à navegação. */
          let timeline: gsap.core.Timeline | null = null;
          const target: [number, number] = [1e5, 1e5];

          /* ------------------------------------------------ geometria */

          /* Refaz o enquadramento da foto e a escala das formas. O `cover`
             repete o que o CSS faz com as duas camadas do hero — inclusive o
             object-position, que muda de faixa para faixa de largura. Sem
             isso o crossfade daria um salto de escala. */
          const fit = () => {
            if (!field) return;
            const w = stage.clientWidth;
            const h = stage.clientHeight;
            field.resize(w, h, Math.min(window.devicePixelRatio || 1, 2));

            const posY = window.innerWidth >= 861 && window.innerWidth <= 1599 ? 0.6 : 1;
            const box = cover(heroAspect * 1000, 1000, w, h, 0.5, posY);
            u.heroSize = box.size;
            u.heroOffset = box.offset;

            /* A foto de verdade tem de aproximar pelo mesmo ponto que a nuvem,
               ou as duas descolam justamente no quadro em que se cruzam. Daí a
               origem da transformação sair do mesmo foco, convertida para a
               caixa do palco. */
            const fx = w / 2 + u.heroFocus[0] * box.size[0] + box.offset[0];
            const fy = h / 2 - (u.heroFocus[1] * box.size[1] + box.offset[1]);
            hero.style.transformOrigin = `${fx}px ${fy}px`;
            /* A máscara que come a foto de fora para dentro parte do mesmo
               ponto — ver o bloco .og-hero em globals.css. */
            hero.style.setProperty("--og-fx", `${fx}px`);
            hero.style.setProperty("--og-fy", `${fy}px`);

            /* Duas colunas no desktop: o desenho à direita, maior, e a copy
               na coluna da esquerda. No celular não há coluna: o desenho sobe
               e a copy fica no pé, com o véu entre os dois. */
            const columns = window.matchMedia(TWO_COLUMN).matches;
            const side = columns ? Math.min(w * 0.52, h * 0.86) : Math.min(w * 0.94, h * 0.42);
            u.shapeSize = [side, side];
            u.shapeOffset = columns ? [w * 0.19, h * 0.02] : [0, h * 0.3];
          };

          /* ---------------------------------------------------- quadro */

          /* Um relógio só, o do GSAP — a regra do SmoothScroll. O cursor é
             perseguido aqui, e não no evento, para o afastamento ter inércia
             e voltar sozinho quando o ponteiro sai. */
          let homed = false;
          const tick = (time: number) => {
            if (!field || !visible) return;
            u.mouse[0] += (target[0] - u.mouse[0]) * 0.12;
            u.mouse[1] += (target[1] - u.mouse[1]) * 0.12;

            /* A foto acompanha o zoom da nuvem pelo mesmo número, e não por um
               tween paralelo: dois tempos para um movimento só é exatamente
               como as duas descolariam no meio do crossfade. */
            if (u.heroZoom !== 1) hero.style.transform = `scale(${u.heroZoom})`;

            field.render(u, time);
          };

          const onMove = (event: PointerEvent) => {
            const box = stage.getBoundingClientRect();
            target[0] = event.clientX - box.left - box.width / 2;
            target[1] = box.height / 2 - (event.clientY - box.top);
            if (homed) return;
            homed = true;
            u.mouse[0] = target[0];
            u.mouse[1] = target[1];
          };
          const onLeave = () => {
            homed = false;
            target[0] = 1e5;
            target[1] = 1e5;
            u.mouse[0] = 1e5;
            u.mouse[1] = 1e5;
          };

          /* Fora da viewport, e em aba escondida, não se desenha nada. */
          const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
            rootMargin: "20% 0px",
          });
          io.observe(root);
          const onVisibility = () => {
            visible = !document.hidden && visible;
          };

          const ro = new ResizeObserver(fit);
          ro.observe(stage);

          /* ------------------------------------------- a linha do tempo */

          /* Montada depois das fontes, e não na montagem do componente: o
             SplitText mede linha por linha, e medir com a fonte de recurso
             quebra o título no lugar errado — que é onde ele fica preso até o
             fim da cena. */
          const build = () => {
            const rail = root.querySelector<HTMLElement>(".og-rail");
            const pills = gsap.utils.toArray<HTMLElement>(".og-pill");
            const texts = gsap.utils.toArray<HTMLElement>(".og-text");
            const heads = gsap.utils.toArray<HTMLElement>(".og-head");
            splits = heads.map((head) => new SplitText(head, { type: "lines", mask: "lines" }));

            /* O trilho não é tween de largura: é um número que o quadro lê,
               para a barra andar no compasso do scrub e as pastilhas
               acenderem exatamente quando ela passa por elas. */
            const route = { lit: 0 };

            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: stage,
                start: "top top",
                end: "+=800%",
                scrub: 0.7,
                pin: true,
                anticipatePin: 1,
                /* Esta cena é a primeira da página mas é criada por último —
                   ela espera o véu e as fontes. Sem prioridade, o refresh do
                   ScrollTrigger mede as outras seções antes de existir o
                   espaçador deste pin, e todas elas ficam com posição de uma
                   página sete telas mais curta: o vídeo do Meet chega a
                   travar por cima desta cena, ainda no meio dela. */
                refreshPriority: 1,
              },
              onUpdate: () => {
                /* O traço do SVG anda por `stroke-dashoffset`: 1 é a linha
                   inteira escondida, 0 é ela toda desenhada. */
                rail?.style.setProperty("--draw", `${1 - route.lit / pills.length}`);
                pills.forEach((pill, k) => pill.classList.toggle("is-on", route.lit > k + 0.001));
              },
            });

            /* 1. A aproximação é discreta e lenta — um empurrãozinho de
                  câmera, não um mergulho —, e continua correndo enquanto a
                  foto já se despedaça por cima dela. */
            tl.to(u, { heroZoom: 1.14, duration: 0.18, ease: "power1.inOut" }, 0)
              /* 2. Os pontos entram cedo, com as cores da foto, e a foto sai
                    por baixo *enquanto* eles já estão partindo: é isso que faz
                    a imagem parecer despedaçada em vez de trocada. */
              .to(u, { opacity: 1, duration: 0.04 }, 0.012)
              /* A foto é comida de fora para dentro, no mesmo sentido em que
                 as partículas partem — e não esmaecida por igual, que é o que
                 denunciava a troca. */
              .fromTo(hero, { "--og-r": 140 }, { "--og-r": -30, duration: 0.115, ease: "power1.in" }, 0.045)
              /* 3. A cor escorre para grafite enquanto a foto se quebra. */
              .to(u, { saturation: 0, duration: 0.13, ease: "power1.inOut" }, 0.06)
              .to(".og-scrim", { opacity: 1, duration: 0.05 }, 0.09)
              /* 4. O trilho nasce uma vez e fica. */
              .fromTo(rail, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.05 }, 0.18);

            MORPH.forEach((at, i) => {
              /* Linear de propósito. Quem suaviza é cada partícula, dentro do
                 shader; uma curva aqui em cima concentraria o movimento no
                 meio do trecho e a troca voltaria a parecer um estalo. */
              tl.to(u, { phase: i + 1, duration: RUN, ease: "none" }, at);
              if (i > 0) tl.to(route, { lit: LIT[i], duration: RUN, ease: "power1.inOut" }, at);

              const text = texts[i];
              const split = splits[i];
              tl.fromTo(text, { opacity: 0 }, { opacity: 1, duration: 0.02 }, TEXT_IN[i]);
              /* O título sobe linha a linha por trás da máscara; o resto do
                 bloco vem atrás, num gesto só. */
              tl.fromTo(
                split.lines,
                { yPercent: 115 },
                { yPercent: 0, duration: 0.05, stagger: 0.008, ease: "power3.out" },
                TEXT_IN[i],
              );
              tl.fromTo(
                text.querySelectorAll(".og-fade"),
                { opacity: 0, y: 18 },
                { opacity: 1, y: 0, duration: 0.045, stagger: 0.006, ease: "power2.out" },
                TEXT_IN[i] + 0.012,
              );
              if (i < TEXT_OUT.length) {
                tl.to(text, { opacity: 0, y: -20, duration: 0.03, ease: "power2.in" }, TEXT_OUT[i]);
              }
            });

            /* O atalho fecha a comparação, no último painel. */
            tl.fromTo(".og-short", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.04 }, MORPH[3] + 0.06)
              /* A seta do atalho se desenha, como a fila de cima: é a mesma
                 gramática, e é o que faz a comparação ser lida como uma só. */
              .fromTo(".og-short", { "--draw2": 1 }, { "--draw2": 0, duration: 0.05 }, MORPH[3] + 0.08);

            /* Um respiro com o aminoácido parado antes de soltar a seção. */
            tl.to({}, { duration: 0.05 }, 0.95);

            timeline = tl;
            ScrollTrigger.refresh();
          };

          /* ----------------------------------------------- a nuvem */

          /* Trocar a densidade recarrega os buffers do campo que já existe.
             Refazer o campo seria refazer o contexto do canvas, e um canvas
             que já devolveu o contexto não dá outro. */
          const start = async (count: number) => {
            const built = await buildField(count, narrow);
            if (!alive) return;
            if (field) {
              field.update(built.data);
            } else {
              field = createField(surface, built.data);
              if (!field) {
                goStill();
                timeline?.scrollTrigger?.kill();
                timeline?.kill();
                timeline = null;
                return;
              }
            }
            heroAspect = built.heroAspect;
            fit();
          };

          void (async () => {
            /* Depois do véu: a linha do tempo só é útil quando a página
               destrava, e é aí também que as fontes já chegaram. */
            await whenBooted();
            if (!alive) return;
            await document.fonts?.ready;
            if (!alive) return;
            build();
            /* Amostrar dezenas de milhares de pontos em cinco estados é
               trabalho de main thread; a folga evita trancar a entrada do
               hero, que é justamente o que o leitor está olhando. */
            await idle();
            if (!alive) return;
            try {
              await start(narrow ? COUNT.narrow : COUNT.wide);
            } catch {
              if (alive) goStill();
            }
          })();

          gsap.ticker.add(tick);
          window.addEventListener("pointermove", onMove, { passive: true });
          window.addEventListener("pointerleave", onLeave, { passive: true });
          document.addEventListener("visibilitychange", onVisibility);
          ScrollTrigger.addEventListener("refresh", fit);

          /* ------------------------------------------ painel de ajuste */

          /* Só em desenvolvimento. A comparação com NODE_ENV é eliminada no
             build de produção, e com ela o import do lil-gui. */
          if (process.env.NODE_ENV !== "production") {
            /* Como `gsap` e `ScrollTrigger` no lib/gsap: em desenvolvimento os
               uniforms ficam no console, para conferir um número sem ter de
               achar o controle certo no painel.

               `originScene`, e não `origin`: `window.origin` é propriedade do
               próprio navegador — a URL da página — e sobrescrevê-la quebra
               quem a lê para montar endereço. */
            Object.assign(window, { originScene: u });

            void import("lil-gui").then(({ default: GUI }) => {
              if (!alive) return;
              const panel = new GUI({ title: "Origin — partículas" });
              gui = panel;
              const density = { count: narrow ? COUNT.narrow : COUNT.wide };
              const paper = { color: "#F4F2EC" };

              const cloud = panel.addFolder("Nuvem");
              cloud.add(density, "count", 5_000, 120_000, 1_000).onFinishChange((n: number) => {
                void start(n);
              });
              cloud.add(u, "size", 0.2, 3, 0.01);
              cloud.add(u, "burst", 0, 300, 5).name("dispersão");
              cloud.add(u, "stagger", 0, 0.9, 0.01);

              const breakup = panel.addFolder("Fragmentação");
              breakup.add(u, "order", 0, 1, 0.01).name("de fora p/ dentro");
              breakup.add(u, "shatter", 0.5, 5, 0.1).name("violência");

              const life = panel.addFolder("Movimento");
              life.add(u, "noise", 0, 40, 0.5).name("deriva");
              life.add(u, "flow", 0, 0.6, 0.005).name("velocidade");
              life.add(u, "orbit", 0, 3, 0.02).name("órbita");
              life.add(u, "halo", 0, 500, 5).name("halo");

              const pointer = panel.addFolder("Cursor");
              pointer.add(u, "push", 0, 200, 1).name("afastamento");
              pointer.add(u, "mouseRadius", 40, 500, 5).name("raio");

              const color = panel.addFolder("Cores");
              color.addColor(u, "inkDark").name("grafite escuro");
              color.addColor(u, "inkLight").name("grafite claro");
              color
                .addColor(paper, "color")
                .name("papel")
                .onChange((v: string) => {
                  root.style.backgroundColor = v;
                });

              /* A cena é escrita pelo scroll; estes controles valem enquanto
                 ele está parado, o que basta para achar um número. */
              const scene = panel.addFolder("Cena (com o scroll parado)");
              scene.add(u, "phase", 0, 4, 0.01).listen();
              scene.add(u, "saturation", 0, 1, 0.01).listen();
              scene.add(u, "heroZoom", 1, 4, 0.01).listen();
            });
          }

          return () => {
            alive = false;
            gsap.ticker.remove(tick);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerleave", onLeave);
            document.removeEventListener("visibilitychange", onVisibility);
            ScrollTrigger.removeEventListener("refresh", fit);
            io.disconnect();
            ro.disconnect();
            timeline?.scrollTrigger?.kill();
            timeline?.kill();
            timeline = null;
            splits.forEach((split) => split.revert());
            gui?.destroy();
            field?.dispose();
            field = null;
            hero.style.transform = "";
          };
        },
      );
    },
    { scope },
  );

  const { panels, route } = origin;

  return (
    <section ref={scope} className="relative bg-[#F4F2EC] text-forest">
      <div className="og-stage relative h-[100svh] min-h-[600px] overflow-hidden">
        <div className="og-hero absolute inset-0 z-0">{children}</div>

        <canvas
          ref={canvas}
          aria-hidden
          className="og-live pointer-events-none absolute inset-0 z-[1] block size-full"
        />

        {/* No celular o pé clareia para a copy ler sobre os pontos. No
            desktop a copy tem coluna própria e o véu não faz falta. */}
        <div
          aria-hidden
          className="og-scrim pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[66%] bg-[linear-gradient(180deg,transparent,#F4F2EC_42%)] opacity-0 lg:hidden"
        />

        <div
          /* O recuo da coluna acompanha o do resto do site: a goteira, ou a
             sobra da largura máxima, o que for maior. */
          style={{
            ["--og-gut" as string]:
              "max(var(--spacing-gut), calc((100vw - var(--container-wrap)) / 2))",
          }}
          className="og-col pointer-events-none absolute inset-x-0 bottom-0 z-[3] px-[var(--spacing-gut)] pb-[clamp(24px,6svh,64px)] lg:inset-x-auto lg:bottom-auto lg:top-1/2 lg:left-[var(--og-gut)] lg:w-[min(40vw,480px)] lg:-translate-y-1/2 lg:px-0 lg:pb-0"
        >
          {/* Os quatro textos ocupam o mesmo lugar, um por vez. A altura é
              reservada para o trilho embaixo não subir e descer a cada troca. */}
          <div className="og-slots relative min-h-[clamp(236px,29svh,310px)]">
            {panels.map((panel) => (
              <article key={panel.eyebrow} className="og-text absolute inset-x-0 top-0 opacity-0">
                {/* Só aparece no caminho estático; no vivo quem desenha é o WebGL. */}
                <canvas aria-hidden className="og-frame" />
                <p className={`${microCaps} og-fade text-olive`}>{panel.eyebrow}</p>
                <h2 className="og-head mt-3 text-[clamp(30px,3.3vw,56px)] leading-[1] tracking-[-0.03em] text-balance">
                  {panel.heading}
                </h2>
                <p className="og-fade mt-4 max-w-[44ch] text-[clamp(14px,1.02vw,17px)] leading-[1.45] text-muted">
                  {panel.body}
                </p>
                <p className={`${microCaps} og-fade mt-4 text-olive/75`}>{panel.caption}</p>
              </article>
            ))}
          </div>

          <Route route={route} />
        </div>
      </div>
    </section>
  );
}

/**
 * O trilho da rota — a comparação que a cena precisava dar de relance, e a
 * única peça que não troca com o scroll.
 *
 * Ele é **SVG**, e não pastilhas de HTML, por causa do gesto: a linha se
 * desenha por `stroke-dashoffset`, continuamente, e cada nó acende no quadro
 * em que o traço passa por ele. Em cima, o caminho que a lavoura percorre;
 * embaixo, no fim, o mesmo caminho pelo produto — uma seta só até a peça
 * pronta. O que se compara é o trajeto do nitrogênio, nunca duas plantas:
 * planta tratada ao lado de testemunha é representação visual de regulador de
 * crescimento, e está proibida no design (02-MERCADO-USA.md).
 */

/* A caixa do desenho. As coordenadas abaixo vivem nela, e o SVG estica para a
   largura da coluna — por isso os textos são `<text>` e não HTML: eles têm de
   acompanhar a mesma escala dos nós. */
const RAIL = { w: 460, h: 44, x0: 22, x1: 438, y: 13 };

function Route({
  route,
}: {
  route: { label: string; steps: string[]; shortcut: { label: string; from: string; note: string } };
}) {
  const { steps, shortcut } = route;
  const end = steps[steps.length - 1];
  const at = (k: number) => RAIL.x0 + ((RAIL.x1 - RAIL.x0) * k) / (steps.length - 1);

  return (
    <div className="og-rail mt-7 border-t border-forest/15 pt-5 opacity-0">
      <p className={`${microCaps} text-forest/45`}>{route.label}</p>

      <svg
        viewBox={`0 0 ${RAIL.w} ${RAIL.h}`}
        className="og-svg mt-3 w-full"
        role="img"
        aria-label={`${route.label}: ${steps.join(" → ")}`}
      >
        <line x1={RAIL.x0} y1={RAIL.y} x2={RAIL.x1} y2={RAIL.y} className="og-track" />
        {/* `pathLength` normaliza o traço para 1, então o deslocamento é a
            própria fração que falta — e o quadro só escreve um número. */}
        <line
          x1={RAIL.x0}
          y1={RAIL.y}
          x2={RAIL.x1}
          y2={RAIL.y}
          className="og-draw"
          pathLength={1}
        />
        {steps.map((step, k) => (
          <g key={step} className="og-pill">
            <circle cx={at(k)} cy={RAIL.y} r={5.5} className="og-node" />
            <text x={at(k)} y={RAIL.h - 6} className="og-tag">
              {step}
            </text>
          </g>
        ))}
      </svg>

      <div className="og-short mt-5 opacity-0">
        <p className={`${microCaps} text-olive`}>{shortcut.label}</p>
        <svg
          viewBox={`0 0 ${RAIL.w} ${RAIL.h}`}
          className="og-svg og-svg--short mt-3 w-full"
          role="img"
          aria-label={`${shortcut.label}: ${shortcut.from} → ${end}`}
        >
          <line
            x1={RAIL.x0}
            y1={RAIL.y}
            x2={RAIL.x1 - 12}
            y2={RAIL.y}
            className="og-draw og-draw--short"
            pathLength={1}
          />
          {/* A ponta da seta, desenhada e não um marker: marker herda mal o
              traço animado em alguns navegadores. */}
          <path
            d={`M${RAIL.x1 - 20} ${RAIL.y - 5} L${RAIL.x1 - 11} ${RAIL.y} L${RAIL.x1 - 20} ${RAIL.y + 5}`}
            className="og-arrow"
          />
          <circle cx={RAIL.x0} cy={RAIL.y} r={6} className="og-node is-on" />
          <circle cx={RAIL.x1} cy={RAIL.y} r={6} className="og-node is-on" />
          <text x={RAIL.x0} y={RAIL.h - 6} className="og-tag is-on" textAnchor="start">
            {shortcut.from}
          </text>
          <text x={RAIL.x1} y={RAIL.h - 6} className="og-tag is-on" textAnchor="end">
            {end}
          </text>
        </svg>
        <p className="mt-3 max-w-[40ch] text-[13px] leading-[1.45] text-muted">{shortcut.note}</p>
      </div>
    </div>
  );
}
