# B18 motion.ts → PartyBox integration guide

> For the owner's desktop Claude agent, who ports this into the main repo (luisitin/partybox, local C:/dev/partybox). Read this file first; the rest of this folder is the job's own record.

| | |
| --- | --- |
| Status | **Ready**: the runtime and its verification are complete. Port the file byte-for-byte first, then re-measure the gzip gate in PartyBox. |
| Branch | `job/B18-motion-ts` @ the PR #5 head (this pass adds the demo, probes and docs) · CI: the PR's `B18 motion verification` run |
| Repo | luisitin/partybox-gpt-drops |
| Test | `cd jobs/B18-motion-ts && npm ci --ignore-scripts && npm test` (three seeds, about 9 minutes on a 4-CPU box, Node 22) |
| Lands in PartyBox | `packages/game-sdk/src/motion.ts` (new, proposed), re-exported from `packages/game-sdk/src/index.ts`; the demo as a design-review artifact in `reports/design/` |

## What it is

A zero-dependency runtime with three functions and four named easings:

- `spring(t, m, k, c, x0, v0)` returns `[displacement, velocity]` for a damped spring, in closed form for under-, critically- and over-damped cases.
- `settleTime(m, k, c, x0, v0, e)` returns a conservative time after which both displacement and velocity stay within `e`. It is a bound, never early, and not the first crossing.
- `cubicBezier(p, x1, y1, x2, y2)` is CSS-equivalent (W3C CSS Easing Level 1), solved with safeguarded Newton plus bisection.
- `easings['ease' | 'ease-in' | 'ease-out' | 'ease-in-out']` are the CSS named curves.

Gzip: 842 bytes for the TypeScript source, 946 bytes for the emitted JavaScript, against a **1,200-byte gate** (level 9, measured by `tests/run.mjs`). The numerical work is checked against sealed independent references, not against the code itself (`tests/blind/`): an RK4 integrator at every 1e-4 s frame for 10,000 springs per seed, a 113-bit Bezier reference over 1,000,000 random points plus 40,004 named points per seed, and 25 isolated mutants that all have to be killed.

## Take these files

| File | What | Goes to (PartyBox path) |
| --- | --- | --- |
| `motion.ts` | the runtime, 1,614 bytes, unchanged since the verified delivery (sha256 `aafcd382…3bd964`) | `packages/game-sdk/src/motion.ts`, re-exported from the game-sdk index |
| `demo/curves.template.html`, `tools/make-demo.mjs` | the side-by-side page: CSS easing against `cubicBezier()`, and springs with settle bounds | `reports/design/motion/` (the design-review artifact); the built `demo/curves.html` opens from disk |
| `tools/settle-grid.mjs`, `tools/browser-check.mjs` | supplemental probes: settle bound on a 2,352-case grid, and Chromium's own CSS easing against `cubicBezier()` | evidence; the port does not need them |
| `tests/run.mjs`, `tests/blind/*` | the full seeded verification | evidence; PartyBox gets a small test instead (step 6) |

## Leave these (evidence and history)

`.work/`, `results/*.json` (the recorded snapshots), `tests/reference.ts`, `tests/oracle.cpp`, `tests/exact.mjs`, `tests/regressions.mjs`, `SOURCES.md`, `ASSUMPTIONS.md`, `VERIFY.md`. They prove the numbers; the port does not need them. Keep `SOURCES.md` next to the licence notes below.

## Port steps

1. **Keep the bytes.** `motion.ts` is minified on purpose: it is the only form that passes the 1,200-byte gate. A readable rewrite was tried and measured at 2,192 bytes gzipped, so it was rejected. Add the file to `.prettierignore` so the formatter leaves it alone, and keep lint from rewriting it (an `eslint-disable` for that one file, recorded in DECISIONS.md). If the file is ever reformatted, re-run the full job suite on the new bytes first; the sealed tests load the emitted JavaScript, so a change is a new delivery.
2. **Placement.** `packages/game-sdk/src/motion.ts`, re-exported as `export { spring, settleTime, cubicBezier, easings } from './motion';` in `packages/game-sdk/src/index.ts`. The file has no imports, so it satisfies `games → game-sdk → shared`. Games and client code both import it from `@partybox/game-sdk`.
3. **No new dependency.** The runtime has none, so `docs/DEPENDENCIES.md` needs no line. TypeScript 5.8.3 stays a job-only dev dependency and is not added to PartyBox.
4. **Settle-detection recipe (rAF, client).** Pick the epsilon in the units of the animated value; for pixels:
   ```ts
   import { spring, settleTime } from '@partybox/game-sdk';
   const EPS_PX = 0.5;                                   // "at rest" in pixels (position and speed)
   const T = settleTime(1, k, c, dx0, v0, EPS_PX);       // seconds; a bound, never early
   // T === Number.MAX_VALUE means "no finite bound": keep the loop alive and never hand T to a timer.
   // each frame, at elapsed seconds t:
   if (t >= T) { pos = target; /* stop the loop */ }
   else { const [d] = spring(t, 1, k, c, dx0, v0); pos = target + d; }
   ```
   The bound is conservative, so the stop is safe but may come later than the visible settle. Do not time the visuals by `T`; time them by the feel target and use `T` only to stop.
5. **Reduced-motion recipe.** Read `matchMedia('(prefers-reduced-motion: reduce)')` once and on change. When it matches, do not start a loop: set every value to its final state (`pos = target`, the spring's end, the Bezier at 1) and keep the same end state for the TV and phone. This is "jump to rest", not "slow down". CSS transitions get `transition: none` under the same media query. The demo already does this.
6. **Test in PartyBox.** A small `packages/game-sdk` test, in the existing vitest project, with these checks: `spring(0, 1, k, c, x0, v0)` returns `[x0, v0]`; `cubicBezier(0, …) = 0` and `cubicBezier(1, …) = 1`; the four named curves match the CSS constants in `SOURCES.md` (S1) at a fixed set of sample points; `settleTime` is finite for the presets; and, for each preset, that the position and speed stay within `EPS_PX` of rest from `T` on. Keep the inputs fixed; PartyBox's `pnpm verify` runs it.
7. **Decision record.** A short ADR in `docs/DECISIONS.md` (next free number after the owner's main): "motion.ts is the one motion math module; pure, zero dependencies, minified and gzip-gated at 1,200 bytes; the sealed job suite is the evidence."
8. **Verify in the app.** `pnpm verify`, then `pnpm e2e:a11y` (reduced motion must not hide anything that carries meaning), then look at the demo next to the real lobby. The demo is evidence for the feel, not a substitute for it.

## Make it feel AAA in PartyBox (not a 2D bootleg)

- **Disc drop.** A player's disc drops onto the TV lobby with a `spring` on `translateY` and settles inside the bound. The 2.5 px ring from the B16 colour set fades in with `opacity`, not after the settle. Only `transform` and `opacity` move, so the work stays on the compositor.
- **Easing choices.** Use `easings['ease-out']` for UI reveals (a fast start that reads as responsive) and `easings['ease-in-out']` for scene changes on the TV. Use springs where something should feel physical (dropping discs, the VIP crown bouncing once), never on text that a player must read while it moves.
- **Feel target.** The B16 integration asked for ≤ 450 ms and overshoot ≤ 6 %. The bound is not that target: for the snappy preset (k 400, c 28, ζ 0.70) the bound is 1.43 s, and the visible settle is expected to be shorter. This job did not measure it. Choose k and c against the feel target, then measure the first time the spring stays inside 0.5 px in PartyBox.
- **Look at it.** `npm run demo` builds `demo/curves.html`. Check the two lanes stay together on the 1.2 s easing rows, and that the settle tick sits where the dot stops.

## Licence / IP notes

- The four named curves and the extrapolation rule come from the W3C CSS Easing Functions Level 1 specification (`SOURCES.md`, S1). The damped-oscillator equation and its three cases come from MIT OpenCourseWare 18.03SC (S2). These are published facts; no code was copied from either.
- The runtime, the probes and the demo are original. The demo uses the system font stack and no images, icons or network resources.
- TypeScript 5.8.3 is a development dependency of the job only (registry metadata checked in S3). It is not shipped or imported.
- The sealed references were written by an isolated author from the original B18 instructions and the public contract (`tests/blind/AUTHORING.md`). Their hashes are in `tests/blind/SEALED-SHA256SUMS.txt`.

## Known gaps and risks (ranked)

**Must**
1. The minified source must reach PartyBox byte-for-byte, or be re-verified. A formatter or a rename changes the file the tests and the 1,200-byte gate measured. Step 1 covers the mitigation; it is not a code defect.

**Should**
2. **Readability.** The one-letter helper names and the single line mean the code is checked by the tests, not by reading. The readable version failed the gate (2,192 bytes gzipped).
3. **`settleTime` is a bound.** It stops a loop safely but never predicts the visible settle. Measured: 2,352 grid cases with zero violations (`npm run probes`), and 640,000 production plus 640,000 blind-reference tail checks per seed for position and velocity.
4. **Browser differential precision.** Chromium's CSS easing agrees with `cubicBezier()` to 5.0e-6 raw, which is the serialization limit (six significant digits). Against the rounded values, 2,582 of 2,624 samples are exact and the maximum is 1.0e-6. The 1e-7 claim against CSS rests on the 40,004 named-point references, not on the browser alone. `browser-check` needs a local Chromium, so it is not part of `npm test`.
5. **Invalid inputs fail quietly.** `spring` returns `[0, 0]` and `settleTime` returns `0` for a nonpositive mass; a caller with a bad mass sees "settled" with no error. Validate mass in the caller (the README documents this guard).
6. **Feel is unmeasured.** No human has watched the page on a TV or phone; the screenshots were checked at 1,100 px, 390 px and reduced motion only.

**Nit**
7. The demo's "settled" text uses the 0.001 epsilon in the job's units. PartyBox works in pixels, so step 4 re-scales the epsilon.

## Verify after porting

```sh
cd jobs/B18-motion-ts && npm ci --ignore-scripts && npm test   # all suites, seeds 1-3, 25 mutations
npm run probes                                                  # settle-bound grid (2,352 cases)
CHROME=/path/to/chrome PLAYWRIGHT=/path/to/playwright/index.mjs npm run browser-check
npm run demo                                                    # builds demo/curves.html
cd /path/to/partybox && pnpm verify
```

## Polish pass 2026-10-08 (Claude, cloud)

- Added the side-by-side demo (`demo/curves.template.html`, built by `npm run demo`), checked at 1,100 px, 390 px and reduced motion, with no console errors and no network requests. It found one real bug in its own resize path (a finished WAAPI animation rewinds on `play()`); fixed and re-checked.
- Added the settle-bound grid probe and the Chromium easing differential (`npm run probes`, `npm run browser-check`); results and limits are in VERIFY.md.
- Kept `motion.ts` unchanged and the sealed evidence unchanged. The full seeded suite reran on the unchanged runtime; the run table is in VERIFY.md.
- Rejected the readable rewrite of `motion.ts` (gzip gate, measured 2,192 bytes) and documented the minified form instead.
