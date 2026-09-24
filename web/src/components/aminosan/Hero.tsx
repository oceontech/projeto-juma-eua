"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import { Building2, FlaskConical, Hourglass, Sprout, type LucideIcon } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { whenBooted } from "@/lib/boot";
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
    /** Os três quadros narrativos, em segundos — e no MEIO do quadro, nunca
        na borda dele. Cada still é um quadro exato do arquivo (o 39, o 182 e o
        260, a 30fps: 1/30 de segundo cada um), e o monitor que persegue a
        parada erra até meia volta de tela para cada lado. Mirando a borda,
        esse erro cai no quadro vizinho e a troca dá o salto que se via;
        mirando o centro sobram 16ms de folga dos dois lados.

        O quadro 39 é o "1:09" do relógio de montagem — um segundo e nove
        quadros, que em segundos dá 1,300 e não 1,09. Ajuste aqui quando a
        edição mudar, sempre pelo centro: (quadro + 0,5) / 30. */
    stops: [1.3167, 6.0833, 8.6833],
    /** Só vale até o arquivo declarar a sua: é a rede que atrasa, não o corte. */
    length: 8.733,
  },
  tall: {
    forward: "/videos/video-hero-aminosan-mobile-scrub.mp4",
    back: "/videos/video-hero-aminosan-mobile-reverse.mp4",
    /* Mesma regra: 34,5 e 178,5 já caíam no meio dos quadros 34 e 178; 7,1
       caía exatamente na emenda entre o 212 e o 213. */
    stops: [1.15, 5.95, 7.1167],
    length: 7.166,
  },
} as const;

/** Marcha dos trechos entre uma parada e outra, na ida e na volta. Ali o
    corte está preso a um gesto: quem rola espera a próxima parada, não um
    plano. A abertura fica de fora — ela não responde a gesto nenhum, é a
    cena se apresentando, e corre no tempo em que foi montada. O `monitor`
    para onde deve em qualquer marcha, porque o alvo é o tempo do vídeo e
    não o relógio. */
const SPEED = 1.35;

/** Quanto o texto leva para sair de cena. O vídeo só parte depois: em
    movimento por baixo do título ainda no ar, a troca lê como defeito. */
const EXIT = 0.22;

/** O fecho. O corte acaba em branco chapado, e é por esse branco que a
    seção seguinte aparece: a janela esmaece por cima dela em vez de
    apagar para preto e rolar até lá. */
const CLOSE = 0.8;

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
      const windowElement = scene.querySelector<HTMLElement>(".aminosan-hero-window");
      const title = scene.querySelector<HTMLElement>("[data-video-hero='title']");
      if (!firstReveal || !firstContent || !moleculeContent || !windowElement) return;
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

          /* As folhas da frente só existem soltas no retrato. Na paisagem o
             still da primeira parada é uma imagem só — elas já vêm dentro
             dela —, e repetir a camada por cima deixaria duas folhas no mesmo
             lugar: a de baixo parada, a de cima respirando. */
          type Swing = {
            el: HTMLElement;
            origin: string;
            rot: number;
            x: number;
            y: number;
            spin: number;
            driftX: number;
            driftY: number;
          };
          const leafLayers: HTMLElement[] = [];
          const leafSwings: Swing[] = [];
          if (tall) {
            const leafLeft = layer("leaf-left");
            const leafRight = layer("leaf-right");
            const swingLeft = layer("leaf-left-swing");
            const swingRight = layer("leaf-right-swing");
            if (!leafLeft || !leafRight || !swingLeft || !swingRight) return;
            leafLayers.push(leafLeft, leafRight);
            leafSwings.push(
              { el: swingLeft, origin: "0% 100%", rot: 1.1, x: 5, y: -6, spin: 4.6, driftX: 6.2, driftY: 5.1 },
              { el: swingRight, origin: "100% 100%", rot: -1.3, x: -5, y: -5, spin: 5.4, driftX: 7.1, driftY: 4.4 },
            );
          }

          if (!animate) {
            const showStill = () => {
              if (video.readyState >= 1) video.currentTime = cut.stops[0];
              /* As chapas são o mesmo quadro, e uma imagem aparece onde um
                 vídeo buscado pode não pintar nada. Paradas, aqui. */
              gsap.set([productPlate, title, productCutout, ...leafLayers, firstReveal], {
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
              duration: EXIT,
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
          /* Cada folha respira sozinha: um giro curto em torno da base, mais
             um vai e vem nos dois eixos, em períodos diferentes para os três
             nunca fecharem o ciclo juntos. */
          const PLATES = [
            {
              plate: productPlate,
              /* Na paisagem esta parada não anda: são duas chapas do mesmo
                 quadro — o campo inteiro e o galão recortado —, e o título
                 mora entre elas. É só para isso que são duas: o galão precisa
                 passar por cima das letras, e o campo por baixo. Sem
                 afastamento de câmera nada tem de deslizar, então não há
                 escala nem folga a reservar. No retrato a montagem antiga
                 continua inteira. */
              lift: tall ? 1.06 : 1,
              layers: tall ? [productCutout, ...leafLayers] : [productCutout],
              idle: leafSwings,
            },
            {
              plate: moleculePlate,
              lift: 1.04,
              layers: [moleculeCutout],
              /* A molécula flutua sozinha — sem base para girar em torno,
                 então o "giro" mora nos dois eixos, em períodos próximos mas
                 não iguais, o que é o que faz o vaivém ler como órbita em vez
                 de balanço linear. */
              idle: [
                { el: moleculeOrbit, origin: "50% 50%", rot: 1.2, x: 9, y: 7, spin: 12, driftX: 9.5, driftY: 8 },
              ],
            },
          ];
          const RECOIL = 0.22;

          let raised: (typeof PLATES)[number] | null = null;
          let recoil: gsap.core.Tween | null = null;
          let restingSince = 0;
          let breathing: gsap.core.Tween[] = [];

          const layersOf = (set: (typeof PLATES)[number]) => set.layers;
          const swingsOf = (set: (typeof PLATES)[number]) => set.idle.map((swing) => swing.el);

          /* Há conjunto que fica parado — o still de duas chapas da paisagem,
             sem afastamento nem folha respirando. Para ele o recuo não existe:
             já está idêntico ao quadro do vídeo, e esperar os 220ms seria
             segurar o gesto por um movimento que não acontece. */
          const stirs = (set: (typeof PLATES)[number]) => set.lift > 1 || set.idle.length > 0;

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
            const layers = layersOf(next);
            gsap.set([next.plate, ...layers], { autoAlpha: 1 });
            gsap.set(layers, { xPercent: 0, yPercent: 0, scale: 1 });
            if (stirs(next)) {
              gsap.to(layers, { scale: next.lift, duration: 1.2, ease: "power2.out", overwrite: true });
            }
            startBreathing(next);
          };

          /* O recuo: tudo volta ao repouso — escala 1, sem deslocamento, sem
             giro — antes de o vídeo andar. Quem sai daqui está idêntico ao
             quadro que o vídeo mostra, então a troca não tem salto. */
          const restPlates = () => {
            if (!raised || !stirs(raised)) return;
            if (!restingSince) restingSince = performance.now();
            stopBreathing();
            gsap.to(layersOf(raised), { scale: 1, duration: RECOIL, ease: "power2.inOut", overwrite: true });
            const swings = swingsOf(raised);
            if (swings.length) {
              gsap.to(swings, {
                rotation: 0,
                x: 0,
                y: 0,
                duration: RECOIL,
                ease: "power2.inOut",
                overwrite: true,
              });
            }
          };

          const dropPlates = () => {
            if (!raised) return;
            stopBreathing();
            const layers = layersOf(raised);
            gsap.set([raised.plate, ...layers], { autoAlpha: 0 });
            gsap.set(layers, { xPercent: 0, yPercent: 0, scale: 1 });
            const swings = swingsOf(raised);
            if (swings.length) gsap.set(swings, { rotation: 0, x: 0, y: 0 });
            raised = null;
            restingSince = 0;
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

          /* O fecho não é mais apagar e rolar até a seção seguinte: o corte
             acaba em branco chapado, a janela esmaece e a seção aparece por
             trás dela, já no lugar.

             A sobreposição dura só o esmaecimento, e é por isso que ela pode
             existir aqui sem nenhum árbitro: a janela vira fixa por um
             instante — cobrindo a tela, como já cobria —, e é debaixo dessa
             cobertura que a página salta para o topo da seção seguinte. O
             salto não se vê. Quando o esmaecimento acaba, a janela volta ao
             fluxo, agora acima da janela de visão, e o documento segue sem
             ninguém empilhado sobre ninguém. */
          const releasePage = () => {
            const next = document.querySelector<HTMLElement>("#nitrogen-process");
            if (!next) return;

            const top = window.scrollY + next.getBoundingClientRect().top;
            gsap.set(windowElement, { position: "fixed", top: 0, left: 0, right: 0, zIndex: 60 });

            const lenis = scroller();
            lenis?.start();
            if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
            if (Math.abs(window.scrollY - top) > 1) window.scrollTo(0, top);
            lastScrollY = window.scrollY;
            delete html.dataset.heroOver;
            /* A seção que se revela é clara, e daqui em diante quem manda na
               barra é a rolagem da página outra vez: sai o tom imposto pelo
               hero e sai a direção imposta por ele. */
            delete html.dataset.navTheme;
            delete html.dataset.navHidden;

            gsap.to(windowElement, {
              autoAlpha: 0,
              duration: CLOSE,
              ease: "power2.inOut",
              onComplete: () => {
                gsap.set(windowElement, { clearProps: "position,top,left,right,zIndex" });
              },
            });
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

            /* Meia volta do monitor. Entre dois quadros de tela o vídeo já
               andou `marcha/60` de segundo, então esperar `passou do alvo`
               sempre para depois do quadro certo: a chapa entrava atrasada e
               a cena dava um passo atrás ao aparecer. Com a margem centrada o
               erro se reparte dos dois lados e a troca cai em cima da parada
               — 1,09s, aqui. */
            const slack = source.playbackRate / 120;

            if (
              (direction === 1 && time >= target - slack) ||
              (direction === -1 && time <= target + slack)
            ) {
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

            /* A barra do topo some indo adiante e volta ao recuar, como faz no
               resto da página — só que aqui a página não rola, então o aviso
               é este. */
            html.dataset.navHidden = nextDirection === 1 ? "on" : "off";

            const begin = () => {
              if (disposed || token !== run) return;

              /* Uma play() abortada por um gesto mais novo só rejeita depois,
                 e com a senha vencida não tem mais efeito — era ela que
                 parava a cena à força no meio de uma navegação em curso. */
              const fail = () => {
                if (!disposed && token === run) settle(index);
              };
              const tick = () => monitor(token);

              /* A marcha vai aqui, e não uma vez na montagem: `load()` devolve
                 a taxa ao padrão do arquivo, e cada troca de corte recarrega os
                 dois vídeos. */
              if (nextDirection === 1) {
                swapTo(video, reverseVideo, from);
                video.playbackRate = SPEED;
                void video.play().then(tick).catch(fail);
              } else {
                swapTo(reverseVideo, video, toReverse(from));
                reverseVideo.playbackRate = SPEED;
                void reverseVideo.play().then(tick).catch(fail);
              }
            };

            /* Tela limpa, nada a esperar: é o caso da abertura, que ainda não
               levantou chapa nenhuma. */
            if (!raised) {
              begin();
              return;
            }

            /* Duas coisas ainda ocupam a tela: o texto, que leva EXIT para
               sair, e as chapas que se mexem, que levam o recuo. O gesto
               espera a mais longa das duas. Uma parada parada não tem recuo
               nenhum — mas tem texto —, e é por isso que a espera nunca é
               zero: vídeo andando por baixo do título ainda visível foi
               exatamente o que apareceu na troca da imagem para o vídeo.

               Do recuo se espera só o que falta dele: se o gesto anterior já
               o começou e este virou a direção no meio, recomeçar os 220ms
               inteiros é o que dava a sensação de controle pesado. */
            const recoilLeft = !stirs(raised)
              ? 0
              : restingSince
                ? Math.max(0, RECOIL - (performance.now() - restingSince) / 1000)
                : RECOIL;
            restPlates();
            recoil = gsap.delayedCall(Math.max(EXIT, recoilLeft), () => {
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

          /* Voltando da seção seguinte: quando o hero reaparece no topo, a
             página é ancorada em 0 e o vídeo retrocede para o quadro da
             molécula, em vez de deixar o fecho preto parado na tela.

             Só que "reaparecer" não pode ser um pixel. Com o limite colado na
             emenda, o quique de um trackpad, o repique de uma rolagem suave ou
             a correção de quem passou do ponto bastavam para engatar a cena
             inteira de volta — quem estava lendo o diagrama era levado embora
             sem ter pedido. Esta é a distância que a rolagem precisa subir,
             para dentro do hero, antes de a volta valer: o bastante para ser
             um gesto e não um tremor. */
          const REENTRY_TRAVEL = 220;

          let lastScrollY = window.scrollY;
          let upTravel = 0;
          let pinFrame = 0;

          /* Ancorar a página no topo é o que devolve a cena inteira: parada no
             meio do caminho, ela toca espremida entre a borda da janela e a
             seção seguinte — a faixa.

             A ordem aqui não é livre. Numa rolagem rápida para cima o dono da
             rolagem já grampeou o destino dele em zero — o topo é o limite da
             página — enquanto a posição animada ainda está lá embaixo. Pedir
             zero nesse estado não faz nada, porque o alvo já é esse, e o que
             vinha logo depois era a parada da rolagem, que congela a página
             onde ela estivesse: era daí que saía a faixa. Parar primeiro
             desfaz o empate — `stop()` realinha o alvo com a posição real —, e
             só então o salto tem para onde ir. O `window.scrollTo` responde
             por quem não tem rolagem suave (o celular), e os quadros seguintes
             absorvem a inércia que o gesto ainda carregava. */
          const pinTop = () => {
            const lenis = scroller();
            lenis?.stop();
            lenis?.scrollTo(0, { immediate: true, force: true });
            if (window.scrollY !== 0) window.scrollTo(0, 0);
            lastScrollY = 0;

            let left = 3;
            cancelAnimationFrame(pinFrame);
            const hold = () => {
              if (disposed || settledIndex === 2) return;
              if (window.scrollY !== 0) {
                window.scrollTo(0, 0);
                lastScrollY = 0;
              }
              if ((left -= 1) > 0) pinFrame = requestAnimationFrame(hold);
            };
            pinFrame = requestAnimationFrame(hold);
          };

          const onScroll = () => {
            const y = window.scrollY;
            const goingUp = y < lastScrollY;
            const climbed = lastScrollY - y;
            lastScrollY = y;
            if (settledIndex !== 2 || playing) return;

            /* Fora do hero, ou descendo, o contador zera: o que conta é uma
               subida contínua, não a soma de idas e vindas. */
            if (!goingUp || y >= scene.offsetHeight - 2) {
              upTravel = 0;
              return;
            }

            /* Dentro do hero a janela volta a ser visível na hora, mesmo antes
               de a volta valer — senão a faixa percorrida até o limite seria o
               fundo vazio da seção. */
            gsap.set(windowElement, { autoAlpha: 1 });

            upTravel += climbed;
            if (upTravel < REENTRY_TRAVEL) return;
            upTravel = 0;

            html.dataset.heroOver = "on";
            html.dataset.navTheme = "dark";
            /* Sai do estado "liberado" para que roda/teclas voltem a ser do hero. */
            settledIndex = 1;
            pinTop();
            playTo(1, -1);
          };

          const startIntro = () => {
            /* A cena só começa com a página no topo: recarregada no meio do
               documento, o navegador devolve a rolagem onde estava e a abertura
               tocaria na mesma faixa. */
            pinTop();
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
          void whenBooted().then(() => {
            if (video.readyState >= 2 && reverseVideo.readyState >= 1) startIntro();
            else video.addEventListener("canplay", startIntro, { once: true });
          });

          return () => {
            disposed = true;
            run += 1;
            cancelAnimationFrame(frame);
            cancelAnimationFrame(pinFrame);
            recoil?.kill();
            cancelSwap();
            stopBreathing();
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
            delete html.dataset.navHidden;
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

        {/* A chapa é o quadro 39 do vídeo, tal e qual: é isso que faz a troca
            do vídeo para a parada não ter emenda. Por isso 90 e não a
            compressão padrão — a 75 a chapa deixa de ser o quadro. O recorte
            ao lado carrega o miúdo do rótulo, que é o primeiro a sumir. */}
        <Image
          data-video-hero="plate-product"
          src="/img/aminosan/hero-product-plate.webp"
          alt=""
          fill
          sizes="100vw"
          quality={90}
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
            className="font-display text-[clamp(9px,0.8vw,12px)] font-semibold tracking-[0.25em] text-ink uppercase"
          >
            {hero.eyebrow}
          </p>
          <h1
            data-video-hero-title-part
            className="mt-2 font-display text-[clamp(64px,14.5vw,270px)] font-normal leading-[0.86] tracking-[-0.04em] text-ink uppercase"
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
          quality={90}
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
            animação própria. Ficam acima do galão e abaixo da vinheta — e só
            existem no corte 9:16: na paisagem elas moram dentro do still da
            primeira parada, que é uma chapa só.

            Dois elementos por folha, e a divisão é proposital: o de fora leva
            a escala e o parallax, sempre em torno do centro da tela, como o
            recorte — é o que a mantém casada com ele. O de dentro leva o
            balanço, girando em torno da base da folha; se os dois fossem o
            mesmo elemento, a origem do giro deslocaria a escala.

            Aqui elas nascem de um plano inteiro fora de foco — a lavoura da
            frente, que a lente já separa do resto sozinha —, e o que as
            divide em duas é o caminho de terra que afina no meio do rodapé. */}
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

      </div>
    </section>
  );
}
