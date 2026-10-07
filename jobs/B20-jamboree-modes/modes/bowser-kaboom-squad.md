# Bowser Kaboom Squad

Classification: **mode**; edition: **base**; parent: None.

## Reported Nintendo rules

Mode presence has two publisher lineages; individual rule status is separate. The scope of a quote is checked at its locator.

- https://www.mariowiki.com/Super_Mario_Party_Jamboree — “Bowser Kaboom Squad” (Mode heading or rules description).
- https://mynintendonews.com/2024/10/15/review-super-mario-party-jamboree/ — “Bowser Kaboom Squad” (Mode heading or rules description).

### Players

- `KABOOM_PLAYERS`: {"offlineHumans": 1, "totalPlayers": 8, "onlineMaximum": 8} — **corroborated; high**. The review's online-only heading is narrowed by its NPC-play text and official human-per-console table.

### Length

- `KABOOM_ROUNDS`: {"maximumRounds": 5, "reportedRoundSeconds": 90} — **single_source; medium**. Five rounds is independently corroborated; 90 seconds currently has only one retained source.

### Flow

- `KABOOM_BOMBS`: Break crates, carry bombs to the cannon, and fire at the normal 20-bomb threshold. — **corroborated; high**. Wiki additionally reports an enough-to-defeat shortcut; that qualifier is not independently certified.
- `KABOOM_REVIVE`: A hit bubbles the player; teammates strike the bubble to revive them. — **corroborated; high**. 

### Scoring

- `KABOOM_BONUS`: {"coinTrigger": 100, "bonusSeconds": 30, "damageMultiplier": 2} — **corroborated; high**. 

### Rewards

- `KABOOM_REWARDS`: Round-end cooperative minigame performance determines the selection of items available for the following round. — **corroborated; high**. 

### Unlocks

- `KABOOM_ONLINE_UNLOCK`: Clear single-player mode before online play. — **single_source; medium**. 

## Buildable phone + one TV prototype

**Original adaptation proposal.** Timers, physics, input windows, score thresholds and tie rules below are design choices. They are not claims about Nintendo implementation. Source-derived facts appear above with independent status; the proposal remains playable where exact Nintendo details are unavailable.

- Adapter: `bomb_coop`; phone/bot slots: 8.
- State: health=120; round=1..5; bombCarry[8]=0; cannonLoad=0; grid=8x8; bubbled[8]=false; coinsCollected=0.
- Controls: Touch move pad at 2 grid cells/s; Interact breaks adjacent crate after 3 accepted presses, collects one bomb, deposits at cannon or pops adjacent teammate bubble.
- Rules: Each 90s round spawns one crate each 5s at seeded empty cell, each crate has 5 bombs. Cannon at (4,4); each 20 bombs deals 20 health, minimum-load shortcut when remaining health smaller. Hazard every 10s bubbles players in one marked row; 2s warning. Each carried bomb dropped into cannon awards 1 team coin. At 100 coins, a 30s golden-bomb interval doubles damage. Between rounds, a 20s collective tap game adds one extra crate if >=40 taps.
- Scoring/end outcome: Cooperative win at health<=0; otherwise loss after five rounds. Prototype hazards, health and item substitutes are original proposal rules.
- Common transport, event mapping, disconnection and global exit contract: `../phone-tv-protocol.json`.

| Phase | Proposed deadline seconds | Inputs | Exit conditions |
|---|---:|---|---|
| lobby | 60 | join, ready, leave | all_ready → briefing if Every active human ready; host selected mode.; deadline → briefing if At least one human connected.; deadline → done if No human connected.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| briefing | 20 | ready, leave | all_ready → setup if All active humans ready.; deadline → setup if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| setup | 5 | leave | deadline → play if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| play | 530 | choice, tap, move, aim, fire, interact, ready, leave | objective_complete → resolve if Adapter end condition reached.; deadline → resolve if Timed adapter deadline reached.; host_finish → resolve if Free exploration/selector/repeat activity.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| resolve | 3 | leave | deadline → results if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| results | 30 | choice, ready, leave | retry → setup if Host requests retry with at least one connected human.; finish → done if Host selects Finish.; deadline → done if Unconditional. |
| done | None |  | terminal → done if Session ended; no pending work. |

The terminal done phase accepts no inputs. Host cancellation, disconnection expiry and the 3600-second global cap provide exits from untimed activities. Parent selectors delegate to documented child specs and return their immutable results.

## UNVERIFIED

- Exact hidden random weights, all tie/counter exceptions and content-specific timers are not inferred from prose.
- KABOOM_ROUNDS: Five rounds is independently corroborated; 90 seconds currently has only one retained source.
- KABOOM_ONLINE_UNLOCK: 
