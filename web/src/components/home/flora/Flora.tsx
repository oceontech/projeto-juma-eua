"use client";

import type { Product } from "@/content/home";
import { FloraLine } from "./FloraLine";
import { useBox } from "./shared";

type Edge = "top" | "bottom";

function Band({ edge, product }: { edge: Edge; product: Product["id"] }) {
  const [ref, { w, h }] = useBox<HTMLDivElement>();
  const id = product === "kmep" ? "kmep" : "aminosan";
  /* A calda do KMEP nasce na faixa e se apaga do lado de longe dela; os
     aminoácidos do Aminosan flutuam soltos e ficam inteiros. */
  const fade = id === "kmep";

  return (
    <div ref={ref} className={`flora-band flora-band--${edge}`} data-fade={fade || undefined}>
      {w > 0 && h > 0 && (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} focusable="false">
          <FloraLine product={id} edge={edge} w={w} h={h} />
        </svg>
      )}
    </div>
  );
}

/**
 * O que vive em volta da faixa do produto: o pontilhado de fundo e, por cima
 * dele, o desenho de cada produto (ver `FloraLine.tsx`).
 *
 * A entrada inteira é governada por uma variável só, `--flora-in` (0–1), que
 * o timeline da seção escreve neste elemento. Cada peça sabe quando começa
 * (`--o`) e quanto dura (`--s`), e o CSS resolve o resto.
 */
export function Flora({ id }: { id: Product["id"] }) {
  return (
    <div aria-hidden="true" className="product-slide__flora">
      <div className="product-slide__flora-exit">
        {/* A luz pontilhada: um campo de pontos na cor do produto, apagado por
            uma máscara em degradê. O degradê está na máscara, não nos pontos —
            aplicado à cor, daria uma faixa cinza sujando o branco; assim o que
            resta longe da faixa é branco puro. O filho é maior que o pai e
            desliza por dentro dele, para o movimento ser `transform` e não
            repintura do padrão a cada quadro. */}
        {(["top", "bottom"] as const).map((edge) => (
          <span key={edge} className={`product-slide__stipple product-slide__stipple--${edge}`}>
            <span className="product-slide__stipple-dots" />
          </span>
        ))}

        <Band edge="top" product={id} />
        <Band edge="bottom" product={id} />
      </div>
    </div>
  );
}
