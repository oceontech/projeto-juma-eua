"use client";

/**
 * O sinal de "a página está pronta".
 *
 * Um véu cobre a tela até os recursos da primeira dobra chegarem — o
 * Preloader na primeira entrada no site, o PageTransition em cada troca de
 * página —, e a entrada do hero espera este aviso para começar. Sem isso a
 * cena aparecia parada por um instante e só depois animava: a entrada rodava
 * atrás do véu.
 *
 * É um módulo, e não context: quem espera é uma animação dentro de um efeito,
 * não a árvore de render. Um promise faz o trabalho sem custar um re-render a
 * ninguém. Ele é **rearmável**: a troca de página fecha o portão antes de a
 * rota mudar (`holdBoot`), e o hero da página nova, ao montar, espera o véu
 * sair — em vez de achar o portão aberto da primeira entrada e animar por
 * trás do véu.
 */

type Gate = { promise: Promise<void>; open: () => void; opened: boolean };

function gate(): Gate {
  const g = { opened: false } as Gate;
  g.promise = new Promise<void>((resolve) => {
    g.open = () => {
      g.opened = true;
      resolve();
    };
  });
  return g;
}

let current = gate();

/**
 * Um segundo portão, ANTES do primeiro: o véu está opaco e a marca parada (ou
 * pulsando pelo compositor), então é o momento de fazer o trabalho pesado da
 * página — montar cena de partículas, amostrar a foto, compilar shader. Tudo
 * isso é main thread e dura centenas de milissegundos; feito na saída do véu,
 * congelava a cortina bem quando ela subia, e feito durante a entrada da
 * marca, travava a marca. A ordem é: cobre → prepara → sai.
 *
 * Quem prepara espera `whenCovered()` e registra o trabalho em `prepare()`;
 * o véu só sai depois de `whenPrepared()`.
 */
let covered = gate();
let preparing: Promise<unknown>[] = [];

/** Resolve quando a página pode fazer o trabalho pesado. */
export function whenCovered(): Promise<void> {
  return covered.promise;
}

/** Chamado pelo véu quando já cobre a página e a página nova já montou. */
export function markCovered() {
  covered.open();
}

/** Registra um trabalho pesado da página, para o véu esperar por ele. */
export function prepare<T>(work: Promise<T>): Promise<T> {
  preparing.push(work);
  return work;
}

/** Resolve quando tudo o que foi registrado terminou — ou no teto, para uma
    cena que não chega nunca não prender a página. */
export async function whenPrepared(capMs = 4000): Promise<void> {
  const settled = (async () => {
    let seen = -1;
    while (seen !== preparing.length) {
      seen = preparing.length;
      await Promise.allSettled(preparing);
    }
  })();
  await Promise.race([settled, new Promise<void>((resolve) => window.setTimeout(resolve, capMs))]);
}

/** O promise da vez: resolve quando o véu da página atual começa a sair. */
export function whenBooted(): Promise<void> {
  return current.promise;
}

/** O véu da página atual já começou a sair? */
export function isBooted(): boolean {
  return current.opened;
}

/** Chamado pelo véu quando ele começa a sair. */
export function markBooted() {
  covered.open();
  current.open();
}

/** Fecha o portão de novo, para a página que vai montar. Chamado pelo
    PageTransition antes de trocar a rota. */
export function holdBoot() {
  if (current.opened) current = gate();
  if (covered.opened) covered = gate();
  preparing = [];
}

/* Rede ruim, JSON que não chega, erro no player: nada disso pode deixar o
   site sem entrada. Passado o teto, a primeira entrada segue sozinha (a
   troca de página tem o próprio teto, em PageTransition.tsx). */
if (typeof window !== "undefined") {
  window.setTimeout(markBooted, 8000);
}
