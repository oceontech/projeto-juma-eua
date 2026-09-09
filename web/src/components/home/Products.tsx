"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { cx } from "@/components/ui";
import { products, type Product } from "@/content/home";
import { gsap, useGSAP } from "@/lib/gsap";

/* O layout escreve "VER PRODUTO"; o site é para os EUA. */
const CTA_LABEL = "View product";

/**
 * Marcas do percurso, em fracções do curso de rolagem do palco. Somam 1: o
 * `scrub` mapeia a rolagem sobre a duração do timeline, então o que fica
 * entre uma marca e a próxima é tempo de leitura, não tempo parado à toa.
 *
 * O curso começa vazio de propósito: a dissolução da seção anterior termina
 * exatamente quando o palco trava, e a faixa só parte depois disso, para as
 * duas coisas não acontecerem uma por cima da outra.
 */
const IN_AT = 0;
const IN_DUR = 0.26;
const SWAP_AT = 0.55;
const SWAP_DUR = 0.24;

/** O desfoque de chegada, o mesmo com que o texto da cortina sai. */
const BLUR = "blur(14px)";
const SHARP = "blur(0px)";

/** Vão entre as duas faixas quando a subida começa. */
const STACK_GAP = 56;

/** Uma faixa. As duas têm a mesma marcação; o espelho é só CSS. */
function Slide({ product }: { product: Product }) {
  const kmep = product.id === "kmep";

  return (
    <article
      data-product-slide={product.id}
      className={cx(
        "product-slide",
        kmep ? "product-slide--kmep" : "product-slide--amino",
      )}
    >
      <span aria-hidden className="product-slide__panel" />

      <div className="product-slide__body">
        <div className="product-slide__text">
          <p data-slide-eyebrow className="product-slide__eyebrow">
            <i aria-hidden className="product-slide__rule" />
            <span>{product.category}</span>
          </p>

          {/* O título sobe de dentro de uma máscara — daí o <span>: quem
              corta é a caixa de fora, quem anda é a de dentro. Fosse um só,
              o corte andaria junto com o texto e não cortaria nada. */}
          <h3 data-slide-part className="product-slide__title">
            <span data-slide-mask>{product.title}</span>
          </h3>

          <p data-slide-part className="product-slide__lede">
            {product.body}
          </p>
        </div>

        <div data-slide-part className="product-slide__shot">
          <Image
            src={product.image.src}
            alt={product.image.alt}
            width={640}
            height={640}
          />
        </div>

        <Link
          data-slide-part
          href={product.href}
          aria-label={`Watch the ${product.title} video`}
          className="product-slide__video"
        >
          <span aria-hidden className="product-slide__play">
            <i />
          </span>
        </Link>

        <Link
          data-slide-part
          href={product.href}
          className="product-slide__cta"
        >
          <span>{CTA_LABEL}</span>
          <i aria-hidden>&#8594;</i>
        </Link>
      </div>
    </article>
  );
}

/**
 * Os dois produtos da v1, num palco só.
 *
 * A seção dá o curso da rolagem e a janela `sticky` fica ocupando a tela — o
 * mesmo contrato geométrico do hero e da cortina, sem pin spacer e sem
 * depender de `innerHeight`, que no celular muda com a barra do navegador. O
 * fim do percurso é medido em pixels, a partir do que o próprio sticky tem
 * para andar, então a última faixa assenta exatamente quando a janela solta.
 *
 * São dois gestos:
 *
 *   chegada  a faixa do KMEP sobe vindo da direita, ganhando foco — o
 *            mesmo desfoque com que o texto da seção anterior saiu, agora ao
 *            contrário. Só parte depois de a janela travar, para não
 *            disputar com aquela saída;
 *
 *   troca    uma esteira vertical com deriva horizontal. O KMEP sai na
 *            diagonal — para cima e para a direita, mostrando a ponta
 *            arredondada de trás — enquanto o Aminosan sobe de baixo para
 *            tomar o centro do palco, entrando pela esquerda;
 *
 *   saída    a janela solta e o Aminosan sobe com a página enquanto deriva
 *            para a esquerda, entregando a tela à seção das culturas.
 *
 * As duas subidas usam a mesma curva, e a de cima anda mais que a de baixo:
 * é isso que garante que o vão entre elas só aumente, nunca diminua. Curvas
 * diferentes, ou a de baixo andando mais, e uma faixa entraria na outra.
 */
export function Products() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const stage = root.current;
      if (!stage) return;

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

          const windowEl = stage.querySelector<HTMLElement>(".product-stage__window");
          const slides = ["kmep", "aminosan"].map((id) =>
            stage.querySelector<HTMLElement>(`[data-product-slide='${id}']`),
          );
          const [kmep, amino] = slides;
          if (!windowEl || !kmep || !amino) return;

          /* Cada peça é colhida por conta própria: a entrada não é mais um
             fade de bloco com escalonamento, e sim um gesto por peça — ver
             `arm`/`enter` abaixo.

             A tarja de categoria fica de lado no celular por `rotate`, que é
             propriedade própria e não `transform` — mas o GSAP escreve
             `transform`, e um `y` nela seria aplicado no eixo girado. Por isso
             quem anda ali é o <span> de dentro, nunca a tarja. */
          const partsOf = (slide: HTMLElement) => ({
            eyebrow: slide.querySelector<HTMLElement>("[data-slide-eyebrow]"),
            rule: slide.querySelector<HTMLElement>(".product-slide__rule"),
            tag: slide.querySelector<HTMLElement>("[data-slide-eyebrow] span"),
            title: slide.querySelector<HTMLElement>("[data-slide-mask]"),
            lede: slide.querySelector<HTMLElement>(".product-slide__lede"),
            shot: slide.querySelector<HTMLElement>(".product-slide__shot"),
            video: slide.querySelector<HTMLElement>(".product-slide__video"),
            play: slide.querySelector<HTMLElement>(".product-slide__play"),
            cta: slide.querySelector<HTMLElement>(".product-slide__cta"),
            parts: Array.from(
              slide.querySelectorAll<HTMLElement>("[data-slide-part]"),
            ),
          });

          const k = partsOf(kmep);
          const a = partsOf(amino);
          if (!k.eyebrow || !a.eyebrow || !k.shot || !a.shot) return;
          const everyPart = [...k.parts, ...a.parts];
          const everyEyebrow = [k.eyebrow, a.eyebrow].filter(Boolean);

          type Group = ReturnType<typeof partsOf>;

          /* O pack CRESCE até o tamanho; não é cortado nem apagado.

             Cortar deixava a arte partida no meio do caminho — meio galão, com
             a linha do corte à mostra. E apagar tinha um problema mais
             específico: o pack cavalga a borda de cima da faixa, então metade
             dele fica sobre a cor e metade sobre o branco da página. Meio
             transparente, os dois fundos aparecem por dentro da mesma peça e a
             arte ganha duas cores. Escalando, ele está inteiro e opaco em todo
             quadro — só menor —, e a origem no pé o faz crescer a partir de
             onde encosta na faixa.

             O vídeo pode apagar: ele mora inteiro DENTRO da faixa, sobre uma
             cor só, e não tem emenda para deixar aparecer. */
          const SHOT_ORIGIN = "50% 100%";

          /* Quadro de partida das peças. Escrito à mão e não por `fromTo`
             porque a faixa que ainda não entrou precisa estar armada desde o
             primeiro layout — inclusive a do Aminosan, que só se move na
             troca, lá adiante. */
          const arm = (g: Group) => {
            gsap.set(g.rule, { scaleX: 0 });
            gsap.set(g.tag, { opacity: 0, x: narrow ? 0 : -14, y: narrow ? 10 : 0 });
            /* `y` explícito ao lado do `yPercent`, sempre — a mesma armadilha
               que as faixas já documentam mais abaixo: o GSAP guarda os dois
               separados e SOMA na matriz, então uma porcentagem sozinha se
               empilha sobre qualquer translação em pixels que ele tenha
               encontrado, e o título fica preso fora da máscara. */
            gsap.set(g.title, { y: 0, yPercent: 115 });
            gsap.set(g.lede, { opacity: 0, y: 18 });
            gsap.set(g.shot, { transformOrigin: SHOT_ORIGIN, scale: 0.84, y: 18 });
            gsap.set(g.video, { opacity: 0, scale: 0.94 });
            gsap.set(g.play, { opacity: 0, scale: 0.72 });
            gsap.set(g.cta, { opacity: 0, y: 22 });
          };

          /* O mesmo quadro, do outro lado: tudo no lugar. Serve a quem pediu
             menos movimento e à faixa que, no celular, chega pronta. */
          const settle = (g: Group) => {
            gsap.set(g.rule, { scaleX: 1 });
            gsap.set([g.tag, g.lede, g.cta], { opacity: 1, x: 0, y: 0 });
            gsap.set(g.title, { y: 0, yPercent: 0 });
            gsap.set(g.shot, { transformOrigin: SHOT_ORIGIN, scale: 1, y: 0 });
            gsap.set(g.video, { opacity: 1, scale: 1 });
            gsap.set(g.play, { opacity: 1, scale: 1 });
          };

          if (!animate) {
            gsap.set([kmep, amino], {
              x: 0,
              y: 0,
              xPercent: 0,
              yPercent: 0,
              filter: "none",
            });
            settle(k);
            settle(a);
            return;
          }

          const setWillChange = (active: boolean) => {
            [kmep, amino].forEach((slide) => {
              slide.style.willChange = active ? "transform, filter" : "";
            });
            everyPart.forEach((part) => {
              part.style.willChange = active ? "transform, opacity" : "";
            });
            [k.shot, a.shot, k.video, a.video].forEach((piece) => {
              if (piece) piece.style.willChange = active ? "transform, opacity" : "";
            });
          };

          /* O quanto cada faixa anda na vertical. A que sai precisa limpar o
             topo da janela; a que entra começa um vão abaixo da que está em
             cena. Como a que sai anda mais, o vão entre as duas abre durante
             a subida — elas nunca se encostam.

             A mesma medida de entrada serve para a chegada do KMEP: ele surge
             do mesmo jeito que o Aminosan surge na troca, só que do outro
             lado da tela. */
          const exitRise = () =>
            -(
              windowEl.offsetHeight / 2 +
              kmep.offsetHeight / 2 +
              /* `offsetHeight` da faixa não conta o botão, que fica montado
                 metade para fora da borda de baixo. Sem somá-lo, sobrava uma
                 lasca preta pendurada no topo da tela. */
              (k.cta?.offsetHeight ?? 0) / 2 +
              24
            );
          const enterRise = (slide: HTMLElement) => () =>
            slide.offsetHeight + STACK_GAP;

          /* Quadro inicial escrito à mão, antes do timeline.
             O `immediateRender` de um `fromTo` com `stagger` só alcança o
             primeiro alvo: os demais ficavam com o valor natural (opacidade
             1) até a vez deles chegar, e apareciam prontos no meio da
             varredura, muito antes da hora. Com o estado escrito aqui, quem
             ainda não entrou está escondido de qualquer forma. */
          arm(k);
          arm(a);
          gsap.set(everyEyebrow, { opacity: 1 });
          /* `x` e `y` em zero junto com as porcentagens, sempre. O GSAP guarda
             os dois separados e SOMA os dois na matriz; quando ele encontra um
             `transform` que não foi ele quem escreveu — um resquício de uma
             montagem anterior, que em desenvolvimento acontece a cada
             remontagem — lê a translação já resolvida em pixels como `x` e
             empilha a porcentagem por cima. A faixa ia parar a uma largura
             inteira à esquerda do lugar, e o palco ficava em branco. */
          gsap.set(kmep, {
            x: 0,
            y: enterRise(kmep)(),
            xPercent: narrow ? 0 : 100,
            yPercent: 0,
            filter: BLUR,
          });
          gsap.set(amino, {
            x: 0,
            y: 0,
            xPercent: narrow ? 0 : -100,
            yPercent: 0,
            filter: BLUR,
          });

          /* A antecipação da chegada, em pixels de rolagem. */
          const lead = () => Math.round(windowEl.offsetHeight * 0.3);

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              id: "product-stage",
              trigger: stage,
              /* Começa antes de a janela travar. Parece contradizer o pedido
                 de não montar na saída da cortina, mas não monta: a chegada
                 usa `power2.inOut`, que quase não anda no primeiro quinto do
                 percurso, então enquanto o texto da cortina ainda está na
                 tela a faixa continua fora dela. O que esta antecipação
                 resolve é o contrário — sem ela, entre o texto sumir e a
                 faixa despontar sobrava meia tela de branco sem nada. */
              start: () => `top ${lead()}px`,
              end: () =>
                "+=" +
                Math.max(
                  1,
                  stage.offsetHeight - windowEl.offsetHeight + lead(),
                ),
              scrub: true,
              refreshPriority: 4,
              /* A subida é medida em pixels a partir da altura real da janela
                 e das faixas, e essas medidas são funções — sem invalidar no
                 refresh elas ficariam com o valor do primeiro quadro. É
                 seguro aqui porque o resize do celular já é ignorado
                 globalmente (ver src/lib/gsap.ts); sem aquilo, cada abrir e
                 fechar da barra do navegador devolveria a cena ao começo. */
              invalidateOnRefresh: true,
              onToggle: (self) => setWillChange(self.isActive),
            },
          });

          /* A entrada das peças de dentro.
           *
           * Não é uma varredura de opacidade: cada peça tem o gesto que a
           * própria forma pede, e a ordem é a da leitura — o filete se desenha
           * a partir da borda da faixa, a categoria vem atrás dele, o título
           * sobe de dentro da máscara, o texto assenta, o pack se descobre de
           * baixo para cima enquanto sobe, o vídeo se abre de cima para baixo,
           * o play cresce no meio dele e o botão fecha a leitura.
           *
           * Os tempos são frações do gesto, não segundos: o mesmo desenho vale
           * para a chegada (curso longo) e para a troca (curso curto).
           *
           * As peças se sobrepõem de propósito. Uma fila de gestos que esperam
           * uns pelos outros lê como lista; sobrepostas, lê como uma coisa só
           * chegando — e é isso que a faixa é.
           */
          const enter = (
            g: Group,
            at: number,
            duration: number,
            /* Fração do gesto já cumprida quando as peças começam a aparecer.
               Na chegada elas vêm junto com o desfoque, no meio do caminho;
               na troca esperam mais, senão o botão — que é centrado na faixa,
               e a faixa ainda está meio fora da tela — aparece solto perto da
               borda esquerda. */
            after: number,
          ) => {
            const t = (fraction: number) => at + duration * (after + fraction);
            const d = (fraction: number) => duration * fraction;

            timeline
              /* O traço sai da borda e corre até o texto. É o primeiro gesto
                 porque é ele que ancora a faixa na tela: enquanto ele cresce,
                 o resto ainda está por chegar. */
              .fromTo(
                g.rule,
                { scaleX: 0 },
                { scaleX: 1, duration: d(0.34), ease: "power2.out" },
                t(0),
              )
              .fromTo(
                g.tag,
                { opacity: 0, x: narrow ? 0 : -14, y: narrow ? 10 : 0 },
                { opacity: 1, x: 0, y: 0, duration: d(0.26), ease: "power2.out" },
                t(0.1),
              )
              /* O título sobe inteiro de dentro do corte — sem opacidade
                 nenhuma, porque tipografia meio transparente sobre cor lê como
                 borrão. `power3.out` para ele chegar rápido e assentar devagar,
                 que é o que dá peso a um nome de produto. */
              .fromTo(
                g.title,
                { y: 0, yPercent: 115 },
                { y: 0, yPercent: 0, duration: d(0.42), ease: "power3.out" },
                t(0.14),
              )
              .fromTo(
                g.lede,
                { opacity: 0, y: 18 },
                { opacity: 1, y: 0, duration: d(0.38), ease: "power2.out" },
                t(0.28),
              )
              /* O pack cresce do pé até o tamanho, com um empurrão para cima
                 no meio do caminho. Curso longo e `power3.out`: ele é a peça
                 maior da faixa, e peça grande que assenta rápido demais parece
                 que caiu ali. */
              .fromTo(
                g.shot,
                { transformOrigin: SHOT_ORIGIN, scale: 0.84, y: 18 },
                { scale: 1, y: 0, duration: d(0.62), ease: "power3.out" },
                t(0.12),
              )
              /* O vídeo vem atrás, também crescendo — só que de perto de 1,
                 porque ele é uma superfície e não um objeto: exagerar a escala
                 numa moldura preta lê como zoom, não como entrada. */
              .fromTo(
                g.video,
                { opacity: 0, scale: 0.94 },
                { opacity: 1, scale: 1, duration: d(0.5), ease: "power2.out" },
                t(narrow ? 0.46 : 0.3),
              )
              .fromTo(
                g.play,
                { opacity: 0, scale: 0.72 },
                { opacity: 1, scale: 1, duration: d(0.3), ease: "back.out(2)" },
                t(narrow ? 0.62 : 0.52),
              )
              /* O botão fecha a leitura — e "fechar" é outro lugar em cada
                 formato. No largo ele fica pendurado na borda de baixo, depois
                 do vídeo, e entra por último. No estreito ele está ENTRE o
                 texto e o vídeo, então entra ali: um gesto que pula uma peça e
                 volta atrás lê como falha, não como coreografia. */
              .fromTo(
                g.cta,
                { opacity: 0, y: 22 },
                { opacity: 1, y: 0, duration: d(0.34), ease: "back.out(1.4)" },
                t(narrow ? 0.34 : 0.6),
              );
          };

          /* ------------------------------------------------------ chegada */
          /* Diagonal, subindo e vindo da direita — o espelho da entrada do
             Aminosan na troca. No celular a faixa é a tela inteira: somar a
             deriva horizontal ali deixaria três quartos da tela em branco no
             meio do caminho, então lá ela só sobe, como na troca. */
          timeline.fromTo(
            kmep,
            {
              x: 0,
              xPercent: narrow ? 0 : 100,
              y: enterRise(kmep),
              filter: BLUR,
            },
            {
              xPercent: 0,
              y: 0,
              filter: SHARP,
              duration: IN_DUR,
              /* Sai devagar e assenta devagar: a faixa se materializa em vez
                 de deslizar. */
              ease: "power2.inOut",
            },
            IN_AT,
          );

          enter(k, IN_AT, IN_DUR, 0.34);

          /* -------------------------------------------------------- troca */
          /* Duas coreografias, porque o palco é outro em cada largura.

             No desktop as faixas são tarjas com branco em volta, então cabe
             uma esteira: a de cima sai na diagonal — para cima e para a
             direita, mostrando a ponta arredondada de trás — e a de baixo
             sobe entrando pela esquerda. Podem andar em sentidos opostos sem
             deixar buraco porque ocupam alturas diferentes.

             No celular a faixa é quase a tela toda, e esteira ali significa
             passar por uma tela vazia entre uma e outra. Então é sobreposição:
             o Aminosan sobe POR CIMA do KMEP, que fica parado, e o KMEP só se
             apaga quando já está quase todo coberto — a emenda acontece
             escondida atrás da faixa que chega. */
          if (narrow) {
            timeline.fromTo(
              kmep,
              { opacity: 1 },
              {
                opacity: 0,
                duration: SWAP_DUR * 0.22,
                ease: "power1.inOut",
                immediateRender: false,
              },
              /* Medido: aqui a faixa que chega já cobre uns três quartos do
                 que está embaixo, e o apagamento termina perto dos 92%. O que
                 sobra descoberto nesse intervalo é a sobra do pack por cima da
                 borda — e é justamente ela que não pode aparecer duplicada. */
              SWAP_AT + SWAP_DUR * 0.72,
            );
          } else {
            timeline
              /* `fromTo` com valores explícitos, e não `to`: um `to` grava o
                 valor de partida no primeiro quadro em que renderiza, e com
                 `invalidateOnRefresh` um refresh no meio da troca o regravaria
                 já deslocado — a faixa sairia do lugar errado. */
              .fromTo(
                kmep,
                { y: 0 },
                {
                  y: exitRise,
                  duration: SWAP_DUR,
                  ease: "power1.inOut",
                  immediateRender: false,
                },
                SWAP_AT,
              )
              .fromTo(
                kmep,
                { xPercent: 0 },
                {
                  xPercent: 100,
                  duration: SWAP_DUR,
                  ease: "power1.inOut",
                  immediateRender: false,
                },
                SWAP_AT,
              );
          }

          timeline.fromTo(
            amino,
            { y: enterRise(amino) },
            { y: 0, duration: SWAP_DUR, ease: "power1.inOut" },
            SWAP_AT,
          );

          if (narrow) {
            gsap.set(amino, { xPercent: 0 });
          } else {
            timeline.fromTo(
              amino,
              { xPercent: -100 },
              { xPercent: 0, duration: SWAP_DUR, ease: "power1.inOut" },
              SWAP_AT,
            );
          }

          timeline.fromTo(
            amino,
            { filter: BLUR },
            { filter: SHARP, duration: SWAP_DUR * 0.85, ease: "power2.out" },
            SWAP_AT,
          );

          if (narrow) {
            /* Numa sobreposição a faixa que chega tem de chegar pronta: ela
               desliza por cima como um cartão inteiro, e não como uma casca
               que se preenche depois. Ninguém vê isto acontecer — ela ainda
               está abaixo do pé da tela. */
            settle(a);
          } else {
            enter(a, SWAP_AT, SWAP_DUR, 0.4);
          }

          /* Estica o timeline até 1 para o Aminosan ter o mesmo respiro de
             leitura que o KMEP teve antes da troca. */
          timeline.to({}, { duration: 0.001 }, 0.999);

          /* --------------------------------------------------------- saída */
          /* Quando a janela solta, ela sobe com a página e a seção das
             culturas entra por baixo — a componente vertical da saída já vem
             daí, de graça. O que falta é a deriva para a esquerda, e é só
             isso que este trecho faz.
             
             Fica fora do timeline principal, num gatilho próprio que começa
             exatamente onde aquele termina, e escreve em `x` — o timeline usa
             `xPercent`, e o GSAP guarda os dois separados e soma. Assim as
             duas coisas nunca disputam a mesma propriedade.

             Só no desktop, pela mesma razão de sempre: no celular a faixa é a
             tela inteira, e sair de lado deixaria meia tela em branco. */
          if (!narrow) {
            gsap.fromTo(
              amino,
              { x: 0 },
              {
                x: () => -amino.offsetWidth,
                /* Linear, e não uma curva. A componente vertical desta saída é
                   a própria rolagem, que anda 1:1 — pôr uma curva só no
                   horizontal faz as duas taxas divergirem, e a faixa começa
                   diagonal e termina praticamente de lado. Com as duas
                   lineares a direção não muda do começo ao fim, como nos
                   outros gestos, em que os dois eixos usam a mesma curva. */
                ease: "none",
                scrollTrigger: {
                  id: "product-stage-exit",
                  trigger: stage,
                  start: () =>
                    `top -${Math.round(
                      stage.offsetHeight - windowEl.offsetHeight,
                    )}px`,
                  /* O curso sai da inclinação que se quer: em 0,75 da altura
                     da janela a faixa anda uma largura de tela para o lado
                     enquanto sobe essa altura, o que dá a mesma diagonal com
                     que o KMEP saiu. É também, por acaso feliz, o ponto em que
                     ela acaba de limpar o topo. */
                  end: () => "+=" + Math.round(windowEl.offsetHeight * 0.75),
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              },
            );
          }

          timeline.progress(0);

          return () => setWillChange(false);
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="products" className="product-stage">
      <div className="product-stage__window">
        {products.map((product) => (
          <Slide key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
