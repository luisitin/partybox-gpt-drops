# B05 Turn flow, exact strings, bonus stars → PartyBox integration guide

> For the owner's desktop Claude agent, who ports this into the main repo (luisitin/partybox, local C:/dev/partybox). Read this file first; everything else in this folder is the job's own record.

| | |
| --- | --- |
| Status | **Reference only.** Consult the timeline and the decisions it lists. Copy no code, no text and no names from this drop. |
| Branch | `job/B05-jamboree-turn-flow`, polish commit recorded in PR #9 history (prior head `a84fd4e`) · PR #9 (draft) · CI: green (`verify`, run 37675945275, head `a84fd4e`, checked 2026-10-08) |
| Repo | luisitin/partybox-gpt-drops |
| Test | `cd jobs/B05-jamboree-turn-flow && python3 -m pip install -r requirements.txt && python3 verify.py --structural --checksums && sha256sum -c SHA256SUMS.txt`. Strict research gate: `python3 verify.py --strict` (expected exit 1). Runtime: about 2 s (measured 2026-10-08). |
| Lands in PartyBox | New game `games/party-world/` (working name; the satellite contract calls the ADR-087 board game "Party World"). Not in this checkout. Existing pieces it reuses: `packages/game-sdk/src/awards.ts` (`pickAwards`), `scoring.ts` (`buildResults`). |

## IP: read this before porting (loud)

> **Do not ship any text from this drop.** Every quoted line (`strings.json`, `sources.json`, `SOURCES.md`, `reports/source-captures/`) is verbatim game dialogue or game text. The nine bonus-category labels, the event names and the title word "Jamboree" are Nintendo product names. Facts and mechanics (the 20-coin Star price, the 10/15/20/25/30 turn choices, what each counter measures) may be used. Re-describe each mechanic in original words, give every category and event an original name, and write every on-screen and spoken line as new copy in English and Spanish.
>
> The `strings.json` ids (`ann-start`, `host-welcome`, …) are kept only as role keys, so a port knows which moment each line serves. Never copy a value from that file.

## What it is

A research draft of one party-board game in this family: setup, order roll, one turn step by step, round end and minigame choice, Homestretch (the last five turns), the final turn, the ceremony, the nine bonus-star counters, and the Pro and Frenzy deltas. It also holds 22 short quoted host and announcer lines, each with a source URL.

How good it is, honestly: the ordering is an editorial framework, not a trace of the real engine. Of 95 claim rows, 33 have two independent sources. All nine bonus tie procedures are unverified (0 of 9), and the zero-recipient and cardinality rules are open. Item use versus Buddy ordering, the branch prompt and landing priority are unknown (U02–U06). It is a good map of the decisions a port must make. It is not a spec to implement behaviour from.

## Take these files (the product, re-worded)

| File | What it gives | Goes to (PartyBox path) |
| --- | --- | --- |
| `turnflow.md` §2–§6 | The ordered timeline: setup, turn, round end, Homestretch, final, ceremony. Take the structure only and rename every label. | `docs/games/party-world.md` (new) and the `games/party-world/README.md` spec (≤120 lines, its Phases section) |
| `bonusStars.json` → `bonuses[].metric`, `direction`, `policyClaimIds`, `awardPolicies` | Counter definitions and direction (max or min), plus the count rules by length and setting. These are facts. | `games/party-world/server/awards.ts` (new), using `pickAwards` |
| `homestretch.json` | The Homestretch effect list and its preconditions. Take the structure, not the names. | `games/party-world/content/homestretch.json` with original names, validated by `content/schema.ts` (zod) |
| `strings.json`, keys only (`id`, `speaker`, `when`, `medium`) | The moments that need a line and who speaks it | Keys in `games/party-world/client/strings.ts` with new English and Spanish copy, plus `manifest.es.json` |
| `schema.json` | JSON Schema for the data shapes (not a PartyBox schema) | Replaced by zod in `content/schema.ts`. Not copied. |

## Leave these (evidence, tooling, reports)

- `SOURCES.md`, `sources.json`, `claims.json`, `CONFLICTS.md`, `RESEARCH-LEADS.md`, `recheck.json`, `reports/` (contains verbatim quotations). They prove the rows. They stay in the drops repo because they hold game text.
- `verify.py`, `requirements.txt`, `validator-output.txt`, `SHA256SUMS.txt`, `VERIFY.md`, `LOOP.md`, `NEXT.md`, `ASSUMPTIONS.md`. Job tooling. PartyBox uses `pnpm verify`.
- Every string value in `strings.json`. See the IP box.

## Port steps

1. **Scaffold.** Run `pnpm new-game party-world` and follow `docs/ADDING_A_GAME.md` (the `add-game` skill). Proposals for the manifest, each to be confirmed by the owner: `minPlayers` 2 and `maxPlayers` 4. The drop shows four players per round ("after all four players have moved") and gives no evidence for 2 or 3. `supportsBots: true`. `presence.needs`: the board is read on the TV, so `same-room` is the default to argue for. `estimatedMinutes`: no source gives play time, so measure it with the sim before setting it.
2. **Settings** (confirmed in the drop, medium to high confidence): turn limit from {10, 15, 20, 25, 30} (only the endpoints are confirmed in two sources, so the middle values are medium); bonus awards Off, Random or Classic (high); round minigame chosen by Random or Vote (high). Pro and Frenzy arrive as `settingsVariants` (see the B20 INTEGRATION.md), not as separate games.
3. **Phases** in `games/party-world/server/phases/` (one `enterX` plus `reduceX` each): `order` (order roll, exits on all rolled, deadline or VIP skip), `intro`, `turn` (sub-steps item → roll → move → interactions → landing), `roundEnd`, `minigame` (the round game, through the ADR-087 minigame mode), `homestretch` (the last five turns), `final` (final turn and final minigame), `ceremony` (awards, then the winner). Every phase needs a deadline, an all-done exit and a VIP skip (invariant 6). Each turn sub-step needs its own rule record, not an inferred one.
4. **Turn-order decisions** that the drop leaves open (U02 to U06): item use and Buddy-start ordering, the branch prompt, landing-effect priority and interruption priority. Decide them in an ADR (ADR ≥ 088 in the main repo), then write one test per decision.
5. **Dice.** Ordinary movement uses a 1–10 Dice Block (TURN01, high). The main repo's `Dice3d` supports pips 1–6 (primer §3). Extend `Dice3d` faces the same way the Shake Up port extends it. Do not add a second dice or physics library (ADR-071).
6. **Board.** Reuse the approach of `games/monopoly/server/walk.ts` (one-space hops) and `games/monopoly/server/choreo.ts` (camera shots), and the `games/monopoly/client/board3d/` pattern. Write a new topology. Do not copy Monopoly's squares or deeds.
7. **Coins and Stars.** A Star is bought for the ordinary 20 coins (TURN04, high, two lineages). A purchase can be offered while passing, without landing on the Star space (TURN03, medium). A Buddy allows two purchases (TURN05, high). The Buddy mechanic is new here. The B20 Jamboree Buddies record covers the same mechanic.
8. **Bonus stars.** Use `pickAwards` (`awards.ts`) to choose categories, one counter per category in state, and `buildResults` for ranking. Count rules: random awards give 2 categories at 10 to 25 turns and 3 at 30 (COUNT01, high). Classic gives Rich and Eventful below 30 turns and adds Minigame at 30 (COUNT02, medium). Off disables them (COUNT03, high). Pro announces one category before play (COUNT04, high). Awards are added before the winner is picked (END03, high). `results()` must list every player from `init` with finite scores (invariant 7).
9. **Ties and no recipient** are unverified (TIE01 is a conflict, TIE02 is single-source, all nine tie rows are null). Treat this as a design decision that needs an ADR. Keep the option open: ties share the award, and a category may have no recipient, which the host transcript attests (TIE02). Test both.
10. **Strings.** English keys in `client/strings.ts` with Spanish alongside, plus `manifest.es.json` (ADR-044 and ADR-049). Announcer lines go through the `@partybox/game-sdk/speech` reader (ADR-045). Role map: start, minigame intro, new turn, Homestretch, final turn, final minigame, congratulations, finish, winner, tie, and one host line per bonus category. All of this text is new.
11. **Sound.** Map moments onto existing `SOUND_CUES` (`packages/game-sdk/src/ui/sound.tsx`): `start` (board begins), `phase` (round or Homestretch change), `countdown` and `tick` (turn timer), `reveal` (a landing), `wager` (Star purchase), `jackpot` (a Star won), `bust` (a trap or Red space), `sweep` (a Buddy taken), `tie` (a shared award), `fanfare` and `win` (ceremony). A new cue needs an SDK change and a DESIGN_SYSTEM row.
12. **Bot.** `sampleInput(state, playerId, rng, skill)`, with the policy from B06 (see that INTEGRATION.md). The bot must never stall a turn: if the policy returns null while a legal action exists, fall back to the first legal action.
13. **Tests and docs.** `__tests__/game.test.ts` with `testKit`, `__tests__/contract.config.ts` (declare hidden item choices until the reveal), a fixture per phase (`pnpm sim --game party-world --dump-fixtures`), `docs/games/party-world.md`, `pnpm gen-registry`, a CHANGELOG Unreleased line, and ADRs for the 1–10 Dice Block and the tie and no-recipient rule.

## Make it feel AAA in PartyBox (not a 2D bootleg)

The TV board sits on `TableFelt` in the `table3d` stack. The camera `rig` follows the active pawn. Movement is one-space hops with a spring settle (`table3d/smooth.ts`). Dice tumble through `Dice3d` (1–10 faces, step 5) and land on the server clock. Beats:

- **Turn starts.** The active seat lifts with a `Pulse3d` spotlight and its name chip rises. The phone shows one large `PrimaryButton` ("Roll") with the turn number.
- **Landing on a coin space.** Coins arc to the player's chip, with a `Burst` and a `NumberPop` count-up. Sound: `reveal`, then `tally`.
- **Star offer while passing.** The TV shows a Star spinning in `Spin3d` with a `countdown` ring. The phone shows two large `ChoiceGrid` buttons, Buy and Pass. Buying plays `wager`.
- **Round minigame vote.** Three cards flip on the TV (`face-picker` style). Phones vote through `VoteList`.
- **Homestretch.** A full-width banner with the `phase` cue. The board lighting shifts; `post` bloom drops on slow frames automatically.
- **Ceremony.** Bonus categories slide in one at a time, each with a `Tally` count-up and recipients glowing. The winner moment comes from `lazyFinale` with `fanfare`, with a podium for second and third, under 4 seconds, and skippable.
- **Phones during other turns.** A calm `WaitingScreen` naming who is up. Never say "look at the TV" unless `useCanSeeTv()` is true.
- **Reduced motion.** Every spring becomes a fade. Nothing is lost.

## Known gaps and risks

Must:
1. **IP.** Every name and every line must be replaced (see the box). The failure to avoid is shipping Nintendo text.
2. **Ties and no recipient** are unverified (0 of 9 tie procedures). Decide them in an ADR and test both branches.
3. **Turn order** is unknown (U02 to U06): item timing, branch prompt, landing and interruption priority. Decide and record each.
4. **Dice Block 1–10** needs `Dice3d` face support (pips 1–6 only today).

Should:
5. **Homestretch pool.** Its selection probabilities are null, and the list is 8 effects against a 5-choice menu (HOME04, conflict). Use the 5-choice menu as the design, and say the 8-effect list is a reported pool.
6. **Counter edge cases:** repeated Buddy landings, Bowser-type phones, forced transport, zero-distance Slowpoke, Rich counting after coins are stolen. Count once per physical landing, and write the rule in the game README.
7. **No visual capture and no timestamps** for any line (`visualCaptureVerified` false, `timestamp` null). Do not claim timing.

Nit:
8. The COUNT01 excerpt is partial ("three Bonus Stars are given if the game lasts"). The full rule is a composite of MPL-E3 and GFAQCLASSIC-COUNT02-1. Keep that scope when quoting it.
9. The timeline is an editorial framework, not an engine trace.

## Verify after porting

- `pnpm verify`
- `pnpm sim --game party-world --players 2 --runs 200 --seed 1` and `--players 4 --runs 200 --seed 1` (the sim must cover ties and no-recipient awards once they are decided)
- `pnpm e2e:snap --game party-world` (every phase, all five themes)
- `pnpm polish-check --game party-world --port <own port>` (frame time, density, sound)
- `pnpm e2e:a11y`, `pnpm e2e:fold`, `pnpm e2e:vip`
- The drop's own check, unchanged: `cd jobs/B05-jamboree-turn-flow && python3 verify.py --structural --checksums`

## Polish pass 2026-10-08 (Claude, cloud)

- Re-ran `python3 verify.py --structural --checksums` (19 suites, PASS, about 2 s) and `sha256sum -c SHA256SUMS.txt` (72 of 72). Re-ran `python3 verify.py --strict`: exit 1, as the drop documents. It reports facts 33/95, bonus criteria 3/9, tie procedures 0/9 and string primary captures 0/22.
- Checked all 22 `strings.json` texts against their QUOTE capture (`reports/source-captures/A-QUOTE.json`): 22 of 22 exact matches. All 22 are single-source, with no independent second source and no visual capture.
- Spot-checked the evidence excerpts behind COUNT01, COUNT02, TURN04, TIE02 and HOME04 against the captures. They support their claims. COUNT01's excerpt is partial. No research row was changed.
- Added this file, `DESIGN-DIGEST.md`, a status block at the top of the README and the LOOP and VERIFY entries. Checksums regenerated for the changed files.
