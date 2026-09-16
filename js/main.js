/* Disha Travel Services — homepage interactions */
(function () {
  'use strict';

  /* Smooth scroll for real in-page anchors.
     Placeholder links (href="#") are left alone so they don't jump to the top. */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) { e.preventDefault(); return; }
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* Enquiry popups.
     The mockup marks every CTA that should open a form with a "▸ POPUP" pill.
     Until the form is built, they route through one handler. */
  document.querySelectorAll('a .pop').forEach(function (pill) {
    var trigger = pill.closest('a');
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      openEnquiry(trigger.textContent.replace('▸ POPUP', '').trim());
    });
  });

  function openEnquiry(context) {
    // TODO: replace with the enquiry modal.
    console.log('Enquiry popup requested:', context);
  }

  /* Newsletter signup */
  var nform = document.querySelector('.nform');
  if (nform) {
    var input = nform.querySelector('input');
    var submit = nform.querySelector('.btn');
    var note = document.createElement('p');
    note.className = 'nform-note';
    nform.parentNode.appendChild(note);

    input.type = 'email';

    submit.addEventListener('click', function (e) {
      e.preventDefault();
      var email = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        note.textContent = 'Please enter a valid email address.';
        note.className = 'nform-note is-error';
        input.focus();
        return;
      }
      // TODO: post the address to the mailing list endpoint.
      note.textContent = 'Thanks, one email a month, starting next issue.';
      note.className = 'nform-note is-ok';
      input.value = '';
    });

    input.addEventListener('input', function () { note.textContent = ''; });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); submit.click(); }
    });
  }

  /* Destination and Collection cards.
     Details reveal on hover, which touch devices don't have — so tapping
     (or pressing Enter/Space on a focused card) toggles one open instead.
     Opening a card closes its siblings; clicking a link inside just follows it. */
  document.querySelectorAll('.dcard, .ccard').forEach(function (card) {
    function toggle() {
      var open = card.classList.contains('is-open');
      Array.prototype.forEach.call(card.parentNode.children, function (c) {
        c.classList.remove('is-open');
      });
      if (!open) card.classList.add('is-open');
    }
    card.addEventListener('click', function (e) {
      if (e.target.closest('a')) return;
      toggle();
    });
    card.addEventListener('keydown', function (e) {
      if (e.target !== card) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });




  /* Mobile menu toggle. */
  (function () {
    var btn = document.querySelector('.navtoggle');
    var nav = document.getElementById('sitenav');
    if (!btn || !nav) return;

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    btn.addEventListener('click', function () {
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.hdr')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  })();

  /* Keep the hero exactly one viewport tall.
     The offers ticker and header sit above it and their height changes with
     the breakpoint (and when the nav wraps), so measure rather than guess. */
  (function () {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var above = [document.querySelector('.offers'), document.querySelector('.hdr')];

    function measure() {
      var px = above.reduce(function (sum, el) {
        return sum + (el ? el.getBoundingClientRect().height : 0);
      }, 0);
      document.documentElement.style.setProperty('--chrome', Math.round(px) + 'px');
    }

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(measure);
      above.forEach(function (el) { if (el) ro.observe(el); });
    }
    // Late webfont loads change the header height.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  })();

  /* Hero carousel.
     Crossfades three slides, auto-advancing unless the visitor is hovering,
     has focus inside, has the tab in the background, or prefers reduced motion. */
  (function () {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var slides = [].slice.call(hero.querySelectorAll('.hslide'));
    var dots = [].slice.call(hero.querySelectorAll('.hdot'));
    var num = hero.querySelector('#hnum');
    if (slides.length < 2) return;

    var DURATION = 7000;
    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var index = 0;
    var timer = null;

    hero.style.setProperty('--hdur', DURATION + 'ms');

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (s, i) {
        var on = i === index;
        s.classList.toggle('is-on', on);
        s.setAttribute('aria-hidden', on ? 'false' : 'true');
      });
      dots.forEach(function (d, i) {
        var on = i === index;
        // Re-adding the class restarts the progress-fill animation.
        d.classList.remove('is-on');
        if (on) { void d.offsetWidth; d.classList.add('is-on'); }
        d.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      if (num) num.textContent = ('0' + (index + 1)).slice(-2);
      restart();
    }

    function restart() {
      clearInterval(timer);
      if (still) return;
      timer = setInterval(function () { show(index + 1); }, DURATION);
    }

    function pause(on) {
      hero.classList.toggle('is-paused', on);
      if (on) clearInterval(timer); else restart();
    }

    hero.querySelector('.harrow.prev').addEventListener('click', function () { show(index - 1); });
    hero.querySelector('.harrow.next').addEventListener('click', function () { show(index + 1); });
    dots.forEach(function (d, i) {
      d.addEventListener('click', function () { show(i); });
    });

    hero.addEventListener('mouseenter', function () { pause(true); });
    hero.addEventListener('mouseleave', function () { pause(false); });
    hero.addEventListener('focusin', function () { pause(true); });
    hero.addEventListener('focusout', function () {
      if (!hero.contains(document.activeElement)) pause(false);
    });
    document.addEventListener('visibilitychange', function () { pause(document.hidden); });

    hero.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
    });

    /* Swipe */
    var x0 = null, y0 = null;
    hero.addEventListener('touchstart', function (e) {
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, {passive: true});
    hero.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      var dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
      x0 = y0 = null;
    }, {passive: true});

    restart();
  })();


  /* Services flight route.
     Stops carry a data-t (0..1 along the path). On wide screens their screen
     positions are read straight off the SVG path with getPointAtLength, so a
     dot can never drift off the curve however the section is resized. The
     plane flies the same parameter on a loop and lights the nearest stop. */
  (function () {
    var route = document.getElementById('route');
    if (!route) return;

    var path = route.querySelector('#routePath');
    var plane = route.querySelector('.route-plane');
    var stops = [].slice.call(route.querySelectorAll('.stop'));
    if (!path || !plane || !stops.length) return;

    var VB = {w: 1200, h: 360};          // must match the svg viewBox
    var LAP = 26000;                      // ms for one full pass
    var wide = window.matchMedia('(min-width: 901px)');
    var still = window.matchMedia('(prefers-reduced-motion: reduce)');
    var len = 0, raf = null, start = null;

    stops.forEach(function (s, i) {
      s.dataset.i = i;
      // alternate sides so neighbouring labels never share a line
      if (i % 2) s.classList.add('up');
    });

    function at(t) {
      var p = path.getPointAtLength(Math.max(0, Math.min(1, t)) * len);
      return {x: p.x / VB.w * 100, y: p.y / VB.h * 100};
    }

    /* Stops are spaced evenly across the width, not evenly along the curve —
       arc-length spacing bunches them wherever the path steepens, which is
       what made neighbouring labels collide. The path only ever moves right,
       so a bisection finds the t for a target x. */
    function tForX(x) {
      var lo = 0, hi = 1, mid;
      for (var k = 0; k < 22; k++) {
        mid = (lo + hi) / 2;
        if (path.getPointAtLength(mid * len).x < x) lo = mid; else hi = mid;
      }
      return (lo + hi) / 2;
    }

    function layout() {
      if (!wide.matches) {
        stops.forEach(function (s, i) {
          s.style.left = s.style.top = '';
          s.dataset.tc = stops.length > 1 ? i / (stops.length - 1) : 0;
        });
        return;
      }
      len = path.getTotalLength();
      stops.forEach(function (s) {
        var t = tForX(parseFloat(s.dataset.x));
        s.dataset.tc = t;
        var p = at(t);
        s.style.left = p.x + '%';
        s.style.top = p.y + '%';
        // tags on the first and last stops would hang off the section edge
        s.classList.toggle('at-start', p.x < 9);
        s.classList.toggle('at-end', p.x > 91);
      });
    }

    function place(t) {
      if (wide.matches) {
        // the plane rides the path itself, nose along the tangent
        var p = at(t);
        plane.style.left = p.x + "%";
        plane.style.top = p.y + "%";
        var a = at(Math.max(0, t - 0.01)), b = at(Math.min(1, t + 0.01));
        var rad = Math.atan2((b.y - a.y) * VB.h, (b.x - a.x) * VB.w);
        // the bootstrap aircraft glyph points up, so +90 turns it along the path
        plane.firstElementChild.style.transform = "rotate(" + (rad * 180 / Math.PI + 90) + "deg)";
      } else {
        plane.style.top = (t * 100) + "%";
      }
      // exactly one stop is lit at a time — the one the plane is closest to,
      // so the highlight hands over cleanly instead of blinking off between stops
      var near = null, best = Infinity;
      stops.forEach(function (s) {
        var d = Math.abs(parseFloat(s.dataset.tc) - t);
        if (d < best) { best = d; near = s; }
      });
      stops.forEach(function (s) { s.classList.toggle('is-active', s === near); });
    }

    function frame(now) {
      if (start === null) start = now;
      place(((now - start) % LAP) / LAP);
      raf = requestAnimationFrame(frame);
    }

    function run(on) {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      if (on && !still.matches) raf = requestAnimationFrame(frame);
    }

    layout();
    place(0);

    // only fly while the section is actually on screen
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        run(entries[0].isIntersecting);
      }, {threshold: 0.05}).observe(route);
    } else {
      run(true);
    }
    document.addEventListener('visibilitychange', function () { run(!document.hidden); });

    var t = null;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(function () { layout(); }, 150);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  })();


  /* Philosophy section.
     Reveals the three pillars in sequence the first time the section scrolls
     into view, and counts the seal's years up from zero. Both run once.
     The markup ships visible and already reading "14"; this script opts in
     to the animation, so nothing disappears if it never runs. */
  (function () {
    var pos = document.querySelector('.pos');
    if (!pos) return;
    var num = pos.querySelector('.seal-n');
    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var target = num ? parseInt(num.dataset.to, 10) : 0;
    if (still || !window.IntersectionObserver) return;

    pos.classList.add('can-reveal');
    if (num) num.textContent = '0';

    function count() {
      if (!num) return;
      var t0 = null, dur = 1100;
      (function step(now) {
        if (t0 === null) t0 = now;
        var p = Math.min((now - t0) / dur, 1);
        // ease-out so it lands softly rather than stopping dead
        num.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    }

    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      pos.classList.add('is-in');
      count();
      io.disconnect();
    }, {threshold: 0.25});
    io.observe(pos);
  })();


  /* Top Destinations.
     Wipes the cards in once on first scroll, then drifts each photo against
     the scroll for depth. The grid ships visible; this only opts in to the
     animation, so nothing is hidden if the script never runs. */
  (function () {
    var grid = document.querySelector('.dst-grid');
    if (!grid) return;
    var cards = [].slice.call(grid.querySelectorAll('.dcard'));
    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still) return;

    grid.classList.add('can-reveal');

    var shown = false;
    function reveal() {
      if (shown) return;
      shown = true;
      grid.classList.add('is-in');
    }
    /* Checked from three directions, because a reveal that hides content must
       never depend on one signal: the observer, the scroll handler, and a
       timeout that gives up waiting and shows the cards regardless. */
    function maybeReveal() {
      var r = grid.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9 && r.bottom > 0) reveal();
    }
    if (window.IntersectionObserver) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { reveal(); io.disconnect(); }
      }, {threshold: 0.15});
      io.observe(grid);
    }
    setTimeout(reveal, 4000);

    /* Parallax. Each photo is drawn slightly larger than its frame, so it can
       drift without exposing an edge. Depth varies per card so the row does
       not move as one slab. */
    var DRIFT = 16, ticking = false;

    function frame() {
      ticking = false;
      var vh = window.innerHeight;
      cards.forEach(function (c, i) {
        var r = c.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        // -1 when the card sits below the fold, +1 when it has risen above
        var p = ((vh / 2) - (r.top + r.height / 2)) / (vh / 2);
        var depth = 0.6 + (i % 3) * 0.2;
        var img = c.querySelector('img');
        if (img) img.style.setProperty('--par', (p * DRIFT * depth).toFixed(1) + 'px');
      });
    }

    function onScroll() {
      maybeReveal();          // never wait on a frame to un-hide content
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(frame);
    }

    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll, {passive: true});
    frame();
  })();

  /* Keep the footer copyright current */
  document.querySelectorAll('.fbot').forEach(function (el) {
    el.innerHTML = el.innerHTML.replace(/©\s*\d{4}/, '© ' + new Date().getFullYear());
  });
})();
