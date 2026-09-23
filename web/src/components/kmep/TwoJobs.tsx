"use client";

import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { SplitLines } from "@/components/motion/SplitLines";
import { gsap, useGSAP } from "@/lib/gsap";
import { eyebrow, fix, microCaps } from "./ui";

/* ------------------------------------------------------------ geometria */
/* A cena num quadro de 1200 × 440. Um rastro entra pela esquerda e se divide:
   o caminho A é curto e termina num mostrador de minutos (o dia da
   aplicação); o caminho B é longo, corre como uma régua da safra e termina
   na colheita. Traço fino e geométrico — nada de ícone de spray. */

const W = 1200;
const H = 440;
const SPLIT: [number, number] = [380, 220];

/* O mostrador do caminho A. */
const DIAL = { cx: 760, cy: 110, r: 52 };
const MINUTES = 20;
/* Ângulo em graus (SVG: 0 à direita, sentido horário) da marca `k` de 0 a 20:
   de 135° (baixo-esquerda) a 405° (baixo-direita), 270° de curso. */
const angle = (k: number) => 135 + (270 * k) / MINUTES;
const polar = (deg: number, r: number): [number, number] => {
  const rad = (deg * Math.PI) / 180;
  return [fix(DIAL.cx + r * Math.cos(rad)), fix(DIAL.cy + r * Math.sin(rad))];
};
const DIAL_TICKS = Array.from({ length: MINUTES + 1 }, (_, k) => {
  const major = k % 5 === 0;
  const [x1, y1] = polar(angle(k), major ? 42 : 46);
  const [x2, y2] = polar(angle(k), DIAL.r);
  const [lx, ly] = polar(angle(k), 66);
  return { k, major, x1, y1, x2, y2, lx, ly };
});
const [ARC_X0, ARC_Y0] = polar(angle(0), DIAL.r);
const [ARC_X1, ARC_Y1] = polar(angle(MINUTES), DIAL.r);
/* O ponteiro é desenhado já na posição final; a animação o traz de volta
   270° e deixa ele andar até ali. Sem JavaScript, a cena fica completa. */
const [NEEDLE_X, NEEDLE_Y] = polar(angle(MINUTES), 38);

/* A régua do caminho B. */
const B_Y = 330;
const B_FROM = 600;
const B_TO = 1176;
const B_TICKS = Array.from({ length: 25 }, (_, i) => B_FROM + i * 24);
const B_MARKS = [792, 960, B_TO];

const PATH_IN = `M20 ${SPLIT[1]} H${SPLIT[0]}`;
const PATH_A = `M${SPLIT[0]} ${SPLIT[1]} C450 ${SPLIT[1]} 470 ${DIAL.cy} 560 ${DIAL.cy} H${DIAL.cx - DIAL.r - 2}`;
const PATH_B = `M${SPLIT[0]} ${SPLIT[1]} C450 ${SPLIT[1]} 470 ${B_Y} 560 ${B_Y} H${B_TO}`;

/**
 * K5 — a Big Idea. Cena presa (o padrão do Converge da LP B): enquanto o
 * pin segura a tela, o rastro da passada se desenha, a bifurcação abre, o
 * mostrador de minutos gira depressa e a régua da safra acende devagar — as
 * duas escalas de tempo lado a lado. O fundo desce do creme para o floresta
 * por trás, e o título troca de cor na metade do pin, quando o degradê já
 * escureceu atrás dele.
 *
 * No celular, sem pin: a mesma linha do tempo presa ao scroll comum, e os
 * rótulos saem do desenho para uma legenda em HTML, legível em 360px.
 */
export function TwoJobs() {
  const { twoJobs } = useContent().kmep;
  const { scene } = twoJobs;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* Some com as faíscas no repouso (progresso 0 do scroll): sem isso
         elas piscam em 0,0 — origem do SVG — antes do timeline pegar. */
      gsap.set([".tj-spark-in", ".tj-spark-a", ".tj-spark-b"], { opacity: 0 });

      /* A linha do tempo da cena, em unidades de 0 a 1.
         O traço em si (`strokeDashoffset`) fica em `ease: "none"`: é ele que
         precisa andar 1:1 com o scroll, senão o desenho descola do gesto do
         dedo. O que dava a sensação seca não era essa parte — era tudo em
         volta dela acontecer aos saltos (liga/desliga). A faísca que corre
         na ponta do traço (`motionPath`, abaixo) e as transições de opacidade
         mais longas, com `sine`, é o que dá o ar de tinta correndo em vez de
         barra de progresso enchendo. */
      const build = (tl: gsap.core.Timeline) =>
        tl
          .fromTo(".tj-in", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.25, ease: "none" }, 0)
          .fromTo(".tj-start", { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.1, ease: "sine.out" }, 0)
          .fromTo(
            ".tj-spark-in",
            { opacity: 1 },
            { motionPath: { path: PATH_IN, alignOrigin: [0.5, 0.5] }, duration: 0.25, ease: "none" },
            0,
          )
          .fromTo(
            ".tj-split",
            { scale: 0, opacity: 0, svgOrigin: `${SPLIT[0]} ${SPLIT[1]}` },
            { scale: 1, opacity: 1, duration: 0.1, ease: "sine.out" },
            0.2,
          )
          .to(".tj-spark-in", { opacity: 0, duration: 0.05, ease: "sine.in" }, 0.22)
          .fromTo(".tj-a", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.2, ease: "none" }, 0.27)
          .fromTo(".tj-b", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.66, ease: "none" }, 0.27)
          .fromTo(
            ".tj-spark-a",
            { opacity: 1 },
            { motionPath: { path: PATH_A, alignOrigin: [0.5, 0.5] }, duration: 0.2, ease: "none" },
            0.27,
          )
          .fromTo(
            ".tj-spark-b",
            { opacity: 1 },
            { motionPath: { path: PATH_B, alignOrigin: [0.5, 0.5] }, duration: 0.66, ease: "none" },
            0.27,
          )
          .to(".tj-spark-a", { opacity: 0, duration: 0.05, ease: "sine.in" }, 0.42)
          .to(".tj-spark-b", { opacity: 0, duration: 0.05, ease: "sine.in" }, 0.88)
          .fromTo(".tj-dial", { opacity: 0 }, { opacity: 1, duration: 0.16, ease: "sine.out" }, 0.36)
          /* O mostrador corre inteiro num trecho curto… */
          .fromTo(".tj-arc", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.14, ease: "none" }, 0.47)
          .fromTo(
            ".tj-needle",
            { rotation: -270, svgOrigin: `${DIAL.cx} ${DIAL.cy}` },
            { rotation: 0, duration: 0.14, ease: "none" },
            0.47,
          )
          /* …e a régua da safra acende marca a marca, num aceso gradual (não
             num piscar), no compasso longo. */
          .fromTo(
            ".tj-tick",
            { opacity: 0.12, scaleY: 0.35, transformOrigin: "50% 50%" },
            { opacity: 1, scaleY: 1, duration: 0.05, stagger: 0.022, ease: "sine.out" },
            0.34,
          )
          .fromTo(".tj-label", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.1, stagger: 0.05, ease: "sine.out" }, 0.5)
          .fromTo(".tj-close", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }, 0.8);

      mm.add(
        {
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop, still } = ctx.conditions as { desktop: boolean; still: boolean };

          if (still) {
            build(gsap.timeline({ paused: true })).progress(1);
            return;
          }

          if (desktop) {
            gsap.fromTo(
              [".tj-heading", ".tj-lead", ".tj-eyebrow"],
              { color: "#16261B" },
              {
                color: "#EEEBE0",
                ease: "none",
                scrollTrigger: {
                  trigger: scope.current,
                  start: () => `top top-=${window.innerHeight * 0.6}`,
                  end: () => `top top-=${window.innerHeight * 0.95}`,
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              },
            );
          }

          build(
            gsap.timeline({
              defaults: { ease: "power2.out" },
              scrollTrigger: desktop
                ? { trigger: ".tj-stage", start: "top top", end: "+=110%", scrub: 0.8, pin: true, anticipatePin: 1 }
                : { trigger: ".tj-scene", start: "top 85%", end: "bottom 60%", scrub: 0.8 },
            }),
          );
        },
      );
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      className="relative overflow-hidden bg-[linear-gradient(180deg,var(--color-cream)_0%,var(--color-cream)_30%,var(--color-moss)_42%,var(--color-olive)_50%,#26371F_58%,var(--color-forest)_68%)] text-forest lg:bg-[linear-gradient(180deg,var(--color-cream)_0%,var(--color-cream)_7%,#A9B283_17%,var(--color-moss)_27%,var(--color-olive)_40%,#26371F_54%,var(--color-forest)_66%)]"
    >
      <div className="tj-stage relative flex min-h-[100svh] flex-col justify-center gap-[clamp(28px,5svh,56px)] py-[clamp(72px,10svh,120px)]">
        <div className="wrap grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-end lg:gap-16">
          <div>
            <p className={`tj-eyebrow ${eyebrow} text-moss`}>{twoJobs.eyebrow}</p>
            <SplitLines className="tj-heading mt-4 text-[clamp(48px,6.2vw,116px)] leading-[0.92] tracking-[-0.045em] text-balance">
              {twoJobs.heading}
            </SplitLines>
          </div>
          <p className={`tj-lead ${microCaps} text-[12px] text-forest/80`}>{twoJobs.lead}</p>
        </div>

        <div className="tj-scene wrap">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto max-h-[46svh] w-full overflow-visible" aria-hidden>
            <defs>
              {/* O brilho da faísca que corre na ponta do traço — sem ele o
                  ponto é só uma bolinha se movendo, seco igual ao resto. */}
              <filter id="tj-glow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* As rotas em fantasma, para o desenho ter onde correr. */}
            <g fill="none" stroke="#EEEBE0" strokeOpacity="0.14" strokeWidth="1">
              <path d={PATH_IN} />
              <path d={PATH_A} />
              <path d={PATH_B} />
            </g>

            <g fill="none" strokeLinecap="round">
              <path className="tj-in" d={PATH_IN} pathLength={1} strokeDasharray="1 1" stroke="#EEEBE0" strokeWidth="2" />
              <path className="tj-a" d={PATH_A} pathLength={1} strokeDasharray="1 1" stroke="#B7C73E" strokeWidth="2.5" />
              <path className="tj-b" d={PATH_B} pathLength={1} strokeDasharray="1 1" stroke="#EEEBE0" strokeWidth="1.5" />
            </g>

            {/* A faísca: a ponta acesa do traço, correndo à frente dele —
                é o que faz o preenchimento ler como tinta correndo, e não
                como uma barra de progresso enchendo. Some assim que chega
                onde o traço seguinte (ou o mostrador/régua) assume. */}
            <g filter="url(#tj-glow)">
              <circle className="tj-spark-in" r="4" fill="#EEEBE0" />
              <circle className="tj-spark-a" r="4.5" fill="#B7C73E" />
              <circle className="tj-spark-b" r="3.5" fill="#EEEBE0" />
            </g>

            <circle className="tj-start" cx="20" cy={SPLIT[1]} r="5" fill="#EEEBE0" />
            <g className="tj-split">
              <circle cx={SPLIT[0]} cy={SPLIT[1]} r="9" fill="none" stroke="#EEEBE0" strokeWidth="1.5" />
              <circle cx={SPLIT[0]} cy={SPLIT[1]} r="3.5" fill="#EEEBE0" />
            </g>

            {/* A régua da safra, no caminho B. */}
            <g stroke="#EEEBE0">
              {B_TICKS.map((x) => {
                const mark = B_MARKS.includes(x);
                return (
                  <line
                    key={x}
                    className="tj-tick"
                    x1={x}
                    x2={x}
                    y1={B_Y - (mark ? 12 : 5)}
                    y2={B_Y + (mark ? 12 : 5)}
                    strokeWidth={mark ? 1.5 : 1}
                  />
                );
              })}
            </g>

            {/* O mostrador de minutos, no caminho A. */}
            <g className="tj-dial">
              <circle cx={DIAL.cx} cy={DIAL.cy} r={DIAL.r} fill="rgba(7,7,9,0.25)" stroke="#EEEBE0" strokeOpacity="0.35" />
              {DIAL_TICKS.map((t) => (
                <line
                  key={t.k}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke="#EEEBE0"
                  strokeOpacity={t.major ? 0.9 : 0.45}
                  strokeWidth={t.major ? 1.5 : 1}
                />
              ))}
              <path
                className="tj-arc"
                d={`M${ARC_X0} ${ARC_Y0} A${DIAL.r} ${DIAL.r} 0 1 1 ${ARC_X1} ${ARC_Y1}`}
                pathLength={1}
                strokeDasharray="1 1"
                fill="none"
                stroke="#B7C73E"
                strokeWidth="3"
              />
              <line
                className="tj-needle"
                x1={DIAL.cx}
                y1={DIAL.cy}
                x2={NEEDLE_X}
                y2={NEEDLE_Y}
                stroke="#B7C73E"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx={DIAL.cx} cy={DIAL.cy} r="4" fill="#B7C73E" />
              <g className="max-lg:hidden" fill="#EEEBE0" fillOpacity="0.7" fontSize="12" textAnchor="middle">
                {DIAL_TICKS.filter((t) => t.major).map((t) => (
                  <text key={t.k} x={t.lx} y={fix(t.ly + 4)} className="font-display">
                    {t.k}
                  </text>
                ))}
              </g>
            </g>

            {/* Rótulos dentro do desenho só no desktop; no celular eles
                viram a legenda abaixo. */}
            <g className="font-display max-lg:hidden" fill="#EEEBE0">
              <text className="tj-label" x="20" y={SPLIT[1] - 22} fontSize="13" letterSpacing="2.4">
                {scene.pass.toUpperCase()}
              </text>
              <g className="tj-label">
                <text x="846" y="92" fontSize="13" letterSpacing="2.4" fill="#B7C73E">
                  {scene.jobA.tag.toUpperCase()} · {scene.jobA.clock.toUpperCase()}
                </text>
                <text x="846" y="122" fontSize="28" letterSpacing="-0.6">
                  {scene.jobA.title}
                </text>
                <text x="846" y="148" fontSize="14" fillOpacity="0.65">
                  {scene.jobA.time}
                </text>
              </g>
              <g className="tj-label">
                <text x={B_FROM} y={B_Y - 52} fontSize="13" letterSpacing="2.4" fill="#B7C73E">
                  {scene.jobB.tag.toUpperCase()}
                </text>
                <text x={B_FROM} y={B_Y - 24} fontSize="28" letterSpacing="-0.6">
                  {scene.jobB.title}
                </text>
                <text x={B_TO} y={B_Y - 24} fontSize="14" fillOpacity="0.65" textAnchor="end">
                  {scene.jobB.time}
                </text>
              </g>
              <g className="tj-label" fontSize="12" letterSpacing="1.8" fillOpacity="0.8">
                {scene.jobB.marks.map((mark, i) => (
                  <text key={mark} x={B_MARKS[i]} y={B_Y + 34} textAnchor={i === B_MARKS.length - 1 ? "end" : "middle"}>
                    {mark.toUpperCase()}
                  </text>
                ))}
              </g>
            </g>
          </svg>

          {/* A legenda do celular: os dois trabalhos lado a lado. */}
          <dl className="mt-6 grid grid-cols-2 gap-4 text-cream lg:hidden">
            {[scene.jobA, scene.jobB].map((job, i) => (
              <div key={job.tag} className="tj-label border-t border-cream/25 pt-3">
                <dt className={`${microCaps} text-[10px] ${i === 0 ? "text-lime" : "text-cream/70"}`}>{job.tag}</dt>
                <dd className="mt-1 font-display text-[19px] leading-[1.1] tracking-[-0.01em]">{job.title}</dd>
                <dd className={`${microCaps} mt-2 text-[10px] text-cream/65`}>{job.time}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="tj-close wrap font-display text-[clamp(24px,2.7vw,48px)] leading-[1.08] tracking-[-0.025em] text-balance text-cream">
          {twoJobs.close}
        </p>
      </div>
    </section>
  );
}
