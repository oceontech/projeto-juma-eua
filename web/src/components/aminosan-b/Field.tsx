"use client";

import { Fragment, useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { microCaps } from "./ui";

/**
 * A virada para o campo, logo depois da cena de partículas.
 *
 * Uma janela presa, três tempos:
 *
 *   1. o preto nasce **de onde a folha estava** — um círculo que abre do
 *      lado direito da tela até cobrir tudo —, e dentro dele a pergunta se
 *      forma como a frase da home (`home/Expertise.tsx`): escala, foco e
 *      brilho subindo em curvas separadas;
 *   2. a pergunta se desfaz em desfoque e a resposta entra: duas fotos lado
 *      a lado, sem e com Aminosan®, abrindo de baixo para cima;
 *   3. a comparação desce da folha à planta e da planta à raiz. Cada par
 *      novo sobe por cima do anterior, na mesma moldura, e o texto troca com
 *      o gesto que a cena de partículas usa: entra da esquerda saindo de um
 *      desfoque, sai para a direita.
 *
 * A seção sobe por cima do fim da cena de partículas (`-mt-[180svh]`, fundo
 * transparente): trava 0,8 tela antes de a cena soltar, com o círculo preto
 * dela ainda crescendo. É o que deixa a pergunta começar a se formar **antes**
 * de a tela ficar toda preta. O fundo preto desta seção só acende (BG_ON)
 * depois de o círculo cobrir tudo — cerca de 0,8 tela depois de a janela
 * travar: 0,8 ÷ 5,6 ≈ 0,143.
 *
 * Tudo em scrub, e portanto reversível. As imagens são ilustrativas e geradas
 * — ver o aviso em content/aminosan-b.ts antes de mexer na copy.
 */

/** Frações do curso da janela. */
const ASK_IN = { at: 0.1, run: 0.17 };
const BG_ON = 0.14;
const ASK_OUT = { at: 0.3, run: 0.07 };
/** Onde cada par de fotos começa a subir. */
const CHAPTER = [0.36, 0.58, 0.78];
const SHOT_RUN = 0.11;

export function Field() {
  const { field } = useContent().aminosanB;
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

            /* O fundo desta seção acende já com a tela toda preta — o círculo
               da cena anterior a cobriu antes —, então a troca não se vê. Pelo
               scroll **real** (onUpdate), e não por tween amortecido: num
               scroll rápido, um fundo atrasado deixava a cena anterior sair
               com nada preto por baixo. */
            tl
              /* A pergunta: forma e foco assentam cedo, o brilho sobe linear
                 — fica fraca um tempo e ganha corpo com o preto, como na home. */
              .set(".fd-ask", { opacity: 1 }, ASK_IN.at)
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
              /* Um respiro com a pergunta parada, e ela sai se desfazendo. */
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
              /* Os rótulos "sem / com" e o aviso entram com o primeiro par e
                 ficam: são a moldura da comparação inteira. */
              .fromTo(
                ".fd-label, .fd-note, .fd-rail",
                { opacity: 0 },
                { opacity: 1, duration: 0.04, stagger: 0.004 },
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
              const shots = ch.querySelectorAll(".fd-shot");
              const photos = ch.querySelectorAll(".fd-shot img");
              const lines = splits[k].lines;
              const rest = ch.querySelectorAll(".fd-fade");

              tl.set(ch, { opacity: 1 }, at)
                /* O par sobe por cima do anterior, primeiro o "sem", logo
                   depois o "com" — o olho lê na ordem da comparação. */
                .fromTo(
                  shots,
                  { clipPath: "inset(100% 0% 0% 0%)" },
                  {
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: SHOT_RUN,
                    stagger: 0.025,
                    ease: "power3.inOut",
                  },
                  at,
                )
                .fromTo(
                  photos,
                  { scale: 1.22 },
                  {
                    scale: 1,
                    duration: SHOT_RUN + 0.06,
                    stagger: 0.025,
                    ease: "power2.out",
                  },
                  at,
                )
                /* O texto entra quando o par já está quase de pé. */
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

              /* O anterior: o texto sai para a direita no começo da troca, e
                 as fotos recuam um pouco enquanto o par novo sobe por cima. */
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
                  photos,
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

            /* Um respiro com a raiz parada antes de soltar a seção. */
            tl.to({}, { duration: 0.02 }, 0.98);

            timeline = tl;
            ScrollTrigger.refresh();
          };

          /* O SplitText mede linha por linha: com a fonte de recurso o título
             quebraria no lugar errado e ficaria preso lá. */
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

  const total = String(field.chapters.length).padStart(2, "0");

  return (
    <section
      ref={scope}
      aria-label={field.headline.join(" ")}
      className="fd relative z-[1] -mt-[180svh] text-cream"
    >
      <div className="fd-stage relative h-[100svh] min-h-[640px] overflow-hidden">
        <div aria-hidden className="fd-black absolute inset-0 bg-[#060606]" />

        {/* A pergunta, sobre o preto. */}
        <div className="fd-ask pointer-events-none absolute inset-0 z-[2] grid place-content-center px-[var(--spacing-gut)] text-center opacity-0">
          <div className="fd-ask-in">
            <h2 className="text-[clamp(30px,5.2vw,96px)] leading-[1.06] tracking-[-0.02em] max-[860px]:text-[clamp(32px,9.5vw,46px)]">
              {field.headline.map((line, i) => (
                <Fragment key={line}>
                  {i > 0 && <br />}
                  <span className="lg:whitespace-nowrap">{line}</span>
                </Fragment>
              ))}
            </h2>
            <p className="mx-auto mt-[clamp(18px,1.7vw,32px)] max-w-[440px] text-[clamp(12px,0.95vw,16px)] text-cream/75 text-balance">
              {field.body}
            </p>
          </div>
        </div>

        {/* A comparação: três pares na mesma moldura, um por cima do outro. */}
        <div className="fd-chapters absolute inset-0 z-[3]">
          {field.chapters.map((c, k) => (
            <article
              key={c.kicker}
              data-c={k}
              className="fd-ch absolute inset-0 flex flex-col justify-center gap-6 px-[var(--spacing-gut)] opacity-0 lg:mx-auto lg:grid lg:max-w-[var(--container-wrap)] lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.6fr)] lg:items-center lg:gap-[clamp(32px,4vw,72px)]"
            >
              <div className="fd-text">
                <p
                  className={`${microCaps} fd-fade flex items-center gap-3 text-sage`}
                >
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
              </div>

              <div className="grid grid-cols-2 gap-[clamp(8px,1vw,16px)] lg:max-w-[calc(66svh*1.6+16px)] lg:justify-self-end">
                {(["without", "with"] as const).map((side) => (
                  <figure key={side} className="min-w-0">
                    <figcaption
                      className={`${microCaps} fd-label mb-2.5 flex items-center gap-2 ${side === "with" ? "text-lime" : "text-cream/55"}`}
                    >
                      <span
                        aria-hidden
                        className={`block size-1.5 rounded-full ${side === "with" ? "bg-lime" : "bg-cream/40"}`}
                      />
                      {field[side]}
                    </figcaption>
                    <div className="fd-shot relative aspect-[4/5] overflow-hidden rounded-[6px] bg-[#111]">
                      {/* `<img>` e não next/image: a foto já vem em webp no
                          tamanho certo, e o `scale` do GSAP precisa do
                          elemento de verdade, sem o wrapper do Image. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/img/aminosan-b/compare/${["leaf", "plant", "roots"][k]}-${side === "with" ? "t" : "u"}.webp`}
                        alt={c.alt[side]}
                        width={1792}
                        height={2240}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover"
                      />
                    </div>
                  </figure>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* O aviso fica na tela a comparação inteira — as fotos são geradas. */}
        <p className="fd-note absolute right-[var(--spacing-gut)] bottom-[clamp(16px,3svh,32px)] z-[4] text-[11px] text-cream/45 opacity-0">
          {field.note}
        </p>
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
