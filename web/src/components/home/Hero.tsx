"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { booted } from "@/lib/boot";
import { hero } from "@/content/home";

/**
 * Hero — a cena do Figma (frame 2688 × 1614) em seis camadas: céu, bandeira
 * do Brasil, bandeira dos EUA, véu branco do horizonte, trator/solo e folhas
 * em primeiro plano. A geometria vive em globals.css (.hero e filhas); aqui
 * fica só o movimento.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * A invariante da travessia
 *
 * O hero e o bloco seguinte nunca dividem a tela — e nunca se sobrepõem no
 * documento. O pin usa espaçador (`pinSpacing: true`), que é o que garante
 * isso: o trecho travado vira altura de rolagem, e o bloco seguinte começa
 * depois da caixa do hero, não por dentro dela.
 *
 * Foi tentador puxar o bloco seguinte para dentro do hero com margem negativa,
 * para o preto do fim da cena não durar uma tela. Não vale: assim que os dois
 * ocupam o mesmo espaço, alguém precisa arbitrar quem fica na frente, e a
 * única informação disponível para arbitrar é o progresso da cena — que atrasa
 * em relação ao scroll. Todo atraso vira faixa preta, pisca ou conteúdo
 * cortado, e rolar rápido só aumenta o atraso. Sem sobreposição, não há
 * árbitro e a classe inteira de defeitos deixa de existir.
 *
 * E não há preto sobrando: no instante em que o pin solta, o topo do bloco
 * seguinte já está no pé da janela, subindo. O que se atravessa até o título
 * aparecer é a caixa do hero saindo — preta, contra o preto dele.
 *
 * De quebra, o atraso do scrub fica inofensivo: enquanto a cena se desfaz o
 * hero está travado e cobre a janela inteira, então não há estado
 * inconsistente para aparecer. O único ponto que precisa bater exato é a
 * emenda — o último quadro do hero contra o preto do bloco seguinte —, e por
 * isso o fecho em preto tem gatilho próprio, sem atraso nenhum.
 *
 * Três assuntos, um dono cada:
 *
 *   hero-exit    o pin e a cena, com scrub (pode atrasar, e atrasa macio);
 *   hero-close   o fecho em preto e o tom da barra do topo, sem atraso;
 *   intro        a entrada, que não depende de scroll — roda ao sair o véu.
 * ─────────────────────────────────────────────────────────────────────────
 */

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scene = root.current;
      if (!scene) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { animate } = context.conditions as { animate: boolean };
          if (!animate) return;

          const html = document.documentElement;

          const leaves = scene.querySelector<HTMLElement>("[data-hero='leaves-img']");
          const inner = scene.querySelector<HTMLElement>(".hero-scene");

          /* ------------------------------------------------------ entrada */
          /* As camadas assentam de posições ligeiramente deslocadas — a cena
             chega se acomodando, e não pronta. Mexe nos mesmos transforms que
             o scroll dirige depois, e é por isso que a travessia é toda
             `fromTo`: com os dois extremos declarados ela não herda um valor
             colhido no meio desta entrada nem o perde num `invalidate()`. */
          const intro = gsap
            .timeline({ paused: true, defaults: { duration: 1.3, ease: "power3.out" } })
            .fromTo("[data-hero='sky']", { scale: 1.07 }, { scale: 1 }, 0)
            .fromTo(
              "[data-hero='flag-br']",
              { xPercent: -7, yPercent: 5 },
              { xPercent: 0, yPercent: 0 },
              0.1,
            )
            .fromTo(
              "[data-hero='flag-us']",
              { xPercent: 7, yPercent: 5 },
              { xPercent: 0, yPercent: 0 },
              0.1,
            )
            .fromTo("[data-hero='ground']", { yPercent: 5 }, { yPercent: 0 }, 0.05)
            .fromTo("[data-hero='leaves']", { yPercent: 9 }, { yPercent: 0 }, 0)
            .fromTo(
              "[data-hero-tagline]",
              { opacity: 0, y: 18 },
              { opacity: 1, y: 0, duration: 0.7 },
              0.25,
            )
            .fromTo(
              "[data-hero-title]",
              { opacity: 0, y: 28 },
              { opacity: 1, y: 0, duration: 0.8 },
              0.4,
            )
            .fromTo(
              "[data-hero-sub]",
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.8 },
              0.55,
            );

          /* Pausada no quadro zero desde o primeiro layout: nada aparece
             parado antes de animar. Só corre quando o véu do preloader sai. */
          intro.progress(0);
          void booted.then(() => {
            if (!root.current) return;
            /* Se já rolaram por baixo do véu, a cena não é mais a de abertura. */
            if (window.scrollY > 4) intro.progress(1);
            else intro.play();
          });

          /* ---------------------------------------------------- travessia */
          /* A cena é mais alta que a janela; este é o curso que falta para o
             pé do palco encostar no pé da tela. */
          const win = scene.querySelector<HTMLElement>(".hero-window");
          const travel = () =>
            -Math.max(0, (inner?.offsetHeight ?? 0) - (win?.offsetHeight ?? 0));

          /* `power1.in` nas camadas: contido no começo, ganhando corpo até o
             fim. Como a linha do tempo é lida por progresso, a volta é o
             espelho exato — sai rápida e vai freando. Uma curva só descreve as
             duas direções, que é como um parallax se comporta quando é feito
             de verdade. */
          const RIDE = "power1.in";

          const moving = Array.from(
            scene.querySelectorAll<HTMLElement>(
              "[data-hero='scene'], [data-hero='sky'], [data-hero='flag-br']," +
                " [data-hero='flag-us'], [data-hero='ground'], [data-hero='leaves']",
            ),
          );

          gsap
            .timeline({
              defaults: { duration: 1 },
              scrollTrigger: {
                id: "hero-exit",
                trigger: scene,
                /* Do topo da seção até a janela grudada terminar de subir: é
                   exatamente o trecho em que ela fica colada. */
                start: "top top",
                end: "bottom bottom",
                /* O amortecimento inteiro do efeito é este número. Tudo o mais
                   que eu tinha posto aqui — mola própria, teto de velocidade,
                   limite de atraso, imã de rolagem, resgate — existia para
                   refinar o que ele já faz, e cada peça dessas foi a origem de
                   um defeito: eram várias coisas mandando na mesma posição ao
                   mesmo tempo. Uma só manda, e ela apenas LÊ o scroll. */
                scrub: 1,
                invalidateOnRefresh: true,
                /* Recalcula antes de quem depende do fim deste trecho. */
                refreshPriority: 10,
                /* Promove as camadas enquanto elas andam. Cada uma é um bitmap
                   grande com transform e escala; sem promoção o navegador
                   rasteriza de novo a cada quadro, e é daí que vem a aspereza
                   no movimento. Fora do trecho a promoção sai: camada promovida
                   custa memória de vídeo o tempo todo. */
                onToggle: (self) => {
                  const on = self.isActive;
                  moving.forEach((el) => {
                    el.style.willChange = on ? "transform" : "";
                  });
                  if (leaves) leaves.style.willChange = on ? "filter" : "";
                },
                onUpdate: (self) => {
                  /* Rolar durante a entrada não vira disputa: a entrada corre
                     até o fim e o scroll assume. */
                  if (self.progress > 0.01 && intro.progress() < 1) intro.timeScale(4).play();
                },
              },
            })
            .fromTo("[data-hero='scene']", { y: 0 }, { y: travel, ease: RIDE, duration: 0.8 }, 0)
            .fromTo(
              "[data-hero='sky']",
              { yPercent: 0, scale: 1 },
              { yPercent: -13, scale: 1.12, ease: RIDE },
              0,
            )
            .fromTo(
              "[data-hero='flag-br']",
              { xPercent: 0, yPercent: 0, scale: 1 },
              { xPercent: -134, yPercent: -66, scale: 1.12, ease: RIDE },
              0,
            )
            .fromTo(
              "[data-hero='flag-us']",
              { xPercent: 0, yPercent: 0, scale: 1 },
              { xPercent: 134, yPercent: -66, scale: 1.12, ease: RIDE },
              0,
            )
            .fromTo(
              "[data-hero='ground']",
              { yPercent: 0, scale: 1 },
              { yPercent: 78, scale: 1.06, ease: RIDE },
              0,
            )
            .fromTo(
              "[data-hero='leaves']",
              { yPercent: 0, scale: 1 },
              { yPercent: -47, scale: 1.14, ease: RIDE },
              0,
            )
            .fromTo(
              "[data-hero='leaves-img']",
              { filter: "blur(0px)" },
              { filter: "blur(11px)", ease: RIDE },
              0,
            )
            /* O texto sai antes do resto: some enquanto a cena ainda se abre. */
            .fromTo(
              "[data-hero='copy']",
              { yPercent: 0, opacity: 1 },
              { yPercent: -42, opacity: 0, ease: "power1.in", duration: 0.45 },
              0,
            )
            /* As bandeiras só apagam depois de já estarem saindo de quadro —
               apagar junto com o movimento faria elas sumirem no lugar.
               `fromTo` com o 0.6 do CSS escrito à mão: um `to` guarda o valor
               inicial na primeira execução e `invalidate()` o regrava, o que
               com a cena já desfeita gravava 0 e as bandeiras nunca voltavam. */
            .fromTo(
              "[data-hero='flag-br'], [data-hero='flag-us']",
              { opacity: 0.6 },
              { opacity: 0, ease: "power1.in", duration: 0.28 },
              0.66,
            );

          /* ----------------------------------------------------- a barra */
          /* Do meio do curso em diante a tela vira preta de baixo para cima, e
             a barra do topo não descobre isso pela posição das seções — o
             preto é uma camada que anda, não uma seção. Em vez de um número
             mágico, a cena mede: quando o preto das folhas passa por baixo da
             barra, o tom vira escuro. */
          const tail = scene.querySelector<HTMLElement>(".hero-leaves-tail");
          let tone = "";

          ScrollTrigger.create({
            trigger: scene,
            start: "top top",
            end: "bottom top",
            onUpdate: () => {
              if (!tail) return;
              const next = tail.getBoundingClientRect().top <= 40 ? "dark" : "light";
              if (next === tone) return;
              tone = next;
              html.dataset.navTheme = next;
            },
            onLeave: () => {
              tone = "";
              delete html.dataset.navTheme;
            },
            onLeaveBack: () => {
              tone = "";
              delete html.dataset.navTheme;
            },
          });

          return () => {
            delete html.dataset.navTheme;
          };
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="hero">
      <div className="hero-window">
        <div data-hero="scene" className="hero-scene">
        <Image
          data-hero="sky"
          className="hero-sky"
          src="/img/hero-sky.webp"
          alt=""
          width={2688}
          height={1152}
          sizes="100vw"
          priority
        />

        <div className="hero-stage">
          <Image
            data-hero="flag-br"
            className="hero-flag hero-flag--br"
            src="/img/hero-flag-br.webp"
            alt=""
            width={1238}
            height={810}
            sizes="(max-width: 860px) 120vw, 50vw"
            priority
          />

          {/* A bandeira dos EUA entra espelhada e girada 173,48°. A
              transformação está assada no arquivo, e não em CSS: assim o
              transform do elemento fica livre para o GSAP abrir a bandeira
              na saída. */}
          <Image
            data-hero="flag-us"
            className="hero-flag hero-flag--us"
            src="/img/hero-flag-us.webp"
            alt=""
            width={1388}
            height={993}
            sizes="(max-width: 860px) 125vw, 52vw"
            priority
          />

          {/* Véu do horizonte, trator e o preto que fecha embaixo andam como
              uma peça só: o véu segue o solo, e a faixa preta nunca se
              descola da linha onde a imagem do trator acaba. */}
          <div data-hero="ground" className="hero-ground">
            <span className="hero-flags-fade" aria-hidden />

            <Image
              className="hero-tractor"
              src="/img/hero-tractor.webp"
              alt={hero.tractorAlt}
              width={2688}
              height={1152}
              sizes="(max-width: 860px) 240vw, 100vw"
              priority
            />

            <span className="hero-underfill" aria-hidden />
          </div>

          <div data-hero="leaves" className="hero-leaves">
            <Image
              data-hero="leaves-img"
              src="/img/hero-leaves.webp"
              alt=""
              width={2688}
              height={710}
              sizes="(max-width: 860px) 240vw, 100vw"
              priority
            />
            <span className="hero-leaves-tail" aria-hidden />
          </div>
        </div>

        <div data-hero="copy" className="hero-copy">
          <p
            data-hero-tagline
            className="mb-[clamp(14px,1.7vw,30px)] font-display text-[clamp(9px,0.65vw,12.4px)] tracking-[0.39em] text-muted uppercase"
          >
            {hero.tagline}
          </p>
          <h1
            data-hero-title
            className="mx-auto max-w-[785px] text-h1 leading-none tracking-[-0.01em] text-ink"
          >
            {hero.headline}
          </h1>
          <p
            data-hero-sub
            className="mx-auto mt-[clamp(16px,1.6vw,30px)] max-w-[646px] text-muted"
          >
            {hero.subheadline}
          </p>
        </div>
      </div>

      </div>
    </section>
  );
}
