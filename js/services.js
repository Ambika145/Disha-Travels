/* Disha Travel Services — services.html and service-*.html.
   Everything here is progressive: the pages read and work without it. */
(function () {
  'use strict';

  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* ---------- one rAF-throttled scroll loop for every scroll effect ---------- */
  var onScroll = [];
  var ticking = false;
  function frame() {
    ticking = false;
    onScroll.forEach(function (fn) { fn(); });
  }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request, { passive: true });

  /* ---------- reveal ---------- */
  (function () {
    var els = $$('.srv');
    if (still || !window.IntersectionObserver) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    document.documentElement.classList.add('js-srv');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, d = parseFloat(el.dataset.d || 0);
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    // stagger siblings in the same grid
    els.forEach(function (el) {
      var sibs = el.parentNode ? $$(':scope > .srv', el.parentNode) : [];
      var i = sibs.indexOf(el);
      if (i > 0) { el.dataset.d = (i % 3) * 0.12; el.style.transitionDelay = el.dataset.d + 's'; }
      io.observe(el);
    });
    setTimeout(function () { els.forEach(function (el) { el.classList.add('is-in'); }); }, 6000);
  })();

  /* ---------- parallax: inner hero photo, hub hero layers ---------- */
  (function () {
    if (still) return;
    var items = $$('.ph-photo img').map(function (el) { return { el: el, k: 0.12 }; })
      .concat($$('[data-par]').map(function (el) { return { el: el, k: parseFloat(el.dataset.par) || 0 }; }));
    if (!items.length) return;
    onScroll.push(function () {
      var y = window.scrollY;
      if (y > window.innerHeight * 1.3) return;
      items.forEach(function (it) { it.el.style.setProperty('--py', (y * it.k).toFixed(1) + 'px'); });
    });
    request();
  })();

  /* ---------- buttons lean toward the pointer ---------- */
  (function () {
    if (still || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    $$('.mag').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.setProperty('--mx', ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + 'px');
        b.style.setProperty('--my', ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + 'px');
      });
      b.addEventListener('mouseleave', function () { b.style.setProperty('--mx', '0px'); b.style.setProperty('--my', '0px'); });
    });
  })();

  /* ---------- HUB: the service journey ---------- */
  (function () {
    var sj = $('.sj');
    if (!sj) return;
    var track = $('.sj-track', sj), chs = $$('.sj-ch', sj), btns = $$('.sj-index button', sj);
    var route = $('.sj-route', sj), prog = $('.sj-progress', sj), pill = $('.sj-pill', sj);
    var pillN = $('.sj-pill-n', sj), pillE = pill && $('em', pill);
    var mq = window.matchMedia('(min-width:1024px) and (min-height:640px)');
    var current = -1;

    function set(i, p) {
      sj.style.setProperty('--p', p.toFixed(3));
      if (route) route.style.setProperty('--p', (i / (chs.length - 1)).toFixed(3));
      if (i === current) return;
      current = i;
      chs.forEach(function (c, n) { c.classList.toggle('is-on', n === i); });
      btns.forEach(function (b, n) { if (n === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
      if (pillN) pillN.textContent = chs[i].dataset.name;
      if (pillE) pillE.textContent = (i < 9 ? '0' : '') + (i + 1);
    }

    function pinned() { return sj.classList.contains('is-pinned'); }

    function update() {
      var r = track.getBoundingClientRect(), vh = window.innerHeight;
      if (pinned()) {
        var span = r.height - vh;
        var p = Math.min(1, Math.max(0, -r.top / span));
        set(Math.min(chs.length - 1, Math.floor(p * chs.length * 0.999)), p);
      } else {
        // stacked: the chapter nearest the middle of the screen
        var mid = vh * 0.5, best = 0, bd = Infinity;
        chs.forEach(function (c, n) {
          var cr = c.getBoundingClientRect(), d = Math.abs(cr.top + cr.height / 2 - mid);
          if (d < bd) { bd = d; best = n; }
        });
        set(best, (best + 1) / chs.length);
        sj.classList.toggle('show-pill', r.top < vh * 0.4 && r.bottom > vh * 0.6);
      }
    }

    function mode() {
      sj.classList.toggle('is-pinned', mq.matches && !still);
      current = -1;
      update();
    }
    if (mq.addEventListener) mq.addEventListener('change', mode); else mq.addListener(mode);
    mode();
    onScroll.push(update);

    // index buttons scroll to that chapter's slice of the pinned track
    btns.forEach(function (b, n) {
      b.addEventListener('click', function () {
        if (!pinned()) { chs[n].scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' }); return; }
        var top = track.getBoundingClientRect().top + window.scrollY;
        var span = track.offsetHeight - window.innerHeight;
        window.scrollTo({ top: top + span * ((n + 0.5) / chs.length), behavior: still ? 'auto' : 'smooth' });
      });
    });
    // deep links like services.html#svc-forex
    if (location.hash.indexOf('#svc-') === 0) {
      var n = chs.map(function (c) { return '#' + c.id; }).indexOf(location.hash);
      if (n > -1) setTimeout(function () { btns[n].click(); }, 200);
    }
  })();

  /* ---------- HUB: cards tilt toward the pointer, with a light sweep ---------- */
  (function () {
    if (still || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    $$('.sc').forEach(function (c) {
      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.classList.add('is-tilting');
        c.style.setProperty('--ry', ((x - 0.5) * 9).toFixed(2) + 'deg');
        c.style.setProperty('--rx', ((0.5 - y) * 7).toFixed(2) + 'deg');
        c.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
        c.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
      });
      c.addEventListener('mouseleave', function () {
        c.classList.remove('is-tilting');
        c.style.setProperty('--rx', '0deg');
        c.style.setProperty('--ry', '0deg');
      });
    });
  })();

  /* ---------- HUB: jump chips scroll smoothly to a card ---------- */
  $$('.sg-jump a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'center' });
    });
  });

  /* ---------- HUB: closing headline ---------- */
  (function () {
    var end = $('.jend');
    if (!end || still || !window.IntersectionObserver) return;
    end.classList.add('can-reveal');
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { end.classList.add('is-in'); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(end);
  })();

  /* ---------- tick-off lists ---------- */
  $$('.ticks').forEach(function (list) {
    var btns = $$('button', list);
    var out = list.parentNode.querySelector('.ticks-count');
    function count() {
      var n = btns.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; }).length;
      if (out) out.textContent = n ? (n === btns.length ? 'All set. ' : '') + n + ' of ' + btns.length + ' ready' : '';
    }
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
        count();
      });
    });
  });

})();

/* HUB hero: crossfade between places, with a progress line and caption. */
(function () {
  'use strict';
  var hero = document.querySelector('.hz');
  if (!hero) return;
  var slides = [].slice.call(hero.querySelectorAll('.hz-slide'));
  var count = hero.querySelector('.hz-count b'), bar = hero.querySelector('.hz-bar i'), place = hero.querySelector('.hz-place');
  if (!bar) { bar = document.createElement('i'); count = document.createElement('b'); place = document.createElement('span'); place.innerHTML = '<b></b><small></small>'; }
  var DUR = 7000, i = 0, timer = null;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (slides.length < 2 || still) return;
  hero.style.setProperty('--dur', DUR + 'ms');

  function run() { bar.classList.remove('run'); void bar.offsetWidth; bar.classList.add('run'); }
  function show(n) {
    slides[i].classList.remove('is-on');
    i = (n + slides.length) % slides.length;
    var s = slides[i];
    s.classList.add('is-on');
    count.textContent = (i < 9 ? '0' : '') + (i + 1);
    place.classList.add('out');
    setTimeout(function () {
      place.querySelector('b').textContent = s.dataset.place;
      place.querySelector('small').textContent = s.dataset.where;
      place.classList.remove('out');
    }, 450);
    run();
  }
  function start() { clearInterval(timer); timer = setInterval(function () { show(i + 1); }, DUR); }
  run(); start();
  document.addEventListener('visibilitychange', function () { if (document.hidden) clearInterval(timer); else { run(); start(); } });
})();

/* INNER PAGES: the closing band
   photo (the page's own hero photograph). */
(function () {
  'use strict';
  var hero = document.querySelector('.shero');
  if (!hero) return;
  var secs = [].slice.call(document.querySelectorAll('main .ss'));
  var kb = hero.querySelector('.crumb span');
  var title = kb ? kb.textContent : '';
  var close = document.querySelector('.sclose'), img = hero.querySelector('.ph-photo img');
  if (close && img) {
    var fig = document.createElement('figure');
    fig.className = 'sclose-bg';
    fig.setAttribute('aria-hidden', 'true');
    fig.innerHTML = '<img src="' + img.getAttribute('src') + '" alt="" loading="lazy">';
    close.insertBefore(fig, close.firstChild);
  }
})();

/* INNER PAGES: the service enquiry form */
(function () {
  'use strict';
  var form = document.querySelector('.sform-card');
  if (!form) return;
  function check(input) {
    var v = input.value.trim(), msg = '';
    if (input.required && !v) msg = 'Please fill this in.';
    else if (input.type === 'tel' && v && v.replace(/\D/g, '').length < 10) msg = 'Please enter a valid mobile number.';
    else if (input.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = 'Please enter a valid email address.';
    var f = input.closest('.sf-f');
    f.classList.toggle('is-bad', !!msg);
    f.querySelector('.sf-err').textContent = msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }
  var checked = [].slice.call(form.querySelectorAll('input[required], input[type="email"]'));
  checked.forEach(function (i) { i.addEventListener('blur', function () { if (i.value) check(i); }); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = null;
    checked.forEach(function (i) { if (!check(i) && !bad) bad = i; });
    if (bad) { bad.focus(); return; }
    // TODO: post new FormData(form) to the enquiry endpoint.
    form.querySelector('.sf-fn').textContent = (form.elements.name.value.trim().split(/\s+/)[0]) || 'there';
    form.querySelector('.sform-fields').hidden = true;
    form.querySelector('.sform-foot').hidden = true;
    form.querySelector('.sform-done').hidden = false;
  });
})();
