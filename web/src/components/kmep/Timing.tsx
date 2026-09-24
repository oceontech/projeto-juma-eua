"use client";

import Image from "next/image";
import { Fragment, useLayoutEffect, useRef, useState } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { SplitLines } from "@/components/motion/SplitLines";
import { gsap, useGSAP } from "@/lib/gsap";
import { eyebrow, fix, microCaps } from "./ui";

/* O arco da safra: meio círculo com o plantio à esquerda e a colheita à
   direita, no viewBox 1000 × 560. */
const ARC = { cx: 500, cy: 520, r: 420 };
const VIEW = { w: 1000, h: 560 };
const TICKS = Array.from({ length: 41 }, (_, i) => i / 40);
const CORN_STAGE_IMAGES = ["/img/kmep/corn-v4.webp", "/img/kmep/corn-v6.webp", "/img/kmep/corn-ear.webp"];
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
 * K13 — quando entra. A safra vira um mostrador: um arco do plantio à
 * colheita, preso ao scroll, que a passada atravessa como o sol atravessa o
 * dia. Em cada estágio ela para, o estágio acende com as gotas da calda e o
 * centro troca de letra em letra. O trecho que a nota do rótulo cobre ganha a
 * faixa lima; o estágio isolado (a formação da espiga) ganha o anel que pulsa.
 *
 * A troca de cultura passa por uma íris: o verde abre a partir do botão, a
 * cena troca por baixo e a íris se fecha dentro da passada — que continua no
 * mesmo ponto da safra.
 *
 * A régua é ordinal, como antes: marca os estágios do rótulo 2026 da Juma, sem
 * fingir escala de dias. O mostrador é desenho; a leitura acessível é a frase
 * de resumo embaixo dele, que é a copy do canônico.
 *
 * Dose e embalagem dependem de P4 e P1 — a ficha diz a frase honesta, e o
 * TODO fica no conteúdo.
 */
export function Timing() {
  const { timing } = useContent().kmep;
  const [active, setActive] = useState(0);
  const crop = timing.crops[active];
  const scope = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const veilWord = useRef<HTMLSpanElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const tablist = useRef<HTMLDivElement>(null);
  const live = useRef<Live>({ p: 0, shown: -2, lit: -1 });
  const motion = useRef(false);
  /* A íris está no meio do gesto: fechada sobre a cena, esperando a troca. */
  const busy = useRef(false);
  const covered = useRef(false);

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
          live.current.shown = -2;

          if (!animate) {
            live.current.p = 1;
            draw(root, live.current, 1, true);
            return;
          }

          const state = { p: 0 };
          gsap.fromTo(
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
              scrollTrigger: { trigger: ".tm-stage", start: "top top", end: "+=260%", scrub: 0.6, pin: true, anticipatePin: 1 },
            },
          );
          live.current.p = 0;
          draw(root, live.current, 1, true);

          /* A ficha: a bombona sobe endireitando, os anéis abrem e os fios
             das duas notas se desenham até ela. */
          gsap
            .timeline({ scrollTrigger: { trigger: ".tm-spec", start: "top 85%", end: "center 55%", scrub: 0.8 } })
            .fromTo(".tm-jug", { y: 90, rotate: -8, scale: 0.86 }, { y: 0, rotate: 0, scale: 1, ease: "power2.out" }, 0)
            .fromTo(".tm-orbit", { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.12, ease: "power2.out" }, 0)
            .fromTo(".tm-call", { opacity: 0, x: (i: number) => (i ? 48 : -48) }, { opacity: 1, x: 0, ease: "power2.out" }, 0.2)
            .fromTo(".tm-lead", { scaleX: 0 }, { scaleX: 1, ease: "power2.inOut" }, 0.45)
            .fromTo(".tm-dot", { scale: 0 }, { scale: 1, ease: "back.out(3)" }, 0.8);
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

    if (!covered.current || !stage.current || !veil.current) return;
    covered.current = false;
    const s = stage.current.getBoundingClientRect();
    const m = root.querySelector(".tm-pass")?.getBoundingClientRect();
    const at = m ? `${m.left + m.width / 2 - s.left}px ${m.top + m.height / 2 - s.top}px` : "50% 50%";
    const radius = Math.hypot(s.width, s.height);
    gsap.to(veilWord.current, { opacity: 0, scale: 1.06, duration: 0.35, ease: "power2.in" });
    gsap.fromTo(
      veil.current,
      { clipPath: `circle(${radius}px at ${at})` },
      {
        clipPath: `circle(0px at ${at})`,
        duration: 0.9,
        delay: 0.1,
        ease: "expo.inOut",
        onComplete: () => void (busy.current = false),
      },
    );
    const say = root.querySelector(`.tm-say[data-i="${live.current.shown}"]`);
    if (say) enter(say, 1, 0.45);
    for (let i = 0; i <= live.current.lit; i++) burst(root, i, 0.55 + i * 0.12);
  }, [active]);

  function choose(i: number, from: HTMLElement | null) {
    if (i === active || busy.current) return;
    const s = stage.current?.getBoundingClientRect();
    if (!motion.current || !s || !from || !veil.current) {
      setActive(i);
      return;
    }
    busy.current = true;
    const b = from.getBoundingClientRect();
    const at = `${b.left + b.width / 2 - s.left}px ${b.top + b.height / 2 - s.top}px`;
    if (veilWord.current) {
      veilWord.current.textContent = timing.crops[i].label;
      veilWord.current.style.fontSize = timing.crops[i].label.length > 10 ? "clamp(40px,7vw,130px)" : "";
    }
    gsap.fromTo(
      veil.current,
      { clipPath: `circle(0px at ${at})` },
      {
        clipPath: `circle(${Math.hypot(s.width, s.height)}px at ${at})`,
        duration: 0.65,
        ease: "power3.in",
        onComplete: () => {
          covered.current = true;
          setActive(i);
        },
      },
    );
    gsap.fromTo(veilWord.current, { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 0.8, delay: 0.25, ease: "expo.out" });
  }

  const noteFor = (i: number) => crop.spans.find((s) => i >= s.from && i <= s.to)?.note ?? "";
  const total = String(crop.marks.length).padStart(2, "0");
  const ends = crop.ends ?? timing.ends;

  return (
    <section ref={scope} className="relative bg-cream text-forest">
      <div className="wrap pt-sec">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-end lg:gap-16">
          <SplitLines className="text-[clamp(44px,5.6vw,108px)] leading-[0.93] tracking-[-0.04em]">{timing.heading}</SplitLines>
          <p className={`${microCaps} text-[12px] text-forest/75`}>{timing.body}</p>
        </div>
      </div>

      <div ref={stage} className="tm-stage relative flex min-h-[100svh] flex-col justify-start overflow-hidden pt-[clamp(80px,12svh,110px)] pb-[clamp(28px,6svh,64px)] lg:justify-center lg:py-[clamp(28px,6svh,64px)]">
        <div className="wrap">
          {/* O alternador: as culturas em corpo grande, a apagada só no contorno, centradas na tela. */}
          <div className="flex flex-col items-center text-center">
            <p className={`${eyebrow} text-[10px] text-moss`}>{timing.cropLabel}</p>
            {/* Onze culturas: no desktop quebram em duas linhas centradas; no
                celular correm numa faixa só, com rolagem lateral. */}
            <div
              ref={tablist}
              role="tablist"
              aria-label={timing.cropLabel}
              className="relative mt-3 flex w-full max-w-[1180px] items-baseline gap-x-[clamp(16px,2vw,34px)] gap-y-2 overflow-x-auto px-4 [scrollbar-width:none] max-lg:[mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] lg:flex-wrap lg:justify-center lg:overflow-visible [&::-webkit-scrollbar]:hidden"
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
                    className={`group relative shrink-0 pb-2 font-display text-[clamp(22px,2.1vw,36px)] leading-none tracking-[-0.03em] whitespace-nowrap transition-[color,opacity] duration-500 ${
                      on ? "text-forest" : "text-transparent opacity-50 [-webkit-text-stroke:1px_var(--color-forest)] hover:opacity-100"
                    }`}
                  >
                    {c.label}
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

              {/* O centro: um painel por estágio, empilhados no mesmo lugar. */}
              <div
                aria-hidden
                className={`grid text-center lg:absolute lg:inset-x-[17%] lg:mt-0 ${crop.id === "corn" ? "mt-8 lg:top-[24%] lg:bottom-[3%]" : "mt-12 lg:bottom-[9%]"}`}
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
                  const stageTitleSize = crop.id === "corn"
                    ? big.length > 6 ? "text-[length:clamp(30px,min(4vw,6svh),64px)]" : "text-[length:clamp(44px,min(6vw,9svh),90px)]"
                    : big.length > 6 ? "text-[length:clamp(34px,min(5.4vw,8.5svh),96px)]" : "text-[length:clamp(56px,min(11vw,17svh),170px)]";
                  return (
                    <div
                      key={`${crop.id}-${i}`}
                      data-i={i}
                      className="tm-say invisible col-start-1 row-start-1 flex flex-col items-center justify-end"
                    >
                      {crop.id === "corn" && (
                        <div className="tm-photo relative mb-2 h-[clamp(170px,25svh,290px)] w-[min(72vw,360px)] lg:h-[clamp(190px,29svh,320px)] lg:w-[min(38vw,400px)]">
                          <Image
                            src={CORN_STAGE_IMAGES[i]}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 400px, 72vw"
                            className="object-contain"
                          />
                        </div>
                      )}
                      <p className={`tm-meta ${eyebrow} text-[10px] text-moss`}>
                        {timing.pass} {String(i + 1).padStart(2, "0")} / {total}
                      </p>
                      <p
                        className={`mt-2 font-display leading-[0.9] tracking-[-0.05em] ${stageTitleSize}`}
                      >
                        <Roll text={big} />
                      </p>
                      <p className={`tm-meta ${microCaps} mt-3 max-w-[34ch] text-[10px] text-forest/70`}>{noteFor(i)}</p>
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

        {/* A íris da troca de cultura. */}
        <div
          ref={veil}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-forest text-cream"
          style={{ clipPath: "circle(0px at 50% 50%)" }}
        >
          <span ref={veilWord} className="font-display text-[clamp(64px,13vw,240px)] leading-none tracking-[-0.05em] opacity-0" />
        </div>
      </div>

      {/* A ficha: dose e embalagem de um lado, mistura do outro, a bombona no meio. */}
      <div className="wrap pb-sec">
        <div className="tm-spec relative mt-[clamp(56px,8vw,120px)] grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(220px,300px)_minmax(0,1fr)] lg:gap-0">
          {timing.details.map((detail, i) => (
            <div
              key={detail.k}
              className={`tm-call flex items-center gap-6 ${i === 0 ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-3 lg:row-start-1 lg:flex-row-reverse"}`}
            >
              <div className={`flex-1 border-t border-forest/20 pt-4 lg:border-0 lg:pt-0 ${i === 0 ? "lg:text-right" : ""}`}>
                <p className={`${eyebrow} text-[10px] text-moss`}>
                  0{i + 1} · {detail.k}
                </p>
                <p className="mt-3 font-display text-[clamp(18px,1.5vw,24px)] leading-[1.25] tracking-[-0.01em]">{detail.v}</p>
              </div>
              {/* z-10: as linhas e os pontos precisam ficar por cima dos anéis do
                  centro, que giram e por vezes avançam sobre esta borda. */}
              <span aria-hidden className="relative z-10 hidden h-px w-[clamp(40px,5vw,96px)] shrink-0 lg:block">
                <span className={`tm-lead absolute inset-0 bg-forest/40 ${i === 0 ? "origin-left" : "origin-right"}`} />
                <span
                  className={`tm-dot absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-lime ring-2 ring-forest ${
                    i === 0 ? "right-0 translate-x-[85%]" : "left-0 -translate-x-[85%]"
                  }`}
                />
              </span>
            </div>
          ))}

          <div className="relative order-first mx-auto aspect-square w-[min(260px,66vw)] lg:order-none lg:col-start-2 lg:row-start-1 lg:w-full">
            {/* Os dois anéis: incompletos e grossos, um preto e um vermelho, girando
                em sentidos opostos e em velocidades diferentes — o gesto de uma
                embalagem em giro, não de um alvo perfeito. */}
            <span aria-hidden className="tm-orbit absolute inset-[4%]">
              <svg viewBox="0 0 100 100" className="size-full origin-center animate-spin motion-reduce:animate-none [animation-duration:14s]">
                <circle cx="50" cy="50" r="44" fill="none" strokeWidth="4" strokeLinecap="round" strokeDasharray="205 285" className="stroke-night" />
              </svg>
            </span>
            <span aria-hidden className="tm-orbit absolute inset-[13%]">
              <svg
                viewBox="0 0 100 100"
                className="size-full origin-center animate-spin motion-reduce:animate-none [animation-direction:reverse] [animation-duration:20s]"
              >
                <circle cx="50" cy="50" r="40" fill="none" strokeWidth="5.5" strokeLinecap="round" strokeDasharray="150 264" className="stroke-kmep" />
              </svg>
            </span>
            <span aria-hidden className="tm-orbit absolute inset-[20%] rounded-full bg-[radial-gradient(closest-side,rgba(183,199,62,0.35),transparent)]" />
            <div className="tm-jug absolute inset-[6%]">
              <Image
                src="/img/pack-kmep-us.webp"
                alt={timing.jugAlt}
                fill
                sizes="(min-width: 1024px) 300px, 260px"
                className="object-contain drop-shadow-[0_24px_30px_rgba(22,38,27,0.25)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
