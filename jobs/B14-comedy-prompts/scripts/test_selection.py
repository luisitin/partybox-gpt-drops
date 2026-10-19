import importlib.util,itertools,json,random,datetime
from pathlib import Path
from collections import Counter
job=Path(__file__).resolve().parents[1];w=job/'.work/selection-controls';w.mkdir(parents=True,exist_ok=True);spec=importlib.util.spec_from_file_location('ranked',job/'scripts/ranked_selection.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
def oracle(rows,second,aliases,excluded,quotas,cap):
 eligible=[r for r in rows if r['id'] not in excluded and r['firstPass']['grade']>=4 and second[r['id']]['grade']>=4]
 ordered=sorted(eligible,key=lambda r:(-min(r['firstPass']['grade'],second[r['id']]['grade']),-r['firstPass']['grade']-second[r['id']]['grade'],-second[r['id']]['grade'],r['id']))
 best=None;bestids=None;ranked=[r['id'] for r in ordered]
 for combination in itertools.combinations(eligible,sum(quotas.values())):
  if Counter(r['kind'] for r in combination)!=quotas:continue
  counts=Counter(aliases.get(r['namedReferences'][0],r['namedReferences'][0]) for r in combination)
  if max(counts.values(),default=0)>cap:continue
  ids={r['id'] for r in combination};inclusion=tuple(i in ids for i in ranked)
  if best is None or inclusion>best:best=inclusion;bestids=sorted(ids)
 return bestids
cases=0;infeasible=0
for seed in [1,2,3]:
 rng=random.Random(seed)
 for index in range(200):
  n=rng.randrange(4,10);rows=[];second={}
  for j in range(n):
   id=('Q' if j%2 else 'M')+str(j).zfill(4);rows.append({'id':id,'kind':'fill' if j%2 else 'most-likely','firstPass':{'grade':rng.choice([3,4,5])},'namedReferences':[rng.choice(['A','A-alias','B','C','D'])]});second[id]={'grade':rng.choice([3,4,5])}
  aliases={'A-alias':'A'};excluded={r['id'] for r in rows if rng.randrange(10)==0};quotas={'fill':rng.randrange(1,3),'most-likely':rng.randrange(1,3)};cap=rng.randrange(1,3)
  expected=oracle(rows,second,aliases,excluded,quotas,cap)
  try:got=sorted(r['id'] for r in m.select(rows,second,aliases,excluded,quotas,cap))
  except ValueError:got=None;infeasible+=1
  assert got==expected,{'seed':seed,'case':index,'expected':expected,'actual':got}
  cases+=1
# Taking the strongest fill first can make the other genre impossible.
rows=[{'id':'Q0','kind':'fill','firstPass':{'grade':5},'namedReferences':['A']},{'id':'Q1','kind':'fill','firstPass':{'grade':4},'namedReferences':['B']},{'id':'M0','kind':'most-likely','firstPass':{'grade':4},'namedReferences':['A']}];second={r['id']:{'grade':r['firstPass']['grade']} for r in rows}
got=sorted(r['id'] for r in m.select(rows,second,{},set(),{'fill':1,'most-likely':1},1));assert got==['M0','Q1']
receipt={'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'independentExhaustiveSubsetOracleCases':cases,'seeds':[1,2,3],'expectedInfeasibleCases':infeasible,'greedyGenreTrapControl':got,'allPassed':True,'scope':'Actual independent exhaustive subset oracle checks exact lexicographic inclusion, both genre quotas, shared canonical caps, aliases, exclusions, grade eligibility and infeasible packs; no oracle wraps production selector.'}
(w/'RANKED-SELECTION-EXHAUSTIVE-CONTROLS.json').write_text(json.dumps(receipt,indent=2)+'\n');print(json.dumps(receipt,indent=2))
