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
  "Tidak Ditemukan": "bg-danger", "Waiting": "bg-warning text-dark",
  "Available": "bg-success", "Printed": "bg-info"
};

function badge(status){
  const cls = BADGE_MAP[status] || "bg-secondary";
  return `<span class="badge ${cls}">${status}</span>`;
}

function fillBranchSelect(selectEl, includeAll = true){
  if (!selectEl) return;
  let html = includeAll ? `<option value="">Semua Branch</option>` : "";
  BRANCHES.forEach(b => { html += `<option value="${b}">${b}</option>`; });
  selectEl.innerHTML = html;
}

function getGlobalBranch() {
  return localStorage.getItem("globalBranch") || "";
}

function setGlobalBranch(branch) {
  localStorage.setItem("globalBranch", branch);
  window.dispatchEvent(new CustomEvent("globalBranchChange", { detail: { branch } }));
}

function sortCompare(a, b, type) {
  if (type === "number") return (Number(a) || 0) - (Number(b) || 0);
  if (type === "date") return new Date(a).getTime() - new Date(b).getTime();
  return String(a ?? "").localeCompare(String(b ?? ""), "id", { sensitivity: "base" });
}

function getSortType(val) {
  if (val === null || val === undefined || val === "") return "string";
  if (typeof val === "number") return "number";
  if (typeof val === "string") {
    if (/^\d+$/.test(val)) return "number";
    if (/^\d{1,2}[-/]\w{3}[-/]\d{2,4}$/.test(val) || /^\d{4}-\d{2}-\d{2}/.test(val)) return "date";
    if (/^Rp\s?[\d.,]+/.test(val) || /^[\d.,]+$/.test(val.replace(/\./g, "").replace(/,/g, "."))) return "number";
  }
  return "string";
}

function renderSimpleTable(opts){
  const mount = document.getElementById(opts.mountId);
  if (!mount) return;
  const pageSize = opts.pageSize || 8;
  let state = { page: 1, keyword: "", sortKey: null, sortDir: "asc" };

  const getCellValue = (row, col) => col.render ? col.render(row) : (row[col.key] ?? "");

  function getFiltered(){
    let rows = opts.data;
    if (opts.filterFn) rows = rows.filter(opts.filterFn);
    if (state.keyword){
      const kw = state.keyword.toLowerCase();
      rows = rows.filter(r => (opts.searchKeys || Object.keys(r)).some(k =>
        String(r[k] ?? "").toLowerCase().includes(kw)
      ));
    }
    if (state.sortKey !== null) {
      const col = opts.columns[state.sortKey];
      const dir = state.sortDir === "asc" ? 1 : -1;
      const type = col.sortType || (col.key ? getSortType(opts.data[0]?.[col.key]) : "string");
      rows.sort((a, b) => {
        const va = getCellValue(a, col);
        const vb = getCellValue(b, col);
        return sortCompare(
          col.key ? (a[col.key] ?? "") : va,
          col.key ? (b[col.key] ?? "") : vb,
          type
        ) * dir;
      });
    }
    return rows;
  }

  function draw(){
    const rows = getFiltered();
    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    if (state.page > totalPages) state.page = totalPages;
    const start = (state.page - 1) * pageSize;
    const pageRows = rows.slice(start, start + pageSize);

    const noSortLabels = new Set(["aksi", "detail", "print", "action"]);
    const thead = "<tr>" + opts.columns.map((c, i) => {
      const sortable = !noSortLabels.has((c.label || "").toLowerCase());
      const active = state.sortKey === i;
      const arrow = active
        ? `<span class="sort-arrow ${state.sortDir}"></span>`
        : `<span class="sort-arrow"></span>`;
      const cls = `text-nowrap${active ? " sort-active" : ""}${sortable ? " sortable" : ""}`;
      return `<th class="${cls}" data-col="${i}" tabindex="${sortable ? "0" : "-1"}">${c.label}${sortable ? arrow : ""}</th>`;
    }).join("") + "</tr>";

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
          <thead>${thead}</thead>
          <tbody>${tbody}</tbody>
        </table>
      </div>
      ${totalPages > 1 ? `
      <div class="d-flex justify-content-between align-items-center mt-2">
        <div class="pagination-info">Halaman ${state.page} dari ${totalPages}</div>
        <nav>
          <ul class="pagination pagination-sm mb-0" id="${opts.mountId}-pagination"></ul>
        </nav>
      </div>` : ""}
    `;

    const pag = document.getElementById(opts.mountId + "-pagination");
    if (pag) {
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
    }

    const searchInput = document.getElementById(opts.mountId + "-search");
    searchInput.addEventListener("input", (e) => {
      state.keyword = e.target.value;
      state.page = 1;
      draw();
    });

    mount.querySelectorAll("th.sortable").forEach(th => {
      const handler = (e) => {
        const i = parseInt(th.dataset.col, 10);
        if (state.sortKey === i) {
          state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
        } else {
          state.sortKey = i;
          state.sortDir = "asc";
        }
        state.page = 1;
        draw();
      };
      th.addEventListener("click", handler);
      th.addEventListener("keydown", e => { if (e.key === "Enter") handler(e); });
    });
  }

  draw();
  return { redraw: draw, setFilter(fn){ opts.filterFn = fn; state.page = 1; draw(); } };
}

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
