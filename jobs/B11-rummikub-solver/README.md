# B11 Rummikub validator + best play

A pure, deterministic, exact TypeScript solver with zero runtime dependencies. Read [VERIFY.md](VERIFY.md) for current results and pending gates.

## Run

Use Node 22, then run:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm test
```

The full command strictly compiles all three TypeScript sources and runs every suite for seeds 1, 2 and 3. Each seed includes 50,000 positions with at most 14 physical tiles, all 40 joker fixtures, 25 individually planted source bugs, contract/metamorphic checks, 200 full 40-table/20-hand positions and eight distinct warm-up positions. The production timing bracket includes validation, search, reconstruction and its own output validation. Independent work is outside that bracket. Both p99 and the literal maximum must be at most 500 ms.

## Independent reference

`blindReference.ts` was independently authored from the original prompt, public API and official English 2019 rules before its author inspected production, old tests or the old reference. It was sealed and pushed at commit 8564ea3. Source/provenance and its 54 semantic selfchecks are preserved under `evidence/blind-seal/`.

The blind reference enumerates every physical subset for small inputs and uses a complete exact search for larger inputs. Every correctness case compares validity and optimum value/count with this reference. Every output is checked by both validators. The earlier same-author `reference.ts` remains historical supplemental material and is not the primary differential reference.

For the identical large corpus used by the full-state audit and timing benchmark, the reference computes fresh answers once per seed. A run-local ledger records each input hash, reference source hash, generator hash and independently computed answer. Both suites compare their fresh production answers to that ledger and revalidate both witnesses. No production solver answer is used to generate the independent ledger. The production solver has no cross-call cache.

## API and rules

`validateTable(unknown)`, `validatePosition(unknown)`, `validatePlay(before, afterTable)`, and `findBestPlay(unknown)` return explicit success/error values. Tiles have stable unique physical IDs; number tiles carry color/value, and placed jokers carry an explicit `as` face. Colors are red, blue, black and orange. Runs are ascending, groups unordered. Unknown extra JSON fields are ignored.

The objective is the sum of represented values of newly played rack tiles, then the number of rack tiles. A rack joker scores its chosen face; `rackPenaltyShed` separately reports its 30-point retained-rack penalty. The rack-only opening must reach 30 and preserve every old meld and binding. After opening, the entire table may be rearranged while preserving every old physical tile. Draw rules, turn ownership and timers belong to the caller. End-of-turn validation does not certify an animated sequence of intermediate retrieval/reuse operations.

The search is exact and unbounded. Finite measured corpora cannot establish a universal latency guarantee on every input and machine. `SOURCES.md` and `CONFLICTS.md` identify the official edition and disagreements.

## Delivery

The authorized workflow is `../../.github/workflows/B11.yml`. The manifest includes the workflow and delivery files, excluding generated output and itself. Each file is below 30 MB. Historical evidence is preserved; current full independent verification and hosted CI are still pending.
