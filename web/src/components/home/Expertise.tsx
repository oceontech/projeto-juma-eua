"use client";

import { Fragment, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { expertise } from "@/content/home";

/**
 * O texto existe nas duas cores para a cortina revelar a versão clara sem
 * tingir a frase inteira de cinza durante a passagem. A cópia de cima é
 * decorativa; leitores de tela recebem somente a primeira.
 */
function ExpertiseCopy({ light = false }: { light?: boolean }) {
  return (
    <div
      data-expertise-copy
      aria-hidden={light || undefined}
      className="expertise-copy"
    >
      <h2 className="max-w-[727px] text-[clamp(30px,5.2vw,96px)] leading-[1.06]">
        {expertise.headline.map((line, i) => (
          <Fragment key={line}>
            {i > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </h2>
      <p className="mx-auto mt-[clamp(18px,1.7vw,32px)] max-w-[465px] text-[clamp(12px,0.95vw,16px)]">
        {expertise.body}
      </p>
    </div>
  );
}

/**
 * A virada da página: a janela fica presa enquanto uma cortina branca avança
 * da direita para a esquerda, dirigida diretamente pelo scroll. A geometria
 * sticky vive no CSS para não depender do pin spacer do ScrollTrigger — no
 * mobile isso também evita saltos quando a barra do navegador muda de altura.
 */
export function Expertise() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scene = root.current;
      if (!scene) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { animate } = context.conditions as { animate: boolean };
          const lightLayer = scene.querySelector<HTMLElement>("[data-expertise-light]");
          const copies = scene.querySelectorAll<HTMLElement>("[data-expertise-copy]");

          if (!lightLayer) return;

          if (!animate) {
            gsap.set(lightLayer, { clipPath: "inset(0% 0% 0% 0%)" });
            gsap.set(copies, { scale: 1, y: 0 });
            return;
          }

          const html = document.documentElement;
          let tone = "";

          const applyTone = (next: "dark" | "light") => {
            if (tone === next) return;
            tone = next;
            html.dataset.navTheme = next;
          };

          const clearTone = () => {
            tone = "";
            delete html.dataset.navTheme;
          };

          const timeline = gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                id: "expertise-curtain",
                trigger: scene,
                start: "top top",
                end: "bottom bottom",
                /* Sem amortecimento: a borda nunca fica para trás quando a
                   janela sticky começa a soltar, mesmo num flick rápido. */
                scrub: true,
                invalidateOnRefresh: true,
                refreshPriority: 5,
                onToggle: (self) => {
                  const active = self.isActive;
                  lightLayer.style.willChange = active ? "clip-path" : "";
                  copies.forEach((copy) => {
                    copy.style.willChange = active ? "transform" : "";
                  });
                  if (active) applyTone(self.progress < 0.5 ? "dark" : "light");
                },
                onUpdate: (self) => {
                  if (!self.isActive) return;
                  /* A borda cruza o centro do header na metade do percurso. */
                  applyTone(self.progress < 0.5 ? "dark" : "light");
                },
                onLeave: clearTone,
                onLeaveBack: clearTone,
              },
            })
            .fromTo(
              lightLayer,
              { clipPath: "inset(0% 0% 0% 100%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7 },
              0.15,
            )
            /* As duas cópias se movem juntas; o corte continua pixel-perfect. */
            .fromTo(
              copies,
              { y: 12, scale: 0.985 },
              { y: -12, scale: 1.015, duration: 1 },
              0,
            );

          /* Garante o quadro inicial antes do primeiro evento de scroll. */
          timeline.progress(0);

          return () => {
            clearTone();
            lightLayer.style.willChange = "";
            copies.forEach((copy) => {
              copy.style.willChange = "";
            });
          };
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-nav-theme="dark"
      className="expertise-transition"
    >
      <div className="expertise-window">
        <div className="expertise-layer expertise-layer--dark">
          <ExpertiseCopy />
        </div>

        <div
          data-expertise-light
          aria-hidden
          className="expertise-layer expertise-layer--light"
        >
          <ExpertiseCopy light />
        </div>
      </div>
    </section>
  );
}
