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

JOB = pathlib.Path(__file__).resolve().parents[1]
WORK = JOB / '.work/semantic-controls'
WORK.mkdir(parents=True, exist_ok=True)
original = {row['id']: row for row in json.loads((JOB / 'candidates.json').read_text())}
selected = json.loads((JOB / 'prompts.json').read_text())
review = json.loads((JOB / 'semantic-premise-review.json').read_text())
results = []
normalize = lambda text: re.sub(r'[^a-z0-9]+', ' ', text.lower()).strip()

def case(name, rows, expected):
    assert len(rows) == 1200 and Counter(row['kind'] for row in rows) == {'fill': 600, 'most-likely': 600}
    with tempfile.TemporaryDirectory(prefix='semantic-', dir=WORK) as temporary:
        root = pathlib.Path(temporary)
        (root / 'prompts.json').write_text(json.dumps(rows))
        shutil.copyfile(JOB / 'semantic-premise-review.json', root / 'semantic-premise-review.json')
        before = {path.name: hashlib.sha256(path.read_bytes()).hexdigest() for path in root.iterdir()}
        completed = subprocess.run([sys.executable, str(JOB / 'scripts/check_semantic_pairs.py'), '--root', str(root)], capture_output=True, text=True, timeout=10)
        after = {path.name: hashlib.sha256(path.read_bytes()).hexdigest() for path in root.iterdir()}
        assert before == after and (completed.returncode == 0) == expected, (name, completed.stdout, completed.stderr)
        result = {'name': name, 'actualExitCode': completed.returncode, 'expectedAccepted': expected, 'same1200And600Each': True, 'inputBytesUnchanged': True, 'stdout': completed.stdout, 'stderr': completed.stderr}
        results.append(result)
        return result

case('actual current pack positive', selected, True)
for pair in review['reviewedRepeatedPremisePairs']:
    ids = set(pair['pair'])
    rows = list(selected)
    for id in ids - {row['id'] for row in rows}:
        source = original[id]
        replacement = next(index for index, row in enumerate(rows) if row['kind'] == source['kind'] and row['id'] not in ids)
        rows[replacement] = {key: source[key] for key in ['id', 'kind', 'text', 'namedReferences']}
    result = case('reinsert reviewed premise ' + '/'.join(pair['pair']), rows, False)
    a, b = [normalize(original[id]['text']) for id in pair['pair']]
    maximum = max(difflib.SequenceMatcher(None, x, y, autojunk=False).ratio() for x, y in [(a, b), (b, a), (a.removeprefix('who s most likely to '), b.removeprefix('who s most likely to ')), (b.removeprefix('who s most likely to '), a.removeprefix('who s most likely to '))])
    result['actualMaximumBothFormsBothDirectionsRatio'] = maximum
    result['lexicalThresholdWouldNotFlagPair'] = maximum <= .75

report = {'actualClosedUTC': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'negativeCases': len(results) - 1, 'positiveCases': 1, 'cases': results, 'actualBelowLexicalThresholdPairs': sum(row.get('lexicalThresholdWouldNotFlagPair', False) for row in results), 'allPassed': True, 'allChildrenNaturallyClosed': True, 'allTemporaryFixturesRemoved': True, 'scope': 'Actual same-size600/genre controls enforce only explicit personally read pair exclusions. They are not a full semantic or factual-cue oracle.'}
(WORK / 'report.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
