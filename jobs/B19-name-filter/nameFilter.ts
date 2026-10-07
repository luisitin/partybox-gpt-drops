/** B19: bounded, English-policy name moderation. See POLICY.md for collisions.
 * No I/O, clock, randomness, dependencies, or caller-controlled regular expressions.
 * Normalization is a documented subset, NOT full Unicode UTS #39 conformance.
 */
export type NameResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly reason: 'type' | 'length' | 'empty' | 'control' | 'blocked' };

const TERMS = 'anal anus arsehole asshole bastard bitch blowjob bollocks boner boob boobs bukkake chink clit cock coon cunt cum cumshot dick dildo douche dyke ejaculation fag faggot fellatio fuck gook handjob hentai jizz kike masturbate masturbation motherfucker nigga nigger orgasm paedophile pedophile penis porn pussy rape retard rimjob semen sex shemale slut spic spunk testicle tits titties titty tranny tranny twat vagina wank wetback whore'.split(' ');
// Only whole, normally spelled benign words are exceptions. Never substring exceptions.
const SAFE = new Set('scunthorpe penistone cockburn cockcroft cockrell cockrells cockfield cockrill hancock hitchcock peacock woodcock wilcock wilcox alcock badcock babcock adcock hickock dickens dickenson dickerson dickinson dickson dickie dickey dickman dickmann dickhaut benedict cummings cummins cumming cumberland cumbria cumulative document documents documentation cucumber cucumbers circumcision circumstance circumstances circumvent scunthorpes sussex essex middlesex wessex sussexes sexton sextant sextants sextuple sextuplet sextuplets canal canals analysis analyses analyst analysts analytical analytically analyze analyzes analyzed analyzing analyse analysed analysing analogy analogies analogous analog analogue analogues analogy bangkok kokomo shitz shih tzu shihtzu shiitake shittake nigel nigella nigeria niger nigerian nigerians montenegro montenegrin montenegrins niggard niggardly snigger sniggers sniggered sniggering chinkapin chinkapins coonhound raccoon raccoons spica spicas spicy spicier spiciest spice spiced spices spicing spick spickard arsenal arsenic arsenal arsene arsenio classic classics classical assistant assistants assistance association associations passage passenger passengers compass compassion passion passionate bass bassoon assassin assassins assassination cassandra cassidy cassie cassius massachusetts molasses grass grasshopper breast breasts breaststroke breastplate cocktail cocktails cockatoo cockatoos cockatiel cockatiels cockroach cockroaches cockpit cockpits cockle cockles cockney cockneys cockerel cockerels cockapoo'.split(' '));
// Auditable single-code-point mappings; NFKD handles fullwidth/math letters/accents.
const GROUPS: ReadonlyArray<readonly [string, string]> = [
  ['a', '4@аɑα'], ['b', '8ЬьƄƅвβ'], ['c', 'сϲς'], ['d', 'ԁժ'],
  ['e', '3еεϵ℮'], ['f', 'ғϝ'], ['g', '69ɡց'], ['h', 'һнη'],
  ['i', '!іιӏ'], ['j', 'јϳ'], ['k', 'κк'], ['l', 'ⅼℓ'],
  ['m', 'мṃ'], ['n', 'ոп'], ['o', '0оοσօ'], ['p', 'рρ'],
  ['q', 'ԛ'], ['r', 'гᴦ'], ['s', '5$ѕʂ'], ['t', '7+тτ'],
  ['u', 'υս'], ['v', 'νѵ'], ['w', 'ԝω'], ['x', 'хχ'],
  ['y', 'уγ'], ['z', '2ᴢ'], ['#', '1|'],
];
const MAP = new Map<string, string>();
for (const [to, from] of GROUPS) for (const char of from) MAP.set(char, to);
const pattern = TERMS.map(term => term.replace(/(.)\1*/g, run => {
  const c = run[0]!;
  // Preserve required repeats: 'boob' needs two o's; never turn 'Bob' into it.
  return (c === 'i' || c === 'l' ? `[${c}#]` : c) + (run.length === 1 ? '+' : `{${run.length},}`);
})).join('|');
const BAD = new RegExp(pattern); // No g/y: .test has no state.

/** Returns a value (never throws for ordinary inputs). 16 Unicode code points,
 * counted BEFORE trimming or normalization; combining marks count individually.
 * Caller must render the original name as text, never as HTML.
 */
export function nameFilter(input: unknown): NameResult {
  if (typeof input !== 'string') return { ok: false, reason: 'type' };
  if (input.length > 32 || [...input].length > 16) return { ok: false, reason: 'length' };
  // Reject unpaired surrogates, C0/C1 controls, and bidi formatting controls.
  if (/[\u0000-\u001f\u007f-\u009f\ud800-\udfff\u202a-\u202e\u2066-\u2069]/u.test(input))
    return { ok: false, reason: 'control' };
  const plain = input.normalize('NFKD').toLowerCase().replace(/\p{M}/gu, '').replace(/\p{Cf}/gu, '').trim();
  if (!/[\p{L}\p{N}]/u.test(plain)) return { ok: false, reason: 'empty' };
  if (SAFE.has(plain)) return { ok: true };
  let text = '';
  for (const c of plain) {
    const mapped = MAP.get(c);
    if (mapped !== undefined) text += mapped;
    else if (c >= 'a' && c <= 'z') text += c;
    else if (/^[\p{P}\p{S}\p{Z}]$/u.test(c)) continue;
    else text += '~'; // Unmapped letters are barriers, never silently deleted.
  }
  if (BAD.test(text) || BAD.test([...text].reverse().join('')))
    return { ok: false, reason: 'blocked' };
  return { ok: true };
}

export function isAllowedName(input: unknown): boolean { return nameFilter(input).ok; }
