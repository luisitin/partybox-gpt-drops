# Exact resume step

The polish pass (2026-10-08) is the latest change on `job/B02-board-odds`. Its code and full local suite are recorded in `VERIFY.md` "Polish pass 2026-10-08".

1. Read the hosted check runs for the current branch head (`git ls-remote origin job/B02-board-odds`, then `gh api repos/luisitin/partybox-gpt-drops/commits/<head>/check-runs`). The head is green only when that read shows `verify` completed with success. Record the run URL in `VERIFY.md`.
2. Do not merge PR #4 from this job. The owner ports `boardOdds.ts` through `INTEGRATION.md`.
3. Owner decisions before the port: whether "toward target" steers by edge hops or by expected steps; whether an unknown target ID must be an error in content loading (the module falls back to uniform by design).
4. Keep the independent Python check (`tools/`) and the B01 fixture in sync with any B01 table change: re-copy `fixtures/b01-odds.json` deliberately and update the pinned SHA-256 in `connect-b01.mjs`.
