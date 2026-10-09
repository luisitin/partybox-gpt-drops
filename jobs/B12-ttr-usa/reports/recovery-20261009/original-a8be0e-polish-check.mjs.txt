// Polish-pass checks for B12 (2026-10-08). Run from the job folder after `npm run build`:
//   node tools/polish-check.mjs spot                  data cross-check against the raw source files
//   node tools/polish-check.mjs budget                longest-trail cost under the real 45-train budget
//   node --experimental-strip-types tools/polish-check.mjs compare --owner <longest-trail.ts>
//                                                     differential + timing against another longestTrail
//   node tools/polish-check.mjs map                   writes reports/polish-2026-10-08/map-check.svg
// Read-only apart from `map`. Each check prints one JSON line per result and exits 1 on any failure.
// Not part of `npm test`; the committed outputs live in reports/polish-2026-10-08/.
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {dirname, resolve} from 'node:path';

const job = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(job, path), 'utf8');
const csvRows = (path) => read(path).replace(/^﻿/, '').trim().split(/\r?\n/).slice(1).map((line) => line.split(','));
const usa = JSON.parse(read('usa.json'));
// Documented in ASSUMPTIONS.md: source spellings normalised to the canonical names used by usa.json.
const ALIAS = {'Sault St. Marie': 'Sault Ste. Marie', 'St. Louis': 'Saint Louis', 'Montréal': 'Montreal', 'Washington DC': 'Washington'};
const canon = (name) => ALIAS[name.trim()] ?? name.trim();
// Rob217 colour letters (X = gray / any).
const ROB_COLOUR = {X: 'gray', Y: 'yellow', B: 'blue', G: 'green', P: 'pink', O: 'orange', W: 'white', K: 'black', R: 'red'};
const out = (value) => console.log(JSON.stringify(value));
const sameMultiset = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
const dist = () => import(pathToFileURL(resolve(job, 'dist/ttr.js')).href);
// Deterministic seeded generator from ttr.ts, so every run samples the same sets.
const seeded = async () => (await dist()).seeded;

async function spot() {
  let failed = 0;
  const check = (name, passed, detail) => {
    if (!passed) failed++;
    out({check: name, passed, ...detail});
  };
  const robRoutes = csvRows('sources/rob-routes.csv').map(([a, b, length, colour]) => [canon(a), canon(b)].sort().join('|') + '|' + length + '|' + ROB_COLOUR[colour.trim()]);
  const myRoutes = usa.routes.map((r) => [canon(r.a), canon(r.b)].sort().join('|') + '|' + r.length + '|' + r.color);
  check('routes-endpoints-length-colour-equal-rob217', sameMultiset(robRoutes, myRoutes), {rows: myRoutes.length});
  const robCities = Object.keys(JSON.parse(read('sources/rob-cities.json'))).map(canon).sort();
  check('cities-equal-rob217', JSON.stringify(robCities) === JSON.stringify(usa.cities.map((c) => c.name).sort()), {cities: robCities.length});
  const robTickets = csvRows('sources/rob-tickets.csv').map(([a, b, points]) => [canon(a), canon(b)].sort().join('|') + '|' + points);
  const myTickets = usa.baseTickets.map((t) => [canon(t.a), canon(t.b)].sort().join('|') + '|' + t.points);
  check('base-tickets-equal-rob217', sameMultiset(robTickets, myTickets), {tickets: myTickets.length});
  const agnias = JSON.parse(read('sources/agnias-usa.tickets.json')).map((t) => t.cities.map(canon).sort().join('|') + '|' + t.points);
  check('base-tickets-equal-agnias', sameMultiset(agnias, myTickets), {tickets: agnias.length});
  const groups = new Map();
  for (const r of usa.routes) groups.set([r.a, r.b].sort().join('|'), (groups.get([r.a, r.b].sort().join('|')) ?? 0) + 1);
  const doubles = [...groups.values()].filter((n) => n === 2).length;
  const spaces = usa.routes.reduce((n, r) => n + r.length, 0);
  const cards = usa.cardCounts.reduce((n, c) => n + c.count, 0);
  check('counts', usa.cities.length === 36 && usa.routes.length === 100 && groups.size === 78 && doubles === 22 && spaces === 309 && cards === 110 && usa.baseTickets.length === 30 && usa.usa1910Tickets.length === 69,
    {cities: usa.cities.length, tracks: usa.routes.length, adjacencyGroups: groups.size, doubleGroups: doubles, trainSpaces: spaces, trainCards: cards, baseTickets: usa.baseTickets.length, usa1910Tickets: usa.usa1910Tickets.length});
  check('route-points-table', JSON.stringify(usa.routePoints.map((r) => [r.length, r.points])) === JSON.stringify([[1, 1], [2, 2], [3, 4], [4, 7], [5, 10], [6, 15]]), {});
  process.exitCode = failed === 0 ? 0 : 1;
}

async function budget() {
  const {longestTrail} = await dist();
  const seed = await seeded();
  const routes = usa.routes.map((r) => ({id: r.id, a: r.a, b: r.b, length: r.length, color: r.color}));
  const sorted = [...usa.routes].sort((x, y) => x.length - y.length);
  let total = 0, kmax = 0;
  for (const r of sorted) { if (total + r.length > 45) break; total += r.length; kmax++; }
  const hist = {};
  for (const r of usa.routes) hist[r.length] = (hist[r.length] ?? 0) + 1;
  out({check: 'budget-limit', trainsPerPlayer: 45, lengthHistogram: hist, maxRoutesWithin45Trains: kmax, minTotalForThatCount: total});
  const timeOne = (owned) => { const t0 = performance.now(); const value = longestTrail(routes, owned); return {ms: performance.now() - t0, value}; };
  // 400 uniformly shuffled budget-feasible sets.
  const rng = seed(20260908);
  const times = [];
  for (let t = 0; t < 400; t++) {
    const order = [...routes];
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    let used = 0; const owned = [];
    for (const r of order) if (used + r.length <= 45) { owned.push(r.id); used += r.length; }
    times.push(timeOne(owned).ms);
  }
  times.sort((a, b) => a - b);
  const pct = (p) => +times[Math.min(times.length - 1, Math.floor(p * times.length))].toFixed(2);
  out({check: 'budget-uniform-400', medianMs: pct(0.5), p95Ms: pct(0.95), p99Ms: pct(0.99), worstMs: +times.at(-1).toFixed(2)});
  // Targeted: bias toward short tracks so 24-27 routes fit, keep up to 1000 such sets, stop after 60 s.
  const rng2 = seed(424242);
  const started = performance.now();
  let kept = 0, tried = 0, worst = {ms: 0, routes: 0, trains: 0}; const counts = {};
  while (performance.now() - started < 60000 && kept < 1000) {
    tried++;
    const order = routes.map((r) => ({r, key: rng2() * (r.length ** 1.5)})).sort((x, y) => x.key - y.key).map((x) => x.r);
    let used = 0; const owned = [];
    for (const r of order) if (used + r.length <= 45) { owned.push(r.id); used += r.length; }
    if (owned.length < 24) continue;
    kept++; counts[owned.length] = (counts[owned.length] ?? 0) + 1;
    const {ms} = timeOne(owned);
    if (ms > worst.ms) worst = {ms, routes: owned.length, trains: used};
  }
  out({check: 'budget-targeted', tried, keptSetsWith24To27Routes: kept, routeCountHistogram: counts, worstMs: +worst.ms.toFixed(1), worstRoutes: worst.routes, worstTrains: worst.trains, note: 'sampled, not exhaustive'});
}

async function compare(ownerPath) {
  if (!ownerPath) throw new Error('compare needs --owner <path to longest-trail.ts>');
  const {longestTrail} = await dist();
  const {longestTrail: other} = await import(pathToFileURL(resolve(ownerPath)).href);
  const seed = await seeded();
  const routes = usa.routes.map((r) => ({id: r.id, a: r.a, b: r.b, length: r.length, color: r.color}));
  const otherRoutes = new Map(usa.routes.map((r) => [r.id, {id: r.id, from: r.a, to: r.b, length: r.length}]));
  const pick = (rng, k) => { const s = new Set(); while (s.size < k) s.add(routes[Math.floor(rng() * routes.length)].id); return [...s]; };
  let mismatches = 0, cases = 0;
  const rng = seed(11);
  for (const k of [3, 5, 8, 10, 12, 14, 16, 18, 20, 22]) for (let t = 0; t < 30; t++) {
    const owned = pick(rng, k); cases++;
    if (longestTrail(routes, owned) !== other(owned.map((id) => otherRoutes.get(id))).length) mismatches++;
  }
  out({check: 'compare-small-random', cases, valueMismatches: mismatches});
  const rng2 = seed(424242);
  const started = performance.now();
  let kept = 0, mismatch = 0, tb = 0, to = 0, wb = 0, wo = 0;
  while (performance.now() - started < 150000 && kept < 1000) {
    const order = routes.map((r) => ({r, key: rng2() * (r.length ** 1.5)})).sort((x, y) => x.key - y.key).map((x) => x.r);
    let used = 0; const owned = [];
    for (const r of order) if (used + r.length <= 45) { owned.push(r.id); used += r.length; }
    if (owned.length < 24) continue;
    kept++;
    let t0 = performance.now(); const a = longestTrail(routes, owned); const da = performance.now() - t0;
    t0 = performance.now(); const b = other(owned.map((id) => otherRoutes.get(id))).length; const db = performance.now() - t0;
    if (a !== b) mismatch++;
    tb += da; to += db; wb = Math.max(wb, da); wo = Math.max(wo, db);
  }
  out({check: 'compare-budget-feasible', setsCompared: kept, valueMismatches: mismatch, b12TotalMs: +tb.toFixed(0), otherTotalMs: +to.toFixed(0), b12WorstMs: +wb.toFixed(1), otherWorstMs: +wo.toFixed(1), otherSource: ownerPath});
}

async function map() {
  const pos = JSON.parse(read('sources/rob-cities.json'));
  const at = (name) => {
    const key = Object.keys(pos).find((k) => canon(k) === name);
    if (!key) throw new Error('no position for ' + name);
    const [x, y] = pos[key];
    return [40 + x * 1120, 40 + (1 - y) * 620];
  };
  const COLOUR = {gray: '#a7adc6', yellow: '#ffd166', blue: '#4cc9f0', green: '#06d6a0', pink: '#ff5d8f', orange: '#ff9f43', white: '#f5f6ff', black: '#5b5f7a', red: '#ef476f'};
  const groups = new Map();
  for (const r of usa.routes) { const key = [r.a, r.b].sort().join('|'); groups.set(key, [...(groups.get(key) ?? []), r]); }
  let lines = '';
  for (const [key, routes] of groups) {
    const [a, b] = key.split('|');
    const [x1, y1] = at(a), [x2, y2] = at(b);
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len;
    routes.forEach((r, i) => {
      const off = routes.length === 1 ? 0 : (i === 0 ? -6 : 6);
      lines += `<line x1="${(x1 + nx * off).toFixed(1)}" y1="${(y1 + ny * off).toFixed(1)}" x2="${(x2 + nx * off).toFixed(1)}" y2="${(y2 + ny * off).toFixed(1)}" stroke="${COLOUR[r.color]}" stroke-width="${(2 + r.length * 0.8).toFixed(1)}" stroke-linecap="round" opacity="0.92"/>`;
    });
  }
  let nodes = '';
  for (const c of usa.cities) {
    const [x, y] = at(c.name);
    nodes += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5.5" fill="#0f1020" stroke="#ffd166" stroke-width="2"/><text x="${(x + 8).toFixed(1)}" y="${(y + 4).toFixed(1)}" font-family="Nunito Variable, Segoe UI, system-ui, sans-serif" font-size="12" fill="#f5f6ff">${c.name}</text>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700"><rect width="1200" height="700" fill="#0f1020"/><text x="40" y="28" font-family="Nunito Variable, Segoe UI, system-ui, sans-serif" font-size="16" fill="#b3b7d9">B12 USA catalog check: usa.json routes at Rob217 city positions (validation view, not game art)</text>${lines}${nodes}</svg>\n`;
  const dir = resolve(job, 'reports/polish-2026-10-08');
  mkdirSync(dir, {recursive: true});
  writeFileSync(resolve(dir, 'map-check.svg'), svg);
  out({check: 'map', routes: usa.routes.length, cities: usa.cities.length, written: 'reports/polish-2026-10-08/map-check.svg'});
}

const [command, ...rest] = process.argv.slice(2);
const owner = rest[rest.indexOf('--owner') + 1];
const commands = {spot, budget, compare: () => compare(owner), map};
if (!commands[command]) { console.error('usage: node tools/polish-check.mjs spot|budget|compare --owner <file>|map'); process.exit(2); }
await commands[command]();
