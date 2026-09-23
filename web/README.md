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
│   ├── kmep/             LP do KMEP Ultra (/kmep)
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

> **Rotas:** a LP dos componentes `aminosan-b/` é hoje a **principal**, em `/aminosan`; a versão
> anterior (`components/aminosan/`) mudou para `/aminosan-b`. A LP C foi removida.
>
> **Hoje a LP B usa `components/aminosan-b/Specimen.tsx`**, a cena no mecanismo da antiga LP C (removida:
> grade de pontos sobre a própria foto, cor lida da textura no vertex shader) com as cores da B: a foto do hero — fundo e folhas compostos num canvas — dá o zoom e
> se fragmenta sozinha, sem a linha de varredura e sem a trama de fundo, e a nuvem passa pelas
> quatro leituras de `lib/scan/specimen.ts`. Para o leigo, a cor tem legenda: verde é o nitrogênio
> (e, na folha, a gota), âmbar é a ligação que ainda precisa ser aberta — é a tag por ponto que o
> `lib/scan/field.ts` aceita (`mark`, `accent`, `accent2`). O zoom anda para o rótulo da bombona
> (`focus`), e em repouso o ponto é quadrado (`square`), porque sobre papel claro o vão entre
> pontos redondos deixa a foto lavada (na B, hoje, `square` é 0 — ver abaixo).
>
> A abertura segue o princípio da primeira versão desta cena (`lib/origin/build.ts`): a foto vira
> um **pontilhado dela mesma** (`lib/scan/stipple.ts` — denso onde é escura, céu vazio, bombona e
> rótulo reforçados, folhas da frente em ponto grande e macio), que aparece por cima do hero
> enquanto ele sai por baixo, escorre para o grafite e só então parte para o aminoácido. Todo ponto
> do pontilhado vira a molécula (80 mil no desktop, 40 mil no celular).
>
> As trocas seguem a construção da primeira versão (`flow`): o par entre uma forma e a seguinte é
> **o índice, portanto sorteado**; as partidas ficam quase juntas (`stagger` 0,15 — com 0,45 os
> primeiros pontos chegavam cedo e a forma aparecia pronta no fundo, com a nuvem ainda no ar); a
> fase anda com `power2.inOut`; e o empurrão (`scatter` 90) vem de ruído de gradiente, em
> correntes, mais um sopro para fora do centro. A nuvem se abre pela tela, viaja inteira e **se
> contrai** na forma seguinte, que só fica nítida quando ela chega. Casar vizinho com vizinho, ou partir em ordem, faz a forma se montar de um
> lado para o outro como uma varredura — já tentado, e pior. Sem a interação com o cursor da
> primeira versão.
>
> A copy de cada etapa troca quando **a forma dela** está quase montada, nos dois sentidos: indo, a
> 62% do morph; voltando, a 38% (`SWITCH`). Uma linha do tempo em scrub não faz isso — corre igual
> para os dois lados, e o texto trocava cedo na ida e tarde na volta. Por isso a copy **não** é tween
> da linha do tempo: `syncCopy()` lê a fase e o sentido do scroll a cada atualização, e a entrada e
> a saída correm no relógio (`enter`/`leave`). O título chega da esquerda, linha a linha, saindo de um desfoque
> (SplitText **sem** máscara, que cortaria o desfoque — por isso o build espera as fontes); o resto
> do bloco vem depois, com o próprio tempo, metade do deslocamento e do desfoque. A saída segue para
> a direita e se desfaz; em scrub, rolando de volta, o gesto corre da direita para a esquerda. As chamadas presas no desenho esperam a
> forma assentar (`CALLS_IN`), porque apontam para peças dela. Na folha, as nervuras laterais são
> traçadas **dentro** da lâmina, com a largura de cada trecho, e param em 78% dela: medidas pela
> largura do começo, perto do bico elas saíam da borda.
>
> A visibilidade da cena tem **duas** fontes guardadas à parte (`inView` e `document.hidden`). Numa
> flag só, esconder a aba a zerava e voltar não a religava — a cena ficava travada. Vale para B e C. A C passa zero em tudo isso e não
> muda. A copy está em
> `specimen`, em `content/aminosan-b.ts`.
>
> O `Origin` descrito a seguir, com `lib/origin/`, saiu da página mas continua no repositório.

`/aminosan` (antiga `/aminosan-b`) abre com a foto do hero se **aproximando** — o zoom do parallax, com ela ainda
inteira —, depois se fragmentando em pontos, que ganham volume e percorrem a cadeia da assimilação
de nitrogênio: planta com raiz, nitrato, amônio, aminoácido, uma etapa por morph. É o único lugar
do site com WebGL. As peças:

| Arquivo | O que faz |
|---|---|
| `components/aminosan-b/Origin.tsx` | A cena: embrulha o `<Hero>`, trava os dois juntos e liga a linha do tempo aos uniforms |
| `lib/origin/sample.ts` | Pontilhado por amostragem de rejeição, e o `cover` que repete o enquadramento do CSS |
| `lib/origin/shapes.ts` | As quatro formas, como **traçado paramétrico** com ordem de construção |
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

**A cena tem `refreshPriority: 1`, e isso não é detalhe.** Ela é a primeira da página mas é criada
por último, porque espera o véu e as fontes. Sem prioridade, o refresh do ScrollTrigger mede as
outras seções antes de existir o espaçador deste pin, e todas elas ficam com a posição de uma página
sete telas mais curta — o vídeo do Meet chega a travar por cima desta cena, ainda no meio dela. Se
algum dia esta cena passar a ser criada na montagem, a prioridade pode sair.

**O orçamento de pontos é repartido por área, peça por peça.** É o que permite a cena rodar com doze
mil partículas. Cada forma é uma lista de superfícies paramétricas — a folha é o vão entre duas
bordas, o caule e a raiz são curvas engrossadas, o átomo é um disco — e cada uma recebe pontos em
proporção à própria área. A primeira versão pintava um quadrado e sorteava pontos pela luminância:
ali o papel em branco também entra no sorteio, e o que é pequeno mas importante (a letra de um
átomo, a ponta de uma raiz) some antes de qualquer outra coisa. Aqui nada desaparece, porque nada
disputa com o vazio.

Pela mesma razão a letra do átomo é **vazada** e funciona: o disco tem cota própria e fica cheio
mesmo com doze mil pontos no total. A máscara da letra é dilatada de propósito — buraco do tamanho
exato do desenho fecha sozinho sob o ponto gordo que a cena usa.

Duas armadilhas de densidade, as duas já resolvidas e fáceis de reintroduzir: o `t` de uma
superfície precisa ser **reparametrizado por área** (a passo constante, o folíolo sai denso na base
e no bico e ralo no meio, que é onde ele tem mais corpo); e `BOOST`, em `shapes.ts`, dá ao caule e à
raiz mais cota do que a área deles pediria — sem isso a folhagem, que é quase toda a tinta, deixa o
resto ralo.

**A cena é plana.** Não há z, rotação nem perspectiva — isso já existiu e saiu. O desenho é o que
ele parece ser, visto de frente.

A foto e a nuvem aproximam pelo mesmo número (`uHeroZoom`, escrito no `transform` do hero a cada
quadro) e pelo mesmo ponto: `fit()` converte o foco em `transform-origin` e no centro da máscara.
Dois tweens paralelos para o mesmo movimento é como as duas descolariam no meio da quebra.

**O compasso tem uma regra:** o morph ocupa 0,20 da cena e a parada entre um e outro fica em 0,03 a
0,06. A travessia é o espetáculo, a parada é só o respiro para ler. O inverso disso — parada longa,
troca curta — é uma cena em que se rola muito esperando e a troca passa num átimo quando enfim vem.
Pelo mesmo motivo a fase anda **linear**: quem suaviza é cada partícula dentro do shader, e uma
curva na linha do tempo concentraria o movimento no meio do trecho.

No desktop a cena é de duas colunas — copy à esquerda, desenho à direita — e quem decide isso é o
media query `TWO_COLUMN` em `Origin.tsx`, que **precisa ser o mesmo número do `lg:` do JSX**. Com os
dois diferentes existe uma faixa de larguras com o desenho já à direita e o texto ainda no pé.

O trilho da rota é **SVG**: a linha se desenha por `stroke-dashoffset` — a linha do tempo escreve a
fração que falta em `--draw` — e cada nó acende no quadro em que o traço passa por ele. Cuidado com
nome de classe aqui: `og-head` é o título da etapa, e a ponta da seta do atalho é `og-arrow`. Dar o
mesmo nome às duas apaga o título, porque a regra de opacidade do SVG cai nele.

Abaixo da copy vai o trilho da rota, que **não troca com os painéis**: ele nasce uma vez e fica,
enchendo continuamente com o scroll enquanto as pastilhas acendem, e no fim ganha a mesma rota pelo
produto, numa seta só. Por isso a coluna de texto tem `min-height` e os quatro textos se empilham no
mesmo lugar — sem isso o trilho subiria e desceria a cada troca. É a comparação "com e sem" da
página, e a única forma segura de dar essa comparação — o que se compara é o trajeto do nitrogênio,
nunca duas plantas. Planta tratada ao lado de testemunha é representação visual de regulador de
crescimento e está proibida no design (`docs/02-MERCADO-USA.md`).

Trocar a densidade recarrega os buffers pelo `field.update()`. **Não refaça o campo:** o `dispose()`
devolve o contexto do canvas com `WEBGL_lose_context`, e um canvas que já devolveu o contexto não dá
outro — o `createField` seguinte compila o shader num contexto morto e falha.

Parte das partículas não fecha no desenho e fica orbitando em volta dele: é o halo, o volume que a
referência tem em torno da imagem. Quem controla é `meta.w` por partícula e o uniform `uHalo`. E
dentro do desenho a deriva cai pela metade de propósito — as letras dos átomos são buracos de poucos
pixels no campo de pontos, e com a amplitude do estado de foto as vizinhas entram no buraco e apagam
a letra.

A linha do tempo é montada dentro de um `await` — depois do véu e das fontes, porque o SplitText
mede linha por linha — e por isso nasce **fora** do contexto do `useGSAP`. Quem a recolhe é a
limpeza do componente, na mão; sem isso o ScrollTrigger dela sobrevive à navegação.

Em desenvolvimento a cena abre um painel lil-gui (densidade, tamanho, dispersão, movimento, halo,
cursor e cores) e deixa os uniforms em `window.originScene`. Os dois somem do bundle de produção pela
comparação com `NODE_ENV`. Os controles de `Cena` valem com o scroll parado: assim que ele anda, a
linha do tempo volta a mandar.

### A virada para o campo (LP B)

Logo depois da cena de partículas, `components/aminosan-b/Field.tsx`. A emenda acontece **dentro**
da cena, num movimento só: no fim da linha do tempo de `Specimen.tsx` o texto, as chamadas e o
trilho saem para a direita, e um círculo preto (`.sp-black`) nasce no centro e cresce sem parar até
cobrir a tela. As partículas da folha correm para dentro dele enquanto cresce — o alvo delas
(`u.disc`) é o raio do círculo naquele quadro — e **cada uma cresce ao chegar** (`u.grain`, calculado
do raio e da contagem para as partículas, juntas, fecharem o disco sem vão), recortada no raio
exato por uma máscara no fragment shader: a borda sai perfeita, não pontilhada. Quando a última
chega (`u.gather` = 1), o canvas sai e um elemento sólido (`.sp-black`) do mesmo raio assume.
Nada sólido aparece antes disso — um miolo sólido crescendo sob ou sobre a nuvem, já tentado,
aparecia como um ponto no centro. `Field` já nasce toda preta: a emenda é preto sobre
preto. A pergunta se forma no
escuro como a frase da home (escala, foco e brilho em curvas separadas) e a resposta é uma
comparação lado a lado — folha, planta e raiz, sem e com Aminosan® —, cada par subindo por cima do
anterior. As fotos estão em `public/img/aminosan-b/compare/`, geradas no Higgsfield (GPT Image 2.5);
a versão "sem" de cada par foi gerada **a partir** da "com", para enquadramento e luz baterem.

**Risco aberto:** a comparação contraria a restrição visual de `docs/02-MERCADO-USA.md` — decisão
do cliente, registrada em `docs/04-PENDENCIAS.md`. O aviso "Illustrative images" fica na tela a
comparação inteira; não o remova.

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

- **LP do KMEP Ultra**, em `/kmep` (`/kmep-ultra` redireciona). Construída sobre
  [`../docs/05-COPY-KMEP-ULTRA.md`](../docs/05-COPY-KMEP-ULTRA.md), o canônico da copy. O que
  ainda falta nela são dados da Juma, marcados como `TODO(P…)` em `src/content/kmep.ts`: ano do
  ensaio (P21), dose e embalagem (P4, P1), autorização para nomear instituições (P19) e as três
  perguntas comentadas do FAQ. O bloco K8 (`Flush.tsx`) está em HOLD pela P2 e sai com os trechos
  marcados `HOLD P2`.
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
