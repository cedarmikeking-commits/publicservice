/* V72.45: local-only synthetic personal sample accounts. No real identities. */
(()=>{'use strict';
const ACCOUNTS=[{"account":"demo_jobseeker","name":"陈晓晨","identity":"待就业劳动者","group":"jobseeker","goal":"提升就业能力","person":"DEMO45-01","password":"Demo@123456"},{"account":"demo_university","name":"周怡然","identity":"大学生","group":"university","goal":"做好实习与就业准备","person":"DEMO45-02","password":"Demo@123456"},{"account":"demo_vocational","name":"李嘉禾","identity":"职业院校学生","group":"vocational","goal":"强化数智能力","person":"DEMO45-03","password":"Demo@123456"},{"account":"demo_employee","name":"王明远","identity":"企业职工","group":"employee","goal":"提高数字化工作效率","person":"DEMO45-04","password":"Demo@123456"},{"account":"demo_transition","name":"赵子恒","identity":"转岗人员","group":"transition","goal":"分析转岗能力差距","person":"DEMO45-05","password":"Demo@123456"},{"account":"demo_flexible","name":"孙思敏","identity":"灵活就业人员","group":"flexible","goal":"提升可迁移能力","person":"DEMO45-06","password":"Demo@123456"},{"account":"demo_frontline","name":"刘志刚","identity":"普通岗位从业者","group":"frontline","goal":"掌握实用数字工具","person":"DEMO45-07","password":"Demo@123456"},{"account":"demo_teacher","name":"林慧文","identity":"职业院校教师","group":"teacher","goal":"提升教师数智素养","person":"DEMO45-08","password":"Demo@123456"}];
window.MVERI_PERSONAL_DEMO_ACCOUNTS=ACCOUNTS;
const read=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?f:v}catch{return f}};
try{
  const key='mveri_registered_users_v13';
  const users=read(key,[]);
  if(Array.isArray(users)){
    let touched=false;
    for(const d of ACCOUNTS){if(!users.some(u=>u.account===d.account)){
      users.push({account:d.account,password:d.password,name:d.name,role:'personal',person:d.person,org:'',label:'演示账号 · '+d.identity,status:'启用',sourceLabel:'八类职业身份演示',careerGroup:d.group,createdAt:'2026-11-06T00:00:00.000Z'}); touched=true;
    }}
    if(touched)localStorage.setItem(key,JSON.stringify(users));
  }
  const ck='mveri_personal_career_v7243';const profiles=read(ck,{});
  if(profiles&&typeof profiles==='object'&&!Array.isArray(profiles)){
    let changed=false;
    for(const d of ACCOUNTS){if(!profiles[d.account]){profiles[d.account]={group:d.group,goal:d.goal,notes:'演示职业身份与发展目标，可在职业发展规划中修改',updated:'2026-11-06'};changed=true}}
    if(changed)localStorage.setItem(ck,JSON.stringify(profiles));
  }
  const dataKey='mveri_demo_20261031_v1';const seed=window.MVERI_SEED;
  const data=read(dataKey,null)|| (seed?JSON.parse(JSON.stringify(seed)):null);
  if(data&&Array.isArray(data.people)){
    let changed=false;
    for(const d of ACCOUNTS){if(!data.people.some(p=>p.id===d.person)){
      data.people.push({id:d.person,name:d.name,org:'',title:d.identity,account:d.account});changed=true;
    }}
    if(changed)localStorage.setItem(dataKey,JSON.stringify(data));
  }
}catch(err){console.warn('演示账号初始化失败：请检查浏览器存储权限',err)}
})();
