# B01 Jamboree dice blocks + exact odds

**Research status: PARTIAL. Mathematical model and implementation tests: see the executed results in VERIFY.md.** This is not a fully two-source-verified reproduction of Nintendo's RNG. Missing independent bonus confirmation, TV parity and other open gates are explicitly listed under UNVERIFIED.

## The central correction

Jamboree does not give each playable character a distinct die. The 22 characters share the normal outcomes **1,2,3,4,5,6,7,8,9,10** (S01–S04; F01–F03). There are no +2/-2 coin faces to convert into movement here. A coin reward from a Payday or matching bonus is separate from movement, not a numeric die face. Older Super Mario Party character dice are intentionally excluded.

## Contents

- `dice.json`: 28 source records, 34 fact rows, all 22 character aliases, complete listed outcome sets, 12 items, compatibility decisions and 29 explicit mathematical models.
- `odds.json`: reduced fraction strings, exact ordered-outcome counts, movement/coin marginals, joint outcomes and expectations. `null` is unknown, never zero.
- `odds.ts`: immutable, pure lookup API. It does not generate probabilities, mutate callers or sample randomness.
- `engine-a.ts`: TypeScript recursive Cartesian enumeration using bigint arithmetic.
- `tests/blind/`: a sealed reference authored from the public contract and dice.json before production access; 41 hand-derived self-check assertions passed. Its exact tables and every ordered tuple are compared with production.
- `tests/montecarlo.cpp`: an accelerated test-only sampler, compared to the TypeScript generator and complete sampled outcomes for every model.
- `tests/oracle_b.py`: Python polynomial convolution and a separate ordered-tuple evaluator using integers/Fraction. It reads only the research input, not implementation A or the committed odds.
- `rng.ts`, `tests/run.mjs`, `tests/mutations.mjs`: injected seeded RNG, exact comparisons, three complete seeded runs and 25 one-at-a-time source mutations.
- `schema.json`: closed JSON Schema, Draft 2020-12, for both data documents; validated by the real `jsonschema` implementation.
- `SOURCES.md`, `CONFLICTS.md`, `VERIFY.md`: evidence, dissent, source-reopening results, per-row audit and actual test output.
- `reports/`: actual source captures for two fresh passes, complete row and quote audits, executed suite results, and compact Monte Carlo/mutation summaries. Full per-bin reports are regenerated in `.test-output/` and uploaded by CI.
- `SHA256SUMS.txt`: hashes of delivered job files and the root workflow; the checksum file itself is necessarily excluded.

The only repository path outside this job is `.github/workflows/B01.yml`, as expressly permitted by the repository README. No root build files or other jobs are changed.

## Run

Prerequisites: Node 22+, npm, GNU g++, Python 3.12+ and internet access for initial development-tool installation. Runtime lookup dependencies: **zero**. TypeScript and Python jsonschema are development/test dependencies only.

```sh
cd jobs/B01-jamboree-dice
npm ci --ignore-scripts --no-audit --no-fund
python -m pip install -r requirements-dev.txt
npm test
```

`npm test` compiles strict TypeScript and runs every suite for seeds **1,2,3**. No optional fast path, seed substitution or reduced Monte Carlo count is used. Each of the 29 models receives **10,000,000 trials per seed**, including each deterministic Custom choice: **870,000,000 total trials**. Character aliases are identity-tested; they are not misrepresented as 22 different dice or 22 independent simulation streams.

Reports and generated JavaScript go into ignored `.test-output/` and `.build/`. A complete run is CPU-intensive. The workflow runs the same command with read-only repository permission, a 30-minute limit, no secrets, and only major-pinned `actions/*` actions.

```sh
npm run build
node - <<'JS'
const {getCharacterOdds, getCustomOdds, movementProbability, jointProbability} = require('./.build/odds.js');
console.log(getCharacterOdds('pauline', 3).meanMovement); // "33/2"
console.log(getCustomOdds(7).movement['7']);             // "1/1"
console.log(movementProbability('double', 11));          // "1/10"
console.log(jointProbability('payday-triple', 21, 71));   // "1/1000"
JS
sha256sum -c SHA256SUMS.txt
```

## Interpret the models correctly

The normal, Double and Triple models use one, two and three independent uniform 1–10 outcomes. Creepy uses 1–3; Mushroom adds five. Custom has ten separate deterministic choices, not a randomized 1–10 policy. Tickets reuse the single-use effect; their disputed quantity distribution is not guessed. Super Creepy shares the affected player's Creepy model rather than inventing a three-die movement roll.

Payday adds the rolled total to the matching reward. Reported matching rewards are 10 for doubles, 20 for non-seven triples / 50 for triple sevens, and 30 for non-seven quadruples / 70 for quadruple sevens. Special rewards replace ordinary rewards. The +10 Double Dice matching reward now has independent player corroboration. The other listed matching rewards lack a second independent confirmation and remain medium-confidence rule inputs, despite exact arithmetic.

`together` supplies movement with unknown rewards. `together-reported-bonus` adds the single-source reported 10-coin match reward. Its modeled reward is the reported award; per-member team accounting was not observed. `mario-*` means a player has Mario as a buddy, not that playing as Mario gives a special die. The buddy contributes one extra 3–8 result, not one per item die. Eligibility of every possible character/buddy pairing is not modeled. Custom does not gain this extra result. A Creepy curse is canceled by Double/Triple/Custom rather than yielding 2d3 or 3d3.

`confidence` describes the recorded rule evidence; it does **not** upgrade the independent-uniform assumption into an observed fact. All random fractions are conditional on F32. Coin outputs are gross immediate rewards, excluding purchase cost, board interactions, unrelated buddy coin income and caps. No exact Luigi activation weights are guessed. TV availability is documented, but every inherited mechanic has not been independently retested in TV.

## Exactness and independence

Every possible ordered tuple is checked against both algorithms, as are every joint table, marginal and expectation. Fractions use integer arithmetic and are reduced. Monte Carlo compares both the joint movement/reward outcomes and each known marginal. For observed count c, sample size N and probability n/d, the four-sigma gate is checked without floating point:

`(c*d - N*n)^2 <= 16*N*n*(d-n)`

Impossible/mandatory outcomes are handled exactly. PRNG streams are reproducible from the base seed and model ID; rejection sampling prevents modulo bias. They are test streams, not a reconstruction of Nintendo's generator. The RNG closure contains explicit sampler state; the lookup and probability functions do not. The sealed TypeScript oracle was authored by a separate agent context before production or prior test-source access. `tests/blind/AUTHORING.md` records the inputs and `SEALED-SHA256SUMS.txt` preserves the original hashes. The original Python reference is retained as an additional algorithmic check.
