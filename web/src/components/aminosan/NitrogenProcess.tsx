import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { Pill, Rule, SectionIntro } from "@/components/ui";
import { getContent } from "@/lib/locale";

/**
 * Process — a rota longa contra a curta, no registro da home: preto, cartões
 * em degradê noturno, selos lima e entradas escalonadas por `Reveal`.
 *
 * A seção começa clara e escurece: o corte da hero acaba num branco chapado e
 * a janela dela esmaece por cima desta seção, então o primeiro palmo precisa
 * ser branco ou a revelação vira um corte de cor. A folha mora dentro dessa
 * passagem — é ela que dá assunto ao trecho em vez de deixar um degradê vazio
 * ocupando uma tela inteira.
 *
 * Server Component: todo o movimento vive em filhos de cliente.
 */
const enter = {
  replay: true,
  trigger: "#nitrogen-process",
  start: "top 55%",
} as const;

/** O mesmo gatilho para o bento, que fica abaixo da dobra da abertura. */
const bento = { replay: true, start: "top 78%" } as const;

export async function NitrogenProcess() {
  const { process } = (await getContent()).aminosan;
  const short = [process.cards.shortWay, process.cards.whatsInIt];

  return (
    <>
      {/* ---------------------------------------------------- a passagem */}
      {/* Do branco do vídeo ao preto da página, com a folha atravessando a
          emenda: ela entra ainda no claro e sai já no escuro, que é o que
          costura os dois fundos em vez de empilhá-los. */}
      <div className="aminosan-dawn">
        <Reveal
          y={0}
          blur={14}
          className="aminosan-dawn__leaf"
          start="top 92%"
          replay
        >
          <Image
            src="/img/aminosan/process-leaf.webp"
            alt=""
            aria-hidden
            width={612}
            height={408}
            sizes="(min-width: 1100px) 46vw, 88vw"
            className="h-auto w-full"
          />
        </Reveal>
      </div>

      {/* ------------------------------------------------------- a seção */}
      <div data-nav-theme="dark" className="pb-sec">
        <div className="wrap">
          <SectionIntro
            className="mb-[clamp(30px,3vw,56px)]"
            aside={
              <Reveal {...enter} delay={0.2} y={18} blur={8}>
                <p className="font-light text-offwhite/80">{process.eyebrow}</p>
              </Reveal>
            }
          >
            <Reveal {...enter} scaleX={0} y={0}>
              <Rule className="mb-[clamp(18px,1.8vw,33px)]" />
            </Reveal>
            <Reveal {...enter} delay={0.06} y={14}>
              <Pill className="mb-[clamp(14px,1.4vw,26px)]">{process.pill}</Pill>
            </Reveal>
            <SplitLines
              {...enter}
              delay={0.12}
              className="text-h2 leading-[0.967] text-white"
            >
              {process.heading}
            </SplitLines>
          </SectionIntro>

          {/* A rota longa ocupa a coluna larga e os dois resumos se empilham na
              estreita — a mesma divisão do bloco brasileiro na home. */}
          <div className="grid grid-cols-1 gap-[clamp(16px,1.5vw,20px)] min-[861px]:grid-cols-[785fr_555fr]">
            <Reveal
              as="article"
              {...bento}
              x={-44}
              blur={10}
              className="aminosan-night-card relative flex flex-col gap-[clamp(14px,1.65vw,32px)] overflow-hidden rounded-[clamp(12px,1.05vw,20px)] bg-linear-[122.93deg,var(--color-night-warm)_2.4%,var(--color-night-deep)_60.23%] p-[clamp(24px,2.6vw,50px)]"
            >
              <span
                aria-hidden
                className="aminosan-night-card__glow pointer-events-none absolute -top-[14%] -left-[6%] h-[40%] w-[34%] bg-[radial-gradient(closest-side,rgba(183,199,62,0.16),transparent)]"
              />
              <span className="relative self-start rounded-lg bg-lime p-2.5 text-[clamp(9px,0.7vw,13px)] leading-none font-semibold tracking-[0.15em] text-night uppercase">
                {process.cards.longWay.label}
              </span>
              {/* A cadeia é a própria ideia do cartão: cinco paradas antes de
                  virar aminoácido. Em lima, porque é o que o olho segue. */}
              <p className="relative font-display text-[clamp(15px,1.45vw,28px)] leading-[1.35] font-semibold text-lime-bright">
                {process.cards.longWay.formula}
              </p>
              <p className="relative mt-auto max-w-[52ch] leading-[1.5] font-light text-offwhite/75">
                {process.cards.longWay.body}
              </p>
            </Reveal>

            <div className="grid gap-[clamp(16px,1.5vw,20px)] min-[861px]:grid-rows-2">
              {short.map((card, i) => (
                <Reveal
                  key={card.label}
                  as="article"
                  {...bento}
                  delay={0.14 + i * 0.12}
                  x={44}
                  blur={10}
                  className="aminosan-night-card relative flex flex-col justify-between gap-[clamp(14px,1.6vw,28px)] overflow-hidden rounded-[clamp(12px,1.05vw,20px)] bg-night p-[clamp(24px,2.6vw,50px)]"
                >
                  <span className="relative self-start rounded-lg bg-lime px-4 py-[clamp(7px,0.55vw,10px)] text-[clamp(9px,0.7vw,13px)] leading-[1.2] font-semibold tracking-[0.15em] text-night uppercase">
                    {card.label}
                  </span>
                  <p className="relative leading-[1.5] font-light text-offwhite/75">
                    {card.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal {...bento} delay={0.34} y={18} className="mt-[clamp(20px,2vw,32px)]">
            <a
              href={process.cta.href}
              className="aminosan-cta inline-flex items-center gap-3 rounded-full bg-lime px-[clamp(22px,2vw,38px)] py-[clamp(14px,1.1vw,20px)] font-display text-[clamp(13px,1vw,17px)] font-semibold tracking-[0.02em] text-night"
            >
              {process.cta.label}
              <span aria-hidden className="aminosan-cta__arrow">
                →
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </>
  );
}
