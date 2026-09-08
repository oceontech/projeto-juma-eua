"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, START } from "@/lib/gsap";
import { Pill, Rule, SectionIntro } from "@/components/ui";
import { trialStrip } from "@/content/home";

/**
 * O método da faixa de teste, em três passos ligados por conectores.
 *
 * Os conectores são desenhados como se estivessem sendo traçados: o GSAP
 * anima o stroke-dashoffset dos SVGs conforme a seção entra. É o tipo de
 * coisa que HTML estático não fazia sem escrever o controle de scroll na mão.
 */
export function TrialStrip() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference) and (min-width: 861px)",
          still: "(prefers-reduced-motion: reduce), (max-width: 860px)",
        },
        (context) => {
          const { animate } = context.conditions as { animate: boolean };
          if (!animate) return;

          gsap.fromTo(
            "[data-step]",
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.18,
              scrollTrigger: { trigger: root.current, start: START, once: true },
            },
          );

          gsap.fromTo(
            "[data-link]",
            { opacity: 0, scale: 0.9 },
            {
              opacity: 1,
              scale: 1,
              stagger: 0.18,
              delay: 0.3,
              scrollTrigger: { trigger: root.current, start: START, once: true },
            },
          );
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="method"
      data-nav-theme="dark"
      className="bg-green-deep py-[clamp(70px,9.4vw,180px)] text-white"
    >
      <div className="wrap">
        <div className="mb-[clamp(20px,3.3vw,63px)] flex items-center gap-[clamp(12px,1.2vw,23px)]">
          <Pill>{trialStrip.eyebrow}</Pill>
          <Rule short />
        </div>

        <SectionIntro
          className="mb-[clamp(34px,3.2vw,61px)]"
          aside={<p className="text-offwhite">{trialStrip.body}</p>}
        >
          <h2 className="text-h2 leading-[0.967]">{trialStrip.headline}</h2>
        </SectionIntro>

        <div className="relative grid gap-[22px] min-[861px]:gap-[clamp(18px,3.2vw,61px)]">
          <Image
            data-link
            src="/img/connector-1.svg"
            alt=""
            aria-hidden
            width={380}
            height={375}
            className="pointer-events-none absolute top-[8.3%] left-[48.3%] z-1 w-[27.9%] max-[860px]:hidden"
          />
          <Image
            data-link
            src="/img/connector-2.svg"
            alt=""
            aria-hidden
            width={380}
            height={253}
            className="pointer-events-none absolute top-[48.9%] left-[23.7%] z-1 w-[27.9%] max-[860px]:hidden"
          />

          {trialStrip.steps.map((step, i) => (
            <article
              key={step.number}
              data-step
              className={`relative z-2 flex w-full items-start gap-[18px] rounded-[clamp(12px,1.05vw,20px)] bg-white p-[clamp(22px,2.6vw,50px)] text-ink min-[861px]:w-[min(670px,100%)] min-[861px]:items-center min-[861px]:gap-[clamp(16px,4vw,75px)] ${
                i === 1 ? "min-[861px]:ml-auto" : ""
              }`}
            >
              <div className="shrink-0">
                <b className="block font-display text-[clamp(34px,4.2vw,80px)] leading-none font-semibold text-ink">
                  {step.number}
                </b>
                <Rule short className="mt-[clamp(6px,0.8vw,15px)]" />
              </div>
              <div>
                <h3 className="mb-[clamp(8px,1.05vw,20px)] text-h3 font-semibold">
                  {step.title}
                </h3>
                <p className="text-small leading-[1.56] text-muted">{step.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
