"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { booted } from "@/lib/boot";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { Cta, microCaps } from "./ui";

/**
 * Hero da LP B: o produto no pedestal, título grande no canto, a promessa
 * à direita e a faixa de registro no pé — a composição da referência.
 *
 * A foto entra primeiro (é o LCP) e o vídeo gerado a partir dela assume por
 * cima quando tiver quadro para mostrar; como os dois partem da mesma
 * imagem, a troca não se vê. A entrada espera o preloader sair (boot.ts),
 * e o scroll desmonta a cena: o texto sobe e some, a foto se aproxima.
 */
export function Hero() {
  const { hero } = useContent().aminosanB;
  const scope = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  /* O autoplay costuma começar antes da hidratação, e aí o `playing` já
     passou quando o React chega: confere o estado e só então escuta. */
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (!v.paused && v.readyState >= 3) {
      setPlaying(true);
      return;
    }
    const on = () => setPlaying(true);
    v.addEventListener("playing", on, { once: true });
    return () => v.removeEventListener("playing", on);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(".hb-title", { type: "lines", mask: "lines" });

        gsap.set(split.lines, { yPercent: 110 });
        gsap.set([".hb-aside > *", ".hb-record > *"], { opacity: 0, y: 24 });
        gsap.set(".hb-media", { scale: 1.12 });

        /* O aviso do preloader chega fora do efeito: se a cena já foi
           desmontada (Strict Mode monta duas vezes), não há o que animar. */
        let alive = true;
        let intro: gsap.core.Timeline | undefined;
        void booted.then(() => {
          if (!alive) return;
          intro = gsap
            .timeline({ defaults: { ease: "expo.out", duration: 1.4 } })
            .to(".hb-media", { scale: 1, duration: 2.2 }, 0)
            .to(split.lines, { yPercent: 0, stagger: 0.12 }, 0.15)
            .to(".hb-aside > *", { opacity: 1, y: 0, stagger: 0.08, duration: 1 }, 0.55)
            .to(".hb-record > *", { opacity: 1, y: 0, stagger: 0.06, duration: 0.9 }, 0.8);
        });

        /* Saída presa ao scroll: enquanto o hero rola para fora, a foto se
           aproxima e o texto sobe mais rápido que ela. */
        gsap
          .timeline({
            scrollTrigger: {
              trigger: scope.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          })
          .to(".hb-media-wrap", { yPercent: 18, scale: 1.08, ease: "none" }, 0)
          .to(".hb-title", { yPercent: -40, opacity: 0, ease: "none" }, 0)
          .to(".hb-aside", { yPercent: -30, opacity: 0, ease: "none" }, 0)
          .to(".hb-shade", { opacity: 0.85, ease: "none" }, 0);

        return () => {
          alive = false;
          intro?.kill();
          split.revert();
        };
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      data-nav-theme="dark"
      className="relative flex h-[100svh] min-h-[640px] flex-col overflow-hidden bg-forest text-cream"
    >
      {/* No celular a cena ocupa só o alto e se funde no verde: em retrato a
          bombona fica grande demais para dividir o espaço com o texto. */}
      <div className="hb-media-wrap absolute inset-x-0 top-0 h-[66%] will-change-transform lg:inset-0 lg:h-auto">
        <div className="hb-media absolute inset-0">
          <Image
            src="/img/aminosan-b/hero.webp"
            alt=""
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-[50%_60%]"
          />
          <video
            ref={video}
            className={`absolute inset-0 h-full w-full object-cover object-[50%_60%] transition-opacity duration-1000 ${playing ? "opacity-100" : "opacity-0"}`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          >
            <source src="/video/aminosan-b/hero.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[40%] h-[27%] bg-[linear-gradient(180deg,transparent,var(--color-forest)_92%)] lg:hidden" />

      {/* Leitura do texto: escurece o topo e o pé, deixa o produto no meio. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(22,38,27,0.78)_0%,rgba(22,38,27,0.1)_34%,rgba(22,38,27,0.05)_62%,rgba(22,38,27,0.9)_100%)]"
      />
      <div aria-hidden className="hb-shade pointer-events-none absolute inset-0 bg-forest opacity-0" />

      <div className="wrap relative flex flex-1 flex-col pt-[clamp(96px,14svh,150px)]">
        <h1 className="hb-title text-[clamp(46px,7.4vw,140px)] leading-[0.92] tracking-[-0.035em]">
          {hero.heading.map((line) => (
            <span key={line} className="block whitespace-nowrap">
              {line}
            </span>
          ))}
        </h1>

        <div className="hb-aside mt-auto mb-8 max-w-[340px] self-end lg:absolute lg:top-[46%] lg:right-0 lg:mb-0">
          <h2 className="text-[clamp(24px,2.2vw,38px)] leading-[1.05] tracking-[-0.02em]">
            {hero.aside.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className={`${microCaps} mt-4 text-cream/75`}>{hero.aside.body}</p>
          <Cta href={hero.aside.cta.href} className="mt-6">
            {hero.aside.cta.label}
          </Cta>
        </div>
      </div>

      <div className="relative border-t border-cream/15">
        <div className="wrap hb-record flex flex-wrap items-center gap-x-10 gap-y-3 py-6 lg:justify-between">
          <p className={`${microCaps} text-lime`}>{hero.record.label}</p>
          {hero.record.items.map((item) => (
            <p key={item} className="font-display text-[13px] tracking-[-0.01em] text-cream/80 lg:text-[15px]">
              {item}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
