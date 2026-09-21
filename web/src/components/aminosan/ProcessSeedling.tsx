"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * A muda do caminho curto — o contorno já montado, a cor descendo por ele.
 *
 * O desenho nasce pronto: haste, folhas e nervuras são traço fixo, como
 * qualquer ilustração da página. O que a rolagem move é o preenchimento — um
 * retângulo recortado pelas próprias folhas, que cresce do topo para a base e
 * vai tingindo a planta de cima para baixo. É a cor do aminoácido da coluna
 * ao lado, a mesma cápsula que encerra a rota longa, escorrendo pela folha
 * que o absorveu.
 *
 * Como é um `scrub`, subir esvazia pelo mesmo caminho: a cor recua para o
 * topo em vez de piscar de volta ao início.
 */

type Leaf = {
  /** Onde a folha encosta na haste. */
  bx: number;
  by: number;
  /** A ponta. */
  tx: number;
  ty: number;
  /** Meia-largura no ponto mais cheio. */
  w: number;
};

/* Cinco folhas em leque, medidas na caixa de 340×470 do desenho. */
const LEAVES: Leaf[] = [
  { bx: 170, by: 252, tx: 192, ty: 56, w: 33 },
  { bx: 170, by: 296, tx: 44, ty: 192, w: 35 },
  { bx: 170, by: 310, tx: 308, ty: 210, w: 39 },
  { bx: 170, by: 390, tx: 28, ty: 344, w: 37 },
  { bx: 170, by: 400, tx: 318, ty: 362, w: 37 },
];

/** A haste: do chão até a base da folha central. */
const STEM = "M170 468L170 252";

/** A seta que leva o aminoácido da cápsula até a folha. */
const ARROW = ["M13 2L13 92", "M4 82L13 95L22 82"];

/** Altura total da caixa — o quanto o preenchimento precisa percorrer. */
const BOX_H = 470;

/** Traço do desenho e cor que o preenche (a mesma da cápsula "aminoácido"). */
const LINE = "#3F6B2E";
const FILL = "#7C8A57";

const r = (n: number) => Math.round(n * 10) / 10;

/** Eixo da folha e a normal dele — é disso que sai todo o resto. */
function axis({ bx, by, tx, ty }: Leaf) {
  const dx = tx - bx;
  const dy = ty - by;
  const len = Math.hypot(dx, dy) || 1;
  return { dx, dy, nx: -dy / len, ny: dx / len };
}

/** Contorno em lente: dois arcos espelhados entre a base e a ponta. */
function outline(leaf: Leaf) {
  const { dx, dy, nx, ny } = axis(leaf);
  const at = (t: number, o: number) =>
    `${r(leaf.bx + dx * t + nx * o)} ${r(leaf.by + dy * t + ny * o)}`;

  return [
    `M${leaf.bx} ${leaf.by}`,
    `C${at(0.14, leaf.w * 1.18)} ${at(0.66, leaf.w * 0.98)} ${r(leaf.tx)} ${r(leaf.ty)}`,
    `C${at(0.66, -leaf.w * 0.98)} ${at(0.14, -leaf.w * 1.18)} ${leaf.bx} ${leaf.by}`,
    "Z",
  ].join("");
}

/** Nervura central, com a curvatura mínima que tira o desenho do compasso. */
function midrib(leaf: Leaf) {
  const { dx, dy, nx, ny } = axis(leaf);
  const q = `${r(leaf.bx + dx * 0.5 + nx * leaf.w * 0.12)} ${r(leaf.by + dy * 0.5 + ny * leaf.w * 0.12)}`;
  return `M${leaf.bx} ${leaf.by}Q${q} ${r(leaf.tx)} ${r(leaf.ty)}`;
}

/* Três pares de nervuras por folha. Mais que isso vira textura e some na
   escala em que o desenho é lido. */
const VEIN_STOPS = [0.24, 0.42, 0.6];

/** Nervuras laterais: saem do eixo e morrem perto da borda, adiante. */
function veins(leaf: Leaf) {
  const { dx, dy, nx, ny } = axis(leaf);

  return VEIN_STOPS.flatMap((t) =>
    [1, -1].map((side) => {
      const u = Math.min(t + 0.24, 0.94);
      /* A borda da lente é aproximada por uma parábola: cheia no meio, nula
         nas duas pontas — perto o bastante do bézier para a nervura encostar
         nela sem atravessá-la. */
      const spread = leaf.w * 4 * u * (1 - u) * 0.82 * side;
      const mid = (t + u) / 2;

      return [
        `M${r(leaf.bx + dx * t)} ${r(leaf.by + dy * t)}`,
        `Q${r(leaf.bx + dx * mid + nx * spread * 0.35)} ${r(leaf.by + dy * mid + ny * spread * 0.35)}`,
        ` ${r(leaf.bx + dx * u + nx * spread)} ${r(leaf.by + dy * u + ny * spread)}`,
      ].join("");
    }),
  );
}

const SHAPES = LEAVES.map((leaf) => ({
  outline: outline(leaf),
  midrib: midrib(leaf),
  veins: veins(leaf),
}));

/* O recorte do preenchimento é o próprio desenho: as cinco folhas mais uma
   fatia fina no lugar da haste, que é traço e não teria área para tingir. */
const FILL_CLIP = "aminosan-seedling-fill";

export function ProcessSeedling({ caption }: { caption: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const pour = root.querySelector<SVGRectElement>("[data-pour]");
      if (!pour) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { animate } = context.conditions as { animate: boolean };

          /* Quem pediu menos movimento recebe a planta já cheia. */
          if (!animate) {
            gsap.set(pour, { attr: { height: BOX_H } });
            return;
          }

          gsap.fromTo(
            pour,
            { attr: { height: 0 } },
            {
              attr: { height: BOX_H },
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top 85%",
                end: "bottom 58%",
                scrub: 0.6,
              },
            },
          );
        },
      );
    },
    { scope },
  );

  return (
    <div ref={scope} className="relative mt-auto flex flex-col">
      {/* A seta liga a cápsula de aminoácidos à folha. */}
      <svg
        viewBox="0 0 26 100"
        aria-hidden
        className="h-[clamp(52px,7vw,96px)] w-[26px] shrink-0 self-start"
        fill="none"
        stroke={LINE}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {ARROW.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>

      <svg
        viewBox={`0 0 340 ${BOX_H}`}
        role="img"
        aria-label={caption}
        preserveAspectRatio="xMidYMax meet"
        className="mt-[clamp(10px,1.4vw,22px)] h-auto w-full max-w-[300px] min-[900px]:w-[78%] min-[900px]:max-w-none"
        fill="none"
        stroke={LINE}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          <clipPath id={FILL_CLIP}>
            <rect x="168.4" y="252" width="3.2" height="216" />
            {SHAPES.map((shape) => (
              <path key={shape.outline} d={shape.outline} />
            ))}
          </clipPath>
        </defs>

        {/* A cor desce por dentro do recorte; o traço fica por cima dela e
            continua legível com a folha cheia. */}
        <rect
          data-pour=""
          x="0"
          y="0"
          width="340"
          height="0"
          fill={FILL}
          stroke="none"
          clipPath={`url(#${FILL_CLIP})`}
        />

        <path d={STEM} strokeWidth={2.2} />

        {SHAPES.map((shape) => (
          <g key={shape.outline}>
            <path d={shape.outline} strokeWidth={2.2} />
            <path d={shape.midrib} strokeWidth={1.4} />
            {shape.veins.map((d) => (
              <path key={d} d={d} strokeWidth={1} opacity={0.7} />
            ))}
          </g>
        ))}
      </svg>

      {/* No largo a legenda ocupa a calha à direita do desenho, como no
          layout; no estreito ela volta para o fluxo, embaixo. */}
      <p className="mt-[clamp(12px,1.4vw,18px)] max-w-[22ch] text-[clamp(11px,0.85vw,14px)] leading-[1.45] text-muted min-[900px]:absolute min-[900px]:right-0 min-[900px]:bottom-[46%] min-[900px]:mt-0 min-[900px]:max-w-[15ch]">
        {caption}
      </p>
    </div>
  );
}
