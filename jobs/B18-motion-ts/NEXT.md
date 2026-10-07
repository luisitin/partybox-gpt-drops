# B18 continuation point

The runtime, sealed independent references and complete three-seed measured
reports are delivered on `job/B18-motion-ts` in PR #5:
https://github.com/luisitin/partybox-gpt-drops/pull/5.

The PR description identifies the final commit and its observed hosted CI run.
For a resumed delivery check, compare that recorded head with the current PR
head and inspect its `B18 motion verification` result. The full rerun command is
`npm ci --ignore-scripts && npm test` from `jobs/B18-motion-ts`.

Future numerical changes must preserve the original three seeds, all 10,000
springs at every dt=1e-4 frame, all 1,000,000 Bezier points and 40,004 named
points per seed, all 25 strict-compiling mutation kills per seed, and sealed
reference provenance. Current domain limitations remain in `VERIFY.md`.
