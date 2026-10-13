/** Independently authored primary B12 implementation. No external state or I/O. */
export const CARDS=['pink','white','blue','yellow','orange','black','red','green','locomotive'] as const;
export type Card=typeof CARDS[number];
export interface Route {readonly id:string;readonly a:string;readonly b:string;readonly length:number;readonly color:Exclude<Card,'locomotive'>|'gray';readonly parallelGroup?:string}
export interface Ticket {readonly id:string;readonly a:string;readonly b:string;readonly points:number}
export interface Player {readonly id:string;readonly cards:Readonly<Record<Card,number>>;readonly trainsRemaining:number;readonly ticketIds:readonly string[]}
export interface Game {readonly playerCount:number;readonly players:readonly Player[];readonly claims:Readonly<Record<string,string>>}
export interface Claim {readonly routeId:string;readonly playerId:string;readonly cards:readonly Card[]}
export interface Score {readonly playerId:string;readonly routePoints:number;readonly ticketPoints:number;readonly longestLength:number;readonly longestBonus:number;readonly total:number;readonly completedTicketIds:readonly string[]}
export const ROUTE_POINTS:Readonly<Record<number,number>>={1:1,2:2,3:4,4:7,5:10,6:15};
const validName=(v:unknown):v is string=>typeof v==='string'&&v.length>0;
const whole=(v:number):boolean=>Number.isFinite(v)&&Number.isInteger(v)&&v>=0;
const parallel=(r:Route):string=>JSON.stringify([r.a,r.b].sort());
function routeIndex(routes:readonly Route[]):Map<string,Route>{
 if(!Array.isArray(routes))throw new RangeError('Routes must be an array');const index=new Map<string,Route>();
 for(const r of routes){if(!r||!validName(r.id)||!validName(r.a)||!validName(r.b)||!Number.isInteger(r.length)||r.length<1||r.length>6||!(r.color==='gray'||CARDS.slice(0,8).includes(r.color))||index.has(r.id)||(r.parallelGroup!==undefined&&!validName(r.parallelGroup)))throw new RangeError('Invalid/duplicate route');index.set(r.id,r);}return index;
}
function owned(routes:readonly Route[],ids:readonly string[]):Route[]{const index=routeIndex(routes);if(!Array.isArray(ids)||new Set(ids).size!==ids.length)throw new RangeError('Invalid/duplicate owned IDs');return ids.map(id=>{const r=index.get(id);if(!r)throw new RangeError('Unknown owned route');return r;});}
function validateTicket(ticket:Ticket):void {if(!ticket||!validName(ticket.id)||!validName(ticket.a)||!validName(ticket.b)||!Number.isInteger(ticket.points)||ticket.points<=0)throw new RangeError('Invalid ticket');}
function validateGame(routes:Map<string,Route>,game:Game):void {
 if(!game||!Number.isInteger(game.playerCount)||game.playerCount<2||game.playerCount>5||!Array.isArray(game.players)||game.players.length!==game.playerCount||!game.claims||typeof game.claims!=='object'||Array.isArray(game.claims))throw new RangeError('Invalid game');
 const players=new Set<string>();for(const p of game.players){if(!p||!validName(p.id)||players.has(p.id)||!whole(p.trainsRemaining)||p.trainsRemaining>45||!p.cards||typeof p.cards!=='object'||Object.keys(p.cards).length!==CARDS.length||!CARDS.every(c=>whole(p.cards[c]))||!Array.isArray(p.ticketIds)||!p.ticketIds.every(validName)||new Set(p.ticketIds).size!==p.ticketIds.length)throw new RangeError('Invalid player');players.add(p.id);}
 const groups=new Map<string,string[]>();for(const[id,player]of Object.entries(game.claims)){const r=routes.get(id);if(!r||!players.has(player))throw new RangeError('Unknown claim');const key=parallel(r),owners=groups.get(key)??[];if(owners.length>0&&(game.playerCount<=3||owners.includes(player)))throw new RangeError('Illegal existing parallel claims');owners.push(player);groups.set(key,owners);}
}
export function canClaim(routes:readonly Route[],game:Game,claim:Claim):boolean {
 try{const index=routeIndex(routes);validateGame(index,game);if(!claim||!validName(claim.routeId)||!validName(claim.playerId)||!Array.isArray(claim.cards)||!claim.cards.every(c=>CARDS.includes(c)))return false;
 const r=index.get(claim.routeId),player=game.players.find(p=>p.id===claim.playerId);if(!r||!player||Object.hasOwn(game.claims,r.id)||player.trainsRemaining<r.length||claim.cards.length!==r.length)return false;
 for(const[id,owner]of Object.entries(game.claims)){const other=index.get(id)!;if(parallel(other)===parallel(r)&&(game.playerCount<=3||owner===player.id))return false;}
 const spend:Record<Card,number>={pink:0,white:0,blue:0,yellow:0,orange:0,black:0,red:0,green:0,locomotive:0};for(const card of claim.cards as readonly Card[])spend[card]++;
 if(!CARDS.every(c=>spend[c]<=player.cards[c]))return false;const colors=claim.cards.filter(c=>c!=='locomotive');if(r.color==='gray')return new Set(colors).size<=1;return colors.every(c=>c===r.color);
 }catch{return false;}
}
export function applyClaim(routes:readonly Route[],game:Game,claim:Claim):Game {
 if(!canClaim(routes,game,claim))throw new RangeError('Illegal claim');const r=routes.find(r=>r.id===claim.routeId)!;
 const players=game.players.map(p=>{const cards={...p.cards};if(p.id===claim.playerId)for(const c of claim.cards)cards[c]--;return{id:p.id,cards,trainsRemaining:p.trainsRemaining-(p.id===claim.playerId?r.length:0),ticketIds:p.ticketIds.slice()};});return{playerCount:game.playerCount,players,claims:{...game.claims,[r.id]:claim.playerId}};
}
export function ticketComplete(routes:readonly Route[],ownedIds:readonly string[],ticket:Ticket):boolean {
 validateTicket(ticket);const selected=owned(routes,ownedIds);if(ticket.a===ticket.b)return true;const adjacency=new Map<string,string[]>();for(const r of selected){adjacency.set(r.a,[...(adjacency.get(r.a)??[]),r.b]);adjacency.set(r.b,[...(adjacency.get(r.b)??[]),r.a]);}
 const seen=new Set([ticket.a]),queue=[ticket.a];for(let i=0;i<queue.length;i++){for(const next of adjacency.get(queue[i]!)??[]){if(next===ticket.b)return true;if(!seen.has(next)){seen.add(next);queue.push(next);}}}return false;
}
interface Edge {readonly a:number;readonly b:number;readonly weight:number;readonly bit:bigint}
/** Exact weighted undirected trail; memoized edge-mask states, independent components. */
export function longestTrail(routes:readonly Route[],ownedIds:readonly string[]):number {
 const selected=owned(routes,ownedIds);if(selected.length===0)return 0;const names=[...new Set(selected.flatMap(r=>[r.a,r.b]))],index=new Map(names.map((name,i)=>[name,i])),adjacency:Edge[][]=names.map(()=>[]);
 const edges:Edge[]=selected.map((r,i)=>({a:index.get(r.a)!,b:index.get(r.b)!,weight:r.length,bit:1n<<BigInt(i)}));for(const e of edges){adjacency[e.a]!.push(e);if(e.b!==e.a)adjacency[e.b]!.push(e);}
 const visited=new Set<number>();let best=0;
 for(let root=0;root<names.length;root++){if(visited.has(root))continue;const component=[root],edgeSet=new Set<Edge>();visited.add(root);for(let i=0;i<component.length;i++)for(const edge of adjacency[component[i]!]!){edgeSet.add(edge);const next=edge.a===component[i]?edge.b:edge.a;if(!visited.has(next)){visited.add(next);component.push(next);}}
 const total=[...edgeSet].reduce((n,e)=>n+e.weight,0),odd=component.filter(v=>adjacency[v]!.reduce((n,e)=>n+(e.a===e.b?2:1),0)%2===1).length;
 if(odd<=2){best=Math.max(best,total);continue;}
 const memo:Map<bigint,number>[]=names.map(()=>new Map<bigint,number>());
 const search=(vertex:number,used:bigint):number=>{const old=memo[vertex]!.get(used);if(old!==undefined)return old;let value=0;for(const edge of adjacency[vertex]!){if((used&edge.bit)!==0n)continue;const next=edge.a===vertex?edge.b:edge.a;value=Math.max(value,edge.weight+search(next,used|edge.bit));}memo[vertex]!.set(used,value);return value;};for(const start of component)best=Math.max(best,search(start,0n));
 }return best;
}
export function scoreGame(routes:readonly Route[],tickets:readonly Ticket[],game:Game):readonly Score[]{
 const index=routeIndex(routes);validateGame(index,game);if(!Array.isArray(tickets))throw new RangeError('Tickets must be an array');const catalog=new Map<string,Ticket>();for(const t of tickets){validateTicket(t);if(catalog.has(t.id))throw new RangeError('Duplicate ticket');catalog.set(t.id,t);}
 const prelim=game.players.map(player=>{const ids=Object.entries(game.claims).filter(([,id])=>id===player.id).map(([id])=>id),routePoints=ids.reduce((n,id)=>n+ROUTE_POINTS[index.get(id)!.length]!,0),completedTicketIds:string[]=[];let ticketPoints=0;for(const id of player.ticketIds){const ticket=catalog.get(id);if(!ticket)throw new RangeError('Unknown held ticket');const complete=ticketComplete(routes,ids,ticket);ticketPoints+=complete?ticket.points:-ticket.points;if(complete)completedTicketIds.push(id);}return{playerId:player.id,routePoints,ticketPoints,longestLength:longestTrail(routes,ids),completedTicketIds};});const maximum=Math.max(0,...prelim.map(p=>p.longestLength));return prelim.map(p=>{const longestBonus=maximum>0&&p.longestLength===maximum?10:0;return{...p,longestBonus,total:p.routePoints+p.ticketPoints+longestBonus};});
}
export function seeded(seed:number):()=>number {let state=seed>>>0;return()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};}
