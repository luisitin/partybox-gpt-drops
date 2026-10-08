"""Real offline restoration and fail-closed corruption checks, without live I/O."""
import contextlib, hashlib, importlib.util, io, json, pathlib, shutil, tempfile

JOB = pathlib.Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('b19_acquisition', JOB/'scripts'/'fetch-data.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
original = JOB/'data'/'retained-snapshot'
lock = json.loads((JOB/'data'/'snapshot-manifest.json').read_text())
passed = []

with tempfile.TemporaryDirectory(prefix='b19-snapshot-') as temp:
    root = pathlib.Path(temp)
    module.ROOT = root
    module.OUT = root/'data'/'cache'
    def no_network(url): raise AssertionError('Offline snapshot attempted live network')
    module.fetch = no_network
    def reset():
        shutil.rmtree(root/'data',ignore_errors=True)
        (root/'data').mkdir()
        shutil.copytree(original, root/'data'/'retained-snapshot')
        module.OUT.mkdir()
    def run():
        with contextlib.redirect_stdout(io.StringIO()): module.main()
    def rejected(name, change):
        reset()
        change(root/'data'/'retained-snapshot')
        try: run()
        except (RuntimeError,ValueError,FileNotFoundError):
            assert not (module.OUT/'manifest.json').exists()
            passed.append(name)
        else: raise AssertionError('Corrupt snapshot accepted: '+name)
    reset();run()
    for item in lock['outputs']:
        actual=(module.OUT/item['file']).read_bytes()
        assert len(actual)==item['bytes']
        assert hashlib.sha256(actual).hexdigest()==item['sha256']
        assert len(json.loads(actual))==item['count']
    assert json.loads((module.OUT/'manifest.json').read_text())==lock
    passed.append('clean offline restoration: all32000 original rows and exact byte hashes')
    run();passed.append('verified cache reuse without live network')
    rejected('changed byte rejected before cache writes',lambda p:(p/'words.json').write_bytes((p/'words.json').read_bytes()+b' '))
    rejected('missing corpus rejected',lambda p:(p/'places.json').unlink())
    rejected('missing manifest rejected',lambda p:(p/'manifest.json').unlink())
    def wrong_manifest(p):
        data=json.loads((p/'manifest.json').read_text());data['selection']='changed'
        (p/'manifest.json').write_text(json.dumps(data))
    rejected('unsupported snapshot manifest rejected',wrong_manifest)
    def truncate(p):
        data=json.loads((p/'names.json').read_text());data.pop()
        (p/'names.json').write_text(json.dumps(data))
    rejected('truncated valid JSON corpus rejected',truncate)
    reset();run()
    (module.OUT/'places.json').write_bytes((module.OUT/'places.json').read_bytes()+b' ')
    try: run()
    except RuntimeError: passed.append('corrupt existing cache rejected without replacement')
    else: raise AssertionError('Corrupt cache accepted')
print(json.dumps({'cases':len(passed),'passed':len(passed),'checks':passed,'networkCalls':0}))
