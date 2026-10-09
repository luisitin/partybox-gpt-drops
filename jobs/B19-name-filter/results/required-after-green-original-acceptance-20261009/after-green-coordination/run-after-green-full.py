"""One binding KEEP full rerun after genuine6a hosted acceptance; no luck retry."""
from datetime import datetime, timezone
from pathlib import Path
import hashlib
import json
import os
import shutil
import subprocess
import sys

repo = Path(__file__).resolve().parents[2]
job = repo / 'jobs/B19-name-filter'
coord = Path(__file__).resolve().parent
out = repo / '.work/B19-once-after-green-6a-full'
assert not out.exists(), 'This once-after-green attempt is already used; no retry.'
utc = lambda: datetime.now(timezone.utc).isoformat()
sha = lambda path: hashlib.sha256(path.read_bytes()).hexdigest()
ready = json.loads((coord / 'READY.json').read_text())
grant = json.loads((coord / 'grant.json').read_text())
scope = 'one required after-green current-source original full npm test'
assert grant['scope'] == ready['scope'] == scope
assert grant['quietGranted'] is True
assert grant['expectedHead'] == ready['expectedHead'] == '6a079fec45c7e721fd16e988288b25c103ff29c6'
assert grant['expectedSourceSha256'] == ready['expectedSourceSha256'] == '7817489fc1d0908a87914223a84b31c15ea7e13b3555cb4238594751616f163d'
assert grant['expectedReadySha256'] == sha(coord / 'READY.json')
assert grant['oneRequiredAfterGreenRerunAuthorized'] is True
assert subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=repo, text=True).strip() == ready['expectedHead']
assert not subprocess.check_output(['git', 'status', '--porcelain', '--untracked-files=no'], cwd=repo, text=True)
base_paths = {Path(path): digest for path, digest in ready['sourceGuards'].items()}
assert all(sha(path) == digest for path, digest in base_paths.items()), 'READY bytes changed.'
assert sha(job / 'dist/nameFilter.js') == 'e4b39efbf033bef9c41788e9bf0f002cdb61ff9dbbdfa6cbfcbfda65122d2cf9'
green = json.loads((repo / '.work/B19-green-hosted-6a/independent-hosted-validation.json').read_text())
assert green['head'] == ready['expectedHead'] and green['runId'] == 37864218510
assert green['checksPassed'] == 4981 and green['freshSuiteRowsPassed'] == 100 and green['literalAcceptancePassed'] is True
assert [row['recordedOutliers'] for row in green['recordedBenchmarks']] == [0, 0, 0]
raw = subprocess.check_output(['ps', '-eo', 'pid,ppid,pgid,stat,comm,pcpu,rss'], text=True)
lines = raw.splitlines()
live = [line for line in lines[1:] if not line.split()[3].startswith('Z')]
names = {'node', 'MainThread', 'chromium', 'chrome', 'headless_shell', 'ffmpeg', 'ffprobe', 'tsc', 'tsx', 'esbuild', 'python', 'python3', 'git', 'curl', 'wget'}
blocked = [line for line in live if line.split()[4] in names and int(line.split()[0]) != os.getpid()]
(coord / 'pre-grant-processes.txt').write_text(lines[0] + '\n' + '\n'.join(live) + '\n')
assert not blocked, blocked
paths = list(base_paths) + [coord / 'READY.json', coord / 'grant.json']
guards = lambda: {str(path): sha(path) for path in paths}
source_start = guards()
out.mkdir()
receipt = {'kind': 'one-binding-after-green-6a-original-full-KEEP-rerun', 'head': ready['expectedHead'], 'argv': ['npm', 'test'], 'workingDirectory': str(job), 'startedUtc': utc(), 'sourceStart': source_start, 'clockOrGateChanges': False, 'priorFailedAttemptsRetained': True, 'rootGrant': grant, 'hostedCurrentAcceptedGreenBeforeStart': True, 'requiredAfterGreenKEEPCheckRun': True, 'requiredAfterGreenKEEPCheckPassed': False, 'bindingQuote': ready['bindingQuote'], 'priorFirstLocalFailure': [12, 9, 2], 'freshRunnableWorkloads': blocked, 'STOPorCONTUsed': False}
(out / 'START.json').write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps({'event': 'START', 'head': receipt['head'], 'actualUtc': receipt['startedUtc'], 'guardedFiles': len(source_start), 'argv': ['npm', 'test'], 'hostedGreenAccepted': True, 'scope': scope}), flush=True)
with (out / 'stdout.log').open('w') as stdout, (out / 'stderr.log').open('w') as stderr:
    process = subprocess.run(['npm', 'test'], cwd=job, stdout=stdout, stderr=stderr)
receipt['closedUtc'] = utc()
receipt['exitCode'] = process.returncode
receipt['sourceEnd'] = guards()
receipt['sourcesUnchanged'] = receipt['sourceEnd'] == source_start
if (job / 'reports/latest/summary.json').exists():
    shutil.copytree(job / 'reports/latest', out / 'reports')
    summary = json.loads((out / 'reports/summary.json').read_text())
    receipt['summary'] = {'mode': summary['mode'], 'suites': len(summary['suites']), 'sourceSha256': summary['sourceSha256'], 'failures': summary['failures']}
    receipt['requiredAfterGreenKEEPCheckPassed'] = process.returncode == 0 and receipt['sourcesUnchanged'] and summary['mode'] == 'full' and len(summary['suites']) == 100 and not summary['failures']
(out / 'CLOSED.json').write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps({k: receipt.get(k) for k in ['closedUtc', 'exitCode', 'sourcesUnchanged', 'summary', 'requiredAfterGreenKEEPCheckPassed']}), flush=True)
sys.exit(process.returncode if receipt['sourcesUnchanged'] else 2)
