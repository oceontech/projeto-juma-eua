"use client";

import Image from "next/image";
import { Fragment, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { SplitLines } from "@/components/motion/SplitLines";
import { CropIcon } from "@/components/home/CropIcon";
import { scroller } from "@/components/motion/SmoothScroll";
import { eyebrow, fix, microCaps, microText } from "@/components/kmep/ui";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Um estágio no arco. `at` é a posição na régua ordinal, de 0 a 1. */
export type DialMark = { code: string; display?: string; at: number; minor?: boolean };
export type DialCrop = {
  id: string;
  label: string;
  rate: string;
  /** Troca as pontas do arco quando a safra não começa no plantio. */
  ends?: readonly string[];
  marks: readonly DialMark[];
  /** O trecho que cada nota cobre; `from === to` é o estágio isolado, com o anel que pulsa. */
  spans: readonly { from: number; to: number; note: string }[];
  summary: string;
};
export type DialData = {
  label?: string;
  heading: string;
  body: string;
  cropLabel: string;
  rateLabel: string;
  ends: readonly string[];
  hint: string;
  pass: string;
  crops: readonly DialCrop[];
};
/**
 * O desenho de cada estágio: um sprite com as plantas lado a lado, cortado
 * no espaço entre elas (pixels da imagem original), ou uma imagem por estágio.
 */
export type StageArt = { src: string; width: number; height: number; cuts: number[] } | readonly string[];

/* O arco da safra: meio círculo com o plantio à esquerda e a colheita à
   direita, no viewBox 1000 × 560. */
const ARC = { cx: 500, cy: 520, r: 420 };
const VIEW = { w: 1000, h: 560 };
const TICKS = Array.from({ length: 41 }, (_, i) => i / 40);
const CROP_ICONS: Record<string, string> = {
  citrus: "citrus",
  fruit: "tree-fruit",
  veg: "vegetables",
  tomato: "tomato-pepper",
  ornamental: "ornamentals",
  potato: "potato",
  onion: "onion-garlic",
  roots: "carrot-beet",
  corn: "corn",
  soy: "soybean",
  cotton: "cotton",
  beans: "beans",
};
/* As gotas que saltam do estágio quando a passada chega nele. */
const DROPS = Array.from({ length: 9 }, (_, k) => ({ deg: k * 40 + 12, dist: k % 2 ? 46 : 68 }));

/* O nome da cultura em corpo grande encolhe com o comprimento: "Corn" cabe
   em 160px, "Tomatoes & peppers" não. */
function nameSize(label: string) {
  if (label.length <= 9) return "text-[length:clamp(56px,min(10vw,16svh),160px)]";
  if (label.length <= 12) return "text-[length:clamp(44px,min(7.2vw,12svh),118px)]";
  return "text-[length:clamp(34px,min(5.2vw,9svh),86px)]";
}

/* Ponto do arco na fração t da safra. */
function onArc(t: number, r = ARC.r): [number, number] {
  const a = Math.PI * (1 - t);
  return [ARC.cx + r * Math.cos(a), ARC.cy - r * Math.sin(a)];
}

/* Trecho do arco entre duas frações. Sweep 1 é horário na tela: por cima. */
function arcPath(t0: number, t1: number, r = ARC.r) {
  const [x0, y0] = onArc(t0, r).map((n) => fix(n));
  const [x1, y1] = onArc(t1, r).map((n) => fix(n));
  return `M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}`;
}

/**
 * Scroll → posição na safra. A régua é ordinal, então o scroll não anda em
 * escala de dias: cada estágio recebe a mesma fatia de rolagem e uma parada
 * curta em cima dele (`HOLD`), para a leitura. Sem isso o milho passava por
 * V4 e V6 num átimo e gastava meia cena no vazio até a formação da espiga.
 */
const HOLD = 0.08;
function warp(p: number, ats: number[]) {
  const n = ats.length;
  const knots: [number, number][] = [[0, 0]];
  ats.forEach((at, i) => {
    const s = 0.08 + (n > 1 ? (i * 0.6) / (n - 1) : 0.3);
    knots.push([s, at], [s + HOLD, at]);
  });
  knots.push([1, 1]);
  for (let k = 1; k < knots.length; k++) {
    const [p0, t0] = knots[k - 1];
    const [p1, t1] = knots[k];
    if (p <= p1) return p1 === p0 ? t1 : t0 + ((p - p0) / (p1 - p0)) * (t1 - t0);
  }
  return 1;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const noop = () => () => {};

/** O que a cena guarda entre um quadro e outro. */
type Live = { p: number; shown: number; lit: number };

/* As gotas e o anel de um estágio que acabou de acender. */
function burst(root: HTMLElement, i: number, delay = 0) {
  const g = root.querySelector(`.tm-burst[data-i="${i}"]`);
  if (!g) return;
  gsap.fromTo(
    g.querySelector(".tm-ring"),
    { attr: { r: 12 }, opacity: 0.9 },
    { attr: { r: 84 }, opacity: 0, duration: 1.2, delay, ease: "expo.out" },
  );
  g.querySelectorAll(".tm-drop").forEach((drop, k) => {
    const { deg, dist } = DROPS[k];
    const rad = (deg * Math.PI) / 180;
    gsap.fromTo(
      drop,
      { x: 0, y: 0, opacity: 1, scale: 1.3 },
      { x: Math.cos(rad) * dist, y: Math.sin(rad) * dist, opacity: 0, scale: 0.4, duration: 0.95, delay, ease: "power3.out" },
    );
  });
}

/* A entrada de um painel do centro: as letras sobem de dentro da máscara. */
function enter(el: Element, dir: number, delay = 0.12) {
  gsap.set(el, { autoAlpha: 1 });
  const photo = el.querySelector(".tm-photo");
  if (photo) gsap.fromTo(photo, { opacity: 0, y: 24 * dir, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, delay, ease: "expo.out" });
  gsap.fromTo(
    el.querySelectorAll(".tm-ch"),
    { yPercent: 110 * dir },
    { yPercent: 0, duration: 0.9, delay, ease: "expo.out", stagger: { each: 0.035, from: dir > 0 ? "start" : "end" } },
  );
  gsap.fromTo(
    el.querySelectorAll(".tm-meta"),
    { opacity: 0, y: 14 * dir },
    { opacity: 1, y: 0, duration: 0.7, delay: delay + 0.18, stagger: 0.06 },
  );
}

/**
 * Troca o painel do centro. As letras saem para o lado do scroll e as novas
 * chegam do lado oposto, como um contador: rolando de volta, o gesto inverte.
 */
function swap(root: HTMLElement, from: number, to: number, dir: number, instant: boolean) {
  const says = [...root.querySelectorAll<HTMLElement>(".tm-say")];
  const get = (i: number) => says.find((s) => Number(s.dataset.i) === i);
  const next = get(to);
  const prev = get(from);
  says.forEach((s) => {
    gsap.killTweensOf(s.querySelectorAll(".tm-ch, .tm-meta, .tm-photo"));
    if (s !== next && s !== prev) gsap.set(s, { autoAlpha: 0 });
  });
  if (!next) return;

  if (instant || !prev) {
    if (prev) gsap.set(prev, { autoAlpha: 0 });
    gsap.set(next, { autoAlpha: 1 });
    gsap.set(next.querySelectorAll(".tm-ch"), { yPercent: 0 });
    gsap.set(next.querySelectorAll(".tm-meta"), { opacity: 1, y: 0 });
    const photo = next.querySelector(".tm-photo");
    if (photo) gsap.set(photo, { opacity: 1, y: 0, scale: 1 });
    return;
  }

  gsap.to(prev.querySelectorAll(".tm-ch"), {
    yPercent: -110 * dir,
    duration: 0.42,
    ease: "power3.in",
    stagger: { each: 0.018, from: dir > 0 ? "start" : "end" },
    onComplete: () => void gsap.set(prev, { autoAlpha: 0 }),
  });
  gsap.to(prev.querySelectorAll(".tm-meta"), { opacity: 0, y: -12 * dir, duration: 0.3, ease: "power2.in" });
  const photo = prev.querySelector(".tm-photo");
  if (photo) gsap.to(photo, { opacity: 0, y: -24 * dir, scale: 0.94, duration: 0.4, ease: "power2.in" });
  enter(next, dir);
}

/**
 * Um quadro da cena, a partir do progresso guardado em `live.p`. Tudo é lido
 * do DOM, e não do React: a cena sobrevive à troca de cultura sem ser refeita.
 */
function draw(root: HTMLElement, live: Live, dir: number, instant: boolean) {
  const nodes = [...root.querySelectorAll<SVGGElement>(".tm-node")];
  const ats = nodes.map((n) => Number(n.dataset.at));
  const t = warp(live.p, ats);

  let idx = -1;
  ats.forEach((at, i) => {
    if (t >= at - 1e-4) idx = i;
  });

  root.querySelector(".tm-trail")?.setAttribute("stroke-dashoffset", String(1 - t));
  root.querySelectorAll<SVGElement>(".tm-tick").forEach((el) => {
    el.classList.toggle("is-on", t >= Number(el.dataset.at) - 1e-4);
  });
  root.querySelectorAll<SVGPathElement>(".tm-span").forEach((el) => {
    const a = Number(el.dataset.from);
    const b = Number(el.dataset.to);
    const k = clamp01((t - a) / (b - a));
    el.setAttribute("stroke-dashoffset", String(1 - k));
    el.style.opacity = k > 0 ? "1" : "0";
  });
  root.querySelectorAll<HTMLElement | SVGElement>(".tm-node, .tm-label, .tm-halo").forEach((el) => {
    el.classList.toggle("is-on", Number(el.dataset.i) <= idx);
  });

  /* A passada: o marcador, o ponteiro e a luz que vai com ele. */
  const [x, y] = onArc(t);
  root.querySelector(".tm-pass")?.setAttribute("transform", `translate(${x} ${y})`);
  const needle = root.querySelector(".tm-needle");
  if (needle) {
    const [x1, y1] = onArc(t, ARC.r - 86);
    const [x2, y2] = onArc(t, ARC.r - 26);
    needle.setAttribute("x1", String(x1));
    needle.setAttribute("y1", String(y1));
    needle.setAttribute("x2", String(x2));
    needle.setAttribute("y2", String(y2));
  }
  const glow = root.querySelector<HTMLElement>(".tm-glow");
  if (glow) {
    glow.style.left = `${(x / VIEW.w) * 100}%`;
    glow.style.top = `${(y / VIEW.h) * 100}%`;
  }
  root.querySelectorAll<SVGPathElement>(".tm-rows path").forEach((el, k) => {
    el.setAttribute("stroke-dashoffset", String(-t * (k ? 140 : 90)));
  });

  if (!instant && dir > 0 && idx > live.lit) burst(root, idx);
  live.lit = idx;

  if (idx !== live.shown) {
    swap(root, live.shown, idx, dir, instant);
    live.shown = idx;
  }
}

/* Texto grande do centro, letra por letra, cada palavra com a própria máscara. */
function Roll({ text }: { text: string }) {
  return text.split(" ").map((word, w) => (
    <Fragment key={w}>
      {w > 0 && " "}
      <span className="inline-block overflow-hidden pb-[0.12em] align-top">
        {[...word].map((ch, c) => (
          <span key={c} className="tm-ch inline-block">
            {ch}
          </span>
        ))}
      </span>
    </Fragment>
  ));
}

/**
 * O mostrador da safra, das duas LPs (K13 no KMEP, A9 no Aminosan). A safra
 * vira um arco do plantio à colheita, preso ao scroll, que a passada
 * atravessa como o sol atravessa o dia. Em cada estágio ela para, o estágio
 * acende com as gotas da calda e o centro troca de letra em letra. O trecho
 * que a nota do rótulo cobre ganha a faixa lima; o estágio isolado (a
 * formação da espiga) ganha o anel que pulsa.
 *
 * A troca de cultura passa por uma íris: o verde abre a partir do botão, a
 * cena troca por baixo e a íris se fecha dentro da passada — que continua no
 * mesmo ponto da safra.
 *
 * A régua é ordinal: marca os estágios do rótulo, sem fingir escala de dias.
 * O mostrador é desenho; a leitura acessível é a frase de resumo embaixo dele.
 *
 * Cada página traz o próprio conteúdo (`data`), o desenho dos estágios
 * (`art`, por id de cultura) e o que vem depois do mostrador (`children`,
 * dentro da mesma seção).
 */
export function SeasonDial({
  data: timing,
  art,
  id,
  bigTabs = false,
  children,
}: {
  data: DialData;
  art: Record<string, StageArt>;
  id?: string;
  /* Poucas culturas (o Aminosan® tem duas): abas maiores e centradas. */
  bigTabs?: boolean;
  children?: React.ReactNode;
}) {
  const [active, setActive] = useState(0);
  const [veilIndex, setVeilIndex] = useState(0);
  const crop = timing.crops[active];
  const scope = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const veilWord = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const tablist = useRef<HTMLDivElement>(null);
  const live = useRef<Live>({ p: 0, shown: -2, lit: -1 });
  const motion = useRef(false);
  /* A íris está no meio do gesto: fechada sobre a cena, esperando a troca. */
  const busy = useRef(false);
  const covered = useRef(false);
  /* O gatilho do pin, para levar a página para dentro da cena na troca. */
  const pin = useRef<ScrollTrigger | null>(null);
  /* A íris vive no body: cobre a tela inteira mesmo com a cena fora do pin. */
  const portal = useSyncExternalStore(
    noop,
    () => document.body,
    () => null,
  );

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { animate } = ctx.conditions as { animate: boolean };
          motion.current = animate;
          pin.current = null;
          live.current.shown = -2;

          if (!animate) {
            live.current.p = 1;
            draw(root, live.current, 1, true);
            return;
          }

          const state = { p: 0 };
          const scene = gsap.fromTo(
            state,
            { p: 0 },
            {
              p: 1,
              ease: "none",
              onUpdate: () => {
                const dir = state.p >= live.current.p ? 1 : -1;
                live.current.p = state.p;
                draw(root, live.current, dir, false);
              },
              scrollTrigger: { trigger: ".tm-stage", start: "top top", end: "+=260%", scrub: 1.2, pin: true },
            },
          );
          pin.current = scene.scrollTrigger ?? null;
          live.current.p = 0;
          draw(root, live.current, 1, true);
        },
      );
    },
    { scope },
  );

  /* A cultura trocou: a cena se redesenha no mesmo ponto da safra e, se a
     íris estiver fechada, ela se abre de volta para dentro da passada. */
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    /* No celular as culturas correm numa faixa com rolagem lateral: a ativa
       vai para o centro dela, sem mexer no scroll da página. */
    const list = tablist.current;
    const tab = tabs.current[active];
    if (list && tab && list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
    }
    live.current.shown = -2;
    draw(root, live.current, 1, true);

    if (!covered.current || !veil.current) return;
    covered.current = false;
    const m = root.querySelector(".tm-pass")?.getBoundingClientRect();
    const inView = m && m.top > 0 && m.bottom < window.innerHeight;
    const at = inView ? `${m.left + m.width / 2}px ${m.top + m.height / 2}px` : "50% 50%";
    const radius = Math.hypot(window.innerWidth, window.innerHeight);
    /* A entrada da palavra ainda pode estar correndo: sem matá-la, ela volta a
       acender a palavra depois do fade — era a piscada no fim da troca. */
    gsap.killTweensOf(veilWord.current);
    gsap.to(veilWord.current, { opacity: 0, scale: 1.06, duration: 0.35, delay: 0.2, ease: "power2.in" });
    gsap.fromTo(
      veil.current,
      { clipPath: `circle(${radius}px at ${at})` },
      {
        clipPath: `circle(0px at ${at})`,
        duration: 0.9,
        delay: 0.3,
        ease: "expo.inOut",
        onComplete: () => void (busy.current = false),
      },
    );
    const say = root.querySelector(`.tm-say[data-i="${live.current.shown}"]`);
    if (say) enter(say, 1, 0.65);
    for (let i = 0; i <= live.current.lit; i++) burst(root, i, 0.75 + i * 0.12);
  }, [active]);

  function choose(i: number, from: HTMLElement | null) {
    if (i === active || busy.current) return;
    if (!motion.current || !from || !veil.current) {
      setActive(i);
      return;
    }
    busy.current = true;
    const b = from.getBoundingClientRect();
    const at = `${b.left + b.width / 2}px ${b.top + b.height / 2}px`;
    setVeilIndex(i);
    gsap.fromTo(
      veil.current,
      { clipPath: `circle(0px at ${at})` },
      {
        clipPath: `circle(${Math.hypot(window.innerWidth, window.innerHeight)}px at ${at})`,
        duration: 0.65,
        ease: "power3.in",
        onComplete: () => {
          intoScene();
          covered.current = true;
          setActive(i);
        },
      },
    );
    gsap.killTweensOf(veilWord.current);
    gsap.fromTo(veilWord.current, { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 0.6, delay: 0.2, ease: "expo.out" });
  }

  /* Com a tela coberta, leva a página para dentro da cena presa: quem clicou
     com a seção pela metade reabre a íris já com o mostrador inteiro na tela.
     Dentro do pin nada muda — a passada segue no mesmo ponto da safra. */
  function intoScene() {
    const st = pin.current;
    if (!st) return;
    const y = window.scrollY;
    const to = y < st.start ? st.start + 1 : y > st.end ? st.end - 1 : null;
    if (to === null) return;
    const lenis = scroller();
    if (lenis) lenis.scrollTo(to, { immediate: true, force: true });
    else window.scrollTo({ top: to, behavior: "instant" });
    ScrollTrigger.update();
    /* O scrub alcança o ponto novo já, e não durante a reabertura. */
    st.getTween()?.progress(1);
  }

  const noteFor = (i: number) => crop.spans.find((s) => i >= s.from && i <= s.to)?.note ?? "";
  const total = String(crop.marks.length).padStart(2, "0");
  const ends = crop.ends ?? timing.ends;

  return (
    <section id={id} ref={scope} className="relative bg-white text-forest">
      <div className="wrap pt-sec">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-end lg:gap-16">
          <div>
            {timing.label && <p className={`${eyebrow} mb-4 text-moss`}>{timing.label}</p>}
            <SplitLines className="text-[clamp(44px,5.6vw,108px)] leading-[0.93] tracking-[-0.04em]">{timing.heading}</SplitLines>
          </div>
          <p className={`${microText} text-forest/75`}>{timing.body}</p>
        </div>
      </div>

      <div ref={stage} className="tm-stage relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-[clamp(80px,12svh,110px)] pb-[clamp(28px,6svh,64px)] lg:justify-center lg:py-[clamp(28px,6svh,64px)]">
        <div className="wrap">
          {/* O alternador: as culturas em corpo grande, a apagada só no contorno, centradas na tela. */}
          <div className="flex flex-col items-center text-center">
            <p className={`${eyebrow} text-[10px] text-moss`}>{timing.cropLabel}</p>
            {/* Todas as culturas à vista, quebrando em linhas centradas, sem
                rolagem lateral. */}
            <div
              ref={tablist}
              role="tablist"
              aria-label={timing.cropLabel}
              className={`relative mt-3 flex w-full max-w-[1180px] items-center flex-wrap justify-center gap-x-[clamp(12px,1.5vw,24px)] gap-y-2 px-4`}
            >
              {timing.crops.map((c, i) => {
                const on = i === active;
                return (
                  <button
                    key={c.id}
                    ref={(el) => void (tabs.current[i] = el)}
                    type="button"
                    role="tab"
                    id={`tm-tab-${c.id}`}
                    aria-selected={on}
                    aria-controls="tm-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={(e) => choose(i, e.currentTarget)}
                    onKeyDown={(e) => {
                      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                      e.preventDefault();
                      const n = (i + (e.key === "ArrowRight" ? 1 : -1) + timing.crops.length) % timing.crops.length;
                      tabs.current[n]?.focus();
                      choose(n, tabs.current[n]);
                    }}
                    className={`group relative inline-flex shrink-0 items-center ${bigTabs ? "gap-2.5 text-[clamp(30px,8.4vw,52px)] lg:text-[clamp(36px,3vw,56px)]" : "gap-1.5 text-[clamp(17px,1.9vw,32px)]"} pb-2 font-display leading-none tracking-[-0.03em] whitespace-nowrap transition-[color,opacity] duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest ${
                      on ? "text-forest" : "text-transparent opacity-50 [-webkit-text-stroke:1px_var(--color-forest)] hover:opacity-100"
                    }`}
                  >
                    <CropIcon id={CROP_ICONS[c.id]} className={`shrink-0 object-contain ${bigTabs ? "size-[1.05em] lg:size-11" : "size-5 lg:size-7"}`} />
                    <span>{c.label}</span>
                    <span
                      aria-hidden
                      className={`absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-lime transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        on ? "origin-left scale-x-100" : "origin-right scale-x-0"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div id="tm-panel" role="tabpanel" aria-labelledby={`tm-tab-${crop.id}`} className="mt-[clamp(20px,4svh,48px)]">
            <div className="relative mx-auto w-full max-w-[calc(56svh*1.786)]">
              {/* O mostrador. É desenho: a leitura acessível é o resumo abaixo. */}
              <div aria-hidden className="relative aspect-[1000/560]">
                <span className="tm-glow pointer-events-none absolute size-[42%] -translate-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(183,199,62,0.38),rgba(183,199,62,0.1)_55%,transparent)]" />

                <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="absolute inset-0 size-full overflow-visible" fill="none">
                  {/* As fileiras de dentro, que correm com a safra. */}
                  <g className="tm-rows">
                    <path d={arcPath(0, 1, ARC.r - 110)} className="stroke-forest/15" strokeWidth="1.5" strokeDasharray="1 11" strokeLinecap="round" />
                    <path d={arcPath(0, 1, ARC.r - 190)} className="stroke-forest/10" strokeWidth="1.5" strokeDasharray="1 14" strokeLinecap="round" />
                  </g>

                  <path d={arcPath(0, 1)} className="stroke-forest/15" strokeWidth="2" />
                  {TICKS.map((t, i) => {
                    const major = i % 4 === 0;
                    const [x1, y1] = onArc(t, ARC.r + 10).map((n) => fix(n));
                    const [x2, y2] = onArc(t, ARC.r + (major ? 26 : 18)).map((n) => fix(n));
                    return (
                      <line
                        key={t}
                        data-at={t}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        strokeWidth={major ? 2 : 1.5}
                        className="tm-tick stroke-forest/20 transition-[stroke] duration-300 [&.is-on]:stroke-forest/70"
                      />
                    );
                  })}

                  {/* O trecho que cada nota cobre: faixa lima, desenhada com a passada. */}
                  {crop.spans
                    .filter((s) => s.from !== s.to)
                    .map((s) => {
                      const a = crop.marks[s.from].at;
                      const b = crop.marks[s.to].at;
                      return (
                        <path
                          key={`${crop.id}-${s.note}`}
                          d={arcPath(a, b)}
                          data-from={a}
                          data-to={b}
                          pathLength={1}
                          strokeDasharray="1 1"
                          strokeDashoffset={1}
                          strokeWidth="16"
                          strokeLinecap="round"
                          className="tm-span stroke-lime opacity-0"
                        />
                      );
                    })}

                  <path d={arcPath(0, 1)} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1} strokeWidth="3" className="tm-trail stroke-forest" />

                  {crop.marks.map((mark, i) => {
                    const [x, y] = onArc(mark.at).map((n) => fix(n));
                    const single = crop.spans.some((s) => s.from === i && s.to === i);
                    return (
                      <Fragment key={`${crop.id}-${i}`}>
                        {single && (
                          <g data-i={i} className="tm-halo group opacity-0 transition-opacity duration-500 [&.is-on]:opacity-100">
                            <circle cx={x} cy={y} r="26" strokeWidth="3" className="stroke-lime" />
                            <circle
                              cx={x}
                              cy={y}
                              r="26"
                              strokeWidth="2"
                              className="origin-center stroke-lime [transform-box:fill-box] group-[.is-on]:animate-ping"
                            />
                          </g>
                        )}
                        <g data-i={i} transform={`translate(${x} ${y})`} className="tm-burst">
                          <circle className="tm-ring stroke-lime opacity-0" r="12" strokeWidth="2.5" />
                          {DROPS.map((_, k) => (
                            <circle key={k} className="tm-drop fill-lime opacity-0" r={k % 3 ? 4 : 6} />
                          ))}
                        </g>
                        <g data-i={i} data-at={mark.at} className="tm-node group">
                          <circle
                            cx={x}
                            cy={y}
                            r={mark.minor ? 8 : 12}
                            strokeWidth="3"
                            className="fill-cream stroke-forest transition-[fill] duration-500 group-[.is-on]:fill-lime"
                          />
                        </g>
                      </Fragment>
                    );
                  })}

                  {/* A passada. */}
                  <line className="tm-needle stroke-forest/40" strokeWidth="1.5" strokeDasharray="3 5" />
                  <g className="tm-pass">
                    <circle r="24" strokeWidth="1.5" strokeDasharray="3 4" className="stroke-forest/50" />
                    <circle r="10" className="fill-forest" />
                    <circle r="4" className="fill-lime" />
                  </g>
                </svg>

                {/* Os nomes dos estágios, por fora do arco. */}
                {crop.marks.map((mark, i) => {
                  if (!mark.code) return null;
                  const a = Math.PI * (1 - mark.at);
                  const [x, y] = onArc(mark.at, ARC.r + 44);
                  return (
                    <span
                      key={`${crop.id}-${i}`}
                      data-i={i}
                      className="tm-label absolute font-display text-[clamp(13px,1.7vw,30px)] leading-none tracking-[-0.02em] whitespace-nowrap text-forest/30 transition-colors duration-500 [&.is-on]:text-forest"
                      style={{
                        left: `${fix((x / VIEW.w) * 100)}%`,
                        top: `${fix((y / VIEW.h) * 100)}%`,
                        transform: `translate(${fix(-50 + 50 * Math.cos(a))}%, ${fix(-50 - 50 * Math.sin(a))}%)`,
                      }}
                    >
                      {mark.code}
                    </span>
                  );
                })}

                {/* As pontas da safra. */}
                <p className={`${eyebrow} absolute top-[97%] left-[8%] -translate-x-1/2 text-[9px] text-forest/45`}>{ends[0]}</p>
                <p className={`${eyebrow} absolute top-[97%] right-[8%] translate-x-1/2 text-[9px] text-forest/45`}>{ends[1]}</p>
              </div>

              {/* O centro: um painel por estágio, empilhados no mesmo lugar. No
                  celular a foto sobe para dentro da tigela do arco, e o texto
                  fica logo abaixo da base dele. */}
              <div
                aria-hidden
                className="mt-[calc(-1*min(25svh,46vw)-4px)] grid text-center lg:absolute lg:inset-x-[17%] lg:top-[24%] lg:bottom-[16%] lg:mt-0"
              >
                <div data-i={-1} className="tm-say col-start-1 row-start-1 flex flex-col items-center justify-end" key={`${crop.id}-intro`}>
                  <p className={`tm-meta ${eyebrow} text-[10px] text-moss`}>{timing.cropLabel}</p>
                  <p className={`mt-2 font-display ${nameSize(crop.label)} leading-[0.9] tracking-[-0.05em] text-transparent [-webkit-text-stroke:1.5px_var(--color-forest)]`}>
                    <Roll text={crop.label} />
                  </p>
                  <p className={`tm-meta ${microCaps} mt-2 text-[10px] text-forest/60`}>{timing.hint} →</p>
                </div>
                {crop.marks.map((mark, i) => {
                  const big = mark.display || mark.code;
                  const stageTitleSize = big.length > 6 ? "text-[length:clamp(30px,min(4vw,6svh),64px)]" : "text-[length:clamp(44px,min(6vw,9svh),90px)]";
                  const drawing = art[crop.id];
                  const sprite = drawing && !Array.isArray(drawing) ? (drawing as Exclude<StageArt, readonly string[]>) : null;
                  const still = Array.isArray(drawing) ? (drawing as readonly string[])[i] : null;
                  const left = sprite?.cuts[i] ?? 0;
                  const width = sprite ? sprite.cuts[i + 1] - left : 0;
                  return (
                    <div
                      key={`${crop.id}-${i}`}
                      data-i={i}
                      className="tm-say invisible col-start-1 row-start-1 flex flex-col items-center justify-end"
                    >
                      <div className="tm-photo relative mb-2 flex h-[min(25svh,46vw)] w-[min(72vw,360px)] items-center justify-center lg:h-[clamp(160px,24svh,280px)] lg:w-[min(38vw,400px)]">
                        {sprite ? (
                          <div className="relative h-full shrink-0 overflow-hidden" style={{ aspectRatio: width / sprite.height }}>
                            <Image
                              src={sprite.src}
                              alt=""
                              fill
                              sizes="1280px"
                              className="object-cover"
                              style={{
                                objectPosition: `${(left / (sprite.width - width)) * 100}% center`,
                                maskImage: crop.id === "fruit" ? [
                                  "linear-gradient(to right, black 0%, black 92%, transparent 100%)",
                                  "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
                                  "linear-gradient(to right, transparent 0%, black 8%, black 100%)",
                                ][i] : undefined,
                              }}
                            />
                          </div>
                        ) : still ? (
                          <Image src={still} alt="" fill sizes="(min-width: 1024px) 400px, 72vw" className="object-contain" />
                        ) : null}
                      </div>
                      <p className={`tm-meta ${eyebrow} text-[10px] text-moss`}>
                        {timing.pass} {String(i + 1).padStart(2, "0")} / {total}
                      </p>
                      <p
                        className={`mt-2 font-display leading-[0.9] tracking-[-0.05em] ${stageTitleSize}`}
                      >
                        <Roll text={big} />
                      </p>
                      <p className={`tm-meta ${microText} mt-3 max-w-[34ch] text-forest/70`}>{noteFor(i)}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* A dose da cultura, convertida da ficha, em cima do resumo. */}
            <p className="mt-[clamp(24px,5svh,56px)] text-center">
              <span className={`${eyebrow} text-[10px] text-moss`}>{timing.rateLabel}</span>
              <span className="ml-3 font-display text-[clamp(17px,1.4vw,22px)] tracking-[-0.01em] text-forest">{crop.rate}</span>
            </p>
            <p className="mx-auto mt-2 min-h-[4.2em] max-w-[62ch] text-center font-display text-[clamp(15px,1.2vw,19px)] leading-[1.4] tracking-[-0.01em] text-forest/80">
              {crop.summary}
            </p>
          </div>
        </div>

        {/* A íris da troca de cultura: fixa na tela, por cima até do cabeçalho. */}
        {portal &&
          createPortal(
            <div
              ref={veil}
              aria-hidden
              className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-forest px-4 text-center text-cream"
              style={{ clipPath: "circle(0px at 50% 50%)" }}
            >
              <div
                ref={veilWord}
                className="flex max-w-full flex-col items-center justify-center gap-[0.18em] font-display text-[clamp(52px,13vw,240px)] leading-none tracking-[-0.05em] opacity-0"
                style={{ fontSize: timing.crops[veilIndex].label.length > 10 ? "clamp(40px,7vw,130px)" : undefined }}
              >
                <span>{timing.crops[veilIndex].label}</span>
                <CropIcon id={CROP_ICONS[timing.crops[veilIndex].id]} loading="eager" className="size-[clamp(58px,0.7em,112px)] shrink-0 object-contain" />
              </div>
            </div>,
            portal,
          )}
      </div>

      {children}
    </section>
  );
}
