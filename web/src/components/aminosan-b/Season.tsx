"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { SplitLines } from "@/components/motion/SplitLines";
import { microText } from "./ui";

const CROP_IMAGES: Record<string, string> = {
  citrus: "/img/crop-corridor/citrus.webp",
  fruit: "/img/crop-corridor/blueberry.webp",
  veg: "/img/crop-corridor/broccoli.webp",
  tomato: "/img/crop-corridor/tomato-pepper.webp",
  ornamental: "/img/crop-corridor/ornamentals.webp",
  potato: "/img/crop-corridor/potato.webp",
  onion: "/img/crop-corridor/onion-garlic.webp",
  roots: "/img/crop-corridor/carrot-beet.webp",
  corn: "/img/crop-corridor/corn.webp",
  soy: "/img/crop-corridor/soybean.webp",
  cotton: "/img/crop-corridor/cotton.webp",
  beans: "/img/crop-corridor/beans.webp",
};

export function Season() {
  const content = useContent();
  const { season } = content.aminosanB;
  const crops = content.kmep.timing.crops;

  return (
    <section id="season" className="overflow-hidden bg-white pt-[clamp(72px,8vw,124px)] pb-[clamp(56px,8vw,120px)] text-forest">
      <div className="wrap grid gap-6 lg:grid-cols-[1fr_380px] lg:items-end">
        <SplitLines className="text-[clamp(34px,3.8vw,68px)] leading-[0.98] tracking-[-0.03em] text-forest">
          {season.heading.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </SplitLines>
        <p className={`${microText} text-forest/65`}>{season.intro}</p>
      </div>

      <div
        className="season-carousel relative mx-auto mt-[clamp(24px,4vw,56px)] grid h-[clamp(500px,46vw,620px)] w-full max-w-[1400px] place-items-center overflow-hidden"
        style={{
          perspective: "120em",
          maskImage: "linear-gradient(90deg, transparent, #000 16% 84%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 16% 84%, transparent)",
        }}
      >
        <div className="season-carousel-center absolute inset-0 grid place-items-center [transform-style:preserve-3d]">
          <div
            className="season-carousel-track relative grid aspect-[7/10] w-[var(--card-width)] place-items-center [transform-style:preserve-3d]"
            style={{
              "--count": crops.length,
              "--step": "calc(1turn / var(--count))",
              "--card-width": "clamp(190px, 24vw, 300px)",
              "--radius": "calc((0.5 * var(--card-width) + 0.5em) / tan(0.5 * var(--step)))",
              animation: "season-carousel-spin 32s linear infinite",
            } as CSSProperties}
          >
            <style>{`
              @keyframes season-carousel-spin {
                to { transform: rotateY(1turn); }
              }

              @media (prefers-reduced-motion: reduce) {
                .season-carousel {
                  display: block !important;
                  overflow-x: auto !important;
                  perspective: none !important;
                  scroll-snap-type: x mandatory;
                  mask-image: none !important;
                  -webkit-mask-image: none !important;
                }
                .season-carousel-center {
                  position: relative !important;
                  inset: auto !important;
                  display: flex !important;
                  width: max-content;
                  height: 100%;
                  min-height: 100%;
                }
                .season-carousel-track {
                  display: flex !important;
                  width: max-content;
                  height: 100%;
                  aspect-ratio: auto;
                  gap: 16px;
                  padding: 0 24px;
                  animation: none !important;
                  transform: none !important;
                  transform-style: flat !important;
                }
                .season-carousel-card {
                  position: relative !important;
                  flex: 0 0 clamp(180px, 68vw, 240px);
                  width: clamp(180px, 68vw, 240px) !important;
                  transform: none !important;
                  scroll-snap-align: center;
                }
              }
            `}</style>
            {crops.map((crop, index) => (
              <figure
                key={crop.id}
                className="season-carousel-card relative [grid-area:1/1] aspect-[7/10] w-[var(--card-width)] overflow-hidden rounded-[16px] bg-forest shadow-[0_24px_60px_rgba(7,20,12,0.28)] [backface-visibility:hidden]"
                style={{
                  "--index": index,
                  transform: "rotateY(calc(var(--index) * var(--step))) translateZ(calc(-1 * var(--radius)))",
                } as CSSProperties}
              >
                <Image
                  src={CROP_IMAGES[crop.id]}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 300px, (min-width: 768px) 24vw, 190px"
                  className="object-cover"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#07150e]/95 via-[#07150e]/70 to-transparent px-3 pb-4 pt-14 text-center font-display text-[clamp(15px,1.4vw,19px)] leading-tight tracking-[-0.02em] text-cream">
                  {crop.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
