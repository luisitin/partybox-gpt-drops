"""Exhaustively check both wording directions for every original candidate pair."""
import argparse
import difflib
import hashlib
import json
import multiprocessing
import re
import time
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]

def initialize(rows, full, content, selected, resolutions):
    global ROWS, FULL, CONTENT, SELECTED, RESOLUTIONS, FULL_MATCHERS, CONTENT_MATCHERS
    ROWS, FULL, CONTENT, SELECTED, RESOLUTIONS = rows, full, content, selected, resolutions
    # Only fixed right-hand string indexes are cached. Every pair keeps exact
    # SequenceMatcher arithmetic; set_seq1 invalidates left-dependent caches.
    FULL_MATCHERS = [difflib.SequenceMatcher(None, '', text, autojunk=False) for text in full]
    CONTENT_MATCHERS = [difflib.SequenceMatcher(None, '', text, autojunk=False) for text in content]

def segment_scan(bounds):
    start, end = bounds
    flags = []
    pairs = 0
    for i in range(start, end):
        for j in range(i + 1, len(ROWS)):
            pairs += 1
            xf = FULL_MATCHERS[j]; xf.set_seq1(FULL[i])
            yf = CONTENT_MATCHERS[j]; yf.set_seq1(CONTENT[i])
            # quick_ratio is a symmetric upper bound on both directional ratios.
            # <=0.75 therefore rules out a flag without dropping either direction.
            full_ratio = content_ratio = 0
            if xf.quick_ratio() > .75:
                xr = FULL_MATCHERS[i]; xr.set_seq1(FULL[j])
                full_ratio = max(xf.ratio(), xr.ratio())
            if yf.quick_ratio() > .75:
                yr = CONTENT_MATCHERS[i]; yr.set_seq1(CONTENT[j])
                content_ratio = max(yf.ratio(), yr.ratio())
            if max(full_ratio, content_ratio) <= .75:
                continue
            # Report actual values for both text forms even if only one flagged.
            xr = FULL_MATCHERS[i]; xr.set_seq1(FULL[j])
            yr = CONTENT_MATCHERS[i]; yr.set_seq1(CONTENT[j])
            full_ratio = max(xf.ratio(), xr.ratio())
            content_ratio = max(yf.ratio(), yr.ratio())
            ids = sorted([ROWS[i]['id'], ROWS[j]['id']])
            both = all(k in SELECTED for k in ids)
            if both:
                resolution = RESOLUTIONS.get(tuple(ids))
                assert resolution and resolution['action'] == 'keep-distinct', 'unresolved selected pair: ' + str(ids)
                reason = resolution['reason']
            else:
                reason = 'At least one original candidate is excluded from the final pack; original wording and grades remain preserved.'
            flags.append({'ids': ids, 'fullTextRatio': full_ratio, 'contentRatio': content_ratio,
                          'resolution': 'keep-distinct' if both else 'outside-final-selection', 'reason': reason})
    expected = sum(len(ROWS) - 1 - i for i in range(start, end))
    assert pairs == expected, 'segment coverage incomplete'
    return {'leftStart': start, 'leftEndExclusive': end, 'pairComparisons': pairs, 'flags': flags}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    rows = json.loads((ROOT / 'candidates.json').read_text())
    selected = {r['id'] for r in json.loads((ROOT / 'prompts.json').read_text())}
    resolutions = {tuple(r['ids']): r for r in json.loads((ROOT / 'similarity-resolutions.json').read_text())}
    normalize = lambda text: re.sub(r'[^a-z0-9]+', ' ', text.lower()).strip()
    full = [normalize(r['text']) for r in rows]
    content = [s.removeprefix('who s most likely to ') for s in full]
    bounds = [(i, min(i + 250, len(rows))) for i in range(0, len(rows), 250)]
    assert bounds[0][0] == 0 and bounds[-1][1] == len(rows) and all(a[1] == b[0] for a,b in zip(bounds, bounds[1:])), 'segmentation has a gap'
    started = time.monotonic()
    segments = []
    # Two standard-library workers keep the complete scan inside one CI job.
    with multiprocessing.Pool(2, initializer=initialize, initargs=(rows, full, content, selected, resolutions)) as pool:
        for segment in pool.imap(segment_scan, bounds):
            segments.append(segment)
            print(json.dumps({'completedLeftStart': segment['leftStart'], 'completedLeftEndExclusive': segment['leftEndExclusive'],
                              'pairComparisons': segment['pairComparisons'], 'flaggedPairs': len(segment['flags']),
                              'elapsedSeconds': round(time.monotonic() - started, 3)}), flush=True)
    assert sum(s['pairComparisons'] for s in segments) == len(rows) * (len(rows) - 1) // 2
    flags = sorted([f for s in segments for f in s['flags']], key=lambda f:f['ids'])
    initial = json.loads((ROOT / 'curation-iterations/01/full-pool-single-direction-scan.json').read_text())
    assert initial['candidateSha256'] == hashlib.sha256((ROOT / 'candidates.json').read_bytes()).hexdigest()
    assert {tuple(f['ids']) for f in initial['flags']} <= {tuple(f['ids']) for f in flags}, 'bidirectional scan lost an original flag'
    result = {'candidateSha256': hashlib.sha256((ROOT / 'candidates.json').read_bytes()).hexdigest(),
              'selectedSha256': hashlib.sha256((ROOT / 'prompts.json').read_bytes()).hexdigest(),
              'candidateCases': len(rows), 'pairComparisons': len(rows) * (len(rows) - 1) // 2,
              'textForms': 2, 'wordingDirectionsPerPair': 2, 'workerCount': 2,
              'threshold': .75, 'strictlyGreater': True,
              'normalization': 'lowercase ASCII alphanumeric tokens; full wording and wording without most-likely prefix; maximum SequenceMatcher ratio over both argument orders',
              'coverageSegments': [{k:v for k,v in s.items() if k != 'flags'} for s in segments],
              'flaggedPairs': len(flags), 'selectedFlaggedPairs': sum(f['resolution'] == 'keep-distinct' for f in flags),
              'originalSingleDirectionFlagsRetained': len(initial['flags']),
              'elapsedSeconds': time.monotonic() - started, 'flags': flags}
    if args.check:
        expected = json.loads((ROOT / 'results/pool-similarity.json').read_text())
        assert {k:v for k,v in result.items() if k != 'elapsedSeconds'} == {k:v for k,v in expected.items() if k != 'elapsedSeconds'}, 'pool scan differs from preserved release evidence'
        (ROOT / '.work').mkdir(exist_ok=True)
        (ROOT / '.work/pool-similarity-rerun.json').write_text(json.dumps(result, indent=2) + '\n')
    else:
        (ROOT / 'results/pool-similarity.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({k:v for k,v in result.items() if k != 'flags'}, indent=2))

if __name__ == '__main__':
    main()
