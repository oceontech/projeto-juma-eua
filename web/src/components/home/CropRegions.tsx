"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, START } from "@/lib/gsap";
import { SmartLink } from "@/components/ui/SmartLink";
import { CropIcon } from "@/components/home/CropIcon";
import { useContent } from "@/components/layout/LocaleProvider";

const ROOF = "(min-width: 1100px)";
/** Meia largura do platô sob a tag, em fração da largura do conjunto. */
const PLATEAU = 0.18;
const RADIUS = 18;

type Pt = [number, number];

/** Polígono com cada canto arredondado por uma curva — sem quina seca. */
function roundedPath(pts: Pt[], r: number) {
  const n = pts.length;
  let d = "";
  pts.forEach(([x, y], i) => {
    const [px, py] = pts[(i + n - 1) % n];
    const [nx, ny] = pts[(i + 1) % n];
    const lp = Math.hypot(px - x, py - y);
    const ln = Math.hypot(nx - x, ny - y);
    const k = Math.min(r, lp / 2, ln / 2);
    const a = lp ? [x + ((px - x) / lp) * k, y + ((py - y) / lp) * k] : [x, y];
    const b = ln ? [x + ((nx - x) / ln) * k, y + ((ny - y) / ln) * k] : [x, y];
    d += `${i ? "L" : "M"}${a[0]},${a[1]} Q${x},${y} ${b[0]},${b[1]} `;
  });
  return `path('${d}Z')`;
}

/**
 * Geometria do telhado: o topo do conjunto continua as linhas de fuga do
 * corredor — plano sob a tag, descendo até as bordas externas. Cada card
 * recebe o trecho dele (`top` à esquerda e à direita) e o conteúdo começa logo
 * abaixo do ponto mais baixo desse trecho, então os cards centrais, quase
 * planos, não ficam com o alto vazio.
 */
function roofGeometry(list: HTMLElement, cards: HTMLElement[]) {
  const box = list.getBoundingClientRect();
  const rise = Math.min(130, Math.max(56, window.innerWidth * 0.068));
  const half = box.width / 2;
  const at = (x: number) =>
    rise * Math.min(1, Math.max(0, (Math.abs(x - half) - PLATEAU * box.width) / (half - PLATEAU * box.width)));
  return cards.map((card) => {
    const r = card.getBoundingClientRect();
    const left = at(r.left - box.left);
    const right = at(r.right - box.left);
    return { card, left, right, lift: Math.max(left, right) };
  });
}

/** Desenha o contorno com o topo empurrado para baixo em `drop` (0 a 1). */
function drawCard(g: ReturnType<typeof roofGeometry>[number], drop: number) {
  const w = g.card.offsetWidth;
  const h = g.card.offsetHeight;
  const tl = Math.min(h, g.left + drop * h);
  const tr = Math.min(h, g.right + drop * h);
  g.card.style.clipPath = roundedPath([[0, tl], [w, tr], [w, h], [0, h]], RADIUS);
}

/** Linhas e ícones de um card, depois que ele assenta. */
function fillCard(tl: gsap.core.Timeline, card: HTMLElement, at: gsap.Position) {
  tl.fromTo(
    card.querySelectorAll(".crop-region__row"),
    { opacity: 0, x: -12 },
    { opacity: 1, x: 0, duration: 0.5, ease: "power2.out", stagger: 0.06 },
    at,
  ).fromTo(
    card.querySelectorAll(".crop-region__icon"),
    { scale: 0.4, rotation: -12 },
    { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2.4)", stagger: 0.06 },
    "<",
  );
}

/**
 * Culturas por região. No desktop de quatro colunas o conjunto tem o topo em
 * telhado, continuando a perspectiva do corredor: ele sobe de baixo para cima
 * como uma só peça, os cards acompanham do centro para as bordas — a ordem em
 * que a fuga do corredor os revelaria — e só então as linhas entram. Nas
 * outras larguras cada card sobe sozinho.
 */
export function CropRegions() {
  const { crops } = useContent().home;
  const names = new Map(crops.cards.map((crop) => [crop.id, crop.name]));
  const scope = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const list = scope.current;
      if (!list) return;
      const cards = gsap.utils.toArray<HTMLElement>(".crop-region");
      const mm = gsap.matchMedia();

      // O telhado vale com ou sem movimento; a entrada é que depende dele.
      mm.add(ROOF, () => {
        // Quanto do topo de cada card ainda está recolhido (1 = escondido).
        const drops = cards.map(() => ({ v: 0 }));
        let geo = roofGeometry(list, cards);
        const draw = () => geo.forEach((g, i) => drawCard(g, drops[i].v));
        const layout = () => {
          const before = list.offsetHeight;
          geo = roofGeometry(list, cards);
          geo.forEach((g) => g.card.style.setProperty("--lift", `${g.lift}px`));
          draw();
          // O telhado muda a altura da seção depois da montagem; sem remedir,
          // os gatilhos abaixo (o painel de motivos) disparam atrasados.
          if (list.offsetHeight !== before) ScrollTrigger.refresh();
        };
        layout();
        const ro = new ResizeObserver(layout);
        ro.observe(list);

        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: list, start: START, once: true },
            onUpdate: draw,
          });
          // Do centro para as bordas: o contorno sobe revelando o card, e o
          // card sobe junto, como se emergisse de baixo da linha.
          [1, 2, 0, 3].forEach((i, n) => {
            if (!cards[i]) return;
            const at = n < 2 ? 0 : 0.14;
            tl.fromTo(drops[i], { v: 1 }, { v: 0, duration: 1.2, ease: "power3.out" }, at)
              .fromTo(cards[i], { y: 110 }, { y: 0, duration: 1.2, ease: "power3.out" }, at);
            fillCard(tl, cards[i], 0.6 + n * 0.1);
          });
          draw();
        }

        return () => {
          ro.disconnect();
          cards.forEach((c) => {
            c.style.clipPath = "";
            c.style.removeProperty("--lift");
          });
        };
      });

      mm.add(
        {
          stack: `not all and ${ROOF}`,
          still: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { stack, still } = context.conditions as Record<string, boolean>;
          if (still) return;

          if (!stack) return;
          cards.forEach((card, i) => {
            const tl = gsap.timeline({
              scrollTrigger: { trigger: card, start: START, once: true },
              delay: i * 0.1,
            });
            tl.fromTo(
              card,
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
            );
            fillCard(tl, card, "-=0.4");
          });
        },
      );
    },
    { scope },
  );

  return (
    <>
      <ul
        ref={scope}
        className="mx-[calc(-1*var(--spacing-gut))] mt-[clamp(28px,3vw,56px)] flex min-[1100px]:-mt-[clamp(8px,2.4vw,46px)] snap-x snap-mandatory scroll-px-gut gap-3 overflow-x-auto px-gut pb-2 [scrollbar-width:none] min-[861px]:mx-0 min-[861px]:grid min-[861px]:grid-cols-2 min-[861px]:gap-[clamp(14px,1.2vw,22px)] min-[861px]:overflow-visible min-[861px]:px-0 min-[1100px]:grid-cols-4"
      >
        {crops.regions.map((region, index) => {
          return (
            <li
              key={region.id}
              className="crop-region flex w-[84%] max-w-[360px] shrink-0 snap-start flex-col rounded-[clamp(12px,1vw,18px)] bg-linear-[149.8deg,var(--color-night-warm)_2.4%,var(--color-night-deep)_60.23%] p-[clamp(20px,1.6vw,30px)] text-offwhite min-[861px]:w-auto min-[861px]:max-w-none min-[1100px]:pt-[calc(var(--lift,0px)+clamp(20px,1.6vw,30px))]"
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className="inline-flex items-center gap-[0.7em] text-micro leading-none font-semibold tracking-[0.14em] text-lime uppercase"
                >
                  <span
                    aria-hidden
                    className="size-[6px] rounded-full bg-lime"
                  />
                  {region.tag}
                </span>
                <span
                  aria-hidden
                  className="text-micro leading-none text-muted-dark tabular-nums"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-[clamp(18px,1.6vw,30px)] text-h3 leading-tight">
                {region.name}
              </h3>
              <p
                className="mt-[0.4em] text-small leading-snug text-muted-dark"
              >
                {region.body}
              </p>

              <ul className="mt-[clamp(18px,1.6vw,28px)]">
                {region.crops.map((id) => (
                  <li
                    key={id}
                    className="crop-region__row group flex items-center gap-[14px] border-t border-offwhite/10 py-[clamp(9px,0.7vw,12px)]"
                  >
                    <span className="crop-region__icon grid size-[clamp(38px,2.7vw,48px)] shrink-0 place-items-center">
                      <CropIcon
                        id={id}
                        className="size-full transition-[scale] duration-300 group-hover:scale-110"
                      />
                    </span>
                    <span className="text-[clamp(14px,0.95vw,16px)] leading-tight font-medium transition-transform duration-300 group-hover:translate-x-1">
                      {names.get(id)}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
      <p className="mt-[clamp(16px,1.4vw,26px)] text-small text-muted">
        {crops.more.text}{" "}
        <SmartLink
          href="#us-operation"
          className="font-semibold whitespace-nowrap text-green-brand underline decoration-lime decoration-2 underline-offset-4 hover:text-green-deep"
        >
          {crops.more.cta} →
        </SmartLink>
      </p>
    </>
  );
}
