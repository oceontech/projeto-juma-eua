"use client";

import { useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { booted } from "@/lib/boot";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import {
  buildFromPoints,
  createScan,
  project,
  type Scan as Field,
  type ScanUniforms,
} from "@/lib/scan/field";
import { SPECIMEN } from "@/lib/scan/specimen";
import { FRAMES, stipplePhoto } from "@/lib/scan/stipple";
import { microCaps } from "./ui";

/**
 * A cena de partículas da LP B, no mecanismo da LP C.
 *
 * O hero fica como está. Quando o scroll começa, o texto dele sai, a foto dá
 * um zoom curto e, **ainda dentro do zoom**, se fragmenta a partir de si mesma:
 * os pontos são uma grade sobre a fotografia e leem a cor dela no shader (ver
 * `lib/scan/field.ts`), então o que se desmancha é a foto, não um retrato
 * dela. Dali a nuvem passa pelas quatro leituras da LP C — a peça, a
 * corrente, as peças soltas e a folha —, cada uma com o desenho girando
 * devagar e três chamadas penduradas nele.
 *
 * O que muda em relação à C é o registro, não o mecanismo:
 *
 *   as cores são as da B — papel, tinta de floresta, e dois destaques com
 *   legenda (verde = nitrogênio, âmbar = a ligação que precisa ser aberta);
 *
 *   sem a trama de fundo, sem a linha de varredura, sem cantoneiras — a
 *   moldura de instrumento não diz nada a quem não é do laboratório;
 *
 *   o trilho do pé diz em palavras em que etapa se está, e cada painel
 *   termina em "pronto para uso? não / sim", que é a comparação inteira.
 *
 * Este componente **embrulha o hero** (`children`): os dois travam juntos, e
 * a foto de verdade só sai de cena no quadro em que a nuvem — que mostra
 * exatamente a mesma imagem, no mesmo zoom — assume.
 */

/* O corte do hero, que troca a foto e o enquadramento no celular. */
const NARROW = "(max-width: 860px)";

/* O mesmo número do `lg:` do JSX: é onde a copy vai para a coluna da
   esquerda e o desenho para a direita. */
const TWO_COLUMN = "(min-width: 1024px)";

/* Quantos pontos tem o pontilhado da foto — e, portanto, a molécula: todo
   ponto da foto viaja e vira o desenho, nada some no caminho. Por isso a
   contagem é a de uma molécula, e não a de uma fotografia, como na LP C. */
const COUNT = { wide: 80_000, narrow: 40_000 };

/* A abertura, no princípio da primeira versão desta cena: o pontilhado
   aparece por cima da foto (CANVAS_IN), a foto sai por baixo dele (HERO_OUT)
   e o que fica é o desenho de pontos da própria imagem; a cor escorre para o
   grafite (TONE), e só então os pontos partem para o aminoácido. Tudo mais
   curto que lá: a travessia é o espetáculo, não a espera. */
const CANVAS_IN = { at: 0.002, run: 0.012 };
const HERO_OUT = { at: 0.008, run: 0.016 };
const TONE = { at: 0.018, run: 0.028 };

/** Onde cada troca começa e quanto dura, em fração da cena. Cada uma anda com
    `power2.inOut`, como na primeira versão: a nuvem acelera ao se soltar e
    desacelera ao assentar, e a forma se adensa sem estalo. */
const MORPH = [0.03, 0.26, 0.5, 0.74];
const RUN = [0.12, 0.2, 0.2, 0.2];
/* Quando a copy troca, em fração de cada morph. A regra é uma só nos dois
   sentidos: o texto de uma forma aparece quando **ela** está quase montada.
   Indo, isso é perto do fim do morph (0,62); voltando, o morph corre ao
   contrário e a forma anterior fica quase montada perto do começo dele
   (0,38). Uma linha do tempo em scrub não sabe fazer isso — ela só corre
   igual para os dois lados, e aí o texto trocava cedo na ida e tarde na
   volta. Por isso a copy não é tween da linha do tempo: é um estado lido da
   fase, com o sentido do scroll, e as entradas correm no tempo do relógio. */
const SWITCH = 0.62;

/* A volta para o hero é a exceção: ali não há texto seguinte, e a copy da
   primeira forma não pode ficar sobre a nuvem enquanto ela se desfaz de
   volta na foto. Ela sai assim que a molécula começa a se desmanchar. */
const HERO_BACK = 0.94;

/* O rótulo da bombona, em fração da foto a partir do centro (y para cima).
   É para lá que o zoom anda. */
const FOCUS: [number, number] = [-0.005, -0.16];

/* As cores da cena. Os destaques moram aqui, e não no CSS, porque o shader e
   a legenda do painel precisam ser o mesmo número. */
const PAPER = "#F4F2EC";
const TONES: Record<number, string> = { 1: "#4F8A1F", 2: "#C9731E" };

const rgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16) / 255,
  parseInt(hex.slice(3, 5), 16) / 255,
  parseInt(hex.slice(5, 7), 16) / 255,
];

const uniforms = (): ScanUniforms => ({
  phase: 0,
  /* A nuvem nasce invisível: até o scroll andar, quem aparece é o hero. */
  opacity: 0,
  tone: 0,
  zoom: 1,
  focus: [0, 0],
  /* Partidas quase juntas: a nuvem inteira viaja e se contrai para a forma,
     e o desenho só fica nítido quando ela chega. Com partidas espalhadas, os
     primeiros pontos chegam cedo e — com dezenas de milhares deles — a forma
     já aparece pronta no fundo enquanto o resto ainda está no ar. */
  stagger: 0.15,
  sweep: 0.85,
  /* O arco de todas as trocas, a primeira inclusive: parado não faz nada,
     porque o empurrão só existe enquanto o ponto viaja. Na primeira ele sai
     do ruído de gradiente, em correntes — ver `flow` em lib/scan/field.ts. */
  scatter: 90,
  cell: 3.4,
  dot: 2.2,
  keep: 1,
  drift: 1100,
  spin: 0.22,
  focal: 1400,
  cover: [1, 1],
  coverOffset: [0, 0],
  shapeScale: 1,
  shapeOffset: [0, 0],
  /* Grafite de floresta: o ponto escurece onde a imagem era escura — é um
     pontilhado, e o papel continua sendo o fundo. */
  inkLow: [0.06, 0.1, 0.07],
  ink: [0.34, 0.38, 0.31],
  accent: rgb(TONES[1]),
  accent2: rgb(TONES[2]),
  mark: 1,
  /* Pontilhado, não grade: o ponto é redondo desde o começo. */
  square: 0,
  /* A foto como pontilhado dela mesma, que respira e se solta em correntes —
     ver `flow` em lib/scan/field.ts. */
  flow: 1,
  gather: 0,
  disc: 0,
  grain: 0,
});

/** `object-fit: cover` em números, com o `object-position` do hero. */
function cover(imgW: number, imgH: number, w: number, h: number, posY: number) {
  const scale = Math.max(w / imgW, h / imgH);
  const dw = imgW * scale;
  const dh = imgH * scale;
  return {
    size: [dw, dh] as [number, number],
    offset: [0, -(h - dh) * (posY - 0.5)] as [number, number],
  };
}

export function Specimen({ children }: { children: React.ReactNode }) {
  const { specimen } = useContent().aminosanB;
  const scope = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      const surface = canvas.current;
      const stage = root?.querySelector<HTMLElement>(".sp-stage");
      const hero = root?.querySelector<HTMLElement>(".sp-hero");
      const black = root?.querySelector<HTMLElement>(".sp-black");
      if (!root || !surface || !stage || !hero || !black) return;

      const goStill = () => {
        root.classList.add("sp-still");
        root
          .querySelectorAll(".og-pill")
          .forEach((pill) => pill.classList.add("is-on"));
        root
          .querySelector<HTMLElement>(".sp-rail")
          ?.style.setProperty("--draw", "0");
        ScrollTrigger.refresh();
      };

      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { animate } = context.conditions as { animate: boolean };
          if (!animate) {
            goStill();
            return;
          }

          const narrow = window.matchMedia(NARROW).matches;
          const u = uniforms();
          let field: Field | null = null;
          let alive = true;
          let visible = true;
          let inView = true;
          let timeline: gsap.core.Timeline | null = null;
          let texts: HTMLElement[] = [];
          let splits: SplitText[] = [];
          let aspect = 2752 / 1536;
          /* A troca da foto pela nuvem: o pontilhado entra (`canvas`) e a foto
             sai (`hero`), cada um de 0 a 1. Quem aplica é o quadro: se a nuvem
             ainda não existe, a foto não sai — senão o scroll apagaria o hero
             e não poria nada no lugar. */
          const handoff = { canvas: 0, hero: 0 };
          /* A saída: quanto o círculo preto cresceu, e quanto já é sólido. */
          /* A saída em duas fases de um mesmo gesto: `fill` enche um círculo
             pequeno com as partículas; `grow` expande o sólido até a tela. */
          const ending = { fill: 0, grow: 0 };
          let count = 1;
          let darkHeader = false;
          let zoomed = 1;
          /* Qual leitura está em cena, para mover só as chamadas dela. */
          const shown = { stage: -1 };

          const calls = gsap.utils.toArray<HTMLElement>(".sp-call", root);

          /* Durante o fechamento em disco o canvas desenha em 1×: o preto não
             tem detalhe a perder, e cada partícula crescida pinta dezenas de
             pixels por quadro — em 2× seriam quatro vezes mais. */
          let lowRes = false;

          const fit = () => {
            if (!field) return;
            const w = stage.clientWidth;
            const h = stage.clientHeight;
            field.resize(
              w,
              h,
              lowRes ? 1 : Math.min(window.devicePixelRatio || 1, 2),
            );

            /* O `object-position` do hero: pelo pé, menos no notebook
               (861–1599px), onde as camadas descem para 60%. */
            const posY =
              window.innerWidth >= 861 && window.innerWidth <= 1599 ? 0.6 : 1;
            const box = cover(aspect * 1000, 1000, w, h, posY);
            u.cover = box.size;
            u.coverOffset = box.offset;
            u.focus = [FOCUS[0] * box.size[0], FOCUS[1] * box.size[1]];

            /* A foto de verdade aproxima pelo mesmo ponto que a nuvem: é o
               que deixa a troca entre as duas invisível. */
            const fx = w / 2 + u.focus[0] + box.offset[0];
            const fy = h / 2 - (u.focus[1] + box.offset[1]);
            hero.style.transformOrigin = `${fx}px ${fy}px`;

            const columns = window.matchMedia(TWO_COLUMN).matches;
            u.shapeScale = columns
              ? Math.min(w * 0.4, h * 0.6)
              : Math.min(w * 0.74, h * 0.4);
            u.shapeOffset = columns ? [w * 0.17, h * 0.02] : [0, h * 0.19];
            u.dot = columns ? 1.7 : 1.5;
          };

          /* ------------------------------------------------- o quadro */

          const tick = (time: number) => {
            if (!visible) return;

            /* A foto acompanha o zoom da nuvem pelo mesmo número, e não por
               um tween paralelo — dois tempos para um movimento só é como as
               duas descolariam no quadro da troca. */
            /* O círculo da saída: raio e opacidade lidos do mesmo número que
               manda as partículas para dentro dele. */
            if (
              ending.fill > 0 ||
              black.style.opacity ||
              (timeline?.scrollTrigger?.progress ?? 0) *
                (timeline?.duration() || 1.16) >=
                1.0
            ) {
              const w = stage.clientWidth;
              const h = stage.clientHeight;
              /* As partículas só enchem um círculo pequeno (SMALL do menor
                 lado): o grão fica pequeno, a conta é leve e o disco fecha
                 depressa. Daí em diante quem cresce é o sólido. */
              const small = Math.min(w, h) * 0.06;
              /* O preto final segue o scroll **real**, não a linha do tempo
                 amortecida: num scroll rápido o pin solta antes de o scrub
                 alcançar, e a cena subia com o círculo ainda pela metade,
                 mostrando uma faixa por baixo. Passado o ponto em que a tela
                 fica toda preta, ela está toda preta — com ou sem atraso. */
              const real = timeline?.scrollTrigger?.progress ?? 0;
              /* Mesmas curvas da linha do tempo, mas lidas do scroll real:
                 o raio nunca fica atrás do que o dedo já rolou. É contínuo —
                 chega a 1 exatamente no fim do pin —, então não há salto de
                 um círculo pela metade para a tela cheia. */
              const tReal = real * (timeline?.duration() || 1.16);
              const fill = Math.max(
                ending.fill,
                gsap.utils.clamp(0, 1, (tReal - 1.0) / 0.08),
              );
              const grow = Math.max(
                ending.grow,
                gsap.parseEase("power2.in")(
                  gsap.utils.clamp(0, 1, (tReal - 1.07) / 0.09),
                ),
              );
              const full = grow >= 1 ? 1 : 0;
              const r =
                gsap.utils.interpolate(Math.min(w, h) * 0.01, small, fill) +
                (Math.hypot(w, h) / 2 + 8 - small) * grow;
              u.disc = r;
              /* O grão: com N pontos espalhados por igual no disco, o passo
                 entre vizinhos é r·√(π/N); quatro passos e meio de diâmetro fecham
                 a superfície sem vão, mesmo com o acaso do sorteio. */
              u.grain = Math.max(3, r * Math.sqrt(Math.PI / count) * 4.5);
              /* Preenchido — a última partícula chegou —, a nuvem dá lugar a
                 um elemento sólido, do mesmo raio e no mesmo lugar. Os dois
                 são o mesmo preto, então a troca não se vê. */
              const solid = u.gather >= 0.999 || full === 1 || tReal >= 1.08;
              black.style.clipPath = `circle(${r}px at 50% 50%)`;
              black.style.opacity = solid ? "1" : "";
              surface.style.visibility = solid ? "hidden" : "";
              const dark = solid && r > h / 2;
              /* Reafirmado a cada quadro, e não só na troca: a seção seguinte
                 limpa o tom quando se rola de volta para cima dela, com este
                 preto ainda cobrindo o alto da tela. */
              const html = document.documentElement;
              if (dark && html.dataset.navTheme !== "dark")
                html.dataset.navTheme = "dark";
              else if (!dark && darkHeader) delete html.dataset.navTheme;
              darkHeader = dark;
            }

            if (u.zoom !== zoomed) {
              zoomed = u.zoom;
              hero.style.transform = zoomed === 1 ? "" : `scale(${zoomed})`;
            }
            const out = field ? handoff.hero : 0;
            hero.style.opacity = out > 0 ? String(1 - out) : "";
            if (!field) return;
            /* Troca de resolução só na borda do fechamento, uma vez para cada
               lado — resize refaz o buffer do canvas. */
            const closing = u.gather > 0;
            if (closing !== lowRes) {
              lowRes = closing;
              fit();
            }
            /* Depois da troca para o elemento sólido, o canvas está escondido:
               não há por que desenhá-lo. */
            if (u.gather >= 0.999) return;
            u.opacity = handoff.canvas;
            field.render(u, time);

            const i = shown.stage;
            if (i < 0) return;
            const anchors = SPECIMEN[i].anchors;
            const w = stage.clientWidth / 2;
            const h = stage.clientHeight / 2;
            for (let k = 0; k < anchors.length; k++) {
              const el = calls[i * 3 + k];
              if (!el) continue;
              const [x, y, depth] = project(anchors[k].at, u, time);
              el.style.transform = `translate3d(${w + x}px, ${h + y}px, 0)`;
              el.style.setProperty(
                "--depth",
                String(gsap.utils.clamp(0.45, 1, depth)),
              );
            }
          };

          const io = new IntersectionObserver(
            ([entry]) => {
              inView = entry.isIntersecting;
              visible = inView && !document.hidden;
            },
            {
              rootMargin: "20% 0px",
            },
          );
          io.observe(root);
          const onVisibility = () => {
            /* Duas fontes, guardadas à parte: ao voltar para a aba, a cena
               precisa saber se continua na tela. Numa flag só, esconder a aba
               a zerava e voltar não a religava — a cena ficava travada. */
            visible = inView && !document.hidden;
          };
          const ro = new ResizeObserver(fit);
          ro.observe(stage);

          /* -------------------------------------------- a linha do tempo */

          /* ------------------------------------------------ a copy */

          /* Qual texto está em cena, e o sentido em que o scroll anda. */
          let current = -1;
          let lastPhase = 0;
          let heading = 1;

          /* A entrada, no registro dos sites editoriais: o título chega de
             lado, linha a linha, saindo de um desfoque; o resto do bloco vem
             depois, com o próprio tempo e ainda mais contido. Indo, entra da
             esquerda e sai para a direita; voltando, o contrário. */
          /* O compasso da troca. A saída é mais longa que um piscar e a entrada
             espera ela ir quase toda (AFTER): os dois textos se cruzam só no
             fim, sem disputar a leitura. Dentro da entrada, o título vem
             primeiro e o resto do bloco bem depois, no próprio tempo. */
          const T = {
            out: 0.75,
            after: 0.3,
            title: 1.4,
            lineGap: 0.09,
            rest: 1.2,
            restAt: 0.35,
            restGap: 0.1,
          };

          const enter = (k: number, dir: number, wait = 0) => {
            const text = texts[k];
            const rest = text.querySelectorAll(".sp-fade");
            const lines = splits[k]?.lines ?? [];
            const own = root.querySelectorAll(`.sp-call[data-i="${k}"]`);
            gsap.killTweensOf([text, ...lines, ...rest, ...own]);
            gsap.set(text, { opacity: 1, x: 0, filter: "none" });
            gsap.fromTo(
              lines,
              { opacity: 0, x: -28 * dir, filter: "blur(10px)" },
              {
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
                duration: T.title,
                stagger: T.lineGap,
                delay: wait,
                ease: "power3.out",
              },
            );
            gsap.fromTo(
              rest,
              { opacity: 0, x: -12 * dir, filter: "blur(4px)" },
              {
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
                duration: T.rest,
                stagger: T.restGap,
                delay: wait + T.restAt,
                ease: "power2.out",
              },
            );
            gsap.fromTo(
              own,
              { opacity: 0 },
              { opacity: 1, duration: 0.9, stagger: 0.12, delay: wait + 0.3 },
            );
          };

          const leave = (k: number, dir: number) => {
            const text = texts[k];
            const own = root.querySelectorAll(`.sp-call[data-i="${k}"]`);
            gsap.killTweensOf([text, ...own]);
            gsap.to(text, {
              opacity: 0,
              x: 18 * dir,
              filter: "blur(6px)",
              duration: T.out,
              ease: "power2.inOut",
            });
            gsap.to(own, {
              opacity: 0,
              duration: T.out * 0.8,
              ease: "power2.inOut",
            });
          };

          const syncCopy = () => {
            const phase = u.phase;
            if (phase > lastPhase + 1e-4) heading = 1;
            else if (phase < lastPhase - 1e-4) heading = -1;
            lastPhase = phase;
            const raw =
              heading > 0
                ? Math.floor(phase + 1 - SWITCH) - 1
                : Math.ceil(phase - (1 - SWITCH)) - 1;
            const next = gsap.utils.clamp(-1, texts.length - 1, raw);
            /* No fechamento em disco não há forma para descrever: a copy sai. */
            const target =
              u.gather > 0.03 || (heading < 0 && phase < HERO_BACK) ? -1 : next;
            if (target === current) return;
            if (current >= 0) leave(current, heading);
            if (target >= 0) enter(target, heading, current >= 0 ? T.after : 0);
            current = target;
            /* As chamadas acompanham o giro só da forma em cena. */
            shown.stage = target;
          };

          const build = (): gsap.core.Timeline => {
            /* O SplitText mede linha por linha: por isso o build espera as
               fontes, senão o título quebra no lugar errado e fica preso lá. */
            texts = gsap.utils.toArray<HTMLElement>(".sp-read", root);
            splits = texts.map(
              (text) =>
                new SplitText(text.querySelector(".sp-head"), {
                  /* Sem máscara: a entrada é lateral e com desfoque, e a
                     máscara cortaria as duas coisas. */
                  type: "lines",
                }),
            );
            const rail = root.querySelector<HTMLElement>(".sp-rail");
            const pills = gsap.utils.toArray<HTMLElement>(".og-pill", root);
            const steps = pills.length;
            /* Quantas etapas estão acesas: chega a k+1 no fim do morph k. */
            const route = { lit: 0 };

            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: stage,
                start: "top top",
                /* 760% da cena, mais o fechamento em disco no fim (1,0 a
                   1,16 da linha do tempo), no mesmo compasso por tela. */
                end: "+=880%",
                scrub: 0.7,
                pin: true,
                anticipatePin: 1,
                /* A cena é a primeira da página mas é criada por último, depois
                   do véu e da textura. Sem prioridade o ScrollTrigger mede as
                   outras seções antes de existir o espaçador deste pin. */
                refreshPriority: 1,
              },
              onUpdate: () => {
                syncCopy();
                const drawn = gsap.utils.clamp(
                  0,
                  1,
                  (route.lit - 1) / (steps - 1),
                );
                rail?.style.setProperty("--draw", String(1 - drawn));
                pills.forEach((pill, k) =>
                  pill.classList.toggle("is-on", route.lit >= k + 0.98),
                );
              },
            });

            /* 1. O texto do hero sai, e a foto aproxima de leve. */
            tl.to(
              root.querySelectorAll("[data-hb-copy]"),
              { opacity: 0, y: -18, duration: 0.014, stagger: 0.003 },
              0,
            )
              .to(u, { zoom: 1.1, duration: 0.1, ease: "power1.inOut" }, 0)
              /* 2. O pontilhado da foto aparece por cima dela, e a foto sai por
                    baixo: o que fica é o desenho de pontos da própria imagem,
                    na cor dela — os pontos que em seguida viram o aminoácido. */
              .to(
                handoff,
                { canvas: 1, duration: CANVAS_IN.run, ease: "power1.out" },
                CANVAS_IN.at,
              )
              .to(
                handoff,
                { hero: 1, duration: HERO_OUT.run, ease: "power1.inOut" },
                HERO_OUT.at,
              )
              /* 3. A cor escorre para o grafite antes da partida. */
              .to(
                u,
                { tone: 1, duration: TONE.run, ease: "power1.inOut" },
                TONE.at,
              )
              .fromTo(
                ".sp-scrim",
                { opacity: 0 },
                { opacity: 1, duration: 0.04 },
                0.1,
              )
              .fromTo(
                rail,
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, duration: 0.04 },
                0.1,
              );

            MORPH.forEach((at, i) => {
              tl.to(
                u,
                { phase: i + 1, duration: RUN[i], ease: "power2.inOut" },
                at,
              );
              tl.to(
                route,
                { lit: i + 1, duration: RUN[i], ease: "power1.inOut" },
                at,
              );
            });

            /* A saída, num movimento só. O texto, as chamadas e o trilho vão
               embora para a direita; ao mesmo tempo o círculo preto nasce no
               centro, pequeno, e cresce sem parar até cobrir a tela. As
               partículas da folha correm para dentro dele enquanto ele cresce
               (o alvo delas é o raio do círculo naquele quadro), e ele fica
               sólido quando chegam as últimas: cada uma cresce ao chegar até
               fechar o disco, recortada na borda exata. O disco das
               partículas é bem pequeno — 6% do menor lado —, e com
               `u.gather` em 1 (1,08) a nuvem dá lugar a um elemento sólido,
               que segue crescendo até cobrir a tela em 1,16, o fim da cena. A seção
               seguinte (Field.tsx) já começa toda preta: a emenda é preto
               sobre preto. */
            tl.fromTo(
              u,
              { gather: 0 },
              { gather: 1, duration: 0.08, ease: "power1.in" },
              1.0,
            )
              .fromTo(
                ending,
                { fill: 0 },
                { fill: 1, duration: 0.08, ease: "none" },
                1.0,
              )
              .fromTo(
                ending,
                { grow: 0 },
                { grow: 1, duration: 0.09, ease: "power2.in" },
                /* A expansão começa antes de o disco fechar: as duas curvas
                   se somam, e não há parada entre encher e crescer. */
                1.07,
              )
              .to(
                rail,
                {
                  opacity: 0,
                  x: 18,
                  filter: "blur(6px)",
                  duration: 0.03,
                  ease: "power2.in",
                },
                1.0,
              )
              .to(".sp-scrim", { opacity: 0, duration: 0.03 }, 1.0);

            ScrollTrigger.refresh();
            return tl;
          };

          /* ------------------------------------------------- a nuvem */

          void (async () => {
            await booted;
            if (!alive) return;
            await document.fonts?.ready;
            if (!alive) return;
            timeline = build();
            try {
              /* A textura é o hero inteiro: o fundo com as folhas da frente
                 por cima, compostos num canvas. Assim a foto que se fragmenta
                 é a mesma que o leitor estava olhando, com as duas camadas. */
              const suffix = narrow ? "-mobile" : "";
              const [bg, leaves] = await Promise.all([
                loadImage(`/img/aminosan-b/hero-bg${suffix}.webp`),
                loadImage(`/img/aminosan-b/hero-leaves${suffix}.webp`),
              ]);
              if (!alive) return;
              const photo = document.createElement("canvas");
              photo.width = bg.naturalWidth;
              photo.height = bg.naturalHeight;
              const ctx = photo.getContext("2d");
              if (!ctx) throw new Error("specimen: sem canvas 2D");
              ctx.drawImage(bg, 0, 0);
              ctx.drawImage(leaves, 0, 0, photo.width, photo.height);
              aspect = photo.width / photo.height;

              /* O pontilhado: denso onde a foto é escura, vazio no céu, com a
                 bombona e o nome dela reforçados — ver lib/scan/stipple.ts.
                 O par entre a foto e cada forma é o índice, e portanto
                 sorteado: é ele que faz a nuvem se soltar de verdade. */
              const dots = stipplePhoto(
                bg,
                leaves,
                narrow ? COUNT.narrow : COUNT.wide,
                FRAMES[narrow ? "narrow" : "wide"],
              );
              const data = buildFromPoints(
                dots.uv,
                dots.depth,
                SPECIMEN.map((f) => f.points),
              );
              if (!alive) return;
              count = data.count;
              field = createScan(surface, photo, data);
              if (!field) {
                goStill();
                timeline?.scrollTrigger?.kill();
                timeline?.kill();
                timeline = null;
                return;
              }
              fit();
            } catch {
              if (alive) goStill();
            }
          })();

          gsap.ticker.add(tick);
          document.addEventListener("visibilitychange", onVisibility);
          ScrollTrigger.addEventListener("refresh", fit);

          if (process.env.NODE_ENV !== "production") {
            /* Os uniforms no console, para conferir um número. */
            Object.assign(window, { specimenScene: u });
          }

          return () => {
            alive = false;
            gsap.ticker.remove(tick);
            document.removeEventListener("visibilitychange", onVisibility);
            ScrollTrigger.removeEventListener("refresh", fit);
            io.disconnect();
            ro.disconnect();
            timeline?.scrollTrigger?.kill();
            timeline?.kill();
            /* As entradas da copy correm no relógio, fora da linha do tempo. */
            gsap.killTweensOf([
              ...texts,
              ...calls,
              ...texts.flatMap((t) => [...t.querySelectorAll(".sp-fade")]),
            ]);
            splits.forEach((split) => split.revert());
            timeline = null;
            field?.dispose();
            field = null;
            hero.style.transform = "";
            hero.style.opacity = "";
            black.style.opacity = "";
            surface.style.visibility = "";
            if (darkHeader) delete document.documentElement.dataset.navTheme;
          };
        },
      );
    },
    { scope },
  );

  const { stages, steps } = specimen;
  const total = String(stages.length).padStart(2, "0");

  return (
    <section
      ref={scope}
      className="relative text-forest"
      style={{ backgroundColor: PAPER }}
    >
      <div className="sp-stage relative h-[100svh] min-h-[600px] overflow-hidden">
        <div className="sp-hero absolute inset-0 z-0">{children}</div>

        {/* O círculo preto da saída. Só aparece no quadro em que a nuvem
            fecha o disco inteiro — aí ele assume, e o canvas sai. */}
        <div
          aria-hidden
          className="sp-black pointer-events-none absolute inset-0 z-[1] bg-[#060606] opacity-0"
          style={{ clipPath: "circle(0px at 50% 50%)" }}
        />

        <canvas
          ref={canvas}
          aria-hidden
          className="sp-live pointer-events-none absolute inset-0 z-[1] block size-full"
        />

        {/* No celular o pé clareia para a copy ler sobre os pontos. */}
        <div
          aria-hidden
          className="sp-scrim pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[62%] opacity-0 lg:hidden"
          style={{
            background: `linear-gradient(180deg, transparent, ${PAPER} 40%)`,
          }}
        />

        {/* As chamadas, penduradas em pontos do desenho. Só no desktop: no
            celular o mesmo texto vira lista no painel. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[4]">
          {stages.map((s, i) =>
            s.callouts.map((c, k) => (
              <div
                key={`${i}-${c.label}`}
                data-i={i}
                className="sp-call"
                style={{
                  ["--side" as string]: SPECIMEN[i].anchors[k]?.side ?? 1,
                }}
              >
                <span className="sp-ring" />
                <span className="sp-lead" />
                <span className="sp-tagbox">
                  <span className="sp-call-label">{c.label}</span>
                  <span className="sp-call-note">{c.note}</span>
                </span>
              </div>
            )),
          )}
        </div>

        <div
          style={{
            ["--sp-gut" as string]:
              "max(var(--spacing-gut), calc((100vw - var(--container-wrap)) / 2))",
          }}
          className="sp-panel pointer-events-none absolute inset-x-0 bottom-0 z-[5] px-[var(--spacing-gut)] pb-[clamp(24px,5svh,56px)] lg:inset-x-auto lg:bottom-auto lg:top-1/2 lg:left-[var(--sp-gut)] lg:w-[min(38vw,450px)] lg:-translate-y-1/2 lg:px-0 lg:pb-0"
        >
          {/* As quatro leituras ocupam a mesma célula da grade, uma por vez.
              A célula tem a altura da **mais alta** delas — em português, o
              título da corrente e o da folha vão a três linhas —, e o trilho
              embaixo fica sempre abaixo de todas, sem pular na troca. Com
              altura fixa, o bloco mais alto invadia o trilho. */}
          <div className="sp-slots grid">
            {stages.map((s, i) => (
              <article
                key={s.kicker}
                data-i={i}
                className="sp-read col-start-1 row-start-1 self-end opacity-0 lg:self-start"
              >
                <p
                  className={`${microCaps} sp-fade flex items-center gap-3 text-olive`}
                >
                  <span className="sp-id">
                    {String(i + 1).padStart(2, "0")}/{total}
                  </span>
                  {s.kicker}
                </p>
                <h2 className="sp-head mt-3 max-w-[18ch] text-[clamp(26px,3vw,48px)] leading-[1.02] tracking-[-0.03em] text-balance">
                  {s.heading}
                </h2>
                <p className="sp-fade mt-3 max-w-[44ch] text-[clamp(13px,1.02vw,17px)] leading-[1.45] text-muted lg:mt-4">
                  {s.body}
                </p>

                {/* A legenda das cores do desenho — o leigo não precisa saber
                    o que é um grupo amino, só que o verde é o nitrogênio. */}
                <ul className="sp-legend sp-fade mt-3 flex flex-wrap gap-x-5 gap-y-1 lg:mt-4">
                  {s.legend.map((l) => (
                    <li
                      key={l.label}
                      className={`${microCaps} flex items-center gap-2 text-forest`}
                    >
                      <span
                        aria-hidden
                        className="block size-2.5 rounded-full"
                        style={{ backgroundColor: TONES[l.tone] }}
                      />
                      {l.label}
                    </li>
                  ))}
                </ul>

                <ul className="sp-fade mt-3 grid gap-1.5 lg:hidden">
                  {s.callouts.map((c) => (
                    <li
                      key={c.label}
                      className="flex gap-3 text-[12px] leading-[1.35]"
                    >
                      <span
                        aria-hidden
                        className="mt-[6px] block size-1.5 shrink-0 rounded-full bg-olive"
                      />
                      <span>
                        <span className="font-display text-[11px] tracking-[0.08em] uppercase text-forest">
                          {c.label}
                        </span>
                        <span className="text-muted"> — {c.note}</span>
                      </span>
                    </li>
                  ))}
                </ul>

                <dl className="sp-fade mt-6 hidden max-w-[360px] grid-cols-3 gap-px border border-forest/15 bg-forest/15 lg:grid">
                  {s.readout.map((r) => (
                    <div
                      key={r.k}
                      className="px-3 py-2.5"
                      style={{ backgroundColor: PAPER }}
                    >
                      <dt className={`${microCaps} text-[10px] text-forest/55`}>
                        {r.k}
                      </dt>
                      <dd className="mt-1 text-[15px] leading-[1.2] tracking-[-0.01em] text-forest">
                        {r.v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>

          <Rail steps={steps} />
        </div>
      </div>
    </section>
  );
}

/**
 * O trilho das etapas, no pé da coluna: diz em palavras onde se está. A linha
 * se desenha por `stroke-dashoffset` e cada nó acende quando o morph dele
 * fecha — as mesmas classes `og-*` do trilho que a cena anterior usava.
 */
const RAIL = { w: 460, h: 44, x0: 30, x1: 430, y: 13 };

function Rail({ steps }: { steps: string[] }) {
  const at = (k: number) =>
    RAIL.x0 + ((RAIL.x1 - RAIL.x0) * k) / (steps.length - 1);
  return (
    <div className="sp-rail mt-6 hidden border-t border-forest/15 pt-4 opacity-0 lg:block">
      <svg
        viewBox={`0 0 ${RAIL.w} ${RAIL.h}`}
        className="og-svg w-full"
        role="img"
        aria-label={steps.join(" → ")}
      >
        <line
          x1={RAIL.x0}
          y1={RAIL.y}
          x2={RAIL.x1}
          y2={RAIL.y}
          className="og-track"
        />
        <line
          x1={RAIL.x0}
          y1={RAIL.y}
          x2={RAIL.x1}
          y2={RAIL.y}
          className="og-draw"
          pathLength={1}
        />
        {steps.map((step, k) => (
          <g key={step} className="og-pill">
            <circle cx={at(k)} cy={RAIL.y} r={5.5} className="og-node" />
            <text x={at(k)} y={RAIL.h - 6} className="og-tag">
              {step}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error(`specimen: falhou ao carregar ${src}`));
    img.src = src;
  });
}
