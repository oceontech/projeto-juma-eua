# Curadoria da LP KMEP Ultra® contra os materiais oficiais da Juma

Escrita em 24/09/2026. Cruza a página (`/kmep`, `web/src/content/kmep.ts`) e o canônico
([`05-COPY-KMEP-ULTRA.md`](05-COPY-KMEP-ULTRA.md)) com os dois materiais impressos da Juma. O
canônico continua valendo. Este arquivo registra o que os materiais trazem, o que já foi corrigido
e o que precisa de decisão antes de entrar na página.

---

## 1. As duas fontes

| Arquivo | O que é | Idioma | Novo? |
|---|---|---|---|
| [`assets/kmep-ultra-ficha-br.pdf`](assets/kmep-ultra-ficha-br.pdf) | Ficha técnica brasileira, A4, uma página: descrição, "efeitos", garantias, dose para 14 culturas, embalagens | PT | **Sim**, arquivada nesta data |
| [`assets/kmep-ultra-folheto-us.pdf`](assets/kmep-ultra-folheto-us.pdf) | Folheto 10×15 cm impresso da LLC, duas faces: capa de marca e argumento de venda | EN | Não. O arquivo recebido é idêntico byte a byte ao já arquivado |

Os dois PDFs são imagem, sem camada de texto. A leitura foi feita renderizando as páginas em
150 a 300 dpi.

### O que as duas fontes têm em comum

As duas **abrem pela aplicação, não pelo produto.** A ficha BR tem como título *"Potencialize sua
aplicação"*. O folheto americano fecha com *"Optimize every application"*. E **nenhuma das duas
menciona inseto ou inseticida**: a ficha BR descreve o KMEP apenas como fertilizante foliar, e o
folheto fala em *spray performance*. Os dois pontos confirmam a porta de entrada da página e pesam
na decisão da seção 4.2.

---

## 2. O que a ficha técnica BR traz de novo

### 2.1 Garantias (resolve a parte numérica de P3)

| Nutriente | % p/p | g/L |
|---|---|---|
| N solúvel em água | 1,2 | 14,4 |
| P₂O₅ solúvel em água | 1,0 | 12,0 |
| K₂O solúvel em água | 15,0 | 180,0 |

- **Densidade implícita:** 180 g/L ÷ 15% = 1,20 kg/L, cerca de **10,0 lb/gal**.
- **Fórmula no padrão americano (N-P₂O₅-K₂O):** 1.2-1-15. O rótulo americano (P1) pode arredondar
  ou declarar diferente, e ainda falta o *derived from*. **Não publicar antes do rótulo.**

### 2.2 Dose, estágio e número de aplicações, convertidos

Fator: 1 L/ha = 13,68 fl oz/ac. A ficha usa 400 L/ha de calda quando a dose vem por concentração
(mL/100 L), então 500 mL/100 L equivalem a 2,0 L/ha.

| Cultura | Dose BR | Em fl oz/ac | Quando | Relevância nos EUA |
|---|---|---|---|---|
| **Milho** | 1,0 a 2,0 L/ha | **14 a 27** | Começar em V4 e V6, e de novo na formação da espiga | Posicionada |
| **Soja** | 0,8 a 1,5 L/ha | **11 a 21** | Começar em V6/V7 e repetir a cada 10 a 15 dias | Posicionada |
| Algodão | 1,5 a 2,0 L/ha | 21 a 27 | 4 a 6 aplicações semanais, a partir de 40 dias após a emergência | Em revisão técnica |
| Feijão | 1,0 a 2,0 L/ha | 14 a 27 | Após a florada, a cada 10 a 15 dias | *Dry beans* (ND, MI, NE) |
| Batata | 1,0 a 2,0 L/ha | 14 a 27 | Semanal, a partir de 50 dias após a emergência | Alta (ID, WA) |
| Cebola, alho | 1,0 a 2,0 L/ha | 14 a 27 | Semanal, a partir de 50 dias após o transplante | Média |
| Cenoura, beterraba | 1,0 a 2,0 L/ha | 14 a 27 | Semanal, a partir de 40 dias após a emergência | Média |
| Tomate, pimentão | 200 a 300 mL/100 L | ≈11 a 16 | Semanal, a partir de 40 dias após o transplante | Alta na Flórida |
| **Citros** | 2,0 L/ha | 27 | Quinzenal, na fase de frutificação | **Alta: a LLC fica em Lakeland (P30)** |
| Frutíferas em geral | 200 a 300 mL/100 L | ≈11 a 16* | 3 a 4 aplicações por ano, após o florescimento | Média |
| Hortaliças em geral | 150 a 200 mL/100 L | ≈8 a 11 | Quinzenal, a partir de 30 dias | Média |
| Café | 2,0 L/ha | 27 | 2 aplicações, na granação e na maturação | Não vai para os EUA |

\* Pomar costuma trabalhar com volume de calda maior que 400 L/ha, e a conversão por acre subestima.

**Duas conclusões:**

1. **A régua de estágios do `K13` já estava certa.** Milho em V4, V6 e formação da espiga, e soja
   em V6/V7 com repetição de 10 a 15 dias, batem com a ficha. Agora o que o canônico chamava de
   "rótulo 2026" tem documento de origem.
2. **Isso não fecha P4.** É rótulo brasileiro. E a ficha supõe 400 L/ha de calda (≈43 gal/ac),
   enquanto o pulverizador terrestre americano trabalha em volume bem menor. Ver P34.

### 2.3 Embalagens

A ficha diz **5 L e 20 L**. O `01-PRODUTO.md` dizia 10 L e 20 L, e o `alt` do galão no `K13` diz
*"2.5 gal jug with the U.S. label"*. São três versões diferentes. Nenhuma embalagem americana foi
confirmada (P1, P35).

### 2.4 O que a ficha diz e a página **não pode** repetir

A ficha lista seis "efeitos". Nenhum deles entra na página americana:

| Efeito na ficha BR | Por que não entra |
|---|---|
| Melhora o metabolismo da planta | Efeito na planta, proibido pela regra da casa (FIFRA) |
| Confere maior resistência às situações adversas | Claim de tolerância a estresse. É o território de bioestimulante e regulador de crescimento, e é o que a EPA lê como *plant regulator* |
| Maior pegamento da florada | Efeito fisiológico, também território de regulador de crescimento |
| Maior frutificação | Mesmo caso |
| Plantas com maior vigor | Efeito na planta, e contradiz a restrição de arte do `K10` (nunca a planta tratada maior) |
| Maturação mais uniforme | É literalmente a definição de regulador de crescimento na FIFRA: acelerar ou retardar a maturação |

**O que pode ser aproveitado com outra forma:** a descrição da ficha diz que o produto serve às
plantas "que necessitam do aumento de translocação de açúcares". Como efeito do produto, não pode
ser dito. Como **função do potássio**, que é agronomia de livro, pode, e explica o que o `K7` hoje
só afirma: por que a demanda de potássio bate no pico durante o enchimento de grão. Proposta na
seção 4.3.

---

## 3. O que já foi corrigido nesta curadoria

### 3.1 O arredondamento do tratado: 221.3 virou 221.2

231,45 sc/ha × 0,9559 = **221,24 bu/ac**, que arredonda para 221.2, e não 221.3. Com 221.3, a
página publicava duas colunas cuja diferença é 9.0 e, ao lado, *"+8.9"*. É a primeira conta que um
agrônomo faz. Com 221.2 − 212.3 = 8.9, os três números fecham, e o +4,2% também.

Trocado em `web/src/content/kmep.ts`, no espelho `pt/kmep.ts`, no canônico, no `01`, `03`, `06` e
no `README.md`. O protótipo `site/` ficou como estava, porque é histórico.

### 3.2 "Close to the U.S. national average" era falso

A resposta do FAQ dizia que a testemunha de 212,3 bu/ac estava *"close to the U.S. national
average"*. A média americana de 2025 foi de cerca de **186 bu/ac**, um recorde, e em 2024 foi de
179,3 (USDA NASS, *Crop Production*, 14/11/2025). A testemunha do KMEP está **14% acima** da
média. A frase veio do ensaio do Acorda (testemunha de 175,3 bu/ac), foi copiada para o KMEP e
deixou de ser verdadeira no caminho.

O argumento honesto é melhor que o antigo. Uma resposta de +8,9 bu/ac sobre uma testemunha forte
vale mais, e não menos. A resposta nova, já aplicada:

> Because the check was not a weak field. The untreated corn in our trial ran 212.3 bu/ac, well
> above the 2025 U.S. average of about 186 bu/ac and close to Illinois at 217. A response on top of
> a check that strong is harder to get, not easier.

Saiu também *"it was run in harder ones"*, que não tinha fonte.

---

## 4. O que precisa de decisão

Em ordem de risco.

### 4.1 O bloco K8 (ação desalojante) está sendo renderizado

`web/src/app/kmep/page.tsx` monta `<Flush />`, e o `Operation` e o `Questions` imprimem os trechos
`hold`. O canônico diz que a página "publica sem o bloco". Hoje ela **não** publica sem ele. Se a
rota for ao ar antes da P2, o claim de maior risco FIFRA do site vai junto, e os dois materiais
oficiais da Juma evitam exatamente esse claim.

**Recomendação:** tirar o K8 da rota pública agora, com uma *flag* ou removendo as três linhas, e
manter o componente para revisão.

### 4.2 A palavra *insecticide* aparece 23 vezes na página. Nos dois materiais oficiais, nenhuma

A página ancora cada entrega no *insecticide pass*. A ficha BR vende o KMEP como fertilizante
foliar, com aplicações semanais em hortaliças que não acompanham inseticida nenhum. O folheto
americano fala em *every application*. Amarrar o produto sempre ao inseticida:

- aproxima a página do claim que a P2 ainda não liberou: um aditivo cujo valor está no inseticida;
- encolhe o mercado para quem já faz passada de inseticida.

**Recomendação:** trocar *insecticide pass* por **the spray pass you already run** nos pontos em
que a palavra só marca o momento da aplicação, e manter *insecticide* onde ela é necessária: na
ressalva obrigatória de rodapé e na pergunta *"Can I cut my insecticide rate?"*. Muda o
posicionamento do canônico, então fica para você e a Juma decidirem.

### 4.3 A quantidade de potássio por passada

A 1,0 a 2,0 L/ha, uma passada entrega de **0,16 a 0,32 lb de K₂O por acre**, ou seja, de 2,6 a
5,1 oz. A extração de uma lavoura de milho de 200 bu/ac se mede em centenas de libras de K₂O por
acre. O `K7` (*"Grain fill runs on potassium the root may not deliver in time"*) e o card 3 do `K9`
dão a entender que a passada cobre esse déficit. O agrônomo que fizer a conta perde a confiança na
página inteira.

A página já tem o antídoto (*"If all you need is potassium, buy potassium"*, no `K14`). Faltam duas
peças, **pendentes de revisão do técnico da Juma**:

- **No `K7`, a função do potássio** (vem da ficha, dita como agronomia):
  > Potassium is the nutrient the plant uses to load sugar into the phloem and move it into the
  > kernel. That is why the demand peaks when it does.
- **No `K16`, uma pergunta nova que se antecipa à conta do agrônomo:**
  > **How much potassium is in one pass?** Ounces, not pounds: a few ounces of K₂O per acre, placed
  > on the leaf in the weeks it counts. It is not a potash program and it does not replace one.

  Os números exatos só entram com o rótulo americano (P3, P4).

### 4.4 O custo de $6 não diz a que dose corresponde

A ficha dá **faixa** de dose, e no milho a ponta alta é o dobro da baixa. *"Six dollars an acre at
the label rate"* só é verdade para uma dose específica, e a calculadora do `K11` fixa `cost: 6`.
Se $6 for a dose mínima, quem aplica a máxima paga cerca de $12. A conta ainda fecha
($38,27 − $12), mas a página promete um número.

**Recomendação:** perguntar à Juma a que dose corresponde o $6 (P33). Até lá, a página pode manter
o texto atual. Com a resposta, escrever *"at X fl oz/ac"* ao lado do preço.

### 4.5 Culturas além de milho e soja

A ficha posiciona 14 culturas. O `K13` diz *"Cotton and specialty crops are under technical
review"*, e o bloco *"Growing something else?"* previsto no canônico não existe na página. **Citros
é o caso mais forte:** a LLC fica em Lakeland, no meio do cinturão citrícola da Flórida (P30), e a
ficha tem dose e janela para citros.

**Recomendação:** construir o *"Growing something else?"* como captura de lead, só com os nomes
das culturas (cotton, dry beans, potatoes, onions, tomatoes and peppers, citrus) e **sem dose**,
que depende de P4 e P6. As doses convertidas da seção 2.2 ficam para a hora do rótulo.

### 4.6 Volume de calda e o argumento de deposição

Todo o `K6` fala do que a gota faz. A única referência de uso da Juma é de 400 L/ha. O operador
americano que trabalha com 10 a 15 gal/ac vai perguntar se o efeito se mantém com gota menor e
calda mais concentrada (P34). Sem resposta, não há mudança de copy, mas a pergunta deve entrar no
FAQ assim que a Juma responder.

---

## 5. O folheto americano: o que ainda não foi aproveitado

| Linha do folheto | Situação | Onde entraria |
|---|---|---|
| *"The difference is often not the chemistry, it's how well the application performs."* | **Não está na página.** É a frase mais forte do folheto e já foi impressa pela Juma | Abertura do `K6`, logo antes de *"What the droplet does before it dries"*. É a ponte exata entre a perda (K3/K4) e o Trabalho 1 |
| *"Maximize input investment. Get the most from every application."* | Não está | Vocabulário do produtor americano (*input investment*). Entraria como título do card 1 do `K9` ou abertura do `K11` |
| *"Small unseen losses become large economic impact."* | Parafraseada no `K4` | Manter a paráfrase |
| *"Enhances application efficacy… to ensure the product reaches the target"* | Usada com a promessa suavizada (*"more of what you bought reaches the target"*) | A página está certa: *ensure* é absoluto |
| *"Supports consistency across varying conditions and growth stages"* | Usada no `K6` (7 a.m. e 2 p.m.) | Está bem |
| *"Only $6 per acre per spray"* | Usada | Ver 4.4 |
| *"Powering Growth"* (capa) | Não está | **Não usar no corpo da página.** O slogan fala de crescimento, que é efeito na planta, e o tom dele destoa da voz da página. Serve para a imagem de compartilhamento (OG) ou para o rodapé da marca |

**Erros do folheto para avisar a Juma** (não afetam a página, mas vão para campo impressos):

1. A barra de benefícios repete *"Protect yield potential — Reduce hidden losses and increase ROI"*
   duas vezes seguidas, com ícones diferentes.
2. O béquer está graduado em mL e traz o selo *"500 mL"*, unidade métrica numa peça americana.
3. O texto usa *"KMEP"* sem *Ultra®*, e a marca registrada é *KMEP Ultra®*.
4. *"Ensure the product reaches the target"* é uma promessa absoluta.

### Identidade visual do produto

A marca do KMEP Ultra é preta, branca e vermelha: o raio vermelho do logo e a colmeia de
hexágonos com traço vermelho na capa do folheto. A LP usa o sistema da `/aminosan-b`, com acento
cobre para perda e custo. Os capítulos em preto (Blackout) já conversam com a capa. O vermelho do
raio não aparece em lugar nenhum. Não é erro, mas vale decidir se o acento cobre deve se aproximar
do vermelho da marca, ou se o raio deve aparecer ao menos no logo do hero.

---

## 6. Veredito por seção

| Seção | Veredito | Ação |
|---|---|---|
| K1 Hero | Mantém | — |
| K2 Faixa de prova | Corrigida | 221.2 (3.1). Falta o ano (P21) |
| K3 Problema | Mantém | — |
| K4 Custo da perda | Mantém | — |
| K5 Uma passada, dois trabalhos | Mantém | Considerar 4.2 |
| K6 Deposição | Ajusta | Frase do folheto na abertura (seção 5). P34 |
| K7 Potássio | Ajusta | Função do potássio na translocação de açúcar (4.3), após revisão técnica |
| K8 Desalojante | **Tirar da rota pública** | 4.1 |
| K9 Operação | Ajusta | *Input investment* (seção 5). Card 3 sem sugerir que cobre déficit (4.3) |
| K10 Prova | Corrigida | 221.2 |
| K11 Conta por acre | Pendente | Dose do $6 (P33) |
| K12 Credencial | Mantém | P19 |
| K13 Quando entra | Confirmado pela ficha | Estágios têm fonte. Dose (P4), embalagem (P35), `alt` do galão |
| K14 Para quem é | Mantém | É a peça mais honesta da página. Considerar 4.2 |
| K15 Faixa de teste | Mantém | — |
| K16 Perguntas | Corrigida e ampliada | 3.2 aplicada. Pergunta nova sobre a quantidade de potássio (4.3). Pergunta de volume de calda quando P34 voltar |
| K17 Pedido | Mantém | P11 |
