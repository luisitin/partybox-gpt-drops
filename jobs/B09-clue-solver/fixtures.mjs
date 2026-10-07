import { CLASSIC_DECK } from './dist/types.js';

export const reduced = { suspects: ['s0','s1','s2'], weapons: ['w0','w1','w2'], rooms: ['r0','r1','r2','r3'] };
export function rng(seed) {
  let state = seed >>> 0;
  return () => { state ^= state << 13; state ^= state >>> 17; state ^= state << 5; return (state >>> 0) / 4294967296; };
}
const pick = (values, random) => values[Math.floor(random() * values.length)];
export function deal(deck, players, random) {
  const groups = [deck.suspects, deck.weapons, deck.rooms];
  const envelope = groups.map(group => pick(group, random));
  const cards = groups.flat().filter(card => !envelope.includes(card));
  for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
  const hands = Array.from({ length: players }, () => []);
  const dealer = Math.floor(random() * players);
  cards.forEach((card, i) => hands[(dealer + i) % players].push(card));
  const me = Math.floor(random() * players);
  return { deck, envelope, hands, log: { deck, handSizes: hands.map(hand => hand.length), me, ownHand: [...hands[me]], suggestions: [] } };
}
export function suggest(game, random, player = Math.floor(random() * game.hands.length)) {
  const cards = [game.deck.suspects, game.deck.weapons, game.deck.rooms].map(group => pick(group, random));
  let refutedBy = null, shownCard;
  for (let distance = 1; distance < game.hands.length; distance++) {
    const candidate = (player + distance) % game.hands.length;
    const held = cards.filter(card => game.hands[candidate].includes(card));
    if (held.length) { refutedBy = candidate; if (player === game.log.me) shownCard = pick(held, random); break; }
  }
  const observation = { player, cards, refutedBy };
  if (shownCard !== undefined) observation.shownCard = shownCard;
  game.log.suggestions.push(observation);
  return observation;
}
export function randomReduced(random) {
  const game = deal(reduced, 3, random);
  const count = Math.floor(random() * 19);
  for (let i = 0; i < count; i++) suggest(game, random);
  if (random() < .35) {
    game.log.shown = [];
    for (let p = 0; p < 3; p++) for (const card of game.hands[p]) if (p !== game.log.me && random() < .2) game.log.shown.push({ player: p, card });
  }
  return game;
}
export const classic = CLASSIC_DECK;
export function adversarialCases() {
  const base = { deck: reduced, handSizes: [3,2,2], me: 0, ownHand: ['s0','w0','r0'], suggestions: [] };
  const clone = () => structuredClone(base);
  const invalid = [];
  invalid.push(['null input', null]);
  invalid.push(['missing fields', {}]);
  invalid.push(['duplicate own card', { ...clone(), ownHand: ['s0','s0','r0'] }]);
  invalid.push(['short own hand', { ...clone(), ownHand: ['s0'] }]);
  invalid.push(['unknown own card', { ...clone(), ownHand: ['s0','w0','missing'] }]);
  invalid.push(['wrong hand total', { ...clone(), handSizes: [3,3,3] }]);
  invalid.push(['negative hand size', { ...clone(), handSizes: [3,-1,5] }]);
  invalid.push(['fractional hand size', { ...clone(), handSizes: [3,1.5,2.5] }]);
  invalid.push(['too few players', { ...clone(), handSizes: [3,4] }]);
  invalid.push(['too many players', { ...clone(), handSizes: [1,1,1,1,1,1,1], ownHand: ['s0'] }]);
  invalid.push(['invalid observer', { ...clone(), me: 3 }]);
  invalid.push(['fractional observer', { ...clone(), me: .5 }]);
  invalid.push(['duplicate deck name', { ...clone(), deck: { ...reduced, weapons: ['s0','w1','w2'] } }]);
  invalid.push(['empty category', { ...clone(), deck: { ...reduced, rooms: [] } }]);
  invalid.push(['empty card id', { ...clone(), deck: { ...reduced, suspects: ['', 's1','s2'] } }]);
  invalid.push(['unknown shown card', { ...clone(), shown: [{ player: 1, card: 'bad' }] }]);
  invalid.push(['invalid shown owner', { ...clone(), shown: [{ player: 5, card: 's1' }] }]);
  invalid.push(['invalid suggestion player', { ...clone(), suggestions: [{ player: -1, cards: ['s1','w1','r1'], refutedBy: null }] }]);
  invalid.push(['invalid refuter', { ...clone(), suggestions: [{ player: 0, cards: ['s1','w1','r1'], refutedBy: 4 }] }]);
  invalid.push(['self refuter', { ...clone(), suggestions: [{ player: 0, cards: ['s1','w1','r1'], refutedBy: 0 }] }]);
  invalid.push(['wrong card category order', { ...clone(), suggestions: [{ player: 0, cards: ['w1','s1','r1'], refutedBy: 1 }] }]);
  invalid.push(['unknown suggested card', { ...clone(), suggestions: [{ player: 0, cards: ['bad','w1','r1'], refutedBy: 1 }] }]);
  invalid.push(['short suggestion', { ...clone(), suggestions: [{ player: 0, cards: ['s1','w1'], refutedBy: 1 }] }]);
  invalid.push(['shown outside suggestion', { ...clone(), suggestions: [{ player: 0, cards: ['s1','w1','r1'], refutedBy: 1, shownCard: 'r2' }] }]);
  invalid.push(['shown with no refuter', { ...clone(), suggestions: [{ player: 0, cards: ['s1','w1','r1'], refutedBy: null, shownCard: 's1' }] }]);
  const contradiction = [
    ['own card shown elsewhere', { ...clone(), shown: [{ player: 1, card: 's0' }] }],
    ['same card in two hands', { ...clone(), shown: [{ player: 1, card: 's1' }, { player: 2, card: 's1' }] }],
    ['overfull hand', { ...clone(), shown: ['s1','s2','w1'].map(card => ({ player: 1, card })) }],
    ['refuter known to have none', { ...clone(), suggestions: [{ player: 1, cards: ['s0','w0','r0'], refutedBy: 2 }] }],
    ['own hand denied', { ...clone(), suggestions: [{ player: 1, cards: ['s0','w0','r0'], refutedBy: null }] }],
    ['intervening owner denied', { ...clone(), shown: [{ player: 1, card: 's1' }], suggestions: [{ player: 0, cards: ['s1','w1','r1'], refutedBy: 2 }] }],
    ['envelope has two suspects', { ...clone(), suggestions: [{ player: 0, cards: ['s1','w1','r1'], refutedBy: null }, { player: 0, cards: ['s2','w1','r1'], refutedBy: null }] }],
    ['conflicting revealed suggestion', { ...clone(), suggestions: [{ player: 0, cards: ['s1','w1','r1'], refutedBy: 1, shownCard: 's1' }, { player: 1, cards: ['s1','w1','r1'], refutedBy: 2, shownCard: 's1' }] }],
  ];
  return { base, invalid, contradiction };
}
