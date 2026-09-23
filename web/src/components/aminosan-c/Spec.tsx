"use client";

import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * O painel de especificação: o rótulo lido como ficha de instrumento.
 *
 * As linhas entram uma a uma, com o filete se estendendo antes do texto — o
 * gesto de um terminal escrevendo, que é a gramática da página. Nada aqui é
 * dado novo: é a mesma ficha do produto em `content/aminosan-c.ts`.
 */
export function Spec() {
  const { spec } = useContent().aminosanC;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const start = { trigger: ".sp-list", start: "top 82%", once: true };
        gsap.fromTo(
          ".sp-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.7, stagger: 0.06, ease: "power3.out", scrollTrigger: start },
        );
        gsap.fromTo(
          ".sp-row > *",
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.03,
            ease: "power2.out",
            delay: 0.12,
            scrollTrigger: start,
          },
        );
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      data-nav-theme="dark"
      className="relative bg-[#04090B] py-[clamp(72px,10vw,150px)] text-[#CFE6E3]"
    >
      <div aria-hidden className="sc-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="wrap relative grid gap-[clamp(32px,5vw,80px)] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div>
          <p className="sc-tag">{spec.tag}</p>
          <h2 className="mt-5 text-[clamp(28px,3.3vw,56px)] leading-[1.02] tracking-[-0.03em] text-white">
            {spec.heading.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </h2>
          <p className="mt-5 max-w-[42ch] text-[clamp(13px,1vw,16px)] leading-[1.55] text-[#93B3B0]">
            {spec.body}
          </p>
        </div>

        <dl className="sp-list">
          {spec.rows.map((row) => (
            <div key={row.k} className="sp-row relative py-[clamp(14px,1.5vw,22px)]">
              <span aria-hidden className="sp-line absolute inset-x-0 top-0 h-px origin-left bg-[#153036]" />
              <div className="grid grid-cols-[minmax(0,0.6fr)_minmax(0,1fr)] items-baseline gap-5">
                <dt className="sc-tag text-[#4E7C7A]">{row.k}</dt>
                <dd className="text-[clamp(14px,1.15vw,19px)] leading-[1.3] text-white">{row.v}</dd>
              </div>
            </div>
          ))}
          <span aria-hidden className="sp-line block h-px origin-left bg-[#153036]" />
        </dl>
      </div>
    </section>
  );
}
