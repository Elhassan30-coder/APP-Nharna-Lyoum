(function () {
'use strict';
var root = document.getElementById('root'), app = document.getElementById('app');
if (!root || !app) return;

/* ---------- Installation (PWA) ---------- */
function head(tag, attrs) { var e = document.createElement(tag); for (var k in attrs) e.setAttribute(k, attrs[k]); document.head.appendChild(e); }
head('link', { rel: 'manifest', href: 'manifest.webmanifest' });
head('link', { rel: 'apple-touch-icon', href: 'apple-touch-icon.png' });
head('meta', { name: 'theme-color', content: '#1D4ED8' });
head('meta', { name: 'apple-mobile-web-app-capable', content: 'yes' });
head('meta', { name: 'mobile-web-app-capable', content: 'yes' });
head('meta', { name: 'apple-mobile-web-app-title', content: 'Nharna Lyoum' });
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
}

/* ---------- Textes ---------- */
var D = {
  en: { more: 'More', cli: 'New client', adv: 'Record advance', exp: 'New expense', add: 'Add', call: 'Call', wa: 'WhatsApp', all: 'Show whole month', none: 'No events this day' },
  fr: { more: 'Plus', cli: 'Nouveau client', adv: 'Enregistrer une avance', exp: 'Nouvelle charge', add: 'Ajouter', call: 'Appeler', wa: 'WhatsApp', all: 'Voir tout le mois', none: 'Aucun événement ce jour' },
  ar: { more: 'المزيد', cli: 'زبون جديد', adv: 'تسجيل تسبيق', exp: 'مصروف جديد', add: 'إضافة', call: 'اتصال', wa: 'واتساب', all: 'عرض الشهر كاملا', none: 'لا توجد حفلات في هذا اليوم' }
};
function s(k) { return (D[root.getAttribute('lang')] || D.en)[k]; }
function esc(v) { return String(v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function p2(n) { return (n < 10 ? '0' : '') + n; }

var IC = {
  call: 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
  wa: 'M4 20l1.3-4.2A8 8 0 1112 20a8 8 0 01-3.8-1z',
  plus: 'M12 5v14M5 12h14',
  dots: 'M5 12h.01M12 12h.01M19 12h.01'
};
function svg(d, w) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.8) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>'; }

/* ---------- Styles ---------- */
var css = [
'.mb-nav,.mb-fab,.mb-fabmenu,.mb-more,.mb-scrim{display:none}',
'.mb-contact{display:flex;flex-wrap:wrap;gap:6px;align-items:center}',
'.mb-contact a{display:inline-flex;align-items:center;gap:6px;min-height:36px;padding:4px 12px;border:1px solid var(--line);border-radius:999px;background:var(--surface);color:var(--accent);font-weight:600;font-size:13px;text-decoration:none}',
'.mb-contact a.wa{color:var(--good);border-color:var(--good)}',
'.mb-contact svg{width:16px;height:16px;flex:none}',
'.mb-daybar{margin:0 0 8px}',
'@media (max-width:820px){',
' nav.tabs{display:none!important}',
' #root{padding-bottom:calc(140px + env(safe-area-inset-bottom,0px))}',
' body .toast{bottom:calc(84px + env(safe-area-inset-bottom,0px))}',
' .mb-nav{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));position:fixed;inset-inline:0;bottom:0;z-index:15;background:var(--surface);border-top:1px solid var(--line);padding:6px 4px calc(6px + env(safe-area-inset-bottom,0px))}',
' .mb-nav button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:50px;border:0;border-radius:10px;background:none;color:var(--muted);font:inherit;font-size:11px;font-weight:600;padding:4px 2px;cursor:pointer;min-width:0}',
' .mb-nav button span{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
' .mb-nav button[aria-current="page"]{color:var(--accent);background:var(--accent-soft)}',
' .mb-nav svg{width:22px;height:22px}',
' .mb-fab{display:grid;place-items:center;position:fixed;inset-inline-end:16px;bottom:calc(76px + env(safe-area-inset-bottom,0px));z-index:14;width:56px;height:56px;border:0;border-radius:50%;background:var(--accent);color:var(--accent-ink);box-shadow:0 4px 14px rgba(15,22,38,.3);cursor:pointer;padding:0}',
' .mb-fab svg{width:26px;height:26px;transition:transform .15s}',
' body.mb-open-fab .mb-fab svg{transform:rotate(45deg)}',
' body[data-mb-view="backup"] .mb-fab{display:none}',
' .mb-fabmenu{position:fixed;inset-inline-end:16px;bottom:calc(142px + env(safe-area-inset-bottom,0px));z-index:14;flex-direction:column;align-items:flex-end;gap:8px}',
' body.mb-open-fab .mb-fabmenu{display:flex}',
' .mb-fabmenu button{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:8px 16px;border:1px solid var(--line);border-radius:999px;background:var(--surface);color:var(--ink);font:inherit;font-weight:600;cursor:pointer;box-shadow:0 2px 10px rgba(15,22,38,.18)}',
' .mb-fabmenu svg{width:18px;height:18px;color:var(--accent)}',
' body.mb-open-fab .mb-scrim,body.mb-open-more .mb-scrim{display:block;position:fixed;inset:0;z-index:13;background:rgba(15,22,38,.35)}',
' body.mb-open-more .mb-more{display:block;position:fixed;inset-inline:0;bottom:0;z-index:16;background:var(--surface);border-radius:16px 16px 0 0;border:1px solid var(--line);padding:16px 16px calc(80px + env(safe-area-inset-bottom,0px))}',
' .mb-more .g{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}',
' .mb-more button{display:flex;align-items:center;gap:10px;min-height:48px;padding:8px 12px;border:1px solid var(--line);border-radius:12px;background:var(--surface-2);color:var(--ink);font:inherit;font-weight:600;text-align:start;cursor:pointer}',
' .mb-more button[aria-current="page"]{color:var(--accent);border-color:var(--accent)}',
' .mb-more svg{width:20px;height:20px;flex:none}',
' #root .ab{width:38px;height:44px}',
' #root table.att thead th{min-width:38px}',
' #root table.att th.nm,#root table.att td.nm{min-width:104px;padding:8px}',
' #root table.att thead th.mb-today{color:var(--accent);box-shadow:inset 0 -2px 0 var(--accent)}',
'}',
'@media (max-width:520px){',
' #root .cell{min-height:64px;cursor:pointer}',
' #root .evc{pointer-events:none}',
' #root .cell .dn{width:26px;height:26px;font-size:13px}',
' #root .cell.mb-sel{box-shadow:inset 0 0 0 2px var(--accent)}',
'}'
].join('\n');
var st = document.createElement('style'); st.textContent = css; document.body.appendChild(st);

/* ---------- Barre du bas, bouton + et menu Plus ---------- */
var MAIN = ['home', 'calendar', 'clients', 'advances'], MORE = ['catalogue', 'stock', 'staff', 'suppliers', 'expenses', 'finance', 'social', 'backup'];
function mk(cls, tag) { var e = document.createElement(tag || 'div'); e.className = cls; document.body.appendChild(e); return e; }
var nav = mk('mb-nav', 'nav'), fab = mk('mb-fab', 'button'), fabMenu = mk('mb-fabmenu'), more = mk('mb-more'), scrim = mk('mb-scrim');
fab.type = 'button'; fab.setAttribute('data-mb-fab', '1');
scrim.setAttribute('data-mb-close', '1');
var sigNav = '';

function link(v) { return root.querySelector('nav.tabs a[href="#' + v + '"]'); }
function label(v) { var a = link(v); return a ? a.textContent.trim() : v; }
function icon(v) { var a = link(v), i = a && a.querySelector('svg'); return i ? i.outerHTML : ''; }
function current() { var a = root.querySelector('nav.tabs a[aria-current="page"]'); return a ? a.getAttribute('href').slice(1) : 'home'; }

function buildChrome() {
  var cur = current(), lang = root.getAttribute('lang') || 'en';
  document.body.setAttribute('data-mb-view', cur);
  var sig = cur + '|' + lang + '|' + label('home');
  if (sig === sigNav) return;
  sigNav = sig;
  nav.setAttribute('aria-label', 'Menu');
  nav.innerHTML = MAIN.map(function (v) {
    return '<button type="button" data-mbv="' + v + '"' + (cur === v ? ' aria-current="page"' : '') + '>' + icon(v) + '<span>' + esc(label(v)) + '</span></button>';
  }).join('') + '<button type="button" data-mb-more="1"' + (MORE.indexOf(cur) >= 0 ? ' aria-current="page"' : '') + '>' + svg(IC.dots, 3) + '<span>' + esc(s('more')) + '</span></button>';
  more.innerHTML = '<div class="g">' + MORE.map(function (v) {
    return '<button type="button" data-mbv="' + v + '"' + (cur === v ? ' aria-current="page"' : '') + '>' + icon(v) + esc(label(v)) + '</button>';
  }).join('') + '</div>';
  fab.setAttribute('aria-label', s('add'));
  fab.innerHTML = svg(IC.plus, 2.4);
  fabMenu.innerHTML = [['add-client', 'cli'], ['add-advance', 'adv'], ['add-expense', 'exp']].map(function (x) {
    return '<button type="button" data-mb-act="' + x[0] + '">' + svg(IC.plus, 2.2) + esc(s(x[1])) + '</button>';
  }).join('');
}
function closeLayers() { document.body.classList.remove('mb-open-fab', 'mb-open-more'); }
function go(v) { var a = link(v); if (a) a.click(); else location.hash = v; }
function trigger(act) {
  var b = document.createElement('button'); b.type = 'button'; b.setAttribute('data-act', act); b.style.display = 'none';
  root.appendChild(b); b.click(); b.remove();
}
document.addEventListener('click', function (e) {
  var t = e.target, b;
  if ((b = t.closest('[data-mbv]'))) { closeLayers(); go(b.getAttribute('data-mbv')); window.scrollTo(0, 0); return; }
  if ((b = t.closest('[data-mb-more]'))) { var o = document.body.classList.contains('mb-open-more'); closeLayers(); if (!o) document.body.classList.add('mb-open-more'); return; }
  if (t.closest('[data-mb-fab]')) { var f = document.body.classList.contains('mb-open-fab'); closeLayers(); if (!f) document.body.classList.add('mb-open-fab'); return; }
  if ((b = t.closest('[data-mb-act]'))) { closeLayers(); trigger(b.getAttribute('data-mb-act')); return; }
  if (t.closest('[data-mb-close]')) { closeLayers(); return; }
  if (t.closest('[data-mb-all]')) { var c = root.querySelector('.calgrid .cell.mb-sel'); if (c) c.click(); }
});
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLayers(); });

/* ---------- Appeler et WhatsApp sur les fiches ---------- */
function linkifyPhones() {
  [].forEach.call(root.querySelectorAll('.card p.muted:not([data-mb])'), function (p) {
    var b = p.querySelector('bdi[dir="ltr"]'); if (!b) return;
    p.setAttribute('data-mb', '1');
    var parts = b.textContent.split(/\s*·\s*/), wrap = document.createElement('div'), n = 0;
    wrap.className = 'mb-contact';
    parts.forEach(function (raw) {
      var d = raw.replace(/[^\d+]/g, ''), digits = d.replace(/\D/g, '');
      if (digits.length < 8) return;
      var intl = d.charAt(0) === '+' ? digits : (d.charAt(0) === '0' ? '212' + digits.slice(1) : digits);
      var mobile = d.charAt(0) !== '0' || /^0[67]/.test(d);
      wrap.insertAdjacentHTML('beforeend', '<a href="tel:+' + intl + '" aria-label="' + esc(s('call') + ' ' + raw.trim()) + '">' + svg(IC.call) + '<bdi dir="ltr">' + esc(raw.trim()) + '</bdi></a>');
      if (mobile) wrap.insertAdjacentHTML('beforeend', '<a class="wa" href="https://wa.me/' + intl + '" target="_blank" rel="noopener noreferrer" aria-label="' + esc(s('wa') + ' ' + raw.trim()) + '">' + svg(IC.wa) + s('wa') + '</a>');
      n++;
    });
    if (n) { p.textContent = ''; p.appendChild(wrap); }
  });
}

/* ---------- Présence : colonne du jour ---------- */
var attWas = false, attSig = '';
function attendance() {
  var w = root.querySelector('#attwrap');
  if (!w) { attWas = false; return; }
  var first = w.querySelector('.ab'), td = new Date(), iso = td.getFullYear() + '-' + p2(td.getMonth() + 1) + '-' + p2(td.getDate());
  if (first && (first.getAttribute('data-date') || '').slice(0, 7) === iso.slice(0, 7)) {
    [].forEach.call(w.querySelectorAll('thead th'), function (th, i) { if (i > 3 && th.textContent.trim() === String(td.getDate())) th.classList.add('mb-today'); });
  }
  var sig = first ? (first.getAttribute('aria-label') || '').split(':')[0] : '';
  if (!attWas || sig !== attSig) {
    attWas = true; attSig = sig;
    var b = w.querySelector('.ab[data-date="' + iso + '"]');
    if (b && root.getAttribute('dir') !== 'rtl') w.scrollLeft = Math.max(0, b.getBoundingClientRect().left - w.getBoundingClientRect().left + w.scrollLeft - 170);
  }
}

/* ---------- Calendrier : toucher un jour pour voir ses événements ---------- */
root.addEventListener('click', function (e) {
  if (!window.matchMedia('(max-width:520px)').matches) return;
  var cell = e.target.closest('.calgrid .cell'); if (!cell || cell.classList.contains('out')) return;
  var dn = cell.querySelector('.dn'), panel = root.querySelector('.calgrid ~ section.panel'); if (!dn || !panel) return;
  var was = cell.classList.contains('mb-sel'), rows = panel.querySelectorAll('.row');
  [].forEach.call(root.querySelectorAll('.calgrid .cell.mb-sel'), function (c) { c.classList.remove('mb-sel'); });
  [].forEach.call(panel.querySelectorAll('.mb-daybar,.mb-none'), function (x) { x.remove(); });
  [].forEach.call(rows, function (r) { r.style.display = ''; });
  if (was) return;
  cell.classList.add('mb-sel');
  var day = dn.textContent.trim(), n = 0;
  [].forEach.call(rows, function (r) { var d = r.querySelector('.dt b'); if (d && d.textContent.trim() === day) n++; else r.style.display = 'none'; });
  var bar = document.createElement('div'); bar.className = 'mb-daybar';
  bar.innerHTML = '<button type="button" class="btn sm" data-mb-all="1">' + esc(s('all')) + '</button>';
  panel.insertBefore(bar, panel.children[1] || null);
  if (rows.length && !n) { var p = document.createElement('p'); p.className = 'empty mb-none'; p.textContent = s('none'); panel.appendChild(p); }
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

/* ---------- Mise à jour après chaque affichage de l'app ---------- */
var pending = false, obs = new MutationObserver(function () {
  if (pending) return; pending = true;
  requestAnimationFrame(function () { pending = false; sync(); });
});
function sync() {
  obs.disconnect();
  try { buildChrome(); linkifyPhones(); attendance(); } catch (err) {}
  obs.observe(app, { childList: true, subtree: true });
}
window.addEventListener('hashchange', closeLayers);
sync();

/* Module des fonctions supplémentaires (checklist, charges récurrentes, dettes) */
var ex = document.createElement('script'); ex.src = 'extras.js'; document.body.appendChild(ex);
})();
