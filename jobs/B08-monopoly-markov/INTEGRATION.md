# B08 Monopoly exact landing odds + ROI → PartyBox integration guide

> For the owner's desktop Claude agent, who ports this into the main repo (luisitin/partybox, local
> C:/dev/partybox). Read this file first; everything else in this folder is the job's own record.
> PartyBox paths and line numbers are as of luisitin/partybox `main` @ `26b85ba6` (2026-10-08).

| | |
| --- | --- |
| Status | **Port with fixes**: `boardOdds.ts` copies unchanged, but the bot wiring below is a recipe to write and tune with `pnpm sim`, and two settings fall outside the model (Speed Die, one-attempt jail). |
| Branch | `job/B08-monopoly-markov` @ `688d59e` (last product change; later commits are docs and evidence) · PR #14 · CI: green, the `verify` check on `9e54f29` (run 37795796856, checked 2026-10-08) |
| Repo | luisitin/partybox-gpt-drops |
| Test | `cd jobs/B08-monopoly-markov && npm ci --ignore-scripts --no-audit --no-fund && npm test`: about 1 min |
| Lands in PartyBox | `games/monopoly/server/board-odds.ts` (new, copied) · `games/monopoly/server/bot.ts`, `bot-policy.ts`, `index.ts` (upgrade: `sharp` bots) · a TV "hottest squares" beat in `games/monopoly/client/` fed through `tvView` |

## What it is
Exact long-run odds for the classic 40-square board: where a move ends (Jail 6.22% of moves when players pay out, 11.53% when they wait for doubles, then position 24 and GO), where a turn ends, and card arrivals. It also gives the expected rent one opponent pays per turn for any deed at any building level, in the edition's own money. It comes from an exact 120-state Markov chain (integer transitions over 9,216), checked against two independently authored solvers, three published tables, 720M simulated rolls and 135 planted mutants. Model limits: two standard dice, independent card draws, jail of up to three attempts.

## Take these files (the product)
| File | What | Goes to (PartyBox path) |
| --- | --- | --- |
| `boardOdds.ts` | Pure, import-free, name-free. Generated odds tables (bit-exact) plus `rentPerOpponentTurn`, `rentReturn`, `investmentOf`, `buildGain`, `hottestSquares`, `shareOf`, typed on PartyBox's `Edition['spaces'][number]` and `Edition['rules']`. 306 lines; PartyBox's ESLint `max-lines` (300, skipping comments and blank lines) passes on it (checked 2026-10-08). | `games/monopoly/server/board-odds.ts` |
| `preview/hottest-squares.html` | Design reference for the TV beat (open it; `?view=phone`, `?lang=es`, `?plan=stay`). Not code to ship. | Rebuild as `games/monopoly/client/HotSquares.tsx` + `hot-squares.module.css` |

## Leave these (evidence, tooling, reports)
- `monopolyOdds.ts`, `odds.json`, `roi.csv`, `data/*.json`: the solver and its outputs. `boardOdds.ts` already holds every number the port needs. The solver also carries Classic US names (`SQUARE_NAMES`, `PROPERTIES`) the port should not duplicate.
- `*.mjs`, `reference.ts`, `roi-reference.ts`, `blind-authoring/`, `reports/`, `*.md` except this file, `SHA256SUMS.txt`, `PRODUCTION-SEALED-SHA256SUMS.txt`, `CORE-SELFCHECK.json`: generators, independent re-derivations, seals and raw evidence. They prove the numbers; the port does not run them.

## Port steps
1. **Copy** `boardOdds.ts` to `games/monopoly/server/board-odds.ts` with no edits. A dry run on 2026-10-08 passed PartyBox's prettier, ESLint (the `games/**/server` purity bans and max-lines) and `tsc` under `tsconfig.base.json`. Server only: the phone budget is 41,472 B gzip per game (`scripts/bundle-budget.json`), and this review did not measure monopoly's phone chunk. Never import it from `client/`; the TV gets numbers through `tvView`. Measure with `pnpm check-bundle --list monopoly` before and after.
2. **Adapter.** Add `games/monopoly/server/bot-value.ts`, since `bot.ts` is 210 lines. It needs `holdingOf(s, owner, i, owners = s.deeds.map((d) => d.owner))`, which returns `{ level: s.deeds[i]?.level ?? 0, fullGroup: group(s, i).every((j) => owners[j] === owner) && kind === 'street', sameKind: <count of same-kind spaces with owners[j] === owner> }`. It also needs `incomeOf(s, owner, owners)`, which sums `rentPerOpponentTurn(i, e.spaces[i], holdingOf(...), e.rules)` over the owner's unmortgaged deeds and multiplies by the opponents still in. Passing `owners` lets one function value hypothetical trades and auctions. The edition data (`editionOf(s.edition)`) is used as is: on all three editions the 28 deeds, rents and rules and the 10 + 2 movement cards match B08's data exactly.
3. **Skill plumbing (ADR-059).** `index.ts:312` drops the skill: make it `sampleInput: (s, id, _rng, skill) => sampleInput(s, id, false, skill ?? 'normal')`, and add `skill: BotSkill = 'normal'` as a 4th parameter of `sampleInput` in `bot.ts` (`BotSkill` comes from `@partybox/game-sdk`). Keep `normal` and `easy` byte-identical to today's bot, so no golden runs need re-recording. B08 drives `sharp` only, until `pnpm sim` shows it should become the default.
4. **Sharp building** (`bot.ts:173`). Rank `buildOptions` by `buildGain(i, x, holdingOf(s, id, i), e.rules, Math.max(3, level + 1))`, highest first, with ties going to the lower level and then the lower index. The cash-reserve filter stays. The 20-of-22 result (`partybox-checks.mjs:126-129`) is about the single 2→3 step: the third house has the highest single-step gain per unit of cost on 20 of the 22 streets (the two browns peak later). This ranking uses a different number, `buildGain` to three houses from the current level, averaged over the buildings added. Whether that takes the best group to three houses first is **unverified**; check it with `pnpm sim` before relying on it. The `buildGain` docstring in `boardOdds.ts` repeats the single-step wording; the port keeps that file byte-identical, so the caveat lives here.
5. **Sharp trades and auctions** (`bot.ts:56`, `:75`, `:138`, `:196`). Value a bundle as its cash, plus the face price of its deeds, plus `policy.incomeTurns × (incomeOf(after) − incomeOf(before))` for this bot. Compare bots against the other party's gain the same way. The auction maximum becomes `min(available − cashReserve, price + incomeTurns × Δincome)`. Add `incomeTurns` to `BOT_POLICY`; start around 15 and tune it with step 8. **Unverified**: no PartyBox game has been played with these numbers.
6. **Jail stays as it is** (`bot.ts:31`). The jail, purchase and tax answers come from `promptAnswer`, which the reducer calls when the reading clock fires (`index.ts:217`, `:290`). No skill exists there, because InitContext does not carry `botSkill`. An odds-based jail plan needs that engine/SDK change and an ADR first (see gaps). If it is added: as a sharp bot, roll (stay) when no unowned deed is left and the opponents' summed `rentPerOpponentTurn(..., { plan: 'stay max' })` exceeds `rules.jailFine`; otherwise keep today's rule.
7. **Plan choice.** Pass `{ plan: 'leave ASAP' }`, the default, for the bots' valuations. When `settings.shortRules === 'newer'` (one jail attempt, `economy.ts:254`), 'leave ASAP' is still the closer model. When `settings.speedDie` is on, the odds are an approximation; say so in a comment.
8. **TV beat.** Have `tvView` (server) send `hot: hottestSquares(5)` and `orange: shareOf(...)`, using names from the edition so the client needs no odds. Optionally add `landings: number[]` (40 ints) to `State`, incremented in `phases/moving.ts` `arrive()`, so the beat can set "this game" against "a long game". Strings go through `L()` with Spanish in `client/strings.ts`; the preview's copy already exists in both languages: "Hottest squares" / "Casillas más calientes", "Where moves end, over a long game" / "Dónde acaban las jugadas, a la larga", "Pay & leave jail" / "Pagar y salir", "Wait for doubles" / "Esperar dobles", "Hottest colour set" / "Grupo más caliente", "1 move in N ends in Jail" / "1 de cada N jugadas acaba en la Cárcel".
9. **Tests.** Add `games/monopoly/__tests__/board-odds.test.ts` that pins:
   - `hottestSquares(3)` to squares `[10, 24, 0]`;
   - the sum of `perRoll` to 1 (1e-12);
   - `rentPerOpponentTurn(24, classic-us spaces[24], { level: 3, fullGroup: true, sameKind: 0 }, rules)` to ≈ 28.352;
   - that a sharp bot holding orange at level 2 builds a third house there before a first house elsewhere.
10. **Docs, same commit.** `docs/games/monopoly.md` gets a "Bot skill" and "Board odds" section, with B08 as the source. `CHANGELOG.md` gets an Unreleased line, `feat(monopoly): sharp bots value deeds by exact landing odds (B08)`. No new dependency. An ADR is needed only for step 6.

## Make it feel AAA in PartyBox (not a 2D bootleg)
- **Where:** a 6–8 s beat in `client/Finale.tsx` before "Final standings", while the board is already on screen. It could also be a VIP-menu "Board odds" card mid-game, never on an auto timer.
- **TV:**
  - The real `client/board3d/BoardScene.tsx` from the overview shot (`server/choreo.ts` for the shot plan, `client/board3d/camera3d.ts`; fx-lab F05 for a slow push-in).
  - Each top-5 square lights through the existing `lit` prop (`LitSquare3d`, `{ key, square, color, pulse }`). The colour is a heat ramp from the design tokens, never a player colour (B16: a colour always travels with its face).
  - Heat pillars rise per square in rank order, using table3d `Solid3d`/`Pulse3d`; the preview shows their proportions.
  - The right panel lists the top 5 with bars and `Juice` `NumberPop` count-ups, then the "1 move in 16 ends in Jail" fact and the hottest colour set.
  - Motion uses 150/300/600 ms steps with the one easing, so stagger the bars instead of running one long count-up (B18 springs for the pillars). Reduced motion shows the final frame.
- **Sound:** a rising tick per bar from the existing `SOUND_CUES` (B17 has candidates), and one cue on the beat change, within polish-check's 3 cues per 200 ms.
- **Phone:** the same top-5 list as a `PhoneStage` moment when `useCanSeeTv()` is false, with no inputs. Otherwise the phone keeps its results screen.
- **Winner moment:** unchanged. The beat hands over to the standings (F03 win screens).

## Known gaps and risks
- **Must:**
  - Bot skill plumbing (step 3). Today every room gets the same bot, and `normal` must stay byte-identical (ADR-059).
  - Jail, purchase and tax answers are made inside the reducer, which has no skill (step 6). An odds-based jail plan needs `InitContext.botSkill` (engine + SDK + ADR) or must apply to every level, with golden runs re-recorded.
- **Should:**
  - The Speed Die (`speedDie`) changes movement, and the odds do not model it.
  - The `newer` preset's one jail attempt (`server/phases/jail.ts:64-70`) is close to 'leave ASAP': the movement is the same, except that a doubles release ends the turn.
- **Should:** utility rent is a rule variant, not a bug.
  - PartyBox charges ordinary arrivals on the dice that moved the piece (`flow.ts:125`, `economy.ts:79`). A nearest-utility card arrival throws fresh dice (`flow.ts:126-131`).
  - `boardOdds.ts` models exactly that by default. The 2021 US rulebook asks for a fresh throw every time (`SOURCES.md`); that is `utilityDice: 'fresh'`, which is also what `roi.csv` uses.
  - Movement dice change one-utility rent by −1.3% (leave ASAP) or −5.0% (stay max) at position 12, and by +0.8% or +0.7% at position 28.
- **Should:** other things the model leaves out.
  - Decks: PartyBox rotates them (`flow.ts:101`) and a held GOJF card is out of the deck, while the model draws independently. Long-run card frequencies agree up to the GOJF holding; the size of the difference is **not re-checked numerically** and is expected to be small.
  - House rules the rent figures do not include: `jailRestrictions`, `rentImmunity`, missed rent claims (`rentMode`), and mortgaged deeds, which earn 0. The adapter must skip mortgaged deeds.
- **Nit:**
  - Names: "Monopoly" and the Classic US place names are Hasbro trademarks. PartyBox already ships them under the owner's personal, noncommercial note (`games/monopoly/README.md:5`). `boardOdds.ts` carries none, so the TV takes names from the edition. Do not port `monopolyOdds.ts`.
  - Long-run odds are not the early game, where everyone starts on GO, so TV copy should say "over a long game".
  - The preview's CSS board is a mock; use `BoardScene`, not its geometry.

## Verify after porting
- `pnpm verify`; `pnpm vitest --project games games/monopoly`
- `pnpm sim --game monopoly --players 2 --runs 200 --seed 1`, then `--players 6` and `--players 8`, then `--players 4 --runs 200 --seed 1 --skills normal,sharp`. Sharp should win more than its share; record the numbers in `docs/games/monopoly.md`.
- `pnpm e2e:snap --game monopoly` (the finale beat at 1080p, 390×844, Spanish and 5 themes), `pnpm polish-check --game monopoly --port <own>`, `pnpm check-bundle --list monopoly` (the phone is unchanged).

## Polish pass 2026-10-08 (Claude, cloud)
- **Checked:**
  - The existing suite was green, locally and in CI.
  - Read PartyBox's Monopoly engine, bot and editions, and compared all three editions with B08's data: 28/28 deeds, rent rules and movement cards are identical; the rent difference is 0.
  - Stationary sanity: Jail is the most-landed square, then position 24, GO, then position 19 or 25. Orange is the hottest set, red next. Go To Jail is 0.
  - Full `npm test` (results in `VERIFY.md`).
- **Changed:**
  - Added `boardOdds.ts`, the one typed, pure entry point for the port, generated bit-exact from the sealed solver (`18703be`).
  - Added the PartyBox suite to `npm test`: about 24,000 exact assertions and a 20,000-case totality fuzz per seed, a 20M-roll simulation per plan of turn ends, card arrivals and utility dice (none of which were simulated before), and 20 killed mutants per seed (`23b4554`).
  - Made nearest-utility card arrivals pay on fresh dice, as PartyBox does (`688d59e`).
  - Added the TV preview (`18703be`).
  - Rewrote the README, fixed about 60 missing spaces and a "Pay b50" extraction artifact in the docs, refreshed NEXT.md, and wrote this guide (docs commit).
- **Independent review 2026-10-08** (see `VERIFY.md`): fixed this guide's line count, paths, CI status and build-ranking wording, and the README's removed `utilityCardDice` field.
