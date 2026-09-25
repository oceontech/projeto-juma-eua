"use client";

import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { SplitLines } from "@/components/motion/SplitLines";
import { gsap, useGSAP } from "@/lib/gsap";
import { AMINO, eyebrow } from "./ui";

/**
 * Para quem é e para quem não é — o K14 do KMEP, nas cores do Aminosan®: o
 * cartão escuro com os dois anéis girando (azul da faixa, verde da marca),
 * duas colunas separadas por um fio que se desenha de cima para baixo, os
 * itens entrando alternados. Lima marca o que serve; âmbar, o que não serve,
 * com o texto mais apagado. Qualifica o lead e responde de antemão à objeção
 * de trocar o programa de nitrogênio.
 */
export function Fit() {
  const { fit } = useContent().aminosanB;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const once = { trigger: ".af-cols", start: "top 82%", once: true };
        gsap.fromTo(".af-divider", { scaleY: 0 }, { scaleY: 1, duration: 1.3, ease: "expo.out", scrollTrigger: once });
        gsap.fromTo(".af-yes", { x: -30, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.1, duration: 0.9, scrollTrigger: once });
        gsap.fromTo(".af-no", { x: 30, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.1, duration: 0.9, delay: 0.15, scrollTrigger: once });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="bg-white pb-sec text-forest">
      <div className="wrap">
        <div className="relative isolate overflow-hidden rounded-[clamp(20px,2vw,36px)] bg-night px-[clamp(20px,3.6vw,64px)] py-[clamp(32px,4.2vw,68px)] text-offwhite ring-1 ring-offwhite/10">
          <div aria-hidden className="pointer-events-none absolute -top-[16%] -right-[10%] z-0 size-[clamp(240px,30vw,460px)] opacity-90">
            <svg viewBox="0 0 100 100" className="size-full origin-center animate-spin motion-reduce:animate-none [animation-duration:32s]">
              <circle cx="50" cy="50" r="46" fill="none" strokeWidth="3" strokeLinecap="round" strokeDasharray="205 285" stroke="#3E78AE" />
            </svg>
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-[11%] size-[78%] origin-center animate-spin motion-reduce:animate-none [animation-direction:reverse] [animation-duration:22s]"
            >
              <circle cx="50" cy="50" r="40" fill="none" strokeWidth="4.5" strokeLinecap="round" strokeDasharray="150 264" stroke={AMINO.green} />
            </svg>
          </div>

          <div className="relative z-10">
            <SplitLines className="text-[clamp(26px,3vw,52px)] leading-[0.95] tracking-[-0.04em]">{fit.heading}</SplitLines>

            <div className="af-cols relative mt-[clamp(28px,3.6vw,52px)] grid gap-10 lg:grid-cols-2 lg:gap-0">
              <span aria-hidden className="af-divider absolute top-0 left-1/2 hidden h-full w-px origin-top bg-offwhite/20 lg:block" />

              <div className="lg:pr-[clamp(28px,3.6vw,64px)]">
                <p className={`${eyebrow} flex items-center gap-3 text-lime`}>
                  <span aria-hidden className="grid size-5 place-items-center rounded-full bg-lime text-forest">
                    <svg viewBox="0 0 16 16" className="size-3">
                      <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {fit.fits.label}
                </p>
                <p className="mt-4 font-display text-[clamp(12px,0.95vw,14px)] text-offwhite/60">{fit.fits.lead}</p>
                <ul className="mt-3">
                  {fit.fits.items.map((item) => (
                    <li key={item} className="af-yes border-b border-offwhite/15 py-4 font-display text-[clamp(15px,1.3vw,20px)] leading-[1.12] tracking-[-0.02em]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-offwhite/20 pt-9 lg:border-t-0 lg:pt-0 lg:pl-[clamp(28px,3.6vw,64px)]">
                <p className={`${eyebrow} flex items-center gap-3`} style={{ color: "#E9A15B" }}>
                  <span aria-hidden className="grid size-5 place-items-center rounded-full text-offwhite" style={{ backgroundColor: AMINO.amber }}>
                    <svg viewBox="0 0 16 16" className="size-2.5">
                      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                    </svg>
                  </span>
                  {fit.notFit.label}
                </p>
                <p className="mt-4 font-display text-[clamp(12px,0.95vw,14px)] text-offwhite/40">{fit.notFit.lead}</p>
                <ul className="mt-3">
                  {fit.notFit.items.map((item) => (
                    <li
                      key={item}
                      className="af-no border-b border-offwhite/10 py-4 font-display text-[clamp(15px,1.3vw,20px)] leading-[1.12] tracking-[-0.02em] text-offwhite/35"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-[clamp(32px,4vw,56px)] border-t-2 pt-[clamp(18px,2.2vw,28px)]" style={{ borderColor: AMINO.blue }}>
              <p className="max-w-[34ch] font-display text-[clamp(16px,1.6vw,26px)] leading-[1.15] tracking-[-0.03em]">
                {fit.close[0]} <span className="text-offwhite/55">{fit.close[1]}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
