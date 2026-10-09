"""Qualify one narrow action and restore every genuinely accepted e931 value before older checks."""
from pathlib import Path
from datetime import datetime
import copy,hashlib,importlib.util,json,re
ROOT=Path(__file__).resolve().parent
BASELINE='e931e158b634d8d759a9a3fa255770a9d1276141'
BASE_DIGESTS={'data':'45f1a3138d5a1a191638d952afe386f918112c5710adc90cfd8756cd82ca8950','sources':'b6dd7fe57924b7d54111b6ae6d3a421963c16f9096bf9ce68ea22cd9c5a9b3dd','reopens':['c8f0d4a7bc8b5bab19b4f934a9f0ee0b04be3496c6b2374b1e13b98aca6ec945','6b16c40e281738feb92585ffc4c745d1ae265fd1806efc0adde385d8334d5cbb']}
SUMMARY='Players race on snowboards. They can perform tricks from ramps to gain speed boosts.'
SCOPE="Only MG071's literal common snowboard-race and ramp-trick boost actions; all other product fields and precise mechanics remain exact."
LIMITATION='Only snowboard racing and ramp-trick speed boosts have paired primary and independently authored guide support. Exact motion/button bindings, start advantage, timer, win/score/tie/payout and alternate-mode rules retain separate qualifications.'
def read(n):return json.loads((ROOT/n).read_text())
def digest(v):return hashlib.sha256(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def module(n):
 spec=importlib.util.spec_from_file_location(n.replace('-','_'),ROOT/n);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
def validate(p,d,s,rs):
 if (ROOT/'reports/player-format-recovery.json').exists():
  newer=module('check-format-recovery.py')
  if {'data':digest(d),'sources':digest(s),'reopens':[digest(x) for x in rs]}!=newer.BASE_DIGESTS:
   d,s,rs=newer.historical_view(d,s,rs)

 count=0
 def require(ok,msg):
  nonlocal count
  count+=1
  if not ok:raise AssertionError(msg)
 cand=read('reports/rosalina-structural-candidate.json')
 require(p['job']=='B03' and p['baselineSourceCommit']==BASELINE and p['baselineDigests']==BASE_DIGESTS and p['scope']==SCOPE,'Wrong genuine accepted parent or semantic scope')
 require(p['retainedCandidatePacketSha256']==digest(cand) and p['newHttpRequestsForAdoption']==0 and p['fullCopyrightBodiesPublished'] is False,'Historical candidate changed, HTTP invented or full source published')
 require(p['gameplayLimitation']==LIMITATION and p['currentCoverage']=={'supportedFacts':348,'remainingFields':972,'completeRows':0,'categoriesCorroborated':123,'categoriesSingleSource':9,'gameplayCorroborated':61,'gameplaySingleSource':71},'Narrow limitation or current count differs')
 require(len(d['minigames'])==132 and len(s['sources'])==151 and all(len(x)==154 for x in rs),'Original catalogue/source/history cardinality changed')
 old_d=copy.deepcopy(d);row=next(x for x in old_d['minigames'] if x['id']=='MG071');before=p['beforeGameplay']
 require(before['id']==row['id']==cand['id'] and before['name']==row['name']==cand['name'] and before['evidence']['status']=='single_source','Wrong game or already-supported field recounted')
 row['summary']=before['summary'];row['fieldEvidence']['gameplay']=copy.deepcopy(before['evidence'])
 require(digest(old_d)==BASE_DIGESTS['data'],'Any unrelated controls timers rules phone assessment confidence category or row changed')
 require(len(p['baselineRowHashes'])==132,'Accepted whole row fingerprint missing')
 for r,h in zip(old_d['minigames'],p['baselineRowHashes']):require(h=={'id':r['id'],'sha256':digest(r)},'Accepted whole row no longer exact')
 affected={'W071','RANKED_REVIEW'}
 require(set(p['beforeSources'])==affected and set(p['beforeReopens'])=={'1','2'} and all(set(x)==affected for x in p['beforeReopens'].values()),'Complete affected history scope differs')
 old_s=copy.deepcopy(s);old_s['sources']=[copy.deepcopy(p['beforeSources'].get(x['id'],x)) for x in s['sources']]
 require(digest(old_s)==BASE_DIGESTS['sources'] and len(p['baselineSourceHashes'])==151,'Any accepted source or quotation history changed')
 for src in old_s['sources']:require(p['baselineSourceHashes'][src['id']]==digest(src),'Accepted source fingerprint differs')
 old_rs=[[copy.deepcopy(p['beforeReopens'][str(n)].get(x['sourceId'],x)) for x in records] for n,records in enumerate(rs,1)]
 require([digest(x) for x in old_rs]==BASE_DIGESTS['reopens'],'Any accepted complete paired source history changed')
 for n,records in enumerate(old_rs):
  require(len(p['baselineReopenHashes'][n])==154,'Accepted paired record fingerprint missing')
  for rec,h in zip(records,p['baselineReopenHashes'][n]):require(h=={'sourceId':rec['sourceId'],'sha256':digest(rec)},'Accepted paired whole record changed')
 qc=module('quote-support-check.py');classes=[{'id':q['id'],'substantive':qc.substantive(q['text'])} for x in old_s['sources'] for q in x['quotes']]
 require(len(classes)==len(p['baselineQuoteClassifications'])==1992,'Accepted quotation classification cardinality changed')
 for actual,old in zip(classes,p['baselineQuoteClassifications']):require(actual==old,'An accepted quotation classifier changed')
 by={x['id']:x for x in s['sources']};w=by['W071'];a=by['RANKED_REVIEW']
 require(w['publisherLineage']=='mariowiki' and a['publisherLineage']=='valnet' and a['url']==cand['canonicalAuthorURL'],'True source identity or existing Valnet lineage changed')
 expected_author=[{'id':'RANK_MG071_snowboard','text':cand['authorQuotes'][0],'locator':"Original named 7 Best Showdown: Rosalina's Radical Race paragraph / complete paired bylined .article-body",'scope':LIMITATION},{'id':'RANK_MG071_ramp_boost','text':cand['authorQuotes'][1],'locator':"Original named 7 Best Showdown: Rosalina's Radical Race paragraph / complete paired bylined .article-body",'scope':LIMITATION}]
 expected_primary={'id':'W071_ranked_ramp_boost','text':cand['primaryQuote'],'locator':'Complete paired Overview / literal ramp-trick speed-boost clause; full original control-footnote context retained','scope':LIMITATION}
 require(p['newAuthorQuotes']==expected_author and p['newPrimaryQuote']==expected_primary,'New action clips differ from exact complete reviewed candidate')
 require(a['quotes']==p['beforeSources']['RANKED_REVIEW']['quotes']+expected_author and w['quotes']==p['beforeSources']['W071']['quotes']+[expected_primary],'Original clips deleted rewritten or duplicated')
 require(p['newCumulativeAuthorQuotationWordsAtAdoption']==0 and a['uniqueQuotedWords']==122 and p['previousCommittedAndReservedAuthorWords']==122,'Historical14 author words counted twice or old quota lost')
 for sid in affected:
  src=by[sid];old=p['beforeSources'][sid]
  require({k:v for k,v in src.items() if k not in ['quotes','passes','uniqueQuotedWords']}=={k:v for k,v in old.items() if k not in ['quotes','passes','uniqueQuotedWords']},'Original source metadata changed')
  require(src['uniqueQuotedWords']==sum(len(q.split()) for q in {x['text'] for x in src['quotes']})<=200 and all(len(q['text'].split())<=25 for q in src['quotes']),'Source cumulative or individual quota exceeded')
  key='W071' if sid=='W071' else 'THEGAMER';ids=[x['id'] for x in src['quotes']]
  for n in [1,2]:
   cap=next(x for x in cand['actualCaptures'] if x['key']==key and x['pass']==n);pa=src['passes'][n-1];rec=next(x for x in rs[n-1] if x['sourceId']==sid)
   scope=cand['pairedPrimaryScopes'][n-1] if sid=='W071' else cand['pairedAuthorScopes'][n-1]
   textsha=scope['structuralFullScopeSha256'] if sid=='W071' else scope['fullScopeSha256'];chars=scope['structuralFullScopeCharacters'] if sid=='W071' else scope['fullScopeCharacters']
   require(cap['event']=='CLOSED' and cap['exitCode']==0 and cap['httpStatus']==200 and cap['tlsVerifyResult']==0 and cap['url']==cap['effectiveURL']==src['url'],'Wrong insecure failed or invented source request')
   require(pa['bodySha256']==rec['bodySha256']==cap['actualBodySha256'] and pa['bodyBytes']==rec['bodyBytes']==cap['actualBodyBytes'],'Claim does not bind complete actual received bytes')
   require(pa['observedAtUTC']==rec['requestCompletedUTC']==cap['closedUTC'] and rec['requestBeganUTC']==cap['startedUTC'],'Actual source times changed')
   require(pa['textSha256']==pa['fullArticleScopeSha256']==textsha and pa['textCharacters']==chars,'Complete paired structural/full author scope replaced by excerpt')
   require(pa['recoveredQuoteIds']==rec['recoveredQuoteIds']==ids and rec['missingQuoteIds']==[] and rec['quotes']==[{k:q[k] for k in ['id','text','locator']} for q in src['quotes']],'Old/new complete quote recovery missing')
   require(pa['httpStatus']==200 and pa['tlsVerified'] is True and rec['curlExit']==0 and rec['httpEffectiveTls']==['200',src['url'],'0'] and rec['rawBodyPublished'] is False,'Transport or copyright scope changed')
  require(datetime.fromisoformat(src['passes'][1]['observedAtUTC'])>datetime.fromisoformat(src['passes'][0]['observedAtUTC']),'Second pass precedes first natural closure')
 actual_row=next(x for x in d['minigames'] if x['id']=='MG071');ids=list(dict.fromkeys(before['evidence']['quoteIds']+[q['id'] for q in expected_author]+[expected_primary['id']]))
 require(actual_row['summary']==SUMMARY==cand['proposedTwoSentenceSummary'] and actual_row['fieldEvidence']['gameplay']=={'status':'corroborated','quoteIds':ids,'limitation':LIMITATION},'Broader mechanic or lost original citation introduced')
 require(qc.expected_gameplay_status(ids,qc.quote_index(s))=='corroborated' and qc.substantive(expected_primary['text']) and qc.substantive(expected_author[1]['text']),'Two substantive independent lineages do not support action')
 require(sum(e['status']=='corroborated' for r in d['minigames'] for e in r['fieldEvidence'].values())==348 and sum(r['fieldEvidence']['gameplay']['status']=='corroborated' for r in d['minigames'])==61 and sum(r['fieldEvidence']['category']['status']=='corroborated' for r in d['minigames'])==123 and all(r['complete'] is False for r in d['minigames']),'False narrow count or whole-row completion')
 historical_reward=read('reports/reward-quote-capture-audit-before-rosalina.json');current_reward=read('reports/reward-quote-capture-audit.json')
 require(digest(historical_reward)==p['baselineRewardAuditSha256'] and hashlib.sha256((ROOT/'reports/reward-quote-capture-audit-before-rosalina.json').read_bytes()).hexdigest()==p['baselineRewardAuditFileSha256'],'Complete original84-witness reward audit lost or changed')
 require(len(current_reward['checks'])==len(historical_reward['checks'])==84,'Old reward witness lost or added')
 old_reward=copy.deepcopy(current_reward);bindings=[]
 for i,(cur,old) in enumerate(zip(current_reward['checks'],historical_reward['checks'])):
  require({k:v for k,v in cur.items() if k!='bodySha256'}=={k:v for k,v in old.items() if k!='bodySha256'},'Old reward claim or nonhash witness changed')
  old_reward['checks'][i]['bodySha256']=old['bodySha256']
  if cur['bodySha256']!=old['bodySha256']:
   require(cur['id']=='MG071' and cur['quoteId']=='W071_reward_1' and cur['bodySha256']==w['passes'][cur['pass']-1]['bodySha256'],'Reward rebinding is not the same literal quote in actual current primary bytes')
   bindings.append({'index':i,'id':cur['id'],'quoteId':cur['quoteId'],'pass':cur['pass'],'beforeBodySha256':old['bodySha256'],'actualCurrentBodySha256':cur['bodySha256']})
 require(old_reward==historical_reward and bindings==p['rewardWitnessRebindings'] and len(bindings)==2,'Exact two-body rebinding or complete reward audit restoration differs')
 require(p['actualReceivedBodyFilesPhysicallyRehashedBeforeAndAfter']==4 and p['currentRegistry']=={'sources':151,'clips':1995,'pairedRecordsPerPass':154,'quoteRecoveries':sum(len(x['recoveredQuoteIds']) for z in rs for x in z)},'Physical body or complete current registry count differs')
 count+=module('check-rosalina-structural-candidate.py').validate(cand,old_d,old_s,old_rs)
 count+=module('check-ranked-gameplay-recovery.py').validate(read('reports/ranked-gameplay-recovery.json'),old_d,old_s,old_rs,reward_audit=old_reward)[3]
 return old_d,old_s,old_rs,old_reward,count
def historical_view_with_reward(d,s,rs):
 p=read('reports/rosalina-gameplay-recovery.json')
 if {'data':digest(d),'sources':digest(s),'reopens':[digest(x) for x in rs]}==BASE_DIGESTS:
  result=validate(p,read('minigames.json'),read('catalogue-sources.json'),[read('reports/source-reopens-pass'+x+'.json') for x in 'AB']);return d,s,rs,result[3]
 return validate(p,d,s,rs)[:4]
def historical_view(d,s,rs):return historical_view_with_reward(d,s,rs)[:3]
def run():
 p,d,s=read('reports/rosalina-gameplay-recovery.json'),read('minigames.json'),read('catalogue-sources.json');rs=[read('reports/source-reopens-pass'+x+'.json') for x in 'AB'];count=validate(p,d,s,rs)[4]
 for n in range(16):
  a,b,c,e=copy.deepcopy([p,d,s,rs])
  if n==0:b['minigames'][0]['summary']='Unsupported change. Another unsupported change.'
  elif n==1:b['minigames'][70]['fieldEvidence']['gameplay']['status']='single_source'
  elif n==2:b['minigames'][70]['controls']['inputTypes'].append('invented')
  elif n==3:a['baselineQuoteClassifications'][0]['substantive']=not a['baselineQuoteClassifications'][0]['substantive']
  elif n==4:next(x for x in c['sources'] if x['id']=='RANKED_REVIEW')['publisherLineage']='mariowiki'
  elif n==5:a['gameplayLimitation']='All exact controls timers scores and rewards are verified.'
  elif n==6:next(x for x in c['sources'] if x['id']=='W071')['quotes'][0]['text']='Changed original control'
  elif n==7:next(x for x in c['sources'] if x['id']=='RANKED_REVIEW')['quotes'].pop(0)
  elif n==8:next(x for x in e[1] if x['sourceId']=='W071')['recoveredQuoteIds'].pop()
  elif n==9:a['newPrimaryQuote']['text']='Unsupported new ramp quote'
  elif n==10:a['newHttpRequestsForAdoption']=4
  elif n==11:a['currentCoverage']['completeRows']=1
  elif n==12:a['rewardWitnessRebindings'].pop()
  elif n==13:a['baselineRewardAuditSha256']='0'*64
  elif n==14:a['retainedCandidatePacketSha256']='0'*64
  elif n==15:a['baselineReopenHashes'][1].pop()
  try:validate(a,b,c,e)
  except (AssertionError,KeyError,ValueError):pass
  else:raise AssertionError('Malformed Rosalina adoption or exact baseline restoration accepted')
 return [{'name':'One literal Rosalina action restores every accepted132-row151-source1992-classification154-record A+B value and full84-witness audit before every original gate','caseCount':count,'passed':True,'seed':None},{'name':'Sixteen genuine Rosalina adoption unrelated-field quote-history lineage qualifier native-recovery copyright and reward-audit negatives reject','caseCount':16,'passed':True,'seed':None}]
if __name__=='__main__':print(json.dumps(run(),indent=2))
