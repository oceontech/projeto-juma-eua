"use client";

import Image from "next/image";
import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { SplitLines } from "@/components/motion/SplitLines";
import { microCaps } from "./ui";

/**
 * As perguntas como o "latest from the community" da referência: a cena
 * prende sobre o fundo claro de folhas e o trilho de cartões corre para a esquerda
 * conforme a página rola. Cada cartão é uma foto com a caixa creme
 * sobreposta. O título fica centralizado acima e o trilho corre de ponta
 * a ponta, só com o scroll — sem setas.
 */
export function Questions() {
  const { questions } = useContent().aminosanB;
  const scope = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = track.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* Quanto o trilho precisa andar: até o último cartão encostar na
           margem direita. Medido a cada refresh, porque depende da janela. */
        const distance = () => Math.max(0, el.scrollWidth - el.clientWidth);

        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".qs-stage",
            start: "top top",
            end: () => `+=${distance() + window.innerHeight * 0.4}`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.fromTo(
          ".qs-bg",
          { scale: 1.15 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".qs-stage",
              start: "top bottom",
              end: () => `+=${distance() + window.innerHeight * 2}`,
              scrub: true,
            },
          },
        );
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="bg-white text-forest">
      <div
        className="qs-stage relative h-[100svh] overflow-hidden"
        style={{
          ["--rail-gut" as string]:
            "max(var(--spacing-gut), calc((100vw - var(--container-wrap)) / 2))",
        }}
      >
        <div className="qs-bg absolute inset-0">
          <Image
            src="/img/aminosan-b/questions-leaves.webp"
            alt=""
            fill
            sizes="100vw"
            quality={90}
            className="object-cover"
          />
        </div>

        <div className="relative flex h-full flex-col justify-center gap-[clamp(28px,5svh,56px)] pt-[clamp(72px,10svh,110px)] pb-[clamp(32px,6svh,64px)]">
          <div className="px-[var(--spacing-gut)] text-center">
            <SplitLines className="text-[clamp(34px,3.8vw,64px)] leading-[0.98] tracking-[-0.03em]">
              {questions.heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </SplitLines>
          </div>

          {/* O trilho ocupa a largura toda: os cartões correm de ponta a ponta. */}
          <div className="w-full overflow-hidden motion-reduce:overflow-x-auto">
            <div
              ref={track}
              className="flex gap-4 px-[var(--rail-gut)] will-change-transform"
            >
              {questions.items.map((item, i) => (
                <article
                  key={item.q}
                  className="relative h-[min(540px,60svh)] w-[min(82vw,430px)] shrink-0"
                >
                  <div className="absolute top-0 left-0 h-[72%] w-[64%] overflow-hidden rounded-[16px]">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute right-0 bottom-0 flex h-[64%] w-[76%] flex-col rounded-[16px] bg-cream p-5 text-forest shadow-[0_18px_40px_-18px_rgba(22,38,27,0.28)]">
                    <span className="font-display text-[11px] tracking-[0.16em] text-moss">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 font-display text-[17px] leading-[1.2] font-medium tracking-[0.02em] uppercase">
                      {item.q}
                    </h3>
                    <p className={`${microCaps} mt-auto text-forest/70`}>
                      {item.a}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
