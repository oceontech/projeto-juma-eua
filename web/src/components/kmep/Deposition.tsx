"use client";

import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { eyebrow, fix, microCaps, seeded } from "./ui";

/* ------------------------------------------------------------ geometria */
/* A carreira de uma gota num quadro de 560 × 720: o bico no alto, o leque,
   a faixa de ar em movimento, e embaixo a lâmina da folha — inclinada e
   cerosa. No canto, o arco do sol com as duas horas do dia. */

const VB_W = 560;
const VB_H = 720;
const NOZZLE: [number, number] = [280, 46];

/* A folha: da base A até a ponta B, subindo para a direita. Duas cúbicas,
   uma por aresta, as duas de A para B: a de cima (onde fica a cera e onde
   as gotas pousam) e a de baixo. Os pontos de controle ficam longe da linha
   A–B e abrem ângulo nas pontas — é isso que deixa a lâmina cheia, com base
   arredondada e ponta romba, em vez de um fuso fino. */
type Pt = [number, number];
const LEAF_A: Pt = [70, 704];
const LEAF_B: Pt = [484, 432];
const LEN = Math.hypot(LEAF_B[0] - LEAF_A[0], LEAF_B[1] - LEAF_A[1]);
const DIR: Pt = [(LEAF_B[0] - LEAF_A[0]) / LEN, (LEAF_B[1] - LEAF_A[1]) / LEN];
/* Normal para dentro da lâmina (para baixo e à direita). */
const NRM: Pt = [-DIR[1], DIR[0]];
const SLOPE = fix((Math.atan2(DIR[1], DIR[0]) * 180) / Math.PI, 3);
/* Ponto a uma fração `t` do eixo A–B, deslocado `off` na normal. */
const along = (t: number, off = 0): Pt => [
  fix(LEAF_A[0] + (LEAF_B[0] - LEAF_A[0]) * t + NRM[0] * off, 1),
  fix(LEAF_A[1] + (LEAF_B[1] - LEAF_A[1]) * t + NRM[1] * off, 1),
];

type Cubic = [Pt, Pt, Pt, Pt];
const cubicAt = ([p0, p1, p2, p3]: Cubic, t: number): Pt => {
  const m = 1 - t;
  const a = m * m * m, b = 3 * m * m * t, c = 3 * m * t * t, d = t * t * t;
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
};
const cubicTangent = ([p0, p1, p2, p3]: Cubic, t: number): Pt => {
  const m = 1 - t;
  const a = 3 * m * m, b = 6 * m * t, c = 3 * t * t;
  return [
    a * (p1[0] - p0[0]) + b * (p2[0] - p1[0]) + c * (p3[0] - p2[0]),
    a * (p1[1] - p0[1]) + b * (p2[1] - p1[1]) + c * (p3[1] - p2[1]),
  ];
};
/* Normal local, na mesma rotação que gera `NRM` a partir de `DIR`. */
const localNrm = ([tx, ty]: Pt): Pt => {
  const m = Math.hypot(tx, ty) || 1;
  return [-ty / m, tx / m];
};
const cubicD = ([, p1, p2, p3]: Cubic) =>
  `C${fix(p1[0], 1)} ${fix(p1[1], 1)} ${fix(p2[0], 1)} ${fix(p2[1], 1)} ${fix(p3[0], 1)} ${fix(p3[1], 1)}`;

const TOP: Cubic = [LEAF_A, along(0.06, -60), along(0.78, -68), LEAF_B];
const BOTTOM: Cubic = [LEAF_A, along(0.05, 64), along(0.78, 72), LEAF_B];
/* A aresta de baixo é desenhada de B de volta para A, para fechar o contorno. */
const LEAF_PATH = `M${LEAF_A[0]} ${LEAF_A[1]} ${cubicD(TOP)} ${cubicD([LEAF_B, BOTTOM[2], BOTTOM[1], LEAF_A])} Z`;

/* A nervura é a média ponto a ponto das duas arestas — como as duas curvas
   têm o mesmo parâmetro, a média é a linha do meio exata e nunca sai da
   lâmina. Nasce na base e para um pouco antes da ponta. */
const MID: Cubic = [0, 1, 2, 3].map((k) => [(TOP[k][0] + BOTTOM[k][0]) / 2, (TOP[k][1] + BOTTOM[k][1]) / 2]) as Cubic;
/* Desenhada como forma cheia, e não traço, para afinar da base (grossa)
   até quase sumir perto da ponta. */
const MIDRIB_PATH = (() => {
  const n = 40;
  const left: string[] = [];
  const right: string[] = [];
  for (let k = 0; k <= n; k++) {
    const t = (k / n) * 0.94;
    const [x, y] = cubicAt(MID, t);
    const [nx, ny] = localNrm(cubicTangent(MID, t));
    const w = 1.3 * (1 - t) + 0.2;
    left.push(`${fix(x - nx * w, 1)} ${fix(y - ny * w, 1)}`);
    right.unshift(`${fix(x + nx * w, 1)} ${fix(y + ny * w, 1)}`);
  }
  return `M${left.join(" L")} L${right.join(" L")} Z`;
})();

/* As nervuras laterais: saem da nervura central e sobem em arco para a
   ponta, parando antes da borda, como numa folha de verdade. Alternadas
   entre os dois lados para não lerem como espinha de peixe. */
const lerp = (a: Pt, b: Pt, k: number): Pt => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
const VEINS = Array.from({ length: 16 }, (_, i) => {
  const side = i % 2 === 0 ? TOP : BOTTOM;
  const s = 0.1 + Math.floor(i / 2) * 0.1 + (i % 2) * 0.04;
  const from = cubicAt(MID, s);
  const to = lerp(cubicAt(MID, s + 0.12), cubicAt(side, s + 0.12), 0.84);
  const ctrl = lerp(cubicAt(MID, s + 0.03), cubicAt(side, s + 0.05), 0.6);
  return `M${fix(from[0], 1)} ${fix(from[1], 1)} Q${fix(ctrl[0], 1)} ${fix(ctrl[1], 1)} ${fix(to[0], 1)} ${fix(to[1], 1)}`;
}).filter((_, i) => Math.floor(i / 2) * 0.1 + 0.1 < 0.84);
/* O pecíolo: um toco curto saindo da base, na direção oposta à ponta. */
const PETIOLE = (() => {
  const [ex, ey] = along(-0.035, 4);
  const [cx, cy] = along(-0.015, 6);
  return `M${LEAF_A[0]} ${LEAF_A[1]} Q${cx} ${cy} ${ex} ${ey}`;
})();
/* O degradê da lâmina corre de uma borda à outra: mais claro no lado de
   cima, que pega a luz, e mais escuro na barriga. */
const SHADE_FROM = along(0.5, -48);
const SHADE_TO = along(0.5, 56);

/* Onde as gotas pousam: a altura da aresta de cima numa dada coordenada x,
   interpolada numa tabela da curva (a cúbica não se resolve em x direto). */
const TOP_TABLE = Array.from({ length: 121 }, (_, i) => cubicAt(TOP, i / 120));
const leafY = (x: number) => {
  const i = TOP_TABLE.findIndex((p) => p[0] >= x);
  if (i <= 0) return TOP_TABLE[Math.max(i, 0)][1];
  const [x0, y0] = TOP_TABLE[i - 1];
  const [x1, y1] = TOP_TABLE[i];
  return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
};

/* A cera: marcas curtas para fora da aresta de cima, como cristais —
   perpendiculares à curva em cada ponto. */
const WAX = Array.from({ length: 30 }, (_, i) => {
  const t = 0.04 + i * 0.031;
  const [x1, y1] = cubicAt(TOP, t);
  const [nx, ny] = localNrm(cubicTangent(TOP, t));
  return { x1: fix(x1, 1), y1: fix(y1, 1), x2: fix(x1 - nx * 4.5, 1), y2: fix(y1 - ny * 4.5, 1) };
});

/* O rótulo corre por fora da aresta de baixo, acompanhando a curva. */
const LABEL_T = 0.28;
const LEAF_LABEL = (() => {
  const [x, y] = cubicAt(BOTTOM, LABEL_T);
  const [nx, ny] = localNrm(cubicTangent(BOTTOM, LABEL_T));
  return [fix(x + nx * 26, 1), fix(y + ny * 26, 1)];
})();
const LABEL_SLOPE = (() => {
  const [tx, ty] = cubicTangent(BOTTOM, LABEL_T);
  return fix((Math.atan2(ty, tx) * 180) / Math.PI, 3);
})();

/* O arco do sol: 6h à esquerda, 18h à direita, por cima. */
const SUN = { cx: 470, cy: 116, r: 56 };
const sunAngle = (h: number) => 180 + ((h - 6) / 12) * 180;
const sunAt = (h: number, r = SUN.r): [number, number] => {
  const rad = (sunAngle(h) * Math.PI) / 180;
  return [fix(SUN.cx + r * Math.cos(rad), 1), fix(SUN.cy + r * Math.sin(rad), 1)];
};
const SUN_TRAVEL = fix(sunAngle(14) - sunAngle(7), 1);

/* O ar: linhas de corrente em onda, atravessando a faixa do meio. */
const AIR = [292, 322, 352, 382].map((y) => `M-40 ${y} q70 -9 140 0 t140 0 t140 0 t140 0 t140 0`);

/* As gotas. Cada uma sai do bico, chega à boca do leque, atravessa o ar e
   tem um de três destinos: fica na folha, é levada pela deriva (as finas),
   ou bate e volta (as grossas). As posições são calculadas uma vez, com
   semente, e arredondadas: servidor e navegador escrevem o mesmo número. */
type Fate = "stay" | "drift" | "bounce";
const AIR_EXIT = 414;
const DROPS = (() => {
  const rand = seeded(11);
  return Array.from({ length: 36 }, () => {
    const u = rand() * 2 - 1;
    const r = 1.6 + rand() ** 2 * 5.6;
    const bx = 280 + u * 116 + (rand() - 0.5) * 14;
    const by = 246 + (rand() - 0.5) * 34;
    const fine = r < 2.8;
    const fate: Fate = fine && rand() < 0.75 ? "drift" : r > 5 && rand() < 0.45 ? "bounce" : "stay";
    const ax = fate === "drift" ? bx + 150 + rand() * 170 : bx + (14 / r) * rand() * 6;
    const ay = fate === "drift" ? 300 + rand() * 80 : AIR_EXIT + (rand() - 0.5) * 18;
    const lx = Math.min(452, Math.max(126, ax));
    const ly = leafY(lx) - r * 0.6;
    const [fx, fy] =
      fate === "drift" ? [ax, ay] : fate === "bounce" ? [lx + (rand() - 0.5) * 90, ly - 70 - rand() * 50] : [lx, ly];
    return {
      fate,
      r: fix(r, 2),
      cx: fix(fx, 1),
      cy: fix(fy, 1),
      /* Deslocamentos de cada etapa, relativos à etapa seguinte. */
      d1: [fix(NOZZLE[0] - bx, 1), fix(NOZZLE[1] + 6 - by, 1)] as const,
      d2: [fix(bx - ax, 1), fix(by - ay, 1)] as const,
      d3: [fix(ax - fx, 1), fix(ay - fy, 1)] as const,
      hit: [fix(lx - fx, 1), fix(ly - fy, 1)] as const,
      lag: fix(rand() * 0.25, 3),
    };
  });
})();

/**
 * K6 — Trabalho 1. O padrão sticky do Cell da LP B: a cena fica presa de
 * um lado enquanto o texto rola do outro em três etapas, cada uma acendendo
 * e movendo a cena no seu trecho — a gota sai do bico, atravessa o ar
 * (enquanto o sol anda das 7h às 14h e o ar engrossa), e pousa. As finas vão
 * com a deriva, as grossas batem e voltam, e as que ficam se espalham na
 * cera e acendem em lima.
 *
 * Uma gota, uma carreira: não há duas plantas lado a lado aqui, nem antes e
 * depois. A cena descreve o caminho físico da calda; o que o produto faz
 * nesse caminho está no texto, com as palavras do canônico.
 */
export function Deposition() {
  const { deposition } = useContent().kmep;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* Uma linha do tempo por etapa. Cada gota vive em três <g> aninhados,
         um por etapa, então as três nunca disputam o mesmo transform. */
      const stage1 = (tl: gsap.core.Timeline) => {
        tl.fromTo(".dp-fan", { scaleY: 0, opacity: 0, svgOrigin: `${NOZZLE[0]} ${NOZZLE[1]}` }, { scaleY: 1, opacity: 1, duration: 0.4 }, 0);
        DROPS.forEach((d, i) => {
          tl.fromTo(`.dp-s1-${i}`, { x: d.d1[0], y: d.d1[1], opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.6 }, 0.1 + d.lag);
          /* A cor entra aqui também: as que pousam são desenhadas em lima
             (o estado final), e saem do bico em creme. */
          tl.fromTo(
            `.dp-e-${i}`,
            { attr: { rx: 0.6, ry: 0.6, fill: "#EEEBE0" } },
            { attr: { rx: d.r, ry: d.r, fill: "#EEEBE0" }, duration: 0.6 },
            0.1 + d.lag,
          );
        });
        return tl;
      };
      const stage2 = (tl: gsap.core.Timeline) => {
        tl.fromTo(".dp-sun", { rotation: -SUN_TRAVEL, svgOrigin: `${SUN.cx} ${SUN.cy}` }, { rotation: 0, duration: 1, ease: "none" }, 0)
          .fromTo(".dp-hour-0", { opacity: 1 }, { opacity: 0.35, duration: 0.3 }, 0.35)
          .fromTo(".dp-hour-1", { opacity: 0.35 }, { opacity: 1, duration: 0.3 }, 0.55)
          .fromTo(".dp-air", { opacity: 0.2 }, { opacity: 0.7, duration: 1, ease: "none" }, 0);
        DROPS.forEach((d, i) => {
          const drift = d.fate === "drift";
          tl.fromTo(
            `.dp-s2-${i}`,
            { x: d.d2[0], y: d.d2[1], opacity: 1 },
            { x: 0, y: 0, opacity: drift ? 0 : 1, duration: 0.7, ease: drift ? "power1.in" : "none" },
            d.lag,
          );
          if (drift) {
            tl.fromTo(
              `.dp-e-${i}`,
              { attr: { rx: d.r, ry: d.r } },
              { attr: { rx: fix(d.r * 0.45), ry: fix(d.r * 0.45) }, duration: 0.7, immediateRender: false },
              d.lag,
            );
          }
        });
        return tl;
      };
      const stage3 = (tl: gsap.core.Timeline) => {
        DROPS.forEach((d, i) => {
          if (d.fate === "drift") return;
          const at = d.lag * 0.8;
          if (d.fate === "bounce") {
            tl.fromTo(`.dp-s3-${i}`, { x: d.d3[0], y: d.d3[1], opacity: 1 }, { x: d.hit[0], y: d.hit[1], duration: 0.4, ease: "power2.in" }, at)
              .to(`.dp-s3-${i}`, { x: 0, y: 0, opacity: 0, duration: 0.45, ease: "power2.out" }, at + 0.4);
            return;
          }
          tl.fromTo(`.dp-s3-${i}`, { x: d.d3[0], y: d.d3[1] }, { x: 0, y: 0, duration: 0.45, ease: "power2.in" }, at).fromTo(
            `.dp-e-${i}`,
            { attr: { rx: d.r, ry: d.r, fill: "#EEEBE0" } },
            { attr: { rx: fix(d.r * 1.6), ry: fix(d.r * 0.6), fill: "#B7C73E" }, duration: 0.3, immediateRender: false },
            at + 0.45,
          );
        });
        return tl;
      };
      const builders = [stage1, stage2, stage3];

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* No celular a leitura acontece abaixo da cena presa, no terço de
           baixo da tela: é ali que cada etapa acende e move o desenho. */
        const wide = window.matchMedia("(min-width: 1024px)").matches;
        const read = wide ? { start: "top 60%", end: "bottom 45%" } : { start: "top 88%", end: "bottom 72%" };
        const active = wide ? { start: "top 62%", end: "bottom 38%" } : { start: "top 86%", end: "bottom 70%" };

        gsap.utils.toArray<HTMLElement>(".dp-stage").forEach((stage, s) => {
          builders[s](gsap.timeline({ defaults: { ease: "power2.out" }, scrollTrigger: { trigger: stage, ...read, scrub: 0.5 } }));

          ScrollTrigger.create({
            trigger: stage,
            ...active,
            toggleClass: { targets: stage, className: "is-active" },
          });

          gsap.fromTo(
            stage.querySelectorAll(".dp-in"),
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 1,
              ease: "expo.out",
              scrollTrigger: { trigger: stage, start: wide ? "top 75%" : "top 90%", once: true },
            },
          );
        });

        /* O ar nunca para: as linhas correm devagar, em qualquer etapa. */
        gsap.to(".dp-air", { strokeDashoffset: -36, duration: 1.6, ease: "none", repeat: -1 });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        builders.forEach((build) => build(gsap.timeline({ paused: true })).progress(1));
        scope.current?.querySelectorAll(".dp-stage").forEach((stage) => stage.classList.add("is-active"));
      });
    },
    { scope },
  );

  const [h7x, h7y] = sunAt(7);
  const [h14x, h14y] = sunAt(14);
  const [l7x, l7y] = sunAt(7, 76);
  const [l14x, l14y] = sunAt(14, 74);
  const [t7x1, t7y1] = sunAt(7, 50);
  const [t14x1, t14y1] = sunAt(14, 50);

  return (
    <section ref={scope} className="relative overflow-clip bg-forest text-offwhite">
      <span aria-hidden data-nav-theme="dark" className="pointer-events-none absolute inset-x-0 top-0 bottom-[15svh]" />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70svh] bg-[linear-gradient(180deg,var(--color-forest)_0%,#26371F_20%,var(--color-olive)_45%,var(--color-moss)_65%,#A9B283_82%,var(--color-cream)_100%)]"
      />
      <div className="wrap relative grid gap-x-16 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)]">
        {/* A cena: presa no meio da tela no desktop. No celular, numa faixa
            presa no topo, com fundo liso da cor da seção e um esmaecimento
            embaixo que dissolve o texto antes de ele encostar no desenho. */}
        <div className="sticky top-0 z-10 -mx-[var(--spacing-gut)] self-start bg-forest pt-[clamp(56px,8svh,72px)] pb-2 lg:mx-0 lg:bg-transparent lg:p-0">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-full h-[clamp(72px,11svh,110px)] bg-[linear-gradient(180deg,#16261B_0%,rgba(22,38,27,0.92)_40%,rgba(22,38,27,0)_100%)] lg:hidden"
          />
          <div className="flex h-[min(44svh,92vw)] items-center justify-center lg:h-[100svh]">
            <div className="relative aspect-[560/720] h-full max-h-[min(720px,86svh)]">
              <svg viewBox={`0 0 ${VB_W} ${VB_H}`} role="img" aria-label={deposition.alt} className="absolute inset-0 h-full w-full">
                {/* O sol e as duas horas. */}
                <g fill="none" stroke="#EEEBE0">
                  <path d={`M${SUN.cx - SUN.r} ${SUN.cy} A${SUN.r} ${SUN.r} 0 0 1 ${SUN.cx + SUN.r} ${SUN.cy}`} strokeOpacity="0.3" strokeDasharray="2 5" />
                  <line x1={SUN.cx - SUN.r - 10} x2={SUN.cx + SUN.r + 10} y1={SUN.cy} y2={SUN.cy} strokeOpacity="0.35" />
                  <line x1={t7x1} y1={t7y1} x2={h7x} y2={h7y} strokeOpacity="0.6" />
                  <line x1={t14x1} y1={t14y1} x2={h14x} y2={h14y} strokeOpacity="0.6" />
                </g>
                <g className="dp-sun">
                  <circle cx={h14x} cy={h14y} r="9" fill="#EEEBE0" fillOpacity="0.18" />
                  <circle cx={h14x} cy={h14y} r="5" fill="#EEEBE0" />
                </g>
                {/* Rótulos do desenho só no desktop: no celular a cena encolhe a
                    menos da metade e eles ficariam ilegíveis. As horas descem
                    para a legenda em HTML, embaixo. */}
                <g className="font-display max-lg:hidden" fill="#EEEBE0" fontSize="15" letterSpacing="1.2">
                  <text className="dp-hour-0" x={l7x} y={l7y + 4} textAnchor="end">
                    {deposition.hours[0].toUpperCase()}
                  </text>
                  <text className="dp-hour-1" x={l14x} y={l14y} textAnchor="start">
                    {deposition.hours[1].toUpperCase()}
                  </text>
                </g>

                {/* A barra do pulverizador, o bico e o leque. */}
                <g stroke="#EEEBE0" strokeWidth="1.5" fill="#16261B">
                  <rect x={NOZZLE[0] - 150} y="1" width="300" height="9" rx="2" strokeOpacity="0.6" />
                  <rect x={NOZZLE[0] - 20} y="8" width="40" height="22" rx="4" />
                  <path d={`M${NOZZLE[0] - 12} 30 H${NOZZLE[0] + 12} L${NOZZLE[0] + 6} ${NOZZLE[1]} H${NOZZLE[0] - 6} Z`} />
                </g>
                <g className="dp-fan">
                  <path
                    d={`M${NOZZLE[0]} ${NOZZLE[1]} L150 262 Q280 282 410 262 Z`}
                    fill="url(#dp-fan-fill)"
                    stroke="#EEEBE0"
                    strokeOpacity="0.35"
                    strokeDasharray="3 5"
                  />
                </g>
                <defs>
                  <linearGradient id="dp-fan-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#EEEBE0" stopOpacity="0.2" />
                    <stop offset="1" stopColor="#EEEBE0" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* O ar. */}
                <g fill="none" stroke="#B9C2A0" strokeWidth="1.2" strokeDasharray="4 14">
                  {AIR.map((d) => (
                    <path key={d} className="dp-air" d={d} opacity="0.7" />
                  ))}
                </g>
                <text x="16" y="276" className="font-display max-lg:hidden" fill="#B9C2A0" fontSize="13" letterSpacing="2.2">
                  {deposition.scene.air.toUpperCase()}
                </text>

                {/* A folha, inclinada e cerosa. */}
                <defs>
                  <linearGradient
                    id="dp-leaf-shade"
                    gradientUnits="userSpaceOnUse"
                    x1={SHADE_FROM[0]}
                    y1={SHADE_FROM[1]}
                    x2={SHADE_TO[0]}
                    y2={SHADE_TO[1]}
                  >
                    <stop offset="0" stopColor="#34482A" />
                    <stop offset="0.5" stopColor="#283B21" />
                    <stop offset="1" stopColor="#1D2C18" />
                  </linearGradient>
                </defs>
                <path d={PETIOLE} fill="none" stroke="#B9C2A0" strokeOpacity="0.6" strokeWidth="2.2" strokeLinecap="round" />
                <path d={LEAF_PATH} fill="url(#dp-leaf-shade)" stroke="#B9C2A0" strokeOpacity="0.6" />
                <g fill="none" stroke="#B9C2A0" strokeOpacity="0.2" strokeWidth="0.9" strokeLinecap="round">
                  {VEINS.map((d) => (
                    <path key={d} d={d} />
                  ))}
                </g>
                <path d={MIDRIB_PATH} fill="#B9C2A0" fillOpacity="0.4" />
                <g stroke="#B9C2A0" strokeOpacity="0.75">
                  {WAX.map((w, i) => (
                    <line key={i} {...w} />
                  ))}
                </g>
                <text
                  x={LEAF_LABEL[0]}
                  y={LEAF_LABEL[1]}
                  transform={`rotate(${LABEL_SLOPE} ${LEAF_LABEL[0]} ${LEAF_LABEL[1]})`}
                  className="font-display max-lg:hidden"
                  fill="#B9C2A0"
                  fontSize="13"
                  letterSpacing="2.2"
                >
                  {deposition.scene.surface.toUpperCase()}
                </text>

                {/* As gotas — no estado final; a animação as traz do bico. */}
                {DROPS.map((d, i) => (
                  <g key={i} className={`dp-s1-${i}`}>
                    <g className={`dp-s2-${i}`} opacity={d.fate === "drift" ? 0 : undefined}>
                      <g className={`dp-s3-${i}`} opacity={d.fate === "bounce" ? 0 : undefined}>
                        <ellipse
                          className={`dp-e-${i}`}
                          cx={d.cx}
                          cy={d.cy}
                          rx={d.fate === "stay" ? fix(d.r * 1.6) : d.fate === "drift" ? fix(d.r * 0.45) : d.r}
                          ry={d.fate === "stay" ? fix(d.r * 0.6) : d.fate === "drift" ? fix(d.r * 0.45) : d.r}
                          transform={d.fate === "stay" ? `rotate(${SLOPE} ${d.cx} ${d.cy})` : undefined}
                          fill={d.fate === "stay" ? "#B7C73E" : "#EEEBE0"}
                          fillOpacity="0.92"
                        />
                      </g>
                    </g>
                  </g>
                ))}
              </svg>
              <p aria-hidden className="absolute right-0 bottom-[1%] flex items-center gap-2 font-display text-[11px] tracking-[0.14em] text-offwhite uppercase lg:hidden">
                <span className="dp-hour-0">{deposition.hours[0]}</span>
                <span className="text-offwhite/40">→</span>
                <span className="dp-hour-1">{deposition.hours[1]}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="relative pt-4 pb-[clamp(56px,10svh,120px)] lg:pt-[18svh] lg:pb-[24svh]">
          <p className={`${eyebrow} text-lime-bright`}>{deposition.label}</p>
          {deposition.stages.map((stage, i) => (
            <article
              key={stage.n}
              className="dp-stage flex min-h-[64svh] flex-col justify-center opacity-30 transition-opacity duration-500 motion-reduce:opacity-100 lg:min-h-[80svh] [&.is-active]:opacity-100"
            >
              <p className={`dp-in ${microCaps} text-lime`}>
                {stage.n} · {stage.kicker}
              </p>
              {i === 0 ? (
                <h2 className="dp-in mt-4 max-w-[14ch] text-[clamp(36px,4vw,72px)] leading-[0.96] tracking-[-0.035em]">
                  {deposition.heading}
                </h2>
              ) : (
                <h3
                  className={`dp-in mt-4 max-w-[20ch] text-[clamp(28px,2.9vw,50px)] leading-[1.02] tracking-[-0.03em] ${i === 1 ? "border-l-2 border-lime pl-[clamp(14px,1.4vw,22px)]" : ""}`}
                >
                  {"title" in stage ? stage.title : null}
                </h3>
              )}
              <p className={`dp-in ${microCaps} mt-5 max-w-[46ch] text-[12px] text-offwhite/75`}>{stage.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
