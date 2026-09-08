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
  /**
   * Refaz a entrada toda vez que o bloco volta a ser alcançado, em vez de
   * rodar uma vez só na vida da página. Vale para a seção logo abaixo do
   * hero: quem sobe e desce a travessia passa por ela muitas vezes, e com uma
   * execução única ela reaparecia pronta em todas as passagens menos a
   * primeira — que é o mesmo que não ter entrada.
   */
  replay?: boolean;
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
  replay = false,
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

          gsap
            .timeline({
              scrollTrigger: {
                trigger: scope.current,
                start: START,
                /* `reverse` desfaz a entrada ao subir — animado, e não
                   apagando o conteúdo de um quadro para o outro. */
                ...(replay ? { toggleActions: "play none none reverse" } : { once: true }),
              },
            })
            .fromTo(
              targets,
              { opacity: 0, y },
              { opacity: 1, y: 0, stagger: stagger ?? 0 },
              delay,
            );
        },
      );
    },
    { scope, dependencies: [delay, y, stagger, replay] },
  );

  return (
    <Tag ref={scope} className={className}>
      {children}
    </Tag>
  );
}
