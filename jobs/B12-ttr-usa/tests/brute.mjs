/** Exact blind-authored edge-subset oracle copied from sealed selfcheck.mjs. */
function brute(edges) {
  // Independently enumerate every edge subset. A connected subset is a trail
  // exactly when it has zero or two odd vertices (Euler's criterion).
  let maximum=0;
  for(let mask=1;mask<2**edges.length;mask++) {
    const chosen=edges.filter((_,i)=>mask&(1<<i));
    const weight=chosen.reduce((sum,edge)=>sum+edge.length,0);
    if(weight<=maximum)continue;
    const degree=new Map(),adjacency=new Map();
    for(const edge of chosen) {
      degree.set(edge.a,(degree.get(edge.a)??0)+1);degree.set(edge.b,(degree.get(edge.b)??0)+1);
      adjacency.set(edge.a,[...(adjacency.get(edge.a)??[]),edge.b]);
      adjacency.set(edge.b,[...(adjacency.get(edge.b)??[]),edge.a]);
    }
    const odd=[...degree.values()].filter(d=>d%2).length;if(odd>2)continue;
    const reached=new Set([chosen[0].a]),queue=[chosen[0].a];
    for(let i=0;i<queue.length;i++)for(const neighbor of adjacency.get(queue[i]))if(!reached.has(neighbor)){reached.add(neighbor);queue.push(neighbor);}
    if(reached.size===degree.size)maximum=weight;
  }
  return maximum;
}
export {brute};
