"""Prove six narrow ranked-guide actions and exact complete accepted evidence restoration."""
from pathlib import Path
from datetime import datetime
import copy,hashlib,importlib.util,json,re
ROOT=Path(__file__).resolve().parent
BASELINE='141e7c25a1b54ee69ad112d9bedbfb741efe648b'
BASE_DIGESTS={'data': 'd3d37d21d7abbca82b5fb19b6d5ef8cbf5c90d7d7a6a2d9efce788683b0dacd3', 'sources': '72fc1246584799dc1b57c1057ea9e19fc50310597f2e2a0a12c265404e971dcb', 'reopens': ['92479418b7d3d3a0cb857040bc9ec6307316f7a972f0b92966b5e0ed750bdf85', 'd1aa5f11ac99de912b2516146cc14c764ac5f2a7fa20637936e5fc560274eb5b']}
CANDIDATE='8ce7d5e7c43593f0a5c674f726779f254a2446bfc5249bd1f550cee9ecfbf468'
SUMMARIES={'MG038': 'Players ride as a solo player or a team. They collect coins as they travel.', 'MG044': 'Players cut a steak. They try to divide it into equal halves.', 'MG058': 'Players race through a path filled with marbles. They can push the other player while moving forward.', 'MG059': 'The player steers a ball using motion input. They guide it toward an item.', 'MG076': 'Players aim at Rocky Wrench as he appears. They destroy incoming wrenches.', 'MG083': 'Players operate an arcade machine. They push prizes down a chute.'}
SCOPE='Exactly six originally authored common-action summaries; every other row field, precise mechanic, category, roster, confidence and whole-row value stays unchanged.'
LIMITATION='Only the literal narrowed shared actions have complete paired primary and independently authored named ranked-guide support. Exact bindings, timers, item allocation, point values, win/score/tie/payout and other mechanics retain separate qualifications.'
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
 candidate=read('reports/ranked-gameplay-candidates.json')
 require(p['job']=='B03' and p['baselineSourceCommit']==BASELINE and p['scope']==SCOPE and p['baselineDigests']==BASE_DIGESTS,'Accepted parent or narrow semantic scope changed')
 require(p['retainedCandidatePacketSha256']==digest(candidate)==CANDIDATE and p['newHttpRequestsForAdoption']==0 and p['fullCopyrightBodiesPublished'] is False,'Candidate receipt changed, request invented or full body published')
 require(p['gameplayLimitation']==LIMITATION,'Precise mechanics disclaimer was broadened or removed')

 historical_reward=read('reports/reward-quote-capture-audit-before-ranked.json');current_reward=read('reports/reward-quote-capture-audit.json')
 require(digest(historical_reward)==p['baselineRewardAuditSha256']=='24489db18ab20c3b9df976a3d7ea6f07a6be191d4f147ebba749eb1f80409540','Original complete84-witness reward audit was lost or altered')
 require(len(current_reward['checks'])==len(historical_reward['checks'])==84,'Current reward audit omitted or added a witness')
 actual_rebindings=[];restored_reward=copy.deepcopy(current_reward)
 for index,(current,old) in enumerate(zip(current_reward['checks'],historical_reward['checks'])):
  restored_reward['checks'][index]['bodySha256']=old['bodySha256']
  require({k:v for k,v in current.items() if k!='bodySha256'}=={k:v for k,v in old.items() if k!='bodySha256'},'An old reward quotation or nonhash witness field changed')
  if current['bodySha256']!=old['bodySha256']:
   source=next(x for x in s['sources'] if any(q['id']==current['quoteId'] for q in x['quotes']))
   require(source['id'] in ['W038','W059'] and current['bodySha256']==source['passes'][current['pass']-1]['bodySha256'],'Reward witness is not the actual unchanged quotation in the current received body')
   actual_rebindings.append({'index':index,'id':current['id'],'quoteId':current['quoteId'],'pass':current['pass'],'beforeBodySha256':old['bodySha256'],'actualCurrentBodySha256':current['bodySha256']})
 require(restored_reward==historical_reward and actual_rebindings==p['rewardWitnessRebindings'] and len(actual_rebindings)==6,'Complete reward witness history or exact six-body rebinding differs')
 require(p['publisherLineageResolution']=='The historical candidate uses thegamer as an author-brand label; actual closed host lineage is valnet, shared with ScreenRant. Fact independence is Mariowiki versus Valnet only.','Prospective author-brand label was mistaken for an independent publisher lineage')
 require(p['currentCoverage']=={'supportedFacts': 347, 'remainingFields': 973, 'completeRows': 0, 'categoriesCorroborated': 123, 'categoriesSingleSource': 9, 'gameplayCorroborated': 60, 'gameplaySingleSource': 72},'Declared current coverage differs from exact adopted scope')
 require(len(d['minigames'])==132 and len(s['sources'])==151 and len(p['gameplay'])==6 and set(x['id'] for x in p['gameplay'])==set(SUMMARIES),'Wrong adoption or catalogue cardinality')
 restored=copy.deepcopy(d);rows={x['id']:x for x in restored['minigames']}
 for r in p['gameplay']:rows[r['id']]['summary']=r['beforeSummary'];rows[r['id']]['fieldEvidence']['gameplay']=copy.deepcopy(r['beforeEvidence'])
 require(digest(restored)==BASE_DIGESTS['data'],'Any unrelated fact, confidence, category or row value changed')
 require(len(p['baselineRowHashes'])==132,'Complete accepted row fingerprints missing')
 for row,h in zip(restored['minigames'],p['baselineRowHashes']):require(h=={'id':row['id'],'sha256':digest(row)},'Accepted whole row changed')
 affected={'W083', 'W038', 'W059', 'W058', 'W044', 'W076'}
 require(set(p['beforeSources'])==affected and set(p['beforeReopens'])=={'1','2'} and all(set(x)==affected for x in p['beforeReopens'].values()),'Affected complete source scope changed')
 old_s=copy.deepcopy(s);require(s['sources'][-1]['id']=='RANKED_REVIEW' and sum(x['id']=='RANKED_REVIEW' for x in s['sources'])==1,'Duplicate or misplaced new author')
 old_s['sources']=[copy.deepcopy(p['beforeSources'].get(x['id'],x)) for x in s['sources'] if x['id']!='RANKED_REVIEW']
 require(digest(old_s)==BASE_DIGESTS['sources'] and len(p['baselineSourceHashes'])==150,'Any accepted source, clip, classifier or history changed')
 for src in old_s['sources']:require(p['baselineSourceHashes'][src['id']]==digest(src),'Accepted source fingerprint altered')
 require(all(len(x)==154 and x[-1]['sourceId']=='RANKED_REVIEW' for x in rs),'Complete new A/B history missing')
 old_rs=[[copy.deepcopy(p['beforeReopens'][str(n)].get(x['sourceId'],x)) for x in records if x['sourceId']!='RANKED_REVIEW'] for n,records in enumerate(rs,1)]
 require([digest(x) for x in old_rs]==BASE_DIGESTS['reopens'],'Any complete accepted152-record A/B history changed')
 qsc=module('quote-support-check.py');classes=[{'id':q['id'],'substantive':qsc.substantive(q['text'])} for src in old_s['sources'] for q in src['quotes']]
 require(len(classes)==len(p['baselineQuoteClassifications'])==1982,'Accepted quotation classifier count changed')
 for actual,old in zip(classes,p['baselineQuoteClassifications']):require(actual==old,'Historical substantive-quote classification altered')
 by={x['id']:x for x in s['sources']};author=by['RANKED_REVIEW'];cand={x['id']:x for x in candidate['gameplayCandidates']};cap={(x['key'],x['pass']):x for x in candidate['actualCaptures']}
 expected=[{'id':'RANK_'+c['id']+'_action','text':c['authorQuote'],'locator':'Original named '+c['authorParagraphScopes'][0]['heading']+' paragraph / complete paired .article-body by Stacey Henley','scope':'Only independently authored common actions; no precise bindings, timers, point values, ties or payouts.'} for c in candidate['gameplayCandidates']]
 require(author['url']==candidate['independentAuthor']['url'] and author['publisherLineage']=='valnet' and author['kind']=='publisher_article' and author['quotes']==p['authorQuotes']==expected,'Independent author or literal clips changed')
 require(author['uniqueQuotedWords']==108 and p['pairedVisibleAuthorWitnesses']==candidate['independentAuthor']['nativePairedWitnesses'] and p['fullAuthorScopes']==candidate['fullAuthorScopes'],'Shared page budget or complete native author proof changed')
 for sid in affected:
  current,old=by[sid],p['beforeSources'][sid]
  require({k:v for k,v in current.items() if k not in ['quotes','passes','uniqueQuotedWords']}=={k:v for k,v in old.items() if k not in ['quotes','passes','uniqueQuotedWords']},'Original source identity or metadata changed')
  require(current['quotes']==old['quotes']+p['newPrimaryQuotes'][sid],'Old primary quotation deleted or rewritten')
  for q in p['newPrimaryQuotes'][sid]:require(6<=len(q['text'].split())<=25 and q['id'] not in {x['id'] for x in old['quotes']},'Unbounded or duplicate primary quotation')
 for sid in affected|{'RANKED_REVIEW'}:
  src=by[sid];ids=[q['id'] for q in src['quotes']];require(src['uniqueQuotedWords']==sum(len(t.split()) for t in {q['text'] for q in src['quotes']})<=200,'Canonical source quotation budget altered')
  ck='THEGAMER' if sid=='RANKED_REVIEW' else sid
  for n in [1,2]:
   c=cap[(ck,n)];pa=src['passes'][n-1];rec=next(x for x in rs[n-1] if x['sourceId']==sid)
   require(c['exitCode']==0 and c['httpStatus']==200 and c['tlsVerifyResult']==0 and c['url']==c['effectiveURL']==src['url'],'Failed, insecure, alias or wrong received URL promoted')
   require(pa['bodyBytes']==rec['bodyBytes']==c['actualBodyBytes'] and pa['bodySha256']==rec['bodySha256']==c['actualBodySha256'],'Actual complete received body changed')
   require(pa['observedAtUTC']==rec['requestCompletedUTC']==c['closedUTC'] and rec['requestBeganUTC']==c['startedUTC'],'Actual retrieval time invented')
   require(pa['recoveredQuoteIds']==rec['recoveredQuoteIds']==ids and rec['missingQuoteIds']==[] and rec['quotes']==[{k:q[k] for k in ['id','text','locator']} for q in src['quotes']],'Old/new quotation recovery incomplete')
   require(pa['httpStatus']==200 and pa['tlsVerified'] is True and rec['curlExit']==0 and rec['httpEffectiveTls']==['200',src['url'],'0'] and rec['rawBodyPublished'] is False,'Transport or full-body publication scope changed')
   scope=candidate['fullAuthorScopes'][n-1] if sid=='RANKED_REVIEW' else next(x for x in cand.values() if x['primarySourceId']==sid)['primaryScopes'][n-1]
   require(pa['textSha256']==pa['fullArticleScopeSha256']==scope['sha256'] and pa['textCharacters']==scope['characters'],'Full paired scope replaced by excerpt')
  require(datetime.fromisoformat(src['passes'][1]['observedAtUTC'])>datetime.fromisoformat(src['passes'][0]['observedAtUTC']),'Second source pass precedes first closure')
 current={x['id']:x for x in d['minigames']}
 for r in p['gameplay']:
  row=current[r['id']];c=cand[r['id']]
  require(row['name']==r['name']==c['name'] and r['beforeSummary']==c['currentSummary'] and r['beforeEvidence']==c['currentGameplayEvidence'] and r['beforeEvidence']['status']=='single_source','Wrong literal game or already-supported field recounted')
  require(row['summary']==r['summary']==SUMMARIES[r['id']]==c['proposedTwoSentenceSummary'] and len(re.split(r'(?<=[.!?])\s+(?=[A-Z])',row['summary']))==2,'Summary exceeds exact literal reviewed common actions')
  ids=list(dict.fromkeys(r['beforeEvidence']['quoteIds']+[r['authorQuoteId']]+r['primaryQuoteIds']))
  require(row['fieldEvidence']['gameplay']=={'status':'corroborated','quoteIds':ids,'limitation':p['gameplayLimitation']} and r['authorQuoteId']=='RANK_'+row['id']+'_action','Old citation lost or broader mechanic promoted')
  qs={q['id']:q for q in by[c['primarySourceId']]['quotes']};require(r['primaryQuoteIds'] and all(x in qs and qsc.substantive(qs[x]['text']) for x in r['primaryQuoteIds']) and qsc.substantive(c['authorQuote']),'Only fragments or one substantive lineage supports action')
  require(r['pairedFullParagraphHashes']==[x['sha256'] for x in c['authorParagraphScopes']],'Complete named original paragraph changed')
 require(sum(e['status']=='corroborated' for r in d['minigames'] for e in r['fieldEvidence'].values())==347 and sum(r['fieldEvidence']['category']['status']=='corroborated' for r in d['minigames'])==123 and sum(r['fieldEvidence']['gameplay']['status']=='corroborated' for r in d['minigames'])==60 and all(r['complete'] is False for r in d['minigames']),'False narrow coverage or whole-row completion')
 require(p['actualCaptureRecordsRecheckedBeforeAndAfter']==24 and p['actualReceivedBodyFilesPhysicallyRehashedBeforeAndAfter']==24 and p['actualFailedCaptureBodyAbsencesRecheckedBeforeAndAfter']==0 and p['currentRegistry']=={'sources':151,'clips':sum(len(x['quotes']) for x in s['sources']),'pairedRecordsPerPass':154,'quoteRecoveries':sum(len(x['recoveredQuoteIds']) for z in rs for x in z)},'Actual raw-body scope or current registry totals changed')
 for src in s['sources']:require(src['uniqueQuotedWords']==sum(len(t.split()) for t in {q['text'] for q in src['quotes']})<=200,'Any historical page budget changed')
 count+=module('check-ranked-gameplay-candidates.py').validate(candidate,restored,old_s,old_rs)
 count+=module('check-cog-gameplay-recovery.py').validate(read('reports/cog-gameplay-recovery.json'),restored,old_s,old_rs)[3]
 return restored,old_s,old_rs,count
def historical_view(d,s,rs):
 if not (ROOT/'reports/ranked-gameplay-recovery.json').exists():return d,s,rs
 p=read('reports/ranked-gameplay-recovery.json')
 if {'data':digest(d),'sources':digest(s),'reopens':[digest(x) for x in rs]}==BASE_DIGESTS:
  validate(p,read('minigames.json'),read('catalogue-sources.json'),[read('reports/source-reopens-pass'+x+'.json') for x in 'AB']);return d,s,rs
 return validate(p,d,s,rs)[:3]
def run():
 p,d,s=read('reports/ranked-gameplay-recovery.json'),read('minigames.json'),read('catalogue-sources.json');rs=[read('reports/source-reopens-pass'+x+'.json') for x in 'AB'];count=validate(p,d,s,rs)[3]
 for n in range(16):
  a,b,c,e=copy.deepcopy([p,d,s,rs])
  if n==0:b['minigames'][0]['summary']='Unsupported action. Another action.'
  elif n==1:b['minigames'][37]['fieldEvidence']['gameplay']['status']='single_source'
  elif n==2:a['gameplay'][1]=copy.deepcopy(a['gameplay'][0])
  elif n==3:a['baselineQuoteClassifications'][0]['substantive']=not a['baselineQuoteClassifications'][0]['substantive']
  elif n==4:next(x for x in c['sources'] if x['id']=='RANKED_REVIEW')['publisherLineage']='mariowiki'
  elif n==5:next(x for x in e[1] if x['sourceId']=='RANKED_REVIEW')['requestBeganUTC']='2099-01-01T00:00:00+00:00'
  elif n==6:a['gameplay'][0]['pairedFullParagraphHashes'][1]='0'*64
  elif n==7:c['sources'][0]['quotes'][0]['text']='Altered old clip'
  elif n==8:next(x for x in e[1] if x['sourceId']=='W038')['recoveredQuoteIds'].pop()
  elif n==9:b['minigames'][14]['controls']['inputTypes'].append('invented-motion')
  elif n==10:a['newHttpRequestsForAdoption']=24
  elif n==11:a['fullCopyrightBodiesPublished']=True
  elif n==12:a['currentCoverage']['remainingFields']=0
  elif n==13:
   a['gameplayLimitation']='Every precise mechanic is fully verified.'
   for r in a['gameplay']:next(x for x in b['minigames'] if x['id']==r['id'])['fieldEvidence']['gameplay']['limitation']=a['gameplayLimitation']
  elif n==14:a['rewardWitnessRebindings'].pop()
  elif n==15:a['baselineRewardAuditSha256']='0'*64
  try:validate(a,b,c,e)
  except (AssertionError,KeyError,ValueError):pass
  else:raise AssertionError('Malformed COG recovery or historical restoration accepted')
 return [{'name':'Six narrow original ranked-guide actions restore every accepted132-row150-source1982-classification complete153-record A+B history before inherited checks','caseCount':count,'passed':True,'seed':None},{'name':'Sixteen actual malformed ranked-guide adoption and complete historical restoration fixtures reject','caseCount':16,'passed':True,'seed':None}]
if __name__=='__main__':print(json.dumps(run(),indent=2))
