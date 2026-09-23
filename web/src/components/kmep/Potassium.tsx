"use client";

import Image from "next/image";
import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { SplitLines } from "@/components/motion/SplitLines";
import { gsap, useGSAP } from "@/lib/gsap";
import { eyebrow, fix, microCaps } from "./ui";

/* Cada etapa ocupa uma unidade da linha do tempo; cada freio, meia. */
const BRAKE = 0.5;

/* Os mostradores: um arco por etapa, com uma folga entre eles. */
const RING = { c: 50, r: 42, gap: 5 };
function arcs(n: number) {
  const point = (deg: number): [number, number] => {
    const rad = (deg * Math.PI) / 180;
    return [fix(RING.c + RING.r * Math.cos(rad)), fix(RING.c + RING.r * Math.sin(rad))];
  };
  return Array.from({ length: n }, (_, k) => {
    const a0 = -90 + (360 * k) / n + RING.gap;
    const a1 = -90 + (360 * (k + 1)) / n - RING.gap;
    const [x0, y0] = point(a0);
    const [x1, y1] = point(a1);
    return `M${x0} ${y0} A${RING.r} ${RING.r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
  });
}
/* A marca de freio no mostrador do solo: na folga entre dois arcos. */
function notch(k: number, n: number) {
  const deg = -90 + (360 * k) / n;
  const rad = (deg * Math.PI) / 180;
  const at = (r: number) => [fix(RING.c + r * Math.cos(rad)), fix(RING.c + r * Math.sin(rad))];
  const [x1, y1] = at(RING.r - 7);
  const [x2, y2] = at(RING.r + 7);
  return { x1, y1, x2, y2 };
}

type RouteKind = "soil" | "foliar";

/**
 * K7 — Trabalho 2. Depois do escuro, o claro: o potássio, com seção própria
 * e maior, como a hierarquia da Juma pede.
 *
 * A cena é AN-02, "duas rotas, dois relógios", presa num pin curto no
 * desktop: as duas rotas avançam em paralelo, etapa por etapa. A do solo tem
 * quatro etapas e um freio em cada passagem (o cobre: tempo que se perde
 * quando o perfil seca); a foliar tem duas e nenhum freio. Os mostradores
 * contam etapas, não horas — a comparação de tempo ("horas em vez de dias")
 * ainda depende do técnico da Juma, então a cena mostra só o que é verdade:
 * mais etapas e mais freios de um lado, menos do outro.
 *
 * Quando as duas completam, a frase do solo entra sozinha, em máscara.
 */
export function Potassium() {
  const { potassium } = useContent().kmep;
  const { routes } = potassium;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      const build = (tl: gsap.core.Timeline, axis: "scaleX" | "scaleY") => {
        (["soil", "foliar"] as RouteKind[]).forEach((kind) => {
          const nodes = gsap.utils.toArray<HTMLElement>(`.kp-${kind} .kp-node`);
          const segs = gsap.utils.toArray<HTMLElement>(`.kp-${kind} .kp-seg`);
          const brakes = gsap.utils.toArray<HTMLElement>(`.kp-${kind} .kp-brake`);
          const rings = gsap.utils.toArray<SVGPathElement>(`.kp-${kind} .kp-arc`);
          const spark = `.kp-${kind} .kp-spark`;
          const hand = `.kp-${kind} .kp-hand`;
          const color = kind === "soil" ? "#435630" : "#B7C73E";
          const n = nodes.length;
          let t = 0;
          nodes.forEach((node, k) => {
            /* O nó não só troca de cor — dá um pequeno solavanco (`back.out`)
               ao acender, como um clique, em vez de só esmaecer de uma cor
               para outra. */
            tl.fromTo(node, { backgroundColor: "#E9EBCB", scale: 1 }, { backgroundColor: color, scale: 1.4, duration: 0.16, ease: "back.out(3)" }, t)
              .to(node, { scale: 1, duration: 0.3, ease: "power2.out" }, t + 0.16)
              .fromTo(node.nextElementSibling, { opacity: 0.35 }, { opacity: 1, duration: 0.3, ease: "sine.out" }, t)
              .fromTo(rings[k], { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: "none" }, t)
              .fromTo(
                hand,
                { rotation: (360 * k) / n, svgOrigin: `${RING.c} ${RING.c}` },
                { rotation: (360 * (k + 1)) / n, duration: 0.8, ease: "none", immediateRender: k === 0 },
                t,
              )
              /* A faísca que corre na ponta do arco enquanto ele se enche —
                 sem ela o preenchimento é só uma fatia crescendo, seca. */
              .fromTo(spark, { opacity: 1 }, { motionPath: { path: rings[k], alignOrigin: [0.5, 0.5] }, duration: 0.8, ease: "none" }, t)
              .to(spark, { opacity: 0, duration: 0.12, ease: "sine.in" }, t + 0.72);
            if (k === n - 1) return;
            if (brakes[k]) {
              tl.fromTo(brakes[k], { opacity: 0.25, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.22, ease: "back.out(2)" }, t + 0.8);
              t += BRAKE;
            }
            tl.fromTo(segs[k], { [axis]: 0 }, { [axis]: 1, duration: 0.8, ease: "none" }, t + 0.2);
            t += 1;
          });
        });
        return tl;
      };

      mm.add(
        {
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop, still } = ctx.conditions as { desktop: boolean; still: boolean };
          if (still) {
            build(gsap.timeline({ paused: true }), desktop ? "scaleX" : "scaleY").progress(1);
            return;
          }
          build(
            gsap.timeline({
              defaults: { ease: "power2.out" },
              scrollTrigger: desktop
                ? { trigger: ".kp-stage", start: "top top", end: "+=90%", scrub: 0.6, pin: true, anticipatePin: 1 }
                : { trigger: ".kp-routes", start: "top 80%", end: "bottom 55%", scrub: 0.6 },
            }),
            desktop ? "scaleX" : "scaleY",
          );
        },
      );
    },
    { scope },
  );

  const route = (kind: RouteKind) => {
    const data = routes[kind];
    const n = data.steps.length;
    return (
      <div
        className={`kp-${kind} grid grid-cols-[76px_minmax(0,1fr)] items-start gap-x-5 gap-y-4 border-t border-forest/15 pt-6 lg:grid-cols-[180px_minmax(0,1fr)] lg:items-center lg:gap-x-10 lg:pt-8`}
      >
        <div className="flex flex-col items-start gap-3">
          <svg viewBox="0 0 100 100" aria-hidden className="w-[64px] lg:w-[104px]">
            <defs>
              {/* O brilho da faísca que corre na ponta do arco enquanto ele
                  se enche. */}
              <filter id={`kp-glow-${kind}`} x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="2.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx={RING.c} cy={RING.c} r={RING.r} fill="none" stroke="#16261B" strokeOpacity="0.1" strokeWidth="7" />
            {arcs(n).map((d) => (
              <path
                key={d}
                className="kp-arc"
                d={d}
                pathLength={1}
                strokeDasharray="1 1"
                fill="none"
                stroke={kind === "soil" ? "#435630" : "#B7C73E"}
                strokeWidth="7"
                strokeLinecap="butt"
              />
            ))}
            {kind === "soil" &&
              Array.from({ length: n - 1 }, (_, k) => (
                <line key={k} {...notch(k + 1, n)} stroke="#CB351B" strokeWidth="2.5" />
              ))}
            <circle
              className="kp-spark"
              r="3"
              fill={kind === "soil" ? "#435630" : "#B7C73E"}
              filter={`url(#kp-glow-${kind})`}
              opacity="0"
            />
            {/* O ponteiro, desenhado no fim do curso. */}
            <line className="kp-hand" x1={RING.c} y1={RING.c} x2={RING.c} y2={RING.c - 30} stroke="#16261B" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={RING.c} cy={RING.c} r="3.5" fill="#16261B" />
          </svg>
          <p className={`${eyebrow} text-[10px] text-moss lg:text-[11px]`}>{data.label}</p>
        </div>

        <ol className="flex flex-col lg:grid lg:grid-cols-4">
          {data.steps.map((step, k) => (
            <li key={step} className="relative pb-6 pl-7 last:pb-0 lg:pt-8 lg:pr-4 lg:pb-0 lg:pl-0">
              {k < n - 1 && (
                <span className="absolute top-[12px] left-[5px] h-[calc(100%-2px)] w-[2px] bg-forest/10 lg:top-[5px] lg:left-[6px] lg:h-[2px] lg:w-full">
                  <span
                    className={`kp-seg absolute inset-0 origin-top lg:origin-left ${kind === "soil" ? "bg-olive" : "bg-lime"}`}
                  />
                  {kind === "soil" && (
                    <span
                      aria-hidden
                      className="kp-brake absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-[3px] lg:rotate-90"
                    >
                      <span className="block h-[2px] w-3.5 bg-kmep" />
                      <span className="block h-[2px] w-3.5 bg-kmep" />
                    </span>
                  )}
                </span>
              )}
              <span
                className="kp-node absolute top-[2px] left-0 size-3 rounded-full border-2 lg:top-0"
                style={{ borderColor: kind === "soil" ? "#435630" : "#6E7D44", backgroundColor: kind === "soil" ? "#435630" : "#B7C73E" }}
              />
              <p className="font-display text-[clamp(16px,1.35vw,21px)] leading-[1.15] tracking-[-0.01em]">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    );
  };

  return (
    <section ref={scope} className="relative overflow-clip bg-[#E9EBCB] text-forest">
      <div className="wrap grid gap-6 pt-sec lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-end lg:gap-16">
        <div>
          <p className={`${eyebrow} text-moss`}>{potassium.label}</p>
          <SplitLines className="mt-4 max-w-[17ch] text-[clamp(34px,4vw,72px)] leading-[0.97] tracking-[-0.035em] text-balance">
            {potassium.heading}
          </SplitLines>
        </div>
        <p className={`${microCaps} text-[12px] text-forest/75`}>{potassium.body}</p>
      </div>

      <div className="wrap mt-[clamp(32px,4vw,56px)]">
        <Image
          src="/img/kmep/potassium-pods.webp"
          alt=""
          width={1774}
          height={887}
          sizes="(min-width: 1024px) 680px, 100vw"
          className="mx-auto h-auto w-full max-w-[680px]"
        />
      </div>

      <div className="kp-stage flex min-h-[100svh] flex-col justify-center py-[clamp(64px,9svh,110px)]">
        <div className="wrap">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-16">
            <h3 className="text-[clamp(28px,2.8vw,50px)] leading-[1] tracking-[-0.03em]">{routes.heading}</h3>
            <p className={`${microCaps} text-[12px] text-forest/75`}>{routes.body}</p>
          </div>

          <div className="kp-routes mt-[clamp(32px,5svh,56px)] grid gap-[clamp(24px,4svh,40px)]">
            {route("soil")}
            {route("foliar")}
          </div>

          <p className={`${microCaps} mt-8 flex items-center gap-3 text-[10px] text-forest/65 lg:text-[11px]`}>
            <span aria-hidden className="flex flex-col gap-[3px]">
              <span className="block h-[2px] w-3.5 bg-kmep" />
              <span className="block h-[2px] w-3.5 bg-kmep" />
            </span>
            {routes.brake}
          </p>
        </div>
      </div>

      <div className="wrap pb-sec">
        <SplitLines
          as="p"
          stagger={0.12}
          className="max-w-[30ch] font-display text-[clamp(28px,3.4vw,62px)] leading-[1.02] tracking-[-0.03em] text-balance"
        >
          {potassium.quote}
        </SplitLines>
      </div>
    </section>
  );
}
