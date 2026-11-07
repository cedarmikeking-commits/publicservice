import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const inventory=JSON.parse(fs.readFileSync(path.join(root,'docs/MIGRATION_INVENTORY.json')));
let errors=[];
for(const item of inventory.files){const file=path.join(root,'src/apps',item.path);if(!fs.existsSync(file)){errors.push('Missing '+item.path);continue}const hash=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');if(hash!==item.sha256)errors.push('Changed '+item.path)}
const apps=path.join(root,'src/apps');
for(const a of ['site/index.html','auth/access.html','personal/index.html','institution/index.html','area/index.html','assessment/admin-hq.html','operations/index.html','workspace/index.html']){if(!fs.existsSync(path.join(apps,a)))errors.push('Missing entry '+a)}
console.log('Original business files checked:',inventory.count,'; structural errors:',errors.length);if(errors.length){console.error(errors.slice(0,50).join('\n'));process.exit(1)}
