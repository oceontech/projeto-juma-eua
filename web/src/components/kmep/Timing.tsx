"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { gsap, useGSAP } from "@/lib/gsap";
import { eyebrow, microCaps } from "./ui";

/* Marcas miúdas da régua: uma a cada 2,5% do comprimento. */
const MINOR = Array.from({ length: 41 }, (_, i) => i / 40);

/* Acende as marcas que a régua já alcançou. */
function paint(root: HTMLElement | null, p: number) {
  root?.querySelectorAll<HTMLElement>(".tm-mark").forEach((mark) => {
    mark.classList.toggle("is-on", p >= Number(mark.dataset.at) - 0.001);
  });
}

/**
 * K13 — quando entra. A régua da safra com os estágios marcados, avançando
 * presa ao scroll, e um alternador milho/soja (dois botões, sem rota nova —
 * o precedente é a barra de cultura do protótipo). A régua é ordinal: marca
 * os estágios do rótulo 2026 da Juma, sem fingir escala de dias.
 *
 * A régua é desenho: a leitura acessível é a frase de resumo embaixo dela,
 * que é a copy do canônico.
 *
 * Dose e embalagem dependem de P4 e P1 — a página diz a frase honesta, e o
 * TODO fica no conteúdo.
 */
export function Timing() {
  const { timing } = useContent().kmep;
  const [active, setActive] = useState(0);
  const crop = timing.crops[active];
  const scope = useRef<HTMLElement>(null);
  /* O ponto da régua, guardado para reacender as marcas depois de trocar a
     cultura — as marcas novas nascem apagadas. */
  const progress = useRef(1);

  useEffect(() => {
    paint(scope.current, progress.current);
  }, [active]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { animate } = ctx.conditions as { animate: boolean };
          if (!animate) {
            progress.current = 1;
            paint(scope.current, 1);
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
                gsap.set(".tm-fill", { scaleX: state.p });
                progress.current = state.p;
                paint(scope.current, state.p);
              },
              scrollTrigger: { trigger: ".tm-ruler", start: "top 85%", end: "bottom 35%", scrub: 0.6 },
            },
          );
        },
      );
    },
    { scope },
  );

  return (
    <section ref={scope} className="bg-cream py-sec text-forest">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-end lg:gap-16">
          <SplitLines className="text-[clamp(44px,5.6vw,108px)] leading-[0.93] tracking-[-0.04em]">{timing.heading}</SplitLines>
          <p className={`${microCaps} text-[12px] text-forest/75`}>{timing.body}</p>
        </div>

        {/* O alternador. */}
        <div className="mt-[clamp(36px,5vw,72px)] flex flex-wrap items-center gap-4">
          <p className={`${eyebrow} text-[10px] text-moss`}>{timing.cropLabel}</p>
          <div role="tablist" aria-label={timing.cropLabel} className="inline-flex rounded-full border border-forest/20 p-1">
            {timing.crops.map((c, i) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                id={`tm-tab-${c.id}`}
                aria-selected={i === active}
                aria-controls="tm-panel"
                onClick={() => setActive(i)}
                className={`rounded-full px-5 py-2 font-display text-[11px] tracking-[0.16em] uppercase transition-colors duration-300 ${i === active ? "bg-forest text-cream" : "text-forest/70 hover:text-forest"}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div id="tm-panel" role="tabpanel" aria-labelledby={`tm-tab-${crop.id}`} className="mt-8">
          {/* A régua. */}
          <div aria-hidden className="tm-ruler relative h-[224px] lg:h-[160px]">
            <div className="absolute inset-x-0 top-[72px] h-px bg-forest/25">
              <span className="tm-fill absolute inset-y-[-0.5px] left-0 w-full origin-left bg-forest" />
            </div>
            {MINOR.map((t) => (
              <span
                key={t}
                className={`absolute top-[72px] w-px -translate-x-1/2 bg-forest/30 ${Math.round(t * 40) % 4 === 0 ? "h-3" : "h-1.5"}`}
                style={{ left: `${t * 100}%` }}
              />
            ))}

            {crop.marks.map((mark, i) => (
              <div
                key={`${crop.id}-${i}`}
                data-at={mark.at}
                className="tm-mark group absolute top-0 flex h-[84px] -translate-x-1/2 flex-col items-center"
                style={{ left: `${mark.at * 100}%` }}
              >
                {mark.code && (
                  <span className="font-display text-[clamp(18px,2vw,34px)] leading-none tracking-[-0.02em] whitespace-nowrap text-forest/35 transition-colors duration-500 group-[.is-on]:text-forest">
                    {mark.code}
                  </span>
                )}
                <span className={`mt-auto w-px bg-forest/35 ${mark.minor ? "h-4" : "h-7"}`} />
                <span
                  className={`absolute left-1/2 -translate-x-1/2 rounded-full border-2 border-forest bg-cream transition-colors duration-500 group-[.is-on]:bg-lime ${mark.minor ? "top-[67px] size-2.5" : "top-[65px] size-3.5"}`}
                />
              </div>
            ))}

            {/* Os colchetes com a leitura de cada trecho. */}
            {crop.spans.map((span, i) => {
              const from = crop.marks[span.from].at;
              const to = crop.marks[span.to].at;
              const single = span.from === span.to;
              return (
                <div
                  key={`${crop.id}-${span.note}`}
                  className={`absolute ${i > 0 ? "top-[164px] lg:top-[96px]" : "top-[96px]"} ${single ? "-translate-x-1/2" : ""}`}
                  style={single ? { left: `${from * 100}%` } : { left: `${from * 100}%`, width: `${(to - from) * 100}%` }}
                >
                  <span className={`block h-2 border-x border-b border-forest/40 ${single ? "mx-auto w-6" : "w-full"}`} />
                  <p
                    className={`${microCaps} mt-2 w-max max-w-[min(60vw,260px)] text-[10px] text-forest/70 ${single ? "mx-auto text-center" : ""}`}
                  >
                    {span.note}
                  </p>
                </div>
              );
            })}

            <p className={`${eyebrow} absolute top-[40px] right-0 text-[9px] text-forest/45`}>{timing.season} →</p>
          </div>

          <p className="mt-4 max-w-[62ch] font-display text-[clamp(17px,1.4vw,22px)] leading-[1.35] tracking-[-0.01em]">
            {crop.summary}
          </p>
        </div>

        {/* Dose, embalagem, mistura — e a bombona. */}
        <div className="mt-[clamp(48px,6vw,96px)] grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_220px] lg:items-end lg:gap-12">
          {timing.details.map((detail) => (
            <Reveal key={detail.k} className="border-t border-forest/20 pt-4">
              <p className={`${eyebrow} text-[10px] text-moss`}>{detail.k}</p>
              <p className="mt-3 font-display text-[clamp(18px,1.5vw,24px)] leading-[1.25] tracking-[-0.01em]">{detail.v}</p>
            </Reveal>
          ))}
          <div className="relative mx-auto aspect-square w-[min(220px,60vw)] lg:mx-0 lg:w-full">
            <Image
              src="/img/pack-kmep-us.webp"
              alt={timing.jugAlt}
              fill
              sizes="220px"
              className="object-contain drop-shadow-[0_24px_30px_rgba(22,38,27,0.25)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
