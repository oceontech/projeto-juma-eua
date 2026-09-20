"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import { Building2, FlaskConical, Hourglass, Sprout, type LucideIcon } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { booted } from "@/lib/boot";
import { useContent } from "@/components/layout/LocaleProvider";
import { scroller } from "@/components/motion/SmoothScroll";

/* Duas montagens da mesma cena: a paisagem, e o corte 9:16 do celular. A
   narrativa é a mesma — galão no campo, molécula, fecho —, mas cada edição
   tem a sua duração e os seus tempos de parada, então cada uma carrega os
   próprios quadros. O par ida/volta existe porque o retrocesso é outro
   arquivo, não o mesmo tocado ao contrário: nenhum navegador reproduz vídeo
   em marcha a ré. */
const CUTS = {
  wide: {
    forward: "/videos/video-hero-aminosan-scrub.mp4",
    back: "/videos/video-hero-aminosan-reverse.mp4",
    /** Os três quadros narrativos. Ajuste aqui quando a edição mudar. */
    stops: [1.05, 6.05, 8.68],
    /** Só vale até o arquivo declarar a sua: é a rede que atrasa, não o corte. */
    length: 8.733,
  },
  tall: {
    forward: "/videos/video-hero-aminosan-mobile-scrub.mp4",
    back: "/videos/video-hero-aminosan-mobile-reverse.mp4",
    stops: [1.15, 5.95, 7.1],
    length: 7.166,
  },
} as const;

/* Os SVGs de /img/aminosan/icon-stat-* são discos brancos com o símbolo
   verde por dentro; forçados a branco pelo filtro, viravam só o disco. Aqui o
   símbolo vem sozinho, como traço, e o disco é do cartão. */
const STAT_ICON: Record<"years" | "company" | "fermentation" | "trials", LucideIcon> = {
  years: Hourglass,
  company: Building2,
  fermentation: FlaskConical,
  trials: Sprout,
};

/* A rota do nitrogênio em três paradas. O desenho carrega o sentido — o íon
   de nitrato, o grupo amino se ligando, a cadeia montada —, e a fórmula ao
   lado dele é a mesma em qualquer idioma: o rótulo é a única coisa que o
   conteúdo traduz. */
const STEP_MARK = [
  /* Nitrato: o íon trigonal, um nitrogênio e três oxigênios. */
  <g key="nitrate">
    <circle cx="14" cy="14" r="3.3" fill="currentColor" />
    <g stroke="currentColor" strokeWidth="1.25" fill="none">
      <path d="M14 10.7V7.1" />
      <path d="m11.2 15.7-3.1 1.8" />
      <path d="m16.8 15.7 3.1 1.8" />
      <circle cx="14" cy="5" r="2.3" />
      <circle cx="6.1" cy="19.1" r="2.3" />
      <circle cx="21.9" cy="19.1" r="2.3" />
    </g>
  </g>,
  /* Aminação: o grupo amino chega à cadeia — a seta é o próprio gasto. */
  <g key="aminate" fill="none" stroke="currentColor" strokeWidth="1.25">
    <path d="M5.4 20.2 10 15.6l4.6 3 4.4-4.6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="5.4" cy="20.2" r="1.9" />
    <circle cx="14.6" cy="18.6" r="1.9" />
    <circle cx="19" cy="14" r="2.6" fill="currentColor" stroke="none" />
    <path d="M21.4 8.2v3.1" strokeLinecap="round" />
    <path d="m19.6 10.2 1.8 1.9 1.8-1.9" strokeLinecap="round" strokeLinejoin="round" />
  </g>,
  /* Proteína: a cadeia fechada, contas ligadas uma à outra. */
  <g key="protein" fill="none" stroke="currentColor" strokeWidth="1.25">
    <path d="M4.6 17.8 10 11.6l5.2 5.4 5.6-6.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="10" cy="11.6" r="2" />
    <circle cx="15.2" cy="17" r="2" />
    <circle cx="4.6" cy="17.8" r="2" fill="currentColor" stroke="none" />
    <circle cx="21.6" cy="9.8" r="2.4" fill="currentColor" stroke="none" />
  </g>,
];

const STEP_FORMULA = ["NO₃⁻", "NH₂", "CO—NH"];

function StepCard({ index, label }: { index: number; label: string }) {
  return (
    <article data-video-hero-step className="aminosan-step-card max-lg:flex-col max-lg:items-start">
      <span aria-hidden className="aminosan-step-card-icon">
        <svg viewBox="0 0 28 28" className="size-[62%]" aria-hidden>
          {STEP_MARK[index]}
        </svg>
      </span>
      <div className="min-w-0">
        <p className="font-display text-[clamp(12px,0.95vw,15px)] font-bold tracking-[0.12em] text-white uppercase">
          {label}
        </p>
        <p className="mt-0.5 text-[clamp(10px,0.72vw,12px)] tracking-[0.08em] text-lime/85 max-lg:hidden">
          {STEP_FORMULA[index]}
        </p>
      </div>
    </article>
  );
}

/** O scroll escolhe o trecho; o próprio decoder reproduz todos os frames. */
export function Hero() {
  const { hero, nitrogen } = useContent().aminosan;
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reverseVideoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const scene = root.current;
      const video = videoRef.current;
      const reverseVideo = reverseVideoRef.current;
      if (!scene || !video || !reverseVideo) return;

      const html = document.documentElement;
      const firstReveal = scene.querySelector<HTMLElement>("[data-video-hero='first-reveal']");
      const firstContent = scene.querySelector<HTMLElement>("[data-video-hero='first-content']");
      const moleculeContent = scene.querySelector<HTMLElement>("[data-video-hero='molecule-content']");
      const blackout = scene.querySelector<HTMLElement>("[data-video-hero='blackout']");
      const windowElement = scene.querySelector<HTMLElement>(".aminosan-hero-window");
      const title = scene.querySelector<HTMLElement>("[data-video-hero='title']");
      if (!firstReveal || !firstContent || !moleculeContent || !blackout || !windowElement) return;
      if (!title) return;

      const mm = gsap.matchMedia();

      /* A orientação entra junto da largura: o corte 9:16 só serve a uma tela
         em pé. O mesmo telefone deitado tem 390px de altura e a janela volta
         a ser paisagem — ali quem cabe é a montagem larga. */
      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          still: "(prefers-reduced-motion: reduce)",
          tall: "(max-width: 860px) and (orientation: portrait)",
        },
        (context) => {
          const { animate, tall } = context.conditions as { animate: boolean; tall: boolean };

          /* A fonte entra aqui, e não no JSX, por uma razão de peso: marcada
             no HTML, o telefone baixaria os 12MB do par paisagem antes de
             qualquer script descobrir que não é o dele. */
          const cut = tall ? CUTS.tall : CUTS.wide;
          const attach = (element: HTMLVideoElement, src: string) => {
            if (element.getAttribute("src") === src) return;
            element.src = src;
            element.load();
          };
          attach(video, cut.forward);
          attach(reverseVideo, cut.back);

          /* Cada montagem tem o seu jogo de chapas: elas saem quadro a quadro
             do vídeo a que pertencem, e as da paisagem não casam com nenhum
             enquadramento do 9:16. Os dois jogos moram no DOM e o CSS tira do
             ar o que não é desta tela — por `display`, e não por visibilidade,
             que é o que faz o navegador nem chegar a baixar o jogo que não vai
             mostrar. */
          const layer = (name: string) =>
            scene.querySelector<HTMLElement>(`[data-video-hero='${name}${tall ? "-tall" : ""}']`);

          const productPlate = layer("plate-product");
          const productCutout = layer("cutout-product");
          const moleculePlate = layer("plate-molecule");
          const moleculeCutout = layer("cutout-molecule");
          const moleculeOrbit = layer("molecule-orbit");
          if (!productPlate || !productCutout || !moleculePlate || !moleculeCutout) return;
          if (!moleculeOrbit) return;

          const leafLeft = layer("leaf-left");
          const leafRight = layer("leaf-right");
          const swingLeft = layer("leaf-left-swing");
          const swingRight = layer("leaf-right-swing");
          if (!leafLeft || !leafRight || !swingLeft || !swingRight) return;

          if (!animate) {
            const showStill = () => {
              if (video.readyState >= 1) video.currentTime = cut.stops[0];
              /* As chapas são o mesmo quadro, e uma imagem aparece onde um
                 vídeo buscado pode não pintar nada. Paradas, aqui. */
              gsap.set([productPlate, title, productCutout, leafLeft, leafRight, firstReveal], {
                autoAlpha: 1,
              });
            };

            if (video.readyState >= 1) showStill();
            else video.addEventListener("loadedmetadata", showStill, { once: true });

            return () => video.removeEventListener("loadedmetadata", showStill);
          }

          let disposed = false;
          let frame = 0;
          let playing = false;
          let direction: 1 | -1 = 1;
          let settledIndex = -1;
          let destinationIndex = 0;
          let touchY = 0;
          let lastGesture = 0;
          /* Cada chamada de playTo abre uma corrida e aposenta a anterior. As
             promessas de play() e os quadros de monitor carregam a senha da
             sua: uma play() que só falha depois — abortada pelo gesto
             seguinte — não tem mais como parar a cena no lugar errado. */
          let run = 0;
          const stops = cut.stops;

          const clamp = (value: number, max: number) => Math.max(0, Math.min(max, value));

          const duration = () =>
            Number.isFinite(video.duration) && video.duration > 0 ? video.duration : cut.length;

          /* O reverso é outro arquivo e pode ter uns quadros de diferença. A
             conversão é proporcional, não uma subtração seca: meio segundo de
             folga na duração viraria meio segundo de salto na troca. */
          const reverseDuration = () =>
            Number.isFinite(reverseVideo.duration) && reverseVideo.duration > 0
              ? reverseVideo.duration
              : duration();

          const toReverse = (time: number) =>
            clamp(reverseDuration() * (1 - clamp(time, duration()) / duration()), reverseDuration());

          const fromReverse = (time: number) =>
            clamp(duration() * (1 - clamp(time, reverseDuration()) / reverseDuration()), duration());

          /* Onde a cena está agora, no relógio do vídeo de ida. Quem responde
             é o vídeo que está tocando: perguntar ao outro devolve um tempo
             velho — zero, enquanto ele nunca andou —, e zero no reverso é o
             fim da cena. Era daí que vinha o salto para o final. */
          const forwardTime = () =>
            direction === 1 ? clamp(video.currentTime, duration()) : fromReverse(reverseVideo.currentTime);

          const stopCopy = () => {
            gsap.killTweensOf([firstReveal, firstContent, moleculeContent, title]);
            gsap.killTweensOf("[data-video-hero-card]");
            gsap.killTweensOf("[data-video-hero-title-part]");
            gsap.killTweensOf("[data-video-hero-step]");
            gsap.killTweensOf("[data-video-hero-step-link]");
            gsap.killTweensOf("[data-video-hero-molecule-line]");
          };

          const hideCopy = () => {
            stopCopy();
            gsap.to([firstContent, moleculeContent, title], {
              autoAlpha: 0,
              y: -18,
              duration: 0.28,
              ease: "power2.in",
              overwrite: true,
            });
          };

          /* ----------------------------------------------- as chapas paradas */
          /* Cada parada tem seu par: o fundo com o assunto apagado e o recorte
             do assunto — o galão com o campo, a molécula. Somados no repouso
             dão exatamente o quadro em que o vídeo parou, porque saíram dele.
             Por isso entram e saem sem transição: não há o que cruzar, o pixel
             é o mesmo. O que os separa é o movimento.

             A escala em repouso é 1, e não a de trabalho: é ela que garante a
             troca invisível. O recorte cresce depois que a cena para, e volta
             a 1 antes de sair — o crescer é o próprio afastamento da câmera,
             e é ele que dá ao recorte a folga para deslizar sem descolar da
             borda da janela.

             No produto o recorte vai de borda a borda — é o campo inteiro — e
             ali `lift` precisa cobrir `sway`: a folga de cada lado vale
             (lift - 1) / 2 / lift, 2,8% contra 1,35% de balanço. Por isso o
             balanço é medido na própria chapa e não em pixels; fixo, uma
             janela estreita esgotaria a folga e a borda apareceria.

             A molécula não tem essa amarra: flutua longe das bordas e o resto
             da chapa é transparente, então anda quase o dobro. O que a limita
             é outra coisa — o buraco que ela deixa na chapa de trás, que ela
             precisa continuar cobrindo. */
          /* Cada camada tem o seu balanço: quanto mais perto de quem olha, mais
             ela anda contra o ponteiro. É essa diferença — campo 1,35%, folhas
             2,1% — que lê como profundidade. A escala, ao contrário, é uma só
             para todas: a que as mantém casadas no repouso.

             As folhas têm o limite mais apertado: chegam à borda da tela, e
             balanço mais balanço ocioso não pode passar da folga que a escala
             abre (2,8% da largura, 2,8% da altura). 2,1% + 5px no eixo x e
             1,6% + 6px no y ficam dentro nas larguras usuais.

             Além do ponteiro, cada folha respira sozinha: um giro curto em
             torno da base, mais um vai e vem nos dois eixos, em períodos
             diferentes para os três nunca fecharem o ciclo juntos. */
          const PLATES = [
            {
              plate: productPlate,
              lift: 1.06,
              layers: [
                { el: productCutout, swayX: 1.35, swayY: 1.2 },
                { el: leafLeft, swayX: 2.1, swayY: 1.6 },
                { el: leafRight, swayX: 2.1, swayY: 1.6 },
              ],
              idle: [
                { el: swingLeft, origin: "0% 100%", rot: 1.1, x: 5, y: -6, spin: 4.6, driftX: 6.2, driftY: 5.1 },
                { el: swingRight, origin: "100% 100%", rot: -1.3, x: -5, y: -5, spin: 5.4, driftX: 7.1, driftY: 4.4 },
              ],
              orbitCalm: false,
            },
            {
              plate: moleculePlate,
              lift: 1.04,
              layers: [{ el: moleculeCutout, swayX: 1.8, swayY: 1.9 }],
              /* A molécula flutua sozinha — sem base para girar em torno,
                 então o "giro" mora nos dois eixos, em períodos próximos mas
                 não iguais, o que é o que faz o vaivém ler como órbita em vez
                 de balanço linear. */
              idle: [
                { el: moleculeOrbit, origin: "50% 50%", rot: 1.2, x: 9, y: 7, spin: 12, driftX: 9.5, driftY: 8 },
              ],
              /* Único caso que acalma sozinho: a molécula ocupa o centro da
                 cena e é onde o parallax do ponteiro mexe mais. Some as duas
                 fontes de movimento no pique máximo de ambas e a órbita vira
                 tremor; por isso ela desacelera assim que o ponteiro entra
                 em jogo, em vez de somar as duas. */
              orbitCalm: true,
            },
          ];
          const RECOIL = 0.22;

          let raised: (typeof PLATES)[number] | null = null;
          let aimX = 0;
          let aimY = 0;
          let driftX = 0;
          let driftY = 0;
          let chase = 0.07;
          let recoil: gsap.core.Tween | null = null;
          let restingSince = 0;
          let breathing: gsap.core.Tween[] = [];
          let calm = 1;

          const layersOf = (set: (typeof PLATES)[number]) => set.layers.map((layer) => layer.el);
          const swingsOf = (set: (typeof PLATES)[number]) => set.idle.map((swing) => swing.el);

          /* O ponteiro dá o alvo, o tique persegue. O atraso é o efeito: sem
             ele o recorte gruda no cursor e vira um adesivo. */
          const drift = () => {
            if (!raised) return;
            driftX += (aimX - driftX) * chase;
            driftY += (aimY - driftY) * chase;
            /* Contra o ponteiro: é assim que o perto anda em relação ao longe
               quando quem olha se desloca. A favor viraria empurrão. */
            for (const layer of raised.layers) {
              gsap.set(layer.el, {
                xPercent: -driftX * layer.swayX,
                yPercent: -driftY * layer.swayY,
              });
            }

            /* A órbita não para quando o ponteiro entra em jogo — só fica
               mais devagar, para as duas fontes de movimento (o parallax e a
               órbita) não se somarem no pique de ambas e virarem tremor. A
               marcha vem do próprio módulo do parallax: quanto mais perto do
               centro, mais perto da velocidade normal; quanto mais longe,
               mais lenta. `calm` persegue o alvo como o próprio parallax
               persegue o ponteiro, pelo mesmo motivo — sem isso a troca de
               velocidade seria um corte, não um efeito. */
            if (raised.orbitCalm && breathing.length) {
              const intensity = Math.min(1, Math.hypot(driftX, driftY));
              const target = 1 - intensity * 0.55;
              calm += (target - calm) * 0.08;
              for (const tween of breathing) tween.timeScale(calm);
            }
          };

          /* Vai e volta entre -amplitude e +amplitude, e começa no meio do
             caminho — no zero, no centro do repouso —, então nada dá salto na
             hora de ligar. Períodos distintos por eixo: o movimento não
             repete um padrão que o olho reconheça. */
          const swing = (el: HTMLElement, prop: "rotation" | "x" | "y", amp: number, period: number) => {
            const tween = gsap.fromTo(
              el,
              { [prop]: -amp },
              { [prop]: amp, duration: period / 2, ease: "sine.inOut", yoyo: true, repeat: -1 },
            );
            tween.progress(0.5);
            breathing.push(tween);
          };

          const startBreathing = (set: (typeof PLATES)[number]) => {
            for (const s of set.idle) {
              gsap.set(s.el, { transformOrigin: s.origin, rotation: 0, x: 0, y: 0 });
              swing(s.el, "rotation", Math.abs(s.rot), s.spin);
              swing(s.el, "x", Math.abs(s.x), s.driftX);
              swing(s.el, "y", Math.abs(s.y), s.driftY);
            }
          };

          const stopBreathing = () => {
            for (const tween of breathing) tween.kill();
            breathing = [];
          };

          const raisePlates = (index: number) => {
            const next = PLATES[index];
            if (!next || raised === next) return;
            /* Uma parada por vez: o par anterior sempre desce antes. */
            if (raised) dropPlates();
            raised = next;
            restingSince = 0;
            aimX = 0;
            aimY = 0;
            driftX = 0;
            driftY = 0;
            calm = 1;
            chase = 0.07;
            const layers = layersOf(next);
            gsap.set([next.plate, ...layers], { autoAlpha: 1 });
            gsap.set(layers, { xPercent: 0, yPercent: 0, scale: 1 });
            gsap.to(layers, { scale: next.lift, duration: 1.2, ease: "power2.out", overwrite: true });
            startBreathing(next);
          };

          /* O recuo: tudo volta ao repouso — escala 1, sem deslocamento, sem
             giro — antes de o vídeo andar. Quem sai daqui está idêntico ao
             quadro que o vídeo mostra, então a troca não tem salto. */
          const restPlates = () => {
            if (!raised) return;
            if (!restingSince) restingSince = performance.now();
            aimX = 0;
            aimY = 0;
            chase = 0.3;
            stopBreathing();
            gsap.to(layersOf(raised), { scale: 1, duration: RECOIL, ease: "power2.inOut", overwrite: true });
            gsap.to(swingsOf(raised), {
              rotation: 0,
              x: 0,
              y: 0,
              duration: RECOIL,
              ease: "power2.inOut",
              overwrite: true,
            });
          };

          const dropPlates = () => {
            if (!raised) return;
            stopBreathing();
            const layers = layersOf(raised);
            gsap.set([raised.plate, ...layers], { autoAlpha: 0 });
            gsap.set(layers, { xPercent: 0, yPercent: 0, scale: 1 });
            gsap.set(swingsOf(raised), { rotation: 0, x: 0, y: 0 });
            raised = null;
            restingSince = 0;
          };

          const onPointerMove = (event: PointerEvent) => {
            if (!raised) return;
            aimX = (event.clientX / window.innerWidth) * 2 - 1;
            aimY = (event.clientY / window.innerHeight) * 2 - 1;
          };

          const showProduct = (immediate = false) => {
            gsap.set(firstReveal, { autoAlpha: 1 });
            gsap.set(title, { autoAlpha: 1, y: 0 });
            gsap.fromTo(
              "[data-video-hero-title-part]",
              { opacity: 0, y: 26 },
              {
                opacity: 1,
                y: 0,
                duration: immediate ? 0 : 0.7,
                stagger: immediate ? 0 : 0.1,
                ease: "power3.out",
              },
            );
            /* O contêiner só acende: quem anima são os cartões, um a um. Se o
               contêiner também subisse, o movimento dele somaria ao de cada
               cartão e o stagger perderia a leitura. */
            gsap.set(firstContent, { autoAlpha: 1, y: 0 });

            /* Cada cartão sobe da base e cresce, na ordem de leitura: o texto
               à esquerda primeiro, depois os quatro números. A opacidade e o
               deslocamento chegam com uma curva limpa; a escala ganha uma
               sobra curta no fim, que é o que dá corpo ao "pop" sem virar
               mola. Nascem depois do título, para a cena se montar de cima
               para baixo. */
            const cards = "[data-video-hero-card]";
            gsap.set(cards, { transformOrigin: "50% 100%" });
            const lead = immediate ? 0 : 0.32;
            const step = immediate ? 0 : 0.085;
            gsap.fromTo(
              cards,
              { opacity: 0, y: 36 },
              { opacity: 1, y: 0, duration: immediate ? 0 : 0.62, delay: lead, stagger: step, ease: "power3.out" },
            );
            gsap.fromTo(
              cards,
              { scale: 0.82 },
              { scale: 1, duration: immediate ? 0 : 0.78, delay: lead, stagger: step, ease: "back.out(1.5)" },
            );
          };

          const showMolecule = () => {
            html.dataset.navTheme = "dark";
            /* Só a visibilidade da camada é daqui — quem move é cada filho:
               o texto sobe atrás de uma cortina, os cartões entram em linha.
               Se o contêiner também deslizasse, o movimento dele somaria ao
               de cada filho e a leitura de "cortina" se perderia. */
            gsap.fromTo(moleculeContent, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });

            /* O texto entra como se uma cortina subisse: cada linha nasce
               escondida por baixo do próprio contêiner (`overflow: hidden`
               no JSX) e sobe para o lugar. Sem blur — só posição —, e cada
               uma tem seu recorte, então a seguinte não aparece por cima da
               anterior enquanto ainda sobe. */
            gsap.fromTo(
              "[data-video-hero-molecule-line]",
              { yPercent: 112 },
              { yPercent: 0, duration: 0.72, stagger: 0.1, ease: "power4.out" },
            );

            /* Os cartões entram na ordem da rota, de cima para baixo, e o
               fio que liga um ao outro cresce junto — a sequência se monta,
               não aparece pronta. */
            gsap.set("[data-video-hero-step]", { transformOrigin: "0% 50%" });
            gsap.fromTo(
              "[data-video-hero-step]",
              { opacity: 0, x: 26, scale: 0.94 },
              {
                opacity: 1,
                x: 0,
                scale: 1,
                duration: 0.56,
                delay: 0.16,
                stagger: 0.09,
                ease: "power3.out",
              },
            );
            gsap.fromTo(
              "[data-video-hero-step-link]",
              { scaleY: 0 },
              { scaleY: 1, duration: 0.3, delay: 0.3, stagger: 0.09, ease: "power2.out" },
            );
          };

          const releasePage = () => {
            const next = document.querySelector<HTMLElement>("#nitrogen-process");
            if (!next) return;

            gsap.to(blackout, { opacity: 1, duration: 0.34, ease: "power2.inOut" });
            delete html.dataset.heroOver;
            html.dataset.navTheme = "dark";

            const top = window.scrollY + next.getBoundingClientRect().top;
            const lenis = scroller();
            lenis?.start();
            if (lenis) {
              lenis.scrollTo(top, { duration: 0.8, force: true });
            } else {
              window.scrollTo({ top, behavior: "smooth" });
            }
          };

          /* A ida e a volta são dois arquivos, e todo passo troca um pelo
             outro. Pedir o tempo novo e trocar na mesma linha deixa aparecer,
             por um instante, o quadro onde o outro vídeo tinha parado — outro
             trecho da cena, congelado. A busca leva alguns milissegundos, e é
             nessa fresta que a tela ficava parada, sem nada.

             Então quem sai fica no ar até quem entra estar no quadro certo.
             Nesse ponto os dois mostram exatamente a mesma imagem e a troca
             não tem o que revelar. O `seeked` é quem avisa; o prazo curto é a
             rede, para quando o tempo pedido já era o atual e o evento nunca
             vem. */
          let swapCall: gsap.core.Tween | null = null;
          let swapDone: (() => void) | null = null;

          const cancelSwap = () => {
            swapCall?.kill();
            swapCall = null;
            if (swapDone) {
              video.removeEventListener("seeked", swapDone);
              reverseVideo.removeEventListener("seeked", swapDone);
              swapDone = null;
            }
          };

          const swapTo = (next: HTMLVideoElement, previous: HTMLVideoElement, time: number) => {
            cancelSwap();
            const reveal = () => {
              cancelSwap();
              gsap.set(next, { autoAlpha: 1 });
              gsap.set(previous, { autoAlpha: 0 });
            };
            const standing = Math.abs(next.currentTime - time) < 0.02;
            next.currentTime = time;
            if (standing) {
              reveal();
              return;
            }
            swapDone = reveal;
            next.addEventListener("seeked", reveal, { once: true });
            swapCall = gsap.delayedCall(0.25, reveal);
          };

          const settle = (index: number) => {
            run += 1;
            playing = false;
            settledIndex = index;
            destinationIndex = index;
            cancelAnimationFrame(frame);
            const time = stops[index];
            video.pause();
            reverseVideo.pause();

            direction = 1;
            swapTo(video, reverseVideo, time);
            /* O reverso fica alinhado com a parada: o próximo passo para trás
               parte daqui sem ter de buscar nada. */
            reverseVideo.currentTime = toReverse(time);

            /* Quem não é desta parada sai por completo. A saída anterior foi
               interrompida no meio para o texto poder entrar limpo, e sem
               este corte a camada da outra cena ficaria pendurada em meia
               opacidade por cima desta — a tela parada, sem informação. */
            stopCopy();
            if (index === 0) {
              gsap.set(moleculeContent, { autoAlpha: 0, y: 0 });
              raisePlates(0);
              showProduct();
            } else if (index === 1) {
              gsap.set([firstReveal, firstContent, title], { autoAlpha: 0, y: 0 });
              raisePlates(1);
              showMolecule();
            } else {
              gsap.set([firstReveal, firstContent, title, moleculeContent], { autoAlpha: 0, y: 0 });
              releasePage();
            }
          };

          const monitor = (token: number) => {
            if (disposed || !playing || token !== run) return;
            const time = forwardTime();
            const target = stops[destinationIndex];
            const source = direction === 1 ? video : reverseVideo;

            if ((direction === 1 && time >= target) || (direction === -1 && time <= target)) {
              settle(destinationIndex);
              return;
            }
            /* O arquivo acabou antes do alvo — quadro perdido, alvo no limite
               da duração. Parar aqui é melhor do que girar num vídeo que não
               anda mais e deixar a cena presa sem texto. */
            if (source.ended) {
              settle(destinationIndex);
              return;
            }
            frame = requestAnimationFrame(() => monitor(token));
          };

          const playTo = (index: number, nextDirection: 1 | -1) => {
            if (disposed || index < 0 || index >= stops.length) return;
            cancelAnimationFrame(frame);
            recoil?.kill();
            cancelSwap();
            hideCopy();
            gsap.set(blackout, { opacity: 0 });
            scroller()?.stop();

            /* O quadro de onde partimos, lido com a direção que ainda vale e
               com os dois vídeos já parados. Depois de virar `direction` a
               leitura passaria para o outro vídeo, parado num tempo velho —
               zero, enquanto ele nunca andou, que no reverso é o fim da cena.
               Era daí que vinha o salto para o final. O recuo das chapas pode
               atrasar o arranque em 220ms, e o valor continua bom: nada anda
               nesse meio-tempo. */
            const from = forwardTime();
            video.pause();
            reverseVideo.pause();

            const token = (run += 1);
            destinationIndex = index;
            direction = nextDirection;
            playing = true;

            const begin = () => {
              if (disposed || token !== run) return;

              /* Uma play() abortada por um gesto mais novo só rejeita depois,
                 e com a senha vencida não tem mais efeito — era ela que
                 parava a cena à força no meio de uma navegação em curso. */
              const fail = () => {
                if (!disposed && token === run) settle(index);
              };
              const tick = () => monitor(token);

              if (nextDirection === 1) {
                swapTo(video, reverseVideo, from);
                void video.play().then(tick).catch(fail);
              } else {
                swapTo(reverseVideo, video, toReverse(from));
                void reverseVideo.play().then(tick).catch(fail);
              }
            };

            /* Com as chapas no ar o vídeo espera o recuo. São 220ms, o mesmo
               tempo em que o texto sai, e o gesto ganha um recolher antes de
               partir — o vídeo não pode andar embaixo de um quadro parado que
               ainda cobre a tela, senão a troca corta um pedaço da cena. */
            if (!raised) {
              begin();
              return;
            }

            /* Se o recuo já estava em curso — o gesto anterior o começou e
               este virou a direção no meio —, o que falta dele é o que se
               espera. Recomeçar os 220ms inteiros a cada gesto é o que dava a
               sensação de controle pesado. */
            const wait = restingSince
              ? Math.max(0, RECOIL - (performance.now() - restingSince) / 1000)
              : RECOIL;
            restPlates();
            recoil = gsap.delayedCall(wait, () => {
              dropPlates();
              begin();
            });
          };

          const navigate = (nextDirection: 1 | -1) => {
            const now = performance.now();
            if (now - lastGesture < 180 && (!playing || direction === nextDirection)) return;
            lastGesture = now;

            if (playing) {
              if (direction === nextDirection) return;
              playTo(destinationIndex + nextDirection, nextDirection);
              return;
            }

            const next = settledIndex + nextDirection;
            if (next >= 0 && next < stops.length) playTo(next, nextDirection);
          };

          const onWheel = (event: WheelEvent) => {
            if (settledIndex === 2) return;
            event.preventDefault();
            if (Math.abs(event.deltaY) > 8) navigate(event.deltaY > 0 ? 1 : -1);
          };

          const onTouchStart = (event: TouchEvent) => {
            touchY = event.touches[0]?.clientY ?? 0;
          };

          const onTouchMove = (event: TouchEvent) => {
            if (settledIndex === 2) return;
            event.preventDefault();
            const y = event.touches[0]?.clientY ?? touchY;
            const delta = touchY - y;
            if (Math.abs(delta) > 28) {
              navigate(delta > 0 ? 1 : -1);
              touchY = y;
            }
          };

          const onKeyDown = (event: KeyboardEvent) => {
            if (settledIndex === 2) return;
            if (["ArrowDown", "PageDown", " "].includes(event.key)) {
              event.preventDefault();
              navigate(1);
            } else if (["ArrowUp", "PageUp"].includes(event.key)) {
              event.preventDefault();
              navigate(-1);
            }
          };

          /* Voltando da seção seguinte: assim que o hero reaparece no topo, a
             página é ancorada em 0 e o vídeo retrocede para o quadro da
             molécula, em vez de deixar o fecho preto parado na tela. */
          let lastScrollY = window.scrollY;
          const onScroll = () => {
            const y = window.scrollY;
            const goingUp = y < lastScrollY;
            lastScrollY = y;
            if (settledIndex !== 2 || playing || !goingUp) return;
            if (y >= scene.offsetHeight - 2) return;

            const lenis = scroller();
            if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
            else window.scrollTo(0, 0);
            lastScrollY = 0;
            html.dataset.heroOver = "on";
            html.dataset.navTheme = "dark";
            /* Sai do estado "liberado" para que roda/teclas voltem a ser do hero. */
            settledIndex = 1;
            playTo(1, -1);
          };

          const startIntro = () => {
            scroller()?.stop();
            html.dataset.heroOver = "on";
            video.currentTime = 0;
            video.playbackRate = 1;
            destinationIndex = 0;
            direction = 1;
            playing = true;
            const token = (run += 1);
            void video
              .play()
              .then(() => monitor(token))
              .catch(() => {
                if (!disposed && token === run) settle(0);
              });
          };

          gsap.set([firstReveal, firstContent, moleculeContent, title, reverseVideo], { autoAlpha: 0 });
          gsap.set([video, windowElement], { autoAlpha: 1 });
          window.addEventListener("wheel", onWheel, { passive: false, capture: true });
          window.addEventListener("touchstart", onTouchStart, { passive: true });
          window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
          window.addEventListener("keydown", onKeyDown, { capture: true });
          window.addEventListener("scroll", onScroll, { passive: true });
          /* Só onde há ponteiro de verdade: no toque o dedo já é a navegação,
             e não existe posição de repouso para ler. */
          const fine = window.matchMedia("(pointer: fine)").matches;
          if (fine) {
            window.addEventListener("pointermove", onPointerMove, { passive: true });
            gsap.ticker.add(drift);
          }
          void booted.then(() => {
            if (video.readyState >= 2 && reverseVideo.readyState >= 1) startIntro();
            else video.addEventListener("canplay", startIntro, { once: true });
          });

          return () => {
            disposed = true;
            run += 1;
            cancelAnimationFrame(frame);
            recoil?.kill();
            cancelSwap();
            stopBreathing();
            gsap.ticker.remove(drift);
            window.removeEventListener("pointermove", onPointerMove);
            video.pause();
            reverseVideo.pause();
            video.removeEventListener("canplay", startIntro);
            window.removeEventListener("wheel", onWheel, { capture: true });
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove, { capture: true });
            window.removeEventListener("keydown", onKeyDown, { capture: true });
            window.removeEventListener("scroll", onScroll);
            scroller()?.start();
            delete html.dataset.heroOver;
            delete html.dataset.navTheme;
          };
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="aminosan-hero" aria-label={hero.heading}>
      <div className="aminosan-hero-window">
        <video
          ref={videoRef}
          className="aminosan-hero-video"
          preload="auto"
          muted
          playsInline
          aria-hidden="true"
        />
        <video
          ref={reverseVideoRef}
          className="aminosan-hero-video invisible opacity-0"
          preload="auto"
          muted
          playsInline
          aria-hidden="true"
        />

        <Image
          data-video-hero="plate-product"
          src="/img/aminosan/hero-product-plate.webp"
          alt=""
          fill
          sizes="100vw"
          aria-hidden
          className="aminosan-hero-plate aminosan-hero-cut--wide invisible opacity-0"
        />
        <Image
          data-video-hero="plate-product-tall"
          src="/img/aminosan/hero-product-plate-mobile.webp"
          alt=""
          fill
          sizes="100vw"
          aria-hidden
          className="aminosan-hero-plate aminosan-hero-cut--tall invisible opacity-0"
        />
        {/* O título mora entre a chapa e o recorte: fica atrás do galão, que o
            recorta por cima, e à frente do campo. */}
        <div
          data-video-hero="title"
          className="aminosan-hero-title invisible opacity-0"
        >
          <p
            data-video-hero-title-part
            className="font-display text-[clamp(9px,0.8vw,12px)] font-bold tracking-[0.25em] text-[#1F4FB8] uppercase"
          >
            {hero.eyebrow}
          </p>
          <h1
            data-video-hero-title-part
            className="mt-2 font-display text-[clamp(64px,14.5vw,270px)] font-semibold leading-[0.86] tracking-[0.02em] uppercase aminosan-hero-title-fade"
          >
            {hero.heading}
          </h1>
        </div>
        <Image
          data-video-hero="cutout-product"
          src="/img/aminosan/hero-product-cutout.webp"
          alt=""
          fill
          sizes="100vw"
          aria-hidden
          className="aminosan-hero-cutout aminosan-hero-cut--wide invisible opacity-0"
        />
        <Image
          data-video-hero="cutout-product-tall"
          src="/img/aminosan/hero-product-cutout-mobile.webp"
          alt=""
          fill
          sizes="100vw"
          aria-hidden
          className="aminosan-hero-cutout aminosan-hero-cut--tall invisible opacity-0"
        />
        {/* As folhas do primeiro plano, soltas do recorte para ganhar
            animação própria. Ficam acima do galão e abaixo da vinheta. */}
        {/* Dois elementos por folha, e a divisão é proposital: o de fora leva a
            escala e o parallax, sempre em torno do centro da tela, como o
            recorte — é o que a mantém casada com ele. O de dentro leva o
            balanço, girando em torno da base da folha; se os dois fossem o
            mesmo elemento, a origem do giro deslocaria a escala. */}
        <div
          data-video-hero="leaf-left"
          aria-hidden
          className="aminosan-hero-leaf aminosan-hero-cut--wide invisible opacity-0"
        >
          <Image
            data-video-hero="leaf-left-swing"
            src="/img/aminosan/hero-leaf-left.webp"
            alt=""
            fill
            sizes="100vw"
            className="aminosan-hero-leaf-img"
          />
        </div>
        <div
          data-video-hero="leaf-right"
          aria-hidden
          className="aminosan-hero-leaf aminosan-hero-cut--wide invisible opacity-0"
        >
          <Image
            data-video-hero="leaf-right-swing"
            src="/img/aminosan/hero-leaf-right.webp"
            alt=""
            fill
            sizes="100vw"
            className="aminosan-hero-leaf-img"
          />
        </div>
        {/* As mesmas duas folhas, recortadas do corte 9:16. Aqui elas nascem
            de um plano inteiro fora de foco — a lavoura da frente, que a
            lente já separa do resto sozinha —, e o que as divide em duas é o
            caminho de terra que afina no meio do rodapé. */}
        <div
          data-video-hero="leaf-left-tall"
          aria-hidden
          className="aminosan-hero-leaf aminosan-hero-cut--tall invisible opacity-0"
        >
          <Image
            data-video-hero="leaf-left-swing-tall"
            src="/img/aminosan/hero-leaf-left-mobile.webp"
            alt=""
            fill
            sizes="100vw"
            className="aminosan-hero-leaf-img"
          />
        </div>
        <div
          data-video-hero="leaf-right-tall"
          aria-hidden
          className="aminosan-hero-leaf aminosan-hero-cut--tall invisible opacity-0"
        >
          <Image
            data-video-hero="leaf-right-swing-tall"
            src="/img/aminosan/hero-leaf-right-mobile.webp"
            alt=""
            fill
            sizes="100vw"
            className="aminosan-hero-leaf-img"
          />
        </div>
        <Image
          data-video-hero="plate-molecule"
          src="/img/aminosan/hero-molecule-plate.webp"
          alt=""
          fill
          sizes="100vw"
          aria-hidden
          className="aminosan-hero-plate aminosan-hero-cut--wide invisible opacity-0"
        />
        <Image
          data-video-hero="plate-molecule-tall"
          src="/img/aminosan/hero-molecule-plate-mobile.webp"
          alt=""
          fill
          sizes="100vw"
          aria-hidden
          className="aminosan-hero-plate aminosan-hero-cut--tall invisible opacity-0"
        />
        {/* Mesma divisão em duas camadas das folhas: a de fora leva a escala
            e o parallax do ponteiro, a de dentro leva a órbita — um giro e
            um vai e vem contínuos, próprios da molécula, sem depender de
            ninguém tocar a tela. Juntos os dois dão um objeto que paira. */}
        <div
          data-video-hero="cutout-molecule"
          aria-hidden
          className="aminosan-hero-cutout aminosan-hero-cut--wide invisible opacity-0"
        >
          <Image
            data-video-hero="molecule-orbit"
            src="/img/aminosan/hero-molecule-cutout.webp"
            alt=""
            fill
            sizes="100vw"
            className="aminosan-hero-molecule-orbit"
          />
        </div>
        <div
          data-video-hero="cutout-molecule-tall"
          aria-hidden
          className="aminosan-hero-cutout aminosan-hero-cut--tall invisible opacity-0"
        >
          <Image
            data-video-hero="molecule-orbit-tall"
            src="/img/aminosan/hero-molecule-cutout-mobile.webp"
            alt=""
            fill
            sizes="100vw"
            className="aminosan-hero-molecule-orbit"
          />
        </div>

        <span className="aminosan-hero-vignette" aria-hidden />

        <div
          data-video-hero="first-reveal"
          className="aminosan-video-hero-layer invisible opacity-0"
        >
          <div data-video-hero="first-content" className="size-full">
            {/* Uma coluna no celular — os números em cima, o cartão embaixo —, e
                a mesma faixa de três colunas no desktop. É a ordem visual que
                muda com a largura, não a ordem do DOM: quem entra primeiro na
                cena continua sendo o cartão de texto, e é dele que o stagger
                parte. */}
            <div className="aminosan-hero-first-col wrap flex h-full flex-col px-gut pb-[clamp(32px,5vh,64px)] pt-[clamp(92px,13vh,140px)] lg:grid lg:grid-cols-[minmax(280px,410px)_1fr_minmax(250px,330px)] lg:content-end lg:items-end lg:gap-5">
              <article
                data-video-hero-card
                className="aminosan-video-glass aminosan-hero-first-card rounded-2xl p-[clamp(18px,1.6vw,28px)] max-lg:order-last max-lg:mt-auto lg:col-start-1"
              >
                <p className="font-display text-[clamp(17px,1.45vw,23px)] font-semibold leading-[1.17] text-white">
                  {hero.card.title}
                </p>
                <p className="mt-3 text-[clamp(12px,0.9vw,14px)] leading-[1.5] text-white/72">
                  {hero.card.body}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {hero.card.ctas.map((cta) => (
                    <a
                      key={cta.label}
                      href={cta.href}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-lime px-3.5 py-2.5 text-[12px] font-bold text-[#102017] transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      {cta.label}
                      <Image src="/img/aminosan/icon-cta-arrow.svg" alt="" width={9} height={9} />
                    </a>
                  ))}
                </div>
              </article>

              <div
                className="aminosan-hero-first-stats grid auto-rows-fr grid-cols-2 gap-2 max-lg:order-first max-lg:gap-1 lg:col-start-3"
              >
                {hero.stats.map((stat) => {
                  const Icon = STAT_ICON[stat.icon];
                  return (
                    <div
                      key={stat.label}
                      data-video-hero-card
                      className="aminosan-video-glass flex rounded-xl max-lg:items-start max-lg:gap-1.5 max-lg:rounded-lg max-lg:p-[clamp(5px,1.5vw,7px)] lg:flex-col lg:p-3.5"
                    >
                      <span
                        aria-hidden
                        className="grid shrink-0 place-items-center border border-lime/35 bg-lime/15 text-lime max-lg:size-[clamp(16px,4.4vw,19px)] max-lg:rounded-md lg:mb-3 lg:size-9 lg:rounded-lg"
                      >
                        <Icon
                          className="max-lg:size-[clamp(9px,2.5vw,11px)] lg:size-[18px]"
                          strokeWidth={1.75}
                        />
                      </span>
                      {/* No desktop este invólucro some da caixa (`contents`)
                          e os dois parágrafos voltam a ser filhos diretos da
                          coluna — é o que mantém o rótulo colado na base pelo
                          `mt-auto`. No celular ele existe, e é o que deixa o
                          texto ao lado do ícone em vez de embaixo dele. */}
                      <div className="flex min-w-0 flex-col lg:contents">
                        <p className="font-display font-semibold text-balance text-white max-lg:text-[clamp(8.5px,2.3vw,10.5px)] max-lg:leading-[1.15] lg:text-[14px] lg:leading-tight">
                          {stat.value}
                        </p>
                        <p className="text-white/60 max-lg:text-[clamp(6.5px,1.8vw,8px)] max-lg:leading-[1.15] lg:mt-auto lg:pt-1.5 lg:text-[10px] lg:leading-tight">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div
          data-video-hero="molecule-content"
          className="aminosan-video-hero-layer invisible opacity-0"
        >
          {/* Texto à esquerda, rota à direita, e no meio uma coluna vazia: é
              por ela que a molécula aparece. As três linhas antigas cruzavam o
              quadro inteiro e passavam por cima dela. */}
          <div className="aminosan-hero-molecule-wrap flex h-full flex-col justify-between gap-[clamp(20px,3vh,36px)] px-gut pt-[clamp(88px,13vh,132px)] pb-[clamp(26px,5vh,58px)] max-lg:justify-start lg:grid lg:items-center lg:gap-[clamp(16px,2vw,48px)] lg:py-16 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)_minmax(0,360px)]">
            {/* Cada linha mora dentro de uma máscara (`overflow-hidden`) do
                tamanho exato do seu próprio conteúdo — não uma altura fixa —,
                e é só o filho que se move. Escondido 112% abaixo, ele sobe
                para dentro da máscara como se uma cortina se abrisse por
                baixo do texto; a máscara nunca revela o que ainda não subiu. */}
            <div className="aminosan-hero-molecule-copy max-w-[520px]">
              <div className="aminosan-hero-molecule-intro">
                <div className="overflow-hidden">
                  <p
                    data-video-hero-molecule-line
                    className="font-display text-[10px] font-bold tracking-[0.25em] text-lime uppercase"
                  >
                    Aminosan® · Free amino acids
                  </p>
                </div>
                <div className="mt-3 overflow-hidden lg:mt-4">
                  <h2
                    data-video-hero-molecule-line
                    className="text-h2 leading-[1.02] text-white max-lg:text-[clamp(24px,6.5vw,29px)]"
                  >
                    {nitrogen.heading}
                  </h2>
                </div>
                <div className="mt-3 overflow-hidden lg:mt-6">
                  <p
                    data-video-hero-molecule-line
                    className="text-[clamp(12px,3.4vw,14px)] leading-[1.5] text-white/72 lg:text-[clamp(14px,1vw,17px)] lg:leading-[1.65]"
                  >
                    {nitrogen.body[0]}
                  </p>
                </div>
              </div>
              <div className="aminosan-hero-molecule-callout mt-4 overflow-hidden max-lg:!mt-auto lg:mt-4">
                <p
                  data-video-hero-molecule-line
                  className="text-[clamp(12px,3.4vw,14px)] font-bold leading-[1.45] text-white lg:text-[clamp(14px,1vw,17px)] lg:leading-[1.6]"
                >
                  {nitrogen.body[1]}
                </p>
              </div>
            </div>

            <div aria-hidden className="hidden lg:block" />

            <div className="flex flex-col max-lg:grid max-lg:grid-cols-3 max-lg:gap-2">
              {nitrogen.steps.map((label, index) => (
                <Fragment key={label}>
                  {index > 0 && <span data-video-hero-step-link aria-hidden className="aminosan-step-link" />}
                  <StepCard index={index} label={label} />
                </Fragment>
              ))}
            </div>
          </div>
        </div>

        <span
          data-video-hero="blackout"
          className="pointer-events-none absolute inset-0 z-[60] bg-[#0C0C0E] opacity-0"
          aria-hidden
        />
      </div>
    </section>
  );
}
