import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function inventory(folder, prefix = '') {
  if (!fs.existsSync(folder)) return new Map();
  const rows = new Map();
  for (const entry of fs.readdirSync(folder, {withFileTypes: true})) {
    assert.ok(!entry.isSymbolicLink(), 'Report symlinks are not allowed');
    const relative = path.join(prefix, entry.name), filename = path.join(folder, entry.name);
    if (entry.isDirectory()) for (const [name, bytes] of inventory(filename, relative)) rows.set(name, bytes);
    else { assert.ok(entry.isFile(), 'Reports must be regular files'); rows.set(relative, fs.readFileSync(filename)); }
  }
  return rows;
}
function write(folder, rows) {
  for (const [name, bytes] of rows) {
    const filename = path.join(folder, name);
    fs.mkdirSync(path.dirname(filename), {recursive: true}); fs.writeFileSync(filename, bytes);
  }
}

/** Preserve committed report bytes and archive actual outputs on successful AND failed runs. */
export async function withReportSession(job, execute) {
  const reports = path.join(job, 'reports'), verification = path.join(job, '.verification');
  fs.mkdirSync(verification, {recursive: true});
  const lock = path.join(verification, 'report-session.lock');
  const handle = fs.openSync(lock, 'wx');
  const id = crypto.randomUUID(), archive = path.join(verification, 'full-run-reports', 'invocations', id);
  const latest = path.join(verification, 'full-run-reports', 'latest');
  const original = inventory(reports);
  fs.mkdirSync(archive, {recursive: true});
  const backup = path.join(archive, 'original-inputs'); write(backup, original);
  fs.writeFileSync(handle, JSON.stringify({id, pid: process.pid, archive, original: Object.fromEntries([...original].map(([n,b]) => [n,sha(b)]))})+'\n');
  let result, failure, captured = new Map(), captureFailure;
  try { result = await execute(); }
  catch (error) { failure = error; }
  finally {
    try { captured = inventory(reports); write(path.join(archive, 'outputs'), captured); }
    catch (error) { captureFailure = error; }
    finally {
      write(reports, original);
      for (const [name] of captured) if (!original.has(name)) fs.unlinkSync(path.join(reports, name));
      const restored = inventory(reports);
      assert.deepEqual([...restored.keys()].sort(), [...original.keys()].sort(), 'No generated report remains in the sealed input set');
      for (const [name, bytes] of original) assert.equal(sha(restored.get(name)), sha(bytes), 'Restored '+name);
    }
    const receipt = {passed: !failure && !captureFailure && result?.code === 0, result: result ?? null, originalReports: original.size, capturedReports: captured.size, originalHashes: Object.fromEntries([...original].map(([n,b]) => [n,sha(b)])), outputHashes: Object.fromEntries([...captured].map(([n,b]) => [n,sha(b)])), restoredOriginalHashes: Object.fromEntries([...inventory(reports)].map(([n,b]) => [n,sha(b)])), failure: failure ? String(failure.stack ?? failure) : captureFailure ? String(captureFailure.stack ?? captureFailure) : null};
    fs.writeFileSync(path.join(archive, 'report-session.json'), JSON.stringify(receipt, null, 2)+'\n');
    // Retain all invocations and each earlier export; latest always names this invocation.
    if (fs.existsSync(latest)) fs.renameSync(latest, path.join(verification, 'full-run-reports', 'previous-'+crypto.randomUUID()));
    fs.mkdirSync(latest, {recursive: true}); write(latest, captured);
    fs.writeFileSync(path.join(latest, 'report-session.json'), JSON.stringify(receipt, null, 2)+'\n');
    fs.closeSync(handle); fs.unlinkSync(lock);
  }
  if (failure) throw failure;
  if (captureFailure) throw captureFailure;
  return {result, archive, latest};
}
