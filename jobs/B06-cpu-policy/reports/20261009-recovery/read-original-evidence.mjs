import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mutations } from '../../tests/mutations.mjs';

// Read original records in full. This verifies receipts and source continuity;
// it does not create fresh Nintendo telemetry or rerun the 1.2M-state suite.
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
process.chdir(root);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const parse = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const source = fs.readFileSync('cpuPolicy.ts', 'utf8');
const names = ['chooseBranch', 'chooseItem', 'chooseShopBuy', 'buyStar'];
const archiveResults = [];
for (const folder of ['reports', 'reports/evidence-recovery-full']) {
  for (const seed of [1, 2, 3]) {
    const file = `${folder}/seed-${seed}.json`;
    const bytes = fs.readFileSync(file);
    const report = JSON.parse(bytes);
    assert.equal(report.seed, seed);
    assert.equal(report.status, 'passed');
    assert.equal(report.command, 'npm test');
    assert.equal(report.manual.totalScenarios, 80);
    assert.equal(report.manual.records.length, 80);
    for (const name of names) {
      assert.equal(report.manual.counts[name], 20);
      const records = report.manual.records.filter(row => row.function === name);
      assert.equal(records.length, 20);
      for (const row of records) {
        assert.ok(row.input && Object.hasOwn(row, 'expected'));
        assert.ok(typeof row.explanation === 'string' && row.explanation.length > 0);
        assert.ok(Number.isInteger(row.draws) && row.draws >= 0);
      }
      assert.equal(report.random.counts[name], 100000);
    }
    assert.equal(report.random.cases, 400000);
    assert.equal(report.toy.games, 10000);
    assert.equal(report.toy.decisionComparisons, 960000);
    assert.equal(report.toy.hard + report.toy.easy + report.toy.ties, 10000);
    assert.equal(report.toy.hard, [9971, 9934, 9952][seed - 1]);
    assert.ok(report.toy.hard / report.toy.games >= 0.65);
    assert.equal(report.mutations.length, 25);
    for (let i = 0; i < 25; i++) {
      const actual = report.mutations[i];
      const [name, needle, replacement] = mutations[i];
      assert.equal(actual.number, i + 1);
      assert.equal(actual.name, name);
      assert.equal(actual.compiled, true);
      assert.equal(actual.killed, true);
      assert.ok(typeof actual.witness === 'string' && actual.witness.length > 0);
      assert.ok(!/SyntaxError|Cannot find module|not assignable to type/.test(actual.witness));
      assert.ok(source.includes(needle));
      assert.equal(actual.sourceSha256, hash(source.replace(needle, replacement)));
    }
    archiveResults.push({ file, bytes: bytes.length, sha256: hash(bytes), seed,
      manual: 80, randomStates: 400000, toyGames: 10000,
      toyDecisionComparisons: 960000, actualCompiledKills: 25,
      recordedResearchGaps: report.research.coverageGaps.length,
      scope: 'Historical original receipt; read in full, not a new execution.' });
  }
}

const native = parse('reports/20261009-recovery/original-hosted-native.json');
assert.equal(native.head, 'baf87d4400d832b6fe9356ae0d5f43cd109bbd48');
assert.equal(native.runId, 37814340582);
assert.equal(native.jobId, 113438974582);
assert.equal(native.conclusion, 'success');
assert.equal(native.artifacts.length, 0);
const bytes = fs.readFileSync('reports/20261009-recovery/original-baf-hosted-full.log');
const log = bytes.toString('utf8');
assert.equal(bytes.length, native.fullLogUtf8Bytes);
assert.equal(hash(bytes), native.fullLogSha256);
assert.ok(log.includes('Merge baf87d4400d832b6fe9356ae0d5f43cd109bbd48'));
assert.ok(log.includes('npm ci --ignore-scripts --no-audit --no-fund'));
assert.ok(log.includes('All code suites passed for seeds 1, 2, 3.'));
assert.ok(!/##\[error\]|AssertionError|Process completed with exit code [1-9]/.test(log));
for (const seed of [1, 2, 3]) {
  assert.equal([...log.matchAll(new RegExp(`seed ${seed}: 80 manual scenarios passed`, 'g'))].length, 1);
  assert.equal([...log.matchAll(new RegExp(`seed ${seed}: 400000 random legal states passed`, 'g'))].length, 1);
  for (let i = 1; i <= 25; i++) {
    assert.equal([...log.matchAll(new RegExp(`seed ${seed}: mutant ${i}/25 killed`, 'g'))].length, 1);
  }
}
const loggedResearch = log.split('\n').filter(line => line.includes('{"validator":'))
  .map(line => JSON.parse(line.slice(line.indexOf('{'))));
assert.equal(loggedResearch.length, 3);
for (const row of loggedResearch) {
  assert.equal(row.rows, 33); assert.equal(row.sources, 11);
  assert.equal(row.sourceQuoteChecks, 44); assert.equal(row.coverageGaps.length, 24);
  assert.equal(row.strictResearchAcceptance, 'NOT_MET');
}

let seals = 0;
for (const manifest of ['PRODUCTION-SEALED-SHA256SUMS.txt', 'blind-authoring/SEALED-SHA256SUMS.txt']) {
  for (const line of fs.readFileSync(manifest, 'utf8').trim().split('\n')) {
    const match = line.match(/^([0-9a-f]{64})\s+(.+)$/); assert.ok(match);
    const basename = path.basename(match[2]);
    const file = manifest.startsWith('blind-')
      ? basename === 'reference.ts' ? 'reference.ts' : path.join('blind-authoring', basename)
      : basename;
    if (!fs.existsSync(file)) continue;
    assert.equal(hash(fs.readFileSync(file)), match[1]); seals++;
  }
}
assert.equal(seals, 9);
const strict = spawnSync(process.execPath, ['tests/research-strict.mjs'], { encoding: 'utf8', timeout: 30000 });
assert.equal(strict.status, 1);
assert.equal(strict.stderr, '');
const research = JSON.parse(strict.stdout.trim());
assert.equal(research.rows, 33); assert.equal(research.sources, 11);
assert.equal(research.sourceQuoteChecks, 44); assert.equal(research.coverageGaps.length, 24);
assert.equal(research.strictResearchAcceptance, 'NOT_MET');
const result = { observedUtc: new Date().toISOString(), command: 'node reports/20261009-recovery/read-original-evidence.mjs',
  status: 'passed', originalHosted: { head: native.head, runId: native.runId, jobId: native.jobId,
    fullLogUtf8Bytes: bytes.length, fullLogSha256: hash(bytes), completeSeedCount: 3,
    manualCases: 240, randomStates: 1200000, toyGames: 30000, actualCompiledKills: 75,
    artifactsUploadedByOriginalWorkflow: 0 },
  historicalArchives: archiveResults, sourceSeals: seals,
  currentStrictResearchCommand: 'node tests/research-strict.mjs', currentStrictResearchExit: strict.status,
  research, completeResearchAcceptance: false,
  scope: 'Full original native log and committed records accepted. Existing code counts were not freshly rerun locally. No Nintendo measurements or evidence promotions.' };
console.log(JSON.stringify(result, null, 2));
