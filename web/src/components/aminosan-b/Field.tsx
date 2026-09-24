"use client";

import { Fragment, useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { microCaps } from "./ui";

const CHAPTER = [0.36, 0.58, 0.78];
const IMAGES = ["leaf", "plant", "roots"];
const CURTAIN_AT = 0.87;
const CURTAIN_LEN = 0.1;
const wheelPlace = [
  { xPercent: 65, yPercent: -272, rotation: -22, scale: 0.65, opacity: 0 },
  { xPercent: 22, yPercent: -136, rotation: -12, scale: 0.82, opacity: 0.55 },
  { xPercent: 0, yPercent: 0, rotation: 0, scale: 1, opacity: 1 },
  { xPercent: 22, yPercent: 136, rotation: 12, scale: 0.82, opacity: 0.55 },
  { xPercent: 65, yPercent: 272, rotation: 22, scale: 0.65, opacity: 0 },
];

export function Field() {
  const { field } = useContent().aminosanB;
  const scope = useRef<HTMLElement>(null);

  useGSAP(() => {
    const root = scope.current;
    const stage = root?.querySelector<HTMLElement>(".fd-stage");
    if (!root || !stage) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const html = document.documentElement;
      const bg = root.querySelector<HTMLElement>(".fd-black");
      const cards = gsap.utils.toArray<HTMLElement>(".fd-card", root);
      const thumbs = gsap.utils.toArray<HTMLElement>(".fd-thumb", root);
      thumbs.forEach((thumb, i) => gsap.set(thumb, wheelPlace[Math.min(i + 3, 4)]));

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=560%",
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            /* O menu volta ao tema claro na metade da cortina creme. */
            if (self.progress > 0.14 && self.progress < CURTAIN_AT + CURTAIN_LEN / 2) html.dataset.navTheme = "dark";
            else delete html.dataset.navTheme;
            if (bg) bg.style.opacity = self.progress > 0.14 ? "1" : "0";
          },
          onRefresh: (self) => {
            if (bg) bg.style.opacity = self.progress > 0.14 ? "1" : "0";
          },
          onLeave: () => delete html.dataset.navTheme,
          onLeaveBack: () => delete html.dataset.navTheme,
        },
      });

      tl.set(".fd-ask", { opacity: 1 }, 0.1)
        .fromTo(".fd-ask-in", { opacity: 0, scale: 0.88, filter: "blur(14px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.17, ease: "power2.out" }, 0.1)
        .to(".fd-ask-in", { opacity: 0, scale: 1.04, filter: "blur(16px)", duration: 0.07 }, 0.3)
        .fromTo(".fd-layout", { opacity: 0 }, { opacity: 1, duration: 0.06 }, CHAPTER[0]);

      cards.forEach((card, i) => {
        const at = CHAPTER[i];
        const next = CHAPTER[i + 1];
        tl.fromTo(card, { autoAlpha: 0, y: 34, filter: "blur(8px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.085, ease: "power2.out" }, at);
        if (next !== undefined) {
          tl.to(card, { autoAlpha: 0, y: -28, filter: "blur(6px)", duration: 0.055, ease: "power2.in" }, next - 0.025);
        }
        thumbs.forEach((thumb, k) => {
          const position = wheelPlace[Math.min(Math.max(k - i + 2, 0), 4)];
          tl.to(thumb, { ...position, duration: i === 0 ? 0.08 : 0.12, ease: "power2.inOut" }, at);
          tl.to(thumb.querySelector("img"),
            { filter: k === i ? "brightness(0.62)" : "brightness(0.28)", duration: i === 0 ? 0.08 : 0.12 }, at);
        });
      });
      /* A cortina creme atravessa a tela trazendo a própria cópia do último
         capítulo, já na cor da seção seguinte — o recorte revela a cópia
         exatamente sob a área tomada, sem estado intermediário. */
      gsap.utils.toArray<HTMLElement>(".fd-lthumb", root).forEach((thumb, k) => gsap.set(thumb, wheelPlace[k]));
      tl.fromTo(".fd-curtain", { clipPath: "inset(0 0 0 100%)" },
        { clipPath: "inset(0 0 0 0%)", duration: CURTAIN_LEN, ease: "power2.inOut" }, CURTAIN_AT);
      tl.to({}, { duration: 0.02 }, 0.98);
      ScrollTrigger.refresh();
      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        delete html.dataset.navTheme;
      };
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      root.classList.add("fd-still");
      ScrollTrigger.refresh();
      return () => root.classList.remove("fd-still");
    });
    return () => mm.revert();
  }, { scope });

  const last = field.chapters[field.chapters.length - 1];
  return (
    <section ref={scope} aria-label={field.headline.join(" ")} className="fd relative z-[1] -mt-[180svh] text-cream">
      <div className="fd-stage relative h-[100svh] min-h-[640px] overflow-hidden">
        <div aria-hidden className="fd-black absolute inset-0 bg-[#060606]" />
        <div className="fd-ask pointer-events-none absolute inset-0 z-[2] grid place-content-center px-[var(--spacing-gut)] text-center opacity-0">
          <div className="fd-ask-in">
            <h2 className="text-[clamp(30px,5.2vw,96px)] leading-[1.06] tracking-[-0.02em] max-[860px]:text-[clamp(32px,9.5vw,46px)]">
              {field.headline.map((line, i) => (
                <Fragment key={line}>{i > 0 && <br />}<span className="lg:whitespace-nowrap">{line}</span></Fragment>
              ))}
            </h2>
            <p className="mx-auto mt-[clamp(18px,1.7vw,32px)] max-w-[440px] text-[clamp(12px,0.95vw,16px)] text-cream/75 text-balance">{field.body}</p>
          </div>
        </div>

        <div className="fd-layout absolute inset-0 z-[3] mx-auto grid max-w-[var(--container-wrap)] grid-cols-[minmax(0,0.72fr)_minmax(0,2.5fr)_minmax(130px,0.58fr)] items-center gap-[clamp(16px,2vw,42px)] px-[var(--spacing-gut)] opacity-0 max-[900px]:grid-cols-[minmax(0,1fr)_minmax(80px,0.27fr)] max-[900px]:gap-3">
          <div className="fd-product flex justify-center max-[900px]:absolute max-[900px]:top-[clamp(28px,8svh,72px)] max-[900px]:left-[var(--spacing-gut)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/aminosan-b/cut-jug.webp" alt="Aminosan®" width={1045} height={1400} loading="lazy" decoding="async" className="h-auto w-[clamp(125px,13vw,200px)] object-contain max-[900px]:w-[clamp(58px,11vw,100px)]" />
          </div>
          <div className="fd-main relative grid h-[min(72svh,650px)] min-h-[440px] items-center max-[900px]:h-[min(70svh,650px)] max-[900px]:min-h-[380px]">
            {field.chapters.map((chapter, i) => (
              <article key={chapter.kicker} className="fd-card invisible col-start-1 row-start-1 grid grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)] items-center gap-[clamp(20px,2.5vw,50px)] max-[900px]:grid-cols-1 max-[900px]:gap-4">
                <div className="self-center max-[900px]:pl-[clamp(76px,15vw,120px)]">
                  <p className={microCaps + " flex items-center gap-3 text-sage"}>
                    {chapter.kicker}
                  </p>
                  <h3 className="mt-4 max-w-[14ch] text-[clamp(27px,3.1vw,52px)] leading-[1.02] tracking-[-0.035em] text-balance max-[900px]:mt-2 max-[900px]:text-[clamp(24px,5vw,38px)]">{chapter.heading}</h3>
                  <p className="mt-4 max-w-[36ch] text-[clamp(13px,1vw,17px)] leading-[1.5] text-cream/70 max-[900px]:mt-2">{chapter.body}</p>
                </div>
                <figure className="relative aspect-[4/5] max-h-[min(72svh,650px)] w-full max-[900px]:mx-auto max-[900px]:h-[min(42svh,360px)] max-[900px]:max-w-[420px] max-[900px]:aspect-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={"/img/aminosan-b/compare/" + IMAGES[i] + "-cutout.png"} alt={chapter.alt} width={i === 2 ? 1024 : 1121} height={i === 2 ? 1536 : 1403} loading="lazy" decoding="async" className="size-full object-contain" />
                </figure>
              </article>
            ))}
          </div>
          <div className="fd-wheel relative h-[min(70svh,620px)] min-h-[380px] overflow-hidden max-[900px]:h-[min(62svh,530px)] max-[900px]:min-h-[330px]" aria-hidden="true">
            {field.chapters.map((chapter, i) => (
              <div key={chapter.kicker} className="fd-thumb absolute top-1/2 left-0 aspect-[4/3] w-full -translate-y-1/2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={"/img/aminosan-b/compare/" + IMAGES[i] + "-cutout.png"} alt="" width={i === 2 ? 1024 : 1121} height={i === 2 ? 1536 : 1403} loading="lazy" decoding="async" className="size-full object-contain brightness-[.28]" />
              </div>
            ))}
          </div>
        </div>

        {/* Cópia clara do último capítulo, na cor da seção seguinte. */}
        <div aria-hidden className="fd-curtain pointer-events-none absolute inset-0 z-[4] bg-cream text-forest" style={{ clipPath: "inset(0 0 0 100%)" }}>
          <div className="absolute inset-0 mx-auto grid max-w-[var(--container-wrap)] grid-cols-[minmax(0,0.72fr)_minmax(0,2.5fr)_minmax(130px,0.58fr)] items-center gap-[clamp(16px,2vw,42px)] px-[var(--spacing-gut)] max-[900px]:grid-cols-[minmax(0,1fr)_minmax(80px,0.27fr)] max-[900px]:gap-3">
            <div className="flex justify-center max-[900px]:absolute max-[900px]:top-[clamp(28px,8svh,72px)] max-[900px]:left-[var(--spacing-gut)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/aminosan-b/cut-jug.webp" alt="" width={1045} height={1400} loading="lazy" decoding="async" className="h-auto w-[clamp(125px,13vw,200px)] object-contain max-[900px]:w-[clamp(58px,11vw,100px)]" />
            </div>
            <div className="relative grid h-[min(72svh,650px)] min-h-[440px] items-center max-[900px]:h-[min(70svh,650px)] max-[900px]:min-h-[380px]">
              <article className="col-start-1 row-start-1 grid grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)] items-center gap-[clamp(20px,2.5vw,50px)] max-[900px]:grid-cols-1 max-[900px]:gap-4">
                <div className="self-center max-[900px]:pl-[clamp(76px,15vw,120px)]">
                  <p className={microCaps + " flex items-center gap-3 text-olive"}>
                    {last.kicker}
                  </p>
                  <h3 className="mt-4 max-w-[14ch] text-[clamp(27px,3.1vw,52px)] leading-[1.02] tracking-[-0.035em] text-balance max-[900px]:mt-2 max-[900px]:text-[clamp(24px,5vw,38px)]">{last.heading}</h3>
                  <p className="mt-4 max-w-[36ch] text-[clamp(13px,1vw,17px)] leading-[1.5] text-forest/70 max-[900px]:mt-2">{last.body}</p>
                </div>
                <figure className="relative aspect-[4/5] max-h-[min(72svh,650px)] w-full max-[900px]:mx-auto max-[900px]:h-[min(42svh,360px)] max-[900px]:max-w-[420px] max-[900px]:aspect-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/aminosan-b/compare/roots-cutout.png" alt="" width={1024} height={1536} loading="lazy" decoding="async" className="size-full object-contain" />
                </figure>
              </article>
            </div>
            <div className="relative h-[min(70svh,620px)] min-h-[380px] overflow-hidden max-[900px]:h-[min(62svh,530px)] max-[900px]:min-h-[330px]">
              {IMAGES.map((name, i) => (
                <div key={name} className="fd-lthumb absolute top-1/2 left-0 aspect-[4/3] w-full -translate-y-1/2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={"/img/aminosan-b/compare/" + name + "-cutout.png"} alt="" width={i === 2 ? 1024 : 1121} height={i === 2 ? 1536 : 1403} loading="lazy" decoding="async" className="size-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
