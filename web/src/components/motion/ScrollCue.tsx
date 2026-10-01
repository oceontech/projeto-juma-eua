"use client";

import { useEffect, useState } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { ScrollTrigger } from "@/lib/gsap";
import { holding, stickyCourses, type Course } from "@/lib/scroll-hold";

/**
 * O aviso de "continue rolando", só no celular, no site inteiro.
 *
 * Nas cenas presas a tela não anda quando o dedo rola: quem muda é o que está
 * dentro dela. No celular nada diz isso, e o leitor acha que a página travou.
 * O aviso fica na tela **o tempo todo** em que se está numa dessas cenas, e
 * sai só quando ela solta. Entre duas cenas seguidas ele não pisca: a saída
 * espera um instante (`LINGER`) para ver se a próxima já começou.
 *
 * Não há lista de cenas: quem diz se a tela está presa é `lib/scroll-hold.ts`.
 *
 * Fundo opaco, sem `backdrop-blur`: um desfoque fixo por cima do canvas da
 * cena de partículas é refeito a cada quadro e pesava na rolagem do celular.
 */

const NARROW = "(max-width: 860px)";

/* Quanto a saída espera, em ms: cobre o vão entre duas cenas seguidas. */
const LINGER = 450;

export function ScrollCue() {
  const label = useContent().home.scrollCue;
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const narrow = window.matchMedia(NARROW);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let courses: Course[] = [];
    let frame = 0;
    let off: number | undefined;

    const check = () => {
      frame = 0;
      const on = narrow.matches && !still.matches && holding(courses);
      if (on) {
        window.clearTimeout(off);
        off = undefined;
        setShown(true);
      } else if (off === undefined) {
        off = window.setTimeout(() => {
          off = undefined;
          setShown(false);
        }, LINGER);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    const measure = () => {
      courses = stickyCourses();
      onScroll();
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    ScrollTrigger.addEventListener("refresh", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      ScrollTrigger.removeEventListener("refresh", measure);
      cancelAnimationFrame(frame);
      window.clearTimeout(off);
    };
  }, []);

  return (
    <div
      aria-hidden
      data-on={shown || undefined}
      className="scroll-cue pointer-events-none fixed inset-x-0 z-[60] flex justify-center min-[861px]:hidden"
    >
      <span className="flex items-center gap-2.5 rounded-full border border-forest/10 bg-white py-2 pr-3.5 pl-3 font-display text-[10px] leading-none tracking-[0.18em] text-forest uppercase shadow-[0_6px_24px_-12px_rgba(22,38,27,0.45)]">
        <span className="scroll-cue-track" />
        {label}
      </span>
    </div>
  );
}
