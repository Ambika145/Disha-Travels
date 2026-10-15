/* Bus Tickets page only. Loaded after js/services.js. */
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

  /* popular routes: on touch screens (no hover) the little bus drives
     along each route once as the row scrolls into view */
  if (!window.matchMedia('(hover: hover)').matches) {
    onView($$('.rt'), function (el, i) {
      setTimeout(function () { el.classList.add('is-driven'); }, still ? 0 : i * 120);
    });
  }
})();
