# Free Flight

Classification: **submode**; edition: **base**; parent: paratroopa-flight-school.

## Reported Nintendo rules

Mode presence has two publisher lineages; individual rule status is separate. The scope of a quote is checked at its locator.

- https://www.mariowiki.com/Paratroopa_Flight_School — “Free Flight” (paratroopa-flight-school subsection).
- https://mynintendonews.com/2024/10/15/review-super-mario-party-jamboree/ — “Free Flight” (paratroopa-flight-school subsection).

### Players

- `FLIGHT_PLAYERS`: {"localMaximum": 2, "online": false, "characters": ["Mario", "Luigi"]} — **corroborated; high**. Nintendo corroborates local capacity; characters are also reported by the dedicated wiki.

### Length

- `FREE_FLIGHT_END`: {"mainTimeLimit": null, "mainObjective": null} — **corroborated; high**. 

### Flow

UNVERIFIED: no complete retained Nintendo rule record for this field.

### Scoring

- `FREE_FLIGHT_COLLECT`: {"scatteredCoins": 100, "reportedDrawingSeconds": 180} — **single_source; medium**. Optional activities; absence of an overall timer does not imply all side activities are untimed.

### Rewards

UNVERIFIED: no complete retained Nintendo rule record for this field.

### Unlocks

UNVERIFIED: no complete retained Nintendo rule record for this field.

## Buildable phone + one TV prototype

**Original adaptation proposal.** Timers, physics, input windows, score thresholds and tie rules below are design choices. They are not claims about Nintendo implementation. Source-derived facts appear above with independent status; the proposal remains playable where exact Nintendo details are unavailable.

- Adapter: `free_exploration`; phone/bot slots: 2.
- State: positions[2]=(0,0); collectedCoins=set(); arena=10x10.
- Controls: Touch movement pad; Land/Leave buttons always available.
- Rules: Seed 100 coins. Move up to 2 units/s and collect coins within 0.5 radius. No play-phase time limit; host Leave or global session cap ends exploration.
- Scoring/end outcome: Report coins collected; no invented competitive winner.
- Common transport, event mapping, disconnection and global exit contract: `../phone-tv-protocol.json`.

| Phase | Proposed deadline seconds | Inputs | Exit conditions |
|---|---:|---|---|
| lobby | 60 | join, ready, leave | all_ready → briefing if Every active human ready; host selected mode.; deadline → briefing if At least one human connected.; deadline → done if No human connected.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| briefing | 20 | ready, leave | all_ready → setup if All active humans ready.; deadline → setup if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| setup | 5 | leave | deadline → play if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| play | None | choice, tap, move, aim, fire, interact, ready, leave | objective_complete → resolve if Adapter end condition reached.; deadline → resolve if Timed adapter deadline reached.; host_finish → resolve if Free exploration/selector/repeat activity.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| resolve | 3 | leave | deadline → results if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| results | 30 | choice, ready, leave | retry → setup if Host requests retry with at least one connected human.; finish → done if Host selects Finish.; deadline → done if Unconditional. |
| done | None |  | terminal → done if Session ended; no pending work. |

The terminal done phase accepts no inputs. Host cancellation, disconnection expiry and the 3600-second global cap provide exits from untimed activities. Parent selectors delegate to documented child specs and return their immutable results.

## UNVERIFIED

- flow: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- rewards: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- unlocks: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- Exact hidden random weights, all tie/counter exceptions and content-specific timers are not inferred from prose.
- FREE_FLIGHT_COLLECT: Optional activities; absence of an overall timer does not imply all side activities are untimed.
