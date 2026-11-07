/* V64: complete dependency graph for unified navigation and user/seat management */
(function(){
 'use strict';
 if(!window.MVERI_PORTAL_BRIDGED)return;
 const steps=[
  ['../assets/school-licenses-v58.js','MVERI_SCHOOL_LICENSE'],
  ['../assets/registered-users-v60.js','MVERI_REGISTERED'],
  ['../assets/user-directory-v59.js','MVERI_USERS'],
  ['nav-policy-v63.js','MVERI_NAV_V63'],
  ['data.js','SEED'],
  ['app.js',null]
 ];
 function failure(file,detail){
  console.error('[MVERI] failed dependency',file,detail);
  document.body.innerHTML='<main style="max-width:650px;margin:12vh auto;padding:28px 32px;border:1px solid #d8e4f5;border-radius:14px;background:#fff;font:15px/1.8 sans-serif;color:#173b80"><h2>工作台模块未能加载</h2><p>必要资源加载失败：<code>'+file.replace(/[<>&]/g,'')+'</code></p><p>请完整部署 V64 的 area 与 assets 目录后刷新页面。</p><button onclick="location.reload()" style="padding:10px 20px;background:#315cc5;border:0;border-radius:8px;color:white;cursor:pointer">重新加载</button></main>';
 }
 function load(i){
  if(i>=steps.length)return;
  const [path,required]=steps[i];const s=document.createElement('script');
  s.src=path+'?v=64';
  s.onload=()=>{if(required && typeof window[required]==='undefined'){failure(path,'missing '+required);return;}load(i+1)};
  s.onerror=()=>failure(path,'script request failed');
  document.body.appendChild(s);
 }
 load(0);
})();
