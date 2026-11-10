/* Evora - synchronisation des données avec Firestore (un jeu de données par compte) */
const CH = 250000;   // taille max d'un morceau (caractères), reste sous la limite de 1 Mo par document
const FS = 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
const LOCAL_KEY = 'dafter-events-v1';

/* ---------- utilitaires (testables sans navigateur) ---------- */
export function safe(id) { return String(id).replace(/[^A-Za-z0-9_-]/g, '_'); }
export function hash(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return s.length + ':' + (h >>> 0).toString(36);
}
/* découpe la base en fichiers : les données texte d'un côté, chaque photo de l'autre */
export function pack(dbo) {
  const o = JSON.parse(JSON.stringify(dbo));
  const files = {};
  (o.clients || []).forEach(function (c) {
    const ph = c.photos || [];
    ph.forEach(function (p, i) { files['cp_' + safe(c.id) + '_' + i] = p; });
    c.photoCount = ph.length; delete c.photos;
  });
  (o.items || []).forEach(function (it) {
    if (it.photo) { files['ip_' + safe(it.id)] = it.photo; it.hasPhoto = 1; }
    delete it.photo;
  });
  o.meta = o.meta || {};
  if (o.meta.logo) { files.logo = o.meta.logo; o.meta.hasLogo = 1; }
  delete o.meta.logo;
  files.data = JSON.stringify(o);
  return files;
}
export function unpack(files) {
  const o = JSON.parse(files.data);
  (o.clients || []).forEach(function (c) {
    c.photos = [];
    for (let i = 0; i < (c.photoCount || 0); i++) { const p = files['cp_' + safe(c.id) + '_' + i]; if (p) c.photos.push(p); }
    delete c.photoCount;
  });
  (o.items || []).forEach(function (it) { it.photo = files['ip_' + safe(it.id)] || ''; delete it.hasPhoto; });
  o.meta = o.meta || {};
  o.meta.logo = files.logo || ''; delete o.meta.hasLogo;
  return o;
}
/* vrai si la base ne contient que les données d'exemple */
export function isPristine(d) {
  const ks = ['clients', 'advances', 'items', 'staff', 'suppliers', 'expenses', 'attendance', 'stats'];
  const co = (d.meta && d.meta.company && d.meta.company.name) || '';
  const logo = d.meta && d.meta.logo;
  return !co && !logo && ks.every(function (k) { return (d[k] || []).every(function (x) { return x && x.demo; }); });
}

/* ---------- moteur de synchronisation ---------- */
export function makeEngine(io) {
  let state = io.loadState() || { ts: null, dirty: false };
  let lastLocal = io.readLocal();
  let timer = null, queue = Promise.resolve();
  const st = function (s) { if (io.status) io.status(s); };

  function run(fn) {
    queue = queue.then(function () { return fn(); }).catch(function (e) {
      if (io.log) io.log(e);
      st(io.isOffline && io.isOffline(e) ? 'offline' : 'error');
    });
    return queue;
  }

  async function pull(man) {
    st('syncing');
    const files = {};
    await Promise.all(Object.keys(man.files || {}).map(async function (name) {
      const info = man.files[name], parts = [];
      for (let k = 0; k < info.n; k++) parts.push(io.getChunk(name, k));
      const got = await Promise.all(parts);
      if (got.some(function (p) { return p == null; })) throw new Error('missing chunk ' + name);
      const s = got.join('');
      if (hash(s) !== info.h) throw new Error('inconsistent ' + name);
      files[name] = s;
    }));
    if (!files.data) throw new Error('no data');
    const str = JSON.stringify(unpack(files));
    io.backupLocal();
    io.writeLocal(str);
    lastLocal = str;
    state = { ts: man.ts, dirty: false }; io.saveState(state);
    st('synced');
    io.applyPulled();
  }

  async function push() {
    const local = io.readLocal();
    if (!local) return;
    st('syncing');
    const files = pack(JSON.parse(local));
    const cur = await io.getManifest();
    if (cur && cur.ts !== state.ts) return resolve(cur);
    const man = { ts: Math.max(Date.now(), (cur ? cur.ts : 0) + 1), files: {} };
    const sets = [], dels = [];
    Object.keys(files).forEach(function (name) {
      const s = files[name], h = hash(s), n = Math.max(1, Math.ceil(s.length / CH)), old = cur && cur.files && cur.files[name];
      man.files[name] = { n: n, h: h };
      if (!old || old.h !== h || old.n !== n) for (let k = 0; k < n; k++) sets.push({ name: name, k: k, s: s.slice(k * CH, (k + 1) * CH) });
    });
    if (cur && cur.files) Object.keys(cur.files).forEach(function (name) {
      const keep = man.files[name], was = cur.files[name].n;
      for (let k = keep ? keep.n : 0; k < was; k++) dels.push({ name: name, k: k });
    });
    await io.writeChunks(sets);
    await io.setManifest(man);
    await io.deleteChunks(dels);
    const changedMeanwhile = io.readLocal() !== local;
    state = { ts: man.ts, dirty: changedMeanwhile }; io.saveState(state);
    if (changedMeanwhile) schedule(); else st('synced');
  }

  async function resolve(cur) {
    if (!io.canApply()) return;
    const local = io.readLocal();
    const pristine = !local || isPristine(JSON.parse(local));
    const choice = pristine ? 'cloud' : await io.ask();
    if (choice === 'cloud') return pull(cur);
    state = { ts: cur.ts, dirty: true }; io.saveState(state);
    return push();
  }

  async function check() {
    st('syncing');
    const cur = await io.getManifest();
    const local = io.readLocal();
    const pristine = !local || isPristine(JSON.parse(local));
    if (!cur) { if (!pristine) return push(); st('synced'); return; }
    if (state.ts == null || cur.ts < state.ts) return resolve(cur);
    if (cur.ts > state.ts) {
      if (!state.dirty) { if (io.canApply()) return pull(cur); return; }
      return resolve(cur);
    }
    if (state.dirty) return push();
    st('synced');
  }

  async function flush() { if (state.dirty) return push(); }
  function schedule() { clearTimeout(timer); timer = setTimeout(function () { run(flush); }, 2500); }

  return {
    init: function () { return run(check); },
    refresh: function () { return run(check); },
    flushNow: function () { clearTimeout(timer); return run(flush); },
    onLocalWrite: function (v) {
      if (v === lastLocal) return;
      lastLocal = v; state = { ts: state.ts, dirty: true }; io.saveState(state);
      st('pending'); schedule();
    },
    get state() { return state; }
  };
}

/* ---------- branchement navigateur + Firestore ---------- */
const LBL = {
  en: { syncing: 'Syncing...', synced: 'Synced', offline: 'Offline', error: 'Sync error', pending: 'Saving...', ask: 'The data in the cloud differs from the data on this device.\n\nOK = use the cloud data (this device will be replaced)\nCancel = keep this device (the cloud will be replaced)' },
  fr: { syncing: 'Synchronisation...', synced: 'Synchronisé', offline: 'Hors ligne', error: 'Erreur de synchro', pending: 'Enregistrement...', ask: 'Les données du cloud sont différentes de celles de cet appareil.\n\nOK = utiliser les données du cloud (celles de cet appareil seront remplacées)\nAnnuler = garder cet appareil (le cloud sera remplacé)' },
  ar: { syncing: 'جار المزامنة...', synced: 'تمت المزامنة', offline: 'غير متصل', error: 'خطأ في المزامنة', pending: 'جار الحفظ...', ask: 'البيانات في السحابة تختلف عن بيانات هذا الجهاز.\n\nموافق = استعمال بيانات السحابة (سيتم استبدال بيانات هذا الجهاز)\nإلغاء = الاحتفاظ بهذا الجهاز (سيتم استبدال السحابة)' }
};
function lang() {
  let l = 'en';
  try { l = localStorage.getItem('dafter-events-lang') || (navigator.language || 'en').slice(0, 2); } catch (e) {}
  return LBL[l] ? l : 'en';
}
function modalOpen() { const m = document.getElementById('modal'); return !!(m && !m.hidden); }

export async function start(opts) {
  const uid = opts.user.uid;
  const FSM = await import(FS);
  const fdb = FSM.getFirestore(opts.app);
  const P = Storage.prototype;
  const raw = window.__nlRaw || { get: P.getItem, set: P.setItem, remove: P.removeItem };
  const LK = LOCAL_KEY + '-' + uid, SK = 'nl-sync-' + uid, BK = 'nl-sync-backup-' + uid;
  const ref = function (id) { return FSM.doc(fdb, 'users', uid, 'sync', id); };

  async function commit(ops) {
    let batch = FSM.writeBatch(fdb), n = 0, size = 0;
    for (const op of ops) {
      if (op.set) { batch.set(ref(op.id), op.set); size += op.set.s.length; } else batch.delete(ref(op.id));
      n++;
      if (n >= 200 || size > 2500000) { await batch.commit(); batch = FSM.writeBatch(fdb); n = 0; size = 0; }
    }
    if (n) await batch.commit();
  }

  const io = {
    loadState: function () { try { return JSON.parse(raw.get.call(localStorage, SK)); } catch (e) { return null; } },
    saveState: function (s) { try { raw.set.call(localStorage, SK, JSON.stringify(s)); } catch (e) {} },
    readLocal: function () { try { return raw.get.call(localStorage, LK); } catch (e) { return null; } },
    writeLocal: function (s) { raw.set.call(localStorage, LK, s); },
    backupLocal: function () { try { const v = raw.get.call(localStorage, LK); if (v) raw.set.call(localStorage, BK, v); } catch (e) {} },
    getManifest: async function () { const s = await FSM.getDoc(ref('manifest')); return s.exists() ? s.data() : null; },
    setManifest: function (m) { return FSM.setDoc(ref('manifest'), m); },
    getChunk: async function (name, k) { const s = await FSM.getDoc(ref('f_' + name + '~' + k)); return s.exists() ? s.data().s : null; },
    writeChunks: function (list) { return commit(list.map(function (c) { return { id: 'f_' + c.name + '~' + c.k, set: { s: c.s } }; })); },
    deleteChunks: function (list) { return commit(list.map(function (c) { return { id: 'f_' + c.name + '~' + c.k }; })); },
    canApply: function () { return !modalOpen(); },
    ask: function () { return Promise.resolve(window.confirm(LBL[lang()].ask) ? 'cloud' : 'local'); },
    applyPulled: function () { const go = function () { if (modalOpen()) setTimeout(go, 1500); else location.reload(); }; go(); },
    isOffline: function (e) { return navigator.onLine === false || (e && (e.code === 'unavailable' || e.code === 'failed-precondition')); },
    log: function (e) { console.warn('[sync]', e); },
    status: function (s) {
      const txt = LBL[lang()][s] || '';
      window.NL_syncLabel = txt;
      const el = document.getElementById('nl-sync');
      if (el) el.textContent = txt;
    }
  };

  const eng = makeEngine(io);
  const prev = P.setItem;
  P.setItem = function (k) {
    const r = prev.apply(this, arguments);
    if (this === localStorage && k === LOCAL_KEY) eng.onLocalWrite(String(arguments[1]));
    return r;
  };
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') eng.refresh(); });
  window.addEventListener('online', function () { eng.refresh(); });
  setInterval(function () { if (document.visibilityState === 'visible') eng.refresh(); }, 60000);
  window.NL_sync = { refresh: eng.refresh, flush: eng.flushNow };
  eng.init();
}
