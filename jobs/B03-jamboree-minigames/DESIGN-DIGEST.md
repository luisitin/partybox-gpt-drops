# B03 design digest: what the Jamboree minigame pool teaches PartyBox

For the designer. Reference only: nothing here is shipped, no minigame name, character name, art or string may
appear in PartyBox, and every number below is a row count or a median from `minigames.json` (132 rows, 2026-10-08).
Where a sentence is editorial, it says so. Evidence strength: 189 of 1,320 narrow fact fields are corroborated
(see README "Status"), so treat a number as "what the rows say", not as settled fact.

## 1. What makes these minigames work (reading of the rows)

- **Short bursts.** 82 rows carry a reported timer; the median is 30 s (counts: 30 s x23, 60 s x23, 10 s x12, 15 s x7,
  45 s x6, 90 s x4, others). Whole-game caps are known for 43 rows (30 s x18, 60 s x11, 45 s x5). A 10-30 s round is
  the core; 60 s+ is the exception (coin and co-op rounds).
- **One readable win rule.** Most rows are "last standing", "first to X", or "most points after N rounds". Ties are
  rare and explicit: 31 rows record a tie rule and 101 record none, so a tie is usually a design choice, not a rule.
- **Competition is the spine.** 58 of 132 rows (44%) are competitive formats: free-for-all 29, team versus 1v3 12,
  2v2 12, duel 5. Co-op formats (Kaboom-Squad 10, Rhythm 10, Survivathon 5) cover 25 more; Jamboree TV rows mix both.
- **The reward is shown, not hidden.** 15 rows describe a reward decided by a visible mechanic (a wheel path, an
  item in a hole, a stone's landing). Editorial: this is why item rounds read as fair even when the odds are random.
- **Control variety is mostly buttons.** Buttons only 87 (66%), motion only 22 (17%), mouse-style pointer 12 (9%),
  mixed 5, camera 3, microphone 3. Only 20 rows reach phone fit 5 and 14 reach 4.

## 2. Categories, sizes and phone fit (n = 132; fit = 5/4/3/2/1 counts)

| Category | n | Share | Players / format (most common wording) | Phone fit 5/4/3/2/1 | Median timer label |
| --- | ---: | ---: | --- | --- | --- |
| free-for-all | 29 | 22% | Four players compete individually. | 3/0/19/7/0 | 30 s (n=18) |
| 1v3 | 12 | 9% | One player faces a team of three. | 1/0/9/2/0 | 30 s (n=10) |
| 2v2 | 12 | 9% | Two teams of two. | 1/0/8/3/0 | 15 s (n=6) |
| duel | 5 | 4% | Two-player duel. | 1/0/3/1/0 | 30 s (n=3) |
| Item | 5 | 4% | One player attempts an item challenge. | 4/0/0/1/0 | 15 s (n=5) |
| Boss | 5 | 4% | Boss battle, individual points, co-op completion by mode. | 0/0/5/0/0 | 45 s (n=1) |
| Koopathlon Coin | 9 | 7% | Individual coin-scoring challenge (race and free play). | 3/0/6/0/0 | 60 s (n=8) |
| Koopathlon Survivathon | 5 | 4% | Survival encounter; cohort depends on mode. | 0/0/5/0/0 | 30 s (n=4) |
| Showdown | 10 | 8% | Four-player showdown; encounter advantage differs by character. | 3/0/6/1/0 | 10 s (n=5) |
| Kaboom-Squad | 10 | 8% | Eight-player co-op challenge. | 4/0/6/0/0 | 60 s (n=6) |
| Rhythm | 10 | 8% | Co-op rhythm cooking challenge, up to four players. | 0/0/0/10/0 | none labelled |
| Jamboree TV Mouse | 14 | 11% | Battle: two teams of two; co-op: two or four players, with exceptions. | 0/14/0/0/0 | 60 s (n=12) |
| Bowser Live | 6 | 5% | Bowser-hosted live teams. | 0/0/0/0/6 | 15 s (n=4) |

Reading: the phone-first (fit 4-5) pool is 34 rows, and 14 of them are the TV pointer rounds (fit 4 by design). The
fit-1 rows are the six camera or microphone rounds; fit-2 is the 25 motion rounds (Rhythm is entirely motion).

## 3. Shapes, mapped onto PartyBox (editorial proposal)

| Shape in the pool | Rows (examples by category) | Closest PartyBox building block | Build |
| --- | --- | --- | --- |
| Quiz or judgement in one round | free-for-all quiz rounds | `games/lightning-round` (quiz), `games/who-said-it` | reuse the pattern |
| Last standing on a hazard (fall, crush, push out) | free-for-all survival rounds | `packages/game-sdk/src/timer.ts` deadlines, `ui/DeadlineBar`; no existing real-time game | new game |
| Collect or score on a shared field | Koopathlon Coin, free-for-all | `scoring.ts` (`rank`, `buildResults`, `speedPoints`), `turns.ts` | new game, reuse scoring |
| Dice or luck with a visible roll | Item, some free-for-all | `games/yahtzee` `Dice3d` (pips 1-6) | reuse dice |
| Team versus (1v3, 2v2, duel) | 29 rows | ADR-087 minigame modes `ffa / 2v2 / 1v3 / duel` (satellite contract); `ui/team-banner` | modes, not new UI |
| Physics aim or drag on a table | Jamboree TV Mouse, 14 rows (fit 4) | `packages/game-sdk/src/table3d/` (Rapier) and `ui-card-hand` drag | new game on table3d |
| Bidding or prediction | free-for-all party rounds | `games/blind-auction`, `games/tune-in` (dial) | reuse |
| Co-op rhythm or timing | Rhythm 10 (fit 2, motion) | none; a tap-on-beat phone version needs a new timing mechanic | defer, redesign for touch |
| Camera or microphone | 6 rows (fit 1) | none; a phone microphone needs a permission design | defer |
| Boss or encounter with asymmetric powers | Boss 5, Showdown 10 | none that fits without a new asymmetric rule | defer |

Count check for a first original set: 4 free-for-all shapes (quiz, survival, collect, speed sort), 2 for 1v3,
2 for 2v2, 1 duel, 1 co-op, all fit 4 or 5. That is 10 games, all reachable from shapes above.

## 4. What PartyBox should do originally

1. **Mechanics, not names.** Keep the shapes in section 3; rename every minigame, character and reward, and write
   new strings in `client/strings.ts` (EN and ES). Nothing from this file ships.
2. **Phone-first first.** Build the 10-game set from fit 4-5 shapes. Treat motion (fit 2) and camera/microphone
   (fit 1) as a later design pass, with a touch or permission plan written before any code.
3. **Round length 20-60 s.** The contract allows 20-90 s (`minigame.seconds`); the median here is 30 s, so default to
   30 s and show the deadline with `DeadlineBar` and a 10-second cue.
4. **One rule on the TV start stage.** Each game gets a three-step `howToPlay` (ADR-053), like the minigame
   `howTo` (two lines) in the contract.
5. **Rank rewards, do not invent coins.** The rows show coin and star awards are often unknown (star awards: 0 rows
   known). Award by place (1st, 2nd, 3rd, last) and let the board decide what that is worth.
6. **Make the reward mechanic visible.** For any random reward, show the wheel, the stone or the hole before the
   result, the way the item rounds do.
7. **Simultaneous by default, sequential for duels.** Versus rounds can be simultaneous on the phone; duels reveal in
   turn so neither player is guessing from the other's screen.
8. **Use the stage budget.** The TV shows the one thing everyone watches (the field, the timer, the leader), and each
   phone shows only its own action. Keep `PhoneStage` for stage moments and check `useCanSeeTv()`.
9. **Winner moment, under 4 s.** Use the existing `lazyFinale`, `Confetti` and `Juice` (NumberPop) components; podium
   for 2nd and 3rd, skippable.
10. **Test the pool, not just the games.** Run `pnpm sim` on every shape with random and idle bots, and check that each
    game ends within `estimatedMinutes` x 3 (contract invariant 6) unless it declares `unlimitedDuration` (ADR-069).

## 5. Limits of this digest

- The counts come from 132 rows whose claims are mostly single-source (see README). A category or format row with
  a title-only quote is downgraded, but a human still has to re-read the source before any exact number is used.
- Phone fit is an editorial judgement for a touch screen, not a test. The reasons are one sentence each in the rows.
- Nothing here measures fun. The "what makes it work" list is a reading of the rows and needs playtests.
