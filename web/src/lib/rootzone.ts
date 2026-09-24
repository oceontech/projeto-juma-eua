/**
 * A cena do subsolo da seção K7: um sistema radicular, o potássio parado no
 * solo, a água que o leva até a raiz e o gargalo quando a demanda sobe e o
 * perfil seca. Canvas 2D, sem biblioteca.
 *
 * O scroll só entrega um número, `progress` (0 → 1). Cada fase da história é
 * uma função suave desse número (`phases`), e a simulação corre no relógio
 * com os parâmetros da fase: rolar para trás não desfaz partícula nenhuma, só
 * muda as regras com que elas andam. Por isso não há estado a reverter.
 *
 * Tudo que se desenha uma vez só (solo, raiz, camada compactada, rachaduras)
 * vai para canvases fora da tela no `resize`; o quadro só compõe e move pontos.
 */

export type ZoneState = {
  /* 0 → 1: o que a lavoura pede e o que chega à raiz, na mesma escala. */
  demand: number;
  delivered: number;
  dry: number;
  flow: number;
};

type RootNode = { x: number; y: number; parent: number; w: number; order: number };
type Ion = {
  x: number;
  y: number;
  /* -1 no solo; senão, o nó da raiz para onde está subindo. */
  node: number;
  fade: number;
  speed: number;
};
type Streak = { x: number; y: number; px: number; py: number; life: number };

/* Fronteiras das seis etapas no `progress`. O componente usa as mesmas. */
export const STEPS = [0, 0.14, 0.31, 0.48, 0.65, 0.83, 1];

/* A camada compactada, em fração da altura. O componente põe o rótulo aqui. */
export const BAND = { top: 0.56, bottom: 0.63 };

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function phases(p: number) {
  const flow = smooth(0.14, 0.24, p);
  const absorb = smooth(0.29, 0.36, p);
  const demandUp = smooth(0.48, 0.6, p);
  const dry = smooth(0.65, 0.78, p);
  const final = smooth(0.84, 0.94, p);
  /* A entrega segue as mesmas regras que movem os pontos: sobe um pouco
     quando a raiz puxa mais, cai quando a água anda devagar. */
  const delivered = absorb * flow * (0.46 + 0.22 * demandUp) * (1 - 0.6 * dry);
  const demand = 0.18 + 0.26 * absorb + 0.5 * demandUp;
  return { flow, absorb, demandUp, dry, final, delivered, demand };
}

/* Semente fixa: a mesma raiz em toda visita e em todo tamanho de tela. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const C = {
  soilTop: "#3A3526",
  soilMid: "#2A2A1E",
  soilDeep: "#1C1D15",
  grain: "rgba(238,235,224,",
  root: "#E4DCC4",
  rootEdge: "rgba(22,38,27,0.55)",
  ion: [183, 199, 62] as const,
  water: "rgba(196,221,214,",
  dry: "#8C7A55",
  red: "#CB351B",
};

export function createRootZone(canvas: HTMLCanvasElement, onFrame?: (s: ZoneState) => void) {
  const ctx = canvas.getContext("2d")!;
  let w = 0;
  let h = 0;
  let dpr = 1;
  let unit = 1; // escala: 1 num quadro de 1000px de largura
  let surface = 0;
  let band = { top: 0, bottom: 0 };

  let nodes: RootNode[] = [];
  let ions: Ion[] = [];
  let streaks: Streak[] = [];
  let flashes: number[] = [];

  /* O campo: em cada célula, a direção e a distância até a raiz mais perto. */
  const CELL = 10;
  let cols = 0;
  let rows = 0;
  let fieldX = new Float32Array(0);
  let fieldY = new Float32Array(0);
  let fieldD = new Float32Array(0);

  let soilLayer: HTMLCanvasElement | null = null;
  let dryLayer: HTMLCanvasElement | null = null;
  let bandLayer: HTMLCanvasElement | null = null;
  let rootLayer: HTMLCanvasElement | null = null;
  let glowLayer: HTMLCanvasElement | null = null;

  let target = 0;
  let progress = 0;
  let raf = 0;
  let last = 0;
  let time = 0;
  let running = false;
  const rand = rng(7);

  const layer = () => {
    const c = document.createElement("canvas");
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
    const g = c.getContext("2d")!;
    g.scale(dpr, dpr);
    return [c, g] as const;
  };

  function growRoots() {
    const r = rng(11);
    nodes = [];
    const crown = { x: w * 0.5, y: surface + 4 * unit };
    nodes.push({ ...crown, parent: -1, w: 9 * unit, order: 0 });
    const step = 9 * unit;
    const margin = 26 * unit;

    const grow = (from: number, angle: number, length: number, width: number, order: number) => {
      let a = angle;
      let idx = from;
      const n = Math.max(2, Math.round(length / step));
      /* Quanto mais fina a raiz, menos ela obedece à gravidade. */
      const pull = order === 0 ? 0.18 : order === 1 ? 0.035 : 0.02;
      let nextBranch = order === 0 ? 3 : 2 + Math.floor(r() * 3);
      let side = r() < 0.5 ? 1 : -1;
      for (let k = 1; k <= n; k++) {
        a += (r() - 0.5) * (order === 0 ? 0.22 : 0.34) + (Math.PI / 2 - a) * pull;
        const prev = nodes[idx];
        let x = prev.x + Math.cos(a) * step;
        let y = prev.y + Math.sin(a) * step;
        if (x < margin || x > w - margin) {
          a = Math.PI - a;
          x = Math.min(w - margin, Math.max(margin, x));
        }
        if (y > h - margin) break;
        y = Math.max(surface + 6 * unit, y);
        const taper = 1 - k / (n + 1);
        nodes.push({ x, y, parent: idx, w: Math.max(0.9 * unit, width * (0.35 + 0.65 * taper)), order });
        idx = nodes.length - 1;

        if (order < 2 && k === nextBranch && k < n - 2) {
          const left = n - k;
          if (order === 0) {
            /* Laterais: longas no alto, mais curtas no fundo. */
            const depth = (y - surface) / (h - surface);
            const len = w * (0.42 - 0.3 * depth) * (0.75 + 0.5 * r());
            grow(idx, side > 0 ? 0.12 + r() * 0.5 : Math.PI - 0.12 - r() * 0.5, len, width * 0.5, 1);
            nextBranch = k + 2 + Math.floor(r() * 2);
          } else {
            const len = Math.min(left * step, (26 + r() * 50) * unit);
            grow(idx, a + side * (0.8 + r() * 0.6), len, width * 0.45, 2);
            nextBranch = k + 2 + Math.floor(r() * 3);
          }
          side = -side;
        }
      }
    };
    grow(0, Math.PI / 2, (h - surface) * 0.86, 8 * unit, 0);
  }

  function buildField() {
    cols = Math.ceil(w / CELL);
    rows = Math.ceil(h / CELL);
    fieldX = new Float32Array(cols * rows);
    fieldY = new Float32Array(cols * rows);
    fieldD = new Float32Array(cols * rows);
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const x = (i + 0.5) * CELL;
        const y = (j + 0.5) * CELL;
        let best = Infinity;
        let bx = 0;
        let by = 0;
        for (const n of nodes) {
          const dx = n.x - x;
          const dy = n.y - y;
          const d = dx * dx + dy * dy;
          if (d < best) {
            best = d;
            bx = dx;
            by = dy;
          }
        }
        const d = Math.sqrt(best) || 1;
        const k = j * cols + i;
        fieldX[k] = bx / d;
        fieldY[k] = by / d;
        fieldD[k] = d;
      }
    }
  }

  const sample = (x: number, y: number) => {
    const i = Math.min(cols - 1, Math.max(0, Math.floor(x / CELL)));
    const j = Math.min(rows - 1, Math.max(0, Math.floor(y / CELL)));
    return j * cols + i;
  };

  /* O no-mais-perto de verdade, só para a hora da absorção. */
  function nearestNode(x: number, y: number) {
    let best = Infinity;
    let at = 0;
    for (let k = 0; k < nodes.length; k++) {
      const dx = nodes[k].x - x;
      const dy = nodes[k].y - y;
      const d = dx * dx + dy * dy;
      if (d < best) {
        best = d;
        at = k;
      }
    }
    return at;
  }

  function spawn(ion: Ion, initial: boolean) {
    /* O potássio que volta ao solo reaparece longe da raiz: o entorno dela é
       justamente o que se esgota primeiro. */
    for (let tries = 0; tries < 20; tries++) {
      const x = 14 * unit + rand() * (w - 28 * unit);
      const y = surface + 14 * unit + rand() * (h - surface - 24 * unit);
      const d = fieldD[sample(x, y)];
      if (d > (initial ? 10 : 46) * unit) {
        ion.x = x;
        ion.y = y;
        break;
      }
    }
    ion.node = -1;
    ion.fade = initial ? 1 : 0;
    ion.speed = 0.7 + rand() * 0.6;
  }

  function paintSoil() {
    const [c, g] = layer();
    const grad = g.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, C.soilTop);
    grad.addColorStop(0.35, C.soilMid);
    grad.addColorStop(1, C.soilDeep);
    g.fillStyle = grad;
    g.fillRect(0, 0, w, h);
    const r = rng(3);
    /* Grãos e pedriscos: a textura que diz "solo" sem virar foto. */
    const grains = Math.round((w * h) / 90);
    for (let k = 0; k < grains; k++) {
      g.fillStyle = C.grain + (0.02 + r() * 0.06) + ")";
      const s = (0.5 + r() * 1.3) * unit;
      g.fillRect(r() * w, surface + r() * (h - surface), s, s);
    }
    for (let k = 0; k < Math.round(w / 14); k++) {
      g.fillStyle = `rgba(0,0,0,${0.12 + r() * 0.12})`;
      g.beginPath();
      g.ellipse(r() * w, surface + r() * (h - surface), (2 + r() * 5) * unit, (1.5 + r() * 3) * unit, r() * 3, 0, Math.PI * 2);
      g.fill();
    }
    /* A superfície do solo: uma borda irregular, mais clara. */
    g.fillStyle = "#4A4430";
    g.beginPath();
    g.moveTo(0, 0);
    for (let x = 0; x <= w; x += 8) g.lineTo(x, surface + Math.sin(x * 0.03) * 1.5 * unit + (r() - 0.5) * 2.4 * unit);
    g.lineTo(w, 0);
    g.closePath();
    g.fill();
    soilLayer = c;

    const [d, dg] = layer();
    dg.fillStyle = C.dry;
    dg.globalAlpha = 0.36;
    dg.fillRect(0, surface, w, h - surface);
    dg.globalAlpha = 1;
    /* Rachaduras de secagem, só na metade de cima do perfil. */
    dg.strokeStyle = "rgba(20,18,12,0.55)";
    dg.lineCap = "round";
    for (let k = 0; k < Math.round(w / 55); k++) {
      let x = r() * w;
      let y = surface;
      let a = Math.PI / 2 + (r() - 0.5) * 0.6;
      dg.lineWidth = (1.4 + r() * 1.2) * unit;
      dg.beginPath();
      dg.moveTo(x, y);
      const len = (h - surface) * (0.12 + r() * 0.3);
      for (let s = 0; s < len; s += 6 * unit) {
        a += (r() - 0.5) * 0.7;
        x += Math.cos(a) * 6 * unit;
        y += Math.sin(a) * 6 * unit;
        dg.lineTo(x, y);
        dg.lineWidth *= 0.97;
      }
      dg.stroke();
    }
    dryLayer = d;

    const [b, bg] = layer();
    bg.fillStyle = "rgba(20,18,12,0.5)";
    bg.fillRect(0, band.top, w, band.bottom - band.top);
    bg.strokeStyle = "rgba(238,235,224,0.1)";
    bg.lineWidth = unit;
    for (let y = band.top + 4 * unit; y < band.bottom; y += 5 * unit) {
      bg.beginPath();
      for (let x = 0; x <= w; x += 12) bg.lineTo(x, y + Math.sin(x * 0.02 + y) * 1.2 * unit);
      bg.stroke();
    }
    bg.strokeStyle = "rgba(203,53,27,0.55)";
    bg.setLineDash([6 * unit, 6 * unit]);
    bg.beginPath();
    bg.moveTo(0, band.top);
    bg.lineTo(w, band.top);
    bg.moveTo(0, band.bottom);
    bg.lineTo(w, band.bottom);
    bg.stroke();
    bandLayer = b;
  }

  function paintRoots() {
    const draw = (color: string, extra: number) => {
      const [c, g] = layer();
      g.lineCap = "round";
      g.lineJoin = "round";
      g.strokeStyle = color;
      for (const n of nodes) {
        if (n.parent < 0) continue;
        const p = nodes[n.parent];
        g.lineWidth = n.w + extra;
        g.beginPath();
        g.moveTo(p.x, p.y);
        g.lineTo(n.x, n.y);
        g.stroke();
      }
      return c;
    };
    const base = draw(C.rootEdge, 2 * unit);
    const g = base.getContext("2d")!;
    g.drawImage(draw(C.root, 0), 0, 0, w, h);
    rootLayer = base;
    glowLayer = draw("rgba(183,199,62,1)", 3 * unit);
  }

  function resize(width: number, height: number) {
    if (!width || !height) return;
    w = width;
    h = height;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    unit = Math.max(0.8, Math.min(1.4, w / 1000));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    surface = h * 0.07;
    band = { top: h * BAND.top, bottom: h * BAND.bottom };
    growRoots();
    buildField();
    paintSoil();
    paintRoots();
    const count = Math.max(240, Math.min(620, Math.round((w * h) / 1300)));
    ions = Array.from({ length: count }, () => {
      const ion: Ion = { x: 0, y: 0, node: -1, fade: 1, speed: 1 };
      spawn(ion, true);
      return ion;
    });
    streaks = Array.from({ length: Math.round(count * 0.35) }, () => {
      const s: Streak = { x: 0, y: 0, px: 0, py: 0, life: 0 };
      respawnStreak(s);
      s.life = rand() * 3;
      return s;
    });
    flashes = [];
  }

  function respawnStreak(s: Streak) {
    s.x = rand() * w;
    s.y = surface + 10 * unit + rand() * (h - surface - 20 * unit);
    s.px = s.x;
    s.py = s.y;
    s.life = 1.5 + rand() * 2.5;
  }

  /* Quanto a água deixa andar em cada ponto do perfil. */
  function mobility(y: number, dry: number) {
    const inBand = y > band.top && y < band.bottom;
    return (1 - 0.62 * dry) * (inBand ? 1 - 0.82 * dry : 1);
  }

  function velocity(x: number, y: number, ph: ReturnType<typeof phases>) {
    const k = sample(x, y);
    const d = fieldD[k];
    /* A água converge para a raiz e acelera perto dela; a curva vem de um
       ruído barato, para o caminho não ser uma reta. */
    const swirl = 0.55 * Math.sin(x * 0.011 + time * 0.25) * Math.cos(y * 0.013 - time * 0.2);
    const cs = Math.cos(swirl);
    const sn = Math.sin(swirl);
    const dx = fieldX[k] * cs - fieldY[k] * sn;
    const dy = fieldX[k] * sn + fieldY[k] * cs;
    const near = 0.3 + 0.7 * Math.exp(-d / (140 * unit));
    const s = 34 * unit * ph.flow * near * (1 + 0.45 * ph.demandUp) * mobility(y, ph.dry);
    return { vx: dx * s, vy: dy * s, d };
  }

  function step(dt: number) {
    time += dt;
    progress += (target - progress) * Math.min(1, dt * 4);
    const ph = phases(progress);

    for (const ion of ions) {
      ion.fade = Math.min(1, ion.fade + dt * 1.5);
      if (ion.node >= 0) {
        /* Dentro da raiz: sobe de nó em nó até o colo. */
        let move = 170 * unit * dt;
        while (move > 0 && ion.node >= 0) {
          const n = nodes[ion.node];
          const dx = n.x - ion.x;
          const dy = n.y - ion.y;
          const d = Math.hypot(dx, dy);
          if (d <= move) {
            ion.x = n.x;
            ion.y = n.y;
            move -= d;
            ion.node = n.parent;
          } else {
            ion.x += (dx / d) * move;
            ion.y += (dy / d) * move;
            move = 0;
          }
        }
        if (ion.node < 0) {
          if (flashes.length < 6) flashes.push(0);
          spawn(ion, false);
        }
        continue;
      }
      const { vx, vy, d } = velocity(ion.x, ion.y, ph);
      const jitter = 7 * unit * (1 - 0.6 * ph.flow);
      ion.x += (vx * ion.speed + (rand() - 0.5) * jitter * 2) * dt;
      ion.y += (vy * ion.speed + (rand() - 0.5) * jitter * 2) * dt;
      ion.x = Math.min(w - 4, Math.max(4, ion.x));
      ion.y = Math.min(h - 4, Math.max(surface + 6, ion.y));
      if (d < 9 * unit) {
        if (ph.absorb > 0.02 && rand() < ph.absorb * dt * 6) {
          ion.node = nearestNode(ion.x, ion.y);
        } else if (ph.absorb <= 0.02) {
          /* Antes da absorção, quem encosta na raiz fica ali, rente. */
          ion.x -= vx * ion.speed * dt;
          ion.y -= vy * ion.speed * dt;
        }
      }
    }

    for (const s of streaks) {
      s.px = s.x;
      s.py = s.y;
      const { vx, vy, d } = velocity(s.x, s.y, ph);
      s.x += vx * 2.4 * dt;
      s.y += vy * 2.4 * dt;
      s.life -= dt;
      if (s.life <= 0 || d < 6 * unit) respawnStreak(s);
    }

    for (let k = flashes.length - 1; k >= 0; k--) {
      flashes[k] += dt;
      if (flashes[k] > 0.9) flashes.splice(k, 1);
    }
    return ph;
  }

  function draw(ph: ReturnType<typeof phases>) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (soilLayer) ctx.drawImage(soilLayer, 0, 0, w, h);
    if (dryLayer && ph.dry > 0) {
      ctx.globalAlpha = ph.dry;
      ctx.drawImage(dryLayer, 0, 0, w, h);
    }
    if (bandLayer && ph.dry > 0) {
      ctx.globalAlpha = ph.dry;
      ctx.drawImage(bandLayer, 0, 0, w, h);
    }
    ctx.globalAlpha = 1;

    /* Água: riscos curtos, que somem quando o perfil seca. */
    const wa = ph.flow * 0.3 * (1 - 0.55 * ph.dry) * (1 - 0.4 * ph.final);
    if (wa > 0.01) {
      ctx.lineCap = "round";
      ctx.lineWidth = 1.2 * unit;
      ctx.strokeStyle = C.water + wa + ")";
      ctx.beginPath();
      for (const s of streaks) {
        const dx = s.x - s.px;
        const dy = s.y - s.py;
        if (Math.abs(dx) + Math.abs(dy) < 0.05) continue;
        const k = 7;
        ctx.moveTo(s.x - dx * k, s.y - dy * k);
        ctx.lineTo(s.x, s.y);
      }
      ctx.stroke();
    }

    if (rootLayer) ctx.drawImage(rootLayer, 0, 0, w, h);
    /* A raiz acende com o que está entrando, e pulsa quando a demanda sobe. */
    const pulse = 0.5 + 0.5 * Math.sin(time * (3 + 4 * ph.demandUp));
    const glow = ph.absorb * (0.1 + 0.12 * ph.demandUp * pulse) * (1 - 0.5 * ph.dry);
    if (glowLayer && glow > 0.01) {
      ctx.globalAlpha = glow;
      ctx.drawImage(glowLayer, 0, 0, w, h);
      ctx.globalAlpha = 1;
    }

    const [r, g, b] = C.ion;
    for (const ion of ions) {
      const inside = ion.node >= 0;
      const k = sample(ion.x, ion.y);
      /* No fim, o que ficou longe da raiz esmaece: está no solo, não chegou. */
      const far = Math.min(1, fieldD[k] / (120 * unit));
      const a = ion.fade * (inside ? 1 : 0.9 - 0.55 * ph.final * far);
      ctx.fillStyle = inside ? `rgba(226,240,120,${a})` : `rgba(${r},${g},${b},${a})`;
      const size = (inside ? 2.6 : 2.1) * unit;
      ctx.beginPath();
      ctx.arc(ion.x, ion.y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    /* A chegada no colo: um anel que se abre a cada íon entregue. */
    const crown = nodes[0];
    ctx.lineWidth = 1.5 * unit;
    for (const f of flashes) {
      ctx.strokeStyle = `rgba(226,240,120,${0.4 * (1 - f / 0.9)})`;
      ctx.beginPath();
      ctx.arc(crown.x, crown.y, (6 + f * 30) * unit, 0, Math.PI * 2);
      ctx.stroke();
    }

    /* A demanda, puxando para cima a partir do colo. */
    const up = 0.25 * ph.absorb + 0.75 * ph.demandUp;
    if (up > 0.02) {
      ctx.strokeStyle = `rgba(238,235,224,${0.75 * up})`;
      ctx.lineWidth = 2 * unit;
      for (let k = 0; k < 3; k++) {
        const t = (time * (0.6 + ph.demandUp) + k / 3) % 1;
        const y = crown.y - 4 * unit - t * 34 * unit;
        const s = 7 * unit;
        ctx.globalAlpha = Math.sin(t * Math.PI);
        ctx.beginPath();
        ctx.moveTo(crown.x - s, y + s * 0.7);
        ctx.lineTo(crown.x, y);
        ctx.lineTo(crown.x + s, y + s * 0.7);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  }

  function frame(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    const ph = step(dt);
    draw(ph);
    onFrame?.({ demand: ph.demand, delivered: ph.delivered, dry: ph.dry, flow: ph.flow });
    if (running) raf = requestAnimationFrame(frame);
  }

  return {
    resize,
    setProgress(p: number) {
      target = p;
    },
    start() {
      if (running || !w) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    /* Sem movimento: roda a simulação em silêncio e desenha um quadro. */
    still(p: number) {
      target = progress = p;
      for (let k = 0; k < 240; k++) step(1 / 30);
      const ph = phases(p);
      draw(ph);
      onFrame?.({ demand: ph.demand, delivered: ph.delivered, dry: ph.dry, flow: ph.flow });
    },
  };
}
