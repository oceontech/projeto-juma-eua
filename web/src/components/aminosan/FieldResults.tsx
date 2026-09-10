import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Pill, Rule } from "@/components/ui";
import { economics, trialEvidence, trialResults } from "@/content/aminosan";

export function FieldResults() {
  return (
    <section id="trial-results" className="bg-[#f6f7f2] py-[clamp(56px,7vw,124px)]">
      {/* --------------------------------------------------- Trial Results */}
      <div className="wrap">
        <Reveal y={16} className="mb-[clamp(24px,3vw,50px)] flex items-center gap-[clamp(12px,1.2vw,20px)]">
          <Pill>{trialResults.tagline}</Pill>
          <Rule short />
        </Reveal>

        <div className="grid grid-cols-1 gap-[clamp(16px,2vw,28px)] lg:grid-cols-[485fr_835fr]">
          <Reveal y={18}>
            <h2 className="text-h2 leading-[1.05] text-ink">{trialResults.heading}</h2>
          </Reveal>
          <Reveal y={18} delay={0.06} className="lg:justify-self-end">
            <p className="max-w-[46ch] font-light leading-[1.55] text-muted">{trialResults.description}</p>
          </Reveal>
        </div>

        <div className="mt-[clamp(32px,4vw,48px)] grid grid-cols-1 gap-[clamp(20px,2vw,30px)] lg:grid-cols-[397fr_902fr]">
          <Reveal y={20} className="flex flex-col gap-[clamp(20px,2.4vw,30px)] rounded-[20px] bg-[#0f522a] p-[clamp(28px,3vw,50px)]">
            <Image src="/img/aminosan/icon-notice.svg" alt="" width={49} height={49} />
            <p className="font-display text-[14px] font-semibold tracking-[0.05em] text-lime uppercase">
              {trialResults.notice.label}
            </p>
            <p className="font-display text-[24px] leading-[1.25] text-[#fdfdfd]">{trialResults.notice.heading}</p>
            <p className="leading-[1.5] text-[#fdfdfd]/90">{trialResults.notice.body}</p>
            <a
              href="#product-analysis"
              className="inline-flex w-fit items-center justify-center rounded-lg bg-lime px-8 py-4 font-medium text-[#0f522a] transition-colors hover:bg-[#c3d454]"
            >
              {trialResults.notice.cta}
            </a>
          </Reveal>

          <Reveal y={20} delay={0.08} className="overflow-x-auto rounded-[20px] border border-[#bdc4ba] bg-[#fdfdfd] p-[clamp(24px,2.6vw,50px)]">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-display text-[24px] text-ink">{trialResults.table.title.toUpperCase()}</p>
              <p className="text-[15px] text-muted">{trialResults.table.subtitle.toUpperCase()}</p>
            </div>

            <table className="mt-8 w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="text-[13px] font-semibold tracking-[0.04em] text-[#0f522a] uppercase">
                  {trialResults.table.columns.map((col) => (
                    <th key={col} className="pb-4 font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trialResults.table.rows.map((row, i) => (
                  <tr key={i} className="border-t border-ink/10 text-[15px] text-muted">
                    <td className="py-4">{row.crop}</td>
                    <td className="py-4">{row.location}</td>
                    <td className="py-4">{row.treated}</td>
                    <td className="py-4">{row.check}</td>
                    <td className="py-4 font-semibold text-ink">{row.difference}</td>
                    <td className="py-4">{row.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mt-8 text-[13px] leading-[1.5] text-muted">{trialResults.table.disclaimer}</p>
          </Reveal>
        </div>
      </div>

      {/* --------------------------------------------------- Trial Evidence */}
      <div className="wrap mt-[clamp(64px,7vw,100px)]">
        <Reveal y={16} className="mb-[clamp(24px,3vw,40px)] flex items-center gap-[clamp(12px,1.2vw,20px)]">
          <Pill className="text-center whitespace-normal">{trialEvidence.tagline}</Pill>
          <Rule className="hidden flex-1 sm:block" />
        </Reveal>

        <Reveal
          y={20}
          stagger={0.1}
          targetSelector="[data-evidence-card]"
          className="grid grid-cols-1 gap-[clamp(20px,2vw,30px)] lg:grid-cols-2"
        >
          {trialEvidence.cards.map((card) => (
            <div key={card.label} data-evidence-card="" className="overflow-hidden rounded-[20px] border border-[#acacac]">
              <button
                type="button"
                aria-label={`Play ${card.label} footage`}
                className="flex aspect-video w-full items-center justify-center bg-[#d9d9d9] transition-opacity hover:opacity-90"
              >
                <Image src="/img/aminosan/icon-play.svg" alt="" width={87} height={87} className="size-[clamp(56px,6vw,87px)]" />
              </button>
              <div className="p-[clamp(24px,2.6vw,40px)]">
                <Pill>{card.label}</Pill>
                <p className="mt-5 max-w-[46ch] leading-[1.55] text-muted">{card.body}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>

      {/* --------------------------------------------------- Economics */}
      <div className="wrap mt-[clamp(64px,7vw,100px)]">
        <Reveal y={18} className="grid grid-cols-1 gap-[clamp(16px,2vw,28px)] lg:grid-cols-[485fr_555fr]">
          <h2 className="text-h2 leading-[1.05] text-ink">
            {economics.heading[0]}
            <br /> {economics.heading[1]}
          </h2>
          <p className="max-w-[46ch] font-light leading-[1.55] text-muted lg:justify-self-end">{economics.description}</p>
        </Reveal>

        <div className="mt-[clamp(32px,4vw,48px)] grid grid-cols-1 gap-[clamp(20px,2vw,30px)] lg:grid-cols-[426fr_650fr_203fr]">
          <Reveal y={20} className="relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-[20px]">
            <Image src="/img/aminosan/econ-plant.webp" alt="Backlit plant leaves" fill className="object-cover" />
            <div className="relative z-10 bg-gradient-to-t from-black/70 to-transparent p-[clamp(24px,2.4vw,50px)] pt-24">
              <p className="font-display text-[14px] font-semibold tracking-[0.05em] text-lime uppercase">
                {economics.intro.eyebrow}
              </p>
              <p className="mt-3 font-display text-[24px] leading-[1.25] text-white">
                {economics.intro.heading[0]}
                <br /> {economics.intro.heading[1]}
              </p>
              <p className="mt-4 leading-[1.5] text-white/85">{economics.intro.body}</p>
            </div>
          </Reveal>

          <Reveal y={20} delay={0.06} className="rounded-2xl border border-[#bdc4ba] bg-[#fdfdfd] p-[clamp(24px,2.6vw,50px)]">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-display text-[24px] text-ink">{economics.chart.title.toUpperCase()}</p>
              <p className="text-[15px] text-muted">{economics.chart.hint}</p>
            </div>

            <div className="mt-8 flex flex-col gap-5">
              {economics.chart.bars.map((bar) => (
                <div key={bar.label} className="rounded-xl border border-dashed border-ink/15 bg-[repeating-linear-gradient(135deg,rgba(0,0,0,0.03)_0px,rgba(0,0,0,0.03)_8px,transparent_8px,transparent_16px)] px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-ink">
                      {bar.label} <span className="font-normal text-[#0f522a]">{bar.tag}</span>
                    </p>
                    <span className="text-[13px] text-muted">{economics.chart.pending}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-ink/10 pt-6">
              {economics.chart.bars.map((bar) => (
                <div key={bar.label} className="flex items-start gap-2.5">
                  <span className="mt-1 size-[14px] shrink-0 rounded-[3px]" style={{ background: bar.swatch }} />
                  <div>
                    <p className="text-[13px] font-semibold text-ink">{bar.label}</p>
                    <p className="text-[12px] text-muted">{economics.chart.pending}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal y={20} delay={0.12} className="hidden grid-rows-3 gap-3 lg:grid lg:h-[558px]">
            {["econ-leaf-detail.webp", "econ-leaf-detail.webp", "econ-leaf-detail.webp"].map((src, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl">
                <Image
                  src={`/img/aminosan/${src}`}
                  alt=""
                  fill
                  className="object-cover"
                  style={{ objectPosition: `${30 + i * 20}% ${20 + i * 25}%` }}
                />
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
