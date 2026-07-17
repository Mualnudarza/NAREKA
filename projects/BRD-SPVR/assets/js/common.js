/* =========================================================
   ERP SPVR - common.js
   Helper umum: pagination sederhana, search, badge status,
   bullet chart (progress bar), populate select branch.
   ========================================================= */

const BADGE_MAP = {
  "Aktif": "bg-success", "Active": "bg-success", "Selesai": "bg-success",
  "Complete": "bg-success", "Terjadwal Hari Ini": "bg-info", "Primary": "bg-primary",
  "Isolir": "bg-warning text-dark", "Pending": "bg-warning text-dark",
  "Menunggu Pembayaran": "bg-warning text-dark", "Menunggu Penjadwalan": "bg-warning text-dark",
  "Wait List": "bg-warning text-dark", "Dalam Proses": "bg-info", "Penjadwalan": "bg-info",
  "Menunggu Teknisi": "bg-secondary", "Terminate": "bg-danger", "Closed": "bg-danger",
  "Gagal Instalasi": "bg-danger", "Non Aktif": "bg-secondary", "Off": "bg-secondary",
  "Training": "bg-info", "Pegawai": "bg-success", "Overlay": "bg-secondary",
  "Perangkat Kembali Lengkap": "bg-success", "Perangkat Sebagian": "bg-warning text-dark",
  "Tidak Ditemukan": "bg-danger", "Waiting": "bg-warning text-dark"
};

function badge(status){
  const cls = BADGE_MAP[status] || "bg-secondary";
  return `<span class="badge ${cls}">${status}</span>`;
}

/**
 * Isi <select> dengan daftar branch (mengikuti regional SPVR).
 */
function fillBranchSelect(selectEl, includeAll = true){
  if (!selectEl) return;
  let html = includeAll ? `<option value="">Semua Branch</option>` : "";
  BRANCHES.forEach(b => { html += `<option value="${b}">${b}</option>`; });
  selectEl.innerHTML = html;
}

/**
 * DataTable sederhana: search + pagination di sisi client.
 * opts = { data, columns:[{key,label,render}], pageSize, mountId, searchKeys, filterFn }
 */
function renderSimpleTable(opts){
  const mount = document.getElementById(opts.mountId);
  if (!mount) return;
  const pageSize = opts.pageSize || 8;
  let state = { page: 1, keyword: "" };

  function getFiltered(){
    let rows = opts.data;
    if (opts.filterFn) rows = rows.filter(opts.filterFn);
    if (state.keyword){
      const kw = state.keyword.toLowerCase();
      rows = rows.filter(r => (opts.searchKeys || Object.keys(r)).some(k =>
        String(r[k] ?? "").toLowerCase().includes(kw)
      ));
    }
    return rows;
  }

  function draw(){
    const rows = getFiltered();
    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    if (state.page > totalPages) state.page = totalPages;
    const start = (state.page - 1) * pageSize;
    const pageRows = rows.slice(start, start + pageSize);

    let thead = "<tr>" + opts.columns.map(c => `<th class="text-nowrap">${c.label}</th>`).join("") + "</tr>";
    let tbody = "";
    if (pageRows.length === 0){
      tbody = `<tr><td colspan="${opts.columns.length}"><div class="table-empty">Tidak ada data yang sesuai.</div></td></tr>`;
    } else {
      pageRows.forEach(row => {
        tbody += "<tr>" + opts.columns.map(c => `<td>${c.render ? c.render(row) : (row[c.key] ?? "-")}</td>`).join("") + "</tr>";
      });
    }

    mount.innerHTML = `
      <div class="table-toolbar">
        <div class="search-box w-100">
          <input type="text" class="form-control form-control-sm" placeholder="Cari data..." id="${opts.mountId}-search" value="${state.keyword}">
        </div>
        <div class="pagination-info">${rows.length} data ditemukan</div>
      </div>
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="thead-light">${thead}</thead>
          <tbody>${tbody}</tbody>
        </table>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <div class="pagination-info">Halaman ${state.page} dari ${totalPages}</div>
        <nav>
          <ul class="pagination pagination-sm mb-0" id="${opts.mountId}-pagination"></ul>
        </nav>
      </div>
    `;

    // pagination controls
    const pag = document.getElementById(opts.mountId + "-pagination");
    let pagHtml = `<li class="page-item ${state.page===1?'disabled':''}"><a class="page-link" href="#" data-page="${state.page-1}">&laquo;</a></li>`;
    for (let p = 1; p <= totalPages; p++){
      pagHtml += `<li class="page-item ${p===state.page?'active':''}"><a class="page-link" href="#" data-page="${p}">${p}</a></li>`;
    }
    pagHtml += `<li class="page-item ${state.page===totalPages?'disabled':''}"><a class="page-link" href="#" data-page="${state.page+1}">&raquo;</a></li>`;
    pag.innerHTML = pagHtml;
    pag.querySelectorAll("a.page-link").forEach(a => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const p = parseInt(a.dataset.page, 10);
        if (p >= 1 && p <= totalPages){ state.page = p; draw(); }
      });
    });

    const searchInput = document.getElementById(opts.mountId + "-search");
    searchInput.addEventListener("input", (e) => {
      state.keyword = e.target.value;
      state.page = 1;
      draw();
    });
    searchInput.focus();
    searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
  }

  draw();
  return { redraw: draw, setFilter(fn){ opts.filterFn = fn; state.page = 1; draw(); } };
}

/**
 * Render kumpulan bullet chart (progress bar) target vs realisasi.
 * items = [{label, target, value}]
 */
function renderBulletCharts(mountId, items, opts = {}){
  const mount = document.getElementById(mountId);
  if (!mount) return;
  const sizeClass = opts.large ? "bullet-chart-lg" : "";
  mount.innerHTML = items.map(it => {
    const pct = Math.min(140, Math.round((it.value / it.target) * 100));
    const fillPct = Math.min(100, pct);
    const cls = pct >= 100 ? "over" : (pct >= 70 ? "" : "under");
    const targetPct = Math.min(100, Math.round((it.target / Math.max(it.target, it.value)) * 100));
    return `
      <div class="bullet-chart ${sizeClass}">
        <div class="bullet-label">
          <span class="b-name">${it.label}</span>
          <span class="b-value">${it.value} / ${it.target} (${pct}%)</span>
        </div>
        <div class="bullet-track">
          <div class="bullet-fill ${cls}" style="width:${fillPct}%"></div>
          <div class="bullet-target" style="left:${targetPct}%"></div>
        </div>
      </div>`;
  }).join("");
}

function countBy(arr, key){
  const out = {};
  arr.forEach(r => { out[r[key]] = (out[r[key]] || 0) + 1; });
  return out;
}
