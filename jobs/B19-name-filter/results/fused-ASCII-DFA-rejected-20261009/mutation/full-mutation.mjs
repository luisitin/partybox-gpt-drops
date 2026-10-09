import assert from 'node:assert/strict';
import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as candidate from '../B19-fused-ASCII-DFA-candidate/compiled/candidate-nameFilter.js';
import {reference} from '../../jobs/B19-name-filter/dist/tests/reference.js';
import {createReference} from '../../jobs/B19-name-filter/tests/blind/reference.mjs';
import {makeObfuscations, makeFuzz, fixed, mappingCases, mutations} from './original-declarations.mjs';
const here = new URL('./', import.meta.url), job = new URL('../../jobs/B19-name-filter/', import.meta.url), privateJob = new URL('../B19-fused-ASCII-DFA-candidate/', import.meta.url);
const sha = bytes => createHash('sha256').update(bytes).digest('hex'), read = path => readFileSync(path, 'utf8');
const equivalence = JSON.parse(read(new URL('equivalence-latest.json', privateJob)));
assert.ok(equivalence.passed && equivalence.cases === 214308);
const paths = Object.fromEntries(Object.keys(equivalence.sourceEnd).map(key => [key, new URL(key.slice(key.indexOf('/') + 1), key.startsWith('job/') ? job : privateJob)]));
paths['control/full-mutation.mjs'] = new URL('full-mutation.mjs', here);
paths['control/original-declarations.mjs'] = new URL('original-declarations.mjs', here);
const guards = () => Object.fromEntries(Object.entries(paths).map(([name, path]) => [name, sha(readFileSync(path))]));
const sourceStart = guards();
for (const [key, hash] of Object.entries(equivalence.sourceEnd)) assert.equal(sourceStart[key], hash);
const corpora = ['names', 'words', 'places'].flatMap(name => JSON.parse(read(new URL(`data/cache/${name}.json`, job))).map(row => ({input: row.name})));
const rows = [...fixed, ...mappingCases, ...makeObfuscations(1).rows, ...makeFuzz(1), ...corpora];
assert.equal(rows.length, 43830);
const label = result => result.ok ? 'ok' : result.reason;
const independent = createReference(JSON.parse(read(new URL('data/policy.json', job))));
const truth = rows.map(row => {
 const sealed = label(independent.nameFilter(row.input));
 assert.equal(label(candidate.nameFilter(row.input)), sealed);
 assert.equal(label(reference(row.input)), sealed);
 if (row.expected !== undefined) assert.equal(sealed, row.expected);
 return sealed;
});
const code = read(new URL('compiled/candidate-nameFilter.js', privateJob));
const startedUtc = new Date().toISOString();
writeFileSync(new URL('START.json', here), JSON.stringify({startedUtc, sourceStart, candidateSourceSha256: equivalence.candidateSourceSha256, candidateJsSha256: sha(code), seed: 1, baselineTruthCases: rows.length}, null, 2) + '\n');
console.log(JSON.stringify({event: 'START', startedUtc, seed: 1, baselineTruthCases: rows.length}));
const results = [];
for (const [id, description, from, to] of mutations) {
 assert.equal(code.split(from).length, 2, `${id} anchor unique`);
 const changed = code.replace(from, to);
 const mutant = await import('data:text/javascript;base64,' + Buffer.from(changed).toString('base64'));
 let disagreements = 0, witness = null;
 for (let index = 0; index < rows.length; index++) {
  const actual = label(mutant.nameFilter(rows[index].input));
  if (actual !== truth[index]) { disagreements++; witness ??= {index, input: rows[index].input, expected: truth[index], actual}; }
 }
 const row = {id, description, seed: 1, parsedAndExecuted: true, cases: rows.length, excludedBaselineFailures: 0, disagreements, witness, mutantSha256: sha(changed), killed: disagreements > 0};
 results.push(row); writeFileSync(new URL('observed-mutants.json', here), JSON.stringify(results, null, 2) + '\n'); console.log(JSON.stringify(row));
}
const sourceEnd = guards();
const result = {kind: 'private-original-25-executed-mutants-on-fused-ASCII-DFA', startedUtc, closedUtc: new Date().toISOString(), seed: 1, cases: 25, passed: results.filter(row => row.killed).length, baselineTruthCases: rows.length, sourceStart, sourceEnd, sourcesUnchanged: JSON.stringify(sourceStart) === JSON.stringify(sourceEnd), results, acceptanceReplacement: false, allThreeSeedAcceptanceClaimed: false};
writeFileSync(new URL('CLOSED.json', here), JSON.stringify(result, null, 2) + '\n');console.log(JSON.stringify({event:'CLOSED', closedUtc: result.closedUtc, cases: result.cases, passed: result.passed, sourcesUnchanged: result.sourcesUnchanged}));
assert.equal(result.passed, 25);assert.equal(result.sourcesUnchanged, true);
