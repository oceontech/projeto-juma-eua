import type * as en from "../aminosan-c";

/**
 * Copy da LP C do Aminosan® em português, para revisão da Juma.
 * Mesmo formato de ../aminosan-c.ts; ver src/content/index.ts.
 */

export const hero: typeof en.hero = {
  tag: "Amostra · Aminosan®",
  heading: ["Olhe dentro", "da bombona."],
  body: "Um nutriente foliar de L-aminoácidos 100% livres, com nitrogênio, fosfato e potássio. Quatro leituras, e você vai saber exatamente o que essa frase quer dizer.",
  scroll: "Role para escanear",
  alt: "Uma bombona de Aminosan® em pé numa lavoura jovem de soja ao nascer do sol",
};

export const stages: typeof en.stages = [
  {
    id: "01",
    kicker: "A unidade",
    heading: "É disto que a lavoura constrói.",
    body: "Toda proteína que a planta produz — as enzimas, a maquinaria da fotossíntese, a estrutura que sustenta uma vagem — é montada a partir de aminoácidos. Vinte deles, e só em uma das duas formas espelhadas em que existem.",
    callouts: [
      { label: "Grupo amino", note: "NH₂ — a ponta do nitrogênio" },
      { label: "Grupo ácido", note: "COOH — a ponta carboxila" },
      { label: "Cadeia lateral", note: "R — o que faz um aminoácido ser diferente do outro" },
    ],
    readout: [
      { k: "Forma", v: "Livre" },
      { k: "Quiralidade", v: "L" },
      { k: "Origem", v: "Vegetal" },
    ],
  },
  {
    id: "02",
    kicker: "A cadeia",
    heading: "Aminoácidos podem chegar ainda ligados entre si.",
    body: "Num peptídeo eles vêm como um cordão: aminoácidos de verdade, unidos ponta a ponta. São um pacote — e cada ligação desse cordão é uma ligação que alguma coisa precisa abrir antes que uma única unidade entre numa proteína.",
    callouts: [
      { label: "Ligação peptídica", note: "O elo entre duas unidades" },
      { label: "Esqueleto", note: "N — Cα — C, repetido ao longo da cadeia" },
      { label: "Ainda unidos", note: "Nada aqui está livre" },
    ],
    readout: [
      { k: "Forma", v: "Ligada" },
      { k: "Unidades", v: "Em cadeia" },
      { k: "Pronto para uso", v: "Não" },
    ],
  },
  {
    id: "03",
    kicker: "Forma livre",
    heading: "Estes chegam já separados.",
    body: "O Aminosan® é 100% de forma livre. A proteína vegetal é desmontada por fermentação enzimática, um aminoácido de cada vez, e entregue assim — L-aminoácidos soltos, sem cadeias de peptídeos. Não sobra nada para abrir.",
    callouts: [
      { label: "100% livres", note: "Unidades soltas, sem ligação peptídica" },
      { label: "Só forma L", note: "A forma de que são feitas as proteínas da planta" },
      { label: "Não hormonal", note: "Aminoácidos mais N, P e K. Sem hormônios" },
    ],
    readout: [
      { k: "Forma", v: "Livre" },
      { k: "Unidades", v: "Soltas" },
      { k: "Pronto para uso", v: "Sim" },
    ],
  },
  {
    id: "04",
    kicker: "Entrega",
    heading: "Na folha, numa passada que você já faz.",
    body: "Foliar. Sozinho ou no tanque com o que já está no calendário, seguindo a ordem de mistura do rótulo. Nitrogênio, fosfato e potássio vão junto na mesma gota.",
    callouts: [
      { label: "Superfície da folha", note: "Onde a calda chega" },
      { label: "No tanque", note: "Sozinho ou em mistura — faça teste de jarro" },
      { label: "Sem passada extra", note: "Vai numa viagem que você já ia fazer" },
    ],
    readout: [
      { k: "Via", v: "Foliar" },
      { k: "Passadas", v: "0 a mais" },
      { k: "Leva", v: "N · P · K" },
    ],
  },
];

export const spec: typeof en.spec = {
  tag: "Especificação",
  heading: ["Tudo o que importa", "está impresso no rótulo."],
  body: "Aqui está em palavras simples. A dose da sua cultura, a ordem de mistura e a análise garantida completa estão na bombona — sempre leia e siga o rótulo.",
  rows: [
    { k: "Aminoácidos", v: "L-aminoácidos 100% livres" },
    { k: "Origem", v: "Vegetal" },
    { k: "Processo", v: "Fermentação enzimática" },
    { k: "Nutrientes", v: "Nitrogênio, fosfato, potássio" },
    { k: "Hormônios", v: "Nenhum" },
    { k: "Via", v: "Foliar — sozinho ou em mistura de tanque" },
  ],
};

export const window: typeof en.window = {
  tag: "Janela de aplicação",
  heading: ["Dentro das culturas", "que você já planta."],
  body: "Uma bombona, duas culturas e as pulverizações que já estão no seu calendário.",
  crops: [
    {
      name: "Soja",
      range: "V2–V3 → R5",
      note: "Dos estágios vegetativos iniciais até o enchimento de vagem.",
      marks: ["V2", "V3", "R1", "R3", "R5"],
      span: [0.08, 1],
    },
    {
      name: "Milho",
      range: "V2 → V8",
      note: "Na janela vegetativa inicial, junto de uma passada que você já faz.",
      marks: ["V2", "V4", "V6", "V8"],
      span: [0.08, 0.62],
    },
  ],
};

export const request: typeof en.request = {
  tag: "Pedido",
  heading: ["Teste nos", "seus acres."],
  body: "Escolha um talhão, deixe uma faixa testemunha ao lado e compare na colheita. Nós fornecemos o produto e um agrônomo para ajudar a escolher o talhão, o momento e a dose.",
  fields: {
    name: { label: "Nome completo", placeholder: "Seu nome" },
    email: { label: "E-mail", placeholder: "voce@fazenda.com" },
    state: { label: "Estado", placeholder: "Iowa" },
    crop: { label: "Cultura principal", placeholder: "Soja" },
  },
  call: "Quero falar com um agrônomo",
  submit: "Pedir uma faixa de teste",
  sending: "Enviando…",
  privacy: "Usamos seus dados para responder a este pedido e nada mais.",
  note: "O desempenho no campo varia com cultura, clima e manejo. Sempre leia e siga o rótulo.",
};
