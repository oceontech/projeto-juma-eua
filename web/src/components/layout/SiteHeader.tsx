"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SmartLink } from "@/components/ui/SmartLink";
import { nav } from "@/content/home";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { BurgerButton, MobileMenu } from "./MobileNav";

/**
 * Barra do topo — fixa, encostada na borda, por cima do hero.
 *
 * Não é uma pill flutuante: a lâmina de vidro atravessa a tela inteira e só o
 * conteúdo respeita a coluna do site. Assim ela some no layout em vez de
 * pousar sobre ele.
 *
 * Quatro comportamentos, todos dirigidos por atributos no próprio <header>,
 * para o CSS resolver a aparência e o React não re-renderizar a cada pixel de
 * scroll:
 *
 *   data-scrolled  sobre o hero não há barra, só os elementos soltos; a
 *                  partir do primeiro scroll o vidro entra por trás deles;
 *   data-theme     o vidro é claro sobre seção clara e escuro sobre seção
 *                  escura — ver TONE_LINE abaixo;
 *   direção        rolando para baixo (indo adiante na leitura) ela sai de
 *                  cena; rolando para cima ela volta, que é quando o leitor
 *                  está procurando navegação;
 *   data-open      com o painel do mobile aberto o vidro sai e o conteúdo do
 *                  header inverte para o fundo escuro.
 *
 * Acima de 1152px o menu inteiro cabe na barra; abaixo disso vira o painel
 * de MobileNav.tsx.
 */

/** Só esconde depois deste ponto: perto do topo, sumir parece defeito. */
const HIDE_AFTER = 160;

/**
 * Onde a barra "encosta" na página para decidir o próprio tom: no seu meio.
 * Pela borda de baixo o vidro viraria com a seção escura ainda mal encostada;
 * pelo meio, ele acompanha o que de fato está atrás da tipografia.
 */
const TONE_LINE = 0.5;

const languages = [
  { src: "/img/flag-br.png", label: "Português (Brasil)", active: false },
  { src: "/img/flag-us.png", label: "English (United States)", active: true },
];

/* Sublinhado que entra pela esquerda e sai pela direita — a origem troca no
   hover, então o traço nunca recua pelo mesmo lado por onde entrou. O lima
   funciona nos dois tons, e é a única cor que não precisa de variante. */
const linkClass = [
  "relative font-display text-[11px] font-semibold uppercase tracking-[0.18em] whitespace-nowrap",
  "text-muted transition-colors duration-300 hover:text-ink",
  "group-data-[theme=dark]:text-white/70 group-data-[theme=dark]:hover:text-white",
  "after:absolute after:-bottom-[5px] after:left-0 after:h-[1.5px] after:w-full after:rounded-full",
  "after:origin-right after:scale-x-0 after:bg-lime",
  "after:transition-transform after:duration-500 after:ease-[cubic-bezier(.22,.61,.36,1)]",
  "hover:after:origin-left hover:after:scale-x-100",
].join(" ");

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);

  /* A leitura do scroll roda fora do React; estes refs são a ponte entre ela
     e o estado do painel. */
  const openRef = useRef(false);
  const hiddenRef = useRef(false);
  const applyHidden = useRef<(hidden: boolean) => void>(() => {});

  const close = useCallback(() => setOpen(false), []);

  useGSAP(
    () => {
      const element = header.current;
      if (!element) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      /* Uma propriedade só, uma duração só. Animar `opacity` junto com `y`,
         em tempos diferentes, é o que fazia a barra voltar translúcida e
         encorpar depois — dois tempos para um movimento só. */
      const slide = gsap.quickTo(element, "yPercent", { duration: 0.55, ease: "power3.out" });

      applyHidden.current = (hidden) => {
        if (hidden === hiddenRef.current) return;
        hiddenRef.current = hidden;
        slide(hidden ? -130 : 0);
      };

      /* As seções escuras da página, medidas em coordenadas do documento.
         Uma lista só, consultada a cada scroll, em vez de um ScrollTrigger
         por seção: com seções escuras vizinhas, o `leave` de uma e o `enter`
         da outra disputam a mesma troca e o tom pisca. */
      let darkRanges: Array<[number, number]> = [];
      let toneOffset = 0;

      const measure = () => {
        toneOffset = element.offsetHeight * TONE_LINE;
        darkRanges = [...document.querySelectorAll("[data-nav-theme='dark']")].map(
          (section) => {
            const box = section.getBoundingClientRect();
            const top = box.top + window.scrollY;
            return [top, top + box.height];
          },
        );
      };

      /* Seção travada (o hero) não muda de lugar enquanto a página rola,
         então a medida por coordenada não a alcança: quem estiver pinado dita
         o tom por `data-nav-theme` no <html>. */
      const root = document.documentElement;

      const applyTone = (y: number) => {
        const line = y + toneOffset;
        const overDark = darkRanges.some(([top, bottom]) => line > top && line < bottom);
        element.dataset.theme = root.dataset.navTheme ?? (overDark ? "dark" : "light");
      };

      /* O aviso do hero chega fora do scroll: a cena continua se desfazendo
         depois do último evento de rolagem, e sem observar o atributo a barra
         ficava com o tom do instante em que o dedo parou. */
      const watchTone = new MutationObserver(() => applyTone(window.scrollY));
      watchTone.observe(root, { attributes: true, attributeFilter: ["data-nav-theme"] });

      measure();
      applyTone(window.scrollY);
      ScrollTrigger.addEventListener("refresh", measure);

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();

          /* Enquanto o hero está travado a barra fica sem lâmina nenhuma: a
             cena atrás dela muda o tempo todo, e o vidro vira uma moldura
             parada em cima do movimento. O hero avisa pelo <html>. */
          const overHero = document.documentElement.dataset.heroOver === "on";
          element.dataset.scrolled = !overHero && y > 8 ? "true" : "false";

          applyTone(y);

          /* Quem pediu menos movimento fica com a barra sempre presente. */
          if (reduce) return;

          /* self.direction é 1 descendo e -1 subindo. Com o painel aberto a
             barra não pode sumir: o botão de fechar está nela. */
          applyHidden.current(self.direction === 1 && y > HIDE_AFTER && !openRef.current);
        },
      });

      return () => {
        watchTone.disconnect();
        ScrollTrigger.removeEventListener("refresh", measure);
      };
    },
    { scope: header },
  );

  /* Abrir o menu traz a barra de volta, venha ela de onde vier. */
  useEffect(() => {
    openRef.current = open;
    if (open) applyHidden.current(false);
  }, [open]);

  return (
    <>
      <header
        ref={header}
        data-open={open || undefined}
        data-scrolled="false"
        data-theme="light"
        className="group fixed inset-x-0 top-0 z-[80] will-change-transform"
      >
        {/* A lâmina de vidro é uma camada própria, atrás do conteúdo, e só o
            que muda nela é a opacidade. Transicionar `backdrop-filter` direto
            faz o blur entrar em degrau — animando a camada inteira, o vidro
            surge por fade. */}
        <div
          aria-hidden
          className={[
            "absolute inset-0 opacity-0 group-data-[scrolled=true]:opacity-100",
            /* O tom acompanha a seção que está passando por trás; a cor entra
               na mesma transição da opacidade, então a virada é contínua. */
            "transition-[opacity,background-color,border-color,box-shadow] duration-400 ease-out",
            "border-b backdrop-blur-[20px] backdrop-saturate-[1.8]",
            /* Translucidez de verdade: acima de ~60% o branco tapa o blur e a
               barra vira um retângulo chapado. Quem sustenta a legibilidade é
               a troca de tom, não a opacidade. */
            "border-ink/[0.07] bg-white/55",
            /* A aresta clara por dentro é o que dá volume ao vidro; sem ela a
               barra lê como um retângulo translúcido qualquer. */
            "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.65),0_1px_24px_-20px_rgba(12,12,14,0.5)]",
            "group-data-[theme=dark]:border-white/[0.09] group-data-[theme=dark]:bg-night/45",
            "group-data-[theme=dark]:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.13),0_1px_24px_-20px_rgba(0,0,0,0.8)]",
            /* Sobre o painel escuro do mobile o vidro não faz sentido. */
            "group-data-[open]:opacity-0",
          ].join(" ")}
        />

        <div
          className={[
            "relative mx-auto flex w-[min(var(--container-wrap),calc(100%-2*var(--spacing-gut)))]",
            "items-center justify-between gap-4 py-[clamp(10px,0.85vw,14px)]",
            "nav:grid nav:grid-cols-[1fr_auto_1fr]",
          ].join(" ")}
        >
          <div className="hidden items-center gap-[clamp(14px,1.5vw,26px)] nav:flex">
            <div
              role="group"
              aria-label="Language"
              className="flex items-center gap-0.5 rounded-full bg-ink/[0.05] p-[3px] transition-colors duration-400 group-data-[theme=dark]:bg-white/10"
            >
              {languages.map((language) => (
                <button
                  key={language.label}
                  type="button"
                  aria-pressed={language.active}
                  aria-label={language.label}
                  className={
                    language.active
                      ? "cursor-pointer rounded-full bg-white p-[3px] leading-none shadow-[0_1px_2px_rgba(12,12,14,0.12)] transition-colors duration-400 group-data-[theme=dark]:bg-white/20 group-data-[theme=dark]:shadow-none"
                      : "cursor-pointer rounded-full p-[3px] leading-none opacity-35 grayscale transition duration-300 hover:opacity-90 hover:grayscale-0 group-data-[theme=dark]:opacity-45"
                  }
                >
                  <Image
                    src={language.src}
                    alt=""
                    width={45}
                    height={24}
                    className="w-[22px] rounded-[2px]"
                  />
                </button>
              ))}
            </div>

            <nav aria-label="Main" className="flex items-center gap-[clamp(14px,1.5vw,26px)]">
              {nav.left.map((item) => (
                <SmartLink key={item.label} href={item.href} className={linkClass}>
                  {item.label}
                </SmartLink>
              ))}
            </nav>
          </div>

          <SmartLink
            href="/"
            aria-label="Juma-Agro — homepage"
            className="shrink-0 transition-[filter] duration-400 group-data-[theme=dark]:brightness-0 group-data-[theme=dark]:invert group-data-[open]:brightness-0 group-data-[open]:invert"
          >
            <Image
              src="/img/logo-juma.svg"
              alt="Juma-Agro"
              width={250}
              height={30}
              priority
              className="w-[clamp(126px,10.2vw,168px)]"
            />
          </SmartLink>

          <div className="hidden items-center justify-end gap-[clamp(14px,1.5vw,26px)] nav:flex">
            {nav.right.map((item) => (
              <SmartLink key={item.label} href={item.href} className={linkClass}>
                {item.label}
              </SmartLink>
            ))}

            {/* Sobre seção escura o verde da marca desaparece no fundo; o lima
                é o par escuro do botão, o mesmo do painel mobile. */}
            <SmartLink
              href={nav.cta.href}
              className={[
                "group/cta inline-flex items-center gap-2 rounded-full py-[10px] pr-[14px] pl-[18px]",
                "font-display text-[11px] font-semibold tracking-[0.13em] whitespace-nowrap uppercase",
                "bg-green-brand text-white transition-colors duration-400 hover:bg-[#036231]",
                "group-data-[theme=dark]:bg-lime group-data-[theme=dark]:text-night",
                "group-data-[theme=dark]:hover:bg-[#c8d84e]",
              ].join(" ")}
            >
              {nav.cta.label}
              <svg
                viewBox="0 0 24 24"
                className="w-[14px] transition-transform duration-400 ease-[cubic-bezier(.22,.61,.36,1)] group-hover/cta:translate-x-[3px]"
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
          </div>

          <BurgerButton open={open} onToggle={() => setOpen((value) => !value)} />
        </div>
      </header>

      <MobileMenu open={open} onClose={close} />
    </>
  );
}
