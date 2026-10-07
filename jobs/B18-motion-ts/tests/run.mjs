import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {fileURLToPath,pathToFileURL} from 'node:url';
import ts from 'typescript';

process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'));
const args=process.argv.slice(2);
assert.ok(args.length===0 || (args.length===2 && args[0]==='--seed' && /^[123]$/.test(args[1])),
  'usage: npm test OR node tests/run.mjs --seed 1|2|3 (no reduced-count mode)');
const seeds=args.length?[Number(args[1])]:[1,2,3];
const source=fs.readFileSync('motion.ts','utf8');
const hash=data=>createHash('sha256').update(data).digest('hex');
const limit=1200; // Decimal KB, not the more permissive 1228-byte interpretation.
fs.mkdirSync('.work/results',{recursive:true});
function command(file,argv,options={}) {
  const r=spawnSync(file,argv,{encoding:'utf8',maxBuffer:128*1024*1024,...options});
  if(r.error) throw r.error;
  assert.equal(r.status,0,`${file} ${argv.join(' ')}\n${r.stdout}\n${r.stderr}`);
  return r;
}
function rng(seed) {
  let state=seed>>>0;
  return ()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return (state>>>0)/4294967296;};
}
function randomSpring(random,i) {
  let m=.1+9.9*random(),w=.2+39.8*random(),z;
  switch(i%5) {
    case 0:z=.98*random();break;
    case 1:m=1;w=1+Math.floor(40*random());z=1;break;
    case 2:z=1.001+2.999*random();break;
    case 3:z=1+(random()<.5?-1:1)*10**(-6-8*random());break;
    default:z=4*random();
  }
  return [m,m*w*w,2*m*w*z,10*random()-5,10*random()-5];
}
function close(actual,expected,tolerance,label) {
  assert.ok(Number.isFinite(actual)&&Number.isFinite(expected)&&Math.abs(actual-expected)<tolerance,
    `${label}: actual=${actual}, expected=${expected}, tolerance=${tolerance}`);
}
function checksumCheck() {
  const manifest=fs.readFileSync('SHA256SUMS.txt','utf8');
  assert.ok(Buffer.byteLength(manifest)<=30000000,'manifest exceeds 30 MB');
  const lines=manifest.trim().split('\n');
  for(const line of lines) {
    const match=/^([a-f0-9]{64})  (.+)$/.exec(line);
    assert.ok(match,'malformed checksum entry');
    const bytes=fs.readFileSync(match[2]);
    assert.ok(bytes.length<=30000000,`file exceeds 30 MB: ${match[2]}`);
    assert.equal(hash(bytes),match[1],`checksum: ${match[2]}`);
  }
  return lines.length;
}

// Validate the immutable delivered tree before generating any test output.
const integrity=Object.fromEntries(seeds.map(seed=>[seed,checksumCheck()]));
const compiler=command('g++',['--version']).stdout.split('\n')[0];
console.log(`Node ${process.version}; TypeScript ${ts.version}; ${compiler}`);

for(const seed of seeds) {
  const begin=process.hrtime.bigint();
  const report={seed,command:`node tests/run.mjs --seed ${seed}`,sourceSha256:hash(source),suites:[]};
  const record=(name,cases,details={})=>{
    const row={name,cases,passed:cases,failed:0,seed,...details};
    report.suites.push(row); console.log(JSON.stringify(row));
  };
  record('SHA256 integrity and per-file 30 MB limit',integrity[seed]);
  command(process.execPath,['node_modules/typescript/bin/tsc','-p','tsconfig.json']);
  assert.equal(ts.version,'5.8.3');
  record('TypeScript strict compile',2);
  const prod=await import(pathToFileURL(path.resolve('dist/motion.js')).href+`?seed=${seed}`);
  const ref=await import(pathToFileURL(path.resolve('dist/tests/reference.js')).href+`?seed=${seed}`);
  const {regressions,mutations}=await import('./regressions.mjs');
  const {exactBezier}=await import('./exact.mjs');
  const tree=ts.createSourceFile('motion.ts',source,ts.ScriptTarget.Latest,true);
  let imports=0,forbidden=0;
  function visit(node) {
    if(ts.isImportDeclaration(node)||ts.isImportEqualsDeclaration(node)) imports++;
    if(ts.isPropertyAccessExpression(node)&&['Math.random','Date.now'].includes(node.getText(tree))) forbidden++;
    ts.forEachChild(node,visit);
  }
  visit(tree);
  assert.equal(imports,0);assert.equal(forbidden,0);
  assert.deepEqual(JSON.parse(fs.readFileSync('package.json','utf8')).dependencies,{});
  record('zero runtime deps / no ambient RNG or clock',3);
  const tsGzip=gzipSync(source,{level:9}).length;
  const jsGzip=gzipSync(fs.readFileSync('dist/motion.js'),{level:9}).length;
  assert.ok(tsGzip<=limit&&jsGzip<=limit);
  record('gzip size (level 9)',2,{sourceBytes:Buffer.byteLength(source),typescriptGzipBytes:tsGzip,javascriptGzipBytes:jsGzip,limitBytes:limit});
  record('fixed numeric and contract regressions',regressions(prod,seed));

  // Every RK4 integration step is compared, not only each spring's final frame.
  {
    const random=rng(seed), h=1e-4;
    let states=0,maxX=0,maxV=0,maxMatrix=0,worstX,worstV;
    const digest=createHash('sha256'),tags={under:0,critical:0,over:0};
    for(let i=0;i<10000;i++) {
      const params=randomSpring(random,i),[m,k,c,x0,v0]=params;
      const steps=100+Math.floor(9901*random());
      const discr=(c/m/2)**2-k/m;
      tags[discr<0?'under':discr>0?'over':'critical']++;
      let x=x0,v=v0;
      for(let j=0;j<=steps;j++) {
        const t=j*h,[xx,vv]=prod.spring(t,...params);
        const dx=Math.abs(x-xx),dv=Math.abs(v-vv);states++;
        if(dx>maxX){maxX=dx;worstX={case:i,step:j,t,params,closed:xx,rk4:x};}
        if(dv>maxV){maxV=dv;worstV={case:i,step:j,t,params,closed:vv,rk4:v};}
        if(!(dx<1e-6&&dv<1e-6)) assert.fail(`RK4 mismatch seed ${seed} case ${i} step ${j}: ${dx}, ${dv}`);
        if(j<steps) [x,v]=ref.rk4(x,v,m,k,c,h);
      }
      const analytic=prod.spring(steps*h,...params),matrix=ref.matrixSpring(steps*h,...params);
      for(let j=0;j<2;j++) {
        const delta=Math.abs(analytic[j]-matrix[j]);maxMatrix=Math.max(maxMatrix,delta);
        close(analytic[j],matrix[j],1e-7,`matrix spring ${seed}/${i}/${j}`);
      }
      digest.update(JSON.stringify([params,steps,x,v]));
    }
    record('closed form vs RK4, every dt=1e-4 frame',10000,
      {comparedStates:states,componentComparisons:2*states,actualDampingRegimes:tags,maxPositionError:maxX,maxVelocityError:maxV,worstX,worstV,traceSha256:digest.digest('hex')});
    record('closed form vs scaling/squaring matrix exponential',10000,{maxAbsoluteError:maxMatrix});
  }

  // All 1,000,000 inputs are checked against 113-bit arithmetic; none are sampled
  // for that comparison. The independent exact-integer audit is ADDITIONAL.
  {
    command('g++',['-std=gnu++17','-O2','-Wall','-Wextra','-Werror','-fno-fast-math','tests/oracle.cpp','-lquadmath','-o','.work/oracle']);
    const result=command('.work/oracle',[String(seed),'1000000'],{encoding:null});
    const buffer=result.stdout;
    assert.equal(buffer.length,1040004*56);
    let max=0,namedMax=0,oracleMax=0,worst,namedCount=0;
    const named=['','ease','ease-in','ease-out','ease-in-out'];
    for(let i=0;i<1040004;i++) {
      const row=Array.from({length:7},(_,j)=>buffer.readDoubleLE(56*i+8*j));
      const [kind,p,a,b,c,d,expected]=row;
      const actual=kind?prod.easings[named[kind]](p):prod.cubicBezier(p,a,b,c,d);
      const delta=Math.abs(actual-expected);
      close(actual,expected,1e-7,`113-bit bezier ${seed}/${i}`);
      if(kind){namedCount++;namedMax=Math.max(namedMax,delta);}
      else if(delta>max){max=delta;worst={case:i,input:[p,a,b,c,d],actual,reference:expected};}
      if(i<5000) {
        const exact=exactBezier(p,a,b,c,d),difference=Math.abs(exact-expected);
        oracleMax=Math.max(oracleMax,difference);
        close(expected,exact,1e-10+1e-14*Math.abs(exact),`113-bit vs exact integer oracle ${seed}/${i}`);
      }
    }
    record('cubic Bezier vs 113-bit reference',1000000,{maxAbsoluteError:max,worst,streamSha256:hash(buffer),referenceSignificandBits:113,bisectionIterations:116});
    record('all four CSS named easings vs 113-bit reference',namedCount,{perName:10001,progressRange:[-1,2],maxAbsoluteError:namedMax});
    record('113-bit oracle vs exact-integer Q160 Bernstein reference',5000,{maxAbsoluteDifference:oracleMax});
  }

  {
    const random=rng(seed^0x5641),M=Number.MAX_VALUE;
    let maxDelta=0,tailSamples=0,maxTailRatio=0;
    for(let i=0;i<10000;i++) {
      const params=randomSpring(random,i),epsilon=10**(-2-4*random());
      const t=prod.settleTime(...params,epsilon),expected=ref.referenceSettle(...params,epsilon);
      const delta=Math.abs(t-expected);maxDelta=Math.max(maxDelta,delta);
      close(t,expected,1e-9*Math.max(1,expected),`settle reference ${seed}/${i}`);
      assert.ok(t>=0&&Number.isFinite(t));
      if(t===M) continue;
      for(let j=0;j<64;j++) {
        const state=prod.spring(t*(1+j/8),...params);
        const ratio=Math.max(Math.abs(state[0]),Math.abs(state[1]))/epsilon;
        maxTailRatio=Math.max(maxTailRatio,ratio);tailSamples++;
        assert.ok(ratio<=1+1e-10,`settle upper bound ${seed}/${i}/${j}: ${ratio}`);
      }
    }
    record('settle estimate vs independent envelope bisection',10000,{maxAbsoluteTimeDifference:maxDelta});
    record('settle-tail position AND velocity bounds',tailSamples,{maxFractionOfTolerance:maxTailRatio});
  }

  {
    const random=rng(seed^0x1567);let cases=0,maxError=0;
    for(let i=0;i<10000;i++) {
      const p=randomSpring(random,i),t=random(),u=random(),[m,k,c,x,v]=p;
      const direct=prod.spring(t+u,...p),first=prod.spring(t,...p);
      const split=prod.spring(u,m,k,c,...first),scale=.1+9.9*random();
      const scaled=prod.spring(t+u,m*scale,k*scale,c*scale,x,v);
      const timeScaled=prod.spring((t+u)/2,m,4*k,2*c,x,2*v);
      for(let j=0;j<2;j++) for(const other of [split[j],scaled[j],timeScaled[j]/(j?2:1)]) {
        maxError=Math.max(maxError,Math.abs(direct[j]-other));
        close(direct[j],other,1e-8,`metamorphic ${seed}/${i}/${j}`);cases++;
      }
    }
    record('semigroup / physical scale / time-unit invariance',cases,{maxAbsoluteError:maxError});
  }

  {
    const random=rng(seed^0x7861),buf=new DataView(new ArrayBuffer(8));let cases=0,repeats=0;
    const float=()=>{let x;do {buf.setUint32(0,Math.floor(random()*2**32));buf.setUint32(4,Math.floor(random()*2**32));x=buf.getFloat64(0);}while(!Number.isFinite(x));return x;};
    function test(fn,args) {
      const actual=fn(...args),values=Array.isArray(actual)?actual:[actual];cases++;
      assert.ok(values.every(Number.isFinite),`nonfinite output ${fn.name}: ${JSON.stringify(args)}`);
      if(cases%127===0){assert.deepEqual(fn(...args),actual,'determinism');repeats++;}
    }
    const M=Number.MAX_VALUE,small=Number.MIN_VALUE;
    const edges=[-M,-1e300,-1e150,-1,-small,-0,0,small,2**-1022,1e-150,1e-12,.5,1,2,1e150,1e300,M];
    const functions=[[prod.spring,[.5,1,4,4,1,.2]],[prod.settleTime,[1,4,4,1,.2,.001]],[prod.cubicBezier,[.5,.25,.1,.25,1]]];
    for(const [fn,base] of functions) {
      for(let a=0;a<base.length;a++) for(let b=a;b<base.length;b++) for(const x of edges) for(const y of edges) {
        const tuple=[...base];tuple[a]=x;tuple[b]=y;test(fn,tuple);
      }
    }
    for(let i=0;i<150000;i++) {
      const a=Array.from({length:6},float);
      if(i%2===0){a[0]=Math.abs(a[0]);a[1]=Math.abs(a[1]);a[2]=Math.abs(a[2]);a[3]=Math.abs(a[3]);}
      test(prod.spring,a);test(prod.settleTime,a);
      const b=Array.from({length:5},float);
      if(i%2===0){b[1]=random();b[3]=random();}
      if(i%3===0)b[0]=random();
      test(prod.cubicBezier,b);
    }
    for(const n of [NaN,Infinity,-Infinity]) for(const [fn,base] of functions) for(let i=0;i<base.length;i++) {
      const args=[...base];args[i]=n;test(fn,args);
    }
    record('finite-output boundaries and random IEEE-754 inputs',cases,{randomTuples:450000,boundaryValues:edges.length,includesNonfiniteBonusInputs:true});
    record('repeat-call determinism on boundary/fuzz corpus',repeats);
  }

  {
    fs.mkdirSync('.work/sources',{recursive:true});fs.mkdirSync('.work/mutants',{recursive:true});
    const files=[],metadata=[];
    for(const [id,description,search,replacement,expectedOccurrences=1,occurrence=0] of mutations) {
      assert.equal(source.split(search).length-1,expectedOccurrences,`mutation anchor ${id}`);
      let from=0,index=0;for(let i=0;i<=occurrence;i++){index=source.indexOf(search,from);from=index+search.length;}
      const mutated=source.slice(0,index)+replacement+source.slice(index+search.length);
      assert.notEqual(mutated,source);const file=path.resolve(`.work/sources/${id}.ts`);
      fs.writeFileSync(file,mutated);files.push(file);metadata.push({id,description,sourceSha256:hash(mutated)});
    }
    const config=ts.parseJsonConfigFileContent(JSON.parse(fs.readFileSync('tsconfig.json','utf8')),ts.sys,process.cwd());
    const program=ts.createProgram(files,{...config.options,rootDir:path.resolve('.work/sources'),outDir:path.resolve('.work/mutants'),declaration:false});
    const diagnostics=ts.getPreEmitDiagnostics(program);
    assert.equal(diagnostics.length,0,ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCanonicalFileName:f=>f,getCurrentDirectory:()=>process.cwd(),getNewLine:()=> '\n'}));
    assert.equal(program.emit().emitSkipped,false);
    const kills=[];
    // One isolated module is exercised at a time; each contains exactly ONE bug.
    for(const meta of metadata) {
      const mutant=await import(pathToFileURL(path.resolve(`.work/mutants/${meta.id}.js`)).href+`?seed=${seed}`);
      let failure;
      try{regressions(mutant,seed);}catch(error){if(error.code!=='ERR_ASSERTION')throw error;failure=error.message;}
      assert.ok(failure,`SURVIVING MUTANT ${meta.id}: ${meta.description}`);
      kills.push({...meta,killed:true,failingAssertion:failure});
    }
    record('isolated deliberate mutation kills',25,{compiled:25,killed:25,survived:0,compileErrors:0,kills});
  }
  fs.writeFileSync(`.work/results/seed${seed}.json`,JSON.stringify(report,null,2)+'\n');
  console.log(`SEED ${seed} PASS in ${(Number(process.hrtime.bigint()-begin)/1e9).toFixed(2)}s`);
}
console.log('FULL REQUESTED SUITES PASSED for seeds '+seeds.join(', '));
