"use client";

import Image from "next/image";
import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { SplitLines } from "@/components/motion/SplitLines";
import { gsap, useGSAP } from "@/lib/gsap";
import { AMINO, eyebrow, microCaps } from "./ui";

/**
 * O que tem na bombona: a ficha do KMEP (bombona no centro, anéis girando,
 * fatos presos por fios), com seis fatos em vez de dois e os anéis nas cores
 * do rótulo do Aminosan® — o azul da faixa por fora, o verde da marca por
 * dentro. A bombona sobe endireitando, os anéis abrem, os fatos entram de
 * cada lado e os fios se desenham até ela.
 */
export function Label() {
  const { label } = useContent().aminosanB;
  const scope = useRef<HTMLElement>(null);
  const half = Math.ceil(label.facts.length / 2);
  const sides = [label.facts.slice(0, half), label.facts.slice(half)];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ".lb-spec", start: "top 85%", end: "center 55%", scrub: 0.8 } })
          .fromTo(".lb-jug", { y: 90, rotate: -8, scale: 0.86 }, { y: 0, rotate: 0, scale: 1, ease: "power2.out" }, 0)
          .fromTo(".lb-orbit", { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.12, ease: "power2.out" }, 0)
          .fromTo(".lb-fact-0", { opacity: 0, x: -48 }, { opacity: 1, x: 0, stagger: 0.08, ease: "power2.out" }, 0.2)
          .fromTo(".lb-fact-1", { opacity: 0, x: 48 }, { opacity: 1, x: 0, stagger: 0.08, ease: "power2.out" }, 0.2)
          .fromTo(".lb-lead", { scaleX: 0 }, { scaleX: 1, stagger: 0.05, ease: "power2.inOut" }, 0.45)
          .fromTo(".lb-dot", { scale: 0 }, { scale: 1, stagger: 0.05, ease: "back.out(3)" }, 0.8);
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="bg-cream pt-sec pb-[clamp(56px,7vw,120px)] text-forest">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-end lg:gap-16">
          <div>
            <p className={`${eyebrow} text-moss`}>{label.label}</p>
            <SplitLines className="mt-4 text-[clamp(36px,4.4vw,80px)] leading-[0.95] tracking-[-0.04em]">
              {label.heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </SplitLines>
          </div>
          <p className={`${microCaps} text-[12px] text-forest/75`}>{label.body}</p>
        </div>

        <div className="lb-spec relative mt-[clamp(40px,6vw,96px)] grid items-center gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(240px,clamp(300px,30vw,440px))_minmax(0,1fr)] lg:gap-0">
          {sides.map((facts, side) => (
            <dl
              key={side}
              className={`grid gap-0 sm:grid-cols-2 lg:grid-cols-1 lg:gap-[clamp(18px,3svh,36px)] ${side === 0 ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-3 lg:row-start-1"}`}
            >
              {facts.map((fact) => (
                <div
                  key={fact.k}
                  className={`lb-fact-${side} flex items-center gap-6 ${side === 1 ? "lg:flex-row-reverse" : ""}`}
                >
                  <div className={`flex-1 border-t border-forest/15 py-4 lg:border-0 lg:py-0 ${side === 0 ? "lg:text-right" : ""}`}>
                    <dt className={`${eyebrow} text-[10px] text-moss`}>{fact.k}</dt>
                    <dd className="mt-2 font-display text-[clamp(18px,1.5vw,24px)] leading-[1.2] tracking-[-0.01em]">{fact.v}</dd>
                  </div>
                  {/* z-10: os fios ficam por cima dos anéis, que giram e por
                      vezes avançam sobre esta borda. */}
                  <span aria-hidden className="relative z-10 hidden h-px w-[clamp(32px,4vw,80px)] shrink-0 lg:block">
                    <span className={`lb-lead absolute inset-0 bg-forest/35 ${side === 0 ? "origin-left" : "origin-right"}`} />
                    <span
                      className={`lb-dot absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full ring-2 ring-white ${side === 0 ? "right-0 translate-x-[85%]" : "left-0 -translate-x-[85%]"}`}
                      style={{ backgroundColor: AMINO.blue }}
                    />
                  </span>
                </div>
              ))}
            </dl>
          ))}

          <div className="relative order-first mx-auto mb-8 aspect-square w-[min(360px,84vw)] lg:order-none lg:mb-0 lg:col-start-2 lg:row-start-1 lg:w-full">
            <span aria-hidden className="lb-orbit absolute inset-[4%]">
              <svg viewBox="0 0 100 100" className="size-full origin-center animate-spin motion-reduce:animate-none [animation-duration:16s]">
                <circle cx="50" cy="50" r="44" fill="none" strokeWidth="4" strokeLinecap="round" strokeDasharray="205 285" stroke={AMINO.blue} />
              </svg>
            </span>
            <span aria-hidden className="lb-orbit absolute inset-[13%]">
              <svg
                viewBox="0 0 100 100"
                className="size-full origin-center animate-spin motion-reduce:animate-none [animation-direction:reverse] [animation-duration:22s]"
              >
                <circle cx="50" cy="50" r="40" fill="none" strokeWidth="5.5" strokeLinecap="round" strokeDasharray="150 264" stroke={AMINO.green} />
              </svg>
            </span>
            <span aria-hidden className="lb-orbit absolute inset-[20%] rounded-full bg-[radial-gradient(closest-side,rgba(183,199,62,0.35),transparent)]" />
            <div className="lb-jug absolute inset-[6%]">
              <Image
                src="/img/pack-aminosan-us.webp"
                alt={label.alt}
                fill
                sizes="(min-width: 1024px) 440px, 360px"
                className="object-contain drop-shadow-[0_24px_30px_rgba(22,38,27,0.25)]"
              />
            </div>
          </div>
        </div>

        <p className={`${microCaps} mt-8 text-center text-[10px] text-forest/55`}>{label.note}</p>
      </div>
    </section>
  );
}
