// FunLab — main.js
// Interaksi kecil untuk semua halaman: toggle mode gelap/terang.
// Butuh icons.js dimuat lebih dulu.

(function () {
  const toggleBtn = document.querySelector('.theme-toggle');
  if (!toggleBtn) return;

  const STORAGE_KEY = 'funlab-theme';

  function readSaved() {
    try { return localStorage.getItem(STORAGE_KEY) || 'light'; }
    catch (e) { return 'light'; }
  }

  function save(theme) {
    try { localStorage.setItem(STORAGE_KEY, theme); }
    catch (e) { /* penyimpanan diblokir — abaikan */ }
  }

  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    toggleBtn.innerHTML = window.FunIcon ? FunIcon.svg(theme === 'dark' ? 'moon' : 'sun') : '';
    toggleBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }

  applyTheme(readSaved());

  toggleBtn.addEventListener('click', function () {
    const current = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    save(next);
    applyTheme(next);
  });
})();
