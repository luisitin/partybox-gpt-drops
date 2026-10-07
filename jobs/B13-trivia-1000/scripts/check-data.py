#!/usr/bin/env python3
"""Check delivered data and report unfinished research coverage without grading facts."""
import argparse,collections,difflib,hashlib,json,re,statistics
from pathlib import Path
from jsonschema import Draft202012Validator,FormatChecker

ROOT=Path(__file__).resolve().parents[1]
CATEGORIES=['us-geography','world-geography','science-space','animals-nature',
 'us-history-civics','world-history','movies-tv','music','sports-games','food-everyday-life']
def canonical_sha(value):
    return hashlib.sha256(json.dumps(value,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def read(path,default):
    return json.loads(path.read_text()) if path.exists() else default
def norm(text):return re.sub(r'[^\w]+',' ',text.casefold()).strip()
def average(values):return round(statistics.mean(values),4) if values else None
parser=argparse.ArgumentParser()
parser.add_argument('--draft',action='store_true',help='Allow incomplete row and review counts, still reject actual data errors')
parser.add_argument('--output',default='reports/checks.json')
args=parser.parse_args()
schema=read(ROOT/'trivia.schema.json',None)
if args.draft:
    schema={k:v for k,v in schema.items() if k not in ['minItems','maxItems']}
validator=Draft202012Validator(schema,format_checker=FormatChecker())
rows=[];sources={};authoring={};errors=[];capture_cache={}
for category in CATEGORIES:
    group=read(ROOT/f'categories/{category}.json',[])
    for row in group:
        if row.get('category')!=category:errors.append(f'{row.get("id")}: wrong category file')
    rows.extend(group)
    for s in read(ROOT/f'evidence/{category}-sources.json',[]):
        if s['sourceId'] in sources:errors.append('Duplicate source ID '+s['sourceId'])
        sources[s['sourceId']]=s
    for a in read(ROOT/f'evidence/{category}-authoring.json',[]):
        if a['id'] in authoring:errors.append('Duplicate authoring ID '+a['id'])
        authoring[a['id']]=a
for error in validator.iter_errors(rows):errors.append(f'Schema {list(error.absolute_path)}: {error.message}')
ids=[r.get('id') for r in rows]
if len(ids)!=len(set(ids)):errors.append('Duplicate row IDs')
quote_count=0;quote_matches=0;quote_unavailable=[];review_current=[];reopen_current=[]
reviews=[];reopen=[]
for path in sorted((ROOT/'reviews').glob('*-adversarial.json')) if (ROOT/'reviews').exists() else []:
    reviews.extend(read(path,[]))
for path in sorted((ROOT/'reviews').glob('*-reopen.json')) if (ROOT/'reviews').exists() else []:
    reopen.extend(read(path,[]))
review_by_id={r['id']:r for r in reviews};reopen_by_id={r['id']:r for r in reopen}
for row in rows:
    rid=row['id'];category=row['category'];number=int(rid[4:]);idx=CATEGORIES.index(category)
    if not idx*100+1<=number<=(idx+1)*100:errors.append(rid+': out of assigned ID range')
    if row['correctAnswer']!=row['options'][row['correctIndex']]:errors.append(rid+': correctAnswer/index mismatch')
    if len({o.casefold().strip() for o in row['options']})!=4:errors.append(rid+': repeated normalized option')
    row_sha=canonical_sha(row);a=authoring.get(rid)
    if not a or a.get('rowSha256')!=row_sha:errors.append(rid+': missing/stale authoring hash')
    sids=[s['sourceId'] for s in row['sources']]
    if len(set(sids))!=2:errors.append(rid+': need distinct source IDs')
    owners=[]
    for link in row['sources']:
        s=sources.get(link['sourceId'])
        if not s:errors.append(rid+': missing source ledger '+link['sourceId']);continue
        if link['url']!=s['url']:errors.append(rid+': source URL/ledger mismatch')
        owners.append(s['editorialOwner'])
        receipt=next((r for r in s['retrievals'] if r['pass']=='author' and r.get('contentSha256')),None)
        if not receipt:errors.append(rid+': no successful author retrieval');continue
        path=ROOT/receipt.get('capturePath',receipt.get('localCapturePath',''))
        if path not in capture_cache:
            if path.is_file():
                data=path.read_bytes()
                if hashlib.sha256(data).hexdigest()!=receipt['contentSha256']:errors.append(rid+': capture hash mismatch '+str(path))
                capture_cache[path]=' '.join(data.decode().split())
            else:capture_cache[path]=None
        for field in ['quote','funFactQuote']:
            if field not in link:continue
            q=' '.join(link[field].split());quote_count+=1
            if not 0<len(q.split())<=25:errors.append(rid+': quote word limit '+field)
            if capture_cache[path] is None:quote_unavailable.append({'id':rid,'sourceId':s['sourceId'],'field':field})
            elif q not in capture_cache[path]:errors.append(rid+': quote absent from actual capture '+s['sourceId']+' '+field)
            else:quote_matches+=1
    if len(owners)==2 and owners[0]==owners[1]:errors.append(rid+': shared editorial owner requires independent replacement')
    for claim in row['claims']:
        if set(claim['sourceIds'])!=set(sids):errors.append(rid+': claim lacks both selected sources')
    r=review_by_id.get(rid)
    if r and r.get('rowSha256')==row_sha and r.get('result')=='accept':review_current.append(rid)
    rr=reopen_by_id.get(rid)
    if rr and rr.get('rowSha256')==row_sha and rr.get('result')=='supported' and set(x['sourceId'] for x in rr.get('sources',[]))==set(sids):reopen_current.append(rid)
balances={}
for c in CATEGORIES:
    group=[r for r in rows if r['category']==c]
    difficulty=dict(sorted(collections.Counter(r['difficulty'] for r in group).items()))
    positions=dict(sorted(collections.Counter(r['correctIndex'] for r in group).items()))
    balances[c]={'rows':len(group),'difficulty':difficulty,'correctPositions':positions}
    if not args.draft or len(group)==100:
        if len(group)!=100:errors.append(c+': category must have100 rows')
        if difficulty!={1:34,2:33,3:33}:errors.append(c+': difficulty imbalance')
        if positions!={0:25,1:25,2:25,3:25}:errors.append(c+': position imbalance')
normalized=[norm(r['question']) for r in rows];flags=[]
for i in range(len(rows)):
    for j in range(i+1,len(rows)):
        a,b=normalized[i],normalized[j]
        matcher=difflib.SequenceMatcher(None,a,b,autojunk=False)
        if matcher.real_quick_ratio()<=.8 or matcher.quick_ratio()<=.8:continue
        ratio=matcher.ratio()
        if ratio>.8:flags.append({'ids':[rows[i]['id'],rows[j]['id']],
          'rowSha256':[canonical_sha(rows[i]),canonical_sha(rows[j])],'similarity':round(ratio,6)})
resolutions=read(ROOT/'evidence/similarity-resolutions.json',[])
resolved=[]
for flag in flags:
    entry=next((r for r in resolutions if r.get('ids')==flag['ids'] and r.get('rowSha256')==flag['rowSha256'] and r.get('reason') and r.get('reviewer')),None)
    if entry:resolved.append(flag['ids'])
correct_lengths=[len(r['correctAnswer']) for r in rows]
wrong_lengths=[len(o) for r in rows for i,o in enumerate(r['options']) if i!=r['correctIndex']]
longest=[r['id'] for r in rows if len(r['correctAnswer'])>max(len(o) for i,o in enumerate(r['options']) if i!=r['correctIndex'])]
lengths={'unit':'Unicode code points','meanCorrect':average(correct_lengths),'meanIncorrect':average(wrong_lengths),
 'meanOptionByPosition':{str(i):average([len(r['options'][i]) for r in rows]) for i in range(4)},
 'meanCorrectByPosition':{str(i):average([len(r['correctAnswer']) for r in rows if r['correctIndex']==i]) for i in range(4)},
 'uniquelyLongestCorrect':len(longest),'uniquelyLongestCorrectFraction':round(len(longest)/len(rows),5) if rows else None,
 'uniquelyLongestCorrectIds':longest,'editorialAssessment':'PENDING: metrics alone do not certify absence of answer-length clues.'}
pending={'targetRowsMissing':max(0,1000-len(rows)),'adversarialNotCurrent':len(rows)-len(review_current),
 'reopenNotCurrent':len(rows)-len(reopen_current),'similarityFlagsUnresolved':len(flags)-len(resolved),
 'optionLengthEditorialAssessment':'PENDING'}
if not args.draft:
    for k,v in pending.items():
        if v:errors.append(f'Unfinished gate {k}: {v}')
report={'mode':'draft' if args.draft else 'full','rows':len(rows),'categories':balances,
 'sourceRecords':len(sources),'quoteFields':quote_count,'quoteMatchesActualLocalCaptures':quote_matches,
 'quoteCapturesUnavailable':quote_unavailable,'schemaAndDataErrors':errors,
 'adversarialAcceptedCurrent':len(review_current),'reopenSupportedCurrent':len(reopen_current),
 'similarityMethod':'Casefold, replace nonword sequences with spaces, SequenceMatcher character ratio >0.8; autojunk disabled.',
 'similarityFlags':flags,'similarityFlagsResolved':len(resolved),'optionLengths':lengths,'pending':pending,
 'researchComplete':not errors and not any(pending.values())}
out=ROOT/args.output;out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:report[k] for k in ['mode','rows','sourceRecords','quoteFields','quoteMatchesActualLocalCaptures','schemaAndDataErrors','adversarialAcceptedCurrent','reopenSupportedCurrent','similarityFlagsResolved','pending','researchComplete']},indent=2))
print('Similarity flags:',len(flags),'Report:',str(out.relative_to(ROOT)))
raise SystemExit(1 if errors else 0)
