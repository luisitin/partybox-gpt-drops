export interface SvgCase { readonly name: string; readonly svg: string; readonly valid: boolean; }
export interface MaskCase { readonly name: string; readonly a: readonly number[]; readonly b: readonly number[]; readonly expected?: readonly [number,number]; }
export type Rng = () => number;
export function seeded(seed: number): Rng { let state=seed>>>0 || 1; return () => { state^=state<<13;state^=state>>>17;state^=state<<5;return (state>>>0)/4294967296; }; }
export const head='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="#fff4d9" stroke="#20243a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">';
export const wrap=(body: string): string=>head+body+'</svg>';
const disk='<circle cx="32" cy="32" r="20"/>';
export function svgCases(rng: Rng): SvgCase[] {
  const base=wrap(disk), cases: SvgCase[]=[];
  const add=(name:string,svg:string,valid:boolean):void=>{cases.push({name,svg,valid});};
  add('base-circle',base,true);
  add('all-supported-elements',wrap('<g transform="rotate(5 32 32)"><rect x="2" y="3" width="8" height="9" rx="0" fill="none"/><ellipse cx="20" cy="21" rx="8" ry="6"/><path d="M4 4L8 8H12V20Q15 26 20 22C21 20 24 23 25 28Z" fill-rule="evenodd"/></g>'),true);
  add('relative-command-rejected',wrap('<path d="M1 1l2 2"/>'),false);
  add('negative-coordinate-valid',wrap('<circle cx="-1" cy="2" r="5"/>'),true);
  add('scientific-notation-valid',wrap('<circle cx="1e1" cy="2e1" r="3e0"/>'),true);
  add('negative-zero-coordinate',wrap('<circle cx="-0" cy="0" r=".5"/>'),true);
  add('repeated-path-arguments',wrap('<path d="M1 1 2 2L3 3 4 4Z"/>'),true);
  add('empty-path',wrap('<path d=""/>'),false);
  add('missing-path',wrap('<path/>'),false);
  add('path-missing-coordinate',wrap('<path d="M1 1L3"/>'),false);
  add('path-unknown-command',wrap('<path d="M1 1R2 2"/>'),false);
  add('path-no-move',wrap('<path d="L1 1"/>'),false);
  add('path-number-after-close',wrap('<path d="M1 1Z2"/>'),false);
  add('path-nonfinite',wrap('<path d="M1e999 1"/>'),false);
  const colors=['#123456','#234567','#345678','#456789','#56789a'];
  add('six-colors',wrap(colors.slice(0,4).map(fill=>'<circle cx="32" cy="32" r="3" fill="'+fill+'"/>').join('')),true);
  add('seven-colors',wrap(colors.map(fill=>'<circle cx="32" cy="32" r="3" fill="'+fill+'"/>').join('')),false);
  add('stroke-colors-count',wrap(colors.map(stroke=>'<circle cx="32" cy="32" r="3" fill="none" stroke="'+stroke+'"/>').join('')),false);
  add('case-fold-colors',base.replace('/>',' fill="#FFF4D9"/>'),true);
  const pathBase=wrap('<path d="M1 1"/>');
  for (const bytes of [1499,1500,1501,1502]) add('bytes-'+bytes,pathBase.replace('M1 1','M1 1.'+'0'.repeat(bytes-pathBase.length-1)),bytes<=1500);
  add('utf8-not-ascii',wrap('<text>🎲</text>'),false);
  add('no-namespace',base.replace(' xmlns="http://www.w3.org/2000/svg"',''),false);
  add('wrong-namespace',base.replace('2000/svg','2000/bogus'),false);
  add('prefix-namespace',base.replace('<svg ','<svg xmlns:x="urn:x" '),false);
  add('wrong-viewbox',base.replace('0 0 64 64','0 0 65 64'),false);
  add('missing-viewbox',base.replace(' viewBox="0 0 64 64"',''),false);
  add('wrong-root-stroke',base.replace('stroke-width="4"','stroke-width="3"'),false);
  add('nonround-cap',base.replace('stroke-linecap="round"','stroke-linecap="butt"'),false);
  add('nonround-join',base.replace('stroke-linejoin="round"','stroke-linejoin="miter"'),false);
  add('two-roots',base+base,false);
  add('empty-svg',wrap(''),false);
  add('wrong-root',base.replace('<svg ','<g ').replace('</svg>','</g>'),false);
  add('nested-svg',wrap(base),false);
  add('missing-close',base.replace('</svg>',''),false);
  add('mismatched-close',wrap('<g transform="rotate(0 32 32)">'+disk+'</path>'),false);
  add('duplicate-attribute',base.replace('cx="32"','cx="32" cx="20"'),false);
  add('single-quoted',base.replace('cx="32"',"cx='32'"),false);
  add('spaces-around-equals',base.replace('cx="32"','cx = "32"'),false);
  add('zero-circle-radius',base.replace('r="20"','r="0"'),false);
  add('negative-circle-radius',base.replace('r="20"','r="-2"'),false);
  add('missing-circle-center',base.replace(' cx="32"',''),false);
  add('nonfinite-coordinate',base.replace('cx="32"','cx="1e999"'),false);
  add('nan-coordinate',base.replace('cx="32"','cx="NaN"'),false);
  add('zero-ellipse-rx',wrap('<ellipse cx="32" cy="32" rx="0" ry="8"/>'),false);
  add('zero-ellipse-ry',wrap('<ellipse cx="32" cy="32" rx="8" ry="0"/>'),false);
  add('zero-rect-width',wrap('<rect x="1" y="1" width="0" height="8"/>'),false);
  add('zero-rect-height',wrap('<rect x="1" y="1" width="8" height="0"/>'),false);
  add('negative-rect-rx',wrap('<rect x="1" y="1" width="8" height="8" rx="-1"/>'),false);
  add('missing-shape-dimension',wrap('<rect x="1" y="1" width="8"/>'),false);
  add('zero-stroke',base.replace('/>',' stroke-width="0"/>'),false);
  add('nonfinite-stroke',base.replace('/>',' stroke-width="1e999"/>'),false);
  add('named-paint',base.replace('/>',' fill="red"/>'),false);
  add('external-paint',base.replace('/>',' fill="url(https://example.invalid/a)"/>'),false);
  add('bad-fill-rule',base.replace('/>',' fill-rule="bogus"/>'),false);
  add('inline-handler',base.replace('/>',' onload="alert(1)"/>'),false);
  add('inline-style',base.replace('/>',' style="fill:red"/>'),false);
  add('script-element',wrap(disk+'<script/>'),false);
  add('text-element',wrap(disk+'<text/>'),false);
  add('foreign-object',wrap(disk+'<foreignObject/>'),false);
  add('embedded-image',wrap(disk+'<image href="data:image/png;base64,AA=="/>'),false);
  add('animation',wrap(disk+'<animate/>'),false);
  add('entity',base.replace('cx="32"','cx="&#51;2"'),false);
  add('doctype','<!DOCTYPE svg>'+base,false);
  add('comment',base.replace('</svg>','<!--x--></svg>'),false);
  add('xml-prolog','<?xml version="1.0"?>'+base,false);
  add('text-node',base.replace('</svg>','hello</svg>'),false);
  add('trailing-text',base+'x',false);
  add('leading-space',' '+base,false);
  add('intertag-space',base.replace('><circle','> <circle'),false);
  add('newline',base.replace('><circle','>\n<circle'),false);
  add('rotation-missing-arg',wrap('<g transform="rotate(32 32)">'+disk+'</g>'),false);
  add('rotation-invalid',wrap('<g transform="rotate(x 32 32)">'+disk+'</g>'),false);
  add('unsupported-transform',wrap('<g transform="translate(2 2)">'+disk+'</g>'),false);
  add('children-in-leaf',wrap('<circle cx="32" cy="32" r="20">'+disk+'</circle>'),false);
  // A thousand generated geometry cases; the truth label follows construction, not an auditor.
  for(let i=0;i<1000;i++){
    const x=Math.floor(rng()*64),y=Math.floor(rng()*64),radius=1+Math.floor(rng()*30);
    const valid=i%2===0;
    const svg=wrap('<circle cx="'+x+'" cy="'+y+'" r="'+(valid?radius:0)+'"/>');
    add('generated-'+i,svg,valid);
  }
  return cases;
}
function rgba(alphas: readonly number[]): number[] {return alphas.flatMap(a=>[23,71,119,a]);}
export function maskCases(rng:Rng):MaskCase[]{
  const out:MaskCase[]=[
    {name:'empty',a:[],b:[],expected:[0,0]},
    {name:'alpha-128-inclusive',a:rgba([127,128,129]),b:rgba([128,128,127]),expected:[1,3]},
    {name:'disjoint',a:rgba([255,0]),b:rgba([0,255]),expected:[0,2]},
    {name:'identical-bit-zero',a:rgba([255]),b:rgba([255]),expected:[1,1]},
    {name:'eighty-percent',a:rgba([255,255,255,255,0]),b:rgba([255,255,255,255,255]),expected:[4,5]}
  ];
  const levels=[0,1,126,127,128,129,254,255];
  for(let i=0;i<512;i++){
    const n=i<100?i:Math.floor(rng()*513),a:number[]=[],b:number[]=[];
    for(let j=0;j<n;j++){a.push(levels[Math.floor(rng()*levels.length)]!);b.push(levels[Math.floor(rng()*levels.length)]!);}
    out.push({name:'mask-'+i,a:rgba(a),b:rgba(b)});
  }
  return out;
}
