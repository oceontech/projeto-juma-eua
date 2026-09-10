"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * As três fatias do curso, em fracções do timeline: abre, segura, fecha.
 * Somam 1 — o `scrub` mapeia o curso inteiro sobre elas.
 *
 * A fatia do meio é o que dá sentido ao gesto: sem ela o card tocaria a tela
 * cheia por um quadro só e voltaria, e o que se lê é um solavanco, não uma
 * abertura.
 */
const OPEN_DUR = 0.36;
const HOLD_DUR = 0.28;
const CLOSE_DUR = 1 - OPEN_DUR - HOLD_DUR;

/**
 * O card da prova tomando a tela.
 *
 * Enquanto a seção atravessa a viewport o card cresce do tamanho do container
 * até ocupar a tela inteira — borda a borda, sem raio —, segura ali por um
 * trecho de rolagem e volta ao tamanho de origem na saída. A entrada e a
 * saída são a mesma curva lida ao contrário, então subir a página desfaz o
 * gesto exatamente como descer o fez.
 *
 * A geometria é a mesma da cortina de produtos, e pelo mesmo motivo: uma
 * caixa alta dá o curso e uma janela `sticky` de `100lvh` segura a cena. Sem
 * pin spacer — no celular a barra do navegador abre e fecha durante a
 * rolagem, e um espaçador medido em pixels seria remedido no meio do gesto.
 * `lvh` é estático; a janela cobre a tela em qualquer estado da barra.
 *
 * O que o JS escreve são três coisas por quadro: `width`, `height` e a
 * variável `--open`. Largura e altura em pixels porque os dois extremos são
 * medidos (o repouso vem do conteúdo, a tela cheia da janela); o resto do
 * gesto — raio, respiros, a altura da foto — sai de `--open` no CSS, que é
 * onde ele pode ser lido junto com a geometria de repouso.
 *
 * Nada disso existe sem movimento: o `data-scene` só é ligado dentro do
 * matchMedia, e sem ele a seção volta a ser o card no fluxo, do tamanho de
 * sempre.
 */
export function ProofStage({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stageEl = stage.current;
      const frameEl = frame.current;
      const cardEl = card.current;
      if (!stageEl || !frameEl || !cardEl) return;

      const mm = gsap.matchMedia();

      mm.add(
        { animate: "(prefers-reduced-motion: no-preference)" },
        (context) => {
          const { animate } = context.conditions as { animate: boolean };
          if (!animate) return;

          stageEl.dataset.scene = "on";

          const state = { open: 0 };
          let restW = 0;
          let restH = 0;
          let fullW = 0;
          let fullH = 0;

          /* O repouso é medido, não declarado: a altura do card é a do
             conteúdo, e ela muda com a fonte, com a largura e com o idioma.
             Medir exige devolver o card ao estado de repouso antes da conta —
             daí limpar as três propriedades que a cena escreve.

             Isto roda dentro do `refreshInit` do ScrollTrigger, que é síncrono
             e acontece antes das medições dele: o card volta ao tamanho final
             no `refresh`, no mesmo quadro, então não há piscada. */
          const measure = () => {
            cardEl.style.removeProperty("width");
            cardEl.style.removeProperty("height");
            cardEl.style.setProperty("--open", "0");
            restW = cardEl.offsetWidth;
            restH = cardEl.offsetHeight;
            /* `clientWidth` do <html>, e não `innerWidth` nem `100vw`: os dois
               últimos incluem a barra de rolagem, e o card ficaria alguns
               pixels mais largo que a área visível — descentrado para a
               direita, com o excesso cortado pelo `overflow-x: clip`. */
            fullW = document.documentElement.clientWidth;
            /* A altura cheia é a da própria janela sticky. Perguntar a ela, e
               não a `innerHeight`, é o que mantém os dois em acordo quando a
               barra do navegador móvel recolhe. */
            fullH = frameEl.offsetHeight;
          };

          const apply = () => {
            const { open } = state;
            cardEl.style.setProperty("--open", open.toFixed(4));
            cardEl.style.width = `${restW + (fullW - restW) * open}px`;
            /* `max` porque num celular baixo o card em repouso já pode ser
               mais alto que a janela: ali a tela cheia é só a largura, e a
               altura não deve encolher no meio do gesto. */
            cardEl.style.height = `${restH + (Math.max(fullH, restH) - restH) * open}px`;
          };

          measure();
          apply();

          ScrollTrigger.addEventListener("refreshInit", measure);
          ScrollTrigger.addEventListener("refresh", apply);

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              id: "proof-fullscreen",
              trigger: stageEl,
              start: "top top",
              /* O curso é exatamente o que a janela sticky tem para andar
                 dentro da caixa — medido, e não escrito como `"bottom bottom"`:
                 assim o gesto termina no quadro em que ela solta, em qualquer
                 viewport. */
              end: () =>
                "+=" + Math.max(1, stageEl.offsetHeight - frameEl.offsetHeight),
              /* Sem amortecimento: o card precisa estar exatamente na borda da
                 tela quando a janela solta, e um `scrub` com atraso deixaria
                 um fio do fundo aparecendo na virada. */
              scrub: true,
            },
          });

          timeline
            .to(state, {
              open: 1,
              duration: OPEN_DUR,
              ease: "power2.inOut",
              onUpdate: apply,
            })
            /* A pausa não escreve nada — só ocupa curso de rolagem. */
            .to(state, { open: 1, duration: HOLD_DUR })
            .to(state, {
              open: 0,
              duration: CLOSE_DUR,
              ease: "power2.inOut",
              onUpdate: apply,
            });

          return () => {
            ScrollTrigger.removeEventListener("refreshInit", measure);
            ScrollTrigger.removeEventListener("refresh", apply);
            delete stageEl.dataset.scene;
            cardEl.style.removeProperty("width");
            cardEl.style.removeProperty("height");
            cardEl.style.removeProperty("--open");
          };
        },
      );
    },
    { scope: stage },
  );

  return (
    <div ref={stage} data-proof-stage className="proof-stage">
      <div ref={frame} className="proof-window">
        <div ref={card} className="proof-card">
          {children}
        </div>
      </div>
    </div>
  );
}
