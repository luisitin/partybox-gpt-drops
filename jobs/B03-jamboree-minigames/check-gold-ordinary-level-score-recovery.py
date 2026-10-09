#!/usr/bin/env python3
"""One ordinary Koopathlon scoring fact, with an exact accepted379 history view."""
from pathlib import Path
import copy, hashlib, importlib.util, json, sys
ROOT=Path(__file__).resolve().parent
BASE='0461d878be8a05e150e6aa36c2c47952cd678d90'
BASE_DIGESTS={'data': 'b403fda7b11f0932f26403b58377977262139b0c2c915eb986d9aa330a17636f', 'sources': '9fd1dd6c9f0f2c3522a4d6bea5d86912d608bb433956752e563d5d39ade68058', 'reopens': ['5e23c96d070da6cf9e22461dccd3a51fe35e0ff124b74273526c4f906ea2f20b', '23e1044a626ac84890a4da312c3945a72c1e641e224c45914353d383ae7b7914']}
CURRENT_DIGESTS={'data': 'a57d762483079ba4576ab27dad7a5ab093d31a0e1a8af4e6ff1afcaa94bab813', 'sources': '3c717d4e4c96458b5b9f0323cf9effafe17b11bac87968988febb9903ed184ad', 'reopens': ['f2694c4a3c34c78745f7c02a0f7f3fc9c509e6e7a3ecc6759461d5a21df77c06', '7e4bc83f17030f985bb7176958b2dac7cebd84b8b0e53de2afc38e5637930a7d']}
PROOF_SHA256='c5c70a2820850b5cd64892da0c292f11b918c23ddf3dc84232771da47cdb8ce0'
ADAPTER_HASHES={'check-native-gameplay-recovery.py': 'd1590eab8256467315189927d9993826c3e17c99712b419b509e3c8acb646fc8', 'check-gold-ordinary-level-score-candidate.py': '02e55dc6e721444c9daf01cae521e024eec13a20118f958dc9265fc2d2889921', 'verify.py': '39c406fc53f37f318f6188cc54fefdbdd2618a9c61997578c9d2388040f1b19b'}
sha=lambda b:hashlib.sha256(b).hexdigest()
digest=lambda x:sha(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())
read=lambda n:json.loads((ROOT/n).read_text())
def hashes(d,s,rs):return {'data':digest(d),'sources':digest(s),'reopens':[digest(x) for x in rs]}
def module(n):
 spec=importlib.util.spec_from_file_location('b03_score_'+n.replace('-','_'),ROOT/n);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
_PROOF=None
def proof():
 global _PROOF
 raw=(ROOT/'reports/gold-ordinary-level-score-recovery.json').read_bytes()
 assert sha(raw)==PROOF_SHA256,'Full scoring recovery packet differs'
 if _PROOF is None:_PROOF=json.loads(raw)
 return _PROOF
def restore(p,d,s,rs):
 assert hashes(d,s,rs)==CURRENT_DIGESTS and p['baselineDigests']==BASE_DIGESTS
 bd,bs,brs=copy.deepcopy([d,s,rs])
 i=next(i for i,r in enumerate(bd['minigames']) if r['id']=='MG081')
 assert bd['minigames'][i]==p['afterRow'];bd['minigames'][i]=copy.deepcopy(p['beforeRow'])
 for sid in ('W081','KUMA_COIN'):
  i=next(i for i,x in enumerate(bs['sources']) if x['id']==sid)
  assert bs['sources'][i]==p['afterSources'][sid];bs['sources'][i]=copy.deepcopy(p['beforeSources'][sid])
  for n,z in enumerate(brs):
   i=next(i for i,x in enumerate(z) if x['sourceId']==sid)
   assert z[i]==p['afterReopens'][n][sid];z[i]=copy.deepcopy(p['beforeReopens'][n][sid])
 assert hashes(bd,bs,brs)==BASE_DIGESTS,'Any whole accepted row, source or request history lost'
 return bd,bs,brs
_READY_SIGNATURE=None
def current_source_ready():
 global _READY_SIGNATURE
 path=ROOT/'reports/gold-ordinary-level-score-recovery.json'
 if not path.exists():return False
 p=proof();names=sorted(set(p['afterInputSha256'])|set(ADAPTER_HASHES)|{'reports/gold-ordinary-level-score-recovery.json','quote-support-check.py','reports/reward-quote-capture-audit.json'})
 signature=tuple((n,(ROOT/n).stat().st_size,(ROOT/n).stat().st_mtime_ns,(ROOT/n).stat().st_ino) for n in names)
 if signature==_READY_SIGNATURE:return True
 for n,h in p['afterInputSha256'].items():
  if sha((ROOT/n).read_bytes())!=h:return False
 for n,h in ADAPTER_HASHES.items():assert sha((ROOT/n).read_bytes())==h,'Finite historical adapter differs: '+n
 assert sha((ROOT/'quote-support-check.py').read_bytes())==p['unchangedQuoteSupportSourceSha256']
 assert sha((ROOT/'reports/reward-quote-capture-audit.json').read_bytes())==p['unchangedFullRewardAuditSha256']
 for n,t in p['beforeInputText'].items():assert sha(t.encode())==p['beforeInputSha256'][n]
 restore(p,read('minigames.json'),read('catalogue-sources.json'),[read('reports/source-reopens-pass'+n+'.json') for n in 'AB'])
 _READY_SIGNATURE=signature
 return True
def historical_view_if_latest(d,s,rs):
 if hashes(d,s,rs)!=CURRENT_DIGESTS:return d,s,rs
 assert current_source_ready(),'Current scoring source did not qualify for finite restoration'
 return restore(proof(),d,s,rs)
def historical_bytes_if_latest(n,actual):
 if not current_source_ready():return actual
 p=proof()
 if n not in p['beforeInputText']:return actual
 expected=p['afterInputSha256'].get(n,p['beforeInputSha256'][n])
 if n in ADAPTER_HASHES:expected=ADAPTER_HASHES[n]
 assert sha(actual)==expected,'Actual history-view input differs: '+n
 return p['beforeInputText'][n].encode()
def validate(p,d,s,rs,audit,helper):
 count=0
 def require(ok,msg):
  nonlocal count
  count+=1
  if not ok:raise AssertionError(msg)
 require(p['job']=='B03' and p['status']=='ONE_NARROW_KOOPATHLON_GOLD_SCORE_RECOVERY' and p['currentParentSource']==BASE,'Wrong scoring stage or exact accepted source')
 proposal=p['qualifiedRefinedProposal'];peer=p['independentSemanticPeer']
 require(sha((json.dumps(proposal,ensure_ascii=False,indent=2)+'\n').encode())==p['qualifiedRefinedProposalSha256']=='309907e43e4c3af870ba1f6ec92700a9b5640e695b62f90e4d55b6afe06e83c6','Exact refined standalone-mode proposal differs')
 require(peer['packetSHA256']==p['qualifiedRefinedProposalSha256'] and peer['peerOutcome']=='CLOSED_PASS_FOR_REFINED_SCOPED_PROPOSAL_ONLY' and peer['explicitStandaloneKoopathlonModeLimit'] is True,'Independent exact proposal review missing')
 require(peer['all20NewClipRecoveries'] is True and peer['all18ActualTableCellHashesAcrossTwoPasses'] is True and peer['completeOriginalAuthorArticlePersonallyRead'] is True and peer['bothComplete571CharacterGoldSectionsAndSixNativeLevelParagraphsChecked'] is True,'Independent complete native or primary context lost')
 require(peer['exactWholeScoreRulesReviewed']==proposal['possibleNarrowReplacement']==p['afterRow']['scoreRules'] and p['afterRow']['scoreRules'].startswith('In Koopathlon, ordinary baked pastries give '),'Mode qualifier, reviewed score sets or field differs')
 require(proposal['ordinaryLevelCoinValues']==[[1,3,5],[2,4,6],[4,5,6]] and peer['ordinaryKoopathlonScoreSetsSupported']==proposal['ordinaryLevelCoinValues'],'Ordinary level values differ')
 require(p['newProductionFields']==1 and p['currentSupportedFacts']==380 and p['acceptedSupportedFactsUntilFullCurrentQualification']==379 and p['remainingCurrentFields']==940 and p['currentCompleteRows']==0,'Broader gain or premature acceptance')
 require(p['newHTTP']==0 and p['fullCopyrightBodiesPublished'] is False and p['newNamuAuthoredWords']==0 and p['rewardWitnessRebindings']==[],'Request, quotation or reward scope changed')
 require(hashes(d,s,rs)==CURRENT_DIGESTS and p['currentDigests']==CURRENT_DIGESTS and p['baselineDigests']==BASE_DIGESTS,'Complete before or after source differs')
 require(digest(audit)==digest(p['afterAudit']) and helper==p['beforeInputText']['quote-support-check.py'] and sha(helper.encode())==p['unchangedQuoteSupportSourceSha256'],'Audit or unchanged production classifier differs')
 require(sha((ROOT/'reports/reward-quote-capture-audit.json').read_bytes())==p['unchangedFullRewardAuditSha256'],'Complete84-witness reward audit differs')
 bd,bs,brs=restore(p,d,s,rs)
 require(len(bd['minigames'])==132 and len(bs['sources'])==153 and all(len(z)==156 for z in brs),'Full original roster or request histories lost')
 require(len(p['baselineRowHashes'])==132 and len(p['baselineSourceHashes'])==153 and all(len(z)==156 for z in p['baselineReopenHashes']),'Incomplete before fingerprints')
 for r,h in zip(bd['minigames'],p['baselineRowHashes']):require(h=={'id':r['id'],'sha256':digest(r)},'Any original whole row changed')
 for x in bs['sources']:require(p['baselineSourceHashes'][x['id']]==digest(x),'Any old entire source lost')
 for z,hs in zip(brs,p['baselineReopenHashes']):
  for x,h in zip(z,hs):require(h=={'sourceId':x['sourceId'],'sha256':digest(x)},'Any complete original request history changed')
 for old,new in zip(bd['minigames'],d['minigames']):
  expected=copy.deepcopy(old)
  if old['id']=='MG081':expected['scoreRules']=p['afterRow']['scoreRules'];expected['fieldEvidence']['scoreRules']=copy.deepcopy(p['afterRow']['fieldEvidence']['scoreRules'])
  require(new==expected and new['complete'] is False,'Unrelated summary control timer win tie award confidence phone or complete flag changed')
 row=next(x for x in d['minigames'] if x['id']=='MG081');ev=row['fieldEvidence']['scoreRules']
 require(ev['status']=='corroborated' and ev['quoteIds']==p['beforeRow']['fieldEvidence']['scoreRules']['quoteIds']+[qid for sid in ('W081','KUMA_COIN') for qid in p['newClipIds'][sid]],'Original score references dropped or new references guessed')
 require('Koopathlon initial-position' in ev['limitation'] and 'Minigame Harbor' in ev['limitation'] and 'Food-name aliases' in ev['limitation'] and 'FreePlay totals' in ev['limitation'] and 'Star/double-item' in ev['limitation'] and 'board awards' in ev['limitation'],'Original mode, item, name or award exclusions lost')
 require(sum(e['status']=='corroborated' for r in d['minigames'] for e in r['fieldEvidence'].values())==380 and sum(r['fieldEvidence']['gameplay']['status']=='corroborated' for r in d['minigames'])==65,'Unrelated fact or summary gain')
 q=module('quote-support-check.py');oldclips=[z for x in bs['sources'] for z in x['quotes']]
 require(len(oldclips)==len(p['all2082BeforeClassifierBits'])==2082,'Incomplete original classifier coverage')
 for z,b in zip(oldclips,p['all2082BeforeClassifierBits']):require(b=={'id':z['id'],'substantive':q.substantive(z['text'])},'Original quote classification changed')
 require(sum(len(x['quotes']) for x in s['sources'])==2092 and sum(len(x['recoveredQuoteIds']) for z in rs for x in z)==4190,'Quote or paired recovery cardinality differs')
 for sid,new in p['afterSources'].items():
  old=p['beforeSources'][sid];clips=proposal['literalCandidateClips'][sid]
  require(new['url']==old['url'] and new['publisherLineage']==old['publisherLineage'] and new['quotes'][:len(old['quotes'])]==old['quotes'],'Canonical owner, lineage or old quote history changed')
  require([z['id'] for z in new['quotes'][len(old['quotes']):]]==p['newClipIds'][sid] and [z['text'] for z in new['quotes'][len(old['quotes']):]]==[z['text'] for z in clips],'Added score literal changed')
  require(new['uniqueQuotedWords']==sum(len(t.split()) for t in {z['text'] for z in new['quotes']})==({'W081':195,'KUMA_COIN':26}[sid])<=200,'Canonical cumulative quotation budget reset')
  for z in new['quotes']:require(0<len(z['text'].split())<=25,'Overlong old or new quotation')
  for z in clips:
   actual=[r['substantiveClassifierValue'] for r in proposal['pairedLiteralRecoveries'] if r['clipId']==z['id']]
   require(z['gameplayCredit'] is False and actual==[q.substantive(z['text'])]*2,'Original numeric/header proxy value changed')
   require(all(z['id'] not in r['fieldEvidence']['gameplay']['quoteIds'] for r in d['minigames']),'Numeric or header fragment gained gameplay binding')
  for oldpass,newpass in zip(old['passes'],new['passes']):
   aa,bb=copy.deepcopy(oldpass),copy.deepcopy(newpass);aa.pop('recoveredQuoteIds');bb.pop('recoveredQuoteIds')
   require(aa==bb and newpass['recoveredQuoteIds']==oldpass['recoveredQuoteIds']+p['newClipIds'][sid],'Actual source receipt or original quote recovery rebound')
  for n in range(2):
   aa,bb=copy.deepcopy(p['beforeReopens'][n][sid]),copy.deepcopy(p['afterReopens'][n][sid])
   require(bb['recoveredQuoteIds']==aa['recoveredQuoteIds']+p['newClipIds'][sid] and bb['quotes'][:len(aa['quotes'])]==aa['quotes'],'Original per-pass quote history lost')
   for key in ('recoveredQuoteIds','quotes'):aa.pop(key);bb.pop(key)
   require(aa==bb,'Original raw response, HTTP, TLS or request identity changed')
 before_by={x['id']:x for x in bs['sources']};after_by={x['id']:x for x in s['sources']}
 for sid in ('NAMU_TIPS','CEL_STUDIOS','MPL_PREVIEW','TG_TV'):
  if sid in before_by:require(before_by[sid]==after_by[sid],'Existing independent author quotation history changed')
 require(p['physicalCaptureQualification']['newHTTP']==0 and p['physicalCaptureQualification']['allFourFullBodiesRehashedBeforeAfter'] is True and len(p['physicalCaptureQualification']['actualCaptures'])==4,'Physical full-body qualification incomplete')
 for x,y in zip(p['physicalCaptureQualification']['actualCaptures'],proposal['pairedActualCaptureBindings']):
  require(x['sourceId']==y['sourceId'] and x['pass']==y['pass'] and x['actualBodySha256']==y['actualReceipt']['actualBodySha256'] and x['fullRegistryScopeSha256']==y['fullRegistryScopeSha256'],'Actual source qualification rebound')
 require(p['physicalCaptureQualification']['all18TableCellsRehashed'] is True and p['physicalCaptureQualification']['allSixNativeLevelParagraphsRehashed'] is True and p['physicalCaptureQualification']['all20LiteralRecoveries']==20,'Complete native table or literal scope lost')
 for n,t in p['beforeInputText'].items():require(sha(t.encode())==p['beforeInputSha256'][n],'Original byte input lost: '+n)
 require(p['acceptedCurrentWholeOfficialReceipt']['event']=='CLOSED' and p['acceptedCurrentWholeOfficialReceipt']['passed'] is True and p['acceptedCurrentWholeOfficialReceipt']['sourceCommit']==BASE and p['acceptedCurrentWholeOfficialReceipt']['casesPerFullRun']==257333,'Whole actual accepted current receipt missing')
 require(p['acceptedNativeFullReceipt']['allThreeOriginalCommandsClosedNaturally'] is True and p['acceptedNativeFullReceipt']['passed'] is True and p['acceptedNativeFullReceipt']['strictResearch']=='NOT_MET379/1320','Original full native baseline gate lost')
 for name,ad in p['historicalAdapters'].items():
  text=(ROOT/name).read_text();require(sha(text.encode())==ad['currentSourceSha256'],'Actual finite adapter changed')
  for edit in reversed(ad['finiteEdits']):require(text.count(edit['after'])==1,'Ambiguous history adapter');text=text.replace(edit['after'],edit['before'])
  require(sha(text.encode())==ad['originalSourceSha256'] and ad['allOriginalPredicatesAndNegativeBodiesByteExactAfterReversal'] is True,'Any old predicate, malformed fixture or count weakened')
 return count
def negative(p,d,s,rs,audit,helper):
 reasons=[]
 for n in range(32):
  a,b,c,z,aa,h=copy.deepcopy([p,d,s,rs,audit,helper])
  if n==0:a['qualifiedRefinedProposal']['possibleNarrowReplacement']=a['qualifiedRefinedProposal']['possibleNarrowReplacement'].replace('In Koopathlon, ','')
  elif n==1:a['qualifiedRefinedProposal']['ordinaryLevelCoinValues'][0][0]=2
  elif n==2:a['qualifiedRefinedProposal']['pairedPrimaryStructuralTables'][0]['cellBindings'][0]['columnIndex']=1
  elif n==3:a['independentSemanticPeer']['explicitStandaloneKoopathlonModeLimit']=False
  elif n==4:b['minigames'][80]['scoreRules']=b['minigames'][80]['scoreRules'].replace('In Koopathlon, ','')
  elif n==5:b['minigames'][80]['reward']['coins']=0
  elif n==6:b['minigames'][80]['controls']['invented']='new'
  elif n==7:b['minigames'][79]['summary']='Guessed extra actions. Guessed further rules.'
  elif n==8:b['minigames'][80]['fieldEvidence']['scoreRules']['quoteIds'].pop(0)
  elif n==9:a['beforeRow']['scoreRules']='invented old score'
  elif n==10:a['beforeSources']['W081']['quotes'].pop()
  elif n==11:a['afterSources']['KUMA_COIN']['publisherLineage']='mariowiki'
  elif n==12:a['afterReopens'][1]['W081']['bodySha256']='0'*64
  elif n==13:a['baselineRowHashes'].pop()
  elif n==14:a['baselineSourceHashes'].pop(next(iter(a['baselineSourceHashes'])))
  elif n==15:a['baselineReopenHashes'][1].pop()
  elif n==16:a['all2082BeforeClassifierBits'][0]['substantive']=not a['all2082BeforeClassifierBits'][0]['substantive']
  elif n==17:h+='\n# changed classifier\n'
  elif n==18:aa['rows'][80]['publishedRowSha256']='0'*64
  elif n==19:a['rewardWitnessRebindings']=[{'id':'MG081'}]
  elif n==20:a['newProductionFields']=2
  elif n==21:a['acceptedSupportedFactsUntilFullCurrentQualification']=380
  elif n==22:a['newHTTP']=4
  elif n==23:a['newNamuAuthoredWords']=1
  elif n==24:a['afterSources']['W081']['uniqueQuotedWords']=18
  elif n==25:a['qualifiedRefinedProposal']['literalCandidateClips']['KUMA_COIN'][0]['text']=a['qualifiedRefinedProposal']['literalCandidateClips']['KUMA_COIN'][0]['text'].replace('\u3000',' ')
  elif n==26:a['physicalCaptureQualification']['actualCaptures'].pop()
  elif n==27:a['physicalCaptureQualification']['all18TableCellsRehashed']=False
  elif n==28:a['beforeInputText']['minigames.csv']='lost original CSV'
  elif n==29:a['acceptedCurrentWholeOfficialReceipt']['sourceCommit']='d5bf907bee2d15d277508a3af73eac9f8c25b3ba'
  elif n==30:a['historicalAdapters']['verify.py']['allOriginalPredicatesAndNegativeBodiesByteExactAfterReversal']=False
  else:a['independentSemanticPeer']['all20NewClipRecoveries']=False
  try:validate(a,b,c,z,aa,h)
  except (AssertionError,KeyError,ValueError,TypeError,StopIteration) as e:reasons.append({'fixture':n,'actuallyRejected':True,'reason':str(e)})
  else:raise AssertionError('Malformed scoring recovery accepted: '+str(n))
 return reasons
def run():
 assert current_source_ready(),'Full current scoring source fails finite restoration'
 p=proof();d,s=read('minigames.json'),read('catalogue-sources.json');rs=[read('reports/source-reopens-pass'+n+'.json') for n in 'AB'];a=read('catalogue-second-pass.json');h=(ROOT/'quote-support-check.py').read_text()
 n=validate(p,d,s,rs,a,h);bad=negative(p,d,s,rs,a,h)
 old=module('check-gold-ordinary-level-score-candidate.py').run()
 assert old['passed'] is True and old['positiveComparisons']==126 and old['realMalformedScopeFixtures']==20 and len(old['actualRejectedFixtures'])==20
 return [{'name':'One ordinary Koopathlon Gold scoring field restores all132 accepted379 rows153 sources2082 classifications156-record A+B whole audit exact input bytes and every original predicate','caseCount':n,'passed':True,'seed':None},{'name':'Thirty-two real missing mode wrong level unrelated rule old history quote classifier reward quota full context source or gate scoring fixtures reject','caseCount':len(bad),'passed':True,'seed':None},{'name':'Original unadopted Gold candidate retains all126 comparisons and all20 real malformed scope controls on exact restored379 inputs','caseCount':146,'passed':True,'seed':None}]
if __name__=='__main__':print(json.dumps(run(),ensure_ascii=False,indent=2))
