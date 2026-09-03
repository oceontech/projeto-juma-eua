"use client";

/**
 * Ponto único de entrada do GSAP.
 *
 * Todo componente que anima importa daqui, nunca de "gsap" direto. Dois
 * motivos: o registro dos plugins acontece uma vez só, e o dia em que
 * entrar ScrollSmoother, SplitText ou Flip, entra em um arquivo só.
 *
 * Quem importa este módulo precisa ser um Client Component ("use client"):
 * o GSAP mexe no DOM, que não existe no servidor.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

/* registerPlugin é idempotente; o módulo é avaliado uma vez por bundle. */
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

/**
 * Defaults do projeto. Toda animação de entrada sai daqui, então o ritmo do
 * site inteiro se ajusta em um lugar.
 */
export const EASE = "power3.out";
export const DURATION = 0.7;

gsap.defaults({ ease: EASE, duration: DURATION });

/**
 * Ponto de disparo padrão das entradas: o bloco começa a animar quando seu
 * topo cruza 88% da altura da janela — ou seja, um pouco antes de entrar
 * inteiro no campo de visão.
 */
export const START = "top 88%";

/**
 * Altura da barra fixa do topo, para as âncoras não pararem embaixo dela.
 * O header tem `top: clamp(12px,1.6vw,30px)` e ~66px de altura.
 */
export const HEADER_OFFSET = 100;

/**
 * Em desenvolvimento, gsap e ScrollTrigger ficam no console do navegador.
 * `ScrollTrigger.getAll()` lista os gatilhos vivos e
 * `ScrollTrigger.getAll().forEach(t => t.vars.markers = true)` não funciona
 * depois de criados — para ver as marcas, passe `markers: true` no vars.
 */
if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  Object.assign(window, { gsap, ScrollTrigger });
}

export { gsap, ScrollTrigger, useGSAP };
