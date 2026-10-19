# Koopa Paratroopa Taxi

Classification: **submode**; edition: **base**; parent: paratroopa-flight-school.

## Reported Nintendo rules

Mode presence has two publisher lineages; individual rule status is separate. The scope of a quote is checked at its locator.

- https://www.mariowiki.com/Paratroopa_Flight_School — “Koopa Paratroopa Taxi” (paratroopa-flight-school subsection).
- https://mynintendonews.com/2024/10/15/review-super-mario-party-jamboree/ — “Koopa Paratroopa Taxi” (paratroopa-flight-school subsection).

### Players

- `FLIGHT_PLAYERS`: {"localMaximum": 2, "online": false, "characters": ["Mario", "Luigi"]} — **corroborated; high**. Nintendo corroborates local capacity; characters are also reported by the dedicated wiki.

### Length

- `TAXI_DIFFICULTIES`: {"difficulties": ["Easy", "Normal", "Difficult"], "numericTimers": null} — **single_source; medium**. 

### Flow

- `TAXI_RULE`: Work together to carry balanced passengers to destinations; transported count determines the ending rank. — **single_source; medium**. Rank rule is one source; two independent texts corroborate cooperative passenger transport.

### Scoring

UNVERIFIED: no complete retained Nintendo rule record for this field.

### Rewards

UNVERIFIED: no complete retained Nintendo rule record for this field.

### Unlocks

UNVERIFIED: no complete retained Nintendo rule record for this field.

## Buildable phone + one TV prototype

**Original adaptation proposal.** Timers, physics, input windows, score thresholds and tie rules below are design choices. They are not claims about Nintendo implementation. Source-derived facts appear above with independent status; the proposal remains playable where exact Nintendo details are unavailable.

- Adapter: `flight_coop`; phone/bot slots: 2.
- State: passenger=(5,5); destinations=seeded positions; balance=0; delivered=0.
- Controls: Both phones move a net endpoint with a touch pad; hold Interact to pick up/drop off.
- Rules: Net center moves by average player velocity, maximum 2 units/s. Balance accumulates endpoint-distance minus 2 units; if balance>3 drop passenger at current position and reset balance. Delivery within 0.5 destination radius increments count and spawns next passenger. Apply balance=max(0,balance+(endpointDistance-2)*dt); normalize each movement vector to length at most one.
- Scoring/end outcome: Both share delivered count at deadline; proposal ranks C=0, B=1..2, A=3..4, S>=5.
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
- TAXI_RULE: Rank rule is one source; two independent texts corroborate cooperative passenger transport.
- TAXI_DIFFICULTIES: 
