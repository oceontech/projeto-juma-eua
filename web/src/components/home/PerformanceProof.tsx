import { Fragment } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Rule, SectionIntro } from "@/components/ui";
import { ImageCompare } from "./ImageCompare";
import { proof } from "@/content/home";

/** A prova de campo: o comparador antes/depois e os três benefícios. */
export function PerformanceProof() {
  return (
    <section id="proof" className="bg-black pb-sec">
      <div className="wrap">
        <Reveal className="mb-[clamp(30px,3vw,56px)]">
          <SectionIntro
            aside={
              <p className="font-light text-offwhite">{proof.body}</p>
            }
          >
            <Rule className="mb-[clamp(18px,1.8vw,33px)]" />
            <h2 className="text-h2 leading-[0.967] text-white">
              {proof.headline.map((line, i) => (
                <Fragment key={line}>
                  {i > 0 && <br />}
                  {line}
                </Fragment>
              ))}
            </h2>
          </SectionIntro>
        </Reveal>

        <Reveal className="rounded-[clamp(14px,1.25vw,24px)] bg-linear-[130.5deg,var(--color-night-warm)_2.4%,var(--color-night-deep)_60.23%] p-[clamp(20px,2.6vw,50px)]">
          <ImageCompare />

          <div className="mt-[clamp(18px,2.4vw,46px)] flex flex-col items-center justify-center gap-[26px] rounded-[clamp(12px,1.05vw,20px)] bg-linear-[136.8deg,#070709_4.26%,rgba(40,41,35,0.2)_98.7%,rgba(74,75,62,0.1)_106.3%] px-[clamp(16px,2vw,30px)] py-[clamp(20px,1.75vw,22px)] text-center min-[861px]:flex-row min-[861px]:gap-[clamp(20px,5.2vw,100px)] min-[861px]:text-left">
            {proof.benefits.map((benefit, i) => (
              <Fragment key={benefit.title}>
                {i > 0 && (
                  <span
                    aria-hidden
                    className="h-px w-[90px] self-center bg-offwhite/20 min-[861px]:h-auto min-[861px]:min-h-[90px] min-[861px]:w-px min-[861px]:self-stretch"
                  />
                )}
                <div>
                  <Rule
                    className="mx-auto mb-[clamp(10px,1.2vw,23px)] w-[50px]! min-[861px]:mx-0"
                  />
                  <h3 className="mb-[clamp(6px,0.8vw,14px)] text-h3 font-semibold text-offwhite">
                    {benefit.title}
                  </h3>
                  <p className="text-[clamp(11px,1.05vw,18px)] text-offwhite">
                    {benefit.body}
                  </p>
                </div>
              </Fragment>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
