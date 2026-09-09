"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, START } from "@/lib/gsap";
import { SectionIntro } from "@/components/ui";
import { programs } from "@/content/home";

const CARD =
  "programs-card relative overflow-hidden rounded-[clamp(16px,1.55vw,30px)] bg-linear-[149.8deg,var(--color-night-warm)_2.4%,var(--color-night-deep)_60.23%] text-white";

/** As três frentes que rodam o ano todo: pesquisa, portas abertas e time. */
export function Programs() {
  const [desata, experience, juma360] = programs.cards;
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const introTitle = section.querySelector(".programs-intro__title");
      const introCopy = section.querySelector(".programs-intro__copy");

      const cardDesata = section.querySelector<HTMLElement>('[data-card="desata"]');
      const cardExp = section.querySelector<HTMLElement>('[data-card="experience"]');
      const card360 = section.querySelector<HTMLElement>('[data-card="juma360"]');

      if (!cardDesata || !cardExp || !card360) return;

      const cards = [cardDesata, cardExp, card360];

      // Card 1 internal items
      const desataOrbit = cardDesata.querySelector(".programs-card__orbit-inner");
      const desataEyebrow = cardDesata.querySelector(".programs-card__eyebrow");
      const desataTitle = cardDesata.querySelector(".programs-card__title");
      const desataCopy = cardDesata.querySelector(".programs-card__copy");
      const desataTags = cardDesata.querySelectorAll(".programs-card__tag");
      const desataMeta = cardDesata.querySelector(".programs-card__meta");

      // Card 2 internal items
      const expEyebrow = cardExp.querySelector(".programs-card__eyebrow");
      const expTitle = cardExp.querySelector(".programs-card__title");
      const expCopy = cardExp.querySelector(".programs-card__copy");
      const expClosing = cardExp.querySelector(".programs-card__closing");

      // Card 3 internal items
      const jumaGlobe = card360.querySelector(".programs-card__globe-inner");
      const jumaEyebrow = card360.querySelector(".programs-card__eyebrow");
      const jumaTitle = card360.querySelector(".programs-card__title");
      const jumaCopy = card360.querySelector(".programs-card__copy");
      const jumaMeta = card360.querySelector(".programs-card__meta");

      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { animate } = context.conditions as { animate: boolean };

          if (!animate) {
            gsap.set(
              [
                introTitle,
                introCopy,
                ...cards,
                desataOrbit,
                desataEyebrow,
                desataTitle,
                desataCopy,
                desataMeta,
                ...desataTags,
                expEyebrow,
                expTitle,
                expCopy,
                expClosing,
                jumaGlobe,
                jumaEyebrow,
                jumaTitle,
                jumaCopy,
                jumaMeta,
              ].filter(Boolean),
              { opacity: 1, y: 0, x: 0, scale: 1, rotate: 0 }
            );
            return;
          }

          // Initial state: hide inner items so they only appear after each card lands
          gsap.set(
            [
              desataOrbit,
              desataEyebrow,
              desataTitle,
              desataCopy,
              desataMeta,
              ...desataTags,
              expEyebrow,
              expTitle,
              expCopy,
              expClosing,
              jumaGlobe,
              jumaEyebrow,
              jumaTitle,
              jumaCopy,
              jumaMeta,
            ].filter(Boolean),
            { opacity: 0 }
          );

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: START,
              /* A mesma timeline faz os dois sentidos: entra tocando e sai
                 rebobinando. O fim dispara enquanto a seção ainda mantém uma
                 faixa visível, para a saída não acontecer fora da tela. */
              end: "bottom 22%",
              toggleActions: "play reverse play reverse",
            },
          });

          // 1. Intro Section Header Entrance
          tl.fromTo(
            [introTitle, introCopy].filter(Boolean),
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.08,
              ease: "power3.out",
            },
            0
          );

          // 2. Bento Cards Entrance - Staggered Slide In with Opacity Gain
          // Card 1 (DESATA): starts at 0.15s
          tl.fromTo(
            cardDesata,
            { opacity: 0, y: 48, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.72,
              ease: "power3.out",
            },
            0.15
          );

          // Card 1 Inner Components: cascade in after Card 1 arrives into position
          if (desataOrbit) {
            tl.fromTo(
              desataOrbit,
              { opacity: 0, scale: 0.76, rotate: -22 },
              {
                opacity: 0.75,
                scale: 1,
                rotate: 0,
                duration: 0.65,
                ease: "power3.out",
              },
              0.52
            );
          }

          tl.fromTo(
            [desataEyebrow, desataTitle, desataCopy].filter(Boolean),
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.48,
              stagger: 0.07,
              ease: "power3.out",
            },
            0.58
          );

          if (desataTags.length > 0) {
            tl.fromTo(
              desataTags,
              { opacity: 0, y: 12, scale: 0.9 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.42,
                stagger: 0.05,
                ease: "back.out(1.2)",
              },
              0.74
            );
          }

          if (desataMeta) {
            tl.fromTo(
              desataMeta,
              { opacity: 0, y: 10 },
              {
                opacity: 1,
                y: 0,
                duration: 0.45,
                ease: "power3.out",
              },
              0.84
            );
          }

          // Card 2 (Juma Experience): starts at 0.35s
          tl.fromTo(
            cardExp,
            { opacity: 0, y: 48, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.72,
              ease: "power3.out",
            },
            0.35
          );

          // Card 2 Inner Components: cascade in after Card 2 arrives into position
          tl.fromTo(
            [expEyebrow, expTitle, expCopy].filter(Boolean),
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.48,
              stagger: 0.07,
              ease: "power3.out",
            },
            0.72
          );

          if (expClosing) {
            tl.fromTo(
              expClosing,
              { opacity: 0, y: 14 },
              {
                opacity: 1,
                y: 0,
                duration: 0.55,
                ease: "power3.out",
              },
              0.9
            );
          }

          // Card 3 (Juma 360): starts at 0.55s
          tl.fromTo(
            card360,
            { opacity: 0, y: 48, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.72,
              ease: "power3.out",
            },
            0.55
          );

          // Card 3 Inner Components: cascade in after Card 3 arrives into position
          if (jumaGlobe) {
            tl.fromTo(
              jumaGlobe,
              { opacity: 0, x: 42, scale: 0.88 },
              {
                opacity: 0.58,
                x: 0,
                scale: 1,
                duration: 0.75,
                ease: "power3.out",
              },
              0.88
            );
          }

          tl.fromTo(
            [jumaEyebrow, jumaTitle, jumaCopy].filter(Boolean),
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.48,
              stagger: 0.07,
              ease: "power3.out",
            },
            0.92
          );

          if (jumaMeta) {
            tl.fromTo(
              jumaMeta,
              { opacity: 0, y: 10 },
              {
                opacity: 1,
                y: 0,
                duration: 0.45,
                ease: "power3.out",
              },
              1.08
            );
          }
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="programs" className="programs-section relative -mt-px bg-white">
      <div className="programs-wrap wrap">
        <div className="programs-intro-wrap">
          <SectionIntro
            className="programs-intro"
            aside={<p className="programs-intro__copy text-muted">{programs.body}</p>}
          >
            <h2 className="programs-intro__title text-h2 leading-[0.967] text-ink">
              {programs.headline.map((line, i) => (
                <Fragment key={line}>
                  {i > 0 && <br />}
                  {line}
                </Fragment>
              ))}
            </h2>
          </SectionIntro>
        </div>

        <div className="programs-grid">
          <article
            data-card="desata"
            className={`${CARD} programs-card--desata`}
          >
            <div
              aria-hidden
              className="programs-card__orbit"
            >
              <div className="programs-card__orbit-inner h-full w-full">
                <Image
                  src="/img/orbit.svg"
                  alt=""
                  width={420}
                  height={360}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <ProgramBody program={desata} />
          </article>

          <article data-card="experience" className={`${CARD} programs-card--experience`}>
            <ProgramBody program={experience} />
          </article>

          <article data-card="juma360" className={`${CARD} programs-card--juma360`}>
            <div className="programs-card__globe pointer-events-none absolute">
              <div className="programs-card__globe-inner h-full w-full">
                <Image
                  src="/img/globe.svg"
                  alt=""
                  aria-hidden
                  width={420}
                  height={420}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <ProgramBody program={juma360} />
          </article>
        </div>
      </div>
    </section>
  );
}

function ProgramBody({ program }: { program: (typeof programs.cards)[number] }) {
  return (
    <div className="programs-card__body relative flex min-w-0 flex-1 flex-col">
      <p className="programs-card__eyebrow font-display tracking-[0.1em] text-lime-bright uppercase">
        {program.eyebrow}
      </p>

      <h3 className="programs-card__title font-semibold">{program.title}</h3>

      <p className="programs-card__copy text-muted-dark">{program.body}</p>

      {program.tags && (
        <div className="programs-card__tags flex flex-wrap">
          {program.tags.map((tag) => (
            <span
              key={tag}
              className="programs-card__tag rounded-full border-[1.3px] border-line-night font-tag leading-[1.5]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {program.closing && (
        <p className="programs-card__meta programs-card__closing font-display leading-[1.46] text-lime-bright uppercase">
          {program.closing.map((line, i) => (
            <Fragment key={line}>
              {i > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </p>
      )}

      {program.note && (
        <p className="programs-card__meta programs-card__note font-display tracking-[0.02em] text-muted-dark uppercase">
          {program.note}
        </p>
      )}
    </div>
  );
}
