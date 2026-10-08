"""Private, source-bound regex-prefix candidate. Does not edit production."""
import hashlib
import json
from pathlib import Path

repo = Path(__file__).resolve().parents[2]
job = repo / "jobs/B19-name-filter"
out = Path(__file__).resolve().parent
expected = "693d9501633b9099676d38cf2d215bdf3dab570b3e8d300f485d685e2be2f15f"
source_bytes = (job / "nameFilter.ts").read_bytes()
assert hashlib.sha256(source_bytes).hexdigest() == expected
source = source_bytes.decode()
begin = source.index("const pattern = (terms: readonly string[]): string =>")
end = source.index("const REVERSED =", begin)
old = source[begin:end]
replacement = """// Share only identical run tokens; alternatives retain their exact minima and
// i/l ambiguity. Factoring concatenation over union preserves the same language.
const pattern = (terms: readonly string[]): string => {
  interface Trie { terminal: boolean; children: Map<string, Trie>; }
  const node = (): Trie => ({terminal: false, children: new Map()});
  const root = node();
  for (const term of terms) {
    let current = root;
    for (const run of term.match(/(.)\\1*/g) ?? []) {
      const c = run[0]!;
      const token = (c === 'i' || c === 'l' ? `[${c}#]` : c)
        + (run.length === 1 ? '+' : `{${run.length},}`);
      let next = current.children.get(token);
      if (next === undefined) { next = node(); current.children.set(token, next); }
      current = next;
    }
    current.terminal = true;
  }
  const emit = (current: Trie): string => {
    const alternatives = [...current.children].map(([token, next]) => token + emit(next));
    if (alternatives.length === 0) return '';
    const body = alternatives.length === 1 ? alternatives[0]! : `(?:${alternatives.join('|')})`;
    return current.terminal ? `(?:${body})?` : body;
  };
  return emit(root);
};
"""
candidate = source[:begin] + replacement + source[end:]
(out / "baseline-nameFilter.ts").write_bytes(source_bytes)
(out / "candidate-nameFilter.ts").write_text(candidate)
config = json.loads((job / "tsconfig.json").read_text())
config["compilerOptions"]["outDir"] = "compiled"
config["include"] = ["candidate-nameFilter.ts"]
(out / "tsconfig.json").write_text(json.dumps(config, indent=2) + "\n")
(out / "package.json").write_text('{"type":"module","private":true}\n')
fixture_bytes = (job / "tests/run.mjs").read_bytes()
fixture = fixture_bytes.decode()
declarations = fixture[fixture.index("function rng(seed)"):fixture.index("// Full command must never")]
header = """// Verbatim declarations from the guarded original runner; no acceptance test runs.
import {readFileSync} from 'node:fs';
import {performance} from 'node:perf_hooks';
import {nameFilter} from '../../jobs/B19-name-filter/dist/nameFilter.js';
import {reference} from '../../jobs/B19-name-filter/dist/tests/reference.js';
import {createReference} from '../../jobs/B19-name-filter/tests/blind/reference.mjs';
const policy = JSON.parse(readFileSync(new URL('../../jobs/B19-name-filter/data/policy.json', import.meta.url)));
const originalPolicy = JSON.parse(readFileSync(new URL('../../jobs/B19-name-filter/data/original-workload-policy.json', import.meta.url)));
const blind = createReference(policy);
const label = result => result.ok ? 'ok' : result.reason;
"""
(out / "original-workload-declarations.mjs").write_text(header + declarations + "\nexport {makeObfuscations, makeFuzz, positive, fixed, mappingCases, knownCases, rangeCases, lengthBoundaryCases, addedNameCases, rng, pick};\n")
(out / "build-receipt.json").write_text(json.dumps({
    "kind": "private-source-bound-candidate-preparation",
    "sourceSha256": expected,
    "candidateSha256": hashlib.sha256(candidate.encode()).hexdigest(),
    "originalRunnerSha256": hashlib.sha256(fixture_bytes).hexdigest(),
    "originalBlockSha256": hashlib.sha256(old.encode()).hexdigest(),
    "candidateChange": "Prefix trie factors identical repeated-letter regex tokens only. Existing BAD/BY_LENGTH assembly and every per-call operation stay identical.",
    "heavyCheckStarted": False,
    "timingStarted": False
}, indent=2) + "\n")
print(json.dumps({"sourceSha256": expected, "candidateSha256": hashlib.sha256(candidate.encode()).hexdigest(), "privateOutput": str(out), "productionWritten": False}))
