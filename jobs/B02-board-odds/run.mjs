import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
process.chdir(dirname(fileURLToPath(import.meta.url)));
mkdirSync('.verification', { recursive: true });
const report = { command: 'npm test', node: process.version,
  typescript: JSON.parse(readFileSync('node_modules/typescript/package.json', 'utf8')).version,
  sourceSHA256: Object.fromEntries(['boardOdds.ts', 'blind-reference.ts', 'reference.ts', 'blind-authoring/AUTHORING.md', 'blind-authoring/SHA256SUMS.txt', 'support.mjs', 'test.mjs', 'mutate.mjs', 'run.mjs', 'tsconfig.json']
    .map(file => [file, createHash('sha256').update(readFileSync(file)).digest('hex')])),
  seeds: [1, 2, 3], commands: [], passed: false };
try {
  assert.equal(report.typescript, '5.8.3', 'Use the pinned development compiler');
  const sealed = readFileSync('blind-authoring/SHA256SUMS.txt', 'utf8').trim().split('\n');
  for (const line of sealed) {
    const [expected, file] = line.split(/\s+/);
    assert.equal(createHash('sha256').update(readFileSync(`blind-authoring/${file}`)).digest('hex'),
      expected, `Independent author's sealed artifact changed: ${file}`);
  }
  const independentHash = sealed.find(line => line.endsWith('  reference.ts')).split(/\s+/)[0];
  assert.equal(report.sourceSHA256['blind-reference.ts'], independentHash,
    'The integrated independent reference must exactly match its pre-exchange seal');
  for (const seed of report.seeds) {
    for (const args of [
      ['hashes.mjs'],
      ['node_modules/typescript/bin/tsc', '-p', 'tsconfig.json'],
      ['test.mjs', '--seed', String(seed)],
      ['mutate.mjs', '--seed', String(seed)],
    ]) {
      const command = `node ${args.join(' ')}`;
      console.log(`\n=== seed ${seed}: ${command} ===`);
      const result = spawnSync(process.execPath, args, { stdio: 'inherit' });
      report.commands.push({ seed, command, exitCode: result.status, passed: result.status === 0 });
      if (result.error) throw result.error;
      assert.equal(result.status, 0, command);
    }
  }
  report.passed = true;
  console.log('\nPASS: full suite, seeds 1/2/3, all 75 isolated mutations caught.');
} catch (error) { report.error = String(error?.stack ?? error); console.error(report.error); process.exitCode = 1; }
finally { writeFileSync('.verification/full-suite.json', JSON.stringify(report, null, 2) + '\n'); }
