"use client";

import { useContent } from "@/components/layout/LocaleProvider";
import { SeasonDial, type StageArt } from "@/components/shared/SeasonDial";

/* O desenho dos estágios, emprestado da LP do KMEP: o sprite da soja (três
   plantas, da mais nova à mais velha) e as fotos do milho jovem. É
   ilustração da régua, não do estágio exato. */
const ART: Record<string, StageArt> = {
  soy: { src: "/img/kmep/stages/soy.png", width: 1774, height: 887, cuts: [0, 537, 1171, 1774] },
  corn: ["/img/kmep/corn-v4.webp", "/img/kmep/corn-v6.webp"],
};

/**
 * A9 — a janela. O mesmo mostrador da safra do KMEP (`SeasonDial`), com as
 * duas culturas que têm janela na ficha: soja de V2–V3 a R5 e milho de V2 a
 * V8. As marcas são as bordas da janela, e a faixa lima cobre o trecho entre
 * elas. As culturas de mercado vêm logo abaixo, no `Season`, sem estágio.
 */
export function Timing() {
  const { timing } = useContent().aminosanB;
  return <SeasonDial id="window" data={timing} art={ART} />;
}
