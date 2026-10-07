# Boss Rush

Classification: **submode**; edition: **base**; parent: minigame-bay.

## Reported Nintendo rules

Mode presence has two publisher lineages; individual rule status is separate. The scope of a quote is checked at its locator.

- https://www.mariowiki.com/Minigame_Bay — “Boss Rush” (minigame-bay subsection).
- https://www.thegamer.com/super-mario-party-jamboree-every-island-best-game-mode/ — “Boss Rush” (minigame-bay subsection).

### Players

- `BAY_PLAYERS`: {"localMaximum": 4, "onlineMaximum": 4, "submodeExceptions": true} — **corroborated; high**. 

### Length

UNVERIFIED: no complete retained Nintendo rule record for this field.

### Flow

- `BOSS_RULE`: Four players play all five Boss minigames consecutively; placement points select the MVP. — **single_source; medium**. The independent article confirms activity presence/cooperative bosses; detailed point scoring is one source.

### Scoring

UNVERIFIED: no complete retained Nintendo rule record for this field.

### Rewards

UNVERIFIED: no complete retained Nintendo rule record for this field.

### Unlocks

- `BOSS_UNLOCK`: {"achievements": 30, "rank": "Platinum"} — **single_source; medium**. 

## Buildable phone + one TV prototype

**Original adaptation proposal.** Timers, physics, input windows, score thresholds and tie rules below are design choices. They are not claims about Nintendo implementation. Source-derived facts appear above with independent status; the proposal remains playable where exact Nintendo details are unavailable.

- Adapter: `cooperative_boss_series`; phone/bot slots: 4.
- State: bossIndex=1..5; health=40; individualHits[4]=0; placementPoints[4]=0.
- Controls: Tap the moving target, one valid hit/player per 250ms.
- Rules: Play five bosses, each with a 40s cap. A valid hit removes one health. Order individual hit totals and award proposal placement points 4/3/2/1, sharing tied rank points. Reset health/hits between bosses.
- Scoring/end outcome: Most placement points is MVP; display group boss-clear count. Exact Nintendo damage/placement score table is not inferred.
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
- scoring: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- rewards: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- Exact hidden random weights, all tie/counter exceptions and content-specific timers are not inferred from prose.
- BOSS_RULE: The independent article confirms activity presence/cooperative bosses; detailed point scoring is one source.
- BOSS_UNLOCK: 
