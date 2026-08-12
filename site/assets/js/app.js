/* ==========================================================================
   Juma-Agro USA — protótipo de copy
   Dois comportamentos: idioma e modo anotação.
   Sem dependência externa. Funciona abrindo o arquivo direto no navegador.

   Saíram daqui: a trilha A/B do KMEP (a trilha do mecanismo virou a copy
   publicada) e o seletor de cultura (a faixa preta foi removida das duas LPs
   e o conteúdo que ela trocava passou a ser publicado por extenso).
   ========================================================================== */
(function () {
  'use strict';

  var LS = {
    lang: 'juma.lang',
    notes: 'juma.notes'
  };

  function ler(chave, padrao) {
    try { return localStorage.getItem(chave) || padrao; } catch (e) { return padrao; }
  }
  function gravar(chave, valor) {
    try { localStorage.setItem(chave, valor); } catch (e) { /* modo privado */ }
  }

  /* ---------------------------------------------------------------- idioma
     A copy está duas vezes no HTML, em [data-en] e [data-pt].
     Trocar o atributo lang do <html> troca qual das duas aparece (regra no CSS). */
  function aplicarIdioma(lang) {
    document.documentElement.setAttribute('lang', lang);
    var botoes = document.querySelectorAll('[data-set-lang]');
    for (var i = 0; i < botoes.length; i++) {
      var b = botoes[i];
      b.setAttribute('aria-pressed', String(b.getAttribute('data-set-lang') === lang));
    }
    gravar(LS.lang, lang);
  }

  /* --------------------------------------------------------- modo anotação
     Mostra as etiquetas que ligam cada seção ao documento de copy:
     identificador, função e status regulatório. */
  function aplicarNotas(ligado) {
    document.documentElement.setAttribute('data-notes', ligado ? 'on' : 'off');
    var b = document.querySelector('[data-toggle-notes]');
    if (b) b.setAttribute('aria-pressed', String(ligado));
    gravar(LS.notes, ligado ? 'on' : 'off');
  }

  /* ------------------------------------------------------------- ligações */
  document.addEventListener('click', function (ev) {
    var alvo = ev.target.closest ? ev.target.closest('[data-set-lang],[data-toggle-notes],[data-burger]') : null;
    if (!alvo) return;

    if (alvo.hasAttribute('data-set-lang')) {
      aplicarIdioma(alvo.getAttribute('data-set-lang'));
    } else if (alvo.hasAttribute('data-toggle-notes')) {
      aplicarNotas(document.documentElement.getAttribute('data-notes') !== 'on');
    } else if (alvo.hasAttribute('data-burger')) {
      var nav = document.querySelector('.hd__nav');
      if (nav) nav.classList.toggle('aberto');
    }
  });

  /* formulários: o protótipo não envia nada */
  document.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var msg = ev.target.querySelector('[data-form-msg]');
    if (msg) msg.hidden = false;
  });

  /* ------------------------------------------------------------ inicializa */
  aplicarIdioma(ler(LS.lang, 'en'));
  aplicarNotas(ler(LS.notes, 'off') === 'on');
})();
