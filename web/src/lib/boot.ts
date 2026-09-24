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

/** O promise da vez: resolve quando o véu da página atual começa a sair. */
export function whenBooted(): Promise<void> {
  return current.promise;
}

/** Chamado pelo véu quando ele começa a sair. */
export function markBooted() {
  current.open();
}

/** Fecha o portão de novo, para a página que vai montar. Chamado pelo
    PageTransition antes de trocar a rota. */
export function holdBoot() {
  if (current.opened) current = gate();
}

/* Rede ruim, JSON que não chega, erro no player: nada disso pode deixar o
   site sem entrada. Passado o teto, a primeira entrada segue sozinha (a
   troca de página tem o próprio teto, em PageTransition.tsx). */
if (typeof window !== "undefined") {
  window.setTimeout(markBooted, 8000);
}
