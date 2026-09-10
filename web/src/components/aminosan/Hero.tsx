import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { hero } from "@/content/aminosan";

const STAT_ICON = {
  generic: "/img/aminosan/icon-stat-generic.svg",
  "1988": "/img/aminosan/icon-stat-1988.svg",
  fermentation: "/img/aminosan/icon-stat-fermentation.svg",
} as const;

/**
 * Abre a LP do Aminosan. O fundo é uma composição só (céu, plantação, folha
 * em close — as garrafas do produto já vêm embutidas na foto da plantação),
 * num contêiner travado no aspecto da própria imagem: qualquer posição em
 * porcentagem dentro dele alinha certo em qualquer largura de tela, sem
 * recorte inesperado do `object-cover`.
 */
export function Hero() {
  return (
    <section className="relative bg-[#050e08]">
      <div className="relative aspect-[402/1374] w-full lg:aspect-[1920/2437]">
        <Image
          src="/img/aminosan/hero-bg-mobile.webp"
          alt="Aminosan product line staged in a sunlit Brazilian crop field"
          fill
          priority
          sizes="100vw"
          className="object-cover lg:hidden"
        />
        <Image
          src="/img/aminosan/hero-bg-desktop.webp"
          alt="Aminosan product line staged in a sunlit Brazilian crop field"
          fill
          priority
          sizes="100vw"
          className="hidden object-cover lg:block"
        />

        <Reveal
          y={14}
          className="absolute inset-x-0 top-[9.2%] px-gut text-center lg:top-[8.6%]"
        >
          <p className="font-display text-[clamp(9px,2.3vw,16px)] font-semibold tracking-[0.3em] text-[#004c26] uppercase lg:tracking-[0.28em]">
            {hero.eyebrow}
          </p>
          <h1 className="mt-[clamp(6px,1.6vw,14px)] font-display text-[clamp(52px,15vw,235px)] leading-[0.94] tracking-[0.05em] text-[#004c26] uppercase lg:text-[clamp(120px,11.4vw,235px)]">
            {hero.heading}
          </h1>
        </Reveal>

        <div className="absolute inset-x-0 top-[33.6%] px-gut lg:top-[19.7%]">
          <div className="wrap flex flex-col items-stretch gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-[clamp(24px,3vw,60px)]">
            <Reveal
              y={16}
              className="rounded-2xl border border-white/30 bg-white/75 p-[clamp(22px,2vw,40px)] backdrop-blur-[6px] lg:w-[431px] lg:shrink-0"
            >
              <div className="flex items-start gap-[clamp(10px,1vw,16px)]">
                <Image
                  src="/img/aminosan/icon-badge-leaf.svg"
                  alt=""
                  width={46}
                  height={46}
                  className="size-[clamp(32px,3vw,46px)] shrink-0"
                />
                <p className="pt-1 text-[clamp(10px,0.9vw,14px)] leading-snug tracking-[0.02em] text-[#004c26]">
                  {hero.card.eyebrow}
                </p>
              </div>

              <p className="mt-5 font-display text-[clamp(20px,2vw,28px)] leading-[1.15] text-ink">
                {hero.card.title}
              </p>

              <div className="mt-5 border-t border-[#004c26]/20 pt-5">
                <p className="text-[clamp(13px,1vw,16px)] leading-[1.4] text-muted">
                  {hero.card.body}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {hero.card.ctas.map((cta) => (
                  <a
                    key={cta.label}
                    href={cta.href}
                    className="inline-flex items-end gap-1 rounded-lg bg-[#004c26] px-5 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#003a1d]"
                  >
                    {cta.label}
                    <Image
                      src="/img/aminosan/icon-cta-arrow.svg"
                      alt=""
                      width={10}
                      height={10}
                      className="mb-[3px] size-[9px]"
                    />
                  </a>
                ))}
              </div>
            </Reveal>

            <Reveal
              y={16}
              delay={0.08}
              stagger={0.06}
              targetSelector="[data-hero-stat]"
              className="grid grid-cols-1 gap-3 lg:w-[372px] lg:shrink-0"
            >
              {hero.stats.map((stat) => (
                <div
                  key={stat.label}
                  data-hero-stat=""
                  className="flex items-center gap-3 rounded-xl border border-white/50 bg-white/65 px-[clamp(16px,1.6vw,25px)] py-[clamp(12px,1vw,16px)]"
                >
                  <Image
                    src={STAT_ICON[stat.icon]}
                    alt=""
                    width={55}
                    height={55}
                    className="size-[clamp(40px,3.6vw,55px)] shrink-0"
                  />
                  <div>
                    <p className="font-display text-[clamp(16px,1.4vw,22px)] leading-tight text-ink">
                      {stat.value}
                    </p>
                    <p className="text-[clamp(11px,0.85vw,16px)] tracking-[0.02em] text-muted">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>

          <Reveal
            y={10}
            delay={0.12}
            className="mx-auto mt-5 flex w-fit max-w-full items-center gap-[10px] rounded-lg border border-white bg-white/75 px-4 py-2 lg:mt-[clamp(28px,3.6vw,50px)]"
          >
            <Image
              src="/img/aminosan/icon-tagline.svg"
              alt=""
              width={20}
              height={24}
              className="h-[20px] w-[17px] shrink-0"
            />
            <p className="font-display text-[clamp(9px,0.85vw,16px)] tracking-[0.1em] whitespace-normal text-[#004c26] lg:whitespace-nowrap">
              {hero.tagline}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
