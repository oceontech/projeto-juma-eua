"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * As três fatias do curso, em fracções do timeline: abre, segura, engole.
 * Somam 1 — o `scrub` mapeia o curso inteiro sobre elas.
 *
 * A fatia do meio é o que dá sentido ao gesto: sem ela o card tocaria a tela
 * cheia por um quadro só e passaria direto, e o que se lê é um solavanco, não
 * uma abertura.
 */
const OPEN_DUR = 0.3;
const HOLD_DUR = 0.18;
const SWALLOW_DUR = 1 - OPEN_DUR - HOLD_DUR;

/**
 * A engolida, em fracções da própria fatia.
 *
 * A primeira fatia não move nada: é o tempo em que o texto dos benefícios sai.
 * Ela existe porque o painel nasce exatamente sobre a barra — assim que ele
 * aparece, cobre o texto. Sem este intervalo o texto não sairia, seria tapado.
 */
const LEAD_DUR = 0.16;
const GROW_DUR = 0.7;
/**
 * Um repouso entre o fim do crescimento e o apagamento da janela.
 *
 * Não é respiro de composição, é espaço de manobra: é aqui que a cortina
 * acende o próprio fundo preto por trás desta janela (Expertise.tsx). Sem ele
 * as duas coisas acontecem no mesmo quadro, e enquanto nenhuma das duas está
 * inteira o branco da caixa da cortina aparece entre elas.
 */
const SETTLE_DUR = 0.06;
/**
 * O crescimento não é o mesmo nos dois eixos, e não pode ser.
 *
 * A barra já nasce com 92% da largura do card e 17% da altura: para chegar às
 * bordas ela tem uns 100px a andar na horizontal e uns 750 na vertical. Com uma
 * curva só, a cada quadro o lado vertical anda sete vezes mais — e o que se lê
 * não é uma superfície se espalhando, é um retângulo disparando para cima.
 *
 * Duas curvas resolvem: a horizontal sai na frente e assenta cedo, a vertical
 * começa contida e só depois toma a tela. Nos primeiros quadros o que a tela
 * mostra é a caixa engordando para os lados — o espalhamento —, e a subida vem
 * depois, quando já se entende o que está acontecendo.
 */
const EASE_X = "power3.out";
const EASE_Y = "power2.inOut";

/**
 * O raio incha antes de endireitar.
 *
 * Uma caixa de canto vivo crescendo lê como corte de tela; a mesma caixa com
 * o canto generoso lê como algo se espalhando. Então o raio sobe bem acima do
 * da barra, fica lá pela maior parte do percurso e no fim volta para o raio do
 * card — que continua curvo mesmo em tela cheia, e é sobre ele que o painel
 * para.
 */
const RADIUS_MAX = 96;
/**
 * Teto do raio como fração da altura da caixa. Metade seria uma pílula; um
 * terço é um canto generoso que ainda deixa lado reto — que é o que faz a
 * caixa continuar sendo reconhecivelmente a barra enquanto se transforma.
 */
const RADIUS_CAP = 0.32;
const RADIUS_FLAT = 0.82;

const easeX = gsap.parseEase(EASE_X);
const easeY = gsap.parseEase(EASE_Y);
const easeRadius = gsap.parseEase("power2.out");

/**
 * O raio ao longo do crescimento: sai do raio da barra, incha com a caixa,
 * endireita no fim.
 *
 * O inchaço acompanha a ALTURA — `gy`, e não o progresso bruto — e ainda leva
 * um teto proporcional a ela. Sem as duas coisas, a caixa baixa do começo
 * recebia um raio maior que a própria metade da altura e virava uma pílula no
 * primeiro quadro: em vez de sair do formato da barra e se transformar, ela
 * trocava de forma antes de começar a crescer.
 */
function radiusAt(
  grow: number,
  gy: number,
  restRadius: number,
  endRadius: number,
  height: number,
) {
  const bulge = restRadius + (RADIUS_MAX - restRadius) * easeRadius(gy);
  const capped = Math.min(bulge, height * RADIUS_CAP);
  if (grow >= RADIUS_FLAT) {
    /* Termina no raio do card — medido, não escrito: o painel para exatamente
       sobre ele e os dois cantos precisam coincidir. Em tela cheia esse raio é
       zero, mas quem decide isso é o CSS do card, num lugar só. */
    const t = (grow - RADIUS_FLAT) / (1 - RADIUS_FLAT);
    return capped + (endRadius - capped) * t;
  }
  return capped;
}
/**
 * O fim: a janela inteira sai por opacidade sobre a cortina, que a essa altura
 * já está parada atrás — preto sobre preto. Sem isto a janela desliza para
 * cima e vai descobrindo o texto da cortina de baixo para cima, como uma
 * persiana que ninguém pediu.
 */
const FADE_DUR = 0.08;

/**
 * O card da prova tomando a tela.
 *
 * Enquanto a seção atravessa a viewport o card cresce do tamanho do container
 * até ocupar a tela inteira — borda a borda, com o canto arredondado mantido —,
 * segura ali por um trecho de rolagem e então a barra de benefícios o engole em
 * preto, que é o fundo da seção seguinte.
 *
 * A geometria é a mesma da cortina de produtos, e pelo mesmo motivo: uma
 * caixa alta dá o curso e uma janela `sticky` de `100lvh` segura a cena. Sem
 * pin spacer — no celular a barra do navegador abre e fecha durante a
 * rolagem, e um espaçador medido em pixels seria remedido no meio do gesto.
 * `lvh` é estático; a janela cobre a tela em qualquer estado da barra.
 *
 * O que o JS escreve são três coisas por quadro: `width`, `height` e a
 * variável `--open`. Largura e altura em pixels porque os dois extremos são
 * medidos (o repouso vem do conteúdo, a tela cheia da janela); o resto do
 * gesto — raio, respiros, a altura da foto — sai de `--open` no CSS, que é
 * onde ele pode ser lido junto com a geometria de repouso.
 *
 * Nada disso existe sem movimento: o `data-scene` só é ligado dentro do
 * matchMedia, e sem ele a seção volta a ser o card no fluxo, do tamanho de
 * sempre.
 */
export function ProofStage({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stageEl = stage.current;
      const frameEl = frame.current;
      const cardEl = card.current;
      if (!stageEl || !frameEl || !cardEl) return;

      const mm = gsap.matchMedia();

      mm.add(
        { animate: "(prefers-reduced-motion: no-preference)" },
        (context) => {
          const { animate } = context.conditions as { animate: boolean };
          if (!animate) return;

          stageEl.dataset.scene = "on";

          const swallowEl = stageEl.querySelector<HTMLElement>("[data-proof-swallow]");
          const barEl = stageEl.querySelector<HTMLElement>(".proof-benefits");
          const benefitEls = Array.from(
            stageEl.querySelectorAll<HTMLElement>(".proof-benefit"),
          );
          if (!swallowEl || !barEl) return;

          /* Sobe a cortina de produtos para dentro deste curso (globals.css).
             Fica aqui, e não no CSS puro, porque sem movimento não há engolida
             — e então as duas seções precisam voltar a se empilhar. */
          const html = document.documentElement;
          html.dataset.proofOverlap = "on";

          const state = { open: 0, grow: 0 };
          let restW = 0;
          let restH = 0;
          let fullW = 0;
          let fullH = 0;
          /* A caixa da barra e a do card medidas EM TELA CHEIA, que é onde a
             engolida acontece — medi-las em repouso daria os dois extremos
             errados. Ambas no mesmo referencial: a origem da caixa de padding
             do card, que é o bloco container do painel e também o que
             `offsetLeft`/`offsetTop` da barra usam (o card não tem borda). */
          let barX = 0;
          let barY = 0;
          let barW = 0;
          let barH = 0;
          let barRadius = 0;
          let cardRadius = 0;
          let cardW = 0;
          let cardH = 0;

          /* O repouso é medido, não declarado: a altura do card é a do
             conteúdo, e ela muda com a fonte, com a largura e com o idioma.
             Medir exige devolver o card ao estado de repouso antes da conta —
             daí limpar as três propriedades que a cena escreve.

             Isto roda dentro do `refreshInit` do ScrollTrigger, que é síncrono
             e acontece antes das medições dele: o card volta ao tamanho final
             no `refresh`, no mesmo quadro, então não há piscada. */
          const measure = () => {
            cardEl.style.removeProperty("width");
            cardEl.style.removeProperty("height");
            cardEl.style.setProperty("--open", "0");
            restW = cardEl.offsetWidth;
            restH = cardEl.offsetHeight;
            /* `clientWidth` do <html>, e não `innerWidth` nem `100vw`: os dois
               últimos incluem a barra de rolagem, e o card ficaria alguns
               pixels mais largo que a área visível — descentrado para a
               direita, com o excesso cortado pelo `overflow-x: clip`. */
            fullW = document.documentElement.clientWidth;
            /* A altura cheia é a da própria janela sticky. Perguntar a ela, e
               não a `innerHeight`, é o que mantém os dois em acordo quando a
               barra do navegador móvel recolhe. */
            fullH = frameEl.offsetHeight;

            /* Segunda pose: o card em tela cheia, que é onde a engolida corre.
               A barra muda de tamanho e de lugar entre as duas poses — a foto
               acima dela cresce com `--open` —, então medi-la em repouso daria
               um ponto de partida que nunca existe na tela. */
            cardW = fullW;
            cardH = Math.max(fullH, restH);
            cardEl.style.setProperty("--open", "1");
            cardEl.style.width = `${cardW}px`;
            cardEl.style.height = `${cardH}px`;
            barX = barEl.offsetLeft;
            barY = barEl.offsetTop;
            barW = barEl.offsetWidth;
            barH = barEl.offsetHeight;
            const bar = getComputedStyle(barEl);
            barRadius = parseFloat(bar.borderTopLeftRadius) || 0;
            cardRadius = parseFloat(getComputedStyle(cardEl).borderTopLeftRadius) || 0;
          };

          const apply = () => {
            const { open, grow } = state;
            cardEl.style.setProperty("--open", open.toFixed(4));
            cardEl.style.width = `${restW + (fullW - restW) * open}px`;
            /* `max` porque num celular baixo o card em repouso já pode ser
               mais alto que a janela: ali a tela cheia é só a largura, e a
               altura não deve encolher no meio do gesto. */
            cardEl.style.height = `${restH + (Math.max(fullH, restH) - restH) * open}px`;

            /* O alvo é a origem do card, e não o recuo do padding dele: o bloco
               container de um absoluto é a caixa de PADDING do ancestral, e o
               padding fica dentro dela. Com borda zero ela começa em (0, 0) —
               que é também o referencial de `offsetLeft`/`offsetTop` da barra,
               então os dois extremos falam a mesma língua. */
            const gx = easeX(grow);
            const gy = easeY(grow);
            const lerp = (from: number, to: number, t: number) =>
              from + (to - from) * t;
            const height = lerp(barH, cardH, gy);
            swallowEl.style.left = `${lerp(barX, 0, gx)}px`;
            swallowEl.style.top = `${lerp(barY, 0, gy)}px`;
            swallowEl.style.width = `${lerp(barW, cardW, gx)}px`;
            swallowEl.style.height = `${height}px`;
            swallowEl.style.borderRadius = `${radiusAt(grow, gy, barRadius, cardRadius, height)}px`;
            /* Aparece no primeiro quadro do disparo, quando ainda é a caixa da
               barra: o que se troca ali são dois retângulos idênticos. Antes
               disso precisa estar ausente, senão cobriria o texto que ainda
               está saindo. */
            swallowEl.style.opacity = `${Math.min(1, grow * 60)}`;
            /* O preto pleno entra ao longo do crescimento — no fim ele é a cor
               da seção seguinte, e a emenda depende de ser exatamente #000. */
            swallowEl.style.setProperty(
              "--swallow-black",
              Math.min(1, grow * 2.4).toFixed(4),
            );
          };

          measure();
          apply();

          ScrollTrigger.addEventListener("refreshInit", measure);
          ScrollTrigger.addEventListener("refresh", apply);

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              id: "proof-fullscreen",
              trigger: stageEl,
              start: "top top",
              /* O curso é exatamente o que a janela sticky tem para andar
                 dentro da caixa — medido, e não escrito como `"bottom bottom"`:
                 assim o gesto termina no quadro em que ela solta, em qualquer
                 viewport. */
              end: () =>
                "+=" + Math.max(1, stageEl.offsetHeight - frameEl.offsetHeight),
              /* Sem amortecimento: o card precisa estar exatamente na borda da
                 tela quando a janela solta, e um `scrub` com atraso deixaria
                 um fio do fundo aparecendo na virada. */
              scrub: true,
              /* Acima da cortina (5): esta cena está antes na página e a
                 cortina é puxada para dentro dela por margem negativa, então
                 a posição da cortina depende do que se mede aqui. */
              refreshPriority: 6,
            },
          });

          /* As quatro fatias em sequência, cada marca a partir da anterior. A
             conta direta — `1 - SWALLOW_DUR * FADE_DUR` — dá o mesmo número,
             mas esconde o repouso: quem mexer nas durações não vê que existe
             um intervalo entre o fim do crescimento e o apagamento, nem que é
             ele que a cortina usa para acender o próprio fundo. */
          const swallowAt = OPEN_DUR + HOLD_DUR;
          const growAt = swallowAt + SWALLOW_DUR * LEAD_DUR;
          const fadeAt = growAt + SWALLOW_DUR * (GROW_DUR + SETTLE_DUR);

          timeline
            .to(state, {
              open: 1,
              duration: OPEN_DUR,
              ease: "power2.inOut",
              onUpdate: apply,
            })
            /* A pausa não escreve nada — só ocupa curso de rolagem. */
            .to(state, { open: 1, duration: HOLD_DUR })
            /* O texto sai antes de o painel aparecer — é o que a fatia de
               entrada existe para permitir. `blur(0px)` explícito porque o
               valor natural é `none`, que não interpola. */
            .fromTo(
              benefitEls,
              { filter: "blur(0px)" },
              {
                opacity: 0,
                filter: "blur(6px)",
                duration: SWALLOW_DUR * LEAD_DUR,
                ease: "power1.in",
              },
              swallowAt,
            )
            /* O disparo corre linear: o feitio dele está em `EASE_X`, `EASE_Y`
               e no raio, aplicados por eixo dentro de `apply`. Uma curva aqui
               se somaria àquelas e as tornaria ilegíveis. */
            .to(
              state,
              {
                grow: 1,
                duration: SWALLOW_DUR * GROW_DUR,
                ease: "none",
                onUpdate: apply,
              },
              growAt,
            )
            /* A janela sai por último, sobre o preto da cortina já parado
               atrás dela — ver a nota em FADE_DUR. */
            .to(
              frameEl,
              { opacity: 0, duration: SWALLOW_DUR * FADE_DUR },
              fadeAt,
            )
            /* Apagada, ela ainda cobre o alto da tela por quase uma tela de
               rolagem — o sticky só solta no fim da caixa. Invisível e ainda
               recebendo ponteiro é a receita de um clique que não acontece e
               não tem explicação na tela. O `set` volta atrás sozinho quando
               se sobe a página, junto com o resto do scrub. */
            .set(frameEl, { pointerEvents: "none" }, fadeAt);

          return () => {
            ScrollTrigger.removeEventListener("refreshInit", measure);
            ScrollTrigger.removeEventListener("refresh", apply);
            delete stageEl.dataset.scene;
            delete html.dataset.proofOverlap;
            cardEl.style.removeProperty("width");
            cardEl.style.removeProperty("height");
            cardEl.style.removeProperty("--open");
            frameEl.style.removeProperty("opacity");
            frameEl.style.removeProperty("pointer-events");
            swallowEl.removeAttribute("style");
          };
        },
      );
    },
    { scope: stage },
  );

  return (
    <div ref={stage} data-proof-stage className="proof-stage">
      <div ref={frame} className="proof-window">
        <div ref={card} className="proof-card">
          {children}
        </div>
      </div>
    </div>
  );
}
