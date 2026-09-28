// Angka Keberuntungan (nama jadi angka) — logic game ini.

(function () {
  'use strict';

  var MEANINGS = {
    1: 'Pemimpin — mandiri, berani memulai, dan suka mengambil keputusan.',
    2: 'Harmoni — peka, mudah bekerja sama, dan menghargai hubungan.',
    3: 'Kreatif — ekspresif, komunikatif, dan penuh ide.',
    4: 'Stabil — praktis, tekun, dan suka sesuatu yang teratur.',
    5: 'Petualang — suka kebebasan, perubahan, dan pengalaman baru.',
    6: 'Penyayang — hangat, perhatian, dan dekat dengan orang lain.',
    7: 'Misterius — suka berpikir dalam, penasaran, dan intuitif.',
    8: 'Ambisius — fokus pada target, percaya diri, dan suka hasil nyata.',
    9: 'Humanis — idealis, berjiwa besar, dan mudah peduli pada orang lain.'
  };

  // Tahapan animasi loading: [persen bar, judul, keterangan]
  var STAGES = [
    [25, 'Mengubah huruf menjadi angka...', 'A = 1, B = 2, C = 3...'],
    [48, 'Menjumlahkan angka...', 'Mencari total energi nama'],
    [72, 'Menyederhanakan angka...', 'Membongkar angka terakhir'],
    [90, 'Menentukan angka keberuntungan...', 'Hampir ketemu...'],
    [100, 'Rahasia hampir terbuka...', 'Siap melihat hasil']
  ];

  var timers = [];
  var running = false;

  function $(id) { return document.getElementById(id); }

  function letterValue(ch) { return ch.charCodeAt(0) - 64; } // A=1 ... Z=26

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  function showError(msg) {
    var box = $('error');
    box.textContent = msg;
    box.hidden = false;
  }

  function renderResult(raw, clean) {
    var total = 0;
    var lettersBox = $('letters');
    lettersBox.innerHTML = '';

    var values = [];
    clean.split('').forEach(function (ch) {
      var v = letterValue(ch);
      total += v;
      values.push(v);

      var el = document.createElement('div');
      el.className = 'letter';
      var strong = document.createElement('strong');
      strong.textContent = ch;
      var small = document.createElement('small');
      small.textContent = v;
      el.appendChild(strong);
      el.appendChild(small);
      lettersBox.appendChild(el);
    });

    $('displayName').textContent = raw;
    $('sumStep').innerHTML = values.join(' + ') + ' = <strong>' + total + '</strong>';

    var chain = [total];
    var n = total;
    while (n > 9) {
      n = String(n).split('').reduce(function (a, b) { return a + Number(b); }, 0);
      chain.push(n);
    }

    $('reduceStep').innerHTML = chain.length === 1
      ? '<strong>' + total + '</strong> sudah satu digit.'
      : chain.map(function (x, i) {
          return i === 0 || i === chain.length - 1 ? '<strong>' + x + '</strong>' : x;
        }).join('<span class="chain-arrow">' + FunIcon.svg('arrow-right') + '</span>');

    $('final').textContent = n;
    $('meaning').textContent = 'Angka ' + n + ' — ' + MEANINGS[n];
  }

  function calculate() {
    if (running) return;

    var raw = $('name').value.trim().toUpperCase();
    var clean = raw.replace(/[^A-Z]/g, '');
    if (!clean) {
      showError('Masukkan nama dulu ya (pakai huruf A–Z).');
      return;
    }
    $('error').hidden = true;

    running = true;
    $('calculate').disabled = true;
    $('result').hidden = true;

    var loading = $('loading');
    var bar = $('loadingBar');
    var text = $('loadingText');
    var sub = $('loadingSub');

    loading.hidden = false;
    bar.style.width = '8%';
    text.textContent = 'Membaca nama...';
    sub.textContent = 'Menganalisis setiap huruf';

    STAGES.forEach(function (stage, i) {
      later(function () {
        bar.style.width = stage[0] + '%';
        text.textContent = stage[1];
        sub.textContent = stage[2];
      }, 600 * (i + 1));
    });

    later(function () {
      renderResult(raw, clean);
      loading.hidden = true;
      $('result').hidden = false;
      $('result').scrollIntoView({ behavior: 'smooth' });
      running = false;
      $('calculate').disabled = false;
    }, 3000);
  }

  function reset() {
    clearTimers();
    running = false;
    $('calculate').disabled = false;
    $('loading').hidden = true;
    $('result').hidden = true;
    $('name').focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.addEventListener('DOMContentLoaded', function () {
    $('calculate').addEventListener('click', calculate);
    $('again').addEventListener('click', reset);
    $('name').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
