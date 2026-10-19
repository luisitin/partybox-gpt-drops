# B06 design digest for PartyBox

What this is: a ranked read of the CPU model in `cpuPolicy.ts` for a PartyBox board-game bot. Every number here is a design value of this drop, not a measured Nintendo value. The evidence behind the behaviours is low-confidence player reports (see `research.md`). Use the ideas; do not cite the numbers as facts.

## 1. Ideas worth copying (ranked)

1. **Two knobs per difficulty.** Each level is set by an exploration rate (how often the bot takes a random legal option instead of the best one) and a purchase rate (how often it buys a Star it can afford). Easy explores everything and buys half the time. Hard (sharp in PartyBox) explores 10 percent of the time and buys 98 percent of the time. Two numbers are easy to explain, easy to test and easy to tune. This is the strongest idea in the drop.
2. **Head for a Star you can afford.** A branch that brings a Star within reach is worth far more when the bot can afford the Star after the branch (100 divided by distance plus one) than when it cannot (10 divided by distance plus one). The bot looks purposeful, and the player feels a pull toward Stars without any scripted path.
3. **Use items to make progress.** An item's value counts the spaces it moves the bot toward a Star (capped at the distance), and adds 30 when the move reaches a Star the bot can then afford. Items feel used with a purpose.
4. **Save for the Star.** A shop purchase that would leave the bot below the Star price, while a Star is within 10 spaces, costs 30. This gives a human-looking saving habit. Keep it as a visible design choice. The reports on shop behaviour conflict (C04), so do not present it as observed behaviour.
5. **A decline is always legal.** Item and shop choices include a "do nothing" option worth zero. Exploration then sometimes skips a useful item, which reads as a player who did not check the shop. It is cheap and reads as human.
6. **No stacking of Buddies.** A second ally adds no value while the bot already has one. Simple, sensible, and it stops the bot hoarding.
7. **One draw per decision.** Every decision consumes a fixed number of random draws (none when there is no legal option, one otherwise). Same state, same seed, same input. That makes the bot replayable, which PartyBox needs for `pnpm sim --replay`.

## 2. Ideas to leave behind

- **The numbers.** The exploration rates, purchase rates, 100, 10 and 30 weights, and the 20-coin risk penalty are tuned design values. Re-tune them in PartyBox with the sim and a playtest.
- **The toy result.** Hard wins 99.3 to 99.7 percent of toy games. That shows the toy is lopsided, not that the policy is right. The toy's 65 percent test is a floor, not a target.
- **The "Hard avoids harmful branches" idea.** It is a low-confidence player report (F02, C01). Do not build it as a rule without a playtest.
- **Master.** PartyBox has three bot skills. Master has no slot, and its only claimed strength (some minigames, F05) is low-confidence.

## 3. Evidence map (what each idea rests on)

| Idea | Evidence | Confidence | How to treat it |
| --- | --- | --- | --- |
| Four difficulty levels exist | F01: the original offers configurable CPU difficulty | high | Fact. The mapping to three PartyBox levels is our decision. |
| CPUs avoid harmful branches at higher difficulty | F02, C01 (conflicting) | low | Design intent only. |
| CPUs keep items unused | F03, C02 (conflicting) | low | Supports the exploration knob. Not a rule. |
| Hard feels better | F04 (subjective) | low | Motivation for the knob, not a measured rate. |
| CPUs use Buddies at higher levels | F06 (the Buddy mechanic, medium); C06 (two player anecdotes, Hard and Master) | medium for the mechanic, low for CPU use | Mechanic only. The CPU's Buddy choices and rates are unverified. |
| Shop reserves for a Star | F07, C04 (conflicting) | low | Design choice, marked as such. |

## 4. What this means for the PartyBox bot

- The bot is a `sampleInput` for the board game (B05), and it can be honest and varied: two knobs, one draw per decision, and a visible decline.
- The most useful thing to test is not the win rate but whether a player can tell a sharp CPU from an easy one by watching it head for Stars. Measure that in playtests.
- The sim (`pnpm sim --skills easy,normal,sharp`) is the right balance tool. The toy is not.
