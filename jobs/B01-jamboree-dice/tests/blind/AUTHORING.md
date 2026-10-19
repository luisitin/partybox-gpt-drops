# Blind B01 exact odds reference

The author received the original B01 prompt, repository README delivery rules,
the public function contract in plain text from the root agent, and dice.json.
The author read no B01 production source, reference source, test algorithms, odds
tables, or prior verification before writing and sealing this reference.

The source lives initially in /workspace/blind-b01. It imports no implementation
or arithmetic helper. It enumerates ordered face-index tuples by decoding a
mixed-radix ordinal, records integer event multiplicities, and reduces all output
fractions with its own BigInt Euclidean algorithm. Public roll evaluation checks
the provided contract. The model assumes independent, uniformly likely faces;
game RNG behavior and the empirical truth of cited bonus rules are research
questions outside this arithmetic reference.

Self-checks use hand-computed small sample spaces, standard fair-d10 identities,
explicit bonus-prefix and payday fixtures, unknown coins, and invalid input
fixtures. They run before source sealing. SHA256SUMS.txt records these authored
files and actual self-check results before production access is permitted.

Coin bonus inputs are interpreted as nonnegative safe integers. The public
contract supplies a zero-or-at-least-two matching prefix, an integer offset from
zero through five, and blocks containing distinct integer faces one through ten.
This reference does not estimate Luigi activation odds or Mario face weights.
