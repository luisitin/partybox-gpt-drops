from pathlib import Path
import hashlib
repo=Path(__file__).resolve().parents[2]
out=Path(__file__).resolve().parent
raw=(repo/'jobs/B19-name-filter/nameFilter.ts').read_text()
assert hashlib.sha256(raw.encode()).hexdigest()=='7817489fc1d0908a87914223a84b31c15ea7e13b3555cb4238594751616f163d'
added,new=(out/'scanner-source.txt').read_text().split('\n\n',1)
anchor="const ASCII_FOLD = Uint8Array.from({length: 128}, (_, code) => lower(String.fromCharCode(code)).charCodeAt(0) - 97);\n"
assert raw.count(anchor)==1
candidate=raw.replace(anchor,anchor+added+'\n')
a=candidate.index('  if (!simple && !WORD.test(plain)) {')
z=candidate.index('  if (simpleMatch || blocked(text))',a)
candidate=candidate[:a]+new+candidate[z:]
assert hashlib.sha256(candidate.encode()).hexdigest()=='2a1daea82c86b4d9be909596d0c71d5f7e7fbc9cc724cd2c7939cacd430e97cf'
if (out/'candidate-nameFilter.ts').exists():assert (out/'candidate-nameFilter.ts').read_text()==candidate
else:(out/'candidate-nameFilter.ts').write_text(candidate)
if (out/'baseline-nameFilter.ts').exists():assert (out/'baseline-nameFilter.ts').read_text()==raw
else:(out/'baseline-nameFilter.ts').write_text(raw)
print('Exact private ASCII-mapping candidate reconstructed without changing production.')
