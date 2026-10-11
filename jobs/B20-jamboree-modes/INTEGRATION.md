# B20 Every other Jamboree mode, buildable specs → PartyBox integration guide

> For the owner's desktop Claude agent, who ports this into the main repo (luisitin/partybox, local C:/dev/partybox). Read this file first; everything else in this folder is the job's own record.

| | |
| --- | --- |
| Status | **Reference only.** The roster and the rules are research (partial: 60 of 85 rules corroborated). The phase specs are **original proposals** (`basis: original_phone_tv_proposal`). Use them as a checklist of phases and exits, never as verified Nintendo gameplay. |
| Branch | `job/B20-jamboree-modes`, polish commit recorded in PR #16 history (prior head `de8cc66`) · PR #16 (draft) · CI: green (`B20 research and prototype specification checks`, run 37679418437, head `de8cc66`, checked 2026-10-08) |
| Repo | luisitin/partybox-gpt-drops |
| Test | `cd jobs/B20-jamboree-modes && python3 -m pip install -r requirements.txt && python3 verify.py --structural --checksums && sha256sum -c SHA256SUMS.txt`. Strict research gate: `python3 verify.py --strict` (expected exit 1). Runtime about 2 s. |
| Lands in PartyBox | (a) `games/party-world/` settings variants: Pro, Frenzy and Tag-Team, plus the Buddy ally mechanic (the board game is B05's port; not in this checkout). (b) Short ADR-087 minigames from Minigame Bay. (c) Two new games, a co-op bomb relay and a race, each a `games/<id>/`. |

## IP: read this before porting (loud)

> **Ship no name, string or art from this drop.** Mode names ("Koopathlon", "Bowser Kaboom Squad", "Paratroopa Flight School", "Toad's Item Factory", "Rhythm Kitchen", "Bowser Live", "Carnival Coaster", "Party-Planner Trek", "Minigame Bay", "Koopa Paratroopa Taxi", "Jamboree Buddies", "Tag-Team Rules", "Frenzy Rules", "Pro Rules"), character names (Mario, Luigi, Peach, Daisy, Wario, Waluigi, Yoshi, Rosalina, Donkey Kong, Bowser Jr., Toad, Bowser, Boo, Monty Mole), item names ("Double Dice", "Custom Dice", "Golden Pipe", "Mushroom", "Star Steal Trap"), the phrase "Mario Party" and the product name "Jamboree" are all Nintendo's. The mechanics are facts and may be used, re-described in original words with original names.
>
> The `modes/*.md` files quote Nintendo text in their "Reported Nintendo rules" sections (evidence). Take only their "Buildable phone + one TV prototype" sections, and re-word and rename everything in them. The quoted lines stay here as evidence.

## What it is

A research roster of 28 party-game records (13 top-level modes, mechanics and rule variants, and 15 child activities, difficulties and variants). Standard base Mario Party is excluded. Menu hubs are collections, not extra playable modes. The drop links 85 sourced rules: 60 corroborated, 23 single-source, 2 in conflict. Of 168 fields, 84 have a recorded rule. Every mode has a seven-phase original spec with explicit exits (196 exits in total), plus one shared phone and TV protocol.

How good it is, honestly: the roster is well sourced (all 28 records have two publisher lineages). Rules are narrow and often partial. Many modes have most fields unverified (for example Minigame Bay, Rhythm Kitchen and Paratroopa Flight School). The buildable specs are proposals with invented timers, input windows and score thresholds, labelled as such. They prove the phases can all exit, not that the games are fun or faithful.

## Port map (ranked by fit × evidence)

| Drop id | Kind | Evidence | PartyBox destination | Notes |
| --- | --- | --- | --- | --- |
| `frenzy-rules` | rule variant | high (length, start kit, events, award) | `party-world` `settingsVariants.frenzy` | 5 turns; 50 coins, 1 Star, one double-dice item; two Homestretch events at start; one ending category. |
| `pro-rules` | rule variant | high for length, shop and award; medium for unlock | `party-world` `settingsVariants.pro` | 12 turns; one category announced before play; shop limited to two of each item; no Chance Time, Hidden Blocks or extra Homestretch (PRO02). Unlock is not a PartyBox concept. |
| `tag-team-rules` | rule variant | high for shared pool and doubled interactions; single for alternating order | `party-world` team variant, with `teamsFromSeed`, `teamResults` and `TeamBanner` | Two teams of two share coins and Stars; combined opening roll sets order; the combined "together" roll moves both. |
| `jamboree-buddies` | mechanic (17 rules) | high for recruit, steal, lifetime, most abilities | `party-world` ally mechanic | The richest record. Three-turn lifetime including recruitment (exact decrement boundary null). Recruited by a Showdown minigame. Each ally needs a new original name and art. |
| `bowser-kaboom-squad` | co-op mode | high for bombs, revive, bonus and rewards; medium for 90 s round | new game `games/<id>/` (co-op bomb relay) | Up to 8 players, 5 rounds; carry bombs to a cannon, a bubble revive by teammates. `coopResults` already ranks co-op. |
| `koopathlon` | mode | high for players, laps and race; single for penalties and 150-space lap | new game `games/<id>/` (race) | 20 racers exceed PartyBox `roomCapacity` 16. Use 16 slots with bot fill, or record the cap as a design decision. |
| `minigame-bay` submodes: `survival`, `boss-rush`, `tag-match`, `showdown-minigame-battle`, `daily-challenge` | minigames | players high; submode rules mostly unverified | 3 to 4 ADR-087 minigames, each its own game | ADR-087 modes are `ffa`, `2v2`, `1v3`, `duel`; 20 to 90 seconds. `daily-challenge` can use a dated `seed`. |
| `rhythm-kitchen` (+ `kitchen-normal`, `kitchen-long`, `kitchen-challenging`, `kitchen-remix`) | mode hub | players 4 high; group rating high; the rest unverified | one phone-only rhythm minigame; the four difficulties become settings | Needs the server beat (`useServerBeat`); phones only. Thresholds unknown. |
| `toads-item-factory` | mode | high for 4 local, 30 levels, cooperative goal | later: co-op puzzle | Most fields unverified. |
| `sky-battle`, `koopa-paratroopa-taxi`, `free-flight`, `paratroopa-flight-school` | mode hub | mostly unverified (6 unverified fields on the hub) | defer | Flight physics needs a quality bar this drop does not supply. |
| `bowser-live` (TV) | mode | high for 2v2 teams, flow and score; single for tie | later: TV team mode | Camera and microphone minigames conflict with the "touch works without permissions" rule. Make any camera part optional, under `presence` (ADR-047). |
| `carnival-coaster` (TV) | mode | medium for players; high for 5 courses | defer | Aim by touch (the protocol's `aim` x/y). Countdown values unverified. |
| `party-planner-trek` | mode, single player | high for 5 boards and gate; single for payouts | defer | A solo campaign. Not a party game. |
| `tv-mario-party`, `tv-free-play`, the TV context rows | context | n/a | skip | Catalog and context, not a mode to build. |

## Take these files (the product, re-worded)

| File | What it gives | Goes to |
| --- | --- | --- |
| `modes.json` | Roster, presence, observed timers, coverage | Checklist only. Copy no names. |
| `rules.json` | Rule facts with status and confidence | Settings values and counters, after renaming (see port map) |
| `modes/<id>.md` → "Buildable phone + one TV prototype" | Phase graph, timers, controls, scoring (original proposals) | The phase list and exits in each new game's README. Timers and thresholds need playtesting. |
| `phone-tv-protocol.json` | Server authority, input envelope, rate limits, disconnect policy, derived events | Compare with PartyBox's own envelope and reconnect code before adopting any number (see step 6). |

## Leave these (evidence, tooling, reports)

- `SOURCES.md`, `sources.json`, `reports/`, `CONFLICTS.md`, the "Reported Nintendo rules" sections of `modes/*.md`, `rules.json` evidence quotes. These quote game text. Stay in the drops repo.
- `verify.py`, `schema.json` (about 238 KB), `requirements.txt`, `validator-output.txt`, `SHA256SUMS.txt`, `VERIFY.md`, `LOOP.md`, `NEXT.md`, `ASSUMPTIONS.md`. Job tooling.

## Port steps

1. **Wait for the board game.** Pro, Frenzy, Tag-Team and the Buddy ally all need `games/party-world/` (B05's port). Build that first.
2. **Settings variants.** Add `settingsVariants` for Pro (12 turns, announced category, two-copy shop limit, no Chance Time or Hidden Blocks), Frenzy (5 turns, 50 coins, 1 Star, a starting double-dice item) and Tag-Team (two teams of two sharing coins and Stars). Pro's Lucky spaces (10 coins or a double dice) and Unlucky transfer (7 coins to last place) are corroborated at medium confidence (B05 PRO04). Their final-turn alternatives are open, so record them as design choices in the README.
3. **Team variant.** Use `teamsFromSeed` for the two teams (its names are already original: ▲ Sun and ● Moon). Ranking uses `teamResults`. Show `TeamBanner` on the TV.
4. **Buddy ally.** One ally per player at a time. Recruit by winning a Showdown. Passing the owner transfers the ally. Its lifetime is three turns including the recruit turn. Use one original name and one original art per ally. The Waluigi-type steal range is a conflict (3 to 8 coins against 3 to 9, BUDDY_WALUIGI, low). Pick one value, record it as a design decision, and do not present it as sourced.
5. **Minigames.** Each Minigame Bay submode becomes its own ADR-087 minigame, declared with `minigame` in its manifest (modes, seconds 20 to 90, controls of one to four lines, two lines of how-to). The `minigame` schema lives in the owner's local main and the satellite contract, not in this checkout (primer §2).
6. **Race and co-op games.** For each new game: `games/<id>/server/phases/<phase>.ts` with an `enterX` and `reduceX` per phase, following the spec's exits. Input: PartyBox's controller envelope (`controllerEnvelope`) and its reconnect code (`setConnected`, `onPlayerEvent`). Check the proposal's numbers (10-second heartbeat freeze, 30-second reconnect, 20 movement and 8 tap inputs per second) against the engine before adopting any of them. Keep the engine's values if they differ.
7. **Capacity.** The race is 20 racers in the drop. PartyBox's `roomCapacity` is 16 (`packages/shared/src/constants.ts`). Fill the rest with bots or cap the race at 16, and record which.
8. **Bots.** `sampleInput(state, playerId, rng, skill)` with easy, normal and sharp (ADR-059). Each game's bot must be honest and varied, and must never stall a phase.
9. **Strings.** Every visible string in `client/strings.ts` with Spanish in the same file and `manifest.es.json` (ADR-044 and ADR-049). Every mode name is new.
10. **Docs, registry, tests.** `docs/games/<id>.md`, `pnpm gen-registry`, a fixture per phase, `contract.config.ts` declaring hidden inputs, and a CHANGELOG line.

## Make it feel AAA in PartyBox (not a 2D bootleg)

- **Variants on the TV.** The `TvStartStage` pattern shows how-to. Use it for the variant: a large title card ("Five-Turn Sprint", an original name), three rule lines, then the board. Never a silent switch.
- **Ally recruited.** The ally card flies from the Showdown winner to their chip along a slight arc (`table3d` motion). A `wager`-style cue, a `Burst` and a `NumberPop` count-up for the new power. Reduced motion: a fade.
- **Co-op bomb relay.** A fuse ring on the cannon (`countdown` and `tick` cues). A hit bubbles the player and a teammate's tap revives them, with a `Burst` on revive. The team total uses `TeamBanner`.
- **Race.** A track in CSS perspective (the approach in `table3d` cinema), 16 lanes, the leader's lane glowing, coin pickups, `sweep` on the finish. Phones show one large aim or tap control. Never a second 3D stack (ADR-071).
- **Minigames.** Each uses the standard ADR-087 intro card, and the same winner moment as the board. Keep the sound palette (`SOUND_CUES`) consistent across them.
- **Phones during others' turns.** `WaitingScreen`. Say "look at the TV" only when `useCanSeeTv()` is true.

## Known gaps and risks

Must:
1. **IP.** Every mode, character, item and rule name must be replaced, and every visible line written new. The failure to avoid is shipping Nintendo names or text.
2. **Capacity.** The race has 20 racers; PartyBox's room holds 16. Decide the cap.
3. **Conflicts and design interactions** the port must decide and record. The Waluigi-type steal range is a documented conflict (3 to 8 or 3 to 9). Frenzy's two starting Homestretch events are sourced, but how they sit inside a five-turn game is a design interaction, not a sourced rule. Pro's Lucky and Unlucky outcomes are corroborated at medium confidence, and their final-turn alternatives and empty-inventory cases are open (B05 PRO04).
4. **Flight modes** need a physics quality bar this drop does not provide. Defer them.

Should:
5. **Minigame Bay submodes.** Four or five fields per submode are unverified, and the hub has six. Each port needs its own rules pass, starting from the mechanic it names.
6. **Rhythm Kitchen.** Needs beat sync and phone-only timing tests. Thresholds for the group rating are unknown.
7. **Koopathlon.** The 150-space lap and the setback range (10 and 40) are single-source.
8. **Bowser Live.** The tie rule is single-source. Camera and microphone use must be optional.
9. **Proposal numbers.** Every timer, threshold and rate limit in the specs is a design choice, not a measurement.

Nit:
10. Keep the Pro naming ("Happening" in some prose, "Eventful" in others) out of PartyBox copy. Pick one original name.

## Verify after porting

- `pnpm verify`
- `pnpm sim --game <id> --players <min/max> --runs 200 --seed 1` for each new game, with the random and idle bots
- `pnpm e2e:snap --game <id>` (every phase, all five themes) and `pnpm polish-check --game <id> --port <own port>`
- `pnpm e2e:a11y`, `pnpm e2e:fold`, `pnpm e2e:vip` for each new game
- Settings variants: `pnpm sim --game party-world` once per variant (Pro, Frenzy, Tag-Team)
- The drop's own check, unchanged: `cd jobs/B20-jamboree-modes && python3 verify.py --structural --checksums`

## Polish pass 2026-10-08 (Claude, cloud)

- Re-ran `python3 verify.py --structural --checksums` (19 suites, PASS, about 2 s: 2,947 cases before the two new files, 2,951 after them) and `sha256sum -c SHA256SUMS.txt` (117 of 117). Ran `python3 verify.py --strict`: exit 1, as documented (rules two-source 60/85, fields with rules 84/168, mode list two-source 28/28, phase exit graphs 196/196).
- Checked all 178 rule evidence quotes against the stored captures (`reports/source-captures/`, both passes): 178 of 178 exact.
- Checked the port map against PartyBox's `roomCapacity` (16). The 20-racer race does not fit as written, and the INTEGRATION says so.
- Added this file, `DESIGN-DIGEST.md`, a status block at the top of the README, and LOOP and VERIFY entries. No rule row changed.
