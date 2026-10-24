# Sources and contracts

1. Hasbro / Milton Bradley, Battleship instructions (1990), pages 1–3:
   https://www.hasbro.com/common/instruct/Battleship.PDF
   Page 2, hit announcement: “Your opponent tells you which ship you have hit”.
   Page 3, sinking announcement: “The owner of the ship must announce which ship was sunk.”
   These support named public hit feedback and named sinks. Only these short excerpts
   are reproduced from this source. The PDF was visually inspected.
   Single-shot classic play, not Salvo, is the benchmark contract.

2. Repository README, read before implementation:
   https://github.com/luisitin/partybox-gpt-drops/blob/main/README.md
   Blob SHA f5ccc31339ab25b2d540a878be19cc78ca1b0cd3.
   Defines job branch/path, payload limits, honest UNVERIFIED reporting and the
   one-workflow root exception with full-suite CI.

3. GitHub Actions workflow syntax (permissions and pull-request path filters):
   https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax
   Used to construct the repository-requested read-only workflow.

4. Microsoft TypeScript package release metadata, version 5.8.3:
   https://registry.npmjs.org/typescript/5.8.3
   Used for the pinned compiler version, tarball and SHA-512 integrity in package-lock.
   The local compiler was version 5.8.3. Local npm registry installation timed out;
   the package lock uses the publisher's metadata and the existing compiler ran the
   local build. GitHub Actions independently attempts npm ci.

All algorithm derivations, source code, test cases and reported measurements in
this drop are original to this job. No external Battleship performance table is
being substituted for measurements of this implementation.
