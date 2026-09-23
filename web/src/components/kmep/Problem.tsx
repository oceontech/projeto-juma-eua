"use client";

import Image from "next/image";
import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { gsap, useGSAP } from "@/lib/gsap";
import { eyebrow, microCaps } from "./ui";

/* Marcas da régua de profundidade sobre as ilustrações. */
const TICKS = 13;
const VISUALS = [
  "/img/kmep/problem-canopy.webp",
  "/img/kmep/problem-bounce.webp",
  "/img/kmep/problem-dry.webp",
];

/**
 * K3. Cada perda da lista tem uma ilustração transparente. A régua, a legenda
 * e a troca das imagens compartilham o mesmo progresso de scroll.
 */
export function Problem() {
  const { problem } = useContent().kmep;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 1024px)",
        },
        (ctx) => {
          const { animate, desktop } = ctx.conditions as { animate: boolean; desktop: boolean };
          if (!animate) return;

          gsap.fromTo(
            ".pb-photo-wrap",
            { clipPath: "inset(30% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "none",
              scrollTrigger: { trigger: scope.current, start: "top 85%", end: "top 15%", scrub: 0.6 },
            },
          );

          const story = gsap.timeline({
            scrollTrigger: {
              trigger: scope.current,
              start: "top top",
              end: desktop ? "+=200%" : "+=250%",
              pin: true,
              scrub: 0.6,
            },
          });

          story.fromTo(".pb-marker", { top: "0%" }, { top: "100%", duration: 3, ease: "none" }, 0);
          VISUALS.slice(1).forEach((_, i) => {
            const at = i + 0.9;
            story
              .fromTo(
                `.pb-scene-${i + 1}`,
                { clipPath: "inset(100% 0% 0% 0%)" },
                { clipPath: "inset(0% 0% 0% 0%)", duration: 0.45, ease: "none", immediateRender: false },
                at,
              )
              .fromTo(
                `.pb-scene-${i}`,
                { clipPath: "inset(0% 0% 0% 0%)" },
                { clipPath: "inset(0% 0% 100% 0%)", duration: 0.45, ease: "none", immediateRender: false },
                at,
              )
              .to(`.pb-cap-${i}`, { autoAlpha: 0, duration: 0.2, ease: "none" }, at + 0.15)
              .to(`.pb-cap-${i + 1}`, { autoAlpha: 1, duration: 0.2, ease: "none" }, at + 0.15)
              .to(`.pb-row-${i}`, { opacity: 0.5, duration: 0.2 }, at + 0.15)
              .to(`.pb-row-${i + 1}`, { opacity: 1, duration: 0.2 }, at + 0.15);
          });

          story
            .to(".pb-mobile-body-0", { autoAlpha: 0, duration: 0.2, ease: "none" }, 0.9)
            .to(".pb-mobile-body-1", { autoAlpha: 1, duration: 0.2, ease: "none" }, 0.9);

          story
            .fromTo(
              ".pb-dark-curtain",
              { top: "100%" },
              { top: "-25%", duration: 0.55, ease: "none", immediateRender: false },
              1.9,
            );

          if (desktop) {
            story
              .to(".pb-copy-desktop .pb-row", { color: "#F6FFEE", duration: 0.3, ease: "none" }, 2.1)
              .to(".pb-copy-desktop .pb-ledger-label", { color: "#B9C2A0", duration: 0.3, ease: "none" }, 2.12)
              .to(".pb-copy-desktop .pb-body", { color: "rgba(246,255,238,0.72)", duration: 0.3, ease: "none" }, 2.22)
              .to(".pb-copy-desktop .pb-heading", { color: "#F6FFEE", duration: 0.2, ease: "none" }, 2.38);
          } else {
            story
              .to(".pb-copy-mobile .pb-body", { color: "rgba(246,255,238,0.72)", duration: 0.3, ease: "none" }, 2.1)
              .to(".pb-copy-mobile .pb-heading", { color: "#F6FFEE", duration: 0.3, ease: "none" }, 2.2)
              .to(".pb-copy-mobile .pb-row", { color: "#F6FFEE", duration: 0.25, ease: "none" }, 2.35)
              .to(".pb-copy-mobile .pb-ledger-label", { color: "#B9C2A0", duration: 0.25, ease: "none" }, 2.35);
          }

          story
            .to(".pb-ruler", { backgroundColor: "rgba(246,255,238,0.35)", duration: 0.35 }, 2.18)
            .to(".pb-tick", { backgroundColor: "rgba(246,255,238,0.55)", duration: 0.35 }, 2.18)
            .to(".pb-dot", { borderColor: "#F6FFEE", backgroundColor: "#0C0C0E", duration: 0.35 }, 2.18);

          gsap.fromTo(
            ".pb-fio",
            { scaleX: 0 },
            {
              scaleX: 1,
              stagger: 0.12,
              duration: 1.1,
              ease: "expo.out",
              scrollTrigger: { trigger: desktop ? ".pb-ledger-desktop" : ".pb-ledger-mobile", start: "top 88%", once: true },
            },
          );
        },
      );
    },
    { scope },
  );

  return (
    <section ref={scope} className="relative isolate flex h-[100svh] flex-col bg-cream text-forest motion-reduce:h-auto lg:grid lg:h-auto lg:min-h-[100svh] lg:grid-cols-2">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="pb-dark-curtain absolute top-full right-0 left-0 h-[125%]"
          style={{
            background: "linear-gradient(to bottom, transparent 0%, #0C0C0E 20%, #0C0C0E 100%)",
          }}
        />
      </div>
      <div className="pb-photo-wrap relative z-10 h-[44svh] shrink-0 overflow-hidden [@media(max-height:700px)]:h-[36svh] lg:h-auto lg:min-h-[100svh]">
        <div aria-hidden className="pointer-events-none absolute inset-[15%] rounded-full bg-moss/20 blur-[64px]" />
        {VISUALS.map((src, i) => (
          <div
            key={src}
            className={`pb-scene-${i} absolute inset-0`}
            style={i ? { clipPath: "inset(100% 0% 0% 0%)" } : undefined}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain p-[3%] lg:p-[7%]"
            />
          </div>
        ))}

        {/* A régua: fio vertical, marcas, e o marcador com a legenda. */}
        <div aria-hidden className="pb-ruler absolute inset-y-[8%] right-[clamp(20px,3vw,48px)] w-px bg-forest/35 lg:inset-y-[14%]">
          {Array.from({ length: TICKS }, (_, t) => (
            <span
              key={t}
              className={`pb-tick absolute right-0 h-px bg-forest/55 ${t % 4 === 0 ? "w-3" : "w-1.5"}`}
              style={{ top: `${(t / (TICKS - 1)) * 100}%` }}
            />
          ))}
          {/* Ancorado pela direita: a legenda cresce para dentro da foto e o
              ponto fica centrado no fio. */}
          <div className="pb-marker absolute top-0 right-0 flex translate-x-[5px] -translate-y-1/2 items-center gap-2">
            <span className="grid justify-items-end">
              {problem.ledger.items.map((caption, i) => (
                <span
                  key={caption}
                  className={`pb-cap-${i} col-start-1 row-start-1 rounded-full border border-forest/20 bg-forest/85 px-3 py-1.5 font-display text-[10px] tracking-[0.12em] whitespace-nowrap text-cream uppercase backdrop-blur-md ${i ? "invisible opacity-0" : ""}`}
                >
                  {caption}
                </span>
              ))}
            </span>
            <span className="pb-dot size-2.5 shrink-0 rounded-full border border-forest bg-cream" />
          </div>
        </div>
      </div>

      <div className="pb-copy-mobile relative z-10 flex min-h-0 flex-1 flex-col px-[var(--spacing-gut)] pt-3 pb-4 motion-reduce:pb-12 lg:hidden">
        <div className="pb-ledger-mobile shrink-0">
          <p className={`pb-ledger-label ${eyebrow} text-[9px] text-moss`}>{problem.ledger.label}</p>
          <ol className="mt-2">
            {problem.ledger.items.map((item, i) => (
              <li key={item} className={`pb-row pb-row-${i} relative grid grid-cols-[2rem_1fr] items-baseline py-1.5 ${i ? "opacity-50" : ""}`}>
                <span aria-hidden className="pb-fio absolute inset-x-0 top-0 h-px origin-left bg-kmep/70" />
                <span className="font-display text-[10px] tracking-[0.14em] text-kmep">0{i + 1}</span>
                <span className="font-display text-[clamp(14px,4vw,18px)] leading-[1.15] tracking-[-0.01em]">{item}</span>
              </li>
            ))}
          </ol>
        </div>

        <h2 className="pb-heading mt-auto max-w-[16ch] pt-5 text-[clamp(27px,7.5vw,34px)] leading-[0.98] tracking-[-0.035em] text-balance">
          {problem.heading}
        </h2>

        <div className="relative mt-2 shrink-0 motion-reduce:space-y-3">
          {problem.body.map((p, i) => (
            <p
              key={p}
              className={`pb-body pb-mobile-body-${i} ${microCaps} text-[clamp(10px,2.5vw,11px)] leading-[1.35] tracking-[0.08em] text-forest/75 ${i ? "invisible absolute inset-x-0 top-0 opacity-0 motion-reduce:visible motion-reduce:static motion-reduce:opacity-100" : ""}`}
            >
              {p}
            </p>
          ))}
        </div>

      </div>

      <div className="pb-copy-desktop relative z-10 hidden flex-col justify-center px-[var(--spacing-gut)] py-[clamp(56px,7vw,110px)] lg:flex lg:px-[clamp(40px,5vw,96px)]">
        <SplitLines className="pb-heading max-w-[15ch] text-[clamp(34px,3.8vw,68px)] leading-[0.98] tracking-[-0.03em] text-balance">
          {problem.heading}
        </SplitLines>

        <Reveal stagger={0.1} className="mt-[clamp(24px,3vw,44px)] max-w-[52ch]">
          {problem.body.map((p) => (
            <p key={p} className={`pb-body ${microCaps} mt-5 text-[12px] text-forest/75 first:mt-0`}>
              {p}
            </p>
          ))}
        </Reveal>

        <div className="pb-ledger-desktop mt-[clamp(32px,4vw,56px)] max-w-[52ch]">
          <p className={`pb-ledger-label ${eyebrow} text-[10px] text-moss`}>{problem.ledger.label}</p>
          <ol className="mt-3">
            {problem.ledger.items.map((item, i) => (
              <li key={item} className={`pb-row pb-row-${i} relative grid min-h-[18svh] grid-cols-[2.5rem_1fr] items-start py-3 lg:min-h-0 lg:items-baseline ${i ? "opacity-50" : ""}`}>
                <span aria-hidden className="pb-fio absolute inset-x-0 top-0 h-px origin-left bg-kmep/70" />
                <span className="font-display text-[12px] tracking-[0.14em] text-kmep">0{i + 1}</span>
                <span className="font-display text-[clamp(17px,1.4vw,22px)] leading-[1.2] tracking-[-0.01em]">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
