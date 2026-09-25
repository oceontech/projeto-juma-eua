"use client";

import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { SplitLines } from "@/components/motion/SplitLines";
import { Soil } from "@/components/shared/Soil";
import { gsap, useGSAP } from "@/lib/gsap";
import { eyebrow, fix, microCaps } from "./ui";
import styles from "./TwoJobs.module.css";

/* ------------------------------------------------------------ geometria */
/* Uma passada que se bifurca em dois cartões. A largura de cada cartão já é
   a escala de tempo: o da safra (trabalho 1, o potássio) é largo e vem
   primeiro (7/12); o do minuto (trabalho 2, a ação desalojante) é estreito
   (5/12). A bifurcação sai da pílula "One pass", que fica sobre a emenda dos
   dois cartões, e desce até o centro de cada um. */

/* O quadro da bifurcação: a largura é esticada até a da grade
   (`preserveAspectRatio="none"`), a altura é 1:1 em pixels. As colunas não
   têm vão; o respiro entre os cartões é o `px` de cada coluna, igual dos
   dois lados, para o centro do cartão cair exatamente no centro da coluna. */
const FORK_W = 1200;
const FORK_H = 76;
const SEAM = (FORK_W * 7) / 12;
const A_X = SEAM / 2;
const B_X = SEAM + (FORK_W - SEAM) / 2;
/* Sai do pé da pílula, abre na horizontal a meia altura e desce reto até o
   cartão, com os cantos arredondados. O esticamento horizontal da grade é
   pequeno (1200 → ~1360), e o arco do canto quase não se deforma. */
const FORK_TOP = 34;
const FORK_MID = 54;
const R = 12;
const elbow = (x: number) => {
  const s = Math.sign(x - SEAM);
  return `M${SEAM} ${FORK_TOP} V${FORK_MID - R} Q${SEAM} ${FORK_MID} ${SEAM + s * R} ${FORK_MID} H${x - s * R} Q${x} ${FORK_MID} ${x} ${FORK_MID + R} V${FORK_H}`;
};
const FORK_A = elbow(A_X);
const FORK_B = elbow(B_X);

/* O mostrador do trabalho 2: 20 minutos num curso de 270°, abrindo embaixo. */
const GAUGE = { c: 100, r: 78 };
const MINUTES = 20;
const angle = (k: number) => 135 + (270 * k) / MINUTES;
const polar = (deg: number, r: number): [number, number] => {
  const rad = (deg * Math.PI) / 180;
  return [fix(GAUGE.c + r * Math.cos(rad)), fix(GAUGE.c + r * Math.sin(rad))];
};
const [ARC_X0, ARC_Y0] = polar(angle(0), GAUGE.r);
const [ARC_X1, ARC_Y1] = polar(angle(MINUTES), GAUGE.r);
const GAUGE_ARC = `M${ARC_X0} ${ARC_Y0} A${GAUGE.r} ${GAUGE.r} 0 1 1 ${ARC_X1} ${ARC_Y1}`;
const GAUGE_TICKS = Array.from({ length: MINUTES + 1 }, (_, k) => {
  const major = k % 5 === 0;
  const [x1, y1] = polar(angle(k), major ? 91 : 93);
  const [x2, y2] = polar(angle(k), 98);
  return { k, major, x1, y1, x2, y2 };
});

/* A régua da safra do trabalho 1, em % da largura. O primeiro trecho, em
   lima, é o dia da aplicação — o trabalho 2 inteiro cabe nele. */
const SLIVER = 1.6;
const STAGES = [40, 70, 100];
/* A linha do tempo da cena: onde a régua começa a correr e quanto dura. */
const BAR_AT = 0.44;
const BAR_LEN = 0.42;

/**
 * K5 — a Big Idea. Uma passada que se abre em dois cartões, e cada cartão
 * mostra a sua escala de tempo: a régua da safra do trabalho 1 (o potássio)
 * corre devagar, da aplicação até a colheita; o mostrador de minutos do
 * trabalho 2 (a ação desalojante, HOLD P2) dá a volta depressa. No desktop a cena fica presa (o padrão do
 * Converge da LP B) enquanto a bifurcação desce, os cartões sobem e os dois
 * relógios andam, cada um no seu compasso.
 *
 * Tudo que é texto está em HTML, legível e selecionável; o SVG é só traço.
 * Sem JavaScript ou com menos movimento, a cena chega completa.
 */
export function TwoJobs() {
  const { twoJobs } = useContent().kmep;
  const { scene } = twoJobs;
  const scope = useRef<HTMLElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const clock = { v: MINUTES };
      /* O traço da bifurcação é escrito direto no estilo, e não pelo tween
         de `strokeDashoffset` do GSAP: com `pathLength` no SVG esse tween
         não acompanhava a faísca, e o traço aparecia de uma vez. */
      const forkDraw = { p: 0 };
      const paintFork = (p: number) => {
        scope.current?.querySelectorAll<SVGPathElement>(".tj-fork").forEach((el) => {
          el.style.strokeDashoffset = String(fix(1 - p, 4));
        });
      };
      /* Sem isto as faíscas piscam na origem do SVG antes do timeline pegar. */
      gsap.set(".tj-spark", { opacity: 0 });

      /* Linha do tempo em unidades de 0 a 1. Os traços andam em
         `ease: "none"`, 1:1 com o scroll; o que entra e acende ao redor
         deles vai em `sine`, para não ler como liga/desliga. */
      const build = (tl: gsap.core.Timeline) =>
        tl
          .fromTo(".tj-pass", { opacity: 0, y: 14, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.1, ease: "sine.out" }, 0)
          .fromTo(
            forkDraw,
            { p: 0 },
            { p: 1, duration: 0.34, ease: "sine.inOut", onUpdate: () => paintFork(forkDraw.p) },
            0.06,
          )
          /* A faísca corre na ponta do traço, na mesma curva de tempo dele:
             é o que faz o preenchimento ler como tinta escorrendo da pílula
             até o cartão, e não como um risco que aparece. */
          .fromTo(
            ".tj-spark-a",
            { opacity: 1 },
            { motionPath: { path: FORK_A, alignOrigin: [0.5, 0.5] }, duration: 0.34, ease: "sine.inOut" },
            0.06,
          )
          .fromTo(
            ".tj-spark-b",
            { opacity: 1 },
            { motionPath: { path: FORK_B, alignOrigin: [0.5, 0.5] }, duration: 0.34, ease: "sine.inOut" },
            0.06,
          )
          .to(".tj-spark", { opacity: 0, duration: 0.05, ease: "sine.in" }, 0.37)
          .fromTo(
            ".tj-card",
            { opacity: 0, y: 48 },
            { opacity: 1, y: 0, duration: 0.16, stagger: 0.05, ease: "sine.out" },
            0.24,
          )
          .fromTo(".tj-node", { scale: 0 }, { scale: 1, duration: 0.06, ease: "back.out(3)" }, 0.36)
          /* O trabalho 1 corre inteiro num trecho curto… */
          .fromTo(".tj-arc", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.16, ease: "none" }, 0.4)
          .fromTo(
            clock,
            { v: 0 },
            {
              v: MINUTES,
              duration: 0.16,
              ease: "none",
              onUpdate: () => {
                if (count.current) count.current.textContent = String(Math.round(clock.v));
              },
            },
            0.4,
          )
          .fromTo(".tj-gauge-time", { opacity: 0.25 }, { opacity: 1, duration: 0.06, ease: "sine.out" }, 0.54)
          /* …e o trabalho 2 segue devagar, da aplicação até a colheita. */
          .fromTo(".tj-sliver", { scaleX: 0 }, { scaleX: 1, duration: 0.03, ease: "none" }, BAR_AT - 0.03)
          .fromTo(
            ".tj-fill",
            { clipPath: "inset(0% 100% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: BAR_LEN, ease: "none" },
            BAR_AT,
          )
          .fromTo(".tj-head", { left: "0%", opacity: 0 }, { left: "100%", opacity: 1, duration: BAR_LEN, ease: "none" }, BAR_AT)
          .fromTo(".tj-season", { opacity: 0.25 }, { opacity: 1, duration: 0.08, ease: "sine.out" }, BAR_AT + BAR_LEN * 0.4);

      /* Cada marco da safra acende quando a régua passa por ele. */
      const stages = (tl: gsap.core.Timeline) => {
        STAGES.forEach((pct, i) => {
          tl.fromTo(
            `.tj-mark-${i}`,
            { opacity: 0.3 },
            { opacity: 1, duration: 0.05, ease: "sine.out" },
            BAR_AT + (BAR_LEN * pct) / 100 - 0.03,
          );
        });
        return tl.fromTo(".tj-close", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.9);
      };

      mm.add(
        {
          /* Só prende quando a cena cabe inteira na altura da tela; abaixo
             disso, a mesma linha do tempo corre presa ao scroll comum. */
          pinned: "(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)",
          /* Celular: o título rola e as cenas (passada, os dois trabalhos)
             travam sob a barra enquanto a linha do tempo corre. */
          phone: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
          motion: "(prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { pinned, phone, still } = ctx.conditions as { pinned: boolean; phone: boolean; still: boolean };

          if (still) {
            stages(build(gsap.timeline({ paused: true }))).progress(1);
            return;
          }

          paintFork(0);
          stages(
            build(
              gsap.timeline({
                scrollTrigger: pinned
                  ? { trigger: ".tj-stage", start: "top top", end: "+=180%", scrub: 0.8, pin: true, anticipatePin: 1 }
                  : phone
                    ? { trigger: ".tj-scene", start: "top 11%", end: "+=200%", scrub: 0.8, pin: true, pinSpacing: true }
                    : { trigger: ".tj-scene", start: "top 85%", end: "bottom 55%", scrub: 0.8 },
              }),
            ),
          );
          /* Se o modo mudar no meio da sessão, o traço volta inteiro. */
          return () => paintFork(1);
        },
      );
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      data-nav-theme="dark"
      className="relative z-[2] text-cream"
    >
      <div className={`tj-stage ${styles.stage} relative flex min-h-[100svh] flex-col justify-center gap-[clamp(28px,4.5svh,52px)] py-[clamp(64px,8svh,104px)]`}>
        <Soil />
        <div className="wrap grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-end lg:gap-16">
          <div>
            <p className={`${eyebrow} text-lime`}>{twoJobs.eyebrow}</p>
            <SplitLines className="mt-4 text-[clamp(46px,5.6vw,100px)] leading-[0.92] tracking-[-0.045em] text-balance">
              {twoJobs.heading}
            </SplitLines>
          </div>
          <p className="max-w-[46ch] text-[16px] leading-[1.6] text-white lg:text-[17px]">{twoJobs.lead}</p>
        </div>

        <div className="tj-scene wrap">
          {/* A passada e a bifurcação. No celular, a pílula e um fio curto
              descendo até a pilha de cartões. */}
          <div className="relative flex flex-col items-center lg:block lg:h-[76px]">
            <p
              className={`tj-pass ${microCaps} relative z-10 inline-flex items-center gap-2.5 rounded-full border border-cream/30 bg-night/60 px-4 py-2 text-[11px] text-cream backdrop-blur-md lg:absolute lg:top-0 lg:left-[58.3333%] lg:-translate-x-1/2`}
            >
              <span aria-hidden className="size-1.5 rounded-full bg-lime shadow-[0_0_10px_var(--color-lime)]" />
              {scene.pass}
            </p>
            <span aria-hidden className="block h-6 w-px bg-cream/35 lg:hidden" />
            <svg
              viewBox={`0 0 ${FORK_W} ${FORK_H}`}
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible max-lg:hidden"
              aria-hidden
            >
              <defs>
                <filter id="tj-fork-glow" x="-300%" y="-300%" width="700%" height="700%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g fill="none" strokeWidth="1.5" strokeLinecap="round">
                <path d={FORK_A} stroke="#EEEBE0" strokeOpacity="0.12" />
                <path d={FORK_B} stroke="#EEEBE0" strokeOpacity="0.12" />
                <path
                  className="tj-fork"
                  d={FORK_A}
                  pathLength={1}
                  strokeDasharray="1 1"
                  stroke="#B7C73E"
                />
                <path
                  className="tj-fork"
                  d={FORK_B}
                  pathLength={1}
                  strokeDasharray="1 1"
                  stroke="#EEEBE0"
                  strokeOpacity="0.8"
                />
              </g>
              <g filter="url(#tj-fork-glow)">
                <circle className="tj-spark tj-spark-a" r="4.5" fill="#B7C73E" />
                <circle className="tj-spark tj-spark-b" r="4" fill="#EEEBE0" />
              </g>
            </svg>
          </div>

          <div className="grid gap-4 lg:-mx-3 lg:grid-cols-[7fr_5fr] lg:gap-0">
            {/* ------------------------------ trabalho 1: o potássio (a safra) */}
            <div className="lg:px-3">
              <article className="tj-card relative flex h-full flex-col rounded-[22px] border border-lime/25 bg-[radial-gradient(120%_80%_at_50%_0%,color-mix(in_srgb,var(--color-lime)_10%,transparent),transparent_70%)] p-5 sm:p-6 lg:p-7">
                <span
                  aria-hidden
                  className="tj-node absolute -top-[5px] left-1/2 -ml-[5px] size-[10px] rounded-full bg-lime shadow-[0_0_12px_var(--color-lime)] max-lg:hidden"
                />
                <p className={`${eyebrow} text-lime`}>{scene.potassium.tag}</p>

                {/* A régua da safra. Tudo em HTML, posicionado em %: o texto
                    fica nítido e a régua estica com o cartão. */}
                <div className="relative my-6 flex flex-1 flex-col justify-center lg:my-4">
                  <div className="flex items-end justify-between gap-3 whitespace-nowrap">
                    <p className="leading-none">
                      <span className="block font-display text-[22px] tracking-[-0.02em] text-lime">{scene.potassium.start}</span>
                    </p>
                    <p className={`tj-season ${microCaps} text-right text-[10px] text-cream`}>{scene.potassium.time} →</p>
                  </div>

                  <div className="relative mt-4 h-3">
                    <div className="absolute inset-0 rounded-full bg-cream/10" />
                    <div className="tj-fill absolute inset-0 rounded-full bg-[linear-gradient(90deg,var(--color-lime)_0%,var(--color-sage)_45%,var(--color-cream)_100%)] opacity-90" />
                    {/* O dia da aplicação: o trabalho 2 inteiro cabe aqui. */}
                    <div
                      className="tj-sliver absolute inset-y-[-5px] left-0 origin-left rounded-full bg-lime shadow-[0_0_14px_var(--color-lime)]"
                      style={{ width: `max(5px, ${SLIVER}%)` }}
                    />
                    <span
                      aria-hidden
                      className="tj-head absolute top-1/2 left-full size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream shadow-[0_0_16px_4px_color-mix(in_srgb,var(--color-cream)_55%,transparent)]"
                    />
                    {STAGES.map((pct, i) => (
                      <span
                        key={pct}
                        aria-hidden
                        className={`tj-mark-${i} absolute top-full mt-1.5 h-2.5 w-px bg-cream/70`}
                        style={{ left: pct === 100 ? "calc(100% - 1px)" : `${pct}%` }}
                      />
                    ))}
                  </div>

                  {/* No celular o marco do meio desce uma linha: em 360px
                      "Filling" (e "Enchimento", em PT) encostaria em "Harvest". */}
                  <ol className="relative mt-7 h-[34px] lg:h-4">
                    {scene.potassium.marks.map((mark, i) => (
                      <li
                        key={mark}
                        className={`tj-mark-${i} ${microCaps} absolute top-0 text-[10px] whitespace-nowrap text-cream/85 ${
                          STAGES[i] === 100 ? "right-0" : "-translate-x-1/2"
                        } ${i === 1 ? "max-lg:top-[18px]" : ""}`}
                        style={STAGES[i] === 100 ? undefined : { left: `${STAGES[i]}%` }}
                      >
                        {mark}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="mt-auto">
                  <h3 className="font-display text-[clamp(24px,2vw,32px)] leading-[1.05] tracking-[-0.02em]">
                    {scene.potassium.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.5] text-cream/65">{scene.potassium.body}</p>
                </div>
              </article>
            </div>

            {/* ------- trabalho 2: a ação desalojante (o minuto) — HOLD P2 */}
            <div className="lg:px-3">
              <article className="tj-card relative flex h-full flex-col rounded-[22px] border border-cream/15 bg-[radial-gradient(120%_80%_at_50%_0%,color-mix(in_srgb,var(--color-cream)_6%,transparent),transparent_70%)] p-5 sm:p-6 lg:p-7">
                <span
                  aria-hidden
                  className="tj-node absolute -top-[5px] left-1/2 -ml-[5px] size-[10px] rounded-full bg-cream shadow-[0_0_12px_var(--color-cream)] max-lg:hidden"
                />
                <p className={`${eyebrow} text-cream/80`}>{scene.flush.tag}</p>

                <div className="my-5 flex flex-col items-center lg:my-4">
                  <div className="relative w-[168px] lg:w-[min(176px,20svh)]">
                    <svg viewBox="0 0 200 200" className="block w-full overflow-visible" aria-hidden>
                      <defs>
                        <filter id="tj-glow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="3.5" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      {GAUGE_TICKS.map((t) => (
                        <line
                          key={t.k}
                          x1={t.x1}
                          y1={t.y1}
                          x2={t.x2}
                          y2={t.y2}
                          stroke="#EEEBE0"
                          strokeOpacity={t.major ? 0.7 : 0.3}
                          strokeWidth={t.major ? 1.5 : 1}
                        />
                      ))}
                      <path d={GAUGE_ARC} fill="none" stroke="#EEEBE0" strokeOpacity="0.1" strokeWidth="10" strokeLinecap="round" />
                      <path
                        className="tj-arc"
                        d={GAUGE_ARC}
                        pathLength={1}
                        strokeDasharray="1 1"
                        fill="none"
                        stroke="#EEEBE0"
                        strokeWidth="10"
                        strokeLinecap="round"
                        filter="url(#tj-glow)"
                      />
                    </svg>
                    <p className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                      <span
                        ref={count}
                        className="font-display text-[64px] leading-none tracking-[-0.05em] tabular-nums text-cream"
                      >
                        {MINUTES}
                      </span>
                      <span className={`${microCaps} mt-1 text-cream/70`}>min</span>
                    </p>
                  </div>
                  <p className={`tj-gauge-time ${microCaps} -mt-2 text-[10px] text-cream/70`}>{scene.flush.time}</p>
                </div>

                <div className="mt-auto">
                  <h3 className="font-display text-[clamp(24px,2vw,32px)] leading-[1.05] tracking-[-0.02em]">
                    {scene.flush.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.5] text-cream/65">{scene.flush.body}</p>
                </div>
              </article>
            </div>
          </div>
        </div>

<p className="tj-close wrap font-display text-[clamp(22px,2.2vw,38px)] leading-[1.12] tracking-[-0.025em] text-balance text-cream">
          {twoJobs.close}
        </p>
      </div>
    </section>
  );
}
