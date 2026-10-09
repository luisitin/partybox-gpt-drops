"""Independently reparse actual full product captures and author exact row proposals.

No source capture, old record, candidate text, grade or gate is rewritten here.
Only narrow personally read facts and specifically classified whole rows qualify.
"""
import datetime
import hashlib
import json
import re
from pathlib import Path
from html.parser import HTMLParser
from bs4 import BeautifulSoup
from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parent
JOB = Path('/tmp/gpt-drops-B14-audit-20261009/jobs/B14-comedy-prompts')
CAP = ROOT / 'cue-captures'
CAPTURE_ROOTS = [
    CAP,
    Path('/dev/shm/gpt-drops-B14-next-cues-20261009/cue-captures'),
    Path('/dev/shm/gpt-drops-B14-research-20261009/cue-captures'),
    Path('/tmp/gpt-drops-B14-audit-20261009/.work/20261009-audit/cue-captures'),
]
sha = lambda b: hashlib.sha256(b).hexdigest()
load = lambda p: json.loads(p.read_bytes())
before = {str(p.relative_to(JOB)): sha(p.read_bytes()) for p in JOB.rglob('*')
          if p.is_file() and '.work' not in p.parts and '__pycache__' not in p.parts}
old_facts = load(JOB / 'reports/audit-20261009/verified-initial-cues.json')
old_review = load(JOB / 'research-review.json')
old_proof = load(JOB / 'research-second-pass.json')
assert len(old_facts) == 21
assert sum(r['status'] == 'VERIFIED' for r in old_review['rows']) == len(old_proof['rows']) == 30
transport = load(ROOT / 'PRODUCT-FRESH-TWO-PASS-TRANSPORT.json')
receipts = transport['receipts']
sources = {s[0]: s for s in transport['sources']}
assert len(receipts) == 28 and transport['allOwnedThreadsNaturallyClosed']
assert all(r['success'] and r['actualHTTP200FullBody'] for r in receipts)

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

authors = {
    'tide-guide-fresh': ('Procter & Gamble / Tide original stain-removal guide', 'Procter & Gamble / Tide', 'Procter & Gamble'),
    'tide-pods-fresh': ('Procter & Gamble / Tide original laundry-pac catalogue', 'Procter & Gamble / Tide', 'Procter & Gamble'),
    'tide-jeeves-fresh': ('Zach Pozniak, Jeeves NY original firsthand detergent test, explicitly distinguished from odor testing', 'Jeeves NY / Zach Pozniak', 'Zach Pozniak'),
    'febreze-primary-fresh': ('Procter & Gamble / Febreze original fabric-spray category page', 'Procter & Gamble / Febreze', 'Procter & Gamble'),
    'febreze-apartment-fresh': ('Britt Franklin, Apartment Therapy original firsthand home-use review, 2023; editorial affiliate disclosure retained', 'Apartment Therapy / Britt Franklin', 'Britt Franklin'),
    'oldspice-press-fresh': ('Procter & Gamble / Old Spice original Spice Alchemist press release', 'Procter & Gamble / Old Spice', 'Procter & Gamble'),
    'oldspice-eaumg-fresh': ('Ajent Orange, EauMG original firsthand Classic Old Spice Body Wash review, 2010; actual displayed pseudonym retained', 'EauMG / Ajent Orange', 'Ajent Orange'),
    'crocs-primary-fresh': ('Crocs original Jibbitz catalogue and footwear care navigation', 'Crocs', 'Crocs, Inc.'),
    'crocs-refinery-fresh': ('Karina Hoshikawa, Refinery29 original firsthand Crocs/Jibbitz review, 2023; independent editorial and affiliate disclosure retained', 'Refinery29 / Karina Hoshikawa', 'Karina Hoshikawa'),
    'ugg-womenshealth-fresh': ("Alexandria Gomez, Women's Health original firsthand UGG ownership review, 2017; actual byline and affiliate disclosure retained", "Women's Health / Alexandria Gomez", 'Alexandria Gomez'),
    'ugg-strategist-fresh': ('Lauren Ro, New York / The Strategist original firsthand UGG Ultra Mini review, 2025; exchange through a publicist and independent editorial selection disclosed', 'New York / Lauren Ro', 'Lauren Ro'),
    'duracell-primary-fresh': ('Duracell original battery use, care and disposal guide', 'Duracell', 'Duracell'),
    'duracell-practical-fresh': ('stevel, Practical Sailor original instrumented alkaline battery test, 2000; actual displayed author account preserved without inventing a personal name', 'Practical Sailor / stevel', 'stevel'),
}
quotes = {
    'tide-guide-fresh': 'Tide Ultra Stain Release Liquid Laundry Detergent',
    'tide-jeeves-stain': 'scored 96.9 for stain removal in my lab testing',
    'tide-pods-fresh': 'Tide PODS® Laundry Detergent Original Scent',
    'tide-jeeves-pods': 'Tide Hygienic Power Pods',
    'febreze-primary-fresh': 'spritz away and instantly fight fabric odors',
    'febreze-apartment-fresh': 'Febreze’s Fabric Antimicrobial Spray',
    'oldspice-press-fresh': 'four distinct, premium scents',
    'oldspice-eaumg-fresh': 'Old Spice. I know it is low-brow but I really do enjoy its scent.',
    'crocs-primary-footwear': 'How to Clean your Crocs footwear',
    'crocs-refinery-footwear': 'pair of shoes I reach for the most has to be my Crocs',
    'crocs-primary-charms': 'Crocs Jibbitz | Charms - Crocs',
    'crocs-refinery-charms': 'press-on charms that you can use to customize your Crocs',
    'ugg-womenshealth-fresh': 'the classic, knee-high, chestnut boots',
    'ugg-strategist-fresh': 'UGG Women’s Classic Ultra Mini',
    'duracell-primary-fresh': 'Duracell batteries',
    'duracell-practical-fresh': 'We tested only Duracell and Energizer alkaline batteries in the 6V test',
}
aliases = {
    'tide-jeeves-stain': 'tide-jeeves-fresh', 'tide-jeeves-pods': 'tide-jeeves-fresh',
    'crocs-primary-footwear': 'crocs-primary-fresh', 'crocs-primary-charms': 'crocs-primary-fresh',
    'crocs-refinery-footwear': 'crocs-refinery-fresh', 'crocs-refinery-charms': 'crocs-refinery-fresh',
}
physical = {}
author_guards = {}
def citation(key):
    sid = aliases.get(key, key)
    quote = quotes[key]
    assert 0 < len(quote.split()) <= 25
    fulltexts, passes = [], []
    for n in [1, 2]:
        matches = [r for r in receipts if r['sourceId'] == sid and r['pass'] == n]
        assert len(matches) == 1
        r = matches[0]
        raw = (CAP / (sid + '-pass' + str(n) + '.html')).read_bytes()
        text = (CAP / (sid + '-pass' + str(n) + '.txt')).read_text()
        assert r['success'] and r['actualHTTP200FullBody']
        assert r['url'].startswith('https://') and r['finalURL'].startswith('https://')
        assert len(raw) == r['rawBytes'] and sha(raw) == r['rawSha256']
        assert len(text) == r['visibleCharacters'] and sha(text.encode()) == r['visibleSha256']
        parsed = Visible(); parsed.feed(raw.decode('utf8', errors='replace'))
        assert re.sub(r'\s+', ' ', ' '.join(parsed.parts)).strip() == text
        assert authors[sid][2] in text and quote in text, (sid, quote)
        soup = BeautifulSoup(raw, 'html.parser')
        if sid == 'ugg-womenshealth-fresh':
            assert soup.select_one('meta[name="sailthru.author"]')['content'] == 'Alexandria Gomez'
            assert 'by Alexandria Gomez Published: Nov 30, 2017' in text
            assert 'my first pair landed on my feet circa 2006' in text
        elif sid == 'ugg-strategist-fresh':
            assert soup.select_one('meta[name="author"]')['content'] == 'Lauren Ro'
            assert 'I sheepishly emailed the very accommodating publicist and asked if I could do an exchange.' in text
            assert 'Every product is independently selected by' in text
        elif sid == 'duracell-practical-fresh':
            assert soup.select_one('meta[name="author"]')['content'] == 'stevel'
            assert 'By stevel - Published: August 21, 2000' in text
            assert 'we configured a simple test fixture' in text
            assert 'we are disappointed with Duracell' in text
        elif sid == 'oldspice-eaumg-fresh':
            assert 'Posted by Ajent Orange under' in text
            assert 'Every fall/winter, I purchase a bottle of Classic Old Spice Body Wash.' in text
        elif sid == 'tide-jeeves-fresh':
            assert 'By Zach Pozniak' in text and 'About the author Zach Pozniak' in text
            assert '78 detergents in 2025' in text and 'measured with a spectrometer' in text.lower()
            assert 'My 96.9 is a stain removal score. It does not measure odor removal' in text
        elif sid == 'crocs-refinery-fresh':
            assert 'written by Karina Hoshikawa' in text
            assert 'All of our market picks are independently selected and curated by the editorial team.' in text
            assert 'press-on charms that you can use to customize your Crocs' in text
        elif sid == 'febreze-apartment-fresh':
            assert 'Britt Franklin Senior Editor, Shopping' in text
            assert 'We independently select these products' in text
            assert 'I use the spray as a finishing step' in text
        if sources[sid][3] == 'independent':
            assert not re.search(r'"sponsored"\s*:\s*true', raw.decode('utf8', errors='replace'), re.I), sid
        assert r['openedUTC'] < r['closedUTC']
        physical[(sid, n)] = {'sourceId': sid, 'pass': n, 'rawSha256': sha(raw), 'visibleSha256': sha(text.encode()), 'originalRequestedURL': r['url'], 'actualFinalURL': r['finalURL'], 'originalFullBodyReparsedUnchanged': True}
        passes.append({'pass': n, 'actualHTTP200FullBody': True, 'rawBytes': len(raw), 'rawSha256': sha(raw), 'visibleCharacters': len(text), 'visibleSha256': sha(text.encode()), 'literalQuoteOffset': text.index(quote), 'quoteExactInFullText': True, 'openedUTC': r['openedUTC'], 'closedUTC': r['closedUTC']})
        fulltexts.append(text)
    a, b = [r for r in receipts if r['sourceId'] == sid]
    assert a['openedUTC'] != b['openedUTC'] and a['finalURL'] == b['finalURL']
    assert fulltexts[0] == fulltexts[1], sid
    author_guards[sid] = {'actualDisplayedAuthor': authors[sid][0], 'independentAuthorGroup': authors[sid][1], 'bothCompleteVisibleArticleAndSiteBodiesIdentical': True, 'completeVisibleBodySha256': sha(fulltexts[0].encode()), 'canonicalURL': a['finalURL'], 'historicalDatesAffiliatesAndSuppliedSampleLimitsRetained': True}
    return {'sourceId': sid, 'url': a['finalURL'], 'author': authors[sid][0], 'independentAuthorGroup': authors[sid][1], 'role': sources[sid][3], 'quote': quote, 'quoteWords': len(quote.split()), 'fullPasses': passes}

definitions = [
    ('CUE-022', 'Tide has a laundry-detergent and stain-removal association. The original corporate guide lists its stain-release laundry detergent and an independent original cleaner reports instrumented stain tests. No universal cleaning efficacy, numerical test ranking, forensic fingerprint removal or actual new advertisement is asserted.', ['Q0042'], ['tide-guide-fresh', 'tide-jeeves-stain'], ['TIDE-STAIN-GUIDE-FORENSIC-SCOPE'], 'high'),
    ('CUE-023', 'Tide makes laundry-detergent pods/pacs. The current original product catalogue and an independent original cleaner identify Tide detergent pods. No safety, current stock, ingredient, cost, odor measurement or fingerprint-evidence-removal guarantee is asserted.', ['M0651'], ['tide-pods-fresh', 'tide-jeeves-pods'], ['TIDE-PODS-NO-FORENSIC-CAPABILITY'], 'high'),
    ('CUE-024', 'Febreze has a fabric odor-spray association. Its original category page markets fabric odor fighting and an independent author describes actual household fabric-spray use. Medical antimicrobial efficacy, exorcism, a specific current Clean Linen scent and actual testimonial events are excluded.', ['M0043', 'Q0043'], ['febreze-primary-fresh', 'febreze-apartment-fresh'], ['FEBREZE-ODOR-SCENT-ANTIMICROBIAL-SCOPE'], 'high'),
    ('CUE-025', 'Old Spice has fragranced grooming products and a scent association. The current original corporate release discusses scents and the independent 2010 original author reports actually using Classic Old Spice Body Wash. Comparative claims, current formulas, current Classic stock and the fictional Midlife Crisis fragrance name are excluded.', ['Q0048'], ['oldspice-press-fresh', 'oldspice-eaumg-fresh'], ['OLD-SPICE-SPONSOR-AUTHOR-HISTORICAL-SCOPE'], 'medium'),
    ('CUE-026', 'Crocs has a footwear/shoe association. The original company catalogue links to Crocs footwear care and an independent original wearer identifies Crocs as shoes. Medical appropriateness, formal dress standards, funerary approval, present stock and comfort/performance guarantees are excluded.', ['Q0050'], ['crocs-primary-footwear', 'crocs-refinery-footwear'], ['CROCS-FOOTWEAR-CHARMS-ESTATE-SCOPE'], 'high'),
    ('CUE-027', 'Crocs has Jibbitz/shoe-charms accessories. Its actual original catalogue and an independent original wearer identify charms used to customize Crocs. Jewellery or estate value, universal fit, resale price, the deceased persons imagined careers and a promised attachment strength are excluded.', ['M1050', 'Q1050'], ['crocs-primary-charms', 'crocs-refinery-charms'], ['CROCS-FOOTWEAR-CHARMS-ESTATE-SCOPE'], 'high'),
    ('CUE-028', 'UGG has a boot-footwear association, independently described in two original firsthand ownership/try-on accounts by Alexandria Gomez in 2017 and Lauren Ro in 2025. Different publishers and authors are retained. Present stock, boot materials across every model, medical advice, an actual do-not-remove warning and universal comfort are excluded.', ['M0074', 'Q0074'], ['ugg-womenshealth-fresh', 'ugg-strategist-fresh'], ['UGG-ACCESS-SAMPLE-EDITORIAL-MEDICAL-SCOPE'], 'medium'),
    ('CUE-029', 'Duracell has battery products supplying portable electric power. The current original battery-care page and the independent original 2000 instrumented battery test establish the battery association. Comparative rankings, present formulas, actual performance duration, powering every disco-light design and communications with the deceased are excluded.', ['M1088', 'Q1088'], ['duracell-primary-fresh', 'duracell-practical-fresh'], ['DURACELL-DATED-PERFORMANCE-SUPPORT-SCOPE'], 'high'),
]
new = []
for fid, claim, ids, srcs, conflicts, confidence in definitions:
    citations = [citation(key) for key in srcs]
    assert len({s['independentAuthorGroup'] for s in citations}) == 2
    new.append({'id': fid, 'status': 'VERIFIED', 'claim': claim, 'promptIds': ids, 'confidence': confidence,
                'confidenceReason': 'Two distinct personally read original authors support only this narrow association. Both complete original source bodies, actual authors, exact excerpts, historical dates and stated exclusions were independently rechecked.',
                'sources': citations, 'conflictIds': conflicts})
facts = old_facts + new
assert len(facts) == 29
schema = load(JOB / 'reports/audit-20261009/verified-initial-cues.schema.json')
Draft202012Validator(schema).validate(facts)
quote_ledger = {}
capture_checks = 0
for fact in facts:
    assert len({s['independentAuthorGroup'] for s in fact['sources']}) == 2
    for s in fact['sources']:
        quote_ledger.setdefault(s['url'], set()).add(s['quote'])
        roots = [root for root in CAPTURE_ROOTS if (root / (s['sourceId'] + '-pass1.html')).exists()]
        assert len(roots) == 1, s['sourceId']
        for r in s['fullPasses']:
            raw = (roots[0] / (s['sourceId'] + '-pass' + str(r['pass']) + '.html')).read_bytes()
            text = (roots[0] / (s['sourceId'] + '-pass' + str(r['pass']) + '.txt')).read_text()
            assert len(raw) == r['rawBytes'] and sha(raw) == r['rawSha256']
            assert len(text) == r['visibleCharacters'] and sha(text.encode()) == r['visibleSha256']
            assert text[r['literalQuoteOffset']:r['literalQuoteOffset'] + len(s['quote'])] == s['quote']
            assert len(s['quote'].split()) <= 25
            capture_checks += 1
assert capture_checks == 116 and len(physical) == 26
assert all(sum(len(q.split()) for q in values) <= 200 for values in quote_ledger.values())
new_urls = {s['url'] for f in new for s in f['sources']}
assert all(sum(len(q.split()) for q in quote_ledger[u]) <= 25 for u in new_urls)

classifications = {
    'Q0042': (['CUE-022'], "Tide's real laundry/stain-removal association is sourced. The new claim and unspecified inappropriate blank are this specific invented marketing prompt, not an existing advertisement, a cleaning guarantee, evidence-destruction instruction or actual incident."),
    'M0651': (['CUE-023'], 'The real Tide laundry-pod product association is sourced. Sending a pod with a ransom note is a specifically imagined adult-party character decision with an absurd stated purpose; actual fingerprint removal, safe use or successful forensic concealment is not established. No real crime or cleaning method is asserted.'),
    'M0043': (['CUE-024'], 'The real Febreze fabric odor-spray association is sourced. Trying the spray before contacting an exorcist is this exact invented response to an imagined haunting; no supernatural reality, exorcism capability or medical treatment is asserted.'),
    'Q0043': (['CUE-024'], 'The real Febreze fabric odor-spray association is sourced. The quoted testimonial with its blank is an explicitly invented adult-party marketing line, not a factual customer endorsement, an actual event at a home or a guaranteed odor-removal result.'),
    'Q0048': (['CUE-025'], 'The real Old Spice fragranced-grooming association is sourced. Midlife Crisis and the blank form this specific invented new scent name; the text is not treated as an actual Old Spice product, formula, launch or medical diagnosis.'),
    'Q0050': (['CUE-026'], 'The real Crocs shoe/footwear association is sourced. Wearing them at ones own funeral and inventing an acceptable reason are this specific impossible adult-party setup; no real funerary rule, medical recommendation or reported death is asserted.'),
    'M1050': (['CUE-027'], 'The real Crocs shoe-charms association is sourced. Listing the charms as an estates only valuable jewelry is this imagined estate decision; genuine estate composition, jewelry classification, appraised value or resale value is not claimed.'),
    'Q1050': (['CUE-027'], 'The real Crocs shoe-charms association is sourced. A charm falling out of an imagined coffin and revealing a secret career is this original adult-party mystery; actual attachment performance, a real death, employment record or estate incident is not asserted.'),
    'M0074': (['CUE-028'], 'The real UGG boot-footwear association is sourced. The imagined wearer removing their boots after paramedics insist is this particular invented adult-party behavior; actual emergency medical instructions, medical utility or a real injury are not asserted.'),
    'Q0074': (['CUE-028'], 'The real UGG boot-footwear association is sourced. The quoted do-not-remove warning and its blank reason are this specific invented brand warning, not an actual product label, medical advice, a safety instruction or a factual current policy.'),
    'M1088': (['CUE-029'], 'The real Duracell battery association is sourced. Installing batteries in an urn to let the deceased complain is this specific supernatural adult-party fiction; real afterlife communication, a compatible urn product, electrical safety or performance duration is not asserted.'),
    'Q1088': (['CUE-029'], 'The real Duracell battery/portable-power association is sourced. A disco light inside an imagined coffin and the blank duration form this specific fictional party situation; a real death, specified lamp compatibility, battery longevity or real coffin product is not claimed.'),
}
expected_texts = {
    'Q0042': "Tide's new stain-removal claim should not mention ___.",
    'M0651': "Who's most likely to send a Tide pod with the ransom note to remove fingerprints?",
    'M0043': "Who's most likely to try Febreze before calling an exorcist?",
    'Q0043': "Febreze's least appropriate testimonial: \"You'd never know I ___ here.\"",
    'Q0048': "Old Spice's new scent is called \"Midlife Crisis and ___.\"",
    'Q0050': "The only acceptable reason to wear Crocs to your own funeral: ___.",
    'M1050': "Who's most likely to list Crocs charms as the estate's only valuable jewelry?",
    'Q1050': "The Crocs charm fell out of the coffin, revealing the deceased's secret career in ___.",
    'M0074': "Who's most likely to take their UGGs off only after the paramedics insist?",
    'Q0074': "UGG's worst reason to warn, \"Do not remove the boots\": ___.",
    'M1088': "Who's most likely to install Duracells in the urn so the deceased can complain all night?",
    'Q1088': "The Duracell battery kept the coffin's disco light running long after ___.",
}
review, proof = old_review, old_proof
prompts = {p['id']: p for p in load(JOB / 'prompts.json')}
assert review['selectedSha256'] == sha((JOB / 'prompts.json').read_bytes())
fact_by = {f['id']: f for f in facts}
now = datetime.datetime.now(datetime.timezone.utc).isoformat()
for row in review['rows']:
    if row['promptId'] in classifications:
        assert row['status'] == 'UNVERIFIED'
        actual_text = prompts[row['promptId']]['text']
        assert actual_text == expected_texts[row['promptId']]
        assert row['textSha256'] == sha(actual_text.encode())
        ids, reason = classifications[row['promptId']]
        row.update(status='VERIFIED', allActualCuesReviewed=True, verifiedFactIds=ids, coverageReason=reason)
        checks = []
        for fid in ids:
            for s in fact_by[fid]['sources']:
                a, b = s['fullPasses']
                checks.append({'factId': fid, 'sourceId': s['sourceId'], 'url': s['url'], 'independentAuthorGroup': s['independentAuthorGroup'], 'actualBothCapturedBodiesAndExactQuoteOffsetsRechecked': True, 'firstOpenedUTC': a['openedUTC'], 'secondOpenedUTC': b['openedUTC'], 'secondClosedUTC': b['closedUTC'], 'secondRawSha256': b['rawSha256'], 'secondVisibleSha256': b['visibleSha256']})
        proof['rows'].append({'promptId': row['promptId'], 'actualFullText': actual_text, 'textSha256': row['textSha256'], 'status': 'VERIFIED', 'allActualCuesReviewed': True, 'factIds': ids, 'cueAndCreativeClassification': reason, 'researchConfidence': 'medium' if any(fact_by[f]['confidence'] == 'medium' for f in ids) else 'high', 'sourceReopeningChecks': checks, 'actualRowCheckedUTC': now})
assert sum(r['status'] == 'VERIFIED' for r in review['rows']) == len(proof['rows']) == 42
assert all(next(r for r in review['rows'] if r['promptId'] == pid)['status'] == 'UNVERIFIED' for pid in ['M0042', 'Q0673', 'M0088', 'Q1033'])
fact_bytes = (json.dumps(facts, ensure_ascii=False, indent=2) + '\n').encode()
proof.update(actualClosedUTC=now, actualCompleteReviewedRows=42, stillUnverifiedRows=1158, qualifiedFactsSha256=sha(fact_bytes), wholePackReady=False, scope='42 specifically reviewed whole rows only. Twenty-nine limited facts leave1158 unverified. Exact Tide stain-guide independent provenance, Clean Linen scent, Duracell consumer-support corroboration and older Domino tracker labels remain unresolved. No original prompt, humor grade, source capture or strict gate changed.')
Draft202012Validator(load(JOB / 'research-review.schema.json')).validate(review)
for name, data in [('verified-initial-cues.json', facts), ('research-review.json', review), ('research-second-pass.json', proof)]:
    (ROOT / ('PROPOSED-' + name)).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
assert all(sha((JOB / name).read_bytes()) == h for name, h in before.items())
receipt = {
    'actualClosedUTC': now, 'phase': 'Author proposal; separate exact-row/source peer still required',
    'originalFactsRechecked': 21, 'newLimitedFactsQualified': 8, 'combinedFacts': 29,
    'newEntireRowsQualified': 12, 'combinedQualifiedRows': 42, 'stillUnverifiedRows': 1158,
    'all116FactSpecificFullCaptureHashAndExactQuoteChecks': capture_checks == 116,
    'newUniqueOriginalFullCapturesChecked': len(physical), 'allNewCapturedVisibleBodiesReparsedUnchanged': True,
    'actualCanonicalURLsAndRedirectLimits': list(physical.values()),
    'canonicalQuoteWordsAcrossAllFacts': {u: sum(len(q.split()) for q in values) for u, values in quote_ledger.items()},
    'maximumExcerptWords': max(s['quoteWords'] for f in facts for s in f['sources']),
    'newCanonicalURLMaximumCombinedQuotedWords': max(sum(len(q.split()) for q in quote_ledger[u]) for u in new_urls),
    'fullSecondPassAuthorAndArticleGuards': author_guards,
    'explicitlyUnadoptedSources': ['tide-familiprix-fresh: displayed author Vie de Parents and commercial provenance require independent qualification', 'oldspice-menshealth: actual sponsored:true metadata', 'ugg-primary: actual406 preserved', 'duracell-cinemasound: actual403 preserved'],
    'stillUnverifiedSpecificRows': ['M0042', 'Q0673', 'M0088', 'Q1033'],
    'priorEpochDeadlineMissPreserved': load(ROOT / 'PREVIOUS-EPOCH-MISSED.json'),
    'wholePackReady': False, 'formalKEEP': 0, 'productionPromptOrGradeChanges': 0,
    'allOriginal355DeliveryAndWorkflowBytesUnchanged': True,
    'proposedFileSha256': {n: sha((ROOT / ('PROPOSED-' + n)).read_bytes()) for n in ['verified-initial-cues.json', 'research-review.json', 'research-second-pass.json']},
}
(ROOT / 'EIGHT-PRODUCT-FACTS-TWELVE-ROWS-AUTHOR-PROPOSAL.json').write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({k: v for k, v in receipt.items() if k not in ['actualCanonicalURLsAndRedirectLimits', 'canonicalQuoteWordsAcrossAllFacts', 'fullSecondPassAuthorAndArticleGuards', 'priorEpochDeadlineMissPreserved']}))

