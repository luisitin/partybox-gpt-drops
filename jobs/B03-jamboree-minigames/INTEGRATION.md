# B03 Every Jamboree minigame, catalogued → PartyBox integration guide

> For the owner's desktop Claude agent, who ports this into the main repo (luisitin/partybox, local C:/dev/partybox). Read this file first; everything else in this folder is the job's own record.

| | |
| --- | --- |
| Status | **Reference only** (research and design input; nothing to copy as code) |
| Branch | `job/B03-jamboree-minigames`. This pass's content commits: `14be225`, `bb47537`; the docs commit follows them (`git log -1` on the branch is the head) · PR #20 (draft) |
| Repo | luisitin/partybox-gpt-drops |
| Test | from the repo root: `python3 -m pip install -r jobs/B03-jamboree-minigames/requirements.txt` then `PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/verify.py --hashes` (about 20 s). The strict gate `--strict --hashes` exits 1 by design. |
| CI | green on `93d7848` (before this pass, hosted run 37685655223, read 2026-10-08). CI reruns on this pass's head; check the PR before you rely on it. |
| Lands in PartyBox | no folder today. A new party-board game (not in `games/`) would take its minigame pool from here; candidates are in `DESIGN-DIGEST.md` section 3. |

## What it is

A 132-row catalogue of the minigames in the Jamboree game and its TV additions, with per-row rules, controls, a two-sentence summary and a phone-touch fit. It is useful as a design map (categories, timer lengths, team shapes, phone fit). It is weak as a source of exact numbers: 189 of 1,320 narrow fact fields are corroborated and 0 of 132 rows are complete. Use it to choose shapes, not to copy rules.

## Take these files (the product)

| File | What | Goes to (PartyBox path) |
| --- | --- | --- |
| `DESIGN-DIGEST.md` | categories, ratios, timer medians, shape mapping, "what PartyBox should do" | a new `docs/research/party-board/minigame-pool.md` (rewritten in original words; no names) |
| `minigames.json`, `minigames.csv`, `minigames.schema.json` | the catalogue | stay in this satellite. Do not commit them to main: they carry the source names. |
| `quote-support-check.py` | the lexical check that flags claims needing re-read | stays here (a tool for future research jobs) |

## Leave these (evidence, tooling, reports)

`catalogue-sources.json`, `SOURCES.md`, `catalogue-conflicts.json`, `CONFLICTS.md`, `catalogue-second-pass.json`, `reports/**`, `*-leads.json`, `*-audit.json`, `source-*`, `current-*`, the `*.py` helpers and `verify.py`, the `validator-rejections*` files, `NAME-RESEARCH.md`, `GAMEPLAY-RESEARCH.md`, `HISTORICAL-INDEX-NOTES.md`, `LOOP.md`, `NEXT.md`, `VERIFY.md`, `ASSUMPTIONS.md`, `SHA256SUMS.txt`, `CI-WORKFLOW.yml`. They prove the rows; a port does not need them.

## Port steps

1. Decide whether the party-board game is in scope. Its board comes from B04 (space types, event density) and its dice and odds from B01/B02; its turn flow from B05/B06/B20. Read those before this file.
2. Choose the first set of 10 from `DESIGN-DIGEST.md` section 4.2: four free-for-all shapes (quiz, survival, collect, speed sort), two 1v3, two 2v2, one duel, one co-op. Every one must be phone-first (fit 4-5).
3. Rename each game and write its one-line rule in original words. Do not reuse a catalogue name, a character name or a catalogue description.
4. For each game, follow `docs/ADDING_A_GAME.md` (or the `add-game` skill): `pnpm new-game <id>`, then `server/index.ts` with `composeReduce`, timers as `phase.deadline` (`packages/game-sdk/src/timer.ts`), ranking through `packages/game-sdk/src/scoring.ts` (`rank`, `buildResults`, `speedPoints`).
5. Bots: `bot.sampleInput` takes the room's skill as its fourth argument (ADR-059, `docs/DECISIONS.md`). Keep `supportsBots: true`.
6. Team shapes map to the minigame modes `ffa | 2v2 | 1v3 | duel` of the satellite contract (ADR-087). That ADR is in the owner's newer local main and not in this checkout: rebase onto it before you wire modes.
7. Strings: every visible string through `L('…')` in `client/strings.ts`, with Spanish, and `manifest.es.json` (ADR-044/049). Manifest `howToPlay` is three steps of 90 characters or fewer (ADR-053).
8. Table and physics shapes use `packages/game-sdk/src/table3d/` only (ADR-071). Do not add a second 3D or physics library.
9. Docs and registry: `docs/games/<id>.md`, `pnpm gen-registry`, a CHANGELOG line, and the `docs/research/party-board/minigame-pool.md` file from the table above.

## Make it feel AAA in PartyBox (not a 2D bootleg)

Beat → TV → phone:

- **Round start.** TV: the ADR-053 start stage with the one rule and the 3-2-1, from `TvStartStage.tsx`. Phone: a preview of its one action, with the same colour as the player's chip.
- **Live field.** TV: the shared field, leader chip (`ui/LeadMark`, `ui/PlayerChip`), deadline bar (`ui/DeadlineBar.tsx`), and a 10-second cue. Phone: only the player's own action, targets at least 44 px, haptics from `ui/haptics.ts`.
- **Random reward (wheel, stone, hole).** TV: the device spins and settles with the spring curves in `ui/motion.ts` (overshoot ≤ 6%, settle ≤ 450 ms) and a `SOUND_CUES` entry from `ui/sound.tsx`. Phone: the reward appears as a chip. Show the mechanism before the result.
- **Elimination.** TV: the chip falls off with a `ui/Juice.tsx` burst. Phone: a calm "out" state, never a dead screen.
- **Results.** `lazyFinale`, `tv/Confetti.tsx`, a count-up with `Juice`'s NumberPop. A podium for 2nd and 3rd, under 4 s, skippable. Winner by name once.
- **Motion rules.** Animate only transform and opacity; every animation has a reduced-motion fallback (`prefers-reduced-motion`).
- **Colour rules.** Player colours always come with a face or a name (`--pb-player-1…8`, satellite B16). Never colour alone.
- **No camera or microphone in v1.** Those six rows (fit 1) need a permission and privacy design first.

## Known gaps and risks

Ranked: **must** (blocks use of a number), **should** (raises quality), **nit**.

- **must** 1,131 of 1,320 narrow fields are not corroborated; 0 rows are complete. `winRules` are single-source on all 132 rows. Re-read the source for any exact rule before you use it.
- **must** The quote-support check flags 325 of 869 claims for a human re-read (`reports/quote-support-check.json`): 121 category and 100 format claims rest on a title quote, 95 format and 34 score claims carry numbers their quotes lack, and 11 summaries contain numbers their quotes lack.
- **must** Seven summaries have no sentence-length quote at all (MG012, MG014, MG028, MG040, MG049, MG050, MG063); 110 rest on one lineage. Do not present these summaries as verified mechanics.
- **must** The names, character names and category labels (for example the Koopathlon, Kaboom-Squad, Survivathon and Bowser Live labels) belong to the source publisher. Rename all of them before anything ships. See the licence notes below.
- **must** Coin and star rewards are unknown: `stars` is null on all 132 rows, and `coins` is a text description on 4. The board needs its own reward economy; do not copy an award table.
- **should** 108 category claims were downgraded because the registry holds only the title. The legacy list heading appears in `SOURCES.md` but is not in the machine registry, so registering it could restore corroboration. This is the cheapest next gain.
- **should** 22 timer claims have numbers not in their quotes, some of them probably unit conversions ("1 minute" vs 60). Review before you use a timer.
- **should** Confidence is `low` on every row. That is honest: no row has every field corroborated.
- **should** No second complete wiki roster exists yet. Publisher agreement on count is not the two-wiki requirement.
- **nit** `minigames.csv` mixes JSON columns and plain text columns; parse the object columns with `json.loads`.
- **nit** `phoneFit` ratings are editorial. This pass rewrote 31 rationales (motion, camera, microphone) and kept every rating.

**Licence and IP notes.** Minigame names, character names, and the category labels are a publisher's trademarks; they must not ship in code, strings, art, or file names. The catalogue's summaries are original but describe a game's mechanics, so port them in your own words. Quoted source text is short (25 words or fewer) and is kept here only as research evidence; reuse of any wiki text needs a licence check (UNVERIFIED in this job). Mechanics and facts are fine to use; say in the port what was renamed.

**How it connects to other satellite deliverables.** B04 (boards: space types and event density set how many minigames a board needs), B01/B02 (dice and odds for item rounds), B05/B06/B20 (turn flow, CPU and modes), B16 (player colours), B17 (SFX), B18 (springs), B15 (icons), F03 (win screens), F05 (board camera). B07 (Yahtzee solitaire) shares dice with the Dice3d path.

## Verify after porting

- `pnpm verify` (the full gate) in the main repo.
- `pnpm sim --game <id> --players 2 --runs 200 --seed 1`, then `--players 4` and `--players 8` (the Kaboom-style co-op shape), with random and idle bots.
- `pnpm e2e:snap --game <id>` for every phase at 320×568, 390×844, landscape, 200% text and 1080p TV, and `pnpm polish-check --game <id>`.
- The job's own check, to confirm the source data still reproduces: `verify.py --hashes` and `quote-support-check.py`.

## Polish pass 2026-10-08 (Claude, cloud)

Checked: the full baseline (`verify.py --hashes`, 69 suites before the pass, strict NOT_MET), a sample of quotes against their claims, the category and format evidence, the gameplay summary evidence, the phone-fit reasons, and the open ledger. Changed:

- Downgraded 175 corroborated category and format claims that rested on title quotes alone (`14be225`).
- Added `quote-support-check.py` and its verifier suite; the verifier fails if a corroborated category or format rests on titles again (`14be225`).
- Applied the two-lineage, sentence-length rule to the 132 summaries: 110 to single_source, 7 to unverified, 15 stay corroborated; the verifier enforces it (`bb47537`).
- Rewrote 31 phone rationales (25 motion, 3 camera, 3 microphone) to name the phone's own sensors and microphone; ratings unchanged (`14be225`).
- Added `DESIGN-DIGEST.md`, a status README and this file; regenerated the manifest, the gap ledger and the second-pass bindings.
