from pathlib import Path
import json,hashlib,time,tarfile,subprocess,zipfile
r=Path('/tmp/gpt-drops-B09-audit-20261009');j=r/'jobs/B09-clue-solver';w=r/'.work/20261009-audit'
expected=json.loads((w/'first-source-files.json').read_text());original=json.loads((w/'frozen-original-source-files.json').read_text())
def digest(b):return hashlib.sha256(b).hexdigest()
def now():return time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())
def freeze():
 for n,v in expected.items():assert digest((r/n).read_bytes())==v['sha256'],n
assert json.loads((w/'FIRST-C47-FULL-ACCEPTANCE.json').read_text())['accepted'];freeze()
t=tarfile.open(w/'original-2b395-source.tar.gz');prefix=t.getnames()[0].split('/')[0]
def old(n):return t.extractfile(prefix+'/jobs/B09-clue-solver/'+n).read()
prod=(j/'clueSolver.ts').read_text();assert prod.split('// Constraint propagation',1)[1]==old('clueSolver.ts').decode().split('// Constraint propagation',1)[1]
inverse=[
('if (input === null || typeof input !== "object" || Array.isArray(input))','if (input === null || typeof input !== "object")'),
('const deck = input.deck === undefined ? CLASSIC_DECK : input.deck;\n  if (deck === null || typeof deck !== "object" || Array.isArray(deck)) return fail("INVALID_INPUT", "Expected a deck object");','const deck = input.deck ?? CLASSIC_DECK;'),
('const names = groups.flatMap(group => [...group]);','const names = groups.flat();'),
('if (!Array.isArray(input.handSizes)) return fail("INVALID_INPUT", "Expected an array of hand sizes");\n  ',''),
('const shown = input.shown === undefined ? [] : input.shown;\n  if (!Array.isArray(shown)) return fail("INVALID_INPUT", "Expected an array of shown-card observations");\n  const known: { player: number; card: string }[] = [...shown];','const known: { player: number; card: string }[] = [...(input.shown ?? [])];'),
('const cards = [0, 1, 2].map(k => {\n      const name = suggestion.cards[k];\n      const card = typeof name === "string" ? index.get(name) : undefined;','const cards = suggestion.cards.map((name: string, k: number) => {\n      const card = index.get(name);')]
for a,b in inverse:assert prod.count(a)==1,a;prod=prod.replace(a,b)
assert prod.encode()==old('clueSolver.ts')
s=(j/'fixtures.mjs').read_text();start=s.index('  // Runtime validation regressions against the unchanged independently authored reference.');end=s.index('  const contradiction = [',start);assert (s[:start]+s[end:]).encode()==old('fixtures.mjs')
s=(j/'test.mjs').read_text().replace('reports.push({ ...report, rawSixPlayerMilliseconds: timings }); console.log(JSON.stringify(report));','reports.push(report); console.log(JSON.stringify(report));');assert s.encode()==old('test.mjs')
s=(j/'mutations.mjs').read_text();a="\n// Preserve actual compiled outputs for independent inspection after temporary mutants are removed.\nmkdirSync('.verification', { recursive: true });\nwriteFileSync('.verification/types.js', readFileSync('dist/types.js'));\nwriteFileSync('.verification/package.json', '{\"type\":\"module\"}\\n');";assert s.count(a)==1;s=s.replace(a,'');a='    writeFileSync(`.verification/mutant-${id}.mjs`, readFileSync(`${directory}/clueSolver.js`));\n';assert s.count(a)==1;s=s.replace(a,'');assert s.encode()==old('mutations.mjs')
s=(r/'.github/workflows/B09.yml').read_text();s=s.split('      - uses: actions/upload-artifact@v4',1)[0].replace(", '.github/workflows/B09.yml'",'');assert s.encode()==t.extractfile(prefix+'/.github/workflows/B09.yml').read()
assert (j/'.gitignore').read_text().replace('.verification/\n','').encode()==old('.gitignore')
unchanged=[n for n,v in original.items() if expected[n]==v];assert len(unchanged)==17
for n in unchanged:assert (r/n).read_bytes()==t.extractfile(prefix+'/'+n).read()
k1={'passed':True,'round':1,'concreteAudit':'Compare exact original immutable inputs and reverse only validation/fixture/evidence additions. Original solver counting and propagation, blind reference, types, all random generation and every mandatory timing/mutation/strict gate remain byte-identical.','unchangedOriginalNativeInputs':17,'sixRuntimeAndEvidenceFilesExactlyReversible':True,'currentPublicInputsFrozen':72,'additionalSubstantiveGainFound':False,'completedUTC':now()}
(w/'KEEP-1-ORIGINAL-GATES.json').write_text(json.dumps(k1,indent=2)+'\n');print(json.dumps(k1),flush=True)
