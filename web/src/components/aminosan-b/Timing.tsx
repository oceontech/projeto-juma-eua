"use client";

import { useContent } from "@/components/layout/LocaleProvider";
import { SeasonDial, type StageArt } from "@/components/shared/SeasonDial";

/* O desenho dos estágios, o mesmo da LP do KMEP: um sprite por cultura, com
   as plantas lado a lado, e as fotos do milho. É ilustração da régua, não do
   estágio exato. Ervilha e amendoim usam o feijão, e a uva usa as frutíferas.
   Arroz, trigo e cevada ainda não têm desenho. */
const ART: Record<string, StageArt> = {
  cotton: { src: "/img/kmep/stages/cotton.png", width: 1974, height: 797, cuts: [0, 468, 952, 1473, 1974] },
  beans: { src: "/img/kmep/stages/beans.png", width: 1774, height: 887, cuts: [0, 552, 1142, 1774] },
  soy: { src: "/img/kmep/stages/soy.png", width: 1774, height: 887, cuts: [0, 537, 1171, 1774] },
  legumes: { src: "/img/kmep/stages/beans.png", width: 1774, height: 887, cuts: [0, 552, 1142, 1774] },
  corn: ["/img/kmep/corn-v6.webp"],
  potato: { src: "/img/kmep/stages/potato.png", width: 1881, height: 836, cuts: [0, 558, 1176, 1881] },
  tomato: { src: "/img/kmep/stages/tomato.png", width: 1942, height: 809, cuts: [0, 458, 916, 1432, 1942] },
  roots: { src: "/img/kmep/stages/roots.png", width: 1774, height: 887, cuts: [0, 473, 1064, 1774] },
  veg: { src: "/img/kmep/stages/veg.png", width: 2172, height: 724, cuts: [0, 633, 1361, 2172] },
  onion: { src: "/img/kmep/stages/onion.png", width: 1942, height: 809, cuts: [0, 566, 1256, 1942] },
  fruit: { src: "/img/kmep/stages/fruit.png", width: 1774, height: 887, cuts: [0, 605, 1139, 1774] },
  grape: { src: "/img/kmep/stages/fruit.png", width: 1774, height: 887, cuts: [0, 605, 1139, 1774] },
  citrus: { src: "/img/kmep/stages/citrus.png", width: 1774, height: 887, cuts: [0, 567, 1138, 1774] },
  ornamental: { src: "/img/kmep/stages/ornamental.png", width: 1774, height: 887, cuts: [0, 532, 1119, 1774] },
};

/**
 * A9 — quando entra. O mesmo mostrador da safra do KMEP (`SeasonDial`), com
 * as culturas da tabela de aplicação do Aminosan®: das grandes culturas às
 * hortaliças, frutas e ornamentais.
 */
export function Timing() {
  const { timing } = useContent().aminosanB;
  return <SeasonDial id="window" data={timing} art={ART} />;
}
