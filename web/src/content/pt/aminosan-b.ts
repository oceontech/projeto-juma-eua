import type * as en from "../aminosan-b";

/**
 * Copy da LP B do Aminosan® em português, para revisão da Juma.
 * Mesmo formato de ../aminosan-b.ts; ver src/content/index.ts.
 */

export const hero: typeof en.hero = {
  eyebrow: "L-aminoácidos 100% livres",
  heading: "Aminoácidos, prontos.",
  aside: {
    heading: ["Direto na folha.", "Pronto para trabalhar."],
    body: "O Aminosan® é um nutriente foliar de L-aminoácidos 100% livres com N, P e K. De origem vegetal, feito por fermentação enzimática e aplicado na passada que você já faz.",
  },
  badge: "nutriente foliar",
  alt: "Uma bombona de Aminosan® em pé numa lavoura jovem de soja ao nascer do sol",
};

export const origin: typeof en.origin = {
  panels: [
    {
      eyebrow: "Dentro de toda lavoura",
      heading: "Nenhuma planta recebe um aminoácido pronto.",
      body: "Ela constrói cada um deles, a partir do nitrogênio bruto, numa linha que roda a safra inteira. É essa linha, uma etapa por vez.",
      caption: "Assimilação de nitrogênio, simplificada",
    },
    {
      eyebrow: "Etapa um",
      heading: "Começa como nitrato.",
      body: "O que a raiz absorve é NO₃⁻ — um nitrogênio preso a três oxigênios. É a forma em que o nitrogênio circula, e ainda não é nada que a planta consiga usar para construir.",
      caption: "NO₃⁻ · nitrato",
    },
    {
      eyebrow: "Etapas dois e três",
      heading: "Duas reduções até o amônio.",
      body: "De nitrato a nitrito, de nitrito a amônio. Duas enzimas, duas conversões, e as duas são pagas com energia e carbono que a lavoura produziu na folha.",
      caption: "NH₄⁺ · amônio",
    },
    {
      eyebrow: "Etapa quatro",
      heading: "E só agora, um aminoácido.",
      body: "O amônio entra no glutamato, e o glutamato repassa ao aminoácido que a lavoura estava construindo. Quatro conversões, e a lavoura pagou por todas elas.",
      caption: "L-aminoácido · NH₂ — CH(R) — COOH",
    },
  ],

  route: {
    label: "A rota que a lavoura percorre",
    steps: ["NO₃⁻", "NO₂⁻", "NH₄⁺", "Glu", "AA"],
    lit: [0, 1, 3, 5],
    shortcut: {
      label: "A rota com o Aminosan®",
      from: "Aminosan®",
      note: "Entregue como o aminoácido pronto: 100% livre, forma L, de origem vegetal.",
    },
  },
};

export const specimen: typeof en.specimen = {
  steps: ["A peça", "Ligadas", "Livres", "Na folha"],
  stepOf: "Etapa",
  stages: [
    {
      kicker: "A peça",
      heading: "Isto é um aminoácido.",
      body: "Toda proteína que a planta faz — as enzimas, a folha, a vagem — é montada com peças pequenas como esta. São vinte tipos, e cada um leva nitrogênio numa das pontas.",
      legend: [{ tone: 1, label: "Nitrogênio" }],
      callouts: [
        { label: "Ponta do nitrogênio", note: "NH₂ — o grupo amino" },
        { label: "Ponta ácida", note: "COOH — a outra ponta" },
        { label: "Cadeia lateral", note: "A parte que diferencia um tipo do outro" },
      ],
      readout: [
        { k: "O que é", v: "Uma peça" },
        { k: "Tipos", v: "20" },
        { k: "Leva", v: "Nitrogênio" },
      ],
    },
    {
      kicker: "Ligadas",
      heading: "Os aminoácidos podem vir ligados numa corrente.",
      body: "Presos ponta a ponta, eles se chamam peptídeos. Cada elo âmbar é uma ligação que precisa ser aberta antes de uma única peça poder ser usada.",
      legend: [
        { tone: 2, label: "Elo a abrir" },
        { tone: 1, label: "Nitrogênio" },
      ],
      callouts: [
        { label: "Elo", note: "A ligação entre dois aminoácidos" },
        { label: "Corrente", note: "Peças ainda presas umas às outras" },
        { label: "Ainda não livre", note: "Nenhuma peça aqui está sozinha" },
      ],
      readout: [
        { k: "Peças", v: "Presas" },
        { k: "Elos", v: "A abrir" },
        { k: "Pronto para uso", v: "Ainda não" },
      ],
    },
    {
      kicker: "Forma livre",
      heading: "O Aminosan® entrega as peças já separadas.",
      body: "100% livre. A proteína vegetal é desmontada por fermentação enzimática em L-aminoácidos individuais — sem correntes, sem elo nenhum para abrir.",
      legend: [{ tone: 1, label: "Nitrogênio" }],
      callouts: [
        { label: "Peças soltas", note: "Sem ligações peptídicas" },
        { label: "Só forma L", note: "A forma com que as proteínas vegetais são feitas" },
        { label: "Sem hormônios", note: "Aminoácidos mais N, P e K" },
      ],
      readout: [
        { k: "Peças", v: "Soltas" },
        { k: "Elos", v: "Nenhum" },
        { k: "Pronto para uso", v: "Sim" },
      ],
    },
    {
      kicker: "Na folha",
      heading: "Pulverizado na folha, numa passada que você já faz.",
      body: "Foliar, sozinho ou no tanque com o que já está no calendário — siga a ordem de mistura do rótulo. Nitrogênio, fósforo e potássio vão na mesma gota.",
      legend: [{ tone: 1, label: "Gota da pulverização" }],
      callouts: [
        { label: "A folha", note: "Onde a calda pousa" },
        { label: "Gota", note: "Aminoácidos mais N, P e K" },
        { label: "Sem viagem extra", note: "Vai numa passada que você já faz" },
      ],
      readout: [
        { k: "Aplicação", v: "Na folha" },
        { k: "Passadas extras", v: "0" },
        { k: "Leva", v: "N · P · K" },
      ],
    },
  ],
};

export const field: typeof en.field = {
  headline: ["E qual a diferença real", "na lavoura?"],
  body: "Da folha à raiz, acompanhe cada detalhe.",
  chapters: [
    {
      kicker: "A folha",
      heading: "Verde mais profundo, folha mais cheia.",
      body: "Um olhar de perto para a cor e o corpo da folha.",
      alt: "Folha trifoliolada de soja, verde profundo e cheia, ao nascer do sol",
    },
    {
      kicker: "A planta",
      heading: "Mais planta no mesmo estágio.",
      body: "Altura, caule e dossel entram em foco.",
      alt: "Planta jovem de soja, com folhas maiores e verde profundo",
    },
    {
      kicker: "Debaixo da terra",
      heading: "E, sob o solo, mais raiz.",
      body: "A parte que ninguém vê: raiz principal mais funda e mais raízes laterais explorando o solo.",
      alt: "Raiz de soja isolada com raiz principal longa e ramificações finas",
    },
  ],
};

export const problem: typeof en.problem = {
  image: {
    heading: "A maior parte do nitrogênio chega inacabada.",
    body: "O nitrato do solo ou do adubo é matéria-prima. Antes de virar proteína, a planta precisa reduzi-lo, aminá-lo e montá-lo, e cada etapa gasta energia que a lavoura produziu para folha, vagem e grão.",
    alt: "Planta jovem de milho ao amanhecer",
  },
  stat: {
    value: 4,
    heading: "conversões separam o nitrato de um aminoácido que a sua lavoura consegue usar.",
    source: "Assimilação de nitrogênio nas plantas, simplificada.",
  },
  chain: [
    { formula: "NO₃⁻", name: "Nitrato" },
    { formula: "NO₂⁻", name: "Nitrito" },
    { formula: "NH₄⁺", name: "Amônio" },
    { formula: "Glu", name: "Glutamato" },
    { formula: "AA", name: "Aminoácido" },
  ],
};

export const converge: typeof en.converge = {
  heading: "E se a sua lavoura pulasse a linha de montagem?",
  aside: {
    heading: ["Nós entregamos", "a parte pronta."],
    body: "O Aminosan® leva L-aminoácidos livres à folha, já na forma que a planta usa para montar proteína. Sem conversão para esperar, sem desvio pelo solo.",
    cta: { label: "Veja como funciona", href: "#meet" },
  },
  routes: {
    label: "O caminho da própria lavoura: do nitrato do solo aos aminoácidos",
    steps: ["Nitrato", "Nitrito", "Amônio", "Glutamato", "Aminoácidos"],
    with: {
      label: "Com Aminosan®",
      note: "Aplicado na folha, direto aos aminoácidos",
      jugAlt: "Bombona do Aminosan®",
    },
    conversion: "Cada conversão gasta a energia da lavoura",
  },
  cards: [
    {
      title: "100% livres",
      body: "L-aminoácidos soltos, sem cadeias de peptídeos. Não sobra nada para a planta cortar.",
    },
    {
      title: "N, P e K juntos",
      body: "Nitrogênio, fósforo e potássio vão junto na mesma aplicação.",
    },
    {
      title: "Não hormonal",
      body: "Sem hormônios na fórmula: aminoácidos mais N, P e K.",
    },
  ],
};

export const meet: typeof en.meet = {
  heading: "Conheça o Aminosan®",
  intro: "Da bombona à folha, em cinco passos.",
  pauseVideo: "Pausar vídeo",
  playVideo: "Reproduzir vídeo",
  stages: [
    {
      n: "01",
      title: "Despeje no tanque",
      body: "Direto no pulverizador. Sem equipamento novo, sem viagem a mais pela lavoura.",
    },
    {
      n: "02",
      title: "Entra no seu manejo",
      body: "Sozinho ou com os produtos que você já aplica. Siga a ordem de mistura do rótulo.",
    },
    {
      n: "03",
      title: "Cada gota leva",
      body: "L-aminoácidos 100% livres com N, P e K, espalhados na calda que você já aplica.",
    },
    {
      n: "04",
      title: "Pronto para usar",
      body: "Aminoácidos soltos, sem cadeias de peptídeos. Não sobra nada para a planta quebrar.",
    },
    {
      n: "05",
      title: "Na folha",
      body: "Aplicado, absorvido pela folha e usado como chega.",
    },
  ],
  cta: { label: "Veja onde entra", href: "#season" },
};

export const cell: typeof en.cell = {
  eyebrow: "Dentro da folha",
  stages: [
    {
      kicker: "Além da superfície",
      title: "Onde os aminoácidos trabalham.",
      body: "Cada célula da folha está construindo alguma coisa: enzimas, as proteínas que fazem a fotossíntese, a maquinaria que produz clorofila. Tudo isso é montado a partir de aminoácidos.",
    },
    {
      kicker: "Os blocos de construção",
      value: "20",
      title: "aminoácidos formam todas as proteínas que a planta constrói.",
      body: "O Aminosan® entrega aminoácidos livres, um a um, para entrarem direto na construção em vez de serem produzidos do zero.",
    },
    {
      kicker: "A forma certa",
      value: "L-",
      title: "a forma presente nas proteínas da própria planta.",
      body: "Os aminoácidos existem em duas formas espelhadas, e as células vegetais constroem com a forma L. É a única forma na bombona: L-aminoácidos 100% livres.",
    },
  ],
  alt: "Zoom macro de uma folha até as suas células",
};

export const proof: typeof en.proof = {
  heading: ["Provado no campo.", "Aprovado pelo produtor."],
  alt: "Produtor conferindo a lavoura de soja no fim da tarde",
  stats: [
    { value: 100, suffix: "%", label: "L-aminoácidos livres" },
    { value: 4, suffix: "", label: "etapas de conversão que a lavoura pula" },
    { value: 0, suffix: "", label: "passadas extras: vai junto na pulverização" },
    { value: 40, suffix: "+", label: "anos de safras no campo" },
  ],
  note: "O desempenho no campo varia com cultura, clima e manejo. Sempre leia e siga o rótulo.",
};

export const timing: typeof en.timing = {
  heading: "Feito para as semanas que decidem a produtividade.",
  body: [
    "Florada, pegamento, enchimento de grão. A demanda da lavoura por nitrogênio chega ao pico justo quando o calor e os veranicos dificultam mais a vida da raiz.",
    "O Aminosan® leva aminoácidos à folha nessas semanas, na forma que a planta usa, para que o nitrogênio dela não fique esperando o solo.",
  ],
  cta: { label: "Planeje sua aplicação", href: "#trial-form" },
  alt: "Mãos segurando uma planta de soja com vagens cheias",
};

export const season: typeof en.season = {
  heading: ["Feito para as culturas", "que você planta para vender."],
  intro: "Uma bombona para frutas vermelhas, hortaliças e citros, nas passadas de pulverização que já estão no seu calendário.",
  cards: [
    {
      tag: "Frutas vermelhas",
      title: "Morango",
      body: "Sozinho ou em mistura de tanque, nas passadas que já fazem parte da sua safra de inverno.",
      image: "/img/aminosan-b/cut-strawberry-v2.webp",
      alt: "Planta de morango com frutos maduros e raízes",
    },
    {
      tag: "Hortaliças",
      title: "Tomate",
      body: "Encaixa no programa de fertilidade e pulverização que você já roda. Dose e época definidas com o seu agrônomo.",
      image: "/img/aminosan-b/cut-tomato-v2.webp",
      alt: "Planta de tomate com frutos maduros e raízes",
    },
    {
      tag: "Pomares",
      title: "Citros",
      body: "Vai na passada foliar que você já faz no pomar. Dose e época definidas com o seu agrônomo.",
      image: "/img/aminosan-b/cut-citrus-v2.webp",
      alt: "Citros jovem com laranjas e raízes",
    },
  ],
};

export const inside: typeof en.inside = {
  label: {
    heading: ["O que tem em", "cada bombona."],
    body: "Tudo o que importa está impresso no rótulo. Aqui, em palavras simples.",
    alt: "Rótulo do Aminosan em detalhe",
    facts: [
      { k: "Aminoácidos", v: "L-aminoácidos 100% livres" },
      { k: "Origem", v: "Vegetal" },
      { k: "Processo", v: "Fermentação enzimática" },
      { k: "Nutrientes", v: "Nitrogênio, fósforo, potássio" },
      { k: "Hormônios", v: "Nenhum" },
    ],
  },
  notes: [
    { label: "Faixa de teste grátis", body: "Produto para uma faixa na sua fazenda, com a testemunha sem tratamento ao lado." },
    { label: "Agrônomo à disposição", body: "Ajuda para escolher o talhão, a época e a dose." },
  ],
  heading: ["Coloque à prova", "na sua terra."],
  body: "Escolha um talhão, deixe uma faixa testemunha e compare na colheita. Nós fornecemos o produto.",
  cta: { label: "Pedir uma faixa de teste", href: "#trial-form" },
  alt: "Vista aérea de uma lavoura de soja com faixa de teste marcada por bandeiras",
};

export const questions: typeof en.questions = {
  heading: ["Respostas diretas", "para o produtor."],
  prev: "Anterior",
  next: "Próxima",
  items: [
    {
      q: "O que os aminoácidos livres têm de diferente?",
      a: "São aminoácidos soltos, sem cadeias de peptídeos. A planta pode usá-los sem precisar quebrar nada antes.",
      image: "/img/aminosan-b/meet-leaf.webp",
    },
    {
      q: "Entra no meu programa de pulverização?",
      a: "Use sozinho ou no tanque, junto de uma passada já planejada. Siga a ordem de mistura do rótulo e faça teste de jarra em combinações novas.",
      image: "/img/aminosan-b/season-sprayer.webp",
    },
    {
      q: "Quando devo aplicar?",
      a: "Soja de V2–V3 até R5, milho de V2 até V8. Seu agrônomo ajusta a época ao seu manejo.",
      image: "/img/aminosan-b/season-soy.webp",
    },
    {
      q: "Tem hormônio?",
      a: "Não. O Aminosan® é não hormonal: aminoácidos livres mais nitrogênio, fósforo e potássio.",
      image: "/img/aminosan-b/season-corn.webp",
    },
    {
      q: "Quanto eu preciso?",
      a: "Uma dose pequena por acre, numa passada que você já faz. A dose para a sua cultura está no rótulo.",
      image: "/img/aminosan-b/timing-hands.webp",
    },
    {
      q: "Como sei que funciona na minha fazenda?",
      a: "Faça uma faixa com a testemunha sem tratamento ao lado e compare na colheita. Nós fornecemos o produto.",
      image: "/img/aminosan-b/proof-farmer.webp",
    },
  ],
};

export const final: typeof en.final = {
  heading: ["Teste na", "sua lavoura."],
  body: "Diga sua cultura e seu estado. Mandamos preço, o rótulo e um plano de faixa de teste para a sua fazenda.",
  alt: "Produtora na borda de uma lavoura de milho ao entardecer",
  fields: {
    name: { label: "Nome completo", placeholder: "Seu nome" },
    email: { label: "E-mail", placeholder: "voce@fazenda.com" },
    state: { label: "Estado", placeholder: "Iowa" },
    crop: { label: "Cultura principal", placeholder: "Soja" },
  },
  call: "Quero uma ligação de um agrônomo",
  submit: "Pedir uma faixa de teste",
  sending: "Enviando…",
  privacy: "Usamos seus dados só para responder a este pedido.",
};
