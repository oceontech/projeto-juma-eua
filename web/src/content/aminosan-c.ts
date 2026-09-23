/**
 * Copy da LP C do Aminosan® (terceira versão do teste), em inglês americano.
 *
 * O registro é outro: a página é um **instrumento de análise**. O leitor não
 * está lendo um anúncio, está olhando uma amostra ser escaneada — a foto do
 * produto se fragmenta em pontos e a nuvem passa por quatro leituras. Daí os
 * rótulos curtos em caixa alta, os painéis de leitura e a numeração das
 * etapas: é a gramática de um painel de laboratório, não de um folheto.
 *
 * O arco é o diferencial mais duro do rótulo, e o único que o concorrente não
 * copia numa frase: **forma livre**. A unidade, a cadeia em que o aminoácido
 * pode chegar, a forma livre em que este chega, e a entrega na folha.
 *
 * Tudo o que a página afirma sai do rótulo e da ficha do produto. Nenhum
 * verbo de estímulo, nenhum número de produtividade, nenhuma planta tratada
 * ao lado de testemunha — ver docs/02-MERCADO-USA.md, Achado 1.
 */

export const hero = {
  tag: "Specimen · Aminosan®",
  heading: ["Look inside", "the jug."],
  body: "A foliar nutrient of 100% free-form L-amino acids, with nitrogen, phosphate and potash. Four readings, and you will know exactly what that sentence means.",
  scroll: "Scroll to scan",
  alt: "A jug of Aminosan® standing in a young soybean field at sunrise",
};

/**
 * As quatro leituras. Cada uma tem um desenho na nuvem, três chamadas
 * ancoradas nele e uma linha de leitura no painel lateral.
 *
 * A ordem das chamadas importa: ela é a mesma das âncoras declaradas em
 * `lib/scan/forms.ts`, e é por índice que uma encontra a outra.
 */
export const stages = [
  {
    id: "01",
    kicker: "The unit",
    heading: "This is what a crop builds with.",
    body: "Every protein a plant makes — the enzymes, the machinery of photosynthesis, the structure that holds a pod together — is assembled from amino acids. Twenty of them, and only in one of the two mirror-image forms they exist in.",
    callouts: [
      { label: "Amino group", note: "NH₂ — the nitrogen end" },
      { label: "Acid group", note: "COOH — the carboxyl end" },
      { label: "Side chain", note: "R — what makes one amino acid different from the next" },
    ],
    readout: [
      { k: "Form", v: "Free" },
      { k: "Chirality", v: "L" },
      { k: "Source", v: "Plant-derived" },
    ],
  },
  {
    id: "02",
    kicker: "The chain",
    heading: "Amino acids can arrive still bonded together.",
    body: "In a peptide, they come as a string: real amino acids, joined end to end. They are a package — and every bond in that string is a bond something has to open before a single unit can go into a protein.",
    callouts: [
      { label: "Peptide bond", note: "The link between two units" },
      { label: "Backbone", note: "N — Cα — C, repeated down the chain" },
      { label: "Still joined", note: "Nothing here is free yet" },
    ],
    readout: [
      { k: "Form", v: "Bonded" },
      { k: "Units", v: "Chained" },
      { k: "Ready to use", v: "No" },
    ],
  },
  {
    id: "03",
    kicker: "Free form",
    heading: "These arrive already apart.",
    body: "Aminosan® is 100% free-form. Plant protein is taken apart by enzymatic fermentation, one amino acid at a time, and delivered that way — single L-amino acids, not peptide chains. Nothing left to open.",
    callouts: [
      { label: "100% free-form", note: "Single units, no peptide bonds" },
      { label: "L-form only", note: "The form plant proteins are built from" },
      { label: "Non-hormonal", note: "Amino acids plus N, P and K. No hormones" },
    ],
    readout: [
      { k: "Form", v: "Free" },
      { k: "Units", v: "Single" },
      { k: "Ready to use", v: "Yes" },
    ],
  },
  {
    id: "04",
    kicker: "Delivery",
    heading: "Onto the leaf, in a pass you already make.",
    body: "Foliar. Alone, or in the tank with what is already on the calendar, following the mixing order on the label. Nitrogen, phosphate and potash ride along in the same drop.",
    callouts: [
      { label: "Leaf surface", note: "Where the spray lands" },
      { label: "In the tank", note: "Alone or in mix — jar-test new combinations" },
      { label: "No extra pass", note: "It rides in a trip you were making anyway" },
    ],
    readout: [
      { k: "Route", v: "Foliar" },
      { k: "Passes", v: "0 extra" },
      { k: "Carries", v: "N · P · K" },
    ],
  },
];

/** O painel de especificação, no registro do rótulo. */
export const spec = {
  tag: "Specification",
  heading: ["Everything that matters", "is printed on the label."],
  body: "Here it is in plain words. The rate for your crop, the mixing order and the full guaranteed analysis are on the jug — always read and follow the label.",
  rows: [
    { k: "Amino acids", v: "100% free-form L-amino acids" },
    { k: "Source", v: "Plant-derived" },
    { k: "Process", v: "Enzymatic fermentation" },
    { k: "Nutrients", v: "Nitrogen, phosphate, potash" },
    { k: "Hormones", v: "None" },
    { k: "Route", v: "Foliar — alone or in tank mix" },
  ],
};

/** A janela de aplicação, como uma régua de estágios. */
export const window = {
  tag: "Application window",
  heading: ["Built into the crops", "you already grow."],
  body: "One jug, two row crops, and the spray passes already on your calendar.",
  crops: [
    {
      name: "Soybeans",
      range: "V2–V3 → R5",
      note: "From early vegetative stages through pod fill.",
      marks: ["V2", "V3", "R1", "R3", "R5"],
      /* Onde a faixa começa e termina na régua, de 0 a 1. */
      span: [0.08, 1],
    },
    {
      name: "Corn",
      range: "V2 → V8",
      note: "In the early vegetative window, riding along with a pass you already make.",
      marks: ["V2", "V4", "V6", "V8"],
      span: [0.08, 0.62],
    },
  ],
};

/** O pedido. Mesmo Server Action das outras versões. */
export const request = {
  tag: "Request",
  heading: ["Run it on", "your acres."],
  body: "Pick a field, leave an untreated check strip beside it, and compare at harvest. We supply the product and an agronomist to help you choose the field, the timing and the rate.",
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
  note: "Field performance varies with crop, weather and management. Always read and follow the label.",
};
