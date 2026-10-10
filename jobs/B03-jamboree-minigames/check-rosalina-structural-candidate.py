"""Prove a narrow unadopted Rosalina action candidate and exact footnote preservation."""
from pathlib import Path
from datetime import datetime
from html.parser import HTMLParser
import copy, hashlib, importlib.util, json, re
ROOT=Path(__file__).resolve().parent
BASELINE='3cf55e863a4e951af90a692f6e917c4e38a72418'
BASE_DIGESTS={"data":"45f1a3138d5a1a191638d952afe386f918112c5710adc90cfd8756cd82ca8950","sources":"b6dd7fe57924b7d54111b6ae6d3a421963c16f9096bf9ce68ea22cd9c5a9b3dd","reopens":["c8f0d4a7bc8b5bab19b4f934a9f0ee0b04be3496c6b2374b1e13b98aca6ec945","6b16c40e281738feb92585ffc4c745d1ae265fd1806efc0adde385d8334d5cbb"]}
AUTHOR_QUOTES=['Rosalina has a snowboard race','You can get speed boosts and trick off ramps']
PRIMARY_QUOTE='on ramps, shaking the controller as the player ascends the ramps makes them perform a trick, granting a greater speed boost.'
SUMMARY='Players race on snowboards. They can perform tricks from ramps to gain speed boosts.'
SCOPE='Only the common snowboard-race and ramp-trick speed-boost actions; precise controls, timers, advantage items, win, score, tie, payout and whole-row status remain unadopted.'
def read(n): return json.loads((ROOT/n).read_text())
def digest(v): return hashlib.sha256(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def norm(s): return re.sub(r'\s+([,.;:!?])',r'\1',' '.join(s.split()))
class ControlParser(HTMLParser):
 def __init__(self,skip_reference=False):
  super().__init__();self.skip_reference=skip_reference;self.skip=0;self.parts=[];self.images=[];self.markers=0;self.links=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='sup' and a.get('id')=='cite_ref-1' and 'reference' in a.get('class','').split():
   self.markers+=1
   if self.skip_reference:self.skip=1;return
  if self.skip:
   self.skip+=1
   if tag=='a':self.links.append(a.get('href'))
   return
  if tag=='img':self.images.append({k:a.get(k,'') for k in ['alt','title','src']})
 def handle_startendtag(self,tag,attrs):
  if tag=='img' and not self.skip:self.images.append({k:dict(attrs).get(k,'') for k in ['alt','title','src']})
 def handle_endtag(self,tag):
  if self.skip:self.skip-=1
 def handle_data(self,data):
  if not self.skip:self.parts.append(data)
def parsed(markup,skip=False):
 p=ControlParser(skip);p.feed(markup);p.close();assert p.skip==0,'Unclosed structural reference';return p
def validate(p,d,s,rs):
 count=0
 def require(ok,msg):
  nonlocal count
  count+=1
  if not ok:raise AssertionError(msg)
 require(p['job']=='B03' and p['status']=='UNADOPTED_RESEARCH' and p['acceptedProductBaseline']==BASELINE,'Candidate or accepted source differs')
 actual={'data':digest(d),'sources':digest(s),'reopens':[digest(x) for x in rs]}
 require(p['baselineDigests']==actual==BASE_DIGESTS,'Accepted complete product or source/history changed')
 require(p['allAcceptedRowsSourcesAndPairedHistoryUnchanged'] is True and p['fullCopyrightBodiesPublished'] is False,'Premature product change or full article publication')
 require(len(d['minigames'])==132 and len(s['sources'])==151 and sum(len(x['quotes']) for x in s['sources'])==1992 and all(len(x)==154 for x in rs),'Accepted old rows/sources/clips/reopen cardinalities changed')
 require(sum(e['status']=='corroborated' for r in d['minigames'] for e in r['fieldEvidence'].values())==p['currentSupportedFacts']==347 and p['currentOpenFields']==973 and p['currentWholeRowsComplete']==0 and all(not r['complete'] for r in d['minigames']),'Unadopted candidate improperly counted')
 by={x['id']:x for x in s['sources']};w=by['W071'];a=by['RANKED_REVIEW'];row=next(x for x in d['minigames'] if x['id']=='MG071')
 require(p['id']==row['id'] and p['name']==row['name'] and row['fieldEvidence']['gameplay']['status']=='single_source','Wrong row or premature gameplay adoption')
 require(p['primarySourceId']=='W071' and p['primaryPublisherLineage']==w['publisherLineage']=='mariowiki' and p['independentSourceId']=='RANKED_REVIEW' and p['independentPublisherLineage']==a['publisherLineage']=='valnet','Publisher-brand independence invented')
 require(p['canonicalAuthorURL']==a['url']=='https://www.thegamer.com/super-mario-party-jamboree-best-minigames/','Wrong canonical author source')
 require(p['authorQuotes']==AUTHOR_QUOTES and p['primaryQuote']==PRIMARY_QUOTE and p['proposedTwoSentenceSummary']==SUMMARY and p['scope']==SCOPE,'Unverified or broadened action wording')
 require(all(len(q.split())<=25 for q in p['authorQuotes']+[p['primaryQuote']]),'Per-clip quote limit exceeded')
 require(p['newCumulativeAuthorQuotationWords']==sum(len(q.split()) for q in set(AUTHOR_QUOTES))==14 and p['previousCumulativeAuthorQuotationWords']==a['uniqueQuotedWords']==108 and p['currentCommittedAndReservedAuthorWords']==122<=p['sharedCanonicalAuthorWordCeiling']==200,'Cumulative quotation budget misstated')
 require(p['newHttpRequests']==0 and p['actualAlreadyReceivedPairedBodiesRehashed']==4 and p['previousMissingLiteralQuoteAndHistoricalExclusionRetained'] is True,'Source request invented or real old literal failure erased')
 caps={(x['key'],x['pass']):x for x in p['actualCaptures']}
 require(len(p['actualCaptures'])==len(caps)==4,'Paired native source body lost or duplicated')
 for c in caps.values():
  require(c['event']=='CLOSED' and c['attempts']==1 and c['exitCode']==0 and c['httpStatus']==200 and c['tlsVerifyResult']==0 and c['actualBodyBytes']>60000 and bool(re.fullmatch('[0-9a-f]{64}',c['actualBodySha256'])),'Failed insecure unclosed empty or unhashed source')
  require(datetime.fromisoformat(c['closedUTC'])>=datetime.fromisoformat(c['startedUTC']),'Invalid native source closure order')
 for key in ['W071','THEGAMER']:require(datetime.fromisoformat(caps[(key,2)]['startedUTC'])>datetime.fromisoformat(caps[(key,1)]['closedUTC']),'Second paired source precedes first closure')
 require(p['nativeSourceCollectorsNaturallyClosedUTC']==['2026-10-09T07:22:03.849610+00:00','2026-10-09T07:23:32.897997+00:00'],'Genuine source collector closure changed')
 require(len(p['pairedPrimaryScopes'])==len(p['pairedAuthorScopes'])==2,'Missing full primary/author scope')
 oldq4=next(q for q in w['quotes'] if q['id']=='W071_q4');oldnote=next(q for q in w['quotes'] if q['id']=='W071_q6')
 for n,z in enumerate(p['pairedPrimaryScopes'],1):
  require(z['pass']==n and z['rawBodySha256']==caps[('W071',n)]['actualBodySha256'],'Primary context does not bind native bytes')
  require(z['actualLiteralMissingOldQuoteIds']==['W071_q4'] and z['structuralRecoveredOldQuoteIds']==[q['id'] for q in w['quotes']],'Original literal failure erased or old quote dropped')
  require(z['oldControlWordsChanged'] is False and z['footnoteRetainedInCompleteStructuralScope'] is True and z['newPrimaryQuoteRecovered']==PRIMARY_QUOTE,'Control word or complete note changed')
  raw=parsed(z['controlMarkup']);clean=parsed(z['controlMarkup'],True);note=parsed(z['retainedFootnoteMarkup'])
  require(raw.markers==clean.markers==1 and clean.links==['#cite_note-1'],'Only the genuine exact linked reference may be omitted')
  require(norm(' '.join(raw.parts))=='Shake / [ a ] – Jump Boost' and norm(' '.join(clean.parts))==oldq4['text'],'Reconciliation changed non-reference words or suppressed real missing marker')
  require(raw.images==clean.images==z['controllerImageLabels']==oldq4['controllerImageLabels'],'Controller image labels or symbols changed')
  require(norm(' '.join(note.parts))==oldnote['text'] and 'id="cite_note-1"' in z['retainedFootnoteMarkup'],'Original footnote and method qualifier must remain literal')
  require(z['referenceMarkerMarkup'] in z['controlMarkup'] and '<sup class="reference" id="cite_ref-1"' in z['referenceMarkerMarkup'] and 'href="#cite_note-1"' in z['referenceMarkerMarkup'],'Reference DOM identity changed')
  require(z['rawFullScopeCharacters']>9000 and z['structuralFullScopeCharacters']>9000 and z['rawFullScopeCharacters']>z['structuralFullScopeCharacters'] and z['rawFullScopeSha256']!=z['structuralFullScopeSha256'] and all(re.fullmatch('[0-9a-f]{64}',z[k]) for k in ['rawFullScopeSha256','structuralFullScopeSha256']),'Incomplete or indistinguishable source views')
 for n,z in enumerate(p['pairedAuthorScopes'],1):
  require(z['pass']==n and z['name']=='Stacey Henley' and z['selector']=='.w-author-name a.article-author' and z['profileURL']=='https://www.thegamer.com/author/stacey-henley/' and z['publishedDateTime']=='2024-10-17T05:30:13Z','Related-card byline or invented actual author accepted')
  require(z['fullScopeCharacters']>6500 and z['completeNamedParagraphCharacters']>650 and z['heading']=="7 Best Showdown: Rosalina's Radical Race" and z['newLiteralAuthorQuotesRecovered']==AUTHOR_QUOTES and z['oldRegisteredAuthorQuotesRecovered']==[q['id'] for q in a['quotes']],'Partial, unrelated or lost old author context')
 for key in ['rawFullScopeSha256','structuralFullScopeSha256']:require(p['pairedPrimaryScopes'][0][key]==p['pairedPrimaryScopes'][1][key],'Paired complete primary scope differs')
 for key in ['fullScopeSha256','completeNamedParagraphSha256']:require(p['pairedAuthorScopes'][0][key]==p['pairedAuthorScopes'][1][key],'Paired complete author scope differs')
 qc_spec=importlib.util.spec_from_file_location('rosalina_qc',ROOT/'quote-support-check.py');qc=importlib.util.module_from_spec(qc_spec);qc_spec.loader.exec_module(qc)
 require(p['baselineQuoteClassificationsSha256']==digest([{'id':q['id'],'substantive':qc.substantive(q['text'])} for x in s['sources'] for q in x['quotes']]),'Any accepted quote classification changed')
 return count
def run():
 p=read('reports/rosalina-structural-candidate.json');d=read('minigames.json');s=read('catalogue-sources.json');rs=[read('reports/source-reopens-pass'+x+'.json') for x in ['A','B']]
 if (ROOT/'reports/rosalina-gameplay-recovery.json').exists():
  spec=importlib.util.spec_from_file_location('b03_rosalina_recovery',ROOT/'check-rosalina-gameplay-recovery.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);d,s,rs=m.historical_view(d,s,rs)
 count=validate(p,d,s,rs)
 for n in range(16):
  a,b,c,e=copy.deepcopy([p,d,s,rs]);z=a['pairedPrimaryScopes'][0]
  if n==0:a['status']='ADOPTED'
  elif n==1:a['currentSupportedFacts']=348
  elif n==2:z['controlMarkup']=z['controlMarkup'].replace('Shake','Press')
  elif n==3:z['controlMarkup']=z['controlMarkup'].replace('class="reference"','class="ordinary"')
  elif n==4:z['controlMarkup']=z['controlMarkup'].replace('#cite_note-1','#unrelated')
  elif n==5:z['retainedFootnoteMarkup']=z['retainedFootnoteMarkup'].replace('does not','does')
  elif n==6:z['controllerImageLabels'][0]['alt']='A Button'
  elif n==7:z['actualLiteralMissingOldQuoteIds']=[]
  elif n==8:z['structuralRecoveredOldQuoteIds'].pop()
  elif n==9:a['independentPublisherLineage']='mariowiki'
  elif n==10:a['pairedAuthorScopes'][0]['name']='Dan Conlin'
  elif n==11:a['newCumulativeAuthorQuotationWords']=16
  elif n==12:a['actualCaptures'][0]['tlsVerifyResult']=1
  elif n==13:a['actualCaptures'].pop()
  elif n==14:a['proposedTwoSentenceSummary']='Players race on snowboards. The first player wins Rosalina.'
  elif n==15:e[0].pop()
  try:validate(a,b,c,e)
  except (AssertionError,KeyError,ValueError):pass
  else:raise AssertionError('Malformed structural or premature-adoption candidate accepted')
 return [{'name':'Unadopted Rosalina paired complete source and exact linked-reference reconciliation preserve original note controls and entire accepted347-field151-source1992-classification154-record history','caseCount':count,'passed':True,'seed':None},{'name':'Sixteen genuine structural DOM source-lineage quota native-context and premature-adoption negatives reject','caseCount':16,'passed':True,'seed':None}]
if __name__=='__main__':print(json.dumps(run(),indent=2))
