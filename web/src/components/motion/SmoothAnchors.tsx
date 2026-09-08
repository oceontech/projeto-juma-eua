"use client";

import { useEffect } from "react";
import { gsap, HEADER_OFFSET } from "@/lib/gsap";

/**
 * Rolagem suave dos links de âncora, pelo GSAP.
 *
 * Por que não `scroll-behavior: smooth` no CSS, que seria uma linha: a
 * rolagem nativa suave briga com o ScrollTrigger. O navegador anima o scroll
 * por fora do frame do GSAP, e animações com `scrub` — o parallax do hero —
 * ficam trepidando enquanto ela acontece. Trocar por ScrollToPlugin coloca as
 * duas coisas no mesmo ciclo de animação.
 *
 * Um listener só, delegado no documento: não precisa tocar em cada <Link>.
 */
export function SmoothAnchors() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      /* Deixa passar clique com modificador, botão do meio e afins — quem
         faz isso quer abrir em outra aba. */
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement).closest("a");
      const href = anchor?.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        target.scrollIntoView();
        history.pushState(null, "", href);
        return;
      }

      /* A posição é calculada aqui, e não pelo `offsetY` do plugin: assim o
         desconto da barra fixa é explícito e fácil de conferir. */
      const y = Math.max(
        0,
        target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET,
      );

      gsap.to(window, {
        duration: 0.9,
        ease: "power2.inOut",
        scrollTo: { y, autoKill: true },
        onComplete: () => history.pushState(null, "", href),
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
