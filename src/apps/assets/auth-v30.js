(()=>{'use strict';
const AUTH='mveri_offline_session_v3',USERS='mveri_registered_users_v13';
const role=document.body.dataset.loginRole;
const samples=[
  {account:'demo_jobseeker',name:'陈晓晨',label:'待就业劳动者',role:'personal',password:'Demo@123456',redirect:'personal'},
  {account:'demo_university',name:'周怡然',label:'大学生',role:'personal',password:'Demo@123456',redirect:'personal'},
  {account:'demo_vocational',name:'李嘉禾',label:'职业院校学生',role:'personal',password:'Demo@123456',redirect:'personal'},
  {account:'demo_employee',name:'王明远',label:'企业职工',role:'personal',password:'Demo@123456',redirect:'personal'},
  {account:'demo_transition',name:'赵子恒',label:'转岗人员',role:'personal',password:'Demo@123456',redirect:'personal'},
  {account:'demo_flexible',name:'孙思敏',label:'灵活就业人员',role:'personal',password:'Demo@123456',redirect:'personal'},
  {account:'demo_frontline',name:'刘志刚',label:'普通岗位从业者',role:'personal',password:'Demo@123456',redirect:'personal'},
  {account:'demo_teacher',name:'林慧文',label:'职业院校教师',role:'personal',password:'Demo@123456',redirect:'personal'},
  {account:'li',name:'李文博',label:'个人教师',role:'personal',password:'123456',redirect:'personal'},
  {account:'zhang',name:'张晓宁',label:'个人教师',role:'personal',password:'123456',redirect:'personal'},
  {account:'bj_school',name:'北京院校管理员',label:'北京信息职业技术学院',role:'school',password:'123456',redirect:'institution',org:'SCH-001'},
  {account:'hb_school',name:'河北院校管理员',label:'河北工业职业技术大学',role:'school',password:'123456',redirect:'institution',org:'SCH-002'},
  {account:'sx_school',name:'山西院校管理员',label:'山西职业技术学院',role:'school',password:'123456',redirect:'institution',org:'SCH-003'},
  {account:'bj_region',name:'北京区域负责人',label:'北京区域服务中心',role:'region',password:'123456',redirect:'institution',region:'ORG-BJ'},
  {account:'hb_region',name:'河北区域负责人',label:'河北区域服务中心',role:'region',password:'123456',redirect:'institution',region:'ORG-HB'},
  {account:'sx_region',name:'山西区域负责人',label:'山西区域服务中心',role:'region',password:'123456',redirect:'institution',region:'ORG-SX'},
  {account:'admin',name:'总部平台管理员',label:'总部管理',role:'operations',password:'123456',redirect:'operations'},
  {account:'reviewer',name:'认证审核员',label:'总部审核',role:'operations',password:'123456',redirect:'operations'}
];
const $=id=>document.getElementById(id);
const read=()=>{try{const x=JSON.parse(localStorage.getItem(USERS));return Array.isArray(x)?x:[]}catch{return []}};
if(!role)return;
const sampleWrap=$('samples'), regionEl=$('region'), errorEl=$('error');
const baseMine=samples.filter(x=>x.role===role);
function renderSamples(){
 let mine=baseMine;
 if(role==='region' && regionEl?.value) mine=mine.filter(x=>x.region===regionEl.value);
 sampleWrap.innerHTML=mine.map(x=>'<button type="button" class="auth30-sample" data-account="'+x.account+'"><strong>'+x.name+'</strong><small>'+x.label+' · '+x.account+'</small></button>').join('') || '<div class="auth30-empty">请先选择所属区域</div>';
}
if(sampleWrap) renderSamples();
if(regionEl){regionEl.addEventListener('change',()=>{renderSamples(); errorEl.hidden=true;});}
sampleWrap?.addEventListener('click',e=>{const b=e.target.closest('[data-account]');if(!b)return;const one=samples.find(x=>x.account===b.dataset.account);if(regionEl && one?.region) regionEl.value=one.region;$('account').value=b.dataset.account;$('password').value=one?.password||'123456';errorEl.hidden=true;$('password').focus();});
$('show')?.addEventListener('change',e=>$('password').type=e.target.checked?'text':'password');
$('login')?.addEventListener('submit',e=>{
 e.preventDefault();
 const account=$('account').value.trim(), password=$('password').value;
 const found=[...samples,...read()].find(x=>x.account===account&&x.password===password);
 if(!found || found.status==='停用' || found.role!==role){errorEl.textContent='账号、密码或登录入口不匹配。请选择对应身份入口后重试。';errorEl.hidden=false;return;}
 if(role==='region'){
   const chosen=regionEl?.value;
   if(!chosen){errorEl.textContent='请先选择所属区域后再登录。';errorEl.hidden=false;return;}
   if(found.region!==chosen){errorEl.textContent='所选区域与账号授权区域不一致，请核对后重试。';errorEl.hidden=false;return;}
 }
 sessionStorage.setItem(AUTH,JSON.stringify({account:found.account, role:found.role, region:found.region||'', org:found.org||''}));
 location.href='../'+(found.redirect||found.role)+'/index.html';
});
})();