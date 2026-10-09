from pathlib import Path
import hashlib,json,os,subprocess,time
root=Path('/tmp/gpt-drops-B08-audit-20261009');job=root/'jobs/B08-monopoly-markov';work=root/'.work/20261009-audit'
expected=json.loads((work/'frozen-original-source-files.json').read_text())
def freeze():
 for name,row in expected.items():assert hashlib.sha256((root/name).read_bytes()).hexdigest()==row['sha256'],name
freeze()
target=Path('/workspace/job-B07/jobs/B07-yahtzee-optimal/node_modules')
assert json.loads((target/'typescript/package.json').read_text())['version']=='5.8.3'
assert not (job/'node_modules').exists();os.symlink(target,job/'node_modules',target_is_directory=True)
build=subprocess.run(['node','node_modules/typescript/bin/tsc','-p','tsconfig.json'],cwd=job,capture_output=True,timeout=60)
(work/'original-build.stdout').write_bytes(build.stdout);(work/'original-build.stderr').write_bytes(build.stderr);assert build.returncode==0
assert not (job/'.verification').exists()
started=time.time()
result=subprocess.run(['node','test.mjs','1'],cwd=job,capture_output=True,timeout=60)
(work/'original-standalone-rejection.stdout').write_bytes(result.stdout);(work/'original-standalone-rejection.stderr').write_bytes(result.stderr)
assert result.returncode==1 and b'ENOENT' in result.stderr and b'.verification/exact-seed-1.json' in result.stderr
assert not (job/'.verification').exists()
freeze()
receipt={'reproduced':True,'source':'5f35ba66a2169b4126c8ae312efa8c1635b3f5e3','command':'node test.mjs 1 after a fresh strict build, with no .verification directory','strictBuildExit':build.returncode,'childExit':result.returncode,'expectedFailure':'ENOENT writing .verification/exact-seed-1.json after actual exact checks','stderrSHA256':hashlib.sha256(result.stderr).hexdigest(),'sourceInputsUnchanged':len(expected),'elapsedSeconds':time.time()-started,'completedUTC':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'scope':'Actual original standalone failure. No source edit or workload reduction.'}
(work/'ORIGINAL-STANDALONE-DEFECT.json').write_text(json.dumps(receipt,indent=2)+'\n')
print(json.dumps(receipt))

