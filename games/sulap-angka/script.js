// Sulap Angka — logic game ini.
// Terdiri dari: (1) kalkulator sederhana, (2) tiga game sulap bertimer.

(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }

  /* =========================================================
     KALKULATOR
     Ekspresi dihitung dengan parser sendiri (tanpa eval/Function),
     jadi aman dan tidak bergantung pada aturan keamanan browser.
     ========================================================= */

  function evaluate(src) {
    var s = src.replace(/\s+/g, '');
    var pos = 0;

    function fail() { throw new Error('ekspresi tidak valid'); }

    function number() {
      var start = pos;
      while (pos < s.length && /[0-9.]/.test(s.charAt(pos))) pos++;
      if (start === pos) fail();
      var v = parseFloat(s.slice(start, pos));
      if (isNaN(v)) fail();
      return v;
    }

    function factor() {
      var c = s.charAt(pos);
      if (c === '-') { pos++; return -factor(); }
      if (c === '+') { pos++; return factor(); }
      if (c === '(') {
        pos++;
        var v = expr();
        if (s.charAt(pos) !== ')') fail();
        pos++;
        return v;
      }
      return number();
    }

    function term() {
      var v = factor();
      while (s.charAt(pos) === '*' || s.charAt(pos) === '/') {
        var op = s.charAt(pos++);
        var r = factor();
        v = op === '*' ? v * r : v / r;
      }
      return v;
    }

    function expr() {
      var v = term();
      while (s.charAt(pos) === '+' || s.charAt(pos) === '-') {
        var op = s.charAt(pos++);
        var r = term();
        v = op === '+' ? v + r : v - r;
      }
      return v;
    }

    var result = expr();
    if (pos !== s.length || !isFinite(result)) fail();
    return result;
  }

  var display = $('display');
  var expression = '';
  var justEvaluated = false;

  function prettify(text) {
    return text.replace(/\*/g, '×').replace(/\//g, '÷').replace(/-/g, '−');
  }

  function renderDisplay() {
    display.textContent = expression ? prettify(expression) : '0';
  }

  function showCalcError() {
    expression = '';
    justEvaluated = false;
    display.textContent = 'Error';
  }

  function pressKey(k) {
    if (k === 'C') {
      expression = '';
      justEvaluated = false;
      renderDisplay();
      return;
    }
    if (k === 'back') {
      expression = expression.slice(0, -1);
      justEvaluated = false;
      renderDisplay();
      return;
    }
    if (k === '=') {
      if (!expression.trim()) return;
      try {
        var n = evaluate(expression);
        expression = String(Math.round(n * 1e10) / 1e10);
        justEvaluated = true;
        renderDisplay();
      } catch (e) {
        showCalcError();
      }
      return;
    }

    // Setelah "=", angka/kurung/titik memulai hitungan baru; operator melanjutkan hasil.
    if (justEvaluated && /[0-9.(]/.test(k)) expression = '';
    justEvaluated = false;
    expression += k;
    renderDisplay();
  }

  document.querySelectorAll('.keys [data-key]').forEach(function (b) {
    b.addEventListener('click', function () { pressKey(b.dataset.key); });
  });

  // Dukungan keyboard (diabaikan saat mengetik di kolom isian)
  document.addEventListener('keydown', function (e) {
    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (/^[0-9().+\-*\/]$/.test(e.key)) { pressKey(e.key); e.preventDefault(); }
    else if (e.key === 'Enter' && tag !== 'BUTTON') { pressKey('='); e.preventDefault(); }
    else if (e.key === 'Backspace') { pressKey('back'); e.preventDefault(); }
    else if (e.key === 'Escape') { pressKey('C'); }
  });

  /* =========================================================
     MESIN GAME BERTIMER
     ========================================================= */

  var COUNTDOWN = 5;
  var timerId = null;

  function runTimer(timerEl, button) {
    clearInterval(timerId);
    var n = COUNTDOWN;
    timerEl.textContent = '0' + n;
    button.disabled = true;
    button.classList.remove('ready');

    timerId = setInterval(function () {
      n--;
      timerEl.textContent = String(Math.max(n, 0)).padStart(2, '0');
      if (n <= 0) {
        clearInterval(timerId);
        button.disabled = false;
        button.classList.add('ready');
      }
    }, 1000);
  }

  // key: awalan id elemen. steps: daftar instruksi.
  // hasInput: true jika setelah langkah terakhir pemain mengisi hasil akhir.
  function createGame(key, steps, hasInput) {
    var els = {
      step: $(key + 'Step'),
      num: $(key + 'Num'),
      text: $(key + 'Instruction'),
      timer: $(key + 'Timer'),
      done: $(key + 'Done'),
      final: $(key + 'Final'),
      answer: $(key + 'Answer'),
      result: $(key + 'Result')
    };
    var idx = 0;

    function renderStep() {
      els.num.textContent = idx + 1;
      els.text.textContent = steps[idx];
      runTimer(els.timer, els.done);
    }

    function start() {
      idx = 0;
      if (els.final) els.final.hidden = true;
      if (els.answer) els.answer.value = '';
      els.result.hidden = true;
      els.step.hidden = false;
      renderStep();
    }

    function showResult() {
      if (els.final) els.final.hidden = true;
      els.result.hidden = false;
    }

    els.done.addEventListener('click', function () {
      if (els.done.disabled) return;
      idx++;
      if (idx < steps.length) { renderStep(); return; }

      clearInterval(timerId);
      els.step.hidden = true;
      if (hasInput) {
        els.final.hidden = false;
        els.answer.focus();
      } else {
        showResult();
      }
    });

    return { start: start, showResult: showResult, els: els };
  }

  /* ---- Game 1: Baca Angka ---- */
  var mind = createGame('mind', [
    'Pikirkan satu angka dari 1 sampai 9. Jangan masukkan ke website.',
    'Kalikan angka pilihanmu dengan 10.',
    'Tambahkan 0. Jangan ubah hasilnya.',
    'Lihat hasil terakhir di kalkulator. Jangan beri tahu angka awalmu.'
  ], true);

  $('mindReveal').addEventListener('click', function () {
    var raw = mind.els.answer.value.trim();
    var v = Number(raw);
    var valid = raw !== '' && Number.isInteger(v) && v >= 10 && v <= 90 && v % 10 === 0;

    if (!valid) {
      $('mindValue').textContent = '?';
      $('mindExplain').textContent = 'Hasil tidak sesuai. Pastikan kamu memilih angka 1–9 dan mengikuti semua langkah.';
    } else {
      var n = v / 10;
      $('mindValue').textContent = n;
      $('mindExplain').textContent = 'Kamu tadi memilih angka ' + n + '. Hasil ' + v +
        ' adalah angka pilihanmu dikali 10, jadi aku cukup membaginya dengan 10.';
    }
    mind.showResult();
  });
  $('mindReset').addEventListener('click', function () { mind.start(); });

  /* ---- Game 2: Selalu Jadi 4 ---- */
  var four = createGame('four', [
    'Pikirkan satu angka dari 1 sampai 9.',
    'Kalikan angka itu dengan 2.',
    'Tambahkan 8.',
    'Bagi hasilnya dengan 2, lalu kurangi angka awalmu.'
  ], false);
  $('fourReset').addEventListener('click', function () { four.start(); });

  /* ---- Game 3: Tebak Tanggal ---- */
  var MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli',
                'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  var DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  var birth = createGame('birth', [
    'Pikirkan bulan lahirmu (1–12). Kalikan dengan 5.',
    'Tambahkan 7.',
    'Kalikan hasilnya dengan 10.',
    'Tambahkan tanggal lahirmu.',
    'Kurangi 70.'
  ], true);

  $('birthReveal').addEventListener('click', function () {
    var raw = birth.els.answer.value.trim();
    var v = Number(raw);
    var month = Math.floor(v / 50);
    var day = v % 50;
    var valid = raw !== '' && Number.isInteger(v) && month >= 1 && month <= 12 &&
      day >= 1 && day <= DAYS_IN_MONTH[month - 1];

    if (!valid) {
      $('birthValue').textContent = '?';
      $('birthExplain').textContent = 'Hasil hitungan tidak sesuai. Coba ulangi dengan teliti.';
    } else {
      $('birthValue').textContent = day + ' ' + MONTHS[month - 1];
      $('birthExplain').textContent = 'Rumus akhirnya menghasilkan 50 × bulan + tanggal. Jadi hasil ' + v +
        ' dapat dibaca kembali sebagai bulan ' + month + ' dan tanggal ' + day + '.';
    }
    birth.showResult();
  });
  $('birthReset').addEventListener('click', function () { birth.start(); });

  /* ---- Tab ---- */
  var games = {
    mind: { panel: $('mindGame'), api: mind },
    four: { panel: $('fourGame'), api: four },
    birth: { panel: $('birthGame'), api: birth }
  };

  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var chosen = tab.dataset.game;
      document.querySelectorAll('.tab').forEach(function (t) {
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      Object.keys(games).forEach(function (k) { games[k].panel.hidden = k !== chosen; });
      games[chosen].api.start();
    });
  });

  mind.start();
})();
