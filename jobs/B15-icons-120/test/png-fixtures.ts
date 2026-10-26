import fs from 'node:fs';
import path from 'node:path';
import { deflateSync } from 'node:zlib';
export interface PngFixture { readonly name:string;readonly path:string;readonly valid:boolean;readonly rgba?:readonly number[]; }
function crc(data:Uint8Array):number{let n=0xffffffff;for(const b of data){n^=b;for(let j=0;j<8;j++)n=(n>>>1)^((n&1)?0xedb88320:0);}return (n^0xffffffff)>>>0;}
function chunk(type:string,bytes:Buffer):Buffer{const h=Buffer.alloc(8),t=Buffer.from(type),tail=Buffer.alloc(4);h.writeUInt32BE(bytes.length);t.copy(h,4);tail.writeUInt32BE(crc(Buffer.concat([t,bytes])));return Buffer.concat([h,bytes,tail]);}
export function pngFixtures(directory:string):PngFixture[]{
  fs.mkdirSync(directory,{recursive:true});
  const header=Buffer.alloc(13);header.writeUInt32BE(2,0);header.writeUInt32BE(2,4);header[8]=8;header[9]=6;
  const rgba=[11,27,53,0,42,81,122,128,77,51,21,127,81,101,144,255],list:PngFixture[]=[];
  const save=(name:string,body:Buffer,valid:boolean):void=>{const dest=path.join(directory,name+'.png');fs.writeFileSync(dest,body);list.push(valid?{name,path:dest,valid,rgba}:{name,path:dest,valid});};
  for(let mode=0;mode<5;mode++){
    const filtered:number[]=[];
    for(let y=0;y<2;y++){
      filtered.push(mode);
      for(let x=0;x<8;x++){
        const at=y*8+x,a=x>=4?rgba[at-4]!:0,b=y?rgba[at-8]!:0,c=y&&x>=4?rgba[at-12]!:0;
        const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);
        const prediction=mode===0?0:mode===1?a:mode===2?b:mode===3?Math.floor((a+b)/2):pa<=pb&&pa<=pc?a:pb<=pc?b:c;
        filtered.push((rgba[at]!-prediction+256)%256);
      }
    }
    const image=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(Buffer.from(filtered))),chunk('IEND',Buffer.alloc(0))]);
    save('filter-'+mode,image,true);
    if(mode===0){const damaged=Buffer.from(image);damaged[29]=(damaged[29]??0)^1;save('bad-crc',damaged,false);save('truncated',image.subarray(0,image.length-5),false);}
  }
  return list;
}
