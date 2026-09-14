"use client";

import { useRef } from "react";
import { gsap, useGSAP, START } from "@/lib/gsap";
import { SmartLink } from "@/components/ui/SmartLink";
import { CropIcon } from "@/components/home/CropIcon";
import { useContent } from "@/components/layout/LocaleProvider";

/**
 * Culturas por região. O card sobe, as linhas entram em sequência e cada
 * fotografia surge com um leve salto.
 */
export function CropRegions() {
  const { crops } = useContent().home;
  const names = new Map(crops.cards.map((crop) => [crop.id, crop.name]));
  const scope = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".crop-region").forEach((card, i) => {
          gsap
            .timeline({
              scrollTrigger: { trigger: card, start: START, once: true },
              delay: i * 0.1,
            })
            .from(card, {
              opacity: 0,
              y: 24,
              duration: 0.7,
              ease: "power3.out",
            })
            .from(
              card.querySelectorAll(".crop-region__row"),
              {
                opacity: 0,
                x: -12,
                duration: 0.5,
                ease: "power2.out",
                stagger: 0.06,
              },
              "-=0.4",
            )
            .from(
              card.querySelectorAll(".crop-region__icon"),
              {
                scale: 0.4,
                rotation: -12,
                duration: 0.6,
                ease: "back.out(2.4)",
                stagger: 0.06,
              },
              "<",
            );
        });
      });
    },
    { scope },
  );

  return (
    <>
      <ul
        ref={scope}
        className="mx-[calc(-1*var(--spacing-gut))] mt-[clamp(28px,3vw,56px)] flex snap-x snap-mandatory scroll-px-gut gap-3 overflow-x-auto px-gut pb-2 [scrollbar-width:none] min-[861px]:mx-0 min-[861px]:grid min-[861px]:grid-cols-2 min-[861px]:gap-[clamp(14px,1.2vw,22px)] min-[861px]:overflow-visible min-[861px]:px-0 min-[1100px]:grid-cols-4"
      >
        {crops.regions.map((region, index) => {
          return (
            <li
              key={region.id}
              className="crop-region flex w-[84%] max-w-[360px] shrink-0 snap-start flex-col rounded-[clamp(12px,1vw,18px)] bg-linear-[149.8deg,var(--color-night-warm)_2.4%,var(--color-night-deep)_60.23%] p-[clamp(20px,1.6vw,30px)] text-offwhite min-[861px]:w-auto min-[861px]:max-w-none"
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className="inline-flex items-center gap-[0.7em] text-micro leading-none font-semibold tracking-[0.14em] text-lime uppercase"
                >
                  <span
                    aria-hidden
                    className="size-[6px] rounded-full bg-lime"
                  />
                  {region.tag}
                </span>
                <span
                  aria-hidden
                  className="text-micro leading-none text-muted-dark tabular-nums"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-[clamp(18px,1.6vw,30px)] text-h3 leading-tight">
                {region.name}
              </h3>
              <p
                className="mt-[0.4em] text-small leading-snug text-muted-dark"
              >
                {region.body}
              </p>

              <ul className="mt-[clamp(18px,1.6vw,28px)]">
                {region.crops.map((id) => (
                  <li
                    key={id}
                    className="crop-region__row group flex items-center gap-[14px] border-t border-offwhite/10 py-[clamp(9px,0.7vw,12px)]"
                  >
                    <span className="crop-region__icon grid size-[clamp(38px,2.7vw,48px)] shrink-0 place-items-center">
                      <CropIcon
                        id={id}
                        className="size-full transition-[scale] duration-300 group-hover:scale-110"
                      />
                    </span>
                    <span className="text-[clamp(14px,0.95vw,16px)] leading-tight font-medium transition-transform duration-300 group-hover:translate-x-1">
                      {names.get(id)}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
      <p className="mt-[clamp(16px,1.4vw,26px)] text-small text-muted">
        {crops.more.text}{" "}
        <SmartLink
          href="#us-operation"
          className="font-semibold whitespace-nowrap text-green-brand underline decoration-lime decoration-2 underline-offset-4 hover:text-green-deep"
        >
          {crops.more.cta} →
        </SmartLink>
      </p>
    </>
  );
}
