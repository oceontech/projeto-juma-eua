"use client";

import Image from "next/image";
import { useContent } from "@/components/layout/LocaleProvider";

export function Meet() {
  const { meet } = useContent().aminosanB;
  const [pour, mix, drop, ready, leaf] = meet.stages;

  return (
    <section id="meet" aria-labelledby="meet-heading" className="bg-white py-[clamp(72px,8vw,124px)] text-forest xl:py-10">
      <div className="wrap">
        <div className="mb-9 md:mb-12 xl:mb-6">
          <h2 id="meet-heading" className="max-w-[13ch] text-[clamp(42px,5.2vw,82px)] leading-[0.98] tracking-[-0.04em]">
            {meet.heading}
          </h2>
        </div>

        <ol className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-12 lg:auto-rows-[minmax(250px,auto)] lg:gap-5 xl:grid-rows-2 xl:auto-rows-auto">
          <li className="relative isolate flex min-h-[460px] flex-col justify-end overflow-hidden rounded-[24px] bg-[#123524] text-cream p-[clamp(20px,3vw,40px)] col-span-2 md:col-span-2 lg:col-span-7 lg:row-span-2 lg:min-h-[540px] xl:col-span-6 xl:min-h-[460px]" style={{ clipPath: "inset(0 round 24px)" }}>
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="absolute inset-0 -z-20 h-full w-full object-cover"
            >
              <source media="(max-width: 767px)" src="/video/aminosan-b/dive/drop-aminosan-mobile.mp4" type="video/mp4" />
              <source src="/video/aminosan-b/dive/drop-aminosan.mp4" type="video/mp4" />
            </video>
            <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-[#071b13]/95 via-[#071b13]/35 to-transparent" />
            <div className="relative max-w-[30rem]">
              <h3 className="text-[clamp(36px,3.7vw,60px)] leading-none tracking-[-0.035em]">{pour.title}</h3>
              <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-cream/90 md:text-base">{pour.body}</p>
            </div>
          </li>

          <li className="relative flex min-h-[190px] md:min-h-[250px] flex-col overflow-hidden rounded-[24px] bg-cream p-4 md:p-[clamp(24px,2.5vw,36px)] text-forest row-span-2 md:row-span-1 md:col-span-1 lg:col-span-5 xl:col-span-3 xl:min-h-[220px] xl:p-6">
            <div className="mt-auto">
              <h3 className="max-w-[16ch] text-[clamp(20px,5.2vw,28px)] md:text-[clamp(28px,2.7vw,43px)] leading-[1.05] tracking-[-0.03em] xl:text-[clamp(26px,2.2vw,32px)]">{mix.title}</h3>
              <p className="mt-2 max-w-[42ch] text-xs md:mt-4 md:text-sm leading-relaxed text-forest/75">{mix.body}</p>
            </div>
          </li>

          <li className="flex min-h-0 md:min-h-[250px] flex-col overflow-hidden rounded-[24px] bg-[linear-gradient(145deg,#28291e_0%,#121310_54%,#090a09_100%)] p-4 md:p-[clamp(24px,2.5vw,36px)] text-offwhite md:col-span-1 lg:col-span-5 xl:col-span-3 xl:min-h-[220px] xl:p-6">
            <div className="mt-auto pt-0 md:pt-8 xl:pt-0">
              <h3 className="max-w-[16ch] text-[clamp(20px,5.2vw,28px)] md:text-[clamp(28px,2.7vw,43px)] leading-[1.05] tracking-[-0.03em] xl:text-[clamp(26px,2.2vw,32px)]">{drop.title}</h3>
              <p className="mt-2 max-w-[42ch] text-xs md:mt-4 md:text-sm leading-relaxed text-offwhite/78">{drop.body}</p>
            </div>
          </li>

          <li className="flex min-h-0 md:min-h-[280px] flex-col rounded-[24px] bg-[linear-gradient(145deg,#28291e_0%,#121310_54%,#090a09_100%)] p-4 md:p-[clamp(24px,2.5vw,36px)] text-offwhite md:col-span-1 lg:col-span-5 xl:col-span-3 xl:min-h-[220px] xl:p-6">
            <div className="mt-auto pt-0 md:pt-8 xl:pt-0">
              <h3 className="max-w-[16ch] text-[clamp(20px,5.2vw,28px)] md:text-[clamp(28px,2.7vw,43px)] leading-[1.05] tracking-[-0.03em] xl:text-[clamp(26px,2.2vw,32px)]">{ready.title}</h3>
              <p className="mt-2 max-w-[42ch] text-xs md:mt-4 md:text-sm leading-relaxed text-offwhite/78">{ready.body}</p>
            </div>
          </li>

          <li className="relative isolate flex min-h-0 md:min-h-[280px] flex-col overflow-hidden rounded-[24px] bg-[#1a321e] text-cream p-4 md:p-[clamp(24px,2.5vw,36px)] col-span-2 md:col-span-1 lg:col-span-7 xl:col-span-3 xl:min-h-[220px] xl:p-6">
            <Image src="/img/aminosan-b/meet-leaf.webp" alt="" fill sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 55vw, (min-width: 768px) 50vw, 100vw" className="-z-20 object-cover object-center" />
            <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#102618]/95 via-[#102618]/75 to-[#102618]/15" />
            <div className="pt-0 md:pt-10 xl:mt-auto xl:pt-0">
              <h3 className="text-[clamp(20px,5.2vw,28px)] md:text-[clamp(28px,2.7vw,43px)] leading-[1.05] tracking-[-0.03em] xl:text-[clamp(26px,2.2vw,32px)]">{leaf.title}</h3>
              <p className="mt-2 max-w-[36ch] text-xs md:mt-4 md:text-sm leading-relaxed text-cream/85">{leaf.body}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
