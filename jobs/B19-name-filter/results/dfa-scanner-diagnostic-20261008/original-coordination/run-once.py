"""One root-delegated original-sample private comparison, never acceptance."""
from pathlib import Path
import datetime,json,hashlib,subprocess

repo=Path(__file__).resolve().parents[2]
out=Path(__file__).resolve().parent
candidate=repo/'.work/B19-dfa-compact-candidate'
utc=lambda:datetime.datetime.now(datetime.timezone.utc).isoformat()
assert not (candidate/'timing-latest.json').exists()
assert not (candidate/'timing.stdout').exists()
ready=json.loads((candidate/'TIMING_READY.json').read_text())
assert ready['guards']==480 and ready['timingStarted'] is False
assert ready['candidateSourceSha256']=='ae8dc388665a4b4241b40b7ce1b86ba98e9eaadde7facefddf8ee47a00858e8a'
assert ready['candidateJsSha256']=='330968b37089918bf450bb0a8a4546133e855c55df2aafe462d36be7aa4c6b8e'
eq=json.loads((candidate/'equivalence-latest.json').read_text())
for key,digest in eq['sourceEnd'].items():
    path=(repo/'jobs/B19-name-filter'/key[4:]) if key.startswith('job/') else candidate/key[8:]
    assert hashlib.sha256(path.read_bytes()).hexdigest()==digest,key
acks=json.loads((out/'ACKS.json').read_text())
assert set(acks)=={'G04','G08','G09','G10','tracker'}
assert all(value['zeroWorkload'] and value['zeroWriter'] for value in acks.values())
raw=subprocess.check_output(['ps','-eo','pid,ppid,pgid,stat,comm,pcpu,rss'],text=True)
lines=raw.splitlines();live=[line for line in lines[1:] if not line.split()[3].startswith('Z')]
(out/'pre-grant-processes.txt').write_text(lines[0]+'\n'+'\n'.join(live)+'\n')
blocked=[line for line in live if line.split()[4] in {'node','MainThread','chromium','chrome','headless_shell','ffmpeg','ffprobe','tsc','tsx','esbuild'}]
assert not blocked,blocked
r={'grantUtc':utc(),'kind':'root-delegated-single-exact-regex-DFA-private-ABBA-BAAB','acknowledgments':acks,'rootZeroWorkloadAndWriter':True,'runnableWorkloads':blocked,'liveProcesses':live,'ignoredZombieEntries':len(lines)-1-len(live),'STOPorCONTUsed':False,'sourceSha256':'41442670786856c1dfa98a5755bd21273287047750035f419249ab7402e8505d','candidateSourceSha256':ready['candidateSourceSha256'],'candidateJsSha256':ready['candidateJsSha256'],'readyReceiptSha256':hashlib.sha256((candidate/'TIMING_READY.json').read_bytes()).hexdigest(),'controllerSha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'argv':ready['argv'],'originalAcceptanceNotRun':True,'allPriorFailuresRetained':True}
(out/'grant.json').write_text(json.dumps(r,indent=2)+'\n')
print(json.dumps({'event':'GRANT','actualUtc':r['grantUtc'],'runnableWorkloads':blocked}),flush=True)
r['commandStartedUtc']=utc()
with (candidate/'timing.stdout').open('w') as a,(candidate/'timing.stderr').open('w') as b:
    p=subprocess.run(r['argv'],cwd=repo,stdout=a,stderr=b)
r['commandClosedUtc']=utc();r['exitCode']=p.returncode
if (candidate/'timing-latest.json').exists():
    report=json.loads((candidate/'timing-latest.json').read_text())
    r.update({'naturalClosedUtc':report['closedUtc'],'harnessStartedUtc':report['startedUtc'],'sourcesUnchanged':report['sourcesUnchanged'],'summaries':report.get('summaries'),'phaseCount':len(report.get('phases',[])),'allCalls':report.get('totalMeasuredCalls'),'timingReportSha256':hashlib.sha256((candidate/'timing-latest.json').read_bytes()).hexdigest()})
else:
    r['stderr']=(candidate/'timing.stderr').read_text()
(out/'command-CLOSED.json').write_text(json.dumps(r,indent=2)+'\n')
print(json.dumps(r),flush=True)
raise SystemExit(p.returncode)
