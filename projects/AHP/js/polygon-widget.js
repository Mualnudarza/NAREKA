/* =========================================================
   polygon-widget.js
   Generalized version of the original Pentagon AHP input:
   instead of a hardcoded 5-sided shape, it draws an N-sided
   polygon where N = number of items being compared. A single
   draggable point represents relative preference on every
   vertex axis at once (projected distance from center),
   snapped to the Saaty 1–9 scale.

   Usage:
     const widget = createPolygonWidget({
       mount: document.getElementById('slot'),
       items: [{id,name}, ...],   // length >= 3
       onChange: (state) => {...} // called on every drag
     });
     widget.getMatrix() -> n x n matrix
     widget.getSaatyValues() -> [n]
     widget.reset()
   ========================================================= */

function createPolygonWidget({ mount, items, onChange, initialHandle }){
  const n = items.length;
  const SIZE = 440;
  const RADIUS = 150;
  const CENTER = { x: SIZE/2, y: SIZE/2 };

  mount.innerHTML = `
    <div class="polygon-scroll">
      <div class="polygon-stage" style="width:${SIZE}px;height:${SIZE}px;">
        <canvas width="${SIZE}" height="${SIZE}"></canvas>
        <div class="poly-labels"></div>
      </div>
    </div>
    <div class="btn-row" style="margin-top:10px;">
      <button type="button" class="btn btn-sm btn-ghost" data-act="reset">Reset ke tengah (semua setara)</button>
    </div>
  `;

  const canvas = mount.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const labelsDiv = mount.querySelector('.poly-labels');
  let handle = initialHandle ? { x: initialHandle.x, y: initialHandle.y } : { x: CENTER.x, y: CENTER.y };
  let dragging = false;

  function getVertices(r = RADIUS){
    const vs = [];
    for(let i=0;i<n;i++){
      const ang = -Math.PI/2 + i * (2*Math.PI/n);
      vs.push({ x: CENTER.x + r*Math.cos(ang), y: CENTER.y + r*Math.sin(ang), ang });
    }
    return vs;
  }

  function pointInPoly(pt, verts){
    let inside = false;
    for(let i=0, j=verts.length-1; i<verts.length; j=i++){
      const xi=verts[i].x, yi=verts[i].y, xj=verts[j].x, yj=verts[j].y;
      const intersect = ((yi>pt.y)!==(yj>pt.y)) && (pt.x < (xj-xi)*(pt.y-yi)/(yj-yi)+xi);
      if(intersect) inside = !inside;
    }
    return inside;
  }

  function projectToPolygon(pt){
    const verts = getVertices(RADIUS);
    let best=null, bestDist=Infinity;
    for(let i=0;i<verts.length;i++){
      const a=verts[i], b=verts[(i+1)%verts.length];
      const apx=pt.x-a.x, apy=pt.y-a.y, abx=b.x-a.x, aby=b.y-a.y;
      const ab2=abx*abx+aby*aby;
      let t=(apx*abx+apy*aby)/ab2;
      if(t<0)t=0; if(t>1)t=1;
      const px=a.x+abx*t, py=a.y+aby*t;
      const dx=px-pt.x, dy=py-pt.y, d2=dx*dx+dy*dy;
      if(d2<bestDist){bestDist=d2; best={x:px,y:py};}
    }
    return best;
  }

  function computeSaatyValues(){
    const values = [];
    for(let i=0;i<n;i++){
      const ang = -Math.PI/2 + i*(2*Math.PI/n);
      const axis = { x: Math.cos(ang), y: Math.sin(ang) };
      const px = handle.x - CENTER.x, py = handle.y - CENTER.y;
      const projLen = px*axis.x + py*axis.y;
      const norm = projLen / RADIUS;
      const posEq = 1 + Math.min(1, Math.abs(norm)) * 8;
      if(norm >= 0){
        values.push(Math.round(posEq));
      } else {
        values.push(1 / Math.round(posEq));
      }
    }
    return values;
  }

  function draw(){
    ctx.clearRect(0,0,SIZE,SIZE);
    // rings
    for(let s=1;s<=9;s++){
      const r = (s-1)/8 * RADIUS;
      const vs = getVertices(r);
      ctx.beginPath();
      vs.forEach((v,i) => i===0 ? ctx.moveTo(v.x,v.y) : ctx.lineTo(v.x,v.y));
      ctx.closePath();
      ctx.strokeStyle = '#e6e9f5';
      ctx.stroke();
    }
    const outer = getVertices(RADIUS);
    const vals = computeSaatyValues();
    outer.forEach((v,i) => {
      ctx.beginPath();
      ctx.moveTo(CENTER.x, CENTER.y);
      ctx.lineTo(v.x, v.y);
      const val = vals[i];
      const normed = (Math.log(val) - Math.log(1/9)) / (Math.log(9) - Math.log(1/9));
      ctx.lineWidth = 1 + normed*3;
      ctx.strokeStyle = `rgba(75,82,240,${normed*0.6+0.2})`;
      ctx.stroke();
    });
    // outline
    ctx.beginPath();
    outer.forEach((v,i) => i===0 ? ctx.moveTo(v.x,v.y) : ctx.lineTo(v.x,v.y));
    ctx.closePath();
    ctx.strokeStyle = '#cdd2e6';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(handle.x, handle.y, 9, 0, Math.PI*2);
    ctx.fillStyle = '#d6455a';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    updateLabels(vals);
    return vals;
  }

  function updateLabels(vals){
    labelsDiv.innerHTML = '';
    const outer = getVertices(RADIUS);
    outer.forEach((v,i) => {
      const el = document.createElement('div');
      el.className = 'poly-label';
      const val = vals[i];
      const valStr = val >= 1 ? val.toFixed(0) : `1/${Math.round(1/val)}`;
      el.innerHTML = `<span class="lidx">Sudut ${i+1}</span><span class="lname">${items[i].name}</span><span class="lval">Nilai: ${valStr}</span>`;
      const lx = CENTER.x + (RADIUS+58)*Math.cos(-Math.PI/2 + i*(2*Math.PI/n));
      const ly = CENTER.y + (RADIUS+58)*Math.sin(-Math.PI/2 + i*(2*Math.PI/n));
      el.style.left = `${lx}px`;
      el.style.top = `${ly}px`;
      labelsDiv.appendChild(el);
    });
  }

  function emitChange(){
    const vals = draw();
    if(onChange) onChange({ saatyValues: vals, matrix: ahpMatrixFromValues(vals), handle: { x: handle.x, y: handle.y } });
  }

  canvas.addEventListener('mousedown', (e) => {
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    if(Math.hypot(mx-handle.x, my-handle.y) <= 16) dragging = true;
  });
  window.addEventListener('mouseup', () => dragging = false);
  canvas.addEventListener('mousemove', (e) => {
    if(!dragging) return;
    moveHandle(e.clientX, e.clientY);
  });
  // touch support
  canvas.addEventListener('touchstart', (e) => {
    const r = canvas.getBoundingClientRect();
    const t = e.touches[0];
    const mx = t.clientX - r.left, my = t.clientY - r.top;
    if(Math.hypot(mx-handle.x, my-handle.y) <= 26) { dragging = true; e.preventDefault(); }
  }, {passive:false});
  window.addEventListener('touchend', () => dragging = false);
  canvas.addEventListener('touchmove', (e) => {
    if(!dragging) return;
    e.preventDefault();
    const t = e.touches[0];
    moveHandle(t.clientX, t.clientY);
  }, {passive:false});

  function moveHandle(clientX, clientY){
    const r = canvas.getBoundingClientRect();
    let nx = clientX - r.left, ny = clientY - r.top;
    const verts = getVertices(RADIUS);
    if(pointInPoly({x:nx,y:ny}, verts)){
      handle.x = nx; handle.y = ny;
    } else {
      const proj = projectToPolygon({x:nx,y:ny});
      if(proj){ handle.x = proj.x; handle.y = proj.y; }
    }
    emitChange();
  }

  mount.querySelector('[data-act="reset"]').addEventListener('click', () => {
    handle = { x: CENTER.x, y: CENTER.y };
    emitChange();
  });

  emitChange();

  return {
    getSaatyValues: computeSaatyValues,
    getMatrix: () => ahpMatrixFromValues(computeSaatyValues()),
    reset: () => { handle = { x: CENTER.x, y: CENTER.y }; emitChange(); }
  };
}
