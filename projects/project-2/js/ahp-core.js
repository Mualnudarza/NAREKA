/* =========================================================
   ahp-core.js — the actual AHP math.
   Both input methods (Polygon and classic Matrix) end up
   producing the same thing: an n×n pairwise comparison
   matrix. Everything below operates on that matrix, so the
   math is identical and comparable regardless of which
   input method the user picked.
   ========================================================= */

const AHP_SAATY_SCALE = [1,2,3,4,5,6,7,8,9];

/* Random Index table (Saaty). Falls back to a standard
   approximation for n beyond the tabulated range. */
const AHP_RI_TABLE = {1:0,2:0,3:0.58,4:0.90,5:1.12,6:1.24,7:1.32,8:1.41,9:1.45,10:1.49,11:1.51,12:1.48,13:1.56,14:1.57,15:1.59};

function ahpGetRI(n){
  if(AHP_RI_TABLE[n] !== undefined) return AHP_RI_TABLE[n];
  return 1.98 * (n - 2) / n; // standard extrapolation for n > 15
}

/* Build an n×n reciprocal matrix from a value array where
   values[i] is item i's "strength" — M[i][j] = values[i]/values[j].
   Used by the Polygon widget. */
function ahpMatrixFromValues(values){
  const n = values.length;
  const M = Array.from({length:n}, () => Array(n).fill(1));
  for(let i=0;i<n;i++) for(let j=0;j<n;j++) M[i][j] = values[i] / values[j];
  return M;
}

/* Approximate eigenvector method: normalize each column,
   then average across each row. This is the standard
   simplified AHP weighting approach. */
function ahpComputeWeights(M){
  const n = M.length;
  const colSum = Array(n).fill(0);
  for(let j=0;j<n;j++) for(let i=0;i<n;i++) colSum[j] += M[i][j];
  return M.map(row => row.reduce((acc, v, j) => acc + (v / colSum[j]), 0) / n);
}

function ahpComputeConsistency(M, weights){
  const n = M.length;
  if(n < 3){
    // 1 or 2 items are always perfectly consistent by definition
    return { lambdaMax:n, CI:0, RI:0, CR:0, consistent:true };
  }
  const Aw = M.map(row => row.reduce((acc, v, j) => acc + v * weights[j], 0));
  const lambdaMax = Aw.reduce((acc, val, i) => acc + (val / weights[i]), 0) / n;
  const CI = (lambdaMax - n) / (n - 1);
  const RI = ahpGetRI(n);
  const CR = RI === 0 ? 0 : CI / RI;
  return { lambdaMax, CI, RI, CR, consistent: CR <= 0.1 };
}

/* Full evaluation of a comparison node: given ids + matrix,
   returns weights and consistency stats together. */
function ahpEvaluateNode(ids, M){
  const weights = ahpComputeWeights(M);
  const cons = ahpComputeConsistency(M, weights);
  return { items: ids, matrix: M, weights, ...cons };
}

/* Trivial node for when there's only 1 item to "compare" —
   it simply gets 100% of the weight, no matrix needed. */
function ahpTrivialNode(ids){
  return {
    items: ids,
    matrix: [[1]],
    weights: ids.map(() => 1),
    lambdaMax: 1, CI:0, RI:0, CR:0, consistent:true, trivial:true
  };
}

/* =========================================================
   Hierarchy aggregation
   Combines: criteria weights -> (optional) sub-criteria local
   weights -> per-leaf alternative local weights, into one
   final score per alternative.
   ========================================================= */
function ahpAggregate(session){
  const { criteria, alternatives, comparisons, useSubCriteria } = session;

  // 1. Criteria weights
  const critIds = criteria.map(c => c.id);
  const critNode = criteria.length <= 1
    ? ahpTrivialNode(critIds)
    : comparisons.criteria;
  const critWeightById = {};
  critIds.forEach((id, i) => critWeightById[id] = critNode.weights[i]);

  // 2. Build the leaf list (leaf = sub-criteria if used & present, else the criteria itself)
  //    and each leaf's local weight within its parent, and global weight.
  const leaves = []; // {id, name, parentId, parentName, globalWeight, isSub}
  const subNodesUsed = {};

  criteria.forEach(c => {
    const hasSubs = useSubCriteria && c.subCriteria && c.subCriteria.length > 0;
    if(hasSubs){
      const subIds = c.subCriteria.map(s => s.id);
      const subNode = c.subCriteria.length <= 1
        ? ahpTrivialNode(subIds)
        : comparisons.subCriteria[c.id];
      subNodesUsed[c.id] = subNode;
      c.subCriteria.forEach((s, i) => {
        leaves.push({
          id: s.id, name: s.name, parentId: c.id, parentName: c.name,
          localWeight: subNode.weights[i],
          globalWeight: critWeightById[c.id] * subNode.weights[i],
          isSub: true
        });
      });
    } else {
      leaves.push({
        id: c.id, name: c.name, parentId: null, parentName: null,
        localWeight: 1,
        globalWeight: critWeightById[c.id],
        isSub: false
      });
    }
  });

  // 3. Alternative local weights per leaf
  const altIds = alternatives.map(a => a.id);
  const altWeightsByLeaf = {}; // leafId -> {altId: weight}
  leaves.forEach(leaf => {
    const node = alternatives.length <= 1
      ? ahpTrivialNode(altIds)
      : comparisons.alternatives[leaf.id];
    const map = {};
    altIds.forEach((id, i) => map[id] = node.weights[i]);
    altWeightsByLeaf[leaf.id] = map;
  });

  // 4. Final scores
  const finalScores = alternatives.map(a => {
    let score = 0;
    leaves.forEach(leaf => {
      score += leaf.globalWeight * altWeightsByLeaf[leaf.id][a.id];
    });
    return { id: a.id, name: a.name, score };
  }).sort((a,b) => b.score - a.score);

  finalScores.forEach((r, i) => r.rank = i + 1);

  return {
    criteriaWeights: critIds.map((id,i) => ({ id, name: criteria[i].name, weight: critWeightById[id] })),
    criteriaNode: critNode,
    leaves,
    subNodesUsed,
    altWeightsByLeaf,
    finalScores
  };
}
