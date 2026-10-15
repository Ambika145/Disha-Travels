/* Disha Travel Services — page-transition loader.
   Include in <head>, after css/loader.css:
     <link rel="stylesheet" href="css/loader.css">
     <script src="js/loader.js"></script>

   Leaving: a click on a link to another page of this site fades the overlay
   in, records the time, then navigates.
   Arriving: if that timestamp is fresh, the overlay is put up before the
   first paint, held until the page has loaded AND a minimum time has passed
   since the click, then faded out. Direct visits never see it. */
(function () {
  'use strict';

  var KEY = 'disha:nav';
  var MIN_MS = 1000;      // the loader always shows for at least this long
  var MAX_MS = 6000;      // never hold a loaded-enough page longer than this
  var LEAVE_MS = 320;     // let the fade-in land before the browser unloads
  // NASA Blue Marble day map (public domain). Self-host a copy at, e.g.,
  // assets/images/graphics/earth.jpg and point this at it for production.
  var TEXTURE = 'https://cdn.jsdelivr.net/npm/three-globe@2/example/img/earth-day.jpg';

  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  var el = null;

  function store(fn) { try { return fn(window.sessionStorage); } catch (e) { return null; } }

  /* A realistic top-down twin-engine airliner, nose up. */
  var PLANE =
    '<svg viewBox="0 0 100 100" focusable="false">' +
    '<defs>' +
      '<linearGradient id="dlF" x1="0" x2="1"><stop offset="0" stop-color="#AEB5BF"/><stop offset=".42" stop-color="#FFFFFF"/><stop offset=".7" stop-color="#E6E9ED"/><stop offset="1" stop-color="#9DA5B0"/></linearGradient>' +
      '<linearGradient id="dlW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4F6F8"/><stop offset="1" stop-color="#BEC4CC"/></linearGradient>' +
      '<linearGradient id="dlE" x1="0" x2="1"><stop offset="0" stop-color="#7E8794"/><stop offset=".5" stop-color="#D9DDE2"/><stop offset="1" stop-color="#6F7783"/></linearGradient>' +
    '</defs>' +
    // main wings, swept, with a darker trailing edge
    '<path d="M45.6 40 L7 60.5 Q5.6 61.6 6.4 63.2 L45.6 54.5 Z" fill="url(#dlW)"/>' +
    '<path d="M54.4 40 L93 60.5 Q94.4 61.6 93.6 63.2 L54.4 54.5 Z" fill="url(#dlW)"/>' +
    '<path d="M45.6 52.6 L7.2 62.1 L6.4 63.2 L45.6 54.5 Z M54.4 52.6 L92.8 62.1 L93.6 63.2 L54.4 54.5 Z" fill="#9AA2AD" opacity=".7"/>' +
    // engines under the wings
    '<rect x="25.2" y="42.5" width="6.2" height="13" rx="3" fill="url(#dlE)"/>' +
    '<rect x="68.6" y="42.5" width="6.2" height="13" rx="3" fill="url(#dlE)"/>' +
    '<rect x="25.9" y="42.5" width="4.8" height="2.2" rx="1.1" fill="#3B4250"/>' +
    '<rect x="69.3" y="42.5" width="4.8" height="2.2" rx="1.1" fill="#3B4250"/>' +
    // horizontal stabilisers
    '<path d="M46.6 81 L30.5 90.6 Q29.8 91.6 30.6 92.4 L46.6 88.4 Z" fill="url(#dlW)"/>' +
    '<path d="M53.4 81 L69.5 90.6 Q70.2 91.6 69.4 92.4 L53.4 88.4 Z" fill="url(#dlW)"/>' +
    // fuselage
    '<path d="M50 3 C53.6 3 54.6 9.5 54.6 16 L54.6 78 C54.6 85 52.8 93 50 97 C47.2 93 45.4 85 45.4 78 L45.4 16 C45.4 9.5 46.4 3 50 3 Z" fill="url(#dlF)"/>' +
    // cockpit glazing and a brand stripe on the fin
    '<path d="M47.6 10.4 Q50 8.4 52.4 10.4 L52 12.6 Q50 11.6 48 12.6 Z" fill="#253041"/>' +
    '<rect x="49.35" y="79" width="1.3" height="15" rx=".6" fill="#5E1A5E"/>' +
    '</svg>';

  function build(state) {
    if (el) return el;
    el = document.createElement('div');
    el.className = 'dl' + (state ? ' ' + state : '');
    el.setAttribute('role', 'status');
    el.innerHTML =
      '<span class="dl-sr">Loading page</span>' +
      '<div class="dl-stage" aria-hidden="true">' +
        '<span class="dl-ring dl-r3"></span>' +
        '<span class="dl-ring dl-r2"></span>' +
        '<span class="dl-ring dl-r1"></span>' +
        '<span class="dl-glow"></span>' +
        '<span class="dl-globe"><span class="dl-map"><i></i><i></i></span><span class="dl-shade"></span></span>' +
        '<span class="dl-orbit"><span class="dl-trail"></span><span class="dl-plane">' + PLANE + '</span></span>' +
      '</div>' +
      '<p class="dl-cap" aria-hidden="true">Disha Travel Services</p>';
    el.style.setProperty('--dl-tex', 'url("' + TEXTURE + '")');
    // it lives on <html>, outside <body>, so it can be up before the body exists
    root.appendChild(el);

    var img = new Image();
    img.onload = function () { el.classList.add('has-tex'); };
    img.src = TEXTURE;
    return el;
  }

  function hide() {
    if (!el) return;
    el.classList.remove('is-instant', 'is-on');
    root.classList.remove('dl-hold');
  }

  /* ---- arriving ---------------------------------------------------- */
  var t0 = store(function (s) { var v = s.getItem(KEY); s.removeItem(KEY); return v; });
  var arriving = t0 && Date.now() - Number(t0) < 15000;

  if (arriving) {
    build('is-on is-instant');
    root.classList.add('dl-hold');

    var started = Number(t0);
    var done = false;
    var min = still ? 350 : MIN_MS;
    var finish = function () {
      if (done) return;
      done = true;
      var wait = Math.max(0, min - (Date.now() - started));
      setTimeout(function () {
        // re-enable transitions for the fade-out on the next frame
        requestAnimationFrame(hide);
      }, wait);
    };
    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish);
    setTimeout(finish, MAX_MS);
  }

  /* Back/forward cache: a restored page must never come back covered. */
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { hide(); store(function (s) { s.removeItem(KEY); }); }
  });

  /* Build the hidden overlay once the page is idle, so the first
     transition is instant and the globe texture is already cached. */
  if (!arriving) {
    window.addEventListener('load', function () {
      if (window.requestIdleCallback) window.requestIdleCallback(function () { build(); }, { timeout: 2000 });
      else setTimeout(function () { build(); }, 300);
    });
  }

  /* ---- leaving ----------------------------------------------------- */
  function isPageLink(a, e) {
    if (e.defaultPrevented || e.button !== 0) return false;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
    if (a.hasAttribute('download') || a.hasAttribute('data-no-loader')) return false;
    if (a.target && a.target !== '_self') return false;
    var raw = a.getAttribute('href') || '';
    if (!raw || raw.charAt(0) === '#') return false;
    if (a.protocol !== location.protocol || a.host !== location.host) return false;
    // same document, different hash: an in-page jump, not a page load
    if (a.pathname === location.pathname && a.search === location.search) return false;
    return true;
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || !isPageLink(a, e)) return;
    e.preventDefault();

    var o = build();
    o.classList.remove('is-instant');
    void o.offsetWidth;            // commit the hidden state so the fade runs
    o.classList.add('is-on');
    store(function (s) { s.setItem(KEY, String(Date.now())); });

    var href = a.href;
    setTimeout(function () { location.href = href; }, still ? 0 : LEAVE_MS);
  });
})();
