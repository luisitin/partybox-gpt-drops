# B11 Rummikub validator + best play → PartyBox integration guide

> For the owner's desktop Claude agent, who ports this into the main repo (luisitin/partybox, local C:/dev/partybox). Read this file first; everything else in this folder is the job's own record.

| | |
| --- | --- |
| Status | **Port with fixes**: the validator and exact solver are sound and verified; PartyBox needs the file split, a deterministic cap wired into its bot, and the joker-binding bridge below. |
| Branch | `job/B11-rummikub-solver` @ the head of the 2026-10-08 polish commit (`git log -1 --format=%h` on the branch) · PR #7 (open, non-draft as of 2026-10-08) · CI: `verify` green on 575139d (run 37654587097, 2026-10-07); the polish head's hosted run is linked from PR 7 and recorded in VERIFY.md |
| Repo | luisitin/partybox-gpt-drops |
| Test | `cd jobs/B11-rummikub-solver && npm ci --ignore-scripts && npm test` (full: all seeds, Python 3.12.14 + pinned NumPy/SciPy, ≈ 15–30 min on a loaded 4-CPU host; the quick part is `npm run build && node test/unit.mjs && node test/budget.mjs`) |
| Lands in PartyBox | `games/rummikub/server/exact/` (new directory: `types.ts`, `validate.ts`, `solve.ts`, `bind.ts`) · `games/rummikub/server/bot.ts` (sharp bot uses the solver with a cap) · `games/rummikub/__tests__/exact.test.ts` (new) |

## What it is

A pure, deterministic, zero-dependency TypeScript module. `validateTable`, `validatePosition` and `validatePlay` check an end-of-turn table under the official English 2019 Classic rules (runs ascending within one colour, no wrap past 13; groups of 3–4 with distinct colours; two jokers with explicit represented faces; rack-only opening of 30; full rearrangement after opening). `findBestPlay(position, { maxStates })` returns the exact maximum of new rack value, then rack tile count, over every legal end-of-turn table, with an optional deterministic cap.

How good: strong. The job's hosted suite passed on 1738f8c (and the head on PR 7 at 575139d is green); 150,000 literal small comparisons, 3,000 accelerator crosschecks and 624 independently solved large optima agree, with 75 of 75 planted bugs killed. The unbounded search has no universal latency guarantee; the cap in this pass is what makes a bot turn bounded. Head-to-head against PartyBox's own validator and bot (below): **0 disagreements in 151,376 melds**, **0 rule rejections in either direction** on the sampled plays, and the bot leaves value on the table.

## Take these files (the product)

| File (job) | What | Goes to (PartyBox path) |
| --- | --- | --- |
| `rummikub.ts`, lines for `validateTable`, `validatePosition`, `validatePlay`, `checkInventory`, `meldKey`, `copyTable` | Validator, types | `games/rummikub/server/exact/validate.ts` + `exact/types.ts` (split, see port step 1) |
| `rummikub.ts`, `findBestPlay` + `search` + memo helpers (lines from `interface Resource` to the end) | Exact solver and the new `SolveOptions.maxStates` cap | `games/rummikub/server/exact/solve.ts` |
| `rummikub.ts` `expansionLimit`, `SolveOptions` | Cap option | `games/rummikub/server/exact/solve.ts` |
| `test/unit.mjs` (61 hand-written cases, 40 joker cases) | Fixtures to port as vitest | `games/rummikub/__tests__/exact.test.ts` (port the cases as data; keep names) |
| `test/budget.mjs` | Cap boundary: cap = search size is identical, cap − 1 refuses | merge into `exact.test.ts` |
| `evidence/partybox-port/compare.mts` | The bridge: `bindMeld` derives `as` faces from PartyBox meld ids (run → start+index; group → common value, missing colours in slot order) | Copy the `bindMeld` logic into `exact/bind.ts`; the script itself stays here |

## Leave these (evidence, tooling, reports)

- `blindReference.ts`, `reference.ts`, `evidence/blind-seal/`, `evidence/blind-milp-seal/`, `test/milp-*`, `requirements-dev.txt`: the independent oracle and the SciPy/HiGHS accelerator. They are development-only Python and must not enter PartyBox (no SciPy in a game server; ADR-009 and the dependency rules). They prove the solver; the port does not need them.
- `test/*.mjs` harness, `evidence/ci-37652457475*`, `evidence/local-*`, `evidence/probe/`, `VERIFY.md`, `LOOP.md`, `NEXT.md`, `MUTATIONS.md`, `ALGORITHM.md`, `CONFLICTS.md`, `SOURCES.md`: evidence and provenance. Keep the rule citations (`SOURCES.md`) only as a reference in `games/rummikub/SOURCES.md`.
- `package.json`, `package-lock.json`, `tsconfig.json`, `.github/workflows/B11.yml`: the job's own build; PartyBox uses its root toolchain.

## Port steps

1. **Split the file.** `rummikub.ts` is 430 lines; PartyBox keeps files near 300 lines (tests 400). Create `exact/types.ts` (the `Color`/`Face`/`Tile`/`PlacedTile`/`Meld`/`Position` types and the `Failure`/`Validation`/`PlayValidation`/`SolveResult`/`SearchStats`/`SolveOptions` types), `exact/validate.ts` (`validateTable`, `validatePosition`, `validatePlay`, `checkInventory`, `meldKey`, `copyTable`, `copyTile`) and `exact/solve.ts` (`findBestPlay`, `expansionLimit`). Use named exports only. Import the colour list from `games/rummikub/server/domain.ts` (`COLORS`) rather than redefining it.
2. **Use PartyBox ids unchanged.** B11 tile ids are plain strings and the solver never parses them. PartyBox's `buildDeck()` ids (`red-5-a`, `joker-1`) work as-is. No mapping layer is needed; the mapping in `compare.mts` exists only because the generator used other ids.
3. **Bind jokers.** PartyBox melds carry no joker faces, but B11 requires them on the table. `exact/bind.ts` turns a PartyBox meld (ordered ids) into a `Meld`: `analyzeMeld` (PartyBox's own `melds.ts`) gives the kind and points; a run's joker at slot *i* is `start + i` with `start = firstNumber.value − firstNumber.index`; a group's joker is the common value with the missing colours assigned in slot order. Reuse `analyzeMeld` rather than re-deriving validity: the comparison found no case where the two disagree.
4. **Wire the sharp bot.** In `bot.ts` `planMove`: for `skill === 'sharp'`, build a `Position` (`table` = `bindMeld` of each meld, `hand` = the rack tiles, `initialMeldDone` = `opened`) and call `findBestPlay(position, { maxStates: EXACT_CAP })`. On `ok && action === 'play'`, emit `{ table: meld tile ids, rack: remainingHand ids }`, then keep the existing `validateCommit` gate as the authority. On `BUDGET_EXCEEDED` or any failure, fall through to the existing heuristic (`cascadeRack` and friends). Keep `easy` and `normal` unchanged. `EXACT_CAP = 1_000_000` to start (see gaps).
5. **Keep the bot pure.** No clock anywhere: the cap is a count of search expansions, so the same seed and events give the same move (contract invariant 4). Do not add a wall-clock timeout; PartyBox's `games/*/server` code forbids `Date.now`, `Math.random`, timers and I/O (contract invariant 2).
6. **Tests** (`__tests__/exact.test.ts`): (a) port the 61 unit cases from `test/unit.mjs` as data; (b) `budget.mjs`'s boundary; (c) a differential test: 2,000 seeded small positions where `findBestPlay` output passes `rules.validateCommit` and the PartyBox bot's output passes `validatePlay`; (d) the 1-player, late-joiner and all-idle cases stay in the existing `game.test.ts`.
7. **Docs in the same commit:** `games/rummikub/README.md` (the "Bot tactics" paragraph: sharp uses the exact search with a cap and a heuristic fallback; keep ≤120 lines), `games/rummikub/SOURCES.md` (add the B11 provenance: an independent solver, rules cited by URL, no code copied from rummle or decerto), `docs/games/rummikub.md`, an ADR in `docs/DECISIONS.md` (the next free number on the owner's main; this checkout's highest is ADR-081, so re-check before numbering) for "exact solver with a deterministic expansion cap; no clock", and a CHANGELOG line under Unreleased. `docs/DEPENDENCIES.md`: nothing (zero runtime dependencies).
8. **Fixtures and registry:** the solver adds no state, so `fixtures/*.json` stay valid. Run `pnpm sim --game rummikub --dump-fixtures --players 4` only if you change the state shape (you should not). No `gen-registry` is needed.

## Make it feel AAA in PartyBox (not a 2D bootleg)

B11 has no visible surface, so this is the presentation the solver enables. Everything below lives in the client (Felt, Tray, Tv) and touches no rule.

- **Think beat**: the active seat's bot shows a short "thinking" spotlight (≥ 700 ms, client-only, skipped when the move is a draw). The TV's active-seat glow ring (`--pb-accent-2`) lifts the name chip; nothing moves until the move is known.
- **Melds land, they do not teleport**: diff the old table against the new one and animate only the changed melds with FLIP (transform + opacity, 300 ms, the house ease). Moved joker tiles get a 600 ms spotlight ring, so a retrieved joker reads from across the room.
- **Opening 30**: when the first meld lands, count its points up with `NumberPop` (`ui/Juice`), then a single chime from the existing sound set. A new cue needs an SDK change and a DESIGN_SYSTEM row (see `docs/DESIGN_SYSTEM.md`).
- **Draw**: a bot that draws gets a quiet tile-back slide into the rack, never a flash.
- **Winner**: keep the existing `lazyFinale`; the solver does not change the finale.
- **Reduced motion**: every move above falls back to an instant cut with the same information (ring and count stay, the travel goes).

## Known gaps and risks

Ranked: **must** before merging into PartyBox, **should** for quality, **nit** for later.

- **Must: the file split** (port step 1). A 430-line file breaks the house size rule; the split is mechanical.
- **Must: cap calibration.** The cap is 1,000,000 expansions to start. On the job's own corpus (200 main calls per seed, 40-tile table and 20-tile hand, seeds 1–3) the maxima were 417,988, 321,871 and 646,064 expansions, so a cap of 1,000,000 refuses none of the 600 calls. The median cost was about 0.9–1.0 ms per thousand expansions on this loaded host (load average 19–25 on 4 CPUs; the timings are inflated). A cap is only useful if PartyBox's real positions stay below it; run `pnpm sim --game rummikub --players 4 --runs 200 --seed 1` and count how often the fallback fires before choosing the final value.
- **Must: the joker bridge** (port step 3). Joker faces are not in PartyBox state; they are derived. The derivation is tested by `compare.mts` (151,376 melds, 0 disagreements, and the sampled plays pass both validators); port the same test.
- **Should: bot strength changes.** On the sampled positions (`compare.mts`, 440 positions per skill, generator distribution, not a live-game sample), the heuristic bots miss a legal play that the optimum finds: sharp draws in 24 of 287 positions where B11 can play, and where both play it trails the optimum in 87 positions by 20.7 points on average (max 70). Easy trails in 110 positions by 32.3 on average. Making sharp exact is an owner decision about difficulty; measure win-rate in `sim` before shipping.
- **Should: no sequence certification.** B11 certifies only the end-of-turn table, never the animated manipulations, timers or draw/pool rules (its README says so). PartyBox's draft and undo flow is authoritative through `validateCommit`; do not treat a solver output as permission to animate an intermediate state the rules forbid.
- **Should: reason strings.** B11 returns machine codes (`INITIAL_UNDER_30`, `TABLE_TILE_LOST`, …). PartyBox's `rules.ts` strings are what players see, and they are English-only in `rules.ts`. Map B11 codes to `client/strings.ts` keys only if a solver reason ever reaches a phone; the bot never shows one.
- **Should: allocation.** Each `findBestPlay` allocates typed arrays (initially 32,768 slots, about 0.4 MB). Fine per turn on a server; reuse a module-level buffer only if you can keep the function pure (you cannot keep module-level `let` under the lint rules, so measure first).
- **Nit: rule variant.** Only the English 2019 Classic profile is implemented, with the retained-joker penalty at 30 (PartyBox's README agrees). The German edition's 25-point penalty and its immediate-manipulation wording are not implemented (see `CONFLICTS.md`).
- **Licence and IP.** No rulebook text, diagrams or artwork ship; `SOURCES.md` cites the English manual by URL and page. It quotes one short phrase from p.1 ("On turns after a player has made his/her initial meld"); remove it if you want zero manual text. **"Rummikub" is a trademark of its publisher.** PartyBox's game id and display name already use it (`games/rummikub/manifest.json`): that is the owner's call. The solver's header comment and this README use the name; in the port, rename the comment to "tile-rummy" if you want the code generic. No code is borrowed from rummle or decerto (the job cites none).
- **Connections.** No other satellite deliverable depends on B11. `games/phase-10/server/search.ts` is a similar exact search on another game; it shares a technique, not code. Promoting the cover search to `game-sdk` would need an ADR; do not import across games (ADR-009).

## Verify after porting

```sh
pnpm vitest --project games games/rummikub --run          # includes the new exact.test.ts
pnpm vitest --project contract -t "contract: games/rummikub" --run
pnpm sim --game rummikub --players 2 --runs 200 --seed 1
pnpm sim --game rummikub --players 3 --runs 200 --seed 1
pnpm sim --game rummikub --players 4 --runs 200 --seed 1  # log the cap-fallback count
pnpm e2e:snap --game rummikub                              # phone and TV screenshots, once the client is touched
pnpm verify                                                # the gate, before the commit
```

Also rerun the two-way comparison on the ported code: `PARTYBOX_ROOT=<main repo> tsx jobs/B11-rummikub-solver/evidence/partybox-port/compare.mts` against the new PartyBox checkout.

## Polish pass 2026-10-08 (Claude, cloud)

- **Solver: deterministic expansion cap.** `findBestPlay(position, { maxStates })`: over the cap it returns `BUDGET_EXCEEDED` and never a partial play; `maxStates` is validated (`BUDGET_SHAPE`). Default behaviour is unchanged: `evidence/probe/corpus-fingerprint.mjs` reproduces every per-call `states`, `memoHits`, `boundPrunes` and `candidates` for all 200 main calls of seed 1 against the hosted CI receipt (`fingerprintMatchesCi: true`).
- **Tests:** `test/budget.mjs` (new, in `npm test`): 128 positions, exact boundary, deterministic refusals, 9 malformed option shapes per position. Seeds 1, 2 and 3 pass.
- **Evidence:** `evidence/partybox-port/compare.mts` (the PartyBox comparison; numbers above; `compare-seed-1.json`).
- **Build:** the strict TypeScript build is clean after one narrowing fix (`expansionCap`).
- **Local full run:** `npm test` was started twice with the pinned Python 3.12.14 and stopped at seed 1. Run 1 stopped at `audit.mjs`, because an edit had moved the splice marker; it was restored. Run 2 passed every seed-1 suite through the mutations (25/25 killed) and stopped at the wall-clock bench gate (196/200 main calls and 7/8 warmups under 500 ms; the failing calls measured 515–799 ms while the host load average was 21–25). The hosted runner is the timing authority for this head.
- **Not changed:** the blind reference, the MILP evidence, the verified counts, the 500 ms gate and its receipts.
