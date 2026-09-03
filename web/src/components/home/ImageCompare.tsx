"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Pill } from "@/components/ui";
import { proof } from "@/content/home";

/**
 * Comparador antes/depois. As duas fotos ocupam a mesma caixa e o corte da
 * de cima anda com o ponteiro — na horizontal no desktop, na vertical no
 * mobile, como nos dois frames do Figma.
 *
 * O <input type="range"> não recebe ponteiro: existe para quem navega por
 * teclado. O arrasto real vem de pointer events na caixa.
 */
export function ImageCompare() {
  const box = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(50);

  const set = useCallback((value: number) => {
    setSplit(Math.max(0, Math.min(100, value)));
  }, []);

  const fromPointer = useCallback(
    (event: { clientX: number; clientY: number }) => {
      const el = box.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vertical = window.matchMedia("(max-width: 860px)").matches;
      set(
        vertical
          ? ((event.clientY - rect.top) / rect.height) * 100
          : ((event.clientX - rect.left) / rect.width) * 100,
      );
    },
    [set],
  );

  /* O move e o up ficam na janela, não na caixa: mexer o corte troca o
     elemento sob o cursor, e um listener preso à caixa perde o arrasto no
     primeiro movimento. */
  const onPointerDown = useCallback(
    (event: React.PointerEvent) => {
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
    [fromPointer],
  );

  return (
    <div
      ref={box}
      className="compare"
      style={{ "--split": `${split}%` } as React.CSSProperties}
      onPointerDown={onPointerDown}
    >
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
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={split}
        onChange={(e) => set(Number(e.target.value))}
        aria-label="Reveal the treated strip"
      />
    </div>
  );
}
