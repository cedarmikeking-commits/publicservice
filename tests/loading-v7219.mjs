import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const manifest=JSON.parse(read('src/apps/assets/national-school-parts-v7219/manifest.json'));
const records=JSON.parse(read('data/national-directory/schools.json')).schools;
const assetBase='https://test.invalid/nested/mveri/src/apps/assets/';
function runtime({fail=false,corrupt=false}={}){
 const requested=[],states=[];
 let broken=fail;
 const ctx={URL,Map,Set,Promise,Date,Error,setTimeout,clearTimeout,console:{warn(){},error(){}},CustomEvent:class{constructor(type,{detail}){this.type=type;this.detail=detail}},document:{currentScript:{src:assetBase+'national-school-loader-v7219.js?v=7219'}}};
 ctx.window=ctx;ctx.dispatchEvent=e=>states.push(e.detail);ctx.addEventListener=()=>{};
 ctx.document.createElement=()=>({remove(){}});
 ctx.document.head={appendChild(script){
  requested.push(script.src);
  queueMicrotask(()=>{
   const u=new URL(script.src),relative=u.pathname.split('/src/apps/assets/')[1];
   assert(relative,'Nested deployment base was lost: '+script.src);
   if(broken&&relative.includes('part-03-')){script.onerror?.();return}
   try{
    if(!(corrupt&&relative.includes('part-03-')))vm.runInContext(read('src/apps/assets/'+relative),ctx);
    script.onload?.();
   }catch(error){script.onerror?.(error)}
  });
 }};
 vm.createContext(ctx);vm.runInContext(read('src/apps/assets/national-school-loader-v7219.js'),ctx);
 return {ctx,requested,states,repair(){broken=false}};
}
for(const part of manifest.parts){
 assert(part.bytes<190*1024);
 assert.equal(Buffer.byteLength(read('src/apps/assets/'+part.file)),part.bytes);
}
const normal=runtime();
assert.equal(normal.requested.length,0,'Other business pages must not fetch national school rows');
assert.equal(normal.ctx.MVERI_NATIONAL_CATALOG.getStatus().phase,'idle');
const first=normal.ctx.MVERI_NATIONAL_CATALOG.load();
assert.equal(normal.ctx.MVERI_NATIONAL_CATALOG.load(),first,'Concurrent reads share one request');
await first;
assert.equal(normal.ctx.MVERI_NATIONAL_CATALOG_DATA.length,records.length);
assert.equal(normal.requested.length,manifest.parts.length);
assert.deepEqual(JSON.parse(JSON.stringify(normal.ctx.MVERI_NATIONAL_CATALOG_DATA)),records);
await normal.ctx.MVERI_NATIONAL_CATALOG.load();
assert.equal(normal.requested.length,manifest.parts.length,'Ready data should not download twice');
const missing=runtime({fail:true});
await assert.rejects(missing.ctx.MVERI_NATIONAL_CATALOG.load(),/名录分块加载失败/);
assert.equal(missing.ctx.MVERI_NATIONAL_CATALOG.getStatus().phase,'error');
assert.equal(missing.ctx.MVERI_NATIONAL_CATALOG_DATA.length,0,'A partial transfer cannot publish a truncated official directory');
assert.equal(missing.requested.filter(u=>u.includes('part-03-')).length,2,'One bounded automatic retry');
missing.repair();
await missing.ctx.MVERI_NATIONAL_CATALOG.load();
assert.equal(missing.ctx.MVERI_NATIONAL_CATALOG_DATA.length,4203,'Manual retry must recover without duplicate rows');
const invalid=runtime({corrupt:true});
await assert.rejects(invalid.ctx.MVERI_NATIONAL_CATALOG.load(),/名录分块内容校验失败/);
assert.equal(invalid.ctx.MVERI_NATIONAL_CATALOG_DATA.length,0);

// The optional entry can be absent or return HTML/empty JS; both must still boot app.js.
for(const missingKind of ['request-error','missing-export']){
 let finish;const done=new Promise(resolve=>{finish=resolve}),requests=[];
 const globals={'school-licenses-v58.js':'MVERI_SCHOOL_LICENSE','registered-users-v60.js':'MVERI_REGISTERED','user-directory-v59.js':'MVERI_USERS','unified-menu-v722.js':'MVERI_UNIFIED_MENU','nav-policy-v63.js':'MVERI_NAV_V63','data.js':'SEED'};
 const ctx={URL,setTimeout,clearTimeout,console:{warn(){},error(){}},MVERI_PORTAL_BRIDGED:true,document:{currentScript:{src:'https://test.invalid/nested/mveri/src/apps/area/portal-loader-v7219.js'},body:{innerHTML:'existing-shell'}}};
 ctx.window=ctx;ctx.document.createElement=()=>({remove(){}});
 ctx.document.body.appendChild=script=>{
  requests.push(script.src);
  queueMicrotask(()=>{
   const file=new URL(script.src).pathname.split('/').pop();
   if(file==='national-school-loader-v7219.js'&&missingKind==='request-error'){script.onerror();return}
   if(globals[file])ctx[globals[file]]={};
   script.onload();
   if(file==='app.js')finish();
  });
 };
 vm.createContext(ctx);vm.runInContext(read('src/apps/area/portal-loader-v7219.js'),ctx);
 await done;
 assert(ctx.MVERI_NATIONAL_CATALOG_BOOT_ERROR);
 assert.equal(ctx.document.body.innerHTML,'existing-shell');
 assert(requests.every(u=>u.startsWith('https://test.invalid/nested/mveri/src/apps/')));
 assert(!requests.some(u=>u.includes('/national-school-catalog.js')));
}

// All real entry pages select the new boot file, with no old hard dependency.
for(const file of fs.readdirSync(path.join(root,'src/apps/area')).filter(x=>x.endsWith('.html'))){
 const html=read('src/apps/area/'+file);
 if(html.includes('portal-bridge.js'))assert(html.includes('portal-loader-v7219.js?v=7219'),file);
}
console.log(`V72.19 loading: ${manifest.parts.length} bounded files reproduce all ${records.length} records; nested paths, optional-entry failure, corrupt/missing chunks, atomic publication and retry passed.`);
