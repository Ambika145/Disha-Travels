/* Disha Travel Services — inner page interactions (About Us, Contact Us).
   Loaded after main.js, which already handles the mobile menu and
   in-page smooth scrolling. */
(function () {
  'use strict';

  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Contact hero flight route. SMIL ignores prefers-reduced-motion, so
     freeze it on the frame where the route is drawn and the plane has landed. */
  (function () {
    var svg = document.querySelector('.croute-svg');
    if (!svg || !still || !svg.pauseAnimations) return;
    svg.pauseAnimations();
    svg.setCurrentTime(4.8);
  })();

  /* Arriving from a destination's "Plan This Trip" (contact-us.html?dest=Bali)
     pre-fills the trip form's destination field. */
  (function () {
    var field = document.getElementById('t-dest');
    if (!field || !window.URLSearchParams) return;
    var dest = new URLSearchParams(location.search).get('dest');
    if (!dest) return;
    field.value = dest === 'undecided' ? 'Not decided yet, help me choose' : dest.slice(0, 80);
  })();

  /* Scroll reveal.
     Elements marked .rv ship visible; this opts the document in to the
     fade-up only when IntersectionObserver is available and motion is on. */
  (function () {
    var els = [].slice.call(document.querySelectorAll('.rv'));
    if (!els.length || still || !window.IntersectionObserver) return;

    document.documentElement.classList.add('js-reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });

    // never leave anything hidden if the observer is slow to fire
    setTimeout(function () {
      els.forEach(function (el) { el.classList.add('is-in'); });
    }, 4000);
  })();

  /* Enquiry form tabs (WAI-ARIA tabs pattern: arrows, Home/End). */
  var card = document.getElementById('fcard');
  if (!card) return;

  var tabs = [].slice.call(card.querySelectorAll('.ftab'));
  var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
  var done = card.querySelector('.fdone');

  function select(i, focus) {
    tabs.forEach(function (t, n) {
      var on = n === i;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      panels[n].hidden = !on;
    });
    done.hidden = true;
    if (focus) tabs[i].focus();
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(i); });
    t.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') n = 0;
      if (e.key === 'End') n = tabs.length - 1;
      if (n === null) return;
      e.preventDefault();
      select(n, true);
    });
  });

  /* Validation + thank-you state. */
  function setError(input, msg) {
    var field = input.closest('.ffield');
    var err = field.querySelector('.ferr');
    field.classList.toggle('is-bad', !!msg);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) {
      if (!err.id) err.id = input.id + '-err';
      err.textContent = msg || '';
      if (msg) input.setAttribute('aria-describedby', err.id);
      else input.removeAttribute('aria-describedby');
    }
  }

  function check(input) {
    var v = input.value.trim();
    if (input.required && !v) return 'Please fill this in.';
    if (input.type === 'tel' && v && v.replace(/\D/g, '').length < 10) return 'Please enter a valid mobile number.';
    if (input.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Please enter a valid email address.';
    return '';
  }

  panels.forEach(function (form) {
    var inputs = [].slice.call(form.querySelectorAll('input[required], input[type="email"], input[type="tel"]'));

    inputs.forEach(function (input) {
      input.addEventListener('blur', function () { if (input.value) setError(input, check(input)); });
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') setError(input, check(input));
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      inputs.forEach(function (input) {
        var msg = check(input);
        setError(input, msg);
        if (msg && !firstBad) firstBad = input;
      });
      if (firstBad) { firstBad.focus(); return; }

      // TODO: post new FormData(form) to the enquiry endpoint.
      var name = (form.elements.name.value || '').trim().split(/\s+/)[0] || 'there';
      done.querySelector('.fdone-name').textContent = name;
      form.reset();
      form.hidden = true;
      done.hidden = false;
      card.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
    });
  });

  done.querySelector('[data-again]').addEventListener('click', function () {
    var i = 0;
    tabs.forEach(function (t, n) { if (t.getAttribute('aria-selected') === 'true') i = n; });
    select(i, true);
  });
})();
