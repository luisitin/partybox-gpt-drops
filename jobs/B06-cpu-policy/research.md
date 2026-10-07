# Jamboree CPU behavior research

The evidence supports difficulty configuration and a few mechanics. Player reports disagree on board intelligence, shops and item use. The code is an original transparent policy over the documented small state, with design probabilities in CONTRACT.md; these numbers are not claimed to reverse engineer Nintendo.

## F01 — difficulty

**verified-fact; confidence high.** CPU difficulty can be configured. Nintendo documents the original Switch game; TechRadar reports the unchanged base game in the Switch 2 edition.

Evidence: [N.setting](https://www.nintendo.com/en-gb/Games/Nintendo-Switch-games/Super-Mario-Party-Jamboree-2591147.html), [T.setting](https://www.techradar.com/gaming/nintendo/super-mario-party-jamboree-plus-jamboree-tv-review).

## F02 — branches

**corroborated-report; confidence low.** Two independent players report CPU avoidance of harmful branch landings. B reports Hard or above; A does not isolate difficulty. These describe different harmful spaces, without proving a universal avoidance rule.

Evidence: [B.branch](https://www.reddit.com/r/MARIOPARTY/comments/1g862fp/ai_in_jamboree_plus_a_surprise/), [A.branch](https://www.reddit.com/r/MARIOPARTY/comments/1h44ohe/list_things_you_noticed_about_the_cpus/).

## F03 — items

**corroborated-report; confidence low.** Two independent players report CPUs retaining usable items instead of using them. A describes Custom Dice, G describes a Golden Pipe. Neither provides a controlled frequency or complete difficulty matrix.

Evidence: [A.custom](https://www.reddit.com/r/MARIOPARTY/comments/1h44ohe/list_things_you_noticed_about_the_cpus/), [G.item](https://gamefaqs.gamespot.com/boards/470862-super-mario-party-jamboree/80844196).

## F04 — difficulty

**corroborated-report; confidence low.** Two independent players describe Hard CPUs as challenging or improved. Subjective reports; no measured win rate or proof of a specific decision algorithm.

Evidence: [B.hard](https://www.reddit.com/r/MARIOPARTY/comments/1g862fp/ai_in_jamboree_plus_a_surprise/), [G.hard](https://gamefaqs.gamespot.com/boards/470862-super-mario-party-jamboree/80844196).

## F05 — minigames

**corroborated-report; confidence low.** Two independent players report that Master can be strong at some minigames without reliable board decisions. A names Luigi Rescue Operation; M is unspecific. No measured reaction times, precision or per-minigame rates.

Evidence: [A.luigi](https://www.reddit.com/r/MARIOPARTY/comments/1h44ohe/list_things_you_noticed_about_the_cpus/), [M.master](https://www.reddit.com/r/MARIOPARTY/comments/1hktj9s/playing_with_cpu/), [M.minigame](https://www.reddit.com/r/MARIOPARTY/comments/1hktj9s/playing_with_cpu/).

## F06 — buddy

**verified-fact; confidence medium.** A Jamboree Buddy can enable purchasing two stars at a star encounter. General mechanic; this does not verify CPU buddy-route selection or purchase frequency. PlaySense quote is Dutch.

Evidence: [P.buddy](https://playsense.nl/600835/review-super-mario-party-jamboree/), [L.buddy](https://www.nintendolife.com/reviews/nintendo-switch/super-mario-party-jamboree).

## F07 — shop

**conflicting-reports; confidence low.** Reports about reserving star money while shopping conflict. B reports Hard+ skipping items near stars. P reports CPU shop spending below the star budget regardless of chosen difficulty. Exact coin thresholds and rates are unresolved.

Evidence: [B.shop](https://www.reddit.com/r/MARIOPARTY/comments/1g862fp/ai_in_jamboree_plus_a_surprise/), [P.shop](https://playsense.nl/600835/review-super-mario-party-jamboree/).

## F08 — difficulty

**unverified; confidence low.** The speedrun category selector lists Easy, Normal, Hard and Master. Selector read directly, but a second independent source displaying all four labels together has not been recovered.

Evidence: [S.names](https://www.speedrun.com/supermariopartyjamboree?h=all-boards-party-rules-1p4c&x=xd1p0j7d-0nwmwkr8.qvvrnzrq-2lge9g78.1w4dk3mq).

## F09 — buddy

**unverified; confidence low.** One player reports Hard+ CPUs using a Buddy at Boo. One anecdote; no second independent corroboration or controlled difficulty comparison.

Evidence: [B.buddy](https://www.reddit.com/r/MARIOPARTY/comments/1g862fp/ai_in_jamboree_plus_a_surprise/).

## G-easy-branches — branches

**unverified; confidence low.** Exact easy CPU branches decision rules or measured probabilities remain unverified. Coverage gap, not an asserted Nintendo rule. Public anecdotes do not supply a controlled numeric model.

Evidence: No qualifying numeric evidence recovered.

## G-easy-items — items

**unverified; confidence low.** Exact easy CPU items decision rules or measured probabilities remain unverified. Coverage gap, not an asserted Nintendo rule. Public anecdotes do not supply a controlled numeric model.

Evidence: No qualifying numeric evidence recovered.

## G-easy-shop — shop

**unverified; confidence low.** Exact easy CPU shop decision rules or measured probabilities remain unverified. Coverage gap, not an asserted Nintendo rule. Public anecdotes do not supply a controlled numeric model.

Evidence: No qualifying numeric evidence recovered.

## G-easy-stars — stars

**unverified; confidence low.** Exact easy CPU stars decision rules or measured probabilities remain unverified. Coverage gap, not an asserted Nintendo rule. Public anecdotes do not supply a controlled numeric model.

Evidence: No qualifying numeric evidence recovered.

## G-easy-buddy — buddy

**unverified; confidence low.** Exact easy CPU buddy decision rules or measured probabilities remain unverified. Coverage gap, not an asserted Nintendo rule. Public anecdotes do not supply a controlled numeric model.

Evidence: No qualifying numeric evidence recovered.

## G-easy-minigames — minigames

**unverified; confidence low.** Exact easy CPU minigames decision rules or measured probabilities remain unverified. Coverage gap, not an asserted Nintendo rule. Public anecdotes do not supply a controlled numeric model.

Evidence: No qualifying numeric evidence recovered.

## G-normal-branches — branches

**unverified; confidence low.** Exact normal CPU branches decision rules or measured probabilities remain unverified. Coverage gap, not an asserted Nintendo rule. Public anecdotes do not supply a controlled numeric model.

Evidence: No qualifying numeric evidence recovered.

## G-normal-items — items

**unverified; confidence low.** Exact normal CPU items decision rules or measured probabilities remain unverified. Coverage gap, not an asserted Nintendo rule. Public anecdotes do not supply a controlled numeric model.

Evidence: No qualifying numeric evidence recovered.

## G-normal-shop — shop

**unverified; confidence low.** Exact normal CPU shop decision rules or measured probabilities remain unverified. Coverage gap, not an asserted Nintendo rule. Public anecdotes do not supply a controlled numeric model.

Evidence: No qualifying numeric evidence recovered.

## G-normal-stars — stars

**unverified; confidence low.** Exact normal CPU stars decision rules or measured probabilities remain unverified. Coverage gap, not an asserted Nintendo rule. Public anecdotes do not supply a controlled numeric model.

Evidence: No qualifying numeric evidence recovered.

## G-normal-buddy — buddy

**unverified; confidence low.** Exact normal CPU buddy decision rules or measured probabilities remain unverified. Coverage gap, not an asserted Nintendo rule. Public anecdotes do not supply a controlled numeric model.

Evidence: No qualifying numeric evidence recovered.

## G-normal-minigames — minigames

**unverified; confidence low.** Exact normal CPU minigames decision rules or measured probabilities remain unverified. Coverage gap, not an asserted Nintendo rule. Public anecdotes do not supply a controlled numeric model.

Evidence: No qualifying numeric evidence recovered.

## G-hard-branches — branches

**unverified; confidence low.** Exact hard CPU branches decision rules or measured probabilities remain unverified. Coverage gap, not an asserted Nintendo rule. Public anecdotes do not supply a controlled numeric model.

Evidence: No qualifying numeric evidence recovered.

## G-hard-items — items

**unverified; confidence low.** Exact hard CPU items decision rules or measured probabilities remain unverified. Coverage gap, not an asserted Nintendo rule. Public anecdotes do not supply a controlled numeric model.

Evidence: No qualifying numeric evidence recovered.

## G-hard-shop — shop

**unverified; confidence low.** Exact hard CPU shop decision rules or measured probabilities remain unverified. Coverage gap, not an asserted Nintendo rule. Public anecdotes do not supply a controlled numeric model.

Evidence: No qualifying numeric evidence recovered.

## G-hard-stars — stars

**unverified; confidence low.** Exact hard CPU stars decision rules or measured probabilities remain unverified. Coverage gap, not an asserted Nintendo rule. Public anecdotes do not supply a controlled numeric model.

Evidence: No qualifying numeric evidence recovered.

## G-hard-buddy — buddy

**unverified; confidence low.** Exact hard CPU buddy decision rules or measured probabilities remain unverified. Coverage gap, not an asserted Nintendo rule. Public anecdotes do not supply a controlled numeric model.

Evidence: No qualifying numeric evidence recovered.

## G-hard-minigames — minigames

**unverified; confidence low.** Exact hard CPU minigames decision rules or measured probabilities remain unverified. Coverage gap, not an asserted Nintendo rule. Public anecdotes do not supply a controlled numeric model.

Evidence: No qualifying numeric evidence recovered.

## G-master-branches — branches

**unverified; confidence low.** Exact master CPU branches decision rules or measured probabilities remain unverified. Coverage gap, not an asserted Nintendo rule. Public anecdotes do not supply a controlled numeric model.

Evidence: No qualifying numeric evidence recovered.

## G-master-items — items

**unverified; confidence low.** Exact master CPU items decision rules or measured probabilities remain unverified. Coverage gap, not an asserted Nintendo rule. Public anecdotes do not supply a controlled numeric model.

Evidence: No qualifying numeric evidence recovered.

## G-master-shop — shop

**unverified; confidence low.** Exact master CPU shop decision rules or measured probabilities remain unverified. Coverage gap, not an asserted Nintendo rule. Public anecdotes do not supply a controlled numeric model.

Evidence: No qualifying numeric evidence recovered.

## G-master-stars — stars

**unverified; confidence low.** Exact master CPU stars decision rules or measured probabilities remain unverified. Coverage gap, not an asserted Nintendo rule. Public anecdotes do not supply a controlled numeric model.

Evidence: No qualifying numeric evidence recovered.

## G-master-buddy — buddy

**unverified; confidence low.** Exact master CPU buddy decision rules or measured probabilities remain unverified. Coverage gap, not an asserted Nintendo rule. Public anecdotes do not supply a controlled numeric model.

Evidence: No qualifying numeric evidence recovered.

## G-master-minigames — minigames

**unverified; confidence low.** Exact master CPU minigames decision rules or measured probabilities remain unverified. Coverage gap, not an asserted Nintendo rule. Public anecdotes do not supply a controlled numeric model.

Evidence: No qualifying numeric evidence recovered.

