"use client";

import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { SplitLines } from "@/components/motion/SplitLines";
import { gsap, useGSAP } from "@/lib/gsap";
import { eyebrow } from "./ui";

/**
 * K14 — para quem é e para quem não é. Duas colunas separadas por um fio
 * vertical que se desenha de cima para baixo; os itens entram alternados,
 * da esquerda e da direita. Lima marca o que serve; cobre, o que não serve,
 * com o texto num tom mais apagado. É a seção mais barata da página e uma
 * das mais valiosas: qualifica o lead e responde de antemão a duas objeções
 * do mapa (substituir potássio de solo, cortar dose de inseticida).
 */
export function Fit() {
  const { fit } = useContent().kmep;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const once = { trigger: ".ft-cols", start: "top 82%", once: true };
        gsap.fromTo(".ft-divider", { scaleY: 0 }, { scaleY: 1, duration: 1.3, ease: "expo.out", scrollTrigger: once });
        gsap.fromTo(".ft-yes", { x: -30, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.1, duration: 0.9, scrollTrigger: once });
        gsap.fromTo(".ft-no", { x: 30, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.1, duration: 0.9, delay: 0.15, scrollTrigger: once });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="bg-cream pb-sec text-forest">
      <div className="wrap">
        <div className="rounded-[clamp(24px,2.4vw,44px)] bg-sage/45 px-[clamp(20px,4vw,72px)] py-[clamp(40px,5vw,88px)]">
          <SplitLines className="text-[clamp(38px,4.6vw,88px)] leading-[0.95] tracking-[-0.04em]">{fit.heading}</SplitLines>

          <div className="ft-cols relative mt-[clamp(32px,4vw,64px)] grid gap-10 lg:grid-cols-2 lg:gap-0">
            {/* O fio vertical só existe lado a lado; empilhado, a segunda
                coluna abre com um fio próprio. */}
            <span aria-hidden className="ft-divider absolute top-0 left-1/2 hidden h-full w-px origin-top bg-forest/30 lg:block" />

            <div className="lg:pr-[clamp(32px,4vw,72px)]">
              <p className={`${eyebrow} flex items-center gap-3 text-olive`}>
                <span aria-hidden className="grid size-6 place-items-center rounded-full bg-lime text-forest">
                  <svg viewBox="0 0 16 16" className="size-3.5">
                    <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {fit.fits.label}
              </p>
              <p className="mt-6 font-display text-[clamp(15px,1.2vw,18px)] text-forest/60">{fit.fits.lead}</p>
              <ul className="mt-2">
                {fit.fits.items.map((item) => (
                  <li
                    key={item}
                    className="ft-yes border-b border-forest/15 py-4 font-display text-[clamp(20px,1.8vw,30px)] leading-[1.12] tracking-[-0.02em]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-forest/30 pt-10 lg:border-t-0 lg:pt-0 lg:pl-[clamp(32px,4vw,72px)]">
              <p className={`${eyebrow} flex items-center gap-3 text-kmep`}>
                <span aria-hidden className="grid size-6 place-items-center rounded-full border border-kmep text-kmep">
                  <svg viewBox="0 0 16 16" className="size-3">
                    <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                {fit.notFit.label}
              </p>
              <p className="mt-6 font-display text-[clamp(15px,1.2vw,18px)] text-forest/50">{fit.notFit.lead}</p>
              <ul className="mt-2">
                {fit.notFit.items.map((item) => (
                  <li
                    key={item}
                    className="ft-no border-b border-forest/10 py-4 font-display text-[clamp(20px,1.8vw,30px)] leading-[1.12] tracking-[-0.02em] text-forest/50"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-[clamp(40px,5vw,80px)] border-t-2 border-forest pt-[clamp(20px,2.4vw,36px)]">
            <p className="max-w-[34ch] font-display text-[clamp(24px,2.6vw,46px)] leading-[1.06] tracking-[-0.03em]">
              {fit.close[0]} <span className="text-forest/60">{fit.close[1]}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
