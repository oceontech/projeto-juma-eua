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

/** Atraso do `scrub`, em segundos. Também mede a espera da flutuação. */
const SCRUB = 1;

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
          narrow: "(max-width: 860px)",
        },
        (context) => {
          const { animate, narrow } = context.conditions as {
            animate: boolean;
            narrow: boolean;
          };
          if (!animate) return;

          const html = document.documentElement;
          /* Liga a subida do bloco seguinte (globals.css). */
          html.dataset.heroPin = "on";

          const leaves = scene.querySelector<HTMLElement>("[data-hero='leaves-img']");

          /* Liga e desliga a flutuação das bandeiras (globals.css). Ela só
             roda com o parallax parado; a espera é a do próprio `scrub`, que
             continua acomodando a cena depois do último evento de rolagem —
             soltar antes faria a bandeira flutuar enquanto ainda desliza. */
          let settling = 0;
          scene.dataset.calm = "on";
          const stir = () => {
            scene.dataset.calm = "off";
            clearTimeout(settling);
            settling = window.setTimeout(() => {
              scene.dataset.calm = "on";
            }, SCRUB * 1000 + 120);
          };

          const inner = scene.querySelector<HTMLElement>(".hero-scene");
          /* Fora do escopo do useGSAP: o bloco seguinte não é filho do hero,
             então precisa vir por referência e não por seletor. */
          const next = document.querySelector<HTMLElement>("#brazil");

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
                scrub: SCRUB,
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
                  /* Enquanto a cena manda na tela, a barra do topo fica sem
                     lâmina de vidro: o que está atrás dela muda a cada quadro,
                     e um retângulo fosco parado em cima disso lê como sujeira.
                     Este trecho é exatamente o da travessia — passada ela, a
                     barra volta ao vidro normal da página. */
                  if (on) html.dataset.heroOver = "on";
                  else delete html.dataset.heroOver;
                },
                /* O primeiro estado não vem de um toggle: numa carga já
                   rolada, sem isto a barra nasceria com vidro sobre a cena. */
                onRefresh: (self) => {
                  if (self.isActive) html.dataset.heroOver = "on";
                  else delete html.dataset.heroOver;
                },
                onUpdate: (self) => {
                  /* Rolar durante a entrada não vira disputa: a entrada corre
                     até o fim e o scroll assume. */
                  if (self.progress > 0.01 && intro.progress() < 1) intro.timeScale(4).play();
                  stir();
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
              /* O trator sobe JUNTO com as folhas, e bem mais devagar: -8
                 contra os -82 delas, um décimo do curso. Subir os dois na
                 mesma direção com velocidades diferentes é o que faz
                 profundidade — indo em sentidos opostos, a cena se rasga ao
                 meio em vez de se afastar. E o pouco curso aqui é de
                 propósito: quanto menos ele anda, mais tempo as folhas têm
                 para alcançá-lo e cobrí-lo.

                 Vale nos dois formatos, com números diferentes porque a
                 porcentagem é da altura do palco e no estreito ele é quase
                 metade: os mesmos -8 ali dariam 48px de curso contra os 200
                 do largo, um movimento que não se vê. Os -20 devolvem a
                 proporção — o trator anda pouco mais de um terço do que
                 andam as folhas, nos dois formatos. O pé não descobre nada
                 ao subir: `.hero-underfill` desce muito além do palco e
                 viaja junto com esta camada.

                 O zoom é o mesmo nos dois, e é ele que sustenta a sensação de
                 aproximação onde o curso é curto. */
              { yPercent: narrow ? -20 : -8, scale: 1.3, ease: RIDE },
              0,
            )
            .fromTo(
              "[data-hero='leaves']",
              { yPercent: 0, scale: 1 },
              /* Bem mais rápido que o trator, para engolir ele: -82 contra os
                 -34 dele no largo. Elas já pintam na frente por ordem de DOM —
                 vêm depois do solo, e as duas estão na camada posicionada por
                 causa do transform —, então o que faltava era só a diferença
                 de velocidade. E crescem mais (1,22 contra 1,3 do trator, mas
                 partindo de muito mais perto), que é o que faz passarem por
                 cima em vez de só deslizarem por cima. */
              { yPercent: -82, scale: 1.22, ease: RIDE },
              0,
            )
            .fromTo(
              "[data-hero='leaves-img']",
              { filter: "blur(0px)" },
              { filter: "blur(11px)", ease: RIDE },
              0,
            )
            /* Na reta final tudo fecha em preto. Além de ficar mais rápido, é
               o que torna a emenda com o bloco seguinte exata: ela deixa de
               depender de onde a última folha parou, e passa a valer em
               qualquer viewport. */
            .fromTo(
              "[data-hero='blackout']",
              { opacity: 0 },
              /* Dois quintos do curso, não um quarto, e `inOut` no lugar de
                 `in`: qualquer curva `in` guarda quase toda a mudança para o
                 fim — era daí que o apagar vinha "de uma vez", por mais longo
                 que fosse o trecho. Com `inOut` ela entra macia, corre parelha
                 no miolo e encosta no preto sem bater. */
              { opacity: 1, ease: "power1.inOut", duration: 0.4 },
              0.36,
            )

            /* E o bloco seguinte entra DEPOIS que a lâmina fechou — 0.76
               contra 0.76 do fecho. Sobrepor os dois faria o conteúdo aparecer
               por cima da cena ainda visível, como dupla exposição; assim a
               tela fica preta primeiro e o conteúdo nasce do preto.

               O trecho é longo de propósito: o quarto final do curso, e como o
               curso cresceu junto, são uns trezentos pixels de rolagem contra
               os cento e oitenta de antes. Curto, a aparição lê como corte.
               `inOut` tira o degrau dos dois extremos: ela não começa nem
               termina de supetão.

               Estar na mesma linha do tempo é o que garante a ordem: não há um
               valor atrasando em relação ao outro, em nenhuma velocidade. */
            .fromTo(
              next,
              { autoAlpha: 0 },
              { autoAlpha: 1, ease: "power2.inOut", duration: 0.24 },
              0.76,
            )

            /* O texto fica parado e sai só por fade — subir junto com a cena
               dava dois movimentos concorrentes no mesmo quadro. E ele some
               antes de a lâmina começar (0.42): apagar por cima de um texto
               ainda legível é o que fazia a virada parecer um corte.

               No estreito ele fica mais tempo: a tela é pequena, o texto ocupa
               boa parte dela, e não há o que olhar em volta enquanto ele passa. */
            .fromTo(
              "[data-hero='copy']",
              { yPercent: 0, opacity: 1 },
              { opacity: 0, ease: "power1.in", duration: narrow ? 0.18 : 0.24 },
              narrow ? 0.22 : 0.1,
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
          /* Enquanto o hero ocupa a tela, a barra do topo fica sem lâmina de
             vidro: atrás dela a cena muda a cada quadro, e um retângulo
             fosco parado em cima disso lê como sujeira — quem avisa a barra
             é `heroOver`, lá em cima, no gatilho da própria travessia.

             O tom não vem da posição das seções, porque aqui o preto é uma
             camada que anda, não uma seção. Vem de medir o que de fato está
             sob a barra, por dois caminhos — o que chegar primeiro:

               a cauda preta das folhas subindo até passar por baixo dela;
               a lâmina preta fechando, que é quem apaga a tela na reta final.

             Medir só a cauda era o defeito: a lâmina cobria tudo bem antes de
             a cauda chegar lá em cima, e a barra seguia clara sobre preto —
             inclusive já dentro do bloco seguinte, porque este `navTheme`
             tem precedência sobre a medição por seção. */
          const tail = scene.querySelector<HTMLElement>(".hero-leaves-tail");
          const veil = scene.querySelector<HTMLElement>("[data-hero='blackout']");
          const bar = document.querySelector<HTMLElement>("header");
          let tone = "";

          ScrollTrigger.create({
            trigger: scene,
            start: "top top",
            end: "bottom top",
            onUpdate: () => {
              /* No meio da barra, não na borda: é onde está a tipografia. */
              const line = (bar?.offsetHeight ?? 64) * 0.5;
              const coberto =
                (!!tail && tail.getBoundingClientRect().top <= line) ||
                (!!veil && Number(getComputedStyle(veil).opacity) > 0.35);
              const next = coberto ? "dark" : "light";
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
            clearTimeout(settling);
            delete scene.dataset.calm;
            delete html.dataset.navTheme;
            delete html.dataset.heroOver;
            delete html.dataset.heroPin;
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
          <div data-hero="flag-br" className="hero-flag hero-flag--br">
            <Image
              className="hero-flag-media hero-flag-media--br"
              src="/img/hero-flag-br.webp"
              alt=""
              width={1238}
              height={810}
              sizes="(max-width: 860px) 140vw, 50vw"
              priority
            />
          </div>

          <div data-hero="flag-us" className="hero-flag hero-flag--us">
            <Image
              className="hero-flag-media hero-flag-media--us"
              src="/img/hero-flag-us-2026.webp"
              alt=""
              width={1238}
              height={810}
              sizes="(max-width: 860px) 140vw, 52vw"
              priority
            />
          </div>

          {/* Véu do horizonte, trator e o preto que fecha embaixo andam como
              uma peça só: o véu segue o solo, e a faixa preta nunca se
              descola da linha onde a imagem do trator acaba. */}
          <div data-hero="ground" className="hero-ground">
            <span className="hero-flags-fade" aria-hidden />

            {/* Duas fotos, uma por formato — o recorte do celular é vertical,
                não é a de desktop reescalada. `<picture>` e não next/image
                porque só ele escolhe pela largura da tela e baixa uma só; os
                arquivos já vêm em webp no tamanho certo. */}
            <picture className="hero-swap">
              <source media="(max-width: 860px)" srcSet="/img/hero-tractor-mobile.webp" />
              <img
                className="hero-tractor"
                src="/img/hero-tractor.webp"
                alt={hero.tractorAlt}
                width={2688}
                height={1152}
                fetchPriority="high"
              />
            </picture>

            <span className="hero-underfill" aria-hidden />
          </div>

          <div data-hero="leaves" className="hero-leaves">
            <picture className="hero-swap">
              <source media="(max-width: 860px)" srcSet="/img/hero-leaves-mobile.webp" />
              <img
                data-hero="leaves-img"
                src="/img/hero-leaves.webp"
                alt=""
                width={2688}
                height={1152}
                fetchPriority="high"
              />
            </picture>

            {/* Depois da foto, portanto na frente dela. Precisa estar na
                frente: o cinza que aparecia no pé da folha não é o que está
                atrás vazando, é o desfoque espalhando o céu para dentro da
                própria folha — só dá para cobrir por cima. Por rampa longa, e
                não por corte: preto chapado encostando em quase-preto desenha
                um fio. */}
            <span className="hero-leaves-tail" aria-hidden />
          </div>
        </div>

        <div data-hero="copy" className="hero-copy">
          <p
            data-hero-tagline
            /* No estreito ele cabe numa linha só. Não é um tamanho fixo
               menor: com 0.39em de espaçamento a linha pede 378px e a coluna
               do mobile tem 320, então corpo e espaçamento acompanham a
               largura da tela — assim ele não quebra em nenhum aparelho.
               E ali sobra a versão curta: sem a praça, o que resta cabe com
               um corpo legível em vez de tipografia de 7px. */
            className={[
              "mb-[clamp(14px,1.7vw,30px)] font-display uppercase text-muted",
              "text-[clamp(9px,0.65vw,12.4px)] tracking-[0.39em]",
              "max-[860px]:text-[clamp(8px,2.6vw,10.5px)] max-[860px]:tracking-[0.26em]",
              "max-[860px]:whitespace-nowrap",
            ].join(" ")}
          >
            <span className="max-[860px]:hidden">{hero.tagline}</span>
            <span className="hidden max-[860px]:inline">{hero.taglineShort}</span>
          </p>
          <h1
            data-hero-title
            /* O piso do --text-h1 foi calibrado para não estourar a cena com
               a copy inteira; com o pré-título curto sobra altura para o
               título crescer com a tela em vez de travar em 34px. */
            className={[
              "mx-auto max-w-[785px] text-h1 leading-none tracking-[-0.01em] text-ink",
              "max-[860px]:text-[clamp(35px,9.7vw,44px)]",
            ].join(" ")}
          >
            {hero.headline}
          </h1>
          <p
            data-hero-sub
            className={[
              "mx-auto mt-[clamp(16px,1.6vw,30px)] max-w-[646px] text-muted",
              /* No estreito o parágrafo ocupava cinco linhas altas e empurrava
                 a cena para fora; corpo e entrelinha menores devolvem a
                 proporção sem tirar nada do texto. A margem extra estreita a
                 medida além da coluna: linhas mais curtas, bloco mais alto e
                 estreito, que é o desenho que o título grande pede ao lado. */
              "max-[860px]:text-[13.5px] max-[860px]:leading-[1.42] max-[860px]:px-[7vw]",
            ].join(" ")}
          >
            {hero.subheadline}
          </p>
        </div>
      </div>

        {/* Fora de .hero-scene: a lâmina não anda com a cena, cobre a janela. */}
        <span data-hero="blackout" className="hero-blackout" aria-hidden />
      </div>
    </section>
  );
}
