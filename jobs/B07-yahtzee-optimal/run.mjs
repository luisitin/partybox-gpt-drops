import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {withReportSession} from './report-session.mjs';

const job = path.dirname(fileURLToPath(import.meta.url));
process.chdir(job);
try {
  const session = await withReportSession(job, () => new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['full-checks.mjs'], {cwd: job, stdio: 'inherit', detached: true});
    const stop = signal => { if (!child.pid) return; try { process.kill(-child.pid, signal); } catch (error) { if (error.code !== 'ESRCH') throw error; } };
    const term = () => stop('SIGTERM'), interrupt = () => stop('SIGINT');
    process.once('SIGTERM', term); process.once('SIGINT', interrupt);
    child.once('error', reject);
    child.once('close', (code, signal) => {
      process.removeListener('SIGTERM', term); process.removeListener('SIGINT', interrupt);
      resolve({code: code ?? (signal === 'SIGINT' ? 130 : 143), signal});
    });
  }));
  // Validate EVERY delivery checksum again after restoring sealed historical reports.
  const {createHash} = await import('node:crypto');
  for (const line of fs.readFileSync('SHA256SUMS.txt', 'utf8').trim().split('\n')) {
    const [digest, name] = line.split('  ');
    if (createHash('sha256').update(fs.readFileSync(path.resolve('../..', name))).digest('hex') !== digest) throw new Error('Final delivery manifest '+name);
  }
  console.log(JSON.stringify({reportRestoration: 'PASS', reports: path.relative(job, session.latest), result: session.result}));
  process.exitCode = session.result.code;
} catch (error) { console.error(error); process.exitCode = 1; }
