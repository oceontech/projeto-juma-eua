import { Fragment } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { Rule, SectionIntro } from "@/components/ui";
import { ImageCompare } from "./ImageCompare";
import { ProofStage } from "./ProofStage";
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
      </div>

      {/* O card cresce até a tela cheia e volta — a cena mora em
          ProofStage.tsx.

          O palco fica FORA do `.wrap`, e de propósito: é ele que dá a área de
          onde o card cresce, e uma área do tamanho do container faria o card
          em tela cheia transbordar para um lado só — grade e flex encostam no
          começo o que não cabe, em vez de centrar. Aqui a área é a tela
          inteira, o card em repouso recebe a largura do container por conta
          própria, e o crescimento fica centrado sem depender de alinhamento.

          Já os gatilhos de dentro dele apontam para a caixa da cena, e não
          para si mesmos: o conteúdo vive numa janela `sticky`, e um elemento
          sticky mede a própria posição já deslocada — as entradas
          disparariam na hora errada. */}
      <ProofStage>
        <ImageCompare trigger="[data-proof-stage]" start="top 64%" end="top 14%" />

        {/* Três colunas iguais, e não um flex centralizado com vão fixo: era
            aquele vão que deixava as três peças amontoadas no meio da barra
            com vazio nas duas pontas — o defeito ficava óbvio abaixo de
            1600px, onde a barra é larga e o texto é curto. */}
        <Reveal
          stagger={0.12}
          y={26}
          delay={0.1}
          trigger="[data-proof-stage]"
          start="top 60%"
          /* O fundo saiu daqui para `--proof-bar-bg`, no card: o painel da
             engolida nasce com ele e precisa do mesmo pixel. */
          className="proof-benefits mt-[clamp(18px,2.4vw,46px)] rounded-[clamp(12px,1.05vw,20px)] px-[clamp(16px,2vw,30px)] py-[clamp(24px,2.2vw,38px)]"
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

        {/* O painel da engolida: nasce sobre a barra acima e cresce até cobrir
            o card, que nessa altura é a tela. Vazio e inerte — só geometria e
            cor, escritas por ProofStage.tsx. */}
        <span data-proof-swallow aria-hidden className="proof-swallow" />
      </ProofStage>
    </section>
  );
}
