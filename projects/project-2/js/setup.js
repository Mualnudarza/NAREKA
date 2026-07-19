/* =========================================================
   setup.js — drives index.html
   ========================================================= */

(function(){
  // Start from any previously saved session in this tab (lets users
  // navigate back from compare.html without losing their setup),
  // otherwise start fresh.
  let session = ahpGetSession() || ahpDefaultSession();
  if(!session.comparisons) session = ahpDefaultSession();

  const criteriaListEl = document.getElementById('criteriaList');
  const criteriaEmptyEl = document.getElementById('criteriaEmpty');
  const altListEl = document.getElementById('altList');
  const altEmptyEl = document.getElementById('altEmpty');
  const subEditorEl = document.getElementById('subCriteriaEditor');
  const subToggleEl = document.getElementById('subToggle');
  const validationMsg = document.getElementById('validationMsg');

  /* ---------------- Criteria ---------------- */
  function addCriteria(name){
    name = name.trim();
    if(!name) return;
    session.criteria.push({ id: ahpGenId('c'), name, subCriteria: [] });
    renderAll();
  }
  function removeCriteria(id){
    session.criteria = session.criteria.filter(c => c.id !== id);
    renderAll();
  }
  function moveCriteria(id, dir){
    const idx = session.criteria.findIndex(c => c.id === id);
    const to = idx + dir;
    if(to < 0 || to >= session.criteria.length) return;
    [session.criteria[idx], session.criteria[to]] = [session.criteria[to], session.criteria[idx]];
    renderAll();
  }

  function renderCriteria(){
    criteriaListEl.innerHTML = '';
    criteriaEmptyEl.style.display = session.criteria.length ? 'none' : 'block';

    session.criteria.forEach((c, i) => {
      const row = document.createElement('div');
      row.className = 'item-row';
      row.innerHTML = `
        <span class="idx-dot">${i+1}</span>
        <span class="name">${escapeHtml(c.name)}</span>
        <div class="row-btns">
          <button class="btn btn-icon btn-sm btn-ghost" data-act="up">▲</button>
          <button class="btn btn-icon btn-sm btn-ghost" data-act="down">▼</button>
          <button class="btn btn-icon btn-sm btn-danger-ghost" data-act="del">✕</button>
        </div>
      `;
      row.querySelector('[data-act="up"]').onclick = () => moveCriteria(c.id, -1);
      row.querySelector('[data-act="down"]').onclick = () => moveCriteria(c.id, 1);
      row.querySelector('[data-act="del"]').onclick = () => removeCriteria(c.id);
      criteriaListEl.appendChild(row);

      if(session.useSubCriteria){
        const subBlock = document.createElement('div');
        subBlock.className = 'subblock';
        (c.subCriteria || []).forEach((s, si) => {
          const srow = document.createElement('div');
          srow.className = 'item-row sub';
          srow.innerHTML = `
            <span class="idx-dot">${i+1}.${si+1}</span>
            <span class="name">${escapeHtml(s.name)}</span>
            <div class="row-btns">
              <button class="btn btn-icon btn-sm btn-ghost" data-act="up">▲</button>
              <button class="btn btn-icon btn-sm btn-ghost" data-act="down">▼</button>
              <button class="btn btn-icon btn-sm btn-danger-ghost" data-act="del">✕</button>
            </div>
          `;
          srow.querySelector('[data-act="up"]').onclick = () => moveSub(c.id, s.id, -1);
          srow.querySelector('[data-act="down"]').onclick = () => moveSub(c.id, s.id, 1);
          srow.querySelector('[data-act="del"]').onclick = () => removeSub(c.id, s.id);
          subBlock.appendChild(srow);
        });
        const addRow = document.createElement('div');
        addRow.className = 'subblock-add';
        addRow.innerHTML = `
          <input type="text" placeholder="Sub-kriteria dari &quot;${escapeHtml(c.name)}&quot;" maxlength="80">
          <button class="btn btn-sm" data-act="addsub">+ Tambah</button>
        `;
        const subInput = addRow.querySelector('input');
        const commit = () => { addSub(c.id, subInput.value); subInput.value=''; };
        addRow.querySelector('[data-act="addsub"]').onclick = commit;
        subInput.addEventListener('keydown', e => { if(e.key==='Enter'){ e.preventDefault(); commit(); }});
        subBlock.appendChild(addRow);
        criteriaListEl.appendChild(subBlock);
      }
    });
    validate();
  }

  function addSub(critId, name){
    name = name.trim();
    if(!name) return;
    const c = session.criteria.find(c => c.id === critId);
    c.subCriteria.push({ id: ahpGenId('s'), name });
    renderAll();
  }
  function removeSub(critId, subId){
    const c = session.criteria.find(c => c.id === critId);
    c.subCriteria = c.subCriteria.filter(s => s.id !== subId);
    renderAll();
  }
  function moveSub(critId, subId, dir){
    const c = session.criteria.find(c => c.id === critId);
    const idx = c.subCriteria.findIndex(s => s.id === subId);
    const to = idx + dir;
    if(to < 0 || to >= c.subCriteria.length) return;
    [c.subCriteria[idx], c.subCriteria[to]] = [c.subCriteria[to], c.subCriteria[idx]];
    renderAll();
  }

  /* ---------------- Alternatives ---------------- */
  function addAlt(name){
    name = name.trim();
    if(!name) return;
    session.alternatives.push({ id: ahpGenId('a'), name });
    renderAll();
  }
  function removeAlt(id){
    session.alternatives = session.alternatives.filter(a => a.id !== id);
    renderAll();
  }
  function moveAlt(id, dir){
    const idx = session.alternatives.findIndex(a => a.id === id);
    const to = idx + dir;
    if(to < 0 || to >= session.alternatives.length) return;
    [session.alternatives[idx], session.alternatives[to]] = [session.alternatives[to], session.alternatives[idx]];
    renderAll();
  }
  function renderAlts(){
    altListEl.innerHTML = '';
    altEmptyEl.style.display = session.alternatives.length ? 'none' : 'block';
    session.alternatives.forEach((a, i) => {
      const row = document.createElement('div');
      row.className = 'item-row';
      row.innerHTML = `
        <span class="idx-dot">${i+1}</span>
        <span class="name">${escapeHtml(a.name)}</span>
        <div class="row-btns">
          <button class="btn btn-icon btn-sm btn-ghost" data-act="up">▲</button>
          <button class="btn btn-icon btn-sm btn-ghost" data-act="down">▼</button>
          <button class="btn btn-icon btn-sm btn-danger-ghost" data-act="del">✕</button>
        </div>
      `;
      row.querySelector('[data-act="up"]').onclick = () => moveAlt(a.id, -1);
      row.querySelector('[data-act="down"]').onclick = () => moveAlt(a.id, 1);
      row.querySelector('[data-act="del"]').onclick = () => removeAlt(a.id);
      altListEl.appendChild(row);
    });
  }

  /* ---------------- Sub-criteria toggle ---------------- */
  function renderToggle(){
    subToggleEl.classList.toggle('on', session.useSubCriteria);
  }
  subToggleEl.addEventListener('click', () => {
    session.useSubCriteria = !session.useSubCriteria;
    renderAll();
  });

  /* ---------------- Method cards ---------------- */
  const methodCards = {
    polygon: document.getElementById('methodPolygonCard'),
    matrix: document.getElementById('methodMatrixCard')
  };
  Object.entries(methodCards).forEach(([key, el]) => {
    el.addEventListener('click', () => {
      session.meta.method = key;
      renderMethod();
    });
  });
  function renderMethod(){
    Object.entries(methodCards).forEach(([key, el]) => {
      el.classList.toggle('selected', session.meta.method === key);
    });
    validate();
  }

  /* ---------------- Validation ---------------- */
  function validate(){
    const errs = [];
    if(session.criteria.length < 2) errs.push('minimal 2 kriteria');
    if(session.alternatives.length < 2) errs.push('minimal 2 alternatif');
    if(!session.meta.method) errs.push('pilih metode perbandingan');
    if(session.useSubCriteria){
      const anyEmptyOk = true; // sub-criteria are optional per-criteria
    }
    const startBtn = document.getElementById('startBtn');
    if(errs.length){
      validationMsg.textContent = 'Lengkapi dulu: ' + errs.join(', ') + '.';
      startBtn.disabled = true;
    } else {
      validationMsg.textContent = '';
      startBtn.disabled = false;
    }
    return errs.length === 0;
  }

  function renderAll(){
    renderToggle();
    renderCriteria();
    renderAlts();
    renderMethod();
    ahpSaveSession(session);
  }

  function escapeHtml(str){
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  /* ---------------- Wire up add inputs ---------------- */
  const criteriaInput = document.getElementById('criteriaInput');
  document.getElementById('addCriteriaBtn').onclick = () => { addCriteria(criteriaInput.value); criteriaInput.value=''; criteriaInput.focus(); };
  criteriaInput.addEventListener('keydown', e => { if(e.key==='Enter'){ e.preventDefault(); document.getElementById('addCriteriaBtn').click(); }});

  const altInput = document.getElementById('altInput');
  document.getElementById('addAltBtn').onclick = () => { addAlt(altInput.value); altInput.value=''; altInput.focus(); };
  altInput.addEventListener('keydown', e => { if(e.key==='Enter'){ e.preventDefault(); document.getElementById('addAltBtn').click(); }});

  /* ---------------- Start ---------------- */
  document.getElementById('startBtn').addEventListener('click', () => {
    if(!validate()) return;
    // Fresh comparison state each time setup is (re)confirmed, so
    // edits to criteria/alternatives don't leave stale matrices behind.
    session.comparisons = { criteria: null, subCriteria: {}, alternatives: {} };
    session.results = null;
    session.queue = null;
    session.queueIndex = 0;
    session.taskState = {};
    ahpSaveSession(session);
    window.location.href = 'compare.html';
  });

  renderAll();
})();
