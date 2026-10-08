from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import subprocess
import sys

repo = Path(__file__).resolve().parents[2]
out = Path(__file__).resolve().parent
commands = [
    ('structural-control', ['node', '.work/B19-UTF16-length-candidate/structural-control.mjs'], out),
    ('equivalence', ['node', '.work/B19-UTF16-length-candidate/exact-harness.mjs', 'equivalence'], out),
    ('full-mutation', ['node', '.work/B19-UTF16-length-mutation/full-mutation.mjs'], repo / '.work/B19-UTF16-length-mutation'),
]
for name, argv, destination in commands:
    receipt_path = destination / (name + '-command.json')
    assert not receipt_path.exists(), 'Do not overwrite an attempt.'
    started = datetime.now(timezone.utc).isoformat()
    with (destination / (name + '.stdout')).open('w') as stdout, (destination / (name + '.stderr')).open('w') as stderr:
        process = subprocess.run(argv, cwd=repo, stdout=stdout, stderr=stderr)
    receipt = {'argv': argv, 'startedUtc': started, 'closedUtc': datetime.now(timezone.utc).isoformat(),
               'exitCode': process.returncode, 'productionChanged': False,
               'elapsedPerformanceExperiment': False,
               'controllerSha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
    receipt_path.write_text(json.dumps(receipt, indent=2) + '\n')
    print(json.dumps(receipt), flush=True)
    if process.returncode:
        print((destination / (name + '.stderr')).read_text()[-2200:], flush=True)
        sys.exit(process.returncode)
