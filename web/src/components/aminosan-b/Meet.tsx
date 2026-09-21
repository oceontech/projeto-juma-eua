"use client";

import { useEffect, useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SplitLines } from "@/components/motion/SplitLines";
import { Mark, microCaps } from "./ui";

/* O vídeo do derramamento, fatiado em quadros (ver public/video/aminosan-b/
   pour). Uma sequência de imagens num canvas, e não um <video> com
   currentTime: o seek de vídeo trava no Safari e dá solavancos em qualquer
   lugar sem um quadro-chave por quadro. */
const FRAMES = 120;
const frameSrc = (i: number) => `/video/aminosan-b/pour/${String(i + 1).padStart(3, "0")}.webp`;

/* Ponto de foco da cena ao recortar em retrato: entre o rótulo e o jorro. */
const FOCUS_X = 0.52;

/* No desktop a cena não cobre a tela: o produto fica menor e com ar em
   volta, como na referência, e as bordas do quadro somem no fundo por uma
   máscara. O fundo da seção repete as cores das bordas do vídeo — mais
   claro acima da linha d'água, mais fundo abaixo. */
const DESKTOP_ZOOM = 0.74;

/* Em retrato a cena cobrindo a tela ficaria enorme; ela ocupa uma faixa no
   meio, 1,9 vez a largura da janela, recortada no ponto de foco. */
const MOBILE_WIDTH = 1.9;

/* Onde cada ponto pousa no desktop — alternando os lados, como na referência. */
const SPOTS = [
  "lg:top-[34%] lg:left-[4%]",
  "lg:top-[46%] lg:right-[4%]",
  "lg:top-[64%] lg:left-[4%]",
  "lg:top-[76%] lg:right-[4%]",
];

/**
 * "Meet Aminosan®": a cena presa na tela e o vídeo tocado pelo scroll — a
 * bombona inclina, derrama na água do tanque e a calda se abre em nuvem
 * abaixo da linha d'água. Os quatro passos aparecem no compasso do vídeo.
 * No celular os passos se revezam no pé da cena, um de cada vez.
 */
export function Meet() {
  const { meet } = useContent().aminosanB;
  const scope = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const frames = useRef<HTMLImageElement[]>([]);
  const current = useRef(0);

  /* Desenha o quadro `i` cobrindo o canvas, como um object-fit: cover. Se o
     quadro ainda não chegou, usa o carregado mais próximo abaixo dele. */
  const draw = (i: number) => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    let img: HTMLImageElement | undefined;
    for (let k = i; k >= 0 && !img; k--) {
      const f = frames.current[k];
      if (f?.complete && f.naturalWidth) img = f;
    }
    if (!img) return;
    const { width: w, height: h } = el;
    const wide = window.innerWidth >= 1024;
    const scale = wide
      ? Math.max(w / img.naturalWidth, h / img.naturalHeight) * DESKTOP_ZOOM
      : (w / img.naturalWidth) * MOBILE_WIDTH;
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    const dx = wide ? (w - dw) / 2 : Math.min(0, Math.max(w - dw, w / 2 - dw * FOCUS_X));
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, dx, (h - dh) / 2 + h * (wide ? 0.06 : -0.02), dw, dh);
  };

  /* Carrega a sequência quando a seção se aproxima, não na abertura da
     página: são alguns MB que o hero não precisa. */
  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        frames.current = Array.from({ length: FRAMES }, (_, i) => {
          const img = new Image();
          img.decoding = "async";
          img.onload = () => {
            if (i === 0 || i === current.current) draw(current.current);
          };
          img.src = frameSrc(i);
          return img;
        });
      },
      { rootMargin: "150% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* O canvas acompanha o tamanho da cena, em pixels do aparelho. */
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(el.clientWidth * dpr);
      el.height = Math.round(el.clientHeight * dpr);
      draw(current.current);
    };
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean };
          const points = gsap.utils.toArray<HTMLElement>(".mz-point");
          const playhead = { frame: 0 };

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: ".mz-stage",
              start: "top top",
              end: "+=320%",
              scrub: 0.5,
              pin: true,
              anticipatePin: 1,
            },
          });

          tl.to(
            playhead,
            {
              frame: FRAMES - 1,
              ease: "none",
              duration: 4,
              onUpdate: () => {
                const i = Math.round(playhead.frame);
                if (i === current.current) return;
                current.current = i;
                draw(i);
              },
            },
            0,
          );

          points.forEach((point, i) => {
            const at = 0.2 + i * 0.95;
            tl.fromTo(point, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, at);
            tl.fromTo(
              point.querySelector(".mz-rule"),
              { scaleX: 0 },
              { scaleX: 1, duration: 0.45, ease: "power2.out" },
              at,
            );
            if (i < points.length - 1) {
              /* No celular os passos dividem o mesmo lugar: o anterior sai
                 inteiro. No desktop ele fica, esmaecido, como na referência. */
              tl.to(point, { opacity: desktop ? 0.4 : 0, y: desktop ? 0 : -20, duration: 0.3 }, at + 0.8);
            }
          });
        },
      );

      mm.add("(prefers-reduced-motion: reduce)", () => {
        current.current = FRAMES - 1;
        draw(FRAMES - 1);
        gsap.set(".mz-point", { opacity: 1 });
      });

      /* A sequência chega aos poucos; depois de cada remedida, redesenha. */
      const redraw = () => draw(current.current);
      ScrollTrigger.addEventListener("refresh", redraw);
      return () => ScrollTrigger.removeEventListener("refresh", redraw);
    },
    { scope },
  );

  return (
    <section id="meet" ref={scope} data-nav-theme="dark" className="bg-[linear-gradient(180deg,#5E7249_0%,#50653C_52%,#3A4F25_64%,#2F4319_100%)] text-cream">
      <div className="mz-stage relative h-[100svh] overflow-hidden">
        <canvas
          ref={canvas}
          aria-hidden
          className="absolute inset-0 h-full w-full [mask-image:linear-gradient(180deg,transparent_23%,#000_32%,#000_66%,transparent_75%)] lg:[mask-image:radial-gradient(ellipse_38%_40%_at_50%_56%,#000_55%,transparent_97%)]"
        />
        {/* Assenta o texto sem apagar a cena: um véu leve nas bordas. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(40,56,30,0.5)_0%,transparent_32%,transparent_68%,rgba(40,56,30,0.5)_100%)] lg:hidden"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[34%] bg-[linear-gradient(180deg,rgba(40,56,30,0.55),transparent)]"
        />

        <div className="wrap relative pt-[clamp(88px,12svh,130px)]">
          <SplitLines className="text-[clamp(40px,5vw,96px)] leading-[0.95] tracking-[-0.035em]">{meet.heading}</SplitLines>
          <p className={`${microCaps} mt-4 max-w-[40ch] text-cream/85`}>{meet.intro}</p>
        </div>

        <ol>
          {meet.points.map((point, i) => (
            <li
              key={point.n}
              className={`mz-point absolute inset-x-[var(--spacing-gut)] bottom-[7%] rounded-sm bg-[rgba(40,56,30,0.55)] p-4 opacity-0 backdrop-blur-[2px] lg:inset-x-auto lg:bottom-auto lg:w-[300px] lg:bg-transparent lg:p-0 lg:backdrop-blur-none ${SPOTS[i]}`}
            >
              <Mark className="text-lime" />
              <span aria-hidden className="mz-rule mt-4 block h-px w-full origin-left bg-cream/50" />
              <p className="mt-4 font-display text-[12px] tracking-[0.16em] text-lime">{point.n}</p>
              <h3 className="mt-1 text-[clamp(24px,2vw,32px)] leading-[1.05] tracking-[-0.02em]">{point.title}</h3>
              <p className={`${microCaps} mt-3 max-w-[34ch] text-cream/90`}>{point.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
