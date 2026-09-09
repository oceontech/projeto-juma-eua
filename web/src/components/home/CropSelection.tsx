"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP, START } from "@/lib/gsap";
import { Rule, SectionIntro } from "@/components/ui";
import { crops } from "@/content/home";

const CARDS = crops.cards;
const CENTER = Math.floor(CARDS.length / 2);
const SECONDS_PER_CARD = 5;
const DRAG_THRESHOLD = 7;
const INERTIA_MS = 180;

const DESKTOP_GEOMETRY = {
  x: [0, 63, 126, 158],
  y: [0, 2, 6, 9],
  rotation: [0, 7.08, 15.42, 19.5],
  scale: [1, 0.852, 0.765, 0.72],
};

const MOBILE_GEOMETRY = {
  x: [0, 74, 160, 205],
  y: [0, 3, 5, 7],
  rotation: [0, 0, 0, 0],
  scale: [1, 0.82, 0.74, 0.7],
};

function interpolate(values: number[], distance: number) {
  const index = Math.min(Math.floor(distance), values.length - 2);
  const progress = distance - index;
  return values[index] + (values[index + 1] - values[index]) * progress;
}

/**
 * Leque de culturas em movimento contínuo. Cada carta percorre a mesma
 * esteira, desaparece na borda e retorna pelo lado oposto sem um salto
 * visível.
 */
export function CropSelection() {
  const section = useRef<HTMLElement>(null);
  const fan = useRef<HTMLDivElement>(null);
  const focusCrop = useRef<(index: number) => void>(() => undefined);
  const setConveyorPaused = useRef<(paused: boolean) => void>(() => undefined);
  const [active, setActive] = useState(CENTER);
  const [hovered, setHovered] = useState<number | null>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".crop-card");
      const entrances = gsap.utils.toArray<HTMLElement>(".crop-card__entrance");
      const intro = section.current!.querySelector<HTMLElement>(".crop-intro")!;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mobile = window.matchMedia("(max-width: 860px)");
      const phase = { value: CENTER };
      const fanBounds = fan.current!.getBoundingClientRect();
      let activeIndex = CENTER;
      let conveyorVisible = fanBounds.top < window.innerHeight && fanBounds.bottom > 0;
      let interactionPaused = false;
      let conveyor: gsap.core.Tween | null = null;
      let selectionTween: gsap.core.Tween | null = null;
      let dragPointerId: number | null = null;
      let dragStartX = 0;
      let dragStartY = 0;
      let dragStartPhase = CENTER;
      let dragCardStride = 1;
      let lastPointerX = 0;
      let lastPointerTime = 0;
      let pointerVelocity = 0;
      let dragLocked = false;
      let suppressClick = false;
      let suppressClickTimer: number | null = null;

      const renderConveyor = () => {
        const geometry = mobile.matches ? MOBILE_GEOMETRY : DESKTOP_GEOMETRY;

        cards.forEach((card, index) => {
          // Mantém cada card no intervalo -2.5…2.5. Nas duas extremidades a
          // opacidade chega a zero, ocultando a troca de lado da esteira.
          const position = gsap.utils.wrap(
            -CARDS.length / 2,
            CARDS.length / 2,
            index - phase.value,
          );
          const distance = Math.abs(position);
          const direction = Math.sign(position) || 1;
          const edgeOpacity = 1 - Math.max(0, distance - 2) * 2;

          card.style.setProperty(
            "--dx",
            `${interpolate(geometry.x, distance) * direction}%`,
          );
          card.style.setProperty("--dy", `${interpolate(geometry.y, distance)}%`);
          card.style.setProperty(
            "--rot",
            `${interpolate(geometry.rotation, distance) * direction}deg`,
          );
          card.style.setProperty("--sc", `${interpolate(geometry.scale, distance)}`);
          card.style.opacity = `${Math.max(0, edgeOpacity)}`;
          card.style.zIndex =
            card.dataset.hovered === "true"
              ? "10"
              : `${3 - Math.min(2, Math.floor(distance + 0.5))}`;
        });

        const nextActive =
          ((Math.round(phase.value) % CARDS.length) + CARDS.length) % CARDS.length;

        if (nextActive !== activeIndex) {
          activeIndex = nextActive;
          setActive(nextActive);
        }
      };

      const startConveyor = () => {
        conveyor?.kill();
        conveyor = gsap.to(phase, {
          value: phase.value + CARDS.length,
          duration: CARDS.length * SECONDS_PER_CARD,
          ease: "none",
          repeat: -1,
          paused: !conveyorVisible || interactionPaused,
          onUpdate: renderConveyor,
        });
      };

      renderConveyor();

      setConveyorPaused.current = (paused) => {
        interactionPaused = paused;

        if (paused || !conveyorVisible) {
          conveyor?.pause();
          selectionTween?.pause();
          return;
        }

        if (selectionTween) {
          selectionTween.play();
        } else {
          conveyor?.play();
        }
      };

      focusCrop.current = (index) => {
        const current =
          ((phase.value % CARDS.length) + CARDS.length) % CARDS.length;
        const distance = gsap.utils.wrap(
          -CARDS.length / 2,
          CARDS.length / 2,
          index - current,
        );

        conveyor?.kill();
        selectionTween?.kill();

        if (reduceMotion) {
          phase.value += distance;
          renderConveyor();
          return;
        }

        selectionTween = gsap.to(phase, {
          value: phase.value + distance,
          duration: Math.max(0.8, Math.abs(distance) * 1.1),
          ease: "power2.inOut",
          paused: interactionPaused,
          onUpdate: renderConveyor,
          onComplete: () => {
            selectionTween = null;
            startConveyor();
          },
        });
      };

      const resumeConveyor = () => {
        interactionPaused = false;

        if (!conveyorVisible || reduceMotion) return;

        if (selectionTween) {
          selectionTween.play();
        } else {
          conveyor?.play();
        }
      };

      const handlePointerDown = (event: PointerEvent) => {
        if (!mobile.matches || !event.isPrimary || event.button !== 0) return;

        dragPointerId = event.pointerId;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        dragStartPhase = phase.value;
        lastPointerX = event.clientX;
        lastPointerTime = event.timeStamp;
        pointerVelocity = 0;
        dragLocked = false;
        suppressClick = false;
        interactionPaused = true;
        conveyor?.pause();
        selectionTween?.kill();
        selectionTween = null;

        const cardWidth = cards[0]?.offsetWidth ?? 0;
        dragCardStride = Math.max(1, cardWidth * (MOBILE_GEOMETRY.x[1] / 100));
        fan.current?.setPointerCapture(event.pointerId);
      };

      const handlePointerMove = (event: PointerEvent) => {
        if (event.pointerId !== dragPointerId) return;

        const deltaX = event.clientX - dragStartX;
        const deltaY = event.clientY - dragStartY;

        if (!dragLocked) {
          if (Math.abs(deltaX) < DRAG_THRESHOLD) return;

          if (Math.abs(deltaY) > Math.abs(deltaX)) return;

          dragLocked = true;
          fan.current?.setAttribute("data-dragging", "true");
        }

        event.preventDefault();

        const elapsed = Math.max(1, event.timeStamp - lastPointerTime);
        const instantVelocity = (event.clientX - lastPointerX) / elapsed;
        pointerVelocity = pointerVelocity * 0.65 + instantVelocity * 0.35;
        lastPointerX = event.clientX;
        lastPointerTime = event.timeStamp;
        phase.value = dragStartPhase - deltaX / dragCardStride;
        renderConveyor();
      };

      const finishDrag = (event: PointerEvent) => {
        if (event.pointerId !== dragPointerId) return;

        const pointerId = dragPointerId;
        dragPointerId = null;
        fan.current?.removeAttribute("data-dragging");

        if (fan.current?.hasPointerCapture(pointerId)) {
          fan.current.releasePointerCapture(pointerId);
        }

        if (!dragLocked) {
          resumeConveyor();
          return;
        }

        suppressClick = true;
        if (suppressClickTimer !== null) window.clearTimeout(suppressClickTimer);
        suppressClickTimer = window.setTimeout(() => {
          suppressClick = false;
        }, 300);

        const inertia = Math.max(
          -1.25,
          Math.min(1.25, (-pointerVelocity * INERTIA_MS) / dragCardStride),
        );
        const destination = Math.round(phase.value + inertia);

        interactionPaused = false;

        if (reduceMotion) {
          phase.value = destination;
          renderConveyor();
          return;
        }

        selectionTween = gsap.to(phase, {
          value: destination,
          duration: Math.min(0.55, 0.24 + Math.abs(destination - phase.value) * 0.18),
          ease: "power3.out",
          onUpdate: renderConveyor,
          onComplete: () => {
            selectionTween = null;
            startConveyor();
          },
        });
      };

      const preventClickAfterDrag = (event: MouseEvent) => {
        if (!suppressClick) return;

        event.preventDefault();
        event.stopPropagation();
        suppressClick = false;
      };

      const fanElement = fan.current!;
      fanElement.addEventListener("pointerdown", handlePointerDown);
      fanElement.addEventListener("pointermove", handlePointerMove, { passive: false });
      fanElement.addEventListener("pointerup", finishDrag);
      fanElement.addEventListener("pointercancel", finishDrag);
      fanElement.addEventListener("click", preventClickAfterDrag, true);

      if (reduceMotion) {
        gsap.set([intro, ...entrances], { opacity: 1, y: 0, scale: 1 });
      } else {
        const entrance = gsap
          .timeline({ paused: true })
          .fromTo(
            intro,
            { opacity: 0, y: 22 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
            },
          )
          .fromTo(
            entrances,
            { opacity: 0, y: 52, scale: 0.94 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.72,
              ease: "power3.out",
              stagger: { each: 0.08, from: "center" },
            },
            "-=0.28",
          );

        ScrollTrigger.create({
          trigger: section.current,
          start: START,
          onEnter: () => entrance.play(),
          onLeaveBack: () => entrance.reverse(),
        });

        ScrollTrigger.create({
          trigger: fan.current,
          start: "bottom 48%",
          onEnter: () => entrance.reverse(),
          onLeaveBack: () => entrance.play(),
        });

        startConveyor();
      }

      ScrollTrigger.create({
        trigger: fan.current,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => {
          conveyorVisible = true;
          if (!interactionPaused) {
            if (selectionTween) {
              selectionTween.play();
            } else {
              conveyor?.play();
            }
          }
        },
        onEnterBack: () => {
          conveyorVisible = true;
          if (!interactionPaused) {
            if (selectionTween) {
              selectionTween.play();
            } else {
              conveyor?.play();
            }
          }
        },
        onLeave: () => {
          conveyorVisible = false;
          conveyor?.pause();
          selectionTween?.pause();
        },
        onLeaveBack: () => {
          conveyorVisible = false;
          conveyor?.pause();
          selectionTween?.pause();
        },
      });

      return () => {
        conveyor?.kill();
        selectionTween?.kill();
        if (suppressClickTimer !== null) window.clearTimeout(suppressClickTimer);
        fanElement.removeEventListener("pointerdown", handlePointerDown);
        fanElement.removeEventListener("pointermove", handlePointerMove);
        fanElement.removeEventListener("pointerup", finishDrag);
        fanElement.removeEventListener("pointercancel", finishDrag);
        fanElement.removeEventListener("click", preventClickAfterDrag, true);
        focusCrop.current = () => undefined;
        setConveyorPaused.current = () => undefined;
      };
    },
    { scope: section },
  );

  return (
    /* As cartas das pontas saem da caixa de propósito — o corte tem de ficar
       aqui, senão a página ganha rolagem horizontal. */
    <section ref={section} id="crops" className="relative overflow-hidden bg-white pt-sec">
      <div className="wrap">
        <div className="crop-intro">
          <SectionIntro
            aside={<p className="text-muted">{crops.body}</p>}
          >
            <Rule className="mb-[clamp(18px,1.8vw,33px)]" />
            <h2 className="max-w-[480px] text-h2 leading-[0.967] text-ink">
              {crops.headline}
            </h2>
          </SectionIntro>
        </div>

        <div
          ref={fan}
          className="fan mt-[clamp(24px,1.9vw,36px)]"
          role="region"
          aria-roledescription="carousel"
          aria-label="Supported crops. Swipe horizontally on touch screens or select a crop."
        >
          {CARDS.map((crop, i) => (
            <article
              key={crop.id}
              className="crop-card"
              data-pos={i}
              data-center={i === active ? "true" : undefined}
              data-hovered={hovered === i ? "true" : undefined}
              aria-current={i === active ? "true" : undefined}
              tabIndex={0}
              aria-label={`Show ${crop.name}`}
              onMouseEnter={() => {
                setHovered(i);
                setConveyorPaused.current(true);
              }}
              onMouseLeave={() => {
                setHovered(null);
                setConveyorPaused.current(false);
              }}
              onFocus={() => {
                setHovered(i);
                setConveyorPaused.current(true);
              }}
              onBlur={() => {
                setHovered(null);
                setConveyorPaused.current(false);
              }}
              onClick={() => focusCrop.current(i)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  focusCrop.current(i);
                }
              }}
            >
              <div className="crop-card__entrance">
                <div className="crop-card__surface">
                  <div
                    className="crop-card__media"
                    style={{ backgroundImage: `url(${crop.image})` }}
                  />
                  <span className="crop-card__label absolute top-[5.3%] right-[6%] z-2 rounded-full bg-white px-[1.15em] py-[0.72em] text-[clamp(6px,0.62vw,12px)] leading-none font-semibold tracking-[0.15em] text-[#0E0E0D] uppercase">
                    {crop.name}
                  </span>
                  <div className="crop-card__content absolute bottom-[8%] left-[7%] z-2 right-[7%] text-offwhite">
                    <h3 className="text-[clamp(13px,1.68vw,32px)] font-semibold">
                      {crop.name}
                    </h3>
                    <p className="mt-[0.5em] text-[clamp(8px,0.95vw,18px)] leading-[1.5] font-light">
                      {crop.body}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* O Figma usa só a faixa central da foto; o resto é névoa. */}
      <div className="relative mt-[28px] aspect-[444/250] overflow-hidden bg-white min-[861px]:mt-0 min-[861px]:aspect-[1918/629]">
        <Image
          src="/img/crop-field.webp"
          alt=""
          aria-hidden
          width={2880}
          height={945}
          quality={100}
          sizes="100vw"
          loading="eager"
          className="h-full w-full object-[center_62%] object-cover min-[861px]:object-center"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%] bg-linear-to-b from-transparent via-white/70 to-white"
        />
      </div>
    </section>
  );
}
