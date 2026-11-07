/* V58 resource loader */
(function(){'use strict';if(!window.MVERI_PORTAL_BRIDGED)return;
function load(file,done){const s=document.createElement('script');s.src=file+'?v=58';s.onload=()=>done&&done();s.onerror=()=>{document.body.innerHTML='<main style="font:16px sans-serif;padding:40px;color:#173b80">资源加载失败：'+file+'，请上传完整目录。</main>'};document.body.appendChild(s)}
load('../assets/school-licenses-v58.js',()=>load('data.js',()=>load('app.js')));
})();