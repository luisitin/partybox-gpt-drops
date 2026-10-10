import {spawn} from 'node:child_process';
import {createInterface} from 'node:readline';
import {readFileSync,writeFileSync} from 'node:fs';
import {checkWitness} from './witness-check.mjs';
const positions=JSON.parse(readFileSync(new URL('./LARGE-PUBLIC-INPUTS.json',import.meta.url),'utf8'));
const python=spawn('python3',['milp-reference.py'],{cwd:new URL('.',import.meta.url),stdio:['pipe','pipe','inherit']});
const output=createInterface({input:python.stdout});
const reports=[];
for(const p of positions)python.stdin.write(JSON.stringify(p)+'\n');
python.stdin.end();
for await(const line of output){
 const index=reports.length,row=JSON.parse(line),report=checkWitness(positions[index],row);
 reports.push(report);console.log(JSON.stringify({index,...report}));
}
const code=await new Promise(resolve=>python.on('exit',resolve));
if(code!==0||reports.length!==positions.length)throw Error('Incomplete oracle run');
writeFileSync('MILP-PUBLIC-10.json',JSON.stringify({status:'passed',cases:reports.length,reports},null,2)+'\n');
