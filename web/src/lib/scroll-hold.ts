"use client";

import { ScrollTrigger } from "@/lib/gsap";

/**
 * Se a rolagem está agora dentro de uma cena que prende a tela.
 *
 * São duas as formas de prender a tela no site, e as duas são achadas
 * sozinhas, sem lista:
 *
 *   pin     — os ScrollTriggers com `pin` (as partículas, o Field, o
 *             Blackout, o TwoJobs…);
 *   sticky  — uma janela `position: sticky` da altura da tela dentro de uma
 *             caixa bem mais alta, que dá o curso (as cenas da home).
 *
 * Cenas com menos de meia tela de curso ficam de fora: ali a troca vem antes
 * de o leitor hesitar. Quem usa: o aviso de "continue rolando"
 * (`ScrollCue.tsx`).
 */

export type Course = { box: HTMLElement; held: number };

/* A cena conta como solta um pouco antes do fim do curso, quando rolar já a
   leva embora. */
const TAIL = 0.94;

/** As janelas sticky, medidas no refresh: a caixa do curso e a altura da janela. */
export function stickyCourses(): Course[] {
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

export function holding(courses: Course[]) {
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
