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
 * O toque, no celular: a rolagem é 100% nativa — rolagem por JS no toque
 * (`normalizeScroll`, `syncTouch` do Lenis) disputa a thread com a cena de
 * WebGL e o celular inteiro trava; já tentado.
 *
 * O que se corrige é a carga das cenas presas. Nelas a tela não anda, o
 * leitor arremessa várias vezes seguidas, e o iOS e o Android **somam** a
 * velocidade de arremessos dados com a página ainda deslizando. Quando a
 * cena soltava, a carga levava a página longe e rápido. Aqui, no quadro em
 * que uma cena solta (ver `lib/scroll-hold.ts`) e só se a página sai acima
 * de FAST telas por segundo — velocidade de carga, não de arremesso comum —,
 * a inércia nativa é parada e a página **desacelera** por GLIDE de tela em
 * vez de parar seca. A trava das partículas cuida da própria carga (ver
 * `lib/scroll-lock.ts`).
 */
const FAST = 4.5;
const GLIDE = 0.45;

function watchTouch(): () => void {
  if (!ScrollTrigger.isTouch) return () => {};
  const html = document.documentElement;
  let courses: Course[] = [];
  let was = false;
  let lastY = window.scrollY;
  let lastT = performance.now();
  let speed = 0;
  let frame = 0;
  let glide: gsap.core.Tween | null = null;

  const settle = (y: number, dir: number) => {
    /* Uma trava de pé (véu, partículas) já segura a página. */
    if (html.style.touchAction === "none") return;
    html.style.overflow = "hidden";
    window.scrollTo(0, y);
    requestAnimationFrame(() => {
      if (html.style.touchAction !== "none") html.style.overflow = "";
    });
    const max = html.scrollHeight - window.innerHeight;
    glide = gsap.to(window, {
      scrollTo: {
        y: gsap.utils.clamp(0, max, y + dir * window.innerHeight * GLIDE),
        autoKill: true,
      },
      duration: 0.6,
      ease: "power3.out",
      onComplete: () => {
        glide = null;
      },
    });
  };

  const check = () => {
    frame = 0;
    const now = performance.now();
    const y = window.scrollY;
    const dt = Math.max(now - lastT, 1);
    /* Média curta: um quadro atrasado não vira pico de velocidade. */
    speed = speed * 0.4 + ((y - lastY) / dt) * 1000 * 0.6;
    lastY = y;
    lastT = now;
    const held = holding(courses);
    if (
      was &&
      !held &&
      !glide &&
      Math.abs(speed) > window.innerHeight * FAST
    )
      settle(y, Math.sign(speed));
    was = held;
  };
  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(check);
  };
  const onTouch = () => {
    glide?.kill();
    glide = null;
  };
  const measure = () => {
    courses = stickyCourses();
    was = holding(courses);
  };

  measure();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("touchstart", onTouch, { passive: true });
  ScrollTrigger.addEventListener("refresh", measure);
  return () => {
    glide?.kill();
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("touchstart", onTouch);
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

    // Reavalia dinamicamente caso o desenvolvedor alterne entre desktop e mobile no DevTools ou rotacione a tela
    const onResize = () => {
      if (isMobileOrTouch()) {
        stopLenis();
      } else {
        startLenis();
      }
    };

    window.addEventListener("resize", onResize, { passive: true });
    const unwatch = watchTouch();

    return () => {
      alive = false;
      window.removeEventListener("resize", onResize);
      stopLenis();
      unwatch();
    };
  }, []);

  return null;
}
