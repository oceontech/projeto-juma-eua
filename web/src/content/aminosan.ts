/**
 * Copy da LP do Aminosan®, em inglês americano.
 *
 * Fonte primária: layout do Figma (JUMA-EUA · node 2:316 / 56:408). Onde o
 * Figma e o protótipo validado (site/aminosan.html) convergem, o texto é o
 * mesmo; onde divergem, este arquivo segue o Figma — inclusive nos números
 * de ensaio e no gráfico de economia por acre, que o protótipo tratava como
 * bloqueados por P9/P8. Ver docs/03-SITE.md para o histórico da pendência.
 *
 * Mesma regra do resto do projeto: número anda com a testemunha ao lado,
 * fonte impressa embaixo, dado brasileiro identificado como brasileiro.
 */

export const nitrogen = {
  heading: "Nitrogen is not an amino acid.",
  body: [
    "Nitrate in the soil is raw material, not finished product. Before nitrogen ends up in protein, the plant has to reduce it, aminate it and assemble it — a chain of steps that draws on carbon and energy the plant produced for something else.",
    "In a season with room to spare, that's simply how it works. In the weeks that set yield, it's a line item.",
  ],
  steps: ["Nitrate", "Aminate", "Protein"],
};

export const process = {
  eyebrow: "Aminosan® delivers free amino acids through the leaf — already in the form the plant uses.",
  heading: "Five steps, or one.",
  cards: {
    longWay: {
      label: "01 — The long way",
      formula: "NO₃⁻ → NO₂⁻ → NH₄⁺ → glutamate → amino acid",
      body: "Nitrate to nitrite, nitrite to ammonium, ammonium into glutamate, and glutamate into the amino acid the plant actually needs.",
    },
    shortWay: {
      label: "02 — The short way",
      body: "Immediate amino acid delivery. Free amino acids applied to the leaf, in the form the plant uses.",
    },
    whatsInIt: {
      label: "03 — What's in it",
      body: "Plant-derived free amino acids with N, P and K. Enzymatic fermentation.",
    },
  },
  cta: { label: "See the technical data", href: "#product-analysis" },
};

export const delivery = {
  eyebrow: "Juma-Agro Fertilizer LLC · Lakeland, Florida",
  heading: ["Two delivery paths.", "One delivers. The other doesn't."],
  longRoute: {
    label: "The long route",
    tagline: "What plants lose in translation.",
    steps: [
      { formula: "NO₃⁻", icon: "/img/aminosan/icon-nitrate.svg", label: "Nitrate" },
      { formula: "NO₂", icon: "/img/aminosan/icon-nitrite.svg", label: "Nitrite" },
      { formula: "NH₄⁺", label: "Ammonium" },
      { icon: "/img/aminosan/icon-glutamate.webp", label: "Glutamate" },
      { icon: "/img/aminosan/icon-amino-acid.webp", label: "Amino Acid" },
    ] satisfies { formula?: string; icon?: string; label: string }[],
    result: "Multiple steps. More energy. More loss.",
  },
  shortRoute: {
    label: "The short route",
    tagline: "What plants use. From the start.",
    stepLabel: "Free Amino Acids",
    result: "No conversion. No waste. Maximum efficiency.",
  },
};

export const comparison = {
  tagline: "Free amino acids. Real nutrition. Real results.",
  heading: "Not all amino acids are created equal.",
  columns: { aminosan: "Aminosan", others: "Other products (general category)" },
  rows: [
    { label: "Origin", aminosan: "Vegetal", others: "Animal Hydrolysate" },
    { label: "Process", aminosan: "Enzymatic Fermentation", others: "Acid Hydrolysis" },
    { label: "Form", aminosan: "Free Amino Acids", others: "Peptide Chains" },
  ],
};

export const operationalBenefits = {
  heading: "What it does for the operation.",
  description: "Four practical answers, in the order a grower asks them.",
  cards: [
    {
      n: "01",
      accent: "#257a44",
      heading: "Goes in with the insecticide you already bought",
      body: "Compatible in tank mix. No separate pass, no extra diesel, no new weather window.",
      image: "/img/aminosan/benefit-product.webp",
    },
    {
      n: "02",
      accent: "#b7c73e",
      heading: "Provides building blocks the plant can use right away",
      body: "Free amino acids ready for immediate absorption and use.",
      icon: "/img/aminosan/icon-benefit-02.svg",
    },
    {
      n: "03",
      accent: "#257a44",
      heading: "Supports better nutrition under stress conditions",
      body: "Helps the plant perform better under drought, heat, and pressure.",
      icon: "/img/aminosan/icon-benefit-03.svg",
    },
    {
      n: "04",
      accent: "#b7c73e",
      heading: "Helps you protect yield potential and results",
      body: "Better efficiency, better performance, better returns on what you invest.",
      icon: "/img/aminosan/icon-benefit-04.svg",
    },
  ] satisfies { n: string; accent: string; heading: string; body: string; image?: string; icon?: string }[],
};

export const trialResults = {
  tagline: "Real trials. Real fields. Real results.",
  heading: "What we can show you today.",
  description:
    "We have soybean trial results from two Brazilian institutions — DETEC in Taquarivaí and Terras Gerais in Lavras.",
  notice: {
    label: "Why some numbers aren't shown yet",
    heading: "Every number on this site carries its untreated check.",
    body: "We're not publishing these until we can put the check beside them, because that's the rule for every number on this site. Ask us and we'll send what we have, in full.",
    cta: "See the technical data",
  },
  table: {
    title: "Soybean trial results",
    subtitle: "Yield difference (treated vs check)",
    columns: ["Crop", "Location", "Treated", "Check", "Difference", "Source"],
    rows: [
      { crop: "Soybeans", location: "Taquarivaí, SP", treated: "—", check: "—", difference: "+1.1 sc/ha", source: "DETEC" },
      { crop: "Soybeans", location: "Taquarivaí, SP", treated: "—", check: "—", difference: "+1.4 sc/ha", source: "DETEC" },
      { crop: "Soybeans", location: "Lavras, MG", treated: "—", check: "—", difference: "+1.0 sc/ha", source: "Terras Gerais" },
    ],
    disclaimer: "Results from field trials conducted in Brazil. Field performance varies with climate, soil and management.",
  },
};

export const trialEvidence = {
  tagline: "Until all numbers can be published, the plots can be shown.",
  cards: [
    {
      label: "Aminosan®",
      body: "The same two shots over the treated plot — same altitude, same lens, same day, cut to the same length.",
    },
    {
      label: "Untreated check",
      body: "Drone pass over the check plot of the DETEC or Terras Gerais soybean trial, plus a ground-level shot of the pod load on the same day.",
    },
  ],
};

export const economics = {
  heading: ["Run the number", "on your acres."],
  description:
    "We publish cost per acre next to yield response, not one without the other. Both numbers are being confirmed for the U.S. market — ask us and we'll send them as soon as they're set.",
  intro: {
    eyebrow: "Aminosan® economics",
    heading: ["Yield response vs.", "product cost"],
    body: "We've committed to showing both sides of the equation. See the difference that drives your return.",
  },
  chart: {
    title: "Dollars per acre",
    hint: "More is better →",
    bars: [
      { label: "Yield response", tag: "[P9 response]", swatch: "#0e1b14" },
      { label: "Product cost", tag: "[P8 cost]", swatch: "#0f522a" },
      { label: "Difference", tag: "(net return)", swatch: "#b7c73e" },
    ],
    pending: "Pending confirmation",
  },
};

export const companyStory = {
  eyebrow: "1988 · Mogi Guaçu, São Paulo",
  heading: "Older than the company that makes it.",
  body: [
    "Julio Matino formulated Aminosan® in the late 1970s, before there was a company to sell it. Growers in São Paulo bought it because it worked, and the demand built the business.",
    "Four decades later, trust in its performance remains at the core. It wasn't developed to follow trends. For growers and distributors, it continues to be one of the best-in-class solutions.",
  ],
  cta: { label: "Read the Brazil story", href: "#" },
};

export const growthStages = {
  heading: "When it goes in.",
  description:
    "Alone or in the pass you're already making. Soybeans and corn are the two crops positioned for the U.S. today; cotton and specialty crops are under technical review.",
  guidelines: [
    {
      n: "01",
      label: "Window",
      title: "Soybeans V2–V3 → R5\nCorn V2 → V8",
      body: "Alone or in tank mix, following the technical recommendation. Cotton and specialty crops: under technical review for U.S. conditions.",
      image: "/img/aminosan/guideline-soybean-leaf.webp",
      dark: true,
    },
    {
      n: "02",
      label: "Rate",
      title: "[P4] fl oz/ac",
      body: "Rate per acre and number of applications come from the U.S. label.",
      image: "/img/aminosan/guideline-leaf-droplet.webp",
      dark: true,
    },
    {
      n: "03",
      label: "Tank mix",
      title: "Jar-test first",
      body: "Mixing order is on the label. Jar-test any combination you haven't run before.",
      image: "/img/aminosan/guideline-tank-mixing.webp",
      dark: false,
    },
  ],
  timeline: {
    vegetative: ["V2", "V4", "V6"],
    reproductive: ["R1", "R3", "R5"],
    /** Recorte do sprite único de estágios — % calculado a partir do node do Figma. */
    spritePosition: { V2: "5.5% 50%", V4: "12.3% 50%", V6: "12.3% 50%", R1: "12.3% 50%", R3: "19.1% 50%", R5: "19.1% 50%" },
  },
};

export const guaranteedAnalysis = {
  heading: "Guaranteed analysis",
  description: "Everything below comes from the U.S. label. Until it exists, this section stays empty rather than approximate.",
};

export const productAnalysis = {
  metrics: [
    { label: "Total Nitrogen (N)", value: "10.00%", tag: "[P1 – P3]", priority: false },
    { label: "Available Phosphate (P₂O₅)", value: "5.00%", tag: "[P3]", priority: false },
    { label: "Free amino acids (%)", value: "1.20%", tag: "[P3 – priority]", priority: true },
    { label: "Soluble Potash (K₂O)", value: "5.00%", tag: "[P3]", priority: false },
    { label: "Organic carbon (%)", value: "1.00%", tag: "[P3]", priority: false },
  ],
  documents: [
    { label: "Request the label (PDF)", href: "#trial-request", filled: true },
    { label: "Request the SDS", href: "#trial-request", filled: false },
  ],
};

export const faq = {
  eyebrow: "FAQ",
  heading: "The questions we get first.",
  description:
    "Straightforward answers about formulation, performance and registration in the U.S. The full guaranteed analysis is on label.",
  items: [
    {
      question: "What's the difference between this and a hydrolysate?",
      answer:
        "Source, process and form — plant-derived, enzymatic fermentation, free amino acids rather than peptide chains. The full guaranteed analysis is on the label.",
      openByDefault: true,
    },
    {
      question: "Forty years and no U.S. data?",
      answer:
        "Not yet — and we'd rather say so than dodge it. That's what the trial strip is for: your field, your check strip, your yield monitor. We supply the product.",
    },
    {
      question: "Can I tank mix it?",
      answer:
        "Yes, alone or in mix, following the mixing order on the label. Jar-test any combination you haven't run before.",
    },
    {
      question: "Is this OMRI listed?",
      answer: "Not confirmed yet for the U.S. market — ask us and we'll follow up as soon as it's set.",
    },
    {
      question: "What does it actually do for my crop?",
      answer:
        "It supplies free amino acids and N-P-K through the leaf. What we can show you is trial data with the untreated check beside it — ask and we'll send the reports.",
    },
  ],
};

export const trialRequest = {
  heading: ["Forty years of trials.", "Now run one of your own."],
  description:
    "Pick a field, leave an untreated check strip beside it, and we'll come back at harvest with you — we supply the product. Tell us your crop and your state and we'll send the label, rates in fl oz per acre, and the trial reports for what you grow.",
  fields: {
    name: { label: "Full name", placeholder: "Enter your full name" },
    email: { label: "Email", placeholder: "Enter your email" },
    state: { label: "State", placeholder: "Iowa" },
    crop: { label: "Primary crop", placeholder: "Corn" },
  },
  call: "I'd like a call from an agronomist",
  submit: "Send Request",
  privacy: { before: "By sending this, you agree to our ", link: "Privacy Policy", after: ". We use your information to answer this request and nothing else." },
};

export const hero = {
  eyebrow: "Plant-derived free amino acids · Enzymatic fermentation",
  heading: "AMINOSAN",
  card: {
    eyebrow: "Plant-derived free amino acids + enzymatic fermentation",
    title: "The plant can build amino acids. Or you can hand it the finished ones.",
    body: "Aminosan® is a foliar fertilizer of plant-derived free amino acids with N, P and K, produced by enzymatic fermentation. It has been in the field longer than the company that makes it.",
    ctas: [
      { label: "Run a trial strip", href: "#trial-request" },
      { label: "See the trials", href: "#trial-results" },
    ],
  },
  stats: [
    { value: "40", label: "years in the field", icon: "generic" },
    { value: "1988", label: "the company came after", icon: "1988" },
    {
      value: "Enzymatic Fermentation",
      label: "Better absorption. Better results",
      icon: "fermentation",
    },
    { value: "2", label: "Named-source. Soybean trials", icon: "generic" },
  ],
  tagline: "DETEC · Terras Gerais · Brazil · Yields publish when the check arrives [P9]",
} satisfies {
  eyebrow: string;
  heading: string;
  card: {
    eyebrow: string;
    title: string;
    body: string;
    ctas: { label: string; href: string }[];
  };
  stats: { value: string; label: string; icon: "generic" | "1988" | "fermentation" }[];
  tagline: string;
};
