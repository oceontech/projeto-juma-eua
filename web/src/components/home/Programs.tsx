"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useContent } from "@/components/layout/LocaleProvider";
import s from "./Programs.module.css";

/** Uma foto por frente, na ordem de `programs.cards`. */
const PHOTOS = [
  { src: "/img/programs/bullseye.webp", position: "62% 50%" },
  { src: "/img/programs/experience.webp", position: "50% 50%" },
  { src: "/img/programs/juma360.webp", position: "50% 42%" },
] as const;

/*
 * A cena presa conta em unidades: cada frente ocupa uma. A troca começa no
 * início da unidade seguinte e dura TURN — a foto nova sobe de baixo, com os
 * cantos de cima redondos, por cima da anterior, e o texto troca por máscara.
 * O resto da unidade é leitura parada.
 */
const TURN = 0.55;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * As três frentes que rodam o ano todo, como capítulos em tela cheia — a
 * mesma linguagem imersiva da hero: foto de ponta a ponta, título grande
 * subindo de dentro de uma máscara e um trilho de progresso que também navega.
 */
export function Programs() {
  const { programs } = useContent().home;
  const count = programs.cards.length;
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);

  /* Rola até o meio da leitura de cada frente. */
  const goTo = (i: number) => {
    const st = trigger.current;
    if (!st) {
      root.current?.querySelectorAll("[data-chapter]")[i]?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const at = i === 0 ? 0.2 : i + TURN + 0.15;
    window.scrollTo({ top: st.start + (st.end - st.start) * (at / count), behavior: "smooth" });
  };

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const q = gsap.utils.selector(section);
      const track = q("[data-programs-track]")[0];
      const chapters = q("[data-chapter]");
      const photos = q("[data-photo]");
      const dims = q("[data-dim]");
      const fills = q("[data-fill]");
      const marks = q("[data-mark]");
      const intro = q("[data-intro]");
      const lines = (el: Element) => el.querySelectorAll("[data-line]");
      const fades = (el: Element) => el.querySelectorAll("[data-fade]");
      if (!track || chapters.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let active = -1;
        const mark = (i: number) => {
          if (i === active) return;
          active = i;
          marks.forEach((m, j) => {
            m.dataset.state = j === i ? "active" : j < i ? "done" : "next";
            if (j === i) m.setAttribute("aria-current", "step");
            else m.removeAttribute("aria-current");
          });
        };
        mark(0);

        /* Quadro de partida: só a primeira frente existe. */
        gsap.set(chapters.slice(1), { clipPath: "inset(100% 0% 0% 0% round 48px 48px 0px 0px)" });
        gsap.set(photos, { scale: 1.22 });
        gsap.set(dims, { opacity: 0 });
        gsap.set(fills, { scaleX: 0, transformOrigin: "left center" });
        chapters.slice(1).forEach((chapter) => {
          /* `y` junto do `yPercent`, sempre: sem ele o GSAP lê a translação já
             aplicada como pixels e soma com a porcentagem. */
          gsap.set(lines(chapter), { y: 0, yPercent: 115 });
          gsap.set(fades(chapter), { autoAlpha: 0, y: 28 });
        });

        /* Entrada: enquanto a seção sobe, a primeira frente chega — a foto
           afasta, o título sobe de dentro do corte e o resto assenta. */
        gsap
          .timeline({
            scrollTrigger: { trigger: track, start: "top 80%", end: "top top", scrub: 0.6 },
          })
          .fromTo(photos[0], { scale: 1.4 }, { scale: 1.22, duration: 1, ease: "none" }, 0)
          .fromTo(intro, { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.08, ease: "power2.out" }, 0.1)
          .fromTo(lines(chapters[0]), { y: 0, yPercent: 115 }, { y: 0, yPercent: 0, duration: 0.55, ease: "power3.out" }, 0.3)
          .fromTo(fades(chapters[0]), { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.06, ease: "power2.out" }, 0.45);

        /* A cena presa. */
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) =>
              mark(gsap.utils.clamp(0, count - 1, Math.floor(self.progress * count - TURN / 2))),
          },
        });
        trigger.current = tl.scrollTrigger ?? null;

        chapters.forEach((chapter, i) => {
          /* A foto afasta devagar enquanto a frente está em cena. */
          tl.fromTo(photos[i], { scale: 1.22 }, { scale: 1.02, duration: i === count - 1 ? 1 : 1 + TURN, immediateRender: false }, i);
          tl.fromTo(fills[i], { scaleX: 0 }, { scaleX: 1, duration: 1, immediateRender: false }, i);
          if (i === 0) return;

          const previous = chapters[i - 1];
          tl
            /* O texto de quem sai sobe e some antes de a foto nova cobrir. */
            .to(fades(previous), { y: -24, autoAlpha: 0, duration: TURN * 0.4, stagger: 0.02, ease: "power2.in" }, i)
            .to(lines(previous), { y: 0, yPercent: -115, duration: TURN * 0.45, ease: "power2.in" }, i)
            .to(dims[i - 1], { opacity: 0.65, duration: TURN, ease: "power1.in" }, i)
            /* A foto nova sobe de baixo, com os cantos de cima redondos que
               se desfazem na chegada. */
            .fromTo(
              chapter,
              { clipPath: "inset(100% 0% 0% 0% round 48px 48px 0px 0px)" },
              { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)", duration: TURN, ease: "power3.inOut", immediateRender: false },
              i,
            )
            .fromTo(lines(chapter), { y: 0, yPercent: 115 }, { y: 0, yPercent: 0, duration: TURN * 0.7, ease: "power3.out", immediateRender: false }, i + TURN * 0.5)
            .fromTo(
              fades(chapter),
              { y: 28, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: TURN * 0.6, stagger: 0.03, ease: "power2.out", immediateRender: false },
              i + TURN * 0.65,
            );
        });

        tl.set({}, {}, count);

        return () => {
          trigger.current = null;
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="programs"
      className={s.section}
      data-nav-theme="dark"
      aria-labelledby="programs-title"
    >
      <div data-programs-track className={s.track} style={{ ["--count" as string]: count }}>
        <div className={s.window}>
          {programs.cards.map((card, i) => (
            <article
              key={card.id}
              data-chapter
              className={s.chapter}
              style={{ zIndex: i + 1 }}
              aria-labelledby={`program-${card.id}`}
            >
              <div data-photo className={s.photo}>
                <Image
                  src={PHOTOS[i]?.src ?? PHOTOS[0].src}
                  alt=""
                  fill
                  sizes="100vw"
                  quality={90}
                  className={s.image}
                  style={{ objectPosition: PHOTOS[i]?.position }}
                />
              </div>
              <div className={s.scrim} aria-hidden />
              <div data-dim className={s.dim} aria-hidden />

              <div className={s.copy}>
                <p data-fade className={s.eyebrow}>
                  <span className={s.index}>{pad(i + 1)}</span>
                  {card.eyebrow}
                </p>
                <h3 id={`program-${card.id}`} className={s.title}>
                  <span className={s.mask}>
                    <span data-line>{card.title}</span>
                  </span>
                </h3>
                <p data-fade className={s.body}>
                  {card.body}
                </p>
                {card.tags && (
                  <ul data-fade className={s.tags}>
                    {card.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                )}
                {card.closing && (
                  <p data-fade className={s.closing}>
                    {card.closing.map((line, j) => (
                      <Fragment key={line}>
                        {j > 0 && <br />}
                        {line}
                      </Fragment>
                    ))}
                  </p>
                )}
                {card.note && (
                  <p data-fade className={s.note}>
                    {card.note}
                  </p>
                )}
              </div>
            </article>
          ))}

          <header className={s.intro}>
            <h2 id="programs-title" data-intro className={s.headline}>
              {programs.headline.map((line, i) => (
                <Fragment key={line}>
                  {i > 0 && <br />}
                  {line}
                </Fragment>
              ))}
            </h2>
            <p data-intro className={s.lede}>
              {programs.body}
            </p>
          </header>

          <nav className={s.rail} aria-label={programs.headline.join(" ")}>
            {programs.cards.map((card, i) => (
              <button
                key={card.id}
                type="button"
                data-mark
                data-state={i === 0 ? "active" : "next"}
                className={s.railItem}
                onClick={() => goTo(i)}
              >
                <span className={s.railNum}>{pad(i + 1)}</span>
                <span className={s.railTitle}>{card.title}</span>
                <span className={s.railBar} aria-hidden>
                  <span data-fill className={s.railFill} />
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
