import { useId, type ReactNode } from "react";

type Stop = [offset: number, color: string, opacity?: number];

function Stops({ stops }: { stops: Stop[] }) {
  return stops.map(([offset, color, opacity = 1]) => (
    <stop
      key={offset}
      offset={offset}
      stopColor={color}
      stopOpacity={opacity}
    />
  ));
}

function Radial({
  id,
  stops,
  cx = "35%",
  cy = "30%",
  r = "75%",
}: {
  id: string;
  stops: Stop[];
  cx?: string;
  cy?: string;
  r?: string;
}) {
  return (
    <radialGradient id={id} cx={cx} cy={cy} r={r}>
      <Stops stops={stops} />
    </radialGradient>
  );
}

function Linear({
  id,
  stops,
  x1 = "0",
  y1 = "0",
  x2 = "0",
  y2 = "1",
  user,
}: {
  id: string;
  stops: Stop[];
  x1?: string;
  y1?: string;
  x2?: string;
  y2?: string;
  user?: boolean;
}) {
  return (
    <linearGradient
      id={id}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      gradientUnits={user ? "userSpaceOnUse" : undefined}
    >
      <Stops stops={stops} />
    </linearGradient>
  );
}

/** Pontilhado de ruído recortado pela forma: textura de casca, polpa, fibra. */
function Grain({ id, amount = 0.5 }: { id: string; amount?: number }) {
  return (
    <filter id={id} x="0" y="0" width="100%" height="100%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="1.1"
        numOctaves="2"
        seed="7"
        stitchTiles="stitch"
        result="noise"
      />
      <feColorMatrix
        in="noise"
        type="matrix"
        values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${amount * 1.6} 0 0 0 ${-amount * 0.8}`}
        result="speck"
      />
      <feComposite
        in="speck"
        in2="SourceGraphic"
        operator="in"
        result="clipped"
      />
      <feMerge>
        <feMergeNode in="SourceGraphic" />
        <feMergeNode in="clipped" />
      </feMerge>
    </filter>
  );
}

function star(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  points = 5,
) {
  return Array.from({ length: points * 2 }, (_, i) => {
    const radius = i % 2 ? inner : outer;
    const angle = (Math.PI / points) * i - Math.PI / 2;
    return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");
}

type Draw = (
  ref: (name: string) => string,
  id: (name: string) => string,
) => ReactNode;

const LEAF: Stop[] = [
  [0, "#A8DA6A"],
  [0.55, "#5FA441"],
  [1, "#2C6523"],
];

/*
 * Ilustrações com volume, no grid de 64: gradiente dá a forma, um brilho
 * especular marca a luz vinda do alto à esquerda e o ruído dá textura. As
 * partes que balançam na entrada levam `data-sway`.
 */
const ICONS: Record<string, Draw> = {
  blueberry: (ref, id) => (
    <>
      <defs>
        <Radial
          id={id("b1")}
          stops={[
            [0, "#A3B1EC"],
            [0.3, "#5C6BB8"],
            [0.78, "#2C3570"],
            [1, "#171C45"],
          ]}
        />
        <Radial
          id={id("b2")}
          stops={[
            [0, "#B2BEF0"],
            [0.32, "#6977C0"],
            [0.8, "#343E7C"],
            [1, "#1D234F"],
          ]}
        />
        <Radial
          id={id("bloom")}
          cx="40%"
          cy="35%"
          r="60%"
          stops={[
            [0, "#FFFFFF", 0.3],
            [1, "#FFFFFF", 0],
          ]}
        />
        <Radial
          id={id("spec")}
          cx="50%"
          cy="50%"
          r="50%"
          stops={[
            [0, "#FFFFFF", 0.85],
            [1, "#FFFFFF", 0],
          ]}
        />
        <Linear id={id("leaf")} x2="1" stops={LEAF} />
        <Grain id={id("grain")} amount={0.35} />
      </defs>
      <path
        data-sway
        d="M36 18c1-8 8-13 17-12-1 9-8 14-17 12Z"
        fill={ref("leaf")}
      />
      <path
        data-sway
        d="M38 17c4-3 8-6 12-9"
        stroke="#2A5E21"
        strokeWidth=".8"
        opacity=".6"
        fill="none"
      />
      <g filter={ref("grain")}>
        <circle cx="41" cy="30" r="13" fill={ref("b2")} />
        <circle cx="41" cy="30" r="13" fill={ref("bloom")} />
        <circle cx="25" cy="39" r="15" fill={ref("b1")} />
        <circle cx="25" cy="39" r="15" fill={ref("bloom")} />
      </g>
      <polygon points={star(43, 26, 3.6, 1.6)} fill="#141838" />
      <circle cx="43" cy="26" r="1" fill="#46518F" />
      <polygon points={star(27, 35, 4, 1.8)} fill="#10132E" />
      <circle cx="27" cy="35" r="1.1" fill="#3E4887" />
      <ellipse
        cx="18"
        cy="33"
        rx="4.5"
        ry="2.6"
        fill={ref("spec")}
        transform="rotate(-35 18 33)"
      />
      <ellipse
        cx="35"
        cy="24"
        rx="3.5"
        ry="2"
        fill={ref("spec")}
        transform="rotate(-35 35 24)"
      />
    </>
  ),
  watermelon: (ref, id) => (
    <>
      <defs>
        <Linear
          id={id("rind")}
          stops={[
            [0, "#6DB552"],
            [0.5, "#2F7A2C"],
            [1, "#16461A"],
          ]}
        />
        <Linear
          id={id("pith")}
          stops={[
            [0, "#F7FCEB"],
            [1, "#C9E4A6"],
          ]}
        />
        <Radial
          id={id("flesh")}
          cx="50%"
          cy="0%"
          r="100%"
          stops={[
            [0, "#FF9C88"],
            [0.5, "#F2483D"],
            [1, "#BC2622"],
          ]}
        />
        <Linear
          id={id("seed")}
          x2="1"
          stops={[
            [0, "#5A463A"],
            [1, "#120C09"],
          ]}
        />
        <Grain id={id("grain")} amount={0.45} />
      </defs>
      <g transform="rotate(-14 32 32)">
        <path d="M4 26h56a28 28 0 0 1-56 0Z" fill={ref("rind")} />
        <path
          d="M11 37c4 9 10 14 17 16M53 37c-4 9-10 14-17 16M22 49c3 3 6 4 10 4.5"
          stroke="#123D16"
          strokeWidth="2"
          opacity=".45"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M8.5 26h47a23.5 23.5 0 0 1-47 0Z" fill={ref("pith")} />
        <path
          d="M11.5 26h41a20.5 20.5 0 0 1-41 0Z"
          fill={ref("flesh")}
          filter={ref("grain")}
        />
        <path d="M11.5 26h41" stroke="#FFD5CC" strokeWidth="1.2" opacity=".7" />
        {[
          [22, 32, -20],
          [32, 37, 0],
          [42, 32, 20],
          [27, 41, -10],
          [37, 41, 10],
        ].map(([x, y, rot]) => (
          <g
            key={`${x}-${y}`}
            transform={`translate(${x} ${y}) rotate(${rot})`}
          >
            <path
              d="M0-3.2c1.5 1.3 1.9 2.8 1.3 4-.6 1.1-2 1.1-2.6 0-.6-1.2-.2-2.7 1.3-4Z"
              fill={ref("seed")}
            />
            <ellipse
              cx="-.4"
              cy="-.8"
              rx=".35"
              ry=".9"
              fill="#fff"
              opacity=".45"
            />
          </g>
        ))}
      </g>
    </>
  ),
  vegetables: (ref, id) => (
    <>
      <defs>
        <Linear
          id={id("body")}
          user
          x1="30"
          y1="30"
          x2="42"
          y2="40"
          stops={[
            [0, "#FFBE70"],
            [0.45, "#F5861F"],
            [1, "#A9480A"],
          ]}
        />
        <Linear id={id("leaf")} x2="1" stops={LEAF} />
        <Grain id={id("grain")} amount={0.4} />
      </defs>
      <path
        data-sway
        d="M44 21c-3-7-2-13 2-16 2 5 1 11-2 16Z"
        fill={ref("leaf")}
      />
      <path
        data-sway
        d="M45 22c3-6 9-8 14-6-3 5-8 7-14 6Z"
        fill={ref("leaf")}
      />
      <path data-sway d="M43 21c-5-4-11-4-15-1 5 3 10 3 15 1Z" fill="#3A7A30" />
      <path
        d="M47 24c3 3 1 7-2 10L22 57c-3 2-6-1-4-4L38 27c3-3 6-5 9-3Z"
        fill={ref("body")}
        filter={ref("grain")}
      />
      <path
        d="m31 37 4 3m-9 3 4 3m10-15 4 3m-17 17 3 2"
        stroke="#9A430A"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity=".7"
      />
      <path
        d="m30.6 36.4 3 2.2m-8 3.2 3 2.2m9-14.4 3 2.2"
        stroke="#FFE0B8"
        strokeWidth=".7"
        strokeLinecap="round"
        opacity=".7"
      />
      <path
        d="M41 27.5 23 49"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity=".32"
      />
    </>
  ),
  strawberry: (ref, id) => (
    <>
      <defs>
        <Radial
          id={id("body")}
          cx="38%"
          cy="32%"
          r="72%"
          stops={[
            [0, "#FF917A"],
            [0.38, "#E9382E"],
            [0.82, "#AE1D1D"],
            [1, "#801212"],
          ]}
        />
        <Linear
          id={id("calyx")}
          stops={[
            [0, "#8FCD58"],
            [1, "#2B6A22"],
          ]}
        />
        <Linear
          id={id("seed")}
          stops={[
            [0, "#FFF4B8"],
            [1, "#D9A935"],
          ]}
        />
        <Radial
          id={id("spec")}
          cx="50%"
          cy="50%"
          r="50%"
          stops={[
            [0, "#FFFFFF", 0.7],
            [1, "#FFFFFF", 0],
          ]}
        />
        <Grain id={id("grain")} amount={0.35} />
      </defs>
      <path
        d="M32 19c12-3 21 5 19 16-2 11-12 21-19 23-7-2-17-12-19-23-2-11 7-19 19-16Z"
        fill={ref("body")}
        filter={ref("grain")}
      />
      {[
        [24, 30],
        [32, 28],
        [40, 30],
        [21, 38],
        [29, 36],
        [37, 36],
        [44, 38],
        [26, 45],
        [34, 44],
        [40, 46],
        [31, 52],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <ellipse
            cx={x}
            cy={y + 0.3}
            rx="1.7"
            ry="2.3"
            fill="#7E1010"
            opacity=".5"
          />
          <ellipse cx={x - 0.2} cy={y} rx=".9" ry="1.4" fill={ref("seed")} />
        </g>
      ))}
      <ellipse
        cx="23"
        cy="29"
        rx="4.5"
        ry="7"
        fill={ref("spec")}
        transform="rotate(25 23 29)"
      />
      <path
        data-sway
        d="M18 19c5-2 9 1 14-3 5 4 9 1 14 3-3 5-9 5-14 3-5 2-11 2-14-3Z"
        fill={ref("calyx")}
        stroke="#24561C"
        strokeWidth=".5"
      />
      <path
        d="M32 18c0-4 1-8 4-10"
        stroke="#2E6A24"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </>
  ),
  citrus: (ref, id) => (
    <>
      <defs>
        <Radial
          id={id("rind")}
          cx="40%"
          cy="35%"
          r="70%"
          stops={[
            [0.75, "#FBAE2E"],
            [1, "#D4690B"],
          ]}
        />
        <Radial
          id={id("juice")}
          cx="50%"
          cy="50%"
          r="50%"
          stops={[
            [0, "#FFE9A6"],
            [0.55, "#FDBC3F"],
            [1, "#F29417"],
          ]}
        />
        <Radial
          id={id("gloss")}
          cx="50%"
          cy="50%"
          r="50%"
          stops={[
            [0, "#FFFFFF", 0.5],
            [1, "#FFFFFF", 0],
          ]}
        />
        <Linear id={id("leaf")} x2="1" stops={LEAF} />
        <Grain id={id("grain")} amount={0.45} />
      </defs>
      <path
        data-sway
        d="M44 14c4-6 10-7 15-5-3 6-9 8-15 5Z"
        fill={ref("leaf")}
      />
      <circle cx="30" cy="36" r="23" fill={ref("rind")} filter={ref("grain")} />
      <circle cx="30" cy="36" r="19.8" fill="#FFF2CF" />
      <g filter={ref("grain")}>
        {Array.from({ length: 8 }, (_, k) => {
          const a0 = ((k * 45 + 4) * Math.PI) / 180;
          const a1 = (((k + 1) * 45 - 4) * Math.PI) / 180;
          const p = (r: number, a: number) =>
            `${(30 + r * Math.cos(a)).toFixed(2)} ${(36 + r * Math.sin(a)).toFixed(2)}`;
          return (
            <path
              key={k}
              d={`M${p(3, a0)} L${p(17.6, a0)} A17.6 17.6 0 0 1 ${p(17.6, a1)} L${p(3, a1)} Z`}
              fill={ref("juice")}
            />
          );
        })}
      </g>
      {Array.from({ length: 8 }, (_, k) => {
        const angle = k * 45 + 22.5;
        return (
          <ellipse
            key={k}
            cx="30"
            cy="24.5"
            rx="1.1"
            ry="3"
            fill="#FFFFFF"
            opacity=".4"
            transform={`rotate(${angle + 90} 30 36)`}
          />
        );
      })}
      <circle cx="30" cy="36" r="2.4" fill="#FFF2CF" />
      <ellipse
        cx="22"
        cy="27"
        rx="9"
        ry="5"
        fill={ref("gloss")}
        transform="rotate(-35 22 27)"
      />
    </>
  ),
  tomato: (ref, id) => (
    <>
      <defs>
        <Radial
          id={id("body")}
          cx="35%"
          cy="33%"
          r="72%"
          stops={[
            [0, "#FFA088"],
            [0.32, "#F04C37"],
            [0.78, "#BE261B"],
            [1, "#851510"],
          ]}
        />
        <Linear
          id={id("calyx")}
          stops={[
            [0, "#7FC24F"],
            [1, "#255A1D"],
          ]}
        />
        <Radial
          id={id("spec")}
          cx="50%"
          cy="50%"
          r="50%"
          stops={[
            [0, "#FFFFFF", 0.8],
            [1, "#FFFFFF", 0],
          ]}
        />
        <Grain id={id("grain")} amount={0.25} />
      </defs>
      <path
        d="M32 18c11 0 20 7 20 18.5S44 57 32 57 12 48 12 36.5 21 18 32 18Z"
        fill={ref("body")}
        filter={ref("grain")}
      />
      <path
        d="M24 21c-4 8-4 22 2 34M40 21c4 8 4 22-2 34"
        stroke="#7A120C"
        strokeWidth="3"
        opacity=".14"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse
        cx="22"
        cy="31"
        rx="4.5"
        ry="7"
        fill={ref("spec")}
        transform="rotate(35 22 31)"
      />
      <circle cx="21" cy="27.5" r="1.2" fill="#FFFFFF" opacity=".85" />
      <polygon
        data-sway
        points={star(32, 21, 10, 3.2)}
        fill={ref("calyx")}
        stroke="#1F4D18"
        strokeWidth=".6"
        strokeLinejoin="round"
      />
      <path
        d="M32 21c0-4 2-8 5-9"
        stroke="#2E6A24"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </>
  ),
  "bell-pepper": (ref, id) => (
    <>
      <defs>
        <Linear
          id={id("body")}
          x2="1"
          y2="0"
          stops={[
            [0, "#8F160C"],
            [0.18, "#E2402F"],
            [0.38, "#F76A55"],
            [0.5, "#C82C1C"],
            [0.64, "#F2503D"],
            [0.85, "#BF2718"],
            [1, "#7C120A"],
          ]}
        />
        <Linear
          id={id("cap")}
          stops={[
            [0, "#8CCB58"],
            [1, "#2B6A22"],
          ]}
        />
        <Linear
          id={id("stem")}
          x2="1"
          stops={[
            [0, "#7DBE4E"],
            [1, "#2C6523"],
          ]}
        />
        <Grain id={id("grain")} amount={0.22} />
      </defs>
      <path
        d="M22 22c-8 2-10 14-6 24 3 8 10 10 16 6 6 4 13 2 16-6 4-10 2-22-6-24-4-2-8 0-10 2-2-2-6-4-10-2Z"
        fill={ref("body")}
        filter={ref("grain")}
      />
      <path
        d="M32 27v23"
        stroke="#6E0F08"
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".35"
      />
      <path
        d="M21 29c-2 6-2 13 0 19"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity=".5"
      />
      <path
        d="M38.5 30c-1 5-1 9 0 13"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".32"
      />
      <ellipse cx="32" cy="23" rx="8.5" ry="3.8" fill={ref("cap")} />
      <path
        data-sway
        d="M32 22c0-7 4-12 10-13"
        stroke={ref("stem")}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),
  ornamentals: (ref, id) => (
    <>
      <defs>
        <Radial
          id={id("petal")}
          cx="50%"
          cy="100%"
          r="100%"
          stops={[
            [0, "#FFFFFF"],
            [0.3, "#FBD0DD"],
            [1, "#DC6A8A"],
          ]}
        />
        <Radial
          id={id("center")}
          cx="40%"
          cy="35%"
          r="70%"
          stops={[
            [0, "#FFF0A0"],
            [1, "#DE8E0E"],
          ]}
        />
        <Linear id={id("leaf")} x2="1" stops={LEAF} />
        <Grain id={id("grain")} amount={0.2} />
      </defs>
      <path
        d="M32 36v22"
        stroke="#34702A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        data-sway
        d="M32 50c-2-7-9-10-15-8 3 6 9 9 15 8Z"
        fill={ref("leaf")}
      />
      <g data-sway>
        <g filter={ref("grain")}>
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={angle}
              cx="32"
              cy="16"
              rx="7"
              ry="10.5"
              fill={ref("petal")}
              transform={`rotate(${angle} 32 27)`}
            />
          ))}
        </g>
        {[0, 72, 144, 216, 288].map((angle) => (
          <path
            key={angle}
            d="M32 24V9"
            stroke="#C9506F"
            strokeWidth=".7"
            opacity=".35"
            transform={`rotate(${angle} 32 27)`}
          />
        ))}
        <circle cx="32" cy="27" r="5.5" fill={ref("center")} />
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <circle
            key={angle}
            cx="32"
            cy="23.5"
            r=".8"
            fill="#A3580A"
            transform={`rotate(${angle} 32 27)`}
          />
        ))}
      </g>
    </>
  ),
  pasture: (ref, id) => (
    <>
      <defs>
        <Radial
          id={id("glow")}
          cx="50%"
          cy="50%"
          r="50%"
          stops={[
            [0, "#FFF6C2"],
            [0.45, "#FFD35C"],
            [1, "#FFC94A", 0],
          ]}
        />
        <Linear
          id={id("blade")}
          stops={[
            [0, "#C2E77A"],
            [1, "#2B6523"],
          ]}
        />
        <Linear
          id={id("blade2")}
          stops={[
            [0, "#8FCB58"],
            [1, "#1F4F1A"],
          ]}
        />
        <Linear
          id={id("soil")}
          stops={[
            [0, "#8E6D47"],
            [1, "#4E3822"],
          ]}
        />
        <Grain id={id("grain")} amount={0.5} />
      </defs>
      <circle cx="46" cy="16" r="11" fill={ref("glow")} />
      <path
        d="M6 56.5c9-3.2 43-3.2 52 0V60H6Z"
        fill={ref("soil")}
        filter={ref("grain")}
      />
      <path
        data-sway
        d="M20 57c1-12-3-22-12-29 11 3 17 14 17 29Z"
        fill={ref("blade")}
      />
      <path
        data-sway
        d="M28 57c-2-16 2-30 10-40-3 13-3 26 0 40Z"
        fill={ref("blade2")}
      />
      <path
        data-sway
        d="M36 57c2-12 9-20 20-24-9 7-13 14-14 24Z"
        fill={ref("blade")}
      />
      <path
        data-sway
        d="M30 55c-1-12 2-25 7-34"
        stroke="#E3F5B5"
        strokeWidth=".7"
        opacity=".5"
        fill="none"
      />
    </>
  ),
  corn: (ref, id) => {
    const kernels: ReactNode[] = [];
    for (let row = 0; row < 8; row++) {
      const y = 12 + row * 5;
      const half = 12 * Math.sqrt(Math.max(0, 1 - ((y - 31) / 25) ** 2));
      for (const dx of [-7.5, -2.5, 2.5, 7.5]) {
        if (Math.abs(dx) + 2.2 < half) {
          kernels.push(
            <ellipse
              key={`${row}${dx}`}
              cx={32 + dx}
              cy={y}
              rx="2.35"
              ry="2.15"
              fill={ref("kernel")}
            />,
          );
        }
      }
    }
    return (
      <>
        <defs>
          <Radial
            id={id("kernel")}
            cx="35%"
            cy="30%"
            r="70%"
            stops={[
              [0, "#FFF4B0"],
              [0.5, "#F6C53B"],
              [1, "#B97C0E"],
            ]}
          />
          <Linear
            id={id("cob")}
            x2="1"
            y2="0"
            stops={[
              [0, "#C98E18"],
              [0.5, "#E9B233"],
              [1, "#9A6A0C"],
            ]}
          />
          <Linear id={id("husk")} x2="1" stops={LEAF} />
          <Linear
            id={id("husk2")}
            x1="1"
            x2="0"
            stops={[
              [0, "#78B94A"],
              [1, "#1F4F1A"],
            ]}
          />
        </defs>
        <path
          d="M32 7c8 0 12 12 12 27 0 12-5 20-12 20s-12-8-12-20C20 19 24 7 32 7Z"
          fill={ref("cob")}
        />
        {kernels}
        <path
          d="M31 7c-2-3-1-5 1-6M33 7c1-3 3-4 5-4"
          stroke="#C9A36A"
          strokeWidth=".8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          data-sway
          d="M32 58C19 54 11 40 13 20c6 13 12 23 19 27Z"
          fill={ref("husk")}
        />
        <path
          data-sway
          d="M30 55C21 50 15 40 15 27"
          stroke="#2A5E21"
          strokeWidth=".7"
          opacity=".5"
          fill="none"
        />
        <path
          data-sway
          d="M32 58c13-4 21-18 19-38-6 13-12 23-19 27Z"
          fill={ref("husk2")}
        />
        <path
          data-sway
          d="M34 55c9-5 15-15 15-28"
          stroke="#BFE58E"
          strokeWidth=".7"
          opacity=".4"
          fill="none"
        />
      </>
    );
  },
  soybean: (ref, id) => (
    <>
      <defs>
        <Linear
          id={id("pod")}
          stops={[
            [0, "#B3DA78"],
            [1, "#447F29"],
          ]}
        />
        <Radial
          id={id("bean")}
          cx="40%"
          cy="32%"
          r="70%"
          stops={[
            [0, "#D6EFA0"],
            [0.6, "#86BE4E"],
            [1, "#467F2A"],
          ]}
        />
        <Grain id={id("grain")} amount={0.55} />
      </defs>
      <path
        d="M50 12c-2 4-5 6-8 7"
        stroke="#34702A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <g data-sway transform="rotate(-38 32 32)">
        <g filter={ref("grain")}>
          <rect x="14" y="23" width="36" height="18" rx="9" fill={ref("pod")} />
          <circle cx="21" cy="32" r="9" fill={ref("bean")} />
          <circle cx="32" cy="32" r="9" fill={ref("bean")} />
          <circle cx="43" cy="32" r="9" fill={ref("bean")} />
        </g>
        <path
          d="M13 32h38"
          stroke="#3E7424"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity=".7"
        />
        <rect
          x="12.5"
          y="21.5"
          width="39"
          height="21"
          rx="10.5"
          fill="none"
          stroke="#EEF6CF"
          strokeWidth=".9"
          strokeDasharray=".5 1.4"
          opacity=".55"
        />
        <ellipse
          cx="20"
          cy="28"
          rx="3.2"
          ry="1.8"
          fill="#FFFFFF"
          opacity=".35"
        />
        <ellipse
          cx="31"
          cy="28"
          rx="3.2"
          ry="1.8"
          fill="#FFFFFF"
          opacity=".35"
        />
        <ellipse
          cx="42"
          cy="28"
          rx="3.2"
          ry="1.8"
          fill="#FFFFFF"
          opacity=".35"
        />
      </g>
    </>
  ),
  cotton: (ref, id) => (
    <>
      <defs>
        <Radial
          id={id("lobe")}
          cx="40%"
          cy="35%"
          r="70%"
          stops={[
            [0, "#FFFFFF"],
            [0.6, "#F3F1E8"],
            [1, "#C9C3B1"],
          ]}
        />
        <Linear
          id={id("bract")}
          stops={[
            [0, "#A07B53"],
            [1, "#4A331E"],
          ]}
        />
        <Grain id={id("grain")} amount={0.3} />
      </defs>
      <path
        d="M32 50v10"
        stroke="#6B4D30"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        data-sway
        d="M12 42l11-2 9 12 9-12 11 2-9 11H21Z"
        fill={ref("bract")}
      />
      <g filter={ref("grain")}>
        <circle cx="23" cy="32" r="10.5" fill={ref("lobe")} />
        <circle cx="41" cy="32" r="10.5" fill={ref("lobe")} />
        <circle cx="32" cy="38" r="9.5" fill={ref("lobe")} />
        <circle cx="32" cy="22" r="11.5" fill={ref("lobe")} />
      </g>
      <path
        d="M26 17c3 2 5 5 5 9M36 28c3-1 6 0 8 2M20 34c2 2 5 2 7 1M30 41c2 1 4 1 5-1"
        stroke="#FFFFFF"
        strokeWidth=".8"
        strokeLinecap="round"
        opacity=".9"
        fill="none"
      />
      <path
        d="M32 33v3M27 29l2 2M37 29l-2 2"
        stroke="#B9B19C"
        strokeWidth=".8"
        strokeLinecap="round"
        opacity=".7"
      />
    </>
  ),
};

/** Ilustração de uma cultura. Decorativa: o nome vem ao lado. */
export function CropIcon({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const name = (part: string) => `${uid}-${part}`;
  const ref = (part: string) => `url(#${name(part)})`;
  const draw = ICONS[id];

  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden
      className={className}
      overflow="visible"
    >
      <defs>
        <Radial
          id={name("shadow")}
          cx="50%"
          cy="50%"
          r="50%"
          stops={[
            [0, "#000000", 0.22],
            [1, "#000000", 0],
          ]}
        />
      </defs>
      <ellipse cx="32" cy="60" rx="19" ry="3.4" fill={ref("shadow")} />
      {draw?.(ref, name)}
    </svg>
  );
}
