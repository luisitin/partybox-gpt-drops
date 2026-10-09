"""Verify a narrow14-category adoption and supply exact accepted historical views.

No source identity, quotation, old timestamp, gameplay or unrelated row may be
silently changed when later checks revisit their original accepted snapshots.
"""
from pathlib import Path
from datetime import datetime
import copy, hashlib, importlib.util, json, unicodedata

ROOT = Path(__file__).resolve().parent
BASELINE = '1bbc43dc78cb62b06704d9bef17b43d4a0f71ed4'
BASE_DATA = '8706f7536817d21df856d74c3c310e65e133a75da745a3d45e8fe462a493191d'
BASE_SOURCES = 'bf91c2f8d97a2647f3e0e8040a511c5b3dc26e31c86c0b359c19db98e2c1fd16'
BASE_REOPENS = ['4a3d388399ba4e18775bc3e484157d8f022010336711f27b222ef064d1447ccd', '37ebbd2020e6629a91fe9bc75322e5f1020dcc400e7990fb40f8f7419656e143']
HEADINGS = {'W_LIST': ('W_LIST_mouse_category_heading', 'Mouse minigames'), 'NL_TV': ('NL_TV_mouse_category_heading', 'Mouse Minigames')}
SCOPE = 'Exactly14 Jamboree TV Mouse category fields only. No format, gameplay, control, timer, score, tie, payout, roster or whole-row completion promotion.'

def read(n): return json.loads((ROOT / n).read_text())
def digest(v): return hashlib.sha256(json.dumps(v, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
def key(v): return ''.join(c for c in unicodedata.normalize('NFKC', v).casefold() if c.isalnum())
def module(n):
    spec = importlib.util.spec_from_file_location(n.replace('-', '_'), ROOT / n)
    result = importlib.util.module_from_spec(spec); spec.loader.exec_module(result); return result

def validate(p, d, s, rs):
    count = 0
    def require(ok, message):
        nonlocal count
        count += 1
        if not ok: raise AssertionError(message)
    require(p['job'] == 'B03' and p['baselineSourceCommit'] == BASELINE and p['scope'] == SCOPE, 'Wrong accepted parent or semantic scope')
    require(p['newHttpRequestsForAdoption'] == 0 and p['fullCopyrightBodiesPublished'] is False, 'Invented requests or published full bodies')
    require(p['baselineDataSha256'] == BASE_DATA and p['baselineSourcesSha256'] == BASE_SOURCES and p['baselineReopensSha256Passes'] == BASE_REOPENS, 'Accepted baseline seal changed')
    require(len(d['minigames']) == 132 and len(s['sources']) == 148 and len(p['repairs']) == len(p['beforeCategories']) == 14, 'Wrong row/source/adoption scope')
    candidates = read('reports/remaining-category-research.json')
    require(digest(candidates) == p['retainedCandidatePacketSha256'] == '33a167e13147f4487e6bd8e4f53aeb6c1223956c5d36c088af829527fed49ddf', 'Actual retained source packet changed')
    require(p['actualCollectorClosure'] == candidates['actualCollectorClosure'] and p['retainedNLTVScopes'] == candidates['completeArticleScopes']['NL_TV'], 'Full actual source scopes or original collector closure changed')
    require(p['retainedActualCaptures'] == candidates['actualCaptures'] and p['retainedWikiMembership'] == candidates['primaryWikiMembershipScope'], 'Retained source history changed')
    repair_by = {x['id']: x for x in p['repairs']}
    wanted = {x['id'] for x in candidates['candidates']}
    require(set(repair_by) == set(p['beforeCategories']) == wanted and len(repair_by) == 14, 'Duplicate, missing or unrelated category adoption')
    restored = copy.deepcopy(d)
    for row in restored['minigames']:
        if row['id'] in wanted: row['fieldEvidence']['category'] = copy.deepcopy(p['beforeCategories'][row['id']])
    require(digest(restored) == BASE_DATA, 'Any old row value, summary or unrelated evidence changed')
    require(len(p['baselineRowHashes']) == 132, 'Missing complete original row audit')
    for row, expected in zip(restored['minigames'], p['baselineRowHashes']):
        require(expected == {'id': row['id'], 'sha256': digest(row)}, 'Accepted row fingerprint changed')
    before_sources = copy.deepcopy(s)
    require(set(p['beforeSources']) == set(HEADINGS) and set(p['beforeReopens']) == {'1', '2'} and all(set(v) == set(HEADINGS) for v in p['beforeReopens'].values()), 'Wrong affected source or reopen scope')
    before_sources['sources'] = [copy.deepcopy(p['beforeSources'].get(x['id'], x)) for x in s['sources']]
    require(digest(before_sources) == BASE_SOURCES and len(p['baselineSourceHashes']) == 148, 'Any original source or unrelated source metadata changed')
    for source in before_sources['sources']:
        require(p['baselineSourceHashes'][source['id']] == digest(source), 'Accepted source fingerprint changed')
    before_reopens = [[copy.deepcopy(p['beforeReopens'][str(n)].get(x['sourceId'], x)) for x in records] for n, records in enumerate(rs, 1)]
    require([digest(x) for x in before_reopens] == BASE_REOPENS, 'Complete original A/B record history changed')
    qsc = module('quote-support-check.py')
    classes = [{'id': q['id'], 'substantive': qsc.substantive(q['text'])} for source in before_sources['sources'] for q in source['quotes']]
    require(len(classes) == len(p['baselineQuoteClassifications']) == 1949, 'Wrong historical classifier scope')
    for original, expected in zip(classes, p['baselineQuoteClassifications']):
        require(original == expected, 'Original substantive quotation classification changed')
    by = {x['id']: x for x in s['sources']}
    require(by['W_LIST']['publisherLineage'] == 'mariowiki' and by['NL_TV']['publisherLineage'] == 'hookshot', 'Publisher independence changed')
    captures = {(x['sourceId'], x['pass']): x for x in p['retainedActualCaptures']}
    for sid, (qid, text) in HEADINGS.items():
        current, old = by[sid], p['beforeSources'][sid]
        require({k: v for k, v in current.items() if k not in ['quotes', 'passes', 'uniqueQuotedWords']} == {k: v for k, v in old.items() if k not in ['quotes', 'passes', 'uniqueQuotedWords']}, 'Original source identity or metadata changed')
        require(current['quotes'][:-1] == old['quotes'] and current['quotes'][-1] == p['newHeadingQuotes'][sid], 'Old quotation deleted or altered')
        require(current['quotes'][-1]['id'] == qid and current['quotes'][-1]['text'] == text and len(text.split()) == 2, 'Wrong bounded literal heading quote')
        ids = [q['id'] for q in current['quotes']]
        require(current['uniqueQuotedWords'] == sum(len(t.split()) for t in {q['text'] for q in current['quotes']}), 'Unique quote budget changed')
        require(current['uniqueQuotedWords'] == {'W_LIST': 158, 'NL_TV': 25}[sid], 'Cumulative category-page quotation history changed')
        for n in [1, 2]:
            pa = current['passes'][n - 1]; rec = next(x for x in rs[n - 1] if x['sourceId'] == sid)
            require(pa['recoveredQuoteIds'] == rec['recoveredQuoteIds'] == ids and rec['missingQuoteIds'] == [], 'Old/new quotation not recovered')
            require(rec['quotes'] == [{k: q[k] for k in ['id', 'text', 'locator']} for q in current['quotes']], 'Exact reopened quote differs from registry')
            if sid == 'W_LIST':
                expected = copy.deepcopy(old['passes'][n - 1]); expected['recoveredQuoteIds'] = ids
                require(pa == expected, 'Historical Wiki capture or date silently rewritten')
                expected_rec = copy.deepcopy(p['beforeReopens'][str(n)][sid]); expected_rec.update({'recoveredQuoteIds': ids, 'quotes': rec['quotes']})
                require(rec == expected_rec, 'Historical Wiki receipt silently rewritten')
            else:
                c = captures[(sid, n)]
                require(c['actualTransportPassed'] and c['httpEffectiveTls'] == ['200', current['url'], '0'] and c['curlExitCode'] == 0 and c['tlsVerificationDisabled'] is False, 'Failed source capture promoted')
                require(pa['bodySha256'] == rec['bodySha256'] == c['bodySha256'] and pa['bodyBytes'] == rec['bodyBytes'] == c['bodyBytes'], 'Actual received body changed')
                require(pa['observedAtUTC'] == rec['requestCompletedUTC'] == c['completedUTC'] and rec['requestBeganUTC'] == c['startedUTC'], 'Actual capture date invented')
                require(pa['httpStatus'] == 200 and pa['tlsVerified'] is True and rec['curlExit'] == 0 and rec['httpEffectiveTls'] == c['httpEffectiveTls'] and rec['rawBodyPublished'] is False, 'Actual source transport or publication scope changed')
                require(pa['textSha256'] == c['textSha256'] and pa['textCharacters'] == c['textCharacters'] and pa['fullArticleScopeSha256'] == p['retainedNLTVScopes'][n - 1]['fullArticleSha256'], 'Full source scope replaced with excerpt')
        require(datetime.fromisoformat(by[sid]['passes'][1]['observedAtUTC']) > datetime.fromisoformat(by[sid]['passes'][0]['observedAtUTC']), 'Second pass preceded first closure')
    rows = {x['id']: x for x in d['minigames']}
    primary = {key(x['name']): x for x in p['retainedWikiMembership']['memberships']}
    secondary = set(map(key, p['retainedNLTVScopes'][0]['extracted']['members']))
    for c in candidates['candidates']:
        row = rows[c['id']]; repair = repair_by[row['id']]; old = p['beforeCategories'][row['id']]
        require(old == c['currentCategoryEvidence'] and old['status'] == 'single_source', 'Already-supported or different old category recounted')
        require(row['name'] == c['name'] == repair['name'] and row['category'] == repair['category'] == 'Jamboree TV Mouse' and row['edition'] == 'jamboree_tv', 'Unsupported name, category or edition identity')
        require(key(row['name']) in primary and key(row['name']) in secondary and primary[key(row['name'])]['categoryPath'] == ['Jamboree TV minigames', 'Mouse minigames'], 'Incomplete literal full-heading membership')
        require(repair['quoteIds'] == [x[0] for x in HEADINGS.values()] and row['fieldEvidence']['category']['quoteIds'] == old['quoteIds'] + repair['quoteIds'], 'Old witness lost or new heading citation omitted')
        require(row['fieldEvidence']['category']['status'] == 'corroborated' and row['fieldEvidence']['category']['limitation'] == p['categoryLimitation'], 'Category promotion exceeds reviewed semantic scope')
    require(sum(e['status'] == 'corroborated' for r in d['minigames'] for e in r['fieldEvidence'].values()) == 321 and sum(r['fieldEvidence']['category']['status'] == 'corroborated' for r in d['minigames']) == 118, 'False fact/category gain')
    require(sum(r['fieldEvidence']['gameplay']['status'] == 'corroborated' for r in d['minigames']) == 39 and all(r['complete'] is False for r in d['minigames']), 'False gameplay or whole-row gain')
    require(all(rows[x['id']]['fieldEvidence']['category'] == x['currentCategoryEvidence'] for x in candidates['stillUnsupported']), 'Koopathlon subdivision promoted without second-source evidence')
    for source in s['sources']:
        require(source['uniqueQuotedWords'] == sum(len(t.split()) for t in {q['text'] for q in source['quotes']}) <= 200, 'Original canonical-page quotation budget changed')
    count += module('check-mouse-category-candidate.py').validate(candidates, restored, before_sources, before_reopens)
    return restored, before_sources, before_reopens, count

def historical_view(d, s, rs):
    if not (ROOT / 'reports/mouse-category-recovery.json').exists(): return d, s, rs
    proof = read('reports/mouse-category-recovery.json')
    if digest(d) == BASE_DATA and digest(s) == BASE_SOURCES and [digest(x) for x in rs] == BASE_REOPENS:
        validate(proof, read('minigames.json'), read('catalogue-sources.json'), [read('reports/source-reopens-pass' + x + '.json') for x in 'AB'])
        return d, s, rs
    return validate(proof, d, s, rs)[:3]

def run():
    p, d, s = read('reports/mouse-category-recovery.json'), read('minigames.json'), read('catalogue-sources.json')
    rs = [read('reports/source-reopens-pass' + x + '.json') for x in 'AB']
    count = validate(p, d, s, rs)[3]
    for n in range(12):
        a, b, c, e = copy.deepcopy([p, d, s, rs])
        if n == 0: b['minigames'][0]['summary'] = 'An unsupported action. An unsupported second action.'
        elif n == 1: b['minigames'][112]['fieldEvidence']['category']['status'] = 'single_source'
        elif n == 2: a['repairs'][1] = copy.deepcopy(a['repairs'][0])
        elif n == 3: a['beforeSources']['NL_TV']['quotes'][0]['text'] = 'Changed original quotation'
        elif n == 4: a['baselineQuoteClassifications'][0]['substantive'] = not a['baselineQuoteClassifications'][0]['substantive']
        elif n == 5: next(x for x in c['sources'] if x['id'] == 'NL_TV')['publisherLineage'] = 'mariowiki'
        elif n == 6: next(x for x in e[1] if x['sourceId'] == 'NL_TV')['requestBeganUTC'] = '2099-01-01T00:00:00+00:00'
        elif n == 7: a['retainedNLTVScopes'][1]['extracted']['members'].pop()
        elif n == 8: next(x for x in c['sources'] if x['id'] == 'W_LIST')['passes'][0]['bodySha256'] = '0' * 64
        elif n == 9: next(x for x in e[1] if x['sourceId'] == 'NL_TV')['recoveredQuoteIds'].pop()
        elif n == 10: b['minigames'][0]['timeLimit']['wholeGameSeconds'] = 999
        elif n == 11: a['newHttpRequestsForAdoption'] = 4
        try: validate(a, b, c, e)
        except (AssertionError, KeyError, ValueError): pass
        else: raise AssertionError('Malformed14-category adoption or historical restoration accepted')
    return [{'name': 'Fourteen literal independent Mouse categories preserve exact132-row148-source1949-quote and complete A+B history', 'caseCount': count, 'passed': True, 'seed': None}, {'name': 'Twelve malformed category-adoption scope provenance historical quote classifier transport and timestamp fixtures reject', 'caseCount': 12, 'passed': True, 'seed': None}]

if __name__ == '__main__': print(json.dumps(run(), indent=2))
