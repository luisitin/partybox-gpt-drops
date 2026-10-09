"""Accept original captured retail sources and eight specifically read rows.

This never fetches, rewrites a source body, changes a prompt or grants readiness.
Q1033's exact old UI labels remain unverified despite its tracking association.
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
OLD = Path('/tmp/gpt-drops-B14-audit-20261009/.work/20261009-audit/cue-captures')
CAP = ROOT / 'cue-captures'
sha = lambda b: hashlib.sha256(b).hexdigest()
load = lambda p: json.loads(p.read_bytes())
original_facts = load(JOB / 'reports/audit-20261009/verified-initial-cues.json')
assert len(original_facts) == 9
transports = [load(ROOT / n) for n in ['RETAIL-CUE-TWO-PASS-TRANSPORT.json', 'RETAIL-SUPPLEMENTAL-TWO-PASS-TRANSPORT.json']]
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

quotes = load(ROOT / 'RETAIL-EXACT-QUOTES-UNADOPTED.json')
authors = {
    'ikea-museum': ('IKEA Museum / Inter IKEA corporate authorship', 'Inter IKEA', 'Inter IKEA Systems'),
    'ikea-zhuang': ('Justin Zhuang, original personal-site design article', 'Justin Zhuang', 'Justin Zhuang'),
    'ikea-hemnes-bed-official': ('IKEA / Inter IKEA current product-category catalogue', 'Inter IKEA', 'Inter IKEA Systems'),
    'costco-funeral-official': ('Costco Wholesale corporate authorship', 'Costco Wholesale', 'Costco Wholesale'),
    'costco-receipts-official': ('Costco customer-service corporate authorship', 'Costco Wholesale', 'Costco'),
    'costco-membership-official': ('Costco Wholesale membership-page corporate authorship', 'Costco Wholesale', 'Costco Wholesale'),
    'costco-washpost': ('Tiffany Montgomery, The Washington Post', 'The Washington Post / Tiffany Montgomery', 'Tiffany Montgomery'),
    'costco-sfgate': ('Amy Graff, SFGATE, original reported interview', 'SFGATE / Amy Graff', 'Amy Graff'),
    'dominos-us-2026-official': ("Domino's Pizza corporate press-release authorship", "Domino's Pizza", "SOURCE Domino's Pizza"),
    'dominos-mel': ('Brian VanHooker, MEL Magazine, original firsthand report', 'MEL Magazine / Brian VanHooker', 'Brian VanHooker'),
}
physical = {}
def citation(key):
    sid = quotes['sourceAliases'].get(key, key)
    quote = quotes['quotes'][key]
    assert 0 < len(quote.split()) <= 25
    passes = []
    for n in [1, 2]:
        matches = [r for r in receipts if r['sourceId'] == sid and r['pass'] == n]
        assert len(matches) == 1
        r = matches[0]
        raw = (CAP / (sid + '-pass' + str(n) + '.html')).read_bytes()
        text = (CAP / (sid + '-pass' + str(n) + '.txt')).read_text()
        assert r['success'] and r['actualHTTP200FullBody']
        assert len(raw) == r['rawBytes'] and sha(raw) == r['rawSha256']
        assert len(text) == r['visibleCharacters'] and sha(text.encode()) == r['visibleSha256']
        parsed = Visible(); parsed.feed(raw.decode('utf8', errors='replace'))
        assert re.sub(r'\s+', ' ', ' '.join(parsed.parts)).strip() == text
        assert authors[sid][2] in text and quote in text
        if sid in ['costco-sfgate', 'costco-washpost', 'dominos-mel']:
            soup = BeautifulSoup(raw, 'html.parser')
            native_authors = [x.get('content') or x.get_text(' ', strip=True) for x in soup.select('meta[name="author"],meta[property="article:author"],[rel="author"],.byline')]
            assert any(authors[sid][2] in x for x in native_authors)
        assert r['openedUTC'] < r['closedUTC']
        physical[(sid, n)] = {'sourceId': sid, 'pass': n, 'rawSha256': sha(raw), 'visibleSha256': sha(text.encode()), 'originalRequestedURL': r['url'], 'actualFinalURL': r['finalURL'], 'originalFullBodyReparsedUnchanged': True}
        passes.append({'pass': n, 'actualHTTP200FullBody': True, 'rawBytes': len(raw), 'rawSha256': sha(raw), 'visibleCharacters': len(text), 'visibleSha256': sha(text.encode()), 'literalQuoteOffset': text.index(quote), 'quoteExactInFullText': True, 'openedUTC': r['openedUTC'], 'closedUTC': r['closedUTC']})
    first, second = [r for r in receipts if r['sourceId'] == sid]
    assert first['openedUTC'] != second['openedUTC']
    assert first['finalURL'] == second['finalURL']
    return {'sourceId': sid, 'url': first['finalURL'], 'author': authors[sid][0], 'independentAuthorGroup': authors[sid][1], 'role': sources[sid][3], 'quote': quote, 'quoteWords': len(quote.split()), 'fullPasses': passes}

definitions = [
    ('CUE-010', 'IKEA has a self-assembly furniture/instruction/Allen-hex-key association. This does not assert coffin products, custody proceedings or every furniture item requiring a key.', ['M0001', 'Q0001'], ['ikea-museum', 'ikea-zhuang-key'], ['IKEA-FICTIONAL-SERVICES']),
    ('CUE-011', 'IKEA is associated with beds and bed frames: its current product catalogue lists Beds and mattresses, while the independent original article discusses an earlier HEMNES bed frame. No current HEMNES availability or repossession service is asserted.', ['M1001'], ['ikea-hemnes-bed-official', 'ikea-zhuang-bed'], ['IKEA-PRODUCT-REDIRECT', 'IKEA-FICTIONAL-SERVICES']),
    ('CUE-012', 'Costco has a casket-sale association, documented by its current ordering FAQ and an independently reported 2005 account. This does not assert a funeral-director service, funeral package, universal stock or a particular coffin membership reward.', ['M0002', 'Q0002', 'Q1002'], ['costco-funeral-official', 'costco-washpost-caskets'], ['COSTCO-FUNERAL-SERVICE-LIMIT', 'COSTCO-HISTORICAL-OFFERING']),
    ('CUE-013', 'Costco warehouse exits use receipt checking to compare purchases/items. This does not assert checking coffins or a universal refund/charge guarantee.', ['Q1002'], ['costco-receipts-official', 'costco-sfgate'], []),
    ('CUE-014', 'Costco is a membership retail warehouse. The original current membership page and independent reported article support this association, without a specific perk amount, casket reward or universal membership rule.', ['M0002'], ['costco-membership-official', 'costco-washpost-membership'], ['COSTCO-HISTORICAL-OFFERING']),
    ('CUE-015', "Domino's offers pizza-order/delivery tracking with preparation and oven phases. The independent firsthand 2019 report and corporate 2026 update establish the tracking association, without accuracy guarantees or unchanged UI labels.", ['M0033', 'Q0033', 'Q1033'], ['dominos-us-2026-official', 'dominos-mel'], ['DOMINOS-TRACKER-STAGE-VERSION', 'DOMINOS-ONE-STORE-ACCURACY']),
]
new = []
for fid, claim, ids, srcs, conflicts in definitions:
    citations = [citation(key) for key in srcs]
    assert len({s['independentAuthorGroup'] for s in citations}) == 2
    new.append({'id': fid, 'status': 'VERIFIED', 'claim': claim, 'promptIds': ids, 'confidence': 'medium' if fid in ['CUE-011', 'CUE-012', 'CUE-014'] else 'high', 'confidenceReason': 'Two genuinely distinct corporate/editorial authors were read in both original complete captures. Only the exact association is qualified; date, product-redirect, SKU and service limitations are preserved.', 'sources': citations, 'conflictIds': conflicts})
facts = original_facts + new
assert len(facts) == 15
schema = load(JOB / 'reports/audit-20261009/verified-initial-cues.schema.json')
Draft202012Validator(schema).validate(facts)
quote_ledger = {}
capture_checks = 0
for fact in facts:
    for s in fact['sources']:
        quote_ledger.setdefault(s['url'], set()).add(s['quote'])
        for r in s['fullPasses']:
            cap = CAP if s['sourceId'] in sources else OLD
            raw = (cap / (s['sourceId'] + '-pass' + str(r['pass']) + '.html')).read_bytes()
            text = (cap / (s['sourceId'] + '-pass' + str(r['pass']) + '.txt')).read_text()
            assert len(raw) == r['rawBytes'] and sha(raw) == r['rawSha256']
            assert len(text) == r['visibleCharacters'] and sha(text.encode()) == r['visibleSha256']
            assert text[r['literalQuoteOffset']:r['literalQuoteOffset'] + len(s['quote'])] == s['quote']
            capture_checks += 1
assert all(sum(len(q.split()) for q in values) <= 200 for values in quote_ledger.values())
classifications = {
    'M0001': (['CUE-010'], 'IKEA hex-key/self-assembly association is sourced. A custody battle over a tool is an invented adult-party situation, not an IKEA custody service or reported event.'),
    'Q0001': (['CUE-010'], 'IKEA illustrated self-assembly instruction association is sourced. The coffin and omitted instruction are specifically invented products/text in this joke; IKEA coffin availability is not asserted.'),
    'M1001': (['CUE-011'], 'IKEA bed/bed-frame product-category association is sourced. Repossessing an occupied bed while an adult ex sleeps is specifically imagined, not an actual IKEA debt-collection service; current availability of the redirected HEMNES item is not claimed.'),
    'M0002': (['CUE-012', 'CUE-014'], 'Costco casket retail and membership associations are sourced. Buying a personal coffin for perks is an invented adult motivation; no particular benefit, casket reward, expiry or current model/price is asserted.'),
    'Q0002': (['CUE-012'], 'Costco casket retail association is sourced. The new funeral package and suspicious quantity are explicitly invented comedic packaging; the actual corporate source excludes funeral-director services and supplies no such package.'),
    'Q1002': (['CUE-012', 'CUE-013'], 'Costco casket retail and receipt/item checking associations are independently sourced. A receipt checker counting items inside a coffin is an invented event, not a published Costco corpse-checking practice or guarantee.'),
    'M0033': (['CUE-015'], "Domino's order/delivery tracking association is sourced. Using it as an alibi is an imagined adult-party action, not legal proof or a guaranteed precise timing record."),
    'Q0033': (['CUE-015'], "Domino's pizza/order delivery association is sourced. A wrong delivery to a morgue and its explanation are invented, not a reported event or promised mortuary delivery service."),
}
assert len(classifications) == 8
review = load(JOB / 'research-review.json')
proof = load(JOB / 'research-second-pass.json')
prompts = {p['id']: p for p in load(JOB / 'prompts.json')}
assert review['selectedSha256'] == sha((JOB / 'prompts.json').read_bytes())
fact_by = {f['id']: f for f in facts}
now = datetime.datetime.now(datetime.timezone.utc).isoformat()
for row in review['rows']:
    if row['promptId'] in classifications:
        ids, reason = classifications[row['promptId']]
        row.update(status='VERIFIED', allActualCuesReviewed=True, verifiedFactIds=ids, coverageReason=reason)
        checks = []
        for fid in ids:
            for s in fact_by[fid]['sources']:
                a, b = s['fullPasses']
                checks.append({'factId': fid, 'sourceId': s['sourceId'], 'url': s['url'], 'independentAuthorGroup': s['independentAuthorGroup'], 'actualBothCapturedBodiesAndExactQuoteOffsetsRechecked': True, 'firstOpenedUTC': a['openedUTC'], 'secondOpenedUTC': b['openedUTC'], 'secondClosedUTC': b['closedUTC'], 'secondRawSha256': b['rawSha256'], 'secondVisibleSha256': b['visibleSha256']})
        proof['rows'].append({'promptId': row['promptId'], 'actualFullText': prompts[row['promptId']]['text'], 'textSha256': row['textSha256'], 'status': 'VERIFIED', 'allActualCuesReviewed': True, 'factIds': ids, 'cueAndCreativeClassification': reason, 'researchConfidence': 'medium' if any(fact_by[f]['confidence'] == 'medium' for f in ids) else 'high', 'sourceReopeningChecks': checks, 'actualRowCheckedUTC': now})
    elif row['promptId'] == 'Q1033':
        assert row['status'] == 'UNVERIFIED'
        row['coverageReason'] = "Tracking association CUE-015 is qualified, but exact historical Preparing/Baking UI labels require separate two-author scope. Current 2026 labels differ; Destroying Evidence is authored fiction. Whole row remains unverified."
assert sum(r['status'] == 'VERIFIED' for r in review['rows']) == len(proof['rows']) == 21
fact_bytes = (json.dumps(facts, ensure_ascii=False, indent=2) + '\n').encode()
proof.update(actualClosedUTC=now, actualCompleteReviewedRows=21, stillUnverifiedRows=1179, qualifiedFactsSha256=sha(fact_bytes), wholePackReady=False, scope='21 specifically reviewed whole rows only. Fifteen limited facts do not qualify every row. Q1033 exact older labels remain unverified. No prompt word or original humor grade changed.')
for name, data in [('verified-initial-cues.json', facts), ('research-review.json', review), ('research-second-pass.json', proof)]:
    (ROOT / ('PROPOSED-' + name)).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
receipt = {'actualClosedUTC': now, 'originalFactsRechecked': 9, 'newLimitedFactsQualified': 6, 'combinedFacts': 15, 'newEntireRowsQualified': 8, 'combinedQualifiedRows': 21, 'stillUnverifiedRows': 1179, 'all60FactSpecificFullCaptureHashAndExactQuoteChecks': capture_checks == 60, 'newUniqueOriginalFullCapturesChecked': len(physical), 'allNewCapturedVisibleBodiesReparsedUnchanged': True, 'actualCanonicalURLsAndRedirectLimits': list(physical.values()), 'canonicalQuoteWordsAcrossAllFacts': {u: sum(len(q.split()) for q in values) for u, values in quote_ledger.items()}, 'maximumExcerptWords': max(s['quoteWords'] for f in facts for s in f['sources']), 'wholePackReady': False, 'formalKEEP': 0, 'Q1033ExactOldUILabelsQualified': False, 'productionPromptOrGradeChanges': 0}
(ROOT / 'RETAIL-SIX-FACTS-EIGHT-ROWS-ACTUAL-ACCEPTANCE.json').write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({k:v for k,v in receipt.items() if k not in ['actualCanonicalURLsAndRedirectLimits', 'canonicalQuoteWordsAcrossAllFacts']}, ensure_ascii=False))
