/* ==========================================================================
   Juma-Agro USA — protótipo de copy
   Três comportamentos: idioma, modo anotação e seletor de cultura.
   Sem dependência externa. Funciona abrindo o arquivo direto no navegador.
   ========================================================================== */
(function () {
  'use strict';

  var LS = {
    lang: 'juma.lang',
    notes: 'juma.notes',
    track: 'juma.track',
    crop: 'juma.crop'
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

  /* ------------------------------------------------------------ trilha A/B
     Só existe na LP do KMEP Ultra. Alterna os blocos de mecanismo entre a
     versão nutricional (publicável) e a versão com claim de praga (HOLD). */
  function aplicarTrilha(t) {
    document.documentElement.setAttribute('data-track', t);
    var b = document.querySelector('[data-toggle-track]');
    if (b) {
      b.setAttribute('aria-pressed', String(t === 'b'));
      var rot = b.querySelector('[data-track-rotulo]');
      if (rot) rot.textContent = t === 'b' ? 'B' : 'A';
    }
    gravar(LS.track, t);
  }

  /* -------------------------------------------------------- seletor cultura
     Troca resultado, janela de aplicação e ROI nas páginas de produto.
     Os valores vivem em data-crop-<cultura> no próprio elemento. */
  function aplicarCultura(cultura) {
    var alvos = document.querySelectorAll('[data-crop-corn], [data-crop-soy], [data-crop-cotton], [data-crop-specialty]');
    for (var i = 0; i < alvos.length; i++) {
      var el = alvos[i];
      var v = el.getAttribute('data-crop-' + cultura);
      if (v !== null) el.textContent = v;
    }
    var botoes = document.querySelectorAll('[data-set-crop]');
    for (var j = 0; j < botoes.length; j++) {
      var b = botoes[j];
      b.setAttribute('aria-pressed', String(b.getAttribute('data-set-crop') === cultura));
    }
    // blocos inteiros que só existem em uma cultura
    var blocos = document.querySelectorAll('[data-only-crop]');
    for (var k = 0; k < blocos.length; k++) {
      var bl = blocos[k];
      var lista = bl.getAttribute('data-only-crop').split(' ');
      bl.style.display = lista.indexOf(cultura) >= 0 ? '' : 'none';
    }
    gravar(LS.crop, cultura);
  }

  /* ------------------------------------------------------------- ligações */
  document.addEventListener('click', function (ev) {
    var alvo = ev.target.closest ? ev.target.closest('[data-set-lang],[data-toggle-notes],[data-toggle-track],[data-set-crop],[data-burger]') : null;
    if (!alvo) return;

    if (alvo.hasAttribute('data-set-lang')) {
      aplicarIdioma(alvo.getAttribute('data-set-lang'));
    } else if (alvo.hasAttribute('data-toggle-notes')) {
      aplicarNotas(document.documentElement.getAttribute('data-notes') !== 'on');
    } else if (alvo.hasAttribute('data-toggle-track')) {
      aplicarTrilha(document.documentElement.getAttribute('data-track') === 'b' ? 'a' : 'b');
    } else if (alvo.hasAttribute('data-set-crop')) {
      aplicarCultura(alvo.getAttribute('data-set-crop'));
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
  if (document.querySelector('[data-toggle-track]')) aplicarTrilha(ler(LS.track, 'a'));
  if (document.querySelector('[data-set-crop]')) {
    var padrao = document.body.getAttribute('data-crop-padrao') || 'corn';
    aplicarCultura(ler(LS.crop, padrao));
  }
})();
