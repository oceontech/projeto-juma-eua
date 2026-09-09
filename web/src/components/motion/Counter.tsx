"use client";

import { useRef, type ElementType } from "react";
import { gsap, useGSAP, START } from "@/lib/gsap";

type CounterProps = {
  /** Número que fica no fim — e o que o HTML entrega pronto. */
  to: number;
  /** De onde a contagem parte. Default: zero. */
  from?: number;
  as?: ElementType;
  className?: string;
  /** Segundos de contagem. */
  duration?: number;
  delay?: number;
  trigger?: string;
  start?: string;
  replay?: boolean;
};

/**
 * Número que conta até o valor.
 *
 * O valor final é o que o servidor renderiza: quem chega sem JavaScript, com
 * menos movimento, ou com um leitor de tela, recebe o número certo e pronto.
 * A contagem só existe por cima disso, e apenas quando o bloco entra em cena.
 *
 * Conta num objeto avulso e escreve o texto no `onUpdate`, em vez de animar
 * estado do React: são dezenas de quadros por segundo, e cada um viraria uma
 * renderização de árvore inteira para trocar três caracteres.
 *
 * `snap` mantém a contagem em inteiros — sem ele o número treme com casas
 * decimais no meio do caminho.
 */
export function Counter({
  to,
  from = 0,
  as: Tag = "span",
  className,
  duration = 1.5,
  delay = 0,
  trigger,
  start,
  replay = false,
}: CounterProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
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
            el.textContent = String(to);
            return;
          }

          const count = { value: from };
          const write = () => {
            el.textContent = String(Math.round(count.value));
          };
          write();

          gsap.to(count, {
            value: to,
            duration,
            delay,
            ease: "power2.out",
            snap: { value: 1 },
            onUpdate: write,
            scrollTrigger: {
              trigger: (trigger && document.querySelector(trigger)) || el,
              start: start ?? START,
              ...(replay
                ? { toggleActions: "play none none reverse" }
                : { once: true }),
            },
          });

          /* Devolve o número certo se a preferência mudar no meio. */
          return () => {
            el.textContent = String(to);
          };
        },
      );
    },
    { scope: ref, dependencies: [to, from, duration, delay, trigger, start, replay] },
  );

  return (
    <Tag ref={ref} className={className}>
      {to}
    </Tag>
  );
}
