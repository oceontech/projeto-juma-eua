"use client";

import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { SplitLines } from "@/components/motion/SplitLines";
import { gsap, useGSAP } from "@/lib/gsap";
import { Cta, eyebrow, microCaps } from "./ui";

/**
 * K9. Os quatro cards na ordem em que o produtor pergunta: o tanque, a
 * calda, o potássio, e a conta. Os três primeiros são os cards escuros da LP
 * B, com o fio lima que se desenha na largura do título; o quarto é a oferta
 * — custo e ganho em linhas separadas, cada um na sua cor, no mesmo corpo,
 * com a testemunha do ensaio embaixo.
 */
export function Operation() {
  const { operation } = useContent().kmep;
  const { offer } = operation;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const once = { trigger: ".op-cards", start: "top 88%", once: true };
        gsap.fromTo(
          ".op-card",
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.12, duration: 1, ease: "expo.out", scrollTrigger: once },
        );
        /* O fio sobe junto e se desenha logo depois, da esquerda. */
        gsap.fromTo(
          ".op-line",
          { scaleX: 0 },
          { scaleX: 1, stagger: 0.12, duration: 1.1, delay: 0.35, ease: "expo.out", scrollTrigger: once },
        );
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="bg-cream py-sec text-forest">
      <div className="wrap">
        <SplitLines className="max-w-[14ch] text-[clamp(34px,3.8vw,68px)] leading-[0.98] tracking-[-0.03em] text-balance">
          {operation.heading}
        </SplitLines>

        <div className="op-cards mt-[clamp(36px,5vw,72px)] grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.25fr)] lg:gap-4">
          {operation.cards.map((card, i) => (
            <article
              key={card.title}
              className="op-card flex min-h-[clamp(240px,21vw,330px)] flex-col rounded-[clamp(12px,1.05vw,20px)] bg-linear-[122.93deg,var(--color-night-warm)_2.4%,var(--color-night-deep)_60.23%] p-5 text-offwhite md:p-[clamp(20px,1.8vw,28px)]"
            >
              <p className={`${microCaps} text-lime-bright`}>0{i + 1}</p>
              {/* w-fit: o fio só alcança a largura que o título ocupa. */}
              <div className="mt-6 w-fit max-w-full">
                <span aria-hidden className="op-line block h-[2px] w-full origin-left rounded-full bg-lime" />
                <h3 className="mt-3 text-[clamp(21px,1.6vw,27px)] leading-[1.1] tracking-[-0.02em]">{card.title}</h3>
              </div>
              <p className={`${microCaps} mt-auto pt-6 text-offwhite/70`}>
                {card.body}
                {/* HOLD P2 — remover junto com Flush.tsx */}
                {card.hold && <> {card.hold}</>}
              </p>
            </article>
          ))}

          <article className="op-card relative flex flex-col overflow-hidden rounded-[clamp(12px,1.05vw,20px)] bg-forest p-5 text-offwhite sm:col-span-2 md:p-[clamp(20px,1.8vw,28px)] lg:col-span-1">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-[30%] -right-[20%] h-[80%] w-[80%] bg-[radial-gradient(closest-side,rgba(183,199,62,0.16),transparent)]"
            />
            <p className={`${microCaps} relative text-lime-bright`}>0{operation.cards.length + 1}</p>
            <div className="relative mt-6 w-fit max-w-full">
              <span aria-hidden className="op-line block h-[2px] w-full origin-left rounded-full bg-lime" />
              <h3 className="mt-3 text-[clamp(21px,1.6vw,27px)] leading-[1.1] tracking-[-0.02em]">{offer.title}</h3>
            </div>

            {/* Custo e ganho: mesmo corpo, linhas separadas, cores próprias. */}
            <dl className="relative mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="border-t border-offwhite/15 pt-3">
                <dt className={`${eyebrow} text-[10px] text-offwhite/60`}>{offer.cost.label}</dt>
                <dd className="mt-1 font-display text-[clamp(34px,3vw,52px)] leading-none tracking-[-0.04em] text-kmep-light">
                  {offer.cost.value}
                  <span className="ml-1 text-[0.4em] tracking-[0.02em] text-offwhite/60">{offer.cost.unit}</span>
                </dd>
              </div>
              <div className="border-t border-offwhite/15 pt-3">
                <dt className={`${eyebrow} text-[10px] text-offwhite/60`}>{offer.gain.label}</dt>
                <dd className="mt-1 font-display text-[clamp(34px,3vw,52px)] leading-none tracking-[-0.04em] text-lime">
                  {offer.gain.value}
                  <span className="ml-1 text-[0.4em] tracking-[0.02em] text-offwhite/60">{offer.gain.unit}</span>
                </dd>
              </div>
            </dl>
            <p className={`${microCaps} relative mt-3 text-[10px] text-offwhite/55`}>{offer.witness}</p>

            <Cta href={offer.cta.href} className="relative mt-6 self-start">
              {offer.cta.label}
            </Cta>
          </article>
        </div>
      </div>
    </section>
  );
}
