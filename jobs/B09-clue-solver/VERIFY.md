# Verification

| Check | Cases | Result | Seed | Exact command |
|---|---:|---|---|---|
| Strict TypeScript compilation | 1 build | Passed | deterministic | `npm run build` |
| Original reduced-deck independent comparisons, first run | 20,000 logs | Passed | 1 | `B09_SEED=1 B09_REPORT=results-seed1.json node test.mjs` |
| Original classic-deck game comparisons, first run | 5,000 games, every update | Passed comparisons; timing gate failed at 215.745 ms | 1 | same command |
| Individually planted compiling mutations, before performance optimization | 25 per seed | 75/75 caught | 1,2,3 | `node mutations.mjs` |

The first timing failure triggered a production state-allocation improvement. These historical results do not establish acceptance of the current implementation.

## UNVERIFIED

Final full three-seed suite, final mutation rerun, and hosted CI are pending. No relaxed gate is used.
