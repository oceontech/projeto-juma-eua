import type * as en from "../aminosan";

/**
 * Copy da LP do Aminosan® em português — provisória, para revisão da Juma.
 * Mesmo formato de ../aminosan.ts; ver src/content/index.ts.
 */

export const nitrogen: typeof en.nitrogen = {
  heading: "Nitrogênio não é aminoácido.",
  body: [
    "O nitrato no solo é matéria-prima, não produto acabado. Antes de o nitrogênio virar proteína, a planta precisa reduzi-lo, aminá-lo e montá-lo — uma cadeia de etapas que consome carbono e energia que a planta produziu para outra coisa.",
    "Numa safra com folga, é assim que funciona. Nas semanas que definem a produtividade, vira custo.",
  ],
  steps: ["Nitrato", "Aminação", "Proteína"],
};

export const process: typeof en.process = {
  pill: "Processo",
  eyebrow: "O Aminosan® entrega aminoácidos livres pela folha — já na forma que a planta usa.",
  heading: "Cinco etapas, ou uma.",
  cards: {
    longWay: {
      label: "01 — O caminho longo",
      formula: "NO₃⁻ → NO₂⁻ → NH₄⁺ → glutamato → aminoácido",
      body: "Nitrato em nitrito, nitrito em amônio, amônio em glutamato e glutamato no aminoácido de que a planta realmente precisa.",
    },
    shortWay: {
      label: "02 — O caminho curto",
      body: "Entrega imediata de aminoácidos. Aminoácidos livres aplicados na folha, na forma que a planta usa.",
    },
    whatsInIt: {
      label: "03 — O que tem nele",
      body: "Aminoácidos livres de origem vegetal com N, P e K. Fermentação enzimática.",
    },
  },
  cta: { label: "Ver os dados técnicos", href: "#product-analysis" },
};

export const delivery: typeof en.delivery = {
  eyebrow: "Juma-Agro Fertilizer LLC · Lakeland, Flórida",
  heading: ["Dois caminhos de entrega.", "Um entrega. O outro não."],
  longRoute: {
    label: "O caminho longo",
    tagline: "O que a planta perde na conversão.",
    steps: [
      { formula: "NO₃⁻", icon: "/img/aminosan/icon-nitrate.svg", label: "Nitrato" },
      { formula: "NO₂", icon: "/img/aminosan/icon-nitrite.svg", label: "Nitrito" },
      { formula: "NH₄⁺", label: "Amônio" },
      { icon: "/img/aminosan/icon-glutamate.svg", label: "Glutamato" },
      { icon: "/img/aminosan/icon-amino-acid.svg", label: "Aminoácido" },
    ],
    result: "Várias etapas. Mais energia. Mais perda.",
  },
  shortRoute: {
    label: "O caminho curto",
    tagline: "O que a planta usa. Desde o início.",
    stepLabel: "Aminoácidos livres",
    result: "Sem conversão. Sem desperdício. Máxima eficiência.",
  },
};

export const comparison: typeof en.comparison = {
  tagline: "Aminoácidos livres. Nutrição real. Resultados reais.",
  heading: "Nem todo aminoácido é igual.",
  columns: { aminosan: "Aminosan", others: "Outros produtos (categoria geral)" },
  subtitles: { aminosan: "Aminoácidos livres", others: "(Categoria geral)" },
  rows: [
    { label: "Origem", aminosan: "Vegetal", others: "Hidrolisado animal" },
    { label: "Processo", aminosan: "Fermentação enzimática", others: "Hidrólise ácida" },
    { label: "Forma", aminosan: "Aminoácidos livres", others: "Cadeias peptídicas" },
  ],
};

export const operationalBenefits: typeof en.operationalBenefits = {
  heading: "O que ele faz pela operação.",
  description: "Quatro respostas práticas, na ordem em que o produtor pergunta.",
  cards: [
    {
      n: "01",
      accent: "#257a44",
      heading: "Vai junto com o inseticida que você já comprou",
      body: "Compatível em mistura de tanque. Sem passada extra, sem diesel a mais, sem nova janela de clima.",
      image: "/img/aminosan/benefit-product.webp",
    },
    {
      n: "02",
      accent: "#b7c73e",
      heading: "Fornece blocos de construção que a planta usa na hora",
      body: "Aminoácidos livres prontos para absorção e uso imediatos.",
      icon: "/img/aminosan/icon-benefit-02.svg",
    },
    {
      n: "03",
      accent: "#257a44",
      heading: "Favorece a nutrição em condições de estresse",
      body: "Ajuda a planta a render mais sob seca, calor e pressão.",
      icon: "/img/aminosan/icon-benefit-03.svg",
    },
    {
      n: "04",
      accent: "#b7c73e",
      heading: "Ajuda a proteger o potencial produtivo e os resultados",
      body: "Mais eficiência, mais desempenho, mais retorno sobre o que você investe.",
      icon: "/img/aminosan/icon-benefit-04.svg",
    },
  ],
};

export const trialResults: typeof en.trialResults = {
  tagline: "Ensaios reais. Campos reais. Resultados reais.",
  heading: "O que podemos mostrar hoje.",
  description:
    "Temos resultados de ensaios em soja de duas instituições brasileiras — DETEC, em Taquarivaí, e Terras Gerais, em Lavras.",
  notice: {
    label: "Por que alguns números ainda não aparecem",
    heading: "Todo número neste site traz a sua testemunha sem tratamento.",
    body: "Não vamos publicá-los até podermos colocar a testemunha ao lado, porque essa é a regra para todo número deste site. Peça e enviamos o que temos, na íntegra.",
    cta: "Ver os dados técnicos",
  },
  table: {
    title: "Resultados de ensaios em soja",
    subtitle: "Diferença de produtividade (tratado vs testemunha)",
    columns: ["Cultura", "Local", "Tratado", "Testemunha", "Diferença", "Fonte"],
    rows: [
      { crop: "Soja", location: "Taquarivaí, SP", treated: "—", check: "—", difference: "+1,1 sc/ha", source: "DETEC" },
      { crop: "Soja", location: "Taquarivaí, SP", treated: "—", check: "—", difference: "+1,4 sc/ha", source: "DETEC" },
      { crop: "Soja", location: "Lavras, MG", treated: "—", check: "—", difference: "+1,0 sc/ha", source: "Terras Gerais" },
    ],
    disclaimer: "Resultados de ensaios de campo conduzidos no Brasil. O desempenho no campo varia conforme clima, solo e manejo.",
  },
};

export const trialEvidence: typeof en.trialEvidence = {
  play: { before: "Reproduzir imagens: ", after: "" },
  tagline: "Enquanto nem todos os números podem ser publicados, as parcelas podem ser mostradas.",
  cards: [
    {
      label: "Aminosan®",
      body: "As mesmas duas tomadas sobre a parcela tratada — mesma altitude, mesma lente, mesmo dia, editadas com a mesma duração.",
    },
    {
      label: "Testemunha sem tratamento",
      body: "Voo de drone sobre a parcela testemunha do ensaio de soja da DETEC ou da Terras Gerais, mais uma tomada ao nível do solo da carga de vagens no mesmo dia.",
    },
  ],
};

export const economics: typeof en.economics = {
  heading: ["Faça a conta", "na sua lavoura."],
  description:
    "Publicamos o custo por acre ao lado da resposta em produtividade, nunca um sem o outro. Os dois números estão sendo confirmados para o mercado americano — peça e enviamos assim que estiverem definidos.",
  intro: {
    eyebrow: "Economia do Aminosan®",
    heading: ["Resposta em produtividade vs.", "custo do produto"],
    body: "Assumimos o compromisso de mostrar os dois lados da equação. Veja a diferença que define o seu retorno.",
  },
  chart: {
    title: "Dólares por acre",
    hint: "Mais é melhor →",
    bars: [
      { label: "Resposta em produtividade", tag: "[P9 resposta]", swatch: "#0e1b14" },
      { label: "Custo do produto", tag: "[P8 custo]", swatch: "#0f522a" },
      { label: "Diferença", tag: "(retorno líquido)", swatch: "#b7c73e" },
    ],
    pending: "Aguardando confirmação",
  },
};

export const companyStory: typeof en.companyStory = {
  eyebrow: "1988 · Mogi Guaçu, São Paulo",
  heading: "Mais antigo que a empresa que o fabrica.",
  body: [
    "Júlio Matino formulou o Aminosan® no fim dos anos 1970, antes de existir uma empresa para vendê-lo. Produtores de São Paulo compraram porque funcionava, e a demanda construiu o negócio.",
    "Quatro décadas depois, a confiança no seu desempenho continua no centro de tudo. Ele não foi desenvolvido para seguir tendências. Para produtores e distribuidores, segue sendo uma das melhores soluções da categoria.",
  ],
  cta: { label: "Conheça a história no Brasil", href: "#" },
};

export const growthStages: typeof en.growthStages = {
  heading: "Quando ele entra.",
  description:
    "Sozinho ou na passada que você já está fazendo. Soja e milho são as duas culturas posicionadas para os EUA hoje; algodão e hortifrúti estão em revisão técnica.",
  guidelines: [
    {
      n: "01",
      label: "Janela",
      title: "Soja V2–V3 → R5\nMilho V2 → V8",
      body: "Sozinho ou em mistura de tanque, seguindo a recomendação técnica. Algodão e hortifrúti: em revisão técnica para as condições dos EUA.",
      image: "/img/aminosan/guideline-soybean-leaf.webp",
      dark: true,
    },
    {
      n: "02",
      label: "Dose",
      title: "[P4] fl oz/ac",
      body: "A dose por acre e o número de aplicações vêm da bula americana.",
      image: "/img/aminosan/guideline-leaf-droplet.webp",
      dark: true,
    },
    {
      n: "03",
      label: "Mistura de tanque",
      title: "Faça o teste de jarra antes",
      body: "A ordem de mistura está na bula. Faça o teste de jarra com qualquer combinação que você ainda não usou.",
      image: "/img/aminosan/guideline-tank-mixing.webp",
      dark: false,
    },
  ],
  timeline: {
    vegetative: ["V2", "V4", "V6"],
    reproductive: ["R1", "R3", "R5"],
    spritePosition: { V2: "5.5% 50%", V4: "12.3% 50%", V6: "12.3% 50%", R1: "12.3% 50%", R3: "19.1% 50%", R5: "19.1% 50%" },
  },
};

export const guaranteedAnalysis: typeof en.guaranteedAnalysis = {
  heading: "Análise garantida",
  description: "Tudo abaixo vem da bula americana. Até ela existir, esta seção fica vazia em vez de aproximada.",
};

export const productAnalysis: typeof en.productAnalysis = {
  metrics: [
    { label: "Nitrogênio total (N)", value: "10,00%", tag: "[P1 – P3]", priority: false },
    { label: "Fósforo disponível (P₂O₅)", value: "5,00%", tag: "[P3]", priority: false },
    { label: "Aminoácidos livres (%)", value: "1,20%", tag: "[P3 – prioridade]", priority: true },
    { label: "Potássio solúvel (K₂O)", value: "5,00%", tag: "[P3]", priority: false },
    { label: "Carbono orgânico (%)", value: "1,00%", tag: "[P3]", priority: false },
  ],
  documents: [
    { label: "Solicitar a bula (PDF)", href: "#trial-request", filled: true },
    { label: "Solicitar a FISPQ", href: "#trial-request", filled: false },
  ],
};

export const faq: typeof en.faq = {
  eyebrow: "Dúvidas",
  heading: "As perguntas que recebemos primeiro.",
  description:
    "Respostas diretas sobre formulação, desempenho e registro nos EUA. A análise garantida completa está na bula.",
  items: [
    {
      question: "Qual a diferença entre ele e um hidrolisado?",
      answer:
        "Origem, processo e forma — origem vegetal, fermentação enzimática, aminoácidos livres em vez de cadeias peptídicas. A análise garantida completa está na bula.",
      openByDefault: true,
    },
    {
      question: "Quarenta anos e nenhum dado nos EUA?",
      answer:
        "Ainda não — e preferimos dizer isso a desviar do assunto. É para isso que serve a faixa de teste: o seu talhão, a sua faixa testemunha, o seu monitor de colheita. Nós fornecemos o produto.",
    },
    {
      question: "Posso usar em mistura de tanque?",
      answer:
        "Sim, sozinho ou em mistura, seguindo a ordem de mistura da bula. Faça o teste de jarra com qualquer combinação que você ainda não usou.",
    },
    {
      question: "Ele tem certificação OMRI?",
      answer: "Ainda não confirmado para o mercado americano — pergunte e retornamos assim que estiver definido.",
    },
    {
      question: "O que ele de fato faz pela minha lavoura?",
      answer:
        "Fornece aminoácidos livres e N-P-K pela folha. O que podemos mostrar são dados de ensaio com a testemunha sem tratamento ao lado — peça e enviamos os relatórios.",
    },
  ],
};

export const trialRequest: typeof en.trialRequest = {
  heading: ["Quarenta anos de ensaios.", "Agora conduza o seu."],
  description:
    "Escolha um talhão, deixe uma faixa testemunha sem tratamento ao lado e voltamos na colheita com você — nós fornecemos o produto. Diga sua cultura e seu estado e enviamos a bula, as doses em fl oz por acre e os relatórios de ensaio do que você cultiva.",
  fields: {
    name: { label: "Nome completo", placeholder: "Digite seu nome completo" },
    email: { label: "E-mail", placeholder: "Digite seu e-mail" },
    state: { label: "Estado", placeholder: "Iowa" },
    crop: { label: "Cultura principal", placeholder: "Milho" },
  },
  call: "Quero receber uma ligação de um agrônomo",
  submit: "Enviar solicitação",
  sending: "Enviando…",
  privacy: {
    before: "Ao enviar, você concorda com nossa ",
    link: "Política de Privacidade",
    after: ". Usamos suas informações apenas para responder a esta solicitação.",
  },
};

export const hero: typeof en.hero = {
  eyebrow: "Aminoácidos livres de origem vegetal · Fermentação enzimática",
  heading: "AMINOSAN",
  card: {
    eyebrow: "Aminoácidos livres de origem vegetal + fermentação enzimática",
    title: "A planta consegue produzir aminoácidos. Ou você pode entregá-los prontos.",
    body: "O Aminosan® é um fertilizante foliar de aminoácidos livres de origem vegetal com N, P e K, produzido por fermentação enzimática. Ele está no campo há mais tempo que a empresa que o fabrica.",
    ctas: [
      { label: "Faça uma faixa de teste", href: "#trial-request" },
      { label: "Veja os ensaios", href: "#trial-results" },
    ],
  },
  stats: [
    { value: "40", label: "anos no campo", icon: "years" },
    { value: "1988", label: "a empresa veio depois", icon: "company" },
    {
      value: "Fermentação enzimática",
      label: "Melhor absorção. Melhores resultados",
      icon: "fermentation",
    },
    { value: "2", label: "Ensaios em soja com fonte identificada", icon: "trials" },
  ],
  tagline: "DETEC · Terras Gerais · Brasil · As produtividades saem quando a testemunha chegar [P9]",
};
