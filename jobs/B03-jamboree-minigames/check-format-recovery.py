"""Qualify three literal player arrangements and restore the entire genuinely accepted 19f catalogue."""
from pathlib import Path
import copy,hashlib,importlib.util,json
ROOT=Path(__file__).resolve().parent
BASELINE='19f1eaf8b21354ba273121fea13f9ddfaa2b5de8'
BASE_DIGESTS={'data':'8919290d5c969eb91765c767758875e5b48dd30921d05f26a9d5bf5423533cff','sources':'e94c6ba32af0bf1d80f456b261a239b49ec57332887893adf1798b89334c3ea5','reopens':['07383c5311782a34c1ec72823f0bfa04e273745ce185249d76272507088a83be','ca0dc2e427cc54a0d7970d14779f4a95f84d79591a04847d78bef630df0048bc']}
CANDIDATE='f4e9299b530a8de944f6516d51db0b747c34e4d2eb35efa0c6c87cbfca00a179'
IDS=['MG038','MG044','MG058']
LIMITATIONS={'MG038':'Only the literal core arrangement of one solo player versus a team of three is independently described. Exact controls, timers, win/score/tie/payout and alternate-mode availability retain separate qualifications.','MG044':'Only the literal core arrangement of two teams of two players is independently described. Exact controls, timers, win/score/tie/payout and alternate-mode availability retain separate qualifications.','MG058':'Only the literal core arrangement of a two-player duel is independently described. Exact controls, timers, win/score/tie/payout and alternate-mode availability retain separate qualifications.'}
SCOPE='Only three literal core player/team format evidence fields; every existing product value and unrelated evidence field remains exact.'
def read(n):return json.loads((ROOT/n).read_text())
def digest(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def module(n):
 spec=importlib.util.spec_from_file_location(n.replace('-','_'),ROOT/n);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
def validate(p,d,s,rs):
 if (ROOT/'reports/preview-player-arrangement-recovery.json').exists():
  newer=module('check-preview-arrangement-recovery.py')
  if {'data':digest(d),'sources':digest(s),'reopens':[digest(x) for x in rs]}!=newer.BASE_DIGESTS:
   d,s,rs=newer.historical_view(d,s,rs)

 count=0
 def require(ok,msg):
  nonlocal count
  count+=1
  if not ok:raise AssertionError(msg)
 cand=read('reports/player-format-candidates.json');require(digest(cand)==CANDIDATE and p['retainedCandidateSha256']==CANDIDATE,'Complete historical UNADOPTED candidate changed')
 require(p['job']=='B03' and p['baselineSourceCommit']==BASELINE and p['baselineDigests']==BASE_DIGESTS and p['scope']==SCOPE,'Wrong genuinely accepted parent or semantic scope')
 require(p['newHttpRequests']==0 and p['fullCopyrightBodiesPublished'] is False and p['newCumulativeAuthorWordsAtAdoption']==0 and p['previousCommittedAndReservedAuthorWords']==148,'New HTTP invented, prior reserved author words recounted or full body published')
 require(p['currentCoverage']=={'supportedFacts':351,'remainingFields':969,'completeRows':0,'gameplayCorroborated':61,'gameplaySingleSource':71,'categoriesCorroborated':123,'categoriesSingleSource':9},'Broader field or whole-row gain claimed')
 require(len(d['minigames'])==132 and len(s['sources'])==151 and all(len(z)==154 for z in rs),'Original roster/source/history cardinality changed')
 old_d=copy.deepcopy(d);rows={x['id']:x for x in d['minigames']};require(set(p['beforeFormatEvidence'])==set(IDS),'Wrong affected format fields')
 for r in old_d['minigames']:
  if r['id'] in IDS:r['fieldEvidence']['format']=copy.deepcopy(p['beforeFormatEvidence'][r['id']])
 require(digest(old_d)==BASE_DIGESTS['data'] and len(p['baselineRowHashes'])==132,'Any original summary/control/timer/rule/phone/confidence/category value changed')
 for r,h in zip(old_d['minigames'],p['baselineRowHashes']):require(h=={'id':r['id'],'sha256':digest(r)},'Complete accepted row fingerprint differs')
 affected={'RANKED_REVIEW','W038','W044','W058'};require(set(p['beforeSources'])==affected and set(p['beforeReopens'])=={'1','2'} and all(set(x)==affected for x in p['beforeReopens'].values()),'Whole affected source/history restoration scope differs')
 old_s=copy.deepcopy(s);old_s['sources']=[copy.deepcopy(p['beforeSources'].get(x['id'],x)) for x in s['sources']];require(digest(old_s)==BASE_DIGESTS['sources'] and len(p['baselineSourceHashes'])==151,'Any old source/quote metadata or history changed')
 for x in old_s['sources']:require(p['baselineSourceHashes'][x['id']]==digest(x),'Whole accepted source fingerprint differs')
 old_rs=[[copy.deepcopy(p['beforeReopens'][str(n)].get(x['sourceId'],x)) for x in z] for n,z in enumerate(rs,1)];require([digest(z) for z in old_rs]==BASE_DIGESTS['reopens'],'Any complete old paired source record changed')
 for n,z in enumerate(old_rs):
  require(len(p['baselineReopenHashes'][n])==154,'Accepted paired source fingerprint missing')
  for x,h in zip(z,p['baselineReopenHashes'][n]):require(h=={'sourceId':x['sourceId'],'sha256':digest(x)},'Whole accepted source record fingerprint differs')
 qc=module('quote-support-check.py');classes=[{'id':q['id'],'substantive':qc.substantive(q['text'])} for x in old_s['sources'] for q in x['quotes']];require(len(classes)==len(p['baselineQuoteClassifications'])==1995,'Old quotation classification count differs')
 for actual,old in zip(classes,p['baselineQuoteClassifications']):require(actual==old,'An original lexical classifier changed')
 beforeby={x['id']:x for x in old_s['sources']};by={x['id']:x for x in s['sources']};expected_new={sid:[] for sid in affected}
 for f in cand['proposedFormatFields']:
  rid=f['id'];scope=LIMITATIONS[rid];primary={'id':f['primary']+'_format_common','text':f['primaryQuotes'][0],'locator':'Complete paired primary intro/Overview, literal player/team count; original controller/image/note context retained','scope':scope};author={'id':'RANK_'+rid+'_format_common','text':f['authorQuotes'][0],'locator':'Complete original named '+f['heading']+' paragraph by Stacey Henley','scope':scope};expected_new[f['primary']].append(primary);expected_new['RANKED_REVIEW'].append(author)
  require(p['beforeFormatEvidence'][rid]==f['beforeFormatEvidence'] and f['beforeFormatEvidence']['status']=='single_source' and rows[rid]['format']==f['proposedFormat'],'Wrong existing arrangement or already-supported field recounted')
  ids=list(dict.fromkeys(f['beforeFormatEvidence']['quoteIds']+f['existingPrimaryQuoteIds']+f['existingAuthorQuoteIds']+[primary['id'],author['id']]))
  require(rows[rid]['fieldEvidence']['format']=={'status':'corroborated','quoteIds':ids,'limitation':scope},'Broader format scope or original citation loss')
 require(p['newQuoteMetadata']==expected_new and sum(len(v) for v in expected_new.values())==6,'Literal new quote scope or metadata differs')
 for sid,new in expected_new.items():
  old=beforeby[sid];src=by[sid];expected=copy.deepcopy(old);expected['quotes']+=new;ids=[q['id'] for q in expected['quotes']];expected['uniqueQuotedWords']=sum(len(t.split()) for t in {q['text'] for q in expected['quotes']})
  for x in expected['passes']:x['recoveredQuoteIds']=ids
  require(src==expected and src['uniqueQuotedWords']<=200 and all(len(q['text'].split())<=25 for q in new),'Any undeclared quote/source/body identity or copyright change')
  require(src['publisherLineage']==('valnet' if sid=='RANKED_REVIEW' else 'mariowiki'),'Source identity or real independent publisher lineage differs')
  for n,z in enumerate(rs,1):
   current=next(x for x in z if x['sourceId']==sid);expectedrec=copy.deepcopy(p['beforeReopens'][str(n)][sid]);expectedrec['recoveredQuoteIds']=ids;expectedrec['quotes']=[{k:q[k] for k in ['id','text','locator']} for q in src['quotes']];require(current==expectedrec and current['missingQuoteIds']==[],'Any unproved native request, body SHA or quote witness rebinding')
 require(by['RANKED_REVIEW']['uniqueQuotedWords']==148 and beforeby['RANKED_REVIEW']['uniqueQuotedWords']==122 and sum(len(q['text'].split()) for q in expected_new['RANKED_REVIEW'])==26,'Existing reserved26 author words not accounted for exactly')
 witnesses=p['actualNativeWitnessPairs'];pairs={(x['sourceId'],x['pass']) for x in witnesses};require(len(witnesses)==len(pairs)==8 and pairs=={(sid,n) for sid in affected for n in [1,2]},'Duplicate native scope or missing exact independent source/pass pair')
 require(p['actualBodiesPhysicallyRehashedBeforeAndAfter']==8,'A retained raw body was not physically reread')
 for w in witnesses:
  sid,n=w['sourceId'],w['pass'];old=beforeby[sid]['passes'][n-1];key='THEGAMER' if sid=='RANKED_REVIEW' else sid;cap=next(x for x in cand['actualCaptures'] if x['key']==key and x['pass']==n)
  require(w['bodySha256']==old['bodySha256']==cap['actualBodySha256'] and w['bodyBytes']==old['bodyBytes']==cap['actualBodyBytes'] and w['oldCompleteScopeSha256']==old['textSha256'],'False native body or accepted complete scope')
  require(w['allOldAndNewQuoteIdsLiterallyRecovered']==[q['id'] for q in by[sid]['quotes']] and w['newLiteralQuotes']==[q['text'] for q in expected_new[sid]] and w['completeOriginalControlsImagesAndFootnotesRetained'] is True,'Incomplete old/new literal source recovery or lost qualifiers')
  require(w['actualNewHttpRequests']==0 and w['originalRequestStartedUTC']==cap['startedUTC'] and w['originalRequestClosedUTC']==cap['closedUTC'],'Original finite request identity replaced or invented')
  if sid=='RANKED_REVIEW':
   a=cand['pairedAuthorScopes'][n-1];require(w['namedOriginalContextsSha256']==digest(a['namedContexts']) and w['nativeOriginalAuthor']=={'name':a['name'],'selector':a['selector'],'profileURL':a['profileURL'],'publishedDateTime':a['publishedDateTime']},'Generic/unrelated author context substituted')
  else:
   a=next(x for x in cand['pairedPrimaryScopes'] if x['sourceId']==sid and x['pass']==n);require(w['normalizedMatchingScopeSha256']==a['normalizedMatchingScopeSha256'] and w['actualImageAltLabelsRead']==a['allActualImageAltLabelsRead'],'Primary matching representation or original controller images changed')
 require(len({(x['sourceId'],x['pass']) for x in cand['pairedPrimaryScopes']})==6 and {(x['sourceId'],x['pass']) for x in cand['pairedPrimaryScopes']}=={(sid,n) for sid in affected-{'RANKED_REVIEW'} for n in [1,2]},'Historical candidate lacks exact unique paired primary scope binding')
 reward=(ROOT/'reports/reward-quote-capture-audit.json').read_bytes();require(hashlib.sha256(reward).hexdigest()==p['completeRewardAuditFileSha256']==cand['rewardAuditFileSha256'] and len(json.loads(reward)['checks'])==84 and p['rewardWitnessRebindings']==[],'Any complete old reward audit changed or unproved hash rebinding')
 require(p['currentRegistry']=={'sources':151,'clips':2001,'pairedRecordsPerPass':154,'quoteRecoveries':sum(len(x['recoveredQuoteIds']) for z in rs for x in z)},'Current full source/quotation/history count differs')
 require(sum(e['status']=='corroborated' for r in d['minigames'] for e in r['fieldEvidence'].values())==351 and sum(r['fieldEvidence']['gameplay']['status']=='corroborated' for r in d['minigames'])==61 and sum(r['fieldEvidence']['category']['status']=='corroborated' for r in d['minigames'])==123 and all(r['complete'] is False for r in d['minigames']),'Any unrelated narrow or whole-row gain')
 count+=module('check-format-candidates.py').validate(cand,old_d,old_s,old_rs)
 return old_d,old_s,old_rs,count
def historical_view(d,s,rs):
 p=read('reports/player-format-recovery.json')
 if {'data':digest(d),'sources':digest(s),'reopens':[digest(z) for z in rs]}==BASE_DIGESTS:
  validate(p,read('minigames.json'),read('catalogue-sources.json'),[read('reports/source-reopens-pass'+n+'.json') for n in 'AB']);return d,s,rs
 return validate(p,d,s,rs)[:3]
def run():
 p,d,s=read('reports/player-format-recovery.json'),read('minigames.json'),read('catalogue-sources.json');rs=[read('reports/source-reopens-pass'+n+'.json') for n in 'AB'];count=validate(p,d,s,rs)[3]
 for n in range(20):
  a,b,c,z=copy.deepcopy([p,d,s,rs])
  if n==0:b['minigames'][0]['summary']='Unsupported. Another unsupported change.'
  elif n==1:b['minigames'][37]['fieldEvidence']['format']['status']='single_source'
  elif n==2:b['minigames'][43]['format']='Two teams of four.'
  elif n==3:c['sources'][0]['quotes'].pop(0)
  elif n==4:a['baselineQuoteClassifications'][0]['substantive']=not a['baselineQuoteClassifications'][0]['substantive']
  elif n==5:next(x for x in c['sources'] if x['id']=='RANKED_REVIEW')['publisherLineage']='mariowiki'
  elif n==6:a['actualNativeWitnessPairs'][0]['bodySha256']='0'*64
  elif n==7:a['actualNativeWitnessPairs'][1]=copy.deepcopy(a['actualNativeWitnessPairs'][0])
  elif n==8:next(x for x in a['actualNativeWitnessPairs'] if x['sourceId']=='RANKED_REVIEW')['nativeOriginalAuthor']['name']='Dan Conlin'
  elif n==9:a['baselineRowHashes'].pop()
  elif n==10:a['baselineSourceHashes'].pop(next(iter(a['baselineSourceHashes'])))
  elif n==11:a['baselineReopenHashes'][1].pop()
  elif n==12:a['newCumulativeAuthorWordsAtAdoption']=26
  elif n==13:a['newHttpRequests']=8
  elif n==14:a['currentCoverage']['completeRows']=1
  elif n==15:a['completeRewardAuditFileSha256']='0'*64
  elif n==16:a['actualNativeWitnessPairs'].pop()
  elif n==17:a['newQuoteMetadata']['W038'][0]['text']='Four players face a team of one.'
  elif n==18:b['minigames'][57]['controls']['inputTypes'].append('invented')
  elif n==19:next(x for x in z[1] if x['sourceId']=='W058')['bodySha256']='0'*64
  try:validate(a,b,c,z)
  except (AssertionError,KeyError,ValueError):pass
  else:raise AssertionError('Malformed format adoption, duplicate source pair or full historical preservation accepted')
 return [{'name':'Three literal formats restore accepted132 rows151 sources1995 classifiers154-record A+B histories and unchanged84-witness audit before every original gate','caseCount':count,'passed':True,'seed':None},{'name':'Twenty genuine format-adoption source-pair literal-count unrelated-field lineage quota full-history and reward-audit negatives reject','caseCount':20,'passed':True,'seed':None}]
if __name__=='__main__':print(json.dumps(run(),indent=2))
