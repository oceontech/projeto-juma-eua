/**
 * Copy da home, em inglês americano.
 *
 * O PRD dispensa CMS na v1: são três páginas de edição rara, e conteúdo em
 * TypeScript dá tipo, diff legível e revisão por pull request.
 *
 * Regra do projeto que vale aqui: todo número anda com a testemunha ao lado,
 * toda fonte é impressa embaixo, e dado brasileiro é identificado como
 * brasileiro. Ver README da raiz.
 *
 * Marcadores [P__] são pendências abertas com a Juma — ver docs/04-PENDENCIAS.md.
 */

export type NavLink = { label: string; href: string };

export const nav = {
  left: [
    { label: "Homepage", href: "/" },
    { label: "Contact us", href: "#us-operation" },
  ] satisfies NavLink[],
  right: [
    { label: "Aminosan®", href: "/aminosan" },
    { label: "KMEP Ultra®", href: "/kmep-ultra" },
  ] satisfies NavLink[],
  cta: { label: "Get a Free Trial", href: "#us-operation" },
};

export const hero = {
  tagline: "Juma-Agro Fertilizer LLC · Lakeland, Florida",
  headline: "Proven where the harvest never stops.",
  subheadline:
    "In Brazil, the farmer harvests two to three crops from the same plot each year. There is no winter to reset the field. Our foliar nutrition has been tested in this for 38 years, trial after trial, with the witness alongside.",
  tractorAlt:
    "Tractor pulling an implement through a soybean field at sunrise",
};

export const brazil = {
  title: "Brazil is the credential, not the caveat.",
  history: {
    badge: "1988",
    year: "1988",
    title: "The product came first",
    body: "Julio Matino formulated Aminosan before there was a company to sell it. Growers in Sao Paulo bought it because it worked, and the demand built the business.",
    author: { name: "Júlio Matino", role: "Co Founder of Metrilo" },
  },
  metrics: [
    {
      value: "12",
      label: "Months of pressure a year",
      body: "No winter to reset the field. Heat stress as routine, and a dry spell that lands in the middle of grain fill.",
    },
    {
      value: "40",
      label: "Years on tropical agriculture",
      body: "An asset no U.S. biostimulant company has. We’re not asking you to overlook where this came from. We’re asking you to look at it.",
    },
  ],
};

export const proof = {
  headline: ["Brazilian agronomy,", "now working on", "American ground."],
  body: "Nearly four decades of foliar nutrition built in the hardest growing conditions in commercial agriculture — two and three crops a year, heat as routine, no winter to reset the field. That expertise now crosses to your acres: more efficiency out of every pass you already make, more yield out of the stand you already have, and a bigger margin at the end of the season.",
  compare: {
    beforeLabel: "Untreated check",
    afterLabel: "Treated",
    beforeAlt: "Untreated check strip: thin, browning stand",
    afterAlt: "Treated strip: dense, closed canopy",
  },
  benefits: [
    { title: "Efficiency", body: "More work per pass." },
    { title: "Productivity", body: "Visible gains in weeks." },
    { title: "Profitability", body: "More yield, better margin." },
  ],
};

export const expertise = {
  headline: ["Two products.", "One job each."],
  body: "A company with thirteen products bringing two to the U.S. is making a choice. Here is what each one is for.",
};

export type Product = {
  id: "kmep" | "aminosan";
  category: string;
  title: string;
  body: string;
  href: string;
  image: { src: string; alt: string };
};

export const products: Product[] = [
  {
    id: "kmep",
    category: "Insecticide partner · Foliar potassium",
    title: "KMEP Ultra®",
    body: "It goes in the tank with your insecticide and drives the target out of hiding, so the spray you already paid for actually reaches it.",
    href: "/kmep-ultra",
    image: { src: "/img/pack-kmep.webp", alt: "KMEP Ultra containers" },
  },
  {
    id: "aminosan",
    // "AMIND" está assim no Figma — ver a nota de pendências no README de web/.
    category: "Free amind acids",
    title: "Aminosan®",
    body: "The building blocks, delivered ready to use. In the field for 40 years.",
    href: "/aminosan",
    image: { src: "/img/pack-aminosan.webp", alt: "Aminosan containers" },
  },
];

export type Crop = { id: string; name: string; body: string; image: string };

export const crops = {
  headline: "Find the right crop for your state.",
  body: "Explore the crops we support across different growing conditions. Hover a card to bring it forward and see the crop in focus.",
  /* A ordem é a do leque, da esquerda para a direita. A carta do meio é a
     que abre em foco. */
  cards: [
    {
      id: "cotton",
      name: "Cotton",
      body: "A major source of sugar and renewable products.",
      image: "/img/crop-cotton.webp",
    },
    {
      id: "corn",
      name: "Corn",
      body: "Cultivated in tropical regions around the world.",
      image: "/img/crop-corn.webp",
    },
    {
      id: "soybean",
      name: "Soybean",
      body: "Versatile, resistant, and essential to feeding the world.",
      image: "/img/crop-soybean.webp",
    },
    {
      id: "coffee",
      name: "Coffee",
      body: "Cultivated in tropical regions around the world.",
      image: "/img/crop-coffee.webp",
    },
    {
      id: "sugarcane",
      name: "Sugarcane",
      body: "A major source of sugar and renewable products.",
      image: "/img/crop-sugarcane.webp",
    },
  ] satisfies Crop[],
};

export type Program = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  tags?: string[];
  note?: string;
  closing?: string[];
};

export const programs = {
  headline: ["Three fronts", "behind the jug."],
  body: "A product is the end of a process. These are the three programs that run all year and produce: it research, open doors, and a team that meets face to face.",
  cards: [
    {
      id: "desata",
      eyebrow: "Research · Since 2021",
      title: "DESATA Project",
      body: "Application technology research with UENP and with NITEC, the application technology and agricultural machinery lab at UNESP — wind tunnel work on droplet spectrum, drift and deposition. Application technology is a research program here, not a tagline.",
      tags: ["UENP", "NITEC/UNESP", "Wind tunnel"],
      note: "Naming the institutions depends on authorization · [P19]",
    },
    {
      id: "experience",
      eyebrow: "Open doors · One-day immersion",
      title: "Juma Experience",
      body: "Growers, dealers and partners spend a day inside the operation: the company’s history, the production floor, the in-house quality lab, logistics — and a conversation with the founder, who tells how he formulated Aminosan almost forty years ago. Anyone who wants to check what we say can come and look.",
      closing: [
        "Those who live it, understand it.",
        "Those who understand it, produce more.",
      ],
    },
    {
      id: "juma360",
      eyebrow: "The team · Four days, once a year",
      title: "Juma 360",
      body: "A four-day convention that brings the Juma team together from every region of Brazil — agronomists, sales and technical staff in the same room, going over what worked in the field, what didn’t, and what the next season asks for. The agronomy that reaches the U.S. was argued out there first.",
      note: "Start year and number of editions · [P32]",
    },
  ] satisfies Program[],
};

export const trialStrip = {
  eyebrow: "Our trial strip method",
  headline: "Run a trial strip on your own acres. We supply the product.",
  body: "Pick a field. Leave an untreated check strip beside it. We bring the product and come back at harvest with you. Your result, on your acres, against your own check.",
  steps: [
    {
      number: "01",
      title: "Efficiency",
      body: "One field, one pass, the crop you already planned. Nothing changes in your program.",
    },
    {
      number: "02",
      title: "Leave the check",
      body: "An untreated strip beside it. That is the whole method — the same one used on every number on this site.",
    },
    {
      number: "03",
      title: "Read it at harvest",
      body: "Yield monitor data, side by side. The number is yours either way — because you ran the trial",
    },
  ],
};

export const usOperation = {
  eyebrow: "U.S. Operation",
  headline: "Run a trial strip on your own acres. We supply the product.",
  body: "Pick a field. Leave an untreated check strip beside it. We bring the product and come back at harvest with you. Your result, on your acres, against your own check.",
  form: {
    name: { label: "Full name", placeholder: "Enter your full name" },
    company: { label: "Farm or company", placeholder: "Enter farm or company" },
    state: {
      label: "State",
      options: ["Iowa", "Illinois", "Nebraska", "Minnesota", "Indiana", "Kansas", "Other"],
    },
    crop: {
      label: "Primary crop",
      options: ["Corn", "Soybean", "Cotton", "Coffee", "Sugarcane"],
    },
    acres: {
      label: "Acres",
      options: ["< 500", "500 – 1,500", "1,500 – 5,000", "> 5,000"],
    },
    email: { label: "Email", placeholder: "Enter your email" },
    problem: {
      label: "What are you trying to solve?",
      placeholder: "Tell us what you’re looking to improve or solve",
    },
    call: "I’d like a call from an agronomist",
    submit: "Send Request",
    privacy: {
      before: "By sending this, you agree to our ",
      link: "Privacy Policy",
      after:
        ". We use your information to answer this request and nothing else.",
    },
  },
  contact: {
    name: "Juma-Agro Fertilizer LLC",
    address: ["3928 Anchuca Drive, Suite 11", "Lakeland, FL 33811"],
    body: "Product, agronomic support and orders for the U.S. market. Contact name, phone and hours pending P11.",
  },
  alternatives: {
    title: "Not ready for a strip?",
    actions: [
      {
        id: "label",
        label: "Get the label and rate sheet",
        icon: "/img/icon-doc.svg",
        href: "#",
      },
      {
        id: "agronomist",
        label: "Talk to an agronomist",
        icon: "/img/icon-call.svg",
        href: "#",
      },
    ],
    disclaimer:
      "The second option only goes live if the U.S. team includes an agronomist — P11.",
  },
};

export const footer = {
  brand: { name: "Juma-Agro", suffix: "Fertilizer LLC" },
  address: "3928 Anchuca Drive, Suite 11 · Lakeland, FL 33811",
  parent:
    "A subsidiary of Juma Agro — family-run in Mogi Guaçu, Brazil, since 1988.",
  columns: [
    {
      title: "Products",
      links: [
        { label: "KMEP Ultra®", href: "/kmep-ultra" },
        { label: "Aminosan®", href: "/aminosan" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#brazil" },
        { label: "Programs", href: "#programs" },
        { label: "Trials", href: "#method" },
        { label: "Contact", href: "#us-operation" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Use", href: "#" },
      ],
    },
  ],
  disclaimer:
    "Trial results shown on this site come from field trials conducted in Brazil. Field performance varies with climate, soil and management. Always read and follow the label.",
  copyright: "© 2026 Juma-Agro Fertilizer LLC.",
};
