import { r2 } from "./shared";

/* Geometria dos desenhos da flora. */

export type Pt = { x: number; y: number };

/** Distribui pontos sem deixar dois mais perto que `gap` (amostragem por rejeição). */
export function scatter(
  count: number,
  gap: number,
  inside: (x: number, y: number) => boolean,
  sample: () => Pt,
  tries = 40,
) {
  const out: Pt[] = [];
  for (let n = 0; n < count; n++) {
    for (let k = 0; k < tries; k++) {
      const p = sample();
      if (!inside(p.x, p.y)) continue;
      if (out.some((q) => (q.x - p.x) ** 2 + (q.y - p.y) ** 2 < gap * gap)) continue;
      out.push(p);
      break;
    }
  }
  return out;
}

/** Segmento entre dois círculos, aparado nas bordas deles. */
export function bond(a: Pt & { r: number }, b: Pt & { r: number }, offset = 0, pad = 1.2) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const L = Math.hypot(dx, dy) || 1;
  const ux = dx / L;
  const uy = dy / L;
  const ox = -uy * offset;
  const oy = ux * offset;
  const x0 = a.x + ux * (a.r + pad) + ox;
  const y0 = a.y + uy * (a.r + pad) + oy;
  const x1 = b.x - ux * (b.r + pad) + ox;
  const y1 = b.y - uy * (b.r + pad) + oy;
  return `M${r2(x0)} ${r2(y0)}L${r2(x1)} ${r2(y1)}`;
}
