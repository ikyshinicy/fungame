// FunLab — main.js
// Interaksi kecil untuk halaman utama: toggle mode gelap/terang.

(function () {
  const toggleBtn = document.querySelector('.theme-toggle');
  if (!toggleBtn) return;

  const STORAGE_KEY = 'funlab-theme';

  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    toggleBtn.textContent = theme === 'dark' ? '🌙' : '☀️';
  }

  const saved = localStorage.getItem(STORAGE_KEY) || 'light';
  applyTheme(saved);

  toggleBtn.addEventListener('click', function () {
    const current = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  });
})();
