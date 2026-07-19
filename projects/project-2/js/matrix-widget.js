/* =========================================================
   matrix-widget.js
   Classic AHP pairwise comparison UI: one slider per pair
   (i, j) where i < j. Slider range -8..8:
     0   -> equal (1)
      v>0 -> left item (i) is v+1x more important
      v<0 -> right item (j) is |v|+1x more important
   Also used automatically whenever a group has exactly 2
   items, even if the user picked the Polygon method — a
   2-vertex polygon isn't a meaningful shape.
   ========================================================= */

function createMatrixWidget({ mount, items, onChange, initialValues }){
  const n = items.length;
  const pairs = [];
  for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) pairs.push([i,j]);

  const sliderValues = (initialValues && initialValues.length === pairs.length)
    ? initialValues.slice()
    : pairs.map(() => 0);

  mount.innerHTML = `
    <div class="pair-list">
      ${pairs.map((p, idx) => `
        <div class="pair-row" data-idx="${idx}">
          <div class="pair-heads">
            <span class="left">${items[p[0]].name}</span>
            <span class="right">${items[p[1]].name}</span>
          </div>
          <div class="pair-slider-wrap">
            <input type="range" class="pair-slider" min="-8" max="8" step="1" value="${sliderValues[idx]}" data-idx="${idx}">
          </div>
          <div class="pair-value" data-idx="${idx}"></div>
        </div>
      `).join('')}
    </div>
    <div class="btn-row" style="margin-top:6px;">
      <button type="button" class="btn btn-sm btn-ghost" data-act="reset">Reset semua ke "Sama penting"</button>
    </div>
  `;

  function sliderLabel(v, leftName, rightName){
    if(v === 0) return 'Sama penting';
    const scale = Math.abs(v) + 1;
    const who = v > 0 ? leftName : rightName;
    return `${who} ${scale}x lebih penting`;
  }

  function updateSliderTrack(input, v){
    const pct = ((v + 8) / 16) * 100;
    input.style.background = v === 0
      ? 'var(--border-strong)'
      : `linear-gradient(to right, var(--border-strong) 0%, var(--border-strong) ${Math.min(pct,50)}%, var(--primary) ${Math.min(pct,50)}%, var(--primary) ${Math.max(pct,50)}%, var(--border-strong) ${Math.max(pct,50)}%, var(--border-strong) 100%)`;
  }

  function buildMatrix(){
    const M = Array.from({length:n}, () => Array(n).fill(1));
    pairs.forEach((p, idx) => {
      const v = sliderValues[idx];
      const [i,j] = p;
      if(v === 0){ M[i][j] = 1; M[j][i] = 1; }
      else if(v > 0){ M[i][j] = v + 1; M[j][i] = 1/(v+1); }
      else { M[i][j] = 1/(Math.abs(v)+1); M[j][i] = Math.abs(v)+1; }
    });
    return M;
  }

  function emitChange(){
    if(onChange) onChange({ matrix: buildMatrix(), sliderValues: sliderValues.slice() });
  }

  mount.querySelectorAll('.pair-slider').forEach(input => {
    const idx = parseInt(input.dataset.idx, 10);
    const v0 = sliderValues[idx];
    updateSliderTrack(input, v0);
    const [pi, pj] = pairs[idx];
    mount.querySelector(`.pair-value[data-idx="${idx}"]`).innerHTML = v0 === 0
      ? 'Sama penting'
      : `<b>${sliderLabel(v0, items[pi].name, items[pj].name)}</b>`;
    input.addEventListener('input', () => {
      const v = parseInt(input.value, 10);
      sliderValues[idx] = v;
      updateSliderTrack(input, v);
      const valEl = mount.querySelector(`.pair-value[data-idx="${idx}"]`);
      const [i,j] = pairs[idx];
      valEl.innerHTML = v === 0
        ? 'Sama penting'
        : `<b>${sliderLabel(v, items[i].name, items[j].name)}</b>`;
      emitChange();
    });
  });

  mount.querySelector('[data-act="reset"]').addEventListener('click', () => {
    sliderValues.fill(0);
    mount.querySelectorAll('.pair-slider').forEach((input, idx) => {
      input.value = 0;
      updateSliderTrack(input, 0);
      mount.querySelector(`.pair-value[data-idx="${idx}"]`).textContent = 'Sama penting';
    });
    emitChange();
  });

  emitChange();

  return {
    getMatrix: buildMatrix,
    reset: () => mount.querySelector('[data-act="reset"]').click()
  };
}
