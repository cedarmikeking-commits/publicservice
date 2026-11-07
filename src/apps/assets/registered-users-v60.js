/* Personal self-registration directory shared within the same browser/origin. */
(function(){'use strict';const KEY='mveri_registered_users_v13';
function get(){try{const a=JSON.parse(localStorage.getItem(KEY));return Array.isArray(a)?a:[]}catch{return []}}
function write(a){localStorage.setItem(KEY,JSON.stringify(a))}
function setStatus(account,status){if(!['启用','停用'].includes(status))throw Error('账号状态无效');let a=get(),u=a.find(x=>x.account===account);if(!u)throw Error('注册账号不存在');u.status=status;write(a)}
function resetPassword(account,password){if(String(password).length<8)throw Error('密码至少8位');let a=get(),u=a.find(x=>x.account===account);if(!u)throw Error('注册账号不存在');u.password=password;write(a)}
window.MVERI_REGISTERED={KEY,get,setStatus,resetPassword};
})();