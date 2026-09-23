/**
 * O pontilhado da foto do hero, para a cena da LP B.
 *
 * É o princípio da primeira versão da cena (`lib/origin/build.ts`): a foto
 * não vira uma grade, vira um **desenho de pontos** dela mesma — denso onde a
 * imagem é escura, vazio onde é céu, com a bombona reforçada e o nome no
 * rótulo em contraste. As folhas do primeiro plano são amostradas à parte e
 * marcadas com profundidade 1: o shader dá a elas ponto maior e borda macia,
 * a profundidade de campo da foto.
 *
 * A contagem é a da molécula, e não a de uma fotografia: todo ponto daqui
 * viaja e vira o aminoácido.
 */

type Band = [from: number, to: number];

/** Onde ficam a bombona e o rótulo na foto, em coordenadas 0–1. Cada formato
    de foto (paisagem e retrato) tem o seu. */
export type Frame = {
  jug: { u: Band; v: Band };
  label: { u: Band; v: Band };
};

export const FRAMES: Record<"wide" | "narrow", Frame> = {
  wide: {
    jug: { u: [0.37, 0.62], v: [0.35, 0.88] },
    label: { u: [0.415, 0.575], v: [0.5, 0.82] },
  },
  narrow: {
    jug: { u: [0.23, 0.76], v: [0.31, 0.7] },
    label: { u: [0.31, 0.68], v: [0.4, 0.64] },
  },
};

/** Fração dos pontos que fica nas folhas do primeiro plano. */
const FOREGROUND = 0.2;

const smooth = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
};

/** Rampa de 0 a 1 dentro de um intervalo, com bordas de `soft`. */
const band = (t: number, [from, to]: Band, soft: number) =>
  Math.min(smooth((t - from) / soft), smooth((to - t) / soft));

const luma = (r: number, g: number, b: number) => (0.299 * r + 0.587 * g + 0.114 * b) / 255;

type Weight = (r: number, g: number, b: number, a: number, u: number, v: number) => number;

/* 900 px de lado: acima disso o pontilhado não muda e o getImageData começa
   a pesar no celular. */
function pixelsOf(img: HTMLImageElement) {
  const scale = Math.min(1, 900 / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("stipple: sem canvas 2D");
  ctx.drawImage(img, 0, 0, w, h);
  return { data: ctx.getImageData(0, 0, w, h).data, w, h };
}

/** Amostragem por rejeição: sorteia um pixel e aceita com a probabilidade do
    peso dele. Com teto de tentativas, para uma imagem quase vazia não travar. */
function sample(img: HTMLImageElement, count: number, weight: Weight, uv: Float32Array, at: number) {
  const { data, w, h } = pixelsOf(img);
  let n = 0;
  for (let tries = 0; n < count && tries < count * 200; tries++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const k = ((y | 0) * w + (x | 0)) * 4;
    const u = x / w;
    const v = y / h;
    if (Math.random() >= weight(data[k], data[k + 1], data[k + 2], data[k + 3], u, v)) continue;
    uv[(at + n) * 2] = u;
    uv[(at + n) * 2 + 1] = v;
    n++;
  }
  /* Se o teto chegou antes, os que faltam repetem os já aceitos. */
  for (let i = n; i < count && n > 0; i++) {
    const src = at + ((Math.random() * n) | 0);
    uv[(at + i) * 2] = uv[src * 2];
    uv[(at + i) * 2 + 1] = uv[src * 2 + 1];
  }
}

export function stipplePhoto(bg: HTMLImageElement, leaves: HTMLImageElement, count: number, frame: Frame) {
  const jug = (u: number, v: number) => band(u, frame.jug.u, 0.06) * band(v, frame.jug.v, 0.06);
  const label = (u: number, v: number) => band(u, frame.label.u, 0.02) * band(v, frame.label.v, 0.02);

  /* Fundo: densidade pela escuridão do pixel, com a bombona reforçada. Abaixo
     do piso o pixel é céu, e céu é papel em branco. No rótulo vale corte, não
     curva: qualquer peso contínuo salpica o papel branco e afoga o nome. */
  const weightBg: Weight = (r, g, b, _a, u, v) => {
    const dark = 1 - luma(r, g, b);
    const k = jug(u, v);
    const t = label(u, v);
    const base = dark < 0.13 ? 0 : Math.pow(dark, 1.32);
    const body = base * (1 + 1.9 * k) + 0.055 * k;
    const type = smooth((dark - 0.33) / 0.14);
    return Math.min(1, body * (1 - t) + type * t);
  };

  /* Folhas: o recorte com alfa, mais escuras que o fundo. */
  const weightLeaves: Weight = (r, g, b, a) =>
    a < 40 ? 0 : (a / 255) * (0.35 + 0.75 * Math.pow(1 - luma(r, g, b), 1.1));

  const fg = Math.round(count * FOREGROUND);
  const uv = new Float32Array(count * 2);
  const depth = new Float32Array(count);
  sample(bg, count - fg, weightBg, uv, 0);
  sample(leaves, fg, weightLeaves, uv, count - fg);
  depth.fill(1, count - fg);
  return { uv, depth };
}
