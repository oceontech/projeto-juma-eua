/**
 * Copy da LP do KMEP Ultra® (/kmep), em inglês americano.
 *
 * **Canônico: `docs/05-COPY-KMEP-ULTRA.md`.** O plano de execução da página
 * está em `docs/06-PROMPT-LP-KMEP.md`.
 *
 * **Revisão de 24/09/2026 — nutrição primeiro.** Decisão do cliente: o KMEP é
 * antes de tudo potássio foliar; a ação desalojante vem depois, como o
 * segundo trabalho da mesma passada; e a página não fala mais de tecnologia de
 * aplicação (cobertura, deposição, a gota que fica na folha, túnel de vento).
 * Saíram K3, K4, K6 e K12 e as leituras de gota da cena A.
 *
 * Regras que valem para cada linha deste arquivo:
 * - FIFRA: o produto entrega potássio na folha. O que o potássio faz na
 *   planta aparece como agronomia do nutriente, nunca como efeito do produto.
 *   A ação desalojante é claim de pesticida enquanto a P2 não voltar: ela
 *   mora no `flush` (K8), no segundo cartão do `twoJobs`, no card 3 da
 *   `operation` e nos trechos `hold`, todos marcados com HOLD P2.
 * - Todo número anda com a testemunha ao lado e com a fonte embaixo.
 * - Pendência nunca aparece na tela: o marcador fica no comentário e o texto
 *   diz a frase honesta do que existe hoje.
 */

export type Stat = {
  value: number;
  decimals: number;
  prefix?: string;
  unit: string;
  label: string;
  /** Leitura complementar, na mesma célula (o percentual da diferença). */
  note?: string;
};

export type Question = {
  q: string;
  a: string;
  /** Trecho que depende da ação desalojante — HOLD P2. */
  hold?: string;
};

/* ---------------------------------------------------------------- K1 + K2 */

export const hero = {
  /* "Tank-mix partner" e não "insecticide partner": o olho diz como o produto
     entra, sem prometer nada sobre o defensivo. */
  eyebrow: ["Foliar potassium", "Tank-mix partner"],
  heading: "Potassium when the crop needs it most.",
  /* O título curto do pé é a headline da versão B, partida na frase. */
  aside: { heading: ["One pass.", "Two jobs."] },
  body: "KMEP Ultra® is a 1-1-15 liquid potassium that rides in the spray you already run, and puts potassium on the leaf in the weeks that set yield and quality.",
  /** HOLD P2 — sai sem tocar no resto do hero. */
  hold: "In the same tank, it helps the insecticide reach the pests hiding from it." as string | undefined,
  /** O selo do canto: a folha com o texto em arco, como na LP B. */
  badge: "foliar potassium",
  cta: { label: "Run a trial strip on your acres", href: "#trial-form" },
  secondary: { label: "See the trial", href: "#proof" },
  alt: "A jug of KMEP Ultra® standing in a young soybean field at sunrise",
};

/** K2 — a faixa de prova ancorada no pé do hero. */
export const proofBand = {
  label: "The trial, in one line",
  stats: [
    { value: 221.2, decimals: 1, unit: "bu/ac", label: "Treated" },
    { value: 212.3, decimals: 1, unit: "bu/ac", label: "Untreated check" },
    { value: 8.9, decimals: 1, prefix: "+", unit: "bu/ac", label: "Difference", note: "+4.2%" },
  ] as Stat[],
  /* TODO(P21): acrescentar o ano do ensaio ao fim desta linha. */
  source: "Corn · Rehagro trial · Brazil",
};

/* --------------------------------------------------------------------- K5 */

export const twoJobs = {
  eyebrow: "Same tank · Same pass",
  heading: "One pass. Two jobs.",
  lead: "KMEP Ultra® goes in the tank on a pass you already scheduled. No separate trip across the field. The first job, and the reason to buy it, is potassium the leaf can take up in the weeks the crop is filling. The second is an added advantage for the insecticide in the same tank.",
  close: "The potassium works for the rest of the season. The second job is done in the twenty minutes the sprayer is in that field.",
  /* Rótulos da cena: o rastro que entra, e as duas pontas da bifurcação. O
     potássio é o cartão largo, à esquerda, com a régua da safra; a ação
     desalojante é o cartão estreito, com o mostrador de minutos. */
  scene: {
    pass: "One pass",
    potassium: {
      tag: "Job 1",
      title: "Foliar potassium",
      body: "Potassium the leaf can take up, in the weeks that set yield and quality.",
      time: "The rest of the season",
      start: "Spray day",
      marks: ["Flowering", "Filling", "Harvest"],
    },
    /* HOLD P2 — se a P2 vier restritiva, este cartão sai e o K5 volta a ter
       um trabalho só: trocar a headline por "Potassium, on a pass you already
       run." e tirar a bifurcação. */
    flush: {
      tag: "Job 2 · Added advantage",
      title: "Dislodging action",
      body: "Draws pests out of shelter, into contact with the insecticide you already chose.",
      clock: "20 min",
      time: "Twenty minutes in that field",
    },
  },
};

/* --------------------------------------------------------------------- K7 */

export const potassium = {
  label: "Job 1 · The rest of the season",
  heading: "Yield is set on potassium the root may not deliver in time.",
  body: "Potassium demand peaks late, from flowering through the fill of the grain, the tuber or the fruit, which is exactly when a dry stretch, a compaction layer or a shallow root system limits how much the soil can actually move.",
  /* O que o potássio faz na planta, como agronomia do nutriente — nunca como
     efeito do KMEP (FIFRA). Vem da ficha BR ("aumento de translocação de
     açúcares") e do folheto de morango ("Why potassium matters"). Pendente
     de revisão do técnico da Juma (07-CURADORIA, 4.3). */
  roles: {
    label: "Why potassium matters",
    items: [
      {
        title: "It moves sugar into the harvest.",
        body: "Potassium is the nutrient the plant uses to load sugar and carry it into the grain, the tuber and the fruit. That is why the demand peaks when the crop fills.",
      },
      {
        title: "It keeps the tissue firm.",
        body: "It holds water in the cells and runs the opening and closing of the stomata, the plant's own control over water through a dry stretch.",
      },
      {
        title: "It shows up in quality.",
        body: "Fruit size, sugar content and shelf life are the classic marks of how much potassium the crop had while it filled.",
      },
    ],
    /* A análise garantida do rótulo americano (visto em 24/09/2026). */
    analysis: {
      label: "What's in the jug",
      formula: "1-1-15",
      rows: [
        { k: "Nitrogen (N)", v: "1.2%" },
        { k: "Phosphate (P₂O₅)", v: "1.0%" },
        { k: "Potash (K₂O)", v: "15.0%" },
      ],
      note: "All water-soluble. Guaranteed analysis from the U.S. label.",
    },
  },
  /* Entra sozinha, em máscara, depois que as duas rotas completam. */
  quote: "The potassium is in the ground. Your soil test says so. That is not the same as having it in the plant during the weeks that set the yield.",
  /* AN-01. Só subsolo: uma raiz, o potássio, a água e o gargalo. Sem número —
     os medidores são relativos, não medem nada de uma lavoura real. */
  zone: {
    steps: [
      { title: "A root in balance", body: "Potassium sits in the soil around one root system. Nothing is asking for much yet." },
      { title: "It moves with water", body: "Soil potassium travels dissolved in soil water, carried along the same paths water takes toward the root." },
      { title: "It has to arrive", body: "Only potassium that reaches the root surface can be taken up. The soil and the root do all of the delivering." },
      { title: "Demand climbs", body: "From flowering into fill, the crop asks for more potassium, and faster. The whole route is under pressure." },
      { title: "Delivery falls behind", body: "A drying profile or a compacted layer slows the water down, and potassium arrives slower than the crop needs it." },
      { title: "In the soil is not at the root", body: "Potassium availability is not only about being in the soil. It is about moving, and reaching the root in time." },
    ],
    legend: { k: "Potassium (K⁺)", water: "Soil water" },
    meters: { demand: "Crop demand", delivered: "Reaching the root" },
    labels: { dry: "Drying profile", compact: "Compacted layer" },
    alt: "Animated cross-section of the soil around one root system: potassium drifts toward the root with soil water and is taken up; as demand rises and the profile dries, less of it reaches the root in time.",
  },
  routes: {
    heading: "Two routes, two clocks.",
    body: "Soil potassium moves with water. It has to dissolve, travel to the root surface, cross into the xylem and ride up to the leaf, and every one of those steps slows down when the profile dries. Foliar potassium starts at the leaf and moves into the tissue from where it lands.",
    /* AN-02. A comparação "em horas em vez de dias" ainda depende do técnico
       da Juma: a cena mostra mais etapas e mais freios, sem cravar tempo. */
    soil: {
      label: "From the soil",
      steps: ["Dissolve", "Travel to the root surface", "Cross into the xylem", "Ride up to the leaf"],
    },
    foliar: {
      label: "On the leaf",
      steps: ["Lands on the leaf", "Moves into the tissue"],
    },
    brake: "Slows down when the profile dries",
  },
};

/* --------------------------------------------------------------------- K8 */

/* HOLD P2 — remover junto com Flush.tsx.
   A ação desalojante é claim de eficácia sob a FIFRA enquanto a leitura
   regulatória não voltar. Desde 24/09/2026 ela é o segundo trabalho da
   página, logo depois do potássio. Os pontos vêm do folheto de morango da
   Juma ("dislodges and increases mite movement", "enhances insecticide
   exposure"). Ficaram de fora, por serem claims mais fortes e sem fonte: a
   desorientação do ácaro, o óleo essencial (não consta no "derived from" do
   rótulo americano) e o "+20%" do morango, que não tem testemunha. */
export const flush = {
  label: "Job 2 · An added advantage",
  heading: "The one you didn't reach is the one that comes back.",
  body: "The application was right. The product was right. Part of the population simply never met the spray, because it was under the leaf, in the whorl, deep in the canopy. KMEP Ultra® rides in the same tank, draws those pests out of shelter and keeps them moving, so more of them come into contact with the insecticide you already paid for.",
  stages: [
    { n: "01", title: "Sheltered", body: "Where the spray was never going to reach." },
    { n: "02", title: "Dislodged", body: "It comes out and keeps moving." },
    { n: "03", title: "Exposed", body: "In front of the product you already bought." },
  ],
  caveatLabel: "Same rate, same label",
  /* O "render mais" do cliente, dito do jeito certo: mais do inseticida que já
     está no tanque, nunca menos inseticida. */
  caveat: "More out of the insecticide, never less of it. Same rate, same label, same tank. What changes is how much of the population the insecticide actually reaches.",
  alt: "Diagram of a corn whorl in three steps: the pest sheltered inside, coming out, and exposed on the open leaf",
};

/* --------------------------------------------------------------------- K9 */

export const operation = {
  heading: "What it does for the operation.",
  /* Na ordem da página: o potássio, o tanque, e a ação desalojante (o card
     largo). */
  cards: [
    {
      title: "Potassium in a form the leaf takes up.",
      body: "On the leaf in the window where demand actually peaks, instead of waiting on soil moisture.",
      image: "/img/kmep/operation-potassium.webp",
    },
    {
      title: "Goes in the tank you're already filling.",
      body: "Compatible in tank mix. No separate pass, no extra diesel, no new weather window to wait for.",
      image: "/img/kmep/operation-tank.webp",
    },
    /* HOLD P2 — o card inteiro. Sem ele, o card do tanque ocupa a linha de
       baixo (ver Operation.tsx). */
    {
      title: "More of the population meets the insecticide.",
      body: "The dislodging action brings pests out of shelter, at the rate already on the insecticide label.",
      image: "/img/kmep/cigarrinha-do-milho-parada.webp",
    },
  ] as { title: string; body: string; image: string }[],
  /* O card 4 tem tratamento próprio: a testemunha e o ganho em linhas
     separadas, cada um na sua cor. */
  offer: {
    title: "Nine more bushels, from a pass you were making anyway.",
    check: { value: "212.3", unit: "bu/ac", label: "Untreated check" },
    gain: { value: "+8.9", unit: "bu/ac", label: "Trial response" },
    witness: "221.2 vs 212.3 bu/ac · Corn · Rehagro trial, Brazil",
    cta: { label: "Ask us for the full trial report", href: "#trial-form" },
  },
};

/* -------------------------------------------------------------------- K10 */

export const proof = {
  label: "The trial",
  heading: "Nine bushels, same pass.",
  body: "One trial, published whole, with the check strip beside it. Corn under leafhopper management, Rehagro, Brazil. The product went in with an insecticide application that was already on the schedule, so the nine bushels came out of a pass that was going to happen anyway.",
  pair: {
    check: { label: "Untreated check", value: 212.3 },
    treated: { label: "Treated · KMEP Ultra®", value: 221.2 },
    diff: { label: "Difference", value: "+8.9", note: "+4.2%" },
    unit: "bu/ac",
  },
  /* A escala das barras começa em zero e está rotulada: com ela, a diferença
     aparece do tamanho que tem. */
  scale: { max: 250, step: 50, unit: "bu/ac", label: "Scale starts at zero" },
  table: {
    label: "The trial, in full",
    intro: "One trial, published whole. When we have more, they'll be here too, including the ones that didn't separate.",
    facts: [
      { k: "Crop", v: "Corn", icon: "crop" },
      { k: "Location", v: "Brazil", icon: "pin" },
      { k: "Source", v: "Rehagro", icon: "source" },
      /* TODO(P21): trocar "Being confirmed" pelo ano do ensaio e tirar o `pending`. */
      { k: "Year", v: "Being confirmed", icon: "year", pending: true },
    ],
    original: {
      label: "Original units",
      rows: [
        { k: "Treated", us: "221.2 bu/ac", orig: "231.45 sc/ha" },
        { k: "Untreated check", us: "212.3 bu/ac", orig: "222.12 sc/ha" },
        { k: "Difference", us: "+8.9 bu/ac", orig: "+9.33 sc/ha" },
      ],
    },
  },
  /* O artigo revisado por pares. O incremento exato de produtividade está em
     figura no artigo e depende da P32; a autorização para citá-lo também.
     A parte de eficácia sobre praga fica fora da página (FIFRA, P2). */
  paper: {
    label: "And a second one, peer-reviewed",
    heading: "Randomized blocks, a third-party station, and a journal that published it.",
    chips: ["Cotton", "2021 season", "Rio Verde, Goiás", "Independent station", "Randomized blocks", "Manual harvest"],
    /* Esquema do protocolo: três tratamentos, quinze aplicações. A ordem das
       aplicações alternadas é ilustrativa — o calendário real está no artigo. */
    scheme: {
      label: "Protocol · 15 applications",
      applications: 15,
      treatments: [
        { label: "Insecticide program alone", kmep: "none" },
        { label: "+ KMEP Ultra® in every application", kmep: "all" },
        { label: "+ KMEP Ultra® in alternate applications", kmep: "alternate" },
      ],
      legend: { insecticide: "Insecticide application", kmep: "With KMEP Ultra®" },
      note: "Schematic. The application calendar is in the paper.",
    },
    result: "Both KMEP Ultra® treatments out-yielded the check.",
    citation: {
      label: "Published in",
      journal: "Revista Foco",
      issue: "v.16 n.2 · 2023",
      doi: "10.54751/revistafoco.v16n2-129",
      href: "https://doi.org/10.54751/revistafoco.v16n2-129",
      cta: "Read the paper",
    },
    disclosure: "Disclosure: three of the four authors are Juma-Agro agronomists. The fourth is a researcher at the Instituto Goiano de Agricultura, and the trial was run at an independent experimental station. We are saying so here because it is the kind of thing you would find out anyway, and because a trial you can check is worth more than one you have to believe.",
  },
  footnote: "Results from field trials conducted in Brazil. Field performance varies with climate, soil and management.",
};

/* -------------------------------------------------------------------- K11 */

/* FORA DA PÁGINA desde 24/09/2026: o cliente decidiu não publicar preço.
   Economics.tsx saiu de /kmep e /kmep-b; o conteúdo fica para quando o
   preço voltar. */
export const economics = {
  heading: "What nine bushels is worth on your acres.",
  body: "At $4.30 corn, 8.9 bushels is $38.27 an acre. The product costs six dollars an acre at the label rate for one spray. We publish both numbers together, because the gap between them is the whole decision.",
  witness: "+8.9 bu/ac: 221.2 treated vs 212.3 bu/ac untreated check",
  /* A calculadora. O ganho e o custo são os dois números com fonte (ensaio
     Rehagro e dose do rótulo); preço do milho e área são do leitor.
     TODO(P4): se a dose do rótulo americano mudar o custo, é aqui. */
  calc: {
    gain: 8.9,
    cost: 6,
    price: { label: "Corn price", unit: "/bu", hint: "Drag to set your price", min: 3.5, max: 5.5, step: 0.05, initial: 4.3, presets: [4, 4.3, 4.6] },
    acres: { label: "Your acres", unit: "ac", presets: [160, 500, 1000, 2500], initial: 500 },
    steps: { value: "Value of +8.9 bu/ac", cost: "Product cost", net: "Net per acre" },
    perAcre: "/ac",
    ratio: { label: "Grain value per $1 of product", suffix: "to $1" },
    breakEven: { label: "Pays for itself with corn above", unit: "/bu" },
    farm: { label: "Net on your acres", note: "One spray, at the label rate" },
    /* Topo fixo do gráfico: cobre o preço máximo do controle (5.5 × 8.9). */
    scaleMax: 50,
    scaleStep: 10,
  },
  footnote: "Yield response from the Rehagro trial in Brazil. Corn prices shown for reference. Your result will vary with climate, soil and management.",
};

/* -------------------------------------------------------------------- K13 */

export const timing = {
  heading: "When it goes in.",
  body: "In a spray pass you already have on the schedule, at the label rate of 16 fl oz per acre. Orchards, vegetables, ornamentals and row crops each have their own window. Pick your crop.",
  cropLabel: "Crop",
  rateLabel: "Rate",
  season: "Season",
  /* As pontas do arco da safra e a deixa antes do primeiro estágio. */
  ends: ["Planting", "Harvest"],
  hint: "Scroll through the season",
  pass: "Pass",
  /* A régua é ordinal: marca os estágios do rótulo, sem pretender ser escala
     de dias. `at` é a posição na régua, de 0 a 1. As culturas e as janelas
     vêm da ficha técnica da Juma (docs/assets/kmep-ultra-ficha-br.pdf), em
     nomenclatura americana. Café ficou de fora: não é cultura dos EUA. `ends`
     troca as pontas do arco quando a safra não começa no plantio.
     `rate` é a dose do rótulo americano, a mesma em todas as culturas
     (decisão do cliente, 24/09/2026): "16 Oz per acre in every insecticide
     application". Ornamentais não estão na ficha BR: a janela segue a regra
     do rótulo, uma dose por aplicação. A ordem põe frutas, hortaliças,
     tomate, ornamentais e legumes antes das grandes culturas. */
  crops: [
    {
      id: "citrus",
      label: "Citrus",
      rate: "16 fl oz/ac",
      ends: ["Bloom", "Harvest"],
      marks: [
        { code: "Fruit set", at: 0.25 },
        { code: "", display: "+14 days", at: 0.42, minor: true },
        { code: "", display: "+14 days", at: 0.59, minor: true },
      ],
      spans: [
        { from: 0, to: 2, note: "Every two weeks while the fruit develops" },
      ],
      summary: "Citrus: every two weeks through fruit development.",
    },
    {
      id: "fruit",
      label: "Tree fruit",
      rate: "16 fl oz/ac",
      ends: ["Bloom", "Harvest"],
      marks: [
        { code: "After bloom", at: 0.22 },
        { code: "", display: "Next pass", at: 0.42, minor: true },
        { code: "", display: "Next pass", at: 0.62, minor: true },
      ],
      spans: [
        { from: 0, to: 2, note: "Three to four passes a season" },
      ],
      summary: "Tree fruit: three to four passes a season, starting after bloom.",
    },
    {
      id: "veg",
      label: "Vegetables",
      rate: "16 fl oz/ac",
      ends: ["Seeding", "Harvest"],
      marks: [
        { code: "Day 30", at: 0.3 },
        { code: "", display: "+14 days", at: 0.46, minor: true },
        { code: "", display: "+14 days", at: 0.62, minor: true },
      ],
      spans: [
        { from: 0, to: 2, note: "Every two weeks, from day 30" },
      ],
      summary: "Other vegetables: every two weeks, starting 30 days after germination or transplant.",
    },
    {
      id: "tomato",
      label: "Tomatoes & peppers",
      rate: "16 fl oz/ac",
      ends: ["Transplant", "Harvest"],
      marks: [
        { code: "Day 40", at: 0.3 },
        { code: "", display: "+7 days", at: 0.42, minor: true },
        { code: "", display: "+7 days", at: 0.54, minor: true },
        { code: "", display: "+7 days", at: 0.66, minor: true },
      ],
      spans: [
        { from: 0, to: 3, note: "Weekly, from day 40 after transplant" },
      ],
      summary: "Tomatoes and peppers: weekly, starting 40 days after transplant.",
    },
    {
      id: "ornamental",
      label: "Ornamentals",
      rate: "16 fl oz/ac",
      ends: ["Planting", "Market"],
      marks: [
        { code: "First spray", at: 0.24 },
        { code: "", display: "Next spray", at: 0.44, minor: true },
        { code: "", display: "Next spray", at: 0.64, minor: true },
      ],
      spans: [
        { from: 0, to: 2, note: "In every spray pass" },
      ],
      summary: "Ornamentals: in every spray pass through the crop, at the label rate.",
    },
    {
      id: "potato",
      label: "Potatoes",
      rate: "16 fl oz/ac",
      marks: [
        { code: "Day 50", at: 0.38 },
        { code: "", display: "+7 days", at: 0.51, minor: true },
        { code: "", display: "+7 days", at: 0.64, minor: true },
      ],
      spans: [
        { from: 0, to: 2, note: "Weekly, from day 50" },
      ],
      summary: "Potatoes: weekly, starting 50 days after emergence.",
    },
    {
      id: "onion",
      label: "Onions & garlic",
      rate: "16 fl oz/ac",
      ends: ["Transplant", "Harvest"],
      marks: [
        { code: "Day 50", at: 0.4 },
        { code: "", display: "+7 days", at: 0.53, minor: true },
        { code: "", display: "+7 days", at: 0.66, minor: true },
      ],
      spans: [
        { from: 0, to: 2, note: "Weekly, from day 50 after transplant" },
      ],
      summary: "Onions and garlic: weekly, starting 50 days after transplant.",
    },
    {
      id: "roots",
      label: "Carrots & beets",
      rate: "16 fl oz/ac",
      marks: [
        { code: "Day 40", at: 0.34 },
        { code: "", display: "+7 days", at: 0.47, minor: true },
        { code: "", display: "+7 days", at: 0.6, minor: true },
      ],
      spans: [
        { from: 0, to: 2, note: "Weekly, from day 40" },
      ],
      summary: "Carrots and beets: weekly, starting 40 days after emergence.",
    },
    {
      id: "corn",
      label: "Corn",
      rate: "16 fl oz/ac",
      marks: [
        { code: "V4", at: 0.18 },
        { code: "V6", at: 0.32 },
        { code: "Ear formation", at: 0.62 },
      ],
      spans: [
        { from: 0, to: 1, note: "Ride with passes you already scheduled" },
        { from: 2, to: 2, note: "The potassium arriving where the demand is" },
      ],
      summary: "V4, V6, and again at ear formation. The corn timing has two halves and both matter. The first two ride with passes you already scheduled, and the one at ear formation is the potassium arriving where the demand is.",
    },
    {
      id: "soy",
      label: "Soybeans",
      rate: "16 fl oz/ac",
      marks: [
        { code: "V6/V7", at: 0.3 },
        { code: "", display: "+10–15 days", at: 0.47, minor: true },
        { code: "", display: "+10–15 days", at: 0.64, minor: true },
      ],
      spans: [
        { from: 0, to: 2, note: "Repeating every 10 to 15 days" },
      ],
      summary: "Soybeans: V6/V7, repeating every 10 to 15 days.",
    },
    {
      id: "cotton",
      label: "Cotton",
      rate: "16 fl oz/ac",
      marks: [
        { code: "Day 40", at: 0.3 },
        { code: "", display: "+7 days", at: 0.42, minor: true },
        { code: "", display: "+7 days", at: 0.54, minor: true },
        { code: "", display: "+7 days", at: 0.66, minor: true },
      ],
      spans: [
        { from: 0, to: 3, note: "Four to six passes, a week apart" },
      ],
      summary: "Cotton: starting 40 days after emergence, four to six passes a week apart.",
    },
    {
      id: "beans",
      label: "Dry beans",
      rate: "16 fl oz/ac",
      marks: [
        { code: "Bloom", at: 0.42 },
        { code: "", display: "+10–15 days", at: 0.57, minor: true },
        { code: "", display: "+10–15 days", at: 0.72, minor: true },
      ],
      spans: [
        { from: 0, to: 2, note: "After bloom, every 10 to 15 days" },
      ],
      summary: "Dry beans: after bloom, repeating every 10 to 15 days.",
    },
  ],
  details: [
    {
      k: "Rate and pack",
      /* TODO(P35): outras embalagens americanas, se houver. */
      v: "16 fl oz per acre in every pass, the rate on the U.S. label. One 2.5 gal jug covers 20 acres.",
    },
    {
      k: "Tank mix",
      v: "Mixing order and known incompatibilities are on the label. Jar-test any combination you have not run before.",
    },
  ],
  jugAlt: "KMEP Ultra® 2.5 gal jug with the U.S. label",
  logoAlt: "KMEP Ultra® logo",
};

/* -------------------------------------------------------------------- K14 */

export const fit = {
  heading: "Who this is for.",
  fits: {
    label: "It fits",
    lead: "An operation that",
    items: [
      "Already has spray passes on the schedule, in orchards, vegetables, ornamentals or row crops",
      "Wants potassium on the leaf in the weeks the crop is filling",
      "Runs its own check strips",
    ],
  },
  notFit: {
    label: "It does not fit",
    lead: "A grower looking to",
    items: [
      "Replace a soil potash program",
      "Cut an insecticide rate",
      "Buy a product that works without an application going out anyway",
    ],
  },
  /* A conta que o agrônomo faz (ver a pergunta "How much potassium is in one
     pass?"): onças de K₂O por acre, não libras. A nutrição lidera a página, e
     por isso a página diz primeiro o que ela não é. */
  close: ["It is not a potash program, and it does not replace one.", "It is potassium on the leaf in the weeks that count, on a pass that was going out anyway."],
};

/* -------------------------------------------------------------------- K15 */

export const strip = {
  label: "How the trial strip works",
  heading: "Your field, your check strip, your monitor.",
  steps: [
    { n: "01", title: "Pick a field with an insecticide pass already scheduled.", body: "We send the product for it." },
    {
      n: "02",
      title: "Leave a strip untreated, in the same field, under the same management.",
      body: "That strip is the whole experiment.",
    },
    {
      n: "03",
      title: "Harvest both and read your own monitor.",
      body: "We come back to look at the numbers with you, whichever way they fall.",
    },
  ],
  promise: ["No cost for the product on the strip.", "No obligation after harvest."],
  cta: { label: "Run a trial strip on your acres", href: "#trial-form" },
  alt: "Close aerial view of soybean rows with a lighter check strip running through them",
};

/* -------------------------------------------------------------------- K16 */

export const questions = {
  heading: "The questions we get first.",
  items: [
    {
      q: "Your trials are from Brazil. Why should that matter to me?",
      /* Fonte da média: USDA NASS, Crop Production, 14/11/2025 — EUA 186.0
         bu/ac, Illinois 217. A versão anterior dizia "close to the U.S.
         national average", o que não é verdade (212.3 está 14% acima). */
      a: "Because the check was not a weak field. The untreated corn in our trial ran 212.3 bu/ac, well above the 2025 U.S. average of about 186 bu/ac and close to Illinois at 217. A response on top of a check that strong is harder to get, not easier.",
    },
    {
      q: "Is there anything published, or just your own trials?",
      a: "There is one peer-reviewed paper. Cotton, 2021 season, randomized block design, run at an independent experimental station in Rio Verde, Goiás, and published in Revista Foco in 2023 (DOI 10.54751/revistafoco.v16n2-129). Three of its four authors are Juma-Agro agronomists and the fourth is a researcher at the Instituto Goiano de Agricultura. We put that in writing on this page rather than let you find it yourself. It is one paper, not a body of literature, and we would rather say that plainly.",
    },
    {
      /* A conta, pelo rótulo americano: 16 fl oz = 0,125 gal × 10 lb/gal
         (25 lb em 2,5 gal) = 1,25 lb de produto × 15% de K₂O = 0,19 lb, cerca
         de 3 oz de K₂O por acre. Com a nutrição na frente, é a primeira conta
         do agrônomo, e a página responde antes que ele pergunte. */
      q: "How much potassium is in one pass?",
      a: "Ounces, not pounds. At the label rate of 16 fl oz per acre, one pass puts about 3 oz of K₂O on each acre, on the leaf, in the weeks it counts. Your soil program carries the season. This is the potassium that doesn't have to wait on the root.",
    },
    {
      q: "How is this different from a standard 0-0-25 or KTS?",
      a: "A 0-0-25 is a potassium source and nothing else. KMEP Ultra® is a 1-1-15 built to go in the spray tank, so the potassium reaches the leaf on a pass you are already making.",
      /* HOLD P2 — remover junto com Flush.tsx */
      hold: "In the same tank, it also draws pests out of shelter, into contact with the insecticide you already paid for.",
    },
    {
      q: "Can I cut my insecticide rate if I use it?",
      a: "No. It does not change the rate on that label, and it is not a reason to lower it. Run your normal rate.",
      /* HOLD P2 — remover junto com Flush.tsx */
      hold: "What it changes is how much of the population that rate reaches.",
    },
    {
      q: "Can I tank mix it with my insecticide or fungicide?",
      a: "Yes. That's how it's meant to be used. Mixing order and known incompatibilities are on the label. Jar-test any combination you haven't run before.",
    },
    /* Pendentes — fora da tela até a resposta chegar. Voltam descomentadas.
    {
      // Aguarda resposta técnica da Juma (espuma, filtro, temperatura, umidade).
      q: "Will it foam the tank or plug my screens?",
      a: "",
    },
    {
      // TODO(P10): listar os estados ou convidar o visitante a perguntar.
      q: "Is it registered in my state?",
      a: "",
    },
    {
      // TODO(P20): confirmar que não existe ensaio nos EUA antes de publicar.
      q: "Do you have U.S. trial data?",
      a: "Not yet, and we'd rather say so than dodge it. That's exactly what the trial strip is for: your field, your check strip, your yield monitor. We supply the product.",
    },
    */
  ] as Question[],
};

/* -------------------------------------------------------------------- K17 */

export const final = {
  heading: "Run a trial strip. We supply the product.",
  body: "Pick a field, leave an untreated check strip beside it, and we will come back at harvest with you. Tell us your crop and your state and we will send the label, rates in fl oz per acre, and the full trial report first.",
  /* Ressalva obrigatória, dentro da seção. */
  disclaimer: "KMEP Ultra® is applied in tank mix with an insecticide and never in place of one. It does not change the rate on the insecticide label. Always read and follow the label directions of the pesticide you are applying.",
  /* As culturas do formulário reduzido: as duas posicionadas, a que está em
     revisão e uma saída. A ordem casa com os ícones do TrialForm. */
  crops: ["Citrus & fruit", "Vegetables", "Ornamentals", "Row crops", "Other"],
  cropIcons: ["citrus", "vegetables", "ornamentals", "corn"],
  alt: "Corn harvest at sunset, grain unloading into a cart beside the combine",
};

/* ======================================================================
   As cenas de partículas e a virada para o preto — versões A e B
   ======================================================================

   O mesmo mecanismo da LP do Aminosan: a foto do hero se desfaz em
   partículas, a nuvem passa por quatro leituras (desenhos em
   `lib/scan/kmep.ts`) e fecha num disco preto que abre a seção seguinte.

   Desde 24/09/2026 as duas cenas contam a nutrição. A (rota /kmep) entra
   pela necessidade — onde a demanda de potássio chega ao pico, onde o solo
   trava — e fecha no produto. B (rota /kmep-b) entra pelo produto, com a
   headline da versão 2 do teste A/B, e a necessidade vem depois.

   Nenhuma leitura fala de inseto nem de desempenho do inseticida: a ação
   desalojante mora no K8, removível pela P2. As cores da legenda são as do
   desenho: 1 lima (o potássio que chega), 2 cobre (o que não chega a tempo). */

export type SceneStage = {
  kicker: string;
  heading: string;
  body: string;
  legend: { tone: 1 | 2; label: string }[];
  /** Na ordem das âncoras do desenho em `lib/scan/kmep.ts`. */
  callouts: { label: string; note: string }[];
  readout: { k: string; v: string }[];
};

export type Scene = { steps: string[]; stages: SceneStage[] };

export type BlackoutChapter = {
  kicker: string;
  heading: string;
  body: string;
  image: string;
  alt: string;
  /** Só no capítulo da colheita: o ensaio, com a testemunha ao lado. */
  proof?: boolean;
};

export type Blackout = {
  headline: string[];
  body: string;
  chapters: BlackoutChapter[];
};

/* As quatro leituras, uma por desenho. Cada cena usa as quatro, em ordem
   diferente; o texto de cada uma muda com o lugar que ela ocupa. */

const readEar: SceneStage = {
  kicker: "Where demand peaks",
  heading: "Yield is set in the last weeks of the season.",
  body: "Potassium demand peaks late, from flowering through the fill of the grain, the tuber or the fruit. That is when the crop moves the most sugar, and potassium is what carries it.",
  legend: [{ tone: 1, label: "Filling" }],
  callouts: [
    { label: "Kernels", note: "Where the demand peaks" },
    { label: "Husk", note: "The fill: grain, tuber or fruit" },
    { label: "Silks", note: "Flowering" },
  ],
  readout: [
    { k: "Demand", v: "Peaks late" },
    { k: "Window", v: "Flowering to fill" },
    { k: "Visible sign", v: "None yet" },
  ],
};

const readRoots: SceneStage = {
  kicker: "Where the soil stalls",
  heading: "In the ground is not in the plant.",
  body: "The potassium is in the ground. Your soil test says so. But it moves with water, and a dry stretch or a compacted layer slows it down right when the crop asks for the most.",
  legend: [{ tone: 2, label: "Potassium that doesn't reach the root in time" }],
  callouts: [
    { label: "Root", note: "Takes up only what reaches it" },
    { label: "Potassium", note: "Stuck in a drying profile" },
    { label: "Compacted layer", note: "Slows the water down" },
  ],
  readout: [
    { k: "Soil test", v: "Adequate" },
    { k: "Profile", v: "Drying" },
    { k: "Reaching the root", v: "Behind" },
  ],
};

const readLeaf: SceneStage = {
  kicker: "Through the leaf",
  heading: "Foliar potassium starts at the leaf.",
  body: "It doesn't wait on soil moisture or the root. KMEP Ultra® puts potassium on the leaf, and it moves into the tissue from where it lands, in the weeks the crop is filling.",
  legend: [{ tone: 1, label: "Potassium" }],
  callouts: [
    { label: "Droplet", note: "Where the potassium lands" },
    { label: "Into the tissue", note: "Moves in from the leaf" },
    { label: "Vein", note: "The route through the leaf" },
  ],
  readout: [
    { k: "Starts at", v: "The leaf" },
    { k: "Waits on soil", v: "No" },
    { k: "Analysis", v: "1-1-15" },
  ],
};

const readPass: SceneStage = {
  kicker: "In your pass",
  heading: "In the spray pass you already run.",
  body: "KMEP Ultra® rides in the tank you are already filling, at 16 fl oz per acre. No extra trip, no new weather window. The potassium goes out with the insecticide you already chose.",
  legend: [],
  callouts: [
    { label: "Nozzle", note: "Same nozzle, same schedule" },
    { label: "Spray", note: "Potassium in the same tank" },
    { label: "Canopy", note: "Where it lands" },
  ],
  readout: [
    { k: "Rate", v: "16 fl oz/ac" },
    { k: "Extra trips", v: "0" },
    { k: "Tank", v: "Same" },
  ],
};

/** Versão A — entra pela necessidade: a espiga, a raiz, a folha, a passada. */
export const sceneA: Scene = {
  steps: ["Demand peaks", "Soil stalls", "Through the leaf", "In your pass"],
  stages: [readEar, readRoots, readLeaf, readPass],
};

/** Versão A — o preto: o que a falta de potássio custa, e onde aparece. */
export const blackoutA: Blackout = {
  headline: ["Small shortfalls you never see", "add up to a number you do."],
  body: "Potassium that arrives late leaves no symptom you can photograph. It shows up in three places.",
  chapters: [
    {
      kicker: "In the soil",
      heading: "The soil test said it was there.",
      body: "It was. It just couldn't reach the root fast enough while the demand peaked and the profile dried.",
      image: "/img/kmep/blackout/dryroots.webp",
      alt: "Brace roots of a corn plant gripping dry, cracked soil in late summer",
    },
    {
      kicker: "In the fill",
      heading: "It shows up in size, quality and shelf life.",
      body: "Potassium is what carries sugar into the grain, the tuber and the fruit. When it runs short in the fill, the harvest carries the difference.",
      image: "/img/kmep/potassium-pods.webp",
      alt: "Soybean pods filling on the plant in late summer",
    },
    {
      kicker: "At harvest",
      heading: "Nine bushels, same pass.",
      body: "One trial, published whole, with the check strip beside it: 221.2 against 212.3 bu/ac in corn. The product went in with a spray that was already on the schedule.",
      image: "/img/kmep/blackout/monitor.webp",
      alt: "A yield map glowing on the in-cab monitor of a combine at dusk during corn harvest",
      proof: true,
    },
  ],
};

/** Versão B — a headline da versão 2 do teste A/B no hero (K1). */
export const heroB = {
  heading: "One pass. Two jobs.",
  /* O título curto do pé é a headline da versão A, que aqui desce para lá. */
  aside: { heading: ["Potassium when", "the crop needs it most."] },
  body: "KMEP Ultra® goes in the tank you already fill. It puts potassium on the leaf for the weeks that set yield and quality.",
  /** HOLD P2 — sai sem tocar no resto do hero. */
  hold: "And in the same tank, it helps the insecticide reach the pests hiding from it." as string | undefined,
};

/** Versão B — entra pelo produto: a passada, a folha, a raiz, a espiga. */
export const sceneB: Scene = {
  steps: ["One pass", "Job 1", "Why the leaf", "Filling"],
  stages: [
    {
      ...readPass,
      kicker: "One pass",
      heading: "One pass. Two jobs.",
      body: "KMEP Ultra® goes in the tank with the insecticide you already chose, on the pass you already scheduled. No separate trip across the field.",
    },
    {
      ...readLeaf,
      kicker: "Job 1 · Foliar potassium",
      heading: "Potassium, in through the leaf.",
      body: "KMEP Ultra® is a 1-1-15 liquid potassium. It lands on the leaf and moves into the tissue from there, without waiting on soil moisture or the root.",
    },
    {
      ...readRoots,
      kicker: "Why the leaf",
    },
    {
      ...readEar,
      kicker: "Filling",
      heading: "Potassium in the weeks that set the yield.",
      body: "Potassium demand peaks late, while the grain, the tuber or the fruit is filling. The late passes on the label put it on the leaf in that window.",
      readout: [
        { k: "Passes", v: "By crop" },
        { k: "Demand", v: "Peaks late" },
        { k: "Extra trips", v: "0" },
      ],
    },
  ],
};

/** Versão B — o preto: a falta, que aqui vem depois do produto. */
export const blackoutB: Blackout = {
  headline: ["You won't see the shortfall", "until you harvest."],
  body: "Part of the potassium the crop needs never arrives in time.",
  chapters: [
    {
      kicker: "In the soil",
      heading: "In the ground is not in the plant.",
      body: "The potassium is in the ground. Your soil test says so. That is not the same as having it in the plant during the weeks that set the yield.",
      image: "/img/kmep/blackout/dryroots.webp",
      alt: "Brace roots of a corn plant gripping dry, cracked soil in late summer",
    },
    {
      kicker: "In the fill",
      heading: "It shows up in size, quality and shelf life.",
      body: "Potassium is what carries sugar into the grain, the tuber and the fruit. When it runs short in the fill, the harvest carries the difference.",
      image: "/img/kmep/potassium-pods.webp",
      alt: "Soybean pods filling on the plant in late summer",
    },
    {
      kicker: "At harvest",
      heading: "Nine bushels, same pass.",
      body: "One trial, published whole, with the check strip beside it. The product went in with a spray that was already on the schedule.",
      image: "/img/kmep/blackout/monitor.webp",
      alt: "A yield map glowing on the in-cab monitor of a combine at dusk during corn harvest",
      proof: true,
    },
  ],
};
