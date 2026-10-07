import {RATE} from './meter.js';
export function encodeWav(samples:Float64Array):Uint8Array {
  const bytes=new Uint8Array(44+samples.length*2), view=new DataView(bytes.buffer);
  const tag=(at:number,text:string):void=>{ for(let i=0;i<text.length;i++) bytes[at+i]=text.charCodeAt(i); };
  tag(0,'RIFF'); view.setUint32(4,bytes.length-8,true); tag(8,'WAVE'); tag(12,'fmt ');
  view.setUint32(16,16,true); view.setUint16(20,1,true); view.setUint16(22,1,true);
  view.setUint32(24,RATE,true); view.setUint32(28,RATE*2,true); view.setUint16(32,2,true); view.setUint16(34,16,true);
  tag(36,'data'); view.setUint32(40,samples.length*2,true);
  for(let i=0;i<samples.length;i++) {
    const x=samples[i]!; if(!Number.isFinite(x)||Math.abs(x)>1) throw new RangeError('Invalid sample');
    view.setInt16(44+i*2,Math.max(-32768,Math.min(32767,Math.round(x*32768))),true);
  }
  return bytes;
}
export function decodeWav(bytes:Uint8Array):Float64Array {
  if(bytes.length<44) throw new RangeError('Truncated WAV');
  const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
  const tag=(at:number):string=>String.fromCharCode(...bytes.slice(at,at+4));
  if(tag(0)!=='RIFF'||tag(8)!=='WAVE'||tag(12)!=='fmt '||tag(36)!=='data') throw new RangeError('Unsupported WAV layout');
  if(view.getUint32(4,true)!==bytes.length-8||view.getUint32(16,true)!==16||view.getUint16(20,true)!==1||view.getUint16(22,true)!==1||view.getUint32(24,true)!==RATE||view.getUint32(28,true)!==RATE*2||view.getUint16(32,true)!==2||view.getUint16(34,true)!==16||view.getUint32(40,true)!==bytes.length-44||(bytes.length-44)%2!==0) throw new RangeError('Invalid WAV header');
  const out=new Float64Array((bytes.length-44)/2);
  for(let i=0;i<out.length;i++) out[i]=view.getInt16(44+2*i,true)/32768;
  return out;
}
