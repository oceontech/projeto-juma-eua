"use client";

import Image from "next/image";
import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { SplitLines } from "@/components/motion/SplitLines";
import { BOTTLE, bottlePosition } from "@/lib/bottle-sprite";
import { gsap, useGSAP } from "@/lib/gsap";
import { eyebrow, microCaps } from "./ui";

/* O frasco de 1988 virando o de hoje: os 73 quadros do vídeo, em grade (a
   mesma sprite da Home — ver lib/bottle-sprite.ts para como foi gerada). */
const SPRITE = BOTTLE.src;
const FRAMES = BOTTLE.frames;
const FROM = BOTTLE.from;

/**
 * A régua única da cena: o progresso do scroll em que cada marco fica ativo.
 * Frasco, ano, fio e marcos saem todos dela, então não há como um andar
 * fora do compasso do outro.
 *
 *   0 → 0,16   anos 80: o frasco velho, o ano parado em 1988
 *   0,16       1988: a empresa
 *   0,16 → 0,8 o frasco se transforma e o ano conta até o corrente, enquanto
 *              o cursor desce pelo fio de 1988 até "hoje"
 *   0,8        hoje
 *   0,93       agora, nos EUA — segura até o fim da trava
 */
const KEYS = [0, 0.16, 0.8, 0.93];
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/* O trecho em que o cursor desce junto com os anos (1988 → hoje). Nos
   outros, ele descansa no marco em que chegou e só no fim do trecho desliza
   até o próximo — assim, parado, ele fica sempre em cima de um ponto. */
const COUNTING = 1;
const REST = 0.55;
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Onde o cursor está, em "índice de marco": 0 no primeiro, 3 no último. */
function cursorAt(p: number) {
  for (let i = KEYS.length - 2; i >= 0; i--) {
    if (p < KEYS[i]) continue;
    const f = clamp01((p - KEYS[i]) / (KEYS[i + 1] - KEYS[i]));
    return i + (i === COUNTING ? f : smooth(clamp01((f - REST) / (1 - REST))));
  }
  return 0;
}

/**
 * A8 — "Mais antigo que a empresa que o fabrica". O frasco de 1988,
 * enferrujado, vira o frasco de hoje quadro a quadro, preso ao scroll; o ano
 * conta junto, e a linha do tempo anda no mesmo compasso: um cursor lima
 * corre pelo fio, o fio enche até ele, e o marco em que ele para ganha o
 * destaque (os passados ficam meio apagados, os que faltam, apagados).
 *
 * O sprite tem fundo branco chapado, com a borda em 253 em vez de 255; o
 * `brightness` leva essa borda ao branco puro e o `mix-blend-multiply` o
 * dissolve no fundo do palco, sem o retângulo em volta do frasco.
 *
 * Desktop: três colunas — texto, frasco com o ano embaixo, linha do tempo
 * vertical. Celular: título centrado, o frasco grande embaixo dele e a linha
 * do tempo como régua horizontal de quatro pontos, com o texto do marco ativo
 * trocando embaixo — a cena inteira cabe na tela presa.
 */
export function Heritage() {
  const { heritage } = useContent().aminosanB;
  const scope = useRef<HTMLElement>(null);
  const last = heritage.timeline.length - 1;

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const bottles = gsap.utils.toArray<HTMLElement>(".hr-bottle", root);
      const years = gsap.utils.toArray<HTMLElement>(".hr-year", root);
      const items = gsap.utils.toArray<HTMLElement>(".hr-item", root);
      const steps = gsap.utils.toArray<HTMLElement>(".hr-step", root);
      const notes = gsap.utils.toArray<HTMLElement>(".hr-note", root);
      const rail = root.querySelector<HTMLElement>(".hr-rail");
      const fill = root.querySelector<HTMLElement>(".hr-fill");
      const cursor = root.querySelector<HTMLElement>(".hr-cursor");
      const hFill = root.querySelector<HTMLElement>(".hr-hfill");
      const hCursor = root.querySelector<HTMLElement>(".hr-hcursor");
      /* O ano do navegador basta aqui: a virada no fuso de Brasília só
         importa na Home, que mostra o ano sozinho. */
      const now = new Date().getFullYear();

      /* O centro de cada ponto no fio vertical, medido do layout real: o fio
         e o cursor param exatamente neles, seja qual for a altura dos
         textos. Medido de novo a cada mudança de tamanho. */
      let centers: number[] = [];
      const measure = () => {
        centers = items.map((item) => {
          const dot = item.querySelector<HTMLElement>(".hr-dot");
          return item.offsetTop + (dot ? dot.offsetTop + dot.offsetHeight / 2 : 0);
        });
      };
      const onResize = () => (centers = []);
      window.addEventListener("resize", onResize);

      let active = -1;
      const paint = (p: number) => {
        /* Frasco e ano andam só entre 1988 e hoje. */
        const t = clamp01((p - KEYS[1]) / (KEYS[2] - KEYS[1]));
        const frame = Math.round(t * (FRAMES - 1));
        bottles.forEach((b) => (b.style.backgroundPosition = bottlePosition(frame)));
        const year = String(Math.round(FROM + t * (now - FROM)));
        years.forEach((y) => (y.textContent = year));

        const u = cursorAt(p);
        const at = Math.min(last, Math.floor(u + 1e-3));

        /* Fio vertical: o cursor entre os centros dos dois marcos vizinhos. */
        if (rail && fill && cursor && items[0]?.offsetParent) {
          if (!centers.length) measure();
          const i = Math.min(last - 1, Math.floor(u));
          const y = centers[i] + (centers[i + 1] - centers[i]) * (u - i);
          const top = centers[0];
          rail.style.top = `${top}px`;
          rail.style.height = `${centers[last] - top}px`;
          fill.style.height = `${y - top}px`;
          cursor.style.transform = `translate(-50%, calc(${y}px - 50%))`;
        }
        /* Régua horizontal: os pontos são equidistantes. */
        if (hFill && hCursor) {
          const x = (u / last) * 100;
          hFill.style.width = `${x}%`;
          hCursor.style.left = `${x}%`;
        }

        if (at !== active) {
          active = at;
          [items, steps].forEach((list) =>
            list.forEach((el, k) => {
              el.classList.toggle("is-past", k < at);
              el.classList.toggle("is-active", k === at);
            }),
          );
          notes.forEach((note, k) => {
            gsap.killTweensOf(note);
            if (k === at) gsap.fromTo(note, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" });
            else gsap.set(note, { autoAlpha: 0 });
          });
        }
      };

      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          phone: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
          tablet: "(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop, phone, still } = ctx.conditions as { desktop: boolean; phone: boolean; still: boolean };
          centers = [];
          active = -1;
          if (still) {
            paint(1);
            return;
          }
          const state = { p: 0 };
          paint(0);
          gsap.fromTo(
            state,
            { p: 0 },
            {
              p: 1,
              ease: "none",
              onUpdate: () => paint(state.p),
              scrollTrigger:
                desktop || phone
                  ? {
                      trigger: ".hr-stage",
                      start: "top top",
                      end: phone ? "+=220%" : "+=200%",
                      scrub: 0.6,
                      pin: true,
                      anticipatePin: 1,
                      onRefresh: () => (centers = []),
                    }
                  : { trigger: ".hr-scene", start: "top 80%", end: "bottom 30%", scrub: 0.5 },
            },
          );
          gsap.fromTo(
            ".hr-founder",
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".hr-founder", start: "top 92%", once: true } },
          );
        },
      );

      return () => window.removeEventListener("resize", onResize);
    },
    { scope },
  );

  const bottle = (className: string) => (
    <div
      role="img"
      aria-label={heritage.bottleAlt}
      className={`hr-bottle relative mx-auto aspect-[508/682] bg-no-repeat mix-blend-multiply brightness-[1.03] ${className}`}
      style={{ backgroundImage: `url(${SPRITE})`, backgroundSize: `${BOTTLE.cols * 100}% ${BOTTLE.rows * 100}%`, backgroundPosition: bottlePosition(0) }}
    />
  );

  /* `stacked`: o rótulo em cima do número, os dois centrados — no celular,
     onde tudo corre num eixo só. */
  const year = (className: string, stacked = false) => (
    <p className={`flex justify-center ${stacked ? "flex-col items-center gap-1" : "items-baseline gap-3"} ${className}`}>
      <span className={`${microCaps} text-[10px] text-moss`}>{heritage.yearLabel}</span>
      <span className="hr-year font-display leading-none tracking-[-0.05em] tabular-nums">{FROM}</span>
    </p>
  );

  return (
    <section ref={scope} className="relative overflow-clip bg-white text-forest">
      {/* O fundo mora no palco, e não só na seção: o pin cria um contexto de
          empilhamento próprio, e o multiply do frasco só enxerga o fundo que
          estiver dentro dele. */}
      <div className="hr-stage flex min-h-[100svh] flex-col justify-center bg-white py-[clamp(72px,10svh,120px)] max-md:pt-[72px] max-md:pb-4">
        {/* ---------- Celular: título, frasco, ano, régua e o marco ativo. ---------- */}
        <div className="wrap flex flex-col items-center text-center md:hidden">
          <p className={`${eyebrow} text-[10px] text-moss`}>{heritage.label}</p>
          <h2 className="mt-2 text-[clamp(28px,7.8vw,36px)] leading-[1] tracking-[-0.035em] text-balance">{heritage.heading.join(" ")}</h2>

          <div className="relative mt-[2svh]">
            {bottle("h-[min(36svh,330px)]")}
          </div>
          {year("mt-2 [&_.hr-year]:text-[clamp(34px,10vw,44px)]", true)}

          {/* A régua: quatro pontos equidistantes, o fio enchendo até o cursor. */}
          <div className="relative mt-[2.4svh] w-full px-3">
            <div className="relative h-3">
              <span aria-hidden className="absolute top-1/2 right-0 left-0 h-[2px] -translate-y-1/2 bg-forest/12" />
              <span aria-hidden className="hr-hfill absolute top-1/2 left-0 h-[2px] w-0 -translate-y-1/2 bg-lime" />
              {heritage.timeline.map((item, k) => (
                <span
                  key={item.year}
                  aria-hidden
                  className="hr-step group absolute top-1/2 size-2.5 -translate-1/2 rounded-full border-2 border-forest/25 bg-white transition-colors duration-300 [&.is-active]:border-forest [&.is-active]:bg-lime [&.is-past]:border-forest/60 [&.is-past]:bg-lime/60"
                  style={{ left: `${(k / last) * 100}%` }}
                />
              ))}
              <span
                aria-hidden
                className="hr-hcursor absolute top-1/2 left-0 size-4 -translate-1/2 rounded-full bg-lime shadow-[0_0_0_5px_rgba(183,199,62,0.25),0_0_18px_rgba(183,199,62,0.7)]"
              />
            </div>
            <div className="relative mt-2.5 h-4">
              {heritage.timeline.map((item, k) => (
                <span
                  key={item.year}
                  className={`hr-step absolute top-0 font-display text-[13px] leading-none tracking-[-0.01em] whitespace-nowrap text-forest/35 transition-colors duration-300 [&.is-active]:text-forest [&.is-past]:text-forest/60 ${k === 0 ? "" : k === last ? "-translate-x-full" : "-translate-x-1/2"}`}
                  style={{ left: `${(k / last) * 100}%` }}
                >
                  {item.year}
                </span>
              ))}
            </div>
          </div>

          {/* O marco ativo: os quatro no mesmo lugar, um de cada vez. */}
          <div className="mt-[2.4svh] grid w-full">
            {heritage.timeline.map((item) => (
              <div key={item.year} className="hr-note invisible col-start-1 row-start-1">
                <p className={`${microCaps} text-[10px] text-moss`}>{item.title}</p>
                <p className="mx-auto mt-1.5 max-w-[34ch] text-[13px] leading-[1.45] text-forest/75">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Tablet e desktop: as três colunas. ---------- */}
        <div className="wrap grid gap-10 max-md:hidden lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.85fr)] lg:items-center lg:gap-[clamp(24px,3vw,56px)]">
          <div>
            <p className={`${eyebrow} text-moss`}>{heritage.label}</p>
            <SplitLines className="mt-3 text-[clamp(28px,3.6vw,68px)] leading-[0.95] tracking-[-0.04em] text-balance">
              {heritage.heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </SplitLines>
            <p className="mt-6 max-w-[46ch] text-[15px] leading-[1.6] text-forest/75">{heritage.body}</p>
            <div className="hr-founder mt-7 flex items-center gap-4">
              <Image
                src="/img/julio-matino.jpg"
                alt={heritage.founder.alt}
                width={56}
                height={56}
                className="size-14 rounded-full object-cover ring-2 ring-lime ring-offset-2 ring-offset-white"
              />
              <div>
                <p className="font-display text-[17px] leading-tight tracking-[-0.01em]">{heritage.founder.name}</p>
                <p className={`${microCaps} mt-1 text-[10px] text-forest/55`}>{heritage.founder.role}</p>
              </div>
            </div>
          </div>

          {/* O frasco e, embaixo dele, com folga, o ano. */}
          <div className="hr-scene relative mx-auto flex w-full max-w-[420px] flex-col items-center">
            {bottle("w-[min(40vw,300px)] lg:w-[min(22vw,330px,40svh)]")}
            {year("relative mt-[clamp(14px,2.4svh,28px)] [&_.hr-year]:text-[clamp(44px,4.4vw,80px)]")}
          </div>

          {/* A linha do tempo: o fio e o cursor medidos nos pontos reais. */}
          <ol className="relative grid gap-[clamp(20px,3.4svh,36px)] pl-10">
            <span aria-hidden className="hr-rail absolute left-[7px] w-[2px] -translate-x-1/2 bg-forest/10">
              <span className="hr-fill absolute inset-x-0 top-0 h-0 bg-linear-to-b from-lime/40 to-lime" />
            </span>
            <span
              aria-hidden
              className="hr-cursor pointer-events-none absolute top-0 left-[7px] z-10 size-[18px] rounded-full bg-lime shadow-[0_0_0_6px_rgba(183,199,62,0.22),0_0_22px_rgba(183,199,62,0.75)]"
            />
            {heritage.timeline.map((item) => (
              <li
                key={item.year}
                className="hr-item group relative opacity-30 transition-opacity duration-500 [&.is-active]:opacity-100 [&.is-past]:opacity-55"
              >
                <span
                  aria-hidden
                  className="hr-dot absolute top-[0.2em] -left-10 grid size-3.5 place-items-center rounded-full border-2 border-forest/25 bg-white transition-colors duration-500 group-[.is-active]:border-forest group-[.is-past]:border-forest/60 group-[.is-past]:bg-lime/70"
                />
                {/* O destaque do ativo mora no texto, e não no item: o ponto não pode
                    sair de baixo do cursor. */}
                <p className="origin-left font-display text-[clamp(22px,1.9vw,32px)] leading-none tracking-[-0.03em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-[.is-active]:scale-[1.12]">
                  {item.year}
                </p>
                <p className={`${microCaps} mt-2 text-[10px] text-moss`}>{item.title}</p>
                <p className="mt-1.5 max-w-[36ch] text-[14px] leading-[1.5] text-forest/75">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="wrap mt-[clamp(40px,7svh,88px)] max-md:hidden">
          <p className="border-t border-forest/15 pt-5 font-display text-[clamp(20px,2vw,34px)] leading-[1.1] tracking-[-0.025em] text-forest/80">
            {heritage.tagline}
          </p>
        </div>
      </div>
    </section>
  );
}
