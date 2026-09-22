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
  eyebrow: ["Spray performance", "Foliar potassium", "Tank-mix partner"],
  heading: "You won't see the loss until you harvest.",
  body: "Part of every application never does the work you paid for. KMEP Ultra® rides in the tank you are already filling. It improves how the spray covers and lands, and it carries foliar potassium into the weeks when grain fill is setting the yield. Six dollars an acre.",
  /* Versão 2, para o teste A/B — anotada, sem rota própria:
     heading: "One pass. Two jobs. Six dollars an acre."
     body: "KMEP Ultra® goes in with the insecticide you already chose. It improves coverage and deposition on the day you spray, and it puts potassium on the leaf for the window where demand peaks." */
  cta: { label: "Run a trial strip on your acres", href: "#trial-form" },
  secondary: { label: "See the trial", href: "#proof" },
  alt: "A self-propelled sprayer making an insecticide pass at sunrise",
};

/** K2 — a faixa de prova ancorada no pé do hero. */
export const proofBand = {
  label: "The trial, in one line",
  stats: [
    { value: 221.3, decimals: 1, unit: "bu/ac", label: "Treated" },
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
    jobA: { tag: "Job 1", title: "Coverage and deposition", clock: "20 min", time: "Twenty minutes in that field" },
    jobB: {
      tag: "Job 2",
      title: "Foliar potassium",
      time: "The rest of the season",
      marks: ["Pollination", "Grain fill", "Harvest"],
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
  heading: "Grain fill runs on potassium the root may not deliver in time.",
  body: "Potassium demand peaks late, through pollination and grain fill, which is exactly when a dry stretch, a compaction layer or a shallow root system limits how much the soil can actually move.",
  /* Entra sozinha, em máscara, depois que as duas rotas completam. */
  quote: "The potassium is in the ground. Your soil test says so. That is not the same as having it in the plant during the three weeks that set the kernel.",
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
    title: "Six dollars an acre, against 8.9 bushels.",
    cost: { value: "$6", unit: "/acre", label: "Product cost, one spray" },
    gain: { value: "+8.9", unit: "bu/ac", label: "Trial response" },
    witness: "221.3 vs 212.3 bu/ac untreated check · Rehagro trial, Brazil",
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
    treated: { label: "Treated · KMEP Ultra®", value: 221.3 },
    diff: { label: "Difference", value: "+8.9", note: "+4.2%" },
    unit: "bu/ac",
  },
  /* A escala das barras começa em zero e está rotulada: com ela, a diferença
     aparece do tamanho que tem. */
  scale: { max: 250, step: 50, unit: "bu/ac", label: "Scale starts at zero" },
  table: {
    label: "The trial, in full",
    intro: "One trial, published whole. When we have more, they'll be here too, including the ones that didn't separate.",
    columns: ["Crop", "Location", "Treated", "Untreated check", "Difference", "Source", "Year"],
    rows: [
      /* TODO(P21): trocar "Being confirmed" pelo ano do ensaio. */
      ["Corn", "Brazil", "221.3 bu/ac", "212.3 bu/ac", "+8.9 (+4.2%)", "Rehagro", "Being confirmed"],
      ["", "Original units", "231.45 sc/ha", "222.12 sc/ha", "+9.33 sc/ha", "", ""],
    ],
  },
  /* O artigo revisado por pares. O incremento exato de produtividade está em
     figura no artigo e depende da P32; a autorização para citá-lo também.
     A parte de eficácia sobre praga fica fora da página (FIFRA, P2). */
  paper: {
    label: "And a second one, peer-reviewed",
    heading: "Randomized blocks, a third-party station, and a journal that published it.",
    body: "Cotton, 2021 season, run at an independent experimental station in Rio Verde, Goiás. Randomized block design, three treatments: the recommended insecticide program alone, the same program with KMEP Ultra® in every application, and the same program with KMEP Ultra® in alternate applications. Fifteen applications, manual harvest and a yield assessment at the end. Both KMEP Ultra® treatments out-yielded the check.",
    facts: [
      { k: "Design", v: "Randomized blocks · 3 treatments" },
      { k: "Station", v: "Independent · Rio Verde, Goiás" },
      { k: "Published in", v: "Revista Foco · v.16 n.2 · 2023" },
      { k: "DOI", v: "10.54751/revistafoco.v16n2-129" },
    ],
    disclosure: "Disclosure: three of the four authors are Juma-Agro agronomists. The fourth is a researcher at the Instituto Goiano de Agricultura, and the trial was run at an independent experimental station. We are saying so here because it is the kind of thing you would find out anyway, and because a trial you can check is worth more than one you have to believe.",
  },
  footnote: "Results from field trials conducted in Brazil. Field performance varies with climate, soil and management.",
};

/* -------------------------------------------------------------------- K11 */

/* TODO(P4): se a dose do rótulo americano mudar o custo, esta é a única
   tabela da página onde o número aparece. */
export const economics = {
  heading: "What nine bushels is worth on your acres.",
  body: "At $4.30 corn, 8.9 bushels is $38.27 an acre. The product costs six dollars an acre at the label rate for one spray. We publish both numbers together, because the gap between them is the whole decision.",
  witness: "+8.9 bu/ac: 221.3 treated vs 212.3 bu/ac untreated check",
  columns: ["Corn price", "Value of +8.9 bu/ac", "Product cost", "Net per acre"],
  rows: [
    { price: "$4.00/bu", value: 35.6, cost: 6, net: 29.6 },
    { price: "$4.30/bu", value: 38.27, cost: 6, net: 32.27 },
    { price: "$4.60/bu", value: 40.94, cost: 6, net: 34.94 },
  ],
  /* As barras dividem uma escala só: ganho, custo e líquido no mesmo metro. */
  scale: { max: 45, step: 15 },
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
  /* Bloco de contexto: estatística pública. Não atribui controle ao produto,
     e o texto ao redor não pode sugerir isso. */
  context: {
    label: "Context · Public data",
    stats: [
      { value: 185, label: "Counties" },
      { value: 16, label: "States" },
      { value: 2025, label: "Season" },
    ],
    body: "Corn leafhopper was confirmed in 185 counties across 16 states in the 2025 season. Brazil has been managing it for more than a decade.",
    source: "Pioneer, 2025, public data.",
  },
};

/* -------------------------------------------------------------------- K13 */

export const timing = {
  heading: "When it goes in.",
  body: "In the insecticide pass you already have on the schedule. Corn and soybeans are the two crops positioned for the U.S. today. Cotton and specialty crops are under technical review.",
  cropLabel: "Crop",
  season: "Season",
  /* A régua é ordinal: marca os estágios do rótulo 2026, sem pretender ser
     escala de dias. `at` é a posição na régua, de 0 a 1. */
  crops: [
    {
      id: "corn",
      label: "Corn",
      marks: [
        { code: "V4", at: 0.18 },
        { code: "V6", at: 0.32 },
        { code: "Ear formation", at: 0.62 },
      ],
      spans: [
        { from: 0, to: 1, note: "Ride with insecticide passes you already scheduled" },
        { from: 2, to: 2, note: "The potassium arriving where the demand is" },
      ],
      summary: "V4, V6, and again at ear formation. The corn timing has two halves and both matter. The first two ride with insecticide passes you already scheduled, and the one at ear formation is the potassium arriving where the demand is.",
    },
    {
      id: "soy",
      label: "Soybeans",
      marks: [
        /* As repetições não têm estágio próprio: marca sem rótulo, e a nota
           do colchete diz o intervalo. */
        { code: "V6/V7", at: 0.3 },
        { code: "", at: 0.47, minor: true },
        { code: "", at: 0.64, minor: true },
      ],
      spans: [{ from: 0, to: 2, note: "Repeating every 10 to 15 days" }],
      summary: "Soybeans: V6/V7, repeating every 10 to 15 days.",
    },
  ],
  details: [
    {
      k: "Rate and pack",
      /* TODO(P4): trocar pela dose do rótulo americano, em fl oz/acre.
         TODO(P1): acrescentar as embalagens americanas. */
      v: "Rates in fl oz per acre come from the U.S. label; tell us your crop and we'll send it.",
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
      "Already sprays insecticide on corn or soybeans",
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
      a: "Because the check plots line up with your benchmark. The untreated corn in our trial ran 212.3 bu/ac, close to the U.S. national average. The trial wasn't run in easier conditions than yours; it was run in harder ones.",
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
    {
      q: "How much does it cost per acre?",
      a: "Six dollars an acre per spray at label rate. The trial it sits next to returned 8.9 bu/ac (221.3 vs 212.3 bu/ac untreated), which is $38.27 at $4.30 corn. We publish both numbers on the same screen.",
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
  /* Versão 2: "Six dollars an acre, on one strip of your worst field." */
  body: "Pick a field, leave an untreated check strip beside it, and we will come back at harvest with you. Tell us your crop and your state and we will send the label, rates in fl oz per acre, and the full trial report first.",
  /* Ressalva obrigatória, dentro da seção. */
  disclaimer: "KMEP Ultra® is applied in tank mix with an insecticide and never in place of one. It does not change the rate on the insecticide label. Always read and follow the label directions of the pesticide you are applying.",
  /* As culturas do formulário reduzido: as duas posicionadas, a que está em
     revisão e uma saída. A ordem casa com os ícones do TrialForm. */
  crops: ["Corn", "Soybeans", "Cotton", "Other"],
  alt: "Corn harvest at sunset, grain unloading into a cart beside the combine",
};
