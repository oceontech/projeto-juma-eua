import { project, type ScanUniforms } from "./field";
import type { Form } from "./forms";

/**
 * Onde cada etiqueta das cenas de partículas pousa.
 *
 * A etiqueta não tem mais caixa de papel por baixo: ela precisa cair **fora**
 * do desenho. A cada quadro, uma amostra dos pontos da forma em cena é
 * projetada com o mesmo giro do shader e marcada numa grade grossa — é o
 * mapa do que está ocupado. Cada etiqueta procura, perto da âncora dela, a
 * posição de menor custo que não toca o desenho, a coluna de texto, a borda
 * da tela nem as outras etiquetas; o filete liga o anel à etiqueta onde quer
 * que ela tenha ficado.
 *
 * Quando nenhuma posição livre existe (janela estreita, desenho grande), a
 * etiqueta fica na que menos se sobrepõe e ganha `is-over` — um halo branco
 * desfocado, definido no CSS, só o bastante para o texto ler sobre os pontos.
 *
 * A posição escolhida é mantida enquanto continua livre (o desenho gira, e
 * trocar de lugar a cada quadro faria a etiqueta pular), e a etiqueta anda
 * até o alvo amortecida.
 */

/** Tamanho da célula da grade, em px. */
const CELL = 12;
/** Quantos pontos da forma entram no mapa. */
const SAMPLES = 1600;
/** Onde o texto da primeira linha tem o meio, a partir do topo da etiqueta. */
const LINE = 7;
/** Raio do anel: o filete começa na borda dele, não no centro. */
const RING = 9;
/** Folga entre o fim do filete e o texto. */
const GAP = 6;
/** Margens da cena: o cabeçalho em cima, a borda da tela dos lados e embaixo. */
const EDGE = { top: 96, side: 24, bottom: 40 };
/** Folga em volta da coluna de texto e entre duas etiquetas. */
const PAD = { panel: 32, label: 10 };

type Candidate = { dx: number; dy: number; flip: boolean; cost: number };

/* Distâncias da âncora até a etiqueta, na horizontal e na vertical. O custo
   prefere o filete curto e reto, do lado que a âncora pediu. */
const CANDIDATES: Candidate[] = (() => {
  const out: Candidate[] = [];
  const dxs = [16, 44, 60, 80, 104, 132, 164, 200, 244, 296, 360];
  /* Os saltos verticais grandes são para quando o desenho ocupa a largura
     toda: a etiqueta vai para cima ou para baixo dele. */
  const dys = [0, -18, 18, -36, 36, -58, 58, -84, 84, -116, 116, -150, 150, -190, 190, -240, 240, -300, 300];
  for (const flip of [false, true])
    for (const dx of dxs)
      for (const dy of dys)
        out.push({ dx, dy, flip, cost: dx + Math.abs(dy) * 1.4 + (flip ? 160 : 0) });
  return out.sort((a, b) => a.cost - b.cost);
})();

type Slot = {
  lead: HTMLElement | null;
  tag: HTMLElement | null;
  w: number;
  h: number;
  /** A posição desenhada, relativa à âncora (canto superior esquerdo). */
  x: number;
  y: number;
  /** O candidato em uso, para mantê-lo enquanto estiver livre. */
  pick: Candidate | null;
  side: number;
  over: boolean;
};

type Rect = { x0: number; y0: number; x1: number; y1: number };

export function createCallouts(
  stage: HTMLElement,
  calls: HTMLElement[],
  forms: Form[],
  panel: HTMLElement | null,
) {
  const slots: Slot[] = calls.map((el) => ({
    lead: el.querySelector<HTMLElement>(".sp-lead"),
    tag: el.querySelector<HTMLElement>(".sp-tagbox"),
    w: 0,
    h: 0,
    x: 0,
    y: 0,
    pick: null,
    side: 0,
    over: false,
  }));
  const samples: (Float32Array | null)[] = forms.map(() => null);
  let grid = new Uint8Array(0);
  let cols = 0;
  let rows = 0;
  let block: Rect | null = null;
  let current = -1;
  let last = 0;

  /** Refaz as medidas que dependem da janela: tamanho das etiquetas e a
      caixa da coluna de texto. */
  const measure = () => {
    slots.forEach((s) => {
      s.w = 0;
      s.h = 0;
      s.pick = null;
    });
    if (!panel) return;
    const a = stage.getBoundingClientRect();
    const b = panel.getBoundingClientRect();
    block = b.width
      ? {
          x0: b.left - a.left - PAD.panel,
          y0: b.top - a.top - PAD.panel,
          x1: b.right - a.left + PAD.panel,
          y1: b.bottom - a.top + PAD.panel,
        }
      : null;
  };

  const occupied = (r: Rect) => {
    let n = 0;
    const c0 = Math.max(0, Math.floor(r.x0 / CELL));
    const c1 = Math.min(cols - 1, Math.floor(r.x1 / CELL));
    const r0 = Math.max(0, Math.floor(r.y0 / CELL));
    const r1 = Math.min(rows - 1, Math.floor(r.y1 / CELL));
    for (let y = r0; y <= r1; y++)
      for (let x = c0; x <= c1; x++) n += grid[y * cols + x];
    return n;
  };

  const hits = (a: Rect, b: Rect, pad = 0) =>
    a.x0 < b.x1 + pad && a.x1 + pad > b.x0 && a.y0 < b.y1 + pad && a.y1 + pad > b.y0;

  /** Posiciona as etiquetas da forma `i` neste quadro. */
  const place = (i: number, u: ScanUniforms, time: number) => {
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const now = performance.now();
    /* Amortecimento independente da taxa de quadros; ao trocar de forma a
       etiqueta nasce já no lugar. */
    const fresh = i !== current;
    const ease = fresh ? 1 : 1 - Math.exp(-(now - last) / 110);
    current = i;
    last = now;

    /* O mapa do desenho. */
    const nc = Math.ceil(W / CELL);
    const nr = Math.ceil(H / CELL);
    if (nc !== cols || nr !== rows) {
      cols = nc;
      rows = nr;
      grid = new Uint8Array(cols * rows);
    } else grid.fill(0);
    const pts = (samples[i] ??= forms[i].points(SAMPLES).pos);
    const p: [number, number, number] = [0, 0, 0];
    for (let k = 0; k < pts.length; k += 3) {
      p[0] = pts[k];
      p[1] = pts[k + 1];
      p[2] = pts[k + 2];
      const [x, y] = project(p, u, time);
      const cx = Math.floor((W / 2 + x) / CELL);
      const cy = Math.floor((H / 2 + y) / CELL);
      /* Uma célula de folga em volta de cada ponto: o grão tem tamanho e a
         amostra é mais rala que a nuvem. */
      for (let oy = -1; oy <= 1; oy++) {
        const ry = cy + oy;
        if (ry < 0 || ry >= rows) continue;
        for (let ox = -1; ox <= 1; ox++) {
          const rx = cx + ox;
          if (rx >= 0 && rx < cols) grid[ry * cols + rx] = 1;
        }
      }
    }

    const anchors = forms[i].anchors;
    const placed: Rect[] = [];

    for (let k = 0; k < anchors.length; k++) {
      const el = calls[i * 3 + k];
      const s = slots[i * 3 + k];
      if (!el || !s?.tag || !s.lead) continue;
      const [x, y, depth] = project(anchors[k].at, u, time);
      const ax = W / 2 + x;
      const ay = H / 2 + y;
      el.style.transform = `translate3d(${ax}px, ${ay}px, 0)`;
      el.style.setProperty("--depth", String(Math.min(1, Math.max(0.45, depth))));

      if (!s.w) {
        s.w = s.tag.offsetWidth;
        s.h = s.tag.offsetHeight;
      }

      const rectOf = (c: Candidate): Rect => {
        const side = anchors[k].side * (c.flip ? -1 : 1);
        const x0 = side > 0 ? ax + c.dx : ax - c.dx - s.w;
        const y0 = ay + c.dy - LINE;
        return { x0, y0, x1: x0 + s.w, y1: y0 + s.h };
      };
      const fits = (r: Rect) =>
        r.x0 >= EDGE.side &&
        r.x1 <= W - EDGE.side &&
        r.y0 >= EDGE.top &&
        r.y1 <= H - EDGE.bottom &&
        !(block && hits(r, block)) &&
        !placed.some((o) => hits(r, o, PAD.label));

      let pick: Candidate | null = null;
      let over = 0;
      /* Fica onde está enquanto ali continuar livre. */
      if (!fresh && s.pick) {
        const r = rectOf(s.pick);
        if (fits(r) && occupied(r) === 0) pick = s.pick;
      }
      if (!pick) {
        let best: Candidate | null = null;
        let bestOver = Infinity;
        for (const c of CANDIDATES) {
          const r = rectOf(c);
          if (!fits(r)) continue;
          const n = occupied(r);
          if (n === 0) {
            best = c;
            bestOver = 0;
            break;
          }
          /* Sem lugar livre: o que menos cobre o desenho, com o custo de
             desempate. */
          if (n + c.cost / 100 < bestOver) {
            best = c;
            bestOver = n + c.cost / 100;
          }
        }
        pick = best ?? CANDIDATES[0];
        over = bestOver === 0 ? 0 : 1;
      }
      s.pick = pick;

      const r = rectOf(pick);
      placed.push(r);
      const side = anchors[k].side * (pick.flip ? -1 : 1);
      const tx = r.x0 - ax;
      const ty = r.y0 - ay;
      s.x += (tx - s.x) * ease;
      s.y += (ty - s.y) * ease;
      s.tag.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
      if (side !== s.side) {
        s.side = side;
        s.tag.style.textAlign = side > 0 ? "left" : "right";
      }
      const isOver = over > 0;
      if (isOver !== s.over) {
        s.over = isOver;
        s.tag.classList.toggle("is-over", isOver);
      }

      /* O filete: da borda do anel até o meio da primeira linha do texto. */
      const ex = side > 0 ? s.x - GAP : s.x + s.w + GAP;
      const ey = s.y + LINE;
      const len = Math.max(0, Math.hypot(ex, ey) - RING);
      const ang = Math.atan2(ey, ex);
      s.lead.style.width = `${len}px`;
      s.lead.style.transform = `rotate(${ang}rad) translateX(${RING}px)`;
    }
  };

  return { place, measure };
}
