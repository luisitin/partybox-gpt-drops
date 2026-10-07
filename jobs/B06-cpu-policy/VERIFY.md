# Verification

Local full code runs passed for seeds 1, 2 and 3. A final run including research schema and artifact checks is pending. GitHub checks are pending publication; no green hosted run is claimed.

## Code ledger

Exact command: `npm test` from `jobs/B06-cpu-policy/`.

| Suite | Cases per seed | Seeds | Result |
|---|---:|---|---|
| Strict production and independent TypeScript | 2 implementations | 1,2,3 | Passed |
| Hand-written explained decisions | 20 each of 4 functions (80) | 1,2,3 | Passed |
| Random legal states and independent output/draw/purity comparison | 100,000 each of 4 functions (400,000) | 1,2,3 | Passed |
| Included toy games, complete independent decision/state replay | 10,000 games; 960,000 policy decisions | 1,2,3 | Passed |
| Separately strict-compiled actual source mutants | 25 each seed (75) | 1,2,3 | All killed |

Every scenario includes frozen input, draw, expected result, draw count and arithmetic explanation in `reports/seed-*.json`. Every mutant has the actual compiled source hash and failed assertion. Each random test compares the complete function result and RNG calls and checks legal affordable IDs, no throw, and unchanged frozen inputs.

## UNVERIFIED

- Exact Nintendo per-difficulty decision probabilities and measured minigame skill remain unknown. Research is not complete; keep the PR draft.
- Public reports are anecdotal and sometimes contradict each other. The code's exploration, utility and purchase parameters are original design assumptions.
- Research source checks, JSON schema validator output, final artifact seal and hosted CI are being finalized. No pending check is labeled passed.
