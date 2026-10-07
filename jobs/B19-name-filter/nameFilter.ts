/** B19: bounded, English-policy name moderation. See POLICY.md for collisions.
 * No I/O, clock, randomness, dependencies, or caller-controlled regular expressions.
 * Normalization is a documented subset, NOT full Unicode UTS #39 conformance.
 */
export type NameResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly reason: 'type' | 'length' | 'empty' | 'control' | 'blocked' };

const TERMS = 'anal anus arsehole asshole bastard bitch blowjob bollocks boner boob boobs bukkake chink clit cock coon cunt cum cumshot dick dildo douche dyke ejaculation fag faggot fellatio fuck gook handjob hentai jizz kike masturbate masturbation motherfucker nigga nigger orgasm paedophile pedophile penis porn pussy rape retard rimjob semen sex shemale slut spic spunk testicle tits titties titty tranny twat vagina wank wetback whore'.split(' ');
// Only whole, normally spelled benign words are exceptions. Never substring exceptions.
const SAFE = new Set('adcock advertisement advertisements alana alanna alcock analisa analog analogies analogous analogue analogues analogy analyse analysed analyses analysing analysis analyst analysts analytical analytically analyze analyzed analyzes analyzing annalee annalisa antofagasta arsenal arsene arsenic arsenio assassin assassination assassins assistance assistant assistants association associations atwater aycock babcock badcock bangkok basement bass bassoon benedict boxes branscum breast breastplate breasts breaststroke burdick callanan canal canale canales canals cassandra cassidy cassie cassius chastity chinkapin chinkapins circumcision circumstance circumstances circumvent classic classical classics cockapoo cockatiel cockatiels cockatoo cockatoos cockburn cockcroft cockerel cockerels cockerham cockfield cockle cockles cockney cockneys cockpit cockpits cockrell cockrells cockrill cockroach cockroaches cockrum cocktail cocktails compass compassion constitute constitutes constitution constitutional cooney coonhound coonrod cucumber cucumbers cumana cumberbatch cumberland cumbie cumbria cumming cummings cummins cumulative delana department departmental departments departure dicke dicken dickens dickenson dickerson dickert dickey dickhaut dickie dickinson dickison dickman dickmann dickson document documentary documentation documented documents drapeau draper edick elana endorsement essex explanation fagan fager fagin fagundes fixes flanagan flanary flannagan fosdick gaffney gafford glasscock grass grasshopper gurganus haggins hancock hathcock heacock hickock hitchcock ilana indexes institute institutes institution institutional institutions jepara kiker kokomo linthicum manus marcum marlana massachusetts mcanally mcclanahan mccumber mcmanus middlesex molasses montenegrin montenegrins montenegro much mucha nigel nigella niger nigeria nigerian nigerians niggard niggardly orellana osuna passage passenger passengers passion passionate peacock penistone pitcock preparation prepare prepared preparing raccoon raccoons reddick riddick schmucker schwanke scunthorpe scunthorpes separate separated separately separation sextant sextants sexton sextuple sextuplet sextuplets shepard shepardson sheppard shih shihtzu shiitake shittake shitz skoog slocum snigger sniggered sniggering sniggers spica spicas spice spiced spicer spices spicier spiciest spicing spick spickard spicy spraggins stites stith substitute sussex sussexes swank taxes therapeutic transexual transexuales transsexual tsunami tulsa tzu vacuum vanallen vandyke wessex wilcock wilcox woodcock wrapped yocum'.split(' '));
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
const pattern = (terms: readonly string[]): string => terms.map(term => term.replace(/(.)\1*/g, run => {
  const c = run[0]!;
  // Preserve required repeats: 'boob' needs two o's; never turn 'Bob' into it.
  return (c === 'i' || c === 'l' ? `[${c}#]` : c) + (run.length === 1 ? '+' : `{${run.length},}`);
})).join('|');
const BAD = new RegExp(pattern(TERMS) + '|' + pattern(TERMS.map(term => [...term].reverse().join(''))));
const OK: NameResult = Object.freeze({ ok: true });
const FAILURE = {
  type: Object.freeze({ ok: false, reason: 'type' } as const),
  length: Object.freeze({ ok: false, reason: 'length' } as const),
  empty: Object.freeze({ ok: false, reason: 'empty' } as const),
  control: Object.freeze({ ok: false, reason: 'control' } as const),
  blocked: Object.freeze({ ok: false, reason: 'blocked' } as const),
};

/** Returns a value (never throws for ordinary inputs). 16 Unicode code points,
 * counted BEFORE trimming or normalization; combining marks count individually.
 * Caller must render the original name as text, never as HTML.
 */
export function nameFilter(input: unknown): NameResult {
  if (typeof input !== 'string') return FAILURE.type;
  if (input.length > 32 || (input.length > 16 && [...input].length > 16)) return FAILURE.length;
  // Reject unpaired surrogates, C0/C1 controls, and bidi formatting controls.
  if (/[\u0000-\u001f\u007f-\u009f\ud800-\udfff\u202a-\u202e\u2066-\u2069]/u.test(input))
    return FAILURE.control;
  const ascii = /^[\x20-\x7e]*$/.test(input);
  let plain = (ascii ? input : input.normalize('NFKD')).toLowerCase();
  if (!ascii) plain = plain.replace(/\p{M}/gu, '').replace(/\p{Cf}/gu, '');
  plain = plain.trim();
  if (!(ascii ? /[a-z0-9]/.test(plain) : /[\p{L}\p{N}]/u.test(plain))) return FAILURE.empty;
  if (SAFE.has(plain)) return OK;
  let text = '';
  for (const c of plain) {
    if (c >= 'a' && c <= 'z') { text += c; continue; }
    const mapped = MAP.get(c);
    if (mapped !== undefined) text += mapped;
    else if (c <= '\x7f' || /^[\p{P}\p{S}\p{Z}]$/u.test(c)) continue;
    else text += '~'; // Unmapped letters are barriers, never silently deleted.
  }
  if (BAD.test(text))
    return FAILURE.blocked;
  return OK;
}

export function isAllowedName(input: unknown): boolean { return nameFilter(input).ok; }
