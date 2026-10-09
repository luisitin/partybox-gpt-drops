import hashlib,json,pathlib,re,struct,time,zipfile

ROOT=pathlib.Path('/tmp/gpt-drops-B07-audit-20261009')
JOB=ROOT/'jobs/B07-yahtzee-optimal'
WORK=ROOT/'.work/20261009-reverify'
HEAD='9c14f8525a2c7eda2acd50974b3781d1e0d74e0b'
digest=lambda b:hashlib.sha256(b).hexdigest()
expected=json.loads((WORK/'current-source-files.json').read_text())
tree=json.loads((WORK/'native-current-tree.json').read_text())
assert not tree['truncated']
native={e['path']:e for e in tree['tree'] if e['type']=='blob'}
for name,e in expected.items():
    data=(ROOT/name).read_bytes()
    assert digest(data)==e['sha256'] and native[name]['sha']==e['gitSHA'] and native[name]['size']==e['bytes'],name
run=json.loads((WORK/'current-native-run.json').read_text())
jobs=json.loads((WORK/'current-native-jobs.json').read_text())['jobs']
artifacts=json.loads((WORK/'current-native-artifacts.json').read_text())['artifacts']
assert run['head_sha']==HEAD and run['status']=='completed' and run['conclusion']=='success'
assert len(jobs)==1 and jobs[0]['status']=='completed' and jobs[0]['conclusion']=='success'
assert all(s['status']=='completed' and s['conclusion']=='success' for s in jobs[0]['steps'])
assert len(artifacts)==1 and not artifacts[0]['expired']
artifact=artifacts[0]
archive=(WORK/'current-9c14-official.zip').read_bytes()
assert len(archive)==artifact['size_in_bytes'] and 'sha256:'+digest(archive)==artifact['digest']
end=archive.rfind(b'PK\x05\x06')
assert end>=0 and end+22+struct.unpack_from('<H',archive,end+20)[0]==len(archive)
reports={}
with zipfile.ZipFile(WORK/'current-9c14-official.zip') as z:
    assert z.testzip() is None
    for entry in z.infolist():
        p=pathlib.PurePosixPath(entry.filename)
        assert not p.is_absolute() and '..' not in p.parts and not entry.is_dir()
        assert entry.filename not in reports and (entry.external_attr>>16)&0o170000!=0o120000
        assert entry.file_size<=30000000
        reports[entry.filename]=z.read(entry)
session=json.loads(reports['report-session.json'])
assert session['passed'] and session['result']=={'code':0,'signal':None} and not session['failure']
assert session['originalHashes']==session['restoredOriginalHashes']
source_reports={str(f.relative_to(JOB/'reports')):digest(f.read_bytes()) for f in (JOB/'reports').rglob('*') if f.is_file()}
assert session['originalHashes']==source_reports
assert session['originalReports']==len(source_reports)
assert session['capturedReports']==len(session['outputHashes'])
assert set(session['outputHashes'])==set(reports)-{'report-session.json'}
for name,h in session['outputHashes'].items():assert digest(reports[name])==h,name
runtime_names={'summary.json','partybox-port.json','action-superset-invariant.json','proof-cache-selfcheck.json','report-session-selfcheck.json'}
for seed in [1,2,3]:
    runtime_names|={f'{k}-seed-{seed}.json' for k in ['full','verification','mutations']}
    for mode in ['official','published']:
        runtime_names|={f'{k}-{mode}-seed-{seed}.json' for k in ['bridge','paired','simulation','primary-generation']}
        runtime_names.add(f'visited-{mode}-seed-{seed}.bin')
for name,h in source_reports.items():
    if name not in runtime_names:assert digest(reports[name])==h,'Historical input archive mutated '+name
summary=json.loads(reports['summary.json'])
required={'midgameStates':150000,'scoringCases':606528,'strictCompiledMutants':75,'runtimeKilledMutants':75,'fullPairedGames':6000000,'nativeDecisionComparisons':234000000,'nativeScoringTransitionComparisons':78000000,'visitedComponentVectors':985883,'directActualTypeScriptComponents':364338,'reusedVerifiedComponentVectors':621545}
assert summary['passed'] and summary['seeds']==[1,2,3] and summary['totals']==required
assert summary['runtime']['node']=='v22.16.0' and summary['runtime']['typescript']=='5.8.3'
isolation=summary['sourceIsolation']
assert [isolation[k] for k in ['historicalPrimaryFiles','independentFiles','adapterOriginalFiles','adapterFiles']]==[19,13,14,30]
assert isolation['immutableFiles']==len(isolation['sourceHashes'])
for name,h in isolation['sourceHashes'].items():assert digest((JOB/name).read_bytes())==h,name
log_bytes=(WORK/'current-9c14-full-native.log').read_bytes()
log=log_bytes.decode('utf-8-sig')
plain=[re.sub(r'^\d{4}-\d{2}-\d{2}T\S+Z ','',line) for line in log.splitlines()]
objects=[]
for line in plain:
    try:o=json.loads(line)
    except ValueError:continue
    if isinstance(o,dict):objects.append(o)
assert {'passed':True,'totals':required,'runtime':summary['runtime']} in objects
assert {'reportRestoration':'PASS','reports':'.verification/full-run-reports/latest','result':{'code':0,'signal':None}} in objects
assert all(f'B07 full seed {s}: PASS all required counts' in plain for s in [1,2,3])
assert 'npm ci' in log and 'npm test' in log and '> node run.mjs' in log
counts={k:0 for k in required};primary=[];cells=[]
for seed in [1,2,3]:
    suite=json.loads(reports[f'full-seed-{seed}.json'])
    assert suite==summary['suites'][seed-1] and suite['seed']==seed
    v=suite['verification'];m=suite['mutations']
    assert v==json.loads(reports[f'verification-seed-{seed}.json']) and v in objects
    assert m==json.loads(reports[f'mutations-seed-{seed}.json']) and m['passed'] and m['originalUnchanged']
    assert all({'seed':seed,**x} in objects and x['strictCompilation'] and x['runtimeKilled'] and x['failure'] for x in m['results'])
    assert len(m['results'])==25 and m['strictCompiled']==m['runtimeKilled']==25
    counts['midgameStates']+=v['random']['states'];counts['scoringCases']+=v['scoring']['scoringCases']
    counts['strictCompiledMutants']+=m['strictCompiled'];counts['runtimeKilledMutants']+=m['runtimeKilled']
    assert v['random']['states']==50000 and v['scoring']['scoringCases']==202176
    assert v['fullTables']['actionSupersetInvariant']['monotonicPairs']==536448
    assert len(suite['primaryRegenerations'])==len(suite['independentRegenerations'])==2
    for mode,g in zip(['official','published'],suite['primaryRegenerations']):
        assert g==json.loads(reports[f'primary-generation-{mode}-seed-{seed}.json'])
        assert {'standalonePrimaryGeneration':'PASS',**g} in objects
        assert g['mode']==mode and g['seed']==seed and g['validStates']==536448 and g['tableEntries']==1048576 and g['canonicalComponents']==359616
        assert g['regeneratedSHA256']==digest((JOB/'tables'/f'{mode}.bin').read_bytes())
        assert g['generatorSHA256']==digest((JOB/'generator.cpp').read_bytes())
        primary.append(g)
    for g in suite['independentRegenerations']:
        assert g['entries']==1048576 and g['validStates']==536448
        assert g['regeneratedSHA256']==digest((JOB/'independent'/f"{g['mode']}.bin").read_bytes())
    for mode,p in zip(['official','published'],suite['paired']):
        assert p==json.loads(reports[f'paired-{mode}-seed-{seed}.json'])
        assert {'suite':'paired-native-and-actual-TypeScript',**p} in objects
        s=p['simulation'];b=p['actualTypeScriptBridge']
        assert s==json.loads(reports[f'simulation-{mode}-seed-{seed}.json'])
        assert b==json.loads(reports[f'bridge-{mode}-seed-{seed}.json'])
        assert s['passed'] and s['games']==s['pairedResults']==1000000 and s['sigma']<=4
        assert abs(abs(s['mean']-s['expectedValue'])/s['standardError']-s['sigma'])<1e-10
        assert b['allPassed'] and b['records']==b['directRecords']+b['reusedRecords']
        keys=reports[f'visited-{mode}-seed-{seed}.bin'];assert len(keys)==b['records']*4
        entries=struct.unpack('<'+'I'*b['records'],keys);assert len(set(entries))==len(entries) and list(entries)==sorted(entries)
        assert digest(keys)==p['visitedKeysSHA256']==b['orderedComponentKeysSha256']
        assert p['regeneratedBinarySHA256']==digest((JOB/'tables'/f'{mode}.bin').read_bytes())
        for field,amount in [('fullPairedGames',s['games']),('nativeDecisionComparisons',s['decisionComparisons']),('nativeScoringTransitionComparisons',s['scoreTransitionComparisons']),('visitedComponentVectors',b['records']),('directActualTypeScriptComponents',b['directRecords']),('reusedVerifiedComponentVectors',b['reusedRecords'])]:counts[field]+=amount
        cells.append({'mode':mode,'seed':seed,'games':s['games'],'mean':s['mean'],'sigma':s['sigma'],'visitedRecords':b['records']})
assert counts==required and len(primary)==6
assert len([o for o in objects if o.get('strictCompilation') and o.get('runtimeKilled')])==75
selfcheck=json.loads(reports['report-session-selfcheck.json'])
assert {'reportSessionSelfcheck':selfcheck} in objects
assert selfcheck['passed'] and selfcheck['assertions']==47 and selfcheck['successfulInvocations']==2 and selfcheck['failedInvocations']==4 and selfcheck['syntheticReportTransportOnly']
assert len(selfcheck['records'])==6 and [r['passed'] for r in selfcheck['records']]==[True,True,False,False,False,False]
proof=json.loads(reports['proof-cache-selfcheck.json']);assert proof['passed'] and proof['assertions']==16 and sum(o==proof for o in objects)==3
port=json.loads(reports['partybox-port.json'])
assert port['passed'] and port['tables']=={'valid':1072896,'invalid':1024256}
assert [s['seed'] for s in port['suites']['seeds']]==[1,2,3] and [d['states'] for d in port['differential']]==[5548]*3
assert len(port['mutants'])==16 and all(m['killed'] and m['failure'] for m in port['mutants'])
assert len(port['adapter']['games'])==6 and all(g['games']==300 and abs(g['standardErrors'])<=4 for g in port['adapter']['games'])
native_ports=[o for o in objects if o.get('partyboxPort')=='PASS'];assert len(native_ports)==1
np=native_ports[0];assert np['tables']==port['tables'] and np['suites']==3 and np['differential']==16644 and np['mutantsKilled']==16 and np['seconds']==port['seconds']
assert np['adapterGames']==[f"{g['mode']}/{g['seed']}:{g['mean']:.2f} ({g['standardErrors']:.2f} SE)" for g in port['adapter']['games']]
assert len(objects)==97
assert str(artifact['id']) in log and artifact['digest'].split(':',1)[1] in log
for name,e in expected.items():assert digest((ROOT/name).read_bytes())==e['sha256'],name
receipt={'accepted':True,'source':HEAD,'workflowRun':run['id'],'job':jobs[0]['id'],'artifact':artifact['id'],'archiveBytes':len(archive),'archiveSHA256':digest(archive),'fullSafeUniqueZipMembers':len(reports),'nativeSourceInputs':len(expected),'immutableSourceHashes':len(isolation['sourceHashes']),'nativeJSONObjects':len(objects),'originalTrackedReportsRestored':len(source_reports),'freshRuntimeReports':session['capturedReports'],'sixActualStandalonePrimaryRegenerations':primary,'totals':counts,'fullNativeLogBytes':len(log_bytes),'fullNativeLogSHA256':digest(log_bytes),'cells':cells,'reportTransportAssertions':47,'completedUTC':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'scope':'Current exact9c14 genuine hosted full command and whole fresh archive accepted; originalReadyPR21 preserved, followup KEEP/Ready transition still requires actual checks.'}
(WORK/'CURRENT-9C14-FULL-ACCEPTANCE.json').write_text(json.dumps(receipt,indent=2)+'\n')
print(json.dumps(receipt,indent=2))
