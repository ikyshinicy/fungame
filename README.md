# FunLab

Mini game seru untuk semua — kumpulan mini game & tools hiburan ringan (cek jodoh, zodiak, shio, ramalan, tes kepribadian, angka keberuntungan, sulap angka, dll).

Project ini static site murni: HTML, CSS, JS biasa. Tidak perlu install apa pun atau proses build — tinggal buka `index.html` di browser.

## Status Game

| Game | Folder | Status |
|---|---|---|
| Biro Jodoh | `games/biro-jodoh/` | Jadi |
| Cek Zodiak | `games/cek-zodiak/` | Jadi |
| Angka Keberuntungan (nama jadi angka) | `games/angka-keberuntungan/` | Jadi |
| Sulap Angka (kalkulator + 3 sulap) | `games/sulap-angka/` | Jadi |
| Cek Shio | `games/cek-shio/` | Jadi |
| Ramalan Hari Ini | `games/ramalan-hari-ini/` | Segera hadir |
| Siapa Kamu Jika Jadi Anime (folder: tes-kepribadian) | `games/tes-kepribadian/` | Jadi (analisis lokal, siap disambung ke backend AI) |

## Struktur Folder

```
funlab/
├── index.html                  → Halaman utama
├── assets/
│   ├── css/style.css           → Style global + komponen bersama (input, tombol, pill, dll)
│   ├── js/icons.js             → Semua icon SVG (pengganti emoji)
│   ├── js/main.js              → Toggle tema gelap/terang (dipakai semua halaman)
│   └── images/                 → Aset gambar (hero-banner.webp = banner beranda); placeholder/ untuk aset lain
├── games/
│   └── <nama-game>/            → index.html + style.css + script.js per game
└── README.md
```

Setiap game berdiri sendiri di foldernya — bisa dikerjakan satu per satu tanpa mengganggu game lain. Klik kartu game di beranda akan membuka halaman game di tab baru.

## Cara Menjalankan

Cukup buka `index.html` langsung di browser, atau pakai live server (mis. ekstensi "Live Server" di VS Code) supaya lebih nyaman saat development.

## Icon (tanpa emoji)

Semua icon adalah SVG inline yang didefinisikan di `assets/js/icons.js`. Warnanya mengikuti warna teks dan ukurannya mengikuti ukuran font, jadi otomatis ikut mode gelap/terang.

- Di HTML: `<i data-icon="heart"></i>`
- Di JS: `el.innerHTML = FunIcon.svg('heart');`
- Menambah icon baru: tambahkan satu baris di objek `P` pada `icons.js` (viewBox 24x24, stroke, tanpa fill). Nama icon zodiak diawali `z-` (mis. `z-aries`).

## Mengganti Placeholder Gambar

Semua ilustrasi masih berupa kotak kosong bergaris putus (`<div class="img-placeholder" data-asset="...">`). Nama aset yang diharapkan tertulis kecil di dalam kotaknya (mis. `icon-biro-jodoh`). Untuk mengganti dengan aset asli:

1. Taruh file gambar di `assets/images/placeholder/` (atau bikin subfolder sendiri).
2. Ganti `<div class="img-placeholder" data-asset="icon-biro-jodoh">...</div>` dengan `<img src="assets/images/nama-file.png" alt="...">`.
3. Hapus/sesuaikan style `.img-placeholder` di `style.css` kalau perlu.

Daftar `data-asset` yang dipakai: `icon-biro-jodoh`, `icon-cek-zodiak`, `icon-cek-shio`, `icon-ramalan`, `icon-kepribadian`, `icon-angka`, `icon-sulap-angka`.

## Menambah Game Baru

1. Duplikasi salah satu folder di `games/` (misalnya `games/cek-shio/`) → ganti nama foldernya sesuai game baru.
2. Sesuaikan isi `index.html` (judul, deskripsi, icon), lalu bangun logic-nya di `script.js` dan style tambahan di `style.css`.
3. Tambahkan satu kartu baru di `games.html` (halaman semua game), arahkan `href` ke folder game barunya. Kalau ingin tampil juga di **Game Populer** pada `index.html`, salin kartunya ke sana (maksimal 4).

Komponen siap pakai di `style.css` global: `.input`, `.select`, `.btn` (+ `.btn-primary`, `.btn-secondary`, `.btn-block`), `.pill`, `.form-error`, `.note`.

## Backend AI untuk "Siapa Kamu Jika Jadi Anime?" (opsional, nanti)

Saat ini jawaban dianalisis lokal di `games/tes-kepribadian/script.js` (pencocokan kata kunci berbobot). Untuk memakai AI sungguhan, isi `API_URL` di bagian atas file itu. Kalau request gagal atau formatnya tidak sesuai, game otomatis kembali ke analisis lokal.

- Request: `POST` JSON `{ "answers": ["...", "... (7 jawaban)"] }`
- Response: `{ "character": "...", "anime": "...", "match": "87%", "traits": ["...", "..."], "reason": "...", "profile": "..." }`

## Deploy ke GitHub Pages (opsional)

1. Push folder ini sebagai repo baru lewat GitHub Desktop.
2. Buka **Settings → Pages** di repo GitHub, pilih branch `main` dan folder `/ (root)`.
3. Situs akan online di `https://<username>.github.io/<nama-repo>/`.
