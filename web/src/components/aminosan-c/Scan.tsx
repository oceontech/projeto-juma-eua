"use client";

import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { booted } from "@/lib/boot";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { FORMS } from "@/lib/scan/forms";
import {
  buildScan,
  createScan,
  project,
  type Scan as Field,
  type ScanUniforms,
} from "@/lib/scan/field";

/**
 * A cena da LP C: a fotografia do produto sendo escaneada.
 *
 * O texto do hero some, a imagem dá um zoom curto e **ela própria** se
 * fragmenta — os pontos são uma grade sobre a foto e leem a cor da textura,
 * então o que se desmancha é a fotografia, não uma cópia dela (ver
 * `lib/scan/field.ts`). Dali em diante a nuvem passa por quatro leituras: a
 * unidade, a cadeia, as unidades livres e a folha.
 *
 * A moldura é de instrumento: grade de fundo, cantoneiras, painel de leitura,
 * régua de progresso e chamadas penduradas em pontos do desenho. As chamadas
 * são DOM, não canvas — elas acompanham o giro porque `project()` refaz em JS
 * a mesma conta do shader.
 */

const NARROW = "(max-width: 860px)";
const TWO_COLUMN = "(min-width: 1024px)";

/* A grade sobre a foto. Cada célula vira uma partícula, então isto é a
   contagem: 560×344 são 193 mil pontos. Parece muito, e é justamente o ponto
   — abaixo disso a célula fica grande e a imagem em repouso vira mosaico em
   vez de fotografia, que é o contrário do que a cena promete. */
const GRID = { wide: [560, 344], narrow: [260, 190] } as const;

/** Onde cada leitura começa e quanto dura, em fração da cena. */
const MORPH = [0.03, 0.28, 0.51, 0.74];
const RUN = 0.19;
const TEXT_IN = MORPH.map((at) => at + 0.05);

const uniforms = (): ScanUniforms => ({
  phase: 0,
  opacity: 1,
  tone: 0,
  zoom: 1,
  stagger: 0.55,
  sweep: 0.85,
  scatter: 0,
  cell: 3.4,
  dot: 2.1,
  keep: 0.13,
  drift: 1100,
  spin: 0.22,
  focal: 1400,
  cover: [1, 1],
  coverOffset: [0, 0],
  shapeScale: 1,
  shapeOffset: [0, 0],
  /* Ciano de instrumento, do escuro ao alto. */
  inkLow: [0.1, 0.33, 0.36],
  ink: [0.66, 0.98, 0.94],
  /* Esta versão não destaca nada e aproxima pelo centro da foto. */
  focus: [0, 0],
  accent: [0, 0, 0],
  accent2: [0, 0, 0],
  mark: 0,
  square: 0,
  flow: 0,
});

/** `object-fit: cover` em números, para a nuvem cair onde a foto cairia. */
function cover(imgW: number, imgH: number, w: number, h: number, posY: number) {
  const scale = Math.max(w / imgW, h / imgH);
  const dw = imgW * scale;
  const dh = imgH * scale;
  return {
    size: [dw, dh] as [number, number],
    offset: [0, -(h - dh) * (posY - 0.5)] as [number, number],
  };
}

export function Scan() {
  const { hero, stages } = useContent().aminosanC;
  const scope = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      const surface = canvas.current;
      const stage = root?.querySelector<HTMLElement>(".sc-stage");
      if (!root || !surface || !stage) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { animate } = context.conditions as { animate: boolean };
          if (!animate) {
            root.classList.add("sc-still");
            ScrollTrigger.refresh();
            return;
          }

          const u = uniforms();
          const narrow = window.matchMedia(NARROW).matches;
          let field: Field | null = null;
          let alive = true;
          let visible = true;
          let inView = true;
          let timeline: gsap.core.Timeline | null = null;
          let aspect = 2752 / 1536;
          /* Qual leitura está em cena, para mover só as chamadas dela. */
          const shown = { stage: -1 };

          const calls = gsap.utils.toArray<HTMLElement>(".sc-call");

          const fit = () => {
            if (!field) return;
            const w = stage.clientWidth;
            const h = stage.clientHeight;
            field.resize(w, h, Math.min(window.devicePixelRatio || 1, 2));
            const box = cover(aspect * 1000, 1000, w, h, 1);
            u.cover = box.size;
            u.coverOffset = box.offset;
            /* A célula acompanha o tamanho da foto na tela: é o que mantém a
               grade fechando a imagem em qualquer largura. */
            const grid = narrow ? GRID.narrow : GRID.wide;
            u.cell = (box.size[0] / grid[0]) * 1.22;
            const columns = window.matchMedia(TWO_COLUMN).matches;
            u.shapeScale = columns
              ? Math.min(w * 0.4, h * 0.6)
              : Math.min(w * 0.78, h * 0.4);
            /* No desktop a amostra sai do meio: a coluna de leitura fica à
               esquerda e as chamadas precisam de ar dos dois lados. */
            u.shapeOffset = columns ? [w * 0.17, h * 0.02] : [0, h * 0.22];
            u.dot = columns ? 2.4 : 2;
          };

          /* ------------------------------------------------- o quadro */

          const tick = (time: number) => {
            if (!field || !visible) return;
            field.render(u, time);

            /* As chamadas da leitura em cena acompanham o giro. Só elas: as
               outras estão invisíveis e mexer nelas seria trabalho jogado. */
            const i = shown.stage;
            if (i < 0) return;
            const anchors = FORMS[i].anchors;
            const w = stage.clientWidth / 2;
            const h = stage.clientHeight / 2;
            for (let k = 0; k < anchors.length; k++) {
              const el = calls[i * 3 + k];
              if (!el) continue;
              const [x, y, depth] = project(anchors[k].at, u, time);
              el.style.transform = `translate3d(${w + x}px, ${h + y}px, 0)`;
              el.style.setProperty(
                "--depth",
                String(gsap.utils.clamp(0.45, 1, depth)),
              );
            }
          };

          const io = new IntersectionObserver(
            ([entry]) => {
              inView = entry.isIntersecting;
              visible = inView && !document.hidden;
            },
            {
              rootMargin: "20% 0px",
            },
          );
          io.observe(root);
          const onVisibility = () => {
            /* Duas fontes, guardadas à parte: ao voltar para a aba, a cena
               precisa saber se continua na tela. Numa flag só, esconder a aba
               a zerava e voltar não a religava — a cena ficava travada. */
            visible = inView && !document.hidden;
          };
          const ro = new ResizeObserver(fit);
          ro.observe(stage);

          /* -------------------------------------------- a linha do tempo */

          const build = (): gsap.core.Timeline => {
            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: stage,
                start: "top top",
                end: "+=760%",
                scrub: 0.7,
                pin: true,
                anticipatePin: 1,
                /* A cena é a primeira da página mas é criada por último, depois
                   do véu e da textura. Sem prioridade o ScrollTrigger mede as
                   outras seções antes de existir o espaçador deste pin. */
                refreshPriority: 1,
              },
            });

            /* 1. O texto do hero sai e a imagem se aproxima de leve. */
            tl.to(
              ".sc-open",
              { opacity: 0, y: -18, duration: 0.035, stagger: 0.006 },
              0,
            )
              .to(u, { zoom: 1.13, duration: 0.16, ease: "power1.inOut" }, 0)
              /* 2. A varredura desce e a foto se desfaz por onde ela passa. */
              .fromTo(
                ".sc-sweep",
                { opacity: 0 },
                { opacity: 1, duration: 0.01 },
                0.015,
              )
              .fromTo(
                ".sc-sweep",
                { "--sweep": 0 },
                { "--sweep": 1, duration: 0.11 },
                0.02,
              )
              .to(".sc-sweep", { opacity: 0, duration: 0.02 }, 0.13)
              /* 3. A cor passa para a grafia do instrumento, e a moldura acende. */
              .to(u, { tone: 1, duration: 0.1, ease: "power1.inOut" }, 0.04)
              .to(u, { scatter: 90, duration: 0.05 }, 0.02)
              .to(u, { scatter: 42, duration: 0.14 }, 0.08)
              .fromTo(
                ".sc-hud",
                { opacity: 0 },
                { opacity: 1, duration: 0.04 },
                0.1,
              );

            MORPH.forEach((at, i) => {
              tl.to(u, { phase: i + 1, duration: RUN, ease: "none" }, at);
              tl.call(
                () => {
                  shown.stage = i;
                },
                undefined,
                TEXT_IN[i],
              );
              tl.fromTo(
                `.sc-read[data-i="${i}"]`,
                { opacity: 0, y: 22 },
                { opacity: 1, y: 0, duration: 0.035, ease: "power2.out" },
                TEXT_IN[i],
              );
              tl.fromTo(
                `.sc-call[data-i="${i}"]`,
                { opacity: 0 },
                { opacity: 1, duration: 0.03, stagger: 0.008 },
                TEXT_IN[i] + 0.015,
              );
              if (i < MORPH.length - 1) {
                tl.to(
                  `.sc-read[data-i="${i}"], .sc-call[data-i="${i}"]`,
                  { opacity: 0, duration: 0.025, ease: "power2.in" },
                  MORPH[i + 1],
                );
              }
            });

            /* A régua de progresso enche continuamente com a cena. */
            tl.fromTo(
              ".sc-bar",
              { scaleX: 0 },
              { scaleX: 1, duration: 0.92 },
              0.04,
            );
            tl.to({}, { duration: 0.05 }, 0.95);

            ScrollTrigger.refresh();
            return tl;
          };

          /* ------------------------------------------------- a nuvem */

          void (async () => {
            await booted;
            if (!alive) return;
            timeline = build();
            try {
              const src = narrow
                ? "/img/aminosan-b/hero-bg-mobile.webp"
                : "/img/aminosan-b/hero-bg.webp";
              const photo = await loadImage(src);
              if (!alive) return;
              aspect = photo.naturalWidth / photo.naturalHeight;
              const grid = narrow ? GRID.narrow : GRID.wide;
              const data = buildScan(
                grid[0],
                grid[1],
                FORMS.map((f) => f.points),
              );
              field = createScan(surface, photo, data);
              if (!field) {
                root.classList.add("sc-still");
                timeline?.scrollTrigger?.kill();
                timeline?.kill();
                timeline = null;
                return;
              }
              fit();
              /* A nuvem já é a foto: a imagem de HTML sai de cena assim que o
                 canvas assume, e o leitor não vê a troca porque as duas
                 mostram exatamente o mesmo quadro. */
              gsap.to(".sc-plate", {
                opacity: 0,
                duration: 0.5,
                ease: "power2.out",
              });
            } catch {
              if (alive) root.classList.add("sc-still");
            }
          })();

          gsap.ticker.add(tick);
          document.addEventListener("visibilitychange", onVisibility);
          ScrollTrigger.addEventListener("refresh", fit);

          return () => {
            alive = false;
            gsap.ticker.remove(tick);
            document.removeEventListener("visibilitychange", onVisibility);
            ScrollTrigger.removeEventListener("refresh", fit);
            io.disconnect();
            ro.disconnect();
            timeline?.scrollTrigger?.kill();
            timeline?.kill();
            timeline = null;
            field?.dispose();
            field = null;
          };
        },
      );
    },
    { scope },
  );

  return (
    <section ref={scope} className="sc relative bg-[#04090B] text-[#CFE6E3]">
      <div className="sc-stage relative h-[100svh] min-h-[620px] overflow-hidden">
        {/* A foto de verdade, só até o canvas assumir — ela é o LCP. Um
            `<picture>` como no resto do site: só ele escolhe o arquivo pela
            largura da tela e baixa um só, e é o mesmo par de arquivos que a
            textura da nuvem usa, então as duas mostram o mesmo quadro. */}
        <picture className="sc-plate absolute inset-0">
          <source media={NARROW} srcSet="/img/aminosan-b/hero-bg-mobile.webp" />
          <img
            src="/img/aminosan-b/hero-bg.webp"
            alt={hero.alt}
            width={2752}
            height={1536}
            fetchPriority="high"
            className="size-full object-cover object-bottom"
          />
        </picture>

        <canvas
          ref={canvas}
          aria-hidden
          className="absolute inset-0 z-[1] block size-full"
        />

        {/* A grade e a vinheta do instrumento. */}
        <div
          aria-hidden
          className="sc-grid pointer-events-none absolute inset-0 z-[2]"
        />
        <div
          aria-hidden
          className="sc-vignette pointer-events-none absolute inset-0 z-[2]"
        />
        <div
          aria-hidden
          className="sc-sweep pointer-events-none absolute inset-x-0 top-0 z-[3] opacity-0"
        />

        {/* A abertura, sobre a foto inteira. */}
        <div className="absolute inset-0 z-[5] flex flex-col justify-end p-[clamp(20px,4vw,56px)]">
          <p className="sc-open sc-tag">{hero.tag}</p>
          <h1 className="sc-open mt-4 text-[clamp(40px,6vw,104px)] leading-[0.94] tracking-[-0.035em] text-white">
            {hero.heading.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </h1>
          <p className="sc-open mt-5 max-w-[46ch] text-[clamp(14px,1.05vw,17px)] leading-[1.5] text-[#A9C6C3]">
            {hero.body}
          </p>
          <p className="sc-open sc-tag mt-8 flex items-center gap-3">
            <span
              aria-hidden
              className="block h-7 w-px animate-pulse bg-[#5FD0C0]"
            />
            {hero.scroll}
          </p>
        </div>

        {/* A moldura do instrumento, que acende quando a leitura começa. */}
        <div
          aria-hidden
          className="sc-hud pointer-events-none absolute inset-0 z-[4] opacity-0"
        >
          <span className="sc-corner sc-corner--tl" />
          <span className="sc-corner sc-corner--tr" />
          <span className="sc-corner sc-corner--bl" />
          <span className="sc-corner sc-corner--br" />
          <div className="sc-rule absolute inset-x-[clamp(20px,4vw,56px)] bottom-[clamp(20px,4vw,56px)]">
            <span className="sc-bar" />
          </div>
        </div>

        {/* As chamadas, penduradas em pontos do desenho. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[6]">
          {stages.map((s, i) =>
            s.callouts.map((c, k) => (
              <div
                key={`${s.id}-${c.label}`}
                data-i={i}
                className="sc-call"
                style={{ ["--side" as string]: FORMS[i].anchors[k]?.side ?? 1 }}
              >
                <span className="sc-ring" />
                <span className="sc-lead" />
                <span className="sc-tagbox">
                  <span className="sc-call-label">{c.label}</span>
                  <span className="sc-call-note">{c.note}</span>
                </span>
              </div>
            )),
          )}
        </div>

        {/* O painel de leitura: um por etapa, no mesmo lugar. */}
        <div className="sc-panel absolute inset-x-0 bottom-[clamp(52px,8vw,92px)] z-[7] px-[clamp(20px,4vw,56px)] lg:inset-x-auto lg:bottom-auto lg:top-1/2 lg:left-[clamp(20px,4vw,56px)] lg:w-[min(38vw,440px)] lg:-translate-y-1/2 lg:px-0">
          {/* As quatro leituras ocupam o mesmo lugar, uma por vez. A altura é
              reservada para nada saltar na troca. */}
          <div className="sc-slots relative min-h-[clamp(250px,32svh,330px)]">
            {stages.map((s, i) => (
              <article
                key={s.id}
                data-i={i}
                className="sc-read absolute inset-x-0 bottom-0 opacity-0 lg:bottom-auto lg:top-0"
              >
                <p className="sc-tag flex items-center gap-3">
                  <span className="sc-id">{s.id}</span>
                  {s.kicker}
                </p>
                <h2 className="mt-4 max-w-[17ch] text-[clamp(26px,2.9vw,46px)] leading-[1.02] tracking-[-0.03em] text-white text-balance">
                  {s.heading}
                </h2>
                <p className="mt-4 max-w-[44ch] text-[clamp(13px,1vw,16px)] leading-[1.55] text-[#93B3B0]">
                  {s.body}
                </p>
                {/* Na tela estreita não há margem para pendurar chamadas no
                    desenho: elas viram uma lista aqui, com o mesmo texto. */}
                <ul className="mt-5 grid gap-2 lg:hidden">
                  {s.callouts.map((c) => (
                    <li
                      key={c.label}
                      className="flex gap-3 text-[12px] leading-[1.35]"
                    >
                      <span
                        aria-hidden
                        className="mt-[6px] block size-1.5 shrink-0 rounded-full bg-[#7FE7D2]"
                      />
                      <span>
                        <span className="sc-tag text-[10px] text-[#CFF6EE]">
                          {c.label}
                        </span>
                        <span className="mt-0.5 block text-[#6F918E]">
                          {c.note}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>

                <dl className="mt-6 grid max-w-[340px] grid-cols-3 gap-px border border-[#153036] bg-[#153036]">
                  {s.readout.map((r) => (
                    <div key={r.k} className="bg-[#061114] px-3 py-2.5">
                      <dt className="sc-tag text-[9px] text-[#4E7C7A]">
                        {r.k}
                      </dt>
                      <dd className="mt-1 font-display text-[13px] tracking-[0.04em] text-[#7FE7D2]">
                        {r.v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`scan: falhou ao carregar ${src}`));
    img.src = src;
  });
}
