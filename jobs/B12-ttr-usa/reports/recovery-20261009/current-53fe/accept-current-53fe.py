import pathlib,json,hashlib,zipfile,io,struct,time,re,importlib.metadata
from jsonschema import Draft202012Validator
ROOT=pathlib.Path('/tmp/gpt-drops-B12-audit-20261009/.work/20261009-audit/current-53fe/source');J=ROOT/'jobs/B12-ttr-usa';W=pathlib.Path('/tmp/gpt-drops-B12-audit-20261009/.work/20261009-audit/current-53fe');HEAD='53fe4e0c7109cf59c0e49ca53720912649900bd8'
sha=lambda b:hashlib.sha256(b).hexdigest()
f=json.loads((W/'current-source-files.json').read_text());tree=json.loads((W/'current-tree.json').read_text());native={x['path']:x for x in tree['tree'] if x['type']=='blob'}
assert not tree['truncated'] and set(f)==set(native) and len(f)==178
for n,v in f.items():
 b=(ROOT/n).read_bytes();assert len(b)==v['bytes']==native[n]['size'] and sha(b)==v['sha256'] and v['gitSHA']==native[n]['sha'],n
baseline=json.loads((J/'reports/recovery-20261009/frozen-original-source-files.json').read_text())
allowedOriginalChanges={'.github/workflows/B12.yml','jobs/B12-ttr-usa/ASSUMPTIONS.md','jobs/B12-ttr-usa/LOOP.md','jobs/B12-ttr-usa/NEXT.md','jobs/B12-ttr-usa/README.md','jobs/B12-ttr-usa/SHA256SUMS.txt','jobs/B12-ttr-usa/VERIFY.md','jobs/B12-ttr-usa/tests/run.mjs','jobs/B12-ttr-usa/tools/polish-check.mjs','jobs/B12-ttr-usa/tools/reopen.py','jobs/B12-ttr-usa/ttr.ts'}
assert len(baseline)==112
for n,v in baseline.items():
 if n not in allowedOriginalChanges:assert sha((ROOT/n).read_bytes())==v['sha256'],n
manifest=[]
for line in (J/'SHA256SUMS.txt').read_text().splitlines():
 h,n=line.split('  ');p=(J/n).resolve();assert p.is_relative_to(ROOT) and sha(p.read_bytes())==h;manifest.append(p.relative_to(ROOT).as_posix())
assert len(manifest)==172 and set(manifest)=={n for n in f if n.startswith('jobs/B12-ttr-usa/') and not n.endswith('/SHA256SUMS.txt')}
assert sha((ROOT/'.github/workflows/B12.yml').read_bytes())==f['.github/workflows/B12.yml']['sha256']
run=json.loads((W/'current-run.json').read_text());jobs=json.loads((W/'current-jobs.json').read_text())['jobs'];arts=json.loads((W/'current-artifacts.json').read_text())['artifacts']
assert run['head_sha']==HEAD and run['id']==37923690901 and run['status']=='completed' and run['conclusion']=='success'
assert len(jobs)==1 and jobs[0]['id']==113797469570 and jobs[0]['status']=='completed' and jobs[0]['conclusion']=='success' and all(s['status']=='completed' and s['conclusion']=='success' for s in jobs[0]['steps'])
assert len(arts)==1 and not arts[0]['expired'] and arts[0]['workflow_run']['id']==run['id'] and arts[0]['workflow_run']['head_sha']==HEAD
a=arts[0];b=(W/'current-official.zip').read_bytes();assert len(b)==a['size_in_bytes'] and 'sha256:'+sha(b)==a['digest']
eocd=b.rfind(bytes([80,75,5,6]));assert eocd>=0 and eocd+22+struct.unpack_from('<H',b,eocd+20)[0]==len(b)
files={}
with zipfile.ZipFile(io.BytesIO(b)) as z:
 assert z.testzip() is None
 for e in z.infolist():
  p=pathlib.PurePosixPath(e.filename);assert not p.is_absolute() and '..' not in p.parts and not e.is_dir() and e.filename not in files and e.file_size<=30000000 and (e.external_attr>>16)&0o170000!=0o120000
  files[e.filename]=z.read(e)
assert len(files)==51
s=json.loads(files['summary.json']);assert s['passed'] and s['nodeVersion']=='v22.16.0' and s['typescriptVersion']=='5.9.3' and s['seeds']==[1,2,3]
assert {x['suite'] for x in s['suites']}=={'review','data','oracle-self','probe','graphs','games','mutations'} and len(s['suites'])==7 and all(x['passed'] for x in s['suites'])
assert len(s['fingerprints'])==48
for n,h in s['fingerprints'].items():assert sha((J/n).read_bytes())==h,n
graphs=json.loads(files['graphs.json']);assert graphs['passed'] and graphs['assertions']==s['graphComparisons']==186053 and graphs['discrepancies']==[] and graphs['seeds']==s['graphs']
assert graphs['sourceHashes']['primary']==sha((J/'ttr.ts').read_bytes()) and graphs['sourceHashes']['amended']==sha((J/'reference.ts').read_bytes())
for i,g in enumerate(graphs['seeds'],1):assert g=={'seed':i,'graphs':20000,'exhaustiveSubsetComparisons':20000,'checks':60000}
games=json.loads(files['games.json']);assert games['passed'] and len(games['seeds'])==3
oldgames=json.loads((J/'reports/pre-loop-full-games.json').read_text())
for i,g in enumerate(games['seeds']):
 assert g==oldgames['seeds'][i] and {k:v for k,v in g.items() if k!='samples'}==s['fullGames'][i]
 assert g['seed']==i+1 and g['completedGames']==g['endedByTrainsAndFullFinalRound']==2000 and g['passed'] and g['maxOwned']<=27 and g['minTurns']>0 and g['maxTurns']<1500 and g['claims']>0 and g['turns']>g['claims'] and re.fullmatch('[a-f0-9]{64}',g['replaySHA256'])
assert sum(x['checks'] for x in games['seeds'])==13880102
mut=json.loads(files['mutations.json']);assert mut['passed'] and mut['baselineSHA256']==sha((J/'ttr.ts').read_bytes()) and mut['isolatedMutations']==mut['strictCompiled']==25 and mut['behavioralKills']==75 and s['mutations']=={'isolated':25,'compiled':25,'kills':75}
assert len(mut['records'])==25 and {x['id'] for x in mut['records']}==set(range(1,26))
source=(J/'ttr.ts').read_text()
for x in mut['records']:
 assert x['strictCompiled'] and source.count(x['from'])>=1 and sha(source.replace(x['from'],x['to'],1).encode())==x['sourceSHA256']
 assert len(x['seeds'])==3 and {y['seed'] for y in x['seeds']}=={1,2,3} and all(y['killed'] and y['status']!=0 and 'AssertionError' in y['evidence'] for y in x['seeds'])
data=json.loads(files['data.json']);assert data['passed'] and len(data['seeds'])==3 and importlib.metadata.version('jsonschema')=='4.26.0'
schema=json.loads((J/'usa.schema.json').read_text());Draft202012Validator.check_schema(schema);validator=Draft202012Validator(schema)
for seed,d in enumerate(data['seeds'],1):
 assert d['seed']==seed and d['checks']==2903 and d['schemaCases']==125 and d['passed']
 expected=json.loads(files[f'schema-{seed}.json']);assert expected==d['standardOutput'] and expected['cases']==125 and expected['schemaValid'] and expected['passed'] and expected['valid']==[True]+[False]*124
 cases=json.loads(files[f'schema-cases-{seed}.json'])['cases'];assert len(cases)==125
 actual=[not list(validator.iter_errors(case)) for case in cases];assert actual==expected['valid']
 assert {k:v for k,v in d.items() if k!='standardOutput'}==s['data'][seed-1]
goldens=[json.loads(x) for x in files['probe.log'].decode().strip().splitlines()];assert goldens==s['goldens'] and len(goldens)==3 and all(x['checks']==175 and x['passed'] and x['seed']==i+1 for i,x in enumerate(goldens))
oracle=json.loads(files['oracle-self.json']);assert oracle['passed']
for kind in ['original','amended']:
 o=oracle[kind];assert o['passed'] and o['assertions']==22292 and o['randomGraphChecks']==[{'seed':i,'graphs':2000,'maxEdges':12} for i in [1,2,3]] and o['scoringChecks']==[{'seed':i,'games':1000,'legalClaims':1000} for i in [1,2,3]]
for n in ['reference.ts','selfcheck.mjs','amended-reference.ts','amended-selfcheck.mjs','primary-probe.ts','probe.mjs','sparse-replay.mjs','SEALED-SHA256SUMS.txt','AMENDED-SHA256SUMS.txt']:
 assert files['oracle-replay/'+n]==(J/'reports/oracle-archive'/n).read_bytes(),n
review=json.loads(files['review.json']);assert review['passed'] and review['timingClaim'] is False and len(review['seeds'])==3
for i,row in enumerate(review['seeds'],1):assert row['seed']==i and row['passed'] and row['assertions']==624 and row['validExtensionPreservationControls']==40 and row['originalOracleLimitation']
controls=review['toolControls'];assert controls['passed'] and controls['actualCLIControls']==3 and controls['actualHTTPControls']==5 and controls['temporaryOwnedControllersClosed']
assert len(controls['rows'])==4
for i,mode in enumerate(['bad-small','bad-budget','correct']):
 row=controls['rows'][i];assert row['mode']==mode and row['naturallyClosed']
 outs=row['output']
 if mode=='correct':assert row['actualCLIStatus']==0 and len(outs)==2 and outs[0]['cases']==300 and outs[1]['setsCompared']==1000 and all(o['valueMismatches']==0 for o in outs)
 else:
  assert row['actualCLIStatus']!=0 and outs[-1]['valueMismatches']>0
  if mode=='bad-budget':assert outs[0]['cases']==300 and outs[0]['valueMismatches']==0 and outs[1]['setsCompared']==1000
 log=files['review-compare-'+mode+'.log'].decode()
 for o in outs:assert '"valueMismatches":'+str(o['valueMismatches']) in log
 if mode!='correct':assert 'comparison failed' in log
http=controls['rows'][3];assert http['mode']=='reopen-HTTP-component' and http['passed'] and http['actualComponentExecuted'] and http['controls']==5 and http['transportOnly'] and not http['freshResearchClaim']
assert json.loads(files['review-tools.log'].decode().strip().splitlines()[-1])==controls
assert json.loads(files['review-reopen.log'].decode().strip())=={k:v for k,v in http.items() if k!='mode'}
assert json.loads(files['review.log'].decode().strip().splitlines()[-1])==review
catalog=json.loads((J/'usa.json').read_text());rows=json.loads((J/'reports/fact-rows.json').read_text());cite=json.loads((J/'citations.json').read_text());registry=json.loads((J/'sources/index.json').read_text());reopen=json.loads((J/'reports/source-reopening.json').read_text())
assert len(rows)==len(reopen['rows'])==264 and len(cite)==528 and len(registry)==len(reopen['sources'])==14 and reopen['passNumber']==2 and reopen['sourcesReopened']==14 and reopen['factRowsRechecked']==264 and reopen['passed']
for row in rows:
 actual=catalog[row['category']][int(row['rowId'].split('/')[1])];assert actual['confidence']==row['confidence'] and actual['evidence']==row['evidence'] and len(row['evidence'])==2
 c=[cite[n] for n in row['evidence']];assert all(len(x['quote'].split())<=25 and x['quote'] for x in c) and len({registry[x['source']]['author'] for x in c})==2
 rr=next(x for x in reopen['rows'] if x['rowId']==row['rowId']);assert rr['passed'] and rr['confidence']==row['confidence'] and rr['passNumber']==2 and set(rr['sourceIds'])=={x['source'] for x in c} and rr['checkedFields']
for name,x in registry.items():
 rec=reopen['sources'][name];assert rec['url']==x['url']
 if 'sha256' in rec:assert rec['sha256']==x['firstSha256'] and rec['httpStatus']==200 and rec['sameAsFirstBytes']
 else:assert rec['toolSuccess'] and rec['retrievalSha256'] and rec['characters']>0
 if x['firstLocalFile'].startswith('sources/') and not x['firstLocalFile'].endswith('.pdf'):assert sha((J/x['firstLocalFile']).read_bytes())==x['firstSha256']
assert [len(catalog[x]) for x in ['cities','routes','baseTickets','usa1910Tickets']]==[36,100,30,69] and sum(x['length'] for x in catalog['routes'])==309
lb=(W/'current-full-native-log.log').read_bytes();log=lb.decode('utf-8-sig');plain=[x.partition(' ')[2] if len(x)>20 and x[:4].isdigit() and x[4]=='-' and 'T' in x[:11] else x for x in log.splitlines()];objects=[]
for line in plain:
 try:o=json.loads(line)
 except ValueError:continue
 objects.append(o)
assert {'passed':True,'graphs':60000,'fullGames':6000,'mutations':25,'kills':75,'fingerprints':48} in objects
for n in manifest:assert n.removeprefix('jobs/B12-ttr-usa/')+': OK' in plain,n
assert str(a['id']) in log and a['digest'].removeprefix('sha256:') in log and '> npm run build && node tests/run.mjs' in log
assert sum(1 for x in objects if isinstance(x,dict) and x.get('validator')=='jsonschema Draft202012Validator' and x.get('cases')==1 and x.get('valid')==[True] and x.get('passed'))==3
assert all(sha((ROOT/n).read_bytes())==v['sha256'] for n,v in f.items())
receipt={'accepted':True,'source':HEAD,'workflowRun':run['id'],'job':jobs[0]['id'],'artifact':a['id'],'archiveBytes':len(b),'archiveSHA256':sha(b),'fullSafeUniqueZipMembers':len(files),'nativeSourceInputs':178,'manifestOwnPayloadEntries':172,'workflowSeparatelyNativeHashVerified':True,'fullNativeBytes':len(lb),'fullNativeSHA256':sha(lb),'sourceFingerprints':48,'smallGraphs':60000,'fullGraphComparisons':186053,'fullGames':6000,'fullGameConservationChecks':13880102,'allOriginalThreeGameDigestsAndCountsMatchPreLoop':True,'schemaCasesActuallyIndependentlyRevalidated':375,'standaloneCanonicalSchemaAudits':3,'immutableGoldens':525,'actualStrictCompiledVariants':25,'actualSeededRuntimeMutationKills':75,'storedHistoricalResearchRows':264,'storedHistoricalResearchCitations':528,'storedHistoricalSecondPassSources':14,'newNetworkResearchReopeningClaim':False,'researchScope':'All stored historical source/row/citation/provenance and factual snapshots rechecked; no fresh current network pass or new fact promotion claimed. Actual fetch-component missing-cache/change/hash/cache-conflict controls accepted separately; no whole fresh public-network re-opening claimed.','allSourceAndOriginalSealsAndReportsFrozen':True,'priorInheritedCoreRegressionPreservedAndCorrected':True,'deliveryReady':False,'remainingDeliveryRequirement':'Three actual successful logged/pushed postgreen no-gain reviews and final exact source whole acceptance.','focusedCurrentAssertions':1872,'frozenExtensionMoves':120,'actualComparisonCLIControls':3,'actualHTTPTransportControls':5,'acceptedUTC':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())}
(W/'CURRENT-53FE-FULL-ACCEPTANCE.json').write_text(json.dumps(receipt,indent=2)+chr(10));print(json.dumps(receipt))
