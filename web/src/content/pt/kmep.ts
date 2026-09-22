import type * as en from "../kmep";

/**
 * Copy da LP do KMEP Ultra® em português, para revisão da Juma.
 * Mesmo formato de ../kmep.ts; ver src/content/index.ts.
 *
 * O inglês é a copy real e sai de docs/05-COPY-KMEP-ULTRA.md. Aqui os
 * números seguem em unidade americana, como aparecem na página publicada.
 */

export const hero: typeof en.hero = {
  eyebrow: ["Performance de aplicação", "Potássio foliar", "Parceiro de tanque"],
  heading: "Você não vai ver a perda até colher.",
  body: "Parte de toda aplicação nunca faz o trabalho pelo qual você pagou. O KMEP Ultra® vai no tanque que você já está enchendo. Ele melhora como a calda cobre e deposita, e leva potássio foliar para as semanas em que o enchimento de grãos define a produtividade. Seis dólares por acre.",
  cta: { label: "Faça uma faixa de teste na sua área", href: "#trial-form" },
  secondary: { label: "Ver o ensaio", href: "#proof" },
  alt: "Um pulverizador autopropelido fazendo uma aplicação de inseticida ao nascer do sol",
};

export const proofBand: typeof en.proofBand = {
  label: "O ensaio, em uma linha",
  stats: [
    { value: 221.3, decimals: 1, unit: "bu/ac", label: "Tratado" },
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
    jobA: { tag: "Trabalho 1", title: "Cobertura e deposição", clock: "20 min", time: "Vinte minutos naquele talhão" },
    jobB: {
      tag: "Trabalho 2",
      title: "Potássio foliar",
      time: "O resto da safra",
      marks: ["Polinização", "Enchimento de grãos", "Colheita"],
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
  heading: "O enchimento de grãos depende de potássio que a raiz pode não entregar a tempo.",
  body: "A demanda de potássio chega ao pico tarde, na polinização e no enchimento de grãos, que é exatamente quando um veranico, uma camada compactada ou um sistema radicular raso limitam quanto o solo consegue de fato mover.",
  quote: "O potássio está no solo. A sua análise diz isso. Não é a mesma coisa que tê-lo na planta durante as três semanas que formam o grão.",
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
    title: "Seis dólares por acre, contra 8,9 bushels.",
    cost: { value: "$6", unit: "/acre", label: "Custo do produto, uma aplicação" },
    gain: { value: "+8,9", unit: "bu/ac", label: "Resposta no ensaio" },
    witness: "221,3 vs 212,3 bu/ac na testemunha · Ensaio Rehagro, Brasil",
    cta: { label: "Peça o relatório completo do ensaio", href: "#trial-form" },
  },
};

export const proof: typeof en.proof = {
  label: "O ensaio",
  heading: "Nove bushels, mesma passada.",
  body: "Um ensaio, publicado inteiro, com a faixa testemunha ao lado. Milho em manejo de cigarrinha, Rehagro, Brasil. O produto entrou junto com uma aplicação de inseticida que já estava no calendário, então os nove bushels saíram de uma passada que ia acontecer de qualquer forma.",
  pair: {
    check: { label: "Testemunha", value: 212.3 },
    treated: { label: "Tratado · KMEP Ultra®", value: 221.3 },
    diff: { label: "Diferença", value: "+8,9", note: "+4,2%" },
    unit: "bu/ac",
  },
  scale: { max: 250, step: 50, unit: "bu/ac", label: "A escala começa em zero" },
  table: {
    label: "O ensaio, na íntegra",
    intro: "Um ensaio, publicado inteiro. Quando tivermos mais, estarão aqui também, inclusive os que não separaram.",
    columns: ["Cultura", "Local", "Tratado", "Testemunha", "Diferença", "Fonte", "Ano"],
    rows: [
      ["Milho", "Brasil", "221,3 bu/ac", "212,3 bu/ac", "+8,9 (+4,2%)", "Rehagro", "Em confirmação"],
      ["", "Unidades originais", "231,45 sc/ha", "222,12 sc/ha", "+9,33 sc/ha", "", ""],
    ],
  },
  paper: {
    label: "E um segundo, revisado por pares",
    heading: "Blocos casualizados, estação experimental de terceiro, e um periódico que publicou.",
    body: "Algodão, safra 2021, conduzido em estação experimental independente em Rio Verde, Goiás. Delineamento de blocos casualizados, três tratamentos: o programa de inseticidas recomendado sozinho, o mesmo programa com KMEP Ultra® em todas as aplicações, e o mesmo programa com KMEP Ultra® em aplicações alternadas. Quinze aplicações, colheita manual e avaliação de produtividade ao final. Os dois tratamentos com KMEP Ultra® produziram mais que a testemunha.",
    facts: [
      { k: "Delineamento", v: "Blocos casualizados · 3 tratamentos" },
      { k: "Estação", v: "Independente · Rio Verde, Goiás" },
      { k: "Publicado em", v: "Revista Foco · v.16 n.2 · 2023" },
      { k: "DOI", v: "10.54751/revistafoco.v16n2-129" },
    ],
    disclosure: "Divulgação: três dos quatro autores são agrônomos da Juma-Agro. O quarto é pesquisador do Instituto Goiano de Agricultura, e o ensaio foi conduzido em estação experimental independente. Está dito aqui porque é o tipo de coisa que se descobre de qualquer forma, e porque um ensaio que dá para conferir vale mais que um em que é preciso acreditar.",
  },
  footnote: "Resultados de ensaios de campo conduzidos no Brasil. O desempenho em campo varia com clima, solo e manejo.",
};

export const economics: typeof en.economics = {
  heading: "Quanto valem nove bushels na sua área.",
  body: "Com o milho a $4,30, 8,9 bushels são $38,27 por acre. O produto custa seis dólares por acre na dose do rótulo, para uma aplicação. Publicamos os dois números juntos, porque a distância entre eles é a decisão inteira.",
  witness: "+8,9 bu/ac: 221,3 tratado vs 212,3 bu/ac na testemunha",
  columns: ["Preço do milho", "Valor de +8,9 bu/ac", "Custo do produto", "Líquido por acre"],
  rows: [
    { price: "$4,00/bu", value: 35.6, cost: 6, net: 29.6 },
    { price: "$4,30/bu", value: 38.27, cost: 6, net: 32.27 },
    { price: "$4,60/bu", value: 40.94, cost: 6, net: 34.94 },
  ],
  scale: { max: 45, step: 15 },
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
  context: {
    label: "Contexto · Dado público",
    stats: [
      { value: 185, label: "Condados" },
      { value: 16, label: "Estados" },
      { value: 2025, label: "Safra" },
    ],
    body: "A cigarrinha-do-milho foi confirmada em 185 condados de 16 estados na safra 2025. O Brasil convive com ela há mais de uma década.",
    source: "Pioneer, 2025, dado público.",
  },
};

export const timing: typeof en.timing = {
  heading: "Quando ele entra.",
  body: "Na aplicação de inseticida que você já tem no calendário. Milho e soja são as duas culturas posicionadas para os EUA hoje. Algodão e culturas especiais estão em revisão técnica.",
  cropLabel: "Cultura",
  season: "Safra",
  crops: [
    {
      id: "corn",
      label: "Milho",
      marks: [
        { code: "V4", at: 0.18 },
        { code: "V6", at: 0.32 },
        { code: "Formação da espiga", at: 0.62 },
      ],
      spans: [
        { from: 0, to: 1, note: "Vão junto com aplicações de inseticida já agendadas" },
        { from: 2, to: 2, note: "O potássio chegando onde está a demanda" },
      ],
      summary: "V4, V6 e de novo na formação da espiga. A janela do milho tem duas metades e as duas importam. As duas primeiras vão junto com aplicações de inseticida já agendadas, e a da formação da espiga é o potássio chegando onde está a demanda.",
    },
    {
      id: "soy",
      label: "Soja",
      marks: [
        { code: "V6/V7", at: 0.3 },
        { code: "", at: 0.47, minor: true },
        { code: "", at: 0.64, minor: true },
      ],
      spans: [{ from: 0, to: 2, note: "Repetindo a cada 10 a 15 dias" }],
      summary: "Soja: V6/V7, repetindo a cada 10 a 15 dias.",
    },
  ],
  details: [
    {
      k: "Dose e embalagem",
      v: "As doses em fl oz por acre vêm do rótulo americano; diga a sua cultura e nós enviamos.",
    },
    {
      k: "Mistura de tanque",
      v: "A ordem de mistura e as incompatibilidades conhecidas estão no rótulo. Faça teste de jarro em qualquer combinação que você ainda não usou.",
    },
  ],
  jugAlt: "Galão de 2,5 gal do KMEP Ultra® com o rótulo americano",
};

export const fit: typeof en.fit = {
  heading: "Para quem é.",
  fits: {
    label: "Serve",
    lead: "Para uma operação que",
    items: [
      "Já aplica inseticida em milho ou soja",
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
      a: "Porque as parcelas testemunha batem com o seu benchmark. O milho não tratado do nosso ensaio deu 212,3 bu/ac, perto da média nacional americana. O ensaio não foi feito em condição mais fácil que a sua; foi feito em condição mais difícil.",
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
    {
      q: "Quanto custa por acre?",
      a: "Seis dólares por acre por aplicação, na dose do rótulo. O ensaio ao lado dele deu 8,9 bu/ac (221,3 vs 212,3 bu/ac na testemunha), o que são $38,27 com o milho a $4,30. Publicamos os dois números na mesma tela.",
    },
  ],
};

export const final: typeof en.final = {
  heading: "Faça uma faixa de teste. O produto é por nossa conta.",
  body: "Escolha um talhão, deixe uma faixa testemunha sem tratar ao lado, e voltamos na colheita com você. Diga a sua cultura e o seu estado e enviamos antes o rótulo, as doses em fl oz por acre e o relatório completo do ensaio.",
  disclaimer: "O KMEP Ultra® é aplicado em mistura de tanque com um inseticida e nunca no lugar de um. Ele não muda a dose do rótulo do inseticida. Sempre leia e siga as instruções do rótulo do defensivo que você está aplicando.",
  crops: ["Milho", "Soja", "Algodão", "Outra"],
  alt: "Colheita de milho ao pôr do sol, com o grão sendo descarregado na carreta ao lado da colheitadeira",
};
