# 🦕 NAREKA — Pixel Art Portfolio

> A modern portfolio website with retro pixel-art aesthetics, inspired by the Google Chrome Dinosaur Game.

---

## 🚀 Cara Menjalankan

### Cara Tercepat (Tanpa Server)
Cukup buka file `index.html` langsung di browser:
```
Klik dua kali pada → nareka/index.html
```

### Dengan Live Server (Direkomendasikan)
Jika menggunakan VS Code:
1. Install extension **Live Server** dari Ritwick Dey
2. Klik kanan `index.html` → **Open with Live Server**
3. Buka `http://127.0.0.1:5500`

### Dengan Python (alternatif)
```bash
cd nareka
python -m http.server 8080
# Buka: http://localhost:8080
```

### Dengan Node.js (alternatif)
```bash
cd nareka
npx serve .
```

---

## 📁 Struktur Folder

```
nareka/
│
├── index.html              # Entry point — single page application
│
├── assets/
│   ├── css/
│   │   └── style.css       # Semua styling — Design System utama
│   │
│   ├── js/
│   │   └── main.js         # Semua logic — Animasi, Game, Interaksi
│   │
│   ├── img/                # Gambar statis (screenshot, foto, dll)
│   ├── icon/               # Icon & favicon custom
│   └── pixel/              # Aset pixel art tambahan
│
└── README.md               # Dokumentasi ini
```

---

## 🎨 Design System

### Palet Warna
| Token | Hex | Kegunaan |
|-------|-----|----------|
| `--white` | `#FFFFFF` | Background utama |
| `--orange` | `#F97316` | Accent color, CTA, highlight |
| `--orange-dark` | `#EA580C` | Hover state, shadow accent |
| `--orange-pale` | `#FFF7ED` | Card background, tag background |
| `--black` | `#1A1A1A` | Text utama, border pixel |
| `--gray-mid` | `#6B6B6B` | Text sekunder |
| `--gray-light` | `#F5F5F5` | Section background alternatif |

### Tipografi
| Font | Kegunaan |
|------|----------|
| **Press Start 2P** | Heading pixel, label, tag — identitas retro |
| **Space Mono** | Sub-heading, nama project, data — nuansa kode |
| **Inter** | Body text, deskripsi — keterbacaan modern |

### Pixel Aesthetic Rules
- **Border**: `3px solid` dengan `box-shadow: 4px 4px 0px` (pixel shadow)
- **Hover**: `transform: translate(-3px, -3px)` + shadow offset bertambah
- **Radius**: `0px` — pixel art tidak pakai border-radius
- **Spacing**: Kelipatan 4px (`--sp-xs` hingga `--sp-3xl`)

---

## ✨ Fitur

### Core Features
- ✅ **Loading Screen** — pixel progress bar dengan pesan dinamis
- ✅ **Navbar responsif** — sticky + hamburger menu mobile
- ✅ **Typing effect** — rotasi profesi di hero section
- ✅ **Mini Dino Game** — playable di hero (Space/Tap untuk jump)
- ✅ **Scroll animations** — fade-up, fade-left, fade-right
- ✅ **Skill bars** — animasi progress saat masuk viewport
- ✅ **Project filter** — filter by kategori
- ✅ **Project thumbnails** — generated via Canvas API
- ✅ **Contact form** — validasi + simulasi kirim
- ✅ **Dark Mode** — toggle + simpan preferensi (localStorage)
- ✅ **Pixel avatar** — digambar via Canvas API

### Bonus Features
- ✅ **Scroll progress indicator** — bar oranye di atas halaman
- ✅ **Retro music toggle** — Web Audio API (square wave)
- ✅ **Back to top button** — muncul setelah scroll 400px
- ✅ **Toast notifications** — feedback interaksi
- ✅ **Easter egg** — hidden modal + Konami Code
- ✅ **Custom scrollbar** — styled pixel orange
- ✅ **Pixel hover sounds** — beep halus (Web Audio)
- ✅ **Parallax ringan** — elemen cloud bergerak
- ✅ **Section indicator** — active state nav link
- ✅ **Keyboard accessible** — focus states, aria labels

---

## 🎮 Easter Eggs

1. **Klik footer** `[ 🦕 FIND THE DINO? ]` untuk membuka modal rahasia
2. **Konami Code**: `↑ ↑ ↓ ↓ ← → ← → B A` di keyboard
3. **Mini game dino**: tekan Space atau tap canvas untuk main

---

## 📱 Responsivitas

| Breakpoint | Target |
|-----------|--------|
| `> 1024px` | Desktop full |
| `768px – 1024px` | Tablet |
| `480px – 768px` | Mobile landscape |
| `< 480px` | Mobile portrait |

---

## 🛠️ Teknologi

- **HTML5** — Semantic markup, Canvas API, Web Audio API
- **CSS3** — Custom Properties, Grid, Flexbox, Animations
- **Vanilla JavaScript** — ES6+, IntersectionObserver, requestAnimationFrame
- **Google Fonts** — Press Start 2P, Space Mono, Inter

> ⚡ Zero dependencies. Zero frameworks. Pure web standards.

---

## 🔧 Kustomisasi

### Ganti Nama
Cari & replace `NAREKA` / `Nareka` / `nareka` di `index.html` dan `style.css`

### Ganti Warna Accent
Edit di `style.css`:
```css
:root {
  --orange: #F97316;       /* Ganti ke warna pilihanmu */
  --orange-dark: #EA580C;
  --orange-light: #FED7AA;
  --orange-pale: #FFF7ED;
}
```

### Tambah Project
Duplikat salah satu blok `<article class="project-card">` di `index.html` dan sesuaikan isinya.

### Ubah Profesi (Typing Effect)
Edit array `phrases` di `main.js`:
```javascript
const phrases = [
  'Full Stack Developer',
  'UI/UX Designer',
  // tambahkan di sini...
];
```

---

## 📝 Lisensi

MIT License — bebas digunakan dan dimodifikasi untuk keperluan pribadi maupun komersial.

---

<div align="center">

Built with ❤️ and a pixel dinosaur  
**NAREKA** — *Keep coding, keep jumping* 🦕

</div>
