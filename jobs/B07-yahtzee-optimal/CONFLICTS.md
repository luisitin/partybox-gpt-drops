# Original target and official joker rules

The prompt demands both the official forced joker rules and an empty-card
expected value rounding to254.5896. Verhoeff's rules page permits any open
category for an extra Yahtzee, giving joker fixed scores only when matching
upper is filled. Hasbro40958 instead forces matching upper, then open lower,
then remaining upper0, even when the Yahtzee box has0. These conventions are
different games. A recent independent exact engine reports official254.5877
and published254.5896, but those are research leads, not our computed results.

We will independently solve both rule modes, preserve the official default,
test the published mode against its published target, and record the actual
computed gap. The number will never be returned as a hardcoded production
answer. At this early milestone no full-state result is yet verified.

Primary sources:
https://www.hasbro.com/common/instruct/40958.pdf
https://hasbro-apac-eng.custhelp.com/app/answers/detail/a_id/211
https://www-set.win.tue.nl/~wstomv/misc/yahtzee/rules.html
https://www-set.win.tue.nl/~wstomv/misc/yahtzee/trivia.html
Research lead: https://github.com/jdh8/yahtzee-engine
