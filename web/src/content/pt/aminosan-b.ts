import type * as en from "../aminosan-b";

/**
 * Copy da LP B do Aminosan® em português, para revisão da Juma.
 * Mesmo formato de ../aminosan-b.ts; ver src/content/index.ts.
 */

export const hero: typeof en.hero = {
  eyebrow: "L-aminoácidos 100% livres",
  heading: "Aminoácidos, prontos.",
  aside: {
    heading: ["Direto na folha.", "Pronto para trabalhar."],
    body: "O Aminosan® é um nutriente foliar de L-aminoácidos 100% livres com N, P e K. De origem vegetal, feito por fermentação enzimática e aplicado na passada que você já faz.",
  },
  badge: "nutriente foliar",
  alt: "Uma bombona de Aminosan® em pé numa lavoura jovem de soja ao nascer do sol",
};

export const origin: typeof en.origin = {
  panels: [
    {
      eyebrow: "Dentro de toda lavoura",
      heading: "Nenhuma planta recebe um aminoácido pronto.",
      body: "Ela constrói cada um deles, a partir do nitrogênio bruto, numa linha que roda a safra inteira. É essa linha, uma etapa por vez.",
      caption: "Assimilação de nitrogênio, simplificada",
    },
    {
      eyebrow: "Etapa um",
      heading: "Começa como nitrato.",
      body: "O que a raiz absorve é NO₃⁻ — um nitrogênio preso a três oxigênios. É a forma em que o nitrogênio circula, e ainda não é nada que a planta consiga usar para construir.",
      caption: "NO₃⁻ · nitrato",
    },
    {
      eyebrow: "Etapas dois e três",
      heading: "Duas reduções até o amônio.",
      body: "De nitrato a nitrito, de nitrito a amônio. Duas enzimas, duas conversões, e as duas são pagas com energia e carbono que a lavoura produziu na folha.",
      caption: "NH₄⁺ · amônio",
    },
    {
      eyebrow: "Etapa quatro",
      heading: "E só agora, um aminoácido.",
      body: "O amônio entra no glutamato, e o glutamato repassa ao aminoácido que a lavoura estava construindo. Quatro conversões, e a lavoura pagou por todas elas.",
      caption: "L-aminoácido · NH₂ — CH(R) — COOH",
    },
  ],

  route: {
    label: "A rota que a lavoura percorre",
    steps: ["NO₃⁻", "NO₂⁻", "NH₄⁺", "Glu", "AA"],
    lit: [0, 1, 3, 5],
    shortcut: {
      label: "A rota com o Aminosan®",
      from: "Aminosan®",
      note: "Entregue como o aminoácido pronto: 100% livre, forma L, de origem vegetal.",
    },
  },
};

export const specimen: typeof en.specimen = {
  steps: ["A peça", "Ligadas", "Livres", "Na folha"],
  stepOf: "Etapa",
  stages: [
    {
      kicker: "A peça",
      heading: "Isto é um aminoácido.",
      body: "Toda proteína que a planta faz — as enzimas, a folha, a vagem — é montada com peças pequenas como esta. São vinte tipos, e cada um leva nitrogênio numa das pontas.",
      legend: [{ tone: 1, label: "Nitrogênio" }],
      callouts: [
        { label: "Ponta do nitrogênio", note: "NH₂ — o grupo amino" },
        { label: "Ponta ácida", note: "COOH — a outra ponta" },
        { label: "Cadeia lateral", note: "A parte que diferencia um tipo do outro" },
      ],
      readout: [
        { k: "O que é", v: "Uma peça" },
        { k: "Tipos", v: "20" },
        { k: "Leva", v: "Nitrogênio" },
      ],
    },
    {
      kicker: "Ligadas",
      heading: "Os aminoácidos podem vir ligados numa corrente.",
      body: "Presos ponta a ponta, eles se chamam peptídeos. Cada elo âmbar é uma ligação que precisa ser aberta antes de uma única peça poder ser usada.",
      legend: [
        { tone: 2, label: "Elo a abrir" },
        { tone: 1, label: "Nitrogênio" },
      ],
      callouts: [
        { label: "Elo", note: "A ligação entre dois aminoácidos" },
        { label: "Corrente", note: "Peças ainda presas umas às outras" },
        { label: "Ainda não livre", note: "Nenhuma peça aqui está sozinha" },
      ],
      readout: [
        { k: "Peças", v: "Presas" },
        { k: "Elos", v: "A abrir" },
        { k: "Pronto para uso", v: "Ainda não" },
      ],
    },
    {
      kicker: "Forma livre",
      heading: "O Aminosan® entrega as peças já separadas.",
      body: "100% livre. A proteína vegetal é desmontada por fermentação enzimática em L-aminoácidos individuais — sem correntes, sem elo nenhum para abrir.",
      legend: [{ tone: 1, label: "Nitrogênio" }],
      callouts: [
        { label: "Peças soltas", note: "Sem ligações peptídicas" },
        { label: "Só forma L", note: "A forma com que as proteínas vegetais são feitas" },
        { label: "Sem hormônios", note: "Aminoácidos mais N, P e K" },
      ],
      readout: [
        { k: "Peças", v: "Soltas" },
        { k: "Elos", v: "Nenhum" },
        { k: "Pronto para uso", v: "Sim" },
      ],
    },
    {
      kicker: "Na folha",
      heading: "Pulverizado na folha, numa passada que você já faz.",
      body: "Foliar, sozinho ou no tanque com o que já está no calendário — siga a ordem de mistura do rótulo. Nitrogênio, fósforo e potássio vão na mesma gota.",
      legend: [{ tone: 1, label: "Gota da pulverização" }],
      callouts: [
        { label: "A folha", note: "Onde a calda pousa" },
        { label: "Gota", note: "Aminoácidos mais N, P e K" },
        { label: "Sem viagem extra", note: "Vai numa passada que você já faz" },
      ],
      readout: [
        { k: "Aplicação", v: "Na folha" },
        { k: "Passadas extras", v: "0" },
        { k: "Leva", v: "N · P · K" },
      ],
    },
  ],
};

export const field: typeof en.field = {
  headline: ["E qual a diferença real", "na lavoura?"],
  body: "Da folha à raiz, acompanhe cada detalhe.",
  chapters: [
    {
      kicker: "A folha",
      heading: "Verde mais profundo, folha mais cheia.",
      body: "Um olhar de perto para a cor e o corpo da folha.",
      alt: "Folha trifoliolada de soja, verde profundo e cheia, ao nascer do sol",
    },
    {
      kicker: "A planta",
      heading: "Mais planta no mesmo estágio.",
      body: "Altura, caule e dossel entram em foco.",
      alt: "Planta jovem de soja, com folhas maiores e verde profundo",
    },
    {
      kicker: "Debaixo da terra",
      heading: "E, sob o solo, mais raiz.",
      body: "A parte que ninguém vê: raiz principal mais funda e mais raízes laterais explorando o solo.",
      alt: "Raiz de soja isolada com raiz principal longa e ramificações finas",
    },
  ],
};

export const assembly: typeof en.assembly = {
  label: "A linha de montagem",
  heading: "Nitrogênio não é aminoácido.",
  body: "O nitrato do solo ou do saco é matéria-prima. Antes de virar proteína, a planta precisa reduzi-lo, fixá-lo e repassá-lo, e cada etapa roda com energia e carbono que a lavoura produziu na folha.",
  steps: {
    label: "O que a planta faz com o nitrato",
    items: [
      {
        title: "Ela reduz.",
        formula: "NO₃⁻ → NO₂⁻ → NH₄⁺",
        body: "Nitrato em nitrito, nitrito em amônio. Duas enzimas, duas conversões, as duas pagas com energia produzida na folha.",
      },
      {
        title: "Ela fixa.",
        formula: "NH₄⁺ + Glu → Gln",
        body: "O amônio é fixado no glutamato e vira glutamina: a primeira forma de nitrogênio com que a planta consegue construir.",
      },
      {
        title: "Ela repassa.",
        formula: "Gln → Asp · Ala · Ser …",
        body: "Dali o nitrogênio é passado adiante, uma transferência por vez, para construir cada um dos outros aminoácidos.",
      },
    ],
  },
  routes: {
    heading: "Cinco etapas, ou uma.",
    body: "A rota da própria planta vai do nitrato ao aminoácido pronto, com um custo em cada conversão. O Aminosan® entra na folha já como o aminoácido pronto.",
    crop: {
      label: "A rota da própria planta",
      steps: ["Nitrato", "Nitrito", "Amônio", "Glutamina", "Aminoácidos"],
    },
    aminosan: {
      label: "Com Aminosan®",
      steps: ["Aplicado na folha", "Aminoácidos, prontos"],
    },
    cost: "Cada conversão gasta energia e carbono que a lavoura produziu na folha",
    logoAlt: "Aminosan®",
  },
  quote: "A planta sabe construir aminoácidos. Ou você pode entregar os prontos.",
};

export const compare: typeof en.compare = {
  label: "Nem todo aminoácido",
  heading: "Produtos de aminoácido não são todos feitos do mesmo jeito.",
  body: "A maior parte da categoria parte de uma proteína e a quebra. Do que ela parte, como é quebrada e até onde a quebra vai decidem o que acaba na bombona.",
  columns: { ours: "Aminosan®", theirs: "Um hidrolisado típico" },
  rows: [
    { k: "Parte de", ours: "Proteína vegetal", theirs: "Muitas vezes, subprodutos animais" },
    { k: "Quebrado por", ours: "Fermentação enzimática", theirs: "Muitas vezes, hidrólise ácida, com ácido forte e calor" },
    { k: "O que sai", ours: "L-aminoácidos 100% livres", theirs: "Muitas vezes, uma mistura de aminoácidos livres e cadeias de peptídeos" },
  ],
  note: "A coluna da direita descreve a categoria em geral, não um produto específico. Compare o que for, leia o rótulo.",
};

export const meet: typeof en.meet = {
  heading: "Conheça o Aminosan®",
  intro: "Da bombona à folha, em cinco passos.",
  pauseVideo: "Pausar vídeo",
  playVideo: "Reproduzir vídeo",
  stages: [
    {
      n: "01",
      title: "Despeje no tanque",
      body: "Direto no pulverizador. Sem equipamento novo, sem viagem a mais pela lavoura.",
    },
    {
      n: "02",
      title: "Entra no seu manejo",
      body: "Sozinho ou com os produtos que você já aplica. Siga a ordem de mistura do rótulo.",
    },
    {
      n: "03",
      title: "Cada gota leva",
      body: "L-aminoácidos 100% livres com N, P e K, espalhados na calda que você já aplica.",
    },
    {
      n: "04",
      title: "Pronto para usar",
      body: "Aminoácidos soltos, sem cadeias de peptídeos. Não sobra nada para a planta quebrar.",
    },
    {
      n: "05",
      title: "Na folha",
      body: "Aplicado, absorvido pela folha e usado como chega.",
    },
  ],
  cta: { label: "Veja onde entra", href: "#season" },
};

export const cell: typeof en.cell = {
  eyebrow: "Dentro da folha",
  stages: [
    {
      kicker: "Além da superfície",
      title: "Onde os aminoácidos trabalham.",
      body: "Cada célula da folha está construindo alguma coisa: enzimas, as proteínas que fazem a fotossíntese, a maquinaria que produz clorofila. Tudo isso é montado a partir de aminoácidos.",
    },
    {
      kicker: "Os blocos de construção",
      value: "20",
      title: "aminoácidos formam todas as proteínas que a planta constrói.",
      body: "O Aminosan® entrega aminoácidos livres, um a um, para entrarem direto na construção em vez de serem produzidos do zero.",
    },
    {
      kicker: "A forma certa",
      value: "L-",
      title: "a forma presente nas proteínas da própria planta.",
      body: "Os aminoácidos existem em duas formas espelhadas, e as células vegetais constroem com a forma L. É a única forma na bombona: L-aminoácidos 100% livres.",
    },
  ],
  alt: "Zoom macro de uma folha até as suas células",
};

export const rule: typeof en.rule = {
  label: "A prova",
  heading: ["Dois ensaios.", "Nenhum número, ainda."],
  body: "O Aminosan® tem resultados de produtividade de dois ensaios de soja no Brasil. Nenhum foi publicado com a testemunha ao lado, e um número sem a testemunha é um número que você não consegue conferir. Por isso eles ficam fora desta página até a testemunha chegar com eles. É a regra para todo número deste site.",
  labels: {
    crop: "Cultura",
    place: "Local",
    source: "Fonte",
    results: "Resultados de produtividade",
    check: "Testemunha",
    treated: "Com Aminosan®",
    requested: "Solicitada",
    withheld: "Retido",
  },
  trials: [
    { crop: "Soja", place: "Taquarivaí, São Paulo", source: "DETEC", results: 2 },
    { crop: "Soja", place: "Lavras, Minas Gerais", source: "Terras Gerais", results: 1 },
  ],
  why: {
    heading: "Por que a testemunha importa",
    body: "A produtividade varia de talhão para talhão e de ano para ano. Uma faixa sem tratamento, lado a lado e sob o mesmo manejo, é a única coisa que separa um bom talhão de um bom produto.",
  },
  close: ["Até a testemunha chegar, o melhor ensaio é o que você conduz.", "Nós fornecemos o produto para uma faixa na sua fazenda."],
  cta: { label: "Peça uma faixa de teste", href: "#trial-form" },
  footnote: "Resultados de ensaios de campo conduzidos no Brasil. O desempenho em campo varia com clima, solo e manejo.",
};

export const heritage: typeof en.heritage = {
  label: "Desde antes de 1988",
  heading: ["Mais antigo que a empresa", "que o fabrica."],
  body: "No fim dos anos 80, Julio Matino via sempre a mesma coisa nas lavouras de São Paulo: o produtor gastando mais em adubo e colhendo menos do que a lavoura podia dar. Ele formulou um foliar de aminoácidos de origem vegetal numa época em que a ideia soava estranha na revenda. A procura por ele construiu a empresa.",
  timeline: [
    { year: "Anos 80", title: "Formulado", body: "Julio Matino desenvolve um foliar de aminoácidos de origem vegetal, antes de existir empresa para vendê-lo." },
    { year: "1988", title: "Uma empresa para fabricá-lo", body: "A Juma Agro nasce em torno do produto que os produtores continuavam pedindo." },
    { year: "Hoje", title: "Ainda o carro-chefe", body: "Cada lote conferido no laboratório de controle de qualidade da própria Juma antes de sair." },
    { year: "Agora", title: "Nos EUA", body: "Juma-Agro Fertilizer LLC, em Lakeland, Flórida." },
  ],
  tagline: "Provado onde a safra nunca para.",
  founder: { name: "Julio Matino", role: "Fundador, Juma Agro", alt: "Julio Matino, fundador da Juma Agro" },
  bottleAlt: "Um frasco de Aminosan® de 1988 se transformando no frasco de hoje",
  yearLabel: "Ano",
};

export const timing: typeof en.timing = {
  label: "A janela",
  heading: "Quando ele entra.",
  body: "Numa passada foliar que já está no seu calendário: 14 a 20 fl oz por acre nas commodities, 14 fl oz nas hortaliças. Grandes culturas, hortaliças, frutas e ornamentais têm cada uma a sua janela. Escolha a sua cultura.",
  cropLabel: "Cultura",
  rateLabel: "Dose",
  ends: ["Plantio", "Colheita"],
  hint: "Role pela safra",
  pass: "Passada",
  crops: [
    {
      id: "soy",
      label: "Soja",
      rate: "14–20 fl oz/ac",
      marks: [
        { code: "Dia 25–30", at: 0.2 },
        { code: "Pré-florada", at: 0.4 },
      ],
      spans: [{ from: 0, to: 1, note: "Duas passadas, as duas antes da florada" }],
      summary: "Soja: uma passada aos 25 a 30 dias da germinação e outra logo antes da florada.",
    },
    {
      id: "corn",
      label: "Milho e sorgo",
      rate: "14–20 fl oz/ac",
      marks: [{ code: "Antes de V8", at: 0.3 }],
      spans: [{ from: 0, to: 0, note: "Uma passada, antes da oitava folha" }],
      summary: "Milho e sorgo: uma passada antes de as plantas atingirem oito folhas (V8).",
    },
    {
      id: "cotton",
      label: "Algodão",
      rate: "14–20 fl oz/ac",
      marks: [
        { code: "Início da florada", at: 0.4 },
        { code: "", display: "+10–15 dias", at: 0.5, minor: true },
        { code: "", display: "+10–15 dias", at: 0.6, minor: true },
        { code: "", display: "+10–15 dias", at: 0.7, minor: true },
      ],
      spans: [{ from: 0, to: 3, note: "Depois mais três a quatro, com 10 a 15 dias de intervalo" }],
      summary: "Algodão: uma passada no início da florada, depois mais três a quatro, com 10 a 15 dias de intervalo.",
    },
    {
      id: "grains",
      label: "Arroz, trigo e cevada",
      rate: "14–20 fl oz/ac",
      marks: [
        { code: "Pré-perfilhamento", at: 0.2 },
        { code: "Emborrachamento", at: 0.52 },
      ],
      spans: [{ from: 0, to: 1, note: "Logo antes do perfilhamento e de novo no emborrachamento" }],
      summary: "Arroz, trigo e cevada: uma passada logo antes do perfilhamento e outra no emborrachamento.",
    },
    {
      id: "beans",
      label: "Feijão",
      rate: "14–20 fl oz/ac",
      marks: [
        { code: "Dia 25–30", at: 0.2 },
        { code: "Pré-florada", at: 0.38 },
        { code: "Formação de grãos", at: 0.6 },
      ],
      spans: [{ from: 0, to: 2, note: "Três passadas, do dia 25 à formação de grãos" }],
      summary: "Feijão: aos 25 a 30 dias da germinação, logo antes da florada e na formação de grãos.",
    },
    {
      id: "legumes",
      label: "Ervilha e amendoim",
      rate: "14–20 fl oz/ac",
      marks: [
        { code: "Dia 25–30", at: 0.2 },
        { code: "Pré-florada", at: 0.38 },
        { code: "Formação de grãos", at: 0.6 },
      ],
      spans: [{ from: 0, to: 2, note: "Três passadas, do dia 25 à formação de grãos" }],
      summary: "Ervilha e amendoim: aos 25 a 30 dias da germinação, logo antes da florada e na formação de grãos.",
    },
    {
      id: "potato",
      label: "Batata",
      rate: "14 fl oz/ac",
      marks: [
        { code: "Amontoa", at: 0.3 },
        { code: "", display: "+7–10 dias", at: 0.44, minor: true },
        { code: "", display: "+7–10 dias", at: 0.58, minor: true },
      ],
      spans: [{ from: 0, to: 2, note: "Depois mais duas a três, com 7 a 10 dias de intervalo" }],
      summary: "Batata: uma passada depois da amontoa, depois mais duas a três, com 7 a 10 dias de intervalo.",
    },
    {
      id: "tomato",
      label: "Tomate",
      rate: "14 fl oz/ac",
      ends: ["Transplante", "Colheita"],
      marks: [
        { code: "Transplante", at: 0.14 },
        { code: "", display: "+7–10 dias", at: 0.28, minor: true },
        { code: "", display: "+7–10 dias", at: 0.42, minor: true },
        { code: "", display: "+7–10 dias", at: 0.56, minor: true },
      ],
      spans: [{ from: 0, to: 3, note: "Semanal no envarado, a cada 7 a 10 dias no rasteiro" }],
      summary: "Tomate: a partir do transplante, semanalmente no tomate envarado e a cada 7 a 10 dias no rasteiro.",
    },
    {
      id: "roots",
      label: "Cenoura e beterraba",
      rate: "14 fl oz/ac",
      marks: [
        { code: "10–15 cm", at: 0.26 },
        { code: "", display: "+7–10 dias", at: 0.42, minor: true },
        { code: "", display: "+7–10 dias", at: 0.58, minor: true },
      ],
      spans: [{ from: 0, to: 2, note: "Depois mais quatro a cinco, com 7 a 10 dias de intervalo" }],
      summary: "Cenoura e beterraba: uma passada aos 10 a 15 cm de altura, depois mais quatro a cinco, com 7 a 10 dias de intervalo.",
    },
    {
      id: "veg",
      label: "Hortaliças e morango",
      rate: "14 fl oz/ac",
      marks: [
        { code: "Primeira passada", at: 0.2 },
        { code: "", display: "+7–10 dias", at: 0.36, minor: true },
        { code: "", display: "+7–10 dias", at: 0.52, minor: true },
      ],
      spans: [{ from: 0, to: 2, note: "Cinco a seis passadas, com 7 a 10 dias de intervalo" }],
      summary: "Morango, pepino, vagem e outras hortaliças: cinco a seis passadas, com 7 a 10 dias de intervalo.",
    },
    {
      id: "onion",
      label: "Cebola e alho",
      rate: "14 fl oz/ac",
      marks: [
        { code: "Primeira passada", at: 0.24 },
        { code: "", display: "+15 dias", at: 0.42, minor: true },
        { code: "", display: "+15 dias", at: 0.6, minor: true },
      ],
      spans: [{ from: 0, to: 2, note: "Quatro a cinco passadas, com 15 dias de intervalo" }],
      summary: "Cebola e alho: quatro a cinco passadas, com 15 dias de intervalo.",
    },
    {
      id: "citrus",
      label: "Citros",
      rate: "Fale conosco",
      ends: ["Repouso", "Colheita"],
      marks: [
        { code: "Pré-florada", at: 0.18 },
        { code: "Pós-florada", at: 0.36 },
        { code: "Bolinha de gude", at: 0.54 },
        { code: "Bolinha de pingue-pongue", at: 0.72 },
      ],
      spans: [{ from: 0, to: 3, note: "Sempre no tanque com micronutrientes" }],
      summary: "Citros: antes da florada, depois da florada, na fase bolinha de gude e na fase bolinha de pingue-pongue. Sempre em mistura com micronutrientes.",
    },
    {
      id: "fruit",
      label: "Frutíferas",
      rate: "Fale conosco",
      ends: ["Colheita", "Próxima colheita"],
      marks: [
        { code: "Pós-colheita", at: 0.14 },
        { code: "Pós-florada", at: 0.44 },
        { code: "Desenvolvimento do fruto", at: 0.66 },
      ],
      spans: [{ from: 0, to: 2, note: "Uma passada em cada ponto da safra" }],
      summary: "Pêssego, maçã, manga e outras frutíferas: uma passada pós-colheita, uma depois da florada e uma no desenvolvimento do fruto.",
    },
    {
      id: "grape",
      label: "Uva",
      rate: "Fale conosco",
      ends: ["Colheita", "Próxima colheita"],
      marks: [
        { code: "Pós-colheita", at: 0.12 },
        { code: "Brotos de 15 cm", at: 0.34 },
        { code: "", display: "+15 dias", at: 0.5, minor: true },
        { code: "", display: "+15 dias", at: 0.66, minor: true },
      ],
      spans: [
        { from: 0, to: 0, note: "Uma passada pós-colheita" },
        { from: 1, to: 3, note: "Depois mais cinco a seis, com 15 dias de intervalo" },
      ],
      summary: "Uva: uma passada pós-colheita, uma com brotos de 15 cm e depois mais cinco a seis, com 15 dias de intervalo.",
    },
    {
      id: "ornamental",
      label: "Ornamentais",
      rate: "Fale conosco",
      ends: ["Plantio", "Florada"],
      marks: [
        { code: "Primeira passada", at: 0.2 },
        { code: "", display: "+7–10 dias", at: 0.38, minor: true },
        { code: "", display: "+7–10 dias", at: 0.56, minor: true },
      ],
      spans: [{ from: 0, to: 2, note: "A cada 7 a 10 dias até a formação do botão floral" }],
      summary: "Rosa, crisântemo, cravo, gladíolo e outras ornamentais: a cada 7 a 10 dias até a formação do botão floral.",
    },
  ],
};

export const season: typeof en.season = {
  heading: ["E as culturas que", "você planta para o mercado."],
  intro: "De pomares e hortaliças a ornamentais e grandes culturas, veja as culturas do calendário de aplicação do Aminosan.",
};

export const label: typeof en.label = {
  label: "O rótulo",
  heading: ["O que tem em", "cada bombona."],
  body: "Tudo o que importa está impresso no rótulo. Aqui está, em palavras simples.",
  alt: "Uma bombona de Aminosan®",
  facts: [
    { k: "Fórmula", v: "9-2-1, líquido" },
    { k: "Nitrogênio total", v: "9,0%: 2,6% solúvel em água, 6,4% ureico" },
    { k: "Fósforo (P₂O₅)", v: "2,0%, solúvel em água" },
    { k: "Potássio (K₂O)", v: "1,0%, solúvel em água" },
    { k: "Matérias-primas", v: "Ácido fosfórico, cloreto de potássio, ureia e aminoácidos" },
    { k: "Uso", v: "Pulverização foliar" },
    { k: "Bombona", v: "2,5 gal · 26,47 lb" },
    { k: "Validade", v: "2 anos, fechada, em local fresco, seco e longe do sol" },
  ],
  note: "Agite antes de usar. Mantenha fora do alcance de crianças.",
};

export const fit: typeof en.fit = {
  heading: "Para quem é.",
  fits: {
    label: "Serve",
    lead: "O Aminosan® faz sentido se você",
    items: [
      "Já faz passadas foliares e quer que os aminoácidos vão junto",
      "Quer aminoácidos de origem vegetal",
      "Planta grandes culturas, hortaliças, frutas ou ornamentais",
      "Vai deixar uma faixa testemunha sem tratamento e comparar",
    ],
  },
  notFit: {
    label: "Não serve",
    lead: "Procure outra coisa se você quer",
    items: [
      "Um substituto para o seu programa de nitrogênio",
      "Um regulador de crescimento ou um produto hormonal",
      "Uma promessa de produtividade sem faixa testemunha ao lado",
      "Um motivo para uma passada a mais no campo",
    ],
  },
  close: ["É um nutriente foliar, não um programa de adubação.", "Vai numa passada que você já está fazendo."],
};

export const strip: typeof en.strip = {
  label: "Como funciona a faixa de teste",
  heading: "Coloque à prova no seu chão.",
  steps: [
    { n: "01", title: "Escolha um talhão com uma passada foliar já programada.", body: "Nós mandamos o produto para uma faixa." },
    { n: "02", title: "Deixe uma faixa sem tratamento, sob o mesmo manejo.", body: "Essa faixa é o experimento inteiro." },
    { n: "03", title: "Colha as duas e compare.", body: "Nós voltamos para olhar os números com você, seja qual for o resultado." },
  ],
  promise: ["Sem custo pelo produto da faixa.", "Sem compromisso depois da colheita."],
  cta: { label: "Peça uma faixa de teste", href: "#trial-form" },
  alt: "Vista aérea de uma lavoura de soja com uma faixa de teste sinalizada",
};

export const questions: typeof en.questions = {
  heading: ["Respostas diretas", "para o produtor."],
  prev: "Anterior",
  next: "Próxima",
  items: [
    {
      q: "O que os aminoácidos livres têm de diferente?",
      a: "São aminoácidos soltos, sem cadeias de peptídeos. A planta pode usá-los sem precisar quebrar nada antes.",
      image: "/img/aminosan-b/meet-leaf.webp",
    },
    {
      q: "Qual a diferença para um hidrolisado?",
      a: "Muitos produtos de aminoácido são hidrolisados, muitas vezes de subprodutos animais e quebrados com ácido e calor. O Aminosan® é de origem vegetal, feito por fermentação enzimática e 100% livre.",
      image: "/img/aminosan-b/season-soy.webp",
    },
    {
      q: "Entra no meu programa de pulverização?",
      a: "Use sozinho ou no tanque com uma passada que você já programou. Siga a ordem de mistura do rótulo e faça o teste de calda em combinações novas.",
      image: "/img/aminosan-b/season-sprayer.webp",
    },
    {
      q: "Quando devo aplicar?",
      a: "Depende da cultura. A soja recebe uma passada aos 25 a 30 dias da germinação e outra antes da florada, o milho uma antes de V8, as hortaliças uma a cada 1 a 2 semanas. A janela de cada cultura está nesta página.",
      image: "/img/aminosan-b/season-corn.webp",
    },
    {
      q: "Tem hormônio?",
      a: "Não. O Aminosan® é não hormonal: aminoácidos livres mais nitrogênio, fósforo e potássio.",
      image: "/img/aminosan-b/timing-hands.webp",
    },
    {
      q: "Décadas no Brasil. Cadê o dado americano?",
      a: "Ainda não temos, e não vamos fingir que temos. É por isso que oferecemos uma faixa na sua fazenda: o seu talhão, a sua testemunha, o seu monitor de colheita.",
      image: "/img/aminosan-b/trial-strip.webp",
    },
    {
      q: "O que ele vai fazer pela minha lavoura?",
      a: "Nós descrevemos o que tem na bombona, não um resultado que não podemos mostrar. O que ele faz no seu chão é para isso que serve uma faixa com testemunha. Nós fornecemos o produto.",
      image: "/img/aminosan-b/proof-farmer.webp",
    },
    {
      q: "Quanto eu preciso?",
      a: "14 a 20 fl oz por acre nas commodities e 14 fl oz por acre nas hortaliças, numa passada que você já faz. Para frutas, citros e ornamentais, fale conosco.",
      image: "/img/aminosan-b/final-grower.webp",
    },
  ],
};

export const final: typeof en.final = {
  heading: ["Teste na", "sua lavoura."],
  body: "Diga sua cultura e seu estado. Mandamos preço, o rótulo e um plano de faixa de teste para a sua fazenda.",
  alt: "Produtora na borda de uma lavoura de milho ao entardecer",
  fields: {
    name: { label: "Nome completo", placeholder: "Seu nome" },
    email: { label: "E-mail", placeholder: "voce@fazenda.com" },
    state: { label: "Estado", placeholder: "Iowa" },
    crop: { label: "Cultura principal", placeholder: "Soja" },
  },
  call: "Quero uma ligação de um agrônomo",
  submit: "Pedir uma faixa de teste",
  sending: "Enviando…",
  privacy: "Usamos seus dados só para responder a este pedido.",
};
