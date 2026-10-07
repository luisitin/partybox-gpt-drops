# B10 Battleship probability-density AI

This drop contains a dependency-free TypeScript AI, exact joint-fleet inference,
importance-sampled joint inference, a separate array/set oracle, adversarial
regressions, live mutation tests, and reproducible game benchmarks.

Verification status is in VERIFY.md. The takeover adds sealed blind references and every-shot benchmark comparisons.
Final full-count latency verification is underway; no all-green result is claimed yet.

## Run

Node.js 22 or newer is required. From this directory:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm test
```

`npm test` type-checks/builds, runs every correctness and mutation suite for seeds
1, 2, 3, then plays **100,000 games per difficulty per seed**: 900,000 games total.
It fails on any numerical disagreement, surviving planted fault, repeated shot,
game error, Hard mean of 45 or higher, or any measured decision over 50 ms.
Do not substitute `npm run test:quick` for the full command. Quick mode is explicitly
marked incomplete. Generated results are in `reports/latest.json`; captured local
results and limitations are documented in VERIFY.md.

## API

```ts
import { createModel, initialState, chooseShot, recordShot, seededRng,
         probabilityDensity } from './battleshipAI.js';

const created = createModel(); // 10x10; labelled ship indices 0..4: 5,4,3,3,2
if (!created.ok) throw new Error(created.message);
const model = created.value;
let state = initialState(model);
const rng = seededRng(12345);
const shot = chooseShot(model, state, 'hard', rng);
if (shot.ok) {
  // Send ONLY public feedback to the AI. This is an illustrative miss, not a simulator.
  const update = recordShot(model, state, shot.value.cell, { result: 'miss' });
  if (update.ok) state = update.value;
}
const small = createModel(6, [2, 3]);
if (small.ok) {
  const density = probabilityDensity(small.value, initialState(small.value), rng,
    { mode: 'exact', maxNodes: 1_000_000 });
  // density.value.total and density.value.counts are BigInt exact fractions:
  // P(cell occupied by an afloat ship) = counts[cell] / total.
}
```

All returned failure values have `{ok:false,error,message}`. Exhausted sampling is
NOT evidence of contradiction. Exact search returns a budget error, never a partial
"exact" density. The model must come from `createModel`; do not forge its geometry.
Functions never mutate the supplied model or observations. The caller supplies the
RNG; its stream is consumed explicitly. There are no wall-clock reads in the AI.

Cells are row-major, `row * size + column`. Statuses: 0 unknown, 1 miss,
2 unresolved hit, 3 identified sunk hull. Ship identity is its fleet index; the
two length-three ships remain distinct. `hitShip` is optional; null means anonymous.
`State.sunk` contains a ship index and the exact known cells of that sunk hull.
`recordShot` refuses repeat shots, incomplete sink declarations, and relabelling
another ship's prior named hit. Adjacent ships are legal; no automatic water halo is
added around hits or sunk ships.

## Feedback and benchmark contract

The primary benchmark follows the classic Hasbro instructions: a hit identifies
the ship; a sink identifies the ship. Consequently all cells of a sunk ship are
already public knowledge. The simulator never passes untouched cells or its hidden
fleet to the AI. See SOURCES.md, Hasbro pages 2–3.

Anonymous hits are also supported **when the host explicitly reveals the exact
hull on sinking**. This is a separate feedback contract, not a claim that anonymous
hits alone identify a sunk hull when ships touch. A log with only a sunk ship's
length and no identifiable hull must not be converted to guessed sunk coordinates.
The requested 100,000-game figures refer to the named-hit classic contract, not to
an unstated anonymous-hit benchmark.

Benchmarks draw each labelled ship placement uniformly from its horizontal/vertical
positions and reject the ENTIRE fleet on overlap. This samples uniformly over legal
labelled fleets; it does not use the biased "retry only the colliding ship" prior.
The same placement seed gives all three difficulties the same hidden fleets.
Ships may touch. Each game runs until all 17 ship cells have been hit, not just the
first ship or a fixed turn cutoff. Setup and simulator time are excluded from per-shot
latency; model/state preparation inside `chooseShot`, sampling, exact search, and RNG
calls are included. No JIT warm-up or slow-shot outliers are removed.

## Algorithms

Easy chooses uniformly among unknown neighbours of unresolved hits, otherwise among
all unknown cells. Medium scores legal straight extensions of hits, otherwise hunts
on a residue class modulo the shortest remaining ship length (checkerboard while
length two remains). Hard uses exact complete-fleet counts when the raw candidate
product is at most 2,000, otherwise eight importance-sampling proposals and
Rao–Blackwell conditional marginals. It prioritizes hit-ship occupancy in target mode
and remaining-fleet occupancy on the hunt residue class. A failed sample batch gets
128 additional proposals; a second failure gets bounded exact search, not a hidden
heuristic fallback. Errors remain explicit if all budgets are exhausted.

For exact inference, every remaining labelled ship has one horizontal or vertical
placement; no two placements intersect, no placement intersects a miss/sunk hull,
all unresolved hits are covered, named hits are covered by the named ship, and an
afloat ship must contain an unknown cell (otherwise it should have been announced
sunk). A recursive bit-mask enumerator counts complete fleets only. With the explicit
search-node cap <= 2^32, integer counters remain exactly representable before their
conversion to BigInt. Large full-board exact enumeration can exceed the work budget;
that is reported rather than hidden.

For sampled inference, ships are ordered by candidate count, ties by index. At each
step compatible candidates have proposal weight `32^k`, where k is their anonymous
hit count. A candidate must also cover hits that cannot be covered by any future
ship. Its selection probability is its weight divided by the sum of eligible
weights. The product of inverse selection probabilities corrects the proposal to
the uniform legal-fleet prior. Incomplete or hit-inconsistent proposals contribute
zero. All legal complete fleets retain positive proposal support.

Conditional on each sampled fleet's other ships, every compatible placement of the
selected ship is enumerated uniformly. Averaging those conditional marginals with
the importance weights gives the reported Rao–Blackwellized estimate. Sampled
probabilities are **not exact fractions** and finite-sample ratios can be biased.
Effective sample size is a weight-concentration diagnostic, not an independent
confidence interval or an error guarantee. Increase `samples` for a more expensive
estimate; do not assume the 50 ms benchmark covers arbitrary caller-raised budgets.
The full legal-fleet marginal is not a normalized independent-ship heat map.

`Density.probability` includes unresolved hits but excludes fixed sunk hulls: its
sum is the number of cells in remaining ships, NOT one. `Density.target` is the
marginal occupancy belonging to ships that contain an unresolved hit.

## Files and integration

`battleshipAI.ts` is the production implementation. `test/oracle.ts` is the separate
array/set enumerator, validator and sample-reduction reference. `test/policy-oracle.mjs`
independently checks shot selection. `test/suites.mjs`, `test/mutations.mjs`,
`test/benchmark.mjs` and `test/run.mjs` implement verification using Node built-ins.
TypeScript 5.8.3 is pinned as a development-only dependency. Runtime dependencies: zero.

The only repository-root exception is `.github/workflows/B10.yml`, as authorized
by the repository README. It runs the full command with read-only permissions,
no secrets, a 30-minute timeout, and actions/* major-version pins. Every delivered
file is below 30 MB. `SHA256SUMS.txt` covers the payload except itself; its workflow
entry is relative to this job directory. Check it with `sha256sum -c SHA256SUMS.txt`.

## Independent verification

The production implementation predated the new reference author. `blindOracle.ts`
was sealed and pushed at f09cc5b and `blindPolicy.ts` at 63abeae before reading
production, the old oracle, job README, or tests. Exact densities are compared to
literal labeled-fleet enumeration. Every benchmark shot is independently replayed;
every Hard exact return is independently counted and every sampled return is
independently reduced from validated complete public audit worlds. No private
simulator fleet is passed to these checks. BLIND-REFERENCE.md records the exact
boundary and subsequent integration changes. The private proposal sampler is not
replicated by the blind author; the separately retained proposal-weight audits and
all 25 mutation checks supplement legal-world and conditional-marginal validation.

Readonly audit hull arrays may share the model/state's readonly hulls; consumers
must respect the declared immutable contract. Production and references do not
mutate their inputs. The complete three-seed build/static checks now run literally
three times in the full command.

The prior frozen verification is preserved in evidence/previous-VERIFY.md and the
original raw-reports.zip. The three >50 ms historical calls remain recorded. A new
1,000-game exploratory run matched all 44,751 shots and densities but recorded one
72.618 ms call; it remains a failed timing run in LOOP.md. Final 900,000-game
verification and exact-head hosted evidence are pending.

CI uses three full seed jobs and a required aggregation job after an observed30-minute timeout with the additional independent checks. The aggregate requires the complete900,000-game corpus and every per-seed gate; no seed job uses quick or reduced mode. Default `npm test` still runs allseeds locally.
