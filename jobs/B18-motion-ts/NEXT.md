# B18 continuation point

Delivered on `job/B18-motion-ts` in PR #5, with the polish pass of 2026-10-08:
the side-by-side demo, the settle-bound grid, the Chromium easing differential,
`INTEGRATION.md` and the PartyBox port steps. The PR description records the
final head and the observed hosted run.

Next steps, in order:
1. A person looks at `demo/curves.html` (run `npm run demo`) on a laptop and a
   phone, and judges the feel. Nothing in this job judges feel.
2. The owner decides whether `motion.ts` goes into PartyBox byte-for-byte
   (INTEGRATION.md, step 1), then follows steps 2 to 8.
3. Measure the feel target in PartyBox: the first time a chosen spring stays
   within 0.5 px of rest (INTEGRATION.md, feel target).

Full rerun: `npm ci --ignore-scripts && npm test` from `jobs/B18-motion-ts`
(about 9 minutes, seeds 1 to 3). Any change to a delivered file requires
regenerating `SHA256SUMS.txt` (every file except itself) and rerunning this.
Future numerical changes must keep the original seeds, the 10,000 every-frame
springs, the 1,000,000 Bezier points, the 40,004 named points per seed, and all
25 mutation kills, with sealed reference provenance.
