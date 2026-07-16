# Portal Proyek Pribadi

Portal statis (HTML/CSS/JS murni, tanpa framework/build-step) untuk GitHub Pages.
Tampilannya mengikuti referensi dashboard travel app, tapi isinya sudah diubah
menjadi portal untuk memamerkan proyek/prototype kamu.

## Struktur folder

```
portfolio-portal/
├── index.html              ← halaman portal utama
├── css/style.css           ← semua styling
├── js/
│   ├── profile-data.js     ← EDIT DI SINI: nama, foto, deskripsi, kontak
│   ├── projects-data.js    ← EDIT DI SINI: daftar kartu tiket proyek
│   └── main.js             ← logic render, tidak perlu diubah
├── assets/images/          ← taruh foto profil kamu di sini
└── projects/
    ├── project-1/          ← contoh prototype (landing page)
    ├── project-2/          ← contoh prototype (dashboard)
    └── project-3/          ← contoh prototype (kalkulator)
```

## 1. Mengganti identitas (nama, foto, deskripsi halaman, kontak)

Buka `js/profile-data.js` dan ubah nilai di objek `PROFILE`:

- `name`, `role`, `status` → kartu perkenalan (pojok kiri atas)
- `avatar` → path ke foto kamu. Taruh file foto di `assets/images/`,
  lalu ganti nilainya, contoh: `"assets/images/foto-saya.jpg"`
- `pageDescription`, `highlights` → kartu deskripsi tujuan halaman
- `ctaTitle`, `ctaText`, `ctaButtonLink`, `socials` → kartu ajakan kontak
- `skills` → daftar tech stack di kartu kanan atas

## 2. Menambah kartu proyek (tiket) baru

1. Buat folder baru di `projects/`, misalnya `projects/project-4/`
2. Copy `index.html`, `style.css`, `script.js` dari `projects/project-1/`
   sebagai titik awal, lalu edit isinya sesuai prototype kamu
3. Buka `js/projects-data.js`, tambahkan satu objek baru ke array `PROJECTS`:

```js
{
  code: "PRJ-04",
  title: "Nama Proyek Kamu",
  from: "Konsep",
  to: "Demo",
  badge: "React · Tailwind",
  category: "Web App",
  date: "15/07/2026",
  tools: "React, Tailwind",
  status: "Selesai",
  link: "projects/project-4/index.html"
}
```

Kartu tiket baru otomatis muncul di portal, lengkap masuk ke filter kategori dan pencarian.

## 3. Menghapus kartu proyek

Hapus objek yang sesuai dari array `PROJECTS` di `js/projects-data.js`.
Folder `projects/project-x/`-nya boleh dihapus juga kalau sudah tidak dipakai.

## 4. Menjalankan secara lokal

Cukup buka `index.html` langsung di browser, atau jalankan server statis
sederhana supaya path relatif lebih konsisten:

```bash
cd portfolio-portal
python3 -m http.server 8000
# buka http://localhost:8000
```

## 5. Deploy ke GitHub Pages

1. Buat repository baru di GitHub, misal `username.github.io`
   (atau nama bebas kalau mau di-hosting di sub-path)
2. Upload seluruh isi folder `portfolio-portal/` ke root repository
3. Di repo GitHub: **Settings → Pages → Source**, pilih branch `main`
   dan folder `/ (root)`, lalu simpan
4. Tunggu beberapa menit, portal akan aktif di:
   - `https://username.github.io` (jika nama repo `username.github.io`), atau
   - `https://username.github.io/nama-repo/` (jika nama repo lain)

Selesai — setiap kali kamu menambah proyek baru, cukup ulangi langkah 2 di atas
(tambah folder + edit `projects-data.js`) lalu push perubahan ke GitHub.
