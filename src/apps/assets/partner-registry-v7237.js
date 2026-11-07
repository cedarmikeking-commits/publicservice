/* V72.37 Partner lifecycle demo store: only local browser persistence. */
(function(g){'use strict';const K='mveri_ecosystem_partners_v7237';const S='mveri_partner_session_v7237';
const seed=[{id:'EP-DEMO-01',name:'示例教育科技服务机构',type:'教育科技',contact:'演示负责人',phone:'',email:'',description:'用于说明合作伙伴审批与资源协作流程的虚构演示机构，不代表任何真实合作关系。',status:'已通过',account:'partner_demo',password:'Demo@123456',scope:['课程资源','技术支持'],created:'2026-11-03',projects:[{id:'P-DEMO-01',name:'数智课程资源共建（演示）',stage:'执行中',note:'仅供演示流程'}],resources:[{id:'R-DEMO-01',title:'课程资源样例',kind:'课程',status:'待审核',note:'演示资料'}]}];
const clone=x=>JSON.parse(JSON.stringify(x));const get=()=>{try{const a=JSON.parse(localStorage.getItem(K));return Array.isArray(a)?a:clone(seed)}catch{return clone(seed)}};
const set=a=>{if(!Array.isArray(a))throw Error('无效的伙伴数据');localStorage.setItem(K,JSON.stringify(a))};
const find=id=>get().find(x=>x.id===id);
const upsert=record=>{const a=get(),i=a.findIndex(x=>x.id===record.id);if(i<0)a.unshift(record);else a[i]=record;set(a);return record};
const audit=(record,action,note)=>{record.history=record.history||[];record.history.unshift({time:new Date().toLocaleString('zh-CN'),action,note:String(note||'')});upsert(record)};
const validPassword=(a,p)=>{try{const changed=JSON.parse(localStorage.getItem('mveriDemoPasswords')||'{}');return p===(changed[a.account]||a.password)}catch{return p===a.password}};
g.MVERI_PARTNER_REGISTRY={key:K,sessionKey:S,get,set,find,upsert,audit,validPassword,seed:clone(seed)};
})(window);
