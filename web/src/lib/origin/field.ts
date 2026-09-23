/**
 * O campo de partículas — um único draw call de `POINTS` em WebGL2.
 *
 * Por que WebGL cru e não three.js: aqui não há cena, câmera, luz nem
 * material. Há uma nuvem de pontos com um shader próprio, que é justamente a
 * parte que o three não escreveria por nós. Trazer a biblioteca inteira para
 * isso custaria uns 150 KB comprimidos numa página cujo hero já são cinco
 * imagens grandes. O contrato é o mesmo — um atributo por estado, uniforms
 * uPhase/uSaturation/uTime/uMouse —, só que sem a camada do meio.
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
  /** As quatro formas, n×3 cada — x, y e a ordem de construção. */
  shapes: [Float32Array, Float32Array, Float32Array, Float32Array];
  /** n×3 — a cor do pixel de origem, 0–1. */
  color: Float32Array;
  /** n×4 — tamanho base (px), profundidade, semente, halo. */
  meta: Float32Array;
};

/** O estado que o scroll, o mouse e o painel de dev escrevem a cada quadro. */
export type Uniforms = {
  /** 0 = foto, 1 = planta, 2 = nitrato, 3 = amônio, 4 = aminoácido. */
  phase: number;
  /** 1 = cores da foto, 0 = grafite. */
  saturation: number;
  opacity: number;
  size: number;
  /** Amplitude da deriva, em px. */
  noise: number;
  /** Velocidade do campo de fluxo. */
  flow: number;
  /** Velocidade da órbita de cada partícula em torno do próprio lugar. */
  orbit: number;
  /** Quanto as partículas soltas se afastam da forma, em px. */
  halo: number;
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
  /** Aproximação da foto durante a saída do hero. */
  heroZoom: number;
  /** O ponto da foto em que o zoom entra, no mesmo espaço de `aHero`. */
  heroFocus: [number, number];
  /** 0 = a foto se desfaz no acaso; 1 = de fora para dentro, em ordem. */
  order: number;
  /** Quanto a primeira quebra é mais violenta que as trocas seguintes. */
  shatter: number;
};

export type Field = {
  resize(cssW: number, cssH: number, dpr: number): void;
  /** Troca a nuvem sem refazer contexto nem programa. */
  update(data: FieldData): void;
  render(u: Uniforms, time: number): void;
  dispose(): void;
};

const VERT = `#version 300 es
precision highp float;

in vec2 aHero;
in vec3 aS0;
in vec3 aS1;
in vec3 aS2;
in vec3 aS3;
in vec3 aColor;
in vec4 aMeta;

uniform vec2 uRes;
uniform vec2 uHeroSize;
uniform vec2 uHeroOffset;
uniform vec2 uShapeSize;
uniform vec2 uShapeOffset;
uniform vec2 uHeroFocus;
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
uniform float uOrbit;
uniform float uHalo;
uniform float uBurst;
uniform float uStagger;
uniform float uPush;
uniform float uHeroZoom;
uniform float uOrder;
uniform float uShatter;

out vec3 vColor;
out float vAlpha;
out float vSize;

const float PI = 3.14159265;

/* Hash sem seno (Dave Hoskins): o seno custa caro repetido dezesseis vezes
   por vértice, e aqui são dezenas de milhares de vértices por quadro. */
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

/* Progresso da partícula numa perna da cadeia. Cada uma parte num instante
   diferente — sem isso o conjunto vira um slide trocando de imagem. A chave
   do atraso é um parâmetro porque a primeira perna usa outra: ali o atraso
   vem do lugar na foto, não do acaso. */
float leg(float base, float key) {
  return clamp((uPhase - base - key * uStagger) / max(1.0 - uStagger, 0.001), 0.0, 1.0);
}

float ease(float t) {
  return t * t * (3.0 - 2.0 * t);
}

void main() {
  float seed = aMeta.z;
  float halo = aMeta.w;

  /* A foto não se desfaz em bloco. Quem está longe do rótulo parte primeiro e
     o galão é a última coisa a sumir: a imagem se despedaça de fora para
     dentro, em vez de trocar de lugar toda junta. O eixo y pesa mais porque o
     enquadramento é largo, e sem isso o céu e o solo sairiam antes das
     laterais. */
  float order = 1.0 - clamp(length((aHero - uHeroFocus) * vec2(1.0, 1.5)) / 0.62, 0.0, 1.0);

  /* Cada forma traz a própria ordem de construção no z — a planta nasce de
     cima para baixo e a raiz cresce por último, a molécula se monta do centro
     para fora. Na primeira perna ela se mistura com a erosão da foto: a
     partícula que sai antes é a que está longe do rótulo **e** pertence ao
     alto da planta. */
  float t0 = leg(0.0, mix(seed, mix(order, aS0.z, 0.6), uOrder));
  float t1 = leg(1.0, mix(seed, aS1.z, uOrder));
  float t2 = leg(2.0, mix(seed, aS2.z, uOrder));
  float t3 = leg(3.0, mix(seed, aS3.z, uOrder));
  float shaped = ease(t0);

  /* Posição **local**, relativa ao centro do próprio estado, separada do
     centro em tela: é o que deixa o zoom da foto acontecer em torno do rótulo
     e o desenho ficar onde a coluna o quer, sem um puxar o outro. */
  vec2 heroCenter = uHeroFocus * uHeroSize + uHeroOffset;
  vec2 heroLocal = (aHero - uHeroFocus) * uHeroSize * uHeroZoom;

  vec2 local = mix(heroLocal, aS0.xy * uShapeSize, shaped);
  local = mix(local, aS1.xy * uShapeSize, ease(t1));
  local = mix(local, aS2.xy * uShapeSize, ease(t2));
  local = mix(local, aS3.xy * uShapeSize, ease(t3));
  vec2 center = mix(heroCenter, uShapeOffset, shaped);

  /* Domínio estável por partícula: o ruído não pode ser lido na posição já
     deslocada, ou a partícula realimenta o próprio desvio. */
  vec2 q = aHero * 3.0 + seed * 7.0;

  /* O halo: as soltas se afastam da forma e ficam vagando em volta dela, que
     é o volume em torno do desenho. Só existe depois que a forma se fecha. */
  vec2 away = normalize(local + vec2(0.0001, 0.0));
  local += (away + flow(q * 0.8, uTime * uFlow * 0.7) * 0.7) * halo * uHalo * shaped;

  /* Respiração: nunca totalmente paradas. A órbita é de cada partícula em
     torno do próprio lugar; o campo de fluxo é o que move o conjunto.

     Dentro do desenho a deriva cai pela metade, e é de propósito: as letras
     dos átomos são buracos de uns poucos pixels no campo de pontos, e com a
     amplitude do estado de foto as partículas vizinhas entram no buraco e
     apagam a letra. Quem flutua de verdade é o halo. */
  float wander = mix(1.0, 0.5, shaped) + halo * 3.0;
  local += flow(q, uTime * uFlow) * uNoise * (0.55 + aMeta.y * 0.9) * wander;
  float orb = seed * 6.2831;
  local += vec2(cos(uTime * uOrbit + orb), sin(uTime * uOrbit * 1.17 + orb * 1.7))
           * uNoise * 0.6 * wander;

  /* Dispersão: sobe e volta dentro de cada troca de forma, para a nuvem se
     soltar antes de se reorganizar em vez de escorregar de A para B. */
  float burst = sin(PI * t0) * uShatter + sin(PI * t1) + sin(PI * t2) + sin(PI * t3);
  local += flow(q * 0.35, uTime * uFlow * 0.5 + 9.0) * uBurst * burst;
  local += normalize(local + vec2(0.0001)) * burst * uBurst * 0.3;

  vec2 p = local + center;

  /* O cursor afasta; soltar o cursor devolve sozinho, porque não há estado
     guardado — a posição é recalculada do zero a cada quadro. */
  vec2 d = p - uMouse.xy;
  float k = 1.0 - smoothstep(0.0, uMouse.z, length(d));
  p += normalize(d + vec2(0.0001)) * k * k * uPush;

  gl_Position = vec4(p / (uRes * 0.5), 0.0, 1.0);

  /* Tamanho: na foto o primeiro plano é maior (é assim que a folhagem
     recortada se separa do fundo); nas formas os pontos se emparelham, com
     variação só por semente. */
  float photo = aMeta.x * (1.0 + aMeta.y * 1.5) * mix(1.0, 1.9, clamp(uHeroZoom - 1.0, 0.0, 1.0));
  float shape = mix(3.0, 4.8, seed);
  vSize = mix(photo, shape, shaped) * uSize * uDpr
          * (1.0 + 0.1 * sin(uTime * 0.8 + seed * 24.0));
  gl_PointSize = vSize;

  float lum = dot(aColor, vec3(0.299, 0.587, 0.114));
  vec3 ink = mix(uInkDark, uInkLight, pow(clamp(lum, 0.0, 1.0), 0.85));
  vColor = mix(ink, aColor, uSaturation);

  vAlpha = uOpacity * mix(mix(1.0, 0.62, aMeta.y), 1.0, shaped);
}
`;

const FRAG = `#version 300 es
precision mediump float;

in vec3 vColor;
in float vAlpha;
in float vSize;

out vec4 frag;

void main() {
  /* Círculo de verdade: borda dura com cerca de um pixel de suavização, e
     não um borrão radial. A suavização é medida em fração do sprite, que é
     por isso que o tamanho vem do vertex shader. */
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float aa = clamp(2.2 / max(vSize, 1.0), 0.05, 1.0);
  float a = (1.0 - smoothstep(1.0 - aa, 1.0, d)) * vAlpha;
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

  /* Um lugar só descrevendo os atributos, porque eles são recarregados
     inteiros quando a contagem de partículas muda. */
  const SPEC: [name: string, size: number, pick: (d: FieldData) => Float32Array][] = [
    ["aHero", 2, (d) => d.hero],
    ["aS0", 3, (d) => d.shapes[0]],
    ["aS1", 3, (d) => d.shapes[1]],
    ["aS2", 3, (d) => d.shapes[2]],
    ["aS3", 3, (d) => d.shapes[3]],
    ["aColor", 3, (d) => d.color],
    ["aMeta", 4, (d) => d.meta],
  ];

  const buffers = SPEC.map(([name, size]) => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const loc = gl.getAttribLocation(program, name);
    if (loc >= 0) {
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    }
    return buffer;
  });
  gl.bindVertexArray(null);

  /* Trocar de nuvem é recarregar buffer, nunca refazer o contexto. O
     `dispose` devolve o contexto do canvas, e um canvas que já perdeu o
     contexto não devolve outro: o `createField` seguinte compilaria o shader
     num contexto morto e falharia — foi exatamente o que acontecia ao mexer
     na densidade pelo painel. */
  let current = data;
  const upload = (next: FieldData) => {
    current = next;
    SPEC.forEach(([, , pick], i) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers[i]);
      gl.bufferData(gl.ARRAY_BUFFER, pick(next), gl.STATIC_DRAW);
    });
  };
  upload(data);

  const u = (name: string) => gl.getUniformLocation(program, name);
  const loc = {
    res: u("uRes"),
    heroSize: u("uHeroSize"),
    heroOffset: u("uHeroOffset"),
    shapeSize: u("uShapeSize"),
    shapeOffset: u("uShapeOffset"),
    heroFocus: u("uHeroFocus"),
    heroZoom: u("uHeroZoom"),
    order: u("uOrder"),
    shatter: u("uShatter"),
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
    orbit: u("uOrbit"),
    halo: u("uHalo"),
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

    update(next) {
      if (!dead) upload(next);
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
      gl.uniform2f(loc.heroFocus, uni.heroFocus[0], uni.heroFocus[1]);
      gl.uniform1f(loc.heroZoom, uni.heroZoom);
      gl.uniform1f(loc.order, uni.order);
      gl.uniform1f(loc.shatter, uni.shatter);
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
      gl.uniform1f(loc.orbit, uni.orbit);
      gl.uniform1f(loc.halo, uni.halo);
      gl.uniform1f(loc.burst, uni.burst);
      gl.uniform1f(loc.stagger, uni.stagger);
      gl.uniform1f(loc.push, uni.push);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, current.count);
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
