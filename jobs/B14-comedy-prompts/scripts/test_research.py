"""Real production CLI controls keep unfinished research visibly unfinished."""
import datetime
import hashlib
import json
import pathlib
import shutil
import subprocess
import sys
import tempfile

JOB = pathlib.Path(__file__).resolve().parents[1]
WORK = JOB / '.work/research-controls'
WORK.mkdir(parents=True, exist_ok=True)
FILES = ['prompts.json', 'research-review.json', 'research-review.schema.json', 'research-second-pass.json', 'reports/audit-20261009/verified-initial-cues.json', 'reports/audit-20261009/verified-initial-cues.schema.json', 'reports/audit-20261009/initial-cue-conflicts.json']
results = []

def mutate_json(root, name, mutation):
    path = root / name
    value = json.loads(path.read_text())
    mutation(value)
    path.write_text(json.dumps(value))
    if name == 'reports/audit-20261009/verified-initial-cues.json':
        # Deliberately internally consistent bad metadata must still fail its actual quality predicate.
        proof_path = root / 'research-second-pass.json'
        proof = json.loads(proof_path.read_text())
        proof['qualifiedFactsSha256'] = hashlib.sha256(path.read_bytes()).hexdigest()
        proof_path.write_text(json.dumps(proof))

def case(name, mutation, partial, expected):
    with tempfile.TemporaryDirectory(prefix='research-', dir=WORK) as temporary:
        root = pathlib.Path(temporary)
        for name_to_copy in FILES:
            path = root / name_to_copy
            path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(JOB / name_to_copy, path)
        mutation(root)
        before = {str(path.relative_to(root)): hashlib.sha256(path.read_bytes()).hexdigest() for path in root.rglob('*') if path.is_file()}
        command = [sys.executable, str(JOB / 'scripts/check_research.py'), '--root', str(root)] + (['--partial'] if partial else [])
        completed = subprocess.run(command, capture_output=True, text=True, timeout=10)
        after = {str(path.relative_to(root)): hashlib.sha256(path.read_bytes()).hexdigest() for path in root.rglob('*') if path.is_file()}
        assert before == after, 'research check wrote to its inputs'
        assert (completed.returncode == 0) == expected, (name, completed.stdout, completed.stderr)
        results.append({'name': name, 'expectedAccepted': expected, 'actualExitCode': completed.returncode, 'stdout': completed.stdout, 'stderr': completed.stderr, 'inputBytesUnchanged': True})

FACTS = 'reports/audit-20261009/verified-initial-cues.json'
case('honest partial metadata does not claim readiness', lambda root: None, True, True)
case('strict check rejects actual unfinished rows', lambda root: None, False, False)
case('same authorship under two URLs', lambda root: mutate_json(root, FACTS, lambda data: data[0]['sources'][1].update(independentAuthorGroup=data[0]['sources'][0]['independentAuthorGroup'])), True, False)
case('missing second full opening', lambda root: mutate_json(root, FACTS, lambda data: data[0]['sources'][0]['fullPasses'].pop()), True, False)
case('two opening receipts both labelled pass1', lambda root: mutate_json(root, FACTS, lambda data: data[0]['sources'][0]['fullPasses'][1].update({'pass': 1})), True, False)
case('oversized quote with false declared word count', lambda root: mutate_json(root, FACTS, lambda data: data[0]['sources'][0].update(quote=' '.join(['word'] * 26), quoteWords=11)), True, False)
case('review belongs to different prompt wording', lambda root: mutate_json(root, 'research-review.json', lambda data: data['rows'][0].update(textSha256='0' * 64)), True, False)
case('mark row verified while cue review is incomplete', lambda root: mutate_json(root, 'research-review.json', lambda data: data['rows'][0].update(status='VERIFIED')), True, False)
case('fact assigned to an unrelated prompt', lambda root: mutate_json(root, 'research-review.json', lambda data: data['rows'][0].update(verifiedFactIds=['CUE-001'])), True, False)
case('drop required row coverage', lambda root: mutate_json(root, 'research-review.json', lambda data: data['rows'].pop()), True, False)
case('drop actual verified row second-pass evidence', lambda root: mutate_json(root, 'research-second-pass.json', lambda data: data['rows'].pop()), True, False)
case('reassign verified-row capture digest', lambda root: mutate_json(root, 'research-second-pass.json', lambda data: data['rows'][0]['sourceReopeningChecks'][0].update(secondRawSha256='0' * 64)), True, False)
report = {'actualClosedUTC': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'cases': results, 'negativeCases': sum(not result['expectedAccepted'] for result in results), 'positiveCases': sum(result['expectedAccepted'] for result in results), 'allPassed': True, 'allFixtureBytesPreserved': True, 'allOwnedChildrenNaturallyClosed': True, 'allTemporaryFixturesRemoved': True}
(WORK / 'report.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
