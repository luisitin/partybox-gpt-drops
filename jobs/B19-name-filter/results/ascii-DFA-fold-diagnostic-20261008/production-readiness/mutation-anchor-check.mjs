import assert from 'node:assert/strict';
import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as candidate from '../../jobs/B19-name-filter/dist/nameFilter.js';
const here = new URL('./', import.meta.url);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const source = readFileSync(new URL('../../jobs/B19-name-filter/nameFilter.ts', here));
const code = readFileSync(new URL('../../jobs/B19-name-filter/dist/nameFilter.js', here), 'utf8');
const metadata = Function(code.replaceAll('export function ', 'function ') + '\nreturn {states: SCAN?.table.length / 27, empty: SCAN?.empty, fallback: SCAN === undefined, folds: [65,90,97,122].map(code => ASCII_FOLD[code])};')();
assert.deepEqual(metadata, {states: 539, empty: false, fallback: false, folds: [0,25,0,25]});
const mutants = [
 ['M01', '.toLowerCase()', '', 'SEX', false],
 ['M15', "c === 'i' || c === 'l'", "c === 'i'", 'c1it', false],
 ['M18', "TERMS.map(term => [...term].reverse().join(''))", '[]', 'Bob', true],
 ['M19', "run.length === 1 ? '+'", "run.length === 1 ? ''", 'seeex', false],
 ['M21', 'SAFE.has(plain)', '[...SAFE].some(s => plain.includes(s))', 'Hancocksex', false],
 ['M25', '`{${run.length},}`', "'+'", 'Bobby', true],
];
const results = [];
for (const [id, from, to, witness, expectedOk] of mutants) {
 assert.equal(code.split(from).length, 2, `${id} anchor unique`);
 const baseline = candidate.nameFilter(witness);
 assert.equal(baseline.ok, expectedOk);
 const changed = code.replace(from, to);
 const mutant = await import('data:text/javascript;base64,' + Buffer.from(changed).toString('base64'));
 let actualAssertionFailure;
 try { assert.deepEqual(mutant.nameFilter(witness), baseline); }
 catch (error) { assert.ok(error instanceof assert.AssertionError); actualAssertionFailure = {name: error.name, code: error.code}; }
 assert.ok(actualAssertionFailure, `${id} must execute and fail actual behavioral truth`);
 results.push({id, witness, baseline, mutated: mutant.nameFilter(witness), mutantSha256: sha(changed), actualAssertionFailure});
}
const result = {kind: 'production-raw-letter-DFA-fold-actual-assertion-controls', closedUtc: new Date().toISOString(), candidateSourceSha256: sha(source), candidateJsSha256: sha(code), table: metadata, cases: mutants.length, passed: results.length, results, acceptanceReplacement: false};
writeFileSync(new URL('mutation-anchor-check.json', here), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result));
