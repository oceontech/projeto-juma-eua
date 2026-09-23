/**
 * Os quatro corpos que a nuvem assume na LP C — a unidade, a cadeia, as
 * unidades livres e a folha.
 *
 * Aqui, diferente da LP B, eles são **volumes**: esfera de átomo, cilindro de
 * ligação, lâmina de folha. A cena é um instrumento girando uma amostra, e
 * corpo chapado não aguenta giro — por isso tudo carrega z de verdade.
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

/** Leitura 01: uma unidade, grande, com as três chamadas do texto. */
export const unit: Form = {
  points: (n) => {
    const pieces: Piece[] = [];
    acid(pieces, [0, 0.02, 0], 1.05);
    return render(pieces, n);
  },
  anchors: [
    { at: [-0.357, 0.104, 0.05], side: -1 },
    { at: [0.462, -0.022, 0.08], side: 1 },
    { at: [-0.115, -0.316, -0.06], side: -1 },
  ],
};

/* ---------------------------------------------------------- a cadeia */

/** Quantas unidades a cadeia tem, e o arco em que elas se penduram. */
const LINKS = 5;

/**
 * Leitura 02: as mesmas unidades, ligadas ponta a ponta num arco. A ligação
 * peptídica é o cilindro entre o C de uma e o N da seguinte — e é ela que a
 * primeira chamada aponta.
 */
export const chain: Form = {
  points: (n) => {
    const pieces: Piece[] = [];
    const ends: { c: Node; n: Node }[] = [];
    for (let i = 0; i < LINKS; i++) {
      const t = i / (LINKS - 1) - 0.5;
      const at: Node = [t * 0.78, Math.sin(t * 3.1) * 0.12, Math.cos(t * 2.6) * 0.1];
      const unitEnds = acid(pieces, at, 0.42, t * 1.4);
      ends.push({ c: unitEnds.c, n: unitEnds.n });
    }
    for (let i = 0; i < LINKS - 1; i++) {
      pieces.push(tube(ends[i].c, ends[i + 1].n, 0.012));
    }
    return render(pieces, n);
  },
  /* Espalhadas em altura, e não só em largura: a cadeia é horizontal, e duas
     chamadas na mesma linha encavalam uma na outra. */
  anchors: [
    { at: [0.06, 0.15, 0.02], side: 1 },
    { at: [-0.34, -0.16, 0.02], side: -1 },
    { at: [0.3, -0.12, -0.03], side: 1 },
  ],
};

/* ------------------------------------------------------ unidades livres */

/** Leitura 03: as mesmas unidades, soltas e espalhadas. Nenhum elo entre elas. */
export const free: Form = {
  points: (n) => {
    const pieces: Piece[] = [];
    const cols = 4;
    const rows = 3;
    for (let i = 0; i < cols * rows; i++) {
      const cx = ((i % cols) / (cols - 1) - 0.5) * 0.82;
      const cy = (Math.floor(i / cols) / (rows - 1) - 0.5) * 0.62;
      const jitter = (k: number) => (Math.sin(i * 12.9898 + k) * 43758.5453) % 1;
      acid(
        pieces,
        [cx + jitter(1) * 0.06, cy + jitter(2) * 0.06, jitter(3) * 0.22],
        0.3,
        jitter(4) * 6,
      );
    }
    return render(pieces, n);
  },
  anchors: [
    { at: [-0.41, 0.31, 0.06], side: -1 },
    { at: [0.41, 0.0, -0.05], side: 1 },
    { at: [-0.1, -0.31, 0.04], side: -1 },
  ],
};

/* --------------------------------------------------------------- a folha */

/**
 * Leitura 04: a lâmina de uma folha, levemente curvada, com nervura central e
 * seis pares de laterais. A superfície é uma peça só — o `u` corre da base ao
 * bico e o `v` atravessa de borda a borda.
 */
export const leaf: Form = {
  points: (n) => {
    const pieces: Piece[] = [];
    /* Largura ao longo da folha e a curvatura que tira ela do plano. */
    const wide = (u: number) => Math.sin(Math.pow(u, 0.72) * Math.PI) * 0.29;
    const curl = (u: number, v: number) => Math.pow(Math.abs(v), 2) * 0.16 - u * 0.05;
    const spine = (u: number) => -0.42 + u * 0.86;

    pieces.push({
      at: (u, v) => {
        const w = (v - 0.5) * 2;
        return [spine(u), w * wide(u), curl(u, w)];
      },
      area: 0.86 * 0.4,
    });

    /* A nervura central e as laterais, como tubos finos sobre a lâmina. */
    for (let i = 0; i <= 24; i++) {
      const u = i / 24;
      if (i < 24) {
        pieces.push(
          tube(
            [spine(u), 0, curl(u, 0)],
            [spine(u + 1 / 24), 0, curl(u + 1 / 24, 0)],
            0.009,
          ),
        );
      }
    }
    for (let k = 1; k <= 6; k++) {
      const u = 0.1 + (k / 7) * 0.78;
      const reach = wide(u) * 0.86;
      for (const side of [-1, 1]) {
        pieces.push(
          tube([spine(u), 0, curl(u, 0)], [spine(u + 0.11), side * reach, curl(u + 0.11, side)], 0.006),
        );
      }
    }

    return render(pieces, n);
  },
  anchors: [
    { at: [0.1, 0.26, 0.02], side: 1 },
    { at: [-0.4, 0.02, 0.0], side: -1 },
    { at: [0.36, -0.14, 0.02], side: 1 },
  ],
};

/** As quatro leituras, na ordem em que o scroll as visita. */
export const FORMS: Form[] = [unit, chain, free, leaf];
