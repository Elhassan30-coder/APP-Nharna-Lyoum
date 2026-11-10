/* Evora - Catalogue des services et modèles de décoration + fiche imprimable pour l'équipe */
(function () {
'use strict';
var NL = window.NL, root = document.getElementById('root'), app = document.getElementById('app');
if (!NL || !root || !app) { if (window.console) console.warn('catalogue.js : ligne NL manquante dans index.html'); return; }

/* ---------- Textes ---------- */
var D = {
en: { title: 'Catalogue', add: 'New entry', sv: 'Service', dc: 'Decoration model', all: 'All', search: 'Search the catalogue...',
  empty: 'The catalogue is empty. Add your services and decoration models once, then pick them whenever you create an order.', emptyF: 'No entry matches.',
  mNew: 'New catalogue entry', mEdit: 'Edit catalogue entry', fType: 'Type', fName: 'Name', fPrice: 'Price (MAD)', fDur: 'Duration or lead time',
  fDesc: 'Description (what the client gets)', fDet: 'Details for the team (setup steps, colors, sizes, notes)', fMat: 'Equipment needed (from Inventory)',
  addMat: 'Add equipment', noInv: 'Add equipment in Inventory first.', fPhoto: 'Photo', errName: 'Name is required.', mats: '{n} equipment item(s)',
  pickT: 'Catalogue', pickPh: 'Choose a service or a model...', pickAdd: 'Add to order',
  pickHint: 'Details are copied into the order. Equipment is added to the list above, and the total updates as long as you have not changed it by hand.',
  pickNone: 'The catalogue is empty. Add entries in the Catalogue section.', pickTotal: 'Catalogue total',
  pickBtn: 'Catalogue', pickBtnT: 'Catalogue · {n}', sheet: 'Team sheet', sheetT: 'Preparation sheet', sClient: 'Client', sEvent: 'Event', sWhen: 'Date', sWhere: 'Venue', sAddr: 'Address', sPhone: 'Phone',
  sTeam: 'Team', sSvc: 'Services and decoration', sDur: 'Duration', sDet: 'Details', sMat: 'Equipment', sEq: 'Equipment for this event', sOrder: 'Order notes',
  sCheck: 'Checklist', sPrint: 'Print or save as PDF', sNone: 'No service selected for this client.', sOpenFail: 'Pop-up blocked, the file was downloaded instead.', sQty: 'Qty', sItem: 'Item' },
fr: { title: 'Catalogue', add: 'Nouvelle fiche', sv: 'Service', dc: 'Modèle de décoration', all: 'Tout', search: 'Rechercher dans le catalogue...',
  empty: 'Le catalogue est vide. Ajoutez une seule fois vos services et modèles de décoration, puis choisissez-les à chaque nouvelle commande.', emptyF: 'Aucune fiche trouvée.',
  mNew: 'Nouvelle fiche du catalogue', mEdit: 'Modifier la fiche', fType: 'Type', fName: 'Nom', fPrice: 'Prix (MAD)', fDur: 'Durée ou délai',
  fDesc: 'Description (ce que reçoit le client)', fDet: "Détails pour l'équipe (étapes de montage, couleurs, dimensions, remarques)", fMat: "Matériel nécessaire (depuis l'Inventaire)",
  addMat: 'Ajouter du matériel', noInv: "Ajoutez d'abord du matériel dans Inventaire.", fPhoto: 'Photo', errName: 'Le nom est obligatoire.', mats: '{n} article(s) de matériel',
  pickT: 'Catalogue', pickPh: 'Choisir un service ou un modèle...', pickAdd: 'Ajouter à la commande',
  pickHint: "Les détails sont copiés dans la commande. Le matériel est ajouté à la liste ci-dessus, et le total se met à jour tant que vous ne l'avez pas modifié à la main.",
  pickNone: 'Le catalogue est vide. Ajoutez des fiches dans la section Catalogue.', pickTotal: 'Total du catalogue',
  pickBtn: 'Catalogue', pickBtnT: 'Catalogue · {n}', sheet: 'Fiche équipe', sheetT: 'Fiche de préparation', sClient: 'Client', sEvent: 'Événement', sWhen: 'Date', sWhere: 'Lieu', sAddr: 'Adresse', sPhone: 'Téléphone',
  sTeam: 'Équipe', sSvc: 'Services et décoration', sDur: 'Durée', sDet: 'Détails', sMat: 'Matériel', sEq: 'Matériel pour cet événement', sOrder: 'Notes de la commande',
  sCheck: 'Checklist', sPrint: 'Imprimer ou enregistrer en PDF', sNone: 'Aucun service sélectionné pour ce client.', sOpenFail: 'Fenêtre bloquée, le fichier a été téléchargé à la place.', sQty: 'Qté', sItem: 'Article' },
ar: { title: 'الكتالوغ', add: 'بطاقة جديدة', sv: 'خدمة', dc: 'نموذج ديكور', all: 'الكل', search: 'ابحث في الكتالوغ...',
  empty: 'الكتالوغ فارغ. أضف خدماتك ونماذج الديكور مرة واحدة، ثم اخترها عند كل طلب جديد.', emptyF: 'لا توجد نتيجة.',
  mNew: 'بطاقة جديدة في الكتالوغ', mEdit: 'تعديل البطاقة', fType: 'النوع', fName: 'الاسم', fPrice: 'الثمن (د.م.)', fDur: 'المدة أو الأجل',
  fDesc: 'الوصف (ما يحصل عليه الزبون)', fDet: 'تفاصيل للفريق (خطوات التركيب، الألوان، المقاسات، ملاحظات)', fMat: 'المعدات اللازمة (من المخزون)',
  addMat: 'إضافة معدات', noInv: 'أضف المعدات في المخزون أولا.', fPhoto: 'صورة', errName: 'الاسم مطلوب.', mats: 'عدد المعدات: {n}',
  pickT: 'الكتالوغ', pickPh: 'اختر خدمة أو نموذجا...', pickAdd: 'إضافة إلى الطلب',
  pickHint: 'تنسخ التفاصيل إلى الطلب. تضاف المعدات إلى القائمة أعلاه، ويتحدث المجموع ما دمت لم تعدله يدويا.',
  pickNone: 'الكتالوغ فارغ. أضف بطاقات في قسم الكتالوغ.', pickTotal: 'مجموع الكتالوغ',
  pickBtn: 'الكتالوغ', pickBtnT: 'الكتالوغ · {n}', sheet: 'ورقة الفريق', sheetT: 'ورقة التحضير', sClient: 'الزبون', sEvent: 'الحفل', sWhen: 'التاريخ', sWhere: 'المكان', sAddr: 'العنوان', sPhone: 'الهاتف',
  sTeam: 'الفريق', sSvc: 'الخدمات والديكور', sDur: 'المدة', sDet: 'التفاصيل', sMat: 'المعدات', sEq: 'معدات هذا الحفل', sOrder: 'ملاحظات الطلب',
  sCheck: 'قائمة المهام', sPrint: 'طباعة أو حفظ PDF', sNone: 'لم تتم إضافة أي خدمة لهذا الزبون.', sOpenFail: 'تم حظر النافذة، تم تحميل الملف بدلا من ذلك.', sQty: 'الكمية', sItem: 'البند' }
};
function s(k, v) {
  var x = (D[NL.lang] || D.en)[k]; if (x == null) x = D.en[k]; if (typeof x !== 'string') return x;
  return v ? x.replace(/\{(\w+)\}/g, function (m, n) { return v[n] != null ? v[n] : m; }) : x;
}
function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function cat() { var d = NL.db; if (!d.catalog) d.catalog = []; return d.catalog; }
function clone(o) { return JSON.parse(JSON.stringify(o)); }
function numAttr() { return 'min="0" step="any" inputmode="decimal"'; }
function foot(del) {
  return '<div class="sheet-f">' + (del || '<span></span>') + '<span class="grp"><button type="button" class="btn" data-act="close-modal">' + esc(NL.t('cancel')) + '</button><button type="submit" class="btn primary">' + esc(NL.t('save')) + '</button></span></div>';
}
function arm(b, fn) {
  if (b.getAttribute('data-armed')) { fn(); return; }
  b.setAttribute('data-armed', '1'); b.classList.add('armed'); var old = b.textContent; b.textContent = NL.t('confirmDelete');
  setTimeout(function () { if (b.isConnected) { b.removeAttribute('data-armed'); b.classList.remove('armed'); b.textContent = old; } }, 4000);
}
function typeLabel(tp) { return s(tp === 'decor' ? 'dc' : 'sv'); }
function byName(a, b) { return a.name.localeCompare(b.name, NL.lang); }

var st = document.createElement('style');
st.textContent = '.cg-row{display:flex;align-items:center;gap:8px;padding:6px 0;border-top:1px solid var(--line)}.cg-m{flex:1;min-width:0;display:flex;flex-direction:column}.cg-m span{font-size:13px}input.cg-q{width:72px;flex:none}.cg-pick{display:flex;gap:8px;margin-top:8px}.cg-chk{flex:1;display:flex;gap:10px;align-items:center;min-width:0;min-height:40px;cursor:pointer;font-weight:400}input.cg-ck{width:20px;height:20px;flex:none}input.cg-pq{width:72px;flex:none}.cg-h{margin:14px 0 4px;font-size:15px}.cg-img{width:100%;max-height:180px;object-fit:cover;border-radius:8px;border:1px solid var(--line);display:block;cursor:pointer}';
document.body.appendChild(st);

/* ---------- Page Catalogue ---------- */
var ui = { q: '', type: 'all' };
function cardHTML(k) {
  return '<article class="card"><div class="card-h"><div><h3>' + esc(k.name) + '</h3>' + (k.duration ? '<p class="muted">' + esc(k.duration) + '</p>' : '') + '</div><span class="pill ' + (k.type === 'decor' ? 'done' : 'quote') + '">' + esc(typeLabel(k.type)) + '</span></div>' +
    (k.photo ? '<img class="cg-img" src="' + esc(k.photo) + '" alt="" data-cat="view" data-id="' + k.id + '">' : '') +
    (k.desc ? '<p class="clamp">' + esc(k.desc) + '</p>' : '') +
    '<p><strong>' + esc(NL.money(k.price || 0)) + '</strong></p>' +
    ((k.materials || []).length ? '<p class="muted">' + esc(s('mats', { n: k.materials.length })) + '</p>' : '') +
    '<div class="card-f"><button type="button" class="btn sm ghost" data-cat="edit" data-id="' + k.id + '">' + esc(NL.t('edit')) + '</button></div></article>';
}
function listHTML() {
  var q = ui.q.trim().toLowerCase();
  var list = cat().filter(function (k) {
    if (ui.type !== 'all' && k.type !== ui.type) return false;
    return !q || (k.name + ' ' + (k.desc || '') + ' ' + (k.details || '')).toLowerCase().indexOf(q) >= 0;
  }).sort(byName);
  if (!list.length) return '<p class="empty">' + esc(s(cat().length ? 'emptyF' : 'empty')) + '</p>';
  return '<div class="cards">' + list.map(cardHTML).join('') + '</div>';
}
window.NL_catalogueView = function () {
  var opts = [['all', s('all')], ['service', s('sv')], ['decor', s('dc')]].map(function (o) { return '<option value="' + o[0] + '"' + (ui.type === o[0] ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('');
  return '<div class="pagehead"><h1>' + esc(s('title')) + '</h1><button type="button" class="btn primary" data-cat="add">' + esc(s('add')) + '</button></div>' +
    '<div class="tools"><input id="cg-q" type="search" value="' + esc(ui.q) + '" placeholder="' + esc(s('search')) + '" aria-label="' + esc(s('search')) + '" style="max-width:320px"><select id="cg-t" aria-label="' + esc(s('fType')) + '" style="max-width:220px">' + opts + '</select></div>' +
    '<div id="cgList">' + listHTML() + '</div>';
};

/* ---------- Fiche du catalogue (ajout / modification) ---------- */
var formMat = [], formPhoto = '';
function matRow(m) {
  return '<div class="line" data-ml="1"><select class="m-item" aria-label="' + esc(s('fMat')) + '">' + NL.db.items.map(function (i) { return '<option value="' + i.id + '"' + (i.id === m.itemId ? ' selected' : '') + '>' + esc(i.name) + '</option>'; }).join('') +
    '</select><input class="m-qty" type="number" min="1" step="1" inputmode="numeric" value="' + esc(m.qty) + '" aria-label="' + esc(NL.t('f.qty')) + '"><button type="button" class="btn ghost sm" data-cat="rm-mat" aria-label="' + esc(NL.t('delete')) + '">×</button></div>';
}
function photoInner() {
  return formPhoto ? '<div class="ph"><figure><img src="' + esc(formPhoto) + '" alt=""><button type="button" data-cat="rm-photo" aria-label="' + esc(NL.t('photo.remove')) + '">×</button></figure></div>' : '';
}
function editModal(id) {
  var k = id ? NL.byId(cat(), id) : { type: 'service', name: '', price: '', duration: '', desc: '', details: '', materials: [], photo: '' };
  if (!k) return;
  formPhoto = k.photo || '';
  var typeSel = '<select id="k-type">' + ['service', 'decor'].map(function (x) { return '<option value="' + x + '"' + (x === k.type ? ' selected' : '') + '>' + esc(typeLabel(x)) + '</option>'; }).join('') + '</select>';
  var del = id ? '<button type="button" class="btn danger" data-cat="del" data-id="' + id + '">' + esc(NL.t('delete')) + '</button>' : '';
  NL.openModal(id ? s('mEdit') : s('mNew'), '<form id="f" data-cat-submit="save" data-id="' + (id || '') + '" novalidate><div class="fgrid">' +
    NL.fld('k-type', s('fType'), typeSel) +
    NL.fld('k-name', s('fName'), NL.inp('k-name', k.name, 'text', 'autocomplete="off"')) +
    NL.fld('k-price', s('fPrice'), NL.inp('k-price', k.price || '', 'number', numAttr())) +
    NL.fld('k-dur', s('fDur'), NL.inp('k-dur', k.duration || '')) +
    NL.fld('k-desc', s('fDesc'), '<textarea id="k-desc" rows="3">' + esc(k.desc || '') + '</textarea>', 'full') +
    NL.fld('k-det', s('fDet'), '<textarea id="k-det" rows="5">' + esc(k.details || '') + '</textarea>', 'full') +
    '</div><fieldset class="fs"><legend>' + esc(s('fMat')) + '</legend><div id="k-mats">' + (k.materials || []).map(matRow).join('') + '</div>' +
    (NL.db.items.length ? '<button type="button" class="btn sm" data-cat="add-mat">' + esc(s('addMat')) + '</button>' : '<p class="muted">' + esc(s('noInv')) + '</p>') + '</fieldset>' +
    '<div class="field full" style="margin-top:12px"><label for="k-photo-in">' + esc(s('fPhoto')) + '</label><div id="k-ph">' + photoInner() + '</div><input id="k-photo-in" type="file" accept="image/*"></div>' +
    '<p class="err" id="ferr" role="alert" hidden></p>' + foot(del) + '</form>');
}
function saveEntry(f) {
  var id = f.getAttribute('data-id'), v = function (i) { return f.querySelector('#' + i).value.trim(); };
  var name = v('k-name'); if (!name) return NL.formErr(s('errName'));
  var mats = [].slice.call(f.querySelectorAll('.line[data-ml]')).map(function (r) {
    return { itemId: r.querySelector('.m-item').value, qty: Math.max(1, parseInt(r.querySelector('.m-qty').value, 10) || 1) };
  }).filter(function (m) { return m.itemId; });
  var rec = { type: v('k-type'), name: name, price: parseFloat(v('k-price')) || 0, duration: v('k-dur'), desc: v('k-desc'), details: v('k-det'), materials: mats, photo: formPhoto };
  if (id) { var k = NL.byId(cat(), id); if (k) Object.assign(k, rec); } else cat().push(Object.assign({ id: NL.uid() }, rec));
  NL.closeModal(); NL.commit(); NL.toast(NL.t('saved'));
}
function readImage(file, max, q) {
  return new Promise(function (res, rej) {
    var r = new FileReader(); r.onerror = rej;
    r.onload = function () {
      var im = new Image(); im.onerror = rej;
      im.onload = function () {
        var sc = Math.min(1, max / Math.max(im.width, im.height, 1)), w = Math.max(1, Math.round(im.width * sc)), h = Math.max(1, Math.round(im.height * sc)), cv = document.createElement('canvas');
        cv.width = w; cv.height = h; var cx = cv.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, w, h); cx.drawImage(im, 0, 0, w, h);
        try { res(cv.toDataURL('image/jpeg', q)); } catch (e) { rej(e); }
      };
      im.src = r.result;
    };
    r.readAsDataURL(file);
  });
}

/* ---------- Choix dans le formulaire de commande (fiche client) ---------- */
var formSel = [], lastAuto = 0;
function sumOf(list) { return list.reduce(function (t, x) { return t + (+x.price || 0) * (+x.qty || 0); }, 0); }
function selTotal() { return sumOf(formSel); }
function totalTxt() { return esc(s('pickTotal') + ' : ' + NL.money(selTotal())); }
function selHTML() {
  if (!formSel.length) return '';
  return formSel.map(function (x, i) {
    return '<div class="cg-row"><div class="cg-m"><strong>' + esc(x.name) + '</strong><span class="muted">' + esc(typeLabel(x.type)) + (x.price ? ' · ' + esc(NL.money(x.price)) : '') + '</span></div>' +
      '<input class="cg-q" type="number" min="1" step="1" inputmode="numeric" value="' + esc(x.qty) + '" data-i="' + i + '" aria-label="' + esc(NL.t('f.qty')) + '">' +
      '<button type="button" class="btn ghost sm" data-cat="sel-rm" data-i="' + i + '" aria-label="' + esc(NL.t('delete')) + '">×</button></div>';
  }).join('') + '<p class="muted" id="cg-total" style="margin:6px 0 0">' + totalTxt() + '</p>';
}
function fieldsetHTML() {
  var groups = ['service', 'decor'].map(function (tp) {
    var l = cat().filter(function (k) { return k.type === tp; }).sort(byName);
    return l.length ? '<optgroup label="' + esc(typeLabel(tp)) + '">' + l.map(function (k) { return '<option value="' + k.id + '">' + esc(k.name) + (k.price ? ' · ' + esc(NL.money(k.price)) : '') + '</option>'; }).join('') + '</optgroup>' : '';
  }).join('');
  return '<fieldset class="fs"><legend>' + esc(s('pickT')) + '</legend><div id="cg-sel">' + selHTML() + '</div>' +
    (cat().length ? '<div class="cg-pick"><select id="cg-pick" aria-label="' + esc(s('pickPh')) + '"><option value="">' + esc(s('pickPh')) + '</option>' + groups + '</select><button type="button" class="btn sm" data-cat="pick-add">' + esc(s('pickAdd')) + '</button></div><p class="hint" style="margin-top:6px">' + esc(s('pickHint')) + '</p>'
      : '<p class="muted">' + esc(s('pickNone')) + '</p>') + '</fieldset>';
}
function lineHTML(itemId, qty) {
  return '<div class="line"><select class="l-item" aria-label="' + esc(NL.t('f.equipment')) + '">' + NL.db.items.map(function (i) { return '<option value="' + i.id + '"' + (i.id === itemId ? ' selected' : '') + '>' + esc(i.name) + ' (' + i.qty + ')</option>'; }).join('') +
    '</select><input class="l-qty" type="number" min="1" step="1" inputmode="numeric" value="' + qty + '" aria-label="' + esc(NL.t('f.qty')) + '"><button type="button" class="btn ghost sm" data-act="rm-line" aria-label="' + esc(NL.t('delete')) + '">×</button></div>';
}
function addMaterials(mats, mult) {
  var box = document.getElementById('lines'); if (!box || !mult) return;
  (mats || []).forEach(function (m) {
    if (!NL.byId(NL.db.items, m.itemId)) return;
    var found = null;
    [].forEach.call(box.querySelectorAll('.line'), function (r) { var si = r.querySelector('.l-item'); if (si && si.value === m.itemId) found = r; });
    if (found) { var q = found.querySelector('.l-qty'); q.value = (parseInt(q.value, 10) || 0) + m.qty * mult; }
    else box.insertAdjacentHTML('beforeend', lineHTML(m.itemId, m.qty * mult));
  });
}
function syncTotal() {
  var el = document.getElementById('c-total'); if (!el) return;
  var cur = parseFloat(el.value) || 0, nt = selTotal();
  if (cur === 0 || cur === lastAuto) { el.value = nt || ''; lastAuto = nt; }
}
function refreshSel() { var b = document.getElementById('cg-sel'); if (b) b.innerHTML = selHTML(); }
function pickAdd() {
  var sel = document.getElementById('cg-pick'); if (!sel || !sel.value) return;
  var k = NL.byId(cat(), sel.value); if (!k) return;
  var ex = formSel.filter(function (x) { return x.cid === k.id; })[0];
  if (ex) ex.qty += 1;
  else formSel.push({ cid: k.id, type: k.type, name: k.name, price: k.price || 0, qty: 1, duration: k.duration || '', desc: k.desc || '', details: k.details || '', materials: clone(k.materials || []) });
  addMaterials(k.materials, 1); refreshSel(); syncTotal(); sel.value = '';
}
window.NL_cat = {
  fieldset: function (c) { formSel = clone(c.services || []); lastAuto = selTotal(); return fieldsetHTML(); },
  collect: function () { return clone(formSel); }
};

/* ---------- Bouton « Catalogue » sur la fiche client : choix uniquement dans le catalogue ---------- */
function mergeLines(c, mats, mult) {
  c.lines = c.lines || [];
  (mats || []).forEach(function (m) {
    if (!NL.byId(NL.db.items, m.itemId)) return;
    var l = c.lines.filter(function (x) { return x.itemId === m.itemId; })[0];
    if (l) l.qty = (+l.qty || 0) + m.qty * mult; else c.lines.push({ itemId: m.itemId, qty: m.qty * mult });
  });
}
function pickModal(id) {
  var c = NL.byId(NL.db.clients, id); if (!c) return;
  var title = s('pickBtnT', { n: c.name });
  if (!cat().length) {
    NL.openModal(title, '<p class="empty">' + esc(s('pickNone')) + '</p><div class="sheet-f"><span></span><span class="grp"><button type="button" class="btn" data-act="close-modal">' + esc(NL.t('close')) + '</button></span></div>');
    return;
  }
  var cur = {}; (c.services || []).forEach(function (x) { cur[x.cid] = x; });
  var groups = ['service', 'decor'].map(function (tp) {
    var l = cat().filter(function (k) { return k.type === tp; }).sort(byName);
    if (!l.length) return '';
    return '<h3 class="cg-h">' + esc(typeLabel(tp)) + '</h3>' + l.map(function (k) {
      var x = cur[k.id];
      return '<div class="cg-row cg-opt"><label class="cg-chk"><input type="checkbox" class="cg-ck" value="' + k.id + '"' + (x ? ' checked' : '') + '><span class="cg-m"><strong>' + esc(k.name) + '</strong><span class="muted">' + esc(NL.money(k.price || 0)) + (k.duration ? ' · ' + esc(k.duration) : '') + '</span></span></label>' +
        '<input class="cg-pq" type="number" min="1" step="1" inputmode="numeric" value="' + esc(x ? x.qty : 1) + '" aria-label="' + esc(NL.t('f.qty')) + '"></div>';
    }).join('');
  }).join('');
  NL.openModal(title, '<form id="f" data-cat-submit="pick" data-id="' + id + '" novalidate><input id="cg-ms" type="search" placeholder="' + esc(s('search')) + '" aria-label="' + esc(s('search')) + '" autocomplete="off">' + groups + foot('') + '</form>');
}
function savePick(f) {
  var c = NL.byId(NL.db.clients, f.getAttribute('data-id')); if (!c) return;
  var old = c.services || [], oldTotal = sumOf(old), oldBy = {};
  old.forEach(function (x) { oldBy[x.cid] = x; });
  var next = old.filter(function (x) { return !NL.byId(cat(), x.cid); });
  [].forEach.call(f.querySelectorAll('.cg-opt'), function (r) {
    var ck = r.querySelector('.cg-ck'); if (!ck.checked) return;
    var k = NL.byId(cat(), ck.value); if (!k) return;
    var q = Math.max(1, parseInt(r.querySelector('.cg-pq').value, 10) || 1), prev = oldBy[k.id];
    var x = prev || { cid: k.id, type: k.type, name: k.name, price: k.price || 0, duration: k.duration || '', desc: k.desc || '', details: k.details || '', materials: clone(k.materials || []) };
    var delta = q - (prev ? prev.qty : 0);
    x.qty = q;
    if (delta > 0) mergeLines(c, x.materials, delta);
    next.push(x);
  });
  c.services = next;
  if (!(+c.total) || +c.total === oldTotal) c.total = sumOf(next);
  NL.closeModal(); NL.commit(); NL.toast(NL.t('saved'));
}

/* ---------- Fiche imprimable pour l'équipe ---------- */
function sheetDoc(c) {
  var db = NL.db, rtl = NL.lang === 'ar', co = db.meta.company || {};
  function row(k, v) { return v ? '<tr><th>' + esc(k) + '</th><td dir="auto">' + v + '</td></tr>' : ''; }
  var css = 'body{font-family:"Segoe UI",Tahoma,Arial,sans-serif;color:#111C33;margin:0;padding:28px 20px;background:#fff;line-height:1.5}.page{max-width:780px;margin:0 auto}h2{font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#52607A;margin:26px 0 8px}h3{margin:0 0 4px;font-size:17px}table{border-collapse:collapse;width:100%}td,th{padding:7px 10px;border-bottom:1px solid #DDE4F0;text-align:start;vertical-align:top}th{color:#52607A;font-weight:600;width:30%}.top{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;border-bottom:3px solid #1D4ED8;padding-bottom:14px}.top b{font-size:20px;display:block}.meta{text-align:end}.meta strong{font-size:24px;color:#1D4ED8;display:block}.svc{border:1px solid #DDE4F0;border-radius:10px;padding:12px 14px;margin-bottom:12px;break-inside:avoid}.mut{color:#52607A}.svc img{max-width:100%;max-height:220px;border-radius:8px;margin:8px 0;display:block}pre{white-space:pre-wrap;font:inherit;margin:6px 0}ul{margin:4px 0;padding-inline-start:20px}ul.chk{list-style:none;padding:0}.n{text-align:end;white-space:nowrap}.btn{margin-top:22px;font:inherit;padding:10px 18px;border:0;border-radius:8px;background:#1D4ED8;color:#fff;cursor:pointer;font-weight:600}@media print{.noprint{display:none}body{padding:0}}';
  var phones = [c.phone, c.phone2].filter(Boolean).join(' · ');
  var h = '<!doctype html><html lang="' + NL.lang + '" dir="' + (rtl ? 'rtl' : 'ltr') + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(s('sheetT') + ' - ' + c.name) + '</title><style>' + css + '</style></head><body><div class="page">';
  h += '<div class="top"><div>' + (db.meta.logo ? '<img src="' + esc(db.meta.logo) + '" alt="" style="max-height:56px;max-width:160px;display:block;margin-bottom:6px">' : '') + '<b>' + esc(co.name || '') + '</b></div><div class="meta"><strong>' + esc(s('sheetT')) + '</strong><div>' + esc(NL.dparts(c.date).long) + '</div></div></div>';
  h += '<h2>' + esc(s('sClient')) + '</h2><table>' + row(NL.t('f.name'), esc(c.name)) + row(s('sPhone'), phones ? '<bdi dir="ltr">' + esc(phones) + '</bdi>' : '') + row(s('sAddr'), esc(c.address || '')) + '</table>';
  h += '<h2>' + esc(s('sEvent')) + '</h2><table>' + row(NL.t('f.eventType'), esc(NL.t('ev.' + c.eventType))) + row(s('sWhen'), esc(NL.dparts(c.date).long)) + row(s('sWhere'), esc(c.venue || '')) + '</table>';
  var team = (c.staffIds || []).map(function (id) { return NL.byId(db.staff, id); }).filter(Boolean).map(function (m) {
    return '<li>' + esc(m.name) + (m.role ? ' · ' + esc(m.role) : '') + (m.phone ? ' · <bdi dir="ltr">' + esc(m.phone) + '</bdi>' : '') + '</li>';
  }).join('');
  if (team) h += '<h2>' + esc(s('sTeam')) + '</h2><ul>' + team + '</ul>';
  h += '<h2>' + esc(s('sSvc')) + '</h2>';
  if ((c.services || []).length) {
    h += c.services.map(function (x) {
      var entry = NL.byId(cat(), x.cid), photo = entry && entry.photo;
      var mats = (x.materials || []).map(function (m) { var it = NL.byId(db.items, m.itemId); return it ? '<li>' + esc(it.name) + ' × ' + esc(m.qty * (x.qty || 1)) + '</li>' : ''; }).join('');
      return '<div class="svc"><h3>' + esc(x.name) + (x.qty > 1 ? ' <span class="mut">× ' + esc(x.qty) + '</span>' : '') + '</h3><div class="mut">' + esc(typeLabel(x.type)) + (x.duration ? ' · ' + esc(s('sDur')) + ' : ' + esc(x.duration) : '') + '</div>' +
        (photo ? '<img src="' + esc(photo) + '" alt="">' : '') + (x.desc ? '<p>' + esc(x.desc) + '</p>' : '') +
        (x.details ? '<div><strong>' + esc(s('sDet')) + '</strong><pre>' + esc(x.details) + '</pre></div>' : '') +
        (mats ? '<div><strong>' + esc(s('sMat')) + '</strong><ul>' + mats + '</ul></div>' : '') + '</div>';
    }).join('');
  } else h += '<p class="mut">' + esc(s('sNone')) + '</p>';
  var lines = (c.lines || []).map(function (l) { var it = NL.byId(db.items, l.itemId); return it ? '<tr><td>' + esc(it.name) + '</td><td class="n">' + esc(l.qty) + '</td></tr>' : ''; }).join('');
  if (lines) h += '<h2>' + esc(s('sEq')) + '</h2><table><tr><th style="width:auto">' + esc(s('sItem')) + '</th><th class="n" style="width:auto">' + esc(s('sQty')) + '</th></tr>' + lines + '</table>';
  if (c.order) h += '<h2>' + esc(s('sOrder')) + '</h2><pre>' + esc(c.order) + '</pre>';
  var tasks = (c.checklist || []).filter(function (k) { return k.ph !== 'ret'; }).map(function (k) { return '<li>' + (k.done ? '☑' : '☐') + ' ' + esc(k.text) + '</li>'; }).join('');
  if (tasks) h += '<h2>' + esc(s('sCheck')) + '</h2><ul class="chk">' + tasks + '</ul>';
  h += '<button class="btn noprint" onclick="window.print()">' + esc(s('sPrint')) + '</button></div></body></html>';
  return h;
}
function openSheet(id) {
  var c = NL.byId(NL.db.clients, id); if (!c) return;
  var url = URL.createObjectURL(new Blob([sheetDoc(c)], { type: 'text/html;charset=utf-8' })), w = null;
  try { w = window.open(url, '_blank'); } catch (e) {}
  if (!w) {
    var slug = (c.name.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'client').slice(0, 30), a = document.createElement('a');
    a.href = url; a.download = 'fiche-' + slug + '-' + c.date + '.html'; document.body.appendChild(a); a.click(); a.remove(); NL.toast(s('sOpenFail'));
  }
  setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
}

/* ---------- Clics, saisie, formulaires ---------- */
root.addEventListener('click', function (e) {
  var b = e.target.closest('[data-cat]'); if (!b) return;
  var a = b.getAttribute('data-cat'), id = b.getAttribute('data-id');
  if (a === 'add') editModal();
  else if (a === 'edit') editModal(id);
  else if (a === 'del') arm(b, function () { var l = cat(), i = l.findIndex(function (x) { return x.id === id; }); if (i >= 0) l.splice(i, 1); NL.closeModal(); NL.commit(); NL.toast(NL.t('deleted')); });
  else if (a === 'add-mat') { var box = document.getElementById('k-mats'); if (box && NL.db.items.length) box.insertAdjacentHTML('beforeend', matRow({ itemId: NL.db.items[0].id, qty: 1 })); }
  else if (a === 'rm-mat') b.closest('.line').remove();
  else if (a === 'rm-photo') { formPhoto = ''; var p = document.getElementById('k-ph'); if (p) p.innerHTML = photoInner(); }
  else if (a === 'view') { var k = NL.byId(cat(), id); if (k && k.photo) NL.openModal(k.name, '<div class="viewer"><img src="' + esc(k.photo) + '" alt=""></div>'); }
  else if (a === 'pick-add') pickAdd();
  else if (a === 'sel-rm') { formSel.splice(+b.getAttribute('data-i'), 1); refreshSel(); syncTotal(); }
  else if (a === 'pick') pickModal(id);
  else if (a === 'sheet') openSheet(id);
});
root.addEventListener('input', function (e) {
  var t = e.target;
  if (t.id === 'cg-ms') {
    var qq = t.value.trim().toLowerCase();
    [].forEach.call(root.querySelectorAll('.cg-opt'), function (r) { r.style.display = r.textContent.toLowerCase().indexOf(qq) >= 0 ? '' : 'none'; });
  }
  else if (t.id === 'cg-q') { ui.q = t.value; var l = document.getElementById('cgList'); if (l) l.innerHTML = listHTML(); }
  else if (t.classList && t.classList.contains('cg-q')) {
    var x = formSel[+t.getAttribute('data-i')]; if (!x) return;
    var nq = Math.max(1, parseInt(t.value, 10) || 1), old = x.qty; x.qty = nq;
    if (nq > old) addMaterials(x.materials, nq - old);
    var tt = document.getElementById('cg-total'); if (tt) tt.innerHTML = totalTxt();
    syncTotal();
  }
});
root.addEventListener('change', function (e) {
  var t = e.target;
  if (t.id === 'cg-t') { ui.type = t.value; var l = document.getElementById('cgList'); if (l) l.innerHTML = listHTML(); }
  else if (t.id === 'k-photo-in' && t.files && t.files[0]) {
    var f = t.files[0]; t.value = '';
    readImage(f, 800, 0.72).then(function (d) { formPhoto = d; var p = document.getElementById('k-ph'); if (p) p.innerHTML = photoInner(); }, function () { NL.toast(NL.t('err.photo')); });
  }
});
root.addEventListener('submit', function (e) {
  var f = e.target, a = f.getAttribute('data-cat-submit'); if (!a) return;
  e.preventDefault();
  if (a === 'save') saveEntry(f); else if (a === 'pick') savePick(f);
});
root.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && e.target.id === 'cg-ms') e.preventDefault();
});

/* ---------- Bouton « Fiche équipe » et services sur les cartes clients ---------- */
function inject() {
  [].forEach.call(root.querySelectorAll('.card-f:not([data-cgd])'), function (f) {
    var ec = f.querySelector('[data-act="edit-client"]'); if (!ec) return;
    f.setAttribute('data-cgd', '1');
    var id = ec.getAttribute('data-id'), c = NL.byId(NL.db.clients, id); if (!c) return;
    var n = (c.services || []).length;
    var pb = document.createElement('button'); pb.type = 'button'; pb.className = 'btn sm'; pb.setAttribute('data-cat', 'pick'); pb.setAttribute('data-id', id); pb.textContent = s('pickBtn') + (n ? ' (' + n + ')' : '');
    f.insertBefore(pb, ec);
    var b = document.createElement('button'); b.type = 'button'; b.className = 'btn sm'; b.setAttribute('data-cat', 'sheet'); b.setAttribute('data-id', id); b.textContent = s('sheet');
    f.insertBefore(b, ec);
    if ((c.services || []).length) {
      var p = document.createElement('p'); p.className = 'sv';
      p.textContent = c.services.map(function (x) { return x.name + (x.qty > 1 ? ' ×' + x.qty : ''); }).join(' · ');
      f.parentNode.insertBefore(p, f);
    }
  });
}
var pending = false, obs = new MutationObserver(function () {
  if (pending) return; pending = true;
  requestAnimationFrame(function () { pending = false; sync(); });
});
function sync() { obs.disconnect(); try { inject(); } catch (err) {} obs.observe(app, { childList: true, subtree: true }); }
sync();
if (location.hash === '#catalogue') NL.commit();
})();
