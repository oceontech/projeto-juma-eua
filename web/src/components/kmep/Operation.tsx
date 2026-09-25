"use client";

import Image from "next/image";
import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { SplitLines } from "@/components/motion/SplitLines";
import { gsap, useGSAP } from "@/lib/gsap";
import { Cta, eyebrow, microCaps } from "./ui";

/**
 * K9. Os quatro cards na ordem da página: o potássio, o tanque, a ação
 * desalojante, e o ensaio. No desktop, o ensaio ocupa as duas linhas do
 * bento; os três benefícios preenchem a área à esquerda.
 *
 * O terceiro card (a ação desalojante) está em HOLD pela P2. Se ele sair do
 * conteúdo, o segundo passa a ser o último e ocupa a linha de baixo sozinho:
 * o layout é pelo índice do último card, não por posição fixa.
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
    <section ref={scope} className="bg-white py-sec text-forest">
      <div className="wrap">
        <SplitLines className="max-w-[14ch] text-[clamp(34px,3.8vw,68px)] leading-[0.98] tracking-[-0.03em] text-balance">
          {operation.heading}
        </SplitLines>

        <div className="op-cards mt-[clamp(36px,5vw,72px)] grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-12 xl:gap-4">
          {operation.cards.map((card, i) => {
            const wide = i === operation.cards.length - 1 && i > 0;
            return (
              <article
                key={card.title}
                className={`op-card flex min-h-[300px] flex-col overflow-hidden rounded-[clamp(12px,1.05vw,20px)] bg-linear-[122.93deg,var(--color-night-warm)_2.4%,var(--color-night-deep)_60.23%] p-3.5 sm:min-h-[330px] sm:p-5 text-offwhite md:p-[clamp(20px,1.8vw,28px)] ${
                  wide
                    ? "col-span-2 xl:col-span-7 xl:col-start-1 xl:row-start-2 xl:grid xl:min-h-[260px] xl:grid-cols-[minmax(0,1fr)_minmax(180px,34%)] xl:grid-rows-[auto_1fr] xl:gap-x-5"
                    : i === 0
                      ? "xl:col-span-4 xl:col-start-1 xl:row-start-1 xl:min-h-[380px]"
                      : "xl:col-span-3 xl:col-start-5 xl:row-start-1 xl:min-h-[380px]"
                }`}
              >
                {/* w-fit: o fio só alcança a largura que o título ocupa. */}
                <div className="w-fit max-w-full">
                  <span aria-hidden className="op-line block h-[2px] w-full origin-left rounded-full bg-lime" />
                  <h3 className="mt-3 text-[clamp(17px,1.6vw,27px)] leading-[1.1] tracking-[-0.02em]">{card.title}</h3>
                </div>
                <div aria-hidden className={`relative flex min-h-[150px] flex-1 items-center justify-center py-3 ${wide ? "xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:min-h-0 xl:py-0" : ""}`}>
                  <span className="pointer-events-none absolute size-[180px] rounded-full bg-[radial-gradient(circle,rgba(183,199,62,0.12),transparent_68%)]" />
                  <Image
                    src={card.image}
                    alt=""
                    width={wide ? 960 : 640}
                    height={wide ? 480 : 640}
                    sizes={wide ? "(min-width: 1280px) 260px, 200px" : "(min-width: 1280px) 220px, (min-width: 640px) 180px, 200px"}
                    className={`relative h-auto max-h-[190px] object-contain ${wide ? "w-[min(100%,260px)]" : "w-[min(100%,200px)]"}`}
                  />
                </div>
                <p className={`${microCaps} mt-auto text-offwhite/70 ${wide ? "xl:col-start-1 xl:row-start-2 xl:self-end" : ""}`}>
                  {card.body}
                </p>
              </article>
            );
          })}

          <article className="op-card relative flex flex-col overflow-hidden rounded-[clamp(12px,1.05vw,20px)] border border-lime/35 bg-forest p-5 text-offwhite col-span-2 md:p-[clamp(20px,1.8vw,28px)] xl:col-span-5 xl:col-start-8 xl:row-span-2 xl:row-start-1 xl:p-9">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-[30%] -right-[20%] h-[80%] w-[80%] bg-[radial-gradient(closest-side,rgba(183,199,62,0.16),transparent)]"
            />
            <div className="relative w-full">
              <span aria-hidden className="op-line block h-[2px] w-full origin-left rounded-full bg-lime" />
              <h3 className="mt-3 max-w-[20ch] text-[clamp(24px,2.2vw,36px)] leading-[1.08] tracking-[-0.025em]">{offer.title}</h3>
            </div>

            <dl className="relative mt-8 grid gap-5 sm:grid-cols-2 xl:mt-auto xl:grid-cols-1 xl:gap-8 xl:pt-8">
              <div className="border-t border-offwhite/20 pt-4">
                <dt className={`${eyebrow} text-[10px] text-offwhite/60`}>{offer.check.label}</dt>
                <dd className="mt-2 font-display text-[clamp(52px,5vw,80px)] leading-none tracking-[-0.05em] text-kmep-light">
                  {offer.check.value}
                  <span className="ml-2 text-[0.3em] tracking-[0.02em] text-offwhite/60">{offer.check.unit}</span>
                </dd>
              </div>
              <div className="rounded-[16px] bg-lime px-5 py-5 text-forest xl:py-7">
                <dt className={`${eyebrow} text-[10px] text-forest/70`}>{offer.gain.label}</dt>
                <dd className="mt-2 font-display text-[clamp(60px,6.5vw,104px)] leading-none tracking-[-0.055em] text-forest">
                  {offer.gain.value}
                  <span className="ml-2 text-[0.25em] tracking-[0.02em] text-forest/70">{offer.gain.unit}</span>
                </dd>
              </div>
            </dl>
            <p className={`${microCaps} relative mt-5 text-[10px] text-offwhite/60`}>{offer.witness}</p>

            <Cta href={offer.cta.href} className="relative mt-7 self-start xl:w-full">
              {offer.cta.label}
            </Cta>
          </article>
        </div>
      </div>
    </section>
  );
}
