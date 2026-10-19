# B02 independent reference authoring record

Author: the independent `blind_b02` agent, delegated by the coordinator on
2026-10-07. Work directory: `/workspace/blind-b02`.

## Permitted inputs and source isolation

- The original B02 prompt in `/workspace/partybox-gpt-drops/PROMPTS.md`.
  The search excerpt used to locate B02 also displayed adjacent job prompt
  text; none of that text contained or supplied a B02 implementation.
- The root `/workspace/partybox-gpt-drops/README.md` delivery and verification
  rules.
- The coordinator's standalone API and semantic contract, including movement
  costs on entry, zero-face stopping, dead ends, duplicate successor removal,
  exact treatment of pass-through loops, recurrent expected visits, shortest
  directed edge-hop policy distances, and strict compiler flags.
- The mandatory `cloud-environment-runtime` skill and environment status;
  these supplied workspace instructions and no board algorithm or source.

No production implementation, historical reference implementation, B02 test
source, job README algorithms, PR content, or implementation written by another
author was opened. No source was exchanged before sealing. No subagents were
created. The coordinator supplied a compiler executable path; that executable
compiled only this directory's independently authored source, and its containing
job directory was not browsed or read for source.

`reference.ts` has its own structural types, rational arithmetic, graph
preparation, graph component traversal, linear solver, and face recurrence. It
has no imports or runtime dependencies. It uses neither `Math.random` nor
`Date.now`. The test driver imports only the compiled version of this reference.

## Independently chosen method

After successor deduplication and policy selection, iterative Kosaraju identifies
the components in the pass-through subgraph. A component is recurrent exactly
when every node has an outgoing edge and every selected successor remains in
that component. Dead ends are terminal outcomes.

Each transient component solves exact linear equations for probabilities of the
next ordinary entry or terminal pass-through dead end, probabilities of reaching
each recurrent class, and finite transient pass-through entry counts. Uniform
branch equations are multiplied by the branch degree before rational Gaussian
elimination. Components are evaluated after their successor components.

Each physical starting position then chooses its first edge, excluding an entry
reward for the initial position. For positive faces, a recurrence combines the
segment probabilities with the previous face's ordinary-position results. Face
zero is the identity landing distribution and zero passes. Positive reachability
of a recurrent class marks the expected visits to every node in that class as
`infinity`, while the finite counts for transient nodes remain exact.

## Completed local self-checks

Compilation command:

```sh
node /workspace/job-B02/jobs/B02-board-odds/node_modules/typescript/bin/tsc -p /workspace/blind-b02/tsconfig.json
```

Passed without diagnostics. Configuration: ES2022, NodeNext, strict,
`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noUnusedLocals`,
`noUnusedParameters`, and `noEmitOnError`.

Self-check command:

```sh
node /workspace/blind-b02/selfcheck.mjs
```

Result:

```json
{"fixtures":24,"dagGraphs":600,"dagComparisons":36460,"cyclicGraphs":600,"cyclicRows":34280,"seeds":[1,2,3],"checks":957324,"passed":true}
```

The 24 manual fixtures include zero-face pass-through starts, empty boards,
ordinary and pass-through dead ends, ordinary self-loops, a closed pass-through
self-loop, exit loops, multiple-node exit loops, multiple recurrent classes,
finite transient rewards on paths into recurrence, delayed recurrence after
ordinary steps, stopping on the last ordinary entry, duplicate successors,
directed edge-hop distance with pass-through nodes, policy ties, unknown and
unreachable targets, continuing after reaching a target, arbitrary string IDs,
frozen inputs, and output-fraction isolation.

For each seed, 200 random DAGs and 200 random cyclic graphs of up to 10 nodes
were checked under both policies, for every start and faces 0 through 4. The DAG
comparison uses a separately written direct recursive path enumerator and a
separate rational helper. The cyclic checks require total landing plus
nontermination probability to equal one exactly, all physical landings and
pass-through rewards to be present, every finite rational to be reduced and
nonnegative with positive denominator, and nontermination and entry rewards to
be monotone as the face increases.

## Seal and integration boundary

`SHA256SUMS.txt` seals `reference.ts`, this record, `selfcheck.mjs`, and
`tsconfig.json`. The seal was created after the successful local self-checks and
before the coordinator was sent completion or source for integration. The
compiled `dist/` files are reproducible scratch output and are not authored
delivery files. This record describes pre-integration work; the coordinator owns
the required full-job test results and repository delivery.

## UNVERIFIED

The full required B02 integration suites, deliberate mutation checks, mixture
comparisons, large random graph counts, simulation checks, CI, and GitHub
delivery have not been run by this isolated author. They are intentionally left
to the coordinator's integration workflow after this seal.
