/* V43: safe sequential loader. No inline nested script tags. */
(function(){
  'use strict';
  if (!window.MVERI_PORTAL_BRIDGED) return;
  function load(file, done){
    const script=document.createElement('script');
    script.src=file+'?v=51';
    script.onload=()=>done&&done();
    script.onerror=()=>{
      document.body.innerHTML='<main style="max-width:640px;margin:12vh auto;padding:32px;font:16px/1.8 sans-serif;color:#173b80;background:white;border:1px solid #dbe6f7;border-radius:16px"><h1>工作台资源加载失败</h1><p>无法读取 '+file+'，请确认整站文件夹已完整上传，且保持 area/ 下资源的相对路径不变。</p><a href="../auth/access.html">返回登录入口</a></main>';
    };
    document.body.appendChild(script);
  }
  load('data.js',()=>load('app.js'));
})();
