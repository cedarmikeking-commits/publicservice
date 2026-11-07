(function(){'use strict';
 const key='mveri_offline_session_v3';
 let s=null;try{s=JSON.parse(sessionStorage.getItem(key)||'null')}catch(_e){}
 const mapping={admin:{role:'hq',region:'R001'},region01:{role:'region',region:'R001'},region02:{role:'region',region:'R002'}};
 let dynamic=null;try{const d=JSON.parse(localStorage.getItem('mveri_user_directory_v59')||'null');const u=d?.users?.find(x=>x.account===s?.account&&x.status==='启用');if(u)dynamic={role:u.group==='hq'?'hq':u.group,region:u.unit==='HQ'?'R001':u.unit}}catch(_){}const permitted=s&&(dynamic||(!localStorage.getItem('mveri_user_directory_v59')?mapping[s.account]:null));
 if(!permitted){sessionStorage.removeItem('mveriRole');sessionStorage.removeItem('mveriRegion');location.replace('../auth/access.html');return;}
 sessionStorage.setItem('mveriRole',permitted.role);
 sessionStorage.setItem('mveriRegion',permitted.region);
 window.MVERI_PORTAL_BRIDGED=true;
})();