# B19 continuation point

PR #2 remains a draft. The full original behavioral, sealed-reference, corpus
policy and all 75 mutation checks pass. The most recent substantive production
change adds general printable-fullwidth-ASCII and Latin-1 character compilation
to the prior ASCII-letter path. New independent contexts pass all 4,266 checks;
no original workload or timing window changed.

Latest source-bound local result: results/optimization-width-latin1/summary.json
and benchmark-seed*.json. Literal 0.05 ms timing still fails: 5/11/9 calls above
the threshold, maxima 0.154320/0.582158/0.227552 ms. Previous failures and source
snapshots remain intact. The original corpus collisions and length conflicts
also remain explicit. A hosted green result does not cancel local failures.

For further work, use the preserved witnesses for substantive algorithmic or
allocation changes. Do not replace the maximum with a percentile, retime or
filter failures, add memoization, change timer windows/counts/seeds, or repeat
an unchanged source until it happens to pass. Run the full command after a
meaningful source change: npm ci --ignore-scripts --no-audit --no-fund && npm test.
Inspect the exact final-head hosted run and keep its actual conclusion in PR2.
