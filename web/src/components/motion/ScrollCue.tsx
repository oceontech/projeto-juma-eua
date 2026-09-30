"use client";

import { useEffect, useState } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * O aviso de "continue rolando", só no celular, no site inteiro.
 *
 * Nas cenas presas a tela não anda quando o dedo rola: quem muda é o que está
 * dentro dela. No celular nada diz isso, e o leitor acha que a página travou.
 * O aviso fica na tela **o tempo todo** em que se está numa dessas cenas, e
 * sai só quando ela solta. Entre duas cenas seguidas ele não pisca: a saída
 * espera um instante (`LINGER`) para ver se a próxima já começou.
 *
 * Não há lista de cenas. São duas as formas de prender a tela no site, e as
 * duas são achadas sozinhas:
 *
 *   pin     — os ScrollTriggers com `pin` (as partículas, o Field, o
 *             Blackout, o TwoJobs…);
 *   sticky  — uma janela `position: sticky` da altura da tela dentro de uma
 *             caixa bem mais alta, que dá o curso (as cenas da home).
 *
 * Cenas com menos de meia tela de curso ficam de fora: ali a troca vem antes
 * de o leitor hesitar.
 */

const NARROW = "(max-width: 860px)";

/* O aviso sai um pouco antes do fim do curso, quando rolar já solta a cena. */
const TAIL = 0.94;

/* Quanto a saída espera, em ms: cobre o vão entre duas cenas seguidas. */
const LINGER = 450;

type Course = { box: HTMLElement; held: number };

/* As janelas sticky, medidas no refresh: a caixa que dá o curso e a altura
   que a janela ocupa dentro dela. */
function stickyCourses(): Course[] {
  const vh = window.innerHeight;
  const found: Course[] = [];
  document
    .querySelectorAll<HTMLElement>('main .sticky, main [class*="window"]')
    .forEach((el) => {
      const box = el.parentElement;
      if (!box || getComputedStyle(el).position !== "sticky") return;
      const held = el.offsetHeight;
      if (held < vh * 0.8 || box.offsetHeight - held < vh * 0.5) return;
      found.push({ box, held });
    });
  return found;
}

function holding(courses: Course[]) {
  const vh = window.innerHeight;
  const y = window.scrollY;
  const pinned = ScrollTrigger.getAll().some((st) => {
    if (!st.pin) return false;
    const span = st.end - st.start;
    return span > vh * 0.5 && y >= st.start - 1 && y < st.start + span * TAIL;
  });
  if (pinned) return true;
  return courses.some(({ box, held }) => {
    const rect = box.getBoundingClientRect();
    const span = rect.height - held;
    return rect.top <= 1 && -rect.top < span * TAIL;
  });
}

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
      <span className="flex items-center gap-2.5 rounded-full border border-forest/10 bg-white/85 py-2 pr-3.5 pl-3 font-display text-[10px] leading-none tracking-[0.18em] text-forest uppercase shadow-[0_6px_24px_-12px_rgba(22,38,27,0.45)] backdrop-blur-md">
        <span className="scroll-cue-track" />
        {label}
      </span>
    </div>
  );
}
