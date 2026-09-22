# web/ — Juma-Agro USA em Next.js

O site de verdade. Next.js 16 (App Router) + TypeScript + Tailwind v4 + GSAP, a stack que
`docs/03-SITE.md` define. A home está implementada a partir dos dois frames do Figma; as duas LPs
são rotas de esqueleto esperando o layout.

Contexto do projeto, regras de conteúdo e pendências: [README da raiz](../README.md) e `../docs/`.

```
npm run dev     # http://localhost:3000
npm run build   # build de produção
npm run lint
```

---

## Como o projeto está organizado

```
src/
├── app/
│   ├── layout.tsx        fontes, metadata, header/footer, os dois providers de motion
│   ├── page.tsx          Home — só monta as seções na ordem
│   ├── globals.css       tokens do design (@theme) + os blocos de geometria própria
│   ├── kmep-ultra/       LP — esqueleto
│   ├── aminosan/         LP — esqueleto
│   ├── robots.ts · sitemap.ts
├── components/
│   ├── layout/           SiteHeader, SiteFooter
│   ├── home/             uma seção por arquivo, na ordem da página
│   ├── motion/           Reveal, ScrollRefresh, SmoothAnchors
│   └── ui/               Pill, Rule, SectionIntro, SmartLink, cx
├── content/home.ts       toda a copy, tipada
└── lib/
    ├── gsap.ts           registro dos plugins e defaults de animação
    └── actions.ts        Server Action do formulário
```

**Server Components por padrão.** Só levam `"use client"` os que precisam de DOM ou estado: o hero
(parallax), o comparador, o leque, o formulário, o header (menu) e os dois providers de motion.
Tudo o mais renderiza no servidor.

---

## Animação — leia antes de animar

### Importe o GSAP de `@/lib/gsap`, nunca de `"gsap"`

```tsx
import { gsap, useGSAP, START } from "@/lib/gsap";
```

Esse módulo registra os plugins uma vez (`ScrollTrigger`, `ScrollToPlugin`) e define os defaults do
projeto — `ease: power3.out`, `duration: 0.7`. Importar `gsap` direto funciona, mas passa por fora
dos defaults e do registro, e é assim que uma animação começa a se comportar diferente das outras
sem ninguém entender por quê.

Em desenvolvimento, `gsap` e `ScrollTrigger` ficam no `window`: dá para chamar
`ScrollTrigger.getAll()` no console do navegador para ver os gatilhos vivos.

### Use `useGSAP`, não `useEffect`

```tsx
const scope = useRef<HTMLDivElement>(null);

useGSAP(() => {
  gsap.fromTo(".card", { opacity: 0 }, { opacity: 1, stagger: 0.1 });
}, { scope });
```

`useGSAP` recolhe tudo que a animação criou — tweens **e** ScrollTriggers — quando o componente
sai. No App Router isso acontece a cada navegação. Com `useEffect` você teria de matar os
ScrollTriggers na mão, e é exatamente aí que animação em React vaza.

O `scope` também faz os seletores de string (`".card"`) valerem só dentro daquele componente.

### `fromTo`, não `from`

`ScrollTrigger.refresh()` roda sempre que a página muda de altura — e nesta home ela cresce uns três
mil pixels enquanto as imagens carregam. No refresh, um `gsap.from` reverte para o estado inicial e
a seção **fica invisível**. Com os dois extremos declarados, não há o que reverter.

### Respeite `prefers-reduced-motion`

O padrão do projeto é `gsap.matchMedia` com dois ramos:

```tsx
const mm = gsap.matchMedia();
mm.add(
  {
    animate: "(prefers-reduced-motion: no-preference)",
    still: "(prefers-reduced-motion: reduce)",
  },
  (context) => {
    const { animate } = context.conditions as { animate: boolean };
    if (!animate) {
      gsap.set(target, { opacity: 1, y: 0 }); // entrega o estado final
      return;
    }
    // …anima
  },
);
```

`matchMedia` também desfaz sozinho se a preferência mudar no meio da sessão.

### Para uma entrada simples, use `<Reveal>`

```tsx
<Reveal as="article" delay={0.1}>…</Reveal>
<Reveal stagger={0.08}>{items.map(…)}</Reveal>   {/* anima os filhos um a um */}
```

Já traz o ScrollTrigger, o `fromTo` e o ramo de reduced-motion. Escreva animação na mão só quando
a entrada padrão não der conta — como no hero (parallax com `scrub`) ou na cortina do bloco
"Two products. One job each.".

### Duas peças de infraestrutura no layout

| Componente | O que resolve |
|---|---|
| `ScrollRefresh` | Recalcula os gatilhos quando fontes e imagens terminam de carregar. Sem ele, tudo é medido no primeiro paint, quando a página ainda não tem a altura final |
| `SmoothAnchors` | Rolagem suave dos links `#âncora`, via ScrollToPlugin |

**Não** ponha `scroll-behavior: smooth` no CSS. A rolagem nativa suave roda por fora do frame do
GSAP e faz o parallax do hero trepidar. Por isso as âncoras passam pelo ScrollToPlugin — e por isso
links de âncora usam `<SmartLink>`, que devolve um `<a>` comum: o `next/link` faz o próprio salto e
atropelaria a animação.

### A cena de partículas da LP B

`/aminosan-b` abre com o hero se desfazendo em pontos, que viram uma planta de soja e depois uma
molécula de aminoácido. É o único lugar do site com WebGL. As peças:

| Arquivo | O que faz |
|---|---|
| `components/aminosan-b/Origin.tsx` | A cena: embrulha o `<Hero>`, trava os dois juntos e liga a linha do tempo aos uniforms |
| `lib/origin/sample.ts` | Pontilhado por amostragem de rejeição, e o `cover` que repete o enquadramento do CSS |
| `lib/origin/shapes.ts` | As duas formas, desenhadas em canvas 2D e amostradas pelo mesmo pontilhador |
| `lib/origin/build.ts` | Monta a nuvem — o mesmo N nos três estados — e desenha o quadro estático do fallback |
| `lib/origin/field.ts` | O renderizador: um `POINTS` em WebGL2, com o GLSL |

Três coisas que não são óbvias:

1. **O hero vive dentro do `Origin`**, passado como `children` em `app/aminosan-b/page.tsx`. A foto
   precisa continuar no lugar enquanto se desmancha, e um pin que começasse abaixo dela já a teria
   empurrado para fora da tela.
2. **Sem three.js, de propósito.** Não há cena, câmera nem luz — só uma nuvem de pontos com shader
   próprio, que é justamente o que a biblioteca não escreveria. Ela custaria uns 150 KB comprimidos
   numa página cujo hero já são cinco imagens grandes.
3. **Sem WebGL2, ou com `prefers-reduced-motion`,** a cena não se prende ao scroll: o hero fica como
   está e as duas formas viram seções empilhadas com o pontilhado desenhado uma vez em canvas 2D.
   Quem acende isso é a classe `.og-still`, e as regras dela ficam **fora de `@layer`** no
   `globals.css` — precisam vencer os utilitários de posição que o JSX carrega.

Em desenvolvimento a cena abre um painel lil-gui (densidade, tamanho, ruído, velocidade, dispersão,
cursor e cores) e deixa os uniforms em `window.origin`. Os dois somem do bundle de produção pela
comparação com `NODE_ENV`. Os controles de `Cena` valem com o scroll parado: assim que ele anda, a
linha do tempo volta a mandar.

### Plugins

Todos os plugins do GSAP são gratuitos desde a 3.13, incluindo SplitText, MorphSVG e Flip. Para
usar um, registre em `src/lib/gsap.ts` — um lugar só.

---

## Estilos

Os tokens do Figma estão em `@theme`, no topo de `globals.css`, e viram utilitários do Tailwind:
`bg-night`, `text-lime`, `text-h2`, `py-sec`. A escala tipográfica é fluida — os extremos de cada
`clamp()` são os tamanhos dos dois frames (1920 e 440).

O que **não** virou utilitário está em `@layer components`, no mesmo arquivo: o palco do hero, o
comparador e o leque de culturas. São geometrias com porcentagens calculadas a partir do Figma;
traduzir isso para classes utilitárias deixaria o JSX ilegível sem ganhar nada.

Um breakpoint estrutural, **860px**, é a divisa entre os dois frames. O header vira hambúrguer antes,
em 1150px, porque a barra inteira não cabe.

### A fonte

O layout usa **Neue Plak**, que é licenciada. O projeto carrega **Archivo**, a grotesk livre mais
próxima em largura e terminais. Quando a licença entrar: troque `Archivo` por `next/font/local` em
`src/app/layout.tsx`, mantendo a variável `--font-archivo`. Nada mais muda.

---

## Formulário

`src/lib/actions.ts` é um Server Action: valida, devolve erro por campo e funciona antes do
JavaScript carregar. **O destino do lead ainda não existe** — há um `TODO(P11)` marcando a linha
onde entra o e-mail, CRM ou webhook. O contrato de retorno não muda quando isso for plugado.

---

## O que ainda falta

- **As duas LPs.** `/kmep-ultra` e `/aminosan` são esqueletos; o layout ainda não saiu do Figma.
  A copy do **KMEP Ultra** está em [`../docs/05-COPY-KMEP-ULTRA.md`](../docs/05-COPY-KMEP-ULTRA.md),
  que é o documento canônico da página. A do **Aminosan** está no protótipo `site/aminosan.html`.
  O protótipo `site/kmep-ultra.html` guarda a versão anterior da copy do KMEP e não vale como
  posicionamento.
- **Destino do formulário** — P11.
- **Geolocalização por IP** reordenando as culturas, e o mapa dos EUA. Estão no escopo da v1 em
  `docs/03-SITE.md`, mas não no layout que chegou.
- **Deploy.** O projeto na Vercel (`juma-agro-eua`) hoje aponta para `site/`. Apontar para `web/`
  é mudar o Root Directory nas configurações do projeto.

### Três coisas na copy que vieram assim do Figma

Implementadas ao pé da letra, para as duas fontes não divergirem — mas parecem erro:

1. **"Co Founder of Metrilo"**, no card do Júlio Matino. Metrilo é uma empresa de analytics; parece
   resíduo de template.
2. **"FREE AMIND ACIDS"**, na categoria do Aminosan — falta o "O" de AMINO.
3. As descrições de **Cotton** e **Corn** no leque estão trocadas: Cotton aparece descrito como
   "a major source of sugar", que é cana. (O rótulo do card Corn vinha como "COFFEE" no Figma; esse
   foi corrigido, porque contradizia o próprio título do card.)
