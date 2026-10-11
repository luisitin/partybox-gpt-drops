# Tag Match

Classification: **submode**; edition: **base**; parent: minigame-bay.

## Reported Nintendo rules

Mode presence has two publisher lineages; individual rule status is separate. The scope of a quote is checked at its locator.

- https://www.mariowiki.com/Minigame_Bay — “Tag Match” (minigame-bay subsection).
- https://mynintendonews.com/2024/10/15/review-super-mario-party-jamboree/ — “Tag Match” (minigame-bay subsection).

### Players

- `BAY_PLAYERS`: {"localMaximum": 4, "onlineMaximum": 4, "submodeExceptions": true} — **corroborated; high**. 

### Length

UNVERIFIED: no complete retained Nintendo rule record for this field.

### Flow

- `TAG_SELECT`: After an initial random game, the previous losing team chooses subsequent minigames; worldwide play uses streak scoring. — **single_source; medium**. 

### Scoring

- `TAG_RULE`: {"teams": 2, "playersPerTeam": 2, "targetChoices": [3, 5, 10]} — **corroborated; high**. Stars represent wins here; not standard-board collectible Stars.

### Rewards

UNVERIFIED: no complete retained Nintendo rule record for this field.

### Unlocks

UNVERIFIED: no complete retained Nintendo rule record for this field.

## Buildable phone + one TV prototype

**Original adaptation proposal.** Timers, physics, input windows, score thresholds and tie rules below are design choices. They are not claims about Nintendo implementation. Source-derived facts appear above with independent status; the proposal remains playable where exact Nintendo details are unavailable.

- Adapter: `team_reaction_series`; phone/bot slots: 4.
- State: teamWins[2]=0; targetWins=3; gameIndex.
- Controls: Tap own illuminated 3x3 targets in each 20s game; losing team votes the next skin.
- Rules: Group players (0,1) and (2,3), sum valid taps for team round score. Higher team total gains one win; tie is shared round win. Stop as soon as a team reaches 3; otherwise highest team wins at 300s.
- Scoring/end outcome: Show series winner(s), team round wins and taps. Phone gameplay is an original reaction game, not a cataloged Nintendo 2v2 minigame.
- Common transport, event mapping, disconnection and global exit contract: `../phone-tv-protocol.json`.

| Phase | Proposed deadline seconds | Inputs | Exit conditions |
|---|---:|---|---|
| lobby | 60 | join, ready, leave | all_ready → briefing if Every active human ready; host selected mode.; deadline → briefing if At least one human connected.; deadline → done if No human connected.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| briefing | 20 | ready, leave | all_ready → setup if All active humans ready.; deadline → setup if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| setup | 5 | leave | deadline → play if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| play | 300 | choice, tap, move, aim, fire, interact, ready, leave | objective_complete → resolve if Adapter end condition reached.; deadline → resolve if Timed adapter deadline reached.; host_finish → resolve if Free exploration/selector/repeat activity.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| resolve | 3 | leave | deadline → results if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| results | 30 | choice, ready, leave | retry → setup if Host requests retry with at least one connected human.; finish → done if Host selects Finish.; deadline → done if Unconditional. |
| done | None |  | terminal → done if Session ended; no pending work. |

The terminal done phase accepts no inputs. Host cancellation, disconnection expiry and the 3600-second global cap provide exits from untimed activities. Parent selectors delegate to documented child specs and return their immutable results.

## UNVERIFIED

- length: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- rewards: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- unlocks: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- Exact hidden random weights, all tie/counter exceptions and content-specific timers are not inferred from prose.
- TAG_SELECT: 
