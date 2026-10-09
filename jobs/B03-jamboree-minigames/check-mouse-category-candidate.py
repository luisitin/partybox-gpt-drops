"""Validate the retained two-publisher Mouse-category candidate without adoption.

The sealed accepted product stays unchanged. Actual full A/B response captures
support category membership; precise gameplay and mode rules remain separate.
"""
from pathlib import Path
from datetime import datetime
import copy, hashlib, json, unicodedata

ROOT = Path(__file__).resolve().parent
DATA = '8706f7536817d21df856d74c3c310e65e133a75da745a3d45e8fe462a493191d'
SOURCES = 'bf91c2f8d97a2647f3e0e8040a511c5b3dc26e31c86c0b359c19db98e2c1fd16'
REOPENS = ['4a3d388399ba4e18775bc3e484157d8f022010336711f27b222ef064d1447ccd', '37ebbd2020e6629a91fe9bc75322e5f1020dcc400e7990fb40f8f7419656e143']
PACKET = '33a167e13147f4487e6bd8e4f53aeb6c1223956c5d36c088af829527fed49ddf'

def digest(v):
    return hashlib.sha256(json.dumps(v, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()

def key(v):
    return ''.join(c for c in unicodedata.normalize('NFKC', v).casefold() if c.isalnum())

def read(n):
    return json.loads((ROOT / n).read_text())

def validate(p, d, s, rs):
    count = 0
    def require(ok, message):
        nonlocal count
        count += 1
        if not ok:
            raise AssertionError(message)
    require(p['status'] == 'UNADOPTED_RESEARCH' and p['acceptedProductBaseline'] == 'ed7e36b56a30d728789b7ff58377c3762d48453e', 'Wrong candidate status or parent')
    require(digest(p) == PACKET, 'Retained actual capture packet changed')
    require(digest(d) == DATA and digest(s) == SOURCES and [digest(x) for x in rs] == REOPENS, 'Premature adoption or accepted product/source/A+B history changed')
    require(p['acceptedProductRowsChanged'] is False and p['acceptedSourceRegistryChanged'] is False and p['acceptedQuotationHistoryChanged'] is False, 'Candidate claimed an adoption')
    require(p['fullCopyrightBodiesPublished'] is False, 'Full source body publication')
    by = {x['id']: x for x in s['sources']}
    require(len(by) == len(s['sources']) == 148 and len(d['minigames']) == 132, 'Source/row scope changed')
    require(by['W_LIST']['publisherLineage'] == 'mariowiki' and by['NL_TV']['publisherLineage'] == 'hookshot', 'Wrong independent publishers')
    require(by['W_LIST']['publisherLineage'] != by['NL_TV']['publisherLineage'], 'One publisher counted twice')
    require(sum(len(x['quotes']) for x in s['sources']) == 1949, 'Quotation history changed')
    for source in s['sources']:
        require(source['uniqueQuotedWords'] == sum(len(t.split()) for t in {q['text'] for q in source['quotes']}) <= 200, 'Canonical-page quote budget changed')
    for records in rs:
        require(len(records) == 151 and len({x['sourceId'] for x in records}) == 151, 'Complete A/B history missing')
    captures = p['actualCaptures']
    require(len(captures) == 4, 'Actual finite collector scope changed')
    for sid in ['NL_TV', 'MPL_BASE']:
        pair = sorted((x for x in captures if x['sourceId'] == sid), key=lambda x: x['pass'])
        require([x['pass'] for x in pair] == [1, 2], 'Actual pass omitted or duplicated')
        for x in pair:
            require(x['url'] == by[sid]['url'] and x['actualTransportPassed'] is True and x['curlExitCode'] == 0 and x['httpEffectiveTls'] == ['200', x['url'], '0'], 'Failed or different source transport accepted')
            require(x['bodyReceived'] is True and x['bodyBytes'] > 1000 and x['scopePresent'] is True and x['tlsVerificationDisabled'] is False, 'Incomplete or insecure response accepted')
        require(datetime.fromisoformat(pair[1]['startedUTC']) > datetime.fromisoformat(pair[0]['completedUTC']), 'Second pass preceded first closure')
    scopes = p['completeArticleScopes']['NL_TV']
    require(len(scopes) == 2 and scopes[0]['fullArticleSha256'] == scopes[1]['fullArticleSha256'], 'Complete second article scope differs')
    require(all(x['fullArticleCharacters'] == 7561 and x['selector'] == 'article#article' for x in scopes), 'Excerpt substituted for full article')
    require(scopes[0]['extracted'] == scopes[1]['extracted'], 'Category membership changed between captures')
    extracted = scopes[0]['extracted']
    require(extracted['heading'] == 'Mouse Minigames' and extracted['nativeByline'] == "by PJ O'Reilly", 'Heading or actual author changed')
    require(len(extracted['members']) == len(set(map(key, extracted['members']))) == 14, 'Second publisher membership duplicate or missing')
    primary = p['primaryWikiMembershipScope']
    require(primary['actualFreshHttpRequests'] == 0 and primary['fullPairedPrivateBodiesRehashed'] is True, 'Historical Wiki capture misrepresented as new request')
    require(primary['scopeHashes'] == ['678b0ce991b009dba6548dd04fc1bec662d24a5a38f33cff10d0e30fd7665e41'] * 2, 'Historical complete Wiki scope changed')
    require(len(primary['memberships']) == len(p['candidates']) == 14, 'Primary or candidate scope missing')
    rows = {x['id']: x for x in d['minigames']}
    require({key(x['name']) for x in primary['memberships']} == set(map(key, extracted['members'])), 'Unresolved spelling or category membership mismatch')
    for c, w in zip(p['candidates'], primary['memberships']):
        row = rows[c['id']]
        require(row['name'] == c['name'] == w['name'] and row['edition'] == 'jamboree_tv' and row['category'] == c['category'] == 'Jamboree TV Mouse', 'Wrong canonical identity, edition or category')
        require(w['categoryPath'] == ['Jamboree TV minigames', 'Mouse minigames'] and w['categoryAnchor'] == 'Mouse_minigames', 'Primary heading does not support category')
        require(c['status'] == 'UNADOPTED' and c['literalHeading'] == 'Mouse Minigames' and c['secondPublisher'] == 'NL_TV', 'Premature promotion or invented second witness')
        require(row['fieldEvidence']['category'] == c['currentCategoryEvidence'] and row['fieldEvidence']['category']['status'] == 'single_source', 'Candidate altered current field evidence')
    require(len(p['stillUnsupported']) == 14 and all(rows[x['id']]['fieldEvidence']['category'] == x['currentCategoryEvidence'] and rows[x['id']]['fieldEvidence']['category']['status'] == 'single_source' for x in p['stillUnsupported']), 'Generic Koopathlon heading promoted a subdivision')
    require(sum(e['status'] == 'corroborated' for r in d['minigames'] for e in r['fieldEvidence'].values()) == 307 and all(r['complete'] is False for r in d['minigames']), 'False fact or whole-row gain')
    return count

def run():
    p, d, s = read('reports/remaining-category-research.json'), read('minigames.json'), read('catalogue-sources.json')
    rs = [read('reports/source-reopens-pass' + x + '.json') for x in 'AB']
    if (ROOT / 'reports/mouse-category-recovery.json').exists():
        import importlib.util
        spec = importlib.util.spec_from_file_location('validated_mouse_adoption_history', ROOT / 'check-mouse-category-recovery.py')
        reader = importlib.util.module_from_spec(spec); spec.loader.exec_module(reader)
        p_original = copy.deepcopy(p)
        d, s, rs = reader.historical_view(d, s, rs)
        assert p == p_original
    count = validate(p, d, s, rs)
    for n in range(10):
        a, b, c, e = copy.deepcopy([p, d, s, rs])
        if n == 0: b['minigames'][112]['fieldEvidence']['category']['status'] = 'corroborated'
        elif n == 1: next(x for x in c['sources'] if x['id'] == 'NL_TV')['publisherLineage'] = 'mariowiki'
        elif n == 2: a['completeArticleScopes']['NL_TV'][1]['extracted']['members'].pop()
        elif n == 3: a['completeArticleScopes']['NL_TV'][0]['extracted']['members'][3] = 'Pull Back and Attack'
        elif n == 4: a['actualCaptures'][0]['httpEffectiveTls'][0] = '402'
        elif n == 5: a['actualCaptures'][2]['startedUTC'] = a['actualCaptures'][0]['startedUTC']
        elif n == 6: b['minigames'][0]['timeLimit']['wholeGameSeconds'] = 999
        elif n == 7: e[1].pop()
        elif n == 8: a['fullCopyrightBodiesPublished'] = True
        elif n == 9: a['stillUnsupported'][0]['currentCategoryEvidence']['status'] = 'corroborated'
        try: validate(a, b, c, e)
        except (AssertionError, KeyError, ValueError): pass
        else: raise AssertionError('Malformed or prematurely adopted category candidate accepted')
    return [{'name': 'Exact accepted132-row148-source1949-quote history and complete independent14-Mouse category candidates', 'caseCount': count, 'passed': True, 'seed': None}, {'name': 'Ten malformed category candidates reject promotion lineage spelling pass scope and transport defects', 'caseCount': 10, 'passed': True, 'seed': None}]

if __name__ == '__main__':
    print(json.dumps(run(), indent=2))
