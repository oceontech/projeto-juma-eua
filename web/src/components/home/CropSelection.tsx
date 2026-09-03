"use client";

import { useState } from "react";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Rule, SectionIntro } from "@/components/ui";
import { crops } from "@/content/home";

const CARDS = crops.cards;
const CENTER = Math.floor(CARDS.length / 2);

/**
 * Leque de culturas. A carta escolhida vai para o centro e as outras se
 * distribuem em volta na mesma ordem, em círculo.
 *
 * A geometria de cada posição está em globals.css (.crop-card[data-pos]);
 * aqui só decidimos qual carta ocupa qual posição.
 */
export function CropSelection() {
  const [active, setActive] = useState(CENTER);

  const positionOf = (index: number) =>
    (((index - active + CENTER) % CARDS.length) + CARDS.length) % CARDS.length;

  return (
    /* As cartas das pontas saem da caixa de propósito — o corte tem de ficar
       aqui, senão a página ganha rolagem horizontal. */
    <section id="crops" className="relative overflow-hidden bg-black pt-sec">
      <div className="wrap">
        <Reveal>
          <SectionIntro
            aside={<p className="text-muted-dark">{crops.body}</p>}
          >
            <Rule className="mb-[clamp(18px,1.8vw,33px)]" />
            <h2 className="max-w-[480px] text-h2 leading-[0.967] text-white">
              {crops.headline}
            </h2>
          </SectionIntro>
        </Reveal>

        <div className="fan mt-[clamp(24px,2.4vw,46px)]">
          {CARDS.map((crop, i) => (
            <article
              key={crop.id}
              className="crop-card"
              data-pos={positionOf(i)}
              onClick={() => setActive(i)}
            >
              <span className="absolute top-[5.3%] right-[6%] z-2 rounded-full bg-white px-[1.15em] py-[0.72em] text-[clamp(6px,0.62vw,12px)] leading-none font-semibold tracking-[0.15em] text-[#0E0E0D] uppercase">
                {crop.name}
              </span>
              <div className="absolute bottom-[8%] left-[7%] z-2 right-[7%] text-offwhite">
                <h3 className="text-[clamp(13px,1.68vw,32px)] font-semibold">
                  {crop.name}
                </h3>
                <p className="mt-[0.5em] text-[clamp(8px,0.95vw,18px)] leading-[1.5] font-light">
                  {crop.body}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* As cartas das pontas descem além da caixa do leque; a margem maior
            mantém a paginação livre delas. */}
        <div
          className="mt-[clamp(28px,3.6vw,70px)] flex justify-center gap-[clamp(5px,0.65vw,13px)]"
          role="tablist"
          aria-label="Crops"
        >
          {CARDS.map((crop, i) => (
            <button
              key={crop.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show ${crop.name}`}
              onClick={() => setActive(i)}
              className="h-[clamp(5px,0.63vw,12px)] w-[clamp(28px,3.4vw,65px)] cursor-pointer rounded-full bg-[#D9D9D9] transition-colors aria-selected:bg-lime"
            />
          ))}
        </div>
      </div>

      {/* A foto do campo faz a virada do preto para o branco da próxima
          seção. O Figma usa só a faixa central dela; o resto é névoa. */}
      <div className="mt-[clamp(28px,3vw,56px)] aspect-[444/250] overflow-hidden min-[861px]:aspect-[1918/629]">
        <Image
          src="/img/crop-field.jpg"
          alt=""
          aria-hidden
          width={1536}
          height={1024}
          className="h-full w-full object-cover object-[center_62%]"
        />
      </div>
    </section>
  );
}
