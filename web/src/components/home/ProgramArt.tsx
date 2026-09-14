import type { CSSProperties } from "react";
import s from "./ProgramArt.module.css";

/*
 * Ilustrações dos três cards de Programs. SVG inline e animação só em CSS:
 * nada de JS por quadro, e `prefers-reduced-motion` congela tudo num estado
 * final legível (ver o módulo CSS).
 */

const LIME = "#A8E63A";
const INK = "#0B0C0A";

const vars = (v: Record<string, string>) => v as CSSProperties;

/* ---------------------------------------------------------------- alvo */
const T_CX = 210;
const T_CY = 196;
const NOZZLES = [118, 150, 182, 210, 238, 270, 302];
const SWEEP_END = {
  x: T_CX + 150 * Math.cos(Math.PI / 5),
  y: T_CY - 150 * Math.sin(Math.PI / 5),
};

/** Olho no Alvo: as gotas saem da barra e convergem no centro da mira. */
export function TargetArt() {
  return (
    <svg viewBox="0 0 420 360" className={s.art} aria-hidden focusable="false">
      <defs>
        <linearGradient id="pa-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={LIME} stopOpacity="0" />
          <stop offset="1" stopColor={LIME} stopOpacity=".22" />
        </linearGradient>
        <radialGradient id="pa-core">
          <stop offset="0" stopColor={LIME} stopOpacity=".55" />
          <stop offset="1" stopColor={LIME} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* anéis e cruz da mira */}
      <g fill="none" stroke={LIME}>
        <circle cx={T_CX} cy={T_CY} r="150" strokeOpacity=".1" />
        <circle cx={T_CX} cy={T_CY} r="108" strokeOpacity=".16" />
        <circle cx={T_CX} cy={T_CY} r="66" strokeOpacity=".24" />
        <circle cx={T_CX} cy={T_CY} r="28" strokeOpacity=".4" />
        <path
          d={`M${T_CX} ${T_CY - 160}V${T_CY - 40}M${T_CX} ${T_CY + 40}V${T_CY + 160}M${T_CX - 170} ${T_CY}H${T_CX - 40}M${T_CX + 40} ${T_CY}H${T_CX + 170}`}
          strokeOpacity=".22"
        />
      </g>

      {/* varredura e anel tracejado girando */}
      <path
        className={`${s.rotate} ${s.targetOrigin}`}
        d={`M${T_CX} ${T_CY}L${T_CX + 150} ${T_CY}A150 150 0 0 0 ${SWEEP_END.x} ${SWEEP_END.y}Z`}
        fill="url(#pa-sweep)"
      />
      <circle
        className={`${s.rotateSlow} ${s.targetOrigin}`}
        cx={T_CX}
        cy={T_CY}
        r="128"
        fill="none"
        stroke={LIME}
        strokeOpacity=".35"
        strokeDasharray="1.5 9"
      />

      {/* barra de pulverização */}
      <g stroke={LIME} strokeLinecap="round">
        <path d="M96 14H324" strokeOpacity=".45" strokeWidth="2" />
        {NOZZLES.map((x) => (
          <path key={x} d={`M${x} 14v7`} strokeOpacity=".7" strokeWidth="2" />
        ))}
      </g>

      {/* gotas */}
      <g fill={LIME}>
        {NOZZLES.map((x, i) => (
          <circle
            key={x}
            className={s.drop}
            cx={x}
            cy="26"
            r="3.2"
            style={vars({
              "--dx": `${T_CX + (i - 3) * 4 - x}px`,
              "--dy": `${T_CY - 26}px`,
              "--delay": `${((i * 0.37) % 1.4).toFixed(2)}s`,
            })}
          />
        ))}
      </g>

      {/* impacto e trava da mira */}
      <circle className={s.glow} cx={T_CX} cy={T_CY} r="46" fill="url(#pa-core)" />
      <circle className={s.ripple} cx={T_CX} cy={T_CY} r="12" fill="none" stroke={LIME} strokeWidth="1.5" />
      <path
        className={s.lock}
        d={`M${T_CX - 44} ${T_CY - 26}v-18h18M${T_CX + 26} ${T_CY - 44}h18v18M${T_CX + 44} ${T_CY + 26}v18h-18M${T_CX - 26} ${T_CY + 44}h-18v-18`}
        fill="none"
        stroke={LIME}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx={T_CX} cy={T_CY} r="4.5" fill={LIME} />
    </svg>
  );
}

/* ---------------------------------------------------------- experiência */
/* As paradas ficam em zigue-zague com trechos idênticos, então cada uma cai
   num múltiplo exato de 25% do caminho — é isso que sincroniza o cometa com
   o acender de cada ícone. */
const STOPS = [
  { x: 30, y: 122, icon: "M0-4.5V0l3 2M7 0A7 7 0 1 1-7 0a7 7 0 0 1 14 0" }, // história
  { x: 105, y: 52, icon: "M-7 7V-1l4-3v3l4-3v3l4-3V-7h2V7Z" }, // fábrica
  { x: 180, y: 122, icon: "M-2.5-7h5M-1.5-7v5L-6 6h12L1.5-2v-5M-3.6 2h7.2" }, // laboratório
  { x: 255, y: 52, icon: "M-8-4H2v8H-8ZM2-1h3.5L8 2v2H2M-3.5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M6.5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" }, // logística
  { x: 330, y: 122, icon: "M-7-6H7v9H-1l-3.5 3.5V3H-7Z" }, // conversa
];

const ROUTE =
  "M30 122C67.5 122 67.5 52 105 52S142.5 122 180 122 217.5 52 255 52 292.5 122 330 122";

/** Juma Experience: um dia percorrendo a operação, parada por parada. */
export function ExperienceArt() {
  return (
    <svg viewBox="0 0 360 160" className={s.art} aria-hidden focusable="false">
      <path d={ROUTE} fill="none" stroke={LIME} strokeOpacity=".2" strokeDasharray="2 6" strokeLinecap="round" />
      <path className={s.trail} d={ROUTE} pathLength={100} fill="none" stroke={LIME} strokeOpacity=".55" strokeWidth="1.5" />
      <path className={s.comet} d={ROUTE} pathLength={100} fill="none" stroke={LIME} strokeWidth="4" strokeLinecap="round" />

      {STOPS.map((stop, i) => (
        <g key={stop.x} transform={`translate(${stop.x} ${stop.y})`}>
          <g className={s.stop} style={vars({ "--delay": `${(i * 1.415).toFixed(3)}s` })}>
            <circle className={s.stopHalo} r="17" fill="none" stroke="currentColor" />
            <circle r="17" fill={INK} stroke="currentColor" strokeOpacity=".7" />
            <path d={stop.icon} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
      ))}
    </svg>
  );
}

/* ----------------------------------------------------------------- 360 */
const C = 210;
const TICKS = Array.from({ length: 72 }, (_, i) => i * 5);
const REGIONS = [
  { a: -100, size: 7 },
  { a: -58, size: 5 },
  { a: -18, size: 6 },
  { a: 24, size: 5 },
  { a: 66, size: 7 },
  { a: 112, size: 5 },
  { a: 152, size: 6 },
  { a: 196, size: 5 },
  { a: 232, size: 6 },
].map(({ a, size }, i) => {
  const rad = (a * Math.PI) / 180;
  return {
    key: a,
    size,
    x: +(C + 150 * Math.cos(rad)).toFixed(2),
    y: +(C + 150 * Math.sin(rad)).toFixed(2),
    delay: `${((i * 0.61) % 3.2).toFixed(2)}s`,
  };
});

/** Juma 360: o time de todas as regiões convergindo para a mesma sala. */
export function Juma360Art() {
  return (
    <svg viewBox="0 0 420 420" className={s.art} aria-hidden focusable="false">
      <defs>
        <radialGradient id="pa-hub">
          <stop offset="0" stopColor={LIME} stopOpacity=".35" />
          <stop offset="1" stopColor={LIME} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* régua de 360° */}
      <g className={`${s.rotateSlow} ${s.centerOrigin}`} stroke={LIME}>
        {TICKS.map((deg) => {
          const long = deg % 30 === 0;
          return (
            <line
              key={deg}
              x1={C}
              y1={C - 196}
              x2={C}
              y2={C - (long ? 182 : 189)}
              strokeOpacity={long ? 0.55 : 0.22}
              transform={`rotate(${deg} ${C} ${C})`}
            />
          );
        })}
      </g>

      <circle
        className={`${s.rotateReverse} ${s.centerOrigin}`}
        cx={C}
        cy={C}
        r="170"
        fill="none"
        stroke={LIME}
        strokeWidth="2"
        strokeOpacity=".5"
        strokeDasharray="90 978"
        strokeLinecap="round"
      />
      <circle cx={C} cy={C} r="150" fill="none" stroke={LIME} strokeOpacity=".14" />
      <circle cx={C} cy={C} r="92" fill="none" stroke={LIME} strokeOpacity=".18" strokeDasharray="2 7" />

      {REGIONS.map(({ key, size, x, y, delay }) => (
        <g key={key}>
          <line x1={x} y1={y} x2={C} y2={C} stroke={LIME} strokeOpacity=".16" />
          <line
            className={s.pulse}
            x1={x}
            y1={y}
            x2={C}
            y2={C}
            pathLength={100}
            stroke={LIME}
            strokeWidth="2"
            strokeLinecap="round"
            style={vars({ "--delay": delay })}
          />
          <circle className={s.nodeHalo} cx={x} cy={y} r={size + 5} fill="none" stroke={LIME} style={vars({ "--delay": delay })} />
          <circle cx={x} cy={y} r={size} fill={INK} stroke={LIME} strokeWidth="1.5" />
          <circle cx={x} cy={y} r={size / 2.6} fill={LIME} />
        </g>
      ))}

      <circle className={s.glow} cx={C} cy={C} r="58" fill="url(#pa-hub)" />
      <circle className={s.ripple} cx={C} cy={C} r="22" fill="none" stroke={LIME} strokeWidth="1.5" />
      <circle cx={C} cy={C} r="24" fill={INK} stroke={LIME} strokeWidth="1.5" />
      <circle cx={C} cy={C} r="9" fill={LIME} />
    </svg>
  );
}
