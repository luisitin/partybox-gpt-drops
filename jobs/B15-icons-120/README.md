# B15: 120 original SVG game icons

**What this is:** 120 original, chunky, friendly icons on a 64-unit grid, with one 6-colour palette, a pure TypeScript lookup, a themeable SVG sprite and Spanish titles.\
**How to use it:** take `icons/*.svg` or `sprite.svg` and render with `<use href="#pb-icon-dice"/>`; outline colour follows CSS `color`. In code, call `getIcon('dice', { ink: 'currentColor' })`.\
**Status:** ready to port once the owner decides the `whisper` name (see [INTEGRATION.md](INTEGRATION.md) gaps). `npm test` passes all three seeds (every pair of icons at every size in both renderers, 75 of 75 mutants killed). Port notes are in [INTEGRATION.md](INTEGRATION.md).

Open `gallery.html` from disk to browse the set on all five PartyBox themes at 24, 48 and 96 px, in English or Spanish.

## Quick start

Requires Node.js 22+, Python 3.11+, libcairo2 and a DejaVu Sans font (the font is used only for contact-sheet labels).

```sh
sudo apt-get install -y --no-install-recommends libcairo2 fonts-dejavu-core   # once, Ubuntu
cd jobs/B15-icons-120
npm ci --ignore-scripts --no-audit --no-fund
python3 -m pip install -r requirements-dev.txt
npm test          # about 5 minutes; writes VERIFY.md, reports/ and artifact/B15-icons-120.zip
```

`npm test` is the only test command. It:

- compiles strictly;
- reruns every suite for seeds 1, 2 and 3;
- rasterises every icon at 24, 48 and 256 px in librsvg (Sharp) and CairoSVG;
- compares all 7,140 silhouette pairs per size;
- checks the live area, night visibility, sprite, gallery and Spanish titles;
- checks contact sheets on seven backgrounds;
- runs 25 real source mutants per seed;
- packages the evidence.

Any failure exits non-zero.

**To change artwork:**

```sh
# 1. edit src/art.ts
npm run generate                        # icons/*.svg, sprite.svg, gallery.html, png/, preview/
rm icons.zip && python3 test/unpack.py  # rebuild the deterministic bundle (fixed 1980 timestamps)
python3 test/package.py --seal-sources  # reseal authored inputs (after every doc or source edit)
npm test
```

Ordinary test runs never overwrite an edited SVG. A changed sealed input fails until you reseal it.

## API and data shape

```ts
import { getIcon, getSprite, iconNames, palette, defaultInk } from './dist/src/icons.js';

getIcon('trophy');                          // canonical SVG string (ink #20243a), or undefined for an unknown name
getIcon('trophy', { ink: 'currentColor' }); // ink follows CSS `color`; also accepts lowercase '#rgb' or '#rrggbb' (uppercase is rejected by design)
getIcon('trophy', { ink: 'red' });          // undefined: invalid ink is rejected, nothing throws
getSprite();                                // one hidden <svg> holding <symbol id="pb-icon-NAME" viewBox="0 0 64 64"> x120, ink = currentColor
iconNames;                                  // readonly list of 120 ids, in manifest order
palette;                                    // ['#20243a', '#fff4d9', '#ff7668', '#ffc857', '#52cbb5', '#9a8df2']
defaultInk;                                 // '#20243a', the only colour the ink option swaps
```

- All functions are pure, with no I/O and zero runtime dependencies.
- `manifest.json` is an array of `{ "id", "title", "titleEs", "category" }`: 120 entries in six categories of 20.
- `sprite.svg` is byte-for-byte `getSprite()`. Put it inline once, or serve it as a static file and reference `icons.svg#pb-icon-dice`. Size: 54 KB, or 9 KB gzipped.

```html
<svg class="pb-icon" width="48" height="48" style="color: var(--pb-icon-ink, #20243a)" aria-hidden="true">
  <use href="#pb-icon-dice"/>
</svg>
```

The icons contain no text. Keep the accessible name on the surrounding button or label.

## Style rules (what keeps the set coherent)

- **Grid:** a 64 x 64 viewBox. Art stays inside the live area 3–61, and the tests require 2 clear units at the edge.
- **Outline:** every shape has the same 4-unit ink outline (`#20243a`) with round caps and joins.
- **Lines are ribbons:** an ink casing `w + 8` wide sits under a coloured core `w` wide. Lines therefore get the same 4-unit edge as filled shapes, and crossings join cleanly.
- **Ink use:** ink is only for edges and small details, never for structure. At 48 px, at least a quarter of every icon's opaque pixels are lighter than the ink (tested). This is a fill-based proxy: the default outline is about 1.2:1 on the night background, so outlines fade there and the fills carry each shape.
- **Fills:** cream `#fff4d9`, coral `#ff7668`, gold `#ffc857`, mint `#52cbb5` and lavender `#9a8df2`.
- **Shine:** one short cream highlight stroke on round, glossy objects.
- **Distinct silhouettes:** no two icons overlap by IoU ≥ 0.8 at 24, 48 or 256 px. Tilts and asymmetric parts keep similar objects apart, for example the open chest's lid swung back and the dice cup's die rolling out.
- **Theming:** the canonical files keep a hex ink, because the sealed SVG profile accepts hex paints only. Only `getIcon({ ink })` and `sprite.svg` swap the ink, so CSS can theme it.

## Product vs evidence

| Kind | Files |
| --- | --- |
| **Product** (port these) | `icons/*.svg` (120 canonical SVGs) · `sprite.svg` · `src/icons.ts` + `src/art.ts` (pure API and geometry) · `manifest.json` (ids, English and Spanish titles, categories) |
| Review page | `gallery.html`: self-contained, no network, five themes, sizes, EN/ES, search, per-icon detail with a usage snippet |
| Checker | `src/check.ts`: pure SVG-profile and silhouette auditor. Useful as a lint if the set grows; the mutants target it, so keep it byte-stable |
| Evidence and tooling | `test/**` (generator, gallery builder, fixtures, mutants, sealed blind oracle in `test/blind/`) · `reports/results.json`, `reports/mutations.json` · `VERIFY.md` · `SHA256SUMS.txt` · `icons.zip` · `LOOP.md`, `NEXT.md`, `ASSUMPTIONS.md` |
| Generated, not committed | `png/`, `png-cairo/`, `preview/` (contact sheets), `dist/`, `artifact/B15-icons-120.zip` (also uploaded by CI) |

Only this job folder and `.github/workflows/B15.yml` belong to this job.

The workflow runs on pull requests that touch `jobs/B15-*/**`:

- `ubuntu-latest`, with a 30-minute timeout;
- read-only contents permission and no secrets;
- uploads the complete ZIP.

## Constraints and exact silhouette definition

**File limits.**
- Every file uses `viewBox="0 0 64 64"`, stays at or under 1,500 UTF-8 bytes, and has at most six distinct hex fill/stroke paints, all from the palette.
- `none` means transparent; it is not a seventh colour.

**Silhouette test.**
- For each native raster size, foreground is alpha >= 128, and internal holes are kept.
- Every pair is compared on the same fixed canvas, with no alignment, normalisation or dilation.
- The test checks `5 x intersection < 4 x union` in integers, so an IoU of exactly 0.8 fails. That is 7,140 unordered pairs per size, all counted exactly.

**Two independent checkers.**
- Checker A is a TypeScript scanner using 32-bit population counts.
- The sealed reference (`test/blind/oracle.py`) is independently authored Python: an XML parser, a standard-library PNG decoder and integer bit arithmetic. It decodes both renderers' PNGs and compares every pair.
- Identical PNGs must give identical mask bytes and pair counts in both checkers.
- The two renderers do not need identical antialiasing, but each icon's mask overlap between them must be at least 0.90.

**SVG profile.** The auditor accepts only a narrow, inert subset:
- elements: svg, g, path, rect, circle, ellipse;
- path commands: absolute M/L/H/V/C/Q/Z;
- finite numbers, hex or none paints, and three-argument `rotate` transforms.

It rejects text, scripts, styles, handlers and external references. It is an asset validator, **not** a general SVG sanitizer.

## Checksums and verification boundary

**Checksums.**
- `SHA256SUMS.txt` seals the 120 SVGs, `icons.zip`, `sprite.svg`, `gallery.html`, the authored sources and docs, and the workflow. It is verified in every seed.
- `BUNDLE_SHA256SUMS.txt` covers the complete delivered bundle and is checked while packaging.

**Verification boundary.**
- The reference in `test/blind/` was authored without opening the production checker, artwork or fixtures, then sealed.
- One serialization rule missing from the supplied contract (`name="value"` with no spaces around `=`) is applied by the post-seal adapter. The raw decisions are kept.
- No human recognition study was run. The 24 px legibility claim is a visual design judgment backed by native-size proofs, not a measurement.
- See `VERIFY.md` for the generated counts and the dated polish notes.

## Full icon inventory

### Party essentials

| # | id | English | Español |
|---:|---|---|---|
| 1 | `dice` | Dice | Dados |
| 2 | `coin` | Coin | Moneda |
| 3 | `star` | Star | Estrella |
| 4 | `crown` | Crown | Corona |
| 5 | `timer` | Timer | Temporizador |
| 6 | `microphone` | Microphone | Micrófono |
| 7 | `vote` | Vote | Votar |
| 8 | `skip` | Skip | Saltar |
| 9 | `trophy` | Trophy | Trofeo |
| 10 | `card-back` | Card back | Reverso de carta |
| 11 | `heart` | Heart | Corazón |
| 12 | `bomb` | Bomb | Bomba |
| 13 | `shopping-bag` | Shopping bag | Bolsa de compras |
| 14 | `key` | Key | Llave |
| 15 | `lock` | Lock | Candado |
| 16 | `gift` | Gift | Regalo |
| 17 | `lightning` | Lightning | Rayo |
| 18 | `shield` | Shield | Escudo |
| 19 | `flag` | Flag | Bandera |
| 20 | `gem` | Gem | Gema |

### Navigation and actions

| # | id | English | Español |
|---:|---|---|---|
| 21 | `arrow-up` | Arrow up | Flecha arriba |
| 22 | `arrow-down` | Arrow down | Flecha abajo |
| 23 | `arrow-left` | Arrow left | Flecha izquierda |
| 24 | `arrow-right` | Arrow right | Flecha derecha |
| 25 | `chevron-left` | Chevron left | Anterior |
| 26 | `chevron-right` | Chevron right | Siguiente |
| 27 | `undo` | Undo | Deshacer |
| 28 | `redo` | Redo | Rehacer |
| 29 | `refresh` | Refresh | Actualizar |
| 30 | `shuffle` | Shuffle | Mezclar |
| 31 | `expand` | Expand | Expandir |
| 32 | `collapse` | Collapse | Contraer |
| 33 | `play` | Play | Reproducir |
| 34 | `pause` | Pause | Pausa |
| 35 | `stop` | Stop | Detener |
| 36 | `home` | Home | Inicio |
| 37 | `menu` | Menu | Menú |
| 38 | `close` | Close | Cerrar |
| 39 | `check` | Check | Confirmar |
| 40 | `plus` | Plus | Agregar |

### Tabletop and competition

| # | id | English | Español |
|---:|---|---|---|
| 41 | `pawn` | Pawn | Peón |
| 42 | `meeple` | Meeple | Meeple |
| 43 | `chess-knight` | Chess knight | Caballo de ajedrez |
| 44 | `chess-rook` | Chess rook | Torre de ajedrez |
| 45 | `chess-bishop` | Chess bishop | Alfil |
| 46 | `domino` | Domino | Dominó |
| 47 | `poker-chip` | Poker chip | Ficha de póker |
| 48 | `cards-hand` | Hand of cards | Mano de cartas |
| 49 | `tile-stack` | Tile stack | Pila de fichas |
| 50 | `puzzle-piece` | Puzzle piece | Pieza de rompecabezas |
| 51 | `ticket` | Ticket | Boleto |
| 52 | `map` | Map | Mapa |
| 53 | `compass` | Compass | Brújula |
| 54 | `target` | Target | Diana |
| 55 | `crosshair` | Crosshair | Mira |
| 56 | `flag-finish` | Finish flag | Bandera de meta |
| 57 | `podium` | Podium | Podio |
| 58 | `medal` | Medal | Medalla |
| 59 | `laurel` | Laurel | Laurel |
| 60 | `scales` | Scales | Balanza |

### People and communication

| # | id | English | Español |
|---:|---|---|---|
| 61 | `player` | Player | Jugador |
| 62 | `players` | Players | Jugadores |
| 63 | `host` | Host | Anfitrión |
| 64 | `bot` | Bot | Bot |
| 65 | `chat` | Chat | Chat |
| 66 | `whisper` | Whisper | Susurro |
| 67 | `laugh` | Laugh | Risa |
| 68 | `clap` | Clap | Aplauso |
| 69 | `thumbs-up` | Thumbs up | Pulgar arriba |
| 70 | `handshake` | Handshake | Apretón de manos |
| 71 | `megaphone` | Megaphone | Megáfono |
| 72 | `bell` | Bell | Campana |
| 73 | `sound-on` | Sound on | Sonido activado |
| 74 | `sound-off` | Sound off | Sonido silenciado |
| 75 | `headphones` | Headphones | Audífonos |
| 76 | `music-note` | Music note | Nota musical |
| 77 | `camera` | Camera | Cámara |
| 78 | `eye` | Eye | Mostrar |
| 79 | `eye-off` | Eye off | Ocultar |
| 80 | `peace` | Peace | Paz |

### Game objects and effects

| # | id | English | Español |
|---:|---|---|---|
| 81 | `hourglass` | Hourglass | Reloj de arena |
| 82 | `calendar` | Calendar | Calendario |
| 83 | `rocket` | Rocket | Cohete |
| 84 | `flame` | Flame | Llama |
| 85 | `snowflake` | Snowflake | Copo de nieve |
| 86 | `skull` | Skull | Calavera |
| 87 | `ghost` | Ghost | Fantasma |
| 88 | `monster` | Monster | Monstruo |
| 89 | `magic-wand` | Magic wand | Varita mágica |
| 90 | `potion` | Potion | Poción |
| 91 | `clover` | Clover | Trébol |
| 92 | `magnet` | Magnet | Imán |
| 93 | `anchor` | Anchor | Ancla |
| 94 | `sword` | Sword | Espada |
| 95 | `axe` | Axe | Hacha |
| 96 | `treasure-chest` | Treasure chest | Cofre del tesoro |
| 97 | `chest-open` | Open chest | Cofre abierto |
| 98 | `backpack` | Backpack | Mochila |
| 99 | `coin-purse` | Coin purse | Monedero |
| 100 | `dice-cup` | Dice cup | Cubilete |

### System and celebration

| # | id | English | Español |
|---:|---|---|---|
| 101 | `settings` | Settings | Ajustes |
| 102 | `search` | Search | Buscar |
| 103 | `filter` | Filter | Filtrar |
| 104 | `sort` | Sort | Ordenar |
| 105 | `link` | Link | Enlazar |
| 106 | `unlink` | Unlink | Desenlazar |
| 107 | `download` | Download | Descargar |
| 108 | `upload` | Upload | Subir |
| 109 | `share` | Share | Compartir |
| 110 | `wifi` | Wi-Fi | Wifi |
| 111 | `phone` | Phone | Teléfono |
| 112 | `tv` | TV | TV |
| 113 | `gamepad` | Gamepad | Control |
| 114 | `battery` | Battery | Batería |
| 115 | `plug` | Plug | Enchufe |
| 116 | `cloud` | Cloud | Nube |
| 117 | `sun` | Sun | Sol |
| 118 | `moon` | Moon | Luna |
| 119 | `sparkles` | Sparkles | Destellos |
| 120 | `confetti` | Confetti | Confeti |
