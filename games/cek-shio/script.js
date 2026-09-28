// Cek Shio — logic game ini.

(function () {
  'use strict';

  var MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli',
                'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  // Elemen ditentukan oleh digit terakhir tahun shio (siklus 10 tahun):
  // 0-1 Logam, 2-3 Air, 4-5 Kayu, 6-7 Api, 8-9 Tanah.
  var ELEMENTS = [
    { icon: 'star',     label: 'Logam' },
    { icon: 'star',     label: 'Logam' },
    { icon: 'droplet',  label: 'Air' },
    { icon: 'droplet',  label: 'Air' },
    { icon: 'leaf',     label: 'Kayu' },
    { icon: 'leaf',     label: 'Kayu' },
    { icon: 'flame',    label: 'Api' },
    { icon: 'flame',    label: 'Api' },
    { icon: 'mountain', label: 'Tanah' },
    { icon: 'mountain', label: 'Tanah' }
  ];

  // Tanggal Tahun Baru Imlek per tahun: [bulan, tanggal].
  // Shio berganti saat Imlek, bukan 1 Januari.
  // Tahun di luar tabel ini memakai 1 Januari sebagai batas (kurang akurat),
  // jadi dropdown tahun dibatasi sampai tahun terakhir di tabel.
  var LUNAR_NEW_YEAR = {
    1940: [2, 8], 1941: [1, 27], 1942: [2, 15], 1943: [2, 5],
    1944: [1, 25], 1945: [2, 13], 1946: [2, 2], 1947: [1, 22],
    1948: [2, 10], 1949: [1, 29], 1950: [2, 17], 1951: [2, 6],
    1952: [1, 27], 1953: [2, 14], 1954: [2, 3], 1955: [1, 24],
    1956: [2, 12], 1957: [1, 31], 1958: [2, 18], 1959: [2, 8],
    1960: [1, 28], 1961: [2, 15], 1962: [2, 5], 1963: [1, 25],
    1964: [2, 13], 1965: [2, 2], 1966: [1, 21], 1967: [2, 9],
    1968: [1, 30], 1969: [2, 17], 1970: [2, 6], 1971: [1, 27],
    1972: [2, 15], 1973: [2, 3], 1974: [1, 23], 1975: [2, 11],
    1976: [1, 31], 1977: [2, 18], 1978: [2, 7], 1979: [1, 28],
    1980: [2, 16], 1981: [2, 5], 1982: [1, 25], 1983: [2, 13],
    1984: [2, 2], 1985: [2, 20], 1986: [2, 9], 1987: [1, 29],
    1988: [2, 17], 1989: [2, 6], 1990: [1, 27], 1991: [2, 15],
    1992: [2, 4], 1993: [1, 23], 1994: [2, 10], 1995: [1, 31],
    1996: [2, 19], 1997: [2, 7], 1998: [1, 28], 1999: [2, 16],
    2000: [2, 5], 2001: [1, 24], 2002: [2, 12], 2003: [2, 1],
    2004: [1, 22], 2005: [2, 9], 2006: [1, 29], 2007: [2, 18],
    2008: [2, 7], 2009: [1, 26], 2010: [2, 14], 2011: [2, 3],
    2012: [1, 23], 2013: [2, 10], 2014: [1, 31], 2015: [2, 19],
    2016: [2, 8], 2017: [1, 28], 2018: [2, 16], 2019: [2, 5],
    2020: [1, 25], 2021: [2, 12], 2022: [2, 1], 2023: [1, 22],
    2024: [2, 10], 2025: [1, 29], 2026: [2, 17], 2027: [2, 6]
  };
  var MAX_YEAR = 2027;

  // Urutan array = urutan siklus 12 tahun, dimulai dari Tikus (2020, 2008, 1996, ...)
  var DATA = [
    { n: 'Tikus', han: '鼠', aura: 'Merah', auraMeaning: 'Keberanian & kecerdikan',
      animal: 'Kucing', num: '1, 6', color: 'Merah',
      money: 'Ide kecil yang dikelola dengan konsisten bisa menjadi sumber pemasukan baru. Tetap catat pengeluaran supaya hasilnya terasa.',
      love: 'Obrolan yang hangat dan jujur mendekatkan kalian. Yang single berpeluang bertemu orang menarik lewat lingkungan sosial.',
      career: 'Kecerdikan membaca situasi membantumu menemukan cara kerja yang lebih efisien.',
      social: 'Kamu enak diajak bicara, jadi koneksi baru mudah berkembang secara natural.',
      energy: 'Semangatmu naik saat punya target yang jelas. Manfaatkan untuk menyelesaikan urusan yang tertunda.',
      opportunity: 'Peluang bisa datang dari percakapan biasa yang awalnya terlihat sepele.' },
    { n: 'Kerbau', han: '牛', aura: 'Hijau', auraMeaning: 'Stabilitas & ketekunan',
      animal: 'Sapi', num: '2, 8', color: 'Hijau',
      money: 'Kesabaran adalah kekuatanmu. Mengatur pengeluaran dengan rapi membuat kondisi terasa lebih stabil.',
      love: 'Perhatian kecil yang konsisten memperkuat hubungan. Sikap tenangmu membuat pasangan merasa aman.',
      career: 'Ketekunanmu menjadi modal penting. Hasil kerja yang konsisten berpeluang mendapat perhatian.',
      social: 'Kamu memberi kesan dapat dipercaya, sehingga hubungan yang sudah baik makin kuat.',
      energy: 'Ritme yang stabil menjaga fokus dan membuat aktivitas terasa lebih ringan.',
      opportunity: 'Kesempatan terbaik datang lewat langkah kecil yang kamu jalani terus-menerus.' },
    { n: 'Macan', han: '虎', aura: 'Emas', auraMeaning: 'Keberanian & daya tarik',
      animal: 'Elang', num: '3, 7', color: 'Emas',
      money: 'Keberanian mencoba hal baru bisa menambah pemasukan. Tetap hitung risikonya dengan matang.',
      love: 'Daya tarikmu sedang kuat. Berani menunjukkan perhatian bisa membuka kedekatan baru.',
      career: 'Inisiatifmu menjadi kesempatan untuk menunjukkan kemampuan di depan tim.',
      social: 'Energi yang percaya diri membuatmu mudah diperhatikan di keramaian.',
      energy: 'Aktivitas baru yang menantang bisa menaikkan motivasi dan semangatmu.',
      opportunity: 'Jangan ragu mengambil kesempatan yang sudah kamu pikirkan baik-baik.' },
    { n: 'Kelinci', han: '兔', aura: 'Pink', auraMeaning: 'Kelembutan & harmoni',
      animal: 'Kupu-kupu', num: '4, 9', color: 'Pink',
      money: 'Keuangan terasa lebih ringan saat kamu fokus pada kebutuhan utama dan tidak terburu-buru memutuskan.',
      love: 'Hubungan tumbuh lewat rasa saling memahami. Jangan takut mengungkapkan perasaanmu.',
      career: 'Ketelitian dan kemampuan bekerja sama menjadi nilai tambah yang dihargai.',
      social: 'Sikapmu yang ramah dan tenang membuat orang nyaman berada di dekatmu.',
      energy: 'Waktu tenang sejenak membantu menjaga keseimbangan dan mengembalikan fokus.',
      opportunity: 'Peluang baik bisa datang lewat kerja sama dan relasi yang sudah kamu bangun.' },
    { n: 'Naga', han: '龙', aura: 'Ungu', auraMeaning: 'Karismatik & penuh energi',
      animal: 'Naga', num: '5, 8', color: 'Ungu',
      money: 'Kreativitas dan keberanian membuka peluang baru. Gunakan momentum tanpa melupakan batas anggaran.',
      love: 'Pesonamu mudah terlihat. Hubungan yang sehat makin kuat saat kebebasan dan perhatian berjalan seimbang.',
      career: 'Karismamu berguna saat harus memimpin, mempresentasikan ide, atau mengambil keputusan.',
      social: 'Kehadiranmu membawa energi positif dan membuat suasana lebih hidup.',
      energy: 'Energimu terasa kuat saat disalurkan ke sesuatu yang kamu sukai.',
      opportunity: 'Ide berani yang kamu simpan bisa berkembang menjadi kesempatan yang lebih besar.' },
    { n: 'Ular', han: '蛇', aura: 'Biru', auraMeaning: 'Intuisi & ketenangan',
      animal: 'Burung hantu', num: '2, 7', color: 'Biru',
      money: 'Intuisimu membantu membaca peluang, apalagi jika dipadukan dengan hitungan yang realistis.',
      love: 'Kejujuran dan ketenangan membuat hubungan terasa lebih aman dan bermakna.',
      career: 'Ketelitian pada detail membantumu di pekerjaan yang butuh konsentrasi tinggi.',
      social: 'Kamu cenderung selektif, tetapi hubungan yang terbentuk biasanya lebih bermakna.',
      energy: 'Jeda yang cukup menjaga pikiran tetap jernih dan produktif.',
      opportunity: 'Perhatikan hal kecil. Sesuatu yang tampak sederhana bisa membuka jalan baru.' },
    { n: 'Kuda', han: '马', aura: 'Oranye', auraMeaning: 'Kebebasan & semangat',
      animal: 'Kuda', num: '3, 9', color: 'Oranye',
      money: 'Semangat bergerak membuka banyak jalan penghasilan. Sisihkan sebagian supaya tetap terjaga.',
      love: 'Kebebasan yang saling dihargai membuat hubungan terasa segar. Ajak pasangan mencoba hal baru.',
      career: 'Kecepatan dan antusiasmemu cocok untuk proyek yang butuh gerak cepat.',
      social: 'Humor dan keterbukaanmu membuat orang senang berada di sekitarmu.',
      energy: 'Bergerak aktif, entah olahraga ringan atau jalan-jalan, membuat suasana hati terasa lebih ringan.',
      opportunity: 'Kesempatan muncul saat kamu berani keluar dari rutinitas.' },
    { n: 'Kambing', han: '羊', aura: 'Putih', auraMeaning: 'Kreativitas & ketenangan',
      animal: 'Rusa', num: '6, 8', color: 'Putih',
      money: 'Hal-hal kecil yang kamu sukai bisa dikelola menjadi peluang. Susun anggaran sederhana supaya tetap tenang.',
      love: 'Kelembutanmu menyentuh hati. Luangkan waktu berdua tanpa gangguan.',
      career: 'Sisi kreatifmu menonjol. Ide yang kamu sampaikan dengan tenang berpeluang diterima.',
      social: 'Kamu pendengar yang baik, sehingga orang mudah bercerita padamu.',
      energy: 'Suasana damai dan aktivitas yang kamu nikmati mengisi ulang energimu.',
      opportunity: 'Peluang datang lewat karya atau ide yang kamu bagikan dengan tulus.' },
    { n: 'Monyet', han: '猴', aura: 'Emas', auraMeaning: 'Cerdas & adaptif',
      animal: 'Lumba-lumba', num: '1, 5', color: 'Emas',
      money: 'Kecerdikanmu melihat celah bisa mendatangkan tambahan pemasukan. Pastikan rencananya matang sebelum melangkah.',
      love: 'Sisi humorismu menjadi daya tarik. Candaan ringan bisa mencairkan suasana dan mendekatkan kalian.',
      career: 'Kemampuan beradaptasi membuatmu cepat menguasai tugas baru.',
      social: 'Kamu mudah bergaul, jadi lingkar pertemananmu berpeluang makin luas.',
      energy: 'Rasa penasaran menjaga semangatmu. Coba pelajari satu hal baru minggu ini.',
      opportunity: 'Peluang datang bagi yang cepat belajar dan luwes menyesuaikan diri.' },
    { n: 'Ayam', han: '鸡', aura: 'Merah', auraMeaning: 'Percaya diri & ketelitian',
      animal: 'Merak', num: '5, 7', color: 'Merah',
      money: 'Ketelitian mengatur keuangan membuat arus uang lebih rapi. Cek ulang tagihan dan rencana kecilmu.',
      love: 'Perhatian pada detail kecil membuat pasangan merasa dihargai.',
      career: 'Kerapian dan tanggung jawabmu membuat hasil kerja tampak profesional.',
      social: 'Kepercayaan dirimu menarik perhatian, terutama saat kamu bercerita.',
      energy: 'Rutinitas pagi yang teratur membuat hari terasa lebih terkendali.',
      opportunity: 'Kesempatan hadir bagi yang siap dan rapi mempersiapkan diri.' },
    { n: 'Anjing', han: '狗', aura: 'Biru', auraMeaning: 'Loyalitas & ketulusan',
      animal: 'Serigala', num: '3, 6', color: 'Biru',
      money: 'Kesetiaanmu pada rencana keuangan mulai terasa hasilnya. Lanjutkan kebiasaan baik yang sudah berjalan.',
      love: 'Ketulusanmu menjadi fondasi hubungan yang kokoh. Ungkapkan sayang lewat tindakan kecil.',
      career: 'Loyalitas dan integritasmu membuat rekan kerja mudah percaya.',
      social: 'Kamu teman yang bisa diandalkan, dan itu dibalas dengan dukungan dari sekitarmu.',
      energy: 'Melakukan hal yang kamu yakini benar membuat hati terasa tenang.',
      opportunity: 'Peluang mengalir lewat kepercayaan dan hubungan baik yang sudah lama terjalin.' },
    { n: 'Babi', han: '猪', aura: 'Hijau', auraMeaning: 'Kehangatan & kelimpahan',
      animal: 'Panda', num: '2, 9', color: 'Hijau',
      money: 'Rezeki terasa cukup saat kamu menikmati hasil kerja dengan bijak. Sisihkan sebagian untuk tabungan.',
      love: 'Kehangatan dan kemurahan hatimu membuat orang terdekat betah. Makan bersama bisa menjadi momen berharga.',
      career: 'Sikap suportifmu membuat kerja tim lebih lancar dan menyenangkan.',
      social: 'Kamu membawa suasana hangat, jadi orang senang berkumpul denganmu.',
      energy: 'Istirahat cukup dan makan enak dengan porsi wajar mengisi ulang tenagamu.',
      opportunity: 'Kelimpahan datang lewat kemurahan hati dan hubungan yang saling menguntungkan.' }
  ];

  function $(id) { return document.getElementById(id); }

  function isRealDate(d, m, y) {
    var t = new Date(y, m - 1, d);
    return t.getFullYear() === y && t.getMonth() === m - 1 && t.getDate() === d;
  }

  // Kembalikan tahun shio (bisa tahun sebelumnya kalau lahir sebelum Imlek).
  function getShioYear(d, m, y) {
    var ny = LUNAR_NEW_YEAR[y];
    if (ny && (m < ny[0] || (m === ny[0] && d < ny[1]))) {
      return { year: y - 1, beforeNewYear: true, ny: ny };
    }
    return { year: y, beforeNewYear: false, ny: ny };
  }

  function fillSelects() {
    var day = $('day'), month = $('month'), year = $('year');
    var now = new Date();
    var top = Math.min(now.getFullYear(), MAX_YEAR);

    for (var i = 1; i <= 31; i++) day.add(new Option(i, i));
    MONTHS.forEach(function (name, idx) { month.add(new Option(name, idx + 1)); });
    for (var y = top; y >= 1940; y--) year.add(new Option(y, y));

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

    var sy = getShioYear(d, m, y);
    var z = DATA[(((sy.year - 2020) % 12) + 12) % 12];
    var el = ELEMENTS[sy.year % 10];

    $('symbol').textContent = z.han;
    $('shio').textContent = z.n;
    $('period').textContent = 'Tahun shio ' + sy.year;
    $('element').innerHTML = FunIcon.svg(el.icon) + '<span>Elemen ' + el.label + '</span>';
    $('birth').textContent = d + ' ' + MONTHS[m - 1] + ' ' + y;

    var note = $('imlek-note');
    if (sy.beforeNewYear) {
      note.textContent = 'Kamu lahir sebelum Tahun Baru Imlek ' + y + ' (' + sy.ny[1] + ' ' +
        MONTHS[sy.ny[0] - 1] + '), jadi shiomu mengikuti tahun ' + sy.year + '.';
      note.hidden = false;
    } else {
      note.hidden = true;
    }

    $('aura').textContent = z.aura;
    $('auraMeaning').textContent = z.auraMeaning;

    ['money', 'love', 'career', 'social', 'energy', 'opportunity'].forEach(function (k) {
      $(k).textContent = z[k];
    });
    $('luckyAnimal').textContent = z.animal;
    $('luckyNumber').textContent = z.num;
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
