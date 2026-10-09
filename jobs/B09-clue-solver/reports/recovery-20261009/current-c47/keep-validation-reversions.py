from pathlib import Path
import json,subprocess,hashlib,time
r=Path('/tmp/gpt-drops-B09-audit-20261009');j=r/'jobs/B09-clue-solver';w=r/'.work/20261009-audit';root=w/'validation-reversions';root.mkdir(exist_ok=True)
e=json.loads((w/'first-source-files.json').read_text());digest=lambda b:hashlib.sha256(b).hexdigest()
def freeze():
 for n,v in e.items():assert digest((r/n).read_bytes())==v['sha256'],n
def now():return time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())
freeze();original=(j/'clueSolver.ts').read_text()
variants=[
('allow-array-game',' || Array.isArray(input)',''),
('default-null-deck','input.deck === undefined ? CLASSIC_DECK : input.deck','input.deck ?? CLASSIC_DECK'),
('allow-array-deck',' || Array.isArray(deck)',''),
('collapse-sparse-deck','groups.flatMap(group => [...group])','groups.flat()'),
('allow-typed-hand-sizes','  if (!Array.isArray(input.handSizes)) return fail("INVALID_INPUT", "Expected an array of hand sizes");\n',''),
('allow-null-or-set-shown','const shown = input.shown === undefined ? [] : input.shown;\n  if (!Array.isArray(shown)) return fail("INVALID_INPUT", "Expected an array of shown-card observations");\n  const known: { player: number; card: string }[] = [...shown];','const known: { player: number; card: string }[] = [...(input.shown ?? [])];'),
('skip-sparse-suggestion','const cards = [0, 1, 2].map(k => {\n      const name = suggestion.cards[k];\n      const card = typeof name === "string" ? index.get(name) : undefined;','const cards = suggestion.cards.map((name: string, k: number) => {\n      const card = index.get(name);'),
]
runner="""import assert from 'node:assert/strict';
import{pathToFileURL}from'node:url';
process.env.B09_IMPORT_ONLY='1';
const{smoke}=await import(pathToFileURL('/tmp/gpt-drops-B09-audit-20261009/jobs/B09-clue-solver/test.mjs'));
const{solveClue}=await import(pathToFileURL(process.argv[2]));
const records=[];
for(const seed of[1,2,3]){let error;try{smoke(solveClue,seed);}catch(e){error=e;}assert(error,'validation regression escaped detection');assert.match(error.message,/independent status/);records.push({seed,killed:true,actualFailure:error.message});}
console.log(JSON.stringify({id:process.argv[3],strictCompiledVariantActuallyExecuted:true,records}));
"""
(root/'run-variant.mjs').write_text(runner)
basecfg=json.loads((j/'tsconfig.json').read_text());records=[];start=time.monotonic()
for name,a,b in variants:
 assert time.monotonic()-start<180;freeze();assert original.count(a)==1,name;p=root/name;p.mkdir(exist_ok=True)
 code=original.replace(a,b);(p/'clueSolver.ts').write_text(code);(p/'types.ts').write_bytes((j/'types.ts').read_bytes());(p/'package.json').write_text('{"type":"module"}\n')
 cfg={'compilerOptions':{**basecfg['compilerOptions'],'outDir':'dist'},'files':['clueSolver.ts','types.ts']};(p/'tsconfig.json').write_text(json.dumps(cfg,indent=2)+'\n')
 with (p/'compile.stdout').open('wb') as out,(p/'compile.stderr').open('wb') as err:c=subprocess.run(['node',str(j/'node_modules/typescript/bin/tsc'),'-p',str(p/'tsconfig.json')],cwd=j,stdout=out,stderr=err,timeout=30)
 assert c.returncode==0,(name,c.returncode)
 compiled=p/'dist/clueSolver.js';assert compiled.is_file()
 with (p/'runtime.stdout').open('wb') as out,(p/'runtime.stderr').open('wb') as err:c=subprocess.run(['node',str(root/'run-variant.mjs'),str(compiled),name],cwd=j,stdout=out,stderr=err,timeout=30)
 assert c.returncode==0,(name,c.returncode);v=json.loads((p/'runtime.stdout').read_text());assert [x['seed'] for x in v['records']]==[1,2,3] and all(x['killed'] for x in v['records']);freeze()
 record={'name':name,'strictCompilationExit':0,'runtimeExit':0,'sourceSHA256':digest(code.encode()),'compiledSHA256':digest(compiled.read_bytes()),'records':v['records'],'closedUTC':now()};records.append(record);print(json.dumps({'name':name,'strictCompilationExit':0,'actualSeededKills':3,'closedUTC':record['closedUTC']}),flush=True)
freeze()
receipt={'passed':True,'round':3,'concreteAudit':'Seven actual validation reversion mutants independently strictly compiled with unchanged TypeScript flags, then killed by actual current seeded smoke cases. Original25variant/75kill pipeline stays unchanged.','additionalActualStrictCompiledReversions':7,'additionalActualSeededRuntimeKills':21,'records':records,'currentPublicInputsFrozen':72,'noLocalTimingMeasurement':True,'allActualChildrenNaturallyClosed':True,'additionalSubstantiveGainFound':False,'completedUTC':now()}
(w/'KEEP-3-VALIDATION-REVERSION-MUTANTS.json').write_text(json.dumps(receipt,indent=2)+'\n');print(json.dumps({k:v for k,v in receipt.items() if k!='records'}),flush=True)
