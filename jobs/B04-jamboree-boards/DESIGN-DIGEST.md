# B04 design digest: how the seven Jamboree boards are built

For the designer and the PartyBox port. Reference only: nothing here ships, and no board name, item name, artwork or map image may appear in PartyBox. Every number is a count or a sum from `boards.json` (seven boards). The factual rows are 518: 91 corroborated, 408 single-source, 18 conflicting, 1 unknown (README "Status"). Read a number as "what the retained source reports", not as settled fact.

Status tags used below: **[C]** corroborated by a second publisher, **[S]** single source, **[X]** conflicting sources (both values kept), **[?]** unknown. Sentences marked *editorial* are reading, not source.

## 1. Space mix

Baseline party profile, Start included. Each total has one publisher; the sums check, but they are not a second source (CONFLICTS.md).

| Board | Total | Blue + Red | Event | Lucky | Item | VS | Chance Time | Unlucky | Bowser |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mega Wiggler's Tree Party | 63 | 30 (48%) | 10 | 13 | 3 | 2 | 1 | 1 | 2 |
| Rainbow Galleria | 69 | 29 (42%) | 11 | 14 | 6 | 3 | 1 | 2 | 2 |
| Goomba Lagoon | 91 | 43 (47%) | 8 | 19 | 8 | 4 | 2 | 4 | 2 |
| Roll 'em Raceway | 78 | 35 (45%) | 11 | 14 | 10 | 2 | 1 | 2 | 2 |
| King Bowser's Keep | 84 | 32 (38%) | 6 | 26 | 10 | 3 | 3 | 1 | 2 |
| Mario's Rainbow Castle | 51 | 24 (47%) | 7 | 7 | 5 | 2 | 1 | 2 | 2 |
| Western Land | 104 | 43 (41%) | 10 | 21 | 14 | 4 | 4 | 4 | 3 |

- *Editorial:* Blue and Red spaces are 38 to 48 percent of every board. Lucky is the next common type. King Bowser's Keep has the most Lucky spaces (26 of 84), Goomba Lagoon the most spaces (91), and Mario's Rainbow Castle the fewest (51).
- Rally is 0 on every baseline profile. The TV Tag Team layout removes VS spaces and adds 1 to 3 Rally spaces [S]; it keeps the total and moves Blue and Red spaces (Mega Wiggler: Blue 26 to 22, Red 4 to 8, [S]).
- Angry profiles (Mega Wiggler only, [S] counts) match its anger phase: Lucky 13 to 11, Blue 26 to 24, Red 4 to 6, Bowser 2 to 4. The converted types are disputed [X] (section 5).
- Count tables are baseline layouts. They are not Pro Rules layouts, and they do not show the board after Homestretch.

## 2. Stars and coins

- **Star price:** 20 coins at standard price [C] (`shared:star_cost`). Every board reports 20 [S per board]. No Star selection probability is known on any board (null).
- **Star placement** is per board and mostly unverified: relocating Star on five boards [S]; two marked northern-lane spots that alternate, first Star on the top lane, on Roll 'em Raceway [S, high]; a fixed tower Star that alternates between Yellow Toad and Impostor Bowser on Mario's Rainbow Castle [S].
- **Coins in** (all [S] unless marked):
  - Lap reward on Raceway: 10, then 20, then +10 per further lap.
  - Stamp redemption on Galleria: 1, 2, 3 or 4 distinct stamps pay 10, 20, 30 or 50 coins.
  - Raffle on Galleria: one draw per item bought, white 1, green 5, blue 15, red 30 coins, or a gold Golden Pipe.
  - Gear on King Bowser's Keep: claim the current face for 3 to 10 coins, or a Bob-omb takes 5.
  - Mechakoopa on King Bowser's Keep: small (3 HP) pays 6 and costs 3 on loss; large (7 HP) pays 15 and costs 5 on loss. Surviving damage persists; a defeated one respawns full.
  - Bowser's vault on King Bowser's Keep: guess a two-digit code from digits 1 to 9 (two guesses with Buddy); correct digits lock, wrong ones are eliminated; success collects seized Stars or coins.
  - Last-Place Shop on Galleria [C]: the last-place player who lands on the event receives 15 coins and makes a purchase; nobody else may shop there. Buddy makes the grant 30 [S].
  - Boo Shop on Galleria [C]: Boo Bell for 15 coins, hosted by Peepa.
- **Coins out** (all [S] unless marked):
  - BulletBill sweep on King Bowser's Keep: each hit player loses 5 coins, or 10 with Buddy.
  - Piranha penalty on Mega Wiggler: the visited plant takes 5 coins at first and grows by 1 per paid encounter.
  - Volcano eruption on Goomba Lagoon: passing a lava bubble loses 3 coins; the gold Goomba payout conflicts [X].
  - Elevator on Galleria [C]: 5 coins per character to move between floors 1 and 3, 10 total with Buddy.
  - Zipline on Goomba Lagoon: a forced transfer for a fee the source reports as 1 to 7 coins.
  - Milk Saloon on Western Land: invite one random opponent for 10 coins, or all opponents for 20.
  - Steamer train on Western Land: one stop for 3 coins, two stops for 6. The Steamer Ticket starts at 5 coins and later purchases rise on an undocumented schedule.
  - Byway Bowser penalty on King Bowser's Keep: Bowser takes one Star if you hold one, otherwise all your coins.

*Editorial:* Coins move mostly to and from the player who lands on a space. Among the retained rows, only the Last-Place Shop moves value toward the trailing player.

## 3. Shops and items

- Seven boards hold 35 shop profiles (party, pro and Tag Team rulesets) and 215 item rows. Most boards have a Koopa Troopa Shop and a Kamek Shop. Galleria adds a One-Coin Shop (all items cost 1), a Last-Place Shop, a Super Shop, a Gold Shop and the Boo Shop. Western Land adds a Ticket station that sells the Steamer Ticket.
- Price bands over the 215 listings: 1 coin (7 rows), 3 to 7 coins (127 rows, 59 percent), 10 to 12 coins (53 rows), 15 coins or more (28 rows). Most basic dice sit in the 3 to 7 band (Creepy Dice Block 3, Double Dice 5, Super Creepy Dice 5). Triple and Payday dice sit at 10 to 15, Custom Dice Block at 12, Golden Pipe at 25 and Super Dueling Glove at 40.
- **Item names can carry effect amounts, not prices.** "10-Coin Steal Trap" costs 1 coin on Galleria. Never parse a price from a name.
- **Availability differs by ruleset.** Party rules swap the first-half inventory for a second-half inventory at an unestablished turn [S, boundary formula null]. Pro Rules give two of each item, shared across the shops of one host, with no restock [S].
- **Price changes** (prices, not stock):
  - Flash sale on Galleria [C]: every fifth turn, Stars and items cost half for one turn, except the One-Coin Shop.
  - Markup Sticker on Galleria [C]: hit an opponent and their Star and item prices double for their next turn.
  - Thrift Store on Galleria [C]: Whomp forcibly buys one held item for twice its shop price. The Loadstone exception conflicts (20 on the wiki, 10 on GameRant) [X].
  - Shop Hop Box on Galleria: 6 coins on the wiki, 8 in GameRant [X].
- **Tag Team and Pro stock differ from party stock.** Mario's Rainbow Castle lists separate Tag Team shops (8 items each) [S]. Together Dice belongs to Tag Team only; the second-half price is reported at 20 coins [S].

## 4. Event spaces

38 event rows over seven boards; 37 have a trigger and an effect, one is unknown (Western Land's Steamer Event Space [?]). Grouped by what they do to a player (*editorial*):

- **The board moves:** Wiggler's bridge moves Mega Wiggler and changes the route [C]; Byway direction reversal on King Bowser's Keep [C]; Goomba's tides open or cut paths (the route rule is [C]; the tide cadence conflicts [X]); Raceway's jump pads and swapping shop-and-pad positions for two turns [S]; King Bowser's red and green pipes [S].
- **Push-your-luck:** Fishing on Goomba (catches stack; a total above 15 busts and loses the event's coins, 30 with Buddy); Gear, Mechakoopa and vault above; Hive choices on Mega Wiggler (two honey hives and one bees; bees end the attempt but keep coins; a reported 34-coin ceiling per attempt [S]).
- **Penalties:** Piranha, BulletBill, Byway Bowser penalty, Volcano lava bubble above; Steamer knockback sends a hit player to Start [C].
- **Fees and toll-style choices:** Zipline, Elevator [C], Milk Saloon, Steamer fares above.
- **Catch-up:** Last-Place Shop [C] is the only catch-up rule among the retained rows.

## 5. Phases (rules that switch on during the game, 20 rows)

- **Periodic:** flash sale every fifth turn [C]. King Bowser's fire growth: at the start of every third turn, two eligible Byway spaces become Bowser; turn 24 adds one more and then stops [S, high]. Every Galleria shop closes on the final turn [S].
- **Triggered:** Mega Wiggler's anger [X]: a bell in the second half turns Lucky spaces Red and Blue spaces Bowser until a later bell restores them (the wiki and PocketTactics disagree on the converted types; no probability is known). Castle weather [C, medium]: while Impostor Bowser holds the tower the sky turns dark/stormy and the music gains an electric-guitar variation (no day-night cycle asserted). Tower Turner [C]: a chance to swap tower characters (probability unknown). Goomba's Pro chest replaces the Bowser Phone chest with a Creepy Dice Block [S].
- **Unlocks:** Western Land unlocks at Silver rank with ten achievements [S]. King Bowser's Keep needs 30 achievements (or the Party-Planner Trek and the credits); the rank is disputed (Platinum on the wiki, Diamond in MPL and NintendoAU) [X].
- **Exceptions:** Mario's Rainbow Castle's shop swap has a disputed trigger (passing a shop vs buying) [X].

## 6. Homestretch (final five turns) and Pro Rules

- **Base Homestretch** [S]: Blue and Red spaces pay or cost 6 instead of 3 for the final five turns, and same-space landings by two or more players may trigger a duel. A further special event doubles Blue and Red again, to 12 [C] (`shared:double_spaces`).
- **Base special events** [S, one publisher each]: one Mushroom; an extra Star exchange (bought once); a Star Steal Trap for every player; a Double Dice for every player; every player's coins doubled; 2 or 3 spaces turned into Bowser; 2 to 4 turned into Chance Time. Exclusions: King Bowser's Keep has no extra Bowser, and Mario's Rainbow Castle has no extra Star exchange (its Star is fixed).
- **Pro Homestretch** [C]: no random special event; doubled spaces and duels remain.
- **Board state after Homestretch:** Mega Wiggler's Bowser or Chance Time spaces added on its back stay fixed through later anger states [S]. Goomba's retyped submerged spaces may stay hidden until the tide recedes [S].
- **Frenzy** (TV) [C]: five turns; each player starts with 50 coins, a Double Dice and one Star, two Homestretch events at the start, duels active, and one bonus Star at the end.

*Editorial:* The late game raises the stakes for everyone (doubled coins, duels, forced Bowsers). It does not pull the trailing player forward except at Galleria's Last-Place Shop.

## 7. TV Tag Team and TV edition

- **Tag Team** [C]: two teams of two share coins and Stars. Rally calls the partner and pays 5 coins. Together Dice brings the partner in and combines rolls, doubling the Star and item effects.
- **Tag Team layout** [S]: VS spaces removed, Rally added, negative spaces increased. Buddies absent.
- **TV edition** [C]: CameraPlay faces may appear on board UI and events; Pro Rules are not available. The same seven boards are used; no board is added [C].

## 8. Mapping to PartyBox (editorial proposal, not a design)

Nothing here is a copy target. The existing pieces in `/home/user/partybox` that fit each part:

- **Board movement and landings:** `games/monopoly/server/walk.ts` (one timing table for a move: dice, walk, landing, settle) and `choreo.ts` (a move planner that splits a walk into segments) are the closest pieces for moving a token and playing its landing. A board's event spaces can be pure functions of state and the landing space (contract invariant 1), so they test cleanly.
- **Economy, shops and fees:** `games/monopoly/server/economy.ts` (rent arithmetic and a finite building bank), `management.ts` (asset changes between turns), `payments.ts` and `trades.ts`. A shop is a purchase phase with a stock list and a price multiplier; a Star is a fixed-price purchase.
- **Board-state phases** (fire growth, tides, anger, tower weather): model each as a `phase` with `deadline` data (contract invariant 3) or as a pure function of turn number. Both are deterministic and sim-friendly.
- **TV board and motion:** `games/monopoly/client/board3d/BoardScene.tsx`, `motion3d.ts`, `camera3d.ts`; `games/monopoly/client/board-motion.ts`, `choreo-clock.tsx`, `dice-roll.ts`. Table presentation: `packages/game-sdk/src/table3d/` (`docs/sdk/table3d.md`, ADR-071, one isolated Three/R3F entry; motion preference pauses physics).
- **Phone:** `packages/game-sdk/src/ui/DeadlineBar.tsx` for the turn clock, `ui/Tally.tsx` and `tallyMath.ts` for coin count-ups, `ui/Juice.tsx` for pops.
- **Winner moment:** `packages/game-sdk/src/tv/Confetti.tsx`.
- **Start stage** (rules, everyone ready, 3-2-1): `packages/client/src/tv/TvStartStage.tsx` (ADR-053).
- **Timers:** `packages/game-sdk/src/timer.ts`.

## 9. Limits

- **Single-source numbers:** all count totals (baseline, Tag Team and angry), the Pro stock and shop-period rules, and all four board-level Homestretch facts are single-source. Of the Homestretch rules, only the Pro Homestretch behaviour and the second Blue/Red doubling are corroborated; the base doubling and the special-event list are single-source.
- **Eighteen preserved conflicts** (kept, not resolved): nine additional ordinary baseline type-count disagreements, plus the original nine mechanical disputes: Mega Wiggler anger; Galleria stamp colour labels, Loadstone payout, Peach/Daisy availability and Shop Hop Box price; Goomba eruption and tide cadence; King Bowser's unlock rank; Castle shop swap trigger. Listed with values in CONFLICTS.md.
- **Unknown:** the current Steamer Event Space movement (Western Land). The MarioParty 2 precedent is historical and not used.
- **No route graph:** the map links are regional (11 cited) and carry no numbered space ids or directions the sources do not state. Gate endpoints are unknown for the Skeleton Key gates (King Bowser's Keep, Western Land) and the Galleria escalators.
- **Probabilities and payouts absent:** Star selection, tower turn chance, anger probability, Raceway dice-pool weights, Hive payout distribution, Gold Goomba payout. Do not invent weights.
- **Raceway shop count:** one shop is reported active at a time (low confidence); a swapped visual state exists for two turns.
- **Licence:** names, prices, maps and artwork belong to Nintendo or its licensors. A PartyBox port needs its own names, art and text, built from the mechanics above, not from the source pages.
