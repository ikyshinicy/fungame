// Biro Jodoh — logic game ini.

(function () {
  'use strict';

  // Zodiak: [nama, mulai (bulan*100+tanggal), akhir]
  var ZODIAC = [
    ['Capricorn', 1222, 1231], ['Capricorn', 101, 119], ['Aquarius', 120, 218],
    ['Pisces', 219, 320], ['Aries', 321, 419], ['Taurus', 420, 520],
    ['Gemini', 521, 620], ['Cancer', 621, 722], ['Leo', 723, 822],
    ['Virgo', 823, 922], ['Libra', 923, 1022], ['Scorpio', 1023, 1121],
    ['Sagittarius', 1122, 1221]
  ];

  // Urutan shio menurut sisa bagi tahun / 12
  var SHIO = ['Monyet', 'Ayam', 'Anjing', 'Babi', 'Tikus', 'Kerbau',
              'Macan', 'Kelinci', 'Naga', 'Ular', 'Kuda', 'Kambing'];

  // Elemen shio menurut angka terakhir tahun (0-9)
  var ELEMEN = ['Logam', 'Logam', 'Air', 'Air', 'Kayu', 'Kayu', 'Api', 'Api', 'Tanah', 'Tanah'];

  function $(id) { return document.getElementById(id); }

  function parseDate(value) {
    var p = value.split('-');
    return { y: Number(p[0]), m: Number(p[1]), d: Number(p[2]) };
  }

  function zodiacOf(date) {
    var n = date.m * 100 + date.d;
    for (var i = 0; i < ZODIAC.length; i++) {
      if (n >= ZODIAC[i][1] && n <= ZODIAC[i][2]) return ZODIAC[i][0];
    }
    return '-';
  }

  function shioOf(date) { return SHIO[((date.y % 12) + 12) % 12]; }
  function elementOf(date) { return ELEMEN[((date.y % 10) + 10) % 10]; }

  // Hash sederhana (FNV-1a) supaya hasil selalu sama untuk pasangan yang sama.
  function hash(text) {
    var h = 2166136261;
    var s = text.toUpperCase();
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function verdictOf(score) {
    if (score >= 90) return { icon: 'sparkles', text: 'Wah, ini sudah masuk zona serius nih?' };
    if (score >= 80) return { icon: 'flame', text: 'Chemistry-nya kuat. Jangan cuma jadi teman.' };
    if (score >= 70) return { icon: 'heart', text: 'Ada potensi. Tinggal lihat siapa mulai duluan.' };
    if (score >= 60) return { icon: 'smile', text: 'Lumayan cocok. Jangan keburu GR.' };
    if (score >= 50) return { icon: 'eye', text: 'Ada chemistry, tapi semesta masih menghitung.' };
    return { icon: 'users', text: 'Sepertinya berteman dulu.' };
  }

  function showError(msg) {
    var box = $('error');
    box.textContent = msg;
    box.hidden = false;
  }

  function calculate() {
    var n1 = $('n1').value.trim();
    var n2 = $('n2').value.trim();
    var v1 = $('d1').value;
    var v2 = $('d2').value;

    if (!n1 || !n2 || !v1 || !v2) {
      showError('Isi nama dan tanggal lahir keduanya dulu ya.');
      return;
    }
    $('error').hidden = true;

    var d1 = parseDate(v1);
    var d2 = parseDate(v2);

    // Kunci pasangan diurutkan, jadi (A, B) dan (B, A) selalu memberi skor yang sama.
    var key = [n1.toLowerCase() + '|' + v1, n2.toLowerCase() + '|' + v2].sort().join('#');
    var h = hash(key);
    var score = 45 + (h % 55);

    $('rn1').textContent = n1;
    $('rn2').textContent = n2;
    $('p1').textContent = n1;
    $('p2').textContent = n2;

    $('z1').textContent = zodiacOf(d1);
    $('z2').textContent = zodiacOf(d2);
    $('s1').textContent = shioOf(d1);
    $('s2').textContent = shioOf(d2);
    $('e1').textContent = elementOf(d1);
    $('e2').textContent = elementOf(d2);

    $('score').textContent = score;
    $('a').textContent = Math.min(99, score + (h % 9)) + '%';
    $('b').textContent = (55 + ((h >>> 3) % 45)) + '%';
    $('c').textContent = (55 + ((h >>> 7) % 45)) + '%';
    $('d').textContent = (50 + ((h >>> 11) % 50)) + '%';

    var verdict = verdictOf(score);
    $('v').textContent = verdict.text;
    $('verdictIcon').innerHTML = FunIcon.svg(verdict.icon);

    var bar = $('bar');
    bar.style.width = '0%';
    $('result').hidden = false;
    // Dua frame supaya transisi lebar bar terlihat berjalan dari 0.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { bar.style.width = score + '%'; });
    });

    $('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.addEventListener('DOMContentLoaded', function () {
    $('go').addEventListener('click', calculate);

    $('reset').addEventListener('click', function () {
      $('result').hidden = true;
      $('bar').style.width = '0%';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    ['n1', 'n2'].forEach(function (id) {
      $(id).addEventListener('keydown', function (e) {
        if (e.key === 'Enter') calculate();
      });
    });
  });
})();
