"use client";

/**
 * K8 — Trabalho 2, a vantagem adicional: a ação desalojante. HOLD P2.
 * Desde 24/09/2026 vem logo depois do potássio (K7), como o segundo trabalho
 * da mesma passada.
 * Se a validação regulatória vier restritiva, apague este arquivo e a linha
 * de import e a de JSX em app/kmep/page.tsx e app/kmep-b/page.tsx; tire o
 * card 3 de `operation`, os `hold` de `hero`, `heroB` e `questions`, e o
 * cartão `flush` do `twoJobs` (em content/kmep.ts e no espelho pt/), e o
 * cartão do trabalho 2 em TwoJobs.tsx.
 */

import { useRef, type CSSProperties } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { SplitLines } from "@/components/motion/SplitLines";
import { gsap, useGSAP } from "@/lib/gsap";
import { eyebrow, microCaps, microText } from "./ui";

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

        /* Mesma entrada dos cards do Aminosan: cada card sobe e aparece
           conforme atravessa a viewport, nos dois sentidos do scroll. */
        panels.forEach((panel, i) => {
          gsap.fromTo(
            panel,
            { y: 220 + i * 90, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              ease: "power2.out",
              scrollTrigger: { trigger: panel, start: "top bottom", end: "top 55%", scrub: 0.6 },
            },
          );
        });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ".fl-panels", start: "top 75%", end: "bottom 45%", scrub: 0.6 },
        });
        panels.forEach((panel, i) => {
          const at = i;
          tl.fromTo(panel, { filter: "brightness(0.28)" }, { filter: "brightness(1)", duration: 0.4 }, at)
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
          <p className={`${eyebrow} text-kmep-light`}>{flush.label}</p>
          <SplitLines className="mt-4 max-w-[16ch] text-[clamp(34px,4vw,72px)] leading-[0.97] tracking-[-0.035em] text-balance">
            {flush.heading}
          </SplitLines>
        </div>
        <p className={`${microText} text-offwhite/70`}>{flush.body}</p>
      </div>

      <ol
        className="fl-panels wrap mt-[clamp(40px,6vw,88px)] grid gap-4 md:grid-cols-3 md:items-start"
        aria-label={flush.alt}
      >
        {flush.stages.map((stage, i) => (
          <li
            key={stage.n}
            className={`fl-panel flex flex-col md:mt-[calc(var(--i)*clamp(0px,4vw,56px))] rounded-[clamp(12px,1.05vw,20px)] bg-linear-[122.93deg,var(--color-night-warm)_2.4%,var(--color-night-deep)_60.23%] p-[clamp(16px,1.6vw,24px)] ${i === 2 ? "border border-kmep/50" : "border border-transparent"}`}
            style={{ "--i": i } as CSSProperties}
          >
            <div className="fl-in flex flex-col">
              <svg viewBox="0 0 360 300" aria-hidden className="w-full">
                {/* Cartucho de milho: bainhas sobrepostas, bordas curvas e
                    nervuras finas para manter o desenho leve no fundo escuro. */}
                <path d="M127 300 C121 239 130 151 151 77 C157 54 164 37 173 34 C180 31 185 39 190 53 C216 127 231 215 233 300 Z" fill="#090B09" />
                <path d="M98 300 C94 244 103 155 121 99 C131 68 145 48 158 42 C142 89 128 188 127 300 Z" fill="#788567" fillOpacity="0.09" />
                <path d="M233 300 C230 187 214 91 197 43 C219 62 236 99 249 151 C262 206 266 255 263 300 Z" fill="#788567" fillOpacity="0.09" />
                <g fill="none" stroke="#B9C2A0" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M127 300 C121 239 130 151 151 77 C157 54 164 37 173 34" strokeWidth="1.7" />
                  <path d="M233 300 C231 215 216 127 190 53 C185 39 180 31 173 34" strokeWidth="1.7" />
                  <path d="M98 300 C94 244 103 155 121 99 C131 68 145 48 158 42" strokeWidth="1.4" strokeOpacity="0.5" />
                  <path d="M263 300 C266 255 262 206 249 151 C236 99 219 62 197 43" strokeWidth="1.4" strokeOpacity="0.5" />
                  <path d="M111 193 C119 169 129 153 139 146 M106 238 C113 219 119 209 129 201 M244 135 C235 117 224 104 211 94 M257 197 C247 178 238 166 224 156" strokeWidth="1" strokeOpacity="0.32" />
                  <path d="M157 79 C164 112 166 146 165 174 M194 78 C202 113 206 145 207 170" strokeWidth="0.9" strokeOpacity="0.25" />
                </g>
                {/* As folhas se desdobram sobre o terceiro quadro. */}
                <g opacity={i === 2 ? 0.95 : 0.42}>
                  <path d="M208 148 C247 117 302 98 344 108 C350 110 352 114 347 117 C310 116 258 136 215 158 C208 161 203 155 208 148 Z" fill="#9AA886" fillOpacity="0.16" />
                  <path d="M210 155 C258 132 312 130 347 143 C352 145 352 150 347 150 C307 145 264 152 219 168 C211 171 204 162 210 155 Z" fill="#9AA886" fillOpacity="0.12" />
                  <g fill="none" stroke="#B9C2A0" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M210 152 C254 126 306 111 347 113 M211 159 C255 141 304 137 348 147" strokeWidth="1.5" />
                    <path d="M250 130 C255 121 259 116 266 112 M281 119 C286 112 293 108 300 106 M311 113 C317 108 324 107 331 108 M252 143 C259 148 266 149 274 150 M291 140 C299 145 307 147 315 148" strokeWidth="0.9" strokeOpacity="0.58" />
                  </g>
                </g>
                {DROPS[i].map(([x, y]) => (
                  <circle key={`${x}-${y}`} className="fl-drop" cx={x} cy={y} r="4.5" fill="#EEEBE0" fillOpacity="0.85" />
                ))}
                {/* Posição por fora, giro por dentro: o movimento do segundo
                    quadro anda em linha reta, sem herdar a rotação. */}
                <g transform={`translate(${AT[i][0]} ${AT[i][1]})`}>
                  <g className={i === 1 ? "fl-move" : undefined}>
                    <g transform={`rotate(${AT[i][2]})`}>
                      <path d="M0 -11 C4 -11 6 -6 5 -1 C5 5 4 10 1 12 C-2 13 -5 8 -6 2 C-7 -4 -4 -10 0 -11 Z" fill="#F6FFEE" />
                      <circle cx="0" cy="-12" r="3" fill="#F6FFEE" />
                      <g fill="none" stroke="#D6E3C9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M-4 -4 C-8 -6 -10 -5 -13 -2 M-5 1 C-9 0 -11 2 -13 5 M-4 6 C-8 7 -9 10 -10 12 M4 -4 C8 -6 10 -5 13 -2 M5 1 C9 0 11 2 13 5 M4 6 C8 7 9 10 10 12" strokeWidth="1.2" />
                        <path d="M-2 -15 C-4 -18 -6 -18 -8 -18 M2 -15 C4 -18 6 -18 8 -18" strokeWidth="0.9" />
                      </g>
                      <path d="M-4 -3 Q0 -1 4 -3 M-4 2 Q0 4 4 2 M-3 7 Q0 9 3 7" fill="none" stroke="#82936F" strokeWidth="0.9" strokeLinecap="round" />
                    </g>
                  </g>
                </g>
              </svg>
              <span aria-hidden className="fl-rule mt-4 block h-[2px] w-12 origin-left rounded-full bg-kmep" />
              <p className={`${microCaps} mt-4 text-kmep-light`}>{stage.n}</p>
              <h3 className="mt-1 text-[clamp(24px,2vw,34px)] leading-[1.05] tracking-[-0.02em]">{stage.title}</h3>
              <p className={`${microText} mt-2 text-offwhite/65`}>{stage.body}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* A ressalva: obrigatória, dentro do bloco, em caixa de destaque. */}
      <div className="wrap mt-[clamp(28px,3vw,44px)]">
        <aside className="grid gap-4 rounded-[clamp(14px,1.2vw,22px)] border border-offwhite/20 bg-offwhite/[0.04] p-[clamp(20px,2.4vw,40px)] lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <p className={`${eyebrow} text-kmep-light`}>{flush.caveatLabel}</p>
          <p className="font-display text-[clamp(20px,1.9vw,32px)] leading-[1.18] tracking-[-0.015em] text-balance">
            {flush.caveat}
          </p>
        </aside>
      </div>
    </section>
  );
}
