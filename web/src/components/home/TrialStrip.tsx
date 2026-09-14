"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, SplitText, useGSAP, START } from "@/lib/gsap";
import { Pill, Rule } from "@/components/ui";
import { useContent } from "@/components/layout/LocaleProvider";

const STEP_IMAGES = [
  { src: "/img/trial-v2/step-1-pass.webp", position: "50% 48%" },
  { src: "/img/trial-v2/step-2-check.webp", position: "50% 50%" },
  { src: "/img/trial-v2/step-3-harvest.webp", position: "55% 50%" },
] as const;

/*
 * Linha do tempo da cena presa, em unidades de duração. Cada troca de etapa
 * ocupa 1 unidade e é uma "passada": a foto seguinte entra da esquerda para a
 * direita atrás de uma barra lima, como o pulverizador cruzando o talhão.
 * HOLDS são os pontos em que cada etapa está parada e legível — os botões de
 * progresso rolam até eles.
 */
const PASSES = [1.4, 3.0] as const;
const HOLDS = [0.9, 2.7, 4.3] as const;
const TOTAL = 4.8;

const FRAME_FROM_DESKTOP = "inset(7% 5% 7% 5% round 32px)";
const FRAME_FROM_MOBILE = "inset(5% 4% 5% 4% round 20px)";
const FRAME_TO = "inset(0% 0% 0% 0% round 0px)";

/**
 * Método da faixa de teste. O cabeçalho fica no fluxo normal da página; logo
 * abaixo, uma moldura entra como card e se abre até ocupar a tela, e a partir
 * daí a rolagem conduz as três etapas dentro dela.
 */
export function TrialStrip() {
  const { trialStrip } = useContent().home;
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);

  const goToStep = (i: number) => {
    const st = trigger.current;
    if (!st) return;
    const top = st.start + (st.end - st.start) * (HOLDS[i] / TOTAL);
    window.scrollTo({ top, behavior: "smooth" });
  };

  useGSAP(
    () => {
      const el = track.current;
      const section = root.current;
      if (!el || !section) return;

      const q = gsap.utils.selector(el);
      const frame = q("[data-frame]")[0];
      const media = q("[data-media]");
      const imgs = q("[data-media-img]");
      const steps = q("[data-step]");
      const boom = q("[data-boom]")[0];
      const fills = q("[data-fill]");
      const counter = q("[data-counter]")[0];
      const headline = section.querySelector<HTMLElement>("[data-trial-headline]");
      const introRest = section.querySelectorAll<HTMLElement>("[data-trial-intro]");

      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 860px)",
        },
        (ctx) => {
          const { motion, mobile } = ctx.conditions as { motion: boolean; mobile: boolean };

          /* ---- cabeçalho: linhas sobem de dentro de uma máscara */
          if (motion && headline) {
            SplitText.create(headline, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.lines, {
                  yPercent: 105,
                  duration: 0.9,
                  stagger: 0.08,
                  ease: "power3.out",
                  scrollTrigger: { trigger: headline, start: START, toggleActions: "play none none reverse" },
                }),
            });
            gsap.from(introRest, {
              autoAlpha: 0,
              y: 18,
              duration: 0.7,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: { trigger: section, start: START, toggleActions: "play none none reverse" },
            });
          }

          /* ---- moldura: entra como card e abre até sangrar a tela */
          if (motion) {
            gsap.fromTo(
              frame,
              { clipPath: mobile ? FRAME_FROM_MOBILE : FRAME_FROM_DESKTOP },
              {
                clipPath: FRAME_TO,
                ease: "none",
                scrollTrigger: { trigger: el, start: "top 85%", end: "top top", scrub: true },
              },
            );
            gsap.fromTo(imgs[0], { scale: 1.18 }, {
              scale: 1.06,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: true },
            });
          } else {
            gsap.set(frame, { clipPath: FRAME_TO });
          }

          /* ---- cena presa */
          gsap.set(media.slice(1), motion ? { clipPath: "inset(0% 100% 0% 0%)" } : { autoAlpha: 0 });
          gsap.set(steps, { autoAlpha: 0, y: motion ? 36 : 0 });
          gsap.set(fills, { scaleX: 0, transformOrigin: "left center" });
          gsap.set(boom, { xPercent: 0, autoAlpha: 0 });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "bottom bottom",
              scrub: motion ? 0.6 : true,
            },
          });
          trigger.current = tl.scrollTrigger ?? null;

          tl.to(steps[0], { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0);
          tl.to(fills[0], { scaleX: 1, duration: PASSES[0] }, 0);
          if (motion) tl.to(imgs[0], { scale: 1, duration: PASSES[0] + 1 }, 0);

          PASSES.forEach((at, i) => {
            const from = i;
            const to = i + 1;

            // texto que sai
            tl.to(steps[from], { autoAlpha: 0, y: motion ? -28 : 0, duration: 0.35, ease: "power2.in" }, at);

            // a passada
            if (motion) {
              tl.to(media[to], { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power1.inOut" }, at);
              tl.fromTo(imgs[to], { scale: 1.16, xPercent: -3 }, { scale: 1, xPercent: 0, duration: 1.6, ease: "power1.out" }, at);
              tl.fromTo(
                boom,
                { xPercent: 0, autoAlpha: 1 },
                { xPercent: 100, duration: 1, ease: "power1.inOut", immediateRender: false },
                at,
              );
              tl.to(boom, { autoAlpha: 0, duration: 0.12 }, at + 0.9);
            } else {
              tl.to(media[to], { autoAlpha: 1, duration: 0.6 }, at + 0.2);
            }

            // contador e progresso
            tl.to(counter, { yPercent: -(100 / 3) * to, duration: 0.4, ease: "power2.inOut" }, at + 0.3);
            tl.to(fills[to], { scaleX: 1, duration: 1.6 }, at);

            // texto que entra
            tl.to(steps[to], { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" }, at + 0.55);
          });

          tl.set({}, {}, TOTAL);
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
    >
      {/* Cabeçalho no fluxo normal — nunca disputa altura com o palco */}
      <header className="wrap pt-[clamp(72px,8vw,140px)] pb-[clamp(28px,3.4vw,60px)]">
        <div data-trial-intro className="mb-[clamp(14px,1.4vw,24px)] flex items-center gap-[clamp(10px,1.2vw,22px)]">
          <Pill>{trialStrip.eyebrow}</Pill>
          <Rule short />
        </div>

        <div className="grid grid-cols-1 items-end gap-[clamp(14px,2.4vw,48px)] min-[1100px]:grid-cols-[1.35fr_1fr]">
          <h2
            data-trial-headline
            className="text-h2 leading-[0.967] text-ink"
          >
            {trialStrip.headline}
          </h2>
          <p
            data-trial-intro
            className="max-w-[46ch] font-light leading-[1.5] text-muted min-[1100px]:justify-self-end"
          >
            {trialStrip.body}
          </p>
        </div>
      </header>

      {/* Curso da rolagem: a janela sticky fica presa enquanto ele passa */}
      <div ref={track} className="relative h-[460lvh]">
        <div className="sticky top-0 h-[100svh] w-full overflow-clip min-[861px]:h-[100lvh]">
          <div
            data-frame
            className="absolute inset-0 overflow-hidden bg-green-deep will-change-[clip-path]"
            style={{ clipPath: FRAME_TO }}
          >
            {/* Fotos empilhadas */}
            {trialStrip.steps.map((step, i) => (
              <div
                key={step.number}
                data-media
                className="absolute inset-0 overflow-hidden will-change-[clip-path]"
                style={i === 0 ? undefined : { clipPath: "inset(0% 100% 0% 0%)" }}
              >
                <div data-media-img className="absolute inset-0 will-change-transform">
                  <Image
                    src={STEP_IMAGES[i].src}
                    alt=""
                    fill
                    sizes="(max-width: 860px) 1600px, 100vw"
                    quality={90}
                    priority={i === 0}
                    className="object-cover"
                    style={{ objectPosition: STEP_IMAGES[i].position }}
                  />
                </div>
              </div>
            ))}

            {/* Barra da passada */}
            <div data-boom aria-hidden className="pointer-events-none absolute inset-0 opacity-0">
              <div className="absolute inset-y-0 left-0 w-[3px] -translate-x-1/2 bg-lime shadow-[0_0_28px_6px_rgba(183,199,62,0.55)]" />
              <div className="absolute inset-y-0 left-0 w-[18vw] -translate-x-full bg-[linear-gradient(to_left,rgba(183,199,62,0.22),transparent)]" />
            </div>

            {/* Leitura */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,22,13,0.92)_0%,rgba(0,22,13,0.55)_32%,rgba(0,22,13,0)_62%),linear-gradient(to_bottom,rgba(0,22,13,0.45)_0%,rgba(0,22,13,0)_22%)]"
            />

            <div className="wrap absolute inset-x-0 bottom-0 flex flex-col gap-[clamp(20px,3vw,48px)] pb-[clamp(24px,5svh,72px)] min-[861px]:flex-row min-[861px]:items-end min-[861px]:justify-between">
              {/* Textos das etapas, empilhados na mesma célula */}
              <div className="grid max-w-[640px] grid-cols-1 text-white">
                {trialStrip.steps.map((step, i) => (
                  <article
                    key={step.number}
                    data-step
                    className="[grid-area:1/1] self-end"
                    style={i === 0 ? undefined : { opacity: 0, visibility: "hidden" }}
                  >
                    <p className="mb-[clamp(10px,1vw,16px)] font-tag text-[clamp(11px,0.8vw,14px)] font-bold tracking-[0.2em] text-lime uppercase">
                      {step.number} / {String(trialStrip.steps.length).padStart(2, "0")}
                    </p>
                    <h3 className="text-[clamp(38px,5.4vw,100px)] leading-[0.967]">
                      {step.title}
                    </h3>
                    <p className="mt-[clamp(12px,1.3vw,22px)] max-w-[46ch] text-[clamp(15px,1.15vw,20px)] leading-[1.55] text-white/80">
                      {step.body}
                    </p>
                  </article>
                ))}
              </div>

              {/* Contador e progresso */}
              <div className="flex shrink-0 flex-col gap-[clamp(10px,1.2vw,18px)] text-white min-[861px]:items-end">
                <div className="hidden items-baseline gap-2 font-display min-[861px]:flex">
                  <span className="relative block h-[1em] overflow-hidden text-[clamp(44px,4.4vw,80px)] leading-none">
                    <span data-counter className="flex flex-col">
                      {trialStrip.steps.map((step) => (
                        <span key={step.number} className="block h-[1em]">
                          {step.number}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="text-[clamp(16px,1.3vw,22px)] text-white/50">
                    / {String(trialStrip.steps.length).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex gap-[clamp(6px,0.6vw,10px)]">
                  {trialStrip.steps.map((step, i) => (
                    <button
                      key={step.number}
                      type="button"
                      onClick={() => goToStep(i)}
                      aria-label={`${trialStrip.goToStep} ${step.number}: ${step.title}`}
                      className="group flex flex-1 cursor-pointer flex-col gap-2 py-2 text-left min-[861px]:w-[clamp(96px,8.5vw,150px)] min-[861px]:flex-none"
                    >
                      <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-white/20">
                        <span data-fill className="absolute inset-0 origin-left scale-x-0 rounded-full bg-lime" />
                      </span>
                      <span className="truncate font-tag text-[11px] tracking-[0.08em] text-white/60 uppercase transition-colors group-hover:text-white min-[861px]:text-[12px]">
                        {step.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
