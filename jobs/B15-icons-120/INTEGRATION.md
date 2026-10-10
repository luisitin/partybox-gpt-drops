# B15 120 original SVG icons → PartyBox integration guide

> For the owner's desktop Claude agent, who ports this into the main repo (luisitin/partybox, local
> C:/dev/partybox). Read this file first; everything else in this folder is the job's own record.

| | |
| --- | --- |
| Status | **Ready to port** once the owner decides the `whisper` name (see [gaps](#known-gaps-and-risks)). Nothing else in this folder needs fixing first. The port is UI chrome work, and the gaps below list what the set does not cover. |
| Branch | `job/B15-icons-120` @ `9e56abe` as reviewed on 2026-10-08 (independent review in VERIFY.md; the review commits touch docs and seal only). The artwork last changed in `bac3314`, `src/` in `c0aa205` · PR #10 (its description still cites the older head `b37a00d`, 78 suite rows and a 716-byte largest file; those figures are stale) · CI: hosted `verify` green on `9e56abe` (run 37799893910, 15:21 UTC), `c878bc5` (run 37797964572) and `b37a00d` (run 37642435427) |
| Repo | luisitin/partybox-gpt-drops |
| Test | `cd jobs/B15-icons-120 && npm ci --ignore-scripts --no-audit --no-fund && python3 -m pip install -r requirements-dev.txt && npm test` (needs libcairo2 and fonts-dejavu-core). Runtime 2–5 min: 130 s wall in the independent review run, 290–308 s on 4 shared CPUs in the polish passes |
| Lands in PartyBox | `packages/game-sdk/src/icons/` (pure geometry and lookup) · `packages/game-sdk/src/ui-icon.ts` + `ui/Icon.tsx` (new `@partybox/game-sdk/ui/icon` export) · `packages/client/public/icons.svg` (static sprite) · `packages/client/src/styles/tokens.css` (`--pb-icon-ink`) · `docs/sdk/icons.md` |

## What it is

- 120 original icons for the shell chrome and for games, in six groups of 20: party essentials, navigation and actions, tabletop, people and communication, game objects, system and celebration.
- One 64-unit grid and one 4-unit ink outline throughout. Lines are "ribbons" (ink casing under a coloured core). Fills come from five colours: cream, coral, gold, mint, lavender.
- They read at 24 px and hold up at 96 px. Every icon was checked on the night and daylight themes.
- The set is pure data plus a pure lookup, with zero runtime dependencies. The ink colour can be themed (`currentColor`).
- Machine-verified:
  - every file's SVG profile and byte limit;
  - no two silhouettes overlap by IoU ≥ 0.8 at 24/48/256 px in two renderers;
  - everything stays in the live area;
  - a fill-based night check: at 48 px at least a quarter of each icon's opaque pixels are lighter than the ink. This is a proxy, not an outline contrast test. The default outline is about 1.2:1 on the night background, so outlines fade there and the fills carry each shape (see gaps).
- Not verified: a human recognition study.

## Take these files (the product)

| File | What | Goes to (PartyBox path) |
| --- | --- | --- |
| `src/art.ts` | `bodies`: id → inner SVG markup (the geometry) | `packages/game-sdk/src/icons/art.ts` |
| `src/icons.ts` | `getIcon(name, { ink? })`, `getSprite()`, `iconNames`, `IconName`, `palette`, `defaultInk` (pure) | `packages/game-sdk/src/icons/icons.ts` (drop the `.js` import suffix) |
| `sprite.svg` | `getSprite()` output: 120 `<symbol id="pb-icon-NAME">`, ink = currentColor (54 KB, 9 KB gzip) | `packages/client/public/icons.svg`. Write it from `getSprite()` with a script, never by hand |
| `manifest.json` | `{ id, title, titleEs, category }` ×120 | Inventory table in `docs/sdk/icons.md`. Use `titleEs` where an icon needs a spoken or alt label |
| `icons/*.svg` | The same 120 icons as standalone files (= `getIcon(name)`) | Optional: design reference only. The app needs the sprite, not these |
| `src/check.ts` | Pure SVG-profile and exact silhouette auditor | Optional: a game-sdk unit test, if the set will grow (see gaps) |

## Leave these (evidence, tooling, reports)

These files prove the work; the port does not need them.

- `test/**`: generator, gallery builder, fixtures, mutants, sealed blind oracle.
- `reports/*.json`, `VERIFY.md`, `SHA256SUMS.txt`, `icons.zip`.
- `LOOP.md`, `NEXT.md`, `ASSUMPTIONS.md`.
- `package*.json`, `tsconfig.json`, `requirements-dev.txt`, `.github/workflows/B15.yml`.
- `gallery.html`: a review page; open it from disk to pick icons.
- Generated and never committed: `png/`, `png-cairo/`, `preview/`, `artifact/`.

## Port steps

1. **Pure module.**
   - Copy `src/art.ts` and `src/icons.ts` to `packages/game-sdk/src/icons/` and change `'./art.js'` to `'./art'`. Keep named exports and keep the `Object.hasOwn` guard.
   - The module is pure, so `games/*/server` may use `IconName` in views, e.g. `{ icon: 'bomb' }`.
2. **React component.** Add `packages/game-sdk/src/ui/Icon.tsx` and a CSS module, exported from a new `packages/game-sdk/src/ui-icon.ts`, plus an `"./ui/icon": "./src/ui-icon.ts"` line in `packages/game-sdk/package.json` exports:
   ```tsx
   export function Icon({ name, size = 24, label }: { name: IconName; size?: number; label?: string }): JSX.Element {
     return (
       <svg className={styles.icon} width={size} height={size} viewBox="0 0 64 64"
            role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
         <use href={`/icons.svg?v=${ICONS_VERSION}#pb-icon-${name}`} />
       </svg>
     );
   }
   // Icon.module.css: .icon { flex: none; color: var(--pb-icon-ink); }
   ```
   - Import only the `IconName` type from `icons/`, so `art.ts` never enters a client chunk.
   - `ICONS_VERSION` is a short hash written by the generator script, for cache busting.
3. **Sprite as a static file.**
   - Add `scripts/gen-icons.ts`. It writes `packages/client/public/icons.svg` from `getSprite()`, plus `ICONS_VERSION` (the first 8 hex digits of its SHA-256) into a generated `.ts` file.
   - Give the script a `--check` mode and add it to `scripts/verify.ts`, next to the registry and library freshness checks.
   - Vite serves `public/` in dev and copies it to `dist/`, so no server change is needed.
4. **Token.**
   - In `packages/client/src/styles/tokens.css`, add `--pb-icon-ink: #20243a;` to `:root` and `--pb-icon-ink: #000000;` to `[data-theme='contrast']`.
   - Night caveat: `:root` is the night theme (`--pb-bg` `#0f1020`). The default outline is about 1.2:1 there (about 1.1:1 on `--pb-surface` `#1c1e3a`), so outlines fade on night and the cream, coral, gold, mint and lavender fills carry each shape. Check it in situ (`pnpm e2e:themes`) before accepting this default, or choose a lighter night ink as a design call. The `ink` option can supply it.
   - Add one row to `docs/DESIGN_SYSTEM.md`: icon sizes are 24 px inside ≥ 44 px phone targets and ≥ 48 px on the TV; the ink token is `--pb-icon-ink`; never use an icon alone, always pair it with a label.
5. **Replace emoji chrome with `<Icon>`.** Counts are non-test uses in `packages/client/src`:

   Counts are plain substring counts in every non-test `.ts`/`.tsx` file under `packages/client/src`, taken on 2026-10-08 (re-counted in the independent review, same numbers). They include comments and i18n strings, so some uses are off screen. Paths are relative to `packages/client/src/`.

   | Glyph (uses) | B15 icon | Where (examples) |
   | --- | --- | --- |
   | ✕ (21) | `close` | `controller/VipMenu.tsx:97`, `ThemePicker.tsx`, `controller/LobbyLine.tsx`, `controller/PresencePrompt.tsx` |
   | ✓ (27) | `check` | `controller/ChoiceRow.tsx`, `controller/ShareSheet.tsx`, `controller/StartStage.tsx`, `ThemePicker.tsx` |
   | ★ (28), VIP menu and badges | `star` | `controller/ControllerShell.tsx:194`, `controller/RoomSwitch.tsx`, `controller/SavedGames.tsx`, `controller/picker/ChosenGame.tsx` |
   | 🤖 (14) | `bot` | `tv/HostBar.tsx:89`, `controller/picker/AboutSheet.tsx`, `controller/picker/ChosenGame.tsx` |
   | 📺 (17) / 📱 (11) | `tv` / `phone` | `controller/ThisPhone.tsx`, `surface/SurfaceHint.tsx`, `preview/PreviewToolbar.tsx` |
   | 🎧 (7) | `headphones` | `controller/PresencePrompt.tsx`, `controller/picker/GameRow.tsx`, `tv/TvRoomSwitches.tsx` |
   | 👑 (7) | `crown` | `tv/TvFrame.tsx`, `tv/TvResults.tsx`, `tv/Tonight.tsx` |
   | ▶ (5) ⏸ (5) ⏭ (1) ■ (1) ↻ (5) | `play` `pause` `skip` `stop` `refresh` | `tv/HostBar.tsx:164-213`, `tv/TvPlaying.tsx`, `controller/ShellCountdown.tsx`, `tv/TvStartStage.tsx` |
   | 🔇 (4) / 🔊 (3) | `sound-off` / `sound-on` | `tv/AudioGate.tsx`, `tv/HostBar.tsx:245` (🔇) |
   | 🎵 (7) / 💬 (7) / 🔒 (5) / 🏆 (6) / 🎮 (2) | `music-note` / `chat` / `lock` / `trophy` / `gamepad` | `tv/TvRoomSwitches.tsx`, `controller/PhoneSettings.tsx`, `controller/Join.tsx`, `TeamBoards.tsx`, `tv/HostBar.tsx` |
   | 👀 (2) 👍 (7) 🏠 (6) ⚙ (1) ⛶ (1) 📷 (2) 👥 (8) 🌶 (1) | `eye` `thumbs-up` `home` `settings` `expand` `camera` `players` `flame` | single uses: `controller/ThisPhone.tsx`, `tv/TvFrame.tsx:101` (🏠), `preview/PreviewToolbar.tsx:103` (⚙), `tv/AudioGate.tsx:184` (⛶), `controller/JoinPortrait.tsx`, `controller/Join.tsx`, `keySetting.ts` |

   - **Trap:** many glyphs sit inside `L('📼 …')` / `L('🔇 …')` strings. The English text is the i18n key, so moving a glyph out of the string changes the key.
     - Update the Spanish entries in the same commit (`packages/client/src/i18n-es*.ts`, `tv/strings.ts`, `surface/strings.ts`).
     - `scripts/i18n-coverage.test.ts` fails on a missed key.
   - **Do not replace** game identity emoji (`manifest.icon`, `GameIcon.tsx` fallback, ADR-056). B15 is chrome, not game art.
6. **Docs and records.**
   - `docs/sdk/icons.md`: API, sizes, the inventory from `manifest.json`, and "how to add an icon": draw in `art.ts` and keep the silhouette rule.
   - Add a line to `packages/game-sdk/README.md`.
   - Add an ADR with the next free number after the owner's local main (its latest is ADR-081 as checked on 2026-10-08, so ADR-082 unless main has moved): "UI chrome icons: B15 static sprite, emoji stay for game identity".
   - Add to `CHANGELOG.md` Unreleased: `feat(ui): B15 icon set replaces emoji chrome`.
   - `docs/DEPENDENCIES.md` is unchanged (no new dependency).

## Make it feel AAA in PartyBox (not a 2D bootleg)

| Beat | TV | Phone |
| --- | --- | --- |
| Host controls | `HostBar` shows `play` / `pause` / `skip` / `stop` at 48 px with labels. Press is a 0.95 scale over 150 ms on the shared ease. Pause/play cross-fade (opacity, 150 ms), never a glyph jump. | The VIP ★ menu button uses `star` at 24 px in a 44 px target. Its rows use `bot`, `headphones`, `sound-on`/`sound-off`, `lock`. |
| Mute toggle | `sound-on` → `sound-off` cross-fade. The wave arcs are separate ribbons, so a later pass can animate them out one by one. | Same, plus a haptic tick (`packages/client/src/controller/haptics.ts`, `BUZZ` patterns). |
| Refresh / shuffle | `refresh` turns 360° once over 600 ms (`--pb-motion-slow`). | Same. Reduced motion: no turn. |
| Lobby | `players`, `bot` (add bot), `crown` on the VIP chip. Player colour (B16) goes on the chip ring, never on the icon fill. | `phone` / `tv` in the "this phone" sheet. |
| Results | `trophy`, `medal` and `podium` pop in on the B18 spring (overshoot ≤ 6 %), staggered 60 ms, synced to the B17 win cue. `confetti` and `sparkles` frame the winner line in the F03 win screen. | The winner card shows `trophy` at 96 px; everyone else gets `medal`. |
| Contrast theme | `--pb-icon-ink: #000` keeps a hard edge. The fills already clear the dark backgrounds. | Same. |

Do not tint icon fills with `--pb-accent*`. The five fills are the icons' own illustration palette; theming changes ink only. A later "mono" variant could follow accent tokens, but that is not part of B15.

## Known gaps and risks

**Must**
- **i18n keys.** Glyphs embedded in `L('…')` strings change keys when removed (see step 5). Update the Spanish strings in the same commit.
- **Caching.** Version the sprite URL (`?v=ICONS_VERSION`), or an updated sprite can show stale art on phones that cached it.

**Should**
- **No B15 icon yet for these chrome glyphs.** Draw them in `art.ts` before a full emoji sweep (rerun `npm test` so the silhouette gate stays green), or leave those emoji in place:
  - 🌐 🌍 language (6)
  - ⚠ warning (5)
  - 📼 recap/film (5)
  - 🙋 wants to play (5)
  - 🎨 theme (4)
  - 📍 same room (4)
  - 💡 hint (2)
  - 📳 vibrate (2)
  - ✏ edit
  - 🚪 leave
  - 📄 document
  - 🖼 image
  - 🔞 adults only
- **`clap`** is one hand with motion lines, the original drawing kept on purpose. It reads close to a wave (👋). That suits greetings too, but redraw it if a true two-hand clap is needed.
- **Silhouette check.** If the set grows inside PartyBox, port `src/check.ts` plus a rasteriser-based IoU test, or the near-duplicate guard is lost. PartyBox has no rasteriser dependency today, so that would need an ADR and a DEPENDENCIES line.
- **Recognition.** No human recognition study at 24 px. Run a quick hallway test with the owner's household before replacing ✕ / ✓ everywhere.
- **Name that does not match the picture: `whisper`.** The artwork is an ear with sound waves, which reads as "listen". PartyBox has no whisper mechanic (the word appears only as blanks-game content). Before the port, either rename it to `listen` (manifest id and titles, the `src/art.ts` key, the sealed files and reports, then a full `npm test`) or redraw it. The id is public, so this is the owner's call.
- **Trial redraws rejected (2026-10-08).** `handshake` as a cuffed horizontal clasp, and `clap` as two palms with motion marks, both read worse than the originals at 24 and 96 px. The originals stay. `handshake` is still a soft gold shape at 24 px, so a hallway test should check it first.
- **Look-alikes at 24 px.** `link` / `unlink`, `sound-on` / `sound-off` and `expand` / `collapse` differ mainly by a break or a mirror. Always pair them with a visible label.
- **Night outline.** The default ink `#20243a` is about 1.2:1 on the night background `#0f1020`, so every outline fades there and only the fills show the edge. The night contact sheet still reads well (checked in the review), but this is a design call, not a measured outline contrast. The 48 px night test is a fill proxy. Decide the night ink during the port (see port step 4).

**Nit**
- `expand` and `collapse` are mirror concepts and look alike at 24 px; always pair them with a label.
- A few objects are drawn tilted (card-back, coin, dice-cup) partly to keep silhouettes distinct. Keep that when redrawing.
- **Licence.** All geometry is original work made for this job: no fonts, text, traced or stock art, or trademarks in any SVG. The drops repo has no LICENSE file; record the provenance (job B15, owner-commissioned) in `docs/sdk/icons.md`.

## Verify after porting

```sh
pnpm verify                 # includes the new icons.svg --check
pnpm check-bundle           # entry gzip may grow ~0.3 KB for <Icon>; art.ts must not appear in any client chunk
pnpm e2e:a11y --all         # icons aria-hidden, every icon-only button keeps an aria-label
pnpm e2e:themes             # five themes: ink and fills on every surface
pnpm e2e:vip                # the ★ menu button still visible and on top
pnpm e2e:fold               # no new scroll past the fold on phones
pnpm polish-check --game herd-mind --port <own port>   # any game whose HUD shows the new chrome
```

Then open `/preview/<game>/<fixture>?view=tv` and `?view=controller` for the host bar, VIP menu and results screens.

## Polish pass 2026-10-08 (Claude, cloud)

**Checked**
- Fetched the branch: head `b37a00d`, CI green on it.
- Baseline `npm test`: PASS. 3 seeds, 75/75 mutants, maximum pair camera/gamepad 0.7874.
- Rendered contact sheets of all 120 icons at 24/48/96 px on night (#0f1020) and daylight (#f6f5ff) and reviewed them icon by icon.
- Final `npm test` after the changes: **PASS**: 84 rows, 282,990 cases, seeds 1–3, 75/75 mutants killed. Highest silhouette pair 0.7935 (CairoSVG 24 px, pawn / chess-bishop; gate below 0.8). Cross-renderer minimum 0.9865. Largest file `clover.svg`, 1,052 bytes.

**Changed**
- `bac3314`: redrew or re-weighted 73 icons, for three reasons:
  - Line icons now use ink-cased ribbons, so they have the same edge as filled shapes.
  - Ink is no longer used for structure, so icons no longer vanish at night.
  - Silhouettes are more distinct, and everything stays in the 3–61 live area.
  Original `handshake` kept; original `clap` and `compass` kept but adjusted.
- `c0aa205`: `getIcon(name, { ink })` and `getSprite()`, plus `sprite.svg` and the self-contained `gallery.html` (five themes, sizes, EN/ES, search).
- `6cfc78d`: Spanish titles in `manifest.json` and new tests (ink option, sprite, gallery freshness, Spanish titles, 2-unit live area at 256 px, night visibility at 48 px). Contact sheets now include the night and daylight backgrounds. `package.py` keeps dated polish sections in VERIFY.md.
- `ae117e2` and the commit adding this file: README rewritten (what / how / status, quick start, API, product vs evidence, style rules), one LOOP line, sources resealed, this guide, and a VERIFY polish section.

### Continuation pass 2026-10-08 (Claude, cloud, second session)

**Checked**
- PR #10 head `c878bc5`: hosted `verify` check green. The PR description still cites `b37a00d`, so it is stale.
- Re-rendered all 120 icons at 24, 48 and 96 px on night `#0f1020` and daylight `#f6f5ff`, and reviewed every strip. The set is coherent: one grid, one ribbon outline, one five-colour palette, and the cream fills keep their edge on daylight.
- Weakest icons: `handshake` (soft at 24 px), `clap` (reads as a wave), `whisper` (name), and the look-alike pairs in the gaps list.
- Recounted the emoji uses in `packages/client/src` and fixed the table counts. Checked the PartyBox paths, scripts and line references the port steps cite; they exist. The ADR pointer was wrong (the owner's local main ends at ADR-081, not ADR-088).

**Changed**
- INTEGRATION.md only: branch and CI facts, runtime, emoji counts, ADR pointer, three new gaps, and this section.
- LOOP.md: one line.
- Artwork: no change. Two redraw trials were rejected (see gaps).

**Verification:** `npm test` on Node 22.22.0 passed once: exit 0, seeds 1, 2 and 3, 84 rows, 282,990 cases, 75/75 mutants killed, highest silhouette pair 0.7935 (CairoSVG 24 px), bundle checksums 894 OK. Details in VERIFY.md under "Polish pass 2026-10-08 (continuation)".

## Independent review 2026-10-08 (Claude, cloud, reviewer)

**Checked**
- Fresh `npm test` on `9e56abe`: exit 0, 84 rows, 94,330 cases per seed (282,990 in total), 75/75 mutants, and both checksum manifests verify. The run left the tree clean.
- Hosted `verify` is green on `9e56abe`, `c878bc5` and `b37a00d`.
- Chromium: the sprite resolves all 120 `<use>` references (night and daylight, no errors). The gallery has no console errors, no external requests and no horizontal scroll at 390 px.
- Contact sheets (night, daylight) and the set's API behaviour, including unknown names, prototype keys and invalid inks.
- PartyBox paths, line references, emoji counts, token names, SDK export naming and the ADR pointer, against local main `26b85ba6`.

**Changed (this guide)**
- Status now names the one open owner decision (`whisper`). The night outline is recorded as a gap, with a port caveat. The night check is described as a proxy.
- The emoji table is one table again, and its paths are fixed (`controller/`, `controller/picker/`, `tv/`, `preview/`, root). The haptics path is fixed.

Full review record, including what is still unverified, is in VERIFY.md under "Independent review 2026-10-08".
