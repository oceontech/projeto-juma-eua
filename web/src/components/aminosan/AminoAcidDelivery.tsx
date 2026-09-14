"use client";

import { useRef } from "react";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, useGSAP } from "@/lib/gsap";

type RouteStep = { formula?: string; icon?: string; label: string };

/** Um passo da cadeia: círculo com fórmula ou ícone, rótulo embaixo. */
function StepCircle({ mobileCompact = false, step }: { mobileCompact?: boolean; step: RouteStep }) {
  const rootClassName = mobileCompact
    ? "relative z-10 flex w-[58px] shrink-0 flex-col items-center gap-2 sm:w-[86px] sm:gap-2.5"
    : "relative z-10 flex w-[76px] shrink-0 flex-col items-center gap-2.5 sm:w-[86px]";
  const circleClassName = mobileCompact
    ? "flex size-[58px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-full border border-ink/10 bg-white/80 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.08)] backdrop-blur-[2px] sm:size-[86px]"
    : "flex size-[76px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-full border border-ink/10 bg-white/80 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.08)] backdrop-blur-[2px] sm:size-[86px]";
  const iconClassName = step.formula
    ? mobileCompact
      ? "h-[18px] w-[30px] sm:h-[27px] sm:w-[42px]"
      : "h-[24px] w-[38px] sm:h-[27px] sm:w-[42px]"
    : mobileCompact
      ? "h-[28px] w-[34px] sm:h-[40px] sm:w-[48px]"
      : "h-[36px] w-[44px] sm:h-[40px] sm:w-[48px]";
  const formulaClassName = step.icon
    ? mobileCompact
      ? "text-[10px] sm:text-[13px]"
      : "text-[12px] sm:text-[13px]"
    : mobileCompact
      ? "text-[13px] sm:text-[17px]"
      : "text-[15px] sm:text-[17px]";
  const labelClassName = mobileCompact
    ? "text-center text-[10px] whitespace-nowrap text-muted sm:text-[13px]"
    : "text-center text-[12px] whitespace-nowrap text-muted sm:text-[13px]";

  return (
    <div data-route-visual="" className={rootClassName}>
      <div className={circleClassName}>
        {step.icon && (
          <span className={`relative block ${iconClassName}`}>
            <Image
              src={step.icon}
              alt=""
              fill
              sizes="42px"
              className="object-contain object-center"
            />
          </span>
        )}
        {step.formula && (
          <span className={`font-display leading-none text-muted ${formulaClassName}`}>
            {step.formula}
          </span>
        )}
      </div>
      <p className={labelClassName}>{step.label}</p>
    </div>
  );
}

/** Trilho que, no layout de referência, fica abaixo dos rótulos. */
function RouteRail({
  animateOnMobile = false,
  points = 5,
  showLineOnMobile = animateOnMobile,
}: {
  animateOnMobile?: boolean;
  points?: number;
  showLineOnMobile?: boolean;
}) {
  const rail = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const railEl = rail.current;
      if (!railEl) return;

      const line = railEl.querySelector<HTMLElement>("[data-route-line]");
      const dots = gsap.utils.toArray<HTMLElement>(
        railEl.querySelectorAll("[data-route-dot]"),
      );
      const visuals = gsap.utils.toArray<HTMLElement>(
        railEl.parentElement?.querySelectorAll("[data-route-visual]") ?? [],
      );
      if (!line || !dots.length || !visuals.length) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          visible: animateOnMobile ? "(min-width: 0px)" : "(min-width: 640px)",
        },
        (context) => {
          const { animate, visible } = context.conditions as {
            animate: boolean;
            visible: boolean;
          };

          if (!animate || !visible) {
            gsap.set(line, { opacity: 1, scaleX: 1 });
            gsap.set(dots, { opacity: 1, scale: 1, y: 0 });
            gsap.set(visuals, { opacity: 1, scale: 1, y: 0 });
            return;
          }

          gsap
            .timeline({
              scrollTrigger: {
                trigger: railEl,
                start: animateOnMobile ? "top 92%" : "top 88%",
                end: "bottom 22%",
                toggleActions: "play reverse play reverse",
              },
            })
            .fromTo(
              line,
              { opacity: 0, scaleX: 0, transformOrigin: "left center" },
              { opacity: 1, scaleX: 1, duration: 0.55, ease: "power3.out" },
              0,
            )
            .fromTo(
              dots,
              { opacity: 0, scale: 0, y: 4, transformOrigin: "center center" },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.42,
                stagger: Math.min(0.08, 0.4 / dots.length),
                ease: "power3.out",
              },
              0.12,
            )
            .fromTo(
              visuals,
              { opacity: 0, scale: 0.82, y: 12, transformOrigin: "center center" },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.5,
                stagger: Math.min(0.08, 0.4 / visuals.length),
                ease: "power3.out",
              },
              0.12,
            );
        },
      );
    },
    { scope: rail, dependencies: [animateOnMobile, points] },
  );

  return (
    <div ref={rail} aria-hidden className={`relative mt-4 h-px ${animateOnMobile ? "block" : "hidden sm:block"}`}>
      <span data-route-line="" className={`absolute inset-0 bg-ink/45 ${showLineOnMobile ? "" : "hidden sm:block"}`} />
      <span data-route-dot="" className={`absolute -top-[2px] left-0 size-[5px] rounded-full bg-ink/70 ${showLineOnMobile ? "" : "hidden sm:block"}`} />
      {Array.from({ length: points - 2 }, (_, index) => (
        <span
          key={index}
          data-route-dot=""
          className={`absolute -top-[2px] size-[5px] -translate-x-1/2 rounded-full bg-ink/70 ${showLineOnMobile ? "" : "hidden sm:block"}`}
          style={{ left: `${((index + 1) / (points - 1)) * 100}%` }}
        />
      ))}
      <span data-route-dot="" className={`absolute -top-[2px] right-0 size-[5px] rounded-full bg-ink/70 ${showLineOnMobile ? "" : "hidden sm:block"}`} />
    </div>
  );
}

export function AminoAcidDelivery() {
  const { comparison, delivery } = useContent().aminosan;

  return (
    <section
      id="delivery"
      className="aminosan-delivery-transition relative overflow-hidden py-[clamp(64px,6vw,104px)]"
    >
      <div aria-hidden className="aminosan-delivery-backdrop">
        <Image
          src="/img/aminosan/hero-aminosan-sky.png"
          alt=""
          fill
          sizes="100vw"
          className="pointer-events-none object-cover object-[center_58%] opacity-30"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-white/45" />
        <Image
          src="/img/aminosan/comparison-foliage.webp"
          alt=""
          width={2200}
          height={1076}
          sizes="100vw"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-auto w-full"
        />
      </div>

        <Reveal exit y={22} blur={8} className="wrap relative text-center">
          <p className="font-display text-[clamp(11px,0.9vw,16px)] font-semibold tracking-[0.3em] text-[#004c26] uppercase">
            {delivery.eyebrow}
          </p>
          <h2 className="mt-[clamp(10px,1.2vw,20px)] text-h2 leading-[1.1] text-ink">
            {delivery.heading[0]}
            <br className="hidden lg:block" /> {delivery.heading[1]}
          </h2>
        </Reveal>

        <div className="wrap relative mt-[clamp(42px,4vw,64px)] grid max-w-[1220px] grid-cols-1 gap-12 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch lg:gap-[clamp(48px,5vw,82px)]">
          <Reveal exit x={-40} y={18} blur={8} className="relative">
            <p className="font-display text-[clamp(16px,1.25vw,20px)] font-semibold text-lime">{delivery.longRoute.label.toUpperCase()}</p>
            <p className="mt-0.5 text-[clamp(12px,0.95vw,15px)] text-muted">{delivery.longRoute.tagline}</p>

            <div className="relative mt-6 flex flex-nowrap items-start justify-between gap-1 sm:gap-2">
              {delivery.longRoute.steps.map((step) => (
                <StepCircle key={step.label} mobileCompact step={step} />
              ))}
            </div>
            <RouteRail animateOnMobile />

            <div className="mt-5 flex items-center justify-center gap-2.5">
              <Image src="/img/aminosan/icon-loss.svg" alt="" width={15} height={15} />
              <p className="text-[clamp(12px,0.9vw,14px)] text-muted">{delivery.longRoute.result}</p>
            </div>
          </Reveal>

          <div aria-hidden className="relative top-5 -my-6 h-px w-full bg-ink/15 lg:hidden" />

          <div aria-hidden className="hidden w-px self-stretch bg-ink/10 lg:block" />

          <Reveal exit x={40} y={18} blur={8} delay={0.08} className="relative">
            <p className="font-display text-[clamp(16px,1.25vw,20px)] font-semibold text-lime">{delivery.shortRoute.label.toUpperCase()}</p>
            <p className="mt-0.5 text-[clamp(12px,0.95vw,15px)] text-muted">{delivery.shortRoute.tagline}</p>

            <div className="mt-6 flex h-[92px] flex-row items-center justify-between gap-1 sm:h-[112px] sm:gap-3">
              <div data-route-visual="" className="relative h-[68px] w-[100px] shrink-0 overflow-hidden rounded-2xl sm:h-[92px] sm:w-[184px]">
                <Image src="/img/aminosan/delivery-leaf.webp" alt="Leaf detail" fill sizes="184px" className="scale-[1.22] object-contain" />
              </div>
              <span data-route-visual="" className="flex shrink-0 items-center justify-center">
                <Image src="/img/aminosan/icon-arrow-down.svg" alt="" width={16} height={16} className="h-4 w-4 rotate-90 sm:h-5 sm:w-5" />
              </span>
              <StepCircle mobileCompact step={{ icon: "/img/aminosan/icon-free-amino-acids.svg", label: delivery.shortRoute.stepLabel }} />
              <div data-route-visual="" className="relative h-[82px] w-[100px] shrink-0 sm:h-[124px] sm:w-[170px]">
                <Image src="/img/aminosan/delivery-aminosan.webp" alt="Aminosan bottle" fill sizes="170px" className="scale-[1.22] object-contain" />
              </div>
            </div>
            <RouteRail animateOnMobile points={2} showLineOnMobile={false} />

            <div className="mt-5 flex items-center justify-center gap-2.5">
              <Image src="/img/aminosan/icon-efficiency.svg" alt="" width={15} height={15} />
              <p className="text-[clamp(12px,0.9vw,14px)] text-[#257a44]">{delivery.shortRoute.result}</p>
            </div>
          </Reveal>
        </div>

        <div className="wrap relative mt-[clamp(96px,9vw,164px)]">
          <Reveal exit y={22} blur={8} className="text-center">
            <h2 className="text-h2 text-ink">{comparison.heading}</h2>
          </Reveal>

          <Reveal
            exit
            y={18}
            delay={0.1}
            blur={6}
            stagger={0.08}
            targetSelector="[data-comparison-item]"
            className="mx-auto mt-[clamp(36px,4vw,60px)] max-w-[1025px]"
          >
            <div className="grid grid-cols-[1fr_64px_1fr] items-stretch sm:grid-cols-[1fr_100px_1fr] lg:grid-cols-[1fr_132px_1fr]">
              <div data-comparison-item="" className="flex min-h-[82px] flex-col items-center justify-center rounded-t-[14px] bg-[#0f522a] px-3 py-4 text-center text-white sm:min-h-[96px]">
                <p className="font-display text-[clamp(18px,1.5vw,26px)] font-semibold leading-none text-lime">
                  {comparison.columns.aminosan.toUpperCase()}
                </p>
                <p className="mt-1.5 text-[9px] leading-none tracking-[0.06em] uppercase opacity-90 sm:text-[11px]">{comparison.subtitles.aminosan}</p>
              </div>
              <div aria-hidden />
              <div data-comparison-item="" className="flex min-h-[82px] flex-col items-center justify-center rounded-t-[14px] bg-[#858a89] px-3 py-4 text-center text-white sm:min-h-[96px]">
                <p className="font-display text-[clamp(15px,1.35vw,23px)] font-semibold leading-none">
                  {comparison.columns.others.split(" (")[0].toUpperCase()}
                </p>
                <p className="mt-1.5 text-[9px] leading-none tracking-[0.06em] uppercase opacity-90 sm:text-[11px]">{comparison.subtitles.others}</p>
              </div>
            </div>

            <div className="relative z-10 overflow-hidden rounded-b-[14px] border border-ink/35 bg-white shadow-[0_16px_36px_-28px_rgba(0,0,0,0.45)]">
              {comparison.rows.map((row, i) => (
                <div
                  key={row.label}
                  data-comparison-item=""
                  className={`grid min-h-[82px] grid-cols-[1fr_64px_1fr] items-stretch bg-white sm:min-h-[96px] sm:grid-cols-[1fr_100px_1fr] lg:grid-cols-[1fr_132px_1fr] ${i > 0 ? "border-t border-ink/25" : ""}`}
                >
                  <p className="flex items-center justify-center px-3 text-center text-[clamp(11px,0.9vw,14px)] font-semibold text-[#0f522a] sm:px-6">
                    {row.aminosan}
                  </p>
                  <p className="flex items-center justify-center border-x border-ink/25 px-2 text-center text-[13px] font-semibold text-muted sm:text-[15px]">
                    vs.
                  </p>
                  <p className="flex items-center justify-center px-3 text-center text-[clamp(11px,0.9vw,14px)] text-muted sm:px-6">
                    {row.others}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal exit y={14} blur={5} delay={0.16} className="mt-[clamp(28px,3vw,44px)] hidden text-center sm:block">
            <p className="font-display text-[clamp(11px,0.9vw,16px)] font-semibold tracking-[0.2em] text-[#004c26] uppercase">
              {comparison.tagline}
            </p>
          </Reveal>
        </div>
    </section>
  );
}
