"use client";

/**
 * K8 — Vantagem adicional: a ação desalojante. HOLD P2.
 * Se a validação regulatória vier restritiva, apague este arquivo, a linha de
 * import e a de JSX em app/kmep/page.tsx, o trecho marcado do card 3 em
 * Operation.tsx e a pergunta correspondente em Questions.tsx. Nada mais na
 * página depende daqui.
 */

import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { SplitLines } from "@/components/motion/SplitLines";
import { gsap, useGSAP } from "@/lib/gsap";
import { eyebrow, microCaps } from "./ui";

/* O alvo, visto de cima: corpo alongado e as asas em traço. Genérico de
   propósito — um desenho técnico, não um mascote. */
const TARGET =
  "M0 -11 C3.2 -11 4.4 -6 4.4 -1 L3.4 8 L0 11 L-3.4 8 L-4.4 -1 C-4.4 -6 -3.2 -11 0 -11 Z";

/* Onde o alvo está em cada tempo, no quadro de 360 × 300 de cada painel. */
const AT: [number, number, number][] = [
  [180, 214, 0],
  [205, 92, 28],
  [292, 118, 64],
];

/* Gotas de cada painel: nas duas primeiras cenas elas batem por fora do
   cartucho; na terceira, caem na folha aberta, em volta do alvo. */
const DROPS: [number, number][][] = [
  [
    [108, 150],
    [122, 96],
    [252, 128],
    [238, 70],
    [100, 210],
  ],
  [
    [108, 150],
    [122, 96],
    [252, 128],
    [100, 210],
  ],
  [
    [270, 104],
    [306, 100],
    [322, 126],
    [258, 128],
    [284, 90],
  ],
];

/**
 * Os três tempos — abrigado, desalojado, exposto — como um roteiro de três
 * quadros lado a lado (empilhados no celular). O scroll acende um quadro de
 * cada vez e move o alvo dentro dele. A ressalva da dose fica em caixa de
 * destaque, dentro do bloco, e não em nota de rodapé.
 */
export function Flush() {
  const { flush } = useContent().kmep;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray<HTMLElement>(".fl-panel");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ".fl-panels", start: "top 75%", end: "bottom 45%", scrub: 0.6 },
        });
        panels.forEach((panel, i) => {
          const at = i;
          tl.fromTo(panel, { opacity: 0.28 }, { opacity: 1, duration: 0.4 }, at)
            .fromTo(panel.querySelector(".fl-rule"), { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "expo.out" }, at)
            .fromTo(
              panel.querySelectorAll(".fl-drop"),
              { y: -60, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power2.in" },
              at + 0.1,
            );
        });
        /* No segundo quadro o alvo sai do cartucho enquanto o quadro acende. */
        tl.fromTo(
          ".fl-move",
          { x: AT[0][0] - AT[1][0], y: AT[0][1] - AT[1][1], rotation: -AT[1][2], transformOrigin: "50% 50%" },
          { x: 0, y: 0, rotation: 0, duration: 0.9, ease: "power1.inOut" },
          1.05,
        );
      });
    },
    { scope },
  );

  return (
    <section ref={scope} data-nav-theme="dark" className="relative overflow-hidden bg-night py-sec text-offwhite">
      <div className="wrap grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-end lg:gap-16">
        <div>
          <p className={`${eyebrow} text-lime-bright`}>{flush.label}</p>
          <SplitLines className="mt-4 max-w-[16ch] text-[clamp(34px,4vw,72px)] leading-[0.97] tracking-[-0.035em] text-balance">
            {flush.heading}
          </SplitLines>
        </div>
        <p className={`${microCaps} text-[12px] text-offwhite/70`}>{flush.body}</p>
      </div>

      <ol
        className="fl-panels wrap mt-[clamp(40px,6vw,88px)] grid gap-4 md:grid-cols-3"
        aria-label={flush.alt}
      >
        {flush.stages.map((stage, i) => (
          <li
            key={stage.n}
            className="fl-panel flex flex-col rounded-[clamp(12px,1.05vw,20px)] bg-linear-[122.93deg,var(--color-night-warm)_2.4%,var(--color-night-deep)_60.23%] p-[clamp(16px,1.6vw,24px)]"
          >
            <svg viewBox="0 0 360 300" aria-hidden className="w-full">
              {/* O cartucho em corte: duas lâminas formando o funil, e o
                  abrigo escuro entre elas. */}
              <path d="M128 300 C124 210 134 120 164 34 L196 34 C226 120 236 210 232 300 Z" fill="#070709" />
              <g fill="none" stroke="#B9C2A0" strokeWidth="1.6" strokeLinecap="round">
                <path d="M128 300 C124 210 134 120 164 34" />
                <path d="M232 300 C236 210 226 120 196 34" />
                <path d="M98 300 C92 200 104 110 138 50" strokeOpacity="0.45" />
                <path d="M262 300 C268 200 256 110 222 50" strokeOpacity="0.45" />
                {/* A folha que se abre para a direita: onde o alvo fica exposto. */}
                <path d="M214 148 C258 118 310 104 356 116" strokeOpacity={i === 2 ? 1 : 0.45} />
                <path d="M214 148 C262 134 314 132 356 146" strokeOpacity={i === 2 ? 1 : 0.45} />
              </g>
              {DROPS[i].map(([x, y]) => (
                <circle key={`${x}-${y}`} className="fl-drop" cx={x} cy={y} r="4.5" fill="#EEEBE0" fillOpacity="0.85" />
              ))}
              {/* Posição por fora, giro por dentro: o movimento do segundo
                  quadro anda em linha reta, sem herdar a rotação. */}
              <g transform={`translate(${AT[i][0]} ${AT[i][1]})`}>
                <g className={i === 1 ? "fl-move" : undefined}>
                  <g transform={`rotate(${AT[i][2]})`}>
                    <path d={TARGET} fill="#F6FFEE" />
                    <path d="M-4 -1 L-11 6 M4 -1 L11 6" stroke="#F6FFEE" strokeWidth="1.2" strokeLinecap="round" />
                  </g>
                </g>
              </g>
            </svg>
            <span aria-hidden className="fl-rule mt-4 block h-[2px] w-12 origin-left rounded-full bg-lime" />
            <p className={`${microCaps} mt-4 text-lime`}>{stage.n}</p>
            <h3 className="mt-1 text-[clamp(24px,2vw,34px)] leading-[1.05] tracking-[-0.02em]">{stage.title}</h3>
            <p className={`${microCaps} mt-2 text-offwhite/65`}>{stage.body}</p>
          </li>
        ))}
      </ol>

      {/* A ressalva: obrigatória, dentro do bloco, em caixa de destaque. */}
      <div className="wrap mt-[clamp(28px,3vw,44px)]">
        <aside className="grid gap-4 rounded-[clamp(14px,1.2vw,22px)] border border-offwhite/20 bg-offwhite/[0.04] p-[clamp(20px,2.4vw,40px)] lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <p className={`${eyebrow} text-lime`}>{flush.caveatLabel}</p>
          <p className="font-display text-[clamp(20px,1.9vw,32px)] leading-[1.18] tracking-[-0.015em] text-balance">
            {flush.caveat}
          </p>
        </aside>
      </div>
    </section>
  );
}
