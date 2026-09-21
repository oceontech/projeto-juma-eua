"use client";

import { useEffect, useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Cta, Mark, microCaps } from "./ui";

/**
 * O mergulho do Aminosan: um vídeo de 20 s, tocado pelo scroll, em que a
 * dose sai da bombona, cai na água do tanque, a câmera mergulha, a calda se
 * desfaz em partículas e sobe até a folha. O texto muda por etapa, no
 * compasso da cena.
 *
 * O vídeo vive como sequência de quadros num canvas, não como <video> com
 * currentTime — o seek de vídeo trava no Safari e dá solavancos em qualquer
 * lugar sem um quadro-chave por quadro. São duas sequências: 16:9 para
 * telas largas e 9:16 para o celular, e só a do aparelho é baixada.
 */

const FRAMES = 240;
const SETS = {
  wide: "/video/aminosan-b/dive/wide",
  tall: "/video/aminosan-b/dive/tall",
} as const;

/* Onde começa cada etapa no vídeo, em fração do todo — casado com a cena:
   o derrame, as ondas e o mergulho, a nuvem submersa, a dissolução em
   partículas e a subida até a folha. A abertura ("Meet Aminosan®") ocupa o
   trecho antes da primeira. */
const STAGE_AT = [0.1, 0.22, 0.42, 0.6, 0.8];
const STAGE_END = [...STAGE_AT.slice(1), 1];

/* Duração das trocas de texto, em fração do vídeo. */
const FADE = 0.035;

/* Ordem de carga: um quadro a cada oito, depois a cada quatro, a cada dois,
   e o resto. O scroll nunca fica sem imagem — no pior caso mostra o quadro
   carregado mais próximo — e a sequência vai ficando fluida sozinha. */
function loadOrder(count: number) {
  const seen = new Set<number>();
  const order: number[] = [];
  for (const step of [8, 4, 2, 1]) {
    for (let i = 0; i < count; i += step) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }
  return order;
}

export function Meet() {
  const { meet } = useContent().aminosanB;
  const scope = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const frames = useRef<(HTMLImageElement | null)[]>([]);
  const current = useRef(0);

  /* Desenha o quadro `i` cobrindo o canvas (object-fit: cover). Se ele ainda
     não chegou, usa o carregado mais próximo, para trás ou para frente. */
  const draw = (i: number) => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
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

  /* Baixa a sequência do aparelho quando a seção se aproxima. */
  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const tall = window.innerWidth < 1024 && window.innerHeight > window.innerWidth;
        const dir = tall ? SETS.tall : SETS.wide;
        frames.current = Array.from({ length: FRAMES }, () => null);
        for (const i of loadOrder(FRAMES)) {
          const img = new Image();
          img.decoding = "async";
          img.onload = () => {
            if (Math.abs(i - current.current) <= 8) draw(current.current);
          };
          img.src = `${dir}/${String(i + 1).padStart(3, "0")}.webp`;
          frames.current[i] = img;
        }
      },
      { rootMargin: "200% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* O canvas acompanha o tamanho da cena, em pixels do aparelho. */
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
        const stages = gsap.utils.toArray<HTMLElement>(".dv-stage");
        const fills = gsap.utils.toArray<HTMLElement>(".dv-fill");
        const marks = gsap.utils.toArray<HTMLElement>(".dv-mark");
        const playhead = { frame: 0 };

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: ".dv-stage-wrap",
            start: "top top",
            end: "+=600%",
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
          },
          /* O indicador lê o tempo da própria linha do tempo — o mesmo, com
             o mesmo atraso do scrub, que move os textos —, sem re-render do
             React: cada barra enche no trecho da sua etapa. */
          onUpdate: () => {
            const p = tl.time();
            fills.forEach((fill, i) => {
              const t = gsap.utils.clamp(0, 1, (p - STAGE_AT[i]) / (STAGE_END[i] - STAGE_AT[i]));
              fill.style.transform = `scaleX(${t})`;
            });
            marks.forEach((mark, i) =>
              mark.classList.toggle("is-on", p >= STAGE_AT[i] && (p < STAGE_END[i] || i === marks.length - 1)),
            );
          },
        });

        /* O vídeo ocupa a linha do tempo inteira: posição 0 a 1. */
        tl.to(
          playhead,
          {
            frame: FRAMES - 1,
            ease: "none",
            duration: 1,
            onUpdate: () => {
              const i = Math.round(playhead.frame);
              if (i === current.current) return;
              current.current = i;
              draw(i);
            },
          },
          0,
        );

        /* Abertura: some quando a primeira etapa chega. */
        tl.to(".dv-intro", { opacity: 0, y: -40, filter: "blur(6px)", duration: FADE }, STAGE_AT[0] - FADE);

        stages.forEach((stage, i) => {
          tl.fromTo(
            stage,
            { opacity: 0, y: 48, filter: "blur(8px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: FADE },
            STAGE_AT[i],
          );
          tl.fromTo(stage.querySelector(".dv-rule"), { scaleX: 0 }, { scaleX: 1, duration: FADE * 1.4 }, STAGE_AT[i]);
          if (i < stages.length - 1) {
            tl.to(
              stage,
              { opacity: 0, y: -36, filter: "blur(8px)", duration: FADE, ease: "power2.in" },
              STAGE_END[i] - FADE,
            );
          }
        });

        /* Um respiro no fim, com a folha parada, antes de soltar a seção. */
        tl.to({}, { duration: 0.06 });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        current.current = FRAMES - 1;
        draw(FRAMES - 1);
      });

      const redraw = () => draw(current.current);
      ScrollTrigger.addEventListener("refresh", redraw);
      return () => ScrollTrigger.removeEventListener("refresh", redraw);
    },
    { scope },
  );

  return (
    <section id="meet" ref={scope} data-nav-theme="dark" className="bg-[#123524] text-cream">
      <div className="dv-stage-wrap relative h-[100svh] overflow-hidden motion-reduce:h-auto motion-reduce:min-h-[100svh]">
        <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full bg-[#123524]" />

        {/* Leitura: sombra no pé no celular, à esquerda no desktop. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,30,20,0.55)_0%,transparent_22%,transparent_50%,rgba(10,30,20,0.88)_100%)] lg:bg-[linear-gradient(90deg,rgba(10,30,20,0.75)_0%,rgba(10,30,20,0.25)_38%,transparent_60%)]"
        />

        {/* Abertura, sobre o derrame. */}
        <div className="dv-intro absolute inset-x-0 bottom-[9%] motion-reduce:hidden lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2">
          <div className="wrap">
            <h2 className="max-w-[10ch] text-[clamp(48px,6.4vw,120px)] leading-[0.92] tracking-[-0.04em]">{meet.heading}</h2>
            <p className={`${microCaps} mt-5 max-w-[34ch] text-cream/85`}>{meet.intro}</p>
            <p className="mt-8 flex items-center gap-3 font-display text-[11px] tracking-[0.18em] text-lime uppercase">
              <span aria-hidden className="block h-8 w-px animate-pulse bg-lime" />
              {meet.scroll}
            </p>
          </div>
        </div>

        {/* As etapas: uma de cada vez, no mesmo lugar. Sem movimento, viram
            uma lista comum sobre o último quadro. */}
        <ol className="motion-reduce:relative motion-reduce:grid motion-reduce:gap-10 motion-reduce:px-[var(--spacing-gut)] motion-reduce:py-24">
          {meet.stages.map((stage, i) => (
            <li
              key={stage.n}
              className="dv-stage absolute inset-x-[var(--spacing-gut)] bottom-[10%] opacity-0 motion-reduce:static motion-reduce:opacity-100 lg:top-1/2 lg:right-auto lg:bottom-auto lg:left-[var(--dv-gut)] lg:w-[min(460px,36vw)] lg:-translate-y-1/2"
              style={{ ["--dv-gut" as string]: "max(var(--spacing-gut), calc((100vw - var(--container-wrap)) / 2))" }}
            >
              <Mark className="text-lime" />
              <span aria-hidden className="dv-rule mt-5 block h-px w-full origin-left bg-cream/45" />
              <p className="mt-5 font-display text-[13px] tracking-[0.18em] text-lime">
                {stage.n} <span className="text-cream/50">/ 0{meet.stages.length}</span>
              </p>
              <h3 className="mt-2 text-[clamp(34px,3.6vw,64px)] leading-[0.98] tracking-[-0.03em]">{stage.title}</h3>
              <p className={`${microCaps} mt-4 max-w-[38ch] text-[12px] text-cream/90`}>{stage.body}</p>
              {i === meet.stages.length - 1 && (
                <Cta href={meet.cta.href} className="mt-7">
                  {meet.cta.label}
                </Cta>
              )}
            </li>
          ))}
        </ol>

        {/* Indicador: barras no topo no celular (como stories), coluna à
            direita no desktop. Cada barra enche no trecho da sua etapa. */}
        <div
          aria-hidden
          className="absolute inset-x-[var(--spacing-gut)] top-[clamp(76px,11svh,96px)] flex gap-1.5 motion-reduce:hidden lg:inset-x-auto lg:top-1/2 lg:right-[var(--dv-gut)] lg:w-[150px] lg:-translate-y-1/2 lg:flex-col lg:gap-4"
          style={{ ["--dv-gut" as string]: "max(var(--spacing-gut), calc((100vw - var(--container-wrap)) / 2))" }}
        >
          {meet.stages.map((stage) => (
            <div key={stage.n} className="dv-mark group flex-1 lg:flex lg:items-center lg:gap-3">
              <span className="hidden font-display text-[12px] tracking-[0.14em] text-cream/45 transition-colors duration-300 group-[.is-on]:text-lime lg:block">
                {stage.n}
              </span>
              <span className="relative block h-[2px] flex-1 overflow-hidden bg-cream/20">
                <span className="dv-fill absolute inset-0 origin-left scale-x-0 bg-lime" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
