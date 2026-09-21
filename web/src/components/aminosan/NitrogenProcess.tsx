import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Wipe } from "@/components/motion/Wipe";
import { SplitLines } from "@/components/motion/SplitLines";
import { Rule } from "@/components/ui";
import { getContent } from "@/lib/locale";
import { ProcessSeedling } from "./ProcessSeedling";

/**
 * Process — a rota longa contra a curta, em duas metades de tela cheia: a
 * folha e o título de um lado, o diagrama sobre papel do outro.
 *
 * É a primeira coisa que aparece quando a hero se desfaz: o corte dela acaba
 * num branco chapado, e daqui até o fim do palco do vídeo o fundo é o mesmo
 * branco — a janela da hero esmaece sobre uma superfície que já é a dela, sem
 * nenhuma emenda de cor para atravessar.
 *
 * As duas metades não levam `data-nav-theme`: a barra atravessa o escuro e o
 * claro ao mesmo tempo, e declarar um dos dois deixaria a tipografia dela
 * ilegível na outra. No tom claro o vidro da barra é branco, que é o que
 * sustenta a leitura também por cima da foto.
 *
 * Server Component: todo o movimento vive em filhos de cliente.
 */

/* A cadeia longa mora numa grade de duas colunas — a cápsula à esquerda, com
   largura fixa, e o nome do composto à direita. É essa largura que os
   chevrons usam para cair no eixo das cápsulas. */
const CHAIN_GRID =
  "grid grid-cols-[clamp(88px,9.4vw,142px)_1fr] items-center gap-x-[clamp(10px,1vw,18px)]";

/** Seta entre um elo e o seguinte. */
function Chevron() {
  return (
    <svg
      viewBox="0 0 14 8"
      aria-hidden
      className="h-2 w-3.5 text-ink/35"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 1.5L7 6.5L13 1.5" />
    </svg>
  );
}

export async function NitrogenProcess() {
  const { process } = (await getContent()).aminosan;
  const chain = process.longWay.steps;

  return (
    <>
      {/* --------------------------------------------- as duas metades */}
      <div className="grid grid-cols-1 items-stretch min-[900px]:grid-cols-2">
        {/* ------------------------------------------------- a folha */}
        {/* A foto é descoberta da esquerda para a direita; o texto tem entrada
            própria, por cima, para não ser varrido junto com ela. */}
        <div className="relative isolate min-h-[clamp(430px,88vw,620px)] overflow-hidden min-[900px]:min-h-[640px]">
          <Wipe replay start="top 82%" className="absolute inset-0">
            <Image
              src="/img/aminosan/process-corn-leaf.webp"
              alt=""
              aria-hidden
              fill
              quality={90}
              sizes="(min-width: 900px) 50vw, 100vw"
              className="object-cover object-center"
            />
            {/* O texto vive no pé da foto: sem esta cortina ele disputaria com
                o contraluz justamente onde ele é mais forte. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/88 via-black/45 to-black/5"
            />
          </Wipe>

          <div className="relative flex h-full flex-col justify-end p-[clamp(26px,3.6vw,68px)] pb-[clamp(34px,4vw,74px)]">
            <Reveal replay start="top 78%" delay={0.35} scaleX={0} y={0}>
              <Rule short className="mb-[clamp(16px,1.7vw,30px)]" />
            </Reveal>
            <SplitLines
              replay
              start="top 78%"
              delay={0.42}
              className="text-h2 leading-[1.02] text-white"
            >
              {process.heading[0]}
              <br />
              {process.heading[1]}
            </SplitLines>
            <Reveal replay start="top 78%" delay={0.62} y={16} blur={6}>
              <p className="mt-[clamp(14px,1.5vw,26px)] max-w-[46ch] text-[clamp(14px,1.05vw,19px)] leading-[1.55] font-light text-white/85">
                {process.body}
              </p>
            </Reveal>
          </div>
        </div>

        {/* ------------------------------------------------ o diagrama */}
        <div className="px-[clamp(24px,3.4vw,64px)] pt-[clamp(40px,4.6vw,86px)] pb-[clamp(36px,4vw,72px)]">
          {/* A linha do chão é a borda de baixo desta grade: ela atravessa as
              duas colunas, e a muda nasce em cima dela. */}
          <div className="grid h-full grid-cols-1 gap-[clamp(28px,3vw,52px)] border-b border-[#3F6B2E]/35 min-[900px]:grid-cols-[1fr_1px_1fr] min-[900px]:gap-[clamp(24px,2.6vw,48px)]">
            {/* ------------------------------------------ caminho longo */}
            <div className="min-[900px]:pb-[clamp(24px,2.6vw,44px)]">
              <Reveal replay start="top 82%" y={16} blur={6}>
                <p className="font-display text-[clamp(11px,0.95vw,15px)] font-semibold tracking-[0.18em] text-ink uppercase">
                  {process.longWay.label}
                </p>
                <p className="mt-[clamp(8px,0.9vw,14px)] max-w-[32ch] text-[clamp(12px,0.92vw,15px)] leading-[1.5] text-muted">
                  {process.longWay.body}
                </p>
              </Reveal>

              <Reveal
                as="ol"
                replay
                start="top 82%"
                y={14}
                blur={5}
                stagger={0.07}
                targetSelector="[data-chain-row]"
                className={`${CHAIN_GRID} mt-[clamp(22px,2.4vw,40px)]`}
              >
                {chain.map((step, i) => (
                  <li key={step.name} role="listitem" className="contents">
                    <span
                      data-chain-row=""
                      className={[
                        "flex h-[clamp(34px,3vw,50px)] items-center justify-center rounded-full px-3 text-center font-display font-semibold",
                        "text-[clamp(12px,1vw,17px)] leading-none whitespace-nowrap",
                        /* O último elo é o destino da cadeia: é o único que
                           muda de cor, e é assim que ele encerra a coluna. */
                        i === chain.length - 1
                          ? "bg-[#7C8A57] text-white"
                          : "bg-[#E3DFD4] text-ink",
                      ].join(" ")}
                    >
                      {step.name}
                    </span>
                    <span
                      data-chain-row=""
                      className="text-[clamp(11px,0.85vw,14px)] leading-[1.35] text-muted"
                    >
                      {step.note}
                    </span>

                    {i < chain.length - 1 && (
                      <>
                        <span
                          data-chain-row=""
                          aria-hidden
                          className="flex justify-center py-[clamp(6px,0.75vw,12px)]"
                        >
                          <Chevron />
                        </span>
                        <span aria-hidden />
                      </>
                    )}
                  </li>
                ))}
              </Reveal>
            </div>

            {/* O fio entre as colunas vira régua deitada quando elas empilham. */}
            <span aria-hidden className="hidden bg-ink/12 min-[900px]:block" />

            {/* ------------------------------------------ caminho curto */}
            <div className="flex flex-col">
              <Reveal replay start="top 82%" delay={0.1} y={16} blur={6}>
                <p className="font-display text-[clamp(11px,0.95vw,15px)] font-semibold tracking-[0.18em] text-[#4A7A33] uppercase">
                  {process.shortWay.label}
                </p>
                <p className="mt-[clamp(8px,0.9vw,14px)] max-w-[32ch] text-[clamp(12px,0.92vw,15px)] leading-[1.5] text-muted">
                  {process.shortWay.body}
                </p>
              </Reveal>

              <Reveal
                replay
                start="top 82%"
                delay={0.18}
                y={14}
                blur={5}
                className="mt-[clamp(22px,2.4vw,40px)] flex items-center gap-[clamp(10px,1vw,18px)]"
              >
                <span className="flex h-[clamp(34px,3vw,50px)] items-center justify-center rounded-full bg-[#2F5D33] px-[clamp(14px,1.4vw,26px)] font-display text-[clamp(12px,1vw,17px)] leading-none font-semibold whitespace-nowrap text-white">
                  {process.shortWay.step.name}
                </span>
                <span className="text-[clamp(11px,0.85vw,14px)] leading-[1.35] text-muted">
                  {process.shortWay.step.note}
                </span>
              </Reveal>

              <ProcessSeedling caption={process.shortWay.caption} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
