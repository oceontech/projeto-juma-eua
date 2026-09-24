"use client";

import { Fragment, useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { whenBooted } from "@/lib/boot";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * K1. O hero da LP B com a bombona do KMEP: a bombona no campo ao
 * nascer do sol, o olho e a headline em tinta no céu, o título curto e o
 * selo no pé, sobre a sombra que sobe do canto — e as mesmas folhas
 * recortadas da LP B em primeiro plano, para dar a profundidade que a foto
 * do KMEP sozinha não tem.
 *
 * O pé segue a mesma peça da LP B: título de duas linhas + corpo à esquerda,
 * selo da folha à direita — nada de CTA aqui, a nav já leva um.
 *
 * O parallax é só de entrada, como no hero da LP B: quando o preloader sai,
 * o fundo assenta de um zoom, as folhas sobem de baixo até o lugar e os
 * textos entram em escada.
 */

/* O mesmo corte da home para trocar a foto do celular. */
const NARROW = "(max-width: 860px)";

/**
 * `variant="b"` troca só as frases: a headline da versão 2 do teste A/B no
 * alto e a da versão 1 no pé (`heroB` em content/kmep.ts). A foto, o
 * movimento e o selo são os mesmos.
 */
export function Hero({ variant = "a" }: { variant?: "a" | "b" }) {
  const content = useContent().kmep;
  const hero = variant === "b" ? { ...content.hero, ...content.heroB } : content.hero;
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const leaves = scope.current?.querySelector<HTMLElement>("[data-kh='leaves']");

        gsap.set("[data-kh='bg']", { scale: 1.18, transformOrigin: "50% 60%" });
        /* A folha recebe uma folga de 12% (`scale`) que o recorte do
           `<picture>` não tem: sem ela, o vento do `startDrift` desloca a
           camada inteira e descobre a cor de fundo da seção na borda, porque
           a imagem termina exatamente onde o recorte termina. Com a origem
           no centro a folga sobra igual nos quatro lados, e cobre de sobra o
           vaivém de x, y e rotação que vem depois. */
        gsap.set("[data-kh='leaves']", { yPercent: 38, scale: 1.12, transformOrigin: "50% 50%" });
        gsap.set("[data-kh='fade']", { opacity: 0, y: 24 });

        let alive = true;
        let intro: gsap.core.Timeline | undefined;
        const drift: gsap.core.Tween[] = [];

        /* A folha nunca para de vez: assim que assenta no lugar, fica um
           vento fraco e constante nela — vaivém pequeno em x, y e rotação,
           cada eixo com o seu período, para não ler como um balanço só.
           `sine.inOut` para de vez nas pontas do curso e é rápido no meio —
           e o repouso em que a folha chega da entrada é o meio do curso (x,
           y e rotação em zero), o ponto de maior velocidade do ciclo. Entrar
           direto no loop ali é o corte seco que se via: a folha ia de parada
           a veloz num quadro só. Por isso cada eixo abre com uma perna extra,
           da posição de repouso até a primeira ponta do curso — mesma curva
           `sine.inOut`, que também para de vez nas pontas —, e só then o loop
           sem fim começa, exatamente de onde essa perna parou. Nenhum ponto
           de emenda tem salto de posição nem de velocidade. */
        const startDrift = () => {
          if (!alive || !leaves) return;

          const swing = (prop: "x" | "y" | "rotation", amplitude: number, period: number, entry: number) => {
            const enter = gsap.fromTo(
              leaves,
              { [prop]: 0 },
              {
                [prop]: -amplitude,
                duration: entry,
                ease: "sine.inOut",
                onComplete: () => {
                  if (!alive) return;
                  const loop = gsap.fromTo(
                    leaves,
                    { [prop]: -amplitude },
                    { [prop]: amplitude, duration: period / 2, ease: "sine.inOut", yoyo: true, repeat: -1 },
                  );
                  drift.push(loop);
                },
              },
            );
            drift.push(enter);
          };

          /* Durações de entrada diferentes para os três eixos não chegarem
             juntos na primeira ponta — sem isso a folha "trava" no mesmo
             instante em três direções, o que denuncia o efeito. */
          swing("x", 7, 5.2, 1.1);
          swing("y", 5, 6.6, 1.6);
          swing("rotation", 0.5, 7.4, 2.1);
        };

        void whenBooted().then(() => {
          if (!alive) return;
          intro = gsap
            .timeline({ defaults: { ease: "power3.out" } })
            /* O fundo mais devagar que a frente: fundo que assenta junto com
               a folha achata a profundidade. */
            .to("[data-kh='bg']", { scale: 1, duration: 2.6, ease: "power2.out" }, 0)
            .to("[data-kh='leaves']", { yPercent: 0, duration: 2 }, 0.15)
            /* O vento começa assim que a folha chega, não quando o resto do
               hero termina de entrar. */
            .call(startDrift, [], 2.15)
            .to("[data-kh='fade']", { opacity: 1, y: 0, duration: 1.1, stagger: 0.1 }, 0.5);
        });

        return () => {
          alive = false;
          intro?.kill();
          for (const tween of drift) tween.kill();
        };
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className="bg-cream">
      <section className="relative flex h-[100svh] min-h-[600px] flex-col overflow-hidden bg-[#f3e1d1] text-ink">
        {/* Uma foto por formato, no mesmo corte e no mesmo recorte da LP B
            (as duas fotos do KMEP nascem no mesmo tamanho): pelo pé, e
            no notebook (861–1599px) a janela é mais larga que a foto, e o
            corte pelo pé subia a bombona até o título — ali as duas camadas
            descem juntas, cortando do pé. `<picture>` e não next/image
            porque só ele escolhe pela largura da tela e baixa uma só. */}
        <picture data-kh="bg" className="absolute inset-0">
          <source media={NARROW} srcSet="/img/kmep/hero-bg-mobile.webp" />
          <img
            src="/img/kmep/hero-bg.webp"
            alt={hero.alt}
            width={2752}
            height={1536}
            fetchPriority="high"
            className="size-full object-cover object-bottom min-[861px]:max-[1599px]:object-[50%_60%]"
          />
        </picture>

        {/* As folhas recortadas da LP B, reaproveitadas: mesma foto, mesmo
            corte, em primeiro plano sobre a bombona. */}
        <picture data-kh="leaves" className="pointer-events-none absolute inset-0 z-[2]">
          <source media={NARROW} srcSet="/img/aminosan-b/hero-leaves-mobile.webp" />
          <img
            src="/img/aminosan-b/hero-leaves.webp"
            alt=""
            width={2752}
            height={1536}
            fetchPriority="high"
            className="size-full object-cover object-bottom min-[861px]:max-[1599px]:object-[50%_60%]"
          />
        </picture>

        {/* Leitura do texto branco do pé: a sombra verde da LP B saindo do
            canto, mais larga porque aqui o bloco do pé é maior. No celular o
            texto ocupa a largura toda, e a sombra sobe do pé inteiro. */}
        <div
          aria-hidden
          data-hb-copy
          className="pointer-events-none absolute inset-0 z-[3] bg-[linear-gradient(0deg,rgba(16,32,22,0.72)_0%,rgba(16,32,22,0.4)_20%,transparent_36%)] min-[861px]:bg-[radial-gradient(ellipse_54%_48%_at_0%_100%,rgba(16,32,22,0.6),transparent_75%)]"
        />

        <div data-hb-copy className="wrap relative z-[4] pt-[clamp(84px,12svh,124px)] text-center">
          <p
            data-kh="fade"
            className="mx-auto max-w-[34ch] font-display text-[clamp(10px,1vw,14px)] tracking-[0.24em] text-ink uppercase min-[861px]:max-w-none min-[861px]:tracking-[0.32em]"
          >
            {hero.eyebrow.map((item, i) => (
              <Fragment key={item}>
                {i > 0 && <span aria-hidden> · </span>}
                <span className="whitespace-nowrap">{item}</span>
              </Fragment>
            ))}
          </p>
          {/* O clamp foi calibrado (não copiado direto da LP B) para o
              título do KMEP, bem mais longo, nunca quebrar linha a partir de
              861px — testado nos recortes reais do `.wrap` até 2560px, com
              folga de sobra em todos. Abaixo de 861px a quebra é normal, como
              a LP B também quebraria se a headline dela fosse deste tamanho. */}
          <h1
            data-kh="fade"
            className="mt-[clamp(4px,0.5vw,10px)] text-[clamp(32px,5.32vw,78px)] leading-[1] min-[861px]:max-[1599px]:mt-0 min-[861px]:max-[1599px]:leading-[0.94] min-[861px]:whitespace-nowrap tracking-[-0.03em] text-balance text-ink"
          >
            {hero.heading}
          </h1>
        </div>

        <div data-hb-copy className="relative z-[4] mt-auto flex items-end justify-between gap-6 px-[var(--spacing-gut)] pb-[clamp(28px,8svh,72px)] text-white lg:px-[clamp(40px,5vw,96px)]">
          <div data-kh="fade" className="max-w-[min(64%,420px)]">
            <h2 className="text-[clamp(18px,2vw,32px)] leading-[1.1] tracking-[-0.02em]">
              {hero.aside.heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-3 text-[clamp(11.5px,1vw,15px)] leading-[1.3] text-pretty text-white/95">{hero.body}</p>
          </div>

          <FoliarBadge label={hero.badge} />
        </div>
      </section>
    </div>
  );
}

/** O selo do canto: folha branca com a nervura vazada e o texto em arco —
    o mesmo da LP B, aqui no lugar dos CTAs do hero (que já estão na nav). */
function FoliarBadge({ label }: { label: string }) {
  return (
    <svg
      data-kh="fade"
      viewBox="0 0 120 112"
      role="img"
      aria-label={label}
      className="w-[clamp(80px,8.4vw,130px)] shrink-0 text-white"
    >
      <defs>
        <mask id="kh-badge-vein">
          <rect width="120" height="112" fill="#fff" />
          <path d="M20 104C44 76 72 44 110 12" fill="none" stroke="#000" strokeWidth="2.4" strokeLinecap="round" />
        </mask>
        <path id="kh-badge-arc" d="M8 84C8 50 30 22 70 14" fill="none" />
      </defs>
      <path
        mask="url(#kh-badge-vein)"
        fill="currentColor"
        d="M24 98C12 70 22 44 50 30 70 20 94 16 116 8 116 40 106 70 82 88 62 102 40 104 24 98Z"
      />
      <path d="M26 96 12 110" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <text fill="currentColor" fontSize="12.5" letterSpacing="0.2" className="font-display">
        <textPath href="#kh-badge-arc">{label}</textPath>
      </text>
    </svg>
  );
}
