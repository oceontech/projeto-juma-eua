"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { booted } from "@/lib/boot";
import { hero, nitrogen } from "@/content/aminosan";

const STAT_ICON = {
  years: "/img/aminosan/icon-stat-years.svg",
  company: "/img/aminosan/icon-stat-company.svg",
  fermentation: "/img/aminosan/icon-stat-fermentation.svg",
  trials: "/img/aminosan/icon-stat-trials.svg",
} as const;

/** Atraso do `scrub`, em segundos, para a folha responder com mais inércia. */
const SCRUB = 1.25;

/** Traço decorativo dos passos da cadeia de nitrogênio: rótulo + ponto + linha. */
function StepIndicator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3.5 sm:gap-4">
      <p className="shrink-0 font-display text-[clamp(15px,1.35vw,22px)] font-bold tracking-[0.08em] text-white uppercase">
        {label}
      </p>
      <div className="flex items-center flex-1">
        <span
          data-hero="nitrogen-step-dot"
          className="size-[7px] shrink-0 rounded-full border border-white/90 bg-transparent"
        />
        <span
          data-hero="nitrogen-step-line"
          className="h-px w-full origin-left bg-white/35"
        />
      </div>
    </div>
  );
}

/**
 * Hero Aminosan®
 *
 * Composição em camadas com profundidade física e parallax dinâmico:
 *
 *   Camada 1 (céu): `hero-aminosan-sky.png` no fundo ao entardecer;
 *   Camada 2 (tipografia): "AMINOSAN" monumental posicionado atrás do solo/produtos;
 *   Camada 3 (solo + produto): `hero-aminosan-ground.png` integrando o campo de melancias
 *                             e as embalagens em destaque, sobrepondo o título para relevo 3D;
 *   Camada 4 (cartões): Cartão de valor à esquerda, métricas à direita e selo inferior;
 *   Camada 5 (folha overlay): `hero-aminosan-leaf.png` subindo nítida (sem blur) com véu de contraste;
 *   Camada 6 (nitrogênio): "Nitrogen is not an amino acid" exibido sobre a folha;
 *   Camada 7 (blackout): Transição para tela toda preta ao rolar, dando entrada à próxima seção.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  /* Estado da pilha animada de estatísticas (transição automática a cada 2 segundos) */
  const [activeStatIndex, setActiveStatIndex] = useState(0);
  const [isStatSwapping, setIsStatSwapping] = useState(false);
  const totalStats = hero.stats.length;

  useEffect(() => {
    const timer = setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      setIsStatSwapping(true);
      setTimeout(() => {
        setActiveStatIndex((prev) => (prev + 1) % totalStats);
        setIsStatSwapping(false);
      }, 450);
    }, 2000);

    return () => clearInterval(timer);
  }, [totalStats]);

  /* Cálculo de estilo de camada (stacked deck) para cada card da pilha */
  const getStatCardStyle = (index: number) => {
    const pos = (index - activeStatIndex + totalStats) % totalStats;

    if (isStatSwapping) {
      if (pos === 0) {
        // Card que estava na frente desliza para cima/fora e diminui para passar para trás
        return {
          zIndex: 40,
          transform: "translate3d(0, -20px, 0) scale(0.98) rotate(-1deg)",
          opacity: 0.25,
          pointerEvents: "none" as const,
          transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease",
        };
      }
      if (pos === 1) {
        // Card de trás assume o destaque na frente da pilha
        return {
          zIndex: 35,
          transform: "translate3d(0, 0px, 0) scale(1)",
          opacity: 1,
          pointerEvents: "auto" as const,
          boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.75), 0 14px 34px -4px rgba(0, 76, 38, 0.12), 0 4px 16px rgba(0, 0, 0, 0.06)",
          transition: "transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.45s ease, box-shadow 0.45s ease",
        };
      }
      if (pos === 2) {
        // 3º card avança para a 2ª posição da camada
        return {
          zIndex: 25,
          transform: "translate3d(0, 10px, 0) scale(0.96)",
          opacity: 0.75,
          pointerEvents: "none" as const,
          boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.5), 0 8px 20px rgba(0, 0, 0, 0.04)",
          transition: "transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.45s ease",
        };
      }
      // 4º card avança para a 3ª posição da camada
      return {
        zIndex: 15,
        transform: "translate3d(0, 20px, 0) scale(0.92)",
        opacity: 0.45,
        pointerEvents: "none" as const,
        transition: "transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.45s ease",
      };
    }

    // Aspecto de camada em repouso
    switch (pos) {
      case 0:
        return {
          zIndex: 30,
          transform: "translate3d(0, 0px, 0) scale(1)",
          opacity: 1,
          pointerEvents: "auto" as const,
          boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.75), 0 14px 34px -4px rgba(0, 76, 38, 0.12), 0 4px 16px rgba(0, 0, 0, 0.06)",
          transition: "transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.4s ease, box-shadow 0.4s ease",
        };
      case 1:
        return {
          zIndex: 20,
          transform: "translate3d(0, 10px, 0) scale(0.96)",
          opacity: 0.75,
          pointerEvents: "none" as const,
          boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.5), 0 8px 20px rgba(0, 0, 0, 0.04)",
          transition: "transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.4s ease",
        };
      case 2:
        return {
          zIndex: 10,
          transform: "translate3d(0, 20px, 0) scale(0.92)",
          opacity: 0.45,
          pointerEvents: "none" as const,
          boxShadow: "none",
          transition: "transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.4s ease",
        };
      default:
        return {
          zIndex: 5,
          transform: "translate3d(0, 28px, 0) scale(0.88)",
          opacity: 0.2,
          pointerEvents: "none" as const,
          boxShadow: "none",
          transition: "transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.4s ease",
        };
    }
  };

  useGSAP(
    () => {
      const scene = root.current;
      if (!scene) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
          narrow: "(max-width: 860px)",
          short: "(max-height: 860px)",
        },
        (context) => {
          const { animate, narrow, short } = context.conditions as {
            animate: boolean;
            narrow: boolean;
            short: boolean;
          };
          if (!animate) return;

          const html = document.documentElement;
          const next = document.querySelector<HTMLElement>("#nitrogen-process");

          const leaves = scene.querySelector<HTMLElement>("[data-hero='leaves-img']");

          const moving = Array.from(
            scene.querySelectorAll<HTMLElement>(
              "[data-hero='sky'], [data-hero='ground'], [data-hero='title-wrap'], " +
              "[data-hero='leaves'], [data-hero='nitrogen']",
            ),
          );

          /* ------------------------------------------------------ entrada */
          const intro = gsap
            .timeline({
              paused: true,
              defaults: { duration: 2.1, ease: "power2.out" },
            })
            /* O céu assenta suavemente sem distorção de escala */
            .fromTo(
              "[data-hero='sky']",
              { opacity: 0.95 },
              { opacity: 1, duration: 1.8 },
              0,
            )
            /* O solo com os produtos surge de baixo para cima lentamente com peso */
            .fromTo(
              "[data-hero='ground']",
              { y: 0, yPercent: narrow ? 16 : 14 },
              { y: 0, yPercent: 0, duration: 2.3, ease: "power2.out" },
              0.25,
            )
            /* A tipografia monumental entra atrás do solo/produtos */
            .fromTo(
              "[data-hero='title-wrap']",
              { opacity: 0, y: 22 },
              { opacity: 1, y: 0, duration: 1.1 },
              0.55,
            )
            /* A ponta da folha assenta no rodapé, exibindo as pontas orgânicas intactas */
            .fromTo(
              "[data-hero='leaves']",
              { y: 0, yPercent: 96 },
              { y: 0, yPercent: narrow ? 76 : short ? 89.5 : 86, duration: 2.2 },
              0.35,
            )
            /* Cartão de valor, métricas e selo final entram escalonados */
            .fromTo(
              "[data-hero-card]",
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 1.05 },
              0.85,
            )
            .fromTo(
              "[data-hero-stats]",
              { opacity: 0, y: 18 },
              { opacity: 1, y: 0, duration: 0.95 },
              1.05,
            )
            .fromTo(
              "[data-hero-pill]",
              { opacity: 0, y: 14 },
              { opacity: 1, y: 0, duration: 0.9 },
              1.35,
            );

          intro.progress(0);

          void booted.then(() => {
            if (!root.current) return;
            if (window.scrollY > 4) {
              intro.progress(1);
              return;
            }
            intro.play();
          });

          /* ---------------------------------------------------- travessia / parallax */
          gsap
            .timeline({
              defaults: { duration: 1, immediateRender: false },
              scrollTrigger: {
                id: "hero-exit-aminosan",
                trigger: scene,
                start: "top top",
                end: "bottom bottom",
                scrub: SCRUB,
                invalidateOnRefresh: true,
                refreshPriority: 10,
                onToggle: (self) => {
                  const on = self.isActive;
                  moving.forEach((el) => {
                    el.style.willChange = on ? "transform" : "";
                  });
                  if (leaves) leaves.style.willChange = on ? "filter" : "";
                  if (on) html.dataset.heroOver = "on";
                  else delete html.dataset.heroOver;
                },
                onRefresh: (self) => {
                  if (self.isActive) html.dataset.heroOver = "on";
                  else delete html.dataset.heroOver;
                },
                onUpdate: (self) => {
                  if (self.progress > 0.01 && intro.progress() < 1) {
                    intro.timeScale(4).play();
                  }
                },
              },
            })
            /* A próxima seção permanece invisível até o fechamento da cena.
               Ela continua no fluxo normal, logo depois da altura da hero. */
            .set(next, { autoAlpha: 0 }, 0)
            /* 1. Saída e descida profunda do conteúdo inicial da Hero atrás da folha */
            .fromTo(
              "[data-hero='hero-darken']",
              { opacity: 0 },
              { opacity: 1, ease: "power1.inOut", duration: 0.62 },
              0,
            )
            .fromTo(
              "[data-hero='copy']",
              { y: 0, yPercent: 0 },
              { y: 0, yPercent: narrow ? 45 : 65, ease: "power1.in", duration: 0.56 },
              0,
            )
            .set("[data-hero='copy']", { visibility: "hidden" }, 0.61)
            .fromTo(
              "[data-hero='title-wrap']",
              { y: 0, yPercent: 0, opacity: 1 },
              { y: 0, yPercent: 48, opacity: 0, ease: "power1.in", duration: 0.52 },
              0,
            )
            .fromTo(
              "[data-hero='ground']",
              { y: 0, yPercent: 0, opacity: 1 },
              { y: 0, yPercent: narrow ? 26 : 40, opacity: 0, ease: "power1.in", duration: 0.6 },
              0,
            )
            .fromTo(
              "[data-hero='sky']",
              { y: 0, yPercent: 0 },
              { y: 0, yPercent: -12, ease: "power1.in", duration: 0.6 },
              0,
            )
            /* 2. A folha demora a ganhar velocidade e assenta com inércia.
               O curso mais longo evita que o close pareça saltar sobre a hero. */
            .fromTo(
              "[data-hero='leaves']",
              { y: 0, yPercent: narrow ? 76 : short ? 89.5 : 86, scale: 1 },
              { y: 0, yPercent: 0, scale: narrow ? 1.35 : 1.15, ease: "power2.inOut", duration: 0.68 },
              0,
            )
            .fromTo(
              "[data-hero='leaves-img']",
              { filter: "blur(0px)" },
              { filter: "blur(10px)", ease: "power2.inOut", duration: 0.68 },
              0,
            )
            /* 3. Entrada do Nitrogênio: um único estado inicial explícito
               evita que refreshes/reversões do scrub reapliquem from-tweens. */
            .set("[data-hero='nitrogen-copy-line']", { opacity: 0, x: narrow ? -22 : -38 }, 0.66)
            .set("[data-hero='nitrogen-step']", { opacity: 0, x: narrow ? 22 : 42 }, 0.66)
            .set("[data-hero='nitrogen-step-dot']", { scale: 0 }, 0.66)
            .set("[data-hero='nitrogen-step-line']", { scaleX: 0 }, 0.66)
            .set("[data-hero='nitrogen-shade']", { opacity: 0 }, 0.66)
            .set("[data-hero='nitrogen']", { opacity: 1 }, 0.66)
            .to(
              "[data-hero='nitrogen-shade']",
              { opacity: 1, ease: "power2.out", duration: 0.14 },
              0.66,
            )
            .to(
              "[data-hero='nitrogen-copy-line']",
              {
                opacity: 1,
                x: 0,
                stagger: { each: 0.04, from: "start" },
                ease: "power3.out",
                duration: 0.22,
              },
              0.7,
            )
            .to(
              "[data-hero='nitrogen-step']",
              {
                opacity: 1,
                x: 0,
                stagger: { each: 0.05, from: "start" },
                ease: "power3.out",
                duration: 0.22,
              },
              0.76,
            )
            .to(
              "[data-hero='nitrogen-step-dot']",
              {
                scale: 1,
                stagger: { each: 0.05, from: "start" },
                ease: "power3.out",
                duration: 0.16,
              },
              0.78,
            )
            .to(
              "[data-hero='nitrogen-step-line']",
              {
                scaleX: 1,
                stagger: { each: 0.05, from: "start" },
                ease: "power2.out",
                duration: 0.24,
              },
              0.8,
            )
            /* 4. O conteúdo permanece estável depois da entrada. Primeiro a
               hero fecha completamente; depois há um pequeno respiro só em
               preto; por fim a seção seguinte nasce desse preto, como na
               passagem equivalente da home. */
            .fromTo(
              "[data-hero='blackout']",
              { opacity: 0 },
              { opacity: 1, ease: "power1.inOut", duration: 0.16 },
              1.16,
            )
            .fromTo(
              next,
              { autoAlpha: 0 },
              { autoAlpha: 1, ease: "power2.inOut", duration: 0.22 },
              1.38,
            );

          /* Gestão de tom da barra do topo ao escurecer a cena */
          ScrollTrigger.create({
            trigger: scene,
            start: "top top",
            end: "bottom top",
            onUpdate: (self) => {
              if (self.progress > 0.15) {
                html.dataset.navTheme = "dark";
              } else {
                delete html.dataset.navTheme;
              }
            },
            onLeave: () => {
              html.dataset.navTheme = "dark";
            },
            onLeaveBack: () => {
              delete html.dataset.navTheme;
            },
          });

          return () => {
            delete html.dataset.navTheme;
            delete html.dataset.heroOver;
          };
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="aminosan-hero">
      <div className="aminosan-hero-window">
        {/* Camada 1: Céu ao entardecer */}
        <div
          data-hero="sky"
          className="pointer-events-none absolute inset-0 size-full origin-top select-none"
        >
          <Image
            src="/img/aminosan/hero-aminosan-sky.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Camada 2: Tipografia Monumental (posicionada atrás do solo e das embalagens) */}
        <div
          data-hero="title-wrap"
          className="aminosan-hero-title-wrap pointer-events-none absolute inset-x-0 top-[clamp(92px,11.5vh,134px)] z-10 px-gut text-center select-none"
        >
          <p
            data-hero-eyebrow
            className="font-display text-[clamp(9px,1.1vw,15px)] font-bold tracking-[0.26em] text-[#004c26] uppercase drop-shadow-[0_1px_4px_rgba(255,255,255,0.4)]"
          >
            {hero.eyebrow}
          </p>
          <h1
            data-hero-title
            className="mt-[clamp(2px,0.5vw,8px)] font-display text-[clamp(54px,14.5vw,228px)] font-light md:font-thin leading-[0.88] tracking-[0.03em] text-[#004c26] uppercase drop-shadow-[0_2px_14px_rgba(0,0,0,0.06)] aminosan-hero-title"
          >
            {hero.heading}
          </h1>
        </div>

        {/* Camada 3: Solo com a linha de produtos (versão vertical para mobile e panorâmica para desktop) */}
        <div
          data-hero="ground"
          className="aminosan-hero-ground pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center w-full select-none"
        >
          <picture className="aminosan-hero-ground-picture block">
            <source
              media="(max-width: 860px)"
              srcSet="/img/aminosan/hero-aminosan-ground-mobile.png"
            />
            <img
              src="/img/aminosan/hero-aminosan-ground.png"
              alt="Aminosan crop field with product lineup"
              width={1916}
              height={821}
              className="aminosan-hero-ground-img select-none pointer-events-none"
              loading="eager"
            />
          </picture>
        </div>

        {/* Camada 4: Cartões de valor, métricas e selo em primeiro plano */}
        <div
          data-hero="copy"
          className="aminosan-hero-copy pointer-events-none absolute inset-x-0 top-[clamp(215px,26.5vh,330px)] z-30 px-gut"
        >
          <div className="aminosan-hero-layout wrap flex flex-col items-stretch gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-[clamp(24px,3vw,60px)]">
            {/* Cartão de benefícios */}
            <div
              data-hero-card
              className="aminosan-hero-card pointer-events-auto rounded-2xl border border-white/50 bg-white/35 p-[clamp(20px,1.8vw,36px)] backdrop-blur-[18px] backdrop-saturate-[180%] shadow-[inset_0_1px_1px_rgba(255,255,255,0.75),0_12px_32px_rgba(0,0,0,0.08)] lg:w-[420px] lg:shrink-0 lg:mt-[clamp(64px,9.5vh,120px)]"
            >
              <div className="flex items-start gap-3">
                <Image
                  src="/img/aminosan/icon-badge-leaf.svg"
                  alt=""
                  width={46}
                  height={46}
                  className="aminosan-hero-card-badge size-[clamp(32px,2.8vw,44px)] shrink-0"
                />
                <p className="aminosan-hero-card-eyebrow pt-1 text-[clamp(10px,0.85vw,13px)] font-medium leading-snug tracking-[0.02em] text-[#004c26]">
                  {hero.card.eyebrow}
                </p>
              </div>

              <p className="aminosan-hero-card-title mt-4 font-display text-[clamp(19px,1.8vw,26px)] font-medium leading-[1.18] text-ink">
                {hero.card.title}
              </p>

              <div className="aminosan-hero-card-body-wrap mt-4 border-t border-[#004c26]/20 pt-4">
                <p className="aminosan-hero-card-body text-[clamp(12.5px,0.95vw,15px)] leading-[1.42] text-muted">
                  {hero.card.body}
                </p>
              </div>

              <div className="aminosan-hero-card-ctas mt-5 flex flex-wrap gap-2">
                {hero.card.ctas.map((cta) => (
                  <a
                    key={cta.label}
                    href={cta.href}
                    className="aminosan-hero-card-btn inline-flex items-center gap-1.5 rounded-lg bg-[#004c26] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#003a1d]"
                  >
                    {cta.label}
                    <Image
                      src="/img/aminosan/icon-cta-arrow.svg"
                      alt=""
                      width={10}
                      height={10}
                      className="size-[9px]"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Deck animado de estatísticas em camadas (Stack com transição automática a cada 2s) */}
            <div
              data-hero-stats
              className="aminosan-hero-stats pointer-events-auto relative w-full max-w-[360px] lg:w-[360px] lg:shrink-0 h-[88px] sm:h-[96px] lg:mt-[clamp(160px,20vh,240px)]"
            >
              {hero.stats.map((stat, index) => {
                const pos = (index - activeStatIndex + totalStats) % totalStats;
                const isFront = pos === 0;
                return (
                  <div
                    key={stat.label}
                    className="aminosan-hero-stat-item absolute inset-x-0 top-0 flex items-center gap-3.5 rounded-xl border border-white/50 bg-white/35 px-[clamp(14px,1.3vw,22px)] py-[clamp(10px,0.8vw,14px)] backdrop-blur-[18px] backdrop-saturate-[180%] select-none"
                    style={getStatCardStyle(index)}
                  >
                    <div
                      className={`aminosan-hero-stat-icon size-[clamp(36px,3.2vw,46px)] shrink-0 rounded-full flex items-center justify-center overflow-hidden transition-opacity duration-300 ${
                        isFront ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <Image
                        src={STAT_ICON[stat.icon]}
                        alt=""
                        width={52}
                        height={52}
                        className="size-full object-contain"
                      />
                    </div>
                    <div
                      className={`min-w-0 flex-1 transition-opacity duration-300 ${
                        isFront ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <p className="aminosan-hero-stat-val font-display text-[clamp(15px,1.3vw,20px)] font-semibold leading-tight text-ink truncate">
                        {stat.value}
                      </p>
                      <p className="aminosan-hero-stat-lbl text-[clamp(11px,0.8vw,14px)] tracking-[0.02em] text-muted line-clamp-1">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selo / Tagline */}
          <div
            data-hero-pill
            className="aminosan-hero-pill pointer-events-auto mx-auto mt-4 lg:mt-[clamp(14px,2vh,26px)] flex w-fit max-w-full items-center gap-2 rounded-lg border border-white/50 bg-white/35 px-4 py-2 backdrop-blur-[16px] backdrop-saturate-[180%] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_4px_12px_rgba(0,0,0,0.04)]"
          >
            <Image
              src="/img/aminosan/icon-tagline.svg"
              alt=""
              width={20}
              height={24}
              className="h-[18px] w-[15px] shrink-0"
            />
            <p className="font-display text-[clamp(9px,0.8vw,14px)] tracking-[0.08em] text-[#004c26]">
              {hero.tagline}
            </p>
          </div>
        </div>

        {/* Camada intermediária: escurecimento total do conteúdo da hero atrás da folha */}
        <span
          data-hero="hero-darken"
          className="pointer-events-none absolute inset-0 z-35 bg-[#0C0C0E] opacity-0"
          aria-hidden
        />

        {/* Camada 5: Folhas em primeiro plano (sem corte reto: proporção natural da imagem 1536x1024) */}
        <div
          data-hero="leaves"
          className="aminosan-hero-leaves pointer-events-none absolute inset-x-0 bottom-0 z-40 w-full origin-bottom select-none"
          style={{ transform: "translateY(86%)" }}
        >
          <img
            data-hero="leaves-img"
            src="/img/aminosan/hero-aminosan-leaf.png"
            alt=""
            width={1536}
            height={1024}
            className="w-full h-auto block select-none pointer-events-none"
            loading="eager"
          />
        </div>

        {/* Camada 6: Informações de Nitrogênio sobre a folha */}
        <div
          data-hero="nitrogen"
          className="pointer-events-none absolute inset-0 z-45 flex items-center px-gut opacity-0"
        >
          <span
            data-hero="nitrogen-shade"
            className="pointer-events-none absolute inset-0 bg-black/[0.46] opacity-0"
            aria-hidden
          />
          <div
            data-hero="nitrogen-content"
            className="relative z-10 wrap w-full grid grid-cols-1 items-center gap-[clamp(32px,5vw,84px)] lg:grid-cols-[1.15fr_1fr]"
          >
            <div data-hero="nitrogen-copy" className="max-w-[560px]">
              <h2
                data-hero="nitrogen-copy-line"
                className="font-display text-[clamp(28px,3.5vw,52px)] font-semibold leading-[1.14] text-white tracking-[-0.01em]"
              >
                {nitrogen.heading}
              </h2>
              <p
                data-hero="nitrogen-copy-line"
                className="mt-[clamp(16px,2.2vh,28px)] text-[clamp(14px,1.05vw,17px)] font-normal leading-[1.65] text-white/85"
              >
                {nitrogen.body[0]}
              </p>
              <p
                data-hero="nitrogen-copy-line"
                className="mt-[clamp(14px,1.8vh,24px)] text-[clamp(14px,1.05vw,17px)] font-bold leading-[1.65] text-white"
              >
                {nitrogen.body[1]}
              </p>
            </div>

            <div
              data-hero="nitrogen-steps"
              className="flex flex-col gap-[clamp(32px,5vh,72px)]"
            >
              {nitrogen.steps.map((label) => (
                <div key={label} data-hero="nitrogen-step">
                  <StepIndicator label={label} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Camada 7: Lâmina de blackout na reta final do percurso (transição para tela toda preta) */}
        <span
          data-hero="blackout"
          className="pointer-events-none absolute inset-0 -bottom-[2px] z-50 bg-[#0C0C0E] opacity-0"
          aria-hidden
        />
      </div>
    </section>
  );
}
