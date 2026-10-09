"""Exactly one source-bound paired ASCII-mapping diagnostic; not acceptance."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import os
import signal
import traceback
import shutil
import subprocess

repo = Path(__file__).resolve().parents[2]
out = Path(__file__).resolve().parent
candidate = repo / '.work/B19-ASCII-mapping-candidate'
job = repo / 'jobs/B19-name-filter'
utc = lambda: datetime.now(timezone.utc).isoformat()
sha = lambda path: hashlib.sha256(path.read_bytes()).hexdigest()
assert not (candidate / 'timing-latest.json').exists()
assert not (candidate / 'timing.stdout').exists()
assert not (out / 'grant.json').exists()
assert not (out / 'command-CLOSED.json').exists()
ready_path = candidate / 'TIMING_READY_PATHS.json'
ready = json.loads(ready_path.read_text())
assert ready['scope'] == 'one original 24-phase 12-million-call paired ASCII-mapping diagnostic'
assert ready['timingStarted'] is False and ready['grantAuthorized'] is False
assert ready['candidateSourceSha256'] == '2a1daea82c86b4d9be909596d0c71d5f7e7fbc9cc724cd2c7939cacd430e97cf'
assert ready['candidateJsSha256'] == '68f2af07d2e50c5e50e17f7f548f69bc08158af9fd68d7ad951a5e18665d3111'
assert ready['baselineHead'] == 'a7f88e7cddde358c0f1499e88f9038c3df516135'
assert ready['controllerSha256'] == sha(Path(__file__))
assert subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=repo, text=True).strip() == ready['baselineHead']
assert not subprocess.check_output(['git', 'status', '--porcelain', '--untracked-files=no'], cwd=repo, text=True)
for path, digest in ready['sourceGuards'].items():
    assert sha(Path(path)) == digest, path
equivalence = json.loads((candidate / 'equivalence-latest.json').read_text())
assert equivalence['passed'] and equivalence['sourcesUnchanged'] and equivalence['cases'] == 214308
assert equivalence['sourceStart'] == equivalence['sourceEnd'] and len(equivalence['sourceStart']) == 1175
mutants = json.loads((repo / '.work/B19-ASCII-mapping-mutation/CLOSED.json').read_text())
assert mutants['cases'] == mutants['passed'] == 25 and mutants['sourcesUnchanged']
assert mutants['sourceStart'] == mutants['sourceEnd'] and len(mutants['sourceStart']) == 1177
assert all(m['parsedAndExecuted'] and m['killed'] and m['cases'] == 43830 and m['excludedBaselineFailures'] == 0 for m in mutants['results'])
acks = json.loads((out / 'ACKS.json').read_text())
assert set(acks) == {'G01', 'B03', 'static', 'G10', 'tracker'}
assert all(v['zeroWorkload'] is True and v['zeroWriter'] is True and v['actualNaturalClosedUtc'] for v in acks.values())
delegation = json.loads((out / 'root-delegation.json').read_text())
assert delegation['rootZeroWorkloadAndWriter'] is True and delegation['oneMixedComparisonDelegated'] is True
assert delegation['scope'] == ready['scope']
assert delegation['expectedControllerSha256'] == sha(Path(__file__))
assert delegation['expectedReadySha256'] == sha(ready_path)
assert delegation['actualRootGrantUtc']
raw = subprocess.check_output(['ps', '-eo', 'pid,ppid,pgid,stat,comm,pcpu,rss'], text=True)
lines = raw.splitlines()
live = [line for line in lines[1:] if not line.split()[3].startswith('Z')]
(out / 'pre-grant-processes.txt').write_text(lines[0] + '\n' + '\n'.join(live) + '\n')
names = {'node', 'MainThread', 'chromium', 'chrome', 'headless_shell', 'ffmpeg', 'ffprobe', 'tsc', 'tsx', 'esbuild', 'python', 'python3', 'git', 'curl', 'wget'}
blocked = [line for line in live if line.split()[4] in names and int(line.split()[0]) != os.getpid()]
assert not blocked, blocked
paths = [Path(p) for p in ready['sourceGuards']] + [ready_path, out / 'ACKS.json', out / 'root-delegation.json']
guards = lambda: {str(p): sha(p) for p in paths}
external_start = guards()
receipt = {'kind': 'delegated-once-only-ASCII-mapping-DFA-ABBA-BAAB', 'grantUtc': utc(), 'rootDelegation': delegation, 'acknowledgments': acks, 'runnableWorkloads': blocked, 'liveProcesses': live, 'ignoredZombieEntries': len(lines)-1-len(live), 'STOPorCONTUsed': False, 'baselineHead': ready['baselineHead'], 'baselineSourceSha256': ready['baselineSourceSha256'], 'baselineCompiledSha256': ready['baselineCompiledSha256'], 'candidateSourceSha256': ready['candidateSourceSha256'], 'candidateJsSha256': ready['candidateJsSha256'], 'historicalProofHead': ready['historicalProofHead'], 'documentationBridgeSha256': ready['documentationBridgeSha256'], 'externalSourceStart': external_start, 'argv': ready['argv'], 'originalAcceptanceNotRun': True, 'allPriorFailuresRetained': True, 'originalWarmupAndSamplesUnchanged': True, 'startupExcludedFromPhaseGains': True}
(out / 'grant.json').write_text(json.dumps(receipt, indent=2)+'\n')
print(json.dumps({'event': 'GRANT', 'actualUtc': receipt['grantUtc'], 'baselineHead': ready['baselineHead'], 'scope': ready['scope']}), flush=True)
receipt['commandStartedUtc'] = utc()
receipt['childNaturallyClosed'] = False
receipt['interruptedOrExceptional'] = False
process = None
child_group = None
exception = None

def on_termination(signum, frame):
    raise SystemExit('controller received signal ' + str(signum))

signal.signal(signal.SIGTERM, on_termination)
try:
    with (candidate / 'timing.stdout').open('w') as stdout, (candidate / 'timing.stderr').open('w') as stderr:
        process = subprocess.Popen(receipt['argv'], cwd=repo, stdout=stdout, stderr=stderr, start_new_session=True)
        child_group = process.pid
        receipt['childPid'] = process.pid
        receipt['childProcessGroup'] = child_group
        receipt['childSpawnedUtc'] = utc()
        (out / 'command-START.json').write_text(json.dumps(receipt, indent=2)+'\n')
        process.wait()
        receipt['childNaturallyClosed'] = True
        receipt['actualChildNaturalClosedUtc'] = utc()
        receipt['exitCode'] = process.returncode
    receipt['externalSourceEnd'] = guards()
    receipt['externalSourcesUnchanged'] = receipt['externalSourceEnd'] == external_start
    if (candidate / 'timing-latest.json').exists():
        report = json.loads((candidate / 'timing-latest.json').read_text())
        receipt.update(naturalClosedUtc=report['closedUtc'], harnessStartedUtc=report['startedUtc'], sourcesUnchanged=report['sourcesUnchanged'], harnessGuardCount=len(report['sourceStart']), proofBridge=report.get('documentationProofBridge'), summaries=report.get('summaries'), phaseCount=len(report.get('phases', [])), allCalls=report.get('totalMeasuredCalls'), timingReportSha256=sha(candidate/'timing-latest.json'))
        assert receipt['phaseCount'] == 24 and receipt['allCalls'] == 12000000
        assert report['passed'] and report['sourcesUnchanged']
    else:
        receipt['stderr'] = (candidate / 'timing.stderr').read_text()
except BaseException as error:
    exception = error
    receipt['interruptedOrExceptional'] = True
    receipt['exceptionType'] = type(error).__name__
    receipt['exception'] = str(error)
    receipt['exceptionTraceback'] = traceback.format_exc()
finally:
    # This encompasses every operation after Popen, including output/guard/JSON failures.
    if process is not None:
        if process.poll() is None:
            receipt['forcedCleanupUsed'] = True
            try:
                os.killpg(child_group, signal.SIGTERM)
            except ProcessLookupError:
                pass
            try:
                process.wait(timeout=10)
            except subprocess.TimeoutExpired:
                try:
                    os.killpg(child_group, signal.SIGKILL)
                except ProcessLookupError:
                    pass
                process.wait()
        # Always wait even after poll(): direct child is reaped before any acceptance.
        process.wait()
        receipt['actualChildWaitClosedUtc'] = utc()
        receipt['actualChildExitCode'] = process.returncode
        receipt['directChildReaped'] = True
        try:
            raw_after = subprocess.check_output(['ps', '-eo', 'pid,ppid,pgid,stat,comm'], text=True)
            group_live = [line for line in raw_after.splitlines()[1:] if int(line.split()[2]) == child_group and not line.split()[3].startswith('Z')]
            receipt['ownedGroupLiveAfterWait'] = group_live
            if group_live:
                receipt['interruptedOrExceptional'] = True
                receipt['forcedGroupCleanupUsed'] = True
                try:
                    os.killpg(child_group, signal.SIGKILL)
                except ProcessLookupError:
                    pass
                # No natural acceptance is possible if the owned group survived.
                raw_final = subprocess.check_output(['ps', '-eo', 'pid,ppid,pgid,stat,comm'], text=True)
                receipt['ownedGroupLiveAfterCleanup'] = [line for line in raw_final.splitlines()[1:] if int(line.split()[2]) == child_group and not line.split()[3].startswith('Z')]
            else:
                receipt['ownedGroupLiveAfterCleanup'] = []
        except BaseException as cleanup_error:
            receipt['interruptedOrExceptional'] = True
            receipt['cleanupObservationException'] = str(cleanup_error)
            try:
                os.killpg(child_group, signal.SIGKILL)
            except ProcessLookupError:
                pass
            process.wait()
    else:
        receipt['directChildReaped'] = False
        receipt['ownedGroupLiveAfterCleanup'] = []
    receipt['commandClosedUtc'] = utc()
    receipt['naturalAcceptanceEligible'] = bool(process is not None and receipt['childNaturallyClosed'] and not receipt['interruptedOrExceptional'] and receipt.get('externalSourcesUnchanged') and receipt.get('sourcesUnchanged') and process.returncode == 0 and receipt.get('phaseCount') == 24 and receipt.get('allCalls') == 12000000 and not receipt.get('ownedGroupLiveAfterCleanup'))
    (out / 'command-CLOSED.json').write_text(json.dumps(receipt, indent=2)+'\n')
    print(json.dumps({k: receipt.get(k) for k in ['naturalClosedUtc', 'commandClosedUtc', 'exitCode', 'sourcesUnchanged', 'externalSourcesUnchanged', 'harnessGuardCount', 'phaseCount', 'allCalls', 'summaries', 'directChildReaped', 'ownedGroupLiveAfterCleanup', 'interruptedOrExceptional', 'naturalAcceptanceEligible']}), flush=True)
if exception is not None:
    raise SystemExit(1)
raise SystemExit(process.returncode if receipt['naturalAcceptanceEligible'] else 2)
