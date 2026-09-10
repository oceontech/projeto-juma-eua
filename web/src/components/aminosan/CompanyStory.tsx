import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { companyStory } from "@/content/aminosan";

export function CompanyStory() {
  return (
    <section className="bg-[#0f522a] py-[clamp(56px,7vw,124px)]">
      <Reveal y={18} className="wrap max-w-[1158px] text-center">
        <p className="font-display text-[16px] font-semibold tracking-[0.3em] text-lime uppercase">
          {companyStory.eyebrow}
        </p>
        <h2 className="mt-3 font-display text-[clamp(30px,3.4vw,48px)] text-white">{companyStory.heading}</h2>
        <p className="mx-auto mt-6 max-w-[68ch] leading-[1.55] text-offwhite/90">{companyStory.body[0]}</p>
        <p className="mx-auto mt-4 max-w-[68ch] leading-[1.55] text-offwhite/90">{companyStory.body[1]}</p>

        <a
          href={companyStory.cta.href}
          className="mx-auto mt-8 inline-flex items-center justify-center rounded-lg bg-lime px-8 py-4 font-medium text-ink transition-colors hover:bg-[#c3d454]"
        >
          {companyStory.cta.label} →
        </a>

        <div className="relative mt-16 aspect-[1158/364] w-full overflow-hidden rounded-[20px]">
          <Image src="/img/aminosan/company-factory-v2.webp" alt="Aminosan factory in Mogi Guaçu, Brazil" fill className="object-cover" />
        </div>
      </Reveal>
    </section>
  );
}
