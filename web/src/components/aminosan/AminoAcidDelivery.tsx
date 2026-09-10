import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { comparison, delivery } from "@/content/aminosan";

type RouteStep = { formula?: string; icon?: string; label: string };

/** Um passo da cadeia: círculo com fórmula ou ícone, rótulo embaixo. */
function StepCircle({ step }: { step: RouteStep }) {
  return (
    <div className="flex w-[92px] shrink-0 flex-col items-center gap-3 lg:w-[clamp(64px,6vw,92px)]">
      <div className="flex size-[92px] shrink-0 items-center justify-center rounded-full border border-ink/10 bg-white shadow-[0_2px_10px_-2px_rgba(0,0,0,0.08)] lg:size-[clamp(64px,6vw,92px)]">
        {step.icon ? (
          <Image src={step.icon} alt="" width={34} height={34} className="size-[clamp(22px,2vw,34px)]" />
        ) : (
          <span className="font-display text-[clamp(13px,1.1vw,17px)] text-muted">{step.formula}</span>
        )}
      </div>
      <p className="text-center text-[13px] whitespace-nowrap text-muted">{step.label}</p>
    </div>
  );
}

/** Linha conectando os círculos — vertical no mobile, horizontal no desktop. */
function Timeline() {
  return (
    <div
      aria-hidden
      className="absolute top-[46px] right-[46px] left-[46px] h-px bg-ink/15 lg:top-1/2 lg:right-[clamp(32px,3vw,46px)] lg:left-[clamp(32px,3vw,46px)] lg:-translate-y-1/2"
    />
  );
}

export function AminoAcidDelivery() {
  return (
    <>
      <section id="delivery" className="bg-white py-[clamp(56px,7vw,124px)]">
        <Reveal y={18} className="wrap text-center">
          <p className="font-display text-[clamp(11px,0.9vw,16px)] font-semibold tracking-[0.3em] text-[#004c26] uppercase">
            {delivery.eyebrow}
          </p>
          <h2 className="mt-[clamp(10px,1.2vw,20px)] text-h2 leading-[1.1] text-ink">
            {delivery.heading[0]}
            <br className="hidden lg:block" /> {delivery.heading[1]}
          </h2>
        </Reveal>

        <div className="wrap mt-[clamp(40px,5vw,80px)] grid grid-cols-1 gap-[clamp(48px,6vw,90px)] lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
          <Reveal y={18} className="relative">
            <p className="font-display text-[clamp(18px,1.6vw,22px)] font-semibold text-lime">{delivery.longRoute.label.toUpperCase()}</p>
            <p className="mt-1 text-muted">{delivery.longRoute.tagline}</p>

            <div className="relative mt-10 flex flex-col gap-[52px] lg:flex-row lg:items-start lg:justify-between lg:gap-4">
              <Timeline />
              {delivery.longRoute.steps.map((step) => (
                <StepCircle key={step.label} step={step} />
              ))}
            </div>

            <div className="mt-8 flex items-center gap-2.5 border-t border-ink/10 pt-6">
              <Image src="/img/aminosan/icon-loss.svg" alt="" width={17} height={17} />
              <p className="text-muted">{delivery.longRoute.result}</p>
            </div>
          </Reveal>

          <div aria-hidden className="hidden w-px self-stretch bg-ink/10 lg:block" />

          <Reveal y={18} delay={0.08} className="relative">
            <p className="font-display text-[clamp(18px,1.6vw,22px)] font-semibold text-lime">{delivery.shortRoute.label.toUpperCase()}</p>
            <p className="mt-1 text-muted">{delivery.shortRoute.tagline}</p>

            <div className="mt-10 flex flex-col items-center gap-4">
              <div className="relative h-[110px] w-[240px] overflow-hidden rounded-2xl">
                <Image src="/img/aminosan/delivery-leaf.webp" alt="Leaf detail" fill className="object-cover" />
              </div>
              <Image src="/img/aminosan/icon-arrow-down.svg" alt="" width={24} height={24} />
              <div className="relative h-[147px] w-[203px]">
                <Image src="/img/aminosan/delivery-aminosan.webp" alt="Aminosan bottle" fill className="object-contain" />
              </div>
              <StepCircle step={{ icon: "/img/aminosan/icon-free-amino-acids.svg", label: delivery.shortRoute.stepLabel }} />
            </div>

            <div className="mt-8 flex items-center gap-2.5 border-t border-ink/10 pt-6">
              <Image src="/img/aminosan/icon-efficiency.svg" alt="" width={17} height={17} />
              <p className="text-[#257a44]">{delivery.shortRoute.result}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#e9eee0] py-[clamp(56px,7vw,124px)]">
        <div className="absolute inset-x-0 top-0 h-[38%] opacity-40">
          <Image src="/img/aminosan/comparison-foliage.webp" alt="" fill className="object-cover" />
        </div>

        <div className="wrap relative">
          <Reveal y={18} className="text-center">
            <h2 className="text-h2 text-ink">{comparison.heading}</h2>
          </Reveal>

          <Reveal
            y={18}
            delay={0.1}
            className="mx-auto mt-[clamp(36px,4vw,60px)] max-w-[1025px] overflow-hidden rounded-[20px] bg-white shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)]"
          >
            <div className="grid grid-cols-2">
              <div className="bg-[#0f522a] px-4 py-6 text-center text-white">
                <p className="font-display text-[clamp(20px,1.8vw,32px)] font-semibold text-lime">
                  {comparison.columns.aminosan.toUpperCase()}
                </p>
                <p className="mt-2 text-[13px] tracking-[0.08em] uppercase opacity-90">Free amino acids</p>
              </div>
              <div className="bg-[#7a7f7e] px-4 py-6 text-center text-white">
                <p className="font-display text-[clamp(18px,1.6vw,28px)] font-semibold">
                  {comparison.columns.others.split(" (")[0].toUpperCase()}
                </p>
                <p className="mt-2 text-[13px] tracking-[0.08em] uppercase opacity-90">(General category)</p>
              </div>
            </div>

            {comparison.rows.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-[clamp(20px,3vw,50px)] py-[clamp(18px,2.2vw,32px)] ${i > 0 ? "border-t border-ink/10" : ""}`}
              >
                <p className="text-center font-semibold text-[#0f522a]">{row.aminosan}</p>
                <p className="text-center text-[15px] text-muted">vs.</p>
                <p className="text-center text-muted">{row.others}</p>
              </div>
            ))}
          </Reveal>

          <Reveal y={12} delay={0.16} className="mt-[clamp(28px,3vw,44px)] text-center">
            <p className="font-display text-[clamp(11px,0.9vw,16px)] font-semibold tracking-[0.2em] text-[#004c26] uppercase">
              {comparison.tagline}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
