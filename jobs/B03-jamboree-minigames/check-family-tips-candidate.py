"""Validate an unadopted research packet against its exact accepted source."""
from pathlib import Path
from datetime import datetime
import copy, hashlib, json

ROOT = Path(__file__).resolve().parent
DATA = 'dff256225fedebc602e2ab9d7c486e3c187344b7643814dfb7126f3b9adca194'
SOURCES = '259e9e12a296621d29e9a8b4b5908cd76fdea8b79bc24963bb4bc6f0b76875f7'
REOPENS = ['14b6ccce67def7f45da3540c3975bd9eabd6692f0c22e1d473521cf43d5ecdd1', '2f5f6ed7d6ab8aab7fbff3076763fec6186f9d7c147f1ba704f9cd60be379258']
IDS = ['MG007', 'MG039', 'MG098', 'MG107']
SOURCE_IDS = ['FGS_TIPS', 'W002', 'W007', 'W039', 'W098', 'W107', 'W108']
def read(name): return json.loads((ROOT / name).read_text())
def digest(value): return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
def validate(proof, data, sources, reopens):
 checks = 0
 def require(value, reason):
  nonlocal checks
  checks += 1
  if not value: raise AssertionError(reason)
 require(proof['status'] == 'UNADOPTED' and proof['noProductEdits'] is True and proof['copyrightBodiesPublished'] is False, 'Candidate promoted or full bodies published')
 require(proof['baselineSourceCommit'] == '76880fa120a98e2b16e11ee0d1e7233277e8742c', 'Wrong accepted baseline')
 require(digest(data) == proof['baselineDataSha256'] == DATA, 'Any original product value/evidence changed')
 require(digest(sources) == proof['baselineSourcesSha256'] == SOURCES, 'Original source, quote or pass changed')
 require([digest(x) for x in reopens] == proof['baselineReopensSha256Passes'] == REOPENS, 'Original A/B history changed')
 require(proof['baselineRowHashes'] == [{'id': r['id'], 'sha256': digest(r)} for r in data['minigames']], '132-row baseline changed')
 require(proof['baselineSourceHashes'] == {s['id']: digest(s) for s in sources['sources']}, '146-source baseline changed')
 require(proof['currentCoverage'] == {'corroboratedNarrowFacts': 299, 'remainingFactFields': 1021, 'wholeRowsComplete': 0}, 'Unverified coverage promotion')
 require(proof['originalGuideQuotedWords'] == 200 and proof['originalNamuQuotedWords'] == 195, 'Original quotation budgets changed')
 source = proof['source']
 require(source['url'] == 'https://familygamesquad.com/super-mario-party-jamboree-tips-and-tricks/' and source['publisherLineage'] == 'familygamesquad' and source['author'] == 'Gaming Chickadee', 'Wrong URL, author or lineage')
 require(source['published'] == '2024-11-05' and 'Tips and Tricks' in source['title'], 'Wrong article')
 require(proof['actualNativeRequestCount'] == len(proof['captures']) == 14, 'Missing actual source requests')
 captures = {(c['sourceId'], c['pass']): c for c in proof['captures']}
 require(len(captures) == 14, 'Duplicate capture')
 for ident in SOURCE_IDS:
  a, b = captures[(ident, 1)], captures[(ident, 2)]
  require(datetime.fromisoformat(b['startedUTC']) > datetime.fromisoformat(a['completedUTC']), 'B before A closed')
  for c in [a, b]:
   require(c['curlExitCode'] == 0 and c['httpEffectiveTls'][0] == '200' and c['httpEffectiveTls'][2] == '0' and c['tlsVerificationDisabled'] is False, 'Failed or unverified HTTPS response')
   require(c['bodyBytes'] > 0 and len(c['bodySha256']) == len(c['textSha256']) == 64, 'Missing full body/scope')
   require(datetime.fromisoformat(c['completedUTC']) >= datetime.fromisoformat(c['startedUTC']), 'Invented capture order')
 scopes = {s['sourceId']: s for s in proof['fullNormalizedArticleScopes']}
 require(set(scopes) == set(SOURCE_IDS), 'Missing full article scope')
 for scope in scopes.values(): require(scope['passA'] == scope['passB'] and len(scope['passA']) == 64, 'Full A/B scope changed')
 sb = {s['id']: s for s in sources['sources']}
 require(proof['oldWikiQuoteRecoveries'] == {ident: [q['id'] for q in sb[ident]['quotes']] for ident in SOURCE_IDS if ident != 'FGS_TIPS'}, 'Historical Wiki quotations lost')
 candidates = proof['candidates']
 require([c['id'] for c in candidates] == IDS, 'Unreviewed candidate added')
 require(source['uniqueQuotedWords'] == sum(len(c['quote'].split()) for c in candidates) == 73, 'New article quote budget changed')
 for c in candidates:
  row = next(r for r in data['minigames'] if r['id'] == c['id'])
  require(row['name'] == c['name'] and row['fieldEvidence']['gameplay']['status'] == 'single_source' and c['status'] == 'UNADOPTED', 'Candidate adopted or wrong game')
  require(6 <= c['quoteWords'] == len(c['quote'].split()) <= 25 and c['quoteId'] == 'FGS_TIPS_candidate_' + c['id'], 'Wrong bounded original quote')
 require(set(proof['excludedCandidates']) == {'MG002', 'MG108'}, 'Unaccepted candidates lost')
 return checks
def run():
 proof = read('reports/family-tips-candidate.json'); data = read('minigames.json'); sources = read('catalogue-sources.json'); reopens = [read('reports/source-reopens-pass' + p + '.json') for p in 'AB']
 count = validate(proof, data, sources, reopens)
 mutations = [lambda p: p.__setitem__('status', 'ADOPTED'), lambda p: p['source'].__setitem__('publisherLineage', 'mariowiki'), lambda p: p['source'].__setitem__('uniqueQuotedWords', 74), lambda p: p.__setitem__('baselineDataSha256', '0' * 64), lambda p: p['captures'][0].__setitem__('curlExitCode', 1), lambda p: p['candidates'][0].__setitem__('status', 'corroborated')]
 for mutate in mutations:
  bad = copy.deepcopy(proof); mutate(bad)
  try: validate(bad, data, sources, reopens)
  except AssertionError: pass
  else: raise AssertionError('Malformed unadopted packet accepted')
 return [{'name': 'Four unadopted authored-tips candidates,14 actual ordered A/B captures and exact accepted product/history preservation', 'caseCount': count, 'passed': True, 'seed': None}, {'name': 'Six malformed candidate provenance and premature promotion controls reject', 'caseCount': 6, 'passed': True, 'seed': None}]
if __name__ == '__main__': print(json.dumps(run(), indent=2))
