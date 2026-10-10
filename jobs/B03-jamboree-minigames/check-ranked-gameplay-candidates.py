"""Validate actual paired ranked-guide research while preserving every accepted field."""
from pathlib import Path
from datetime import datetime
import copy,hashlib,json,re
ROOT=Path(__file__).resolve().parent
BASELINE='0230836142987c4fbb4efa745344480e90459b3a'
BASE_DIGESTS={'data': 'd3d37d21d7abbca82b5fb19b6d5ef8cbf5c90d7d7a6a2d9efce788683b0dacd3', 'sources': '72fc1246584799dc1b57c1057ea9e19fc50310597f2e2a0a12c265404e971dcb', 'reopens': ['92479418b7d3d3a0cb857040bc9ec6307316f7a972f0b92966b5e0ed750bdf85', 'd1aa5f11ac99de912b2516146cc14c764ac5f2a7fa20637936e5fc560274eb5b']}
PACKET='8ce7d5e7c43593f0a5c674f726779f254a2446bfc5249bd1f550cee9ecfbf468'
AUTHOR_WORDS=108
IDS=['MG038','MG044','MG058','MG059','MG076','MG083']
def read(n):return json.loads((ROOT/n).read_text())
def digest(v):return hashlib.sha256(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def validate(p,d,s,rs):
 count=0
 def require(ok,msg):
  nonlocal count
  count+=1
  if not ok:raise AssertionError(msg)
 require(p['job']=='B03' and p['status']=='UNADOPTED_RESEARCH' and p['acceptedProductBaseline']==BASELINE,'Wrong candidate state or genuine accepted baseline')
 actual={'data':digest(d),'sources':digest(s),'reopens':[digest(x) for x in rs]}
 require(p['baselineDigests']==actual==BASE_DIGESTS,'Accepted rows, full source/quote classifiers or complete paired history changed')
 require(all(p[k] is False for k in ['acceptedProductRowsChanged','acceptedSourceRegistryChanged','acceptedQuotationHistoryChanged','fullCopyrightBodiesPublished']),'Premature adoption or full copyright publication')
 require(len(d['minigames'])==132 and len(s['sources'])==150 and sum(len(x['quotes']) for x in s['sources'])==1982,'Accepted roster or source history cardinality changed')
 for records in rs:require(len(records)==len({x['sourceId'] for x in records})==153,'Accepted complete reopening history missing')
 require(sum(e['status']=='corroborated' for r in d['minigames'] for e in r['fieldEvidence'].values())==p['currentSupportedFacts']==341 and p['currentOpenFields']==979 and p['currentWholeRowsComplete']==0 and all(not r['complete'] for r in d['minigames']),'Unadopted gain or false whole-row completion')
 by={x['id']:x for x in s['sources']};rows={x['id']:x for x in d['minigames']}
 for src in s['sources']:require(src['uniqueQuotedWords']==sum(len(x.split()) for x in {q['text'] for q in src['quotes']})<=200,'Old canonical quote history or budget altered')
 a=p['independentAuthor'];require(a['name']=='Stacey Henley' and a['publisherLineage']=='thegamer' and a['url']=='https://www.thegamer.com/super-mario-party-jamboree-best-minigames/','False original author, publisher or canonical URL')
 require(len(a['nativePairedWitnesses'])==2 and by['W_LIST']['publisherLineage']=='mariowiki'!=a['publisherLineage'],'Duplicate lineage or missing native second author pass')
 for n,w in enumerate(a['nativePairedWitnesses'],1):require(w['pass']==n and w['name']=='Stacey Henley' and w['selector']=='.w-author-name a.article-author' and w['profileURL']=='https://www.thegamer.com/author/stacey-henley/' and w['publishedDateTime']=='2024-10-17T05:30:13Z','Related-card byline or invented actual date accepted')
 caps=p['actualCaptures'];cap={(x['key'],x['pass']):x for x in caps}
 require(len(caps)==len(cap)==p['actualNewHttpRequests']==p['actualComplete200TLSResponses']==p['actualReceivedBodyFiles']==24,'Missing, invented or duplicate actual paired requests')
 for c in caps:
  require(c['event']=='CLOSED' and c['attempts']==1 and datetime.fromisoformat(c['closedUTC'])>=datetime.fromisoformat(c['startedUTC']),'Unclosed or malformed native request')
  require(c['exitCode']==0 and c['httpStatus']==200 and c['tlsVerifyResult']==0 and c['actualBodyBytes']>1000 and c['effectiveURL'].startswith('https://') and bool(re.fullmatch('[0-9a-f]{64}',c['actualBodySha256'])),'Failed insecure empty or hashless response accepted')
 for k in {x['key'] for x in caps}:require(datetime.fromisoformat(cap[(k,2)]['startedUTC'])>datetime.fromisoformat(cap[(k,1)]['closedUTC']),'Second pass precedes natural first closure')
 require([c['requests'] for c in p['actualCollectorClosures']]==[10,14],'Finite native batch cardinality changed')
 for c in p['actualCollectorClosures']:require(c['event']=='CLOSED' and c['allNativeChildrenNaturallyClosed'] and c['passesOrderedAfterAllNativeChildrenClose'] and c['nativeConcurrency']==2 and c['retry']==0,'Unclosed collector or invented pass order')
 require(len(p['fullAuthorScopes'])==len(p['actualRankedHeadingScopes'])==2,'Missing full second author or ranked scope')
 for n,w in enumerate(p['fullAuthorScopes'],1):require(w['pass']==n and w['selector']=='.article-body' and w['characters']==6527 and w['sha256']=='f566390a1694c2a9da15157446515a62e1f41066a55b877f4caf0a1941ef4a76','Full authored scope replaced by snippet')
 for n,w in enumerate(p['actualRankedHeadingScopes'],1):require(w['pass']==n and w['headingCount']==len(w['actualNamedRankedHeadings'])==10 and w['actualNamedRankedHeadings'][0].startswith('12 ') and w['actualNamedRankedHeadings'][-1].startswith('3 '),'Partial ranked article falsely treated as complete roster')
 require([c['id'] for c in p['gameplayCandidates']]==IDS,'Missing duplicate or unproven candidate identity')
 for c in p['gameplayCandidates']:
  r=rows[c['id']];src=by[c['primarySourceId']]
  require(c['status']=='UNADOPTED' and c['name']==r['name'] and c['requiresExactBaselineRecoveryBeforeAdoption'],'Guessed identity or premature field adoption')
  require(c['currentSummary']==r['summary'] and c['currentGameplayEvidence']==r['fieldEvidence']['gameplay'] and r['fieldEvidence']['gameplay']['status']=='single_source','Accepted row or evidence was silently rewritten')
  require(6<=len(c['authorQuote'].split())<=25 and 6<=len(c['primaryQuote'].split())<=25 and len(re.split(r'(?<=[.!?])\s+(?=[A-Z])',c['proposedTwoSentenceSummary']))==2,'Overlong or fragment quote or invalid two-sentence summary')
  require(len(c['authorParagraphScopes'])==len(c['primaryScopes'])==2,'Missing full second named paragraph or primary pass')
  require(c['authorParagraphScopes'][0]['sha256']==c['authorParagraphScopes'][1]['sha256'] and all(w['characters']>150 and c['name'].casefold() in w['heading'].casefold() for w in c['authorParagraphScopes']),'Divergent or wrongly named original paragraph')
  for n,w in enumerate(c['primaryScopes'],1):
   require(w['pass']==n and w['captureKey']==w['canonicalSourceId']==src['id'] and w['actualURL']==src['url']==cap[(src['id'],n)]['url'],'Literal actual primary identity or URL differs')
   require(w['selector']=='#mw-content-text' and w['characters']>5000 and bool(re.fullmatch('[0-9a-f]{64}',w['sha256'])),'Primary scope replaced by short snippet')
   require(w['allPreviousQuoteIdsRecovered']==[q['id'] for q in src['quotes']] and w['quoteIdsNotRecovered']==[] and w['controllerImageAltLabelsRead'],'Old quote or actual controller history missing')
  require(c['primaryScopes'][0]['sha256']==c['primaryScopes'][1]['sha256'],'Actual complete primary contexts differ')
  require(src['uniqueQuotedWords']+len(c['primaryQuote'].split())<=200,'Prospective literal primary-page ceiling exceeded')
 require(a['quotedWords']==sum(len(c['authorQuote'].split()) for c in p['gameplayCandidates'])==AUTHOR_WORDS<=a['sharedCanonicalURLCeiling']==200,'Shared canonical author quote ledger changed')
 ex={x['captureKey']:x for x in p['sourceEvaluations']}
 for k in ['PLAY_TIPS','COG_BASE','COG_TV','TOMS_TV','W071']:require(ex[k]['status']=='EXCLUDED_FROM_ADOPTION' and len(ex[k]['reason'])>90 and len(ex[k]['fullReceivedScopes'])==2,'Unsupported generic unnamed repeated or changed-quote source promoted')
 require(ex['W071']['actualOldQuoteIdsNotRecovered']==['W071_q4'] and ex['W071']['productControlsAndQuotedWordsUnchanged'],'Inline controller footnote mismatch silently removed')
 require(p['physicalReceivedBodiesRehashedBeforeAndAfter'] and p['normalization']=='Whitespace and space-before-punctuation only; no footnote, word, letter or alias correction.','Physical body guard or literal normalization lost')
 require(digest(p)==PACKET,'Actual complete research packet changed')
 return count
def run():
 p,d,s=read('reports/ranked-gameplay-candidates.json'),read('minigames.json'),read('catalogue-sources.json');rs=[read('reports/source-reopens-pass'+n+'.json') for n in 'AB']
 if (ROOT/'reports/ranked-gameplay-recovery.json').exists():
  import importlib.util
  spec=importlib.util.spec_from_file_location('b03_ranked_recovery',ROOT/'check-ranked-gameplay-recovery.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);d,s,rs=m.historical_view(d,s,rs)
 count=validate(p,d,s,rs)
 for n in range(14):
  a,b,c,e=copy.deepcopy([p,d,s,rs])
  if n==0:b['minigames'][37]['fieldEvidence']['gameplay']['status']='corroborated'
  elif n==1:a['independentAuthor']['publisherLineage']='mariowiki'
  elif n==2:a['actualCaptures'][0]['tlsVerifyResult']=1
  elif n==3:a['actualCaptures'].pop()
  elif n==4:a['gameplayCandidates'][0]['authorQuote']='Short fragment'
  elif n==5:a['independentAuthor']['nativePairedWitnesses'][0]['name']='Dan Conlin'
  elif n==6:a['gameplayCandidates'][0]['primaryScopes'][1]['allPreviousQuoteIdsRecovered'].pop()
  elif n==7:a['actualCollectorClosures'][0]['event']='RUNNING'
  elif n==8:a['fullCopyrightBodiesPublished']=True
  elif n==9:a['sourceEvaluations'][-1]['status']='ACCEPTED'
  elif n==10:e[1].pop()
  elif n==11:a['fullAuthorScopes'][1]['characters']=500
  elif n==12:a['actualRankedHeadingScopes'][0]['headingCount']=132
  elif n==13:a['sourceEvaluations'][-1]['actualOldQuoteIdsNotRecovered']=[]
  try:validate(a,b,c,e)
  except (AssertionError,KeyError,ValueError):pass
  else:raise AssertionError('Malformed or prematurely promoted ranked candidate accepted')
 return [{'name':'Complete original ranked-guide context and actual24 paired native requests preserve exact accepted132-row150-source1982-classification153-record history','caseCount':count,'passed':True,'seed':None},{'name':'Fourteen ranked-candidate negatives reject premature adoption lineage insecure transport missing request fragment related-card author lost quote unclosed collector fullbody excluded-source history snippet false-roster and erased-footnote defects','caseCount':14,'passed':True,'seed':None}]
if __name__=='__main__':print(json.dumps(run(),indent=2))
