# RUN-ALL: the one message that works the whole queue

```
You are working through a queue of 20 small, heavily verified jobs in the public repo https://github.com/luisitin/partybox-gpt-drops. Read README.md and PROMPTS.md there first. Every job prompt in PROMPTS.md is binding, including its tests, checks, delivery and KEEP GOING rules.

Loop forever, until you are out of time or tools:
1. Pick the lowest-numbered job with no job/<ID>-* branch yet (check the branch list). Create its branch immediately to claim it, so other chats skip it.
2. Do the job exactly as its prompt says. Push after every milestone. Keep NEXT.md current.
3. When every check passes, open the pull request, then run the improvement loop from KEEP GOING until the gains are only cosmetic.
4. Go to step 1.

Never stop to ask me anything; log assumptions in ASSUMPTIONS.md. Never end a reply with a question, a plan or an offer. If a job is blocked (source unavailable, tool missing), write BLOCKED.md in its folder with the reason, push, and move on to the next job. If I say "continue", read every NEXT.md on your open branches and resume the most advanced one without asking.
```
