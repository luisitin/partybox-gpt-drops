import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { createReference } from './reference.mjs';

// Only the authorized public policy snapshot supplies external selfcheck data.
const policy = JSON.parse(readFileSync(new URL('./policy.json', import.meta.url), 'utf8'));
const api = createReference(policy);
const counts = Object.create(null);

function expect(category, input, reason = undefined) {
  const actual = api.nameFilter(input);
  assert.equal(Object.isFrozen(actual), true, `${category}: result is frozen`);
  assert.equal(actual.ok, reason === undefined, `${category}: ${JSON.stringify(input)}`);
  assert.equal(actual.reason, reason, `${category}: reason for ${JSON.stringify(input)}`);
  assert.equal(api.isAllowedName(input), reason === undefined, `${category}: boolean agreement`);
  const suggestions = {
    type: 'use-text', length: 'shorten', control: 'remove-characters',
    empty: 'add-letters', blocked: 'choose-another',
  };
  assert.equal(actual.suggestion, reason === undefined ? undefined : suggestions[reason]);
  counts[category] = (counts[category] ?? 0) + 1;
}

assert.equal(Object.isFrozen(api), true);
assert.equal(Object.isFrozen(api.nameFilter), true);
assert.equal(Object.isFrozen(api.isAllowedName), true);

for (const input of [undefined, null, 0, 1n, true, false, {}, [], new String('John'), Symbol('John')]) {
  const result = api.nameFilter(input);
  assert.deepEqual(result, { ok: false, reason: 'type', suggestion: 'use-text' });
  assert.equal(Object.isFrozen(result), true);
  assert.equal(api.isAllowedName(input), false);
  counts['non-string'] = (counts['non-string'] ?? 0) + 1;
}

for (const input of ['a'.repeat(17), ' ' + 'a'.repeat(16), 'a'.repeat(16) + ' ', '\0' + 'a'.repeat(16), '😀'.repeat(16) + 'a']) {
  expect('raw-length-precedence', input, 'length');
}
expect('unicode-codepoint-length', '😀'.repeat(15) + 'a');
expect('unicode-codepoint-length', 'a'.repeat(16));
expect('unicode-codepoint-length', '😀'.repeat(16), 'empty');
expect('unicode-codepoint-length', 'ﬄ'.repeat(16));
expect('valid-surrogate-pair', 'a\ud83d\ude00');

for (let scalar = 0; scalar <= 0x9f; scalar += 1) {
  if (scalar <= 0x1f || scalar >= 0x7f) {
    expect('C0-C1-and-DEL', 'a' + String.fromCodePoint(scalar), 'control');
  }
}
for (let scalar = 0xd800; scalar <= 0xdfff; scalar += 1) {
  expect('all-lone-surrogates', 'a' + String.fromCodePoint(scalar), 'control');
}
for (const scalar of [0x061c, 0x200e, 0x200f, 0x202a, 0x202b, 0x202c, 0x202d, 0x202e, 0x2066, 0x2067, 0x2068, 0x2069]) {
  expect('bidi-controls', 'a' + String.fromCodePoint(scalar), 'control');
}

for (const input of ['', '   ', '!!!', '😀', '\u0301', '\u09be', '\u20dd', '\u200d', '\u034f', '\ue000', '!|+']) {
  expect('letter-number-required', input, 'empty');
}
for (const input of ['1', '٤', '漢', '\u2160', 'John']) expect('letter-number-present', input);
for (const input of ['fu\u0301ck', 'fu\u09beck', 'fu\u20ddck', 'fu\u200dck', 'fu\u2060ck']) {
  expect('mark-and-format-removal', input, 'blocked');
}
expect('whole-string-contextual-lowercase', 'SPIΣ', 'blocked');
expect('whole-string-contextual-lowercase', 'BΣΣB', 'blocked');
expect('compatibility-before-matching', 'ＦＵＣＫ', 'blocked');
expect('compatibility-before-exception', 'Ｓｃｕｎｔｈｏｒｐｅ');
expect('compatibility-before-exception', 'ℌancock');
expect('accent-before-exception', 'Analía');

for (const term of policy.terms) {
  expect('every-public-term-forward', term, 'blocked');
  expect('every-public-term-reversed', Array.from(term).reverse().join(''), 'blocked');
  expect('every-public-term-uppercase', term.toUpperCase(), 'blocked');
  expect('every-public-term-fullwidth', Array.from(term, c => String.fromCodePoint(c.codePointAt(0) + 0xfee0)).join(''), 'blocked');
  if (Array.from(term).length < 16) {
    const middle = Math.floor(term.length / 2);
    expect('one-extra-repeat-per-public-term', term.slice(0, middle) + term[middle] + term.slice(middle), 'blocked');
  }
  if (2 * term.length - 1 <= 16) {
    expect('punctuated-public-terms', Array.from(term).join('.'), 'blocked');
    expect('spaced-public-terms', Array.from(term).join(' '), 'blocked');
  }
  expect('public-terms-with-affixes', 'x' + term + 'z', 'blocked');
}

for (const spelling of policy.safe) {
  const size = Array.from(spelling).length;
  expect('every-public-exact-exception', spelling, size > 16 ? 'length' : undefined);
  expect('uppercase-exact-exceptions', spelling.toUpperCase(), size > 16 ? 'length' : undefined);
  expect('fullwidth-exact-exceptions', Array.from(spelling, c => String.fromCodePoint(c.codePointAt(0) + 0xfee0)).join(''), size > 16 ? 'length' : undefined);
  if (size < 16) expect('accented-exact-exceptions', spelling[0] + '\u0301' + spelling.slice(1));
  if (size <= 14) expect('trimmed-exact-exceptions', ' ' + spelling + ' ');
  if (size <= 13) {
    expect('exceptions-do-not-bypass-suffix', spelling + 'sex', 'blocked');
    expect('exceptions-do-not-bypass-prefix', 'sex' + spelling, 'blocked');
  }
}
for (const input of ['4nalise', 'anal1se', 'h@ncock', 'Sсunthorpe', 'Scun.thorpe', 'Han cock', 'Hancocksex']) {
  expect('exceptions-before-alias-and-only-whole', input, 'blocked');
}
for (const input of ['Lana', 'Dick', 'Bonner', 'Coon', 'Stitt', 'Dyke', 'Boner', 'Dicks', 'Coons', 'Dykes', 'Raper']) {
  expect('public-kept-conflicts', input, 'blocked');
}
for (const input of ['Puta', 'Pendejo', 'Joder', 'Maricón', 'Coño']) expect('public-English-scope', input);

for (const input of ['4n4l', 'b1tch', 'cl1t', 'p3n1s', '5ex', '$ex', 'w@nk', '8oob', '9ook', '6ook', 'ji22', '+i+s', 'h3n+@i', 'b00b', 'shem@1e', 'fυсκ', 'сοсκ', 'ϲоϲκ', 'jιzz']) {
  expect('declared-alias-examples', input, 'blocked');
}
for (const input of ['d11do', 'c11t', 'c|1t', 'c|||t', 'b|tch', 'c1it', 'cl|t']) {
  expect('ambiguous-i-or-l-assignment', input, 'blocked');
}
expect('insufficient-ambiguous-token-count', 'c1t');
for (const input of ['Bob', 'Bobby', 'Bobbi', 'b0b', 'bo.b', 'bukake']) expect('original-run-multiplicity', input);
for (const input of ['BBBooobbbb', 'b00b', 'b.o.o.b', 'bukkake', 'buuukkkaakke']) {
  expect('additional-run-multiplicity', input, 'blocked');
}
for (const input of ['f.u-c_k', 'f😀uck', 'f\u00a0uck', 'f\u2028uck', 'f/uck']) {
  expect('ignored-punctuation-symbol-separator', input, 'blocked');
}
for (const input of ['f+uck', 'f$uck', 'f@uck']) expect('alias-priority-over-ignoring', input);
for (const input of ['fu漢ck', 'fu٤ck', 'fაuck', 'fu\ue000ck', 'fu\u0378ck', 'fu\uffffck']) {
  expect('unknown-categories-are-barriers', input);
}
expect('barrier-does-not-hide-later-substring', 'fu\ue000cksex', 'blocked');
expect('barrier-does-not-hide-earlier-substring', 'sex\ue000fuck', 'blocked');

// The API snapshots policy arrays: later caller mutation cannot change behavior.
const mutable = JSON.parse(JSON.stringify(policy));
const snapshotted = createReference(mutable);
mutable.terms.length = 0;
mutable.safe.push('fuck');
mutable.groups.length = 0;
assert.equal(snapshotted.nameFilter('fuck').reason, 'blocked');
assert.equal(snapshotted.nameFilter('4n4l').reason, 'blocked');
assert.equal(snapshotted.nameFilter('Scunthorpe').ok, true);
counts['policy-snapshot'] = 3;

const report = {
  scope: 'Independent finite, untimed selfchecks authored from public contract and policy only; no benchmark or full B19 acceptance claim.',
  public_terms: policy.terms.length,
  public_exact_exceptions: policy.safe.length,
  case_count: Object.values(counts).reduce((sum, count) => sum + count, 0),
  cases_by_category: counts,
  failures: 0,
  closure: 'The process reached this report after every assertion completed; no retries, timing threshold, hidden cases, external corpus, or other author tests were used.',
};
writeFileSync(new URL('./selfcheck-report.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
