# Next work

The original full three-seed policy code, independent implementation and toy
model are unchanged. The substantive evidence recovery adds two-source label
corroboration and two independent low-confidence CPU Buddy-at-Boo reports,
reducing explicit unverified rows from 26 to 24. All original row versions and
two source audits remain preserved; the new excerpts are recovered twice.

The full unchanged npm test after this evidence update passed all three seeds,
including 1.2M states, 30K toy games and 75 actual mutant kills. Actual reports
are in reports/evidence-recovery-full/. Final packaging hashes are checked
separately after archiving receipts. Inspect the exact-head hosted result in
PR17 and then pursue the remaining factual gaps. PR17 stays
a draft: all 24 four-difficulty branch/item/shop/star/buddy/minigame rules or
probabilities still need controlled original-version gameplay logs or primary
technical evidence. Public anecdotes do not establish exact frequencies.
Do not infer Nintendo probabilities from the original policy or toy win rate.

## Polish pass 2026-10-08: next step

1. Port, do not edit: copy `cpuPolicy.ts` and `types.ts` into PartyBox's `games/party-world/server/` (INTEGRATION.md step 1). The three sealed files stay as they are in this folder.
2. Decide the difficulty mapping (easy, normal, hard as sharp; master dropped) and the bad-rng fallback (INTEGRATION.md steps 2 and 4). These are the two decisions the port cannot skip.
3. The research gap is unchanged: the 24 per-difficulty rows still need controlled gameplay logs or primary technical evidence (see the PR17 note above). Do not infer them from the toy board or from the policy.
