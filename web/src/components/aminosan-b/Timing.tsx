"use client";

import Image from "next/image";
import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { Cta, microCaps } from "./ui";

/**
 * "Feito para as semanas que decidem": texto no creme à esquerda, com o título no
 * topo e o corpo assentado no pé, e as mãos com a soja à direita. A foto
 * anda mais devagar que a página (parallax interno), o que dá a ela o peso
 * de objeto em vez de figura colada.
 */
export function Timing() {
  const { timing } = useContent().aminosanB;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".tm-photo",
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: "none",
            scrollTrigger: { trigger: scope.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="grid bg-cream text-forest lg:min-h-[100svh] lg:grid-cols-2">
      <div className="flex flex-col px-[var(--spacing-gut)] py-[clamp(56px,7vw,110px)] lg:px-[clamp(40px,5vw,96px)]">
        <SplitLines className="max-w-[12ch] text-[clamp(38px,4.2vw,76px)] leading-[0.96] tracking-[-0.035em] text-forest">
          {timing.heading}
        </SplitLines>

        <Reveal stagger={0.1} className="mt-12 max-w-[48ch] lg:mt-auto">
          {timing.body.map((p) => (
            <p key={p} className={`${microCaps} mt-4 text-forest/75 first:mt-0`}>
              {p}
            </p>
          ))}
          <div className="mt-8">
            <Cta href={timing.cta.href} tone="dark">
              {timing.cta.label}
            </Cta>
          </div>
        </Reveal>
      </div>

      <div className="relative min-h-[80svh] overflow-hidden lg:min-h-0">
        <div className="tm-photo absolute inset-[-12%_0] will-change-transform">
          <Image
            src="/img/aminosan-b/timing-hands.webp"
            alt={timing.alt}
            fill
            quality={90}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
