/**
 * Copy da LP do KMEP Ultra® (/kmep), em inglês americano.
 *
 * **Canônico: `docs/05-COPY-KMEP-ULTRA.md`.** Os parágrafos daqui são
 * transcritos de lá; quando um bloco de copy virou duas peças de layout (um
 * título e um corpo, uma lista), o corte foi feito na frase, sem reescrever.
 * O plano de execução da página está em `docs/06-PROMPT-LP-KMEP.md`.
 *
 * Regras que valem para cada linha deste arquivo:
 * - FIFRA: o produto entrega cobertura, deposição e potássio na folha. Nada
 *   aqui atribui controle de praga nem performance de defensivo, fora do
 *   bloco `flush` (K8), que está em HOLD pela P2 e sai inteiro.
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
  eyebrow: ["Spray performance", "Foliar potassium"],
  /* Encurtada em 24/09/2026. Ecoa as duas peças da Juma: "Potencialize sua
     aplicação" (ficha BR) e "Optimize every application" (folheto US). A
     anterior, "You won't see the loss until you harvest.", segue na cena. */
  heading: "Make every pass count.",
  /* O título curto do pé (K1, aside) é a headline da versão 2 do teste
     A/B — que entra pelo produto —, partida na frase. Não é copy nova. */
  aside: { heading: ["One pass.", "Two jobs."] },
  body: "KMEP Ultra® rides in the tank you already fill. More of the spray stays on the leaf, and potassium lands in the weeks that set the yield.",
  /* Sub da versão 2, para o teste A/B — anotada, sem rota própria:
     "KMEP Ultra® goes in with the insecticide you already chose. It improves coverage and deposition on the day you spray, and it puts potassium on the leaf for the window where demand peaks." */
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

/* --------------------------------------------------------------------- K3 */

export const problem = {
  heading: "You made the pass right. Part of it still missed.",
  body: [
    "You ran the product you chose, at label rate, in a window that was actually good. The pass looked clean from the cab. What you cannot see from there is how much of that spray stopped on the top of the canopy, how much bounced, and how much dried before it reached the leaf surface that mattered.",
    "Hidden losses in application performance cost yield, quality and profit without leaving a single visible sign in the field. By the time the monitor tells you, the pass is four months behind you and there is nothing left to fix.",
  ],
  /* A legenda que troca com o scrub. Legenda, não número: nenhum dado de
     cobertura foi medido e publicado. */
  captions: ["Top of the canopy", "The leaf that mattered"],
  /* As três perdas do primeiro parágrafo, em linha própria. */
  ledger: {
    label: "What the cab doesn't show",
    items: ["Stopped on the top of the canopy", "Bounced", "Dried before it reached the leaf"],
  },
  alt: "Close-up of a young corn whorl at first light, droplets beaded on the leaf surface",
};

/* --------------------------------------------------------------------- K4 */

export const cost = {
  heading: "Small losses you never see add up to a number you do.",
  intro: "Two things happen when a pass underperforms.",
  blocks: [
    {
      kicker: "The obvious one",
      title: "The re-spray",
      body: "Another trip, more diesel, another weather window you did not plan for.",
    },
    {
      kicker: "The quieter one",
      title: "The potassium the crop needed in the same stretch of the season",
      body: "And did not get, because the demand peaked while the soil was dry and the root could not move it fast enough.",
    },
  ],
  close: [
    "Neither of those shows up as a symptom you can photograph.",
    "Both show up in the yield monitor.",
  ],
};

/* --------------------------------------------------------------------- K5 */

export const twoJobs = {
  eyebrow: "Same tank · Same pass",
  heading: "One pass. Two jobs.",
  lead: "KMEP Ultra® goes in the tank with the insecticide you already chose, on the pass you already scheduled. No separate trip across the field. From there it does two things: it changes how the spray behaves on the way to the leaf, and it delivers potassium the tissue can take up while it is there.",
  close: "The first job happens in the twenty minutes the sprayer is in that field. The second one runs for the rest of the season.",
  /* Rótulos da cena: o rastro que entra, e as duas pontas da bifurcação. */
  scene: {
    pass: "One pass",
    /* `body` de cada trabalho é a frase do lead canônico que o descreve. */
    jobA: {
      tag: "Job 1",
      title: "Coverage and deposition",
      body: "Changes how the spray behaves on the way to the leaf.",
      clock: "20 min",
      time: "Twenty minutes in that field",
    },
    jobB: {
      tag: "Job 2",
      title: "Foliar potassium",
      body: "Delivers potassium the tissue can take up while it is there.",
      time: "The rest of the season",
      start: "Spray day",
      marks: ["Flowering", "Filling", "Harvest"],
    },
  },
};

/* --------------------------------------------------------------------- K6 */

export const deposition = {
  label: "Job 1 · The day you spray",
  heading: "What the droplet does before it dries.",
  /* As três etapas da cena. O texto de cada uma é o parágrafo do canônico
     cortado na frase: abertura, a hora do dia, o fecho. */
  stages: [
    {
      n: "01",
      kicker: "Leaves the nozzle",
      body: "A spray droplet has a short career. It leaves the nozzle, travels through moving air, lands on a surface that may be waxy and vertical, and either stays there long enough to work or does not. KMEP Ultra® works on that stretch: it improves how the spray covers the leaf surface and how well it deposits, so more of what you bought reaches the target you aimed it at.",
    },
    {
      n: "02",
      kicker: "Travels through moving air",
      title: "A pass at 7 a.m. and a pass at 2 p.m. are not the same pass.",
      body: "It also holds that behavior steadier across the conditions a real day gives you, which is where applications usually separate from one another.",
    },
    {
      n: "03",
      kicker: "Lands on a waxy, vertical surface",
      title: "Nothing changes about your nozzle or your rate.",
      body: "What changes is how many of those droplets stay where you put them.",
    },
  ],
  hours: ["7 a.m.", "2 p.m."],
  scene: { air: "Moving air", surface: "Waxy leaf surface" },
  alt: "Diagram of a spray droplet's path: out of the nozzle, across moving air, onto a waxy, steep leaf surface",
};

/* --------------------------------------------------------------------- K7 */

export const potassium = {
  label: "Job 2 · The rest of the season",
  heading: "Yield is set on potassium the root may not deliver in time.",
  body: "Potassium demand peaks late, from flowering through the fill of the grain, the tuber or the fruit, which is exactly when a dry stretch, a compaction layer or a shallow root system limits how much the soil can actually move.",
  /* Entra sozinha, em máscara, depois que as duas rotas completam. */
  quote: "The potassium is in the ground. Your soil test says so. That is not the same as having it in the plant during the weeks that set the yield.",
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
   regulatória não voltar. Se a P2 vier restritiva, este export pode ficar
   (nada o importa sem Flush.tsx) ou sair junto. */
export const flush = {
  label: "An added advantage",
  heading: "The one you didn't reach is the one that comes back.",
  body: "The application was right. The product was right. Part of the population simply never met the spray, because it was in the whorl, under the leaf, in the sheath. KMEP Ultra® rides in the same droplet and moves the target out of that shelter, into contact with the insecticide you already paid for.",
  stages: [
    { n: "01", title: "Sheltered", body: "Where the droplet was never going to reach." },
    { n: "02", title: "Dislodged", body: "It comes out on its own." },
    { n: "03", title: "Exposed", body: "In front of the product you already bought." },
  ],
  caveatLabel: "Same rate, same label",
  caveat: "This is not a reason to cut your insecticide rate. Same rate, same label, same tank. What changes is how much of the population the insecticide actually reaches.",
  alt: "Diagram of a corn whorl in three steps: the target sheltered inside, coming out, and exposed on the open leaf",
};

/* --------------------------------------------------------------------- K9 */

export const operation = {
  heading: "What it does for the operation.",
  cards: [
    {
      title: "Goes in the tank you're already filling.",
      body: "Compatible in tank mix. No separate pass, no extra diesel, no new weather window to wait for.",
    },
    {
      title: "More of the spray does its job.",
      body: "Better coverage and deposition on the leaf surface you aimed at, at the same rate on the same label.",
    },
    {
      title: "Potassium in a form the leaf takes up.",
      body: "Positioned for the window where demand actually peaks, instead of waiting on soil moisture.",
      /* HOLD P2 — remover junto com Flush.tsx */
      hold: "And the added flushing advantage brings more of the population into contact with the spray.",
    },
  ] as { title: string; body: string; hold?: string }[],
  /* O card 4 tem tratamento próprio: custo e ganho em linhas separadas,
     cada um na sua cor, com a testemunha embaixo. */
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

/* -------------------------------------------------------------------- K12 */

export const credential = {
  heading: "Application technology is a research program here, not a tagline.",
  /* O parágrafo é montado em três partes: before + institutions + after.
     TODO(P19): nomear UENP e NITEC/UNESP depende de autorização. Se o
     jurídico negar, a edição é uma só — trocar `institutions` por
     "with two Brazilian university partners". */
  before: "Since 2021, Juma Agro has run the DESATA project ",
  institutions: "with UENP and with NITEC, the application technology and machinery lab at UNESP",
  after: ": wind tunnel work on droplet spectrum, drift and deposition. That is the discipline behind this product, and it is why we can talk about what a droplet does before it dries instead of what we would like it to do.",
  topics: ["Wind tunnel", "Droplet spectrum", "Drift", "Deposition"],
  scene: { nozzle: "Nozzle", air: "Airflow", collectors: "Deposition collectors" },
  sceneAlt: "Line drawing of a wind tunnel: a nozzle over a row of collectors, with airflow carrying the finest droplets downwind",
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
};

/* -------------------------------------------------------------------- K14 */

export const fit = {
  heading: "Who this is for.",
  fits: {
    label: "It fits",
    lead: "An operation that",
    items: [
      "Already has spray passes on the schedule, in orchards, vegetables, ornamentals or row crops",
      "Runs its own check strips",
      "Wants more out of a pass that is already budgeted",
    ],
  },
  notFit: {
    label: "It does not fit",
    lead: "A grower looking to",
    items: [
      "Replace potash",
      "Cut an insecticide rate",
      "Buy a product that works without an application going out anyway",
    ],
  },
  close: ["If all you need is potassium, buy potassium.", "KMEP Ultra® is bought for what the pass does, and the potassium rides along."],
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
  alt: "Aerial view of a row-crop field with a flagged check strip running through it",
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
      /* A resposta da versão anterior dizia que o produto "muda onde o alvo
         está quando a calda chega" — é a ação desalojante. A base abaixo fala
         só da aplicação; a frase da P2 vive em `hold`. */
      q: "How is this different from a standard 0-0-25 or KTS?",
      a: "A 0-0-25 is a potassium source and nothing else. This goes in the insecticide tank to change how the spray covers and lands, and it carries foliar potassium while it's there. If all you need is potassium, buy potassium.",
      /* HOLD P2 — remover junto com Flush.tsx */
      hold: "It also moves the target out of shelter, into contact with the insecticide you already paid for.",
    },
    {
      q: "Can I cut my insecticide rate if I use it?",
      a: "No. It does not stretch the insecticide and it does not change the rate on that label. Run your normal rate.",
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

   A (rota /kmep) entra pela dor — a perda que não se vê — e só na última
   leitura mostra o produto. B (rota /kmep-b) entra pelo produto, com a
   headline da versão 2 do teste A/B, e a perda vem depois, no preto.

   A copy é o canônico (docs/05-COPY-KMEP-ULTRA.md) cortado na frase. O que a
   cena afirma é o comportamento físico da gota — linguagem de adjuvante,
   impressa no folheto americano da Juma. Nenhuma leitura fala de inseto nem
   de desempenho do inseticida. As cores da legenda são as do desenho: 1 lima
   (fica e trabalha), 2 cobre (perdido). */

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

/** Versão A — a perda que não se vê. */
export const sceneA: Scene = {
  steps: ["From the cab", "Stopped on top", "Bounced, dried", "With KMEP Ultra®"],
  stages: [
    {
      kicker: "From the cab",
      heading: "The pass looked clean from the cab.",
      body: "You ran the product you chose, at label rate, in a window that was actually good. What you cannot see from there is where the spray actually ended up.",
      legend: [],
      callouts: [
        { label: "Nozzle", note: "Label rate, as planned" },
        { label: "Spray fan", note: "Leaves the nozzle looking even" },
        { label: "Canopy", note: "Where the pass is aimed" },
      ],
      readout: [
        { k: "Rate", v: "Label" },
        { k: "Window", v: "Good" },
        { k: "Visible loss", v: "None" },
      ],
    },
    {
      kicker: "Stopped on top",
      heading: "Part of it stopped on the top of the canopy.",
      body: "The upper leaves catch the spray first. The leaf surface that mattered sits below them, and from the cab it looks exactly the same.",
      legend: [{ tone: 2, label: "Spray that didn't do the job" }],
      callouts: [
        { label: "Top leaves", note: "Where the spray stopped" },
        { label: "Lower canopy", note: "The leaf surface that mattered" },
        { label: "Whorl", note: "Tight, upright, hard to reach" },
      ],
      readout: [
        { k: "Top of canopy", v: "Wet" },
        { k: "Lower canopy", v: "Dry" },
        { k: "Seen from the cab", v: "No" },
      ],
    },
    {
      kicker: "Bounced. Dried.",
      heading: "Part of it bounced. Part of it dried.",
      body: "A droplet lands on a surface that may be waxy and vertical, and either stays there long enough to work or does not. Hidden losses like these leave no visible sign in the field.",
      legend: [{ tone: 2, label: "Lost from the leaf" }],
      callouts: [
        { label: "Bounced", note: "Hit the wax and left the leaf" },
        { label: "Dried", note: "Gone before it could work" },
        { label: "Waxy leaf", note: "Upright and water-repellent" },
      ],
      readout: [
        { k: "Landed", v: "Yes" },
        { k: "Stayed", v: "Not all" },
        { k: "Visible sign", v: "None" },
      ],
    },
    {
      kicker: "With KMEP Ultra®",
      heading: "Nothing changes about your nozzle or your rate.",
      body: "What changes is how many of those droplets stay where you put them. KMEP Ultra® rides in the tank you are already filling, improves how the spray covers and lands, and carries foliar potassium in the same drop.",
      legend: [{ tone: 1, label: "Spray that stays" }],
      callouts: [
        { label: "Spread droplet", note: "Covers and lands on the leaf" },
        { label: "Leaf surface", note: "The target you aimed it at" },
        { label: "Potassium", note: "Rides in the same drop" },
      ],
      readout: [
        { k: "Rate", v: "Same" },
        { k: "Pass", v: "Same" },
        { k: "Carries", v: "Potassium" },
      ],
    },
  ],
};

/** Versão A — o preto: o que a perda custa (K4), e onde ela aparece. */
export const blackoutA: Blackout = {
  headline: ["Small losses you never see", "add up to a number you do."],
  body: "Two things happen when a pass underperforms.",
  chapters: [
    {
      kicker: "The obvious one",
      heading: "The re-spray.",
      body: "Another trip, more diesel, another weather window you did not plan for.",
      image: "/img/kmep/blackout/respray.webp",
      alt: "A sprayer boom passing over young corn at first light, mist hanging over the rows",
    },
    {
      kicker: "The quieter one",
      heading: "The potassium the crop needed in the same stretch.",
      body: "And did not get, because the demand peaked while the soil was dry and the root could not move it fast enough.",
      image: "/img/kmep/blackout/dryroots.webp",
      alt: "Brace roots of a corn plant gripping dry, cracked soil in late summer",
    },
    {
      kicker: "At harvest",
      heading: "Both show up in the yield monitor.",
      body: "Neither shows up as a symptom you can photograph. A trial strip with its untreated check makes the result measurable.",
      image: "/img/kmep/blackout/monitor.webp",
      alt: "A yield map glowing on the in-cab monitor of a combine at dusk during corn harvest",
      proof: true,
    },
  ],
};

/** Versão B — a headline da versão 2 do teste A/B no hero (K1). */
export const heroB = {
  heading: "One pass. Two jobs.",
  /* O título curto do pé é a headline da versão 1, que aqui desce para lá. */
  aside: { heading: ["You won't see the loss", "until you harvest."] },
  body: "KMEP Ultra® goes in with the insecticide you already chose. It improves coverage and deposition on the day you spray, and it puts potassium on the leaf for the window where demand peaks.",
};

/** Versão B — uma passada, dois trabalhos. */
export const sceneB: Scene = {
  steps: ["One pass", "Job 1", "Job 2", "Filling"],
  stages: [
    {
      kicker: "One pass",
      heading: "One pass. Two jobs.",
      body: "KMEP Ultra® goes in the tank with the insecticide you already chose, on the pass you already scheduled. No separate trip across the field.",
      legend: [],
      callouts: [
        { label: "Nozzle", note: "Same nozzle, same rate" },
        { label: "Spray fan", note: "Rides with the insecticide you chose" },
        { label: "Canopy", note: "The pass you already scheduled" },
      ],
      readout: [
        { k: "Extra trips", v: "0" },
        { k: "Tank", v: "Same" },
        { k: "Rate", v: "Same" },
      ],
    },
    {
      kicker: "Job 1 · The day you spray",
      heading: "What the droplet does before it dries.",
      body: "KMEP Ultra® improves how the spray covers the leaf surface and how well it deposits, so more of what you bought reaches the target you aimed it at.",
      legend: [{ tone: 1, label: "Spray that stays" }],
      callouts: [
        { label: "Coverage", note: "Spread across the leaf surface" },
        { label: "Deposition", note: "Stays where it lands" },
        { label: "Same rate", note: "Nothing changes on the label" },
      ],
      readout: [
        { k: "Happens in", v: "20 minutes" },
        { k: "Rate", v: "Same" },
        { k: "Nozzle", v: "Same" },
      ],
    },
    {
      kicker: "Job 2 · The rest of the season",
      heading: "Foliar potassium starts at the leaf.",
      body: "Soil potassium has to dissolve, travel to the root and ride up to the leaf, and every step slows down when the profile dries. Foliar potassium moves into the tissue from where it lands.",
      legend: [{ tone: 1, label: "Potassium" }],
      callouts: [
        { label: "Droplet", note: "Where the potassium lands" },
        { label: "Into the tissue", note: "Moves in from the leaf" },
        { label: "Vein", note: "The route through the leaf" },
      ],
      readout: [
        { k: "Starts at", v: "The leaf" },
        { k: "Waits on soil", v: "No" },
        { k: "Runs for", v: "The season" },
      ],
    },
    {
      kicker: "Filling",
      heading: "Potassium in the weeks that set the yield.",
      body: "Potassium demand peaks late, while the grain, the tuber or the fruit is filling, exactly when a dry stretch limits what the soil can move. The late pass on the label puts it on the leaf in that window.",
      legend: [{ tone: 1, label: "Filling" }],
      callouts: [
        { label: "Kernels", note: "Where the demand peaks" },
        { label: "Husk", note: "Ear formation: the last pass" },
        { label: "Silks", note: "Pollination" },
      ],
      readout: [
        { k: "Passes", v: "By crop label" },
        { k: "Demand", v: "Peaks late" },
        { k: "Extra trips", v: "0" },
      ],
    },
  ],
};

/** Versão B — o preto: a perda, que aqui vem depois do produto. */
export const blackoutB: Blackout = {
  headline: ["You won't see the loss", "until you harvest."],
  body: "Part of every application never does the work you paid for.",
  chapters: [
    {
      kicker: "On the leaf",
      heading: "Part of every pass misses.",
      body: "Some of the spray stops on the top of the canopy, some bounces, and some dries before it reaches the leaf surface that mattered. None of it shows from the cab.",
      image: "/img/kmep/blackout/canopy.webp",
      alt: "Spray droplets beaded on the top leaf of a corn plant at dawn, the leaves below in shadow",
    },
    {
      kicker: "In the soil",
      heading: "In the ground is not in the plant.",
      body: "The potassium is in the ground. Your soil test says so. That is not the same as having it in the plant during the weeks that set the yield.",
      image: "/img/kmep/blackout/dryroots.webp",
      alt: "Brace roots of a corn plant gripping dry, cracked soil in late summer",
    },
    {
      kicker: "At harvest",
      heading: "Nine bushels, same pass.",
      body: "One trial, published whole, with the check strip beside it. The product went in with an insecticide application that was already on the schedule.",
      image: "/img/kmep/blackout/monitor.webp",
      alt: "A yield map glowing on the in-cab monitor of a combine at dusk during corn harvest",
      proof: true,
    },
  ],
};
