# Koopathlon

Classification: **mode**; edition: **base**; parent: None.

## Reported Nintendo rules

Mode presence has two publisher lineages; individual rule status is separate. The scope of a quote is checked at its locator.

- https://www.mariowiki.com/Super_Mario_Party_Jamboree — “Koopathlon” (Mode heading or rules description).
- https://mynintendonews.com/2024/10/15/review-super-mario-party-jamboree/ — “Koopathlon” (Mode heading or rules description).

### Players

- `KOOP_PLAYERS`: {"offlineHumans": 1, "totalRacers": 20, "onlineMaximum": 20} — **corroborated; high**. 

### Length

- `KOOP_LAPS`: {"lapChoices": [3, 5, 7]} — **corroborated; high**. 

### Flow

- `KOOP_CADENCE`: Play three coin minigames, then a 20-player Survivathon; repeat until the race finishes. — **corroborated; high**. 

### Scoring

- `KOOP_SPACE`: {"spacesPerCoin": 1, "spacesPerLap": 150} — **single_source; medium**. Only the one-space-per-coin component has two-source support; 150-space lap length has one source.
- `KOOP_WIN`: The first racer to complete the selected lap count wins. — **corroborated; high**. 
- `KOOP_PENALTY`: {"reportedSetbackSpaces": [10, 40]} — **single_source; medium**. Range only; placement-to-penalty mapping remains unverified.

### Rewards

UNVERIFIED: no complete retained Nintendo rule record for this field.

### Unlocks

- `KOOP_ONLINE_UNLOCK`: Clear single-player mode before online play. — **single_source; medium**. 

## Buildable phone + one TV prototype

**Original adaptation proposal.** Timers, physics, input windows, score thresholds and tie rules below are design choices. They are not claims about Nintendo implementation. Source-derived facts appear above with independent status; the proposal remains playable where exact Nintendo details are unavailable.

- Adapter: `coin_race`; phone/bot slots: 20.
- State: progress[20]=0; lapLength=150; lapTarget=3; stageIndex; coinScore[20].
- Controls: Phones tap highlighted 3x3 targets; one server target appears each second, disappears after 750ms. Valid hit +1 coin/progress; invalid hit 0.
- Rules: Three 30s coin stages, then a 15s survive phase in which phones avoid a displayed hazard by choosing left/right each second; a hit subtracts 10 progress, floor zero. Repeat until progress>=450 or session play deadline. Bots use the recorded seed.
- Scoring/end outcome: First to 450 wins; at deadline highest progress wins. Proposal hazards, setbacks and timers are explicit design values, not verified Nintendo minigame timings.
- Common transport, event mapping, disconnection and global exit contract: `../phone-tv-protocol.json`.

| Phase | Proposed deadline seconds | Inputs | Exit conditions |
|---|---:|---|---|
| lobby | 60 | join, ready, leave | all_ready → briefing if Every active human ready; host selected mode.; deadline → briefing if At least one human connected.; deadline → done if No human connected.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| briefing | 20 | ready, leave | all_ready → setup if All active humans ready.; deadline → setup if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| setup | 5 | leave | deadline → play if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| play | 480 | choice, tap, move, aim, fire, interact, ready, leave | objective_complete → resolve if Adapter end condition reached.; deadline → resolve if Timed adapter deadline reached.; host_finish → resolve if Free exploration/selector/repeat activity.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| resolve | 3 | leave | deadline → results if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| results | 30 | choice, ready, leave | retry → setup if Host requests retry with at least one connected human.; finish → done if Host selects Finish.; deadline → done if Unconditional. |
| done | None |  | terminal → done if Session ended; no pending work. |

The terminal done phase accepts no inputs. Host cancellation, disconnection expiry and the 3600-second global cap provide exits from untimed activities. Parent selectors delegate to documented child specs and return their immutable results.

## UNVERIFIED

- rewards: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- Exact hidden random weights, all tie/counter exceptions and content-specific timers are not inferred from prose.
- KOOP_SPACE: Only the one-space-per-coin component has two-source support; 150-space lap length has one source.
- KOOP_PENALTY: Range only; placement-to-penalty mapping remains unverified.
- KOOP_ONLINE_UNLOCK: 
