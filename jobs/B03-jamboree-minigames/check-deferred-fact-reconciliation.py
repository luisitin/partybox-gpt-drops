"""Qualify genuine replacement captures without promoting pending game facts."""
from pathlib import Path
import copy,hashlib,importlib.util,json
ROOT=Path(__file__).resolve().parent
BASE='1ad9815fb6afbbce7618e399428ceb18bf1a7833'
BASE_DIGESTS={'data': 'de1f02826533da1f4fdae55f8a14f4b90a6375ab6901ccd772f7c1b764d51a93', 'sources': '49435dac43dc89836db746c1326c60d9ea3cfc83aa70f2f4abfc4d3bcadb098c', 'reopens': ['ba3b1519bfe6cab87a610224ac2d77d660cb6fdb4f2701e3ed9dd322f638ba26', 'f06db66e541db9c6fda5b792fb1d7da141932f0954e15e6cc5de6a183d418016']}
FRESH={'W027': [{'key': 'W027', 'pass': 1, 'url': 'https://www.mariowiki.com/Platform_Peril', 'startedUTC': '2026-10-09T10:40:18.826517+00:00', 'closedUTC': '2026-10-09T10:40:19.334119+00:00', 'exitCode': 0, 'httpStatus': 200, 'effectiveURL': 'https://www.mariowiki.com/Platform_Peril', 'tlsVerifyResult': 0, 'actualBodyBytes': 85309, 'actualBodySha256': '929d8e405e186f28ff089498b845d057d6a4c0e5f8681336615223e67789e38a', 'bodyFile': '/tmp/b03-preview-arrangements-1040/W027-pass1.html', 'headersFile': '/tmp/b03-preview-arrangements-1040/W027-pass1.headers', 'stderrFile': '/tmp/b03-preview-arrangements-1040/W027-pass1.stderr', 'attempts': 1, 'event': 'CLOSED'}, {'key': 'W027', 'pass': 2, 'url': 'https://www.mariowiki.com/Platform_Peril', 'startedUTC': '2026-10-09T10:40:20.854224+00:00', 'closedUTC': '2026-10-09T10:40:21.072543+00:00', 'exitCode': 0, 'httpStatus': 200, 'effectiveURL': 'https://www.mariowiki.com/Platform_Peril', 'tlsVerifyResult': 0, 'actualBodyBytes': 85309, 'actualBodySha256': '929d8e405e186f28ff089498b845d057d6a4c0e5f8681336615223e67789e38a', 'bodyFile': '/tmp/b03-preview-arrangements-1040/W027-pass2.html', 'headersFile': '/tmp/b03-preview-arrangements-1040/W027-pass2.headers', 'stderrFile': '/tmp/b03-preview-arrangements-1040/W027-pass2.stderr', 'attempts': 1, 'event': 'CLOSED'}], 'W052': [{'key': 'W052', 'pass': 1, 'url': 'https://www.mariowiki.com/Tricky_Turntable', 'startedUTC': '2026-10-09T10:40:19.996193+00:00', 'closedUTC': '2026-10-09T10:40:20.243999+00:00', 'exitCode': 0, 'httpStatus': 200, 'effectiveURL': 'https://www.mariowiki.com/Tricky_Turntable', 'tlsVerifyResult': 0, 'actualBodyBytes': 58342, 'actualBodySha256': '60ef0d163b5f331119b4afcbcd6102560669faaa979686962845758d3251cfe2', 'bodyFile': '/tmp/b03-preview-arrangements-1040/W052-pass1.html', 'headersFile': '/tmp/b03-preview-arrangements-1040/W052-pass1.headers', 'stderrFile': '/tmp/b03-preview-arrangements-1040/W052-pass1.stderr', 'attempts': 1, 'event': 'CLOSED'}, {'key': 'W052', 'pass': 2, 'url': 'https://www.mariowiki.com/Tricky_Turntable', 'startedUTC': '2026-10-09T10:40:21.551517+00:00', 'closedUTC': '2026-10-09T10:40:21.687216+00:00', 'exitCode': 0, 'httpStatus': 200, 'effectiveURL': 'https://www.mariowiki.com/Tricky_Turntable', 'tlsVerifyResult': 0, 'actualBodyBytes': 58342, 'actualBodySha256': '60ef0d163b5f331119b4afcbcd6102560669faaa979686962845758d3251cfe2', 'bodyFile': '/tmp/b03-preview-arrangements-1040/W052-pass2.html', 'headersFile': '/tmp/b03-preview-arrangements-1040/W052-pass2.headers', 'stderrFile': '/tmp/b03-preview-arrangements-1040/W052-pass2.stderr', 'attempts': 1, 'event': 'CLOSED'}]}
AUTHOR={'url': 'https://mariopartylegacy.com/2024/09/every-minigame-in-super-mario-party-jamboree-so-far/', 'publisherLineage': 'mariopartylegacy', 'authorName': 'SuperZambezi', 'pairedCompleteAuthoredScopes': [{'pass': 1, 'actualNativeCapture': {'key': 'MPL_PREVIEW', 'pass': 1, 'url': 'https://mariopartylegacy.com/2024/09/every-minigame-in-super-mario-party-jamboree-so-far/', 'startedUTC': '2026-10-09T10:16:34.111439+00:00', 'closedUTC': '2026-10-09T10:16:36.118151+00:00', 'exitCode': 0, 'httpStatus': 200, 'effectiveURL': 'https://mariopartylegacy.com/2024/09/every-minigame-in-super-mario-party-jamboree-so-far/', 'tlsVerifyResult': 0, 'actualBodyBytes': 160430, 'actualBodySha256': '94729a0a910e9450951c8af222cbf921e8d2f1da143fd899484ec155f14233da', 'bodyFile': '/tmp/b03-category-research-1017/MPL_PREVIEW-pass1.html', 'headersFile': '/tmp/b03-category-research-1017/MPL_PREVIEW-pass1.headers', 'stderrFile': '/tmp/b03-category-research-1017/MPL_PREVIEW-pass1.stderr', 'attempts': 1, 'event': 'CLOSED'}, 'bodySha256': '94729a0a910e9450951c8af222cbf921e8d2f1da143fd899484ec155f14233da', 'bodyBytes': 160430, 'fullBodySha256': 'aa5bf8ce312101ea08ffdbd9feb043eeb1e4e4eaf5c309a943fae8fa035807b9', 'fullBodyCharacters': 3662, 'nativeAuthorSelector': '.author', 'nativeAuthorName': 'SuperZambezi', 'publicationDateTime': '2024-09-02T22:45:15-07:00', 'completeNamedGroups': {'4-Player (22)': {'characters': 369, 'sha256': 'd7ef1a6bfef3827314b6ed2f6a2b97991c083498b4bc1eacade6bb58d67915ef', 'unknownCells': 14}, '2vs2 (12)': {'characters': 190, 'sha256': 'fa32f4aba3002953bae09a3d7f5c48c312b5350184290eff37236c87c0f6df97', 'unknownCells': 3}, 'Koopathlon – Single (9)': {'characters': 151, 'sha256': '6357f19e57eb68413e0b7d6dc60bb586ac249ba6f7a4cc3ff34bd03187067cce', 'unknownCells': 8}}}, {'pass': 2, 'actualNativeCapture': {'key': 'MPL_PREVIEW', 'pass': 2, 'url': 'https://mariopartylegacy.com/2024/09/every-minigame-in-super-mario-party-jamboree-so-far/', 'startedUTC': '2026-10-09T10:16:36.121478+00:00', 'closedUTC': '2026-10-09T10:16:37.747614+00:00', 'exitCode': 0, 'httpStatus': 200, 'effectiveURL': 'https://mariopartylegacy.com/2024/09/every-minigame-in-super-mario-party-jamboree-so-far/', 'tlsVerifyResult': 0, 'actualBodyBytes': 160430, 'actualBodySha256': '221c330579f4c9e988ab2b80c63df45d520a4d55f676ba33ec4330dcc7c798cf', 'bodyFile': '/tmp/b03-category-research-1017/MPL_PREVIEW-pass2.html', 'headersFile': '/tmp/b03-category-research-1017/MPL_PREVIEW-pass2.headers', 'stderrFile': '/tmp/b03-category-research-1017/MPL_PREVIEW-pass2.stderr', 'attempts': 1, 'event': 'CLOSED'}, 'bodySha256': '221c330579f4c9e988ab2b80c63df45d520a4d55f676ba33ec4330dcc7c798cf', 'bodyBytes': 160430, 'fullBodySha256': 'aa5bf8ce312101ea08ffdbd9feb043eeb1e4e4eaf5c309a943fae8fa035807b9', 'fullBodyCharacters': 3662, 'nativeAuthorSelector': '.author', 'nativeAuthorName': 'SuperZambezi', 'publicationDateTime': '2024-09-02T22:45:15-07:00', 'completeNamedGroups': {'4-Player (22)': {'characters': 369, 'sha256': 'd7ef1a6bfef3827314b6ed2f6a2b97991c083498b4bc1eacade6bb58d67915ef', 'unknownCells': 14}, '2vs2 (12)': {'characters': 190, 'sha256': 'fa32f4aba3002953bae09a3d7f5c48c312b5350184290eff37236c87c0f6df97', 'unknownCells': 3}, 'Koopathlon – Single (9)': {'characters': 151, 'sha256': '6357f19e57eb68413e0b7d6dc60bb586ac249ba6f7a4cc3ff34bd03187067cce', 'unknownCells': 8}}}], 'preReleaseScope': True, 'committedCanonicalWords': 139, 'prospectiveCanonicalWords': 145, 'prospectiveNewCellQuotes': ['Platform Peril (Mario Party)', 'Tricky Turntable'], 'newRegisteredQuotes': [], 'unknownNamesAccepted': [], 'speculativeFivePlayerOrUnnamedModesAccepted': []}
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
 require(p['job']=='B03' and p['status']=='UNADOPTED_DEFERRED_FACT_RESEARCH' and p['acceptedSourceCommit']==BASE,'Candidate scope or genuine accepted source differs')
 require(p['baselineDigests']==BASE_DIGESTS and {'data':digest(d),'sources':digest(s),'reopens':[digest(x) for x in rs]}==BASE_DIGESTS,'Accepted full production/source/reopen history changed')
 require(p['currentCoverage']=={'supportedFacts':364,'remainingFields':956,'completeRows':0,'formatsCorroborated':39,'categoriesCorroborated':123,'gameplayCorroborated':61},'Unadopted facts counted')
 require(len(d['minigames'])==132 and len(s['sources'])==152 and all(len(x)==155 for x in rs),'Original whole roster/source/history counts differ')
 require(len(p['rowHashes'])==132 and len(p['sourceHashes'])==152 and all(len(x)==155 for x in p['reopenHashes']),'Missing complete accepted fingerprint')
 for r,h in zip(d['minigames'],p['rowHashes']):require(h=={'id':r['id'],'sha256':digest(r)},'Original entire row differs')
 for x in s['sources']:require(p['sourceHashes'][x['id']]==digest(x),'Original entire source differs')
 for i,z in enumerate(rs):
  for a,h in zip(z,p['reopenHashes'][i]):require(h=={'sourceId':a['sourceId'],'sha256':digest(a)},'Original complete history differs')
 qc=module('quote-support-check.py');classes=[{'id':q['id'],'substantive':qc.substantive(q['text'])} for x in s['sources'] for q in x['quotes']]
 require(len(classes)==len(p['quoteClassifications'])==2036,'Original quotation classifications missing')
 for a,b in zip(classes,p['quoteClassifications']):require(a==b,'Original classifier changed')
 require(p['rewardAuditSha256']==hashlib.sha256((ROOT/'reports/reward-quote-capture-audit.json').read_bytes()).hexdigest() and p['rewardWitnessRebindings']==[],'Reward audit rebound')
 by={x['id']:x for x in s['sources']};rows={x['id']:x for x in d['minigames']}
 require(p['newHttpRequestsAtQualification']==0 and p['actualPhysicalBodiesRehashedBeforeAfter']==8 and p['actualFreshPrimaryRequests']==4,'Invented body or request')
 require(p['originalAcceptedRawBodiesRecovered']==[] and p['freshBodiesSubstitutedForOldIdentity'] is False,'Missing historical raw capture invented')
 require(len(p['deferredFormats'])==2 and [x['id'] for x in p['deferredFormats']]==['MG027','MG052'],'Wrong unresolved primary subset')
 for c,sid,name,fmt,clip,cell in zip(p['deferredFormats'],['W027','W052'],['Platform Peril','Tricky Turntable'],['Four players compete individually.','Two teams of two.'],['a 4-Player coin -collecting minigame in Super Mario Party Jamboree.','Tricky Turntable is a 2-vs.-2 coin -collecting minigame found in Super Mario Party Jamboree.'],['Platform Peril (Mario Party)','Tricky Turntable']):
  require(c['name']==name and c['status']=='UNADOPTED' and c['literalFormat']==fmt and c['beforeEvidence']==rows[c['id']]['fieldEvidence']['format'],'Premature format adoption')
  require(c['primarySourceId']==sid and c['primaryUrl']==by[sid]['url'] and c['primaryIntroductionClip']==clip and len(clip.split())<=25,'Unscoped or oversized introduction')
  require(c['authorNamedCellClip']==cell and c['publisherLineages']==['mariowiki','mariopartylegacy'] and c['finalAvailabilityCorroborated'] is False,'Alias, common lineage or final availability inferred')
  require(c['oldSourcePasses']==by[sid]['passes'] and len(c['freshPasses'])==2,'Historical identity or complete fresh request missing')
  for i,w in enumerate(c['freshPasses']):
   require(w['pass']==i+1 and w['sourceId']==sid and w['actualNativeCapture']==FRESH[sid][i],'Actual response identity differs')
   cap=w['actualNativeCapture'];require(cap['event']=='CLOSED' and cap['attempts']==1 and cap['exitCode']==0 and cap['httpStatus']==200 and cap['tlsVerifyResult']==0 and cap['startedUTC']<cap['closedUTC'],'Failed or unclosed request promoted')
   require(w['rawSha256']==cap['actualBodySha256'] and w['rawBytes']==cap['actualBodyBytes'] and w['rawSha256']!=by[sid]['passes'][i]['bodySha256'],'Fresh body substituted for old raw identity')
   require(w['primaryIntroductionClipRecovered'] is True and w['completeJamboreeControlsAndInstructionsRead'] is True and w['allOriginalImagesAndModeQualifiersPreserved'] is True,'Incomplete full Jamboree scope')
   require(len(w['oldQuoteRecoveries'])==len(by[sid]['quotes']),'Original citation dropped')
   for q,z in zip(by[sid]['quotes'],w['oldQuoteRecoveries']):
    require(z['quoteId']==q['id'] and z['textSha256']==hashlib.sha256(q['text'].encode()).hexdigest() and z['literalRecovered'] is True and z['controllerImageLabels']==q.get('controllerImageLabels',[]),'Old quotation or native control label changed')
    expected='complete-paragraph-inline-link-boundaries' if q['id']=='W052Q007' else 'original-normalizer-complete-scope'
    require(z['recoveryMethod']==expected,'Changed normalizer or hidden old quote exception')
   require(w['allOriginalNormalizerBytesUnchanged'] is True,'Normalizer changed')
  require(c['rewardAuditBindings']==[] and c['prospectiveCanonicalPrimaryWords']<=200 and c['newRegistryQuotes']==[],'Reward binding, source quota or registry changed')
 require(p['preview']==AUTHOR and p['preview']['committedCanonicalWords']==139 and p['preview']['prospectiveCanonicalWords']==145 and p['preview']['preReleaseScope'] is True,'Author identity or source quota differs')
 lane=p['laneChange'];require(lane['id']=='MG084' and lane['name']=='Lane Change' and lane['status']=='UNADOPTED' and lane['beforeEvidence']==rows['MG084']['fieldEvidence']['category'],'Coin candidate adopted early')
 require(lane['literalPrimaryHeadingClip']=='Coin Minigames' and lane['independentGroupClip']=='These are single player minigames where you collect coins to move your character in the Koopathlon mode.' and lane['independentNamedCellClip']=='Lane Change','Coin assignment lacks literal independent group and known cell')
 require(lane['otherEightUnknownNamesAccepted']==[] and lane['combinedNamuFourteenAcceptedAsCoinNames']==[] and lane['preciseMechanicsAccepted']==[] and lane['requiredNextGate']=='REGISTER_LITERAL_PRIMARY_HEADING_AND_TWO_COMPLETE_PAIRED_SCOPES_THEN_FULL_ORIGINAL_ADOPTION_CHECKS','Partial Coin group or details inferred')
 require(lane['primaryCommittedCanonicalWords']==160 and lane['primaryProspectiveCanonicalWords']==162 and lane['primaryRegisteredNewQuotes']==[],'Primary quota or registry reset')
 require(len(lane['primaryPasses'])==2,'Missing full retained primary group')
 for i,x in enumerate(lane['primaryPasses']):
  old=by['W_LIST']['passes'][i];require(x['pass']==i+1 and x['bodyBytes']==old['bodyBytes'] and x['bodySha256']==old['bodySha256'] and x['originalObservedAtUTC']==old['observedAtUTC'] and x['newHttpRequests']==0,'Retained primary request identity rebound')
  require(x['nativeHeading']=='Coin Minigames [ edit ]' and x['literalLaneChangeMemberRecovered'] is True and x['completeLiteralGroupMemberCount']==9,'Primary Coin scope truncated')
 require(p['allAcceptedProductionSourceHistoryAndClassificationsUnchanged'] is True and p['fullCopyrightBodiesPublished'] is False and p['newNamuAuthoredWords']==0 and p['sharedNamuAuthoredWords']==250,'History stripped, full body published or exhausted quota changed')
 return count
def run():
 p,d,s=read('reports/deferred-format-and-coin-reconciliation.json'),read('minigames.json'),read('catalogue-sources.json');rs=[read('reports/source-reopens-pass'+n+'.json') for n in 'AB']
 if (ROOT/'reports/eleven-field-recovery.json').exists():d,s,rs=module('check-eleven-field-recovery.py').historical_view(d,s,rs)
 count=validate(p,d,s,rs)
 for n in range(20):
  a,b,c,z=copy.deepcopy([p,d,s,rs])
  if n==0:b['minigames'][26]['fieldEvidence']['format']['status']='corroborated'
  elif n==1:a['currentCoverage']['supportedFacts']=366
  elif n==2:a['deferredFormats'][0]['status']='ADOPTED'
  elif n==3:a['originalAcceptedRawBodiesRecovered']=['W027']
  elif n==4:a['freshBodiesSubstitutedForOldIdentity']=True
  elif n==5:a['deferredFormats'][1]['freshPasses'][0]['oldQuoteRecoveries'][6]['literalRecovered']=False
  elif n==6:a['deferredFormats'][1]['freshPasses'][0]['oldQuoteRecoveries'][6]['recoveryMethod']='delete-apostrophe'
  elif n==7:a['deferredFormats'][0]['freshPasses'][0]['actualNativeCapture']['event']='RUNNING'
  elif n==8:a['deferredFormats'][0]['freshPasses'][1]=copy.deepcopy(a['deferredFormats'][0]['freshPasses'][0])
  elif n==9:a['deferredFormats'][0]['finalAvailabilityCorroborated']=True
  elif n==10:a['preview']['prospectiveCanonicalWords']=201
  elif n==11:a['laneChange']['otherEightUnknownNamesAccepted']=['Noggin Knock']
  elif n==12:a['laneChange']['combinedNamuFourteenAcceptedAsCoinNames']=['Lane Change']
  elif n==13:a['laneChange']['preciseMechanicsAccepted']=['one Star']
  elif n==14:a['laneChange']['primaryPasses'][0]['bodySha256']='0'*64
  elif n==15:a['quoteClassifications'][0]['substantive']=not a['quoteClassifications'][0]['substantive']
  elif n==16:a['rewardAuditSha256']='0'*64
  elif n==17:a['newNamuAuthoredWords']=1
  elif n==18:a['deferredFormats'][1]['freshPasses'][0]['oldQuoteRecoveries'][0]['controllerImageLabels']=[]
  elif n==19:z[1][0]['sourceId']='INVENTED'
  try:validate(a,b,c,z)
  except (AssertionError,KeyError,ValueError):pass
  else:raise AssertionError('Missing historical raw, changed quotation/controller, invented mode, partial category, request or quota breach accepted')
 return [{'name':'Deferred two-format and one-Coin evidence preserves all132 current364 rows152 sources2036 classifications155-record A+B and independently reconciles complete fresh raw contexts without substituting missing historical bodies','caseCount':count,'passed':True,'seed':None},{'name':'Twenty genuine historical identity old citation controller mode partial-category quota source-history and premature-adoption malformed fixtures reject','caseCount':20,'passed':True,'seed':None}]
if __name__=='__main__':print(json.dumps(run(),indent=2))
