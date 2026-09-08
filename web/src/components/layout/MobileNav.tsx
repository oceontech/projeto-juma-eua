"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { SmartLink } from "@/components/ui/SmartLink";
import { nav } from "@/content/home";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Navegação do mobile — não é a barra do desktop encolhida.
 *
 * Abaixo de 1152px o header guarda só logo e botão, e o menu inteiro vira um
 * painel de tela cheia. É a única forma de dar aos quatro destinos um alvo de
 * toque decente sem espremer tipografia de 11px numa tela de 390.
 *
 * As duas peças moram no mesmo arquivo porque compartilham o estado `open` do
 * SiteHeader e nunca aparecem uma sem a outra.
 */

/* Ordem do painel ≠ ordem da barra: no desktop os links se dividem à volta do
   logo; aqui viram uma lista só, e "Contact us" fecha por ser o destino de
   conversão. */
const menuItems = [nav.left[0], ...nav.right, ...nav.left.slice(1)];

const languages = [
  { src: "/img/flag-br.png", label: "Português (Brasil)", active: false },
  { src: "/img/flag-us.png", label: "English (United States)", active: true },
];

/* ------------------------------------------------------------------ botão */

/**
 * Hambúrguer que vira X. Dois traços, sem o do meio: com três, a transição
 * pede um fade no meio do caminho e o corte fica sujo. Com dois é rotação
 * pura — o gesto lê inteiro.
 */
export function BurgerButton({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true, defaults: { duration: 0.36, ease: "power3.inOut" } })
        .to("[data-top]", { attr: { y1: 12, y2: 12 }, rotate: 45, svgOrigin: "12 12" }, 0)
        /* A linha de baixo nasce curta e cresce ao abrir: as duas hastes do X
           precisam terminar com o mesmo comprimento. */
        .to(
          "[data-bottom]",
          { attr: { y1: 12, y2: 12, x2: 20 }, rotate: -45, svgOrigin: "12 12" },
          0,
        );
    },
    { scope: svg },
  );

  useEffect(() => {
    const timeline = tl.current;
    if (!timeline) return;
    if (open) timeline.play();
    else timeline.reverse();
  }, [open]);

  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={open ? "Close menu" : "Open menu"}
      onClick={onToggle}
      className="-mr-1.5 cursor-pointer p-1.5 text-ink transition-colors duration-400 group-data-[theme=dark]:text-offwhite group-data-[open]:text-offwhite nav:hidden"
    >
      <svg
        ref={svg}
        viewBox="0 0 24 24"
        width={24}
        height={24}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        aria-hidden
      >
        <line data-top x1="4" y1="8" x2="20" y2="8" />
        <line data-bottom x1="4" y1="16" x2="14" y2="16" />
      </svg>
    </button>
  );
}

/* ----------------------------------------------------------------- painel */

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "power3.out" } })
        /* O `set` inicial é o que devolve o painel ao estado invisível quando a
           timeline roda ao contrário: o GSAP restaura o valor que encontrou. */
        .set(root.current, { autoAlpha: 1 })
        .fromTo(
          "[data-scrim]",
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", duration: reduce ? 0.01 : 0.5 },
        )
        .fromTo(
          "[data-row]",
          { yPercent: 40, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: reduce ? 0.01 : 0.45,
            stagger: reduce ? 0 : 0.055,
          },
          reduce ? 0 : "-=0.28",
        )
        .fromTo(
          "[data-foot]",
          { y: 16, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: reduce ? 0.01 : 0.4 },
          reduce ? 0 : "-=0.25",
        );
    },
    { scope: root },
  );

  useEffect(() => {
    const timeline = tl.current;
    if (!timeline) return;
    if (open) timeline.play();
    else timeline.reverse();
  }, [open]);

  /* Trava a rolagem de trás do painel e devolve ESC como saída. */
  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      ref={root}
      id="mobile-menu"
      /* Fica no DOM sempre, para poder animar a saída; `inert` tira teclado e
         leitor de tela enquanto está fechado. */
      inert={!open}
      style={{ visibility: "hidden", opacity: 0 }}
      className="fixed inset-0 z-[70] nav:hidden"
    >
      <div
        data-scrim
        className="absolute inset-0 bg-[linear-gradient(160deg,var(--color-night-warm)_0%,var(--color-night)_38%,var(--color-night-deep)_100%)]"
      />

      {/* `my-auto` na lista, e não `justify-between` no container: o vazio
          sobra igual acima e abaixo dos links em qualquer altura de tela. */}
      <div className="relative flex h-[100dvh] flex-col px-gut pt-[max(84px,11vh)] pb-[max(28px,5vh)]">
        <nav aria-label="Main (mobile)" className="my-auto">
          <ul>
            {menuItems.map((item, index) => (
              <li key={item.label} className="overflow-hidden border-b border-white/10">
                <div data-row>
                  <SmartLink
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-center gap-4 py-[clamp(15px,3.6vw,22px)]"
                  >
                    <span className="w-[18px] font-body text-[10px] leading-none tracking-[0.18em] text-lime/60 tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[clamp(26px,7.6vw,42px)] leading-none font-semibold tracking-[-0.01em] text-offwhite uppercase transition-transform duration-500 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:translate-x-1">
                      {item.label}
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      className="ml-auto w-4 shrink-0 -translate-x-1 text-lime opacity-0 transition-all duration-500 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:translate-x-0 group-hover:opacity-100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </SmartLink>
                </div>
              </li>
            ))}
          </ul>
        </nav>

        <div data-foot className="grid gap-6">
          <SmartLink
            href={nav.cta.href}
            onClick={onClose}
            className="flex items-center justify-center gap-2.5 rounded-full bg-lime px-6 py-[17px] font-display text-[12px] font-semibold tracking-[0.14em] text-night uppercase"
          >
            {nav.cta.label}
            <svg
              viewBox="0 0 24 24"
              className="w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </SmartLink>

          <div
            role="group"
            aria-label="Language"
            className="flex items-center gap-1 justify-self-start rounded-full bg-white/10 p-[3px]"
          >
            {languages.map((language) => (
              <button
                key={language.label}
                type="button"
                aria-pressed={language.active}
                aria-label={language.label}
                className={
                  language.active
                    ? "cursor-pointer rounded-full bg-white/15 p-[5px] leading-none"
                    : "cursor-pointer rounded-full p-[5px] leading-none opacity-55 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                }
              >
                <Image
                  src={language.src}
                  alt=""
                  width={45}
                  height={24}
                  className="w-[26px] rounded-[2px]"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
