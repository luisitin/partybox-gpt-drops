"""Four literal author/Wiki shared actions and exact accepted baseline restoration."""
from pathlib import Path
from datetime import datetime
import copy,hashlib,importlib.util,json
ROOT=Path(__file__).resolve().parent
BASELINE='34fd5936284bb1a83cb06e9c43713213a8704e75'
BASE_DATA='8d252221b535e361f02b1142f7ce8c39387c63548a1a65831e1f7e537e2abe7a'
BASE_SOURCES='0cf30267b6dd48832813f459c97ba7b36252f75e5b9c569d267cbaf7c4e65634'
BASE_REOPENS=['7c11b2e0437b3fb2591ce15c9adb4835edd342e939f06a1117d3678b82aa6fe9','424fa1bba46dc908a16c87af01a8a8ac1ef83077f750928e52747faee4226012']
PRIMARY={
 'MG030':(['The other players must move within the runway\'s limited space to try to avoid the Bomber Bill.'],[]),
 'MG113':(['the teams use the Joy-Con 2 controller in mouse mode to maneuver their character as a puck,','trying to prevent Koopa shells from entering their goal, much like air hockey.'],['W113_q9']),
 'MG115':([],[]),
 'MG117':(['assemble a path of dominoes that leads from the Toad at the start to the flower pot at the end by dragging them.'],['W117_q2','W117_q7'])
}
def read(n):return json.loads((ROOT/n).read_text())
def digest(v):return hashlib.sha256(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def module(n):
 spec=importlib.util.spec_from_file_location(n.replace('-','_'),ROOT/n);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
def validate(p,d,s,rs):
 count=0
 def require(ok,msg):
  nonlocal count
  count+=1
  if not ok:raise AssertionError(msg)
 candidate=read('reports/tv-author-candidate.json');cm=module('check-tv-author-candidate.py')
 require(p['baselineSourceCommit']==BASELINE and p['copyrightBodiesPublished'] is False,'Wrong exact accepted parent or full bodies published')
 require(p['scope']=='Exactly four literal shared-action summaries; no detailed mechanic, category, reward or roster promotion.','Wrong material scope')
 require(p['newHttpRequestsForAdoption']==0 and p['retainedActualRequestCount']==34 and p['retainedCaptures']==candidate['captures'],'Invented or changed actual full request packet')
 require(digest(p['retainedCaptures'])==cm.CAPTURE_DIGEST,'Actual full capture fingerprint changed')
 require(p['authorSources']==cm.AUTHOR_SOURCES,'Author identity lineage or cumulative known quotation budget changed')
 require(p['crossJobURLAudit']['availableJobRoots']==54 and p['crossJobURLAudit']['foreignJobMatches']==0 and p['crossJobURLAudit']['scope']=='Available worktrees only; no unseen-remote inventory claim.','Cross-job audit scope invented')
 by={(c['sourceId'],c['pass']):c for c in p['retainedCaptures']}
 require(len(by)==34,'Missing or duplicate capture')
 sb={x['id']:x for x in s['sources']};rows={x['id']:x for x in d['minigames']}
 require(len(sb)==len(s['sources'])==148 and len(rows)==132,'Wrong current complete row/source scope')
 require([r['id'] for r in p['repairs']]==list(PRIMARY),'Unreviewed repair set')
 restored=copy.deepcopy(d);added_by={sid:[] for sid in ['W030','W113','W115','W117','BB_TV','CC_TV']}
 for repair in p['repairs']:
  ident=repair['id'];cfg=cm.CONFIG[ident];wid='W'+ident[2:];sid=cfg['source'];row=rows[ident];added,extra=PRIMARY[ident]
  require(repair['name']==row['name']==cfg['name'] and repair['summary']==row['summary']==cfg['summary'],'Unreviewed whole-summary wording or literal identity')
  require(repair['beforeGameplayEvidence']['status']=='single_source' and row['fieldEvidence']['gameplay']['status']=='corroborated','Unexpected status promotion')
  require(repair['authoredFullContextSha256Passes']==cfg['fullContextSha256Passes'] and repair['authoredQuotes']==cfg['quotes'],'Complete named authored context or clip changed')
  newids=[wid+'_tv_'+str(i+1) for i in range(len(added))];aids=[sid+'_common_'+ident+'_'+str(i+1) for i in range(len(cfg['quotes']))]
  require(row['fieldEvidence']['gameplay']['quoteIds']==repair['beforeGameplayEvidence']['quoteIds']+newids+extra+aids,'Lost old citation or added unrelated witness')
  require(repair['wikiQuoteIdsAdded']==newids and repair['extraPreservedWitnesses']==extra and repair['authoredQuoteIds']==aids,'Proof evidence mapping changed')
  for qid,text in list(zip(newids,added))+list(zip(aids,cfg['quotes'])):
   source=sb[wid if qid in newids else sid];q=next(x for x in source['quotes'] if x['id']==qid)
   require(q['text']==text and 6<=len(text.split())<=25,'Missing full literal bounded action quote')
   added_by[source['id']].append(q)
  for qid in extra:require(any(q['id']==qid for q in sb[wid]['quotes']),'Lost full preserved primary action')
  old=next(x for x in restored['minigames'] if x['id']==ident);old['summary']=repair['beforeSummary'];old['fieldEvidence']['gameplay']=copy.deepcopy(repair['beforeGameplayEvidence'])
 require(digest(restored)==p['baselineDataSha256']==BASE_DATA,'Any unrelated row value/evidence or historical summary changed')
 require(len(p['baselineRowHashes'])==132,'Missing complete132-row restoration audit')
 for row,expected in zip(restored['minigames'],p['baselineRowHashes']):require(expected=={'id':row['id'],'sha256':digest(row)},'Any historical row fingerprint changed')
 affected=set(added_by)-{'CC_TV'}
 require(set(p['beforeSources'])==affected and all(set(x)==affected for x in p['beforeReopens'].values()),'Wrong historical source/reopen scope')
 historical=copy.deepcopy(s);historical['sources']=[copy.deepcopy(p['beforeSources'].get(x['id'],x)) for x in s['sources'] if x['id']!='CC_TV']
 require(digest(historical)==p['baselineSourcesSha256']==BASE_SOURCES,'Any accepted147-source quote/pass history changed')
 require(set(p['baselineSourceHashes'])=={x['id'] for x in historical['sources']},'Incomplete147-source restoration audit')
 for source in historical['sources']:require(p['baselineSourceHashes'][source['id']]==digest(source),'Any original source fingerprint changed')
 for sid in affected:
  old=p['beforeSources'][sid];current=sb[sid]
  require({k:v for k,v in current.items() if k not in ['quotes','passes','uniqueQuotedWords']}=={k:v for k,v in old.items() if k not in ['quotes','passes','uniqueQuotedWords']},'Old source metadata changed')
  require(current['quotes']==old['quotes']+added_by[sid],'Old quote changed or extra unreviewed quote registered')
 cc=sb['CC_TV'];ccdef=cm.AUTHOR_SOURCES['CC_TV']
 require(cc['quotes']==added_by['CC_TV'] and cc['url']==ccdef['url'] and cc['title']==ccdef['title'] and cc['kind']=='publisher_article' and cc['publisherLineage']=='consolecreatures','Wrong independent new author source')
 for sid in added_by:
  source=sb[sid];require(len(source['passes'])==2,'Missing current A+B pass')
  for n in [1,2]:
   c=by[(sid,n)];pa=source['passes'][n-1];rec=next(x for x in rs[n-1] if x['sourceId']==sid);ids=[q['id'] for q in source['quotes']]
   require(c['actualTransportPassed'] and c['curlExitCode']==0 and c['httpEffectiveTls']==['200',source['url'],'0'] and c['tlsVerificationDisabled'] is False,'Nonliteral source identity or failed actual response')
   require(pa['pass']=='AB'[n-1] and rec['pass']==n and source['url']==rec['url'],'Registered source/pass identity changed')
   require(pa['bodyBytes']==rec['bodyBytes']==c['bodyBytes'] and pa['bodySha256']==rec['bodySha256']==c['bodySha256'],'Actual complete response bytes/hash changed')
   require(rec['requestBeganUTC']==c['startedUTC'] and rec['requestCompletedUTC']==pa['observedAtUTC']==c['completedUTC'] and rec['httpEffectiveTls']==c['httpEffectiveTls'],'Actual dates or transport invented')
   require(datetime.fromisoformat(by[(sid,2)]['startedUTC'])>datetime.fromisoformat(by[(sid,1)]['completedUTC']),'Second request precedes first closure')
   require(pa['fullArticleScopeSha256']==c['textSha256']==by[(sid,1)]['textSha256'],'Full actual article scope changed')
   require(pa['recoveredQuoteIds']==rec['recoveredQuoteIds']==ids and rec['missingQuoteIds']==[] and rec['rawBodyPublished'] is False,'Old/new quotation recovery incomplete')
   require(rec['quotes']==[{k:q[k] for k in ['id','text','locator']} for q in source['quotes']],'Literal reopened quotation changed')
 h_rs=[[copy.deepcopy(p['beforeReopens'][str(n)].get(x['sourceId'],x)) for x in records if x['sourceId']!='CC_TV'] for n,records in enumerate(rs,1)]
 require([digest(x) for x in h_rs]==p['baselineReopensSha256Passes']==BASE_REOPENS,'Complete original A+B history changed')
 qsc=module('quote-support-check.py');oldclass=[{'id':q['id'],'substantive':qsc.substantive(q['text'])} for source in historical['sources'] for q in source['quotes']]
 require(len(oldclass)==len(p['baselineQuoteClassifications'])==1938,'Wrong old classification scope')
 for a,b in zip(oldclass,p['baselineQuoteClassifications']):require(a==b,'Old substantive classification changed')
 for source in s['sources']:require(source['uniqueQuotedWords']==sum(len(t.split()) for t in {q['text'] for q in source['quotes']})<=200,'Cumulative canonical-page quote budget changed')
 require(sb['BB_TV']['uniqueQuotedWords']==94 and sb['CC_TV']['uniqueQuotedWords']==23 and sb['NAMU_BASE']['uniqueQuotedWords']==195 and sb['FGS_BASE']['uniqueQuotedWords']==200 and sb['FGS_TIPS']['uniqueQuotedWords']==73,'Prior or new authored budget/history lost')
 require(sum(e['status']=='corroborated' for row in d['minigames'] for e in row['fieldEvidence'].values())==307 and sum(row['fieldEvidence']['gameplay']['status']=='corroborated' for row in d['minigames'])==39,'Unexpected fact/gameplay promotion count')
 cm.validate(candidate,restored,historical,h_rs)
 return restored,historical,h_rs,count
def before_knock_view(d,s,rs):
 if not (ROOT/'reports/knock-scope-recovery.json').exists():return d,s,rs
 return module('check-knock-scope-recovery.py').historical_view(d,s,rs)

def historical_view(d,s,rs):
 if not (ROOT/'reports/tv-action-recovery.json').exists():return d,s,rs
 p=read('reports/tv-action-recovery.json')
 if digest(d)==BASE_DATA and digest(s)==BASE_SOURCES and [digest(x) for x in rs]==BASE_REOPENS:
  current=before_knock_view(read('minigames.json'),read('catalogue-sources.json'),[read('reports/source-reopens-pass'+x+'.json') for x in 'AB'])
  validate(p,*current)
  return d,s,rs
 d,s,rs=before_knock_view(d,s,rs)
 return validate(p,d,s,rs)[:3]
def run():
 p=read('reports/tv-action-recovery.json');d=read('minigames.json');s=read('catalogue-sources.json');rs=[read('reports/source-reopens-pass'+x+'.json') for x in 'AB'];d,s,rs=before_knock_view(d,s,rs);count=validate(p,d,s,rs)[3]
 for n in range(10):
  a,b,c,e=copy.deepcopy([p,d,s,rs])
  if n==0:a['repairs'][0]['summary']+=' Exact timer10seconds.'
  elif n==1:next(x for x in c['sources'] if x['id']=='CC_TV')['publisherLineage']='mariowiki'
  elif n==2:a['beforeSources']['BB_TV']['quotes'][0]['text']='Changed old original quote'
  elif n==3:a['retainedCaptures'][0]['bodySha256']='0'*64
  elif n==4:b['minigames'][0]['timeLimit']['wholeGameSeconds']=999
  elif n==5:a['baselineQuoteClassifications'][0]['substantive']=not a['baselineQuoteClassifications'][0]['substantive']
  elif n==6:a['repairs'][1]['authoredFullContextSha256Passes'][1]='0'*64
  elif n==7:next(x for x in c['sources'] if x['id']=='W113')['quotes'][-1]['text']='A copied Nintendo instruction'
  elif n==8:next(x for x in e[1] if x['sourceId']=='BB_TV')['recoveredQuoteIds'].pop()
  elif n==9:a['crossJobURLAudit']['scope']='Every unseen remote is audited.'
  try:validate(a,b,c,e)
  except (AssertionError,KeyError,ValueError):pass
  else:raise AssertionError('Malformed four review-action recovery accepted')
 return [{'name':'Four original-review shared actions restore exact accepted132-row147-source1938-quoteA+B baseline','caseCount':count,'passed':True,'seed':None},{'name':'Ten malformed original-review source action history budget and capture fixtures reject','caseCount':10,'passed':True,'seed':None}]
if __name__=='__main__':print(json.dumps(run(),indent=2))
