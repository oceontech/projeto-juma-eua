"use client";

import Image from "next/image";
import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { Counter } from "@/components/motion/Counter";
import { booted } from "@/lib/boot";
import { gsap, useGSAP } from "@/lib/gsap";
import { Cta, Pill, eyebrow, microCaps } from "./ui";

/**
 * K1 + K2. O pulverizador ao amanhecer, em tela cheia e escurecido, com a
 * headline centralizada respirando — o hero das referências. A faixa de
 * prova (K2) fica ancorada no pé: meia altura sobre a foto, meia sobre o
 * creme da seção seguinte, como os cartões de números das referências.
 *
 * A entrada é a do hero da LP B, sem nada preso ao scroll: quando o
 * preloader sai, o fundo assenta de um zoom devagar, a faixa sobe de baixo
 * como camada da frente (é ela que dá a profundidade que as folhas davam lá)
 * e os textos entram em escada.
 */
export function Hero() {
  const { hero, proofBand } = useContent().kmep;
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set("[data-kh='bg']", { scale: 1.18, transformOrigin: "50% 55%" });
        gsap.set("[data-kh='band']", { yPercent: 38, opacity: 0 });
        gsap.set("[data-kh='fade']", { opacity: 0, y: 24 });

        let alive = true;
        let intro: gsap.core.Timeline | undefined;
        void booted.then(() => {
          if (!alive) return;
          intro = gsap
            .timeline({ defaults: { ease: "power3.out" } })
            /* O fundo mais devagar que a frente: se os dois assentam juntos,
               a profundidade some. */
            .to("[data-kh='bg']", { scale: 1, duration: 2.6, ease: "power2.out" }, 0)
            .to("[data-kh='band']", { yPercent: 0, opacity: 1, duration: 2 }, 0.15)
            .to("[data-kh='fade']", { opacity: 1, y: 0, duration: 1.1, stagger: 0.1 }, 0.5);
        });

        return () => {
          alive = false;
          intro?.kill();
        };
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className="relative bg-cream pb-[clamp(56px,7vw,112px)]">
      <section
        data-nav-theme="dark"
        className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-night text-offwhite lg:min-h-[max(100svh,680px)]"
      >
        <div data-kh="bg" className="absolute inset-0 -z-20">
          <Image
            src="/img/aminosan-b/season-sprayer.webp"
            alt={hero.alt}
            fill
            quality={90}
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-[64%_46%]"
          />
        </div>

        {/* Leitura: escuro no topo (a barra do header), um véu no meio para a
            headline e o pé fechando no preto, onde a faixa encosta. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,7,9,0.78)_0%,rgba(7,7,9,0.42)_30%,rgba(7,7,9,0.5)_62%,rgba(7,7,9,0.94)_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_62%_46%_at_50%_46%,rgba(7,7,9,0.4),transparent_72%)]"
        />

        <div className="wrap flex flex-1 flex-col items-center justify-center pt-[clamp(104px,15svh,150px)] pb-[clamp(132px,17svh,200px)] text-center">
          <div data-kh="fade">
            <Pill items={hero.eyebrow} />
          </div>
          <h1
            data-kh="fade"
            className="mt-[clamp(20px,2.4vw,32px)] max-w-[15ch] text-[clamp(40px,5.6vw,108px)] leading-[0.95] tracking-[-0.035em] text-balance"
          >
            {hero.heading}
          </h1>
          <p
            data-kh="fade"
            className="mt-[clamp(18px,2vw,28px)] max-w-[58ch] text-[clamp(15px,1.1vw,18px)] leading-[1.55] text-pretty text-offwhite/85"
          >
            {hero.body}
          </p>
          <div
            data-kh="fade"
            className="mt-[clamp(24px,2.6vw,36px)] flex w-full max-w-[380px] flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center"
          >
            <Cta href={hero.cta.href} solid>
              {hero.cta.label}
            </Cta>
            <Cta href={hero.secondary.href}>{hero.secondary.label}</Cta>
          </div>
        </div>
      </section>

      {/* K2 — a faixa de prova. Três números com o mesmo peso, o tratado
          marcado pelo fio lima, a fonte embaixo. */}
      <div className="wrap relative z-10 -mt-[clamp(84px,9vw,124px)]">
        <div
          data-kh="band"
          className="rounded-[clamp(18px,1.6vw,28px)] bg-white px-[clamp(14px,2.4vw,40px)] pt-[clamp(14px,1.6vw,24px)] pb-[clamp(14px,1.4vw,22px)] text-forest shadow-[0_30px_70px_-34px_rgba(7,7,9,0.55)]"
        >
          <dl className="grid grid-cols-3">
            {proofBand.stats.map((stat, i) => (
              <div
                key={stat.label}
                className="relative flex flex-col border-forest/12 py-[clamp(10px,1.4vw,22px)] pr-2 not-first:border-l not-first:pl-[clamp(10px,2vw,36px)]"
              >
                {i === 0 && (
                  <span aria-hidden className="absolute top-0 left-0 h-[2px] w-[clamp(28px,4vw,56px)] rounded-full bg-lime" />
                )}
                {/* Duas linhas reservadas no celular: "Untreated check" quebra, e os
                    três números precisam ficar na mesma altura. */}
                <dt className={`${microCaps} min-h-[30px] text-[10px] text-moss sm:min-h-0 lg:text-[11px]`}>{stat.label}</dt>
                <dd className="mt-2 flex flex-col font-display sm:flex-row sm:items-baseline sm:gap-2">
                  <span className="text-[clamp(26px,4.2vw,76px)] leading-[0.9] tracking-[-0.045em] whitespace-nowrap">
                    {stat.prefix}
                    <Counter to={stat.value} decimals={stat.decimals} start="top bottom" delay={1.2} />
                  </span>
                  <span className="mt-1 text-[clamp(11px,1vw,16px)] tracking-[0.02em] text-forest/55 sm:mt-0">
                    {stat.unit}
                    {stat.note && <span className="text-forest/80"> · {stat.note}</span>}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-[clamp(8px,1vw,14px)] flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-forest/10 pt-[clamp(10px,1vw,14px)]">
            <p className={`${eyebrow} text-[10px] text-moss`}>{proofBand.label}</p>
            <p className={`${microCaps} text-[10px] text-forest/60`}>{proofBand.source}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
