# B19 continuation point

The sealed independent reference is integrated and compares every full input at
all three seeds. Behavioral, corpus-policy and mutation gates pass locally.
The first ASCII-path optimization still has local per-call latency outliers;
the 0.05 ms maximum remains unchanged and failures remain visible.

Next: inspect hosted results for the current PR #2 head, improve measured
runtime allocation or execution costs if the maximum still fails, then publish
actual final results and update the final-head CI link. Rerun with
`npm ci --ignore-scripts --no-audit --no-fund && npm test` from this job folder.
