/* =========================================================
   Garis penghubung roadmap Kepatuhan Keamanan API SNAP BCA.
   Setiap garis punya:
     from, to  → data-id di index.html
     style     → 's' (solid) | 'd' (dashed)
     arrow     → true / false
     route     → fungsi (R, W) yang mengembalikan titik [x, y]
     label     → teks opsional pada garis
     edgeType  → kelas semantik (main, p1, p2, p3, p4, phase, okr, fin)
   ========================================================= */
(function () {
  'use strict';

  // Lurus ke bawah dari titik bawah tengah a ke titik atas tengah b
  const drop = (a, b) => [[a.cx, a.b], [a.cx, b.t]];

  // Turun dari a ke b; belok di mid (koordinat y)
  const vv = (a, b, mid) => {
    if (Math.abs(a.cx - b.cx) < 2) return [[a.cx, a.b], [a.cx, b.t]];
    const m = mid == null ? (a.b + b.t) / 2 : mid;
    return [[a.cx, a.b], [a.cx, m], [b.cx, m], [b.cx, b.t]];
  };

  // Horizontal dari kanan a ke kiri b
  const hh = (a, b) => {
    if (Math.abs(a.cy - b.cy) < 2) return [[a.r, a.cy], [b.l, b.cy]];
    const m = (a.r + b.l) / 2;
    return [[a.r, a.cy], [m, a.cy], [m, b.cy], [b.l, b.cy]];
  };

  const E = [];
  const add = (from, to, style, arrow, route, extra) =>
    E.push(Object.assign({ from, to, style, arrow, route }, extra || {}));

  /* ---------- Judul → Arsitektur Hub ---------- */
  add('title', 'hub', 's', true, (R) => drop(R('title'), R('hub')), { edgeType: 'main' });

  /* ---------- Hub → 4 Pilar Utama ---------- */
  add('hub', 'pilar1', 's', true, (R) => {
    const h = R('hub'), p = R('pilar1');
    const midY = h.b + 28;
    return [[h.cx - 160, h.b], [h.cx - 160, midY], [p.cx, midY], [p.cx, p.t]];
  }, { edgeType: 'p1', label: 'Pilar 1 (5 Klausul)' });

  add('hub', 'pilar2', 's', true, (R) => {
    const h = R('hub'), p = R('pilar2');
    const midY = h.b + 28;
    return [[h.cx - 50, h.b], [h.cx - 50, midY], [p.cx, midY], [p.cx, p.t]];
  }, { edgeType: 'p2', label: 'Pilar 2 (5 Klausul)' });

  add('hub', 'pilar3', 's', true, (R) => {
    const h = R('hub'), p = R('pilar3');
    const midY = h.b + 28;
    return [[h.cx + 50, h.b], [h.cx + 50, midY], [p.cx, midY], [p.cx, p.t]];
  }, { edgeType: 'p3', label: 'Pilar 3 (8 Klausul)' });

  add('hub', 'pilar4', 's', true, (R) => {
    const h = R('hub'), p = R('pilar4');
    const midY = h.b + 28;
    return [[h.cx + 160, h.b], [h.cx + 160, midY], [p.cx, midY], [p.cx, p.t]];
  }, { edgeType: 'p4', label: 'Pilar 4 (4 Klausul)' });

  /* ---------- Pilar 1: Aturan Orang & Akses (Rantai Vertikal) ---------- */
  add('pilar1', 'pt23', 's', true, (R) => drop(R('pilar1'), R('pt23')), { edgeType: 'p1' });
  add('pt23', 'pt24', 's', true, (R) => drop(R('pt23'), R('pt24')), { edgeType: 'p1' });
  add('pt24', 'pt25', 's', true, (R) => drop(R('pt24'), R('pt25')), { edgeType: 'p1' });
  add('pt25', 'pt26', 's', true, (R) => drop(R('pt25'), R('pt26')), { edgeType: 'p1' });
  add('pt26', 'pt27', 's', true, (R) => drop(R('pt26'), R('pt27')), { edgeType: 'p1' });

  /* ---------- Pilar 2: Benteng Kodingan & Kunci (Rantai Vertikal) ---------- */
  add('pilar2', 'pt14', 's', true, (R) => drop(R('pilar2'), R('pt14')), { edgeType: 'p2' });
  add('pt14', 'pt17', 's', true, (R) => drop(R('pt14'), R('pt17')), { edgeType: 'p2' });
  add('pt17', 'is5a', 's', true, (R) => drop(R('pt17'), R('is5a')), { edgeType: 'p2' });
  add('is5a', 'pt28', 's', true, (R) => drop(R('is5a'), R('pt28')), { edgeType: 'p2' });
  add('pt28', 'pt20', 's', true, (R) => drop(R('pt28'), R('pt20')), { edgeType: 'p2' });

  /* ---------- Pilar 3: Ketahanan Server & Bencana (2 Sub-Grup) ---------- */
  add('pilar3', 'pt4', 's', true, (R) => {
    const p = R('pilar3'), c = R('pt4');
    const midY = p.b + 18;
    return [[p.cx - 180, p.b], [p.cx - 180, midY], [c.cx, midY], [c.cx, c.t]];
  }, { edgeType: 'p3', label: 'Proteksi Server' });

  add('pilar3', 'pt21', 's', true, (R) => {
    const p = R('pilar3'), c = R('pt21');
    const midY = p.b + 18;
    return [[p.cx + 180, p.b], [p.cx + 180, midY], [c.cx, midY], [c.cx, c.t]];
  }, { edgeType: 'p3', label: 'Audit & Bencana' });

  // Subgrup 3A
  add('pt4', 'is3', 's', true, (R) => drop(R('pt4'), R('is3')), { edgeType: 'p3' });
  add('is3', 'pt18', 's', true, (R) => drop(R('is3'), R('pt18')), { edgeType: 'p3' });
  add('pt18', 'pt19', 's', true, (R) => drop(R('pt18'), R('pt19')), { edgeType: 'p3' });

  // Subgrup 3B
  add('pt21', 'pt22', 's', true, (R) => drop(R('pt21'), R('pt22')), { edgeType: 'p3' });
  add('pt22', 'pt5', 's', true, (R) => drop(R('pt22'), R('pt5')), { edgeType: 'p3' });
  add('pt5', 'pt11', 's', true, (R) => drop(R('pt5'), R('pt11')), { edgeType: 'p3' });

  /* ---------- Pilar 4: Bukti Lembaga Luar & Sertifikasi ---------- */
  add('pilar4', 'pt15', 's', true, (R) => drop(R('pilar4'), R('pt15')), { edgeType: 'p4' });
  add('pt15', 'pt6', 's', true, (R) => drop(R('pt15'), R('pt6')), { edgeType: 'p4' });
  add('pt6', 'pt16', 's', true, (R) => drop(R('pt6'), R('pt16')), { edgeType: 'p4' });
  add('pt16', 'pt3', 's', true, (R) => drop(R('pt16'), R('pt3')), { edgeType: 'p4' });

  /* ---------- Peta Jalan 3 Bulan (B1 → B2 → B3) ---------- */
  add('b1', 'b2', 's', true, (R) => hh(R('b1'), R('b2')), { edgeType: 'phase', label: 'Bulan 2 (Koding & DRC)' });
  add('b2', 'b3', 's', true, (R) => hh(R('b2'), R('b3')), { edgeType: 'phase', label: 'Bulan 3 (Audit & Go-Live)' });

  /* ---------- Alur Pilar ke Timeline ---------- */
  add('pt27', 'b1', 'd', true, (R) => {
    const a = R('pt27'), b = R('b1');
    const midY = (a.b + b.t) / 2;
    return [[a.cx, a.b], [a.cx, midY], [b.cx, midY], [b.cx, b.t]];
  }, { edgeType: 'p1', label: 'Selesai di Bulan 1' });

  add('pt20', 'b2', 'd', true, (R) => {
    const a = R('pt20'), b = R('b2');
    const midY = (a.b + b.t) / 2;
    return [[a.cx, a.b], [a.cx, midY], [b.cx, midY], [b.cx, b.t]];
  }, { edgeType: 'p2', label: 'Selesai di Bulan 2' });

  add('pt19', 'b2', 'd', true, (R) => {
    const a = R('pt19'), b = R('b2');
    const midY = (a.b + b.t) / 2;
    return [[a.cx, a.b], [a.cx, midY], [b.cx + 60, midY], [b.cx + 60, b.t]];
  }, { edgeType: 'p3', label: 'Sekat & DRC Bulan 2' });

  add('pt3', 'b3', 'd', true, (R) => {
    const a = R('pt3'), b = R('b3');
    const midY = (a.b + b.t) / 2;
    return [[a.cx, a.b], [a.cx, midY], [b.cx, midY], [b.cx, b.t]];
  }, { edgeType: 'p4', label: 'Audit CISA di Bulan 3' });

  /* ---------- Timeline → OKR Target Sukses ---------- */
  add('b3', 'okr1', 's', true, (R) => {
    const a = R('b3'), b = R('okr1');
    return [[a.r, a.cy], [b.l, b.cy]];
  }, { edgeType: 'phase', label: 'Pencapaian Kepatuhan' });

  /* ---------- OKR → Gerbang Go-Live BCA Produksi ---------- */
  add('okr1', 'golive', 's', true, (R) => drop(R('okr1'), R('golive')), { edgeType: 'okr', label: '100% Bukti Fisik' });
  add('okr2', 'golive', 's', true, (R) => {
    const a = R('okr2'), b = R('golive');
    const midX = (a.l + b.r) / 2;
    return [[a.l, a.cy], [midX, a.cy], [midX, b.cy - 12], [b.r, b.cy - 12]];
  }, { edgeType: 'okr', label: 'RTO < 45 Mnt' });
  add('okr3', 'golive', 's', true, (R) => {
    const a = R('okr3'), b = R('golive');
    const midX = (a.l + b.r) / 2;
    return [[a.l, a.cy], [midX, a.cy], [midX, b.cy + 12], [b.r, b.cy + 12]];
  }, { edgeType: 'okr', label: 'Nol Penipuan' });

  /* ---------- Dependensi Kritis Silang (Cross-Cutting Checks) ---------- */
  add('pt25', 'okr3', 'd', true, (R) => {
    const a = R('pt25'), b = R('okr3');
    const y0 = a.cy;
    return [[a.r, y0], [a.r + 30, y0], [a.r + 30, b.cy - 15], [b.l, b.cy - 15]];
  }, { edgeType: 'p1', label: 'Maker-Checker' });

  add('is5a', 'pt16', 'd', true, (R) => {
    const a = R('is5a'), b = R('pt16');
    const midY = a.cy;
    return [[a.r, midY], [b.l - 40, midY], [b.l - 40, b.cy], [b.l, b.cy]];
  }, { edgeType: 'p2', label: 'Zero Hardcoding' });

  add('pt5', 'okr2', 'd', true, (R) => {
    const a = R('pt5'), b = R('okr2');
    const midY = (a.b + b.t) / 2;
    return [[a.cx, a.b], [a.cx, midY], [b.cx, midY], [b.cx, b.t]];
  }, { edgeType: 'p3', label: 'DRC Replikasi' });

  /* ---------- Finansial (Capex & Opex) ---------- */
  add('capex', 'b1', 'd', true, (R) => {
    const a = R('capex'), b = R('b1');
    return [[a.r, a.cy], [b.l, b.cy]];
  }, { edgeType: 'fin', label: 'Modal Awal' });

  add('opex', 'golive', 'd', true, (R) => {
    const a = R('opex'), b = R('golive');
    const midY = a.b + 20;
    return [[a.cx, a.b], [a.cx, midY], [b.cx - 60, midY], [b.cx - 60, b.b]];
  }, { edgeType: 'fin', label: 'Biaya Berjalan' });

  window.ROADMAP_EDGES = E;
})();
