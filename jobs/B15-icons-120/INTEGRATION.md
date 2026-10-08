# B15 120 original SVG icons → PartyBox integration guide

> For the owner's desktop Claude agent, who ports this into the main repo (luisitin/partybox, local
> C:/dev/partybox). Read this file first; everything else in this folder is the job's own record.

| | |
| --- | --- |
| Status | **Ready to port**. Nothing in this folder needs fixing first. The port is UI chrome work, and the [gaps](#known-gaps-and-risks) below list what the set does not cover. |
| Branch | `job/B15-icons-120` @ `6cfc78d` (last product commit of this pass; later commits touch docs, seal and evidence only) · PR #10 · CI: green on `b37a00d` (checked 2026-10-08 before this pass); this pass: see the line below once checked |
| Repo | luisitin/partybox-gpt-drops |
| Test | `cd jobs/B15-icons-120 && npm ci --ignore-scripts --no-audit --no-fund && python3 -m pip install -r requirements-dev.txt && npm test` (needs libcairo2 and fonts-dejavu-core). Runtime about 5 (290 s on 4 shared CPUs) min |
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
  - no icon vanishes on the night background.
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
   - Add one row to `docs/DESIGN_SYSTEM.md`: icon sizes are 24 px inside ≥ 44 px phone targets and ≥ 48 px on the TV; the ink token is `--pb-icon-ink`; never use an icon alone, always pair it with a label.
5. **Replace emoji chrome with `<Icon>`.** Counts are non-test uses in `packages/client/src`:

   | Glyph (uses) | B15 icon | Where (examples) |
   | --- | --- | --- |
   | ✕ (14) | `close` | `controller/VipMenu.tsx:97`, `ThemePicker.tsx`, `controller/LobbyLine.tsx`, `PresencePrompt.tsx` |
   | ✓ (13) | `check` | `controller/ChoiceRow.tsx`, `ShareSheet.tsx`, `StartStage.tsx`, `ThemePicker.tsx` |
   | ★ (12) VIP menu | `star` | `controller/ControllerShell.tsx:194`, `RoomSwitch.tsx`, `SavedGames.tsx`, `picker/ChosenGame.tsx` |
   | 🤖 (10) | `bot` | `tv/HostBar.tsx:89`, `picker/AboutSheet.tsx`, `picker/ChosenGame.tsx` |
   | 📺 (9) / 📱 (6) | `tv` / `phone` | `controller/ThisPhone.tsx`, `surface/SurfaceHint.tsx`, `preview/PreviewToolbar.tsx` |
   | 🎧 (6) | `headphones` | `PresencePrompt.tsx`, `picker/GameRow.tsx`, `tv/TvRoomSwitches.tsx` |
   | 👑 (5) | `crown` | `tv/TvFrame.tsx`, `tv/TvResults.tsx`, `tv/Tonight.tsx` |
   | ▶ ⏸ ⏭ ■ ↻ | `play` `pause` `skip` `stop` `refresh` | `tv/HostBar.tsx:164-213`, `tv/TvPlaying.tsx`, `controller/ShellCountdown.tsx`, `tv/TvStartStage.tsx` |
   | 🔇 / 🔊 | `sound-off` / `sound-on` | `tv/AudioGate.tsx`, `tv/HostBar.tsx:245` |
   | 🎵 ♪ / 💬 / 🔒 / 🏆 / 🎮 | `music-note` / `chat` / `lock` / `trophy` / `gamepad` | `TvRoomSwitches.tsx`, `PhoneSettings.tsx`, `Join.tsx`, `TeamBoards.tsx`, `HostBar.tsx` |
   | 👀 👍 🏠 ⚙ ⛶ 📷 👥 🌶 | `eye` `thumbs-up` `home` `settings` `expand` `camera` `players` `flame` | single uses (`ThisPhone.tsx`, `TvFrame.tsx:101`, `PreviewToolbar.tsx:103`, `AudioGate.tsx:184`, `JoinPortrait.tsx`, `Join.tsx`, `keySetting.ts`) |

   - **Trap:** many glyphs sit inside `L('📼 …')` / `L('🔇 …')` strings. The English text is the i18n key, so moving a glyph out of the string changes the key.
     - Update the Spanish entries in the same commit (`packages/client/src/i18n-es*.ts`, `tv/strings.ts`, `surface/strings.ts`).
     - `scripts/i18n-coverage.test.ts` fails on a missed key.
   - **Do not replace** game identity emoji (`manifest.icon`, `GameIcon.tsx` fallback, ADR-056). B15 is chrome, not game art.
6. **Docs and records.**
   - `docs/sdk/icons.md`: API, sizes, the inventory from `manifest.json`, and "how to add an icon": draw in `art.ts` and keep the silhouette rule.
   - Add a line to `packages/game-sdk/README.md`.
   - Add an ADR, numbered after the owner's local main (≥ ADR-088): "UI chrome icons: B15 static sprite, emoji stay for game identity".
   - Add to `CHANGELOG.md` Unreleased: `feat(ui): B15 icon set replaces emoji chrome`.
   - `docs/DEPENDENCIES.md` is unchanged (no new dependency).

## Make it feel AAA in PartyBox (not a 2D bootleg)

| Beat | TV | Phone |
| --- | --- | --- |
| Host controls | `HostBar` shows `play` / `pause` / `skip` / `stop` at 48 px with labels. Press is a 0.95 scale over 150 ms on the shared ease. Pause/play cross-fade (opacity, 150 ms), never a glyph jump. | The VIP ★ menu button uses `star` at 24 px in a 44 px target. Its rows use `bot`, `headphones`, `sound-on`/`sound-off`, `lock`. |
| Mute toggle | `sound-on` → `sound-off` cross-fade. The wave arcs are separate ribbons, so a later pass can animate them out one by one. | Same, plus a haptic tick (`ui/haptics.ts`). |
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
