"use client";

import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { SplitLines } from "@/components/motion/SplitLines";
import { gsap, useGSAP } from "@/lib/gsap";
import { microCaps } from "./ui";

/**
 * K16 — as perguntas, no trilho horizontal pinado da LP B: a cena prende e
 * o trilho corre para a esquerda conforme a página rola, sem setas. Cartões
 * sem foto — aqui a caixa creme sozinha é mais honesta.
 *
 * "Seus ensaios são do Brasil" entra primeiro, mais largo e no escuro: é a
 * resposta mais importante da página. As três perguntas que aguardam dado
 * (espuma, registro por estado, dado americano) estão comentadas no conteúdo,
 * prontas para voltar — nunca com "[PENDING]" na tela.
 *
 * Sem movimento, o pin não existe e o trilho vira rolagem horizontal comum.
 */
export function Questions() {
  const { questions } = useContent().kmep;
  const scope = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const el = track.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* Quanto o trilho anda: até o último cartão encostar na margem
           direita. Medido a cada refresh, porque depende da janela. */
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
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="bg-white text-forest">
      <div
        className="qs-stage relative flex min-h-[100svh] flex-col justify-center gap-[clamp(20px,4svh,48px)] overflow-hidden pt-[clamp(72px,10svh,110px)] pb-[clamp(24px,5svh,56px)]"
        style={{
          ["--rail-gut" as string]: "max(var(--spacing-gut), calc((100vw - var(--container-wrap)) / 2))",
        }}
      >
        <div className="px-[var(--rail-gut)]">
          <SplitLines className="max-w-[14ch] text-[clamp(32px,3.8vw,68px)] leading-[0.98] tracking-[-0.03em]">
            {questions.heading}
          </SplitLines>
        </div>

        <div className="w-full overflow-hidden motion-reduce:overflow-x-auto">
          <ol ref={track} className="flex gap-3 px-[var(--rail-gut)] will-change-transform md:gap-4">
            {questions.items.map((item, i) => {
              const lead = i === 0;
              return (
                <li
                  key={item.q}
                  className={`flex min-h-[min(440px,58svh)] shrink-0 flex-col rounded-[clamp(14px,1.2vw,20px)] p-5 md:p-7 ${lead ? "w-[min(88vw,560px)] bg-forest text-offwhite" : "w-[min(88vw,400px)] bg-cream"}`}
                >
                  <span className={`font-display text-[11px] tracking-[0.16em] ${lead ? "text-lime" : "text-moss"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {lead && <span aria-hidden className="mt-4 block h-[2px] w-12 rounded-full bg-lime" />}
                  <h3
                    className={`mt-3 font-display leading-[1.12] tracking-[-0.015em] ${lead ? "text-[clamp(24px,2.3vw,38px)]" : "text-[clamp(19px,1.5vw,24px)]"}`}
                  >
                    {item.q}
                  </h3>
                  <p className={`${microCaps} mt-auto pt-6 ${lead ? "text-[12px] text-offwhite/80" : "text-forest/70"}`}>
                    {item.a}
                    {/* HOLD P2 — remover junto com Flush.tsx */}
                    {item.hold && <> {item.hold}</>}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
