/**
 * Os quatro corpos da cena da LP B — o mesmo arco da LP C (a unidade, a
 * cadeia, as unidades livres e a folha), desenhado para quem nunca viu uma
 * molécula.
 *
 * O que muda em relação a `forms.ts` é a **cor com significado**. A cena não
 * conta com o leitor saber o que é um grupo amino: ela pinta. O nitrogênio de
 * cada aminoácido sai no verde de destaque (tag 1) em todas as leituras, e a
 * ligação que prende uma unidade à outra sai no âmbar (tag 2) — é o que
 * precisa ser aberto antes de qualquer peça ser usada. Na folha, o verde passa
 * às gotas da pulverização. A legenda do painel usa as mesmas duas cores.
 *
 * As âncoras das chamadas são calculadas do próprio desenho, e não digitadas:
 * a chamada "ligação" precisa cair **na** ligação, e um número copiado à mão
 * descola na primeira vez que alguém mexer na geometria.
 */

import { acid, ball, render, tube, type Anchor, type Form, type Node, type Piece } from "./forms";

/** 1 = verde (nitrogênio, gotas); 2 = âmbar (ligação a abrir). */
const N = 1;
const LINK = 2;

const mid = (a: Node, b: Node): [number, number, number] => [
  (a[0] + b[0]) / 2,
  (a[1] + b[1]) / 2,
  (a[2] + b[2]) / 2,
];

/* ------------------------------------------------------ 01 · a unidade */

const unitAt: Node = [0, 0.02, 0];
const unitScale = 1.05;

export const unit: Form = {
  points: (n) => {
    const pieces: Piece[] = [];
    acid(pieces, unitAt, unitScale, 0, N);
    return render(pieces, n);
  },
  anchors: ((): Anchor[] => {
    const g = acid([], unitAt, unitScale);
    return [
      { at: g.n, side: -1 },
      { at: g.o2, side: 1 },
      { at: g.r, side: -1 },
    ];
  })(),
};

/* ------------------------------------------------------- 02 · a cadeia */

const LINKS = 5;

/** A cadeia, com as ligações entre as unidades. Determinística: as âncoras
    saem da mesma conta que os pontos. */
function chainGeometry(into: Piece[]) {
  const units = [];
  for (let i = 0; i < LINKS; i++) {
    const t = i / (LINKS - 1) - 0.5;
    /* Mais espaçadas e menores que na LP C: o elo entre duas unidades é o
       assunto desta leitura, e precisa de comprimento para ser visto. */
    const at: Node = [t * 0.9, Math.sin(t * 3.1) * 0.1, Math.cos(t * 2.6) * 0.1];
    units.push(acid(into, at, 0.34, t * 1.2, N));
  }
  const links: [Node, Node][] = [];
  for (let i = 0; i < LINKS - 1; i++) links.push([units[i].c, units[i + 1].n]);
  return { units, links };
}

export const chain: Form = {
  points: (n) => {
    const pieces: Piece[] = [];
    const { links } = chainGeometry(pieces);
    /* Mais grossa que o bastão de dentro da unidade: é a peça que a leitura
       inteira aponta, e precisa ser vista de longe. */
    links.forEach(([a, b]) => pieces.push({ ...tube(a, b, 0.026), tag: LINK }));
    return render(pieces, n);
  },
  anchors: ((): Anchor[] => {
    const { units, links } = chainGeometry([]);
    return [
      { at: mid(links[2][0], links[2][1]), side: 1 },
      { at: units[0].ca, side: -1 },
      { at: units[3].r, side: 1 },
    ];
  })(),
};

/* ---------------------------------------------- 03 · as unidades livres */

function freeGeometry(into: Piece[]) {
  const cols = 4;
  const rows = 3;
  const units = [];
  for (let i = 0; i < cols * rows; i++) {
    const cx = ((i % cols) / (cols - 1) - 0.5) * 0.84;
    const cy = (Math.floor(i / cols) / (rows - 1) - 0.5) * 0.62;
    const jitter = (k: number) => (Math.sin(i * 12.9898 + k) * 43758.5453) % 1;
    units.push(
      acid(into, [cx + jitter(1) * 0.05, cy + jitter(2) * 0.05, jitter(3) * 0.2], 0.3, jitter(4) * 6, N),
    );
  }
  return units;
}

export const free: Form = {
  points: (n) => {
    const pieces: Piece[] = [];
    freeGeometry(pieces);
    return render(pieces, n);
  },
  anchors: ((): Anchor[] => {
    const units = freeGeometry([]);
    return [
      { at: units[0].n, side: -1 },
      { at: units[7].ca, side: 1 },
      { at: units[9].r, side: -1 },
    ];
  })(),
};

/* ------------------------------------------------------- 04 · a folha */

/* A lâmina, como a da LP C: `u` da base ao bico, `v` de borda a borda. */
const wide = (u: number) => Math.sin(Math.pow(u, 0.72) * Math.PI) * 0.29;
const curl = (u: number, v: number) => Math.pow(Math.abs(v), 2) * 0.16 - u * 0.05;
const spine = (u: number) => -0.42 + u * 0.86;
const onLeaf = (u: number, v: number, lift = 0): Node => [spine(u), v * wide(u), curl(u, v) + lift];

/** Onde as gotas pousaram, em (u, v) da lâmina. Espalhadas à mão para nenhuma
    cair sobre a nervura, onde sumiriam no traço. */
const DROPS: [number, number][] = [
  [0.2, 0.45],
  [0.3, -0.55],
  [0.42, 0.3],
  [0.5, -0.25],
  [0.58, 0.62],
  [0.66, -0.6],
  [0.74, 0.28],
  [0.82, -0.3],
  [0.36, 0.72],
  [0.9, 0.35],
];

export const leaf: Form = {
  points: (n) => {
    const pieces: Piece[] = [];
    pieces.push({
      at: (u, v) => onLeaf(u, (v - 0.5) * 2),
      area: 0.86 * 0.4,
    });
    for (let i = 0; i < 24; i++) {
      pieces.push(tube(onLeaf(i / 24, 0), onLeaf((i + 1) / 24, 0), 0.009));
    }
    for (let k = 1; k <= 6; k++) {
      const u = 0.1 + (k / 7) * 0.78;
      for (const side of [-1, 1]) {
        pieces.push(tube(onLeaf(u, 0), [spine(u + 0.11), side * wide(u) * 0.86, curl(u + 0.11, side)], 0.006));
      }
    }
    /* As gotas: esferas pequenas pousadas na lâmina, no verde de destaque. */
    DROPS.forEach(([u, v]) => pieces.push({ ...ball(onLeaf(u, v, 0.03), 0.032), tag: N }));
    return render(pieces, n);
  },
  anchors: [
    { at: onLeaf(0.3, 0.6), side: -1 },
    { at: onLeaf(0.58, 0.62, 0.03), side: 1 },
    { at: onLeaf(0.96, 0), side: 1 },
  ],
};

/** As quatro leituras, na ordem em que o scroll as visita. */
export const SPECIMEN: Form[] = [unit, chain, free, leaf];
