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

          <h3 data-slide-part className="product-slide__title">
            {product.title}
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

          /* A tarja de categoria fica de lado no celular por `rotate`, que é
             propriedade própria e não `transform` — mas o GSAP escreve
             `transform`, e um `y` aqui seria aplicado no eixo girado. Ela
             entra só com opacidade, e por isso vem separada das demais. */
          const partsOf = (slide: HTMLElement) => ({
            eyebrow: slide.querySelector<HTMLElement>("[data-slide-eyebrow]"),
            shot: slide.querySelector<HTMLElement>(".product-slide__shot"),
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

          if (!animate) {
            gsap.set([kmep, amino], {
              x: 0,
              y: 0,
              xPercent: 0,
              yPercent: 0,
              filter: "none",
            });
            gsap.set(everyPart, { opacity: 1, y: 0 });
            gsap.set(everyEyebrow, { opacity: 1 });
            return;
          }

          const setWillChange = (active: boolean) => {
            [kmep, amino].forEach((slide) => {
              slide.style.willChange = active ? "transform, filter" : "";
            });
            everyPart.forEach((part) => {
              part.style.willChange = active ? "transform, opacity" : "";
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
          gsap.set([...k.parts, ...a.parts], { opacity: 0, y: 30 });
          gsap.set([k.eyebrow, a.eyebrow], { opacity: 0 });
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

          /* As peças de dentro chegam logo atrás da faixa, escalonadas. */
          const partsIn = (
            group: ReturnType<typeof partsOf>,
            at: number,
            duration: number,
            /* Fração do gesto já cumprida quando as peças começam a aparecer.
               Na chegada elas vêm junto com o desfoque, no meio do caminho;
               na troca esperam mais, senão o botão — que é centrado na faixa,
               e a faixa ainda está meio fora da tela — aparece solto perto da
               borda esquerda. */
            after: number,
          ) => {
            timeline
              .fromTo(
                group.eyebrow,
                { opacity: 0 },
                { opacity: 1, duration: duration * 0.28 },
                at + duration * (after + 0.05),
              )
              .fromTo(
                group.parts,
                { opacity: 0, y: 30 },
                {
                  opacity: 1,
                  y: 0,
                  duration: duration * 0.42,
                  stagger: duration * 0.08,
                  ease: "power2.out",
                },
                at + duration * after,
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

          partsIn(k, IN_AT, IN_DUR, 0.42);

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
            gsap.set(a.parts, { opacity: 1, y: 0 });
            gsap.set(a.eyebrow, { opacity: 1 });
          } else {
            partsIn(a, SWAP_AT, SWAP_DUR, 0.48);
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
