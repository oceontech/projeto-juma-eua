"use client";

import Image from "next/image";
import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { SeasonDial, type StageArt } from "@/components/shared/SeasonDial";
import { gsap, useGSAP } from "@/lib/gsap";
import { eyebrow } from "./ui";

/* Os estágios de cada cultura: um sprite com as plantas lado a lado, cortado
   no espaço entre elas; o milho tem uma foto por estágio. */
const ART: Record<string, StageArt> = {
  citrus: { src: "/img/kmep/stages/citrus.png", width: 1774, height: 887, cuts: [0, 567, 1138, 1774] },
  fruit: { src: "/img/kmep/stages/fruit.png", width: 1774, height: 887, cuts: [0, 605, 1139, 1774] },
  veg: { src: "/img/kmep/stages/veg.png", width: 2172, height: 724, cuts: [0, 633, 1361, 2172] },
  tomato: { src: "/img/kmep/stages/tomato.png", width: 1942, height: 809, cuts: [0, 458, 916, 1432, 1942] },
  ornamental: { src: "/img/kmep/stages/ornamental.png", width: 1774, height: 887, cuts: [0, 532, 1119, 1774] },
  potato: { src: "/img/kmep/stages/potato.png", width: 1881, height: 836, cuts: [0, 558, 1176, 1881] },
  onion: { src: "/img/kmep/stages/onion.png", width: 1942, height: 809, cuts: [0, 566, 1256, 1942] },
  roots: { src: "/img/kmep/stages/roots.png", width: 1774, height: 887, cuts: [0, 473, 1064, 1774] },
  soy: { src: "/img/kmep/stages/soy.png", width: 1774, height: 887, cuts: [0, 537, 1171, 1774] },
  cotton: { src: "/img/kmep/stages/cotton.png", width: 1974, height: 797, cuts: [0, 468, 952, 1473, 1974] },
  beans: { src: "/img/kmep/stages/beans.png", width: 1774, height: 887, cuts: [0, 552, 1142, 1774] },
  corn: ["/img/kmep/corn-v4.webp", "/img/kmep/corn-v6.webp", "/img/kmep/corn-ear.webp"],
};

/**
 * K13 — quando entra. O mostrador da safra (`SeasonDial`, o mesmo da LP do
 * Aminosan) com as onze culturas da ficha, e embaixo a ficha da bombona.
 *
 * Dose e embalagem dependem de P4 e P1 — a ficha diz a frase honesta, e o
 * TODO fica no conteúdo.
 */
export function Timing() {
  const { timing } = useContent().kmep;
  return (
    <SeasonDial data={timing} art={ART}>
      <Spec />
    </SeasonDial>
  );
}

/** A ficha: dose e embalagem de um lado, mistura do outro, a bombona no meio. */
function Spec() {
  const { timing } = useContent().kmep;
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* A bombona sobe endireitando, os anéis surgem (só opacidade: escalar a
           camada que gira a rasteriza pequena e serrilha as bordas) e os fios das duas
           notas se desenham até ela. */
        gsap
          .timeline({ scrollTrigger: { trigger: ".tm-spec", start: "top 85%", end: "center 55%", scrub: 0.8 } })
          .fromTo(".tm-jug", { y: 90, rotate: -8, scale: 0.86 }, { y: 0, rotate: 0, scale: 1, ease: "power2.out" }, 0)
          .fromTo(".tm-orbit", { opacity: 0 }, { opacity: 1, stagger: 0.12, ease: "power2.out" }, 0)
          .fromTo(".tm-call", { opacity: 0, x: (i: number) => (i ? 48 : -48) }, { opacity: 1, x: 0, ease: "power2.out" }, 0.2)
          .fromTo(".tm-lead", { scaleX: 0 }, { scaleX: 1, ease: "power2.inOut" }, 0.45)
          .fromTo(".tm-dot", { scale: 0 }, { scale: 1, ease: "back.out(3)" }, 0.8);
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className="wrap pb-sec">
      <div className="tm-spec relative mt-[clamp(56px,8vw,120px)] grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(240px,clamp(300px,30vw,440px))_minmax(0,1fr)] lg:gap-0">
        {timing.details.map((detail, i) => (
          <div
            key={detail.k}
            className={`tm-call flex items-center gap-6 ${i === 0 ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-3 lg:row-start-1 lg:flex-row-reverse"}`}
          >
            <div className={`flex-1 border-t border-forest/20 pt-4 lg:border-0 lg:pt-0 ${i === 0 ? "lg:text-right" : ""}`}>
              <p className={`${eyebrow} text-[10px] text-moss`}>
                0{i + 1} · {detail.k}
              </p>
              <p className="mt-3 font-display text-[clamp(18px,1.5vw,24px)] leading-[1.25] tracking-[-0.01em]">{detail.v}</p>
            </div>
            {/* z-10: as linhas e os pontos precisam ficar por cima dos anéis do
                centro, que giram e por vezes avançam sobre esta borda. */}
            <span aria-hidden className="relative z-10 hidden h-px w-[clamp(40px,5vw,96px)] shrink-0 lg:block">
              <span className={`tm-lead absolute inset-0 bg-forest/40 ${i === 0 ? "origin-left" : "origin-right"}`} />
              <span
                className={`tm-dot absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-lime ring-2 ring-forest ${
                  i === 0 ? "right-0 translate-x-[85%]" : "left-0 -translate-x-[85%]"
                }`}
              />
            </span>
          </div>
        ))}

        <div className="relative order-first mx-auto aspect-square w-[min(360px,84vw)] lg:order-none lg:col-start-2 lg:row-start-1 lg:w-full">
          {/* Os dois anéis: incompletos e grossos, um preto e um vermelho, girando
              em sentidos opostos e em velocidades diferentes — o gesto de uma
              embalagem em giro, não de um alvo perfeito. */}
          <span aria-hidden className="tm-orbit absolute inset-[4%]">
            <svg viewBox="0 0 100 100" className="size-full origin-center animate-spin motion-reduce:animate-none [animation-duration:14s]">
              <circle cx="50" cy="50" r="44" fill="none" strokeWidth="4" strokeLinecap="round" strokeDasharray="205 285" className="stroke-night" />
            </svg>
          </span>
          <span aria-hidden className="tm-orbit absolute inset-[13%]">
            <svg
              viewBox="0 0 100 100"
              className="size-full origin-center animate-spin motion-reduce:animate-none [animation-direction:reverse] [animation-duration:20s]"
            >
              <circle cx="50" cy="50" r="40" fill="none" strokeWidth="5.5" strokeLinecap="round" strokeDasharray="150 264" className="stroke-kmep" />
            </svg>
          </span>
          <span aria-hidden className="tm-orbit absolute inset-[20%] rounded-full bg-[radial-gradient(closest-side,rgba(183,199,62,0.35),transparent)]" />
          <div className="tm-jug absolute inset-[6%]">
            <Image
              src="/img/pack-kmep-us.webp"
              alt={timing.jugAlt}
              fill
              sizes="(min-width: 1024px) 440px, 360px"
              className="object-contain drop-shadow-[0_24px_30px_rgba(22,38,27,0.25)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
