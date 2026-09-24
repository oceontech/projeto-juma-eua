"use client";

import { Fragment, useRef } from "react";
import { useContent, useLocale } from "@/components/layout/LocaleProvider";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { microCaps } from "./ui";

const CHAPTER = [0.36, 0.58, 0.78];
const PLANT = "/img/kmep/blackout/corn-continuous.webp";

export function Blackout({ variant = "a" }: { variant?: "a" | "b" }) {
  const content = useContent().kmep;
  const locale = useLocale();
  const blackout = variant === "b" ? content.blackoutB : content.blackoutA;
  const scope = useRef<HTMLElement>(null);

  useGSAP(() => {
    const root = scope.current;
    const stage = root?.querySelector<HTMLElement>(".fd-stage");
    if (!root || !stage) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const html = document.documentElement;
      const bg = root.querySelector<HTMLElement>(".fd-black");
      const plant = root.querySelector<HTMLElement>(".fd-plant");
      const cards = gsap.utils.toArray<HTMLElement>(".fd-card", root);
      if (!plant) return;

      const narrow = window.matchMedia("(max-width: 900px)").matches;
      gsap.set(plant, { yPercent: 20, autoAlpha: 0 });

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
            if (self.progress > 0.14) html.dataset.navTheme = "dark";
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
      });

      tl.to(plant, { yPercent: 0, autoAlpha: 1, duration: 0.12, ease: "power2.out" }, CHAPTER[0])
        .to(plant, { yPercent: narrow ? -20 : -25, duration: 0.15, ease: "power2.inOut" }, CHAPTER[1])
        .to(plant, { yPercent: -65, duration: 0.06, ease: "power2.inOut" }, CHAPTER[2])
        .to({}, { duration: 0.02 }, 0.98);

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

  const plantAlt = locale === "pt"
    ? "Planta de milho com gotas nas folhas, espiga e raízes expostas"
    : "Corn plant with droplets on its leaves, an ear, and exposed roots";

  return (
    <section ref={scope} aria-label={blackout.headline.join(" ")} className="fd relative z-[1] -mt-[180svh] text-cream">
      <div className="fd-stage relative h-[100svh] min-h-[640px] overflow-hidden">
        <div aria-hidden className="fd-black absolute inset-0 bg-[#060606]" />
        <div className="fd-ask pointer-events-none absolute inset-0 z-[2] grid place-content-center px-[var(--spacing-gut)] text-center opacity-0">
          <div className="fd-ask-in">
            <h2 className="text-[clamp(30px,4.8vw,88px)] leading-[1.06] tracking-[-0.02em] text-balance max-[860px]:text-[clamp(30px,8.6vw,44px)]">
              {blackout.headline.map((line, i) => (
                <Fragment key={line}>{i > 0 && " "}<span className="lg:block lg:whitespace-nowrap">{line}</span></Fragment>
              ))}
            </h2>
            <p className="mx-auto mt-[clamp(18px,1.7vw,32px)] max-w-[440px] text-[clamp(12px,0.95vw,16px)] text-cream/75 text-balance">{blackout.body}</p>
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PLANT} alt={plantAlt} width={1024} height={1536} loading="lazy" decoding="async" className="fd-plant absolute z-[2]" />

        <div className="fd-layout absolute inset-0 z-[3] mx-auto grid max-w-[var(--container-wrap)] grid-cols-[minmax(0,0.72fr)_minmax(0,2.5fr)] items-center gap-[clamp(16px,2vw,42px)] px-[var(--spacing-gut)] opacity-0 max-[900px]:grid-cols-1">
          <div className="fd-product flex justify-center max-[900px]:absolute max-[900px]:top-[clamp(28px,8svh,72px)] max-[900px]:left-[var(--spacing-gut)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/pack-kmep-us.webp" alt="KMEP Ultra®" width={1280} height={1280} loading="lazy" decoding="async" className="h-auto w-[clamp(125px,13vw,200px)] object-contain max-[900px]:w-[clamp(58px,11vw,100px)]" />
          </div>
          <div className="fd-main relative grid h-[min(72svh,650px)] min-h-[440px] items-center max-[900px]:h-[min(70svh,650px)] max-[900px]:min-h-[380px]">
            {blackout.chapters.map((chapter) => (
              <article key={chapter.kicker} className="fd-card invisible col-start-1 row-start-1 max-w-[min(32vw,480px)] max-[900px]:max-w-[55vw]">
                <p className={microCaps + " flex items-center gap-3 text-sage"}>{chapter.kicker}</p>
                <h3 className="mt-4 max-w-[16ch] text-[clamp(27px,3.1vw,52px)] leading-[1.02] tracking-[-0.035em] text-balance max-[900px]:mt-2 max-[900px]:text-[clamp(24px,5vw,38px)]">{chapter.heading}</h3>
                <p className="mt-4 max-w-[40ch] text-[clamp(13px,1vw,17px)] leading-[1.5] text-cream/70 max-[900px]:mt-2">{chapter.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
