// PartyBox port kit checks (npm test runs this through run.mjs): the compact tables, the split
// solver, the adapter that turns a PartyBox card into solver input, golden decisions and planted
// port bugs. Writes reports/partybox-port.json. Reads only committed inputs; never edits partybox/.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
import ts from 'typescript';
import {goldenOf} from './build-golden.mjs';

const job=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
process.chdir(job);
// Standalone runs (node partybox/test-port.mjs) build the two modules run.mjs would have built first.
const tsc=args=>execFileSync(process.execPath,['node_modules/typescript/bin/tsc',...args],{stdio:'inherit'});
if(!fs.existsSync('build/yahtzeeOpt.js')||!fs.existsSync('build/tables/official.json')){tsc(['-p','tsconfig.json']);execFileSync(process.execPath,['copy-tables.mjs']);}
if(!fs.existsSync('build/independent/reference.js'))tsc(['--target','ES2022','--module','NodeNext','--moduleResolution','NodeNext','--strict','--noUncheckedIndexedAccess','--exactOptionalPropertyTypes','--noUnusedLocals','--noUnusedParameters','--noEmitOnError','--declaration','--outDir','build/independent','independent/reference.ts']);
const {boundaryChecks,independentReference,loadBinary,randomStateComparison,reachable,scoringExhaustion,seeded}=await import('../test.mjs');
const started=Date.now(),sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const KIT='partybox/server',VERIFY='.verification/partybox';
fs.rmSync(VERIFY,{recursive:true,force:true});fs.mkdirSync(VERIFY,{recursive:true});
const report={passed:false};

// 1. Committed generated files are exactly what the builders produce from the sealed inputs.
execFileSync(process.execPath,['partybox/build-tables.mjs',`${VERIFY}/tables`],{stdio:['ignore','ignore','inherit']});
for(const mode of ['official','published'])
  assert.equal(sha(`${VERIFY}/tables/tables-${mode}.generated.ts`),sha(`${KIT}/optimal/tables-${mode}.generated.ts`),`Committed ${mode} compact table is the builder's output`);
const root=await import(pathToFileURL(path.join(job,'build/yahtzeeOpt.js')).href);
const golden=goldenOf(root);
assert.equal(JSON.stringify(JSON.parse(fs.readFileSync('partybox/__tests__/optimal-golden.json','utf8'))),JSON.stringify(golden),'Committed golden file (prettier-formatted) holds exactly the sealed core\'s output');
report.generated={tables:'byte-identical rebuild',golden:golden.cases.length};

// 2. Purity of every kit server file (PartyBox game-server rules) and strict compilation.
const kitFiles=fs.readdirSync(KIT,{recursive:true}).filter(f=>f.endsWith('.ts')).map(f=>path.join(KIT,f));
for(const file of kitFiles){
  const text=fs.readFileSync(file,'utf8');
  for(const [pattern,why] of [[/Math\.random|Date\.now|new Date\b|performance\.|process\.|setTimeout|setInterval/,'clock/randomness/timers'],[/from 'node:|require\(|\bfetch\(|\bimport\(/,'I/O or dynamic import'],[/\bawait\b|\basync\b/,'async'],[/export default/,'default export'],[/^(let|var)\s/m,'module-level mutable binding'],[/console\./,'console']])
    assert.ok(!pattern.test(text),`${file}: ${why}`);
  if(!file.endsWith('.generated.ts'))assert.ok(text.split('\n').length<=300,`${file} fits PartyBox's 300-line rule`);
}
const config=ts.readConfigFile('partybox/tsconfig.json',ts.sys.readFile);assert.equal(config.error,undefined);
const parsed=ts.parseJsonConfigFileContent(config.config,ts.sys,path.resolve('partybox'));assert.equal(parsed.errors.length,0);
const linkTables=folder=>{for(const mode of ['official','published']){const link=path.join(folder,`optimal/tables-${mode}.generated.js`);if(!fs.existsSync(link))fs.symlinkSync(path.resolve(VERIFY,'build/optimal',`tables-${mode}.generated.js`),link);}};
function compile(outDir,overrides={}) {
  const options={...parsed.options,outDir:path.resolve(outDir),noEmit:false};
  const host=ts.createCompilerHost(options),read=host.readFile.bind(host);
  host.readFile=file=>overrides[path.resolve(file)]??read(file);
  host.writeFile=(file,text)=>{
    if(outDir!==`${VERIFY}/build`&&file.endsWith('.generated.js'))return;
    fs.mkdirSync(path.dirname(file),{recursive:true});
    fs.writeFileSync(file,text.replace(/(from '\.{1,2}\/[^']+)'/g,"$1.js'"));
  };
  const program=ts.createProgram(parsed.fileNames,options,host);
  const diagnostics=[...ts.getPreEmitDiagnostics(program),...program.emit().diagnostics];
  assert.equal(diagnostics.length,0,ts.formatDiagnostics(diagnostics,{getCurrentDirectory:()=>job,getCanonicalFileName:f=>f,getNewLine:()=>'\n'}));
  if(outDir!==`${VERIFY}/build`)linkTables(outDir);
}
compile(`${VERIFY}/build`);
async function load(folder){
  const at=file=>pathToFileURL(path.resolve(folder,file)).href;
  const [rules,solver,tables,bot]=await Promise.all(['optimal/rules.js','optimal/solver.js','optimal/tables.js','optimal-bot.js'].map(f=>import(at(f))));
  return {api:{...rules,...solver},tables,bot};
}
const kit=await load(`${VERIFY}/build`);
report.compile={files:kitFiles.length,strictFlags:Object.keys(config.config.compilerOptions).length};

// 3. Exhaustive: every slot of both 2^20 tables through the port's own lookup and public API.
const binaries={official:loadBinary('tables/official.bin'),published:loadBinary('tables/published.bin')};
function tableCheck(k,throwEvery=1) {
  let valid=0,invalid=0;
  for(const mode of ['official','published']){const bin=binaries[mode];
    for(let index=0;index<bin.length;index++){
      const usedMask=index&8191,upper=(index>>13)&63,yahtzeeBonus=index>=524288,expected=bin[index],card={usedMask,upper,yahtzeeBonus,ruleMode:mode};
      const value=k.tables.solvedValue(mode,usedMask,upper,yahtzeeBonus);
      if(Number.isFinite(expected)){assert.ok(Object.is(value,expected),`${mode}:${index}`);assert.ok(Object.is(k.api.expectedValue(card),expected));valid++;}
      else{assert.ok(Number.isNaN(value),`${mode}:${index} must be unreachable`);if(invalid%throwEvery===0)assert.throws(()=>k.api.expectedValue(card),RangeError);invalid++;}
    }}
  for(const args of [['other',0,0,false],['official',-1,0,false],['official',8192,0,false],['official',0.5,0,false],['official',0,64,false],['official',0,-1,false],['official',0,1.5,false],['official',0,0,true]])assert.ok(Number.isNaN(k.tables.solvedValue(...args)),JSON.stringify(args));
  assert.equal(valid,1072896);return {valid,invalid};
}
report.tables=tableCheck(kit);

// 4. The job's own independent suites, run against the port exactly as against the sealed core.
const reference=independentReference();
report.suites={boundary:boundaryChecks(kit.api,reference).assertions,seeds:[]};
for(const seed of [1,2,3]){
  const scoring=scoringExhaustion(kit.api,reference,seed).scoringCases,random=randomStateComparison(kit.api,reference,seed,10000);
  report.suites.seeds.push({seed,scoringCases:scoring,randomStates:random.states,orderedHoldChecks:random.orderedHoldChecks,maximumValueDifference:random.maximumValueDifference});
}

// 5. Same code, same doubles: port and sealed core agree bit for bit (golden + seeded states).
function differential(k,count,seed) {
  for(const c of golden.cases){
    const card={usedMask:c.usedMask,upper:c.upper,yahtzeeBonus:c.yahtzeeBonus,ruleMode:c.ruleMode};
    const hold=k.api.bestHold(c.dice,c.rollsLeft,card),category=k.api.bestCategory(c.dice,card);
    assert.deepEqual([k.api.expectedValue(card),hold.hold,hold.expectedValue,category.category,category.expectedValue],[c.stateValue,c.hold,c.holdValue,c.category,c.categoryValue],'golden');
  }
  assert.ok(Object.is(k.api.expectedValue(),golden.start.official));
  const random=seeded(100+seed);
  for(let i=0;i<count;i++){
    const usedMask=Math.floor(random()*8191),ups=reachable[usedMask&63],upper=ups[Math.floor(random()*ups.length)];
    const card={usedMask,upper,yahtzeeBonus:Boolean(usedMask&2048)&&random()<0.5,ruleMode:i%2?'official':'published'};
    const dice=Array.from({length:5},()=>Math.floor(random()*6)+1),rollsLeft=i%3,hold=[...dice].sort().slice(0,i%6);
    assert.deepEqual(k.api.bestHold(dice,rollsLeft,card),root.bestHold(dice,rollsLeft,card));
    assert.deepEqual(k.api.bestCategory(dice,card),root.bestCategory(dice,card));
    if(rollsLeft)assert.ok(Object.is(k.api.valueOfHold(dice,hold,rollsLeft,card),root.valueOfHold(dice,hold,rollsLeft,card)));
    for(let c=0;c<13;c++)assert.deepEqual(k.api.score(dice,c,card),root.score(dice,c,card));
  }
  return golden.cases.length+count;
}
report.differential=[1,2,3].map(seed=>({seed,states:differential(kit,5000,seed)}));

// 6. The adapter: PartyBox editions, settings and cards in; legal PartyBox inputs out.
const IDS=['aces','twos','threes','fours','fives','sixes','three-kind','four-kind','full-house','small-straight','large-straight','yahtzee','chance'];
const SHAPES=[['upper','face',1,0,0],['upper','face',2,0,0],['upper','face',3,0,0],['upper','face',4,0,0],['upper','face',5,0,0],['upper','face',6,0,0],['lower','kind',0,3,0],['lower','kind',0,4,0],['lower','house',0,3,25],['lower','straight',0,4,30],['lower','straight',0,5,40],['lower','all',0,5,50],['lower','sum',0,0,0]];
const CLASSIC={categories:SHAPES.map(([section,rule,face,count,points],i)=>({id:IDS[i],section,rule,face,count,points})),
  rules:{diceCount:5,diceSides:6,maxRolls:3,upperThreshold:63,upperBonus:35,yahtzeeBonus:100,columns:[1],bonusPolicy:'classic'}};
const FORCED={jokerRule:'forced',yahtzeeBonus:true,fullHouseYahtzee:false},FREE={...FORCED,jokerRule:'free'};
const emptyCard=()=>({boxes:Object.fromEntries(IDS.map(id=>[id,null])),bonuses:0});
function adapterUnits(k) {
  const b=k.bot;let n=0;const eq=(a,e,m)=>{assert.deepEqual(a,e,m);n++;};
  eq(b.classicIds(CLASSIC),IDS,'Classic ids by rule');
  const order=[12,3,7,0,11,5,9,1,8,2,10,6,4],shuffled={...CLASSIC,categories:order.map(i=>({...CLASSIC.categories[i],id:`box${i}`}))};
  eq(b.classicIds(shuffled),IDS.map((_,i)=>`box${i}`),'Mapped by rule, not by position or name');
  const swap=(i,patch)=>({...CLASSIC,categories:CLASSIC.categories.map((c,j)=>j===i?{...c,...patch}:c)});
  for(const [label,edition] of [['three columns',{...CLASSIC,rules:{...CLASSIC.rules,columns:[1,2,3]}}],['four rolls',{...CLASSIC,rules:{...CLASSIC.rules,maxRolls:4}}],['d8',{...CLASSIC,rules:{...CLASSIC.rules,diceSides:8}}],
    ['bonus 50',{...CLASSIC,rules:{...CLASSIC.rules,upperBonus:50}}],['triple chips',{...CLASSIC,rules:{...CLASSIC.rules,bonusPolicy:'triple-original'}}],['no chance',{...CLASSIC,categories:CLASSIC.categories.slice(0,12)}],
    ['two 3-kinds',swap(7,{count:3})],['house 2+3 as count 2',swap(8,{count:2})],['straight 35',swap(9,{points:35})],['upper kind',swap(6,{section:'upper'})],['Yahtzee 60',swap(11,{points:60})]])
    eq(b.classicIds(edition),null,label);
  for(const [settings,mode] of [[FORCED,'official'],[FREE,'published'],[{...FORCED,jokerRule:'original'},null],[{...FORCED,jokerRule:'none'},null],[{yahtzeeBonus:true},null],
    [{...FORCED,yahtzeeBonus:false},null],[{...FREE,fullHouseYahtzee:true},null],[{jokerRule:'forced'},'official']])eq(b.optimalRuleMode(CLASSIC,settings),mode,JSON.stringify(settings));
  eq(b.toScorecard(IDS,emptyCard(),'official'),{usedMask:0,upper:0,yahtzeeBonus:false,ruleMode:'official'});
  const full={boxes:{...emptyCard().boxes,fours:16,fives:25,sixes:30,yahtzee:50,chance:22},bonuses:1};
  eq(b.toScorecard(IDS,full,'published'),{usedMask:(1<<3)|(1<<4)|(1<<5)|2048|4096,upper:63,yahtzeeBonus:true,ruleMode:'published'},'Upper capped at 63, Yahtzee 50 eligible');
  eq(b.toScorecard(IDS,{boxes:{...emptyCard().boxes,yahtzee:0},bonuses:0},'official').yahtzeeBonus,false,'Scratched Yahtzee earns no bonus');
  for(const bad of [undefined,Number.NaN,'5'])eq(b.toScorecard(IDS,{boxes:{...emptyCard().boxes,aces:bad},bonuses:0},'official'),null,`box ${String(bad)}`);
  eq(b.keepIndices([3,5,3,2,3],[3,3],[2,4]),[2,4],'Held dice stay held');eq(b.keepIndices([3,5,3,2,3],[3,3]),[0,2]);
  eq(b.keepIndices([3,5,3,2,3],[2,3,3,3],[4,9,-1]),[0,2,3,4]);eq(b.keepIndices([1,2,3,4,5],[]),[]);
  for(const args of [[CLASSIC,FORCED,null,[1,2,3,4,5],1],[CLASSIC,FORCED,{boxes:null},[1,2,3,4,5],1],[CLASSIC,FORCED,emptyCard(),[1,2,3,4],1],[CLASSIC,FORCED,emptyCard(),[1,2,3,4,7],1],
    [CLASSIC,FORCED,emptyCard(),[1,2,3,4,5],-1],[CLASSIC,FORCED,emptyCard(),[1,2,3,4,5],4],[CLASSIC,FORCED,emptyCard(),[1,2,3,4,5],1.5],[CLASSIC,FORCED,emptyCard(),[1,2,3,4,5],Number.NaN],
    [{categories:null},FORCED,emptyCard(),[1,2,3,4,5],1],[CLASSIC,null,emptyCard(),[1,2,3,4,5],1],[CLASSIC,FORCED,{boxes:{...emptyCard().boxes,aces:7}},[1,2,3,4,5],1],
    [CLASSIC,FORCED,{boxes:Object.fromEntries(IDS.map(id=>[id,0]))},[1,2,3,4,5],3]])eq(b.optimalMove(...args),null,'Total: null, never a throw');
  eq(b.optimalInput(CLASSIC,null),null);eq(b.optimalInput(CLASSIC,{phase:{id:'done'}}),null);eq(b.optimalInput(CLASSIC,{phase:{id:'roll'},turn:'a',cards:{a:[emptyCard()]},settings:FORCED,dice:[1,1,1,1,1],rolls:0,held:[]}),{type:'roll'});
  eq(b.optimalMove(CLASSIC,{...FORCED,jokerRule:'none'},emptyCard(),[1,2,3,4,5],1),null,'Unsupported rule: the normal bot plays');
  eq(b.scoreChoices(CLASSIC,{...FORCED,jokerRule:'original'},emptyCard(),[1,2,3,4,5]),null);
  return n;
}
/** A PartyBox card for a solver scorecard: upper boxes summing to its subtotal, lower boxes plausible. */
function partyCard(random,usedMask,upper,yahtzeeBonus) {
  const boxes=emptyCard().boxes;let left=upper;
  const faces=[0,1,2,3,4,5].filter(f=>usedMask&(1<<f));
  for(const f of faces){const face=f+1,n=f===faces.at(-1)?Math.min(5,Math.ceil(left/face)):Math.floor(random()*6);boxes[IDS[f]]=n*face;left=Math.max(0,left-n*face);}
  for(let c=6;c<13;c++)if(usedMask&(1<<c))boxes[IDS[c]]=c===11?(yahtzeeBonus?50:0):[0,13,25,30,40,0,21][c-6];
  return {boxes,bonuses:0};
}
function adapterConsistency(k,count,seed) {
  const random=seeded(200+seed);let checks=0;
  for(let i=0;i<count;i++){
    const usedMask=Math.floor(random()*8191),settings=i%2?FORCED:FREE,mode=i%2?'official':'published';
    const card=partyCard(random,usedMask,0,Boolean(usedMask&2048)&&random()<0.5),dice=Array.from({length:5},()=>Math.floor(random()*6)+1),rolls=1+i%3;
    let upper=0;for(let f=0;f<6;f++)upper+=card.boxes[IDS[f]]??0;
    const scorecard={usedMask,upper:Math.min(63,upper),yahtzeeBonus:card.boxes.yahtzee===50,ruleMode:mode};
    assert.deepEqual(k.bot.toScorecard(IDS,card,mode),scorecard);
    const held=[0,1,2,3,4].filter(()=>random()<0.4),move=k.bot.optimalMove(CLASSIC,settings,card,dice,rolls,held);
    const hold=rolls<3?root.bestHold(dice,3-rolls,scorecard).hold:dice;
    if(hold.length<5){
      assert.equal(move.type,'roll');assert.ok(move.keep.length<5&&new Set(move.keep).size===move.keep.length&&move.keep.every(x=>Number.isInteger(x)&&x>=0&&x<5));
      assert.deepEqual(move.keep.map(x=>dice[x]).sort(),[...hold].sort());
      assert.deepEqual(move.keep,b_keep(dice,hold,held));
    }else assert.deepEqual(move,{type:'score',category:IDS[root.bestCategory(dice,scorecard).category],column:0});
    const choices=k.bot.scoreChoices(CLASSIC,settings,card,dice),best=root.bestCategory(dice,scorecard);
    assert.equal(choices[0].category,IDS[best.category]);assert.ok(Object.is(choices[0].expectedValue,best.expectedValue));
    for(let j=1;j<choices.length;j++)assert.ok(choices[j-1].expectedValue>=choices[j].expectedValue);
    const legal=IDS.filter((_,c)=>root.score(dice,c,scorecard).legal);assert.deepEqual(choices.map(c=>c.category).sort(),[...legal].sort());
    for(const choice of choices){const c=IDS.indexOf(choice.category),r=reference.score(dice,c,scorecard);
      assert.ok(Math.abs(choice.expectedValue-(r.points+r.yahtzeeBonus+r.upperBonus+reference.expectedValue(r.next)))<=1e-10);checks++;}
    checks++;
  }
  return checks;
}
/** Independent restatement of keepIndices: held dice first, then left to right. */
function b_keep(dice,faces,held){const order=[...held,...dice.keys()],taken=[];for(const f of faces){const i=order.find(x=>!taken.includes(x)&&dice[x]===f);taken.push(i);}return taken.sort((a,b)=>a-b);}
/** Whole games through the adapter with PartyBox's turn flow, scored by the independent reference. */
function adapterGames(k,games,seed,settings) {
  const random=seeded(300+seed),mode=settings.jokerRule==='forced'?'official':'published',totals=[];
  for(let g=0;g<games;g++){
    const card=emptyCard();let scorecard={usedMask:0,upper:0,yahtzeeBonus:false,ruleMode:mode},total=0;
    for(let turn=0;turn<13;turn++){
      const state={phase:{id:'roll'},turn:'p1',cards:{p1:[card]},settings,dice:[1,1,1,1,1],rolls:0,held:[]};
      for(let step=0;;step++){
        assert.ok(step<4,'A turn ends within three rolls');
        const input=k.bot.optimalInput(CLASSIC,state);assert.ok(input,'Classic games always have an optimal move');
        if(input.type==='roll'){
          assert.ok(state.rolls<3);const keep=state.rolls===0?[]:input.keep;
          state.dice=state.dice.map((v,i)=>keep.includes(i)?v:Math.floor(random()*6)+1);state.held=[...keep];state.rolls++;state.phase={id:'choose'};continue;
        }
        const c=IDS.indexOf(input.category),r=reference.score(state.dice,c,scorecard);
        assert.ok(r.legal&&card.boxes[input.category]===null&&input.column===0,'Only open legal boxes');
        card.boxes[input.category]=r.points;card.bonuses+=r.yahtzeeBonus?1:0;total+=r.points+r.yahtzeeBonus+r.upperBonus;scorecard=r.next;break;
      }
    }
    let upper=0;for(let f=0;f<6;f++)upper+=card.boxes[IDS[f]];
    const sheet=Object.values(card.boxes).reduce((a,v)=>a+v,0)+(upper>=63?35:0)+100*card.bonuses;
    assert.equal(sheet,total,'PartyBox-style sheet total equals the solver\'s rewards');totals.push(total);
  }
  const mean=totals.reduce((a,v)=>a+v,0)/games,sd=Math.sqrt(totals.reduce((a,v)=>a+(v-mean)**2,0)/(games-1)),ev=k.api.expectedValue({usedMask:0,upper:0,yahtzeeBonus:false,ruleMode:mode});
  const z=(mean-ev)/(sd/Math.sqrt(games));assert.ok(Math.abs(z)<=4,`${mode} seed ${seed}: mean ${mean} vs ${ev} (${z} SE)`);
  return {mode,seed,games,mean,expectedValue:ev,standardErrors:z};
}
report.adapter={unitAssertions:adapterUnits(kit),consistency:[1,2,3].map(seed=>({seed,checks:adapterConsistency(kit,2000,seed)})),games:[]};
for(const seed of [1,2,3])for(const settings of [FORCED,FREE])report.adapter.games.push(adapterGames(kit,300,seed,settings));

// 7. Planted port bugs: each must compile strictly and be caught by the checks above.
const mutants=[
  ['P01 canonical subtotal boundary','optimal/tables.ts','upper + layout.left < UPPER_GOAL ? 0 : upper','upper + layout.left <= UPPER_GOAL ? 0 : upper'],
  ['P02 bonus block offset','optimal/tables.ts','(yahtzeeBonus ? layout.width : 0)','(yahtzeeBonus ? 0 : 0)'],
  ['P03 single block per mask','optimal/tables.ts','(mask & 2048 ? 2 : 1)','(mask & 2048 ? 1 : 1)'],
  ['P04 big-endian decode','optimal/tables.ts','view.getFloat64(i * 8, true)','view.getFloat64(i * 8, false)'],
  ['P05 base64 alphabet','optimal/tables.ts',"0123456789+/'","0123456789-_'"],
  ['P06 unreachable subtotal accepted','optimal/tables.ts','if (!layout.reach[upper] ||','if (!layout.reach[0] ||'],
  ['P07 mode table swap','optimal/tables.ts',"official: decode(SOLVED_OFFICIAL),\n  published: decode(SOLVED_PUBLISHED),","official: decode(SOLVED_PUBLISHED),\n  published: decode(SOLVED_OFFICIAL),"],
  ['P08 uncapped upper','optimal-bot.ts','upper: Math.min(63, upper)','upper: Math.min(64, upper)'],
  ['P09 scratched Yahtzee eligible','optimal-bot.ts','card.boxes[ids[11]!] === 50','card.boxes[ids[11]!] !== null'],
  ['P10 Joker rules swapped',"optimal-bot.ts","joker === 'forced' ? 'official' : joker === 'free' ? 'published'","joker === 'forced' ? 'published' : joker === 'free' ? 'official'"],
  ['P11 rerolls left','optimal-bot.ts','bestHold(dice, 3 - rolls, scorecard)','bestHold(dice, Math.min(2, 4 - rolls), scorecard)'],
  ['P12 held dice not preferred','optimal-bot.ts','[...held.filter((i) => i >= 0 && i < dice.length), ...dice.keys()]','[...dice.keys(), ...held.filter((i) => i >= 0 && i < dice.length)]'],
  ['P13 kind slots swapped','optimal-bot.ts',"c.count === 3 ? 6 : c.count === 4 ? 7 : -1","c.count === 3 ? 7 : c.count === 4 ? 6 : -1"],
  ['P14 fair die in port solver','optimal/solver.ts','values[hand] = total / 6;','values[hand] = total / 6.000001;'],
  ['P15 earned upper bonus again','optimal/rules.ts','category < 6 && card.upper < 63 &&','category < 6 && card.upper <= 63 &&'],
  ['P16 unsupported rule accepted','optimal-bot.ts',"joker === 'free' ? 'published' : null","joker === 'free' ? 'published' : 'official'"],
];
report.mutants=[];
for(const [name,file,before,after] of mutants){
  const filename=path.resolve(KIT,file),source=fs.readFileSync(filename,'utf8'),at=source.indexOf(before);
  assert.ok(at>=0&&source.indexOf(before,at+1)<0,`${name}: unique site`);
  const folder=`${VERIFY}/mutants/${name.slice(0,3)}`;
  compile(folder,{[filename]:source.slice(0,at)+after+source.slice(at+before.length)});
  let failure;
  try{
    const k=await load(folder);
    tableCheck(k,97);boundaryChecks(k.api,reference);differential(k,300,1);adapterUnits(k);adapterConsistency(k,300,1);adapterGames(k,20,1,FORCED);
  }catch(error){failure=String(error?.message??error).split('\n')[0].slice(0,160);}
  assert.ok(failure,`${name} survived`);assert.equal(fs.readFileSync(filename,'utf8'),source);
  report.mutants.push({name,file,before,after,killed:true,failure});
}
assert.equal(report.mutants.length,16);
report.passed=true;report.seconds=Math.round((Date.now()-started)/1000);
fs.writeFileSync('reports/partybox-port.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({partyboxPort:'PASS',tables:report.tables,suites:report.suites.seeds.length,differential:report.differential.reduce((a,d)=>a+d.states,0),adapterGames:report.adapter.games.map(g=>`${g.mode}/${g.seed}:${g.mean.toFixed(2)} (${g.standardErrors.toFixed(2)} SE)`),mutantsKilled:report.mutants.length,seconds:report.seconds}));
