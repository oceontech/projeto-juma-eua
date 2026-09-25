/**
 * Copy da LP principal do Aminosan® (rota /aminosan), em inglês americano.
 *
 * O arco segue docs/03-SITE.md (A1–A11), revisto em 25/09/2026: hero e cena
 * de partículas, o campo, a linha de montagem do nitrogênio e as duas rotas
 * (A3–A4), o produto, dentro da folha, a tabela contra o hidrolisado (A4), a
 * prova pela regra da testemunha (A6), a história (A8), a janela (A9), as
 * culturas de mercado, a ficha da bombona, para quem é, a faixa de teste, as
 * perguntas (A11) e o pedido. `origin` só serve o Origin.tsx, fora da página.
 *
 * O que a página afirma sai do rótulo americano (9-2-1, foliar, dose por
 * acre, bombona de 2,5 gal) e da ficha BR (100% L-aminoácidos livres, não
 * hormonal, origem vegetal, fermentação enzimática, mistura de tanque e a
 * tabela de épocas por cultura). Nenhum
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
 * A virada para o campo: a tela escurece e faz a pergunta, e a resposta
 * percorre folha, planta e raiz, um resultado por vez.
 *
 * ATENÇÃO — decisão de risco tomada pelo cliente em 2026-09-23, contra a
 * restrição visual de docs/02-MERCADO-USA.md (a EPA lê peça promocional junto
 * com o rótulo, e raiz maior é claim de *root stimulation*). As imagens são
 * geradas, não de ensaio; a copy não traz número nenhum. Rever com a Juma
 * antes do ar.
 */
export const field = {
  headline: ["So what's the real", "difference in the field?"],
  body: "Follow the details from leaf to root.",
  chapters: [
    {
      kicker: "The leaf",
      heading: "Deeper green, a fuller leaf.",
      body: "A closer look at the color and body of the leaf.",
      alt: "Soybean trifoliate leaf, deep green and full, at sunrise",
    },
    {
      kicker: "The plant",
      heading: "More plant at the same stage.",
      body: "Height, stem and canopy come into view.",
      alt: "Young soybean plant with larger, deep-green leaves",
    },
    {
      kicker: "Below ground",
      heading: "And under the soil, more root.",
      body: "The part nobody sees: a deeper taproot and more lateral roots exploring the soil.",
      alt: "Isolated soybean root system with a long taproot and fine lateral branches",
    },
  ],
};

/**
 * A4 — "Five steps, or one." (docs/03-SITE.md). Abre pelo que o nitrogênio é
 * antes de virar proteína (A3), conta o que a planta faz com ele em três
 * cartões e fecha nas duas rotas, lado a lado: a da planta, com um freio
 * âmbar em cada conversão (o âmbar é a mesma cor da "ligação a abrir" da cena
 * de partículas), e a do Aminosan®, um passo só.
 *
 * Descrever a fisiologia da planta é seguro; prometer efeito do produto sobre
 * ela não é. A rota do produto diz só o que ele entrega (o aminoácido pronto)
 * e nunca "poupa energia" ou "acelera" — ver 02-MERCADO-USA.md, Achado 1. A
 * comparação conta etapas, não horas: não há número de tempo com fonte.
 */
export const assembly = {
  label: "The assembly line",
  heading: "Nitrogen is not an amino acid.",
  body: "Nitrate from the soil or the bag is raw material. Before it becomes protein, the plant has to reduce it, attach it and hand it on, and every step runs on energy and carbon the crop made in the leaf.",
  steps: {
    label: "What the crop does with nitrate",
    items: [
      {
        title: "It reduces it.",
        formula: "NO₃⁻ → NO₂⁻ → NH₄⁺",
        body: "Nitrate to nitrite, nitrite to ammonium. Two enzymes, two conversions, both paid for with energy made in the leaf.",
      },
      {
        title: "It attaches it.",
        formula: "NH₄⁺ + Glu → Gln",
        body: "Ammonium is fixed onto glutamate, making glutamine: the first form of nitrogen the plant can build with.",
      },
      {
        title: "It hands it on.",
        formula: "Gln → Asp · Ala · Ser …",
        body: "From there, the nitrogen is passed along, one transfer at a time, to build each of the other amino acids.",
      },
    ],
  },
  routes: {
    heading: "Five steps, or one.",
    body: "The crop's own route runs from nitrate to a finished amino acid, with a cost at every conversion. Aminosan® goes on the leaf as the finished amino acid.",
    crop: {
      label: "The crop's own route",
      steps: ["Nitrate", "Nitrite", "Ammonium", "Glutamine", "Amino acids"],
    },
    aminosan: {
      label: "With Aminosan®",
      steps: ["Sprayed on the leaf", "Amino acids, ready-made"],
    },
    cost: "Each conversion spends energy and carbon the crop made in the leaf",
    logoAlt: "Aminosan®",
  },
  quote: "The plant can build amino acids. Or you can hand it the finished ones.",
};

/**
 * A4, a tabela: origem, processo e forma. A coluna da direita é sempre a
 * categoria em geral, nunca um concorrente com nome, e sempre com "often" —
 * docs/03-SITE.md. O que a coluna do Aminosan® afirma sai do rótulo e da
 * ficha (100% L-aminoácidos livres, origem vegetal, fermentação enzimática).
 * TODO(P3): o percentual de aminoácidos livres do Guaranteed Analysis
 * americano, que é o número que sustenta esta tabela (A10).
 */
export const compare = {
  label: "Not all amino acids",
  heading: "Amino acid products aren't all built the same.",
  body: "Most of the category starts from a protein and breaks it down. What it starts from, how it's broken down and how far the breaking goes decide what ends up in the jug.",
  columns: { ours: "Aminosan®", theirs: "A typical hydrolysate" },
  rows: [
    { k: "Starts from", ours: "Plant protein", theirs: "Often animal by-products" },
    { k: "Broken down by", ours: "Enzymatic fermentation", theirs: "Often acid hydrolysis, with strong acid and heat" },
    { k: "What comes out", ours: "100% free-form L-amino acids", theirs: "Often a mix of free amino acids and peptide chains" },
  ],
  note: "The right-hand column describes the category in general, not any one product. Whatever you compare, read its label.",
};

export const meet = {
  heading: "Meet Aminosan®",
  intro: "From the jug to the leaf, in five steps.",
  pauseVideo: "Pause video",
  playVideo: "Play video",
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

/**
 * A6 — a prova é a regra (docs/03-SITE.md). Os dois ensaios de soja existem e
 * aparecem com local e fonte, mas os números ficam retidos até chegar a
 * testemunha (P9). Aplicar a própria regra em público, quando custa caro, é a
 * prova mais forte de que ela é real.
 *
 * Os resultados retidos (docs/01-PRODUTO.md): DETEC, +11 e +14 sc/ha; Terras
 * Gerais, +10 sc/ha. NÃO entram na página enquanto P9 estiver aberta.
 * TODO(P19): autorização para citar DETEC e Terras Gerais nominalmente.
 */
export const rule = {
  label: "The proof",
  heading: ["Two trials.", "No numbers yet."],
  body: "Aminosan® has yield results from two soybean trials in Brazil. Neither was published with the untreated check beside it, and a number without its check is a number you can't check. So they stay off this page until the check comes with them. That's the rule for every number on this site.",
  labels: {
    crop: "Crop",
    place: "Location",
    source: "Source",
    results: "Yield results",
    check: "Untreated check",
    treated: "With Aminosan®",
    requested: "Requested",
    withheld: "Withheld",
  },
  trials: [
    { crop: "Soybeans", place: "Taquarivaí, São Paulo", source: "DETEC", results: 2 },
    { crop: "Soybeans", place: "Lavras, Minas Gerais", source: "Terras Gerais", results: 1 },
  ],
  why: {
    heading: "Why the check matters",
    body: "Yield swings from field to field and from year to year. An untreated strip, side by side and under the same management, is the only thing that tells a good field from a good product.",
  },
  close: ["Until the checks arrive, the best trial is the one you run.", "We supply the product for a strip on your farm."],
  cta: { label: "Request a trial strip", href: "#trial-form" },
  footnote: "Results from field trials conducted in Brazil. Field performance varies with climate, soil and management.",
};

/**
 * A8 — "Older than the company that makes it." (docs/03-SITE.md,
 * 01-PRODUTO.md). O frasco é o mesmo da Home (os 17 quadros do GIF de 1988),
 * aqui preso ao scroll.
 *
 * Sem "40 anos": a cronologia não fecha (01-PRODUTO.md, pontos em aberto, 1)
 * e a página não afirma o que não confere. O que é certo: o produto veio
 * antes da empresa, e a empresa é de 1988.
 */
export const heritage = {
  label: "Since before 1988",
  heading: ["Older than the company", "that makes it."],
  body: "In the late 1980s, Julio Matino kept seeing the same thing in the fields of São Paulo: growers spending more on fertilizer and harvesting less than the crop could give. He formulated a foliar of plant-derived amino acids at a time when the idea sounded strange at the farm store. The demand for it built the company.",
  timeline: [
    { year: "1980s", title: "Formulated", body: "Julio Matino develops a foliar of plant-derived amino acids, before there's a company to sell it." },
    { year: "1988", title: "A company to make it", body: "Juma Agro is founded around the product growers kept asking for." },
    { year: "Today", title: "Still the flagship", body: "Every batch checked in Juma's own quality-control lab before it ships." },
    { year: "Now", title: "In the U.S.", body: "Juma-Agro Fertilizer LLC, in Lakeland, Florida." },
  ],
  tagline: "Proven where the growing season never stops.",
  founder: { name: "Julio Matino", role: "Founder, Juma Agro", alt: "Julio Matino, founder of Juma Agro" },
  bottleAlt: "An Aminosan® bottle from 1988 turning into today's bottle",
  yearLabel: "Year",
};

/**
 * A9 — quando entra, no mesmo mostrador do KMEP (SeasonDial). As culturas e
 * as épocas vêm da tabela de aplicação do Aminosan® (ficha BR), em
 * nomenclatura americana; a dose vem do rótulo americano ("Directions for
 * Use"): 14 a 20 Oz por acre nas commodities, a partir de 25 a 30 dias da
 * germinação, e 14 Oz por acre nas hortaliças, repetindo a cada 1 a 2
 * semanas. Café ficou de fora, como no KMEP: não é cultura dos EUA.
 * `ends` troca as pontas do arco quando a safra não começa no plantio.
 * TODO(P4): frutíferas, uva, citros e ornamentais não têm dose no rótulo
 * americano. Até lá, "Ask us".
 * TODO: a tabela BR pede citros "sempre em mistura com micronutrientes
 * (REVIGO®)". O nome do produto fica fora até saber se o REVIGO® é vendido
 * nos EUA.
 */
export const timing = {
  label: "The window",
  heading: "When it goes in.",
  body: "In a foliar pass already on your calendar: 14 to 20 fl oz per acre on commodity crops, 14 fl oz on vegetables. Row crops, vegetables, fruit and ornamentals each have their own window. Pick your crop.",
  cropLabel: "Crop",
  rateLabel: "Rate",
  ends: ["Planting", "Harvest"],
  hint: "Scroll through the season",
  pass: "Pass",
  crops: [
    {
      id: "soy",
      label: "Soybeans",
      rate: "14–20 fl oz/ac",
      marks: [
        { code: "Day 25–30", at: 0.2 },
        { code: "Pre-bloom", at: 0.4 },
      ],
      spans: [{ from: 0, to: 1, note: "Two passes, both before bloom" }],
      summary: "Soybeans: one pass 25 to 30 days after germination and one just before bloom.",
    },
    {
      id: "corn",
      label: "Corn & sorghum",
      rate: "14–20 fl oz/ac",
      marks: [{ code: "Before V8", at: 0.3 }],
      spans: [{ from: 0, to: 0, note: "One pass, before the eighth leaf" }],
      summary: "Corn and sorghum: one pass before the plants reach eight leaves (V8).",
    },
    {
      id: "cotton",
      label: "Cotton",
      rate: "14–20 fl oz/ac",
      marks: [
        { code: "First bloom", at: 0.4 },
        { code: "", display: "+10–15 days", at: 0.5, minor: true },
        { code: "", display: "+10–15 days", at: 0.6, minor: true },
        { code: "", display: "+10–15 days", at: 0.7, minor: true },
      ],
      spans: [{ from: 0, to: 3, note: "Then three to four more, 10 to 15 days apart" }],
      summary: "Cotton: one pass at first bloom, then three to four more, 10 to 15 days apart.",
    },
    {
      id: "grains",
      label: "Rice, wheat & barley",
      rate: "14–20 fl oz/ac",
      marks: [
        { code: "Pre-tillering", at: 0.2 },
        { code: "Boot", at: 0.52 },
      ],
      spans: [{ from: 0, to: 1, note: "Just before tillering, and again at boot" }],
      summary: "Rice, wheat and barley: one pass just before tillering and one at boot.",
    },
    {
      id: "beans",
      label: "Dry beans",
      rate: "14–20 fl oz/ac",
      marks: [
        { code: "Day 25–30", at: 0.2 },
        { code: "Pre-bloom", at: 0.38 },
        { code: "Pod fill", at: 0.6 },
      ],
      spans: [{ from: 0, to: 2, note: "Three passes, from day 25 to pod fill" }],
      summary: "Dry beans: 25 to 30 days after germination, just before bloom, and at pod fill.",
    },
    {
      id: "legumes",
      label: "Peas & peanuts",
      rate: "14–20 fl oz/ac",
      marks: [
        { code: "Day 25–30", at: 0.2 },
        { code: "Pre-bloom", at: 0.38 },
        { code: "Pod fill", at: 0.6 },
      ],
      spans: [{ from: 0, to: 2, note: "Three passes, from day 25 to pod fill" }],
      summary: "Peas and peanuts: 25 to 30 days after germination, just before bloom, and at pod fill.",
    },
    {
      id: "potato",
      label: "Potatoes",
      rate: "14 fl oz/ac",
      marks: [
        { code: "Hilling", at: 0.3 },
        { code: "", display: "+7–10 days", at: 0.44, minor: true },
        { code: "", display: "+7–10 days", at: 0.58, minor: true },
      ],
      spans: [{ from: 0, to: 2, note: "Then two to three more, 7 to 10 days apart" }],
      summary: "Potatoes: one pass after hilling, then two to three more, 7 to 10 days apart.",
    },
    {
      id: "tomato",
      label: "Tomatoes",
      rate: "14 fl oz/ac",
      ends: ["Transplant", "Harvest"],
      marks: [
        { code: "Transplant", at: 0.14 },
        { code: "", display: "+7–10 days", at: 0.28, minor: true },
        { code: "", display: "+7–10 days", at: 0.42, minor: true },
        { code: "", display: "+7–10 days", at: 0.56, minor: true },
      ],
      spans: [{ from: 0, to: 3, note: "Weekly on staked, every 7 to 10 days on ground tomatoes" }],
      summary: "Tomatoes: starting after transplant, weekly on staked tomatoes and every 7 to 10 days on ground tomatoes.",
    },
    {
      id: "roots",
      label: "Carrots & beets",
      rate: "14 fl oz/ac",
      marks: [
        { code: "4–6 in tall", at: 0.26 },
        { code: "", display: "+7–10 days", at: 0.42, minor: true },
        { code: "", display: "+7–10 days", at: 0.58, minor: true },
      ],
      spans: [{ from: 0, to: 2, note: "Then four to five more, 7 to 10 days apart" }],
      summary: "Carrots and beets: one pass at 4 to 6 inches tall, then four to five more, 7 to 10 days apart.",
    },
    {
      id: "veg",
      label: "Vegetables & berries",
      rate: "14 fl oz/ac",
      marks: [
        { code: "First pass", at: 0.2 },
        { code: "", display: "+7–10 days", at: 0.36, minor: true },
        { code: "", display: "+7–10 days", at: 0.52, minor: true },
      ],
      spans: [{ from: 0, to: 2, note: "Five to six passes, 7 to 10 days apart" }],
      summary: "Strawberries, cucumbers, snap beans and other vegetables: five to six passes, 7 to 10 days apart.",
    },
    {
      id: "onion",
      label: "Onions & garlic",
      rate: "14 fl oz/ac",
      marks: [
        { code: "First pass", at: 0.24 },
        { code: "", display: "+15 days", at: 0.42, minor: true },
        { code: "", display: "+15 days", at: 0.6, minor: true },
      ],
      spans: [{ from: 0, to: 2, note: "Four to five passes, 15 days apart" }],
      summary: "Onions and garlic: four to five passes, 15 days apart.",
    },
    {
      id: "citrus",
      label: "Citrus",
      rate: "Ask us",
      ends: ["Dormancy", "Harvest"],
      marks: [
        { code: "Pre-bloom", at: 0.18 },
        { code: "Petal fall", at: 0.36 },
        { code: "Marble size", at: 0.54 },
        { code: "Ping-pong size", at: 0.72 },
      ],
      spans: [{ from: 0, to: 3, note: "Always in the tank with micronutrients" }],
      summary: "Citrus: before bloom, after bloom, at marble size and at ping-pong-ball size. Always tank-mixed with micronutrients.",
    },
    {
      id: "fruit",
      label: "Tree fruit",
      rate: "Ask us",
      ends: ["Harvest", "Next harvest"],
      marks: [
        { code: "Post-harvest", at: 0.14 },
        { code: "After bloom", at: 0.44 },
        { code: "Fruit sizing", at: 0.66 },
      ],
      spans: [{ from: 0, to: 2, note: "One pass at each point of the season" }],
      summary: "Peaches, apples, mangoes and other tree fruit: one pass after harvest, one after bloom and one while the fruit sizes.",
    },
    {
      id: "grape",
      label: "Grapes",
      rate: "Ask us",
      ends: ["Harvest", "Next harvest"],
      marks: [
        { code: "Post-harvest", at: 0.12 },
        { code: "6-in shoots", at: 0.34 },
        { code: "", display: "+15 days", at: 0.5, minor: true },
        { code: "", display: "+15 days", at: 0.66, minor: true },
      ],
      spans: [
        { from: 0, to: 0, note: "One pass after harvest" },
        { from: 1, to: 3, note: "Then five to six more, 15 days apart" },
      ],
      summary: "Grapes: one pass after harvest, one when shoots reach 6 inches, then five to six more, 15 days apart.",
    },
    {
      id: "ornamental",
      label: "Ornamentals",
      rate: "Ask us",
      ends: ["Planting", "Bloom"],
      marks: [
        { code: "First spray", at: 0.2 },
        { code: "", display: "+7–10 days", at: 0.38, minor: true },
        { code: "", display: "+7–10 days", at: 0.56, minor: true },
      ],
      spans: [{ from: 0, to: 2, note: "Every 7 to 10 days until the flower buds form" }],
      summary: "Roses, mums, carnations, gladiolus and other ornamentals: every 7 to 10 days until the flower buds form.",
    },
  ],
};

/* As culturas de mercado seguem a tese da Juma para os EUA: specialty crops
   (frutas e hortaliças da Flórida). Não há estágio, dose nem número aqui de
   propósito — o Aminosan® ainda não tem as culturas americanas confirmadas em
   rótulo, e o que se afirma é só o encaixe na passada que o produtor já faz,
   com dose e época definidas com o agrônomo dele. As épocas e as doses por
   cultura estão no mostrador logo acima (`timing`).
   TODO(P6): confirmar com a Juma/regulatório em quais dessas culturas o
   Aminosan® pode ser posicionado nos EUA antes de publicar. */
export const season = {
  heading: ["And the crops", "you grow for market."],
  intro: "From orchards and vegetables to ornamentals and field crops, explore crops covered by the Aminosan application calendar.",
};

/**
 * O que tem na bombona: a ficha com a bombona no centro, os anéis nas cores
 * do rótulo (o azul da faixa e o verde da marca) e os fatos presos por fios.
 * Tudo aqui sai do rótulo americano (9-2-1, bombona de 2,5 gal). O rótulo
 * não traz percentual de aminoácidos nem cita origem vegetal, fermentação ou
 * ausência de hormônio — isso vem da ficha BR e não entra nesta ficha, que
 * diz "está impresso no rótulo".
 */
export const label = {
  label: "The label",
  heading: ["What's in", "every jug."],
  body: "Everything that matters is printed on the label. Here it is in plain words.",
  alt: "A jug of Aminosan®",
  facts: [
    { k: "Grade", v: "9-2-1, liquid" },
    { k: "Total nitrogen", v: "9.0%: 2.6% water-soluble, 6.4% urea" },
    { k: "Phosphate (P₂O₅)", v: "2.0%, water-soluble" },
    { k: "Potash (K₂O)", v: "1.0%, water-soluble" },
    { k: "Derived from", v: "Phosphoric acid, potassium chloride, urea and amino acids" },
    { k: "Use", v: "Foliar spray" },
    { k: "Jug", v: "2.5 gal · 26.47 lb" },
    { k: "Shelf life", v: "2 years, closed, cool, dry and out of the sun" },
  ],
  note: "Shake before using. Keep out of reach of children.",
};

/** Para quem é e para quem não é: qualifica o lead e responde de antemão à objeção de trocar o programa de nitrogênio. */
export const fit = {
  heading: "Who it's for.",
  fits: {
    label: "A good fit",
    lead: "Aminosan® makes sense if you",
    items: [
      "Already make foliar passes and want amino acids to ride along",
      "Want amino acids from a plant source",
      "Grow row crops, vegetables, fruit or ornamentals",
      "Will leave an untreated check strip and compare",
    ],
  },
  notFit: {
    label: "Not the right fit",
    lead: "Look elsewhere if you want",
    items: [
      "A replacement for your nitrogen program",
      "A plant growth regulator or a hormone product",
      "A yield promise with no check strip beside it",
      "A reason for an extra trip across the field",
    ],
  },
  close: ["It's a foliar nutrient, not a fertility program.", "It rides in a pass you're already making."],
};

/** A faixa de teste: a resposta operacional para "vocês não têm dado americano". */
export const strip = {
  label: "How the trial strip works",
  heading: "Put it to the test on your ground.",
  steps: [
    { n: "01", title: "Pick a field with a foliar pass already planned.", body: "We send the product for one strip." },
    { n: "02", title: "Leave a strip untreated, under the same management.", body: "That strip is the whole experiment." },
    { n: "03", title: "Harvest both and compare.", body: "We come back to look at the numbers with you, whichever way they fall." },
  ],
  promise: ["No cost for the product on the strip.", "No obligation after harvest."],
  cta: { label: "Request a trial strip", href: "#trial-form" },
  alt: "Aerial view of a soybean field with a flagged trial strip",
};

/**
 * As perguntas (A11). A mais perigosa é "o que ele faz pela minha lavoura?",
 * onde a tentação de claim é máxima: a resposta devolve à prova, nunca ao
 * efeito.
 */
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
      q: "How is it different from a hydrolysate?",
      a: "Many amino acid products are hydrolysates, often from animal by-products and broken down with acid and heat. Aminosan® is plant-derived, made by enzymatic fermentation, and 100% free-form.",
      image: "/img/aminosan-b/season-soy.webp",
    },
    {
      q: "Will it fit my spray program?",
      a: "Use it alone or in the tank with a pass you've already planned. Follow the mixing order on the label and jar-test new combinations.",
      image: "/img/aminosan-b/season-sprayer.webp",
    },
    {
      q: "When should I apply it?",
      a: "It depends on the crop. Soybeans get a pass 25 to 30 days after germination and another before bloom, corn one before V8, vegetables one every 1 to 2 weeks. The window for each crop is on this page.",
      image: "/img/aminosan-b/season-corn.webp",
    },
    {
      q: "Does it contain hormones?",
      a: "No. Aminosan® is non-hormonal: free-form amino acids plus nitrogen, phosphate and potash.",
      image: "/img/aminosan-b/timing-hands.webp",
    },
    {
      q: "Decades in Brazil. Where's the U.S. data?",
      a: "Not in yet, and we won't pretend otherwise. That's why we offer a strip on your farm: your field, your check, your yield monitor.",
      image: "/img/aminosan-b/trial-strip.webp",
    },
    {
      q: "What will it do for my crop?",
      a: "We describe what's in the jug, not a result we can't show you. What it does on your ground is what a strip with an untreated check is for. We supply the product.",
      image: "/img/aminosan-b/proof-farmer.webp",
    },
    {
      q: "How much do I need?",
      a: "14 to 20 fl oz per acre on commodity crops and 14 fl oz per acre on vegetables, in a pass you're already making. For fruit, citrus and ornamentals, ask us.",
      image: "/img/aminosan-b/final-grower.webp",
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
