# Current resume point: standalone verification recovery

Owned followup branch: `job/B08-monopoly-verification-audit-20261009`, based on canonical `job/B08-monopoly-markov` at protected original5f35. Original Ready PR14 is preserved, open and unmerged. A new supplemental Draft PR is pending first source publication.

Completed actual evidence:
- Original full run37815695050/job113443634624 accepted from the whole genuine artifact11566339013 plus full native log at09:02:10 UTC: original720M rolls/135 strict-runtime kills,148 archive members, all72 native inputs,67 manifest entries and authored seals.
- Actual original clean standalone ENOENT reproduced09:02:56 after strict build; failure retained.
- Four narrow runner folder-creation fixes and the workflow own-path filter made. Driver/library/data/counts/seals unchanged.
- All twelve actual clean standalone invocations across required seeds1/2/3 naturally closed PASS09:12:45, at the original complete component workloads. Whole compiled outputs and raw logs retained under `reports/recovery-20261009/`.

Still required:
1. Publish this meaningful checkpoint and refresh only this job's MAIN claim under the serialized coordination lease.
2. Open a supplemental Draft PR into the preserved canonical branch.
3. Accept the complete genuine hosted full archive/native log at the exact new source head. The original and local control passes do not satisfy this.
4. Perform substantive KEEP audits of unchanged mandatory gates, invalid-seed behavior and repeated output-folder use; retain each raw result and any failure.
5. Publish the final handoff, accept final-head full hosted proof, and mark only the supplemental PR Ready. Continue the authorized queue when only cosmetic gains remain.

Assumptions and scientific gaps remain explicit in ASSUMPTIONS.md/CONFLICTS.md. Private PartyBox port and owner decisions are outside this narrow repair.

---

## Preserved prior resume record

# Resume point

B08 is complete and verified: the sealed solver, its independent re-derivations and evidence, and, since the 2026-10-08 polish pass, the PartyBox-facing `boardOdds.ts` with its own suite in `npm test`. PR #14: https://github.com/luisitin/partybox-gpt-drops/pull/14.

Next is the port into PartyBox, by the owner's agent, following `INTEGRATION.md`:
1. Copy `boardOdds.ts` to `games/monopoly/server/board-odds.ts`.
2. Wire `sharp` bots (skill plumbing, build order, trade and auction value).
3. Add the TV "hottest squares" beat.
4. Tune `incomeTurns` with `pnpm sim --skills normal,sharp`.

Open decisions for the owner:
- an ADR for `InitContext.botSkill`, needed for an odds-based jail plan;
- how to treat the Speed Die.

Within this job, nothing is pending. A solver change would need the regeneration steps in `README.md` ("Changing things") and new seals.
