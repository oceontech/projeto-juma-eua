"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { Cta, Mark, microCaps } from "./ui";

export function Meet() {
  const { meet } = useContent().aminosanB;
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [pour, mix, drop, ready, leaf] = meet.stages;

  return (
    <section id="meet" data-nav-theme="dark" aria-labelledby="meet-heading" className="bg-[#123524] py-[clamp(72px,8vw,124px)] text-cream">
      <div className="wrap">
        <div className="mb-9 grid gap-5 md:mb-12 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className={`${microCaps} mb-4 text-lime`}>01 — 05</p>
            <h2 id="meet-heading" className="max-w-[13ch] text-[clamp(42px,5.2vw,82px)] leading-[0.98] tracking-[-0.04em]">
              {meet.heading}
            </h2>
          </div>
          <p className="max-w-[34ch] text-sm leading-relaxed text-cream/75 md:pb-2 md:text-base">{meet.intro}</p>
        </div>

        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[minmax(250px,auto)] lg:gap-5">
          <li className="relative isolate flex min-h-[460px] flex-col justify-end overflow-hidden rounded-[24px] bg-[#123524] p-[clamp(24px,3vw,40px)] md:col-span-2 lg:col-span-7 lg:row-span-2 lg:min-h-[540px]">
            <video
              ref={video}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              className="absolute inset-0 -z-20 h-full w-full object-cover"
            >
              <source media="(max-width: 767px)" src="/video/aminosan-b/dive/meet-tall-story.mp4" type="video/mp4" />
              <source src="/video/aminosan-b/dive/meet-wide-story.mp4" type="video/mp4" />
            </video>
            <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-[#071b13]/95 via-[#071b13]/35 to-transparent" />
            <button
              type="button"
              onClick={() => {
                if (video.current?.paused) void video.current.play();
                else video.current?.pause();
              }}
              aria-label={playing ? meet.pauseVideo : meet.playVideo}
              className="absolute top-5 right-5 flex size-10 items-center justify-center rounded-full border border-cream/50 bg-[#092016]/60 text-cream transition-colors hover:bg-[#092016] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
            >
              {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
            </button>
            <div className="relative max-w-[30rem]">
              <Mark className="mb-5 text-lime" />
              <p className={`${microCaps} text-lime`}>{pour.n} / 05</p>
              <h3 className="mt-3 text-[clamp(36px,3.7vw,60px)] leading-none tracking-[-0.035em]">{pour.title}</h3>
              <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-cream/90 md:text-base">{pour.body}</p>
            </div>
          </li>

          <li className="flex min-h-[250px] flex-col rounded-[24px] bg-cream p-[clamp(24px,2.5vw,36px)] text-forest md:col-span-1 lg:col-span-5">
            <p className={`${microCaps} flex items-center justify-between text-olive`}><span>{mix.n} / 05</span><Mark /></p>
            <div className="mt-auto pt-8">
              <h3 className="max-w-[16ch] text-[clamp(28px,2.7vw,43px)] leading-[1.05] tracking-[-0.03em]">{mix.title}</h3>
              <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-forest/75">{mix.body}</p>
            </div>
          </li>

          <li className="flex min-h-[250px] flex-col overflow-hidden rounded-[24px] bg-lime p-[clamp(24px,2.5vw,36px)] text-forest md:col-span-1 lg:col-span-5">
            <p className={`${microCaps} flex items-center justify-between`}><span>{drop.n} / 05</span><Mark /></p>
            <div className="mt-auto pt-8">
              <h3 className="max-w-[16ch] text-[clamp(28px,2.7vw,43px)] leading-[1.05] tracking-[-0.03em]">{drop.title}</h3>
              <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-forest/85">{drop.body}</p>
            </div>
          </li>

          <li className="flex min-h-[280px] flex-col rounded-[24px] border border-cream/20 bg-[#21432e] p-[clamp(24px,2.5vw,36px)] md:col-span-1 lg:col-span-5">
            <p className={`${microCaps} flex items-center justify-between text-lime`}><span>{ready.n} / 05</span><Mark /></p>
            <div className="mt-auto pt-8">
              <h3 className="max-w-[16ch] text-[clamp(28px,2.7vw,43px)] leading-[1.05] tracking-[-0.03em]">{ready.title}</h3>
              <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-cream/75">{ready.body}</p>
            </div>
          </li>

          <li className="relative isolate flex min-h-[280px] flex-col justify-between overflow-hidden rounded-[24px] bg-[#1a321e] p-[clamp(24px,2.5vw,36px)] md:col-span-1 lg:col-span-7">
            <Image src="/img/aminosan-b/meet-leaf.webp" alt="" fill sizes="(min-width: 1024px) 55vw, (min-width: 768px) 50vw, 100vw" className="-z-20 object-cover object-center" />
            <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#102618]/95 via-[#102618]/75 to-[#102618]/15" />
            <p className={`${microCaps} flex items-center justify-between text-lime`}><span>{leaf.n} / 05</span><Mark /></p>
            <div className="pt-10">
              <h3 className="text-[clamp(28px,2.7vw,43px)] leading-[1.05] tracking-[-0.03em]">{leaf.title}</h3>
              <p className="mt-4 max-w-[36ch] text-sm leading-relaxed text-cream/85">{leaf.body}</p>
              <Cta href={meet.cta.href} className="mt-6">{meet.cta.label}</Cta>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
