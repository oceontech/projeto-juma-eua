"use client";

import { scroller } from "@/components/motion/SmoothScroll";
import s from "./SiteFooter.module.css";

/** Volta ao topo pelo dono da rolagem — o Lenis no desktop, o navegador no resto. */
export function BackToTop({ label }: { label: string }) {
  const onClick = () => {
    const lenis = scroller();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.6 });
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button type="button" onClick={onClick} className={s.backToTop}>
      <span aria-hidden className={s.backIcon}>
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M10 16V4M4.5 9.5 10 4l5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {label}
    </button>
  );
}
