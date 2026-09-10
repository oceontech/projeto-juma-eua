"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Pill, Rule } from "@/components/ui";
import { trialStrip } from "@/content/home";

const trialStepImages = [
  "/img/trial-efficiency.webp",
  "/img/trial-check-strip.webp",
  "/img/trial-harvest-data.webp",
] as const;

/**
 * Método da faixa de teste com travamento de tela (sticky viewport),
 * moldura quadrada com transição de cortina nas fotos à esquerda,
 * divisor central com indicador de progresso e informações à direita.
 */
export function TrialStrip() {
  const root = useRef<HTMLElement>(null);
  const stickyStage = useRef<HTMLDivElement>(null);

  const goToStep = (targetIndex: number) => {
    if (!root.current || !stickyStage.current) return;
    const rect = root.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const sectionTop = rect.top + scrollTop;
    const totalDistance = Math.max(1, root.current.offsetHeight - stickyStage.current.offsetHeight);

    // Pontos de ancoragem no curso da rolagem correspondentes a cada hold
    const ratios = [0.08, 0.5, 0.92];
    const targetY = sectionTop + totalDistance * ratios[targetIndex];

    const isDesktop = typeof window !== "undefined" && window.innerWidth > 860;

    window.scrollTo({
      top: targetY,
      behavior: isDesktop ? "smooth" : "auto",
    });
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 861px)",
          mobile: "(max-width: 860px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { animate, desktop } = context.conditions as {
            animate: boolean;
            desktop: boolean;
            mobile: boolean;
            reduce: boolean;
          };

          const intro = root.current?.querySelector<HTMLElement>("[data-trial-intro]");

          // Seleciona elementos estritamente dentro do container do breakpoint ativo
          const stageContainer = desktop
            ? root.current?.querySelector<HTMLElement>("[data-stage-desktop]")
            : root.current?.querySelector<HTMLElement>("[data-stage-mobile]");

          if (!stageContainer) return;

          const images = gsap.utils.toArray<HTMLElement>(
            stageContainer.querySelectorAll("[data-step-img]"),
          );
          const texts = gsap.utils.toArray<HTMLElement>(
            stageContainer.querySelectorAll("[data-step-text]"),
          );
          const dotsList = gsap.utils.toArray<HTMLElement>(
            stageContainer.querySelectorAll(desktop ? "[data-dot-desktop]" : "[data-dot-mobile]"),
          );
          const progressBar = stageContainer.querySelector<HTMLElement>(
            desktop ? "[data-desktop-progress]" : "[data-mobile-progress]",
          );

          if (!animate) {
            if (intro) gsap.set(intro, { autoAlpha: 1, y: 0 });
            return;
          }

          // Entrada suave do cabeçalho apenas no desktop para evitar disputa de layout no mobile
          if (desktop && intro) {
            gsap.fromTo(
              intro,
              { autoAlpha: 0, y: 20 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: root.current,
                  start: "top 85%",
                  toggleActions: "play none none reverse",
                },
              },
            );
          } else if (intro) {
            gsap.set(intro, { autoAlpha: 1, y: 0 });
          }

          // Timeline mestra com scrub travado na rolagem:
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: () =>
                "+=" +
                Math.max(
                  1,
                  (root.current?.offsetHeight ?? 0) -
                    (stickyStage.current?.offsetHeight ?? 0),
                ),
              scrub: desktop ? 0.35 : true,
            },
          });

          // Posições iniciais:
          if (images.length >= 3) {
            gsap.set(images[0], { clipPath: "inset(0% 0% 0% 0%)", scale: 1 });
            gsap.set(images[1], { clipPath: "inset(100% 0% 0% 0%)", scale: desktop ? 1.05 : 1 });
            gsap.set(images[2], { clipPath: "inset(100% 0% 0% 0%)", scale: desktop ? 1.05 : 1 });
          }

          // Textos iniciais do breakpoint ativo:
          // No mobile não usamos deslocamento Y para prevenir qualquer oscilação durante o toque
          if (texts.length >= 3) {
            gsap.set(texts[0], { autoAlpha: 1, y: 0 });
            gsap.set(texts[1], { autoAlpha: 0, y: desktop ? 20 : 0 });
            gsap.set(texts[2], { autoAlpha: 0, y: desktop ? 20 : 0 });
          }

          // Indicador inicial:
          if (progressBar) {
            gsap.set(progressBar, {
              [desktop ? "scaleY" : "scaleX"]: 0,
              transformOrigin: desktop ? "top center" : "left center",
            });
          }

          // Duração normalizada total = 3.0
          // Fase 1: HOLD no Passo 1 (0.00 -> 0.75)
          tl.addLabel("step1", 0.0);

          // Transição 1 -> 2 (0.75 -> 1.35)
          tl.addLabel("transition1to2", 0.75);

          // 1. Wipe de cortina na imagem 1 revelando a foto 2
          if (images[1]) {
            tl.to(
              images[1],
              {
                clipPath: "inset(0% 0% 0% 0%)",
                scale: 1,
                duration: 0.6,
                ease: "power2.inOut",
              },
              "transition1to2",
            );
          }

          // 2. Transição de texto 0 -> 1 (fade limpo no mobile sem deslocamento vertical)
          if (texts[0] && texts[1]) {
            tl.to(
              texts[0],
              {
                autoAlpha: 0,
                y: desktop ? -20 : 0,
                duration: 0.32,
                ease: "power2.in",
              },
              "transition1to2",
            );
            tl.to(
              texts[1],
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.42,
                ease: "power3.out",
              },
              "transition1to2+=0.18",
            );
          }

          // 3. Progresso da linha central
          if (progressBar) {
            tl.to(
              progressBar,
              {
                [desktop ? "scaleY" : "scaleX"]: 0.5,
                duration: 0.6,
                ease: "none",
              },
              "transition1to2",
            );
          }

          // Transição dos pontos 1 e 2
          if (dotsList.length >= 3) {
            tl.to(
              dotsList[0],
              {
                backgroundColor: "#F6FFEE",
                color: "#004C25",
                borderColor: "#B7C73E",
                scale: 1,
                duration: 0.25,
              },
              "transition1to2+=0.1",
            );
            tl.to(
              dotsList[1],
              {
                backgroundColor: "#002C1B",
                color: "#DFED74",
                borderColor: "#B7C73E",
                scale: desktop ? 1.15 : 1,
                duration: 0.25,
              },
              "transition1to2+=0.35",
            );
          }

          // Fase 2: HOLD no Passo 2 (1.35 -> 2.05)
          tl.addLabel("step2", 1.4);

          // Transição 2 -> 3 (2.05 -> 2.65)
          tl.addLabel("transition2to3", 2.05);

          // 1. Wipe de cortina na imagem 2 revelando a foto 3
          if (images[2]) {
            tl.to(
              images[2],
              {
                clipPath: "inset(0% 0% 0% 0%)",
                scale: 1,
                duration: 0.6,
                ease: "power2.inOut",
              },
              "transition2to3",
            );
          }

          // 2. Transição de texto 1 -> 2 (fade limpo no mobile sem deslocamento vertical)
          if (texts[1] && texts[2]) {
            tl.to(
              texts[1],
              {
                autoAlpha: 0,
                y: desktop ? -20 : 0,
                duration: 0.32,
                ease: "power2.in",
              },
              "transition2to3",
            );
            tl.to(
              texts[2],
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.42,
                ease: "power3.out",
              },
              "transition2to3+=0.18",
            );
          }

          // 3. Progresso da linha central para 100%
          if (progressBar) {
            tl.to(
              progressBar,
              {
                [desktop ? "scaleY" : "scaleX"]: 1,
                duration: 0.6,
                ease: "none",
              },
              "transition2to3",
            );
          }

          // Transição dos pontos 2 e 3
          if (dotsList.length >= 3) {
            tl.to(
              dotsList[1],
              {
                backgroundColor: "#F6FFEE",
                color: "#004C25",
                borderColor: "#B7C73E",
                scale: 1,
                duration: 0.25,
              },
              "transition2to3+=0.1",
            );
            tl.to(
              dotsList[2],
              {
                backgroundColor: "#002C1B",
                color: "#DFED74",
                borderColor: "#B7C73E",
                scale: desktop ? 1.15 : 1,
                duration: 0.25,
              },
              "transition2to3+=0.35",
            );
          }

          // Fase 3: HOLD no Passo 3 (2.65 -> 3.20)
          tl.addLabel("step3", 2.7);
          tl.to({}, { duration: 0.5 }); // Buffer final para leitura confortável do último passo
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="method"
      className="relative bg-white text-ink selection:bg-lime selection:text-green-deep"
      style={{ height: "calc(100lvh + 220lvh)" }}
    >
      <div
        ref={stickyStage}
        className="sticky top-0 h-[100svh] min-[861px]:h-[100lvh] w-full overflow-clip isolate flex flex-col justify-start pt-14 pb-5 min-[861px]:justify-center min-[861px]:py-10"
        style={{
          transform: "translate3d(0,0,0)",
          WebkitTransform: "translate3d(0,0,0)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <div className="wrap flex flex-col h-full justify-start min-[861px]:justify-center gap-3 min-[861px]:gap-8">
          {/* Cabeçalho superior */}
          <header data-trial-intro className="flex-shrink-0">
            <div className="mb-1.5 min-[861px]:mb-3 flex items-center gap-[clamp(10px,1.2vw,22px)]">
              <Pill>{trialStrip.eyebrow}</Pill>
              <Rule short />
            </div>

            <div className="grid grid-cols-1 items-baseline gap-3 min-[861px]:gap-6 min-[1100px]:grid-cols-[1.28fr_1fr]">
              <h2 className="font-display text-[clamp(20px,2.75vw,46px)] font-bold leading-[1.15] tracking-tight text-ink">
                {trialStrip.headline}
              </h2>
              <p className="text-muted text-[13.5px] min-[861px]:text-[clamp(13px,0.95vw,16px)] leading-[1.5] max-w-[520px]">
                {trialStrip.body}
              </p>
            </div>
          </header>

          {/* Palco interativo principal */}
          <div
            data-trial-stage
            className="flex-1 min-h-0 flex items-center w-full"
          >
            {/* ============================================================
                VERSÃO DESKTOP (Grid 3 colunas: Imagem | Divisor | Conteúdo)
                ============================================================ */}
            <div
              data-stage-desktop
              className="hidden min-[861px]:grid w-full grid-cols-[min(640px,48vw)_auto_1fr] items-center gap-[clamp(24px,3vw,56px)]"
            >
              {/* Coluna 1: Moldura quadrada sem sombreamento externo */}
              <div className="relative aspect-square w-full max-w-[min(640px,calc(100lvh-200px))] rounded-[clamp(12px,0.9vw,16px)] overflow-hidden bg-green-deep grid grid-cols-1">
                {trialStrip.steps.map((step, i) => (
                  <div
                    key={step.number}
                    data-step-img={i}
                    style={{
                      gridArea: "1 / 1",
                      clipPath: i === 0 ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
                    }}
                    className="relative h-full w-full will-change-[clip-path,transform]"
                  >
                    <Image
                      src={trialStepImages[i]}
                      alt={step.title}
                      fill
                      sizes="(min-width: 861px) 640px, 100vw"
                      className="object-cover"
                      priority={i === 0}
                    />

                    {/* Vinheta inferior suave na moldura */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-green-deep/50 to-transparent" />
                  </div>
                ))}
              </div>

              {/* Coluna 2: Linha divisória central com indicador de etapa */}
              <div className="relative flex flex-col items-center justify-between h-[clamp(360px,46vh,500px)] px-2">
                {/* Trilho de fundo */}
                <div className="absolute top-5 bottom-5 left-1/2 -translate-x-1/2 w-[2px] bg-black/10 rounded-full" />

                {/* Linha de preenchimento animada */}
                <div
                  data-desktop-progress
                  className="absolute top-5 bottom-5 left-1/2 -translate-x-1/2 w-[2.5px] bg-gradient-to-b from-green-brand via-lime to-lime rounded-full shadow-[0_0_10px_rgba(183,199,62,0.6)]"
                />

                {/* Marcadores 01, 02, 03 */}
                {trialStrip.steps.map((step, i) => (
                  <button
                    key={step.number}
                    type="button"
                    data-dot-desktop={i}
                    onClick={() => goToStep(i)}
                    className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full font-tag text-[13px] font-bold transition-all duration-300 shadow-sm cursor-pointer border ${
                      i === 0
                        ? "bg-green-deep text-lime border-lime scale-110 shadow-[0_0_16px_rgba(183,199,62,0.4)]"
                        : "bg-white text-muted border-black/10 hover:border-lime/60 hover:text-ink"
                    }`}
                    aria-label={`Ir para etapa ${step.number}: ${step.title}`}
                    title={`Ir para etapa ${step.number}: ${step.title}`}
                  >
                    <span>{step.number}</span>
                  </button>
                ))}
              </div>

              {/* Coluna 3: Informações do card à direita (em grid 1/1 para estabilidade máxima) */}
              <div className="relative min-h-[200px] grid grid-cols-1 items-center pl-2">
                {trialStrip.steps.map((step, i) => (
                  <div
                    key={step.number}
                    data-step-text={i}
                    style={{
                      gridArea: "1 / 1",
                      opacity: i === 0 ? 1 : 0,
                      visibility: i === 0 ? "visible" : "hidden",
                    }}
                    className="max-w-[540px] flex flex-col justify-center will-change-transform pointer-events-auto"
                  >
                    <h3 className="font-display text-[clamp(32px,3vw,52px)] font-bold text-ink leading-[1.08] mb-[clamp(14px,1.4vw,24px)] tracking-tight">
                      {step.title}
                    </h3>

                    <p className="text-[clamp(16px,1.15vw,20px)] text-muted leading-[1.65]">
                      {step.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ============================================================
                VERSÃO MOBILE (Stack vertical estável e compacta)
                ============================================================ */}
            <div
              data-stage-mobile
              className="min-[861px]:hidden flex flex-col w-full gap-3 my-auto"
            >
              {/* Moldura da imagem ampliada com curvatura suave sem borda e sem sombra */}
              <div className="relative aspect-[4/3] max-h-[clamp(240px,36vh,320px)] w-full rounded-[14px] overflow-hidden bg-green-deep grid grid-cols-1 flex-shrink-0">
                {trialStrip.steps.map((step, i) => (
                  <div
                    key={step.number}
                    data-step-img={i}
                    style={{
                      gridArea: "1 / 1",
                      clipPath: i === 0 ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
                    }}
                    className="relative h-full w-full"
                  >
                    <Image
                      src={trialStepImages[i]}
                      alt={step.title}
                      fill
                      sizes="(max-width: 860px) 100vw, 640px"
                      className="object-cover"
                      priority={i === 0}
                    />
                  </div>
                ))}
              </div>

              {/* Indicador de progresso horizontal para mobile */}
              <div className="relative flex items-center justify-between px-3 my-1 flex-shrink-0">
                {/* Trilho horizontal */}
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] bg-black/10 rounded-full" />

                {/* Preenchimento horizontal */}
                <div
                  data-mobile-progress
                  className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] bg-lime rounded-full shadow-[0_0_8px_rgba(183,199,62,0.6)]"
                />

                {trialStrip.steps.map((step, i) => (
                  <button
                    key={step.number}
                    type="button"
                    data-dot-mobile={i}
                    onClick={() => goToStep(i)}
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full font-tag text-[11px] font-bold transition-all duration-300 border ${
                      i === 0
                        ? "bg-green-deep text-lime border-lime scale-110 shadow-sm"
                        : "bg-white text-muted border-black/10"
                    }`}
                    aria-label={`Ir para etapa ${step.number}`}
                  >
                    <span>{step.number}</span>
                  </button>
                ))}
              </div>

              {/* Conteúdo textual no mobile (em grid 1/1 para estabilidade de altura) */}
              <div className="relative min-h-[105px] grid grid-cols-1 items-center flex-shrink-0">
                {trialStrip.steps.map((step, i) => (
                  <div
                    key={step.number}
                    data-step-text={i}
                    style={{
                      gridArea: "1 / 1",
                      opacity: i === 0 ? 1 : 0,
                      visibility: i === 0 ? "visible" : "hidden",
                    }}
                    className="w-full flex flex-col justify-center pointer-events-auto"
                  >
                    <h3 className="font-display text-[20px] font-bold text-ink leading-tight mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-[13px] text-muted leading-snug">
                      {step.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
