"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, SplitText, useGSAP, START } from "@/lib/gsap";
import { useContent } from "@/components/layout/LocaleProvider";
import s from "./Programs.module.css";

const PHOTOS = [
  { src: "/img/programs/bullseye.webp", position: "62% 50%" },
  { src: "/img/programs/experience.webp", position: "50% 50%" },
  { src: "/img/programs/juma360.webp", position: "50% 42%" },
] as const;

/** Lê uma inclinação declarada no CSS (`--tilt-photo: -4.6deg`) como número. */
const tiltOf = (node: Element, prop: string) =>
  parseFloat(window.getComputedStyle(node).getPropertyValue(prop)) || 0;

/**
 * As três frentes por trás do galão, como uma trilha.
 *
 * Nenhum degrau aparece de uma vez: a entrada está presa à rolagem, e cada par
 * se expande no lugar conforme a frente sobe a tela. Depois de montado ele não
 * congela — o card da leitura segue com um movimento lento, curto o bastante
 * para não disputar atenção com o texto.
 *
 * O mobile não é o desktop espremido. Lá cada frente é um par de cartões
 * inclinados em sentidos opostos e encaixados um no outro, e a entrada os abre
 * como um leque: os dois partem planos e sobrepostos e vão se separando até as
 * inclinações de repouso. No desktop a inclinação é zero e o zigue-zague passa
 * a ser o recuo do bloco inteiro dentro do contêiner.
 *
 * Os transforms moram em duas camadas de propósito: o invólucro (`*Slot`) é da
 * entrada, a camada de dentro é do repouso. Se dividissem o mesmo elemento, uma
 * animação apagaria a outra.
 */
export function Programs() {
  const { programs } = useContent().home;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const q = gsap.utils.selector(section);
      const headline = q("[data-program-title]")[0];
      const intro = q("[data-programs-intro]");
      const fronts = q("[data-front]");

      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          wide: "(min-width: 1100px)",
        },
        (ctx) => {
          const { motion, wide } = ctx.conditions as { motion: boolean; wide: boolean };
          /* Sem movimento, a trilha já está montada: o CSS é o estado final. */
          if (!motion) return;

          let headlineSplit: SplitText | undefined;

          /* ---- cabeçalho */
          if (headline) {
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
          }

          gsap.from(
            intro.filter((item) => item !== headline),
            {
              autoAlpha: 0,
              y: 24,
              duration: 0.7,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: { trigger: section, start: START, toggleActions: "play none none none" },
            },
          );

          /* ---- os degraus */
          fronts.forEach((front, i) => {
            /* Ímpar é o degrau invertido: no desktop o bloco encosta no outro
               lado, no mobile as inclinações trocam de sinal. */
            const flipped = i % 2 === 1;

            const block = front.querySelector<HTMLElement>("[data-front-block]")!;
            const photoSlot = front.querySelector<HTMLElement>("[data-front-photo]")!;
            const cardSlot = front.querySelector<HTMLElement>("[data-front-card]")!;
            const photo = front.querySelector<HTMLElement>("[data-front-photo-inner]")!;
            const card = front.querySelector<HTMLElement>("[data-front-card-inner]")!;
            const img = front.querySelector<HTMLElement>("[data-front-img]")!;
            const sheen = front.querySelector<HTMLElement>("[data-front-sheen]")!;
            const copy = front.querySelectorAll<HTMLElement>("[data-front-copy]");

            const tiltPhoto = tiltOf(block, "--tilt-photo");
            const tiltCard = tiltOf(block, "--tilt-card");

            /* A foto corre mais devagar que a página — a folga vertical de
               .photo existe para isto. */
            gsap.fromTo(
              img,
              { yPercent: -3.5 },
              {
                yPercent: 3.5,
                ease: "none",
                force3D: false,
                scrollTrigger: { trigger: front, start: "top bottom", end: "bottom top", scrub: true },
              },
            );

            /* ---- entrada presa à rolagem.
               O par se expande no lugar: sai de menor e sobreposto e cresce até
               a posição de repouso. No mobile os dois partem planos (giro zero)
               e abrem como leque até as inclinações. */
            const enter = gsap.timeline({
              /* `force3D: false` em toda a cena: o translate3d que o GSAP põe
                 por padrão promove a camada e devolve a borda serrilhada que a
                 inclinação expôs. Ver o comentário em .photoSlot. */
              defaults: { ease: "power2.out", force3D: false },
              scrollTrigger: {
                trigger: front,
                start: wide ? "top 88%" : "top 90%",
                end: wide ? "top 42%" : "top 46%",
                scrub: 0.8,
              },
            });

            enter.fromTo(
              photoSlot,
              {
                autoAlpha: 0,
                scale: wide ? 0.9 : 0.93,
                rotate: 0,
                xPercent: wide ? (flipped ? 4 : -4) : 0,
                yPercent: wide ? 5 : 7,
              },
              { autoAlpha: 1, scale: 1, rotate: tiltPhoto, xPercent: 0, yPercent: 0, duration: 1 },
              0,
            );

            enter.fromTo(
              cardSlot,
              {
                autoAlpha: 0,
                scale: wide ? 0.88 : 0.91,
                rotate: 0,
                xPercent: wide ? (flipped ? -5 : 5) : 0,
                yPercent: wide ? 8 : -9,
              },
              { autoAlpha: 1, scale: 1, rotate: tiltCard, xPercent: 0, yPercent: 0, duration: 1 },
              wide ? 0.16 : 0.12,
            );

            enter.fromTo(
              copy,
              { autoAlpha: 0, y: 18 },
              { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07 },
              0.44,
            );

            /* ---- repouso: o que continua acontecendo depois de montado.
               Fica na camada de dentro, e só roda enquanto a frente está na
               tela — nenhum dos três gasta quadro fora dela. */

            /* Uma faixa de luz atravessa o card na diagonal, devagar e com um
               intervalo longo entre as passadas: perto do limiar de percepção,
               que é onde ela dá vida à superfície sem disputar com o texto. */
            gsap.set(sheen, { rotate: 14, force3D: false });
            const idle = [
              gsap.fromTo(
                sheen,
                { xPercent: 0 },
                {
                  xPercent: 340,
                  duration: 4.2,
                  ease: "sine.inOut",
                  force3D: false,
                  repeat: -1,
                  repeatDelay: 6.5,
                  paused: true,
                },
              ),
            ];

            if (wide) {
              /* O card flutua sobre a foto — sobe, gira um fio e volta. */
              idle.push(
                gsap.to(card, {
                  y: -11,
                  rotate: flipped ? -0.35 : 0.35,
                  duration: 4.8,
                  ease: "sine.inOut",
                  force3D: false,
                  yoyo: true,
                  repeat: -1,
                  paused: true,
                }),
              );
            } else {
              /* No mobile o repouso brinca com a inclinação: os dois cartões
                 giram em sentidos opostos, então o par abre e fecha como um
                 leque que ainda está assentando. As durações são diferentes de
                 propósito — assim eles saem de fase e o ciclo nunca se repete
                 igual. */
              idle.push(
                gsap.to(card, {
                  rotate: flipped ? -1.4 : 1.4,
                  y: -7,
                  duration: 5.4,
                  ease: "sine.inOut",
                  force3D: false,
                  yoyo: true,
                  repeat: -1,
                  paused: true,
                }),
                gsap.to(photo, {
                  rotate: flipped ? 1.2 : -1.2,
                  y: 5,
                  duration: 6.6,
                  ease: "sine.inOut",
                  force3D: false,
                  yoyo: true,
                  repeat: -1,
                  paused: true,
                }),
              );
            }

            ScrollTrigger.create({
              trigger: front,
              start: "top 72%",
              end: "bottom 22%",
              onToggle: (self) => idle.forEach((tween) => (self.isActive ? tween.play() : tween.pause())),
            });
          });

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

      <ol className={`${s.wrap} ${s.trail}`}>
        {programs.cards.map((card, i) => (
          <li key={card.id} data-front data-flip={i % 2 === 1 || undefined} className={s.front}>
            <div data-front-block className={s.block}>
              <div data-front-photo className={s.photoSlot}>
                <div data-front-photo-inner className={s.photoFrame}>
                  <div data-front-img className={s.photo}>
                    <Image
                      src={PHOTOS[i].src}
                      alt=""
                      fill
                      sizes="(max-width: 1100px) 90vw, 46vw"
                      quality={90}
                      className={s.image}
                      style={{ objectPosition: PHOTOS[i].position }}
                    />
                  </div>
                  <div className={s.photoShade} aria-hidden />
                </div>
              </div>

              <div data-front-card className={s.cardSlot}>
                <article data-front-card-inner className={s.card} aria-labelledby={`program-${card.id}`}>
                  <span data-front-sheen className={s.sheen} aria-hidden />
                  <div className={s.cardBody}>
                    <p data-front-copy className={s.eyebrow}>
                      {card.eyebrow}
                    </p>
                    <h3 data-front-copy id={`program-${card.id}`} className={s.title}>
                      {card.title}
                    </h3>
                    <p data-front-copy className={s.body}>
                      {card.body}
                    </p>
                    {card.tags && (
                      <ul data-front-copy className={s.tags}>
                        {card.tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    )}
                    {card.closing && (
                      <p data-front-copy className={s.closing}>
                        {card.closing.map((line, j) => (
                          <Fragment key={line}>
                            {j > 0 && <br />}
                            {line}
                          </Fragment>
                        ))}
                      </p>
                    )}
                    {card.note && (
                      <p data-front-copy className={s.note}>
                        {card.note}
                      </p>
                    )}
                  </div>
                </article>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
