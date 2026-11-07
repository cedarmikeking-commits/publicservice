/* V72.22: explicit resource URL diagnostics and cache-safe dependency loading. */
(function(){
 'use strict';
 if(!window.MVERI_PORTAL_BRIDGED)return;
 const current=document.currentScript;
 const base=new URL('.',current.src);
 const VERSION='7237';
 window.MVERI_PORTAL_BASE_URL=base.href;
 const steps=[
  ['../assets/school-licenses-v58.js','MVERI_SCHOOL_LICENSE'],
  ['../assets/registered-users-v60.js','MVERI_REGISTERED'],
  ['../assets/user-directory-v59.js','MVERI_USERS'],
  ['../assets/unified-menu-v722.js','MVERI_UNIFIED_MENU'],
  ['nav-policy-v63.js','MVERI_NAV_V63'],
  ['../assets/national-school-loader-v7219.js','MVERI_NATIONAL_CATALOG',true],
  ['data.js','SEED'],
  ['../assets/partner-registry-v7237.js','MVERI_PARTNER_REGISTRY'],
  ['app.js',null]
 ];
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 async function diagnostic(url){
  try {
   const response=await fetch(url,{cache:'no-store',credentials:'same-origin'});
   const type=response.headers.get('content-type')||'unknown';
   return 'HTTP '+response.status+' '+response.statusText+' · Content-Type: '+type;
  }catch(e){return '网络访问失败：'+String(e.message||e)}
 }
 async function failure(path,url,detail){
  const result=await diagnostic(url);
  console.error('[MVERI V72.22] dependency failure',{path,url,detail,result});
  document.body.innerHTML='<main style="max-width:760px;margin:7vh auto;padding:28px 32px;border:1px solid #d8e4f5;border-radius:14px;background:#fff;font:15px/1.8 sans-serif;color:#173b80">'+
   '<h2>工作台模块未能加载</h2><p>失败资源：<strong>'+esc(path)+'</strong></p>'+ 
   '<p style="overflow-wrap:anywhere">请求地址：<code>'+esc(url)+'</code></p>'+ 
   '<p>检查结果：<code>'+esc(result)+'</code></p>'+ 
   '<p>浏览器错误：'+esc(detail)+'</p>'+ 
   '<p>请检查此 URL 是否能直接访问，以及网站 <code>src/apps/area/</code> 目录是否完整。若出现 404/403，请修复部署目录或访问权限，单纯重试无法补齐服务器缺少的文件。</p>'+ 
   '<p><a href="'+esc(new URL('../../../deploy-check.html',base).href)+'" target="_blank" rel="noopener">打开部署资源自检</a></p>'+ 
   '<button onclick="location.reload()" style="padding:10px 20px;background:#315cc5;border:0;border-radius:8px;color:white;cursor:pointer">重新加载</button></main>';
 }
 function attempt(path,required,optional,next,retry){
  const url=new URL(path,base);
  url.searchParams.set('v',VERSION);
  if(retry)url.searchParams.set('retry',String(Date.now()));
  const script=document.createElement('script');
  script.src=url.href;
  let finished=false;
  const timer=setTimeout(()=>done('资源请求超时'),optional?7000:20000);
  function done(error){
   if(finished)return;
   finished=true;clearTimeout(timer);
   script.onload=script.onerror=null;
   if(error){
    script.remove();
    if(!retry){attempt(path,required,optional,next,true);return}
    if(!optional){failure(path,url.href,error);return}
    window.MVERI_NATIONAL_CATALOG_BOOT_ERROR=path+'：'+error;
    console.warn('[MVERI] optional catalog unavailable',path,error);
   }
   next();
  }
  script.onload=()=>done(required&&typeof window[required]==='undefined'?'资源脚本已收到，但未建立必要全局变量 '+required:null);
  script.onerror=()=>done('资源请求失败（网络、状态码、MIME 或服务器拒绝）');
  document.body.appendChild(script);
 }
 function load(i){if(i>=steps.length)return;const [p,req,opt]=steps[i];attempt(p,req,opt,()=>load(i+1),false)}
 load(0);
})();
