"use client";

import Image from "next/image";
import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { SplitLines } from "@/components/motion/SplitLines";
import { Cta, Mark, microCaps } from "./ui";

/**
 * O que tem na bombona + convite para a faixa de teste. À esquerda, o
 * rótulo em close — onde a referência põe o mapa — com a leitura dele em
 * linhas; à direita, a foto aérea com os bilhetes sobrepostos e o convite.
 * Tudo preso ao scroll: o rótulo se aproxima, as linhas se desenham, e os
 * dois bilhetes sobem em velocidades diferentes sobre a foto.
 */
export function Inside() {
  const { inside } = useContent().aminosanB;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const pass = { trigger: scope.current, start: "top bottom", end: "bottom top", scrub: 0.6 };

        gsap.fromTo(".in-label", { scale: 1.35, yPercent: 8 }, { scale: 1, yPercent: -4, ease: "none", scrollTrigger: pass });
        gsap.fromTo(".in-photo", { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: pass });
        gsap.fromTo(".in-note-0", { y: 160 }, { y: -40, ease: "none", scrollTrigger: pass });
        gsap.fromTo(".in-note-1", { y: 280 }, { y: -90, ease: "none", scrollTrigger: pass });

        gsap.fromTo(
          ".in-row",
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: { trigger: ".in-facts", start: "top 90%", end: "bottom 65%", scrub: 0.6 },
          },
        );
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="grid bg-cream text-forest lg:grid-cols-2">
      <div className="px-[var(--spacing-gut)] py-[clamp(56px,7vw,110px)] lg:px-[clamp(40px,4vw,80px)]">
        <SplitLines className="text-[clamp(34px,3.6vw,64px)] leading-[0.98] tracking-[-0.03em] text-olive">
          {inside.label.heading.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </SplitLines>
        <p className={`${microCaps} mt-5 max-w-[40ch] text-forest/65`}>{inside.label.body}</p>

        <div className="mt-10 grid gap-8 sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] sm:items-center">
          <div className="relative aspect-[4/5] overflow-hidden bg-white">
            <Image
              src="/img/aminosan-b/inside-label.webp"
              alt={inside.label.alt}
              fill
              quality={90}
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 90vw"
              className="in-label object-cover"
            />
          </div>

          <dl className="in-facts">
            {inside.label.facts.map((fact) => (
              <div key={fact.k} className="in-row border-t border-forest/15 py-4">
                <dt className="text-[11px] tracking-[0.14em] text-moss uppercase">{fact.k}</dt>
                <dd className="mt-1 font-display text-[clamp(17px,1.35vw,21px)] leading-[1.2] tracking-[-0.01em]">{fact.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div id="trial" className="relative min-h-[100svh] overflow-hidden bg-forest text-cream">
        <Image
          src="/img/aminosan-b/trial-strip.webp"
          alt={inside.alt}
          fill
          quality={90}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="in-photo object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,38,27,0.15)_0%,rgba(22,38,27,0.05)_40%,rgba(22,38,27,0.88)_100%)]" />

        {inside.notes.map((note, i) => (
          <aside
            key={note.label}
            className={`in-note-${i} absolute w-[min(230px,46%)] bg-cream p-5 text-forest ${i === 0 ? "top-[14%] right-[34%]" : "top-[4%] right-0"}`}
          >
            <Mark className="text-olive" />
            <p className="mt-6 font-display text-[18px] leading-[1.15] tracking-[-0.01em]">{note.label}</p>
            <p className={`${microCaps} mt-3 text-forest/70`}>{note.body}</p>
          </aside>
        ))}

        <div className="absolute inset-x-0 bottom-0 p-[var(--spacing-gut)] pb-[clamp(40px,6vw,80px)] lg:px-[clamp(40px,4vw,80px)]">
          <SplitLines className="text-[clamp(36px,4.4vw,84px)] leading-[0.95] tracking-[-0.035em]">
            {inside.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </SplitLines>
          <p className={`${microCaps} mt-5 max-w-[46ch] text-cream/85`}>{inside.body}</p>
          <Cta href={inside.cta.href} className="mt-7 border-cream bg-cream text-forest hover:bg-transparent hover:text-cream">
            {inside.cta.label}
          </Cta>
        </div>
      </div>
    </section>
  );
}
