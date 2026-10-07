# Jamboree Buddies

Classification: **mechanic**; edition: **base**; parent: None.

## Reported Nintendo rules

Mode presence has two publisher lineages; individual rule status is separate. The scope of a quote is checked at its locator.

- https://www.mariowiki.com/Super_Mario_Party_Jamboree — “Jamboree Buddies” (Mode heading or rules description).
- https://mynintendonews.com/2024/10/15/review-super-mario-party-jamboree/ — “Jamboree Buddies” (Mode heading or rules description).

### Players

- `BUDDY_PLAYERS`: {"boardParticipants": 4} — **corroborated; high**. A board mechanic, not a standalone mode; the prototype demonstration separately uses four phone slots.

### Length

- `BUDDY_LIFETIME`: {"reportedTurns": 3, "includesRecruitmentTurn": true, "exactDecrementBoundary": null} — **corroborated; high**. Three turns includes recruitment; exact per-player/round transfer decrement boundary is not certified.

### Flow

- `BUDDY_RECRUIT`: Reach an unaffiliated Buddy, play its Showdown, and recruit it by winning; the initiating player has an advantage. — **corroborated; high**. Full recruitment core corroborated by independent Buddy guide; tie-break die details remain one-source.
- `BUDDY_STEAL`: Passing the Buddy's owner transfers the Buddy. — **corroborated; high**. 
- `BUDDY_MARIO`: Mario adds 3–8 movement to the roll. — **corroborated; high**. Trigger interactions and empirical RNG weights remain unverified; a +3–8 range does not prove uniformity.
- `BUDDY_LUIGI`: Luigi can replace a roll with the maximum possible result. — **corroborated; high**. Activation probability and its roll-dependent mapping remain unknown.
- `BUDDY_PEACH`: Peach halves Star purchase prices. — **corroborated; high**. 
- `BUDDY_DAISY`: Daisy halves item purchase prices. — **corroborated; high**. Rounding and special-shop scope are not settled.
- `BUDDY_WARIO`: Wario grants 3–8 coins before the die is hit. — **corroborated; high**. 
- `BUDDY_WALUIGI`: Waluigi steals 3–8 coins from passed opponents; another article reports 3–9. — **conflict; low**. Two same-publisher articles disagree; DualShockers also reports 3–8. No verified RNG weights or same-opponent-repeat rule is inferred.
- `BUDDY_YOSHI`: Yoshi copies an item from a passed opponent. — **corroborated; high**. The wiki's once-per-turn cap and random item choice are only one-source qualifiers.
- `BUDDY_ROSALINA`: Rosalina gives a random cheap item before the die is hit. — **corroborated; high**. Eligible-item list, item weights and exact cheap-price threshold remain one-source.
- `BUDDY_DK`: Donkey Kong offers optional transport to a random board space before the die is hit. — **corroborated; high**. Destination weights and movement-counter interaction are unknown.
- `BUDDY_JUNIOR`: Bowser Jr. sets a Half-Coins Steal Trap on the landing space. — **corroborated; high**. 
- `BUDDY_GALLERIA`: The current wiki says Peach and Daisy do not appear as Buddies on Rainbow Galleria. — **single_source; medium**. Older published Galleria combo advice conflicts with this rule; patch/version scope must be established before treating it as universal.
- `BUDDY_TV_TAG`: Jamboree Buddies do not appear under Jamboree TV Tag Team Rules. — **single_source; medium**. Together Dice supplies similar doubled interactions without a literal Buddy.

### Scoring

- `BUDDY_DOUBLE`: Blue/Red rewards and penalties and shop, Star and Boo interactions can repeat twice. — **corroborated; high**. Conditional opportunities depend on money, stock and board state. Complete counter and harmful-event ordering is not established.

### Rewards

UNVERIFIED: no complete retained Nintendo rule record for this field.

### Unlocks

UNVERIFIED: no complete retained Nintendo rule record for this field.

## Buildable phone + one TV prototype

**Original adaptation proposal.** Timers, physics, input windows, score thresholds and tie rules below are design choices. They are not claims about Nintendo implementation. Source-derived facts appear above with independent status; the proposal remains playable where exact Nintendo details are unavailable.

- Adapter: `buddy_prototype`; phone/bot slots: 4.
- State: reactionScore[4]; owner=null; remainingActivations=3; coins[4]=10.
- Controls: Tap illuminated targets for 30s, then owner chooses Activate; others choose Pass or Hold.
- Rules: Most valid taps recruits the Buddy; initiating player starts +3 proposal points. Three 15s activation windows follow. Owner receives +3 proposal coins and double effect on a Blue reward. A Pass action by an opponent transfers ownership once per window; transfer does not reset remaining activations. Accept one activation and one first-arriving opponent Pass per window; decrement remaining activations once at window close.
- Scoring/end outcome: End after three activations; show each player coins and ownership history. Ten sourced powers are cataloged as reported mechanics; this demonstration chooses a fixed coin buff and does not infer their random weights.
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

- rewards: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- unlocks: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- Exact hidden random weights, all tie/counter exceptions and content-specific timers are not inferred from prose.
- BUDDY_WALUIGI: Two same-publisher articles disagree; DualShockers also reports 3–8. No verified RNG weights or same-opponent-repeat rule is inferred.
- BUDDY_GALLERIA: Older published Galleria combo advice conflicts with this rule; patch/version scope must be established before treating it as universal.
- BUDDY_TV_TAG: Together Dice supplies similar doubled interactions without a literal Buddy.
