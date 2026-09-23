"use client";

import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * A janela de aplicação como régua de estágios.
 *
 * Cada cultura tem uma faixa sobre a mesma régua, e a faixa se desenha da
 * esquerda para a direita quando entra em tela. O que ela marca são estágios
 * fenológicos — V2, R5 —, que é a unidade em que o produtor americano pensa a
 * safra; nunca datas, que variam com o estado e o ano.
 */
export function Window() {
  const { window: win } = useContent().aminosanC;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".wn-span",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            stagger: 0.14,
            ease: "power3.out",
            scrollTrigger: { trigger: ".wn-grid", start: "top 80%", once: true },
          },
        );
        gsap.fromTo(
          ".wn-mark",
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.04,
            ease: "power2.out",
            delay: 0.35,
            scrollTrigger: { trigger: ".wn-grid", start: "top 80%", once: true },
          },
        );
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      data-nav-theme="dark"
      className="relative bg-[#061114] py-[clamp(72px,10vw,150px)] text-[#CFE6E3]"
    >
      <div className="wrap relative">
        <p className="sc-tag">{win.tag}</p>
        <h2 className="mt-5 max-w-[16ch] text-[clamp(28px,3.3vw,56px)] leading-[1.02] tracking-[-0.03em] text-white">
          {win.heading.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </h2>
        <p className="mt-5 max-w-[44ch] text-[clamp(13px,1vw,16px)] leading-[1.55] text-[#93B3B0]">
          {win.body}
        </p>

        <div className="wn-grid mt-[clamp(40px,5vw,80px)] grid gap-[clamp(32px,4vw,56px)]">
          {win.crops.map((crop) => (
            <div key={crop.name} className="grid gap-4 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] lg:items-center lg:gap-10">
              <div>
                <h3 className="text-[clamp(18px,1.6vw,26px)] leading-[1.1] tracking-[-0.02em] text-white">
                  {crop.name}
                </h3>
                <p className="sc-tag mt-2 text-[#7FE7D2]">{crop.range}</p>
                <p className="mt-2 max-w-[34ch] text-[13px] leading-[1.5] text-[#6F918E]">{crop.note}</p>
              </div>

              <div className="relative pt-5 pb-7">
                <span aria-hidden className="absolute inset-x-0 top-5 h-px bg-[#153036]" />
                {/* A faixa da cultura, entre os dois pontos da régua. */}
                <span
                  aria-hidden
                  className="wn-span absolute top-[18px] h-[3px] origin-left bg-[#7FE7D2]"
                  style={{
                    left: `${crop.span[0] * 100}%`,
                    width: `${(crop.span[1] - crop.span[0]) * 100}%`,
                  }}
                />
                <div className="relative flex justify-between">
                  {crop.marks.map((mark) => (
                    <span key={mark} className="wn-mark flex flex-col items-center gap-2">
                      <span aria-hidden className="block size-[7px] rounded-full bg-[#7FE7D2]" />
                      <span className="sc-tag text-[10px] text-[#8FB6B3]">{mark}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
