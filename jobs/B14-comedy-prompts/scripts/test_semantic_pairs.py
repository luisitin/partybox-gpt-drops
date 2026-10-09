"""Real same-size, same-genre bad packs must fail the reviewed premise gate."""
import datetime
import difflib
import hashlib
import json
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile
from collections import Counter
from jsonschema import Draft202012Validator

JOB = pathlib.Path(__file__).resolve().parents[1]
WORK = JOB / '.work/semantic-controls'
WORK.mkdir(parents=True, exist_ok=True)
original = {row['id']: row for row in json.loads((JOB / 'candidates.json').read_text())}
selected = json.loads((JOB / 'prompts.json').read_text())
review = json.loads((JOB / 'semantic-premise-review.json').read_text())
grades = {row['id']: row['grade'] for row in json.loads((JOB / 'grading/pass2.json').read_text())['rows']}
aliases = json.loads((JOB / 'named-reference-aliases.json').read_text())['tagToCanonical']
validator = Draft202012Validator(json.loads((JOB / 'prompts.schema.json').read_text()))
results = []
normalize = lambda text: re.sub(r'[^a-z0-9]+', ' ', text.lower()).strip()

def counts(rows):
    result = Counter()
    for row in rows:
        result.update({aliases.get(tag, tag) for tag in row['namedReferences']})
    return result

def case(name, rows, expected):
    assert len(rows) == 1200 and Counter(row['kind'] for row in rows) == {'fill': 600, 'most-likely': 600}
    assert len({row['id'] for row in rows}) == 1200
    assert not list(validator.iter_errors(rows))
    assert max(counts(rows).values()) <= 3
    for row in rows:
        source = original[row['id']]
        assert all(row[key] == source[key] for key in ['kind', 'text', 'namedReferences'])
        assert min(source['firstPass']['grade'], grades[row['id']]) >= 4
        assert row['confidence'] == ('high' if source['firstPass']['grade'] == grades[row['id']] == 5 else 'medium')
    with tempfile.TemporaryDirectory(prefix='semantic-', dir=WORK) as temporary:
        root = pathlib.Path(temporary)
        (root / 'prompts.json').write_text(json.dumps(rows))
        shutil.copyfile(JOB / 'semantic-premise-review.json', root / 'semantic-premise-review.json')
        before = {path.name: hashlib.sha256(path.read_bytes()).hexdigest() for path in root.iterdir()}
        completed = subprocess.run([sys.executable, str(JOB / 'scripts/check_semantic_pairs.py'), '--root', str(root)], capture_output=True, text=True, timeout=10)
        after = {path.name: hashlib.sha256(path.read_bytes()).hexdigest() for path in root.iterdir()}
        assert before == after and (completed.returncode == 0) == expected, (name, completed.stdout, completed.stderr)
        result = {'name': name, 'actualExitCode': completed.returncode, 'expectedAccepted': expected, 'same1200And600Each': True, 'all1200SchemaValid': True, 'allIdsUnique': True, 'allOriginalTextsAndBothGradesPreserved': True, 'allConfidenceMatchesOriginalGrades': True, 'actualCombinedNamedReferenceMaximum': max(counts(rows).values()), 'inputBytesUnchanged': True, 'stdout': completed.stdout, 'stderr': completed.stderr}
        results.append(result)
        return result

case('actual current pack positive', selected, True)
for pair in review['reviewedRepeatedPremisePairs']:
    ids = set(pair['pair'])
    rows = list(selected)
    for id in ids - {row['id'] for row in rows}:
        source = original[id]
        inserted = {key: source[key] for key in ['id', 'kind', 'text', 'namedReferences']}
        inserted['confidence'] = 'high' if source['firstPass']['grade'] == grades[id] == 5 else 'medium'
        current = counts(rows)
        possible = []
        for index, row in enumerate(rows):
            if row['kind'] != source['kind'] or row['id'] in ids:
                continue
            proposed = current.copy()
            proposed.subtract({aliases.get(tag, tag) for tag in row['namedReferences']})
            proposed.update({aliases.get(tag, tag) for tag in source['namedReferences']})
            if max(proposed.values()) <= 3:
                possible.append(index)
        assert possible, ('No same-genre cap-preserving fixture replacement', id)
        rows[possible[0]] = inserted
    result = case('reinsert reviewed premise ' + '/'.join(pair['pair']), rows, False)
    a, b = [normalize(original[id]['text']) for id in pair['pair']]
    maximum = max(difflib.SequenceMatcher(None, x, y, autojunk=False).ratio() for x, y in [(a, b), (b, a), (a.removeprefix('who s most likely to '), b.removeprefix('who s most likely to ')), (b.removeprefix('who s most likely to '), a.removeprefix('who s most likely to '))])
    result['actualMaximumBothFormsBothDirectionsRatio'] = maximum
    result['lexicalThresholdWouldNotFlagPair'] = maximum <= .75

report = {'actualClosedUTC': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'negativeCases': len(results) - 1, 'positiveCases': 1, 'cases': results, 'actualBelowLexicalThresholdPairs': sum(row.get('lexicalThresholdWouldNotFlagPair', False) for row in results), 'allPassed': True, 'allChildrenNaturallyClosed': True, 'allTemporaryFixturesRemoved': True, 'scope': 'Actual schema-valid1200-row600/genre controls preserve all original texts, both grades, derived confidence, unique IDs and combined named-reference cap3 while enforcing only explicit personally read pair exclusions. They are not a full semantic or factual-cue oracle.'}
(WORK / 'report.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
