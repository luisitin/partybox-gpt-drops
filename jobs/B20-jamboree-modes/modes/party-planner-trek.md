# Party-Planner Trek

Classification: **mode**; edition: **base**; parent: None.

## Reported Nintendo rules

Mode presence has two publisher lineages; individual rule status is separate. The scope of a quote is checked at its locator.

- https://www.mariowiki.com/Super_Mario_Party_Jamboree — “Party-Planner Trek” (Mode heading or rules description).
- https://mynintendonews.com/2024/10/15/review-super-mario-party-jamboree/ — “Party-Planner Trek” (Mode heading or rules description).

### Players

- `TREK_PLAYERS`: {"players": 1} — **corroborated; high**. 

### Length

- `TREK_BOARDS`: {"boards": 5, "totalTimeLimit": null} — **corroborated; high**. Review completion time is personal experience, not a fixed timer.

### Flow

- `TREK_FLOW`: Freely explore boards and complete character requests/minigames to collect Mini Stars. — **corroborated; high**. 

### Scoring

- `TREK_PAYOUT`: {"itemRequest": 1, "individualMinigamePlacements": [3, 2, 1], "teamOrDuelWin": 2, "itemMinigame": 1} — **single_source; medium**. Exact payout mapping has one source; the array's interpretation follows the explicit first/second/third placement description.

### Rewards

- `TREK_REWARDS`: Progress unlocks decorations for the Party Plaza. — **corroborated; high**. 

### Unlocks

- `TREK_GATE`: {"miniStarsPerBoardToAdvance": 30} — **corroborated; high**. 

## Buildable phone + one TV prototype

**Original adaptation proposal.** Timers, physics, input windows, score thresholds and tie rules below are design choices. They are not claims about Nintendo implementation. Source-derived facts appear above with independent status; the proposal remains playable where exact Nintendo details are unavailable.

- Adapter: `quest_prototype`; phone/bot slots: 1.
- State: grid=5x5; position=(0,0); miniStars=0; completedTasks=set(); bossHealth=10.
- Controls: Move pad, Interact, Choose task; each adjacent NPC offers a 20s 3x3 tap-target challenge.
- Rules: Five NPC tasks each award 6 proposal Mini Stars on >=10 valid taps; otherwise retry. At 30 Mini Stars unlock a boss target sequence, requiring 10 valid taps with 1s target windows. Exit/retry is always available. A completed NPC task is recorded by ID and cannot award stars again.
- Scoring/end outcome: Defeat the boss to win a named prototype decoration. Rewards here are prototype data, not Nintendo unlock proofs.
- Common transport, event mapping, disconnection and global exit contract: `../phone-tv-protocol.json`.

| Phase | Proposed deadline seconds | Inputs | Exit conditions |
|---|---:|---|---|
| lobby | 60 | join, ready, leave | all_ready → briefing if Every active human ready; host selected mode.; deadline → briefing if At least one human connected.; deadline → done if No human connected.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| briefing | 20 | ready, leave | all_ready → setup if All active humans ready.; deadline → setup if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| setup | 5 | leave | deadline → play if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| play | 600 | choice, tap, move, aim, fire, interact, ready, leave | objective_complete → resolve if Adapter end condition reached.; deadline → resolve if Timed adapter deadline reached.; host_finish → resolve if Free exploration/selector/repeat activity.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| resolve | 3 | leave | deadline → results if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| results | 30 | choice, ready, leave | retry → setup if Host requests retry with at least one connected human.; finish → done if Host selects Finish.; deadline → done if Unconditional. |
| done | None |  | terminal → done if Session ended; no pending work. |

The terminal done phase accepts no inputs. Host cancellation, disconnection expiry and the 3600-second global cap provide exits from untimed activities. Parent selectors delegate to documented child specs and return their immutable results.

## UNVERIFIED

- Exact hidden random weights, all tie/counter exceptions and content-specific timers are not inferred from prose.
- TREK_PAYOUT: Exact payout mapping has one source; the array's interpretation follows the explicit first/second/third placement description.
