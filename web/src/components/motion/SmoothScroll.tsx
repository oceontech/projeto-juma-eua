"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { whenBooted } from "@/lib/boot";
import { holding, stickyCourses, type Course } from "@/lib/scroll-hold";

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

/**
 * O toque, no celular: a rolagem é 100% nativa, e só a inércia que sobra na
 * saída das cenas presas é cortada.
 *
 * O problema: nas cenas presas a tela não anda, então o leitor rola várias
 * vezes seguidas — e o iOS e o Android **somam** a velocidade de arremessos
 * seguidos. Quando a cena soltava, a velocidade acumulada levava a página
 * longe e rápido com um toque leve. Aqui, no quadro em que uma cena solta
 * (ver `lib/scroll-hold.ts`), se a página sai acima de FAST telas por
 * segundo, a inércia é parada: um quadro de `overflow: hidden` interrompe o
 * arremesso no iOS e no Android, e a página pousa logo depois da cena.
 *
 * Já tentamos o `normalizeScroll` do GSAP, que passa toda a inércia do toque
 * para o JS: resolvia o arremesso, mas a rolagem disputava a thread com a
 * cena de WebGL e o celular inteiro ficava lagado.
 */
const FAST = 2.2;

function brake() {
  const html = document.documentElement;
  const y = window.scrollY;
  html.style.overflow = "hidden";
  window.scrollTo(0, y);
  requestAnimationFrame(() => {
    html.style.overflow = "";
  });
}

function watchTouch(): () => void {
  if (!ScrollTrigger.isTouch) return () => {};
  let courses: Course[] = [];
  let was = false;
  let lastY = window.scrollY;
  let lastT = performance.now();
  let frame = 0;

  const check = () => {
    frame = 0;
    const now = performance.now();
    const y = window.scrollY;
    const speed = (Math.abs(y - lastY) / Math.max(now - lastT, 1)) * 1000;
    lastY = y;
    lastT = now;
    const held = holding(courses);
    if (was && !held && speed > window.innerHeight * FAST) brake();
    was = held;
  };
  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(check);
  };
  const measure = () => {
    courses = stickyCourses();
    was = holding(courses);
  };

  measure();
  window.addEventListener("scroll", onScroll, { passive: true });
  ScrollTrigger.addEventListener("refresh", measure);
  return () => {
    window.removeEventListener("scroll", onScroll);
    ScrollTrigger.removeEventListener("refresh", measure);
    cancelAnimationFrame(frame);
  };
}

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
      whenBooted().then(() => {
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
    const unwatch = watchTouch();

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
      unwatch();
    };
  }, []);

  return null;
}
