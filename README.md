# partybox-gpt-drops

Public drop box for small, heavily verified jobs done by ChatGPT for a private party-game project.
Nothing here is secret; nothing here is wired to anything automatically. A maintainer reviews every drop by hand.

## Rules for every job
- Work on a branch named after the job (`b01-dice-odds`), put everything in `jobs/<JOB-ID>/`, open a pull request to `main`. Never push to `main`, never touch another job's folder.
- Commit the files themselves (no zip needed). Any single file over 30 MB: split it into parts plus a join note.
- Every job folder has `VERIFY.md` (every test: name, case count, passed, seed, exact command), `SHA256SUMS.txt` and, for research, `CONFLICTS.md`.
- Anything not verified goes under an `UNVERIFIED` heading in VERIFY.md. Never guess.
- No GitHub Actions or workflows: verification runs in your own sandbox and is reported in VERIFY.md.
