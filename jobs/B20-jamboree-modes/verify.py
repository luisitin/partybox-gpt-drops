#!/usr/bin/env python3
"""Offline B20 data/spec checks. Research truth and gameplay execution are separate."""
import argparse,copy,hashlib,json,sys,runpy
from collections import Counter
from pathlib import Path
from jsonschema import Draft202012Validator,FormatChecker
from jsonschema.exceptions import ValidationError,SchemaError
ROOT=Path(__file__).resolve().parent
WORKFLOW=ROOT.parent.parent/'.github/workflows/B20.yml'
MAX_BYTES=30_000_000
def require(ok,msg):
 if not ok:raise AssertionError(msg)
def no_duplicate_keys(pairs):
 d={}
 for k,v in pairs:
  if k in d:raise ValueError('duplicate JSON key '+k)
  d[k]=v
 return d
def load(rel):return json.loads((ROOT/rel).read_text(),object_pairs_hook=no_duplicate_keys)
def index(rows,key='id'):
 d={x[key]:x for x in rows};require(len(d)==len(rows),'duplicate '+key);return d
def groups_ok(f,sources):
 if f['status']=='corroborated':require(len({sources[e['sourceId']]['group'] for e in f['evidence']})>=2,'dependent full-claim corroboration '+f['id'])
def graph_ok(spec):
 require(spec['basis']=='original_phone_tv_proposal','proposal mislabeled as Nintendo observation')
 phases=index(spec['phases']);require(spec['initialPhase'] in phases and spec['terminalPhase'] in phases,'orphan entry/terminal')
 terminal=spec['terminalPhase'];require(not phases[terminal]['inputs'],'terminal accepts inputs')
 inputs={'join','ready','leave','choice','tap','move','aim','fire','interact'}
 for pid,p in phases.items():
  require(p['basis']=='original_phone_tv_proposal' and p['confidence'] in ['high','medium','low'],'phase provenance')
  require(p['exits'] and all(e['target'] in phases and e['guard'] and e['effects'] for e in p['exits']),'exitless or orphan phase')
  require(set(p['inputs'])<=inputs,'unknown phone input')
  require(p['timerSeconds'] is None or isinstance(p['timerSeconds'],int) and 0<p['timerSeconds']<=3600,'invalid proposed timer')
  if p['timerSeconds'] is not None:require(any(e['event']=='deadline' for e in p['exits']),'timed phase lacks deadline exit')
  if pid not in [terminal,'results']:require(any(e['event']=='cancel' for e in p['exits']),'missing global-cap/host exit')
  seen=set();todo=[pid]
  while todo:
   current=todo.pop()
   if current in seen:continue
   seen.add(current);todo += [e['target'] for e in phases[current]['exits'] if e['target'] not in seen]
  require(terminal in seen,'no reachable terminal from '+pid)
 require(phases['play']['timerSeconds']==spec['adapter']['playSeconds'],'adapter/play cap drift')
def audit_ok(audit,modes,facts):
 rows=index(audit['rows'],'rowId');expected={'mode:'+mid for mid in modes}|{'rule:'+fid for fid in facts}|{'phase:'+mid+':'+p['id'] for mid,m in modes.items() for p in m['phoneTvSpec']['phases']}
 require(set(rows)==expected,'audit coverage missing/extra rows')
 for rid,r in rows.items():
  expected_status='proposal_reviewed' if rid.startswith('phase:') else 'corroborated' if rid.startswith('mode:') else facts[rid.split(':',1)[1]]['status']
  require(r['passA']==r['passB']==expected_status,'audit outcome drift')
  if rid.startswith('phase:'):require(not r['sourceIds'] and r['basis']=='original design; no Nintendo factual assertion','proposal claimed as source fact')
 require(audit['ruleStatuses']==dict(Counter(f['status'] for f in facts.values())),'audit status counts drift')
 return len(rows)
def run(strict=False,checksums=False):
 schema=load('schema.json');Draft202012Validator.check_schema(schema)
 validator=lambda name:Draft202012Validator({'$ref':'#/$defs/'+name,'$defs':schema['$defs']},format_checker=FormatChecker())
 docs={'modes':load('modes.json'),'rules':load('rules.json'),'sources':load('sources.json'),'protocol':load('phone-tv-protocol.json'),'rowAudit':load('reports/research-row-audit.json'),'sourceAudit':load('reports/source-reopen-audit.json')}
 validators={k:validator(k) for k in docs};tests=[]
 def passed(name,cases):tests.append((name,cases));print(f'PASS {name}: {cases}/{cases}')
 for name,d in docs.items():validators[name].validate(d)
 captures={}
 for f in sorted((ROOT/'reports/source-captures').glob('*.json')):
  c=load(f.relative_to(ROOT));validator('capture').validate(c);require((c['pass'],c['sourceId']) not in captures,'duplicate capture');captures[(c['pass'],c['sourceId'])]=c
 passed('CLOSED_JSON_SCHEMAS',len(docs)+len(captures))
 modes=index(docs['modes']['modes']);facts=index(docs['rules']['rules']);sources=index(docs['sources']['sources']);quotes={sid:index(s['quotations']) for sid,s in sources.items()}
 passed('UNIQUE_ID_COLLECTIONS',3+len(sources))
 require(len(modes)==28 and sum(m['parent'] is None for m in modes.values())==13,'declared roster scope drift')
 for m in modes.values():
  require(m['parent'] is None or m['parent'] in modes,'orphan parent')
  require(len({sources[e['sourceId']]['group'] for e in m['presence']['evidence']})>=2,'dependent roster corroboration')
  require(m['presence']['status']=='corroborated','roster status drift')
 passed('MODE_LIST_TWO_PUBLISHER_LINEAGES',len(modes))
 refs=0
 for label,evidence in [(m['id'],m['presence']['evidence']) for m in modes.values()]+[(f['id'],f['evidence']) for f in facts.values()]:
  require(evidence,'non-null rule without source')
  for e in evidence:
   require(e['sourceId'] in sources and e['quoteId'] in quotes[e['sourceId']],'orphan citation '+label)
   require(quotes[e['sourceId']][e['quoteId']]['text']==e['quote'],'quotation registry mismatch '+label);refs+=1
 for f in facts.values():require(f['mode'] in modes,'orphan mode fact');groups_ok(f,sources)
 passed('EVERY_RECORDED_RULE_HAS_SOURCE',len(facts))
 passed('SOURCE_QUOTATION_REFERENCES',refs)
 for s in sources.values():
  require(all(len(q['text'].split())<=25 for q in s['quotations']),'individual quote >25 words')
  require(sum(len(t.split()) for t in {q['text'] for q in s['quotations']})<=200,'unique source quotation budget >200 words')
 for prefix in ['W_','N_','TG']:
  groups={s['group'] for sid,s in sources.items() if sid.startswith(prefix)};require(len(groups)==1,'same-publisher lineage split')
 passed('QUOTE_BUDGETS_AND_LINEAGE_GUARDS',len(sources)+3)
 recovered=0
 require(set(captures)=={(phase,sid) for phase in ['A','B'] for sid in sources},'capture coverage')
 for (phase,sid),c in captures.items():
  require(c['url']==sources[sid]['url'],'capture URL drift');qs=index(c['quotations']);require(set(qs)==set(quotes[sid]),'capture quote coverage drift')
  for qid,q in quotes[sid].items():require(qs[qid]['text']==q['text'] and qs[qid]['recovered'],'quotation not recovered');recovered+=1
 passed('SOURCE_REOPEN_PASSES',len(captures))
 passed('QUOTATIONS_RECOVERED_IN_BOTH_PASSES',recovered)
 report=docs['sourceAudit'];require(report['sources']==len(sources) and report['passes']==['A','B'],'reopen summary drift')
 reportrows={(r['pass'],r['sourceId']):r for r in report['captures']};require(set(reportrows)==set(captures) and len(reportrows)==len(report['captures']),'reopen summary coverage')
 for pair,r in reportrows.items():
  require(r['quotationCount']==r['recoveredCount']==len(captures[pair]['quotations']),'reopen count drift')
  require(load(r['capture'])==captures[pair],'reopen report link drift')
 passed('SOURCE_REPORT_COUNTS_AND_LINKS',len(reportrows))
 coverage=0;gaps=0;phase_count=0;phase_exits=0
 for mid,m in modes.items():
  require(set(m['rules'])=={f['id'] for f in facts.values() if f['mode']==mid},'local fact list drift')
  require(set(m['inheritedRuleIds'])=={f['id'] for f in facts.values() if m['parent'] and f['mode']==m['parent']},'inheritance drift')
  linked=set(m['rules']+m['inheritedRuleIds'])
  for field,ids in m['coverage'].items():
   require(all(fid in linked and facts[fid]['field']==field for fid in ids),'field coverage mismatch');coverage+=1
   if not ids:gaps+=1;require(any(x.startswith(field+':') for x in m['unverified']),'hidden field gap')
  require(all(cid in modes and modes[cid]['parent']==mid for cid in m['phoneTvSpec']['children']),'child selector drift')
  graph_ok(m['phoneTvSpec']);phase_count+=len(m['phoneTvSpec']['phases']);phase_exits+=sum(len(p['exits']) for p in m['phoneTvSpec']['phases'])
 passed('RULE_LINKS_AND_EXPLICIT_FIELD_GAPS',coverage)
 passed('ORIGINAL_PROPOSAL_PHASE_EXIT_GRAPHS',phase_count)
 passed('PHASE_TRANSITION_TARGETS_AND_GUARDS',phase_exits)
 require(docs['protocol']['basis']=='original_phone_tv_proposal' and '3600' in docs['protocol']['globalExit'],'protocol provenance/finite cap')
 passed('PHONE_TV_PROTOCOL_BOUNDARY',1)
 row_count=audit_ok(docs['rowAudit'],modes,facts)
 passed('FULL_RETAINED_ROW_PASS_A',row_count);passed('FULL_RETAINED_ROW_PASS_B',row_count)
 passed('BUDDY_TAG_RECOVERY_SCOPE',runpy.run_path(str(ROOT/'_buddy_tag_scope.py'))['run_checks']()['assertions'])
 for mid,m in modes.items():
  f=ROOT/'modes'/(mid+'.md');require(f.is_file(),'missing mode document');t=f.read_text();require('Original adaptation proposal' in t and '## UNVERIFIED' in t and all(p['id'] in t for p in m['phoneTvSpec']['phases']),'mode document coverage')
 require(len(list((ROOT/'modes').glob('*.md')))==len(modes),'extra mode doc')
 passed('MODE_DOCUMENT_COVERAGE',len(modes))
 negatives=[]
 x=copy.deepcopy(docs['modes']);del x['modes'][0]['phoneTvSpec'];negatives.append(('modes',x))
 x=copy.deepcopy(docs['rules']);x['rules'][0]['value']={'turns':'twelve'};negatives.append(('rules',x))
 x=copy.deepcopy(docs['rules']);x['rules'][0]['confidence']='certain';negatives.append(('rules',x))
 x=copy.deepcopy(docs['rules']);x['rules'][0]['extra']=True;negatives.append(('rules',x))
 x=copy.deepcopy(docs['sources']);x['sources'][0]['url']='bad';negatives.append(('sources',x))
 for name,x in negatives:require(not validators[name].is_valid(x),'schema negative survived')
 def rejects(action):
  try:action()
  except (AssertionError,ValueError):return
  raise AssertionError('semantic negative survived')
 broken=copy.deepcopy(next(iter(modes.values()))['phoneTvSpec']);broken['phases'][0]['exits'][0]['target']='missing';rejects(lambda:graph_ok(broken))
 broken=copy.deepcopy(next(iter(modes.values()))['phoneTvSpec']);broken['phases'][0]['exits']=[];rejects(lambda:graph_ok(broken))
 broken=copy.deepcopy(next(iter(modes.values()))['phoneTvSpec']);broken['phases'][0]['exits']=[{'event':'deadline','target':'lobby','guard':'always','effects':['repeat']}];rejects(lambda:graph_ok(broken))
 dual=next(f for f in facts.values() if f['status']=='corroborated');fake=copy.deepcopy(sources)
 for e in dual['evidence']:fake[e['sourceId']]['group']='one-dependent-group'
 rejects(lambda:groups_ok(dual,fake));bad=copy.deepcopy(docs['rowAudit']);bad['rows'].pop();rejects(lambda:audit_ok(bad,modes,facts))
 rejects(lambda:index([{'id':'x'},{'id':'x'}]));rejects(lambda:json.loads('{"x":1,"x":2}',object_pairs_hook=no_duplicate_keys))
 passed('DELIBERATE_REJECTION_FIXTURES',len(negatives)+7)
 files=[f for f in ROOT.rglob('*') if f.is_file() and '__pycache__' not in f.parts];require(WORKFLOW.is_file(),'missing own workflow');files.append(WORKFLOW)
 require(all(f.stat().st_size<=MAX_BYTES for f in files),'file >30 MB');passed('FILE_SIZE_LIMIT',len(files))
 if checksums:
  paths=set()
  for line in (ROOT/'SHA256SUMS.txt').read_text().splitlines():
   digest,rel=line.split('  ',1);target=(ROOT/rel).resolve();require(target.is_file() and (ROOT in target.parents or target==WORKFLOW.resolve()),'unsafe checksum path');require(rel not in paths,'duplicate checksum path');paths.add(rel);require(hashlib.sha256(target.read_bytes()).hexdigest()==digest,'hash mismatch '+rel)
  expected={f.relative_to(ROOT).as_posix() if ROOT in f.parents else '../../.github/workflows/B20.yml' for f in files if f.name!='SHA256SUMS.txt'};require(paths==expected,'incomplete manifest');passed('SHA256_MANIFEST',len(paths))
 print(f'STRUCTURAL_RESULT=PASS; suites={len(tests)}; cases={sum(n for _,n in tests)}; seed=N/A (deterministic)')
 if strict:
  dual=sum(f['status']=='corroborated' for f in facts.values());ok=dual==len(facts) and gaps==0
  print(f'MODE_LIST_TWO_SOURCE={len(modes)}/{len(modes)}; PASS');print(f'RULES_TWO_SOURCE={dual}/{len(facts)}; '+('PASS' if dual==len(facts) else 'FAIL'));print(f'FIELDS_WITH_RECORDED_RULES={coverage-gaps}/{coverage}; '+('PASS' if gaps==0 else 'FAIL'));print(f'PROPOSED_PHASE_EXIT_GRAPHS={phase_count}/{phase_count}; PASS');print('PROPOSAL_GAMEPLAY_EXECUTED=NO; only schema/reference/phase-graph checks claimed');print(f'STRICT_RESEARCH_RESULT={"MET" if ok else "NOT_MET"}; exit={0 if ok else 1}');return 0 if ok else 1
 return 0
def main():
 parser=argparse.ArgumentParser(description=__doc__);g=parser.add_mutually_exclusive_group(required=True);g.add_argument('--structural',action='store_true');g.add_argument('--strict',action='store_true');parser.add_argument('--checksums',action='store_true');args=parser.parse_args()
 try:return run(args.strict,args.checksums)
 except (ValidationError,SchemaError) as e:print('VALIDATION_ERROR at '+'.'.join(map(str,e.absolute_path))+': '+e.message,file=sys.stderr);return 2
 except (AssertionError,ValueError,OSError) as e:print('VALIDATION_ERROR: '+str(e),file=sys.stderr);return 2
if __name__=='__main__':raise SystemExit(main())
