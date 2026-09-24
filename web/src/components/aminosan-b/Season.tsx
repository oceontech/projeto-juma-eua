"use client";

import Image from "next/image";
import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { SplitLines } from "@/components/motion/SplitLines";
import { microCaps } from "./ui";

/**
 * As culturas do produtor (specialty crops): fichas verdes em escada, com o recorte da cultura (morango,
 * tomate, citros: a planta inteira, com raiz) saindo pelo topo de cada uma — o desenho dos cards de produto
 * da referência. A entrada é presa ao scroll, nos dois sentidos: as fichas
 * sobem de baixo enquanto a seção entra (e voltam a descer se o scroll
 * voltar); os recortes andam num compasso próprio, então a figura escorrega
 * sobre a ficha em vez de estar colada nela. Não há animação de saída: ao
 * rolar para baixo, os cards ficam onde estão.
 */
export function Season() {
  const { season } = useContent().aminosanB;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".ss-card");

        cards.forEach((card, i) => {
          const cut = card.querySelector(".ss-cut");
          const trigger = { trigger: card, scrub: 0.6 };

          /* Entrada: de baixo, e mais de baixo quanto mais à direita. */
          gsap.fromTo(
            card,
            { y: 220 + i * 90, opacity: 0 },
            { y: 0, opacity: 1, ease: "power2.out", scrollTrigger: { ...trigger, start: "top bottom", end: "top 55%" } },
          );
          gsap.fromTo(
            cut,
            { y: 120, scale: 0.9 },
            { y: 0, scale: 1, ease: "power2.out", scrollTrigger: { ...trigger, start: "top bottom", end: "top 50%" } },
          );
        });
      });
    },
    { scope },
  );

  return (
    <section id="season" ref={scope} className="overflow-hidden bg-cream pt-[clamp(72px,8vw,124px)] pb-[clamp(96px,12vw,200px)] text-forest">
      <div className="wrap grid gap-6 lg:grid-cols-[1fr_380px] lg:items-end">
        <SplitLines className="text-[clamp(34px,3.8vw,68px)] leading-[0.98] tracking-[-0.03em] text-forest">
          {season.heading.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </SplitLines>
        <p className={`${microCaps} text-forest/65`}>{season.intro}</p>
      </div>

      <div className="wrap mt-[clamp(120px,14vw,200px)] grid gap-[clamp(120px,16vw,150px)] md:grid-cols-3 md:items-start md:gap-5">
        {season.cards.map((card, i) => (
          <article
            key={card.tag}
            className="ss-card group relative flex flex-col rounded-[clamp(12px,1.05vw,20px)] bg-linear-[122.93deg,var(--color-night-warm)_2.4%,var(--color-night-deep)_60.23%] px-5 pt-[clamp(150px,13vw,210px)] pb-6 text-cream"
            style={{ marginTop: `calc(${i} * clamp(0px, 7vw, 110px))` }}
          >
            {/* Vinheta verde no canto, recortada pelo arredondamento do card
                (o card em si não corta, porque a imagem vaza pelo topo). */}
            <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
              <span className="absolute -top-[14%] -left-[6%] h-[55%] w-[60%] bg-[radial-gradient(closest-side,rgba(183,199,62,0.16),transparent)]" />
            </span>
            <div className="ss-cut pointer-events-none absolute -top-[clamp(120px,10vw,170px)] left-4 h-[clamp(260px,22vw,360px)] w-[70%]">
              <Image
                src={card.image}
                alt={card.alt}
                fill
                sizes="(min-width: 768px) 24vw, 70vw"
                className="object-contain object-bottom-left drop-shadow-[0_24px_30px_rgba(22,38,27,0.35)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2"
              />
            </div>
            <p className={`${microCaps} text-lime`}>{card.tag}</p>
            <h3 className="mt-2 text-[clamp(24px,2vw,34px)] leading-[1.05] tracking-[-0.02em]">{card.title}</h3>
            <p className={`${microCaps} mt-3 text-cream/80`}>{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
