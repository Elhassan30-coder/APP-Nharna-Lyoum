(function () {
'use strict';
var NL = window.NL, root = document.getElementById('root'), app = document.getElementById('app');
if (!NL || !root || !app) { if (window.console) console.warn('extras.js : ligne NL manquante dans index.html'); return; }

/* ---------- Textes ---------- */
var D = {
en: { chk: 'Checklist', chkT: 'Checklist · {n}', phprep: 'Preparation', phday: 'Event day', phret: 'Equipment return', chkDone: '{d} of {n} done', chkIssue: '{n} issue(s)', newTask: 'New task', addTask: 'Add', problem: 'Mark as broken or missing', retItem: 'Return: {item} × {qty}',
  tPrep: ['Confirm date, venue and access time', 'Check equipment availability', 'Confirm the team', 'Load the equipment'], tDay: ['Arrive and unload', 'Set up the decoration', 'Final check with the client', 'Take photos of the result'],
  recT: 'Recurring expenses', recAdd: 'New recurring expense', recHint: 'Each one is added to your expenses automatically every month, on the chosen day.', recEvery: 'Every month on day {d}', recNone: 'No recurring expense yet.', recAdded: '{n} recurring expense(s) added', recNew: 'New recurring expense', recEdit: 'Edit recurring expense', recDay: 'Day of the month (1 to 28)', recStart: 'Starts in', recErr: 'Enter a label and a valid amount.',
  dKpi: 'Supplier debts', dLeft: 'Left to pay: {a}', dBtn: 'Debts', dCredit: 'Credit invoice', dCreditHint: 'A purchase you will pay later. It counts as an expense on its date.', dPayT: 'Debts · {n}', dCreditT: 'Credit invoice · {n}', dInv: 'Unpaid invoices', dPays: 'Payments made', dNone: 'No debt with this supplier.', dTotal: 'On credit', dPaid: 'Paid', dRemain: 'Left', dPay: 'Record payment', dAlert: '{n}: {a} left to pay', dErr: 'Enter a valid amount.' },
fr: { chk: 'Checklist', chkT: 'Checklist · {n}', phprep: 'Préparation', phday: 'Jour J', phret: 'Retour du matériel', chkDone: '{d} sur {n} faits', chkIssue: '{n} problème(s)', newTask: 'Nouvelle tâche', addTask: 'Ajouter', problem: 'Signaler cassé ou manquant', retItem: 'Retour : {item} × {qty}',
  tPrep: ["Confirmer la date, le lieu et l'heure d'accès", 'Vérifier la disponibilité du matériel', "Confirmer l'équipe", 'Charger le matériel'], tDay: ['Arriver et décharger', 'Installer la décoration', 'Dernière vérification avec le client', 'Photographier le résultat'],
  recT: 'Charges récurrentes', recAdd: 'Nouvelle charge récurrente', recHint: 'Chacune est ajoutée automatiquement à vos charges chaque mois, au jour choisi.', recEvery: 'Chaque mois le {d}', recNone: 'Aucune charge récurrente.', recAdded: '{n} charge(s) récurrente(s) ajoutée(s)', recNew: 'Nouvelle charge récurrente', recEdit: 'Modifier la charge récurrente', recDay: 'Jour du mois (1 à 28)', recStart: 'À partir de', recErr: 'Saisissez un libellé et un montant valide.',
  dKpi: 'Dettes fournisseurs', dLeft: 'Reste à payer : {a}', dBtn: 'Dettes', dCredit: 'Facture à crédit', dCreditHint: 'Un achat que vous paierez plus tard. Il compte comme une charge à sa date.', dPayT: 'Dettes · {n}', dCreditT: 'Facture à crédit · {n}', dInv: 'Factures impayées', dPays: 'Paiements effectués', dNone: 'Aucune dette avec ce fournisseur.', dTotal: 'À crédit', dPaid: 'Payé', dRemain: 'Reste', dPay: 'Enregistrer le paiement', dAlert: '{n} : {a} à payer', dErr: 'Saisissez un montant valide.' },
ar: { chk: 'قائمة المهام', chkT: 'قائمة المهام · {n}', phprep: 'التحضير', phday: 'يوم الحفل', phret: 'إرجاع المعدات', chkDone: 'تم إنجاز {d} من {n}', chkIssue: '{n} مشكل', newTask: 'مهمة جديدة', addTask: 'إضافة', problem: 'تحديد كمكسور أو مفقود', retItem: 'إرجاع: {item} × {qty}',
  tPrep: ['تأكيد التاريخ والمكان ووقت الدخول', 'التحقق من توفر المعدات', 'تأكيد الفريق', 'تحميل المعدات'], tDay: ['الوصول وإنزال المعدات', 'تركيب الديكور', 'المراجعة الأخيرة مع الزبون', 'تصوير النتيجة'],
  recT: 'مصاريف متكررة', recAdd: 'مصروف متكرر جديد', recHint: 'تضاف كل واحدة تلقائيا إلى مصاريفك كل شهر في اليوم المحدد.', recEvery: 'كل شهر في اليوم {d}', recNone: 'لا توجد مصاريف متكررة.', recAdded: 'تمت إضافة {n} مصاريف متكررة', recNew: 'مصروف متكرر جديد', recEdit: 'تعديل المصروف المتكرر', recDay: 'يوم الشهر (من 1 إلى 28)', recStart: 'ابتداء من', recErr: 'أدخل البيان ومبلغا صحيحا.',
  dKpi: 'ديون الموردين', dLeft: 'المتبقي للأداء: {a}', dBtn: 'الديون', dCredit: 'فاتورة بالأجل', dCreditHint: 'مشترى ستؤديه لاحقا. يحتسب كمصروف في تاريخه.', dPayT: 'الديون · {n}', dCreditT: 'فاتورة بالأجل · {n}', dInv: 'فواتير غير مؤداة', dPays: 'الأداءات المنجزة', dNone: 'لا توجد ديون مع هذا المورد.', dTotal: 'بالأجل', dPaid: 'المؤدى', dRemain: 'المتبقي', dPay: 'تسجيل الأداء', dAlert: '{n}: متبقي {a}', dErr: 'أدخل مبلغا صحيحا.' }
};
function s(k, v) {
  var x = (D[NL.lang] || D.en)[k]; if (x == null) x = D.en[k]; if (typeof x !== 'string') return x;
  return v ? x.replace(/\{(\w+)\}/g, function (m, n) { return v[n] != null ? v[n] : m; }) : x;
}
function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function db() { return NL.db; }
function pad(n) { return (n < 10 ? '0' : '') + n; }
function cur() { var a = root.querySelector('nav.tabs a[aria-current="page"]'); return a ? a.getAttribute('href').slice(1) : 'home'; }
function sum(a, f) { return a.reduce(function (t, x) { return t + f(x); }, 0); }
function numAttr() { return 'min="0" step="any" inputmode="decimal"'; }
function foot(del, extra, label) {
  return '<div class="sheet-f">' + (del || '<span></span>') + '<span class="grp">' + (extra || '') + '<button type="button" class="btn" data-act="close-modal">' + esc(NL.t('cancel')) + '</button><button type="submit" class="btn primary">' + esc(label || NL.t('save')) + '</button></span></div>';
}
function arm(b, fn) {
  if (b.getAttribute('data-armed')) { fn(); return; }
  b.setAttribute('data-armed', '1'); b.classList.add('armed'); var old = b.textContent; b.textContent = NL.t('confirmDelete');
  setTimeout(function () { if (b.isConnected) { b.removeAttribute('data-armed'); b.classList.remove('armed'); b.textContent = old; } }, 4000);
}
var css = '.xt-h{margin:16px 0 4px;font-size:15px}.xt-row{display:flex;align-items:center;gap:8px;padding:4px 0;border-top:1px solid var(--line)}.xt-chk{flex:1;display:flex;gap:10px;align-items:center;min-width:0;min-height:40px;cursor:pointer;font-weight:400}#modal .xt-chk input{width:20px;height:20px;flex:none}.xt-t{overflow-wrap:anywhere}.xt-chk input:checked+.xt-t{text-decoration:line-through;color:var(--muted)}.xt-bad.on{background:var(--bad);border-color:var(--bad);color:var(--surface)}';
var st = document.createElement('style'); st.textContent = css; document.body.appendChild(st);

/* ---------- 8. Checklist par événement ---------- */
var xtClient = null;
function isDone(k) { return k.done; }
function isBad(k) { return k.bad; }
function ensureChk(c) {
  if (!c.checklist) {
    c.checklist = [];
    s('tPrep').forEach(function (x) { c.checklist.push({ id: NL.uid(), text: x, done: false, ph: 'prep' }); });
    s('tDay').forEach(function (x) { c.checklist.push({ id: NL.uid(), text: x, done: false, ph: 'day' }); });
  }
  (c.lines || []).forEach(function (l) {
    var key = 'eq:' + l.itemId, it = NL.byId(db().items, l.itemId);
    if (it && !c.checklist.some(function (k) { return k.key === key; })) c.checklist.push({ id: NL.uid(), key: key, text: s('retItem', { item: it.name, qty: l.qty }), done: false, bad: false, ph: 'ret' });
  });
}
function chkRow(k) {
  return '<div class="xt-row"><label class="xt-chk"><input type="checkbox" data-xt="tick" data-id="' + k.id + '"' + (k.done ? ' checked' : '') + '><span class="xt-t">' + esc(k.text) + '</span></label>' +
    (k.key ? '<button type="button" class="btn sm xt-bad' + (k.bad ? ' on' : '') + '" data-xt="bad" data-id="' + k.id + '" aria-pressed="' + !!k.bad + '" aria-label="' + esc(s('problem')) + '" title="' + esc(s('problem')) + '">⚠</button>' : '') +
    '<button type="button" class="btn sm ghost" data-xt="deltask" data-id="' + k.id + '" aria-label="' + esc(NL.t('delete')) + '">×</button></div>';
}
function chkBody(c) {
  var k = c.checklist, d = k.filter(isDone).length, bad = k.filter(isBad).length, pct = k.length ? Math.round(d / k.length * 100) : 0;
  var h = '<div class="bar" role="img" aria-label="' + pct + '%"><i style="width:' + pct + '%"></i></div><p class="muted" style="margin:6px 0">' + esc(s('chkDone', { d: d, n: k.length })) + (bad ? ' · <span class="pill bad">' + esc(s('chkIssue', { n: bad })) + '</span>' : '') + '</p>';
  ['prep', 'day', 'ret'].forEach(function (ph) {
    var list = k.filter(function (x) { return x.ph === ph; });
    h += '<h3 class="xt-h">' + esc(s('ph' + ph)) + '</h3>' + (list.length ? list.map(chkRow).join('') : '<p class="muted">—</p>');
  });
  return h + '<div class="tools" style="margin-top:16px;flex-wrap:nowrap"><select id="xt-ph" style="max-width:140px" aria-label="' + esc(s('newTask')) + '">' + ['prep', 'day', 'ret'].map(function (p) { return '<option value="' + p + '">' + esc(s('ph' + p)) + '</option>'; }).join('') + '</select><input id="xt-new" type="text" placeholder="' + esc(s('newTask')) + '" autocomplete="off"><button type="button" class="btn" data-xt="addtask">' + esc(s('addTask')) + '</button></div>';
}
function openChk(id) {
  var c = NL.byId(db().clients, id); if (!c) return;
  xtClient = id; ensureChk(c); NL.persist();
  NL.openModal(s('chkT', { n: c.name }), chkBody(c));
}
function refreshChk() {
  var c = NL.byId(db().clients, xtClient), sb = document.querySelector('#modal .sheet-b'); if (!c || !sb) return;
  var top = sb.scrollTop; sb.innerHTML = chkBody(c); sb.scrollTop = top;
}
function chkChange(fn) { var c = NL.byId(db().clients, xtClient); if (!c) return; fn(c); NL.commit(); refreshChk(); }
function taskOf(c, id) { return c.checklist.filter(function (k) { return k.id === id; })[0]; }

/* ---------- 10. Charges récurrentes ---------- */
function nextM(m) { var p = m.split('-').map(Number), d = new Date(p[0], p[1], 1); return d.getFullYear() + '-' + pad(d.getMonth() + 1); }
function runRec() {
  var list = (db().meta.company && db().meta.company.rec) || [], n = 0, td = NL.today(), nowM = td.slice(0, 7);
  list.forEach(function (r) {
    var m = r.last ? nextM(r.last) : r.start, g = 0; if (!m) return;
    while (m <= nowM && g < 24) {
      var d = m + '-' + pad(Math.min(+r.day || 1, 28)); if (d > td) break;
      db().expenses.push({ id: NL.uid(), date: d, label: r.label, category: r.category, amount: +r.amount, clientId: '', staffId: '', supplierId: r.supplierId || '', rec: r.id });
      r.last = m; m = nextM(m); n++; g++;
    }
  });
  if (n) { NL.commit(); NL.toast(s('recAdded', { n: n })); }
}
function supOptions(val) {
  return '<option value="">—</option>' + db().suppliers.slice().sort(function (a, b) { return a.name.localeCompare(b.name); }).map(function (x) { return '<option value="' + x.id + '"' + (x.id === val ? ' selected' : '') + '>' + esc(x.name) + '</option>'; }).join('');
}
function recModal(id) {
  var list = (db().meta.company.rec || []), r = id ? list.filter(function (x) { return x.id === id; })[0] : null;
  r = r || { label: '', category: 'rent', amount: '', day: 1, supplierId: '', start: NL.today().slice(0, 7) };
  NL.openModal(id ? s('recEdit') : s('recNew'), '<form id="f" data-xt-submit="rec" data-id="' + (id || '') + '" novalidate><div class="fgrid">' +
    NL.fld('r-label', NL.t('f.label'), NL.inp('r-label', r.label, 'text', 'autocomplete="off"'), 'full') +
    NL.fld('r-cat', NL.t('f.category'), NL.sel('r-cat', NL.catList('ec'), r.category, 'ec.')) +
    NL.fld('r-amount', NL.t('f.amount'), NL.inp('r-amount', r.amount, 'number', numAttr())) +
    NL.fld('r-day', s('recDay'), NL.inp('r-day', r.day, 'number', 'min="1" max="28" step="1" inputmode="numeric"')) +
    NL.fld('r-start', s('recStart'), NL.inp('r-start', r.start, 'month')) +
    NL.fld('r-sup', NL.t('f.supplier'), '<select id="r-sup">' + supOptions(r.supplierId) + '</select>', 'full') +
    '</div><p class="hint" style="margin-top:10px">' + esc(s('recHint')) + '</p><p class="err" id="ferr" role="alert" hidden></p>' +
    foot(id ? '<button type="button" class="btn danger" data-xt="rec-del" data-id="' + id + '">' + esc(NL.t('delete')) + '</button>' : '') + '</form>');
}
function recPanel() {
  var list = (db().meta.company.rec || []);
  var rows = list.length ? list.map(function (r) {
    var sp = r.supplierId ? NL.byId(db().suppliers, r.supplierId) : null;
    return '<div class="row" style="cursor:default;grid-template-columns:minmax(0,1fr) auto"><div class="mn"><strong>' + esc(r.label) + '</strong><span class="muted">' + esc(s('recEvery', { d: r.day }) + ' · ' + NL.t('ec.' + r.category) + (sp ? ' · ' + sp.name : '')) + '</span></div><div class="bl">' + NL.money(r.amount) + '<div style="margin-top:6px"><button type="button" class="btn sm ghost" data-xt="rec-edit" data-id="' + r.id + '">' + esc(NL.t('edit')) + '</button></div></div></div>';
  }).join('') : '<p class="empty">' + esc(s('recNone')) + '</p>';
  return '<section class="panel xt-rec"><div class="wk-h"><h2>' + esc(s('recT')) + '</h2><button type="button" class="btn sm primary" data-xt="rec-add">' + esc(s('recAdd')) + '</button></div><p class="muted" style="margin-bottom:8px">' + esc(s('recHint')) + '</p>' + rows + '</section>';
}

/* ---------- 11. Dettes fournisseurs ---------- */
function debtInfo(id) {
  var x = NL.byId(db().suppliers, id), pays = (x && x.payments) || [], rem = sum(pays, function (p) { return +p.amount || 0; }), paid = rem, inv = [], total = 0;
  db().expenses.filter(function (e) { return e.supplierId === id && e.credit; }).sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; }).forEach(function (e) {
    var u = Math.min(e.amount, rem); rem -= u; total += e.amount; inv.push({ e: e, left: e.amount - u });
  });
  return { inv: inv, pays: pays, total: total, paid: paid, left: Math.max(0, total - paid) };
}
function allDebts() {
  return db().suppliers.map(function (x) { return { x: x, i: debtInfo(x.id) }; }).filter(function (r) { return r.i.left > 0; });
}
function debtModal(id) {
  var x = NL.byId(db().suppliers, id); if (!x) return; var i = debtInfo(id);
  var inv = i.inv.length ? '<div class="tablewrap" style="margin-top:8px"><table style="min-width:0"><thead><tr><th>' + esc(NL.t('f.date')) + '</th><th>' + esc(NL.t('f.label')) + '</th><th class="n">' + esc(NL.t('f.amount')) + '</th><th class="n">' + esc(s('dRemain')) + '</th></tr></thead><tbody>' + i.inv.map(function (r) {
    return '<tr><td>' + esc(NL.dparts(r.e.date).full) + '</td><td>' + esc(r.e.label) + '</td><td class="n">' + NL.money(r.e.amount) + '</td><td class="n">' + NL.money(r.left) + '</td></tr>';
  }).join('') + '</tbody></table></div>' : '<p class="empty">' + esc(s('dNone')) + '</p>';
  var pays = i.pays.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }).map(function (p) {
    return '<div class="xt-row"><span style="flex:1">' + esc(NL.dparts(p.date).full) + ' · ' + NL.money(p.amount) + (p.note ? ' · ' + esc(p.note) : '') + '</span><button type="button" class="btn sm danger" data-xt="delpay" data-id="' + p.id + '" data-sup="' + id + '">' + esc(NL.t('delete')) + '</button></div>';
  }).join('');
  NL.openModal(s('dPayT', { n: x.name }), '<div class="sums"><div><small>' + esc(s('dTotal')) + '</small>' + NL.money(i.total) + '</div><div><small>' + esc(s('dPaid')) + '</small>' + NL.money(i.paid) + '</div><div><small>' + esc(s('dRemain')) + '</small>' + NL.money(i.left) + '</div></div>' +
    '<h3 class="xt-h">' + esc(s('dInv')) + '</h3>' + inv + (pays ? '<h3 class="xt-h">' + esc(s('dPays')) + '</h3>' + pays : '') +
    '<form id="f" data-xt-submit="pay" data-id="' + id + '" novalidate style="margin-top:16px"><div class="fgrid">' +
    NL.fld('p-amount', NL.t('f.amount'), NL.inp('p-amount', i.left || '', 'number', numAttr())) + NL.fld('p-date', NL.t('f.date'), NL.inp('p-date', NL.today(), 'date')) + NL.fld('p-note', NL.t('f.note'), NL.inp('p-note', ''), 'full') +
    '</div><p class="err" id="ferr" role="alert" hidden></p>' + foot('', '<button type="button" class="btn" data-xt="credit" data-id="' + id + '">' + esc(s('dCredit')) + '</button>', s('dPay')) + '</form>');
}
function creditModal(id) {
  var x = NL.byId(db().suppliers, id); if (!x) return;
  NL.openModal(s('dCreditT', { n: x.name }), '<form id="f" data-xt-submit="credit" data-id="' + id + '" novalidate><div class="fgrid">' +
    NL.fld('k-label', NL.t('f.label'), NL.inp('k-label', '', 'text', 'autocomplete="off"'), 'full') + NL.fld('k-amount', NL.t('f.amount'), NL.inp('k-amount', '', 'number', numAttr())) + NL.fld('k-date', NL.t('f.date'), NL.inp('k-date', NL.today(), 'date')) +
    '</div><p class="hint" style="margin-top:10px">' + esc(s('dCreditHint')) + '</p><p class="err" id="ferr" role="alert" hidden></p>' + foot('') + '</form>');
}

/* ---------- Clics, formulaires, clavier ---------- */
root.addEventListener('click', function (e) {
  var b = e.target.closest('[data-xt]'); if (!b) return;
  var a = b.getAttribute('data-xt'), id = b.getAttribute('data-id');
  if (a === 'chk') openChk(id);
  else if (a === 'tick') chkChange(function (c) { var k = taskOf(c, id); if (k) k.done = b.checked; });
  else if (a === 'bad') chkChange(function (c) { var k = taskOf(c, id); if (k) k.bad = !k.bad; });
  else if (a === 'deltask') chkChange(function (c) { c.checklist = c.checklist.filter(function (k) { return k.id !== id; }); });
  else if (a === 'addtask') {
    var inp = document.getElementById('xt-new'), txt = inp ? inp.value.trim() : ''; if (!txt) return;
    var ph = document.getElementById('xt-ph').value; chkChange(function (c) { c.checklist.push({ id: NL.uid(), text: txt, done: false, ph: ph }); });
    inp = document.getElementById('xt-new'); if (inp) inp.focus();
  }
  else if (a === 'rec-add') recModal();
  else if (a === 'rec-edit') recModal(id);
  else if (a === 'rec-del') arm(b, function () { var co = db().meta.company; co.rec = (co.rec || []).filter(function (r) { return r.id !== id; }); NL.closeModal(); NL.commit(); NL.toast(NL.t('deleted')); });
  else if (a === 'debt') debtModal(id);
  else if (a === 'credit') creditModal(id);
  else if (a === 'delpay') arm(b, function () { var x = NL.byId(db().suppliers, b.getAttribute('data-sup')); if (x) x.payments = (x.payments || []).filter(function (p) { return p.id !== id; }); NL.commit(); debtModal(b.getAttribute('data-sup')); });
});
root.addEventListener('submit', function (e) {
  var f = e.target, a = f.getAttribute('data-xt-submit'); if (!a) return;
  var id = f.getAttribute('data-id'), v = function (k) { return f.querySelector('#' + k).value.trim(); };
  if (a === 'rec') {
    var label = v('r-label'), amt = parseFloat(v('r-amount'));
    if (!label || !(amt > 0)) return NL.formErr(s('recErr'));
    var co = db().meta.company; co.rec = co.rec || [];
    var rec = { label: label, category: v('r-cat'), amount: amt, day: Math.min(28, Math.max(1, parseInt(v('r-day'), 10) || 1)), supplierId: v('r-sup'), start: v('r-start') || NL.today().slice(0, 7) };
    var ex = id ? co.rec.filter(function (r) { return r.id === id; })[0] : null;
    if (ex) Object.assign(ex, rec); else co.rec.push(Object.assign({ id: NL.uid(), last: '' }, rec));
    NL.closeModal(); runRec(); NL.commit(); NL.toast(NL.t('saved'));
  } else if (a === 'pay') {
    var pa = parseFloat(v('p-amount')); if (!(pa > 0)) return NL.formErr(s('dErr'));
    var x = NL.byId(db().suppliers, id); if (!x) return; x.payments = x.payments || [];
    x.payments.push({ id: NL.uid(), date: v('p-date') || NL.today(), amount: pa, note: v('p-note') });
    NL.closeModal(); NL.commit(); NL.toast(NL.t('saved'));
  } else if (a === 'credit') {
    var ka = parseFloat(v('k-amount')), kl = v('k-label'); if (!kl || !(ka > 0)) return NL.formErr(s('recErr'));
    db().expenses.push({ id: NL.uid(), date: v('k-date') || NL.today(), label: kl, category: 'purchases', amount: ka, clientId: '', staffId: '', supplierId: id, credit: true });
    NL.closeModal(); NL.commit(); NL.toast(NL.t('saved')); debtModal(id);
  }
});
root.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && e.target.id === 'xt-new') { e.preventDefault(); var b = root.querySelector('[data-xt="addtask"]'); if (b) b.click(); }
});

/* ---------- Ajouts dans les pages de l'app ---------- */
function btn(label, act, id, cls) {
  var b = document.createElement('button'); b.type = 'button'; b.className = 'btn sm' + (cls ? ' ' + cls : ''); b.setAttribute('data-xt', act); b.setAttribute('data-id', id); b.textContent = label; return b;
}
function inject() {
  [].forEach.call(root.querySelectorAll('.card-f:not([data-xtd])'), function (f) {
    f.setAttribute('data-xtd', '1');
    var ec = f.querySelector('[data-act="edit-client"]'), sh = f.querySelector('[data-act="sup-hist"]');
    if (ec) {
      var c = NL.byId(db().clients, ec.getAttribute('data-id')); if (!c) return;
      var k = c.checklist || [], bad = k.filter(isBad).length;
      f.insertBefore(btn(s('chk') + (k.length ? ' ' + k.filter(isDone).length + '/' + k.length : '') + (bad ? ' ⚠' : ''), 'chk', c.id), ec);
    }
    if (sh) {
      var sid = sh.getAttribute('data-id'), i = debtInfo(sid);
      f.insertBefore(btn(s('dBtn'), 'debt', sid), sh.nextSibling);
      if (i.left > 0) { var p = document.createElement('p'); p.className = 'sv'; p.innerHTML = '<span class="pill bad">' + esc(s('dLeft', { a: NL.money(i.left) })) + '</span>'; f.parentNode.insertBefore(p, f); }
    }
  });
  var v = cur();
  if (v === 'expenses' && !root.querySelector('.xt-rec')) { var ph = root.querySelector('main .pagehead'); if (ph) ph.insertAdjacentHTML('afterend', recPanel()); }
  if (v === 'suppliers') { var kp = root.querySelector('.kpis:not([data-xtd])'); if (kp) { kp.setAttribute('data-xtd', '1'); kp.insertAdjacentHTML('beforeend', '<div class="kpi"><small>' + esc(s('dKpi')) + '</small><b>' + NL.money(sum(allDebts(), function (r) { return r.i.left; })) + '</b></div>'); } }
  if (v === 'home') {
    var al = root.querySelector('.al-list:not([data-xtd])');
    if (al) {
      al.setAttribute('data-xtd', '1'); var ds = allDebts();
      if (ds.length) { var ok = al.querySelector('.al.ok'); if (ok) ok.remove(); }
      ds.forEach(function (r) { al.insertAdjacentHTML('beforeend', '<li class="al warn"><i></i><span>' + esc(s('dAlert', { n: r.x.name, a: NL.money(r.i.left) })) + '</span></li>'); });
    }
  }
}
var pending = false, obs = new MutationObserver(function () {
  if (pending) return; pending = true;
  requestAnimationFrame(function () { pending = false; sync(); });
});
function sync() { obs.disconnect(); try { inject(); } catch (err) {} obs.observe(app, { childList: true, subtree: true }); }
document.addEventListener('visibilitychange', function () { if (!document.hidden) runRec(); });
runRec(); sync();
})();
