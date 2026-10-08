from pathlib import Path, PurePosixPath
import json, hashlib, zipfile, stat, re, posixpath, math, datetime, subprocess

root = Path('/workspace/partybox-gpt-drops-B19-finish')
archive = root / '.work/B19-failed-hosted-3640/actual.zip'
prefix = 'jobs/B19-name-filter/'
head = '3640b628c9fdc36d4e3fcd51717743a7b5002e4f'
sha = lambda b: hashlib.sha256(b).hexdigest()
observations = []
def check(label, condition):
    if not condition:
        raise AssertionError(label)
    observations.append(label)

b = archive.read_bytes()
check('actual ZIP matches official byte count', len(b) == 11334866)
check('actual ZIP matches official SHA256', sha(b) == 'e0fb3e62ea544898db82f180e94e6835772f5f9fad311325c7a99350e9805b60')
with zipfile.ZipFile(archive) as z:
    names = z.namelist()
    check('ZIP has unique paths', len(names) == len(set(names)))
    for i in z.infolist():
        p = PurePosixPath(i.filename)
        check('safe ZIP entry: ' + i.filename, not p.is_absolute() and '..' not in p.parts and '\\' not in i.filename and not stat.S_ISLNK(i.external_attr >> 16))
    check('all ZIP member CRCs validate', z.testzip() is None)
    def data(path):
        return z.read(prefix + path)
    def obj(path):
        return json.loads(data(path))
    fresh_path = prefix + 'reports/latest/summary.json'
    check('choose unique actual fresh report, not historical results', sum(n == fresh_path for n in names) == 1)
    check('current runtime source hash', sha(data('nameFilter.ts')) == '7817489fc1d0908a87914223a84b31c15ea7e13b3555cb4238594751616f163d')
    check('current runner hash', sha(data('tests/run.mjs')) == 'bff0c17b62aa75d342527a8ced855678380411053476557acde61f2e1b6fbdd9')
    check('current policy retained', sha(data('data/policy.json')) == '3e3a3eab49e39e2971f02736a0bf6a189486436030ea4e58963fa2514efcd9e2')
    check('sealed reference actual bytes unchanged', sha(data('tests/blind/reference.mjs')) == '40449357a616619cc649d6b8efab2f6664a187de178511b8b0f17e28e92eea9a')
    check('original workload policy actual frozen bytes', sha(data('data/original-workload-policy.json')) == 'ac400db6c9733f6becc82df93f91cdde13563767d2b9b3883684779b28c48dc9')
    check('original corpus lock actual bytes unchanged', sha(data('data/snapshot-manifest.json')) == '46374224a6bfae76ac22ca87e77859d77d02353a26073bdfb72c91860ba79a6f')
    for path in ('nameFilter.ts', 'tests/run.mjs', 'data/policy.json', 'data/original-workload-policy.json'):
        committed = subprocess.check_output(['git', 'show', head + ':' + prefix + path], cwd=root)
        check('actual artifact equals exact committed head: ' + path, data(path) == committed)

    manifest = data('SHA256SUMS.txt')
    check('both current 828-entry manifests byte-identical', manifest == data('reports/latest/SHA256SUMS.txt'))
    paths = []
    for row in manifest.decode().splitlines():
        match = re.fullmatch(r'([0-9a-f]{64})  (.+)', row)
        check('manifest row valid', match is not None)
        digest, relative = match.groups()
        path = posixpath.normpath(prefix + relative)
        check('manifest path scoped', path.startswith(prefix) or path == '.github/workflows/B19.yml')
        check('actual delivery digest: ' + relative, path in names and sha(z.read(path)) == digest)
        committed = subprocess.check_output(['git', 'show', head + ':' + path], cwd=root)
        check('actual artifact equals every exact committed delivery file: ' + relative, z.read(path) == committed)
        paths.append(path)
    check('all828 actual delivered files checked once', len(paths) == 828 and len(set(paths)) == 828)
    check('all delivered files below30MB', all(len(z.read(p)) <= 30000000 for p in paths))

    lock = obj('data/snapshot-manifest.json')
    check('cache manifest matches original lock', obj('data/cache/manifest.json') == lock)
    for item in lock['outputs']:
        raw = data('data/cache/' + item['file'])
        rows = json.loads(raw)
        check('actual original corpus digest/count: ' + item['file'], sha(raw) == item['sha256'] and len(raw) == item['bytes'] and len(rows) == item['count'])
        check('actual retained corpus equals uploaded cache: ' + item['file'], raw == data('data/retained-snapshot/' + item['file']))

    s = obj('reports/latest/summary.json')
    check('actual fresh mode full,100 rows,one literal failure preserved', s['mode'] == 'full' and len(s['suites']) == 100 and len(s['failures']) == 1 and s['failures'][0]['name'] == 'latency-every-observed-check-under-005ms' and s['failures'][0]['seed'] == 2 and s['failures'][0]['passed'] == 9999)
    check('fresh summary bound to actual runtime and blind bytes', s['sourceSha256'] == sha(data('nameFilter.ts')) and s['blindReferenceSha256'] == sha(data('tests/blind/reference.mjs')))
    check('every non-latency suite passes; exact real failure retained', all(r['cases'] == r['passed'] for r in s['suites'] if r['name'] != 'latency-every-observed-check-under-005ms') and s['failures'] == [r for r in s['suites'] if r['cases'] != r['passed']])
    check('one acquisition and exactly33 rows each seed', sum(r.get('seed') is None for r in s['suites']) == 1 and all(sum(r.get('seed') == k for r in s['suites']) == 33 for k in (1, 2, 3)))
    native = (archive.parent / 'complete-native-job.log').read_text()
    native_rows = []
    for line in native.splitlines():
        match = re.search(r'(\{"name":.*\})', line)
        if match:
            try: native_rows.append(json.loads(match.group(1)))
            except json.JSONDecodeError: pass
    check('all actual100 fresh summary rows equal complete native job log rows', native_rows == s['suites'])
    check('full native log preserves failed command exit1', 'Process completed with exit code 1' in native)
    run = json.loads((archive.parent / 'native-run.json').read_text())
    official = json.loads((archive.parent / 'native-artifact.json').read_text())
    check('actual native run exact head and failed attempt1', run['head_sha'] == head and run['id'] == 37859732634 and run['run_attempt'] == 1 and run['status'] == 'completed' and run['conclusion'] == 'failure')
    check('official artifact exact head/size/digest', official['id'] == 11585970966 and official['size_in_bytes'] == len(b) and official['digest'] == 'sha256:' + sha(b) and official['workflow_run']['head_sha'] == head and not official['expired'])
    recorded = []
    for seed, sink in ((1,94721),(2,93467),(3,94479)):
        rows = [r for r in s['suites'] if r.get('seed') == seed]
        byname = {r['name']:r for r in rows}
        check('unique fresh suite names seed' + str(seed), len(byname) == 33)
        expected = {'names-reviewed-corpus-policy':20000,'words-reviewed-corpus-policy':10000,'places-reviewed-corpus-policy':2000,'sealed-blind-reference-differential':43830,'regex-vs-bitset-NFA-differential':43830,'mutation-baseline-truth':43830,'repeat-call-purity':43830,'boolean-wrapper':43830,'generated-obfuscations':5000,'25-real-executed-mutations':25,'retained-original-snapshot-offline-and-corruption':8,'length-pruned-matcher-blind-boundaries':24873,'additional-given-names-and-exception-bypass':30,'original-workload-policy-and-counts':6,'failure-suggestions-map-and-frozen':5,'latency-every-observed-check-under-005ms':10000}
        check('all original and supplemental required counts seed' + str(seed), all(byname[n]['cases'] == count and byname[n]['passed'] == (9999 if n == 'latency-every-observed-check-under-005ms' and seed == 2 else count) for n,count in expected.items()))
        check('actual integrity828 seed' + str(seed), byname['delivery-file-size-and-checksums']['files'] == 828 and byname['delivery-file-size-and-checksums']['checked'] == 828 and byname['delivery-file-size-and-checksums']['failures'] == [])
        check('original workload guard fields seed' + str(seed), byname['original-workload-policy-and-counts']['fixedCases'] == 459 and byname['original-workload-policy-and-counts']['fullCases'] == 43830 and byname['original-workload-policy-and-counts']['benchmarkPositiveInputs'] == 48)
        mutants = obj('reports/latest/mutations-seed' + str(seed) + '.json')
        check('actual25 executable mutant receipts seed' + str(seed), len(mutants) == 25 and len({m['id'] for m in mutants}) == 25 and all(m['seed'] == seed and m['killed'] and m['cases'] == 43830 and m['excludedBaselineFailures'] == 0 and m['disagreements'] > 0 and m['witness'] is not None and re.fullmatch('[0-9a-f]{64}',m['mutantSha256']) for m in mutants))
        obf = [json.loads(line) for line in data('reports/latest/obfuscations-seed' + str(seed) + '.jsonl').decode().splitlines()]
        check('actual5000 generated fixtures seed' + str(seed), len(obf) == 5000 and len({r['input'] for r in obf}) == 5000 and all(r['expected'] == 'blocked' and len(r['input']) <= 16 for r in obf))
        check('all63 policy terms covered seed' + str(seed), {r['term'] for r in obf} == set(obj('data/policy.json')['terms']))
        bench = obj('reports/latest/benchmark-seed' + str(seed) + '.json')
        row = byname['latency-every-observed-check-under-005ms']
        check('actual benchmark equals every corresponding summary field seed' + str(seed), all(row[k] == value for k,value in bench.items()))
        check('recorded literal failed or passing gate and original seeded sink seed' + str(seed), bench['calls'] == 10000 and bench['sink'] == sink and bench['over005Ms'] == (1 if seed == 2 else 0) and len(bench['outliers']) == bench['over005Ms'] and row['passed'] == 10000-bench['over005Ms'] and all(0 <= item['index'] < 10000 and item['timeMs'] > 0.05 and math.isfinite(item['timeMs']) for item in bench['outliers']) and ((seed == 2 and bench['maxMs'] == 0.5130060000001322 and max(v['timeMs'] for v in bench['outliers']) == bench['maxMs']) or (seed != 2 and 0 <= bench['maxMs'] <= 0.05)) and all(math.isfinite(bench[k]) and bench[k] >= 0 for k in ('meanMs','p50Ms','p99Ms','maxMs')))
        recorded.append({'seed':seed,'calls':bench['calls'],'recordedMaximumMs':bench['maxMs'],'recordedOutliers':bench['over005Ms'],'originalSink':bench['sink']})
    receipt = {'kind':'actual-failed-hosted-artifact-independent-structural-and-byte-validation','head':head,'runId':37859732634,'jobId':113592343584,'artifactId':11585970966,'actualZipBytes':len(b),'actualZipSha256':sha(b),'validatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'actualFreshSummaryPath':fresh_path,'sourceSha256':s['sourceSha256'],'freshSuiteRowsExecuted':100,'freshSuiteRowsPassed':99,'literalAcceptancePassed':False,'failedLiteralGatePreserved':True,'actualDeliveredHashesChecked':828,'originalFullCasesPerSeed':43830,'recordedBenchmarks':recorded,'checksPassed':len(observations),'scope':'Actual failed artifact bytes and all fresh receipts are independently bound to exact3640b62 source. The actual seed-2 hosted literal failure, maximum0.513006ms is required and preserved; recorded summaries/outliers are verified as recorded, not claimed to contain or recompute every individual timed call. This does not erase the unchanged runtime source first local12/9/2 failure or any prior source failure, finish KEEP, establish a cause or prove a hardware-independent bound.'}
    (archive.parent/'independent-failed-hosted-validation.json').write_text(json.dumps(receipt,indent=2)+'\n')
    print(json.dumps(receipt,indent=2))
