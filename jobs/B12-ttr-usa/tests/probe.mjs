import * as p from '../dist/ttr.js';import * as r from '../dist/reference.js';import {goldens} from './goldens.mjs';
for(const seed of [1,2,3])console.log(JSON.stringify(goldens(p,r,seed)));
