import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

process.env.B09_IMPORT_ONLY = '1';
const { smoke } = await import('./test.mjs');
const original = readFileSync('clueSolver.ts', 'utf8');
const mutations = [
  ['exclude-envelope', '(1 << (n + 1)) - 1', '(1 << n) - 1'],
  ['exclude-wrong-player', 'allOwners & ~(1 << input.me)', 'allOwners & ~(1 << ((input.me + 1) % n))'],
  ['own-card-wrong-owner', 'domains[card] = 1 << input.me;', 'domains[card] = 1 << ((input.me + 1) % n);'],
  ['known-owner-union', 'domains[card]! & (1 << observation.player)', 'domains[card]! | (1 << observation.player)'],
  ['forbid-refuter', 'if (player === suggestion.refutedBy) break;', 'if (player === suggestion.refutedBy) { for (const card of cards) domains[card] = domains[card]! & ~(1 << player); break; }'],
  ['ignore-no-refuter-denials', 'for (const card of cards) domains[card] = domains[card]! & ~(1 << player);', 'if (suggestion.refutedBy !== null) for (const card of cards) domains[card] = domains[card]! & ~(1 << player);'],
  ['ignore-refuter-disjunction', 'if (suggestion.refutedBy !== null) clauses.push', 'if (false && suggestion.refutedBy !== null) clauses.push'],
  ['require-all-refuter-cards', 'clause.cards.some(c => domains[c] === bit)', 'clause.cards.every(c => domains[c] === bit)'],
  ['reject-exact-full-hand', 'fixed.length > capacity', 'fixed.length >= capacity'],
  ['reject-exact-capacity-domains', 'eligible.length < capacity', 'eligible.length <= capacity'],
  ['wrong-clause-singleton-owner', 'domains[candidates[0]!] = bit;', 'domains[candidates[0]!] = 1 << ((clause.owner + 1) % n);'],
  ['missing-room-envelope', 'envelope === 7', 'envelope === 3'],
  ['require-unsatisfied-refuter-constraints', '&& empty(unsatisfied) ? 1 : 0;', '&& !empty(unsatisfied) ? 1 : 0;'],
  ['merge-envelope-categories', 'envelope | bit, remove(unsatisfied, cover[position]![owner]!)', 'envelope | 1, remove(unsatisfied, cover[position]![owner]!)'],
  ['memo-omits-envelope-state', '(state.code * 8 + state.envelope) * maskBase', 'state.code * 8 * maskBase'],
  ['drop-initial-refuter-constraints', 'compact ? 2 ** clauses.length - 1 :', 'compact ? 0 :'],
  ['never-satisfy-refuter-constraints', 'code: state.code - strides[owner]!, envelope: state.envelope, clauses: remove(state.clauses, cover[position]![owner]!)', 'code: state.code - strides[owner]!, envelope: state.envelope, clauses: state.clauses'],
  ['wrong-total-deal-count', 'totalDeals: BigInt(total)', 'totalDeals: BigInt(total + 1)'],
  ['increment-probability-numerator', 'const numerator = BigInt(a)', 'const numerator = BigInt(a + 1)'],
  ['reverse-player-probabilities', 'marginal[card]!.slice(0, n).map', 'marginal[card]!.slice(0, n).reverse().map'],
  ['wrong-envelope-marginal', 'fraction(marginal[card]![n]!, total)', 'fraction(marginal[card]![n - 1]!, total)'],
  ['omit-prefix-multiplicity', 'ways * suffix', 'suffix'],
  ['collapse-prefix-multiplicity', 'saved.ways += ways;', 'saved.ways += 1;'],
  ['shift-fixed-owner', 'const owner = Math.log2(d);', 'const owner = Math.max(0, Math.log2(d) - 1);'],
  ['wrong-clockwise-start', 'let player = (suggestion.player + 1) % n;', 'let player = (suggestion.player + n - 1) % n;'],
];
assert.equal(mutations.length, 25);
assert.ok(!/Math\.random|Date\.now/.test(original), 'production has no unseeded randomness or clock');
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
assert.ok(!pkg.dependencies || Object.keys(pkg.dependencies).length === 0, 'zero runtime dependencies');
const results = [];
// Preserve actual compiled outputs for independent inspection after temporary mutants are removed.
mkdirSync('.verification', { recursive: true });
writeFileSync('.verification/types.js', readFileSync('dist/types.js'));
writeFileSync('.verification/package.json', '{"type":"module"}\n');
for (const [id, before, after] of mutations) {
  assert.equal(original.split(before).length - 1, 1, `unambiguous mutation ${id}`);
  const directory = resolve(`.mutation-${id}`);
  mkdirSync(directory, { recursive: true });
  try {
    writeFileSync(`${directory}/clueSolver.ts`, original.replace(before, after));
    writeFileSync(`${directory}/types.ts`, readFileSync('types.ts'));
    writeFileSync(`${directory}/tsconfig.json`, JSON.stringify({ compilerOptions: { target: 'ES2022', module: 'NodeNext', moduleResolution: 'NodeNext', strict: true, noUncheckedIndexedAccess: true, exactOptionalPropertyTypes: true, outDir: '.', lib: ['ES2022'] }, files: ['clueSolver.ts','types.ts'] }));
    // A compilation failure aborts the suite; it never counts as a mutation kill.
    execFileSync(process.execPath, ['node_modules/typescript/bin/tsc', '-p', `${directory}/tsconfig.json`], { stdio: 'pipe' });
    writeFileSync(`.verification/mutant-${id}.mjs`, readFileSync(`${directory}/clueSolver.js`));
    const { solveClue } = await import(pathToFileURL(`${directory}/clueSolver.js`).href);
    for (const seed of [1,2,3]) {
      let caught;
      try { smoke(solveClue, seed); } catch (error) { caught = error; }
      assert.ok(caught, `mutant survived: ${id}, seed ${seed}`);
      results.push({ id, seed, killed: true, evidence: String(caught.message).split('\n')[0] });
    }
    console.log(`mutation ${results.length / 3}/25 ${id}: killed for seeds 1,2,3`);
  } finally { rmSync(directory, { recursive: true, force: true }); }
}
writeFileSync('mutation-results.json', JSON.stringify(results, null, 2) + '\n');
console.log('25/25 independently planted, compiling production mutations caught for all three seeds');
