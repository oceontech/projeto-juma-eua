# Estrutura do site — Juma-Agro USA

**Versão:** 1.0 · 11/08/2026 · Oceon Desenvolvimento Digital
**Para:** protótipo visual no Figma (Pedro) e montagem de conteúdo (Davi)
**Compila:** `manual-site-juma-agro-eua.html` (11/08) · `Juma-Agro-USA-Estrutura-e-Copy.docx` (10/08) · `DEFINICOES-MERCADO-USA.md` (09/08) · `PRD-Juma-Agro-USA.md` (07/08) · `juma-agro-empresa-e-produtos.md` · protótipo `site/`

> **Versão de leitura:** `manual-estrutura-site.html` — mesmo conteúdo em formato navegável, no estilo do manual de criação. É o documento a abrir junto do Figma. Este arquivo em Markdown é a versão versionada, para diff.

---

## O que este documento é

Um mapa único das três páginas: quais seções existem, em que ordem, o que cada uma diz e o que acontece com ela se a informação que a alimenta não chegar. Não é copy — a copy está no `Estrutura-e-Copy.docx` e continua válida. É a planta baixa.

Ele existe porque os cinco documentos anteriores foram escritos em dias diferentes e discordam entre si em quatro pontos que atingem o desenho: paleta, tipografia, CTA principal e o eixo de posicionamento do KMEP Ultra. As discordâncias estão resolvidas na seção 1, com o motivo de cada escolha.

**A numeração é a que já existe** (`S0–S9`, `K1–K12`, `A1–A12`). Nenhuma seção foi renumerada; quatro mudaram de conteúdo e estão marcadas com o de/para. Isso mantém a rastreabilidade com o protótipo HTML e com o documento de copy.

---

## 1. As cinco decisões que a estrutura assume

Cada uma resolve um conflito real entre os documentos. Se alguma for revertida, o impacto no desenho está declarado.

### 1.1 Ritmo visual: escuro documental × claro de dado

O manual do dia 11 propõe alternância entre seções escuras (o campo, o problema, a operação) e blocos claros (a prova). O PRD e o Editorial propõem base branca com verde profundo. **As duas coisas cabem juntas** e a fusão é o que dá assinatura ao site:

> Fundo padrão claro. O verde profundo `#004C26` marca os momentos de autoridade institucional (barra de prova, Brazil story, CTA final). O bloco de prova numérica é sempre um card claro sobre fundo escuro, ou um bloco escuro sobre fundo claro — **a inversão é o que comunica "aqui vem número"**.

Regra prática: cada página tem no máximo três inversões. Mais que isso vira listra.

### 1.2 Paleta: mantém a marca, descarta o laranja

O manual propõe uma paleta nova (`soil #16130F` / `beacon #E2571C`). O PRD e o Editorial mantêm a herança da marca. **Decisão: manter a marca.**

| Papel | Cor | Uso |
|---|---|---|
| Verde | `#004C26` | Base institucional: fundos de autoridade e tipografia sobre claro |
| Carvão | `#2A2A2A` | Texto e o fundo do slot editorial das LPs |
| Oliva | `#3A6023` | Apoio, hover, lado tratado do bloco de prova |
| Lima | `#B7C73E` | **Acento único** — só número em destaque, CTA e estado ativo |
| Areia | `#CCC29D` | Respiro e cards de contraponto |
| Off-white | `#F6FFEE` | Fundo claro padrão |

O argumento do manual continua valendo integralmente: **um único acento, e se ele aparecer em mais de três lugares numa tela, está errado.** O que não vale é trocar a identidade da empresa a 19 dias da entrega. O alerta do manual contra "verde-menta claro de hortifrúti" não atinge o `#004C26`, que é escuro e sério — atinge o verde-claro do panfleto brasileiro, que está descartado.

### 1.3 Tipografia: dupla da marca + mono para dado

Mantém **Space Grotesk** (display) e **Montserrat** (corpo), como o PRD decidiu. **Acrescenta uma terceira**: uma mono (IBM Plex Mono ou equivalente) exclusiva para o que é verificável — fonte de ensaio, dose, unidade, estágio fenológico, número de registro.

Essa é a melhor ideia do manual e custa nada: a mono vira a assinatura tipográfica da credibilidade. Quando o leitor vê mono, sabe que aquilo é conferível.

### 1.4 CTA principal: a faixa de teste vem antes da conversa

O documento de copy usa `Talk to an agronomist`. O manual propõe `Run a trial strip. We supply the product.`, apoiado no estudo do eFields (Ohio State, *Agronomy Journal*): produtores que conduziram o próprio ensaio adotaram mais do que os que apenas receberam o dado.

**Decisão: escada de três degraus, com a faixa de teste no topo.**

| Degrau | CTA | Para quem | Trava |
|---|---|---|---|
| 1 — primário | **Run a trial strip on your own acres. We supply the product.** | Quem já se convenceu o suficiente para testar | Decisão comercial da Juma: quem banca o produto |
| 2 — secundário | **Get the label and rate sheet** | Quem quer avaliar antes de falar com alguém | P1, P3, P4 |
| 3 — terciário | **Talk to an agronomist** | Quem prefere conversa | P11 — só se o time americano for agronômico |

Por que a faixa de teste resolve mais de um problema de uma vez:

- É a resposta honesta para *"quarenta anos e nenhum dado americano?"* (P20) — em vez de desviar, começa a produzir o dado.
- Funciona com qualquer modelo de canal (P5/Bloco G): produtor direto, revenda ou retail, todos aceitam uma faixa com testemunha ao lado.
- É de baixo risco para quem decide e mensurável por ele mesmo — que é exatamente o que a pesquisa de comportamento aponta como preditor de adoção.
- Não depende de nenhuma pendência regulatória: oferecer produto para teste não é claim.

**O que precisa ser confirmado com a Juma antes de desenhar:** a LLC banca o produto de uma faixa de teste? Quantos acres, quantos produtores por safra, quem acompanha a colheita? Se a resposta for não, o degrau 1 cai e a estrutura sobe os degraus 2 e 3 sem redesenho — só troca o texto de dois blocos (`S8` e `_12`).

### 1.5 KMEP Ultra: três eixos possíveis, um recomendado

Este é o ponto mais consequente do documento. O `Estrutura-e-Copy` escreveu duas trilhas; o manual do dia 11 introduziu, sem nomear, uma terceira — e ela é melhor que as duas.

| | Eixo A · Potássio foliar | **Eixo B · Adjuvante de calda** | Eixo C · Desalojante |
|---|---|---|---|
| O que o produto é | Fonte de potássio aplicada junto | Parceiro de tanque que melhora deposição e cobertura | Produto que altera onde o inseto está |
| Frase-núcleo | *Potassium the leaf can use, in a pass you're already making* | *Coverage is the whole job.* | *The one you didn't reach is the one that comes back* |
| Risco FIFRA | Nenhum | Baixo — é a categoria em que Helena e WinField operam | Alto — precedente de US$ 437 mil |
| Substanciação exigida | Guaranteed Analysis (P3) | **Dado de tensão superficial ou deposição** (pendência nova) | Registro EPA |
| Força comercial | Fraca — compete com 0-0-25 e KTS, que são baratos | Forte — categoria reconhecida, sem competir por preço de commodity | Máxima, indisponível |

**Recomendação: escrever a LP no eixo B, com o eixo A embutido como benefício secundário.** "Um adjuvante de calda que, de quebra, entrega potássio foliar" é uma página que se sustenta; "mais uma fonte de potássio" recebe a objeção do 0-0-25 na primeira leitura de um agrônomo de retail — o próprio documento de copy já previa essa objeção em `K11` e não tinha resposta para ela.

**O registro do eixo B — refinamento em relação ao manual do dia 11.** O manual propunha
*"Your insecticide isn't failing. It isn't getting there."* A frase é excelente, mas nomeia o
desempenho do defensivo, e "improves insecticide performance" está na lista de reformulação
obrigatória do filtro FIFRA. O que Helena e WinField publicam fala do **comportamento da calda** —
`surface tension`, `deposition`, `canopy penetration` — nunca da eficácia do pesticida. É esse o
registro que foi para o ar. A headline afiada fica registrada na nota da seção `K1` como alternativa,
condicionada à leitura do regulatório.

**O que destrava o eixo B:** um dado de deposição, cobertura ou tensão superficial do KMEP Ultra. **A Juma provavelmente já tem** — o NITEC/UNESP fez túnel de vento para a Linha Redutan e a parceria do Projeto DESATA com a UENP é justamente em tecnologia de aplicação. Se existir o equivalente para o KMEP, o eixo B nasce ancorado em universidade pública, que é a moeda de credibilidade mais forte do mercado americano.

> **Pedido novo à Juma (P31):** existe ensaio de deposição, cobertura, espectro de gotas ou tensão superficial do KMEP Ultra, no NITEC/UNESP ou em qualquer outro laboratório? Cartão hidrossensível serve. É o dado que define o posicionamento do produto nos EUA.

Se P31 voltar vazio, a página publica no eixo A e o slot `K8` muda de conteúdo. Nenhum bloco é redesenhado.

---

## 2. O sistema, em uma página

Antes das seções, o que precisa existir como componente antes de qualquer tela ser desenhada.

### Componentes globais

| Componente | Onde | Observação |
|---|---|---|
| Header | 3 páginas | Logo · Products · Crops · Trials · About · Contact · CTA pill. `Trials`, nunca `Results` |
| Footer | 3 páginas | Endereço de Lakeland em destaque tipográfico maior que os links |
| **Bloco de prova** | Home + 2 LPs | Card de assinatura. Número grande + testemunha ao lado + fonte em mono embaixo. Nunca aparece sem os três |
| Formulário | `S8` completo (9 campos) · `K12`/`A12` reduzido (4 campos) | Um componente, duas variantes. Não construir dois |
| Seletor de cultura | 2 LPs | Barra fina fixa. Troca resultado, janela, dose, ROI e imagem |
| Disclaimer de ensaio | Todo bloco com número | Texto fixo, sem exceção |
| Rodapé legal de produto | 2 LPs | *Always read and follow the label* |

### As três regras do bloco de prova

1. Sempre tem a testemunha ao lado do número. `221.3 vs 212.3 bu/ac`, nunca `+8.9` sozinho.
2. Sempre tem a fonte impressa embaixo, em mono, com local e ano.
3. Dado brasileiro é identificado como brasileiro. Esconder a origem destrói mais credibilidade do que a origem custa.

### Fotografia

Documental, nunca publicitária. Nenhuma foto de lavoura brasileira na versão americana — solo, terreno e maquinário denunciam. Enquanto não houver foto americana (P13), **usar macro**: folha, gota, cartão hidrossensível, grão na mão, bico em close. Macro não tem sotaque; paisagem aberta tem.

Proibido: mãos segurando muda, gotinha estilizada, céu azul saturado, retrato de banco de imagens em depoimento, ilustração vetorial de planta.

### O que nunca aparece

Gradiente decorativo · sombra dura · raio de borda em card (o sistema é raio 0) · ponto de exclamação · superlativo sem número ao lado · ícone genérico dentro de card de benefício · duas plantas lado a lado com portes diferentes.

A última é regulatória, não estética: imagem de planta tratada visivelmente maior é a representação visual de *plant growth regulator*, e a EPA analisa peça promocional junto com rótulo.

---

## 3. Home USA — 8 seções em 4 atos

**A tarefa da Home:** em dez segundos, tirar da cabeça do visitante a ideia de que ele está num site brasileiro traduzido; depois, distribuir para as duas LPs e capturar o lead.

**A estratégia:** não esconder o Brasil — usá-lo no primeiro parágrafo, como credencial técnica verificável. Quem esconde parece traduzido; quem explica parece deliberado.

### Ato I — Quem somos e por que acreditar (S1, S2)

#### `S1` Hero — **fundo escuro ou foto escurecida**

**Função:** dez segundos para dizer quem somos, onde estamos e por que o Brasil importa.

**O que fala:**
- Eyebrow com o endereço americano: `JUMA-AGRO FERTILIZER LLC · LAKELAND, FLORIDA`. É a resposta mais rápida à pergunta "isso é estrangeiro?" e custa uma linha.
- Headline: *Proven where the growing season never stops.*
- Subheadline: no Brasil se tiram duas e três safras do mesmo talhão; não há inverno para zerar a lavoura; 38 anos de ensaio com a testemunha ao lado; agora disponível para o produtor americano.
- CTA primário (faixa de teste) + CTA secundário (`See the trial data`).

**Asset:** foto de campo americano em plano aberto (P13). Sem ela, composição tipográfica com bloco de cor — melhor que banco de imagens genérico. **Sem vídeo em loop:** custa o LCP, que está nos critérios de aceite.

**Se travar:** nada trava. Copy livre para publicar.

#### `S2` Barra de prova — **fundo verde profundo, tipografia pura, sem ícone**

**Função:** é onde o cético decide se continua rolando. Três números, cada um com a testemunha e a fonte.

**O que fala:**
1. `221.3 vs 212.3 bu/ac` — milho, tratado vs testemunha. Ensaio Rehagro, Brasil.
2. `38 years` — de ensaios de campo, todos com fonte nomeada.
3. `In-house lab since 1988` — todo lote testado antes de sair.
4. *(slot reservado)* — ensaio de soja com Aminosan, liberado quando chegar a testemunha (P9).

Disclaimer obrigatório fechando a faixa.

**Se travar:** publica com três números. Três sólidos valem mais que quatro com um frágil. O ano do ensaio Rehagro não consta em nenhum documento — **cobrar junto com P21**.

### Ato II — A dor e a bifurcação (S3, S4)

#### `S3` O problema — **fundo branco, muito respiro**

**Função:** nomear a dor antes de mostrar produto. Se o visitante não se reconhecer aqui, o resto é catálogo.

**O que fala:** *The yield you lost isn't on the soil test.* Você corrigiu a fertilidade, seguiu o programa, e o estande parecia carregar mais do que o monitor mostrou. O que fica no meio é o momento — se a planta teve o que precisava nas duas ou três semanas que definem a produtividade, não na média da safra. Fecho: **essa janela é onde os dois produtos atuam.**

Construída para o agrônomo, não para o leigo: ele sabe que a análise de solo mede disponibilidade, não absorção.

**Asset:** detalhe — folha, grão na mão, tela do monitor de colheita. Nunca a foto ampla de campo, já usada no hero.

#### `S4` Produtos — **fundo cinza claro, cards brancos, raio 0**

**Função:** bifurcação, não catálogo. Uma linha por produto, um clique.

**O que fala:** *Two products. One job each.* Uma empresa com 13 produtos que leva dois para os EUA está fazendo uma escolha — dizer isso em voz alta soa mais confiante do que esconder o catálogo.

| Card | Kicker | Linha de benefício |
|---|---|---|
| KMEP Ultra® | `SPRAY ADJUVANT · FOLIAR POTASSIUM` | Mais do ativo que você já pagou chegando onde a praga está — e potássio de quebra *(eixo B)* |
| Aminosan® | `FREE AMINO ACIDS` | Os blocos de construção, entregues prontos. Em campo há 40 anos |

**Asset:** embalagem com rótulo americano (P12). Sem ele, **renderização tipográfica do nome** — nunca o frasco com rótulo em português numa página em inglês.

**Restrição:** resistir a listar benefícios no card. Uma linha por produto força a escolha e aumenta o clique para a LP, que é onde a venda acontece.

### Ato III — Relevância e credibilidade (S5, S6, S7)

#### `S5` Culturas + mapa — **fundo branco, mapa em traço fino**

**Função:** responder "isso serve para os meus acres?" antes de pedir qualquer coisa.

**O que fala:** *Find your acres.* Mapa dos EUA com o estado detectado por IP em destaque, e o grid de culturas reordenado para aquele estado. Todas as culturas sempre aparecem — só a ordem muda. Microcopy visível: `Showing crops for Iowa. Not in Iowa? Change`.

**Bloqueio de conteúdo (P6):** a lista do Anexo A do PRD **não pode ser publicada como está** — foi montada sobre as 10 culturas brasileiras. Café e cana quase não existem nos EUA; o pecuarista americano não usa foliar; e faltam amêndoa, morango, uva, folhosas e amendoim, que é onde o foliar de alto valor se vende. A pergunta certa não é quais das dez levar, e sim **em quais culturas americanas cada produto tem eficácia confirmada**.

**Se travar:** a seção abre com milho, soja e algodão apenas, e o restante vira captura de lead (`Tell us what you grow`). O mapa continua funcionando.

**Técnico:** SVG inline por estado, sem biblioteca. HTML idêntico em todos os estados — só a ordem muda, o que mantém a seção fora de qualquer suspeita de cloaking.

#### `S6` Brazil is the credential — **fundo verde profundo, coluna estreita de leitura**

**Função:** transformar a origem de ressalva em credencial. É o coração do posicionamento.

**O que fala, em três movimentos:**
1. **1988, Mogi Guaçu.** Julio Matino via produtores gastando mais com adubo e colhendo menos. Defendia que o problema estava no metabolismo da planta, e criou o Aminosan para resolver. *A empresa veio depois do produto.*
2. **Por que a severidade tropical importa.** O Brasil produz mais soja que os EUA e é o único grande produtor que tira duas e três safras do mesmo talhão no ano. Doze meses de pressão, estresse térmico como rotina, veranico no meio do enchimento. *Um produto que aguenta ali foi testado sob severidade que o Corn Belt não impõe.*
3. **O fecho.** *We're not asking you to overlook where this came from. We're asking you to look at it.*

Assinatura: *Together we feed the world.*

**Asset:** foto de arquivo do fundador ou da fábrica (P26). Uma foto real de 1988, mesmo com qualidade técnica baixa, vale mais que qualquer banco de imagens — a imperfeição é prova de autenticidade.

**Atenção:** a cronologia não fecha nos documentos (fundação em 1988 + "mais de 40 anos de Aminosan"). Confirmar antes de publicar qualquer data.

#### `S7` O método — **fundo branco ou cinza, parece documento, sem animação**

**Função:** sustentar todos os números do site. É a seção que separa esta página de um site genérico de biostimulante.

**O que fala:** *Every number here names its check.* Um número de produtividade sem a parcela testemunha ao lado é propaganda. Publicamos o número tratado, o número da testemunha, onde o ensaio rodou e quem o conduziu. **Look them up.**

Faixa com as fontes em tipografia: `DETEC · Rehagro · NITEC/UNESP · JP Agrícola · Terras Gerais · UENP`.

Bloco da operação americana: razão social, endereço de Lakeland, e o que a LLC entrega (produto, suporte, pedidos).

**Se travar (P19):** sem autorização para nomear as instituições, a seção continua de pé com as que puderem, ou recua para `field trial, Brazil` com a fonte oferecida por e-mail. Perde muita força — é justamente a nomeação que faz o argumento.

**Se P11 disser que o time é só comercial:** cortar `agronomic support` da frase. Não prometer agrônomo que não existe.

### Ato IV — Conversão (S8)

#### `S8` A faixa de teste — **fundo verde profundo, formulário em card branco** *(era "Contato")*

**Função:** converter. A oferta mudou: em vez de "fale conosco", **uma faixa de teste na lavoura do próprio visitante**.

**O que fala:**
- Headline: *Run a trial strip on your own acres. We supply the product.*
- Corpo: escolha um talhão, deixe uma faixa testemunha ao lado, levamos o produto e voltamos na colheita com você. Seu resultado, nos seus acres, com a sua testemunha.
- Retorno prometido: dados de ensaio da sua cultura, o rótulo e as doses em `fl oz/acre` — normalmente em um dia útil.
- Formulário de 9 campos (teto): nome · fazenda · estado *(pré-preenchido pela geolocalização)* · cultura principal · acres *(faixa)* · e-mail · telefone · o que quer resolver · checkbox de ligação do agrônomo.
- Consentimento com finalidade declarada — o site coleta dados de residentes da Califórnia (CCPA).
- Mensagem de sucesso e mensagem de erro **com caminho alternativo** (e-mail direto). Erro sem saída perde o lead.

**Se travar:** sem confirmação da Juma sobre bancar o produto, a headline recua para *Tell us what you're growing* e o formulário permanece idêntico. Um bloco de texto, nenhum redesenho.

#### `S9` Footer

Endereço americano em destaque tipográfico · vínculo com a matriz (*A subsidiary of Juma Agro — family-run in Mogi Guaçu, Brazil, since 1988*) · quatro colunas de navegação · disclaimer global de ensaio · `Always read and follow the label` · copyright.

Ícone de rede social **só se houver conta americana**. Apontar para o Instagram brasileiro em português contradiz a página inteira.

---

## 4. Template de página de produto — 12 seções em 4 atos

O mesmo template para as duas LPs, parametrizado. Os dois produtos futuros entram sem redesenho.

**A lógica dos quatro atos:** o visitante precisa se reconhecer antes de entender, entender antes de acreditar, e acreditar antes de conseguir operar. Cada ato entrega uma dessas coisas.

| Ato | Seções | O que o ato faz |
|---|---|---|
| **I — Reconhecimento** | 1 · 2 · 3 | Prometer, situar na cultura dele, nomear a dor |
| **II — Mecanismo** | 4 · 5 | Explicar como funciona e o que muda na prática |
| **III — Prova** | 6 · 7 · 8 | O número, a conta e a credencial |
| **IV — Operação e decisão** | 9 · 10 · 11 · 12 | Como usar, o que tem dentro, as objeções, o pedido |

### De/para com o documento de copy

| Novo | Antes | Mudança |
|---|---|---|
| `_5` O que muda na prática | `K6` Benefícios | Subiu: promessa antes da prova |
| `_6` A prova | `K5` antes/depois **+** `K7` tabela | **Fundidos.** Número grande e tabela completa são a mesma coisa em duas escalas de leitura |
| `_7` A conta por acre | `K8` / `A7` | Só renumerou |
| `_8` Slot editorial | `A5` Quarenta anos | Virou slot: cada produto preenche com a sua credencial |
| `_9` Quando entra | `K9` / `A8` | Só renumerou |
| — | `A9` Não é tudo a mesma coisa | Absorvido dentro de `_4` como tabela de comparação |

### As doze seções

#### Ato I

**`_1` Hero** — *fundo claro, texto à esquerda, embalagem à direita*
Eyebrow com a categoria e a compatibilidade de tanque · headline de promessa · subheadline com o argumento econômico · CTA primário e secundário. Menos alto que o hero da Home: numa LP o visitante já decidiu clicar, então o conteúdo começa antes. **Acrescentado ao template:** uma linha de prova ancorada logo abaixo do CTA, com o número e a testemunha — o cético encontra o dado sem rolar.

**`_2` Seletor de cultura** — *barra fina fixa, cinza com aba ativa em verde*
`Showing for: Corn · Soybeans · Cotton · Specialty crops`. Troca resultado, janela de aplicação, dose, ROI e imagem ao longo da página inteira. O estado padrão assume o motivo em voz alta: *Corn — the crop with the trial data we can show you.* Transformar a limitação em sinal de honestidade custa uma linha.
**Técnico:** altura fixa reservada nos blocos que mudam, senão a página pula e prejudica o CLS.
**Se P5 for respondida:** o componente sai e a página abre direto na cultura escolhida. Nenhum outro bloco muda.

**`_3` O problema** — *fundo branco, uma coluna larga, sem card*
A dor específica, reconhecível em uma leitura. Precisa parecer conversa técnica, não caixa de marketing. **Asset:** macro — folha em fim de ciclo, grão em enchimento, corte de perfil de solo. Evitar planta doente ou murcha, que sugere claim de proteção.

#### Ato II

**`_4` Como funciona** — *fundo cinza claro, animação em 60% da largura*
O mecanismo, com a animação principal da página. Texto em coluna lateral; em mobile, animação acima e texto abaixo, nunca sobrepostos. **Regra de redundância:** toda informação que a animação transmite precisa existir também em texto na mesma seção — parte do tráfego rural americano navega em conexão instável.

**`_5` O que muda na prática** — *fundo branco, 4 cards sem borda, filete lima no topo*
Quatro cards curtos, cada um respondendo a uma pergunta prática do produtor — não a um atributo do produto. Sem ícone: o briefing pede para evitar cards pequenos competindo, e ícone genérico é exatamente o que faz um card virar ruído. O quarto card é sempre o número, com a fonte, e funciona como CTA disfarçado.

#### Ato III

**`_6` A prova** — *fundo verde profundo. O clímax visual da página*
Dois níveis de leitura no mesmo bloco:
- **Nível 1 — o número.** Split 50/50: `UNTREATED CHECK` à esquerda, produto à direita, números em escala grande, a diferença destacada entre eles.
- **Nível 2 — a tabela.** Logo abaixo, em card claro: cultura, local, tratado, testemunha, diferença, fonte, ano. Unidade americana primeiro, brasileira ao lado — provar que o número não foi construído para o site.
- Disclaimer fechando.

**Restrição de arte inegociável:** nunca representar isso como duas plantas de portes diferentes. O antes/depois desta seção é de **grão colhido e número medido**. Se não houver foto real de ensaio, tipografia pura funciona melhor que banco de imagens — inventar a imagem do ensaio contradiz a seção inteira.

**`_7` A conta por acre** — *fundo cinza claro, cenário central em card branco elevado*
O ganho e o custo, lado a lado, em três cenários de preço da commodity. Publicar o próprio custo ao lado do ganho é incomum na categoria e é exatamente por isso que funciona neste público.
**Condição de publicação:** sem P8 (preço e custo por acre), **remover a seção inteira**. Publicar o ganho sem o investimento é o formato de propaganda que o resto do site rejeita. Meia conta é pior que nenhuma.

**`_8` Slot editorial** — *fundo escuro ou foto em bleed. Tratamento editorial distinto*
O bloco em que cada produto conta a sua credencial própria. É história, não venda.
- **KMEP Ultra:** por que uma empresa brasileira sabe disso — dez anos de campo com a cigarrinha, que chegou a 185 condados em 16 estados na safra 2025; ou o programa de tecnologia de aplicação com a UENP e o NITEC, se P31 voltar com dado.
- **Aminosan:** *Older than the company that makes it.* Os quarenta anos.

#### Ato IV

**`_9` Quando entra** — *fundo branco, linha do tempo horizontal*
Janela de aplicação e dose, em nomenclatura americana obrigatória (`V4–V6`, `VT`, `R1`, `R3`) e dose em `fl oz/acre`. Publicar estágio em nomenclatura brasileira numa página em inglês denuncia a tradução na primeira leitura técnica.
**Se travar (P4):** publica só com os estágios, sem dose, e o CTA da seção vira `Get the rate sheet`.
**Modo specialty:** enquanto P6 não voltar, *We're confirming positioning for specialty crops in the U.S. Tell us what you grow* — honesto e converte melhor que inventar posicionamento.

**`_10` Ficha técnica** — *fundo cinza, duas colunas: tabela à esquerda, downloads à direita*
Guaranteed Analysis · derived from · densidade · pH · embalagens · registros estaduais · compatibilidade e ordem de mistura · SDS e rótulo em PDF. É o bloco que um dealer procura primeiro; sem ele a página não passa no crivo.
**Armadilha de localização:** embalagem **não pode** aparecer em litros. `10L/20L` são embalagens brasileiras. Nos EUA é `2.5 gal case`, `30 gal drum`, `275 gal tote` — ou o que a LLC realmente comercializa. Manter o formato métrico sinaliza produto importado sem operação local.
**Se travar (P1, P3):** a seção sai da v1 e entra por deploy posterior.

**`_11` Objeções** — *acordeão, fundo branco, primeira aberta*
Perguntas frequentes escritas como antecipação de objeção. Cinco a sete itens, sempre incluindo:
- compatibilidade e ordem de mistura;
- registro no estado do visitante;
- **a diferença para o produto barato equivalente** — é a primeira objeção de um agrônomo de retail e resposta vaga custa a venda;
- *"seus ensaios são do Brasil, por que isso me importa?"* — **a resposta mais importante da página**: a testemunha do ensaio brasileiro (212,3 bu/ac em milho) coincide quase exatamente com a média nacional americana. Os ensaios são diretamente comparáveis ao benchmark do visitante, e o ensaio não rodou em condição mais fácil que a dele — rodou em condição mais difícil;
- *"vocês têm dado americano?"* — se não, dizer com todas as letras e oferecer a faixa de teste. Desviar dessa pergunta é pior do que respondê-la.

**`_12` CTA final** — *fundo verde profundo, formulário reduzido de 4 campos*
Repete a oferta da faixa de teste com mais contexto e menos atrito: cultura, estado, e-mail, nome. Enumerar o que chega no e-mail — rótulo, doses em `fl oz/acre`, relatório do ensaio — é mais concreto que "fale conosco" e define expectativa clara.

---

## 5. LP KMEP Ultra® — o preenchimento do template

**Status:** produto mais difícil de escrever do portfólio e o de maior oportunidade aberta. Os dois fatos vêm da mesma origem.
**Eixo recomendado:** B (adjuvante de calda) com A (potássio foliar) embutido. Ver 1.5.
**Cultura padrão do seletor:** milho — é onde está o ensaio.

| # | Seção | O que esta página diz aqui |
|---|---|---|
| `K1` | Hero | *Your insecticide isn't failing. It isn't getting there.* Parceiro de tanque que melhora a deposição — mais do ativo que você já pagou chegando ao baixeiro, onde a praga está. Linha de prova ancorada: `221.3 vs 212.3 bu/ac · Rehagro, Brazil` |
| `K2` | Seletor | Corn · Soybeans · Cotton · Specialty |
| `K3` | O problema | Quando o dossel fecha, o terço inferior vira outra lavoura. É a parte da planta em que a calda chega por último — ou não chega. **Eixo A alternativo:** a demanda de potássio tem pico no enchimento, exatamente quando o veranico ou a raiz rasa limitam o que o solo entrega |
| `K4` | Como funciona | Três passos em linguagem regulatoriamente segura: menor tensão superficial → melhor deposição → mais fundo no dossel. Animação `AN-02`. **Eixo A:** duas rotas, dois relógios — potássio do solo × potássio foliar |
| `K5` | O que muda | Entra no tanque que você já está enchendo · sem passada extra, sem diesel, sem nova janela de clima · posicionado para a janela que decide o grão · um número que você pode conferir |
| `K6` | A prova | `221.3 vs 212.3 bu/ac` · milho · ensaio Rehagro, Brasil · originais `231,45 vs 222,12 sc/ha` · +8,9 bu/ac (+4,2%). Animação `AN-03` — os dois contadores subindo juntos. **Falta o ano do ensaio** |
| `K7` | A conta por acre | A US$ 4,30/bu, 8,9 bu/ac valem US$ 38,27/acre. Custo do produto na dose de rótulo: **[P8]**. A diferença entre os dois números é a decisão inteira — por isso publicamos os dois |
| `K8` | Slot editorial | A cunha brasileira: dez anos de convivência com a cigarrinha, que chegou a 185 condados em 16 estados em 2025 (Pioneer). **Cuidado:** citar a estatística pública é seguro; vincular o produto ao controle da praga é `HOLD` |
| `K9` | Quando entra | Milho: V4–V6 e novamente na aplicação anterior ao enchimento. Soja: R1 a R3. Dose **[P4]** |
| `K10` | Ficha técnica | Guaranteed Analysis **[P1/P3]** · embalagens em galão · registros estaduais **[P10]** · SDS **[P14]** |
| `K11` | Objeções | Posso misturar? · queima folha em calor alto? **[P]** · está registrado no meu estado? **[P10]** · qual a diferença para um 0-0-25 ou KTS? **← eixo B responde, eixo A não** · seus ensaios são do Brasil, e daí? · têm dado americano? |
| `K12` | CTA final | *Run a trial strip. We supply the product.* + rótulo, doses e o ensaio |

**Trilha B (desalojante) permanece escrita e engavetada.** Três blocos trocam de conteúdo se a liberação escrita vier: `K1`, `K3`, `K4`. O layout já está desenhado. A animação `AN-08` **não deve ser produzida** antes da liberação — produzir o ativo aumenta a chance de ele vazar para produção por engano.

---

## 6. LP Aminosan® — o preenchimento do template

**Status:** carro-chefe, produto de origem, o mais provado da casa — e o de comunicação mais exposta. As frases hoje no ar em `/en` (*faster recovery*, *the plant grows again after stress*, *acelera a fotossíntese e a atividade enzimática*) são exatamente as construções que a EPA classifica como claim de estimulação.
**Princípio de redação:** descrever o que o produto **entrega**, nunca o que ele **provoca** na planta. Composição é factual e verificável no rótulo; o que a planta faz com ela depois é fisiologia, e é ali que a linha da FIFRA passa.
**Cultura padrão do seletor:** soja — é onde estão os dois ensaios.

| # | Seção | O que esta página diz aqui |
|---|---|---|
| `A1` | Hero | *The plant can build amino acids. Or you can hand it the finished ones.* Fertilizante foliar de aminoácidos livres de origem vegetal com N, P e K, por fermentação enzimática. *Está em campo há mais tempo que a empresa que o fabrica* |
| `A2` | Seletor | Soybeans · Corn · Cotton · Specialty |
| `A3` | O problema | *Nitrogen is not an amino acid.* Nitrato é matéria-prima, não produto acabado. Antes de virar proteína, a planta precisa reduzir, aminar e montar — uma cadeia que consome carbono e energia produzidos para outra coisa. Numa safra com folga, é assim que funciona; nas semanas que definem a produtividade, é um custo |
| `A4` | Como funciona | *Five steps, or one.* A cadeia `NO₃⁻ → NO₂⁻ → NH₄⁺ → glutamato → aminoácido` contra a entrega foliar direta. Animação `AN-05`. **Absorve a antiga `A9`:** tabela de três linhas — origem *(vegetal × hidrolisado animal)*, processo *(fermentação enzimática × hidrólise ácida)*, forma *(aminoácidos livres × cadeias peptídicas)*. Coluna da direita **sempre genérica**, nunca nomear concorrente, e "often" em vez de "always" |
| `A5` | O que muda | Quatro cards de entrega, não de efeito. O quarto é o número — ou, enquanto P9 não chegar, o convite a pedir os relatórios |
| `A6` | A prova | **Bloqueada por P9.** Estado provisório já escrito e recomendado: *We're not publishing the numbers until we can put the untreated check beside them, because that's the rule for every number on this site.* Aplicar a própria regra em público, mesmo quando custa caro, é a prova mais forte de que a regra é real — e gera lead qualificado |
| `A7` | A conta por acre | Bloqueada por P8 **e** P9. Se não vierem, remover a seção |
| `A8` | Slot editorial | *Older than the company that makes it.* Julio Matino formulou o Aminosan antes de existir empresa para vendê-lo; produtores de São Paulo compraram porque funcionava, e a demanda construiu o negócio. Quarenta anos depois, ainda é o produto mais testado da linha, ainda feito em Mogi Guaçu, ainda tocado pela mesma família |
| `A9` | Quando entra | Soja: de V2–V3 aos estágios reprodutivos. Milho: V2 a V8. Dose **[P4]**. Specialty: quatro décadas em frutíferas, hortaliças e perenes no Brasil — confirmando quais se traduzem para condições e registros americanos |
| `A10` | Ficha técnica | **O percentual de aminoácidos livres é o número mais importante da tabela** — é o que sustenta a comparação em `A4` e o que um comprador técnico usa entre marcas. Sem ele, a tabela comparativa sai |
| `A11` | Objeções | Diferença para um hidrolisado? · posso misturar? · é OMRI listed? **[P24]** · quarenta anos e nenhum dado americano? · **o que ele faz pela minha lavoura?** ← a pergunta em que a tentação de claim é máxima; a resposta devolve à prova, nunca ao efeito |
| `A12` | CTA final | *Forty years of trials. Ask for the ones that matter to you.* + faixa de teste |

---

## 7. O que trava o quê

Todas as pendências têm saída. **Nenhuma justifica atrasar a entrega.**

| ID | Pendência | Trava | Estado degradado |
|---|---|---|---|
| **P31** | **Dado de deposição/cobertura do KMEP (NITEC?)** | **Eixo de posicionamento de toda a LP KMEP** | **Publica no eixo A (potássio) e `K8` troca de conteúdo** |
| P2 | Validação regulatória dos claims | `K1` `K3` `K4` Trilha B · revisão de `S6` `A3` `A4` | Publica em Trilha A/eixo B. Perde a cunha da cigarrinha |
| P1 · P3 | Rótulo americano e Guaranteed Analysis | `K10` `A10` · e a tabela comparativa de `A4` | Ficha técnica sai da v1 e entra por deploy posterior |
| P4 | Dose em `fl oz/acre` | `K9` `A9` | Publica só com estágios; CTA vira "peça a tabela de doses" |
| P5 | Row crop ou specialty | Seletor de cultura, tom geral | Seletor cobre os dois cenários. Some quando a resposta vier |
| P6 | Culturas americanas por produto | `S5` `K2` `A2` `K9` `A9` | Abre com milho e soja; specialty vira captura de lead |
| P8 | Preço e custo por acre | `K7` `A7` | **Remover as duas seções de ROI.** Meia conta é pior que nenhuma |
| P9 | Testemunha dos ensaios de Aminosan | `S2` slot 4 · `A6` `A7` | `A6` publica no estado provisório, que aplica a regra da casa em público |
| P10 | Registros estaduais | `K10` `A10` `K11` `A11` | Convidar o visitante a perguntar pelo estado dele |
| P11 | Quem atende o lead, e se é agronômico | `S0` `S7` `S8` `K12` `A12` | CTA recua de "Talk to an agronomist" para "Request product info" |
| P12 | Foto de produto com rótulo americano | `S4` `K1` `A1` `K10` `A10` | Composição tipográfica do nome. **Nunca o frasco brasileiro** |
| P13 | Fotos de campo americano | `S1` `S3` `K3` `A3` | Macro licenciado, com curadoria rigorosa. Sem paisagem que não corresponda ao Corn Belt |
| P19 | Autorização para citar as fontes | `S7` `K5` `K6` `A6` | Recuar para "field trial, Brazil" e oferecer a fonte por e-mail. Enfraquece muito |
| P20 | Existe ensaio nos EUA? | `K11` `A11` | Responder "não, ainda" com a oferta de faixa de teste |
| P26 | Logo da LLC, foto histórica, razão social | `S0` `S6` `S9` `A8` | Seções funcionam só com tipografia |
| — | **Ano do ensaio Rehagro** | `S2` `K6` | Não consta em nenhum documento auditado. Tabela sem ano levanta suspeita imediata em leitor técnico |
| — | **A Juma banca o produto da faixa de teste?** | `S8` `K12` `A12` | Escada de CTA sobe um degrau. Troca de texto, sem redesenho |

---

## 8. O que levar para o Figma

**Ordem de produção recomendada** — o caminho crítico é o design, não o código.

1. **Design system primeiro.** Tokens de cor, escala tipográfica com a mono incluída, botão pill, card raio 0, campo de formulário, filete de seção. Sem isso o time serializa.
2. **Os dois componentes que aparecem em toda página:** o **bloco de prova** e o **formulário**. São eles que definem o resto.
3. **Home completa**, desktop e mobile. Sete das oito seções estão livres para publicar — não dependem de nenhuma pendência.
4. **Template de LP**, desenhado uma vez e aplicado aos dois produtos. Os dois produtos futuros entram sem redesenho.
5. **`AN-03` primeiro entre as animações** — é a mais barata (tipografia animada), a de maior impacto e não depende de nada.
6. **`AN-08` não é produzida** enquanto P2 não voltar por escrito.

**Telas a desenhar:** 3 páginas × 2 breakpoints = 6, mais os estados do seletor de cultura (4 por LP), o estado bloqueado de `A6`, os estados do formulário (padrão, carregando, sucesso, erro) e o menu mobile.

**Antes de qualquer coisa ir ao ar:** a copy inteira passa pelo responsável regulatório da LLC, **inclusive as seções marcadas como livres**. A marcação dos documentos é análise da Oceon a partir de pesquisa pública. Quem decide onde fica a linha é quem responde pela FIFRA na Juma-Agro Fertilizer LLC.
