import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import ts from 'typescript';
import { golden } from './support.mjs';
import { referenceByFace } from './build/reference.js';

const seedAt = process.argv.indexOf('--seed');
const seed = Number(seedAt < 0 ? 1 : process.argv[seedAt + 1]);
assert.ok([1, 2, 3].includes(seed));
const source = readFileSync('boardOdds.ts', 'utf8');
const sha = s => createHash('sha256').update(s).digest('hex');
const originalHash = sha(source);
// Single-point, type-valid behavioral defects. Never edit the original file.
const mutants = [
  ['M01', 'Subtract instead of adding rational numerators',
    'a.numerator * (b.denominator / g) + b.numerator * (a.denominator / g)',
    'a.numerator * (b.denominator / g) - b.numerator * (a.denominator / g)'],
  ['M02', 'Add instead of multiplying rational numerators',
    '(a.numerator / g) * (b.numerator / h)', '(a.numerator / g) + (b.numerator / h)'],
  ['M03', 'Stop reducing fractions to lowest terms',
    'numerator: numerator / g, denominator: denominator / g',
    'numerator: numerator / (g / g), denominator: denominator / (g / g)'],
  ['M04', 'Charge a step for pass-through destinations',
    'if (nodes[j]!.passThrough) {', 'if (false && nodes[j]!.passThrough) {'],
  ['M05', 'Make ordinary destinations cost zero steps',
    'if (nodes[j]!.passThrough) {', 'if (true || nodes[j]!.passThrough) {'],
  ['M06', 'Count every pass-through entry twice',
    'rewards[i]![j] = add(rewards[i]![j]!, p)', 'rewards[i]![j] = add(rewards[i]![j]!, multiply(p, rational(2n)))'],
  ['M07', 'Do not count an entered pass-through dead end',
    'if (!trapOf.has(j)) rewards', 'if (!trapOf.has(j) && choices[j]!.length > 0) rewards'],
  ['M08', 'Count the initial pass-through node as an entry',
    ": movement.reward[i]![j]!);", ": add(movement.reward[i]![j]!, i === j ? ONE : ZERO));"],
  ['M09', 'Divide branch probabilities by one too many choices',
    'rational(1n, BigInt(edges.length))', 'rational(1n, BigInt(edges.length + 1))'],
  ['M10', 'Uniform policy always selects the first branch',
    "if (policy === 'uniform' || edges.length === 0) return edges;",
    "if (policy === 'uniform' || edges.length === 0) return edges.slice(0, 1);"],
  ['M11', 'Break target-distance ties by taking only the first branch',
    'return edges.filter(j => distance[j] === best);', 'return edges.filter(j => distance[j] === best).slice(0, 1);'],
  ['M12', 'Select the farthest rather than the nearest target route',
    'Math.min(...edges.map(j => distance[j]!))', 'Math.max(...edges.map(j => distance[j]!))'],
  ['M13', 'Use forward edges in the reverse target-distance search',
    'for (const w of reverse[v]!)', 'for (const w of links[v]!)'],
  ['M14', 'Choose the first route when the target is unreachable',
    'return edges.filter(j => distance[j] === best);',
    'return best === Infinity ? edges.slice(0, 1) : edges.filter(j => distance[j] === best);'],
  ['M15', 'Treat duplicate next IDs as extra probability tickets',
    '[...new Set(v.next)].map(id =>', '[...v.next].map(id =>'],
  ['M16', 'Drop self-loop edges',
    'return j;\n  }));', 'return j;\n  }).filter(j => j !== indices.get(v.id)));'],
  ['M17', 'Lose probability mass at dead ends',
    'if (edges.length === 0) { exits[i]![i] = ONE;', 'if (edges.length === 0) { exits[i]![i] = ZERO;'],
  ['M18', 'Zero-step movement loses its identity distribution',
    'return { transition: identity(size), reward: zeros(size, n) };',
    'return { transition: zeros(size, size), reward: zeros(size, n) };'],
  ['M19', 'Move one extra step on every die face', 'let remaining = face, bit = 0', 'let remaining = face + 1, bit = 0'],
  ['M20', 'Ignore die weights when accumulating landing mass',
    'addRow(total.transition[i]!, movement.transition[i]!, weight);',
    'addRow(total.transition[i]!, movement.transition[i]!, ONE);'],
  ['M21', 'Discard the nontermination probability',
    'add(nonTermination, movement.transition[i]![n + t]!)', 'add(nonTermination, ZERO)'],
  ['M22', 'Report recurrent expected pass counts as finite zero',
    "? 'infinity' : movement.reward[i]![j]!", '? ZERO : movement.reward[i]![j]!'],
  ['M23', 'Misclassify mixed ordinary/pass-through cycles as zero-cost traps',
    'if (cls.every(j => nodes[j]!.passThrough', 'if (cls.some(j => nodes[j]!.passThrough'],
  ['M24', 'Omit geometric resummation of pass-through self-loops',
    'a[i]![j] = add(a[i]![j]!, neg(p));', 'if (i !== j) a[i]![j] = add(a[i]![j]!, neg(p));'],
  ['M25', 'Forget rewards earned in the first part of composed movement',
    'addRow(reward[i]!, a.reward[i]!, ONE);', 'addRow(reward[i]!, a.reward[i]!, ZERO);'],
];
const config = ts.readConfigFile('tsconfig.json', ts.sys.readFile);
const options = ts.parseJsonConfigFileContent(config.config, ts.sys, process.cwd()).options;
const results = [];
mkdirSync('.verification', { recursive: true });
for (const [id, description, before, after] of mutants) {
  assert.equal(source.split(before).length - 1, 1, `${id}: substitution must identify exactly one site`);
  const mutated = source.replace(before, after);
  const originalHost = ts.createCompilerHost(options), host = { ...originalHost };
  const root = resolve('boardOdds.ts');
  host.getSourceFile = (file, languageVersion, onError, shouldCreateNewSourceFile) =>
    resolve(file) === root ? ts.createSourceFile(file, mutated, languageVersion, true) :
      originalHost.getSourceFile(file, languageVersion, onError, shouldCreateNewSourceFile);
  const program = ts.createProgram([root], { ...options, noEmit: true }, host);
  const diagnostics = ts.getPreEmitDiagnostics(program);
  assert.equal(diagnostics.length, 0, `${id}: compiler errors do NOT count as a killed mutant: ` +
    ts.formatDiagnosticsWithColorAndContext(diagnostics, host));
  const output = ts.transpileModule(mutated, { compilerOptions: { ...options, module: ts.ModuleKind.ES2022 } }).outputText;
  const path = resolve(`.verification/${id}-seed-${seed}.mjs`);
  writeFileSync(path, output);
  let killed = false, witness = '';
  try {
    const engine = await import(pathToFileURL(path).href);
    golden(engine, referenceByFace, seed);
  } catch (error) { killed = true; witness = String(error?.message ?? error).slice(0, 1500); }
  finally { rmSync(path, { force: true }); }
  results.push({ id, description, strictTypecheckPassed: true, killed, witness,
    suite: 'golden regression + independent oracle + exact arithmetic + validation',
    command: `node mutate.mjs --seed ${seed}` });
  console.log(`${id}: ${killed ? 'KILLED' : 'SURVIVED'} - ${description}`);
}
assert.equal(sha(readFileSync('boardOdds.ts', 'utf8')), originalHash, 'Original implementation changed during mutation testing');
const report = { seed, sourceSHA256: originalHash, mutants: results.length,
  killed: results.filter(v => v.killed).length, passed: results.every(v => v.killed), results };
writeFileSync(`.verification/mutations-seed-${seed}.json`, JSON.stringify(report, null, 2) + '\n');
assert.equal(report.killed, 25, 'Every deliberate bug must be caught at runtime, not by a compiler error');
