# B12 — Ticket to Ride USA data + exact longest trail

**What this is:** the classic USA route catalog (36 cities, 100 physical tracks, 30 base tickets, the separate 1910 list, card counts, scoring table) and pure rules code: claim legality, ticket connection, exact longest trail, scoring and a seeded RNG.
**How to use it:** `npm ci --ignore-scripts && npm test` (pinned Node 22.16.0 in CI). Import `ttr.ts` for the rules and read `usa.json` for the data. The API is listed below.
**Status:** verified on PR #19 (exact-head CI green at `9a5d8c6`). The polish pass of 2026-10-08 added data cross-checks, budget timing and a solver comparison. This is reference material, not yet a PartyBox game. Read [INTEGRATION.md](INTEGRATION.md) (verdict: port with fixes).

Every fact has two citations from distinct authors. See [SOURCES.md](SOURCES.md), [CONFLICTS.md](CONFLICTS.md) and [VERIFY.md](VERIFY.md).

## Contents

- `usa.json`, `usa.schema.json`, `citations.json`: catalog, Draft 2020-12 schema and short evidence excerpts. Raw inputs are in `sources/`.
- `ttr.ts`: pure claim legality and application, ticket connectivity, exact weighted longest trail, scoring and `seeded`. Sealed primary (checksummed).
- `reference.ts`: independently authored second implementation, used as the differential oracle (`ORACLE.md`, `ORACLE_AMENDMENTS.md`).
- `validate.ts`: pure validator for the schema keywords used here. `validate_schema.py`: independent standards validator (jsonschema 4.26.0).
- `tests/`: 20,000 small graphs per seed (60,000 in total), 2,000 completed full games per seed (6,000 in total), data and schema audits, immutable goldens and 25 isolated mutations per seed, run for seeds 1, 2 and 3.
- `tools/polish-check.mjs`: polish-pass checks (`spot`, `budget`, `compare`, `map`). Outputs are in `reports/polish-2026-10-08/`.

## API (`ttr.ts`)

| Function | Contract |
| --- | --- |
| `canClaim(routes, game, claim)` | `boolean`. Never throws; returns `false` on malformed input. |
| `applyClaim(routes, game, claim)` | Returns a new `Game`. Throws `RangeError` on an illegal claim. |
| `ticketComplete(routes, ownedIds, ticket)` | `boolean`. The ticket's two cities are connected by owned routes. |
| `longestTrail(routes, ownedIds)` | Exact weighted trail length. Edges are used once; cities may repeat. |
| `scoreGame(routes, tickets, game)` | Route points, signed ticket points, and +10 to every tied longest trail. |
| `seeded(seed)` | LCG `1664525 / 1013904223`; the only randomness source. Throws on a non-safe-integer seed. |
| `CARDS`, `ROUTE_POINTS` | Colour tokens (`pink` is the printed purple) and the 1/2/4/7/10/15 table. |

Data shape: `usa.json.routes[] = {id, a, b, length, color, confidence, evidence}`, where `color` is `gray` or one of the eight colour tokens. `baseTickets[] = {id, a, b, points}`. `usa1910Tickets[]` adds `origin` (`new1910`, `baseReprint` or `mysteryTrain`). `ttr.ts` ignores the extra keys.

## Limits (measured; see reports/polish-2026-10-08/)

- Under the 45-train budget a player can own at most **27 routes**: the 27 shortest tracks already total 45 train spaces.
- The longest-trail search is exact and exponential in the worst case. Uniform budget-feasible sets: median 0.08 ms, p99 6.9 ms, worst 19.8 ms. A targeted search for large sets had a worst of 41 ms in the committed run and 635 ms in an earlier 4,000-set run on this loaded machine. The true worst case is not established, so call it once at game end.
- There is no game loop: no turns, market, hidden hands or bots. `tests/games.mjs` plays a legal seeded policy for verification only.
- Expansion scoring rules and the 33-ticket 2025 edition are not implemented.

## Rerun

Use Node **22.16.0**, Python 3.12+ and the pinned development tools:

```sh
npm ci --ignore-scripts --no-audit --no-fund
python -m pip install 'jsonschema==4.26.0'
sha256sum -c SHA256SUMS.txt
npm test
```

Production TypeScript has zero runtime dependencies. TypeScript 5.9.3 is only a development compiler; Python jsonschema is only a verification tool. Generated builds, mutation workspaces and raw test outputs are ignored. `npm test` strictly compiles every core, runs every suite under all three seeds and fails on any mismatch, survivor or malformed evidence. The GitHub workflow runs the same command and retains `test-output/` as a run artifact.

The polish checks are not part of `npm test`. Rerun them with `node tools/polish-check.mjs spot` and `node tools/polish-check.mjs budget`. `compare --owner <longest-trail.ts>` needs `node --experimental-strip-types`.

`longestTrail` uses edge masks with arbitrary-width BigInt, components, Euler conditions and exact search. There is no edge-count cutoff, timeout answer or sampled approximation. Positive weights are train lengths. Repeated cities, loops and distinct parallel edges are supported. It is not a simple-path or longest-shortest-path search.

## Product and evidence

- **Product:** `usa.json`, `usa.schema.json`, `ttr.ts`, `reference.ts`, `validate.ts`.
- **Evidence:** `SOURCES.md`, `CONFLICTS.md`, `ASSUMPTIONS.md`, `citations.json`, `VERIFY.md`, `ORACLE*.md`, `reports/`, `sources/`, `tests/`, `tools/`, `SHA256SUMS.txt`, `validate_schema.py`, `LOOP.md`, `NEXT.md`.

Recovery2026-10-09 repairs malformed record/inventory boundaries, retains caller
game/player metadata after a claim, and makes both differential comparison phases
fail on disagreement. The source-reopening component now checks pinned first-byte
hashes without requiring ignored PDF cache files. See NEXT.md and
reports/recovery-20261009 for exact original baseline proof, executable original
failures, focused controls, preserved oracle limitations and pending current
hosted acceptance. Original ReadyPR19 remains protected.

The corrected core53fe passed its complete original hosted package plus1872 focused assertions. Three substantive recovery reviews found no further player-visible gain; all results/failures are retained. Source work stops at the final handoff. PR27 records the exact final whole hosted observation and Ready state once they actually occur. Original Ready19 remains protected and unmerged.
