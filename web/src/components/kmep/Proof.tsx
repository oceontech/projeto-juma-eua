"use client";

import { Fragment, useRef } from "react";
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
 * mesmo peso e a diferença entre eles; as barras numa escala que começa em
 * zero e está rotulada (212 e 221 ficam quase do mesmo tamanho, porque são);
 * e o documento — a tabela do ensaio, com a linha das unidades originais, e o
 * artigo revisado por pares com a autoria declarada.
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
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.5,
            ease: "power2.out",
            stagger: 0.1,
            scrollTrigger: { trigger: ".pr-bars", start: "top 85%", once: true },
          },
        );
        gsap.fromTo(
          ".pr-rule",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.1,
            scrollTrigger: { trigger: ".pr-table", start: "top 85%", once: true },
          },
        );
        gsap.fromTo(
          ".pr-row",
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            scrollTrigger: { trigger: ".pr-table", start: "top 85%", once: true },
          },
        );
      });
    },
    { scope },
  );

  const pct = (v: number) => `${(v / scale.max) * 100}%`;

  return (
    <section id="proof" ref={scope} className="bg-cream py-sec text-forest">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-end lg:gap-16">
          <div>
            <p className={`${eyebrow} text-moss`}>{proof.label}</p>
            <SplitLines className="mt-4 max-w-[12ch] text-[clamp(44px,5.6vw,108px)] leading-[0.93] tracking-[-0.04em] text-balance">
              {proof.heading}
            </SplitLines>
          </div>
          <p className={`${microCaps} text-[12px] text-forest/75`}>{proof.body}</p>
        </div>

        {/* Os dois números, com o mesmo peso. */}
        <dl className="mt-[clamp(44px,6vw,96px)] grid grid-cols-2 border-t border-forest/25 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <div className="pt-5 pr-4">
            <dt className={`${microCaps} min-h-[33px] text-moss lg:min-h-0`}>{pair.check.label}</dt>
            <dd className="mt-3 font-display text-[clamp(44px,8.4vw,164px)] leading-[0.82] tracking-[-0.05em]">
              <Counter to={pair.check.value} decimals={1} duration={2} />
              <span className="mt-2 block text-[clamp(13px,1.1vw,18px)] tracking-[0.02em] text-forest/55 sm:mt-0 sm:ml-2 sm:inline">{pair.unit}</span>
            </dd>
          </div>
          <div className="col-span-2 row-start-2 flex items-baseline gap-4 border-t border-forest/15 py-4 lg:col-span-1 lg:row-start-auto lg:flex-col lg:items-center lg:gap-1 lg:border-t-0 lg:border-x lg:px-[clamp(20px,3vw,56px)] lg:pt-5 lg:pb-0">
            <dt className={`${microCaps} text-moss`}>{pair.diff.label}</dt>
            <dd className="font-display text-[clamp(26px,2.4vw,44px)] leading-none tracking-[-0.03em]">
              {pair.diff.value}
              <span className="ml-1 text-[0.45em] tracking-[0.02em] text-forest/55">{pair.unit}</span>
            </dd>
            <dd className={`${microCaps} text-forest/60`}>{pair.diff.note}</dd>
          </div>
          <div className="relative pt-5 pl-4 lg:pl-[clamp(20px,3vw,56px)]">
            <span aria-hidden className="absolute top-[-1px] right-0 left-4 h-[2px] bg-lime lg:left-[clamp(20px,3vw,56px)]" />
            <dt className={`${microCaps} min-h-[33px] text-moss lg:min-h-0`}>{pair.treated.label}</dt>
            <dd className="mt-3 font-display text-[clamp(44px,8.4vw,164px)] leading-[0.82] tracking-[-0.05em]">
              <Counter to={pair.treated.value} decimals={1} duration={2} />
              <span className="mt-2 block text-[clamp(13px,1.1vw,18px)] tracking-[0.02em] text-forest/55 sm:mt-0 sm:ml-2 sm:inline">{pair.unit}</span>
            </dd>
          </div>
        </dl>

        {/* As barras, numa escala que começa em zero. */}
        <div className="pr-bars mt-[clamp(36px,4vw,64px)]">
          {[pair.check, pair.treated].map((row, i) => (
            <div key={row.label} className="grid grid-cols-[minmax(0,1fr)] gap-1 py-2 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center sm:gap-5">
              <p className={`${microCaps} text-[10px] text-forest/70`}>{row.label}</p>
              <div className="relative h-3 bg-forest/[0.06]">
                <span
                  className={`pr-bar absolute inset-y-0 left-0 origin-left ${i === 0 ? "bg-forest/35" : "bg-forest"}`}
                  style={{ width: pct(row.value) }}
                >
                  {/* No tratado, o trecho que passa da testemunha, em lima. */}
                  {i === 1 && (
                    <span
                      className="absolute inset-y-0 right-0 bg-lime"
                      style={{ width: `${((pair.treated.value - pair.check.value) / pair.treated.value) * 100}%` }}
                    />
                  )}
                </span>
              </div>
            </div>
          ))}
          <div className="grid sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-5">
            <p className={`${microCaps} order-last mt-3 text-[10px] text-forest/55 sm:order-none sm:mt-0`}>{scale.label}</p>
            <div className="relative h-8 border-t border-forest/30">
              {ticks.map((t) => (
                <span
                  key={t}
                  className={`absolute top-0 flex flex-col font-display text-[10px] tracking-[0.08em] text-forest/60 ${t === 0 ? "items-start" : t === scale.max ? "-translate-x-full items-end" : "-translate-x-1/2 items-center"}`}
                  style={{ left: pct(t) }}
                >
                  <span className="h-1.5 w-px bg-forest/40" />
                  <span className="mt-1">{t === scale.max ? `${t} ${scale.unit}` : t}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* O documento. */}
        <div className="pr-table mt-[clamp(56px,7vw,112px)]">
          <p className={`${eyebrow} text-moss`}>{table.label}</p>
          <p className={`${microCaps} mt-3 max-w-[70ch] text-[12px] text-forest/75`}>{table.intro}</p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr>
                  {table.columns.map((col) => (
                    <th key={col} scope="col" className={`${microCaps} pb-3 pr-4 text-[10px] font-normal text-moss`}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, r) => (
                  <Fragment key={r}>
                    <tr aria-hidden>
                      <td colSpan={table.columns.length} className="p-0">
                        <span className={`pr-rule block origin-left ${r === 0 ? "h-[2px] bg-forest" : "h-px bg-forest/25"}`} />
                      </td>
                    </tr>
                    <tr className="pr-row">
                      {row.map((cell, c) => (
                        <td
                          key={c}
                          className={`py-4 pr-4 align-baseline ${r === 0 ? "font-display text-[clamp(16px,1.3vw,20px)] tracking-[-0.01em]" : `${microCaps} text-[11px] text-forest/60`} ${r === 0 && (c === 2 || c === 4) ? "font-medium" : ""}`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  </Fragment>
                ))}
                <tr aria-hidden>
                  <td colSpan={table.columns.length} className="p-0">
                    <span className="pr-rule block h-px origin-left bg-forest/25" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* O artigo revisado por pares, separado por régua. */}
        <div className="mt-[clamp(56px,7vw,112px)] grid gap-10 border-t-2 border-forest pt-[clamp(28px,3vw,44px)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className={`${eyebrow} text-moss`}>{paper.label}</p>
            <h3 className="mt-4 max-w-[24ch] text-[clamp(24px,2.3vw,40px)] leading-[1.06] tracking-[-0.025em]">{paper.heading}</h3>
            <p className={`${microCaps} mt-5 max-w-[62ch] text-[12px] text-forest/75`}>{paper.body}</p>
          </div>
          <div>
            <dl>
              {paper.facts.map((fact) => (
                <div key={fact.k} className="grid grid-cols-[110px_minmax(0,1fr)] gap-4 border-t border-forest/15 py-3 sm:grid-cols-[140px_minmax(0,1fr)]">
                  <dt className={`${microCaps} text-[10px] text-moss`}>{fact.k}</dt>
                  <dd className="font-display text-[clamp(15px,1.2vw,18px)] leading-[1.25] tracking-[-0.005em] [overflow-wrap:anywhere]">
                    {fact.v}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 border-l-2 border-lime pl-4 text-[13px] leading-[1.6] text-forest/75">{paper.disclosure}</p>
          </div>
        </div>

        <p className={`${microCaps} mt-[clamp(40px,5vw,72px)] max-w-[80ch] text-[10px] text-forest/55`}>{proof.footnote}</p>
      </div>
    </section>
  );
}
