"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { useContent, useLocale } from "@/components/layout/LocaleProvider";
import { SplitLines } from "@/components/motion/SplitLines";
import { gsap, useGSAP } from "@/lib/gsap";
import { eyebrow, microCaps } from "./ui";

/**
 * K11 — a conta por acre, como calculadora.
 *
 * O leitor arrasta o preço do milho e escolhe a área; uma cascata de três
 * colunas responde ao vivo: o valor do ganho sobe, o custo do produto desce
 * dele em vermelho, e o que sobra é o líquido. Ao lado, as três leituras que
 * a cascata implica — valor por dólar, preço de equilíbrio e o total na área.
 *
 * Hierarquia inegociável (nota 3 do canônico): o custo aparece na mesma
 * escala e com o mesmo peso do ganho. A cascata tem um metro só, rotulado e
 * começando em zero, então $6 aparece do tamanho que tem ao lado de $38.
 *
 * Os dois números com fonte — o ganho do ensaio e o custo na dose do rótulo —
 * vêm do conteúdo; preço e área são do leitor, e nada mais é inventado.
 */
export function Economics() {
  const { economics } = useContent().kmep;
  const { calc } = economics;
  const locale = useLocale();
  const scope = useRef<HTMLElement>(null);
  const priceId = useId();

  const [price, setPrice] = useState(calc.price.initial);
  const [acres, setAcres] = useState(calc.acres.initial);

  const value = calc.gain * price;
  const net = value - calc.cost;
  const ratio = value / calc.cost;
  const breakEven = calc.cost / calc.gain;
  const farm = net * acres;

  const intl = locale === "pt" ? "pt-BR" : "en-US";
  const money = (n: number, digits = 2) =>
    `$${n.toLocaleString(intl, { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
  const num = (n: number, digits = 0) =>
    n.toLocaleString(intl, { minimumFractionDigits: digits, maximumFractionDigits: digits });

  const pct = (v: number) => `${(v / calc.scaleMax) * 100}%`;
  const ticks = Array.from({ length: calc.scaleMax / calc.scaleStep + 1 }, (_, i) => i * calc.scaleStep);
  const sliderPct = ((price - calc.price.min) / (calc.price.max - calc.price.min)) * 100;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".ec-landscape",
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: scope.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
        gsap.fromTo(
          ".ec-col",
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.2,
            ease: "power3.out",
            stagger: 0.28,
            scrollTrigger: { trigger: ".ec-chart", start: "top 75%", once: true },
          },
        );
        gsap.fromTo(
          ".ec-card",
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.1,
            scrollTrigger: { trigger: ".ec-calc", start: "top 80%", once: true },
          },
        );
      });
    },
    { scope },
  );

  /* As três colunas da cascata: onde começa, quanto mede, e a cor. */
  const cols = [
    { key: "value", label: calc.steps.value, amount: value, from: 0, to: value, bar: "bg-cream", text: "text-cream" },
    { key: "cost", label: calc.steps.cost, amount: -calc.cost, from: net, to: value, bar: "bg-kmep", text: "text-kmep-light" },
    { key: "net", label: calc.steps.net, amount: net, from: 0, to: net, bar: "bg-lime", text: "text-lime" },
  ] as const;

  return (
    <section ref={scope} className="relative isolate overflow-hidden bg-forest py-sec text-offwhite">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="ec-landscape absolute inset-x-0 -top-[12%] h-[124%]">
          <Image
            src="/img/kmep/economics-cornfield.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </div>
      <div className="wrap">
        <div className="grid gap-6 [text-shadow:0_1px_6px_rgba(0,0,0,0.8)] lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-end lg:gap-16">
          <SplitLines className="max-w-[15ch] text-[clamp(36px,4.4vw,80px)] leading-[0.96] tracking-[-0.035em] text-balance">
            {economics.heading}
          </SplitLines>
          <div>
            <p className={`${microCaps} text-[12px] text-offwhite`}>{economics.body}</p>
            <p className={`${microCaps} mt-4 border-l-2 border-lime pl-3 text-[10px] text-offwhite/90`}>{economics.witness}</p>
          </div>
        </div>

        <div className="ec-calc mt-[clamp(44px,6vw,96px)] grid gap-[clamp(20px,2.4vw,40px)] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          {/* Esquerda: o controle de preço e a cascata. */}
          <div className="ec-card rounded-[clamp(14px,1.2vw,22px)] border border-lime/20 bg-forest p-[clamp(18px,2.4vw,40px)] text-offwhite">
            {/* Preço do milho. */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <label htmlFor={priceId} className={`${eyebrow} text-[10px] text-offwhite/60`}>
                  {calc.price.label}
                </label>
                <p className="mt-2 font-display text-[clamp(40px,4.4vw,76px)] leading-none tracking-[-0.04em] tabular-nums">
                  {money(price)}
                  <span className="ml-1 text-[0.32em] tracking-[0.02em] text-offwhite/50">{calc.price.unit}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {calc.price.presets.map((p) => {
                  const on = Math.abs(p - price) < 0.001;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPrice(p)}
                      aria-pressed={on}
                      className={`${microCaps} rounded-full border px-3 py-2 text-[10px] transition-colors ${on ? "border-lime bg-lime text-forest" : "border-offwhite/25 text-offwhite/75 hover:border-offwhite/60"}`}
                    >
                      {money(p)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative mt-6">
              <input
                id={priceId}
                type="range"
                min={calc.price.min}
                max={calc.price.max}
                step={calc.price.step}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                aria-valuetext={`${money(price)} ${calc.price.unit}`}
                className="ec-range w-full"
                style={{ "--fill": `${sliderPct}%` } as React.CSSProperties}
              />
              <div aria-hidden className="mt-2 flex justify-between font-display text-[10px] tracking-[0.08em] text-offwhite/45">
                <span>{money(calc.price.min)}</span>
                <span className={`${microCaps} text-[9px] text-offwhite/40`}>{calc.price.hint}</span>
                <span>{money(calc.price.max)}</span>
              </div>
            </div>

            {/* A cascata. */}
            <div className="ec-chart mt-[clamp(28px,3vw,48px)] grid grid-cols-[auto_minmax(0,1fr)] gap-3">
              <div aria-hidden className="relative h-[clamp(260px,26vw,380px)] w-8">
                {ticks.map((t) => (
                  <span
                    key={t}
                    className="absolute right-0 translate-y-1/2 font-display text-[10px] tracking-[0.06em] text-offwhite/40"
                    style={{ bottom: pct(t) }}
                  >
                    ${t}
                  </span>
                ))}
              </div>
              <div className="relative h-[clamp(260px,26vw,380px)] border-b border-offwhite/30">
                {ticks.slice(1).map((t) => (
                  <span key={t} aria-hidden className="absolute inset-x-0 h-px bg-offwhite/[0.07]" style={{ bottom: pct(t) }} />
                ))}

                {/* Conectores da cascata: do topo do valor ao custo, e da base do custo ao líquido. */}
                <span
                  aria-hidden
                  className="absolute left-[16%] right-[50%] border-t border-dashed border-offwhite/35 transition-[bottom] duration-300 ease-out"
                  style={{ bottom: pct(value) }}
                />
                <span
                  aria-hidden
                  className="absolute left-[50%] right-[16%] border-t border-dashed border-offwhite/35 transition-[bottom] duration-300 ease-out"
                  style={{ bottom: pct(net) }}
                />

                <div className="absolute inset-0 grid grid-cols-3 gap-[clamp(14px,3vw,48px)] px-[clamp(6px,1.6vw,24px)]">
                  {cols.map((col) => (
                    <div key={col.key} className="relative">
                      <div
                        className={`ec-col absolute inset-x-0 ${col.bar} transition-[bottom,height] duration-300 ease-out`}
                        style={{ bottom: pct(col.from), height: pct(col.to - col.from) }}
                      />
                      {/* O número flutua sobre a coluna e anda com ela. */}
                      <p
                        className={`absolute inset-x-0 mb-2 text-center font-display text-[clamp(18px,2vw,32px)] leading-none tracking-[-0.03em] tabular-nums transition-[bottom] duration-300 ease-out ${col.text}`}
                        style={{ bottom: pct(col.to) }}
                      >
                        {col.amount < 0 ? `−${money(-col.amount)}` : money(col.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <span />
              <div className="grid grid-cols-3 items-end gap-[clamp(14px,3vw,48px)] px-[clamp(6px,1.6vw,24px)]">
                {cols.map((col) =>
                  col.key === "cost" ? (
                    /* O rótulo do custo é o próprio produto: o que os $6 compram. */
                    <div key={col.key} className="relative mx-auto h-[clamp(72px,8vw,124px)] w-full max-w-[104px]">
                      <Image
                        src="/img/pack-kmep-us.webp"
                        alt={col.label}
                        fill
                        sizes="130px"
                        className="object-contain object-bottom"
                      />
                    </div>
                  ) : (
                    <p key={col.key} className={`${microCaps} text-center text-[9px] leading-snug text-offwhite/60 sm:text-[10px]`}>
                      {col.label}
                    </p>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Direita: as três leituras. */}
          <div className="grid gap-[clamp(12px,1.4vw,20px)]" aria-live="polite">
            {/* Valor por dólar: um anel que preenche. */}
            <div className="ec-card flex items-center gap-5 rounded-[clamp(14px,1.2vw,22px)] border border-lime/20 bg-forest p-[clamp(18px,2vw,28px)] text-offwhite">
              <svg viewBox="0 0 80 80" aria-hidden className="w-[clamp(64px,6vw,88px)] shrink-0 -rotate-90">
                <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="8" className="text-offwhite/10" />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  strokeWidth="8"
                  className="stroke-kmep transition-[stroke-dasharray] duration-300 ease-out"
                  strokeDasharray={`${(1 / ratio) * 213.6} 213.6`}
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  strokeWidth="8"
                  className="stroke-lime transition-[stroke-dasharray,stroke-dashoffset] duration-300 ease-out"
                  strokeDasharray={`${(1 - 1 / ratio) * 213.6} 213.6`}
                  strokeDashoffset={-(1 / ratio) * 213.6}
                />
              </svg>
              <div>
                <p className={`${microCaps} text-[10px] text-offwhite/60`}>{calc.ratio.label}</p>
                <p className="mt-1 font-display text-[clamp(32px,3vw,52px)] leading-none tracking-[-0.04em] tabular-nums">
                  {money(ratio)}
                  <span className="ml-2 text-[0.36em] tracking-[0.02em] text-offwhite/50">{calc.ratio.suffix}</span>
                </p>
              </div>
            </div>

            {/* Equilíbrio: onde o preço de hoje está em relação a ele. */}
            <div className="ec-card rounded-[clamp(14px,1.2vw,22px)] border border-lime/20 bg-forest p-[clamp(18px,2vw,28px)] text-offwhite">
              <p className={`${microCaps} text-[10px] text-offwhite/60`}>{calc.breakEven.label}</p>
              <p className="mt-1 font-display text-[clamp(32px,3vw,52px)] leading-none tracking-[-0.04em] text-kmep-light tabular-nums">
                {money(breakEven)}
                <span className="ml-1 text-[0.36em] tracking-[0.02em] text-offwhite/50">{calc.breakEven.unit}</span>
              </p>
              <div aria-hidden className="relative mt-5 h-2 rounded-full bg-offwhite/10">
                <span className="absolute inset-y-0 left-0 rounded-full bg-kmep" style={{ width: `${(breakEven / calc.price.max) * 100}%` }} />
                <span
                  className="absolute inset-y-0 rounded-full bg-lime transition-[width] duration-300 ease-out"
                  style={{ left: `${(breakEven / calc.price.max) * 100}%`, width: `${((price - breakEven) / calc.price.max) * 100}%` }}
                />
                <span
                  className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-forest bg-cream transition-[left] duration-300 ease-out"
                  style={{ left: `${(price / calc.price.max) * 100}%` }}
                />
              </div>
              <div aria-hidden className="mt-2 flex justify-between font-display text-[10px] tracking-[0.06em] text-offwhite/40">
                <span>$0</span>
                <span>{money(calc.price.max)}</span>
              </div>
            </div>

            {/* A área do leitor. */}
            <div className="ec-card rounded-[clamp(14px,1.2vw,22px)] bg-lime p-[clamp(18px,2vw,28px)] text-forest">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className={`${microCaps} text-[10px] text-forest/75`}>{calc.acres.label}</p>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label={calc.acres.label}>
                  {calc.acres.presets.map((a) => {
                    const on = a === acres;
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setAcres(a)}
                        aria-pressed={on}
                        className={`${microCaps} rounded-full px-2.5 py-1.5 text-[10px] transition-colors ${on ? "bg-forest text-lime" : "bg-forest/10 text-forest hover:bg-forest/20"}`}
                      >
                        {num(a)}
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className={`${microCaps} mt-5 text-[10px] text-forest/75`}>{calc.farm.label}</p>
              <p className="mt-1 font-display text-[clamp(40px,4.2vw,72px)] leading-none tracking-[-0.045em] tabular-nums">
                {money(farm, 0)}
              </p>
              <p className={`${microCaps} mt-3 text-[10px] text-forest/65`}>
                {money(net)}
                {calc.perAcre} × {num(acres)} {calc.acres.unit} · {calc.farm.note}
              </p>
            </div>
          </div>
        </div>

        <p className={`${microCaps} mt-[clamp(28px,3vw,44px)] max-w-[80ch] text-[10px] text-offwhite/90 [text-shadow:0_1px_6px_rgba(0,0,0,0.8)]`}>{economics.footnote}</p>
      </div>
    </section>
  );
}
