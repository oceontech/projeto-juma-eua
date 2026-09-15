import Image from "next/image";
import { ClipboardCheck, Handshake, Microscope, SprayCan } from "lucide-react";
import { ImageStreamHero, type CorridorPath } from "@/components/ui/image-stream-hero";
import { Reveal } from "@/components/motion/Reveal";
import { CropRegions } from "@/components/home/CropRegions";
import { Rule, SectionIntro } from "@/components/ui";
import { getContent } from "@/lib/locale";
import { cropCorridorImages } from "@/content/crop-corridor";
import surfaceStyles from "./BeneathSurface.module.css";

const PILLAR_ICONS = [Microscope, SprayCan, Handshake, ClipboardCheck];

// No retrato a largura é pouca: cartas maiores na saída e menos cartas por
// trilho, para cada foto ter espaço de ser vista.
const MOBILE_PATH: CorridorPath = { exitHeight: 84, birthHeight: 5, railExit: 30 };

async function CorridorOverlay() {
  const { crops } = (await getContent()).home;
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-1 h-[22%] bg-linear-to-b from-white to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-[22%] bg-linear-to-t from-white to-transparent"
      />
      <div className="relative z-2 flex h-full items-end justify-center pb-[clamp(18px,3vw,48px)]">
        <p className="rounded-full bg-white/90 px-[1.3em] py-[0.8em] text-micro leading-none font-semibold tracking-[0.15em] text-[#0E0E0D] uppercase shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur">
          {crops.corridorLabel}
        </p>
      </div>
    </>
  );
}

/**
 * Culturas atendidas nos EUA: corredor de imagens, culturas por região e
 * motivos para o produtor escolher a Juma.
 */
export async function CropSelection() {
  const { crops } = (await getContent()).home;
  return (
    <section id="crops" className="relative overflow-hidden bg-white pt-sec">
      <Reveal className="wrap relative z-2">
        <SectionIntro aside={<p className="text-muted">{crops.body}</p>}>
          <Rule className="mb-[clamp(18px,1.8vw,33px)]" />
          <p className="mb-[0.9em] text-micro font-semibold tracking-[0.15em] text-green-brand uppercase">
            {crops.eyebrow}
          </p>
          <h2 className="max-w-[560px] text-h2 leading-[0.967] text-ink">
            {crops.headline}
          </h2>
        </SectionIntro>
      </Reveal>

      <ImageStreamHero
        images={cropCorridorImages}
        cards={7}
        speed={22}
        axis={48}
        path={MOBILE_PATH}
        className="mt-[clamp(20px,6vw,32px)] h-[clamp(340px,100vw,540px)] bg-white min-[861px]:hidden"
      >
        <CorridorOverlay />
      </ImageStreamHero>
      <ImageStreamHero
        images={cropCorridorImages}
        speed={20}
        axis={50}
        className="mt-[clamp(24px,2vw,40px)] hidden h-[clamp(480px,40vw,720px)] bg-white min-[861px]:block"
      >
        <CorridorOverlay />
      </ImageStreamHero>

      <div className="wrap relative z-2">
        <CropRegions />

        {/* Pilares estratégicos. */}
        <Reveal
          className="mt-[clamp(20px,1.8vw,32px)] rounded-[clamp(14px,1.1vw,20px)] bg-green-deep px-[clamp(16px,2vw,36px)] py-[clamp(18px,1.6vw,28px)] text-offwhite"
        >
          <div className="flex flex-col gap-4 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:gap-8">
            <p className="shrink-0 text-micro font-semibold tracking-[0.15em] text-lime uppercase">
              {crops.pillarsTitle}
            </p>
            <ul className="grid flex-1 grid-cols-2 gap-x-4 gap-y-4 min-[861px]:grid-cols-4 min-[861px]:gap-0">
              {crops.pillars.map((pillar, i) => {
                const Icon = PILLAR_ICONS[i];
                return (
                  <li
                    key={pillar}
                    className="flex items-center gap-3 min-[861px]:justify-center min-[861px]:border-l min-[861px]:border-offwhite/15 min-[861px]:px-3 min-[861px]:first:border-l-0"
                  >
                    <span className="grid size-[clamp(34px,2.6vw,46px)] shrink-0 place-items-center rounded-full border border-offwhite/30">
                      <Icon aria-hidden className="size-[55%]" strokeWidth={1.6} />
                    </span>
                    <span className="text-[clamp(12px,0.9vw,16px)] leading-tight font-semibold tracking-[0.06em] uppercase">
                      {pillar}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </div>

      {/* The canopy fades into the same deep green as the leaf section. */}
      <div className={surfaceStyles.fieldTransition} aria-hidden="true">
        <picture>
          <source media="(max-width: 860px)" srcSet="/img/surface-v2/field-mobile.webp" />
          <Image
            src="/img/surface-v2/field.webp"
            alt=""
            width={2048}
            height={688}
            unoptimized
            className="h-full w-full object-cover"
          />
        </picture>
      </div>
    </section>
  );
}
