# B12 Ticket to Ride USA data + longest path → PartyBox integration guide

> For the owner's desktop Claude agent, who ports this into the main repo (luisitin/partybox, local C:/dev/partybox). Read this file first; everything else in this folder is the job's own record.

| | |
| --- | --- |
| Status | **Port with fixes** (data and rules are ready; the game around them is not built, and the longest-trail cost is listed below) |
| Branch | `job/B12-ttr-usa` · PR #19 (open, not a draft) · CI: green at `9a5d8c6` (run 37654164782, checked 2026-10-08). This polish pass lands on top of it; the branch tip is the current head (`git ls-remote`) |
| Repo | luisitin/partybox-gpt-drops |
| Test | `cd jobs/B12-ttr-usa && npm ci --ignore-scripts && npm test`, plus `python3 validate_schema.py` three times. CI runtime ≈ 5 min on GitHub runners |
| Lands in PartyBox | the existing game on the owner's design branch, not main: `games/ticket-to-ride/` on `chatgpt/ticket-to-ride-lane-t3` (tip `37cd37ae`). Server rules go to `server/` (`longest-trail.ts`, `claims.ts`, `connectivity.ts`, `final-scoring.ts`). The catalog goes to `content/`. |

## What it is

A verified USA catalog and the pure rules around it: claim legality, ticket connection, exact longest trail (edges used once, cities reusable), scoring with the +10 tie rule, and a seeded RNG. Every one of the 264 fact rows has two citations from distinct authors, and the catalogs agree with the owner's own `content/preparation/usa/map.json` on all 100 tracks. It is the strongest-verified piece of the set. It is not a game: there are no turns, market, hidden hands, phases, bots or UI.

## Take these files (the product)

| File | What | Goes to (PartyBox path) |
| --- | --- | --- |
| `usa.json` | 36 cities, 100 tracks, 30 base tickets, 69 1910 tickets (with origins), card counts, route points, parameters | `games/ticket-to-ride/content/usa/` (one catalog; the owner's `content/preparation/usa/map.json` is then retired or kept only for geometry) |
| `usa.schema.json` | Draft 2020-12 schema for the catalog | `games/ticket-to-ride/content/` (mirror as a zod schema in `content/schema.ts`; keep the JSON schema as the reference) |
| `ttr.ts` | `canClaim`, `applyClaim`, `ticketComplete`, `longestTrail`, `scoreGame`, `seeded` | `games/ticket-to-ride/server/rules.ts` (a formatted port copy; see gap 7) |
| `reference.ts` | Independent second implementation, used as the oracle | `games/ticket-to-ride/__tests__/` (differential oracle only; never imported by the game) |
| `citations.json` | Short evidence excerpts (≤25 words each) | `games/ticket-to-ride/SOURCES.md` (provenance), not the bundle |
| `ASSUMPTIONS.md`, `CONFLICTS.md` | Rule decisions and the source disagreements that were resolved | `games/ticket-to-ride/README.md` (its Edge cases section) and `docs/games/ticket-to-ride.md` |

## Leave these (evidence, tooling, reports)

`tests/`, `tools/`, `reports/`, `sources/`, `ORACLE*.md`, `VERIFY.md`, `SOURCES.md`, `LOOP.md`, `NEXT.md`, `SHA256SUMS.txt`, `validate.ts`, `validate_schema.py`, `.github/workflows/B12.yml`, `PROMPTS.md`, `README.md`. They prove the work; the port does not need them. The one exception is the Agnias MIT notice (`sources/agnias-LICENSE`), which must travel with any Agnias-derived file.

## Owner's existing work (reconcile before porting)

- **Design gate.** `games/ticket-to-ride/AGENTS.md` on `chatgpt/ticket-to-ride-lane-t3`: design branch only until the owner approves `docs/games/ticket-to-ride.md`. Its rules: pin the original USA rules and 30 tickets (not the 2025 revision); no guessed geometry; no approximate longest-trail solver; every view is an allowlist; pure reducer with `event.now` and `state.rng`.
- **Existing catalog.** `content/preparation/usa/map.json` (21.6 KB, `schemaVersion` 1, `calibration.status` `reference-only`, `productionApproved` false). Checked against `usa.json` on 2026-10-08 with `gh api` (read only): 36 cities, 100 routes, 22 double pairs, endpoints and lengths equal. The only difference is the colour label: `purple` there, `pink` (the API token) here. Decision: keep one catalog, use `usa.json`, and render `pink` as the printed purple.
- **Existing longest trail.** `server/longest-trail.ts` (100 lines, blob `90278c2c`) is an exact memoized search with an upper-bound prune and an Euler shortcut. It agrees with `ttr.ts` on 300 small random sets and on 1,000 budget-feasible sets (0 mismatches). Speed: 1.52 s total against 0.44 s for `ttr.ts` on the 1,000 sets, worst 55 ms against 27 ms (`reports/polish-2026-10-08/solver-compare.jsonl`). Its bound does not help at 40 random routes either (avg 0.80 s against 0.31 s). Recommendation: port the `ttr.ts` search, keep the owner's budget test, and run the differential against `reference.ts` in CI.
- **Existing budget test.** `__tests__/longest-trail-budget.test.ts` enforces a 1,000 ms per-player budget on 128 sampled legal networks and a hand-laid 45-train trail. Keep it. Add the worst sampled budget set (24 routes, 44–45 trains) as a fixture.
- **Scoring.** `final-scoring.ts` already uses the same rule as `scoreGame`: ticket points ±, +10 to every tied longest trail, equal scores share a rank. Keep the owner's `finalStandings` shape and feed it the `ttr.ts` longest trail.

## Port steps

1. Confirm the owner approves `docs/games/ticket-to-ride.md`. Until then this stays reference.
2. Put `usa.json` under `games/ticket-to-ride/content/` and mirror its schema with the SDK's `z` (never import `zod` directly). Decide what happens to `content/preparation/usa/map.json` (see above).
3. Copy `ttr.ts` to `server/rules.ts` with formatting and types fixed for the repo's lint (one statement per line; the pure-server ban list applies). Map `{id, a, b, length, color}` to the owner's `GraphRoute {id, from, to, length}` in one adapter. Do not edit `ttr.ts` in this checkout: it is checksummed evidence.
4. Replace `seeded` with the SDK's `state.rng` (`nextInt`, `shuffle` from `@partybox/game-sdk`). `seeded` is for tests only.
5. Call the longest trail once, in `results()` through `finalStandings`, at game end. Never per claim: the worst case is exponential (gap 2).
6. Views: the phone sees only its own hand, tickets and legal claims. Other hands, ticket hands and the deck order never cross the wire. The owner's `preparation-views.ts` and `ticket-selection.ts` are the places to check for this allowlist; confirm they do it before reusing them.
7. Bots: `tests/games.mjs` is a verification policy, not a bot. Write `bot.sampleInput` with easy, normal and sharp skills (ADR-059), using `canClaim` and `ticketComplete`.
8. Tests: keep the three-seed differential against `reference.ts`, the budget fixture, and the owner's `__tests__`. Add the 1-player, drop, late-joiner, all-idle and tie cases from the game-pack DoD.
9. Docs: `games/ticket-to-ride/README.md` (≤120 lines), `docs/games/ticket-to-ride.md`, and `THIRD_PARTY_LICENSES.md` (Agnias MIT, Rob217 data attribution). Use an original game name (gap 3).
10. Registry and checks: `pnpm gen-registry`, then `pnpm verify`.

## Make it feel AAA in PartyBox (not a 2D bootleg)

- **Stage.** An original map drawn as SVG on the night-theme board (tokens from `tokens.css`), tilted in CSS perspective (rotateX 30°, 1,400 px) with layered shadows. Use the `Stage` and `BigText` primitives. The map art must be original (gap 3).
- **Claim beat.** Phone: the legal routes lift and light, the illegal ones dim. A claim sends a train piece along the track arc (FLIP, spring settle ≤450 ms). The track fills with the owner's colour (B16). The score counts up (`NumberPop`). Sound: a short click (B17).
- **Ticket beat.** A completed ticket flips (rotateY) and its route lights on the map. An incomplete one at game end shakes once.
- **Longest trail beat.** The winning trail draws itself as a glowing sweep, then the +10 badge pops on each tied player. Camera: the F05 rig and spot follow the sweep.
- **Winner.** The F03 results finale with a podium for 2nd and 3rd, under 4 seconds and skippable.
- **Icons and motion.** B15 icons for trains and tickets; B18 springs for the settle.

## Known gaps and risks (ranked)

**must**

1. **Not a game yet.** B12 has rules and data, but no turn loop, market, hidden hands, phases, UI or bots. The owner's branch has those pieces (`market-*`, `preparation-*`, `turn-actions`). The port wires the verified rules into them.
2. **Longest-trail cost has no proven bound.** Under the real 45-train budget a player owns at most 27 routes. Uniform budget-feasible sets: median 0.08 ms, p99 6.9 ms, worst 19.8 ms (400 sets). A targeted search for large sets: worst 41 ms in the committed run, 635 ms in an earlier 4,000-set run on a loaded machine. Unproven and not bounded. Mitigation: once at game end, keep the budget test, add the worst fixture, and treat any new sampled worst above 1 s as a failure to investigate. The owner's bound did not reduce the tail on these inputs.
3. **IP and naming.** Ship no "Ticket to Ride" name, no Days of Wonder map art, card art or trade dress. The facts are fine: city names, route lengths, colours, ticket city pairs and points, card counts and the scoring table. Rename the game (an original name) and draw an original map. Paraphrase rule text; do not copy rulebook prose. Keep the Agnias MIT notice with its files and credit Rob217 for the coordinates. `usa.json` already uses only facts.
4. **Edition.** Only the classic 30-ticket USA edition is implemented. The 33-ticket 2025 revision, the 1910 Globetrotter and variant bonus rules are not. The 1910 list carries origins; ship it only behind an explicit edition setting.
5. **Catalog duplication.** The owner's `map.json` and `usa.json` disagree only on the colour label. Pick one (see Port step 2) and retire the other.

**should**

6. **Input size.** The budget caps input at 27 routes, which the port should state in the game README so no one expects a large-graph solver.
7. **Dense formatting.** `ttr.ts` is one statement per line with long lines, so it is hard to read. Its SHA-256 is listed in `SHA256SUMS.txt`; the oracle seal in `reports/oracle-archive/` covers the original `reference.ts`, not `ttr.ts`. Port a formatted copy; keep `ttr.ts` here as evidence.
8. **Language.** City and ticket names are English proper nouns. UI strings need Spanish (ADR-044); city names in Spanish are optional (ADR-054).
9. **Node pin.** CI pins Node 22.16.0. The local polish reruns used Node 22.22.0, the only 22.x available here. The reproducibility claim is for the pinned CI run.

**nit**

10. The `reports/` and `tests/` folders are large evidence. They are not part of the port.

## Verify after porting

- `pnpm verify`
- `pnpm sim --game ticket-to-ride --players 2 --runs 200 --seed 1` and `--players 5 --runs 200 --seed 1`
- `pnpm e2e:snap --game ticket-to-ride`
- `pnpm polish-check --game ticket-to-ride --port <own port>`
- Game-specific: `cd jobs/B12-ttr-usa && npm test` stays green; `node tools/polish-check.mjs spot` passes on the ported copy; the port's `longestTrail` matches `reference.ts` on the same sets; the 1,000 ms budget test passes.

## Polish pass 2026-10-08 (Claude, cloud)

- **Checked.** Source cross-check (`spot`, 6 checks, all pass); 45-train budget limits and timing (`budget`); owner's solver differential and timing (`compare`, 0 mismatches on 300 + 1,000 sets); owner's `map.json` diff (100 of 100 routes, colour label difference only); full `npm test` and three schema audits (results in VERIFY.md).
- **Changed.** `README.md` (status block, API, limits); this file; `tools/polish-check.mjs`; `reports/polish-2026-10-08/` (spot-check, budget, solver-compare, map SVG and PNG); a dated section in `VERIFY.md`; one `LOOP.md` line; `SHA256SUMS.txt` regenerated for the changed docs and the new files.
- **Not changed.** `ttr.ts`, `reference.ts`, `usa.json`, `usa.schema.json`, `citations.json`, `sources/`, `reports/oracle-archive/` and every other sealed or sourced file. Their checksums still match.
