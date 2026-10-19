"""Bounded provenance guards for the one independently corroborated B20 row."""
from pathlib import Path
from collections import Counter
import copy, hashlib, json

ROOT = Path(__file__).resolve().parent
HISTORY = ROOT / 'reports/historical-before-buddy-tag'
TARGET = 'BUDDY_TV_TAG'
QUOTE = 'Jamboree Buddies do not appear in this game mode'
URL = 'https://nichegamer.com/reviews/super-mario-party-jamboree-nintendo-switch-2-edition-jamboree-tv-review/'
def read(path): return json.loads(path.read_text())
def validate(docs, baseline):
 n = 0
 def need(ok, why):
  nonlocal n
  n += 1
  if not ok: raise AssertionError(why)
 rules = {r['id']: r for r in docs['rules']['rules']}
 previous = {r['id']: r for r in baseline['rules']['rules']}
 need(set(rules) == set(previous) and len(rules) == 85, 'Original rule roster changed')
 need(docs['modes'] == baseline['modes'], 'An original mode, field gap or proposal changed')
 for key, row in previous.items():
  if key != TARGET: need(rules[key] == row, 'Unrelated rule changed: ' + key)
  else:
   actual = rules[key]
   need(actual['value'] == row['value'] and actual['confidence'] == row['confidence'] == 'medium', 'TV scope/confidence changed')
   need(actual['status'] == 'corroborated' and row['status'] == 'single_source', 'Incorrect targeted recovery')
   need(actual['evidence'][:-1] == row['evidence'] and actual['evidence'][-1] == {'sourceId':'NG_TV','quote':QUOTE,'locator':'Matt Kowalski review, authored Tag Team rules paragraph','quoteId':'NG_TV-Q001'}, 'Authored quote/reference changed')
 sources = {s['id']: s for s in docs['sources']['sources']}
 need(docs['sources']['sources'][:-1] == baseline['sources']['sources'], 'Original registry/editorial lineages changed')
 new = sources['NG_TV']
 need(new['url'] == URL and new['group'] == 'niche-gamer' and new['kind'] == 'hands_on_review', 'Wrong review provenance')
 need(new['quotations'] == [{'id':'NG_TV-Q001','text':QUOTE}] and len(QUOTE.split()) == 9, 'Quotation is not the nine-word actual contiguous phrase')
 need(new['group'] != sources['W_BUDDY']['group'], 'Same editorial family cannot corroborate itself')
 audit = docs['audit'];old_audit = baseline['audit']
 need(len(audit['rows']) == len(old_audit['rows']) == 309, 'Incomplete row review')
 for now, then in zip(audit['rows'], old_audit['rows']):
  if now['rowId'] == 'rule:' + TARGET:
   expected = {**then,'passA':'corroborated','passB':'corroborated','sourceIds':['W_BUDDY','NG_TV']}
   need(now == expected, 'Targeted row outcomes or confidence changed')
  else: need(now == then, 'Unrelated row decision changed')
 need(audit['ruleStatuses'] == dict(Counter(r['status'] for r in rules.values())) == {'corroborated':61,'single_source':22,'conflict':2}, 'Rule count drift')
 captures = docs['captures']
 need(set(captures) == {(p, sid) for p in ['A','B'] for sid in sources} and len(captures) == 52, 'Incomplete 26-source two-pass refresh')
 recovered = 0
 for (phase, sid), capture in captures.items():
  source = sources[sid]
  need(capture['pass'] == phase and capture['sourceId'] == sid and capture['url'] == source['url'] and capture['accessedDate'] == '2026-10-09', 'Wrong current capture identity/date')
  need(capture['quotations'] == [{**q,'recovered':True} for q in source['quotations']], 'Quotation registry/recovery drift')
  recovered += len(capture['quotations'])
 need(recovered == 460, 'Missing full quotation recovery')
 recovery = docs['recovery']
 need(recovery['changedRuleIds'] == [TARGET] and recovery['confidence'] == 'medium' and recovery['sourcesBefore'] == 25 and recovery['sourcesAfter'] == 26, 'Recovery expanded scope')
 need(recovery['registeredClipsBefore'] == 229 and recovery['registeredClipsAfter'] == 230 and recovery['actualShortQuoteRecoveries'] == 460 and recovery['fullRecheckedRowsPerPass'] == 309, 'Fresh full review counts differ')
 need(recovery['strictResearchStillNotMet'] and recovery['noGameOrPrototypeExecutionClaim'] and recovery['emptyFieldSlotsUnchanged'] == 84, 'Research/prototype overclaim')
 fingerprints = {(r['pass'],r['sourceId']):r for r in recovery['captureFingerprints']}
 need(set(fingerprints) == set(captures), 'Missing actual retrieved-page fingerprints')
 for key, capture in captures.items():
  fingerprint = fingerprints[key]
  need(fingerprint['fullRetrievedPageBodySha256'] == capture['retrievedTextSha256'] and fingerprint['fullRetrievedCharacters'] == capture['retrievedCharacters'] and fingerprint['recoveredClips'] == len(capture['quotations']), 'Actual page-body fingerprint drift')
 return n

def run_checks():
 baseline={'rules':read(HISTORY/'rules.json'),'sources':read(HISTORY/'sources.json'),'modes':read(HISTORY/'modes.json'),'audit':read(HISTORY/'reports/research-row-audit.json')}
 docs={'rules':read(ROOT/'rules.json'),'sources':read(ROOT/'sources.json'),'modes':read(ROOT/'modes.json'),'audit':read(ROOT/'reports/research-row-audit.json'),'recovery':read(ROOT/'reports/buddy-tag-recovery.json'),'captures':{(c['pass'],c['sourceId']):c for c in (read(p) for p in (ROOT/'reports/source-captures').glob('*.json'))}}
 assertions=validate(docs,baseline)
 snapshot=read(HISTORY/'snapshot.json')
 for entry in snapshot['files']:
  actual=hashlib.sha256((HISTORY/entry['path']).read_bytes()).hexdigest()
  if actual != entry['sha256']:raise AssertionError('Preserved prior bytes changed: '+entry['path'])
  assertions += 1
 invalid=[]
 d=copy.deepcopy(docs);next(r for r in d['rules']['rules'] if r['id']==TARGET)['value']='Buddies never appear in any Jamboree TV mode.';invalid.append(d)
 d=copy.deepcopy(docs);next(r for r in d['rules']['rules'] if r['id']==TARGET)['confidence']='high';invalid.append(d)
 d=copy.deepcopy(docs);next(s for s in d['sources']['sources'] if s['id']=='NG_TV')['group']='mariowiki';invalid.append(d)
 d=copy.deepcopy(docs);d['rules']['rules'][0]['note']+=' changed';invalid.append(d)
 d=copy.deepcopy(docs);d['captures'][('B','NG_TV')]['quotations'][0]['recovered']=False;invalid.append(d)
 d=copy.deepcopy(docs);del d['captures'][('B','W_GAME')];invalid.append(d)
 d=copy.deepcopy(docs);d['sources']['sources'][0]['quotations'][0]['text']+=' changed';invalid.append(d)
 d=copy.deepcopy(docs);d['modes']['modes'][0]['phoneTvSpec']['phases'][0]['timerSeconds']=61;invalid.append(d)
 d=copy.deepcopy(docs);next(s for s in d['sources']['sources'] if s['id']=='NG_TV')['url']='https://example.com/mirror';invalid.append(d)
 d=copy.deepcopy(docs);d['audit']['rows'].pop();invalid.append(d)
 for d in invalid:
  try: validate(d,baseline)
  except (AssertionError,KeyError): assertions += 1
  else:raise AssertionError('Malformed research scope fixture survived')
 return {'assertions':assertions,'rejectedScopeFixtures':len(invalid)}
if __name__ == '__main__':print(json.dumps(run_checks()))
