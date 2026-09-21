"use client";

import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { SplitLines } from "@/components/motion/SplitLines";
import { Cta, Mark, microCaps } from "./ui";

/* Gerador com semente: as posições saem iguais no servidor e no cliente,
   senão a hidratação reclamaria de cada círculo. */
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 1000;
const H = 620;
const COUNT = 72;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

/* Destino: filotaxia, o arranjo das sementes do girassol — um cacho que
   parece crescido, não desenhado. Origem: espalhados pela cena toda. */
const DOTS = (() => {
  const rand = seeded(7);
  return Array.from({ length: COUNT }, (_, i) => {
    const radius = 27 * Math.sqrt(i + 0.5);
    const angle = i * GOLDEN;
    const r = Math.max(7, 22 - i * 0.18) + rand() * 4;
    return {
      cx: +(W / 2 + radius * Math.cos(angle)).toFixed(1),
      cy: +(H / 2 + radius * Math.sin(angle)).toFixed(1),
      r: +r.toFixed(1),
      fromX: +((rand() - 0.5) * W * 1.25).toFixed(1),
      fromY: +((rand() - 0.5) * H * 1.3).toFixed(1),
      fromR: +(0.4 + rand() * 1.1).toFixed(2),
      tone: rand(),
    };
  });
})();

/**
 * "E se a folha recebesse a parte pronta?" — o nitrogênio espalhado se
 * junta num cacho só enquanto a seção passa. No desktop a cena fica presa
 * durante a junção; no celular ela acontece no próprio fluxo do scroll.
 */
export function Converge() {
  const { converge } = useContent().aminosanB;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean };
          const dots = gsap.utils.toArray<SVGCircleElement>(".cv-dot");

          const tl = gsap.timeline({
            scrollTrigger: desktop
              ? { trigger: ".cv-stage", start: "top top", end: "+=110%", scrub: 0.8, pin: true }
              : { trigger: ".cv-scene", start: "top 85%", end: "center 45%", scrub: 0.8 },
          });

          tl.fromTo(
            dots,
            {
              x: (i) => DOTS[i].fromX,
              y: (i) => DOTS[i].fromY,
              scale: (i) => DOTS[i].fromR,
              opacity: 0.55,
              transformOrigin: "50% 50%",
            },
            { x: 0, y: 0, scale: 1, opacity: 1, ease: "power2.inOut", stagger: { each: 0.004, from: "random" } },
          )
            .fromTo(".cv-cluster", { rotation: -40, svgOrigin: `${W / 2} ${H / 2}` }, { rotation: 0, ease: "power1.out" }, 0)
            .fromTo(".cv-aside", { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.35 }, 0.55);

          gsap.from(".cv-card", {
            y: 60,
            opacity: 0,
            stagger: 0.12,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: ".cv-cards", start: "top 88%", once: true },
          });
        },
      );
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      className="relative overflow-hidden bg-[linear-gradient(180deg,var(--color-cream)_0%,#A9B283_20%,var(--color-moss)_38%,var(--color-olive)_72%,#33432A_100%)] text-forest"
    >
      <div className="cv-stage relative flex min-h-[100svh] flex-col justify-center py-[clamp(72px,8vw,120px)]">
        <div className="wrap">
          <SplitLines className="max-w-[16ch] text-[clamp(34px,3.8vw,68px)] leading-[1] tracking-[-0.03em]">
            {converge.heading}
          </SplitLines>
        </div>

        <div className="wrap relative mt-6 grid items-center gap-10 lg:mt-0 lg:grid-cols-[1fr_320px]">
          <div className="cv-scene">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" aria-hidden>
              <g className="cv-cluster">
                {DOTS.map((d, i) => (
                  <circle
                    key={i}
                    className="cv-dot"
                    cx={d.cx}
                    cy={d.cy}
                    r={d.r}
                    fill={d.tone > 0.7 ? "var(--color-lime)" : d.tone > 0.35 ? "var(--color-cream)" : "var(--color-forest)"}
                    fillOpacity={d.tone > 0.35 && d.tone <= 0.7 ? 0.7 : 0.92}
                  />
                ))}
              </g>
            </svg>
          </div>

          <div className="cv-aside text-cream">
            <h3 className="text-[clamp(28px,2.5vw,42px)] leading-[1] tracking-[-0.025em]">
              {converge.aside.heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h3>
            <p className={`${microCaps} mt-4 text-cream/85`}>{converge.aside.body}</p>
            <Cta href={converge.aside.cta.href} className="mt-6">
              {converge.aside.cta.label}
            </Cta>
          </div>
        </div>
      </div>

      <div className="wrap cv-cards grid gap-4 pb-[clamp(56px,7vw,110px)] md:grid-cols-3">
        {converge.cards.map((card) => (
          <article key={card.title} className="cv-card flex min-h-[220px] flex-col bg-cream p-6 text-forest">
            <Mark className="text-olive" />
            <h3 className="mt-auto text-[clamp(20px,1.6vw,26px)] leading-[1.1] tracking-[-0.02em]">{card.title}</h3>
            <p className={`${microCaps} mt-3 text-forest/65`}>{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
