# 04 · Pendências

O que a Juma precisa responder, o que cada resposta destrava e o que o site faz enquanto ela não
chega. **Nenhuma pendência justifica atrasar a entrega** — todas têm estado degradado definido.

Os códigos `P1`–`P32` são os mesmos usados nas etiquetas do protótipo em `site/`. Não renumerar.

**Atenção:** os itens regulatórios precisam ser dirigidos a quem responde pelo **regulatório da LLC
nos EUA**, não ao marketing.

---

## O pedido que resolve mais de um item

### Rótulo aprovado nos EUA do KMEP Ultra e do Aminosan, em PDF (P1)

Nos Estados Unidos o rótulo é a fonte da verdade legal do produto: **o que está nele é o que pode
ser dito na comunicação.** Um único arquivo por produto entrega de uma vez:

- Guaranteed Analysis completo (**P3**)
- "Derived from" (obrigatório no rótulo americano)
- Claims autorizados — define a copy da landing page (**P2**)
- Dose e modo de uso em unidades americanas (**P4**)
- Densidade, embalagens e precauções

**Se o rótulo americano ainda não existe**, isso por si só é a informação mais importante do
projeto, porque muda o que as páginas podem afirmar.

---

## Painel completo

| ID | Pendência | A quem pedir | O que trava |
|---|---|---|---|
| **P1** | Rótulo americano aprovado dos dois produtos, em PDF | Regulatório da LLC | Resolve P2, P3 e parte de P4 |
| **P2** | Validação regulatória da copy — **dos dois produtos** | Regulatório / consultoria FIFRA | Toda a copy do site |
| **P3** | Guaranteed Analysis completo | Regulatório / técnico | Ficha técnica das LPs. Sem ela, dealer não valida a página |
| **P4** | Dose em `fl oz/acre` ou `gal/acre`, por cultura e estágio | Técnico | Ficha técnica e tabela de aplicação |
| **P5** | Mercado-alvo: **row crop × specialty crop** | Diretoria / comercial | Culturas, mapa, CTA, tom da copy — e o design da Home |
| **P6** | Culturas americanas em que cada produto funciona | Técnico / agronômico | Seção de culturas, mapa e a tabela estado→cultura |
| **P7** | Modelo de venda: direto, distribuidor, retail ou private label | Comercial | O CTA e possivelmente a premissa de conversão |
| **P8** | Preço por galão e custo por acre nos EUA | Comercial | A seção de ROI — o argumento que mais converte |
| **P9** | Testemunha dos ensaios de Aminosan (Taquarivaí e Lavras) | Técnico / P&D | Define se o número mais forte da empresa pode ser publicado |
| **P10** | Registros estaduais ativos como fertilizante, por estado | Regulatório | Quais estados destacar no mapa e onde pode vender hoje |
| **P11** | Contato da LLC: nome, cargo, e-mail, telefone US, fuso, idiomas | Comercial | Formulário, footer e a honestidade do CTA |
| **P12** | Fotos de produto com rótulo americano | Marketing | Hero e cards — evita a leitura de "site traduzido" |
| **P13** | Fotos de campo, aplicação e equipe nos EUA, em alta | Marketing | Hero e seções. Fallback: banco de imagens |
| **P14** | SDS dos dois produtos, versão americana, em PDF | Regulatório / técnico | Link obrigatório na LP |
| **P15** | Depoimentos: existe produtor americano? Os do `/en` são reais? | Marketing | Se não houver, a seção não entra |
| **P16** | Domínio definido, comprado, com acesso ao registrador | Cliente / TI | Deploy de produção e DNS |
| **P17** | Decisão sobre o `/en` do site BR: redirect, canonical ou despublicar | Cliente | Conflito de indexação entre os dois sites |
| **P18** | Política de privacidade e termos (com CCPA) | Jurídico / Oceon | Rodapé, formulário e conformidade da geolocalização |
| **P19** | Autorização para citar DETEC, Rehagro, Terras Gerais, JP Agrícola, NITEC/UNESP | Jurídico / técnico | Toda a prova institucional e as tabelas de resultado |
| **P20** | Existe ensaio nos EUA, mesmo preliminar ou de demonstração? | Técnico | Um dado local vale mais que dez brasileiros |
| **P21** | Delineamento dos ensaios brasileiros e ensaio de universidade | Técnico / P&D | A credibilidade da seção de resultados no crivo americano |
| **P22** | Material técnico sobre KMEP Ultra e cigarrinha (nº de ensaios, anos, locais) | Técnico | O maior diferencial disponível — e perecível |
| **P23** | Categoria nos EUA: fertilizante, biostimulante ou adjuvante | Regulatório | O vocabulário inteiro da copy e o enquadramento legal |
| **P24** | Certificações: OMRI, CDFA OIM, WSDA, TFI biostimulant | Regulatório / comercial | Acesso a mercados orgânico e Califórnia |
| **P25** | Prop 65 da Califórnia e limites estaduais de metais pesados | Regulatório | Poder vender na Califórnia |
| **P26** | Identidade da LLC: razão social, endereço, telefone, logo, manual de marca | Marketing | Rodapé e design system |
| **P27** | CRM em uso e credenciais de integração | Comercial / TI | Integração do formulário (senão, e-mail + WhatsApp) |
| **P28** | Leitura de concorrência e diferencial declarado | Comercial | Posicionamento e diferenciação da copy |
| **P29** | Quais são os outros dois produtos e quando entram | Comercial | Não bloqueia a v1; evita refazer o template depois |
| **P30** | **Por que Lakeland?** Logística, citros ou parceiro comercial | Diretoria | A tese comercial inteira |
| **P31** | **Dado de deposição, cobertura, espectro de gotas ou tensão superficial do KMEP** | Técnico / P&D | **O eixo de posicionamento de toda a LP KMEP** |
| **P32** | Incremento de produtividade exato do artigo da Revista Foco + autorização para citá-lo | Técnico / jurídico | O número está em figura, não em texto, no artigo publicado |

**Sem número:** o **ano do ensaio Rehagro** não consta em nenhum documento auditado. Tabela de
resultado sem ano levanta suspeita imediata em leitor técnico — cobrar junto de P21.
E: **a Juma banca o produto da faixa de teste?** Quantos acres, quantos produtores por safra, quem
acompanha a colheita?

---

## Fila de prioridade

| Ordem | Item | Por quê |
|---|---|---|
| 1 | **P1 · P2** — Rótulo e validação regulatória | Define toda a copy, dos dois produtos. Item mais urgente do projeto |
| 2 | **P5 · P30** — Mercado-alvo e a razão de Lakeland | Sem isso não se desenha a Home |
| 3 | **P31** — Dado de deposição do KMEP | Define o eixo inteiro da LP mais difícil |
| 4 | **P3 · P4** — Guaranteed Analysis e dose | Ficha técnica das duas LPs |
| 5 | **P6 · P7** — Culturas americanas e canal | Seção de culturas, mapa e possivelmente o CTA |
| 6 | **P8** — Preço e custo por acre | É o argumento que mais converte |
| 7 | **P9 · P19 · P21** — Prova: testemunha, autorização, delineamento | Coração das LPs |
| 8 | **P11 · P16 · P26** — Contato, domínio, identidade | Bloqueiam formulário, deploy e rodapé |
| 9 | **P12 · P13 · P14** — Assets e SDS | Bloqueiam design |
| 10 | **P22 · P28 · P29** — Cigarrinha, concorrência, futuros | Enriquecem, não bloqueiam |

---

## O que trava o quê — e o estado degradado

| ID | Trava | Estado degradado |
|---|---|---|
| **P31** | Eixo de posicionamento da LP KMEP | Publica no eixo A (potássio) e `K8` troca de conteúdo |
| **P2** | `K1` `K3` `K4` Trilha B · revisão de `S6` `A3` `A4` | Publica em Trilha A / eixo B. Perde a cunha da cigarrinha |
| **P1 · P3** | `K10` `A10` e a tabela comparativa de `A4` | Ficha técnica sai da v1 e entra por deploy posterior |
| **P4** | `K9` `A9` | Publica só com estágios; CTA vira "peça a tabela de doses" |
| **P5** | Seletor de cultura, tom geral | Seletor cobre os dois cenários. Some quando a resposta vier |
| **P6** | `S5` `K2` `A2` `K9` `A9` | Abre com milho e soja; specialty vira captura de lead |
| **P8** | `K7` `A7` | **Remover as duas seções de ROI.** Meia conta é pior que nenhuma |
| **P9** | `S2` slot 4 · `A6` `A7` | `A6` publica no estado provisório, que aplica a regra da casa em público |
| **P10** | `K10` `A10` `K11` `A11` | Convidar o visitante a perguntar pelo estado dele |
| **P11** | `S0` `S7` `S8` `K12` `A12` | CTA recua de "Talk to an agronomist" para "Request product info" |
| **P12** | `S4` `K1` `A1` `K10` `A10` | Composição tipográfica do nome. **Nunca o frasco brasileiro** |
| **P13** | `S1` `S3` `K3` `A3` | Macro licenciado, com curadoria rigorosa |
| **P19** | `S7` `K5` `K6` `A6` | Recuar para "field trial, Brazil" e oferecer a fonte por e-mail. Enfraquece muito |
| **P20** | `K11` `A11` | Responder "não, ainda" com a oferta de faixa de teste |
| **P26** | `S0` `S6` `S9` `A8` | Seções funcionam só com tipografia |

---

## Detalhamento dos itens críticos

### P2 — Situação regulatória do KMEP Ultra

- O produto está registrado na **EPA**? Se sim, número.
- Está registrado como **fertilizante** em quais estados? Números por estado.
- Existe consultoria ou responsável regulatório nos EUA? Nome e contato.
- Os claims usados no Brasil — *ação desalojante, expõe a praga escondida, aumenta o contato com o
  inseticida* — **já foram revisados por alguém nos EUA?**
- **A copy do site será revisada sob a ótica da FIFRA antes do ar?** Por quem e com que prazo?

> **Por que perguntamos:** sob a FIFRA, um produto com claim de desalojar, expor ou aumentar o
> controle de praga pode ser enquadrado como pesticida, exigindo registro na EPA. Adjuvantes
> normalmente escapam por não fazerem claim de eficácia. Esse mesmo texto **já está no ar hoje** em
> `juma-agro.com.br/en`.

### P3 — Guaranteed Analysis, como consta no rótulo americano

| Campo | KMEP Ultra | Aminosan |
|---|---|---|
| Total Nitrogen (N) % | | |
| Available Phosphate (P₂O₅) % | | |
| Soluble Potash (K₂O) % | | |
| Micronutrientes (%) | | |
| **Free amino acids (%)** | | ← o número mais importante da tabela do Aminosan |
| Organic carbon (%) | | |
| Derived from | | |
| Densidade (lb/gal) | | |
| pH | | |

### P4 — Dose e posicionamento em unidades americanas

Dose em `fl oz/acre` ou `gal/acre`, por cultura · estágio em terminologia americana (V3, V6, R1,
R3…) · número de aplicações por ciclo · compatibilidade de mistura e ordem no tanque · restrições:
intervalo pré-colheita, temperatura, incompatibilidades conhecidas.

### P9 — A testemunha dos ensaios de Aminosan

Os dois resultados publicados aparecem **sem a testemunha ao lado**: Taquarivaí/SP `+11 e +14 sc/ha`
(DETEC) e Lavras/MG `+10 sc/ha` (Terras Gerais). Precisamos, para cada um: **produtividade da
testemunha**, ano, cultivar, número de repetições e delineamento.

> **Por que importa:** é o número mais forte que a Juma tem e hoje é o mais frágil. Sem testemunha,
> um agrônomo americano lê como ganho de 20% a 24% e desconfia. Com a testemunha ao lado ele
> consegue conferir — e a base dos outros ensaios (52,6 bu/ac em soja) bate quase exatamente na
> média nacional americana, o que joga a favor de vocês.

### P5 · P30 — Estratégia de mercado

- Qual é o **mercado-alvo prioritário nos primeiros 24 meses**: row crop de escala ou specialty crop
  de alto valor? Se ambos, qual vem primeiro?
- **Por que Lakeland?** Logística e porto, proximidade do citros, ou presença de um parceiro?
- Existe **meta de faturamento ou volume** para os EUA? Em quantos acres?
- A Juma quer ser conhecida nos EUA como empresa de **nutrição vegetal**, de **tecnologia de
  aplicação**, ou como **marca brasileira de agro**?
- Quais **estados são prioridade comercial** nos primeiros 12 meses, e por quê?
- A Juma já tem **presença, parceiro ou cliente** em algum estado?

### P6 — Culturas e adequação técnica

- Para **KMEP Ultra** e **Aminosan**, separadamente: em quais culturas americanas o produto tem
  eficácia e posicionamento definidos? **Incluir culturas que não existem no Brasil** — amêndoa,
  morango, uva, folhosas, amendoim, trigo, arroz, alfafa.
- Existe alguma cultura americana em que o produto **não** deve ser posicionado?
- Existe **restrição de rótulo** que limite culturas nos EUA?

### P22 — O caso do corn leafhopper

- A Juma tem consciência de que o **corn leafhopper chegou aos EUA** e está em 16 estados?
- Quanto material técnico existe sobre KMEP Ultra e cigarrinha: **quantos ensaios, quantos anos,
  quantos locais, qual delineamento**? O ensaio Rehagro é o único?
- Existe **agrônomo da Juma** capaz de falar sobre manejo de cigarrinha com público americano — em
  webinar, artigo técnico ou field day?
- A Juma vê o posicionamento *"o Brasil convive com essa praga há uma década"* como **ativo de
  marca** a explorar nos EUA?

### P7 · P11 — Canal e atendimento

- **Como a Juma pretende vender nos EUA:** direto ao produtor, via distribuidor, via retail, ou
  private label? Já existe distribuidor ou revenda? Em quais estados?
- Há conversa em andamento com **retail nacional** — Nutrien Ag Solutions, Helena, Wilbur-Ellis,
  GROWMARK?
- Quem **atende o lead** nos EUA: nome, cargo, e-mail, telefone americano, fuso, idiomas?
- O time americano é **agronômico ou apenas comercial**? Define se o CTA "Talk to an agronomist" é
  honesto.
- Existe CRM? Existe WhatsApp Business com número americano?

---

## Texto sugerido para o pedido crítico

> **Assunto: Juma-Agro USA — informações regulatórias e técnicas para as páginas de produto**
>
> Olá Rodrigo, tudo bem?
>
> Estamos desenvolvendo as páginas do KMEP Ultra e do Aminosan para o mercado americano e precisamos
> de algumas informações para que a comunicação reflita exatamente o que está autorizado nos
> Estados Unidos.
>
> O item mais importante é o **rótulo aprovado dos dois produtos nos EUA, em PDF**. Nos Estados
> Unidos o rótulo define o que pode ser afirmado na comunicação, e ele nos entrega de uma vez o
> Guaranteed Analysis, os claims permitidos, a dose por acre e o "derived from".
>
> Junto com isso, precisamos saber com quem podemos falar sobre o **regulatório da Juma-Agro
> Fertilizer LLC**. A questão específica é sobre o KMEP Ultra: no Brasil ele é comunicado como
> potencializador de inseticida com ação desalojante, e nos Estados Unidos claims de desalojar ou
> aumentar o controle de praga podem exigir registro na EPA. Queremos confirmar o que está
> autorizado antes de escrever a página — e temos uma alternativa pronta pelo eixo nutricional, caso
> seja necessário.
>
> Por fim, dois itens rápidos: a **produtividade da testemunha** nos ensaios de Aminosan de
> Taquarivaí e Lavras (temos o ganho, mas não a base de comparação), e o **contato comercial nos
> Estados Unidos** que receberá os leads do site.
>
> Como a entrega está prevista para 30/08, esses itens são os que definem o cronograma. Consegue nos
> ajudar a direcionar?
>
> Abraço,
> Gustavo — Oceon

---

## Riscos

| Risco | Prob. | Impacto | Mitigação |
|---|---|---|---|
| Resposta regulatória atrasa | Alta | Alto | Pedir no dia 1; plano B nutricional pronto |
| Design system atrasa e serializa o time | Média | Alto | Entregar tokens no dia 1, cobrança diária |
| Guaranteed Analysis não chega | Média | Médio | Publicar LP sem a seção e adicionar depois |
| Domínio não definido a tempo | Média | Alto | Subir em domínio provisório da Vercel |
| Fotos de campo americano não chegam | Alta | Médio | Banco de imagens licenciado, só macro |
| Cliente pede mudança estrutural na revisão | Média | Alto | Antecipar a revisão de Home |
