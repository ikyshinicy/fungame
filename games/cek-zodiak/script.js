// Cek Zodiak — logic game ini.

(function () {
  'use strict';

  var MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli',
                'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  // Elemen -> icon + label
  var ELEMENTS = {
    api:   { icon: 'flame',    label: 'Api' },
    tanah: { icon: 'leaf',     label: 'Tanah' },
    udara: { icon: 'wind',     label: 'Udara' },
    air:   { icon: 'droplet',  label: 'Air' }
  };

  // Urutan array = urutan index yang dikembalikan getZodiac()
  var DATA = [
    { n: 'Aries', icon: 'z-aries', p: '21 Maret – 19 April', e: 'api', num: 9, color: 'Merah',
      money: 'Semangat mengambil inisiatif bisa membuka peluang finansial baru. Tetap prioritaskan pengeluaran yang benar-benar penting.',
      love: 'Sikap terbuka membuat hubungan terasa lebih hidup. Untuk yang single, keberanian memulai percakapan bisa membawa kejutan menyenangkan.',
      career: 'Ide cepat dan keberanian bertindak menjadi modal kuat. Ada peluang menunjukkan kemampuanmu dalam situasi baru.',
      social: 'Kamu lebih mudah menarik perhatian positif. Orang lain bisa menghargai energi dan kejujuranmu.',
      energy: 'Energi terasa lebih kuat ketika kamu punya target yang jelas. Gunakan momentum untuk menyelesaikan hal yang tertunda.',
      opportunity: 'Peluang datang ketika kamu berani mencoba sesuatu yang sedikit berbeda.' },
    { n: 'Taurus', icon: 'z-taurus', p: '20 April – 20 Mei', e: 'tanah', num: 6, color: 'Hijau',
      money: 'Konsistensi menjadi kunci. Kebiasaan mengatur uang dengan tenang bisa memberi rasa aman yang lebih besar.',
      love: 'Hubungan berkembang lewat perhatian kecil yang konsisten. Yang single berpeluang menemukan koneksi dari lingkungan yang sudah dikenal.',
      career: 'Kesabaran dan ketelitianmu menjadi nilai tambah. Hasil kerja yang rapi bisa mendapat perhatian.',
      social: 'Orang cenderung merasa nyaman berbicara denganmu. Hubungan yang stabil semakin kuat.',
      energy: 'Jaga ritme agar tetap seimbang. Waktu istirahat yang cukup membantu fokus tetap tajam.',
      opportunity: 'Peluang terbaik muncul dari langkah kecil yang dilakukan secara konsisten.' },
    { n: 'Gemini', icon: 'z-gemini', p: '21 Mei – 20 Juni', e: 'udara', num: 5, color: 'Kuning',
      money: 'Ide dan komunikasi bisa membuka peluang tambahan. Manfaatkan kemampuanmu melihat beberapa pilihan sebelum memutuskan.',
      love: 'Percakapan ringan bisa berkembang menjadi kedekatan. Kejujuran membuat hubungan terasa lebih natural.',
      career: 'Kemampuan beradaptasi menjadi keunggulan. Kesempatan baru bisa datang melalui komunikasi atau jaringan.',
      social: 'Lingkaran sosial terasa lebih aktif. Ada kemungkinan bertemu orang dengan sudut pandang menarik.',
      energy: 'Variasikan aktivitas agar tidak cepat bosan. Hal baru bisa mengembalikan semangat.',
      opportunity: 'Satu percakapan sederhana bisa membuka pintu ke kesempatan yang tidak kamu duga.' },
    { n: 'Cancer', icon: 'z-cancer', p: '21 Juni – 22 Juli', e: 'air', num: 2, color: 'Putih',
      money: 'Naluri berhati-hati membantu menjaga kondisi finansial. Ada peluang memperbaiki rencana keuangan secara bertahap.',
      love: 'Kehangatan dan perhatian menjadi kekuatanmu. Hubungan yang sudah ada bisa terasa semakin dekat.',
      career: 'Empati dan kemampuan membaca situasi membantu kerja sama. Usaha yang konsisten mulai menunjukkan hasil.',
      social: 'Kamu menjadi tempat nyaman bagi orang lain. Hubungan tulus berpotensi semakin erat.',
      energy: 'Suasana yang tenang membantu mengisi kembali energi. Beri ruang untuk dirimu sendiri.',
      opportunity: 'Peluang positif muncul dari hubungan yang dibangun dengan kepercayaan.' },
    { n: 'Leo', icon: 'z-leo', p: '23 Juli – 22 Agustus', e: 'api', num: 1, color: 'Emas',
      money: 'Kepercayaan diri bisa membantumu melihat peluang baru. Gunakan keberanian dengan tetap mempertimbangkan risikonya.',
      love: 'Pesonamu lebih mudah terlihat. Hubungan bisa terasa lebih hangat ketika kamu berani menunjukkan perhatian.',
      career: 'Waktu yang baik untuk menunjukkan kemampuan dan mengambil peran lebih aktif.',
      social: 'Kehadiranmu membawa energi positif. Orang lain bisa tertarik pada semangatmu.',
      energy: 'Motivasi meningkat ketika kamu merasa dihargai. Salurkan energi itu ke target yang jelas.',
      opportunity: 'Kesempatan untuk tampil dan menunjukkan kemampuan bisa datang secara tak terduga.' },
    { n: 'Virgo', icon: 'z-virgo', p: '23 Agustus – 22 September', e: 'tanah', num: 4, color: 'Biru',
      money: 'Ketelitian membantu menemukan pengeluaran yang bisa dirapikan. Sedikit perbaikan dapat memberi dampak besar.',
      love: 'Perhatian terhadap detail membuat orang merasa dihargai. Komunikasi yang sederhana justru membawa kedekatan.',
      career: 'Kerja rapi dan kemampuan memecahkan masalah menjadi kekuatan utama.',
      social: 'Kamu bisa menjadi orang yang dipercaya ketika orang lain membutuhkan solusi.',
      energy: 'Rutinitas yang teratur membantu menjaga fokus dan ketenangan.',
      opportunity: 'Peluang muncul dari kemampuanmu melihat hal kecil yang sering dilewatkan orang lain.' },
    { n: 'Libra', icon: 'z-libra', p: '23 September – 22 Oktober', e: 'udara', num: 7, color: 'Pink',
      money: 'Keseimbangan antara kebutuhan dan keinginan membantu menjaga finansial. Ada ruang untuk membuat rencana baru.',
      love: 'Energi hubungan terasa lebih harmonis. Komunikasi yang lembut dapat memperkuat koneksi.',
      career: 'Kemampuan bekerja sama menjadi nilai plus. Ide dari orang lain bisa membuka perspektif baru.',
      social: 'Kamu lebih mudah menjadi penengah dan menciptakan suasana nyaman.',
      energy: 'Aktivitas kreatif bisa membantu menjaga mood tetap positif.',
      opportunity: 'Kesempatan baik bisa datang melalui kerja sama atau pertemanan.' },
    { n: 'Scorpio', icon: 'z-scorpio', p: '23 Oktober – 21 November', e: 'air', num: 8, color: 'Marun',
      money: 'Fokus dan ketekunan membantu menjaga arah finansial. Hindari keputusan impulsif dan tetap percaya pada rencana.',
      love: 'Kedalaman perasaan menjadi kekuatan. Hubungan yang jujur bisa berkembang semakin kuat.',
      career: 'Kemampuan fokus pada satu tujuan membantu menyelesaikan pekerjaan sulit.',
      social: 'Kamu mungkin lebih selektif, tetapi hubungan yang terbentuk cenderung bermakna.',
      energy: 'Saat fokusmu terarah, produktivitas meningkat. Jangan lupa memberi jeda.',
      opportunity: 'Sesuatu yang sebelumnya terasa lambat bisa mulai menunjukkan perkembangan.' },
    { n: 'Sagittarius', icon: 'z-sagittarius', p: '22 November – 21 Desember', e: 'api', num: 3, color: 'Ungu',
      money: 'Semangat mencoba hal baru bisa membuka sumber peluang. Tetap buat batas agar pengeluaran tidak ikut melebar.',
      love: 'Suasana ringan dan spontan membawa energi positif. Yang single berpeluang bertemu seseorang lewat aktivitas baru.',
      career: 'Rasa ingin tahu mendorongmu melihat kesempatan yang berbeda dari biasanya.',
      social: 'Lingkungan baru bisa membawa kenalan dan pengalaman menarik.',
      energy: 'Aktivitas di luar rutinitas bisa meningkatkan semangat.',
      opportunity: 'Peluang sering muncul ketika kamu berani keluar sedikit dari zona nyaman.' },
    { n: 'Capricorn', icon: 'z-capricorn', p: '22 Desember – 19 Januari', e: 'tanah', num: 4, color: 'Cokelat',
      money: 'Disiplin dan perencanaan menjadi kekuatan. Langkah kecil yang konsisten membantu membangun kondisi lebih stabil.',
      love: 'Keseriusanmu bisa membuat hubungan terasa aman. Beri ruang juga untuk momen spontan.',
      career: 'Kerja keras dan tanggung jawabmu berpotensi mendapat pengakuan.',
      social: 'Orang melihatmu sebagai sosok yang dapat diandalkan.',
      energy: 'Fokus pada prioritas membuat energi tidak mudah terpecah.',
      opportunity: 'Hasil dari usaha lama bisa mulai terasa lebih jelas.' },
    { n: 'Aquarius', icon: 'z-aquarius', p: '20 Januari – 18 Februari', e: 'udara', num: 11, color: 'Biru elektrik',
      money: 'Ide yang tidak biasa bisa menjadi sumber peluang. Catat gagasan yang muncul dan pilih yang paling realistis.',
      love: 'Kejujuran dan kebebasan menjadi dasar hubungan yang nyaman. Percakapan unik bisa mempererat koneksi.',
      career: 'Cara berpikirmu yang berbeda bisa menjadi keunggulan dalam memecahkan masalah.',
      social: 'Kamu berpeluang bertemu orang dengan minat yang sama.',
      energy: 'Hal baru bisa memberi dorongan energi dan inspirasi.',
      opportunity: 'Ide yang awalnya terlihat sederhana bisa berkembang menjadi sesuatu yang menarik.' },
    { n: 'Pisces', icon: 'z-pisces', p: '19 Februari – 20 Maret', e: 'air', num: 7, color: 'Turquoise',
      money: 'Intuisi dan empati membantu membaca situasi, tetapi tetap padukan dengan perencanaan agar keputusan lebih mantap.',
      love: 'Sisi lembutmu menjadi daya tarik. Hubungan bisa semakin hangat melalui perhatian sederhana.',
      career: 'Kreativitas dan imajinasi bisa menghasilkan pendekatan baru yang bernilai.',
      social: 'Kamu mudah membangun koneksi emosional yang tulus.',
      energy: 'Aktivitas kreatif dan waktu tenang dapat membantu menjaga keseimbangan.',
      opportunity: 'Inspirasi baru bisa datang dari hal yang awalnya terlihat biasa.' }
  ];

  function $(id) { return document.getElementById(id); }

  function getZodiac(d, m) {
    if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return 0;   // Aries
    if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return 1;   // Taurus
    if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return 2;   // Gemini
    if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return 3;   // Cancer
    if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return 4;   // Leo
    if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return 5;   // Virgo
    if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return 6;  // Libra
    if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return 7; // Scorpio
    if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return 8; // Sagittarius
    if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return 9;  // Capricorn
    if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return 10;  // Aquarius
    return 11;                                                     // Pisces (19 Feb – 20 Mar)
  }

  function isRealDate(d, m, y) {
    var t = new Date(y, m - 1, d);
    return t.getFullYear() === y && t.getMonth() === m - 1 && t.getDate() === d;
  }

  function fillSelects() {
    var day = $('day'), month = $('month'), year = $('year');
    var now = new Date();

    for (var i = 1; i <= 31; i++) day.add(new Option(i, i));
    MONTHS.forEach(function (name, idx) { month.add(new Option(name, idx + 1)); });
    for (var y = now.getFullYear(); y >= 1940; y--) year.add(new Option(y, y));

    day.value = now.getDate();
    month.value = now.getMonth() + 1;
    year.value = 1998;
  }

  function onSubmit(e) {
    e.preventDefault();
    var d = Number($('day').value);
    var m = Number($('month').value);
    var y = Number($('year').value);

    if (!isRealDate(d, m, y)) {
      var err = $('error');
      err.textContent = 'Tanggal itu tidak ada di kalender. Cek lagi tanggal dan bulannya ya.';
      err.hidden = false;
      $('result').hidden = true;
      return;
    }
    $('error').hidden = true;

    var z = DATA[getZodiac(d, m)];
    var el = ELEMENTS[z.e];

    $('symbol').innerHTML = FunIcon.svg(z.icon);
    $('zodiac').textContent = z.n;
    $('period').textContent = z.p;
    $('element').innerHTML = FunIcon.svg(el.icon) + '<span>' + el.label + '</span>';
    $('birth').textContent = d + ' ' + MONTHS[m - 1] + ' ' + y;

    ['money', 'love', 'career', 'social', 'energy', 'opportunity'].forEach(function (k) {
      $(k).textContent = z[k];
    });
    $('number').textContent = z.num;
    $('color').textContent = z.color;

    $('result').hidden = false;
    $('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.addEventListener('DOMContentLoaded', function () {
    fillSelects();
    $('form').addEventListener('submit', onSubmit);
    $('reset').addEventListener('click', function () {
      $('result').hidden = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
})();
