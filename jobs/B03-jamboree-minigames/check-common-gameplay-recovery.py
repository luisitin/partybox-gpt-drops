"""Verify three narrowly shared actions, without promoting detailed mechanics."""
import copy
import hashlib
import json
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SUMMARIES = {
    'MG012': 'Players repeatedly press a button in a Whomp challenge. They aim to knock over the most Whomps.',
    'MG040': 'Players compete in a snowball fight. Computer-controlled teammates help the solo player.',
    'MG050': 'One player creates a path for a teammate. The teammate crosses that path to reach the goal.',
}
GUIDE_QUOTES = {
    'MG012': 'Mash the A button to hit the most Whomp',
    'MG040': 'Both sides fight in a snowball fight. The one player side has the help of AI monkeys.',
    'MG050': 'One player has to try to make a path for their teammate while the other player must cross that path to the goal.',
}
def require(ok, message):
    if not ok: raise AssertionError(message)
def digest(value): return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
def unrelated(row):
    row = copy.deepcopy(row); row.pop('summary'); row['fieldEvidence'].pop('gameplay'); return row
def historical_unrelated(row):
    row = copy.deepcopy(row); row['fieldEvidence'].pop('category'); row['fieldEvidence'].pop('gameplay'); return row

def validate(proof, data, sources, reopens, prior):
    rows = {r['id']: r for r in data['minigames']}; sb = {s['id']: s for s in sources['sources']}
    qb = {q['id']: (s, q) for s in sources['sources'] for q in s['quotes']}
    require(proof['job'] == 'B03' and proof['baselineSourceCommit'] == '4a60fc7e66157ea507f957388990e5be97bd8659', 'Wrong source baseline')
    require(proof['newHttpRequests'] == 0 and proof['copyrightBodiesPublished'] is False, 'Invented requests or published source bodies')
    require(len(proof['repairs']) == 3 and {r['id'] for r in proof['repairs']} == set(SUMMARIES), 'Common-action scope differs')
    wanted = {'FGS_BASE', 'W012', 'W040', 'W050'}
    captures = proof['retainedActualCaptures']
    require(len(captures) == 8 and set(proof['sourceScopeHashes']) == wanted, 'Source scope differs')
    require(captures == [r for r in prior['captures'] if r['sourceId'] in wanted], 'Historical actual capture changed')
    for sid in wanted:
        records = sorted((r for r in captures if r['sourceId'] == sid), key=lambda r: r['pass'])
        require([r['pass'] for r in records] == [1, 2], 'A/B source missing')
        require(proof['sourceScopeHashes'][sid] == prior['sourceScopeHashes'][sid] and len(set(proof['sourceScopeHashes'][sid])) == 1, 'Full source scope changed')
        for number, r in enumerate(records, 1):
            current = next(c for c in reopens[number - 1] if c['sourceId'] == sid)
            require(r['url'] == sb[sid]['url'] and r['curlExit'] == 0 and r['httpEffectiveTls'] == ['200', r['url'], '0'], 'Source transport failed')
            require(all(r[k] == current[k] for k in ['requestBeganUTC', 'requestCompletedUTC', 'bodyBytes', 'bodySha256']), 'Actual capture receipt differs')
            require(sb[sid]['passes'][number - 1]['bodySha256'] == r['bodySha256'] and sb[sid]['passes'][number - 1]['fullArticleScopeSha256'] == proof['sourceScopeHashes'][sid][number - 1], 'Registry scope or body differs')
        require(datetime.fromisoformat(records[1]['requestBeganUTC']) > datetime.fromisoformat(records[0]['requestCompletedUTC']), 'Second pass preceded first completion')
    restored = copy.deepcopy(data['minigames'])
    witnessed = set()
    for repair in proof['repairs']:
        ident = repair['id']; row = rows[ident]; evidence = row['fieldEvidence']['gameplay']
        require(row['name'] == repair['name'] and row['summary'] == repair['summary'] == SUMMARIES[ident], 'Claim differs from human-rechecked common actions')
        require(evidence['status'] == 'corroborated' and repair['beforeGameplayEvidence']['status'] == 'single_source', 'Unexpected confidence promotion')
        require(len(repair['witnesses']) == 2 and {w['sourceId'] for w in repair['witnesses']} == {'FGS_BASE', 'W' + ident[2:]}, 'Independent witness omitted')
        families = set()
        for w in repair['witnesses']:
            require(w['scopeHashes'] == proof['sourceScopeHashes'][w['sourceId']], 'Quote context not bound to both source scopes')
            require(w['quoteIds'], 'Empty source witness')
            for qid in w['quoteIds']:
                source, quote = qb[qid]; witnessed.add(qid); families.add(source['publisherLineage'])
                require(source['id'] == w['sourceId'] and qid in evidence['quoteIds'] and 6 <= len(quote['text'].split()) <= 25, 'Substantive source quote missing')
                require(all(qid in p['recoveredQuoteIds'] for p in source['passes']) and all(qid in next(r for r in rs if r['sourceId'] == source['id'])['recoveredQuoteIds'] for rs in reopens), 'Quote missing from an actual source pass')
            if w['sourceId'] == 'FGS_BASE':
                require(len(w['quoteIds']) == 1 and qb[w['quoteIds'][0]][1]['text'] == GUIDE_QUOTES[ident], 'Independent guide action changed')
        require(families == {'mariowiki', 'familygamesquad'}, 'Publisher independence absent')
        wiki = next(w for w in repair['witnesses'] if w['sourceId'].startswith('W'))
        guide = next(w for w in repair['witnesses'] if w['sourceId'] == 'FGS_BASE')
        expected_ids = list(dict.fromkeys(repair['beforeGameplayEvidence']['quoteIds'] + guide['quoteIds'] + wiki['quoteIds']))
        require(evidence['quoteIds'] == expected_ids, 'Prior gameplay citations lost or arbitrary new citations added')
        require(len(repair['guideContextSha256Passes']) == 2 and len(set(repair['guideContextSha256Passes'])) == 1, 'Independent full explanatory contexts changed')
        old = next(r for r in restored if r['id'] == ident)
        old['summary'] = repair['beforeSummary']; old['fieldEvidence']['gameplay'] = copy.deepcopy(repair['beforeGameplayEvidence'])
    require(proof['baselineUnrelatedRows'] == [{'id': r['id'], 'sha256': digest(unrelated(r))} for r in data['minigames']], 'Unrelated value or evidence changed')
    require(prior['unchangedNonCategoryGameplayRows'] == [{'id': r['id'], 'sha256': digest(historical_unrelated(r))} for r in restored], 'Original summary or unrelated baseline lost')
    new = set(proof['newQuoteIds'])
    require(3 <= len(new) <= 5 and len(new) == len(proof['newQuoteIds']) and new <= witnessed, 'Arbitrary new quotation')
    require(proof['baselineSourceQuoteHashes'] == {s['id']: digest([q for q in s['quotes'] if q['id'] not in new]) for s in sources['sources']}, 'Original source quotation altered')
    before = sum(len(t.split()) for t in {q['text'] for q in sb['FGS_BASE']['quotes'] if q['id'] not in new})
    require(before == proof['guideWordBudgetBefore'] == 151 and sb['FGS_BASE']['uniqueQuotedWords'] == proof['guideWordBudgetAfter'] == 200, 'Guide source budget differs')
    return {'ids': set(SUMMARIES), 'repairs': proof['repairs'], 'newQuoteIds': new, 'restoredRows': restored}

def load_and_validate(data, sources, reopens):
    load = lambda name: json.loads((ROOT / name).read_text())
    return validate(load('reports/common-gameplay-recovery.json'), data, sources, reopens, load('reports/category-summary-recovery.json'))

def run():
    load = lambda name: json.loads((ROOT / name).read_text())
    proof = load('reports/common-gameplay-recovery.json'); data = load('minigames.json'); sources = load('catalogue-sources.json'); reopens = [load('reports/source-reopens-pass' + l + '.json') for l in 'AB']; prior = load('reports/category-summary-recovery.json')
    validate(proof, data, sources, reopens, prior)
    fixtures = []
    for i in range(8):
        p, d, s, rs = copy.deepcopy(proof), copy.deepcopy(data), copy.deepcopy(sources), copy.deepcopy(reopens)
        if i == 0: p['repairs'][0]['summary'] += ' Timer is exactly 10 seconds.'
        elif i == 1: next(x for x in s['sources'] if x['id'] == 'FGS_BASE')['publisherLineage'] = 'mariowiki'
        elif i == 2:
            qid = next(w for w in p['repairs'][0]['witnesses'] if w['sourceId'] == 'FGS_BASE')['quoteIds'][0]
            next(x for x in s['sources'] if x['id'] == 'FGS_BASE')['passes'][1]['recoveredQuoteIds'].remove(qid)
        elif i == 3: p['retainedActualCaptures'][0]['bodySha256'] = '0' * 64
        elif i == 4: p['repairs'][0]['beforeSummary'] = 'Invented baseline. Invented second sentence.'
        elif i == 5: p['baselineSourceQuoteHashes']['W012'] = '0' * 64
        elif i == 6: p['guideWordBudgetAfter'] = 201
        elif i == 7: d['minigames'][11]['timeLimit']['wholeGameSeconds'] = 999
        fixtures.append((p, d, s, rs))
    for p, d, s, rs in fixtures:
        try: validate(p, d, s, rs, prior)
        except AssertionError: pass
        else: raise AssertionError('Malformed common-action proof accepted')
    cases = 8 + 3 + 132 + 145 + sum(len(w['quoteIds']) for r in proof['repairs'] for w in r['witnesses']) + 1
    return [{'name': 'Three common-action summaries, complete actual A/B witnesses and unrelated baseline preservation', 'caseCount': cases, 'passed': True, 'seed': None, 'detail': 'Retained naturally closed full responses; no new HTTP request, exact timer or payout promotion.'}, {'name': 'Eight malformed common-action source, scope, confidence, budget and preservation proofs rejected', 'caseCount': 8, 'passed': True, 'seed': None, 'detail': 'Includes same-lineage source, missing second-pass quote, extra timer claim and changed unrelated parameter.'}]

if __name__ == '__main__': print(json.dumps(run(), indent=2))
