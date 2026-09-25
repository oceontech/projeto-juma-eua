import type * as en from "../kmep";

/**
 * Copy da LP do KMEP Ultra® em português, para revisão da Juma.
 * Mesmo formato de ../kmep.ts; ver src/content/index.ts.
 *
 * O inglês é a copy real e sai de docs/05-COPY-KMEP-ULTRA.md. Aqui os
 * números seguem em unidade americana, como aparecem na página publicada.
 * Revisão de 24/09/2026: nutrição primeiro, ação desalojante depois, sem
 * tecnologia de aplicação — ver o cabeçalho de ../kmep.ts.
 */

export const hero: typeof en.hero = {
  eyebrow: ["Potássio foliar", "Parceiro de tanque"],
  heading: "Potássio quando a lavoura mais precisa.",
  aside: { heading: ["Uma passada.", "Dois trabalhos."] },
  body: "O KMEP Ultra® é um potássio líquido 1-1-15 que vai na aplicação que você já faz e coloca potássio na folha nas semanas que definem produtividade e qualidade.",
  /* HOLD P2 */
  hold: "No mesmo tanque, ele ajuda o inseticida a alcançar as pragas que se escondem dele.",
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

export const twoJobs: typeof en.twoJobs = {
  eyebrow: "Mesmo tanque · Mesma passada",
  heading: "Uma passada. Dois trabalhos.",
  lead: "O KMEP Ultra® vai no tanque numa aplicação que você já agendou. Sem viagem extra pelo talhão. O primeiro trabalho, e o motivo de comprar, é potássio que a folha consegue absorver nas semanas em que a lavoura está enchendo. O segundo é uma vantagem adicional para o inseticida que está no mesmo tanque.",
  close: "O potássio trabalha pelo resto da safra. O segundo trabalho termina nos vinte minutos em que o pulverizador está naquele talhão.",
  scene: {
    pass: "Uma passada",
    potassium: {
      tag: "Trabalho 1",
      title: "Potássio foliar",
      body: "Potássio que a folha consegue absorver, nas semanas que definem produtividade e qualidade.",
      time: "O resto da safra",
      start: "Dia da aplicação",
      marks: ["Florada", "Enchimento", "Colheita"],
    },
    /* HOLD P2 */
    flush: {
      tag: "Trabalho 2 · Vantagem adicional",
      title: "Ação desalojante",
      body: "Tira as pragas do abrigo e as coloca em contato com o inseticida que você já escolheu.",
      clock: "20 min",
      time: "Vinte minutos naquele talhão",
    },
  },
};

export const potassium: typeof en.potassium = {
  label: "Trabalho 1 · O resto da safra",
  heading: "A produtividade se define com potássio que a raiz pode não entregar a tempo.",
  body: "A demanda de potássio chega ao pico tarde, da florada ao enchimento do grão, do tubérculo ou do fruto, que é exatamente quando um veranico, uma camada compactada ou um sistema radicular raso limitam quanto o solo consegue de fato mover.",
  roles: {
    label: "Por que o potássio importa",
    items: [
      {
        title: "Ele leva o açúcar para a colheita.",
        body: "O potássio é o nutriente que a planta usa para carregar o açúcar e levá-lo para o grão, o tubérculo e o fruto. É por isso que a demanda chega ao pico quando a lavoura enche.",
      },
      {
        title: "Ele mantém o tecido firme.",
        body: "Ele segura a água nas células e comanda a abertura e o fechamento dos estômatos, o controle da própria planta sobre a água num veranico.",
      },
      {
        title: "Ele aparece na qualidade.",
        body: "Tamanho do fruto, teor de açúcar e vida de prateleira são as marcas clássicas de quanto potássio a lavoura teve enquanto enchia.",
      },
    ],
    analysis: {
      label: "O que vai na bombona",
      formula: "1-1-15",
      rows: [
        { k: "Nitrogênio (N)", v: "1,2%" },
        { k: "Fósforo (P₂O₅)", v: "1,0%" },
        { k: "Potássio (K₂O)", v: "15,0%" },
      ],
      note: "Tudo solúvel em água. Análise garantida do rótulo americano.",
    },
  },
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
  label: "Trabalho 2 · Uma vantagem adicional",
  heading: "O que você não alcançou é o que volta.",
  body: "A aplicação estava certa. O produto estava certo. Parte da população simplesmente nunca encontrou a calda, porque estava embaixo da folha, no cartucho, no fundo do dossel. O KMEP Ultra® vai no mesmo tanque, tira essas pragas do abrigo e as mantém em movimento, para que mais delas entrem em contato com o inseticida que você já pagou.",
  stages: [
    { n: "01", title: "Abrigado", body: "Onde a calda nunca iria chegar." },
    { n: "02", title: "Desalojado", body: "Ele sai e continua se movendo." },
    { n: "03", title: "Exposto", body: "Na frente do produto que você já comprou." },
  ],
  caveatLabel: "Mesma dose, mesmo rótulo",
  caveat: "Mais do inseticida, nunca menos inseticida. Mesma dose, mesmo rótulo, mesmo tanque. O que muda é quanto da população o inseticida de fato alcança.",
  alt: "Diagrama do cartucho do milho em três tempos: a praga abrigada dentro, saindo, e exposta na folha aberta",
};

export const operation: typeof en.operation = {
  heading: "O que ele faz pela operação.",
  cards: [
    {
      title: "Potássio numa forma que a folha absorve.",
      body: "Na folha, na janela em que a demanda de fato chega ao pico, em vez de esperar pela umidade do solo.",
      image: "/img/kmep/operation-potassium.webp",
    },
    {
      title: "Vai no tanque que você já está enchendo.",
      body: "Compatível em mistura de tanque. Sem passada separada, sem diesel extra, sem nova janela de clima para esperar.",
      image: "/img/kmep/operation-tank.webp",
    },
    /* HOLD P2 — o card inteiro */
    {
      title: "Mais da população encontra o inseticida.",
      body: "A ação desalojante tira as pragas do abrigo, na dose que já está no rótulo do inseticida.",
      image: "/img/kmep/cigarrinha-do-milho-parada.webp",
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
      "Quer potássio na folha nas semanas em que a lavoura está enchendo",
      "Conduz as próprias faixas testemunha",
    ],
  },
  notFit: {
    label: "Não serve",
    lead: "Para quem quer",
    items: [
      "Substituir um programa de potássio no solo",
      "Reduzir a dose de inseticida",
      "Comprar um produto que funcione sem uma aplicação que já ia sair",
    ],
  },
  close: [
    "Não é um programa de potássio, e não substitui um.",
    "É potássio na folha nas semanas que contam, numa passada que ia sair de qualquer jeito.",
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
  alt: "Vista aérea próxima de fileiras de soja com uma faixa testemunha mais clara",
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
      q: "Quanto potássio vai numa aplicação?",
      a: "Onças, não libras. Na dose do rótulo, 16 fl oz por acre, uma aplicação coloca cerca de 3 oz de K₂O em cada acre, na folha, nas semanas que contam. O seu programa de solo sustenta a safra. Este é o potássio que não precisa esperar pela raiz.",
    },
    {
      q: "Qual a diferença para um 0-0-25 comum ou KTS?",
      a: "Um 0-0-25 é uma fonte de potássio e nada além disso. O KMEP Ultra® é um 1-1-15 feito para ir no tanque de pulverização, para que o potássio chegue à folha numa passada que você já está fazendo.",
      /* HOLD P2 — remover junto com Flush.tsx */
      hold: "No mesmo tanque, ele também tira as pragas do abrigo e as coloca em contato com o inseticida que você já pagou.",
    },
    {
      q: "Posso reduzir a dose do inseticida usando ele?",
      a: "Não. Ele não muda a dose daquele rótulo e não é motivo para baixá-la. Use a sua dose normal.",
      /* HOLD P2 — remover junto com Flush.tsx */
      hold: "O que ele muda é quanto da população essa dose alcança.",
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
  alt: "Colheita de milho ao pôr do sol, com o grão sendo descarregado na carreta ao lado da colheitadeira",
};

/* As cenas de partículas e o preto, versões A e B — ver ../kmep.ts. */

type Stage = (typeof en.sceneA)["stages"][number];

const readEar: Stage = {
  kicker: "Onde a demanda chega ao pico",
  heading: "A produtividade se define nas últimas semanas da safra.",
  body: "A demanda de potássio chega ao pico tarde, da florada ao enchimento do grão, do tubérculo ou do fruto. É quando a lavoura mais move açúcar, e é o potássio que o carrega.",
  legend: [{ tone: 1, label: "Enchimento" }],
  callouts: [
    { label: "Grãos", note: "Onde a demanda chega ao pico" },
    { label: "Palha", note: "O enchimento: grão, tubérculo ou fruto" },
    { label: "Estilos", note: "Florada" },
  ],
  readout: [
    { k: "Demanda", v: "Pico tardio" },
    { k: "Janela", v: "Da florada ao enchimento" },
    { k: "Sinal visível", v: "Nenhum ainda" },
  ],
};

const readRoots: Stage = {
  kicker: "Onde o solo trava",
  heading: "No solo não é na planta.",
  body: "O potássio está no solo. A sua análise diz isso. Mas ele se move com a água, e um veranico ou uma camada compactada o freiam justamente quando a lavoura mais pede.",
  legend: [{ tone: 2, label: "Potássio que não chega à raiz a tempo" }],
  callouts: [
    { label: "Raiz", note: "Só absorve o que chega até ela" },
    { label: "Potássio", note: "Preso num perfil secando" },
    { label: "Camada compactada", note: "Freia a água" },
  ],
  readout: [
    { k: "Análise de solo", v: "Adequada" },
    { k: "Perfil", v: "Secando" },
    { k: "Chegando à raiz", v: "Atrasado" },
  ],
};

const readLeaf: Stage = {
  kicker: "Pela folha",
  heading: "O potássio foliar começa na folha.",
  body: "Ele não espera a umidade do solo nem a raiz. O KMEP Ultra® coloca potássio na folha, e ele entra no tecido a partir de onde pousa, nas semanas em que a lavoura está enchendo.",
  legend: [{ tone: 1, label: "Potássio" }],
  callouts: [
    { label: "Gota", note: "Onde o potássio pousa" },
    { label: "Para o tecido", note: "Entra a partir da folha" },
    { label: "Nervura", note: "O caminho pela folha" },
  ],
  readout: [
    { k: "Começa em", v: "A folha" },
    { k: "Espera o solo", v: "Não" },
    { k: "Análise", v: "1-1-15" },
  ],
};

const readPass: Stage = {
  kicker: "Na sua passada",
  heading: "Na aplicação que você já faz.",
  body: "O KMEP Ultra® vai no tanque que você já está enchendo, a 16 fl oz por acre. Sem viagem extra, sem nova janela de clima. O potássio sai junto com o inseticida que você já escolheu.",
  legend: [],
  callouts: [
    { label: "Bico", note: "Mesmo bico, mesmo calendário" },
    { label: "Calda", note: "Potássio no mesmo tanque" },
    { label: "Dossel", note: "Onde ele pousa" },
  ],
  readout: [
    { k: "Dose", v: "16 fl oz/ac" },
    { k: "Viagens a mais", v: "0" },
    { k: "Tanque", v: "O mesmo" },
  ],
};

export const sceneA: typeof en.sceneA = {
  steps: ["Pico da demanda", "O solo trava", "Pela folha", "Na sua passada"],
  stages: [readEar, readRoots, readLeaf, readPass],
};

export const blackoutA: typeof en.blackoutA = {
  headline: ["Pequenas faltas que você não vê", "somam um número que você vê."],
  body: "Potássio que chega tarde não deixa sintoma que dê para fotografar. Ele aparece em três lugares.",
  chapters: [
    {
      kicker: "No solo",
      heading: "A análise de solo disse que ele estava lá.",
      body: "E estava. Só não conseguiu chegar à raiz rápido o bastante enquanto a demanda chegava ao pico e o perfil secava.",
      image: "/img/kmep/blackout/dryroots.webp",
      alt: "Raízes de suporte de um milho presas em solo seco e rachado no fim do verão",
    },
    {
      kicker: "No enchimento",
      heading: "Aparece no tamanho, na qualidade e na vida de prateleira.",
      body: "O potássio é o que carrega o açúcar para o grão, o tubérculo e o fruto. Quando ele falta no enchimento, é a colheita que carrega a diferença.",
      image: "/img/kmep/potassium-pods.webp",
      alt: "Vagens de soja enchendo na planta no fim do verão",
    },
    {
      kicker: "Na colheita",
      heading: "Nove bushels, mesma passada.",
      body: "Um ensaio, publicado inteiro, com a faixa testemunha ao lado: 221,2 contra 212,3 bu/ac no milho. O produto entrou numa aplicação que já estava no calendário.",
      image: "/img/kmep/blackout/monitor.webp",
      alt: "Mapa de produtividade aceso no monitor da cabine de uma colheitadeira ao entardecer, na colheita do milho",
      proof: true,
    },
  ],
};

export const heroB: typeof en.heroB = {
  heading: "Uma passada. Dois trabalhos.",
  aside: { heading: ["Potássio quando", "a lavoura mais precisa."] },
  body: "O KMEP Ultra® vai no tanque que você já enche. Ele coloca potássio na folha para as semanas que definem produtividade e qualidade.",
  /* HOLD P2 */
  hold: "E, no mesmo tanque, ajuda o inseticida a alcançar as pragas que se escondem dele.",
};

export const sceneB: typeof en.sceneB = {
  steps: ["Uma passada", "Trabalho 1", "Por que a folha", "Enchimento"],
  stages: [
    {
      ...readPass,
      kicker: "Uma passada",
      heading: "Uma passada. Dois trabalhos.",
      body: "O KMEP Ultra® vai no tanque com o inseticida que você já escolheu, na aplicação que você já agendou. Nenhuma viagem a mais pelo talhão.",
    },
    {
      ...readLeaf,
      kicker: "Trabalho 1 · Potássio foliar",
      heading: "Potássio, entrando pela folha.",
      body: "O KMEP Ultra® é um potássio líquido 1-1-15. Ele pousa na folha e entra no tecido a partir dali, sem esperar a umidade do solo nem a raiz.",
    },
    {
      ...readRoots,
      kicker: "Por que a folha",
    },
    {
      ...readEar,
      kicker: "Enchimento",
      heading: "Potássio nas semanas que definem a produtividade.",
      body: "A demanda de potássio chega ao pico tarde, enquanto o grão, o tubérculo ou o fruto enche. As aplicações tardias do rótulo colocam o potássio na folha nessa janela.",
      readout: [
        { k: "Aplicações", v: "Por cultura" },
        { k: "Demanda", v: "Pico tardio" },
        { k: "Viagens a mais", v: "0" },
      ],
    },
  ],
};

export const blackoutB: typeof en.blackoutB = {
  headline: ["Você não vai ver a falta", "até colher."],
  body: "Parte do potássio de que a lavoura precisa nunca chega a tempo.",
  chapters: [
    {
      kicker: "No solo",
      heading: "No solo não é na planta.",
      body: "O potássio está no solo. A sua análise diz isso. Não é o mesmo que tê-lo na planta durante as semanas que definem a produtividade.",
      image: "/img/kmep/blackout/dryroots.webp",
      alt: "Raízes de suporte de um milho presas em solo seco e rachado no fim do verão",
    },
    {
      kicker: "No enchimento",
      heading: "Aparece no tamanho, na qualidade e na vida de prateleira.",
      body: "O potássio é o que carrega o açúcar para o grão, o tubérculo e o fruto. Quando ele falta no enchimento, é a colheita que carrega a diferença.",
      image: "/img/kmep/potassium-pods.webp",
      alt: "Vagens de soja enchendo na planta no fim do verão",
    },
    {
      kicker: "Na colheita",
      heading: "Nove bushels, mesma passada.",
      body: "Um ensaio, publicado inteiro, com a faixa testemunha ao lado. O produto entrou numa aplicação que já estava no calendário.",
      image: "/img/kmep/blackout/monitor.webp",
      alt: "Mapa de produtividade aceso no monitor da cabine de uma colheitadeira ao entardecer, na colheita do milho",
      proof: true,
    },
  ],
};
