# Concrete post-exchange malformed-mode correction

The original primary TypeScript source remains byte-for-byte preserved at
`primary-snapshot/yahtzeeOpt.ts`, SHA256
`4e4933c5202f6e5f57ce5cb110b09f11cd6de7fda6432beb6f3825c274ec1222`.
Both copies of the original19-file seal are unchanged. To verify that historical
seal, use the snapshot for `yahtzeeOpt.ts` and the root files for other names.

Post-exchange review found a genuine public-contract defect: the nullish
coalescing default accepted `ruleMode:null` as official, although only an
omitted mode may default. `reports/pre-repair-null-mode.json` records the actual
input, initial primary returned value and independent RangeError. The current
primary defaults only `undefined`; `null` now reaches rule-mode validation and
throws RangeError. No algorithm, scoring convention, generator or solved table
changed. The independent helper files remain unchanged.

The combined verifier replays this exact input through score, expectedValue,
bestCategory and bestHold. Current source has its own integration hash manifest;
it must not be described as byte-identical to the initial sealed source.
