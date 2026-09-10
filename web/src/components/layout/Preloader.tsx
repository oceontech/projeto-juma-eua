"use client";

import { useEffect, useRef, useState } from "react";
import type { AnimationItem } from "lottie-web";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { markBooted } from "@/lib/boot";

/**
 * Véu de carregamento com a animação da marca (Lottie).
 *
 * Existe por dois motivos, nesta ordem:
 *
 *   1. o hero é feito de cinco imagens grandes, e sem véu a página abre com a
 *      cena meio montada;
 *   2. a entrada do hero é uma animação, e ela precisa começar com o leitor
 *      olhando — atrás do véu, ela rodava sozinha e a cena aparecia parada.
 *
 * O véu sai quando os recursos da primeira dobra chegam, respeitado um tempo
 * mínimo em tela (senão ele pisca) e um teto (rede ruim não prende a página).
 * Ver src/lib/boot.ts.
 *
 * O JSON não entra no bundle: são ~575 KB que só o primeiro paint usa, então
 * ele é buscado de /anim e o player entra por import dinâmico.
 */

/**
 * Teto: passado isto a página abre, tenha carregado o que tiver e tenha a
 * animação chegado onde chegou. É a rede contra rede ruim e contra o player
 * não subir.
 */
const MAX_MS = 9000;

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const veil = root.current;
    if (!veil) return;

    let killed = false;
    let player: AnimationItem | null = null;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Enquanto o véu está de pé a página não rola: a cena do hero avançaria
       por baixo sem ninguém ver. */
    const html = document.documentElement;
    const scrollWas = html.style.overflow;
    html.style.overflow = "hidden";

    const unlock = () => {
      html.style.overflow = scrollWas;
      /* As medidas do ScrollTrigger foram tiradas com a página parada. */
      ScrollTrigger.refresh();
    };

    /* --------------------------------------------------------- o player */
    /* A animação toca uma vez e o véu espera ela terminar: é a marca se
       montando, não um giro de espera — cortar no meio é perder o desenho. */
    const played = new Promise<void>((resolve) => {
      if (reduce) {
        resolve();
        return;
      }
      void (async () => {
        try {
          const [mod, data] = await Promise.all([
            import("lottie-web/build/player/lottie_light"),
            fetch("/anim/preloader.json").then((r) => r.json()),
          ]);
          if (killed || !stage.current) {
            resolve();
            return;
          }
          const item = mod.default.loadAnimation({
            container: stage.current,
            renderer: "svg",
            loop: false,
            autoplay: true,
            animationData: data,
          });
          /* Mais rápido que o original: como véu, a marca precisa se montar
             sem virar espera. */
          item.setSpeed(1.7);
          player = item;
          item.addEventListener("complete", () => resolve());
        } catch {
          /* Sem animação o véu continua fazendo o trabalho dele: cobrir. */
          resolve();
        }
      })();
    });

    /* ------------------------------------------------------- o gatilho */
    const loaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });

    const capped = new Promise<void>((resolve) => window.setTimeout(resolve, MAX_MS));

    void Promise.race([
      Promise.all([loaded, played, document.fonts?.ready]),
      capped,
    ]).then(() => {
      if (killed) return;
      unlock();
      /* A entrada do hero começa junto com a saída do véu: as duas se
         sobrepõem, e a cena já está andando quando aparece. */
      markBooted();
      /* A marca avança um passo e some antes do véu: a página não aparece por
         trás de um logo parado, e sim depois de ele se afastar. */
      gsap
        .timeline({ onComplete: () => setGone(true) })
        /* Saída curta de propósito: a entrada do hero parte junto com este
           gesto (ver Hero.tsx), então cada décimo a mais aqui é um décimo do
           movimento dela acontecendo atrás de um véu. */
        .to(stage.current, { opacity: 0, scale: 1.08, duration: 0.4, ease: "power2.in" }, 0)
        .to(veil, { opacity: 0, duration: 0.5, ease: "power2.inOut" }, 0.12);
    });

    return () => {
      killed = true;
      player?.destroy();
      html.style.overflow = scrollWas;
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      aria-hidden
      className="fixed inset-0 z-[200] grid place-items-center overflow-hidden bg-night"
    >
      {/* A composição é 1920 × 1080 e o player encaixa dentro do palco
          (`meet`), então a proporção precisa estar declarada — sem ela o SVG
          fica com altura zero. A largura mínima impede a marca de virar um
          selo em telas estreitas: o que sobra sai pelas laterais e o véu
          corta. Sobe um pouco do centro óptico, que é onde a marca assenta. */}
      <div
        ref={stage}
        className="aspect-video w-[min(600px,78vw)] min-w-[420px] -translate-y-[6vh]"
      />
    </div>
  );
}
