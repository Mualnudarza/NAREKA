/**
 * =====================================================================
 *  PROFILE CONFIG
 *  Ganti isi objek di bawah ini untuk memperbarui kartu perkenalan,
 *  kartu deskripsi halaman, dan tautan kontak di navbar.
 * =====================================================================
 */
const PROFILE = {
  // Nama yang tampil di navbar
  brandName: "yourname",

  // Kartu perkenalan (pojok kiri atas)
  name: "Nama Kamu",
  role: "Frontend Developer & Prototype Enthusiast",
  status: "Available for freelance",
  // Ganti dengan path foto kamu sendiri, contoh: "assets/images/foto-saya.jpg"
  avatar: "assets/images/profile-placeholder.svg",
  resumeLink: "#", // link CV / resume, boleh dikosongkan dengan "#"

  // Kartu deskripsi halaman ("Hello, Gerald" versi kamu)
  greetingName: "Nama Kamu",
  pageDescription:
    "Portal ini adalah etalase pribadi tempat aku mengumpulkan prototype, eksperimen, dan proyek kecil yang aku bangun. Setiap kartu tiket di bawah adalah pintu menuju satu proyek — klik untuk mencoba demonya langsung.",
  highlights: [
    { label: "Fokus", value: "Web Prototyping" },
    { label: "Tools", value: "HTML · CSS · JS" }
  ],

  // Kartu ajakan kolaborasi (pojok kanan bawah)
  ctaTitle: "MARI TERHUBUNG",
  ctaText: "Tertarik kolaborasi, kerja freelance, atau sekadar ngobrol soal proyek? Hubungi aku lewat salah satu tautan berikut.",
  ctaButtonLabel: "Hubungi Saya",
  ctaButtonLink: "mailto:namamu@email.com",

  socials: [
    { label: "GitHub", link: "https://github.com/username" },
    { label: "LinkedIn", link: "https://linkedin.com/in/username" },
    { label: "Email", link: "mailto:namamu@email.com" }
  ],

  // Kartu skill / tech stack (menggantikan peta)
  skillsTitle: "Tech Stack",
  skills: [
    "HTML5", "CSS3", "JavaScript", "React", "Tailwind", "Figma", "Git", "Node.js"
  ]
};
