# Prototype ERP SPVR (Supervisor Regional) — GriyaNet

Prototype frontend statis (HTML/CSS/JS Vanilla) untuk validasi Business Requirement Document (BRD) modul SPVR. Tidak ada backend, database, maupun API — seluruh data adalah **dummy data**.

## Cara Membuka
Buka `index.html` langsung di browser, atau jalankan local server (disarankan agar semua `fetch`/asset relatif berjalan normal), contoh:

```
cd erp-spvr
python3 -m http.server 8080
```
lalu buka `http://localhost:8080`.

Prototype membutuhkan koneksi internet untuk memuat Bootstrap 5, Chart.js, dan font ikon dari CDN publik (jsdelivr, fonts.googleapis.com).

## Struktur Folder
```
erp-spvr/
  assets/
    css/style.css       -> styling (navbar, sidebar, card, table, bullet chart, dll)
    js/data.js           -> seluruh dummy data (branch, customer, WO, dsb)
    js/layout.js          -> render navbar & sidebar (dipakai di semua halaman)
    js/common.js          -> helper: tabel (search+pagination), badge status, bullet chart
  pages/
    area/open-area.html   -> Modul Area (Open Area & Overlay)
    area/detail.html       -> Detail Area per branch (filter Primary/Overlay, aksi lihat poligon)
    sales/retention.html   -> Modul Penjualan (Customer Retention)
    operational/psb.html   -> PSB / Instalasi
    operational/issue-tso.html -> Issue & TSO
    operational/infrastruktur.html -> Monitoring Infrastruktur Jaringan
    operational/dismantle.html -> Monitoring Dismantle
    manpower/ae.html        -> Account Executive
    manpower/tim-teknisi.html -> Tim Teknisi
  index.html               -> Dashboard utama
```

## Catatan Desain
- Layout (navbar gelap, sidebar, card, tabel, tombol) mengikuti gaya file HTML template ERP existing yang diberikan (Bootstrap 5, warna netral, tabel hover, badge status).
- Karena file CSS asli template (`dashboard.css`, `sidebar.css`, dst.) berada pada domain staging internal perusahaan yang tidak dapat diakses dari lingkungan pembuatan prototype ini, style tersebut direplikasi secara lokal pada `assets/css/style.css` agar prototype dapat berjalan mandiri (standalone) tanpa bergantung pada server internal. Jika file CSS asli tersedia, cukup tambahkan link `<link>`-nya di `<head>` setiap halaman untuk menggantikan/menambah style lokal ini.
- Setiap halaman bersifat **read-only** (monitoring & validasi). Tidak ada create/update/delete.
- Tombol "Detail"/"Action" ditampilkan sebagai modal (atau halaman detail khusus untuk Modul Area) yang merepresentasikan halaman existing pada ERP, sesuai catatan pada BRD.
- Seluruh Business Rule pada BRD (mis. hanya area `is_primary = 1` dihitung sebagai pembukaan area, filter branch, filter status, dsb.) sudah direfleksikan pada logika filter di masing-masing halaman.
