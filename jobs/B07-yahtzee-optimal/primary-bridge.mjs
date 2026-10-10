import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import {pathToFileURL} from 'node:url';

// Append a verification-only observation export to the actual source body.
// Its private scoring/expectation/maximization functions are reused, not copied.
const suffix=`
export function inspectTurn(input:Scorecard) {
 const card=cardInput(input),values=new Float64Array(HAND_COUNT),category=new Int16Array(252);
 for(let r=0;r<252;r++){const chosen=categoryChoice(handData[FULL_FIRST+r]!.counts,card);category[r]=chosen.category;values[FULL_FIRST+r]=chosen.expectedValue;}
 const zero=values.slice(FULL_FIRST);average(values);const first=maximize(values),one=values.slice(FULL_FIRST);
 const holdOneCodes=new Int32Array(252);for(let r=0;r<252;r++)holdOneCodes[r]=handData[first[FULL_FIRST+r]!]!.code;
 average(values);const second=maximize(values),two=values.slice(FULL_FIRST);
 const holdTwoCodes=new Int32Array(252);for(let r=0;r<252;r++)holdTwoCodes[r]=handData[second[FULL_FIRST+r]!]!.code;
 return {zero,one,two,category,holdOneCodes,holdTwoCodes};
}
`;
export async function createPrimaryBridge() {
 const original=fs.readFileSync('yahtzeeOpt.ts','utf8'),filename=path.resolve('yahtzeeOpt.ts');
 const config=ts.readConfigFile('tsconfig.json',ts.sys.readFile);assert.equal(config.error,undefined);
 const parsed=ts.parseJsonConfigFileContent(config.config,ts.sys,process.cwd());assert.equal(parsed.errors.length,0);
 const options={...parsed.options,declaration:false,noEmit:false,outDir:undefined};
 const host=ts.createCompilerHost(options),read=host.readFile.bind(host);host.readFile=file=>path.resolve(file)===filename?original+suffix:read(file);
 let output;host.writeFile=(file,content)=>{if(file.endsWith('yahtzeeOpt.js'))output=content;};
 const program=ts.createProgram([filename,path.resolve('tables.d.ts')],options,host);
 const diagnostics=ts.getPreEmitDiagnostics(program),emitted=program.emit();diagnostics.push(...emitted.diagnostics);
 assert.equal(diagnostics.length,0,ts.formatDiagnostics(diagnostics,{getCurrentDirectory:()=>process.cwd(),getCanonicalFileName:f=>f,getNewLine:()=> '\n'}));assert.ok(output);
 fs.mkdirSync('.verification/primary-bridge',{recursive:true});
 const tableLink=path.resolve('.verification/primary-bridge/tables');if(!fs.existsSync(tableLink))fs.symlinkSync(path.resolve('tables'),tableLink,'dir');
 fs.writeFileSync('.verification/primary-bridge/instrumented.ts',original+suffix);
 const target=path.resolve('.verification/primary-bridge/primary.mjs');fs.writeFileSync(target,output);
 const api=await import(pathToFileURL(target).href);assert.equal(fs.readFileSync('yahtzeeOpt.ts','utf8'),original);
 return {inspectTurn:api.inspectTurn,originalSource:original,instrumentation:suffix};
}
