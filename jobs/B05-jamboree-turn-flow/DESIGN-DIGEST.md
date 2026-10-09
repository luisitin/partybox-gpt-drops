# B05 design digest for PartyBox

What this is: a ranked read of the party-board flow and bonus-star logic in this drop, for the owner's PartyBox board game. Evidence IDs point to `claims.json`. Confidence comes from the claim row, not from this digest. Every idea below is an original PartyBox take; no name or line is carried over.

## 1. Turn structure (ranked by how much to copy)

1. **A round is closed by a minigame that every player feels.** One round means four moves, then one minigame (ROUND01, corroborated at medium confidence). Copy it. It gives each round a payoff. The host is the ADR-087 minigame mode, which lives in the owner's local main and the satellite contract, not in this checkout.
2. **Decide on the phone, move on the TV.** Item use, roll and branch are phone choices. The walk is a TV spectacle. The drop's ordering is open, so the split is a design choice, not a sourced fact.
3. **Stars are bought while passing.** A Star purchase can be offered without landing on it (TURN03, medium). Good: the decision comes mid-motion, so there is tension without a stop. Watch the wallet check on every pass.
4. **A visible last lap.** Homestretch fires with five turns left (HOME01, single). Blue and Red swing to plus or minus six (HOME02, single). Pro keeps those values (PRO03, medium). This is the strongest pacing device in the drop. Copy the idea, not the wording.
5. **Final turn, final minigame, ceremony.** Three beats, in order (END01, END02). Keep all three.
6. **Awards are added before the winner is named** (END03, high). This makes late-game play count for every player, not just the leader. Copy it.

Avoid or defer: the eight-effect Homestretch pool (HOME04 is a conflict), and any exact item order (U02 to U06 are unknown).

## 2. Bonus-star logic (the part worth copying)

- **Award count grows with length.** Random awards give 2 categories at 10 to 25 turns and 3 at 30 (COUNT01, high). Long games reward more kinds of play. This is a clean rule to copy with original counter names.
- **Opposed pairs create lanes.** The drop lists a max-travel and a min-travel counter (BONUS08 and BONUS09, both corroborated). Players can pick a lane and counter-pick each other. The risk is that min-travel can be gamed by zero-movement items. The zero-distance rule is unverified, so decide it in an ADR.
- **Count the thing, not the wallet.** Rich counts coins collected, not peak wallet, and Shopping counts items bought, not coins spent (BONUS06 and BONUS07, single-source). These definitions stop hoarding and reward buying cheap things. Good rules, and easy to test.
- **One Star per recipient** is the only reward shape the drop supports (single-source, medium). Simple, so keep it simple.
- **Pro's secret goal.** Pro announces one category before play (COUNT04, high). The idea transfers well: give each player a private category, revealed at the ceremony. That needs the views invariant to hide it until reveal.
- **Ties.** Unknown (0 of 9 procedures). Keep ties shared and say so in the rules text. Do not present a tie rule as sourced.

## 3. Mode ideas worth an original PartyBox take (ranked)

Ranked by fit with existing PartyBox pieces, clarity of evidence and risk.

1. **Round Pick (vote-for-the-round minigame).** Three choices, all players vote, the winner's choice plays (ROUND02, single-source, medium). Fits `VoteList` and the ADR-087 minigame mode directly. Lowest risk, highest payoff.
2. **Length-scaled awards.** The COUNT01 rule, with new names and new counters. Fits `pickAwards` with no new SDK work.
3. **Secret category.** Each player gets one hidden category, revealed at the ceremony. Adds information asymmetry that a board game usually lacks. Needs careful views work.
4. **Last-five card choice.** A five-card menu on the last lap, each card an original effect. Use the reported effects only as inspiration (HOME03, HOME04). Do not copy the eight-effect pool.
5. **Shared-pool teams.** Two players share coins and Stars (TV03, single-source for the shared-roll rule, corroborated for the shared pool itself). Fits `teamResults` and `TeamBanner`. Stronger as a follow-up to the core board.
6. **Shop as an ante.** Buying items counts toward an award, so cheap purchases become a strategy (BONUS07). Original, cheap to test, and it stays inside the award system.

## 4. Questions for the owner

- The working name is Party World in the satellite contract. Confirm it, or name an original title. "Jamboree" must not be the title.
- Pick the tie and no-recipient rule (an ADR is needed).
- Confirm the player range. This drop supports four; two and three are unverified.
- Confirm whether Pro and Frenzy ship as settings variants (recommended) or as separate modes.

## 2026-10-09 round-end recovery status

Current research is partial:38/95 facts,3/9 Bonus criteria,0/9 tie procedures. Earlier CI links above are historical. ROUND01 alone gains independent corroboration; no turn priority, payout or exact-string expansion. Current delivery proof and remaining evidence needs are in VERIFY.md, NEXT.md and PR9.
