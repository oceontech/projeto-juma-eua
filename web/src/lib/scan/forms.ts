/**
 * As primitivas dos corpos da cena de partículas (ver `specimen.ts`, que monta
 * as quatro leituras): esfera de átomo, cilindro de ligação e o aminoácido em
 * bola e bastão. São **volumes**, com z de verdade, porque o desenho gira.
 *
 * O orçamento de pontos é repartido por **área de superfície**, peça por
 * peça: a esfera pela área dela, o cilindro pela dele. É isso que mantém o
 * desenho legível com qualquer contagem — e é o que permite a ponta de uma
 * ligação fina não sumir enquanto uma esfera grande fica gorda.
 *
 * Tudo vive num cubo de lado 1 centrado na origem, então as coordenadas
 * abaixo leem-se como fração do enquadramento.
 */

import type { Cloud } from "./field";

const TAU = Math.PI * 2;

/** Um ponto da peça: `u` e `v` percorrem a superfície dela. */
type At = (u: number, v: number) => [x: number, y: number, z: number];

/** Uma peça do desenho. `tag` pinta todos os pontos dela: 0 tinta, 1 e 2 os
    destaques (ver `field.ts`). */
export type Piece = { at: At; area: number; tag?: number };

/** Ponto de ancoragem de uma chamada, com a direção em que a linha sai. */
export type Anchor = {
  at: [number, number, number];
  /** Para que lado a etiqueta fica: −1 esquerda, +1 direita. */
  side: -1 | 1;
};

export type Form = {
  points: (n: number) => Cloud;
  anchors: Anchor[];
};

/* ------------------------------------------------------------ primitivas */

/**
 * Casca de esfera com pontos distribuídos por igual. O `1 − 2v` na altura é o
 * que evita o amontoado nos polos: sortear a latitude direto concentraria
 * pontos onde os paralelos são curtos.
 */
const shell =
  (cx: number, cy: number, cz: number, r: number): At =>
  (u, v) => {
    const z = 1 - 2 * v;
    const ring = Math.sqrt(Math.max(0, 1 - z * z));
    const a = u * TAU;
    return [cx + r * ring * Math.cos(a), cy + r * ring * Math.sin(a), cz + r * z];
  };

/** Superfície de um cilindro entre dois pontos — a ligação entre dois átomos. */
export function tube(a: [number, number, number], b: [number, number, number], r: number): Piece {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const dz = b[2] - a[2];
  const len = Math.hypot(dx, dy, dz) || 1;
  const ax = dx / len;
  const ay = dy / len;
  const az = dz / len;
  /* Duas perpendiculares ao eixo, para varrer a volta do cilindro. */
  const helper: [number, number, number] = Math.abs(az) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  const p = norm([ay * helper[2] - az * helper[1], az * helper[0] - ax * helper[2], ax * helper[1] - ay * helper[0]]);
  const q = norm([ay * p[2] - az * p[1], az * p[0] - ax * p[2], ax * p[1] - ay * p[0]]);
  return {
    at: (u, v) => {
      const t = u * TAU;
      const c = Math.cos(t) * r;
      const s = Math.sin(t) * r;
      return [
        a[0] + dx * v + p[0] * c + q[0] * s,
        a[1] + dy * v + p[1] * c + q[1] * s,
        a[2] + dz * v + p[2] * c + q[2] * s,
      ];
    },
    area: TAU * r * len,
  };
}

function norm(v: [number, number, number]): [number, number, number] {
  const d = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / d, v[1] / d, v[2] / d];
}

export const ball = (c: [number, number, number], r: number): Piece => ({
  at: shell(c[0], c[1], c[2], r),
  area: 2 * TAU * r * r,
});

/** Reparte `n` pontos entre as peças, em proporção à área da superfície. */
export function render(pieces: Piece[], n: number): Cloud {
  const total = pieces.reduce((sum, p) => sum + p.area, 0) || 1;
  const out = new Float32Array(n * 3);
  const tag = new Float32Array(n);
  let i = 0;
  pieces.forEach((p, k) => {
    const last = k === pieces.length - 1;
    const share = last ? n - i : Math.min(n - i, Math.round((n * p.area) / total));
    for (let j = 0; j < share; j++, i++) {
      const [x, y, z] = p.at(Math.random(), Math.random());
      out[i * 3] = x;
      out[i * 3 + 1] = y;
      out[i * 3 + 2] = z;
      tag[i] = p.tag ?? 0;
    }
  });
  for (let k = i; k < n && i > 0; k++) {
    const src = (Math.random() * i) | 0;
    out[k * 3] = out[src * 3];
    out[k * 3 + 1] = out[src * 3 + 1];
    out[k * 3 + 2] = out[src * 3 + 2];
    tag[k] = tag[src];
  }
  return { pos: out, tag };
}

/* ------------------------------------------------------- um aminoácido */

export type Node = [x: number, y: number, z: number];

/**
 * Um aminoácido genérico em bola e bastão: grupo amino, carbono alfa com a
 * cadeia lateral, e o grupo ácido com a carbonila e a hidroxila. `scale`
 * encolhe a unidade inteira, para ela servir tanto de protagonista quanto de
 * elo de uma cadeia.
 */
export function acid(into: Piece[], at: Node, scale: number, spin = 0, nTag = 0) {
  const cos = Math.cos(spin);
  const sin = Math.sin(spin);
  const put = (x: number, y: number, z: number): Node => [
    at[0] + (x * cos - z * sin) * scale,
    at[1] + y * scale,
    at[2] + (x * sin + z * cos) * scale,
  ];

  const n = put(-0.34, 0.08, 0.05);
  const ca = put(-0.06, -0.02, -0.03);
  const c = put(0.2, 0.09, 0.04);
  const o1 = put(0.25, 0.33, -0.03);
  const o2 = put(0.44, -0.04, 0.08);
  const r = put(-0.11, -0.32, -0.06);

  into.push({ ...ball(n, 0.082 * scale), tag: nTag });
  into.push(ball(ca, 0.076 * scale));
  into.push(ball(c, 0.076 * scale));
  into.push(ball(o1, 0.08 * scale));
  into.push(ball(o2, 0.08 * scale));
  into.push(ball(r, 0.094 * scale));

  const wire = 0.016 * scale;
  into.push(tube(n, ca, wire));
  into.push(tube(ca, c, wire));
  into.push(tube(c, o1, wire * 1.3));
  into.push(tube(c, o2, wire));
  into.push(tube(ca, r, wire));

  return { n, ca, c, o2, r };
}
