/* Visa Services page only. Loaded after js/services.js. */
(function () {
  'use strict';
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var onScroll = [], ticking = false;
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; onScroll.forEach(function (f) { f(); }); }); } }
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request, { passive: true });

  /* ---------- VISA: the step line fills as you scroll ---------- */
  (function () {
    var steps = $('.steps');
    if (!steps) return;
    var items = $$('.step', steps);
    onScroll.push(function () {
      var r = steps.getBoundingClientRect(), vh = window.innerHeight;
      var p = still ? 1 : Math.min(1, Math.max(0, (vh * 0.75 - r.top) / (r.height + vh * 0.25)));
      steps.style.setProperty('--p', p.toFixed(3));
      items.forEach(function (s, i) { s.classList.toggle('is-past', p >= i / (items.length - 1) - 0.001); });
    });
    request();
  })();

  /* ---------- the six flaws: each red cross turns into our tick ---------- */
  (function () {
    var flaws = $$('.flaw');
    if (still || !window.IntersectionObserver) { flaws.forEach(function (f) { f.classList.add('is-checked'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var f = en.target, i = flaws.indexOf(f);
        setTimeout(function () { f.classList.add('is-checked'); }, 650 + (i % 3) * 120);
        io.unobserve(f);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    flaws.forEach(function (f) { io.observe(f); });
  })();
})();
