/* Disha Travel Services — packages listing filters + detail drawer */
(function () {
  'use strict';

  var P = window.DISHA_PKGS;
  if (!P) return;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };
  var PLAN = 'contact-us.html?dest=';

  var state = { region: {}, length: {}, type: {}, month: null };

  function inMonths(m, mon) {
    if (!m || !mon) return true;
    var parts = String(m).split(',');
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i].trim();
      if (!p) continue;
      var ab = p.split('-').map(Number);
      var a = ab[0], b = ab[1] || a;
      if (a <= b) { if (mon >= a && mon <= b) return true; }
      else { if (mon >= a || mon <= b) return true; }
    }
    return false;
  }

  function active(map) {
    return Object.keys(map).filter(function (k) { return map[k]; });
  }

  function match(pkg) {
    var rs = active(state.region);
    if (rs.length && rs.indexOf(pkg.r) < 0) return false;
    var ls = active(state.length);
    if (ls.length) {
      var ok = ls.some(function (id) {
        var L = P.lengths.find(function (x) { return x[0] === id; });
        return L && pkg.nights >= L[2] && pkg.nights <= L[3];
      });
      if (!ok) return false;
    }
    var ts = active(state.type);
    if (ts.length && !ts.some(function (t) { return (pkg.t || []).indexOf(t) > -1; })) return false;
    if (state.month && !inMonths(pkg.m, state.month)) return false;
    return true;
  }

  function priceHtml(pkg) {
    if (pkg.price == null) return '<b>Price on request</b><span>Quoted after enquiry</span>';
    var basis = /\(([^)]*)\)/.exec(pkg.priceNote || '');
    return '<b><small>From</small> USD ' + Number(pkg.price).toLocaleString('en-US') + '</b>' +
      '<span>per person' + (basis ? ' · ' + esc(basis[1]) : '') + '</span>';
  }

  function card(pkg) {
    var pic = pkg.img
      ? '<img src="' + esc(pkg.img) + '" alt="' + esc(pkg.alt || '') + '" loading="lazy">'
      : '<span class="pk-nopic" aria-hidden="true"><img src="assets/images/graphics/world-map-light.svg" alt=""><b>' + esc(pkg.dest) + '</b></span>';
    return (
      '<article class="pk-card" data-id="' + esc(pkg.id) + '">' +
        '<button type="button" class="pk-pic pk-open" data-id="' + esc(pkg.id) + '" aria-label="View the ' + esc(pkg.name) + ' itinerary">' + pic +
          '<span class="pk-badge">' + esc(pkg.dur) + '</span>' +
        '</button>' +
        '<div class="pk-body">' +
          '<p class="pk-dest">' + esc(pkg.dest) + '</p>' +
          '<h3>' + esc(pkg.name) + '</h3>' +
          '<p class="pk-line">' + esc(pkg.line) + '</p>' +
          '<dl class="pk-facts">' +
            '<div><dt>Route</dt><dd>' + esc(pkg.cities) + '</dd></div>' +
            '<div><dt>Best time</dt><dd>' + esc(pkg.best) + '</dd></div>' +
          '</dl>' +
          '<div class="pk-foot">' +
            '<div class="pk-price">' + priceHtml(pkg) + '</div>' +
            '<div class="pk-act">' +
              '<button type="button" class="btn btn-outline pk-open" data-id="' + esc(pkg.id) + '">View Itinerary</button>' +
              '<a class="btn btn-purple" href="' + PLAN + encodeURIComponent(pkg.name) + '#enquiry" data-enquiry data-service="Holiday package">Enquire</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function renderFilters() {
    var box = $('.pk-fgroups');
    if (!box) return;
    var count = function (fn) { return P.list.filter(fn).length; };
    var opt = function (f, v, label, n) {
      if (!n) return '';   // never offer a choice that returns nothing
      return '<label class="pk-opt"><input type="checkbox" data-f="' + f + '" value="' + v + '"><span class="pk-box"></span>' +
        '<span>' + esc(label) + '</span><em>' + n + '</em></label>';
    };
    var html = '<div class="pk-fg"><h3>Region</h3>';
    P.regions.forEach(function (r) { html += opt('region', r.id, r.name, count(function (p) { return p.r === r.id; })); });
    html += '</div><div class="pk-fg"><h3>Trip length</h3>';
    P.lengths.forEach(function (L) { html += opt('length', L[0], L[1], count(function (p) { return p.nights >= L[2] && p.nights <= L[3]; })); });
    html += '</div><div class="pk-fg"><h3>Trip type</h3>';
    P.types.forEach(function (t) { html += opt('type', t[0], t[1], count(function (p) { return (p.t || []).indexOf(t[0]) > -1; })); });
    html += '</div><div class="pk-fg"><h3>Food</h3>' + opt('type', 'veg', 'Pure veg & Jain meals', count(function (p) { return (p.t || []).indexOf('veg') > -1; })) + '</div>';
    html += '<div class="pk-fg"><h3>Best month to go</h3><div class="pk-months">';
    ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].forEach(function (label, i) {
      html += '<label class="pk-mon"><input type="radio" name="pk-month" data-f="month" value="' + (i + 1) + '"><span>' + label + '</span></label>';
    });
    html += '</div><label class="pk-anymonth"><input type="radio" name="pk-month" data-f="month" value="" checked><span>Any month</span></label></div>';
    box.innerHTML = html;
  }

  function render() {
    var grid = $('#pkGrid');
    var count = $('#pkCount');
    if (!grid) return;
    var shown = P.list.filter(match);
    if (!shown.length) {
      grid.innerHTML =
        '<div class="pk-empty">' +
          '<h3>No packages match those filters.</h3>' +
          '<p>Clear a filter, or enquire and we’ll suggest something that fits.</p>' +
          '<button type="button" class="btn btn-purple pk-reset">Clear filters</button>' +
        '</div>';
    } else {
      grid.innerHTML = shown.map(card).join('');
    }
    if (count) {
      count.innerHTML = 'Showing <b>' + shown.length + '</b> of ' + P.list.length + ' packages';
    }
    var n =
      active(state.region).length +
      active(state.length).length +
      active(state.type).length +
      (state.month ? 1 : 0);
    $$('.pk-filterbtn b').forEach(function (b) { b.textContent = n ? n : ''; });
  }

  function byId(id) {
    for (var i = 0; i < P.list.length; i++) if (P.list[i].id === id) return P.list[i];
    return null;
  }

  function openDetail(id) {
    var pkg = byId(id);
    var dd = $('#pkd');
    if (!pkg || !dd) return;
    var days = (pkg.daysPlan || []).map(function (x) {
      return '<li><em>Day ' + x.d + '</em><div><b>' + esc(x.t) + '</b><span>' + esc(String(x.s).replace(/ — /g, ': ')) + '</span></div></li>';
    }).join('');
    var hl = (pkg.highlights || []).map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('');
    var inc = (pkg.includes || []).map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('');
    var exc = (pkg.excludes || []).map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('');

    var head = pkg.img
      ? '<header class="pkd-hero"><img src="' + esc(pkg.img) + '" alt="' + esc(pkg.alt || '') + '">'
      : '<header class="pkd-hero is-plain"><img class="pkd-map" src="assets/images/graphics/world-map-light.svg" alt="">';
    $('.pkd-scroll', dd).innerHTML =
      head + '<div class="pkd-ht"><span class="pkd-k">' + esc(pkg.dest) + ' · ' + esc(pkg.dur) + '</span>' +
        '<h2 id="pkdTitle">' + esc(pkg.name) + '</h2></div></header>' +
      '<div class="pkd-body">' +
        '<p class="pkd-about">' + esc(pkg.about) + '</p>' +
        '<dl class="pkd-facts">' +
          '<div><dt>Route</dt><dd>' + esc(pkg.cities) + '</dd></div>' +
          '<div><dt>Best time</dt><dd>' + esc(pkg.best) + '</dd></div>' +
          '<div><dt>Price</dt><dd>' + esc(pkg.price == null ? 'On request' : pkg.priceNote) + '</dd></div>' +
        '</dl>' +
        (hl ? '<h3>Highlights</h3><ul class="pkd-hl">' + hl + '</ul>' : '') +
        '<h3>Day by day</h3><ol class="pkd-days">' + days + '</ol>' +
        (inc || exc ? '<div class="pkd-ie">' +
          (inc ? '<div><h3>Included</h3><ul class="pkd-hl is-yes">' + inc + '</ul></div>' : '') +
          (exc ? '<div><h3>Not included</h3><ul class="pkd-hl is-no">' + exc + '</ul></div>' : '') + '</div>' : '') +
        '<p class="pkd-note">Prices are starting rates per person and change with season, hotel category and group size. We confirm the final quote in INR after you enquire.</p>' +
      '</div>';
    $('.pkd-scroll', dd).scrollTop = 0;

    $('.pkd-plan', dd).href = PLAN + encodeURIComponent(pkg.name) + '#enquiry';
    dd.classList.add('is-open');
    dd.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (history.replaceState) history.replaceState(null, '', '#' + pkg.id);
  }

  function closeDetail() {
    var dd = $('#pkd');
    if (!dd) return;
    dd.classList.remove('is-open');
    dd.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (history.replaceState) history.replaceState(null, '', location.pathname + location.search);
  }

  function bindFilters() {
    var root = $('.pk-filters');
    if (!root) return;
    root.addEventListener('change', function (e) {
      var el = e.target;
      if (!el.matches('input')) return;
      var f = el.getAttribute('data-f');
      if (f === 'month') {
        state.month = el.value ? Number(el.value) : null;
      } else if (f && state[f]) {
        state[f][el.value] = el.checked;
      }
      render();
    });
  }

  function clearFilters() {
    state = { region: {}, length: {}, type: {}, month: null };
    $$('.pk-filters input[type="checkbox"]').forEach(function (i) { i.checked = false; });
    var any = $('.pk-filters input[data-f="month"][value=""]');
    if (any) any.checked = true;
    render();
  }

  renderFilters();
  bindFilters();
  render();

  document.addEventListener('click', function (e) {
    var open = e.target.closest('.pk-open');
    if (open) { e.preventDefault(); openDetail(open.getAttribute('data-id')); return; }
    if (e.target.closest('.pk-reset, .pk-clear')) { clearFilters(); return; }
    if (e.target.closest('.pkd-x, .pkd-scrim')) { closeDetail(); return; }
    var btn = e.target.closest('.pk-filterbtn');
    if (btn) {
      var panel = $('.pk-filters');
      var scrim = $('.pk-scrim');
      var on = !panel.classList.contains('is-open');
      panel.classList.toggle('is-open', on);
      if (scrim) scrim.classList.toggle('is-on', on);
      btn.setAttribute('aria-expanded', on ? 'true' : 'false');
      return;
    }
    if (e.target.closest('.pk-scrim')) {
      $('.pk-filters').classList.remove('is-open');
      $('.pk-scrim').classList.remove('is-on');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDetail();
  });

  var hash = location.hash.replace(/^#/, '');
  if (hash && byId(hash)) openDetail(hash);
})();
