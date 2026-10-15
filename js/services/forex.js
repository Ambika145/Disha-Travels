/* Forex Assistance page only. Loaded after js/services.js. */
(function () {
  'use strict';
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* ---------- FOREX: board letters flip in ---------- */
  (function () {
    var board = $('.board');
    if (!board || still || !window.IntersectionObserver) return;
    var io = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return;
      $$('.cur', board).forEach(function (c, i) { setTimeout(function () { c.classList.add('flip'); }, i * 70); });
      io.disconnect();
    }, { threshold: 0.2 });
    io.observe(board);
  })();
})();
