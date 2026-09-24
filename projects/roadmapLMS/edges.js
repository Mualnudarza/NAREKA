/* =========================================================
   Garis penghubung roadmap.

   Setiap garis punya:
     from, to  → data-id di index.html
     style     → 's' garis penuh (--> / ---)   |  'd' putus-putus (-.-> / -.-)
     arrow     → true kalau ada kepala panah
     route     → fungsi (R, W) yang mengembalikan titik-titik [x, y]
                 R(id) = kotak elemen {l, t, r, b, cx, cy, w, h} dalam koordinat canvas
                 W     = lebar canvas
     label     → teks pada garis (opsional), vertical:true untuk teks tegak
   ========================================================= */
(function () {
  // Turun dari a ke b; kalau sumbu x-nya beda, patahkan di tengah (atau di `mid`).
  const vv = (a, b, mid) => {
    if (Math.abs(a.cx - b.cx) < 1.5) return [[a.cx, a.b], [a.cx, b.t]];
    const m = mid == null ? (a.b + b.t) / 2 : mid;
    return [[a.cx, a.b], [a.cx, m], [b.cx, m], [b.cx, b.t]];
  };
  // Lurus ke bawah dari titik tengah a menuju sisi atas b.
  const drop = (a, b) => [[a.cx, a.b], [a.cx, b.t]];

  const E = [];
  const add = (from, to, style, arrow, route, extra) =>
    E.push(Object.assign({ from, to, style, arrow, route }, extra || {}));

  /* ---------- Judul → Background Knowledge ---------- */
  add('title', 'bk', 's', true, (R) => drop(R('title'), R('bk')), { edgeType: 'main' });
  add('bk', 'req-org', 's', true, (R) => vv(R('bk'), R('req-org'), R('req-org').t - 26), { edgeType: 'main' });
  add('bk', 'req-dir', 's', true, (R) => vv(R('bk'), R('req-dir'), R('req-dir').t - 26), { edgeType: 'main' });

  /* ---------- Modal awal individu (Data Profil / Portofolio) ---------- */
  add('bk', 'modal-awal', 'd', true, (R) => {
    const b = R('bk'), m = R('modal-awal');
    return [[b.r, b.cy], [m.l, b.cy]];
  }, { edgeType: 'pro' });
  add('modal-awal', 'jr', 'd', true, (R, W) => {
    const m = R('modal-awal'), j = R('jr');
    const y0 = m.t + 44, x = W - 26;
    return [[m.r, y0], [x, y0], [x, j.cy], [j.r, j.cy]];
  }, { label: 'Keahlian Bawaan', vertical: true, edgeType: 'pro' });

  add('ma1', 'ma2', 'd', false, (R) => [[R('ma1').r, R('ma1').cy], [R('ma2').l, R('ma2').cy]], { edgeType: 'pro' });
  add('ma1', 'ma3', 'd', false, (R) => [[R('ma1').cx, R('ma1').b], [R('ma3').cx, R('ma3').t]], { edgeType: 'pro' });
  add('ma2', 'ma4', 'd', false, (R) => [[R('ma2').cx, R('ma2').b], [R('ma4').cx, R('ma4').t]], { edgeType: 'pro' });
  add('ma3', 'ma4', 'd', false, (R) => [[R('ma3').r, R('ma3').cy], [R('ma4').l, R('ma4').cy]], { edgeType: 'pro' });

  /* ---------- Requirement Organization (Materi Pembelajaran) ---------- */
  add('req-org', 'cv', 's', false, (R) => {
    const a = R('req-org'), c = R('cv');
    const mid = (a.b + c.t) / 2;
    return [[a.cx, a.b], [a.cx, mid], [c.cx, mid], [c.cx, c.t]];
  }, { edgeType: 'mat' });
  add('req-org', 'cbl', 's', false, (R) => {
    const a = R('req-org'), c = R('cbl');
    const mid = (a.b + c.t) / 2;
    return [[a.cx, a.b], [a.cx, mid], [c.cx, mid], [c.cx, c.t]];
  }, { edgeType: 'mat' });
  add('req-org', 'lms', 's', true, (R) => {
    const a = R('req-org'), l = R('lms');
    return [[a.r, a.cy], [l.cx, a.cy], [l.cx, l.t]];
  }, { edgeType: 'main' });

  /* ---------- Requirement Directorate (Dokumen Resmi & Standar) ---------- */
  add('req-dir', 'lms', 's', true, (R) => {
    const a = R('req-dir'), l = R('lms');
    return [[a.l, a.cy], [l.cx, a.cy], [l.cx, l.t]];
  }, { edgeType: 'main' });
  add('req-dir', 'dwp', 's', false, (R) => {
    const a = R('req-dir'), d = R('dwp');
    return [[a.cx, a.b], [a.cx, d.t]];
  }, { edgeType: 'doc' });

  /* ---------- Directorate Needs -> Pendahuluan & Fondasi Tata Kelola DWP (1 Jalur Konvergensi) ---------- */
  ['dn1', 'dn2', 'dn4', 'dn5'].forEach((id) => {
    add(id, 'pdwp', 's', false, (R) => {
      const d = R(id), p = R('pdwp'), center = R('dn3');
      const busX = (d.r + p.l) / 2;
      return [[d.r, d.cy], [busX, d.cy], [busX, center.cy]];
    }, { edgeType: 'need' });
  });

  add('dn3', 'pdwp', 's', true, (R) => {
    const d = R('dn3'), p = R('pdwp');
    const busX = (d.r + p.l) / 2;
    return [[d.r, d.cy], [busX, d.cy], [p.l, d.cy]];
  }, { edgeType: 'need' });

  /* ---------- Pendahuluan DWP -> Penjelasan Direktorat (DK1) ---------- */
  add('pdwp', 'dk1', 's', true, (R) => {
    const p = R('pdwp'), d = R('dk1');
    const midX = (p.r + d.l) / 2;
    return [[p.r, p.cy], [midX, p.cy], [midX, d.cy], [d.l, d.cy]];
  }, { label: 'Mendasari', edgeType: 'doc' });

  /* ---------- Directorate Knowledge ---------- */
  add('dk1', 'dk2', 's', true, (R) => drop(R('dk1'), R('dk2')), { edgeType: 'doc' });
  add('dk2', 'dk3', 's', true, (R) => drop(R('dk2'), R('dk3')), { edgeType: 'doc' });
  ['dk4', 'dk5', 'dk6'].forEach((id) => {
    add('dk3', id, 's', true, (R) => {
      const a = R('dk3'), c = R(id), mid = (a.b + c.t) / 2;
      return [[a.cx, a.b], [a.cx, mid], [c.cx, mid], [c.cx, c.t]];
    }, { edgeType: 'doc' });
  });

  /* ---------- Job Family & Role Requirements (Materi Pembelajaran) ---------- */
  add('dk', 'jf', 'd', true, (R) => drop(R('dk'), R('jf')), { label: 'Membentuk', edgeType: 'mat' });
  add('jr', 'jf', 'd', true, (R) => {
    const j = R('jr'), f = R('jf');
    const midX = (f.r + j.l) / 2;
    const yStart = (j.t + j.b) / 2;
    return [[j.l, yStart], [midX, yStart], [midX, f.cy], [f.r, f.cy]];
  }, { label: 'Membentuk', edgeType: 'mat' });

  /* ---------- Domain LMS ---------- */
  add('lms', 'lr', 's', false, (R) => {
    const l = R('lms'), lr = R('lr');
    return [[l.l, l.cy], [lr.r, l.cy]];
  }, { edgeType: 'main' });
  add('lms', 'assess', 's', true, (R) => {
    const l = R('lms'), a = R('assess');
    return [[l.r, l.cy], [a.l, l.cy]];
  }, { edgeType: 'main' });

  /* ---------- Learning Requirement (Luaran Materi & Aset Media) ---------- */
  add('silabus', 'media', 's', true, (R) => drop(R('silabus'), R('media')), { edgeType: 'asset' });
  add('media', 'la', 's', true, (R) => drop(R('media'), R('la')), { edgeType: 'asset' });
  ['comp-k', 'comp-s'].forEach((id) => {
    add('penugasan', id, 's', true, (R) => {
      const p = R('penugasan'), c = R(id), x = (p.r + c.l) / 2;
      return [[p.r, p.cy], [x, p.cy], [x, c.cy], [c.l, c.cy]];
    }, { edgeType: 'eva' });
  });

  /* ---------- Assessment (Instrumen Evaluasi) ---------- */
  add('assess', 'asesmen', 's', false, (R) => drop(R('assess'), R('asesmen')), { edgeType: 'eva' });
  add('assess', 'tl', 's', true, (R) => {
    const a = R('assess'), t = R('tl');
    return [[a.r, a.cy], [t.l, a.cy]];
  }, { edgeType: 'main' });

  /* ---------- Pemenuhan Kompetensi → Asesmen ---------- */
  add('comp-k', 'ase-k', 'd', true, (R) => {
    const a = R('comp-k'), t = R('ase-k'), x = R('lms').cx - 22;
    return [[a.r, a.cy], [x, a.cy], [x, t.cy], [t.l, t.cy]];
  }, { label: 'Memenuhi', vertical: true, edgeType: 'eva' });
  add('comp-s', 'ase-s', 'd', true, (R) => {
    const a = R('comp-s'), t = R('ase-s'), x = R('lms').cx + 22;
    return [[a.r, a.cy], [x, a.cy], [x, t.cy], [t.l, t.cy]];
  }, { label: 'Memenuhi Sebagian', vertical: true, edgeType: 'eva' });

  window.ROADMAP_EDGES = E;
})();
