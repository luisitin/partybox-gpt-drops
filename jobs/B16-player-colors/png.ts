/** Pure PNG helper shared from B17; color math is independently authored. */
export function crc32(bytes:Uint8Array):number {
  let crc=0xffffffff;
  for(const b of bytes){crc^=b;for(let i=0;i<8;i++) crc=(crc>>>1)^((crc&1)?0xedb88320:0);}
  return (crc^0xffffffff)>>>0;
}
function u32(n:number):Uint8Array{return new Uint8Array([n>>>24,(n>>>16)&255,(n>>>8)&255,n&255]);}
function concat(parts:readonly Uint8Array[]):Uint8Array {const out=new Uint8Array(parts.reduce((n,p)=>n+p.length,0));let at=0;for(const p of parts){out.set(p,at);at+=p.length;}return out;}
function chunk(name:string,data:Uint8Array):Uint8Array {
  const type=new Uint8Array([...name].map(c=>c.charCodeAt(0))),body=concat([type,data]);
  return concat([u32(data.length),body,u32(crc32(body))]);
}
function encodePngBytes(width:number,height:number,rgb:Uint8Array,depth:8|16):Uint8Array {
  const stride=width*3*(depth/8);
  if(width<=0||height<=0||!Number.isInteger(width)||!Number.isInteger(height)||rgb.length!==stride*height)throw new RangeError('Invalid raster');
  const raster=new Uint8Array(height*(stride+1));
  for(let y=0;y<height;y++)raster.set(rgb.subarray(y*stride,(y+1)*stride),y*(stride+1)+1);
  const blocks:Uint8Array[]=[new Uint8Array([0x78,0x01])];
  for(let start=0;start<raster.length;start+=65535){const n=Math.min(65535,raster.length-start);blocks.push(new Uint8Array([start+n===raster.length?1:0,n&255,n>>>8,(~n)&255,((~n)>>>8)&255]),raster.subarray(start,start+n));}
  let a=1,b=0;for(const x of raster){a=(a+x)%65521;b=(b+a)%65521;}blocks.push(u32((b<<16)|a));
  const ihdr=concat([u32(width),u32(height),new Uint8Array([depth,2,0,0,0])]);
  return concat([new Uint8Array([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',concat(blocks)),chunk('IEND',new Uint8Array())]);
}

export function encodePng(width:number,height:number,rgb:Uint8Array):Uint8Array {return encodePngBytes(width,height,rgb,8);}
export function encodePng16(width:number,height:number,rgb:Uint16Array):Uint8Array {
 const bytes=new Uint8Array(rgb.length*2);for(let i=0;i<rgb.length;i++){bytes[i*2]=rgb[i]!>>>8;bytes[i*2+1]=rgb[i]!&255;}
 return encodePngBytes(width,height,bytes,16);
}
