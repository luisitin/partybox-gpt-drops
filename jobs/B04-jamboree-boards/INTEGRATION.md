# B04 All Jamboree boards, space by space → PartyBox integration guide

> For the owner's desktop Claude agent, who ports this into the main repo (luisitin/partybox, local C:/dev/partybox). Read this file first; everything else in this folder is the job's own record.

| | |
| --- | --- |
| Status | **Reference only** (research and design input; nothing to copy as code or content) |
| Branch | `job/B04-jamboree-boards`. This pass's head is the branch tip (`git log -1`); the previous head was `484dbbf`. PR #18 (draft) |
| Repo | luisitin/partybox-gpt-drops |
| Test | from the repo root: `python3 -m pip install -r jobs/B04-jamboree-boards/requirements.txt`, then `PYTHONDONTWRITEBYTECODE=1 python3 jobs/B04-jamboree-boards/verify.py --structural --checksums` (under a second; 26 suites and 5,462 cases with the manifest check; 25 and 5,391 without it). `--strict` exits 1 by design. |
| CI | green on `484dbbf` (read 2026-10-08, before this pass). The workflow reruns on this pass's head when pushed; check PR #18 before you rely on it. |
| Lands in PartyBox | no folder today. A future board game (a new `games/<id>/`, with its own names) would take its space mix, shop lists and rule shapes from `boards.json`. |

## What it is

A research file for the seven current Jamboree boards: space-type counts for 16 profiles (baseline, TV Tag Team and angry), 35 shop profiles with 215 item rows, and the Star, event, phase, Homestretch and TV rules. Each row has a status and a quote. It is strong on the shape of a board: Blue and Red spaces make up 38 to 48 percent of every board, a Star at 20 coins, and a small set of event families. It is weak on exact numbers and layout: 93 of 518 factual rows are corroborated by a second publisher, there is no numbered adjacency, item effects are not recorded, and the current Steamer event is unknown. Use it to choose a board's shape and rule families, not to copy numbers.

## Take these files (the product)

| File | What | Goes to (PartyBox path) |
| --- | --- | --- |
| `boards.json` | The data: seven boards with count profiles, shops, events, phases, Homestretch, shared rules and statuses | Read by the port author. Write a hand-made typed subset in `games/<id>/content/`; do not generate a copy (see gaps). |
| `DESIGN-DIGEST.md` | The design reading (sections 1 to 7) and a PartyBox mapping (section 8) | Rewrite in PartyBox's words into `docs/games/<id>.md`. |
| `CONFLICTS.md` | The eighteen preserved conflicts and the per-board count gaps | Copy the conflicts into the port's `docs/games/<id>.md` as open questions. |
| `schema.json` | The JSON Schema that `boards.json` validates against | Use as the reference for the port's own content check. |

## Leave these (evidence, tooling, reports)

`SOURCES.md`, `sources.json` and `reports/` (source captures, row audits, reopen audits, context checks): they prove the research, and the port does not need them. `map-assets.json` holds citations and fingerprints for ten map images; the images themselves are not republished, and the port must not use them. `boards/*.md` are the per-board documents; they are reference only (the port reads `boards.json`). `verify.py`, `requirements.txt`, `validator-output.txt`, `VERIFY.md`, `LOOP.md`, `NEXT.md`, `ASSUMPTIONS.md`, `README.md` and `SHA256SUMS.txt` are the job's own record.

## Port steps

1. Choose a PartyBox-owned name, theme and board art for the game. No Jamboree name, board name, item name or price-in-name may ship. Scaffold with `pnpm new-game <id>` (copies `games/_template`), and read `docs/ADDING_A_GAME.md` and `docs/GAME_CONTRACT.md`.
2. Write the pure server model in `games/<id>/server/`. `reduce(state, event)` takes time from `event.now` and randomness from `state.rng`. Import only `@partybox/game-sdk`. Do not import from `games/monopoly`: games may not import other games. Reuse the pattern from `games/monopoly/server/walk.ts` (one timing table for dice, walk, landing and settle) and `choreo.ts` (a planner that splits a walk into segments), rewritten inside the game.
3. Author your own board graph. The research gives counts per type and regional links only, so pick a layout whose counts match one profile (baseline totals run from 51 to 104 spaces; Tag Team keeps the same total). Keep Pro and Homestretch changes as data, not as a second layout.
4. Economy: coins and Stars are integers in state (state at most 256 KB). The Star price is a constant; 20 coins is the corroborated standard price. Shops are a purchase phase with a stock list and price data. Pro stock (two of each item, no restock) is single source. Item effects are not in the research: write each effect yourself and record it in `docs/games/<id>.md`.
5. Events: choose 8 to 12 event kinds from the 38 rows. Start with the corroborated ones: Byway-style direction reversal, the bridge route change, the Last-Place Shop, the elevator fee, steamer knockback, the Thrift Store and the Markup Sticker. Treat every single-source number as a tunable. Each event is a reducer case; events set no timers.
6. Phases: periodic changes (a sale every fifth turn, a board-growth step every third turn) are functions of the turn number. Triggered changes (anger, tide, tower weather) are flags in state. Turn timers are data: set `state.phase.deadline` and let the engine send one `timer` event per phase (contract invariant 3). Use `packages/game-sdk/src/timer.ts`.
7. Homestretch (final five turns): Blue and Red spaces pay 6, a further event pays 12, and same-space landings trigger duels. Pro Homestretch has no random special event (corroborated). Set `estimatedMinutes` and check the finish bound (`estimatedMinutes × 3`, contract invariant 6).
8. Hidden information (`contract.config.ts`): shop stock and prices are public. Any hidden code, such as a vault-style guess, must stay out of `controllerView` and `tvView` (contract invariant 5). Views never throw.
9. Bots: implement `bot.sampleInput` (required, invariant 7) and the bot skill argument (ADR-059) so `pnpm sim` plays every phase.
10. Content: write `content/en.json` and `content/es.json` with fresh names and text. Use the game-sdk speech pieces for readings.
11. Fixtures: one per phase (start, periodic sale, Homestretch, duel, final turn, results) under `fixtures/`.
12. Client: put the board on the felt in `packages/game-sdk/src/table3d/` (ADR-071, one lazy chunk, ADR-077) with a flat fallback. The phone uses `ui/DeadlineBar.tsx`, `ui/Juice.tsx` and `ui/Tally.tsx`. The start stage is `packages/client/src/tv/TvStartStage.tsx` (ADR-053).
13. Docs and registry: `docs/games/<id>.md` (rewritten design notes plus the conflict list), `pnpm gen-registry`, one CHANGELOG line. Add an ADR only if the port changes the contract or adds a dependency (none expected).

## Make it feel AAA in PartyBox (not a 2D bootleg)

- **Stage:** a felt or wood table seen in perspective through `table3d` (ADR-071). Motion preference pauses the physics and keeps a calm flat board. The board is a loop of spaces in clear, paired colours (colour plus shape, never colour alone).
- **Beats (TV, then phone):**
  1. Roll: the TV dice tumble and settle (pattern from `games/monopoly/client/dice-roll.ts`). The phone's roll button shows "rolling" with the deadline bar, then the number.
  2. Walk: the token hops along the path with a slight arc and a spring landing (settle at most 450 ms). The camera follows. The phone shows the count of spaces left.
  3. Event landing: the space flips (rotateY, backface hidden) to show the event card with a name and one line. The phone shows the choice as big buttons (at least 44 px): keep or stop, one of three hives, a guess.
  4. Coins: a count-up (`ui/Tally.tsx`), a coin arc to the wallet, a +N pop on the phone. Numbers never jump.
  5. Star purchase: the Star rises from its spot, arcs to the buyer's chip and settles with a chime.
  6. Last-Place Shop (if used): a spotlight on the last-place seat and a banner "Last place: 15 coins and a purchase". Other phones show "Wait your turn" in muted colour.
  7. Homestretch: a five-turn banner, a turn counter at 96 px on the TV, and the Blue and Red spaces glow to show the doubled value. The phone shows "Final five turns: Blue and Red pay double".
  8. Board change (fire, tide, anger, tower weather): changed spaces morph in a wave with a 40 to 70 ms stagger; the phone list highlights them. Under reduced motion the change is a fade.
  9. Winner: confetti (`packages/game-sdk/src/tv/Confetti.tsx`), the name large, a podium for second and third, under 4 seconds and skippable.
- **Player colours, springs, sound and icons:** use the PartyBox player palette with a name and avatar on every chip. The springs (B18), sound (B17), icons (B15) and player colours (B16) follow their own jobs when they land; until then use the game-sdk pieces that exist. The board camera follows fx-lab F05 once it lands.

## Known gaps and risks

**Must**
- The research is partial. 93 of 518 factual rows are corroborated; eighteen conflicts are kept, not resolved; one event (the current Steamer Event Space) has no source-backed trigger or effect. Ship no single-source number as a fact; mark it as a tunable.
- There is no numbered adjacency, no gate endpoint (the Skeleton Key gates and Galleria escalators are unknown) and no shop position. The port authors its own graph.
- Item effects are not in the research. The rows record item names, prices and availability only. Every effect is a PartyBox design decision.
- Licence: names, prices, maps and artwork belong to Nintendo or its licensors. The port ships none of them. No map image is republished here.

**Should**
- Star placement is unknown on five boards (relocating Star, exact spaces unverified), and Star selection probabilities are null on all seven.
- The Homestretch special-event list and base doubling are single source. The Pro Homestretch behaviour and the second doubling (12) are corroborated.
- Tide, fire and anger cadences: one conflict (tides), one unresolved (anger converted types), the rest single source.
- Tag Team and angry count profiles, and the Pro stock and shop-period rules, are single source. No odd-length rounding of the shop period is established.
- Raceway shows one shop at a time (reported, low confidence).

**Nit**
- Galleria: Peach/Daisy availability, Shop Hop Box price (6 on the wiki, 8 in GameRant), Loadstone payout (20 or 10), stamp colour labels.
- Item names can carry effect amounts: "10-Coin Steal Trap" costs 1 coin on Galleria. Never parse a price from a name.
- Counts are baseline layouts, not Pro or post-Homestretch states.

## Verify after porting

- `pnpm verify`
- `pnpm sim --game <id> --players <min>`, then `--players 6` and `--players <max>`, each `--runs 200 --seed 1`
- `pnpm e2e:snap --game <id>` and `pnpm polish-check --game <id>`
- Game-specific: a test that the space counts equal the profile the port chose; a grep that no Jamboree name, price-in-name or map image appears under `games/<id>/`; a check that the Homestretch is the final five turns and that the game finishes inside `estimatedMinutes × 3` in every sim seed.

## Polish pass 2026-10-08 (Claude, cloud)

Checked (commands and results, actual output):
- `python3 verify.py --structural --checksums`: PASS, 26 suites, 5,462 cases, including `SHA256_MANIFEST` 71/71. Without `--checksums`: 25 suites, 5,391 cases (before this pass: 24 suites, 5,338). The case count also moves with the file count, since FILE_SIZE_LIMIT counts every file.
- `python3 verify.py --strict`: exit 1 by design. `FULL_FACTS_TWO_SOURCE=31/518` FAIL; `CURRENT_EVENT_TRIGGER_EFFECT=37/38` FAIL; `EXACT_NUMBERED_MAPS=0/7`; `STRICT_RESEARCH_RESULT=NOT_MET`.
- New suite `BOARD_DOC_TABLES_MATCH_JSON` 51/51: the 16 count tables and 35 shop tables in `boards/*.md` equal `boards.json` cell for cell.
- Product review: read all seven boards' events, phases, Homestretch and shops in `boards.json`; read the Mega Wiggler document in full; the prose of the other six documents was not re-read line by line. Doubtful facts are tagged in `DESIGN-DIGEST.md` ([S], [X], [?]).

Changed (one line each, with the commit):
- `verify.py`: added `BOARD_DOC_TABLES_MATCH_JSON` (board tables must equal the JSON), with the markdown table parser.
- `DESIGN-DIGEST.md` (new): design reading, mapping to PartyBox pieces, limits.
- `INTEGRATION.md` (new): this file, status Reference only.
- `README.md`: top block (what, how, status).
- `ASSUMPTIONS.md`, `LOOP.md`: one line each.
- `VERIFY.md`: this section. `SHA256SUMS.txt`: regenerated (70 job files plus the workflow line, 71 lines).

Not done in this pass: no source re-fetch (the offline verifier makes no freshness claim), no map image retrieved, no factual row changed, no PR comment, review, merge or close (GitHub is read-only for this job).

2026-10-09T10:50:43.256606+00:00: Current two Skeleton Key gate facts gain independent medium support for the missing3-coin price via complete original H1g editorial table versus Wiki price cell; existing complete MPL item row confirms gate use and both board names but its price is blank. All518values/516otherfacts/18conflicts unchanged; only4review fingerprints. 93/518 corroborated,406single-source,18conflicts,1unknown;37/38 events, originalNOT_MET/PR18Draft. See reports/skeleton-key-price-recovery-20261009.json. Original Namu250/Cel131 ledgers/gates/captures remain unchanged. Parent75900 whole original26/5697/94 structuralPASS/strict91FAIL37FAIL actual1 is historical; exact next whole hosted acceptance remains pending publication.
