# -*- coding: utf-8 -*-

html_path = r"E:\WORKSPACE\PROJECT\WEB-APPS\NAREKA\projects\roadmap-kompetensi-organisasi.html"

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

# -------------------------------------------------------------
# 1. Update viewBox to 1340 x 2220 to comfortably accommodate the 3 new nodes
# -------------------------------------------------------------
html = html.replace('viewBox="0 0 1340 2120"', 'viewBox="0 0 1340 2220"')

# -------------------------------------------------------------
# 2. Update Jalur Kiri DWP: Tambah node Job Family Core Practices di bawah group-JF
# group-JF berakhir di Y=960.
# Tambahkan node-JF_CP di Y=975..1015 (lebar 440, center X=280)
# Garis JF -> JF_CP di X=280 (Y=960 -> Y=975)
# -------------------------------------------------------------
old_jf_block = '''          <g class="node-elem" id="node-JF_4" onclick="openDrawer('JF_4')">
            <rect x="285" y="928" width="205" height="24" rx="4" fill="#fef08a" stroke="#18181b" stroke-width="1.2" />
            <text class="txt-sub" x="387" y="940" font-size="10">Target Profisiensi Level 1–5</text>
          </g>
        </g>'''

new_jf_block = '''          <g class="node-elem" id="node-JF_4" onclick="openDrawer('JF_4')">
            <rect x="285" y="928" width="205" height="24" rx="4" fill="#fef08a" stroke="#18181b" stroke-width="1.2" />
            <text class="txt-sub" x="387" y="940" font-size="10">Target Profisiensi Level 1–5</text>
          </g>
        </g>

        <!-- Node Baru Jalur Kiri: Job Family Core Practices (Eksekusi KSAO Nilai Bersama) -->
        <g class="node-elem" id="node-JF_CP" onclick="openDrawer('JF_CP')">
          <rect x="60" y="975" width="440" height="42" rx="7" fill="#facc15" stroke="#18181b" stroke-width="2" />
          <text class="txt-title" x="280" y="996" font-size="12.5">Job Family Core Practices</text>
        </g>'''

if old_jf_block in html:
    html = html.replace(old_jf_block, new_jf_block)
    print("Added node-JF_CP under Job Family")
else:
    print("Warning: old_jf_block not found")

# Konektor dari group-JF (Y=960) ke node-JF_CP (Y=975)
html = html.replace(
    '<!-- ALUR DARI KONTAINER DIRECTORATE KNOWLEDGE KE JOB FAMILY -->\n        <path class="line-spine" d="M 280 788 L 280 820" marker-end="url(#arrow-blue)" />',
    '<!-- ALUR DARI KONTAINER DIRECTORATE KNOWLEDGE KE JOB FAMILY -->\n        <path class="line-spine" d="M 280 788 L 280 820" marker-end="url(#arrow-blue)" />\n        <path class="line-spine" d="M 280 960 L 280 975" marker-end="url(#arrow-blue)" />'
)

# -------------------------------------------------------------
# 3. Update Jalur Kanan DWP:
# A. Tambah node Value-Based Leadership di bawah group-KM (Y=840..882, X=540..850, center X=695)
# B. Tambah node Functional Value Execution di bawah group-KF (Y=840..882, X=870..1280, center X=1075)
# -------------------------------------------------------------
old_km_kf_blocks = '''          <g class="node-elem" id="node-KM_5" onclick="openDrawer('KM_5')">
            <rect x="552" y="780" width="286" height="23" rx="4" fill="#f8fafc" stroke="#18181b" stroke-width="1.2" />
            <text class="txt-sub" x="695" y="792" font-size="10">Arah Kerja Strategis</text>
          </g>
        </g>

        <!-- CABANG 2 KNOWLEDGE JOB: Knowledge Fungsional (16 Elemen DWP dalam 2 Kolom) -->
        <g id="group-KF">'''

new_km_kf_blocks = '''          <g class="node-elem" id="node-KM_5" onclick="openDrawer('KM_5')">
            <rect x="552" y="780" width="286" height="23" rx="4" fill="#f8fafc" stroke="#18181b" stroke-width="1.2" />
            <text class="txt-sub" x="695" y="792" font-size="10">Arah Kerja Strategis</text>
          </g>
        </g>

        <!-- Node Baru Managerial: Value-Based Leadership -->
        <g class="node-elem" id="node-KM_VBL" onclick="openDrawer('KM_VBL')">
          <rect x="540" y="840" width="310" height="42" rx="7" fill="#facc15" stroke="#18181b" stroke-width="2" />
          <text class="txt-title" x="695" y="861" font-size="12.5">Value-Based Leadership</text>
        </g>

        <!-- CABANG 2 KNOWLEDGE JOB: Knowledge Fungsional (16 Elemen DWP dalam 2 Kolom) -->
        <g id="group-KF">'''

if old_km_kf_blocks in html:
    html = html.replace(old_km_kf_blocks, new_km_kf_blocks)
    print("Added node-KM_VBL under group-KM")
else:
    print("Warning: old_km_kf_blocks not found")

old_kf_end = '''          <g class="node-elem" id="node-KF_16" onclick="openDrawer('KF_16')">
            <rect x="1078" y="794" width="194" height="17" rx="3" fill="#f8fafc" stroke="#18181b" stroke-width="1" />
            <text class="txt-sub" x="1175" y="802" font-size="8.5">16. Pendidikan/Pengalaman</text>
          </g>
        </g>'''

new_kf_end = '''          <g class="node-elem" id="node-KF_16" onclick="openDrawer('KF_16')">
            <rect x="1078" y="794" width="194" height="17" rx="3" fill="#f8fafc" stroke="#18181b" stroke-width="1" />
            <text class="txt-sub" x="1175" y="802" font-size="8.5">16. Pendidikan/Pengalaman</text>
          </g>
        </g>

        <!-- Node Baru Fungsional: Functional Value Execution -->
        <g class="node-elem" id="node-KF_FVE" onclick="openDrawer('KF_FVE')">
          <rect x="870" y="840" width="410" height="42" rx="7" fill="#facc15" stroke="#18181b" stroke-width="2" />
          <text class="txt-title" x="1075" y="861" font-size="12.5">Functional Value Execution</text>
        </g>'''

if old_kf_end in html:
    html = html.replace(old_kf_end, new_kf_end)
    print("Added node-KF_FVE under group-KF")
else:
    print("Warning: old_kf_end not found")

# -------------------------------------------------------------
# 4. Update konektor konvergensi:
# Dari group-KM (Y=825) turun ke node-KM_VBL (Y=840)
# Dari group-KF (Y=825) turun ke node-KF_FVE (Y=840)
# Bus bar konvergensi kini berada di Y=1035:
# - Dari node-JF_CP (Y=1017) turun ke Y=1035 di X=280
# - Dari node-KM_VBL (Y=882) turun ke Y=1035 di X=695
# - Dari node-KF_FVE (Y=882) turun ke Y=1035 di X=1075
# Garis bus bar horizontal Y=1035 (X=280..1075)
# Lalu turun di X=672 dari Y=1035 ke Y=1065 masuk ke DOMAIN LMS
# -------------------------------------------------------------
old_convergence_connectors = '''        <!-- KONVERGENSI DWP KE LMS (Orthogonal Bus):
             Setelah bagian Job Family, Managerial, dan Fungsional selesai,
             ketiganya mengalir lanjut ke Learning Requirement di Domain LMS -->
        <path class="line-spine" d="M 280 960 L 280 985" />
        <path class="line-spine" d="M 695 825 L 695 985" />
        <path class="line-spine" d="M 1075 825 L 1075 985" />
        <!-- Garis Bus Horizontal Konvergensi -->
        <path class="line-spine" d="M 280 985 L 1075 985" />
        <!-- Alur Bersama Masuk ke Header LMS -->
        <path class="line-spine" d="M 672 985 L 672 1015" marker-end="url(#arrow-blue)" />'''

new_convergence_connectors = '''        <!-- ALUR DARI PARENT KE 3 NODE EKSEKUSI NILAI KSAO -->
        <path class="line-spine" d="M 695 825 L 695 840" marker-end="url(#arrow-blue)" />
        <path class="line-spine" d="M 1075 825 L 1075 840" marker-end="url(#arrow-blue)" />

        <!-- KONVERGENSI DWP KE LMS (Orthogonal Bus):
             Setelah bagian Job Family Core Practices, Value-Based Leadership,
             dan Functional Value Execution selesai, ketiganya mengalir lanjut ke Domain LMS -->
        <path class="line-spine" d="M 280 1017 L 280 1035" />
        <path class="line-spine" d="M 695 882 L 695 1035" />
        <path class="line-spine" d="M 1075 882 L 1075 1035" />
        <!-- Garis Bus Horizontal Konvergensi -->
        <path class="line-spine" d="M 280 1035 L 1075 1035" />
        <!-- Alur Bersama Masuk ke Header LMS -->
        <path class="line-spine" d="M 672 1035 L 672 1065" marker-end="url(#arrow-blue)" />'''

if old_convergence_connectors in html:
    html = html.replace(old_convergence_connectors, new_convergence_connectors)
    print("Updated convergence connectors to LMS")
else:
    print("Warning: old_convergence_connectors not found")

# -------------------------------------------------------------
# 5. Geser posisi vertikal DOMAIN LMS dan DOMAIN UJI KOMPETENSI ke bawah 50px
# Container DOMAIN LMS: y=1015 -> y=1065 (height 465) -> bottom=1530
# Header UK: y=1505 -> y=1555
# node-LA: y=1565 -> y=1615
# nodes-LA-standalone: y=1555..1682 -> y=1605..1732
# node-AS: y=1740 -> y=1790
# group-AS-KSAO: y=1725..2042 -> y=1775..2092
# Dan konektor UK disesuaikan
# -------------------------------------------------------------

# Geser container-DOMAIN-LMS
old_lms_container = '<g id="container-DOMAIN-LMS">\n          <!-- Kotak Kontainer Besar Pembungkus Seluruh Domain LMS -->\n          <rect x="60" y="1015" width="1225" height="465"'
new_lms_container = '<g id="container-DOMAIN-LMS">\n          <!-- Kotak Kontainer Besar Pembungkus Seluruh Domain LMS -->\n          <rect x="60" y="1065" width="1225" height="465"'
html = html.replace(old_lms_container, new_lms_container)
html = html.replace('<rect x="60" y="1015" width="1225" height="36" rx="12" fill="#2563eb" />\n          <text x="672" y="1033"', '<rect x="60" y="1065" width="1225" height="36" rx="12" fill="#2563eb" />\n          <text x="672" y="1083"')

# Geser elemen internal LMS (+50px)
html = html.replace('<rect x="80" y="1075" width="340" height="50"', '<rect x="80" y="1125" width="340" height="50"')
html = html.replace('<text class="txt-title" x="250" y="1100"', '<text class="txt-title" x="250" y="1150"')

html = html.replace('<rect x="460" y="1065" width="810" height="270"', '<rect x="460" y="1115" width="810" height="270"')
html = html.replace('<rect x="460" y="1065" width="810" height="24"', '<rect x="460" y="1115" width="810" height="24"')
html = html.replace('<text class="txt-group-header" x="865" y="1077"', '<text class="txt-group-header" x="865" y="1127"')

html = html.replace('y="1097"', 'y="1147"')
html = html.replace('y="1113"', 'y="1163"')
html = html.replace('y="1136"', 'y="1186"')
html = html.replace('y="1152"', 'y="1202"')
html = html.replace('y="1175"', 'y="1225"')
html = html.replace('y="1191"', 'y="1241"')
html = html.replace('y="1214"', 'y="1264"')
html = html.replace('y="1230"', 'y="1280"')
html = html.replace('y="1253"', 'y="1303"')
html = html.replace('y="1269"', 'y="1319"')
html = html.replace('y="1312"', 'y="1362"')

html = html.replace('<rect x="80" y="1375" width="340" height="50"', '<rect x="80" y="1425" width="340" height="50"')
html = html.replace('<text class="txt-title" x="250" y="1400"', '<text class="txt-title" x="250" y="1450"')

html = html.replace('<rect x="460" y="1365" width="810" height="70"', '<rect x="460" y="1415" width="810" height="70"')
html = html.replace('<rect x="460" y="1365" width="810" height="22"', '<rect x="460" y="1415" width="810" height="22"')
html = html.replace('<text class="txt-group-header" x="865" y="1376"', '<text class="txt-group-header" x="865" y="1426"')

html = html.replace('y="1395"', 'y="1445"')
html = html.replace('y="1410"', 'y="1460"')

html = html.replace('d="M 250 1125 L 250 1375"', 'd="M 250 1175 L 250 1425"')
html = html.replace('d="M 420 1100 L 460 1100"', 'd="M 420 1150 L 460 1150"')
html = html.replace('d="M 420 1400 L 460 1400"', 'd="M 420 1450 L 460 1450"')

# Geser Domain Uji Kompetensi (+50px)
html = html.replace('<rect x="140" y="1505" width="280" height="34"', '<rect x="140" y="1555" width="280" height="34"')
html = html.replace('<text x="280" y="1522"', '<text x="280" y="1572"')

html = html.replace('<rect x="110" y="1565" width="340" height="50"', '<rect x="110" y="1615" width="340" height="50"')
html = html.replace('<text class="txt-title" x="280" y="1590"', '<text class="txt-title" x="280" y="1640"')

# Standalone nodes LA (+50px)
html = html.replace('y="1555"', 'y="1605"')
html = html.replace('y="1571"', 'y="1621"')
html = html.replace('y="1602"', 'y="1652"')
html = html.replace('y="1618"', 'y="1668"')
html = html.replace('y="1650"', 'y="1700"')
html = html.replace('y="1666"', 'y="1716"')

# Assessment node & containers (+50px)
html = html.replace('<rect x="110" y="1740" width="340" height="50"', '<rect x="110" y="1790" width="340" height="50"')
html = html.replace('<text class="txt-title" x="280" y="1765"', '<text class="txt-title" x="280" y="1815"')

html = html.replace('y="1725"', 'y="1775"')
html = html.replace('y="1738"', 'y="1788"')
html = html.replace('y="1762"', 'y="1812"')
html = html.replace('y="1775"', 'y="1825"')
html = html.replace('y="1789"', 'y="1839"')
html = html.replace('y="1805"', 'y="1855"')
html = html.replace('y="1824"', 'y="1874"')
html = html.replace('y="1838"', 'y="1888"')
html = html.replace('y="1854"', 'y="1904"')

html = html.replace('y="1774"', 'y="1824"')
html = html.replace('y="1788"', 'y="1838"')
html = html.replace('y="1808"', 'y="1858"')
html = html.replace('y="1822"', 'y="1872"')
html = html.replace('y="1842"', 'y="1892"')
html = html.replace('y="1856"', 'y="1906"')

html = html.replace('y="1890"', 'y="1940"')
html = html.replace('y="1903"', 'y="1953"')
html = html.replace('y="1927"', 'y="1977"')
html = html.replace('y="1940"', 'y="1990"')
html = html.replace('y="1954"', 'y="2004"')
html = html.replace('y="1970"', 'y="2020"')
html = html.replace('y="1989"', 'y="2039"')
html = html.replace('y="2003"', 'y="2053"')
html = html.replace('y="2019"', 'y="2069"')

html = html.replace('y="1939"', 'y="1989"')
html = html.replace('y="1953"', 'y="2003"')
html = html.replace('y="1973"', 'y="2023"')
html = html.replace('y="1987"', 'y="2037"')
html = html.replace('y="2007"', 'y="2057"')
html = html.replace('y="2021"', 'y="2071"')

# Sesuaikan konektor UK (+50px)
html = html.replace('d="M 250 1425 L 250 1490 L 280 1490 L 280 1505"', 'd="M 250 1475 L 250 1540 L 280 1540 L 280 1555"')
html = html.replace('d="M 280 1539 L 280 1565"', 'd="M 280 1589 L 280 1615"')

html = html.replace('d="M 450 1590 L 495 1590 L 495 1571 L 540 1571"', 'd="M 450 1640 L 495 1640 L 495 1621 L 540 1621"')
html = html.replace('d="M 495 1590 L 495 1618 L 540 1618"', 'd="M 495 1640 L 495 1668 L 540 1668"')
html = html.replace('d="M 840 1571 L 860 1571"', 'd="M 840 1621 L 860 1621"')
html = html.replace('d="M 840 1618 L 860 1618"', 'd="M 840 1668 L 860 1668"')
html = html.replace('d="M 495 1618 L 495 1666 L 700 1666"', 'd="M 495 1668 L 495 1716 L 700 1716"')

html = html.replace('d="M 280 1615 L 280 1740"', 'd="M 280 1665 L 280 1790"')

html = html.replace('d="M 450 1765 L 495 1765 L 495 1800 L 540 1800"', 'd="M 450 1815 L 495 1815 L 495 1850 L 540 1850"')
html = html.replace('d="M 495 1765 L 495 1965 L 540 1965"', 'd="M 495 1815 L 495 2015 L 540 2015"')

html = html.replace('d="M 110 1765 L 45 1765 L 45 1590 L 105 1590"', 'd="M 110 1815 L 45 1815 L 45 1640 L 105 1640"')
html = html.replace('y="1677"', 'y="1727"')

# -------------------------------------------------------------
# 6. Tambahkan data drawer untuk 3 node baru di roadmapData
# node-JF_CP, node-KM_VBL, node-KF_FVE
# -------------------------------------------------------------
new_entries_js = '''      "JF_CP": {
        title: "Job Family Core Practices",
        category: "DWP Direktorat (Eksekusi KSAO Nilai)",
        hakikat: "Penerapan metode kerja kolaboratif dan kebiasaan profesional bersama lintas kluster peran yang merepresentasikan nilai organisasi (seperti End-to-End Collaboration).",
        sumber: "Enterprise Competency Dictionary §2 (Tabel 2 & Tabel 3) & DWP Lintas Fungsi.",
        turunan: "• K (Knowledge): Mengetahui alur proses lintas fungsi, batas peran unit lain, standar SLA bersama, dan ketergantungan pekerjaan.<br>• S (Skill): Mengoordinasikan handoff, berkomunikasi efektif, memitigasi gesekan antar-unit, dan berbagi informasi secara proaktif.<br>• A (Ability): Melihat keterkaitan antarmasalah (systemic thinking) dan memahami perspektif fungsi lain.<br>• O (Other): Keterbukaan, orientasi kooperatif, dan kepedulian terhadap keberhasilan proses keseluruhan tanpa ego sektoral.",
        example: "Melibatkan fungsi terkait sejak awal perencanaan, menyerahkan data handoff yang lengkap dan akurat, serta menyelesaikan hambatan kerja secara musyawarah tanpa saling melempar kesalahan.",
        dependensi: "Diturunkan dari Job Family, menyuplai indikator perilaku kerja teramati ke Learning Requirement, dan dinilai pada instrumen evaluasi kolaborasi di Assessment."
      },
      "KM_VBL": {
        title: "Value-Based Leadership",
        category: "Knowledge Managerial (Eksekusi Nilai Kepemimpinan)",
        hakikat: "Perwujudan mandat kepemimpinan berbasis nilai luhur organisasi dalam mengarahkan orang lain, mengambil keputusan etis, dan mengelola dinamika unit kerja.",
        sumber: "Enterprise Competency Dictionary §1.4 (Tabel 2) & Pedoman Tata Kelola Kepemimpinan Korporat.",
        turunan: "• K (Knowledge): Memahami prinsip tata kelola kepemimpinan, kode etik manajerial, kerangka evaluasi performa, dan regulasi ketenagakerjaan.<br>• S (Skill): Memberikan coaching dan feedback objektif, mengalokasikan beban kerja tim secara adil, dan memfasilitasi resolusi konflik beretika.<br>• A (Ability): Ketajaman menimbang dampak keputusan strategis, ketenangan memimpin saat krisis, dan menyelaraskan target tim dengan visi korporasi.<br>• O (Other): Keteladanan integritas (walk the talk), kematangan emosional, keberanian moral menolak kompromi menyimpang, dan orientasi pemberdayaan manusia.",
        example: "Menunjukkan konsistensi antara kata dan perbuatan dalam penegakan aturan, mengevaluasi kinerja bawahan secara transparan tanpa favoritisme, dan mengambil tanggung jawab penuh saat terjadi kegagalan operasional.",
        dependensi: "Diturunkan dari Knowledge Managerial, mendikte silabus kepemimpinan berbasis nilai di LMS, dan diverifikasi melalui Wawancara BEI STAR serta laporan PAPI/DISC pada Assessment."
      },
      "KF_FVE": {
        title: "Functional Value Execution",
        category: "Knowledge Fungsional (Eksekusi Nilai Teknis)",
        hakikat: "Eksekusi integritas nilai, kepatuhan prosedur baku, dan presisi mutu hasil kerja nyata dalam pelaksanaan 16 elemen tugas teknis spesifik jabatan.",
        sumber: "Enterprise Competency Dictionary §1.3 (Tabel 2) & 16 Elemen Transformasi Data DWP.",
        turunan: "• K (Knowledge): Menguasai spesifikasi teknis peralatan, standar toleransi mutu (SLA), prosedur K3, dan regulasi baku operasional peran.<br>• S (Skill): Kemahiran mengoperasikan tools dan instrumen kerja spesifik sesuai langkah SOP tanpa memotong tahapan wajib (no shortcut).<br>• A (Ability): Kapasitas penalaran analitis mengurai anomali teknis (troubleshooting), ketelitian mikro, dan ketahanan berpikir di bawah tekanan target.<br>• O (Other): Kejujuran faktual dalam pelaporan data kerja (zero fraud), tanggung jawab penuh atas deliverable fisik, dan kehati-hatian terhadap risiko keselamatan kerja.",
        example: "Mencatat dan melaporkan hasil kerja secara jujur dan akurat sesuai kondisi riil, disiplin mematuhi prosedur K3 di lapangan, serta menyelesaikan pekerjaan hingga tuntas memenuhi spesifikasi mutu tanpa kompromi kualitas.",
        dependensi: "Diturunkan dari Knowledge Fungsional (16 elemen DWP), menjadi rubrik unjuk kerja pada Work Sample Test dan Observasi Lapangan Checklist di Assessment."
      },
'''

# Sisipkan sebelum "LR": {
if '"JF_CP":' not in html:
    lr_target = '      "LR": {'
    idx = html.find(lr_target)
    if idx != -1:
        html = html[:idx] + new_entries_js + html[idx:]
        print("Inserted new JS entries in roadmapData")

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html)

print("HTML update with 3 new nodes completed successfully.")
