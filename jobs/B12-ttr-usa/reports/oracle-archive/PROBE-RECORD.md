# Read-only post-exchange differential probe

Both independently authored initial cores were sealed before exchange. Original
oracle source remains317cce5eaa7e896a936e74d57a1d959b3d411b97afd5fd199f0490043961cf52.
The separately sealed sparse-ID amendment is documented in `AMENDMENT.md`.
Only after those boundaries, the independent owner copied the primary source
to `primary-probe.ts` inside this isolated workspace. No primary job files were
written; all probes/results are here. Primary snapshot SHA256 is recorded in
`DIFFERENTIAL-PROBE.json`.

The final probe strictly compiles both source copies, then compares every one
of20,000 independently generated small undirected graphs per seed1/2/3.
Graphs contain0..12 distinct route edges, positive lengths1..6, loops and
parallel routes, with independently chosen tickets and absent endpoints. Every
case compares exact longest-trail length and ticket completion. Additional
claim/application/scoring goldens cover all four player counts, parallel rules,
malformed containers, sparse IDs/card arrays, ticket signs/order, arbitrary IDs
and6000 exact public-LCG draws. There are no graph-count reductions, skip
conditions, timeout fallbacks or sampling approximations.

Exact commands:

```sh
node /workspace/job-B08/jobs/B08-monopoly-markov/node_modules/typescript/bin/tsc -p /workspace/blind-b12/probe-tsconfig.json
node /workspace/blind-b12/sparse-replay.mjs
node /workspace/blind-b12/amended-selfcheck.mjs
node /workspace/blind-b12/probe.mjs
```

Successful raw report, full probe log, source hashes and before/after source
integrity are preserved. This is additional independent integration coverage;
the primary owner remains responsible for official-data research, the full
2000-USA-games per seed, mutation checks, full npm pipeline and final CI.
