"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP, START } from "@/lib/gsap";
import { Rule, SectionIntro } from "@/components/ui";
import { crops } from "@/content/home";

const CARDS = crops.cards;
const CENTER = Math.floor(CARDS.length / 2);
const AUTOPLAY_INTERVAL = 3_000;

/**
 * Leque de culturas. A carta escolhida vai para o centro e as outras se
 * distribuem em volta na mesma ordem, em círculo.
 *
 * A geometria de cada posição está em globals.css (.crop-card[data-pos]);
 * aqui só decidimos qual carta ocupa qual posição.
 */
export function CropSelection() {
  const section = useRef<HTMLElement>(null);
  const fan = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(CENTER);
  const [hovered, setHovered] = useState<number | null>(null);
  const [carouselVisible, setCarouselVisible] = useState(false);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".crop-card__surface");
      const dots = gsap.utils.toArray<HTMLElement>(".crop-dots button");
      const intro = section.current!.querySelector<HTMLElement>(".crop-intro")!;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap.set([intro, ...cards, ...dots], { opacity: 1, y: 0, scale: 1 });
        return;
      }

      const entrance = gsap
        .timeline({ paused: true })
        .fromTo(
          intro,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          },
        )
        .fromTo(
          cards,
          { opacity: 0, y: 52, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.72,
            ease: "power3.out",
            stagger: { each: 0.08, from: "center" },
          },
          "-=0.28",
        )
        .fromTo(
          dots,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.05,
            ease: "power2.out",
          },
          "-=0.24",
        );

      ScrollTrigger.create({
        trigger: section.current,
        start: START,
        onEnter: () => entrance.play(),
        onLeaveBack: () => entrance.reverse(),
      });

      ScrollTrigger.create({
        trigger: fan.current,
        start: "bottom 48%",
        onEnter: () => entrance.reverse(),
        onLeaveBack: () => entrance.play(),
      });
    },
    { scope: section },
  );

  useEffect(() => {
    const element = fan.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setCarouselVisible(entry.isIntersecting),
      { threshold: 0.08 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (hovered !== null || !carouselVisible) return;

    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % CARDS.length);
    }, AUTOPLAY_INTERVAL);

    return () => window.clearInterval(interval);
  }, [carouselVisible, hovered]);

  const positionOf = (index: number) =>
    (((index - active + CENTER) % CARDS.length) + CARDS.length) % CARDS.length;

  return (
    /* As cartas das pontas saem da caixa de propósito — o corte tem de ficar
       aqui, senão a página ganha rolagem horizontal. */
    <section ref={section} id="crops" className="relative overflow-hidden bg-white pt-sec">
      <div className="wrap">
        <div className="crop-intro">
          <SectionIntro
            aside={<p className="text-muted">{crops.body}</p>}
          >
            <Rule className="mb-[clamp(18px,1.8vw,33px)]" />
            <h2 className="max-w-[480px] text-h2 leading-[0.967] text-ink">
              {crops.headline}
            </h2>
          </SectionIntro>
        </div>

        <div ref={fan} className="fan mt-[clamp(24px,1.9vw,36px)]">
          {CARDS.map((crop, i) => (
            <article
              key={crop.id}
              className="crop-card"
              data-pos={positionOf(i)}
              data-hovered={hovered === i ? "true" : undefined}
              tabIndex={0}
              aria-label={`Show ${crop.name}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              onClick={() => setActive(i)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActive(i);
                }
              }}
            >
              <div className="crop-card__surface">
                <div
                  className="crop-card__media"
                  style={{ backgroundImage: `url(${crop.image})` }}
                />
                <span className="crop-card__label absolute top-[5.3%] right-[6%] z-2 rounded-full bg-white px-[1.15em] py-[0.72em] text-[clamp(6px,0.62vw,12px)] leading-none font-semibold tracking-[0.15em] text-[#0E0E0D] uppercase">
                  {crop.name}
                </span>
                <div className="crop-card__content absolute bottom-[8%] left-[7%] z-2 right-[7%] text-offwhite">
                  <h3 className="text-[clamp(13px,1.68vw,32px)] font-semibold">
                    {crop.name}
                  </h3>
                  <p className="mt-[0.5em] text-[clamp(8px,0.95vw,18px)] leading-[1.5] font-light">
                    {crop.body}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* As cartas das pontas descem além da caixa do leque; a margem maior
            mantém a paginação livre delas. */}
        <div
          className="crop-dots mt-[clamp(28px,2.2vw,42px)] flex justify-center gap-[clamp(5px,0.65vw,13px)]"
          role="tablist"
          aria-label="Crops"
        >
          {CARDS.map((crop, i) => (
            <button
              key={crop.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show ${crop.name}`}
              onClick={() => setActive(i)}
              className="h-[clamp(5px,0.63vw,12px)] w-[clamp(28px,3.4vw,65px)] cursor-pointer rounded-full bg-[#D9D9D9] transition-colors aria-selected:bg-lime"
            />
          ))}
        </div>
      </div>

      {/* O Figma usa só a faixa central da foto; o resto é névoa. */}
      <div className="relative mt-[28px] aspect-[444/250] overflow-hidden bg-white min-[861px]:mt-0 min-[861px]:aspect-[1918/629]">
        <Image
          src="/img/crop-field.jpg"
          alt=""
          aria-hidden
          width={1536}
          height={1024}
          className="h-full w-full object-cover object-[center_62%] min-[861px]:object-[center_76%]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%] bg-linear-to-b from-transparent via-white/70 to-white"
        />
      </div>
    </section>
  );
}
