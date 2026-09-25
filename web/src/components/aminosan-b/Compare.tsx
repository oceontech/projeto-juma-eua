"use client";

import Image from "next/image";
import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { SplitLines } from "@/components/motion/SplitLines";
import { gsap, useGSAP } from "@/lib/gsap";
import { AMINO, eyebrow, microCaps } from "./ui";

/**
 * A4, a tabela — origem, processo e forma. A coluna do Aminosan® é um cartão
 * branco contínuo, de cima a baixo, com a faixa azul do rótulo e o logo no
 * topo: a mesma gramática do cartão da rota na seção de cima. A da categoria
 * é só o contorno tracejado, com o texto mais apagado. Nunca um concorrente
 * com nome, sempre "often" — docs/03-SITE.md.
 *
 * A entrada: as duas colunas sobem, os fios de cada linha se desenham da
 * esquerda e as células entram uma a uma, no compasso da leitura.
 */
export function Compare() {
  const { compare } = useContent().aminosanB;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const once = { trigger: ".cp-table", start: "top 78%", once: true };
        gsap.fromTo(".cp-col", { y: 80, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 1.1, ease: "expo.out", scrollTrigger: once });
        gsap.fromTo(".cp-rule", { scaleX: 0 }, { scaleX: 1, stagger: 0.12, duration: 1.2, delay: 0.3, ease: "expo.out", scrollTrigger: once });
        gsap.fromTo(".cp-cell", { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, duration: 0.8, delay: 0.45, ease: "power3.out", scrollTrigger: once });
        gsap.fromTo(".cp-logo", { scale: 0.7, rotate: -6 }, { scale: 1, rotate: 0, duration: 1.2, delay: 0.2, ease: "back.out(1.6)", scrollTrigger: once });
        gsap.utils.toArray<HTMLElement>(".cp-m").forEach((card) => {
          gsap.fromTo(card, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 85%", once: true } });
        });
      });
    },
    { scope },
  );

  const rows = compare.rows.length;

  return (
    <section ref={scope} className="bg-white py-sec text-forest">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-end lg:gap-16">
          <div>
            <p className={`${eyebrow} text-moss`}>{compare.label}</p>
            <SplitLines className="mt-4 max-w-[18ch] text-[clamp(32px,3.6vw,64px)] leading-[0.97] tracking-[-0.035em] text-balance">
              {compare.heading}
            </SplitLines>
          </div>
          <p className={`${microCaps} text-[12px] text-forest/75`}>{compare.body}</p>
        </div>

        {/* A tabela. As duas colunas de fundo ocupam todas as linhas da grade
            (cabeçalho + linhas); as células se assentam por cima delas. */}
        {/* Celular: dois cartões empilhados, com a largura toda para o texto. */}
        <div className="mt-8 flex flex-col gap-3 md:hidden">
          <div className="cp-m relative overflow-hidden rounded-[16px] border border-amino/15 bg-white px-4 pt-6 pb-2 shadow-[0_30px_60px_-34px_rgba(19,71,119,0.45)]">
            <span aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-amino" />
            <span aria-hidden className="absolute inset-x-0 top-1.5 h-[2px]" style={{ backgroundColor: AMINO.green }} />
            <div className="relative aspect-[1004/392] w-[min(46%,170px)]">
              <Image src="/img/aminosan-b/aminosan-logo.webp" alt={compare.columns.ours} fill sizes="230px" className="object-contain object-left" />
            </div>
            {compare.rows.map((row) => (
              <div key={row.k} className="mt-3 border-t border-amino/15 pt-3">
                <p className={`${eyebrow} text-moss`}>{row.k}</p>
                <p className="mt-1.5 font-display text-[16px] leading-[1.15] tracking-[-0.02em]">
                  <span aria-hidden className="mr-2 inline-grid size-[0.9em] translate-y-[0.06em] place-items-center rounded-full bg-amino text-white">
                    <svg viewBox="0 0 16 16" className="size-[0.55em]">
                      <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {row.ours}
                </p>
              </div>
            ))}
          </div>
          <div className="cp-m rounded-[16px] border border-dashed border-forest/30 px-4 py-4">
            <p className="font-display text-[16px] leading-[1.1] tracking-[-0.02em] text-forest/55">{compare.columns.theirs}</p>
            {compare.rows.map((row) => (
              <div key={row.k} className="mt-3 border-t border-dashed border-forest/25 pt-3">
                <p className={`${eyebrow} text-moss/80`}>{row.k}</p>
                <p className="mt-1.5 text-[13px] leading-[1.4] text-forest/60">{row.theirs}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="cp-table relative mt-[clamp(40px,5vw,88px)] hidden grid-cols-[minmax(0,0.75fr)_minmax(0,1.15fr)_minmax(0,1fr)] gap-x-5 md:grid"
          style={{ gridTemplateRows: `auto repeat(${rows}, auto)` }}
        >
          <div
            aria-hidden
            className="cp-col relative col-start-1 row-start-1 overflow-hidden rounded-[clamp(14px,1.4vw,24px)] border border-amino/15 bg-white shadow-[0_30px_60px_-34px_rgba(19,71,119,0.45)] md:col-start-2"
            style={{ gridRow: `1 / span ${rows + 1}` }}
          >
            <span className="absolute inset-x-0 top-0 h-1.5 bg-amino" />
            <span className="absolute inset-x-0 top-1.5 h-[2px]" style={{ backgroundColor: AMINO.green }} />
            <span className="absolute -right-[30%] -bottom-[20%] h-[60%] w-[90%] bg-[radial-gradient(closest-side,rgba(19,71,119,0.1),transparent)]" />
          </div>
          <div
            aria-hidden
            className="cp-col col-start-2 row-start-1 rounded-[clamp(14px,1.4vw,24px)] border border-dashed border-forest/30 md:col-start-3"
            style={{ gridRow: `1 / span ${rows + 1}` }}
          />

          {/* Cabeçalho das colunas. */}
          <div className="relative col-start-1 row-start-1 flex items-center px-[clamp(14px,2vw,32px)] pt-[clamp(24px,2.6vw,40px)] pb-4 md:col-start-2">
            <div className="relative aspect-[1004/392] w-[min(100%,230px)]">
              <Image src="/img/aminosan-b/aminosan-logo.webp" alt={compare.columns.ours} fill sizes="230px" className="cp-logo object-contain object-left" />
            </div>
          </div>
          <div className="relative col-start-2 row-start-1 flex items-end px-[clamp(14px,2vw,32px)] pt-[clamp(24px,2.6vw,40px)] pb-4 md:col-start-3">
            <p className="font-display text-[clamp(17px,1.5vw,24px)] leading-[1.1] tracking-[-0.02em] text-forest/55">{compare.columns.theirs}</p>
          </div>

          {compare.rows.map((row, i) => (
            <div key={row.k} className="contents">
              {/* O nome da linha: no celular, no topo da própria linha, por
                  cima das duas células (que abrem com folga para ele) — com
                  a coluna declarada, senão o auto-posicionamento o joga numa
                  terceira coluna implícita; no desktop, a coluna da esquerda. */}
              <div
                className="relative col-span-2 col-start-1 px-[clamp(14px,2vw,32px)] pt-5 md:col-span-1 md:col-start-1 md:flex md:items-start md:px-0 md:pt-7 md:pb-7"
                style={{ gridRow: i + 2 }}
              >
                <span aria-hidden className="cp-rule absolute inset-x-0 top-0 hidden h-px origin-left bg-forest/25 md:block" />
                <p className={`cp-cell ${eyebrow} text-moss`}>{row.k}</p>
              </div>
              <div className="relative col-start-1 px-[clamp(14px,2vw,32px)] pt-10 pb-6 md:col-start-2 md:py-7" style={{ gridRow: i + 2 }}>
                <span aria-hidden className="cp-rule absolute inset-x-[clamp(14px,2vw,32px)] top-0 h-px origin-left bg-amino/15" />
                <p className="cp-cell font-display text-[clamp(18px,1.7vw,28px)] leading-[1.1] tracking-[-0.02em]">
                  <span aria-hidden className="mr-2 inline-grid size-[0.9em] translate-y-[0.06em] place-items-center rounded-full bg-amino text-white">
                    <svg viewBox="0 0 16 16" className="size-[0.55em]">
                      <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {row.ours}
                </p>
              </div>
              <div className="relative col-start-2 px-[clamp(14px,2vw,32px)] pt-10 pb-6 md:col-start-3 md:py-7" style={{ gridRow: i + 2 }}>
                <span aria-hidden className="cp-rule absolute inset-x-[clamp(14px,2vw,32px)] top-0 h-px origin-left border-t border-dashed border-forest/25" />
                <p className="cp-cell text-[clamp(14px,1.15vw,17px)] leading-[1.4] text-forest/60">{row.theirs}</p>
              </div>
            </div>
          ))}
        </div>

        <p className={`${microCaps} mt-6 max-w-[70ch] text-[10px] text-forest/55`}>{compare.note}</p>
      </div>
    </section>
  );
}
