/* V58 – local single-browser organizational seats; replace with a server-side service for production */
(function(){'use strict';
const KEY='mveri_school_licenses_v58';
const initial={schools:[
{id:'SCH-001',name:'北京信息职业技术学院',region:'R001',collegeId:'',contact:'院校管理员',phone:'',seats:5,status:'启用',created:'2026-11-01'},
{id:'SCH-002',name:'河北工业职业技术大学',region:'R001',collegeId:'',contact:'院校管理员',phone:'',seats:3,status:'启用',created:'2026-11-01'},
{id:'SCH-003',name:'山西职业技术学院',region:'R003',collegeId:'',contact:'院校管理员',phone:'',seats:3,status:'启用',created:'2026-11-01'}],users:[
{id:'SU001',school:'SCH-001',account:'bj_school',name:'北京院校管理员',type:'管理员',password:'123456',status:'启用'},
{id:'SU002',school:'SCH-002',account:'hb_school',name:'河北院校管理员',type:'管理员',password:'123456',status:'启用'},
{id:'SU003',school:'SCH-003',account:'sx_school',name:'山西院校管理员',type:'管理员',password:'123456',status:'启用'}]};
function get(){let v;try{v=JSON.parse(localStorage.getItem(KEY)||'null')}catch(_){v=null}
if(!v||typeof v!=='object'||Array.isArray(v)){v=structuredClone(initial);localStorage.setItem(KEY,JSON.stringify(v));return v}
if(!Array.isArray(v.schools))v.schools=structuredClone(initial.schools);
if(!Array.isArray(v.users))v.users=structuredClone(initial.users);
let changed=false;
v.schools=v.schools.filter(x=>x&&typeof x==='object').map(x=>{const seats=Number(x.seats);if(!Number.isFinite(seats)||seats<1){changed=true;return {...x,seats:Math.max(1,v.users.filter(u=>u&&u.school===x.id&&u.status==='启用').length)}}return {...x,seats}});
v.users=v.users.filter(x=>x&&typeof x==='object');
if(changed)localStorage.setItem(KEY,JSON.stringify(v));
return v}
function persist(v){localStorage.setItem(KEY,JSON.stringify(v))}
function requireItem(obj,what){if(!obj)throw Error(what+'不存在')}
function count(school,data=get()){return data.users.filter(x=>x.school===school&&x.status==='启用').length}
function saveSchool(input,id){const d=get(),name=String(input.name||'').trim(),seats=Number(input.seats),status=input.status||'启用';if(!name)throw Error('请输入院校名称');if(!Number.isSafeInteger(seats)||seats<1||seats>100000)throw Error('席位数量必须为1～100000的整数');if(!['启用','停用'].includes(status))throw Error('无效状态');if(d.schools.some(x=>x.name===name&&x.id!==id))throw Error('院校名称已存在');if(id){const s=d.schools.find(x=>x.id===id);requireItem(s,'院校');if(seats<count(id,d))throw Error('席位数不能小于已启用的 '+count(id,d)+' 个账号');Object.assign(s,{name,seats,status,region:input.region||'',collegeId:input.collegeId==='NONE'?'':(input.collegeId||''),contact:String(input.contact||''),phone:String(input.phone||''),province:String(input.province||s.province||''),level:String(input.level||s.level||'')});}else{const serial=Math.max(100,...d.schools.map(x=>Number(x.id.replace(/\D/g,''))||0))+1;id='SCH-'+String(serial).padStart(3,'0');d.schools.push({id,name,seats,status,region:input.region||'',collegeId:input.collegeId==='NONE'?'':(input.collegeId||''),contact:String(input.contact||''),phone:String(input.phone||''),province:String(input.province||''),level:String(input.level||''),created:new Date().toISOString().slice(0,10)})}persist(d);return id}
function saveUser(input,id){const d=get(),school=d.schools.find(x=>x.id===input.school),account=String(input.account||'').trim(),name=String(input.name||'').trim(),type=input.type||'普通用户',status=input.status||'启用';requireItem(school,'院校');if(!/^[a-zA-Z][a-zA-Z0-9_.-]{3,31}$/.test(account))throw Error('账号须为4～32位英文开头的字母、数字或下划线等字符');if(!name)throw Error('请输入姓名');if(!['管理员','教师','普通用户'].includes(type)||!['启用','停用'].includes(status))throw Error('账号类型或状态无效');if(d.users.some(x=>x.account.toLowerCase()===account.toLowerCase()&&x.id!==id)||window.MVERI_USERS?.get().users.some(x=>x.account.toLowerCase()===account.toLowerCase()))throw Error('该账号已存在');const old=id?d.users.find(x=>x.id===id):null;if(id)requireItem(old,'账号');const oldActive=old&&old.school===school.id&&old.status==='启用';if(status==='启用'&&!oldActive){if(school.status!=='启用')throw Error('院校已停用，不能启用账号');if(count(school.id,d)>=school.seats)throw Error('该院校授权席位已满，请先增加席位或停用其他账号')}const pass=String(input.password||'');if(!old&&pass.length<6)throw Error('初始密码至少6位');if(old){Object.assign(old,{school:school.id,account,name,type,status});if(pass){if(pass.length<6)throw Error('密码至少6位');old.password=pass}}else{const serial=Math.max(0,...d.users.map(x=>Number(x.id.replace(/\D/g,''))||0))+1;id='SU'+String(serial).padStart(3,'0');d.users.push({id,school:school.id,account,name,type,status,password:pass})}persist(d);return id}
function setUserStatus(id,status){const d=get(),u=d.users.find(x=>x.id===id);requireItem(u,'账号');saveUser({...u,status,password:''},id)}
window.MVERI_SCHOOL_LICENSE={get,count,saveSchool,saveUser,setUserStatus,KEY};
})();