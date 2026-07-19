/* =========================================================
   compare.js — drives compare.html
   Builds a queue of pairwise-comparison tasks (criteria,
   then optional sub-criteria per parent, then alternatives
   per "leaf" criterion), and walks the user through them
   one at a time using either the Polygon or Matrix widget.
   ========================================================= */

(function(){
  const session = ahpRequireSession('compare');
  if(!session) return;

  /* Build the task queue once. Groups with fewer than 2 items
     don't need user input — they get a trivial 100%-weight node
     written straight into session.comparisons. */
  function buildQueue(){
    const queue = [];

    if(session.criteria.length >= 2){
      queue.push({
        type: 'criteria', refId: 'criteria',
        label: 'Kriteria Utama',
        desc: 'Bandingkan tingkat kepentingan antar kriteria utama satu sama lain.',
        items: session.criteria.map(c => ({ id:c.id, name:c.name }))
      });
    } else {
      session.comparisons.criteria = ahpTrivialNode(session.criteria.map(c => c.id));
    }

    if(session.useSubCriteria){
      session.criteria.forEach(c => {
        const subs = c.subCriteria || [];
        if(subs.length >= 2){
          queue.push({
            type: 'subcriteria', refId: c.id,
            label: `Sub-Kriteria dari "${c.name}"`,
            desc: `Bandingkan sub-kriteria di dalam kriteria "${c.name}".`,
            items: subs.map(s => ({ id:s.id, name:s.name }))
          });
        } else if(subs.length === 1){
          session.comparisons.subCriteria[c.id] = ahpTrivialNode(subs.map(s => s.id));
        }
      });
    }

    // Leaves = sub-criteria (if used & present) else the criteria itself
    const leaves = [];
    session.criteria.forEach(c => {
      const hasSubs = session.useSubCriteria && c.subCriteria && c.subCriteria.length > 0;
      if(hasSubs) c.subCriteria.forEach(s => leaves.push({ id:s.id, name:s.name }));
      else leaves.push({ id:c.id, name:c.name });
    });

    if(session.alternatives.length >= 2){
      leaves.forEach(leaf => {
        queue.push({
          type: 'alternatives', refId: leaf.id,
          label: `Alternatif — berdasarkan "${leaf.name}"`,
          desc: `Bandingkan seluruh alternatif ditinjau dari kriteria "${leaf.name}".`,
          items: session.alternatives.map(a => ({ id:a.id, name:a.name }))
        });
      });
    } else {
      leaves.forEach(leaf => {
        session.comparisons.alternatives[leaf.id] = ahpTrivialNode(session.alternatives.map(a => a.id));
      });
    }

    return queue;
  }

  if(!session.queue){
    session.queue = buildQueue();
    session.queueIndex = 0;
    ahpSaveSession(session);
  }

  const els = {
    progressFill: document.getElementById('progressFill'),
    progressLabel: document.getElementById('progressLabel'),
    title: document.getElementById('taskTitle'),
    hint: document.getElementById('taskHint'),
    mount: document.getElementById('widgetMount'),
    consBox: document.getElementById('consistencyBox'),
    lambda: document.getElementById('metricLambda'),
    ci: document.getElementById('metricCI'),
    cr: document.getElementById('metricCR'),
    badge: document.getElementById('consistencyBadge'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
  };

  let currentWidget = null;

  function updateConsistencyPreview(n, matrix){
    if(n < 3){
      els.consBox.style.display = 'none';
      return;
    }
    els.consBox.style.display = 'flex';
    const weights = ahpComputeWeights(matrix);
    const cons = ahpComputeConsistency(matrix, weights);
    els.lambda.textContent = cons.lambdaMax.toFixed(3);
    els.ci.textContent = cons.CI.toFixed(3);
    els.cr.textContent = cons.CR.toFixed(3);
    if(cons.consistent){
      els.badge.textContent = 'Konsisten';
      els.badge.className = 'badge badge-ok';
    } else {
      els.badge.textContent = 'Kurang Konsisten (CR > 0.1)';
      els.badge.className = 'badge badge-bad';
    }
  }

  function renderTask(){
    const idx = session.queueIndex;
    const total = session.queue.length;
    const task = session.queue[idx];

    els.progressFill.style.width = `${Math.round((idx/total)*100)}%`;
    els.progressLabel.textContent = `Langkah ${idx+1} dari ${total} — ${task.items.length} item dibandingkan`;
    els.title.textContent = task.label;
    els.hint.textContent = task.desc;
    els.prevBtn.disabled = idx === 0;
    els.nextBtn.textContent = idx === total - 1 ? 'Lihat Hasil →' : 'Lanjut →';

    els.mount.innerHTML = '';
    const taskKey = `${task.type}:${task.refId}`;
    const saved = session.taskState[taskKey];
    const useMatrixWidget = task.items.length === 2 || session.meta.method === 'matrix';

    function onChange(state){
      updateConsistencyPreview(task.items.length, state.matrix);
      session.taskState[taskKey] = useMatrixWidget
        ? { method:'matrix', sliderValues: state.sliderValues }
        : { method:'polygon', handle: state.handle };
    }

    if(useMatrixWidget){
      currentWidget = createMatrixWidget({
        mount: els.mount,
        items: task.items,
        onChange,
        initialValues: (saved && saved.method === 'matrix') ? saved.sliderValues : undefined
      });
    } else {
      currentWidget = createPolygonWidget({
        mount: els.mount,
        items: task.items,
        onChange,
        initialHandle: (saved && saved.method === 'polygon') ? saved.handle : undefined
      });
    }
  }

  function saveCurrentTask(){
    const task = session.queue[session.queueIndex];
    const matrix = currentWidget.getMatrix();
    const node = ahpEvaluateNode(task.items.map(it => it.id), matrix);
    if(task.type === 'criteria') session.comparisons.criteria = node;
    else if(task.type === 'subcriteria') session.comparisons.subCriteria[task.refId] = node;
    else session.comparisons.alternatives[task.refId] = node;
  }

  els.nextBtn.addEventListener('click', () => {
    saveCurrentTask();
    if(session.queueIndex >= session.queue.length - 1){
      session.results = ahpAggregate(session);
      ahpSaveSession(session);
      window.location.href = 'result.html';
      return;
    }
    session.queueIndex += 1;
    ahpSaveSession(session);
    renderTask();
  });

  els.prevBtn.addEventListener('click', () => {
    if(session.queueIndex === 0) return;
    saveCurrentTask();
    session.queueIndex -= 1;
    ahpSaveSession(session);
    renderTask();
  });

  if(session.queue.length === 0){
    // Every group was trivial (shouldn't normally happen since setup
    // requires >=2 criteria and >=2 alternatives) — aggregate directly.
    session.results = ahpAggregate(session);
    ahpSaveSession(session);
    window.location.href = 'result.html';
  } else {
    renderTask();
  }
})();
