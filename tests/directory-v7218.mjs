import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import vm from 'node:vm';import assert from 'node:assert/strict';import{fileURLToPath}from'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const data=JSON.parse(read('data/national-directory/schools.json')),records=data.schools,cov=JSON.parse(read('data/national-directory/coverage-report.json')),sources=JSON.parse(read('data/national-directory/sources.json')).sources;
assert.equal(records.length,data.meta.count);assert.equal(records.filter(s=>s.level==='高职').length,1540);assert.equal(records.filter(s=>s.level==='职教本科').length,124);assert.equal(cov.nationalComplete,false);assert.equal(cov.nationalSecondarySchoolCoverageRate,null);
assert.equal(new Set(records.map(s=>s.id)).size,records.length);
for(const r of records){assert(r.name&&r.province&&r.level);assert.equal(r.verified,true);assert(r.sources.length>0);for(const ref of r.sources){const s=sources.find(x=>x.id===ref.sourceId);assert(s,ref.sourceId);assert(ref.locator);assert(fs.existsSync(path.join(root,s.localFile)));}}
for(const s of sources){assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,s.localFile))).digest('hex'),s.sha256,s.id);assert.equal(new URL(s.pageUrl).protocol,'https:');}
assert.equal(cov.provinces.length,31);assert.equal(cov.uncoveredSecondaryProvinces.length,11);
for(const p of cov.provinces)for(const level of ['职教本科','高职','中职'])assert.equal(p.levels[level].count,records.filter(r=>r.province===p.province&&r.level===level).length);
for(const p of cov.uncoveredSecondaryProvinces){assert.equal(cov.provinces.find(x=>x.province===p).levels['中职'].status,'uncovered');assert(!records.some(r=>r.province===p&&r.level==='中职'));}
// Real same-name college and its secondary-vocational unit must both survive.
const art=records.filter(r=>r.name==='福建艺术职业学院');assert.deepEqual(new Set(art.map(r=>r.level)),new Set(['高职','中职']));
const conflicting=records.find(r=>r.name==='六盘水市钟山区职业技术学校');assert.equal(conflicting.code,'');assert.equal(conflicting.originalCodes.length,7);
assert.equal(records.filter(r=>r.name==='会宁职业中等专业学校').length,1);assert.equal(records.find(r=>r.name==='会宁职业中等专业学校').campuses.length,2);
assert.equal(records.filter(r=>r.sourceId==='SC-2026').length,343);assert.equal(records.filter(r=>r.sourceId==='JX-2026').length,189);
const storage=new Map(),writes=[];const ctx={window:{},structuredClone,console,URL,location:{href:'http://localhost/src/apps/area/school-admin.html'},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>{storage.set(k,v);writes.push(k)}}};vm.createContext(ctx);vm.runInContext(read('src/apps/assets/national-school-catalog.js'),ctx);vm.runInContext(read('src/apps/assets/school-licenses-v58.js'),ctx);
// Existing custom business data must remain byte-for-byte unchanged by catalog reads.
const original={schools:[{id:'SCH-001',name:'北京信息职业技术学院',region:'HQ',seats:19,status:'启用',customField:'preserve'}],users:[{id:'SU900',school:'SCH-001',account:'qa_preserved',name:'存量测试账号',type:'管理员',password:'test-only-value',status:'启用'}]};
storage.set('mveri_school_licenses_v58',JSON.stringify(original));const snapshot=storage.get('mveri_school_licenses_v58');
ctx.db={colleges:[{id:'C_QA',name:'仅供自动回归的未核验台账',province:'北京市',level:'高职'}]};ctx.esc=s=>String(s??'');
const app=read('src/apps/area/app.js');let start=app.indexOf('/* V72.18 official per-school directory.'),end=app.indexOf('window.schoolCatalogImportDialog=',start);assert(start>0&&end>start);vm.runInContext('function schoolH(s){return esc(s)}\n'+app.slice(start,end),ctx);
let dir=vm.runInContext('schoolDirectory()',ctx);assert.equal(dir.filter(s=>s.verified).length,records.length);assert.equal(dir.find(s=>s.name==='北京信息职业技术学院').licensedId,'SCH-001');assert.equal(dir.find(s=>s.name==='仅供自动回归的未核验台账').verified,false);assert.equal(storage.get('mveri_school_licenses_v58'),snapshot);assert.equal(writes.length,0);
// Corrupt local CSV storage must not hide the bundled verified national records.
storage.set('mveri_national_school_catalog_v7215','{bad-json');ctx.console={...console,warn:()=>{}};dir=vm.runInContext('schoolDirectory()',ctx);assert.equal(dir.filter(s=>s.verified).length,records.length);assert.equal(storage.get('mveri_school_licenses_v58'),snapshot);
// Original seat limits still reject a new active account when seats are full.
storage.delete('mveri_national_school_catalog_v7215');const seat=JSON.parse(snapshot);seat.schools[0].seats=1;storage.set('mveri_school_licenses_v58',JSON.stringify(seat));
assert.throws(()=>ctx.window.MVERI_SCHOOL_LICENSE.saveUser({school:'SCH-001',account:'qa_excess',name:'席位回归账号',type:'教师',status:'启用',password:'test-only-value'}),/席位已满/);assert.equal(ctx.window.MVERI_SCHOOL_LICENSE.get().users.length,1);
console.log(`Directory verified: ${records.length} records, ${sources.length} source hashes, 31 province totals; cross-level identity, tenant preservation and seat constraints passed.`);
