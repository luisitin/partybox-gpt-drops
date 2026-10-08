"""One delegated finite mixed comparison; never literal acceptance."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import os
import shutil
import subprocess

repo = Path(__file__).resolve().parents[2]
out = Path(__file__).resolve().parent
candidate = repo / '.work/B19-ascii-DFA-fold-candidate'
job = repo / 'jobs/B19-name-filter'
utc = lambda: datetime.now(timezone.utc).isoformat()
sha = lambda path: hashlib.sha256(path.read_bytes()).hexdigest()
assert not (candidate / 'timing-latest.json').exists()
assert not (candidate / 'timing.stdout').exists()
ready = json.loads((candidate / 'TIMING_READY.json').read_text())
assert ready['guards'] == 669 and ready['timingStarted'] is False
assert ready['candidateSourceSha256'] == '7817489fc1d0908a87914223a84b31c15ea7e13b3555cb4238594751616f163d'
assert ready['candidateJsSha256'] == 'e4b39efbf033bef9c41788e9bf0f002cdb61ff9dbbdfa6cbfcbfda65122d2cf9'
assert subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=repo, text=True).strip() == ready['baselineHead']
eq = json.loads((candidate / 'equivalence-latest.json').read_text())
for key, digest in eq['sourceEnd'].items():
    path = job / key[4:] if key.startswith('job/') else candidate / key[8:]
    assert sha(path) == digest, key
assert eq['passed'] and eq['sourcesUnchanged'] and eq['cases'] == 214308
mutants = json.loads((repo / '.work/B19-ascii-DFA-fold-mutation/CLOSED.json').read_text())
assert mutants['cases'] == mutants['passed'] == 25 and mutants['sourcesUnchanged']
acks = json.loads((out / 'ACKS.json').read_text())
assert set(acks) == {'G04', 'G08', 'G09', 'G10', 'tracker'}
assert all(v['zeroWorkload'] and v['zeroWriter'] for v in acks.values())
delegation = json.loads((out / 'root-delegation.json').read_text())
assert delegation['rootZeroWorkloadAndWriter'] and delegation['oneMixedComparisonDelegated']
external = [job / 'SHA256SUMS.txt', Path(shutil.which('node')).resolve(),
            job / 'node_modules/typescript/bin/tsc', job / 'node_modules/typescript/lib/_tsc.js',
            Path(__file__).resolve(), candidate / 'TIMING_READY.json',
            candidate / 'equivalence-latest.json', candidate / 'structural-control.json',
            candidate / 'run-functional.py',
            repo / '.work/B19-ascii-DFA-fold-mutation/CLOSED.json',
            repo / '.work/B19-ascii-DFA-fold-mutation/full-mutation.mjs',
            repo / '.work/B19-ascii-DFA-fold-mutation/original-declarations.mjs']
guards = lambda: {str(p): sha(p) for p in external}
external_start = guards()
raw = subprocess.check_output(['ps', '-eo', 'pid,ppid,pgid,stat,comm,pcpu,rss'], text=True)
lines = raw.splitlines()
live = [line for line in lines[1:] if not line.split()[3].startswith('Z')]
(out / 'pre-grant-processes.txt').write_text(lines[0] + '\n' + '\n'.join(live) + '\n')
names = {'node', 'MainThread', 'chromium', 'chrome', 'headless_shell', 'ffmpeg', 'ffprobe',
         'tsc', 'tsx', 'esbuild', 'python', 'python3', 'git', 'curl', 'wget'}
blocked = [line for line in live if line.split()[4] in names and int(line.split()[0]) != os.getpid()]
assert not blocked, blocked
receipt = {'grantUtc': utc(), 'kind': 'delegated-once-only-raw-letter-DFA-fold-ABBA-BAAB',
           'acknowledgments': acks, 'rootDelegation': delegation,
           'runnableWorkloads': blocked, 'liveProcesses': live,
           'ignoredZombieEntries': len(lines) - 1 - len(live), 'STOPorCONTUsed': False,
           'baselineHead': ready['baselineHead'], 'baselineSourceSha256': ready['baselineSourceSha256'],
           'baselineCompiledSha256': ready['baselineCompiledSha256'],
           'candidateSourceSha256': ready['candidateSourceSha256'], 'candidateJsSha256': ready['candidateJsSha256'],
           'externalSourceStart': external_start,
           'argv': ready['argv'], 'originalAcceptanceNotRun': True,
           'allPriorFailuresRetained': True, 'originalWarmupAndSamplesUnchanged': True,
           'startupExcludedFromPhaseGains': True}
(out / 'grant.json').write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps({'event': 'GRANT', 'actualUtc': receipt['grantUtc'], 'runnableWorkloads': blocked}), flush=True)
receipt['commandStartedUtc'] = utc()
with (candidate / 'timing.stdout').open('w') as stdout, (candidate / 'timing.stderr').open('w') as stderr:
    process = subprocess.run(receipt['argv'], cwd=repo, stdout=stdout, stderr=stderr)
receipt['commandClosedUtc'] = utc()
receipt['exitCode'] = process.returncode
receipt['externalSourceEnd'] = guards()
receipt['externalSourcesUnchanged'] = receipt['externalSourceEnd'] == external_start
if (candidate / 'timing-latest.json').exists():
    report = json.loads((candidate / 'timing-latest.json').read_text())
    receipt.update(naturalClosedUtc=report['closedUtc'], harnessStartedUtc=report['startedUtc'],
                   sourcesUnchanged=report['sourcesUnchanged'], summaries=report.get('summaries'),
                   phaseCount=len(report.get('phases', [])), allCalls=report.get('totalMeasuredCalls'),
                   timingReportSha256=sha(candidate / 'timing-latest.json'))
else:
    receipt['stderr'] = (candidate / 'timing.stderr').read_text()
(out / 'command-CLOSED.json').write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps({k: receipt.get(k) for k in ['naturalClosedUtc', 'commandClosedUtc', 'exitCode',
                  'sourcesUnchanged', 'externalSourcesUnchanged', 'phaseCount', 'allCalls', 'summaries']}), flush=True)
raise SystemExit(process.returncode if receipt['externalSourcesUnchanged'] else 2)
