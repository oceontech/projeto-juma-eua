"use client";

import Image from "next/image";
import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { gsap, useGSAP } from "@/lib/gsap";
import { eyebrow, microCaps } from "./ui";

/* Marcas da régua de profundidade sobre a foto. */
const TICKS = 13;

/**
 * K3. Tela dividida: o macro do cartucho do milho, com as gotas na
 * superfície cerosa, se abre de baixo para cima preso ao scroll (o gesto do
 * Proof da LP B). Na borda da foto, uma régua de profundidade: o marcador
 * desce do topo do dossel até a folha que importava, e a legenda troca no
 * meio do caminho. Legenda, não número — nenhum dado de cobertura foi medido
 * e publicado, então a cena mostra onde olhar, não quanto se perdeu.
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
          still: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { animate } = ctx.conditions as { animate: boolean };
          if (!animate) {
            gsap.set(".pb-marker", { top: "100%" });
            gsap.set(".pb-cap-0", { opacity: 0 });
            gsap.set(".pb-cap-1", { opacity: 1 });
            return;
          }

          gsap
            .timeline({
              scrollTrigger: { trigger: scope.current, start: "top 85%", end: "center center", scrub: 0.6 },
            })
            .fromTo(".pb-photo-wrap", { clipPath: "inset(30% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }, 0)
            .fromTo(".pb-photo", { scale: 1.25 }, { scale: 1, ease: "none" }, 0);

          /* A régua anda num trecho próprio, mais longo: começa quando a foto
             já abriu e termina com a seção quase saindo. */
          gsap
            .timeline({
              scrollTrigger: { trigger: ".pb-photo-wrap", start: "top 45%", end: "bottom 60%", scrub: 0.6 },
            })
            .fromTo(".pb-marker", { top: "0%" }, { top: "100%", ease: "none", duration: 1 }, 0)
            .fromTo(".pb-cap-0", { opacity: 1 }, { opacity: 0, duration: 0.12, ease: "none" }, 0.5)
            .fromTo(".pb-cap-1", { opacity: 0 }, { opacity: 1, duration: 0.12, ease: "none" }, 0.56)
            .fromTo(".pb-tick", { opacity: 0.3 }, { opacity: 1, stagger: 0.07, duration: 0.05, ease: "none" }, 0);

          gsap.fromTo(
            ".pb-fio",
            { scaleX: 0 },
            {
              scaleX: 1,
              stagger: 0.12,
              duration: 1.1,
              ease: "expo.out",
              scrollTrigger: { trigger: ".pb-ledger", start: "top 88%", once: true },
            },
          );
        },
      );
    },
    { scope },
  );

  return (
    <section ref={scope} className="grid bg-cream text-forest lg:min-h-[100svh] lg:grid-cols-2">
      <div className="pb-photo-wrap relative h-[62svh] overflow-hidden lg:h-auto lg:min-h-[100svh]">
        <Image
          src="/img/aminosan-b/problem-corn.webp"
          alt={problem.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="pb-photo object-cover object-[55%_40%]"
        />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,transparent_55%,rgba(7,7,9,0.35)_100%)]" />

        {/* A régua: fio vertical, marcas, e o marcador com a legenda. */}
        <div aria-hidden className="absolute inset-y-[14%] right-[clamp(20px,3vw,48px)] w-px bg-offwhite/40">
          {Array.from({ length: TICKS }, (_, t) => (
            <span
              key={t}
              className={`pb-tick absolute right-0 h-px bg-offwhite ${t % 4 === 0 ? "w-3" : "w-1.5"}`}
              style={{ top: `${(t / (TICKS - 1)) * 100}%` }}
            />
          ))}
          {/* Ancorado pela direita: a legenda cresce para dentro da foto e o
              ponto fica centrado no fio. */}
          <div className="pb-marker absolute top-0 right-0 flex translate-x-[5px] -translate-y-1/2 items-center gap-2">
            <span className="grid justify-items-end">
              {problem.captions.map((caption, i) => (
                <span
                  key={caption}
                  className={`pb-cap-${i} col-start-1 row-start-1 rounded-full border border-offwhite/30 bg-night/40 px-3 py-1.5 font-display text-[10px] tracking-[0.18em] whitespace-nowrap text-offwhite uppercase backdrop-blur-md ${i === 1 ? "opacity-0" : ""}`}
                >
                  {caption}
                </span>
              ))}
            </span>
            <span className="size-2.5 shrink-0 rounded-full border border-offwhite bg-night/40" />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center px-[var(--spacing-gut)] py-[clamp(56px,7vw,110px)] lg:px-[clamp(40px,5vw,96px)]">
        <SplitLines className="max-w-[15ch] text-[clamp(34px,3.8vw,68px)] leading-[0.98] tracking-[-0.03em] text-balance">
          {problem.heading}
        </SplitLines>

        <Reveal stagger={0.1} className="mt-[clamp(24px,3vw,44px)] max-w-[52ch]">
          {problem.body.map((p) => (
            <p key={p} className={`${microCaps} mt-5 text-[12px] text-forest/75 first:mt-0`}>
              {p}
            </p>
          ))}
        </Reveal>

        <div className="pb-ledger mt-[clamp(32px,4vw,56px)] max-w-[52ch]">
          <p className={`${eyebrow} text-[10px] text-moss`}>{problem.ledger.label}</p>
          <ol className="mt-3">
            {problem.ledger.items.map((item, i) => (
              <li key={item} className="relative grid grid-cols-[2.5rem_1fr] items-baseline py-3">
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
