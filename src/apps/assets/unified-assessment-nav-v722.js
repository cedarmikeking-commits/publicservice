/* Same menu renderer and accordion controller used in headquarters area workspace. */
(function(){'use strict';
const menu=document.getElementById('hq52menu');if(!menu||!window.MVERI_UNIFIED_MENU)return;
const reversed={home:'eval-home',indicators:'eval-indicators',masterdata:'eval-masterdata',points:'eval-points',types:'eval-types',plans:'eval-plans',bank:'eval-bank',blueprint:'eval-blueprint',agents:'eval-agents',data:'eval-data'};
const active=()=>reversed[decodeURIComponent(location.hash.slice(1))]||'eval-home';
const controller=window.MVERI_UNIFIED_MENU.mount(menu,'hq',active(),'assessment');
function update(){controller?.active(active())}
addEventListener('hashchange',update);
menu.addEventListener('click',e=>{const a=e.target.closest('a[data-route]');if(a&&new URL(a.href,location.href).pathname===location.pathname)queueMicrotask(update)});
})();
