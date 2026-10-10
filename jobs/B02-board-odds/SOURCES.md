# Sources and provenance

This is an implementation of the user's abstract movement contract, not a claim about any particular commercial game's rules.

- Repository rules were read before branch creation: https://github.com/luisitin/partybox-gpt-drops/blob/main/README.md — README blob `f5ccc31339ab25b2d540a878be19cc78ca1b0cd3`. The workflow is the README's explicit exception to placing all files in the job folder.
- TypeScript strict mode: https://www.typescriptlang.org/tsconfig/strict.html . All three TypeScript modules compile with `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, unused-code checks, and `noEmitOnError`.
- Pinned compiler metadata: https://registry.npmjs.org/typescript/5.8.3 . The lockfile's SHA-512 integrity is copied from the official registry's `dist.integrity`, not guessed.
- GitHub workflow syntax: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax . Workflow has a pull-request path filter, read-only contents permission, and a 30-minute timeout.
- Official actions: https://github.com/actions/checkout and https://github.com/actions/setup-node . Only major-version-pinned actions under `actions/*` are used, as required by the repository README.

The historical oracle was authored first by the same assistant as production, with SHA-256 `9ffd76f76f1ed71aabad84d4b12b175ff53f333325a14b360fe7ce3583cb5bb6`; it remains a supplement. The required reference was separately authored blind and sealed with SHA-256 `fb3358b51f3c8d6f00ca649da54d283129613cd0229ac33e626519f7daf22e5f` before source exchange. Its permitted inputs, self-check results, exact source, and original seal are preserved in `blind-authoring/`; `INDEPENDENCE.md` explains integration. The runner verifies that all sealed artifacts and the integrated reference match their original hashes.
