/**
 * O campo de partículas — um único draw call de `POINTS` em WebGL2.
 *
 * Por que WebGL cru e não three.js: aqui não há cena, câmera, luz nem
 * material. Há uma nuvem de pontos com um shader próprio, que é justamente a
 * parte que o three não escreveria por nós. Trazer a biblioteca inteira para
 * isso custaria uns 150 KB comprimidos numa página cujo hero já são cinco
 * imagens grandes. O contrato é o mesmo — atributo por estado, uniforms
 * uProgress/uSaturation/uTime/uMouse —, só que sem a camada do meio.
 *
 * Toda a geometria vive em pixels CSS com a origem no centro da tela e **y
 * para cima**. O vertex shader converte para clip space no fim; nada aqui
 * precisa de matriz.
 */

/** Uma posição por estado, mais a cor da foto e os dados por partícula. */
export type FieldData = {
  count: number;
  /** n×2 — a foto do hero, normalizada em [-0,5; 0,5]. */
  hero: Float32Array;
  /** n×2 — a planta de soja. */
  plant: Float32Array;
  /** n×2 — a molécula. */
  mol: Float32Array;
  /** n×3 — a cor do pixel de origem, 0–1. */
  color: Float32Array;
  /** n×3 — tamanho base (px), profundidade (0 fundo, 1 primeiro plano), semente (0–1). */
  meta: Float32Array;
};

/** O estado que o scroll, o mouse e o painel de dev escrevem a cada quadro. */
export type Uniforms = {
  /** 0 = foto, 1 = planta, 2 = molécula. */
  phase: number;
  /** 1 = cores da foto, 0 = grafite. */
  saturation: number;
  opacity: number;
  size: number;
  noise: number;
  flow: number;
  burst: number;
  stagger: number;
  push: number;
  mouseRadius: number;
  inkDark: [number, number, number];
  inkLight: [number, number, number];
  heroSize: [number, number];
  heroOffset: [number, number];
  shapeSize: [number, number];
  shapeOffset: [number, number];
  mouse: [number, number];
};

export type Field = {
  resize(cssW: number, cssH: number, dpr: number): void;
  render(u: Uniforms, time: number): void;
  dispose(): void;
};

const VERT = `#version 300 es
precision highp float;

in vec2 aHero;
in vec2 aPlant;
in vec2 aMol;
in vec3 aColor;
in vec3 aMeta;

uniform vec2 uRes;
uniform vec2 uHeroSize;
uniform vec2 uHeroOffset;
uniform vec2 uShapeSize;
uniform vec2 uShapeOffset;
uniform vec3 uMouse;
uniform vec3 uInkDark;
uniform vec3 uInkLight;
uniform float uPhase;
uniform float uSaturation;
uniform float uOpacity;
uniform float uTime;
uniform float uDpr;
uniform float uSize;
uniform float uNoise;
uniform float uFlow;
uniform float uBurst;
uniform float uStagger;
uniform float uPush;

out vec3 vColor;
out float vAlpha;
out float vSoft;

const float PI = 3.14159265;

/* Hash sem seno (Dave Hoskins): o seno custa caro repetido 16 vezes por
   vértice, e aqui são dezenas de milhares de vértices por quadro. */
vec3 hash33(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx) * 2.0 - 1.0;
}

/* Ruído de gradiente: vizinhos andam juntos, que é o que faz a nuvem parecer
   um organismo e não pipoca. */
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

/* Duas amostras do mesmo campo, em domínios afastados: dá um vetor que gira
   sem custar as diferenças finitas de um curl de verdade. */
vec2 flow(vec2 p, float t) {
  return vec2(gnoise(vec3(p, t)), gnoise(vec3(p + 41.7, t + 13.4)));
}

/* Progresso da partícula numa perna do morph. Cada uma parte num instante
   diferente — sem isso o conjunto vira um slide trocando de imagem. */
float leg(float base, float seed) {
  return clamp((uPhase - base - seed * uStagger) / max(1.0 - uStagger, 0.001), 0.0, 1.0);
}

void main() {
  float seed = aMeta.z;
  float t1 = leg(0.0, seed);
  float t2 = leg(1.0, seed);
  float e1 = t1 * t1 * (3.0 - 2.0 * t1);
  float e2 = t2 * t2 * (3.0 - 2.0 * t2);

  vec2 hero = aHero * uHeroSize + uHeroOffset;
  vec2 plant = aPlant * uShapeSize + uShapeOffset;
  vec2 mol = aMol * uShapeSize + uShapeOffset;
  vec2 p = mix(mix(hero, plant, e1), mol, e2);

  /* Domínio estável por partícula: o ruído não pode ser lido na posição já
     deslocada, ou a partícula realimenta o próprio desvio. */
  vec2 q = aHero * 3.0 + seed * 7.0;

  /* Respiração: nunca totalmente paradas, e o primeiro plano vaga mais. */
  p += flow(q, uTime * uFlow) * uNoise * (0.55 + aMeta.y * 0.9);

  /* Dispersão: sobe e volta dentro de cada troca de forma, para a nuvem se
     soltar antes de se reorganizar em vez de escorregar de A para B. */
  float burst = sin(PI * t1) + sin(PI * t2);
  p += flow(q * 0.35, uTime * uFlow * 0.5 + 9.0) * uBurst * burst;
  p += normalize(p + vec2(0.0001)) * burst * uBurst * 0.3;

  /* O cursor afasta; soltar o cursor devolve sozinho, porque não há estado
     guardado — a posição é recalculada do zero a cada quadro. */
  vec2 d = p - uMouse.xy;
  float k = 1.0 - smoothstep(0.0, uMouse.z, length(d));
  p += normalize(d + vec2(0.0001)) * k * k * uPush;

  gl_Position = vec4(p / (uRes * 0.5), 0.0, 1.0);

  /* Tamanho: na foto o primeiro plano é maior (profundidade de campo); nas
     formas os pontos se emparelham, com variação só por semente. */
  float photo = aMeta.x * (1.0 + aMeta.y * 1.5);
  float shape = mix(1.6, 3.0, seed);
  float px = mix(photo, shape, e1);
  gl_PointSize = px * uSize * uDpr * (1.0 + 0.1 * sin(uTime * 0.8 + seed * 24.0));

  float lum = dot(aColor, vec3(0.299, 0.587, 0.114));
  vec3 ink = mix(uInkDark, uInkLight, pow(clamp(lum, 0.0, 1.0), 0.85));
  vColor = mix(ink, aColor, uSaturation);

  /* O primeiro plano é grande e translúcido: opaco demais, os discos se
     sobrepõem e a folha vira espuma em vez de desfoque. */
  vSoft = mix(aMeta.y * 0.95, 0.2, e1);
  vAlpha = uOpacity * mix(mix(1.0, 0.55, aMeta.y), 1.0, e1);
}
`;

const FRAG = `#version 300 es
precision mediump float;

in vec3 vColor;
in float vAlpha;
in float vSoft;

out vec4 frag;

void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  /* Quanto mais "à frente" o ponto, mais macia a borda: é o desfoque do
     primeiro plano da referência, feito no próprio sprite. */
  float a = smoothstep(1.0, 1.0 - mix(0.32, 1.0, vSoft), d) * vAlpha;
  if (a < 0.004) discard;
  frag = vec4(vColor, a);
}
`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (process.env.NODE_ENV !== "production") {
      console.error("origin:", gl.getShaderInfoLog(shader));
    }
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Monta o contexto, o programa e os buffers. Devolve `null` quando o
 * aparelho não tem WebGL2 ou o programa não linka — quem chama cai no
 * desenho estático.
 */
export function createField(canvas: HTMLCanvasElement, data: FieldData): Field | null {
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
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
    if (process.env.NODE_ENV !== "production") {
      console.error("origin:", gl.getProgramInfoLog(program));
    }
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
  attribute("aHero", data.hero, 2);
  attribute("aPlant", data.plant, 2);
  attribute("aMol", data.mol, 2);
  attribute("aColor", data.color, 3);
  attribute("aMeta", data.meta, 3);
  gl.bindVertexArray(null);

  const u = (name: string) => gl.getUniformLocation(program, name);
  const loc = {
    res: u("uRes"),
    heroSize: u("uHeroSize"),
    heroOffset: u("uHeroOffset"),
    shapeSize: u("uShapeSize"),
    shapeOffset: u("uShapeOffset"),
    mouse: u("uMouse"),
    inkDark: u("uInkDark"),
    inkLight: u("uInkLight"),
    phase: u("uPhase"),
    saturation: u("uSaturation"),
    opacity: u("uOpacity"),
    time: u("uTime"),
    dpr: u("uDpr"),
    size: u("uSize"),
    noise: u("uNoise"),
    flow: u("uFlow"),
    burst: u("uBurst"),
    stagger: u("uStagger"),
    push: u("uPush"),
  };

  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
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
      gl.uniform2f(loc.res, res[0], res[1]);
      gl.uniform2f(loc.heroSize, uni.heroSize[0], uni.heroSize[1]);
      gl.uniform2f(loc.heroOffset, uni.heroOffset[0], uni.heroOffset[1]);
      gl.uniform2f(loc.shapeSize, uni.shapeSize[0], uni.shapeSize[1]);
      gl.uniform2f(loc.shapeOffset, uni.shapeOffset[0], uni.shapeOffset[1]);
      gl.uniform3f(loc.mouse, uni.mouse[0], uni.mouse[1], uni.mouseRadius);
      gl.uniform3f(loc.inkDark, uni.inkDark[0], uni.inkDark[1], uni.inkDark[2]);
      gl.uniform3f(loc.inkLight, uni.inkLight[0], uni.inkLight[1], uni.inkLight[2]);
      gl.uniform1f(loc.phase, uni.phase);
      gl.uniform1f(loc.saturation, uni.saturation);
      gl.uniform1f(loc.opacity, uni.opacity);
      gl.uniform1f(loc.time, time);
      gl.uniform1f(loc.dpr, dpr);
      gl.uniform1f(loc.size, uni.size);
      gl.uniform1f(loc.noise, uni.noise);
      gl.uniform1f(loc.flow, uni.flow);
      gl.uniform1f(loc.burst, uni.burst);
      gl.uniform1f(loc.stagger, uni.stagger);
      gl.uniform1f(loc.push, uni.push);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, data.count);
      gl.bindVertexArray(null);
    },

    dispose() {
      if (dead) return;
      dead = true;
      buffers.forEach((b) => gl.deleteBuffer(b));
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      /* Devolve o contexto na hora: o navegador guarda poucos por aba, e uma
         LP com navegação client-side monta e desmonta esta cena várias vezes
         na mesma sessão. */
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
