"use client";

import Image from "next/image";
import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { Counter } from "@/components/motion/Counter";
import { SplitLines } from "@/components/motion/SplitLines";
import { gsap, useGSAP } from "@/lib/gsap";
import { eyebrow, microCaps } from "./ui";

/**
 * K10 — a prova. A seção mais sóbria da página, de propósito: aqui o leitor
 * cético para de rolar e lê. Anima menos que as vizinhas.
 *
 * Três camadas, cada uma numa escala de leitura: os dois números com o
 * mesmo peso, dentro de barras verticais numa escala que começa em zero e
 * está rotulada (212 e 221 ficam quase da mesma altura, porque são), com a
 * diferença amarrada ao topo do tratado;
 * e o documento, desenhado em vez de tabelado — a ficha do ensaio com a
 * conversão de unidades, e o artigo revisado por pares como esquema de
 * protocolo e cartão de citação, com a autoria declarada.
 *
 * Nada de duas plantas de tamanhos diferentes: o resultado é tipografia.
 */
export function Proof() {
  const { proof } = useContent().kmep;
  const { pair, scale, table, paper } = proof;
  const scope = useRef<HTMLElement>(null);
  const ticks = Array.from({ length: scale.max / scale.step + 1 }, (_, i) => i * scale.step);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".pr-bar",
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.5,
            ease: "power2.out",
            stagger: 0.12,
            scrollTrigger: { trigger: ".pr-bars", start: "top 75%", once: true },
          },
        );
        gsap.fromTo(
          ".pr-diff",
          { opacity: 0, x: -10 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: 1.3,
            ease: "power2.out",
            scrollTrigger: { trigger: ".pr-bars", start: "top 75%", once: true },
          },
        );
        gsap.fromTo(
          ".pr-jug",
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: 1.1,
            ease: "power2.out",
            scrollTrigger: { trigger: ".pr-bars", start: "top 75%", once: true },
          },
        );
        gsap.fromTo(
          ".pr-table .pr-tile",
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.07,
            ease: "power2.out",
            scrollTrigger: { trigger: ".pr-table", start: "top 85%", once: true },
          },
        );
        gsap.fromTo(
          ".pr-dot",
          { scale: 0 },
          {
            scale: 1,
            duration: 0.45,
            ease: "back.out(2)",
            stagger: 0.018,
            scrollTrigger: { trigger: ".pr-scheme", start: "top 80%", once: true },
          },
        );
      });
    },
    { scope },
  );

  const pct = (v: number) => `${(v / scale.max) * 100}%`;

  return (
    <section id="proof" ref={scope} className="bg-white py-sec text-night">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-end lg:gap-16">
          <div>
            <p className={`${eyebrow} text-kmep`}>{proof.label}</p>
            <SplitLines className="mt-4 max-w-[16ch] text-[clamp(28px,2.6vw,48px)] leading-[1.02] tracking-[-0.03em] text-balance">
              {proof.heading}
            </SplitLines>
          </div>
          <p className={`${microCaps} text-[12px] text-night/75`}>{proof.body}</p>
        </div>

        {/* O gráfico: barras verticais numa escala que começa em zero, com o
            número dentro de cada barra. 212 e 221 ficam quase da mesma altura,
            porque são — a diferença aparece em vermelho, no topo do tratado. */}
        <figure className="pr-bars mt-[clamp(44px,6vw,96px)]">
          {/* No celular, a diferença vem antes do gráfico. */}
          <div className="mb-6 flex items-baseline gap-4 border-y border-night/15 py-4 lg:hidden">
            <p className={`${microCaps} text-kmep`}>{pair.diff.label}</p>
            <p className="font-display text-[clamp(26px,7vw,40px)] leading-none tracking-[-0.03em] text-kmep">
              {pair.diff.value}
              <span className="ml-1 text-[0.45em] tracking-[0.02em] text-night/55">{pair.unit}</span>
            </p>
            <p className={`${microCaps} text-night/60`}>{pair.diff.note}</p>
          </div>

          <p className={`${microCaps} mb-3 text-[10px] text-night/55`}>{scale.unit}</p>
          <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 sm:gap-4">
            {/* Eixo Y. */}
            <div aria-hidden className="relative h-[clamp(400px,46vw,640px)] w-7 sm:w-9">
              {ticks.map((t) => (
                <span
                  key={t}
                  className="absolute right-0 translate-y-1/2 font-display text-[10px] tracking-[0.08em] text-night/60"
                  style={{ bottom: pct(t) }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Área do gráfico. */}
            <div className="relative h-[clamp(400px,46vw,640px)] border-b border-night/40">
              {ticks.slice(1).map((t) => (
                <span key={t} aria-hidden className="absolute inset-x-0 h-px bg-night/10" style={{ bottom: pct(t) }} />
              ))}

              <dl className="absolute inset-0 grid grid-cols-2 items-end gap-[clamp(10px,3vw,48px)] px-[clamp(6px,2vw,32px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)]">
                {/* Testemunha. */}
                <div className="pr-bar relative flex flex-col border border-night/20 bg-white" style={{ height: pct(pair.check.value) }}>
                  <div className="p-[clamp(10px,1.4vw,24px)]">
                    <dt className={`${microCaps} text-[10px] text-night/75`}>{pair.check.label}</dt>
                    <dd className="mt-3 font-display text-[clamp(32px,5.6vw,104px)] leading-[0.85] tracking-[-0.05em]">
                      <Counter to={pair.check.value} decimals={1} duration={2} />
                      <span className="mt-2 block text-[clamp(12px,1vw,16px)] tracking-[0.02em] text-night/55">{pair.unit}</span>
                    </dd>
                  </div>
                </div>

                {/* Tratado, em preto: o trecho que passa da testemunha, no vermelho do produto, no topo. */}
                <div className="pr-bar relative flex flex-col bg-night text-cream" style={{ height: pct(pair.treated.value) }}>
                  <span
                    aria-hidden
                    className="block shrink-0 bg-kmep"
                    style={{ height: `${((pair.treated.value - pair.check.value) / pair.treated.value) * 100}%` }}
                  />
                  <div className="p-[clamp(10px,1.4vw,24px)]">
                    <dt className={`${microCaps} text-[10px] text-kmep-light`}>{pair.treated.label}</dt>
                    <dd className="mt-3 font-display text-[clamp(32px,5.6vw,104px)] leading-[0.85] tracking-[-0.05em]">
                      <Counter to={pair.treated.value} decimals={1} duration={2} />
                      <span className="mt-2 block text-[clamp(12px,1vw,16px)] tracking-[0.02em] text-cream/55">{pair.unit}</span>
                    </dd>
                  </div>
                  {/* A marca, no pé da barra — o que fez a diferença acima dela. */}
                  <div className="pr-jug absolute right-[clamp(10px,1.4vw,24px)] bottom-[clamp(10px,1.4vw,24px)] left-[clamp(10px,1.4vw,24px)] h-[clamp(60px,7.5vw,120px)]">
                    <Image
                      src="/img/kmep/kmep-ultra-logo.webp"
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 20vw, 40vw"
                      quality={90}
                      className="object-contain object-bottom"
                    />
                  </div>
                </div>

                {/* A diferença, amarrada ao trecho em vermelho por um colchete. */}
                <div className="relative hidden h-full lg:block">
                  <span
                    aria-hidden
                    className="pr-diff absolute left-0 w-3 border-y-2 border-r-2 border-kmep"
                    style={{
                      bottom: pct(pair.check.value),
                      height: pct(pair.treated.value - pair.check.value),
                    }}
                  />
                  <div
                    className="pr-diff absolute left-[clamp(28px,2.4vw,44px)]"
                    style={{ bottom: `calc(${pct(pair.treated.value)} + clamp(16px, 1.6vw, 24px))` }}
                  >
                    <dt className={`${microCaps} text-kmep`}>{pair.diff.label}</dt>
                    <dd className="mt-2 font-display text-[clamp(44px,4.6vw,88px)] leading-none tracking-[-0.04em] text-kmep">
                      {pair.diff.value}
                      <span className="ml-1 text-[0.32em] tracking-[0.02em] text-night/55">{pair.unit}</span>
                    </dd>
                    <dd className={`${microCaps} mt-2 text-night/60`}>{pair.diff.note}</dd>
                  </div>
                </div>
              </dl>

              {/* O nível da testemunha, atravessando as duas barras. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 border-t border-dashed border-night/45"
                style={{ bottom: pct(pair.check.value) }}
              />
            </div>
          </div>
          <figcaption className={`${microCaps} mt-4 text-[10px] text-night/55`}>{scale.label}</figcaption>
        </figure>

        {/* A ficha do ensaio: quatro fatos com ícone e a conversão de unidades. */}
        <div className="pr-table mt-[clamp(56px,7vw,112px)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10">
            <p className={`${eyebrow} text-kmep`}>{table.label}</p>
            <p className={`${microCaps} max-w-[62ch] text-[11px] text-night/60 sm:text-right`}>{table.intro}</p>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden border border-night/15 bg-night/15 lg:grid-cols-4">
            {table.facts.map((fact) => (
              <div key={fact.k} className="pr-tile relative flex flex-col gap-5 bg-white p-[clamp(16px,2vw,28px)]">
                <span className="absolute top-[clamp(16px,2vw,28px)] right-[clamp(16px,2vw,28px)] grid size-10 place-items-center rounded-full bg-night text-kmep-light">
                  <FactIcon name={fact.icon} />
                </span>
                <div className="max-w-[calc(100%-56px)]">
                  <dt className={`${microCaps} text-[10px] text-night/55`}>{fact.k}</dt>
                  <dd className="mt-2 font-display text-[clamp(20px,1.9vw,30px)] leading-none tracking-[-0.02em]">
                    {fact.pending ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-night/20 px-3 py-1.5 text-[clamp(13px,1vw,15px)] tracking-normal">
                        <span className="relative flex size-2">
                          <span className="absolute inset-0 animate-ping rounded-full bg-kmep-light opacity-70 motion-reduce:hidden" />
                          <span className="relative size-2 rounded-full bg-kmep" />
                        </span>
                        {fact.v}
                      </span>
                    ) : (
                      fact.v
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          {/* Unidades americanas ⇄ unidades do ensaio. */}
          <div className="mt-4">
            <p className={`${microCaps} text-[10px] text-night/55`}>{table.original.label}</p>
            <dl className="mt-3 grid gap-3 sm:grid-cols-3">
              {table.original.rows.map((row, i) => (
                <div
                  key={row.k}
                  className={`pr-tile flex items-center justify-between gap-3 px-4 py-3 ${i === 0 ? "bg-night text-cream" : i === 2 ? "bg-kmep text-cream" : "bg-white"}`}
                >
                  <dt className={`${microCaps} text-[10px] text-night/65`}>{row.k}</dt>
                  <dd className="flex items-center gap-2 font-display text-[clamp(14px,1.1vw,17px)] tracking-[-0.01em] whitespace-nowrap">
                    <span className="font-medium">{row.us}</span>
                    <svg aria-hidden viewBox="0 0 16 10" className="w-4 text-night/40" fill="none" stroke="currentColor" strokeWidth="1.3">
                      <path d="M1 3h13m-3-2 3 2-3 2M15 7H2m3-2-3 2 3 2" />
                    </svg>
                    <span className="text-night/55">{row.orig}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* O artigo revisado por pares: o protocolo desenhado e a citação. */}
        <div className="mt-[clamp(56px,7vw,112px)] grid gap-10 border-t-2 border-night pt-[clamp(28px,3vw,44px)] lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className={`${eyebrow} text-kmep`}>{paper.label}</p>
            <h3 className="mt-4 max-w-[26ch] text-[clamp(22px,2vw,34px)] leading-[1.08] tracking-[-0.025em]">{paper.heading}</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {paper.chips.map((chip) => (
                <li key={chip} className={`${microCaps} rounded-full bg-night px-3 py-1.5 text-[10px] text-cream`}>
                  {chip}
                </li>
              ))}
            </ul>

            {/* Tratamentos × aplicações. */}
            <figure className="pr-scheme mt-8 border border-night/15 p-[clamp(16px,2vw,28px)]">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <p className={`${microCaps} text-[10px] text-kmep`}>{paper.scheme.label}</p>
                <div className={`${microCaps} flex flex-wrap gap-4 text-[10px] text-night/60`}>
                  <span className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full border border-night/45" />
                    {paper.scheme.legend.insecticide}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-kmep" />
                    {paper.scheme.legend.kmep}
                  </span>
                </div>
              </div>
              <div className="mt-5 space-y-5">
                {paper.scheme.treatments.map((tr, r) => (
                  <div key={tr.label}>
                    <p className="flex items-center gap-2 text-[13px] leading-snug text-night/80">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-night text-[10px] text-cream">{r + 1}</span>
                      {tr.label}
                    </p>
                    <div className="mt-2 grid grid-cols-[repeat(15,minmax(0,1fr))] gap-[clamp(3px,0.5vw,8px)]">
                      {Array.from({ length: paper.scheme.applications }, (_, i) => {
                        const on = tr.kmep === "all" || (tr.kmep === "alternate" && i % 2 === 0);
                        return (
                          <span
                            key={i}
                            aria-hidden
                            className={`pr-dot aspect-square max-w-7 rounded-full ${on ? "bg-kmep" : "border border-night/30"}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div aria-hidden className="mt-2 grid grid-cols-[repeat(15,minmax(0,1fr))] gap-[clamp(3px,0.5vw,8px)] font-display text-[10px] text-night/45">
                {Array.from({ length: paper.scheme.applications }, (_, i) => (
                  <span key={i} className="max-w-7 text-center">
                    {i === 0 || (i + 1) % 5 === 0 ? i + 1 : ""}
                  </span>
                ))}
              </div>
              <figcaption className={`${microCaps} mt-4 text-[10px] text-night/50`}>{paper.scheme.note}</figcaption>
            </figure>

            <p className="mt-5 flex items-start gap-3 font-display text-[clamp(17px,1.4vw,22px)] leading-snug tracking-[-0.01em]">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-kmep text-cream">
                <svg aria-hidden viewBox="0 0 12 12" className="w-3" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 6.5 5 9l5-6" />
                </svg>
              </span>
              {paper.result}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {/* O cartão de citação. */}
            <div className="pr-cite relative overflow-hidden bg-night p-[clamp(22px,2.6vw,40px)] text-cream">
              <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-kmep" />
              <p className={`${microCaps} text-[10px] text-kmep-light`}>{paper.citation.label}</p>
              <p className="mt-4 font-display text-[clamp(30px,3vw,52px)] leading-none tracking-[-0.035em]">{paper.citation.journal}</p>
              <p className="mt-2 font-display text-[clamp(15px,1.2vw,18px)] text-cream/70">{paper.citation.issue}</p>
              <p className="mt-8 border-t border-cream/15 pt-4 font-mono text-[12px] text-cream/60 [overflow-wrap:anywhere]">
                DOI {paper.citation.doi}
              </p>
              <a
                href={paper.citation.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${microCaps} mt-5 inline-flex items-center gap-2 bg-kmep px-4 py-3 text-[11px] text-cream transition-colors hover:bg-cream hover:text-night`}
              >
                {paper.citation.cta}
                <svg aria-hidden viewBox="0 0 12 12" className="w-3" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M3 9 9 3M4 3h5v5" />
                </svg>
              </a>
            </div>
            <p className="border-l-2 border-kmep pl-4 text-[13px] leading-[1.6] text-night/70">{paper.disclosure}</p>
          </div>
        </div>

        <p className={`${microCaps} mt-[clamp(40px,5vw,72px)] max-w-[80ch] text-[10px] text-night/55`}>{proof.footnote}</p>
      </div>
    </section>
  );
}

/** Ícones de traço da ficha do ensaio. */
function FactIcon({ name }: { name: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    className: "w-5",
    "aria-hidden": true,
  } as const;
  switch (name) {
    case "crop":
      return (
        <svg {...common}>
          <path d="M12 3c2.2 1.6 3 4.2 3 7.5S14 17 12 18c-2-1-3-4.2-3-7.5S9.8 4.6 12 3Z" />
          <path d="M9.3 8h5.4M9 11h6M9.4 14h5.2M12 18v3M12 21c-2-2.5-5-3-7-3 1 2 3.5 3 7 3Zm0 0c2-2.5 5-3 7-3-1 2-3.5 3-7 3Z" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common}>
          <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" />
          <circle cx="12" cy="10" r="2.4" />
        </svg>
      );
    case "source":
      return (
        <svg {...common}>
          <path d="M6 3h8l4 4v14H6Z" />
          <path d="M14 3v4h4M9 12h6M9 15.5h6M9 19h3.5" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="4" y="5.5" width="16" height="14.5" rx="1" />
          <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
        </svg>
      );
  }
}
