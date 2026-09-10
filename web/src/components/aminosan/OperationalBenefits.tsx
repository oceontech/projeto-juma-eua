import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { operationalBenefits } from "@/content/aminosan";

/** Alturas em cascata, como no Figma — decoração de "bento", não dado. */
const CARD_HEIGHT = ["lg:h-[601px]", "lg:h-[565px]", "lg:h-[533px]", "lg:h-[497px]"];
const CARD_WIDTH = ["lg:w-[471px]", "lg:w-[283px]", "lg:w-[283px]", "lg:w-[283px]"];

export function OperationalBenefits() {
  return (
    <section className="bg-[#0f522a] py-[clamp(56px,7vw,124px)]">
      <div className="wrap">
        <Reveal y={18} className="grid grid-cols-1 gap-[clamp(16px,2vw,28px)] lg:grid-cols-[621fr_250fr]">
          <h2 className="text-h2 leading-[1.1] text-white">{operationalBenefits.heading}</h2>
          <p className="font-light leading-[1.55] text-offwhite/90 lg:justify-self-end">
            {operationalBenefits.description}
          </p>
        </Reveal>

        <Reveal
          y={20}
          delay={0.08}
          stagger={0.08}
          targetSelector="[data-benefit-card]"
          className="mt-[clamp(36px,4vw,54px)] flex flex-col items-stretch gap-5 lg:flex-row lg:items-end"
        >
          {operationalBenefits.cards.map((card, i) => (
            <div
              key={card.n}
              data-benefit-card=""
              className={`relative flex flex-col overflow-hidden rounded-[17px] bg-gradient-to-b from-[#fbfff2] to-[#d7dfc4] p-[clamp(28px,2.6vw,50px)] shadow-[0_4px_20px_rgba(0,0,0,0.3)] ${CARD_HEIGHT[i]} ${CARD_WIDTH[i]}`}
            >
              <div className="flex items-baseline gap-1">
                <span className="font-display text-[24px]" style={{ color: card.accent }}>
                  {card.n}
                </span>
                <span className="text-[18px] text-[#7a7f7e]">/ 04</span>
              </div>
              <span className="mt-4 block h-1 w-full max-w-[220px] rounded-full" style={{ background: card.accent }} />

              {card.image ? (
                <p className="mt-8 max-w-[300px] font-display text-[clamp(22px,1.9vw,32px)] leading-[1.2] text-ink">
                  {card.heading}
                </p>
              ) : (
                <p className="mt-8 max-w-[220px] font-display text-[22px] leading-[1.27] text-ink">
                  {card.heading}
                </p>
              )}

              <p className="mt-5 max-w-[240px] text-[15px] leading-[1.5] text-muted">{card.body}</p>

              {card.icon && (
                <Image src={card.icon} alt="" width={49} height={49} className="mt-auto size-[49px] pt-6" />
              )}
              {card.image && (
                <div className="relative mt-auto ml-auto h-[160px] w-[220px] lg:h-[237px] lg:w-[327px]">
                  <Image src={card.image} alt="Aminosan bottle" fill className="object-contain object-bottom" />
                </div>
              )}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
