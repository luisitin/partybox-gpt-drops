"""Four bounded shared gameplay repairs with exact historical restoration."""
from pathlib import Path
from datetime import datetime
import copy, hashlib, importlib.util, json

ROOT = Path(__file__).resolve().parent
BASELINE = '9e43a19e256538d57b8334ffdafd5d656804c712'
BASE_DATA = 'dff256225fedebc602e2ab9d7c486e3c187344b7643814dfb7126f3b9adca194'
BASE_SOURCES = '259e9e12a296621d29e9a8b4b5908cd76fdea8b79bc24963bb4bc6f0b76875f7'
BASE_REOPENS = ['14b6ccce67def7f45da3540c3975bd9eabd6692f0c22e1d473521cf43d5ecdd1', '2f5f6ed7d6ab8aab7fbff3076763fec6186f9d7c147f1ba704f9cd60be379258']
URL = 'https://familygamesquad.com/super-mario-party-jamboree-tips-and-tricks/'
CONFIG = {
 'MG007': ('Hot Cross Blocks', "Players choose routes to cross the course. They try to avoid matching other players' choices.", 'to all get across by selecting different paths and calling out what path they chose so someone else doesn’t chose it also.', [], 'd5839a1bb4d8e6d8acba2e1a53340eb5ce5980d6a6fbd6c4810a1bdc05e8519b'),
 'MG039': ('Blame It on the Crane', 'Team players move around a circular area. They move past the crane while avoiding capture.', 'stay in the inner ring and move slowly until you get to the crane then speed past and repeat to survive', ['The balls and characters are on a large circular platform that spins counterclockwise.', 'controls a large crane that must be used to capture the team players as they pass.'], '50b59ea2c0a7f651ef08209e033b9b451a5256039328d47317cef45c2ef7c362'),
 'MG098': ('Match! That! Item!', 'Players time their button presses to choose an item. They aim for the required item.', 'So you can press it then and spam the button to get the right item you need.', [], '6bca996ea8064f8ba8dc0185d013e0309e7524ca25bcc5f9b5c85d6866e445e8'),
 'MG107': ('Short-Stack Chef', 'Players flip pancakes. They try to time their flips correctly.', 'Wait for it to disappear completely before flipping it to get a “Nice”.', ['by getting a perfectly timed "Nice!" rating, they get two points.'], '3ed884781fd4c2e79972f6a1b41220599cbf8106e1d1268b9b6016309f8cb594')
}
def read(name): return json.loads((ROOT / name).read_text())
def digest(value): return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
def module(name):
 spec = importlib.util.spec_from_file_location(name.replace('-', '_'), ROOT / name)
 value = importlib.util.module_from_spec(spec); spec.loader.exec_module(value); return value

def validate(proof, data, sources, reopens):
 count = 0
 def require(ok, message):
  nonlocal count
  count += 1
  if not ok: raise AssertionError(message)
 require(proof['baselineSourceCommit'] == BASELINE and proof['copyrightBodiesPublished'] is False, 'Wrong accepted baseline or published full bodies')
 require(proof['scope'] == 'Exactly four literal shared-action summaries; no detailed mechanic, category, reward or roster promotion.', 'Wrong repair scope')
 require(proof['newHttpRequestsForAdoption'] == 0 and proof['retainedActualRequestCount'] == 14, 'Invented fresh request')
 candidate = read('reports/family-tips-candidate.json')
 require(proof['retainedCaptures'] == candidate['captures'], 'Accepted actual source packet changed')
 captures = {(c['sourceId'], c['pass']): c for c in proof['retainedCaptures']}
 require(len(captures) == 14 and len(proof['retainedCaptures']) == 14, 'Duplicate or absent actual capture')
 for ident in ['FGS_TIPS', 'W002', 'W007', 'W039', 'W098', 'W107', 'W108']:
  a, b = captures[(ident, 1)], captures[(ident, 2)]
  require(datetime.fromisoformat(b['startedUTC']) > datetime.fromisoformat(a['completedUTC']), 'B preceded closed A')
  for c in [a, b]:
   require(c['curlExitCode'] == 0 and c['httpEffectiveTls'][0] == '200' and c['httpEffectiveTls'][2] == '0' and c['tlsVerificationDisabled'] is False, 'Unverified native source response')
   require(c['bodyBytes'] > 0 and len(c['bodySha256']) == len(c['textSha256']) == 64, 'Missing actual complete body')
 require(len(proof['repairs']) == 4 and [r['id'] for r in proof['repairs']] == list(CONFIG), 'Unreviewed or duplicate repair')
 sb = {s['id']: s for s in sources['sources']}; rows = {r['id']: r for r in data['minigames']}
 require(len(sb) == len(sources['sources']) == 147, 'Wrong current source set')
 tip = sb['FGS_TIPS']
 require(tip['url'] == URL and tip['publisherLineage'] == 'familygamesquad' and tip['kind'] == 'independent_strategy_guide' and tip['title'] == candidate['source']['title'], 'False publisher, article or authorship kind')
 require(proof['author'] == candidate['source']['author'] == 'Gaming Chickadee', 'False author')
 require(tip['uniqueQuotedWords'] == sum(len(text.split()) for text in {q['text'] for q in tip['quotes']}) == 73, 'Tips quotation budget changed')
 require([q['id'] for q in tip['quotes']] == ['FGS_TIPS_common_' + ident for ident in CONFIG], 'Unreviewed tips quotation')
 restored = copy.deepcopy(data)
 for repair in proof['repairs']:
  ident = repair['id']; name, summary, text, added, scope = CONFIG[ident]; row = rows[ident]; wid = 'W' + ident[2:]
  require(row['name'] == repair['name'] == name and row['summary'] == repair['summary'] == summary, 'Narrow action wording changed')
  require(repair['beforeGameplayEvidence']['status'] == 'single_source' and row['fieldEvidence']['gameplay']['status'] == 'corroborated', 'Unexpected status promotion')
  require(repair['authoredFullContextSha256Passes'] == [scope, scope], 'Wrong full named-game author context')
  qid = 'FGS_TIPS_common_' + ident; q = next(q for q in tip['quotes'] if q['id'] == qid)
  require(q['text'] == repair['authoredQuote'] == text and 6 <= len(text.split()) <= 25, 'Wrong bounded original quote')
  new_ids = [wid + '_tips_' + str(i + 1) for i in range(len(added))]
  extra = ['W098_q1'] if ident == 'MG098' else []
  require(row['fieldEvidence']['gameplay']['quoteIds'] == repair['beforeGameplayEvidence']['quoteIds'] + new_ids + extra + [qid], 'Existing citation lost or unrelated witness added')
  for i, literal in enumerate(added, 1):
   quote = next(q for q in sb[wid]['quotes'] if q['id'] == wid + '_tips_' + str(i))
   require(quote['text'] == literal and 6 <= len(literal.split()) <= 25, 'Missing literal full Wiki action')
  if ident == 'MG098':
   control = next(q for q in sb[wid]['quotes'] if q['id'] == 'W098_q1')
   require(control['text'] == '– Stop spinning' and [x['alt'] for x in control['controllerImageLabels']] == ['Single Joy-Con Right Button'], 'Broad button action lacks preserved actual source notation')
  old = next(r for r in restored['minigames'] if r['id'] == ident)
  old['summary'] = repair['beforeSummary']; old['fieldEvidence']['gameplay'] = copy.deepcopy(repair['beforeGameplayEvidence'])
 require(digest(restored) == proof['baselineDataSha256'] == BASE_DATA, 'Any unrelated original row value/evidence changed')
 require(len(proof['baselineRowHashes']) == len(restored['minigames']) == 132, 'Wrong preserved row scope')
 for r, expected in zip(restored['minigames'], proof['baselineRowHashes']): require(expected == {'id': r['id'], 'sha256': digest(r)}, 'Exact original row fingerprint changed')
 affected = {'W' + ident[2:] for ident in CONFIG}
 require(set(proof['beforeSources']) == affected, 'Wrong historical source scope')
 historical = copy.deepcopy(sources)
 historical['sources'] = [copy.deepcopy(proof['beforeSources'].get(s['id'], s)) for s in historical['sources'] if s['id'] != 'FGS_TIPS']
 require(digest(historical) == proof['baselineSourcesSha256'] == BASE_SOURCES, 'Any original source/quote/pass changed')
 require(set(proof['baselineSourceHashes']) == {s['id'] for s in historical['sources']}, 'Wrong146-source fingerprint scope')
 for s in historical['sources']: require(proof['baselineSourceHashes'][s['id']] == digest(s), 'Original source fingerprint changed')
 for ident in affected:
  current, old = sb[ident], proof['beforeSources'][ident]
  require({k: v for k, v in current.items() if k not in ['quotes', 'uniqueQuotedWords', 'passes']} == {k: v for k, v in old.items() if k not in ['quotes', 'uniqueQuotedWords', 'passes']}, 'Original source metadata changed')
  require(current['quotes'][:len(old['quotes'])] == old['quotes'], 'Old quotation object changed')
  expected = CONFIG['MG' + ident[1:]][3]
  require([q['text'] for q in current['quotes'][len(old['quotes']):]] == expected and len(current['quotes']) == len(old['quotes']) + len(expected), 'Unreviewed Wiki quotation')
 for ident in affected | {'FGS_TIPS'}:
  source = sb[ident]; require(len(source['passes']) == 2, 'Missing registered pass')
  for number in [1, 2]:
   c, p = captures[(ident, number)], source['passes'][number - 1]
   rec = next(r for r in reopens[number - 1] if r['sourceId'] == ident)
   ids = [q['id'] for q in source['quotes']]
   require(source['url'] == c['url'] == rec['url'] and p['pass'] == 'AB'[number - 1], 'Actual source identity changed')
   require(p['bodyBytes'] == rec['bodyBytes'] == c['bodyBytes'] and p['bodySha256'] == rec['bodySha256'] == c['bodySha256'], 'Actual body witness changed')
   require(rec['requestBeganUTC'] == c['startedUTC'] and rec['requestCompletedUTC'] == p['observedAtUTC'] == c['completedUTC'] and rec['httpEffectiveTls'] == c['httpEffectiveTls'], 'Actual receipt dates or transport invented')
   require(p['fullArticleScopeSha256'] == c['textSha256'] and c['textSha256'] == captures[(ident, 1)]['textSha256'], 'Complete article scope changed')
   require(p['recoveredQuoteIds'] == rec['recoveredQuoteIds'] == ids and rec['missingQuoteIds'] == [] and rec['rawBodyPublished'] is False, 'Incomplete quote recovery')
   require(rec['quotes'] == [{k: q[k] for k in ['id', 'text', 'locator']} for q in source['quotes']], 'Reopened literal quotation changed')
   for q in source['quotes']: require(q['id'] in rec['recoveredQuoteIds'], 'Old/new quotation not recovered')
 h_reopens = [[copy.deepcopy(proof['beforeReopens'][str(n)].get(r['sourceId'], r)) for r in rs if r['sourceId'] != 'FGS_TIPS'] for n, rs in enumerate(reopens, 1)]
 require([digest(r) for r in h_reopens] == proof['baselineReopensSha256Passes'] == BASE_REOPENS, 'Full accepted A/B history changed')
 qsc = module('quote-support-check.py')
 actual = [{'id': q['id'], 'substantive': qsc.substantive(q['text'])} for s in historical['sources'] for q in s['quotes']]
 require(len(actual) == len(proof['baselineQuoteClassifications']) == 1931, 'Old classifier scope changed')
 for a, b in zip(actual, proof['baselineQuoteClassifications']): require(a == b, 'Any old quotation classification changed')
 for source in sources['sources']: require(source['uniqueQuotedWords'] == sum(len(text.split()) for text in {q['text'] for q in source['quotes']}) <= 200, 'Original/new source quote budget exceeded')
 require(sb['FGS_BASE']['uniqueQuotedWords'] == 200 and sb['NAMU_BASE']['uniqueQuotedWords'] == 195, 'Existing guide/Namu history lost')
 require(sum(e['status'] == 'corroborated' for r in data['minigames'] for e in r['fieldEvidence'].values()) == 303, 'Unexpected fact coverage')
 module('check-family-tips-candidate.py').validate(candidate, restored, historical, h_reopens)
 return restored, historical, h_reopens, count

def before_review_view(data, sources, reopens):
 if not (ROOT / 'reports/tv-action-recovery.json').exists(): return data, sources, reopens
 return module('check-tv-action-recovery.py').historical_view(data, sources, reopens)

def historical_view(data, sources, reopens):
 if not (ROOT / 'reports/family-tips-recovery.json').exists(): return data, sources, reopens
 proof = read('reports/family-tips-recovery.json')
 if digest(data) == BASE_DATA and digest(sources) == BASE_SOURCES and [digest(x) for x in reopens] == BASE_REOPENS:
  current = before_review_view(read('minigames.json'), read('catalogue-sources.json'), [read('reports/source-reopens-pass' + p + '.json') for p in 'AB'])
  validate(proof, *current)
  return data, sources, reopens
 data, sources, reopens = before_review_view(data, sources, reopens)
 return validate(proof, data, sources, reopens)[:3]

def run():
 proof = read('reports/family-tips-recovery.json'); data = read('minigames.json'); sources = read('catalogue-sources.json'); reopens = [read('reports/source-reopens-pass' + p + '.json') for p in 'AB']
 data, sources, reopens = before_review_view(data, sources, reopens)
 count = validate(proof, data, sources, reopens)[3]
 for number in range(10):
  p, d, s, rs = copy.deepcopy(proof), copy.deepcopy(data), copy.deepcopy(sources), copy.deepcopy(reopens)
  if number == 0: p['repairs'][0]['summary'] += ' Exact timer is 10 seconds.'
  elif number == 1: next(x for x in s['sources'] if x['id'] == 'FGS_TIPS')['publisherLineage'] = 'mariowiki'
  elif number == 2: p['beforeSources']['W039']['quotes'][0]['text'] = 'Changed old quotation'
  elif number == 3: p['retainedCaptures'][0]['bodySha256'] = '0' * 64
  elif number == 4: d['minigames'][6]['timeLimit']['wholeGameSeconds'] = 999
  elif number == 5: p['baselineQuoteClassifications'][0]['substantive'] = not p['baselineQuoteClassifications'][0]['substantive']
  elif number == 6: p['repairs'][0]['authoredFullContextSha256Passes'][1] = '0' * 64
  elif number == 7: next(x for x in s['sources'] if x['id'] == 'FGS_TIPS')['quotes'][0]['text'] = 'A copied official instruction'
  elif number == 8: next(x for x in rs[1] if x['sourceId'] == 'W098')['recoveredQuoteIds'].pop()
  elif number == 9: d['minigames'][97]['controls']['bindings'][0]['sourceIconLabels'] = ['A']
  try: validate(p, d, s, rs)
  except (AssertionError, KeyError): pass
  else: raise AssertionError('Malformed four-action recovery accepted')
 return [{'name': 'Four originally authored shared actions, retained14 native requests and exact1931-quote/132-row/146-source baseline preservation', 'caseCount': count, 'passed': True, 'seed': None}, {'name': 'Ten malformed four-action author, scope, old history, control and capture fixtures reject', 'caseCount': 10, 'passed': True, 'seed': None}]
if __name__ == '__main__': print(json.dumps(run(), indent=2))

