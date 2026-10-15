/* Disha Travel Services — Destinations page.
   Renders js/destinations-data.js into the hero map, the filterable region
   directory (THE MAP), the A–Z index (THE LIST) and the month guide
   (THE CALENDAR), plus the destination detail drawer (#d-<id>). */
(function () {
  'use strict';

  var D = window.DISHA_DEST;
  if (!D) return;

  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MON1 = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  var PLAN = 'contact-us.html?dest=';

  var byId = {}, region = {};
  D.list.forEach(function (x) { byId[x.id] = x; });
  D.regions.forEach(function (r) { region[r.id] = r; });
  var intl = D.regions.filter(function (r) { return r.scope === 'intl'; });
  var india = D.regions.filter(function (r) { return r.scope === 'india'; });
  var inRegion = function (rid) { return D.list.filter(function (x) { return x.r === rid; }); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var plain = function (s) { return String(s).replace(/<[^>]+>/g, ''); };

  /* Miller projection, calibrated to assets/images/graphics/world-map-light.svg (1200 × 601). */
  function proj(lon, lat) {
    var y = 1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * lat * Math.PI / 180));
    return { x: (lon + 180) / 360 * 100, y: (383 - 191 * y) / 601 * 100 };
  }
  function smoothTo(el) {
    if (el) el.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
  }

  /* ==================================================================
     HERO — pins, pills, background layers
     ================================================================== */
  var hero = $('.dhero');
  var heroKeys = intl.map(function (r) { return r.id; }).concat('india');
  var heroInfo = function (k) { return k === 'india' ? D.indiaPin : region[k]; };
  var heroCount = function (k) {
    return k === 'india' ? D.list.filter(function (x) { return region[x.r].scope === 'india'; }).length : inRegion(k).length;
  };

  if (hero) {
    var map = $('#dhMap'), tip = $('.dh-tip', hero), bg = $('.dh-bg', hero), pills = $('.dh-pills', hero);
    var nowR = $('#dhNowRegion'), nowC = $('#dhNowCap');
    var layers = {};

    // one layer per region that has a genuine photograph; the first is in the markup
    intl.forEach(function (r) {
      if (!r.hero) return;
      var el = $('.dh-layer[data-k="' + r.id + '"]', bg);
      if (!el) {
        el = document.createElement('div');
        el.className = 'dh-layer';
        el.dataset.k = r.id;
        el.innerHTML = '<img src="' + r.hero.src + '" alt="" loading="lazy" decoding="async">';
        bg.appendChild(el);
      }
      layers[r.id] = el;
    });

    heroKeys.forEach(function (k) {
      var info = heroInfo(k);
      info.pins.forEach(function (p) {
        var pt = proj(p[0], p[1]);
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'dh-pin' + (k === 'india' ? ' is-india' : '');
        b.style.left = pt.x + '%';
        b.style.top = pt.y + '%';
        b.dataset.k = k;
        b.setAttribute('aria-label', info.name);
        b.removeAttribute('aria-hidden');
        map.appendChild(b);
      });
      var a = document.createElement('a');
      a.className = 'dh-pill' + (k === 'india' ? ' is-india' : '');
      a.href = '#rg-' + k;
      a.dataset.k = k;
      a.innerHTML = esc(info.name) + ' <small>' + heroCount(k) + '</small>';
      if (pills) pills.appendChild(a);
    });

    var current = null, autoTimer = null, userTouched = false;
    var tour = ['islands', 'se-asia', 'middle-east', 'europe'];

    var preview = function (k) {
      if (k === current) return;
      current = k;
      var info = heroInfo(k);
      $$('.dh-pin, .dh-pill', hero).forEach(function (el) { el.classList.toggle('is-on', el.dataset.k === k); });
      var p = proj(info.pins[0][0], info.pins[0][1]);
      tip.style.left = p.x + '%';
      tip.style.top = p.y + '%';
      tip.innerHTML = '<b>' + esc(info.name) + '</b><span>' + heroCount(k) + ' destinations</span>';
      tip.classList.add('is-on');
      Object.keys(layers).forEach(function (id) { layers[id].classList.toggle('is-on', id === k); });
      nowR.textContent = info.name;
      nowC.textContent = region[k] && region[k].hero ? region[k].hero.cap : info.line;
    };
    var stopTour = function () { userTouched = true; clearInterval(autoTimer); };

    hero.addEventListener('mouseover', function (e) {
      var t = e.target.closest('.dh-pin, .dh-pill');
      if (t) { stopTour(); preview(t.dataset.k); }
    });
    hero.addEventListener('focusin', function (e) {
      var t = e.target.closest('.dh-pin, .dh-pill');
      if (t) { stopTour(); preview(t.dataset.k); }
    });
    hero.addEventListener('click', function (e) {
      var t = e.target.closest('.dh-pin, .dh-pill');
      if (!t) return;
      e.preventDefault();
      stopTour();
      preview(t.dataset.k);
      goRegion(t.dataset.k);
    });

    preview('islands');
    if (!still) {
      var ti = 0;
      autoTimer = setInterval(function () {
        if (userTouched || document.hidden) return;
        var r = hero.getBoundingClientRect();
        if (r.bottom < 0) return;
        ti = (ti + 1) % tour.length;
        preview(tour[ti]);
      }, 6500);
    }
  }

  /* ==================================================================
     EXPLORER — render regions and tiles
     ================================================================== */
  var host = $('#dxRegions');
  var tilesById = {};

  function calBar(x) {
    return '<span class="tl-cal" aria-hidden="true">' + MON1.map(function (m, i) {
      return '<span class="' + (x.months.indexOf(i + 1) > -1 ? 'on' : '') + '"></span>';
    }).join('') + '</span>';
  }
  function shortBest(x) {
    if (!x.months.length) return 'Varies by region';
    if (x.months.length === 12) return 'Year-round';
    return plain(x.best).replace(/\s*\([^)]*\)/g, '').replace(/January/g, 'Jan').replace(/February/g, 'Feb').replace(/March/g, 'Mar')
      .replace(/April/g, 'Apr').replace(/June/g, 'Jun').replace(/July/g, 'Jul').replace(/August/g, 'Aug')
      .replace(/September/g, 'Sep').replace(/October/g, 'Oct').replace(/November/g, 'Nov').replace(/December/g, 'Dec')
      .replace(/ for the Christmas markets| for snow/g, '');
  }
  function tilePic(x) {
    if (x.img) return '<span class="tl-pic"><img src="' + x.img + '" alt="" loading="lazy" decoding="async"></span>';
    var pinSrc = region[x.r].pins ? region[x.r].pins[0] : D.indiaPin.pins[0];
    var p = proj(pinSrc[0], pinSrc[1]);
    return '<span class="tl-pic is-map"><span class="tl-map"><img src="assets/images/graphics/world-map-light.svg" alt="" loading="lazy">' +
      '<span class="tl-pin" style="left:' + p.x + '%;top:' + p.y + '%"></span></span></span>';
  }
  function tile(x) {
    var a = document.createElement('a');
    a.className = 'tl drv';
    a.href = '#d-' + x.id;
    a.dataset.id = x.id;
    a.setAttribute('aria-label', 'Explore ' + x.name + '. ' + plain(x.line));
    a.innerHTML = tilePic(x) +
      '<span class="tl-body">' +
        (x.sp ? '<span class="tl-sp"><i class="bi bi-star-fill"></i>Disha Specialist</span>' : '') +
        '<h4>' + esc(x.name) + (x.place ? ' <small>' + esc(x.place) + '</small>' : '') + '</h4>' +
        '<p class="tl-line">' + x.line + '</p>' +
        '<span class="tl-meta"><span>' + esc(shortBest(x)) + '</span><span>' + esc(x.dur.replace(/, or .*/, '')) + '</span></span>' +
      '</span>';
    tilesById[x.id] = a;
    return a;
  }
  function regionBlock(r, n) {
    var sec = document.createElement('section');
    sec.className = 'rg';
    sec.id = 'rg-' + r.id;
    sec.dataset.r = r.id;
    var items = inRegion(r.id);
    sec.innerHTML = '<header class="rg-head"><h3>' + esc(r.name) + '</h3><span class="rg-count"></span></header><div class="tl-grid"></div>';
    var grid = $('.tl-grid', sec);
    items.forEach(function (x) { grid.appendChild(tile(x)); });
    return sec;
  }

  if (host) {
    intl.forEach(function (r, i) { host.appendChild(regionBlock(r, i + 1)); });
    var part = document.createElement('div');
    part.className = 'rg-part';
    part.id = 'rg-india';
    part.innerHTML = '<div class="eyebrow">India &amp; Around</div><h2>Closer to home, and no less worth the trip.</h2>' +
      '<p>Every state we sell, grouped five ways, plus the two countries next door that need no visa and no long-haul flight.</p>';
    host.appendChild(part);
    india.forEach(function (r, i) { host.appendChild(regionBlock(r, i + 1)); });
  }

  /* ==================================================================
     FILTERS
     ================================================================== */
  var state = { sp: false, veg: false, r: [], m: [], len: [], t: [], a: [] };
  var panel = $('#dxFilters');
  var count = function (fn) { return D.list.filter(fn).length; };

  function opt(group, val, label, n, cls, extra) {
    return '<label class="df-opt' + (cls ? ' ' + cls : '') + (extra ? ' is-extra' : '') + '">' +
      '<input type="checkbox" data-g="' + group + '" value="' + val + '"><span class="df-box"></span>' +
      '<span>' + label + '</span><em>' + n + '</em></label>';
  }
  function longGroup(title, group, list) {
    var html = '<div class="df-group" data-long><h3>' + title + '</h3>';
    list.forEach(function (o, i) {
      html += opt(group, o[0], esc(o[1]), count(function (x) { return x[group].indexOf(o[0]) > -1; }), '', i >= 6);
    });
    return html + (list.length > 6 ? '<button type="button" class="df-more" aria-expanded="false">Show ' + (list.length - 6) + ' more</button>' : '') + '</div>';
  }

  if (panel) {
    var g = '';
    g += '<div class="df-group"><h3>Region</h3><span class="df-sub">International</span>';
    intl.forEach(function (r) { g += opt('r', r.id, esc(r.name), inRegion(r.id).length); });
    g += '<span class="df-sub">India &amp; Around</span>';
    india.forEach(function (r) { g += opt('r', r.id, esc(r.name), inRegion(r.id).length); });
    g += '</div>';
    g += '<div class="df-group"><h3>Best month to go</h3><div class="df-months">' + MON.map(function (m, i) {
      return '<button type="button" class="df-month" data-m="' + (i + 1) + '" aria-pressed="false" title="' +
        count(function (x) { return x.months.indexOf(i + 1) > -1; }) + ' destinations">' + m + '</button>';
    }).join('') + '</div></div>';
    g += '<div class="df-group"><h3>Trip length</h3>';
    D.lengths.forEach(function (l) { g += opt('lens', l[0], l[1], count(function (x) { return x.lens.indexOf(l[0]) > -1; })); });
    g += '</div>';
    g += longGroup('Trip type', 't', D.types);
    $('.df-groups', panel).innerHTML = g;
  }

  var LABEL = {};
  intl.concat(india).forEach(function (r) { LABEL['r:' + r.id] = r.name; });
  D.lengths.forEach(function (l) { LABEL['lens:' + l[0]] = l[1]; });
  D.types.forEach(function (t) { LABEL['t:' + t[0]] = t[1]; });
  D.acts.forEach(function (a) { LABEL['a:' + a[0]] = a[1]; });
  MON.forEach(function (m, i) { LABEL['m:' + (i + 1)] = m; });

  function matches(x) {
    if (state.sp && !x.sp) return false;
    if (state.veg && !x.veg) return false;
    if (state.r.length && state.r.indexOf(x.r) < 0) return false;
    if (state.m.length && !state.m.some(function (m) { return x.months.indexOf(m) > -1; })) return false;
    if (state.len.length && !state.len.some(function (l) { return x.lens.indexOf(l) > -1; })) return false;
    if (state.t.length && !state.t.some(function (t) { return x.t.indexOf(t) > -1; })) return false;
    if (state.a.length && !state.a.some(function (a) { return x.a.indexOf(a) > -1; })) return false;
    return true;
  }
  function activeCount() {
    return (state.sp ? 1 : 0) + (state.veg ? 1 : 0) + state.r.length + state.m.length + state.len.length + state.t.length + state.a.length;
  }
  var visibleIds = D.list.map(function (x) { return x.id; });

  function apply() {
    var shown = 0;
    visibleIds = [];
    D.list.forEach(function (x) {
      var ok = matches(x);
      if (tilesById[x.id]) tilesById[x.id].hidden = !ok;
      if (ok) { shown++; visibleIds.push(x.id); }
    });
    $$('.rg', host).forEach(function (sec) {
      var n = inRegion(sec.dataset.r).filter(matches).length;
      sec.hidden = !n;
      $('.rg-count', sec).textContent = n + (n === 1 ? ' destination' : ' destinations');
      var link = $('.dx-strip a[data-r="' + sec.dataset.r + '"]');
      if (link) link.classList.toggle('is-gone', !n);
    });
    var indiaN = D.list.filter(function (x) { return region[x.r].scope === 'india' && matches(x); }).length;
    $('#rg-india').hidden = !indiaN;
    var il = $('.dx-strip a[data-r="india"]');
    if (il) il.classList.toggle('is-gone', !indiaN);

    $('.dx-count').innerHTML = 'Showing <b>' + shown + '</b> of ' + D.list.length + ' destinations';
    $('.dx-empty').hidden = shown > 0;
    $('.df-clear').disabled = !activeCount();
    $('.dx-filterbtn b').textContent = activeCount() || '';
    var applyBtn = $('.df-apply .btn');
    if (applyBtn) applyBtn.textContent = 'Show ' + shown + (shown === 1 ? ' destination' : ' destinations');

    // removable chips
    var chips = [];
    if (state.sp) chips.push(['sp', '1', '★ Disha Specialist']);
    state.r.forEach(function (v) { chips.push(['r', v, LABEL['r:' + v]]); });
    state.m.forEach(function (v) { chips.push(['m', v, LABEL['m:' + v]]); });
    state.len.forEach(function (v) { chips.push(['lens', v, LABEL['lens:' + v]]); });
    state.t.forEach(function (v) { chips.push(['t', v, LABEL['t:' + v]]); });
    state.a.forEach(function (v) { chips.push(['a', v, LABEL['a:' + v]]); });
    if (state.veg) chips.push(['veg', '1', 'Easy for vegetarians']);
    $('.dx-chips').innerHTML = chips.map(function (c) {
      return '<button type="button" class="dx-chip" data-g="' + c[0] + '" data-v="' + c[1] + '" aria-label="Remove filter: ' + esc(c[2]) + '">' +
        esc(c[2]) + '<i class="bi bi-x"></i></button>';
    }).join('');
  }

  function setOpt(gname, val, on) {
    if (gname === 'sp' || gname === 'veg') { state[gname] = on; }
    else {
      var key = gname === 'lens' ? 'len' : gname;
      var v = gname === 'm' ? Number(val) : val;
      var arr = state[key], i = arr.indexOf(v);
      if (on && i < 0) arr.push(v);
      if (!on && i > -1) arr.splice(i, 1);
    }
  }
  function syncControls() {
    $$('input[data-g]', panel).forEach(function (inp) {
      var gname = inp.dataset.g;
      if (gname === 'sp' || gname === 'veg') inp.checked = state[gname];
      else inp.checked = state[gname === 'lens' ? 'len' : gname].indexOf(inp.value) > -1;
    });
    $$('.df-month', panel).forEach(function (b) {
      b.setAttribute('aria-pressed', state.m.indexOf(Number(b.dataset.m)) > -1 ? 'true' : 'false');
    });
  }
  function clearAll() {
    state = { sp: false, veg: false, r: [], m: [], len: [], t: [], a: [] };
    syncControls();
    apply();
  }

  if (panel) {
    panel.addEventListener('change', function (e) {
      var inp = e.target.closest('input[data-g]');
      if (!inp) return;
      setOpt(inp.dataset.g, inp.value, inp.checked);
      apply();
    });
    panel.addEventListener('click', function (e) {
      var m = e.target.closest('.df-month');
      if (m) {
        var on = m.getAttribute('aria-pressed') !== 'true';
        m.setAttribute('aria-pressed', on ? 'true' : 'false');
        setOpt('m', m.dataset.m, on);
        apply();
        return;
      }
      var more = e.target.closest('.df-more');
      if (more) {
        var grp = more.closest('.df-group');
        var open = grp.classList.toggle('is-open');
        more.setAttribute('aria-expanded', open ? 'true' : 'false');
        more.textContent = open ? 'Show fewer' : 'Show ' + $$('.is-extra', grp).length + ' more';
      }
    });
    $('.df-clear', panel).addEventListener('click', clearAll);
    $('.dx-chips').addEventListener('click', function (e) {
      var c = e.target.closest('.dx-chip');
      if (!c) return;
      setOpt(c.dataset.g, c.dataset.v, false);
      syncControls();
      apply();
    });
    $('.dx-empty .df-reset').addEventListener('click', clearAll);

    // filter sheet (tablet & mobile)
    var scrim = $('.df-scrim');
    var openSheet = function (on) {
      panel.classList.toggle('is-open', on);
      scrim.hidden = !on;
      $('.dx-filterbtn').setAttribute('aria-expanded', on ? 'true' : 'false');
      if (on) $('.df-x', panel).focus();
    };
    $('.dx-filterbtn').addEventListener('click', function () { openSheet(true); });
    $('.df-x', panel).addEventListener('click', function () { openSheet(false); });
    $('.df-apply .btn', panel).addEventListener('click', function () {
      openSheet(false);
      smoothTo($('.dx-bar'));
    });
    scrim.addEventListener('click', function () { openSheet(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) openSheet(false);
    });
  }

  /* ==================================================================
     VIEWS + jump strip
     ================================================================== */
  var views = $$('.dx-view');
  var strip = $('.dx-strip');
  function setView(name) {
    views.forEach(function (v) {
      var on = v.dataset.view === name;
      v.setAttribute('aria-selected', on ? 'true' : 'false');
      v.tabIndex = on ? 0 : -1;
      $('#' + v.getAttribute('aria-controls')).hidden = !on;
    });
    if (strip) strip.hidden = name !== 'map';
  }
  views.forEach(function (v, i) {
    v.addEventListener('click', function () { setView(v.dataset.view); });
    v.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight') n = (i + 1) % views.length;
      if (e.key === 'ArrowLeft') n = (i - 1 + views.length) % views.length;
      if (n === null) return;
      e.preventDefault();
      setView(views[n].dataset.view);
      views[n].focus();
    });
  });
  $$('[data-open-view]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      setView(a.dataset.openView);
      smoothTo($('#explore'));
    });
  });

  if (strip) {
    var nav = $('nav', strip);
    intl.forEach(function (r) {
      nav.insertAdjacentHTML('beforeend', '<a href="#rg-' + r.id + '" data-r="' + r.id + '">' + esc(r.name) + '</a>');
    });
    nav.insertAdjacentHTML('beforeend', '<a href="#rg-india" data-r="india" class="is-india">India &amp; Around</a>');
    var stripLinks = $$('a', nav);
    var markStrip = function (rid) {
      stripLinks.forEach(function (a) { a.classList.toggle('is-on', a.dataset.r === rid); });
      var on = $('a.is-on', nav);
      if (on && nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: on.offsetLeft - 20, behavior: still ? 'auto' : 'smooth' });
    };
    if (window.IntersectionObserver) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var rid = en.target.dataset.r;
          markStrip(rid && region[rid] && region[rid].scope === 'india' ? 'india' : (rid || 'india'));
        });
      }, { rootMargin: '-30% 0px -60% 0px' });
      $$('.rg, .rg-part', host).forEach(function (s) { io.observe(s); });
    }
  }

  // in-page links rendered here (main.js only binds links present at load)
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#rg-"], a[href^="#az-"], .cal-go a[href^="#rg-"]');
    if (!a || a.closest('.dhero')) return;
    var target = document.getElementById(a.getAttribute('href').slice(1));
    if (!target) return;
    e.preventDefault();
    smoothTo(target);
  });

  /* Hero pill / pin → the region in THE MAP view, clearing any filter that hides it. */
  function goRegion(k) {
    setView('map');
    var target = $('#rg-' + k);
    if (target && target.hidden) { clearAll(); }
    smoothTo(target);
  }

  /* ==================================================================
     THE LIST — A to Z
     ================================================================== */
  var az = $('#azGrid');
  if (az) {
    var entries = D.list.map(function (x) { return [x.name, x.id]; }).concat(D.aliases);
    var seen = {};
    entries = entries.filter(function (e) { var k = e[0] + '|' + e[1]; if (seen[k]) return false; seen[k] = 1; return true; })
      .sort(function (a, b) { return a[0].localeCompare(b[0]); });
    var letters = {};
    entries.forEach(function (e) { var L = e[0].charAt(0).toUpperCase(); (letters[L] = letters[L] || []).push(e); });
    var keys = Object.keys(letters).sort();
    $('#azNav').innerHTML = keys.map(function (L) { return '<a href="#az-' + L + '">' + L + '</a>'; }).join('');
    az.innerHTML = keys.map(function (L) {
      return '<div class="az-l" id="az-' + L + '"><h4>' + L + '</h4><ul>' + letters[L].map(function (e) {
        var x = byId[e[1]];
        var sub = e[0] !== x.name ? 'see ' + x.name : region[x.r].name;
        return '<li><a href="#d-' + x.id + '"><span>' + esc(e[0]) + '</span><small>' + esc(sub) + '</small></a></li>';
      }).join('') + '</ul></div>';
    }).join('');
  }

  /* ==================================================================
     THE CALENDAR
     ================================================================== */
  var cal = $('#calRows');
  if (cal) {
    var thisMonth = new Date().getMonth() + 1;
    cal.innerHTML = D.calendar.map(function (b) {
      var now = b.months.indexOf(thisMonth) > -1;
      return '<div class="cal-row' + (now ? ' is-now' : '') + '"><div class="cal-when"><b>' + esc(b.when) + '</b>' +
        (now ? '<span class="cal-now">This month</span>' : '') + '</div><div class="cal-go">' +
        b.go.map(function (gItem) {
          var href = gItem[1].indexOf('r:') === 0 ? '#rg-' + gItem[1].slice(2) : '#d-' + gItem[1];
          var attr = gItem[1].indexOf('r:') === 0 ? ' data-to-map' : '';
          return '<a href="' + href + '"' + attr + '>' + esc(gItem[0]) + (gItem[2] ? ' <em>' + esc(gItem[2]) + '</em>' : '') + '</a>';
        }).join('') + '</div></div>';
    }).join('');
    cal.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-to-map]');
      if (!a) return;
      e.preventDefault();
      e.stopPropagation();
      goRegion(a.getAttribute('href').slice(4));
    }, true);
  }

  /* ==================================================================
     DETAIL DRAWER  (#d-<id>)
     ================================================================== */
  var dd = $('#dd'), ddPanel = $('.dd-panel', dd), lastFocus = null, openId = null;

  function heroOf(x) {
    if (x.img) return '<img src="' + x.img + '" alt="' + esc(x.alt || x.name) + '">';
    var pinSrc = region[x.r].pins ? region[x.r].pins[0] : D.indiaPin.pins[0];
    var p = proj(pinSrc[0], pinSrc[1]);
    return '<span class="dd-dots" aria-hidden="true"><img src="assets/images/graphics/world-map-light.svg" alt=""><span class="dd-pin" style="left:' + p.x + '%;top:' + p.y + '%"></span></span>';
  }
  function render(x) {
    var r = region[x.r];
    var calRow = '<span class="dd-cal" aria-hidden="true">' + MON.map(function (m, i) {
      return '<span class="' + (x.months.indexOf(i + 1) > -1 ? 'on' : '') + '">' + m.charAt(0) + '</span>';
    }).join('') + '</span>';
    var order = visibleIds.indexOf(x.id) > -1 ? visibleIds : D.list.map(function (y) { return y.id; });
    var i = order.indexOf(x.id), prev = byId[order[i - 1]], next = byId[order[i + 1]];
    var plan = PLAN + encodeURIComponent(x.name) + '#enquiry';
    var where = r.scope === 'india' ? 'India & Around · ' + r.name : r.name;
    var sub = x.place || x.note || '';

    $('.dd-scroll', dd).innerHTML =
      '<header class="dd-hero">' + heroOf(x) +
        '<div class="dd-ht">' +
          '<span class="dd-region">' + esc(where) + '</span>' +
          '<h2 id="ddTitle">' + esc(x.name) + (sub ? ' <small>' + esc(sub) + '</small>' : '') + '</h2>' +
          '<div class="dd-badges">' +
            (x.sp ? '<span class="dd-badge"><i class="bi bi-star-fill"></i>Disha Specialist</span>' : '') +
            (x.veg ? '<span class="dd-badge veg"><i class="bi bi-flower1"></i>Easy for vegetarians</span>' : '') +
          '</div>' +
        '</div>' +
      '</header>' +
      '<div class="dd-layout">' +
        '<div class="dd-main">' +
          '<p class="dd-line">' + x.line + '</p>' +
          '<p class="dd-about">' + x.about + '</p>' +
          (x.cross ? '<p class="dd-also">' + esc(x.cross) + '</p>' : '') +
          (x.does ? '<h3 class="dd-h">What you’ll do</h3><ul class="dd-do">' +
            x.does.map(function (s) { return '<li><span>' + s + '</span></li>'; }).join('') + '</ul>' : '') +
          '<div class="dd-worth"><div><b>Worth knowing</b><p>' + x.worth + '</p></div></div>' +
        '</div>' +
        '<aside class="dd-side">' +
          '<div class="dd-card">' +
            '<h3>Trip at a glance</h3>' +
            '<div class="dd-row"><span>Best time</span><b>' + esc(x.best) + '</b>' + calRow + '</div>' +
            '<div class="dd-row"><span>Ideal length</span><b>' + esc(x.dur) + '</b></div>' +
            (x.good ? '<div class="dd-row"><span>Good for</span><b>' + esc(x.good) + '</b></div>' : '') +
            (x.also ? '<div class="dd-row"><span>Also</span><b>' + esc(x.also) + '</b></div>' : '') +
            '<div class="dd-act">' +
              '<a class="btn btn-primary dd-plan" href="' + plan + '" aria-label="Plan a trip to ' + esc(x.name) + '">Plan This Trip <i class="bi bi-arrow-right"></i></a>' +
              '<a class="btn btn-outline" href="tel:+918008555000"><i class="bi bi-telephone"></i>Talk to an Expert</a>' +
              '<p>No payment required. An enquiry, not a booking.</p>' +
            '</div>' +
          '</div>' +
          '<nav class="dd-pn" aria-label="More destinations">' +
            '<button type="button" class="prev"' + (prev ? ' data-id="' + prev.id + '"' : ' hidden') + '><i class="bi bi-arrow-left"></i><span><small>Previous</small>' + (prev ? esc(prev.name) : '') + '</span></button>' +
            '<button type="button" class="next"' + (next ? ' data-id="' + next.id + '"' : ' hidden') + '><span><small>Next</small>' + (next ? esc(next.name) : '') + '</span><i class="bi bi-arrow-right"></i></button>' +
          '</nav>' +
        '</aside>' +
      '</div>';
    // phone action bar keeps the same link
    var bar = $('.dd-cta .dd-plan', dd);
    if (bar) { bar.href = plan; bar.setAttribute('aria-label', 'Plan a trip to ' + x.name); }
    $('.dd-scroll', dd).scrollTop = 0;
  }

  function openDetail(id) {
    var x = byId[id];
    if (!x) return;
    if (!dd.classList.contains('is-open')) lastFocus = document.activeElement;
    openId = id;
    render(x);
    dd.classList.add('is-open');
    dd.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('dd-lock');
    document.title = x.name + ' | Destinations | Disha Travel Services';
    setTimeout(function () { $('.dd-x', dd).focus({ preventScroll: true }); }, 60);
  }
  function closeDetail(fromHash) {
    if (!openId) return;
    openId = null;
    dd.classList.remove('is-open');
    dd.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('dd-lock');
    document.title = baseTitle;
    if (!fromHash && location.hash.indexOf('#d-') === 0) {
      history.replaceState(null, '', location.pathname + location.search);
    }
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  var baseTitle = document.title;

  function fromHash() {
    var h = location.hash;
    if (h.indexOf('#d-') === 0 && byId[h.slice(3)]) openDetail(h.slice(3));
    else closeDetail(true);
  }
  window.addEventListener('hashchange', fromHash);

  dd.addEventListener('click', function (e) {
    if (e.target.closest('.dd-x') || e.target.classList.contains('dd-scrim')) { closeDetail(); return; }
    var pn = e.target.closest('.dd-pn button[data-id]');
    if (pn) {
      history.replaceState(null, '', '#d-' + pn.dataset.id);
      openDetail(pn.dataset.id);
    }
  });
  document.addEventListener('keydown', function (e) {
    if (!openId) return;
    if (e.key === 'Escape') { closeDetail(); return; }
    if (e.key !== 'Tab') return;
    var f = $$('a[href], button:not([hidden]), [tabindex]:not([tabindex="-1"])', ddPanel).filter(function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });

  /* ==================================================================
     BOOT
     ================================================================== */
  apply();
  setView('map');
  fromHash();
  // destinations.html#calendar / #list open those views directly
  if (location.hash === '#calendar') {
    setView('cal');
    setTimeout(function () { smoothTo($('#explore')); }, 60);
  }

  // tiles reveal as they scroll in, once
  if (!still && window.IntersectionObserver) {
    document.documentElement.classList.add('js-dreveal');
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('is-in');
        rio.unobserve(el);
        setTimeout(function () { el.style.transitionDelay = ''; }, 900);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    $$('.drv').forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 0.06 + 's';
      rio.observe(el);
    });
    setTimeout(function () { $$('.drv').forEach(function (el) { el.classList.add('is-in'); }); }, 5000);
  }
})();
