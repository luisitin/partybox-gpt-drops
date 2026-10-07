#!/usr/bin/env python3
"""Offline B04 evidence/data integrity checks; no Nintendo gameplay is executed."""
import argparse,copy,hashlib,json,sys
from collections import Counter
from pathlib import Path
from jsonschema import Draft202012Validator,FormatChecker
from jsonschema.exceptions import ValidationError,SchemaError
ROOT=Path(__file__).resolve().parent
WORKFLOW=ROOT.parent.parent/'.github/workflows/B04.yml'
BOARD_NAMES={'mega-wiggler-tree-party':"Mega Wiggler's Tree Party",'rainbow-galleria':'Rainbow Galleria','goomba-lagoon':'Goomba Lagoon','roll-em-raceway':"Roll 'em Raceway",'king-bowser-keep':"King Bowser's Keep",'mario-rainbow-castle':"Mario's Rainbow Castle",'western-land':'Western Land'}
TYPES={'start','blue','red','event','chance_time','item','vs','rally','lucky','unlucky','bowser'}
def need(ok,msg):
 if not ok:raise AssertionError(msg)
def no_duplicates(pairs):
 d={}
 for k,v in pairs:need(k not in d,'duplicate JSON key '+k);d[k]=v
 return d
def read(n):return json.loads((ROOT/n).read_text(),object_pairs_hook=no_duplicates)
def index(rows,key='id'):
 d={r[key]:r for r in rows};need(len(d)==len(rows),'duplicate '+key);return d
def facts(v):
 if isinstance(v,list):return [f for x in v for f in facts(x)]
 if isinstance(v,dict):return ([v] if {'id','kind','evidence'}<=v.keys() else [])+[f for x in v.values() for f in facts(x)]
 return []
def lineage(f,sources):
 if f['status']=='corroborated':need(len({sources[e['sourceId']]['group'] for e in f['evidence']})>=2,'dependent corroboration '+f['id'])
def profile_ok(p):
 rows=p['counts'];need(len(rows)==11 and {f['value']['type'] for f in rows}==TYPES,'type coverage');need(all(type(f['value']['count']) is int and f['value']['count']>=0 for f in rows),'bad count');need(sum(f['value']['count'] for f in rows)==p['total'],'type sum');need(p['includesStart'] and next(f for f in rows if f['value']['type']=='start')['value']['count']==1,'Start scope')
def context_ok(context,fs):
 need(context['rowsPerPass']==len(context['rows'])==391,'context count');rows=index(context['rows'],'rowId');expected={f['id'] for f in fs.values() if f['kind'] in ['space_count','shop_item']};need(set(rows)==expected,'context coverage')
 for rid,r in rows.items():need(r['passA']==r['passB']=='matched' and r['observedA']==r['observedB']==fs[rid]['value'],'source cell drift '+rid)
def audit_ok(a,boards,fs,maps):
 expected=set(fs)|{b['id']+':board_record' for b in boards}|{b['id']+':map_description' for b in boards}|{b['id']+':profile:'+p['profile'] for b in boards for p in b['spaceCounts']}|{s['id'] for b in boards for s in b['shops']}|{'map_asset:'+m['id'] for m in maps}
 rows=index(a['rows'],'rowId');need(len(rows)==a['rowsPerPass']==593 and set(rows)==expected,'audit coverage');need(a['factStatuses']==dict(Counter(f['status'] for f in fs.values())),'audit verdict count')
 for rid,r in rows.items():need(r['passA']==r['passB']==(fs[rid]['status'] if rid in fs else 'partial' if r['kind']=='board_record' else 'single_source'),'audit status drift')
 return rows
def run(strict=False,hashes=False):
 schema=read('schema.json');Draft202012Validator.check_schema(schema);docs={'boards':read('boards.json'),'sources':read('sources.json'),'maps':read('map-assets.json'),'rowAudit':read('reports/research-row-audit.json'),'sourceAudit':read('reports/source-reopen-audit.json'),'contexts':read('reports/context-checks.json')}
 validators={n:Draft202012Validator({'$ref':'#/$defs/'+n,'$defs':schema['$defs']},format_checker=FormatChecker()) for n in docs};tests=[]
 def passed(n,c):tests.append((n,c));print(f'PASS {n}: {c}/{c}')
 for n,d in docs.items():validators[n].validate(d)
 cap_validator=Draft202012Validator({'$ref':'#/$defs/capture','$defs':schema['$defs']},format_checker=FormatChecker());caps={}
 for p in sorted((ROOT/'reports/source-captures').glob('*.json')):
  c=read(p.relative_to(ROOT));cap_validator.validate(c);need((c['pass'],c['sourceId']) not in caps,'duplicate capture');caps[(c['pass'],c['sourceId'])]=c
 passed('CLOSED_JSON_SCHEMAS',len(docs)+len(caps))
 boards=docs['boards']['boards'];bs=index(boards);ss=index(docs['sources']['sources']);fs=index(facts(docs['boards']));qs={sid:index(s['quotations']) for sid,s in ss.items()};maps=docs['maps']['assets'];index(maps)
 passed('UNIQUE_ID_COLLECTIONS',4+len(ss))
 need(set(bs)==set(BOARD_NAMES) and len(fs)==518,'declared roster/fact count');refs=0
 for b in boards:need(b['name']==BOARD_NAMES[b['id']] and b['presence']['value']=={'name':b['name']} and all(e['quote']==b['name'] for e in b['presence']['evidence']),'roster name drift');need(b['presence']['status']=='corroborated','roster verdict');lineage(b['presence'],ss)
 passed('SEVEN_BOARD_TWO_PUBLISHER_ROSTER',len(bs))
 for f in fs.values():
  need(f['evidence'],'missing fact source');lineage(f,ss)
  for e in f['evidence']:need(e['sourceId'] in ss and e['quoteId'] in qs[e['sourceId']] and qs[e['sourceId']][e['quoteId']]['text']==e['quote'],'bad quotation reference '+f['id']);refs+=1
 passed('EVERY_RECORDED_FACT_HAS_SOURCE',len(fs));passed('FACT_QUOTATION_REFERENCES',refs)
 for s in ss.values():need(all(len(q['text'].split())<=25 for q in s['quotations']) and sum(len(t.split()) for t in {q['text'] for q in s['quotations']})<=200,'quotation budget')
 need(ss['GR_GALLERIA']['group']==ss['DS_BOARDS']['group']=='valnet','dependent Valnet split');need(len({s['group'] for sid,s in ss.items() if sid.startswith('W_')})==1,'wiki lineage split');passed('SHORT_QUOTE_BUDGETS_AND_LINEAGES',len(ss)+2)
 need(set(caps)=={(phase,sid) for phase in ['A','B'] for sid in ss},'capture coverage');recoveries=0
 for (phase,sid),c in caps.items():
  cq=index(c['quotations']);need(c['url']==ss[sid]['url'] and set(cq)==set(qs[sid]) and c['fullPagePublished'] is False,'capture provenance')
  for qid,q in qs[sid].items():need(cq[qid]['text']==q['text'] and cq[qid]['recovered'],'unrecovered quote');recoveries+=1
 passed('EVERY_SOURCE_REOPENED_A_B',len(caps));passed('QUOTATIONS_RECOVERED_BOTH_PASSES',recoveries)
 sr=docs['sourceAudit'];need(sr['sources']==len(ss) and sr['passes']==['A','B'] and not sr['unrecovered'],'source summary');rr={(r['pass'],r['sourceId']):r for r in sr['captures']};need(set(rr)==set(caps) and len(rr)==len(sr['captures']),'source report coverage')
 for key,r in rr.items():need(read(r['capture'])==caps[key] and r['quotationCount']==r['recoveredCount']==len(caps[key]['quotations']),'source report drift')
 passed('SOURCE_CAPTURE_REPORT_REFERENCES',len(rr))
 profiles=[p for b in boards for p in b['spaceCounts']];need(len(profiles)==16,'profile count')
 for p in profiles:profile_ok(p)
 conflict=(ROOT/'CONFLICTS.md').read_text()
 for b in boards:
  for p in b['spaceCounts']:need(b['name'] in conflict and p['profile'] in conflict and str(p['total']) in conflict and p['sourceId'] in conflict,'missing count gap record')
 passed('SPACE_PROFILE_SUMS_AND_CONFLICT_DISCLOSURE',len(profiles));passed('INDIVIDUAL_TYPE_COUNT_ROWS',sum(len(p['counts']) for p in profiles))
 inventories=[s for b in boards for s in b['shops']];need(len(inventories)==35,'shop profile count');need(sum(len(s['inventory']) for s in inventories)==215,'item count');passed('SHOP_INVENTORY_ITEM_ROWS',215)
 context_ok(docs['contexts'],fs);passed('FRESH_SOURCE_CELL_COMPARISONS_A_B',len(docs['contexts']['rows'])*2)
 events=[f for b in boards for f in b['events']];known=0
 for f in events:
  if f['status']=='unverified':need(f['value']['trigger'] is None and f['value']['effect'] is None,'unknown trigger fabricated')
  else:need(f['value']['trigger'] and f['value']['effect'] and f['evidence'],'source/trigger/effect missing');known+=1
 passed('EVENT_TRIGGER_EFFECT_SOURCE_OR_EXPLICIT_GAP',len(events))
 shared={f['id'] for f in docs['boards']['sharedRules']}
 for b in boards:need(set(b['sharedRuleIds'])==shared,'shared rule link drift');need(set(b['tvChanges'])=={k for k in shared if k.startswith('shared:tv_') or k=='shared:no_new_boards'},'TV rule reference drift');need(b['map']['exactNumberedAdjacency'] is None and b['map']['unverified'],'inferred numbered topology')
 passed('SHARED_RULE_REFERENCES',len(shared)*len(boards));passed('CITED_REGIONAL_MAP_LINKS',sum(len(b['map']['links']) for b in boards))
 need(len(maps)==10 and docs['maps']['republishedImages'] is False,'map publication boundary')
 for a in maps:need(all(a[k]['retrieved'] and a[k]['visualReview'] and a[k]['bytes']>0 and len(a[k]['sha256'])==64 for k in ['passA','passB']),'map reopen missing');need(a['passB']['sameBytesAsA']==(a['passA']['sha256']==a['passB']['sha256']),'false map identity')
 passed('MAP_IMAGE_REOPEN_AND_VISUAL_REVIEW_A_B',len(maps)*2)
 audit=audit_ok(docs['rowAudit'],boards,fs,maps);passed('ALL_RETAINED_ROWS_PASS_A',len(audit));passed('ALL_RETAINED_ROWS_PASS_B',len(audit))
 for b in boards:
  t=(ROOT/'boards'/(b['id']+'.md')).read_text();need('## UNVERIFIED' in t and b['map']['description'] in t and all(f['id'] in t for f in b['events']),'board docs drift')
 need(len(list((ROOT/'boards').glob('*.md')))==len(boards),'extra board doc');passed('BOARD_DOCUMENT_REQUIRED_SECTIONS',len(boards))
 for f in fs.values():
  if f['status']=='conflict':need(f['id'] in conflict,'missing source conflict')
 passed('ALL_FACTUAL_CONFLICTS_PRESERVED',sum(f['status']=='conflict' for f in fs.values()))
 negatives=[]
 x=copy.deepcopy(docs['boards']);del x['boards'][0]['stars'];negatives.append(('boards',x))
 x=copy.deepcopy(docs['boards']);x['boards'][0]['spaceCounts'][0]['counts'][0]['value']['count']='one';negatives.append(('boards',x))
 x=copy.deepcopy(docs['boards']);x['boards'][0]['presence']['confidence']='certain';negatives.append(('boards',x))
 x=copy.deepcopy(docs['boards']);x['boards'][0]['presence']['extra']=True;negatives.append(('boards',x))
 x=copy.deepcopy(docs['sources']);x['sources'][0]['url']='bad';negatives.append(('sources',x))
 for n,x in negatives:need(not validators[n].is_valid(x),'schema invalid fixture survived')
 def rejects(action):
  try:action()
  except (AssertionError,ValueError):return
  raise AssertionError('semantic invalid fixture survived')
 broken=copy.deepcopy(profiles[0]);broken['counts'][0]['value']['count']+=1;rejects(lambda:profile_ok(broken))
 broken=copy.deepcopy(profiles[0]);broken['counts'][0]['value']['type']='unknown';rejects(lambda:profile_ok(broken))
 broken=copy.deepcopy(fs);first=next(f for f in broken.values() if f['kind']=='shop_item');first['value']['coins']+=1;rejects(lambda:context_ok(docs['contexts'],broken))
 dual=next(f for f in fs.values() if f['status']=='corroborated');fake=copy.deepcopy(ss)
 for e in dual['evidence']:fake[e['sourceId']]['group']='same-owner'
 rejects(lambda:lineage(dual,fake));broken=copy.deepcopy(docs['rowAudit']);broken['rows'].pop();rejects(lambda:audit_ok(broken,boards,fs,maps));rejects(lambda:index([{'id':'x'},{'id':'x'}]));rejects(lambda:json.loads('{"x":1,"x":2}',object_pairs_hook=no_duplicates));passed('DELIBERATE_REJECTION_FIXTURES',len(negatives)+7)
 files=[f for f in ROOT.rglob('*') if f.is_file() and '__pycache__' not in f.parts];need(WORKFLOW.is_file(),'missing own workflow');files.append(WORKFLOW);need(all(f.stat().st_size<=30_000_000 for f in files),'file size limit');passed('FILE_SIZE_LIMIT',len(files))
 if hashes:
  paths=set()
  for line in (ROOT/'SHA256SUMS.txt').read_text().splitlines():
   digest,rel=line.split('  ',1);target=(ROOT/rel).resolve();need(target.is_file() and (ROOT in target.parents or target==WORKFLOW.resolve()),'unsafe hash path');need(rel not in paths,'duplicate hash path');paths.add(rel);need(hashlib.sha256(target.read_bytes()).hexdigest()==digest,'hash mismatch '+rel)
  expected={f.relative_to(ROOT).as_posix() if ROOT in f.parents else '../../.github/workflows/B04.yml' for f in files if f.name!='SHA256SUMS.txt'};need(paths==expected,'manifest completeness');passed('SHA256_MANIFEST',len(paths))
 print(f'STRUCTURAL_RESULT=PASS; suites={len(tests)}; cases={sum(c for _,c in tests)}; seed=N/A (deterministic)')
 if strict:
  dual=sum(f['status']=='corroborated' for f in fs.values());ok=dual==len(fs) and known==len(events)
  print(f'FULL_FACTS_TWO_SOURCE={dual}/{len(fs)}; '+('PASS' if dual==len(fs) else 'FAIL'));print(f'CURRENT_EVENT_TRIGGER_EFFECT={known}/{len(events)}; '+('PASS' if known==len(events) else 'FAIL'));print('EXACT_NUMBERED_MAPS=0/7; descriptive UNVERIFIED provenance; cited regional maps supplied');print('NINTENDO_GAMEPLAY_EXECUTED=NO');print(f'STRICT_RESEARCH_RESULT={"MET" if ok else "NOT_MET"}; exit={0 if ok else 1}');return 0 if ok else 1
 return 0
def main():
 p=argparse.ArgumentParser(description=__doc__);g=p.add_mutually_exclusive_group(required=True);g.add_argument('--structural',action='store_true');g.add_argument('--strict',action='store_true');p.add_argument('--checksums',action='store_true');a=p.parse_args()
 try:return run(a.strict,a.checksums)
 except (ValidationError,SchemaError) as e:print('VALIDATION_ERROR at '+'.'.join(map(str,e.absolute_path))+': '+e.message,file=sys.stderr);return 2
 except (AssertionError,ValueError,OSError) as e:print('VALIDATION_ERROR: '+str(e),file=sys.stderr);return 2
if __name__=='__main__':raise SystemExit(main())
