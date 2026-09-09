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
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

/* registerPlugin é idempotente; o módulo é avaliado uma vez por bundle. */
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, SplitText);

/**
 * No celular, a barra do navegador some e volta durante a rolagem, e cada
 * mudança dessas é um `resize` — que por padrão faz o ScrollTrigger remedir
 * tudo no meio do gesto. As consequências eram duas, as duas visíveis na
 * cortina de produtos: as cenas com `scrub` davam solavancos a cada troca de
 * altura, e um `fromTo` com `invalidateOnRefresh` era devolvido ao quadro
 * inicial toda vez — a cortina branca voltava para fora da tela antes de
 * terminar de atravessar, então nunca chegava a atravessar.
 *
 * Ignorar é seguro aqui porque nenhuma geometria do site depende da altura
 * que muda: as cenas são medidas em `svh` e `lvh`, que são estáticos. Uma
 * troca de orientação continua remedindo — o ScrollTrigger só ignora o
 * resize quando apenas a altura mudou, em dispositivo de toque.
 */
if (typeof window !== "undefined") {
  ScrollTrigger.config({ ignoreMobileResize: true });
}

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
 * A barra encosta no topo e tem ~48px de altura.
 */
export const HEADER_OFFSET = 72;

/**
 * Em desenvolvimento, gsap e ScrollTrigger ficam no console do navegador.
 * `ScrollTrigger.getAll()` lista os gatilhos vivos e
 * `ScrollTrigger.getAll().forEach(t => t.vars.markers = true)` não funciona
 * depois de criados — para ver as marcas, passe `markers: true` no vars.
 */
if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  Object.assign(window, { gsap, ScrollTrigger });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
