"use client";

import Image from "next/image";
import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { SplitLines } from "@/components/motion/SplitLines";
import { RootZone } from "./RootZone";
import { gsap, useGSAP } from "@/lib/gsap";
import { eyebrow, fix, microCaps } from "./ui";

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
/* No solo, pontos antigos se apagam no lugar: 8 → 7 → 6 → 5 no total. */
const SOIL_STAGES = [
  { count: 8, retire: [] },
  { count: 3, retire: [1, 3, 5, 7] },
  { count: 3, retire: [2, 6, 8, 10] },
  { count: 2, retire: [4, 11, 13] },
];
const bubbleCount = (kind: RouteKind, stage: number) => kind === "soil" ? (SOIL_STAGES[stage]?.count ?? 2) : BUBBLES.length;

/**
 * K7 — Trabalho 1, o centro da página: o potássio, com seção própria e maior,
 * como a hierarquia da Juma pede. Abre pelo porquê (o que o potássio faz na
 * planta, e o 1-1-15 da bombona), desce para o solo (AN-01) e fecha nas duas
 * rotas.
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
  const { potassium, timing } = useContent().kmep;
  const { routes, roles } = potassium;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* Os cartões do porquê: a mesma entrada dos cards da operação. */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".kp-role",
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".kp-role", start: "top 88%", once: true } },
        );
      });

      const build =(tl: gsap.core.Timeline, axis: "scaleX" | "scaleY") => {
        (["soil", "foliar"] as RouteKind[]).forEach((kind) => {
          const nodes = gsap.utils.toArray<HTMLElement>(`.kp-${kind} .kp-node`);
          const segs = gsap.utils.toArray<HTMLElement>(`.kp-${kind} .kp-seg`);
          const brakes = gsap.utils.toArray<HTMLElement>(`.kp-${kind} .kp-brake`);
          const rings = gsap.utils.toArray<SVGPathElement>(`.kp-${kind} .kp-arc`);
          const fills = gsap.utils.toArray<SVGPathElement>(`.kp-${kind} .kp-fill`);
          const allBubbles = gsap.utils.toArray<SVGCircleElement>(`.kp-${kind} .kp-bubble`);
          const spark = `.kp-${kind} .kp-spark`;
          const hand = `.kp-${kind} .kp-hand`;
          const color = kind === "soil" ? "#435630" : "#B7C73E";
          /* O nó apagado: claro no cartão claro, grafite no cartão do KMEP. */
          const off = kind === "soil" ? "#E9EBCB" : "#46483C";
          const n = nodes.length;
          let t = 0;
          nodes.forEach((node, k) => {
            /* O nó não só troca de cor — dá um pequeno solavanco (`back.out`)
               ao acender, como um clique, em vez de só esmaecer de uma cor
               para outra. */
            tl.fromTo(node, { backgroundColor: off, scale: 1 }, { backgroundColor: color, scale: 1.4, duration: 0.16, ease: "back.out(3)" }, t)
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
              /* A faísca que corre na ponta do arco enquanto ele se enche —
                 sem ela o preenchimento é só uma fatia crescendo, seca. */
              .fromTo(spark, { opacity: 1 }, { motionPath: { path: rings[k], alignOrigin: [0.5, 0.5] }, duration: 0.8, ease: "none" }, t)
              .to(spark, { opacity: 0, duration: 0.12, ease: "sine.in" }, t + 0.72);
            if (kind === "soil" && k > 0) {
              tl.to(SOIL_STAGES[k].retire.map((i) => allBubbles[i]), { opacity: 0, duration: 0.35, ease: "sine.inOut" }, t);
            }
            const count = bubbleCount(kind, k);
            const bubbles = gsap.utils.toArray<SVGCircleElement>(`.kp-${kind} .kp-bubble-stage-${k} .kp-bubble`);
            bubbles.forEach((bubble, i) => {
              const { dx, dy } = BUBBLES[i];
              const fraction = (i + 1) / (count + 1);
              tl.fromTo(
                bubble,
                { opacity: 0, x: -dx, y: -dy },
                { opacity: 1, x: dx, y: dy, duration: 0.48, ease: "sine.out" },
                t + 0.8 * fraction + 0.04,
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
             linha horizontal, sem pin. Celular: etapas empilhadas, o traço
             desce (`scaleY`). O corte do layout é o `md:` do JSX (768px). */
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          tablet: "(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)",
          phone: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop, tablet, still } = ctx.conditions as { desktop: boolean; tablet: boolean; still: boolean };
          if (still) {
            build(gsap.timeline({ paused: true }), window.matchMedia("(min-width: 768px)").matches ? "scaleX" : "scaleY").progress(1);
            return;
          }
          const timeline = build(
            gsap.timeline({
              defaults: { ease: "power2.out" },
              scrollTrigger: desktop
                ? { trigger: ".kp-stage", start: "top top", end: "+=90%", scrub: 0.6, pin: true, anticipatePin: 1 }
                : { trigger: ".kp-routes", start: "top 80%", end: "bottom 55%", scrub: 0.6 },
            }),
            desktop || tablet ? "scaleX" : "scaleY",
          );
          if (desktop) {
            timeline.fromTo(".kp-product", { scale: 0.6 }, { scale: 1, duration: timeline.duration(), ease: "none" }, 0);
          } else {
            gsap.fromTo(".kp-product", { scale: 0.6 }, {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: ".kp-product-frame", start: "top 85%", end: "bottom 40%", scrub: 0.6 },
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
    /* A rota foliar é o cartão do KMEP: fundo grafite/preto da marca, com a
       logo dentro. A do solo é um cartão claro e discreto, com a mesma malha —
       as etapas das duas rotas continuam alinhadas coluna a coluna. */
    const dark = kind === "foliar";
    const ink = dark ? "#F6FFEE" : "#16261B";
    const card = dark
      ? "overflow-hidden border border-white/10 bg-linear-[122.93deg,var(--color-night-warm)_2.4%,var(--color-night-deep)_60.23%] text-cream"
      : "border border-forest/12 bg-forest/[0.035]";
    return (
      <div
        className={`kp-${kind} relative grid grid-cols-1 items-start gap-y-5 rounded-[clamp(14px,1.4vw,24px)] px-[clamp(16px,2.4vw,40px)] py-[clamp(18px,2.4svh,32px)] md:grid-cols-[120px_minmax(0,1fr)] md:items-center md:gap-x-8 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-x-10 ${card}`}
      >
        {dark && (
          /* O calor da marca: um brilho vermelho suave no canto da logo. */
          <span
            aria-hidden
            className="pointer-events-none absolute -right-[6%] -bottom-[40%] h-[120%] w-[46%] bg-[radial-gradient(closest-side,rgba(203,53,27,0.24),transparent)] max-md:right-1/2 max-md:h-[70%] max-md:w-[90%] max-md:translate-x-1/2"
          />
        )}
        <div className="relative flex flex-row items-center gap-4 md:flex-col md:items-start md:gap-3">
          <svg viewBox="0 0 100 100" aria-hidden className="w-[58px] shrink-0 md:w-[clamp(72px,11svh,96px)] lg:w-[clamp(72px,11svh,104px)]">
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
            <circle cx={RING.c} cy={RING.c} r={RING.r} fill="none" stroke={ink} strokeOpacity={dark ? 0.16 : 0.1} strokeWidth="7" />
            <circle cx={RING.c} cy={RING.c} r={RING.fillR} fill="none" stroke={ink} strokeOpacity={dark ? 0.09 : 0.06} strokeWidth="19" />
            {fillArcs.map((d) => (
              <path
                key={d}
                className="kp-fill"
                d={d}
                pathLength={1}
                strokeDasharray="1 1"
                fill="none"
                stroke={kind === "soil" ? "#435630" : "#B7C73E"}
                strokeOpacity={kind === "soil" ? 0.22 : 0.38}
                strokeWidth="19"
              />
            ))}
            {ringArcs.map((d) => (
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
            {Array.from({ length: n }, (_, k) => {
              const count = bubbleCount(kind, k);
              return (
                <g key={k} className={`kp-bubble-stage-${k}`}>
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
                        <circle className="kp-bubble" cx={cx} cy={cy} r={size} fill={dark ? "#E2EBA6" : "#435630"} opacity="0" />
                      </g>
                    );
                  })}
                </g>
              );
            })}
            {/* O ponteiro, desenhado no fim do curso. */}
            <line className="kp-hand" x1={RING.c} y1={RING.c} x2={RING.c} y2={RING.c - 30} stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={RING.c} cy={RING.c} r="3.5" fill={ink} />
          </svg>
          <p className={`${eyebrow} text-[10px] lg:text-[11px] ${dark ? "text-sage" : "text-moss"}`}>{data.label}</p>
        </div>

        <ol className="relative flex flex-col md:grid md:grid-cols-4">
          {data.steps.map((step, k) => (
            <li key={step} className="relative pb-6 pl-7 last:pb-0 md:pt-8 md:pr-3 md:pb-0 md:pl-0 lg:pr-4">
              {k < n - 1 && (
                <span className={`absolute top-[12px] left-[5px] h-[calc(100%-2px)] w-[2px] md:top-[5px] md:left-[6px] md:h-[2px] md:w-full ${dark ? "bg-white/15" : "bg-forest/10"}`}>
                  <span
                    className={`kp-seg absolute inset-0 origin-top md:origin-left ${kind === "soil" ? "bg-olive" : "bg-lime"}`}
                  />
                  {kind === "soil" && (
                    <span
                      aria-hidden
                      className="kp-brake absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-[3px] md:rotate-90"
                    >
                      <span className="block h-[2px] w-3.5 bg-kmep" />
                      <span className="block h-[2px] w-3.5 bg-kmep" />
                    </span>
                  )}
                </span>
              )}
              <span
                className="kp-node absolute top-[2px] left-0 size-3 rounded-full border-2 md:top-0"
                style={{ borderColor: kind === "soil" ? "#435630" : "#6E7D44", backgroundColor: kind === "soil" ? "#435630" : "#B7C73E" }}
              />
              <p className="font-display text-[clamp(16px,1.35vw,21px)] leading-[1.15] tracking-[-0.01em] text-balance">{step}</p>
            </li>
          ))}
        </ol>
        {dark && (
          /* Celular: linha própria, centrada, embaixo das etapas. A partir do
             tablet: no vão livre à direita das duas etapas, centrada na altura
             do cartão e limitada por ela — o tamanho vem da ALTURA (o aspecto
             fixa a largura), então numa tela baixa a logo encolhe em vez de
             encostar na borda. */
          <div className="kp-product-frame relative mx-auto mt-1 aspect-[800/397] w-[min(78%,280px)] md:absolute md:top-1/2 md:right-[clamp(20px,2.4vw,40px)] md:mx-0 md:mt-0 md:h-[min(60%,170px)] md:w-auto md:-translate-y-1/2 lg:h-[min(74%,170px)]">
            <Image
              src="/img/kmep/kmep-ultra-logo.webp"
              alt={timing.logoAlt}
              fill
              sizes="(min-width: 1024px) 340px, (min-width: 768px) 260px, 280px"
              quality={90}
              className="kp-product object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.5)]"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <section ref={scope} className="relative overflow-clip bg-white text-forest">
      <div className="wrap grid gap-6 pt-sec lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-end lg:gap-16">
        <div>
          <p className={`${eyebrow} text-moss`}>{potassium.label}</p>
          <SplitLines className="mt-4 max-w-[17ch] text-[clamp(34px,4vw,72px)] leading-[0.97] tracking-[-0.035em] text-balance">
            {potassium.heading}
          </SplitLines>
        </div>
        <p className={`${microCaps} text-[12px] text-forest/75`}>{potassium.body}</p>
      </div>

      {/* Por que o potássio importa (agronomia do nutriente, não efeito do
          produto) e, no último cartão, o que vai na bombona. */}
      <div className="wrap mt-[clamp(36px,5vw,72px)]">
        <p className={`${eyebrow} text-moss`}>{roles.label}</p>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4">
          {roles.items.map((item, i) => (
            <li
              key={item.title}
              className="kp-role flex flex-col rounded-[clamp(12px,1.05vw,20px)] border border-forest/12 bg-forest/[0.035] p-[clamp(18px,1.8vw,28px)]"
            >
              <p className={`${microCaps} text-[10px] text-moss`}>{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 text-[clamp(21px,1.6vw,27px)] leading-[1.1] tracking-[-0.02em] text-balance">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.5] text-forest/75">{item.body}</p>
            </li>
          ))}
          <li className="kp-role relative flex flex-col overflow-hidden rounded-[clamp(12px,1.05vw,20px)] bg-linear-[122.93deg,var(--color-night-warm)_2.4%,var(--color-night-deep)_60.23%] p-[clamp(18px,1.8vw,28px)] text-cream">
            <span
              aria-hidden
              className="pointer-events-none absolute -right-[20%] -bottom-[30%] h-[80%] w-[80%] bg-[radial-gradient(closest-side,rgba(203,53,27,0.22),transparent)]"
            />
            <p className={`${microCaps} relative text-[10px] text-sage`}>{roles.analysis.label}</p>
            <p className="relative mt-3 font-display text-[clamp(48px,4.4vw,72px)] leading-none tracking-[-0.05em]">
              {roles.analysis.formula}
            </p>
            <dl className="relative mt-auto grid gap-2 pt-6">
              {roles.analysis.rows.map((row) => (
                <div key={row.k} className="flex items-baseline justify-between gap-4 border-t border-cream/15 pt-2">
                  <dt className={`${microCaps} text-[10px] text-cream/70`}>{row.k}</dt>
                  <dd className="font-display text-[18px] tabular-nums tracking-[-0.01em]">{row.v}</dd>
                </div>
              ))}
            </dl>
            <p className={`${microCaps} relative mt-4 text-[10px] text-cream/55`}>{roles.analysis.note}</p>
          </li>
        </ol>
      </div>

      <div className="mt-[clamp(16px,2vw,32px)]">
        <RootZone />
      </div>

      <div className="kp-stage flex min-h-[100svh] flex-col justify-center py-[clamp(40px,7svh,110px)]">
        <div className="wrap">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-16">
            <h3 className="text-[clamp(28px,2.8vw,50px)] leading-[1] tracking-[-0.03em]">{routes.heading}</h3>
            <p className={`${microCaps} text-[12px] text-forest/75`}>{routes.body}</p>
          </div>

          <div className="kp-routes mt-[clamp(28px,4.5svh,56px)] grid gap-[clamp(14px,2.4svh,24px)]">
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
