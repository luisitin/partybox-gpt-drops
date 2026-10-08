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
