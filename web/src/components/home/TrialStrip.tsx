"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Pill, Rule, SectionIntro } from "@/components/ui";
import { trialStrip } from "@/content/home";

const trialStepImages = [
  "/img/trial-efficiency.webp",
  "/img/trial-check-strip.webp",
  "/img/trial-harvest-data.webp",
] as const;

/**
 * O método da faixa de teste, em três passos ligados por conectores.
 *
 * Os conectores são desenhados como se estivessem sendo traçados: o GSAP
 * anima o stroke-dashoffset dos SVGs conforme a seção entra. É o tipo de
 * coisa que HTML estático não fazia sem escrever o controle de scroll na mão.
 */
export function TrialStrip() {
  const root = useRef<HTMLElement>(null);
  const stepsRoot = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 861px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { animate, desktop } = context.conditions as {
            animate: boolean;
            desktop: boolean;
          };
          const badge = root.current?.querySelector<HTMLElement>("[data-trial-badge]");
          const headline = root.current?.querySelector<HTMLElement>(
            "[data-trial-headline]",
          );
          const description = root.current?.querySelector<HTMLElement>(
            "[data-trial-description]",
          );
          const introItems = [badge, headline, description].filter(
            (item): item is HTMLElement => Boolean(item),
          );
          const cards = gsap.utils.toArray<HTMLElement>("[data-step]");

          if (!animate) {
            gsap.set(introItems, { autoAlpha: 1, y: 0 });
            gsap.set(cards, { autoAlpha: 1, x: 0, y: 0, scale: 1 });
          } else {
            if (badge && headline && description) {
              gsap
                .timeline({
                  scrollTrigger: {
                    trigger: badge,
                    endTrigger: description,
                    start: "top 88%",
                    end: "bottom 18%",
                    scrub: 0.35,
                  },
                })
                .fromTo(
                  badge,
                  { autoAlpha: 0, y: 28 },
                  {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.22,
                    ease: "power3.out",
                  },
                  0,
                )
                .fromTo(
                  headline,
                  { autoAlpha: 0, y: 48 },
                  {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.28,
                    ease: "power3.out",
                  },
                  0.08,
                )
                .fromTo(
                  description,
                  { autoAlpha: 0, y: 32 },
                  {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.24,
                    ease: "power2.out",
                  },
                  0.16,
                )
                .to(badge, {
                  autoAlpha: 0,
                  y: -20,
                  duration: 0.18,
                  ease: "power2.in",
                }, 0.7)
                .to(headline, {
                  autoAlpha: 0,
                  y: -36,
                  duration: 0.24,
                  ease: "power2.in",
                }, 0.73)
                .to(description, {
                  autoAlpha: 0,
                  y: -24,
                  duration: 0.21,
                  ease: "power2.in",
                }, 0.76);
            }

            cards.forEach((card, index) => {
              const direction = desktop ? (index % 2 === 0 ? -1 : 1) : 0;

              gsap
                .timeline({
                  scrollTrigger: {
                    trigger: card,
                    start: "top 94%",
                    end: "bottom 6%",
                    scrub: 0.4,
                  },
                })
                .fromTo(
                  card,
                  {
                    autoAlpha: 0,
                    x: direction * 100,
                    y: desktop ? 28 : 48,
                    scale: 0.975,
                  },
                  {
                    autoAlpha: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 0.28,
                    ease: "power3.out",
                  },
                )
                .to(
                  card,
                  {
                    autoAlpha: 0,
                    x: direction * -70,
                    y: desktop ? -24 : -36,
                    scale: 0.985,
                    duration: 0.24,
                    ease: "power2.in",
                  },
                  0.76,
                );
            });
          }

          if (!desktop || !stepsRoot.current) return;

          const connector = stepsRoot.current.querySelector<SVGSVGElement>(
            "[data-trial-connector]",
          );
          const path = connector?.querySelector<SVGPathElement>("[data-connector-path]");
          const head = connector?.querySelector<SVGCircleElement>("[data-connector-head]");
          const dots = connector
            ? Array.from(connector.querySelectorAll<SVGGElement>("[data-connector-dot]"))
            : [];

          if (!connector || !path || !head || cards.length < 3) return;

          const positionDot = (dot: SVGGElement, x: number, y: number) => {
            dot.querySelectorAll("circle").forEach((circle) => {
              circle.setAttribute("cx", String(x));
              circle.setAttribute("cy", String(y));
            });
          };

          const updateConnectorGeometry = () => {
            const [first, second, third] = cards;
            const width = stepsRoot.current?.clientWidth ?? 0;
            const firstEnd = {
              x: first.offsetLeft + first.offsetWidth - 1,
              y: first.offsetTop + first.offsetHeight * 0.48,
            };
            const secondEntry = {
              x: width * 0.76,
              y: second.offsetTop + 1,
            };
            const secondExit = {
              x: second.offsetLeft + 1,
              y: second.offsetTop + second.offsetHeight * 0.58,
            };
            const thirdEntry = {
              x: width * 0.24,
              y: third.offsetTop + 1,
            };
            const points = [firstEnd, secondEntry, secondExit, thirdEntry];

            path.setAttribute(
              "d",
              points
                .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
                .join(" "),
            );
            dots.forEach((dot, index) => {
              const point = points[index];
              if (point) positionDot(dot, point.x, point.y);
            });
          };

          updateConnectorGeometry();

          if (!animate) {
            gsap.set(path, { strokeDasharray: "none", strokeDashoffset: 0 });
            gsap.set(dots, { opacity: 1 });
            gsap.set(head, { opacity: 0 });
            ScrollTrigger.addEventListener("refreshInit", updateConnectorGeometry);
            return () =>
              ScrollTrigger.removeEventListener("refreshInit", updateConnectorGeometry);
          }

          const progress = { value: 0 };
          const moveHead = () => {
            const length = path.getTotalLength();
            const point = path.getPointAtLength(length * progress.value);
            head.setAttribute("cx", String(point.x));
            head.setAttribute("cy", String(point.y));
          };
          const lineLength = path.getTotalLength();

          gsap.set(path, {
            strokeDasharray: lineLength,
            strokeDashoffset: lineLength,
          });
          gsap.set(dots, { opacity: 0 });
          gsap.set(head, { opacity: 0 });

          const connectorTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: stepsRoot.current,
              start: "top 72%",
              end: () =>
                `bottom ${window.innerHeight / 2 + cards[2].offsetHeight / 2 + 40}px`,
              scrub: 0.25,
              invalidateOnRefresh: true,
            },
          });

          connectorTimeline
            .fromTo(
              path,
              { strokeDashoffset: () => path.getTotalLength() },
              { strokeDashoffset: 0, duration: 1, ease: "none" },
              0,
            )
            .fromTo(
              progress,
              { value: 0 },
              { value: 1, duration: 1, ease: "none", onUpdate: moveHead },
              0,
            )
            .to(head, { opacity: 1, duration: 0.025, ease: "none" }, 0);

          const dotStops = [0, 0.31, 0.66, 0.975];
          dots.forEach((dot, index) => {
            connectorTimeline.to(
              dot,
              { opacity: 1, duration: 0.025, ease: "power1.out" },
              dotStops[index],
            );
          });

          const refreshConnector = () => {
            updateConnectorGeometry();
            const length = path.getTotalLength();
            path.style.strokeDasharray = String(length);
            moveHead();
          };

          ScrollTrigger.addEventListener("refreshInit", refreshConnector);
          return () => ScrollTrigger.removeEventListener("refreshInit", refreshConnector);
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="method"
      className="bg-white py-[clamp(70px,9.4vw,180px)] text-ink"
    >
      <div className="wrap">
        <div
          data-trial-badge
          className="mb-[clamp(20px,3.3vw,63px)] flex items-center gap-[clamp(12px,1.2vw,23px)] will-change-transform"
        >
          <Pill>{trialStrip.eyebrow}</Pill>
          <Rule short />
        </div>

        <SectionIntro
          className="mb-[clamp(34px,3.2vw,61px)]"
          aside={
            <p
              data-trial-description
              className="text-muted will-change-transform"
            >
              {trialStrip.body}
            </p>
          }
        >
          <h2
            data-trial-headline
            className="text-h2 leading-[0.967] will-change-transform"
          >
            {trialStrip.headline}
          </h2>
        </SectionIntro>

        <div
          ref={stepsRoot}
          className="relative grid gap-[22px] min-[861px]:gap-[clamp(18px,3.2vw,61px)]"
        >
          <svg
            data-trial-connector
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-1 h-full w-full overflow-visible text-lime max-[860px]:hidden"
          >
            <path
              data-connector-path
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {Array.from({ length: 4 }, (_, index) => (
              <g key={index} data-connector-dot>
                <circle r="11" fill="currentColor" />
                <circle r="7" fill="#DFED74" />
              </g>
            ))}
            <circle
              data-connector-head
              r="6"
              fill="#F6FFEE"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>

          {trialStrip.steps.map((step, i) => (
            <article
              key={step.number}
              data-step
              className={`relative z-2 w-full overflow-hidden rounded-[clamp(12px,1.05vw,20px)] bg-green-deep text-white will-change-transform min-[861px]:w-[min(670px,100%)] ${
                i === 1 ? "min-[861px]:ml-auto" : ""
              }`}
            >
              <span className="absolute top-[clamp(14px,1.05vw,20px)] left-[clamp(14px,1.05vw,20px)] z-1 rounded-full bg-green-deep/85 px-[10px] py-[7px] font-tag text-[clamp(10px,0.72vw,13px)] leading-none font-semibold tracking-[0.18em] text-offwhite/65 ring-1 ring-white/15 backdrop-blur-[2px]">
                {step.number}
              </span>
              <Image
                src={trialStepImages[i]}
                alt=""
                aria-hidden
                width={112}
                height={112}
                sizes="(max-width: 860px) calc(100vw - 40px), 670px"
                className="h-[clamp(180px,14vw,240px)] w-full object-cover"
              />
              <div className="px-[clamp(22px,2.6vw,50px)] py-[clamp(26px,2.6vw,50px)]">
                <h3 className="mb-[clamp(8px,1.05vw,20px)] text-h3 font-semibold">
                  {step.title}
                </h3>
                <p className="text-small leading-[1.56] text-offwhite">{step.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
