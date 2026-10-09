"""Check received original-review candidates without promoting any product fact.

The candidate packet is bound to the complete accepted e679 catalogue and all
source/A+B history. Full copyright bodies stay in the private capture directory.
"""
from pathlib import Path
from datetime import datetime
import copy, hashlib, importlib.util, json, re, unicodedata

ROOT = Path(__file__).resolve().parent
BASELINE = 'e679464bea11348d76bb0a579a3cd54d391d38af'
DATA = 'd4b264f25b8e7a4f2ee9c6aa43b9ba0da1c677f21e8046b6908354d4dd704eb0'
SOURCES = '27669a0d97dc12a87a7a013e26b6738506cd6ab365b7a41e65894209fbafcef6'
REOPENS = ['708ca3d412dc32124d1b165a6a73949c4c016973c76b3301306460f4fc6623c4', 'ecb40c4a541132386204bf4fe4b110aaf3d8d0a9f524ea0f21cc94523a01008b']
PACKET = '192bded51f78b2f64ff33bbc9bee6803c5089efedcd9a1bea674344513ada120'
URL = 'https://simplestreviews.blogspot.com/2024/10/super-mario-party-jamboree-board.html'
IDS = ['MG002','MG005','MG008','MG009','MG010','MG013','MG019','MG020','MG021','MG026','MG033']

def read(n): return json.loads((ROOT / n).read_text())
def digest(v): return hashlib.sha256(json.dumps(v, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
def key(v): return ''.join(c for c in unicodedata.normalize('NFKC', v).casefold() if c.isalnum())
def module(n):
    spec = importlib.util.spec_from_file_location(n.replace('-', '_'), ROOT / n)
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m

def validate(p, d, s, rs):
    count = 0
    def require(ok, message):
        nonlocal count
        count += 1
        if not ok: raise AssertionError(message)
    require(p['job'] == 'B03' and p['status'] == 'UNADOPTED_RESEARCH' and p['acceptedProductBaseline'] == BASELINE, 'Wrong status or accepted source parent')
    require(p['baselineDataSha256'] == digest(d) == DATA and p['baselineSourcesSha256'] == digest(s) == SOURCES and p['baselineReopensSha256Passes'] == [digest(x) for x in rs] == REOPENS, 'Premature adoption or old complete catalogue/source/A+B history changed')
    require(all(p[x] is False for x in ['acceptedProductRowsChanged','acceptedSourceRegistryChanged','acceptedQuotationHistoryChanged','fullCopyrightBodiesPublished']), 'Unreviewed adoption or full body publication')
    require(len(d['minigames']) == 132 and len(s['sources']) == 148 and sum(len(x['quotes']) for x in s['sources']) == 1951, 'Accepted row/source/quotation scope changed')
    for records in rs: require(len(records) == len({x['sourceId'] for x in records}) == 151, 'Complete accepted A/B history missing')
    by = {x['id']: x for x in s['sources']}; rows = {x['id']: x for x in d['minigames']}
    for source in s['sources']:
        require(source['uniqueQuotedWords'] == sum(len(t.split()) for t in {q['text'] for q in source['quotes']}) <= 200, 'Historical canonical-page quote budget altered')
    author = p['independentAuthor']
    require(author['sourceId'] == 'CEL_BLOG' and author['url'] == URL and author['publisherLineage'] == 'celstudios' and author['nativeVisibleAuthor'] == 'CelStudios', 'False source identity or independent author')
    require(author['profileURL'] == 'https://www.blogger.com/profile/13789188290026471568' and author['publishedDate'] == '2024-10-20', 'Native author profile or publication date changed')
    require(by['W_LIST']['publisherLineage'] == 'mariowiki' != author['publisherLineage'], 'One publisher lineage counted twice')
    captures = p['actualCaptures']; cap = {(x['sourceId'], x['pass']): x for x in captures}
    wanted_sources = {'CEL_BLOG','W002','W005','W008','W009','W010','W013','W016','W019','W020','W021','W026','W033'}
    require(len(captures) == len(cap) == p['actualNewHttpRequests'] == 26 and {x['sourceId'] for x in captures} == wanted_sources, 'Invented, duplicate or omitted finite source requests')
    for sid in wanted_sources:
        pair = [cap[(sid, n)] for n in [1,2]]
        for c in pair:
            require(c['url'] == (URL if sid == 'CEL_BLOG' else by[sid]['url']), 'Wrong actual source URL')
            require(c['actualTransportPassed'] and c['curlExitCode'] == 0 and c['httpEffectiveTls'] == ['200',c['url'],'0'] and c['tlsVerificationDisabled'] is False, 'Failed or insecure transport accepted')
            require(c['bodyReceived'] and c['bodyBytes'] > 1000 and c['scopePresent'] and c['textCharacters'] > 1000 and all(re.fullmatch('[0-9a-f]{64}',c[x]) for x in ['bodySha256','textSha256']), 'Short, absent or unbound full response scope')
        require(datetime.fromisoformat(pair[1]['startedUTC']) > datetime.fromisoformat(pair[0]['completedUTC']), 'Second source pass preceded first closure')
    closures = p['actualCollectorClosures']
    require([x['actualRequests'] for x in closures] == [2,24] and all(x['event'] == 'CLOSED' and x['allOwnedFiniteCurlProcessesNaturallyClosed'] for x in closures), 'Incomplete owned finite collector')
    require(all(x['actualSuccessful200TLS'] == x['actualRequests'] for x in closures), 'Failed source counted as received')
    scopes = p['completeArticleScopes']
    require(len(scopes) == 2 and scopes[0]['fullArticleSha256'] == scopes[1]['fullArticleSha256'] == 'bc2d31c7452fe43211d93e05d51844334b8f14edd485803d7d9bdf8c468b85a0', 'Complete authored article replaced by excerpt')
    members = ['Burning Bridges','Castle Hassle','Sleight Of Shell','Fire Away','The Floor Is Falling']
    for n, scope in enumerate(scopes,1):
        require(scope['pass'] == n and scope['selector'] == '.post-body' and scope['fullArticleCharacters'] == cap[('CEL_BLOG',n)]['textCharacters'] == 56574 and scope['fullArticleSha256'] == cap[('CEL_BLOG',n)]['textSha256'], 'Actual full article scope differs')
        require(scope['nativeAuthorWitness'] == [{'text':'CelStudios','profileURL':author['profileURL'],'selector':'[rel=author].profile-name-link'}], 'Empty post-author element substituted for actual visible profile')
        require(scope['literalCategoryHeading'] == 'Survivathon' and scope['categoryMembers'] == members, 'Generic heading, missing literal member or guessed spelling')
        require([x['id'] for x in scope['namedParagraphs']] == IDS and all(x['fullParagraphCharacters'] > 100 and re.fullmatch('[0-9a-f]{64}',x['fullParagraphSha256']) for x in scope['namedParagraphs']), 'Incomplete named original paragraph scope')
    require(scopes[0]['namedParagraphs'] == scopes[1]['namedParagraphs'], 'Second complete original paragraph scope changed')
    primary = p['retainedWikiMembershipScope']
    require(primary['actualFreshHttpRequests'] == 0 and primary['fullPairedPrivateBodiesRehashed'], 'Historical full Wiki source misrepresented as fresh request')
    require(len(primary['scopes']) == 2, 'Second original Wiki list scope missing')
    for w in primary['scopes']:
        require(w['originalFullRowCount'] == 132 and w['originalFull132MemberScopeSha256'] == '678b0ce991b009dba6548dd04fc1bec662d24a5a38f33cff10d0e30fd7665e41' and w['historicalNativeBodyPhysicallyRehashed'], 'Original complete132-member scope changed')
        require(w['literalHeading'] == 'Survivathon Minigames' and len(w['memberships']) == 5 and {key(x['name']) for x in w['memberships']} == set(map(key,members)), 'Primary literal category membership does not agree')
        require(w['httpEffectiveTls'] == ['200',by['W_LIST']['url'],'0'] and w['curlExit'] == 0, 'Historical Wiki transport altered')
        require(all(x['categoryPath'] == ['Koopathlon Minigames','Survivathon Minigames'] and x['categoryAnchor'] == 'Survivathon_Minigames' for x in w['memberships']), 'Coin/subdivision guessed from generic Koopathlon heading')
    categories = p['categoryCandidates']
    require(len(categories) == 5 and len({x['id'] for x in categories}) == 5, 'Candidate category scope differs')
    for c in categories:
        row = rows[c['id']]
        require(c['status'] == 'UNADOPTED' and row['name'] == c['name'] and key(c['name']) in set(map(key,members)) and row['category'] == c['category'], 'Premature category adoption or guessed alias')
        require(c['currentCategoryEvidence'] == row['fieldEvidence']['category'] and c['currentCategoryEvidence']['status'] == 'single_source' and c['requiresExactCurrentBaselineRecoveryBeforeAdoption'], 'Current category evidence changed or recovery bypassed')
    candidates = p['gameplayCandidates']
    require([x['id'] for x in candidates] == IDS and len(candidates) == 11, 'Duplicate, missing or excluded-motion gameplay candidate')
    for c in candidates:
        row = rows[c['id']]; sid = c['primarySourceId']
        require(c['status'] == 'UNADOPTED' and row['name'] == c['name'] and key(c['sourceName']) == key(row['name']) and by[sid]['publisherLineage'] == 'mariowiki', 'Premature action adoption, guessed alias or wrong primary lineage')
        require(c['currentSummary'] == row['summary'] and c['currentGameplayEvidence'] == row['fieldEvidence']['gameplay'] and c['currentGameplayEvidence']['status'] == 'single_source' and c['requiresExactCurrentBaselineRecoveryBeforeAdoption'], 'Unreviewed summary/evidence change or already supported action recounted')
        require(6 <= len(c['authorQuote']['text'].split()) <= 25 and len(re.split(r'(?<=[.!?])\s+(?=[A-Z])',c['proposedTwoSentenceSummary'])) == 2, 'Non-substantive, overlong quote or summary scope')
        require(len(c['primaryScopes']) == 2, 'Incomplete fresh primary scope')
        for n,z in enumerate(c['primaryScopes'],1):
            actual = cap[(sid,n)]
            require(z['pass'] == n and z['fullScopeSelector'] == '#mw-content-text' and z['textSha256'] == actual['textSha256'] and z['textCharacters'] == actual['textCharacters'], 'Full primary article replaced by snippet')
            require(z['registeredQuoteIdsRecovered'] == [x['id'] for x in by[sid]['quotes']] and z['registeredQuoteIdsNotRecovered'] == [] and z['controllerImageLabelScopeReread'], 'Original primary quotation/control history lost')
        require(c['primaryScopes'][0]['textSha256'] == c['primaryScopes'][1]['textSha256'], 'Paired complete primary scope differs')
        if c['possibleAdditionalPrimaryClip']: require(len(c['possibleAdditionalPrimaryClip'].split()) <= 25, 'Additional candidate primary quote over budget')
    require(author['quotedWordsIncludingHeading'] == 1 + sum(len(c['authorQuote']['text'].split()) for c in candidates) == 122 <= 150, 'Shared canonical-page review quote budget changed')
    require('MG016' in p['excluded'] and 'nineCoinSubcategories' in p['excluded'] and len(p['excluded']['bareParagraphExcluded']) == 8, 'Unsupported motion/category/anonymous paragraphs promoted')
    require(sum(e['status'] == 'corroborated' for r in d['minigames'] for e in r['fieldEvidence'].values()) == 321 and all(r['complete'] is False for r in d['minigames']), 'False current gain or whole-row completion')
    require(digest(p) == PACKET, 'Retained actual complete capture and review packet changed')
    return count

def run():
    p, d, s = read('reports/original-review-candidates.json'), read('minigames.json'), read('catalogue-sources.json')
    rs = [read('reports/source-reopens-pass'+n+'.json') for n in 'AB']
    if (ROOT/'reports/original-review-recovery.json').exists():
        d,s,rs = module('check-original-review-recovery.py').historical_view(d,s,rs)
    count = validate(p,d,s,rs)
    for n in range(12):
        a,b,c,e = copy.deepcopy([p,d,s,rs])
        if n == 0: b['minigames'][1]['fieldEvidence']['gameplay']['status'] = 'corroborated'
        elif n == 1: a['independentAuthor']['publisherLineage'] = 'mariowiki'
        elif n == 2: a['completeArticleScopes'][1]['categoryMembers'].pop()
        elif n == 3: a['actualCaptures'][0]['httpEffectiveTls'][0] = '402'
        elif n == 4: a['actualCaptures'][1]['startedUTC'] = a['actualCaptures'][0]['startedUTC']
        elif n == 5: a['gameplayCandidates'][0]['authorQuote']['text'] = 'An incomplete fragment'
        elif n == 6: a['gameplayCandidates'][0]['primaryScopes'][1]['registeredQuoteIdsRecovered'].pop()
        elif n == 7: a['gameplayCandidates'][0]['sourceName'] = 'Unproved alias'
        elif n == 8: a['fullCopyrightBodiesPublished'] = True
        elif n == 9: a['excluded'].pop('MG016')
        elif n == 10: e[1].pop()
        elif n == 11: a['actualCollectorClosures'][1]['event'] = 'RUNNING'
        try: validate(a,b,c,e)
        except (AssertionError, KeyError, ValueError): pass
        else: raise AssertionError('Malformed or prematurely promoted original review candidate accepted')
    return [{'name':'Complete independent original review and actual26 paired requests preserve accepted132-row148-source1951-quote A+B history', 'caseCount':count,'passed':True,'seed':None},{'name':'Twelve original review candidate negatives reject adoption lineage member pass quote control alias motion transport and collector defects','caseCount':12,'passed':True,'seed':None}]

if __name__ == '__main__': print(json.dumps(run(),indent=2))
