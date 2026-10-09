"""Preserve an accepted catalogue while removing universal-pair summary wording."""
from pathlib import Path
from datetime import datetime
import copy,hashlib,importlib.util,json
ROOT=Path(__file__).resolve().parent
BASELINE='f7af530b2ac281675d8952021beb4a798e1174ab'
BASE_DATA='ce7bbc26fad595e9a75d6be57cd60c5adc7ba082c4e3065b402fbd599ec15570'
BASE_SOURCES='3c9953f141323a50a9b309102766f4c3affc839f0439cb4dfb589bb00cde28af'
BASE_REOPENS=['88b6e589d13c25b520cf862ef13e16b6ac8453c287d7a07c37070912abf4a28f','3b187c93f5207f383a1ec6a8576ced94b1fff3d08dabea9c0844964b6f9c968a']
SUMMARY='Players match characters behind doors. They try to find all the matches.'
QUOTE='to complete your objective, you must match all characters,'
CONTEXT='c6dc7c2906a4855351cc756c46aadceb0d200261d78f3e9d4f9b4d39ce023f9c'
CAPTURE_DIGEST='785b207e67b7cf4eb55f82e1ff3c75caddc33085dd855cde4c242667ff4a8d4a'
def read(n):return json.loads((ROOT/n).read_text())
def digest(v):return hashlib.sha256(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def module(n):
 sp=importlib.util.spec_from_file_location(n.replace('-','_'),ROOT/n);m=importlib.util.module_from_spec(sp);sp.loader.exec_module(m);return m
def validate(p,d,s,rs):
 count=0
 def require(ok,msg):
  nonlocal count
  count+=1
  if not ok:raise AssertionError(msg)
 require(p['baselineSourceCommit']==BASELINE and p['copyrightBodiesPublished'] is False,'Wrong accepted parent or full body publication')
 require(p['scope']=='One already-corroborated summary removes an unsupported universal-pair implication; no fact-status gain or exact mode parameter promotion.','Wrong semantic scope')
 require(p['retainedActualRequestCount']==6 and p['newHttpRequestsForAdoption']==0 and digest(p['retainedCaptures'])==CAPTURE_DIGEST,'Actual six-request packet changed or new requests invented')
 require(p['author']=='GameNChick' and p['authoredFullContextSha256Passes']==[CONTEXT,CONTEXT] and p['authorPublisherLineage']=='gamenchick','Wrong original full authored context or lineage')
 caps={(x['sourceId'],x['pass']):x for x in p['retainedCaptures']};require(len(caps)==6,'Duplicate or missing captured pass')
 for sid in ['GNC_TV','W125','FANDOM_TV']:
  require(datetime.fromisoformat(caps[(sid,2)]['startedUTC'])>datetime.fromisoformat(caps[(sid,1)]['completedUTC']),'Second capture precedes first closure')
  for n in [1,2]:
   c=caps[(sid,n)]
   require(c['curlExitCode']==0 and c['tlsVerificationDisabled'] is False and c['httpEffectiveTls'][2]=='0' and c['bodyReceived'] is True,'Missing actual TLS/response receipt')
   if sid=='FANDOM_TV':require(c['actualTransportPassed'] is False and c['httpEffectiveTls'][0]=='402' and c['bodyBytes']==55,'Blocked Fandom lead promoted or failure hidden')
   else:require(c['actualTransportPassed'] is True and c['httpEffectiveTls'][0]=='200' and c['bodyBytes']>1000 and c['scopePresent'] is True,'Failed or incomplete full source accepted')
 require(p['fandomLeadStatus']=='EXCLUDED_HTTP402; cloud98-count lead is not native full-page or roster acceptance.','False Fandom list acceptance')
 require(p['crossJobURLAudit']['availableJobRoots']==54 and p['crossJobURLAudit']['foreignJobMatches']==0 and p['crossJobURLAudit']['scope']=='Available worktrees only; no unseen-remote inventory claim.','Invented global quote audit')
 require(len(d['minigames'])==132 and len(s['sources'])==148,'Wrong current row/source set')
 row=d['minigames'][124];require(row['id']=='MG125' and row['name']=='Knock-Knock Match' and row['summary']==SUMMARY,'Unreviewed name or universal-mode summary')
 require(p['beforeGameplayEvidence']['status']==row['fieldEvidence']['gameplay']['status']=='corroborated','Already-corroborated fact recounted as new gain')
 require(row['fieldEvidence']['gameplay']['quoteIds']==p['beforeGameplayEvidence']['quoteIds']+['W125_q4','W125_q7','GNC_TV_context_MG125'],'Lost old or invented new action witness')
 restored=copy.deepcopy(d);restored['minigames'][124]['summary']=p['beforeSummary'];restored['minigames'][124]['fieldEvidence']['gameplay']=copy.deepcopy(p['beforeGameplayEvidence'])
 require(digest(restored)==p['baselineDataSha256']==BASE_DATA,'Unrelated row/evidence or old summary changed')
 require(len(p['baselineRowHashes'])==132,'Missing complete original row audit')
 for old,expected in zip(restored['minigames'],p['baselineRowHashes']):require(expected=={'id':old['id'],'sha256':digest(old)},'Original row fingerprint changed')
 sb={x['id']:x for x in s['sources']};affected={'GNC_TV','W125'}
 require(set(p['beforeSources'])==affected and set(p['beforeReopens'])=={'1','2'} and all(set(x)==affected for x in p['beforeReopens'].values()),'Wrong original source/reopen scope')
 historical=copy.deepcopy(s);historical['sources']=[copy.deepcopy(p['beforeSources'].get(x['id'],x)) for x in s['sources']]
 require(digest(historical)==p['baselineSourcesSha256']==BASE_SOURCES and len(p['baselineSourceHashes'])==148,'Original148-source history changed')
 for source in historical['sources']:require(p['baselineSourceHashes'][source['id']]==digest(source),'Any accepted source fingerprint changed')
 for sid in affected:
  current,old=sb[sid],p['beforeSources'][sid]
  require({k:v for k,v in current.items() if k not in ['quotes','passes','uniqueQuotedWords']}=={k:v for k,v in old.items() if k not in ['quotes','passes','uniqueQuotedWords']},'Original source metadata changed')
  if sid=='W125':require(current['quotes']==old['quotes'],'Primary quotes or control icons changed')
  else:
   require(current['quotes'][:-1]==old['quotes'] and current['quotes'][-1]['id']=='GNC_TV_context_MG125' and current['quotes'][-1]['text']==QUOTE and len(QUOTE.split())==9,'Historical author quote lost or unreviewed clause appended')
  for n in [1,2]:
   c=caps[(sid,n)];pa=current['passes'][n-1];rec=next(x for x in rs[n-1] if x['sourceId']==sid);ids=[q['id'] for q in current['quotes']]
   require(pa['pass']=='AB'[n-1] and rec['pass']==n and c['httpEffectiveTls']==['200',current['url'],'0'] and rec['url']==current['url'],'Wrong complete source or pass identity')
   require(pa['bodySha256']==rec['bodySha256']==c['bodySha256'] and pa['bodyBytes']==rec['bodyBytes']==c['bodyBytes'],'Complete actual response hash/bytes changed')
   require(rec['requestBeganUTC']==c['startedUTC'] and rec['requestCompletedUTC']==pa['observedAtUTC']==c['completedUTC'] and rec['httpEffectiveTls']==c['httpEffectiveTls'],'Actual response dates or transport invented')
   require(pa['textSha256']==pa['fullArticleScopeSha256']==c['textSha256']==caps[(sid,1)]['textSha256'] and pa['textCharacters']==c['textCharacters'],'Whole-source scope replaced with an excerpt')
   require(pa['recoveredQuoteIds']==rec['recoveredQuoteIds']==ids and rec['missingQuoteIds']==[] and rec['rawBodyPublished'] is False,'Old/new quote not recovered')
   require(rec['quotes']==[{k:q[k] for k in ['id','text','locator']} for q in current['quotes']],'Reopened exact quotation changed')
 h_rs=[[copy.deepcopy(p['beforeReopens'][str(n)].get(x['sourceId'],x)) for x in records] for n,records in enumerate(rs,1)]
 require([digest(x) for x in h_rs]==p['baselineReopensSha256Passes']==BASE_REOPENS,'Complete old A+B record history changed')
 qsc=module('quote-support-check.py');classes=[{'id':q['id'],'substantive':qsc.substantive(q['text'])} for source in historical['sources'] for q in source['quotes']]
 require(len(classes)==len(p['baselineQuoteClassifications'])==1948,'Wrong historical quote classifier scope')
 for a,b in zip(classes,p['baselineQuoteClassifications']):require(a==b,'Old substantive classification changed')
 for source in s['sources']:require(source['uniqueQuotedWords']==sum(len(t.split()) for t in {q['text'] for q in source['quotes']})<=200,'Cumulative canonical-page budget changed')
 require(sb['GNC_TV']['uniqueQuotedWords']==26 and sb['BB_TV']['uniqueQuotedWords']==94 and sb['CC_TV']['uniqueQuotedWords']==23 and sb['FGS_BASE']['uniqueQuotedWords']==200 and sb['FGS_TIPS']['uniqueQuotedWords']==73 and sb['NAMU_BASE']['uniqueQuotedWords']==195,'Old authored source budget lost')
 require(sum(e['status']=='corroborated' for r in d['minigames'] for e in r['fieldEvidence'].values())==307 and sum(r['fieldEvidence']['gameplay']['status']=='corroborated' for r in d['minigames'])==39,'False coverage/status gain')
 module('check-tv-action-recovery.py').validate(read('reports/tv-action-recovery.json'),restored,historical,h_rs)
 return restored,historical,h_rs,count
def historical_view(d,s,rs):
 if not (ROOT/'reports/knock-scope-recovery.json').exists():return d,s,rs
 p=read('reports/knock-scope-recovery.json')
 if digest(d)==BASE_DATA and digest(s)==BASE_SOURCES and [digest(x) for x in rs]==BASE_REOPENS:
  validate(p,read('minigames.json'),read('catalogue-sources.json'),[read('reports/source-reopens-pass'+x+'.json') for x in 'AB']);return d,s,rs
 return validate(p,d,s,rs)[:3]
def run():
 p=read('reports/knock-scope-recovery.json');d=read('minigames.json');s=read('catalogue-sources.json');rs=[read('reports/source-reopens-pass'+x+'.json') for x in 'AB'];count=validate(p,d,s,rs)[3]
 for n in range(8):
  a,b,c,e=copy.deepcopy([p,d,s,rs])
  if n==0:b['minigames'][124]['summary']='Every mode uses pairs. Each group is exactlytwocharacters.'
  elif n==1:a['authorPublisherLineage']='mariowiki'
  elif n==2:a['beforeSources']['GNC_TV']['quotes'][0]['text']='Changed historical authored quotation'
  elif n==3:a['retainedCaptures'][0]['bodySha256']='0'*64
  elif n==4:b['minigames'][0]['timeLimit']['wholeGameSeconds']=999
  elif n==5:a['baselineQuoteClassifications'][0]['substantive']=not a['baselineQuoteClassifications'][0]['substantive']
  elif n==6:a['fandomLeadStatus']='ACCEPTED_ROSTER132'
  elif n==7:next(x for x in e[1] if x['sourceId']=='GNC_TV')['recoveredQuoteIds'].pop()
  try:validate(a,b,c,e)
  except (AssertionError,KeyError,ValueError):pass
  else:raise AssertionError('Malformed whole-scope/summary repair accepted')
 return [{'name':'Knock-Knock mode-safe action and complete author scopes preserve exact accepted132-row148-source1948-quote history','caseCount':count,'passed':True,'seed':None},{'name':'Eight malformed mode implication original history blocked-source full-scope and classification fixtures reject','caseCount':8,'passed':True,'seed':None}]
if __name__=='__main__':print(json.dumps(run(),indent=2))
