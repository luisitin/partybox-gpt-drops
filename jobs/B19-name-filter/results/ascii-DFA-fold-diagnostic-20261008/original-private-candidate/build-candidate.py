"""Private current-DFA raw-letter shortcut; no production or acceptance edits."""
from pathlib import Path
from datetime import datetime, timezone
import gzip
import hashlib
import json
import shutil

repo = Path(__file__).resolve().parents[2]
job = repo / 'jobs/B19-name-filter'
out = Path(__file__).resolve().parent
sha = lambda raw: hashlib.sha256(raw).hexdigest()
expected = 'ae8dc388665a4b4241b40b7ce1b86ba98e9eaadde7facefddf8ee47a00858e8a'
raw = (job / 'nameFilter.ts').read_bytes()
assert sha(raw) == expected
s = raw.decode()
lower = 'const lower = (value: string): string => value.toLowerCase();\n'
fold = 'const ASCII_FOLD = Uint8Array.from({length: 128}, (_, code) => lower(String.fromCharCode(code)).charCodeAt(0) - 97);\n'
simple = '  const simple = SIMPLE_ASCII.test(input);\n'
shortcut = '''  let simpleMatch = false;
  if (simple && input.length <= 16 && SCAN !== undefined) {
    simpleMatch = SCAN.empty;
    let state = 0;
    for (let index = 0; !simpleMatch && index < input.length; index++) {
      state = SCAN.table[state + ASCII_FOLD[input.charCodeAt(index)]!]!;
      simpleMatch = state === -1;
    }
    if (!simpleMatch) return OK;
  }
'''
assert s.count(lower) == s.count(simple) == s.count('if (blocked(text))') == 1
candidate = s.replace(lower, lower + fold).replace(simple, simple + shortcut)
candidate = candidate.replace('if (blocked(text))', 'if (simpleMatch || blocked(text))')
(out / 'baseline-nameFilter.ts').write_bytes(raw)
(out / 'candidate-nameFilter.ts').write_text(candidate)
(out / 'scanner-source.txt').write_text(fold + shortcut)
config = json.loads((job / 'tsconfig.json').read_text())
config['compilerOptions']['outDir'] = 'compiled'
config['include'] = ['candidate-nameFilter.ts']
(out / 'tsconfig.json').write_text(json.dumps(config, indent=2) + '\n')
(out / 'package.json').write_text('{"type":"module","private":true}\n')
fixture = (job / 'tests/run.mjs').read_bytes()
assert sha(fixture) == 'bff0c17b62aa75d342527a8ced855678380411053476557acde61f2e1b6fbdd9'
declarations = fixture.decode()
declarations = declarations[declarations.index('function rng(seed)'):declarations.index('// Full command must never')]
prior = (repo / '.work/B19-trie-candidate/original-workload-declarations.mjs').read_text()
header = prior[:prior.index('function rng(seed)')]
(out / 'original-workload-declarations.mjs').write_text(header + declarations + '\nexport {makeObfuscations, makeFuzz, positive, fixed, mappingCases, knownCases, rangeCases, lengthBoundaryCases, addedNameCases, rng, pick};\n')
harness = (repo / '.work/B19-dfa-compact-candidate/exact-harness.mjs').read_text()
old = '41442670786856c1dfa98a5755bd21273287047750035f419249ab7402e8505d'
assert harness.count(old) == 1
harness = harness.replace(old, expected).replace('private-exact-regex-deterministic-scanner-nonacceptance', 'private-raw-ASCII-DFA-fold-shortcut-nonacceptance')
baseline_files = sorted(str(p.relative_to(out)) for p in [])
shutil.copytree(job / 'dist', out / 'baseline-loaded/dist')
baseline_files = sorted(str(p.relative_to(out)) for p in (out / 'baseline-loaded').rglob('*') if p.is_file())
needle = "'tsconfig.json', 'package.json', 'exact-harness.mjs'];"
assert harness.count(needle) == 1
harness = harness.replace(needle, "'tsconfig.json', 'package.json', 'exact-harness.mjs', " + ', '.join(repr(p) for p in baseline_files) + '];')
(out / 'exact-harness.mjs').write_text(harness)
receipt = {
    'kind': 'prospective-raw-ASCII-letter-DFA-fold-shortcut',
    'preparedUtc': datetime.now(timezone.utc).isoformat(),
    'baseCheckpoint': '39c6a17340905caa57700e42e4008501cafdf9a3',
    'baselineSourceSha256': expected,
    'baselineCompiledSha256': sha((job / 'dist/nameFilter.js').read_bytes()),
    'candidateSha256': sha(candidate.encode()),
    'candidateSourceGzipLevel9Bytes': len(gzip.compress(candidate.encode(), compresslevel=9)),
    'originalRunnerSha256': sha(fixture),
    'originalExtractedDeclarationsSha256': sha(declarations.encode()),
    'originalWorkloadsWarmupSamplesUnchanged': True,
    'candidateChange': 'After original type and raw-length decisions, scan proven ASCII letters of raw length <=16 through the existing DFA and a startup fold table derived through the original lower(). Return frozen OK on a proven no-match; matches retain the one original lower()/SAFE anchor and avoid a second scan. Honor SCAN.empty and preserve undefined-SCAN/full Unicode fallback.',
    'startupExcludedFromProspectivePhaseGains': True,
    'historicalOutlierCauseClaimed': False,
    'heavyCheckStarted': False,
    'timingStarted': False,
    'productionChanged': False,
    'baselineCapturedFiles': {p: sha((out / p).read_bytes()) for p in baseline_files},
}
assert receipt['baselineCompiledSha256'] == '330968b37089918bf450bb0a8a4546133e855c55df2aafe462d36be7aa4c6b8e'
assert receipt['candidateSourceGzipLevel9Bytes'] <= 6000
(out / 'build-receipt.json').write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps(receipt))
