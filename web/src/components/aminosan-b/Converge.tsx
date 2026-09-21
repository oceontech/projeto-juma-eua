"use client";

import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { SplitLines } from "@/components/motion/SplitLines";
import { Cta, microCaps } from "./ui";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "size-28",
  "aria-hidden": true,
} as const;

/* Um ícone por card, cada um num canto diferente. */
const CARD_ICONS = [
  // molécula única (aminoácido livre)
  <svg key="free" {...iconProps}>
    <circle cx="12" cy="12" r="3" />
    <circle cx="5" cy="6" r="1.8" />
    <circle cx="19" cy="7" r="1.8" />
    <circle cx="17" cy="19" r="1.8" />
    <path d="M9.8 10.2 6.4 7.3M14.8 10.8l2.9-2.6M13.5 14.3l2.2 3.2" />
  </svg>,
  // folha
  <svg key="plant" {...iconProps}>
    <path d="M5 19C5 10 10 5 20 4c0 10-5 15-13 15" />
    <path d="M5 19 14 10" />
  </svg>,
  // gota cortada (sem hormônio)
  <svg key="hormone" {...iconProps}>
    <path d="M12 3.5c3 3.6 5.5 6.4 5.5 9.5a5.5 5.5 0 0 1-11 0c0-3.1 2.5-5.9 5.5-9.5Z" />
    <path d="M4 4l16 16" />
  </svg>,
];

const CARD_ICON_POS = ["-top-6 -right-6", "-top-6 -left-6", "-bottom-6 -right-6"];

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
const COUNT = 140;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

/* Esferas metálicas: brilho especular no alto à esquerda, corpo na cor da
   marca, sombra no lado oposto e uma borda um pouco mais clara (luz
   refletida), que é o que vende o volume. */
const SPHERES = {
  lime: [
    [0, "#FCFFE8"],
    [0.14, "#E1EB8C"],
    [0.48, "#B7C73E"],
    [0.86, "#5E6C14"],
    [1, "#87972C"],
  ],
  cream: [
    [0, "#FFFFFF"],
    [0.14, "#F8F6F0"],
    [0.48, "#D6D2C3"],
    [0.86, "#817C6B"],
    [1, "#ABA694"],
  ],
  forest: [
    [0, "#A9BDAE"],
    [0.14, "#52695A"],
    [0.48, "#1E3224"],
    [0.86, "#08110B"],
    [1, "#223629"],
  ],
} as const;

/* Destino: filotaxia, o arranjo das sementes do girassol — um cacho que
   parece crescido, não desenhado. Origem: espalhados pela cena toda. */
const DOTS = (() => {
  const rand = seeded(7);
  return Array.from({ length: COUNT }, (_, i) => {
    const radius = 21 * Math.sqrt(i + 0.5);
    const angle = i * GOLDEN;
    const r = Math.max(4, 13 - i * 0.065) + rand() * 3;
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

          /* Com a cena presa, o fundo desliza por trás do título: ele nasce
             escuro sobre a parte clara e vira creme só na metade final do
             pin, quando o degradê já escureceu atrás dele. */
          if (desktop) {
            gsap.fromTo(
              ".cv-heading",
              { color: "#16261B" },
              {
                color: "#EEEBE0",
                ease: "none",
                scrollTrigger: {
                  trigger: scope.current,
                  start: () => `top top-=${window.innerHeight * 0.6}`,
                  end: () => `top top-=${window.innerHeight * 0.95}`,
                  scrub: true,
                },
              },
            );
          }

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

          /* Deriva contínua: cada bolinha vagueia sem parar em volta do próprio
             lugar. Fica no <g> de fora, então não briga com o scroll acima. */
          gsap.utils.toArray<SVGGElement>(".cv-drift").forEach((g) => {
            gsap.to(g, {
              x: "random(-22, 22)",
              y: "random(-22, 22)",
              duration: "random(2.2, 4.5)",
              ease: "sine.inOut",
              repeat: -1,
              repeatRefresh: true,
              delay: gsap.utils.random(0, 1.5),
            });
          });

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
      className="relative overflow-hidden bg-[linear-gradient(180deg,var(--color-cream)_0%,#A9B283_14%,var(--color-moss)_28%,var(--color-olive)_48%,#26371F_72%,var(--color-forest)_100%)] text-forest"
    >
      <div className="cv-stage relative flex min-h-[100svh] flex-col justify-center py-[clamp(72px,8vw,120px)]">
        <div className="wrap">
          <SplitLines className="cv-heading max-w-[16ch] text-[clamp(34px,3.8vw,68px)] leading-[1] tracking-[-0.03em]">
            {converge.heading}
          </SplitLines>
        </div>

        <div className="wrap relative mt-6 grid items-center gap-10 lg:mt-0 lg:grid-cols-[1fr_320px]">
          <div className="cv-scene">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" aria-hidden>
              <defs>
                {Object.entries(SPHERES).map(([name, stops]) => (
                  <radialGradient key={name} id={`cv-sphere-${name}`} cx="0.42" cy="0.4" r="0.62" fx="0.3" fy="0.26">
                    {stops.map(([offset, color]) => (
                      <stop key={offset} offset={offset} stopColor={color} />
                    ))}
                  </radialGradient>
                ))}
              </defs>
              <g className="cv-cluster">
                {DOTS.map((d, i) => (
                  <g key={i} className="cv-drift">
                    <circle
                      className="cv-dot"
                      cx={d.cx}
                      cy={d.cy}
                      r={d.r}
                      fill={`url(#cv-sphere-${d.tone > 0.7 ? "lime" : d.tone > 0.35 ? "cream" : "forest"})`}
                    />
                  </g>
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
        {converge.cards.map((card, i) => (
          <article
            key={card.title}
            className="cv-card relative flex min-h-44 flex-col overflow-hidden rounded-[clamp(12px,1.05vw,20px)] bg-linear-[122.93deg,var(--color-night-warm)_2.4%,var(--color-night-deep)_60.23%] p-[clamp(20px,1.8vw,28px)] text-offwhite"
          >
            <span
              className={`absolute text-lime ${CARD_ICON_POS[i % CARD_ICON_POS.length]}`}
            >
              {CARD_ICONS[i % CARD_ICONS.length]}
            </span>
            <h3
              className={`mt-auto text-[clamp(20px,1.6vw,26px)] leading-[1.1] tracking-[-0.02em] ${i === 2 ? "pr-20" : ""}`}
            >
              {card.title}
            </h3>
            <p className={`${microCaps} mt-3 text-offwhite/70 ${i === 2 ? "pr-20" : ""}`}>{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
