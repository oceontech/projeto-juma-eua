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
  eyebrow: "100% free-form L-amino acids",
  heading: "Amino acids, ready-made.",
  aside: {
    heading: ["Straight to the leaf.", "Ready to work."],
    body: "Aminosan® is a foliar nutrient of 100% free-form L-amino acids with N, P and K. Plant-derived, made by enzymatic fermentation, and sprayed in the pass you already make.",
  },
  /* O selo do canto: a folha com o texto em arco. */
  badge: "foliar nutrient",
  alt: "A jug of Aminosan® standing in a young soybean field at sunrise",
};

/**
 * A cena de partículas que nasce do hero se desfazendo (Origin.tsx).
 *
 * O arco é a cadeia da assimilação de nitrogênio: onde ela acontece, o que a
 * raiz recebe, o que sobra depois das reduções, e a peça pronta no fim. Só na
 * última seção o produto entra — e entra pelo que ele entrega, nunca pelo que
 * faria na planta. Descrever a fisiologia da planta é seguro; prometer efeito
 * sobre ela é o gatilho FIFRA. Ver docs/02-MERCADO-USA.md, Achado 1.
 *
 * O Problem, logo abaixo, conta a mesma cadeia em cartões. A repetição é
 * conhecida e está de pé por decisão do cliente, até ver as duas juntas.
 */
export const origin = {
  panels: [
    {
      eyebrow: "Inside every crop",
      heading: "No plant is handed an amino acid.",
      body: "It builds every one of them, from raw nitrogen up, on a line that runs the whole season. Here is that line, one step at a time.",
      caption: "Nitrogen assimilation, simplified",
    },
    {
      eyebrow: "Step one",
      heading: "It starts as nitrate.",
      body: "What the roots take up is NO₃⁻ — one nitrogen held by three oxygens. It's the form nitrogen travels in, and nothing the plant can build with yet.",
      caption: "NO₃⁻ · nitrate",
    },
    {
      eyebrow: "Steps two and three",
      heading: "Two reductions to get to ammonium.",
      body: "Nitrate to nitrite, nitrite to ammonium. Two enzymes, two conversions, and both are paid for in energy and carbon the crop made in the leaf.",
      caption: "NH₄⁺ · ammonium",
    },
    {
      eyebrow: "Step four",
      heading: "And only now, an amino acid.",
      body: "Ammonium goes onto glutamate, and glutamate passes it to the amino acid the crop was building toward. Four conversions, and the crop paid for every one of them.",
      caption: "L-amino acid · NH₂ — CH(R) — COOH",
    },
  ],

  /* O trilho que fecha a cena: a rota da planta, que vai acendendo etapa por
     etapa, e embaixo dela a mesma rota pelo produto — um passo só. É a
     comparação que a página precisa dar de relance, e a única forma segura de
     dar: o que se compara é o caminho do nitrogênio, não o porte de duas
     plantas. Planta tratada ao lado de testemunha é representação visual de
     regulador de crescimento e está proibida no design — 02-MERCADO-USA.md. */
  route: {
    label: "The route the crop runs",
    steps: ["NO₃⁻", "NO₂⁻", "NH₄⁺", "Glu", "AA"],
    /** Quantas etapas já estão acesas em cada painel. */
    lit: [0, 1, 3, 5],
    shortcut: {
      label: "The route with Aminosan®",
      from: "Aminosan®",
      note: "Delivered as the finished amino acid: 100% free-form, L-form, plant-derived.",
    },
  },
};

/**
 * A cena de partículas, no arco da LP C — a unidade, a cadeia, a forma livre
 * e a folha —, escrita para quem nunca viu uma molécula. Três apoios para o
 * leigo: a cor tem legenda (o verde é o nitrogênio; o âmbar é a ligação que
 * ainda precisa ser aberta), cada painel termina numa pergunta de sim ou não
 * ("Ready to use?"), e o trilho embaixo diz em palavras onde se está.
 *
 * As chamadas seguem a ordem das âncoras em `lib/scan/specimen.ts`: é por
 * índice que uma encontra a outra. `tone` na legenda é a tag do desenho
 * (1 verde, 2 âmbar).
 */
export const specimen = {
  steps: ["Building block", "Linked", "Free", "On the leaf"],
  stepOf: "Step",
  stages: [
    {
      kicker: "The building block",
      heading: "This is an amino acid.",
      body: "Every protein a plant makes — the enzymes, the leaf, the pod — is assembled from small parts like this one. There are twenty kinds, and each carries nitrogen at one end.",
      legend: [{ tone: 1, label: "Nitrogen" }],
      callouts: [
        { label: "Nitrogen end", note: "NH₂ — the amino group" },
        { label: "Acid end", note: "COOH — the other end" },
        { label: "Side chain", note: "The part that makes each kind different" },
      ],
      readout: [
        { k: "What it is", v: "One part" },
        { k: "Kinds", v: "20" },
        { k: "Carries", v: "Nitrogen" },
      ],
    },
    {
      kicker: "Linked",
      heading: "Amino acids can come linked in a chain.",
      body: "Joined end to end, they are called peptides. Each amber link is a bond that has to be opened before a single part can be used.",
      legend: [
        { tone: 2, label: "Link to open" },
        { tone: 1, label: "Nitrogen" },
      ],
      callouts: [
        { label: "Link", note: "The bond between two amino acids" },
        { label: "Chain", note: "Parts still joined together" },
        { label: "Not free yet", note: "No part here is on its own" },
      ],
      readout: [
        { k: "Parts", v: "Joined" },
        { k: "Links", v: "To open" },
        { k: "Ready to use", v: "Not yet" },
      ],
    },
    {
      kicker: "Free form",
      heading: "Aminosan® delivers them already apart.",
      body: "100% free-form. Plant protein is taken apart by enzymatic fermentation into single L-amino acids — no chains, no links left to open.",
      legend: [{ tone: 1, label: "Nitrogen" }],
      callouts: [
        { label: "Single parts", note: "No peptide bonds" },
        { label: "L-form only", note: "The form plant proteins are built from" },
        { label: "No hormones", note: "Amino acids plus N, P and K" },
      ],
      readout: [
        { k: "Parts", v: "Single" },
        { k: "Links", v: "None" },
        { k: "Ready to use", v: "Yes" },
      ],
    },
    {
      kicker: "On the leaf",
      heading: "Sprayed on the leaf, in a pass you already make.",
      body: "Foliar, alone or in the tank with what is already on your calendar — follow the mixing order on the label. Nitrogen, phosphate and potash ride in the same drop.",
      legend: [{ tone: 1, label: "Spray drop" }],
      callouts: [
        { label: "The leaf", note: "Where the spray lands" },
        { label: "Spray drop", note: "Amino acids plus N, P and K" },
        { label: "No extra trip", note: "Rides on a pass you make anyway" },
      ],
      readout: [
        { k: "Applied", v: "On the leaf" },
        { k: "Extra passes", v: "0" },
        { k: "Carries", v: "N · P · K" },
      ],
    },
  ],
};

/**
 * A virada para o campo: a tela escurece e faz a pergunta, e a resposta é a
 * comparação lado a lado — folha, planta e raiz, sem e com Aminosan®.
 *
 * ATENÇÃO — decisão de risco tomada pelo cliente em 2026-09-23, contra a
 * restrição visual de docs/02-MERCADO-USA.md ("duas plantas lado a lado com
 * portes diferentes está proibido no design"; a EPA lê peça promocional junto
 * com o rótulo, e raiz maior é claim de *root stimulation*). As imagens são
 * geradas, não de ensaio: por isso o aviso "Illustrative images" fica sempre
 * na tela, e a copy não traz número nenhum. Rever com a Juma antes do ar.
 */
export const field = {
  headline: ["So what's the real", "difference in the field?"],
  body: "Same field, same stage, same pass. One side got Aminosan®.",
  without: "Without Aminosan®",
  with: "With Aminosan®",
  note: "Illustrative images.",
  chapters: [
    {
      kicker: "The leaf",
      heading: "Deeper green, a fuller leaf.",
      body: "Look at the color and the body of the leaf, side by side, at the same stage.",
      alt: {
        without: "Soybean trifoliate leaf, paler and thinner, at sunrise",
        with: "Soybean trifoliate leaf, deep green and full, at sunrise",
      },
    },
    {
      kicker: "The plant",
      heading: "More plant at the same stage.",
      body: "Same age, same row. Compare height, stem and canopy.",
      alt: {
        without: "Young soybean plant, shorter with smaller, paler leaves",
        with: "Young soybean plant, taller with larger, deep-green leaves",
      },
    },
    {
      kicker: "Below ground",
      heading: "And under the soil, more root.",
      body: "The part nobody sees: a deeper taproot and more lateral roots exploring the soil.",
      alt: {
        without: "Soybean root system in a soil cutaway, short and sparse",
        with: "Soybean root system in a soil cutaway, deep and densely branched",
      },
    },
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
