/* Air Tickets page only. Loaded after js/services.js. */
(function () {
  'use strict';
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  /* adds .is-in once each element scrolls into view (at once with reduced motion) */
  function onView(els, fn, threshold) {
    if (!els.length) return;
    if (still || !window.IntersectionObserver) { els.forEach(function (el) { fn(el, 0); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        fn(en.target, els.indexOf(en.target));
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: threshold || 0.15 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* the HYD to destination route draws itself when the diagram comes into view */
  onView($$('.rcheck'), function (el) { el.classList.add('is-in'); }, 0.25);
})();
