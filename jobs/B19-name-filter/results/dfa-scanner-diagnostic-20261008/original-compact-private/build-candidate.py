"""Private exact-regex deterministic scanner candidate, not acceptance."""
from pathlib import Path
import hashlib,json,shutil,datetime,gzip
repo=Path(__file__).resolve().parents[2];job=repo/'jobs/B19-name-filter';out=Path(__file__).resolve().parent
expected='41442670786856c1dfa98a5755bd21273287047750035f419249ab7402e8505d'
raw=(job/'nameFilter.ts').read_bytes();assert hashlib.sha256(raw).hexdigest()==expected
s=raw.decode();begin=s.index('// A repeated-letter pattern cannot consume fewer letters');end=s.index('const CONTROLS',begin)
scanner=(out/'scanner-source.txt').read_text();candidate=s[:begin]+scanner+s[end:]
needle='if ((BY_LENGTH[text.length] ?? BAD).test(text))';assert candidate.count(needle)==1;candidate=candidate.replace(needle,'if (blocked(text))')
(out/'baseline-nameFilter.ts').write_bytes(raw);(out/'candidate-nameFilter.ts').write_text(candidate)
config=json.loads((job/'tsconfig.json').read_text());config['compilerOptions']['outDir']='compiled';config['include']=['candidate-nameFilter.ts'];(out/'tsconfig.json').write_text(json.dumps(config,indent=2)+'\n');(out/'package.json').write_text('{"type":"module","private":true}\n')
fixture=(job/'tests/run.mjs').read_bytes();assert hashlib.sha256(fixture).hexdigest()=='bff0c17b62aa75d342527a8ced855678380411053476557acde61f2e1b6fbdd9'
declarations=fixture.decode();declarations=declarations[declarations.index('function rng(seed)'):declarations.index('// Full command must never')]
prior=(repo/'.work/B19-trie-candidate/original-workload-declarations.mjs').read_text();header=prior[:prior.index('function rng(seed)')]
(out/'original-workload-declarations.mjs').write_text(header+declarations+'\nexport {makeObfuscations, makeFuzz, positive, fixed, mappingCases, knownCases, rangeCases, lengthBoundaryCases, addedNameCases, rng, pick};\n')
harness=(repo/'.work/B19-trie-candidate/exact-harness.mjs').read_text().replace('693d9501633b9099676d38cf2d215bdf3dab570b3e8d300f485d685e2be2f15f',expected).replace('private-prefix-trie-nonacceptance','private-exact-regex-deterministic-scanner-nonacceptance').replace("'build-candidate.py', 'build-receipt.json'","'build-candidate.py', 'scanner-source.txt', 'build-receipt.json'")
(out/'exact-harness.mjs').write_text(harness);shutil.copytree(job/'dist',out/'baseline-loaded/dist')
receipt={'kind':'prospective-exact-regex-scanner-preparation','preparedUtc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'sourceSha256':expected,'candidateSha256':hashlib.sha256(candidate.encode()).hexdigest(),'originalRunnerSha256':hashlib.sha256(fixture).hexdigest(),'originalMatcherBlockSha256':hashlib.sha256(s[begin:end].encode()).hexdigest(),'candidateSourceGzipLevel9Bytes':len(gzip.compress(candidate.encode(),compresslevel=9)),'candidateChange':'Compile the exact existing BAD.source token language to a bounded startup deterministic table; preserve substring restart, repetition minima, i/l/# classes and original mapping/control/SAFE/results. Length >16 expansions and construction bounds retain the complete original regex fallback. All original mutant anchors still affect the actual matcher or mapping.','heavyCheckStarted':False,'timingStarted':False,'historicalOutlierCauseClaimed':False}
(out/'build-receipt.json').write_text(json.dumps(receipt,indent=2)+'\n');print(json.dumps(receipt))

# Separate size-fitting variant: only comments/empty lines are removed from
# the prospective scanner source; every TypeScript semantic token is retained.
import re
p=out/'candidate-nameFilter.ts';uncompacted=p.read_text()
compact=re.sub(r'/\*[\s\S]*?\*/','',uncompacted)
compact=re.sub(r'(?m)^\s*//[^\n]*\n','',compact)
compact=compact.replace(" // Unmapped letters are barriers, never silently deleted.","")
compact=re.sub(r'(?m)^\s*\n','',compact)
p.write_text(compact)
receipt['kind']='prospective-size-fitting-exact-regex-scanner-preparation'
receipt['initialUncompactedCandidateSha256']=hashlib.sha256(uncompacted.encode()).hexdigest()
receipt['candidateSha256']=hashlib.sha256(compact.encode()).hexdigest()
receipt['candidateSourceGzipLevel9Bytes']=len(gzip.compress(compact.encode(),compresslevel=9))
receipt['sizeOnlyDifference']='Remove source comments and empty lines only; no semantic token or mutation anchor changes.'
(out/'build-receipt.json').write_text(json.dumps(receipt,indent=2)+'\n')
print(json.dumps(receipt))
