import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import ts from 'typescript';
import { auditSvg,alphaMask,compareMasks,belowLimit,utf8Bytes } from '../src/check.js';
import { iconNames,getIcon,getSprite,palette } from '../src/icons.js';
import { buildGallery } from './gallery.js';
import { svgCases,maskCases,seeded } from './fixtures.js';
import { root,entries,backgrounds,tile,renderAll,contacts } from './generate.js';
import { pngFixtures } from './png-fixtures.js';
import { runMutations,limitCases } from './mutate.js';
import type { Audit } from '../src/check.js';
import type { MutationResult } from './mutate.js';
interface Oracle {
  audits: Audit[];
  pngs: {name:string;size:number;pixels:number;bytes:number;maskSha256:string}[];
  pairs: Record<string,[string,string,number,number][]>;
  secondaryPairs: Record<string,[string,string,number,number][]>;
  crossRenderer:[string,number,number,number][];
  maskCases:[number,number][];
  pngFixtures:{ok:boolean;width?:number;height?:number;rgba?:number[]}[];
  cairoSVG:string;
}
interface BlindOracle extends Omit<Oracle,'cairoSVG'> {
  rawAudits:Audit[];
  secondaryPngs:Oracle['pngs'];
  maskWords:[number[],number[]][];
  limits:boolean[];
}
interface TestRow { name:string;cases:number;passed:number;seed:number;command:string; }
interface PairMax {a:string;b:string;intersection:number;union:number;iou:number;size:number;renderer:string;}
const reportDir=path.join(root,'reports');fs.mkdirSync(reportDir,{recursive:true});
const rows:TestRow[]=[],allMutations:MutationResult[]=[],maxima:PairMax[]=[],vectors:unknown[]=[];
const sha=(b:Uint8Array|string):string=>createHash('sha256').update(b).digest('hex');
const save=(name:string,value:unknown):void=>fs.writeFileSync(path.join(reportDir,name),JSON.stringify(value,null,2)+'\n');
function command(cmd:string,args:string[],input?:string):string{
  const result=spawnSync(cmd,args,{cwd:root,encoding:'utf8',maxBuffer:128*1024*1024,...(input===undefined?{}:{input})});
  if(result.error)throw result.error;
  if(result.status!==0)throw new Error(cmd+' '+args.join(' ')+'\n'+result.stdout+'\n'+result.stderr);
  return result.stdout;
}
function record(name:string,cases:number,seed:number,cmd='npm test'):void {rows.push({name,cases,passed:cases,seed,command:cmd});console.log('seed '+seed+' PASS '+name+' ('+cases+')');}
function bitBytes(mask:Uint32Array):Buffer{const b=Buffer.alloc(mask.length*4);mask.forEach((v,i)=>b.writeUInt32LE(v,i*4));return b;}
function productionChecks():number {
  const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')) as {dependencies:Record<string,string>;devDependencies:Record<string,string>};
  assert.equal(Object.keys(pkg.dependencies).length,0);
  assert.equal(pkg.devDependencies.typescript,ts.version);
  const config=JSON.parse(fs.readFileSync(path.join(root,'tsconfig.json'),'utf8')) as {compilerOptions:{strict:boolean;noUncheckedIndexedAccess:boolean;exactOptionalPropertyTypes:boolean}};
  assert.equal(config.compilerOptions.strict,true);assert.equal(config.compilerOptions.noUncheckedIndexedAccess,true);assert.equal(config.compilerOptions.exactOptionalPropertyTypes,true);
  let files=0;
  for(const folder of ['src','test'])for(const name of fs.readdirSync(path.join(root,folder)).filter(x=>x.endsWith('.ts'))){
    files++;const source=ts.createSourceFile(name,fs.readFileSync(path.join(root,folder,name),'utf8'),ts.ScriptTarget.Latest,true);
    const visit=(node:ts.Node):void=>{
      if(ts.isPropertyAccessExpression(node)&&ts.isIdentifier(node.expression)){
        assert.ok(!(node.expression.text==='Math'&&node.name.text==='random'),'ambient RNG');
        assert.ok(!(node.expression.text==='Date'&&node.name.text==='now'),'ambient clock');
      }
      if(folder==='src'&&ts.isImportDeclaration(node)&&ts.isStringLiteral(node.moduleSpecifier))assert.ok(node.moduleSpecifier.text.startsWith('./'),'runtime external import');
      ts.forEachChild(node,visit);
    };visit(source);
  }
  return files;
}
command('python3',['test/unpack.py']);
assert.equal(entries.length,120);assert.equal(iconNames.length,120);assert.equal(new Set(iconNames).size,120);
assert.deepEqual([...iconNames].sort(),entries.map(e=>e.id).sort());
assert.deepEqual(fs.readdirSync(path.join(root,'icons')).sort(),iconNames.map(x=>x+'.svg').sort());
let firstHashes:Record<string,string>|undefined;
for(const seed of [1,2,3]){
  // Strict compilation is repeated as well, not just the randomized runtime suites.
  command('python3',['-c',"import os,runpy,subprocess;os.chdir('test/blind');subprocess.run(['sha256sum','-c','SEALED-SHA256SUMS.txt'],check=True);runpy.run_path('selfcheck.py',run_name='__main__')"]);record('Sealed reference mathematical/profile self-checks',69,seed);
  command(process.execPath,['node_modules/typescript/bin/tsc','-p','tsconfig.json']);record('TypeScript strict compilation',1,seed,'node node_modules/typescript/bin/tsc -p tsconfig.json');
  record('Runtime dependency / ambient RNG / clock AST audit',productionChecks(),seed);
  command('sha256sum',['-c','SHA256SUMS.txt']);record('Authored-input SHA-256 seal',fs.readFileSync(path.join(root,'SHA256SUMS.txt'),'utf8').trim().split('\n').length,seed,'sha256sum -c SHA256SUMS.txt');
  const rng=seeded(seed),art=iconNames.map(name=>({name:'asset:'+name,svg:fs.readFileSync(path.join(root,'icons',name+'.svg'),'utf8'),valid:true}));
  for(const a of art){assert.equal(a.svg,getIcon(a.name.slice(6)));const info=auditSvg(a.svg);assert.ok(info.valid,a.name+': '+info.issues.join(','));assert.ok(info.colors.every(c=>(palette as readonly string[]).includes(c)));}
  record('Sealed SVG bundle / generator byte equality / palette',120,seed);
  const all=[...art,...svgCases(rng)],masks=maskCases(rng);
  // Seeded ordering exercises accidental state/order dependencies.
  for(let i=all.length-1;i>0;i--){const j=Math.floor(rng()*(i+1)),temp=all[i]!;all[i]=all[j]!;all[j]=temp;}
  const rasters=await renderAll();record('Native-size librsvg rasterization',360,seed);
  const fixtures=pngFixtures(path.join(reportDir,'.png-fixtures'));
  const oracle=JSON.parse(command('python3',['test/oracle.py'],JSON.stringify({cases:all,maskCases:masks,pngFixtures:fixtures,pngRoot:path.join(root,'png'),secondaryRoot:path.join(root,'png-cairo'),svgRoot:path.join(root,'icons'),ids:iconNames}))) as Oracle;
  const blind=JSON.parse(command('python3',['test/blind-adapter.py'],JSON.stringify({cases:all,maskCases:masks,limits:limitCases,pngFixtures:fixtures,pngRoot:path.join(root,'png'),secondaryRoot:path.join(root,'png-cairo'),ids:iconNames}))) as BlindOracle;
  assert.equal(blind.audits.length,all.length);
  assert.deepEqual(blind.pairs,oracle.pairs);
  assert.deepEqual(blind.secondaryPairs,oracle.secondaryPairs);
  assert.deepEqual(blind.crossRenderer,oracle.crossRenderer);
  assert.deepEqual(blind.maskCases,oracle.maskCases);
  assert.deepEqual(blind.pngFixtures,oracle.pngFixtures);
  const rawDifferences=all.filter((test,index)=>blind.rawAudits[index]!.valid!==test.valid).map(test=>test.name);
  assert.deepEqual(rawDifferences,['spaces-around-equals']);
  assert.equal(oracle.audits.length,all.length);assert.equal(oracle.pngs.length,360);assert.equal(oracle.maskCases.length,masks.length);
  const caseLog:unknown[]=[];
  for(const [index,test] of all.entries()){
    const a=auditSvg(test.svg),b=oracle.audits[index]!,c=blind.audits[index]!;
    assert.equal(a.valid,test.valid,'A: '+test.name+' '+a.issues);assert.equal(b.valid,test.valid,'B: '+test.name);
    assert.equal(a.bytes,b.bytes,'UTF-8 bytes '+test.name);
    assert.equal(c.valid,test.valid,'sealed reference plus documented serialization profile: '+test.name);
    assert.equal(a.bytes,c.bytes,'sealed UTF-8 bytes '+test.name);
    if(test.valid){assert.deepEqual(a.colors,b.colors);assert.equal(a.shapes,b.shapes);assert.deepEqual(a.colors,c.colors);assert.equal(a.shapes,c.shapes);}
    caseLog.push({name:test.name,expected:test.valid,a:a.valid,b:b.valid,blind:c.valid,rawBlind:blind.rawAudits[index]!.valid,passed:true,bytes:a.bytes});
  }
  record('Dual XML / SVG profile auditors, all assets and adversarial cases',all.length,seed);
  record('Sealed blind SVG auditor plus explicit canonical serialization rule',all.length,seed);
  for(const [index,test] of masks.entries()){
    const a=Uint8Array.from(test.a),b=Uint8Array.from(test.b),aBefore=Buffer.from(a),bBefore=Buffer.from(b);
    const ma=alphaMask(a)!,mb=alphaMask(b)!,snapshotA=Array.from(ma),snapshotB=Array.from(mb),value=compareMasks(ma,mb)!;
    assert.deepEqual([value.intersection,value.union],oracle.maskCases[index]);
    assert.deepEqual(snapshotA,blind.maskWords[index]![0]);assert.deepEqual(snapshotB,blind.maskWords[index]![1]);
    if(test.expected)assert.deepEqual([value.intersection,value.union],test.expected);
    assert.deepEqual(Buffer.from(a),aBefore);assert.deepEqual(Buffer.from(b),bBefore);assert.deepEqual(Array.from(ma),snapshotA);assert.deepEqual(Array.from(mb),snapshotB);
  }
  record('Seeded mask arithmetic differential and input immutability',masks.length,seed);
  record('Sealed blind exact alpha words and overlap arithmetic',masks.length,seed);
  for(const [index,[i,u,answer]] of limitCases.entries()){assert.equal(belowLimit(i,u),answer);assert.equal(blind.limits[index],answer);}
  assert.equal(alphaMask(new Uint8Array(3)),undefined);assert.equal(compareMasks([1],[1,0]),undefined);
  assert.equal(utf8Bytes('🎲'),4);assert.equal(utf8Bytes('café'),5);
  for(const name of ['__proto__','constructor','toString','hasOwnProperty','not-an-icon'])assert.equal(getIcon(name),undefined);
  record('Boundary, malformed input and prototype-safe lookup',limitCases.length+9,seed);
  // Polish pass 2026-10-08: ink theming option, sprite, gallery page and bilingual manifest.
  let themed=0;
  for(const name of iconNames){
    const base=getIcon(name)!,current=getIcon(name,{ink:'currentColor'})!,black=getIcon(name,{ink:'#000000'})!;
    assert.equal(current,base.replaceAll('"#20243a"','"currentColor"'));assert.ok(!current.includes('#20243a'),name);
    assert.equal(getIcon(name,{}),base);assert.equal(getIcon(name,{ink:'#20243a'}),base);
    const audit=auditSvg(black);assert.ok(audit.valid,name+' ink #000000');assert.ok(!audit.colors.includes('#20243a'),name);
    themed+=4;
  }
  const badInks=['red','#12345','#GGGGGG','#20243A','url(#x)','"/><script>','',' currentColor','currentcolor'];
  for(const ink of badInks)assert.equal(getIcon('dice',{ink}),undefined,'ink '+ink);
  const sprite=getSprite()!,symbols=[...sprite.matchAll(/<symbol id="pb-icon-([a-z0-9-]+)"( viewBox="0 0 64 64"[^]*?)<\/symbol>/g)];
  assert.equal(fs.readFileSync(path.join(root,'sprite.svg'),'utf8'),sprite);assert.equal(getSprite({ink:'bad'}),undefined);
  assert.deepEqual(symbols.map(m=>m[1]),[...iconNames]);
  for(const m of symbols){const svg=getIcon(m[1]!,{ink:'currentColor'})!;assert.equal(m[2],svg.slice(svg.indexOf(' viewBox='),-'</svg>'.length));}
  const gallery=fs.readFileSync(path.join(root,'gallery.html'),'utf8');
  assert.equal(gallery,buildGallery(entries,sprite),'gallery.html is stale: run npm run generate');
  assert.ok(!/(src|href|url)\(?=?"?(https?:)?\/\//.test(gallery),'gallery must not load anything over the network');
  for(const e of entries){assert.ok(gallery.includes('value="'+e.id+'"'),e.id);assert.ok(e.titleEs.length>0&&e.titleEs.trim()===e.titleEs,'Spanish title '+e.id);}
  record('Ink theming option, sprite symbols, gallery page and Spanish titles',themed+badInks.length+symbols.length+2*entries.length+2,seed);
  for(const [i,f] of fixtures.entries()){
    const value=oracle.pngFixtures[i]!;assert.equal(value.ok,f.valid,f.name);
    if(f.valid){assert.deepEqual(value.rgba,f.rgba);const raw=await sharp(f.path).ensureAlpha().raw().toBuffer();assert.deepEqual(Array.from(raw),f.rgba);}
  }
  record('All five PNG row filters, CRC corruption and truncation',fixtures.length,seed);
  const mapped=new Map<string,Uint32Array>(),hashes:Record<string,string>={};
  for(const [index,r] of rasters.entries()){
    const mask=alphaMask(r.rgba)!,b=oracle.pngs[index]!,c=blind.pngs[index]!;mapped.set(r.size+'/'+r.id,mask);
    assert.equal(b.name,r.id);assert.equal(b.size,r.size);assert.equal(b.bytes,r.rgba.length);
    assert.equal(sha(bitBytes(mask)),b.maskSha256,'independent mask bytes '+r.id);
    assert.equal(sha(bitBytes(mask)),c.maskSha256,'sealed mask bytes '+r.id);
    assert.equal(sha(r.rgba),(c as typeof c & {rgbaSha256:string}).rgbaSha256,'sealed RGBA bytes '+r.id);
    const secondary=await sharp(path.join(root,'png-cairo',String(r.size),r.id+'.png')).ensureAlpha().raw().toBuffer(),d=blind.secondaryPngs[index]!;
    assert.equal(sha(secondary),(d as typeof d & {rgbaSha256:string}).rgbaSha256,'sealed Cairo RGBA bytes '+r.id);
    assert.equal(sha(bitBytes(alphaMask(secondary)!)),d.maskSha256,'sealed Cairo mask bytes '+r.id);
    const own=compareMasks(mask,mask)!;assert.equal(own.union,b.pixels);assert.ok(b.pixels>0);
    if(r.size===256){for(let i=0;i<256;i++)for(const pos of [i,255*256+i,i*256,i*256+255])assert.equal(r.rgba[pos*4+3],0,'clipping '+r.id);}
    // Live area: nothing opaque within 2 grid units (8 px at 256) of the edge, so every icon has the same optical frame.
    if(r.size===256){for(let y=0;y<256;y++)for(let x=0;x<256;x++)if(x<8||y<8||x>=248||y>=248)assert.ok(r.rgba[(y*256+x)*4+3]!<128,'live area '+r.id);}
    // Night visibility: at 48 px at least a quarter of the opaque pixels are lighter than the ink, so no icon vanishes on the night theme.
    if(r.size===48){let opaque=0,lit=0;for(let i=0;i<48*48;i++){if(r.rgba[i*4+3]!<128)continue;opaque++;if(0.2126*r.rgba[i*4]!+0.7152*r.rgba[i*4+1]!+0.0722*r.rgba[i*4+2]!>=60)lit++;}assert.ok(4*lit>=opaque,'night visibility '+r.id+' '+lit+'/'+opaque);}
    hashes['librsvg/'+r.size+'/'+r.id]=sha(r.png);
    hashes['cairo/'+r.size+'/'+r.id]=sha(fs.readFileSync(path.join(root,'png-cairo',String(r.size),r.id+'.png')));
  }
  record('Independent PNG decoder / exact mask bytes / dimensions / clipping',360,seed);
  record('Live area (2-unit margin at 256 px) and night-theme visibility (48 px)',240,seed);
  record('Independent CairoSVG native-size rasterization',360,seed);
  record('Sealed blind PNG decoder / exact RGBA and mask bytes, both renderers',720,seed);
  for(const renderer of ['librsvg','cairo'])for(const size of [24,48,256]){
    const pairs=renderer==='librsvg'?oracle.pairs[String(size)]!:oracle.secondaryPairs[String(size)]!;
    assert.equal(pairs.length,7140);let max:PairMax={a:'',b:'',intersection:0,union:1,iou:0,size,renderer};
    const seen=new Set<string>();
    for(const [a,b,intersection,union] of pairs){
      const key=[a,b].sort().join('/');assert.ok(!seen.has(key));seen.add(key);
      if(renderer==='librsvg'){const calculated=compareMasks(mapped.get(size+'/'+a)!,mapped.get(size+'/'+b)!)!;assert.equal(calculated.intersection,intersection);assert.equal(calculated.union,union);}
      assert.ok(belowLimit(intersection,union),renderer+' '+size+' '+a+' / '+b+' IoU '+intersection/union);
      if(intersection*max.union>max.intersection*union)max={a,b,intersection,union,iou:intersection/union,size,renderer};
    }
    maxima.push(max);record(renderer+' silhouette pairs at '+size+' px',pairs.length,seed);
  }
  record('Sealed blind exact silhouette pair counts, both renderers and all sizes',42840,seed);
  const minimum=Math.min(...oracle.crossRenderer.map(row=>row[2]/row[3]));
  assert.ok(minimum>=0.90,'renderer drift '+minimum);record('Cross-renderer alpha-mask agreement >= 0.90',360,seed);
  await contacts(rasters);
  for(const [name,color] of Object.entries(backgrounds)){
    const raw=await sharp(path.join(root,'preview','contact-'+name+'.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    assert.equal(raw.info.width,1200);assert.equal(raw.info.height,1600);
    const bg=[1,3,5].map(offset=>parseInt(color.slice(offset,offset+2),16));
    assert.deepEqual(Array.from(raw.data.subarray(0,4)),[...bg,255]);
    for(const [index,entry] of entries.entries()){
      const image=rasters.find(r=>r.id===entry.id&&r.size===48)!,where=tile(index,48);
      for(let y=0;y<48;y++)for(let x=0;x<48;x++){
        const source=(y*48+x)*4,destination=((where.top+y)*1200+where.left+x)*4,a=image.rgba[source+3]!;
        for(let c=0;c<3;c++){
          const expected=Math.round((image.rgba[source+c]!*a+bg[c]!*(255-a))/255);
          assert.ok(Math.abs(raw.data[destination+c]!-expected)<=2,'thumbnail compositing '+name+' '+entry.id);
        }
      }
    }
    hashes['preview/'+name]=sha(fs.readFileSync(path.join(root,'preview','contact-'+name+'.png')));
  }
  record('Seven backgrounds incl. PartyBox night and daylight / all 840 raster thumbnails',840,seed);
  if(firstHashes)assert.deepEqual(hashes,firstHashes);else firstHashes=hashes;
  record('Deterministic raster and contact-sheet hashes',Object.keys(hashes).length,seed);
  const mutations=await runMutations(root,seed,all,masks,oracle.maskCases);
  for(const mutation of mutations)assert.ok(mutation.killed,mutation.id+' survived');
  allMutations.push(...mutations);record('Sequential executable source mutants killed',mutations.length,seed);
  save('oracle-seed-'+seed+'.json',oracle);save('blind-seed-'+seed+'.json',blind);save('cases-seed-'+seed+'.json',caseLog);
  vectors.push({seed,svgCases:all.length,maskCases:masks.length,mutantCasesEach:mutations[0]!.executedCases,minimumCrossRendererIoU:minimum,cairoSVG:oracle.cairoSVG});
}
const assets=iconNames.map(id=>{const value=auditSvg(getIcon(id)!);return {id,bytes:value.bytes,colors:value.colors.length,sha256:sha(getIcon(id)!)};});
save('results.json',{status:'PASS',seeds:[1,2,3],rows,maxima,vectors,assets,environment:{node:process.version,typescript:ts.version,sharp:sharp.versions}});
save('mutations.json',allMutations);
fs.rmSync(path.join(reportDir,'.png-fixtures'),{recursive:true,force:true});
console.log('ALL THREE SEEDS PASSED. Packaging complete evidence.');
command('python3',['test/package.py']);
