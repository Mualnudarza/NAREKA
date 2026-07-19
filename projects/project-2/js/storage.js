/* =========================================================
   storage.js — session state persistence (sessionStorage)
   Data lives only for the current browser tab/session, which
   matches the requirement: input happens fresh each time the
   page/session is opened. Nothing is sent to any server.
   ========================================================= */

const AHP_KEY = 'ahp_session_v1';

function ahpGenId(prefix){
  return prefix + '_' + Math.random().toString(36).slice(2, 9);
}

function ahpDefaultSession(){
  return {
    meta:{ createdAt: new Date().toISOString(), method: null },
    useSubCriteria: false,
    criteria: [],        // [{id, name, subCriteria:[{id,name}]}]
    alternatives: [],     // [{id, name}]
    comparisons:{
      criteria: null,      // {items:[id..], matrix:[[]], weights:[], CR,...}
      subCriteria:{},      // { [criteriaId]: {...same shape} }
      alternatives:{}      // { [leafId]: {...same shape} }
    },
    results: null,
    queue: null,          // built lazily on compare.html
    queueIndex: 0,
    taskState:{}          // remembers widget state per task so "Sebelumnya" restores it
  };
}

function ahpGetSession(){
  try{
    const raw = sessionStorage.getItem(AHP_KEY);
    if(!raw) return null;
    return JSON.parse(raw);
  }catch(e){
    console.error('Gagal membaca sesi AHP:', e);
    return null;
  }
}

function ahpSaveSession(session){
  try{
    sessionStorage.setItem(AHP_KEY, JSON.stringify(session));
    return true;
  }catch(e){
    console.error('Gagal menyimpan sesi AHP:', e);
    return false;
  }
}

function ahpClearSession(){
  sessionStorage.removeItem(AHP_KEY);
}

/* Redirect helper: if there's no valid session, bounce back to setup */
function ahpRequireSession(minStage){
  const s = ahpGetSession();
  if(!s){
    window.location.href = 'index.html';
    return null;
  }
  if(minStage === 'compare' && (!s.criteria || s.criteria.length < 2 || !s.alternatives || s.alternatives.length < 2 || !s.meta || !s.meta.method)){
    window.location.href = 'index.html';
    return null;
  }
  if(minStage === 'compare' && !s.taskState) s.taskState = {};
  if(minStage === 'result' && !s.results){
    window.location.href = 'index.html';
    return null;
  }
  return s;
}
