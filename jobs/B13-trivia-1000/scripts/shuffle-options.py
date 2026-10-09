#!/usr/bin/env python3
"""One-time reproducible balanced final permutations, preserving all old evidence."""
import collections,copy,hashlib,json,random,subprocess,sys
from datetime import datetime,timezone
from pathlib import Path
R=Path(__file__).resolve().parents[1];C=['us-geography','world-geography','science-space','animals-nature','us-history-civics','world-history','movies-tv','music','sports-games','food-everyday-life'];ROOT_SEED=20261007
def h(x):return hashlib.sha256(json.dumps(x,sort_keys=True,separators=(',',':')).encode()).hexdigest()
target=R/'evidence/final-option-permutation-manifest.json'
if target.exists():raise SystemExit('Immutable final permutation already exists; do not overwrite or reshuffle reviewed versions.')
before={'capturedAt':datetime.now(timezone.utc).isoformat(),'githubParentCommit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=R,text=True).strip(),'categories':{}}
manifest={'rootSeed':ROOT_SEED,'method':'Each category seeds Python random.Random with the integer SHA256 of partybox/B13/final-options/20261007/<category>. Shuffle a multiset of25each correct index, then shuffle each row’s three wrong options before inserting its unchanged correct answer at that index. Facts, confidence, difficulty, claims and citations unchanged.','pythonVersion':sys.version,'createdAt':datetime.now(timezone.utc).isoformat(),'categories':{},'rows':[],'reviewStatus':'Pending: every assigned independent reviewer must actually read every final ordered choice set. Old acceptance hashes are not migrated by this script.'}
planned=[]
for cat in C:
 p=R/f'categories/{cat}.json';a=R/f'evidence/{cat}-authoring.json';rows=json.loads(p.read_text());authors=json.loads(a.read_text());ab={x['id']:x for x in authors};rv=json.loads((R/f'reviews/{cat}-adversarial.json').read_text());rr=json.loads((R/f'reviews/{cat}-reopen.json').read_text());rb={x['id']:x for x in rv};rrb={x['id']:x for x in rr}
 assert len(rows)==len(authors)==len(rv)==len(rr)==100
 for row in rows:
  rid=row['id'];sha=h(row);assert ab[rid]['rowSha256']==sha and rb[rid]['rowSha256']==sha and rb[rid]['result']=='accept' and rrb[rid]['rowSha256']==sha and rrb[rid]['result']=='supported',(rid,'unclosed original gate')
 before['categories'][cat]={'categoryFileSha256':hashlib.sha256(p.read_bytes()).hexdigest(),'rows':copy.deepcopy(rows),'authoring':copy.deepcopy(authors),'adversarial':rv,'reopens':rr}
 seed_text=f'partybox/B13/final-options/{ROOT_SEED}/{cat}';seed_sha=hashlib.sha256(seed_text.encode()).hexdigest();rng=random.Random(int(seed_sha,16));positions=[i for i in range(4) for _ in range(25)];rng.shuffle(positions)
 original_hits=sum(r['correctIndex']==(int(r['id'][-4:])-1)%4 for r in rows)
 for row,position in zip(rows,positions):
  old=copy.deepcopy(row);wrong=[x for i,x in enumerate(old['options']) if i!=old['correctIndex']];rng.shuffle(wrong);wrong.insert(position,row['correctAnswer']);row['options']=wrong;row['correctIndex']=position
  assert sorted(row['options'])==sorted(old['options']) and row['options'][position]==old['correctAnswer']
  unchanged_old={k:v for k,v in old.items() if k not in ['options','correctIndex']};unchanged_new={k:v for k,v in row.items() if k not in ['options','correctIndex']};assert unchanged_old==unchanged_new
  ab[row['id']]['rowSha256']=h(row)
  manifest['rows'].append({'id':row['id'],'category':cat,'previousRowSha256':h(old),'finalRowSha256':h(row),'previousCorrectIndex':old['correctIndex'],'finalCorrectIndex':position,'previousOptions':old['options'],'finalOptions':row['options'],'newToOldPermutation':[old['options'].index(x) for x in row['options']]})
 assert collections.Counter(r['correctIndex'] for r in rows)=={0:25,1:25,2:25,3:25}
 assert collections.Counter(r['difficulty'] for r in rows)=={1:34,2:33,3:33}
 encoded=json.dumps(rows,indent=2,ensure_ascii=False)+'\n';author_encoded=json.dumps(authors,indent=2,ensure_ascii=False)+'\n';manifest['categories'][cat]={'seedInput':seed_text,'categorySeedSha256':seed_sha,'previousCategoryFileSha256':before['categories'][cat]['categoryFileSha256'],'finalCategoryFileSha256':hashlib.sha256(encoded.encode()).hexdigest(),'correctPositionCounts':dict(sorted(collections.Counter(r['correctIndex'] for r in rows).items())),'previousNumericIdModulo4Matches':original_hits,'finalNumericIdModulo4Matches':sum(r['correctIndex']==(int(r['id'][-4:])-1)%4 for r in rows),'finalPositionSequence':[r['correctIndex'] for r in rows]};planned.extend([(p,encoded),(a,author_encoded)])
sequences=[x['finalPositionSequence'] for x in manifest['categories'].values()];assert len({tuple(x) for x in sequences})==10
manifest['previousRowVersionsSha256']=h([{'id':x['id'],'rowSha256':x['previousRowSha256']} for x in sorted(manifest['rows'],key=lambda x:x['id'])]);manifest['finalRowVersionsSha256']=h([{'id':x['id'],'rowSha256':x['finalRowSha256']} for x in sorted(manifest['rows'],key=lambda x:x['id'])]);manifest['unchangedFactFieldsVerified']=1000
(R/'evidence/pre-final-option-shuffle-snapshot.json').write_text(json.dumps(before,indent=2)+'\n')
for p,encoded in planned:p.write_text(encoded)
target.write_text(json.dumps(manifest,indent=2)+'\n');print(json.dumps({'manifest':str(target.relative_to(R)),'finalRowVersionsSha256':manifest['finalRowVersionsSha256'],'categories':{c:x['finalCategoryFileSha256'] for c,x in manifest['categories'].items()},'correctPositions':{c:x['correctPositionCounts'] for c,x in manifest['categories'].items()}},indent=2))
