"use client";

import { useRef, useState } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { BAND, STEPS, createRootZone, type ZoneState } from "@/lib/rootzone";
import { eyebrow, microCaps } from "./ui";

const stepAt = (p: number) => {
  let i = 0;
  while (i < STEPS.length - 2 && p >= STEPS[i + 1]) i++;
  return i;
};

/**
 * AN-01 — a raiz que pode não entregar a tempo. Substitui a foto da vagem:
 * a cena começa e termina no subsolo, sem planta nenhuma à vista.
 *
 * Presa num pin, a rolagem só anda o `progress` da cena (`lib/rootzone.ts`);
 * a simulação corre no relógio. As seis legendas trocam pela mesma régua
 * (`STEPS`), e os dois medidores leem, a cada quadro, os valores que a
 * própria cena usa para mover o potássio.
 */
export function RootZone() {
  const { zone } = useContent().kmep.potassium;
  const scope = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const demand = useRef<HTMLSpanElement>(null);
  const delivered = useRef<HTMLSpanElement>(null);
  const shortfall = useRef<HTMLSpanElement>(null);
  const dryLabels = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [still, setStill] = useState(false);

  useGSAP(
    () => {
      const el = canvas.current;
      const frame = el?.parentElement;
      const stage = scope.current;
      if (!el || !frame || !stage) return;

      const paint = (s: ZoneState) => {
        demand.current?.style.setProperty("width", `${s.demand * 100}%`);
        delivered.current?.style.setProperty("width", `${s.delivered * 100}%`);
        const gap = Math.max(0, s.demand - s.delivered);
        shortfall.current?.style.setProperty("left", `${s.delivered * 100}%`);
        shortfall.current?.style.setProperty("width", `${gap * 100}%`);
        shortfall.current?.style.setProperty("opacity", `${Math.min(1, Math.max(0, (gap - 0.12) * 4))}`);
        dryLabels.current?.style.setProperty("opacity", `${s.dry}`);
      };

      const mm = gsap.matchMedia();
      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
          desktop: "(min-width: 1024px)",
        },
        (ctx) => {
          const { animate, desktop } = ctx.conditions as { animate: boolean; desktop: boolean };
          const zoneEngine = createRootZone(el, paint);
          const measure = () => zoneEngine.resize(frame.clientWidth, frame.clientHeight);
          measure();

          if (!animate) {
            setStill(true);
            zoneEngine.still(0.8);
            const ro = new ResizeObserver(() => {
              measure();
              zoneEngine.still(0.8);
            });
            ro.observe(frame);
            return () => ro.disconnect();
          }
          setStill(false);

          /* Duas razões para parar, guardadas à parte: fora da tela e aba
             escondida. Numa flag só, voltar à aba não religava a cena. */
          let inView = false;
          const sync = () => (inView && !document.hidden ? zoneEngine.start() : zoneEngine.stop());
          const io = new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting;
            sync();
          });
          io.observe(frame);
          document.addEventListener("visibilitychange", sync);
          const ro = new ResizeObserver(measure);
          ro.observe(frame);

          ScrollTrigger.create({
            trigger: stage,
            start: "top top",
            end: desktop ? "+=300%" : "+=240%",
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              zoneEngine.setProgress(self.progress);
              setStep(stepAt(self.progress));
            },
          });

          return () => {
            zoneEngine.stop();
            io.disconnect();
            ro.disconnect();
            document.removeEventListener("visibilitychange", sync);
          };
        },
      );
    },
    { scope },
  );

  const meter = (label: string, fill: React.RefObject<HTMLSpanElement | null>, color: string, gap?: boolean) => (
    <div className="grid gap-1.5">
      <span className={`${microCaps} text-[9px] text-cream/80 lg:text-[10px]`}>{label}</span>
      <span className="relative block h-[6px] w-full overflow-hidden rounded-full bg-cream/12">
        <span ref={fill} className={`absolute inset-y-0 left-0 block rounded-full ${color}`} style={{ width: "0%" }} />
        {gap && (
          <span
            ref={shortfall}
            className="absolute inset-y-0 block bg-[repeating-linear-gradient(135deg,#CB351B_0_3px,transparent_3px_6px)]"
            style={{ opacity: 0 }}
          />
        )}
      </span>
    </div>
  );

  return (
    <div ref={scope} className="rz-stage flex min-h-[100svh] flex-col justify-center py-[clamp(28px,6svh,80px)]">
      <div className="wrap">
        <div
          role="img"
          aria-label={zone.alt}
          className="relative aspect-[4/5] max-h-[60svh] w-full overflow-hidden rounded-[4px] bg-[#2A2A1E] lg:aspect-[16/8] lg:max-h-[66svh]"
        >
          <canvas ref={canvas} className="absolute inset-0 size-full" />

          <div className="absolute inset-x-3 bottom-3 grid gap-2.5 rounded-[3px] bg-[#1C1D15]/80 p-3 backdrop-blur-[2px] lg:top-[calc(7%+10px)] lg:right-auto lg:bottom-auto lg:left-5 lg:w-[280px] lg:gap-3 lg:p-4">
            {meter(zone.meters.demand, demand, "bg-cream")}
            {meter(zone.meters.delivered, delivered, "bg-lime", true)}
          </div>

          <div ref={dryLabels} className="pointer-events-none absolute inset-0" style={{ opacity: 0 }}>
            <span className={`${microCaps} absolute top-[calc(7%+54px)] right-4 text-[9px] text-[#E0C99A] lg:top-[calc(7%+14px)] lg:right-6 lg:text-[10px]`}>
              {zone.labels.dry}
            </span>
            <span
              className={`${microCaps} absolute right-3 -translate-y-[calc(100%+6px)] rounded-[3px] bg-[#1C1D15]/80 px-2 py-1 text-[9px] text-kmep-light lg:right-5 lg:text-[10px]`}
              style={{ top: `${BAND.top * 100}%` }}
            >
              {zone.labels.compact}
            </span>
          </div>

          <div className={`${microCaps} absolute top-[calc(7%+10px)] left-3 flex gap-4 rounded-[3px] bg-[#1C1D15]/80 px-3 py-2 text-[9px] text-cream/75 lg:top-auto lg:bottom-5 lg:left-5 lg:text-[10px]`}>
            <span className="flex items-center gap-2">
              <span className="block size-[7px] rounded-full bg-lime" />
              {zone.legend.k}
            </span>
            <span className="flex items-center gap-2">
              <span className="block h-[1.5px] w-4 bg-[#C4DDD6]" />
              {zone.legend.water}
            </span>
          </div>
        </div>

        {still ? (
          <ol className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {zone.steps.map((s, k) => (
              <li key={s.title}>
                <p className={`${eyebrow} text-[10px] text-moss`}>{String(k + 1).padStart(2, "0")}</p>
                <p className="mt-1 font-display text-[clamp(18px,1.5vw,24px)] leading-[1.1] tracking-[-0.01em]">{s.title}</p>
                <p className="mt-1.5 text-[14px] leading-[1.45] text-forest/75">{s.body}</p>
              </li>
            ))}
          </ol>
        ) : (
          <div className="mt-[clamp(16px,3svh,32px)] grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-16">
            <ol className="grid grid-cols-6 gap-1.5 self-start lg:gap-3">
              {zone.steps.map((s, k) => (
                <li key={s.title} className="grid gap-2">
                  <span className="relative block h-[2px] bg-forest/12">
                    <span
                      className="absolute inset-0 origin-left bg-olive transition-transform duration-500"
                      style={{ transform: `scaleX(${k <= step ? 1 : 0})` }}
                    />
                  </span>
                  <span
                    className={`${eyebrow} hidden text-[10px] transition-colors duration-500 lg:block ${k === step ? "text-forest" : "text-forest/40"}`}
                  >
                    {String(k + 1).padStart(2, "0")} · {s.title}
                  </span>
                </li>
              ))}
            </ol>
            <div className="relative min-h-[118px] lg:min-h-[130px]">
              {zone.steps.map((s, k) => (
                <div
                  key={s.title}
                  aria-hidden={k !== step}
                  className={`absolute inset-x-0 top-0 transition-[opacity,transform] duration-500 ${k === step ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
                >
                  <p className={`${eyebrow} text-[10px] text-moss`}>
                    {String(k + 1).padStart(2, "0")} / {String(zone.steps.length).padStart(2, "0")}
                  </p>
                  <p className="mt-1.5 font-display text-[clamp(20px,1.8vw,30px)] leading-[1.08] tracking-[-0.015em]">{s.title}</p>
                  <p className="mt-2 text-[14px] leading-[1.45] text-forest/75 lg:text-[15px]">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
