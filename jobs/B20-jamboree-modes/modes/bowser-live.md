# Bowser Live

Classification: **mode**; edition: **tv**; parent: None.

## Reported Nintendo rules

Mode presence has two publisher lineages; individual rule status is separate. The scope of a quote is checked at its locator.

- https://mariopartylegacy.com/games/super-mario-party-jamboree/jamboree-tv/ — “Bowser Live” (Mode heading or rules description).
- https://www.nintendolife.com/guides/super-mario-party-jamboree-nintendo-switch-2-edition-plus-jamboree-tv-all-new-minigames-and-modes — “Bowser Live” (Mode heading or rules description).

### Players

- `LIVE_TEAMS`: {"teams": 2, "playersPerTeam": 2} — **corroborated; high**. 

### Length

UNVERIFIED: no complete retained Nintendo rule record for this field.

### Flow

- `LIVE_FLOW`: Play two selected camera or microphone minigames, then a final cheering challenge. — **corroborated; high**. 

### Scoring

- `LIVE_SCORE`: The largest combined game and cheering point total wins. — **corroborated; high**. 
- `LIVE_TIE`: A tied point total gives both teams a win, except when neither contributed, which gives both a loss. — **single_source; medium**. 

### Rewards

UNVERIFIED: no complete retained Nintendo rule record for this field.

### Unlocks

UNVERIFIED: no complete retained Nintendo rule record for this field.

## Buildable phone + one TV prototype

**Original adaptation proposal.** Timers, physics, input windows, score thresholds and tie rules below are design choices. They are not claims about Nintendo implementation. Source-derived facts appear above with independent status; the proposal remains playable where exact Nintendo details are unavailable.

- Adapter: `team_performance`; phone/bot slots: 4.
- State: teamPoints[2]=0; stage=1..3.
- Controls: Touch tap or hold buttons substitute for camera/microphone. No raw camera/audio capture is needed for this prototype.
- Rules: Two 20s command games: TV shows Tap or Hold every 2s. Correct response within 750ms scores 1; wrong input 0. Final 15s cheer sums accepted taps, awarding 5 bonus points to the higher team, 5 each on a tie.
- Scoring/end outcome: Highest team point total wins; zero-all yields group loss. The weighting and command windows are proposal values.
- Common transport, event mapping, disconnection and global exit contract: `../phone-tv-protocol.json`.

| Phase | Proposed deadline seconds | Inputs | Exit conditions |
|---|---:|---|---|
| lobby | 60 | join, ready, leave | all_ready → briefing if Every active human ready; host selected mode.; deadline → briefing if At least one human connected.; deadline → done if No human connected.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| briefing | 20 | ready, leave | all_ready → setup if All active humans ready.; deadline → setup if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| setup | 5 | leave | deadline → play if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| play | 90 | choice, tap, move, aim, fire, interact, ready, leave | objective_complete → resolve if Adapter end condition reached.; deadline → resolve if Timed adapter deadline reached.; host_finish → resolve if Free exploration/selector/repeat activity.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| resolve | 3 | leave | deadline → results if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| results | 30 | choice, ready, leave | retry → setup if Host requests retry with at least one connected human.; finish → done if Host selects Finish.; deadline → done if Unconditional. |
| done | None |  | terminal → done if Session ended; no pending work. |

The terminal done phase accepts no inputs. Host cancellation, disconnection expiry and the 3600-second global cap provide exits from untimed activities. Parent selectors delegate to documented child specs and return their immutable results.

## UNVERIFIED

- length: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- rewards: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- unlocks: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- Exact hidden random weights, all tie/counter exceptions and content-specific timers are not inferred from prose.
- LIVE_TIE: 
