// Siapa Kamu Jika Jadi Anime? — logic game ini.
//
// BACKEND (nanti): isi API_URL di bawah dengan alamat endpoint AI.
//   Request : POST { answers: [7 string] }  (Content-Type: application/json)
//   Response: { character, anime, match, traits: [string], reason, profile }
//             match = angka/persen, mis. "87%" atau 87
// Selama API_URL kosong, atau kalau request gagal / format jawaban tidak sesuai,
// game memakai analisis lokal (analyzeLocal) supaya tetap bisa dimainkan.

(function () {
  'use strict';

  var API_URL = 'https://wzokcxnnalvrrvgclwfb.supabase.co/functions/v1/anime-personality';
  var API_TIMEOUT_MS = 30000;
  var MIN_LOADING_MS = 1200;

  var QUESTIONS = [
    { q: 'Kalau kamu melihat temanmu diperlakukan tidak adil, apa yang biasanya kamu lakukan?',
      ph: 'Jawab dengan bahasamu sendiri...' },
    { q: 'Kalau kamu punya satu tujuan besar yang sangat sulit dicapai, bagaimana kamu mengejarnya?',
      ph: 'Ceritakan caramu...' },
    { q: 'Ketika harus memilih antara logika dan perasaan, biasanya kamu lebih mengikuti yang mana? Kenapa?',
      ph: 'Jawab sejujurnya...' },
    { q: 'Kalau seseorang yang kamu percaya mengkhianatimu, apa reaksi pertamamu?',
      ph: 'Apa yang kemungkinan besar kamu lakukan?' },
    { q: 'Dalam sebuah kelompok, kamu biasanya menjadi orang seperti apa?',
      ph: 'Pemimpin, pengamat, pencetus ide, penengah, atau lainnya? Jelaskan...' },
    { q: 'Kalau kamu bisa memiliki satu kekuatan super, kekuatan apa yang kamu pilih dan untuk apa?',
      ph: 'Jelaskan pilihanmu...' },
    { q: 'Menurutmu, apa yang paling menggambarkan dirimu sebagai seseorang?',
      ph: 'Bebas. Ini pertanyaan terakhir...' }
  ];

  // Kata kunci per tipe: { kata: bobot }. Dicocokkan sebagai potongan teks jawaban
  // (huruf kecil, tanda baca jadi spasi), jadi "tolong" cocok dengan "menolong".
  // Kata pendek yang bisa nyasar ke kata lain ditulis dengan spasi di kedua sisi,
  // mis. ' bela ' supaya tidak cocok dengan "belajar".
  // Tambah kata baru di sini kalau ada pola jawaban yang belum tertangkap.
  var TYPES = {
    strategist: {
      character: 'The Strategist', anime: 'Death Note',
      traits: ['Strategis', 'Analitis', 'Tenang'],
      reason: 'Jawabanmu banyak berputar pada rencana, logika, dan pertimbangan sebelum bertindak. Kamu nyaman membaca situasi dulu, lalu memilih langkah yang paling efektif.',
      profile: 'Kamu tipe yang berpikir beberapa langkah ke depan. Emosi tidak kamu abaikan, tetapi keputusan penting biasanya kamu timbang dengan kepala dingin. Kekuatanmu ada di ketenangan dan kemampuan melihat pola.',
      kw: { rencana: 3, strategi: 3, logika: 3, analisis: 3, rasional: 3, hitung: 2, pikir: 2, pertimbang: 2,
            cermat: 2, taktik: 3, efektif: 2, efisien: 2, fakta: 2, ' data ': 2, sistem: 2, riset: 2,
            konsekuensi: 3, 'kepala dingin': 3, langkah: 1, susun: 2 }
    },
    hero: {
      character: 'The Main Character', anime: 'My Hero Academia',
      traits: ['Berani', 'Loyal', 'Protektif'],
      reason: 'Jawabanmu menunjukkan dorongan untuk bertindak saat sesuatu terasa tidak benar, terutama ketika orang yang kamu pedulikan butuh bantuan.',
      profile: 'Kamu punya rasa keadilan yang kuat dan sulit berpura-pura tidak melihat. Kamu maju lebih dulu, kadang sebelum semua rencana siap, karena bagimu diam bukan pilihan.',
      kw: { tolong: 3, bantu: 3, lindung: 3, ' bela ': 3, membela: 3, pembela: 3, adil: 3, keadilan: 3, berani: 3,
            lawan: 3, pahlawan: 3, korban: 1, tinggal_diam: 4, 'ikut campur': 3, hadapi: 2, menghadapi: 2,
            cegah: 2, samperin: 2, ' maju ': 2, selamatkan: 3, menyelamatkan: 3 }
    },
    rival: {
      character: 'The Rival', anime: 'Naruto',
      traits: ['Ambisius', 'Kompetitif', 'Gigih'],
      reason: 'Kamu terlihat termotivasi oleh tantangan dan target. Jawabanmu banyak bicara soal berlatih, membuktikan diri, dan tidak mau berhenti di tengah jalan.',
      profile: 'Kamu tumbuh dengan cara mengejar. Saingan bukan ancaman bagimu, tetapi bahan bakar. Kamu jarang puas dengan hasil kemarin dan selalu ingin versi dirimu yang lebih kuat.',
      kw: { ' menang ': 3, kemenangan: 3, terbaik: 3, saingan: 3, tantangan: 3, kompetisi: 3, bersaing: 3,
            ambisi: 3, target: 2, tekad: 3, gigih: 3, 'tidak menyerah': 4, 'nggak menyerah': 4, 'gak menyerah': 4,
            'pantang menyerah': 4, latihan: 2, berlatih: 2, 'kerja keras': 3, buktikan: 3, membuktikan: 3,
            juara: 3, 'lebih baik': 2, konsisten: 2, disiplin: 2, kuat: 1 }
    },
    healer: {
      character: 'The Heart', anime: 'Fruits Basket',
      traits: ['Empatik', 'Hangat', 'Peduli'],
      reason: 'Kamu memberi perhatian besar pada perasaan dan hubungan. Jawabanmu memperlihatkan bahwa kamu mempertimbangkan dampak tindakanmu pada orang lain.',
      profile: 'Kamu pendengar yang baik dan tempat orang merasa aman bercerita. Kehangatanmu sering menenangkan suasana, dan kamu cenderung memberi kesempatan kedua.',
      kw: { perasaan: 3, peduli: 3, empati: 3, maaf: 3, memaafkan: 3, jaga: 2, menjaga: 2, sayang: 2, dengar: 2,
            curhat: 3, menenangkan: 3, hangat: 3, tulus: 3, pengertian: 3, mengerti: 2, memahami: 2, nyaman: 2,
            kasih: 2, hati: 1, rangkul: 3, terluka: 2, sedih: 1 }
    },
    wildcard: {
      character: 'The Wild Card', anime: 'One Piece',
      traits: ['Spontan', 'Bebas', 'Kreatif'],
      reason: 'Jawabanmu terasa santai dan sulit ditebak. Kamu tidak terlalu suka aturan yang kaku dan lebih percaya pada kebebasan serta kejutan.',
      profile: 'Kamu membawa energi yang membuat suasana hidup. Kamu berani mencoba hal baru tanpa terlalu lama menimbang, dan justru dari situlah petualanganmu sering dimulai.',
      kw: { bebas: 3, kebebasan: 3, iseng: 3, lucu: 2, spontan: 3, random: 3, kacau: 3, petualang: 3, santai: 2,
            seru: 2, bercanda: 2, humor: 2, mengalir: 3, 'ikut arus': 3, impulsif: 3, nekat: 3, 'tanpa rencana': 4,
            jelajah: 2, eksplor: 3, 'coba-coba': 3, asik: 2, asyik: 2, 'jalan-jalan': 2, kocak: 2 }
    },
    protector: {
      character: 'The Guardian', anime: 'Demon Slayer',
      traits: ['Setia', 'Tangguh', 'Bertanggung Jawab'],
      reason: 'Jawabanmu memperlihatkan rasa tanggung jawab yang kuat terhadap orang-orang terdekat dan kemauan bertahan meski keadaan berat.',
      profile: 'Kamu tipe yang diam-diam menanggung banyak hal demi orang yang kamu sayangi. Kesabaran dan kesetiaanmu jadi fondasi yang membuat orang di sekitarmu merasa aman.',
      kw: { keluarga: 3, berkorban: 4, pengorbanan: 4, 'tanggung jawab': 4, loyal: 3, setia: 3, bertahan: 3,
            sabar: 3, tabah: 3, tangguh: 3, 'orang terdekat': 3, 'orang tersayang': 3, 'orang yang aku sayang': 4,
            'orang yang saya sayang': 4, andalan: 2, diandalkan: 3 }
    },
    dreamer: {
      character: 'The Dreamer', anime: 'Your Name',
      traits: ['Imajinatif', 'Sensitif', 'Reflektif'],
      reason: 'Jawabanmu penuh imajinasi dan makna. Kamu cenderung melihat sesuatu dari sisi perasaan, cerita, dan kemungkinan yang belum terjadi.',
      profile: 'Kamu punya dunia dalam yang kaya. Kreativitas dan kepekaanmu membuatmu menangkap hal-hal kecil yang sering terlewat orang lain, dan kamu mencari arti di balik banyak kejadian.',
      kw: { mimpi: 3, impian: 3, imajinasi: 3, khayal: 3, membayangkan: 3, kreatif: 3, ' seni ': 3, menulis: 2,
            musik: 2, menggambar: 3, desain: 2, cerita: 2, filosofi: 3, makna: 3, melamun: 3, puitis: 3,
            inspirasi: 3, terbang: 2, langit: 2, bintang: 2, senja: 3, hujan: 2 }
    },
    quiet: {
      character: 'The Quiet Power', anime: 'Mob Psycho 100',
      traits: ['Tenang', 'Rendah Hati', 'Pengamat'],
      reason: 'Jawabanmu terdengar tenang dan tidak banyak pamer. Kamu lebih suka mengamati dulu dan menyimpan banyak hal di dalam.',
      profile: 'Kamu tidak perlu jadi pusat perhatian untuk punya pengaruh. Di balik sikap kalem dan sederhana, ada kekuatan besar yang baru terlihat ketika keadaan benar-benar menuntut.',
      kw: { diam: 2, pengamat: 3, mengamati: 3, pendiam: 3, introvert: 3, menyendiri: 3, memendam: 3,
            sederhana: 3, 'apa adanya': 3, 'rendah hati': 3, 'biasa saja': 3, 'biasa aja': 3,
            'tidak banyak bicara': 4, 'nggak banyak bicara': 4, 'gak banyak bicara': 4, tenang: 1,
            menahan: 2, sendiri: 1, menghindar: 2, 'low profile': 3 }
    }
  };

  var TYPE_KEYS = Object.keys(TYPES);

  function $(id) { return document.getElementById(id); }

  // ---------- analisis lokal ----------

  function normalize(text) {
    return ' ' + String(text).toLowerCase()
      .replace(/tinggal diam/g, ' tinggal_diam ')
      .replace(/[^a-z0-9_\-\s]/g, ' ')
      .replace(/\s+/g, ' ') + ' ';
  }

  // Hash sederhana supaya jawaban yang sama selalu memberi hasil yang sama
  // saat tidak ada kata kunci yang cocok.
  function hashText(text) {
    var h = 0;
    for (var i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
    return h;
  }

  function analyzeLocal(answers) {
    var scores = {};
    TYPE_KEYS.forEach(function (k) { scores[k] = 0; });

    answers.forEach(function (raw) {
      var text = normalize(raw);
      TYPE_KEYS.forEach(function (k) {
        var kw = TYPES[k].kw;
        Object.keys(kw).forEach(function (word) {
          if (text.indexOf(word) !== -1) scores[k] += kw[word];
        });
      });
    });

    var ranked = TYPE_KEYS.slice().sort(function (a, b) { return scores[b] - scores[a]; });
    var top = scores[ranked[0]];
    var winners = ranked.filter(function (k) { return scores[k] === top; });
    var seed = hashText(answers.join('|'));
    var pick = winners.length === 1 ? winners[0] : winners[seed % winners.length];

    var second = winners.length > 1 ? top : scores[ranked[1]];
    var pct = 66 + Math.min(top, 16) + Math.min(top - second, 10);
    pct = Math.min(pct, 96);
    if (top === 0) pct = 70 + (seed % 8);

    var t = TYPES[pick];
    return { character: t.character, anime: t.anime, match: pct + '%', traits: t.traits.slice(),
             reason: t.reason, profile: t.profile };
  }

  // ---------- backend (opsional) ----------

  function isValidResult(d) {
    return d && typeof d === 'object' &&
      typeof d.character === 'string' && d.character &&
      typeof d.anime === 'string' && d.anime &&
      typeof d.reason === 'string' && typeof d.profile === 'string' &&
      Array.isArray(d.traits);
  }

  function analyzeRemote(answers) {
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, API_TIMEOUT_MS) : null;
    return fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: answers }),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) {
      if (timer) clearTimeout(timer);
      if (!r.ok) throw new Error('API ' + r.status);
      return r.json();
    }).then(function (d) {
      if (!isValidResult(d)) throw new Error('Format jawaban API tidak sesuai');
      return d;
    });
  }

  function analyze(answers) {
    if (!API_URL || typeof fetch !== 'function') return Promise.resolve(analyzeLocal(answers));
    return analyzeRemote(answers).catch(function () { return analyzeLocal(answers); });
  }

  // ---------- UI ----------

  var answers = [];
  var idx = 0;

  function showStep() {
    var total = QUESTIONS.length;
    var isLast = idx === total - 1;
    var pct = Math.round(((idx + 1) / total) * 100);

    $('step').textContent = 'Pertanyaan ' + (idx + 1) + ' / ' + total;
    $('bar').style.width = pct + '%';
    $('progress').setAttribute('aria-valuenow', String(pct));
    $('question').textContent = QUESTIONS[idx].q;

    var ta = $('answer');
    ta.placeholder = QUESTIONS[idx].ph;
    ta.value = answers[idx] || '';

    $('back').hidden = idx === 0;
    $('next').innerHTML = isLast
      ? FunIcon.svg('sparkles') + ' Analisis Aku'
      : 'Lanjut ' + FunIcon.svg('arrow-right');
    $('next').disabled = !ta.value.trim();
    ta.focus();
  }

  function saveCurrent() { answers[idx] = $('answer').value.trim(); }

  function onNext() {
    if (!$('answer').value.trim()) return;
    saveCurrent();
    if (idx === QUESTIONS.length - 1) { startAnalysis(); return; }
    idx++;
    showStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function onBack() {
    if (idx === 0) return;
    saveCurrent();
    idx--;
    showStep();
  }

  function startAnalysis() {
    $('quiz').hidden = true;
    $('result').hidden = true;
    $('loading').hidden = false;

    var started = Date.now();
    analyze(answers.slice()).then(function (data) {
      var wait = Math.max(0, MIN_LOADING_MS - (Date.now() - started));
      setTimeout(function () { showResult(data); }, wait);
    });
  }

  function showResult(d) {
    $('loading').hidden = true;

    $('character').textContent = d.character || 'Karakter Misterius';
    $('anime').textContent = d.anime || '';

    var match = String(d.match == null ? '' : d.match).trim();
    if (match && match.indexOf('%') === -1 && !isNaN(Number(match))) match += '%';
    $('match').textContent = match ? match + ' cocok' : '';

    $('reason').textContent = d.reason || '';
    $('profile').textContent = d.profile || '';

    var box = $('traits');
    box.innerHTML = '';
    (d.traits || []).forEach(function (t) {
      var pill = document.createElement('span');
      pill.className = 'pill';
      pill.textContent = String(t);
      box.appendChild(pill);
    });

    $('result').hidden = false;
    $('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function restart() {
    answers = [];
    idx = 0;
    $('result').hidden = true;
    $('loading').hidden = true;
    $('quiz').hidden = false;
    showStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.addEventListener('DOMContentLoaded', function () {
    $('answer').addEventListener('input', function () {
      $('next').disabled = !$('answer').value.trim();
    });
    $('next').addEventListener('click', onNext);
    $('back').addEventListener('click', onBack);
    $('restart').addEventListener('click', restart);
    showStep();
  });
})();
