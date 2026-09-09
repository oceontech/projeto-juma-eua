import { Fragment } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { Rule, SectionIntro } from "@/components/ui";
import { ImageCompare } from "./ImageCompare";
import { proof } from "@/content/home";

/** A prova de campo: o comparador antes/depois e os três benefícios. */
export function PerformanceProof() {
  return (
    <section id="proof" data-nav-theme="dark" className="bg-black pb-sec">
      <div className="wrap">
        <SectionIntro
          className="mb-[clamp(30px,3vw,56px)]"
          aside={
            <Reveal delay={0.2} y={18}>
              <p className="font-light text-offwhite">{proof.body}</p>
            </Reveal>
          }
        >
          {/* O traço se desenha da esquerda para a direita e o título sobe
              linha a linha atrás dele — a mesma abertura da seção anterior. */}
          <Reveal scaleX={0} y={0}>
            <Rule className="mb-[clamp(18px,1.8vw,33px)]" />
          </Reveal>
          <SplitLines
            delay={0.08}
            className="text-h2 leading-[0.967] text-white"
          >
            {proof.headline.map((line, i) => (
              <Fragment key={line}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </SplitLines>
        </SectionIntro>

        <Reveal
          y={34}
          blur={8}
          className="rounded-[clamp(14px,1.25vw,24px)] bg-linear-[130.5deg,var(--color-night-warm)_2.4%,var(--color-night-deep)_60.23%] p-[clamp(20px,2.6vw,50px)]"
        >
          <ImageCompare />

          {/* Três colunas iguais, e não um flex centralizado com vão fixo: era
              aquele vão que deixava as três peças amontoadas no meio da barra
              com vazio nas duas pontas — o defeito ficava óbvio abaixo de
              1600px, onde a barra é larga e o texto é curto. */}
          <Reveal
            stagger={0.12}
            y={26}
            delay={0.1}
            className="proof-benefits mt-[clamp(18px,2.4vw,46px)] rounded-[clamp(12px,1.05vw,20px)] bg-linear-[136.8deg,#070709_4.26%,rgba(40,41,35,0.2)_98.7%,rgba(74,75,62,0.1)_106.3%] px-[clamp(16px,2vw,30px)] py-[clamp(24px,2.2vw,38px)]"
          >
            {proof.benefits.map((benefit) => (
              <div key={benefit.title} className="proof-benefit">
                <span aria-hidden className="proof-benefit__divider" />
                <Rule short className="proof-benefit__rule mb-[clamp(10px,1.2vw,23px)]" />
                <h3 className="mb-[clamp(6px,0.8vw,14px)] text-h3 font-semibold text-offwhite">
                  {benefit.title}
                </h3>
                <p className="text-[clamp(12px,1.05vw,18px)] leading-[1.5] text-offwhite/75">
                  {benefit.body}
                </p>
              </div>
            ))}
          </Reveal>
        </Reveal>
      </div>
    </section>
  );
}
