import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { Pill, Rule } from "@/components/ui";
import { getContent } from "@/lib/locale";

/**
 * Um gatilho comum preserva a ordem da entrada quando a seção chega depois
 * da hero. O topo cruzando 50% da viewport faz o conteúdo nascer do meio da
 * tela, enquanto `replay` mantém a travessia reversível ao voltar o scroll.
 */
const enter = {
  replay: true,
  trigger: "#nitrogen-process",
  start: "top 50%",
} as const;

/**
 * Process: Rota curta vs rota longa e diferenciais técnicos do Aminosan®.
 * Surge com o fundo preto contínuo (#0C0C0E) após a transição da hero / folha.
 */
export async function NitrogenProcess() {
  const { process } = (await getContent()).aminosan;
  return (
    <div className="pt-[clamp(40px,5vw,72px)] pb-[clamp(28px,3vw,44px)]">
      <div className="wrap">
        <Reveal
          {...enter}
          y={16}
          className="mb-[clamp(14px,1.2vw,22px)] flex items-center gap-[clamp(12px,1.2vw,20px)]"
        >
          <Pill dark>{process.pill}</Pill>
          <Rule short />
        </Reveal>

        <div className="grid grid-cols-1 items-start gap-[clamp(24px,3vw,50px)] lg:grid-cols-[505fr_293fr]">
          <SplitLines
            {...enter}
            delay={0.08}
            className="text-h2 leading-[0.98] text-white"
          >
            {process.heading}
          </SplitLines>
          <Reveal
            {...enter}
            delay={0.14}
            x={44}
            y={18}
            blur={10}
            className="lg:justify-self-end"
          >
            <p className="max-w-[46ch] font-light leading-[1.55] text-offwhite/90">
              {process.eyebrow}
            </p>
          </Reveal>
        </div>

        <div className="mt-[clamp(28px,3vw,44px)] grid grid-cols-1 gap-[clamp(18px,1.5vw,24px)] lg:grid-cols-[1fr_1fr]">
          <Reveal
            {...enter}
            delay={0.22}
            x={-44}
            y={20}
            blur={10}
            className="relative min-h-[260px] overflow-hidden rounded-[20px] lg:min-h-full"
          >
            <Image
              src="/img/aminosan/process-leaf.webp"
              alt="Backlit leaf close-up"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </Reveal>

          <Reveal
            {...enter}
            x={44}
            y={20}
            blur={10}
            delay={0.3}
            stagger={0.12}
            targetSelector="[data-process-card]"
            className="aminosan-process-bento grid grid-cols-1 gap-[clamp(12px,1vw,18px)] sm:grid-cols-2"
          >
            <div
              data-process-card=""
              className="aminosan-process-card--long rounded-[20px] p-[clamp(20px,1.4vw,28px)] sm:col-span-2"
              style={{
                backgroundImage:
                  "linear-gradient(143deg, var(--color-night-warm) 2.4%, var(--color-night-deep) 60.2%)",
              }}
            >
              <p className="font-display text-[clamp(20px,1.5vw,28px)] font-semibold text-white">
                {process.cards.longWay.label}
              </p>
              <p className="mt-[clamp(9px,0.8vw,12px)] font-display text-[clamp(14px,0.9vw,16px)] text-lime-bright">
                {process.cards.longWay.formula}
              </p>
              <p className="mt-[clamp(9px,0.8vw,12px)] text-[clamp(14px,0.9vw,16px)] leading-[1.45] text-muted-dark">
                {process.cards.longWay.body}
              </p>
            </div>

            <div data-process-card="" className="aminosan-process-card--short rounded-[20px] bg-[#07070a] p-[clamp(18px,1.2vw,24px)]">
              <p className="font-display text-[clamp(17px,1.1vw,20px)] font-semibold text-white">
                {process.cards.shortWay.label}
              </p>
              <p className="mt-2 text-[14px] leading-[1.45] text-muted-dark">
                {process.cards.shortWay.body}
              </p>
            </div>

            <div data-process-card="" className="aminosan-process-card--contents rounded-[20px] bg-[#07070a] p-[clamp(18px,1.2vw,24px)]">
              <p className="font-display text-[clamp(17px,1.1vw,20px)] font-semibold text-white">
                {process.cards.whatsInIt.label}
              </p>
              <p className="mt-2 text-[14px] leading-[1.45] text-muted-dark">
                {process.cards.whatsInIt.body}
              </p>
            </div>

            <div
              data-process-card=""
              className="aminosan-process-card--cta sm:col-span-2"
            >
              <a
                href={process.cta.href}
                className="aminosan-process-card--cta-link flex w-full items-center justify-center rounded-[18px] bg-lime px-8 py-[clamp(16px,1.2vw,20px)] text-center font-display text-[clamp(16px,1.1vw,20px)] text-ink hover:bg-[#A6B534]"
              >
                {process.cta.label}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
