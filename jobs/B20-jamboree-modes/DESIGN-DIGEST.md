# B20 design digest for PartyBox

What this is: a ranked read of the Jamboree mode roster for PartyBox, judged on fit with existing building blocks, strength of the evidence and risk. Every idea below is an original take. No name, character or line is carried over. Evidence IDs point to `rules.json`.

## 1. What the roster says about party design

- **Shared pools and teams are a recurring idea.** Tag-Team shares coins and Stars (TV_TAG_POOL, high). Bowser Kaboom Squad revives teammates (KABOOM_REVIVE, high) and ranks the whole team. PartyBox already has `teamResults`, `coopResults` and `TeamBanner`. Lean on them.
- **Length is a visible choice.** Race laps are 3, 5 or 7 (KOOP_LAPS, high). Pro is 12 turns, Frenzy 5 (PRO_LENGTH, FRENZY_START). Putting length on the settings card, with one line of what it changes, matches the drop.
- **Most modes are collections of smaller games.** Minigame Bay is a hub of six submodes. Flight School is a hub of three. Rhythm Kitchen is a hub of four difficulties. Build the short games first. Hubs come later and cost little.
- **Presence is a constraint.** Bowser Live uses camera and microphone minigames (LIVE_FLOW). Carnival Coaster uses mouse aiming (COASTER_RULE). PartyBox's rule is that touch works without permissions (ADR-047). Keep any camera or microphone part optional, or drop it.
- **Scale is a constraint.** The race has 20 racers (KOOP_PLAYERS). PartyBox's room holds 16. Design for 16.

## 2. Ranked mode ideas

Ranked by how much value each adds per unit of build risk.

1. **Buddy allies** (`jamboree-buddies`, 17 rules). The richest record and the best fit for the board game. Recruit an ally by winning a Showdown (BUDDY_RECRUIT, high). Passing the owner transfers the ally (BUDDY_STEAL, high). Lifetime is three turns including the recruit turn (BUDDY_LIFETIME, high). Abilities are many, but each one is a small, testable rule. Start with four allies and grow from there. Original names and art for every ally.
2. **Cannon Crew, a co-op bomb relay** (`bowser-kaboom-squad`). Up to eight players (KABOOM_PLAYERS, high). Carry bombs to a cannon, and a hit bubbles the player until a teammate revives them (KABOOM_REVIVE, high). Round-end minigame performance sets the next round's items (KABOOM_REWARDS, high). Original twist: a fuse ring on the cannon that the team races. Five rounds keeps it short. The 90-second round is single-source, so tune it by playtest.
3. **Frenzy, Pro and Tag-Team as settings variants** (`frenzy-rules`, `pro-rules`, `tag-team-rules`). The cheapest wins in the drop, and all three are corroborated (high for most rows). They are variants of the board game, not new games, so they cost little. They are not an original take on their own, but they make the board game feel bigger.
4. **Coin Stampede, a race with coin minigames** (`koopathlon`). The loop is clear and corroborated (KOOP_CADENCE, high): three coin minigames, then a survival round, repeated until someone finishes. Original twist: the survival round eliminates the last-placed racers and shows it on a shared track. Cap at 16 racers. The 150-space lap and the setback range are single-source, so treat them as design values.
5. **Rhythm kitchen, phone-only** (`rhythm-kitchen`). A group rating (KITCHEN_SCORE, high), four players (KITCHEN_PLAYERS, high), and a natural phone-only minigame: tap on the beat, with the beat from the server clock (`useServerBeat`). Risk: LAN latency and timing feel. Needs a playtest with real phones before anyone calls it done.
6. **Four short ADR-087 minigames from Minigame Bay**: Survival, Boss Rush, Tag Match and Showdown. Each is a small game with a clear loop, and the ADR-087 minigame mode gives them a home. Most of their fields are unverified, so each needs its own rules pass before it is built.
7. **Carnival Coaster, a shared-countdown course** (TV). Five courses (COASTER_COURSES, high), a shared countdown that fails the attempt (COASTER_FAIL, medium), and an aim control that works by touch. A medium-confidence idea. The rank times are single-source, so do not copy them.
8. **Bowser Live, a TV team mode** (TV). Two teams of two (LIVE_TEAMS, high) and a combined score (LIVE_SCORE, high). The tie rule is single-source (LIVE_TIE). Camera and microphone parts conflict with the touch-first presence rule, so make them optional or drop them.
9. **Toad's Item Factory, a co-op puzzle**. Four local players and 30 levels (FACTORY_LEVELS, high). Most fields are unverified. Later.
10. **Flight modes** (Sky Battle, the Taxi, Free Flight). Most of the hub is unverified, and physics needs a quality bar this drop does not supply. Defer.
11. **Party-Planner Trek**. A solo campaign with five boards and a 30-star gate per board (TREK_GATE, high). Not a party game. Low fit. Defer.

## 3. Cross-check with B05

B05 and B20 agree on every shared fact checked: Pro is 12 turns with one announced bonus category, Frenzy is five turns with 50 coins, one Star and a double-dice item, and Tag-Team shares coins and Stars. No conflict between the two drops. Both drops still leave Pro's final-turn alternatives and Frenzy's event pool open.

## 4. What to avoid

- Camera and microphone as required inputs.
- A 20-racer race in a 16-player room.
- Flight physics without a quality bar.
- Copying any timer, threshold or rate limit from the specs. They are design proposals.
- Any mode whose flow is marked unverified in its record, built without a rules pass.

## 5. Questions for the owner

- Pick the first three builds. The digest suggests Buddy allies, Cannon Crew and the settings variants.
- Confirm the race cap (16 racers, bots filling the rest) or ask for a different player ceiling.
- Confirm that camera and microphone modes are optional, or drop them.
