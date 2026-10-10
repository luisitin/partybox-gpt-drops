# B06 independent policy authoring

`reference.ts` was authored in `/workspace/blind-b06` from the original B06
instructions, repository root README and the public model contract and public
types. No B06 production algorithm, existing reference, test implementation or
PR description was inspected before authoring and sealing.

Allowed files read: `/workspace/partybox-gpt-drops/PROMPTS.md` (B06 section),
the previously read repository root README,
`/workspace/job-B06/jobs/B06-cpu-policy/CONTRACT.md`, and that folder's `types.ts`.
The parent author clarified in plain text that when no actual eligible action
exists, item/shop selection returns null without consuming RNG; null is appended
only when at least one action is eligible. Production was not supplied.

The reference defines its own copy of the public structural types. It imports
no production code or helpers. Every selector builds eligible utility records,
then uses the contract's single-draw mixture of uniform exploration and uniform
maximum-utility ties. State arrays are never sorted or mutated. Invalid/throwing
RNG yields decline, and disabled/no-eligible decisions consume no draw.

`selfcheck.mjs` contains 20 independent scenarios for each of the four functions,
covering probability thresholds, affordable/legal choices, tie order, declined
choices, buddy/star utilities, disabled states, invalid RNG, draw counts and
input immutability. Strict compilation includes noUncheckedIndexedAccess,
exactOptionalPropertyTypes and noUnused checks. Actual author self-check counts
are retained in `SELFCHECK.json`. Parent integration runs the complete original
three-seed differential suites after receiving source seals.

Compile using TypeScript 5.8.3, then run `node selfcheck.mjs` from this directory.
Only the reference source and its authoring evidence are intended for parent
integration; local build output is a convenience artifact.
