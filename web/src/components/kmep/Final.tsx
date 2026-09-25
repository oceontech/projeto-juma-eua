"use client";

import Image from "next/image";
import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { SplitLines } from "@/components/motion/SplitLines";
import { TrialForm } from "@/components/home/TrialForm";
import { gsap, useGSAP } from "@/lib/gsap";
import { microText } from "./ui";

/**
 * K17 — o pedido. O desenho do Final da LP B: bloco floresta arredondado
 * sobre o branco, a colheita ao fundo bem escurecida (é onde a faixa de teste
 * termina: no monitor, com a gente ao lado), e o formulário num card branco.
 *
 * O formulário é o mesmo da home e da LP B, na variante reduzida de quatro
 * campos — mesma Server Action, então o lead cai no mesmo lugar e o campo
 * `source` separa a origem.
 *
 * A ressalva de rodapé é obrigatória e fica dentro da seção.
 */
export function Final() {
  const { final } = useContent().kmep;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".fn-photo",
          { scale: 1.15 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: scope.current, start: "top bottom", end: "center center", scrub: 0.6 },
          },
        );
        gsap.fromTo(
          ".fn-card",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".fn-card", start: "top 88%", once: true } },
        );
      });
    },
    { scope },
  );

  return (
    <section id="trial-form" ref={scope} className="bg-white py-[clamp(40px,6vw,96px)]">
      <div className="wrap">
        <div className="relative isolate grid gap-[clamp(28px,4vw,72px)] grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[clamp(24px,2.4vw,44px)] bg-forest p-[clamp(20px,3vw,48px)] max-md:px-0 text-cream lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="fn-photo absolute inset-0 -z-20">
            <Image
              src="/img/step-3-harvest.webp"
              alt={final.alt}
              fill
              quality={90}
              sizes="(min-width: 1400px) 1360px, 100vw"
              className="object-cover object-[35%_center]"
            />
          </div>
          <div aria-hidden className="absolute inset-0 -z-10 bg-forest/82" />

          <div className="flex flex-col gap-6 py-[clamp(8px,1.2vw,20px)] max-md:px-5">
            <SplitLines className="max-w-[13ch] text-[clamp(40px,4.6vw,88px)] leading-[0.95] tracking-[-0.035em] text-balance">
              {final.heading}
            </SplitLines>
            <p className={`${microText} max-w-[50ch] text-cream/85`}>{final.body}</p>
          </div>

          <div className="fn-card relative max-md:-mr-px max-md:w-[calc(100%+1px)] rounded-[clamp(18px,1.8vw,30px)] bg-white p-[clamp(20px,2.4vw,40px)] text-ink shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)]">
            <TrialForm source="kmep" compact />
          </div>
        </div>

        <p className={`${microText} mx-auto mt-[clamp(20px,2.4vw,36px)] max-w-[92ch] text-center text-forest/65`}>
          {final.disclaimer}
        </p>
      </div>
    </section>
  );
}
