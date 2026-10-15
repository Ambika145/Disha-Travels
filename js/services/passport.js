/* Passport Services page only. Loaded after js/services.js. */
(function () {
  'use strict';
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* ---------- PASSPORT: six-month validity check ---------- */
  (function () {
    var form = $('#ppCheck'), out = $('#ppOut');
    if (!form) return;
    var fmt = function (d) { return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }); };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var exp = form.elements.expiry.valueAsDate, ret = form.elements.ret.valueAsDate;
      if (!exp || !ret) {
        out.innerHTML = '<div class="verdict err"><i class="bi bi-calendar-event"></i><div><b>Add both dates</b>Your passport expiry date and the date you return home.</div></div>';
        return;
      }
      var need = new Date(ret.getTime());
      need.setUTCMonth(need.getUTCMonth() + 6);
      if (exp >= need) {
        out.innerHTML = '<div class="verdict ok"><i class="bi bi-patch-check-fill"></i><div><b>You’re clear of the six-month rule.</b>Your passport is valid until ' + fmt(exp) +
          ', beyond ' + fmt(need) + '. Some countries have their own rules, so we confirm yours when we book.</div></div>';
      } else {
        out.innerHTML = '<div class="verdict warn"><i class="bi bi-exclamation-octagon-fill"></i><div><b>Renew before you travel.</b>Your passport expires on ' + fmt(exp) +
          ', inside six months of your return. Many countries will turn you away. <a href="contact-us.html#enquiry" data-enquiry data-service="Passport Services">Ask us about a renewal</a>.</div></div>';
      }
    });
  })();
})();
