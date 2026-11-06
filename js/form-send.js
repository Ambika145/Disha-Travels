/* Disha Travel Services — sends every enquiry form on the site.
   The site has exactly 3 enquiry forms, and all of them use this file:
     1. The "Enquire Now" popup        (js/enquiry.js, every page)
     2. The Contact page form          (contact-us.html + js/pages.js)
     3. The service enquiry form       (7 service pages + js/services.js)

   Enquiries are emailed through Web3Forms (https://web3forms.com), so no
   backend is needed. To turn it on: create a free access key at
   web3forms.com with the email address that should receive enquiries,
   and paste it below. That is the only setting. */
(function () {
  'use strict';

  var ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';

  var ENDPOINT = 'https://api.web3forms.com/submit';
  var FALLBACK = 'Sorry, we couldn’t send your enquiry. Please call us on +91 80085 55000 or email info@dishats.com.';

  /* Spam trap: a hidden checkbox bots tick and people never see. */
  function trap(form) {
    if (form.querySelector('input[name="botcheck"]')) return;
    var hp = document.createElement('input');
    hp.type = 'checkbox';
    hp.name = 'botcheck';
    hp.tabIndex = -1;
    hp.setAttribute('autocomplete', 'off');
    hp.setAttribute('aria-hidden', 'true');
    hp.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0';
    form.appendChild(hp);
  }

  /* A line under the submit button for "Sending…" and error messages. */
  function note(form) {
    var el = form.querySelector('.form-msg');
    if (!el) {
      el = document.createElement('p');
      el.className = 'form-msg';
      el.setAttribute('role', 'alert');
      var btn = form.querySelector('[type="submit"]');
      (btn ? btn.parentNode : form).appendChild(el);
    }
    return el;
  }

  /* send(form, formName) → Promise. Resolves when the email is sent,
     rejects (after showing the fallback message) when it isn't. */
  function send(form, formName) {
    var btn = form.querySelector('[type="submit"]');
    var msg = note(form);
    var label = btn ? btn.innerHTML : '';

    var data = {};
    [].forEach.call(form.elements, function (el) {
      if (!el.name || el.disabled || el.type === 'submit' || el.type === 'button') return;
      if (el.type === 'checkbox') { if (el.name === 'botcheck') { if (el.checked) data.botcheck = true; } else data[el.name] = el.checked ? 'Yes' : 'No'; return; }
      var v = (el.value || '').trim();
      if (v) data[el.name] = v;
    });

    var who = data.name || 'Website visitor';
    var what = data.service || data.enquiry_type || data.need || '';
    data.access_key = ACCESS_KEY;
    data.subject = 'New enquiry: ' + (what ? what + ' — ' : '') + who;
    data.from_name = 'Disha Travel Services website';
    data.form = formName;
    data.page = location.pathname.split('/').pop() || 'index.html';
    if (data.email) data.replyto = data.email;

    msg.className = 'form-msg';
    msg.textContent = '';

    if (!ACCESS_KEY || ACCESS_KEY.indexOf('YOUR_') === 0) {
      console.warn('[Disha forms] Web3Forms access key is not set in js/form-send.js — enquiry was NOT sent.', data);
      msg.className = 'form-msg is-error';
      msg.textContent = FALLBACK;
      return Promise.reject(new Error('missing access key'));
    }

    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || j.success === false) throw new Error(j.message || 'HTTP ' + r.status); }); })
      .then(function () {
        if (btn) { btn.disabled = false; btn.innerHTML = label; }
      }, function (err) {
        if (btn) { btn.disabled = false; btn.innerHTML = label; }
        console.warn('[Disha forms] send failed:', err);
        msg.className = 'form-msg is-error';
        msg.textContent = FALLBACK;
        throw err;
      });
  }

  /* Add the spam trap as soon as each form exists. The popup is built later,
     so enquiry.js calls DishaForms.prepare() itself. */
  function prepare(form) { trap(form); }
  document.addEventListener('DOMContentLoaded', function () {
    [].forEach.call(document.querySelectorAll('form[data-send]'), prepare);
  });

  window.DishaForms = { send: send, prepare: prepare };
})();
