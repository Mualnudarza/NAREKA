# AHP Decision Tool

Alat bantu keputusan **AHP (Analytic Hierarchy Process)** berbasis HTML/CSS/JS statis — tanpa backend, tanpa build step, bisa langsung dibuka dari file atau di-deploy ke GitHub Pages.

Dikembangkan dari referensi `pentagon_saaty.html` (metode input visual "Pentagon"), digeneralisasi jadi alat AHP lengkap dengan dua metode input dan dukungan hierarki (kriteria → sub-kriteria opsional → alternatif).

## Struktur folder

```
project-2/
├── index.html        # Langkah 1: input kriteria, sub-kriteria (opsional), alternatif, pilih metode
├── compare.html       # Langkah 2: perbandingan berpasangan (satu grup per layar)
├── result.html        # Langkah 3: ranking akhir, bobot tiap level, status konsistensi
├── css/
│   └── style.css       # semua styling
├── js/
│   ├── storage.js       # penyimpanan sesi (sessionStorage, per-tab, tidak ke server)
│   ├── ahp-core.js       # matematika AHP: bobot (eigenvector-aproksimasi), CI/CR, agregasi hierarki
│   ├── polygon-widget.js # widget "Pentagon" digeneralisasi jadi poligon-N sudut
│   ├── matrix-widget.js  # widget matriks klasik (slider Saaty per pasangan)
│   ├── setup.js           # logika index.html
│   ├── compare.js         # logika compare.html
│   └── result.js          # logika result.html
└── README.md
```

## Cara pakai

1. Buka `index.html` (double-click, atau lewat live server apa saja).
2. Isi **kriteria** (minimal 2). Aktifkan toggle **sub-kriteria** kalau salah satu atau semua kriteria perlu dipecah lebih detail.
3. Isi **alternatif** (minimal 2) — pilihan yang mau diranking.
4. Pilih **metode perbandingan**:
   - **Poligon (gaya Pentagon)** — satu titik digeser di dalam bentuk segi-N (N = jumlah item pada grup itu). Cocok untuk perbandingan cepat & visual. Butuh minimal 3 item; kalau suatu grup cuma 2 item, otomatis jatuh ke widget matriks (poligon 2 sudut tidak bermakna secara visual).
   - **Matriks Klasik** — slider Saaty 1–9 untuk tiap pasangan item, terpisah satu-satu. Presisi per-pasangan, jalan untuk jumlah item berapa pun.
5. Klik **Mulai Perbandingan** → isi setiap grup perbandingan (kriteria, lalu sub-kriteria per induk jika dipakai, lalu alternatif untuk tiap kriteria/sub-kriteria "daun").
6. Di halaman **Hasil**: ranking akhir alternatif, rasio konsistensi (CR) tiap grup, dan tabel lengkap (matriks, normalisasi, bobot) untuk semua level — bisa diunduh sebagai JSON atau dicetak/disimpan sebagai PDF.

Data **hanya tersimpan di sessionStorage tab browser tersebut** — sesuai kebutuhan "input dilakukan saat sesi dibuka": tutup tab / buka tab baru = mulai dari kosong lagi. Tidak ada data yang dikirim ke server manapun.

## Metodologi

- Bobot prioritas dihitung dengan metode **eigenvector-aproksimasi** standar: normalisasi tiap kolom matriks perbandingan, lalu rata-rata tiap baris. Metode ini dipakai identik untuk kedua jenis input (Poligon maupun Matriks), jadi hasilnya bisa dibandingkan apple-to-apple.
- **Rasio Konsistensi (CR)** dihitung dengan λmax, CI = (λmax − n)/(n − 1), dan tabel Random Index (RI) standar Saaty (RI untuk n > 15 memakai pendekatan 1.98×(n−2)/n). CR ≤ 0.1 dianggap konsisten.
- Grup dengan hanya 1 item dilewati otomatis (bobot 100%, tidak perlu dibandingkan). Grup dengan 2 item tidak menghasilkan CR (secara matematis n<3 selalu konsisten).
- Kalau sub-kriteria dipakai: **bobot global** tiap sub-kriteria = bobot kriteria induk × bobot lokal sub-kriteria (hierarki AHP penuh/standar). Skor akhir tiap alternatif = Σ (bobot global tiap kriteria/sub-kriteria "daun" × bobot lokal alternatif pada daun tersebut).

## Deploy ke GitHub Pages

1. Push folder ini (isi `project-2/`, bukan foldernya sendiri) ke root sebuah repo GitHub, atau ke subfolder `/docs`.
2. Di repo: **Settings → Pages → Source** → pilih branch (mis. `main`) dan folder (`/root` atau `/docs`).
3. Tunggu build selesai, akses lewat URL `https://<username>.github.io/<repo>/index.html`.

Tidak ada langkah build/compile — murni HTML/CSS/JS, jadi ini saja sudah cukup.

## Batasan yang disengaja (untuk konteks pengembangan lanjut)

- Tidak ada backend/database — semua di sessionStorage, jadi tidak bisa dipakai multi-user kolaboratif secara real-time. Kalau ke depannya butuh itu, bisa disambungkan ke backend atau `localStorage`/file export-import.
- Navigasi "Sebelumnya" di halaman compare hanya mengembalikan posisi widget yang sudah tersimpan di sesi ini, bukan riwayat penuh (undo/redo).
- Poligon digeneralisasi dari Pentagon asli (5 sudut) ke N sudut — mekanismenya sama persis (proyeksi titik ke tiap sumbu, snap ke skala Saaty 1–9), hanya jumlah sudutnya yang mengikuti jumlah item.
