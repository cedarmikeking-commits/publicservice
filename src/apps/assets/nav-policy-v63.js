/* MVERI unified navigation contract V63: one accordion, native links, persistent group. */
(function(){'use strict';
const PREFIX='mveri_nav_group_v63_';
function samePage(a){try{const u=new URL(a.href,location.href);return u.pathname===location.pathname && (u.hash===location.hash||(!location.hash&&u.hash==='#home'));}catch{return false}}
function mount(options){
 const menu=document.querySelector(options.menu);if(!menu||menu.dataset.mveriNavMounted==='1')return;
 menu.dataset.mveriNavMounted='1';const groups=[...menu.querySelectorAll(options.group)];const key=PREFIX+options.role;
 const locate=g=>[...g.querySelectorAll('a[href]')].some(a=>samePage(a)||a.getAttribute('aria-current')==='page'||a.classList.contains('active'));
 const current=groups.find(locate),saved=sessionStorage.getItem(key);const initial=current||groups.find(g=>options.name(g)===saved)||groups[0];
 function activate(g){groups.forEach(x=>{const open=x===g; x.classList.toggle('is-open',open);const b=x.querySelector(options.button),p=x.querySelector(options.panel);if(b)b.setAttribute('aria-expanded',String(open));if(p)p.hidden=!open;});if(g)sessionStorage.setItem(key,options.name(g));else sessionStorage.removeItem(key)}
 groups.forEach(g=>{const b=g.querySelector(options.button);if(!b)return;b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const collapsed=options.collapsed();if(collapsed){options.expand();activate(g)}else activate(g.classList.contains('is-open')?null:g)});g.querySelectorAll('a[href]').forEach(a=>a.addEventListener('click',()=>{sessionStorage.setItem(key,options.name(g))}));});
 activate(initial);
 window.addEventListener('hashchange',()=>{const active=groups.find(locate);if(active)activate(active)});
 return {activate};
}
window.MVERI_NAV_V63={mount};
})();