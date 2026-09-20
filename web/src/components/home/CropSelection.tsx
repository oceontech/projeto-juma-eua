import { ImageStreamHero, type CorridorPath } from "@/components/ui/image-stream-hero";
import { Reveal } from "@/components/motion/Reveal";
import { CropRegions } from "@/components/home/CropRegions";
import { CropPillars } from "@/components/home/CropPillars";
import { Rule, SectionIntro } from "@/components/ui";
import { getContent } from "@/lib/locale";
import { cropCorridorImages } from "@/content/crop-corridor";

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

        <CropPillars title={crops.pillarsTitle} lead={crops.pillarsLead} note={crops.pillarsNote} pillars={crops.pillars} />
      </div>

    </section>
  );
}
