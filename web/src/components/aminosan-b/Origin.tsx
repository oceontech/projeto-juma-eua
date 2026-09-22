"use client";

import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { booted } from "@/lib/boot";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { buildField, cover, paintStill, shapeClouds } from "@/lib/origin/build";
import { createField, type Field, type Uniforms } from "@/lib/origin/field";
import { microCaps } from "./ui";

/**
 * O hero se desfazendo em partículas, e as duas seções que nascem delas.
 *
 * A cena é uma só, travada em tela cheia, e o scroll é o transporte: as
 * partículas aparecem sobre a foto com as cores dos próprios pixels, a foto
 * esmaece por baixo, a cor escorre para grafite sobre off-white — o estado da
 * referência —, e daí a nuvem se solta e se reorganiza duas vezes: planta de
 * soja, depois molécula de aminoácido. De onde vem e em que forma chega.
 *
 * Este componente **embrulha o hero** (`children`) em vez de vir depois dele.
 * É o que permite travar os dois juntos: a foto precisa continuar no lugar
 * enquanto se desmancha, e um pin que começasse abaixo do hero já o teria
 * empurrado para fora da tela.
 *
 * As partes pesadas moram em `src/lib/origin/`: o pontilhado (sample.ts), as
 * duas formas desenhadas (shapes.ts), a montagem da nuvem (build.ts) e o
 * renderizador WebGL (field.ts).
 */

/* O mesmo corte do hero, que troca a foto e o enquadramento no celular. */
const NARROW = "(max-width: 860px)";

/* Contagem de partículas. O mesmo N vale para os três estados — é o que
   permite morphar sem criar nem destruir nada. */
const COUNT = { wide: 80_000, narrow: 36_000 };

/** Estado inicial dos uniforms. Um objeto novo por montagem: o GSAP escreve nele. */
const uniforms = (): Uniforms => ({
  phase: 0,
  saturation: 1,
  opacity: 0,
  size: 1,
  noise: 5,
  flow: 0.06,
  burst: 90,
  stagger: 0.45,
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
});

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
      if (!root || !surface || !stage) return;

      /* O caminho sem movimento: a cena vira duas seções empilhadas com o
         pontilhado desenhado uma vez. Serve tanto a `prefers-reduced-motion`
         quanto ao aparelho sem WebGL2 — ver o bloco .og-still em globals.css. */
      const goStill = () => {
        root.classList.add("og-still");
        const { plant, mol } = shapeClouds(9000);
        const frames = root.querySelectorAll<HTMLCanvasElement>(".og-frame");
        const paint = () => {
          if (frames[0]) paintStill(frames[0], plant, "#22221c");
          if (frames[1]) paintStill(frames[1], mol, "#22221c");
        };
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

            /* A forma sobe: a copy mora no pé da tela, e o pé da planta não
               pode cair dentro do parágrafo. */
            const small = window.matchMedia(NARROW).matches;
            const side = small ? Math.min(w * 0.94, h * 0.46) : Math.min(w * 0.52, h * 0.68);
            u.shapeSize = [side, side];
            u.shapeOffset = [0, small ? h * 0.18 : h * 0.12];
          };

          /* ---------------------------------------------------- quadro */

          /* Um relógio só, o do GSAP — a regra do SmoothScroll. O cursor é
             perseguido aqui, e não no evento, para o afastamento ter inércia
             e voltar sozinho quando o ponteiro sai. */
          const tick = (time: number) => {
            if (!field || !visible) return;
            u.mouse[0] += (target[0] - u.mouse[0]) * 0.12;
            u.mouse[1] += (target[1] - u.mouse[1]) * 0.12;
            field.render(u, time);
          };

          /* O cursor mora longe enquanto não existe. No primeiro movimento ele
             aparece onde está, em vez de ser perseguido desde o infinito —
             senão a primeira mexida manda uma onda atravessando a cena
             inteira, e a saída do ponteiro manda outra de volta. */
          let homed = false;
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

          /* Tudo em scrub, e portanto reversível: os números vivem no objeto
             `u`, que o quadro lê. Posições em fração da cena inteira.

             0,02 os pontos surgem sobre a foto, com as cores dela
             0,07 a foto esmaece por baixo — as duas se cruzam, sem salto
             0,20 a cor escorre para grafite: é o estado da referência
             0,42 a nuvem se solta e vira a planta de soja
             0,74 morph da planta para a molécula                        */
          const panels = gsap.utils.toArray<HTMLElement>(".og-panel");
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: stage,
              start: "top top",
              end: "+=420%",
              scrub: 0.7,
              pin: true,
              anticipatePin: 1,
            },
          });

          tl.to(u, { opacity: 1, duration: 0.13 }, 0.02)
            .to(".og-hero", { opacity: 0, duration: 0.15 }, 0.07)
            .to(u, { saturation: 0, duration: 0.17, ease: "power1.inOut" }, 0.2)
            .to(u, { phase: 1, duration: 0.26, ease: "power2.inOut" }, 0.42)
            /* O véu do pé só entra com a copy: ligado desde o começo, ele
               clareava o pé da foto no meio do crossfade. */
            .to(".og-scrim", { opacity: 1, duration: 0.08 }, 0.5)
            .fromTo(
              panels[0],
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.06, ease: "power2.out" },
              0.58,
            )
            .to(panels[0], { opacity: 0, y: -26, duration: 0.05, ease: "power2.in" }, 0.72)
            .to(u, { phase: 2, duration: 0.22, ease: "power2.inOut" }, 0.74)
            .fromTo(
              panels[1],
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.06, ease: "power2.out" },
              0.88,
            )
            /* Um respiro com a molécula parada antes de soltar a seção. */
            .to({}, { duration: 0.06 }, 0.94);

          /* ----------------------------------------------- a nuvem */

          const start = async (count: number) => {
            field?.dispose();
            field = null;
            const built = await buildField(count, narrow);
            if (!alive) return;
            field = createField(surface, built.data);
            if (!field) {
              goStill();
              tl.scrollTrigger?.kill();
              return;
            }
            heroAspect = built.heroAspect;
            fit();
          };

          void (async () => {
            /* Depois do véu e da folga: amostrar 64 mil pontos é trabalho de
               main thread, e rodá-lo junto com a entrada do hero trancaria
               justamente a animação que o leitor está olhando. */
            await booted;
            await idle();
            if (!alive) return;
            await document.fonts?.ready;
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
               achar o controle certo no painel. */
            Object.assign(window, { origin: u });

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
              cloud.add(u, "noise", 0, 30, 0.5).name("ruído");
              cloud.add(u, "flow", 0, 0.4, 0.005).name("velocidade");
              cloud.add(u, "burst", 0, 300, 5).name("dispersão");
              cloud.add(u, "stagger", 0, 0.9, 0.01);

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
              scene.add(u, "phase", 0, 2, 0.01).listen();
              scene.add(u, "saturation", 0, 1, 0.01).listen();
              scene.add(u, "opacity", 0, 1, 0.01).listen();
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
            gui?.destroy();
            field?.dispose();
            field = null;
          };
        },
      );
    },
    { scope },
  );

  return (
    <section ref={scope} className="relative bg-[#F4F2EC] text-forest">
      <div className="og-stage relative h-[100svh] min-h-[600px] overflow-hidden">
        <div className="og-hero absolute inset-0 z-0">{children}</div>

        <canvas
          ref={canvas}
          aria-hidden
          className="og-live pointer-events-none absolute inset-0 z-[1] block size-full"
        />

        {/* O pé clareia para a copy ler sobre os pontos. */}
        <div
          aria-hidden
          className="og-scrim pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[46%] bg-[linear-gradient(180deg,transparent,#F4F2EC_68%)] opacity-0"
        />

        {origin.panels.map((panel) => (
          <article key={panel.eyebrow} className="og-panel absolute inset-x-0 bottom-0 z-[3] opacity-0">
            {/* Só aparece no caminho estático; no vivo quem desenha é o WebGL. */}
            <canvas aria-hidden className="og-frame" />
            <div className="wrap pb-[clamp(36px,8svh,88px)]">
              <p className={`${microCaps} text-olive`}>{panel.eyebrow}</p>
              <h2 className="mt-3 max-w-[13ch] text-[clamp(34px,4.4vw,76px)] leading-[0.96] tracking-[-0.03em] text-balance">
                {panel.heading}
              </h2>
              <p className="mt-4 max-w-[46ch] text-[clamp(14px,1.08vw,18px)] leading-[1.45] text-muted">
                {panel.body}
              </p>
              <p className={`${microCaps} mt-5 text-olive/75`}>{panel.caption}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
