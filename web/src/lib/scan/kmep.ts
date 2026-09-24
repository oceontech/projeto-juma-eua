/**
 * Os corpos das duas cenas de partículas do KMEP Ultra® — o mesmo mecanismo
 * da LP do Aminosan (`specimen.ts`), com a matéria do KMEP: a espiga no
 * enchimento, a raiz no solo, o potássio entrando pela folha e a barra.
 *
 * Desde 24/09/2026 as cenas contam a **nutrição**, não a tecnologia de
 * aplicação (decisão do cliente: potássio primeiro, ação desalojante depois,
 * e nada sobre cobertura ou deposição da calda). A ação desalojante não entra
 * na cena: ela mora inteira no `Flush.tsx`, que é removível pela P2.
 *
 * As cores: **lima** (tag 1) é o potássio que chega e trabalha; **cobre**
 * (tag 2) é o potássio que não chega à raiz a tempo. As duas nunca aparecem
 * na mesma leitura.
 *
 * Duas cenas, quatro leituras cada, com os mesmos quatro desenhos:
 *
 *   A — entra pela necessidade (rota /kmep): onde a demanda chega ao pico (a
 *       espiga), onde o solo trava (a raiz), o potássio pela folha, e a
 *       passada que o produtor já faz;
 *   B — entra pelo produto (rota /kmep-b): a passada, o potássio pela folha,
 *       por que a folha (a raiz), e a espiga no enchimento.
 *
 * Nenhum desenho compara duas plantas nem mostra planta maior. As âncoras das
 * chamadas saem da mesma geometria que os pontos.
 */

import { ball, render, tube, type Anchor, type Form, type Node, type Piece } from "./forms";

/** 1 = lima (chega e trabalha); 2 = cobre (não chega a tempo). */
const STAYS = 1;
const LOST = 2;

/** Pseudoaleatório com semente: a geometria da raiz precisa sair igual nas
    duas chamadas (pontos e âncoras). */
const rand = (k: number) => {
  const x = Math.sin(k * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const TAU = Math.PI * 2;

const add = (a: Node, b: Node, k = 1): Node => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];

/** Área de uma peça que corre por `u` com largura `span(u)`, por integração. */
function stripArea(center: (t: number) => Node, span: (t: number) => number, steps = 24) {
  let area = 0;
  for (let k = 0; k < steps; k++) {
    const a = center(k / steps);
    const b = center((k + 1) / steps);
    const len = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    area += len * 2 * span((k + 0.5) / steps);
  }
  return area;
}

/* ------------------------------------------------------ a folha de milho */

type Blade = {
  /** Um ponto da lâmina: `t` da bainha (0) à ponta (1), `s` de borda a borda (−1 a 1). */
  at: (t: number, s: number, lift?: number) => Node;
};

/**
 * Uma folha de milho saindo do colmo: sobe, faz o arco e cai para a ponta. A
 * largura abre logo depois da bainha e afina em ponta, como a lâmina de uma
 * gramínea — longa e estreita, nada da folha larga da soja.
 */
function blade(into: Piece[], base: Node, angle: number, length: number, width: number, rise = 0.55): Blade {
  const dir: Node = [Math.cos(angle), 0, Math.sin(angle)];
  const side: Node = [-Math.sin(angle), 0, Math.cos(angle)];
  const spine = (t: number): Node => {
    const s = length * t;
    const h = length * (rise * t - 0.78 * t * t);
    return [base[0] + dir[0] * s, base[1] + h, base[2] + dir[2] * s];
  };
  const wide = (t: number) => width * Math.pow(Math.sin(Math.PI * Math.min(1, Math.pow(t, 0.62) * 0.98 + 0.02)), 0.7) * (1 - 0.45 * t);
  const at = (t: number, s: number, lift = 0): Node => {
    const c = spine(t);
    const w = wide(t) * s;
    /* A calha da nervura: as bordas levantam um pouco. */
    return [c[0] + side[0] * w, c[1] + s * s * width * 0.35 + lift, c[2] + side[2] * w];
  };
  into.push({ at: (u, v) => at(u, v * 2 - 1), area: stripArea(spine, wide) });
  /* A nervura central, mais grossa na bainha. */
  for (let k = 0; k < 10; k++) into.push(tube(at(k / 10, 0, 0.002), at((k + 1) / 10, 0, 0.002), 0.004 * (1 - 0.6 * (k / 10))));
  return { at };
}

type Plant = { blades: Blade[]; top: Node; stalk: [Node, Node] };

/** Uma planta de milho em estágio vegetativo: colmo, folhas alternadas e o cartucho. */
function corn(into: Piece[], base: Node, height: number, spin: number, scale = 1): Plant {
  const top: Node = [base[0], base[1] + height, base[2]];
  into.push(tube(base, [base[0], base[1] + height * 0.82, base[2]], 0.014 * scale));
  const levels = [0.14, 0.28, 0.42, 0.55, 0.67, 0.78];
  const blades = levels.map((h, k) =>
    blade(
      into,
      [base[0], base[1] + height * h, base[2]],
      spin + (k % 2 ? Math.PI : 0) + (k - 2.5) * 0.18,
      height * (0.62 - h * 0.34),
      0.034 * scale,
      0.62 + h * 0.25,
    ),
  );
  /* O cartucho: duas folhas novas quase em pé, enroladas no topo. */
  into.push(tube([base[0], base[1] + height * 0.8, base[2]], top, 0.011 * scale));
  blade(into, [base[0], base[1] + height * 0.86, base[2]], spin + 0.9, height * 0.2, 0.02 * scale, 1.6);
  blade(into, [base[0], base[1] + height * 0.88, base[2]], spin + 0.9 + Math.PI, height * 0.18, 0.02 * scale, 1.7);
  return { blades, top, stalk: [base, top] };
}

/* ------------------------------------------------------ a passada (barra) */

const BOOM_Y = 0.3;
const NOZZLES = 7;
const nozzleAt = (k: number): Node => [(k / (NOZZLES - 1) - 0.5) * 0.84, BOOM_Y - 0.035, 0];
const FAN_DROP = 0.44;

function passGeometry(into: Piece[]) {
  /* A barra: o tubo da estrutura e, logo abaixo, o cano da calda. */
  into.push(tube([-0.48, BOOM_Y, 0], [0.48, BOOM_Y, 0], 0.012));
  into.push(tube([-0.46, BOOM_Y - 0.02, 0.012], [0.46, BOOM_Y - 0.02, 0.012], 0.006));
  const fans: Node[] = [];
  for (let k = 0; k < NOZZLES; k++) {
    const n = nozzleAt(k);
    into.push(tube([n[0], BOOM_Y - 0.02, 0.012], n, 0.006));
    into.push(ball(n, 0.014));
    /* O leque plano do bico: uma lâmina de gotas que abre para baixo. É fina,
       na profundidade quase nada — é o que dá o desenho do bico de leque. */
    into.push({
      at: (u, v) => {
        const t = Math.sqrt(v);
        return [n[0] + (u - 0.5) * 2 * t * 0.078, n[1] - 0.012 - t * FAN_DROP, (Math.random() - 0.5) * 0.012 * t];
      },
      area: FAN_DROP * 0.078 * 0.8,
    });
    fans.push([n[0] + 0.03, n[1] - FAN_DROP * 0.55, 0]);
  }
  /* O dossel: uma fileira de plantas novas, com o topo onde o leque chega. */
  const plants: Plant[] = [];
  for (let k = 0; k < 5; k++) {
    const x = (k / 4 - 0.5) * 0.86;
    plants.push(corn(into, [x, -0.5, Math.sin(k * 2.3) * 0.06], 0.3, k * 1.3 + 0.4, 0.8));
  }
  return { fans, plants };
}

export const pass: Form = {
  points: (n) => {
    const pieces: Piece[] = [];
    passGeometry(pieces);
    return render(pieces, n);
  },
  anchors: ((): Anchor[] => {
    const { fans, plants } = passGeometry([]);
    return [
      { at: nozzleAt(1), side: -1 },
      { at: fans[4], side: 1 },
      { at: plants[1].blades[3].at(0.6, 0), side: -1 },
    ];
  })(),
};

/* ----------------------------------- a raiz no solo: o potássio que não chega */

/* Um corte do solo com uma planta nova em cima. A linha da superfície, a
   camada compactada mais abaixo (tracejada, como o freio do K7) e o sistema
   radicular fasciculado, que se espalha e deita sobre a camada em vez de
   atravessá-la. O potássio é a nuvem de grãos no perfil: o que está perto da
   raiz fica em tinta; o que ficou abaixo da camada, fora do alcance, é cobre.
   Nenhum número: é o mesmo desenho relativo do AN-01. */
const SOIL_Y = 0.2;
const LAYER_Y = -0.2;

function rootGeometry(into: Piece[]) {
  /* A planta nova, acima da superfície. */
  corn(into, [0, SOIL_Y, 0], 0.26, 0.5, 0.75);
  /* A superfície do solo: uma linha levemente ondulada. */
  for (let k = 0; k < 16; k++) {
    const x0 = -0.5 + k / 16;
    const x1 = -0.5 + (k + 1) / 16;
    into.push(tube([x0, SOIL_Y + Math.sin(k * 1.7) * 0.004, 0], [x1, SOIL_Y + Math.sin((k + 1) * 1.7) * 0.004, 0], 0.004));
  }
  /* A camada compactada: tracejado em duas linhas. */
  for (let k = 0; k < 14; k++) {
    const x = -0.48 + k * 0.07;
    into.push(tube([x, LAYER_Y, 0], [x + 0.042, LAYER_Y, 0], 0.005));
    into.push(tube([x + 0.035, LAYER_Y - 0.022, 0], [x + 0.077, LAYER_Y - 0.022, 0], 0.005));
  }

  /* As raízes: cada uma desce em quatro trechos com um desvio sorteado e se
     abre em duas ou três. Nenhuma passa da camada — ali ela deita. */
  const tips: Node[] = [];
  const nodes: Node[] = [];
  let seed = 1;
  const floor = LAYER_Y + 0.03;
  const grow = (from: Node, theta: number, phi: number, len: number, r: number, depth: number) => {
    let p = from;
    let t = theta;
    for (let s = 0; s < 4; s++) {
      t += (rand(seed++) - 0.5) * 0.3;
      const step = len / 4;
      const q: Node = [
        p[0] + Math.sin(t) * Math.cos(phi) * step,
        Math.max(floor, p[1] - Math.cos(t) * step),
        p[2] + Math.sin(t) * Math.sin(phi) * step * 0.6,
      ];
      into.push(tube(p, q, r * (1 - 0.18 * (s / 4))));
      nodes.push(q);
      p = q;
    }
    if (depth === 0) {
      tips.push(p);
      return;
    }
    const n = depth >= 2 ? 3 : 2;
    for (let k = 0; k < n; k++) {
      const spread = (k - (n - 1) / 2) * 0.75 + (rand(seed++) - 0.5) * 0.3;
      grow(p, t + spread, phi + (rand(seed++) - 0.5) * 1.2, len * 0.62, r * 0.6, depth - 1);
    }
  };
  for (let k = 0; k < 5; k++) grow([0, SOIL_Y, 0], -1.1 + k * 0.55, k * 1.3, 0.24, 0.011, 2);

  /* O potássio no perfil, numa grade com folga sorteada. Abaixo da camada:
     cobre, fora do alcance. Acima: tinta. */
  const stranded: Node[] = [];
  for (let i = 0; i < 12; i++) {
    for (let j = 0; j < 8; j++) {
      const k = i * 8 + j;
      const x = -0.46 + i * 0.084 + (rand(900 + k) - 0.5) * 0.05;
      const y = SOIL_Y - 0.06 - j * 0.085 + (rand(1900 + k) - 0.5) * 0.04;
      if (y < -0.5 || Math.abs(y - LAYER_Y) < 0.035) continue;
      const at: Node = [x, y, (rand(2900 + k) - 0.5) * 0.12];
      const below = y < LAYER_Y;
      into.push({ ...ball(at, 0.011), tag: below ? LOST : undefined });
      if (below) stranded.push(at);
    }
  }
  return { tips, nodes, stranded };
}

export const roots: Form = {
  points: (n) => {
    const pieces: Piece[] = [];
    rootGeometry(pieces);
    return render(pieces, n);
  },
  anchors: ((): Anchor[] => {
    const { tips, stranded } = rootGeometry([]);
    /* A ponta de raiz mais à esquerda, o grão preso mais à direita, e a
       camada perto da ponta direita — a etiqueta sai já fora do tracejado. */
    const tip = tips.reduce((a, b) => (b[0] < a[0] ? b : a), tips[0]);
    const grain = stranded.reduce((a, b) => (b[0] > a[0] && b[0] < 0.4 ? b : a), stranded[0]);
    return [
      { at: tip, side: -1 },
      { at: grain, side: 1 },
      { at: [0.42, LAYER_Y, 0], side: 1 },
    ];
  })(),
};

/* ------------------------------------------- a superfície da folha, de perto */

/* Um trecho da lâmina visto de perto, quase em pé e de frente para quem olha:
   corre em diagonal pela tela, com as nervuras paralelas das gramíneas e um
   leve encurvado em z. `a` ao longo (−1 a 1), `b` de borda a borda (−1 a 1). */
const ALONG: Node = [Math.cos(0.36), Math.sin(0.36), 0];
const ACROSS: Node = [-Math.sin(0.36), Math.cos(0.36), 0];
const HALF_LEN = 0.56;
const HALF_W = 0.2;
const surface = (a: number, b: number, lift = 0): Node => {
  const p = add(add([0, 0, 0], ALONG, a * HALF_LEN), ACROSS, b * HALF_W * (1 - 0.12 * a));
  return [p[0], p[1], b * b * 0.06 - a * a * 0.03 + lift];
};

function leafSurface(into: Piece[]) {
  into.push({ at: (u, v) => surface(u * 2 - 1, v * 2 - 1), area: 2 * HALF_LEN * 2 * HALF_W });
  /* A nervura central e as paralelas, finas: é pelo desenho delas que o olho
     lê "folha de milho" e não "placa". */
  for (const b of [-0.72, -0.46, -0.22, 0, 0.22, 0.46, 0.72]) {
    const r = b === 0 ? 0.006 : 0.0028;
    for (let k = 0; k < 8; k++) {
      const a0 = -1 + (k / 8) * 2;
      const a1 = -1 + ((k + 1) / 8) * 2;
      into.push(tube(surface(a0, b, 0.003), surface(a1, b, 0.003), r));
    }
  }
}

/** Gota espalhada: um disco baixo colado à folha, a calota de uma lente. */
function spread(at: Node, r: number, tag: number): Piece {
  const h = r * 0.2;
  return {
    at: (u, v) => {
      const d = Math.sqrt(v);
      const a = u * TAU;
      return [at[0] + Math.cos(a) * r * d, at[1] + Math.sin(a) * r * d, at[2] + h * (1 - d * d) + 0.004];
    },
    area: Math.PI * r * r * 1.1,
    tag,
  };
}

/** Onde as gotas assentaram, em (a, b, raio). Mais delas, e abertas. */
const STAY_DROPS: [number, number, number][] = [
  [-0.78, 0.3, 0.06], [-0.55, -0.45, 0.07], [-0.3, 0.4, 0.065], [-0.08, -0.2, 0.075],
  [0.18, 0.45, 0.06], [0.35, -0.5, 0.065], [0.58, 0.15, 0.07], [0.82, -0.25, 0.055],
  [-0.2, 0.05, 0.05], [0.05, 0.6, 0.05],
];

/* ----------------------------------------- o potássio entra pela folha */

/* Da gota, o potássio desce para a nervura mais próxima e corre por ela em
   direção à base da folha. As gotas ficam em tinta; o que acende é o
   potássio — é ele o assunto desta leitura. */
const VEINS = [-0.72, -0.46, -0.22, 0, 0.22, 0.46, 0.72];
const nearestVein = (b: number) => VEINS.reduce((best, v) => (Math.abs(v - b) < Math.abs(best - b) ? v : best), VEINS[0]);

function uptakeGeometry(into: Piece[]) {
  leafSurface(into);
  const drops: Node[] = [];
  const trails: Node[][] = [];
  STAY_DROPS.slice(0, 8).forEach(([a, b, r]) => {
    const at = surface(a, b);
    into.push(spread(at, r * 0.85, 0));
    drops.push(at);
    const vein = nearestVein(b);
    const trail: Node[] = [];
    /* Da gota até a nervura... */
    for (let k = 1; k <= 3; k++) {
      const p = surface(a - k * 0.015, b + (vein - b) * (k / 3), 0.006);
      into.push({ ...ball(p, 0.009), tag: STAYS });
      trail.push(p);
    }
    /* ...e por ela, rumo à base. */
    for (let k = 1; k <= 7; k++) {
      const p = surface(a - 0.05 - k * 0.075, vein, 0.006);
      if (p && a - 0.05 - k * 0.075 > -1) {
        into.push({ ...ball(p, 0.0085 - k * 0.0006), tag: STAYS });
        trail.push(p);
      }
    }
    trails.push(trail);
  });
  return { drops, trails };
}

export const uptake: Form = {
  points: (n) => {
    const pieces: Piece[] = [];
    uptakeGeometry(pieces);
    return render(pieces, n);
  },
  anchors: ((): Anchor[] => {
    const { drops, trails } = uptakeGeometry([]);
    return [
      { at: drops[6], side: 1 },
      { at: trails[3][1], side: -1 },
      { at: surface(-0.9, 0.22, 0.004), side: -1 },
    ];
  })(),
};

/* ------------------------------------------------ a espiga no enchimento */

const EAR_LEN = 0.66;
const EAR_TILT = 0.32;
/** Um ponto do eixo da espiga, `t` da base (0) à ponta (1), inclinado. */
const earAxis = (t: number): Node => {
  const s = -EAR_LEN / 2 + t * EAR_LEN;
  return [Math.sin(EAR_TILT) * s, Math.cos(EAR_TILT) * s, 0];
};
const earRadius = (t: number) => 0.105 * (1 - 0.42 * Math.pow(t, 2.2)) * (0.9 + 0.1 * Math.sin(Math.PI * Math.min(1, t * 4)));
/** A superfície da espiga em torno do eixo. */
const earAt = (t: number, a: number, r = earRadius(t)): Node => {
  const c = earAxis(t);
  const x = Math.cos(a) * r;
  const z = Math.sin(a) * r;
  return [c[0] + x * Math.cos(EAR_TILT), c[1] - x * Math.sin(EAR_TILT), c[2] + z];
};

function earGeometry(into: Piece[]) {
  const ROWS = 16;
  const RINGS = 24;
  const kernels: Node[] = [];
  for (let i = 0; i < RINGS; i++) {
    const t = 0.04 + (i / (RINGS - 1)) * 0.9;
    for (let j = 0; j < ROWS; j++) {
      const a = (j / ROWS) * TAU + (i % 2) * (TAU / ROWS / 2);
      const at = earAt(t, a, earRadius(t) + 0.004);
      into.push({ ...ball(at, 0.0145 * (1 - 0.3 * t)), tag: STAYS });
      kernels.push(at);
    }
  }
  /* O sabugo por baixo, e a palha abrindo da base em três lâminas. */
  for (let k = 0; k < 10; k++) into.push(tube(earAxis(k / 10), earAxis((k + 1) / 10), 0.07 * (1 - 0.4 * (k / 10))));
  const husks: Node[] = [];
  for (let h = 0; h < 3; h++) {
    const a0 = -0.6 + h * 2.1;
    const along = (t: number): Node => {
      const out = 0.12 + t * 0.2;
      const c = earAxis(-0.08 + t * 0.62);
      return [c[0] + Math.cos(a0) * out * Math.cos(EAR_TILT), c[1] - Math.cos(a0) * out * Math.sin(EAR_TILT) - t * t * 0.1, c[2] + Math.sin(a0) * out];
    };
    const wide = (t: number) => 0.06 * Math.sin(Math.PI * Math.min(1, 0.15 + t * 0.85));
    into.push({
      at: (u, v) => {
        const p = along(u);
        const s = (v * 2 - 1) * wide(u);
        return [p[0] - Math.sin(a0) * s * 0.4, p[1] + s * 0.3, p[2] + Math.cos(a0) * s];
      },
      area: stripArea(along, wide),
    });
    husks.push(along(0.55));
  }
  /* O pedúnculo e os estilos saindo da ponta. */
  into.push(tube(earAxis(-0.28), earAxis(0), 0.028));
  const tip = earAxis(1);
  for (let k = 0; k < 7; k++) {
    const a = k * 0.9;
    let prev = tip;
    for (let s = 1; s <= 4; s++) {
      const next: Node = [tip[0] + Math.cos(a) * s * 0.022 + s * 0.02, tip[1] + s * 0.03 - s * s * 0.006, tip[2] + Math.sin(a) * s * 0.022];
      into.push(tube(prev, next, 0.0025));
      prev = next;
    }
  }
  return { kernels, husks, tip };
}

export const ear: Form = {
  points: (n) => {
    const pieces: Piece[] = [];
    earGeometry(pieces);
    return render(pieces, n);
  },
  anchors: ((): Anchor[] => {
    const { kernels, husks, tip } = earGeometry([]);
    return [
      { at: kernels[16 * 12 + 2], side: 1 },
      { at: husks[1], side: -1 },
      { at: tip, side: 1 },
    ];
  })(),
};

/** As quatro leituras de cada cena, na ordem em que o scroll as visita. */
export const KMEP_SCENES: Record<"a" | "b", Form[]> = {
  a: [ear, roots, uptake, pass],
  b: [pass, uptake, roots, ear],
};
