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
 * uma vez e, só depois, a bombona chega. No desktop a cena trava até tudo aparecer; no
 * celular segue o scroll normal. Conta etapas, não horas.
 */
export function Converge() {
  const { converge } = useContent().aminosanB;
  const { routes } = converge;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      const build = (tl: gsap.core.Timeline, axis: "scaleX" | "scaleY") => {
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
          .fromTo(".cv-jump-y", { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.6, ease: "power2.inOut" }, t)
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
          const { desktop, still } = ctx.conditions as { desktop: boolean; still: boolean };
          const axis = desktop ? "scaleX" : "scaleY";
          if (still) {
            build(gsap.timeline({ paused: true }), axis).progress(1);
            return;
          }
          build(
            gsap.timeline({
              defaults: { ease: "power2.out" },
              scrollTrigger: desktop
                ? { trigger: ".cv-stage", start: "top top", end: "+=160%", scrub: 0.6, pin: true, anticipatePin: 1 }
                : { trigger: ".cv-route", start: "top 75%", end: "bottom 40%", scrub: 0.6 },
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
    <div className={`cv-jug relative aspect-[376/235] ${className}`}>
      <Image
        src="/img/pack-aminosan-us.webp"
        alt={routes.with.jugAlt}
        fill
        sizes="200px"
        className="origin-bottom scale-[1.45] object-contain drop-shadow-[0_18px_24px_rgba(22,38,27,0.18)]"
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
      <div className="cv-stage flex flex-col justify-center gap-[clamp(20px,4svh,40px)] py-[clamp(48px,6vw,96px)] lg:min-h-[100svh] lg:gap-[clamp(14px,3svh,32px)] lg:py-[clamp(20px,4svh,48px)]">
      <div className="wrap grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-end lg:gap-16">
        <SplitLines className="max-w-[24ch] text-[clamp(30px,min(3.6vw,6.5svh),60px)] leading-[0.97] tracking-[-0.035em] text-balance">
          {converge.heading}
        </SplitLines>
        <p className={`${microCaps} text-[12px] text-forest/75`}>{converge.aside.body}</p>
      </div>

      <div>
        <div className="cv-route mx-auto w-[min(920px,calc(100%-2*var(--spacing-gut)))]">
          <div className="relative ml-10 lg:mt-[clamp(170px,23svh,210px)] lg:ml-0">
            {/* O salto do Aminosan®: do centro do primeiro nó ao do último.
                No desktop o arco passa por cima da linha, com a bombona e a
                mensagem no topo; no celular, pela esquerda da linha vertical. */}
            <div className="absolute bottom-[calc(100%-6px)] left-[6px] hidden h-[100px] w-full lg:block">
              <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="cv-jump-x absolute inset-0 size-full overflow-visible">
                <path
                  d="M0 100 C0 0 100 0 100 100"
                  fill="none"
                  stroke={GREEN}
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div className="absolute bottom-[calc(100%-24px)] left-1/2 flex -translate-x-1/2 flex-col items-center text-center">
                {jug("w-[160px]")}
                <div className="cv-with mt-2">{withLabel}</div>
              </div>
            </div>
            <div aria-hidden className="absolute top-2 left-[-30px] h-56 w-9 lg:hidden">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="cv-jump-y absolute inset-0 size-full overflow-visible">
                <path
                  d="M100 0 C0 0 0 100 100 100"
                  fill="none"
                  stroke={GREEN}
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            {/* No celular cada etapa tem altura fixa (h-14), para o arco saber
                onde fica o último nó: 4 × 56px = h-56. */}
            <ol className="flex flex-col lg:grid lg:grid-cols-[repeat(4,minmax(0,1fr))_0px]">
              {routes.steps.map((step, k) => (
                <li key={step} className="relative h-14 pl-7 lg:h-auto lg:pt-8 lg:pr-4 lg:pl-0">
                  {k < n - 1 && (
                    <span className="absolute top-[12px] left-[5px] h-[calc(100%-2px)] w-[2px] bg-forest/10 lg:top-[5px] lg:left-[6px] lg:h-[2px] lg:w-full">
                      <span className="cv-seg absolute inset-0 origin-top bg-amino lg:origin-left" />
                      <span
                        aria-hidden
                        className="cv-brake absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-[3px] lg:rotate-90"
                      >
                        {brake}
                      </span>
                    </span>
                  )}
                  <span
                    className="cv-node absolute top-[2px] left-0 size-3 rounded-full border-2 lg:top-0"
                    style={{ borderColor: BLUE, backgroundColor: BLUE }}
                  />
                  <p
                    className={`font-display text-[clamp(16px,1.35vw,21px)] leading-[1.15] tracking-[-0.01em] ${k === n - 1 ? "lg:absolute lg:top-8 lg:right-[-12px] lg:text-right lg:whitespace-nowrap" : ""}`}
                  >
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-6 flex items-center gap-4 lg:hidden">
            {jug("w-[160px] shrink-0")}
            <div className="cv-with">{withLabel}</div>
          </div>

          <p className={`${microCaps} mt-8 flex items-center gap-3 text-[10px] lg:mt-[clamp(12px,2.5svh,28px)] text-forest/65 lg:text-[11px]`}>
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

        <div className="cv-cards mt-[clamp(32px,5vw,56px)] grid lg:mt-[clamp(14px,3svh,32px)] grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {converge.cards.map((card, i) => (
            <article
              key={card.title}
              className={`cv-card relative flex flex-col ${i === 0 ? "col-span-2 md:col-span-1" : ""} overflow-hidden rounded-[clamp(12px,1.05vw,20px)] bg-linear-[122.93deg,var(--color-night-warm)_2.4%,var(--color-night-deep)_60.23%] p-4 text-offwhite md:p-[clamp(16px,1.5vw,24px)]`}
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
