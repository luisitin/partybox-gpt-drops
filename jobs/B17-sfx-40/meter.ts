/** BS.1770-4 Annex 1/2, mono 48 kHz. No dual-mono compensation. */
export const RATE = 48000;
export interface Meter { lufs: number; truePeakDb: number; dc: number; samplePeak: number }
export function biquad(input: Float64Array, b: readonly number[], a: readonly number[]): Float64Array {
  const y = new Float64Array(input.length);
  let x1=0,x2=0,y1=0,y2=0;
  for(let i=0;i<input.length;i++) {
    const x=input[i]!;
    const v=b[0]!*x+b[1]!*x1+b[2]!*x2-a[1]!*y1-a[2]!*y2;
    y[i]=v; x2=x1; x1=x; y2=y1; y1=v;
  }
  return y;
}
export function kWeight(samples: Float64Array): Float64Array {
  const shelf=biquad(samples,[1.53512485958697,-2.69169618940638,1.19839281085285],[1,-1.69065929318241,0.73248077421585]);
  return biquad(shelf,[1,-2,1],[1,-1.99004745483398,0.99007225036621]);
}
export function integrated(samples: Float64Array, rate=RATE): number {
  if(rate!==RATE) throw new RangeError('Only 48 kHz is supported');
  const block=Math.round(rate*0.4), hop=Math.round(rate*0.1);
  const padded=new Float64Array(Math.max(samples.length,block)); padded.set(samples);
  const weighted=kWeight(padded), sums=new Float64Array(weighted.length+1);
  for(let i=0;i<weighted.length;i++) sums[i+1]=sums[i]!+weighted[i]!**2;
  const powers:number[]=[];
  for(let start=0;start+block<=weighted.length;start+=hop) {
    const power=(sums[start+block]!-sums[start]!)/block;
    if(-0.691+10*Math.log10(power)>-70) powers.push(power);
  }
  if(!powers.length) return -Infinity;
  const average=powers.reduce((a,b)=>a+b,0)/powers.length;
  const threshold=average*0.1;
  const gated=powers.filter(p=>p>threshold);
  return -0.691+10*Math.log10(gated.reduce((a,b)=>a+b,0)/gated.length);
}
/** Annex 2 Table 1, columns are the four interpolation phases. */
const FIR: readonly (readonly number[])[] = [
 [0.001708984375,0.010986328125,-0.0196533203125,0.033203125,-0.0594482421875,0.1373291015625,0.97216796875,-0.102294921875,0.047607421875,-0.026611328125,0.014892578125,-0.00830078125],
 [-0.0291748046875,0.029296875,-0.0517578125,0.089111328125,-0.16650390625,0.465087890625,0.77978515625,-0.2003173828125,0.1015625,-0.0582275390625,0.0330810546875,-0.0189208984375],
 [-0.0189208984375,0.0330810546875,-0.0582275390625,0.1015625,-0.2003173828125,0.77978515625,0.465087890625,-0.16650390625,0.089111328125,-0.0517578125,0.029296875,-0.0291748046875],
 [-0.00830078125,0.014892578125,-0.026611328125,0.047607421875,-0.102294921875,0.97216796875,0.1373291015625,-0.0594482421875,0.033203125,-0.0196533203125,0.010986328125,0.001708984375]
];
export function truePeak(samples: Float64Array): number {
  let peak=0;
  for(let i=0;i<samples.length+11;i++) for(const phase of FIR) {
    let value=0;
    for(let j=0;j<12;j++) { const at=i-j; if(at>=0 && at<samples.length) value+=samples[at]!*phase[j]!; }
    peak=Math.max(peak,Math.abs(value));
  }
  return 20*Math.log10(peak);
}
export function meter(samples: Float64Array, rate=RATE): Meter {
  let sum=0, samplePeak=0;
  for(const x of samples) { if(!Number.isFinite(x)) throw new RangeError('Non-finite sample'); sum+=x; samplePeak=Math.max(samplePeak,Math.abs(x)); }
  if(!samples.length) throw new RangeError('Empty audio');
  return {lufs:integrated(samples,rate),truePeakDb:truePeak(samples),dc:sum/samples.length,samplePeak};
}
export function fadeGain(i:number, length:number, fadeSamples=240): number {
  const distance=Math.min(i,length-1-i);
  return distance>=fadeSamples?1:0.5-0.5*Math.cos(Math.PI*Math.max(0,distance)/fadeSamples);
}
export function finishAudio(raw:Float64Array, target=-16):Float64Array {
  if(raw.length<RATE*0.05 || raw.length>RATE*3) throw new RangeError('Duration outside delivery range');
  const faded=new Float64Array(raw.length);
  // Remove DC through a correction basis that preserves the exact fade envelope.
  let sum=0, weight=0;
  for(let i=0;i<raw.length;i++) { const f=fadeGain(i,raw.length); faded[i]=raw[i]!*f; sum+=faded[i]!; weight+=f; }
  const correction=sum/weight;
  for(let i=0;i<raw.length;i++) faded[i]=faded[i]!-correction*fadeGain(i,raw.length);
  const measured=integrated(faded);
  if(!Number.isFinite(measured)) throw new RangeError('Silent raw signal');
  const gain=10**((target-measured)/20);
  for(let i=0;i<faded.length;i++) faded[i]=faded[i]!*gain;
  if(truePeak(faded)>-1.55) throw new RangeError('Crest factor cannot meet loudness and peak simultaneously');
  return faded;
}
