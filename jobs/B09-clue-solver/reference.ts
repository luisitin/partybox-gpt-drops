import { CLASSIC_DECK } from "./types.js";
import type { Fraction, GameLog, SolverError, SolverResult } from "./types.js";

/* Independently authored from types.ts and ASSUMPTIONS.md; see INDEPENDENCE.md. */
interface Evidence {
  readonly names: string[];
  readonly category: number[];
  readonly sizes: number[];
  readonly me: number;
  readonly own: number[];
  readonly known: { player: number; card: number }[];
  readonly suggestions: {
    player: number;
    cards: number[];
    refutedBy: number | null;
    shownCard: number | undefined;
  }[];
  readonly reduced: boolean;
}
interface Clause { readonly player: number; readonly cards: number }
interface Group {
  readonly cards: number[];
  readonly allowed: number;
  readonly covers: bigint[];
  readonly signature: string;
}
interface Distribution { readonly total: bigint; readonly margins: bigint[][] }

const FACTORIAL: bigint[] = [1n];
for (let i = 1; i <= 21; i++) FACTORIAL.push(FACTORIAL[i - 1]! * BigInt(i));

function invalid(message: string): SolverError {
  return { ok: false, code: "INVALID_INPUT", message };
}
function contradiction(): SolverError {
  return { ok: false, code: "CONTRADICTION", message: "No physical deal satisfies the observations." };
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function index(value: unknown, length: number): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value < length;
}

function validate(input: unknown): Evidence | SolverError {
  if (!record(input)) return invalid("The game log must be an object.");
  const deck: unknown = input.deck === undefined ? CLASSIC_DECK : input.deck;
  if (!record(deck)) return invalid("The deck must be an object.");
  const names: string[] = [];
  const category: number[] = [];
  const categories = [deck.suspects, deck.weapons, deck.rooms];
  const cardIds = new Map<string, number>();
  for (let cat = 0; cat < 3; cat++) {
    const cards = categories[cat];
    if (!Array.isArray(cards) || cards.length === 0) return invalid("Every deck category must be a nonempty array.");
    for (const card of cards) {
      if (typeof card !== "string" || card.length === 0 || cardIds.has(card)) {
        return invalid("Card names must be unique nonempty strings.");
      }
      cardIds.set(card, names.length);
      names.push(card);
      category.push(cat);
    }
  }
  if (names.length > 21) return invalid("The deck may contain at most 21 cards.");
  if (!Array.isArray(input.handSizes) || input.handSizes.length < 3 || input.handSizes.length > 6) {
    return invalid("There must be three to six hand sizes.");
  }
  const sizes: number[] = [];
  for (const size of input.handSizes) {
    if (typeof size !== "number" || !Number.isInteger(size) || size < 0) {
      return invalid("Hand sizes must be nonnegative integers.");
    }
    sizes.push(size);
  }
  if (sizes.reduce((sum, size) => sum + size, 0) !== names.length - 3) {
    return invalid("Hand sizes must sum to the number of cards outside the envelope.");
  }
  const me = input.me;
  if (!index(me, sizes.length)) return invalid("The observer index is invalid.");
  if (!Array.isArray(input.ownHand) || input.ownHand.length !== sizes[me]) {
    return invalid("The observer's complete hand must match its hand size.");
  }
  const own: number[] = [];
  const ownSet = new Set<number>();
  for (const name of input.ownHand) {
    const id = typeof name === "string" ? cardIds.get(name) : undefined;
    if (id === undefined || ownSet.has(id)) return invalid("The observer's hand contains an unknown or repeated card.");
    ownSet.add(id);
    own.push(id);
  }
  const known: { player: number; card: number }[] = [];
  if (input.shown !== undefined) {
    if (!Array.isArray(input.shown)) return invalid("Shown cards must be an array.");
    for (const entry of input.shown) {
      if (!record(entry) || !index(entry.player, sizes.length)) return invalid("A shown-card player index is invalid.");
      const id = typeof entry.card === "string" ? cardIds.get(entry.card) : undefined;
      if (id === undefined) return invalid("A shown card is not in the deck.");
      known.push({ player: entry.player, card: id });
    }
  }
  if (!Array.isArray(input.suggestions)) return invalid("Suggestions must be an array.");
  const suggestions: Evidence["suggestions"] = [];
  for (const entry of input.suggestions) {
    if (!record(entry) || !index(entry.player, sizes.length)) return invalid("A suggesting player index is invalid.");
    if (!Array.isArray(entry.cards) || entry.cards.length !== 3) return invalid("A suggestion must contain three cards.");
    const cards: number[] = [];
    for (let cat = 0; cat < 3; cat++) {
      const name: unknown = entry.cards[cat];
      const id = typeof name === "string" ? cardIds.get(name) : undefined;
      if (id === undefined || category[id] !== cat) {
        return invalid("Suggestion cards must be a suspect, weapon, and room in that order.");
      }
      cards.push(id);
    }
    const refutedBy = entry.refutedBy;
    if (refutedBy !== null && (!index(refutedBy, sizes.length) || refutedBy === entry.player)) {
      return invalid("A refuter must be another player or null.");
    }
    let shownCard: number | undefined;
    if (entry.shownCard !== undefined) {
      shownCard = typeof entry.shownCard === "string" ? cardIds.get(entry.shownCard) : undefined;
      if (refutedBy === null || shownCard === undefined || !cards.includes(shownCard)) {
        return invalid("A suggestion's shown card must be one of its cards and have a refuter.");
      }
    }
    suggestions.push({ player: entry.player, cards, refutedBy, shownCard });
  }
  return {
    names, category, sizes, me, own, known, suggestions,
    reduced: (categories[0] as unknown[]).length === 3 &&
      (categories[1] as unknown[]).length === 3 && (categories[2] as unknown[]).length === 4,
  };
}

/* Repeatedly apply only necessary capacity, category, and existential facts. */
function settle(domains: number[], evidence: Evidence, clauses: readonly Clause[]): boolean {
  const players = evidence.sizes.length;
  const envelope = 1 << players;
  let changed = true;
  while (changed) {
    changed = false;
    for (const domain of domains) if (domain === 0) return false;
    for (let player = 0; player < players; player++) {
      const bit = 1 << player;
      let certain = 0;
      let possible = 0;
      for (const domain of domains) {
        if (domain === bit) certain++;
        if ((domain & bit) !== 0) possible++;
      }
      const size = evidence.sizes[player]!;
      if (certain > size || possible < size) return false;
      if (certain === size || possible === size) {
        for (let card = 0; card < domains.length; card++) {
          const before = domains[card]!;
          if (before === bit || (before & bit) === 0) continue;
          const after = possible === size ? bit : before & ~bit;
          if (before !== after) { domains[card] = after; changed = true; }
        }
      }
    }
    for (let cat = 0; cat < 3; cat++) {
      let certain = 0;
      let possible = 0;
      for (let card = 0; card < domains.length; card++) {
        if (evidence.category[card] !== cat) continue;
        if (domains[card] === envelope) certain++;
        if ((domains[card]! & envelope) !== 0) possible++;
      }
      if (certain > 1 || possible < 1) return false;
      if (certain === 1 || possible === 1) {
        for (let card = 0; card < domains.length; card++) {
          const before = domains[card]!;
          if (evidence.category[card] !== cat || before === envelope || (before & envelope) === 0) continue;
          const after = possible === 1 ? envelope : before & ~envelope;
          if (before !== after) { domains[card] = after; changed = true; }
        }
      }
    }
    for (const clause of clauses) {
      const bit = 1 << clause.player;
      let satisfied = false;
      let candidate = -1;
      let count = 0;
      for (let card = 0; card < domains.length; card++) {
        if ((clause.cards & (1 << card)) === 0) continue;
        if (domains[card] === bit) { satisfied = true; break; }
        if ((domains[card]! & bit) !== 0) { candidate = card; count++; }
      }
      if (satisfied) continue;
      if (count === 0) return false;
      if (count === 1 && domains[candidate] !== bit) { domains[candidate] = bit; changed = true; }
    }
  }
  return true;
}

function constraints(evidence: Evidence): { domains: number[]; clauses: Clause[] } | undefined {
  const players = evidence.sizes.length;
  const domains = evidence.names.map(() => (1 << (players + 1)) - 1);
  const meBit = 1 << evidence.me;
  const own = new Set(evidence.own);
  for (let card = 0; card < domains.length; card++) domains[card] = own.has(card) ? meBit : domains[card]! & ~meBit;
  for (const known of evidence.known) domains[known.card] = domains[known.card]! & (1 << known.player);
  const clauses: Clause[] = [];
  const seen = new Set<string>();
  for (const suggestion of evidence.suggestions) {
    let player = (suggestion.player + 1) % players;
    while (player !== suggestion.player && player !== suggestion.refutedBy) {
      for (const card of suggestion.cards) domains[card] = domains[card]! & ~(1 << player);
      player = (player + 1) % players;
    }
    if (suggestion.refutedBy !== null) {
      let cardSet = 0;
      for (const card of suggestion.cards) cardSet |= 1 << card;
      const key = `${suggestion.refutedBy}/${cardSet}`;
      if (!seen.has(key)) { clauses.push({ player: suggestion.refutedBy, cards: cardSet }); seen.add(key); }
      if (suggestion.shownCard !== undefined) {
        domains[suggestion.shownCard] = domains[suggestion.shownCard]! & (1 << suggestion.refutedBy);
      }
    }
  }
  return settle(domains, evidence, clauses) ? { domains, clauses } : undefined;
}

/* The small-deck oracle visits each physical deal, never sampling or weighting it. */
function enumerateSmall(evidence: Evidence, domains: readonly number[], clauses: readonly Clause[]): {
  total: bigint; owners: bigint[][];
} {
  const players = evidence.sizes.length;
  const owners = evidence.names.map(() => new Array<bigint>(players + 1).fill(0n));
  const remaining = [...evidence.sizes, 3];
  const envelopeCategories = [0, 0, 0];
  const assignment = new Array<number>(domains.length).fill(-1);
  const hands = new Array<number>(players).fill(0);
  let total = 0n;
  function visit(card: number): void {
    if (card === domains.length) {
      for (const count of remaining) if (count !== 0) return;
      for (const clause of clauses) if ((hands[clause.player]! & clause.cards) === 0) return;
      total++;
      for (let id = 0; id < assignment.length; id++) {
        owners[id]![assignment[id]!] = owners[id]![assignment[id]!]! + 1n;
      }
      return;
    }
    const category = evidence.category[card]!;
    for (let owner = 0; owner <= players; owner++) {
      if ((domains[card]! & (1 << owner)) === 0 || remaining[owner] === 0) continue;
      if (owner === players && envelopeCategories[category] !== 0) continue;
      remaining[owner]!--;
      assignment[card] = owner;
      if (owner === players) envelopeCategories[category] = 1;
      else hands[owner] = hands[owner]! | (1 << card);
      visit(card + 1);
      if (owner === players) envelopeCategories[category] = 0;
      else hands[owner] = hands[owner]! & ~(1 << card);
      remaining[owner]!++;
    }
  }
  visit(0);
  return { total, owners };
}

function bitCount(mask: number): number {
  let count = 0;
  for (let bits = mask; bits !== 0; bits &= bits - 1) count++;
  return count;
}

/* With identical hand eligibility, envelope choices and labeled hand deals separate. */
function homogeneousDeals(evidence: Evidence, domains: readonly number[], clauses: readonly Clause[]): {
  total: bigint; owners: bigint[][];
} | undefined {
  const players = evidence.sizes.length;
  const envelopeBit = 1 << players;
  const handsMask = envelopeBit - 1;
  for (const clause of clauses) {
    const owner = 1 << clause.player;
    let satisfied = false;
    for (let card = 0; card < domains.length; card++) {
      if ((clause.cards & (1 << card)) !== 0 && domains[card] === owner) { satisfied = true; break; }
    }
    if (!satisfied) return undefined;
  }
  const capacities = evidence.sizes.slice();
  const envelopeFixed = [false, false, false];
  const choices = [0, 0, 0];
  let unknown = 0;
  for (let card = 0; card < domains.length; card++) {
    const domain = domains[card]!;
    if ((domain & (domain - 1)) === 0) {
      if (domain === envelopeBit) envelopeFixed[evidence.category[card]!] = true;
      else capacities[31 - Math.clz32(domain)]!--;
    } else {
      unknown++;
      if ((domain & envelopeBit) !== 0) choices[evidence.category[card]!]!++;
    }
  }
  let eligibleHands = 0;
  for (let player = 0; player < players; player++) if (capacities[player]! > 0) eligibleHands |= 1 << player;
  for (const domain of domains) {
    if ((domain & (domain - 1)) !== 0 && (domain & handsMask) !== eligibleHands) return undefined;
  }
  let envelopeChoices = 1n;
  let neededEnvelope = 0;
  for (let category = 0; category < 3; category++) {
    if (envelopeFixed[category]) continue;
    if (choices[category] === 0) return undefined;
    envelopeChoices *= BigInt(choices[category]!);
    neededEnvelope++;
  }
  const dealt = unknown - neededEnvelope;
  if (dealt < 0 || capacities.reduce((sum, capacity) => sum + capacity, 0) !== dealt) return undefined;
  let denominator = 1n;
  for (const capacity of capacities) denominator *= FACTORIAL[capacity]!;
  const total = envelopeChoices * (FACTORIAL[dealt]! / denominator);
  const owners = evidence.names.map(() => new Array<bigint>(players + 1).fill(0n));
  for (let card = 0; card < domains.length; card++) {
    const domain = domains[card]!;
    if ((domain & (domain - 1)) === 0) {
      owners[card]![31 - Math.clz32(domain)] = total;
      continue;
    }
    const envelopeDeals = (domain & envelopeBit) === 0 ? 0n : total / BigInt(choices[evidence.category[card]!]!);
    owners[card]![players] = envelopeDeals;
    if (dealt > 0) for (let player = 0; player < players; player++) {
      owners[card]![player] = (total - envelopeDeals) * BigInt(capacities[player]!) / BigInt(dealt);
    }
  }
  return { total, owners };
}

/* Allocate indistinguishable constraint classes; multinomials restore labeled deals. */
function distribute(groups: readonly Group[], capacities: readonly number[], required: bigint): Distribution {
  const players = capacities.length;
  const suffixPossible: number[][] = new Array(groups.length + 1);
  const suffixCoverage: bigint[] = new Array(groups.length + 1).fill(0n);
  suffixPossible[groups.length] = new Array<number>(players).fill(0);
  for (let i = groups.length - 1; i >= 0; i--) {
    const group = groups[i]!;
    suffixPossible[i] = suffixPossible[i + 1]!.map((count, player) =>
      count + ((group.allowed & (1 << player)) !== 0 ? group.cards.length : 0));
    let cover = suffixCoverage[i + 1]!;
    for (const mask of group.covers) cover |= mask;
    suffixCoverage[i] = cover;
  }
  const memo = new Map<string, Distribution>();
  function count(at: number, caps: readonly number[], needs: bigint): Distribution {
    if (at === groups.length) {
      return { total: needs === 0n && caps.every(cap => cap === 0) ? 1n : 0n, margins: [] };
    }
    if ((needs & ~suffixCoverage[at]!) !== 0n || caps.some((cap, player) => cap > suffixPossible[at]![player]!)) {
      return { total: 0n, margins: [] };
    }
    const key = `${at}/${caps.join(",")}/${needs.toString(16)}`;
    const cached = memo.get(key);
    if (cached !== undefined) return cached;
    const group = groups[at]!;
    const size = group.cards.length;
    const margins = Array.from({ length: groups.length - at }, () => new Array<bigint>(players).fill(0n));
    let total = 0n;
    const allocation = new Array<number>(players).fill(0);
    function include(): void {
      let uncovered = needs;
      let denominator = 1n;
      const nextCaps = new Array<number>(players);
      for (let player = 0; player < players; player++) {
        const take = allocation[player]!;
        nextCaps[player] = caps[player]! - take;
        denominator *= FACTORIAL[take]!;
        if (take > 0) uncovered &= ~group.covers[player]!;
      }
      const tail = count(at + 1, nextCaps, uncovered);
      if (tail.total === 0n) return;
      const ways = FACTORIAL[size]! / denominator;
      total += ways * tail.total;
      for (let player = 0; player < players; player++) {
        const take = allocation[player]!;
        if (take > 0) margins[0]![player] = margins[0]![player]! + (ways * BigInt(take) / BigInt(size)) * tail.total;
      }
      for (let offset = 0; offset < tail.margins.length; offset++) {
        for (let player = 0; player < players; player++) {
          margins[offset + 1]![player] = margins[offset + 1]![player]! + ways * tail.margins[offset]![player]!;
        }
      }
    }
    if (at === groups.length - 1) {
      let sum = 0;
      let allowed = true;
      for (let player = 0; player < players; player++) {
        allocation[player] = caps[player]!;
        sum += caps[player]!;
        if (caps[player]! > 0 && (group.allowed & (1 << player)) === 0) allowed = false;
      }
      if (allowed && sum === size) include();
    } else {
      const eligible: number[] = [];
      for (let player = 0; player < players; player++) if ((group.allowed & (1 << player)) !== 0) eligible.push(player);
      function split(position: number, left: number): void {
        if (position === eligible.length) { if (left === 0) include(); return; }
        const player = eligible[position]!;
        let availableLater = 0;
        for (let later = position + 1; later < eligible.length; later++) availableLater += caps[eligible[later]!]!;
        const minimum = Math.max(0, left - availableLater, caps[player]! - suffixPossible[at + 1]![player]!);
        const maximum = Math.min(left, caps[player]!);
        for (let take = minimum; take <= maximum; take++) {
          allocation[player] = take;
          split(position + 1, left - take);
        }
        allocation[player] = 0;
      }
      split(0, size);
    }
    const result = { total, margins };
    memo.set(key, result);
    return result;
  }
  return count(0, capacities, required);
}

function enumerateEnvelopes(evidence: Evidence, initial: readonly number[], clauses: readonly Clause[]): {
  total: bigint; owners: bigint[][];
} {
  const players = evidence.sizes.length;
  const envelopeBit = 1 << players;
  const owners = evidence.names.map(() => new Array<bigint>(players + 1).fill(0n));
  const possible = [[], [], []] as number[][];
  for (let card = 0; card < initial.length; card++) {
    if ((initial[card]! & envelopeBit) !== 0) possible[evidence.category[card]!]!.push(card);
  }
  let total = 0n;
  const modelCache = new Map<string, Distribution>();
  for (const suspect of possible[0]!) for (const weapon of possible[1]!) for (const room of possible[2]!) {
    const domains = initial.map(domain => domain & ~envelopeBit);
    domains[suspect] = initial[suspect]! & envelopeBit;
    domains[weapon] = initial[weapon]! & envelopeBit;
    domains[room] = initial[room]! & envelopeBit;
    if (!settle(domains, evidence, clauses)) continue;
    const capacities = evidence.sizes.slice();
    const fixed: { card: number; owner: number }[] = [];
    for (let card = 0; card < domains.length; card++) {
      const domain = domains[card]!;
      if ((domain & (domain - 1)) !== 0) continue;
      const owner = 31 - Math.clz32(domain);
      fixed.push({ card, owner });
      if (owner < players) capacities[owner]!--;
    }
    const pending: Clause[] = [];
    for (const clause of clauses) {
      const playerBit = 1 << clause.player;
      let candidateCards = 0;
      let satisfied = false;
      for (let card = 0; card < domains.length; card++) {
        if ((clause.cards & (1 << card)) === 0) continue;
        if (domains[card] === playerBit) { satisfied = true; break; }
        if ((domains[card]! & playerBit) !== 0) candidateCards |= 1 << card;
      }
      if (!satisfied) pending.push({ player: clause.player, cards: candidateCards });
    }
    pending.sort((a, b) => a.player - b.player || bitCount(a.cards) - bitCount(b.cards) || a.cards - b.cards);
    const needed: Clause[] = [];
    for (const clause of pending) {
      if (!needed.some(other => other.player === clause.player && (other.cards & clause.cards) === other.cards)) needed.push(clause);
    }
    const grouped = new Map<string, Group>();
    for (let card = 0; card < domains.length; card++) {
      const allowed = domains[card]!;
      if ((allowed & (allowed - 1)) === 0) continue;
      const covers = new Array<bigint>(players).fill(0n);
      for (let clause = 0; clause < needed.length; clause++) {
        const condition = needed[clause]!;
        if ((condition.cards & (1 << card)) !== 0) covers[condition.player] = covers[condition.player]! | (1n << BigInt(clause));
      }
      const signature = `${allowed}:${covers.map(mask => mask.toString(16)).join(",")}`;
      const existing = grouped.get(signature);
      if (existing !== undefined) existing.cards.push(card);
      else grouped.set(signature, { cards: [card], allowed, covers, signature });
    }
    const groups = [...grouped.values()].sort((a, b) =>
      bitCount(a.allowed) - bitCount(b.allowed) || a.cards.length - b.cards.length || a.signature.localeCompare(b.signature));
    const required = (1n << BigInt(needed.length)) - 1n;
    const modelKey = `${capacities.join(",")}/${required.toString(16)}/${groups.map(group => `${group.signature}=${group.cards.length}`).join(";")}`;
    let distribution = modelCache.get(modelKey);
    if (distribution === undefined) {
      distribution = distribute(groups, capacities, required);
      modelCache.set(modelKey, distribution);
    }
    if (distribution.total === 0n) continue;
    total += distribution.total;
    for (const item of fixed) owners[item.card]![item.owner] = owners[item.card]![item.owner]! + distribution.total;
    for (let group = 0; group < groups.length; group++) {
      for (const card of groups[group]!.cards) {
        for (let player = 0; player < players; player++) {
          owners[card]![player] = owners[card]![player]! + distribution.margins[group]![player]!;
        }
      }
    }
  }
  return { total, owners };
}

function fraction(numerator: bigint, denominator: bigint): Fraction {
  let a = numerator;
  let b = denominator;
  while (b !== 0n) { const remainder = a % b; a = b; b = remainder; }
  return { numerator: numerator / a, denominator: denominator / a };
}

/** Exact conditional marginals, with no random choices, clock, or cross-call cache. */
export function solveReference(log: GameLog): SolverResult {
  const evidence = validate(log);
  if ("ok" in evidence) return evidence;
  const facts = constraints(evidence);
  if (facts === undefined) return contradiction();
  const result = evidence.reduced
    ? enumerateSmall(evidence, facts.domains, facts.clauses)
    : homogeneousDeals(evidence, facts.domains, facts.clauses) ?? enumerateEnvelopes(evidence, facts.domains, facts.clauses);
  if (result.total === 0n) return contradiction();
  const cards: Record<string, { envelope: Fraction; hands: Fraction[] }> = Object.create(null) as Record<string, { envelope: Fraction; hands: Fraction[] }>;
  for (let card = 0; card < evidence.names.length; card++) {
    cards[evidence.names[card]!] = {
      envelope: fraction(result.owners[card]![evidence.sizes.length]!, result.total),
      hands: evidence.sizes.map((_size, player) => fraction(result.owners[card]![player]!, result.total)),
    };
  }
  return { ok: true, totalDeals: result.total, cards };
}
