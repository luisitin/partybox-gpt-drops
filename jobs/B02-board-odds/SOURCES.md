# Sources and provenance

This is an implementation of the user's abstract movement contract, not a claim about any particular commercial game's rules.

- Repository rules were read before branch creation: https://github.com/luisitin/partybox-gpt-drops/blob/main/README.md — README blob `f5ccc31339ab25b2d540a878be19cc78ca1b0cd3`. The workflow is the README's explicit exception to placing all files in the job folder.
- TypeScript strict mode: https://www.typescriptlang.org/tsconfig/strict.html . Both implementations compile with `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, unused-code checks, and `noEmitOnError`.
- Pinned compiler metadata: https://registry.npmjs.org/typescript/5.8.3 . The lockfile's SHA-512 integrity is copied from the official registry's `dist.integrity`, not guessed.
- GitHub workflow syntax: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax . Workflow has a pull-request path filter, read-only contents permission, and a 30-minute timeout.
- Official actions: https://github.com/actions/checkout and https://github.com/actions/setup-node . Only major-version-pinned actions under `actions/*` are used, as required by the repository README.

The oracle was authored first. Its pre-production-source SHA-256 was `9ffd76f76f1ed71aabad84d4b12b175ff53f333325a14b360fe7ce3583cb5bb6`. This chronology does not establish blind independent authorship; both files were written by the same assistant. The current SHA256SUMS.txt, actual differential results, and explicit UNVERIFIED section are the relevant evidence.
