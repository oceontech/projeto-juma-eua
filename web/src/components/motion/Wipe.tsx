"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, START } from "@/lib/gsap";

type WipeProps = {
  children: ReactNode;
  className?: string;
  /** Segundos antes de começar, para escalonar com os blocos vizinhos. */
  delay?: number;
  /** Refaz a entrada a cada passagem, como o `replay` do <Reveal>. */
  replay?: boolean;
  /** Sobrescreve o ponto de partida quando o padrão não serve. */
  start?: string;
};

/**
 * Cortina que descobre o bloco da esquerda para a direita.
 *
 * É a entrada das fotos em tela cheia, onde o fade do <Reveal> não tem o que
 * dizer: uma imagem sangrada não "chega", ela é revelada — e a borda que a
 * revela dá direção de leitura ao bloco inteiro, que é o que uma foto de
 * meia tela precisa para não parecer apenas um fundo.
 *
 * O `clip-path` corta no próprio quadro, então nada transborda e a imagem
 * não se move: quem anda é a borda. Um leve `scale` acompanha, o bastante
 * para o quadro respirar sem denunciar o recorte.
 */
export function Wipe({
  children,
  className,
  delay = 0,
  replay = false,
  start,
}: WipeProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = scope.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { animate } = context.conditions as { animate: boolean };

          if (!animate) {
            gsap.set(el, { clipPath: "inset(0% 0% 0% 0%)", scale: 1 });
            return;
          }

          gsap.fromTo(
            el,
            { clipPath: "inset(0% 100% 0% 0%)", scale: 1.06 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              scale: 1,
              duration: 1.15,
              delay,
              ease: "power3.inOut",
              scrollTrigger: {
                trigger: el,
                start: start ?? START,
                ...(replay
                  ? { toggleActions: "play none none reverse" }
                  : { once: true }),
              },
            },
          );
        },
      );
    },
    { scope, dependencies: [delay, replay, start] },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
