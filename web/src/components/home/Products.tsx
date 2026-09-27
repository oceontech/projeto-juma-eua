"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { cx } from "@/components/ui";
import type { Product } from "@/content/home";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { Flora } from "./flora/Flora";

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
  const { productCard } = useContent().home;
  const kmep = product.id === "kmep";

  return (
    <article
      data-product-slide={product.id}
      className={cx(
        "product-slide",
        kmep ? "product-slide--kmep" : "product-slide--amino",
      )}
    >
      <Flora id={product.id} />
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
          aria-label={`${productCard.watch.before}${product.title}${productCard.watch.after}`}
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
          <span>{productCard.cta}</span>
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
  const { products } = useContent().home;
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
            flora: slide.querySelector<HTMLElement>(".product-slide__flora"),
            floraExit: slide.querySelector<HTMLElement>(".product-slide__flora-exit"),
            stipples: Array.from(slide.querySelectorAll<HTMLElement>(".product-slide__stipple-dots")),
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

          /* A deriva das manchas é uma animação de CSS, não do timeline: ela
             não tem nada a ver com a rolagem e ficaria cara em `onUpdate`.
             O que o scroll decide é só se ela roda — e roda somente enquanto a
             faixa está de fato na tela, para não haver seis gradientes grandes
             sendo repintados atrás de uma faixa invisível. */
          const syncFlora = () => {
            if (narrow) return;
            [k, a].forEach(({ flora, floraExit }) => {
              if (!flora || !floraExit) return;
              const visible =
                Number(gsap.getProperty(flora, "opacity")) > 0.01 &&
                Number(gsap.getProperty(floraExit, "opacity")) > 0.01;
              flora.toggleAttribute("data-flora-active", visible);
            });
          };

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
          /* De onde o pack parte: bem menor, mais baixo e levemente inclinado,
             para a entrada ser lida como um objeto chegando, e não como um
             ajuste de escala. Sem opacidade pelo mesmo motivo de sempre — ele
             atravessa a borda da faixa e transparência mostraria a emenda. */
          /* No estreito o pack fica logo acima do título: descer tanto quanto no
             largo o poria em cima do texto durante a entrada. */
          const SHOT_FROM = { transformOrigin: SHOT_ORIGIN, scale: 0.45, y: narrow ? 30 : 90, rotation: -10 };

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
            gsap.set(g.shot, SHOT_FROM);
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
            gsap.set(g.shot, { transformOrigin: SHOT_ORIGIN, scale: 1, y: 0, rotation: 0 });
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
          if (!narrow) {
            /* Nada chegou ainda: o pontilhado apagado e a flora em zero. Os
               desenhos leem `--flora-in` (ver flora/Flora.tsx), então não
               importa quantas peças a proposta ativa tenha, nem se ela troca
               no meio do caminho — o timeline só conhece esta variável. */
            gsap.set([k.flora, a.flora], { opacity: 1, "--flora-in": 0 });
            gsap.set([k.floraExit, a.floraExit], { opacity: 1 });
            [k, a].forEach(({ stipples }) => gsap.set(stipples, { opacity: 0 }));
          }
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
            onUpdate: syncFlora,
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
                  /* Menos uma tela: a última é a da troca com as culturas. */
                  /* No estreito o palco tem uma tela a mais: a da seção seguinte
                     subindo por cima (ver a saída, abaixo). */
                  stage.offsetHeight - (narrow ? 2 : 1) * windowEl.offsetHeight + lead(),
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
              /* O pack cresce do pé até o tamanho, subindo e se endireitando.
                 Curso mais longo que o gesto e `power2.out`: preso à rolagem,
                 uma curva que resolve quase tudo no começo faz o crescimento
                 caber em poucos pixels e passar batido. Espalhado assim ele é
                 visto crescendo — e ainda assenta devagar. */
              .fromTo(
                g.shot,
                SHOT_FROM,
                { scale: 1, y: 0, rotation: 0, duration: d(1.1), ease: "power2.out" },
                t(0.04),
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

          if (!narrow) {
            /* A flora chega DEPOIS que a faixa assenta — é consequência da
               presença dela, não companhia da entrada. Primeiro a luz: o campo
               de pontos acende sozinho e anuncia que algo vai acontecer ali.
               Junto, `--flora-in` corre de 0 a 1, e cada peça se constrói na
               sua fração dele — a ordem está no desenho, não aqui.

               Um tween só, e com duração fixa: como o `scrub` mapeia a
               rolagem sobre a DURAÇÃO do timeline, qualquer coisa que a
               esticasse encolheria as outras marcas, e a faixa passaria a
               sair no lugar errado. O `span` mantém tudo dentro do vão que
               sobra até a próxima marca. */
            const grow = (g: Group, at: number, span: number) => {
              timeline.to(
                g.stipples,
                { opacity: 1, duration: span * 0.5, ease: "power1.inOut" },
                at,
              );
              /* Linear: a curva de cada peça está no CSS dela, e uma curva
                 aqui concentraria toda a construção no meio do trecho. */
              timeline.fromTo(
                g.flora,
                { "--flora-in": 0 },
                { "--flora-in": 1, duration: span, ease: "none", immediateRender: false },
                at,
              );
            };
            /* O vão até a próxima marca é o orçamento de cada uma. */
            grow(k, IN_AT + IN_DUR * 0.5, SWAP_AT - IN_AT - IN_DUR * 0.5 - 0.04);
            grow(a, SWAP_AT + SWAP_DUR * 0.5, 1 - SWAP_AT - SWAP_DUR * 0.5 - 0.02);
            /* O KMEP recolhe o que cresceu enquanto o Aminosan entra: as duas
               floras não podem dividir o branco, ou o que se lê é bagunça em
               vez de troca. */
            timeline.fromTo(
              k.floraExit,
              { opacity: 1, y: 0 },
              {
                opacity: 0,
                y: 14,
                duration: SWAP_DUR * 0.55,
                ease: "power2.inOut",
                immediateRender: false,
              },
              SWAP_AT,
            );
          }

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
            /* Menos o pack: ele cresce como o do KMEP na chegada, enquanto a faixa
               sobe — o mesmo gesto nos dois produtos. */
            gsap.set(a.shot, SHOT_FROM);
            timeline.fromTo(
              a.shot,
              SHOT_FROM,
              { scale: 1, y: 0, rotation: 0, duration: SWAP_DUR * 0.9, ease: "power2.out", immediateRender: false },
              SWAP_AT + SWAP_DUR * 0.2,
            );
          } else {
            enter(a, SWAP_AT, SWAP_DUR, 0.4);
          }

          /* Estica o timeline até 1 para o Aminosan ter o mesmo respiro de
             leitura que o KMEP teve antes da troca. */
          timeline.to({}, { duration: 0.001 }, 0.999);

          /* --------------------------------------------------------- saída */
          /* Duas saídas, como na troca entre os produtos.

             Desktop: quando a janela solta, ela sobe com a página e a seção das
             culturas entra por baixo — a componente vertical já vem daí. O que
             falta é a deriva para a esquerda, e é só isso que este trecho faz,
             em `x` (o timeline usa `xPercent`, e o GSAP soma os dois). Linear,
             porque a componente vertical é a rolagem, que também é linear.

             Celular: cartões empilhados (o padrão "stacking cards" do
             ScrollTrigger). O palco trava uma tela a mais e a seção das culturas
             sobe por cima dele com os cantos redondos (globals.css); enquanto é
             coberto, o Aminosan recua e esmaece. Só `transform` e `opacity` —
             nada de SVG, máscara ou filtro, que o Safari do iPhone não pintava
             direito nesta sobreposição.

             Nos dois, gatilho próprio começando onde o timeline principal
             termina. */
          {
            const exitTimeline = gsap.timeline({
              onUpdate: syncFlora,
              scrollTrigger: {
                id: "product-stage-exit",
                trigger: stage,
                start: () =>
                  `top -${Math.round(stage.offsetHeight - (narrow ? 2 : 1) * windowEl.offsetHeight)}px`,
                end: () => "+=" + Math.round(windowEl.offsetHeight * (narrow ? 1 : 0.75)),
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
            if (narrow) {
              exitTimeline
                .fromTo(
                  amino,
                  { scale: 1, transformOrigin: "50% 20%" },
                  { scale: 0.9, duration: 1, ease: "none", immediateRender: false },
                  0,
                )
                .fromTo(
                  amino,
                  { opacity: 1 },
                  { opacity: 0.2, duration: 0.7, ease: "power1.in", immediateRender: false },
                  0.3,
                );
            } else {
              exitTimeline.fromTo(
                amino,
                { x: 0 },
                { x: () => -amino.offsetWidth, ease: "none", duration: 1 },
                0,
              );
            }
            /* Na saída a flora recua para dentro da faixa em vez de só apagar:
               some junto com quem a sustentava. */
            exitTimeline.fromTo(
              a.floraExit,
              { opacity: 1, y: 0 },
              { opacity: 0, y: 14, duration: 0.55, ease: "power2.inOut" },
              0,
            );
          }

          timeline.progress(0);

          return () => {
            setWillChange(false);
            [k, a].forEach(({ flora }) => flora?.removeAttribute("data-flora-active"));
          };
        },
      );
    },
    { scope: root },
  );

  /* No estreito a faixa é a tela inteira e empilha pack, texto, botão e vídeo.
     A janela tem 100lvh — a área sob a barra do navegador conta — e numa tela
     baixa o pé do vídeo ficava escondido. Aqui cada faixa mede quanto precisa
     e encolhe só as duas peças elásticas, pack e vídeo, via `--fit` (0,5–1),
     até o vídeo terminar a FOOT px da altura visível mínima (100svh). Texto e
     botão não mudam; em tela alta o fator fica em 1. Não mexe na altura da
     seção, então o ScrollTrigger não precisa remedir. */
  useEffect(() => {
    const stage = root.current;
    if (!stage) return;
    const narrow = window.matchMedia("(max-width: 860px)");
    /* Folga até o pé visível: vídeo, respiro e a tarja deitada embaixo dele. */
    const FOOT = 58;
    const bar = document.querySelector<HTMLElement>("header");

    const probe = document.createElement("div");
    probe.style.cssText = "position:fixed;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none";
    document.body.appendChild(probe);

    let frame = 0;
    const fit = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bodies = Array.from(stage.querySelectorAll<HTMLElement>(".product-slide__body"));
        if (!narrow.matches) {
          bodies.forEach((body) => {
            body.style.removeProperty("--fit");
            body.style.removeProperty("--fit-shot");
          });
          return;
        }
        const visible = probe.offsetHeight;
        /* `f` vai de 0 (tela mínima) a 1 (tudo no tamanho cheio). Vídeo e pack
           cedem juntos e cada um tem piso: nenhum dos dois fica pequeno. */
        const apply = (body: HTMLElement, f: number) => {
          body.style.setProperty("--fit", (0.62 + 0.38 * f).toFixed(3));
          body.style.setProperty("--fit-shot", (0.7 + 0.3 * f).toFixed(3));
        };
        /* Um fator por faixa, e o menor vale para as duas: o texto do KMEP é
           mais longo e pedia um pack menor que o do Aminosan — os dois produtos
           precisam ter o mesmo tamanho. */
        const fits = bodies.map((body) => {
          const slide = body.closest<HTMLElement>(".product-slide");
          const video = body.querySelector<HTMLElement>(".product-slide__video");
          if (!slide || !video) return 1;
          /* Pé do vídeo contado do topo da faixa: transform do GSAP na faixa
             desloca os dois igualmente e some na diferença. */
          const shotImg = body.querySelector<HTMLElement>(".product-slide__shot img");
          const overflow = (f: number) => {
            apply(body, f);
            /* O pack não entra embaixo da barra do topo: se a arte (que começa a
               6,4% da imagem) sobe além do pé da barra mais uma folga, desce só
               o que passou. Medido do topo da faixa, como o vídeo. */
            body.style.setProperty("--shot-drop", "0px");
            if (shotImg) {
              /* Sem o transform da entrada: antes de a faixa entrar o pack está em
                 45% do tamanho, e medido assim ele parecia longe da barra. */
              const shotBox = shotImg.parentElement as HTMLElement;
              const saved = shotBox.style.transform;
              shotBox.style.transform = "none";
              const r = shotImg.getBoundingClientRect();
              const artTop = r.top + r.height * 0.064 - slide.getBoundingClientRect().top;
              shotBox.style.transform = saved;
              const limit = (bar?.offsetHeight ?? 0) + 14;
              if (artTop < limit) body.style.setProperty("--shot-drop", `${Math.round(limit - artTop)}px`);
            }
            const foot = video.getBoundingClientRect().bottom - slide.getBoundingClientRect().top;
            return foot + FOOT - visible;
          };
          if (overflow(1) <= 0) return 1;
          /* Busca binária: o maior fator que cabe. Poucos passos bastam. */
          let lo = 0;
          let hi = 1;
          if (overflow(lo) > 0) return lo; /* nem no mínimo cabe: fica no mínimo */
          for (let i = 0; i < 7; i++) {
            const mid = (lo + hi) / 2;
            if (overflow(mid) > 0) hi = mid;
            else lo = mid;
          }
          return lo;
        });
        const shared = Math.min(1, ...fits);
        bodies.forEach((body) => {
          if (shared >= 1) {
            body.style.removeProperty("--fit");
            body.style.removeProperty("--fit-shot");
          } else apply(body, shared);
        });
      });
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(stage);
    observer.observe(probe);
    narrow.addEventListener("change", fit);
    document.fonts?.ready.then(fit);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      narrow.removeEventListener("change", fit);
      probe.remove();
      stage.querySelectorAll<HTMLElement>(".product-slide__body").forEach((body) => {
        body.style.removeProperty("--fit");
        body.style.removeProperty("--fit-shot");
      });
    };
  }, []);

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
