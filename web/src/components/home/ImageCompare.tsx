"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import { Pill } from "@/components/ui";
import { proof } from "@/content/home";
import { gsap, useGSAP, type ScrollTrigger } from "@/lib/gsap";

/** Onde o corte assenta depois que o scroll termina de abri-lo. */
const RESTING = 50;

/**
 * Comparador antes/depois. As duas fotos ocupam a mesma caixa e o corte da
 * de cima anda com o ponteiro — na horizontal no desktop, na vertical no
 * mobile, como nos dois frames do Figma.
 *
 * Duas coisas mexem no corte, nesta ordem:
 *
 *   o scroll   enquanto a seção entra, o corte anda de 100 até a metade
 *              sozinho. É a demonstração se dando: quem chega vê a faixa
 *              tratada abrir sobre a testemunha sem precisar descobrir que
 *              dá para arrastar — que é o defeito de todo comparador que
 *              espera pelo arrasto;
 *
 *   o ponteiro no primeiro toque ele assume, e o gatilho de scroll é morto
 *              ali mesmo. Sem isso os dois escreveriam no mesmo valor e a
 *              rolagem arrancaria o corte da mão de quem está arrastando.
 *
 * O valor mora no estilo do elemento, escrito direto pelo GSAP e pelos
 * handlers, e não em estado do React: são dezenas de quadros por segundo, e
 * cada um viraria uma renderização de árvore inteira para andar com um corte.
 *
 * O <input type="range"> não recebe ponteiro: existe para quem navega por
 * teclado. O arrasto real vem de pointer events na caixa.
 */
export function ImageCompare() {
  const box = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLInputElement>(null);
  const reveal = useRef<ScrollTrigger | null>(null);
  const taken = useRef(false);

  const apply = useCallback((value: number) => {
    const clamped = Math.max(0, Math.min(100, value));
    box.current?.style.setProperty("--split", `${clamped}%`);
    if (slider.current) slider.current.value = String(clamped);
  }, []);

  /* O ponteiro assume de vez: mata a abertura automática e apaga a dica. */
  const takeOver = useCallback(() => {
    if (taken.current) return;
    taken.current = true;
    reveal.current?.kill();
    reveal.current = null;
    box.current?.setAttribute("data-touched", "on");
  }, []);

  useGSAP(
    () => {
      const el = box.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { animate } = context.conditions as { animate: boolean };

          if (!animate) {
            apply(RESTING);
            return;
          }

          const cut = { value: 100 };
          apply(100);

          const tween = gsap.to(cut, {
            value: RESTING,
            ease: "power2.inOut",
            onUpdate: () => apply(cut.value),
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              end: "top 34%",
              scrub: true,
            },
          });

          reveal.current = tween.scrollTrigger ?? null;

          return () => {
            reveal.current = null;
          };
        },
      );
    },
    { scope: box, dependencies: [apply] },
  );

  const fromPointer = useCallback(
    (event: { clientX: number; clientY: number }) => {
      const el = box.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vertical = window.matchMedia("(max-width: 860px)").matches;
      apply(
        vertical
          ? ((event.clientY - rect.top) / rect.height) * 100
          : ((event.clientX - rect.left) / rect.width) * 100,
      );
    },
    [apply],
  );

  /* O move e o up ficam na janela, não na caixa: mexer o corte troca o
     elemento sob o cursor, e um listener preso à caixa perde o arrasto no
     primeiro movimento. */
  const onPointerDown = useCallback(
    (event: React.PointerEvent) => {
      takeOver();
      fromPointer(event);

      const onMove = (e: PointerEvent) => {
        fromPointer(e);
        e.preventDefault();
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    },
    [fromPointer, takeOver],
  );

  return (
    <div ref={box} className="compare" onPointerDown={onPointerDown}>
      <Image
        src="/img/proof-untreated.jpg"
        alt={proof.compare.beforeAlt}
        width={1020}
        height={700}
      />
      <Image
        className="compare-after"
        src="/img/proof-treated.jpg"
        alt={proof.compare.afterAlt}
        width={980}
        height={700}
      />

      <Pill
        dark
        className="absolute top-[clamp(14px,2.6vw,50px)] left-[clamp(14px,2.6vw,50px)] z-3 max-[860px]:left-1/2 max-[860px]:-translate-x-1/2"
      >
        {proof.compare.beforeLabel}
      </Pill>
      <Pill className="absolute top-[clamp(14px,2.6vw,50px)] right-[clamp(14px,2.6vw,50px)] z-3 max-[860px]:top-auto max-[860px]:right-auto max-[860px]:bottom-[clamp(14px,2.6vw,50px)] max-[860px]:left-1/2 max-[860px]:-translate-x-1/2">
        {proof.compare.afterLabel}
      </Pill>

      <div className="compare-handle" aria-hidden />

      <input
        ref={slider}
        type="range"
        min={0}
        max={100}
        step={0.1}
        defaultValue={RESTING}
        onInput={(e) => {
          takeOver();
          apply(Number(e.currentTarget.value));
        }}
        aria-label="Reveal the treated strip"
      />
    </div>
  );
}
