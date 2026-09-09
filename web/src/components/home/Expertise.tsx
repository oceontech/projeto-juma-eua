"use client";

import { Fragment, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { expertise } from "@/content/home";

/**
 * A linha do tempo em fracções do curso de rolagem. Uma só fonte para o
 * timeline e para a virada do tema da barra do topo — que acontece quando a
 * borda da cortina cruza o meio da tela, ou seja, no meio do trecho dela.
 */
const CURTAIN_AT = 0.06;
const CURTAIN_DUR = 0.5;
const CURTAIN_MID = CURTAIN_AT + CURTAIN_DUR / 2;
/* Onde a dissolução começa. O que sobra depois dela — cerca de meia tela de
   rolagem — é o tanto que o bloco de produtos sobe por trás da janela até
   encostar no topo, no último quadro. Entre o fim da cortina e este ponto a
   frase preta no branco fica parada, que é o respiro para lê-la. */
const FADE_AT = 0.76;
const FADE_DUR = 1 - FADE_AT;

/**
 * O texto existe nas duas cores para a cortina revelar a versão clara sem
 * tingir a frase inteira de cinza durante a passagem. A cópia de cima é
 * decorativa; leitores de tela recebem somente a primeira.
 */
function ExpertiseCopy({ light = false }: { light?: boolean }) {
  return (
    <div
      data-expertise-copy
      aria-hidden={light || undefined}
      className="expertise-copy"
    >
      <h2 className="max-w-[727px] text-[clamp(30px,5.2vw,96px)] leading-[1.06]">
        {expertise.headline.map((line, i) => (
          <Fragment key={line}>
            {i > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </h2>
      <p className="mx-auto mt-[clamp(18px,1.7vw,32px)] max-w-[465px] text-[clamp(12px,0.95vw,16px)]">
        {expertise.body}
      </p>
    </div>
  );
}

/**
 * A virada da página, em duas fases dentro da mesma janela presa:
 *
 *   1. a cortina branca avança da direita para a esquerda e troca o preto
 *      pelo branco sem passar por nenhum cinza;
 *   2. a janela se dissolve por cima do bloco de produtos, que já subiu para
 *      trás dela: o texto sai com blur + opacidade, o fundo sai só com
 *      opacidade. Quem aparece embaixo é a seção seguinte, não uma cor.
 *
 * As duas fases são um único timeline dirigido pelo scroll, então não há
 * emenda entre elas nem valor de uma atrasando em relação à outra.
 *
 * A geometria sticky vive no CSS para não depender do pin spacer do
 * ScrollTrigger. O fim do curso é medido em pixels, a partir da altura real
 * da janela, e não por `"bottom bottom"`: no celular a barra do navegador
 * muda `innerHeight` no meio da rolagem, e com ela o ponto que essa palavra
 * significa — a dissolução acabava fora de hora, antes ou depois de a janela
 * soltar. Medindo o curso do próprio sticky, os dois terminam juntos em
 * qualquer viewport.
 */
export function Expertise() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scene = root.current;
      if (!scene) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
          /* O parallax das cópias só no desktop — ver abaixo. */
          wide: "(min-width: 861px)",
        },
        (context) => {
          const { animate, wide } = context.conditions as {
            animate: boolean;
            wide: boolean;
          };

          const pick = (selector: string) =>
            scene.querySelector<HTMLElement>(selector);

          const windowEl = pick(".expertise-window");
          const lightLayer = pick("[data-expertise-layer='light']");
          const darkLayer = pick("[data-expertise-layer='dark']");
          if (!windowEl || !lightLayer || !darkLayer) return;

          const lightBg = lightLayer.querySelector<HTMLElement>("[data-expertise-bg]");
          const darkBg = darkLayer.querySelector<HTMLElement>("[data-expertise-bg]");
          const lightCopy = lightLayer.querySelector<HTMLElement>("[data-expertise-copy]");
          const darkCopy = darkLayer.querySelector<HTMLElement>("[data-expertise-copy]");
          if (!lightBg || !darkBg || !lightCopy || !darkCopy) return;

          const copies = [darkCopy, lightCopy];
          const html = document.documentElement;

          if (!animate) {
            gsap.set(lightLayer, { clipPath: "inset(0% 0% 0% 0%)" });
            gsap.set([lightBg, darkBg], { opacity: 1 });
            gsap.set(copies, { scale: 1, y: 0, opacity: 1, filter: "none" });
            return;
          }

          /* Liga a subida do bloco de produtos e o curso de saída (globals.css).
             Fica aqui, e não no CSS puro, porque sem movimento a seção não tem
             dissolução — e então não pode haver nada por baixo dela. */
          html.dataset.expertiseOverlap = "on";

          /* A barra do topo deduz o tom pela coordenada das seções marcadas
             como escuras (SiteHeader.tsx). Esta deixou de ser escura na altura
             inteira: no fim ela está branca e depois transparente, com os
             produtos aparecendo por baixo. Enquanto o percurso corre é o
             `data-nav-theme` do <html> que manda — daí tirar a marca da caixa,
             que só serve à versão sem movimento. */
          scene.removeAttribute("data-nav-theme");

          let tone = "";

          const applyTone = (next: "dark" | "light") => {
            if (tone === next) return;
            tone = next;
            html.dataset.navTheme = next;
          };

          const clearTone = () => {
            tone = "";
            delete html.dataset.navTheme;
          };

          const setWillChange = (active: boolean) => {
            lightLayer.style.willChange = active ? "clip-path" : "";
            [lightBg, darkBg].forEach((bg) => {
              bg.style.willChange = active ? "opacity" : "";
            });
            copies.forEach((copy) => {
              copy.style.willChange = active ? "transform, opacity, filter" : "";
            });
          };

          const timeline = gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                id: "expertise-curtain",
                trigger: scene,
                start: "top top",
                /* O curso é exatamente o que o sticky tem para andar dentro da
                   seção. Função porque precisa ser remedido a cada refresh. */
                end: () =>
                  "+=" +
                  Math.max(1, scene.offsetHeight - windowEl.offsetHeight),
                /* Sem amortecimento: a borda nunca fica para trás quando a
                   janela sticky começa a soltar, mesmo num flick rápido. */
                scrub: true,
                refreshPriority: 5,
                onToggle: (self) => {
                  setWillChange(self.isActive);
                  if (self.isActive) {
                    applyTone(self.progress < CURTAIN_MID ? "dark" : "light");
                  }
                },
                onUpdate: (self) => {
                  if (!self.isActive) return;
                  /* A borda cruza o centro do header na metade da travessia. */
                  applyTone(self.progress < CURTAIN_MID ? "dark" : "light");
                },
                onLeave: clearTone,
                onLeaveBack: clearTone,
              },
            })
            .fromTo(
              lightLayer,
              { clipPath: "inset(0% 0% 0% 100%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: CURTAIN_DUR },
              CURTAIN_AT,
            );

          /* O parallax é o que treme no celular: a janela presa é composta
             pelo próprio navegador, e o `transform` que o GSAP escreve a cada
             evento de rolagem chega um quadro depois dela durante a inércia
             do dedo. Contra um fundo parado isso se lê como o texto vibrando.
             No desktop o scroll passa pelo Lenis, no mesmo relógio do GSAP, e
             o movimento fica limpo — então ele existe só lá. */
          if (wide) {
            timeline.fromTo(
              copies,
              { y: 12, scale: 0.985 },
              { y: -12, scale: 1.015, duration: FADE_AT },
              0,
            );
          }

          timeline
            /* A camada escura já está inteiramente coberta pelo branco opaco
               quando a saída começa. Apagá-la de uma vez aqui é o que impede
               que o texto branco reapareça por baixo conforme o fundo claro
               abre — e mantém a dissolução branco-sobre-branco, sem escurecer
               a emenda com o bloco de produtos. */
            .set([darkBg, darkCopy], { opacity: 0 }, FADE_AT)
            /* O texto vai primeiro, e vai desfocando. `blur(0px)` explícito
               no começo: o valor natural é `none`, que não interpola. */
            .fromTo(
              lightCopy,
              { filter: "blur(0px)" },
              {
                opacity: 0,
                filter: "blur(16px)",
                /* Quase todo o percurso da saída. O texto some tarde de
                   propósito: é ele que ocupa a tela até a faixa do bloco
                   seguinte despontar, e na volta é ele que reaparece antes de
                   a tela ficar vazia. */
                duration: FADE_DUR * 0.95,
                ease: "power1.in",
              },
              FADE_AT,
            )
            /* O fundo vai só com opacidade, e termina junto com o curso: é ele
               que descobre a seção que estava atrás o tempo todo. */
            .to(lightBg, { opacity: 0, duration: FADE_DUR }, FADE_AT);

          /* Garante o quadro inicial antes do primeiro evento de scroll. */
          timeline.progress(0);

          return () => {
            clearTone();
            setWillChange(false);
            scene.dataset.navTheme = "dark";
            delete html.dataset.expertiseOverlap;
          };
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-nav-theme="dark"
      className="expertise-transition"
    >
      <div className="expertise-window">
        <div
          data-expertise-layer="dark"
          className="expertise-layer expertise-layer--dark"
        >
          <span data-expertise-bg aria-hidden className="expertise-bg" />
          <ExpertiseCopy />
        </div>

        <div
          data-expertise-layer="light"
          aria-hidden
          className="expertise-layer expertise-layer--light"
        >
          <span data-expertise-bg className="expertise-bg" />
          <ExpertiseCopy light />
        </div>
      </div>
    </section>
  );
}
