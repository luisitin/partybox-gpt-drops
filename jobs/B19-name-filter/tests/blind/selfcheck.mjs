import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { createReference } from './reference.mjs';

const policy = JSON.parse(readFileSync('/workspace/job-B19/jobs/B19-name-filter/data/policy.json', 'utf8'));
const reference = createReference(policy);
let checks = 0;
let blockedWordChecks = 0;
let safeWordChecks = 0;
function check(input, expected) {
  ++checks;
  const actual = reference.nameFilter(input);
  assert.deepEqual(actual, expected, JSON.stringify(input));
  assert.equal(reference.isAllowedName(input), expected.ok);
  assert.ok(Object.isFrozen(actual));
}
const yes = { ok: true };
const no = reason => ({ ok: false, reason });
for (const word of policy.terms) {
  for (const form of [word, word.toUpperCase(), [...word].reverse().join(''),
    word[0] + word, `x${word}x`]) {
    check(form, no([...form].length > 16 ? 'length' : 'blocked'));
    ++blockedWordChecks;
  }
  const separated = [...word].join('.');
  check(separated, no([...separated].length > 16 ? 'length' : 'blocked'));
  ++blockedWordChecks;
}
for (const word of policy.safe) {
  for (const form of [word, word.toUpperCase()]) {
    check(form, yes);
    ++safeWordChecks;
  }
}
for (const value of [null, undefined, 0, true, {}, [], new String('Bob')]) check(value, no('type'));
check('abcdefghijklmnopq', no('length'));
check('abcdefghijklmnop\u0000', no('length'));
for (const value of ['Bob\u0000', 'Bob\u0085', 'f\ud800uck', 'f\udc00uck',
  'Bob\u202a', 'Bob\u2069']) check(value, no('control'));
for (const value of ['', '   ', '...', '!!!', '😀', '\u0301\u0300']) check(value, no('empty'));
for (const value of ['Bob', 'Boob', 'booooob', 'bοοb', 'fu.ck', 'f u c k',
  'f😀uck', 'f\u00aduck', 'c|1t', 'd1ck', 'ana1', '5cunthorpe', 'scunthorpe!',
  'xscunthorpe']) {
  check(value, value === 'Bob' ? yes : no('blocked'));
}
for (const value of ['Scunthorpe', 'Ｓcúnthórpe', ' bOB ', 'bθθb', 'fu٢ck',
  '1', '123', '中国', '😀Bob']) check(value, yes);
const result = { policyTerms: policy.terms.length, policySafe: policy.safe.length,
  blockedWordChecks, safeWordChecks, checks, status: 'passed' };
writeFileSync('SELFCHECK.json', JSON.stringify(result, null, 2) + '\n');
process.stdout.write(JSON.stringify(result) + '\n');
