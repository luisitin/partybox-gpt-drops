# B15 — 120 original SVG game icons

A coordinated, chunky, friendly icon family drawn specifically for this job. Rounded outlines, warm paper, coral, gold, mint and lavender; no text, fonts, stock icon library, external artwork, embedded images or traced references in the SVGs.

## What is here

`icons/` contains all 120 individually minified SVG files, committed directly for review. `npm test` also builds the deterministic `icons.zip` bundle. The full downloadable/CI bundle includes 360 primary transparent PNGs in `png/24`, `png/48`, `png/256`, a second 360-image rasterizer proof in `png-cairo/`, five PNG contact sheets in `preview/`, and a nearest-neighbor 4x view of the actual 24 px pixels.

`src/art.ts` is the complete original geometry. `src/icons.ts` is the dependency-free, pure lookup API. `src/check.ts` is a pure SVG-profile and exact silhouette auditor. `test/oracle.py` supplies a separately structured XML/PNG/IoU checker. `test/` also contains the generator, adversarial fixtures, executable source mutation tests and deterministic packager. `manifest.json` describes every icon. `VERIFY.md` records exact test counts, seeds, commands and limitations. Complete pair ledgers and mutation evidence are in `reports/` after testing.

Only this job folder and `.github/workflows/B15.yml` belong to this change. No changes to main or other job folders are required.

## Rerun

Use Node.js 22+, Python 3.11+, a C compiler-free prebuilt Sharp installation, libcairo2 and a DejaVu Sans font for contact-sheet labels. The font is used only by the test environment; no font files are distributed.

On Ubuntu, first install development tools:

```sh
sudo apt-get update
sudo apt-get install -y --no-install-recommends libcairo2 fonts-dejavu-core
cd jobs/B15-icons-120
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
python3 -m pip install -r requirements-dev.txt
npm test
```

After one-time installation, **`npm test` is the only test command**. It strictly compiles all TypeScript, reruns every suite for seeds 1, 2 and 3, rebuilds the sealed SVG bundle when absent without overwriting edited icons, rasterizes all three sizes in both engines, compares every silhouette pair, checks five contact-sheet backgrounds, runs all 25 real source mutants per seed, writes evidence and produces `artifact/B15-icons-120.zip`. Any failed assertion, surviving mutant, checksum mismatch, oversized file, failed renderer, compiler failure or oracle disagreement stops the build with a nonzero exit code.

The runtime package has zero dependencies; TypeScript, Node types, Sharp and CairoSVG are **development/test tools**, not UI runtime dependencies. A fresh installation needs package-registry access. No claim of an offline fresh install is made.

The GitHub workflow uses pull_request, the required job path filter, ubuntu-latest, a 30-minute timeout, read-only contents permissions, no secrets, and major-pinned actions/* actions. It uploads the complete reproducible ZIP with all PNGs and evidence. The PR description links the observed run; a local pass alone is not described as a green Actions run.

## Use

```html
<img src="./icons/dice.svg" width="24" height="24" alt="Roll dice">
```

```ts
import { getIcon, iconNames } from './dist/src/icons.js';
const svg = getIcon('trophy'); // SVG string; unknown names return undefined.
```

Keep accessible names in the surrounding UI; the icon artwork itself contains no text. The supplied PNGs have transparent backgrounds. Contact-sheet backgrounds are not baked into the icons.

## Constraints and exact silhouette definition

Every source file uses `viewBox="0 0 64 64"`, at most 1,500 UTF-8 bytes, and no more than six distinct case-normalized hex fill/stroke paints. `none` is transparency, not a seventh color. Files are already compact one-line SVG; checking their actual bytes is stricter than only checking a later minifier's output. One shared palette is used across the family: `#20243a`, `#fff4d9`, `#ff7668`, `#ffc857`, `#52cbb5`, `#9a8df2`.

For each native raster size, foreground is alpha >= 128. Internal transparent holes are retained. Every pair uses the same fixed canvas, without alignment, normalization, pairwise transforms, or silhouette dilation. The test checks **5 × intersection < 4 × union** in integers. An IoU of exactly 0.8 fails. There are exactly 120 × 119 / 2 = **7,140 unique unordered pairs per size**. Their exact counts are reported, not just a sampled maximum.

Checker A uses a TypeScript scanner and 32-bit word population counts. Checker B uses Python's XML parser, a standard-library PNG decoder and arbitrary-precision integer bit operations. Identical input PNGs must produce identical mask bytes and exact pair counts in both. CairoSVG independently rerenders all artwork, and all of its pairs must also pass. Cross-renderer antialiasing need not be pixel-identical; per-icon binary-mask overlap must remain at least 0.90.

The SVG auditor intentionally accepts a narrow, inert subset used by these assets: svg/g/path/rect/circle/ellipse, absolute M/L/H/V/C/Q/Z paths, finite numeric geometry, hex/none paints and three-argument rotate transforms. It rejects text, scripts, styles, handlers, declarations, external references and unsupported attributes. It is **not** a general-purpose SVG sanitizer or a replacement for a hardened untrusted-content security boundary.

## Checksums and authoring changes

`SHA256SUMS.txt` seals all 120 individual SVGs, the deterministic ZIP, authored source files and the one workflow. It is verified in every seed. `BUNDLE_SHA256SUMS.txt` covers the complete delivered bundle, including generated PNGs and reports, and is independently verified during packaging. No manifest tries to include its own hash. Run checksum commands from this job directory.

For an intentional artwork edit, modify `src/art.ts`, run `npm run generate`, rebuild `icons.zip` from the resulting 120 files using fixed ZIP timestamps, then run `python3 test/package.py --seal-sources` and `npm test`. Ordinary tests never silently overwrite a modified SVG with the source generator. Changing a sealed input requires explicitly resealing it.

## Important verification boundary

The two checkers are structurally different, but they were authored in the same assistant session. A blind, isolated second author was not available; **that part of the requested independence criterion remains UNVERIFIED**. Likewise, no independent human-panel recognition study is represented as having occurred. Native 24 px proofs are supplied for visual review. See VERIFY.md for these limitations rather than treating a green automated run as proof of every subjective or authorship requirement.

## Full icon inventory

### Party essentials

| # | File / API id | Meaning |
|---:|---|---|
| 1 | `dice` | Dice |
| 2 | `coin` | Coin |
| 3 | `star` | Star |
| 4 | `crown` | Crown |
| 5 | `timer` | Timer |
| 6 | `microphone` | Microphone |
| 7 | `vote` | Vote |
| 8 | `skip` | Skip |
| 9 | `trophy` | Trophy |
| 10 | `card-back` | Card back |
| 11 | `heart` | Heart |
| 12 | `bomb` | Bomb |
| 13 | `shopping-bag` | Shopping bag |
| 14 | `key` | Key |
| 15 | `lock` | Lock |
| 16 | `gift` | Gift |
| 17 | `lightning` | Lightning |
| 18 | `shield` | Shield |
| 19 | `flag` | Flag |
| 20 | `gem` | Gem |

### Navigation and actions

| # | File / API id | Meaning |
|---:|---|---|
| 21 | `arrow-up` | Arrow up |
| 22 | `arrow-down` | Arrow down |
| 23 | `arrow-left` | Arrow left |
| 24 | `arrow-right` | Arrow right |
| 25 | `chevron-left` | Chevron left |
| 26 | `chevron-right` | Chevron right |
| 27 | `undo` | Undo |
| 28 | `redo` | Redo |
| 29 | `refresh` | Refresh |
| 30 | `shuffle` | Shuffle |
| 31 | `expand` | Expand |
| 32 | `collapse` | Collapse |
| 33 | `play` | Play |
| 34 | `pause` | Pause |
| 35 | `stop` | Stop |
| 36 | `home` | Home |
| 37 | `menu` | Menu |
| 38 | `close` | Close |
| 39 | `check` | Check |
| 40 | `plus` | Plus |

### Tabletop and competition

| # | File / API id | Meaning |
|---:|---|---|
| 41 | `pawn` | Pawn |
| 42 | `meeple` | Meeple |
| 43 | `chess-knight` | Chess knight |
| 44 | `chess-rook` | Chess rook |
| 45 | `chess-bishop` | Chess bishop |
| 46 | `domino` | Domino |
| 47 | `poker-chip` | Poker chip |
| 48 | `cards-hand` | Hand of cards |
| 49 | `tile-stack` | Tile stack |
| 50 | `puzzle-piece` | Puzzle piece |
| 51 | `ticket` | Ticket |
| 52 | `map` | Map |
| 53 | `compass` | Compass |
| 54 | `target` | Target |
| 55 | `crosshair` | Crosshair |
| 56 | `flag-finish` | Finish flag |
| 57 | `podium` | Podium |
| 58 | `medal` | Medal |
| 59 | `laurel` | Laurel |
| 60 | `scales` | Scales |

### People and communication

| # | File / API id | Meaning |
|---:|---|---|
| 61 | `player` | Player |
| 62 | `players` | Players |
| 63 | `host` | Host |
| 64 | `bot` | Bot |
| 65 | `chat` | Chat |
| 66 | `whisper` | Whisper |
| 67 | `laugh` | Laugh |
| 68 | `clap` | Clap |
| 69 | `thumbs-up` | Thumbs up |
| 70 | `handshake` | Handshake |
| 71 | `megaphone` | Megaphone |
| 72 | `bell` | Bell |
| 73 | `sound-on` | Sound on |
| 74 | `sound-off` | Sound off |
| 75 | `headphones` | Headphones |
| 76 | `music-note` | Music note |
| 77 | `camera` | Camera |
| 78 | `eye` | Eye |
| 79 | `eye-off` | Eye off |
| 80 | `peace` | Peace |

### Game objects and effects

| # | File / API id | Meaning |
|---:|---|---|
| 81 | `hourglass` | Hourglass |
| 82 | `calendar` | Calendar |
| 83 | `rocket` | Rocket |
| 84 | `flame` | Flame |
| 85 | `snowflake` | Snowflake |
| 86 | `skull` | Skull |
| 87 | `ghost` | Ghost |
| 88 | `monster` | Monster |
| 89 | `magic-wand` | Magic wand |
| 90 | `potion` | Potion |
| 91 | `clover` | Clover |
| 92 | `magnet` | Magnet |
| 93 | `anchor` | Anchor |
| 94 | `sword` | Sword |
| 95 | `axe` | Axe |
| 96 | `treasure-chest` | Treasure chest |
| 97 | `chest-open` | Open chest |
| 98 | `backpack` | Backpack |
| 99 | `coin-purse` | Coin purse |
| 100 | `dice-cup` | Dice cup |

### System and celebration

| # | File / API id | Meaning |
|---:|---|---|
| 101 | `settings` | Settings |
| 102 | `search` | Search |
| 103 | `filter` | Filter |
| 104 | `sort` | Sort |
| 105 | `link` | Link |
| 106 | `unlink` | Unlink |
| 107 | `download` | Download |
| 108 | `upload` | Upload |
| 109 | `share` | Share |
| 110 | `wifi` | Wi-Fi |
| 111 | `phone` | Phone |
| 112 | `tv` | TV |
| 113 | `gamepad` | Gamepad |
| 114 | `battery` | Battery |
| 115 | `plug` | Plug |
| 116 | `cloud` | Cloud |
| 117 | `sun` | Sun |
| 118 | `moon` | Moon |
| 119 | `sparkles` | Sparkles |
| 120 | `confetti` | Confetti |
