/**
 * As formas em que a nuvem se reorganiza depois do hero.
 *
 * A cena é plana: não há z, rotação nem perspectiva. O desenho é o que ele
 * parece ser, visto de frente. E as formas são **cheias**, não contornadas:
 * folha é folha, átomo é disco.
 *
 * **O orçamento é repartido por área, peça por peça.** É isso que permite a
 * cena rodar com doze mil partículas. A primeira versão pintava um quadrado e
 * sorteava pontos pela luminância — ali o papel em branco também entra no
 * sorteio, e o que é pequeno mas importante (a letra de um átomo, a ponta de
 * uma raiz) some antes de qualquer outra coisa. Aqui cada peça é uma
 * **superfície paramétrica** com a própria cota: a folha recebe pontos em
 * proporção à área dela, a raiz à dela, e nada pode desaparecer porque nada
 * disputa com o vazio.
 *
 * Pela mesma razão a letra do átomo volta a ser **vazada** — e agora funciona.
 * Um buraco só se lê se houver pontos bastantes em volta para desenhá-lo, e o
 * disco de um átomo, com cota própria, fica cheio mesmo com doze mil pontos no
 * total.
 *
 * Cada peça carrega ainda uma **ordem de construção**, de 0 a 1, que é o que
 * faz a planta nascer de cima para baixo e a raiz crescer por último.
 *
 * Tudo é escrito numa caixa de 1000×1000; as coordenadas abaixo, portanto,
 * leem-se como porcentagem com uma casa. A saída é n×3 — x e y normalizados
 * em [-0,5; 0,5], mais a ordem.
 */

const BOX = 1000;
const TAU = Math.PI * 2;

/**
 * Um ponto da peça. `t` caminha ao longo dela e `s` atravessa — numa folha,
 * `t` vai da base ao bico e `s` de uma borda à outra. Traços simples ignoram
 * o `s`; é `ribbon` e `band` que o usam para encorpar.
 */
type At = (t: number, s: number) => [x: number, y: number];

type Piece = {
  at: At;
  /** Área de tinta, em unidades da caixa. É por ela que a cota é repartida. */
  area: number;
  /** Ordem de construção no começo e no fim da peça. */
  from: number;
  to: number;
};

/* ------------------------------------------------------------ primitivas */

const line =
  (x1: number, y1: number, x2: number, y2: number): At =>
  (t) =>
    [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t];

const quad =
  (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number): At =>
  (t) => {
    const u = 1 - t;
    return [u * u * x1 + 2 * u * t * cx + t * t * x2, u * u * y1 + 2 * u * t * cy + t * t * y2];
  };

const cubic =
  (
    x1: number,
    y1: number,
    ax: number,
    ay: number,
    bx: number,
    by: number,
    x2: number,
    y2: number,
  ): At =>
  (t) => {
    const u = 1 - t;
    const a = u * u * u;
    const b = 3 * u * u * t;
    const c = 3 * u * t * t;
    const d = t * t * t;
    return [a * x1 + b * ax + c * bx + d * x2, a * y1 + b * ay + c * by + d * y2];
  };

/** Engrossa uma curva para os lados, na espessura pedida — caule, raiz, ligação. */
const ribbon =
  (at: At, width: number | ((t: number) => number)): At =>
  (t, s) => {
    const e = 0.004;
    const [x1, y1] = at(Math.max(0, t - e), 0.5);
    const [x2, y2] = at(Math.min(1, t + e), 0.5);
    const dx = x2 - x1;
    const dy = y2 - y1;
    const d = Math.hypot(dx, dy) || 1;
    const w = typeof width === "function" ? width(t) : width;
    const [x, y] = at(t, 0.5);
    return [x - (dy / d) * (s - 0.5) * w, y + (dx / d) * (s - 0.5) * w];
  };

/**
 * Preenche o vão entre duas bordas — é assim que a folha vira folha.
 *
 * O `t` é reparametrizado por área antes de ser usado. Sem isso o folíolo sai
 * manchado: caminhar em `t` a passo constante põe a mesma quantidade de
 * pontos onde ele é estreito e onde é largo, e o resultado é denso na base e
 * no bico, ralo no meio — que é justamente onde a folha tem mais corpo.
 */
const band = (a: At, b: At): At => {
  const steps = 32;
  const cum = [0];
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const [ax, ay] = a(t, 0.5);
    const [bx, by] = b(t, 0.5);
    const [px, py] = a((i - 1) / steps, 0.5);
    const [qx, qy] = b((i - 1) / steps, 0.5);
    const advance = Math.hypot((ax + bx) / 2 - (px + qx) / 2, (ay + by) / 2 - (py + qy) / 2);
    cum.push(cum[i - 1] + Math.hypot(bx - ax, by - ay) * advance);
  }
  const total = cum[steps] || 1;
  return (t, s) => {
    const target = t * total;
    let k = 0;
    while (k < steps && cum[k + 1] < target) k++;
    const seg = cum[k + 1] - cum[k] || 1;
    const u = Math.min(1, (k + (target - cum[k]) / seg) / steps);
    const [ax, ay] = a(u, 0.5);
    const [bx, by] = b(u, 0.5);
    return [ax + (bx - ax) * s, ay + (by - ay) * s];
  };
};

/**
 * Disco cheio, com um vazado opcional. A raiz quadrada no raio é o que espalha
 * os pontos por igual: sem ela eles se amontoam no centro, porque o anel de
 * fora tem mais área que o de dentro.
 */
const disc =
  (cx: number, cy: number, r: number, hole?: (x: number, y: number) => boolean): At =>
  (t, s) => {
    for (let k = 0; k < 8; k++) {
      const a = (k === 0 ? t : Math.random()) * TAU;
      const rr = r * Math.sqrt(k === 0 ? s : Math.random());
      const x = cx + rr * Math.cos(a);
      const y = cy + rr * Math.sin(a);
      if (!hole || !hole(x, y)) return [x, y];
    }
    /* Desistiu: encosta na borda, onde nunca há vazado. */
    return [cx + r * 0.97 * Math.cos(t * TAU), cy + r * 0.97 * Math.sin(t * TAU)];
  };

/** Mede o comprimento da peça pelo meio, que é o bastante para estimar área. */
function measure(at: At, steps = 24) {
  let len = 0;
  let [px, py] = at(0, 0.5);
  for (let i = 1; i <= steps; i++) {
    const [x, y] = at(i / steps, 0.5);
    len += Math.hypot(x - px, y - py);
    px = x;
    py = y;
  }
  return len;
}

/** Peça com espessura: a área sai do comprimento vezes a largura. */
function put(into: Piece[], at: At, from: number, to: number, width: number) {
  into.push({ at, area: Math.max(measure(at), 1) * width, from, to });
}

/** Peça cuja área já se sabe — o disco de um átomo, por exemplo. */
function putArea(into: Piece[], at: At, from: number, to: number, area: number) {
  into.push({ at, area, from, to });
}

/**
 * Reparte `n` pontos entre as peças, em proporção à área, e devolve o buffer
 * pronto. O jitter no parâmetro evita que os pontos caiam numa régua perfeita.
 */
function render(pieces: Piece[], n: number): Float32Array {
  const total = pieces.reduce((sum, p) => sum + p.area, 0) || 1;
  const out = new Float32Array(n * 3);
  let i = 0;
  pieces.forEach((p, k) => {
    const last = k === pieces.length - 1;
    const share = last ? n - i : Math.min(n - i, Math.round((n * p.area) / total));
    for (let j = 0; j < share; j++, i++) {
      const t = Math.min(1, (j + Math.random() * 0.92) / Math.max(share, 1));
      const [x, y] = p.at(t, Math.random());
      out[i * 3] = x / BOX - 0.5;
      out[i * 3 + 1] = 0.5 - y / BOX;
      out[i * 3 + 2] = p.from + (p.to - p.from) * t;
    }
  });
  /* Sobra por arredondamento: repete pontos já colocados, com um empurrão. */
  for (let k = i; k < n && i > 0; k++) {
    const src = (Math.random() * i) | 0;
    out[k * 3] = out[src * 3] + (Math.random() - 0.5) * 0.004;
    out[k * 3 + 1] = out[src * 3 + 1] + (Math.random() - 0.5) * 0.004;
    out[k * 3 + 2] = out[src * 3 + 2];
  }
  return out;
}

/* ---------------------------------------------------------------- letras */

/**
 * O vazado da letra de um átomo: diz se um ponto cai dentro dela.
 *
 * A máscara é dilatada de propósito. A letra é um buraco num campo de pontos,
 * e buraco do tamanho exato do desenho fecha sozinho quando os pontos vizinhos
 * derivam — a folga é o que mantém a haste aberta.
 */
function glyphMask(char: string, size: number): (dx: number, dy: number) => boolean {
  const grid = 64;
  const canvas = document.createElement("canvas");
  canvas.width = grid;
  canvas.height = grid;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const raw = new Uint8Array(grid * grid);
  if (ctx) {
    const family =
      getComputedStyle(document.documentElement).getPropertyValue("--font-archivo").trim() ||
      "system-ui";
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, grid, grid);
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `700 ${Math.round(grid * 0.78)}px ${family}, Archivo, system-ui, sans-serif`;
    ctx.fillText(char, grid / 2, grid / 2 + grid * 0.03);
    const { data } = ctx.getImageData(0, 0, grid, grid);
    for (let k = 0; k < grid * grid; k++) raw[k] = data[k * 4] < 128 ? 1 : 0;
  }

  /* Dilatação em cruz, três vezes — a folga que mantém a haste aberta. */
  const mask = raw.slice();
  for (let pass = 0; pass < 3; pass++) {
    const prev = mask.slice();
    for (let y = 1; y < grid - 1; y++) {
      for (let x = 1; x < grid - 1; x++) {
        const k = y * grid + x;
        if (prev[k] || prev[k - 1] || prev[k + 1] || prev[k - grid] || prev[k + grid]) mask[k] = 1;
      }
    }
  }

  return (dx, dy) => {
    const gx = Math.round((dx / size + 0.5) * grid);
    const gy = Math.round((dy / size + 0.5) * grid);
    if (gx < 0 || gy < 0 || gx >= grid || gy >= grid) return false;
    return mask[gy * grid + gx] === 1;
  };
}

/* ------------------------------------------------------------- moléculas */

type Atom = [x: number, y: number, r: number, label: string];
type Bond = [a: number, b: number, double?: boolean];
type Charge = [x: number, y: number, r: number, plus: boolean];

/** Espessura das ligações e do anel da carga, em unidades da caixa. */
const BOND = 24;

/**
 * Uma molécula: átomos como discos cheios com a letra vazada, ligações como
 * barras, e a carga num anel à parte. A ordem de construção sai da distância
 * ao primeiro átomo — a molécula se monta do centro para fora.
 */
function molecule(atoms: Atom[], bonds: Bond[], charge?: Charge) {
  const [ax, ay] = atoms[0];
  const reach = Math.max(...atoms.map(([x, y]) => Math.hypot(x - ax, y - ay)), 1) * 1.05;
  const rank = (x: number, y: number) => 0.08 + 0.8 * (Math.hypot(x - ax, y - ay) / reach);

  return (n: number) => {
    const pieces: Piece[] = [];

    for (const [a, b, double] of bonds) {
      const [x1, y1] = atoms[a];
      const [x2, y2] = atoms[b];
      const len = Math.hypot(x2 - x1, y2 - y1) || 1;
      const nx = (-(y2 - y1) / len) * 16;
      const ny = ((x2 - x1) / len) * 16;
      const from = rank(x1, y1);
      const to = rank(x2, y2);
      for (const k of double ? [-1, 1] : [0]) {
        const spine = line(x1 + nx * k, y1 + ny * k, x2 + nx * k, y2 + ny * k);
        put(pieces, ribbon(spine, double ? BOND * 0.62 : BOND), from, to, double ? BOND * 0.62 : BOND);
      }
    }

    for (const [x, y, r, label] of atoms) {
      const o = rank(x, y);
      /* A letra vazada tem de ser grande: o ponto que preenche o disco é
         gordo, e haste fina fecha sozinha sob ele. */
      const size = r * 1.48;
      const mask = glyphMask(label, size);
      putArea(
        pieces,
        disc(x, y, r, (px, py) => mask(px - x, py - y)),
        o,
        o + 0.05,
        Math.PI * r * r,
      );
    }

    if (charge) {
      const [x, y, r, plus] = charge;
      const wire = 11;
      putArea(
        pieces,
        (t, s) => {
          const a = t * TAU;
          const rr = r + (s - 0.5) * wire;
          return [x + rr * Math.cos(a), y + rr * Math.sin(a)];
        },
        0.9,
        0.96,
        TAU * r * wire,
      );
      put(pieces, ribbon(line(x - r * 0.46, y, x + r * 0.46, y), wire), 0.92, 0.97, wire);
      if (plus) put(pieces, ribbon(line(x, y - r * 0.46, x, y + r * 0.46), wire), 0.92, 0.97, wire);
    }

    return render(pieces, n);
  };
}

/** NO₃⁻ — o que a raiz recebe. Triângulo: um N no centro, três O. */
export const nitrate = molecule(
  [
    [500, 516, 92, "N"],
    [500, 232, 88, "O"],
    [254, 658, 88, "O"],
    [746, 658, 88, "O"],
  ],
  [
    [0, 1, true],
    [0, 2],
    [0, 3],
  ],
  [782, 282, 48, false],
);

/** NH₄⁺ — duas reduções depois. Cruz: quatro H em torno do N. */
export const ammonium = molecule(
  [
    [500, 500, 100, "N"],
    [500, 190, 68, "H"],
    [500, 810, 68, "H"],
    [190, 500, 68, "H"],
    [810, 500, 68, "H"],
  ],
  [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
  ],
  [800, 228, 48, true],
);

/** A peça pronta: grupo amino, carbono alfa com a cadeia lateral, grupo ácido. */
export const aminoAcid = molecule(
  [
    [160, 466, 84, "N"],
    [420, 500, 80, "C"],
    [668, 416, 80, "C"],
    [716, 176, 82, "O"],
    [896, 542, 82, "O"],
    [420, 782, 90, "R"],
  ],
  [
    [0, 1],
    [1, 2],
    [2, 3, true],
    [2, 4],
    [1, 5],
  ],
);

/* ------------------------------------------------------------------ soja */

/** Onde acaba a parte de cima e começa a raiz. */
const GROUND = 700;

/** Nós do caule: altura, lado, tamanho do trifólio e quando ele nasce. */
const NODES: [y: number, side: number, len: number, order: number][] = [
  [284, 1, 122, 0.14],
  [398, -1, 142, 0.24],
  [516, 1, 162, 0.34],
  [636, -1, 172, 0.44],
];

/**
 * O caule e a raiz recebem mais cota do que a área deles pediria. Sem isso a
 * folhagem, que é quase toda a tinta do desenho, deixaria o resto ralo — e é
 * o resto que sustenta a leitura: sem caule a folha flutua, sem raiz a frase
 * da etapa seguinte não tem a que se agarrar.
 */
const BOOST = { stem: 1.8, root: 2.3, pod: 1.4 };

/** Um folíolo cheio: ovado, de bico, preenchido de borda a borda. */
function leaflet(
  into: Piece[],
  x: number,
  y: number,
  len: number,
  wid: number,
  rot: number,
  o: number,
) {
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);
  /* O folíolo é desenhado apontando para −y e depois girado. */
  const place = (lx: number, ly: number): [number, number] => [
    x + lx * cos - ly * sin,
    y + lx * sin + ly * cos,
  ];
  const edge =
    (side: number): At =>
    (t) => {
      const u = 1 - t;
      const b = 3 * u * u * t;
      const c = 3 * u * t * t;
      const d = t * t * t;
      return place(
        (b * wid * 0.64 + c * wid * 0.3) * side,
        b * -len * 0.16 + c * -len * 0.86 + d * -len,
      );
    };
  put(into, band(edge(-1), edge(1)), o, o + 0.05, wid * 0.62);
}

/** Trifólio: o folíolo terminal na ponta do pecíolo e dois laterais atrás. */
function trifoliate(into: Piece[], x: number, y: number, dir: number, len: number, o: number) {
  const rot = dir + Math.PI / 2;
  const wid = len * 0.56;
  const bx = x - Math.cos(dir) * len * 0.34;
  const by = y - Math.sin(dir) * len * 0.34;
  leaflet(into, bx, by, len * 0.76, wid * 0.76, rot - 1, o + 0.01);
  leaflet(into, bx, by, len * 0.76, wid * 0.76, rot + 1, o + 0.02);
  leaflet(into, x, y, len, wid, rot, o);
}

/** Vagem cheia, com os três grãos marcados por um estreitamento na casca. */
function pod(into: Piece[], x: number, y: number, len: number, rot: number, o: number) {
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);
  const place = (lx: number, ly: number): [number, number] => [
    x + lx * cos - ly * sin,
    y + lx * sin + ly * cos,
  ];
  const r = len * 0.19;
  /* A cintura entre os grãos: três lóbulos ao longo do eixo. */
  const spine: At = (t) => place(0, -len * t);
  const fat = (t: number) => r * 2 * (0.62 + 0.38 * Math.abs(Math.sin(t * Math.PI * 3)));
  put(into, ribbon(spine, fat), o, o + 0.03, r * 2 * BOOST.pod);
}

/**
 * Raiz: uma pivotante que desce e se ramifica. Recursiva porque raiz é isso —
 * o mesmo gesto repetido em escala menor. A ordem cresce com a profundidade da
 * recursão, então a raiz **cresce**: primeiro a pivotante, depois as
 * ramificações, depois as pontas.
 */
function root(
  into: Piece[],
  x: number,
  y: number,
  angle: number,
  len: number,
  depth: number,
  from: number,
  span: number,
) {
  const ex = x + Math.cos(angle) * len;
  const ey = y + Math.sin(angle) * len;
  const spine = quad(
    x,
    y,
    x + Math.cos(angle - 0.22) * len * 0.55,
    y + Math.sin(angle - 0.22) * len * 0.55,
    ex,
    ey,
  );
  /* Afina da base para a ponta, como raiz de verdade. */
  const wide = Math.max(4, len * 0.1);
  put(
    into,
    ribbon(spine, (t) => wide * (1 - 0.6 * t)),
    from,
    Math.min(1, from + span),
    wide * BOOST.root,
  );
  if (depth <= 0 || len < 46) return;
  const mx = x + Math.cos(angle - 0.14) * len * 0.52;
  const my = y + Math.sin(angle - 0.14) * len * 0.52;
  const next = Math.min(1, from + span);
  const sub = span * 0.8;
  root(into, mx, my, angle - 0.62, len * 0.52, depth - 1, next, sub);
  root(into, ex, ey, angle + 0.5, len * 0.58, depth - 1, next, sub);
  root(into, ex, ey, angle - 0.28, len * 0.66, depth - 1, next, sub);
}

/**
 * A planta inteira. A ordem de construção desce com ela: o topo primeiro, os
 * trifólios conforme o caule passa por eles, e a raiz por último, crescendo
 * para fora. É isso que a linha do tempo lê para fazê-la nascer.
 */
export function soybean(n: number): Float32Array {
  const pieces: Piece[] = [];

  /* O caule, de cima para baixo — e por isso escrito nesse sentido —, mais
     grosso embaixo, que é como a planta realmente engrossa. */
  const stem = cubic(500, 132, 500, 220, 512, 380, 498, GROUND);
  put(pieces, ribbon(stem, (t) => 9 + 16 * t), 0.02, 0.5, 17 * BOOST.stem);

  trifoliate(pieces, 500, 132, -Math.PI / 2, 112, 0.02);

  for (const [y, side, len, o] of NODES) {
    const x = 500 + (GROUND - y) * 0.012 * side;
    const reach = len * 0.78;
    const dir = side > 0 ? -0.42 : Math.PI + 0.42;
    const tipX = x + Math.cos(dir) * reach;
    const tipY = y + Math.sin(dir) * reach;
    const petiole = quad(
      x,
      y,
      x + Math.cos(dir) * reach * 0.6,
      y + Math.sin(dir) * reach * 0.42,
      tipX,
      tipY,
    );
    put(pieces, ribbon(petiole, 10), o, o + 0.02, 10 * BOOST.stem);
    trifoliate(pieces, tipX, tipY, dir, len, o + 0.02);
  }

  pod(pieces, 556, 640, 132, -0.5, 0.46);
  pod(pieces, 596, 684, 114, -0.78, 0.48);

  /* A raiz, por último e crescendo para fora. */
  root(pieces, 500, GROUND - 8, Math.PI / 2 + 0.03, 190, 3, 0.55, 0.1);
  root(pieces, 494, GROUND + 26, Math.PI / 2 + 0.85, 118, 2, 0.66, 0.09);
  root(pieces, 506, GROUND + 34, Math.PI / 2 - 0.82, 126, 2, 0.68, 0.09);
  root(pieces, 498, GROUND + 78, Math.PI / 2 + 0.5, 92, 2, 0.78, 0.08);
  root(pieces, 503, GROUND + 92, Math.PI / 2 - 0.46, 86, 2, 0.8, 0.08);

  return render(pieces, n);
}
