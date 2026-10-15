/* Disha Travel Services — Holidays & Tours page.
   "Who's coming along?" filter, scroll reveals, and the reduced-motion
   freeze for the hero's flight path. main.js handles the menu and
   in-page smooth scrolling. */
(function () {
  'use strict';

  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Hero flight path is SMIL, which ignores prefers-reduced-motion. */
  var route = document.querySelector('.hh-route');
  if (route && still && route.pauseAnimations) {
    route.pauseAnimations();
    route.setCurrentTime(6);
  }

  /* Who's coming along? Matching collections stay; the rest fade back. */
  var btns = [].slice.call(document.querySelectorAll('.hc-who .tag-btn'));
  var cards = [].slice.call(document.querySelectorAll('.hc'));
  var status = document.querySelector('.hc-status');

  var ink = document.querySelector('.hc-ink');
  function moveInk(btn) {
    if (!ink || !btn) return;
    ink.style.left = (btn.offsetLeft) + 'px';
    ink.style.width = btn.offsetWidth + 'px';
  }
  window.addEventListener('resize', function () { moveInk(document.querySelector('.tag-btn[aria-pressed="true"]')); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveInk(document.querySelector('.tag-btn[aria-pressed="true"]')); });
  setTimeout(function () { moveInk(document.querySelector('.tag-btn[aria-pressed="true"]')); }, 50);

  function pick(btn) {
    var who = btn.dataset.who;
    btns.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
    moveInk(btn);
    var row = btn.closest('.hc-who');
    if (row && row.scrollWidth > row.clientWidth) row.scrollTo({ left: Math.max(0, btn.offsetLeft - 20), behavior: 'smooth' });
    var n = 0;
    cards.forEach(function (c) {
      var on = who === 'all' || (' ' + c.dataset.who + ' ').indexOf(' ' + who + ' ') > -1;
      c.classList.remove('is-dim');
      if (on) {
        var wasHidden = c.hidden;
        c.hidden = false;
        c.classList.add('is-in');
        if (wasHidden) { c.classList.remove('hc-enter'); void c.offsetWidth; c.classList.add('hc-enter'); }
      } else {
        c.hidden = true;
      }
      if (on) n++;
    });
    if (status) {
      status.innerHTML = who === 'all'
        ? ''
        : '<b>' + n + '</b> of ' + cards.length + ' collections fit “' + btn.querySelector('span').textContent + '” <button type="button" class="hc-reset">Show all</button>';
    }
  }
  btns.forEach(function (b) { b.addEventListener('click', function () { pick(b); }); });
  if (status) status.addEventListener('click', function (e) { if (e.target.closest('.hc-reset')) pick(btns[0]); });
  // how many collections each option shows
  btns.forEach(function (b) {
    var w = b.dataset.who, n = w === 'all' ? cards.length : cards.filter(function (c) { return (' ' + c.dataset.who + ' ').indexOf(' ' + w + ' ') > -1; }).length;
    var em = b.querySelector('.tag-n'); if (em) em.textContent = n;
  });

  /* Scroll reveal: ships visible, opts in only when it can run. */
  var els = [].slice.call(document.querySelectorAll('.hrv'));
  if (!els.length || still || !window.IntersectionObserver) return;
  document.documentElement.classList.add('js-hreveal');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      el.classList.add('is-in');
      io.unobserve(el);
      setTimeout(function () { el.style.transitionDelay = ''; }, 1000);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach(function (el, i) {
    if (el.classList.contains('hc') || el.classList.contains('bp')) el.style.transitionDelay = (i % 3) * 0.08 + 's';
    io.observe(el);
  });
  setTimeout(function () { els.forEach(function (el) { el.classList.add('is-in'); }); }, 5000);
})();

/* Hero: the traveller-type tiles change the background; it also cycles. */
(function () {
  'use strict';
  var hero = document.querySelector('.hhb');
  if (!hero) return;
  var slides = [].slice.call(hero.querySelectorAll('.hhb-slide'));
  var picks = [].slice.call(hero.querySelectorAll('.hhb-pick'));
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DUR = 6500, i = 0, timer = null;
  hero.style.setProperty('--dur', DUR + 'ms');

  function show(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
    picks.forEach(function (p, k) {
      var on = k === i;
      p.classList.toggle('is-on', on);
      p.setAttribute('aria-pressed', on ? 'true' : 'false');
      var bar = p.querySelector('.hhb-run i');
      bar.classList.remove('go');
      if (on && !still) { void bar.offsetWidth; bar.classList.add('go'); }
    });
  }
  function start() {
    clearInterval(timer);
    if (still) return;
    timer = setInterval(function () { show(i + 1); }, DUR);
  }
  picks.forEach(function (p, k) {
    p.addEventListener('click', function () { show(k); start(); });
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden) clearInterval(timer); else start(); });
  show(0);
  start();
})();
