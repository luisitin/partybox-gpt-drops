// Supplemental assertion-based mutation readiness; does not run a timing gate.
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {deepStrictEqual,AssertionError} from 'node:assert';
import {nameFilter} from '../../jobs/B19-name-filter/dist/nameFilter.js';
const job=new URL('../../jobs/B19-name-filter/',import.meta.url);
const compiled=readFileSync(new URL('dist/nameFilter.js',job),'utf8');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const controls=[
 ['M15',"c === 'i' || c === 'l'","c === 'i'",'c1it',{ok:false,reason:'blocked',suggestion:'choose-another'}],
 ['M19',"run.length === 1 ? '+'","run.length === 1 ? ''",'seeex',{ok:false,reason:'blocked',suggestion:'choose-another'}],
 ['M25','`{${run.length},}`',"'+'",'Bob',{ok:true}],
];
const startedUtc=new Date().toISOString(), rows=[];
for(const [id,from,to,input,truth] of controls){
 const anchorOccurrences=compiled.split(from).length-1;
 deepStrictEqual(anchorOccurrences,1);
 deepStrictEqual(nameFilter(input),truth);
 const code=compiled.replace(from,to);
 const mutant=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
 const actual=mutant.nameFilter(input);
 let failure=null;
 try{deepStrictEqual(actual,truth);}catch(error){if(!(error instanceof AssertionError))throw error;failure={name:error.name,code:error.code,message:error.message};}
 if(failure===null)throw Error(`Actual behavioral assertion did not fail: ${id}`);
 rows.push({id,anchorOccurrences,input,truth,baseline:nameFilter(input),mutantActual:actual,mutantSha256:hash(code),actualAssertionFailure:failure});
}
const report={kind:'supplemental-actual-assertion-mutation-readiness',startedUtc,closedUtc:new Date().toISOString(),sourceSha256:hash(readFileSync(new URL('nameFilter.ts',job))),compiledSha256:hash(compiled),controls:rows,cases:3,passed:3,latencyCheckExecuted:false,originalFullMutantChecksStillRequired:true};
writeFileSync(new URL('mutation-anchor-check.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
