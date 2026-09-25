"use client";

import { useRef } from "react";
import { BOTTLE, bottleCell } from "@/lib/bottle-sprite";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

/* O frasco de 1988 virando o de hoje: a sprite e como foi gerada estão em
   lib/bottle-sprite.ts, a mesma da LP do Aminosan®. */
const FROM = BOTTLE.from;
const SPRITE = BOTTLE.src;
const FRAMES = BOTTLE.frames;
const FRAME_W = BOTTLE.w;
const FRAME_H = BOTTLE.h;

/** Cadência do vídeo original entre um quadro e outro. */
const FRAME_MS = BOTTLE.frameMs;
/** Trava no primeiro e no último quadro, para dar tempo de ler os anos. */
const HOLD_MS = 500;

/**
 * Espera entre o gatilho da seção e o início da contagem: é o tempo do card
 * terminar a entrada (delay 0.12 s + 0.7 s do <Reveal>). Sem ela, a trava em
 * 1988 passaria com o card ainda desfocado.
 */
const ENTER_DELAY_MS = 820;

/** Duração de cada quadro: as duas pontas seguram, o miolo corre. */
const DURATIONS = Array.from({ length: FRAMES }, (_, i) =>
  i === 0 || i === FRAMES - 1 ? HOLD_MS : FRAME_MS,
);
const LOOP_MS = DURATIONS.reduce((sum, d) => sum + d, 0);

/** Quadro que está em cena num dado instante da volta. */
function frameAt(elapsed: number) {
  let t = Math.max(0, elapsed) % LOOP_MS;
  for (let i = 0; i < FRAMES; i++) {
    if (t < DURATIONS[i]) return i;
    t -= DURATIONS[i];
  }
  return FRAMES - 1;
}

/**
 * Ano corrente no fuso de Brasília, e não no do navegador: um visitante com o
 * relógio em UTC veria o ano virar três horas antes da virada no Brasil.
 */
function currentYearInBrazil() {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
    }).format(new Date()),
  );
}

type HistoryBottleProps = {
  alt: string;
  /** Mesmo gatilho dos outros blocos da seção — ver `enter` em <BrazilAdvantage>. */
  trigger: string;
  start: string;
};

/**
 * O frasco original de 1988 em loop, com uma badge que atravessa os anos junto
 * com a animação: o primeiro quadro mostra 1988 e o último o ano corrente.
 *
 * Por que não o vídeo direto: o quadro em que um <video> está só se sabe de
 * forma aproximada. Tocando os quadros num canvas, quadro e ano saem do mesmo
 * relógio — a sincronia é exata por
 * construção, e as travas nas pontas são só números aqui em cima.
 *
 * A contagem fica parada em 1988 até a seção entrar em cena, e recomeça do
 * primeiro quadro a cada entrada: quem chega vê a volta inteira desde o início,
 * e não um trecho qualquer que já vinha rodando fora da tela.
 *
 * O ano final é calculado no navegador, não no servidor: a página é
 * pré-renderizada, e um ano fixado no build ficaria parado no ano do deploy.
 *
 * Canvas e badge são escritos direto no DOM, como no <Counter>: passar isso
 * por estado do React renderizaria o componente a cada quadro.
 */
export function HistoryBottle({ alt, trigger, start }: HistoryBottleProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const canvas = canvasRef.current;
      const label = yearRef.current;
      const ctx = canvas?.getContext("2d");
      if (!root || !canvas || !label || !ctx) return;

      const to = currentYearInBrazil();
      const yearOf = (frame: number) =>
        FROM + Math.round((frame / (FRAMES - 1)) * (to - FROM));

      const sprite = new Image();
      sprite.decoding = "async";

      let drawn = -1;
      const show = (frame: number) => {
        if (frame === drawn || !sprite.complete) return;
        drawn = frame;
        const { x, y } = bottleCell(frame);
        ctx.drawImage(
          sprite,
          x, y, FRAME_W, FRAME_H,
          0, 0, FRAME_W, FRAME_H,
        );
        label.textContent = String(yearOf(frame));
      };

      let raf = 0;
      let startAt = 0;
      /** A seção entrou antes de a sprite terminar de carregar. */
      let pending = false;

      const tick = (now: number) => {
        show(frameAt(now - startAt));
        raf = requestAnimationFrame(tick);
      };

      const stop = () => {
        cancelAnimationFrame(raf);
        raf = 0;
        pending = false;
      };

      /** Volta ao primeiro quadro e conta a partir dele. */
      const restart = () => {
        stop();
        show(0);
        if (!sprite.complete) {
          pending = true;
          return;
        }
        startAt = performance.now() + ENTER_DELAY_MS;
        raf = requestAnimationFrame(tick);
      };

      const still = window.matchMedia("(prefers-reduced-motion: reduce)");

      sprite.onload = () => {
        if (still.matches) {
          // Sem movimento: fica o frasco de hoje com o intervalo inteiro escrito.
          show(FRAMES - 1);
          label.textContent = `${FROM}–${to}`;
          return;
        }
        show(0);
        if (pending) restart();
      };
      sprite.src = SPRITE;

      if (still.matches) return () => (sprite.onload = null);

      const st = ScrollTrigger.create({
        trigger: document.querySelector(trigger) ?? root,
        start,
        onEnter: restart,
        onEnterBack: restart,
        // Sai por baixo ou por cima: para, e a próxima entrada começa do zero.
        onLeave: stop,
        onLeaveBack: () => {
          stop();
          show(0);
        },
      });

      return () => {
        st.kill();
        stop();
        sprite.onload = null;
      };
    },
    { scope: rootRef, dependencies: [trigger, start] },
  );

  return (
    // No desktop ocupa a coluna direita do card, na altura do conteúdo. Abaixo
    // de 1100px desce para o pé do card num painel largo e baixo: o frasco
    // continua em pé no centro (`object-contain`), e as sobras laterais saem
    // no mesmo branco do fundo dos quadros (#fff, conferido na sprite), o
    // que dá bordas brancas sem emenda em vez de um retrato alto na tela.
    <div
      ref={rootRef}
      // A margem negativa avança o painel até metade do padding do card, para
      // ele ficar mais largo que a coluna de texto.
      className="relative -mx-[clamp(12px,1.3vw,25px)] aspect-[3/2] max-h-[340px] min-[1100px]:absolute min-[1100px]:inset-y-[clamp(24px,2.6vw,50px)] min-[1100px]:right-[clamp(24px,2.6vw,50px)] min-[1100px]:mx-0 min-[1100px]:aspect-auto min-[1100px]:max-h-none min-[1100px]:w-[36%]"
    >
      {/* Brilho lima atrás do painel. Fica fora da <figure> porque ela corta
          o que passa da borda arredondada. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-[10%] rounded-full bg-[radial-gradient(closest-side,rgba(183,199,62,0.45),rgba(183,199,62,0.12)_60%,transparent)] blur-2xl"
      />

      {/* Os quadros vêm com fundo branco, então são apresentados como uma foto
          num painel da mesma cor em vez de recortados sobre o escuro do card.
          `object-contain` vale no canvas como numa imagem. */}
      <figure className="relative size-full overflow-hidden rounded-[clamp(10px,0.9vw,16px)] bg-white shadow-[0_0_40px_rgba(183,199,62,0.25)]">
        <canvas
          ref={canvasRef}
          width={FRAME_W}
          height={FRAME_H}
          role="img"
          aria-label={alt}
          className="size-full object-contain"
        />

        <span
          aria-hidden
          className="absolute bottom-3.5 left-3.5 rounded-lg bg-lime px-3.5 py-2.5 font-display text-[18px] leading-none font-semibold tracking-[0.1em] tabular-nums text-night min-[1100px]:bottom-[clamp(10px,1vw,18px)] min-[1100px]:left-[clamp(10px,1vw,18px)] min-[1100px]:px-2.5 min-[1100px]:py-2 min-[1100px]:text-[clamp(12px,0.95vw,18px)]"
        >
          <span ref={yearRef}>{FROM}</span>
        </span>
      </figure>
    </div>
  );
}
