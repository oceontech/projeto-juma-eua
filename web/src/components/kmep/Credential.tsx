"use client";

import { useRef } from "react";
import Image from "next/image";
import { useContent } from "@/components/layout/LocaleProvider";
import { Counter } from "@/components/motion/Counter";
import { SplitLines } from "@/components/motion/SplitLines";
import { gsap, useGSAP } from "@/lib/gsap";
import { eyebrow, microCaps } from "./ui";

/* O túnel de vento, num quadro de 600 × 360: o bico no teto, o ar correndo
   da esquerda, e as trajetórias das gotas — as grossas caem perto, as finas
   vão longe com o vento. É física de aplicação, o método do programa; não é
   dado de ensaio, e por isso não tem número. */
const TUNNEL = { x0: 24, x1: 580, top: 44, floor: 300 };
const NOZZLE_X = 150;
const COLLECTORS = Array.from({ length: 9 }, (_, i) => 176 + i * 47);
const FLIGHTS = [
  { to: COLLECTORS[0], bend: 10, w: 3.2 },
  { to: COLLECTORS[1], bend: 30, w: 2.6 },
  { to: COLLECTORS[2], bend: 70, w: 2 },
  { to: COLLECTORS[4], bend: 130, w: 1.5 },
  { to: COLLECTORS[6], bend: 200, w: 1.1 },
  { to: COLLECTORS[8], bend: 270, w: 0.8 },
].map((flight) => ({
  ...flight,
  d: `M${NOZZLE_X} ${TUNNEL.top + 20} C${NOZZLE_X + flight.bend * 0.15} ${TUNNEL.top + 120} ${flight.to - flight.bend * 0.25} ${TUNNEL.floor - 90} ${flight.to} ${TUNNEL.floor - 14}`,
}));
const AIRFLOW = [92, 140, 188, 236];

/* Os três cartões de contexto sobem em velocidades diferentes. */
const DRIFT = [
  { from: 60, to: -20 },
  { from: 110, to: -40 },
  { from: 160, to: -10 },
];

/**
 * K12 — a credencial. Tecnologia de aplicação como programa de pesquisa:
 * o parágrafo do DESATA, o desenho do método (túnel de vento: espectro,
 * deriva, deposição) e, embaixo, o bloco de contexto — estatística pública
 * da cigarrinha nos EUA, em cartões que sobem em compassos diferentes, como
 * os bilhetes do Inside da LP B.
 *
 * FIFRA: o bloco de contexto é dado público. Ele não atribui controle da
 * praga ao produto, e nada ao redor sugere isso.
 */
export function Credential() {
  const { credential } = useContent().kmep;
  const { context, scene } = credential;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const buildScene = (tl: gsap.core.Timeline) => {
        tl.fromTo(".cr-air", { strokeDashoffset: 0 }, { strokeDashoffset: -96, duration: 1.2, ease: "none" }, 0);
        FLIGHTS.forEach((flight, i) => {
          const at = 0.1 + i * 0.065;
          tl.fromTo(`.cr-flight-${i}`, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.68, ease: "none" }, at)
            .fromTo(
              `.cr-drop-${i}`,
              { opacity: 0 },
              { opacity: 1, motionPath: { path: flight.d }, duration: 0.68, ease: "none" },
              at,
            )
            .to(`.cr-drop-${i}`, { opacity: 0, duration: 0.1, ease: "sine.out" }, at + 0.62)
            .fromTo(`.cr-impact-${i}`, { opacity: 0, scale: 0.3, svgOrigin: `${flight.to} ${TUNNEL.floor - 11}` }, { opacity: 1, scale: 1, duration: 0.18, ease: "sine.out" }, at + 0.61);
        });
        return tl;
      };

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        buildScene(gsap.timeline({ scrollTrigger: { trigger: ".cr-scene", start: "top 85%", end: "bottom 35%", scrub: 0.8 } }));

        gsap.utils.toArray<HTMLElement>(".cr-card").forEach((card, i) => {
          gsap.fromTo(
            card,
            { y: DRIFT[i].from },
            {
              y: DRIFT[i].to,
              ease: "none",
              scrollTrigger: { trigger: ".cr-context", start: "top bottom", end: "bottom top", scrub: 0.6 },
            },
          );
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        buildScene(gsap.timeline({ paused: true })).progress(1);
      });
    },
    { scope },
  );

  return (
    <section ref={scope} data-nav-theme="dark" className="relative isolate overflow-hidden bg-night py-sec text-offwhite">
      <div className="wrap grid gap-[clamp(40px,5vw,80px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center">
        <div>
          <SplitLines className="max-w-[18ch] text-[clamp(32px,3.6vw,64px)] leading-[0.98] tracking-[-0.03em] text-balance">
            {credential.heading}
          </SplitLines>
          <p className={`${microCaps} mt-6 max-w-[56ch] text-[12px] text-offwhite/75`}>
            {credential.before}
            {credential.institutions}
            {credential.after}
          </p>
          <ul className="mt-7 flex flex-wrap gap-2">
            {credential.topics.map((topic) => (
              <li
                key={topic}
                className="rounded-full border border-offwhite/20 px-3.5 py-1.5 font-display text-[10px] tracking-[0.16em] text-offwhite/80 uppercase"
              >
                {topic}
              </li>
            ))}
          </ul>
        </div>

        <div className="cr-scene rounded-[clamp(14px,1.2vw,22px)] border border-offwhite/10 bg-linear-[122.93deg,var(--color-night-warm)_2.4%,var(--color-night-deep)_60.23%] p-[clamp(14px,2vw,28px)]">
          <svg viewBox="0 0 600 360" role="img" aria-label={credential.sceneAlt} className="w-full">
            {/* Estrutura e régua de leitura do túnel. */}
            <g stroke="#EEEBE0" strokeOpacity="0.4" fill="none">
              <line x1={TUNNEL.x0} x2={TUNNEL.x1} y1={TUNNEL.top} y2={TUNNEL.top} />
              <line x1={TUNNEL.x0} x2={TUNNEL.x1} y1={TUNNEL.top + 5} y2={TUNNEL.top + 5} strokeOpacity="0.14" />
              <line x1={TUNNEL.x0} x2={TUNNEL.x1} y1={TUNNEL.floor} y2={TUNNEL.floor} />
              {Array.from({ length: 7 }, (_, i) => (
                <line key={i} x1={TUNNEL.x0 + 4 + i * 5} x2={TUNNEL.x0 + 4 + i * 5} y1={TUNNEL.top + 6} y2={TUNNEL.floor - 6} strokeOpacity="0.25" />
              ))}
              {Array.from({ length: 13 }, (_, i) => (
                <line key={`tick-${i}`} x1={TUNNEL.x0 + 40} x2={TUNNEL.x0 + (i % 3 === 0 ? 50 : 45)} y1={TUNNEL.top + 50 + i * 17} y2={TUNNEL.top + 50 + i * 17} strokeOpacity="0.32" />
              ))}
            </g>

            {/* O ar. */}
            <g fill="none" stroke="#B9C2A0" strokeOpacity="0.45" strokeDasharray="12 12" strokeLinecap="round">
              {AIRFLOW.map((y) => (
                <path key={y} className="cr-air" d={`M${TUNNEL.x0 + 58} ${y} C230 ${y - 5} 410 ${y + 5} ${TUNNEL.x1 - 8} ${y}`} />
              ))}
            </g>
            <text x={TUNNEL.x0 + 44} y={TUNNEL.top + 24} className="font-display max-lg:hidden" fill="#B9C2A0" fontSize="12" letterSpacing="2">
              {scene.air.toUpperCase()} →
            </text>

            {/* O bico e as trajetórias. */}
            <g stroke="#EEEBE0" strokeWidth="1.5" fill="#070709">
              <path d={`M${NOZZLE_X} ${TUNNEL.top - 29} V${TUNNEL.top - 16}`} strokeOpacity="0.65" />
              <rect x={NOZZLE_X - 14} y={TUNNEL.top - 16} width="28" height="24" rx="3" />
              <line x1={NOZZLE_X - 9} x2={NOZZLE_X + 9} y1={TUNNEL.top - 8} y2={TUNNEL.top - 8} strokeOpacity="0.45" />
              <path d={`M${NOZZLE_X - 8} ${TUNNEL.top + 8} H${NOZZLE_X + 8} L${NOZZLE_X + 4} ${TUNNEL.top + 18} H${NOZZLE_X - 4} Z`} />
              <line x1={NOZZLE_X - 4} x2={NOZZLE_X + 4} y1={TUNNEL.top + 19} y2={TUNNEL.top + 19} stroke="#B7C73E" />
            </g>
            <text x={NOZZLE_X + 24} y={TUNNEL.top - 2} className="font-display max-lg:hidden" fill="#EEEBE0" fillOpacity="0.8" fontSize="12" letterSpacing="2">
              {scene.nozzle.toUpperCase()}
            </text>
            <g fill="none" strokeLinecap="round">
              {FLIGHTS.map((f, i) => (
                <path
                  key={f.to}
                  className={`cr-flight-${i}`}
                  d={f.d}
                  pathLength={1}
                  strokeDasharray="1 1"
                  stroke={i < 2 ? "#B7C73E" : "#EEEBE0"}
                  strokeOpacity={1 - i * 0.12}
                  strokeWidth={f.w}
                />
              ))}
            </g>
            {FLIGHTS.map((f, i) => (
              <circle key={`drop-${f.to}`} className={`cr-drop-${i}`} cx="0" cy="0" r={Math.max(1.8, f.w * 1.1)} fill={i < 2 ? "#B7C73E" : "#EEEBE0"} opacity="0" />
            ))}

            {/* Os coletores no piso. */}
            <g stroke="#EEEBE0" strokeOpacity="0.6" fill="none">
              {COLLECTORS.map((x, i) => (
                <g key={x}>
                  <path d={`M${x - 14} ${TUNNEL.floor - 14} V${TUNNEL.floor} H${x + 14} V${TUNNEL.floor - 14}`} />
                  <path d={`M${x - 10} ${TUNNEL.floor - 10} H${x + 10}`} strokeOpacity="0.25" />
                  <line x1={x} x2={x} y1={TUNNEL.floor + 2} y2={TUNNEL.floor + (i % 2 === 0 ? 8 : 5)} strokeOpacity="0.35" />
                </g>
              ))}
            </g>
            {FLIGHTS.map((f, i) => (
              <ellipse key={`impact-${f.to}`} className={`cr-impact-${i}`} cx={f.to} cy={TUNNEL.floor - 11} rx={Math.max(3, f.w * 1.5)} ry="1.8" fill={i < 2 ? "#B7C73E" : "#EEEBE0"} opacity="0" />
            ))}
            <text x={COLLECTORS[0] - 14} y={TUNNEL.floor + 30} className="font-display max-lg:hidden" fill="#EEEBE0" fillOpacity="0.7" fontSize="12" letterSpacing="2">
              {scene.collectors.toUpperCase()}
            </text>
          </svg>
        </div>
      </div>

      {/* Contexto: estatística pública. */}
      <div className="cr-context wrap mt-[clamp(72px,9vw,150px)] grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <div>
          <p className={`${eyebrow} text-lime-bright`}>{context.label}</p>
          <p className="mt-5 max-w-[30ch] font-display text-[clamp(22px,2vw,34px)] leading-[1.15] tracking-[-0.015em]">{context.body}</p>
          <p className={`${microCaps} mt-5 text-[10px] text-offwhite/55`}>{context.source}</p>
          <Image
            src="/img/kmep/cigarrinha-do-milho-parada.webp"
            alt="Cigarrinha-do-milho adulta em detalhe"
            width={768}
            height={288}
            unoptimized
            className="mt-8 h-auto w-full max-w-[400px]"
          />
        </div>

        <div className="relative grid grid-cols-3 gap-3 pt-6 lg:gap-4 lg:pt-0 lg:pb-[clamp(40px,5vw,80px)]">
          {context.stats.map((stat, i) => (
            <div
              key={stat.label}
              className="cr-card flex flex-col rounded-[clamp(12px,1.05vw,20px)] border border-kmep-light/30 bg-kmep p-[clamp(12px,1.6vw,24px)] text-offwhite"
              style={{ marginTop: `calc(${i} * clamp(0px, 3vw, 48px))` }}
            >
              <span aria-hidden className="block h-[2px] w-8 rounded-full bg-night" />
              <p className="mt-[clamp(28px,4vw,64px)] font-display text-[clamp(30px,4.2vw,76px)] leading-[0.85] tracking-[-0.045em]">
                {i < 2 ? <Counter to={stat.value} duration={1.6} /> : stat.value}
              </p>
              <p className={`${microCaps} mt-2 text-[10px] text-offwhite/75`}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
