"use client";

import Image from "next/image";
import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { Counter } from "@/components/motion/Counter";
import { microCaps } from "./ui";

/* Traço do pé de milho: caule, quatro pares de folhas, pendão e chão. Cada
   caminho leva pathLength=1, então o desenho anda de 0 a 1 sem medir nada. */
const PLANT = [
  "M200 470 C 200 380, 203 250, 199 70",
  "M200 420 C 160 390, 110 392, 44 432",
  "M200 410 C 244 380, 300 372, 364 402",
  "M201 340 C 160 292, 116 276, 62 284",
  "M201 322 C 244 276, 292 258, 344 262",
  "M200 252 C 176 206, 152 180, 118 164",
  "M200 238 C 226 196, 252 176, 288 160",
  "M199 150 C 192 120, 186 98, 176 70",
  "M199 70 L 188 30 M199 70 L 200 22 M199 70 L 212 30",
  "M24 470 H 376",
  "M70 470 l -8 -18 M78 470 l 2 -22 M318 470 l 6 -20 M330 470 l -4 -14",
];

/**
 * Problema em tela dividida: a foto do milho carrega a frase curta; o painel
 * creme carrega o número e o desenho da planta, que se traça enquanto a
 * seção passa. A cadeia de conversão acende etapa por etapa no mesmo
 * compasso — quatro conversões até o aminoácido, a última em lima.
 */
export function Problem() {
  const { problem } = useContent().aminosanB;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".pb-photo",
          { scale: 1.18, yPercent: -6 },
          {
            scale: 1,
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: scope.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );

        gsap.from(".pb-caption > *", {
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 1,
          scrollTrigger: { trigger: ".pb-caption", start: "top 90%", once: true },
        });

        const draw = gsap.timeline({
          scrollTrigger: { trigger: ".pb-panel", start: "top 70%", end: "bottom 60%", scrub: 0.6 },
        });
        draw
          .fromTo(".pb-plant path", { strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: 0.08, ease: "none" }, 0)
          .fromTo(
            ".pb-step",
            { opacity: 0.25 },
            { opacity: 1, stagger: 0.16, ease: "none" },
            0.1,
          )
          .fromTo(".pb-rail", { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 0.9 }, 0.1);
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="grid bg-cream lg:min-h-[100svh] lg:grid-cols-2">
      <div className="relative min-h-[88svh] overflow-hidden bg-forest text-cream lg:min-h-0">
        <Image
          src="/img/aminosan-b/problem-corn.webp"
          alt={problem.image.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          quality={90}
          className="pb-photo object-cover will-change-transform"
        />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,38,27,0)_40%,rgba(22,38,27,0.88)_100%)]" />
        <div className="pb-caption absolute inset-x-0 bottom-0 p-[var(--spacing-gut)] pb-[clamp(32px,5vw,64px)]">
          <h2 className="max-w-[12ch] text-[clamp(34px,3.6vw,64px)] leading-[0.98] tracking-[-0.03em]">
            {problem.image.heading}
          </h2>
          <p className={`${microCaps} mt-5 max-w-[46ch] text-cream/75`}>{problem.image.body}</p>
        </div>
      </div>

      <div className="pb-panel flex flex-col px-[var(--spacing-gut)] py-[clamp(56px,7vw,110px)] text-forest lg:px-[clamp(40px,5vw,96px)]">
        <div className="flex items-start gap-5">
          <Counter
            to={problem.stat.value}
            className="font-display text-[clamp(96px,10vw,180px)] leading-[0.8] tracking-[-0.05em] text-olive"
          />
          <p className="max-w-[18ch] pt-2 font-display text-[clamp(22px,2vw,34px)] leading-[1.08] tracking-[-0.02em]">
            {problem.stat.heading}
          </p>
        </div>
        <p className={`${microCaps} mt-6 text-forest/55`}>{problem.stat.source}</p>

        <svg
          viewBox="0 0 400 480"
          aria-hidden
          className="pb-plant mx-auto mt-auto w-full max-w-[300px] pt-10 text-moss"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        >
          {PLANT.map((d) => (
            <path key={d} d={d} pathLength={1} strokeDasharray="1" />
          ))}
        </svg>

        <ol className="relative mt-8 grid grid-cols-5 gap-2">
          <span aria-hidden className="pb-rail absolute top-[7px] right-[10%] left-[10%] h-px origin-left bg-forest/30" />
          {problem.chain.map((step, i) => {
            const last = i === problem.chain.length - 1;
            return (
              <li key={step.name} className="pb-step relative flex flex-col items-center text-center">
                <span
                  aria-hidden
                  className={`size-[15px] rounded-full border ${last ? "border-olive bg-lime" : "border-forest/40 bg-cream"}`}
                />
                <span className="mt-3 font-display text-[clamp(15px,1.3vw,20px)] tracking-[-0.01em]">
                  {step.formula}
                </span>
                <span className="mt-1 text-[10px] tracking-[0.12em] text-forest/60 uppercase">{step.name}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
