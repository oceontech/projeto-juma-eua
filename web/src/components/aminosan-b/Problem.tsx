"use client";

import Image from "next/image";
import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { Counter } from "@/components/motion/Counter";
import { microCaps } from "./ui";

/* Centros dos cards (% do palco), formando uma curva em U (onda) dentro da esfera, com folga para o movimento. */
const CARD_POS: [number, number][] = [
  [30, 24],
  [32, 51],
  [50, 74],
  [68, 51],
  [70, 24],
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
          ".pb-bar",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.3,
            ease: "power3.out",
            scrollTrigger: { trigger: ".pb-caption", start: "top 90%", once: true },
          },
        );

        gsap.from(".pb-caption > *:not(.pb-bar)", {
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 1,
          scrollTrigger: { trigger: ".pb-caption", start: "top 90%", once: true },
        });

        gsap.utils.toArray<HTMLElement>(".pb-step").forEach((card, i) => {
          gsap.to(card, {
            y: i % 2 ? 5 : -5,
            x: i % 2 ? -3 : 3,
            duration: 3 + i * 0.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: -i * 0.8,
          });
        });

        gsap.to(".pb-sphere", { rotation: 360, duration: 90, ease: "none", repeat: -1 });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="relative grid bg-cream lg:min-h-[100svh]">
      <div className="pb-panel relative flex flex-col items-center justify-center text-center px-[var(--spacing-gut)] py-[clamp(56px,7vw,110px)] text-forest lg:px-[clamp(40px,5vw,96px)]">
        <div className="flex items-start justify-center gap-5 text-left">
          <Counter
            to={problem.stat.value}
            className="font-display text-[clamp(96px,10vw,180px)] leading-[0.8] tracking-[-0.05em] text-forest"
          />
          <p className="max-w-[18ch] pt-2 font-display text-[clamp(22px,2vw,34px)] leading-[1.08] tracking-[-0.02em]">
            {problem.stat.heading}
          </p>
        </div>
        <p className={`${microCaps} mt-6 text-forest/55`}>{problem.stat.source}</p>

        <div className="mt-8 grid w-full lg:grid-cols-[minmax(0,1fr)_minmax(0,860px)_minmax(0,1fr)] lg:items-center lg:gap-8">
<div className="pb-vee relative mx-auto mt-8 lg:col-start-2 lg:row-start-1 aspect-[10/7.6] w-full max-w-[860px]">
          <div className="pb-sphere absolute top-[2%] left-1/2 aspect-square w-[62%] -translate-x-1/2 will-change-transform">
            <Image
              src="/img/aminosan/leaf-sphere.webp"
              alt=""
              fill
              sizes="(min-width: 1024px) 40vw, 80vw"
              quality={90}
              className="object-contain mix-blend-multiply"
            />
          </div>

          <ol>
            {problem.chain.map((step, i) => {
              const last = i === problem.chain.length - 1;
              const [x, y] = CARD_POS[i];
              return (
                <li
                  key={step.name}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  className={`pb-step absolute flex min-w-[62px] -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-[clamp(10px,1.05vw,20px)] border px-[clamp(8px,1.6vw,28px)] py-[clamp(6px,1.2vw,20px)] sm:min-w-[88px] text-center shadow-[0_8px_30px_-12px_rgba(22,38,27,0.35)] backdrop-blur-md ${last ? "border-forest/30 bg-lime/45" : "border-forest/15 bg-cream/45"}`}
                >
                  <span className="font-display text-[clamp(13px,1.7vw,28px)] leading-none tracking-[-0.01em]">{step.formula}</span>
                  <span className="mt-1.5 text-[clamp(7px,0.7vw,10px)] tracking-[0.12em] text-forest/70 uppercase">{step.name}</span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="pb-caption mt-4 flex w-fit flex-col items-center self-center justify-self-center lg:col-start-1 lg:row-start-1 lg:mt-0 lg:items-start lg:justify-self-start lg:self-center lg:text-left">
          <span aria-hidden className="pb-bar mb-6 block h-[2px] w-[92%] origin-left bg-forest" />
          <h2 className="max-w-[16ch] text-[clamp(30px,3vw,52px)] leading-[0.98] tracking-[-0.03em]">
            {problem.image.heading}
          </h2>
          <p className={`${microCaps} mt-5 max-w-[46ch] text-forest/75`}>{problem.image.body}</p>
        </div>
        </div>
      </div>
    </section>
  );
}
