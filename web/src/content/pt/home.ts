import type * as en from "../home";

/**
 * Copy da home em português — provisória, para revisão da Juma.
 * Mesmo formato de ../home.ts; ver src/content/index.ts.
 */

export const nav: typeof en.nav = {
  left: [
    { label: "Início", href: "/" },
    { label: "Fale conosco", href: "#us-operation" },
  ],
  right: [
    { label: "Aminosan®", href: "/aminosan" },
    { label: "KMEP Ultra®", href: "/kmep" },
  ],
  compact: [
    { label: "Início", href: "/" },
    { label: "KMEP", href: "/kmep" },
    { label: "Aminosan", href: "/aminosan" },
  ],
  cta: { label: "Teste grátis", href: "#us-operation" },
  openMenu: "Abrir menu",
  closeMenu: "Fechar menu",
};

export const hero: typeof en.hero = {
  tagline: "Juma-Agro Fertilizer LLC · Lakeland, Flórida",
  taglineShort: "Juma-Agro Fertilizer LLC",
  headline: ["Comprovado onde a", "colheita nunca para."],
  subheadline:
    "No Brasil, o produtor colhe duas a três safras na mesma área todo ano. Não há inverno para zerar o campo. Nossa nutrição foliar é testada nessas condições há 38 anos, ensaio após ensaio, sempre com a testemunha ao lado.",
  tractorAlt: "Trator puxando um implemento em uma lavoura de soja ao nascer do sol",
};

export const brazil: typeof en.brazil = {
  title: "O Brasil é a credencial, não a ressalva.",
  history: {
    badge: "Ano da primeira fórmula",
    year: "1988",
    title: "O produto veio primeiro",
    body: "Júlio Matino formulou o Aminosan antes de existir uma empresa para vendê-lo. Produtores de São Paulo compraram porque funcionava, e a demanda construiu o negócio.",
    author: { name: "Júlio Matino", role: "Fundador" },
  },
  metrics: [
    {
      value: "12",
      label: "Meses de pressão por ano",
      body: "Não há inverno para zerar o campo. Estresse térmico como rotina, e um veranico que cai bem no meio do enchimento de grãos.",
    },
    {
      value: "40",
      label: "Anos de agricultura tropical",
      body: "Um patrimônio que nenhuma empresa americana de bioestimulantes tem. Não pedimos que você ignore de onde isso veio. Pedimos que você olhe para isso.",
    },
  ],
};

export const proof: typeof en.proof = {
  headline: ["Agronomia brasileira,", "agora trabalhando em", "solo americano."],
  body: "Quase quatro décadas de nutrição foliar construídas nas condições de cultivo mais duras da agricultura comercial — duas e três safras por ano, calor como rotina, nenhum inverno para zerar o campo. Essa experiência agora chega à sua lavoura: mais eficiência em cada passada que você já faz, mais produtividade no estande que você já tem e uma margem maior no fim da safra.",
  compare: {
    beforeLabel: "Testemunha sem tratamento",
    afterLabel: "Tratado",
    beforeAlt: "Faixa testemunha de soja sem tratamento, com dossel mais claro e mais solo aparente",
    afterAlt: "Faixa de soja tratada, com dossel verde mais escuro e fechamento de linha mais forte",
    handleLabel: "Revelar a faixa tratada",
  },
  benefits: [
    { title: "Eficiência", body: "Mais trabalho por passada." },
    { title: "Produtividade", body: "Ganhos visíveis em semanas." },
    { title: "Rentabilidade", body: "Mais produção, margem melhor." },
  ],
};

export const expertise: typeof en.expertise = {
  headline: ["Dois produtos.", "Uma função cada."],
  body: "Uma empresa com treze produtos que traz dois para os EUA está fazendo uma escolha. Veja para que serve cada um.",
};

export const products: typeof en.products = [
  {
    id: "kmep",
    category: "Performance de aplicação · Potássio foliar",
    title: "KMEP Ultra®",
    body: "Vai no tanque com o seu inseticida, melhora como a calda cobre e deposita, e leva potássio foliar para o enchimento de grãos. Seis dólares por acre.",
    href: "/kmep",
    image: { src: "/img/pack-kmep-us.webp", alt: "Galão de 2,5 gal do KMEP Ultra com rótulo americano" },
  },
  {
    id: "aminosan",
    category: "Aminoácidos livres",
    title: "Aminosan®",
    body: "Os blocos de construção, entregues prontos para uso. No campo há 40 anos.",
    href: "/aminosan",
    image: { src: "/img/pack-aminosan-us.webp", alt: "Galão de 2,5 gal do Aminosan com rótulo americano" },
  },
];

export const productCard: typeof en.productCard = {
  cta: "Ver produto",
  watch: { before: "Assistir ao vídeo do ", after: "" },
};

export const crops: typeof en.crops = {
  eyebrow: "Culturas que atendemos",
  headline: "Nutrição pensada para a cultura que você planta.",
  body: "Grandes culturas, hortifrúti, pastagens e muito mais. Nossos programas foliares acompanham cada cultura nas fases críticas — mais eficiência na passada que você já faz e mais produtividade no estande que você já tem.",
  corridorLabel: "Grandes culturas · Hortifrúti · E mais",
  more: {
    text: "Essas são só algumas das culturas com que trabalhamos. Cultiva outra coisa?",
    cta: "Fale com nossa equipe agronômica",
  },
  cards: [
    { id: "tomato", name: "Tomate", image: "/img/crops/tomato.webp" },
    { id: "strawberry", name: "Morango", image: "/img/crops/strawberry.webp" },
    { id: "blueberry", name: "Mirtilo", image: "/img/crops/blueberry.webp" },
    { id: "bell-pepper", name: "Pimentão", image: "/img/crops/bell-pepper.webp" },
    { id: "watermelon", name: "Melancia", image: "/img/crops/watermelon.webp" },
    { id: "citrus", name: "Citros", image: "/img/crops/citrus.webp" },
    { id: "vegetables", name: "Hortaliças", image: "/img/crops/vegetables.webp" },
    { id: "ornamentals", name: "Ornamentais", image: "/img/crops/ornamentals.webp" },
    { id: "pasture", name: "Pastagem", image: "/img/crops/pasture.webp" },
    { id: "corn", name: "Milho", image: "/img/crop-corn.webp" },
    { id: "soybean", name: "Soja", image: "/img/crop-soybean.webp" },
    { id: "cotton", name: "Algodão", image: "/img/crop-cotton.webp" },
  ],
  regions: [
    {
      id: "north-florida",
      tag: "Frutas vermelhas e melões",
      name: "Norte da Flórida",
      body: "Suporte para floração, pegamento e tamanho de frutos em solos arenosos e de drenagem rápida.",
      crops: ["blueberry", "watermelon", "vegetables"],
    },
    {
      id: "central-florida",
      tag: "Morango e citros",
      name: "Centro da Flórida",
      body: "Nutrição constante durante as longas colheitas de inverno e o calor nos pomares.",
      crops: ["strawberry", "blueberry", "citrus", "vegetables"],
    },
    {
      id: "south-florida",
      tag: "Mercado in natura",
      name: "Sul da Flórida",
      body: "Hortaliças o ano todo, viveiros e pastagens sob calor constante.",
      crops: ["tomato", "bell-pepper", "vegetables", "ornamentals", "pasture"],
    },
    {
      id: "southeast",
      tag: "Grandes culturas",
      name: "Sudeste",
      body: "Programas respaldados por 38 anos de ensaios em duas e três safras por ano.",
      crops: ["corn", "soybean", "cotton"],
    },
  ],
  pillarsTitle: "Por que os produtores escolhem a Juma",
  pillarsLead: "Comprovada sob pressão. Feita para conquistar seu lugar no programa.",
  pillarsNote: "Uma parceria prática para quem quer ver o trabalho antes de assumir um compromisso maior.",
  pillars: [
    { title: "38 anos no campo", detail: "Construída na agricultura tropical, onde cada passada precisa valer." },
    { title: "Funciona no seu programa", detail: "Feita para caber nas passadas que você já planejou." },
    { title: "Suporte na sua lavoura", detail: "A agronomia fica perto do campo, não apenas no rótulo." },
    { title: "Comece com uma faixa de teste", detail: "Veja o programa nas suas condições antes de decidir." },
  ],
};

export const programs: typeof en.programs = {
  headline: ["Três frentes", "por trás do galão."],
  body: "Um produto é o fim de um processo. Estes são os três programas que rodam o ano todo e o sustentam: pesquisa, portas abertas e um time que se encontra cara a cara.",
  cards: [
    {
      id: "target",
      eyebrow: "Pesquisa · Tecnologia de aplicação",
      title: "Olho no Alvo",
      body: "O programa de tecnologia de aplicação da Juma: acompanhar no campo como a calda sai do bico e chega à planta — espectro de gotas, deriva e deposição no alvo. O melhor produto só funciona se chegar onde precisa. Aqui, tecnologia de aplicação é programa de pesquisa, não slogan.",
      tags: ["Espectro de gotas", "Deriva", "Deposição"],
    },
    {
      id: "experience",
      eyebrow: "Portas abertas · Imersão de um dia",
      title: "Juma Experience",
      body: "Produtores, revendas e parceiros passam um dia dentro da operação: a história da empresa, a fábrica, o laboratório de qualidade próprio, a logística — e uma conversa com o fundador, que conta como formulou o Aminosan há quase quarenta anos. Quem quiser conferir o que dizemos pode vir ver.",
      closing: ["Quem vive, entende.", "Quem entende, produz mais."],
    },
    {
      id: "juma360",
      eyebrow: "O time · Quatro dias, uma vez por ano",
      title: "Juma 360",
      body: "Uma convenção de quatro dias que reúne o time da Juma de todas as regiões do Brasil — agrônomos, equipe comercial e técnica na mesma sala, revisando o que funcionou no campo, o que não funcionou e o que a próxima safra pede. A agronomia que chega aos EUA foi debatida lá primeiro.",
      note: "Ano de início e número de edições · [P32]",
    },
  ],
};

export const trialStrip: typeof en.trialStrip = {
  eyebrow: "Nosso método de faixa de teste",
  headline: "Faça uma faixa de teste na sua própria lavoura. Nós fornecemos o produto.",
  body: "Escolha um talhão. Deixe uma faixa testemunha sem tratamento ao lado. Levamos o produto e voltamos na colheita com você. O seu resultado, na sua lavoura, contra a sua própria testemunha.",
  steps: [
    {
      number: "01",
      title: "Eficiência",
      body: "Um talhão, uma passada, a cultura que você já planejou. Nada muda no seu programa.",
    },
    {
      number: "02",
      title: "Deixe a testemunha",
      body: "Uma faixa sem tratamento ao lado. Esse é o método inteiro — o mesmo usado em todos os números deste site.",
    },
    {
      number: "03",
      title: "Leia na colheita",
      body: "Dados do monitor de colheita, lado a lado. O número é seu de qualquer forma — porque foi você quem conduziu o ensaio.",
    },
  ],
  goToStep: "Ir para a etapa",
};

export const usOperation: typeof en.usOperation = {
  eyebrow: "Operação nos EUA",
  headline: "Faça uma faixa de teste na sua própria lavoura. Nós fornecemos o produto.",
  body: "Escolha um talhão. Deixe uma faixa testemunha sem tratamento ao lado. Levamos o produto e voltamos na colheita com você. O seu resultado, na sua lavoura, contra a sua própria testemunha.",
  form: {
    heading: "Conte sobre o seu talhão",
    caption: "Cerca de dois minutos. Só precisamos do nome e do e-mail para começar.",
    name: { label: "Nome completo", placeholder: "Digite seu nome completo" },
    company: { label: "Fazenda ou empresa", placeholder: "Digite a fazenda ou empresa" },
    state: {
      label: "Estado",
      options: ["Iowa", "Illinois", "Nebraska", "Minnesota", "Indiana", "Kansas", "Outro"],
    },
    crop: {
      label: "Cultura principal",
      options: ["Milho", "Soja", "Algodão", "Café", "Cana-de-açúcar"],
    },
    acres: {
      label: "Acres",
      options: ["< 500", "500 – 1.500", "1.500 – 5.000", "> 5.000"],
    },
    email: { label: "E-mail", placeholder: "Digite seu e-mail" },
    problem: {
      label: "O que você quer resolver?",
      placeholder: "Conte o que você quer melhorar ou resolver",
    },
    call: "Quero receber uma ligação de um agrônomo",
    submit: "Enviar solicitação",
    sending: "Enviando…",
    privacy: {
      before: "Ao enviar, você concorda com nossa ",
      link: "Política de Privacidade",
      after: ". Usamos suas informações apenas para responder a esta solicitação.",
    },
  },
  contact: {
    name: "Juma-Agro Fertilizer LLC",
    address: ["3928 Anchuca Drive, Suite 11", "Lakeland, FL 33811"],
    body: "Produto, suporte agronômico e pedidos para o mercado americano. Nome do contato, telefone e horário pendentes da P11.",
  },
  alternatives: {
    title: "Ainda não está pronto para uma faixa?",
    actions: [
      {
        id: "label",
        label: "Receba a bula e a tabela de doses",
        icon: "/img/icon-doc.svg",
        href: "#",
      },
      {
        id: "agronomist",
        label: "Fale com um agrônomo",
        icon: "/img/icon-call.svg",
        href: "#",
      },
    ],
    disclaimer: "A segunda opção só entra no ar se o time dos EUA incluir um agrônomo — P11.",
  },
};

export const beneath: typeof en.beneath = {
  eyebrow: "A ciência de cultivar",
  edition: "CADERNO DE CAMPO JUMA",
  title: ["Abaixo", "da superfície."],
  description:
    "Cada folha guarda um mundo de possibilidades. Chegue mais perto da cultura. Descubra o pensamento por trás da nossa nutrição foliar.",
  viewLabel: "Modo da ilustração botânica",
  natural: "Vista natural",
  reveal: "Revelar estrutura",
  mouseHint: "Mova para explorar",
  touchHint: "Arraste a lente para ver por dentro",
  product: {
    label: "Feito em torno da planta",
    copy: "Aminoácidos livres. Prontos para uso.",
    link: "Conheça o Aminosan",
  },
  notes: {
    title: "A folha é só o começo.",
    focus: { term: "Nosso foco", value: "Nutrição foliar" },
    roots: { term: "Nossas raízes", value: "Agronomia brasileira" },
    next: { term: "Seu próximo passo", value: "Teste na sua lavoura" },
  },
  footer: {
    left: "Visualização botânica",
    right: "Enraizada na ciência. Cultivada no campo.",
  },
};

export const footer: typeof en.footer = {
  brand: { name: "Juma-Agro", suffix: "Fertilizer LLC" },
  address: "3928 Anchuca Drive, Suite 11 · Lakeland, FL 33811",
  parent: "Uma subsidiária da Juma Agro — empresa familiar em Mogi Guaçu, Brasil, desde 1988.",
  columns: [
    {
      title: "Produtos",
      links: [
        { label: "KMEP Ultra®", href: "/kmep" },
        { label: "Aminosan®", href: "/aminosan" },
      ],
    },
    {
      title: "Empresa",
      links: [
        { label: "Sobre", href: "#brazil" },
        { label: "Programas", href: "#programs" },
        { label: "Ensaios", href: "#method" },
        { label: "Contato", href: "#us-operation" },
      ],
    },
    {
      title: "Jurídico",
      links: [
        { label: "Política de Privacidade", href: "#" },
        { label: "Termos de Uso", href: "#" },
      ],
    },
  ],
  disclaimer:
    "Os resultados de ensaios exibidos neste site vêm de ensaios de campo conduzidos no Brasil. O desempenho no campo varia conforme clima, solo e manejo. Sempre leia e siga a bula.",
  copyright: "© 2026 Juma-Agro Fertilizer LLC.",
  cta: {
    eyebrow: "Faixa de teste gratuita",
    title: "Veja na sua própria lavoura.",
    button: "Solicitar faixa de teste",
  },
  backToTop: "Voltar ao topo",
};
