// Finite preflight only: keep the actual historical proof immutable.
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

const out = new URL('./', import.meta.url);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const require = (value, reason) => {if (!value) throw Error(reason);};

export function assertProofBridge(equivalence, currentGuards) {
 const bridge = JSON.parse(readFileSync(new URL('documentation-proof-bridge.json', out)));
 require(bridge.kind === 'explicit-immutable-six-a-proof-to-eight-d-documentation-bridge', 'Wrong bridge kind');
 require(bridge.historicalHead === '6a079fec45c7e721fd16e988288b25c103ff29c6' && bridge.currentHead === '8d65ecc384af43732b6cb0453f27a0cea2b6c3f1', 'Wrong bridge heads');
 require(bridge.gameplayOrProofBytesChanged === false && bridge.performanceOrAcceptanceRun === false, 'Invalid bridge scope');
 require(equivalence.passed === true && equivalence.cases === 214308 && equivalence.originalCases === 131490 && equivalence.sourcesUnchanged === true, 'Incomplete historical proof');
 require(equal(equivalence.sourceStart, equivalence.sourceEnd) && Object.keys(equivalence.sourceEnd).length === 1001, 'Historical guards changed');
 require(sha(readFileSync(new URL('equivalence-latest.json', out))) === bridge.equivalenceProofSha256, 'Historical semantic receipt changed');
 require(equivalence.candidateSourceSha256 === bridge.candidateSourceSha256 && equivalence.candidateJsSha256 === bridge.candidateJsSha256, 'Candidate proof identity changed');
 require(currentGuards['private/candidate-nameFilter.ts'] === bridge.candidateSourceSha256 && currentGuards['private/compiled/candidate-nameFilter.js'] === bridge.candidateJsSha256, 'Candidate actual identity changed');
 const allowedDocs = ['job/ASSUMPTIONS.md', 'job/LOOP.md', 'job/NEXT.md', 'job/README.md', 'job/VERIFY.md'].sort();
 require(equal(Object.keys(bridge.documentBridges).sort(), allowedDocs), 'Bridge may only admit five non-runtime documents');
 const historical = equivalence.sourceEnd;
 const actualDifferences = Object.keys(historical).filter(key => historical[key] !== currentGuards[key]).sort();
 require(equal(actualDifferences, allowedDocs), 'Gameplay, proof or undocumented guard drift');
 for (const [key, digest] of Object.entries(historical)) {
  require(Object.hasOwn(currentGuards, key), 'Historical source disappeared: ' + key);
  if (Object.hasOwn(bridge.documentBridges, key)) {
   const b = bridge.documentBridges[key];
   require(b.historicalGitSha256 === digest && b.currentCommittedGitSha256 === currentGuards[key] && b.actualCurrentSha256 === currentGuards[key], 'Document bridge mismatch: ' + key);
  } else require(digest === currentGuards[key], 'Historical source drift: ' + key);
 }
 for (const [key, digest] of Object.entries(bridge.addedDeliveryFiles)) {
  require(key.startsWith('job/results/required-after-green-original-acceptance-20261009/') || key.startsWith('job/results/fold-column-DFA-unadopted-20261009/'), 'New file is outside the two evidence archives');
  require(currentGuards[key] === digest && !Object.hasOwn(historical, key), 'Added immutable evidence drift: ' + key);
 }
 for (const [key, digest] of Object.entries(bridge.newPrivateFiles)) require(currentGuards[key] === digest, 'New private preflight drift: ' + key);
 const extras = Object.keys(currentGuards).filter(key => !Object.hasOwn(historical, key)).sort();
 const allowedExtras = [...Object.keys(bridge.addedDeliveryFiles), ...Object.keys(bridge.newPrivateFiles), 'private/documentation-proof-bridge.json'].sort();
 require(equal(extras, allowedExtras), 'Unrecorded new guard or duplicate bridge entry');
 require(currentGuards['private/documentation-proof-bridge.json'] === sha(readFileSync(new URL('documentation-proof-bridge.json', out))), 'Actual bridge is not guarded');
 require(currentGuards['private/exact-harness.mjs'] === bridge.originalHarnessSha256, 'Original completed harness changed');
 require(currentGuards['private/timing-only-harness.mjs'] === bridge.timingOnlyHarnessSha256, 'New timing harness changed');
 const controls = JSON.parse(readFileSync(new URL('structural-control.json', out)));
 require(sha(readFileSync(new URL('structural-control.json', out))) === bridge.controlProofSha256 && controls.cases === 8 && controls.passed === 8 && controls.classificationInvariant.cases === 65536 && controls.classificationInvariant.passed === 65536, 'Incomplete genuine controls');
 const review = JSON.parse(readFileSync(new URL('independent-static-review.json', out)));
 require(review.status === 'PASS' && review.assertions === 2175 && review.timingRun === false && review.candidateSourceSha256 === bridge.candidateSourceSha256 && review.candidateCompiledSha256 === bridge.candidateJsSha256, 'Wrong independent source review');
 return {historicalHead: bridge.historicalHead, currentHead: bridge.currentHead, historicalProofGuards: 1001, explicitlyBridgedDocumentFiles: allowedDocs.length, newlyGuardedEvidenceFiles: Object.keys(bridge.addedDeliveryFiles).length, totalCurrentGuards: Object.keys(currentGuards).length, originalProofMapUnchanged: true};
}
