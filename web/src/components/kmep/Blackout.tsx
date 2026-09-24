"use client";

import { Fragment, useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { microCaps } from "./ui";

/**
 * A virada para o preto, logo depois da cena de partículas — o mecanismo do
 * `aminosan-b/Field.tsx`, com uma diferença de princípio: **aqui não há par
 * sem/com**. O canônico do KMEP proíbe comparar duas plantas (docs/05, K10),
 * então cada capítulo é uma foto só, e a comparação que a página faz é a do
 * ensaio, em número, com a testemunha ao lado e a fonte embaixo.
 *
 * Uma janela presa, três tempos:
 *
 *   1. o preto já cobre a tela (o disco da cena anterior), e a frase se forma
 *      nele — escala, foco e brilho subindo em curvas separadas;
 *   2. a frase se desfaz em desfoque e o primeiro capítulo sobe;
 *   3. os capítulos se sucedem na mesma moldura, cada foto subindo por cima
 *      da anterior; o texto entra da esquerda saindo de um desfoque e sai
 *      para a direita, o gesto da cena de partículas. O último traz o ensaio.
 *
 * Versão A: o K4 (o que a perda custa) inteiro. Versão B: a perda que a
 * versão B deixou para depois do produto. A seção sobe por cima do fim da
 * cena (`-mt-[180svh]`, fundo transparente) pelo mesmo motivo do Field: a
 * frase começa a se formar antes de a tela ficar toda preta.
 */

/** Frações do curso da janela. */
const ASK_IN = { at: 0.1, run: 0.17 };
const BG_ON = 0.14;
const ASK_OUT = { at: 0.3, run: 0.07 };
/** Onde cada capítulo começa a subir. */
const CHAPTER = [0.36, 0.58, 0.78];
const SHOT_RUN = 0.11;

export function Blackout({ variant = "a" }: { variant?: "a" | "b" }) {
  const content = useContent().kmep;
  const blackout = variant === "b" ? content.blackoutB : content.blackoutA;
  const { proofBand } = content;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      const stage = root?.querySelector<HTMLElement>(".fd-stage");
      if (!root || !stage) return;

      const mm = gsap.matchMedia();
      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { animate } = context.conditions as { animate: boolean };
          if (!animate) {
            root.classList.add("fd-still");
            ScrollTrigger.refresh();
            return () => root.classList.remove("fd-still");
          }

          const html = document.documentElement;
          let alive = true;
          let timeline: gsap.core.Timeline | null = null;
          let splits: SplitText[] = [];

          const build = () => {
            const chapters = gsap.utils.toArray<HTMLElement>(".fd-ch", root);
            splits = chapters.map(
              (ch) =>
                new SplitText(ch.querySelector(".fd-head"), { type: "lines" }),
            );

            /* O cabeçalho do site lê o tom de fundo: escuro assim que o preto
               cobre o alto da tela, claro de novo fora da janela. */
            const tone = (p: number) => {
              if (p > BG_ON) html.dataset.navTheme = "dark";
              else delete html.dataset.navTheme;
            };
            const clear = () => delete html.dataset.navTheme;

            const bg = root.querySelector<HTMLElement>(".fd-black");
            const paint = (p: number) => {
              if (bg) bg.style.opacity = p > BG_ON ? "1" : "0";
            };

            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: stage,
                start: "top top",
                end: "+=560%",
                scrub: 0.7,
                pin: true,
                anticipatePin: 1,
                onUpdate: (self) => {
                  tone(self.progress);
                  paint(self.progress);
                },
                onRefresh: (self) => paint(self.progress),
                onLeave: clear,
                onLeaveBack: clear,
              },
            });

            tl.set(".fd-ask", { opacity: 1 }, ASK_IN.at)
              .fromTo(
                ".fd-ask-in",
                { scale: 0.88, filter: "blur(14px)" },
                {
                  scale: 1,
                  filter: "blur(0px)",
                  duration: ASK_IN.run,
                  ease: "power2.out",
                },
                ASK_IN.at,
              )
              .fromTo(
                ".fd-ask-in",
                { opacity: 0 },
                { opacity: 1, duration: ASK_IN.run },
                ASK_IN.at,
              )
              .to(
                ".fd-ask-in",
                {
                  opacity: 0,
                  scale: 1.04,
                  filter: "blur(16px)",
                  duration: ASK_OUT.run,
                  ease: "power1.in",
                },
                ASK_OUT.at,
              )
              .fromTo(
                ".fd-rail",
                { opacity: 0 },
                { opacity: 1, duration: 0.04 },
                CHAPTER[0] + 0.03,
              )
              .fromTo(
                ".fd-bar",
                { scaleX: 0 },
                { scaleX: 1, duration: 0.98 - CHAPTER[0] },
                CHAPTER[0],
              );

            chapters.forEach((ch, k) => {
              const at = CHAPTER[k];
              const shot = ch.querySelector(".fd-shot");
              const photo = ch.querySelector(".fd-shot img");
              const lines = splits[k].lines;
              const rest = ch.querySelectorAll(".fd-fade");

              tl.set(ch, { opacity: 1 }, at)
                .fromTo(
                  shot,
                  { clipPath: "inset(100% 0% 0% 0%)" },
                  {
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: SHOT_RUN,
                    ease: "power3.inOut",
                  },
                  at,
                )
                .fromTo(
                  photo,
                  { scale: 1.22 },
                  { scale: 1, duration: SHOT_RUN + 0.06, ease: "power2.out" },
                  at,
                )
                .fromTo(
                  lines,
                  { opacity: 0, x: -28, filter: "blur(10px)" },
                  {
                    opacity: 1,
                    x: 0,
                    filter: "blur(0px)",
                    duration: 0.05,
                    stagger: 0.01,
                    ease: "power3.out",
                  },
                  at + 0.05,
                )
                .fromTo(
                  rest,
                  { opacity: 0, x: -12, filter: "blur(4px)" },
                  {
                    opacity: 1,
                    x: 0,
                    filter: "blur(0px)",
                    duration: 0.045,
                    stagger: 0.008,
                    ease: "power2.out",
                  },
                  at + 0.07,
                );

              const next = CHAPTER[k + 1];
              if (next !== undefined) {
                tl.to(
                  ch.querySelector(".fd-text"),
                  {
                    opacity: 0,
                    x: 18,
                    filter: "blur(6px)",
                    duration: 0.03,
                    ease: "power2.in",
                  },
                  next,
                ).to(
                  photo,
                  {
                    scale: 0.94,
                    opacity: 0.4,
                    duration: SHOT_RUN,
                    ease: "power2.in",
                  },
                  next,
                );
              }
            });

            /* Um respiro com o ensaio parado antes de soltar a seção. */
            tl.to({}, { duration: 0.02 }, 0.98);

            timeline = tl;
            ScrollTrigger.refresh();
          };

          void (async () => {
            await document.fonts?.ready;
            if (alive) build();
          })();

          return () => {
            alive = false;
            timeline?.scrollTrigger?.kill();
            timeline?.kill();
            splits.forEach((s) => s.revert());
            delete html.dataset.navTheme;
          };
        },
      );
    },
    { scope },
  );

  const total = String(blackout.chapters.length).padStart(2, "0");

  return (
    <section
      ref={scope}
      aria-label={blackout.headline.join(" ")}
      className="fd relative z-[1] -mt-[180svh] text-cream"
    >
      <div className="fd-stage relative h-[100svh] min-h-[640px] overflow-hidden">
        <div aria-hidden className="fd-black absolute inset-0 bg-[#060606]" />

        {/* A frase, sobre o preto. */}
        <div className="fd-ask pointer-events-none absolute inset-0 z-[2] grid place-content-center px-[var(--spacing-gut)] text-center opacity-0">
          <div className="fd-ask-in">
            <h2 className="text-[clamp(30px,4.8vw,88px)] leading-[1.06] tracking-[-0.02em] text-balance max-[860px]:text-[clamp(30px,8.6vw,44px)]">
              {/* Duas linhas no desktop; no celular a frase corre inteira e
                  balanceada — a quebra forçada deixava uma palavra sozinha. */}
              {blackout.headline.map((line, i) => (
                <Fragment key={line}>
                  {i > 0 && " "}
                  <span className="lg:block lg:whitespace-nowrap">{line}</span>
                </Fragment>
              ))}
            </h2>
            <p className="mx-auto mt-[clamp(18px,1.7vw,32px)] max-w-[440px] text-[clamp(12px,0.95vw,16px)] text-cream/75 text-balance">
              {blackout.body}
            </p>
          </div>
        </div>

        {/* Os capítulos: uma foto cada, na mesma moldura, um por cima do outro. */}
        <div className="fd-chapters absolute inset-0 z-[3]">
          {blackout.chapters.map((c, k) => (
            <article
              key={c.kicker}
              className="fd-ch absolute inset-0 flex flex-col justify-center gap-5 px-[var(--spacing-gut)] opacity-0 lg:mx-auto lg:grid lg:max-w-[var(--container-wrap)] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:items-center lg:gap-[clamp(32px,4vw,72px)]"
            >
              <div className="fd-text">
                <p className={`${microCaps} fd-fade flex items-center gap-3 text-sage`}>
                  <span className="rounded-full border border-cream/25 px-[7px] py-[2px] tracking-[0.08em]">
                    {String(k + 1).padStart(2, "0")}/{total}
                  </span>
                  {c.kicker}
                </p>
                <h3 className="fd-head mt-3 max-w-[16ch] text-[clamp(26px,3vw,50px)] leading-[1.02] tracking-[-0.03em] text-balance">
                  {c.heading}
                </h3>
                <p className="fd-fade mt-3 max-w-[40ch] text-[clamp(13px,1.02vw,17px)] leading-[1.45] text-cream/70 lg:mt-4">
                  {c.body}
                </p>

                {/* O ensaio: o tratado em lima, a testemunha com o mesmo peso
                    ao lado, e a fonte embaixo — nenhum número sozinho. */}
                {c.proof && (
                  <div className="fd-fade mt-5 max-w-[420px] lg:mt-7">
                    <dl className="grid grid-cols-3 gap-px border border-cream/15 bg-cream/15">
                      {proofBand.stats.map((s, i) => (
                        <div key={s.label} className="bg-[#060606] px-3 py-3">
                          <dt className={`${microCaps} text-[10px] text-cream/55`}>{s.label}</dt>
                          <dd
                            className={`mt-1 text-[clamp(20px,1.9vw,30px)] leading-[1] tracking-[-0.02em] ${i === 0 ? "text-lime" : "text-cream"}`}
                          >
                            {s.prefix}
                            {s.value.toFixed(s.decimals)}
                            <span className="ml-1 text-[11px] tracking-normal text-cream/55">{s.unit}</span>
                          </dd>
                          {s.note && <dd className="mt-1 text-[11px] text-cream/55">{s.note}</dd>}
                        </div>
                      ))}
                    </dl>
                    <p className="mt-2.5 text-[11px] text-cream/45">{proofBand.source}</p>
                  </div>
                )}
              </div>

              {/* No celular o capítulo do ensaio tem o quadro dos números a mais:
                  a foto encolhe para os dois caberem na tela. */}
              <div
                className={`fd-shot relative aspect-[4/3] w-full overflow-hidden rounded-[6px] bg-[#111] lg:max-w-[calc(70svh*4/3)] lg:justify-self-end ${c.proof ? "max-lg:max-h-[24svh]" : "max-lg:max-h-[38svh]"}`}
              >
                {/* `<img>` e não next/image: o `scale` do GSAP precisa do
                    elemento de verdade, sem o wrapper do Image. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image}
                  alt={c.alt}
                  width={1600}
                  height={1195}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover"
                />
              </div>
            </article>
          ))}
        </div>

        <div
          aria-hidden
          className="fd-rail absolute bottom-[clamp(20px,3.4svh,38px)] left-[var(--spacing-gut)] z-[4] h-px w-[min(28vw,220px)] bg-cream/15 opacity-0"
        >
          <span className="fd-bar block h-full origin-left bg-cream/70" />
        </div>
      </div>
    </section>
  );
}
