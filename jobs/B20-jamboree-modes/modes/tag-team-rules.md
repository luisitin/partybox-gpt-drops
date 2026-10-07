# Tag-Team Rules

Classification: **rule_variant**; edition: **tv**; parent: tv-mario-party.

## Reported Nintendo rules

Mode presence has two publisher lineages; individual rule status is separate. The scope of a quote is checked at its locator.

- https://mariopartylegacy.com/games/super-mario-party-jamboree/jamboree-tv/ — “Tag-Team” (tv-mario-party subsection).
- https://www.nintendolife.com/guides/super-mario-party-jamboree-nintendo-switch-2-edition-plus-jamboree-tv-all-new-minigames-and-modes — “Tag-Team” (tv-mario-party subsection).

### Players

UNVERIFIED: no complete retained Nintendo rule record for this field.

### Length

UNVERIFIED: no complete retained Nintendo rule record for this field.

### Flow

- `TV_TAG_ORDER`: Combined opening roll sets team order; teammates alternate during a round. — **single_source; medium**. 
- `TV_TAG_DICE`: Together Dice calls the teammate for a combined two-die move; interactions are doubled. — **corroborated; high**. 
- `TV_CONTEXT`: Jamboree TV is separate from the original game and offers Party, Tag-Team and Frenzy instead of Pro Rules. — **corroborated; high**. 

### Scoring

- `TV_TAG_POOL`: Two teams of two share coins and Stars. — **corroborated; high**. 

### Rewards

- `TV_REWARDS`: TV mode does not save minigame records or Party Points according to the guide. — **single_source; medium**. 

### Unlocks

UNVERIFIED: no complete retained Nintendo rule record for this field.

## Buildable phone + one TV prototype

**Original adaptation proposal.** Timers, physics, input windows, score thresholds and tie rules below are design choices. They are not claims about Nintendo implementation. Source-derived facts appear above with independent status; the proposal remains playable where exact Nintendo details are unavailable.

- Adapter: `team_board_prototype`; phone/bot slots: 4.
- State: teamCoins[2]=20; teamStars[2]=0; positions[4]=0; turn=1..10.
- Controls: Roll, Buy Star, Together buttons; teammate can choose Ready to accept the joint move.
- Rules: Players alternate between teams on the 16-space prototype board. Together once/team/session rolls two proposal 1..10 dice and moves both teammates together, then returns the called teammate to its saved position. Star purchases can buy two for 20 each if affordable. Pool coins/Stars per team. Each roll/menu decision auto-resolves after 15s; passing-Star purchase decisions default to No after 5s.
- Scoring/end outcome: Ten rounds then rank teams by Stars and coins; shared ties. This is original adaptation, including turn length and item availability.
- Common transport, event mapping, disconnection and global exit contract: `../phone-tv-protocol.json`.

| Phase | Proposed deadline seconds | Inputs | Exit conditions |
|---|---:|---|---|
| lobby | 60 | join, ready, leave | all_ready → briefing if Every active human ready; host selected mode.; deadline → briefing if At least one human connected.; deadline → done if No human connected.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| briefing | 20 | ready, leave | all_ready → setup if All active humans ready.; deadline → setup if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| setup | 5 | leave | deadline → play if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| play | 1100 | choice, tap, move, aim, fire, interact, ready, leave | objective_complete → resolve if Adapter end condition reached.; deadline → resolve if Timed adapter deadline reached.; host_finish → resolve if Free exploration/selector/repeat activity.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| resolve | 3 | leave | deadline → results if Unconditional.; cancel → results if Host leaves or global cap 3600s reached.; disconnect_expired → results if Last human absent longer than 30s. |
| results | 30 | choice, ready, leave | retry → setup if Host requests retry with at least one connected human.; finish → done if Host selects Finish.; deadline → done if Unconditional. |
| done | None |  | terminal → done if Session ended; no pending work. |

The terminal done phase accepts no inputs. Host cancellation, disconnection expiry and the 3600-second global cap provide exits from untimed activities. Parent selectors delegate to documented child specs and return their immutable results.

## UNVERIFIED

- players: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- length: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- unlocks: exact full Nintendo behavior or qualifiers have no complete retained rule record.
- Exact hidden random weights, all tie/counter exceptions and content-specific timers are not inferred from prose.
- TV_TAG_ORDER: 
