# PRD — Juma-Agro USA

**Versão:** 1.0 · 07/08/2026
**Autor:** Oceon Desenvolvimento Digital
**Entrega:** 30/08/2026 (23 dias)
**Fontes:** `Briefing-Juma-Agro-USA-Figma.pdf` (jul/2026) · `juma-agro-empresa-e-produtos.md` · site `juma-agro.com.br`

---

## 1. Contexto

A Juma Agro é uma indústria brasileira de fertilizantes especiais e aminoácidos, fundada em 1988 em Mogi Guaçu/SP, com laboratório próprio e quase quatro décadas de ensaios de campo. Em 2026 opera uma filial nos Estados Unidos — a **Juma-Agro Fertilizer LLC**, em Lakeland, Flórida — e precisa de presença digital própria para esse mercado.

Existe um briefing de julho/2026 para protótipo Figma, ainda incompleto: define direção visual e estrutura de páginas, mas não fecha domínio, conversão, tratamento de dados, regulatório nem cronograma. Este PRD fecha essas lacunas.

**Descoberta que redefine o projeto:** o site brasileiro (`juma-agro.com.br`) já tem uma versão inteiramente traduzida para inglês em `/en`, indexada, com as 10 culturas, produtos e depoimentos. O briefing diz explicitamente "não é uma cópia traduzida" — mas é exatamente isso que já está no ar. O site USA nasce, portanto, tendo que se diferenciar de uma versão em inglês existente, e essa duplicidade precisa ser resolvida no lançamento.

**Resultado pretendido:** três páginas em inglês, com domínio próprio nos EUA, que apresentem a Juma-Agro como operação americana com lastro brasileiro, e convertam o produtor ou agrônomo em conversa comercial com a LLC da Flórida.

---

## 2. Objetivo e métricas

**Objetivo primário:** gerar leads qualificados de produtores e agrônomos americanos para o time da Juma-Agro Fertilizer LLC.

| Métrica | Alvo v1 |
|---|---|
| Conversão visitante → lead | ≥ 2,5% |
| LCP (mobile, 4G) | < 2,5s |
| Lighthouse Performance / A11y | ≥ 90 |
| Páginas indexadas sem conflito com `/en` | 100% |

Sem histórico de tráfego não há baseline; os alvos servem como referência de qualidade técnica, não como compromisso comercial.

---

## 3. Decisões travadas

| Tema | Decisão |
|---|---|
| Conversão | Lead do produtor/agrônomo, atendido pela LLC na Flórida |
| Domínio | Domínio próprio dos EUA, operação digital separada do site BR |
| Resultados de ensaio | Citados, em `bu/ac` com `sc/ha` ao lado, sempre com fonte e testemunha |
| Posicionamento | Agro brasileiro como credencial, em seção dedicada na Home |
| Codebase | Repositório novo, Next.js + Tailwind |
| Regionalização | Mapa dos EUA + reordenação de culturas por geolocalização de IP |
| Prazo | 23 dias — entrega 30/08/2026 |
| Escopo | 3 páginas: Home, KMEP Ultra, Aminosan |

---

## 4. Posicionamento

### A tese

O Brasil não é uma ressalva a ser explicada ao produtor americano. É a credencial.

O Brasil produz mais soja que os Estados Unidos e é o único grande produtor que tira duas a três safras do mesmo talhão no mesmo ano. Para um agrônomo americano isso significa algo concreto: **no Brasil não existe inverno para quebrar o ciclo da praga.** A pressão é de 12 meses, o estresse térmico é rotina e o veranico chega no enchimento. Um produto validado nesse regime foi testado sob severidade que o Corn Belt não impõe.

**Linha-mestra:** *Proven where the growing season never stops.*

Quarenta anos de Aminosan sobre agricultura tropical é um ativo que nenhum concorrente americano de biostimulante tem. O enquadramento não é "apesar de brasileiro" — é "porque brasileiro".

### O mecanismo de credibilidade

A regra da casa da Juma já é a resposta certa para o ceticismo americano: **todo número anda com fonte, local e testemunha ao lado.**

- `57.7 vs 52.6 bu/ac — Acorda Ultra, field trial, Brazil` é auditável.
- `+10% yield` solto é propaganda.

O primeiro formato é o que um agrônomo americano respeita. A empresa já faz isso; o trabalho é não perder na tradução.

### Conversões de referência

Soja: 1 sc/ha = 0,892 bu/ac · Milho: 1 sc/ha = 0,956 bu/ac · Cana: 1 t/ha = 0,446 ton/ac

| Produto | Cultura | Original | Convertido | Δ | Fonte |
|---|---|---|---|---|---|
| Acorda Ultra | Soja | 64,7 vs 58,9 sc/ha | 57,7 vs 52,6 bu/ac | +5,2 (+9,8%) | Field trial |
| Acorda Ultra | Milho | 196,8 vs 183,4 sc/ha | 188,1 vs 175,3 bu/ac | +12,8 (+7,3%) | Field trial |
| KMEP Ultra | Milho | 231,45 vs 222,12 sc/ha | 221,3 vs 212,3 bu/ac | +8,9 (+4,2%) | Rehagro |
| FitoFert | Soja | 66,30 vs 61,70 sc/ha | 59,2 vs 55,0 bu/ac | +4,1 (+7,5%) | JP Agrícola |
| Aminosan | Soja | +11 e +14 sc/ha | +9,8 e +12,5 bu/ac | sem testemunha | DETEC |
| Aminosan | Soja | +10 sc/ha | +8,9 bu/ac | sem testemunha | Terras Gerais |

**Observação relevante:** as testemunhas dos ensaios brasileiros (52,6 bu/ac soja, 175,3 bu/ac milho) batem quase exatamente na média nacional americana. Os ensaios são diretamente comparáveis ao benchmark dos EUA — isso é um ativo forte, e deve ser dito explicitamente na página.

**Exceção:** os dois resultados de Aminosan aparecem sem testemunha publicada. Se a base for equivalente, representam +19% a +24%, faixa que atrai ceticismo. **Pedir a testemunha à Juma antes de publicar** (ver §10). Sem ela, publicar apenas o de Lavras/MG (+8,9 bu/ac) ou tratar de forma qualitativa.

---

## 5. Escopo

**Dentro da v1**

1. **Home USA** — apresenta a operação americana
2. **Landing page KMEP Ultra** — página comercial de conversão
3. **Landing page Aminosan** — página comercial de conversão
4. Formulário de lead, header, footer, menu mobile
5. Mapa dos EUA com reordenação de culturas por geolocalização

**Fora da v1** (arquitetura preparada, conteúdo depois)

- Página "Sobre" dedicada — coberta pela seção institucional da Home
- Os dois produtos futuros — template de produto reutilizável já preparado
- Blog / artigos técnicos
- Espanhol (ver §14)
- Dealer locator, e-commerce, calculadora de produtividade

---

## 6. Arquitetura das páginas

### 6.1 Home USA

| # | Seção | Função |
|---|---|---|
| 1 | Hero | Headline grande, imagem de campo americano, subtítulo objetivo, CTA primário. Animação de entrada curta |
| 2 | Barra de prova | 3–4 números com fonte ao lado. Não usar números sem testemunha |
| 3 | Problema | O custo invisível entre o que o campo entrega e o que poderia entregar |
| 4 | Produtos | Dois cards, benefício principal + CTA para a LP |
| 5 | **Culturas + mapa** | Mapa dos EUA e grid de culturas reordenado por geolocalização (§7) |
| 6 | **Brazil story** | Seção dedicada: 1988, Sr. Julio Matino, 40 anos de Aminosan, laboratório próprio, agricultura tropical como campo de prova |
| 7 | Prova institucional | Fontes nomeadas (DETEC, Rehagro, NITEC/UNESP, JP Agrícola), lab próprio, LLC na Flórida |
| 8 | Contato | Formulário de lead + endereço de Lakeland |

**Decisão de conteúdo:** não replicar as 10 culturas do site BR. Café (só Havaí) e cana (só FL/LA) saem da Home ou entram marcadas como regionais — um produtor de Iowa vendo "Coffee" na lista lê o site como brasileiro traduzido, exatamente o que o briefing pede para evitar.

### 6.2 Template de landing page de produto

Mesmo template para KMEP Ultra e Aminosan, parametrizado — os dois produtos futuros entram sem redesenho.

| # | Seção | Função |
|---|---|---|
| 1 | Hero | Nome, promessa central, imagem do produto, CTA |
| 2 | O problema | Abre pela dor do produtor, não pelo produto |
| 3 | Como funciona | Mecanismo de ação, linguagem técnica e direta |
| 4 | Benefícios | 3–4 cards, frases curtas |
| 5 | Resultados | Tabela tratado vs testemunha, com fonte, local e ano |
| 6 | Culturas e aplicação | Culturas atendidas + janela de aplicação |
| 7 | Dados técnicos | Guaranteed Analysis, embalagens, dose. **Bloqueado — ver §10** |
| 8 | CTA final | Formulário ou âncora para o formulário |

**KMEP Ultra** — potencializador de inseticida com efeito nutricional de potássio. Embalagens 10L e 20L. **Copy condicionada à validação regulatória (§9).**

**Aminosan** — foliar de aminoácidos livres de origem vegetal, fermentação enzimática. Embalagens 1L, 10L, 20L. Carro-chefe e produto de origem: a seção Brazil story tem gancho natural aqui.

---

## 7. Geolocalização e priorização de culturas

Substitui o seletor de estado do briefing. Entrega personalização sem custo de conteúdo: reordena uma lista existente em vez de exigir copy para 50 estados.

### Comportamento

1. Mapa dos EUA exibindo todos os estados, com destaque no estado do visitante.
2. **Todas as culturas sempre aparecem.** Só a ordem muda.
3. Culturas relevantes ao estado detectado vêm primeiro.
4. Fora dos EUA ou sem detecção → ordem padrão nacional.
5. Controle discreto "Not in Iowa? Change" para corrigir detecção errada.
6. Override por querystring `?state=IA` para demo e homologação.

### Implementação

- Header `x-vercel-ip-country-region` na Vercel — sem serviço externo, sem latência adicional.
- Shell da página estático; apenas a seção de culturas resolve por request (PPR ou Server Component lendo `headers()`).
- Tabela `estado → ranking de culturas` como dado estático versionado no repo (ver **Anexo A**).

### Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Starlink, VPN e IP móvel erram estado — comuns em área rural | Controle "Change" visível + fallback nacional |
| Juma testa do Brasil e reporta como bug | Override `?state=` + comunicar no handoff |
| SEO / cloaking | Conteúdo idêntico no HTML, só ordem muda. `<h2>` e texto estáveis |
| IP como dado pessoal sob CCPA | Processado em request, não armazenado. Registrar na privacy policy |

---

## 8. Design e stack

### Direção visual

Do briefing: minimalista, premium, agritech. Títulos grandes e pesados, grids limpos, muito respiro, imagens agrícolas reais, blocos escaneáveis. Evitar cards pequenos competindo, gradientes decorativos e blocos de texto sem quebra.

Base de marca herdada do site BR, a ser reinterpretada — não copiada:

| Token | Valor |
|---|---|
| Verde profundo | `#004C26` |
| Amarelo-lima | `#F0E27A` |
| Fundo | `#FFFFFF` |
| Texto | `#1A1A1A` |
| Display | Space Grotesk |
| Corpo | Montserrat |
| Botões | pill (`9999px`) · Cards: `0px` |

O briefing sugere Inter, Satoshi, Neue Haas Grotesk ou Manrope. Recomendação: **manter Space Grotesk e Montserrat** para consistência de marca e mudar a *composição* — hero, escala tipográfica, densidade e grid. É o que diferencia sem quebrar identidade, e é mais rápido.

### Stack

- Next.js (App Router) + TypeScript + Tailwind
- Deploy Vercel · repositório novo
- Fontes locais via `next/font` · imagens `next/image` em AVIF/WebP
- Animação: CSS/Motion para entrada; sem biblioteca 3D
- Conteúdo em arquivos TypeScript tipados — sem CMS na v1 (3 páginas, edição rara, e CMS não cabe em 23 dias)
- Formulário: Server Action + envio de e-mail, **desacoplado do destino final**

---

## 9. Regulatório e compliance

Bloqueio de maior risco do projeto. Não é técnico e não se resolve com design.

### KMEP Ultra e FIFRA

No Brasil o produto é vendido como "potencializador de inseticida com ação desalojante". Sob a **FIFRA**, um produto distribuído nos EUA com claim de desalojar, expor ou aumentar o controle de praga pode ser enquadrado como pesticida, o que exigiria registro na EPA. Adjuvantes de tanque normalmente escapam disso justamente por não fazerem claim de eficácia.

Traduzir literalmente *"dislodges the hidden pest"* — texto que hoje está no `/en` do site BR — é o caminho mais curto para um problema.

**Ação:** enviar à Juma, **na primeira semana**, pedido formal de validação dos claims com quem responde pelo regulatório da LLC. Não é opinião da Oceon; é definição do cliente. Enquanto não voltar, a copy do KMEP Ultra fica em rascunho.

**Plano B**, se os claims não puderem ser usados: reposicionar o KMEP Ultra pelo eixo nutricional (potássio via foliar na aplicação que você já faz), sem claim de eficácia sobre praga. A página funciona, com narrativa diferente.

**Correlato:** o resultado "74% de controle de bicho-mineiro" não deve ser usado nos EUA. É claim de controle de praga e a cultura (café) praticamente não existe no país.

### Fertilizantes

- Fertilizante vendido nos EUA exige **registro estadual** em cada estado, com **Guaranteed Analysis** no rótulo.
- Página de produto sem Guaranteed Analysis não passa no crivo de um dealer americano.
- **SDS** deve estar disponível em PDF.
- Claims de rendimento têm exigência de substanciação sob FTC. A prática da Juma (número + fonte + testemunha) já atende, desde que mantida.

### Disclaimers obrigatórios

Todo bloco de resultado acompanha: *"Results from field trials conducted in Brazil. Field performance varies with climate, soil and management."*

---

## 10. Conteúdo pendente

Itens que a Juma precisa entregar. Os três primeiros bloqueiam a v1.

| # | Item | Impacto | Prazo |
|---|---|---|---|
| 1 | **Validação dos claims do KMEP Ultra** | Bloqueia a LP inteira | Dia 5 |
| 2 | **Guaranteed Analysis** dos dois produtos | Bloqueia §7 da LP | Dia 7 |
| 3 | **Dose em fl oz/acre ou gal/acre** | Bloqueia §7 da LP | Dia 7 |
| 4 | Testemunha dos ensaios de Aminosan | Define se o número mais forte pode ser publicado | Dia 7 |
| 5 | Registros estaduais ativos | Define quais estados destacar no mapa | Dia 10 |
| 6 | Contato comercial da LLC (nome, e-mail, telefone US) | Bloqueia formulário e footer | Dia 10 |
| 7 | Fotos de campo americano em alta | Hero e seções. Sem elas, banco de imagens | Dia 10 |
| 8 | SDS em PDF | Link na LP | Dia 14 |
| 9 | Depoimentos de produtores americanos | Se não houver, seção não entra | Dia 14 |
| 10 | Definição do domínio `.us`/`.com` e DNS | Bloqueia deploy de produção | Dia 14 |

**Nota sobre depoimentos:** o `/en` atual exibe depoimentos de produtores brasileiros com nome e cidade. O documento consolidado registra que **nenhum depoimento real foi fornecido**. Não replicar no site USA sem confirmação de que são reais e autorizados.

---

## 11. SEO e analytics

- **Conflito com `/en`:** ao lançar, o `/en` do site BR deve receber `canonical` apontando para o domínio USA, ou ser despublicado. Sem isso, os dois competem pelas mesmas queries. Decisão do cliente — registrar no handoff.
- `hreflang` entre `pt-BR` (site BR) e `en-US` (site USA).
- Metadata por página, Open Graph, `sitemap.xml`, `robots.txt`.
- Schema.org: `Organization` + `Product` nas LPs.
- Analytics: Vercel Analytics + GA4. Evento de conversão no submit do formulário.

---

## 12. Time e cronograma

| Pessoa | Papel |
|---|---|
| **Gustavo** | Gestão, interlocução com a Juma, copy EN, revisão, execução onde travar |
| **Pedro** | Design no Figma, design system, implementação assistida por IA (Antigravity) |
| **Davi** | Desenvolvimento Next.js, integrações, performance, deploy |
| Murilo | Comercial/financeiro — fora do operacional |

**Caminho crítico: o design, não o código.** Se o Figma só fechar no dia 12, sobram 11 dias para três páginas com animação. Não serializar: Pedro fecha a Home primeiro e Davi já implementa enquanto Pedro desenha as LPs. Isso exige **tokens e componentes definidos no dia 1**, não no fim.

### Semana 0 — 07 a 09/08 · Fundação

- Gustavo: enviar à Juma os pedidos dos itens 1–4 de §10 (**prioridade máxima — item 1**)
- Gustavo: fechar domínio com o cliente
- Davi: repo, Next.js, Tailwind, deploy inicial na Vercel
- Pedro: moodboard e direção visual

### Semana 1 — 10 a 16/08 · Home

- Pedro: design system (tokens, tipografia, botões, cards) → **entregar até dia 11**
- Pedro: Home desktop + mobile no Figma → **fechar dia 16**
- Davi: header, footer, menu mobile, formulário, tabela estado→culturas
- Gustavo: copy EN da Home; conversão dos dados para bu/ac

### Semana 2 — 17 a 23/08 · Home no ar, LPs no Figma

- Davi: Home implementada, incluindo mapa e geolocalização → **dia 23**
- Pedro: template de LP no Figma, aplicado aos dois produtos → **dia 21**
- Gustavo: copy EN das LPs (KMEP condicionada à resposta regulatória)
- Revisão de Home com o cliente → **dia 20**

### Semana 3 — 24 a 30/08 · LPs e entrega

- Davi: LPs implementadas → **dia 27**
- Todos: QA cross-browser, mobile, Lighthouse, revisão de copy → dias 27–28
- Deploy de produção, DNS, analytics, sitemap → **dia 29**
- Buffer → dia 30

**Folga real: 1 dia.** Qualquer atraso na resposta regulatória ou no design system consome o buffer. Os dois riscos precisam ser cobrados diariamente.

---

## 13. Critérios de aceite

**Funcional**
- [ ] Três páginas navegáveis em desktop, tablet e mobile
- [ ] Formulário envia e notifica o destino configurado
- [ ] Geolocalização reordena culturas; fallback funciona fora dos EUA
- [ ] Override `?state=XX` funciona
- [ ] Todos os CTAs levam ao destino correto

**Conteúdo**
- [ ] Todo número tem fonte, testemunha e unidade dupla
- [ ] Disclaimer presente em todo bloco de resultado
- [ ] Guaranteed Analysis publicado nos dois produtos
- [ ] Copy do KMEP Ultra validada pelo regulatório

**Técnico**
- [ ] Lighthouse ≥ 90 em Performance, A11y, SEO, Best Practices
- [ ] LCP < 2,5s em mobile 4G
- [ ] Sem erro de console em produção
- [ ] `sitemap.xml`, `robots.txt`, OG e schema no ar
- [ ] `canonical`/`hreflang` resolvendo o conflito com `/en`

### Verificação

1. `npm run build` sem erro nem warning de tipo
2. Lighthouse nas três páginas, mobile e desktop
3. Geolocalização: testar com `?state=IA`, `?state=FL`, `?state=CA` e acesso real do Brasil
4. Formulário: submit real e confirmação de recebimento no destino
5. Navegação por teclado e leitor de tela nas três páginas
6. Chrome, Safari, Firefox e Edge; iOS Safari e Chrome Android
7. Validar OG cards no LinkedIn e WhatsApp

---

## 14. Suposições a confirmar

Resolvidas pelo caminho mais defensável para 23 dias. Contestar aqui é mais barato que depois.

| # | Suposição | Alternativa |
|---|---|---|
| 1 | **Site em EN-US apenas** | Espanhol é relevante em FL, TX e CA, mas dobra o volume de copy e não cabe no prazo. Fica para v2 |
| 2 | **Formulário desacoplado, notificação por e-mail + botão de WhatsApp** | Se a Juma usa CRM, a integração precisa de credencial até o dia 10 |
| 3 | **Sem CMS na v1** | Conteúdo em arquivos TS. Alterações passam por deploy |
| 4 | **23 dias corridos** → 30/08/2026, domingo. Entrega prática 28/08 (sexta) | Se forem dias úteis, o prazo real é 08/09 e há folga de uma semana |
| 5 | **Café e cana saem da Home USA** | Se a Juma quiser mantê-las, entram marcadas como regionais |
| 6 | **Depoimentos não entram** | Só entram com produtores americanos reais e autorizados |
| 7 | **Design system herdado do BR, composição nova** | Se o cliente quiser ruptura visual total, o prazo de design cresce ~4 dias |

---

## 15. Riscos

| Risco | Prob. | Impacto | Mitigação |
|---|---|---|---|
| Resposta regulatória do KMEP atrasa | Alta | Alto | Pedir no dia 1; plano B nutricional pronto |
| Design system atrasa e serializa o time | Média | Alto | Entregar tokens no dia 11, cobrança diária |
| Guaranteed Analysis não chega | Média | Médio | Publicar LP sem a seção e adicionar depois |
| Domínio não definido a tempo | Média | Alto | Subir em domínio provisório da Vercel |
| Fotos de campo americano não chegam | Alta | Médio | Banco de imagens licenciado como fallback |
| Cliente pede mudança estrutural na revisão do dia 20 | Média | Alto | Revisão de Home antecipada para o dia 20, não o 25 |

---

## Anexo A — Tabela estado → ranking de culturas

Ponto de partida para a seção §7. **Conferir contra USDA NASS antes do deploy** e cruzar com os registros estaduais ativos (§10, item 5).

Culturas na Home USA: `corn` · `soybeans` · `cotton` · `pasture` · `potato` · `tomato` · `citrus` · `dry-beans`
Regionais, exibidas apenas nos estados onde existem: `sugarcane` (FL, LA, TX) · `coffee` (HI)

| Estado | Ordem de prioridade |
|---|---|
| **Default (US)** | corn · soybeans · cotton · pasture · potato · tomato · citrus · dry-beans |
| IA | corn · soybeans · pasture · dry-beans |
| IL | corn · soybeans · pasture · tomato |
| NE | corn · soybeans · dry-beans · pasture |
| MN | corn · soybeans · dry-beans · potato |
| IN | corn · soybeans · tomato · pasture |
| OH | corn · soybeans · tomato · pasture |
| SD | corn · soybeans · pasture · dry-beans |
| KS | corn · soybeans · pasture · cotton |
| MO | soybeans · corn · cotton · pasture |
| ND | soybeans · corn · dry-beans · potato |
| WI | corn · soybeans · potato · pasture |
| MI | corn · soybeans · dry-beans · potato |
| TX | cotton · pasture · corn · citrus · sugarcane |
| GA | cotton · pasture · corn · soybeans |
| MS | cotton · soybeans · corn · pasture |
| AR | soybeans · cotton · corn · pasture |
| AL | cotton · pasture · corn · soybeans |
| NC | cotton · soybeans · corn · potato |
| TN | cotton · soybeans · corn · pasture |
| LA | sugarcane · soybeans · cotton · corn |
| FL | citrus · tomato · sugarcane · potato · pasture |
| CA | tomato · citrus · cotton · potato · pasture |
| ID | potato · dry-beans · pasture · corn |
| WA | potato · pasture · corn |
| OR | potato · pasture |
| CO | corn · dry-beans · potato · pasture |
| AZ | cotton · citrus · pasture |
| OK | pasture · cotton · corn · soybeans |
| KY | pasture · corn · soybeans |
| ME | potato · pasture |
| HI | coffee · sugarcane |

Estados não listados usam a ordem default. Culturas não citadas no ranking de um estado entram depois, na ordem default.

---

## Anexo B — Referência dos produtos

### KMEP Ultra®

- **Categoria BR:** potencializador de inseticidas, ação desalojante + efeito nutricional de potássio
- **Uso:** sempre em mistura com o defensivo, via pulverização
- **Culturas BR:** soja, milho, café, feijão, algodão, citros, tomate
- **Embalagens:** 10L, 20L
- **Resultado publicável:** milho, 221,3 vs 212,3 bu/ac (231,45 vs 222,12 sc/ha) — Rehagro
- **Não publicar nos EUA:** "74% de controle de bicho-mineiro" (claim de controle + cultura irrelevante)
- **Status da copy:** bloqueada até validação regulatória (§9)

### Aminosan®

- **Categoria BR:** fertilizante foliar com aminoácidos livres de origem vegetal por fermentação enzimática, com N, P e K
- **Uso:** foliar, isolado ou em mistura, dos estágios iniciais às fases reprodutivas
- **Culturas BR:** soja, milho, café, algodão, feijão, citros, tomate, batata
- **Embalagens:** 1L, 10L, 20L
- **História:** criado por Julio Matino antes da fundação da empresa; deu origem à Juma Agro em 1988. Mais de 40 anos de mercado
- **Resultados:** Taquarivaí/SP +9,8 e +12,5 bu/ac (DETEC) · Lavras/MG +8,9 bu/ac (Terras Gerais) — **ambos sem testemunha publicada, ver §4**

### Contatos e institucional

- **Juma-Agro Fertilizer LLC** — 3928 Anchuca Drive, Suite 11, Lakeland, FL 33811
- **Sede BR** — R. Victor Acierini, 2.370, Distrito Industrial, Mogi Guaçu, SP
- **Fundação:** 1988 · **Fundador:** Sr. Julio Matino · **Propósito:** "Together we feed the world"
- **Fontes de ensaio citáveis:** DETEC · Rehagro · JP Agrícola · Terras Gerais · NITEC/UNESP · UENP
