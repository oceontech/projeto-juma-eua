"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap, SplitText, useGSAP, START } from "@/lib/gsap";
import { useContent } from "@/components/layout/LocaleProvider";
import s from "./Programs.module.css";

const PHOTOS = [
  { src: "/img/programs/bullseye.webp", position: "62% 50%" },
  { src: "/img/programs/experience.webp", position: "50% 50%" },
  { src: "/img/programs/juma360.webp", position: "50% 42%" },
] as const;

const pad = (n: number) => String(n).padStart(2, "0");

/** Foto à esquerda, leitura em superfície própria à direita. */
export function Programs() {
  const { programs } = useContent().home;
  const [activeIndex, setActiveIndex] = useState(0);
  const root = useRef<HTMLElement>(null);
  const hasMounted = useRef(false);
  const count = programs.cards.length;
  const card = programs.cards[activeIndex];
  const photo = PHOTOS[activeIndex] ?? PHOTOS[0];

  const show = (index: number) => setActiveIndex((index + count) % count);

  useGSAP(() => {
    const section = root.current;
    if (!section) return;
    const q = gsap.utils.selector(section);
    const intro = q("[data-programs-intro]");
    const headline = q("[data-program-title]")[0];
    const photoFrame = q("[data-program-photo]")[0];
    const infoCard = q("[data-program-card]")[0];
    const copy = q("[data-program-copy]");
    const controls = q("[data-program-control]");
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      let headlineSplit: SplitText | undefined;
      if (headline) {
        headlineSplit = SplitText.create(headline, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) => gsap.from(self.lines, {
            yPercent: 108,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: headline, start: START, toggleActions: "play none none none" },
          }),
        });
      }
      gsap.fromTo(intro.filter((item) => item !== headline), { autoAlpha: 0, y: 24 }, {
        autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: section, start: START, toggleActions: "play none none none" },
      });
      gsap.timeline({ scrollTrigger: { trigger: section, start: "top 76%", toggleActions: "play none none none" } })
        .fromTo(photoFrame, { autoAlpha: 0, clipPath: "inset(8% 8% 8% 8% round 36px)", scale: 1.08, x: -28 }, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0% round 36px)", scale: 1, x: 0, duration: 1, ease: "power3.out" })
        .fromTo(infoCard, { autoAlpha: 0, clipPath: "inset(0% 12% 0% 0% round 36px)", scale: 0.88, y: 42 }, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0% round 36px)", scale: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.16)
        .fromTo(copy, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power3.out" }, 0.48)
        .fromTo(controls, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" }, 0.68);
      return () => headlineSplit?.revert();
    });
    return () => mm.revert();
  }, { scope: root });

  useEffect(() => {
    if (!hasMounted.current) { hasMounted.current = true; return; }
    const section = root.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.timeline()
        .fromTo("[data-program-image]", { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.58, ease: "power2.out" })
        .fromTo("[data-program-photo]", { scale: 0.975 }, { scale: 1, duration: 0.62, ease: "power3.out" }, 0)
        .fromTo("[data-program-copy]", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.055, ease: "power3.out" }, 0.13);
    }, section);
    return () => context.revert();
  }, [activeIndex]);

  return (
    <section ref={root} id="programs" className={s.section} data-nav-theme="dark" aria-labelledby="programs-title">
      <div className={s.wrap}>
        <header className={s.intro}>
          <h2 id="programs-title" data-program-title data-programs-intro className={s.headline}>
            {programs.headline.map((line, i) => <Fragment key={line}>{i > 0 && <br />}{line}</Fragment>)}
          </h2>
          <p data-programs-intro className={s.lede}>{programs.body}</p>
        </header>

        <div className={s.stage}>
          <div data-program-photo className={s.photoFrame}>
            <div key={photo.src} data-program-image className={s.photo}>
              <Image src={photo.src} alt="" fill sizes="(max-width: 960px) 100vw, 52vw" quality={90} className={s.image} style={{ objectPosition: photo.position }} priority={activeIndex === 0} />
            </div>
            <div className={s.photoShade} aria-hidden />
          </div>

          <article data-program-card className={s.card} aria-labelledby={`program-${card.id}`}>
            <div key={card.id} className={s.cardInner}>
              <p data-program-copy className={s.eyebrow}>{card.eyebrow}</p>
              <h3 data-program-copy id={`program-${card.id}`} className={s.title}>{card.title}</h3>
              <p data-program-copy className={s.body}>{card.body}</p>
              {card.tags && <ul data-program-copy className={s.tags}>{card.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>}
              {card.closing && <p data-program-copy className={s.closing}>{card.closing.map((line, i) => <Fragment key={line}>{i > 0 && <br />}{line}</Fragment>)}</p>}
              {card.note && <p data-program-copy className={s.note}>{card.note}</p>}
            </div>
          </article>
        </div>

        <nav className={s.controls} aria-label={programs.controlsLabel}>
          <button data-program-control type="button" className={s.arrow} onClick={() => show(activeIndex - 1)} aria-label={programs.previous}><ChevronLeft aria-hidden size={20} strokeWidth={1.7} /></button>
          <div className={s.chapterControls}>
            {programs.cards.map((program, i) => (
              <button key={program.id} data-program-control type="button" className={s.chapter} data-active={i === activeIndex || undefined} onClick={() => show(i)} aria-current={i === activeIndex ? "true" : undefined}>
                <span>{pad(i + 1)}</span><span>{program.title}</span>
              </button>
            ))}
          </div>
          <button data-program-control type="button" className={s.arrow} onClick={() => show(activeIndex + 1)} aria-label={programs.next}><ChevronRight aria-hidden size={20} strokeWidth={1.7} /></button>
        </nav>
      </div>
    </section>
  );
}
