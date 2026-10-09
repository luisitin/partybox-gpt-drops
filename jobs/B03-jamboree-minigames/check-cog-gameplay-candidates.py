"""Validate real paired COG research without promoting the accepted catalogue."""
from pathlib import Path
from datetime import datetime
import copy,hashlib,json,re,unicodedata
ROOT=Path(__file__).resolve().parent
BASELINE='0be9fa1a683e2e13bfbcc65087ad19a6523151f5'
BASE_DIGESTS={'data': 'ad9b8b8c792573b1d2766d4443d12833683c7c13a1408442f1fa8cf4c5036dc6', 'sources': 'e1e8ce9debf5f7c6f2146c0e78eeae57d1fd9afb5813eedd75717b74905150d7', 'reopens': ['04d5b857e7f694db6571fba1a0ad794ca07cb8c49e718e30db008ea786861943', '0897f6bad7744be10d6959580f62e5b7d812cbbda71f981d8b07162caeb97b4d']}
PACKET='b6acaa08f128f3599308cfb1ed10f86b8bfebe3bf070d5ddd8ea42683388bab4'
IDS=['MG006','MG015','MG025','MG069']
def read(n):return json.loads((ROOT/n).read_text())
def digest(v):return hashlib.sha256(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def key(v):return ''.join(c for c in unicodedata.normalize('NFKC',v).casefold() if c.isalnum())
def validate(p,d,s,rs):
 count=0
 def require(ok,msg):
  nonlocal count
  count+=1
  if not ok:raise AssertionError(msg)
 require(p['job']=='B03' and p['status']=='UNADOPTED_RESEARCH' and p['acceptedProductBaseline']==BASELINE,'Wrong candidate state or accepted baseline')
 actual={'data':digest(d),'sources':digest(s),'reopens':[digest(x) for x in rs]}
 require(p['baselineDigests']==actual==BASE_DIGESTS,'Catalogue, source or complete A/B history changed before adoption')
 require(all(p[k] is False for k in ['acceptedProductRowsChanged','acceptedSourceRegistryChanged','acceptedQuotationHistoryChanged','fullCopyrightBodiesPublished']),'Premature adoption or full copyright publication')
 require(len(d['minigames'])==132 and len(s['sources'])==149 and sum(len(x['quotes']) for x in s['sources'])==1973,'Accepted roster or source history changed')
 for records in rs:require(len(records)==len({x['sourceId'] for x in records})==152,'Accepted complete reopen history missing')
 require(sum(e['status']=='corroborated' for r in d['minigames'] for e in r['fieldEvidence'].values())==p['currentSupportedFacts']==337 and p['currentOpenFields']==983 and p['currentWholeRowsComplete']==0 and all(not r['complete'] for r in d['minigames']),'Unadopted gain or completion falsely counted')
 by={x['id']:x for x in s['sources']};rows={x['id']:x for x in d['minigames']}
 for src in s['sources']:require(src['uniqueQuotedWords']==sum(len(x.split()) for x in {q['text'] for q in src['quotes']})<=200,'Old canonical quotation history or budget altered')
 a=p['independentAuthor'];require(a['name']=='Alex Everatt' and a['publisherLineage']=='cogconnected' and a['url']=='https://cogconnected.com/feature/our-favourite-super-mario-party-jamboree-tv-minigames/','False independent author or canonical source')
 for n,w in enumerate(a['nativePairedWitnesses'],1):require(w['pass']==n and w['name']=='Alex Everatt' and w['profileURL']=='https://cogconnected.com/author/alex-everatt/' and w['selector']=='a[rel=author]' and w['publishedDateTime']=='2025-08-02T07:00:13-07:00','Wrong actual visible author or date')
 require(len(a['nativePairedWitnesses'])==2 and by['W_LIST']['publisherLineage']=='mariowiki'!=a['publisherLineage'],'Missing author pass or duplicated lineage')
 caps=p['actualCaptures'];cap={(x['key'],x['pass']):x for x in caps}
 require(len(caps)==len(cap)==p['actualNewHttpRequests']==24 and p['actualComplete200TLSResponses']==22 and p['actualFailedNoBodyResponses']==2,'Missing, invented or duplicated actual requests')
 for c in caps:
  require(c['event']=='CLOSED' and c['attempts']==1 and datetime.fromisoformat(c['closedUTC'])>=datetime.fromisoformat(c['startedUTC']),'Unclosed or malformed native request')
  require(bool(re.fullmatch('[0-9a-f]{64}',c['actualBodySha256'])),'Actual body hash missing')
  if c['key']=='JAMES':require(c['exitCode']==56 and c['httpStatus']==0 and c['actualBodyBytes']==0,'Failed unavailable source falsely accepted')
  else:require(c['exitCode']==0 and c['httpStatus']==200 and c['tlsVerifyResult']==0 and c['actualBodyBytes']>1000 and c['effectiveURL'].startswith('https://'),'Failed, insecure or empty response accepted')
 for k in {x['key'] for x in caps}:require(datetime.fromisoformat(cap[(k,2)]['startedUTC'])>datetime.fromisoformat(cap[(k,1)]['closedUTC']),'Second pass precedes actual first closure')
 closures=p['actualCollectorClosures'];require([c['requests'] for c in closures]==[12,10,2],'Actual finite request batches changed')
 for c in closures:require(c['event']=='CLOSED' and c['allNativeChildrenNaturallyClosed'] and c['passesOrderedAfterAllNativeChildrenClose'] and c['nativeConcurrency']==2 and c['retry']==0,'Collector still running or pass order invented')
 for n,w in enumerate(p['fullAuthorScopes'],1):require(w['pass']==n and w['selector']=='.entry-content' and w['characters']==5135 and w['sha256']=='afbdb9045cb0d75b2f0b2746e70f3906fec4218222fd595afcbd7757b2a4d957','Complete authored context replaced by snippet')
 require(len(p['fullAuthorScopes'])==2,'Missing full second author context')
 require([c['id'] for c in p['gameplayCandidates']]==IDS,'Missing, duplicate or unproven named candidate')
 for c in p['gameplayCandidates']:
  r=rows[c['id']];src=by[c['primarySourceId']]
  require(c['status']=='UNADOPTED' and c['name']==r['name'] and key(c['sourceName'])==key(r['name']) and c['requiresExactBaselineRecoveryBeforeAdoption'],'Premature adoption or guessed game alias')
  require(c['currentSummary']==r['summary'] and c['currentGameplayEvidence']==r['fieldEvidence']['gameplay'] and r['fieldEvidence']['gameplay']['status']=='single_source','Current accepted row was silently rewritten or recounted')
  require(6<=len(c['authorQuote'].split())<=25 and 6<=len(c['primaryQuote'].split())<=25 and len(re.split(r'(?<=[.!?])\s+(?=[A-Z])',c['proposedTwoSentenceSummary']))==2,'Unsubstantive or overlong quote or invalid summary')
  require(len(c['primaryScopes'])==len(c['authorParagraphScopes'])==2,'Missing complete paired primary or named paragraph')
  require(c['authorParagraphScopes'][0]['sha256']==c['authorParagraphScopes'][1]['sha256'] and all(w['characters']>80 for w in c['authorParagraphScopes']),'Incomplete or divergent named author paragraph')
  for n,w in enumerate(c['primaryScopes'],1):
   require(w['pass']==n and w['canonicalSourceId']==src['id'] and w['captureKey']==c['primaryCaptureKey'] and w['actualURL']==src['url']==cap[(w['captureKey'],n)]['url'],'Wrong literal primary identity or URL')
   require(w['selector']=='#mw-content-text' and w['characters']>5000 and re.fullmatch('[0-9a-f]{64}',w['sha256']),'Primary context is a short excerpt')
   require(w['allPreviousQuoteIdsRecovered']==[q['id'] for q in src['quotes']] and w['quoteIdsNotRecovered']==[] and w['controllerImageAltLabelsRead'],'Old quotation or actual controller history lost')
  require(c['primaryScopes'][0]['sha256']==c['primaryScopes'][1]['sha256'],'Primary full contexts differ')
  require(src['uniqueQuotedWords']+len(c['primaryQuote'].split())<=200,'Prospective primary canonical-page quote ceiling exceeded')
 require(a['quotedWords']==sum(len(c['authorQuote'].split()) for c in p['gameplayCandidates'])==45<=a['sharedCanonicalURLCeiling']==200,'Shared author quotation allowance changed')
 ex={e['captureKey']:e for e in p['sourceEvaluations']}
 for k in ['JAMES','MNN','SR','WIKI_NEW1','WIKI_NEW2','W073']:require(ex[k]['status']=='EXCLUDED_FROM_ADOPTION' and len(ex[k]['reason'])>40,'Failed, incomplete, copied or disambiguation source promoted')
 require(p['physicalReceivedBodiesRehashedBeforeAndAfter'] and len(p['sourceIdentityCautions'])==3,'Physical provenance or collector identity caveat missing')
 require(digest(p)==PACKET,'Actual complete research packet was altered')
 return count
def run():
 p,d,s=read('reports/cog-gameplay-candidates.json'),read('minigames.json'),read('catalogue-sources.json');rs=[read('reports/source-reopens-pass'+n+'.json') for n in 'AB']
 count=validate(p,d,s,rs)
 for n in range(12):
  a,b,c,e=copy.deepcopy([p,d,s,rs])
  if n==0:b['minigames'][5]['fieldEvidence']['gameplay']['status']='corroborated'
  elif n==1:a['independentAuthor']['publisherLineage']='mariowiki'
  elif n==2:a['actualCaptures'][0]['tlsVerifyResult']=1
  elif n==3:a['actualCaptures'].pop()
  elif n==4:a['gameplayCandidates'][0]['authorQuote']='Short fragment'
  elif n==5:a['gameplayCandidates'][0]['sourceName']='Unproven alias'
  elif n==6:a['gameplayCandidates'][0]['primaryScopes'][1]['allPreviousQuoteIdsRecovered'].pop()
  elif n==7:a['actualCollectorClosures'][0]['event']='RUNNING'
  elif n==8:a['fullCopyrightBodiesPublished']=True
  elif n==9:a['sourceEvaluations'][1]['status']='ACCEPTED'
  elif n==10:e[1].pop()
  elif n==11:a['fullAuthorScopes'][1]['characters']=500
  try:validate(a,b,c,e)
  except (AssertionError,KeyError,ValueError):pass
  else:raise AssertionError('Malformed or prematurely promoted COG candidate accepted')
 return [{'name':'Complete independent COG original review and actual24 request provenance preserve exact accepted132-row149-source1973-quote paired history','caseCount':count,'passed':True,'seed':None},{'name':'Twelve COG candidate negatives reject promotion lineage transport missing request fragment alias lost quote unclosed collector fullbody blocked-source history and snippet defects','caseCount':12,'passed':True,'seed':None}]
if __name__=='__main__':print(json.dumps(run(),indent=2))
