# B13 conflicts

## Taj Mahal construction milestones — excluded from B13-0101

Actual author captures: UNESCO `world-geography-s0001`, content hash
`d8de21945cfc10e8c488106703818610d54774353ac5fe7bf26561257969ab33`,
and Wikipedia `world-geography-s0002`, content hash
`43c7dc2350232308b10a08df2a433b3ffe4c5d31b4e7b3fdd34fe2399d42dc48`.
UNESCO’s short description says built between 1631 and 1648; its synthesis
describes construction starting in 1632. Wikipedia distinguishes commissioning
in 1631. These are potentially different milestones. No construction-start
question is included; B13-0101 asks location and gives supported material/function
context. Timeline wording remains excluded until an independently reviewed
scope resolves it.

## Giant panda diet percentage — excluded from B13-0301

San Diego Zoo states about 99% bamboo; the actual Smithsonian capture does not
contain that percentage. A two-source percentage question would lack the second
quote. B13-0301 instead asks about the directly described pseudo-thumb grip and
wrist-bone anatomy, present in both sources.

## Repeated template diversity — open

The first draft checker flags 2,566 pairs above character similarity 0.8,
principally repeated capital, formation-year and unit questions. Every flag is
retained in `reports/checks.json`; none is silently treated as resolved.

Record each actual disagreement with row ID, source versions, competing claims,
definition/date issue, reviewer reasoning and the concrete revision or exclusion.

## Asian elephant herd leadership — excluded from new animal rows

Actual captured Smithsonian Asian-elephant account (`animals-nature-s0015`)
says: “Unlike African elephants, they do not have a matriarch.” The independently
edited Animal Diversity Web account (`animals-nature-s0016`) says:
“Elephas maximus has matriarchal social organization.” This is a real disagreement,
not a settled fact. No Asian-elephant matriarch question or fun fact is authored.
The selected rows instead use shared anatomical/diet/body-size facts.

## Asian elephant female tusks — excluded from new animal rows

The Smithsonian describes small female tusks called tushes, whereas Animal
Diversity Web broadly says females lack tusks. The scope differs between small
incisor structures and protruding tusks. No categorical “females never have tusks”
question is included; the shared modified-upper-incisor anatomy is selected.

## Recovered music evidence plumbing — actual failed draft retained

The first resume check found23 proposed quote fields absent from the receipt's
raw-HTML path and stale author row hashes. The recovered captures also contain
separate plaintext bodies. The music owner is checking exact normalized-body
matches and repairing receipt paths/hashes while preserving original raw hashes.
The actual failed check is in `reports/music-recovery-failure.json`; it is not
silently relabeled passed. Music is excluded only from this temporary authoring
publication snapshot. Full acceptance prohibits exclusions.
