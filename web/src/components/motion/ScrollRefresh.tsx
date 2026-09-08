"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Recalcula as posições de todos os ScrollTriggers quando a página termina
 * de crescer.
 *
 * Sem isto, os gatilhos são medidos no primeiro paint — antes de as fontes
 * carregarem, quando a página ainda tem outra altura, o suficiente para uma
 * seção disparar cedo demais ou nunca disparar.
 *
 * Fica montado uma vez, no layout raiz.
 */
export function ScrollRefresh() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

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
