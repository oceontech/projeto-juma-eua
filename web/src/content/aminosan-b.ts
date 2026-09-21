/**
 * Copy da LP B do Aminosan® (teste A/B), em inglês americano.
 *
 * Página de venda do produto, escrita do zero sobre o ritmo da referência
 * editorial: hero de produto, problema em tela dividida, convergência,
 * apresentação, prova, janela crítica, encaixe na safra, o que tem na
 * bombona, perguntas e pedido.
 *
 * O que a página afirma sai do rótulo (100% L-aminoácidos livres, não
 * hormonal, N-P-K) e da ficha do produto (origem vegetal, fermentação
 * enzimática, foliar, mistura de tanque, janelas de soja e milho). Nenhum
 * verbo de estímulo de crescimento e nenhum número de produtividade — ver
 * docs/02-MERCADO-USA.md, Achado 1.
 */

export const hero = {
  heading: ["Amino acids,", "ready-made."],
  aside: {
    heading: ["Straight to the leaf.", "Ready to work."],
    body: "Aminosan® is a foliar nutrient of 100% free-form L-amino acids with N, P and K. Plant-derived, made by enzymatic fermentation, and sprayed in the pass you already make.",
    cta: { label: "Try it on your acres", href: "#trial-form" },
  },
  record: {
    label: "In every jug",
    items: [
      "100% free-form L-amino acids",
      "Plant-derived",
      "Enzymatic fermentation",
      "N · P · K",
      "Non-hormonal",
    ],
  },
  scroll: "Scroll",
};

/* A parada da molécula no hero: a câmera acabou de entrar na bombona, então
   a molécula é o que tem lá dentro — e o assunto é como ela foi feita. A rota
   do nitrato já está na seção "problem"; aqui não se repete. */
export const molecule = {
  eyebrow: "Inside the jug · Free L-amino acids",
  heading: "Freed by enzymes, not by acid.",
  body: "Aminosan® starts as plant protein. Enzymes take it apart at mild temperature, bond by bond, until what's left are single amino acids.",
  callout: "Harsh acid processing can destroy some amino acids and flip others into a mirror-image form plants don't build with. Enzymes leave them intact, in L-form.",
  steps: [
    { label: "Plant protein", note: "Vegetal source" },
    { label: "Enzymes", note: "Mild, precise cuts" },
    { label: "Free L-amino acids", note: "Ready for the leaf" },
  ],
};

export const problem = {
  image: {
    heading: "Most nitrogen arrives unfinished.",
    body: "Nitrate from the soil or the bag is raw material. Before it becomes protein, the plant has to reduce it, aminate it and assemble it, and every step spends energy your crop made for leaves, pods and grain.",
    alt: "Young corn plant at first light",
  },
  stat: {
    value: 4,
    heading: "conversions stand between nitrate and an amino acid your crop can use.",
    source: "Nitrogen assimilation in plants, simplified.",
  },
  chain: [
    { formula: "NO₃⁻", name: "Nitrate" },
    { formula: "NO₂⁻", name: "Nitrite" },
    { formula: "NH₄⁺", name: "Ammonium" },
    { formula: "Glu", name: "Glutamate" },
    { formula: "AA", name: "Amino acid" },
  ],
};

export const converge = {
  heading: "What if your crop could skip the assembly line?",
  aside: {
    heading: ["We hand it the", "finished part."],
    body: "Aminosan® puts free-form L-amino acids on the leaf, already in the form the plant builds protein from. No conversion to wait on, no detour through the soil.",
    cta: { label: "See how it works", href: "#meet" },
  },
  cards: [
    {
      title: "100% free-form",
      body: "Single L-amino acids, not peptide chains. Nothing left for the plant to cut apart.",
    },
    {
      title: "N, P and K on board",
      body: "Nitrogen, phosphate and potash ride along in the same spray.",
    },
    {
      title: "Non-hormonal",
      body: "No hormones in the formula: amino acids plus N, P and K.",
    },
  ],
};

export const meet = {
  heading: "Meet Aminosan®",
  intro: "Follow one pour from the jug to the leaf.",
  scroll: "Scroll to dive in",
  /* Cada etapa acompanha um trecho do vídeo tocado pelo scroll (Meet.tsx):
     derrame, mistura e mergulho, nuvem submersa, partículas, folha. */
  stages: [
    {
      n: "01",
      title: "Pour it in",
      body: "Straight into the spray tank. No new equipment, no extra trip across the field.",
    },
    {
      n: "02",
      title: "Mixes with your program",
      body: "Alone or with the products you already spray. Follow the mixing order on the label.",
    },
    {
      n: "03",
      title: "Every drop carries it",
      body: "100% free-form L-amino acids with N, P and K, spread through the water you already spray.",
    },
    {
      n: "04",
      title: "Ready-made",
      body: "Single amino acids, not peptide chains. Nothing left for the plant to break down.",
    },
    {
      n: "05",
      title: "Onto the leaf",
      body: "Sprayed on, taken up through the leaf and used as delivered.",
    },
  ],
  cta: { label: "See where it fits", href: "#season" },
};

export const cell = {
  eyebrow: "Inside the leaf",
  stages: [
    {
      kicker: "Past the surface",
      title: "Where amino acids go to work.",
      body: "Every cell in the leaf is building something: enzymes, the proteins that run photosynthesis, the machinery that makes chlorophyll. All of it is assembled from amino acids.",
    },
    {
      kicker: "The building blocks",
      value: "20",
      title: "amino acids make up every protein the plant builds.",
      body: "Aminosan® delivers amino acids free-form, one by one, so they can go straight into the build instead of being made from scratch.",
    },
    {
      kicker: "The right shape",
      value: "L-",
      title: "the form found in the plant's own proteins.",
      body: "Amino acids come in two mirror-image forms, and plant cells build with the L-form. That's the only form in the jug: 100% free-form L-amino acids.",
    },
  ],
  alt: "Macro zoom from a leaf into its cells",
};

export const proof = {
  heading: ["Field-proven.", "Grower-trusted."],
  alt: "Farmer checking a soybean field at golden hour",
  stats: [
    { value: 100, suffix: "%", label: "free-form L-amino acids" },
    { value: 4, suffix: "", label: "conversion steps your crop skips" },
    { value: 0, suffix: "", label: "extra passes: it rides in your spray" },
    { value: 40, suffix: "+", label: "years of seasons in the field" },
  ] satisfies { value: number; suffix: string; label: string }[],
  note: "Field performance varies with crop, weather and management. Always read and follow the label.",
};

export const timing = {
  heading: "Built for the weeks that decide your yield.",
  body: [
    "Flowering, pod set, grain fill. Your crop's demand for nitrogen peaks right when heat and dry spells make it hardest for the roots to keep up.",
    "Aminosan® puts amino acids on the leaf in those weeks, in the form the plant uses, so its nitrogen supply isn't waiting on the soil.",
  ],
  cta: { label: "Plan your application", href: "#trial-form" },
  alt: "Hands holding a soybean plant with full pods",
};

export const season = {
  heading: ["Fits the crops", "you already grow."],
  intro: "One jug, two row crops, and the spray passes already on your calendar.",
  cards: [
    {
      tag: "Soybeans",
      title: "V2–V3 through R5",
      body: "Alone or in tank mix, from early vegetative stages through pod fill.",
      image: "/img/aminosan-b/cut-soy.webp",
      alt: "Soybean plant with pods",
    },
    {
      tag: "Corn",
      title: "V2 through V8",
      body: "In the early vegetative window, riding along with a pass you already make.",
      image: "/img/aminosan-b/cut-corn.webp",
      alt: "Young corn plant",
    },
    {
      tag: "In the tank",
      title: "Aminosan®",
      body: "A small rate per acre, with the rate and mixing order right on the label.",
      image: "/img/aminosan-b/cut-jug.webp",
      alt: "Aminosan jug",
    },
  ],
};

export const inside = {
  label: {
    heading: ["What's in", "every jug."],
    body: "Everything that matters is printed on the label. Here it is in plain words.",
    alt: "Aminosan label close-up",
    facts: [
      { k: "Amino acids", v: "100% free-form L-amino acids" },
      { k: "Source", v: "Plant-derived" },
      { k: "Process", v: "Enzymatic fermentation" },
      { k: "Nutrients", v: "Nitrogen, phosphate, potash" },
      { k: "Hormones", v: "None" },
    ],
  },
  notes: [
    { label: "Free trial strip", body: "Product for one strip on your farm, with an untreated check beside it." },
    { label: "Agronomist on call", body: "Help choosing the field, the timing and the rate." },
  ],
  heading: ["Put it to the test", "on your ground."],
  body: "Pick a field, leave an untreated check strip, and compare at harvest. We supply the product.",
  cta: { label: "Request a trial strip", href: "#trial-form" },
  alt: "Aerial view of a soybean field with a flagged trial strip",
};

export const questions = {
  heading: ["Straight answers", "for growers."],
  prev: "Previous",
  next: "Next",
  items: [
    {
      q: "What makes free amino acids different?",
      a: "They're single amino acids, not peptide chains. The plant can put them to work without breaking anything down first.",
      image: "/img/aminosan-b/meet-leaf.webp",
    },
    {
      q: "Will it fit my spray program?",
      a: "Use it alone or in the tank with a pass you've already planned. Follow the mixing order on the label and jar-test new combinations.",
      image: "/img/aminosan-b/season-sprayer.webp",
    },
    {
      q: "When should I apply it?",
      a: "Soybeans from V2–V3 through R5, corn from V2 through V8. Your agronomist can match the timing to your program.",
      image: "/img/aminosan-b/season-soy.webp",
    },
    {
      q: "Does it contain hormones?",
      a: "No. Aminosan® is non-hormonal: free-form amino acids plus nitrogen, phosphate and potash.",
      image: "/img/aminosan-b/season-corn.webp",
    },
    {
      q: "How much do I need?",
      a: "A small rate per acre, in a pass you're already making. The rate for your crop is on the label.",
      image: "/img/aminosan-b/timing-hands.webp",
    },
    {
      q: "How do I know it works on my farm?",
      a: "Run a strip with an untreated check beside it and compare at harvest. We supply the product.",
      image: "/img/aminosan-b/proof-farmer.webp",
    },
  ],
};

export const final = {
  heading: ["Run it on", "your acres."],
  body: "Tell us your crop and your state. We'll send pricing, the label and a plan for a trial strip on your farm.",
  alt: "Farmer at the edge of a corn field at golden hour",
  fields: {
    name: { label: "Full name", placeholder: "Your name" },
    email: { label: "Email", placeholder: "you@farm.com" },
    state: { label: "State", placeholder: "Iowa" },
    crop: { label: "Primary crop", placeholder: "Soybeans" },
  },
  call: "I'd like a call from an agronomist",
  submit: "Request a trial strip",
  sending: "Sending…",
  privacy: "We use your information to answer this request and nothing else.",
};
