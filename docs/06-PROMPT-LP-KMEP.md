# Prompt de execução — LP do KMEP (`/kmep`)

**Para quem é este arquivo:** um agente de IA (Claude Code) abrindo uma sessão nova neste
repositório, com a tarefa de construir a landing page do KMEP Ultra® do zero. Cole o arquivo
inteiro, ou abra a sessão com *"leia `docs/06-PROMPT-LP-KMEP.md` e execute"*.

Este documento é **o plano de execução**. Ele não substitui o canônico de copy
(`docs/05-COPY-KMEP-ULTRA.md`) nem as regras de animação (`web/README.md`) — ele diz o que
construir, com qual gramática visual, em qual ordem, e onde cada verdade mora.

---

## 0. A missão, em um parágrafo

Construir uma landing page nova em `/kmep` (rota em minúsculas, exatamente `kmep`), no Next.js de
`web/`, com a copy canônica do KMEP Ultra®, usando o **mesmo design system e a mesma gramática de
movimento da `/aminosan-b`** — a LP mais bem resolvida do projeto — temperada com a linguagem
editorial da home. O resultado precisa parecer um site premiado: tipografia grande e confiante,
cenas presas ao scroll, transições com peso, nenhuma seção que pareça template. O produto é técnico
e o público é produtor americano cético: **o luxo aqui é precisão, não efeito**.

Ao final, `npm run build` e `npm run lint` passam limpos, a página funciona em 360px de largura, e
quem pedir menos movimento (`prefers-reduced-motion`) recebe a página inteira legível e estática.

---

## 1. Leia isto antes de escrever a primeira linha

Nesta ordem. Não pule nenhum — cada um responde uma pergunta que os outros não respondem.

| # | Arquivo | O que você tira dele |
|---|---|---|
| 1 | `docs/05-COPY-KMEP-ULTRA.md` | **Canônico.** Posicionamento, arco narrativo, as 17 seções (`K1`–`K17`) e a copy pronta em inglês. Em qualquer divergência, vale ele |
| 2 | `web/README.md` | As regras de animação do projeto. Há três que não são óbvias e quebram a página se ignoradas |
| 3 | `web/src/components/aminosan-b/*.tsx` | **A referência visual e de movimento.** Leia os 11 arquivos. É daqui que sai o vocabulário da nova página |
| 4 | `web/src/content/aminosan-b.ts` | O formato do conteúdo tipado: como a copy sai do componente |
| 5 | `web/src/app/globals.css` (linhas 1–160) | Os tokens do `@theme`. Não invente cor, tamanho de fonte nem espaçamento fora daqui |
| 6 | `docs/02-MERCADO-USA.md` | As restrições FIFRA por seção e o que o mercado americano impõe |
| 7 | `docs/04-PENDENCIAS.md` | O que `P1`, `P2`, `P4`, `P10`, `P11`, `P19`, `P21`, `P32` travam |
| 8 | `site/kmep-ultra.html` | Protótipo antigo. **Não vale como posicionamento** — vale como fonte da tabela do ensaio e das oito perguntas do FAQ |
| 9 | `web/src/components/home/` (Hero, Products, PerformanceProof) | O peso editorial da home: tipografia grande, fio lima, prova com testemunha ao lado |

---

## 2. Estado do repositório quando este prompt foi escrito

- Branch `main`. A **home está pronta**; `/aminosan` e `/aminosan-b` estão prontas.
- **Não existe** `src/app/kmep/`, `src/components/kmep/` nem `src/content/kmep.ts`. Você cria tudo.
- Existe `src/app/kmep-ultra/page.tsx`, um **esqueleto** com um `<h1>` e um parágrafo de "em
  construção". Ele sai de cena: a rota nova é `/kmep`, e `/kmep-ultra` passa a **redirecionar**
  (`redirect("/kmep")` no próprio `page.tsx`, ou um `redirects()` em `next.config.ts` — prefira o
  `redirects()`, é permanente e não gera render).
- `src/content/home.ts` aponta para `/kmep-ultra` em três lugares (nav, menu do rodapé, card de
  produto) e em `src/app/sitemap.ts`. **Troque todos para `/kmep`.**
- **Existe uma tentativa anterior, na branch local `feat/lp-kmep`** (commits `7cad1b7` a `23e79d2`):
  uma `/kmep` com dezesseis componentes, hero, cena de deposição, mecanismo do potássio, prova,
  conta, credencial e faixa de teste. Ela **não** está em `main` e não é o ponto de partida —
  a página nova se escreve a partir da `/aminosan-b`, não dela. Vale como consulta pontual
  (`git show feat/lp-kmep:web/src/components/kmep/Deposition.tsx`) se você quiser ver uma solução já
  tentada para uma cena específica; e vale como aviso: os dois últimos commits daquela branch são
  correções de **erro de hidratação** e de **imagem `fill` dentro de pai `sticky`**, que são
  exatamente as duas armadilhas desta página.
- `src/content/home.ts`, em `products[0].body`, ainda carrega a frase de maior risco FIFRA do site:
  *"drives the target out of hiding"*. A seção 5 de `docs/05-COPY-KMEP-ULTRA.md` já escreveu a
  substituição, no mesmo tamanho. **Aplique-a** (categoria e corpo) — e o espelho em
  `src/content/pt/home.ts` junto.

---

## 3. Regras que não se negociam

Estas valem mais que qualquer preferência visual. Uma página linda que quebra uma delas não publica.

1. **FIFRA.** Descreva o que o produto *entrega* (cobertura, deposição, potássio na folha), nunca o
   efeito que ele *provoca* na praga ou no desempenho do defensivo. Claim de controle ou de
   performance de pesticida exige registro na EPA.
2. **A distinção que não pode se perder:** o KMEP **não** faz o inseticida render mais. Não é
   economia de dose nem de calda. Ele aumenta a eficiência do que já está no tanque. A frase
   *"This is not a reason to cut your insecticide rate"* aparece dentro de `K8`, e a resposta
   equivalente aparece no FAQ. Sem isso, o leitor entende diluição — e quem descobre depois é o
   agrônomo do cliente.
3. **`K8` é removível por construção.** O bloco da ação desalojante está em HOLD pela pendência
   `P2`. Ele precisa sair com **uma linha de import, uma linha de JSX e dois trechos marcados**
   (um pedaço do card 3 de `K9` e uma pergunta do FAQ). Marque os três pontos com o comentário
   `/* HOLD P2 — remover junto com Flush.tsx */`. Nada mais da página pode depender dele.
4. **Nenhum número sem testemunha ao lado.** `221.2 vs 212.3 bu/ac`, nunca `+8.9` sozinho.
5. **Toda fonte impressa embaixo**, em corpo miúdo, com local e ano. Dado brasileiro é identificado
   como brasileiro — esconder a origem destrói mais credibilidade do que a origem custa.
6. **Unidades americanas:** `bu/ac`, `fl oz/acre`, `$/acre`, estágios `V4`/`V6`/`VT`/`R1`. Nunca
   litros, sacas ou hectares no texto corrido. A única exceção é a linha de unidades originais da
   tabela do ensaio (`231.45 vs 222.12 sc/ha`), que existe justamente para mostrar a origem.
7. **Arte proibida:** planta tratada visivelmente maior que a testemunha (é a representação visual
   de um regulador de crescimento, mesmo risco da frase equivalente); foto de lavoura brasileira em
   plano aberto (macro não tem sotaque, plano aberto tem); embalagem em litros.
8. **Pendências não aparecem na tela.** Nada de `[P4]` ou `[PENDING]` renderizado. Onde o dado
   falta, escreva a frase honesta — *"Rates in fl oz per acre come from the U.S. label; tell us your
   crop and we'll send it"* — e deixe o marcador só no comentário do código e no `content`, como
   `/* TODO(P4): trocar pela dose do rótulo americano */`.
9. **Tom:** técnico, direto, sem exclamação. Três adjetivos de voz: **exato, franco, de campo**.
   Três anti-adjetivos: entusiasmado, publicitário, visionário. Isso vale para a copy **e** para o
   movimento: nada pulsa, nada quica, nada brilha sem motivo.
10. **Copy em inglês americano**, em `src/content/kmep.ts`, tipada, com espelho em
    `src/content/pt/kmep.ts` para a Juma revisar. Sem texto solto em JSX.

---

## 4. O design system, em números

Tudo abaixo já existe em `web/src/app/globals.css`, no bloco `@theme`, e vira utilitário do
Tailwind. **Não crie token novo sem necessidade real** — e se criar, declare no `@theme`, não
inline.

### Cores

| Token | Hex | Uso |
|---|---|---|
| `night` | `#0C0C0E` | fundo escuro base |
| `night-warm` → `night-deep` | `#28291E` → `#070709` | o gradiente dos cards escuros (`bg-linear-[122.93deg,var(--color-night-warm)_2.4%,var(--color-night-deep)_60.23%]`) |
| `forest` | `#16261B` | verde escuro editorial da LP B |
| `olive` | `#435630` | números e traços sobre claro |
| `moss` | `#6E7D44` | eyebrow e rótulos sobre claro |
| `sage` | `#B9C2A0` | superfície clara alternativa |
| `cream` | `#EEEBE0` | fundo claro editorial |
| `offwhite` | `#F6FFEE` | texto sobre escuro |
| `lime` | `#B7C73E` | **acento principal**: fios, números, estado ativo |
| `lime-bright` | `#A8E63A` | eyebrow de card escuro |
| `green-deep` / `green-brand` | `#002C1B` / `#004C25` | faixa de teste, botão |
| `kmep` / `kmep-light` | `#CB351B` / `#FF694E` | **a cor desta página** — ver §6 |
| `ink` / `muted` / `muted-dark` | `#2A2A2A` / `#4E4E4E` / `#A0A0A2` | texto |

### Tipografia

- `--font-display` (Archivo) para títulos, números e todo texto em caixa alta espaçada.
- `--font-body` (Inter) para corpo. `--font-tag` (DM Sans) só nas tags de programa da home.
- Escala fluida pronta: `text-h1` `clamp(34px,4.6vw,88px)`, `text-h2` `clamp(28px,3.15vw,60px)`,
  `text-h3`, `text-body`, `text-small`, `text-micro`.
- A LP B quase não usa a escala nomeada: ela escreve `clamp()` por seção, com `leading` entre
  `0.92` e `1.0` e `tracking` entre `-0.02em` e `-0.05em` nos títulos grandes. **Siga esse
  padrão** — título grande é apertado e com entrelinha curta; texto miúdo é espaçado e em caixa
  alta.
- O corpo "de legenda" da LP B é uma constante exportada, e a nova página terá a sua:
  ```ts
  export const microCaps = "font-display text-[11px] leading-[1.5] tracking-[0.14em] uppercase";
  ```

### Ritmo e medidas

- `--spacing-gut` `clamp(20px,5vw,40px)` (goteira lateral), `--spacing-sec` `clamp(72px,8vw,124px)`.
- `.wrap` = `min(1360px, 100% - 2·gut)`, centralizado. Use sempre que o conteúdo for de coluna.
- Seções de tela cheia usam `h-[100svh]` / `min-h-[100svh]` — **`svh`, nunca `vh`** (a barra do
  navegador no celular muda a altura no meio do gesto).
- Breakpoints: `lg` = 1024px é a divisa que a LP B usa para empilhar; `860px` é a divisa estrutural
  do Figma (troca de foto); `nav:` = 1152px é onde o header vira hambúrguer.
- Raio de canto: cards `rounded-[clamp(12px,1.05vw,20px)]`; blocos grandes
  `rounded-[clamp(24px,2.4vw,44px)]`.

---

## 5. A gramática de movimento — o que copiar da `/aminosan-b`

Esta é a parte que faz a página parecer premiada. Cada gesto abaixo **já está implementado** no
repositório: leia o arquivo, entenda o porquê do comentário, e reaproveite a técnica (não
copie/cole o componente inteiro — a cena é outra).

| Gesto | Onde está | Onde usar no KMEP |
|---|---|---|
| **Entrada de hero em camadas, sem scrub** (fundo de `scale 1.18` assentando, folhas subindo de `yPercent 38`, texto em stagger, tudo depois do `booted`) | `aminosan-b/Hero.tsx` | `K1` |
| **Tela dividida com foto se abrindo por `clip-path` presa ao scroll** + foto de `scale 1.25` a `1` | `aminosan-b/Proof.tsx` | `K3`, `K10` |
| **Cena presa (`pin`) com `scrub` enquanto elementos convergem** + cor do título virando no meio do pin | `aminosan-b/Converge.tsx` | `K5` |
| **Sticky lateral:** cena fixa de um lado, texto em etapas rolando do outro, cada etapa acendendo (`.is-active`, `opacity-30 → 100`) e movendo a cena | `aminosan-b/Cell.tsx` | `K6`, `K7` |
| **Sequência de quadros em `<canvas>` tocada pelo scroll** (carga progressiva 8→4→2→1, indicador de etapas) | `aminosan-b/Meet.tsx` | **só** se você produzir a sequência de imagens; senão, SVG animado |
| **Parallax interno de foto** (`yPercent -10 → 10`, `scrub: true`) | `aminosan-b/Timing.tsx` | qualquer foto de meia página |
| **Cards em escada com recorte vazando pelo topo**, entrada presa ao scroll em compassos diferentes | `aminosan-b/Season.tsx` | `K15` |
| **Trilho horizontal pinado**: o eixo Y do scroll vira X, sem setas | `aminosan-b/Questions.tsx` | `K16` |
| **Bilhetes sobrepostos à foto subindo em velocidades diferentes** | `aminosan-b/Inside.tsx` | `K12` ou `K15` |
| **Card branco do formulário sobre foto escurecida, dentro de bloco arredondado** | `aminosan-b/Final.tsx` | `K17` |
| **Título entrando linha a linha por trás de máscara** | `motion/SplitLines.tsx` | todo título de seção |
| **Número contando até o valor, com o valor final já no HTML** | `motion/Counter.tsx` | `K2`, `K10`, `K11`, `K12` |
| **Entrada padrão de bloco** (`fromTo`, stagger, reduced-motion embutido) | `motion/Reveal.tsx` | onde não houver cena própria |
| **Fio lima que se desenha da esquerda** (`scaleX: 0 → 1`, `origin-left`, `expo.out`) | `Converge.tsx` (`.cv-line`), `Proof.tsx` (`.pf-rule`) | abertura de card e separador de linha |
| **Deriva contínua de elementos soltos** (`random()` com `repeatRefresh`, `sine.inOut`) | `Converge.tsx` (`.cv-drift`), `Problem.tsx` (`.pb-step`) | partículas/gotas em repouso |

### As regras técnicas que quebram a página se ignoradas

Estão em `web/README.md`; repetidas aqui porque são as mais caras de descobrir sozinho.

1. **Importe o GSAP de `@/lib/gsap`**, nunca de `"gsap"`. É lá que os plugins (`ScrollTrigger`,
   `ScrollToPlugin`, `SplitText`) são registrados e os defaults do projeto (`power3.out`, `0.7s`)
   vivem.
2. **`useGSAP` com `{ scope }`**, nunca `useEffect`. Ele recolhe tweens *e* ScrollTriggers na
   desmontagem — que no App Router acontece a cada navegação — e limita os seletores de string ao
   componente.
3. **`fromTo`, nunca `from`.** O `ScrollTrigger.refresh()` roda toda vez que a página muda de
   altura (imagens carregando), e um `from` reverte para o estado inicial: a seção **fica
   invisível**.
4. **`gsap.matchMedia` com o ramo de `prefers-reduced-motion: reduce`** entregando o estado final
   (`gsap.set(alvo, { opacity: 1, y: 0 })`). Cenas de canvas desenham o último quadro; cenas
   pinadas não pinam.
5. **Nada de `scroll-behavior: smooth`.** A rolagem suave é do Lenis (`motion/SmoothScroll.tsx`) e
   ele é o dono único da posição de scroll. Âncoras usam `<SmartLink href="#alvo">`, que devolve um
   `<a>` comum para o `SmoothAnchors` animar — `next/link` faria o próprio salto e atropelaria.
6. **`data-nav-theme="dark"`** na `<section>` de fundo escuro, para o header trocar de tom em cima
   dela.
7. Cena que depende do preloader espera o `booted` de `@/lib/boot` (só o hero precisa).
8. Em cena com `pin`: `anticipatePin: 1`, e `invalidateOnRefresh: true` quando a distância for
   medida em função da janela (`end: () => ...`).
9. Nada de valor aleatório calculado no render sem semente — a hidratação reclama. Use o gerador
   `seeded()` do `Converge.tsx`.

---

## 6. A identidade da página: como o KMEP se separa do Aminosan

As duas LPs não podem parecer a mesma página com outro texto. A diferença é **a cor e a matéria**:

- **Aminosan B** é verde-e-creme, orgânico, curvo, biológico: esferas, folhas, células, luz de
  amanhecer.
- **KMEP é mecânico e atmosférico**: bico, gota, ar em movimento, superfície cerosa, a hora do dia
  (7h contra 14h). A paleta base continua na mesma família — `forest`, `cream`, `night`, `lime` —,
  mas a página ganha **um acento próprio**: `kmep` `#CB351B` e `kmep-light` `#FF694E`, já no tema.

**Regra de uso do acento** (siga à risca, senão vira página de promoção):

- O cobre/terracota marca **perda e custo**: a fração da aplicação que não trabalha (`K3`), o custo
  da perda (`K4`), a coluna "Product cost" de `K11`, a coluna "It does not fit" de `K14`.
- O lima marca **entrega e ganho**: os fios de abertura, o número tratado de `K2`/`K10`, a coluna
  "Net per acre" de `K11`, a etapa ativa das cenas.
- Nunca os dois na mesma linha de texto. Nunca cobre em painel inteiro sobre fundo claro — ele
  aparece em fio, número e etiqueta.

### Ritmo de fundos (a alternância que dá respiração à página)

| Seção | Fundo |
|---|---|
| `K1` Hero | escuro, foto — `data-nav-theme="dark"` |
| `K2` Faixa de prova | `cream` — faixa clara logo abaixo do hero, como nas referências |
| `K3` Problema | `cream`, tela dividida com foto |
| `K4` O que a perda custa | `night` (`data-nav-theme="dark"`), acento cobre |
| `K5` Uma passada, dois trabalhos | gradiente `cream → forest`, cena pinada |
| `K6` Deposição | `forest` escuro, cena sticky |
| `K7` Potássio | claro (`#E9EBCB` / `sage`), cena sticky |
| `K8` Desalojante (HOLD) | `night` |
| `K9` Operação | `cream` com cards escuros |
| `K10` Prova | `cream`, editorial, muito fio e régua |
| `K11` A conta | `forest` profundo, números grandes |
| `K12` Credencial | `night` |
| `K13` Quando entra | `cream` |
| `K14` Para quem é | `cream` / `sage`, duas colunas |
| `K15` Faixa de teste | `forest` com foto aérea |
| `K16` Perguntas | claro, trilho pinado |
| `K17` Pedido | branco com bloco `forest` arredondado |

---

## 7. O que tirar das referências visuais enviadas

Sete capturas de landing pages do agro foram usadas como referência de **estética**, não de
estrutura. O que aproveitar:

- **Hero de foto cheia com a headline centralizada e respirando** e, logo abaixo, uma **faixa
  horizontal de números com divisórias finas**. É exatamente o formato de `K1` + `K2`.
- **Etiqueta-pílula com marcador** acima do título (`● SPRAY PERFORMANCE · FOLIAR POTASSIUM ·
  TANK-MIX PARTNER`), fina, em caixa alta espaçada.
- **Cartões arredondados de vidro sobre a foto**, com rótulo pequeno e corpo miúdo — servem aos
  bilhetes de `K12` / `K15`.
- **Bloco escuro de dados** com números grandes em linha e um CTA na ponta — serve a `K11`.
- **Grade de cards com fio de acento e rótulo contido** — serve a `K9`.
- **Tipografia grande, apertada, com bastante ar em volta**, e seções alternando claro e escuro.

O que **não** aproveitar, porque é justamente o que deixa genérico:

- Ícone colorido em círculo pastel, emoji, gradiente arco-íris, brilho.
- "Get Started", "Learn More", avatares empilhados de "+15,000 farmers", selo de "satisfaction
  rate".
- Drone, dashboard de IA, mapa de calor de satélite: o KMEP é um produto de tanque, não um SaaS.
- Foto de pessoa sorrindo de braços cruzados.
- Número sem fonte — aqui todo número tem testemunha e rodapé.

---

## 8. A página, seção a seção

Dezessete blocos de copy, **quinze componentes** (o hero absorve `K2` como faixa ancorada, e `K13`
absorve a ficha de dose). Um arquivo por seção, em `web/src/components/kmep/`, na ordem da página —
o mesmo padrão da `/aminosan-b`.

Para cada seção, **a copy exata está em `docs/05-COPY-KMEP-ULTRA.md`**. Transcreva os parágrafos
dali para `content/kmep.ts` **sem reescrever**. O que segue é o layout e o movimento.

---

### `Hero.tsx` — `K1` + `K2`

**Fundo:** foto escura de tela cheia, `h-[100svh] min-h-[600px]`, `data-nav-theme="dark"`.
Cena: pulverizador ao amanhecer visto de perto, ou dossel de milho contra a barra do pulverizador —
**nunca** plano aberto de lavoura brasileira.

**Layout:** eyebrow em caixa alta espaçada (`SPRAY PERFORMANCE · FOLIAR POTASSIUM · TANK-MIX
PARTNER`) → `<h1>` *"You won't see the loss until you harvest."* em `clamp(40px,5.6vw,108px)`,
`leading-[0.95]`, `tracking-[-0.035em]` → sub (o parágrafo de `K1`, terminando em "Six dollars an
acre.") → dois CTAs: **Run a trial strip on your acres** (`#trial-form`, sólido) e **See the trial**
(`#proof`, contorno).

**A faixa de prova (`K2`)** entra colada ao pé do hero — meia altura dentro do escuro, meia fora,
ou como faixa `cream` imediatamente abaixo (escolha a segunda se a foto for escura demais). Três
células separadas por fio de 1px:
`221.2 bu/ac treated` · `212.3 bu/ac untreated check` · `+8.9 bu/ac (+4.2%)`, e embaixo, em corpo
miúdo: `Corn · Rehagro trial · Brazil · [ano — TODO(P21)]`.

**Movimento:** o padrão do `aminosan-b/Hero.tsx`. `gsap.set` dos estados iniciais, tudo esperando
`booted.then(...)`; fundo `scale 1.18 → 1` em 2.6s (`power2.out`), camada da frente subindo
`yPercent 38 → 0` em 2s, textos com `opacity`/`y` e `stagger: 0.1` a partir de 0.5s.

**Atenção ao `<Counter>`:** ele arredonda para inteiro (`snap: { value: 1 }`). Para `221.2` você
precisa de `snap: { value: 0.1 }` e `toFixed(1)` — estenda o componente com uma prop `decimals` em
vez de duplicá-lo.

**Versão B (opcional):** a copy tem uma segunda headline para teste A/B (*"One pass. Two jobs. Six
dollars an acre."*). Deixe a versão 1 no ar e a 2 anotada no `content`, em comentário. Não
construa duas rotas.

---

### `Problem.tsx` — `K3`

**Fundo:** `cream`. Tela dividida `lg:grid-cols-2`, `min-h-[100svh]` no desktop.

**Esquerda:** foto macro — cartão hidrossensível, ou a gota contra a superfície cerosa da folha.
Documental, nunca publicitária. **Direita:** `<SplitLines>` com *"You made the pass right. Part of
it still missed."* + os dois parágrafos de `K3` em `microCaps` sobre `forest/75`.

**Movimento:** o gesto do `Proof.tsx` da LP B — a foto se abre por `clip-path: inset(30% 0 0 0) →
inset(0)` com `scrub: 0.6`, e a imagem vai de `scale 1.25` a `1` no mesmo tempo. O título entra por
máscara; os parágrafos com `<Reveal stagger={0.1}>`.

**Detalhe que vende a seção:** uma legenda discreta no canto da foto que troca com o scrub — de
`top of the canopy` para `the leaf that mattered`. Legenda, não número: nenhum dado de cobertura
foi medido e publicado.

---

### `Cost.tsx` — `K4`

**Fundo:** `night`, `data-nav-theme="dark"`, acento cobre.

**Layout:** título *"Small losses you never see add up to a number you do."* à esquerda; à direita,
**dois blocos empilhados** — "The re-spray" (outra viagem, mais diesel, uma janela de clima que
você não planejou) e "The potassium the crop needed in the same stretch" —, cada um aberto por um
fio cobre que se desenha. Fecho em linha própria, destacado: *"Neither of those shows up as a
symptom you can photograph. Both show up in the yield monitor."*

**Movimento:** os dois blocos entram em `stagger`, com os fios em `scaleX: 0 → 1` logo atrás
(`expo.out`, `delay: 0.35`) — o gesto de `.cv-line`.

**Nenhum número aqui:** a seção descreve dinâmica agronômica e custo operacional, e é exatamente
por isso que ela publica sem depender de `P2`.

---

### `TwoJobs.tsx` — `K5`

**A seção-chave da página.** É aqui que a Big Idea aparece: *"One pass. Two jobs."*

**Fundo:** gradiente `cream → forest` de cima a baixo, como no `Converge.tsx`
(`bg-[linear-gradient(180deg,...)]`), para a página mergulhar no escuro do mecanismo.

**Cena:** uma passada que se bifurca. SVG inline: um rastro entra pela esquerda e se divide em dois
caminhos, que seguem para as duas seções seguintes — **caminho A**, curto e lima ("the twenty
minutes the sprayer is in that field"); **caminho B**, longo e mais claro ("the rest of the
season"). Dois medidores nas pontas, com escalas de tempo diferentes. Traço fino, geométrico,
técnico: nada de mascote, nada de ícone de spray de banco de ícones.

**Movimento:** cena **pinada** com `scrub`, o padrão do `Converge`:
`{ trigger: ".tj-stage", start: "top top", end: "+=110%", pin: true, scrub: 0.8 }`. O rastro se
desenha por `strokeDasharray`/`strokeDashoffset`, a bifurcação abre, e o título troca de cor no
meio do pin (`#16261B → #EEEBE0`), porque o fundo escureceu atrás dele. No celular, **sem pin**: a
mesma linha do tempo presa ao scroll normal, disparada em `top 85%`.

**Fecho:** os dois parágrafos de `K5`, com a última frase isolada — *"The first job happens in the
twenty minutes the sprayer is in that field. The second one runs for the rest of the season."*

---

### `Deposition.tsx` — `K6` (Trabalho 1)

**Fundo:** `forest` escuro, `data-nav-theme="dark"`.

**Layout:** o padrão sticky do `Cell.tsx` — **cena fixa de um lado** (desktop: `sticky top-0`,
`h-[100svh]`; celular: faixa presa no topo com esmaecimento embaixo, e fundo liso, nunca gradiente,
sob a faixa) e **texto em etapas do outro**, cada etapa acendendo de `opacity-30` para
`opacity-100`.

**Cena: a carreira da gota.** Três estados, no compasso das etapas:

1. **Leaves the nozzle** — o leque do bico, o espectro de gotas.
2. **Travels through moving air** — a deriva, a gota que não chega.
3. **Lands on a waxy, vertical surface** — e fica, ou não fica.

Construa em SVG animado por scrub (posição, tamanho e opacidade das gotas, com semente fixa) ou, se
você produzir a sequência de imagens, no `<canvas>` do `Meet.tsx`. Um contador `01 / 03` no canto da
cena, como o `.cl-count`. **Não compare duas plantas.**

**Texto:** headline *"What the droplet does before it dries."*, os dois parágrafos de `K6` e o
fecho, isolado do corpo: *"Nothing changes about your nozzle or your rate. What changes is how many
of those droplets stay where you put them."*

**A frase que faz a seção:** *"A pass at 7 a.m. and a pass at 2 p.m. are not the same pass."* —
merece tratamento tipográfico próprio, com dois marcadores de hora na cena.

---

### `Potassium.tsx` — `K7` (Trabalho 2)

**Fundo:** claro (`#E9EBCB` ou `sage`), respirando depois do escuro.

**Layout:** headline *"Grain fill runs on potassium the root may not deliver in time."* + o
parágrafo de `K7`. Depois, o sub-bloco **"Two routes, two clocks"**, que é a cena.

**Cena (AN-02):** duas rotas lado a lado, presas ao scroll.

- **Rota do solo:** dissolver → viajar até a superfície da raiz → entrar no xilema → subir até a
  folha. Quatro etapas, cada uma com um freio quando o perfil seca.
- **Rota foliar:** começa na folha e entra no tecido de onde pousou. Duas etapas.

Dois relógios, um por rota, andando em compassos diferentes. **Cuidado técnico:** a comparação
temporal explícita ("em horas em vez de dias") **ainda depende de respaldo do técnico da Juma** —
represente o contraste **sem cravar número**: a rota do solo tem mais etapas e mais freios; a
foliar, menos. Isso é verdade e é suficiente.

**Movimento:** sticky/scrub como `K6`, ou um pin curto com as duas rotas avançando em paralelo. A
frase *"The potassium is in the ground. Your soil test says so. That is not the same as having it
in the plant during the three weeks that set the kernel."* entra em máscara, sozinha, depois das
duas rotas completarem.

---

### `Flush.tsx` — `K8` · **HOLD P2**

**Bloco removível.** Toda a arte vive dentro deste arquivo (SVG e CSS inline). Comentário no topo:

```tsx
/**
 * K8 — Vantagem adicional: a ação desalojante. HOLD P2.
 * Se a validação regulatória vier restritiva, apague este arquivo, a linha de
 * import e a de JSX em app/kmep/page.tsx, o trecho marcado do card 3 em
 * Operation.tsx e a pergunta correspondente em Questions.tsx. Nada mais na
 * página depende daqui.
 */
```

**Fundo:** `night`. **Layout:** headline *"The one you didn't reach is the one that comes back."*,
o parágrafo de `K8`, e os três tempos em sequência — **Sheltered** · **Dislodged** · **Exposed** —,
cada um com seu desenho, avançando por scrub.

Dentro do bloco, obrigatoriamente, a ressalva: *"This is not a reason to cut your insecticide rate.
Same rate, same label, same tank. What changes is how much of the population the insecticide
actually reaches."* — em caixa de destaque, não em nota de rodapé.

---

### `Operation.tsx` — `K9`

**Fundo:** `cream` com quatro cards escuros (o gradiente `night-warm → night-deep` da LP B).

**Layout:** headline *"What it does for the operation."* + grade de quatro cards, na ordem em que o
produtor pergunta (copy exata em `K9`):

1. **Goes in the tank you're already filling.**
2. **More of the spray does its job.**
3. **Potassium in a form the leaf takes up.** — *o trecho final deste card depende de `P2`; marque-o*
4. **Six dollars an acre, against 8.9 bushels.**

Cada card: fio lima que se desenha no topo (largura do título, com `w-fit`), título, corpo em
`microCaps`. O card 4 ganha tratamento diferente — número grande e o CTA "Ask us for the full trial
report" apontando para `#trial-form`.

**Movimento:** `y: 60 → 0` com `opacity`, `stagger: 0.12`, `expo.out`, uma vez, em `top 88%`; os
fios entram 0.35s depois. No celular, três colunas viram uma, e o primeiro card ocupa duas
(`col-span-2 md:col-span-1`), como em `Converge`.

---

### `Proof.tsx` — `K10`

**Fundo:** `cream`, editorial, com fios e tabela. É a seção mais sóbria da página **de propósito**:
aqui o leitor cético para de rolar e lê.

**Layout:**

1. Headline *"Nine bushels, same pass."* + a abertura reescrita de `K10`.
2. **Os dois números lado a lado, com o mesmo peso tipográfico:** `212.3` (untreated check) e
   `221.2` (treated), com `+8.9 (+4.2%)` entre eles. Nada de planta maior; se usar barras, a escala
   começa em zero e está rotulada.
3. **A tabela do ensaio**, sete colunas: Crop · Location · Treated · Untreated check · Difference ·
   Source · Year. Duas linhas: a americana (`221.2` / `212.3` / `+8.9 (+4.2%)` / Rehagro / ano
   pendente) e a de unidades originais (`231.45` / `222.12` / `+9.33 sc/ha`). Está em
   `site/kmep-ultra.html`, por volta da linha 850.
4. **O artigo revisado por pares**, em bloco separado por régua: algodão, blocos casualizados,
   estação experimental de terceiro, *Revista Foco*, v.16 n.2, 2023, DOI
   `10.54751/revistafoco.v16n2-129`. A declaração de autoria está em aberto (`P32`) — escreva a
   frase honesta, não o colchete.
5. Rodapé de fonte: *"Results from field trials conducted in Brazil. Field performance varies with
   climate, soil and management."*

**Movimento:** `<Counter>` com decimal nos dois números; linhas da tabela entrando com fio em
`scaleX` e `stagger`; foto documental (se houver) abrindo por `clip-path`. Contenção deliberada:
esta seção anima **menos** que as vizinhas.

---

### `Economics.tsx` — `K11`

**Fundo:** `forest` profundo, `data-nav-theme="dark"`.

**Layout:** headline *"What nine bushels is worth on your acres."* + o parágrafo de `K11`. Abaixo,
os três cenários de preço, em tabela ou em três colunas:

| Corn price | Value of +8.9 bu/ac | Product cost | Net per acre |
|---|---|---|---|
| $4.00/bu | $35.60 | $6.00 | $29.60 |
| $4.30/bu | $38.27 | $6.00 | $32.27 |
| $4.60/bu | $40.94 | $6.00 | $34.94 |

**Hierarquia visual inegociável** (nota 3 das notas de implementação do canônico): o custo de `$6` e
o líquido por acre têm **o mesmo peso tipográfico** do ganho. Publicar ganho maior que custo, em
corpo maior, é a estética de propaganda que o resto do site rejeita.

**Movimento:** as três linhas entram em `stagger`, os valores contam, e se houver barras comparando
ganho e custo elas crescem por `scaleX` **na mesma escala** — custo em cobre, líquido em lima,
ganho em creme.

**Rodapé:** *"Yield response from the Rehagro trial in Brazil. Corn prices shown for reference.
Your result will vary with climate, soil and management."*

**Comentário no código:** `/* TODO(P4): se a dose do rótulo americano mudar o custo, esta é a única
tabela da página onde o número aparece. */`

---

### `Credential.tsx` — `K12`

**Fundo:** `night`.

**Layout:** headline *"Application technology is a research program here, not a tagline."* + o
parágrafo do DESATA (desde 2021, com a UENP e com o NITEC, laboratório de tecnologia de aplicação e
máquinas da UNESP: túnel de vento, espectro de gotas, deriva e deposição).

**Nomear as instituições depende de `P19`** — deixe os nomes em um campo separado do `content`
(`institutions`), com o comentário de pendência, para sair numa edição só se o jurídico negar.

Abaixo, o **bloco de contexto**, em cartões sobrepostos ou faixa de números: `185 counties` ·
`16 states` · `2025 season`, com a linha de fonte *"Corn leafhopper was confirmed in 185 counties
across 16 states in the 2025 season. Brazil has been managing it for more than a decade. Pioneer,
2025, public data."*

**Atenção FIFRA:** é um bloco de **estatística pública**. Ele não atribui controle da praga ao
produto, e o texto ao redor não pode sugerir isso.

**Movimento:** `<Counter>` nos dois números; cartões subindo em velocidades diferentes sobre o
fundo, como os bilhetes de `Inside.tsx`.

---

### `Timing.tsx` — `K13`

**Fundo:** `cream`.

**Layout:** headline *"When it goes in."* + a abertura (milho e soja são as duas culturas
posicionadas hoje; algodão e especiais em revisão técnica). Depois, **a linha do tempo**:

- **Corn:** `V4` → `V6` → **ear formation**. As duas primeiras pegam carona em aplicações de
  inseticida já agendadas; a de formação de espiga é o potássio chegando onde a demanda está.
- **Soybeans:** `V6/V7`, repetindo a cada 10 a 15 dias.

Desenhe como régua horizontal com os estágios marcados, avançando por scrub, com um alternador
milho/soja (dois botões, sem rota nova) — o protótipo já tem esse precedente de barra de cultura.

**Rate and pack:** `P4` e `P1` pendentes — escreva a frase honesta, com o `TODO` no código.
**Tank mix:** ordem de mistura e incompatibilidades conhecidas estão no rótulo; faça jar test de
qualquer combinação nova.

---

### `Fit.tsx` — `K14`

**Fundo:** `cream` / `sage`, duas colunas separadas por fio vertical.

**Esquerda — "It fits":** uma operação que já pulveriza inseticida em milho ou soja, roda as
próprias faixas-testemunha e quer mais de uma passada que já está orçada. Marcador lima.

**Direita — "It does not fit":** quem quer substituir potássio de solo, cortar dose de inseticida
ou comprar um produto que funcione sem uma aplicação que já ia sair. Marcador cobre, texto em tom
mais apagado.

Fecho, em destaque: *"If all you need is potassium, buy potassium. KMEP Ultra® is bought for what
the pass does, and the potassium rides along."*

**Movimento:** o fio vertical se desenha de cima para baixo (`scaleY`), e os itens entram alternados
(esquerda `x: -30`, direita `x: 30`) com `stagger`. É a seção mais barata de construir e uma das
mais valiosas: qualifica o lead e responde por antecipação a duas objeções do mapa.

---

### `Strip.tsx` — `K15`

**Fundo:** `forest` com foto aérea da faixa de teste.

**Layout:** headline *"Your field, your check strip, your monitor."* + três passos numerados (copy
exata em `K15`):

1. Pick a field with an insecticide pass already scheduled. We send the product for it.
2. Leave a strip untreated, in the same field, under the same management. That strip is the whole
   experiment.
3. Harvest both and read your own monitor. We come back to look at the numbers with you, whichever
   way they fall.

Embaixo, a linha de redução de risco, em destaque: **"No cost for the product on the strip. No
obligation after harvest."** E o CTA.

**Movimento:** cards em escada com a entrada presa ao scroll do `Season.tsx` — cada card sobe de
mais baixo quanto mais à direita, e o número/recorte anda num compasso próprio, escorregando sobre
o card.

Esta seção transforma a ausência de dado americano na oferta da página: ela precisa parecer
**generosa e concreta**, não promocional.

---

### `Questions.tsx` — `K16`

**Fundo:** claro. **Trilho horizontal pinado**, o gesto de `aminosan-b/Questions.tsx`: a cena
prende, o trilho corre para a esquerda conforme a página rola, sem setas, e cada cartão é uma caixa
creme (com ou sem foto — sem foto é mais honesto aqui).

**Nove perguntas.** As oito da versão anterior estão em `site/kmep-ultra.html` (a partir da linha
1333); transcreva as respostas de lá e aplique os três ajustes de `K16`:

1. *"Your trials are from Brazil. Why should that matter to me?"* — **a resposta mais importante da
   página**: a testemunha do ensaio brasileiro (212.3 bu/ac em milho) bate quase exato com a média
   nacional americana, e o ensaio rodou em condição mais difícil, não mais fácil. Este cartão entra
   **primeiro** e pode ser mais largo que os outros.
2. *"Is there anything published, or just your own trials?"*
3. *"How is this different from a standard 0-0-25 or KTS?"*
4. *"Can I cut my insecticide rate if I use it?"* → **No.** It does not stretch the insecticide and
   it does not change the rate on that label. Run your normal rate.
5. *"Can I tank mix it with my insecticide or fungicide?"*
6. *"How much does it cost per acre?"* (nova, do folheto) → Six dollars an acre per spray at label
   rate. The trial it sits next to returned 8.9 bu/ac, which is $38.27 at $4.30 corn. We publish
   both numbers on the same screen.
7. *"Will it foam the tank or plug my screens?"* — **aguarda resposta técnica da Juma.**
8. *"Is it registered in my state?"* — **aguarda `P10`.**
9. *"Do you have U.S. trial data?"* → *"Not yet — and we'd rather say so than dodge it."* + o
   convite para a faixa de teste.

As três pendentes: ou saem do array (preferível), ou entram com a resposta honesta do que existe
hoje. **Nunca com `[PENDING]` na tela.** Deixe-as no `content` comentadas, prontas para voltar.

---

### `Final.tsx` — `K17`

**Fundo:** branco, com o bloco `forest` arredondado por dentro — o desenho do `aminosan-b/Final.tsx`.

**Esquerda:** headline *"Run a trial strip. We supply the product."* em `<SplitLines>` + o sub de
`K17`.

**Direita:** card branco com o formulário. Use `<TrialForm source="kmep" />` — o mesmo componente da
home e da LP B, mesma Server Action, então o lead cai no mesmo lugar e o campo `source` separa a
origem. A copy pede uma **variante reduzida de quatro campos** (nome, e-mail, estado, cultura
principal): se for fazer, adicione uma prop `compact` ao `TrialForm` em vez de duplicar o
componente — e não mexa no contrato de `submitTrialRequest`.

**Ressalva de rodapé, obrigatória, dentro da seção:**

> KMEP Ultra® is applied in tank mix with an insecticide and never in place of one. It does not
> change the rate on the insecticide label. Always read and follow the label directions of the
> pesticide you are applying.

**Movimento:** foto de fundo `scale 1.15 → 1` com scrub; card subindo com `expo.out`, uma vez.

---

### O CTA, repetido em quatro alturas

**Sempre a mesma ação e a mesma promessa:** *Run a trial strip on your acres* → `#trial-form`.
Aparece em `K1`, `K9` (card 4), `K11` ou `K15`, e `K17`. O secundário, *See the trial*, aponta para
`#proof`. Toda âncora usa `<SmartLink>`.

**A prova aparece em três alturas diferentes** — faixa no hero (`K2`), seção inteira no meio (`K10`)
e a conta por acre logo depois (`K11`) —, para que o cético que rola direto para o número encontre
ele em qualquer uma das três.

---

## 9. Arquivos a criar e como ligar tudo

```
web/src/
├── app/
│   ├── kmep/page.tsx              rota nova: metadata + as 15 seções na ordem
│   ├── kmep-ultra/page.tsx        vira redirect (ou some, com redirects() no next.config.ts)
│   └── sitemap.ts                 "/kmep-ultra" → "/kmep"
├── components/kmep/
│   ├── ui.tsx                     Cta, Mark, microCaps — as peças miúdas, variante KMEP
│   ├── Hero.tsx        K1 + K2
│   ├── Problem.tsx     K3
│   ├── Cost.tsx        K4
│   ├── TwoJobs.tsx     K5
│   ├── Deposition.tsx  K6
│   ├── Potassium.tsx   K7
│   ├── Flush.tsx       K8   ← HOLD P2, removível
│   ├── Operation.tsx   K9
│   ├── Proof.tsx       K10
│   ├── Economics.tsx   K11
│   ├── Credential.tsx  K12
│   ├── Timing.tsx      K13
│   ├── Fit.tsx         K14
│   ├── Strip.tsx       K15
│   ├── Questions.tsx   K16
│   └── Final.tsx       K17
└── content/
    ├── kmep.ts                    toda a copy em inglês, tipada, um export por seção
    └── pt/kmep.ts                 espelho em português, mesma forma exata
```

**Fiação do conteúdo** (`src/content/index.ts`): acrescente `import * as enKmep from "./kmep"` e o
`ptKmep`, o campo `kmep: typeof enKmep` no tipo `Content`, e as duas entradas no `dictionaries`.
Nos componentes: `const { hero } = useContent().kmep;`.

**Metadata da rota:**

```ts
export const metadata: Metadata = {
  title: "KMEP Ultra®",
  description:
    "One pass, two jobs: better spray coverage and deposition, plus foliar potassium for grain fill. Six dollars an acre, in the insecticide pass you already run.",
};
```

**Server Components por padrão.** Só leva `"use client"` o que precisa de DOM ou estado — na
prática, toda seção com cena, mas **não** as que só exibem texto e cards com `<Reveal>`.

**Estilos:** a `/aminosan-b` é 100% Tailwind no JSX, sem `.module.css` e sem tocar em `globals.css`.
**Siga isso.** Só caia para o `@layer components` se a geometria for mesmo impossível em utilitários
— e, se cair, comente o porquê, como o resto do arquivo faz.

---

## 10. Imagens e cenas

**Inventário do que já existe e pode ser reusado:** `/img/pack-kmep-us.webp` (a bombona com rótulo
americano), `/img/crop-corn.webp`, `/img/aminosan-b/problem-corn.webp`,
`/img/aminosan-b/season-corn.webp`, `/img/aminosan-b/season-sprayer.webp`,
`/img/aminosan-b/trial-strip.webp` (aérea com faixa), `/img/aminosan-b/final-grower.webp`,
`/img/step-1-pass.webp` · `step-2-check` · `step-3-harvest` (com versões `-mobile`).

**Nunca referencie um caminho de imagem que não existe no disco** — o build quebra ou a página fica
com buraco.

**Assets novos:** o projeto tem precedente de gerar imagem com a ferramenta de geração e documentar
o prompt — veja `docs/beneath-surface-assets.md`, que traz o formato (prompt base, prompt de edição,
tamanhos, export em WebP com Sharp). Se você tiver a ferramenta disponível, produza os assets do
KMEP no mesmo padrão e escreva `docs/kmep-assets.md`. As regras de arte da §3 valem inteiras:
**macro documental, nunca plano aberto; nunca duas plantas de tamanhos diferentes.**

**Na dúvida, prefira cena construída** — SVG, canvas ou CSS. Metade das melhores cenas do site (a
convergência, a cadeia de conversão, o anel do microscópio) não tem foto nenhuma. Para o KMEP, o
bico, a gota, as duas rotas do potássio e a linha do tempo dos estágios são todos desenháveis, e
ficam melhores desenhados: um diagrama técnico bem feito é mais credível para este leitor do que
banco de imagens.

**`next/image`:** `fill` + `sizes` sempre que for foto de fundo; `quality={90}` só em foto de tela
cheia (o `next.config.ts` permite apenas 75 e 90). Troca de foto por largura de tela usa `<picture>`
com `media`, não `next/image` — veja o hero da LP B e o comentário que explica.

---

## 11. Acessibilidade, performance e celular

- **Celular primeiro nas cenas pinadas.** Toda cena com `pin` precisa de um ramo mobile: sem pin (a
  cena roda no fluxo normal do scroll, disparando em `top 85%`) ou com altura reduzida. Teste em
  360px.
- **`prefers-reduced-motion`** em toda cena, com o estado final entregue. Cenas de canvas desenham o
  último quadro; trilhos horizontais viram `overflow-x: auto`.
- **`alt` descritivo** em foto que informa; `alt=""` + `aria-hidden` em decoração; `role="img"` +
  `aria-label` em canvas que carrega informação.
- **Números acessíveis:** o `<Counter>` renderiza o valor final no HTML e anima por cima — quem
  chega sem JS ou com leitor de tela recebe o número certo.
- **LCP:** a foto do hero leva `fetchPriority="high"`; nada mais da página leva prioridade.
- **Sequência de quadros (se usar):** carregue sob `IntersectionObserver` com `rootMargin` folgado e
  ordem progressiva (8 → 4 → 2 → 1), como o `Meet.tsx`. Nunca baixe as duas orientações.
- **Sem layout shift:** toda imagem com `width`/`height` ou dentro de contêiner com proporção
  declarada.
- **Hidratação:** nada de `Math.random()`, `Date.now()` ou medida de janela no render. Gerador com
  semente, como o `seeded()` do `Converge.tsx`.

---

## 12. Checklist de aceite

Antes de dizer que terminou, confira uma a uma:

- [ ] `npm run build` e `npm run lint` passam sem erro nem aviso novo.
- [ ] `/kmep` renderiza as 15 seções na ordem; `/kmep-ultra` redireciona; `sitemap.ts` aponta para
      `/kmep`; os links da home foram trocados.
- [ ] O card do KMEP na home usa a copy nova de `docs/05-COPY-KMEP-ULTRA.md` §5 (EN e PT).
- [ ] Nenhum texto literal em JSX: tudo em `content/kmep.ts`, com espelho completo em
      `content/pt/kmep.ts` (mesmas chaves, mesma forma).
- [ ] Nenhum `[P…]`, `[PENDING]` ou `TODO` visível na tela.
- [ ] Todo número tem testemunha ao lado e fonte embaixo.
- [ ] `K8` sai com uma linha de import, uma de JSX e dois trechos marcados — verifique **comentando
      as linhas** e rodando o build.
- [ ] Nenhuma frase atribui controle de praga ou performance de defensivo ao produto.
- [ ] A ressalva de `K17` e a de `K8` estão no ar, dentro dos seus blocos.
- [ ] Em `K11`, custo e líquido têm o mesmo peso tipográfico do ganho.
- [ ] Nenhuma arte mostra planta tratada maior que a testemunha.
- [ ] Todas as cenas têm ramo de `prefers-reduced-motion`, e a página inteira continua legível nele.
- [ ] Em 360px não há rolagem horizontal, e nenhuma cena pinada trava o scroll.
- [ ] O header troca de tom corretamente em toda seção escura (`data-nav-theme="dark"`).
- [ ] Toda âncora usa `<SmartLink>` e rola suave, sem trepidar o hero.
- [ ] Nenhum import de `"gsap"` direto; nenhum `gsap.from`; nenhum `useEffect` animando.
- [ ] Nenhum caminho de imagem inexistente.
- [ ] A página não parece a `/aminosan-b` repintada: a cor de acento, as cenas e o ritmo são dela.

---

## 13. Ordem de trabalho sugerida

Trabalhe em `feat/lp-kmep` (ou similar), commitando por etapa — commits pequenos, em português, no
estilo do histórico (`feat(kmep): …`, `fix(kmep): …`).

1. **Fundação.** `content/kmep.ts` com a copy inteira transcrita do canônico + `pt/kmep.ts` +
   fiação em `content/index.ts` + rota `/kmep` vazia + redirect + sitemap + links da home + card do
   KMEP na home. Build passando.
2. **O esqueleto narrativo.** `Hero` (com a faixa `K2`), `Problem`, `Cost`, `TwoJobs` — a página já
   conta a história até a bifurcação. É aqui que o tom visual se define; se ele não estiver certo
   nestas quatro, pare e ajuste antes de seguir.
3. **O mecanismo.** `Deposition`, `Potassium`, `Flush` (HOLD), `Operation`. As cenas mais caras.
4. **A prova e a conta.** `Proof`, `Economics`, `Credential`. Sóbrias, precisas, muito fio e pouca
   animação.
5. **A conversão.** `Timing`, `Fit`, `Strip`, `Questions`, `Final`.
6. **Acabamento.** Celular em 360px, reduced-motion, `ScrollTrigger.refresh()` depois das imagens,
   checklist inteiro, e uma leitura final da página contra `docs/05-COPY-KMEP-ULTRA.md` procurando
   desvio de copy.

---

## 14. O que decidir sozinho, o que perguntar

**Decida sozinho** (e registre a decisão no comentário do componente): nomes de classe e de arquivo,
geometria exata das cenas, quais gestos da LP B reusar em qual seção, se uma cena vira SVG ou
canvas, como o alternador milho/soja de `K13` funciona, se `K2` fica dentro ou abaixo do hero.

**Pergunte antes de fazer** apenas se: (a) a copy canônica e este arquivo se contradisserem em algo
que muda a estrutura; (b) faltar um asset essencial e a ferramenta de geração de imagem não estiver
disponível; (c) alguma seção exigir afirmar algo que as regras da §3 proíbem. Fora isso, construa —
e liste no fim o que ficou pendente e por quê.

**Nunca invente** número, fonte, instituição, dose, registro estadual ou depoimento. Se o dado não
está no canônico, no folheto ou no protótipo, ele não existe.
