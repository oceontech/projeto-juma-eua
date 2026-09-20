"use client";

import { Fragment, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, SplitText, useGSAP, START } from "@/lib/gsap";
import { useContent } from "@/components/layout/LocaleProvider";
import s from "./Programs.module.css";

const PHOTOS = [
  { src: "/img/programs/bullseye.webp", position: "62% 50%" },
  { src: "/img/programs/experience.webp", position: "50% 50%" },
  { src: "/img/programs/juma360.webp", position: "50% 42%" },
] as const;

const pad = (n: number) => String(n).padStart(2, "0");

/*
 * Linha do tempo da cena presa, em unidades de duração — mesma gramática da
 * faixa de teste logo abaixo. Cada SWAP é uma travessia: foto e card trocam de
 * lado (de posição, no mobile), e a frente seguinte chega com eles. HOLDS são
 * os pontos em que cada frente está parada e legível, para onde os capítulos
 * rolam quando clicados.
 */
const SWAPS = [1.15, 2.6] as const;
const HOLDS = [0.5, 1.9, 3.35] as const;
const TRAVEL = 0.92;
const TOTAL = 3.9;

/** Meio da travessia: é aí que a leitura já trocou de dono. */
const HALFWAY = TRAVEL / 2;

/**
 * As três frentes por trás do galão.
 *
 * A troca não tem botão de avançar: ela é a própria rolagem. A cena fica presa
 * enquanto as três passam, e cada passagem inverte os lados — a foto que estava
 * à esquerda vai para a direita, o card faz o caminho oposto por cima dela. No
 * mobile, onde a coluna é uma só, a inversão é vertical: quem estava em cima
 * desce, quem estava embaixo sobe.
 */
export function Programs() {
  const { programs } = useContent().home;
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const current = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  /* Clicar num capítulo não troca estado: rola até o ponto de leitura dele e
     deixa a rolagem fazer a troca, como em qualquer outra descida. */
  const goToChapter = (i: number) => {
    const st = trigger.current;
    if (!st) return;
    const top = st.start + (st.end - st.start) * (HOLDS[i] / TOTAL);
    window.scrollTo({ top, behavior: "smooth" });
  };

  useGSAP(
    () => {
      const section = root.current;
      const el = track.current;
      if (!section || !el) return;

      const q = gsap.utils.selector(el);
      const stage = q("[data-program-stage]")[0];
      const photoFrame = q("[data-program-photo]")[0];
      const cardFrame = q("[data-program-card]")[0];
      const media = q("[data-program-media]");
      const panels = q("[data-program-panel]");
      const fills = q("[data-program-fill]");
      const headline = section.querySelector<HTMLElement>("[data-program-title]");
      const intro = Array.from(section.querySelectorAll<HTMLElement>("[data-programs-intro]"));

      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 960px)",
        },
        (ctx) => {
          const { motion, mobile } = ctx.conditions as { motion: boolean; mobile: boolean };
          let headlineSplit: SplitText | undefined;

          /* ---- cabeçalho: linhas sobem de dentro de uma máscara */
          if (motion && headline) {
            headlineSplit = SplitText.create(headline, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.lines, {
                  yPercent: 108,
                  duration: 0.9,
                  stagger: 0.1,
                  ease: "power3.out",
                  scrollTrigger: { trigger: headline, start: START, toggleActions: "play none none none" },
                }),
            });

            gsap.fromTo(
              intro.filter((item) => item !== headline),
              { autoAlpha: 0, y: 24 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: { trigger: section, start: START, toggleActions: "play none none none" },
              },
            );
          }

          /* ---- entrada da cena: a moldura abre, o card chega depois dela.
             Só clip-path e opacidade — os transforms pertencem à travessia. */
          if (motion) {
            gsap
              .timeline({ scrollTrigger: { trigger: stage, start: START, toggleActions: "play none none none" } })
              .fromTo(
                photoFrame,
                { autoAlpha: 0, clipPath: "inset(8% 8% 8% 8% round 36px)" },
                { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0% round 36px)", duration: 1, ease: "power3.out" },
              )
              .fromTo(
                cardFrame,
                {
                  autoAlpha: 0,
                  clipPath: mobile ? "inset(0% 0% 14% 0% round 36px)" : "inset(0% 12% 0% 0% round 36px)",
                },
                { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0% round 36px)", duration: 0.9, ease: "power3.out" },
                0.16,
              )
              .fromTo(
                panels[0].querySelectorAll("[data-program-copy]"),
                { autoAlpha: 0, y: 22 },
                { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power3.out" },
                0.48,
              );
          }

          /* ---- geometria da inversão.
             Medidas de layout (offsetLeft/offsetTop), imunes aos transforms já
             aplicados, e reavaliadas a cada refresh do ScrollTrigger. Levar a
             foto ao fim e o card ao começo devolve exatamente a mesma
             sobreposição, espelhada. */
          const axis = mobile ? "y" : "x";
          const toStart = (node: HTMLElement) => (mobile ? -node.offsetTop : -node.offsetLeft);
          const toEnd = (node: HTMLElement) =>
            mobile
              ? stage.clientHeight - node.offsetHeight - node.offsetTop
              : stage.clientWidth - node.offsetWidth - node.offsetLeft;

          gsap.set(media.slice(1), { autoAlpha: 0 });
          gsap.set(panels.slice(1), { autoAlpha: 0 });
          gsap.set(fills, { scaleX: 0, transformOrigin: "left center" });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "bottom bottom",
              scrub: motion ? 0.65 : true,
              invalidateOnRefresh: true,
              /* O capítulo aceso acompanha a cena: vira no meio da travessia,
                 quando a leitura nova já é a que está em pé. */
              onUpdate: (self) => {
                const at = self.progress * TOTAL;
                const next = at < SWAPS[0] + HALFWAY ? 0 : at < SWAPS[1] + HALFWAY ? 1 : 2;
                if (next !== current.current) {
                  current.current = next;
                  setActiveIndex(next);
                }
              },
            },
          });
          trigger.current = tl.scrollTrigger ?? null;

          tl.to(fills[0], { scaleX: 1, duration: SWAPS[0] }, 0);

          SWAPS.forEach((at, i) => {
            const to = i + 1;
            /* Ímpar é o quadro invertido: foto à direita, card à esquerda. */
            const flipped = to % 2 === 1;

            /* A leitura sai primeiro — o card atravessa vazio, não arrastando
               um texto que já não é o dele. */
            tl.to(panels[i], { autoAlpha: 0, y: motion ? -16 : 0, duration: 0.26, ease: "power2.in" }, at);
            tl.to(fills[to], { scaleX: 1, duration: 1.3 }, at);

            if (!motion) {
              tl.to(media[i], { autoAlpha: 0, duration: 0.3 }, at + 0.2);
              tl.to(media[to], { autoAlpha: 1, duration: 0.3 }, at + 0.2);
              tl.to(panels[to], { autoAlpha: 1, duration: 0.3 }, at + 0.55);
              return;
            }

            /* A travessia. Os dois partem juntos e chegam juntos; o card tem
               z-index maior, então passa por cima — sem colisão a resolver. */
            tl.to(
              photoFrame,
              { [axis]: () => (flipped ? toEnd(photoFrame) : toStart(photoFrame)), duration: TRAVEL, ease: "power3.inOut" },
              at,
            );
            tl.to(
              cardFrame,
              { [axis]: () => (flipped ? toStart(cardFrame) : toEnd(cardFrame)), duration: TRAVEL, ease: "power3.inOut" },
              at,
            );

            /* O gesto que faz a troca parecer pegada, e não deslize: o card se
               levanta e inclina para o lado em que vai, a foto recua por baixo.
               As duas voltam ao repouso ao fim da mesma travessia. */
            tl.to(
              cardFrame,
              {
                keyframes: {
                  scale: [1, 1.035, 1],
                  rotate: [0, flipped ? -0.8 : 0.8, 0],
                  easeEach: "power2.inOut",
                },
                duration: TRAVEL,
              },
              at,
            );
            tl.to(
              photoFrame,
              { keyframes: { scale: [1, 0.955, 1], easeEach: "power2.inOut" }, duration: TRAVEL },
              at,
            );

            /* A foto troca no meio do caminho, atrás do card em movimento. */
            tl.to(media[i], { autoAlpha: 0, duration: 0.4, ease: "power1.inOut" }, at + 0.26);
            tl.fromTo(
              media[to],
              { autoAlpha: 0, scale: 1.08 },
              { autoAlpha: 1, scale: 1, duration: 0.64, ease: "power2.out", immediateRender: false },
              at + 0.26,
            );

            /* E a leitura nova só chega depois que o card assentou no lado novo. */
            tl.fromTo(
              panels[to],
              { autoAlpha: 0, y: 20 },
              { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out", immediateRender: false },
              at + 0.64,
            );
          });

          tl.set({}, {}, TOTAL);

          /* `autoSplit` instala observers próprios; reverter a instância os
             remove junto com o ScrollTrigger criado no `onSplit`. */
          return () => headlineSplit?.revert();
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="programs" className={s.section} data-nav-theme="dark" aria-labelledby="programs-title">
      <header className={`${s.wrap} ${s.intro}`}>
        <h2 id="programs-title" data-program-title data-programs-intro className={s.headline}>
          {programs.headline.map((line, i) => (
            <Fragment key={line}>
              {i > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </h2>
        <p data-programs-intro className={s.lede}>
          {programs.body}
        </p>
      </header>

      {/* Curso da rolagem: a cena fica presa enquanto as três frentes passam */}
      <div ref={track} className={s.track}>
        <div className={s.sticky}>
          <div className={s.wrap}>
            <div data-program-stage className={s.stage}>
              <div data-program-photo className={s.photoFrame}>
                {PHOTOS.map((photo, i) => (
                  <div
                    key={photo.src}
                    data-program-media
                    className={s.photo}
                    style={i === 0 ? undefined : { opacity: 0, visibility: "hidden" }}
                  >
                    <Image
                      src={photo.src}
                      alt=""
                      fill
                      sizes="(max-width: 960px) 100vw, 52vw"
                      quality={90}
                      className={s.image}
                      style={{ objectPosition: photo.position }}
                    />
                  </div>
                ))}
                <div className={s.photoShade} aria-hidden />
              </div>

              <div data-program-card className={s.card}>
                {programs.cards.map((card, i) => (
                  <article
                    key={card.id}
                    data-program-panel
                    className={s.panel}
                    aria-labelledby={`program-${card.id}`}
                    aria-hidden={i === activeIndex ? undefined : true}
                    style={i === 0 ? undefined : { opacity: 0, visibility: "hidden" }}
                  >
                    <p data-program-copy className={s.eyebrow}>
                      {card.eyebrow}
                    </p>
                    <h3 data-program-copy id={`program-${card.id}`} className={s.title}>
                      {card.title}
                    </h3>
                    <p data-program-copy className={s.body}>
                      {card.body}
                    </p>
                    {card.tags && (
                      <ul data-program-copy className={s.tags}>
                        {card.tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    )}
                    {card.closing && (
                      <p data-program-copy className={s.closing}>
                        {card.closing.map((line, j) => (
                          <Fragment key={line}>
                            {j > 0 && <br />}
                            {line}
                          </Fragment>
                        ))}
                      </p>
                    )}
                    {card.note && (
                      <p data-program-copy className={s.note}>
                        {card.note}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </div>

            <nav className={s.controls} aria-label={programs.controlsLabel}>
              {programs.cards.map((program, i) => (
                <button
                  key={program.id}
                  type="button"
                  className={s.chapter}
                  data-active={i === activeIndex || undefined}
                  onClick={() => goToChapter(i)}
                  aria-current={i === activeIndex ? "true" : undefined}
                >
                  <span className={s.chapterIndex}>{pad(i + 1)}</span>
                  <span className={s.chapterName}>{program.title}</span>
                  <span className={s.chapterRail} aria-hidden>
                    <span data-program-fill className={s.chapterFill} />
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
