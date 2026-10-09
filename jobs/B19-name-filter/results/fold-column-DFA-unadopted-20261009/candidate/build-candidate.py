"""Private lower-derived fold-column classification and unchanged DFA traversal."""
from pathlib import Path
from datetime import datetime, timezone
import gzip, hashlib, json, shutil, subprocess

repo = Path(__file__).resolve().parents[2]
job = repo / 'jobs/B19-name-filter'
out = Path(__file__).resolve().parent
prior = repo / '.work/B19-UTF16-length-candidate'
sha = lambda b: hashlib.sha256(b).hexdigest()
raw = (job / 'nameFilter.ts').read_bytes()
expected = '7817489fc1d0908a87914223a84b31c15ea7e13b3555cb4238594751616f163d'
assert sha(raw) == expected
assert sha((job / 'dist/nameFilter.js').read_bytes()) == 'e4b39efbf033bef9c41788e9bf0f002cdb61ff9dbbdfa6cbfcbfda65122d2cf9'
old = """  const simple = SIMPLE_ASCII.test(input);
  let simpleMatch = false;
  if (simple && input.length <= 16 && SCAN !== undefined) {
    simpleMatch = SCAN.empty;
    let state = 0;
    for (let index = 0; !simpleMatch && index < input.length; index++) {
      state = SCAN.table[state + ASCII_FOLD[input.charCodeAt(index)]!]!;
      simpleMatch = state === -1;
    }
    if (!simpleMatch) return OK;
  }
"""
replacement = """  let simple = false;
  let simpleMatch = false;
  if (input.length > 0 && input.length <= 16 && SCAN !== undefined) {
    simple = true;
    simpleMatch = SCAN.empty;
    let state = 0;
    for (let index = 0; index < input.length; index++) {
      const column = ASCII_FOLD[input.charCodeAt(index)]!;
      if (!(column < 26)) {
        simple = false;
        simpleMatch = false;
        break;
      }
      if (!simpleMatch) {
        state = SCAN.table[state + column]!;
        simpleMatch = state === -1;
      }
    }
    if (simple && !simpleMatch) return OK;
  } else {
    simple = SIMPLE_ASCII.test(input);
  }
"""
s = raw.decode()
assert s.count(old) == 1
candidate = s.replace(old, replacement)
assert candidate.count('[...input].length > 16') == 1
(out / 'baseline-nameFilter.ts').write_bytes(raw)
(out / 'candidate-nameFilter.ts').write_text(candidate)
(out / 'scanner-source.txt').write_text(replacement)
for name in ['tsconfig.json', 'package.json', 'original-workload-declarations.mjs']:
    shutil.copy2(prior / name, out / name)
shutil.copytree(job / 'dist', out / 'baseline-loaded/dist')
harness = (prior / 'exact-harness.mjs').read_text().replace("'preflight-source.txt'", "'scanner-source.txt'").replace('private-indexed-UTF16-length-preflight-nonacceptance', 'private-fold-column-classification-DFA-nonacceptance')
(out / 'exact-harness.mjs').write_text(harness)
controls = (prior / 'structural-control.mjs').read_text().replace('private-indexed-UTF16-preflight-actual-assertion-controls', 'private-fold-column-DFA-actual-assertion-controls')
controls = controls.replace('const mutants = [', "const originalCode = readFileSync(new URL('baseline-loaded/dist/nameFilter.js', here), 'utf8');\nconst originalSimple = Function(originalCode.replaceAll('export function ', 'function ') + '\\nreturn SIMPLE_ASCII;')();\nconst actualFold = Function(code.replaceAll('export function ', 'function ') + '\\nreturn ASCII_FOLD;')();\nlet classified = 0;\nfor (let unit = 0; unit <= 0xffff; unit++) {\n assert.equal(actualFold[unit] < 26, originalSimple.test(String.fromCharCode(unit)), `original ASCII-letter classification at code unit ${unit}`);\n classified++;\n}\nassert.equal(classified, 65536);\n" + 'const mutants = [')
controls = controls.replace('table: metadata, cases: mutants.length', 'table: metadata, classificationInvariant: {cases: classified, passed: classified, originalBaselineJsSha256: sha(Buffer.from(originalCode)), originalSimpleRegExp: originalSimple.source, foldTableLength: actualFold.length}, cases: mutants.length')
(out / 'structural-control.mjs').write_text(controls)
mutation = repo / '.work/B19-fold-column-DFA-mutation'
mutation.mkdir()
shutil.copy2(repo / '.work/B19-UTF16-length-mutation/original-declarations.mjs', mutation / 'original-declarations.mjs')
m = (repo / '.work/B19-UTF16-length-mutation/full-mutation.mjs').read_text().replace('B19-UTF16-length-candidate', 'B19-fold-column-DFA-candidate').replace('private-original-25-executed-mutants-on-indexed-UTF16-preflight', 'private-original-25-executed-mutants-on-fold-column-DFA')
(mutation / 'full-mutation.mjs').write_text(m)
controller = (prior / 'run-functional.py').read_text().replace('B19-UTF16-length-candidate', 'B19-fold-column-DFA-candidate').replace('B19-UTF16-length-mutation', 'B19-fold-column-DFA-mutation')
(out / 'run-functional.py').write_text(controller)
receipt = {'kind': 'distinct-private-fold-column-classification-DFA', 'preparedUtc': datetime.now(timezone.utc).isoformat(), 'baseCheckpoint': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=repo, text=True).strip(), 'baselineSourceSha256': expected, 'baselineCompiledSha256': sha((job / 'dist/nameFilter.js').read_bytes()), 'candidateSha256': sha(candidate.encode()), 'candidateSourceGzipLevel9Bytes': len(gzip.compress(candidate.encode(), compresslevel=9)), 'originalRunnerSha256': sha((job / 'tests/run.mjs').read_bytes()), 'candidateChange': 'Raw nonempty <=16 inputs look up the existing lower-derived ASCII_FOLD once per code unit; its Uint8 values<26 exactly identify ASCII letters, while undefined/out-of-range values fail that comparison. Reuse that same column for the unchanged DFA transition, removing four explicit range comparisons and the preliminary regex. After a hit, continue classifying all remaining characters; any nonletter resets simpleMatch and uses the original control/normalization/SAFE/general scanner fallback. Empty, raw>16 and undefined table retain original SIMPLE_ASCII test. Original type/codepoint-length checks, lower-derived fold table, all mutation anchors and all downstream code remain unchanged.', 'originalWorkloadsWarmupSamplesUnchanged': True, 'startupExcludedFromProspectivePhaseGains': True, 'gainClaimed': False, 'historicalOutlierCauseClaimed': False, 'timingStarted': False, 'productionChanged': False, 'baselineCapturedFiles': {str(p.relative_to(out)): sha(p.read_bytes()) for p in (out / 'baseline-loaded').rglob('*') if p.is_file()}}
assert receipt['candidateSourceGzipLevel9Bytes'] <= 6000
(out / 'build-receipt.json').write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps({k: v for k, v in receipt.items() if k != 'baselineCapturedFiles'}))
