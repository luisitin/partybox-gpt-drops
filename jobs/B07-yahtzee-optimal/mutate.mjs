import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
import {boundaryChecks,independentReference,randomStateComparison} from './test.mjs';

const seed=Number(process.argv[2]);assert.ok([1,2,3].includes(seed));
const source=fs.readFileSync('yahtzeeOpt.ts','utf8'),digest=createHash('sha256').update(source).digest('hex');
const changes=[
 ['M01 upper bonus','card.upper+points>=63?35:0','card.upper+points>=63?34:0'],
 ['M02 Yahtzee bonus','card.yahtzeeBonus?100:0','card.yahtzeeBonus?99:0'],
 ['M03 capped upper','Math.min(63,card.upper+points)','Math.min(62,card.upper+points)'],
 ['M04 full house','case 8:return pair&&triple?25:0','case 8:return pair&&triple?24:0'],
 ['M05 small straight','(bits&60)===60?30:0','(bits&60)===60?29:0'],
 ['M06 large straight','case 10:return bits===31||bits===62?40:0','case 10:return bits===31||bits===62?39:0'],
 ['M07 Yahtzee','case 11:return max===5?50:0','case 11:return max===5?49:0'],
 ['M08 upper face multiplier','counts[category]!*(category+1)','counts[category]!*(category+2)'],
 ['M09 three of a kind','case 6:return max>=3?sum:0','case 6:return max>=4?sum:0'],
 ['M10 four of a kind','case 7:return max>=4?sum:0','case 7:return max>=5?sum:0'],
 ['M11 chance','case 12:return sum;','case 12:return sum+1;'],
 ['M12 full house conjunction','case 8:return pair&&triple','case 8:return pair||triple'],
 ['M13 high small straight','||(bits&60)===60','||(bits&60)===61'],
 ['M14 high large straight','bits===31||bits===62','bits===31||bits===63'],
 ['M15 category maximization','value>best.expectedValue','value<best.expectedValue'],
 ['M16 fair die denominator','values[hand]=total/6','values[hand]=total/7'],
 ['M17 hold maximization','values[prior]!>values[hand]!','values[prior]!<values[hand]!'],
 ['M18 hold equality ordering','rank[choices[prior]!]!<rank[choices[hand]!]!','rank[choices[prior]!]!>rank[choices[hand]!]!'],
 ['M19 terminal hold ordering','return {hold:sorted,expectedValue:categoryChoice','return {hold:sorted.slice().reverse(),expectedValue:categoryChoice'],
 ['M20 table mask','const index=card.usedMask+card.upper','const index=(card.usedMask===ALL?0:card.usedMask)+card.upper'],
 ['M21 filled legality','if(!(legal&(1<<category)))','if(false&&!(legal&(1<<category)))'],
 ['M22 Yahtzee eligibility','category===11&&points===50','category===11&&points===0'],
 ['M23 first Yahtzee forced','const extra=face>=0&&Boolean(card.usedMask&YAHTZEE);','const extra=face>=0;'],
 ['M24 already earned upper bonus','upperBonus:category<6&&card.upper<63','upperBonus:category<6&&card.upper<=63'],
 ['M25 convention reversal',"extra&&card.ruleMode==='official'","extra&&card.ruleMode==='published'"],
];
assert.equal(changes.length,25);
const config=ts.readConfigFile('tsconfig.json',ts.sys.readFile);assert.equal(config.error,undefined);
const parsed=ts.parseJsonConfigFileContent(config.config,ts.sys,process.cwd());assert.equal(parsed.errors.length,0);
const filename=path.resolve('yahtzeeOpt.ts'),declarations=path.resolve('tables.d.ts');
const reference=independentReference(),results=[];
for(const [name,before,after] of changes) {
 const index=source.indexOf(before);assert.ok(index>=0,`${name} source site`);assert.equal(source.indexOf(before,index+1),-1,`${name} unique site`);
 const changed=source.slice(0,index)+after+source.slice(index+before.length);
 const options={...parsed.options,declaration:false,noEmit:false,outDir:undefined};
 const host=ts.createCompilerHost(options),read=host.readFile.bind(host);
 host.readFile=file=>path.resolve(file)===filename?changed:read(file);
 let compiled;
 host.writeFile=(file,text)=>{if(file.endsWith('yahtzeeOpt.js'))compiled=text;};
 const program=ts.createProgram([filename,declarations],options,host);
 const diagnostics=ts.getPreEmitDiagnostics(program),emitted=program.emit();diagnostics.push(...emitted.diagnostics);
 assert.equal(diagnostics.length,0,`${name} strict compile: ${ts.formatDiagnostics(diagnostics,{getCurrentDirectory:()=>process.cwd(),getCanonicalFileName:f=>f,getNewLine:()=> '\n'})}`);
 assert.ok(compiled);
 const folder=path.resolve(`.verification/mutants/${seed}/${name.slice(0,3)}`);fs.mkdirSync(folder,{recursive:true});
 const link=path.join(folder,'tables');if(!fs.existsSync(link))fs.symlinkSync(path.resolve('tables'),link,'dir');
 const target=path.join(folder,'yahtzeeOpt.mjs');fs.writeFileSync(target,compiled);
 let failure,gate;
 try {
   const api=await import(pathToFileURL(target).href);
   gate='manual, independent boundary and contract checks';boundaryChecks(api,reference);
   gate='independent seeded objective comparison';randomStateComparison(api,reference,seed,100);
 }catch(error){failure=String(error.message);}
 assert.ok(failure,`${name} survived runtime tests`);
 assert.equal(createHash('sha256').update(fs.readFileSync('yahtzeeOpt.ts')).digest('hex'),digest,'Production source unchanged');
 results.push({name,before,after,strictCompilation:true,runtimeKilled:true,gate,failure});
 console.log(JSON.stringify({seed,...results.at(-1)}));
}
const report={passed:true,seed,mutations:25,strictCompiled:25,runtimeKilled:25,productionSHA256:digest,originalUnchanged:true,results};
fs.writeFileSync(`reports/mutations-seed-${seed}.json`,JSON.stringify(report,null,2)+'\n');
