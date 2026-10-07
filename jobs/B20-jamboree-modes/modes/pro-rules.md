# Pro Rules

Classification: **rule_variant**; edition: **base**; parent: None.

## Reported Nintendo rules

Mode presence has two publisher lineages; individual rule status is separate. The scope of a quote is checked at its locator.

- https://www.nintendo.com/us/whatsnew/super-mario-party-jamboree-heres-a-quick-overview-of-the-game/ — “Pro Rules” (Mode heading or rules description).
- https://zeldauniverse.net/features/review-super-mario-party-jamboree/ — “Pro Rules” (Mode heading or rules description).

### Players

UNVERIFIED: no complete retained Nintendo rule record for this field.

### Length

- `PRO_LENGTH`: {"turns": 12} — **single_source; medium**. 

### Flow

- `PRO_ITEMS`: Choose a starting item; shop copies are limited to two and do not replenish. — **corroborated; high**. 

### Scoring

- `PRO_BONUS`: One bonus category is announced before board play. — **corroborated; high**. 

### Rewards

UNVERIFIED: no complete retained Nintendo rule record for this field.

### Unlocks

- `PRO_UNLOCK`: Complete one Mario Party board; game length and winning do not determine this unlock. — **single_source; medium**. 

## Buildable phone + one TV prototype

**Original adaptation proposal.** Timers, physics, input windows, score thresholds and tie rules below are design choices. They are not claims about Nintendo implementation. Source-derived facts appear above with independent status; the proposal remains playable where exact Nintendo details are unavailable.

- Adapter: `board_prototype`; phone/bot slots: 4.
- State: positions[4] initially 0; coins[4]=10; stars[4]=0; activePlayer; turn=1..12; itemChoice[4]; eventfulCount[4].
- Controls: Choice buttons: mushroom (+5 movement) or shield (ignore next -3); Roll button; Buy Star button. Server auto-rolls after 15s inactive.
- Rules: Proposal board: 16-node directed cycle. Every fourth node is Event, next is Red (-3), others Blue (+3); node 8 offers one Star for 20 coins while passing. Clamp wallet to >=0. Use one chosen item or roll once, move and land, then next player. After four players, run a 20s reaction game; winner +10 coins. After 12 turns award one preannounced Eventful bonus to highest event count, including shared ties. Each roll/menu decision auto-resolves after 15s; passing-Star purchase decisions default to No after 5s.
- Scoring/end outcome: Rank by Stars then coins; equal rank shares win. This small original board is not a recreation of Nintendo board topology or item inventory.
- Common transport, event mapping, disconnection and global exit contract: `../phone-tv-protocol.json`.

| Phase | Proposed deadline seconds | Inputs | Exit conditions |
|---|---:|---|---|
| lobby | 60 | join, ready, leave | all_ready → briefing if Every active human ready; host selected mode.; deadline → briefing if At least one human connected.; deadline → done if No human connected.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| briefing | 20 | ready, leave | all_ready → setup if All active humans ready.; deadline → setup if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| setup | 5 | leave | deadline → play if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| play | 1200 | choice, tap, move, aim, fire, interact, ready, leave | objective_complete → resolve if Adapter end condition reached.; deadline → resolve if Timed adapter deadline reached.; host_finish → resolve if Free exploration/selector/repeat activity.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| resolve | 3 | leave | deadline → results if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| results | 30 | choice, ready, leave | retry → setup if Host requests retry with at least one connected human.; finish → done if Host selects Finish.; deadline → done if Unconditional. |
| done | None |  | terminal → done if Session ended; no pending work. |

The terminal done phase accepts no inputs. Host cancellation, disconnection expiry and the 3600-second global cap provide exits from untimed activities. Parent selectors delegate to documented child specs and return their immutable results.

## UNVERIFIED

- players: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- rewards: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- Exact hidden random weights, all tie/counter exceptions and content-specific timers are not inferred from prose.
- PRO_LENGTH: 
- PRO_UNLOCK: 
