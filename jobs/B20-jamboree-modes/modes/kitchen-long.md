# Long

Classification: **difficulty**; edition: **base**; parent: rhythm-kitchen.

## Reported Nintendo rules

Mode presence has two publisher lineages; individual rule status is separate. The scope of a quote is checked at its locator.

- https://www.mariowiki.com/Super_Mario_Party_Jamboree — “long” (rhythm-kitchen subsection).
- https://mynintendonews.com/2024/10/15/review-super-mario-party-jamboree/ — “long” (rhythm-kitchen subsection).

### Players

- `KITCHEN_PLAYERS`: {"localMaximum": 4, "online": false} — **corroborated; high**. 

### Length

- `LONG_LENGTH`: {"minigames": 6} — **corroborated; high**. Six-game total is corroborated; exact repeat ordering is reported by the wiki.

### Flow

UNVERIFIED: no complete retained Nintendo rule record for this field.

### Scoring

- `KITCHEN_SCORE`: The group earns a collective cooking rating. — **corroborated; high**. Individual accuracy is explicitly reported by the review; exact rating thresholds remain unknown.

### Rewards

UNVERIFIED: no complete retained Nintendo rule record for this field.

### Unlocks

UNVERIFIED: no complete retained Nintendo rule record for this field.

## Buildable phone + one TV prototype

**Original adaptation proposal.** Timers, physics, input windows, score thresholds and tie rules below are design choices. They are not claims about Nintendo implementation. Source-derived facts appear above with independent status; the proposal remains playable where exact Nintendo details are unavailable.

- Adapter: `rhythm_sequence`; phone/bot slots: 4.
- State: gameIndex=1..6; notesHit[4]=0; notesTotal[4]=0.
- Controls: Tap large on-beat button while TV displays beat cues; optional phone vibration.
- Rules: Play 6 original 20s tracks at 120 BPM. A tap within 150ms of the server beat scores one hit; accept at most one hit per note. Challenging uses a 100ms window; Remix changes between 120/150 BPM each 5s. Missing a note scores zero.
- Scoring/end outcome: Average player accuracy; proposal collective rank 1=<40%, 2=40..59%, 3=60..74%, 4=75..89%, 5>=90%. No Nintendo threshold claim.
- Common transport, event mapping, disconnection and global exit contract: `../phone-tv-protocol.json`.

| Phase | Proposed deadline seconds | Inputs | Exit conditions |
|---|---:|---|---|
| lobby | 60 | join, ready, leave | all_ready → briefing if Every active human ready; host selected mode.; deadline → briefing if At least one human connected.; deadline → done if No human connected.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| briefing | 20 | ready, leave | all_ready → setup if All active humans ready.; deadline → setup if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| setup | 5 | leave | deadline → play if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| play | 150 | choice, tap, move, aim, fire, interact, ready, leave | objective_complete → resolve if Adapter end condition reached.; deadline → resolve if Timed adapter deadline reached.; host_finish → resolve if Free exploration/selector/repeat activity.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| resolve | 3 | leave | deadline → results if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| results | 30 | choice, ready, leave | retry → setup if Host requests retry with at least one connected human.; finish → done if Host selects Finish.; deadline → done if Unconditional. |
| done | None |  | terminal → done if Session ended; no pending work. |

The terminal done phase accepts no inputs. Host cancellation, disconnection expiry and the 3600-second global cap provide exits from untimed activities. Parent selectors delegate to documented child specs and return their immutable results.

## UNVERIFIED

- flow: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- rewards: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- unlocks: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- Exact hidden random weights, all tie/counter exceptions and content-specific timers are not inferred from prose.
