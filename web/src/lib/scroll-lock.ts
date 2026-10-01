/**
 * Trava a rolagem do usuário SEM tirar a barra de rolagem da tela.
 *
 * Os véus (Preloader e PageTransition) seguravam a página com
 * `overflow: hidden` no <html>. Só que isso remove a barra, e quando o véu
 * sai ela volta: a largura útil muda no quadro em que a saída começa, a página
 * inteira refaz o layout e a marca dá um salto lateral. Aqui a barra fica
 * onde está, com o polegar parado no lugar, e o que se bloqueia é a entrada:
 * roda, toque e teclado são cancelados, e arrastar o polegar da barra é
 * desfeito no mesmo quadro. Rolagem por código (`scrollTo`) segue livre —
 * `pin` diz para onde a página deve voltar quando o código a move.
 */

const SCROLL_KEYS = new Set([" ", "PageUp", "PageDown", "Home", "End", "ArrowUp", "ArrowDown"]);
const FIELD = "input, textarea, select, [contenteditable]";

export type ScrollLock = {
  /** Muda a posição em que a página é mantida — use antes de rolar por código. */
  pin: (y: number) => void;
  release: () => void;
};

export function lockScroll(): ScrollLock {
  let y = window.scrollY;

  const cancel = (e: Event) => {
    if (e.cancelable) e.preventDefault();
  };
  const onKey = (e: KeyboardEvent) => {
    if (!SCROLL_KEYS.has(e.key) || e.ctrlKey || e.metaKey || e.altKey) return;
    if ((e.target as Element | null)?.closest?.(FIELD)) return;
    e.preventDefault();
  };
  /* O polegar da barra não passa por evento cancelável. */
  const hold = () => {
    if (window.scrollY !== y) window.scrollTo(0, y);
  };

  window.addEventListener("wheel", cancel, { passive: false });
  window.addEventListener("touchmove", cancel, { passive: false });
  window.addEventListener("keydown", onKey);
  window.addEventListener("scroll", hold, { passive: true });

  return {
    pin: (next) => {
      y = next;
    },
    release: () => {
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchmove", cancel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", hold);
    },
  };
}
