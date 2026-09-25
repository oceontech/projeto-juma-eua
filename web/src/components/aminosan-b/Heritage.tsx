"use client";

import Image from "next/image";
import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { SplitLines } from "@/components/motion/SplitLines";
import { gsap, useGSAP } from "@/lib/gsap";
import { eyebrow, microCaps } from "./ui";

/* Os 17 quadros do GIF de 1988, empilhados na vertical (o mesmo sprite da
   Home — ver components/home/HistoryBottle.tsx para como foi gerado). */
const SPRITE = "/img/aminosan-bottle-1988-frames.webp";
const FRAMES = 17;
const FROM = 1988;
/* Onde cada marco acende, no progresso da cena, amarrado ao ano do contador:
   os anos 80 e 1988 já estão acesos quando ele começa; "hoje" acende perto
   do ano corrente, e "agora", no fim. */
const LIGHT = [0, 0, 0.82, 0.97];

/**
 * A8 — "Mais antigo que a empresa que o fabrica". O frasco de 1988,
 * enferrujado, vira o frasco de hoje quadro a quadro, preso ao scroll; o ano
 * conta junto, de 1988 até o ano corrente, e a linha do tempo acende item
 * por item no mesmo compasso.
 *
 * O sprite tem fundo branco chapado (#fefefe); o `mix-blend-multiply` o
 * dissolve no creme da seção, sem recorte.
 *
 * Desktop: a cena trava. Celular: sem trava — o frasco anda enquanto passa
 * pela tela, e a linha do tempo acende com o próprio scroll.
 */
export function Heritage() {
  const { heritage } = useContent().aminosanB;
  const scope = useRef<HTMLElement>(null);
  const n = heritage.timeline.length;

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const bottle = root.querySelector<HTMLElement>(".hr-bottle");
      const year = root.querySelector<HTMLElement>(".hr-year");
      const items = gsap.utils.toArray<HTMLElement>(".hr-item", root);
      const fill = root.querySelector<HTMLElement>(".hr-fill");
      /* O ano do navegador basta aqui: a virada no fuso de Brasília só
         importa na Home, que mostra o ano sozinho. */
      const now = new Date().getFullYear();

      const paint = (p: number) => {
        const frame = Math.round(p * (FRAMES - 1));
        if (bottle) bottle.style.backgroundPosition = `0 ${(frame / (FRAMES - 1)) * 100}%`;
        if (year) year.textContent = String(Math.round(FROM + p * (now - FROM)));
        if (fill) fill.style.transform = `scaleY(${p})`;
        items.forEach((item, i) => item.classList.toggle("is-on", p >= (LIGHT[i] ?? i / n) - 0.001));
      };

      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          phone: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
          tablet: "(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop, phone, still } = ctx.conditions as { desktop: boolean; phone: boolean; still: boolean };
          if (still) {
            paint(1);
            return;
          }
          const state = { p: 0 };
          paint(0);
          gsap.fromTo(
            state,
            { p: 0 },
            {
              p: 1,
              ease: "none",
              onUpdate: () => paint(state.p),
              scrollTrigger: desktop || phone
                ? { trigger: ".hr-stage", start: "top top", end: phone ? "+=200%" : "+=170%", scrub: 0.6, pin: true, anticipatePin: 1 }
                : { trigger: ".hr-scene", start: "top 80%", end: "bottom 45%", scrub: 0.5 },
            },
          );
          gsap.fromTo(
            ".hr-founder",
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".hr-founder", start: "top 92%", once: true } },
          );
        },
      );
    },
    { scope },
  );

  return (
    <section ref={scope} className="relative overflow-clip bg-white text-forest">
      {/* O creme mora no palco, e não só na seção: o pin cria um contexto de
          empilhamento próprio, e o multiply do frasco só enxerga o fundo que
          estiver dentro dele. */}
      <div className="hr-stage flex min-h-[100svh] flex-col justify-center bg-white py-[clamp(72px,10svh,120px)] max-md:justify-start max-md:pt-[84px] max-md:pb-6">
        <div className="wrap grid gap-10 max-md:grid-cols-[minmax(0,1fr)_auto] max-md:items-start max-md:gap-x-4 max-md:gap-y-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.85fr)] lg:items-center lg:gap-[clamp(24px,3vw,56px)]">
          <div>
            <p className={`${eyebrow} text-moss`}>{heritage.label}</p>
            <SplitLines className="mt-3 text-[clamp(28px,3.6vw,68px)] leading-[0.95] tracking-[-0.04em] text-balance">
              {heritage.heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </SplitLines>
            <p className="mt-6 max-w-[46ch] max-md:hidden text-[15px] leading-[1.6] text-forest/75">{heritage.body}</p>
            <div className="hr-founder mt-7 flex max-md:hidden items-center gap-4">
              <Image
                src="/img/julio-matino.jpg"
                alt={heritage.founder.alt}
                width={56}
                height={56}
                className="size-14 rounded-full object-cover ring-2 ring-lime ring-offset-2 ring-offset-cream"
              />
              <div>
                <p className="font-display text-[17px] leading-tight tracking-[-0.01em]">{heritage.founder.name}</p>
                <p className={`${microCaps} mt-1 text-[10px] text-forest/55`}>{heritage.founder.role}</p>
              </div>
            </div>
          </div>

          {/* O frasco e o ano. */}
          <div className="hr-scene relative mx-auto w-full max-w-[420px] max-md:mx-0 max-md:mb-7 max-md:w-auto">
            <div
              role="img"
              aria-label={heritage.bottleAlt}
              className="hr-bottle relative mx-auto aspect-[582/800] w-[min(30vw,130px)] bg-no-repeat md:w-[min(72vw,340px)] mix-blend-multiply lg:w-[min(24vw,360px)]"
              style={{ backgroundImage: `url(${SPRITE})`, backgroundSize: `100% ${FRAMES * 100}%`, backgroundPosition: "0 0%" }}
            />
            <p className="absolute -bottom-7 left-1/2 flex -translate-x-1/2 items-baseline gap-3 lg:-bottom-10">
              <span className={`${microCaps} text-[10px] text-moss`}>{heritage.yearLabel}</span>
              <span className="hr-year font-display text-[clamp(30px,4.4vw,80px)] leading-none tracking-[-0.05em] tabular-nums">{FROM}</span>
            </p>
          </div>

          {/* A linha do tempo: o fio se enche com o scroll e cada marco acende. */}
          <ol className="relative grid gap-[clamp(18px,3svh,32px)] pl-8 max-md:col-span-2 max-md:gap-3.5">
            <span aria-hidden className="absolute top-2 bottom-2 left-[5px] w-[2px] bg-forest/12">
              <span className="hr-fill absolute inset-0 origin-top scale-y-0 bg-lime" />
            </span>
            {heritage.timeline.map((item) => (
              <li
                key={item.year}
                className="hr-item group relative opacity-35 transition-opacity duration-500 [&.is-on]:opacity-100"
              >
                <span
                  aria-hidden
                  className="absolute top-[0.55em] -left-8 size-3 rounded-full border-2 border-forest/30 bg-white transition-colors duration-500 group-[.is-on]:border-forest group-[.is-on]:bg-lime"
                />
                <p className="font-display text-[clamp(20px,1.9vw,32px)] leading-none tracking-[-0.03em]">{item.year}</p>
                <p className={`${microCaps} mt-1.5 text-[10px] text-moss`}>{item.title}</p>
                <p className="mt-1 max-w-[36ch] text-[12px] leading-[1.4] md:mt-1.5 md:text-[14px] md:leading-[1.5] text-forest/75">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="wrap mt-[clamp(40px,7svh,88px)] max-md:hidden">
          <p className="border-t border-forest/15 pt-5 font-display text-[clamp(20px,2vw,34px)] leading-[1.1] tracking-[-0.025em] text-forest/80">
            {heritage.tagline}
          </p>
        </div>
      </div>
    </section>
  );
}
