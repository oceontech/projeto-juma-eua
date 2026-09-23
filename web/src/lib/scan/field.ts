/**
 * O campo da LP C — uma nuvem que **é** a fotografia.
 *
 * A diferença técnica para a cena da LP B é toda aqui: lá os pontos eram
 * sorteados da foto e carregavam uma cor copiada; aqui eles são uma grade
 * regular sobre a imagem e leem a cor **da textura, no vertex shader**. Em
 * repouso, cada ponto ocupa a própria célula e o conjunto reconstrói a foto;
 * quando eles saem do lugar, é a fotografia que se desmancha, não um retrato
 * dela. É o que a referência pede: a imagem se fragmenta a partir de si mesma.
 *
 * Daí também o resto do desenho: um instrumento gira uma amostra. A nuvem tem
 * z de verdade, oscila devagar em torno do eixo vertical e é projetada em
 * perspectiva; as etiquetas das chamadas são posicionadas fora, no DOM, pela
 * mesma conta — ver `project()`.
 */

export type ScanData = {
  count: number;
  /** n×2 — a posição de cada ponto na imagem, 0–1, com v=0 no topo. */
  uv: Float32Array;
  /** n×2 — sorteio e variação de tamanho. */
  seed: Float32Array;
  /** As quatro leituras, n×3 cada, num cubo de lado 1. */
  forms: [Float32Array, Float32Array, Float32Array, Float32Array];
  /** n×4 — o destaque de cada ponto em cada leitura: 0 tinta, 1 e 2 as cores
      de destaque. A LP C não usa (tudo 0); a LP B pinta o nitrogênio e a
      ligação que precisa ser aberta. */
  tags: Float32Array;
  /** n — 0 fundo, 1 primeiro plano da foto (ponto maior e mais macio). */
  depth: Float32Array;
};

/** Uma leitura: a posição de cada ponto e o destaque dele. */
export type Cloud = { pos: Float32Array; tag: Float32Array };

export type ScanUniforms = {
  /** 0 = a foto; 1 a 4 = as leituras. */
  phase: number;
  opacity: number;
  /** 0 = cor da foto; 1 = a grafia do instrumento. */
  tone: number;
  zoom: number;
  /** Ponto em torno do qual a foto aproxima, em px a partir do centro dela,
      com y para cima. 0,0 é o centro. */
  focus: [number, number];
  stagger: number;
  /** 0 = a foto se desfaz no acaso; 1 = de cima para baixo, como uma varredura. */
  sweep: number;
  scatter: number;
  /** Tamanho do ponto em repouso (a célula) e nas leituras, em px. */
  cell: number;
  dot: number;
  /** Fração das partículas que fica e forma a amostra. O resto se dissipa. */
  keep: number;
  /** Quanto as dissipadas se afastam, em px. */
  drift: number;
  spin: number;
  focal: number;
  cover: [number, number];
  coverOffset: [number, number];
  shapeScale: number;
  shapeOffset: [number, number];
  inkLow: [number, number, number];
  ink: [number, number, number];
  /** As duas cores de destaque, e quanto delas aparece (0 desliga). */
  accent: [number, number, number];
  accent2: [number, number, number];
  mark: number;
  /** 1 = em repouso o ponto é um quadrado cheio, e a grade fecha a foto sem
      vão. Sobre papel claro o vão aparece e a foto sai lavada; sobre o fundo
      escuro da LP C ele some, e ela fica com o ponto redondo (0). */
  square: number;
  /** 1 = o princípio das trocas da primeira versão da LP B. Em repouso cada
      ponto é um ponto de pontilhado (não uma célula), maior e macio no
      primeiro plano (`ScanData.depth`), e respira; em **toda** troca o
      empurrão vem de um ruído de gradiente, em correntes, mais um sopro para
      fora do centro; a primeira troca parte no sorteio, como as outras. Com o
      pareamento sorteado entre as formas, a nuvem se solta pela tela inteira
      e a forma seguinte **se adensa por igual**, em vez de se montar de um
      lado para o outro. 0 = o comportamento da LP C. */
  flow: number;
};

export type Scan = {
  resize(cssW: number, cssH: number, dpr: number): void;
  render(u: ScanUniforms, time: number): void;
  dispose(): void;
};

/**
 * A mesma conta do shader, em JS, para uma posição do desenho. É o que
 * permite pendurar uma etiqueta de HUD num átomo e ela acompanhar o giro.
 * Devolve px a partir do centro da tela, com **y para baixo** — que é como o
 * CSS quer.
 */
export function project(
  at: [number, number, number],
  u: ScanUniforms,
  time: number,
): [x: number, y: number, depth: number] {
  const yaw = Math.sin(time * u.spin) * 0.42;
  const pitch = Math.sin(time * u.spin * 0.63) * 0.13;
  const x0 = at[0] * u.shapeScale;
  const y0 = at[1] * u.shapeScale;
  const z0 = at[2] * u.shapeScale;
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  let x = x0 * cy + z0 * sy;
  let z = -x0 * sy + z0 * cy;
  const cx = Math.cos(pitch);
  const sx = Math.sin(pitch);
  let y = y0 * cx - z * sx;
  z = y0 * sx + z * cx;
  const persp = u.focal / Math.max(u.focal - z, 1);
  x = x * persp + u.shapeOffset[0];
  y = y * persp + u.shapeOffset[1];
  return [x, -y, persp];
}

const VERT = `#version 300 es
precision highp float;

in vec2 aUv;
in vec2 aSeed;
in float aDepth;
in vec3 aF0;
in vec3 aF1;
in vec3 aF2;
in vec3 aF3;
in vec4 aTags;

uniform sampler2D uPhoto;
uniform vec2 uRes;
uniform vec2 uCover;
uniform vec2 uCoverOffset;
uniform vec2 uShapeOffset;
uniform vec3 uInk;
uniform vec3 uInkLow;
uniform vec3 uAccent;
uniform vec3 uAccent2;
uniform vec2 uFocus;
uniform float uMark;
uniform float uFlow;
uniform float uSquare;
uniform float uShapeScale;
uniform float uPhase;
uniform float uOpacity;
uniform float uTone;
uniform float uZoom;
uniform float uStagger;
uniform float uSweep;
uniform float uScatter;
uniform float uCell;
uniform float uDot;
uniform float uKeep;
uniform float uDrift;
uniform float uSpin;
uniform float uFocal;
uniform float uTime;
uniform float uDpr;

out vec3 vColor;
out float vAlpha;
out float vShaped;
out float vSoft;

const float PI = 3.14159265;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

/* Hash sem seno (Dave Hoskins), para o ruido de gradiente abaixo. */
vec3 hash33(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx) * 2.0 - 1.0;
}

/* Ruido de gradiente: vizinhos andam juntos, que e o que faz a nuvem parecer
   um organismo e nao pipoca. */
float gnoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float n = 0.0;
  for (int z = 0; z < 2; z++) {
    for (int y = 0; y < 2; y++) {
      for (int x = 0; x < 2; x++) {
        vec3 o = vec3(float(x), float(y), float(z));
        float w = mix(1.0 - u.x, u.x, o.x) * mix(1.0 - u.y, u.y, o.y) * mix(1.0 - u.z, u.z, o.z);
        n += w * dot(hash33(i + o), f - o);
      }
    }
  }
  return n * 1.7;
}

/* Duas amostras do mesmo campo em dominios afastados: um vetor que gira. */
vec2 flow2(vec2 p, float t) {
  return vec2(gnoise(vec3(p, t)), gnoise(vec3(p + 41.7, t + 13.4)));
}

/* A cor de um ponto numa leitura: a tinta, ou uma das duas de destaque. */
vec3 tint(vec3 ink, float tag) {
  vec3 c = mix(ink, uAccent, step(0.5, tag) * uMark);
  return mix(c, uAccent2, step(1.5, tag) * uMark);
}

/* Progresso da particula numa perna. Cada uma parte num instante diferente;
   na LP C, na primeira perna o atraso vem de onde ela esta na imagem, para a
   foto se desfazer de cima para baixo como a passagem de um feixe. Com o
   fluxo (LP B), parte no sorteio, como nas outras trocas. */
float leg(float base, float key) {
  return clamp((uPhase - base - key * uStagger) / max(1.0 - uStagger, 0.001), 0.0, 1.0);
}

float ease(float t) {
  return t * t * (3.0 - 2.0 * t);
}

void main() {
  float seed = aSeed.x;

  float t0 = leg(0.0, mix(mix(seed, aUv.y, uSweep), seed, uFlow));
  float t1 = leg(1.0, seed);
  float t2 = leg(2.0, seed);
  float t3 = leg(3.0, seed);
  float shaped = ease(t0);

  /* A foto, ponto por ponto. O zoom e em torno do foco - o centro dela, a
     menos que a cena peca outro ponto. */
  vec2 photo = vec2((aUv.x - 0.5) * uCover.x, (0.5 - aUv.y) * uCover.y);
  photo = (photo - uFocus) * uZoom + uFocus;

  /* Com o fluxo, o pontilhado respira: nunca parado de todo, e o primeiro
     plano vaga mais. Dominio estavel por ponto - lido na posicao ja
     deslocada, o ruido realimentaria o proprio desvio. */
  vec2 q = aUv * vec2(5.0, 3.0) + seed * 7.0;
  photo += flow2(q, uTime * 0.06) * 4.0 * (0.55 + aDepth * 0.9) * uFlow;

  vec3 local = mix(vec3(photo, 0.0), aF0 * uShapeScale, shaped);
  local = mix(local, aF1 * uShapeScale, ease(t1));
  local = mix(local, aF2 * uShapeScale, ease(t2));
  local = mix(local, aF3 * uShapeScale, ease(t3));
  vec2 center = mix(uCoverOffset, uShapeOffset, shaped);

  /* A explosao de cada troca: sobe e volta, e leva a particula para fora do
     plano tambem - e o que da miolo a fragmentacao. */
  float a1 = hash(aUv + 3.1) * 6.2831;
  float a2 = hash(aUv + 7.7) * 3.1416;
  vec3 dir = vec3(cos(a1) * sin(a2), sin(a1) * sin(a2), cos(a2));
  float burst = sin(PI * t0) + sin(PI * t1) + sin(PI * t2) + sin(PI * t3);
  /* Com o fluxo, o empurrao de toda troca vem do ruido de gradiente - a
     nuvem se solta em correntes, vizinhos juntos, em vez de estourar em
     direcoes sorteadas - mais um sopro para fora do centro, para ela se
     abrir antes de se reorganizar em vez de escorregar de A para B. */
  vec3 stream = vec3(flow2(q * 0.35, uTime * 0.03 + 9.0), gnoise(vec3(q * 0.35, 4.2)));
  vec3 outward = normalize(local + vec3(0.0001)) * 0.3;
  local += mix(dir * burst * uScatter, (stream + outward) * burst * uScatter, uFlow);

  /* E a forma pronta tambem respira, de leve: nunca parada de todo. */
  local.xy += flow2(q * 0.8, uTime * 0.06 + 3.0) * 2.5 * shaped * uFlow;

  /* Nem toda particula vira amostra na LP C: a foto dela precisa de duzentos
     mil pontos para fechar, e uma molecula, de vinte mil. O resto se dissipa
     para fora e apaga. Na LP B o pontilhado ja tem a contagem da molecula e
     todos ficam (uKeep = 1). */
  float keeper = step(seed, uKeep);
  local += dir * (1.0 - keeper) * shaped * uDrift * (1.0 - uFlow);

  /* A amostra oscila em torno do eixo vertical, devagar - um instrumento
     mostrando a peca, nao um carrossel. So depois que a foto virou nuvem. */
  float yaw = sin(uTime * uSpin) * 0.42 * shaped;
  float pitch = sin(uTime * uSpin * 0.63) * 0.13 * shaped;
  float cy = cos(yaw);
  float sy = sin(yaw);
  vec3 r = vec3(local.x * cy + local.z * sy, local.y, -local.x * sy + local.z * cy);
  float cx = cos(pitch);
  float sx = sin(pitch);
  r = vec3(r.x, r.y * cx - r.z * sx, r.y * sx + r.z * cx);

  float persp = uFocal / max(uFocal - r.z, 1.0);
  vec2 p = r.xy * persp + center;

  gl_Position = vec4(p / (uRes * 0.5), 0.0, 1.0);

  /* O ponto de destaque e um pouco maior: e ele que o olho tem de achar. */
  float marked = step(0.5, mix(mix(mix(aTags.x, aTags.y, ease(t1)), aTags.z, ease(t2)), aTags.w, ease(t3))) * uMark;
  /* Em repouso: na LP C o ponto tem o tamanho da celula, e a grade fecha a
     imagem (quadrado, com uSquare, crescendo junto com o zoom). Com o fluxo
     e um ponto de pontilhado, maior e mais macio no primeiro plano - a
     profundidade de campo da foto. */
  float cellRest = uCell * mix(1.0, uZoom, uSquare);
  float dotRest = uDot * 1.15 * (1.0 + aDepth * 1.6) * uZoom;
  float rest = mix(cellRest, dotRest, uFlow);
  float px = mix(rest, uDot * (0.7 + 0.6 * aSeed.y) * (1.0 + 0.25 * marked), shaped);
  gl_PointSize = px * uDpr * persp;

  /* textureLod, e nao texture: no vertex shader nao ha derivada para o
     nivel ser escolhido sozinho. */
  vec3 photoColor = textureLod(uPhoto, aUv, 0.0).rgb;
  float lum = dot(photoColor, vec3(0.299, 0.587, 0.114));
  vec3 scanned = mix(uInkLow, uInk, smoothstep(0.08, 0.72, lum + (seed - 0.5) * 0.28));
  /* A cor troca junto com a forma, perna a perna, como a posicao. */
  vec3 inked = tint(scanned, aTags.x);
  inked = mix(inked, tint(scanned, aTags.y), ease(t1));
  inked = mix(inked, tint(scanned, aTags.z), ease(t2));
  inked = mix(inked, tint(scanned, aTags.w), ease(t3));
  /* uTone leva a foto inteira para a tinta; com o fluxo, quem ja partiu
     tambem vai, no proprio ritmo. */
  float toneP = max(uTone, shaped * uFlow);
  vColor = mix(photoColor, mix(scanned, inked, shaped), toneP);

  /* Longe escurece: e o que separa a frente do fundo numa nuvem de um tom so. */
  float near = clamp((persp - 0.8) / 0.4, 0.0, 1.0);
  vShaped = shaped;
  vSoft = aDepth * (1.0 - shaped) * uFlow;
  /* O primeiro plano e grande e translucido: opaco, os discos se sobrepoem
     e a folha vira espuma em vez de desfoque. */
  float kept = mix(mix(1.0, 0.6, aDepth * uFlow), mix(0.34, 1.0, near) * mix(0.55 + 0.45 * seed, 1.0, marked), shaped);
  vAlpha = uOpacity * mix(1.0 - shaped, kept, keeper);
}
`;

const FRAG = `#version 300 es
precision mediump float;

in vec3 vColor;
in float vAlpha;
in float vShaped;
in float vSoft;

/* highp: o vertex shader tambem le este uniform, e a precisao tem de ser a mesma. */
uniform highp float uSquare;

out vec4 frag;

void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  /* A borda amacia com vSoft: o primeiro plano da foto e desfocado. */
  float round = 1.0 - smoothstep(mix(0.45, 0.0, vSoft), 1.0, d);
  float a = mix(round, 1.0, uSquare * (1.0 - vShaped)) * vAlpha;
  if (a < 0.004) discard;
  /* Pre-multiplicado: a mistura e ONE / ONE_MINUS_SRC_ALPHA, que compoe sem
     estourar o branco onde os pontos se encostam. */
  frag = vec4(vColor * a, a);
}
`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (process.env.NODE_ENV !== "production")
      console.error("scan:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function createScan(
  canvas: HTMLCanvasElement,
  /* Imagem ou canvas: a LP B compõe as duas camadas do hero num canvas antes. */
  photo: TexImageSource,
  data: ScanData,
): Scan | null {
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: "high-performance",
  });
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    if (process.env.NODE_ENV !== "production")
      console.error("scan:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buffers: WebGLBuffer[] = [];
  const attribute = (name: string, src: Float32Array, size: number) => {
    const buffer = gl.createBuffer();
    buffers.push(buffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, src, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, name);
    if (loc >= 0) {
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    }
  };
  attribute("aUv", data.uv, 2);
  attribute("aSeed", data.seed, 2);
  data.forms.forEach((form, i) => attribute(`aF${i}`, form, 3));
  attribute("aTags", data.tags, 4);
  attribute("aDepth", data.depth, 1);
  gl.bindVertexArray(null);

  /* A textura da foto, **sem** flip vertical. Com o flip, `v = 0` passa a ser
     a base da imagem; sem ele é a primeira linha, o topo — que é o que o
     shader assume ao mapear `v` para a tela e o que a varredura de cima para
     baixo precisa. */
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, photo);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const u = (name: string) => gl.getUniformLocation(program, name);
  const loc = {
    photo: u("uPhoto"),
    res: u("uRes"),
    cover: u("uCover"),
    coverOffset: u("uCoverOffset"),
    shapeOffset: u("uShapeOffset"),
    ink: u("uInk"),
    inkLow: u("uInkLow"),
    accent: u("uAccent"),
    accent2: u("uAccent2"),
    focus: u("uFocus"),
    mark: u("uMark"),
    square: u("uSquare"),
    flow: u("uFlow"),
    shapeScale: u("uShapeScale"),
    phase: u("uPhase"),
    opacity: u("uOpacity"),
    tone: u("uTone"),
    zoom: u("uZoom"),
    stagger: u("uStagger"),
    sweep: u("uSweep"),
    scatter: u("uScatter"),
    cell: u("uCell"),
    dot: u("uDot"),
    keep: u("uKeep"),
    drift: u("uDrift"),
    spin: u("uSpin"),
    focal: u("uFocal"),
    time: u("uTime"),
    dpr: u("uDpr"),
  };

  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  let res: [number, number] = [1, 1];
  let dpr = 1;
  let dead = false;

  return {
    resize(cssW, cssH, ratio) {
      if (dead) return;
      dpr = ratio;
      res = [cssW, cssH];
      canvas.width = Math.round(cssW * ratio);
      canvas.height = Math.round(cssH * ratio);
      gl.viewport(0, 0, canvas.width, canvas.height);
    },

    render(uni, time) {
      if (dead) return;
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(loc.photo, 0);
      gl.uniform2f(loc.res, res[0], res[1]);
      gl.uniform2f(loc.cover, uni.cover[0], uni.cover[1]);
      gl.uniform2f(loc.coverOffset, uni.coverOffset[0], uni.coverOffset[1]);
      gl.uniform2f(loc.shapeOffset, uni.shapeOffset[0], uni.shapeOffset[1]);
      gl.uniform3f(loc.ink, uni.ink[0], uni.ink[1], uni.ink[2]);
      gl.uniform3f(loc.inkLow, uni.inkLow[0], uni.inkLow[1], uni.inkLow[2]);
      gl.uniform3f(loc.accent, uni.accent[0], uni.accent[1], uni.accent[2]);
      gl.uniform3f(loc.accent2, uni.accent2[0], uni.accent2[1], uni.accent2[2]);
      gl.uniform2f(loc.focus, uni.focus[0], uni.focus[1]);
      gl.uniform1f(loc.mark, uni.mark);
      gl.uniform1f(loc.square, uni.square);
      gl.uniform1f(loc.flow, uni.flow);
      gl.uniform1f(loc.shapeScale, uni.shapeScale);
      gl.uniform1f(loc.phase, uni.phase);
      gl.uniform1f(loc.opacity, uni.opacity);
      gl.uniform1f(loc.tone, uni.tone);
      gl.uniform1f(loc.zoom, uni.zoom);
      gl.uniform1f(loc.stagger, uni.stagger);
      gl.uniform1f(loc.sweep, uni.sweep);
      gl.uniform1f(loc.scatter, uni.scatter);
      gl.uniform1f(loc.cell, uni.cell);
      gl.uniform1f(loc.dot, uni.dot);
      gl.uniform1f(loc.keep, uni.keep);
      gl.uniform1f(loc.drift, uni.drift);
      gl.uniform1f(loc.spin, uni.spin);
      gl.uniform1f(loc.focal, uni.focal);
      gl.uniform1f(loc.time, time);
      gl.uniform1f(loc.dpr, dpr);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, data.count);
      gl.bindVertexArray(null);
    },

    dispose() {
      if (dead) return;
      dead = true;
      buffers.forEach((b) => gl.deleteBuffer(b));
      gl.deleteVertexArray(vao);
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

/** Monta a grade sobre a imagem e as quatro leituras com a mesma contagem. */
export function buildScan(
  cols: number,
  rows: number,
  forms: ((n: number) => Cloud)[],
): ScanData {
  const count = cols * rows;
  const uv = new Float32Array(count * 2);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      /* Um empurrãozinho dentro da célula: grade perfeita vira moiré. */
      uv[i * 2] = (x + 0.5 + (Math.random() - 0.5) * 0.7) / cols;
      uv[i * 2 + 1] = (y + 0.5 + (Math.random() - 0.5) * 0.7) / rows;
    }
  }
  return assemble(uv, new Float32Array(count), forms);
}

/** O mesmo, a partir de pontos já sorteados sobre a foto — o pontilhado da
    LP B (ver `stipple.ts`). */
export function buildFromPoints(
  uv: Float32Array,
  depth: Float32Array,
  forms: ((n: number) => Cloud)[],
): ScanData {
  return assemble(uv, depth, forms);
}

function assemble(
  uv: Float32Array,
  depth: Float32Array,
  forms: ((n: number) => Cloud)[],
): ScanData {
  const count = uv.length / 2;
  const seed = new Float32Array(count * 2);
  for (let i = 0; i < count * 2; i++) seed[i] = Math.random();
  const clouds = forms.slice(0, 4).map((form) => form(count));
  /* Os destaques das quatro leituras entrelaçados num vec4 por ponto: um
     atributo só, em vez de quatro. */
  const tags = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    for (let k = 0; k < 4; k++) tags[i * 4 + k] = clouds[k].tag[i];
  }
  return {
    count,
    uv,
    seed,
    forms: clouds.map((c) => c.pos) as ScanData["forms"],
    tags,
    depth,
  };
}
