"""Verify the scoped fresh-source repair without treating partial research as complete."""
import copy
import hashlib
import json
from datetime import datetime
from pathlib import Path
import unicodedata

ROOT = Path(__file__).resolve().parent
EQUIVALENCES = {'free-for-all': ['Free-for-All Minigames', '4-Player minigames'], '1v3': ['1 vs. 3 Minigames', '1-vs.-3 minigames'], 'Kaboom-Squad': ['Kaboom-Squad Minigames', 'Kaboom-Squad minigames']}
SUMMARY_IDS = {'MG012', 'MG014', 'MG028', 'MG040', 'MG049', 'MG050', 'MG063'}
def require(ok, message):
    if not ok: raise AssertionError(message)
def digest(value): return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
def key(value): return ''.join(c for c in unicodedata.normalize('NFKC', value).casefold() if c.isalnum())
def unchanged(row):
    result = copy.deepcopy(row); result['fieldEvidence'].pop('category'); result['fieldEvidence'].pop('gameplay'); return result
def validate(proof, data, sources, reopens, wiki_rows, later=None):
    if any(s['id'] == 'NAMU_BASE' for s in sources['sources']):
        import importlib.util
        spec = importlib.util.spec_from_file_location('validated_authored_tip_history', ROOT / 'check-namu-gameplay-recovery.py')
        reader = importlib.util.module_from_spec(spec); spec.loader.exec_module(reader)
        data, sources, reopens = reader.historical_view(data, sources, reopens)
    if later is None and (ROOT / 'reports/common-gameplay-recovery.json').exists():
        import importlib.util
        spec = importlib.util.spec_from_file_location('later_common_gameplay', ROOT / 'check-common-gameplay-recovery.py')
        checker = importlib.util.module_from_spec(spec); spec.loader.exec_module(checker)
        later = checker.load_and_validate(data, sources, reopens)
    rows = {r['id']: r for r in data['minigames']}; sb = {s['id']: s for s in sources['sources']}
    quotes = {q['id']: (s, q) for s in sources['sources'] for q in s['quotes']}
    require(proof['baselineSourceCommit'] == 'a327dc1cd579e85f7301edfd6b5b074f7fe6d602' and proof['copyrightBodiesPublished'] is False, 'Wrong baseline or copyright scope')
    require(proof['categoryEquivalences'] == EQUIVALENCES and proof['newHttpRequests'] == 16 and proof['reusedHistoricalHttpRecords'] == 2, 'Invented equivalence or source request count')
    require(len(proof['captures']) == 18 and {r['sourceId'] for r in proof['captures']} == {'W_LIST', 'FGS_BASE', 'W012', 'W014', 'W028', 'W040', 'W049', 'W050', 'W063'}, 'Source capture scope differs')
    for sid in proof['sourceScopeHashes']:
        captures = sorted([r for r in proof['captures'] if r['sourceId'] == sid], key=lambda r: r['pass'])
        require([r['pass'] for r in captures] == [1, 2], 'Missing or duplicate source pass')
        require(proof['sourceScopeHashes'][sid][0] == proof['sourceScopeHashes'][sid][1], 'Full source scope changed between passes')
        for number, r in enumerate(captures, 1):
            current = next(c for c in reopens[number - 1] if c['sourceId'] == sid)
            require(r['url'] == sb[sid]['url'] and r['curlExit'] == 0 and r['httpEffectiveTls'] == ['200', r['url'], '0'], 'Source transport failed')
            require(all(r[k] == current[k] for k in ['requestBeganUTC', 'requestCompletedUTC', 'bodyBytes', 'bodySha256']), 'Source receipt differs from actual reopening record')
            require(sb[sid]['passes'][number - 1]['bodySha256'] == r['bodySha256'] and sb[sid]['passes'][number - 1]['fullArticleScopeSha256'] == proof['sourceScopeHashes'][sid][number - 1], 'Registry does not bind actual source body and scope')
        require(datetime.fromisoformat(captures[1]['requestBeganUTC']) > datetime.fromisoformat(captures[0]['requestCompletedUTC']), 'Pass B preceded pass A completion')
    guide = proof['guideMembershipPasses']
    require(len(guide) == 2 and guide[0] == guide[1] and len(guide[0]) == len({key(r['name']) for r in guide[0]}) == 112, 'Incomplete or changed independent base roster')
    for first, second in EQUIVALENCES.values():
        require({key(r['name']) for r in wiki_rows if r['categoryPath'][-1] == first} == {key(r['name']) for r in guide[0] if r['categoryPath'][-1] == second}, 'Named category groups do not have the same complete membership')
    wanted = {r['id'] for r in data['minigames'] if r['category'] == 'Kaboom-Squad' or r['name'] in ['Sandwiched', 'Squeaky Shakedown']}
    require(len(wanted) == 12 and {r['id'] for r in proof['categoryRepairs']} == wanted and len(proof['categoryRepairs']) == 12, 'Category repair scope differs')
    for repair in proof['categoryRepairs']:
        row = rows[repair['id']]; require(row['name'] == repair['name'] and row['category'] == repair['category'] and row['fieldEvidence']['category']['status'] == 'corroborated', 'Category differs from published row')
        require(len(repair['quoteIds']) == len(repair['memberships']) == 2, 'Two category witnesses required')
        families = set()
        for index, (m, qid) in enumerate(zip(repair['memberships'], repair['quoteIds'])):
            sid = ['W_LIST', 'FGS_BASE'][index]; source, quote = quotes[qid]; families.add(source['publisherLineage'])
            require(m['sourceId'] == source['id'] == sid and qid in row['fieldEvidence']['category']['quoteIds'], 'Category source or citation changed')
            require(key(m['name']) == key(row['name']) and m['categoryPath'][-1] == EQUIVALENCES[row['category']][index] == quote['text'], 'Category heading or exact normalized identity differs')
            member = {k: v for k, v in m.items() if k != 'sourceId'}
            require(member in (wiki_rows if index == 0 else guide[0]), 'Category row absent from complete source list')
        require(families == {'mariowiki', 'familygamesquad'}, 'Independent source families missing')
    require(len(proof['summaryRepairs']) == 7 and {r['id'] for r in proof['summaryRepairs']} == SUMMARY_IDS, 'Summary recovery scope differs')
    for repair in proof['summaryRepairs']:
        row = rows[repair['id']]; source, quote = quotes[repair['quoteId']]
        require(source['id'] == repair['sourceId'] == 'W' + row['id'][2:] and quote['text'] == repair['quote'] and 6 <= len(quote['text'].split()) <= 25, 'Summary lacks a substantive actual Wiki quote')
        expected_status = 'corroborated' if later and repair['id'] in later['ids'] else 'single_source'
        require(repair['quoteId'] in row['fieldEvidence']['gameplay']['quoteIds'] and row['fieldEvidence']['gameplay']['status'] == expected_status and repair['status'] == 'single_source', 'Independent gameplay support overstated')
        require(repair['scopeHashes'] == proof['sourceScopeHashes'][source['id']], 'Summary quote scope differs from its full captures')
    baseline_rows = later['restoredRows'] if later else data['minigames']
    require(proof['unchangedNonCategoryGameplayRows'] == [{'id': r['id'], 'sha256': digest(unchanged(r))} for r in baseline_rows], 'Unrelated product value or evidence changed')
    new = set(proof['newQuoteIds']); require(len(new) == len(proof['newQuoteIds']) and new <= set(quotes), 'New quote IDs omitted or duplicated')
    excluded = new | (later['newQuoteIds'] if later else set())
    require(proof['baselineSourceQuoteHashes'] == {s['id']: digest([q for q in s['quotes'] if q['id'] not in excluded]) for s in sources['sources']}, 'Original source quotations deleted or altered')
    historical_budget = sum(len(t.split()) for t in {q['text'] for q in sb['FGS_BASE']['quotes'] if not later or q['id'] not in later['newQuoteIds']})
    require(historical_budget == proof['guideWordBudget'] == 151, 'Independent guide quotation budget differs')
    return wanted

def run():
    load = lambda name: json.loads((ROOT / name).read_text())
    proof = load('reports/category-summary-recovery.json'); data = load('minigames.json'); sources = load('catalogue-sources.json'); reopens = [load('reports/source-reopens-pass' + l + '.json') for l in 'AB']; wiki = load('reports/category-heading-repair.json')['sourceMembershipPasses']['W_LIST'][0]
    validate(proof, data, sources, reopens, wiki)
    mutations = [lambda p: p['guideMembershipPasses'][1].pop(), lambda p: p['categoryRepairs'][0]['memberships'][1].__setitem__('name', 'Sandwhiched'), lambda p: p['captures'][0].__setitem__('bodySha256', '0' * 64), lambda p: p['summaryRepairs'][0].__setitem__('status', 'corroborated'), lambda p: p['baselineSourceQuoteHashes'].__setitem__('W012', '0' * 64)]
    for mutate in mutations:
        bad = copy.deepcopy(proof); mutate(bad)
        try: validate(bad, data, sources, reopens, wiki)
        except AssertionError: pass
        else: raise AssertionError('Malformed source recovery proof accepted')
    return [{'name': 'Fresh complete category groups, seven substantive single-source summaries and original data preservation', 'caseCount': 18 + 112 + 24 + 7 + 132 + 145, 'passed': True, 'seed': None, 'detail': 'Actual A/B response records and retained extracted facts, with 16 new requests and two explicitly historical reused records.'}, {'name': 'Five malformed fresh-source scope, identity, hash, confidence and preservation proofs rejected', 'caseCount': 5, 'passed': True, 'seed': None, 'detail': 'Independent summaries are not promoted by Wiki quote presence.'}]

if __name__ == '__main__': print(json.dumps(run(), indent=2))
