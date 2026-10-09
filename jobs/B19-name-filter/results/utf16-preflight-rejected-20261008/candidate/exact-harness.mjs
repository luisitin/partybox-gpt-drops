// Private diagnostic only. Neither production nor the literal acceptance gate changes.
import {readFileSync, writeFileSync} from 'node:fs';
import {createHash, randomUUID} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {performance, PerformanceObserver} from 'node:perf_hooks';
import {setImmediate as immediate} from 'node:timers/promises';
import os from 'node:os';
import {nameFilter, isAllowedName} from '../../jobs/B19-name-filter/dist/nameFilter.js';
import {reference} from '../../jobs/B19-name-filter/dist/tests/reference.js';
import {createReference} from '../../jobs/B19-name-filter/tests/blind/reference.mjs';
import * as candidate from './compiled/candidate-nameFilter.js';
import {makeObfuscations, makeFuzz, positive, fixed, mappingCases, knownCases, rangeCases, lengthBoundaryCases, addedNameCases, rng, pick} from './original-workload-declarations.mjs';

const job = new URL('../../jobs/B19-name-filter/', import.meta.url);
const out = new URL('./', import.meta.url);
const mode = process.argv[2];
if (!['equivalence', 'timing'].includes(mode)) throw Error('Specify equivalence or timing');
const nonce = randomUUID();
const file = name => new URL(name, out);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const label = value => value.ok ? 'ok' : value.reason;
const policy = JSON.parse(readFileSync(new URL('data/policy.json', job)));
const blind = createReference(policy);
const hashFile = path => digest(readFileSync(path));
const extraInputs = [
 'dist/nameFilter.js', 'dist/tests/reference.js', 'data/cache/names.json',
 'data/cache/words.json', 'data/cache/places.json', 'data/cache/manifest.json',
];
const manifest = readFileSync(new URL('SHA256SUMS.txt', job), 'utf8').trim().split('\n').map(row => {
 const match = /^([0-9a-f]{64})  (.+)$/.exec(row);
 if (!match) throw Error('Malformed production manifest row');
 return match[2];
});
const privateInputs = ['build-candidate.py', 'preflight-source.txt', 'structural-control.mjs', 'build-receipt.json', 'candidate-nameFilter.ts', 'baseline-nameFilter.ts', 'original-workload-declarations.mjs', 'compiled/candidate-nameFilter.js', 'tsconfig.json', 'package.json', 'exact-harness.mjs', 'baseline-loaded/dist/data/policy.json', 'baseline-loaded/dist/nameFilter.d.ts', 'baseline-loaded/dist/nameFilter.js', 'baseline-loaded/dist/tests/reference.d.ts', 'baseline-loaded/dist/tests/reference.js'];
function guards() {
 return Object.fromEntries([
  ...new Set([...manifest, ...extraInputs]),
 ].map(path => ['job/' + path, hashFile(new URL(path, job))]).concat(privateInputs.map(path => ['private/' + path, hashFile(file(path))])));
}
const startedUtc = new Date().toISOString();
const sourceStart = guards();
if (sourceStart['job/nameFilter.ts'] !== '7817489fc1d0908a87914223a84b31c15ea7e13b3555cb4238594751616f163d') throw Error('Wrong production source');
if (sourceStart['job/tests/run.mjs'] !== 'bff0c17b62aa75d342527a8ced855678380411053476557acde61f2e1b6fbdd9') throw Error('Wrong original runner');
const corpora = Object.fromEntries(['names', 'words', 'places'].map(group => [group, JSON.parse(readFileSync(new URL(`data/cache/${group}.json`, job)))]));
for (const [group, required] of [['names', 20000], ['words', 10000], ['places', 2000]]) {
 if (corpora[group].length !== required) throw Error(`Wrong ${group} corpus count`);
}
if (positive.length !== 48 || fixed.length !== 459) throw Error('Original workload changed');
const originalPolicySha256 = sourceStart['job/data/original-workload-policy.json'];
if (originalPolicySha256 !== 'ac400db6c9733f6becc82df93f91cdde13563767d2b9b3883684779b28c48dc9') throw Error('Original policy changed');
const seeds = [1, 2, 3];
const seedWorkloads = seeds.map(seed => {
 const generated = makeObfuscations(seed);
 const fuzz = makeFuzz(seed);
 const all = [...fixed, ...mappingCases, ...generated.rows, ...fuzz,
  ...Object.values(corpora).flat().map(row => ({input: row.name}))];
 if (all.length !== 43830 || generated.rows.length !== 5000 || Object.keys(generated.coverage).length !== policy.terms.length) throw Error('Original generated workload/count mismatch');
 const timedInputs = [...positive, ...generated.rows.map(row => row.input), ...Object.values(corpora).flat().map(row => row.name)];
 const r = rng(seed ^ 0x1234abcd);
 const sample = Array.from({length: 10000}, () => pick(r, timedInputs));
 return {seed, generated, all, sample, sampleSha256: digest(JSON.stringify(sample)), timedInputs: timedInputs.length};
});
const environment = {node: process.version, unicode: process.versions.unicode, platform: process.platform, arch: process.arch, cpu: os.cpus()[0]?.model};
const preparation = JSON.parse(readFileSync(file('build-receipt.json')));
const sourceGzipBytes = gzipSync(readFileSync(file('candidate-nameFilter.ts'))).length;
const compiledGzipBytes = gzipSync(readFileSync(file('compiled/candidate-nameFilter.js'))).length;
if (sourceGzipBytes > 6000 || compiledGzipBytes > 6000) throw Error('Candidate exceeds original gzip bound');
const report = {kind: 'private-indexed-UTF16-length-preflight-nonacceptance', mode, nonce, startedUtc, environment, preparation,
 sourceStart, candidateSourceSha256: sourceStart['private/candidate-nameFilter.ts'], candidateJsSha256: sourceStart['private/compiled/candidate-nameFilter.js'],
 sourceGzipBytes, compiledGzipBytes, originalPolicySha256,
 workloads: seedWorkloads.map(row => ({seed: row.seed, originalComparisons: row.all.length, generated: row.generated.rows.length, timedInputs: row.timedInputs, timedSampleSha256: row.sampleSha256})),
 limitations: ['Private mixed-loop measurements do not replace the unchanged original per-call 0.05 ms acceptance check.', 'No cause of a prior timing failure is inferred.', 'No production or acceptance protocol change has occurred.']};
writeFileSync(file(`${mode}-${nonce}-START.json`), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({event: 'START', mode, nonce, startedUtc, candidateSourceSha256: report.candidateSourceSha256}));

if (mode === 'equivalence') {
 const suites = [], failures = [], comparisons = createHash('sha256');
 const suggestionFor = {type: 'use-text', length: 'shorten', empty: 'add-letters', control: 'remove-characters', blocked: 'choose-another'};
 for (const workload of seedWorkloads) {
  const groups = [['original', workload.all], ['Unicode-policy', knownCases], ['Unicode-ranges', rangeCases], ['length-boundaries', lengthBoundaryCases], ['added-name-bypasses', addedNameCases]];
  for (const [name, rows] of groups) {
   let fullResultAgreement = 0, sealedAgreement = 0, blindAgreement = 0, frozen = 0, wrapperAgreement = 0, expectedAgreement = 0;
   for (let index = 0; index < rows.length; index++) {
    const {input, expected} = rows[index];
    const a = nameFilter(input), b = candidate.nameFilter(input), sealed = reference(input), independent = blind.nameFilter(input);
    const full = JSON.stringify(a) === JSON.stringify(b) && (b.ok || b.suggestion === suggestionFor[b.reason]);
    const s = label(b) === label(sealed), i = label(b) === label(independent), f = Object.isFrozen(b), w = candidate.isAllowedName(input) === isAllowedName(input);
    const e = expected === undefined || label(b) === expected;
    fullResultAgreement += Number(full); sealedAgreement += Number(s); blindAgreement += Number(i); frozen += Number(f); wrapperAgreement += Number(w); expectedAgreement += Number(e);
    comparisons.update(JSON.stringify([workload.seed, name, index, a, b, label(sealed), label(independent), f, w, e]) + '\n');
    if (!(full && s && i && f && w && e) && failures.length < 100) failures.push({seed: workload.seed, name, index, input: typeof input === 'string' ? input : String(input), baseline: a, candidate: b, sealed, independent, frozen: f, wrapper: w, expected});
   }
   const passed = [fullResultAgreement, sealedAgreement, blindAgreement, frozen, wrapperAgreement, expectedAgreement].every(value => value === rows.length);
   const suite = {seed: workload.seed, name, cases: rows.length, fullResultAgreement, sealedAgreement, blindAgreement, frozen, wrapperAgreement, expectedAgreement, passed};
   suites.push(suite); console.log(JSON.stringify(suite));
  }
 }
 Object.assign(report, {suites, failures, comparisonsSha256: comparisons.digest('hex'), originalCases: suites.filter(row => row.name === 'original').reduce((sum, row) => sum + row.cases, 0), cases: suites.reduce((sum, row) => sum + row.cases, 0), passed: suites.every(row => row.passed)});
} else {
 const equivalence = JSON.parse(readFileSync(file('equivalence-latest.json')));
 if (!equivalence.passed || equivalence.candidateSourceSha256 !== report.candidateSourceSha256 || equivalence.candidateJsSha256 !== report.candidateJsSha256 || JSON.stringify(equivalence.sourceEnd) !== JSON.stringify(sourceStart)) throw Error('Candidate lacks current complete equivalence');
 report.equivalenceNonce = equivalence.nonce;
 const events = [], phases = [];
 const observer = new PerformanceObserver(list => {for (const entry of list.getEntries()) events.push({startMs: entry.startTime, durationMs: entry.duration, kind: entry.detail?.kind});});
 observer.observe({entryTypes: ['gc']});
 const fns = {baseline: nameFilter, candidate: candidate.nameFilter};
 let sink = 0;
 const callCount = 500000;
 const orders = [['baseline', 'candidate', 'candidate', 'baseline'], ['candidate', 'baseline', 'baseline', 'candidate']];
 for (const workload of seedWorkloads) {
  const rows = workload.sample;
  for (const variant of ['baseline', 'candidate']) for (let index = 0; index < 100000; index++) sink += Number(fns[variant](rows[index % rows.length]).ok);
  for (let block = 0; block < orders.length; block++) for (let ordinal = 0; ordinal < orders[block].length; ordinal++) {
   const variant = orders[block][ordinal], fn = fns[variant];
   const sinkBefore = sink, startMs = performance.now(), wallStartedUtc = new Date().toISOString();
   for (let index = 0; index < callCount; index++) sink += Number(fn(rows[index % rows.length]).ok);
   const endMs = performance.now(), wallClosedUtc = new Date().toISOString();
   await immediate(); await immediate();
   const gc = events.filter(event => event.startMs >= startMs && event.startMs < endMs);
   const phase = {seed: workload.seed, block, ordinal, variant, calls: callCount, sampleSha256: workload.sampleSha256, startMs, endMs, totalMs: endMs - startMs, meanMs: (endMs - startMs) / callCount, wallStartedUtc, wallClosedUtc, sink: sink - sinkBefore, gc};
   phases.push(phase); writeFileSync(file(`timing-${nonce}-phases.json`), JSON.stringify(phases, null, 2) + '\n'); console.log(JSON.stringify(phase));
  }
 }
 observer.disconnect();
 const summaries = seedWorkloads.map(({seed}) => {
  const rows = phases.filter(row => row.seed === seed);
  const baselineMs = rows.filter(row => row.variant === 'baseline').reduce((sum, row) => sum + row.totalMs, 0);
  const candidateMs = rows.filter(row => row.variant === 'candidate').reduce((sum, row) => sum + row.totalMs, 0);
  const sinks = new Set(rows.map(row => row.sink));
  return {seed, baselineMs, candidateMs, candidateToBaseline: candidateMs / baselineMs, improvementPercent: 100 * (baselineMs - candidateMs) / baselineMs, sinksAgree: sinks.size === 1};
 });
 Object.assign(report, {phases, gc: events, summaries, sink, order: orders, callsPerPhase: callCount, totalMeasuredCalls: phases.reduce((sum, row) => sum + row.calls, 0), passed: summaries.every(row => row.sinksAgree)});
}
report.sourceEnd = guards();
report.sourcesUnchanged = JSON.stringify(report.sourceStart) === JSON.stringify(report.sourceEnd);
report.passed &&= report.sourcesUnchanged;
report.closedUtc = new Date().toISOString();
writeFileSync(file(`${mode}-${nonce}-CLOSED.json`), JSON.stringify(report, null, 2) + '\n');
writeFileSync(file(`${mode}-latest.json`), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({event: 'CLOSED', mode, nonce, closedUtc: report.closedUtc, passed: report.passed, sourcesUnchanged: report.sourcesUnchanged, originalCases: report.originalCases, cases: report.cases, summaries: report.summaries}));
if (!report.passed) process.exitCode = 1;
