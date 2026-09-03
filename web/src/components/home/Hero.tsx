"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { hero } from "@/content/home";

/**
 * Hero — o palco em proporção fixa (1920 × 2297, a moldura do Figma) mantém
 * céu, bandeiras, trator e plantação alinhados entre si em qualquer largura.
 * A geometria vive em globals.css (.hero-stage e filhas); aqui fica só o
 * movimento.
 *
 * Duas animações:
 *   1. entrada — tagline, título e subtítulo sobem ao carregar;
 *   2. parallax — as camadas do fundo andam em velocidades diferentes
 *      conforme a página rola, o que dá profundidade sem 3D.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { animate } = context.conditions as { animate: boolean };
          if (!animate) return;

          gsap
            .timeline()
            .fromTo("[data-hero-tagline]", { opacity: 0, y: 18 }, { opacity: 1, y: 0 })
            .fromTo("[data-hero-title]", { opacity: 0, y: 28 }, { opacity: 1, y: 0 }, "-=0.5")
            .fromTo("[data-hero-sub]", { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, "-=0.5");

          /* Parallax: cada camada anda uma fração do scroll. O trator anda
             menos que as bandeiras porque está "mais perto" da câmera. */
          const layers: Array<[string, number]> = [
            ["[data-hero-sky]", -60],
            ["[data-hero-flag]", -110],
            ["[data-hero-tractor]", -40],
          ];

          layers.forEach(([selector, distance]) => {
            gsap.to(selector, {
              y: distance,
              ease: "none",
              scrollTrigger: {
                trigger: root.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });
          });
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-[#C9DCEA]">
      <div className="hero-stage">
        <Image
          data-hero-sky
          className="hero-sky"
          src="/img/hero-sky.jpg"
          alt=""
          width={1600}
          height={1505}
          priority
        />
        <Image
          data-hero-flag
          className="hero-flag hero-flag--br"
          src="/img/hero-flag-br.webp"
          alt=""
          width={573}
          height={424}
        />
        <Image
          data-hero-flag
          className="hero-flag hero-flag--us"
          src="/img/hero-flag-us.webp"
          alt=""
          width={608}
          height={431}
        />
        {/* next/image marca .svg como unoptimized sozinho — o vetor é servido
            como está, sem passar pelo otimizador. */}
        <Image
          className="hero-rays"
          src="/img/hero-light-rays.svg"
          alt=""
          width={1920}
          height={321}
        />
        <Image
          data-hero-tractor
          className="hero-tractor"
          src="/img/hero-tractor.webp"
          alt={hero.tractorAlt}
          width={1440}
          height={1373}
          priority
        />
        <div className="hero-field">
          <Image
            src="/img/hero-plantation.webp"
            alt=""
            width={1144}
            height={1375}
          />
        </div>
      </div>

      <div className="absolute top-[12.5%] left-1/2 z-5 w-[min(785px,calc(100%-2*var(--spacing-gut)))] -translate-x-1/2 text-center min-[861px]:top-[8.3%]">
        <p
          data-hero-tagline
          className="mb-[clamp(14px,1.7vw,30px)] font-display text-[clamp(9px,0.65vw,12.4px)] tracking-[0.39em] text-muted uppercase"
        >
          {hero.tagline}
        </p>
        <h1 data-hero-title className="text-h1 leading-none tracking-[-0.01em] text-ink">
          {hero.headline}
        </h1>
        <p
          data-hero-sub
          className="mx-auto mt-[clamp(16px,1.6vw,30px)] max-w-[646px] text-muted"
        >
          {hero.subheadline}
        </p>
      </div>
    </section>
  );
}
