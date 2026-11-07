/* Generated metadata and bounded data files; no tenant/account storage writes. */
(function () {
 'use strict';
 const build = __CATALOG_BUILD__;
 const meta = __CATALOG_METADATA__;
 const sources = __CATALOG_SOURCES__;
 const parts = __CATALOG_PARTS__;
 const base = new URL('.', document.currentScript.src);
 const staged = new Map();
 let state = {phase:'idle', loaded:0, total:parts.length, error:''}, pending = null;
 window.MVERI_NATIONAL_CATALOG_META = meta;
 window.MVERI_NATIONAL_CATALOG_SOURCES = sources;
 window.MVERI_NATIONAL_CATALOG_DATA = [];
 function notify() {
  window.dispatchEvent(new CustomEvent('mveri:catalog-state', {detail:{...state}}));
 }
 function register(version, id, rows) {
  const part = parts.find(p => p.id === id);
  if (version !== build || !part || !Array.isArray(rows) || rows.length !== part.count) return;
  if (rows.some(r => !r || !r.id || !r.name || !r.verified || !Array.isArray(r.sources) || !r.sources.length)) return;
  staged.set(id, rows);
 }
 function request(part, attempt) {
  if (staged.has(part.id)) return Promise.resolve();
  return new Promise((resolve, reject) => {
   const script = document.createElement('script');
   const url = new URL(part.file, base);
   url.searchParams.set('v', build);
   if (attempt) url.searchParams.set('retry', String(Date.now()));
   script.src = url.href;
   let finished = false;
   const timer = setTimeout(() => finish(new Error('名录分块请求超时：' + part.file)), 15000);
   function finish(error) {
    if (finished) return;
    finished = true; clearTimeout(timer); script.onload = script.onerror = null; script.remove();
    if (error) reject(error); else resolve();
   }
   script.onload = () => finish(staged.has(part.id) ? null : new Error('名录分块内容校验失败：' + part.file));
   script.onerror = () => finish(new Error('名录分块加载失败：' + part.file));
   document.head.appendChild(script);
  }).catch(error => attempt ? Promise.reject(error) : request(part, 1));
 }
 function load() {
  if (state.phase === 'ready') return Promise.resolve(window.MVERI_NATIONAL_CATALOG_DATA);
  if (pending) return pending;
  state = {phase:'loading', loaded:staged.size, total:parts.length, error:''}; notify();
  pending = (async () => {
   let cursor = 0;
   async function worker() {
    while (cursor < parts.length) {
     const part = parts[cursor++];
     await request(part, 0);
     state.loaded = staged.size; notify();
    }
   }
   const results = await Promise.allSettled(Array.from({length:Math.min(4, parts.length)}, worker));
   const failure = results.find(r => r.status === 'rejected');
   if (failure) throw failure.reason;
   const records = parts.flatMap(p => staged.get(p.id) || []);
   if (records.length !== meta.count || new Set(records.map(r => r.id)).size !== meta.count) throw new Error('名录总数或唯一标识校验失败，请重新上传完整 assets 目录。');
   window.MVERI_NATIONAL_CATALOG_DATA = records;
   window.MVERI_NATIONAL_CATALOG_BUILD = build;
   state = {phase:'ready', loaded:parts.length, total:parts.length, error:''}; notify();
   return records;
  })().catch(error => {
   state = {phase:'error', loaded:staged.size, total:parts.length, error:error.message || String(error)}; notify();
   throw error;
  }).finally(() => {pending = null;});
  return pending;
 }
 window.MVERI_NATIONAL_CATALOG = {load, register, getStatus:() => ({...state}), build};
})();
