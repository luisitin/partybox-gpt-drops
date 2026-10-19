"""Offline verification of actual two-pass category captures and row membership.

This checks retained response receipts and extracted facts. It does not reopen
URLs, recover private HTML in CI, or promote any mechanics beyond category.
"""
import copy
import hashlib
import json
from datetime import datetime
from pathlib import Path
import unicodedata

ROOT = Path(__file__).resolve().parent
EQUIVALENCES = {
    'free-for-all': ['Free-for-All Minigames', 'Free-for-All Minigames'],
    '1v3': ['1 vs. 3 Minigames', '1-vs-3 Minigames'],
    '2v2': ['2 vs. 2 Minigames', '2 vs 2 Minigames'],
    'duel': ['Duel Minigames', 'Duel Minigames'],
    'Item': ['Item Minigames', 'Item Minigames'],
    'Showdown': ['Showdown Minigames', 'Showdown Minigames'],
    'Boss': ['Boss Minigames', 'Boss Minigames'],
    'Rhythm': ['Rhythm Minigames', 'Rhythm Minigames'],
    'Bowser Live': ['Bowser Live minigames', 'Bowser Live'],
}
def require(ok, message):
    if not ok: raise AssertionError(message)
def digest(value): return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
def key(value): return ''.join(c for c in unicodedata.normalize('NFKC', value).casefold() if c.isalnum())
def validate(proof, data, sources, reopens, later_repairs=frozenset()):
    source_by = {s['id']: s for s in sources['sources']}
    quote_by = {q['id']: (s, q) for s in sources['sources'] for q in s['quotes']}
    row_by = {r['id']: r for r in data['minigames']}
    require(proof['job'] == 'B03' and proof['fullCopyrightBodiesPublished'] is False, 'Wrong job or copyright scope')
    require(proof['categoryEquivalences'] == EQUIVALENCES, 'Unsupported category equivalence')
    require(len(proof['captures']) == 6, 'Six actual source captures required')
    require(set(proof['sourceMembershipPasses']) == {'W_LIST', 'MPL_BASE', 'MPL_TV'}, 'Wrong source membership scope')
    for sid, passes in proof['sourceMembershipPasses'].items():
        require(len(passes) == 2 and passes[0] == passes[1], 'Category membership changed between passes')
        expected = {'W_LIST': 132, 'MPL_BASE': 112, 'MPL_TV': 6}[sid]
        require(len(passes[0]) == expected and len({key(r['name']) for r in passes[0]}) == expected, 'Source roster omitted or duplicated')
        require(proof['sourceScopeHashes'][sid] == [digest(rows) for rows in passes], 'Extracted category scope hash differs')
        receipts = sorted([r for r in proof['captures'] if r['sourceId'] == sid], key=lambda r: r['pass'])
        require([r['pass'] for r in receipts] == [1, 2], 'Source capture passes omitted or duplicated')
        for number, receipt in enumerate(receipts, 1):
            source = source_by[sid]; current = next(r for r in reopens[number - 1] if r['sourceId'] == sid)
            require(receipt['url'] == source['url'] and receipt['curlExit'] == 0 and receipt['httpEffectiveTls'] == ['200', source['url'], '0'], 'Category source transport failed')
            require(all(receipt[k] == current[k] for k in ['requestBeganUTC', 'requestCompletedUTC', 'bodyBytes', 'bodySha256']), 'Category capture differs from source reopening')
            require(source['passes'][number - 1]['bodySha256'] == receipt['bodySha256'] and source['passes'][number - 1]['fullArticleScopeSha256'] == digest(passes[number - 1]), 'Category registry does not bind actual source scope')
        require(datetime.fromisoformat(receipts[1]['requestBeganUTC']) > datetime.fromisoformat(receipts[0]['requestCompletedUTC']), 'Second category pass preceded first completion')
    repaired = set()
    for item in proof['repairs']:
        require(item['id'] not in repaired, 'Duplicate category repair'); repaired.add(item['id'])
        row = row_by[item['id']]; category = item['category']; wanted = ['W_LIST', 'MPL_TV' if category == 'Bowser Live' else 'MPL_BASE']
        require(row['name'] == item['name'] and row['category'] == category and row['fieldEvidence']['category']['status'] == 'corroborated', 'Category proof differs from published row')
        require(category in EQUIVALENCES and len(item['memberships']) == len(item['quoteIds']) == 2, 'Category proof lacks two heading witnesses')
        lineages = set()
        for index, (membership, qid) in enumerate(zip(item['memberships'], item['quoteIds'])):
            sid = membership['sourceId']; source, quote = quote_by[qid]
            require(sid == wanted[index] and source['id'] == sid, 'Heading source differs from row membership')
            lineages.add(source['publisherLineage'])
            retained = {k: v for k, v in membership.items() if k != 'sourceId'}
            require(all(retained in rows for rows in proof['sourceMembershipPasses'][sid]), 'Published membership was not extracted from both full captures')
            require(key(membership['name']) == key(row['name']), 'Unresolved spelling was treated as canonical identity')
            require(membership['categoryPath'][-1] == EQUIVALENCES[category][index] == quote['text'], 'Category heading does not support this category')
            require(qid in row['fieldEvidence']['category']['quoteIds'], 'Published row omits its heading citation')
        require(len(lineages) == 2, 'Category sources are not independent')
    require(len(repaired) == 82 and sum(row_by[i]['edition'] == 'base' for i in repaired) == 76, 'Category repair count or edition differs')
    require(len(proof['notPromoted']) == 40, 'Unresolved category scope changed')
    require(all(item['id'] not in repaired and (row_by[item['id']]['fieldEvidence']['category']['status'] != 'corroborated' or item['id'] in later_repairs) for item in proof['notPromoted']), 'Unresolved category promoted without later verified evidence')
    return 6 + 132 + 112 + 6 + 82 * 2

def run():
    load = lambda name: json.loads((ROOT / name).read_text())
    proof = load('reports/category-heading-repair.json'); data = load('minigames.json'); sources = load('catalogue-sources.json')
    reopens = [load('reports/source-reopens-pass' + letter + '.json') for letter in 'AB']
    if (ROOT / 'reports/mouse-category-recovery.json').exists():
        import importlib.util
        spec = importlib.util.spec_from_file_location('validated_mouse_category_history', ROOT / 'check-mouse-category-recovery.py')
        reader = importlib.util.module_from_spec(spec); spec.loader.exec_module(reader)
        data, sources, reopens = reader.historical_view(data, sources, reopens)
    later_repairs = set()
    if (ROOT / 'reports/category-summary-recovery.json').exists():
        import importlib.util
        spec = importlib.util.spec_from_file_location('later_category_recovery', ROOT / 'check-category-summary-recovery.py')
        reader = importlib.util.module_from_spec(spec); spec.loader.exec_module(reader)
        later_repairs = reader.validate(load('reports/category-summary-recovery.json'), data, sources, reopens, proof['sourceMembershipPasses']['W_LIST'][0])
    cases = validate(proof, data, sources, reopens, later_repairs)
    mutations = [
        lambda p: p['repairs'][0]['memberships'][1]['categoryPath'].__setitem__(-1, 'Teamwork Minigames'),
        lambda p: p['repairs'][0]['memberships'][1].__setitem__('name', 'Sandwhiched'),
        lambda p: p['repairs'][0]['memberships'][1].__setitem__('sourceId', 'W_LIST'),
        lambda p: p['captures'][0].__setitem__('bodySha256', '0' * 64),
        lambda p: p['sourceMembershipPasses']['MPL_BASE'][1].pop(),
    ]
    for mutate in mutations:
        changed = copy.deepcopy(proof); mutate(changed)
        try: validate(changed, data, sources, reopens, later_repairs)
        except AssertionError: pass
        else: raise AssertionError('Malformed category evidence accepted')
    return [{'name': 'Captured category headings, publisher independence and exact normalized row membership', 'caseCount': cases, 'passed': True, 'seed': None, 'detail': 'Actual response receipts and extracted category facts; no live reopening in CI.'}, {'name': 'Five actual malformed category-capture and membership proofs rejected', 'caseCount': 5, 'passed': True, 'seed': None, 'detail': 'Wrong category, spelling, lineage, response hash and second-pass omission.'}]

if __name__ == '__main__': print(json.dumps(run(), indent=2))
