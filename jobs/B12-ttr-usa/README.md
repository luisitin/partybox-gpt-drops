# B12 — Ticket to Ride USA data + exact longest trail

Classic USA catalog: **36 cities, 100 physical tracks in 78 adjacency groups,
309 train spaces, 30 base destination tickets**. The separate USA 1910 catalog
contains **69 tickets**: 30 reprints (four revised values), 35 new tickets and
four Mystery Train tickets. Every one of 264 fact rows carries confidence and
two citations from distinct authors. See [SOURCES.md](SOURCES.md),
[CONFLICTS.md](CONFLICTS.md) and [VERIFY.md](VERIFY.md).

## Contents

- `usa.json`, `usa.schema.json`, `citations.json`: catalog, Draft 2020-12 schema
  and short evidence excerpts; source inventories in `sources/`.
- `ttr.ts`: pure claim legality/application, ticket connectivity, exact weighted
  undirected longest trail, scoring and seeded RNG. `reference.ts`: separately
  authored reference. Both initial source snapshots and original blind seals
  are retained; see `ORACLE.md` and `ORACLE_AMENDMENTS.md`.
- `validate.ts`: pure validator for this schema's supported keywords;
  `validate_schema.py`: independent standards validator.
- `tests/`: 20,000 small graphs, 2,000 completed full games, data/schema audits,
  immutable goldens and 25 isolated mutations **for each seed 1, 2, 3**.
- `reports/`: actual completed source reopening and sealed reference records;
  completed full-suite evidence retained after execution.

## Rerun

Use Node **22.16.0**, Python 3.12+, and the pinned development tools:

```sh
npm ci --ignore-scripts --no-audit --no-fund
python -m pip install 'jsonschema==4.26.0'
sha256sum -c SHA256SUMS.txt
npm test
```

Production TypeScript has zero runtime dependencies. TypeScript 5.9.3 is only
a development compiler; Python jsonschema is only a verification tool.
Generated builds, mutation workspaces and raw test outputs are ignored.
`npm test` strictly compiles every core, runs every suite under all three seeds
and fails on any mismatch, survivor or malformed evidence. The GitHub workflow
runs the same command and retains `test-output/` as a run artifact.

`longestTrail` uses edge masks with arbitrary-width BigInt, components, Euler
conditions and exact search. There is no edge-count cutoff, timeout answer or
sampled approximation. Worst-case cyclic search is exponential. Positive
weights are train lengths; repeated cities, loops and distinct parallel edges
are supported. It does not mean a simple path or longest shortest path.
