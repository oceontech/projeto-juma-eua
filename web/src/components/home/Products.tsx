"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { cx } from "@/components/ui";
import { products } from "@/content/home";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Os dois produtos da v1, lado a lado, sobre a faixa vermelho/azul. */
export function Products() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scene = root.current;
      if (!scene) return;

      const bands = Array.from(
        scene.querySelectorAll<HTMLElement>("[data-product-band]"),
      );
      const cards = Array.from(
        scene.querySelectorAll<HTMLElement>("[data-product-card]"),
      );
      const categories = Array.from(
        scene.querySelectorAll<HTMLElement>("[data-product-category]"),
      );
      const titles = Array.from(
        scene.querySelectorAll<HTMLElement>("[data-product-title]"),
      );
      const descriptions = Array.from(
        scene.querySelectorAll<HTMLElement>("[data-product-description]"),
      );
      const shots = Array.from(
        scene.querySelectorAll<HTMLElement>("[data-product-shot]"),
      );
      const videos = Array.from(
        scene.querySelectorAll<HTMLElement>("[data-product-video]"),
      );
      if (bands.length !== 2 || cards.length !== 2) return;
      const animatedElements = [
        ...bands,
        ...cards,
        ...categories,
        ...titles,
        ...descriptions,
        ...shots,
        ...videos,
      ];

      const restingOffset = (index: number) => (index === 0 ? -100 : 100);
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 861px)",
          animate: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { desktop, animate } = context.conditions as {
            desktop: boolean;
            animate: boolean;
          };

          if (!desktop || !animate) {
            gsap.set(bands, { x: 0, xPercent: 0 });
            gsap.set(
              [...cards, ...categories, ...titles, ...descriptions, ...shots, ...videos],
              { opacity: 1, x: 0, y: 0 },
            );
            return;
          }

          const setWillChange = (active: boolean) => {
            animatedElements.forEach((element) => {
              element.style.willChange = active ? "transform, opacity" : "";
            });
          };

          const timeline = gsap
            .timeline({
              paused: true,
              onStart: () => setWillChange(true),
              onComplete: () => setWillChange(false),
              onReverseComplete: () => setWillChange(false),
            })
            .fromTo(
              bands,
              { x: 0, xPercent: restingOffset },
              { x: 0, xPercent: 0, duration: 1.05, ease: "power3.out" },
              0,
            )
            .fromTo(
              cards,
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
              0.16,
            )
            .fromTo(
              categories,
              { opacity: 0, x: -18 },
              { opacity: 1, x: 0, duration: 0.42, ease: "power3.out" },
              0.28,
            )
            .fromTo(
              titles,
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 0.46, ease: "power3.out" },
              0.38,
            )
            .fromTo(
              descriptions,
              { opacity: 0 },
              { opacity: 1, duration: 0.42, ease: "power2.out" },
              0.48,
            )
            .fromTo(
              shots,
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
              0.56,
            )
            .fromTo(
              videos,
              { opacity: 0 },
              { opacity: 1, duration: 0.48, ease: "power2.out" },
              0.7,
            );

          timeline.progress(0);

          ScrollTrigger.create({
            id: "product-bands",
            trigger: scene,
            start: "top 12%",
            end: "bottom 35%",
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              /* Um refresh pode mover esta seção para baixo depois que as
                 fontes e as cenas anteriores terminam de montar. Se ela não
                 estiver realmente visível, devolve as faixas ao início. */
              if (!self.isActive) {
                timeline.pause(0);
                setWillChange(false);
              } else if (document.readyState === "complete" && !timeline.progress()) {
                timeline.restart();
              }
            },
            onEnter: () => timeline.play(),
            onEnterBack: () => timeline.play(),
            onLeave: () => timeline.reverse(),
            onLeaveBack: () => timeline.reverse(),
          });

          return () => setWillChange(false);
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="products"
      className="relative overflow-hidden bg-white py-[clamp(36px,7vw,60px)] min-[861px]:flex min-[861px]:min-h-[100svh] min-[861px]:items-center min-[861px]:py-[clamp(20px,3svh,36px)]"
    >
      {/* Faixas independentes: cada uma encosta no seu card, em alturas
          diferentes, sem o antigo recorte circular do SVG. */}
      <span
        data-product-band
        aria-hidden
        className="products-band products-band--kmep"
      />
      <span
        data-product-band
        aria-hidden
        className="products-band products-band--amino"
      />

      <div
        data-products-grid
        className="relative mx-auto grid w-[min(1280px,calc(100%-2*var(--spacing-gut)))] grid-cols-1 gap-[clamp(18px,2.2vw,34px)] max-[860px]:max-w-[480px] min-[861px]:grid-cols-2"
      >
        {products.map((product) => {
          const kmep = product.id === "kmep";

          return (
            <article
              key={product.id}
              data-product-card
              className={cx(
                "relative flex flex-col overflow-hidden rounded-[clamp(14px,1vw,18px)] px-[clamp(18px,1.45vw,28px)] pt-[clamp(18px,1.55vw,30px)] pb-[clamp(18px,1.7vw,32px)] text-white",
                kmep
                  ? "bg-linear-[158.24deg,#000_39.81%,#4E1D15_94.16%]"
                  : "bg-linear-[158.24deg,#000_39.81%,var(--color-amino)_94.16%]",
              )}
            >
              <p data-product-category className="flex items-center">
                <span
                  className={cx(
                    "text-[clamp(8px,0.62vw,12px)] tracking-[0.03em] whitespace-nowrap uppercase",
                    kmep ? "text-kmep-light" : "text-[#F3F3F3]",
                  )}
                >
                  {product.category}
                </span>
                <i
                  className={cx(
                    "ml-3.5 h-[2.6px] flex-1 rounded-[27px]",
                    kmep ? "bg-kmep" : "bg-white",
                  )}
                />
              </p>

              <h3 data-product-title className="mt-[clamp(12px,1.4vw,20px)] mb-[clamp(8px,0.8vw,12px)] text-[clamp(26px,2.2vw,42px)] leading-none text-[#FAFBFC]">
                {product.title}
              </h3>

              <p data-product-description className="max-w-[40ch] text-[clamp(12px,0.73vw,14px)] leading-[1.5] text-[#E9E9E9]">
                {product.body}
              </p>

              <div data-product-shot className="relative mx-auto my-[clamp(10px,1.3svh,16px)] h-[clamp(330px,90vw,430px)] w-full min-[861px]:h-[clamp(300px,44svh,440px)]">
                <Image
                  src={product.image.src}
                  alt={product.image.alt}
                  width={640}
                  height={640}
                  className="relative z-1 h-full w-full scale-[1.18] object-contain"
                />
              </div>

              <Link
                data-product-video
                href={product.href}
                aria-label={`Watch the ${product.title} video`}
                className={cx(
                  "relative mx-auto mt-auto grid aspect-[485/271] w-full max-w-[220px] place-items-center rounded-[12px] border-[1.3px] transition-transform hover:scale-[1.012] min-[861px]:max-w-[380px]",
                  kmep
                    ? "border-kmep-light bg-kmep"
                    : "border-[#E8E8E8] bg-[#D3D3D3]",
                )}
              >
                <span
                  aria-hidden
                  className={cx(
                    "aspect-[69/83] w-[clamp(26px,2vw,40px)] rounded-[4px] [clip-path:polygon(0_0,100%_50%,0_100%)]",
                    kmep ? "bg-kmep-light" : "bg-white",
                  )}
                />
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
