// Checks a to-partybox.py output folder against PartyBox's own schema and speech reader.
// It needs a PartyBox checkout with node_modules installed; this job folder does not contain one.
//
//   PB_REPO=/path/to/partybox /path/to/partybox/node_modules/.bin/tsx \
//     partybox/validate-with-partybox.ts <out-dir>/questions.json
//
// Exit 0 when questionsPackSchema accepts the pack. Speech counts are informational.
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

async function main(): Promise<number> {
  const repo = process.env.PB_REPO;
  const file = process.argv[2];
  if (!repo || !file) {
    console.error('usage: PB_REPO=<partybox checkout> tsx partybox/validate-with-partybox.ts <questions.json>');
    return 2;
  }
  const schemaUrl = pathToFileURL(`${repo}/games/lightning-round/content/schema.ts`).href;
  const speechUrl = pathToFileURL(`${repo}/packages/game-sdk/src/speech/speakable.ts`).href;
  const { questionsPackSchema } = await import(schemaUrl);
  const { toSpeakable } = await import(speechUrl);

  const pack = JSON.parse(readFileSync(file, 'utf8'));
  const result = questionsPackSchema.safeParse(pack);
  if (!result.success) {
    console.log('PartyBox schema: FAIL', JSON.stringify(result.error.issues.slice(0, 5)));
    return 1;
  }
  console.log(`PartyBox schema: ok, ${pack.items.length} items`);

  const counts: Record<string, number> = {};
  const bump = (key: string) => (counts[key] = (counts[key] ?? 0) + 1);
  for (const item of pack.items as Array<{ question: string; choices: string[] }>) {
    for (const text of [item.question, ...item.choices]) {
      if (/\d/.test(text)) bump('digits (read as words)');
      if (/\b(?=[MDCLXVI]{2,}\b)[MDCLXVI]+\b/.test(text)) bump('roman numeral 2+ letters (read letter by letter unless overridden)');
      const parts = toSpeakable(text, { voice: 'zira', lang: 'en' }) as Array<{ text: string; ipa?: string }>;
      if (parts.some((p) => typeof p.ipa === 'string')) bump('phonetic override part');
      if (/\b[A-Z]{2,5}\b/.test(text)) bump('capitals run (spelled or say-as-word)');
    }
  }
  console.log('speech (informational):', JSON.stringify(counts, null, 1));
  return 0;
}

main().then((code) => process.exit(code));
