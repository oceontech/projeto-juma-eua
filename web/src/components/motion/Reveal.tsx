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
   * Distância que o bloco anda na horizontal ao entrar, em px. Negativo vem
   * da esquerda, positivo da direita. Zero (o padrão) mantém a entrada só
   * vertical, que é a de quase toda a página.
   */
  x?: number;
  /**
   * Desfoque de partida, em px. É a mesma linguagem das travessias entre
   * seções — o bloco ganha foco enquanto assenta, em vez de só aparecer.
   */
  blur?: number;
  /**
   * Largura de partida, como fração. Menor que 1 faz o bloco se desenhar da
   * esquerda para a direita em vez de aparecer inteiro — é o gesto dos traços
   * lima que abrem as seções.
   */
  scaleX?: number;
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
  /**
   * Elemento que decide a hora de entrar, quando ele não é o próprio bloco.
   *
   * Serve para blocos cuja posição de layout não é a posição em que eles
   * aparecem — o caso da seção logo abaixo do hero, que é puxada para dentro
   * dele por uma margem negativa. Ali cada bloco, medido por conta própria,
   * cruzava o gatilho e terminava a entrada enquanto a seção inteira ainda
   * estava invisível; quando ela enfim surgia, o conteúdo já estava pronto, o
   * que é o mesmo que não ter entrada. Com um gatilho comum, a ordem entre os
   * blocos volta a ser a dos `delay`, e não a das alturas de cada um.
   */
  trigger?: string;
  /** Sobrescreve o ponto de partida quando o padrão não serve. */
  start?: string;
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
  x = 0,
  blur = 0,
  scaleX = 1,
  stagger,
  replay = false,
  trigger,
  start,
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
            gsap.set(targets, {
              opacity: 1,
              x: 0,
              y: 0,
              scaleX: 1,
              filter: "none",
            });
            return;
          }

          /* `filter` não interpola a partir de `none`: quando há desfoque, os
             dois extremos precisam ser escritos. */
          const draw =
            scaleX === 1
              ? {}
              : { scaleX, transformOrigin: "left center" as const };

          const from = blur
            ? { opacity: 0, x, y, ...draw, filter: `blur(${blur}px)` }
            : { opacity: 0, x, y, ...draw };
          const to = blur
            ? { opacity: 1, x: 0, y: 0, scaleX: 1, filter: "blur(0px)" }
            : { opacity: 1, x: 0, y: 0, scaleX: 1 };

          gsap
            .timeline({
              scrollTrigger: {
                trigger: (trigger && document.querySelector(trigger)) || scope.current,
                start: start ?? START,
                /* `reverse` desfaz a entrada ao subir — animado, e não
                   apagando o conteúdo de um quadro para o outro. */
                ...(replay ? { toggleActions: "play none none reverse" } : { once: true }),
              },
            })
            .fromTo(
              targets,
              from,
              { ...to, stagger: stagger ?? 0 },
              delay,
            );
        },
      );
    },
    { scope, dependencies: [delay, y, x, blur, scaleX, stagger, replay, trigger, start] },
  );

  return (
    <Tag ref={scope} className={className}>
      {children}
    </Tag>
  );
}
