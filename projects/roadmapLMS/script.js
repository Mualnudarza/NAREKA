/* =========================================================
   Roadmap Manajemen Pengetahuan — logika
   - membaca semua elemen [data-id] sebagai topik
   - menggambar garis penghubung (SVG) dari edges.js
   - sidebar detail (isi dari content.js, default "Segera hadir")
   - progres belajar (localStorage) dan zoom
   ========================================================= */
(() => {
  'use strict';

  const CANVAS_W = 2730;
  const MIN_SCALE = 0.4;
  const MAX_SCALE = 1.6;
  const STEP = 0.1;
  const STORE_KEY = 'roadmap-manajemen-pengetahuan:progress:v1';
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const STATUSES = ['done', 'learning', 'skip'];

  const EDGES = window.ROADMAP_EDGES || [];
  const CONTENT = window.ROADMAP_CONTENT || {};
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const $ = (sel, root = document) => root.querySelector(sel);

  const main = $('#main');
  const stage = $('#stage');
  const canvas = $('#canvas');
  const svg = $('#edges');
  const labelHost = $('#edge-labels');

  const panel = $('#panel');
  const panelClose = $('#panel-close');
  const panelCrumb = $('#panel-crumb');
  const panelTitle = $('#panel-title');
  const panelKind = $('#panel-kind');
  const panelBody = $('#panel-body');
  const panelRelated = $('#panel-related');
  const panelRelatedList = $('#panel-related-list');

  /* ---------------------------------------------------------
     Utilitas DOM kecil
     --------------------------------------------------------- */
  function h(tag, props = {}, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else el.setAttribute(k, v);
    }
    kids.flat().forEach((kid) => { if (kid != null) el.append(kid); });
    return el;
  }

  /* ---------------------------------------------------------
     Registry topik: semua elemen dengan data-id
     --------------------------------------------------------- */
  const KIND_BY_CLASS = [
    ['n-root', 'Peta Utama'],
    ['n-main', 'Pilar Utama'],
    ['n-doc', 'Dokumen Resmi & Standar'],
    ['n-mat', 'Materi Pembelajaran & Pelatihan'],
    ['n-asset', 'Luaran Materi & Aset Media'],
    ['n-eva', 'Instrumen Evaluasi & Asesmen'],
    ['n-pro', 'Data Profil & Rekam Jejak'],
    ['n-ref', 'Kerangka Acuan'],
    ['n-chip', 'Silabus'],
    ['n-leaf', 'Subtopik']
  ];

  const registry = new Map();

  canvas.querySelectorAll('[data-id]').forEach((el) => {
    const id = el.dataset.id;
    if (registry.has(id)) console.warn('data-id ganda:', id);

    const isGroup = el.classList.contains('group');
    const trigger = isGroup ? el.querySelector(':scope > .group-title') : el;
    const title = el.dataset.title || (trigger ? trigger.textContent : '').replace(/\s+/g, ' ').trim();
    const kind = isGroup
      ? 'Kelompok topik'
      : (KIND_BY_CLASS.find(([cls]) => el.classList.contains(cls)) || [, 'Topik'])[1];

    registry.set(id, { id, el, trigger, isGroup, title, kind });
  });

  const trackableIds = [...registry.keys()].filter((id) => id !== 'title');

  /* ---------------------------------------------------------
     Progres belajar
     --------------------------------------------------------- */
  let progress = {};
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {};
    for (const [id, st] of Object.entries(raw)) {
      if (registry.has(id) && STATUSES.includes(st)) progress[id] = st;
    }
  } catch (_) { progress = {}; }

  function saveProgress() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (_) { /* abaikan */ }
  }

  function paintStatus(id) {
    const { el } = registry.get(id);
    if (progress[id]) el.dataset.status = progress[id];
    else delete el.dataset.status;
  }

  function updateProgressUI() {
    const done = trackableIds.filter((id) => progress[id] === 'done').length;
    const total = trackableIds.length;
    $('#progress-text').textContent = `${done} dari ${total} selesai`;
    $('#progress-bar').style.width = total ? `${(done / total) * 100}%` : '0';
  }

  function setStatus(id, status) {
    if (!status || progress[id] === status) delete progress[id];
    else progress[id] = status;
    paintStatus(id);
    saveProgress();
    updateProgressUI();
    syncStatusButtons(id);
  }

  /* ---------------------------------------------------------
     Zoom & Pan
     --------------------------------------------------------- */
  let userScale = null; // null = otomatis pas lebar layar
  let scale = 1;
  let panX = 0;
  let panY = 0;

  const fitScale = () => {
    const avail = (stage.clientWidth || window.innerWidth) - 40;
    return Math.max(MIN_SCALE, Math.min(1, avail / CANVAS_W));
  };

  function applyTransform() {
    canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
    $('#zoom-fit').textContent = `${Math.round(scale * 100)}%`;
  }

  function applyScale(center = false) {
    scale = userScale == null ? fitScale() : userScale;
    if (center || userScale == null) {
      const stageW = stage.clientWidth || window.innerWidth;
      panX = Math.max(20, (stageW - CANVAS_W * scale) / 2);
      panY = 24;
    }
    applyTransform();
  }

  function zoomBy(delta, originX, originY) {
    const next = Math.round((scale + delta) * 100) / 100;
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
    if (newScale === scale) return;

    const ox = originX != null ? originX : (stage.clientWidth || window.innerWidth) / 2;
    const oy = originY != null ? originY : (stage.clientHeight || window.innerHeight) / 2;
    const ratio = newScale / scale;
    panX = ox - (ox - panX) * ratio;
    panY = oy - (oy - panY) * ratio;

    userScale = newScale;
    scale = newScale;
    applyTransform();
  }

  function resetView() {
    userScale = null;
    scale = fitScale();
    const stageW = stage.clientWidth || window.innerWidth;
    panX = Math.max(20, (stageW - CANVAS_W * scale) / 2);
    panY = 24;
    applyTransform();
  }

  $('#zoom-in').addEventListener('click', () => zoomBy(STEP));
  $('#zoom-out').addEventListener('click', () => zoomBy(-STEP));
  $('#zoom-fit').addEventListener('click', resetView);

  /* ---------------------------------------------------------
     Interaksi Pan (Geser Kiri, Kanan, Atas, Bawah)
     --------------------------------------------------------- */
  let isPointerDown = false;
  let isPanning = false;
  let startX = 0;
  let startY = 0;
  let startPanX = 0;
  let startPanY = 0;
  let pointerId = null;

  stage.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    isPointerDown = true;
    isPanning = false;
    pointerId = e.pointerId;
    startX = e.clientX;
    startY = e.clientY;
    startPanX = panX;
    startPanY = panY;
  });

  stage.addEventListener('pointermove', (e) => {
    if (!isPointerDown) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (!isPanning && Math.hypot(dx, dy) > 6) {
      isPanning = true;
      stage.classList.add('is-panning');
      try { stage.setPointerCapture(pointerId); } catch (_) {}
    }
    if (isPanning) {
      panX = startPanX + dx;
      panY = startPanY + dy;
      applyTransform();
    }
  });

  const stopPan = () => {
    if (!isPointerDown) return;
    isPointerDown = false;
    stage.classList.remove('is-panning');
    if (isPanning) {
      try { stage.releasePointerCapture(pointerId); } catch (_) {}
      window.addEventListener('click', (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
      }, { capture: true, once: true });
      isPanning = false;
    }
  };

  stage.addEventListener('pointerup', stopPan);
  stage.addEventListener('pointercancel', stopPan);
  window.addEventListener('pointerup', stopPan);

  // Scroll roda mouse: pan horizontal/vertikal (atau Ctrl+wheel untuk zoom)
  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      const delta = e.deltaY < 0 ? STEP : -STEP;
      const rect = stage.getBoundingClientRect();
      zoomBy(delta, e.clientX - rect.left, e.clientY - rect.top);
    } else {
      panX -= e.deltaX;
      panY -= e.deltaY;
      applyTransform();
    }
  }, { passive: false });

  /* ---------------------------------------------------------
     Garis penghubung
     --------------------------------------------------------- */
  let edgeNodes = [];

  function roundedPath(pts, radius) {
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      const [x2, y2] = pts[i + 1];
      const d1 = Math.hypot(x1 - x0, y1 - y0);
      const d2 = Math.hypot(x2 - x1, y2 - y1);
      const r = Math.min(radius, d1 / 2, d2 / 2);
      const ax = x1 + ((x0 - x1) / d1) * r;
      const ay = y1 + ((y0 - y1) / d1) * r;
      const bx = x1 + ((x2 - x1) / d2) * r;
      const by = y1 + ((y2 - y1) / d2) * r;
      d += ` L${ax} ${ay} Q${x1} ${y1} ${bx} ${by}`;
    }
    const last = pts[pts.length - 1];
    return `${d} L${last[0]} ${last[1]}`;
  }

  function dedupe(pts) {
    const out = [];
    for (const p of pts) {
      const last = out[out.length - 1];
      if (!last || Math.hypot(p[0] - last[0], p[1] - last[1]) > 0.5) out.push(p);
    }
    return out;
  }

  function placeLabel(edge, pts) {
    let best = -1;
    let at = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const len = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
      if (len > best) { best = len; at = i; }
    }
    const [x0, y0] = pts[at];
    const [x1, y1] = pts[at + 1];
    const isVertical = Math.abs(x1 - x0) < Math.abs(y1 - y0);
    const typeCls = edge.edgeType ? ` el-${edge.edgeType}` : ' el-main';
    const tag = h('span', {
      class: 'edge-label' + typeCls + (edge.vertical && isVertical ? ' v' : ''),
      text: edge.label
    });
    tag.style.left = `${(x0 + x1) / 2}px`;
    tag.style.top = `${(y0 + y1) / 2}px`;
    labelHost.append(tag);
  }

  function drawEdges() {
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

    edgeNodes.forEach(({ path }) => path.remove());
    edgeNodes = [];
    labelHost.replaceChildren();

    const origin = canvas.getBoundingClientRect();
    const cache = new Map();
    const R = (id) => {
      if (cache.has(id)) return cache.get(id);
      const item = registry.get(id);
      if (!item) throw new Error(`id tidak dikenal: ${id}`);
      const r = item.el.getBoundingClientRect();
      const box = {
        l: (r.left - origin.left) / scale,
        t: (r.top - origin.top) / scale,
        r: (r.right - origin.left) / scale,
        b: (r.bottom - origin.top) / scale
      };
      box.w = box.r - box.l;
      box.h = box.b - box.t;
      box.cx = box.l + box.w / 2;
      box.cy = box.t + box.h / 2;
      cache.set(id, box);
      return box;
    };

    for (const edge of EDGES) {
      let pts;
      try { pts = dedupe(edge.route(R, W)); }
      catch (err) { console.warn(`Garis ${edge.from} → ${edge.to} dilewati:`, err.message); continue; }
      if (pts.length < 2) continue;

      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', roundedPath(pts, 12));
      const typeCls = edge.edgeType ? ` edge-${edge.edgeType}` : ' edge-main';
      path.setAttribute('class', 'edge' + (edge.style === 'd' ? ' dashed' : '') + typeCls);
      if (edge.arrow) {
        const markerId = edge.edgeType ? `arr-${edge.edgeType}` : 'arr';
        path.setAttribute('marker-end', `url(#${markerId})`);
      }
      svg.appendChild(path);
      edgeNodes.push({ edge, path });

      if (edge.label) placeLabel(edge, pts);
    }
    highlightEdges(current);
  }

  function highlightEdges(id) {
    edgeNodes.forEach(({ edge, path }) => {
      const hl = id != null && (edge.from === id || edge.to === id);
      path.classList.toggle('hl', hl);
      if (hl) svg.appendChild(path);
    });
  }

  /* ---------------------------------------------------------
     Sidebar
     --------------------------------------------------------- */
  let current = null;
  let lastTrigger = null;

  function breadcrumbOf(item) {
    const chain = [];
    let g = item.el.parentElement && item.el.parentElement.closest('.group');
    while (g) {
      const info = registry.get(g.dataset.id);
      if (info) chain.unshift(info.title);
      g = g.parentElement && g.parentElement.closest('.group');
    }
    return item.id === 'title' ? [] : ['Roadmap', ...chain];
  }

  function relatedOf(id) {
    const seen = new Set();
    const out = [];
    for (const e of EDGES) {
      let other = null;
      let dir = null;
      if (e.from === id) { other = e.to; dir = e.arrow ? 'out' : 'link'; }
      else if (e.to === id) { other = e.from; dir = e.arrow ? 'in' : 'link'; }
      if (!other || !registry.has(other)) continue;
      const key = `${dir}:${other}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ id: other, dir, label: e.label || '' });
    }
    return out;
  }

  function soonBlock() {
    const ico = h('span', { class: 'soon-ico', 'aria-hidden': 'true' });
    ico.innerHTML =
      '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
    return h('div', { class: 'soon' },
      ico,
      h('strong', { text: 'Segera hadir' }),
      h('p', { text: 'Penjelasan untuk topik ini masih disiapkan. Ringkasan, poin penting, dan sumber belajar akan muncul di sini.' })
    );
  }

  function contentBlock(c) {
    const box = h('div', { class: 'content' });
    if (c.summary) box.append(h('p', { text: c.summary }));
    if (Array.isArray(c.points) && c.points.length) {
      box.append(h('h3', { text: 'Poin penting' }),
        h('ul', {}, c.points.map((p) => h('li', { text: p }))));
    }
    if (Array.isArray(c.links) && c.links.length) {
      const items = c.links
        .filter((l) => l && /^https?:\/\//i.test(l.url || ''))
        .map((l) => h('li', {}, h('a', { href: l.url, target: '_blank', rel: 'noopener noreferrer', text: l.label || l.url })));
      if (items.length) box.append(h('h3', { text: 'Sumber belajar' }), h('ul', {}, items));
    }
    return box;
  }

  function syncStatusButtons(id) {
    panel.querySelectorAll('[data-set]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(progress[id] === btn.dataset.set));
    });
  }

  function renderPanel(item) {
    panelTitle.textContent = item.title;
    panelCrumb.textContent = breadcrumbOf(item).join(' › ');
    panelKind.textContent = item.kind;
    syncStatusButtons(item.id);

    const c = CONTENT[item.id];
    panelBody.replaceChildren(c ? contentBlock(c) : soonBlock());

    const rel = relatedOf(item.id);
    panelRelatedList.replaceChildren();
    panelRelated.hidden = rel.length === 0;
    const glyph = { out: '→', in: '←', link: '–' };
    rel.forEach((r) => {
      const other = registry.get(r.id);
      const btn = h('button', { type: 'button', class: 'rel', 'data-goto': r.id },
        h('span', { class: 'rel-dir', 'aria-hidden': 'true', text: glyph[r.dir] }),
        h('span', { text: other.title }),
        r.label ? h('span', { class: 'rel-note', text: r.label }) : null
      );
      panelRelatedList.append(h('li', {}, btn));
    });
    panel.querySelector('.panel-scroll').scrollTop = 0;
  }

  function openPanel(id, opts = {}) {
    const item = registry.get(id);
    if (!item) return;

    if (current && registry.has(current)) registry.get(current).el.classList.remove('is-selected');
    current = id;
    item.el.classList.add('is-selected');
    lastTrigger = item.trigger;

    renderPanel(item);
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    panel.inert = false;
    highlightEdges(id);

    try { history.replaceState(null, '', `#${encodeURIComponent(id)}`); } catch (_) { /* file:// */ }
    if (opts.focus !== false) panelClose.focus({ preventScroll: true });
  }

  function closePanel() {
    if (!current) return;
    registry.get(current).el.classList.remove('is-selected');
    const hadFocus = panel.contains(document.activeElement);
    current = null;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    panel.inert = true;
    highlightEdges(null);
    try { history.replaceState(null, '', location.pathname + location.search); } catch (_) { /* file:// */ }
    if (hadFocus && lastTrigger) lastTrigger.focus({ preventScroll: true });
  }

  /* ---------------------------------------------------------
     Event
     --------------------------------------------------------- */
  canvas.addEventListener('click', (e) => {
    const hit = e.target.closest('.node, .group-title');
    if (!hit) return;
    e.stopPropagation();
    const holder = hit.classList.contains('group-title') ? hit.closest('.group') : hit;
    if (holder && holder.dataset.id) openPanel(holder.dataset.id);
  });

  // Klik area kosong menutup sidebar
  main.addEventListener('click', (e) => {
    if (!e.target.closest('.node, .group-title')) closePanel();
  });

  panelClose.addEventListener('click', closePanel);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && current) closePanel();
  });

  panel.querySelectorAll('[data-set]').forEach((btn) => {
    btn.addEventListener('click', () => { if (current) setStatus(current, btn.dataset.set); });
  });

  panelRelatedList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-goto]');
    if (!btn) return;
    const id = btn.dataset.goto;
    openPanel(id, { focus: false });
    const item = registry.get(id);
    if (!item) return;
    const stageR = stage.getBoundingClientRect();
    const nodeR = item.el.getBoundingClientRect();
    const nodeCx = (nodeR.left + nodeR.right) / 2;
    const nodeCy = (nodeR.top + nodeR.bottom) / 2;
    const stageCx = stageR.left + stageR.width / 2;
    const stageCy = stageR.top + stageR.height / 2;
    panX += (stageCx - nodeCx);
    panY += (stageCy - nodeCy);
    applyTransform();
  });

  $('#reset-progress').addEventListener('click', () => {
    if (!Object.keys(progress).length) return;
    if (!window.confirm('Hapus semua tanda progres belajar?')) return;
    progress = {};
    trackableIds.forEach(paintStatus);
    saveProgress();
    updateProgressUI();
    if (current) syncStatusButtons(current);
  });

  window.addEventListener('resize', () => { if (userScale == null) applyScale(); });

  /* ---------------------------------------------------------
     Mulai
     --------------------------------------------------------- */
  trackableIds.forEach(paintStatus);
  updateProgressUI();
  applyScale();
  drawEdges();

  const relayout = () => { applyScale(); drawEdges(); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  window.addEventListener('load', relayout);
  if ('ResizeObserver' in window) new ResizeObserver(relayout).observe(canvas);

  const fromHash = decodeURIComponent(location.hash.slice(1));
  if (registry.has(fromHash)) openPanel(fromHash, { focus: false });
})();
