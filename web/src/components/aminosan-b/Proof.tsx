"use client";

import Image from "next/image";
import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { Counter } from "@/components/motion/Counter";
import { SplitLines } from "@/components/motion/SplitLines";
import { microCaps } from "./ui";

/**
 * Prova em tela dividida: a foto do produtor se abre de baixo para cima
 * presa ao scroll, e os números entram em lista com fio entre as linhas,
 * cada um contando até o valor.
 */
export function Proof() {
  const { proof } = useContent().aminosanB;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            scrollTrigger: { trigger: scope.current, start: "top 85%", end: "center center", scrub: 0.6 },
          })
          .fromTo(".pf-photo-wrap", { clipPath: "inset(30% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }, 0)
          .fromTo(".pf-photo", { scale: 1.25 }, { scale: 1, ease: "none" }, 0);

        gsap.from(".pf-row", {
          opacity: 0,
          y: 24,
          stagger: 0.1,
          duration: 0.9,
          scrollTrigger: { trigger: ".pf-list", start: "top 85%", once: true },
        });
        gsap.from(".pf-rule", {
          scaleX: 0,
          transformOrigin: "left center",
          stagger: 0.1,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: ".pf-list", start: "top 85%", once: true },
        });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="grid bg-cream text-forest lg:grid-cols-2">
      <div className="pf-photo-wrap relative h-[26svh] overflow-hidden lg:h-auto lg:min-h-[100svh]">
        <Image
          src="/img/aminosan-b/proof-farmer.webp"
          alt={proof.alt}
          fill
          quality={90}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="pf-photo object-cover object-[40%_center]"
        />
      </div>

      <div className="flex flex-col px-[var(--spacing-gut)] py-5 lg:px-[clamp(40px,5vw,96px)] lg:py-[clamp(56px,7vw,110px)]">
        <SplitLines className="text-[clamp(26px,7vw,34px)] leading-[0.98] lg:text-[clamp(34px,3.6vw,64px)] tracking-[-0.03em]">
          {proof.heading.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </SplitLines>

        <dl className="pf-list mt-3 lg:mt-[clamp(40px,6vw,96px)]">
          {proof.stats.map((stat) => (
            <div key={stat.label} className="pf-row relative grid grid-cols-[1fr_auto] items-end gap-4 py-2 lg:gap-6 lg:py-5">
              <span aria-hidden className="pf-rule absolute inset-x-0 top-0 h-px bg-forest/20" />
              <dt className="order-2 max-w-[22ch] text-right text-[10px] leading-[1.3] lg:text-[11px] lg:leading-[1.4] tracking-[0.12em] text-forest/65 uppercase">
                {stat.label}
              </dt>
              <dd className="order-1 font-display text-[clamp(30px,9vw,40px)] leading-[0.9] lg:text-[clamp(44px,4.6vw,84px)] tracking-[-0.04em] text-forest">
                <Counter to={stat.value} />
                {stat.suffix}
              </dd>
            </div>
          ))}
        </dl>

        <p className={`${microCaps} mt-3 max-w-[56ch] text-[10px] lg:mt-8 lg:text-[11px] text-forest/60`}>{proof.note}</p>
      </div>
    </section>
  );
}
