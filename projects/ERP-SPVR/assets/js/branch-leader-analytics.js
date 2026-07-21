function initializeBranchLeaderAnalytics() {
  var monthNames = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  var currentYear = new Date().getFullYear();
  var currentMonth = new Date().getMonth() + 1;
  var els = {
    globalMonth: document.getElementById("global-month"),
    globalYear: document.getElementById("global-year"),
    growthType: document.getElementById("growth-area-type"),
    growthArea: document.getElementById("growth-area-name"),
    growthSortDir: document.getElementById("growth-sort-dir"),
    closingArea: document.getElementById("closing-area-name"),
    tableMonth: document.getElementById("table-month"),
    tableYear: document.getElementById("table-year"),
    tableType: document.getElementById("table-area-type"),
    modalGrowthType: document.getElementById("modal-growth-type"),
    modalGrowthArea: document.getElementById("modal-growth-area"),
    modalGrowthSortDir: document.getElementById("modal-growth-sort-dir")
  };

  function monthOptions(selected) {
    return monthNames.map(function(m, i) {
      var v = i + 1;
      return '<option value="'+v+'"'+(v === selected ? ' selected' : '')+'>'+m+'</option>';
    }).join('');
  }

  els.globalMonth.innerHTML = monthOptions(currentMonth);
  els.tableMonth.innerHTML = monthOptions(currentMonth);
  els.tableYear.innerHTML = monthOptions(currentMonth); // reuse month names for year options but actually we need years
  var yrOpts = [currentYear-1, currentYear, currentYear+1].map(function(y) { return '<option value="'+y+'"'+(y === currentYear ? ' selected' : '')+'>'+y+'</option>'; }).join('');
  els.tableYear.innerHTML = yrOpts;
  els.globalYear.innerHTML = yrOpts;

  function monthlyChange(area, month) {
    var base = AREA_GROWTH.find(function(g) { return g.area_id === area.id; });
    var growth = base ? base.growth : 0;
    var terminatedImpact = area.customer_terminate > 0 && month % 3 === 0 ? area.customer_terminate : 0;
    return growth - terminatedImpact;
  }

  function rows(month) {
    var branch = getGlobalBranch();
    return AREA_DATA.filter(function(a) { return !branch || a.branch === branch; }).map(function(a) {
      return Object.assign({}, a, { monthly_change: monthlyChange(a, Number(month)) });
    });
  }

  function setText(id, val) {
    document.getElementById(id).textContent = val;
  }

  function fillGrowthAreaDropdown(targetEl, filterType) {
    var selected = targetEl.value || "all";
    var data = rows(els.globalMonth.value).filter(function(a) {
      return filterType.value === "all" || String(a.is_primary) === filterType.value;
    });
    targetEl.innerHTML = '<option value="all">Semua Area</option>' + data.map(function(a) {
      return '<option value="'+a.id+'">'+a.area_name+' ('+a.area_code+')</option>';
    }).join('');
    targetEl.value = data.some(function(a) { return String(a.id) === selected; }) ? selected : "all";
  }

  function modalGrowthRows() {
    var data = rows(els.globalMonth.value);
    if (els.modalGrowthType.value !== "all") data = data.filter(function(a) { return String(a.is_primary) === els.modalGrowthType.value; });
    if (els.modalGrowthArea.value !== "all") data = data.filter(function(a) { return String(a.id) === els.modalGrowthArea.value; });
    var dir = els.modalGrowthSortDir.value === "asc" ? 1 : -1;
    return data.sort(function(a, b) { return (a.monthly_change - b.monthly_change) * dir; });
  }

  function fillClosingAreaDropdown() {
    var selected = els.closingArea.value || "all";
    var data = rows(els.globalMonth.value);
    els.closingArea.innerHTML = '<option value="all">Akumulasi Semua Area</option>' + data.map(function(a) {
      return '<option value="'+a.id+'">'+a.area_name+' ('+a.area_code+')</option>';
    }).join('');
    els.closingArea.value = data.some(function(a) { return String(a.id) === selected; }) ? selected : "all";
  }

  function kpiRows() {
    return rows(els.globalMonth.value);
  }

  function growthRows() {
    var data = rows(els.globalMonth.value);
    if (els.growthType.value !== "all") data = data.filter(function(a) { return String(a.is_primary) === els.growthType.value; });
    if (els.growthArea.value !== "all") data = data.filter(function(a) { return String(a.id) === els.growthArea.value; });
    var dir = els.growthSortDir.value === "asc" ? 1 : -1;
    return data.sort(function(a, b) { return (a.monthly_change - b.monthly_change) * dir; });
  }

  function tableRows() {
    var data = rows(els.tableMonth.value);
    if (els.tableType.value !== "all") data = data.filter(function(a) { return String(a.is_primary) === els.tableType.value; });
    return data;
  }

  function renderKpis() {
    var data = kpiRows();
    setText("kpi-total-area", data.length);
    setText("kpi-growth-customer", data.reduce(function(n,a){ return n + a.monthly_change; }, 0));
    setText("kpi-customer-aktif", data.reduce(function(n,a){ return n + a.customer_active; }, 0));
    setText("kpi-customer-isolir", data.reduce(function(n,a){ return n + a.customer_isolir; }, 0));
    setText("kpi-customer-terminate", data.reduce(function(n,a){ return n + a.customer_terminate; }, 0));
    setText("kpi-fasum", data.reduce(function(n,a){ return n + a.fasum; }, 0));
  }

  function renderBarChart(targetId, data, limit) {
    var target = document.getElementById(targetId);
    var shown = limit ? data.slice(0, limit) : data;
    if (!shown.length) {
      target.innerHTML = '<div class="table-empty">Tidak ada data area sesuai filter.</div>';
      return;
    }
    var maxAbs = Math.max.apply(null, shown.map(function(a){ return Math.abs(a.monthly_change); }));
    if (maxAbs < 1) maxAbs = 1;
    var maxTick = Math.ceil(maxAbs / 5) * 5;
    if (maxTick < 5) maxTick = 5;
    var ticks = [];
    for (var t = 0; t <= maxTick; t += 5) ticks.push(t);

    var barH = 22, gap = 8, labelW = 130, axisH = 28;
    var L = labelW + 8, R = 30, T = 6;
    var chartH = shown.length * (barH + gap) - gap;
    var H = T + chartH + axisH;
    var W = 600;
    var iw = W - L - R;

    var xPos = function(v) { return L + (v / maxTick) * iw; };

    var gridLines = ticks.map(function(v) {
      return '<line class="grid-x" x1="'+xPos(v).toFixed(1)+'" y1="'+T+'" x2="'+xPos(v).toFixed(1)+'" y2="'+(T+chartH)+'"></line>';
    }).join('');

    var xLabels = ticks.map(function(v) {
      return '<text class="axis-label" x="'+xPos(v).toFixed(1)+'" y="'+(T+chartH+16)+'" text-anchor="middle">'+v+'</text>';
    }).join('');

    var axisTitle = '<text class="axis-title" x="'+(L+iw/2)+'" y="'+(H-2)+'" text-anchor="middle">Perubahan Bulanan</text>';

    var bars = shown.map(function(a, i) {
      var cy = T + i * (barH + gap) + barH / 2;
      var by = T + i * (barH + gap);
      var value = a.monthly_change;
      var barW = (Math.abs(value) / maxTick) * iw;
      var fill = value < 0 ? '#ef4444' : '#2778c4';
      return '<text class="axis-label" x="'+(L-6)+'" y="'+(cy+1)+'" text-anchor="end" dominant-baseline="middle" style="font-size:11px">'+a.area_name+'</text>'
        + '<rect x="'+L+'" y="'+by+'" width="'+barW.toFixed(1)+'" height="'+barH+'" rx="3" fill="'+fill+'" fill-opacity="0.8"></rect>'
        + '<text class="bar-val-label" x="'+(L+barW+4).toFixed(1)+'" y="'+(cy+1)+'" dominant-baseline="middle">'+(value > 0 ? '+' : '')+value+'</text>';
    }).join('');

    target.innerHTML = '<svg viewBox="0 0 '+W+' '+H+'" class="growth-svg" style="width:100%;height:'+H+'px">'
      + gridLines + bars + xLabels + axisTitle
      + '</svg>';
  }

  function renderClosingChart() {
    var month = Number(els.globalMonth.value);
    var year = Number(els.globalYear.value);
    var days = new Date(year, month, 0).getDate();
    var areaId = els.closingArea.value || "all";
    var areaFactor = areaId === "all" ? 1 : (Number(areaId) % 5 + 1) / 6;
    var data = Array.from({ length: days }, function(_, i) {
      var base = DAILY_CLOSING[i % DAILY_CLOSING.length].count;
      return { day: i + 1, count: Math.max(0, Math.round((base + ((i + month) % 4)) * areaFactor)) };
    });
    var max = Math.max.apply(null, data.map(function(d){ return d.count; }));
    if (max < 1) max = 1;
    var W = 720, H = 210, L = 46, R = 16, T = 18, B = 42;
    var iw = W - L - R, ih = H - T - B;
    var x = function(day) { return L + ((day - 1) / Math.max(days - 1, 1)) * iw; };
    var y = function(count) { return T + ih - (count / max) * ih; };
    var points = data.map(function(d) { return x(d.day).toFixed(1)+','+y(d.count).toFixed(1); }).join(' ');
    var areaPath = 'M'+L+','+(T+ih)+' L'+points.split(' ').join(' L')+' L'+(W-R)+','+(T+ih)+' Z';
    var yTicks = [0, Math.ceil(max / 2), max];
    var xGrid = data.map(function(d) { return '<line class="grid-x" x1="'+x(d.day).toFixed(1)+'" y1="'+T+'" x2="'+x(d.day).toFixed(1)+'" y2="'+(T+ih)+'"></line>'; }).join('');
    var yGrid = yTicks.map(function(v) { return '<line class="grid-y" x1="'+L+'" y1="'+y(v).toFixed(1)+'" x2="'+(W-R)+'" y2="'+y(v).toFixed(1)+'"></line>'; }).join('');
    var xLabels = data.map(function(d) { return '<text class="axis-label" x="'+x(d.day).toFixed(1)+'" y="'+(H-24)+'" text-anchor="middle">'+d.day+'</text>'; }).join('');
    var yLabels = yTicks.map(function(v) { return '<text class="axis-label" x="'+(L-8)+'" y="'+y(v).toFixed(1)+'" text-anchor="end" dominant-baseline="middle">'+v+'</text>'; }).join('');
    var dots = data.map(function(d) { return '<circle cx="'+x(d.day).toFixed(1)+'" cy="'+y(d.count).toFixed(1)+'" r="2.5"><title>Tanggal '+d.day+' — '+d.count+' closing</title></circle>'; }).join('');
    document.getElementById("chart-closing-trend").innerHTML = '<svg viewBox="0 0 '+W+' '+H+'" class="closing-svg">'
      + '<text class="axis-title" x="'+(L+iw/2)+'" y="'+(H-4)+'" text-anchor="middle">Tanggal</text>'
      + '<text class="axis-title" transform="translate(12 '+(T+ih/2)+') rotate(-90)" text-anchor="middle">Jumlah Closing</text>'
      + xGrid + yGrid
      + '<path class="closing-area" d="'+areaPath+'"></path>'
      + '<polyline points="'+points+'"></polyline>'
      + dots + xLabels + yLabels
      + '</svg>';
  }

  var tableSortField = null;
  var tableSortDir = "asc";

  function renderTable() {
    var data = tableRows();

    if (tableSortField) {
      var dir = tableSortDir === "asc" ? 1 : -1;
      data.sort(function(a,b) {
        var va = a[tableSortField], vb = b[tableSortField];
        if (typeof va === "string") va = va.toLowerCase();
        if (typeof vb === "string") vb = vb.toLowerCase();
        if (va < vb) return -1 * dir;
        if (va > vb) return 1 * dir;
        return 0;
      });
    }

    var cols = [
      {key:"area_code", label:"Kode Area"},
      {key:"area_name", label:"Nama Area"},
      {key:"is_primary", label:"Kategori"},
      {key:"customer_active", label:"Aktif"},
      {key:"customer_isolir", label:"Isolir"},
      {key:"customer_terminate", label:"Terminate"},
      {key:"fasum", label:"Fasum"},
      {key:"monthly_change", label:"Perubahan Bulanan"},
      {key:"open_date", label:"Date Open"}
    ];

    var arrow = function(k) {
      if (tableSortField !== k) return '';
      return tableSortDir === "asc" ? ' <span class="sort-arrow asc"></span>' : ' <span class="sort-arrow desc"></span>';
    };

    var html = '<div class="table-responsive"><table class="table table-hover align-middle">'
      + '<thead><tr>' + cols.map(function(c) {
          return '<th class="sortable" data-key="'+c.key+'">'+c.label+arrow(c.key)+'</th>';
        }).join('') + '<th></th></tr></thead><tbody>';

    html += data.map(function(a) {
      var change = (a.monthly_change > 0 ? '+' : '') + a.monthly_change;
      var badge = a.is_primary === 1 ? '<span class="badge bg-primary">Primary</span>' : '<span class="badge bg-secondary">Overlay</span>';
      var detailUrl = window.BASE + 'pages/area/detail.html?id=' + a.id;
      return '<tr>'
        + '<td class="fw-semibold">'+a.area_code+'</td>'
        + '<td>'+a.area_name+'</td>'
        + '<td>'+badge+'</td>'
        + '<td>'+a.customer_active+'</td>'
        + '<td>'+a.customer_isolir+'</td>'
        + '<td>'+a.customer_terminate+'</td>'
        + '<td>'+a.fasum+'</td>'
        + '<td class="'+(a.monthly_change < 0 ? 'text-danger' : 'text-success')+' fw-semibold">'+change+'</td>'
        + '<td>'+a.open_date+'</td>'
        + '<td><a class="btn btn-sm btn-outline-dark" href="'+detailUrl+'">Detail</a></td>'
        + '</tr>';
    }).join('');
    html += '</tbody></table></div>';
    document.getElementById("area-table-container").innerHTML = html;

    document.querySelectorAll('#area-table-container .sortable').forEach(function(th) {
      th.addEventListener('click', function() {
        var key = this.getAttribute('data-key');
        if (tableSortField === key) {
          tableSortDir = tableSortDir === "asc" ? "desc" : "asc";
        } else {
          tableSortField = key;
          tableSortDir = "asc";
        }
        renderTable();
      });
    });
  }

  function renderGrowthOnly() {
    fillGrowthAreaDropdown(els.growthArea, els.growthType);
    var data = growthRows();
    renderBarChart("chart-growth-area", data, 10);
  }

  function renderModalGrowth() {
    fillGrowthAreaDropdown(els.modalGrowthArea, els.modalGrowthType);
    var data = modalGrowthRows();
    renderBarChart("chart-growth-area-full", data, null);
  }

  function renderGlobal() {
    fillClosingAreaDropdown();
    renderKpis();
    renderClosingChart();
    renderGrowthOnly();
  }

  function renderTableOnly() {
    renderTable();
  }

  [els.globalMonth, els.globalYear].forEach(function(el) { el.addEventListener("change", renderGlobal); });
  [els.growthType, els.growthArea, els.growthSortDir].forEach(function(el) { el.addEventListener("change", renderGrowthOnly); });
  [els.tableMonth, els.tableType].forEach(function(el) { el.addEventListener("change", renderTableOnly); });
  window.addEventListener("globalBranchChange", renderGlobal);
  els.closingArea.addEventListener("change", renderClosingChart);

  // Modal growth filters
  [els.modalGrowthType, els.modalGrowthArea, els.modalGrowthSortDir].forEach(function(el) {
    el.addEventListener("change", renderModalGrowth);
  });

  // Re-render modal when shown to sync with global month
  document.getElementById("growthModal").addEventListener("show.bs.modal", function() {
    // Update modal area dropdown based on current global month
    renderModalGrowth();
  });

  document.addEventListener("click", function(e) {
    if (e.target.classList.contains("area-detail-btn")) openAreaDetail(e.target.getAttribute("data-area-id"));
  });

  renderGlobal();
  renderTableOnly();
}
