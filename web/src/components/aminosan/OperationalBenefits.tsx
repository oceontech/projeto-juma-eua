"use client";

import { useRef } from "react";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { gsap, useGSAP } from "@/lib/gsap";
import { operationalBenefits } from "@/content/aminosan";

export function OperationalBenefits() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const cards = Array.from(section.querySelectorAll<HTMLElement>("[data-benefit-card]"));
      const deck = section.querySelector<HTMLElement>(".aminosan-benefits-cards")!;
      const deckEntrance = section.querySelector<HTMLElement>("[data-benefits-deck-entry]")!;

      const media = gsap.matchMedia();
      media.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { animate } = context.conditions as { animate: boolean };

          if (!animate || cards.length < 2) return;

          /* A entrada tem um wrapper próprio: os cards ficam livres para a
             timeline pinada controlar seus transforms depois da chegada. */
          gsap.fromTo(
            deckEntrance,
            { y: 42, scale: 0.97, opacity: 0 },
            {
              y: 0,
              scale: 1,
              opacity: 1,
              duration: 0.72,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            },
          );

          /* A cada troca, a faixa restante é centralizada como um grupo. O
             cálculo usa só a geometria estática do layout e é refeito pelo
             ScrollTrigger em refresh (por exemplo, ao mudar a orientação). */
          const centeredDeckOffset = (firstIndex: number) => {
            const firstCard = cards[firstIndex];
            const lastCard = cards.at(-1)!;
            const remainingWidth = lastCard.offsetLeft + lastCard.offsetWidth - firstCard.offsetLeft;
            return (deck.clientWidth - remainingWidth) / 2 - firstCard.offsetLeft;
          };

          const timeline = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${Math.round((cards.length - 1) * window.innerHeight * 0.78)}`,
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              /* O espaço reservado pelo pin fica fora da section. Mantê-lo
                 com o mesmo fundo evita que o preto global apareça abaixo
                 dos cards, especialmente na altura reduzida do mobile. */
              onRefresh: (trigger) => {
                const spacer = (trigger as unknown as { spacer?: HTMLElement }).spacer;
                spacer?.style.setProperty("background-color", "#0f522a");
              },
            },
          });

          cards.slice(0, -1).forEach((card, index) => {
            const beat = `card-${index + 1}`;

            timeline.addLabel(beat, index);

            /* O card ativo sai para cima. O deslocamento é avaliado no setup
               e novamente em refresh, nunca durante o scrub. */
            timeline.to(
              card,
              {
                y: () => -Math.max(120, card.offsetHeight * 0.3),
                scale: 0.98,
                opacity: 0,
                duration: 0.46,
                ease: "power2.in",
              },
              beat,
            );

            /* O próximo destaque e todos os cards que ainda virão avançam
               juntos. Isso mantém a pilha compacta e centralizada em cada
               etapa, em vez de deixar um vão na posição do card que saiu. */
            timeline.to(
              cards.slice(index + 1),
              {
                x: () => centeredDeckOffset(index + 1),
                y: 0,
                scale: 1,
                opacity: 1,
                duration: 0.68,
                ease: "back.out(1.25)",
              },
              `${beat}+=0.08`,
            );
          });
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="aminosan-benefits-section bg-[#0f522a] py-[clamp(56px,7vw,124px)]">
      <div className="wrap">
        <Reveal y={18} stagger={0.1} className="grid grid-cols-1 gap-[clamp(16px,2vw,28px)] lg:grid-cols-[621fr_250fr]">
          <h2 className="text-h2 leading-[1.1] text-white">{operationalBenefits.heading}</h2>
          <p className="font-light leading-[1.55] text-offwhite/90 lg:justify-self-end">
            {operationalBenefits.description}
          </p>
        </Reveal>

        <div data-benefits-deck-entry>
          <div className="aminosan-benefits-cards mt-[clamp(36px,2vw,36px)] flex flex-row items-stretch gap-5 lg:items-start lg:gap-0">
            {operationalBenefits.cards.map((card, i) => (
              <div
                key={card.n}
                data-benefit-card=""
                className={`aminosan-benefit-card benefit-card-${i + 1} relative flex flex-col overflow-hidden rounded-[17px] bg-gradient-to-b from-[#fbfff2] to-[#d7dfc4] p-[clamp(28px,2.35vw,32px)] shadow-[0_4px_20px_rgba(0,0,0,0.3)]`}
              >
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-[24px]" style={{ color: card.accent }}>
                    {card.n}
                  </span>
                  <span className="text-[18px] text-[#7a7f7e]">/ 04</span>
                </div>
                <span className="mt-4 block h-1 w-full max-w-[220px] rounded-full" style={{ background: card.accent }} />

                {card.image ? (
                  <p className="aminosan-benefit-card__heading mt-8 max-w-[300px] font-display text-[clamp(22px,1.9vw,32px)] leading-[1.2] text-ink">
                    {card.heading}
                  </p>
                ) : (
                  <p className="aminosan-benefit-card__heading mt-8 max-w-[220px] font-display text-[22px] leading-[1.27] text-ink">
                    {card.heading}
                  </p>
                )}

                <p className="aminosan-benefit-card__body mt-5 max-w-[240px] text-[15px] leading-[1.5] text-muted">{card.body}</p>

                {card.icon && (
                  <Image src={card.icon} alt="" width={49} height={49} className="mt-auto h-[49px] w-[49px] object-contain" />
                )}
                {card.image && (
                  <div className="relative mt-auto ml-auto h-[160px] w-[220px] lg:h-[237px] lg:w-[327px]">
                    <Image src={card.image} alt="Aminosan 2.5 gal jug" fill className="object-contain object-bottom" />
                  </div>
                )}

                <span aria-hidden="true" className="aminosan-benefit-card__corner" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
