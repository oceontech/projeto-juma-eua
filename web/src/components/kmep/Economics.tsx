"use client";

import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { Counter } from "@/components/motion/Counter";
import { SplitLines } from "@/components/motion/SplitLines";
import { gsap, useGSAP } from "@/lib/gsap";
import { eyebrow, microCaps } from "./ui";

/* TODO(P4): se a dose do rótulo americano mudar o custo, esta é a única
   tabela da página onde o número aparece. */

/* As três colunas de valor e a cor de cada uma: ganho em creme, custo em
   cobre, líquido em lima. */
const COLS = [
  { key: "value", text: "text-cream", bar: "bg-cream" },
  { key: "cost", text: "text-kmep-light", bar: "bg-kmep" },
  { key: "net", text: "text-lime", bar: "bg-lime" },
] as const;

/**
 * K11 — a conta por acre. O bloco escuro de dados das referências: números
 * grandes em linha, três cenários de preço.
 *
 * Hierarquia inegociável (nota 3 do canônico): o custo e o líquido têm o
 * mesmo peso tipográfico do ganho. Publicar ganho maior que custo, em corpo
 * maior, é a estética de propaganda que o resto do site rejeita. As barras
 * dividem uma escala só, rotulada, então $6 aparece do tamanho que tem ao
 * lado de $38.
 */
export function Economics() {
  const { economics } = useContent().kmep;
  const { scale } = economics;
  const scope = useRef<HTMLElement>(null);
  const ticks = Array.from({ length: scale.max / scale.step + 1 }, (_, i) => i * scale.step);
  const pct = (v: number) => `${(v / scale.max) * 100}%`;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".ec-row",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.14,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: ".ec-table", start: "top 85%", once: true },
          },
        );
        gsap.fromTo(
          ".ec-bar",
          { scaleX: 0 },
          {
            scaleX: 1,
            stagger: 0.06,
            duration: 1.3,
            ease: "power2.out",
            delay: 0.3,
            scrollTrigger: { trigger: ".ec-table", start: "top 85%", once: true },
          },
        );
      });
    },
    { scope },
  );

  return (
    <section ref={scope} data-nav-theme="dark" className="relative isolate overflow-hidden bg-forest py-sec text-offwhite">
      <span
        aria-hidden
        className="absolute -bottom-[30%] -left-[10%] -z-10 h-[70%] w-[60%] bg-[radial-gradient(closest-side,rgba(183,199,62,0.1),transparent)]"
      />
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-end lg:gap-16">
          <SplitLines className="max-w-[15ch] text-[clamp(36px,4.4vw,80px)] leading-[0.96] tracking-[-0.035em] text-balance">
            {economics.heading}
          </SplitLines>
          <div>
            <p className={`${microCaps} text-[12px] text-offwhite/75`}>{economics.body}</p>
            <p className={`${microCaps} mt-4 border-l-2 border-lime pl-3 text-[10px] text-offwhite/60`}>{economics.witness}</p>
          </div>
        </div>

        <div role="table" className="ec-table mt-[clamp(44px,6vw,96px)]">
          <div role="row" className="hidden grid-cols-[200px_repeat(3,minmax(0,1fr))] gap-6 pb-4 lg:grid">
            {economics.columns.map((col, i) => (
              <span
                key={col}
                role="columnheader"
                className={`${eyebrow} text-[10px] ${i === 0 ? "text-offwhite/55" : COLS[i - 1].text}`}
              >
                {col}
              </span>
            ))}
          </div>

          {economics.rows.map((row, r) => (
            <div
              key={row.price}
              role="row"
              className={`ec-row grid grid-cols-3 gap-x-4 gap-y-3 border-t border-offwhite/15 px-3 py-5 lg:grid-cols-[200px_repeat(3,minmax(0,1fr))] lg:gap-x-6 lg:px-4 lg:py-7 ${r === 1 ? "bg-offwhite/[0.045]" : ""}`}
            >
              <span role="rowheader" className="col-span-3 font-display text-[clamp(18px,1.6vw,26px)] tracking-[-0.01em] text-offwhite/85 lg:col-span-1 lg:self-center">
                {row.price}
              </span>
              {COLS.map((col, c) => (
                <span key={col.key} role="cell" className="flex flex-col">
                  <span className={`${microCaps} text-[9px] text-offwhite/50 lg:hidden`}>{economics.columns[c + 1]}</span>
                  <span className={`font-display text-[clamp(22px,3.4vw,60px)] leading-none tracking-[-0.04em] ${col.text}`}>
                    $<Counter to={row[col.key]} decimals={2} duration={1.4} />
                  </span>
                </span>
              ))}
              {/* O mesmo metro para as três barras. */}
              <span aria-hidden className="col-span-3 grid gap-[3px] lg:col-start-2">
                {COLS.map((col) => (
                  <span key={col.key} className="relative block h-[4px] bg-offwhite/[0.06]">
                    <span className={`ec-bar absolute inset-y-0 left-0 origin-left ${col.bar}`} style={{ width: pct(row[col.key]) }} />
                  </span>
                ))}
              </span>
            </div>
          ))}

          {/* A escala das barras, rotulada. */}
          <div aria-hidden className="grid border-t border-offwhite/15 px-3 pt-3 lg:grid-cols-[200px_repeat(3,minmax(0,1fr))] lg:gap-x-6 lg:px-4">
            <div className="relative h-6 lg:col-span-3 lg:col-start-2">
              {ticks.map((t) => (
                <span
                  key={t}
                  className={`absolute top-0 font-display text-[10px] tracking-[0.08em] text-offwhite/50 ${t === 0 ? "" : t === scale.max ? "-translate-x-full" : "-translate-x-1/2"}`}
                  style={{ left: pct(t) }}
                >
                  ${t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className={`${microCaps} mt-[clamp(28px,3vw,44px)] max-w-[80ch] text-[10px] text-offwhite/55`}>{economics.footnote}</p>
      </div>
    </section>
  );
}
