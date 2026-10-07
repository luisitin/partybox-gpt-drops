/** Blind B12 oracle: independently authored from the original prompt/public contract. */
export type Card = 'pink' | 'white' | 'blue' | 'yellow' | 'orange' | 'black' | 'red' | 'green' | 'locomotive';
export interface Route {
  readonly id: string; readonly a: string; readonly b: string; readonly length: number;
  readonly color: Exclude<Card, 'locomotive'> | 'gray'; readonly parallelGroup?: string;
}
export interface Ticket { readonly id: string; readonly a: string; readonly b: string; readonly points: number }
export interface Player {
  readonly id: string; readonly cards: Readonly<Record<Card, number>>;
  readonly trainsRemaining: number; readonly ticketIds: readonly string[];
}
export interface Game {
  readonly playerCount: number; readonly players: readonly Player[];
  readonly claims: Readonly<Record<string, string>>;
}
export interface Claim { readonly routeId: string; readonly playerId: string; readonly cards: readonly Card[] }
export interface Score {
  readonly playerId: string; readonly routePoints: number; readonly ticketPoints: number;
  readonly longestLength: number; readonly longestBonus: number; readonly total: number;
  readonly completedTicketIds: readonly string[];
}

const cardNames: readonly Card[] = ['pink','white','blue','yellow','orange','black','red','green','locomotive'];
const cardSet = new Set<string>(cardNames);
const routeColors = new Set<string>(cardNames.filter(card => card !== 'locomotive'));
const lengthPoints: readonly number[] = [0,1,2,4,7,10,15];
function fail(reason: string): never { throw new RangeError(reason); }
function text(value: unknown): value is string { return typeof value === 'string' && value.length > 0; }
function integer(value: number, minimum: number, maximum = Number.MAX_SAFE_INTEGER): boolean {
  return Number.isSafeInteger(value) && value >= minimum && value <= maximum;
}
function record(value: unknown): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function routeIndex(routes: readonly Route[]): Map<string, Route> {
  if (!Array.isArray(routes)) fail('Routes must be an array');
  const byId = new Map<string, Route>();
  for (const route of routes as readonly Route[]) {
    if (!record(route) || !text(route.id) || !text(route.a) || !text(route.b)
      || !integer(route.length,1,6) || !(route.color === 'gray' || routeColors.has(route.color))
      || (route.parallelGroup !== undefined && !text(route.parallelGroup)) || byId.has(route.id)) fail('Malformed route');
    byId.set(route.id, route);
  }
  return byId;
}
function ticketIndex(tickets: readonly Ticket[]): Map<string, Ticket> {
  if (!Array.isArray(tickets)) fail('Tickets must be an array');
  const byId = new Map<string, Ticket>();
  for (const ticket of tickets as readonly Ticket[]) {
    validateTicket(ticket);
    if (byId.has(ticket.id)) fail('Duplicate ticket');
    byId.set(ticket.id,ticket);
  }
  return byId;
}
function validateTicket(ticket: Ticket): void {
  if (!record(ticket) || !text(ticket.id) || !text(ticket.a) || !text(ticket.b) || !integer(ticket.points,1)) fail('Malformed ticket');
}
function parallelKey(route: Route): string {
  return JSON.stringify(route.a <= route.b ? [route.a,route.b] : [route.b,route.a]);
}
function gameIndex(routes: Map<string, Route>, game: Game): Map<string, Player> {
  if (!record(game) || !integer(game.playerCount,2,5) || !Array.isArray(game.players)
    || game.players.length !== game.playerCount || !record(game.claims)) fail('Malformed game');
  const players = new Map<string,Player>();
  for (const player of game.players as readonly Player[]) {
    if (!record(player) || !text(player.id) || players.has(player.id) || !integer(player.trainsRemaining,0,45)
      || !record(player.cards) || Object.keys(player.cards).length !== cardNames.length || !Array.isArray(player.ticketIds)) fail('Malformed player');
    for (const card of cardNames) if (!Object.hasOwn(player.cards,card) || !integer(player.cards[card],0)) fail('Malformed card inventory');
    const held = new Set<string>();
    for (const id of player.ticketIds) {
      if (!text(id) || held.has(id)) fail('Malformed held ticket IDs');
      held.add(id);
    }
    players.set(player.id,player);
  }
  const groups = new Map<string, Set<string>>();
  for (const [id,owner] of Object.entries(game.claims)) {
    const route=routes.get(id);
    if (route === undefined || !text(owner) || !players.has(owner)) fail('Unknown claim');
    const key=parallelKey(route);
    const owners=groups.get(key) ?? new Set<string>();
    if (owners.has(owner) || (game.playerCount <= 3 && owners.size !== 0)) fail('Illegal existing parallel claims');
    owners.add(owner);groups.set(key,owners);
  }
  return players;
}
function claimedRoutes(routes: Map<string, Route>, ownedIds: readonly string[]): Route[] {
  if (!Array.isArray(ownedIds)) fail('Owned route IDs must be an array');
  const seen = new Set<string>();
  return [...ownedIds].map(id => {
    const route=routes.get(id);
    if (!text(id) || route === undefined || seen.has(id)) fail('Unknown or duplicate owned route');
    seen.add(id);return route;
  });
}

export function canClaim(routes: readonly Route[], game: Game, claim: Claim): boolean {
  try {
    const byId=routeIndex(routes),players=gameIndex(byId,game);
    if (!record(claim) || !text(claim.routeId) || !text(claim.playerId) || !Array.isArray(claim.cards)) return false;
    const route=byId.get(claim.routeId),player=players.get(claim.playerId);
    if (route === undefined || player === undefined || Object.hasOwn(game.claims,route.id)
      || player.trainsRemaining < route.length || claim.cards.length !== route.length) return false;
    for (const [id,owner] of Object.entries(game.claims)) {
      if (parallelKey(byId.get(id)!) === parallelKey(route) && (game.playerCount <= 3 || owner === player.id)) return false;
    }
    const spend = new Map<Card,number>();
    const colored = new Set<Card>();
    for (const card of claim.cards) {
      if (!cardSet.has(card)) return false;
      spend.set(card,(spend.get(card) ?? 0)+1);
      if (card !== 'locomotive') colored.add(card);
    }
    if (colored.size > 1 || (route.color !== 'gray' && colored.size === 1 && !colored.has(route.color))) return false;
    for (const [card,count] of spend) if (count > player.cards[card]) return false;
    return true;
  } catch { return false; }
}

export function applyClaim(routes: readonly Route[], game: Game, claim: Claim): Game {
  if (!canClaim(routes,game,claim)) fail('Illegal route claim');
  const route=routes.find(candidate => candidate.id === claim.routeId)!;
  return { playerCount:game.playerCount,
    players:game.players.map(player => {
      const cards={...player.cards};
      if (player.id === claim.playerId) for (const card of claim.cards) cards[card]--;
      return { id:player.id,cards,trainsRemaining:player.trainsRemaining-(player.id===claim.playerId?route.length:0),
        ticketIds:player.ticketIds.slice() };
    }), claims:{...game.claims,[claim.routeId]:claim.playerId} };
}

function connected(owned: readonly Route[], a: string, b: string): boolean {
  if (a===b) return true;
  const adjacency=new Map<string,string[]>();
  for (const route of owned) {
    adjacency.set(route.a,[...(adjacency.get(route.a) ?? []),route.b]);
    adjacency.set(route.b,[...(adjacency.get(route.b) ?? []),route.a]);
  }
  const seen=new Set<string>([a]),queue=[a];
  for(let cursor=0;cursor<queue.length;cursor++) for(const next of adjacency.get(queue[cursor]!) ?? []) {
    if(next===b)return true;
    if(!seen.has(next)){seen.add(next);queue.push(next);}
  }
  return false;
}
export function ticketComplete(routes: readonly Route[], ownedIds: readonly string[], ticket: Ticket): boolean {
  const owned=claimedRoutes(routeIndex(routes),ownedIds);
  validateTicket(ticket);
  return connected(owned,ticket.a,ticket.b);
}

interface Edge { readonly from: number; readonly to: number; readonly weight: number }
/** Exact weighted trail search: memoizes current vertex plus the used-edge subset. */
function longest(owned: readonly Route[]): number {
  if(owned.length===0)return 0;
  const vertices=new Map<string,number>();
  const index=(name:string):number=>{
    const found=vertices.get(name);if(found!==undefined)return found;
    const next=vertices.size;vertices.set(name,next);return next;
  };
  const edges:Edge[]=owned.map(route=>({from:index(route.a),to:index(route.b),weight:route.length}));
  const adjacency=Array.from({length:vertices.size},()=>[] as number[]);
  edges.forEach((edge,id)=>{adjacency[edge.from]!.push(id);if(edge.to!==edge.from)adjacency[edge.to]!.push(id);});
  const seen=new Set<number>();
  let answer=0;
  for(let root=0;root<vertices.size;root++) {
    if(seen.has(root))continue;
    const component:number[]=[],queue=[root];seen.add(root);
    const edgeIds=new Set<number>();
    for(let cursor=0;cursor<queue.length;cursor++) {
      const vertex=queue[cursor]!;component.push(vertex);
      for(const id of adjacency[vertex]!) {
        edgeIds.add(id);const edge=edges[id]!,other=edge.from===vertex?edge.to:edge.from;
        if(!seen.has(other)){seen.add(other);queue.push(other);}
      }
    }
    const ids=[...edgeIds];
    let sum=0,odd=0;
    for(const id of ids)sum+=edges[id]!.weight;
    for(const vertex of component) {
      let degree=0;
      for(const id of adjacency[vertex]!)degree+=edges[id]!.from===edges[id]!.to?2:1;
      if(degree%2!==0)odd++;
    }
    // A connected multigraph has a trail using every edge iff zero or two odd vertices.
    if(odd<=2){answer=Math.max(answer,sum);continue;}
    if(ids.length===component.length-1) {
      // Tree trails are simple paths: two weighted farthest-vertex traversals.
      const farthest=(start:number):{vertex:number;distance:number}=>{
        const stack:[number,number,number][]=[[start,-1,0]];
        let best={vertex:start,distance:0};
        while(stack.length){const [vertex,parent,distance]=stack.pop()!;
          if(distance>best.distance)best={vertex,distance};
          for(const id of adjacency[vertex]!) {const edge=edges[id]!,other=edge.from===vertex?edge.to:edge.from;
            if(other!==parent)stack.push([other,vertex,distance+edge.weight]);}
        }
        return best;
      };
      answer=Math.max(answer,farthest(farthest(root).vertex).distance);continue;
    }
    const bit=new Map(ids.map((id,offset)=>[id,1n<<BigInt(offset)]));
    const memo=Array.from({length:vertices.size},()=>new Map<bigint,number>());
    const visit=(vertex:number,used:bigint):number=>{
      const known=memo[vertex]!.get(used);if(known!==undefined)return known;
      let best=0;
      for(const id of adjacency[vertex]!) {
        const mask=bit.get(id)!;if((used&mask)!==0n)continue;
        const edge=edges[id]!,other=edge.from===vertex?edge.to:edge.from;
        best=Math.max(best,edge.weight+visit(other,used|mask));
      }
      memo[vertex]!.set(used,best);return best;
    };
    for(const vertex of component)answer=Math.max(answer,visit(vertex,0n));
  }
  return answer;
}
export function longestTrail(routes: readonly Route[], ownedIds: readonly string[]): number {
  return longest(claimedRoutes(routeIndex(routes),ownedIds));
}

export function scoreGame(routes: readonly Route[], tickets: readonly Ticket[], game: Game): readonly Score[] {
  const byId=routeIndex(routes),ticketMap=ticketIndex(tickets);
  gameIndex(byId,game);
  const scores=game.players.map(player=>{
    const owned=Object.entries(game.claims).filter(([,owner])=>owner===player.id).map(([id])=>byId.get(id)!);
    let ticketPoints=0;
    const completedTicketIds:string[]=[];
    for(const id of player.ticketIds) {
      const ticket=ticketMap.get(id);if(ticket===undefined)fail('Unknown held ticket');
      const complete=connected(owned,ticket.a,ticket.b);
      ticketPoints+=complete?ticket.points:-ticket.points;
      if(complete)completedTicketIds.push(id);
    }
    return {playerId:player.id,routePoints:owned.reduce((sum,route)=>sum+lengthPoints[route.length]!,0),
      ticketPoints,longestLength:longest(owned),longestBonus:0,total:0,completedTicketIds};
  });
  const maximum=Math.max(...scores.map(score=>score.longestLength));
  return scores.map(score=>{const longestBonus=maximum>0&&score.longestLength===maximum?10:0;
    return {...score,longestBonus,total:score.routePoints+score.ticketPoints+longestBonus};});
}

export function seeded(seed: number): () => number {
  if(!Number.isSafeInteger(seed))fail('Invalid seed');
  let state=seed>>>0;
  return ()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
}
