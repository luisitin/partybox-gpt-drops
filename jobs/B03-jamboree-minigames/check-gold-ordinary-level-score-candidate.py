"""Guard the ordinary Gold level-score research candidate; award no production credit."""
from pathlib import Path
from datetime import datetime
import copy,hashlib,importlib.util,json,re
ROOT=Path(__file__).resolve().parent
BASE='d5bf907bee2d15d277508a3af73eac9f8c25b3ba'
PACKET_SHA='de11058e66f9bbb3b2fb3868ba5d1c53b0ab73d011c6cc716df7039b4cbbfc2f'
INPUTS={'minigames.json': '504624e5e3ed937b4065af95e12ffe36efc72df9abe8fb7e8d4e7d772150659b', 'minigames.csv': '472835c38f811196ffc8f1416a4091e72abe658ba7f9404a5cb863af58d6255c', 'catalogue-sources.json': '3ac43e0889258ff9641388cc446fa97015586069738f80f345a1e188917aa8cb', 'catalogue-second-pass.json': '1de28275e9a8728f53308766360844e86f70c4e096af739c6fe018103b5f485e', 'quote-support-check.py': 'c3dff266178a0fa916fc1c662cdb644003863d830865c5ef283b6f0ae525e335', 'verify.py': '962e6620c50354698bef064548a76fa4daa3a6c53afa7851c7fc0cec1c02a3c8', 'reports/source-reopens-passA.json': '628bccf6b7315c1898b900808dadb44de6398297c854baaf8d70dfeb99611d74', 'reports/source-reopens-passB.json': '0efff4518829c0c4a9bcba96d7f2690378f574c616acb53faaa777152af3cad1', 'reports/source-reopens-summary.json': 'd759ceced2c34976a73acdf98d17b491b89490f76ae15567a05ede10d658b155', 'reports/quote-support-check.json': '8a9e448d38449f3ad21352f09f61579d025ff4d64e9f829562bd8c7d1c08a512', 'reports/research-gaps.json': '0294d2a08fa33e3675af17e045444a2d16147ad9c1276b24d787cd4b3a804bcc', 'reports/native-gameplay-recovery.json': '9d7e358fbe5689b04d436acac1eef2fee64b93ffd4d52f5253318b060218f77f'}
BITS_SHA='8e51b9840ab1b18c0bfe445ced2158e8955b3cc33c41d7a652f233ec5bdf5d2a'
sha=lambda b:hashlib.sha256(b).hexdigest()
digest=lambda x:sha(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())
read=lambda n:json.loads((ROOT/n).read_text())
def validate(p,d,s,bits):
 count=0
 def require(ok,message):
  nonlocal count
  count+=1
  if not ok:raise AssertionError(message)
 require(p['job']=='B03' and p['sourceBaseline']==BASE and p['status']=='UNADOPTED_ORDINARY_GOLD_LEVEL_SCORE_CANDIDATE','Wrong original baseline or adopted candidate')
 require(p['candidateId']=='MG081-scoreRules-ordinary-level-values' and p['candidateField']=='scoreRules' and p['candidateStatus']=='UNADOPTED','Wrong field or premature promotion')
 require(p['productionFieldsChanged']==0 and p['productionSourceRegistryChanged'] is False and p['productionClassifierChanged'] is False and p['productionFullAuditChanged'] is False and p['fullCopyrightBodiesPublished'] is False and p['newHttpRequests']==0,'Production, classifier, audit or request changed')
 require(len(d['minigames'])==132 and len(s['sources'])==153 and sum(len(x['quotes']) for x in s['sources'])==2082,'Original roster/source/quotation history lost')
 require(sum(e['status']=='corroborated' for r in d['minigames'] for e in r['fieldEvidence'].values())==379 and all(r['complete'] is False for r in d['minigames']),'Unadopted score gain or whole completion counted')
 row=next(x for x in d['minigames'] if x['id']=='MG081');require(row['scoreRules']==p['currentWholeFieldValue'] and row['fieldEvidence']['scoreRules']==p['currentWholeFieldEvidence'] and row['fieldEvidence']['scoreRules']['status']=='single_source','Whole score field silently promoted')
 require(p['currentProductionInputSha256']==INPUTS and len(bits)==2082 and digest(bits)==p['all2082CurrentClassifierBitsSha256']==BITS_SHA,'Original production inputs or classifier bits changed')
 require(digest(d['minigames'])==p['all132CurrentRowsSha256'] and digest(s)==p['complete153SourceRegistrySha256'],'Complete rows or registry changed')
 require(p['wholeFieldPromotionStillRequiresIndependentReview'] is True and len(p['scopeExclusions'])==6 and 'No exact early-removal or burned zero-coin rule promoted.' in p['scopeExclusions'],'Independent review, payout or variant exclusion removed')
 values=[[1,3,5],[2,4,6],[4,5,6]];require(p['ordinaryLevelCoinValues']==values,'Coin values or level grouping wrong')
 require(p['sourceLineages']=={'W081':'mariowiki','KUMA_COIN':'kumanote1'},'Copied publisher lineage treated as independent')
 clips=p['literalCandidateClips'];require(set(clips)=={'W081','KUMA_COIN'} and len(clips['W081'])==7 and len(clips['KUMA_COIN'])==3,'Missing or duplicated literal candidate clips')
 by={x['id']:x for x in s['sources']};clipby={z['id']:z for zs in clips.values() for z in zs}
 for sid,zs in clips.items():
  for z in zs:require(z['gameplayCredit'] is False and 0<len(z['text'].split())<=25,'Numeric/header proxy credit or overlong literal')
  old={z['text'] for z in by[sid]['quotes']};alltexts=old|{z['text'] for z in zs};budget=next(x for x in p['canonicalQuotationReservations'] if x['sourceId']==sid)
  require(budget['canonicalURL']==by[sid]['url'] and budget['existingRegisteredUniqueWords']==by[sid]['uniqueQuotedWords']==sum(len(x.split()) for x in old),'Original canonical source budget reset')
  require(budget['cumulativeRegisteredAndPublicCandidateUniqueWords']==sum(len(x.split()) for x in alltexts)<=budget['unchangedCanonicalLocalCeiling']==200 and budget['newUnregisteredCandidateWordsReserved']==sum(len(x.split()) for x in alltexts)-by[sid]['uniqueQuotedWords'] and budget['noNewSourceOrAliasBudget'] is True,'Cumulative canonical quote budget overrun or reset')
 require([x['cumulativeRegisteredAndPublicCandidateUniqueWords'] for x in p['canonicalQuotationReservations']]==[195,26],'Actual reserved quota changed')
 require(clips['W081'][0]['text']=='Level 1 Level 2 Level 3' and clips['W081'][0]['role']=='structural_level_header_only','Structural header relabeled as authored gameplay')
 for v,z in enumerate(clips['W081'][1:],1):require(z['text']=='+'+str(v)+(' coin' if v==1 else ' coins') and z['role']=='ordinary_baked_pastry_score_value_only','Exact primary numeric literal changed')
 expected=['クロワッサン１コイン　クリボー３コイン　フラワー５コイン','フランスパン２コイン　パタテンテン４コイン　スター６コイン','パタテンテン４コイン　フラワー５コイン　スター６コイン']
 for i,z in enumerate(clips['KUMA_COIN']):require(z['text']==expected[i] and z['text'].count('\u3000')==2 and len(z['explanatoryTranslation'].split())<=25,'Native level row, exact separators or explanatory translation changed')
 caps=p['pairedActualCaptureBindings'];require(len(caps)==4 and len({(x['sourceId'],x['pass']) for x in caps})==4,'Missing actual second capture')
 for sid in ('W081','KUMA_COIN'):
  cs=sorted([x for x in caps if x['sourceId']==sid],key=lambda x:x['pass']);require([x['pass'] for x in cs]==[1,2],'Missing or duplicated pass')
  for n,c in enumerate(cs):
   r=c['actualReceipt'];old=by[sid]['passes'][n]
   require(r['event']=='CLOSED' and r['exitCode']==0 and r['httpStatus']==200 and r['tlsVerifyResult']==0 and r['attempts']==1 and c['reusedExistingGenuineCapture'] is True and c['newHttpRequests']==0,'Failed or invented request promoted')
   require(r['url']==r['effectiveURL']==by[sid]['url'] and r['actualBodySha256']==old['bodySha256'] and r['actualBodyBytes']==old['bodyBytes'],'Actual raw body identity replaced')
   require(c['fullRegistryScopeSha256']==old['fullArticleScopeSha256'] and c['fullRegistryScopeCharacters']==old['textCharacters'] and c['fullRegistryScopeSelector']==('#mw-content-text' if sid=='W081' else '.entry-content'),'Complete original registry scope replaced with snippet')
  require(datetime.fromisoformat(cs[1]['actualReceipt']['startedUTC'])>datetime.fromisoformat(cs[0]['actualReceipt']['closedUTC']),'Second capture precedes first actual closure')
 tables=p['pairedPrimaryStructuralTables'];authors=p['pairedFullNativeAuthorSections'];require(len(tables)==len(authors)==2,'Missing complete original paired contexts')
 for n,t in enumerate(tables,1):
  require(t['pass']==n and t['headerColumns']==['Level 1','Level 2','Level 3'] and t['headerClipId']=='W081_SCORE_header' and t['ordinaryLevelCoinValues']==values,'Wrong structural level headers or flattened row-major grouping')
  require(t['declaredLiteralJapaneseName']=='できたて！パン屋さん！' and t['adjacentStarExceptionPreserved'] is True and t['earlyAndBurnConsequencesExcludedFromCandidate'] is True,'Guessed name alias or item/payout scope lost')
  cells=t['cellBindings'];require(len(cells)==9 and {(x['rowIndex'],x['columnIndex']) for x in cells}=={(r,c) for r in range(3) for c in range(3)},'Missing table cell or duplicate position')
  for c in cells:require(c['level']==c['columnIndex']+1 and c['coinValue']==values[c['columnIndex']][c['rowIndex']] and c['literalClipId']=='W081_SCORE_coin_'+str(c['coinValue']) and re.fullmatch('[0-9a-f]{64}',c['completeCellTextSha256']) and c['completeCellTextCharacters']>10,'Wrong original table column/value/literal binding')
  require(t['completeTableTextCharacters']>100 and re.fullmatch('[0-9a-f]{64}',t['completeTableTextSha256']),'Incomplete original table context')
 require(tables[0]['completeTableTextSha256']==tables[1]['completeTableTextSha256'],'Paired structural table changed')
 for n,a in enumerate(authors,1):
  require(a['pass']==n and a['authorName']=='ダン・熊野' and a['authorProfileURL']=='https://kumanote1.com/author/kumanote/' and a['exactNativeHeading']=='できたて！パン屋さん！' and a['nextNativeHeading']=='砂のガボンいせき','Wrong independent author or complete native heading boundary')
  require(a['completeNamedSectionCharacters']>300 and re.fullmatch('[0-9a-f]{64}',a['completeNamedSectionSha256']) and a['koopathlonInitialPositionAndHarborCaveatPreserved'] is True and a['copiedWikiInstructionIndependenceClaimed'] is False,'Incomplete context, modeless claim or copying counted as independence')
  require(len(a['levelRows'])==3,'Missing complete authored level rows')
  for i,z in enumerate(a['levelRows'],1):require(z['level']==i and z['exactNativeLevelLabel']=='レベル'+str(i).translate(str.maketrans('123','１２３')) and z['ordinaryCoinValues']==values[i-1] and z['literalClipId']=='KUMA_SCORE_level_'+str(i) and z['exactU3000SeparatorsPreserved'] is True,'Wrong exact author level label, native numeric row or normalization')
 require(authors[0]['completeNamedSectionSha256']==authors[1]['completeNamedSectionSha256'],'Paired full authored named section differs')
 rec=p['pairedLiteralRecoveries'];require(len(rec)==20 and len({(x['sourceId'],x['pass'],x['clipId']) for x in rec})==20,'Missing paired literal recovery')
 for x in rec:require(x['literalRecovered'] is True and x['gameplayCredit'] is False and x['clipId'] in clipby,'Literal missing or gameplay credit invented')
 for sid,zs in clips.items():
  for z in zs:require({x['pass'] for x in rec if x['sourceId']==sid and x['clipId']==z['id']}=={1,2},'Selected quote lacks genuine second recovery')
 return count
def run():
 raw=(ROOT/'reports/gold-ordinary-level-score-candidate.json').read_bytes();require_sha=sha(raw)==PACKET_SHA
 if not require_sha:raise AssertionError('Complete original candidate packet changed')
 p=json.loads(raw);d,s=read('minigames.json'),read('catalogue-sources.json')
 for name,want in INPUTS.items():
  if sha((ROOT/name).read_bytes())!=want:raise AssertionError('Production input changed: '+name)
 spec=importlib.util.spec_from_file_location('b03_unchanged_gold_score_quote_support',ROOT/'quote-support-check.py');q=importlib.util.module_from_spec(spec);spec.loader.exec_module(q)
 bits=[{'id':z['id'],'substantive':q.substantive(z['text'])} for x in s['sources'] for z in x['quotes']]
 count=validate(p,d,s,bits)
 fixtures=[]
 for n in range(20):
  a,b,c,e=copy.deepcopy([p,d,s,bits])
  if n==0:a['candidateStatus']='ADOPTED'
  elif n==1:a['productionFieldsChanged']=1
  elif n==2:a['sourceLineages']['KUMA_COIN']='mariowiki'
  elif n==3:a['ordinaryLevelCoinValues'][0][0]=2
  elif n==4:a['pairedPrimaryStructuralTables'][0]['cellBindings'][0]['columnIndex']=1
  elif n==5:a['pairedPrimaryStructuralTables'][1]['headerColumns'][0]='Level 3'
  elif n==6:a['pairedPrimaryStructuralTables'][0]['adjacentStarExceptionPreserved']=False
  elif n==7:a['pairedFullNativeAuthorSections'][0]['koopathlonInitialPositionAndHarborCaveatPreserved']=False
  elif n==8:a['pairedFullNativeAuthorSections'][1]['exactNativeHeading']='パン屋さん'
  elif n==9:a['pairedActualCaptureBindings'][0]['actualReceipt']['tlsVerifyResult']=1
  elif n==10:a['pairedActualCaptureBindings'].pop()
  elif n==11:a['literalCandidateClips']['W081'][0]['gameplayCredit']=True
  elif n==12:a['literalCandidateClips']['KUMA_COIN'][0]['text']=a['literalCandidateClips']['KUMA_COIN'][0]['text'].replace('\u3000',' ')
  elif n==13:a['canonicalQuotationReservations'][0]['existingRegisteredUniqueWords']=0
  elif n==14:a['canonicalQuotationReservations'][0]['unchangedCanonicalLocalCeiling']=250
  elif n==15:a['pairedLiteralRecoveries'][0]['literalRecovered']=False
  elif n==16:next(x for x in b['minigames'] if x['id']=='MG081')['fieldEvidence']['scoreRules']['status']='corroborated'
  elif n==17:e[0]['substantive']=not e[0]['substantive']
  elif n==18:a['pairedFullNativeAuthorSections'][0]['levelRows'][0]['ordinaryCoinValues']=[1,2,4]
  else:a['scopeExclusions'].remove('No exact early-removal or burned zero-coin rule promoted.')
  try:validate(a,b,c,e)
  except (AssertionError,KeyError,ValueError,StopIteration) as ex:fixtures.append({'fixture':n,'actuallyRejected':True,'reason':str(ex)})
  else:raise AssertionError('Malformed original scope fixture accepted: '+str(n))
 return {'job':'B03','passed':True,'positiveComparisons':count,'realMalformedScopeFixtures':len(fixtures),'actualRejectedFixtures':fixtures,'all2082CurrentClassifierBitsUnchanged':True,'all132CurrentRowsAnd153SourcesUnchanged':True,'candidateOnlyNoProductionCredit':True,'packetSha256':PACKET_SHA,'canonicalCandidateBudgets':p['canonicalQuotationReservations']}
if __name__=='__main__':print(json.dumps(run(),ensure_ascii=False,indent=2))
