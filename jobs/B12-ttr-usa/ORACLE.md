# B12 independent authoring record

This reference was authored in `/workspace/blind-b12` from the original B12
section of `PROMPTS.md`, the repository root README, and the primary author's
public types and mathematical conventions. No B12 primary implementation,
algorithm source, tests, datasets or computed answers have been opened. The
primary author's sealed hash was announced, but the file was not accessed.
No independent reference source, tests, algorithm or results were sent before
this seal. This record and the source/self-check report are sealed together.

Public shared inputs: nine card categories; undirected distinct route IDs,
route lengths1..6 and colors; gray claims with one colored type plus locomotives,
all-loco claims valid; 2–3-player global parallel restrictions and4–5-player
same-owner restrictions detected by unordered endpoints, not metadata; immutable
claim application; ticket graph connectivity; weighted edge trails with cities
reusable but each route edge used once; points1/2/4/7/10/15, completed ticket
points positive/incomplete negative;10 longest bonus for each tied positive
maximum and none for all-zero networks; players and held tickets retain order.
Synthetic self-loops are valid graph edges. Zero-edge same-city tickets complete.
Unknown/duplicate owned IDs and malformed graph/ticket/scoring inputs throw
RangeError; invalid claims return false and illegal application throws RangeError.
Seeded RNG is the specified unsigned32 LCG1664525/1013904223.

The independently chosen oracle indexes validated routes and checks claims from
the public state. It uses BFS ticket connectivity. Longest trails are decomposed
by connected component, with Euler/all-edge and weighted-tree reductions, then
memoized current-vertex/used-edge-subset search for general components. It does
not import production, external runtime modules, clocks or nondeterministic RNG.
Score construction is independent and uses the public scoring table.

## Own pre-exchange checks

Strict TypeScript5.8.3 compilation uses ES2022/NodeNext, strict,
noUncheckedIndexedAccess, exactOptionalPropertyTypes, noUnusedLocals,
noUnusedParameters, noEmitOnError, noImplicitOverride and
noFallthroughCasesInSwitch. Exact command:

```sh
node /workspace/job-B08/jobs/B08-monopoly-markov/node_modules/typescript/bin/tsc -p /workspace/blind-b12/tsconfig.json
node /workspace/blind-b12/selfcheck.mjs
```

The final raw `SELFCHECK.json` records observed assertions and seed counts.
Checks include every card/parallel restriction, all four player counts, malformed
containers, insufficient cards/trains, arbitrary prototype-looking IDs, input
immutability, ticket connectivity, loops, parallel edges, branching trees,
revisited-city trails, route points for every length, signed tickets, all tied
positive/zero bonuses,80-edge tree and44-edge cyclic exact trail cases, and
exact LCG replay/range. The full3000 synthetic scoring
games use independent union-find connectivity and edge-subset trail enumeration.
The6000 random small graphs use seeds1/2/3, at most12 edges, and exhaustive
enumeration of all edge subsets with independent degree/connectivity checks.

An initial raw walk enumeration self-check was stopped because repeated loops
generated many equivalent edge orderings. It was replaced before this seal by
exhaustive edge-subset enumeration at the same6000 graph/12-edge bounds; no
required integration test count or seed was reduced. Initial compiler guard
typing corrections also occurred before the seal. Only the final successful
checks are claimed.

## Boundary

Full official-USA research/data validation, the primary20000-small-graph and
2000-full-game suites per seed,25 strict runtime mutants per seed and GitHub
CI are the primary owner's integration work after this sealed source exchange.
No completion of those downstream checks is claimed here.

Primary was authored/strictly compiled before reference viewing, then sealed at
2b96b13a81db31debc66741cfa9c59d9aac861b353307fd76c70c9329b70daae.
Its exact initial source is ttr.snapshot.ts.txt. The helper's exact reference
317cce5eaa7e896a936e74d57a1d959b3d411b97afd5fd199f0490043961cf52
is copied unchanged as reference.ts and reference.snapshot.ts.txt after both seals.
Any later changes must be documented with old/new hashes and concrete failures.
