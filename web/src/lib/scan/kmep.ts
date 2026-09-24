/**
 * Os corpos das duas cenas de partículas do KMEP Ultra® — o mesmo mecanismo
 * da LP do Aminosan (`specimen.ts`), com a matéria do KMEP: barra, bico,
 * leque, dossel, a gota na cera da folha e a espiga.
 *
 * As cores têm o significado que `docs/06-PROMPT-LP-KMEP.md` dá ao acento da
 * página: **cobre** (tag 2) é a fração da aplicação que não trabalha; **lima**
 * (tag 1) é o que fica e trabalha. As duas nunca aparecem na mesma leitura.
 *
 * Duas cenas, quatro leituras cada:
 *
 *   A — a perda que não se vê (rota /kmep): a passada vista da cabine, o que
 *       parou no topo do dossel, o que quicou e secou, e a mesma folha com o
 *       KMEP no tanque;
 *   B — uma passada, dois trabalhos (rota /kmep-b): a passada, a gota que
 *       fica (trabalho 1), o potássio entrando pela folha (trabalho 2) e a
 *       espiga em enchimento.
 *
 * Nenhum desenho compara duas plantas nem mostra planta maior: o que a cena
 * descreve é o comportamento físico da gota, que é linguagem de adjuvante.
 * As âncoras das chamadas saem da mesma geometria que os pontos.
 */

import { ball, render, tube, type Anchor, type Form, type Node, type Piece } from "./forms";

/** 1 = lima (fica e trabalha); 2 = cobre (perdido). */
const STAYS = 1;
const LOST = 2;

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

/* ------------------------------------------------- 01 · a passada (barra) */

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

/* ---------------------------------------- 02 · o que parou no topo (A) */

/** Onde cada gota caiu, em (folha, t, s). As folhas de cima levam quase todas. */
const TOP_DROPS: [number, number, number][] = [
  [5, 0.3, 0.3], [5, 0.45, -0.4], [5, 0.6, 0.2], [5, 0.72, -0.2],
  [4, 0.35, -0.3], [4, 0.5, 0.35], [4, 0.62, -0.1], [4, 0.78, 0.25],
  [3, 0.4, 0.2], [3, 0.58, -0.35],
];

function canopyGeometry(into: Piece[]) {
  const plant = corn(into, [0, -0.5, 0], 0.96, 0.35, 1.2);
  const drops = TOP_DROPS.map(([b, t, s]) => {
    const at = plant.blades[b].at(t, s, 0.02);
    into.push({ ...ball(at, 0.02), tag: LOST });
    return at;
  });
  /* E no cartucho, gotas presas no alto também. */
  for (let k = 0; k < 4; k++) {
    const at: Node = [Math.cos(k * 1.7) * 0.03, plant.top[1] - 0.04 - k * 0.03, Math.sin(k * 1.7) * 0.03];
    into.push({ ...ball(at, 0.016), tag: LOST });
  }
  return { plant, drops };
}

export const canopy: Form = {
  points: (n) => {
    const pieces: Piece[] = [];
    canopyGeometry(pieces);
    return render(pieces, n);
  },
  anchors: ((): Anchor[] => {
    const { plant, drops } = canopyGeometry([]);
    return [
      { at: drops[1], side: 1 },
      { at: plant.blades[0].at(0.55, 0), side: -1 },
      { at: plant.top, side: 1 },
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

/** A normal da superfície, aproximada: o trecho é quase plano. */
const NORMAL: Node = [0, 0, 1];

/** Gota esférica, em contas sobre a cera. */
const bead = (at: Node, r: number, tag: number): Piece => ({ ...ball(add(at, NORMAL, r), r), tag });

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

/** A mancha que a gota seca deixa: um anel fino na cera. */
function ring(at: Node, r: number, tag: number): Piece {
  return {
    at: (u, v) => {
      const a = u * TAU;
      const d = r * (0.82 + 0.18 * v);
      return [at[0] + Math.cos(a) * d, at[1] + Math.sin(a) * d, at[2] + 0.004];
    },
    area: TAU * r * r * 0.18 * 2.4,
    tag,
  };
}

/* ------------------------------------------ 03 · quicou e secou (A) */

function lossGeometry(into: Piece[]) {
  leafSurface(into);
  /* Contas: redondas, mal encostam na cera. */
  const beads: [number, number, number][] = [
    [-0.6, 0.35, 0.05], [-0.25, -0.5, 0.042], [0.15, 0.4, 0.048], [0.55, -0.3, 0.04],
  ];
  const sat = beads.map(([a, b, r]) => {
    into.push(bead(surface(a, b), r, LOST));
    return add(surface(a, b), NORMAL, r);
  });
  /* O quique: uma gota que bateu e saiu, em arco para fora da folha,
     encolhendo em cada quadro do rastro. */
  const hit = surface(-0.05, 0.05);
  const arc: Node[] = [];
  for (let k = 1; k <= 5; k++) {
    const at: Node = [hit[0] + k * 0.055, hit[1] + k * 0.035 - k * k * 0.012, hit[2] + k * 0.07];
    into.push({ ...ball(at, 0.036 - k * 0.004), tag: LOST });
    arc.push(at);
  }
  /* O que secou: o anel no lugar da gota e um resto miúdo no meio. */
  const dried: [number, number][] = [[-0.45, -0.1], [0.35, 0.05], [0.72, 0.55]];
  const spots = dried.map(([a, b]) => {
    const at = surface(a, b);
    into.push(ring(at, 0.04, LOST));
    into.push({ ...ball(add(at, NORMAL, 0.008), 0.008), tag: LOST });
    return at;
  });
  return { arc, spots, sat };
}

export const loss: Form = {
  points: (n) => {
    const pieces: Piece[] = [];
    lossGeometry(pieces);
    return render(pieces, n);
  },
  anchors: ((): Anchor[] => {
    const { arc, spots } = lossGeometry([]);
    return [
      { at: arc[3], side: 1 },
      { at: spots[0], side: -1 },
      { at: surface(0.85, -0.6), side: 1 },
    ];
  })(),
};

/* ----------------------------------- 04 · a mesma folha, com o KMEP (A) */

/** Onde as gotas assentaram, em (a, b, raio). Mais delas, e abertas. */
const STAY_DROPS: [number, number, number][] = [
  [-0.78, 0.3, 0.06], [-0.55, -0.45, 0.07], [-0.3, 0.4, 0.065], [-0.08, -0.2, 0.075],
  [0.18, 0.45, 0.06], [0.35, -0.5, 0.065], [0.58, 0.15, 0.07], [0.82, -0.25, 0.055],
  [-0.2, 0.05, 0.05], [0.05, 0.6, 0.05],
];

function stayGeometry(into: Piece[], potassium: boolean) {
  leafSurface(into);
  const drops = STAY_DROPS.map(([a, b, r]) => {
    const at = surface(a, b);
    into.push(spread(at, r, STAYS));
    return at;
  });
  /* O potássio na mesma gota: grãos em tinta dentro do disco lima. */
  const salt: Node[] = [];
  if (potassium) {
    drops.forEach((at, i) => {
      for (let k = 0; k < 3; k++) {
        const a = i * 2.1 + k * 2.2;
        const p: Node = [at[0] + Math.cos(a) * 0.026, at[1] + Math.sin(a) * 0.026, at[2] + 0.016];
        into.push(ball(p, 0.0085));
        salt.push(p);
      }
    });
  }
  return { drops, salt };
}

export const stays: Form = {
  points: (n) => {
    const pieces: Piece[] = [];
    stayGeometry(pieces, true);
    return render(pieces, n);
  },
  anchors: ((): Anchor[] => {
    const { drops, salt } = stayGeometry([], true);
    return [
      { at: drops[6], side: 1 },
      { at: surface(-0.6, -0.95), side: -1 },
      { at: salt[5], side: 1 },
    ];
  })(),
};

/* ------------------------------------ B · 02 · trabalho 1: a gota que fica */

export const deposit: Form = {
  points: (n) => {
    const pieces: Piece[] = [];
    stayGeometry(pieces, false);
    return render(pieces, n);
  },
  anchors: ((): Anchor[] => {
    const { drops } = stayGeometry([], false);
    /* Nenhuma chamada na gota da ponta direita: a etiqueta sairia da tela. */
    return [
      { at: drops[6], side: 1 },
      { at: drops[1], side: -1 },
      { at: drops[3], side: -1 },
    ];
  })(),
};

/* ----------------------- B · 03 · trabalho 2: o potássio entra pela folha */

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

/* ----------------------------------------- B · 04 · a espiga no enchimento */

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
  a: [pass, canopy, loss, stays],
  b: [pass, deposit, uptake, ear],
};
