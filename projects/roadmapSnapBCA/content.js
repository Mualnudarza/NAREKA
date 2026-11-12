/* =========================================================
   Konten Detail Topik Roadmap Kepatuhan Keamanan API SNAP BCA
   Kunci = nilai data-id di index.html
   ========================================================= */
window.ROADMAP_CONTENT = {
  /* ============ ROOT & HUB ============ */
  'title': {
    hakikat: 'Peta jalan eksekutif kepatuhan 22 syarat keamanan sistem Bank Central Asia (BCA) dan Bank Indonesia (BI) berdasarkan standar SNAP BI (Standar Nasional Open API Pembayaran) dan regulasi POJK No. 11/POJK.03/2022.',
    turunan: [
      'Pilar 1: Aturan Orang, Hak Akses & Operasional (5 Klausul)',
      'Pilar 2: Benteng Kodingan, Logika Transaksi & Kunci Rahasia (5 Klausul)',
      'Pilar 3: Ketahanan Server, Jaringan & Pemulihan Bencana (8 Klausul)',
      'Pilar 4: Bukti Lembaga Luar, Audit Independen & Sertifikasi (4 Klausul)',
      'Peta Jalan Eksekusi 3 Bulan (Bulan 1, 2, dan 3)',
      'Target Sukses Terukur (OKR 1, OKR 2, OKR 3)',
      'Alokasi Anggaran (Capex vs Opex) & Mitigasi Risiko'
    ],
    sumber: 'BRD-DASARIA-SEC-2026-003-ADHD, Standar SNAP BI (PADG No. 23/15/PADG/2021), POJK No. 11/POJK.03/2022, UU No. 27 Tahun 2022 (UU PDP).',
    example: '22 berkas bukti fisik terverifikasi yang siap diserahkan ke tim auditor BCA dan Bank Indonesia.',
    dependensi: 'Melibatkan Manajemen IT, Tim Software Engineer, Tim DevOps/Infrastruktur, Tim Keuangan/Operasional, serta Kantor Auditor Eksternal CISA & Pentester CREST.',
    summary: 'Seluruh syarat wajib dipenuhi 100% tanpa celah agar izin koneksi API BCA produksi dibuka.',
    points: [
      'Gagal 1 syarat = BCA menolak membuka akses produksi.',
      'Duit bocor atau fraud dicegah lewat Maker-Checker dan FDS.',
      'Data nasabah dilindungi sesuai amanat UU PDP.'
    ]
  },

  'hub': {
    hakikat: 'Titik temu arsitektur keamanan terintegrasi yang menghubungkan tata kelola internal perusahaan dengan gerbang otentikasi perbankan BCA.',
    turunan: [
      'Pengendalian Akses Internal (IAM & PAM)',
      'Pengamanan Lapisan Aplikasi & Kriptografi (AppSec & RSA 2048)',
      'Keandalan Infrastruktur & Ketahanan Bencana (Hardening, WAF, DRC, WORM)',
      'Verifikasi Independen Pihak Ketiga (VA, Pentest, IT Audit SNAP)'
    ],
    sumber: 'Spesifikasi Teknis SNAP BI 2021 Buku 1 (Tata Kelola) & Buku 2 (Teknis Keamanan).',
    example: 'Arsitektur sistem end-to-end dari aplikasi Dasaria hingga BCA Open API Gateway.',
    dependensi: 'Menjadi induk dari 4 Pilar Kepatuhan Utama.',
    summary: 'Fondasi koordinasi lintas tim untuk menjamin kepatuhan menyeluruh.',
    points: [
      'Pilar 1 & 2 fokus pada rekayasa internal dan integritas staf.',
      'Pilar 3 & 4 fokus pada ketahanan peladen fisik dan pembuktian legal pihak ketiga.'
    ]
  },

  /* ============ PILAR 1 ============ */
  'pilar1': {
    hakikat: 'Pilar pertama berfokus pada penataan manusia, akun login, pemisahan tugas, dan pengendalian mantan karyawan tanpa membutuhkan belanja perangkat lunak berbiaya tinggi.',
    turunan: [
      'Point 23 – User & Access Management',
      'Point 24 – Access Review Berkala',
      'Point 25 – Segregation of Duties (Maker-Checker-Approver)',
      'Point 26 – Multi-Factor Authentication (MFA / 2FA)',
      'Point 27 – Privileged Access Management (PAM)'
    ],
    sumber: 'ISO/IEC 27001:2022 Kontrol A.5 & A.8, NIST SP 800-63B, COSO Internal Control Framework.',
    example: 'Paket SOP SDM, Kebijakan Sandi Direksi, Matriks Wewenang, dan Rekaman Audit Terminal.',
    dependensi: 'Dikoordinasikan oleh Tim Analis Sistem bersama Manajemen IT dan HRD.',
    summary: 'Menutup celah pengkhianatan orang dalam, keteledoran staf, dan akses liar mantan pekerja.',
    points: [
      'Bisa diselesaikan pada Bulan 1 (fase quick wins tanpa biaya).',
      'Wajib didukung kebijakan tertulis bertanda tangan direksi.'
    ]
  },

  'pt23': {
    hakikat: 'Pengelolaan identitas dan sandi pengguna untuk memastikan hanya pihak berwenang yang dapat mengakses sistem keuangan.',
    turunan: [
      'Panjang sandi minimal 12 karakter kombinasi (huruf besar, kecil, angka, simbol)',
      'Formulir persetujuan akun baru berjenjang dengan tanda tangan atasan',
      'Penguncian akun otomatis (account lockout) setelah 5 kali salah password',
      'Pencabutan sesi otomatis (session timeout) setelah 15 menit tanpa aktivitas'
    ],
    sumber: 'ISO/IEC 27001:2022 Kontrol A.5.15, NIST SP 800-63B (Digital Identity Guidelines).',
    example: 'Dokumen Kebijakan Sandi resmi, formulir persetujuan akun baru, dan screenshot pengaturan lockout serta idle timeout di aplikasi.',
    dependensi: 'Diimplementasikan oleh Tim Pengembang pada modul autentikasi.',
    summary: 'Cegah tebak sandi gampang dan komputer ditinggal dalam kondisi login.',
    points: [
      'Sandi wajib ganti berkala tiap 90 hari.',
      'Dilarang menggunakan 3 riwayat sandi terakhir.'
    ]
  },

  'pt24': {
    hakikat: 'Pemeriksaan rutin seluruh akun aktif dan pencabutan hak akses karyawan yang berhenti bekerja secara cepat.',
    turunan: [
      'Evaluasi seluruh akun terdaftar tiap 3 bulan bersama bagian HRD',
      'Pencabutan seluruh akun karyawan resign maksimal 1x24 jam sejak surat efektif keluar',
      'Penonaktifan akun otomatis jika tidak aktif selama 30 hari berturut-turut'
    ],
    sumber: 'ISO/IEC 27001:2022 Kontrol A.5.18, PCI-DSS v4.0.1 Kebutuhan 8.2.',
    example: 'Berita Acara Review Kuartalan bertanda tangan HRD & IT, serta log tiket helpdesk pencabutan akses karyawan resign.',
    dependensi: 'Kolaborasi rutin antara HRD dan Tim Jaringan/DevOps.',
    summary: 'Menjamin mantan staf tidak bisa lagi mengakses VPN, database, atau dashboard internal dari rumah.',
    points: [
      'Tiket pencabutan wajib selesai dalam 1x24 jam.',
      'Daftar akun dicocokkan dengan payroll HRD tiap kuartal.'
    ]
  },

  'pt25': {
    hakikat: 'Pemisahan kewenangan transaksi berjenjang agar tidak ada satu orang pun yang dapat mencairkan dana secara sepihak.',
    turunan: [
      'Tiga peran terpisah: Maker (pembuat draf), Checker (verifikator), Approver (pejabat perilis dana)',
      'Penguncian sistem: Akun Maker dilarang keras mengklik tombol setujui/approve pada draf buatannya sendiri',
      'Pemisahan hak teknis: Tim programmer dilarang memegang akun akses langsung ke database produksi'
    ],
    sumber: 'COSO Internal Control Framework, ISACA COBIT 2019 DSS05.04, POJK No. 11/POJK.03/2022 Pasal 14.',
    example: 'Dokumen Matriks Wewenang resmi, SOP Transaksi Keuangan, dan screenshot penolakan sistem saat akun Maker mencoba approve.',
    dependensi: 'Menjadi logika inti pada dashboard keuangan dan modul pencairan dana Dasaria.',
    summary: 'Mencegah manipulasi transfer dana internal dan risiko fitnah bagi staf operasional.',
    points: [
      'Satu transaksi wajib diverifikasi minimal oleh 2 orang berbeda.',
      'Pejabat Approver memerlukan limit otorisasi bertingkat.'
    ]
  },

  'pt26': {
    hakikat: 'Penerapan lapisan keamanan ganda selain sandi biasa menggunakan kode verifikasi berbasis waktu (TOTP).',
    turunan: [
      'Wajib MFA (Google Authenticator / TOTP) untuk seluruh koneksi VPN kantor tim IT',
      'Wajib verifikasi MFA saat pejabat Approver merilis transfer dana dengan nominal di atas ambang batas',
      'Kunci sandi dinamis 6 angka yang berganti tiap 30 detik'
    ],
    sumber: 'PCI-DSS v4.0.1 Kebutuhan 8.4, Petunjuk Teknis SNAP BI 2021 Buku 2 Klausul 4.',
    example: 'Screenshot konfigurasi peladen VPN wajib TOTP dan screenshot pop-up permintaan kode OTP saat rilis transfer dana.',
    dependensi: 'Dikonfigurasi pada gateway VPN oleh Tim Jaringan dan modul transaksi oleh Programmer.',
    summary: 'Jika sandi tercuri akibat phishing, akun tetap tidak bisa ditembus tanpa ponsel fisik staf.',
    points: [
      'Dilarang menggunakan SMS OTP karena rentan SIM-swap; wajib aplikasi authenticator.',
      'Kunci darurat disimpan di brankas terisolasi.'
    ]
  },

  'pt27': {
    hakikat: 'Pengawasan ketat terhadap akun administrator dengan hak istimewa tinggi (root/administrator server).',
    turunan: [
      'Pelarangan penggunaan akun root bersama (PermitRootLogin no di SSH peladen)',
      'Setiap admin wajib login menggunakan akun nama pribadi lalu eskalasi via sudo berbasis tiket',
      'Perekaman seluruh ketikan perintah terminal secara real-time ke peladen log terpusat'
    ],
    sumber: 'CIS Controls Version 8 (Kontrol 5 & 6), ISO/IEC 27001:2022 Kontrol A.8.2.',
    example: 'SOP Pengelolaan Akun Istimewa, daftar resmi nama pemegang akses admin, dan rekaman log ketikan sesi terminal Linux.',
    dependensi: 'Dikelola oleh Tim DevOps dan Administrator Sistem.',
    summary: 'Mencegah insiden penghapusan database tanpa jejak penanggung jawab.',
    points: [
      'Akses diberikan temporer berbasis tiket kerja darurat.',
      'Log rekaman sesi disimpan terpisah agar tidak bisa disunting admin bersangkutan.'
    ]
  },

  /* ============ PILAR 2 ============ */
  'pilar2': {
    hakikat: 'Pilar kedua berfokus pada rekayasa perangkat lunak yang aman, penguncian repositori, manajemen kunci rahasia, tanda tangan kriptografi SNAP, dan pencegahan transaksi penipuan.',
    turunan: [
      'Point 14 – Application Security (Sanitasi & Rate Limiting)',
      'Point 17 – Source Code Security (Git Main Branch Protection & SAST)',
      'Kontrol IS 5A – Penempatan Kredensial (.env chmod 600)',
      'Point 28 – Key Management Kriptografi SNAP RSA 2048',
      'Point 20 – Fraud Detection System (FDS Alarm & Hold)'
    ],
    sumber: 'OWASP Top 10, OWASP API Security, NIST SSDF SP 800-218, Spesifikasi SNAP BI 2021 Buku 2.',
    example: 'Buku Secure Coding, Konfigurasi Rate Limiter, Hasil Scan SAST, SOP Key Management RSA 2048, dan Dashboard FDS.',
    dependensi: 'Tanggung jawab penuh Tim Programmer dan Lead Software Architect.',
    summary: 'Mengunci aplikasi dari serangan injeksi, kebocoran rahasia di Git, dan transaksi bodong.',
    points: [
      'Tanda tangan digital RSA 2048 adalah syarat mutlak gateway BCA.',
      'FDS melindungi saldo kas dari pengurasan cepat akun terbajak.'
    ]
  },

  'pt14': {
    hakikat: 'Pengamanan logika aplikasi dari manipulasi penyerang, serangan injeksi, dan banjir pemanggilan API.',
    turunan: [
      'Pembatasan frekuensi panggilan API maksimal 100 request/menit per alamat IP',
      'Sanitasi ketat seluruh input formulir dari karakter berbahaya SQL Injection dan XSS',
      'Penyembunyian rincian error teknis (stack trace DB) dengan menggantinya pesan bisnis ramah pengguna',
      'Pemeriksaan biner asli berkas (magic bytes) pada setiap unggahan bukti struk transfer'
    ],
    sumber: 'OWASP Top 10 2021 (A03 Injection), OWASP API Security 2023 (API4), PCI-DSS v4.0.1 Req 6.4.',
    example: 'Buku Panduan Secure Coding internal, konfigurasi rate limiting di API Gateway, screenshot pesan error umum, dan potongan kode validasi magic bytes.',
    dependensi: 'Diterapkan pada API Gateway dan lapisan controller aplikasi Dasaria.',
    summary: 'Memastikan aplikasi tangguh menghadapi trafik ganjil dan tidak membocorkan struktur database saat terjadi galat.',
    points: [
      'Rate limit dipasang di Nginx / Kong Gateway.',
      'Semua pesan error teknis dicatat di internal log saja, tidak dikirim ke klien.'
    ]
  },

  'pt17': {
    hakikat: 'Perlindungan repositori kode sumber dari perubahan liar, sabotase, dan kebocoran logika bisnis.',
    turunan: [
      'Penguncian cabang utama Git (main branch protection) dengan larangan direct push',
      'Kewajiban minimal satu persetujuan programmer senior melalui mekanisme Pull Request (PR)',
      'Pemasangan pemindai kode otomatis (SAST) di alur CI/CD untuk mendeteksi kerentanan sebelum build'
    ],
    sumber: 'NIST SSDF SP 800-218 (Secure Software Development Framework), CIS Controls v8 Kontrol 16.',
    example: 'Screenshot pengaturan branch protection di GitHub/GitLab, rekaman log persetujuan Pull Request, dan laporan hasil scan alat SAST.',
    dependensi: 'Dikonfigurasi pada repositori git oleh Lead Developer dan Tim DevOps.',
    summary: 'Mencegah kode berbahaya atau bug fatal masuk ke server produksi tanpa pengawasan tim senior.',
    points: [
      'Branch main tidak bisa di-push tanpa lulus tes otomatis CI.',
      'Riwayat perubahan tercatat jelas dengan commit terverifikasi.'
    ]
  },

  'is5a': {
    hakikat: 'Kebijakan tanpa toleransi terhadap penulisan kata sandi, token API, dan kunci privat di dalam kode program.',
    turunan: [
      'Pemisahan seluruh kredensial ke berkas lingkungan (.env) di luar folder web publik',
      'Penguncian izin berkas rahasia hanya untuk pemilik dengan perintah chmod 600 di Linux',
      'Pembersihan riwayat commit Git dari rahasia terbuka menggunakan scanner otomatis',
      'Prosedur rotasi berkala password database dan token API tiap 6 bulan'
    ],
    sumber: 'CWE-798 (Use of Hard-coded Credentials), OWASP Secrets Management, ISO/IEC 27001:2022 Kontrol A.8.24.',
    example: 'Laporan pemindaian riwayat Git bebas rahasia, screenshot izin berkas chmod 600 di server Linux, dan SOP Penggantian Kredensial Berkala.',
    dependensi: 'Mengacu pada dokumen teknis internal PANDUAN-KONTROL-IS5A-PENEMPATAN-KREDENSIAL-INTEGRASI-BANK.',
    summary: 'Sekalipun repositori kode dicuri, penyerang tidak mendapatkan password database atau API key BCA.',
    points: [
      'Kunci produksi disimpan di secret manager server.',
      'Gunakan git-secrets atau trufflehog di pre-commit hook.'
    ]
  },

  'pt28': {
    hakikat: 'Pengelolaan siklus hidup kunci kriptografi asimetris untuk membubuhkan tanda tangan digital pada transaksi SNAP BCA.',
    turunan: [
      'Pembuatan pasangan kunci RSA 2048-bit pada komputer terisolasi (air-gapped machine)',
      'Penyimpanan kunci privat (Private Key) terenkripsi ketat di server produksi dengan izin terbatas',
      'Pertukaran kunci publik (Public Key) dengan BCA melalui Berita Acara resmi bertanda tangan pejabat',
      'Prosedur rotasi kunci tahunan dan rencana pencabutan darurat jika terindikasi bocor'
    ],
    sumber: 'Spesifikasi Teknis Tanda Tangan Asimetris SNAP BI 2021, FIPS 186-4, NIST SP 800-57.',
    example: 'Dokumen SOP Tata Kelola Kunci Kriptografi, Berita Acara pertukaran kunci dengan BCA, dan screenshot izin file private key terkunci rapat.',
    dependensi: 'Modul penandatanganan JSON SNAP dibuat oleh Programmer Backend.',
    summary: 'BCA memverifikasi setiap instruksi transfer dana menggunakan Public Key Dasaria untuk menjamin keaslian data.',
    points: [
      'Private key dilarang keras dikirim lewat email atau chat.',
      'Rotasi kunci wajib dikoordinasikan minimal 30 hari sebelum kedaluwarsa.'
    ]
  },

  'pt20': {
    hakikat: 'Sistem deteksi dini anomali transaksi keuangan untuk menghentikan upaya penipuan atau peretasan saldo seketika.',
    turunan: [
      'Pendeteksi frekuensi transaksi abnormal dalam waktu singkat (velocity check)',
      'Alarm lonjakan nominal transaksi di luar pola wajar rekening nasabah',
      'Pengecekan otomatis nomor rekening tujuan terhadap daftar hitam penipu nasional',
      'Fitur penahanan otomatis (HOLD) yang membutuhkan persetujuan manual staf sebelum dana dirilis'
    ],
    sumber: 'Peraturan Bank Indonesia No. 23/6/PBI/2021 Pasal 68, FATF Guidance on Financial Crime Prevention.',
    example: 'Dokumen aturan parameter FDS, SOP investigasi transaksi anomali, dan screenshot dashboard tombol penahanan transaksi mencurigakan.',
    dependensi: 'Logika diintegrasikan ke alur transfer oleh Backend Engineer dan dikelola tim Analis Fraud.',
    summary: 'Mencegah pembobolan saldo dalam jumlah masif saat kredensial akun nasabah bocor.',
    points: [
      'Status HOLD menghentikan pemanggilan endpoint transfer BCA.',
      'Dilengkapi notifikasi verifikasi cepat via SMS/WhatsApp ke nasabah.'
    ]
  },

  /* ============ PILAR 3 ============ */
  'pilar3': {
    hakikat: 'Pilar ketiga berfokus pada ketahanan fisik dan logis server, proteksi jaringan berlapis, isolasi zona data, log audit anti-rusak, serta jaminan sistem hidup dalam 1 jam saat bencana melanda.',
    turunan: [
      'Point 4 – System Hardening & Patching',
      'Kontrol IS 3 – Antivirus Peladen Host Linux (ClamAV)',
      'Point 18 – Network Security Berlapis (Firewall, WAF, VPN)',
      'Point 19 – Segmentasi Jaringan (4 Zona Terisolasi)',
      'Point 21 – Log Jejak Audit & Jam NTP',
      'Point 22 – Monitoring Permukaan Internet',
      'Point 5 – BCP & DRP (Server Cadangan DRC RTO/RPO 1 Jam)',
      'Point 11 – Backup & Retensi 10 Tahun (WORM Storage)'
    ],
    sumber: 'CIS Linux Benchmark, PCI-DSS v4.0.1, NIST SP 800-41, ISO 22301:2019, UU No. 8 Tahun 1997.',
    example: 'Checklist Hardening, Daemon Antivirus ClamAV, Topologi 4 Zona, Server Cadangan DRC, dan Konfigurasi S3 Glacier Object Lock 10 Tahun.',
    dependensi: 'Tanggung jawab utama Tim DevOps, Network Engineer, dan Sistem Administrator.',
    summary: 'Menjamin server kebal serangan internet dan siap pulih dalam 1 jam tanpa kehilangan data transaksi penting.',
    points: [
      'Mencakup 8 dari 22 klausul total audit BCA.',
      'Server cadangan DRC dan arsip 10 tahun merupakan item Opex bulanan.'
    ]
  },

  'pt4': {
    hakikat: 'Pengerasan konfigurasi sistem operasi server Linux dan pembaruan rutin untuk menambal celah keamanan bawaan.',
    turunan: [
      'Menutup seluruh port dan mematikan layanan servis yang tidak dibutuhkan',
      'Pembaruan berkala paket sistem operasi bulanan dengan verifikasi kompatibilitas',
      'Penambalan darurat dalam waktu maksimal 1x24 jam untuk kerentanan berstatus kritis (zero-day)'
    ],
    sumber: 'CIS Ubuntu Linux Benchmark v1.0, ISO/IEC 27001:2022 Kontrol A.8.9.',
    example: 'Dokumen Checklist Hardening server yang telah diisi dan laporan riwayat pembaruan paket Linux bulanan.',
    dependensi: 'Dijalankan oleh Administrator Sistem Linux pada seluruh peladen Dasaria.',
    summary: 'Menghilangkan pintu masuk bawaan pabrik yang sering dimanfaatkan bot scanner otomatis peretas.',
    points: [
      'Hapus paket utilitas yang tidak perlu (compiler gcc, telnet, ftp).',
      'Terapkan konfigurasi kernel sysctl yang aman.'
    ]
  },

  'is3': {
    hakikat: 'Perlindungan peladen Linux dari infeksi malware, trojan, dan web-shell tersembunyi menggunakan perangkat lunak antivirus aktif.',
    turunan: [
      'Pemasangan daemon antivirus aktif di Host OS peladen Linux (ClamAV / ClamOnAcc)',
      'Pembaruan berkala basis data definisi virus secara otomatis setiap hari via cron',
      'Pemindaian terjadwal seluruh disk peladen dan pemindaian instan berkas yang diunggah pengguna'
    ],
    sumber: 'PCI-DSS v4.0.1 Kebutuhan 5, POJK No. 11/POJK.03/2022 Lampiran II.',
    example: 'Screenshot status daemon antivirus sedang aktif (systemctl status clamonacc), log update harian freshclam, dan log pemindaian terjadwal disk.',
    dependensi: 'Mengacu pada dokumen teknis internal PANDUAN-KONTROL-IS3-ANTIVIRUS-INTEGRASI-BANK.',
    summary: 'Membongkar mitos bahwa Linux kebal virus; memastikan peladen transaksi bersih dari malware penyadap.',
    points: [
      'Definisi virus di-update tiap 4 jam.',
      'Berkas terindikasi langsung diisolasi ke folder karantina.'
    ]
  },

  'pt18': {
    hakikat: 'Pembangunan tembok pelindung jaringan berlapis untuk menolak seluruh lalu lintas mencurigakan dari internet.',
    turunan: [
      'Aturan firewall tegas: Tolak Semua (Default Deny All) dan hanya buka port 443 (HTTPS)',
      'Pemasangan Web Application Firewall (WAF) aktif di depan gateway web',
      'Pemasangan sistem pendeteksi dan pencegah penyusupan (IDS/IPS Fail2ban) untuk blokir IP penyerang',
      'Akses jarak jauh seluruh tim IT wajib melalui jalur VPN terenkripsi'
    ],
    sumber: 'NIST SP 800-41 Rev. 1, ISO/IEC 27001:2022 Kontrol A.8.20.',
    example: 'Diagram Keamanan Jaringan resmi, tabel aturan firewall peladen, screenshot dashboard WAF & Fail2ban, dan konfigurasi akses VPN.',
    dependensi: 'Dikonfigurasi oleh Tim Network Engineer dan Cloud Administrator.',
    summary: 'Mencegah serangan banjir DDoS, penembakan port database langsung, dan serangan brute force login.',
    points: [
      'Port SSH tidak boleh terpapar ke IP publik; wajib via VPN.',
      'Fail2ban memblokir IP setelah 3 kali gagal autentikasi.'
    ]
  },

  'pt19': {
    hakikat: 'Penyekatan jaringan fisik dan logis agar peretas yang berhasil menembus web publik tidak dapat masuk ke database nasabah.',
    turunan: [
      'Pemisahan 4 zona jaringan terisolasi: Zona DMZ (Web Gateway), Zona Aplikasi Internal, Zona Database Produksi, dan Zona Pengembangan (Dev)',
      'Aturan firewall ketat: Web Gateway dilarang keras terhubung langsung ke Database',
      'Komunikasi hanya diizinkan melalui lapisan Aplikasi Internal dengan port spesifik'
    ],
    sumber: 'PCI-DSS v4.0.1 Annex A2, NIST SP 800-125B.',
    example: 'Diagram Topologi Segmentasi Jaringan resmi, serta berkas konfigurasi subnet VLAN dan aturan routing firewall antar-zona.',
    dependensi: 'Dikonfigurasi pada switch/router cloud oleh Network Architect.',
    summary: 'Isolasi dampak serangan: jika web publik jebol, brankas database keuangan tetap aman tersekat.',
    points: [
      'Gunakan VPC terpisah atau VLAN terisolasi.',
      'Database hanya merespons query dari IP private server aplikasi.'
    ]
  },

  'pt21': {
    hakikat: 'Penyelarasan jam server secara presisi dan penguncian rekaman jejak audit transaksi agar tidak dapat dimanipulasi.',
    turunan: [
      'Sinkronisasi waktu seluruh peladen ke server NTP resmi Indonesia (id.pool.ntp.org)',
      'Pengumpulan seluruh log transaksi terpusat memuat jam akurat, ID pengguna, IP asal, dan jenis aksi',
      'Konfigurasi penyimpanan log dengan izin hanya-tulis (append-only) yang anti-edit dan anti-hapus'
    ],
    sumber: 'IETF RFC 5905 (NTPv4), NIST SP 800-92, ISO/IEC 27001:2022 Kontrol A.8.15.',
    example: 'Konfigurasi sinkronisasi NTP (chrony/ntpd), sampel berkas log audit terpusat, dan bukti pengaturan izin penyimpanan anti-edit.',
    dependensi: 'Diterapkan oleh Tim DevOps pada seluruh server aplikasi dan database.',
    summary: 'Memastikan waktu rekonsiliasi transfer cocok dengan catatan BCA dan staf nakal tidak bisa menghapus jejak pencurian.',
    points: [
      'Deviasi waktu maksimal antar-server adalah 500 milidetik.',
      'Log dikirim secara streaming ke syslog terpusat.'
    ]
  },

  'pt22': {
    hakikat: 'Pemantauan aktif terhadap seluruh aset yang terpapar ke internet guna mencegah pintu belakang yang lupa ditutup.',
    turunan: [
      'Pencatatan buku inventaris resmi seluruh domain, subdomain, dan IP publik perusahaan',
      'Pemasangan alarm otomatis masa kedaluwarsa sertifikat TLS publik',
      'Prosedur penutupan instan jika ditemukan ada port uji coba yang tidak sengaja terbuka ke publik'
    ],
    sumber: 'OWASP Amass Framework, CISA Known Exploited Vulnerabilities (KEV).',
    example: 'Buku Daftar Inventaris Domain & IP Publik resmi, serta laporan hasil monitoring permukaan serangan kuartalan.',
    dependensi: 'Dikelola oleh Tim Keamanan Informasi (SecOps).',
    summary: 'Mencegah peretas masuk melalui subdomain lawas atau port eksperimen programmer yang terlupakan.',
    points: [
      'Scan port internet dijalankan otomatis tiap minggu.',
      'Peringatan kedaluwarsa TLS berbunyi 30 hari sebelum batas waktu.'
    ]
  },

  'pt5': {
    hakikat: 'Jaminan keberlanjutan bisnis dan pemulihan operasional sistem jika pusat data utama mengalami bencana total.',
    turunan: [
      'Dokumen resmi Rencana Keberlanjutan Bisnis (BCP) dan Pemulihan Bencana (DRP) disahkan direksi',
      'Penyewaan server cadangan (Disaster Recovery Center / DRC) di cloud terpisah dengan replikasi database terus-menerus',
      'Target pemulihan wajib: mati maksimal 1 jam (RTO 1 jam) dan data hilang maksimal 1 jam (RPO 1 jam)',
      'Latihan simulasi bencana (DR drill) wajib dilaksanakan minimal setahun sekali'
    ],
    sumber: 'Standar ISO 22301:2019, Petunjuk Teknis SNAP BI 2021 Bab Ketahanan Sistem.',
    example: 'Buku Dokumen BCP & DRP resmi, diagram replikasi DRC dan status sinkronisasi kontinu, surat penetapan target RTO/RPO 1 jam, dan Berita Acara simulasi bencana tahunan.',
    dependensi: 'Dikoordinasikan oleh Manajemen IT bersama Tim DevOps dan Provider Cloud.',
    summary: 'Jika server utama terbakar atau banjir, transaksi pembayaran BCA dapat dialihkan ke server cadangan dalam waktu di bawah 1 jam.',
    points: [
      'Gunakan strategi Warm-Standby untuk menghemat biaya Opex.',
      'Simulasi tahunan wajib melibatkan perwakilan bisnis.'
    ]
  },

  'pt11': {
    hakikat: 'Pencadangan data berkala dan penguncian arsip transaksi keuangan selama minimal 10 tahun sesuai amanat undang-undang.',
    turunan: [
      'Pencadangan harian otomatis terenkripsi AES-256 yang dikirim ke cloud terpisah (off-site backup)',
      'Penyimpanan arsip log transaksi keuangan selama minimal 10 tahun penuh menggunakan media penyimpanan WORM (Write Once Read Many / S3 Glacier Object Lock)',
      'Uji coba restorasi data cadangan secara berkala setiap bulan'
    ],
    sumber: 'Pasal 11 UU No. 8 Tahun 1997 tentang Dokumen Perusahaan, POJK No. 11/POJK.03/2022 Pasal 29.',
    example: 'SOP Backup dan Pemulihan Data, log laporan keberhasilan backup harian off-site, dan bukti konfigurasi retention lock 10 tahun di cloud storage.',
    dependensi: 'Dikelola oleh Database Administrator dan Tim DevOps.',
    summary: 'Menjamin jika 5 atau 10 tahun lagi terjadi sengketa hukum atau audit pajak, data transaksi tetap utuh dan sah.',
    points: [
      'Data terkunci matematis (WORM); tidak bisa dihapus bahkan oleh akun root.',
      'Enkripsi cadangan menggunakan kunci KMS terpisah.'
    ]
  },

  /* ============ PILAR 4 ============ */
  'pilar4': {
    hakikat: 'Pilar keempat berfokus pada alokasi anggaran untuk menyewa jasa lembaga pihak ketiga independen berlisensi resmi guna membuktikan ke bank bahwa sistem Dasaria teruji aman.',
    turunan: [
      'Point 15 – Enkripsi HTTPS/TLS Komersial',
      'Point 6 – Vulnerability Assessment Berkala (VA)',
      'Point 16 – Penetration Testing Berlisensi (CREST/OSCP)',
      'Point 3 – IT Audit Independen Standar SNAP BI (CISA/OJK)'
    ],
    sumber: 'IETF RFC 8446, NIST NVD, OWASP WSTG v4.2, ISACA ITAF 4th Edition, SEOJK No. 29/SEOJK.03/2022.',
    example: 'Sertifikat TLS CA Komersial DigiCert/Sectigo, Laporan Hasil VA, Laporan Pentest & Attestation Letter CREST, serta Opini Bersih Auditor CISA.',
    dependensi: 'Dikoordinasikan oleh Manajemen IT bersama Kantor Akuntan/Konsultan Audit Eksternal.',
    summary: 'Menghilangkan klaim aman sepihak; menyajikan bukti sertifikasi dan laporan resmi di meja direksi BCA.',
    points: [
      'Seluruh bukti fisik di pilar ini diterbitkan oleh lembaga luar terakreditasi.',
      'Sertifikat gratisan (Let\'s Encrypt / self-signed) ditolak mentah-mentah oleh server BCA.'
    ]
  },

  'pt15': {
    hakikat: 'Pengamanan jalur komunikasi API menggunakan sertifikat digital berbayar yang diterbitkan oleh Otoritas Sertifikat (CA) terpercaya dunia.',
    turunan: [
      'Pembelian sertifikat TLS komersial dari CA publik global (DigiCert / Sectigo / Entrust)',
      'Penggunaan protokol enkripsi modern: hanya mengizinkan TLS 1.2 dan TLS 1.3',
      'Pemasangan tajuk keamanan HTTP Strict Transport Security (HSTS) minimal 1 tahun'
    ],
    sumber: 'IETF RFC 8446 (TLS 1.3), Mozilla Modern SSL Profile, Spesifikasi Teknis SNAP BI 2021 Buku 2.',
    example: 'Berkas sertifikat TLS komersial beserta rantai sertifikat (CA chain), hasil uji SSL Labs dengan nilai minimal A, dan screenshot konfigurasi Nginx.',
    dependensi: 'Dipasang pada reverse proxy web gateway oleh Tim DevOps.',
    summary: 'Server BCA secara otomatis menolak koneksi API jika sertifikat yang digunakan berasal dari CA gratisan atau self-signed.',
    points: [
      'Wajib grade A pada pengujian SSL Labs.',
      'Cipher suite lemah (DES, RC4, MD5) dinonaktifkan permanen.'
    ]
  },

  'pt6': {
    hakikat: 'Pemindaian celah keamanan sistem dan infrastruktur secara berkala untuk mendeteksi kerentanan baru sebelum dieksploitasi penyerang.',
    turunan: [
      'Kontrak langganan alat atau jasa pemindai kerentanan berkala setiap 6 bulan sekali',
      'Penerapan batas waktu perbaikan wajib: celah Kritis maksimal 3 hari, celah Tinggi maksimal 14 hari',
      'Penerbitan Berita Acara perbaikan celah pasca pemindaian'
    ],
    sumber: 'NIST National Vulnerability Database (CVSS v3.1), ISO/IEC 27001:2022 Kontrol A.8.8.',
    example: 'Kontrak jasa pemindaian kerentanan resmi, laporan hasil pemindaian semesteran, dan Berita Acara verifikasi penambalan celah.',
    dependensi: 'Dikelola oleh Tim SecOps bekerja sama dengan vendor pemindai keamanan.',
    summary: 'Menemukan celah baru pada sistem operasi dan pustaka dependensi secara proaktif.',
    points: [
      'Skor CVSS di atas 7.0 wajib diperbaiki segera.',
      'Hasil pemindaian semesteran diserahkan pada audit tahunan bank.'
    ]
  },

  'pt16': {
    hakikat: 'Pengujian penetrasi keamanan mendalam pra-produksi oleh peretas etis independen bersertifikasi internasional.',
    turunan: [
      'Pelaksanaan pentest menyeluruh sebelum peluncuran sistem ke lingkungan produksi',
      'Pengujian wajib dilakukan oleh lembaga resmi yang memiliki sertifikasi internasional (CREST atau OSCP)',
      'Pengujian ulang (re-test) wajib dilakukan sampai seluruh temuan celah Kritis dan Tinggi habis (nol temuan)',
      'Penerbitan Surat Bebas Celah resmi (Attestation Letter) dan kontrak pengujian berkala tahunan'
    ],
    sumber: 'OWASP Web Security Testing Guide (WSTG v4.2), Sertifikasi Standar CREST / OffSec OSCP.',
    example: 'Buku Laporan Resmi Penetration Testing dari vendor, sertifikat profesional penguji (CREST/OSCP), Surat Keterangan Bebas Celah (Attestation Letter), dan jadwal kontrak tahunan.',
    dependensi: 'Dikelola Manajemen IT bersama Vendor Pentest berlisensi.',
    summary: 'Membuktikan ketahanan logika transaksi aplikasi Dasaria terhadap simulasi serangan nyata di lapangan.',
    points: [
      'Syarat mutlak izin go-live: 0 temuan celah Kritis dan Tinggi.',
      'Attestation letter ditandatangani oleh pimpinan kantor penguji berlisensi.'
    ]
  },

  'pt3': {
    hakikat: 'Pemeriksaan kepatuhan komprehensif oleh auditor IT eksternal independen terhadap seluruh tata kelola dan teknis API SNAP BI.',
    turunan: [
      'Penyewaan kantor konsultan audit IT independen yang memiliki auditor berkualifikasi CISA atau terdaftar di OJK',
      'Pemeriksaan menyeluruh terhadap kesesuaian SOP, arsitektur teknis, dan bukti fisik kepatuhan SNAP BCA',
      'Penyusunan matriks tindak lanjut perbaikan atas seluruh catatan rekomendasi auditor yang disahkan direksi'
    ],
    sumber: 'ISACA Information Technology Assurance Framework (ITAF 4th Edition), CISA, SEOJK No. 29/SEOJK.03/2022.',
    example: 'Kontrak kerja sama kantor audit IT independen, Buku Laporan Resmi Hasil Audit IT Kepatuhan SNAP BI dengan opini wajar tanpa pengecualian, dan lembar tindak lanjut rekomendasi disahkan direksi.',
    dependensi: 'Laporan opini diserahkan langsung ke meja direksi BCA dan regulator Bank Indonesia.',
    summary: 'Puncak dari seluruh proses audit: surat opini independen yang menyatakan sistem Dasaria layak dan patuh beroperasi.',
    points: [
      'Opini audit wajib Wajar Tanpa Pengecualian (WTP).',
      'Menjadi dasar penerbitan surat persetujuan koneksi produksi dari BCA.'
    ]
  },

  /* ============ PETA JALAN 3 BULAN ============ */
  'g-timeline': {
    hakikat: 'Urutan eksekusi implementasi terstruktur selama 90 hari kerja yang membagi beban kerja secara proporsional dari hal gratis hingga audit resmi.',
    turunan: [
      'Bulan 1: Fondasi, Kebijakan SOP & Quick Wins (Tanpa Biaya Eksternal)',
      'Bulan 2: Rekayasa Fitur, Sekat Jaringan & Kesiapan Server Cadangan DRC',
      'Bulan 3: Uji Vendor Eksternal, Audit CISA & Pembukaan Jalur Produksi BCA'
    ],
    sumber: 'Bab 7 BRD-DASARIA-SEC-2026-003-ADHD.',
    example: 'Rencana kerja 3 bulan (Gantt Chart & Sprint Backlog).',
    dependensi: 'Menghubungkan kerja internal tim programmer/jaringan dengan jadwal kedatangan auditor luar.',
    summary: 'Strategi bertahap agar tim tidak panik dan anggaran keluar pada waktu yang tepat.',
    points: [
      'Bulan 1 berfokus pada dokumen legal dan settingan internal.',
      'Bulan 2 fokus pada coding dan sekat server.',
      'Bulan 3 fokus pada pengujian pihak ketiga dan go-live.'
    ]
  },

  'b1': {
    hakikat: 'Fase 30 hari pertama yang difokuskan pada pembenahan aturan manusia, pengesahan SOP resmi, dan pengetatan konfigurasi dasar tanpa belanja vendor mahal.',
    turunan: [
      'Pengesahan 4 SOP: Maker-Checker, Kebijakan Sandi, Review Akses Kuartalan, dan BCP/DRP',
      'Pengaktifan verifikasi dua langkah (MFA) pada koneksi VPN dan modul transaksi',
      'Sinkronisasi jam server ke NTP resmi Indonesia dan pembersihan pesan error',
      'Pembersihan server Linux (hardening) dan penguncian berkas kredensial (.env chmod 600)'
    ],
    sumber: 'BRD Bab 7 - Tahap Fondasi.',
    example: 'Berkas SOP tertanda tangan direksi, screenshot MFA aktif, dan laporan scan secret Git bersih.',
    dependensi: 'Dikerjakan bersama oleh Tim Analis Sistem, DevOps, dan Programmer.',
    summary: 'Menyelesaikan 8 dari 22 klausul secara cepat tanpa mengeluarkan uang kas besar.',
    points: [
      'Kunci kontrak dengan vendor pentest dan auditor CISA sejak bulan ini agar tidak antre di Bulan 3.',
      'Pangkas semua kata sandi terbuka di repositori kode.'
    ]
  },

  'b2': {
    hakikat: 'Fase hari ke-31 hingga 60 yang difokuskan pada pengkodean fitur keamanan, segmentasi topologi jaringan, dan penyewaan server cadangan DRC.',
    turunan: [
      'Penyekatan 4 zona jaringan (DMZ, Aplikasi, Database, Dev) dan pemasangan WAF',
      'Koding logika proteksi: Rate limiting 100 req/menit, sanitasi input, dan mesin pendeteksi fraud (FDS)',
      'Pembuatan modul tanda tangan kriptografi SNAP BI RSA 2048-bit',
      'Pemasangan antivirus aktif ClamAV pada server Linux dengan pembaruan harian',
      'Penyewaan server cadangan DRC di cloud terpisah dan penguncian arsip 10 tahun (WORM)'
    ],
    sumber: 'BRD Bab 7 - Tahap Rekayasa & Infrastruktur.',
    example: 'Repositori kode SNAP teruji lokal, topologi jaringan 4 VLAN, dan server DRC dalam status sinkronisasi aktif.',
    dependensi: 'Beban kerja utama berada pada Tim Software Engineer dan DevOps/Infrastruktur.',
    summary: 'Membangun seluruh benteng teknis dan infrastruktur tahan bencana yang disyaratkan bank.',
    points: [
      'Pastikan modul FDS diuji coba dengan data riwayat transaksi.',
      'Jalankan pemindaian celah mandiri (SAST) sebelum masuk Bulan 3.'
    ]
  },

  'b3': {
    hakikat: 'Fase hari ke-61 hingga 90 yang difokuskan pada pengujian oleh peretas etis resmi, audit menyeluruh auditor CISA, dan penyerahan 22 berkas bukti ke BCA.',
    turunan: [
      'Pemasangan sertifikat TLS komersial resmi dari CA terpercaya publik (DigiCert/Sectigo)',
      'Pelaksanaan uji penetrasi berlisensi (CREST/OSCP) dan penambalan seluruh temuan hingga 0 celah',
      'Latihan simulasi bencana (DR drill) membuktikan pemulihan server DRC di bawah 1 jam',
      'Pelaksanaan audit IT independen kepatuhan SNAP BI oleh auditor bersertifikat CISA',
      'Penyerahan bundel 22 bukti fisik ke tim verifikator BCA dan penerbitan izin Go-Live produksi'
    ],
    sumber: 'BRD Bab 7 - Tahap Validasi Eksternal & Produksi.',
    example: 'Laporan Pentest Bebas Celah, Laporan Audit IT Opini WTP, dan Berita Acara Go-Live resmi BCA.',
    dependensi: 'Kolaborasi Manajemen IT dengan Vendor Eksternal dan Tim Onboarding BCA.',
    summary: 'Puncak keberhasilan proyek: pembukaan pintu koneksi API BCA produksi untuk transaksi langsung.',
    points: [
      'Seluruh 22 bukti fisik diserahkan dalam satu map bundel terstruktur.',
      'Simulasi bencana wajib menghasilkan Berita Acara resmi.'
    ]
  },

  /* ============ TARGET SUKSES (OKR) ============ */
  'g-okr': {
    hakikat: 'Indikator kinerja utama terukur (Objectives and Key Results) yang menjadi tolok ukur mutlak keberhasilan proyek keamanan sistem ini.',
    turunan: [
      'Target 1: Lolos Penuh Audit Kepatuhan SNAP BCA (100% Klausul)',
      'Target 2: Ketahanan Operasional Sistem Tanpa Henti (RTO < 45 Menit)',
      'Target 3: Nol Kasus Penipuan & Nol Password Bocor (100% Proteksi Akun)'
    ],
    sumber: 'Bab 6 BRD-DASARIA-SEC-2026-003-ADHD.',
    example: 'Dashboard metrik kepatuhan dan pencapaian target direksi Dasaria.',
    dependensi: 'Menjadi dasar pertanggungjawaban Manajemen IT kepada Direksi dan Pemegang Saham.',
    summary: 'Tiga target utama yang menjamin sistem aman, bisnis berjalan lancar, dan izin perbankan terbit.',
    points: [
      'Setiap target memiliki 3 Key Results numerik terukur.',
      'Pencapaian 100% membuka gerbang go-live BCA.'
    ]
  },

  'okr1': {
    hakikat: 'Target pencapaian kelulusan audit kepatuhan perbankan secara sempurna tanpa ada temuan yang menggantung.',
    turunan: [
      'KR 1.1: Hasil pentest dari vendor berlisensi memiliki 0 temuan celah Kritis dan Tinggi',
      'KR 1.2: Laporan audit IT independen terbit dengan opini wajar tanpa pengecualian (WTP)',
      'KR 1.3: 100% dari 22 bukti fisik diterima dan disetujui penuh oleh tim verifikator BCA'
    ],
    sumber: 'BRD Bab 6 - Target 1.',
    example: 'Attestation Letter bebas celah dan Surat Rekomendasi Auditor CISA.',
    dependensi: 'Dihasilkan dari eksekusi klausul Pilar 4.',
    summary: 'Menghilangkan seluruh keraguan tim verifikator bank BCA.',
    points: [
      '0 temuan kritis adalah syarat non-negosiasi.',
      '22 bukti fisik wajib lengkap sebelum jadwal verifikasi.'
    ]
  },

  'okr2': {
    hakikat: 'Target ketahanan infrastruktur peladen untuk menjamin kelangsungan transaksi finansial tanpa terputus lama.',
    turunan: [
      'KR 2.1: Simulasi bencana membuktikan server DRC pulih di bawah 45 menit (lebih cepat dari batas 1 jam)',
      'KR 2.2: Ruang simpan arsip transaksi 10 tahun (WORM) sudah aktif dan terkunci secara matematis',
      'KR 2.3: Waktu aktif sistem (uptime) mencapai minimal 99,9% berkat WAF dan segmentasi jaringan'
    ],
    sumber: 'BRD Bab 6 - Target 2.',
    example: 'Berita Acara Simulasi Bencana RTO 42 menit dan status S3 Glacier Object Lock.',
    dependensi: 'Dihasilkan dari eksekusi klausul Pilar 3.',
    summary: 'Menjamin reputasi bisnis Dasaria tetap terjaga sekalipun pusat data utama mati mendadak.',
    points: [
      'RTO dicapai 45 menit (standar bank 60 menit).',
      'Uptime 99.9% setara maksimal downtime 43 menit per bulan.'
    ]
  },

  'okr3': {
    hakikat: 'Target keamanan operasional transaksi harian untuk mencegah kebocoran dana dan peretasan akun internal.',
    turunan: [
      'KR 3.1: 100% transaksi pencairan dana tercatat lewat alur Maker-Checker-Approver tanpa celah tunggal',
      'KR 3.2: 0 kasus password tertinggal di repositori Git lewat pemindaian otomatis harian',
      'KR 3.3: 100% akses VPN dan akun admin terlindungi oleh verifikasi dua langkah (MFA)'
    ],
    sumber: 'BRD Bab 6 - Target 3.',
    example: 'Audit trail database transaksi dan laporan pemindaian repositori bebas rahasia.',
    dependensi: 'Dihasilkan dari eksekusi klausul Pilar 1 dan Pilar 2.',
    summary: 'Menutup seluruh celah pengkhianatan orang dalam dan pencurian kredensial.',
    points: [
      'Maker dilarang keras klik Approve secara teknis.',
      'Zero password di kodingan dijamin oleh scanner CI/CD.'
    ]
  },

  'golive': {
    hakikat: 'Tonggak pencapaian akhir berupa pembukaan pintu gerbang produksi API SNAP BCA untuk transaksi pembayaran dan transfer dana nyata.',
    turunan: [
      'Penandatanganan Berita Acara Go-Live resmi antara Dasaria dan BCA',
      'Pemberian kredensial Client ID & Client Secret produksi dari portal pengembang BCA',
      'Pertukaran Public Key RSA 2048 produksi',
      'Pemantauan intensif transaksi hari pertama (hyper-care support)'
    ],
    sumber: 'Surat Persetujuan Integrasi Produksi API BCA & Izin PJP Bank Indonesia.',
    example: 'Transaksi penerimaan dan pencairan dana perdana sukses tercatat di rekening BCA.',
    dependensi: 'Membutuhkan persetujuan akhir dari Direksi BCA dan kepatuhan penuh atas 22 syarat.',
    summary: 'Integrasi perbankan resmi beroperasi secara sah, aman, dan patuh hukum.',
    points: [
      'Dilakukan setelah seluruh OKR 1, 2, dan 3 terpenuhi.',
      'Membuka potensi bisnis otomatisasi pembayaran Dasaria secara masif.'
    ]
  },

  /* ============ ALIRAN BIAYA & MANAJEMEN RISIKO ============ */
  'g-fin': {
    hakikat: 'Pemetaan pengeluaran finansial antara investasi awal (Capex) untuk membangun fondasi dan biaya operasional rutin (Opex) untuk menjaga keamanan tetap menyala.',
    turunan: [
      'Investasi Awal (Capex): Jasa Pentest, Kantor Audit CISA, Setup DRC',
      'Biaya Operasional (Opex): Sewa Server DRC, WAF & Anti-DDoS, TLS Tahunan, Storage WORM, Retest Tahunan'
    ],
    sumber: 'Bab 4 BRD-DASARIA-SEC-2026-003-ADHD.',
    example: 'Rencana Anggaran Biaya (RAB) Proyek Keamanan Sistem SNAP BCA.',
    dependensi: 'Disetujui oleh Direktur Keuangan dan Manajemen IT Dasaria.',
    summary: 'Transparansi anggaran agar manajemen memahami kapan uang modal keluar dan berapa biaya sewa rutin.',
    points: [
      'Capex keluar sekali di awal (Bulan 1 hingga 3).',
      'Opex dianggarkan dalam biaya operasional bulanan dan tahunan.'
    ]
  },

  'capex': {
    hakikat: 'Pengeluaran modal yang dibayarkan satu kali di depan untuk mempersiapkan sistem dan memperoleh sertifikasi awal kelayakan produksi.',
    turunan: [
      'Jasa Penetration Testing Pra-Rilis oleh lembaga berlisensi CREST/OSCP',
      'Jasa Audit IT Independen Kepatuhan SNAP BI oleh kantor auditor CISA resmi',
      'Biaya pemasangan dan konfigurasi awal replikasi database ke server DRC cloud'
    ],
    sumber: 'BRD Bab 4 - Investasi Awal (Capex).',
    example: 'Invoice kontrak vendor pentest dan kantor audit IT independen.',
    dependensi: 'Dialokasikan pada anggaran proyek Q4 2026.',
    summary: 'Investasi fondasi mutlak untuk mendapatkan surat izin go-live dari BCA.',
    points: [
      'Kunci kontrak sejak Bulan 1 untuk mengamankan harga dan jadwal.',
      'Melindungi perusahaan dari risiko denda hukum yang jauh lebih besar.'
    ]
  },

  'opex': {
    hakikat: 'Biaya operasional berkelanjutan yang dibayarkan setiap bulan atau tahun untuk menjaga peladen tetap hidup dan izin koneksi bank tidak dicabut.',
    turunan: [
      'Sewa server cadangan (DRC) di cloud terpisah (bulanan)',
      'Langganan Web Application Firewall (WAF) & proteksi Anti-DDoS (bulanan)',
      'Pembelian perpanjangan sertifikat TLS komersial dari CA publik (tahunan)',
      'Sewa kapasitas penyimpanan arsip dingin WORM 10 tahun (bulanan)',
      'Kontrak pengujian penetrasi dan audit IT ulang berkala (tahunan)'
    ],
    sumber: 'BRD Bab 4 - Biaya Operasional (Opex).',
    example: 'Tagihan bulanan cloud provider, invoice WAF, dan perpanjangan sertifikat SSL tahunan.',
    dependensi: 'Dimasukkan ke dalam anggaran operasional rutin divisi IT.',
    summary: 'Keamanan sistem perbankan bukan acara sekali selesai, melainkan proses perlindungan berkesinambungan.',
    points: [
      'BCA mewajibkan audit dan pentest ulang tiap tahun agar izin tidak dicabut.',
      'Gunakan DRC berukuran kecil (warm-standby) untuk efisiensi biaya bulanan.'
    ]
  },

  'g-risk': {
    hakikat: 'Identifikasi potensi kendala di lapangan beserta strategi antisipasi teruji agar jadwal peluncuran sistem tidak terhambat.',
    turunan: [
      'Risiko Keluhan Staf atas Alur Maker-Checker',
      'Risiko Temuan Banyak Celah pada Tahap Pentest',
      'Risiko Pembengkakan Biaya Server Cadangan (DRC)',
      'Risiko Transaksi Nasabah Jujur Tertahan Mesin FDS (False Positive)',
      'Risiko Antrean Panjang Kantor Auditor Eksternal'
    ],
    sumber: 'Bab 5 BRD-DASARIA-SEC-2026-003-ADHD.',
    example: 'Matriks Mitigasi Risiko Proyek IT Dasaria.',
    dependensi: 'Ditinjau berkala dalam rapat koordinasi mingguan manajemen.',
    summary: 'Rencana pencegahan dini agar proyek selesai tepat waktu dalam 3 bulan.',
    points: [
      'Fokus pada kenyamanan pengguna tanpa mengorbankan standar bank.',
      'Scan mandiri sejak awal kodingan mencegah kepanikan saat pentest vendor.'
    ]
  },

  'risk-user': {
    hakikat: 'Staf keuangan dan operasional mengeluhkan proses transfer menjadi lebih lambat akibat harus melewati 3 meja persetujuan.',
    turunan: [
      'Rancang antarmuka formulir yang bersih dan tombol approval yang mudah diakses',
      'Edukasi staf bahwa aturan ini melindungi mereka dari tuduhan fitnah jika terjadi kehilangan saldo',
      'Sediakan alur darurat berbasis tiket kerja resmi untuk transaksi mendesak'
    ],
    sumber: 'BRD Bab 5 - Risiko 1.',
    example: 'Pelatihan singkat operasional dan panduan satu lembar alur Maker-Checker.',
    dependensi: 'Disosialisasikan oleh Tim Analis Sistem ke Divisi Keuangan.',
    summary: 'Mengubah paradigma bahwa kontrol internal adalah pelindung kerja staf, bukan beban birokrasi.',
    points: [
      'Tolak jalan pintas (bypass) tanpa persetujuan pimpinan.',
      'Formulir dirancang satu layar tanpa scroll berbelit-belit.'
    ]
  },

  'risk-vuln': {
    hakikat: 'Jadwal peluncuran molor berminggu-minggu karena programmer kewalahan menambal puluhan celah keamanan yang ditemukan vendor pentest.',
    turunan: [
      'Terapkan pemindaian celah mandiri (SAST) sejak hari pertama pembuatan kode',
      'Wajibkan peer review Pull Request oleh programmer senior',
      'Jangan menunggu vendor pentest datang baru panik memeriksa kode'
    ],
    sumber: 'BRD Bab 5 - Risiko 2.',
    example: 'Laporan pemindaian mingguan SAST internal yang menunjukkan tren penurunan celah.',
    dependensi: 'Tanggung jawab Lead Developer dan Tim Software Engineer.',
    summary: 'Mendeteksi dan menambal celah sejak dini di lingkungan lokal lebih murah dan cepat.',
    points: [
      'Gunakan checklist OWASP Top 10 sebagai acuan koding.',
      'Sediakan waktu khusus (buffer sprint) untuk remediasi celah.'
    ]
  },

  'risk-drc': {
    hakikat: 'Biaya sewa server cadangan di cloud membengkak padahal volume transaksi sistem masih dalam tahap awal.',
    turunan: [
      'Gunakan strategi Warm-Standby: pasang server cadangan ukuran kecil dengan replikasi DB kontinu',
      'Server cadangan hanya diubah ke spesifikasi besar secara otomatis saat server utama mati',
      'Pilih penyedia cloud alternatif dengan skema penagihan bayar-sesuai-pakai'
    ],
    sumber: 'BRD Bab 5 - Risiko 3.',
    example: 'Skema arsitektur DRC Warm-Standby dengan script auto-scaling failover.',
    dependensi: 'Dikoordinasikan oleh Cloud Architect dan Manajer Keuangan.',
    summary: 'Memenuhi syarat kepatuhan RTO/RPO 1 jam bank tanpa menguras kas perusahaan.',
    points: [
      'Biaya DRC hemat hingga 60% dibanding sistem active-active.',
      'Database tetap tersinkronisasi kontinu tanpa jeda.'
    ]
  },

  'risk-fds': {
    hakikat: 'Transaksi nasabah yang sah ikut tertahan oleh mesin FDS sehingga menimbulkan komplain dan kemarahan nasabah.',
    turunan: [
      'Terapkan parameter batas FDS secara bertahap dan moderat di awal peluncuran',
      'Sediakan dashboard verifikasi cepat bagi staf untuk melepas transaksi tertahan dalam hitungan menit',
      'Kirim notifikasi konfirmasi otomatis via SMS atau WhatsApp ke nasabah'
    ],
    sumber: 'BRD Bab 5 - Risiko 4.',
    example: 'Dashboard antrean investigasi FDS dengan tombol pelepasan instan bertanda tangan digital staf.',
    dependensi: 'Dikelola oleh Tim Operasional Transaksi dan Analis Fraud.',
    summary: 'Menjaga keseimbangan antara keamanan ketat dan kenyamanan pengalaman nasabah.',
    points: [
      'Notifikasi konfirmasi dikirim otomatis dalam 5 detik pasca tahan.',
      'Analisis log false-positive mingguan untuk menyempurnakan rumus FDS.'
    ]
  },

  'risk-audit': {
    hakikat: 'Jadwal go-live molor berbulan-bulan karena jadwal kantor auditor CISA dan vendor pentest penuh antrean proyek perbankan lain.',
    turunan: [
      'Kunci kontrak kerja sama dan pesan slot pemeriksaan sejak Bulan 1 proyek berjalan',
      'Siapkan 22 berkas bukti fisik dalam satu map terstruktur sejak dini agar auditor tidak perlu meminta ulang',
      'Tunjuk satu narahubung teknis internal yang siap mendampingi auditor setiap hari'
    ],
    sumber: 'BRD Bab 5 - Risiko 5.',
    example: 'Jadwal kalender audit yang telah ditandatangani bersama kantor auditor eksternal.',
    dependensi: 'Dikelola oleh Manajer Proyek dan Manajemen IT.',
    summary: 'Mencegah hambatan administratif di akhir masa peluncuran sistem.',
    points: [
      'Pesan jadwal pentest minimal 45 hari sebelum tanggal target.',
      'Map 22 bukti fisik siap diakses secara digital oleh auditor.'
    ]
  }
};
