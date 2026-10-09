"""Check three literal player-format candidates against the genuine accepted entire 9c1 catalogue."""
from pathlib import Path
from datetime import datetime
import copy,hashlib,importlib.util,json,re
ROOT=Path(__file__).resolve().parent
BASELINE='9c1f2b8f9ecc1d675298fa09bab4611d1e5e23ae'
BASE_DIGESTS = {'data': '8919290d5c969eb91765c767758875e5b48dd30921d05f26a9d5bf5423533cff', 'sources': 'e94c6ba32af0bf1d80f456b261a239b49ec57332887893adf1798b89334c3ea5', 'reopens': ['07383c5311782a34c1ec72823f0bfa04e273745ce185249d76272507088a83be', 'ca0dc2e427cc54a0d7970d14779f4a95f84d79591a04847d78bef630df0048bc']}
IDS=['MG038','MG044','MG058']
HEADINGS=['11 Best 1 vs. 3: Income Stream','10 Best 2 vs. 2: Prime Cut','9 Best Duel: All The Marbles']
AUTHOR_QUOTES=[['and get to combine their totals'],['2 vs. 2 Minigames see the regular travelling troupe split into two teams'],['They pit two players against each other']]
PRIMARY_QUOTES=[['Income Stream is a 1-vs.-3 coin -collecting minigame in Super Mario Party Jamboree.'],['Prime Cut is a 2-vs.-2 minigame found in Super Mario Party Jamboree.'],['In the introduction, the camera scrolls through a cardboard track before meeting the two player characters at the end.']]
def read(n):return json.loads((ROOT/n).read_text())
def digest(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def module(n):
 spec=importlib.util.spec_from_file_location(n.replace('-','_'),ROOT/n);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
def validate(p,d,s,rs):
 count=0
 def require(ok,msg):
  nonlocal count
  count+=1
  if not ok:raise AssertionError(msg)
 require(p['job']=='B03' and p['status']=='UNADOPTED_RESEARCH' and p['acceptedProductBaseline']==BASELINE,'Candidate has a false stage or accepted source')
 require(p['baselineDigests']=={'data':digest(d),'sources':digest(s),'reopens':[digest(x) for x in rs]}==BASE_DIGESTS,'Accepted complete product or source history changed')
 require(p['currentSupportedFacts']==348 and p['currentOpenFields']==972 and p['currentWholeRowsComplete']==0 and p['currentGameplayCorroborated']==61 and p['currentCategoriesCorroborated']==123,'Unadopted field or whole-row gain invented')
 require(p['acceptedRowsSourcesAndPairedHistoryUnchanged'] is True and p['fullCopyrightBodiesPublished'] is False and p['newHttpRequests']==0,'False accepted change or HTTP or full-source publication')
 require(len(d['minigames'])==len(p['baselineRowHashes'])==132 and len(s['sources'])==len(p['baselineSourceHashes'])==151,'Accepted roster/source fingerprints missing')
 for x,h in zip(d['minigames'],p['baselineRowHashes']):require(h=={'id':x['id'],'sha256':digest(x)},'Accepted row fingerprint differs')
 for x in s['sources']:require(p['baselineSourceHashes'][x['id']]==digest(x),'Accepted source quote/author budget differs')
 for n,z in enumerate(rs):
  require(len(z)==len(p['baselineReopenHashes'][n])==154,'Accepted entire paired source history fingerprint missing')
  for x,h in zip(z,p['baselineReopenHashes'][n]):require(h=={'sourceId':x['sourceId'],'sha256':digest(x)},'Accepted whole source record differs')
 qc=module('quote-support-check.py');classes=[{'id':q['id'],'substantive':qc.substantive(q['text'])} for x in s['sources'] for q in x['quotes']]
 require(len(classes)==len(p['baselineQuoteClassifications'])==1995,'Accepted classifier count differs')
 for a,b in zip(classes,p['baselineQuoteClassifications']):require(a==b,'An accepted lexical classification changed')
 require(hashlib.sha256((ROOT/'reports/reward-quote-capture-audit.json').read_bytes()).hexdigest()==p['rewardAuditFileSha256'],'Complete current84-witness reward audit changed')
 by={x['id']:x for x in s['sources']};rows={x['id']:x for x in d['minigames']}
 require(p['primaryPublisherLineage']=='mariowiki' and p['independentPublisherLineage']==by['RANKED_REVIEW']['publisherLineage']=='valnet' and p['canonicalAuthorURL']==by['RANKED_REVIEW']['url']=='https://www.thegamer.com/super-mario-party-jamboree-best-minigames/','False independent author lineage or URL')
 require(p['previousCumulativeAuthorQuotationWords']==by['RANKED_REVIEW']['uniqueQuotedWords']==122 and p['newCumulativeAuthorQuotationWords']==26 and p['currentCommittedAndReservedAuthorWords']==148<=p['sharedCanonicalAuthorWordCeiling']==200,'Canonical historical or prospective quotation budget changed')
 require(len(p['proposedFormatFields'])==3 and [x['id'] for x in p['proposedFormatFields']]==IDS,'Wrong format candidate scope')
 for n,f in enumerate(p['proposedFormatFields']):
  r=rows[f['id']];w=by[f['primary']];require(f['name']==r['name'] and f['proposedFormat']==r['format'] and f['beforeFormatEvidence']==r['fieldEvidence']['format'] and f['beforeFormatEvidence']['status']=='single_source','Wrong current row/count or unsupported value change')
  require(w['publisherLineage']=='mariowiki' and f['heading']==HEADINGS[n] and f['authorQuotes']==AUTHOR_QUOTES[n] and f['primaryQuotes']==PRIMARY_QUOTES[n],'Literal named/count paragraph evidence changed')
  require(all(len(x.split())<=25 for x in f['authorQuotes']+f['primaryQuotes']) and f['primaryCommittedAndReservedWords']==w['uniqueQuotedWords']+sum(len(x.split()) for x in set(f['primaryQuotes'])-{q['text'] for q in w['quotes']})<=200,'Fact excerpt or source quota exceeded')
  require(set(f['existingAuthorQuoteIds'])<={q['id'] for q in by['RANKED_REVIEW']['quotes']} and set(f['existingPrimaryQuoteIds'])<={q['id'] for q in w['quotes']},'Missing literal existing quote cited')
 caps=p['actualCaptures'];cap={(x['key'],x['pass']):x for x in caps};require(len(caps)==len(cap)==p['actualAlreadyReceivedPairedBodiesRehashed']==8 and set(cap)=={(x,n) for x in ['THEGAMER','W038','W044','W058'] for n in [1,2]},'Repeated/missing native raw context is not a new source')
 for (key,n),c in cap.items():
  require(c['event']=='CLOSED' and c['attempts']==1 and c['exitCode']==0 and c['httpStatus']==200 and c['tlsVerifyResult']==0 and c['actualBodyBytes']>1000 and bool(re.fullmatch('[0-9a-f]{64}',c['actualBodySha256'])),'Failed insecure incomplete or hashless native source')
  require(datetime.fromisoformat(c['closedUTC'])>=datetime.fromisoformat(c['startedUTC']) and c['effectiveURL'].startswith('https://'),'Native closure or actual URL invalid')
 for key in ['THEGAMER','W038','W044','W058']:require(datetime.fromisoformat(cap[key,2]['startedUTC'])>datetime.fromisoformat(cap[key,1]['closedUTC']),'Second actual source response preceded first closure')
 require(len(p['pairedAuthorScopes'])==2 and len(p['pairedPrimaryScopes'])==6,'Complete literal paired scopes missing')
 for n,a in enumerate(p['pairedAuthorScopes'],1):
  require(a['pass']==n and a['name']=='Stacey Henley' and a['selector']=='.w-author-name a.article-author' and a['profileURL']=='https://www.thegamer.com/author/stacey-henley/' and a['publishedDateTime']=='2024-10-17T05:30:13Z','Related-card name or false original native author')
  require(a['fullScopeCharacters']>6500 and a['fullScopeSha256']==by['RANKED_REVIEW']['passes'][n-1]['textSha256'] and a['oldRegisteredQuotesRecovered']==[q['id'] for q in by['RANKED_REVIEW']['quotes']],'Entire authored article or old quote recovery differs')
  require(len(a['namedContexts'])==3,'Named original context missing')
  for f,c in zip(p['proposedFormatFields'],a['namedContexts']):
   expected=f['authorQuotes']+[q['text'] for q in by['RANKED_REVIEW']['quotes'] if q['id'] in f['existingAuthorQuoteIds']]
   require(c['id']==f['id'] and c['heading']==f['heading'] and c['fullNamedParagraphCharacters']>250 and bool(re.fullmatch('[0-9a-f]{64}',c['fullNamedParagraphSha256'])) and c['allExistingAndNewLiteralQuotesRecovered']==expected,'Generic category/name evidence substituted for a complete named author paragraph')
 for w in p['pairedPrimaryScopes']:
  f=next(x for x in p['proposedFormatFields'] if x['id']==w['id']);src=by[f['primary']];n=w['pass'];require(w['sourceId']==f['primary'] and n in [1,2] and w['fullScopeCharacters']>6500 and w['fullScopeSha256']==src['passes'][n-1]['textSha256'],'Incomplete or wrong retained full primary scope')
  require(w['allOldRegisteredQuoteIdsRecovered']==[q['id'] for q in src['quotes']] and w['newLiteralQuotesRecovered']==f['primaryQuotes'] and w['existingLiteralFormatQuotesRecovered']==[q['text'] for q in src['quotes'] if q['id'] in f['existingPrimaryQuoteIds']] and w['completeOriginalControlsImagesAndFootnotesRetained'] is True,'Lost literal scope, old quote, original controller or footnote')
 require(all(not r['complete'] for r in d['minigames']) and sum(e['status']=='corroborated' for r in d['minigames'] for e in r['fieldEvidence'].values())==348,'Whole-row completion or unadopted increase invented')
 count+=module('check-rosalina-gameplay-recovery.py').validate(read('reports/rosalina-gameplay-recovery.json'),d,s,rs)[4]
 return count
def run():
 p,d,s=read('reports/player-format-candidates.json'),read('minigames.json'),read('catalogue-sources.json');rs=[read('reports/source-reopens-pass'+n+'.json') for n in 'AB'];count=validate(p,d,s,rs)
 for n in range(16):
  a,b,c,z=copy.deepcopy([p,d,s,rs])
  if n==0:a['status']='ADOPTED'
  elif n==1:a['currentSupportedFacts']=351
  elif n==2:a['baselineQuoteClassifications'][0]['substantive']=not a['baselineQuoteClassifications'][0]['substantive']
  elif n==3:a['independentPublisherLineage']='mariowiki'
  elif n==4:a['actualCaptures'][1]=copy.deepcopy(a['actualCaptures'][0])
  elif n==5:a['proposedFormatFields'][1]['heading']='Unnamed generic two-team group'
  elif n==6:a['fullCopyrightBodiesPublished']=True
  elif n==7:a['currentCommittedAndReservedAuthorWords']=199
  elif n==8:a['proposedFormatFields'][2]['authorQuotes']=['Four players face each other']
  elif n==9:a['pairedPrimaryScopes'][0]['newLiteralQuotesRecovered']=[]
  elif n==10:b['minigames'][0]['controls']['inputTypes'].append('invented')
  elif n==11:c['sources'][0]['quotes'].pop(0)
  elif n==12:a['baselineReopenHashes'][1].pop()
  elif n==13:a['rewardAuditFileSha256']='0'*64
  elif n==14:a['newHttpRequests']=8
  elif n==15:a['pairedAuthorScopes'][1]['profileURL']='https://www.thegamer.com/author/dan-conlin/'
  try:validate(a,b,c,z)
  except (AssertionError,KeyError,ValueError):pass
  else:raise AssertionError('Malformed player-format candidate or premature adoption accepted')
 return [{'name':'Three exact named player formats preserve accepted132 rows151 sources1995 classifications154-record paired histories and all original recovery gates','caseCount':count,'passed':True,'seed':None},{'name':'Sixteen real format-candidate wrong-stage count lineage native-scope copyright old-history and unrelated-field fixtures reject','caseCount':16,'passed':True,'seed':None}]
if __name__=='__main__':print(json.dumps(run(),indent=2))
