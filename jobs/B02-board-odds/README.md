# B02 — Exact board movement odds

`boardOdds.ts` is the standalone production module. It has **zero runtime dependencies**, uses reduced BigInt fractions, and never samples randomness. The requested PR branch is `job/B02-board-odds`; the only file outside this directory is the repository-required `.github/workflows/B02.yml`.

## Run

Requirements: Node.js 22 or newer; npm. Install the sole development dependency with `npm ci --ignore-scripts --no-audit --no-fund`, then:

```sh
npm test
```

That one test command verifies checksums, compiles the production module, sealed blind reference, and historical supplemental oracle with strict checks, runs every full test suite with seeds **1, 2, 3**, and checks 25 isolated, strictly type-checked mutants per seed. Nothing is skipped because of CI environment variables. Every failing comparison exits nonzero. Raw results are written to `.verification/`; no clocks or unseeded randomness influence the tests.

To compile without running tests: `npm run build`. To run one full test seed after building: `node test.mjs --seed 1`. To run one mutation seed: `node mutate.mjs --seed 1`. `--smoke` is explicitly a reduced diagnostic run and is **not** used by `npm test` or CI.

## API and example

```ts
import { boardOdds, rational } from './build/boardOdds.js';

const board = { nodes: [
  { id: 'start', kind: 'space', next: ['shop'], passThrough: false },
  { id: 'shop', kind: 'shop', next: ['A'], passThrough: true },
  { id: 'A', kind: 'space', next: ['B', 'C'], passThrough: false },
  { id: 'B', kind: 'space', next: [], passThrough: false },
  { id: 'C', kind: 'space', next: [], passThrough: false },
] };
const die = new Map([
  [1, rational(1n, 2n)],
  [2, rational(1n, 2n)],
]);
const allStarts = boardOdds(board, die, 'uniform');
const fromStart = allStarts.get('start')!;
// landing: A = 1/2, B = 1/4, C = 1/4; all other nodes = 0.
// expectedPasses: shop = 1; nonTermination = 0.
const towardB = boardOdds(board, die, 'toward target', 'B');
```

Signature:

```ts
boardOdds(board: BoardGraph, die: DieDistribution,
  policy?: 'uniform' | 'toward target', target?: string): BoardOdds
```

`DieDistribution` accepts a native `Map<number, Rational>` or an object such as `{ '0': rational(1n, 2n), '1': rational(1n, 2n) }`. A rational has fields `numerator: bigint` and `denominator: bigint`. Input die fractions need not already be reduced; the engine normalizes them. Negative denominators are normalized. Weights must be nonnegative and sum to **exactly one**. Zero-weight faces contribute nothing, including to infinite expectations.

`BoardOdds` is a read-only map from **every** start ID to:

| Field | Meaning |
| --- | --- |
| `landing` | Read-only map containing every physical node ID, including exact zero probabilities. |
| `nonTermination` | Exact probability that movement never ends in a closed pass-through class. |
| `expectedPasses` | Read-only map for every pass-through node. Each entry is a reduced rational or the literal `'infinity'`. |

`boardOddsByFace(board, maxFace, policy?, target?)` produces a table for every integer face from 0 through `maxFace`, inclusive. It is intended for modest face ranges. The main `boardOdds` API uses binary powering for large faces and does not iterate once per movement step. `rational`, `add`, `multiply`, `ZERO`, and `ONE` are also exported; arithmetic helpers operate on canonical fractions produced by `rational`.

BigInts require explicit serialization, for example `JSON.stringify(value, (_, v) => typeof v === 'bigint' ? v.toString() : v instanceof Map ? [...v] : v)`. Production outputs retain BigInts, not strings or floats.

## Precisely defined movement

The graph is directed. Moving along an edge **enters its destination**. Entering an ordinary node spends one step; entering a pass-through node spends none and increments that node's pass count by one. The initial position is not an entry. A face of zero lands immediately at the initial position and records no passes, even if that position is pass-through.

Movement stops immediately when the final step is spent. It does not continue through shops after that final ordinary node. A dead end stops the roll at its current physical node and discards unused steps; entering a pass-through dead end still counts one pass. Starting at a dead end counts no passes. Ordinary self-loops consume steps; pass-through self-loops do not.

A branch chooses uniformly among **distinct destination IDs**. Repeated IDs in `next` are deduplicated; this is a graph, not a weighted multigraph. The `kind` string is metadata: only `passThrough` decides movement cost.

**`toward target` means shortest directed path measured in edge hops, not movement-step cost.** At each branch, select successors with minimum graph distance to the target and split ties uniformly. Distances are computed on the complete directed input graph. When no successor can reach the target, all distances are infinite and the policy falls back to uniform. An unknown target ID behaves as unreachable; omitting the target argument entirely is an input error. Reaching the target does not itself stop movement or alter the remaining die steps. These conventions resolve ambiguities in the brief; this is not an optimal exact-landing policy or a game-specific gate/star policy.

## Zero-step cycles: no fabricated landings

A closed pass-through cycle can prevent a roll from terminating. It is mathematically impossible to give its probability to an actual landing node honestly. Consequently, the normalization invariant is:

```text
sum(landing probabilities) + nonTermination = 1, exactly.
```

For almost-surely terminating inputs, `nonTermination` is zero, so the physical landing probabilities alone sum to one. A pass-through loop with an exit is resummed exactly; it is not cut off after an arbitrary number of visits. A pass-through node in a reachable closed recurrent class has infinite unconditional expected visits. Other pass-through nodes can still have finite expected counts on paths that eventually become trapped. Expectations are unconditional, not conditioned on termination.

Example: `S -> {P, A}`, where `P` is a pass-through self-loop and `A` is an ordinary sink. A positive face gives landing at A = 1/2, nontermination = 1/2, and expected passes at P = infinity. A zero face remains at S with zero passes.

Valid dead ends, loops, disconnected components, and unreachable targets do not cause topology errors. An empty graph returns an empty map. Malformed inputs such as duplicate node IDs, dangling edges, a missing required target, an invalid policy, negative/nonintegral/unsafe faces, or invalid die weights are rejected rather than silently repaired. Faces are nonnegative safe integers. Map keys such as `__proto__`, `constructor`, and an empty string are supported.

## Implementations and verification

The production implementation identifies closed pass-through communicating classes using iterative Kosaraju traversal, solves the remaining zero-cost closure by exact Gauss–Jordan inversion, and composes transition/reward kernels. It uses no recursion or simulation. Matrix operations are performed on reduced BigInt fractions. Binary powering uses logarithmically many kernel compositions, although exact numerators/denominators can themselves become large.

The required test oracle is `blind-reference.ts`, authored in an isolated directory by a separate agent from the movement contract and original prompt, before viewing production, tests, historical oracle, or algorithm documentation. Its SHA-256 was sealed before source exchange and the integrated file is unchanged. It solves each transient pass-through component by exact forward elimination/back substitution, then recurs across faces. `blind-authoring/` preserves the original authoring record, source, compiler configuration, self-check driver, and seal. The former `reference.ts` remains a historical supplement; it is compiled but is no longer the required test oracle. `support.mjs` separately implements rational arithmetic and literally enumerates finite paths without memoization, merging, or truncation.

Per seed, the full tests cover 2,000 random directed acyclic graphs with 1–25 nodes, plus 500 cyclic graphs with 2–25 nodes. The first 250 cyclic graphs guarantee that every cycle consumes a step and are also brute-force enumerated; the other 250 permit arbitrary pass-through cycles and use exact independent resummation. All starts, faces 0–10, both policies, randomized exact die mixtures, normalization, and node/edge order invariance are checked. See `VERIFY.md` for actual case and path counts rather than estimates.

Monte Carlo uses 50 independently generated boards per seed, one fixed documented start per board, and 1,000,000 complete roll trajectories per board: 150,000,000 trajectories across the three seeds. The second half of those boards include step-consuming cycles. The simulator follows graph edges directly, not a CDF returned by the engine. Branch and die sampling use rejection sampling from an explicitly seeded 32-bit generator. Physical landing outcomes and finite pass-count means must meet the four-standard-deviation threshold. The acceptance inequalities are evaluated with BigInts; floating-point z-scores are only descriptive. Pass-count variances are calculated exactly from enumerated second moments. Probability-zero and deterministic outcomes have zero tolerance. No seed reselection, sample truncation, or threshold widening is used.

The 25 mutations are isolated, not stacked. Each must compile strictly and then be killed by a runtime test failure; compilation errors do not count as successful kills. The focused regression/oracle/arithmetic/validation suite is used for mutation testing, not 150 million new simulations per mutant. `VERIFY.md` lists every defect and witness.

**Blind authorship provenance:** the new reference was completed and sealed before its author viewed any existing B02 implementation or tests. Every required comparison and mutation witness now uses that sealed reference. `INDEPENDENCE.md` records the boundary and artifact hashes. Passing differential tests establishes agreement on the tested cases; it does not establish universal correctness.

## Files and integrity

`boardOdds.ts` is the deliverable; `blind-reference.ts`, `reference.ts`, `support.mjs`, `test.mjs`, and `mutate.mjs` are verification code. `run.mjs` is the complete test orchestrator. `PROOF.md` derives the invariants. `VERIFY.md` and `evidence/` record completed runs. `SOURCES.md` records the repository and tooling references, not game-specific movement claims.

`SHA256SUMS.txt` covers all committed job files and `../../.github/workflows/B02.yml`; it excludes itself, `node_modules/`, `build/`, and `.verification/`. `node hashes.mjs` checks both file hashes and the complete manifest inventory. `node hashes.mjs --write` deliberately regenerates it after reviewed changes. No dependencies, build directories, or machine-specific symlinks are shipped.

CI has read-only permissions, no explicit secrets, a 30-minute job timeout, and only major-version-pinned `actions/*` actions. It runs the same `npm test` command, including all seeds, after a fresh locked dependency installation. A green run is claimed only after its result has actually been read from GitHub.
