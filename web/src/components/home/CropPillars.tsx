"use client";

import { useRef } from "react";
import { gsap, useGSAP, START } from "@/lib/gsap";

type Pillar = { title: string; detail: string };

/**
 * A prova entra como uma sequência só: identificação, argumento, nota e,
 * por fim, os quatro pontos. Cada camada usa um gesto distinto para não
 * transformar o painel em mais uma entrada vertical genérica.
 */
export function CropPillars({
  title,
  lead,
  note,
  pillars,
}: {
  title: string;
  lead: string;
  note: string;
  pillars: Pillar[];
}) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const panel = scope.current!;
      const label = panel.querySelector<HTMLElement>("[data-pillars-label]")!;
      const heading = panel.querySelector<HTMLElement>("[data-pillars-heading]")!;
      const noteEl = panel.querySelector<HTMLElement>("[data-pillars-note]")!;
      const items = Array.from(panel.querySelectorAll<HTMLElement>("[data-pillars-item]"));
      const accents = Array.from(panel.querySelectorAll<HTMLElement>("[data-pillars-accent]"));
      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { animate } = context.conditions as { animate: boolean };

          if (!animate) {
            gsap.set([panel, label, heading, noteEl, ...items, ...accents], {
              clearProps: "all",
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              scaleX: 1,
              filter: "none",
            });
            return;
          }

          const timeline = gsap.timeline({
            scrollTrigger: { trigger: panel, start: START, once: true },
          });

          timeline
            .fromTo(panel, { scale: 0.88, transformOrigin: "center center" }, { scale: 1, duration: 0.82, ease: "power3.out" })
            .fromTo(label, { opacity: 0, scaleX: 0, transformOrigin: "left center" }, { opacity: 1, scaleX: 1, duration: 0.34, ease: "power3.out" }, "-=0.22")
            .fromTo(heading, { opacity: 0, y: 30, filter: "blur(7px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.62, ease: "power4.out" }, "-=0.12")
            .fromTo(noteEl, { opacity: 0, x: 22 }, { opacity: 1, x: 0, duration: 0.48, ease: "power3.out" }, "-=0.34")
            .fromTo(accents, { scaleY: 0, transformOrigin: "top center" }, { scaleY: 1, duration: 0.34, ease: "power3.out", stagger: 0.075 }, "-=0.18")
            .fromTo(items, { opacity: 0, y: 24, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.52, ease: "power3.out", stagger: 0.085 }, "-=0.26");
        },
      );
    },
    { scope, dependencies: [title, lead, note, pillars] },
  );

  return (
    <section
      ref={scope}
      aria-label={title}
      className="mt-[clamp(28px,3vw,52px)] overflow-hidden rounded-[clamp(18px,1.55vw,30px)] bg-linear-[149.8deg,var(--color-night-warm)_2.4%,var(--color-night-deep)_60.23%] text-offwhite shadow-[0_18px_42px_rgb(0_0_0/0.18)] will-change-transform"
    >
      <div className="grid gap-6 px-[clamp(22px,3vw,54px)] pt-[clamp(24px,2.8vw,48px)] pb-[clamp(22px,2.4vw,42px)] min-[861px]:grid-cols-[minmax(220px,0.78fr)_minmax(0,1.22fr)] min-[861px]:items-end min-[861px]:gap-[clamp(42px,6vw,112px)]">
        <div>
          <p data-pillars-label className="text-micro font-semibold tracking-[0.15em] text-lime uppercase">{title}</p>
          <h3 data-pillars-heading className="mt-[0.65em] max-w-[440px] text-[clamp(26px,2.6vw,48px)] leading-[0.98] font-medium tracking-[-0.045em] text-offwhite">{lead}</h3>
        </div>
        <p data-pillars-note className="max-w-[390px] border-l border-lime/60 pl-4 text-small leading-relaxed text-offwhite/72 min-[861px]:mb-1">{note}</p>
      </div>
      <ul className="grid border-t border-offwhite/15 min-[861px]:grid-cols-4">
        {pillars.map((pillar, i) => (
          <li key={pillar.title} data-pillars-item className="group relative min-h-[126px] border-b border-offwhite/15 px-[clamp(22px,2.3vw,42px)] py-[18px] last:border-b-0 min-[861px]:min-h-[172px] min-[861px]:py-[clamp(20px,2vw,34px)] min-[861px]:border-r min-[861px]:border-b-0 min-[861px]:last:border-r-0">
            <span data-pillars-accent aria-hidden className="absolute left-0 top-[18px] h-7 w-[3px] bg-lime transition-all duration-300 group-hover:h-12 min-[861px]:top-[clamp(20px,2vw,34px)] min-[861px]:h-8" />
            <span className="block text-micro font-semibold tracking-[0.16em] text-lime tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <h4 className="mt-5 max-w-[220px] text-[clamp(16px,1.16vw,21px)] leading-[1.04] font-semibold tracking-[-0.025em] text-offwhite">{pillar.title}</h4>
            <p className="mt-3 max-w-[230px] text-[clamp(12px,0.82vw,15px)] leading-[1.45] text-offwhite/62">{pillar.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
