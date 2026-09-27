"use client";

import { useLayoutEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ medida */
/* Os desenhos são feitos no tamanho real da faixa, em pixels de CSS — sem
   `viewBox` esticado nem cortado. Assim o traço tem a mesma espessura em
   qualquer tela, o que é grande continua grande, e o número de peças cresce
   com a largura em vez de tudo inchar. */
export function useBox<T extends HTMLElement | SVGElement>() {
  const ref = useRef<T>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const r = el.getBoundingClientRect();
      /* O pai pode estar em transformação do GSAP; offset* ignora isso. */
      const w = Math.round((el as HTMLElement).offsetWidth ?? r.width) || Math.round(r.width);
      const h = Math.round((el as HTMLElement).offsetHeight ?? r.height) || Math.round(r.height);
      setBox((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, box] as const;
}

/* ------------------------------------------------------------- utilidades */

/** Sorteio com semente: servidor e cliente, e cada remontagem, desenham igual. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Duas casas bastam para qualquer tela e mantêm o atributo curto. */
export const r2 = (v: number) => Math.round(v * 100) / 100;

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * O vão do centro: o pack sobe por cima da faixa, e o que estiver atrás dele
 * só apareceria recortado pelas bordas do galão. Medido como o CSS mede o
 * pack (`--shot-w`), a partir da largura da faixa.
 */
export function quietHalf(w: number) {
  return clamp(w * 0.135, 115, 200) + 36;
}

/**
 * A margem visível. A faixa é mais larga que a tela em um raio de cada lado
 * (`--slide-r`, para a ponta arredondada ficar fora do quadro): o que for
 * desenhado nos primeiros ~40px não aparece nunca.
 */
export function inset(w: number) {
  return clamp(w * 0.026, 28, 48) + 28;
}

/**
 * A entrada de cada peça. `o` é quando ela começa, em fração da chegada da
 * flora (0–1), e `s` quanto dura. O progresso é resolvido em CSS a partir de
 * `--flora-in`, que o timeline da seção escreve — uma variável só para
 * centenas de peças, sem o timeline precisar conhecer nenhuma delas.
 */
export const at = (o: number, s = 0.22): React.CSSProperties =>
  ({ "--o": r2(o), "--s": r2(s) }) as React.CSSProperties;

/** O mesmo, com os parâmetros do balanço contínuo de cada peça. */
export const loop = (o: number, s: number, dur: number, delay: number, extra?: Record<string, number | string>) =>
  ({ "--o": r2(o), "--s": r2(s), "--dur": `${r2(dur)}s`, "--delay": `${r2(-delay)}s`, ...extra }) as React.CSSProperties;
