"use client";

import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { SplitLines } from "@/components/motion/SplitLines";
import { Cta, microCaps } from "./ui";

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

          /* A linha verde acima de cada título se desenha da esquerda para a
             direita, logo depois que o card sobe. */
          gsap.from(".cv-line", {
            scaleX: 0,
            stagger: 0.12,
            duration: 1.1,
            delay: 0.35,
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

      <div className="wrap cv-cards grid grid-cols-2 gap-3 pb-[clamp(56px,7vw,110px)] md:grid-cols-3 md:gap-4">
        {converge.cards.map((card, i) => (
          <article
            key={card.title}
            className={`cv-card relative flex flex-col ${i === 0 ? "col-span-2 md:col-span-1" : ""} overflow-hidden rounded-[clamp(12px,1.05vw,20px)] bg-linear-[122.93deg,var(--color-night-warm)_2.4%,var(--color-night-deep)_60.23%] p-4 text-offwhite md:p-[clamp(20px,1.8vw,28px)]`}
          >
            {/* w-fit: a linha só alcança a largura que o título ocupa. */}
            <div className="max-w-full w-fit">
              <span aria-hidden className="cv-line block h-[2px] w-full origin-left rounded-full bg-lime" />
              <h3 className="mt-3 text-[clamp(20px,1.6vw,26px)] leading-[1.1] tracking-[-0.02em]">{card.title}</h3>
            </div>
            <p className={`${microCaps} mt-3 text-offwhite/70`}>{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
