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

import {
  acid,
  ball,
  render,
  tube,
  type Anchor,
  type Form,
  type Node,
  type Piece,
} from "./forms";

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
    const at: Node = [
      t * 0.9,
      Math.sin(t * 3.1) * 0.1,
      Math.cos(t * 2.6) * 0.1,
    ];
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
      acid(
        into,
        [cx + jitter(1) * 0.05, cy + jitter(2) * 0.05, jitter(3) * 0.2],
        0.3,
        jitter(4) * 6,
        N,
      ),
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

/* A lâmina: `u` corre da base (0) ao bico (1), `v` de borda a borda (−1 a 1).
   A largura é de folha de verdade — base arredondada, o corpo mais largo um
   pouco abaixo do meio, e o bico afinando em ponta, não em gota. */
const LEN = 0.84;
const wide = (u: number) =>
  0.3 *
  Math.pow(Math.sin(Math.PI * Math.pow(u, 0.8)), 0.85) *
  (1 - 0.35 * u * u);
const spine = (u: number) => -LEN / 2 + u * LEN;
/* Um arco leve ao longo da nervura e as bordas levantando um pouco: é o que
   dá corpo quando o desenho gira. */
const curl = (u: number, v: number) =>
  v * v * 0.1 - Math.sin(Math.PI * u) * 0.06;
const onLeaf = (u: number, v: number, lift = 0): Node => [
  spine(u),
  v * wide(u),
  curl(u, v) + lift,
];

/**
 * Uma nervura lateral: sai da central e sobe inclinada em direção ao bico,
 * como numa folha de verdade. Ela é traçada **dentro** da lâmina — o fim de
 * cada trecho é calculado com a largura daquele ponto, e para em 78% dela —
 * e por isso nunca passa da borda. A versão anterior somava o comprimento no
 * eixo e usava a largura do começo; perto do bico, onde a folha estreita, a
 * nervura saía para fora.
 */
function vein(into: Piece[], from: number, side: -1 | 1) {
  const steps = 6;
  const reach = 0.78;
  const rise = Math.min(0.16, (1 - from) * 0.6);
  let prev = onLeaf(from, 0, 0.004);
  for (let k = 1; k <= steps; k++) {
    const t = k / steps;
    const u = from + rise * Math.sin((t * Math.PI) / 2);
    const next = onLeaf(u, side * reach * t, 0.004);
    into.push(tube(prev, next, 0.0045 * (1 - 0.5 * t)));
    prev = next;
  }
}

/** Onde as gotas pousaram, em (u, v) da lâmina. Longe da nervura central e
    das laterais, onde sumiriam no traço. */
const DROPS: [number, number][] = [
  [0.2, 0.5],
  [0.28, -0.45],
  [0.4, 0.62],
  [0.47, -0.62],
  [0.55, 0.32],
  [0.62, -0.3],
  [0.7, 0.55],
  [0.78, -0.4],
];

export const leaf: Form = {
  points: (n) => {
    const pieces: Piece[] = [];
    /* A lâmina pela área de verdade: a integral da largura ao longo do eixo. */
    let area = 0;
    for (let k = 0; k < 40; k++) area += wide((k + 0.5) / 40) * 2 * (LEN / 40);
    pieces.push({ at: (u, v) => onLeaf(u, (v - 0.5) * 2), area });
    /* O pecíolo, curto, saindo da base. */
    pieces.push(tube([spine(0) - 0.09, -0.015, -0.01], onLeaf(0, 0), 0.007));
    /* A nervura central, afinando até o bico. */
    for (let k = 0; k < 20; k++) {
      pieces.push(
        tube(
          onLeaf(k / 20, 0, 0.004),
          onLeaf((k + 1) / 20, 0, 0.004),
          0.007 * (1 - 0.6 * (k / 20)),
        ),
      );
    }
    for (let k = 0; k < 6; k++) {
      const from = 0.1 + k * 0.13;
      vein(pieces, from, 1);
      vein(pieces, from + 0.05, -1);
    }
    /* As gotas: esferas pequenas pousadas na lâmina, no verde de destaque. */
    DROPS.forEach(([u, v]) =>
      pieces.push({ ...ball(onLeaf(u, v, 0.028), 0.028), tag: N }),
    );
    return render(pieces, n);
  },
  anchors: [
    { at: onLeaf(0.3, 0.85), side: -1 },
    { at: onLeaf(0.55, 0.32, 0.028), side: 1 },
    { at: onLeaf(0.97, 0), side: 1 },
  ],
};

/** As quatro leituras, na ordem em que o scroll as visita. */
export const SPECIMEN: Form[] = [unit, chain, free, leaf];
