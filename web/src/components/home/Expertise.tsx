"use client";

import { Fragment, useRef } from "react";
import { gsap, useGSAP, START } from "@/lib/gsap";
import { expertise } from "@/content/home";

/**
 * A virada da página: tela preta, uma frase, nada mais.
 *
 * No Figma este bloco tem uma "cortina" branca deslizando por cima do texto.
 * Aqui ela é uma faixa que varre a seção quando ela entra, revelando o texto
 * por baixo — o mesmo efeito, feito com scrub em vez de frame a frame.
 */
export function Expertise() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { animate } = context.conditions as { animate: boolean };

          if (!animate) {
            gsap.set("[data-curtain]", { display: "none" });
            gsap.set("[data-expertise-text] > *", { opacity: 1, y: 0 });
            return;
          }

          gsap
            .timeline({
              scrollTrigger: { trigger: root.current, start: START, once: true },
            })
            .fromTo(
              "[data-curtain]",
              { xPercent: -100 },
              { xPercent: 100, duration: 1.1, ease: "power2.inOut" },
            )
            .fromTo(
              "[data-expertise-text] > *",
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, stagger: 0.12 },
              "-=0.75",
            );
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-nav-theme="dark"
      className="relative grid min-h-[min(1066px,88vh)] place-items-center overflow-hidden bg-black px-gut py-sec text-center text-white max-[860px]:min-h-0 max-[860px]:py-[clamp(90px,22vw,150px)]"
    >
      <span
        data-curtain
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 bg-white"
      />

      <div data-expertise-text className="relative">
        <h2 className="max-w-[727px] text-[clamp(30px,5.2vw,96px)] leading-[1.06]">
          {expertise.headline.map((line, i) => (
            <Fragment key={line}>
              {i > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </h2>
        <p className="mx-auto mt-[clamp(18px,1.7vw,32px)] max-w-[465px] text-[clamp(12px,0.95vw,16px)] text-offwhite">
          {expertise.body}
        </p>
      </div>
    </section>
  );
}
