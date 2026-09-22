"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { booted } from "@/lib/boot";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { Cta, microCaps } from "./ui";

/**
 * Hero da LP B, sobre o mesmo vídeo do hero da LP A — a bombona pousa no
 * campo, a câmera entra pela boca dela e mergulha entre as moléculas até o
 * clarão —, sem a camada do rótulo que a A sobrepõe e com os textos da B.
 *
 * O vídeo vive como quadros num canvas (tirados dos mesmos arquivos da A,
 * 16:9 e 9:16). A abertura toca sozinha até a bombona pousar, quando o
 * preloader sai; dali em diante a cena fica presa e o vídeo anda com o
 * scroll, com uma segunda parada na molécula — igual à da A: o quadro
 * congela, a chapa (o fundo com a molécula apagada) e o recorte da molécula
 * sobem por cima dele, e o recorte cresce e fica em órbita enquanto o texto
 * da parada está no ar.
 */

const SETS = {
  /* `mol` é o quadro da segunda parada — o mesmo das chapas da A: o 182 do
     arquivo a 30 qps, 91 aqui a 15; no 9:16, o 178, 89 aqui. */
  /* AVIF na resolução nativa nas telas largas; webp a 900 no celular, que
     decodifica rápido o bastante para trocar de quadro a cada gesto. */
  wide: { dir: "/video/aminosan-b/hero/wide", count: 131, stop: 20, mol: 91, ext: "avif" },
  tall: { dir: "/video/aminosan-b/hero/tall", count: 108, stop: 17, mol: 89, ext: "webp" },
} as const;

type Set = (typeof SETS)[keyof typeof SETS];

/* O mesmo corte da A para escolher a montagem 9:16 — é ele que decide qual
   jogo de chapas o CSS mostra, então a sequência precisa seguir o mesmo. */
const TALL = "(max-width: 860px) and (orientation: portrait)";

/* Duração da abertura, em segundos: a da montagem original até a parada. */
const INTRO = 1.3;

/* Linha do tempo do scroll, em unidades dela: o trecho até a molécula, a
   parada, e o trecho até o clarão. */
const TO_MOL = 1.2;
const HOLD = 1;
const TO_END = 0.8;

/* A rota da fermentação em três marcas: a proteína (cadeia fechada), a
   enzima cortando uma ligação, e o aminoácido solto. */
const STEP_MARK = [
  <g key="protein" fill="none" stroke="currentColor" strokeWidth="1.25">
    <path d="M4.6 17.8 10 11.6l5.2 5.4 5.6-6.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="10" cy="11.6" r="2" />
    <circle cx="15.2" cy="17" r="2" />
    <circle cx="4.6" cy="17.8" r="2" fill="currentColor" stroke="none" />
    <circle cx="21.6" cy="9.8" r="2.4" fill="currentColor" stroke="none" />
  </g>,
  <g key="enzyme" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
    <circle cx="6.5" cy="14" r="2.3" />
    <circle cx="21.5" cy="14" r="2.3" />
    <path d="M8.8 14h3.2M16 14h3.2" />
    <path d="m12.6 8.4 2.8 11.2M15.4 8.4l-2.8 11.2" />
  </g>,
  <g key="amino" fill="none" stroke="currentColor" strokeWidth="1.25">
    <circle cx="14" cy="14" r="3.4" fill="currentColor" stroke="none" />
    <path d="M14 10.6V6.8M11 15.8l-3.3 1.9M17 15.8l3.3 1.9" strokeLinecap="round" />
    <circle cx="14" cy="5" r="1.8" />
    <circle cx="6.2" cy="18.6" r="1.8" />
    <circle cx="21.8" cy="18.6" r="1.8" />
  </g>,
];

export function Hero() {
  const { hero, molecule } = useContent().aminosanB;
  const scope = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const set = useRef<Set>(SETS.wide);
  const frames = useRef<(HTMLImageElement | null)[]>([]);
  const current = useRef(-1);

  const draw = (i: number) => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    /* O padrão do canvas amplia com a interpolação mais barata; o quadro
       quase sempre é esticado para a tela, e é aí que ele borrava. */
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const ready = (k: number) => {
      const f = frames.current[k];
      return f && f.complete && f.naturalWidth ? f : null;
    };
    let img: HTMLImageElement | null = null;
    for (let d = 0; d < set.current.count && !img; d++) img = ready(i - d) ?? ready(i + d);
    if (!img) return;
    const { width: w, height: h } = el;
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  };

  /* A sequência do aparelho; a abertura (até a parada) é esperada, o resto
     chega em segundo plano. */
  const load = () => {
    set.current = window.matchMedia(TALL).matches ? SETS.tall : SETS.wide;
    const { dir, count, ext } = set.current;
    frames.current = Array.from({ length: count }, () => null);
    return Promise.all(
      Array.from({ length: count }, (_, i) => i).map((i) => {
        const img = new window.Image();
        img.decoding = "async";
        img.src = `${dir}/${String(i + 1).padStart(3, "0")}.${ext}`;
        frames.current[i] = img;
        return i <= set.current.stop ? img.decode().catch(() => undefined) : undefined;
      }),
    );
  };

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(el.clientWidth * dpr);
      el.height = Math.round(el.clientHeight * dpr);
      if (current.current >= 0) draw(current.current);
    };
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      const scene = scope.current;
      if (!scene) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(".hb-title", { type: "lines", mask: "lines" });
        /* Duas cabeças de leitura: a da abertura e a do scroll. Enquanto o
           scroll não saiu do zero, vale a abertura; assim que ele anda — até
           no meio dela —, vale o scroll, e as duas nunca disputam o quadro. */
        const head = { intro: 0, scroll: 0 };
        let scrolled = false;
        const render = () => {
          const i = Math.round(scrolled ? head.scroll : head.intro);
          if (i === current.current) return;
          current.current = i;
          draw(i);
        };

        gsap.set(split.lines, { yPercent: 110 });
        gsap.set([".hb-aside > *", ".hb-record > *"], { opacity: 0, y: 24 });

        /* A abertura espera o preloader e os quadros dela. Se os quadros
           demorarem, o texto entra mesmo assim sobre o poster, que já é o
           quadro da parada. */
        let alive = true;
        let intro: gsap.core.Timeline | undefined;
        const framesReady = Promise.race([load(), new Promise((r) => setTimeout(r, 2500))]);
        void Promise.all([booted, framesReady]).then(() => {
          if (!alive) return;
          const { stop } = set.current;
          const canPlay = frames.current.slice(0, stop + 1).every((f) => f?.complete && f.naturalWidth);
          intro = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.4 } });
          head.intro = canPlay ? 0 : stop;
          render();
          gsap.set(canvas.current, { opacity: 1 });
          if (canPlay) {
            intro.to(head, { intro: stop, duration: INTRO, ease: "power1.out", onUpdate: render }, 0);
          }
          intro
            .to(split.lines, { yPercent: 0, stagger: 0.12 }, canPlay ? INTRO * 0.55 : 0.1)
            .to(".hb-aside > *", { opacity: 1, y: 0, stagger: 0.08, duration: 1 }, canPlay ? INTRO * 0.8 : 0.4)
            .to(".hb-record > *", { opacity: 1, y: 0, stagger: 0.06, duration: 0.9 }, canPlay ? INTRO : 0.6);
        });

        /* ------------------------------------------------ a parada da molécula */
        /* As chapas do jogo desta tela (o CSS tira o outro do ar). */
        const tall = window.matchMedia(TALL).matches;
        const layer = (name: string) =>
          scene.querySelector<HTMLElement>(`[data-hb='${name}${tall ? "-tall" : ""}']`);
        const plate = layer("plate");
        const cutout = layer("cutout");
        const orbit = layer("orbit");
        const content = scene.querySelector<HTMLElement>("[data-hb='molecule-content']");

        /* A órbita da A: giro curto e vaivém nos dois eixos, em períodos
           próximos mas diferentes — lê como um objeto que paira, não como um
           balanço. Começa no meio do caminho, então liga sem salto. */
        let breathing: gsap.core.Tween[] = [];
        const swing = (prop: "rotation" | "x" | "y", amp: number, period: number) => {
          const tween = gsap.fromTo(
            orbit,
            { [prop]: -amp },
            { [prop]: amp, duration: period / 2, ease: "sine.inOut", yoyo: true, repeat: -1 },
          );
          tween.progress(0.5);
          breathing.push(tween);
        };

        /* O texto da parada: cortina por linha e rota montando de cima para
           baixo, como na A. Toca na ida e volta ao contrário na saída. */
        const molText = gsap
          .timeline({ paused: true })
          .fromTo(content, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "power2.out" }, 0)
          .fromTo("[data-hb-line]", { yPercent: 112 }, { yPercent: 0, duration: 0.72, stagger: 0.1, ease: "power4.out" }, 0)
          .fromTo(
            "[data-hb-step]",
            { opacity: 0, x: 26, scale: 0.94, transformOrigin: "0% 50%" },
            { opacity: 1, x: 0, scale: 1, duration: 0.56, stagger: 0.09, ease: "power3.out" },
            0.16,
          )
          .fromTo("[data-hb-step-link]", { scaleY: 0 }, { scaleY: 1, duration: 0.3, stagger: 0.09, ease: "power2.out" }, 0.3);

        let raised = false;
        const raise = () => {
          if (raised || !plate || !cutout || !orbit) return;
          raised = true;
          /* A chapa e o recorte são o próprio quadro em que o vídeo parou:
             entram sem transição, e só depois o recorte cresce e orbita. */
          gsap.set([plate, cutout], { autoAlpha: 1 });
          gsap.set(orbit, { rotation: 0, x: 0, y: 0 });
          gsap.fromTo(cutout, { scale: 1 }, { scale: 1.04, duration: 1.2, ease: "power2.out", overwrite: true });
          swing("rotation", 1.2, 12);
          swing("x", 9, 9.5);
          swing("y", 7, 8);
          molText.timeScale(1).play();
        };
        const drop = () => {
          if (!raised || !plate || !cutout || !orbit) return;
          raised = false;
          breathing.forEach((t) => t.kill());
          breathing = [];
          molText.timeScale(2.2).reverse();
          /* O recuo: volta ao repouso — escala 1, sem órbita — e só então as
             chapas saem, idênticas ao quadro que o canvas mostra por baixo. */
          gsap.to(cutout, { scale: 1, duration: 0.22, ease: "power2.inOut", overwrite: true });
          gsap.to(orbit, {
            rotation: 0,
            x: 0,
            y: 0,
            duration: 0.22,
            ease: "power2.inOut",
            overwrite: true,
            onComplete: () => {
              if (!raised) gsap.set([plate, cutout], { autoAlpha: 0 });
            },
          });
        };

        /* O vídeo anda com o scroll, com a cena presa: o texto da abertura sai
           no começo, a câmera entra na bombona e para na molécula; depois
           segue até o clarão, que abre para a seção seguinte. */
        const scrub = gsap.timeline({
          scrollTrigger: {
            trigger: scene,
            start: "top top",
            end: "+=340%",
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const was = scrolled;
              scrolled = self.progress > 0.001;
              if (was !== scrolled) render();
            },
          },
          onUpdate: () => {
            /* A parada vale enquanto a linha do tempo está dentro dela, com
               uma margem curta nas pontas para o quadro já ter assentado. */
            const t = scrub.time();
            if (t > TO_MOL + 0.04 && t < TO_MOL + HOLD - 0.04) raise();
            else drop();
          },
        });
        scrub
          .fromTo(
            head,
            { scroll: () => set.current.stop },
            { scroll: () => set.current.mol, ease: "power1.inOut", duration: TO_MOL, onUpdate: render, immediateRender: false },
            0,
          )
          .to({}, { duration: HOLD }, TO_MOL)
          .fromTo(
            head,
            { scroll: () => set.current.mol },
            {
              scroll: () => set.current.count - 1,
              ease: "power1.in",
              duration: TO_END,
              onUpdate: render,
              immediateRender: false,
            },
            TO_MOL + HOLD,
          )
          .to(".hb-title", { yPercent: -30, opacity: 0, ease: "power1.in", duration: 0.22 }, 0)
          .to(".hb-aside", { yPercent: -20, opacity: 0, ease: "power1.in", duration: 0.2 }, 0.02)
          .to(".hb-record-bar", { opacity: 0, ease: "power1.in", duration: 0.15 }, 0)
          .to(".hb-shade", { opacity: 0, ease: "none", duration: 0.3 }, 0.05);

        return () => {
          alive = false;
          intro?.kill();
          molText.kill();
          breathing.forEach((t) => t.kill());
          split.revert();
        };
      });

      /* Sem movimento: a cena fica no quadro da parada, com o texto. */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        void load().then(() => {
          current.current = set.current.stop;
          draw(set.current.stop);
          gsap.set(canvas.current, { opacity: 1 });
        });
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      data-nav-theme="dark"
      className="relative flex h-[100svh] min-h-[640px] flex-col overflow-hidden bg-white text-cream"
    >
      {/* Poster: o quadro da parada, 16:9 ou 9:16 — o mesmo corte das chapas.
          O canvas assume por cima quando a sequência chega. */}
      <div className="absolute inset-0">
        <Image
          src="/img/aminosan-b/hero-field.webp"
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="aminosan-hero-cut--wide object-cover"
        />
        <Image
          src="/img/aminosan-b/hero-field-tall.webp"
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="aminosan-hero-cut--tall object-cover"
        />
        <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full opacity-0" />

        {/* As chapas da parada da molécula, as mesmas da A: o fundo com a
            molécula apagada e o recorte dela. O de fora leva a escala; a
            imagem de dentro, a órbita. */}
        <Image
          data-hb="plate"
          src="/img/aminosan/hero-molecule-plate.webp"
          alt=""
          fill
          sizes="100vw"
          aria-hidden
          className="aminosan-hero-plate aminosan-hero-cut--wide invisible opacity-0"
        />
        <Image
          data-hb="plate-tall"
          src="/img/aminosan/hero-molecule-plate-mobile.webp"
          alt=""
          fill
          sizes="100vw"
          aria-hidden
          className="aminosan-hero-plate aminosan-hero-cut--tall invisible opacity-0"
        />
        <div data-hb="cutout" aria-hidden className="aminosan-hero-cutout aminosan-hero-cut--wide invisible opacity-0">
          <Image
            data-hb="orbit"
            src="/img/aminosan/hero-molecule-cutout.webp"
            alt=""
            fill
            sizes="100vw"
            className="aminosan-hero-molecule-orbit"
          />
        </div>
        <div data-hb="cutout-tall" aria-hidden className="aminosan-hero-cutout aminosan-hero-cut--tall invisible opacity-0">
          <Image
            data-hb="orbit-tall"
            src="/img/aminosan/hero-molecule-cutout-mobile.webp"
            alt=""
            fill
            sizes="100vw"
            className="aminosan-hero-molecule-orbit"
          />
        </div>
      </div>

      {/* Leitura do texto: o céu do quadro é claro, então o topo e o canto do
          título escurecem, e o pé também, para a faixa de registro. Sai com o
          scroll, quando a cena entra nas moléculas. */}
      <div
        aria-hidden
        className="hb-shade pointer-events-none absolute inset-0 z-[4] bg-[linear-gradient(180deg,rgba(16,32,22,0.72)_0%,rgba(16,32,22,0.32)_30%,rgba(16,32,22,0.05)_52%,rgba(16,32,22,0.55)_82%,rgba(16,32,22,0.88)_100%)] lg:bg-[radial-gradient(ellipse_70%_60%_at_10%_12%,rgba(16,32,22,0.72),transparent_70%),radial-gradient(ellipse_42%_55%_at_92%_48%,rgba(16,32,22,0.55),transparent_75%),linear-gradient(180deg,rgba(16,32,22,0.45)_0%,rgba(16,32,22,0.05)_40%,rgba(16,32,22,0.1)_70%,rgba(16,32,22,0.85)_100%)]"
      />

      <div className="wrap relative z-[5] flex flex-1 flex-col pt-[clamp(96px,14svh,150px)]">
        <h1 className="hb-title text-[clamp(46px,7.4vw,140px)] leading-[0.92] tracking-[-0.035em]">
          {hero.heading.map((line) => (
            <span key={line} className="block whitespace-nowrap">
              {line}
            </span>
          ))}
        </h1>

        <div className="hb-aside mt-auto mb-8 max-w-[340px] self-end lg:absolute lg:top-[40%] lg:right-0 lg:mb-0">
          <h2 className="text-[clamp(24px,2.2vw,38px)] leading-[1.05] tracking-[-0.02em]">
            {hero.aside.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          {/* No celular a bombona ocupa o meio da cena: o parágrafo sai e o
              bloco desce para baixo dela, só com o título e o botão. */}
          <p className={`${microCaps} mt-4 text-cream/85 max-lg:hidden`}>{hero.aside.body}</p>
          <Cta href={hero.aside.cta.href} className="mt-6">
            {hero.aside.cta.label}
          </Cta>
        </div>
      </div>

      <div className="hb-record-bar relative z-[5] border-t border-cream/20">
        <div className="hb-record wrap flex items-center gap-x-10 overflow-x-auto py-5 whitespace-nowrap [scrollbar-width:none] lg:justify-between lg:py-6 [&::-webkit-scrollbar]:hidden">
          <p className={`${microCaps} text-lime`}>{hero.record.label}</p>
          {hero.record.items.map((item) => (
            <p key={item} className="font-display text-[13px] tracking-[-0.01em] text-cream/85 lg:text-[15px]">
              {item}
            </p>
          ))}
        </div>
      </div>

      {/* O texto da parada da molécula — a mesma montagem da A: texto à
          esquerda, a coluna do meio vazia para a molécula, e a rota à
          direita. No celular, introdução no topo, reforço e rota no pé. */}
      <div data-hb="molecule-content" className="invisible absolute inset-0 z-[6] opacity-0">
        <div className="aminosan-hero-molecule-wrap flex h-full flex-col justify-between gap-[clamp(20px,3vh,36px)] px-gut pt-[clamp(88px,13vh,132px)] pb-[clamp(26px,5vh,58px)] max-lg:justify-start lg:grid lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)_minmax(0,360px)] lg:items-center lg:gap-[clamp(16px,2vw,48px)] lg:py-16">
          <div className="aminosan-hero-molecule-copy max-w-[520px]">
            <div className="aminosan-hero-molecule-intro">
              <div className="overflow-hidden">
                <p data-hb-line className="font-display text-[10px] font-bold tracking-[0.25em] text-lime uppercase">
                  {molecule.eyebrow}
                </p>
              </div>
              <div className="mt-3 overflow-hidden lg:mt-4">
                <h2 data-hb-line className="text-h2 leading-[1.02] text-white max-lg:text-[clamp(24px,6.5vw,29px)]">
                  {molecule.heading}
                </h2>
              </div>
              <div className="mt-3 overflow-hidden lg:mt-6">
                <p
                  data-hb-line
                  className="text-[clamp(12px,3.4vw,14px)] leading-[1.5] text-white/72 lg:text-[clamp(14px,1vw,17px)] lg:leading-[1.65]"
                >
                  {molecule.body}
                </p>
              </div>
            </div>
            <div className="aminosan-hero-molecule-callout mt-4 overflow-hidden max-lg:!mt-auto lg:mt-4">
              <p
                data-hb-line
                className="text-[clamp(12px,3.4vw,14px)] leading-[1.45] font-bold text-white lg:text-[clamp(14px,1vw,17px)] lg:leading-[1.6]"
              >
                {molecule.callout}
              </p>
            </div>
          </div>

          <div aria-hidden className="hidden lg:block" />

          <div className="flex flex-col max-lg:grid max-lg:grid-cols-3 max-lg:gap-2">
            {molecule.steps.map((step, index) => (
              <Fragment key={step.label}>
                {index > 0 && <span data-hb-step-link aria-hidden className="aminosan-step-link" />}
                <article data-hb-step className="aminosan-step-card max-lg:flex-col max-lg:items-start">
                  <span aria-hidden className="aminosan-step-card-icon">
                    <svg viewBox="0 0 28 28" className="size-[62%]" aria-hidden>
                      {STEP_MARK[index]}
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-[clamp(12px,0.95vw,15px)] font-bold tracking-[0.12em] text-white uppercase">
                      {step.label}
                    </p>
                    <p className="mt-0.5 text-[clamp(10px,0.72vw,12px)] tracking-[0.08em] text-lime/85 max-lg:hidden">
                      {step.note}
                    </p>
                  </div>
                </article>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
