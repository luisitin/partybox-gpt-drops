import specification from '../data/policy.json' with { type: 'json' };
const terms = specification.terms;
const safe = specification.safe;
const groups = specification.groups;
const machines = terms.map(term => {
    const letters = [...term];
    const positions = Object.create(null);
    letters.forEach((c, index) => { positions[c] = (positions[c] ?? 0) | (1 << index); });
    positions['#'] = (positions['i'] ?? 0) | (positions['l'] ?? 0);
    return { positions, end: 1 << (letters.length - 1) };
});
function bad(text) {
    for (const { positions, end } of machines) {
        let state = 0;
        for (const c of text) {
            state = (state | (state << 1) | 1) & (positions[c] ?? 0);
            if (state & end)
                return true;
        }
    }
    return false;
}
export function reference(input) {
    if (typeof input !== 'string')
        return { ok: false, reason: 'type' };
    let length = 0;
    for (const unused of input) {
        void unused;
        if (++length > 16)
            return { ok: false, reason: 'length' };
    }
    for (const c of input) {
        const n = c.codePointAt(0) ?? 0;
        if (n < 32 || (n >= 127 && n <= 159) || (n >= 0xd800 && n <= 0xdfff) ||
            (n >= 0x202a && n <= 0x202e) || (n >= 0x2066 && n <= 0x2069))
            return { ok: false, reason: 'control' };
    }
    let plain = '';
    for (const c of input.normalize('NFKD').toLowerCase()) {
        if (!/^\p{M}$/u.test(c) && !/^\p{Cf}$/u.test(c))
            plain += c;
    }
    plain = plain.trim();
    let meaningful = false;
    for (const c of plain)
        if (/^[\p{L}\p{N}]$/u.test(c))
            meaningful = true;
    if (!meaningful)
        return { ok: false, reason: 'empty' };
    if (safe.includes(plain))
        return { ok: true };
    const text = [];
    for (const c of plain) {
        let replacement;
        for (const [out, set] of groups)
            if (set?.includes(c)) {
                replacement = out;
                break;
            }
        if (replacement !== undefined)
            text.push(replacement);
        else if (/^[a-z]$/.test(c))
            text.push(c);
        else if (/^[\p{P}\p{S}\p{Z}]$/u.test(c)) { }
        else
            text.push('~');
    }
    return bad(text) || bad([...text].reverse()) ? { ok: false, reason: 'blocked' } : { ok: true };
}
