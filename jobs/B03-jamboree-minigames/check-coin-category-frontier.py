"""Keep literal category candidates distinct from combined groups and failed captures."""
from pathlib import Path
import copy,hashlib,importlib.util,json
ROOT=Path(__file__).resolve().parent
BASE='46571d63796f584047ee81b3dd9735be7f23deff'
BASE_DIGESTS={'data': '02e45a08c615a18b071f35c63ba896398904934b4783d09489f9caf79251ac2b', 'sources': 'a416a400e9e188454e1d2f6247cbdc79f7b12bdf0567d007987bc2a32e4e318a', 'reopens': ['1218f83b1f07e58b897c5964fc06734343b32f2abaa8e8f1cf9f21fc184a25ba', '9dff347c11b942edc504b0815a092c3986856809b658e643760ee9fd7ae96151']}
def read(n):return json.loads((ROOT/n).read_text())
def digest(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def module(n):
 s=importlib.util.spec_from_file_location(n.replace('-','_'),ROOT/n);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def validate(p,d,s,rs):
 count=0
 def require(ok,msg):
  nonlocal count
  count+=1
  if not ok:raise AssertionError(msg)
 require(p['job']=='B03' and p['status']=='UNADOPTED_CATEGORY_RESEARCH' and p['acceptedSourceCommit']==BASE,'Candidate scope or accepted parent differs')
 require(p['baselineDigests']==BASE_DIGESTS and {'data':digest(d),'sources':digest(s),'reopens':[digest(x) for x in rs]}==BASE_DIGESTS,'Accepted full product/source/history changed')
 require(p['currentCoverage']=={'supportedFacts':351,'remainingFields':969,'completeRows':0,'categoriesCorroborated':123,'categoriesSingleSource':9,'gameplayCorroborated':61,'gameplaySingleSource':71},'Unsupported coverage gain')
 require(len(d['minigames'])==132 and len(s['sources'])==151 and all(len(x)==154 for x in rs),'Original roster/source/history counts differ')
 require(len(p['rowHashes'])==132 and len(p['sourceHashes'])==151 and all(len(z)==154 for z in p['reopenHashes']),'Missing full accepted fingerprint')
 for r,h in zip(d['minigames'],p['rowHashes']):require(h=={'id':r['id'],'sha256':digest(r)},'Original row differs')
 for z in s['sources']:require(p['sourceHashes'][z['id']]==digest(z),'Original source differs')
 for n,z in enumerate(rs):
  for a,h in zip(z,p['reopenHashes'][n]):require(h=={'sourceId':a['sourceId'],'sha256':digest(a)},'Complete native history differs')
 qc=module('quote-support-check.py');classes=[{'id':q['id'],'substantive':qc.substantive(q['text'])} for z in s['sources'] for q in z['quotes']]
 require(len(classes)==len(p['quoteClassifications'])==2001,'Prior clip classifications missing')
 for a,b in zip(classes,p['quoteClassifications']):require(a==b,'Original classifier changed')
 require(p['rewardAuditSha256']==hashlib.sha256((ROOT/'reports/reward-quote-capture-audit.json').read_bytes()).hexdigest() and p['rewardWitnessRebindings']==[],'Reward audit changed')
 rows={r['id']:r for r in d['minigames']};by={z['id']:z for z in s['sources']}
 expected=[{'id':r['id'],'name':r['name'],'category':r['category'],'beforeEvidence':r['fieldEvidence']['category']} for r in d['minigames'] if r['fieldEvidence']['category']['status']!='corroborated']
 require(p['openCategories']==expected and len(expected)==9,'Wrong unresolved Coin subset')
 require(p['nativeRequests']==4 and p['nativeConcurrency']==2 and p['retry']==0 and p['actualRetainedBodiesPhysicallyRehashed']==4 and p['allNativeChildrenNaturallyClosed'] is True,'Invented fetch or retry')
 caps=p['newNativeCaptures'];require(len(caps)==len({(x['key'],x['pass']) for x in caps})==4 and {(x['key'],x['pass']) for x in caps}=={(k,n) for k in ['MPL_PREVIEW','ZXMANY_VIDEO'] for n in [1,2]},'Duplicate or missing real attempt')
 for x in caps:
  require(x['event']=='CLOSED' and x['attempts']==1 and x['startedUTC']<x['closedUTC'],'Unclosed native request')
  if x['key']=='ZXMANY_VIDEO':
   require(x['exitCode']==56 and x['httpStatus']==0 and x['actualBodyBytes']==0 and x['actualBodySha256']==hashlib.sha256(b'').hexdigest(),'Failed video was turned into a received body')
  else:require(x['exitCode']==0 and x['httpStatus']==200 and x['tlsVerifyResult']==0 and x['actualBodyBytes']==160430,'Actual full preview transport differs')
 require(p['blockedVideo']=={'status':'BLOCKED_SOURCE_LEAD','url':'https://www.youtube.com/watch?v=QZNNVuI5asA','actualReceivedResponseBodies':0,'authorIdentityVerified':False,'independentFactEvidenceAccepted':False,'headerHTTPStatus':403,'scope':'Two genuine curl56/HTTP000 attempts received no response body; Exa search description is discovery only.'},'Unavailable source or discovery promoted')
 preview=p['preview'];require(preview['url']=='https://mariopartylegacy.com/2024/09/every-minigame-in-super-mario-party-jamboree-so-far/' and preview['publisherLineage']=='mariopartylegacy' and preview['authorName']=='SuperZambezi','Original author/source scope differs')
 require(preview['allNamedCoinCandidates']==['Lane Change'] and preview['otherCoinTableCellsUnknown']==8 and preview['singleGroupCount']==9 and preview['allGroupCount']==5 and preview['fullBodyCharacters']==3662 and preview['preReleaseScope'] is True,'Partial preview treated as final nine-name list')
 require(len(preview['pairedScopes'])==2 and [x['pass'] for x in preview['pairedScopes']]==[1,2] and len({x['fullBodySha256'] for x in preview['pairedScopes']})==1,'Wrong paired full authored scope')
 clips=preview['newReservedQuotes'];require(clips==['These are single player minigames where you collect coins to move your character in the Koopathlon mode.','We’re not quite sure what’s what just yet.','Lane Change'],'Literal candidate clips changed')
 require(all(len(x.split())<=25 for x in clips) and preview['canonicalReservedWords']==sum(len(x.split()) for x in set(clips))<=200,'Citation or source ceiling exceeded')
 candidate=p['laneChangeCandidate'];require(candidate['id']=='MG084' and candidate['name']=='Lane Change' and candidate['status']=='UNADOPTED' and candidate['scope']=='Only membership in the individual coin-collecting Koopathlon group; no exact controls, timer, score or final whole-game availability.' and candidate['originalCategoryEvidence']==rows['MG084']['fieldEvidence']['category'] and candidate['acceptedIndependentEvidenceFields']==0,'Broader candidate or adoption claimed')
 require(p['primaryCoinGroupNames']==[x['name'] for x in expected] and p['primaryCoinHeading']=='Coin Minigames [ edit ]','Wrong complete literal primary membership')
 namu=p['retainedNamu'];require(namu['sourceId']=='NAMU_BASE' and namu['groupCount']==14 and namu['knownNames']==[r['name'] for r in d['minigames'][78:92]] and namu['independentlyAssignedCoinMembers']==[] and namu['newAuthoredQuoteWords']==0 and namu['sharedAuthoredWords']==250,'Combined Namu group promoted or quota changed')
 require(len(namu['pairedScopes'])==2 and [x['pass'] for x in namu['pairedScopes']]==[1,2] and all(x['fullGroupScopeCharacters']==4064 and x['fullGroupScopeSha256']=='2e83d602467bbb048e654d9d611988a286778a8aab4abc658d23a6e091db105d' for x in namu['pairedScopes']),'Incomplete or substituted fourteen-member context')
 for sid,key in [('NAMU_BASE','retainedNamu'),('W_LIST','retainedPrimary')]:
  witnesses=p[key]['captures'];require(len(witnesses)==2,'Missing retained native witness')
  for n,x in enumerate(witnesses):
   old=by[sid]['passes'][n];require(x['bodyBytes']==old['bodyBytes'] and x['bodySha256']==old['bodySha256'] and x['httpStatus']==200 and x['tlsVerified'] is True and x['newHttpRequests']==0,'Retained raw body or HTTP history rebound')
 require(p['fullCopyrightBodiesPublished'] is False and p['newNamuQuotes']==[] and p['newRegistryQuotes']==[] and p['allAcceptedProductSourceAndPairedHistoryUnchanged'] is True,'Public body, old quota or source registry changed')
 return count
def run():
 p,d,s=read('reports/coin-category-frontier.json'),read('minigames.json'),read('catalogue-sources.json');rs=[read('reports/source-reopens-pass'+n+'.json') for n in 'AB']
 if (ROOT/'reports/preview-player-arrangement-recovery.json').exists():d,s,rs=module('check-preview-arrangement-recovery.py').historical_view(d,s,rs)
 count=validate(p,d,s,rs)
 for n in range(16):
  a,b,c,z=copy.deepcopy([p,d,s,rs])
  if n==0:b['minigames'][83]['fieldEvidence']['category']['status']='corroborated'
  elif n==1:a['currentCoverage']['supportedFacts']=360
  elif n==2:a['preview']['allNamedCoinCandidates'].append('Noggin Knock')
  elif n==3:a['preview']['otherCoinTableCellsUnknown']=0
  elif n==4:a['retainedNamu']['independentlyAssignedCoinMembers']=['Lane Change']
  elif n==5:a['retainedNamu']['groupCount']=9
  elif n==6:a['blockedVideo']['authorIdentityVerified']=True
  elif n==7:next(x for x in a['newNativeCaptures'] if x['key']=='ZXMANY_VIDEO')['actualBodyBytes']=1
  elif n==8:a['newNativeCaptures'][1]=copy.deepcopy(a['newNativeCaptures'][0])
  elif n==9:a['laneChangeCandidate']['status']='ADOPTED'
  elif n==10:a['preview']['authorName']='Nintendo'
  elif n==11:a['retainedPrimary']['captures'][0]['bodySha256']='0'*64
  elif n==12:a['quoteClassifications'][0]['substantive']=not a['quoteClassifications'][0]['substantive']
  elif n==13:a['preview']['canonicalReservedWords']=201
  elif n==14:a['rewardAuditSha256']='0'*64
  elif n==15:a['retainedNamu']['newAuthoredQuoteWords']=1
  try:validate(a,b,c,z)
  except (AssertionError,KeyError,ValueError):pass
  else:raise AssertionError('Partial category, invented failed response, duplicate witness or quota breach accepted')
 return [{'name':'Literal Coin category frontier preserves accepted132 rows151 sources2001 classifications154-record A+B and distinguishes partial preview combined14-member group and absent video bodies','caseCount':count,'passed':True,'seed':None},{'name':'Sixteen genuine partial-category premature-adoption failed-body duplicate-witness quota author full-history and audit negatives reject','caseCount':16,'passed':True,'seed':None}]
if __name__=='__main__':print(json.dumps(run(),indent=2))
