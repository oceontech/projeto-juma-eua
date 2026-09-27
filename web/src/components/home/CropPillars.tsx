"use client";

import { useRef } from "react";
import { gsap, useGSAP, SplitText, START } from "@/lib/gsap";

type Pillar = { title: string; detail: string };

/**
 * Motivos para escolher a Juma. A entrada é curta e sobreposta — o título
 * sobe linha a linha por trás de uma máscara, a régua do topo da lista se
 * desenha e os quatro pontos entram quase juntos, sem esperar um pelo outro.
 *
 * Interação no desktop: um brilho lima acompanha o cursor pelo painel, e uma
 * régua lima desliza pela borda de cima até o ponto sob o cursor, que acende.
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
  const rail = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const panel = scope.current!;
      const q = gsap.utils.selector(panel);
      const heading = q("[data-pillars-heading]")[0] as HTMLElement;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const trigger = { trigger: panel, start: START, once: true };

        const split = SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.lines,
              { yPercent: 105 },
              {
                yPercent: 0,
                duration: 0.9,
                ease: "power4.out",
                stagger: 0.08,
                delay: 0.05,
                scrollTrigger: trigger,
              },
            ),
        });

        gsap
          .timeline({ scrollTrigger: trigger })
          .fromTo(q("[data-pillars-label]"), { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.5 }, 0)
          .fromTo(q("[data-pillars-note]"), { opacity: 0, x: 18 }, { opacity: 1, x: 0, duration: 0.7 }, 0.2)
          .fromTo(
            q("[data-pillars-rule]"),
            { scaleX: 0 },
            { scaleX: 1, duration: 1, ease: "power3.inOut", transformOrigin: "left center" },
            0.15,
          )
          .fromTo(
            q("[data-pillars-item]"),
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.07 },
            0.3,
          )
          .fromTo(
            q("[data-pillars-accent]"),
            { scaleY: 0 },
            { scaleY: 1, duration: 0.45, stagger: 0.07, transformOrigin: "top center" },
            0.45,
          );

        return () => split.revert();
      });
    },
    { scope, dependencies: [lead] },
  );

  // Brilho que segue o cursor: só duas variáveis CSS, sem re-render.
  const onPanelMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  // A régua do topo desliza até o ponto sob o cursor.
  const moveRail = (i: number) => {
    const el = rail.current;
    if (!el) return;
    gsap.to(el, { xPercent: i * 100, opacity: 1, duration: 0.55, ease: "power3.out", overwrite: true });
  };
  const hideRail = () => {
    if (rail.current) gsap.to(rail.current, { opacity: 0, duration: 0.35, overwrite: "auto" });
  };

  return (
    <section
      ref={scope}
      aria-label={title}
      onPointerMove={onPanelMove}
      className="group/panel relative mt-[clamp(28px,3vw,52px)] overflow-hidden rounded-[clamp(18px,1.55vw,30px)] bg-linear-[149.8deg,var(--color-night-warm)_2.4%,var(--color-night-deep)_60.23%] text-offwhite"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/panel:opacity-100 bg-[radial-gradient(520px_circle_at_var(--mx,50%)_var(--my,50%),rgb(183_199_62/0.13),transparent_65%)]"
      />

      <div className="relative grid gap-6 px-[clamp(22px,3vw,54px)] py-[clamp(26px,2.8vw,50px)] min-[861px]:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] min-[861px]:items-center min-[861px]:gap-[clamp(42px,6vw,112px)]">
        <div>
          <p
            data-pillars-label
            className="inline-flex items-center gap-[0.7em] text-micro leading-none font-semibold tracking-[0.15em] text-lime uppercase"
          >
            <span aria-hidden className="size-[6px] rounded-full bg-lime" />
            {title}
          </p>
          <h3
            data-pillars-heading
            className="mt-[0.9em] max-w-[620px] text-[clamp(28px,2.8vw,52px)] leading-[1.02] font-medium tracking-[-0.015em] text-offwhite"
          >
            {lead}
          </h3>
        </div>
        <p
          data-pillars-note
          className="max-w-[420px] border-l-2 border-lime pl-5 text-small leading-relaxed text-offwhite/72 min-[861px]:justify-self-end"
        >
          {note}
        </p>
      </div>

      <div className="relative">
        <span aria-hidden data-pillars-rule className="absolute inset-x-0 top-0 h-px bg-offwhite/15" />
        <span
          ref={rail}
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 z-1 hidden h-[2px] w-1/4 bg-lime opacity-0 min-[861px]:block"
        />
        <ul className="grid min-[861px]:grid-cols-4" onPointerLeave={hideRail}>
          {pillars.map((pillar, i) => (
            <li
              key={pillar.title}
              data-pillars-item
              onPointerEnter={(e) => e.pointerType === "mouse" && moveRail(i)}
              className="group relative border-b border-offwhite/15 px-[clamp(22px,2.3vw,42px)] py-[clamp(20px,2vw,34px)] transition-colors duration-500 last:border-b-0 hover:bg-offwhite/[0.035] min-[861px]:min-h-[190px] min-[861px]:border-r min-[861px]:border-b-0 min-[861px]:last:border-r-0"
            >
              <span
                data-pillars-accent
                aria-hidden
                className="absolute top-[clamp(20px,2vw,34px)] left-0 h-8 w-[3px] rounded-r-full bg-lime transition-[height] duration-500 ease-out group-hover:h-[calc(100%_-_2*clamp(20px,2vw,34px))]"
              />
              <span className="block text-micro font-semibold tracking-[0.16em] text-lime tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h4 className="mt-5 max-w-[240px] text-[clamp(17px,1.2vw,22px)] leading-[1.08] font-semibold tracking-[-0.01em] text-offwhite transition-transform duration-500 group-hover:translate-x-1">
                {pillar.title}
              </h4>
              <p className="mt-3 max-w-[250px] text-[clamp(13px,0.85vw,15px)] leading-[1.5] text-offwhite/60 transition-colors duration-500 group-hover:text-offwhite/85">
                {pillar.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
