/**
 * As duas formas em que a nuvem se reorganiza depois do hero.
 *
 * Elas são **desenhadas**, não modeladas: cada uma pinta um quadrado branco
 * com tinta de tons diferentes e o pontilhador de sample.ts faz o resto. Isso
 * mantém um caminho só para a foto e para as formas, e deixa a densidade
 * interna sob controle direto — borda e nervura mais escuras viram linhas
 * densas de pontos, que é o que faz a silhueta ficar legível.
 *
 * Tudo é escrito numa caixa de 1000×1000 e escalado na hora de desenhar; as
 * coordenadas abaixo, portanto, leem-se como porcentagem com uma casa.
 */

const BOX = 1000;

/* A tinta, do mais claro ao mais escuro. Quanto mais escuro, mais ponto. */
const INK = {
  flesh: "#585852", // miolo da folha
  edge: "#14140e", // contorno
  midrib: "#1e1e16",
  vein: "#3a3a30",
  stem: "#1c1c14",
  pod: "#2b2b1e",
  bond: "#33332a",
  atom: "#1d1d16",
};

type Ctx = CanvasRenderingContext2D;

/** Prepara um canvas quadrado branco e devolve o contexto já escalado. */
function board(size: number): Ctx {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("origin: sem contexto 2D");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, size, size);
  ctx.scale(size / BOX, size / BOX);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  return ctx;
}

/** Devolve os pixels do canvas em que se desenhou. */
function pixels(ctx: Ctx): ImageData {
  const { canvas } = ctx;
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/* ------------------------------------------------------------------ soja */

/**
 * Um folíolo: ovado, ponta para cima (−y) antes da rotação, com a nervura
 * central e três pares de laterais. A folha da soja é trifoliolada — são
 * três destes por pecíolo, e é essa assinatura que faz a silhueta ser lida
 * como soja e não como "uma planta qualquer".
 */
function leaflet(ctx: Ctx, x: number, y: number, len: number, wid: number, rot: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);

  /* Ovado e de bico: os pontos de controle de cima entram bem para o eixo,
     senão o folíolo engorda na ponta e o trifólio vira um trevo. */
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(wid * 0.64, -len * 0.16, wid * 0.3, -len * 0.86, 0, -len);
  ctx.bezierCurveTo(-wid * 0.3, -len * 0.86, -wid * 0.64, -len * 0.16, 0, 0);
  ctx.closePath();
  ctx.fillStyle = INK.flesh;
  ctx.fill();
  ctx.strokeStyle = INK.edge;
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.strokeStyle = INK.midrib;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, -len * 0.02);
  ctx.lineTo(0, -len * 0.95);
  ctx.stroke();

  ctx.strokeStyle = INK.vein;
  ctx.lineWidth = 2.4;
  for (const t of [0.26, 0.46, 0.66]) {
    const reach = wid * 0.42 * (1 - t * 0.5);
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(0, -len * t);
      ctx.quadraticCurveTo(side * reach, -len * (t + 0.08), side * reach * 1.1, -len * (t + 0.2));
      ctx.stroke();
    }
  }
  ctx.restore();
}

/**
 * Trifólio: o folíolo terminal na ponta do pecíolo e dois laterais presos
 * bem atrás dele, abrindo quase noventa graus. Os três partindo do mesmo
 * ponto dariam um trevo; é o recuo da base que deixa passar o papel entre
 * eles e faz a folha ser lida como soja.
 */
function trifoliate(ctx: Ctx, x: number, y: number, dir: number, len: number) {
  const rot = dir + Math.PI / 2;
  const wid = len * 0.56;
  const backX = x - Math.cos(dir) * len * 0.34;
  const backY = y - Math.sin(dir) * len * 0.34;
  leaflet(ctx, backX, backY, len * 0.76, wid * 0.76, rot - 1);
  leaflet(ctx, backX, backY, len * 0.76, wid * 0.76, rot + 1);
  leaflet(ctx, x, y, len, wid, rot);
}

/** Vagem: três grãos marcados sob a casca, que é o desenho que se reconhece. */
function pod(ctx: Ctx, x: number, y: number, len: number, rot: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  const r = len * 0.17;
  ctx.fillStyle = INK.pod;
  ctx.strokeStyle = INK.edge;
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let i = 0; i < 3; i++) ctx.ellipse(0, -len * (0.22 + i * 0.26), r, r * 1.16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(r * 1.5, -len * 0.5, 0, -len);
  ctx.quadraticCurveTo(-r * 1.5, -len * 0.5, 0, 0);
  ctx.stroke();
  ctx.restore();
}

/** Nós do caule: altura, lado e tamanho do trifólio. */
const NODES: [y: number, side: number, len: number][] = [
  [845, -1, 215],
  [700, 1, 205],
  [560, -1, 180],
  [425, 1, 155],
];

/** A planta inteira: caule, quatro trifólios alternados, topo e duas vagens. */
export function soybean(size: number): ImageData {
  const ctx = board(size);

  /* O caule: um traço só, passado duas vezes — mais grosso embaixo, que é
     como a planta realmente engrossa da ponta para a base. */
  ctx.strokeStyle = INK.stem;
  ctx.beginPath();
  ctx.moveTo(498, 975);
  ctx.bezierCurveTo(488, 780, 515, 540, 500, 300);
  ctx.lineTo(500, 205);
  ctx.lineWidth = 15;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(498, 975);
  ctx.bezierCurveTo(492, 880, 494, 800, 495, 740);
  ctx.lineWidth = 24;
  ctx.stroke();

  for (const [y, side, len] of NODES) {
    const x = 500 + (975 - y) * 0.01 * side;
    const reach = len * 0.78;
    const dir = side > 0 ? -0.42 : Math.PI + 0.42;
    const tipX = x + Math.cos(dir) * reach;
    const tipY = y + Math.sin(dir) * reach;

    ctx.strokeStyle = INK.stem;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + Math.cos(dir) * reach * 0.6, y + Math.sin(dir) * reach * 0.42, tipX, tipY);
    ctx.stroke();

    trifoliate(ctx, tipX, tipY, dir, len);
  }

  /* O topo, apontando para cima. */
  trifoliate(ctx, 500, 205, -Math.PI / 2, 140);

  /* As vagens ficam à direita do caule baixo, onde o trifólio de baixo — que
     sai para a esquerda — não passa por cima delas. */
  pod(ctx, 566, 818, 152, -0.5);
  pod(ctx, 614, 872, 132, -0.78);

  return pixels(ctx);
}

/* -------------------------------------------------------------- molécula */

/* O esqueleto de um L-aminoácido: grupo amino, carbono alfa com a cadeia
   lateral, e o grupo ácido com a carbonila e a hidroxila. É a estrutura que
   a legenda da seção soletra — NH₂ — CH(R) — COOH. */
const ATOMS: [x: number, y: number, r: number, label: string][] = [
  [168, 470, 80, "N"],
  [420, 500, 76, "C"],
  [660, 420, 76, "C"],
  [706, 186, 78, "O"],
  [886, 540, 78, "O"],
  [420, 772, 86, "R"],
];

/** Ligações, por índice de átomo. `double` desenha a carbonila. */
const BONDS: [a: number, b: number, double?: boolean][] = [
  [0, 1],
  [1, 2],
  [2, 3, true],
  [2, 4],
  [1, 5],
];

export function aminoAcid(size: number): ImageData {
  const ctx = board(size);

  /* O canvas não resolve `var()` na fonte: o nome que o next/font gerou sai
     da variável do próprio documento, já computada. */
  const family =
    getComputedStyle(document.documentElement).getPropertyValue("--font-archivo").trim() ||
    "system-ui";

  ctx.strokeStyle = INK.bond;
  for (const [a, b, double] of BONDS) {
    const [x1, y1] = ATOMS[a];
    const [x2, y2] = ATOMS[b];
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    const nx = (-(y2 - y1) / len) * 17;
    const ny = ((x2 - x1) / len) * 17;
    ctx.lineWidth = 21;
    for (const k of double ? [-1, 1] : [0]) {
      ctx.beginPath();
      ctx.moveTo(x1 + nx * k, y1 + ny * k);
      ctx.lineTo(x2 + nx * k, y2 + ny * k);
      ctx.stroke();
    }
  }

  /* As letras entram em branco, vazadas no disco: viram buracos no campo de
     pontos, e é assim que se leem — do mesmo jeito que o nome na bombona. */
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const [x, y, r, label] of ATOMS) {
    ctx.fillStyle = INK.atom;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = `600 ${Math.round(r * 1.05)}px ${family}, Archivo, system-ui, sans-serif`;
    ctx.fillText(label, x, y + r * 0.04);
  }

  return pixels(ctx);
}
