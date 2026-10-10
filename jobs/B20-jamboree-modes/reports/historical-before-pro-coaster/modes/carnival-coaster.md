# Carnival Coaster

Classification: **mode**; edition: **tv**; parent: None.

## Reported Nintendo rules

Mode presence has two publisher lineages; individual rule status is separate. The scope of a quote is checked at its locator.

- https://mariopartylegacy.com/games/super-mario-party-jamboree/jamboree-tv/ — “Carnival Coaster” (Mode heading or rules description).
- https://www.nintendolife.com/guides/super-mario-party-jamboree-nintendo-switch-2-edition-plus-jamboree-tv-all-new-minigames-and-modes — “Carnival Coaster” (Mode heading or rules description).

### Players

- `COASTER_PLAYERS`: {"reportedHumanMaximum": 4, "coasterTeamSlots": [2, 4]} — **conflict; low**. Nintendo Life describes two participants; 1-4 humans may include CPU-filled slots. Exact solo/fill/version scope remains under audit.

### Length

- `COASTER_FAIL`: The shared countdown expiring ends the attempt. — **single_source; medium**. 
- `COASTER_COURSES`: {"courses": 5} — **corroborated; high**. 

### Flow

- `COASTER_RULE`: Aim using mouse controls at enemy waves; pipes insert cooperative minigames and performance adds time. — **corroborated; high**. 

### Scoring

- `COASTER_RANK_TIME`: {"normal": {"S": 25, "A": 20, "B": 15, "C": 0}, "trial": {"S": 10, "A": 7, "B": 3, "C": 0}} — **single_source; medium**. Rank thresholds and exact base countdowns remain unverified.

### Rewards

UNVERIFIED: no complete retained Nintendo rule record for this field.

### Unlocks

UNVERIFIED: no complete retained Nintendo rule record for this field.

## Buildable phone + one TV prototype

**Original adaptation proposal.** Timers, physics, input windows, score thresholds and tie rules below are design choices. They are not claims about Nintendo implementation. Source-derived facts appear above with independent status; the proposal remains playable where exact Nintendo details are unavailable.

- Adapter: `cooperative_shooter`; phone/bot slots: 4.
- State: sharedTime=60; wave=1..5; teamHits=0.
- Controls: Phone aim x/y in [0,1] and Fire button. TV shows targets and ride progress.
- Rules: Each wave spawns ten targets at seeded coordinates; hit radius 0.08, one point and +1s per hit. On ten hits run a 15s collective tap game; >=40 taps adds 25s, >=25 adds 20s, >=10 adds 15s, else zero. Complete five waves before shared time expires; absolute play cap 120s.
- Scoring/end outcome: Team success and hit total; rank S>=45 hits, A>=35, B>=20, else C. Exact Nintendo enemy health, rank thresholds and starting countdowns remain unverified.
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

- rewards: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- unlocks: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- Exact hidden random weights, all tie/counter exceptions and content-specific timers are not inferred from prose.
- COASTER_FAIL: 
- COASTER_PLAYERS: Nintendo Life describes two participants; 1-4 humans may include CPU-filled slots. Exact solo/fill/version scope remains under audit.
- COASTER_RANK_TIME: Rank thresholds and exact base countdowns remain unverified.
