import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..');
for(const role of ['institution','operations','personal']){
 const html=fs.readFileSync(path.join(root,'src/apps',role,'index.html'),'utf8');
 for(const file of ['certificate-verification-v727.css','certificate-institution-v7234.css']){
  assert(html.includes(file),`${role}: missing ${file}`);
  assert(fs.existsSync(path.join(root,'src/apps/assets',file)),`${role}: missing asset ${file}`);
 }
 assert(html.includes('app.js?v=7234'),`${role}: app.js cache version`);
}
const app=fs.readFileSync(path.join(root,'src/apps/assets/app.js'),'utf8');
for(const required of ['portal-account-org',"name('orgs',org)",'function verify()']) assert(app.includes(required),`missing ${required}`);
console.log('V72.34 portal CSS and org-name contract: PASS');
