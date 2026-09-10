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

/** O dono da rolagem, ou `null` quando ela é nativa (mobile ou menos movimento). */
export function scroller(): Lenis | null {
  return instance;
}

/**
 * Detecta se o dispositivo atual é móvel, tablet ou sensível ao toque.
 * A rolagem suave (Lenis) roda exclusivamente no desktop tradicional (mouse / ponteiro fino).
 * Em qualquer celular ou tablet, a rolagem do navegador permanece 100% nativa para
 * eliminar trepidações e disputas com o compositor de gestos do sistema.
 */
function isMobileOrTouch(): boolean {
  if (typeof window === "undefined") return true;

  // 1. Respeita preferência do sistema por redução de movimento
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return true;
  }

  // 2. Qualquer viewport mobile ou tablet (<= 1024px) roda scroll 100% nativo
  if (window.innerWidth <= 1024 || window.matchMedia("(max-width: 1024px)").matches) {
    return true;
  }

  // 3. Telas com ponteiro de toque (touchscreen / coarse)
  if (
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(hover: none)").matches
  ) {
    return true;
  }

  // 4. Hardware de toque em telas até 1280px (ex: tablets, iPads, celulares em paisagem)
  if (
    ("ontouchstart" in window || navigator.maxTouchPoints > 0) &&
    window.innerWidth <= 1280
  ) {
    return true;
  }

  // 5. User-Agent clássico de smartphone ou tablet
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
      navigator.userAgent,
    )
  ) {
    return true;
  }

  return false;
}

export function SmoothScroll() {
  useEffect(() => {
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;
    let alive = true;

    const stopLenis = () => {
      if (tick) {
        gsap.ticker.remove(tick);
        tick = null;
      }
      if (lenis) {
        lenis.destroy();
        lenis = null;
      }
      instance = null;
      document.documentElement.classList.remove("lenis");
      gsap.ticker.lagSmoothing(500, 33);
    };

    const startLenis = () => {
      if (isMobileOrTouch()) {
        stopLenis();
        return;
      }
      if (lenis) return; // já ativo

      lenis = new Lenis({
        duration: 1.05,
        easing: (t) => 1 - Math.pow(1 - t, 3.4),
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 1,
      });

      instance = lenis;

      lenis.stop();
      booted.then(() => {
        if (alive && lenis) lenis.start();
      });

      lenis.on("scroll", ScrollTrigger.update);

      tick = (time: number) => {
        if (lenis) lenis.raf(time * 1000);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    };

    // Inicializa conforme o dispositivo
    startLenis();

    // Reavalia dinamicamente caso o desenvolvedor alterne entre desktop e mobile no DevTools ou rotacione a tela
    const onResize = () => {
      if (isMobileOrTouch()) {
        stopLenis();
      } else {
        startLenis();
      }
    };

    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      alive = false;
      window.removeEventListener("resize", onResize);
      stopLenis();
    };
  }, []);

  return null;
}
