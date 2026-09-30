"use client";

import { useEffect, useRef, useState } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * O aviso de "continue rolando", só no celular.
 *
 * As cenas presas (pin) trocam de tela com o scroll, e no celular nada diz
 * isso: a tela para, o leitor acha que a página acabou ali e sai. O aviso
 * aparece quando o dedo **para** dentro de uma cena presa que ainda tem o que
 * mostrar, e some no primeiro movimento.
 *
 * Não há lista de cenas: ele pergunta ao ScrollTrigger qual gatilho com pin
 * está ativo. Uma seção presa nova ganha o aviso sem tocar aqui. Pins curtos
 * (menos de meia tela) ficam de fora — ali a troca vem antes de o leitor
 * hesitar.
 */

const NARROW = "(max-width: 860px)";

/* Quanto o dedo precisa ficar parado para o aviso aparecer, em ms. */
const IDLE = 1100;

/* O aviso não aparece no fim da cena, quando rolar já solta o pin. */
const TAIL = 0.94;

function pinnedAhead() {
  const tall = window.innerHeight * 0.5;
  return ScrollTrigger.getAll().some(
    (st) =>
      !!st.pin &&
      st.isActive &&
      st.end - st.start > tall &&
      st.progress < TAIL,
  );
}

export function ScrollCue({ product }: { product: "kmep" | "aminosanB" }) {
  const label = useContent()[product].scrollCue;
  const [shown, setShown] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const narrow = window.matchMedia(NARROW);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    const check = () => {
      timer.current = undefined;
      if (!narrow.matches || still.matches) return;
      setShown(pinnedAhead());
    };

    const onScroll = () => {
      setShown(false);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(check, IDLE);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <div
      aria-hidden
      data-on={shown || undefined}
      className="scroll-cue pointer-events-none fixed inset-x-0 z-[60] flex justify-center min-[861px]:hidden"
    >
      <span className="flex items-center gap-2.5 rounded-full border border-forest/10 bg-white/85 py-2 pr-3.5 pl-3 font-display text-[10px] leading-none tracking-[0.18em] text-forest uppercase shadow-[0_6px_24px_-12px_rgba(22,38,27,0.45)] backdrop-blur-md">
        <span className="scroll-cue-track" />
        {label}
      </span>
    </div>
  );
}
