# FunLab

Mini game seru untuk semua — kumpulan mini game & tools hiburan ringan (cek jodoh, zodiak, shio, ramalan, tes kepribadian, angka keberuntungan, dll).

Project ini static site murni: HTML, CSS, JS biasa. Tidak perlu install apa pun atau proses build — tinggal buka `index.html` di browser.

## Struktur Folder

```
funlab/
├── index.html                  → Halaman utama
├── assets/
│   ├── css/style.css           → Style global (dipakai semua halaman)
│   ├── js/main.js              → Script halaman utama (toggle tema, dll)
│   └── images/placeholder/     → Taruh aset gambar asli di sini
├── games/
│   ├── biro-jodoh/
│   ├── cek-zodiak/
│   ├── cek-shio/
│   ├── ramalan-hari-ini/
│   ├── tes-kepribadian/
│   └── angka-keberuntungan/
│       (masing-masing punya index.html + style.css + script.js sendiri)
└── README.md
```

Setiap game berdiri sendiri di foldernya — bisa dikerjakan satu per satu tanpa mengganggu game lain. Klik kartu game di beranda akan membuka halaman game di tab baru.

## Cara Menjalankan

Cukup buka `index.html` langsung di browser, atau pakai live server (mis. ekstensi "Live Server" di VS Code) supaya lebih nyaman saat development.

## Mengganti Placeholder Gambar

Semua ilustrasi/icon saat ini masih berupa kotak placeholder (`<div class="img-placeholder">`) dengan emoji. Untuk mengganti dengan aset asli:

1. Taruh file gambar di `assets/images/placeholder/` (atau bikin subfolder sendiri).
2. Ganti `<div class="img-placeholder" data-asset="...">🎮</div>` dengan `<img src="assets/images/nama-file.png" alt="...">`.
3. Hapus/sesuaikan style `.img-placeholder` di `style.css` kalau perlu.

## Menambah Game Baru

1. Duplikasi salah satu folder di `games/` (misalnya `games/cek-shio/`) → ganti nama foldernya sesuai game baru.
2. Sesuaikan isi `index.html` (judul, deskripsi, icon), lalu bangun logic-nya di `script.js` dan style tambahan di `style.css`.
3. Tambahkan satu kartu baru di section **Game Populer** pada `index.html` (halaman utama), arahkan `href` ke folder game barunya.

## Kategori

Kartu di section **Kategori Game** saat ini mengarah kembali ke section Game Populer (karena baru 6 game yang sudah dibangun). Kalau game per kategori sudah lengkap, kartu kategori bisa diarahkan ke halaman listing khusus per kategori.

## Deploy ke GitHub Pages (opsional)

1. Push folder ini sebagai repo baru lewat GitHub Desktop.
2. Buka **Settings → Pages** di repo GitHub, pilih branch `main` dan folder `/ (root)`.
3. Situs akan online di `https://<username>.github.io/<nama-repo>/`.
