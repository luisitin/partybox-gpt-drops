/** Pure radix-2 FFT and minimal PNG encoder (stored zlib/deflate blocks). */
export function fft(real:Float64Array, imaginary=new Float64Array(real.length)):void {
  const n=real.length;
  if(n<2||(n&(n-1))!==0||imaginary.length!==n) throw new RangeError('FFT requires equal power-of-two arrays');
  for(let i=1,j=0;i<n;i++) { let bit=n>>1; for(;j&bit;bit>>=1) j^=bit; j^=bit; if(i<j){[real[i],real[j]]=[real[j]!,real[i]!];[imaginary[i],imaginary[j]]=[imaginary[j]!,imaginary[i]!];} }
  for(let size=2;size<=n;size*=2) {
    const angle=-2*Math.PI/size;
    for(let start=0;start<n;start+=size) for(let k=0;k<size/2;k++) {
      const a=start+k,b=a+size/2,c=Math.cos(angle*k),s=Math.sin(angle*k);
      const tr=c*real[b]!-s*imaginary[b]!,ti=s*real[b]!+c*imaginary[b]!;
      const ar=real[a]!,ai=imaginary[a]!;
      real[a]=ar+tr;imaginary[a]=ai+ti;real[b]=ar-tr;imaginary[b]=ai-ti;
    }
  }
}
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
export function encodePng(width:number,height:number,rgb:Uint8Array):Uint8Array {
  if(width<=0||height<=0||!Number.isInteger(width)||!Number.isInteger(height)||rgb.length!==width*height*3)throw new RangeError('Invalid raster');
  const raster=new Uint8Array(height*(width*3+1));
  for(let y=0;y<height;y++)raster.set(rgb.subarray(y*width*3,(y+1)*width*3),y*(width*3+1)+1);
  const blocks:Uint8Array[]=[new Uint8Array([0x78,0x01])];
  for(let start=0;start<raster.length;start+=65535){const n=Math.min(65535,raster.length-start);blocks.push(new Uint8Array([start+n===raster.length?1:0,n&255,n>>>8,(~n)&255,((~n)>>>8)&255]),raster.subarray(start,start+n));}
  let a=1,b=0;for(const x of raster){a=(a+x)%65521;b=(b+a)%65521;}blocks.push(u32((b<<16)|a));
  const ihdr=concat([u32(width),u32(height),new Uint8Array([8,2,0,0,0])]);
  return concat([new Uint8Array([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',concat(blocks)),chunk('IEND',new Uint8Array())]);
}
export function spectrogram(samples:Float64Array,width=256,height=128):Uint8Array {
  const n=1024,pixels=new Uint8Array(width*height*3);
  for(let x=0;x<width;x++) {
    const start=Math.round(x*(samples.length-n)/Math.max(1,width-1)),real=new Float64Array(n),imag=new Float64Array(n);
    for(let j=0;j<n;j++)real[j]=(samples[start+j]??0)*(.5-.5*Math.cos(2*Math.PI*j/(n-1)));
    fft(real,imag);
    for(let y=0;y<height;y++) {
      // Log frequency axis, 47 Hz (one bin) to 24 kHz; 70 dB magnitude window.
      const bin=Math.min(n/2,Math.max(1,Math.round(Math.pow(n/2,(height-1-y)/Math.max(1,height-1)))));
      const db=20*Math.log10(Math.hypot(real[bin]!,imag[bin]!)/(n/2)+1e-12);
      const v=Math.min(1,Math.max(0,(db+70)/70)),at=(y*width+x)*3;
      pixels[at]=Math.round(18+237*Math.min(1,v*1.5));
      pixels[at+1]=Math.round(15+225*Math.max(0,(v-.25)/.75));
      pixels[at+2]=Math.round(38+145*Math.sin(Math.PI*v));
    }
  }
  return encodePng(width,height,pixels);
}
