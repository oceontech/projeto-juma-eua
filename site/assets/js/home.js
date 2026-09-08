/* ==========================================================================
   Juma-Agro USA — Home
   Quatro comportamentos: menu mobile, comparador antes/depois, leque de
   culturas e a entrada das seções no scroll. Sem dependências.
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isNarrow = function () { return window.matchMedia('(max-width: 860px)').matches; };

  /* ------------------------------------------------------------ menu mobile */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('mobile-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.dataset.open !== 'true';
      menu.dataset.open = String(open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.dataset.open = 'false';
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ------------------------------------------------------- comparador antes/depois */
  /* O corte da foto tratada anda com o ponteiro. O <input type="range"> não
     recebe ponteiro: fica só como controle de teclado, para quem navega por tab. */
  document.querySelectorAll('[data-compare]').forEach(function (box) {
    var range = box.querySelector('input[type="range"]');

    function set(pct) {
      var v = Math.max(0, Math.min(100, pct));
      box.style.setProperty('--split', v + '%');
      if (range && Number(range.value) !== v) range.value = String(v);
    }

    function fromPointer(e) {
      var r = box.getBoundingClientRect();
      set(isNarrow()
        ? ((e.clientY - r.top) / r.height) * 100
        : ((e.clientX - r.left) / r.width) * 100);
    }

    /* O move e o up ficam na janela, não na caixa: mexer o corte troca o
       elemento que está sob o cursor, e um listener preso à caixa perde o
       arrasto no primeiro movimento. */
    function onMove(e) { fromPointer(e); e.preventDefault(); }
    function onUp() {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    }

    box.addEventListener('pointerdown', function (e) {
      fromPointer(e);
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    });

    if (range) range.addEventListener('input', function () { set(Number(range.value)); });

    set(range ? Number(range.value) : 50);
  });

  /* ------------------------------------------------------------ leque de culturas */
  /* Cinco cartas em círculo: a escolhida vai para o centro (data-pos="2") e as
     outras se distribuem em volta na mesma ordem. */
  var fan = document.querySelector('[data-fan]');
  var dots = document.querySelector('.dots');

  if (fan) {
    var cards = Array.prototype.slice.call(fan.querySelectorAll('.crop-card'));
    var n = cards.length;
    var center = Math.floor(n / 2);
    var active = center;

    function layout() {
      cards.forEach(function (card, i) {
        card.dataset.pos = String(((i - active + center) % n + n) % n);
      });
      if (dots) {
        Array.prototype.forEach.call(dots.children, function (dot, i) {
          dot.setAttribute('aria-current', String(i === active));
        });
      }
    }

    if (dots) {
      cards.forEach(function (card, i) {
        var name = card.querySelector('h3').textContent;
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Show ' + name);
        dot.addEventListener('click', function () { active = i; layout(); });
        dots.appendChild(dot);
      });
    }

    cards.forEach(function (card, i) {
      card.addEventListener('click', function () { active = i; layout(); });
    });

    layout();
  }

  /* ------------------------------------------------------------------ reveal */
  var productsSection = document.querySelector('.products');
  var productsGrid = document.querySelector('.products__grid');

  if (productsSection && productsGrid) {
    if (reduced || !('IntersectionObserver' in window)) {
      productsSection.classList.add('bands-in');
    } else {
      var observeProductBands = function () {
        /* Só mede depois do load: antes disso as imagens e as seções sticky
           anteriores ainda podem deslocar o grid e disparar a animação cedo. */
        var bandsIo = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            productsSection.classList.toggle('bands-in', entry.intersectionRatio >= 0.88);
          });
        }, { threshold: [0, 0.88] });

        productsSection.classList.remove('bands-in');
        bandsIo.observe(productsSection);
      };

      if (document.readyState === 'complete') observeProductBands();
      else window.addEventListener('load', observeProductBands, { once: true });
    }
  }

  var targets = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.06 });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* -------------------------------------------------------------- formulário */
  /* O protótipo não envia nada: o endpoint entra junto com a stack final. */
  var form = document.querySelector('.us form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('.btn-send');
      if (!btn || btn.dataset.busy === 'true') return;
      var label = btn.firstChild;
      var original = label.nodeValue;
      btn.dataset.busy = 'true';
      label.nodeValue = 'Not wired yet ';
      setTimeout(function () {
        label.nodeValue = original;
        btn.dataset.busy = 'false';
      }, 2200);
    });
  }
})();
