"use client";

import { useEffect, useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { microCaps } from "./ui";

/**
 * Dentro da folha: continua o mergulho do "Meet", que termina com a calda
 * chegando à folha. Aqui a câmera entra nela — folha, células, vesículas —
 * numa lente de microscópio presa na tela, enquanto o texto rola ao lado
 * em três etapas.
 *
 * O vídeo (5,5 s, 25 qps) vive como quadros num canvas, tocado pelo scroll.
 * Os três trechos não têm a mesma duração no original — as células passam
 * em 0,4 s —, então cada um anda preso ao seu bloco de texto: o tempo é
 * redistribuído para que cada imagem fique na tela enquanto o seu texto é
 * lido.
 */

const FRAMES = 138;
const DIR = "/video/aminosan-b/cell";

/* Quadro de início de cada etapa no vídeo: zoom na folha, células,
   vesículas. O último é o fim da sequência. */
const CUTS = [0, 70, 88, FRAMES - 1];

/* Bolhas do fundo: posição, tamanho e quanto andam com o scroll. Ecoam as
   vesículas do vídeo. */
const BUBBLES = [
  { x: "6%", y: "12%", s: 120, d: -160 },
  { x: "38%", y: "4%", s: 54, d: -90 },
  { x: "88%", y: "18%", s: 90, d: -220 },
  { x: "14%", y: "58%", s: 70, d: -120 },
  { x: "46%", y: "72%", s: 150, d: -260 },
  { x: "80%", y: "64%", s: 48, d: -80 },
  { x: "92%", y: "88%", s: 110, d: -180 },
  { x: "4%", y: "90%", s: 40, d: -70 },
];

export function Cell() {
  const { cell } = useContent().aminosanB;
  const scope = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const frames = useRef<(HTMLImageElement | null)[]>([]);
  const current = useRef(0);

  const draw = (i: number) => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    /* O padrão do canvas amplia com a interpolação mais barata; o quadro
       quase sempre é esticado para a tela, e é aí que ele borrava. */
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const ready = (k: number) => {
      const f = frames.current[k];
      return f && f.complete && f.naturalWidth ? f : null;
    };
    let img: HTMLImageElement | null = null;
    for (let d = 0; d < FRAMES && !img; d++) img = ready(i - d) ?? ready(i + d);
    if (!img) return;
    const { width: w, height: h } = el;
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  };

  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        frames.current = Array.from({ length: FRAMES }, (_, i) => {
          const img = new Image();
          img.decoding = "async";
          img.onload = () => {
            if (Math.abs(i - current.current) <= 4) draw(current.current);
          };
          img.src = `${DIR}/${String(i + 1).padStart(3, "0")}.webp`;
          return img;
        });
      },
      { rootMargin: "150% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(el.clientWidth * dpr);
      el.height = Math.round(el.clientHeight * dpr);
      draw(current.current);
    };
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const playhead = { frame: 0 };
        /* No celular a leitura acontece abaixo da lente e do esmaecimento,
           no terço de baixo da tela: é ali que cada etapa acende e move o
           vídeo. */
        const wide = window.matchMedia("(min-width: 1024px)").matches;
        const read = wide ? { start: "top 60%", end: "bottom 45%" } : { start: "top 88%", end: "bottom 72%" };
        const active = wide ? { start: "top 62%", end: "bottom 38%" } : { start: "top 86%", end: "bottom 70%" };
        const render = () => {
          const i = Math.round(playhead.frame);
          if (i === current.current) return;
          current.current = i;
          draw(i);
        };

        /* Cada trecho do vídeo anda enquanto o seu texto atravessa a tela:
           a imagem troca junto com a etapa, qualquer que seja a altura de
           cada bloco. */
        gsap.utils.toArray<HTMLElement>(".cl-stage").forEach((stage, s) => {
          gsap.fromTo(
            playhead,
            { frame: CUTS[s] },
            {
              frame: CUTS[s + 1],
              ease: "none",
              immediateRender: false,
              onUpdate: render,
              scrollTrigger: { trigger: stage, ...read, scrub: 0.5 },
            },
          );
        });
        gsap.to(".cl-ring", {
          rotation: 120,
          ease: "none",
          scrollTrigger: { trigger: ".cl-text", ...read, scrub: 0.5 },
        });

        /* A etapa em leitura acende; as outras ficam em segundo plano. */
        gsap.utils.toArray<HTMLElement>(".cl-stage").forEach((stage) => {
          ScrollTrigger.create({
            trigger: stage,
            ...active,
            toggleClass: { targets: stage, className: "is-active" },
          });
          gsap.from(stage.querySelectorAll(".cl-in"), {
            y: 40,
            opacity: 0,
            stagger: 0.08,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: stage, start: wide ? "top 75%" : "top 90%", once: true },
          });
        });

        /* As bolhas sobem em velocidades diferentes. */
        gsap.utils.toArray<HTMLElement>(".cl-bubble").forEach((bubble, i) => {
          gsap.to(bubble, {
            y: BUBBLES[i].d,
            ease: "none",
            scrollTrigger: { trigger: scope.current, start: "top bottom", end: "bottom top", scrub: true },
          });
        });

        /* A lente abre ao entrar. */
        gsap.fromTo(
          ".cl-lens",
          { scale: 0.7, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: scope.current, start: "top 85%", end: "top 25%", scrub: 0.5 },
          },
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        current.current = CUTS[1] + 4;
        draw(current.current);
        scope.current?.querySelectorAll(".cl-stage").forEach((stage) => stage.classList.add("is-active"));
      });

      const redraw = () => draw(current.current);
      ScrollTrigger.addEventListener("refresh", redraw);
      return () => ScrollTrigger.removeEventListener("refresh", redraw);
    },
    { scope },
  );

  return (
    <section
      id="inside-leaf"
      ref={scope}
      className="relative overflow-clip bg-[#E9EBCB] text-forest lg:bg-[linear-gradient(180deg,#EEF0D8_0%,#E3E5BC_55%,#D4D9A6_100%)]"
    >
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(120px,18vw,260px)] bg-gradient-to-b from-cream to-cream/0" />
      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[clamp(120px,18vw,260px)] bg-gradient-to-t from-cream to-cream/0" />
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          aria-hidden
          className="cl-bubble pointer-events-none absolute rounded-full border border-olive/20 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.55),rgba(255,255,255,0)_60%)] shadow-[inset_0_-6px_14px_rgba(67,86,48,0.12)]"
          style={{ left: b.x, top: b.y, width: b.s, height: b.s }}
        />
      ))}

      <div className="wrap relative grid gap-x-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)]">
        {/* A lente: presa no meio da tela no desktop. No celular ela fica
            numa faixa presa no topo, com fundo liso da mesma cor da seção,
            que vai do topo da tela (o respiro do header incluso) até abaixo
            da lente: o texto some por trás dela em vez de aparecer no vão
            acima. Embaixo, um esmaecimento na mesma cor dissolve o texto
            antes que ele encoste na lente. Por isso o fundo da seção é liso
            no celular — um degradê mudaria de tom sob uma faixa parada. */}
        <div className="sticky top-0 z-10 -mx-[var(--spacing-gut)] self-start bg-[#E9EBCB] pt-[clamp(40px,5svh,52px)] pb-3 lg:order-last lg:mx-0 lg:bg-transparent lg:p-0">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-full h-[clamp(84px,12svh,120px)] bg-[linear-gradient(180deg,#E9EBCB_0%,rgba(233,235,203,0.92)_40%,rgba(233,235,203,0)_100%)] lg:hidden"
          />
          <div className="flex h-[min(44svh,88vw)] items-center justify-center lg:h-[100svh]">
            <div className="cl-lens relative aspect-square h-full max-h-[min(560px,80svh)]">
              <canvas
                ref={canvas}
                aria-label={cell.alt}
                role="img"
                className="absolute inset-[7%] h-[86%] w-[86%] rounded-full bg-[#C9CE8E] shadow-[0_30px_60px_-20px_rgba(22,38,27,0.45),inset_0_0_0_1px_rgba(255,255,255,0.4)]"
              />
              {/* Anel graduado, como a borda de uma ocular. */}
              <svg viewBox="0 0 200 200" aria-hidden className="cl-ring absolute inset-0 h-full w-full text-olive/50">
                <circle cx="100" cy="100" r="97" fill="none" stroke="currentColor" strokeWidth="0.6" />
                {Array.from({ length: 72 }, (_, t) => (
                  <line
                    key={t}
                    x1="100"
                    y1="3"
                    x2="100"
                    y2={t % 6 === 0 ? 9 : 6}
                    stroke="currentColor"
                    strokeWidth={t % 6 === 0 ? 0.9 : 0.5}
                    transform={`rotate(${t * 5} 100 100)`}
                  />
                ))}
              </svg>
            </div>
          </div>
        </div>

        <div className="cl-text relative pt-6 pb-[clamp(56px,10svh,120px)] lg:pt-[20svh] lg:pb-[30svh]">
          <p className={`${microCaps} text-moss`}>{cell.eyebrow}</p>
          {cell.stages.map((stage) => (
            <article
              key={stage.kicker}
              className="cl-stage flex min-h-[64svh] flex-col justify-center opacity-30 transition-opacity duration-500 [&.is-active]:opacity-100 motion-reduce:opacity-100 lg:min-h-[80svh]"
            >
              <p className={`cl-in ${microCaps} text-moss`}>{stage.kicker}</p>
              {"value" in stage && stage.value && (
                <p className="cl-in mt-3 font-display text-[clamp(88px,10vw,180px)] leading-[0.82] tracking-[-0.05em] text-olive">
                  {stage.value}
                </p>
              )}
              <h3 className="cl-in mt-4 max-w-[16ch] text-[clamp(30px,3.2vw,56px)] leading-[1] tracking-[-0.03em]">
                {stage.title}
              </h3>
              <p className={`cl-in ${microCaps} mt-5 max-w-[44ch] text-[12px] text-forest/75`}>{stage.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
