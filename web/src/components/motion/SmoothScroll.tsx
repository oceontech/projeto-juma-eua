"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { booted } from "@/lib/boot";

/**
 * Rolagem suave do site inteiro.
 *
 * A regra que sustenta isto é uma só: existe UM dono da posição de rolagem.
 * Já tentamos suavizar com mola própria, teto de velocidade, limitador de
 * roda e imã de encaixe convivendo com uma biblioteca, e cada peça dessas
 * resolvia um refinamento e criava um defeito novo — porque eram várias
 * coisas escrevendo na mesma posição ao mesmo tempo. Aqui o Lenis é o dono, e
 * todo o resto do site apenas LÊ o scroll ou pede a ele:
 *
 *   o hero          lê, por um ScrollTrigger com `scrub`;
 *   as âncoras      pedem, por `scroller()?.scrollTo` (SmoothAnchors);
 *   as travas       pedem, por `stop()`/`start()` (Preloader e MobileNav).
 *
 * Ele rola a janela de verdade, sem transform no conteúdo. Isso é o que
 * mantém `position: sticky` do hero, `100svh` e o ScrollTrigger funcionando
 * sem `scrollerProxy` — a alternativa, transformar um wrapper, quebraria os
 * três de uma vez.
 *
 * E um relógio só: o `raf` do Lenis roda dentro do ticker do GSAP. Com dois
 * loops independentes, o scroll avança num quadro e as animações presas a ele
 * no seguinte, e o parallax treme. `lagSmoothing(0)` desliga a compensação de
 * quadro perdido do GSAP, que ao pular tempo faria a cena descolar da rolagem.
 */

let instance: Lenis | null = null;

/** O dono da rolagem, ou `null` quando ela é nativa (menos movimento). */
export function scroller(): Lenis | null {
  return instance;
}

export function SmoothScroll() {
  useEffect(() => {
    /* Quem pediu menos movimento fica com a rolagem nativa do navegador: a
       suavização é justamente movimento que a pessoa não pediu. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      /* Exponencial: começa a acompanhar na hora e vai assentando. Sem
         overshoot, que num site com parallax vira balanço. */
      easing: (t) => 1 - Math.pow(1 - t, 3.4),
      smoothWheel: true,
      /* O toque fica nativo. Suavizar o dedo significa `preventDefault` num
         gesto que o compositor já está tocando, e o resultado é pior que o
         problema: atraso na resposta e briga com o rolar por inércia do
         próprio sistema. */
      syncTouch: false,
      wheelMultiplier: 1,
    });

    instance = lenis;

    /* O véu do preloader trava a rolagem por `overflow`, e `overflow` não
       segura o Lenis — ele chamaria `scrollTo` por trás do véu. Ele nasce
       parado e só assume quando a página é liberada. */
    lenis.stop();
    let alive = true;
    booted.then(() => {
      if (alive) lenis.start();
    });

    /* O ScrollTrigger já ouve o evento nativo, mas assinar aqui coloca a
       leitura dele no mesmo quadro da escrita do Lenis. */
    lenis.on("scroll", ScrollTrigger.update);

    /* O ticker do GSAP entrega segundos; o `raf` do Lenis espera milissegundos. */
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      alive = false;
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
