/**
 * Monta a nuvem: a mesma quantidade N de partículas nos três estados.
 *
 * O estado da foto é a soma de duas amostras — o fundo (campo, céu, bombona)
 * e as folhas recortadas do primeiro plano, que ganham ponto maior e borda
 * mais macia. As duas formas são amostradas inteiras. O pareamento entre os
 * estados é o índice, e portanto aleatório: é ele que faz a nuvem se soltar
 * de verdade no morph em vez de escorregar de A para B em linha reta.
 */

import { type Cloud, type Weight, cover, loadImage, luma, pixelsOf, stipple } from "./sample";
import { aminoAcid, soybean } from "./shapes";
import type { FieldData } from "./field";

export { cover };

/** As duas camadas do hero, por formato de tela — o mesmo corte do CSS. */
const LAYERS = {
  wide: { bg: "/img/aminosan-b/hero-bg.webp", leaves: "/img/aminosan-b/hero-leaves.webp" },
  narrow: {
    bg: "/img/aminosan-b/hero-bg-mobile.webp",
    leaves: "/img/aminosan-b/hero-leaves-mobile.webp",
  },
} as const;

/** Fração das partículas que fica nas folhas do primeiro plano. */
const FOREGROUND = 0.22;

/** Rampa suave de 0 a 1 dentro de um intervalo, com bordas de `soft`. */
const band = (t: number, from: number, to: number, soft: number) =>
  Math.min(smooth((t - from) / soft), smooth((to - t) / soft));

const smooth = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
};

/**
 * A caixa da bombona na foto, em coordenadas normalizadas. Dentro dela a
 * densidade sobe: é o que mantém a silhueta e o nome AMINOSAN legíveis
 * quando a cena já virou só pontos.
 */
const jug = (u: number, v: number) => band(u, 0.37, 0.62, 0.06) * band(v, 0.35, 0.88, 0.06);

/**
 * O rótulo, dentro da bombona. Ali a regra é outra: nada de reforço plano,
 * que encheria o papel branco de pontos e afogaria o texto. Vale contraste —
 * letra preta densa, papel vazio —, que é o que faz o nome AMINOSAN se ler
 * quando a cena já virou pontilhado.
 */
const label = (u: number, v: number) => band(u, 0.415, 0.575, 0.02) * band(v, 0.5, 0.82, 0.02);

/* Fundo: densidade pela escuridão do pixel, com o reforço da bombona. O céu
   claro fica vazio de propósito — é o papel em branco da referência. */
const weightBg: Weight = (r, g, b, _a, u, v) => {
  const dark = 1 - luma(r, g, b);
  const k = jug(u, v);
  const t = label(u, v);
  /* Piso: abaixo dele o pixel é céu, e céu é papel em branco. Sem o corte,
     a claridade rende um chuvisco de pontos no alto que a referência não
     tem — e cada ponto ali é um ponto a menos onde a imagem existe. */
  const base = dark < 0.13 ? 0 : Math.pow(dark, 1.32);
  const body = base * (1 + 1.9 * k) + 0.055 * k;
  /* No rótulo vale corte, não curva: qualquer peso contínuo salpica também o
     papel branco, e o nome afoga no próprio fundo. Abaixo do corte não nasce
     ponto nenhum; acima, nasce com peso cheio. */
  const type = smooth((dark - 0.33) / 0.14);
  return Math.min(1, body * (1 - t) + type * t);
};

/* Folhas: recorte com alfa, mais escuras que o fundo e já desfocadas na
   própria foto. */
const weightLeaves: Weight = (r, g, b, a) =>
  a < 40 ? 0 : (a / 255) * (0.35 + 0.75 * Math.pow(1 - luma(r, g, b), 1.1));

/* Formas desenhadas: tinta é ponto, papel não é. */
const weightInk: Weight = (r, g, b) => Math.pow(1 - luma(r, g, b), 1.15);

/** Junta duas nuvens numa só, na ordem em que vieram. */
function concat(a: Cloud, b: Cloud): Cloud {
  const pos = new Float32Array(a.pos.length + b.pos.length);
  pos.set(a.pos);
  pos.set(b.pos, a.pos.length);
  const color = new Float32Array(a.color.length + b.color.length);
  color.set(a.color);
  color.set(b.color, a.color.length);
  return { count: a.count + b.count, pos, color };
}

/** As duas formas, amostradas com a contagem pedida. */
export function shapeClouds(count: number) {
  /* 900 px de lado: acima disso o pontilhado não muda e o getImageData
     começa a pesar no celular. */
  return {
    plant: stipple(soybean(900), count, weightInk),
    mol: stipple(aminoAcid(900), count, weightInk),
  };
}

export type Built = {
  data: FieldData;
  /** Proporção da foto do hero, para refazer o `cover` a cada resize. */
  heroAspect: number;
};

export async function buildField(count: number, narrow: boolean): Promise<Built> {
  const src = narrow ? LAYERS.narrow : LAYERS.wide;
  const [bgImg, leavesImg] = await Promise.all([loadImage(src.bg), loadImage(src.leaves)]);

  const fgCount = Math.round(count * FOREGROUND);
  const bgCount = count - fgCount;
  const photo = concat(
    stipple(pixelsOf(bgImg), bgCount, weightBg),
    stipple(pixelsOf(leavesImg), fgCount, weightLeaves),
  );

  const { plant, mol } = shapeClouds(count);

  /* Tamanho, profundidade e semente. No fundo a profundidade cresce para o
     pé da foto — o solo está perto da câmera, o horizonte não —, e nas
     folhas ela é quase total, que é de onde vem o ponto grande e macio. */
  const meta = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const front = i >= bgCount;
    const u = photo.pos[i * 2] + 0.5;
    const v = 0.5 - photo.pos[i * 2 + 1];
    const depth = front ? 0.62 + Math.random() * 0.38 : band(v, 0.52, 1.1, 0.5) * 0.3;
    /* No rótulo o ponto encolhe: com o ponto do resto da cena, três pontos
       cobrem a haste de uma letra e o nome vira tarja. */
    const fine = front ? 1 : 1 - 0.3 * label(u, v);
    meta[i * 3] = (front ? 3.2 : 1.95) * (0.7 + Math.random() * 0.9) * fine;
    meta[i * 3 + 1] = depth;
    meta[i * 3 + 2] = Math.random();
  }

  return {
    data: {
      count,
      hero: photo.pos,
      plant: plant.pos,
      mol: mol.pos,
      color: photo.color,
      meta,
    },
    heroAspect: bgImg.naturalWidth / bgImg.naturalHeight,
  };
}

/**
 * O quadro estático do caminho sem WebGL (ou com menos movimento): o mesmo
 * pontilhado, desenhado uma vez em canvas 2D, em grafite sobre o off-white.
 */
export function paintStill(canvas: HTMLCanvasElement, cloud: Cloud, dark: string) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (!w || !h) return;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = dark;
  const scale = Math.min(w, h) * 0.92;
  for (let i = 0; i < cloud.count; i++) {
    const x = w / 2 + cloud.pos[i * 2] * scale;
    const y = h / 2 - cloud.pos[i * 2 + 1] * scale;
    const r = 0.6 + Math.random() * 0.7;
    ctx.globalAlpha = 0.5 + Math.random() * 0.45;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
