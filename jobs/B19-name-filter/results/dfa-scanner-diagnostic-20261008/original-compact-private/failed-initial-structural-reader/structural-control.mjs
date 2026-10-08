import assert from 'node:assert/strict';
import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import ts from '../../jobs/B19-name-filter/node_modules/typescript/lib/typescript.js';
import * as candidate from './compiled/candidate-nameFilter.js';
const here = new URL('./', import.meta.url);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const tokens = source => {
 const scanner = ts.createScanner(ts.ScriptTarget.ES2022, true, ts.LanguageVariant.Standard, source);
 const result = [];
 for (let kind = scanner.scan(); kind !== ts.SyntaxKind.EndOfFileToken; kind = scanner.scan()) result.push([kind, scanner.getTokenText()]);
 return result;
};
const compact = readFileSync(new URL('candidate-nameFilter.ts', here), 'utf8');
const original = readFileSync(new URL('../B19-dfa-candidate/candidate-nameFilter.ts', here), 'utf8');
assert.deepEqual(tokens(compact), tokens(original));
const code = readFileSync(new URL('compiled/candidate-nameFilter.js', here), 'utf8');
const metadata = Function(code.replaceAll('export function ', 'function ') + '\nreturn {states: SCAN?.table.length / 27, empty: SCAN?.empty, fallback: SCAN === undefined};')();
assert.equal(metadata.fallback, false);
assert.equal(metadata.empty, false);
assert.ok(metadata.states > 0 && metadata.states <= 4096);
const mutants = [
 ['M15', "c === 'i' || c === 'l'", "c === 'i'", 'c1it', false],
 ['M19', "run.length === 1 ? '+'", "run.length === 1 ? ''", 'seeex', false],
 ['M25', '`{${run.length},}`', "'+'", 'Bobby', true],
];
const results = [];
for (const [id, from, to, witness, expectedOk] of mutants) {
 assert.equal(code.split(from).length, 2);
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
const result = {kind: 'private-DFA-token-table-and-real-assertion-controls', closedUtc: new Date().toISOString(), candidateSourceSha256: sha(compact), candidateJsSha256: sha(code), semanticTokensEqual: true, tokens: tokens(compact).length, table: metadata, cases: 3, passed: results.length, results, acceptanceReplacement: false};
writeFileSync(new URL('structural-control.json', here), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result));
