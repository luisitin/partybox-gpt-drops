# Frenzy Rules

Classification: **rule_variant**; edition: **tv**; parent: tv-mario-party.

## Reported Nintendo rules

Mode presence has two publisher lineages; individual rule status is separate. The scope of a quote is checked at its locator.

- https://mariopartylegacy.com/games/super-mario-party-jamboree/jamboree-tv/ — “Frenzy” (tv-mario-party subsection).
- https://www.nintendolife.com/guides/super-mario-party-jamboree-nintendo-switch-2-edition-plus-jamboree-tv-all-new-minigames-and-modes — “Frenzy” (tv-mario-party subsection).

### Players

UNVERIFIED: no complete retained Nintendo rule record for this field.

### Length

- `FRENZY_START`: {"turns": 5, "startingCoins": 50, "startingStars": 1, "startingItem": "Double Dice"} — **corroborated; high**. 

### Flow

- `FRENZY_EVENTS`: Begin with two Homestretch events and same-space duels; award one ending bonus category. — **corroborated; high**. 
- `TV_CONTEXT`: Jamboree TV is separate from the original game and offers Party, Tag-Team and Frenzy instead of Pro Rules. — **corroborated; high**. 

### Scoring

UNVERIFIED: no complete retained Nintendo rule record for this field.

### Rewards

- `TV_REWARDS`: TV mode does not save minigame records or Party Points according to the guide. — **single_source; medium**. 

### Unlocks

UNVERIFIED: no complete retained Nintendo rule record for this field.

## Buildable phone + one TV prototype

**Original adaptation proposal.** Timers, physics, input windows, score thresholds and tie rules below are design choices. They are not claims about Nintendo implementation. Source-derived facts appear above with independent status; the proposal remains playable where exact Nintendo details are unavailable.

- Adapter: `frenzy_board_prototype`; phone/bot slots: 4.
- State: coins[4]=50; stars[4]=1; positions[4]=0; turn=1..5.
- Controls: Roll and Buy Star buttons; server gives each player two independent proposal 1..10 dice on every turn.
- Rules: Use the 16-space prototype board; Star at 8 costs 20. Blue/Red landing values +6/-6. Same-space landing runs a 10s reaction duel wagering up to 10 available coins. Five full rounds then award a preselected most-movement bonus. Each roll/menu decision auto-resolves after 15s; passing-Star purchase decisions default to No after 5s.
- Scoring/end outcome: Most Stars, then coins, shared ties. Exact Nintendo event pool, duel values and bonus pool are not inferred.
- Common transport, event mapping, disconnection and global exit contract: `../phone-tv-protocol.json`.

| Phase | Proposed deadline seconds | Inputs | Exit conditions |
|---|---:|---|---|
| lobby | 60 | join, ready, leave | all_ready → briefing if Every active human ready; host selected mode.; deadline → briefing if At least one human connected.; deadline → done if No human connected.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| briefing | 20 | ready, leave | all_ready → setup if All active humans ready.; deadline → setup if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| setup | 5 | leave | deadline → play if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| play | 700 | choice, tap, move, aim, fire, interact, ready, leave | objective_complete → resolve if Adapter end condition reached.; deadline → resolve if Timed adapter deadline reached.; host_finish → resolve if Free exploration/selector/repeat activity.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| resolve | 3 | leave | deadline → results if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| results | 30 | choice, ready, leave | retry → setup if Host requests retry with at least one connected human.; finish → done if Host selects Finish.; deadline → done if Unconditional. |
| done | None |  | terminal → done if Session ended; no pending work. |

The terminal done phase accepts no inputs. Host cancellation, disconnection expiry and the 3600-second global cap provide exits from untimed activities. Parent selectors delegate to documented child specs and return their immutable results.

## UNVERIFIED

- players: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- scoring: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- unlocks: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- Exact hidden random weights, all tie/counter exceptions and content-specific timers are not inferred from prose.
