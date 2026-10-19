# Assumptions

- The official English Classic 2019 end-of-turn rule profile is used, with rack-only opening at 30 points and full rearrangement on later turns.
- The objective is represented new rack value, then rack tile count; the rack-joker penalty is reported separately.
- Opening preserves each old meld's kind, physical IDs and represented faces; meld-list and group-tile order may change.
- Public IDs are nonempty strings, including whitespace-only strings. Ordinary JSON extra fields are ignored.
- Independent large answers may be reused between the two suites sharing the same freshly generated corpus. Input/reference/generator hashes must match, every witness must be revalidated, and every production timing call remains fresh.
- The module validates end-of-turn states. It does not certify intermediate manipulation sequences, draw/pool actions or timers.
