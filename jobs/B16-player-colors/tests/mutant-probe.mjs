import{pathToFileURL}from'node:url';import{probe}from'./math.mjs';const base=pathToFileURL(`${process.argv[2]}/dist/color.js`),p=await import(base);probe(p,Number(process.argv[3]),100);
