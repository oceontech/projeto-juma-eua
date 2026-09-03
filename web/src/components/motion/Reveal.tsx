"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, START } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  /** Tag renderizada. Default: div. Use "section", "article", "li"… */
  as?: ElementType;
  className?: string;
  /** Segundos antes de começar, para escalonar blocos vizinhos. */
  delay?: number;
  /** Distância que o bloco sobe ao entrar, em px. */
  y?: number;
  /**
   * Anima os filhos diretos um a um em vez do bloco inteiro.
   * O intervalo entre eles é o próprio valor (em segundos).
   */
  stagger?: number;
};

/**
 * Entrada padrão das seções: sobe e aparece quando entra na viewport.
 *
 * `useGSAP` recolhe tudo que a animação criou — tweens e ScrollTriggers —
 * quando o componente sai, o que em App Router acontece a cada navegação.
 * Fazer isso com useEffect exigiria limpar os ScrollTriggers na mão, e é
 * exatamente aí que animação em React costuma vazar.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  y = 22,
  stagger,
}: RevealProps) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const targets = stagger
        ? Array.from(scope.current!.children)
        : scope.current!;

      /* matchMedia devolve o estado final sem animar para quem pediu menos
         movimento, e desfaz sozinho se a preferência mudar. */
      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { animate } = context.conditions as { animate: boolean };

          if (!animate) {
            gsap.set(targets, { opacity: 1, y: 0 });
            return;
          }

          /* fromTo, e não from: o ScrollTrigger.refresh() que roda quando as
             imagens carregam remede tudo, e um `from` reverte para o estado
             inicial nesse recálculo — a seção volta a ficar invisível. Com
             os dois extremos declarados, o refresh não tem o que inventar. */
          gsap.fromTo(
            targets,
            { opacity: 0, y },
            {
              opacity: 1,
              y: 0,
              delay,
              stagger: stagger ?? 0,
              scrollTrigger: { trigger: scope.current, start: START, once: true },
            },
          );
        },
      );
    },
    { scope, dependencies: [delay, y, stagger] },
  );

  return (
    <Tag ref={scope} className={className}>
      {children}
    </Tag>
  );
}
