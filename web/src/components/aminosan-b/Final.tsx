"use client";

import Image from "next/image";
import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { SplitLines } from "@/components/motion/SplitLines";
import { TrialForm } from "@/components/home/TrialForm";
import { microCaps } from "./ui";

/**
 * Fecho da página: o pedido de faixa de teste. Usa o mesmo formulário da
 * home (mesma Server Action), então o lead das duas versões cai no mesmo
 * lugar — o que torna o teste A/B comparável. O campo `source` diz de qual
 * versão ele veio. A foto do produtor fica no fundo, bem escurecida, e o
 * formulário vive num card branco por cima, como na home.
 */
export function Final() {
  const { final } = useContent().aminosanB;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(".fn-photo", { scale: 1.15 }, {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: scope.current, start: "top bottom", end: "center center", scrub: 0.6 },
        });
        gsap.from(".fn-card", {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: ".fn-card", start: "top 88%", once: true },
        });
      });
    },
    { scope },
  );

  return (
    <section id="trial-form" ref={scope} className="bg-white py-[clamp(40px,6vw,96px)]">
      <div className="wrap">
        <div className="relative isolate grid gap-[clamp(28px,4vw,72px)] grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[clamp(24px,2.4vw,44px)] bg-forest p-[clamp(20px,3vw,48px)] max-md:px-0 text-cream lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Image
            src="/img/aminosan-b/final-grower.webp"
            alt={final.alt}
            fill
            quality={90}
            sizes="(min-width: 1400px) 1360px, 100vw"
            className="fn-photo -z-20 object-cover object-[60%_center]"
          />
          <div aria-hidden className="absolute inset-0 -z-10 bg-forest/80" />

          <div className="flex flex-col gap-6 py-[clamp(8px,1.2vw,20px)] max-md:px-5">
            <SplitLines className="max-w-[14ch] text-[clamp(40px,4.6vw,88px)] leading-[0.95] tracking-[-0.035em]">
              {final.heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </SplitLines>
            <p className={`${microCaps} max-w-[50ch] text-cream/80`}>{final.body}</p>
          </div>

          <div className="fn-card relative max-md:-mr-px max-md:w-[calc(100%+1px)] rounded-[clamp(18px,1.8vw,30px)] bg-white p-[clamp(20px,2.4vw,40px)] text-ink shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)]">
            <TrialForm source="aminosan" />
          </div>
        </div>
      </div>
    </section>
  );
}
