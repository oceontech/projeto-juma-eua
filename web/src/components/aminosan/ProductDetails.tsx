import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { growthStages, guaranteedAnalysis, productAnalysis } from "@/content/aminosan";

export function ProductDetails() {
  const { vegetative, reproductive, spritePosition } = growthStages.timeline;

  return (
    <section className="bg-white py-[clamp(56px,7vw,124px)]">
      {/* ----------------------------------------------------- Growth Stages */}
      <div className="wrap">
        <Reveal y={18} className="grid grid-cols-1 gap-[clamp(16px,2vw,28px)] lg:grid-cols-[485fr_507fr]">
          <h2 className="text-h2 leading-[1.05] text-ink">{growthStages.heading}</h2>
          <p className="max-w-[46ch] font-light leading-[1.55] text-muted lg:justify-self-end">
            {growthStages.description}
          </p>
        </Reveal>

        <Reveal
          y={20}
          delay={0.08}
          stagger={0.08}
          targetSelector="[data-guideline-card]"
          className="mt-[clamp(32px,3.6vw,56px)] grid grid-cols-1 gap-[clamp(16px,1.6vw,24px)] lg:grid-cols-[650fr_315fr_315fr]"
        >
          {growthStages.guidelines.map((card) => (
            <div
              key={card.label}
              data-guideline-card=""
              className="relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-[20px] p-[clamp(24px,2.4vw,50px)]"
            >
              <Image src={card.image} alt="" fill className="object-cover" />
              <div
                className={`absolute inset-0 ${card.dark ? "bg-gradient-to-t from-black/85 via-black/30 to-transparent" : "bg-gradient-to-t from-white/90 via-white/40 to-transparent"}`}
              />
              <div className="relative">
                <p className={`font-display text-[18px] ${card.dark ? "text-lime-bright" : "text-[#0f522a]"}`}>
                  {card.n} — {card.label.toUpperCase()}
                </p>
                <p
                  className={`mt-6 font-display text-[clamp(22px,1.9vw,32px)] leading-[1.2] whitespace-pre-line ${card.dark ? "text-white" : "text-ink"}`}
                >
                  {card.title}
                </p>
                <p className={`mt-5 max-w-[26ch] leading-[1.55] ${card.dark ? "text-offwhite/90" : "text-muted"}`}>
                  {card.body}
                </p>
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal y={18} delay={0.16} className="mt-[clamp(40px,5vw,80px)] overflow-x-auto">
          <div className="flex min-w-[720px] items-start justify-between gap-2">
            {vegetative.map((stage) => (
              <GrowthStage key={stage} stage={stage} position={spritePosition[stage as keyof typeof spritePosition]} />
            ))}
            <div className="flex items-start gap-6 rounded-[20px] border-2 border-dashed border-lime px-6 py-4">
              {reproductive.map((stage) => (
                <GrowthStage key={stage} stage={stage} position={spritePosition[stage as keyof typeof spritePosition]} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* ------------------------------------------------ Guaranteed Analysis */}
      <div id="product-analysis" className="wrap mt-[clamp(64px,7vw,100px)]">
        <Reveal y={18} className="grid grid-cols-1 gap-[clamp(16px,2vw,28px)] lg:grid-cols-[485fr_507fr]">
          <h2 className="text-h2 leading-[1.05] text-ink">{guaranteedAnalysis.heading}</h2>
          <p className="max-w-[46ch] font-light leading-[1.55] text-muted lg:justify-self-end">
            {guaranteedAnalysis.description}
          </p>
        </Reveal>

        <Reveal y={20} delay={0.08} className="relative mt-[clamp(32px,3.6vw,56px)] aspect-[1320/664] w-full overflow-hidden rounded-[19px]">
          <Image src="/img/aminosan/guaranteed-analysis-product.webp" alt="Aminosan product line" fill className="object-cover" />
        </Reveal>
      </div>

      {/* -------------------------------------------------- Product Analysis */}
      <div className="wrap mt-[clamp(40px,4.4vw,64px)]">
        <Reveal
          y={18}
          stagger={0.06}
          targetSelector="[data-metric]"
          className="flex flex-wrap items-stretch justify-center gap-x-[clamp(20px,3vw,46px)] gap-y-6 rounded-[20px] border border-[#acacac] px-[clamp(18px,2vw,28px)] py-[clamp(18px,1.6vw,22px)]"
        >
          {productAnalysis.metrics.map((metric, i) => (
            <div key={metric.label} className="flex items-center gap-[clamp(20px,3vw,46px)]">
              {i > 0 && <span aria-hidden className="hidden h-[80px] w-px bg-ink/15 sm:block" />}
              <div data-metric="" className="w-[140px] text-center">
                <p className={`font-display text-[18px] ${metric.priority ? "font-bold text-[#0f522a]" : "text-ink"}`}>
                  {metric.label}
                </p>
                <p className={`mt-2 text-[22px] font-semibold ${metric.priority ? "text-[#0f522a]" : "text-[#b66914]"}`}>
                  {metric.value}
                </p>
                <p className={`mt-1 text-[15px] ${metric.priority ? "text-[#0f522a]" : "text-[#b66914]"}`}>{metric.tag}</p>
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal y={16} delay={0.1} className="mt-8 flex flex-wrap justify-center gap-4">
          {productAnalysis.documents.map((doc) => (
            <a
              key={doc.label}
              href={doc.href}
              className={
                doc.filled
                  ? "inline-flex items-center justify-center rounded-lg bg-lime px-8 py-4 font-medium text-ink transition-colors hover:bg-[#c3d454]"
                  : "inline-flex items-center justify-center rounded-lg border border-lime px-8 py-4 font-medium text-ink transition-colors hover:bg-lime/10"
              }
            >
              {doc.label}
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function GrowthStage({ stage, position }: { stage: string; position: string }) {
  return (
    <div className="flex w-[92px] shrink-0 flex-col items-center gap-3">
      <p className="text-[13px] font-semibold text-muted">{stage}</p>
      <div className="relative size-[92px] overflow-hidden rounded-full">
        <Image
          src="/img/aminosan/growth-stages-sprite.webp"
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition: position }}
        />
      </div>
    </div>
  );
}
