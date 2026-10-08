const TERMS = 'anal anus arsehole asshole bastard bitch blowjob bollocks boner boob boobs bukkake chink clit cock coon cunt cum cumshot dick dildo douche dyke ejaculation fag faggot fellatio fuck gook handjob hentai jizz kike masturbate masturbation motherfucker nigga nigger orgasm paedophile pedophile penis porn pussy rape retard rimjob semen sex shemale slut spic spunk testicle tits titties titty tranny twat vagina wank wetback whore'.split(' ');
const SAFE = new Set('adcock advertisement advertisements alana alanna alcock analisa analog analogies analogous analogue analogues analogy analyse analysed analyses analysing analysis analyst analysts analytical analytically analyze analyzed analyzes analyzing annalee annalisa antofagasta arsenal arsene arsenic arsenio assassin assassination assassins assistance assistant assistants association associations atwater aycock babcock badcock bangkok basement bass bassoon benedict boxes branscum breast breastplate breasts breaststroke burdick callanan canal canale canales canals cassandra cassidy cassie cassius chastity chinkapin chinkapins circumcision circumstance circumstances circumvent classic classical classics cockapoo cockatiel cockatiels cockatoo cockatoos cockburn cockcroft cockerel cockerels cockerham cockfield cockle cockles cockney cockneys cockpit cockpits cockrell cockrells cockrill cockroach cockroaches cockrum cocktail cocktails compass compassion constitute constitutes constitution constitutional cooney coonhound coonrod cucumber cucumbers cumana cumberbatch cumberland cumbie cumbria cumming cummings cummins cumulative delana department departmental departments departure dicke dicken dickens dickenson dickerson dickert dickey dickhaut dickie dickinson dickison dickman dickmann dickson document documentary documentation documented documents drapeau draper edick elana endorsement essex explanation fagan fager fagin fagundes fixes flanagan flanary flannagan fosdick gaffney gafford glasscock grass grasshopper gurganus haggins hancock hathcock heacock hickock hitchcock ilana indexes institute institutes institution institutional institutions jepara kiker kokomo linthicum manus marcum marlana massachusetts mcanally mcclanahan mccumber mcmanus middlesex molasses montenegrin montenegrins montenegro much mucha nigel nigella niger nigeria nigerian nigerians niggard niggardly orellana osuna passage passenger passengers passion passionate peacock penistone pitcock preparation prepare prepared preparing raccoon raccoons reddick riddick schmucker schwanke scunthorpe scunthorpes separate separated separately separation sextant sextants sexton sextuple sextuplet sextuplets shepard shepardson sheppard shih shihtzu shiitake shittake shitz skoog slocum snigger sniggered sniggering sniggers spica spicas spice spiced spicer spices spicier spiciest spicing spick spickard spicy spraggins stites stith substitute sussex sussexes swank taxes therapeutic transexual transexuales transsexual tsunami tulsa tzu vacuum vanallen vandyke wessex wilcock wilcox woodcock wrapped yocum'.split(' '));
const GROUPS = [
    ['a', '4@аɑα'], ['b', '8ЬьƄƅвβ'], ['c', 'сϲς'], ['d', 'ԁժ'],
    ['e', '3еεϵ℮'], ['f', 'ғϝ'], ['g', '69ɡց'], ['h', 'һнη'],
    ['i', '!іιӏ'], ['j', 'јϳ'], ['k', 'κк'], ['l', 'ⅼℓ'],
    ['m', 'мṃ'], ['n', 'ոп'], ['o', '0оοσօ'], ['p', 'рρ'],
    ['q', 'ԛ'], ['r', 'гᴦ'], ['s', '5$ѕʂ'], ['t', '7+тτ'],
    ['u', 'υս'], ['v', 'νѵ'], ['w', 'ԝω'], ['x', 'хχ'],
    ['y', 'уγ'], ['z', '2ᴢ'], ['#', '1|'],
];
const MAP = new Map();
for (const [to, from] of GROUPS)
    for (const char of from)
        MAP.set(char, to);
const pattern = (terms) => terms.map(term => term.replace(/(.)\1*/g, run => {
    const c = run[0];
    return (c === 'i' || c === 'l' ? `[${c}#]` : c) + (run.length === 1 ? '+' : `{${run.length},}`);
})).join('|');
const REVERSED = TERMS.map(term => [...term].reverse().join(''));
const BAD = new RegExp(pattern(TERMS) + '|' + pattern(REVERSED));
const BY_LENGTH = Array.from({ length: Math.max(...TERMS.map(term => term.length)) }, (_, length) => {
    const eligible = [...TERMS, ...REVERSED].filter(term => term.length <= length);
    return eligible.length ? new RegExp(pattern(eligible)) : /(?!)/;
});
const CONTROLS = /[\u0000-\u001f\u007f-\u009f\ud800-\udfff\u202a-\u202e\u2066-\u2069]/u;
const ASCII = /^[\x20-\x7e]*$/;
const SIMPLE_ASCII = /^[A-Za-z]+$/;
const WORD = /^[a-z]+$/;
const ASCII_CONTENT = /[a-z0-9]/;
const CONTENT = /[\p{L}\p{N}]/u;
const MARKS = /\p{M}/gu;
const FORMATS = /\p{Cf}/gu;
const SEPARATOR = /^[\p{P}\p{S}\p{Z}]$/u;
const lower = (value) => value.toLowerCase();
const normalize = (value) => value.normalize('NFKD');
const clean = (value) => value.replace(MARKS, '').replace(FORMATS, '');
const KNOWN = (() => {
    const candidates = new Set([...'\u00ad\u034f\u061c\u180e\u200b\u200c\u200d\u200e\u200f\u2060\u2061\u2062\u2063\u2064\ufeff']);
    for (let code = 0x00c0; code <= 0x00ff; code++)
        candidates.add(String.fromCharCode(code));
    for (let code = 0xff01; code <= 0xff5e; code++)
        candidates.add(String.fromCharCode(code));
    for (const [, group] of GROUPS)
        for (const character of group) {
            candidates.add(character);
            candidates.add(lower(character));
            candidates.add(character.toUpperCase());
        }
    const table = new Map();
    for (const character of candidates) {
        const decomposed = normalize(character);
        if ([...decomposed].some(value => /[\p{M}\p{Cf}]/u.test(value) && !/\p{Case_Ignorable}/u.test(value)))
            continue;
        const plain = clean(decomposed), folded = lower(plain);
        let mapped = '';
        for (const value of folded) {
            mapped += value >= 'a' && value <= 'z' ? value
                : MAP.get(value) ?? (value <= '\x7f' || SEPARATOR.test(value) ? '' : '~');
        }
        table.set(character, Object.freeze({ plain, mapped, meaningful: CONTENT.test(folded) }));
    }
    return table;
})();
function knownPlain(input) {
    let plain = '';
    for (const character of input) {
        if (character <= '\x7f') {
            plain += character;
            continue;
        }
        const entry = KNOWN.get(character);
        if (entry === undefined)
            return undefined;
        plain += entry.plain;
    }
    return plain;
}
function hasContent(plain) {
    for (const character of plain) {
        if ((character >= 'a' && character <= 'z') || (character >= '0' && character <= '9'))
            return true;
        const entry = KNOWN.get(character);
        if (entry === undefined ? CONTENT.test(character) : entry.meaningful)
            return true;
    }
    return false;
}
const OK = Object.freeze({ ok: true });
const FAILURE = {
    type: Object.freeze({ ok: false, reason: 'type' }),
    length: Object.freeze({ ok: false, reason: 'length' }),
    empty: Object.freeze({ ok: false, reason: 'empty' }),
    control: Object.freeze({ ok: false, reason: 'control' }),
    blocked: Object.freeze({ ok: false, reason: 'blocked' }),
};
export function nameFilter(input) {
    if (typeof input !== 'string')
        return FAILURE.type;
    if (input.length > 32 || (input.length > 16 && [...input].length > 16))
        return FAILURE.length;
    const wordKind = asciiWordKind(input); const simple = wordKind !== 0;
    if (!simple && CONTROLS.test(input))
        return FAILURE.control;
    const ascii = simple || ASCII.test(input);
    const known = ascii ? undefined : knownPlain(input);
    let plain = ascii ? (wordKind === 1 ? input : lower(input)) : known === undefined ? clean(lower(normalize(input))) : lower(known);
    if (!simple) {
        plain = plain.trim();
        if (!(ascii ? ASCII_CONTENT.test(plain) : hasContent(plain)))
            return FAILURE.empty;
    }
    if (SAFE.has(plain))
        return OK;
    let text = plain;
    if (!simple && !WORD.test(plain)) {
        text = '';
        for (const c of plain) {
            if (c >= 'a' && c <= 'z') {
                text += c;
                continue;
            }
            const mapped = MAP.get(c);
            if (mapped !== undefined)
                text += mapped;
            else if (c <= '\x7f' || KNOWN.get(c)?.mapped === '' || SEPARATOR.test(c))
                continue;
            else
                text += '~';
        }
    }
    if ((BY_LENGTH[text.length] ?? BAD).test(text))
        return FAILURE.blocked;
    return OK;
}
export function isAllowedName(input) { return nameFilter(input).ok; }

function asciiWordKind(input) { if(input.length===0)return 0; let kind=1; for(let i=0;i<input.length;i++){const code=input.charCodeAt(i);if(code>=97&&code<=122)continue;if(code>=65&&code<=90){kind=2;continue;}return 0;}return kind;}
