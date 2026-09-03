"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Recalcula as posições de todos os ScrollTriggers quando a página termina
 * de crescer.
 *
 * Sem isto, os gatilhos são medidos no primeiro paint — antes das imagens e
 * das fontes carregarem. Nesta home a diferença é de uns três mil pixels de
 * altura, o suficiente para uma seção disparar cedo demais ou nunca disparar.
 *
 * Fica montado uma vez, no layout raiz.
 */
export function ScrollRefresh() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    /* Fontes e imagens são as duas fontes de mudança de altura. */
    if (document.fonts?.status !== "loaded") {
      document.fonts?.ready.then(refresh);
    }

    if (document.readyState === "complete") {
      refresh();
    } else {
      window.addEventListener("load", refresh, { once: true });
    }

    /* next/image entrega as imagens abaixo da dobra em lazy: cada uma que
       chega pode mudar a altura da página. Um refresh por imagem seria caro,
       então agrupamos os que caem na mesma janela de animação. */
    let queued = 0;
    const debounced = () => {
      cancelAnimationFrame(queued);
      queued = requestAnimationFrame(refresh);
    };

    const images = Array.from(document.images).filter((img) => !img.complete);
    images.forEach((img) => {
      img.addEventListener("load", debounced, { once: true });
      img.addEventListener("error", debounced, { once: true });
    });

    return () => {
      window.removeEventListener("load", refresh);
      cancelAnimationFrame(queued);
      images.forEach((img) => {
        img.removeEventListener("load", debounced);
        img.removeEventListener("error", debounced);
      });
    };
  }, []);

  return null;
}
