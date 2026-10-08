"""Private prospective precompiled-mapping candidate; never writes production."""
from pathlib import Path
import hashlib, json, shutil, datetime

repo = Path(__file__).resolve().parents[2]
job = repo / 'jobs/B19-name-filter'
out = Path(__file__).resolve().parent
expected = '41442670786856c1dfa98a5755bd21273287047750035f419249ab7402e8505d'
raw = (job/'nameFilter.ts').read_bytes()
assert hashlib.sha256(raw).hexdigest() == expected
source = raw.decode()
start = source.index('function knownPlain(input: string)')
end = source.index('function hasContent', start)
old = source[start:end]
replacement = '''interface KnownInput { readonly plain: string; readonly mapped: string; readonly meaningful: boolean; }
function knownInput(input: string): KnownInput | undefined {
  let plain = '', mapped = '', meaningful = false;
  for (const character of input) {
    if (character <= '\\x7f') {
      plain += character;
      const folded = character >= 'A' && character <= 'Z'
        ? String.fromCharCode(character.charCodeAt(0) + 32) : character;
      if (folded >= 'a' && folded <= 'z') { mapped += folded; meaningful = true; }
      else { mapped += MAP.get(folded) ?? ''; meaningful ||= folded >= '0' && folded <= '9'; }
      continue;
    }
    const entry = KNOWN.get(character);
    // Final sigma depends on neighboring characters under whole-string lowercasing.
    // Any occurrence retains the original complete fallback; no per-character approximation.
    if (entry === undefined || entry.plain.includes('Σ')) return undefined;
    plain += entry.plain;
    mapped += entry.mapped;
    meaningful ||= entry.meaningful;
  }
  return {plain, mapped, meaningful};
}
'''
candidate = source[:start]+replacement+source[end:]
replacements = {
  'const known = ascii ? undefined : knownPlain(input);': 'const known = ascii ? undefined : knownInput(input);',
  'clean(lower(normalize(input))) : lower(known);': 'clean(lower(normalize(input))) : lower(known.plain);',
  'ascii ? ASCII_CONTENT.test(plain) : hasContent(plain)': 'ascii ? ASCII_CONTENT.test(plain) : known === undefined ? hasContent(plain) : known.meaningful',
  "text = '';\n   for (const c of plain) {": "if (known !== undefined) text = known.mapped;\n   else {\n   text = '';\n   for (const c of plain) {",
  "else text += '~'; // Unmapped letters are barriers, never silently deleted.\n   }\n  }": "else text += '~'; // Unmapped letters are barriers, never silently deleted.\n   }\n   }\n  }",
}
for old_fragment,new_fragment in replacements.items():
  assert candidate.count(old_fragment)==1, old_fragment
  candidate=candidate.replace(old_fragment,new_fragment)
(out/'baseline-nameFilter.ts').write_bytes(raw)
(out/'candidate-nameFilter.ts').write_text(candidate)
config=json.loads((job/'tsconfig.json').read_text());config['compilerOptions']['outDir']='compiled';config['include']=['candidate-nameFilter.ts']
(out/'tsconfig.json').write_text(json.dumps(config,indent=2)+'\n');(out/'package.json').write_text('{"type":"module","private":true}\n')
fixture=(job/'tests/run.mjs').read_bytes()
assert hashlib.sha256(fixture).hexdigest()=='bff0c17b62aa75d342527a8ced855678380411053476557acde61f2e1b6fbdd9'
declarations=fixture.decode();declarations=declarations[declarations.index('function rng(seed)'):declarations.index('// Full command must never')]
old_module=(repo/'.work/B19-trie-candidate/original-workload-declarations.mjs').read_text()
header=old_module[:old_module.index('function rng(seed)')]
(out/'original-workload-declarations.mjs').write_text(header+declarations+'\nexport {makeObfuscations, makeFuzz, positive, fixed, mappingCases, knownCases, rangeCases, lengthBoundaryCases, addedNameCases, rng, pick};\n')
harness=(repo/'.work/B19-trie-candidate/exact-harness.mjs').read_text().replace('693d9501633b9099676d38cf2d215bdf3dab570b3e8d300f485d685e2be2f15f',expected).replace('private-prefix-trie-nonacceptance','private-precompiled-mapping-nonacceptance')
(out/'exact-harness.mjs').write_text(harness)
baseline=out/'baseline-loaded';shutil.copytree(job/'dist',baseline/'dist')
receipt={'kind':'private-source-bound-precompiled-mapping-preparation','preparedUtc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'sourceSha256':expected,'candidateSha256':hashlib.sha256(candidate.encode()).hexdigest(),'originalRunnerSha256':hashlib.sha256(fixture).hexdigest(),'originalBlockSha256':hashlib.sha256(old.encode()).hexdigest(),'candidateChange':'Use existing startup KnownCharacter mapped and meaningful values for fully known non-ASCII inputs, preserving full-string plain folding and exact exceptions. Greek capital sigma and any unknown character use the complete original fallback. No witness cache, runtime I/O, timing or policy change.','heavyCheckStarted':False,'timingStarted':False,'mechanismExplainsHistoricalOutlier':False}
(out/'build-receipt.json').write_text(json.dumps(receipt,indent=2)+'\n');print(json.dumps(receipt))
