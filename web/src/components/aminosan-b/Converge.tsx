"use client";

import Image from "next/image";
import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { SplitLines } from "@/components/motion/SplitLines";
import { microCaps } from "./ui";

/* Cada etapa ocupa uma unidade da linha do tempo; cada conversão, meia. */
const BRAKE = 0.5;
const AMBER = "#C9731E";
/* As cores da bombona: o azul da faixa do rótulo e o verde do logotipo. */
const BLUE = "#134777";
const GREEN = "#1F7A44";

/**
 * "E se a lavoura pulasse a linha de montagem?" — uma linha só, do nitrato ao
 * aminoácido: o scroll percorre a rota etapa por etapa, com uma marca âmbar
 * em cada conversão. No fim o arco lima salta do primeiro ponto ao último de
 * uma vez e, só depois, a bombona chega. A cena trava até tudo aparecer, no desktop e
 * no celular (com a linha na horizontal). Conta etapas, não horas.
 */
export function Converge() {
  const { converge } = useContent().aminosanB;
  const { routes } = converge;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      const build = (tl: gsap.core.Timeline, axis: "scaleX") => {
        const nodes = gsap.utils.toArray<HTMLElement>(".cv-node");
        const segs = gsap.utils.toArray<HTMLElement>(".cv-seg");
        const brakes = gsap.utils.toArray<HTMLElement>(".cv-brake");
        const n = nodes.length;
        let t = 0;
        nodes.forEach((node, k) => {
          tl.fromTo(node, { backgroundColor: "#DDE4EC", scale: 1 }, { backgroundColor: BLUE, scale: 1.4, duration: 0.16, ease: "back.out(3)" }, t)
            .to(node, { scale: 1, duration: 0.3, ease: "power2.out" }, t + 0.16)
            .fromTo(node.nextElementSibling, { opacity: 0.35 }, { opacity: 1, duration: 0.3, ease: "sine.out" }, t);
          if (k === n - 1) return;
          tl.fromTo(brakes[k], { opacity: 0.25, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.22, ease: "back.out(2)" }, t + 0.3);
          t += BRAKE;
          tl.fromTo(segs[k], { [axis]: 0 }, { [axis]: 1, duration: 0.8, ease: "none" }, t);
          t += 1;
        });

        /* Primeiro o arco atravessa a rota inteira de uma vez, do primeiro
           ponto ao último; só depois a bombona chega e a mensagem aparece. */
        t += 0.4;
        tl.fromTo(".cv-jump-x", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: "power2.inOut" }, t)
          .to(nodes[0], { backgroundColor: GREEN, borderColor: GREEN, duration: 0.15 }, t)
          .to(nodes[n - 1], { backgroundColor: GREEN, borderColor: GREEN, scale: 1.6, duration: 0.18, ease: "back.out(3)" }, t + 0.6)
          .to(nodes[n - 1], { scale: 1, duration: 0.3 }, t + 0.78)
          .fromTo(".cv-jug", { opacity: 0, y: -24, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.6)" }, t + 0.85)
          .fromTo(".cv-with", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 }, t + 1.1);
        return tl;
      };

      mm.add(
        {
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { still } = ctx.conditions as { still: boolean };
          const axis = "scaleX";
          if (still) {
            build(gsap.timeline({ paused: true }), axis).progress(1);
            return;
          }
          build(
            gsap.timeline({
              defaults: { ease: "power2.out" },
              scrollTrigger: { trigger: ".cv-stage", start: "top top", end: "+=160%", scrub: 0.6, pin: true, anticipatePin: 1 },
            }),
            axis,
          );

          gsap.from(".cv-card", {
            y: 60,
            opacity: 0,
            stagger: 0.12,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: ".cv-cards", start: "top 88%", once: true },
          });
          gsap.from(".cv-line", {
            scaleX: 0,
            stagger: 0.12,
            duration: 1.1,
            delay: 0.35,
            ease: "expo.out",
            scrollTrigger: { trigger: ".cv-cards", start: "top 88%", once: true },
          });
        },
      );
    },
    { scope },
  );

  const n = routes.steps.length;

  const withLabel = (
    <>
      <p className={`${microCaps} text-[11px] text-[#1F7A44]`}>{routes.with.label}</p>
      <p className="mt-1 font-display text-[clamp(16px,1.35vw,21px)] leading-[1.15] tracking-[-0.01em]">
        {routes.with.note}
      </p>
    </>
  );

  const jug = (className: string) => (
    <div className={`cv-jug relative aspect-[1004/392] ${className}`}>
      <Image
        src="/img/aminosan-b/aminosan-logo.webp"
        alt="Aminosan®"
        fill
        sizes="320px"
        className="object-contain"
      />
    </div>
  );

  const brake = (
    <>
      <span className="block h-[2px] w-3.5" style={{ backgroundColor: AMBER }} />
      <span className="block h-[2px] w-3.5" style={{ backgroundColor: AMBER }} />
    </>
  );

  return (
    <section ref={scope} className="relative overflow-clip bg-cream text-forest">
      {/* Tudo mora no palco que trava: cabeçalho, linha, fecho e cartões,
          com o espaço medido pela altura da tela para caber numa vista só. */}
      <div className="cv-stage flex flex-col justify-center gap-[clamp(10px,2svh,20px)] min-h-svh py-[clamp(16px,3svh,32px)] lg:gap-[clamp(28px,6svh,64px)] lg:py-[clamp(20px,4svh,48px)]">
      <div className="wrap grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-end lg:gap-16">
        <SplitLines className="max-w-[24ch] text-[clamp(30px,min(3.6vw,6.5svh),60px)] leading-[0.97] tracking-[-0.035em] text-balance">
          {converge.heading}
        </SplitLines>
        <p className={`${microCaps} text-[12px] text-forest/75`}>{converge.aside.body}</p>
      </div>

      <div>
        <div className="cv-route mx-auto w-[min(920px,calc(100%-2*var(--spacing-gut)))]">
          <div className="relative mt-14 lg:mt-[clamp(250px,33svh,310px)]">
            {/* O salto do Aminosan®: do centro do primeiro nó ao do último.
                No desktop o arco passa por cima da linha, com a bombona e a
                mensagem no topo; no celular, só o arco. */}
            <div className="absolute bottom-[calc(100%-6px)] left-[6px] h-12 w-full lg:h-[100px]">
              <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="cv-jump-x absolute inset-0 size-full overflow-visible">
                <path
                  d="M0 100 C0 0 100 0 100 100"
                  fill="none"
                  stroke={GREEN}
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div className="absolute bottom-[calc(100%-24px)] left-1/2 hidden lg:flex -translate-x-1/2 flex-col items-center text-center">
                {jug("w-[320px]")}
                <div className="cv-with mt-3">{withLabel}</div>
              </div>
            </div>

            {/* No celular cada etapa tem altura fixa (h-9), para o arco saber
                onde fica o último nó: 4 × 36px = h-36. */}
            <ol className="grid grid-cols-[repeat(4,minmax(0,1fr))_0px]">
              {routes.steps.map((step, k) => (
                <li key={step} className="relative pt-6 pr-1 lg:pt-8 lg:pr-4">
                  {k < n - 1 && (
                    <span className="absolute top-[5px] left-[6px] h-[2px] w-full bg-forest/10">
                      <span className="cv-seg absolute inset-0 origin-left bg-amino" />
                      <span
                        aria-hidden
                        className="cv-brake absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 rotate-90 flex-col gap-[3px]"
                      >
                        {brake}
                      </span>
                    </span>
                  )}
                  <span
                    className="cv-node absolute top-0 left-0 size-3 rounded-full border-2"
                    style={{ borderColor: BLUE, backgroundColor: BLUE }}
                  />
                  <p
                    className={`font-display text-[clamp(9px,1.35vw,21px)] leading-[1.15] tracking-[-0.01em] ${k === n - 1 ? "absolute top-6 right-[-14px] text-right whitespace-nowrap lg:top-8 lg:right-[-12px]" : ""}`}
                  >
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-3 flex items-center gap-4 lg:hidden">
            {jug("w-[170px] shrink-0")}
            <div className="cv-with">{withLabel}</div>
          </div>

          <p className={`${microCaps} mt-3 text-[10px] lg:mt-[clamp(12px,2.5svh,28px)] text-forest/65 lg:text-[11px]`}>
            {routes.label}
          </p>

          <p className={`${microCaps} mt-2 flex items-center gap-3 text-[10px] text-forest/65 lg:text-[11px]`}>
            <span aria-hidden className="flex flex-col gap-[3px]">
              {brake}
            </span>
            {routes.conversion}
          </p>
        </div>
      </div>

      <div className="wrap">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <SplitLines
            as="p"
            stagger={0.12}
            className="font-display text-[clamp(26px,min(2.8vw,5svh),48px)] leading-[1.02] tracking-[-0.03em] text-balance"
          >
            {converge.aside.heading.join(" ")}
          </SplitLines>
        </div>

        <div className="cv-cards mt-3 grid lg:mt-[clamp(14px,3svh,32px)] grid-cols-2 gap-2 md:grid-cols-3 md:gap-4">
          {converge.cards.map((card, i) => (
            <article
              key={card.title}
              className={`cv-card relative flex flex-col ${i === 0 ? "col-span-2 md:col-span-1" : ""} overflow-hidden rounded-[clamp(12px,1.05vw,20px)] bg-linear-[122.93deg,var(--color-night-warm)_2.4%,var(--color-night-deep)_60.23%] p-3 text-offwhite md:p-[clamp(16px,1.5vw,24px)]`}
            >
              <div className="max-w-full w-fit">
                <span aria-hidden className="cv-line block h-[2px] w-full origin-left rounded-full bg-lime" />
                <h3 className="mt-3 text-[clamp(20px,1.6vw,26px)] leading-[1.1] tracking-[-0.02em]">{card.title}</h3>
              </div>
              <p className={`${microCaps} mt-3 text-offwhite/70`}>{card.body}</p>
            </article>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
