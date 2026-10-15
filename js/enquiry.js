/* Disha Travel Services — sitewide enquiry popup.
   Every link or button with [data-enquiry] opens it. [data-service] pre-fills
   "What do you need help with?". Without this script the links simply fall
   back to their href (the enquiry form on contact-us.html). */
(function () {
  'use strict';

  var SERVICES = ['Visa Services', 'Passport Services', 'Forex Assistance', 'Travel Insurance', 'Air Tickets', 'Train Tickets', 'Bus Tickets'];
  var ALIAS = { 'Air Ticketing': 'Air Tickets' };
  var root, form, done, lastFocus = null;

  function build() {
    if (root) return;
    root = document.createElement('div');
    root.className = 'eq';
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML =
      '<div class="eq-scrim"></div>' +
      '<div class="eq-box" role="dialog" aria-modal="true" aria-labelledby="eqTitle">' +
        '<button type="button" class="eq-x" aria-label="Close"><i class="bi bi-x-lg"></i></button>' +
        '<header class="eq-head"><div class="eyebrow">Enquire</div>' +
          '<h2 id="eqTitle">Plan with a <em>travel expert</em></h2>' +
          '<p>Tell us a little, and we’ll take it from there.</p></header>' +
        '<div class="eq-body">' +
          '<form class="eq-form" novalidate>' +
            '<div class="eq-grid">' +
              '<div class="eq-f"><label for="eqName">Full name<sup>*</sup></label><input id="eqName" name="name" autocomplete="name" required><span class="eq-err"></span></div>' +
              '<div class="eq-f"><label for="eqMob">Mobile / WhatsApp<sup>*</sup></label><input id="eqMob" name="mobile" type="tel" autocomplete="tel" placeholder="+91" required><span class="eq-err"></span></div>' +
              '<div class="eq-f"><label for="eqEmail">Email</label><input id="eqEmail" name="email" type="email" autocomplete="email"><span class="eq-err"></span></div>' +
              '<div class="eq-f"><label for="eqNeed">What do you need help with?</label><select id="eqNeed" name="need">' +
                '<option>Holiday package</option>' + SERVICES.map(function (s) { return '<option>' + s + '</option>'; }).join('') +
                '<option>Something else</option></select></div>' +
              '<div class="eq-f"><label for="eqDest">Destination / country</label><input id="eqDest" name="destination"></div>' +
              '<div class="eq-f"><label for="eqMonth">Travel month</label><input id="eqMonth" name="month" type="month"></div>' +
              '<div class="eq-f"><label for="eqPax">Travellers</label><input id="eqPax" name="travellers" type="number" min="1" value="2" inputmode="numeric"></div>' +
              '<div class="eq-f full"><label for="eqNote">Anything we should know?</label><textarea id="eqNote" name="notes" placeholder="Jain meals, travelling with elders, visa refused before…"></textarea></div>' +
              '<label class="eq-wa"><input type="checkbox" name="whatsapp" checked><i class="bi bi-whatsapp"></i>Contact me on WhatsApp</label>' +
            '</div>' +
            '<div class="eq-foot"><button class="btn btn-purple" type="submit">Send Enquiry <i class="bi bi-send"></i></button>' +
              '<p>No payment required. One of our travel experts will get back to you within a day.</p></div>' +
          '</form>' +
          '<div class="eq-done" role="status" hidden><i class="bi bi-check-lg" aria-hidden="true"></i>' +
            '<h3>Thank you, <span class="eq-fn">there</span>.</h3><p>One of our travel experts will get back to you within a day.</p>' +
            '<button type="button" class="btn btn-outline eq-close2">Close</button></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(root);
    form = root.querySelector('.eq-form');
    done = root.querySelector('.eq-done');

    root.addEventListener('click', function (e) {
      if (e.target.classList.contains('eq-scrim') || e.target.closest('.eq-x') || e.target.closest('.eq-close2')) close();
    });
    form.addEventListener('submit', submit);
    form.addEventListener('input', function (e) {
      var f = e.target.closest('.eq-f');
      if (f && f.classList.contains('is-bad')) check(e.target);
    });
  }

  function check(input) {
    var v = input.value.trim(), msg = '';
    if (input.required && !v) msg = 'Please fill this in.';
    else if (input.type === 'tel' && v && v.replace(/\D/g, '').length < 10) msg = 'Please enter a valid mobile number.';
    else if (input.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = 'Please enter a valid email address.';
    var f = input.closest('.eq-f');
    f.classList.toggle('is-bad', !!msg);
    f.querySelector('.eq-err').textContent = msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }

  function submit(e) {
    e.preventDefault();
    var bad = null;
    ['eqName', 'eqMob', 'eqEmail'].forEach(function (id) {
      var el = form.querySelector('#' + id);
      if (!check(el) && !bad) bad = el;
    });
    if (bad) { bad.focus(); return; }
    // TODO: post new FormData(form) to the enquiry endpoint.
    root.querySelector('.eq-fn').textContent = form.elements.name.value.trim().split(/\s+/)[0] || 'there';
    form.hidden = true;
    done.hidden = false;
    root.querySelector('.eq-close2').focus();
  }

  function open(service) {
    build();
    lastFocus = document.activeElement;
    form.reset();
    form.hidden = false;
    done.hidden = true;
    [].forEach.call(form.querySelectorAll('.eq-f'), function (f) { f.classList.remove('is-bad'); f.querySelector('.eq-err') && (f.querySelector('.eq-err').textContent = ''); });
    var s = ALIAS[service] || service;
    var sel = form.elements.need;
    sel.value = s && [].some.call(sel.options, function (o) { return o.value === s; }) ? s : 'Holiday package';
    root.classList.add('is-open');
    root.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('eq-lock');
    setTimeout(function () { form.elements.name.focus({ preventScroll: true }); }, 80);
  }

  function close() {
    if (!root || !root.classList.contains('is-open')) return;
    root.classList.remove('is-open');
    root.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('eq-lock');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  document.addEventListener('keydown', function (e) {
    if (!root || !root.classList.contains('is-open')) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    var f = [].filter.call(root.querySelectorAll('button, input, select, textarea'), function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });

  // capture phase, so this runs before main.js and the page-transition loader
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-enquiry]');
    if (!t || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    open(t.getAttribute('data-service') || '');
  }, true);

  window.DishaEnquiry = { open: open, close: close };
})();
