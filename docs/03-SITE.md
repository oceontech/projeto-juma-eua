# 03 · O site

Escopo, arquitetura das três páginas, design system e stack. É a planta baixa — a copy final está
implementada em `site/`, com as duas versões (EN real e PT comentada) lado a lado no HTML.

A numeração das seções (`S1–S9`, `K1–K12`, `A1–A12`) é a que existe no protótipo. Mantida para
rastreabilidade.

---

## Objetivo e escopo

**Objetivo primário:** gerar leads qualificados de produtores e agrônomos americanos para o time da
Juma-Agro Fertilizer LLC.

| Métrica | Alvo v1 |
|---|---|
| Conversão visitante → lead | ≥ 2,5% |
| LCP (mobile, 4G) | < 2,5s |
| Lighthouse Performance / A11y | ≥ 90 |
| Páginas indexadas sem conflito com `/en` | 100% |

Sem histórico de tráfego não há baseline; os alvos servem como referência de qualidade técnica, não
como compromisso comercial.

**Dentro da v1:** Home USA · LP KMEP Ultra · LP Aminosan · formulário de lead, header, footer, menu
mobile · mapa dos EUA com reordenação de culturas por geolocalização.

**Fora da v1** (arquitetura preparada, conteúdo depois): página "Sobre" dedicada (coberta pela
seção institucional da Home) · os dois produtos futuros (template já parametrizado) · blog ·
espanhol · dealer locator, e-commerce, calculadora de produtividade.

### O problema do `/en`

O site brasileiro já tem uma versão inteiramente traduzida para inglês em `juma-agro.com.br/en`,
indexada, com as 10 culturas, produtos e depoimentos. O briefing dizia "não é uma cópia traduzida" —
mas é exatamente isso que já está no ar. **O site USA nasce tendo que se diferenciar de uma versão
em inglês existente.**

Ao lançar, o `/en` precisa receber `canonical` apontando para o domínio USA, ou ser despublicado.
Sem isso, os dois competem pelas mesmas queries. É decisão do cliente (pendência **P17**).

---

## Decisões travadas

| Tema | Decisão |
|---|---|
| Conversão | Lead do produtor/agrônomo, atendido pela LLC na Flórida |
| Domínio | Domínio próprio dos EUA, operação digital separada do site BR |
| Resultados de ensaio | Citados em `bu/ac` com `sc/ha` ao lado, sempre com fonte e testemunha |
| Posicionamento | Agro brasileiro como credencial, em seção dedicada na Home |
| Codebase | Repositório novo, Next.js + Tailwind |
| Regionalização | Mapa dos EUA + reordenação de culturas por geolocalização de IP |
| Escopo | 3 páginas |

---

## Design system

### Ritmo visual

Fundo padrão claro. O verde profundo marca os momentos de autoridade institucional (barra de prova,
Brazil story, CTA final). O bloco de prova numérica é sempre um card claro sobre fundo escuro, ou um
bloco escuro sobre fundo claro — **a inversão é o que comunica "aqui vem número"**.

Regra prática: **no máximo três inversões por página.** Mais que isso vira listra.

### Paleta

| Papel | Cor | Uso |
|---|---|---|
| Verde | `#004C26` | Base institucional: fundos de autoridade e tipografia sobre claro |
| Carvão | `#2A2A2A` | Texto e fundo do slot editorial das LPs |
| Oliva | `#3A6023` | Apoio, hover, lado tratado do bloco de prova |
| Lima | `#B7C73E` | **Acento único** — só número em destaque, CTA e estado ativo |
| Areia | `#CCC29D` | Respiro e cards de contraponto |
| Off-white | `#F6FFEE` | Fundo claro padrão |

**Um único acento. Se ele aparecer em mais de três lugares numa tela, está errado.**

### Tipografia

**Space Grotesk** (display) · **Montserrat** (corpo) · **uma mono** (IBM Plex Mono ou equivalente)
exclusiva para o que é verificável: fonte de ensaio, dose, unidade, estágio fenológico, número de
registro.

A mono é a assinatura tipográfica da credibilidade. **Quando o leitor vê mono, sabe que aquilo é
conferível.**

### Formas

Botões pill (`9999px`) · cards raio `0` · títulos grandes e pesados · grids limpos · muito respiro ·
blocos escaneáveis.

### Componentes globais

| Componente | Onde | Observação |
|---|---|---|
| Header | 3 páginas | Logo · Products · Crops · Trials · About · Contact · CTA pill. **`Trials`, nunca `Results`** |
| Footer | 3 páginas | Endereço de Lakeland em destaque tipográfico maior que os links |
| **Bloco de prova** | Home + 2 LPs | Número grande + testemunha ao lado + fonte em mono embaixo. Nunca aparece sem os três |
| Formulário | `S8` completo (9 campos) · `K12`/`A12` reduzido (4 campos) | Um componente, duas variantes. Não construir dois |
| Seletor de cultura | 2 LPs | Barra fina fixa. Troca resultado, janela, dose, ROI e imagem |
| Disclaimer de ensaio | Todo bloco com número | Texto fixo, sem exceção |
| Rodapé legal de produto | 2 LPs | *Always read and follow the label* |

### Fotografia

Documental, nunca publicitária. **Nenhuma foto de lavoura brasileira na versão americana** — solo,
terreno e maquinário denunciam. Enquanto não houver foto americana (**P13**), usar **macro**: folha,
gota, cartão hidrossensível, grão na mão, bico em close. Macro não tem sotaque; paisagem aberta tem.

**Proibido:** mãos segurando muda · gotinha estilizada · céu azul saturado · retrato de banco de
imagens em depoimento · ilustração vetorial de planta.

### O que nunca aparece

Gradiente decorativo · sombra dura · raio de borda em card · ponto de exclamação · superlativo sem
número ao lado · ícone genérico dentro de card de benefício · **duas plantas lado a lado com portes
diferentes**.

A última é regulatória, não estética: planta tratada visivelmente maior é a representação visual de
*plant growth regulator*, e a EPA analisa peça promocional junto com o rótulo.

---

## A escada de CTA

Três degraus, com a faixa de teste no topo. Apoiada no estudo do eFields (Ohio State): produtores
que conduziram o próprio ensaio adotaram mais do que os que apenas receberam o dado.

| Degrau | CTA | Para quem | Trava |
|---|---|---|---|
| 1 — primário | **Run a trial strip on your own acres. We supply the product.** | Quem já se convenceu o suficiente para testar | Decisão comercial da Juma: quem banca o produto |
| 2 — secundário | **Get the label and rate sheet** | Quem quer avaliar antes de falar com alguém | P1, P3, P4 |
| 3 — terciário | **Talk to an agronomist** | Quem prefere conversa | P11 — só se o time americano for agronômico |

**Por que a faixa de teste resolve mais de um problema:** é a resposta honesta para *"quarenta anos e
nenhum dado americano?"* — em vez de desviar, começa a produzir o dado · funciona com qualquer
modelo de canal · é de baixo risco e mensurável por quem decide · **não depende de nenhuma pendência
regulatória**, porque oferecer produto para teste não é claim.

Se a Juma não bancar o produto, o degrau 1 cai e a estrutura sobe os degraus 2 e 3 sem redesenho —
só troca o texto de dois blocos (`S8` e `_12`).

---

## Home USA — 8 seções em 4 atos

**A tarefa:** em dez segundos, tirar da cabeça do visitante a ideia de que ele está num site
brasileiro traduzido; depois, distribuir para as duas LPs e capturar o lead.

**A estratégia:** não esconder o Brasil — usá-lo no primeiro parágrafo, como credencial técnica
verificável. Quem esconde parece traduzido; quem explica parece deliberado.

### Ato I — Quem somos e por que acreditar

**`S1` Hero** — *fundo escuro ou foto escurecida*
Eyebrow com o endereço americano: `JUMA-AGRO FERTILIZER LLC · LAKELAND, FLORIDA` — a resposta mais
rápida a "isso é estrangeiro?", e custa uma linha. Headline: *Proven where the growing season never
stops.* Subheadline com as duas/três safras, a ausência de inverno, 38 anos de ensaio com testemunha.
CTA primário (faixa de teste) + secundário (`See the trial data`).
**Sem vídeo em loop** — custa o LCP, que está nos critérios de aceite. Nada trava esta seção.

**`S2` Barra de prova** — *fundo verde profundo, tipografia pura, sem ícone*
Onde o cético decide se continua rolando. `221.3 vs 212.3 bu/ac` (milho, Rehagro) · `38 years` de
ensaios com fonte nomeada · `In-house lab since 1988` · slot reservado para o ensaio de soja com
Aminosan, liberado quando chegar a testemunha (**P9**).
**Se travar:** publica com três números. Três sólidos valem mais que quatro com um frágil.

### Ato II — A dor e a bifurcação

**`S3` O problema** — *fundo branco, muito respiro*
*The yield you lost isn't on the soil test.* Você corrigiu a fertilidade, seguiu o programa, e o
estande parecia carregar mais do que o monitor mostrou. O que fica no meio é o momento. Fecho: essa
janela é onde os dois produtos atuam. Escrita para o agrônomo, que já sabe que a análise de solo
mede disponibilidade, não absorção.

**`S4` Produtos** — *fundo cinza claro, cards brancos, raio 0*
Bifurcação, não catálogo. *Two products. One job each.* Uma empresa com 13 produtos que leva dois
para os EUA está fazendo uma escolha — dizer isso em voz alta soa mais confiante que esconder o
catálogo. Uma linha de benefício por card, sem lista.
**Asset:** embalagem com rótulo americano (**P12**). Sem ele, renderização tipográfica do nome —
**nunca o frasco com rótulo em português numa página em inglês.**

### Ato III — Relevância e credibilidade

**`S5` Culturas + mapa** — *fundo branco, mapa em traço fino*
*Find your acres.* Mapa dos EUA com o estado detectado por IP em destaque e o grid de culturas
reordenado. Todas as culturas sempre aparecem — só a ordem muda. Microcopy: `Showing crops for
Iowa. Not in Iowa? Change`.
**Bloqueio de conteúdo (P6):** a lista de culturas não pode ser publicada a partir das 10 culturas
brasileiras — ver `02-MERCADO-USA.md`.
**Se travar:** abre com milho, soja e algodão apenas, e o restante vira captura de lead (`Tell us
what you grow`). O mapa continua funcionando.

**`S6` Brazil is the credential** — *fundo verde profundo, coluna estreita de leitura*
O coração do posicionamento, em três movimentos: **1988, Mogi Guaçu** (Matino via produtores
gastando mais e colhendo menos; criou o Aminosan; *a empresa veio depois do produto*) → **por que a
severidade tropical importa** (doze meses de pressão, veranico no enchimento; *um produto que
aguenta ali foi testado sob severidade que o Corn Belt não impõe*) → **o fecho**: *We're not asking
you to overlook where this came from. We're asking you to look at it.* Assinatura: *Together we feed
the world.*
**Asset:** foto de arquivo do fundador ou da fábrica (**P26**). Uma foto real de 1988, mesmo com
qualidade técnica baixa, vale mais que banco de imagens — a imperfeição é prova de autenticidade.
**Atenção:** a cronologia não fecha nos documentos. Confirmar antes de publicar qualquer data.

**`S7` O método** — *fundo branco ou cinza, parece documento, sem animação*
*Every number here names its check.* Publicamos o número tratado, o da testemunha, onde o ensaio
rodou e quem o conduziu. **Look them up.** Faixa com as fontes em tipografia. Bloco da operação
americana: razão social, endereço de Lakeland, o que a LLC entrega.
**Se travar (P19):** recua para `field trial, Brazil` com a fonte oferecida por e-mail. Perde muita
força — é a nomeação que faz o argumento.
**Se P11 disser que o time é só comercial:** cortar `agronomic support`. Não prometer agrônomo que
não existe.

### Ato IV — Conversão

**`S8` A faixa de teste** — *fundo verde profundo, formulário em card branco*
*Run a trial strip on your own acres. We supply the product.* Escolha um talhão, deixe uma faixa
testemunha ao lado, levamos o produto e voltamos na colheita com você. Retorno prometido: dados de
ensaio da sua cultura, o rótulo e as doses em `fl oz/acre`, normalmente em um dia útil.
Formulário de 9 campos (teto): nome · fazenda · estado *(pré-preenchido pela geolocalização)* ·
cultura principal · acres · e-mail · telefone · o que quer resolver · checkbox de ligação do
agrônomo. Consentimento com finalidade declarada (CCPA). Mensagem de erro **com caminho alternativo**
— erro sem saída perde o lead.

**`S9` Footer**
Endereço americano em destaque · vínculo com a matriz (*A subsidiary of Juma Agro — family-run in
Mogi Guaçu, Brazil, since 1988*) · quatro colunas de navegação · disclaimer global · *Always read and
follow the label* · copyright.
Ícone de rede social **só se houver conta americana**. Apontar para o Instagram brasileiro em
português contradiz a página inteira.

---

## Template de LP — 12 seções em 4 atos

Mesmo template para os dois produtos, parametrizado. Os dois produtos futuros entram sem redesenho.

**A lógica:** o visitante precisa se reconhecer antes de entender, entender antes de acreditar, e
acreditar antes de conseguir operar.

| Ato | Seções | O que faz |
|---|---|---|
| **I — Reconhecimento** | `_1` `_2` `_3` | Prometer, situar na cultura dele, nomear a dor |
| **II — Mecanismo** | `_4` `_5` | Explicar como funciona e o que muda na prática |
| **III — Prova** | `_6` `_7` `_8` | O número, a conta e a credencial |
| **IV — Operação e decisão** | `_9` `_10` `_11` `_12` | Como usar, o que tem dentro, as objeções, o pedido |

**`_1` Hero** — eyebrow com categoria e compatibilidade de tanque · headline de promessa ·
subheadline com o argumento econômico · **linha de prova ancorada logo abaixo do CTA**, para o
cético encontrar o dado sem rolar. Menos alto que o hero da Home.

**`_2` Seletor de cultura** — barra fina fixa. Estado padrão assume o motivo em voz alta: *Corn —
the crop with the trial data we can show you.* **Técnico:** altura fixa reservada nos blocos que
mudam, senão a página pula e prejudica o CLS.

**`_3` O problema** — a dor específica, reconhecível em uma leitura. Conversa técnica, não caixa de
marketing. **Asset:** macro. Evitar planta doente ou murcha, que sugere claim de proteção.

**`_4` Como funciona** — mecanismo, com a animação principal. **Regra de redundância:** toda
informação que a animação transmite precisa existir também em texto na mesma seção — parte do
tráfego rural americano navega em conexão instável.

**`_5` O que muda na prática** — quatro cards curtos, cada um respondendo a uma pergunta prática do
produtor, não a um atributo do produto. Sem ícone. O quarto card é sempre o número.

**`_6` A prova** — *fundo verde profundo, o clímax visual*. Dois níveis de leitura: **o número**
(split 50/50, `UNTREATED CHECK` à esquerda, produto à direita, diferença destacada) e **a tabela**
(cultura, local, tratado, testemunha, diferença, fonte, ano — unidade americana primeiro, brasileira
ao lado).
**Restrição inegociável:** nunca representar como duas plantas de portes diferentes. O antes/depois
é de grão colhido e número medido. Sem foto real de ensaio, tipografia pura funciona melhor —
inventar a imagem do ensaio contradiz a seção inteira.

**`_7` A conta por acre** — ganho e custo lado a lado, em três cenários de preço da commodity.
Publicar o próprio custo ao lado do ganho é incomum na categoria, e é por isso que funciona.
**Condição de publicação:** sem **P8**, remover a seção inteira. **Meia conta é pior que nenhuma.**

**`_8` Slot editorial** — cada produto conta a sua credencial própria. É história, não venda.

**`_9` Quando entra** — janela e dose em nomenclatura americana obrigatória (`V4–V6`, `VT`, `R1`) e
dose em `fl oz/acre`. Estágio em nomenclatura brasileira numa página em inglês denuncia a tradução.
**Se travar (P4):** publica só com estágios, e o CTA vira `Get the rate sheet`.

**`_10` Ficha técnica** — Guaranteed Analysis · derived from · densidade · pH · embalagens ·
registros estaduais · compatibilidade e ordem de mistura · SDS e rótulo em PDF. É o bloco que um
dealer procura primeiro.
**Armadilha de localização:** embalagem **não pode** aparecer em litros. `10L/20L` são brasileiras.
Nos EUA é `2.5 gal case`, `30 gal drum`, `275 gal tote`. Manter métrico sinaliza produto importado
sem operação local.

**`_11` Objeções** — acordeão, cinco a sete itens, sempre incluindo: compatibilidade e ordem de
mistura · registro no estado do visitante · **a diferença para o produto barato equivalente** (é a
primeira objeção de um agrônomo de retail) · *"seus ensaios são do Brasil, por que isso me
importa?"* — **a resposta mais importante da página**: a testemunha brasileira (212,3 bu/ac em
milho) coincide quase exatamente com a média nacional americana, e o ensaio não rodou em condição
mais fácil que a dele, rodou em condição mais difícil · *"vocês têm dado americano?"* — se não,
dizer com todas as letras e oferecer a faixa de teste. Desviar é pior que responder.

**`_12` CTA final** — formulário reduzido de 4 campos. Enumerar o que chega no e-mail — rótulo,
doses em `fl oz/acre`, relatório do ensaio — é mais concreto que "fale conosco".

---

## LP KMEP Ultra®

**Eixo recomendado:** B (adjuvante de calda) com A (potássio foliar) embutido — ver
`02-MERCADO-USA.md`. **Cultura padrão do seletor:** milho, é onde está o ensaio.

| # | O que esta página diz |
|---|---|
| `K1` | *Your insecticide isn't failing. It isn't getting there.* Parceiro de tanque que melhora a deposição. Linha de prova ancorada: `221.3 vs 212.3 bu/ac · Rehagro, Brazil` |
| `K3` | Quando o dossel fecha, o terço inferior vira outra lavoura — a parte onde a calda chega por último, ou não chega |
| `K4` | Três passos em linguagem regulatoriamente segura: menor tensão superficial → melhor deposição → mais fundo no dossel |
| `K5` | Entra no tanque que você já está enchendo · sem passada extra, sem diesel, sem nova janela de clima · um número que você pode conferir |
| `K6` | `221.3 vs 212.3 bu/ac` · milho · Rehagro, Brasil · +8,9 bu/ac (+4,2%). **Falta o ano do ensaio** |
| `K7` | A US$ 4,30/bu, 8,9 bu/ac valem US$ 38,27/acre. Custo na dose de rótulo: **[P8]**. A diferença entre os dois números é a decisão inteira |
| `K8` | A cunha brasileira: dez anos com a cigarrinha, que chegou a 185 condados em 16 estados em 2025. **Citar a estatística pública é seguro; vincular o produto ao controle da praga é HOLD** |
| `K9` | Milho V4–V6 e na aplicação anterior ao enchimento. Soja R1–R3. Dose **[P4]** |
| `K11` | Posso misturar? · queima folha em calor alto? · registrado no meu estado? **[P10]** · **qual a diferença para um 0-0-25 ou KTS?** ← eixo B responde, eixo A não |

**Trilha B (desalojante) permanece escrita e engavetada.** Três blocos trocam de conteúdo se a
liberação escrita vier: `K1`, `K3`, `K4`. O layout já está desenhado. A animação `AN-08` **não deve
ser produzida** antes da liberação — produzir o ativo aumenta a chance de ele vazar para produção.

---

## LP Aminosan®

**Status:** carro-chefe e o de comunicação mais exposta. As frases hoje no ar em `/en` (*faster
recovery*, *the plant grows again after stress*) são exatamente as construções que a EPA classifica
como claim de estimulação.

**Princípio de redação:** descrever o que o produto **entrega**, nunca o que ele **provoca** na
planta. Composição é factual e verificável no rótulo; o que a planta faz com ela depois é fisiologia,
e é ali que a linha da FIFRA passa.

**Cultura padrão do seletor:** soja, onde estão os dois ensaios.

| # | O que esta página diz |
|---|---|
| `A1` | *The plant can build amino acids. Or you can hand it the finished ones.* Foliar de aminoácidos livres de origem vegetal por fermentação enzimática. *Está em campo há mais tempo que a empresa que o fabrica* |
| `A3` | *Nitrogen is not an amino acid.* Nitrato é matéria-prima, não produto acabado. Antes de virar proteína, a planta precisa reduzir, aminar e montar — cadeia que consome carbono e energia produzidos para outra coisa |
| `A4` | *Five steps, or one.* A cadeia `NO₃⁻ → NO₂⁻ → NH₄⁺ → glutamato → aminoácido` contra a entrega foliar direta. Tabela de três linhas: origem (vegetal × hidrolisado animal), processo (fermentação enzimática × hidrólise ácida), forma (livres × cadeias peptídicas). Coluna da direita **sempre genérica**, nunca nomear concorrente, e "often" em vez de "always" |
| `A5` | Quatro cards **de entrega, não de efeito** |
| `A6` | **Bloqueada por P9.** Estado provisório já escrito: *We're not publishing the numbers until we can put the untreated check beside them, because that's the rule for every number on this site.* Aplicar a própria regra em público, mesmo quando custa caro, é a prova mais forte de que a regra é real |
| `A8` | *Older than the company that makes it.* Matino formulou o Aminosan antes de existir empresa para vendê-lo; a demanda construiu o negócio |
| `A9` | Soja de V2–V3 aos reprodutivos. Milho V2–V8. Dose **[P4]** |
| `A10` | **O percentual de aminoácidos livres é o número mais importante da tabela** — sustenta a comparação em `A4`. Sem ele, a tabela comparativa sai |
| `A11` | Diferença para um hidrolisado? · é OMRI listed? · quarenta anos e nenhum dado americano? · **o que ele faz pela minha lavoura?** ← a pergunta em que a tentação de claim é máxima; a resposta devolve à prova, nunca ao efeito |

---

## Geolocalização e priorização de culturas

Entrega personalização sem custo de conteúdo: reordena uma lista existente em vez de exigir copy
para 50 estados.

1. Mapa dos EUA com destaque no estado do visitante.
2. **Todas as culturas sempre aparecem.** Só a ordem muda.
3. Fora dos EUA ou sem detecção → ordem padrão nacional.
4. Controle discreto `Not in Iowa? Change` para corrigir detecção errada.
5. Override por querystring `?state=IA` para demo e homologação.

**Implementação:** header `x-vercel-ip-country-region` na Vercel — sem serviço externo, sem latência
adicional. Shell da página estático; só a seção de culturas resolve por request. Tabela
`estado → ranking de culturas` como dado estático versionado.

| Risco | Mitigação |
|---|---|
| Starlink, VPN e IP móvel erram estado — comuns em área rural | Controle "Change" visível + fallback nacional |
| Juma testa do Brasil e reporta como bug | Override `?state=` + comunicar no handoff |
| SEO / cloaking | HTML idêntico, só a ordem muda. `<h2>` e texto estáveis |
| IP como dado pessoal sob CCPA | Processado em request, não armazenado. Registrar na privacy policy |

> **A tabela estado→cultura precisa ser refeita.** A versão original foi montada sobre as 10
> culturas brasileiras. Ver `02-MERCADO-USA.md` e a pendência **P6**.

---

## Stack

- **Next.js** (App Router) + TypeScript + **Tailwind**
- Deploy **Vercel**, repositório novo
- Fontes locais via `next/font` · imagens `next/image` em AVIF/WebP
- Animação: **GSAP + ScrollTrigger**, via `@gsap/react`; **sem biblioteca 3D**
  (a v1 deste doc previa Motion — trocado por GSAP em 02/09/2026, a pedido do time.
  As regras de uso estão em [`../web/README.md`](../web/README.md))
- Conteúdo em arquivos TypeScript tipados — **sem CMS na v1** (3 páginas, edição rara)
- Formulário: Server Action + envio de e-mail, **desacoplado do destino final**

### SEO e analytics

`hreflang` entre `pt-BR` e `en-US` · metadata por página, Open Graph, `sitemap.xml`, `robots.txt` ·
Schema.org `Organization` + `Product` nas LPs · Vercel Analytics + GA4, com evento de conversão no
submit do formulário.

---

## Critérios de aceite

**Funcional** — três páginas navegáveis em desktop, tablet e mobile · formulário envia e notifica ·
geolocalização reordena culturas e o fallback funciona fora dos EUA · override `?state=XX` funciona ·
todos os CTAs levam ao destino correto.

**Conteúdo** — todo número tem fonte, testemunha e unidade dupla · disclaimer em todo bloco de
resultado · Guaranteed Analysis publicado nos dois produtos · copy do KMEP validada pelo regulatório.

**Técnico** — Lighthouse ≥ 90 nas quatro categorias · LCP < 2,5s em mobile 4G · sem erro de console
em produção · `sitemap.xml`, `robots.txt`, OG e schema no ar · `canonical`/`hreflang` resolvendo o
conflito com `/en`.

**Verificação:** `npm run build` sem erro nem warning de tipo · Lighthouse nas três páginas, mobile e
desktop · geolocalização com `?state=IA`, `?state=FL`, `?state=CA` e acesso real do Brasil · submit
real do formulário com confirmação no destino · navegação por teclado e leitor de tela · Chrome,
Safari, Firefox, Edge, iOS Safari e Chrome Android · validar OG cards no LinkedIn e WhatsApp.

---

## Ordem de produção

**O caminho crítico é o design, não o código.** Não serializar: fechar a Home primeiro e implementar
enquanto as LPs são desenhadas. Isso exige tokens e componentes definidos **no dia 1**, não no fim.

1. **Design system primeiro.** Tokens de cor, escala tipográfica com a mono, botão pill, card raio 0,
   campo de formulário, filete de seção. Sem isso o time serializa.
2. **Os dois componentes que aparecem em toda página:** o bloco de prova e o formulário. São eles que
   definem o resto.
3. **Home completa**, desktop e mobile. Sete das oito seções estão livres para publicar.
4. **Template de LP**, desenhado uma vez e aplicado aos dois produtos.
5. **`AN-03` primeiro entre as animações** — a mais barata (tipografia animada), a de maior impacto,
   e não depende de nada.
6. **`AN-08` não é produzida** enquanto a validação regulatória não voltar por escrito.

**Telas a desenhar:** 3 páginas × 2 breakpoints = 6, mais os estados do seletor de cultura (4 por
LP), o estado bloqueado de `A6`, os estados do formulário (padrão, carregando, sucesso, erro) e o
menu mobile.

> **Antes de qualquer coisa ir ao ar:** a copy inteira passa pelo responsável regulatório da LLC,
> **inclusive as seções marcadas como livres**. A marcação destes documentos é análise da Oceon a
> partir de pesquisa pública. Quem decide onde fica a linha é quem responde pela FIFRA na
> Juma-Agro Fertilizer LLC.
