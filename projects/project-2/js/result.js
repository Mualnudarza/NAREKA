/* =========================================================
   result.js — drives result.html
   ========================================================= */

(function(){
  const session = ahpRequireSession('result');
  if(!session) return;

  const R = session.results;

  function esc(str){
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function fmtVal(v){
    return v >= 1 ? v.toFixed(2) : `1/${Math.round(1/v)}`;
  }

  function badgeFor(node, n){
    if(node.trivial) return `<span class="badge badge-muted">Otomatis (1 item)</span>`;
    if(n < 3) return `<span class="badge badge-muted">Otomatis (≤2 item)</span>`;
    return node.consistent
      ? `<span class="badge badge-ok">Konsisten</span>`
      : `<span class="badge badge-bad">CR ${node.CR.toFixed(3)} — Kurang Konsisten</span>`;
  }

  /* ---------------- Ranking ---------------- */
  function renderRanking(){
    const wrap = document.getElementById('rankingWrap');
    const max = Math.max(...R.finalScores.map(r => r.score));
    wrap.innerHTML = R.finalScores.map(r => `
      <div class="rank-row ${r.rank === 1 ? 'is-first' : ''}">
        <div class="rank-pos">${r.rank}</div>
        <div class="rank-name">${esc(r.name)}</div>
        <div class="rank-bar-track"><div class="rank-bar-fill" style="width:${(r.score/max*100).toFixed(1)}%"></div></div>
        <div class="rank-score">${(r.score*100).toFixed(2)}%</div>
      </div>
    `).join('');
  }

  /* ---------------- Consistency overview ---------------- */
  function renderConsistencyOverview(){
    const wrap = document.getElementById('consistencyWrap');
    let rows = [];

    rows.push({
      label: 'Kriteria Utama',
      n: session.criteria.length,
      node: session.comparisons.criteria
    });

    if(session.useSubCriteria){
      session.criteria.forEach(c => {
        if(c.subCriteria && c.subCriteria.length > 0){
          rows.push({
            label: `Sub-Kriteria: ${c.name}`,
            n: c.subCriteria.length,
            node: session.comparisons.subCriteria[c.id]
          });
        }
      });
    }

    R.leaves.forEach(leaf => {
      rows.push({
        label: `Alternatif vs "${leaf.name}"`,
        n: session.alternatives.length,
        node: session.comparisons.alternatives[leaf.id]
      });
    });

    wrap.innerHTML = `
      <div class="item-list">
        ${rows.map(r => `
          <div class="item-row" style="background:#fff;">
            <span class="name">${esc(r.label)}</span>
            ${badgeFor(r.node, r.n)}
          </div>
        `).join('')}
      </div>
    `;
  }

  /* ---------------- Matrix + weights table renderer ---------------- */
  function renderNodeDetail(container, items, node){
    if(node.trivial){
      container.innerHTML += `<p class="empty-note">Hanya 1 item pada grup ini — bobot otomatis 100%, tidak memerlukan perbandingan.</p>`;
      return;
    }
    const n = items.length;
    let matrixHtml = '<div class="table-scroll"><table class="data"><thead><tr><th></th>' +
      items.map(it => `<th>${esc(it.name)}</th>`).join('') + '</tr></thead><tbody>';
    for(let i=0;i<n;i++){
      matrixHtml += `<tr><td class="rowhead">${esc(items[i].name)}</td>`;
      for(let j=0;j<n;j++) matrixHtml += `<td>${fmtVal(node.matrix[i][j])}</td>`;
      matrixHtml += '</tr>';
    }
    matrixHtml += '</tbody></table></div>';

    let weightHtml = '<div class="table-scroll"><table class="data" style="margin-top:10px;max-width:340px;"><thead><tr><th>Item</th><th>Bobot Prioritas</th></tr></thead><tbody>';
    items.forEach((it,i) => {
      weightHtml += `<tr><td class="rowhead">${esc(it.name)}</td><td class="weight-cell">${node.weights[i].toFixed(4)}</td></tr>`;
    });
    weightHtml += '</tbody></table></div>';

    const consHtml = n >= 3 ? `
      <div class="consistency-box" style="margin-top:12px;">
        <div class="metrics"><span>λmax: <b>${node.lambdaMax.toFixed(3)}</b></span><span>CI: <b>${node.CI.toFixed(3)}</b></span><span>CR: <b>${node.CR.toFixed(3)}</b></span></div>
        <span class="badge ${node.consistent ? 'badge-ok' : 'badge-bad'}">${node.consistent ? 'Konsisten' : 'Kurang Konsisten (CR > 0.1)'}</span>
      </div>` : `<p class="small-muted" style="margin-top:8px;">CR tidak dihitung — hanya berlaku mulai 3 item.</p>`;

    container.innerHTML += matrixHtml + weightHtml + consHtml;
  }

  /* ---------------- Section: main criteria ---------------- */
  function renderCriteriaDetail(){
    const wrap = document.getElementById('criteriaDetailWrap');
    wrap.innerHTML = '';
    renderNodeDetail(wrap, session.criteria.map(c => ({id:c.id,name:c.name})), session.comparisons.criteria);
  }

  /* ---------------- Section: sub-criteria ---------------- */
  function renderSubCriteriaDetail(){
    if(!session.useSubCriteria) return;
    const anySubs = session.criteria.some(c => c.subCriteria && c.subCriteria.length > 0);
    if(!anySubs) return;
    document.getElementById('subCriteriaCard').style.display = 'block';
    const wrap = document.getElementById('subCriteriaDetailWrap');
    wrap.innerHTML = '';
    session.criteria.forEach(c => {
      if(!c.subCriteria || c.subCriteria.length === 0) return;
      const title = document.createElement('div');
      title.className = 'node-title sub';
      title.innerHTML = `<span class="dot"></span> ${esc(c.name)}`;
      wrap.appendChild(title);
      const box = document.createElement('div');
      wrap.appendChild(box);
      renderNodeDetail(box, c.subCriteria.map(s => ({id:s.id,name:s.name})), session.comparisons.subCriteria[c.id]);
    });
  }

  /* ---------------- Section: alternatives per leaf ---------------- */
  function renderAltDetail(){
    document.getElementById('altSectionTitle').textContent =
      session.useSubCriteria && R.leaves.some(l => l.isSub)
        ? '3) Perbandingan Alternatif per Sub-Kriteria'
        : '3) Perbandingan Alternatif per Kriteria';

    const wrap = document.getElementById('altDetailWrap');
    wrap.innerHTML = '';
    R.leaves.forEach(leaf => {
      const title = document.createElement('div');
      title.className = 'node-title' + (leaf.isSub ? ' sub' : '');
      title.innerHTML = `<span class="dot"></span> ${esc(leaf.name)}${leaf.isSub ? ` <span class="badge badge-accent" style="margin-left:6px;">sub dari ${esc(leaf.parentName)}</span>` : ''}`;
      wrap.appendChild(title);
      const box = document.createElement('div');
      wrap.appendChild(box);
      renderNodeDetail(box, session.alternatives.map(a => ({id:a.id,name:a.name})), session.comparisons.alternatives[leaf.id]);
    });
  }

  /* ---------------- Global weight recap ---------------- */
  function renderGlobalWeights(){
    const wrap = document.getElementById('globalWeightWrap');
    const rows = R.leaves.slice().sort((a,b) => b.globalWeight - a.globalWeight);
    wrap.innerHTML = `
      <div class="table-scroll">
        <table class="data">
          <thead><tr><th>Kriteria</th><th>Sub-Kriteria</th><th>Bobot Lokal</th><th>Bobot Global</th></tr></thead>
          <tbody>
            ${rows.map(l => `
              <tr>
                <td class="rowhead">${esc(l.isSub ? l.parentName : l.name)}</td>
                <td class="rowhead">${l.isSub ? esc(l.name) : '–'}</td>
                <td>${l.localWeight.toFixed(4)}</td>
                <td class="weight-cell">${l.globalWeight.toFixed(4)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  /* ---------------- Actions ---------------- */
  document.getElementById('restartBtn').addEventListener('click', () => {
    if(confirm('Mulai sesi baru? Semua data kriteria, alternatif, dan perbandingan saat ini akan dihapus.')){
      ahpClearSession();
      window.location.href = 'index.html';
    }
  });

  document.getElementById('printBtn').addEventListener('click', () => window.print());

  document.getElementById('downloadBtn').addEventListener('click', () => {
    const report = {
      generatedAt: new Date().toISOString(),
      method: session.meta.method,
      criteria: session.criteria,
      alternatives: session.alternatives,
      useSubCriteria: session.useSubCriteria,
      comparisons: session.comparisons,
      results: session.results
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ahp-hasil-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  renderRanking();
  renderConsistencyOverview();
  renderCriteriaDetail();
  renderSubCriteriaDetail();
  renderAltDetail();
  renderGlobalWeights();
})();
