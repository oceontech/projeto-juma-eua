import type * as en from "../kmep";

/**
 * Copy da LP do KMEP Ultra® em português, para revisão da Juma.
 * Mesmo formato de ../kmep.ts; ver src/content/index.ts.
 *
 * O inglês é a copy real e sai de docs/05-COPY-KMEP-ULTRA.md. Aqui os
 * números seguem em unidade americana, como aparecem na página publicada.
 */

export const hero: typeof en.hero = {
  eyebrow: ["Performance de aplicação", "Potássio foliar"],
  heading: "Faça cada passada valer.",
  aside: { heading: ["Uma passada.", "Dois trabalhos."] },
  body: "O KMEP Ultra® vai no tanque que você já enche. Mais calda fica na folha, e o potássio chega nas semanas que definem a produtividade.",
  badge: "potássio foliar",
  cta: { label: "Faça uma faixa de teste na sua área", href: "#trial-form" },
  secondary: { label: "Ver o ensaio", href: "#proof" },
  alt: "Uma bombona de KMEP Ultra® num campo jovem de soja ao nascer do sol",
};

export const proofBand: typeof en.proofBand = {
  label: "O ensaio, em uma linha",
  stats: [
    { value: 221.2, decimals: 1, unit: "bu/ac", label: "Tratado" },
    { value: 212.3, decimals: 1, unit: "bu/ac", label: "Testemunha" },
    { value: 8.9, decimals: 1, prefix: "+", unit: "bu/ac", label: "Diferença", note: "+4,2%" },
  ],
  source: "Milho · Ensaio Rehagro · Brasil",
};

export const problem: typeof en.problem = {
  heading: "Você fez a aplicação certa. Parte dela ainda errou.",
  body: [
    "Você usou o produto que escolheu, na dose do rótulo, numa janela que era boa de verdade. Da cabine, a passada pareceu limpa. O que não dá para ver de lá é quanto da calda parou no topo do dossel, quanto ricocheteou e quanto secou antes de chegar à superfície da folha que importava.",
    "Perdas escondidas na performance de aplicação custam produtividade, qualidade e lucro sem deixar um único sinal visível no campo. Quando o monitor mostra, a aplicação ficou quatro meses para trás e não há mais nada para corrigir.",
  ],
  captions: ["Topo do dossel", "A folha que importava"],
  ledger: {
    label: "O que a cabine não mostra",
    items: ["Parou no topo do dossel", "Ricocheteou", "Secou antes de chegar à folha"],
  },
  alt: "Close do cartucho de um milho jovem ao amanhecer, com gotas sobre a superfície da folha",
};

export const cost: typeof en.cost = {
  heading: "Pequenas perdas que você não vê somam um número que você vê.",
  intro: "Duas coisas acontecem quando uma aplicação rende menos.",
  blocks: [
    {
      kicker: "A óbvia",
      title: "A reaplicação",
      body: "Outra viagem, mais diesel, outra janela de clima que você não planejou.",
    },
    {
      kicker: "A silenciosa",
      title: "O potássio de que a lavoura precisava no mesmo trecho da safra",
      body: "E não recebeu, porque a demanda chegou ao pico com o solo seco e a raiz não conseguiu movê-lo rápido o bastante.",
    },
  ],
  close: [
    "Nenhuma das duas aparece como sintoma que dá para fotografar.",
    "As duas aparecem no monitor de colheita.",
  ],
};

export const twoJobs: typeof en.twoJobs = {
  eyebrow: "Mesmo tanque · Mesma passada",
  heading: "Uma passada. Dois trabalhos.",
  lead: "O KMEP Ultra® vai no tanque com o inseticida que você já escolheu, na aplicação que você já agendou. Sem viagem extra pelo talhão. A partir daí ele faz duas coisas: muda como a calda se comporta no caminho até a folha e entrega potássio que o tecido consegue absorver enquanto está lá.",
  close: "O primeiro trabalho acontece nos vinte minutos em que o pulverizador está naquele talhão. O segundo segue pelo resto da safra.",
  scene: {
    pass: "Uma passada",
    jobA: {
      tag: "Trabalho 1",
      title: "Cobertura e deposição",
      body: "Muda como a calda se comporta no caminho até a folha.",
      clock: "20 min",
      time: "Vinte minutos naquele talhão",
    },
    jobB: {
      tag: "Trabalho 2",
      title: "Potássio foliar",
      body: "Entrega potássio que o tecido consegue absorver enquanto está lá.",
      time: "O resto da safra",
      start: "Dia da aplicação",
      marks: ["Florada", "Enchimento", "Colheita"],
    },
  },
};

export const deposition: typeof en.deposition = {
  label: "Trabalho 1 · O dia da aplicação",
  heading: "O que a gota faz antes de secar.",
  stages: [
    {
      n: "01",
      kicker: "Sai do bico",
      body: "Uma gota de pulverização tem uma carreira curta. Ela sai do bico, atravessa ar em movimento, pousa numa superfície que pode ser cerosa e vertical, e fica ali tempo suficiente para trabalhar ou não fica. O KMEP Ultra® atua nesse trecho: melhora como a calda cobre a superfície da folha e como ela deposita, para que mais do que você comprou chegue ao alvo em que você mirou.",
    },
    {
      n: "02",
      kicker: "Atravessa ar em movimento",
      title: "Uma aplicação às 7h e uma às 14h não são a mesma aplicação.",
      body: "Ele também mantém esse comportamento mais estável ao longo das condições que um dia de verdade oferece, que é onde as aplicações costumam se separar umas das outras.",
    },
    {
      n: "03",
      kicker: "Pousa numa superfície cerosa e vertical",
      title: "Nada muda no seu bico nem na sua dose.",
      body: "O que muda é quantas dessas gotas ficam onde você as colocou.",
    },
  ],
  hours: ["7h", "14h"],
  scene: { air: "Ar em movimento", surface: "Superfície cerosa da folha" },
  alt: "Diagrama do caminho de uma gota de pulverização: sai do bico, atravessa o ar em movimento e pousa numa folha cerosa e inclinada",
};

export const potassium: typeof en.potassium = {
  label: "Trabalho 2 · O resto da safra",
  heading: "A produtividade se define com potássio que a raiz pode não entregar a tempo.",
  body: "A demanda de potássio chega ao pico tarde, da florada ao enchimento do grão, do tubérculo ou do fruto, que é exatamente quando um veranico, uma camada compactada ou um sistema radicular raso limitam quanto o solo consegue de fato mover.",
  quote: "O potássio está no solo. A sua análise diz isso. Não é a mesma coisa que tê-lo na planta durante as semanas que definem a produtividade.",
  zone: {
    steps: [
      { title: "Uma raiz em equilíbrio", body: "O potássio está no solo, em volta de um sistema radicular. Por enquanto, nada pede muito." },
      { title: "Ele se move com a água", body: "O potássio do solo viaja dissolvido na água do solo, levado pelos mesmos caminhos que a água faz até a raiz." },
      { title: "Ele precisa chegar", body: "Só o potássio que alcança a superfície da raiz pode ser absorvido. Quem faz toda a entrega é o solo e a raiz." },
      { title: "A demanda sobe", body: "Da florada ao enchimento, a lavoura pede mais potássio, e mais rápido. A rota inteira fica sob pressão." },
      { title: "A entrega fica para trás", body: "Um perfil secando ou uma camada compactada freia a água, e o potássio chega mais devagar do que a lavoura precisa." },
      { title: "Estar no solo não é chegar à raiz", body: "Disponibilidade de potássio não é só estar no solo. É se mover e chegar à raiz a tempo." },
    ],
    legend: { k: "Potássio (K⁺)", water: "Água do solo" },
    meters: { demand: "Demanda da lavoura", delivered: "Chegando à raiz" },
    labels: { dry: "Perfil secando", compact: "Camada compactada" },
    alt: "Corte animado do solo em volta de um sistema radicular: o potássio vai até a raiz com a água do solo e é absorvido; quando a demanda sobe e o perfil seca, menos dele chega à raiz a tempo.",
  },
  routes: {
    heading: "Duas rotas, dois relógios.",
    body: "O potássio do solo se move com a água. Ele precisa se dissolver, chegar até a superfície da raiz, entrar no xilema e subir até a folha, e cada uma dessas etapas desacelera quando o perfil seca. O potássio foliar começa na folha e entra no tecido a partir de onde pousou.",
    soil: {
      label: "Pelo solo",
      steps: ["Dissolver", "Chegar à superfície da raiz", "Entrar no xilema", "Subir até a folha"],
    },
    foliar: {
      label: "Pela folha",
      steps: ["Pousa na folha", "Entra no tecido"],
    },
    brake: "Desacelera quando o perfil seca",
  },
};

/* HOLD P2 — remover junto com Flush.tsx */
export const flush: typeof en.flush = {
  label: "Uma vantagem adicional",
  heading: "O que você não alcançou é o que volta.",
  body: "A aplicação estava certa. O produto estava certo. Parte da população simplesmente nunca encontrou a calda, porque estava no cartucho, embaixo da folha, na bainha. O KMEP Ultra® vai na mesma gota e tira o alvo desse abrigo, colocando-o em contato com o inseticida que você já pagou.",
  stages: [
    { n: "01", title: "Abrigado", body: "Onde a gota nunca iria chegar." },
    { n: "02", title: "Desalojado", body: "Ele sai por conta própria." },
    { n: "03", title: "Exposto", body: "Na frente do produto que você já comprou." },
  ],
  caveatLabel: "Mesma dose, mesmo rótulo",
  caveat: "Isto não é motivo para reduzir a dose do seu inseticida. Mesma dose, mesmo rótulo, mesmo tanque. O que muda é quanto da população o inseticida de fato alcança.",
  alt: "Diagrama do cartucho do milho em três tempos: o alvo abrigado dentro, saindo, e exposto na folha aberta",
};

export const operation: typeof en.operation = {
  heading: "O que ele faz pela operação.",
  cards: [
    {
      title: "Vai no tanque que você já está enchendo.",
      body: "Compatível em mistura de tanque. Sem passada separada, sem diesel extra, sem nova janela de clima para esperar.",
    },
    {
      title: "Mais da calda faz o seu trabalho.",
      body: "Melhor cobertura e deposição na superfície da folha em que você mirou, na mesma dose, no mesmo rótulo.",
    },
    {
      title: "Potássio numa forma que a folha absorve.",
      body: "Posicionado para a janela em que a demanda de fato chega ao pico, em vez de esperar pela umidade do solo.",
      /* HOLD P2 — remover junto com Flush.tsx */
      hold: "E a vantagem adicional da ação desalojante coloca mais da população em contato com a calda.",
    },
  ],
  offer: {
    title: "Nove bushels a mais, de uma passada que você ia fazer de qualquer jeito.",
    check: { value: "212,3", unit: "bu/ac", label: "Testemunha sem tratamento" },
    gain: { value: "+8,9", unit: "bu/ac", label: "Resposta no ensaio" },
    witness: "221,2 vs 212,3 bu/ac · Milho · Ensaio Rehagro, Brasil",
    cta: { label: "Peça o relatório completo do ensaio", href: "#trial-form" },
  },
};

export const proof: typeof en.proof = {
  label: "O ensaio",
  heading: "Nove bushels, mesma passada.",
  body: "Um ensaio, publicado inteiro, com a faixa testemunha ao lado. Milho em manejo de cigarrinha, Rehagro, Brasil. O produto entrou junto com uma aplicação de inseticida que já estava no calendário, então os nove bushels saíram de uma passada que ia acontecer de qualquer forma.",
  pair: {
    check: { label: "Testemunha", value: 212.3 },
    treated: { label: "Tratado · KMEP Ultra®", value: 221.2 },
    diff: { label: "Diferença", value: "+8,9", note: "+4,2%" },
    unit: "bu/ac",
  },
  scale: { max: 250, step: 50, unit: "bu/ac", label: "A escala começa em zero" },
  table: {
    label: "O ensaio, na íntegra",
    intro: "Um ensaio, publicado inteiro. Quando tivermos mais, estarão aqui também, inclusive os que não separaram.",
    facts: [
      { k: "Cultura", v: "Milho", icon: "crop" },
      { k: "Local", v: "Brasil", icon: "pin" },
      { k: "Fonte", v: "Rehagro", icon: "source" },
      { k: "Ano", v: "Em confirmação", icon: "year", pending: true },
    ],
    original: {
      label: "Unidades originais",
      rows: [
        { k: "Tratado", us: "221,2 bu/ac", orig: "231,45 sc/ha" },
        { k: "Testemunha", us: "212,3 bu/ac", orig: "222,12 sc/ha" },
        { k: "Diferença", us: "+8,9 bu/ac", orig: "+9,33 sc/ha" },
      ],
    },
  },
  paper: {
    label: "E um segundo, revisado por pares",
    heading: "Blocos casualizados, estação experimental de terceiro, e um periódico que publicou.",
    chips: ["Algodão", "Safra 2021", "Rio Verde, Goiás", "Estação independente", "Blocos casualizados", "Colheita manual"],
    scheme: {
      label: "Protocolo · 15 aplicações",
      applications: 15,
      treatments: [
        { label: "Programa de inseticidas sozinho", kmep: "none" },
        { label: "+ KMEP Ultra® em todas as aplicações", kmep: "all" },
        { label: "+ KMEP Ultra® em aplicações alternadas", kmep: "alternate" },
      ],
      legend: { insecticide: "Aplicação de inseticida", kmep: "Com KMEP Ultra®" },
      note: "Esquema. O calendário das aplicações está no artigo.",
    },
    result: "Os dois tratamentos com KMEP Ultra® produziram mais que a testemunha.",
    citation: {
      label: "Publicado em",
      journal: "Revista Foco",
      issue: "v.16 n.2 · 2023",
      doi: "10.54751/revistafoco.v16n2-129",
      href: "https://doi.org/10.54751/revistafoco.v16n2-129",
      cta: "Ler o artigo",
    },
    disclosure: "Divulgação: três dos quatro autores são agrônomos da Juma-Agro. O quarto é pesquisador do Instituto Goiano de Agricultura, e o ensaio foi conduzido em estação experimental independente. Está dito aqui porque é o tipo de coisa que se descobre de qualquer forma, e porque um ensaio que dá para conferir vale mais que um em que é preciso acreditar.",
  },
  footnote: "Resultados de ensaios de campo conduzidos no Brasil. O desempenho em campo varia com clima, solo e manejo.",
};

export const economics: typeof en.economics = {
  heading: "Quanto valem nove bushels na sua área.",
  body: "Com o milho a $4,30, 8,9 bushels são $38,27 por acre. O produto custa seis dólares por acre na dose do rótulo, para uma aplicação. Publicamos os dois números juntos, porque a distância entre eles é a decisão inteira.",
  witness: "+8,9 bu/ac: 221,2 tratado vs 212,3 bu/ac na testemunha",
  calc: {
    gain: 8.9,
    cost: 6,
    price: { label: "Preço do milho", unit: "/bu", hint: "Arraste para definir o seu preço", min: 3.5, max: 5.5, step: 0.05, initial: 4.3, presets: [4, 4.3, 4.6] },
    acres: { label: "Sua área", unit: "ac", presets: [160, 500, 1000, 2500], initial: 500 },
    steps: { value: "Valor de +8,9 bu/ac", cost: "Custo do produto", net: "Líquido por acre" },
    perAcre: "/ac",
    ratio: { label: "Valor em grão por $1 de produto", suffix: "para $1" },
    breakEven: { label: "Se paga com o milho acima de", unit: "/bu" },
    farm: { label: "Líquido na sua área", note: "Uma aplicação, na dose do rótulo" },
    scaleMax: 50,
    scaleStep: 10,
  },
  footnote: "Resposta de produtividade do ensaio Rehagro no Brasil. Preços do milho mostrados como referência. O seu resultado vai variar com clima, solo e manejo.",
};

export const credential: typeof en.credential = {
  heading: "Tecnologia de aplicação é um programa de pesquisa aqui, não um slogan.",
  before: "Desde 2021, a Juma Agro conduz o projeto DESATA ",
  institutions: "com a UENP e com o NITEC, o laboratório de tecnologia de aplicação e máquinas da UNESP",
  after: ": túnel de vento estudando espectro de gotas, deriva e deposição. É essa a disciplina por trás deste produto, e é por isso que podemos falar do que uma gota faz antes de secar em vez do que gostaríamos que ela fizesse.",
  topics: ["Túnel de vento", "Espectro de gotas", "Deriva", "Deposição"],
  scene: { nozzle: "Bico", air: "Fluxo de ar", collectors: "Coletores de deposição" },
  sceneAlt: "Desenho técnico de um túnel de vento: um bico sobre uma fileira de coletores, com o fluxo de ar levando as gotas mais finas",
};

export const timing: typeof en.timing = {
  heading: "Quando ele entra.",
  body: "Numa aplicação que você já tem no calendário, na dose do rótulo: 16 fl oz por acre. Pomares, hortaliças, ornamentais e grandes culturas têm cada um a sua janela. Escolha a sua.",
  cropLabel: "Cultura",
  rateLabel: "Dose",
  season: "Safra",
  ends: ["Plantio", "Colheita"],
  hint: "Role pela safra",
  pass: "Aplicação",
  crops: [
    {
      id: "citrus",
      label: "Citros",
      rate: "16 fl oz/ac",
      ends: ["Florada", "Colheita"],
      marks: [
        { code: "Pegamento", at: 0.25 },
        { code: "", display: "+14 dias", at: 0.42, minor: true },
        { code: "", display: "+14 dias", at: 0.59, minor: true },
      ],
      spans: [
        { from: 0, to: 2, note: "Quinzenal, enquanto o fruto se forma" },
      ],
      summary: "Citros: quinzenal, durante a formação do fruto.",
    },
    {
      id: "fruit",
      label: "Frutíferas",
      rate: "16 fl oz/ac",
      ends: ["Florada", "Colheita"],
      marks: [
        { code: "Pós-florada", at: 0.22 },
        { code: "", display: "Próxima", at: 0.42, minor: true },
        { code: "", display: "Próxima", at: 0.62, minor: true },
      ],
      spans: [
        { from: 0, to: 2, note: "De três a quatro aplicações por safra" },
      ],
      summary: "Frutíferas: de três a quatro aplicações por safra, a partir da florada.",
    },
    {
      id: "veg",
      label: "Hortaliças",
      rate: "16 fl oz/ac",
      ends: ["Semeadura", "Colheita"],
      marks: [
        { code: "Dia 30", at: 0.3 },
        { code: "", display: "+14 dias", at: 0.46, minor: true },
        { code: "", display: "+14 dias", at: 0.62, minor: true },
      ],
      spans: [
        { from: 0, to: 2, note: "Quinzenal, a partir do dia 30" },
      ],
      summary: "Outras hortaliças: quinzenal, a partir de 30 dias após a germinação ou o transplante.",
    },
    {
      id: "tomato",
      label: "Tomate e pimentão",
      rate: "16 fl oz/ac",
      ends: ["Transplante", "Colheita"],
      marks: [
        { code: "Dia 40", at: 0.3 },
        { code: "", display: "+7 dias", at: 0.42, minor: true },
        { code: "", display: "+7 dias", at: 0.54, minor: true },
        { code: "", display: "+7 dias", at: 0.66, minor: true },
      ],
      spans: [
        { from: 0, to: 3, note: "Semanal, a partir do dia 40 após o transplante" },
      ],
      summary: "Tomate e pimentão: semanal, a partir de 40 dias após o transplante.",
    },
    {
      id: "ornamental",
      label: "Ornamentais",
      rate: "16 fl oz/ac",
      ends: ["Plantio", "Venda"],
      marks: [
        { code: "1ª aplicação", at: 0.24 },
        { code: "", display: "Próxima", at: 0.44, minor: true },
        { code: "", display: "Próxima", at: 0.64, minor: true },
      ],
      spans: [
        { from: 0, to: 2, note: "Em toda aplicação" },
      ],
      summary: "Ornamentais: em toda aplicação ao longo do ciclo, na dose do rótulo.",
    },
    {
      id: "potato",
      label: "Batata",
      rate: "16 fl oz/ac",
      marks: [
        { code: "Dia 50", at: 0.38 },
        { code: "", display: "+7 dias", at: 0.51, minor: true },
        { code: "", display: "+7 dias", at: 0.64, minor: true },
      ],
      spans: [
        { from: 0, to: 2, note: "Semanal, a partir do dia 50" },
      ],
      summary: "Batata: semanal, a partir de 50 dias após a emergência.",
    },
    {
      id: "onion",
      label: "Cebola e alho",
      rate: "16 fl oz/ac",
      ends: ["Transplante", "Colheita"],
      marks: [
        { code: "Dia 50", at: 0.4 },
        { code: "", display: "+7 dias", at: 0.53, minor: true },
        { code: "", display: "+7 dias", at: 0.66, minor: true },
      ],
      spans: [
        { from: 0, to: 2, note: "Semanal, a partir do dia 50 após o transplante" },
      ],
      summary: "Cebola e alho: semanal, a partir de 50 dias após o transplante.",
    },
    {
      id: "roots",
      label: "Cenoura e beterraba",
      rate: "16 fl oz/ac",
      marks: [
        { code: "Dia 40", at: 0.34 },
        { code: "", display: "+7 dias", at: 0.47, minor: true },
        { code: "", display: "+7 dias", at: 0.6, minor: true },
      ],
      spans: [
        { from: 0, to: 2, note: "Semanal, a partir do dia 40" },
      ],
      summary: "Cenoura e beterraba: semanal, a partir de 40 dias após a emergência.",
    },
    {
      id: "corn",
      label: "Milho",
      rate: "16 fl oz/ac",
      marks: [
        { code: "V4", at: 0.18 },
        { code: "V6", at: 0.32 },
        { code: "Formação da espiga", at: 0.62 },
      ],
      spans: [
        { from: 0, to: 1, note: "Vão junto com aplicações já agendadas" },
        { from: 2, to: 2, note: "O potássio chegando onde está a demanda" },
      ],
      summary: "V4, V6 e de novo na formação da espiga. A janela do milho tem duas metades e as duas importam. As duas primeiras vão junto com aplicações já agendadas, e a da formação da espiga é o potássio chegando onde está a demanda.",
    },
    {
      id: "soy",
      label: "Soja",
      rate: "16 fl oz/ac",
      marks: [
        { code: "V6/V7", at: 0.3 },
        { code: "", display: "+10 a 15 dias", at: 0.47, minor: true },
        { code: "", display: "+10 a 15 dias", at: 0.64, minor: true },
      ],
      spans: [
        { from: 0, to: 2, note: "Repetindo a cada 10 a 15 dias" },
      ],
      summary: "Soja: V6/V7, repetindo a cada 10 a 15 dias.",
    },
    {
      id: "cotton",
      label: "Algodão",
      rate: "16 fl oz/ac",
      marks: [
        { code: "Dia 40", at: 0.3 },
        { code: "", display: "+7 dias", at: 0.42, minor: true },
        { code: "", display: "+7 dias", at: 0.54, minor: true },
        { code: "", display: "+7 dias", at: 0.66, minor: true },
      ],
      spans: [
        { from: 0, to: 3, note: "De quatro a seis aplicações, uma por semana" },
      ],
      summary: "Algodão: a partir de 40 dias após a emergência, de quatro a seis aplicações com uma semana de intervalo.",
    },
    {
      id: "beans",
      label: "Feijão",
      rate: "16 fl oz/ac",
      marks: [
        { code: "Florada", at: 0.42 },
        { code: "", display: "+10 a 15 dias", at: 0.57, minor: true },
        { code: "", display: "+10 a 15 dias", at: 0.72, minor: true },
      ],
      spans: [
        { from: 0, to: 2, note: "Após a florada, a cada 10 a 15 dias" },
      ],
      summary: "Feijão: após a florada, repetindo a cada 10 a 15 dias.",
    },
  ],
  details: [
    {
      k: "Dose e embalagem",
      v: "16 fl oz por acre em toda aplicação, a dose do rótulo americano. Um galão de 2,5 gal cobre 20 acres.",
    },
    {
      k: "Mistura de tanque",
      v: "A ordem de mistura e as incompatibilidades conhecidas estão no rótulo. Faça teste de jarro em qualquer combinação que você ainda não usou.",
    },
  ],
  jugAlt: "Galão de 2,5 gal do KMEP Ultra® com o rótulo americano",
  logoAlt: "Logo do KMEP Ultra®",
};

export const fit: typeof en.fit = {
  heading: "Para quem é.",
  fits: {
    label: "Serve",
    lead: "Para uma operação que",
    items: [
      "Já tem aplicações no calendário, em pomares, hortaliças, ornamentais ou grandes culturas",
      "Conduz as próprias faixas testemunha",
      "Quer mais de uma aplicação que já está no orçamento",
    ],
  },
  notFit: {
    label: "Não serve",
    lead: "Para quem quer",
    items: [
      "Substituir o potássio de solo",
      "Reduzir a dose de inseticida",
      "Comprar um produto que funcione sem uma aplicação que já ia sair",
    ],
  },
  close: [
    "Se você só precisa de potássio, compre potássio.",
    "O KMEP Ultra® é comprado pelo que a aplicação faz, e o potássio vai junto.",
  ],
};

export const strip: typeof en.strip = {
  label: "Como funciona a faixa de teste",
  heading: "Seu talhão, sua faixa testemunha, seu monitor.",
  steps: [
    { n: "01", title: "Escolha um talhão com uma aplicação de inseticida já agendada.", body: "Nós enviamos o produto para ela." },
    {
      n: "02",
      title: "Deixe uma faixa sem tratar, no mesmo talhão, sob o mesmo manejo.",
      body: "Essa faixa é o experimento inteiro.",
    },
    {
      n: "03",
      title: "Colha as duas e leia o seu próprio monitor.",
      body: "Voltamos para olhar os números com você, para o lado que eles caírem.",
    },
  ],
  promise: ["Sem custo pelo produto da faixa.", "Sem compromisso depois da colheita."],
  cta: { label: "Faça uma faixa de teste na sua área", href: "#trial-form" },
  alt: "Vista aérea de uma lavoura com uma faixa testemunha marcada por bandeiras",
};

export const questions: typeof en.questions = {
  heading: "As perguntas que mais recebemos.",
  items: [
    {
      q: "Seus ensaios são do Brasil. Por que isso deveria importar para mim?",
      a: "Porque a testemunha não era uma lavoura fraca. O milho não tratado do nosso ensaio deu 212,3 bu/ac, bem acima da média americana de 2025, de cerca de 186 bu/ac, e perto de Illinois, com 217. Uma resposta em cima de uma testemunha tão forte é mais difícil de conseguir, não mais fácil.",
    },
    {
      q: "Existe algo publicado, ou só os ensaios de vocês?",
      a: "Existe um trabalho revisado por pares. Algodão, safra 2021, delineamento de blocos casualizados, conduzido em estação experimental independente em Rio Verde, Goiás, e publicado na Revista Foco em 2023 (DOI 10.54751/revistafoco.v16n2-129). Três dos quatro autores são agrônomos da Juma-Agro e o quarto é pesquisador do Instituto Goiano de Agricultura. Está escrito nesta página em vez de deixar você descobrir sozinho. É um artigo, não um corpo de literatura, e preferimos dizer isso com todas as letras.",
    },
    {
      q: "Qual a diferença para um 0-0-25 comum ou KTS?",
      a: "Um 0-0-25 é uma fonte de potássio e nada além disso. Este produto entra no tanque do inseticida para mudar como a calda cobre e deposita, e leva potássio foliar enquanto está lá. Se você só precisa de potássio, compre potássio.",
      /* HOLD P2 — remover junto com Flush.tsx */
      hold: "Ele também tira o alvo do abrigo, colocando-o em contato com o inseticida que você já pagou.",
    },
    {
      q: "Posso reduzir a dose do inseticida usando ele?",
      a: "Não. Ele não faz o inseticida render mais e não muda a dose daquele rótulo. Use a sua dose normal.",
    },
    {
      q: "Posso misturar com o meu inseticida ou fungicida?",
      a: "Sim. É assim que ele foi feito para ser usado. A ordem de mistura e as incompatibilidades conhecidas estão no rótulo. Faça teste de jarro em qualquer combinação que você ainda não usou.",
    },
  ],
};

export const final: typeof en.final = {
  heading: "Faça uma faixa de teste. O produto é por nossa conta.",
  body: "Escolha um talhão, deixe uma faixa testemunha sem tratar ao lado, e voltamos na colheita com você. Diga a sua cultura e o seu estado e enviamos antes o rótulo, as doses em fl oz por acre e o relatório completo do ensaio.",
  disclaimer: "O KMEP Ultra® é aplicado em mistura de tanque com um inseticida e nunca no lugar de um. Ele não muda a dose do rótulo do inseticida. Sempre leia e siga as instruções do rótulo do defensivo que você está aplicando.",
  crops: ["Citros e frutas", "Hortaliças", "Ornamentais", "Grandes culturas", "Outra"],
  cropIcons: ["citrus", "vegetables", "ornamentals", "corn"],
  alt: "Colheita de milho ao pôr do sol, com o grão sendo descarregado na carreta ao lado da colheitadeira",
};

/* As cenas de partículas e o preto, versões A e B — ver ../kmep.ts. */

export const sceneA: typeof en.sceneA = {
  steps: ["Da cabine", "Parou no topo", "Quicou, secou", "Com KMEP Ultra®"],
  stages: [
    {
      kicker: "Da cabine",
      heading: "Da cabine, a passada pareceu limpa.",
      body: "Você usou o produto que escolheu, na dose do rótulo, numa janela que era boa de verdade. O que não dá para ver de lá é onde a calda foi parar de fato.",
      legend: [],
      callouts: [
        { label: "Bico", note: "Dose do rótulo, como planejado" },
        { label: "Leque", note: "Sai do bico parecendo uniforme" },
        { label: "Dossel", note: "Onde a passada mira" },
      ],
      readout: [
        { k: "Dose", v: "Rótulo" },
        { k: "Janela", v: "Boa" },
        { k: "Perda visível", v: "Nenhuma" },
      ],
    },
    {
      kicker: "Parou no topo",
      heading: "Parte dela parou no topo do dossel.",
      body: "As folhas de cima pegam a calda primeiro. A superfície da folha que importava fica abaixo delas, e da cabine tudo parece igual.",
      legend: [{ tone: 2, label: "Calda que não fez o trabalho" }],
      callouts: [
        { label: "Folhas de cima", note: "Onde a calda parou" },
        { label: "Dossel de baixo", note: "A superfície da folha que importava" },
        { label: "Cartucho", note: "Fechado, em pé, difícil de alcançar" },
      ],
      readout: [
        { k: "Topo do dossel", v: "Molhado" },
        { k: "Dossel de baixo", v: "Seco" },
        { k: "Visto da cabine", v: "Não" },
      ],
    },
    {
      kicker: "Quicou. Secou.",
      heading: "Parte dela quicou. Parte dela secou.",
      body: "A gota pousa numa superfície que pode ser cerosa e vertical, e fica lá tempo suficiente para trabalhar ou não fica. Perdas escondidas assim não deixam sinal visível no campo.",
      legend: [{ tone: 2, label: "Perdida da folha" }],
      callouts: [
        { label: "Quicou", note: "Bateu na cera e saiu da folha" },
        { label: "Secou", note: "Sumiu antes de trabalhar" },
        { label: "Folha cerosa", note: "Em pé e repelente à água" },
      ],
      readout: [
        { k: "Pousou", v: "Sim" },
        { k: "Ficou", v: "Nem toda" },
        { k: "Sinal visível", v: "Nenhum" },
      ],
    },
    {
      kicker: "Com KMEP Ultra®",
      heading: "Nada muda no seu bico nem na sua dose.",
      body: "O que muda é quantas dessas gotas ficam onde você as colocou. O KMEP Ultra® vai no tanque que você já está enchendo, melhora como a calda cobre e deposita, e leva potássio foliar na mesma gota.",
      legend: [{ tone: 1, label: "Calda que fica" }],
      callouts: [
        { label: "Gota espalhada", note: "Cobre e deposita na folha" },
        { label: "Superfície da folha", note: "O alvo que você mirou" },
        { label: "Potássio", note: "Vai na mesma gota" },
      ],
      readout: [
        { k: "Dose", v: "A mesma" },
        { k: "Passada", v: "A mesma" },
        { k: "Leva", v: "Potássio" },
      ],
    },
  ],
};

export const blackoutA: typeof en.blackoutA = {
  headline: ["Pequenas perdas que você não vê", "somam um número que você vê."],
  body: "Duas coisas acontecem quando uma aplicação rende menos.",
  chapters: [
    {
      kicker: "A óbvia",
      heading: "A reaplicação.",
      body: "Outra viagem, mais diesel, outra janela de clima que você não planejou.",
      image: "/img/kmep/blackout/respray.webp",
      alt: "Barra de pulverizador passando sobre milho jovem ao amanhecer, com névoa sobre as linhas",
    },
    {
      kicker: "A silenciosa",
      heading: "O potássio de que a lavoura precisava no mesmo trecho.",
      body: "E não recebeu, porque a demanda chegou ao pico com o solo seco e a raiz não conseguiu movê-lo rápido o bastante.",
      image: "/img/kmep/blackout/dryroots.webp",
      alt: "Raízes de suporte de um milho presas em solo seco e rachado no fim do verão",
    },
    {
      kicker: "Na colheita",
      heading: "As duas aparecem no monitor de produtividade.",
      body: "Nenhuma delas aparece como sintoma que dê para fotografar. Uma faixa de ensaio com a testemunha ao lado permite medir o resultado.",
      image: "/img/kmep/blackout/monitor.webp",
      alt: "Mapa de produtividade aceso no monitor da cabine de uma colheitadeira ao entardecer, na colheita do milho",
      proof: true,
    },
  ],
};

export const heroB: typeof en.heroB = {
  heading: "Uma passada. Dois trabalhos.",
  aside: { heading: ["Você não vai ver a perda", "até colher."] },
  body: "O KMEP Ultra® entra com o inseticida que você já escolheu. Ele melhora a cobertura e a deposição no dia da aplicação e coloca potássio na folha para a janela em que a demanda chega ao pico.",
};

export const sceneB: typeof en.sceneB = {
  steps: ["Uma passada", "Trabalho 1", "Trabalho 2", "Enchimento"],
  stages: [
    {
      kicker: "Uma passada",
      heading: "Uma passada. Dois trabalhos.",
      body: "O KMEP Ultra® vai no tanque com o inseticida que você já escolheu, na aplicação que você já agendou. Nenhuma viagem a mais pelo talhão.",
      legend: [],
      callouts: [
        { label: "Bico", note: "Mesmo bico, mesma dose" },
        { label: "Leque", note: "Vai com o inseticida que você escolheu" },
        { label: "Dossel", note: "A aplicação que você já agendou" },
      ],
      readout: [
        { k: "Viagens a mais", v: "0" },
        { k: "Tanque", v: "O mesmo" },
        { k: "Dose", v: "A mesma" },
      ],
    },
    {
      kicker: "Trabalho 1 · O dia da aplicação",
      heading: "O que a gota faz antes de secar.",
      body: "O KMEP Ultra® melhora como a calda cobre a superfície da folha e como ela deposita, para que mais do que você comprou chegue ao alvo que você mirou.",
      legend: [{ tone: 1, label: "Calda que fica" }],
      callouts: [
        { label: "Cobertura", note: "Espalhada pela superfície da folha" },
        { label: "Deposição", note: "Fica onde pousa" },
        { label: "Mesma dose", note: "Nada muda no rótulo" },
      ],
      readout: [
        { k: "Acontece em", v: "20 minutos" },
        { k: "Dose", v: "A mesma" },
        { k: "Bico", v: "O mesmo" },
      ],
    },
    {
      kicker: "Trabalho 2 · O resto da safra",
      heading: "O potássio foliar começa na folha.",
      body: "O potássio do solo precisa se dissolver, chegar à raiz e subir até a folha, e cada etapa desacelera quando o perfil seca. O potássio foliar entra no tecido a partir de onde pousa.",
      legend: [{ tone: 1, label: "Potássio" }],
      callouts: [
        { label: "Gota", note: "Onde o potássio pousa" },
        { label: "Para o tecido", note: "Entra a partir da folha" },
        { label: "Nervura", note: "O caminho pela folha" },
      ],
      readout: [
        { k: "Começa em", v: "A folha" },
        { k: "Espera o solo", v: "Não" },
        { k: "Dura", v: "A safra" },
      ],
    },
    {
      kicker: "Enchimento",
      heading: "Potássio nas semanas que definem a produtividade.",
      body: "A demanda de potássio chega ao pico tarde, enquanto o grão, o tubérculo ou o fruto enche, justamente quando um veranico limita o que o solo consegue mover. A aplicação tardia do rótulo coloca o potássio na folha nessa janela.",
      legend: [{ tone: 1, label: "Enchimento" }],
      callouts: [
        { label: "Grãos", note: "Onde a demanda chega ao pico" },
        { label: "Palha", note: "Formação da espiga: a última passada" },
        { label: "Estilos", note: "Polinização" },
      ],
      readout: [
        { k: "Aplicações", v: "Pelo rótulo da cultura" },
        { k: "Demanda", v: "Pico tardio" },
        { k: "Viagens a mais", v: "0" },
      ],
    },
  ],
};

export const blackoutB: typeof en.blackoutB = {
  headline: ["Você não vai ver a perda", "até colher."],
  body: "Parte de toda aplicação nunca faz o trabalho pelo qual você pagou.",
  chapters: [
    {
      kicker: "Na folha",
      heading: "Parte de toda passada erra.",
      body: "Parte da calda para no topo do dossel, parte quica e parte seca antes de chegar à superfície da folha que importava. Nada disso aparece da cabine.",
      image: "/img/kmep/blackout/canopy.webp",
      alt: "Gotas de calda sobre a folha de cima de um milho ao amanhecer, com as folhas de baixo na sombra",
    },
    {
      kicker: "No solo",
      heading: "No solo não é na planta.",
      body: "O potássio está no solo. A sua análise diz isso. Não é o mesmo que tê-lo na planta durante as semanas que definem a produtividade.",
      image: "/img/kmep/blackout/dryroots.webp",
      alt: "Raízes de suporte de um milho presas em solo seco e rachado no fim do verão",
    },
    {
      kicker: "Na colheita",
      heading: "Nove bushels, mesma passada.",
      body: "Um ensaio, publicado inteiro, com a faixa testemunha ao lado. O produto entrou com uma aplicação de inseticida que já estava no calendário.",
      image: "/img/kmep/blackout/monitor.webp",
      alt: "Mapa de produtividade aceso no monitor da cabine de uma colheitadeira ao entardecer, na colheita do milho",
      proof: true,
    },
  ],
};
