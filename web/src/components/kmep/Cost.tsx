import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { getContent } from "@/lib/locale";
import { microCaps } from "./ui";

/**
 * K4. O que a perda custa até a colheita — no escuro, com o cobre marcando
 * custo: os dois blocos empilhados, cada um aberto por um fio cobre que se
 * desenha logo depois do bloco subir (o gesto do `.cv-line` da LP B), e o
 * fecho em linha própria.
 *
 * Nenhum número aqui: a seção descreve dinâmica agronômica e custo
 * operacional, e é por isso que ela publica sem depender da P2.
 *
 * Server Component: só texto e <Reveal>, nada que precise de estado.
 */
export async function Cost() {
  const { cost } = (await getContent()).kmep;

  return (
    <section data-nav-theme="dark" className="relative isolate overflow-hidden bg-night py-sec text-offwhite">
      <span
        aria-hidden
        className="absolute -top-[20%] -right-[10%] -z-10 h-[70%] w-[60%] bg-[radial-gradient(closest-side,rgba(203,53,27,0.14),transparent)]"
      />

      <div className="wrap grid gap-[clamp(40px,6vw,96px)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <SplitLines className="max-w-[13ch] text-[clamp(36px,4.4vw,80px)] leading-[0.96] tracking-[-0.035em] text-balance">
          {cost.heading}
        </SplitLines>

        <div className="lg:pt-[clamp(8px,1vw,16px)]">
          <Reveal>
            <p className="font-display text-[clamp(18px,1.5vw,24px)] leading-[1.25] tracking-[-0.01em] text-offwhite/70">
              {cost.intro}
            </p>
          </Reveal>

          <div className="mt-[clamp(32px,4vw,56px)] grid gap-[clamp(36px,4vw,56px)]">
            {cost.blocks.map((block, i) => (
              <article key={block.title}>
                <Reveal as="span" scaleX={0} y={0} delay={0.35 + i * 0.12} className="block h-[2px] w-full rounded-full bg-kmep">
                  {null}
                </Reveal>
                <Reveal delay={i * 0.12} y={60} className="pt-5">
                  <p className={`${microCaps} text-kmep-light`}>{block.kicker}</p>
                  <h3 className="mt-3 max-w-[22ch] text-[clamp(24px,2.3vw,40px)] leading-[1.05] tracking-[-0.025em]">
                    {block.title}
                  </h3>
                  <p className={`${microCaps} mt-4 max-w-[48ch] text-[12px] text-offwhite/65`}>{block.body}</p>
                </Reveal>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap mt-[clamp(64px,8vw,128px)]">
        <Reveal as="span" scaleX={0} y={0} className="block h-px w-full bg-offwhite/15">
          {null}
        </Reveal>
        <Reveal stagger={0.12} className="pt-[clamp(28px,3vw,44px)]">
          <p className="max-w-[26ch] font-display text-[clamp(26px,3vw,54px)] leading-[1.02] tracking-[-0.03em] text-offwhite/45">
            {cost.close[0]}
          </p>
          <p className="mt-2 font-display text-[clamp(26px,3vw,54px)] leading-[1.02] tracking-[-0.03em] text-offwhite">{cost.close[1]}</p>
        </Reveal>
      </div>
    </section>
  );
}
