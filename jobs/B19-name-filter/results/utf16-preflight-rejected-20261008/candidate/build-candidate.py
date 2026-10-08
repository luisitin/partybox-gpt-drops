"""Distinct private indexed UTF16 preflight; original mutation anchors stay live."""
from pathlib import Path
from datetime import datetime, timezone
import gzip, hashlib, json, shutil, subprocess
repo = Path(__file__).resolve().parents[2]
job = repo / 'jobs/B19-name-filter'
out = Path(__file__).resolve().parent
prior = repo / '.work/B19-ascii-DFA-fold-candidate'
sha = lambda b: hashlib.sha256(b).hexdigest()
raw = (job / 'nameFilter.ts').read_bytes()
expected = '7817489fc1d0908a87914223a84b31c15ea7e13b3555cb4238594751616f163d'
assert sha(raw) == expected
assert sha((job/'dist/nameFilter.js').read_bytes()) == 'e4b39efbf033bef9c41788e9bf0f002cdb61ff9dbbdfa6cbfcbfda65122d2cf9'
old = "  if (input.length > 32 || (input.length > 16 && [...input].length > 16)) return FAILURE.length;\n"
replacement = """  if (input.length > 16) {
    if (input.length > 32) return FAILURE.length;
    let points = 0;
    for (let index = 0; index < input.length; index++) {
      const first = input.charCodeAt(index);
      if (first >= 0xd800 && first <= 0xdbff) {
        const second = input.charCodeAt(index + 1);
        if (second >= 0xdc00 && second <= 0xdfff) index++;
      }
      if (++points === 18) return FAILURE.length;
    }
    if (points >= 16 && [...input].length > 16) return FAILURE.length;
  }
"""
s=raw.decode()
assert s.count(old) == 1
candidate=s.replace(old,replacement)
assert candidate.count('[...input].length > 16') == 1
(out/'baseline-nameFilter.ts').write_bytes(raw)
(out/'candidate-nameFilter.ts').write_text(candidate)
(out/'preflight-source.txt').write_text(replacement)
for name in ['tsconfig.json','package.json','original-workload-declarations.mjs']:
    shutil.copy2(prior/name,out/name)
shutil.copytree(job/'dist',out/'baseline-loaded/dist')
harness=(prior/'exact-harness.mjs').read_text()
harness=harness.replace('ae8dc388665a4b4241b40b7ce1b86ba98e9eaadde7facefddf8ee47a00858e8a',expected).replace('private-raw-ASCII-DFA-fold-shortcut-nonacceptance','private-indexed-UTF16-length-preflight-nonacceptance').replace("'scanner-source.txt'","'preflight-source.txt'")
(out/'exact-harness.mjs').write_text(harness)
controls=(prior/'structural-control.mjs').read_text()
anchor=" ['M25', '`{${run.length},}`', \"'+'\", 'Bobby', true],\n"
assert controls.count(anchor) == 1
controls=controls.replace(anchor,anchor+" ['M22', '[...input].length > 16', '[...input].length > 17', 'a'.repeat(17), false],\n ['M23', '[...input].length > 16', '[...input].length >= 16', '𐐨'.repeat(16), true],\n")
controls=controls.replace('private-raw-letter-DFA-fold-actual-assertion-controls','private-indexed-UTF16-preflight-actual-assertion-controls')
(out/'structural-control.mjs').write_text(controls)
mutation=repo/'.work/B19-UTF16-length-mutation'
mutation.mkdir()
shutil.copy2(repo/'.work/B19-ascii-DFA-fold-mutation/original-declarations.mjs',mutation/'original-declarations.mjs')
m=(repo/'.work/B19-ascii-DFA-fold-mutation/full-mutation.mjs').read_text().replace('B19-ascii-DFA-fold-candidate','B19-UTF16-length-candidate').replace('private-original-25-executed-mutants-on-ASCII-DFA-fold-shortcut','private-original-25-executed-mutants-on-indexed-UTF16-preflight')
(mutation/'full-mutation.mjs').write_text(m)
controller=(prior/'run-functional.py').read_text().replace('B19-ascii-DFA-fold-candidate','B19-UTF16-length-candidate').replace('B19-ascii-DFA-fold-mutation','B19-UTF16-length-mutation')
(out/'run-functional.py').write_text(controller)
receipt={'kind':'prospective-distinct-indexed-UTF16-length-preflight','preparedUtc':datetime.now(timezone.utc).isoformat(),'baseCheckpoint':subprocess.check_output(['git','rev-parse','HEAD'],cwd=repo,text=True).strip(),'baselineSourceSha256':expected,'baselineCompiledSha256':sha((job/'dist/nameFilter.js').read_bytes()),'candidateSha256':sha(candidate.encode()),'candidateSourceGzipLevel9Bytes':len(gzip.compress(candidate.encode(),compresslevel=9)),'originalRunnerSha256':sha((job/'tests/run.mjs').read_bytes()),'candidateChange':'All length work inside raw-unit>16 block; preserve >32 raw rejection. Count adjacent high+low pairs as one and lone units as one. Reject at18 codepoints, retain original consequential spread anchor for16/17, skip it for<=15. Type/length/control precedence and original M22/M23 effects remain. Raw<=16 common path uses one comparison; no gain claimed yet.','originalWorkloadsWarmupSamplesUnchanged':True,'startupExcludedFromProspectivePhaseGains':True,'historicalOutlierCauseClaimed':False,'timingStarted':False,'productionChanged':False,'baselineCapturedFiles':{str(p.relative_to(out)):sha(p.read_bytes()) for p in (out/'baseline-loaded').rglob('*') if p.is_file()}}
assert receipt['candidateSourceGzipLevel9Bytes'] <= 6000
(out/'build-receipt.json').write_text(json.dumps(receipt,indent=2)+'\n')
print(json.dumps({k:v for k,v in receipt.items() if k!='baselineCapturedFiles'}))
