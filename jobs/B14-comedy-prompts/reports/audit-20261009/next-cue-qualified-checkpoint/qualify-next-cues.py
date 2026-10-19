"""Read original full captures and qualify six narrow facts/nine exact rows.

This does not fetch, normalize away input differences, alter prompt words or
grant whole-pack readiness. Legacy HTTP redirect captures stay unadopted.
"""
from pathlib import Path
from html.parser import HTMLParser
from bs4 import BeautifulSoup
from jsonschema import Draft202012Validator
import datetime
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parent
JOB = Path('/tmp/gpt-drops-B14-audit-20261009/jobs/B14-comedy-prompts')
CAP = ROOT / 'cue-captures'
OLD = Path('/tmp/gpt-drops-B14-audit-20261009/.work/20261009-audit/cue-captures')
RETAIL = Path('/dev/shm/gpt-drops-B14-research-20261009/cue-captures')
sha = lambda b: hashlib.sha256(b).hexdigest()
load = lambda p: json.loads(p.read_bytes())
old_facts = load(JOB / 'reports/audit-20261009/verified-initial-cues.json')
assert len(old_facts) == 15
transports = [load(ROOT / n) for n in ['NEXT-CUE-TWO-PASS-TRANSPORT.json', 'NEXT-CUE-HTTPS-FALLBACK-TRANSPORT.json', 'NEXT-CUE-BURGER-TWO-PASS-TRANSPORT.json']]
receipts = [r for t in transports for r in t['receipts']]
sources = {s[0]: s for t in transports for s in t['sources']}

class Visible(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ignore = 0
        self.parts = []
    def handle_starttag(self, tag, attrs):
        if tag in ['script', 'style', 'noscript']:
            self.ignore += 1
    def handle_endtag(self, tag):
        if tag in ['script', 'style', 'noscript']:
            self.ignore = max(0, self.ignore - 1)
    def handle_data(self, text):
        if not self.ignore:
            self.parts.append(text)

quotes = {
    'netflix-still-primary': 'Netflix asks, "Are you still watching ...?"',
    'netflix-still-howto': 'You will then be asked, "Are you still watching?"',
    'netflix-profile-primary': 'People who live together in a single household can have their own personalized Netflix experience.',
    'netflix-profile-howto': "Here's how to improve recommendations for everyone with user profiles.",
    'netflix-skip-primary-https': "Nowadays, it's hard to imagine streaming your favorite series without using the 'Skip Intro' button.",
    'netflix-skip-verge': 'Netflix is testing a button that lets you skip the opening credits on some television shows, the company said.',
    'bk-crown-primary': 'places the crown on its Guests',
    'bk-crown-tasting': 'By 2004, the character was portrayed by a human actor in a costume featuring a giant plastic head and a golden crown.',
    'wendy-roast-primary': 'Every year we invite our fans to get roasted by @Wendys',
    'wendy-roast-dailydot': "We'll roast you, but with a wink. It's all in good fun!",
    'wendy-burger-primary': 'Our Burgers Are Crave Worthy',
    'wendy-burger-tasting': "It also recently overtook Wendy's to become the second-largest fast-food burger chain in America, behind only McDonald's.",
}
aliases = {'wendy-burger-tasting': 'bk-crown-tasting'}
authors = {
    'netflix-still-primary': ('Netflix Help Center corporate authorship', 'Netflix', 'Netflix'),
    'netflix-still-howto': ('Vann Vicente, How-To Geek original explanatory article, 2020', 'How-To Geek / Vann Vicente', 'Vann Vicente'),
    'netflix-profile-primary': ('Netflix Help Center corporate authorship', 'Netflix', 'Netflix'),
    'netflix-profile-howto': ('Jason Fitzpatrick, How-To Geek original profile tutorial, 2017', 'How-To Geek / Jason Fitzpatrick', 'Jason Fitzpatrick'),
    'netflix-skip-primary-https': ('Cameron Johnson, Netflix Director of Product Innovation, original firsthand product account, 2022', 'Netflix', 'Cameron Johnson'),
    'netflix-skip-verge': ('Casey Newton, The Verge original report with Netflix spokesperson comment, 2017', 'The Verge / Casey Newton', 'Casey Newton'),
    'bk-crown-primary': ('Burger King corporate newsroom, original 2026 campaign announcement', 'Burger King', 'Burger King Corporation'),
    'bk-crown-tasting': ('Catherine Brookes, Tasting Table original historical feature, 2026', 'Tasting Table / Catherine Brookes', 'Catherine Brookes'),
    'wendy-roast-primary': ("Wendy's corporate blog, original dated 2021 Roast Day account", "Wendy's", 'Quality Is Our Recipe'),
    'wendy-roast-dailydot': ('David Covucci, The Daily Dot original interview with Amy Brown and Brandon Rhoten, 2017, retained 2018 editorial update', 'The Daily Dot / David Covucci', 'David Covucci'),
    'wendy-burger-primary': ("Wendy's original corporate burger-product page", "Wendy's", 'Quality Is Our Recipe'),
}
physical = {}
article_rechecks = {}
def citation(key):
    sid = aliases.get(key, key)
    quote = quotes[key]
    assert 0 < len(quote.split()) <= 25
    passes = []
    fulltexts = []
    for n in [1, 2]:
        matches = [r for r in receipts if r['sourceId'] == sid and r['pass'] == n]
        assert len(matches) == 1
        r = matches[0]
        raw = (CAP / (sid + '-pass' + str(n) + '.html')).read_bytes()
        text = (CAP / (sid + '-pass' + str(n) + '.txt')).read_text()
        assert r['success'] and r['actualHTTP200FullBody']
        assert r['url'].startswith('https://') and r['finalURL'].startswith('https://'), sid
        assert len(raw) == r['rawBytes'] and sha(raw) == r['rawSha256']
        assert len(text) == r['visibleCharacters'] and sha(text.encode()) == r['visibleSha256']
        parsed = Visible(); parsed.feed(raw.decode('utf8', errors='replace'))
        assert re.sub(r'\s+', ' ', ' '.join(parsed.parts)).strip() == text
        assert authors[sid][2] in text and quote in text, (sid, quote)
        soup = BeautifulSoup(raw, 'html.parser')
        if sid in ['netflix-still-howto', 'netflix-profile-howto', 'netflix-skip-verge', 'bk-crown-tasting']:
            native_authors = [x.get('content') or x.get_text(' ', strip=True) for x in soup.select('meta[name="author"],meta[property="article:author"],[rel="author"],.byline')]
            assert any(authors[sid][2] in x for x in native_authors), sid
        elif sid == 'wendy-roast-dailydot':
            assert any(x.get('href') == '/author/david-covucci' and x.get_text(' ', strip=True) == 'David Covucci' for x in soup.select('a'))
            assert 'What follows is a conversation with Brown about her brilliant burn.' in text
            assert 'This interview has been lightly edited for clarity.' in text
            assert "The original story appears below." in text
        elif sid == 'netflix-skip-primary-https':
            assert 'Cameron Johnson Director, Product Innovation' in text
            assert '17 March 2022' in text
        assert r['openedUTC'] < r['closedUTC']
        physical[(sid, n)] = {'sourceId': sid, 'pass': n, 'rawSha256': sha(raw), 'visibleSha256': sha(text.encode()), 'originalRequestedURL': r['url'], 'actualFinalURL': r['finalURL'], 'originalFullBodyReparsedUnchanged': True}
        passes.append({'pass': n, 'actualHTTP200FullBody': True, 'rawBytes': len(raw), 'rawSha256': sha(raw), 'visibleCharacters': len(text), 'visibleSha256': sha(text.encode()), 'literalQuoteOffset': text.index(quote), 'quoteExactInFullText': True, 'openedUTC': r['openedUTC'], 'closedUTC': r['closedUTC']})
        fulltexts.append(text)
    first, second = [r for r in receipts if r['sourceId'] == sid]
    assert first['openedUTC'] != second['openedUTC'] and first['finalURL'] == second['finalURL']
    if sid in ['netflix-still-howto', 'netflix-profile-howto']:
        end = 'Google is updating how articles are shown.'
        assert all(t.count(end) == 1 for t in fulltexts)
        a, b = [t.split(end)[0] for t in fulltexts]
        assert a == b and quote in a
        article_rechecks[sid] = {'actualEntireBylineAndAuthoredArticlePrefixUnchanged': True, 'originalCompleteArticlePrefixCharacters': len(a), 'originalCompleteArticlePrefixSha256': sha(a.encode()), 'explicitFollowingSiteNoticeMarker': end, 'fullPhysicalVisibleBodiesDifferOnlyAfterAuthoredArticle': fulltexts[0] != fulltexts[1], 'bothOriginalFullBodiesAndSeparateHashesPreserved': True}
    else:
        assert fulltexts[0] == fulltexts[1], sid
    return {'sourceId': sid, 'url': first['finalURL'], 'author': authors[sid][0], 'independentAuthorGroup': authors[sid][1], 'role': sources[sid][3], 'quote': quote, 'quoteWords': len(quote.split()), 'fullPasses': passes}

definitions = [
    ('CUE-016', 'Netflix has an Are you still watching? viewing prompt. Only that question/feature association is qualified; numeric triggering, device timing, disabling instructions and exact punctuation are not claimed.', ['Q0003'], ['netflix-still-primary', 'netflix-still-howto'], ['NETFLIX-STILL-WATCHING-TRIGGER-VERSION'], 'medium'),
    ('CUE-017', 'Netflix has personalized user profiles. This does not assert a particular number of profiles, a universal account-sharing entitlement, extra-member terms or permission for a ghost to rent an account.', ['M1003'], ['netflix-profile-primary', 'netflix-profile-howto'], ['NETFLIX-PROFILE-HOUSEHOLD-SCOPE'], 'high'),
    ('CUE-018', 'Netflix has a Skip Intro button associated with skipping opening credits. The 2017 original report was an initial test; the 2022 firsthand product retrospective establishes the later feature. Availability on every title/platform, precise dates, usage counts and skipping real wedding vows are not claimed.', ['Q1003'], ['netflix-skip-primary-https', 'netflix-skip-verge'], ['NETFLIX-SKIP-INTRO-HISTORICAL-ROLLOUT', 'NETFLIX-LEGACY-HTTP-REDIRECT'], 'high'),
    ('CUE-019', 'Burger King has crown imagery in its branding/marketing, documented by a dated original mascot history and current corporate campaign. This establishes the crown association, not universal free paper-crown availability, a currently active King mascot or any legal/royal authority.', ['M0031', 'M0602', 'Q0602'], ['bk-crown-primary', 'bk-crown-tasting'], ['BURGER-KING-CROWN-ASSOCIATION-SCOPE'], 'medium'),
    ('CUE-020', "Wendy's has a social-media roasting/insult association, supported by its dated original Roast Day account and an independently reported original interview. This does not assert a current platform policy, 2026 event date or an actual divorce/obituary/condolence writing service.", ['M0040', 'M0603', 'Q0040'], ['wendy-roast-primary', 'wendy-roast-dailydot'], ['WENDYS-ROAST-DATED-PLATFORM-SCOPE'], 'high'),
    ('CUE-021', "Wendy's has a burger-food association. Its current corporate food page and the independent original feature's comparison of burger chains support this association only; rankings, freshness in every region, patties/amounts and any obituary service are not claimed.", ['M0603'], ['wendy-burger-primary', 'wendy-burger-tasting'], ['WENDYS-BURGER-RANKING-REGIONAL-SCOPE'], 'high'),
]
new = []
for fid, claim, ids, srcs, conflicts, confidence in definitions:
    citations = [citation(key) for key in srcs]
    assert len({s['independentAuthorGroup'] for s in citations}) == 2
    new.append({'id': fid, 'status': 'VERIFIED', 'claim': claim, 'promptIds': ids, 'confidence': confidence, 'confidenceReason': 'Two distinct corporate/editorial authors were personally read in both complete original captures. Only the stated association is qualified; dated UI, device, household, marketing, regional and service limits remain explicit.', 'sources': citations, 'conflictIds': conflicts})
facts = old_facts + new
assert len(facts) == 21
schema = load(JOB / 'reports/audit-20261009/verified-initial-cues.schema.json')
Draft202012Validator(schema).validate(facts)
quote_ledger = {}
capture_checks = 0
for fact in facts:
    for s in fact['sources']:
        quote_ledger.setdefault(s['url'], set()).add(s['quote'])
        roots = [root for root in [CAP, RETAIL, OLD] if (root / (s['sourceId'] + '-pass1.html')).exists()]
        assert len(roots) == 1, s['sourceId']
        for r in s['fullPasses']:
            raw = (roots[0] / (s['sourceId'] + '-pass' + str(r['pass']) + '.html')).read_bytes()
            text = (roots[0] / (s['sourceId'] + '-pass' + str(r['pass']) + '.txt')).read_text()
            assert len(raw) == r['rawBytes'] and sha(raw) == r['rawSha256']
            assert len(text) == r['visibleCharacters'] and sha(text.encode()) == r['visibleSha256']
            assert text[r['literalQuoteOffset']:r['literalQuoteOffset'] + len(s['quote'])] == s['quote']
            capture_checks += 1
assert capture_checks == 84 and len(physical) == 22
assert all(sum(len(q.split()) for q in values) <= 200 for values in quote_ledger.values())
classifications = {
    'M1003': (['CUE-017'], 'The Netflix personalized-profile association is sourced. Charging a ghost rent for using a profile is this specific invented adult-party situation, not an account-sharing permission, actual rental service or reported supernatural event.'),
    'Q0003': (['CUE-016'], 'The Netflix still-watching question/feature association is sourced. Asking the question during a funeral is a specifically imagined setting; exact device triggers, punctuation and policy are not asserted.'),
    'Q1003': (['CUE-018'], 'The Netflix Skip Intro/opening-credit association is sourced. Skipping from wedding vows to the punchline is a specifically imagined use of the feature, not a promised capability for real weddings or every video/title.'),
    'M0031': (['CUE-019'], 'Burger King crown imagery/marketing is sourced. Wearing an imagined brand crown at an adult bankruptcy hearing is the authored scenario; availability of a free paper hat or legal/royal authority is not asserted.'),
    'M0602': (['CUE-019'], 'Burger King crown imagery/marketing is sourced. Wearing the crown while demanding diplomatic immunity is an invented adult-party action; the prompt does not endorse or establish legal immunity or actual royalty.'),
    'Q0602': (['CUE-019'], 'Burger King crown imagery/marketing is sourced. Admission as throne-seizure evidence is an invented legal/royal scenario, not an actual evidentiary ruling or brand-provided legal authority.'),
    'M0040': (['CUE-020'], "Wendy's social-media roasting/insult association is sourced. Asking the brand to write a divorce announcement is a specific imagined adult-party action, not an actual announcement-writing service or current response guarantee."),
    'M0603': (['CUE-020', 'CUE-021'], "Both Wendy's social-media roasting and burger-food associations are separately sourced. Roasting an obituary instead of the burger is a specific wordplay situation; no real obituary service, burger cooking method, ranking or universal freshness claim is made."),
    'Q0040': (['CUE-020'], "Wendy's social-media roasting/insult association is sourced. An insult on a condolence card is the authored adult-party setting, not a real condolence service or actual reported death."),
}
expected_texts = {
    'M1003': "Who's most likely to charge the ghost rent for using their Netflix profile?",
    'Q0003': "Netflix's cruelest feature: asking if you're still ___ during a funeral.",
    'Q1003': "Netflix's Skip Intro button jumped straight from the wedding vows to ___.",
    'M0031': "Who's most likely to wear a Burger King crown to a bankruptcy hearing?",
    'M0602': "Who's most likely to wear a Burger King crown while demanding diplomatic immunity?",
    'Q0602': 'The Burger King crown was admitted as evidence that ___ had seized the throne.',
    'M0040': "Who's most likely to ask Wendy's to write the divorce announcement?",
    'M0603': "Who's most likely to ask Wendy's to roast the obituary instead of the burger?",
    'Q0040': "Wendy's most devastating insult to put on a condolence card: ___.",
}
review = load(JOB / 'research-review.json')
proof = load(JOB / 'research-second-pass.json')
prompts = {p['id']: p for p in load(JOB / 'prompts.json')}
assert review['selectedSha256'] == sha((JOB / 'prompts.json').read_bytes())
assert sum(r['status'] == 'VERIFIED' for r in review['rows']) == len(proof['rows']) == 21
fact_by = {f['id']: f for f in facts}
now = datetime.datetime.now(datetime.timezone.utc).isoformat()
for row in review['rows']:
    if row['promptId'] in classifications:
        assert row['status'] == 'UNVERIFIED'
        assert prompts[row['promptId']]['text'] == expected_texts[row['promptId']]
        ids, reason = classifications[row['promptId']]
        row.update(status='VERIFIED', allActualCuesReviewed=True, verifiedFactIds=ids, coverageReason=reason)
        checks = []
        for fid in ids:
            for s in fact_by[fid]['sources']:
                a, b = s['fullPasses']
                checks.append({'factId': fid, 'sourceId': s['sourceId'], 'url': s['url'], 'independentAuthorGroup': s['independentAuthorGroup'], 'actualBothCapturedBodiesAndExactQuoteOffsetsRechecked': True, 'firstOpenedUTC': a['openedUTC'], 'secondOpenedUTC': b['openedUTC'], 'secondClosedUTC': b['closedUTC'], 'secondRawSha256': b['rawSha256'], 'secondVisibleSha256': b['visibleSha256']})
        proof['rows'].append({'promptId': row['promptId'], 'actualFullText': prompts[row['promptId']]['text'], 'textSha256': row['textSha256'], 'status': 'VERIFIED', 'allActualCuesReviewed': True, 'factIds': ids, 'cueAndCreativeClassification': reason, 'researchConfidence': 'medium' if any(fact_by[f]['confidence'] == 'medium' for f in ids) else 'high', 'sourceReopeningChecks': checks, 'actualRowCheckedUTC': now})
assert sum(r['status'] == 'VERIFIED' for r in review['rows']) == len(proof['rows']) == 30
fact_bytes = (json.dumps(facts, ensure_ascii=False, indent=2) + '\n').encode()
proof.update(actualClosedUTC=now, actualCompleteReviewedRows=30, stillUnverifiedRows=1170, qualifiedFactsSha256=sha(fact_bytes), wholePackReady=False, scope='30 specifically reviewed whole rows only. Twenty-one limited facts do not qualify every row. Numeric Netflix timing, sharing rights, rollout counts, free Burger King paper hats and real announcement services remain unqualified. No prompt word or original humor grade changed.')
for name, data in [('verified-initial-cues.json', facts), ('research-review.json', review), ('research-second-pass.json', proof)]:
    (ROOT / ('PROPOSED-' + name)).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
receipt = {'actualClosedUTC': now, 'originalFactsRechecked': 15, 'newLimitedFactsQualified': 6, 'combinedFacts': 21, 'newEntireRowsQualified': 9, 'combinedQualifiedRows': 30, 'stillUnverifiedRows': 1170, 'all84FactSpecificFullCaptureHashAndExactQuoteChecks': capture_checks == 84, 'newUniqueOriginalFullCapturesChecked': len(physical), 'allNewCapturedVisibleBodiesReparsedUnchanged': True, 'actualCanonicalURLsAndRedirectLimits': list(physical.values()), 'canonicalQuoteWordsAcrossAllFacts': {u: sum(len(q.split()) for q in values) for u, values in quote_ledger.items()}, 'maximumExcerptWords': max(s['quoteWords'] for f in facts for s in f['sources']), 'fullSecondPassArticleGuards': article_rechecks, 'legacyHTTPRedirectCapturesExcluded': ['netflix-skip-primary-pass1.html', 'netflix-skip-primary-pass2.html'], 'wholePackReady': False, 'formalKEEP': 0, 'productionPromptOrGradeChanges': 0}
(ROOT / 'SIX-NEXT-FACTS-NINE-ROWS-ACTUAL-ACCEPTANCE.json').write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({k:v for k,v in receipt.items() if k not in ['actualCanonicalURLsAndRedirectLimits', 'canonicalQuoteWordsAcrossAllFacts', 'fullSecondPassArticleGuards']}, ensure_ascii=False))
