/* Evora - écran de connexion (Firebase Authentication, email + mot de passe) */
const ALLOW_SIGNUP = true;          // false = pas de création de compte depuis l'app
const APP_NAME = 'Evora';
const FB = 'https://www.gstatic.com/firebasejs/10.12.2/';

const LOADED = (function () { try { return localStorage.getItem('nl-uid') || ''; } catch (e) { return ''; } })();
function lang() {
  var l = 'en';
  try { l = localStorage.getItem('dafter-events-lang') || (navigator.language || 'en').slice(0, 2); } catch (e) {}
  return ['en', 'fr', 'ar'].indexOf(l) >= 0 ? l : 'en';
}

const TX = {
  en: { logout: 'Log out', sub: 'Sign in to access your account', email: 'Email', pw: 'Password', signin: 'Sign in', signup: 'Create account', toSignup: 'No account yet? Create one', toSignin: 'Already have an account? Sign in', forgot: 'Forgot password?', loading: 'Loading...', fill: 'Enter your email and password.', needEmail: 'Enter your email first.', resetSent: 'Reset email sent. Check your inbox.', bad: 'Incorrect email or password.', invalidEmail: 'This email is not valid.', exists: 'An account already exists with this email.', weak: 'Password must have at least 6 characters.', many: 'Too many attempts. Try again later.', net: 'Network error. Check your connection.', generic: 'Something went wrong. Try again.', cfg: 'Firebase is not configured. Fill in firebase-config.js.', loadFail: 'Could not load the sign-in service. Check your connection and reload.' },
  fr: { logout: 'Déconnexion', sub: 'Connectez-vous pour accéder à votre compte', email: 'Email', pw: 'Mot de passe', signin: 'Se connecter', signup: 'Créer un compte', toSignup: 'Pas encore de compte ? Créez-en un', toSignin: 'Déjà un compte ? Connectez-vous', forgot: 'Mot de passe oublié ?', loading: 'Chargement...', fill: 'Saisissez votre email et votre mot de passe.', needEmail: "Saisissez d'abord votre email.", resetSent: 'Email de réinitialisation envoyé. Vérifiez votre boîte de réception.', bad: 'Email ou mot de passe incorrect.', invalidEmail: "Cet email n'est pas valide.", exists: 'Un compte existe déjà avec cet email.', weak: 'Le mot de passe doit contenir au moins 6 caractères.', many: 'Trop de tentatives. Réessayez plus tard.', net: 'Erreur réseau. Vérifiez votre connexion.', generic: 'Une erreur est survenue. Réessayez.', cfg: "Firebase n'est pas configuré. Remplissez firebase-config.js.", loadFail: 'Impossible de charger le service de connexion. Vérifiez votre connexion et rechargez la page.' },
  ar: { logout: 'تسجيل الخروج', sub: 'سجل الدخول للوصول إلى حسابك', email: 'البريد الإلكتروني', pw: 'كلمة المرور', signin: 'تسجيل الدخول', signup: 'إنشاء حساب', toSignup: 'ليس لديك حساب؟ أنشئ واحدا', toSignin: 'لديك حساب؟ سجل الدخول', forgot: 'نسيت كلمة المرور؟', loading: 'جار التحميل...', fill: 'أدخل بريدك الإلكتروني وكلمة المرور.', needEmail: 'أدخل بريدك الإلكتروني أولا.', resetSent: 'تم إرسال رسالة إعادة التعيين. تحقق من بريدك.', bad: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.', invalidEmail: 'هذا البريد الإلكتروني غير صالح.', exists: 'يوجد حساب بهذا البريد الإلكتروني.', weak: 'يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل.', many: 'محاولات كثيرة. أعد المحاولة لاحقا.', net: 'خطأ في الشبكة. تحقق من الاتصال.', generic: 'حدث خطأ. أعد المحاولة.', cfg: 'لم يتم إعداد Firebase. املأ ملف firebase-config.js.', loadFail: 'تعذر تحميل خدمة تسجيل الدخول. تحقق من الاتصال وأعد تحميل الصفحة.' }
};

/* ---------- styles + overlay ---------- */
const st = document.createElement('style');
st.textContent = `
#nl-auth{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px;background:var(--bg,#fff);color:var(--ink,#111C33);font:15px/1.5 'IBM Plex Sans','IBM Plex Sans Arabic',system-ui,sans-serif;overflow:auto}
#nl-auth .nl-card{width:min(400px,100%);background:var(--surface,#fff);border:1px solid var(--line,#DDE4F0);border-radius:16px;padding:28px 24px;display:flex;flex-direction:column;gap:14px;text-align:center}
#nl-auth img{width:84px;height:84px;object-fit:contain;margin:0 auto;border-radius:18px}
#nl-auth h1{margin:0;font-size:26px;line-height:1.15}
#nl-auth .nl-muted{margin:0;color:var(--muted,#52607A);font-size:14px}
#nl-auth form{display:flex;flex-direction:column;gap:12px;text-align:start}
#nl-auth label{font-size:13px;font-weight:600;display:block;margin-bottom:4px}
#nl-auth input{font:inherit;color:inherit;background:var(--surface,#fff);border:1px solid var(--line,#DDE4F0);border-radius:8px;padding:10px 12px;min-height:44px;width:100%;box-sizing:border-box}
#nl-auth input:focus-visible,#nl-auth button:focus-visible{outline:2px solid var(--accent,#1D4ED8);outline-offset:2px}
#nl-auth .nl-btn{font:inherit;font-weight:600;border:0;border-radius:8px;min-height:44px;cursor:pointer;background:var(--accent,#1D4ED8);color:var(--accent-ink,#fff)}
#nl-auth .nl-btn:disabled{opacity:.6;cursor:default}
#nl-auth .nl-link{font:inherit;font-size:14px;background:none;border:0;color:var(--accent,#1D4ED8);cursor:pointer;padding:4px;text-decoration:underline}
#nl-auth .nl-msg{margin:0;font-size:14px;border-radius:8px;padding:8px 10px;text-align:start}
#nl-auth .nl-msg.err{background:var(--bad-soft,#F9E0DD);color:var(--bad,#B3261E)}
#nl-auth .nl-msg.ok{background:var(--good-soft,#DDF1E6);color:var(--good,#1E7A4F)}
#nl-auth .nl-lang{display:flex;gap:6px;justify-content:center}
#nl-auth .nl-lang button{font:inherit;font-size:13px;font-weight:600;border:1px solid var(--line,#DDE4F0);background:none;color:var(--muted,#52607A);border-radius:999px;padding:3px 12px;cursor:pointer}
#nl-auth .nl-lang button[aria-pressed="true"]{background:var(--accent,#1D4ED8);color:var(--accent-ink,#fff);border-color:transparent}
html.nl-ok #root{visibility:visible}
`;
document.head.appendChild(st);
const ov = document.createElement('div');
ov.id = 'nl-auth';
document.body.appendChild(ov);

function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function reveal() { document.documentElement.classList.add('nl-ok'); ov.remove(); startLogoutButton(); }

function showLoading() {
  ov.setAttribute('dir', lang() === 'ar' ? 'rtl' : 'ltr');
  ov.innerHTML = '<div class="nl-card"><img src="logo-app-320.png" alt=""><p class="nl-muted">' + esc(TX[lang()].loading) + '</p></div>';
}
function showError(text) {
  ov.innerHTML = '<div class="nl-card"><img src="logo-app-320.png" alt=""><p class="nl-msg err" role="alert">' + esc(text) + '</p></div>';
}

showLoading();

/* ---------- load Firebase ---------- */
let auth, M, cfg, fbApp;
try {
  cfg = (await import('./firebase-config.js')).firebaseConfig;
  if (!cfg || !cfg.apiKey || String(cfg.apiKey).indexOf('VOTRE') === 0) { showError(TX[lang()].cfg); throw new Error('config'); }
  const A = await import(FB + 'firebase-app.js');
  M = await import(FB + 'firebase-auth.js');
  fbApp = A.initializeApp(cfg, 'evora-auth');
  auth = M.getAuth(fbApp);
} catch (e) {
  if (e && e.message !== 'config') showError(TX[lang()].loadFail);
  throw e;
}

/* ---------- login screen ---------- */
let mode = 'login';
function errText(err) {
  const s = TX[lang()], c = (err && err.code) || '';
  if (/invalid-credential|wrong-password|user-not-found|invalid-login/.test(c)) return s.bad;
  if (c === 'auth/invalid-email') return s.invalidEmail;
  if (c === 'auth/email-already-in-use') return s.exists;
  if (c === 'auth/weak-password') return s.weak;
  if (c === 'auth/too-many-requests') return s.many;
  if (c === 'auth/network-request-failed') return s.net;
  return s.generic;
}
function showLogin(keep) {
  const s = TX[lang()], l = lang(), signup = mode === 'signup';
  ov.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr');
  ov.innerHTML =
    '<div class="nl-card"><img src="logo-app-320.png" alt=""><div><h1>' + APP_NAME + '</h1><p class="nl-muted">' + esc(s.sub) + '</p></div>' +
    '<form id="nl-form" novalidate>' +
    '<div><label for="nl-email">' + esc(s.email) + '</label><input id="nl-email" type="email" dir="ltr" autocomplete="email" inputmode="email" autocapitalize="off" value="' + esc(keep || '') + '"></div>' +
    '<div><label for="nl-pw">' + esc(s.pw) + '</label><input id="nl-pw" type="password" dir="ltr" autocomplete="' + (signup ? 'new-password' : 'current-password') + '"></div>' +
    '<p class="nl-msg" id="nl-msg" role="alert" hidden></p>' +
    '<button class="nl-btn" id="nl-go" type="submit">' + esc(signup ? s.signup : s.signin) + '</button></form>' +
    (signup ? '' : '<button type="button" class="nl-link" id="nl-forgot">' + esc(s.forgot) + '</button>') +
    (ALLOW_SIGNUP ? '<button type="button" class="nl-link" id="nl-toggle">' + esc(signup ? s.toSignin : s.toSignup) + '</button>' : '') +
    '<div class="nl-lang">' + ['en', 'fr', 'ar'].map(function (x) { return '<button type="button" data-l="' + x + '" aria-pressed="' + (x === l) + '">' + (x === 'ar' ? 'ع' : x.toUpperCase()) + '</button>'; }).join('') + '</div></div>';

  const $ = function (id) { return ov.querySelector('#' + id); };
  function msg(text, kind) { const m = $('nl-msg'); m.textContent = text; m.className = 'nl-msg ' + (kind || 'err'); m.hidden = false; }

  $('nl-form').onsubmit = async function (e) {
    e.preventDefault();
    const email = $('nl-email').value.trim(), pw = $('nl-pw').value;
    if (!email || !pw) return msg(s.fill);
    const btn = $('nl-go'); btn.disabled = true;
    try {
      if (signup) await M.createUserWithEmailAndPassword(auth, email, pw);
      else await M.signInWithEmailAndPassword(auth, email, pw);
      showLoading();
    } catch (err) { msg(errText(err)); btn.disabled = false; }
  };
  const fg = $('nl-forgot');
  if (fg) fg.onclick = async function () {
    const email = $('nl-email').value.trim();
    if (!email) return msg(s.needEmail);
    try { await M.sendPasswordResetEmail(auth, email); msg(s.resetSent, 'ok'); } catch (err) { msg(errText(err)); }
  };
  const tg = $('nl-toggle');
  if (tg) tg.onclick = function () { mode = signup ? 'login' : 'signup'; showLogin($('nl-email').value); };
  ov.querySelectorAll('.nl-lang button').forEach(function (b) {
    b.onclick = function () { try { localStorage.setItem('dafter-events-lang', b.dataset.l); } catch (e) {} showLogin($('nl-email').value); };
  });
}

/* ---------- données par utilisateur ---------- */
function migrate(uid) {
  const raw = window.__nlRaw || { get: Storage.prototype.getItem, set: Storage.prototype.setItem, remove: Storage.prototype.removeItem };
  const base = 'dafter-events-v1', k = base + '-' + uid;
  try {
    if (!raw.get.call(localStorage, k)) { const old = raw.get.call(localStorage, base); if (old) raw.set.call(localStorage, k, old); }
    raw.remove.call(localStorage, base);
  } catch (e) {}
}

/* bouton de déconnexion injecté dans l'en-tête de l'app */
function injectLogout() {
  const h = document.querySelector('.htools');
  if (!h || h.querySelector('#nl-logout')) return;
  const sp = document.createElement('span');
  sp.id = 'nl-sync'; sp.className = 'muted'; sp.style.fontSize = '12px'; sp.setAttribute('aria-live', 'polite');
  sp.textContent = window.NL_syncLabel || '';
  h.appendChild(sp);
  const b = document.createElement('button');
  b.id = 'nl-logout'; b.type = 'button'; b.className = 'btn sm';
  b.textContent = TX[lang()].logout;
  if (window.NL_user && window.NL_user.email) b.title = window.NL_user.email;
  b.onclick = function () { M.signOut(auth); };
  h.appendChild(b);
}
function startLogoutButton() {
  injectLogout();
  const root = document.getElementById('root');
  if (root) new MutationObserver(injectLogout).observe(root, { childList: true, subtree: true });
}

window.NL_logout = function () { return M.signOut(auth); };

M.onAuthStateChanged(auth, function (user) {
  if (!user) {
    if (LOADED) { try { localStorage.removeItem('nl-uid'); } catch (e) {} location.reload(); return; }
    showLogin();
    return;
  }
  window.NL_user = { uid: user.uid, email: user.email };
  if (user.uid === LOADED) {
    reveal();
    import('./sync.js').then(function (m) { return m.start({ app: fbApp, user: user }); }).catch(function (e) { console.warn('[sync] indisponible', e); });
    return;
  }
  migrate(user.uid);
  try { localStorage.setItem('nl-uid', user.uid); } catch (e) {}
  location.reload();
});
