(()=>{'use strict';
// This document owns the native administrative content. The original #nav remains
// as a hidden compatibility target so original nav()/switchView() still work.
const menu=document.querySelector('#hq52menu');
function sync(){if(!menu)return;const hash=decodeURIComponent(location.hash.slice(1)||'home');const current=location.pathname.split('/').pop();menu.querySelectorAll('a').forEach(a=>{const u=new URL(a.href,location.href);const match=u.pathname===location.pathname&&(current!=='admin-hq.html'||u.hash==='#'+hash);a.classList.toggle('active',match);if(match)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});const titles={home:'运营总览',indicators:'指标体系',masterdata:'主数据模型',points:'考评点管理',types:'题型管理',plans:'命题计划',bank:'试题维护',blueprint:'测评蓝图',agents:'专项智能体',data:'数据管理'};const t=document.querySelector('#hq52title');if(t)t.textContent=titles[hash]||'能力评价管理';}
sync();window.addEventListener('hashchange',sync);
menu?.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;const u=new URL(a.href,location.href);if(u.pathname===location.pathname&&u.hash){e.preventDefault();const k=u.hash.slice(1);if(typeof window.switchView==='function')window.switchView(k);else location.hash=u.hash;sync()}});
const toggle=document.querySelector('#hq52toggle');toggle?.addEventListener('click',()=>document.body.classList.toggle('hq52-collapsed'));
document.querySelector('#hq52logout')?.addEventListener('click',()=>{sessionStorage.removeItem('mveriRole');sessionStorage.removeItem('mveriRegion');sessionStorage.removeItem('mveri_offline_session_v3')});
})();