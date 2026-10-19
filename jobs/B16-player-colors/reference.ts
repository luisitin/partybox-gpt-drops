/** Independent standard-formula implementation; no production imports. */
export type RGB = readonly [number,number,number];
export type Lab = readonly [number,number,number];
export type Mode = 'normal'|'protan'|'deutan'|'tritan';
const toLinear = (x:number):number => x<=.04045 ? x/12.92 : ((x+.055)/1.055)**2.4;
const toEncoded = (x:number):number => x<=.0031308 ? 12.92*x : 1.055*x**(1/2.4)-.055;
const degrees = (x:number):number => x*180/Math.PI;
const radians = (x:number):number => x*Math.PI/180;
const cos = (x:number):number => Math.cos(radians(x));
const sin = (x:number):number => Math.sin(radians(x));
function hue(a:number,b:number):number {const angle=degrees(Math.atan2(b,a));return angle<0?angle+360:angle;}
export function referenceFromHex(value:string):RGB {
  if(!/^#[0-9a-f]{6}$/i.test(value))throw new RangeError('Six-digit sRGB hex required');
  return [1,3,5].map(offset=>parseInt(value.slice(offset,offset+2),16)/255) as unknown as RGB;
}
export function referenceLuminance(rgb:RGB):number {
  return .2126*toLinear(rgb[0])+.7152*toLinear(rgb[1])+.0722*toLinear(rgb[2]);
}
export function referenceContrast(a:RGB,b:RGB):number {
  const first=referenceLuminance(a),second=referenceLuminance(b);
  return (Math.max(first,second)+.05)/(Math.min(first,second)+.05);
}
export function referenceLab(rgb:RGB):Lab {
  const r=toLinear(rgb[0]),g=toLinear(rgb[1]),b=toLinear(rgb[2]);
  const xyz=[(.4124564*r+.3575761*g+.1804375*b)/.95047,
    .2126729*r+.7151522*g+.0721750*b,
    (.0193339*r+.1191920*g+.9503041*b)/1.08883];
  const transformed=xyz.map(value=>value>(6/29)**3?Math.cbrt(value):value/(3*(6/29)**2)+4/29);
  return [116*transformed[1]!-16,500*(transformed[0]!-transformed[1]!),200*(transformed[1]!-transformed[2]!)];
}
export function referenceSimulate(rgb:RGB,mode:Mode):RGB {
  if(mode==='normal')return [...rgb];
  const matrices:Record<Exclude<Mode,'normal'>,readonly RGB[]>={
    protan:[[.152286,1.052583,-.204868],[.114503,.786281,.099216],[-.003882,-.048116,1.051998]],
    deutan:[[.367322,.860646,-.227968],[.280085,.672501,.047413],[-.011820,.042940,.968881]],
    tritan:[[1.255528,-.076749,-.178779],[-.078411,.930809,.147602],[.004733,.691367,.303900]]
  };
  const linear=rgb.map(toLinear);
  const answer=matrices[mode].map(row=>toEncoded(Math.max(0,Math.min(1,row.reduce((sum,x,i)=>sum+x*linear[i]!,0)))));
  return [answer[0]!,answer[1]!,answer[2]!];
}
export function referenceDeltaE(first:Lab,second:Lab):number {
  const cFirst=Math.hypot(first[1],first[2]),cSecond=Math.hypot(second[1],second[2]);
  const uncorrectedMean=(cFirst+cSecond)/2;
  const adjustment=(1-Math.sqrt(uncorrectedMean**7/(uncorrectedMean**7+25**7)))/2;
  const aFirst=first[1]*(1+adjustment),aSecond=second[1]*(1+adjustment);
  const c1=Math.hypot(aFirst,first[2]),c2=Math.hypot(aSecond,second[2]);
  const h1=c1===0?0:hue(aFirst,first[2]),h2=c2===0?0:hue(aSecond,second[2]);
  let difference=h2-h1;
  if(c1*c2===0)difference=0;
  else if(difference>180)difference-=360;
  else if(difference< -180)difference+=360;
  const deltaH=2*Math.sqrt(c1*c2)*sin(difference/2);
  let meanHue=h1+h2;
  if(c1*c2!==0){
    if(Math.abs(h1-h2)>180)meanHue+=meanHue<360?360:-360;
    meanHue/=2;
  }
  const meanLight=(first[0]+second[0])/2,meanChroma=(c1+c2)/2;
  const t=1-.17*cos(meanHue-30)+.24*cos(2*meanHue)+.32*cos(3*meanHue+6)-.20*cos(4*meanHue-63);
  const normalizedLight=(second[0]-first[0])/(1+.015*(meanLight-50)**2/Math.sqrt(20+(meanLight-50)**2));
  const normalizedChroma=(c2-c1)/(1+.045*meanChroma);
  const normalizedHue=deltaH/(1+.015*meanChroma*t);
  const rotation=-2*Math.sqrt(meanChroma**7/(meanChroma**7+25**7))*sin(60*Math.exp(-(((meanHue-275)/25)**2)));
  return Math.sqrt(Math.max(0,normalizedLight**2+normalizedChroma**2+normalizedHue**2+rotation*normalizedChroma*normalizedHue));
}
