import { CLASSIC_DECK } from "./types.js";
const fail = (code, message) => ({ ok: false, code, message });
const gcd = (a, b) => b === 0n ? a : gcd(b, a % b);
function fraction(a, b) {
    const numerator = BigInt(a), denominator = BigInt(b), divisor = gcd(numerator, denominator);
    return { numerator: numerator / divisor, denominator: denominator / divisor };
}
/** Count every compatible physical deal once; no sampling or player-choice model. */
export function solveClue(input) {
    try {
        return countDeals(input);
    }
    catch {
        return fail("INVALID_INPUT", "Malformed game log");
    }
}
function countDeals(input) {
    if (input === null || typeof input !== "object")
        return fail("INVALID_INPUT", "Expected a game log");
    const deck = input.deck ?? CLASSIC_DECK;
    const groups = [deck.suspects, deck.weapons, deck.rooms];
    if (groups.some(g => !Array.isArray(g) || g.length === 0))
        return fail("INVALID_INPUT", "Three nonempty card categories required");
    const names = groups.flat();
    if (names.length > 21 || names.some(c => typeof c !== "string" || c.length === 0) || new Set(names).size !== names.length)
        return fail("INVALID_INPUT", "Unique nonempty card names required; maximum deck size is 21");
    const sizes = [...input.handSizes], n = sizes.length;
    if (n < 3 || n > 6 || sizes.some(s => !Number.isInteger(s) || s < 0) || sizes.reduce((a, b) => a + b, 0) !== names.length - 3)
        return fail("INVALID_INPUT", "Three to six exact hand sizes must sum to deck size minus three");
    const isPlayer = (p) => Number.isInteger(p) && p >= 0 && p < n;
    if (!isPlayer(input.me) || !Array.isArray(input.ownHand) || input.ownHand.length !== sizes[input.me] || new Set(input.ownHand).size !== input.ownHand.length || !Array.isArray(input.suggestions))
        return fail("INVALID_INPUT", "Invalid observer, complete own hand, or suggestion list");
    const index = new Map(names.map((name, i) => [name, i]));
    const category = groups.flatMap((g, k) => g.map(() => k));
    const allOwners = (1 << (n + 1)) - 1;
    const domains = names.map(() => allOwners & ~(1 << input.me));
    for (const name of input.ownHand) {
        const card = index.get(name);
        if (card === undefined)
            return fail("INVALID_INPUT", "Unknown card in own hand");
        domains[card] = 1 << input.me;
    }
    const known = [...(input.shown ?? [])];
    let clauses = [];
    for (const suggestion of input.suggestions) {
        if (!suggestion || !isPlayer(suggestion.player) || !Array.isArray(suggestion.cards) || suggestion.cards.length !== 3)
            return fail("INVALID_INPUT", "Invalid suggestion");
        const cards = suggestion.cards.map((name, k) => {
            const card = index.get(name);
            return card !== undefined && category[card] === k ? card : -1;
        });
        if (cards.includes(-1))
            return fail("INVALID_INPUT", "A suggestion needs one known card of each category in order");
        if (suggestion.refutedBy !== null && (!isPlayer(suggestion.refutedBy) || suggestion.refutedBy === suggestion.player))
            return fail("INVALID_INPUT", "Refuter must be another player or null");
        for (let player = (suggestion.player + 1) % n; player !== suggestion.player; player = (player + 1) % n) {
            if (player === suggestion.refutedBy)
                break;
            for (const card of cards)
                domains[card] = domains[card] & ~(1 << player);
        }
        if (suggestion.refutedBy !== null)
            clauses.push({ owner: suggestion.refutedBy, cards });
        if (suggestion.shownCard !== undefined) {
            if (suggestion.refutedBy === null || !suggestion.cards.includes(suggestion.shownCard))
                return fail("INVALID_INPUT", "Shown card must belong to the suggestion and a refuter");
            known.push({ player: suggestion.refutedBy, card: suggestion.shownCard });
        }
    }
    for (const observation of known) {
        if (!observation || !isPlayer(observation.player) || !index.has(observation.card))
            return fail("INVALID_INPUT", "Invalid shown-card observation");
        const card = index.get(observation.card);
        domains[card] = domains[card] & (1 << observation.player);
    }
    // Constraint propagation preserves the set of deals; it only removes impossible owners.
    let changed = true;
    while (changed) {
        changed = false;
        if (domains.some(d => d === 0))
            return fail("CONTRADICTION", "A card has no possible owner");
        for (let owner = 0; owner <= n; owner++) {
            for (let group = 0; group < (owner === n ? 3 : 1); group++) {
                const bit = 1 << owner, capacity = owner === n ? 1 : sizes[owner];
                const eligible = names.map((_, i) => i).filter(i => (owner !== n || category[i] === group) && (domains[i] & bit) !== 0);
                const fixed = eligible.filter(i => domains[i] === bit);
                if (fixed.length > capacity || eligible.length < capacity)
                    return fail("CONTRADICTION", "An owner capacity cannot be met");
                for (const card of eligible) {
                    if (fixed.length === capacity && domains[card] !== bit) {
                        domains[card] = domains[card] & ~bit;
                        changed = true;
                    }
                    else if (eligible.length === capacity && domains[card] !== bit) {
                        domains[card] = bit;
                        changed = true;
                    }
                }
            }
        }
        const next = [];
        for (const clause of clauses) {
            const bit = 1 << clause.owner;
            if (clause.cards.some(c => domains[c] === bit))
                continue;
            const candidates = clause.cards.filter(c => (domains[c] & bit) !== 0);
            if (candidates.length === 0)
                return fail("CONTRADICTION", "A refuter has none of the suggested cards");
            if (candidates.length === 1) {
                domains[candidates[0]] = bit;
                changed = true;
            }
            else
                next.push({ owner: clause.owner, cards: candidates });
        }
        clauses = next;
    }
    // A smaller disjunction for the same owner implies every larger disjunction.
    clauses = clauses.filter((clause, i, list) => !list.some((other, j) => j !== i && other.owner === clause.owner && other.cards.every(c => clause.cards.includes(c)) && (other.cards.length < clause.cards.length || j < i)));
    const remaining = [...sizes], envelopeFixed = [false, false, false];
    const ownership = names.map(() => -1), variable = [];
    for (let card = 0; card < names.length; card++) {
        const d = domains[card];
        if ((d & (d - 1)) === 0) {
            const owner = Math.log2(d);
            ownership[card] = owner;
            if (owner === n)
                envelopeFixed[category[card]] = true;
            else
                remaining[owner] = remaining[owner] - 1;
        }
        else
            variable.push(card);
    }
    const popcount = (value) => { let count = 0; for (; value; value &= value - 1)
        count++; return count; };
    variable.sort((a, b) => popcount(domains[a]) - popcount(domains[b]) || clauses.filter(c => c.cards.includes(b)).length - clauses.filter(c => c.cards.includes(a)).length || a - b);
    const bases = remaining.map(c => c + 1), strides = [];
    let stride = 1, initialCode = 0;
    for (let owner = 0; owner < n; owner++) {
        strides.push(stride);
        initialCode += remaining[owner] * stride;
        stride *= bases[owner];
    }
    const initialEnvelope = envelopeFixed.reduce((mask, set, k) => mask | (set ? 1 << k : 0), 0);
    const compact = clauses.length <= 30, maskBase = compact ? 2 ** clauses.length : 0;
    const convert = (mask) => compact ? Number(mask) : mask;
    const empty = (mask) => mask === 0 || mask === 0n;
    const remove = (mask, satisfied) => typeof mask === "number" ? mask & ~satisfied : mask & ~satisfied;
    const intersects = (mask, other) => typeof mask === "number" ? (mask & other) !== 0 : (mask & other) !== 0n;
    const cover = variable.map(card => Array.from({ length: n + 1 }, (_, owner) => convert(clauses.reduce((mask, clause, k) => clause.owner === owner && clause.cards.includes(card) ? mask | (1n << BigInt(k)) : mask, 0n))));
    const expired = variable.map((_, position) => convert(clauses.reduce((mask, clause, k) => clause.cards.every(c => variable.indexOf(c) < position) ? mask | (1n << BigInt(k)) : mask, 0n)));
    const initialClauses = compact ? 2 ** clauses.length - 1 : (1n << BigInt(clauses.length)) - 1n;
    const key = (state) => typeof state.clauses === "number" ? (state.code * 8 + state.envelope) * maskBase + state.clauses : `${state.code * 8 + state.envelope}:${state.clauses}`;
    const transitions = (position, state) => {
        const card = variable[position], out = [];
        for (let owner = 0; owner <= n; owner++) {
            if ((domains[card] & (1 << owner)) === 0)
                continue;
            if (owner === n) {
                const bit = 1 << category[card];
                if ((state.envelope & bit) === 0)
                    out.push({ owner, next: { code: state.code, envelope: state.envelope | bit, clauses: remove(state.clauses, cover[position][owner]) } });
            }
            else if (Math.floor(state.code / strides[owner]) % bases[owner] > 0) {
                out.push({ owner, next: { code: state.code - strides[owner], envelope: state.envelope, clauses: remove(state.clauses, cover[position][owner]) } });
            }
        }
        return out;
    };
    const memo = Array.from({ length: variable.length }, () => new Map());
    const count = (position, code, envelope, unsatisfied) => {
        if (position === variable.length)
            return code === 0 && envelope === 7 && empty(unsatisfied) ? 1 : 0;
        if (intersects(unsatisfied, expired[position]))
            return 0;
        const stateKey = typeof unsatisfied === "number" ? (code * 8 + envelope) * maskBase + unsatisfied : `${code * 8 + envelope}:${unsatisfied}`;
        const saved = memo[position].get(stateKey);
        if (saved !== undefined)
            return saved;
        let total = 0;
        const card = variable[position];
        for (let owner = 0; owner <= n; owner++) {
            if ((domains[card] & (1 << owner)) === 0)
                continue;
            if (owner === n) {
                const bit = 1 << category[card];
                if ((envelope & bit) === 0)
                    total += count(position + 1, code, envelope | bit, remove(unsatisfied, cover[position][owner]));
            }
            else if (Math.floor(code / strides[owner]) % bases[owner] > 0) {
                total += count(position + 1, code - strides[owner], envelope, remove(unsatisfied, cover[position][owner]));
            }
        }
        memo[position].set(stateKey, total);
        return total;
    };
    const initial = { code: initialCode, envelope: initialEnvelope, clauses: initialClauses };
    const total = count(0, initial.code, initial.envelope, initial.clauses);
    if (total === 0)
        return fail("CONTRADICTION", "No consistent deals");
    // With <=21 cards, <=6 hands, and the complete observer hand fixed, the
    // multinomial upper bound is below 2^53. Every addition here is an exact integer.
    const marginal = names.map(() => Array(n + 1).fill(0));
    for (let card = 0; card < names.length; card++)
        if (ownership[card] >= 0)
            marginal[card][ownership[card]] = total;
    let layer = new Map([[key(initial), { state: initial, ways: 1 }]]);
    for (let position = 0; position < variable.length; position++) {
        const nextLayer = new Map();
        for (const { state, ways } of layer.values()) {
            for (const { owner, next } of transitions(position, state)) {
                const suffix = count(position + 1, next.code, next.envelope, next.clauses);
                if (suffix === 0)
                    continue;
                const card = variable[position];
                marginal[card][owner] = marginal[card][owner] + ways * suffix;
                const nextKey = key(next), saved = nextLayer.get(nextKey);
                if (saved)
                    saved.ways += ways;
                else
                    nextLayer.set(nextKey, { state: next, ways });
            }
        }
        layer = nextLayer;
    }
    const cards = Object.create(null);
    for (let card = 0; card < names.length; card++)
        cards[names[card]] = { envelope: fraction(marginal[card][n], total), hands: marginal[card].slice(0, n).map(value => fraction(value, total)) };
    return { ok: true, totalDeals: BigInt(total), cards };
}
