"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import s from "./USOperation.module.css";

/**
 * A foto do fundo do card do formulário, no mesmo tratamento do fim das LPs:
 * a imagem inteira sob um véu verde uniforme, com um zoom curto que assenta
 * enquanto o card entra na tela. Sem movimento, fica parada em 1×.
 */
export function USOperationPhoto() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          scope.current,
          { scale: 1.15 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: scope.current, start: "top bottom", end: "center center", scrub: 0.6 },
          },
        );
      });
    },
    { scope },
  );

  return (
    <div ref={scope} aria-hidden className={s.photoWrap}>
      <Image
        src="/img/step-2-check.webp"
        alt=""
        fill
        quality={90}
        sizes="(min-width: 1400px) 1360px, 100vw"
        className={s.photo}
      />
    </div>
  );
}
