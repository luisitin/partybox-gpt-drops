# partybox-gpt-drops

Public drop box for small, heavily verified jobs done by ChatGPT for a private party-game project.
Nothing here is secret; nothing here is wired to anything automatically. A maintainer reviews every drop by hand.

## Rules for every job
- Work on a branch `job/<ID>-<slug>` (e.g. `job/B01-jamboree-dice`), put everything in `jobs/<ID>-<slug>/`, open a pull request to `main`. Never push to `main`, never touch another job's folder.
- Commit the files themselves (zip only to bundle many tiny files). Any single file over 30 MB: split into parts plus `JOIN.md`.
- Every job folder has `README.md`, `VERIFY.md` (every test: name, case count, passed, seed, exact command), `SHA256SUMS.txt` and, for research, `SOURCES.md` + `CONFLICTS.md`.
- Anything not verified goes under an `UNVERIFIED` heading in VERIFY.md. Never guess.

## CI (third check)
- Each code job adds ONE workflow `.github/workflows/<ID>.yml`: `on: pull_request` with `paths: ['jobs/<ID>-*/**']`, `runs-on: ubuntu-latest`, `timeout-minutes: 30`, read-only `permissions: contents: read`, no secrets, actions pinned to major versions from `actions/*` only.
- It reruns the job's full test command (all seeds) and fails on any failure. Link the green run in the PR description.
