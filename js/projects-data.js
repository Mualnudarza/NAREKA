/**
 * =====================================================================
 *  PROJECTS CONFIG
 *  Setiap objek di array ini otomatis menjadi satu "kartu tiket" di
 *  portal, lengkap dengan link menuju folder prototype-nya.
 *
 *  CARA MENAMBAH PROJECT BARU:
 *   1. Buat folder baru di dalam /projects, misal /projects/project-4
 *   2. Taruh file index.html, style.css, script.js di folder itu
 *      (boleh copy dari /projects/project-1 sebagai contoh)
 *   3. Tambahkan satu objek baru di array PROJECTS di bawah ini
 *
 *  CARA MENGHAPUS PROJECT:
 *   1. Hapus objek yang sesuai dari array PROJECTS
 *   2. (opsional) hapus juga folder project-nya di /projects
 * =====================================================================
 */
const PROJECTS = [
  {
    code: "PRJ-01",              // kode unik, tampil seperti nomor penerbangan
    title: "Prototype BRD-SPVR",  // judul proyek, tampil di atas tiket
    from: "Konsep",              // titik kiri di garis rute tiket
    to: "Demo",                  // titik kanan di garis rute tiket
    badge: "HTML · CSS · JS",    // badge kuning di tengah (pengganti durasi)
    category: "Web App",
    date: "12/05/2024",
    tools: "HTML, CSS, JS",
    status: "Selesai",
    link: "projects/BRD-SPVR/index.html"
  },
  {
    code: "PRJ-02",
    title: "Dashboard Analitik Sederhana",
    from: "Data",
    to: "Chart",
    badge: "JS · Chart.js",
    category: "Dashboard",
    date: "03/08/2024",
    tools: "HTML, CSS, JavaScript",
    status: "Selesai",
    link: "projects/project-2/index.html"
  },
  {
    code: "PRJ-03",
    title: "Kalkulator Interaktif",
    from: "Input",
    to: "Hasil",
    badge: "Vanilla JS",
    category: "Tool",
    date: "20/01/2025",
    tools: "HTML, CSS, JS",
    status: "Dalam pengembangan",
    link: "projects/project-3/index.html"
  }
];
