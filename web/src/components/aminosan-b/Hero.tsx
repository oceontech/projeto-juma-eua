"use client";

import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { whenBooted } from "@/lib/boot";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Hero da LP B: a bombona no campo ao nascer do sol, em duas camadas — o
 * fundo (campo, céu e bombona) e as folhas em primeiro plano, recortadas.
 *
 * O parallax é só de entrada, como a abertura do hero da home, sem nada
 * preso ao scroll: quando o preloader sai, o fundo assenta de um zoom e as
 * folhas sobem de baixo até o lugar, um pouco atrás, para a cena ganhar
 * profundidade. O texto entra por cima das duas. Depois que a folha assenta,
 * fica um vento fraco e constante nela — ver `startDrift` — que também
 * existe na LP do KMEP (`kmep/Hero.tsx`), com o mesmo mecanismo.
 *
 * `data-hb-copy` marca o que sai de cena quando o scroll começa (o texto e a
 * sombra que o sustenta): quem o tira é a cena de partículas, em
 * Specimen.tsx, que embrulha este hero.
 */

/* O mesmo corte da home para trocar a foto do celular. */
const NARROW = "(max-width: 860px)";

export function Hero() {
  const { hero } = useContent().aminosanB;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const leaves = scope.current?.querySelector<HTMLElement>("[data-hb='leaves']");

        gsap.set("[data-hb='bg']", { scale: 1.18, transformOrigin: "50% 60%" });
        /* A folha recebe uma folga de 12% (`scale`) que o recorte do
           `<picture>` não tem: sem ela, o vento do `startDrift` desloca a
           camada inteira e descobre a cor de fundo da seção na borda, porque
           a imagem termina exatamente onde o recorte termina. Com a origem
           no centro a folga sobra igual nos quatro lados, e cobre de sobra o
           vaivém de x, y e rotação que vem depois. */
        gsap.set("[data-hb='leaves']", { yPercent: 38, scale: 1.12, transformOrigin: "50% 50%" });
        gsap.set("[data-hb='fade']", { opacity: 0, y: 24 });

        let alive = true;
        let intro: gsap.core.Timeline | undefined;
        const drift: gsap.core.Tween[] = [];

        /* A folha nunca para de vez: assim que assenta no lugar, fica um
           vento fraco e constante nela — vaivém pequeno em x, y e rotação,
           cada eixo com o seu período, para não ler como um balanço só.
           `sine.inOut` para de vez nas pontas do curso e é rápido no meio —
           e o repouso em que a folha chega da entrada é o meio do curso (x,
           y e rotação em zero), o ponto de maior velocidade do ciclo. Entrar
           direto no loop ali é o corte seco: a folha ia de parada a veloz
           num quadro só. Por isso cada eixo abre com uma perna extra, da
           posição de repouso até a primeira ponta do curso — mesma curva
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
            .to("[data-hb='bg']", { scale: 1, duration: 2.6, ease: "power2.out" }, 0)
            .to("[data-hb='leaves']", { yPercent: 0, duration: 2 }, 0.15)
            /* O vento começa assim que a folha chega, não quando o resto do
               hero termina de entrar. */
            .call(startDrift, [], 2.15)
            .to("[data-hb='fade']", { opacity: 1, y: 0, duration: 1.1, stagger: 0.1 }, 0.5);
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
    <section
      ref={scope}
      className="relative flex h-[100svh] min-h-[600px] flex-col overflow-hidden bg-white text-ink"
    >
      {/* Duas fotos por camada, uma por formato. No notebook (861–1599px) a
          janela é mais larga que a foto, e o corte pelo pé subia a bombona
          até o título: ali as duas camadas descem juntas, cortando do pé.
          `<picture>` e não next/image porque só ele escolhe pela largura da
          tela e baixa uma só; os arquivos já vêm em webp no tamanho certo. */}
      <picture data-hb="bg" className="absolute inset-0">
        <source media={NARROW} srcSet="/img/aminosan-b/hero-bg-mobile.webp" />
        <img
          src="/img/aminosan-b/hero-bg.webp"
          alt={hero.alt}
          width={2752}
          height={1536}
          fetchPriority="high"
          className="size-full object-cover object-bottom min-[861px]:max-[1599px]:object-[50%_60%]"
        />
      </picture>

      <picture data-hb="leaves" className="pointer-events-none absolute inset-0 z-[2]">
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

      {/* Leitura do texto branco do pé: a folha é escura, mas tem brilho. */}
      <div
        aria-hidden
        data-hb-copy
        className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_48%_42%_at_0%_100%,rgba(16,32,22,0.55),transparent_75%)]"
      />

      <div data-hb-copy className="wrap hero-band relative z-[4] text-center">
        <p
          data-hb="fade"
          className="font-display text-[clamp(11px,1.1vw,15px)] tracking-[0.38em] text-ink uppercase"
        >
          {hero.eyebrow}
        </p>
        <h1
          data-hb="fade"
          className="mt-[clamp(4px,0.5vw,10px)] text-[clamp(40px,5.6vw,108px)] leading-[1] min-[861px]:max-[1599px]:mt-0 min-[861px]:max-[1599px]:leading-[0.94] tracking-[-0.03em] text-balance text-ink"
        >
          {hero.heading}
        </h1>
      </div>

      <div data-hb-copy className="relative z-[4] mt-auto flex items-end px-[var(--spacing-gut)] lg:px-[clamp(40px,5vw,96px)] justify-between gap-6 pb-[clamp(28px,8svh,72px)] text-white">
        <div data-hb="fade" className="max-w-[min(62%,340px)] lg:max-w-[380px]">
          <h2 className="text-[clamp(22px,2.3vw,40px)] leading-[1.02] tracking-[-0.02em]">
            {hero.aside.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-3 text-[clamp(12px,1.05vw,16px)] leading-[1.25] text-white/95 lg:mt-4">
            {hero.aside.body}
          </p>
        </div>

        <FoliarBadge label={hero.badge} />
      </div>
    </section>
  );
}

/** O selo do canto: folha branca com a nervura vazada e o texto em arco. */
function FoliarBadge({ label }: { label: string }) {
  return (
    <svg
      data-hb="fade"
      viewBox="0 0 120 112"
      role="img"
      aria-label={label}
      className="w-[clamp(92px,9.6vw,150px)] shrink-0 text-white"
    >
      <defs>
        <mask id="hb-badge-vein">
          <rect width="120" height="112" fill="#fff" />
          <path d="M20 104C44 76 72 44 110 12" fill="none" stroke="#000" strokeWidth="2.4" strokeLinecap="round" />
        </mask>
        <path id="hb-badge-arc" d="M8 84C8 50 30 22 70 14" fill="none" />
      </defs>
      <path
        mask="url(#hb-badge-vein)"
        fill="currentColor"
        d="M24 98C12 70 22 44 50 30 70 20 94 16 116 8 116 40 106 70 82 88 62 102 40 104 24 98Z"
      />
      <path d="M26 96 12 110" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <text fill="currentColor" fontSize="12.5" letterSpacing="0.2" className="font-display">
        <textPath href="#hb-badge-arc">{label}</textPath>
      </text>
    </svg>
  );
}
