"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Placeholder do vídeo institucional. Sem fonte de vídeo real no Figma —
 * quando o asset chegar, troca-se o miolo lima por um <video>/poster real
 * mantendo a moldura e o botão de play.
 */
export function VideoSection() {
  const stage = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stageEl = stage.current;
      const windowEl = windowRef.current;
      const frameEl = frame.current;
      if (!stageEl || !windowEl || !frameEl) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          narrow: "(max-width: 860px)",
        },
        (context) => {
          const { animate, narrow } = context.conditions as {
            animate: boolean;
            narrow: boolean;
          };
          if (!animate) return;

          stageEl.dataset.scene = "on";

          const targetScale = () => {
            const restingWidth = frameEl.offsetWidth;
            const restingHeight = frameEl.offsetHeight;
            if (!restingWidth || !restingHeight) return 1;

            const maxWidth = Math.min(
              document.documentElement.clientWidth * (narrow ? 0.92 : 0.74),
              1180,
            );
            const maxHeight = windowEl.offsetHeight * (narrow ? 0.62 : 0.76);

            return Math.max(
              1,
              Math.min(maxWidth / restingWidth, maxHeight / restingHeight),
            );
          };

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              id: "aminosan-video-growth",
              trigger: stageEl,
              start: "top top",
              end: () =>
                "+=" +
                Math.max(1, stageEl.offsetHeight - windowEl.offsetHeight),
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          /* A expansão ocupa o percurso inteiro do palco. A cortina branca
             que fechava a cena saiu junto com os fundos de cor: daqui até a
             seção seguinte tudo é o mesmo branco, e varrer branco com branco
             é animação que ninguém vê. */
          timeline.fromTo(
            frameEl,
            { scale: 1 },
            { scale: targetScale, duration: 1, transformOrigin: "center center" },
            0,
          );

          return () => {
            delete stageEl.dataset.scene;
            frameEl.style.removeProperty("transform");
            frameEl.style.removeProperty("transform-origin");
          };
        },
      );
    },
    { scope: stage },
  );

  return (
    <div ref={stage} className="video-growth-stage">
      <div ref={windowRef} className="video-growth-window">
        <div ref={frame} className="video-growth-frame">
          <button
            type="button"
            aria-label="Play the Aminosan story"
            className="flex size-full items-center justify-center rounded-[inherit] bg-lime"
          >
            <Image
              src="/img/aminosan/icon-play.svg"
              alt=""
              width={87}
              height={87}
              className="size-[clamp(56px,7vw,87px)] transition-transform duration-300 hover:scale-105"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
