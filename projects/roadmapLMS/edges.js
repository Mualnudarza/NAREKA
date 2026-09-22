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
  add('title', 'bk', 's', true, (R) => drop(R('title'), R('bk')));
  add('bk', 'req-org', 's', true, (R) => vv(R('bk'), R('req-org'), R('req-org').t - 26));
  add('bk', 'req-dir', 's', true, (R) => vv(R('bk'), R('req-dir'), R('req-dir').t - 26));

  /* ---------- Modal awal individu ---------- */
  add('bk', 'modal-awal', 'd', true, (R) => {
    const b = R('bk'), m = R('modal-awal');
    return [[b.r, b.cy], [m.l, b.cy]];
  });
  add('modal-awal', 'jr', 'd', true, (R, W) => {
    const m = R('modal-awal'), j = R('jr');
    const y0 = m.t + 44, x = W - 26;
    return [[m.r, y0], [x, y0], [x, j.cy], [j.r, j.cy]];
  }, { label: 'Keahlian Bawaan', vertical: true });

  add('ma1', 'ma2', 'd', false, (R) => [[R('ma1').r, R('ma1').cy], [R('ma2').l, R('ma2').cy]]);
  add('ma1', 'ma3', 'd', false, (R) => [[R('ma1').cx, R('ma1').b], [R('ma3').cx, R('ma3').t]]);
  add('ma2', 'ma4', 'd', false, (R) => [[R('ma2').cx, R('ma2').b], [R('ma4').cx, R('ma4').t]]);
  add('ma3', 'ma4', 'd', false, (R) => [[R('ma3').r, R('ma3').cy], [R('ma4').l, R('ma4').cy]]);

  /* ---------- Requirement Organization ---------- */
  add('req-org', 'cv', 's', false, (R) => {
    const a = R('req-org'), c = R('cv');
    const mid = (a.b + c.t) / 2;
    return [[a.cx, a.b], [a.cx, mid], [c.cx, mid], [c.cx, c.t]];
  });
  add('req-org', 'cbl', 's', false, (R) => {
    const a = R('req-org'), c = R('cbl');
    const mid = (a.b + c.t) / 2;
    return [[a.cx, a.b], [a.cx, mid], [c.cx, mid], [c.cx, c.t]];
  });
  add('req-org', 'lms', 's', true, (R) => {
    const a = R('req-org'), l = R('lms');
    return [[a.r, a.cy], [l.cx, a.cy], [l.cx, l.t]];
  });

  /* ---------- Requirement Directorate ---------- */
  add('req-dir', 'lms', 's', true, (R) => {
    const a = R('req-dir'), l = R('lms');
    return [[a.l, a.cy], [l.cx, a.cy], [l.cx, l.t]];
  });
  add('req-dir', 'dir-needs', 's', false, (R) => {
    const a = R('req-dir'), n = R('dir-needs');
    const mid = (a.b + n.t) / 2;
    return [[a.cx, a.b], [a.cx, mid], [n.cx, mid], [n.cx, n.t]];
  });
  add('req-dir', 'dwp', 's', false, (R) => {
    const a = R('req-dir'), d = R('dwp');
    const mid = (a.b + d.t) / 2;
    return [[a.cx, a.b], [a.cx, mid], [d.cx, mid], [d.cx, d.t]];
  });
  add('dir-needs', 'dwp', 'd', true, (R) => {
    const n = R('dir-needs'), d = R('dwp');
    return [[n.r, n.cy], [d.l, n.cy]];
  }, { label: 'Dipenuhi' });

  /* ---------- Directorate Knowledge ---------- */
  add('dk1', 'dk2', 's', true, (R) => drop(R('dk1'), R('dk2')));
  add('dk2', 'dk3', 's', true, (R) => drop(R('dk2'), R('dk3')));
  ['dk4', 'dk5', 'dk6'].forEach((id) => {
    add('dk3', id, 's', true, (R) => {
      const a = R('dk3'), c = R(id), mid = (a.b + c.t) / 2;
      return [[a.cx, a.b], [a.cx, mid], [c.cx, mid], [c.cx, c.t]];
    });
  });

  /* ---------- Job Family menerima Directorate Knowledge & Job Role ---------- */
  add('dk', 'jf', 'd', true, (R) => drop(R('dk'), R('jf')), { label: 'Membentuk' });
  add('jr', 'jf', 'd', true, (R) => {
    const j = R('jr'), f = R('jf');
    return [[j.l, f.cy], [f.r, f.cy]];
  }, { label: 'Membentuk' });

  /* ---------- Domain LMS ---------- */
  add('lms', 'lr', 'd', true, (R) => vv(R('lms'), R('lr'), R('lr').t - 30));
  add('lms', 'assess', 's', true, (R) => vv(R('lms'), R('assess'), R('assess').t - 30));

  /* ---------- Learning Requirement ---------- */
  add('silabus', 'media', 's', true, (R) => drop(R('silabus'), R('media')));
  add('media', 'la', 's', true, (R) => drop(R('media'), R('la')));
  ['comp-k', 'comp-s'].forEach((id) => {
    add('penugasan', id, 's', true, (R) => {
      const p = R('penugasan'), c = R(id), x = (p.r + c.l) / 2;
      return [[p.r, p.cy], [x, p.cy], [x, c.cy], [c.l, c.cy]];
    });
  });

  /* ---------- Assessment ---------- */
  add('assess', 'asesmen', 'd', true, (R) => drop(R('assess'), R('asesmen')));
  add('assess', 'tl', 's', true, (R) => {
    const a = R('assess'), t = R('tl');
    return [[a.r, a.cy], [t.l, a.cy]];
  });

  /* ---------- Kompetensi → asesmen ---------- */
  add('comp-k', 'ase-k', 'd', true, (R) => {
    const a = R('comp-k'), t = R('ase-k'), x = R('lms').cx - 22;
    return [[a.r, a.cy], [x, a.cy], [x, t.cy], [t.l, t.cy]];
  }, { label: 'Memenuhi', vertical: true });
  add('comp-s', 'ase-s', 'd', true, (R) => {
    const a = R('comp-s'), t = R('ase-s'), x = R('lms').cx + 22;
    return [[a.r, a.cy], [x, a.cy], [x, t.cy], [t.l, t.cy]];
  }, { label: 'Memenuhi Sebagian', vertical: true });

  window.ROADMAP_EDGES = E;
})();
