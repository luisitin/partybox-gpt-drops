import {pathToFileURL} from 'node:url';
import {probe} from './check.mjs';
const folder=process.argv[2],seed=Number(process.argv[3]);
const base=pathToFileURL(`${folder}/dist/`);
const p={...await import(new URL('meter.js',base)),...await import(new URL('sfx.js',base)),...await import(new URL('wav.js',base)),...await import(new URL('spectrogram.js',base))};
probe(p,seed);
