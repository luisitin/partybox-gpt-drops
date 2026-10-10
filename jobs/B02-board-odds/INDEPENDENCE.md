# Independent authoring and integration

The production implementation and original supplemental oracle predate this
independent-reference task. The `blind_b02` agent was given only the original
B02 prompt, root README, and a standalone API/semantic contract. Before writing
and sealing its reference, it was explicitly excluded from production source,
historical reference source, tests, job algorithm documentation, and PR content.

It authored and locally checked the implementation in `/workspace/blind-b02`.
The authoring record and original source archive are preserved byte-for-byte
in `blind-authoring/`. Its original SHA256SUMS.txt seals four artifacts:
reference.ts, AUTHORING.md, selfcheck.mjs, and tsconfig.json.

The reference SHA-256 is:

```text
fb3358b51f3c8d6f00ca649da54d283129613cd0229ac33e626519f7daf22e5f
```

After the agent reported this completed seal, the coordinator explicitly ended
the blind phase and assigned integration. Only then did the agent view the
existing production module, tests, historical oracle, and algorithm documents.
The integrated `blind-reference.ts` is an unchanged copy of the sealed source.
Source inspection after sealing does not modify the completed authorship record.

`test.mjs` imports the blind reference for every named, random, cyclic, mixture,
and simulation differential comparison. `mutate.mjs` imports it for all 25
isolated mutations per seed. `run.mjs` verifies every original authoring seal
entry and requires the integrated reference hash to equal the sealed reference.
`reference.ts` remains compiled historical supplemental code; it does not supply
the required comparisons or mutation witnesses.

The independent author chose component-level exact linear equations and face
dynamic programming. The preexisting production code uses a whole-graph closure
matrix inverse and kernel composition, with binary powering for large faces.
Some standard graph and fraction techniques coincide; no source was shared
before the completed independent reference was sealed.
