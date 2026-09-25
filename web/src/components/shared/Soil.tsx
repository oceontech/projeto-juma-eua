"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./Soil.module.css";

/**
 * A terra que sobe por cima da cena da raiz (Blackout no KMEP, Field no
 * Aminosan). As duas cenas presas terminam com a margem de baixo negativa, e
 * a seção seguinte sobe por cima delas nos últimos 100svh do pin.
 *
 * Mora no topo da seção seguinte (TwoJobs, Assembly), atrás do conteúdo. O
 * pai precisa ser `relative` e `isolate`, e sem fundo próprio: o fundo vem
 * daqui, e só começa dentro da terra — acima dos torrões fica transparente,
 * com a sombra leve que já está na imagem (public/img/soil/).
 *
 * O único movimento é o parallax da textura, mais lenta que a página.
 */
export function Soil() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          `.${styles.texture}`,
          { yPercent: 6 },
          {
            yPercent: -4,
            ease: "none",
            scrollTrigger: { trigger: scope.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope },
  );

  return (
    <>
      <div aria-hidden className={styles.fill} />
      <div ref={scope} aria-hidden className={styles.bed}>
        <div className={styles.texture} />
      </div>
    </>
  );
}
