/**
 * O frasco do Aminosan® de 1988 virando o frasco de hoje — usado na Home
 * (`components/home/HistoryBottle.tsx`, em loop) e na LP do Aminosan®
 * (`components/aminosan-b/Heritage.tsx`, preso ao scroll).
 *
 * Os 73 quadros do vídeo `docs/assets/aminosan-bottle-1988-to-today.mp4`
 * (508×682, 24 fps, fundo branco), numa grade de 10 colunas × 8 linhas num
 * único WebP estático de 5080×5456. Grade, e não coluna: 73 × 682 px em pé
 * passaria do limite de 16 383 px do WebP. Gerado assim:
 *
 *   ffmpeg -i aminosan-bottle-1988-to-today.mp4 vf/%03d.png
 *   # e, em Python/PIL, cada quadro i colado em ((i % 10) * 508, (i // 10) * 682)
 *   # numa tela branca de 5080×5456, gravada em WebP q86, method 6.
 *
 * Se o vídeo mudar, a sprite precisa ser gerada de novo e estas constantes
 * acompanharem.
 */
export const BOTTLE = {
  src: "/img/aminosan-bottle-frames.webp",
  frames: 73,
  cols: 10,
  rows: 8,
  w: 508,
  h: 682,
  /** Cadência do vídeo original (24 fps). */
  frameMs: 1000 / 24,
  /** Ano de fabricação do frasco — é o que aparece no primeiro quadro. */
  from: 1988,
} as const;

/** Onde o quadro `i` está na grade, em pixels da sprite. */
export function bottleCell(i: number) {
  return { x: (i % BOTTLE.cols) * BOTTLE.w, y: Math.floor(i / BOTTLE.cols) * BOTTLE.h };
}

/**
 * O quadro `i` como `background-position`, para quem desenha a sprite em CSS
 * com `background-size: cols×100% rows×100%`.
 */
export function bottlePosition(i: number) {
  const col = i % BOTTLE.cols;
  const row = Math.floor(i / BOTTLE.cols);
  return `${(col / (BOTTLE.cols - 1)) * 100}% ${(row / (BOTTLE.rows - 1)) * 100}%`;
}
