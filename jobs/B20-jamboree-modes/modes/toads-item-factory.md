# Toad's Item Factory

Classification: **mode**; edition: **base**; parent: None.

## Reported Nintendo rules

Mode presence has two publisher lineages; individual rule status is separate. The scope of a quote is checked at its locator.

- https://www.mariowiki.com/Super_Mario_Party_Jamboree — “Toad's Item Factory” (Mode heading or rules description).
- https://mynintendonews.com/2024/10/15/review-super-mario-party-jamboree/ — “Toad’s Item Factory” (Mode heading or rules description).

### Players

- `FACTORY_PLAYERS`: {"localMaximum": 4, "online": false} — **corroborated; high**. 

### Length

- `FACTORY_LEVELS`: {"areas": 10, "levelsPerArea": 3, "totalLevels": 30} — **corroborated; high**. 

### Flow

- `FACTORY_GOAL`: Cooperatively move machinery to guide a ball through obstacles to the goal. — **corroborated; high**. 

### Scoring

UNVERIFIED: no complete retained Nintendo rule record for this field.

### Rewards

UNVERIFIED: no complete retained Nintendo rule record for this field.

### Unlocks

UNVERIFIED: no complete retained Nintendo rule record for this field.

## Buildable phone + one TV prototype

**Original adaptation proposal.** Timers, physics, input windows, score thresholds and tie rules below are design choices. They are not claims about Nintendo implementation. Source-derived facts appear above with independent status; the proposal remains playable where exact Nintendo details are unavailable.

- Adapter: `marble_coop`; phone/bot slots: 4.
- State: marble=(0,0); velocity=(0,0); target=(10,10); platformAngle[player]=0; attempt=1.
- Controls: Touch slider in [-1,1] adjusts assigned platform angle; Restart votes are accepted.
- Rules: Server updates at 20Hz. Use acceleration sum(angles)*0.3 on x, gravity +0.1 on y, velocity damping 0.98 and max speed 2 units/s. Platforms form ten horizontal strips; alternate players control strip tilt. Crossing outside [0,10] resets marble and adds 1 attempt. Goal is radius 0.5 around (10,10).
- Scoring/end outcome: Win when goal reached; report elapsed time and resets. End loss at 120s. Later stages may replace layouts without changing protocol; sourced Nintendo 30-level count does not provide their geometry.
- Common transport, event mapping, disconnection and global exit contract: `../phone-tv-protocol.json`.

| Phase | Proposed deadline seconds | Inputs | Exit conditions |
|---|---:|---|---|
| lobby | 60 | join, ready, leave | all_ready → briefing if Every active human ready; host selected mode.; deadline → briefing if At least one human connected.; deadline → done if No human connected.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| briefing | 20 | ready, leave | all_ready → setup if All active humans ready.; deadline → setup if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| setup | 5 | leave | deadline → play if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| play | 120 | choice, tap, move, aim, fire, interact, ready, leave | objective_complete → resolve if Adapter end condition reached.; deadline → resolve if Timed adapter deadline reached.; host_finish → resolve if Free exploration/selector/repeat activity.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| resolve | 3 | leave | deadline → results if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| results | 30 | choice, ready, leave | retry → setup if Host requests retry with at least one connected human.; finish → done if Host selects Finish.; deadline → done if Unconditional. |
| done | None |  | terminal → done if Session ended; no pending work. |

The terminal done phase accepts no inputs. Host cancellation, disconnection expiry and the 3600-second global cap provide exits from untimed activities. Parent selectors delegate to documented child specs and return their immutable results.

## UNVERIFIED

- scoring: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- rewards: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- unlocks: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- Exact hidden random weights, all tie/counter exceptions and content-specific timers are not inferred from prose.
