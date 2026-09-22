/**
 * Pontilhado — de imagem (ou de desenho) para nuvem de pontos.
 *
 * O mesmo amostrador serve a foto do hero e às duas formas desenhadas: em
 * todos os casos a densidade sai da luminância do pixel, que é o que faz o
 * resultado parecer stippling de bico de pena e não uma grade de LEDs.
 *
 * O método é amostragem por rejeição: sorteia um pixel, calcula o peso dele,
 * aceita com probabilidade `peso / pico`. É O(1) de memória e, com o pico
 * medido antes, converge em poucas tentativas por ponto — bem mais barato que
 * montar a distribuição acumulada de um milhão de pixels.
 *
 * As posições saem normalizadas em [-0,5; 0,5] nos dois eixos, com **y para
 * cima** (convenção do shader, não do canvas). Assim a mesma nuvem serve a
 * qualquer viewport: quem decide o tamanho em pixels é o uniform de escala.
 */

/** Peso de um pixel: 0 não gera ponto, 1 é a densidade máxima. */
export type Weight = (
  r: number,
  g: number,
  b: number,
  a: number,
  /** posição do pixel na imagem, 0–1, y para baixo. */
  u: number,
  v: number,
) => number;

export type Cloud = {
  count: number;
  /** n×2, normalizado em [-0,5; 0,5], y para cima. */
  pos: Float32Array;
  /** n×3, cor do pixel amostrado, 0–1. */
  color: Float32Array;
};

export const luma = (r: number, g: number, b: number) =>
  (0.299 * r + 0.587 * g + 0.114 * b) / 255;

/** Carrega uma imagem do /public já decodificada. */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`origin: falhou ao carregar ${src}`));
    img.src = src;
  });
}

/**
 * Desenha a imagem num canvas de trabalho e devolve os pixels.
 *
 * `maxSide` corta a resolução: 2752 px de largura são 4 M de pixels para
 * sortear entre 60 mil pontos, e o detalhe que sobra não aparece no
 * pontilhado. Mil e poucos pixels de lado bastam e cabem no cache.
 */
export function pixelsOf(img: HTMLImageElement, maxSide = 1200): ImageData {
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("origin: sem contexto 2D");
  ctx.drawImage(img, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h);
}

/**
 * Sorteia `count` pontos sobre `img`, com densidade dada por `weight`.
 *
 * O jitter de subpixel existe para o resultado não denunciar a grade da
 * imagem: sem ele, dois pontos vizinhos caem sempre a uma distância exata.
 */
export function stipple(img: ImageData, count: number, weight: Weight): Cloud {
  const { width: w, height: h, data } = img;

  /* Pico do peso, numa varredura esparsa: é só o normalizador da rejeição,
     e errar um pouco para baixo só custa alguns pontos mais densos. */
  let peak = 0;
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      const i = (y * w + x) * 4;
      const p = weight(data[i], data[i + 1], data[i + 2], data[i + 3], x / w, y / h);
      if (p > peak) peak = p;
    }
  }

  const pos = new Float32Array(count * 2);
  const color = new Float32Array(count * 3);
  if (peak <= 0) return { count, pos, color };

  /* Teto de tentativas: uma forma muito vazada (a molécula é quase só fundo
     branco) tem taxa de aceitação baixa, e sem teto um peso mal escrito
     travaria a aba. Faltando pontos, os últimos repetem os já aceitos com
     um empurrãozinho — invisível, e a contagem N tem de fechar exata. */
  const limit = count * 200;
  let n = 0;
  for (let tries = 0; tries < limit && n < count; tries++) {
    const x = (Math.random() * w) | 0;
    const y = (Math.random() * h) | 0;
    const i = (y * w + x) * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (Math.random() * peak > weight(r, g, b, a, x / w, y / h)) continue;
    pos[n * 2] = (x + Math.random()) / w - 0.5;
    pos[n * 2 + 1] = 0.5 - (y + Math.random()) / h;
    color[n * 3] = r / 255;
    color[n * 3 + 1] = g / 255;
    color[n * 3 + 2] = b / 255;
    n++;
  }
  for (let k = n; k < count && n > 0; k++) {
    const src = (Math.random() * n) | 0;
    pos[k * 2] = pos[src * 2] + (Math.random() - 0.5) * 0.004;
    pos[k * 2 + 1] = pos[src * 2 + 1] + (Math.random() - 0.5) * 0.004;
    color[k * 3] = color[src * 3];
    color[k * 3 + 1] = color[src * 3 + 1];
    color[k * 3 + 2] = color[src * 3 + 2];
  }

  return { count, pos, color };
}

/**
 * Enquadramento `object-fit: cover` — o mesmo que o CSS faz com as duas
 * camadas do hero, refeito em números para o canvas cair exatamente sobre a
 * foto. Sem isto o crossfade daria um salto de escala.
 *
 * Devolve o tamanho desenhado e o deslocamento do centro da imagem em
 * relação ao centro da tela, em pixels CSS e com **y para cima**.
 */
export function cover(
  imgW: number,
  imgH: number,
  viewW: number,
  viewH: number,
  /** object-position, 0–1. y = 1 é `object-bottom`. */
  posX = 0.5,
  posY = 1,
) {
  const scale = Math.max(viewW / imgW, viewH / imgH);
  const dw = imgW * scale;
  const dh = imgH * scale;
  return {
    size: [dw, dh] as [number, number],
    offset: [(viewW - dw) * (posX - 0.5), -(viewH - dh) * (posY - 0.5)] as [number, number],
  };
}
