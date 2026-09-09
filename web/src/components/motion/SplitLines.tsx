"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, START } from "@/lib/gsap";

type SplitLinesProps = {
  children: ReactNode;
  /** Tag renderizada. Default: h2. */
  as?: ElementType;
  className?: string;
  /** Segundos antes de começar, para escalonar com os blocos vizinhos. */
  delay?: number;
  /** Intervalo entre uma linha e a seguinte, em segundos. */
  stagger?: number;
  /** Elemento que decide a hora de entrar, quando não é o próprio título. */
  trigger?: string;
  /** Sobrescreve o ponto de partida quando o padrão não serve. */
  start?: string;
  /** Refaz a entrada a cada passagem, como o `replay` do <Reveal>. */
  replay?: boolean;
};

/**
 * Título que entra linha a linha, por trás de uma máscara.
 *
 * Cada linha ganha um envelope com o corte no pé, e o texto sobe de dentro
 * dele: nenhuma letra aparece fora do lugar, e o corte é reto porque quem
 * corta é a caixa, não um degradê. É o gesto editorial que faltava às seções
 * que ainda entravam com um fade de bloco inteiro.
 *
 * Sem desfoque aqui de propósito. O desfoque é a linguagem das travessias
 * entre seções — dentro de uma máscara ele apareceria cortado na borda, que é
 * exatamente o que uma máscara não pode deixar transparecer.
 *
 * `autoSplit` refaz o corte quando a fonte termina de carregar ou a caixa
 * muda de largura, o que é o bug clássico deste plugin: dividir antes de a
 * fonte trocar de métrica deixa as linhas quebradas no lugar errado. A
 * animação é devolvida pelo `onSplit` para o plugin poder recriá-la junto.
 */
export function SplitLines({
  children,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.1,
  trigger,
  start,
  replay = false,
}: SplitLinesProps) {
  const scope = useRef<HTMLElement>(null);

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
          if (!animate) return;

          const split = SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.fromTo(
                self.lines,
                { yPercent: 108 },
                {
                  yPercent: 0,
                  duration: 0.95,
                  ease: "power3.out",
                  stagger,
                  delay,
                  scrollTrigger: {
                    trigger:
                      (trigger && document.querySelector(trigger)) || el,
                    start: start ?? START,
                    ...(replay
                      ? { toggleActions: "play none none reverse" }
                      : { once: true }),
                  },
                },
              ),
          });

          return () => {
            split.revert();
          };
        },
      );
    },
    { scope, dependencies: [delay, stagger, trigger, start, replay] },
  );

  return (
    <Tag ref={scope} className={className}>
      {children}
    </Tag>
  );
}
