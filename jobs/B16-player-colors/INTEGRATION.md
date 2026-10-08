# B16 12 accessible player colours → PartyBox integration guide

> For the owner's desktop Claude agent, who ports this into the main repo (luisitin/partybox, local C:/dev/partybox). Read this file first; everything else in this folder is the job's own record.

| | |
| --- | --- |
| Status | **Port with fixes**: the canonical 16-bit palette fails its gates once rounded to 8-bit hex (measured). Use `partybox/palette-12.json` (8-bit, passes the same gates) and the ring rule below. |
| Branch | `job/B16-player-colors` @ see the PR head (this pass adds the PartyBox set) · PR #15 · CI: the PR's `B16 player colors full verification` run; the PR body records the head SHA and its result |
| Repo | luisitin/partybox-gpt-drops |
| Test | `cd jobs/B16-player-colors && npm ci --ignore-scripts && npm test` (about 5 min on a loaded 4-CPU box, Node 22) |
| Lands in PartyBox | `packages/client/src/styles/tokens.css` (`--pb-player-1…12`), `packages/game-sdk/src/ui/Avatar.tsx` (`% 8` → 12 slots), `packages/client/src/controller/JoinTints.tsx`, `games/monopoly/client/{Board,Tv}.tsx` (`% 8`), `packages/shared/src/ids.ts` (comment: chip colour = index % 8) |

## What it is

Twelve player colours with a proof: every pair is checked with CIEDE2000 (Sharma et al. 2005 test data reproduced to four decimals) under normal vision and Machado 2009 protan, deutan and tritan simulations, plus WCAG contrast. The math is written twice, independently, and diffed on every case (`tests/run.mjs`, seeds 1, 2, 3; 25 deliberate bugs are all caught). Honest line: **the numerical work is strong; the palette as first delivered is too muted for a party game and does not survive 8-bit rounding.** The polish pass fixes both for PartyBox with a second, reproducible 8-bit set.

## Take these files (the product)

| File | What | Goes to (PartyBox path) |
| --- | --- | --- |
| `partybox/palette-12.json` | 12 slots, EN+ES names, 8-bit hex, face ink per slot | the source of the token block below; keep as a comment table in `docs/DESIGN_SYSTEM.md` |
| `partybox/tokens-player.css` | `--pb-player-N`, `--pb-player-N-face`, `--pb-player-ring` + per-theme ring overrides | merge into `packages/client/src/styles/tokens.css` (replace lines 31–38; add one ring line to each `[data-theme=…]` block at lines 85, 106, 124, 142) |
| `tools/search-partybox.mjs`, `tools/build-partybox-palette.mjs` | reproducible search (`HUE_MIN=20 node tools/search-partybox.mjs 1 30000 out.json ring`) | evidence only; the port does not need them |
| `tests/partybox.mjs` | the gate test on the 8-bit values, cross-checked against the reference | `scripts/` or `packages/client` test (see port step 7); the math itself stays in this folder |
| `partybox/sheet.html`, `tools/build-partybox-sheet.mjs` | swatch sheet on the five themes with CVD rows and the 13–16 repeats | `docs/` or `reports/design/` as the design-review artifact (one PNG per theme under `e2e:themes` is the PartyBox way) |
| `palette.json`, `color.ts`, `reference.ts` | the canonical 16-bit math and palette | **do not port as the palette**; keep in the satellite as the proof record |

## Leave these (evidence, tooling, reports)

`reports/**`, `reports-run/`, `tables/**`, `swatches/**` (the 16-bit PNG sheets), `gallery.html`, `ORACLE*.md`, `SEARCH.md`, `tests/mutations.mjs`, `tests/mutant-probe.mjs`, `tools/continuous.py`, `tools/refine.mjs`, `tools/joint-refine.mjs`. They prove the numbers; the port does not need them.

## Port steps

1. **Tokens.** Replace `tokens.css` lines 31–38 with the block from `partybox/tokens-player.css` (12 colours, 12 face inks, `--pb-player-count`, `--pb-player-ring`). Add the ring overrides inside each existing `[data-theme]` block (`daylight` `#171633`, `arcade` `#f0f6ff`, `cabin` `#fbf3e8`, `contrast` `#ffffff`; `night` is the `:root` default `#f5f6ff`).
2. **Slot count.** Add `export const PLAYER_SLOTS = 12` in `packages/shared/src/ids.ts` (the colour rule and its comment live there). Replace every `% 8` with `% PLAYER_SLOTS` in `packages/game-sdk/src/ui/Avatar.tsx` (lines 85, 88, 91, 93), `games/monopoly/client/Board.tsx:104`, `games/monopoly/client/Tv.tsx:166`. Check the `TINTS` list in `packages/client/src/controller/JoinTints.tsx` and extend it to 12 (it currently assumes the eight tokens). Also change the `avatarTint` check in `packages/shared/src/ids.ts:108` from `n < 8` to `n < PLAYER_SLOTS`: without it a phone that picks slot 9–12 (`fox#9`) parses as no colour. Update the comments that say eight: `ids.ts:60`, `ids.ts:99`, and `packages/game-sdk/src/ui/Avatar.tsx:2` (`index % 8`).
3. **Face ink per slot.** `Avatar.tsx` draws every face in the one `INK` (`#1a0b12`, `avatarArt.tsx`). Use `var(--pb-player-N-face)` for the face of a player's disc so each face has ≥ 3:1 on its colour (the minimum in the set is 4.87:1).
4. **Ring.** Give each disc a 2.5 px stroke in `var(--pb-player-ring)`: in `Avatar.module.css` (or the svg circle). Slots 13–16 get a dashed stroke (`stroke-dasharray: 4 3`) so a repeated colour is never the only cue. The ring is what makes the light colours (Butter, Aqua, Lime) visible on Daylight (fill-to-ground 1.0:1 without it).
5. **Repeats.** For 13–16 reuse slots 1–4 (same colour, dashed ring, same face family) and keep the name label. Sixteen-player rooms exist (DESIGN_SYSTEM "sixteen players"), so this path must be tested.
6. **Design doc.** Update the player row in `docs/DESIGN_SYSTEM.md` (currently `--pb-player-1…8`, "avatar id % 8") and the theme rule "player colours untouched": the ring is now a theme token. Add a row to `docs/DECISIONS.md` as a new ADR (the local main's `docs/DECISIONS.md` ends at ADR-081 on 2026-10-08, so take the next free number at port time).
7. **Test.** Port `tests/partybox.mjs`'s checks into the PartyBox test tree: parse `tokens.css`, compute the gates from the hex values (the math is pure; `packages/game-sdk` can host a small `playerColors` module if preferred). Keep the reference-vs-production diff if you want the two-implementation discipline.
8. **Verify in the app.** `pnpm e2e:themes` (five themes), `pnpm e2e:a11y` (no colour-only meaning; the ring must not fail axe contrast), `pnpm e2e:snap --game <id>` for a 16-player room, `pnpm e2e:fold` unaffected. Look at the screenshots: the sheet is the reference, not the bar.

## Make it feel AAA in PartyBox (not a 2D bootleg)

- **Beat → TV → phone.** A player joins → their disc drops onto the TV lobby with a 2.5 px ring and a spring settle (B18 `spring`, ≤ 450 ms, overshoot ≤ 6 %) → on the phone the same colour fills the header face and the join tint. A repeated colour (13–16) arrives with its dashed ring and a small "13" tag.
- **Yellow matters.** The set has one pale yellow (Butter, `#fdfaa3`, L 0.97) and one gold-leaning ochre. Use Butter for the VIP crown and the "your turn" glow; on Daylight it is the ring that carries it.
- **Light and dark.** Test on Daylight first: fills are light there, so the disc relies on the ring. Look at 320×568 and 390×844 phones and the 1080p TV.

## Licence / IP notes

- Colour values and names are generic (no brand colours, no trademarked names). Names in ES are plain nouns.
- Sharma, Wu and Dalal (2005) test data and the Machado, Oliveira and Fernandes (2009) matrices are published research data; the source links are in `SOURCES.md`. Facts are fine to reuse; cite them in `docs/DESIGN_SYSTEM.md`.
- No art, icons or fonts are shipped.

## Known gaps and risks (ranked)

**Must**
1. The canonical 16-bit palette (`palette.json`) fails after 8-bit rounding: first eight normal ΔE00 19.54 (gate 20), all twelve four-view 11.77 (gate 12). `npm run canonical` prints it. Do not port the canonical hex; use `partybox/palette-12.json`.
2. The `palette-12` set needs the **ring** on every disc. It is not the literal B16 spec: the spec asked for ≥ 3:1 fill-on-light, which forces every colour into relative luminance 0.10–0.27 and removes yellow. The ring is the owner's decision to take; without it Daylight fails. Measured on 2026-10-08 (independent recomputation): six of the twelve slots are under 3:1 on `#F7F5F0` (Butter 1.01, Aqua 1.14, Lime 1.38, Peach 1.81, Turquoise 2.01, Periwinkle 2.22); all twelve pass 3:1 on `#121218` (lowest 3.15).

**Should**
3. The set is found by a seeded hill-climb (not an optimum). Margins: first eight 21.39 (gate 20), four-view minimum 12.67 (gate 12). Re-run the search if a colour changes.
4. No human has checked the colours for CVD perception. The numbers are the model; a short test with a deuteranope and a protanope on a real TV is still needed.
5. The mutation harness (`tests/mutations.mjs`) writes to a shared `.mutations/` folder: two runs in the same folder collide (we saw a "module not found" in mutation 23 when two runs overlapped). Run one at a time, or give each run its own folder.
6. Literal fill-on-light (≥ 3:1 vs `#F7F5F0`) and PartyBox's Daylight ground both count; the 13–16 repeats are colour-identical. Both are accepted by the ring rule, but say so in the design doc.

**Nit**
7. Spanish names are a first pass; have a native speaker read them.

## Verify after porting

```sh
cd jobs/B16-player-colors && npm ci --ignore-scripts && npm test   # 3 seeds, 25 mutations, PartyBox gates
npm run canonical                                                  # the 8-bit finding, reproduced
npm run partybox                                                   # regenerate sheet and tokens after edits
cd /path/to/partybox && pnpm verify && pnpm e2e:themes && pnpm e2e:a11y
```

## Polish pass 2026-10-08 (Claude, cloud)

- Re-ran the full B16 suite on Node 22.22 (B16 pins 22.16.0 for byte-exact assets; the asset tests still passed on 22.22): all 3 seeds, 25 of 25 mutations caught.
- Found the 8-bit rounding failure above (`tools/canonical-8bit.mjs`). The canonical palette is kept as the math record.
- Measured the current PartyBox eight: minimum normal ΔE00 5.17, minimum CVD ΔE 3.90 (sky vs cyan under deutan), and two fills under 1.6:1 on Daylight.
- Built the PartyBox set with a seeded search (`tools/search-partybox.mjs`, reproduced byte-for-byte), named it EN/ES, gate-tested it (`tests/partybox.mjs`, production vs reference agree to 2.8e-14), rendered the sheet on five themes and looked at it, and wrote the token block.
- Wired `tests/partybox.mjs` into `npm test` (package.json) and added `npm run partybox` and `npm run canonical`.

## Independent review 2026-10-08 (Claude, Haiku 5.5)

- Checked the claims with a separate CIEDE2000 and Machado 2009 (severity 1.0) implementation written from the formulas: current eight 5.17 normal and 3.90 CVD, palette-12 21.39 first-8 and 12.67 all-12 four-view, all match. The Daylight pair (1.33 and 1.52) also matches.
- Fixed: the palette's `boundary` text said a 2 px ring; the sheet and tokens use 2.5 px. Fixed in `tools/build-partybox-palette.mjs` and `partybox/palette-12.json`.
- Fixed: step 2 now covers `packages/shared/src/ids.ts:108` (`n < 8`), which would have dropped slots 9–12.
- Fixed: the ADR number (local main ends at ADR-081, not ≥ ADR-088) and the fill-on-light count above.
- Not fixed, owner decision: the literal fill-on-light rule from the original B16 brief is not met; the ring rule is the proposal.
- PR #15's body still describes an earlier head; this review did not edit it.
