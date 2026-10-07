# Verification

The original full three-seed command passed before the improvement-loop dense fixture; evidence is in preloop-results.json and mutation-results.json.

| Suite | Seed 1 | Seed 2 | Seed 3 | Exact command |
|---|---:|---:|---:|---|
| Reduced literal enumeration vs production | 20,000 passed | 20,000 passed | 20,000 passed | `npm test` |
| Full classic games (every prefix independently compared) | 5,000 passed / 45,266 updates | 5,000 passed / 44,878 updates | 5,000 passed / 45,247 updates | `npm test` |
| Sparse unknown-refuter six-player updates | 420 passed | 420 passed | 420 passed | `npm test` |
| Six-player observed maximum | 114.053 ms passed | 119.284 ms passed | 54.364 ms passed | `npm test` |
| Compiling production mutations | 25/25 caught | 25/25 caught | 25/25 caught | `npm test` |

Strict TypeScript compilation passed. The suite checks exact card/category/hand conservation, positive probability for the true envelope at every simulated update, invalid/contradictory error values, frozen-input purity, and repeatability. Three to six players are evenly covered, 1,250 games per player count per seed.

Hosted run for implementation commit 60ed9c0: https://github.com/luisitin/partybox-gpt-drops/actions/runs/37634714317 (success).

The first timing run failed at 215.745 ms; LOOP.md records the correction and successful rerun. No outlier was waived.

## UNVERIFIED

The improvement-loop full rerun adding the 690-suggestion mask fixture and final-head hosted CI are pending. Timing remains an empirical limit for these recorded cases and hardware, not a guarantee across arbitrary machines or all possible logs.
