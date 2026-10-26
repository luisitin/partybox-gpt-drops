/** Builds gallery.html: one self-contained page (inline sprite, no network) to browse the set on all five PartyBox themes. */
export interface GalleryEntry { readonly id:string; readonly title:string; readonly titleEs:string; readonly category:string; }
const esc=(s:string):string=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const categoryEs:Readonly<Record<string,string>>={'Party essentials':'Imprescindibles de fiesta','Navigation and actions':'Navegación y acciones','Tabletop and competition':'Mesa y competencia','People and communication':'Personas y comunicación','Game objects and effects':'Objetos y efectos','System and celebration':'Sistema y celebración'};
// Theme colours copied from PartyBox packages/client/src/styles/tokens.css; --pb-icon-ink is the proposed icon token.
const themes:Readonly<Record<string,string>>={
  night:'--pb-bg:#0f1020;--pb-surface:#1c1e3a;--pb-surface-2:#272a52;--pb-text:#f5f6ff;--pb-text-muted:#b3b7d9;--pb-accent:#ff5d8f;--pb-accent-2:#ffd166;--pb-on-accent:#1a0b12;--pb-icon-ink:#20243a;color-scheme:dark',
  daylight:'--pb-bg:#f6f5ff;--pb-surface:#ffffff;--pb-surface-2:#e9e7fb;--pb-text:#171633;--pb-text-muted:#4a4c6e;--pb-accent:#c2185b;--pb-accent-2:#7a4b00;--pb-on-accent:#ffffff;--pb-icon-ink:#20243a;color-scheme:light',
  arcade:'--pb-bg:#050014;--pb-surface:#14002e;--pb-surface-2:#23064a;--pb-text:#f0f6ff;--pb-text-muted:#a8b3d6;--pb-accent:#ff2bd6;--pb-accent-2:#00f0ff;--pb-on-accent:#050014;--pb-icon-ink:#20243a;color-scheme:dark',
  cabin:'--pb-bg:#1d1410;--pb-surface:#2c211b;--pb-surface-2:#3d2e26;--pb-text:#fbf3e8;--pb-text-muted:#cbb8a6;--pb-accent:#ee8050;--pb-accent-2:#f2c14e;--pb-on-accent:#1d1410;--pb-icon-ink:#20243a;color-scheme:dark',
  contrast:'--pb-bg:#000000;--pb-surface:#111111;--pb-surface-2:#242424;--pb-text:#ffffff;--pb-text-muted:#e6e6e6;--pb-accent:#ff4fa3;--pb-accent-2:#ffff00;--pb-on-accent:#000000;--pb-icon-ink:#000000;color-scheme:dark'};
const css=`:root{${themes.night};--pb-radius:12px;--pb-radius-lg:24px;--pb-fast:150ms;--pb-base:300ms;--pb-ease:cubic-bezier(0.2,0.8,0.2,1);--pb-font:'Nunito Variable','Segoe UI Variable Display','Segoe UI',system-ui,-apple-system,Roboto,sans-serif;--pb-mono:ui-monospace,'Cascadia Mono',Consolas,Menlo,monospace;--icon:48px}
${Object.entries(themes).map(([name,value])=>`:root[data-theme="${name}"]{${value}}`).join('\n')}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;background:var(--pb-bg);color:var(--pb-text);font:400 1.125rem/1.4 var(--pb-font);transition:background-color var(--pb-base) var(--pb-ease),color var(--pb-base) var(--pb-ease)}
header{position:sticky;top:0;z-index:2;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 24px;padding:16px 24px;background:var(--pb-bg);box-shadow:0 12px 24px -20px #000}
.mark{display:flex;align-items:center;gap:12px;margin:0;font-size:1.375rem;font-weight:800;letter-spacing:-.01em}
.mark svg{width:40px;height:40px;color:var(--pb-icon-ink)}
.mark span{color:var(--pb-text-muted);font-weight:700}
.status{margin:0;color:var(--pb-text-muted);font-size:.875rem;font-weight:600}
.controls{display:flex;flex-wrap:wrap;align-items:center;gap:12px;width:100%}
.seg{display:inline-flex;flex-wrap:wrap;gap:4px;padding:4px;border-radius:999px;background:var(--pb-surface)}
.seg button{min-width:44px;min-height:44px;padding:0 16px;border:0;border-radius:999px;background:transparent;color:var(--pb-text-muted);font:700 1rem var(--pb-font);cursor:pointer;transition:background-color var(--pb-fast) var(--pb-ease),color var(--pb-fast) var(--pb-ease),transform var(--pb-fast) var(--pb-ease)}
.seg button[aria-pressed="true"]{background:var(--pb-accent);color:var(--pb-on-accent)}
.seg button:active{transform:scale(.95)}
.seg button:focus-visible,.tile:focus-visible,input:focus-visible,dialog button:focus-visible{outline:3px solid var(--pb-accent-2);outline-offset:2px}
input[type="search"]{flex:1 1 200px;max-width:360px;min-height:44px;padding:0 18px;border:2px solid var(--pb-surface-2);border-radius:999px;background:var(--pb-surface);color:var(--pb-text);font:600 1rem var(--pb-font)}
main{max-width:1600px;margin:0 auto;padding:8px 24px 64px}
h2{margin:32px 0 12px;color:var(--pb-text-muted);font-size:.875rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(calc(var(--icon) + 64px),1fr));gap:12px}
.tile{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:8px;min-height:44px;padding:16px 8px 12px;border:0;border-radius:var(--pb-radius);background:var(--pb-surface);color:var(--pb-text);font:700 .875rem/1.2 var(--pb-font);text-align:center;cursor:pointer;box-shadow:0 10px 20px -16px #000;transition:transform var(--pb-fast) var(--pb-ease),background-color var(--pb-fast) var(--pb-ease),box-shadow var(--pb-fast) var(--pb-ease)}
.tile:hover{transform:translateY(-3px);background:var(--pb-surface-2);box-shadow:0 16px 28px -18px #000}
.tile svg{width:var(--icon);height:var(--icon);color:var(--pb-icon-ink);transition:width var(--pb-base) var(--pb-ease),height var(--pb-base) var(--pb-ease)}
.tile code{color:var(--pb-text-muted);font:500 .75rem var(--pb-mono)}
.tile[hidden],section[hidden]{display:none}
.empty{padding:48px 0;color:var(--pb-text-muted);text-align:center}
dialog{width:min(560px,calc(100vw - 32px));padding:0;border:0;border-radius:var(--pb-radius-lg);background:var(--pb-surface);color:var(--pb-text);box-shadow:0 30px 80px -20px #000}
dialog::backdrop{background:rgba(5,6,16,.6)}
dialog[open]{animation:pop var(--pb-base) var(--pb-ease)}
@keyframes pop{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}
.detail{display:grid;gap:16px;padding:24px}
.detail-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.detail h3{margin:0;font-size:1.75rem;line-height:1.1}
.detail p{margin:4px 0 0;color:var(--pb-text-muted)}
.close{flex:none;width:44px;height:44px;padding:8px;border:0;border-radius:999px;background:var(--pb-surface-2);cursor:pointer}
.close svg{width:28px;height:28px;color:var(--pb-icon-ink)}
.stages{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px}
.stage{display:grid;place-items:center;gap:8px;padding:16px 8px;border-radius:var(--pb-radius);font:700 .75rem var(--pb-font)}
.stage svg{width:96px;height:96px}
.stage.night{background:#0f1020;color:#b3b7d9}
.stage.day{background:#f6f5ff;color:#4a4c6e}
.stage.small{grid-template-columns:auto auto;align-items:end;justify-content:center}
.stage.small svg:first-child{width:24px;height:24px}
.stage.small svg:nth-child(2){width:48px;height:48px}
.stage.small span{grid-column:1/-1}
pre{margin:0;padding:12px 16px;overflow-x:auto;border-radius:var(--pb-radius);background:var(--pb-bg);font:500 .8125rem/1.5 var(--pb-mono);white-space:pre-wrap;word-break:break-all}
footer{padding:24px;color:var(--pb-text-muted);font-size:.875rem;text-align:center}
@media (max-width:600px){header{position:static}header,main{padding-left:16px;padding-right:16px}.mark{font-size:1.25rem}.seg{flex-wrap:nowrap;max-width:100%;overflow-x:auto;scrollbar-width:none}.seg button{flex:none;padding:0 12px}.grid{grid-template-columns:repeat(auto-fill,minmax(calc(var(--icon) + 44px),1fr));gap:8px}.tile{padding:12px 4px 10px}}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{transition:none!important;animation:none!important}}`;
const script=`(function(){
var root=document.documentElement,q=document.getElementById('q'),status=document.getElementById('status'),empty=document.getElementById('empty');
var tiles=[].slice.call(document.querySelectorAll('.tile')),sections=[].slice.call(document.querySelectorAll('section'));
var state={theme:'night',size:'48',lang:'en'};
try{var saved=JSON.parse(localStorage.getItem('pb-icons')||'{}');for(var k in state)if(typeof saved[k]==='string')state[k]=saved[k];}catch(e){}
function label(el,lang){return el.getAttribute(lang==='es'?'data-es':'data-en');}
function apply(){
  root.setAttribute('data-theme',state.theme);root.style.setProperty('--icon',state.size+'px');root.lang=state.lang;
  document.querySelectorAll('[data-set]').forEach(function(b){b.setAttribute('aria-pressed',String(state[b.getAttribute('data-set')]===b.value));});
  tiles.forEach(function(t){t.querySelector('span').textContent=label(t,state.lang);});
  sections.forEach(function(s){s.querySelector('h2').textContent=label(s,state.lang);});
  filter();
  try{localStorage.setItem('pb-icons',JSON.stringify(state));}catch(e){}
}
function filter(){
  var term=q.value.trim().toLowerCase(),shown=0;
  tiles.forEach(function(t){var hit=!term||(t.value+' '+t.getAttribute('data-en')+' '+t.getAttribute('data-es')).toLowerCase().indexOf(term)>=0;t.hidden=!hit;if(hit)shown++;});
  sections.forEach(function(s){s.hidden=!s.querySelector('.tile:not([hidden])');});
  status.textContent=(term?shown+' / ':'')+'120 '+(state.lang==='es'?'iconos':'icons')+' \\u00b7 64 \\u00d7 64 \\u00b7 6 '+(state.lang==='es'?'colores':'colours');
  empty.hidden=shown>0;
}
document.querySelectorAll('[data-set]').forEach(function(b){b.addEventListener('click',function(){state[b.getAttribute('data-set')]=b.value;apply();});});
q.addEventListener('input',filter);
var dialog=document.getElementById('detail');
tiles.forEach(function(t){t.addEventListener('click',function(){
  var id=t.value,use='<use href="#pb-icon-'+id+'"/>';
  dialog.querySelector('h3').textContent=label(t,state.lang);
  dialog.querySelector('p').textContent=id+' \\u00b7 '+label(t,state.lang==='es'?'en':'es');
  dialog.querySelectorAll('.stage svg').forEach(function(s){s.innerHTML=use;});
  dialog.querySelector('pre').textContent='<svg class="pb-icon" style="color: var(--pb-icon-ink)" aria-hidden="true">\\n  <use href="#pb-icon-'+id+'"/>\\n</svg>';
  if(dialog.showModal)dialog.showModal();
});});
dialog.querySelector('.close').addEventListener('click',function(){dialog.close();});
dialog.addEventListener('click',function(e){if(e.target===dialog)dialog.close();});
apply();
})();`;
export function buildGallery(entries:readonly GalleryEntry[],sprite:string):string{
  const icon=(id:string):string=>'<svg aria-hidden="true"><use href="#pb-icon-'+id+'"/></svg>';
  const categories=[...new Set(entries.map(e=>e.category))];
  const sections=categories.map(category=>'<section data-en="'+esc(category)+'" data-es="'+esc(categoryEs[category]??category)+'"><h2>'+esc(category)+'</h2><div class="grid">'+
    entries.filter(e=>e.category===category).map(e=>'<button class="tile" type="button" value="'+esc(e.id)+'" data-en="'+esc(e.title)+'" data-es="'+esc(e.titleEs)+'">'+icon(e.id)+'<span>'+esc(e.title)+'</span><code>'+esc(e.id)+'</code></button>').join('')+'</div></section>').join('\n');
  const seg=(key:string,label:string,values:readonly [string,string][]):string=>'<div class="seg" role="group" aria-label="'+label+'">'+values.map(([value,text])=>'<button type="button" data-set="'+key+'" value="'+value+'" aria-pressed="false">'+text+'</button>').join('')+'</div>';
  return '<!doctype html>\n<html lang="en" data-theme="night">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>PartyBox Icons</title>\n<style>\n'+css+'\n</style>\n</head>\n<body>\n'+sprite+'\n'+
    '<header><h1 class="mark">'+icon('confetti')+'PartyBox <span>/ Icons</span></h1><p class="status" id="status" aria-live="polite">120 icons</p>\n<div class="controls">'+
    seg('theme','Theme',[['night','Night'],['daylight','Daylight'],['arcade','Arcade'],['cabin','Cabin'],['contrast','Contrast']])+
    seg('size','Size',[['24','24'],['48','48'],['96','96']])+seg('lang','Labels',[['en','EN'],['es','ES']])+
    '<input id="q" type="search" placeholder="Search icons" aria-label="Search icons" autocomplete="off"></div></header>\n<main>\n'+sections+
    '\n<p class="empty" id="empty" hidden>No icon matches that search.</p>\n</main>\n<footer>B15 · '+entries.length+' original icons · outline ink follows <code>--pb-icon-ink</code> through currentColor</footer>\n'+
    '<dialog id="detail" aria-labelledby="detail-title"><div class="detail"><div class="detail-head"><div><h3 id="detail-title"></h3><p></p></div><button class="close" type="button" aria-label="Close">'+icon('close')+'</button></div>'+
    '<div class="stages"><div class="stage night"><svg aria-hidden="true" style="color:#20243a"></svg>Night</div><div class="stage day"><svg aria-hidden="true" style="color:#20243a"></svg>Daylight</div><div class="stage night small"><svg aria-hidden="true" style="color:#20243a"></svg><svg aria-hidden="true" style="color:#20243a"></svg><span>24 · 48 px</span></div></div><pre></pre></div></dialog>\n'+
    '<script>\n'+script+'\n</script>\n</body>\n</html>\n';
}
