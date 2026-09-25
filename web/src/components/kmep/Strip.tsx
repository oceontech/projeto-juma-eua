"use client";

import Image from "next/image";
import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { SplitLines } from "@/components/motion/SplitLines";
import { gsap, useGSAP } from "@/lib/gsap";
import { Cta, eyebrow, microCaps } from "./ui";

/**
 * K15 — como funciona a faixa de teste. É a resposta operacional para "vocês
 * não têm dado americano": transforma a ausência de dado local na oferta da
 * página. Precisa parecer generosa e concreta, não promocional.
 *
 * A aérea com a faixa testemunha fica no fundo, e os
 * três passos são cartões de vidro sobre ela, em escada. A entrada é a do
 * Season da LP B, presa ao scroll nos dois sentidos: cada cartão sobe de mais
 * baixo quanto mais à direita, e o número anda num compasso próprio,
 * escorregando sobre o cartão.
 */
export function Strip() {
  const { strip } = useContent().kmep;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* Empilhados no celular, cada cartão sobe de perto: com a escada do
           desktop, o terceiro passava por cima da linha de promessa. */
        const wide = window.matchMedia("(min-width: 768px)").matches;
        gsap.utils.toArray<HTMLElement>(".st-card").forEach((card, i) => {
          const trigger = { trigger: card, scrub: 0.6 };
          gsap.fromTo(
            card,
            { y: wide ? 220 + i * 90 : 90, opacity: 0 },
            { y: 0, opacity: 1, ease: "power2.out", scrollTrigger: { ...trigger, start: "top bottom", end: "top 55%" } },
          );
          gsap.fromTo(
            card.querySelector(".st-num"),
            { y: 120, scale: 0.9 },
            { y: 0, scale: 1, ease: "power2.out", scrollTrigger: { ...trigger, start: "top bottom", end: "top 50%" } },
          );
        });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} data-nav-theme="dark" className="relative isolate overflow-hidden bg-forest text-offwhite">
      <div className="absolute inset-0 -z-20">
        <Image src="/img/kmep/trial-strip-close-mobile.webp" alt={strip.alt} fill quality={90} sizes="100vw" className="object-cover md:hidden" />
        <Image src="/img/kmep/trial-strip-close.webp" alt={strip.alt} fill quality={90} sizes="100vw" className="hidden object-cover md:block" />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-black/35 md:bg-[linear-gradient(90deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.2)_48%,transparent_100%)]"
      />

      <div className="wrap pt-sec pb-[clamp(88px,11vw,170px)]">
        <p className={`${eyebrow} text-lime-bright`}>{strip.label}</p>
        <SplitLines className="mt-4 max-w-[15ch] text-[clamp(38px,5vw,96px)] leading-[0.94] tracking-[-0.04em] text-balance">
          {strip.heading}
        </SplitLines>

        <ol className="mt-[clamp(48px,7vw,120px)] grid gap-4 md:grid-cols-3 md:items-start md:gap-5">
          {strip.steps.map((step, i) => (
            <li
              key={step.n}
              className="st-card relative flex flex-col overflow-hidden rounded-[clamp(12px,1.05vw,20px)] border border-offwhite/15 bg-forest/60 p-[clamp(20px,2vw,32px)] backdrop-blur-md"
              style={{ marginTop: `calc(${i} * clamp(0px, 6vw, 96px))` }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -top-[20%] -left-[10%] h-[60%] w-[70%] bg-[radial-gradient(closest-side,rgba(183,199,62,0.14),transparent)]"
              />
              <span className="st-num relative font-display text-[clamp(56px,6vw,108px)] leading-[0.8] tracking-[-0.05em] text-lime">
                {step.n}
              </span>
              <h3 className="relative mt-[clamp(28px,3vw,56px)] text-[clamp(21px,1.7vw,28px)] leading-[1.1] tracking-[-0.02em]">
                {step.title}
              </h3>
              <p className={`${microCaps} relative mt-3 text-offwhite/75`}>{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-[clamp(48px,6vw,96px)] flex flex-col gap-6 border-t border-offwhite/20 pt-[clamp(24px,3vw,40px)] lg:flex-row lg:items-end lg:justify-between">
          <p className="font-display text-[clamp(24px,2.6vw,46px)] leading-[1.05] tracking-[-0.03em]">
            {strip.promise[0]}
            <br />
            <span className="text-offwhite/70">{strip.promise[1]}</span>
          </p>
          <Cta href={strip.cta.href} solid className="self-start lg:self-auto">
            {strip.cta.label}
          </Cta>
        </div>
      </div>
    </section>
  );
}
