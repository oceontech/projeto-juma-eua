"use client";

import Image from "next/image";
import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { scroller } from "@/components/motion/SmoothScroll";
import { gsap, useGSAP, type ScrollTrigger } from "@/lib/gsap";
import { SplitLines } from "@/components/motion/SplitLines";
import { microCaps } from "./ui";

/**
 * As perguntas como o "latest from the community" da referência: a cena
 * prende sobre a paisagem e o trilho de cartões corre para a esquerda
 * conforme a página rola. Cada cartão é uma foto com a caixa creme
 * sobreposta. As setas não rolam o trilho por conta própria — pedem à
 * página para andar até o cartão seguinte, então scroll e trilho nunca
 * discordam.
 */
export function Questions() {
  const { questions } = useContent().aminosanB;
  const scope = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);

  useGSAP(
    () => {
      const el = track.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* Quanto o trilho precisa andar: até o último cartão encostar na
           margem direita. Medido a cada refresh, porque depende da janela. */
        const distance = () => Math.max(0, el.scrollWidth - el.clientWidth);

        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".qs-stage",
            start: "top top",
            end: () => `+=${distance() + window.innerHeight * 0.4}`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        trigger.current = tween.scrollTrigger ?? null;

        gsap.fromTo(
          ".qs-bg",
          { scale: 1.15 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".qs-stage",
              start: "top bottom",
              end: () => `+=${distance() + window.innerHeight * 2}`,
              scrub: true,
            },
          },
        );

        return () => {
          trigger.current = null;
        };
      });
    },
    { scope },
  );

  const step = (dir: 1 | -1) => {
    const st = trigger.current;
    const count = questions.items.length;
    if (!st) {
      track.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
      return;
    }
    const at = Math.round(st.progress * (count - 1));
    const next = Math.min(count - 1, Math.max(0, at + dir));
    const y = st.start + (st.end - st.start) * (next / (count - 1));
    const lenis = scroller();
    if (lenis) lenis.scrollTo(y, { duration: 0.9 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const arrow =
    "grid size-10 place-items-center bg-cream text-forest transition-colors hover:bg-lime";

  return (
    <section ref={scope} data-nav-theme="dark" className="bg-forest text-cream">
      <div
        className="qs-stage relative h-[100svh] overflow-hidden"
        style={{
          ["--rail-gut" as string]:
            "max(var(--spacing-gut), calc((100vw - var(--container-wrap)) / 2))",
        }}
      >
        <div className="qs-bg absolute inset-0">
          <Image
            src="/img/aminosan-b/questions-pasture.webp"
            alt=""
            fill
            sizes="100vw"
            quality={90}
            className="object-cover"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,38,27,0.75)_0%,rgba(22,38,27,0.25)_45%,rgba(22,38,27,0.1)_100%)]"
        />

        <div className="relative flex h-full flex-col gap-8 pt-[clamp(96px,14svh,150px)] pb-[clamp(32px,6svh,64px)] lg:flex-row lg:items-center lg:gap-0 lg:py-0">
          <div className="flex shrink-0 flex-col px-[var(--spacing-gut)] lg:h-[min(440px,64svh)] lg:w-[34%] lg:pl-[var(--rail-gut)]">
            <SplitLines className="text-[clamp(34px,3.8vw,64px)] leading-[0.98] tracking-[-0.03em]">
              {questions.heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </SplitLines>
            <div className="mt-auto hidden gap-2 lg:flex">
              <button
                type="button"
                aria-label={questions.prev}
                className={arrow}
                onClick={() => step(-1)}
              >
                ←
              </button>
              <button
                type="button"
                aria-label={questions.next}
                className={arrow}
                onClick={() => step(1)}
              >
                →
              </button>
            </div>
          </div>

          {/* O trilho some na borda da coluna do título em vez de passar por
              cima dele. */}
          <div className="min-w-0 flex-1 overflow-hidden motion-reduce:overflow-x-auto">
            <div
              ref={track}
              className="flex gap-4 px-[var(--spacing-gut)] will-change-transform lg:pl-0"
            >
              {questions.items.map((item, i) => (
                <article
                  key={item.q}
                  className="relative h-[min(440px,58svh)] w-[min(78vw,340px)] shrink-0"
                >
                  <div className="absolute top-0 left-0 h-[72%] w-[64%] overflow-hidden">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="240px"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute right-0 bottom-0 flex h-[64%] w-[76%] flex-col bg-cream p-5 text-forest">
                    <span className="font-display text-[11px] tracking-[0.16em] text-moss">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 font-display text-[15px] leading-[1.2] font-medium tracking-[0.02em] uppercase">
                      {item.q}
                    </h3>
                    <p className={`${microCaps} mt-auto text-forest/70`}>
                      {item.a}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
