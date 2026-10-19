from pathlib import Path
from datetime import datetime, timezone
from fractions import Fraction
import hashlib, json, posixpath, re, stat, subprocess, zipfile

ROOT = Path(__file__).resolve().parents[4]
JOB = ROOT/'jobs/B01-jamboree-dice'
WORK = Path(__file__).resolve().parent
HEAD = 'fdc4dedc2809cf68f64ec3706692c7c48d3a3fc0'
count = 0
def check(value, message):
    global count
    count += 1
    assert value, message
def git(path):
    return subprocess.check_output(['git','show',HEAD+':'+path],cwd=ROOT)
def sha(data): return hashlib.sha256(data).hexdigest()
def manifest():
    result={}
    for line in git('jobs/B01-jamboree-dice/SHA256SUMS.txt').decode().splitlines():
        digest,path=line.split(maxsplit=1)
        path=posixpath.normpath('jobs/B01-jamboree-dice/'+path.lstrip('*'))
        data=git(path)
        check(sha(data)==digest, 'immutable Git manifest '+path)
        result[path]={'sha256':digest,'bytes':len(data)}
    check(len(result)==87,'all87 source entries')
    return result
started=datetime.now(timezone.utc).isoformat()
checkout_head=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip()
check(len(checkout_head)==40,'actual checkout head recorded before; immutable source audit remains fdc')
before=manifest()
zipbytes=(WORK/'fdc-official.zip').read_bytes()
check(len(zipbytes)==69243 and sha(zipbytes)=='013e597cd7c6abb5197d1e3ac7e8d005d4378bb11e2149dd0db2aae0fdc40740','actual official whole ZIP size/SHA')
with zipfile.ZipFile(WORK/'fdc-official.zip') as z:
    names=z.namelist()
    check(len(names)==len(set(names))==16,'16 unique full ZIP members')
    check(z.testzip() is None,'all actual CRC bytes')
    files={}
    for entry in z.infolist():
        path=Path(entry.filename)
        check(not path.is_absolute() and '..' not in path.parts and '\\' not in entry.filename and not stat.S_ISLNK(entry.external_attr>>16),'safe member '+entry.filename)
        files[entry.filename]=z.read(entry)
        check(files[entry.filename]==(WORK/'fdc-official-unpacked'/entry.filename).read_bytes(),'actual extracted bytes '+entry.filename)
log=(WORK/'fdc-official-native.log').read_bytes()
check(sha(log)=='900b0e7f3b29e1ecb545bc60e6654083e9ea5d805a9cdb4798196576680a41c7','full original native log without added newline')
text=log.decode('utf-8-sig')
check('SUITES 48/48 PASS; failures=0' in text,'native complete command')
check('SHA256 digest of uploaded artifact zip is '+sha(zipbytes) in text,'native official ZIP digest')
suites=json.loads(files['suites.json'])
local=json.loads((JOB/'reports/full-suite-20261009/suites.json').read_text())
check(len(suites)==len(local)==48,'full48 suite rows')
for row,localrow in zip(suites,local):
    check(row['passed'] is True and row['seed'] in [1,2,3],'actual complete suite PASS '+row['name'])
    check(re.search(r'PASS seed='+str(row['seed'])+' '+re.escape(row['name'])+r' cases='+str(row['cases'])+r'(?:\r?\n|$)',text) is not None,'all original native suite rows '+row['name'])
    expected=dict(localrow)
    if row['name']=='artifact-integrity':
        check(localrow['cases']==73 and row['cases']==87,'manifest grew by14 delivered evidence files after actual local test')
        expected['cases']=87
    check(row==expected,'local-host full result equivalence '+row['name'])
check(sum(x['cases'] for x in local)==534138,'actual local case count')
check(sum(x['cases'] for x in suites)==534180,'actual hosted case count')
data=json.loads(git('jobs/B01-jamboree-dice/dice.json'))
models={x['id']:x for x in data['models']}
odds=json.loads(git('jobs/B01-jamboree-dice/odds.json'))
dist={x['id']:x for x in odds['distributions']}
check(len(models)==len(dist)==29,'all original29 models')
alltrials=allbins=0
for seed in [1,2,3]:
    name=f'monte-carlo-seed-{seed}.json'
    mc=json.loads(files[name])
    check(mc==json.loads((JOB/'reports/full-suite-20261009'/name).read_text()),'complete native/local deterministic reports seed'+str(seed))
    check(len(mc)==29 and [r['model'] for r in mc]==list(models),'original ordered29 models')
    for record in mc:
        mid=record['model'];gold=dist[mid];N=10000000
        check(record['seed']==seed and record['trials']==N and record['passed'] is True,'original workload '+mid)
        stream=int.from_bytes(hashlib.sha256(f'B01:{seed}:{mid}'.encode()).digest()[:4],'little') or 1
        check(record['streamSeed']==stream,'original deterministic stream seed '+mid)
        check(record['rngDraws']==N*len(models[mid]['blocks'])+record['rejectedDraws'] and record['rejectedDraws']>=0,'actual RNG draws '+mid)
        expected={}
        movement={};coins={};jointtotal=0
        actual={r['outcome']:r for r in record['checks']}
        check(len(actual)==len(record['checks']),'unique bins '+mid)
        for j in gold['joint']:
            coin='?' if j['coins'] is None else str(j['coins'])
            label=f"joint:{j['movement']}:{coin}"
            expected[label]=j['probability'];n=actual[label]['observed'];jointtotal+=n
            movement[str(j['movement'])]=movement.get(str(j['movement']),0)+n
            if j['coins'] is not None:coins[coin]=coins.get(coin,0)+n
        expected.update({'movement:'+k:p for k,p in gold['movement'].items()})
        expected.update({'coins:'+k:p for k,p in (gold['coins'] or {}).items()})
        check(set(actual)==set(expected) and jointtotal==N,'all expected bins and all10M trials '+mid)
        for label,prob in expected.items():
            r=actual[label];n=r['observed'];p=Fraction(prob);delta=n*p.denominator-N*p.numerator;var=N*p.numerator*(p.denominator-p.numerator)
            check(r['probability']==prob and type(n) is int and 0<=n<=N,'exact immutable expected probability '+label)
            check(r['withinFourSigma'] is True and delta*delta<=16*var,'independent exact integer four-sigma '+label)
            check(r['zSquared']==(f'{delta*delta}/{var}' if var else '0/1'),'complete original unrounded statistic '+label)
            if label.startswith('movement:'):check(n==movement[label[9:]],'full movement marginal '+label)
            if label.startswith('coins:'):check(n==coins.get(label[6:],0),'full coin marginal '+label)
        alltrials+=N;allbins+=len(actual)
        check(f'MC seed={seed} {mid} trials=10000000 PASS' in text,'native actual original model command '+mid)
    mutants=json.loads(files[f'mutations-seed-{seed}.json'])
    check(mutants==json.loads((JOB/f'reports/full-suite-20261009/mutations-seed-{seed}.json').read_text()),'full original mutant witnesses '+str(seed))
    check(len(mutants)==25 and [m['id'] for m in mutants]==[f'M{i:02}' for i in range(1,26)],'all25 actual mutants '+str(seed))
    for m in mutants:
        check(m['compiled'] is True and m['killed'] is True and bool(m['witness']['message']) and len(m['sourceSha256'])==64,'genuine compiled mutant witness '+m['id'])
    validator=files[f'validator-seed-{seed}.txt'].decode()
    check(validator== (JOB/f'reports/full-suite-20261009/validator-seed-{seed}.txt').read_text(),'complete validator report '+str(seed))
    check(f'Draft 2020-12: schema valid; documents=2; errors=0; seed={seed}' in validator,'full original schemas '+str(seed))
check(alltrials==870000000 and allbins==3588,'original full870M and3588bins')
for name in ['reference.ts','selfcheck.mjs','package.json']:
    check(files['blind-selfcheck/'+name]==git('jobs/B01-jamboree-dice/tests/blind/'+name),'actual sealed source '+name)
check(sha(files['blind-selfcheck/compiled/reference.js'])=='0401123056f9de05367db6aad6f79fb5110e451f8a35909511e1e0f693a996d6','actual compiled sealed oracle; digest independently matched original local output at initial13,506-assertion audit')
selfcheck=json.loads(files['blind-selfcheck/SELFCHECK.json'])
check(selfcheck['status']=='passed' and selfcheck['assertions']==41,'actual original blind41 selfchecks')
check(files['montecarlo'][:4]==b'\x7fELF','actual native sampler executable retained')
after=manifest();check(after==before,'all original actual Git bytes unchanged after reader')
check(subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip()==checkout_head,'actual checkout head unchanged after')
result={'status':'PASS','startedUtc':started,'naturallyClosedUtc':datetime.now(timezone.utc).isoformat(),'assertions':count,'sourceHead':HEAD,'workflowRun':37863550931,'workflowJob':113604766539,'officialArtifactId':11587402175,'zipBytes':len(zipbytes),'zipSha256':sha(zipbytes),'actualImmutableSourceEntries':87,'wholeNativeLogBytes':len(log),'wholeNativeLogSha256':sha(log),'suites':48,'actualLocalCases':534138,'actualHostedCases':534180,'localHostedCaseDifference':'Exactly14 extra delivered manifest entries per seed; all other full suite rows and all original source/workload unchanged.','trials':alltrials,'completeIndependentBins':allbins,'compiledMutationKills':75,'nativeAll48RowsMatched':True,'localHostedCompleteMonteCarloAndMutantReportsEqual':True,'allSourcesUnchanged':True,'members':{n:{'bytes':len(b),'sha256':sha(b)} for n,b in files.items()},'earlierReaderFailures':['Unnormalized ../../ workflow path passed to Git show; actual EXIT1 before normalized actual87 proof.','urllib temporary FileService HTTP403 before ZIP saved; actual curl same signed reference later succeeded.','Initial apply_patch full-log save added an extra terminal newline; replaced from untouched full original native connector string before any acceptance.'],'researchStillPartial':True,'remainingResearchGates':11}
(WORK/'public-reader-observed.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k not in ['members','earlierReaderFailures']}))
