/** I/O belongs in this build/test module, never in the runtime icon library. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { iconNames, getIcon } from '../src/icons.js';
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export interface Entry { readonly id:string; readonly title:string; readonly category:string; }
export const entries = JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8')) as Entry[];
export const backgrounds = Object.freeze({white:'#ffffff',black:'#000000','mid-grey':'#808080',blue:'#0057ff',yellow:'#ffde00'});
export interface Raster { readonly id:string; readonly size:number; readonly rgba:Buffer; readonly png:Buffer; }
export async function renderAll():Promise<Raster[]> {
  const result:Raster[]=[];
  for(const size of [24,48,256]){
    fs.mkdirSync(path.join(root,'png',String(size)),{recursive:true});
    for(const id of iconNames){
      const svg=fs.readFileSync(path.join(root,'icons',id+'.svg'),'utf8');
      const image=sharp(Buffer.from(svg),{density:72*size/64,limitInputPixels:1000000});
      const metadata=await image.metadata();
      if(metadata.width!==size||metadata.height!==size) throw new Error('SVG rendered at wrong native dimensions: '+id);
      const raw=await image.ensureAlpha().raw().toBuffer({resolveWithObject:true});
      if(raw.info.channels!==4) throw new Error('not RGBA');
      const png=await sharp(raw.data,{raw:{width:size,height:size,channels:4}}).png({compressionLevel:9,adaptiveFiltering:false,palette:false}).toBuffer();
      fs.writeFileSync(path.join(root,'png',String(size),id+'.png'),png);
      result.push({id,size,rgba:raw.data,png});
    }
  }
  return result;
}
const xml=(s:string):string=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function tile(index:number,size:number):{left:number;top:number}{
  const group=Math.floor(index/20),local=index%20;
  return {left:45+(local%10)*112+56-size/2,top:130+group*239+38+Math.floor(local/10)*94+24-size/2};
}
export async function contacts(rasters:readonly Raster[]):Promise<void>{
  fs.mkdirSync(path.join(root,'preview'),{recursive:true});
  for(const [bg,color] of Object.entries(backgrounds)){
    const foreground=['black','blue','mid-grey'].includes(bg)?'#ffffff':'#20243a';
    let body='<rect width="1200" height="1600" fill="'+color+'"/>';
    body+='<g fill="'+foreground+'" font-family="DejaVu Sans, sans-serif"><text x="45" y="65" font-size="42" font-weight="bold">PARTY / 120</text><text x="45" y="101" font-size="17">Original SVG icons / actual 48 px rasters / 64-unit grid / 6-color palette</text>';
    for(let group=0;group<6;group++){
      const y=130+group*239;
      body+='<text x="45" y="'+(y+15)+'" font-size="14" font-weight="bold">'+String(group+1).padStart(2,'0')+'  '+xml(entries[group*20]!.category.toUpperCase())+'</text><path d="M45 '+(y+24)+'H1155" stroke="'+foreground+'"/>';
    }
    for(const [index,entry] of entries.entries()){
      const where=tile(index,48);
      body+='<text x="'+(where.left+24)+'" y="'+(where.top+70)+'" text-anchor="middle" font-size="11">'+xml(entry.id)+'</text>';
    }
    body+='<text x="45" y="1583" font-size="12">B15 / Transparent icons; background color belongs to this preview only.</text></g>';
    const base=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600">'+body+'</svg>');
    const layers=entries.map((entry,index)=>({input:rasters.find(r=>r.id===entry.id&&r.size===48)!.png,...tile(index,48)}));
    await sharp(base).composite(layers).png({compressionLevel:9,adaptiveFiltering:false}).toFile(path.join(root,'preview','contact-'+bg+'.png'));
  }
  // Native 24 px pixels, enlarged only for inspection; this is not a fresh 96 px render.
  const panels:sharp.OverlayOptions[]=[];
  for(const [index,entry] of entries.entries()){
    const icon=rasters.find(r=>r.id===entry.id&&r.size===24)!;
    panels.push({input:await sharp(icon.png).resize(96,96,{kernel:'nearest'}).toBuffer(),left:12+(index%10)*112,top:70+Math.floor(index/10)*124});
  }
  const labels=entries.map((e,i)=>'<text x="'+(60+(i%10)*112)+'" y="'+(182+Math.floor(i/10)*124)+'" text-anchor="middle" font-size="10">'+xml(e.id)+'</text>').join('');
  const backdrop=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1120" height="1570"><rect width="1120" height="1570" fill="#ffffff"/><g fill="#20243a" font-family="DejaVu Sans, sans-serif"><text x="16" y="35" font-size="24" font-weight="bold">24 px proof / nearest-neighbor 4x enlargement</text>'+labels+'</g></svg>');
  await sharp(backdrop).composite(panels).png({compressionLevel:9}).toFile(path.join(root,'preview','24px-proof-4x.png'));
}
if(process.argv.includes('--write')){
  fs.mkdirSync(path.join(root,'icons'),{recursive:true});
  for(const name of iconNames) fs.writeFileSync(path.join(root,'icons',name+'.svg'),getIcon(name)!);
  await contacts(await renderAll());
}
