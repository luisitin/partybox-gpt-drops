# B17 · 40 original synthesized sound effects: PartyBox integration guide

> For the owner's desktop Claude agent, who ports this into the main repo (luisitin/partybox, local
> C:/dev/partybox). Read this file first; everything else in this folder is the job's own record.

| | |
| --- | --- |
| Status | **Port with fixes**: the sounds and the cue map are usable; the trims, the delivery size and the phone path must be settled in the port (see Known gaps). |
| Branch | `job/B17-sfx-40` (PR #11, polish pass 2026-10-08). The exact head is the one PR #11 shows. |
| CI | The `verify` job passed on the previous head, 14a6658 (run 37636665271). The run for the pushed head is on PR #11. |
| Repo | luisitin/partybox-gpt-drops |
| Test | `cd jobs/B17-sfx-40 && npm ci --ignore-scripts --no-audit --no-fund && npm test` (needs `ffmpeg` on PATH). |
| Runtime | Locally Node 22.22.0 and FFmpeg 6.1.1; the full suite takes about 11 minutes. CI pins Node 22.16.0 and installs FFmpeg from Ubuntu. |
| Lands in PartyBox | `packages/client/public/sfx/studio/*.wav` (new assets) · `packages/client/src/sound-set.ts` and `sound-voices.ts` (a `studio` voice) · `packages/shared/src/constants.ts` (`SOUND_SETS`) · `packages/game-sdk/src/ui/sound.tsx` (only for the new cue names) |

## What it is

Forty original effects: mono 48 kHz 16-bit WAV, each mastered to −16 LUFS, with every true peak between
−4.55 and −1.86 dBTP, DC under 0.001, 5 ms edges, byte-identical on regeneration, and cross-checked with
FFmpeg's ebur128. Each one is layered (tones, filtered noise and bursts of either) on one bus. PartyBox's
current cues are short synthesised notes (`sound-cues.ts`), so these are a different texture. Whether they
sound better is for the owner to judge. **They were measured, not listened to.** `gallery.html` is the
audition page.

## Take these files (the product)

| File | What | Goes to (PartyBox path) |
| --- | --- | --- |
| `audio/*.wav` (40 files, 4.2 MB) | the seed-1 masters | `packages/client/public/sfx/studio/<id>.wav`. Fetched only by the TV (see step 6). |
| `cues.ts` | the cue map, with proposed trims | a typed map in the client (for example `packages/client/src/sound-studio-map.ts`). |
| `RECIPES.md` | how a sound is written and rendered | `docs/sound/studio.md` (a doc, not code). |
| `dsp.ts`, `recipes.ts`, `sfx.ts` | the engine and recipes, for regeneration only | keep in the satellite as the source of record; do not ship them to phones (see gap 2). |
| `gallery.html`, `manifest.json` | the preview page and the machine-readable catalogue | preview only; not shipped. |

## Leave these (evidence, tooling, reports)

`tests/**`, `reference*.ts*`, `twin.ts`, `legacy.ts`, `ORACLE*.md`, `SOURCES.md`, `ASSUMPTIONS.md`,
`reports/**`, `VERIFY.md`, `SHA256SUMS.txt`, `tools/**`, `spectrograms/**`, `LOOP.md`, `NEXT.md`, `README.md`.
They prove the work. The port needs none of them at runtime.

## Port steps

1. **Assets.** Copy `audio/*.wav` to `packages/client/public/sfx/studio/`. `public/sfx` already holds
   recorded exceptions (`crowd-cheer.mp3`, `party-horn.mp3`, `calls/`, `chess/`), so this follows the same
   convention. Run `pnpm verify` and confirm no phone chunk grows (the WAVs are not JS).
2. **Voice type.** Add `'studio'` to `SOUND_SETS` in `packages/shared/src/constants.ts` (line 71). The
   room's `soundSet` in `packages/shared/src/protocol.ts` (line 280, `Exclude<SoundSet, 'default'>`) and the
   type follow from it. Add `'studio'` to `SoundVoice` in `packages/client/src/sound-set.ts` and let
   `resolveVoice` return it for that set. Then the VIP's switch (`packages/client/src/controller/SoundSetSwitch.tsx`)
   and `docs/DESIGN_SYSTEM.md`.
3. **Clip table.** `createVoicePlayer()` in `packages/client/src/sound-voices.ts` does not key clips by cue
   yet. `prepare` returns a list of `CueSample` (`{src, at, gain}`, no cue name), and `play` only plays
   clips for the `chesscom` voice, through `synth.sample(cue)`. For `studio`, add a keyed table
   `STUDIO: Partial<Record<SoundCue, CueSample>>` built from `cues.ts`: each entry is
   `{src: '/sfx/studio/<id>.wav', at: 0, gain: 10 ** (trimDb / 20)}`. `prepare('studio')` returns its values,
   and `play` sends a cue in the table through `sample({...s, gain: s.gain * scale})`. A cue not in the table
   plays the soft synth notes, as the chess voice does for its unsampled cues. A cue that fires before the table
   has loaded plays the classic notes. `playSample` in `sound.ts` already decodes and schedules recorded clips
   through `createSoundBufferCache`, which bounds decoded memory (128 MB, 128 entries).
4. **Trims.** Each `trimDb` in `cues.ts` is a proposal (no PartyBox voice was rendered in this pass). Measure
   the TV output with `pnpm polish-check --game <id>`, whose loudness check passes at −16 ±3 LUFS and which
   also flags clipping, dead air and pile-ups, and set each clip's gain so a swapped cue keeps the level the
   team tuned. The tests only require 0 ≥ trim ≥ −30 dB.
5. **New cue names.** The 14 rows marked `new` in the table below (`coin`, `dice-roll`, `dice-land`, `stage`,
   `countdown-last`, `hurry`, `boost`, `cancel`, `penalty`, `warp`, `shield`, `power-up`, `power-down`,
   `splash`) are not in `SOUND_CUES` (`packages/game-sdk/src/ui/sound.tsx`). Add them in one SDK change, each
   with a `DESIGN_SYSTEM` row, and only when a game uses them. The `replace` rows need no SDK change.
6. **Phone and TV.** `TvApp` calls `audio.warm()` when a game reaches `playing`, and `warm()` fetches the
   recorded cues; its comment says a phone never fetches them. Warm the studio clips on the TV the same way.
   The phones' decision is open: either they fetch the clips (more size on the phone) or they keep the synthesised
   notes for the studio voice. Phones keep the `PHONE_MASTER` of 0.35 (`ControllerApp.tsx`) as they do today.
7. **Transposed steps.** `PlayOptions.semitones` transposes the synthesised notes only; recorded clips play at
   their own pitch. The countdown (`COUNTDOWN_STEPS` [7, 5, 4, 2, 0] in `sound.ts`), the join
   (`JOIN_STEPS` [0, 2, 4, 5, 7]) and the two fixed steps in the cue map (`pause` at −7, `jackpot` at −5) need
   pre-rendered copies: `renderCue(id, {semitones})` makes them, 10 extra files (countdown 7, 5, 4 and 2; join 2,
   4, 5 and 7; `pause` −7; `jackpot` −5). `ClipOptions` has no rate option, so do not assume one.
8. **Docs and rules.** `docs/DESIGN_SYSTEM.md` (the studio voice and the new cue rows), a line in `CHANGELOG.md`,
   and `docs/DECISIONS.md`: ADR-012 says "Sound cues are generated with Web Audio (no audio files)", and its T-0517
   amendment already allows recorded chess.com clips. Either cite the recorded-clips exception in one line or amend
   ADR-012 in one line. `docs/DEPENDENCIES.md` needs a line only if a compressed format or encoder is added (gap 2).
9. **Verify.** `pnpm verify`; `pnpm sim --game <id> --players 6 --runs 200 --seed 1`; `pnpm e2e:snap --game <id>`;
   `pnpm polish-check --game <id>`; then listen in the TV preview (`/preview/<game>/<fixture>?view=tv`).

## How the cues are meant to be used

- **Start and end with the room.** A phase change that needs the phone uses `phase`, a game's start uses `start`,
  and a winner uses `win` (`fanfare` for a game-end flourish). `cheer` still layers on top, as the caller plays it.
- **Timers.** `countdown` and `tick` repeat every second, so they are quiet (trims of −21 and −27 dB). `hurry`
  (ten seconds left) and `countdown-last` (the final second) are the only brighter moments.
- **Verdicts.** `correct`, `error` and `submit` are short. `wrong` is the one low buzzer.
- **Table.** `dice-roll` and `dice-land` mark a die leaving the hand and settling, to sit next to the 3D dice
  (`Dice3d`); `daub` and `splash` are the board's smaller marks.
- **Gaps.** There is no dedicated card flip, card deal, score-count tick or chip stack. `swipe`, `countdown-tick`
  and `coin` stand in for them until a designer adds those four.

## Known gaps and risks

**Must (before the port ships)**

1. **Not auditioned.** Every claim here is a measurement. The owner should listen to the 40 in `gallery.html`
   and say which to change before the port. Nothing in this folder says they are pleasant.
2. **Delivery size.** `audio/` is 4.2 MB of PCM16 at 48 kHz, too heavy for a phone at load, so the port must fetch
   clips for the TV only, or ship compressed. Compression needs an encoder: none is in the repo, and
   `docs/DEPENDENCIES.md` would need a line. Rendering the 40 at runtime (about 27 s of CPU here) is not
   acceptable on a phone.
3. **Trims are proposals.** See port step 4. Until measured, a swapped cue may be louder or quieter than the synth it replaces.

**Should**

4. **Stand-ins.** There is no dedicated card flip, card deal, score-count tick or chip stack. Commission or design
   the missing four if the table feel needs them.
5. **Transposition.** Countdown and join steps need pre-rendered copies or a rate path (step 7).
6. **Spectral balance is not gated.** The suite checks levels, peaks, DC, edges and bytes. It does not check the
   spectrum; the spectrograms are for inspection.
7. **Not blind.** `twin.ts` checks the v2 engine against a second, structurally different implementation written by
   the same author, after `dsp.ts`. The blind oracle covers only the first delivery's recipe and the shared master,
   meter and encoder. A slip shared by both implementations of one recipe would pass.
8. **Environment.** Local runs use Node 22.22.0 and FFmpeg 6.1.1; CI pins Node 22.16.0. The `VERIFY.md` numbers come
   from the local run. Cross-engine byte identity is not claimed.

**Nit**

9. Spectrograms are 256×128, which keeps the evidence at 4 MB. A 512-wide version would cost about 16 MB because
   the PNG encoder stores pixels uncompressed.
10. `level()` and `finishAudio` both apply the 5 ms fade; the second pass is inert at the zero endpoints (see RECIPES.md).

## Cue map (all 40 sounds; the source is `cues.ts`)

| Sound | Group | PartyBox cue | Action | Moment |
| --- | --- | --- | --- | --- |
| coin | reward | `coin` | new | Money changes hands: Monopoly rent and salary, Blind Auction payouts (as tally) |
| star-get | reward | `jackpot` (-5 st) | replace | Final-wager reveal (Lightning), in G so the C-major win can follow |
| dice-roll | board | `dice-roll` | new | Dice leave the hand: Yahtzee and Monopoly Dice3d throws (as daub) |
| dice-stop | board | `dice-land` | new | Dice settle on their faces, timed to Dice3d landing (as daub) |
| step | board | `daub` | replace | A square daubed on a phone: a dauber landing |
| buzzer | verdict | `wrong` | replace | The wrong buzzer |
| ding | verdict | `correct` | replace | The phone's own verdict card: right |
| whoosh | menu | `stage` | new | A TV camera move: ADR-064 stage pan, toss and curtain (as countdown) |
| pop | board | `dibs` | replace | Someone has dibs on BINGO! (TV): a soft rising "hm?" |
| countdown-tick | timer | `countdown` + `tick` | replace | Each of the last 5 seconds on the TV; countdownSemitones [7, 5, 4, 2, 0] · The phone's half-gain countdown at its 5 s edge |
| final-tick | timer | `countdown-last` | new | The last second of a countdown, in place of the fifth countdown step (as countdown) |
| win-fanfare | reward | `win` | replace | Results screen winner (the cheer sample still layers on top) |
| lose | reward | `bust` | replace | A lost wager or a bust |
| item-use | power | `boost` | new | A power or event card is used: Blind Auction Mystery Box events (as claim) |
| shop-open | menu | `wager` | replace | The wager phase opens (Lightning) |
| vote | verdict | `submit` | replace | A player's own choice sent (phone) |
| reveal | flow | `reveal` | replace | An answer or result is revealed |
| timer-warning | timer | `hurry` | new | Ten seconds left, before the last-5-seconds state (as tally) |
| menu-move | menu | `lock` | replace | A player locks in; whole tones rise with the count (quiet) |
| menu-back | menu | `pause` (-7 st) | replace | The VIP pauses (A4 → E4, a settling fourth) |
| confirm | verdict | `claim` | replace | BINGO! sent from a phone: a rising "sent!" |
| cancel | verdict | `cancel` | new | A choice withdrawn or a sheet dismissed on the phone (as submit) |
| join | flow | `join` | replace | A player joins; steps up joinSemitones [0, 2, 4, 5, 7] |
| leave | flow | `leave` | replace | A player leaves, is kicked or drops (the mirror of join) |
| ready | flow | `ready` | replace | Sound enabled or unmuted: the TV proving its speakers work |
| start | flow | `start` | replace | A game begins (selecting → playing) |
| round-end | flow | `tally` | replace | A scores or leaderboard phase |
| bonus | reward | `sweep` | replace | A Wisecrack sweep: a faster cousin of win |
| penalty | power | `penalty` | new | Points or money lost: Monopoly tax and jail fees (as bust) |
| teleport | power | `warp` | new | A token jumps across the board: Monopoly "go to jail", party-board warps (as reveal) |
| shield | power | `shield` | new | A protection holds: immunity or a blocked steal in minigames (as claim) |
| power-up | power | `power-up` | new | Something grows stronger: a level, a multiplier, a party-board star (as reveal) |
| power-down | power | `power-down` | new | Something weakens or runs out (as bust) |
| notification | flow | `phase` | replace | A phase change that needs the phone (the shell chime) |
| achievement | reward | `fanfare` | replace | A game-end flourish (Yahtzee, Phase 10, Rummikub, Blanks final) |
| error | verdict | `error` | replace | Rejected input or an error toast (phone) |
| splash | board | `splash` | new | A shot lands in water: Battleship misses (as daub) |
| bounce | board | `call` | replace | A new Bingo call: a bouncy boing |
| swipe | menu | `card` | replace | One card read out (Blanks) or dealt (Bingo); soft enough to repeat |
| connect | flow | `close` | replace | One square to go on a phone: a hushed rising "ooh" |

`cheer`, `tie` and `silence` have no 40-sound counterpart; `cheer` stays the recorded clip.

## Verify after porting

`pnpm verify`, `pnpm sim --game <id> --players <min/6/max> --runs 200 --seed 1`, `pnpm e2e:snap --game <id>`,
`pnpm polish-check --game <id>`, and in this folder `npm test` (it must stay green; it is the source of truth for the WAVs).

## Polish pass 2026-10-08 (Claude, cloud)

- Checked PR #11's `verify` check on its head 14a6658: success (run 37636665271).
- Replaced the first delivery's single-oscillator recipes with layered v2 recipes (`dsp.ts`, `recipes.ts`) and a
  true-peak leveller. The first recipe stays in `legacy.ts` for the blind oracle.
- Added `cues.ts`: every sound maps to a PartyBox moment, and every `replace` name is checked against `SOUND_CUES`
  on PartyBox main (26b85ba6).
- Trims are proposals; no PartyBox voice was rendered.
- The suite passes locally on Node 22.22.0 with FFmpeg 6.1.1: seeds 1, 2 and 3; 120 audio cases; 30 rebuilt EBU cases;
  75 of 75 mutation kills. Evidence: `VERIFY.md` (2026-10-08 section) and `reports/polish-2026-10-08-tables.md`.
- The gallery uses PartyBox's tokens and font stack; checked at 1280 px and 390 px with no horizontal scroll and 40 cards.
