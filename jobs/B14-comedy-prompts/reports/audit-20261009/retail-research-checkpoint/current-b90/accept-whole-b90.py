"""Independently read complete native inputs, official ZIP, and native CI log.

This accepts the stated checkpoint evidence only. Unfinished factual coverage
stays unfinished even when every hosted structural check passes.
"""
import argparse
import datetime
import difflib
import hashlib
import json
import re
import zipfile
from collections import Counter
from pathlib import Path
from jsonschema import Draft202012Validator

p = argparse.ArgumentParser()
p.add_argument('directory')
p.add_argument('--archive-sha', required=True)
p.add_argument('--run', required=True, type=int)
p.add_argument('--job', required=True, type=int)
p.add_argument('--artifact', required=True, type=int)
p.add_argument('--qualified-rows', required=True, type=int)
p.add_argument('--buckets', required=True, type=int)
p.add_argument('--semantic-pairs', required=True, type=int)
p.add_argument('--require-schema-valid-semantic', action='store_true')
a = p.parse_args()
w = Path(a.directory)
job = w / 'source/jobs/B14-comedy-prompts'
meta = json.loads((w / 'native-source-inputs.json').read_text())
load = lambda path: json.loads((job / path).read_text())
sha = lambda data: hashlib.sha256(data).hexdigest()
before = {}
for f in meta['files']:
    b = (w / 'source' / f['path']).read_bytes()
    assert len(b) == f['size'], f['path']
    assert hashlib.sha1(b'blob ' + str(len(b)).encode() + b'\0' + b).hexdigest() == f['sha'], f['path']
    before[f['path']] = sha(b)

archive = w / 'official.zip'
assert sha(archive.read_bytes()) == a.archive_sha
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    assert set(z.namelist()) == {'ci.log', 'pool-similarity-rerun.json', 'delivery-controls/report.json'}
    for f in z.infolist():
        assert not f.filename.startswith('/') and '..' not in Path(f.filename).parts and f.file_size <= 30_000_000
    ci = z.read('ci.log').decode()
    scan = json.loads(z.read('pool-similarity-rerun.json'))
    delivery = json.loads(z.read('delivery-controls/report.json'))
    (w / 'original-artifact-ci.log').write_text(ci)
    (w / 'original-artifact-pool-similarity.json').write_bytes(z.read('pool-similarity-rerun.json'))
native = (w / 'full-native-log.log').read_text()
assert meta['head'] in native
plain = re.sub(r'^\d{4}-\d{2}-\d{2}T[^\s]+Z ?', '', native, flags=re.M)
native_lines = Counter(line.strip() for line in plain.splitlines() if line.strip())
ci_lines = Counter(line.strip() for line in ci.splitlines() if line.strip())
assert all(native_lines[line] >= count for line, count in ci_lines.items()), 'Artifact lines are not completely represented in native CI'

manifest = []
for line in (job / 'SHA256SUMS.txt').read_text().splitlines():
    h, name = line.split('  ', 1)
    assert sha((job / name).read_bytes()) == h and name + ': OK' in ci
    manifest.append(name)
actual = sorted(str(f.relative_to(job)) for f in job.rglob('*') if f.is_file() and '.work' not in f.relative_to(job).parts and '__pycache__' not in f.relative_to(job).parts and f.relative_to(job) != Path('SHA256SUMS.txt'))
assert sorted(manifest) == actual
assert all((job / name).stat().st_size <= 30_000_000 for name in actual + ['SHA256SUMS.txt'])

expected = load('results/pool-similarity.json')
assert {k: v for k, v in scan.items() if k != 'elapsedSeconds'} == {k: v for k, v in expected.items() if k != 'elapsedSeconds'}
assert scan['candidateCases'] == 3000 and scan['pairComparisons'] == 4498500 and scan['textForms'] == scan['wordingDirectionsPerPair'] == 2
segments = scan['coverageSegments']
assert len(segments) == 12 and segments[0]['leftStart'] == 0 and segments[-1]['leftEndExclusive'] == 3000
assert all(x['leftEndExclusive'] == y['leftStart'] for x, y in zip(segments, segments[1:]))
for s in segments:
    assert s['pairComparisons'] == sum(2999 - i for i in range(s['leftStart'], s['leftEndExclusive']))
    assert json.dumps({'completedLeftStart': s['leftStart'], 'completedLeftEndExclusive': s['leftEndExclusive'], 'pairComparisons': s['pairComparisons']})[:-1] in ci
assert sum(s['pairComparisons'] for s in segments) == 4498500
release = load('results/release.json')
assert release['candidatePoolSimilarityComparisons'] == 4498500 and release['similarityPairComparisons'] == 719400
assert json.dumps(release, indent=2) in ci
rows = load('candidates.json')
by = {r['id']: r for r in rows}
selected = load('prompts.json')
selected_by = {r['id']: r for r in selected}
reviews = load('grading/pass2.json')
rv = {r['id']: r for r in reviews['rows']}
assert len(rows) == len(by) == len(rv) == 3000 and len(selected) == len(selected_by) == 1200
for source, schema in [(rows, load('candidates.schema.json')), (selected, load('prompts.schema.json'))]:
    Draft202012Validator.check_schema(schema)
    assert not list(Draft202012Validator(schema).iter_errors(source))
assert Counter(r['kind'] for r in rows) == {'fill': 1500, 'most-likely': 1500}
assert Counter(r['kind'] for r in selected) == {'fill': 600, 'most-likely': 600}
assert all(len(r['text']) <= 90 for r in rows)
assert reviews['reviewInputSha256'] == sha((job / 'review-input.json').read_bytes())
batches = sorted((job / 'batches').glob('*.tsv'))
assert len(batches) == 30
reviewed = {}
for batch in batches:
    seal = load('seals/' + batch.stem + '.json')
    inp = job / 'review-inputs' / (batch.stem + '.json')
    assert seal['firstPassSha256'] == sha(batch.read_bytes()) and seal['reviewInputSha256'] == sha(inp.read_bytes())
    r2 = load('grading/pass2-' + str(int(batch.name[:3])).zfill(3) + '.json')
    assert r2['reviewInputSha256'] == sha(inp.read_bytes()) and r2['reviewer'] != 'original-author'
    assert {r['id'] for r in r2['rows']} == {r['id'] for r in json.loads(inp.read_text())}
    for r in r2['rows']:
        assert r['id'] not in reviewed and rv[r['id']] == dict(r, reviewer=r2['reviewer'])
        reviewed[r['id']] = r
assert len(reviewed) == 3000
assert sum(by[k]['firstPass']['grade'] >= 4 and r['grade'] >= 4 for k, r in rv.items()) == 1978
assert sum(by[k]['firstPass']['grade'] == r['grade'] for k, r in rv.items()) == 1343
assert sum((by[k]['firstPass']['grade'] >= 4) == (r['grade'] >= 4) for k, r in rv.items()) == 2217
aliases = load('named-reference-aliases.json')['tagToCanonical']
named = Counter()
editorial = load('editorial-review.json')
ed = {r['id']: r for r in editorial['rows']}
assert editorial['selectedSha256'] == sha((job / 'prompts.json').read_bytes())
for r in selected:
    original = by[r['id']]
    assert all(r[k] == original[k] for k in ['kind', 'text', 'namedReferences'])
    assert original['firstPass']['grade'] >= 4 and rv[r['id']]['grade'] >= 4
    assert r['confidence'] == ('high' if original['firstPass']['grade'] == rv[r['id']]['grade'] == 5 else 'medium')
    named.update({aliases.get(tag, tag) for tag in r['namedReferences']})
    e = ed[r['id']]
    assert all(e[k] for k in ['noSlurs', 'noMinors', 'namedReferencesChecked'])
    assert {x['tag'] for x in e['namedReferenceEvidence']} == set(r['namedReferences'])
    for x in e['namedReferenceEvidence']:
        assert r['text'][x['start']:x['end']] == x['nameInText'] and x['canonical'] == aliases.get(x['tag'], x['tag'])
assert len(named) == a.buckets and max(named.values()) == 3
assert dict(sorted(named.items())) == load('named-reference-audit.json')['selectedCombinedCounts']
normalize = lambda s: re.sub(r'[^a-z0-9]+', ' ', s.lower()).strip()
for flag in scan['flags']:
    x, y = [normalize(by[id]['text']) for id in flag['ids']]
    xc, yc = x.removeprefix('who s most likely to '), y.removeprefix('who s most likely to ')
    full = max(difflib.SequenceMatcher(None, x, y, autojunk=False).ratio(), difflib.SequenceMatcher(None, y, x, autojunk=False).ratio())
    content = max(difflib.SequenceMatcher(None, xc, yc, autojunk=False).ratio(), difflib.SequenceMatcher(None, yc, xc, autojunk=False).ratio())
    assert flag['fullTextRatio'] == full and flag['contentRatio'] == content and max(full, content) > .75
    assert (flag['resolution'] == 'keep-distinct') == all(id in selected_by for id in flag['ids'])
assert len(scan['flags']) == 57 and scan['originalSingleDirectionFlagsRetained'] == 55 and scan['selectedFlaggedPairs'] == 4
assert {tuple(x['ids']) for x in load('curation-iterations/01/full-pool-single-direction-scan.json')['flags']} <= {tuple(x['ids']) for x in scan['flags']}

decoder = json.JSONDecoder()
objects, index = [], 0
while True:
    index = ci.find('{', index)
    if index < 0:
        break
    try:
        value, end = decoder.raw_decode(ci, index)
    except ValueError:
        index += 1
        continue
    index = end
    if isinstance(value, dict):
        objects.append(value)
one = lambda key: next(x for x in objects if key in x)
selector = one('independentExhaustiveSubsetOracleCases')
assert selector['independentExhaustiveSubsetOracleCases'] == 600 and selector['expectedInfeasibleCases'] == 423
assert one('exactGlobalRankedFeasibleSelection')['exactGlobalRankedFeasibleSelection'] is True
assert delivery['negativeControls'] == 11 and delivery['positiveControls'] == 3
assert delivery['allOwnedChildrenClosedNaturally'] and delivery['allOwnedTemporaryFixturesRemoved'] and delivery['noDeliveryBytesChanged']
assert len(delivery['legacyOversizedFalseGreens']) == 2 and all(x['oldExit'] == 0 and x['new']['returncode'] != 0 for x in delivery['legacyOversizedFalseGreens'])
assert all(x['allFixtureBytesPreserved'] for x in delivery['newReadOnlyChecks'])
control_reports = [x for x in objects if 'cases' in x and 'negativeCases' in x]
research_controls = next(x for x in control_reports if 'allFixtureBytesPreserved' in x)
assert research_controls['negativeCases'] == (11 if a.qualified_rows else 9) and research_controls['positiveCases'] == 1
assert research_controls['allPassed'] and research_controls['allOwnedChildrenNaturallyClosed'] and research_controls['allTemporaryFixturesRemoved']
for case in research_controls['cases']:
    assert case['inputBytesUnchanged'] and (case['actualExitCode'] == 0) == case['expectedAccepted']
if a.semantic_pairs:
    semantic = next(x for x in control_reports if 'actualBelowLexicalThresholdPairs' in x)
    assert semantic['negativeCases'] == semantic['actualBelowLexicalThresholdPairs'] == a.semantic_pairs and semantic['positiveCases'] == 1
    assert semantic['allPassed'] and semantic['allChildrenNaturallyClosed'] and semantic['allTemporaryFixturesRemoved']
    for case in semantic['cases']:
        assert case['same1200And600Each'] and case['inputBytesUnchanged'] and (case['actualExitCode'] == 0) == case['expectedAccepted']
    if a.require_schema_valid_semantic:
        for case in semantic['cases']:
            assert case['all1200SchemaValid'] and case['allIdsUnique']
            assert case['allOriginalTextsAndBothGradesPreserved'] and case['allConfidenceMatchesOriginalGrades']
            assert case['actualCombinedNamedReferenceMaximum'] <= 3
    pairs = load('semantic-premise-review.json')['reviewedRepeatedPremisePairs']
    assert len(pairs) == a.semantic_pairs and all(not set(row['pair']) <= set(selected_by) for row in pairs)
facts = load('reports/audit-20261009/verified-initial-cues.json')
review = load('research-review.json')
proof_path = job / 'research-second-pass.json'
proof = load('research-second-pass.json') if proof_path.is_file() else None
assert len(facts) == 9 and len(review['rows']) == 1200
assert review['selectedSha256'] == sha((job / 'prompts.json').read_bytes())
assert sum(row['status'] == 'VERIFIED' for row in review['rows']) == a.qualified_rows
if proof is None:
    assert a.qualified_rows == 0, 'Qualified rows require their actual second-pass file'
else:
    assert proof['selectedSha256'] == review['selectedSha256']
    assert proof['qualifiedFactsSha256'] == sha((job / 'reports/audit-20261009/verified-initial-cues.json').read_bytes())
    assert len(proof['rows']) == a.qualified_rows
assert {row['promptId'] for row in review['rows']} == set(selected_by)
for data, schema in [(facts, load('reports/audit-20261009/verified-initial-cues.schema.json')), (review, load('research-review.schema.json'))]:
    Draft202012Validator.check_schema(schema)
    assert not list(Draft202012Validator(schema).iter_errors(data))
captures = Path('/tmp/gpt-drops-B14-audit-20261009/.work/20261009-audit/cue-captures')
fact_by = {fact['id']: fact for fact in facts}
full_capture_checks = 0
for fact in facts:
    assert len(fact['sources']) == len({s['independentAuthorGroup'] for s in fact['sources']}) == 2
    for s in fact['sources']:
        assert len(s['quote'].split()) <= 25 and [r['pass'] for r in s['fullPasses']] == [1, 2]
        for r in s['fullPasses']:
            stem = captures / (s['sourceId'] + '-pass' + str(r['pass']))
            raw, text = stem.with_suffix('.html').read_bytes(), stem.with_suffix('.txt').read_text()
            assert r['actualHTTP200FullBody'] and len(raw) == r['rawBytes'] and sha(raw) == r['rawSha256']
            assert sha(text.encode()) == r['visibleSha256'] and text[r['literalQuoteOffset']:r['literalQuoteOffset'] + len(s['quote'])] == s['quote']
            assert r['openedUTC'] < r['closedUTC']
            full_capture_checks += 1
reviews_by = {row['promptId']: row for row in review['rows']}
for row in proof['rows'] if proof is not None else []:
    selected_row = selected_by[row['promptId']]
    rr = reviews_by[row['promptId']]
    assert row['actualFullText'] == selected_row['text'] and row['textSha256'] == rr['textSha256'] == sha(selected_row['text'].encode())
    assert row['allActualCuesReviewed'] and rr['status'] == row['status'] == 'VERIFIED'
    assert row['factIds'] == rr['verifiedFactIds'] and row['cueAndCreativeClassification']
    expected_sources = {(id, s['sourceId']): s for id in row['factIds'] for s in fact_by[id]['sources']}
    assert {(s['factId'], s['sourceId']) for s in row['sourceReopeningChecks']} == set(expected_sources)
    for s in row['sourceReopeningChecks']:
        original = expected_sources[s['factId'], s['sourceId']]
        second = original['fullPasses'][1]
        assert s['secondRawSha256'] == second['rawSha256'] and s['secondVisibleSha256'] == second['visibleSha256']
        assert s['url'] == original['url'] and s['independentAuthorGroup'] == original['independentAuthorGroup']
partial = next(x for x in objects if x.get('mode') == 'partial-metadata')
assert partial['fullyQualifiedRows'] == a.qualified_rows and partial['unverifiedRows'] == 1200 - a.qualified_rows and partial['ready'] is False
assert all(sha((w / 'source' / path).read_bytes()) == digest for path, digest in before.items())
receipt = {'acceptedUTC': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'head': meta['head'], 'run': a.run, 'job': a.job, 'artifact': a.artifact, 'archiveBytes': archive.stat().st_size, 'archiveSha256': sha(archive.read_bytes()), 'nativeLogBytes': (w / 'full-native-log.log').stat().st_size, 'nativeLogSha256': sha((w / 'full-native-log.log').read_bytes()), 'nativeSourceBlobHashesChecked': len(before), 'manifestPayloadsChecked': len(manifest), 'deliveredFileSizesIndependentlyObserved': len(actual) + 1, 'allSafeZIPEntriesFullyReadCRC': 3, 'completeArtifactLinesBoundToNativeCounts': sum(ci_lines.values()), 'actualHostedScanPairs': 4498500, 'actualHostedFinalScanPairs': 719400, 'actualHostedSegmentsChecked': 12, 'actualFlagRatiosIndependentlyRecomputed': 57, 'originalSingleDirectionFlagsRetained': 55, 'selectedFlagsAllResolved': 4, 'allFirstPassSealsChecked': 30, 'independentGradeCasesChecked': 3000, 'bothGradeQualified': 1978, 'agreementExactCount': 1343, 'agreementThresholdCount': 2217, 'combinedCanonicalBuckets': a.buckets, 'combinedMax': 3, 'independentExhaustiveSelectorCasesObserved': 600, 'actualReadOnlyDeliveryControls': 14, 'actualSemanticControlsScopeSameSizeGenreOnly': 0 if a.require_schema_valid_semantic else (a.semantic_pairs + 1 if a.semantic_pairs else 0), 'actualSemanticFullSchemaGradeConfidenceCapControls': a.semantic_pairs + 1 if a.require_schema_valid_semantic else 0, 'actualResearchCLIControls': len(research_controls['cases']), 'limitedResearchFactsWithOriginalFullCapturesChecked': 9, 'fullCaptureHashAndQuoteChecks': full_capture_checks, 'fullyQualifiedResearchRows': a.qualified_rows, 'unverifiedResearchRows': 1200 - a.qualified_rows, 'allNativeSourceInputsUnchanged': True, 'wholePackReady': False, 'formalKEEP': 0, 'scope': 'Complete genuine checkpoint archive, native CI lines, source hashes, unchanged sealed grades and original exhaustive scan gates independently accepted. Research qualification is restricted to the listed exact rows; remaining rows are UNVERIFIED. Hosted structural success does not satisfy the unfinished binding research requirement. Current strengthened semantic fixture schema, original grades, confidence and named-reference cap are independently checked when explicitly requested; historical helper scope remains recorded separately.'}
(w / 'WHOLE-CHECKPOINT-ACCEPTANCE.json').write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps(receipt, indent=2))
