import { copyFileSync,mkdirSync } from 'node:fs';
mkdirSync('build/tables',{recursive:true});
for(const mode of ['official','published'])copyFileSync(`tables/${mode}.json`,`build/tables/${mode}.json`);
