"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { isBooted } from "@/lib/boot";

/**
 * Recalcula as posições de todos os ScrollTriggers quando a página termina
 * de crescer.
 *
 * Sem isto, os gatilhos são medidos no primeiro paint — antes de as fontes
 * carregarem, quando a página ainda tem outra altura, o suficiente para uma
 * seção disparar cedo demais ou nunca disparar.
 *
 * Fica montado uma vez, no layout raiz.
 *
 * Com o véu ainda de pé, este refresh não roda: o do próprio véu (Preloader),
 * feito na saída, já espera o `load` e as fontes — e este, síncrono e de uns
 * 130 ms, cairia no meio da animação da marca, que é onde se via a travada.
 * Só vale quando o `load` ou as fontes chegam DEPOIS de o véu sair (rede
 * lenta, teto do véu).
 */
export function ScrollRefresh() {
  useEffect(() => {
    const refresh = () => {
      if (isBooted()) ScrollTrigger.refresh();
    };

    /* As fontes ainda mudam a altura ao trocar de métrica. */
    if (document.fonts?.status !== "loaded") {
      document.fonts?.ready.then(refresh);
    }

    if (document.readyState === "complete") {
      refresh();
    } else {
      window.addEventListener("load", refresh, { once: true });
    }

    /* Não há refresh por imagem aqui, e é de propósito. Todo <Image> desta
       casa declara width/height, então o espaço já está reservado antes de o
       arquivo chegar: a altura da página não muda e não há o que remedir.

       Pior: com o hero pinado, cada `refresh()` despina e repina o elemento, e
       por um quadro a página fica sem o espaçador do pin — o fundo do body
       aparece como um lampejo branco embaixo. Uma imagem lazy chegando no meio
       da rolagem era o bastante para causá-lo. */
    return () => {
      window.removeEventListener("load", refresh);
    };
  }, []);

  return null;
}
