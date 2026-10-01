"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { whenBooted } from "@/lib/boot";
import { isLocked } from "@/lib/scroll-lock";

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
 * O toque, no celular: o arrasto é 100% nativo, mas o **arremesso** tem teto.
 *
 * O problema: a inércia nativa do iOS e do Android vai longe — um arremesso
 * firme passa várias telas, e as cenas presas a scroll passam num átimo. E
 * ela se soma: arremessos seguidos, com a página ainda deslizando, aceleram
 * cada vez mais. Não há como frear a inércia nativa, só pará-la; então, no
 * fim de um arremesso forte, ela é parada no ato (um quadro de
 * `overflow: hidden`) e a página desliza por conta do GSAP, saindo da
 * velocidade do dedo e pousando em no máximo REACH telas.
 *
 * Arremessos curtos ficam nativos. O que passa ao JS é só o deslize do fim,
 * e só quando ele iria longe: o arrasto continua no compositor. Já tentamos
 * o `normalizeScroll` do GSAP, que passa todo o toque para o JS, e a rolagem
 * disputava a thread com a cena de WebGL — o celular inteiro ficava lagado.
 */
const REACH = 1;
/* Quanto o deslize anda por velocidade do dedo (px/ms → px). A inércia
   nativa anda cerca de 500 vezes; aqui é bem menos, e por isso mais calma. */
const GAIN = 320;
/* Abaixo disto (px/ms) o arremesso fica nativo, a não ser que ele venha
   somado a um deslize que ainda corria. */
const NATIVE = 1.2;

/* Se o dedo começou dentro de algo que rola sozinho (um trilho, um modal). */
function nested(target: EventTarget | null): boolean {
  let el = target instanceof Element ? target : null;
  while (el && el !== document.body) {
    const style = getComputedStyle(el);
    if (
      /(auto|scroll)/.test(style.overflowY + style.overflowX) &&
      (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1)
    )
      return true;
    el = el.parentElement;
  }
  return false;
}

function watchTouch(): () => void {
  if (!ScrollTrigger.isTouch) return () => {};
  const html = document.documentElement;
  let samples: { y: number; x: number; t: number }[] = [];
  let skip = false;
  let carried = false;
  let lastScroll = 0;
  let down = false;
  let glide: gsap.core.Tween | null = null;

  const stopGlide = () => {
    glide?.kill();
    glide = null;
  };

  const onStart = (e: TouchEvent) => {
    /* Um deslize ainda correndo: o próximo arremesso viria somado a ele. */
    carried = !!glide || performance.now() - lastScroll < 90;
    stopGlide();
    down = true;
    const p = e.touches[0];
    skip = e.touches.length > 1 || nested(e.target);
    samples = p ? [{ y: p.clientY, x: p.clientX, t: performance.now() }] : [];
  };
  const onMove = (e: TouchEvent) => {
    const p = e.touches[0];
    if (!p) return;
    const t = performance.now();
    samples.push({ y: p.clientY, x: p.clientX, t });
    while (samples.length > 2 && t - samples[0].t > 100) samples.shift();
  };
  const onEnd = () => {
    down = false;
    /* A trava das cenas de partículas manda: com ela, não há deslize. */
    if (skip || samples.length < 2 || isLocked()) return;
    const first = samples[0];
    const last = samples[samples.length - 1];
    const dt = last.t - first.t;
    if (dt <= 0 || performance.now() - last.t > 60) return;
    const vy = (first.y - last.y) / dt;
    const vx = (first.x - last.x) / dt;
    if (Math.abs(vx) > Math.abs(vy)) return;
    const speed = Math.abs(vy);
    const vh = window.innerHeight;
    const far = speed * 500 > vh * REACH;
    if (speed < 0.25 || (!far && !(carried && speed > NATIVE / 2))) return;

    /* Para a inércia nativa no quadro em que ela nasceria. */
    const y = window.scrollY;
    html.style.overflow = "hidden";
    window.scrollTo(0, y);
    requestAnimationFrame(() => {
      if (html.style.overflow === "hidden" && !isLocked()) html.style.overflow = "";
    });

    const reach = Math.min(speed * GAIN, vh * REACH);
    const max = document.documentElement.scrollHeight - vh;
    const to = gsap.utils.clamp(0, max, y + Math.sign(vy) * reach);
    /* Com power2.out a velocidade inicial é 2 × distância / duração: a
       duração sai da velocidade do dedo, para o deslize nascer nela. */
    const duration = gsap.utils.clamp(0.35, 1.1, (2 * Math.abs(to - y)) / speed / 1000);
    glide = gsap.to(window, {
      scrollTo: { y: to, autoKill: true },
      duration,
      ease: "power2.out",
      onUpdate: () => {
        /* Uma cena de partículas travou no meio do deslize: ela manda. */
        if (isLocked()) stopGlide();
      },
      onComplete: () => {
        glide = null;
      },
    });
  };
  const onScroll = () => {
    if (!down && !glide) lastScroll = performance.now();
  };

  window.addEventListener("touchstart", onStart, { passive: true });
  window.addEventListener("touchmove", onMove, { passive: true });
  window.addEventListener("touchend", onEnd, { passive: true });
  window.addEventListener("touchcancel", onEnd, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => {
    stopGlide();
    window.removeEventListener("touchstart", onStart);
    window.removeEventListener("touchmove", onMove);
    window.removeEventListener("touchend", onEnd);
    window.removeEventListener("touchcancel", onEnd);
    window.removeEventListener("scroll", onScroll);
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
