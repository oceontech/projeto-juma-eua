"use client";

import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { SplitLines } from "@/components/motion/SplitLines";
import { Cta } from "@/components/kmep/ui";
import { gsap, useGSAP } from "@/lib/gsap";
import { eyebrow, microCaps } from "./ui";

/**
 * A6 — a prova é a regra. A seção mais sóbria da página, como a prova do
 * KMEP, mas no escuro: aqui o leitor cético para e lê.
 *
 * Os dois ensaios aparecem como fichas — cultura, local, fonte — e cada
 * resultado como um par de barras SEM escala e da mesma altura, de propósito:
 * a testemunha é só o contorno tracejado, "solicitada", com o ponto que
 * pulsa; a barra do Aminosan® é hachurada, e no lugar do número passa uma
 * tarja preta, "retido". Nenhum dígito aparece em momento nenhum: o lugar do
 * número é um traço, para que nenhum print de tela vire um resultado.
 *
 * Embaixo, por que a testemunha importa, desenhado como duas faixas de
 * talhão lado a lado — talhão, não planta: duas plantas de portes diferentes
 * estão proibidas no design (02-MERCADO-USA.md).
 */
export function Rule() {
  const { rule } = useContent().aminosanB;
  const { labels } = rule;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".rl-file",
          { y: 70, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.14, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".rl-files", start: "top 82%", once: true } },
        );
        gsap.utils.toArray<HTMLElement>(".rl-file").forEach((file) => {
          const once = { trigger: file, start: "top 75%", once: true };
          gsap.fromTo(
            file.querySelectorAll(".rl-bar"),
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, stagger: 0.1, ease: "power2.out", scrollTrigger: once },
          );
          /* A tarja passa por cima do lugar do número, da esquerda. */
          gsap.fromTo(
            file.querySelectorAll(".rl-redact"),
            { scaleX: 0 },
            { scaleX: 1, duration: 0.7, stagger: 0.15, delay: 1.1, ease: "power3.inOut", scrollTrigger: once },
          );
          gsap.fromTo(
            file.querySelectorAll(".rl-stamp"),
            { opacity: 0, scale: 1.4, rotate: -14 },
            { opacity: 1, scale: 1, rotate: -6, duration: 0.5, stagger: 0.15, delay: 1.6, ease: "back.out(2.2)", scrollTrigger: once },
          );
        });
        gsap.fromTo(
          ".rl-strip",
          { scaleY: 0 },
          { scaleY: 1, stagger: 0.12, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".rl-why", start: "top 80%", once: true } },
        );
      });
    },
    { scope },
  );

  return (
    <section id="proof" ref={scope} data-nav-theme="dark" className="relative isolate overflow-hidden bg-night py-sec text-offwhite">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-[20%] left-1/2 -z-10 h-[70%] w-[90%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(19,71,119,0.32),transparent)]"
      />
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-end lg:gap-16">
          <div>
            <p className={`${eyebrow} text-lime`}>{rule.label}</p>
            <SplitLines className="mt-4 text-[clamp(40px,5.4vw,104px)] leading-[0.92] tracking-[-0.045em]">
              {rule.heading.map((line, i) => (
                <span key={line} className={`block ${i ? "text-offwhite/45" : ""}`}>
                  {line}
                </span>
              ))}
            </SplitLines>
          </div>
          <p className="text-[clamp(15px,1.15vw,18px)] leading-[1.55] text-offwhite/75">{rule.body}</p>
        </div>

        {/* As duas fichas de ensaio. */}
        <div className="rl-files mt-[clamp(44px,6vw,96px)] grid gap-4 lg:grid-cols-2 lg:gap-5">
          {rule.trials.map((trial) => (
            <article
              key={trial.place}
              className="rl-file relative overflow-hidden rounded-[clamp(14px,1.4vw,24px)] border border-offwhite/10 bg-linear-[122.93deg,var(--color-night-warm)_2.4%,var(--color-night-deep)_60.23%] p-[clamp(20px,2.4vw,36px)]"
            >
              <dl className="grid grid-cols-3 gap-4 border-b border-offwhite/12 pb-5">
                {[
                  [labels.crop, trial.crop],
                  [labels.place, trial.place],
                  [labels.source, trial.source],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className={`${microCaps} text-[10px] text-offwhite/50`}>{k}</dt>
                    <dd className="mt-1.5 font-display text-[clamp(15px,1.25vw,20px)] leading-[1.15] tracking-[-0.01em]">{v}</dd>
                  </div>
                ))}
              </dl>

              <p className={`${microCaps} mt-5 text-[10px] text-offwhite/50`}>
                {labels.results} · {trial.results}
              </p>
              {/* Um par de barras por resultado. No celular, os pares empilham:
                  lado a lado, quatro barras não cabem na largura. */}
              <div
                className="mt-4 grid gap-4 sm:grid-cols-[repeat(var(--n),minmax(0,1fr))]"
                style={{ ["--n" as string]: trial.results }}
              >
                {Array.from({ length: trial.results }, (_, r) => (
                  <div key={r} aria-hidden className="grid h-[clamp(160px,20vw,260px)] grid-cols-2 items-end gap-2 border-b border-offwhite/25">
                    {/* A testemunha: o contorno, esperando. */}
                    <div className="rl-bar relative flex h-[78%] flex-col justify-between rounded-t-[6px] border border-b-0 border-dashed border-offwhite/35 p-[clamp(8px,1vw,14px)]">
                      <p className={`${microCaps} text-[9px] leading-[1.3] text-offwhite/60`}>{labels.check}</p>
                      <p className="flex items-center gap-2 font-display text-[clamp(12px,0.95vw,14px)] text-offwhite/80">
                        <span className="relative flex size-2 shrink-0">
                          <span className="absolute inset-0 animate-ping rounded-full bg-lime opacity-70 motion-reduce:hidden" />
                          <span className="relative size-2 rounded-full bg-lime" />
                        </span>
                        {labels.requested}
                      </p>
                    </div>
                    {/* O Aminosan®: hachurado, com a tarja no lugar do número. */}
                    <div className="rl-bar relative flex h-[78%] flex-col justify-between overflow-hidden rounded-t-[6px] bg-[repeating-linear-gradient(-45deg,rgba(19,71,119,0.55)_0_6px,rgba(19,71,119,0.25)_6px_12px)] p-[clamp(8px,1vw,14px)] ring-1 ring-amino/60">
                      <p className={`${microCaps} relative text-[9px] leading-[1.3] text-offwhite/80`}>{labels.treated}</p>
                      <div className="relative">
                        <p className="font-display text-[clamp(26px,2.6vw,44px)] leading-none tracking-[-0.04em] text-offwhite/25">––.–</p>
                        <span className="rl-redact absolute -inset-x-1 -inset-y-0.5 origin-left bg-night" />
                        <span className="rl-stamp absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-lime px-1.5 py-0.5 font-display text-[9px] tracking-[0.2em] whitespace-nowrap text-lime uppercase">
                          {labels.withheld}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Por que a testemunha importa: duas faixas de talhão, lado a lado. */}
        <div className="rl-why mt-[clamp(48px,6vw,96px)] grid items-center gap-8 border-t border-offwhite/15 pt-[clamp(28px,3vw,48px)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-16">
          <figure aria-hidden>
          <div className="flex h-[clamp(140px,16vw,220px)] items-stretch gap-[3px] overflow-hidden rounded-[clamp(10px,1vw,16px)]">
            {Array.from({ length: 14 }, (_, i) => {
              const check = i === 6;
              const treated = i === 7;
              return (
                <span
                    key={i}
                    className={`rl-strip relative flex-1 origin-bottom ${
                      check
                        ? "border border-dashed border-lime/70 bg-transparent"
                        : treated
                          ? "bg-amino"
                          : "bg-[linear-gradient(180deg,#3d5a2c,#22331a)]"
                    }`}
                  />
              );
            })}
          </div>
            <figcaption className={`${microCaps} mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[10px] text-offwhite/60`}>
              <span className="flex items-center gap-2">
                <span className="size-2.5 border border-dashed border-lime/80" />
                {labels.check}
              </span>
              <span className="flex items-center gap-2">
                <span className="size-2.5 bg-amino" />
                {labels.treated}
              </span>
            </figcaption>
          </figure>
          <div>
            <p className={`${eyebrow} text-lime`}>{rule.why.heading}</p>
            <p className="mt-4 max-w-[46ch] font-display text-[clamp(19px,1.7vw,28px)] leading-[1.25] tracking-[-0.015em]">{rule.why.body}</p>
          </div>
        </div>

        <div className="mt-[clamp(40px,5vw,80px)] flex flex-col gap-6 rounded-[clamp(14px,1.4vw,24px)] border border-offwhite/12 p-[clamp(20px,2.4vw,36px)] lg:flex-row lg:items-center lg:justify-between">
          <p className="font-display text-[clamp(20px,2vw,34px)] leading-[1.1] tracking-[-0.025em]">
            {rule.close[0]}
            <br />
            <span className="text-offwhite/55">{rule.close[1]}</span>
          </p>
          <Cta href={rule.cta.href} solid className="self-start lg:self-auto">
            {rule.cta.label}
          </Cta>
        </div>

        <p className={`${microCaps} mt-6 max-w-[80ch] text-[10px] text-offwhite/45`}>{rule.footnote}</p>
      </div>
    </section>
  );
}
