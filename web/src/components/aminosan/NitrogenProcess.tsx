import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Pill, Rule } from "@/components/ui";
import { nitrogen, process } from "@/content/aminosan";

/** Traço decorativo dos passos da cadeia de nitrogênio: rótulo + linha com ponto. */
function StepIndicator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <p className="shrink-0 font-display text-[clamp(15px,1.4vw,22px)] font-semibold text-offwhite uppercase">
        {label}
      </p>
      <span className="relative h-[6px] flex-1">
        <span className="absolute inset-y-1/2 left-0 h-px w-full bg-offwhite/70" />
        <span className="absolute top-1/2 left-0 size-[6px] -translate-y-1/2 rounded-full border border-offwhite" />
      </span>
    </div>
  );
}

/**
 * Nitrogem + Process: mesmo fundo escuro, contínuo desde o pé do hero. Duas
 * seções do Figma, um único bloco visual — é assim que a página respira ali.
 */
export function NitrogenProcess() {
  return (
    <section className="bg-[#0C0C0E] py-[clamp(56px,7vw,124px)]">
      <div className="wrap grid grid-cols-1 items-center gap-[clamp(32px,5vw,80px)] lg:grid-cols-[315fr_223fr]">
        <Reveal y={18} stagger={0.08} targetSelector="[data-nitrogen-item]">
          <h2
            data-nitrogen-item=""
            className="font-display text-[clamp(30px,3.4vw,48px)] leading-[1.2] text-white"
          >
            {nitrogen.heading}
          </h2>
          <p
            data-nitrogen-item=""
            className="mt-[clamp(16px,2vw,28px)] font-light leading-[1.55] text-offwhite/90"
          >
            {nitrogen.body[0]}
          </p>
          <p
            data-nitrogen-item=""
            className="mt-[1em] font-semibold leading-[1.55] text-offwhite"
          >
            {nitrogen.body[1]}
          </p>
        </Reveal>

        <Reveal
          y={16}
          delay={0.1}
          stagger={0.12}
          targetSelector="[data-nitrogen-step]"
          className="flex flex-col gap-[clamp(28px,5vw,88px)]"
        >
          {nitrogen.steps.map((label) => (
            <div key={label} data-nitrogen-step="">
              <StepIndicator label={label} />
            </div>
          ))}
        </Reveal>
      </div>

      <div className="wrap mt-[clamp(64px,8vw,140px)]">
        <Reveal y={16} className="mb-[clamp(14px,1.2vw,22px)] flex items-center gap-[clamp(12px,1.2vw,20px)]">
          <Pill dark>Process</Pill>
          <Rule short />
        </Reveal>

        <div className="grid grid-cols-1 items-start gap-[clamp(24px,3vw,50px)] lg:grid-cols-[505fr_293fr]">
          <Reveal y={18}>
            <h2 className="text-h2 leading-[0.98] text-white">{process.heading}</h2>
          </Reveal>
          <Reveal y={18} delay={0.06} className="lg:justify-self-end">
            <p className="max-w-[46ch] font-light leading-[1.55] text-offwhite/90">
              {process.eyebrow}
            </p>
          </Reveal>
        </div>

        <div className="mt-[clamp(32px,4vw,64px)] grid grid-cols-1 gap-[clamp(20px,2vw,32px)] lg:grid-cols-[1fr_1fr]">
          <Reveal y={20} className="relative min-h-[280px] overflow-hidden rounded-[24px] lg:min-h-full">
            <Image
              src="/img/aminosan/process-leaf.webp"
              alt="Backlit leaf close-up"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </Reveal>

          <Reveal
            y={20}
            delay={0.08}
            stagger={0.08}
            targetSelector="[data-process-card]"
            className="grid grid-cols-1 gap-[clamp(16px,1.6vw,24px)] sm:grid-cols-2"
          >
            <div
              data-process-card=""
              className="rounded-[24px] p-[clamp(24px,2.2vw,40px)] sm:col-span-2"
              style={{
                backgroundImage:
                  "linear-gradient(143deg, var(--color-night-warm) 2.4%, var(--color-night-deep) 60.2%)",
              }}
            >
              <p className="font-display text-[clamp(22px,1.8vw,32px)] font-semibold text-white">
                {process.cards.longWay.label}
              </p>
              <p className="mt-[clamp(12px,1.2vw,18px)] font-display text-[clamp(14px,1vw,18px)] text-lime-bright">
                {process.cards.longWay.formula}
              </p>
              <p className="mt-[clamp(12px,1.2vw,18px)] leading-[1.55] text-muted-dark">
                {process.cards.longWay.body}
              </p>
            </div>

            <div data-process-card="" className="rounded-[24px] bg-[#07070a] p-[clamp(20px,1.6vw,30px)]">
              <p className="font-display text-[clamp(18px,1.3vw,22px)] font-semibold text-white">
                {process.cards.shortWay.label}
              </p>
              <p className="mt-3 text-[15px] leading-[1.5] text-muted-dark">
                {process.cards.shortWay.body}
              </p>
            </div>

            <div data-process-card="" className="rounded-[24px] bg-[#07070a] p-[clamp(20px,1.6vw,30px)]">
              <p className="font-display text-[clamp(18px,1.3vw,22px)] font-semibold text-white">
                {process.cards.whatsInIt.label}
              </p>
              <p className="mt-3 text-[15px] leading-[1.5] text-muted-dark">
                {process.cards.whatsInIt.body}
              </p>
            </div>

            <a
              href={process.cta.href}
              data-process-card=""
              className="flex items-center justify-center rounded-[20px] bg-lime px-8 py-[clamp(20px,2vw,32px)] text-center font-display text-[clamp(17px,1.4vw,22px)] text-ink transition-colors hover:bg-[#A6B534] sm:col-span-2"
            >
              {process.cta.label}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
