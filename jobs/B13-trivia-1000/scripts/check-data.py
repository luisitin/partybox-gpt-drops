#!/usr/bin/env python3
"""Check delivered data and report unfinished research coverage without grading facts."""
import argparse,collections,difflib,hashlib,json,re,statistics
from datetime import datetime,timezone
from urllib.parse import urlparse
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
parser.add_argument('--require-local-captures',action='store_true',help='Acceptance evidence mode: require hash-checked author and second-pass bodies locally; hosted checks otherwise validate immutable receipt/quote metadata only')
parser.add_argument('--exclude-in-progress', action='append', choices=CATEGORIES, default=[], help='Draft integration only: exclude an uncommitted category while its author repairs it')
args=parser.parse_args()
if args.exclude_in_progress and not args.draft:parser.error('Category exclusions are available only for --draft; full acceptance always checks all ten categories')
schema=read(ROOT/'trivia.schema.json',None)
if args.draft:
    schema={k:v for k,v in schema.items() if k not in ['minItems','maxItems']}
validator=Draft202012Validator(schema,format_checker=FormatChecker())
rows=[];sources={};authoring={};errors=[];capture_cache={}
receipt_checks=0;reopen_quote_checks=0;reopen_quote_matches=0;reopen_unavailable=[]
def timestamp(value):
    try:
        parsed=datetime.fromisoformat(value.replace('Z','+00:00'))
        return parsed.tzinfo is not None and parsed.utcoffset().total_seconds()==0 and parsed<=datetime.now(timezone.utc)
    except (ValueError,TypeError,AttributeError):return False
def proof(receipt,url,pass_name,label):
    """Validate retained provenance; never perform or claim a new remote retrieval."""
    global receipt_checks
    receipt_checks+=1;before=len(errors)
    if receipt.get('pass')!=pass_name:errors.append(label+': receipt pass mismatch')
    if receipt.get('status')!=200:errors.append(label+': receipt lacks actual HTTP200')
    if not timestamp(receipt.get('retrievedAt')):errors.append(label+': invalid actual UTC retrieval time')
    if not receipt.get('method'):errors.append(label+': missing retrieval method')
    targets=[receipt.get('requestedUrl'),receipt.get('resolvedUrl')]
    if url not in targets:errors.append(label+': receipt target differs from selected source URL')
    for target in targets:
        if target is not None and (urlparse(target).scheme not in ['https','http'] or not urlparse(target).netloc):errors.append(label+': invalid receipt URL')
    if not re.fullmatch('[a-f0-9]{64}',str(receipt.get('contentSha256',''))):errors.append(label+': invalid capture SHA256')
    relative=receipt.get('capturePath',receipt.get('localCapturePath'))
    if not relative:errors.append(label+': no capture path');return None
    path=(ROOT/relative).resolve()
    if not path.is_relative_to(ROOT.resolve()):errors.append(label+': capture outside job folder');return None
    key=(path,receipt.get('contentSha256'))
    if key not in capture_cache:
        if path.is_file():
            data=path.read_bytes()
            if hashlib.sha256(data).hexdigest()!=receipt.get('contentSha256'):errors.append(label+': capture hash mismatch '+relative);capture_cache[key]=None
            else:capture_cache[key]=' '.join(data.decode().split())
        else:
            capture_cache[key]=None
            if args.require_local_captures:errors.append(label+': required local body missing '+relative)
    return capture_cache[key] if len(errors)==before else None
for category in CATEGORIES:
    if category in args.exclude_in_progress:continue
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
        body=proof(receipt,link['url'],'author',rid+' '+s['sourceId']+' author')
        for field in ['quote','funFactQuote','extraQuote']:
            if field not in link:continue
            q=' '.join(link[field].split());quote_count+=1
            if not 0<len(q.split())<=25:errors.append(rid+': quote word limit '+field)
            if body is None:quote_unavailable.append({'id':rid,'sourceId':s['sourceId'],'field':field})
            elif q not in body:errors.append(rid+': quote absent from actual capture '+s['sourceId']+' '+field)
            else:quote_matches+=1
    if len(owners)==2 and owners[0]==owners[1]:errors.append(rid+': shared editorial owner requires independent replacement')
    for claim in row['claims']:
        if set(claim['sourceIds'])!=set(sids):errors.append(rid+': claim lacks both selected sources')
    r=review_by_id.get(rid)
    if r and r.get('rowSha256')==row_sha and r.get('result')=='accept':
        valid=(bool(r.get('reviewer')) and timestamp(r.get('reviewedAt')) and r.get('distractorsChecked')==row['options']
          and all(bool(r.get(k)) for k in ['attemptedCounterexample','scopeDateCheck','funFactCheck','sourceIndependenceCheck']))
        if valid:review_current.append(rid)
        else:errors.append(rid+': current acceptance lacks actual option/context challenge metadata')
    rr=reopen_by_id.get(rid)
    if rr and rr.get('rowSha256')==row_sha and rr.get('result')=='supported':
        before=len(errors);entries=rr.get('sources',[])
        if len(entries)!=2 or set(x.get('sourceId') for x in entries)!=set(sids):errors.append(rid+': reopen associations differ from selected source pair')
        if not rr.get('reviewer') or not timestamp(rr.get('reviewedAt')) or not rr.get('assessment'):errors.append(rid+': reopen lacks actual reviewer/UTC/context assessment')
        for entry in entries:
            link=next((x for x in row['sources'] if x['sourceId']==entry.get('sourceId')),None)
            if not link:continue
            label=rid+' '+entry['sourceId']+' reopen';rec=entry.get('receipt',{})
            if rec.get('sourceId',rec.get('sourceName',entry['sourceId']))!=entry['sourceId']:errors.append(label+': receipt source identity mismatch')
            if entry.get('contextRead') is not True:errors.append(label+': actual surrounding context not recorded as read')
            if not (entry.get('claimAssessment') or (entry.get('answerAssessment') and entry.get('funFactAssessment'))):errors.append(label+': missing claim-specific support assessment')
            body=proof(rec,link['url'],'reopen',label)
            quoted=entry.get('quotations',[]);by_field={x.get('field'):x for x in quoted}
            if len(quoted)!=len(by_field):errors.append(label+': duplicate quotation associations')
            for field in ['quote','funFactQuote','extraQuote']:
                if field not in link:continue
                q=by_field.get(field);reopen_quote_checks+=1
                if not q or q.get('quote')!=link[field] or q.get('exactMatch') is not True:errors.append(label+': stale/missing exact quotation association '+field);continue
                if not 0<len(q['quote'].split())<=25:errors.append(label+': reopen quotation word limit '+field)
                if body is None:reopen_unavailable.append({'id':rid,'sourceId':entry['sourceId'],'field':field})
                elif ' '.join(q['quote'].split()) not in body:errors.append(label+': selected quote absent from actual reopened body '+field)
                else:reopen_quote_matches+=1
        if len(errors)==before:reopen_current.append(rid)
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
        forward=matcher.ratio()
        reverse=difflib.SequenceMatcher(None,b,a,autojunk=False).ratio()
        ratio=max(forward,reverse)
        if ratio>.8:flags.append({'ids':[rows[i]['id'],rows[j]['id']],
          'rowSha256':[canonical_sha(rows[i]),canonical_sha(rows[j])],'similarity':round(ratio,6),
          'forwardSimilarity':round(forward,6),'reverseSimilarity':round(reverse,6)})
resolutions=read(ROOT/'evidence/similarity-resolutions.json',[])
resolved=[]
for flag in flags:
    entry=next((r for r in resolutions if r.get('ids')==flag['ids'] and r.get('rowSha256')==flag['rowSha256'] and r.get('reason') and r.get('reviewer') and timestamp(r.get('reviewedAt')) and (r.get('decision','').startswith('keep') or r.get('decision') in ['accept-distinct','resolved-distinct'])),None)
    if entry:resolved.append(flag['ids'])
correct_lengths=[len(r['correctAnswer']) for r in rows]
wrong_lengths=[len(o) for r in rows for i,o in enumerate(r['options']) if i!=r['correctIndex']]
longest=[r['id'] for r in rows if len(r['correctAnswer'])>max(len(o) for i,o in enumerate(r['options']) if i!=r['correctIndex'])]
lengths={'unit':'Unicode code points','meanCorrect':average(correct_lengths),'meanIncorrect':average(wrong_lengths),
 'meanOptionByPosition':{str(i):average([len(r['options'][i]) for r in rows]) for i in range(4)},
 'meanCorrectByPosition':{str(i):average([len(r['correctAnswer']) for r in rows if r['correctIndex']==i]) for i in range(4)},
 'uniquelyLongestCorrect':len(longest),'uniquelyLongestCorrectFraction':round(len(longest)/len(rows),5) if rows else None,
 'uniquelyLongestCorrectIds':longest}
row_versions=[{'id':r['id'],'rowSha256':canonical_sha(r)} for r in sorted(rows,key=lambda r:r['id'])]
length_assessment=read(ROOT/'evidence/option-length-assessment.json',{})
length_assessment_current=(length_assessment.get('rowVersionsSha256')==canonical_sha(row_versions)
 and length_assessment.get('metricsSha256')==canonical_sha(lengths)
 and length_assessment.get('result')=='accept'
 and bool(length_assessment.get('reviewer')) and bool(length_assessment.get('reviewedAt'))
 and bool(length_assessment.get('rationale')))
lengths['rowVersionsSha256']=canonical_sha(row_versions)
lengths['metricsSha256']=canonical_sha({k:v for k,v in lengths.items() if k not in ['rowVersionsSha256','metricsSha256']})
lengths['editorialAssessment']='ACCEPTED: current version-bound editorial review.' if length_assessment_current else 'PENDING: metrics alone do not certify absence of answer-length clues.'
cycling_hits=sum(r['correctIndex']==(int(r['id'][4:])-1)%4 for r in rows)
position_pattern={'numericIdModulo4Matches':cycling_hits,'rows':len(rows),'knownDraftCycleStillExact':bool(rows) and cycling_hits==len(rows),'interpretation':'The original exact A/B/C/D cycle gives100% answer prediction despite balanced totals. Final order must remove that demonstrated clue; descriptive counts do not themselves certify randomness.'}
pending={'targetRowsMissing':max(0,1000-len(rows)),'adversarialNotCurrent':len(rows)-len(review_current),
 'reopenNotCurrent':len(rows)-len(reopen_current),'similarityFlagsUnresolved':len(flags)-len(resolved),
 'knownExactAnswerCycle':position_pattern['knownDraftCycleStillExact'],
 'optionLengthEditorialAssessment':None if length_assessment_current else 'PENDING'}
if not args.draft:
    for k,v in pending.items():
        if v:errors.append(f'Unfinished gate {k}: {v}')
report={'mode':'draft' if args.draft else 'full','captureProofMode':'required local author and second-pass bodies' if args.require_local_captures else 'immutable receipts/quotations; available local bodies checked; hosted run does not retrieve remote sources','excludedInProgressCategories':args.exclude_in_progress,'rows':len(rows),'categories':balances,
 'sourceRecords':len(sources),'quoteFields':quote_count,'quoteMatchesActualLocalCaptures':quote_matches,
 'quoteCapturesUnavailable':quote_unavailable,'schemaAndDataErrors':errors,
 'receiptAssociationsChecked':receipt_checks,'reopenQuoteAssociationsChecked':reopen_quote_checks,'reopenQuoteMatchesActualLocalCaptures':reopen_quote_matches,'reopenQuoteCapturesUnavailable':reopen_unavailable,
 'adversarialAcceptedCurrent':len(review_current),'reopenSupportedCurrent':len(reopen_current),
 'similarityMethod':'Casefold, replace nonword sequences with spaces, maximum of both SequenceMatcher character-ratio directions >0.8; autojunk disabled.',
 'similarityFlags':flags,'similarityFlagsResolved':len(resolved),'optionLengths':lengths,'answerPositionPattern':position_pattern,'pending':pending,
 'researchComplete':not errors and not any(pending.values())}
out=ROOT/args.output;out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:report[k] for k in ['mode','rows','sourceRecords','quoteFields','quoteMatchesActualLocalCaptures','schemaAndDataErrors','adversarialAcceptedCurrent','reopenSupportedCurrent','similarityFlagsResolved','pending','researchComplete']},indent=2))
print('Similarity flags:',len(flags),'Report:',str(out.relative_to(ROOT)))
raise SystemExit(1 if errors else 0)
