# Copy da LP KMEP Ultra® (EUA)

**Este é o documento canônico da copy e do posicionamento do KMEP Ultra para o mercado americano.**
Se houver divergência entre este arquivo, o protótipo `site/kmep-ultra.html` e as tabelas antigas de
`03-SITE.md`, **vale este arquivo**. Escrito em 22/09/2026, sobre três fontes:

| Fonte | O que ela define |
|---|---|
| Folheto oficial americano `assets/kmep-ultra-folheto-us.pdf` | Como a Juma já comunica o produto nos EUA, impresso. Custo por acre |
| Resposta oficial da Juma (commit `54891fd`, 01/09/2026) | A hierarquia das três entregas |
| `site/kmep-ultra.html` | Copy validada da versão anterior, blocos de prova e FAQ |
| Ficha técnica BR `assets/kmep-ultra-ficha-br.pdf` (arquivada em 24/09/2026) | Garantias, dose e estágio por cultura, embalagens. Cruzada com a página em [`07-CURADORIA-KMEP.md`](07-CURADORIA-KMEP.md) |

---

## 1. Posicionamento

O folheto americano e a resposta da Juma não dizem a mesma coisa, e essa divergência já custou uma
reescrita. O folheto lidera por performance de aplicação (*"You won't see the loss… until you
harvest"*, *"KMEP supports spray performance"*) e trata o potássio como entrega adicional. A
resposta oficial da Juma inverte: potássio e enchimento de grãos em primeiro, eficiência da
aplicação em segundo, ação desalojante como vantagem adicional.

**A página resolve isso pela porta do leitor, não pela porta do produto.** Abre pelo problema que o
folheto nomeia, que é onde o produtor americano está, e entrega as duas coisas como um par:

1. **Problema de entrada:** parte de toda aplicação não faz o trabalho pago por ela, e a conta só
   aparece na colheita.
2. **Primeira entrega (o dia da aplicação):** cobertura e deposição, que é o que o folheto imprime.
3. **Segunda entrega (o ciclo inteiro):** potássio foliar na janela em que a demanda é máxima.
4. **Vantagem adicional (bloco removível):** a ação desalojante, presa à pendência P2.

A hierarquia da Juma continua respeitada na seção de mecanismo: o potássio ganha seção própria,
primeiro e maior. O que muda é a porta de entrada.

**A distinção que não pode se perder em nenhuma revisão:** o KMEP não faz o inseticida render mais.
Não é economia de dose nem de calda. Ele aumenta a eficiência do que já está no tanque. Sem essa
frase, o leitor entende diluição, e quem descobre depois é o agrônomo do cliente.

### Risco regulatório

Descrever o comportamento físico da gota (cobertura, deposição, espectro) é linguagem de adjuvante e
já está impressa no folheto americano da própria Juma. Atribuir controle de inseto ou performance de
defensivo é claim de pesticida sob a FIFRA e exige registro na EPA. A página inteira publica sem o
bloco da ação desalojante: **K8 sai inteira, e as duas frases marcadas em K9 e K16 saem com ela, sem
tocar no resto.** Ver P2 em `04-PENDENCIAS.md`.

---

### Revisão de 24/09/2026: dose do rótulo e ordem das culturas

A dose publicada é a do rótulo americano, **16 fl oz/acre, igual para todas as culturas**. As doses
por cultura da ficha BR não vão para o site. A régua do `K13` tem 12 culturas, nesta ordem: citros,
frutíferas, hortaliças, tomate e pimentão, **ornamentais** (nova, com janela pela regra do rótulo: uma
dose por aplicação), batata, cebola e alho, cenoura e beterraba, milho, soja, algodão e feijão. O card
ao lado do galão diz *"16 fl oz per acre in every pass, the rate on the U.S. label. One 2.5 gal jug
covers 20 acres."* O formulário segue a mesma prioridade: Citrus & fruit · Vegetables · Ornamentals ·
Row crops · Other.

### Revisão de 24/09/2026: sem preço no site

Decisão do cliente: **o site não publica valor.** Saíram o "$6 an acre" do hero (A e B), o card 4 do
`K9` (agora mostra a testemunha, 212.3 bu/ac, contra o ganho de +8.9), a pergunta de custo do `K16`,
a leitura "Cost" da cena B, a meta description e o card do KMEP na Home. **O `K11` (a conta por
acre) saiu da página inteiro**, porque a seção existe para comparar custo e retorno. O componente
`Economics.tsx` e o conteúdo `economics` ficam no código para quando o preço voltar. Onde este
documento cita $6 ou $38,27, leia como histórico.

### Revisão de 24/09/2026: várias culturas, não só milho e soja

Decisão do cliente: **o foco do KMEP nos EUA são várias culturas.** A página deixou de se apresentar
como produto de milho e soja. O que mudou na copy publicada (`web/src/content/kmep.ts`):

- **`K13`:** a régua passou de 2 para 11 culturas (milho, soja, algodão, feijão, batata, cebola e
  alho, cenoura e beterraba, tomate e pimentão, citros, frutíferas, hortaliças), com as janelas da
  ficha técnica da Juma (`assets/kmep-ultra-ficha-br.pdf`). Café ficou de fora. O texto de abertura
  passou a ser *"In a spray pass you already have on the schedule. Row crops, vegetables and orchards
  each have their own window…"*. A frase *"Corn and soybeans are the two crops positioned for the
  U.S. today"* saiu.
- **`K1`, `K7` e a cena B:** *grain fill* / *the kernel* viraram *the weeks that set the yield* e
  *the fill of the grain, the tuber or the fruit*.
- **`K12`:** o bloco de contexto da cigarrinha-do-milho saiu, junto com a foto do inseto.
- **`K14`:** *"Already sprays insecticide on corn or soybeans"* virou *"Already has spray passes on
  the schedule, in row crops, vegetables or orchards"*.
- **`K17`:** as culturas do formulário viraram *Row crops · Vegetables · Citrus & fruit · Other*.

**O que continua sendo de milho, e deve continuar:** a prova (`K2`, `K10`, `K11`, `K16`). É o único
ensaio que existe, e ele diz de que cultura é. Ensaios de outras culturas entram quando existirem.
Doses por cultura seguem em P4, e a lista de culturas americanas em P6.

---

## 2. Arquitetura narrativa

**Big Idea:** a aplicação que você já vai fazer pode entregar duas coisas em vez de uma, por seis
dólares o acre.

**Promessa:** mesma passada, mesma dose, mais do produto chegando onde devia, e potássio na folha na
janela em que a espiga está sendo formada. Ensaio em milho: 221,2 contra 212,3 bu/ac.

**Nível de consciência do leitor:** 2 a 3. Ele sente a dor (reaplicação, resultado irregular no
terço inferior, potássio no solo que não chega na hora) e não conhece a categoria. Por isso o arco é
PAS, e não oferta direta.

**Arco:** perda invisível → o que ela custa até a colheita → uma passada, dois trabalhos → mecanismo
(deposição, depois potássio) → vantagem adicional → o que muda na prática → prova → a conta por acre
→ credencial → quando entra → para quem é → como funciona a faixa de teste → objeções → pedido.

### Mapa de objeções

| # | Objeção real | Onde morre |
|---|---|---|
| 1 | "Isso é só um espalhante caro" | K6 (deposição com programa de pesquisa por trás) e K11 (a conta) |
| 2 | "Qual a diferença de um 0-0-25 ou KTS?" | K16, resposta curta e sem rodeio |
| 3 | "Seus ensaios são do Brasil" | K16: a testemunha brasileira (212,3 bu/ac) está acima da média americana (≈186, USDA 2025), perto de Illinois |
| 4 | "Tem coisa publicada ou só ensaio de fabricante?" | K10: o artigo revisado por pares, com a autoria declarada |
| 5 | "Então posso baixar a dose do inseticida?" | K9 e K16: não, e está escrito |
| 6 | "Mais um produto no tanque para dar problema" | K13: ordem de mistura e jar test |
| 7 | "Quanto custa e quanto volta?" | K11: $6/acre contra $38,27 de ganho |
| 8 | "Não é para a minha lavoura" | K14: para quem é e para quem não é |

**CTA único, repetido em quatro pontos:** *Run a trial strip on your acres*. Mesma ação, mesma
promessa, do hero ao rodapé.

---

## 3. Estrutura da página

Dezessete blocos, contra os onze da versão anterior. As seções novas estão marcadas.

| # | Seção | Status |
|---|---|---|
| `K1` | Hero | Publica |
| `K2` | Faixa de prova ancorada | Publica, falta o ano do ensaio (P21) |
| `K3` | O problema: a perda que não se vê | Publica |
| `K4` | **Nova.** O que a perda custa até a colheita | Publica |
| `K5` | Uma passada, dois trabalhos | Publica |
| `K6` | **Nova.** Trabalho 1: cobertura e deposição | Publica |
| `K7` | Trabalho 2: potássio no enchimento | Publica |
| `K8` | Vantagem adicional: ação desalojante | **HOLD P2** |
| `K9` | O que muda na operação | Publica (um card depende de P2) |
| `K10` | A prova: ensaio + artigo revisado por pares | Publica, falta o ano (P21) e o número do artigo (P32) |
| `K11` | A conta por acre | Publica (destravada pelo folheto) |
| `K12` | Credencial: tecnologia de aplicação | Publica, nomear instituições depende de P19 |
| `K13` | Quando entra, dose e mistura | Estágios publicam, dose depende de P4 |
| `K14` | **Nova.** Para quem é e para quem não é | Publica |
| `K15` | **Nova.** Como funciona a faixa de teste | Publica |
| `K16` | Perguntas | 3 de 9 aguardam dado |
| `K17` | Pedido | Depende de P11 |

---

## 4. A copy

Texto em inglês americano, pronto para o ar. Onde há duas versões, a primeira é a recomendada.

### `K1` Hero

> **Publicado desde 24/09/2026 (versão curta, pedido do cliente):**
> Olho: SPRAY PERFORMANCE · FOLIAR POTASSIUM
> Headline: **Make every pass count.** Ecoa a ficha BR ("Potencialize sua aplicação") e o folheto
> US ("Optimize every application").
> Sub: *KMEP Ultra® rides in the tank you already fill. More of the spray stays on the leaf, and
> potassium lands in the weeks that set the yield.*
> A headline abaixo ("You won't see the loss until you harvest.") saiu do hero da versão A e segue
> na versão B e na cena. O texto abaixo é o histórico.

**Olho:** SPRAY PERFORMANCE · FOLIAR POTASSIUM · TANK-MIX PARTNER

**Headline, versão 1 (recomendada, entra pelo problema):**

> You won't see the loss until you harvest.

**Sub:**

> Part of every application never does the work you paid for. KMEP Ultra® rides in the tank you are
> already filling. It improves how the spray covers and lands, and it carries foliar potassium into
> the weeks when grain fill is setting the yield. Six dollars an acre.

**Headline, versão 2 (entra pelo produto, para teste A/B):**

> One pass. Two jobs. Six dollars an acre.

**Sub da versão 2:**

> KMEP Ultra® goes in with the insecticide you already chose. It improves coverage and deposition on
> the day you spray, and it puts potassium on the leaf for the window where demand peaks.

**CTA:** Run a trial strip on your acres
**CTA secundário:** See the trial

> A versão 1 vence porque o leitor está no nível 2 de consciência: ele reconhece a perda antes de
> reconhecer a categoria do produto. A versão 2 é mais rápida para quem já conhece a marca, e é a
> candidata natural do teste A/B.

### `K2` Faixa de prova

> 221.2 bu/ac treated · 212.3 bu/ac untreated check · +8.9 bu/ac (+4.2%)
> Corn · Rehagro trial · Brazil · [year P21]

### `K3` O problema

**Headline:** You made the pass right. Part of it still missed.

> You ran the product you chose, at label rate, in a window that was actually good. The pass looked
> clean from the cab. What you cannot see from there is how much of that spray stopped on the top of
> the canopy, how much bounced, and how much dried before it reached the leaf surface that mattered.
>
> Hidden losses in application performance cost yield, quality and profit without leaving a single
> visible sign in the field. By the time the monitor tells you, the pass is four months behind you
> and there is nothing left to fix.

### `K4` O que a perda custa (nova)

**Headline:** Small losses you never see add up to a number you do.

> Two things happen when a pass underperforms. The obvious one is the re-spray: another trip, more
> diesel, another weather window you did not plan for. The quieter one is the potassium the crop
> needed in the same stretch of the season and did not get, because the demand peaked while the soil
> was dry and the root could not move it fast enough.
>
> Neither of those shows up as a symptom you can photograph. Both show up in the yield monitor.

> Nota: seção sem atribuição de efeito ao produto. Descreve dinâmica agronômica e custo
> operacional, e por isso publica sem depender de P2.

### `K5` Uma passada, dois trabalhos

**Headline:** One pass. Two jobs.

> KMEP Ultra® goes in the tank with the insecticide you already chose, on the pass you already
> scheduled. No separate trip across the field. From there it does two things: it changes how the
> spray behaves on the way to the leaf, and it delivers potassium the tissue can take up while it
> is there.
>
> The first job happens in the twenty minutes the sprayer is in that field. The second one runs for
> the rest of the season.

### `K6` Trabalho 1: cobertura e deposição (nova)

**Headline:** What the droplet does before it dries.

> A spray droplet has a short career. It leaves the nozzle, travels through moving air, lands on a
> surface that may be waxy and vertical, and either stays there long enough to work or does not.
> KMEP Ultra® works on that stretch: it improves how the spray covers the leaf surface and how well
> it deposits, so more of what you bought reaches the target you aimed it at.
>
> It also holds that behavior steadier across the conditions a real day gives you, which is where
> applications usually separate from one another. A pass at 7 a.m. and a pass at 2 p.m. are not the
> same pass.

**Fecho da seção:** Nothing changes about your nozzle or your rate. What changes is how many of
those droplets stay where you put them.

> Ativo: cartão hidrossensível em macro, ou bico e gota contra a folha. Documental, nunca
> publicitário. **Nunca** comparar duas plantas de tamanhos diferentes.

### `K7` Trabalho 2: potássio no enchimento

**Headline:** Grain fill runs on potassium the root may not deliver in time.

> Potassium demand peaks late, through pollination and grain fill, which is exactly when a dry
> stretch, a compaction layer or a shallow root system limits how much the soil can actually move.
> The potassium is in the ground. Your soil test says so. That is not the same as having it in the
> plant during the three weeks that set the kernel.

**Sub-bloco: Two routes, two clocks.**

> Soil potassium moves with water. It has to dissolve, travel to the root surface, cross into the
> xylem and ride up to the leaf, and every one of those steps slows down when the profile dries.
> Foliar potassium starts at the leaf and moves into the tissue from where it lands.

> Animação AN-02 (duas rotas, dois relógios). A comparação temporal "em horas em vez de dias"
> continua dependendo de respaldo do técnico da Juma.

### `K8` Vantagem adicional: a ação desalojante · **HOLD P2**

**Headline:** The one you didn't reach is the one that comes back.

> The application was right. The product was right. Part of the population simply never met the
> spray, because it was in the whorl, under the leaf, in the sheath. KMEP Ultra® rides in the same
> droplet and moves the target out of that shelter, into contact with the insecticide you already
> paid for.

Três tempos, mantidos da versão anterior: **Sheltered** (where the droplet was never going to
reach) · **Dislodged** (it comes out on its own) · **Exposed** (in front of the product you already
bought). Animação AN-08, já construída dentro desta seção.

**Ressalva obrigatória, dentro do bloco:**

> This is not a reason to cut your insecticide rate. Same rate, same label, same tank. What changes
> is how much of the population the insecticide actually reaches.

### `K9` O que muda na operação

**Headline:** What it does for the operation.

Quatro cards, na ordem em que o produtor pergunta:

1. **Goes in the tank you're already filling.** Compatible in tank mix. No separate pass, no extra
   diesel, no new weather window to wait for.
2. **More of the spray does its job.** Better coverage and deposition on the leaf surface you aimed
   at, at the same rate on the same label.
3. **Potassium in a form the leaf takes up.** Positioned for the window where demand actually peaks,
   instead of waiting on soil moisture. *(Card dependente de P2: acrescentar "and the added
   flushing advantage brings more of the population into contact with the spray.")*
4. **Six dollars an acre, against 8.9 bushels.** Ask us for the full trial report.

### `K10` A prova

**Headline:** Nine bushels, same pass.

Mantém o bloco da versão anterior: 221,2 contra 212,3 bu/ac, unidades originais (231,45 contra
222,12 sc/ha), tabela completa do ensaio, e o artigo revisado por pares em algodão (Revista Foco,
v.16 n.2, 2023, DOI 10.54751/revistafoco.v16n2-129), com a declaração de autoria em aberto.

**Abertura reescrita:**

> One trial, published whole, with the check strip beside it. Corn under leafhopper management,
> Rehagro, Brazil. The product went in with an insecticide application that was already on the
> schedule, so the nine bushels came out of a pass that was going to happen anyway.

**Restrição de arte, inegociável:** nunca representar o resultado como duas plantas de tamanhos
diferentes. Planta tratada visivelmente maior é a representação visual de um regulador de
crescimento e carrega o mesmo risco que a frase equivalente.

### `K11` A conta por acre

**Headline:** What nine bushels is worth on your acres.

> At $4.30 corn, 8.9 bushels is $38.27 an acre. The product costs six dollars an acre at the label
> rate for one spray. We publish both numbers together, because the gap between them is the whole
> decision.

Três cenários de preço, com o custo fixo de $6/acre ao lado:

| Corn price | Value of +8.9 bu/ac | Product cost | Net per acre |
|---|---|---|---|
| $4.00/bu | $35.60 | $6.00 | $29.60 |
| $4.30/bu | $38.27 | $6.00 | $32.27 |
| $4.60/bu | $40.94 | $6.00 | $34.94 |

**Rodapé da seção:** Yield response from the Rehagro trial in Brazil. Corn prices shown for
reference. Your result will vary with climate, soil and management.

> O custo de $6/acre por aplicação vem do folheto americano da Juma. Se a dose de rótulo americana
> (P4) mudar o número, esta tabela muda junto: é o único lugar da página onde o custo aparece.

### `K12` Credencial: tecnologia de aplicação

**Headline:** Application technology is a research program here, not a tagline.

> Since 2021, Juma Agro has run the DESATA project with UENP and with NITEC, the application
> technology and machinery lab at UNESP: wind tunnel work on droplet spectrum, drift and deposition.
> That is the discipline behind this product, and it is why we can talk about what a droplet does
> before it dries instead of what we would like it to do.

**Bloco de contexto (estatística pública, sem atribuir controle ao produto):**

> Corn leafhopper was confirmed in 185 counties across 16 states in the 2025 season. Brazil has been
> managing it for more than a decade. Pioneer, 2025, public data.

### `K13` Quando entra

**Headline:** When it goes in.

> In the insecticide pass you already have on the schedule. Corn and soybeans are the two crops
> positioned for the U.S. today. Cotton and specialty crops are under technical review.

- **Window.** Corn: V4, V6, and again at ear formation. Soybeans: V6/V7, repeating every 10 to 15
  days. The corn timing has two halves and both matter. The first two ride with insecticide passes
  you already scheduled, and the one at ear formation is the potassium arriving where the demand is.
- **Rate and pack.** [P4] fl oz/ac, from the U.S. label. U.S. pack sizes [P1].
- **Tank mix.** Mixing order and known incompatibilities are on the label. Jar-test any combination
  you have not run before.

> Posicionamento do rótulo 2026 da Juma. Estágios sempre em nomenclatura americana e dose em
> fl oz/acre. Lista ampliada de culturas segue no bloco "Growing something else?".

### `K14` Para quem é e para quem não é (nova)

**Headline:** Who this is for.

> **It fits** an operation that already sprays insecticide on corn or soybeans, runs its own check
> strips, and wants more out of a pass that is already budgeted.
>
> **It does not fit** a grower looking to replace potash, cut an insecticide rate, or buy a product
> that works without an application going out anyway. If all you need is potassium, buy potassium.
> KMEP Ultra® is bought for what the pass does, and the potassium rides along.

> Seção nova, e a mais barata de escrever: qualificar afasta o lead errado e dá confiança ao certo.
> Também responde por antecipação a duas objeções do mapa.

### `K15` Como funciona a faixa de teste (nova)

**Headline:** Your field, your check strip, your monitor.

> 1. Pick a field with an insecticide pass already scheduled. We send the product for it.
> 2. Leave a strip untreated, in the same field, under the same management. That strip is the whole
>    experiment.
> 3. Harvest both and read your own monitor. We come back to look at the numbers with you, whichever
>    way they fall.

**Linha de redução de risco, embaixo:** No cost for the product on the strip. No obligation after
harvest.

> Esta seção é a resposta operacional para "vocês não têm dado americano". Transforma a ausência de
> dado local na oferta da página, e é o que dá sentido ao CTA repetido.

### `K16` Perguntas

Mantidas as oito da versão anterior, com três ajustes:

- **"Your trials are from Brazil. Why should that matter to me?"** Continua sendo a resposta mais
  importante da página: a testemunha do ensaio brasileiro (212,3 bu/ac em milho) está **acima** da
  média americana (cerca de 186 bu/ac em 2025, USDA NASS, Crop Production de 14/11/2025) e perto de
  Illinois (217). A versão anterior dizia "bate quase exato com a média nacional", o que é falso e
  cai na primeira conta de um agrônomo. O argumento honesto é outro e é melhor: a resposta veio em
  cima de uma testemunha forte. Resposta publicada: *"Because the check was not a weak field. The
  untreated corn in our trial ran 212.3 bu/ac, well above the 2025 U.S. average of about 186 bu/ac
  and close to Illinois at 217. A response on top of a check that strong is harder to get, not
  easier."*
- **Pergunta nova, direto do folheto:** *"How much does it cost per acre?"* → Six dollars an acre
  per spray at label rate. The trial it sits next to returned 8.9 bu/ac, which is $38.27 at $4.30
  corn. We publish both numbers on the same screen.
- **"Can I cut my insecticide rate if I use it?"** → No. It does not stretch the insecticide and it
  does not change the rate on that label. Run your normal rate.

Pendentes: espuma e entupimento de tela (resposta técnica da Juma), registro por estado (P10), dado
americano (P20).

### `K17` Pedido

**Headline, versão 1 (recomendada):**

> Run a trial strip. We supply the product.

**Sub:**

> Pick a field, leave an untreated check strip beside it, and we will come back at harvest with you.
> Tell us your crop and your state and we will send the label, rates in fl oz per acre, and the full
> trial report first.

**Headline, versão 2:**

> Six dollars an acre, on one strip of your worst field.

Formulário reduzido de quatro campos: nome, e-mail, estado, cultura principal. Mesmo componente da
Home, em variante reduzida.

**Ressalva de rodapé, obrigatória:**

> KMEP Ultra® is applied in tank mix with an insecticide and never in place of one. It does not
> change the rate on the insecticide label. Always read and follow the label directions of the
> pesticide you are applying.

---

## 5. O que ainda contradiz este documento

**O card do KMEP na home já implementada.** `web/src/content/home.ts`, em `products[0].body`, ainda
diz *"It goes in the tank with your insecticide and drives the target out of hiding"*. É a
hierarquia antiga e, pior, é a frase de maior risco FIFRA da página mais visitada do site, num bloco
que hoje publica sem depender de P2. Proposta de troca, no mesmo tamanho:

> **Category:** Spray performance · Foliar potassium
> **Body:** It rides in the tank with your insecticide, improves how the spray covers and lands, and
> carries foliar potassium into grain fill. Six dollars an acre.

---

## 6. Notas de implementação

1. **A prova aparece três vezes em alturas diferentes:** faixa ancorada no hero (K2), seção inteira
   no meio (K10) e conta por acre logo depois (K11). O cético que rola direto para o número encontra
   ele em qualquer uma das três alturas.
2. **K8 é removível por construção.** A animação AN-08 vive dentro da seção, em SVG e CSS inline. Se
   P2 vier restritiva, remover K8, o trecho marcado do card 3 em K9 e a pergunta correspondente em
   K16. Nada mais na página depende dela.
3. **Hierarquia visual do K11:** o custo de $6 e o líquido por acre têm o mesmo peso tipográfico do
   ganho. Publicar ganho maior que custo, em corpo maior, é a estética de propaganda que o resto do
   site rejeita.
4. **Tom:** técnico, direto, sem exclamação. Três adjetivos de voz: exato, franco, de campo. Três
   anti-adjetivos: entusiasmado, publicitário, visionário.
5. **O que nunca entra em arte:** planta tratada maior que a testemunha, foto de lavoura brasileira
   em plano aberto numa página americana (macro não tem sotaque, plano aberto tem), embalagem em
   litros.
