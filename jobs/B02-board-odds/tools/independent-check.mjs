// Exact cross-check of boardOdds() against tools/python_bruteforce.py (a separate Python implementation that
// enumerates literal walks with fractions.Fraction). Every start, every face 0..10, the mixed die, both policies,
// and boardOddsByFace are compared as exact "n/d" strings. Run: node tools/independent-check.mjs --seed 1 --graphs 300
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { boardOdds, boardOddsByFace, dieFromFractions, rational } from '../build/boardOdds.js';

const argument = name => { const at = process.argv.indexOf(name); return at < 0 ? undefined : process.argv[at + 1]; };
const seed = Number(argument('--seed') ?? 1), graphs = Number(argument('--graphs') ?? 300);
const text = r => `${r.numerator}/${r.denominator}`;
const delta = face => new Map([[face, rational(1n)]]);

const raw = execFileSync('python3', ['-I', 'tools/python_bruteforce.py', '--seed', String(seed), '--graphs', String(graphs)],
  { encoding: 'utf8', maxBuffer: 1 << 30 });
const data = JSON.parse(raw);
const counts = { graphs: 0, starts: 0, faceComparisons: 0, mixtureComparisons: 0, tableComparisons: 0, landingValues: 0, passValues: 0 };
const compareOne = (actual, expected, label) => {
  assert.deepEqual([...actual.landing.keys()].sort(), Object.keys(expected.landing).sort(), label + ' landing keys');
  for (const [id, want] of Object.entries(expected.landing)) { assert.equal(text(actual.landing.get(id)), want, `${label} landing ${id}`); counts.landingValues++; }
  assert.deepEqual([...actual.expectedPasses.keys()].sort(), Object.keys(expected.passes).sort(), label + ' pass keys');
  for (const [id, want] of Object.entries(expected.passes)) {
    const got = actual.expectedPasses.get(id);
    assert.notEqual(got, 'infinity', label + ' unexpected infinity');
    assert.equal(text(got), want, `${label} passes ${id}`); counts.passValues++;
  }
};
for (const item of data.cases) {
  const { board, policy, target } = item;
  const die = dieFromFractions(item.die);
  counts.graphs++;
  const table = boardOddsByFace(board, 10, policy, target);
  for (const result of item.results) {
    const label = `graph=${item.graph} policy=${policy} start=${result.start}`;
    counts.starts++;
    for (const [face, expected] of Object.entries(result.faces)) {
      const actual = boardOdds(board, delta(Number(face)), policy, target).get(result.start);
      compareOne(actual, expected, `${label} face=${face}`); counts.faceComparisons++;
      compareOne(table.get(Number(face)).get(result.start), expected, `${label} table face=${face}`); counts.tableComparisons++;
    }
    compareOne(boardOdds(board, die, policy, target).get(result.start), result.mixture, `${label} mixture`);
    counts.mixtureComparisons++;
  }
}
const report = { seed, generator: data.generator, python: 'python3 -I', ...counts,
  passed: true, command: `node tools/independent-check.mjs --seed ${seed} --graphs ${graphs}` };
mkdirSync('.verification', { recursive: true });
writeFileSync(`.verification/independent-python-seed-${seed}.json`, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
