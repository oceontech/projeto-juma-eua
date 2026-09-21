"use client";

import Image from "next/image";
import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { SplitLines } from "@/components/motion/SplitLines";
import { microCaps } from "./ui";

/**
 * Onde entra na safra: fichas verdes em escada, com o recorte (soja, milho,
 * a bombona) saindo pelo topo de cada uma — o desenho dos cards de produto
 * da referência. Tudo preso ao scroll, nos dois sentidos: as fichas sobem
 * de baixo enquanto a seção entra e continuam subindo, mais depressa as da
 * direita, enquanto ela sai; os recortes andam num compasso próprio, então
 * a figura escorrega sobre a ficha em vez de estar colada nela.
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

          /* Saída: continuam subindo e esmaecem ao cruzar o topo. */
          gsap.to(card, {
            y: -(120 + i * 70),
            opacity: 0,
            ease: "power1.in",
            scrollTrigger: { ...trigger, start: "top 12%", end: "bottom top" },
          });
          gsap.to(cut, {
            y: -60,
            ease: "none",
            scrollTrigger: { ...trigger, start: "top 12%", end: "bottom top" },
          });
        });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="overflow-hidden bg-cream pt-[clamp(72px,8vw,124px)] pb-[clamp(96px,12vw,200px)] text-forest">
      <div className="wrap grid gap-6 lg:grid-cols-[1fr_380px] lg:items-end">
        <SplitLines className="text-[clamp(34px,3.8vw,68px)] leading-[0.98] tracking-[-0.03em] text-olive">
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
            className="ss-card group relative flex flex-col bg-moss px-5 pt-[clamp(150px,13vw,210px)] pb-6 text-cream"
            style={{ marginTop: `calc(${i} * clamp(0px, 7vw, 110px))` }}
          >
            <div className="ss-cut pointer-events-none absolute -top-[clamp(120px,10vw,170px)] left-4 h-[clamp(260px,22vw,360px)] w-[70%]">
              <Image
                src={card.image}
                alt={card.alt}
                fill
                sizes="(min-width: 768px) 24vw, 70vw"
                className="object-contain object-bottom-left drop-shadow-[0_24px_30px_rgba(22,38,27,0.35)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2"
              />
            </div>
            <span className="absolute top-4 right-4 grid size-8 place-items-center bg-cream/15 text-cream" aria-hidden>
              ↗
            </span>
            <p className={`${microCaps} text-lime`}>{card.tag}</p>
            <h3 className="mt-2 text-[clamp(24px,2vw,34px)] leading-[1.05] tracking-[-0.02em]">{card.title}</h3>
            <p className={`${microCaps} mt-3 text-cream/80`}>{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
