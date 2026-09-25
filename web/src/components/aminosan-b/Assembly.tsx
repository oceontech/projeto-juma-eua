"use client";

import Image from "next/image";
import { Fragment, useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { SplitLines } from "@/components/motion/SplitLines";
import { gsap, useGSAP } from "@/lib/gsap";
import { AMINO, eyebrow, fix, microCaps } from "./ui";

/* Cada etapa ocupa uma unidade da linha do tempo; cada freio, meia. */
const BRAKE = 0.5;

/* Os mostradores: o ponteiro percorre exatamente o ângulo de cada arco. */
const RING = { c: 50, r: 42, fillR: 29, gap: 5 };
const BUBBLES = [
  { radius: 25, size: 1.7, dx: 2.1, dy: -1.3 },
  { radius: 33, size: 1.4, dx: -1.8, dy: 1.5 },
  { radius: 28, size: 1.9, dx: 1.5, dy: 1.6 },
  { radius: 23, size: 1.4, dx: -1.4, dy: -1.3 },
  { radius: 31, size: 1.8, dx: 1.8, dy: -1.2 },
  { radius: 26, size: 1.5, dx: -1.6, dy: 1.4 },
  { radius: 35, size: 1.4, dx: 1.2, dy: 1.5 },
  { radius: 29, size: 1.7, dx: -1.4, dy: -1.1 },
  { radius: 24, size: 1.3, dx: 1.5, dy: -1.3 },
];
const ringPoint = (deg: number, radius: number): [number, number] => {
  const rad = (deg * Math.PI) / 180;
  return [fix(RING.c + radius * Math.cos(rad)), fix(RING.c + radius * Math.sin(rad))];
};
function arcs(n: number, radius = RING.r) {
  return Array.from({ length: n }, (_, k) => {
    const a0 = -90 + (360 * k) / n + RING.gap;
    const a1 = -90 + (360 * (k + 1)) / n - RING.gap;
    const [x0, y0] = ringPoint(a0, radius);
    const [x1, y1] = ringPoint(a1, radius);
    return `M${x0} ${y0} A${radius} ${radius} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
  });
}
/* A marca de custo no mostrador da planta: na folga entre dois arcos. */
function notch(k: number, n: number) {
  const deg = -90 + (360 * k) / n;
  const rad = (deg * Math.PI) / 180;
  const at = (r: number) => [fix(RING.c + r * Math.cos(rad)), fix(RING.c + r * Math.sin(rad))];
  const [x1, y1] = at(RING.r - 7);
  const [x2, y2] = at(RING.r + 7);
  return { x1, y1, x2, y2 };
}

type RouteKind = "crop" | "aminosan";
/* Na rota da planta, a energia rareia a cada conversão: cinco pontos no
   primeiro arco, um no último. Na do Aminosan®, os dois arcos cheios. */
const ENERGY = [5, 4, 3, 2, 1];
const bubbleCount = (kind: RouteKind, stage: number) => (kind === "crop" ? (ENERGY[stage] ?? 1) : BUBBLES.length);

const TONE = {
  crop: { on: "#435630", off: "#E9EBCB", fill: "#435630", fillOpacity: 0.22 },
  aminosan: { on: AMINO.blue, off: "#DDE4EC", fill: AMINO.blue, fillOpacity: 0.16 },
};

/* A fórmula do cartão, com as setas no âmbar das conversões. */
function Formula({ text }: { text: string }) {
  return text.split("→").map((part, i) => (
    <Fragment key={i}>
      {i > 0 && (
        <span aria-hidden className="mx-[0.28em] text-[0.8em]" style={{ color: AMINO.amber }}>
          →
        </span>
      )}
      {part.trim()}
    </Fragment>
  ));
}

/**
 * A4 — "Nitrogênio não é aminoácido" e "Cinco etapas, ou uma", no lugar do
 * Problem e do Converge (que contavam a mesma rota duas vezes, e a cena de
 * partículas já contava uma terceira).
 *
 * Abre pelo que o nitrato é (A3) e pelo que a planta faz com ele, em três
 * cartões com a química em corpo grande. Depois as duas rotas, lado a lado,
 * no desenho do AN-02 do KMEP: a da planta tem cinco etapas, um freio âmbar
 * em cada conversão e a energia rareando no mostrador; a do Aminosan® é o
 * cartão branco com a faixa azul do rótulo e chega ao aminoácido na segunda
 * coluna, enquanto a outra ainda está no nitrito. Os mostradores contam
 * etapas, não horas.
 *
 * Fecha na frase do A1, em máscara.
 */
export function Assembly() {
  const { assembly } = useContent().aminosanB;
  const { routes, steps } = assembly;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".as-step",
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".as-steps", start: "top 85%", once: true } },
        );
        gsap.fromTo(
          ".as-formula",
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            stagger: 0.14,
            duration: 1.1,
            delay: 0.25,
            ease: "power3.inOut",
            scrollTrigger: { trigger: ".as-steps", start: "top 85%", once: true },
          },
        );
      });

      const build = (tl: gsap.core.Timeline, axis: "scaleX" | "scaleY") => {
        (["crop", "aminosan"] as RouteKind[]).forEach((kind) => {
          const nodes = gsap.utils.toArray<HTMLElement>(`.as-${kind} .as-node`);
          const segs = gsap.utils.toArray<HTMLElement>(`.as-${kind} .as-seg`);
          const brakes = gsap.utils.toArray<HTMLElement>(`.as-${kind} .as-brake`);
          const rings = gsap.utils.toArray<SVGPathElement>(`.as-${kind} .as-arc`);
          const fills = gsap.utils.toArray<SVGPathElement>(`.as-${kind} .as-fill`);
          const spark = `.as-${kind} .as-spark`;
          const hand = `.as-${kind} .as-hand`;
          const { on, off } = TONE[kind];
          const n = nodes.length;
          let t = 0;
          nodes.forEach((node, k) => {
            /* O nó dá um pequeno solavanco ao acender, como um clique. */
            tl.fromTo(node, { backgroundColor: off, scale: 1 }, { backgroundColor: on, scale: 1.4, duration: 0.16, ease: "back.out(3)" }, t)
              .to(node, { scale: 1, duration: 0.3, ease: "power2.out" }, t + 0.16)
              .fromTo(node.nextElementSibling, { opacity: 0.35 }, { opacity: 1, duration: 0.3, ease: "sine.out" }, t)
              .fromTo(rings[k], { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: "none" }, t)
              .fromTo(fills[k], { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: "none" }, t)
              .fromTo(
                hand,
                { rotation: (360 * k) / n + RING.gap, svgOrigin: `${RING.c} ${RING.c}` },
                { rotation: (360 * (k + 1)) / n - RING.gap, duration: 0.8, ease: "none", immediateRender: k === 0 },
                t,
              )
              /* A faísca que corre na ponta do arco enquanto ele se enche. */
              .fromTo(spark, { opacity: 1 }, { motionPath: { path: rings[k], alignOrigin: [0.5, 0.5] }, duration: 0.8, ease: "none" }, t)
              .to(spark, { opacity: 0, duration: 0.12, ease: "sine.in" }, t + 0.72);
            const count = bubbleCount(kind, k);
            gsap.utils.toArray<SVGCircleElement>(`.as-${kind} .as-bubbles-${k} .as-bubble`).forEach((bubble, i) => {
              const { dx, dy } = BUBBLES[i];
              tl.fromTo(
                bubble,
                { opacity: 0, x: -dx, y: -dy },
                { opacity: 1, x: dx, y: dy, duration: 0.48, ease: "sine.out" },
                t + 0.8 * ((i + 1) / (count + 1)) + 0.04,
              );
            });
            if (k === n - 1) return;
            if (brakes[k]) {
              tl.fromTo(brakes[k], { opacity: 0.25, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.22, ease: "back.out(2)" }, t + 0.8);
              t += BRAKE;
            }
            tl.fromTo(segs[k], { [axis]: 0 }, { [axis]: 1, duration: 0.8, ease: "none" }, t + 0.2);
            t += 1;
            tl.to(hand, { rotation: (360 * (k + 1)) / n + RING.gap, duration: 0.2, ease: "none" }, t - 0.2);
          });
        });
        return tl;
      };

      mm.add(
        {
          /* Desktop: linha do tempo horizontal, presa num pin. Tablet: a mesma
             linha, sem pin. Celular: etapas empilhadas, o traço desce. */
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          tablet: "(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)",
          phone: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop, tablet, phone, still } = ctx.conditions as { desktop: boolean; tablet: boolean; phone: boolean; still: boolean };
          if (still) {
            build(gsap.timeline({ paused: true }), window.matchMedia("(min-width: 768px)").matches ? "scaleX" : "scaleY").progress(1);
            return;
          }
          const timeline = build(
            gsap.timeline({
              defaults: { ease: "power2.out" },
              scrollTrigger: desktop
                ? { trigger: ".as-stage", start: "top top", end: "+=110%", scrub: 0.6, pin: true, anticipatePin: 1 }
                : phone
                  ? { trigger: ".as-stage", start: "top top", end: "+=180%", scrub: 0.8, pin: true, anticipatePin: 1 }
                  : { trigger: ".as-routes", start: "top 80%", end: "bottom 55%", scrub: 0.6 },
            }),
            desktop || tablet ? "scaleX" : "scaleY",
          );
          if (desktop || phone) {
            timeline.fromTo(".as-product", { scale: 0.6, rotate: -6 }, { scale: 1, rotate: 0, duration: timeline.duration(), ease: "none" }, 0);
          } else {
            gsap.fromTo(".as-product", { scale: 0.6 }, {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: ".as-product-frame", start: "top 85%", end: "bottom 40%", scrub: 0.6 },
            });
          }
        },
      );
    },
    { scope },
  );

  const route = (kind: RouteKind) => {
    const data = routes[kind];
    const n = data.steps.length;
    const ringArcs = arcs(n);
    const fillArcs = arcs(n, RING.fillR);
    const tone = TONE[kind];
    const product = kind === "aminosan";
    /* A rota do Aminosan® é o rótulo da bombona: branco, com a faixa azul
       no topo e o fio verde embaixo dela. A da planta é o cartão claro e
       discreto, com a mesma malha — as etapas continuam alinhadas coluna a
       coluna, e o aminoácido do Aminosan® cai na segunda. */
    const card = product
      ? "overflow-hidden border border-amino/15 bg-white shadow-[0_30px_60px_-34px_rgba(19,71,119,0.45)]"
      : "border border-forest/12 bg-forest/[0.035]";
    return (
      <div
        className={`as-${kind} relative grid grid-cols-1 items-start gap-y-5 rounded-[clamp(14px,1.4vw,24px)] px-[clamp(16px,2.4vw,40px)] py-[clamp(18px,2.4svh,32px)] md:grid-cols-[120px_minmax(0,1fr)] md:items-center md:gap-x-8 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-x-10 ${card}`}
      >
        {product && (
          <>
            <span aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-amino" />
            <span aria-hidden className="absolute inset-x-0 top-1.5 h-[2px]" style={{ backgroundColor: AMINO.green }} />
            <span
              aria-hidden
              className="pointer-events-none absolute -right-[6%] -bottom-[40%] h-[120%] w-[46%] bg-[radial-gradient(closest-side,rgba(19,71,119,0.14),transparent)] max-md:right-1/2 max-md:h-[70%] max-md:w-[90%] max-md:translate-x-1/2"
            />
          </>
        )}
        <div className="relative flex flex-row items-center gap-4 md:flex-col md:items-start md:gap-3">
          <svg viewBox="0 0 100 100" aria-hidden className="w-[58px] shrink-0 md:w-[clamp(72px,11svh,96px)] lg:w-[clamp(72px,11svh,104px)]">
            <defs>
              <filter id={`as-glow-${kind}`} x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="2.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx={RING.c} cy={RING.c} r={RING.r} fill="none" stroke="#16261B" strokeOpacity={0.1} strokeWidth="7" />
            <circle cx={RING.c} cy={RING.c} r={RING.fillR} fill="none" stroke="#16261B" strokeOpacity={0.06} strokeWidth="19" />
            {fillArcs.map((d) => (
              <path
                key={d}
                className="as-fill"
                d={d}
                pathLength={1}
                strokeDasharray="1 1"
                fill="none"
                stroke={tone.fill}
                strokeOpacity={tone.fillOpacity}
                strokeWidth="19"
              />
            ))}
            {ringArcs.map((d) => (
              <path key={d} className="as-arc" d={d} pathLength={1} strokeDasharray="1 1" fill="none" stroke={tone.on} strokeWidth="7" strokeLinecap="butt" />
            ))}
            {!product &&
              Array.from({ length: n - 1 }, (_, k) => <line key={k} {...notch(k + 1, n)} stroke={AMINO.amber} strokeWidth="2.5" />)}
            <circle className="as-spark" r="3" fill={tone.on} filter={`url(#as-glow-${kind})`} opacity="0" />
            {Array.from({ length: n }, (_, k) => {
              const count = bubbleCount(kind, k);
              return (
                <g key={k} className={`as-bubbles-${k}`}>
                  {BUBBLES.slice(0, count).map(({ radius, size }, i) => {
                    const fraction = (i + 1) / (count + 1);
                    const angle = -90 + (360 * k) / n + RING.gap + (360 / n - 2 * RING.gap) * fraction;
                    const [cx, cy] = ringPoint(angle, radius);
                    return (
                      <g
                        key={i}
                        className="kp-bubble-float"
                        style={{ animationDuration: `${2.8 + i * 0.6 + (k % 2) * 0.35}s`, animationDelay: `${-(k * BUBBLES.length + i) * 0.53}s` }}
                      >
                        <circle className="as-bubble" cx={cx} cy={cy} r={size} fill={tone.on} opacity="0" />
                      </g>
                    );
                  })}
                </g>
              );
            })}
            {/* O ponteiro, desenhado no fim do curso. */}
            <line className="as-hand" x1={RING.c} y1={RING.c} x2={RING.c} y2={RING.c - 30} stroke="#16261B" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={RING.c} cy={RING.c} r="3.5" fill="#16261B" />
          </svg>
          <p className={`${eyebrow} text-[10px] lg:text-[11px] ${product ? "text-amino" : "text-moss"}`}>{data.label}</p>
        </div>

        <ol className="relative flex flex-col md:grid md:grid-cols-5">
          {data.steps.map((step, k) => (
            <li key={step} className="relative pb-6 pl-7 last:pb-0 md:pt-8 md:pr-3 md:pb-0 md:pl-0 lg:pr-4">
              {k < n - 1 && (
                <span className="absolute top-[12px] left-[5px] h-[calc(100%-2px)] w-[2px] bg-forest/10 md:top-[5px] md:left-[6px] md:h-[2px] md:w-full">
                  <span className={`as-seg absolute inset-0 origin-top md:origin-left ${product ? "bg-amino" : "bg-olive"}`} />
                  {!product && (
                    <span
                      aria-hidden
                      className="as-brake absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-[3px] md:rotate-90"
                    >
                      <span className="block h-[2px] w-3.5" style={{ backgroundColor: AMINO.amber }} />
                      <span className="block h-[2px] w-3.5" style={{ backgroundColor: AMINO.amber }} />
                    </span>
                  )}
                </span>
              )}
              <span
                className="as-node absolute top-[2px] left-0 size-3 rounded-full border-2 md:top-0"
                style={{ borderColor: tone.on, backgroundColor: tone.on }}
              />
              <p className="font-display text-[clamp(16px,1.35vw,21px)] leading-[1.15] tracking-[-0.01em] text-balance">{step}</p>
            </li>
          ))}
        </ol>
        {product && (
          /* Celular: linha própria, centrada, embaixo das etapas. A partir do
             tablet: no vão livre à direita das duas etapas, com o tamanho
             vindo da altura do cartão. */
          <div className="as-product-frame relative mx-auto mt-1 aspect-[1004/392] w-[min(78%,280px)] md:absolute md:top-1/2 md:right-[clamp(20px,2.4vw,40px)] md:mx-0 md:mt-0 md:h-[min(52%,130px)] md:w-auto md:-translate-y-1/2 lg:h-[min(62%,140px)]">
            <Image
              src="/img/aminosan-b/aminosan-logo.webp"
              alt={routes.logoAlt}
              fill
              sizes="(min-width: 1024px) 360px, (min-width: 768px) 280px, 280px"
              quality={90}
              className="as-product object-contain"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="assembly" ref={scope} className="relative overflow-clip bg-white text-forest">
      <div className="wrap grid gap-6 pt-sec lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-end lg:gap-16">
        <div>
          <p className={`${eyebrow} text-moss`}>{assembly.label}</p>
          <SplitLines className="mt-4 max-w-[15ch] text-[clamp(38px,4.6vw,84px)] leading-[0.95] tracking-[-0.04em] text-balance">
            {assembly.heading}
          </SplitLines>
        </div>
        <p className={`${microCaps} text-[12px] text-forest/75`}>{assembly.body}</p>
      </div>

      {/* O que a planta faz com o nitrato: a química em corpo grande, uma
          conversão por cartão. É fisiologia da planta, não efeito do produto. */}
      <div className="wrap mt-[clamp(40px,5vw,80px)]">
        <p className={`${eyebrow} text-moss`}>{steps.label}</p>
        <ol className="as-steps mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {steps.items.map((item, i) => (
            <li
              key={item.title}
              className="as-step relative flex flex-col overflow-hidden rounded-[clamp(12px,1.05vw,20px)] border border-forest/12 bg-forest/[0.035] p-[clamp(14px,1.8vw,28px)] max-md:first:col-span-2"
            >
              <p className={`${microCaps} text-[10px] text-moss`}>{String(i + 1).padStart(2, "0")}</p>
              <p className="as-formula mt-[clamp(20px,2.4vw,40px)] font-display text-[clamp(20px,2.2vw,38px)] leading-[1.1] tracking-[-0.03em] md:whitespace-nowrap">
                <Formula text={item.formula} />
              </p>
              <h3 className="mt-[clamp(20px,2.4vw,40px)] border-t border-forest/12 pt-4 text-[clamp(21px,1.6vw,27px)] leading-[1.1] tracking-[-0.02em]">
                {item.title}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.5] text-forest/75">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="as-stage flex min-h-[100svh] flex-col justify-center py-[clamp(40px,7svh,110px)]">
        <div className="wrap">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-end lg:gap-16">
            <h3 className="text-[clamp(32px,3.4vw,62px)] leading-[0.96] tracking-[-0.035em]">{routes.heading}</h3>
            <p className={`${microCaps} text-[12px] text-forest/75`}>{routes.body}</p>
          </div>

          <div className="as-routes mt-[clamp(28px,4.5svh,56px)] grid gap-[clamp(14px,2.4svh,24px)]">
            {route("crop")}
            {route("aminosan")}
          </div>

          <p className={`${microCaps} mt-8 flex items-center gap-3 text-[10px] text-forest/65 lg:text-[11px]`}>
            <span aria-hidden className="flex flex-col gap-[3px]">
              <span className="block h-[2px] w-3.5" style={{ backgroundColor: AMINO.amber }} />
              <span className="block h-[2px] w-3.5" style={{ backgroundColor: AMINO.amber }} />
            </span>
            {routes.cost}
          </p>
        </div>
      </div>

      <div className="wrap pb-sec">
        <SplitLines
          as="p"
          stagger={0.12}
          className="max-w-[30ch] font-display text-[clamp(28px,3.4vw,62px)] leading-[1.02] tracking-[-0.03em] text-balance"
        >
          {assembly.quote}
        </SplitLines>
      </div>
    </section>
  );
}
