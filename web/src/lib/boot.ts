"use client";

/**
 * O sinal de "a página está pronta".
 *
 * O preloader cobre a tela até os recursos da primeira dobra chegarem; a
 * entrada do hero espera este aviso para começar. Sem isso a cena aparecia
 * parada por um instante e só depois animava — a entrada rodava atrás do véu.
 *
 * É um módulo, e não context: quem espera é uma animação dentro de um efeito,
 * não a árvore de render. Um promise resolvido uma vez faz o trabalho sem
 * custar um re-render a ninguém.
 */

let release: () => void = () => {};

export const booted = new Promise<void>((resolve) => {
  release = resolve;
});

/** Chamado pelo preloader quando o véu começa a sair. */
export function markBooted() {
  release();
}

/* Rede ruim, JSON que não chega, erro no player: nada disso pode deixar o
   site sem entrada. Passado o teto, a página segue sozinha. */
if (typeof window !== "undefined") {
  window.setTimeout(markBooted, 8000);
}
