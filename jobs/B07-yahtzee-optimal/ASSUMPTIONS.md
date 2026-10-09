# Model assumptions

Use the original thirteen-category US scorecard, five fair independent d6 and
three rolls per turn. Official forced joker rules are the default; the explicit
`published` mode implements Verhoeff's historically published interpretation.
Both include upper35 at63 and extra-Yahtzee100 when the Yahtzee box has50.
Expected values are future scores excluding previously earned scores/bonuses.
Rules and validation details are frozen in `PUBLIC-CONTRACT.md` before either
author exchanges implementation source. No task count reductions or sampled
optimality substitutes are authorized.

2026-10-09: Original review exposes two verification defects, so an isolated
followup based on canonical903 repairs them while preserving original Ready
PR21, source/table/model bytes and all independent seals. Test-harness report
files are outputs and cannot replace SHA-sealed historical inputs; restoration
must run after both successful and failed children. The original prompt's full
solver delivery does not authorize calling an unrun private-product port
verified. Actual PartyBox DEV_GUIDE assigns full pnpm verify to its merge queue.
