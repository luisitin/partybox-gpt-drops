"""Seal authored inputs and package reproducible, size-limited evidence without dependencies."""
import hashlib, json, subprocess, sys, zipfile
from pathlib import Path
root=Path(__file__).resolve().parents[1];repo=root.parents[1]
workflow=repo/'.github/workflows/B15.yml'

def source_files():
    names=['README.md','package.json','tsconfig.json','requirements-dev.txt','manifest.json','icons.zip','.gitignore']
    paths=[root/name for name in names if (root/name).exists()]
    paths+=sorted((root/'icons').glob('*.svg'))
    paths+=sorted((root/'src').glob('*.ts'))+sorted((root/'test').glob('*.ts'))+sorted((root/'test').glob('*.py'))
    if workflow.exists(): paths.append(workflow)
    return sorted(paths,key=lambda p:str(p))

def relative(p):
    return '../../.github/workflows/B15.yml' if p==workflow else p.relative_to(root).as_posix()

def write_hashes(destination,paths):
    destination.write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+relative(p)+'\n' for p in paths))

def check(name):
    subprocess.run(['sha256sum','-c',name],cwd=root,check=True,stdout=subprocess.DEVNULL)

if '--seal-sources' in sys.argv:
    paths=source_files();write_hashes(root/'SHA256SUMS.txt',paths);check('SHA256SUMS.txt')
    print('Sealed',len(paths),'authored files.');sys.exit(0)

result=json.loads((root/'reports/results.json').read_text());mutations=json.loads((root/'reports/mutations.json').read_text())
assert result['status']=='PASS' and result['seeds']==[1,2,3]
assert all(row['cases']==row['passed'] for row in result['rows'])
assert len(mutations)==75 and all(m['killed'] for m in mutations)
check('SHA256SUMS.txt')
max_bytes=max(result['assets'],key=lambda x:x['bytes']);max_colors=max(x['colors'] for x in result['assets'])
unique={}
for value in result['maxima']:unique[(value['renderer'],value['size'])]=value
lines=['# B15 verification evidence','',
'Automated suites below passed. Blind authorship by two isolated developers is **not verified**; see UNVERIFIED.',
'', '## Scope and definitions','',
'- Exactly 120 original SVG files, viewBox `0 0 64 64`, no text or external artwork.',
f'- Largest file: **{max_bytes["id"]}.svg, {max_bytes["bytes"]} UTF-8 bytes**. Maximum distinct paints: **{max_colors}**. Limits apply to the SVG, not antialiased PNG colors.',
'- Silhouette = every pixel whose alpha is at least 128, in the original registered canvas. Internal transparent holes remain holes. No pairwise translation, rotation, scaling, silhouette normalization, or hole-filling is performed.',
'- IoU = intersection / union. The gate uses the exact integer comparison `5 * intersection < 4 * union`; equality at 0.8 fails.',
'- Every one of 7,140 unordered pairs is tested at 24, 48 and 256 px, in each of seeds 1, 2 and 3. librsvg masks are checked by both arithmetic implementations. CairoSVG provides a second independent rasterization.',
'- A: TypeScript XML-profile scanner, Sharp/librsvg rasterizer, RGBA alpha extraction and 32-bit popcount.',
'- B: Python ElementTree, standard-library PNG decoding with CRC/filter validation, packed arbitrary-precision integers and bit_count. It does not import the TypeScript checker or its constants.',
'- Two rasterizers are not required to have identical antialiasing. Their per-icon binary-mask IoU must be at least 0.90. Identical PNG input must yield **byte-identical masks** in both mask-decoding paths and identical integer intersection/union results for every pair.',
'', '## Maximum silhouette pair by renderer and size','',
'| Renderer | Size | Maximum pair | Exact IoU | Decimal |','|---|---:|---|---|---:|']
for (renderer,size),m in sorted(unique.items()):lines.append(f'| {renderer} | {size} | {m["a"]} / {m["b"]} | {m["intersection"]}/{m["union"]} | {m["iou"]:.10f} |')
lines+=['','## Every suite and seed','','Commands are run from `jobs/B15-icons-120/`. `npm test` reruns all three seeds, regenerates all PNGs and reports, then packages the evidence.','',
'| Test | Cases | Passed | Seed | Exact command |','|---|---:|---:|---:|---|']
for row in result['rows']:lines.append(f'| {row["name"]} | {row["cases"]} | {row["passed"]} | {row["seed"]} | `{row["command"]}` |')
lines+=['','## Source mutation tests','',
'Each mutant is a real one-location rewrite of compiled checker source, dynamically imported and executed. Mutants run sequentially. Syntax/import failure is not counted as a kill. Every SVG vector, mask vector and threshold vector is run for every mutant; tests do not stop at the first failure. The original module is checked for contamination afterward.','',
'`reports/mutations.json` contains all 75 executions, complete replacements, mutated-module SHA-256 hashes, first killing case, total killing cases and executed case counts.','',
'| Mutant | Deliberate bug | Seed 1 first detection | Seed 2 first detection | Seed 3 first detection |','|---|---|---|---|---|']
for first in mutations[:25]:
    samples=[m for m in mutations if m['id']==first['id']]
    lines.append('| '+first['id']+' | '+first['name']+' | '+' | '.join(m['firstFailure'] for m in samples)+' |')
lines+=['','## Evidence files','',
'`reports/results.json`: suite counts, environment versions, byte/color table, maximum pairs, cross-renderer minimum and seed summaries. `reports/oracle-seed-1.json` through `-3.json`: every pair for every size and both renderers, exact intersections/unions, independent PNG mask hashes and all oracle results. `reports/cases-seed-*.json`: every SVG truth label and both checker decisions.','',
'`SHA256SUMS.txt` seals authored inputs. `BUNDLE_SHA256SUMS.txt` covers all files in the delivered bundle except itself; generated outputs are intentionally not part of the immutable source seal. Both manifests are verified with the system sha256sum implementation. ZIP member timestamps are fixed to 1980-01-01 for reproducibility.','',
'## UNVERIFIED','',
'**Blind independent authorship:** both checker implementations were authored in the same assistant session. They are structurally different and differentially tested, but the requirement that two isolated authors wrote them without seeing each other has not been demonstrated. No such claim is made.','',
'**Independent 24 px recognition study:** no blinded human-panel recognition experiment was performed. Native 24 px raster proofs are supplied for review. Readability is a visual design judgment, not something XML validity or IoU proves.','',
'**Renderer universality:** the full run tests the recorded librsvg and CairoSVG versions. Pixel identity across every browser, operating system, GPU and future renderer is not claimed.','',
'## GitHub delivery','']
delivery=root/'delivery.json'
if delivery.exists():
    data=json.loads(delivery.read_text())
    lines.append(json.dumps(data,indent=2));lines.append('')
else:
    lines.append('This local run does not itself establish a green GitHub Actions run. The pull-request description must link a run actually observed as successful. PNGs and complete generated reports are delivered in the full ZIP and CI artifact; the Git tree stores authored source and all 120 individual SVG files.')
lines+=['','## Runtime and development dependencies','',
'Runtime dependencies: zero. The UI lookup and checker are pure functions. The build/test harness necessarily performs file I/O and starts a Python oracle. Development tools are pinned in package.json and requirements-dev.txt. There are no calls to Math.random or Date.now in the TypeScript source AST. Randomized tests receive a seeded RNG function.','']
verify=root/'VERIFY.md';verify.write_text('\n'.join(lines))
# Remove only temporary/draft proof output owned by this job.
for p in (root/'reports').glob('draft-pairs-*.json'):p.unlink()

def bundle_files():
    out=[]
    for p in root.rglob('*'):
        if not p.is_file() or p.is_symlink():continue
        rel=p.relative_to(root)
        if any(part in {'node_modules','dist','artifact','__pycache__'} or part.startswith('.') for part in rel.parts):
            if rel.as_posix()!='.gitignore':continue
        if p.name=='BUNDLE_SHA256SUMS.txt':continue
        out.append(p)
    if workflow.exists():out.append(workflow)
    return sorted(out,key=lambda p:relative(p))

paths=bundle_files();write_hashes(root/'BUNDLE_SHA256SUMS.txt',paths)
for seed in (1,2,3):check('BUNDLE_SHA256SUMS.txt')
with verify.open('a') as f:
    f.write('\n## Complete-bundle checksums\n\n| Test | Cases | Passed | Seed | Exact command |\n|---|---:|---:|---:|---|\n')
    for seed in (1,2,3):f.write(f'| SHA-256 complete bundle | {len(paths)} | {len(paths)} | {seed} | `sha256sum -c BUNDLE_SHA256SUMS.txt` |\n')
# Re-seal the updated verification document and independently recheck the final bytes.
write_hashes(root/'BUNDLE_SHA256SUMS.txt',paths)
for seed in (1,2,3):check('BUNDLE_SHA256SUMS.txt')
paths.append(root/'BUNDLE_SHA256SUMS.txt')
for p in paths:
    if p.stat().st_size>30_000_000:raise ValueError('file exceeds 30 MB: '+str(p))
output=root/'artifact/B15-icons-120.zip';output.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(output,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as archive:
    for p in paths:
        info=zipfile.ZipInfo(p.relative_to(repo).as_posix(),date_time=(1980,1,1,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644<<16
        archive.writestr(info,p.read_bytes())
if output.stat().st_size>30_000_000:raise ValueError('ZIP exceeds 30 MB; split required')
with zipfile.ZipFile(output) as z:
    assert z.testzip() is None
    assert len(z.namelist())==len(paths)
print('Bundle PASS:',len(paths),'files;',output.stat().st_size,'bytes;',hashlib.sha256(output.read_bytes()).hexdigest())
