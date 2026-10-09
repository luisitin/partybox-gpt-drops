import assert from 'node:assert/strict';
import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as candidate from './compiled/candidate-nameFilter.js';
const here = new URL('./', import.meta.url);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const source = readFileSync(new URL('candidate-nameFilter.ts', here));
const code = readFileSync(new URL('compiled/candidate-nameFilter.js', here), 'utf8');
const metadata = Function(code.replaceAll('export function ', 'function ') + '\nreturn {states: SCAN?.table.length / 27, empty: SCAN?.empty, fallback: SCAN === undefined, folds: [65,90,97,122].map(code => ASCII_FOLD[code])};')();
assert.deepEqual(metadata, {states: 539, empty: false, fallback: false, folds: [0,25,0,25]});
const originalCode = readFileSync(new URL('baseline-loaded/dist/nameFilter.js', here), 'utf8');
const originalSimple = Function(originalCode.replaceAll('export function ', 'function ') + '\nreturn SIMPLE_ASCII;')();
const actualFold = Function(code.replaceAll('export function ', 'function ') + '\nreturn ASCII_FOLD;')();
let classified = 0;
for (let unit = 0; unit <= 0xffff; unit++) {
 assert.equal(actualFold[unit] < 26, originalSimple.test(String.fromCharCode(unit)), `original ASCII-letter classification at code unit ${unit}`);
 classified++;
}
assert.equal(classified, 65536);
const mutants = [
 ['M01', '.toLowerCase()', '', 'SEX', false],
 ['M15', "c === 'i' || c === 'l'", "c === 'i'", 'c1it', false],
 ['M18', "TERMS.map(term => [...term].reverse().join(''))", '[]', 'Bob', true],
 ['M19', "run.length === 1 ? '+'", "run.length === 1 ? ''", 'seeex', false],
 ['M21', 'SAFE.has(plain)', '[...SAFE].some(s => plain.includes(s))', 'Hancocksex', false],
 ['M25', '`{${run.length},}`', "'+'", 'Bobby', true],
 ['M22', '[...input].length > 16', '[...input].length > 17', 'a'.repeat(17), false],
 ['M23', '[...input].length > 16', '[...input].length >= 16', '𐐨'.repeat(16), true],
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
const result = {kind: 'private-fold-column-DFA-actual-assertion-controls', closedUtc: new Date().toISOString(), candidateSourceSha256: sha(source), candidateJsSha256: sha(code), table: metadata, classificationInvariant: {cases: classified, passed: classified, originalBaselineJsSha256: sha(Buffer.from(originalCode)), originalSimpleRegExp: originalSimple.source, foldTableLength: actualFold.length}, cases: mutants.length, passed: results.length, results, acceptanceReplacement: false};
writeFileSync(new URL('structural-control.json', here), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result));
