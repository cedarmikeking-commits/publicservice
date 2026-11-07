/* V21.2 考评点主数据展示：只读数据视图。 */
window.WBZYPointMaster = (function(){
'use strict';
const data=window.WBZY_MASTER_DATA||{records:[],meta:{}};
let term='',system='all',pageIndex=1,selected='',tab='overview';
const PAGE=20;
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function recs(){const k=term.trim().toLowerCase();return data.records.filter(p=>(system==='all'||p.system===system)&&(!k||[p.pointCode,p.pointName,p.sourceCode,p.originalText,p.analysis.knowledgeObject,p.analysis.observableTask].join(' ').toLowerCase().includes(k)));}
function download(name,content,mime){const blob=new Blob([content],{type:mime||'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function schema(){return [
 ['身份信息','pointCode / system / sourceCode / pointName','原考评点永久编码、指标体系、原文编码、名称'],
 ['来源追溯','originalText / source','指标原文与原文层的结构化分析'],
 ['语义能力','analysis.conceptBoundary / categories / prerequisiteSpecific','概念边界、类别、前置知识'],
 ['选择和任务','analysis.selectionDecision / observableTask','工具选择条件与可执行评价任务'],
 ['评价要求','analysis.evaluationEvidence / originalAction / originalEvidence','证据、原始评价行为与依据'],
 ['质量和版本','reviewStatus / version / analysis.reviewFlag','待复核状态、分析版本及风险标记']
];}
function section(name,val){if(Array.isArray(val))val=val.join('、');if(val&&typeof val==='object')val=JSON.stringify(val,null,2);return '<div class="pm-detail-row"><b>'+esc(name)+'</b><div>'+esc(val||'未提供')+'</div></div>';}
function detail(p){if(!p)return '<div class="pm-empty">请选择左侧列表中的考评点</div>';const a=p.analysis||{};return '<div class="pm-detail-title"><div><div class="pm-muted">考评点编码 '+esc(p.pointCode)+'</div><h3>'+esc(p.pointName)+'</h3></div><span class="pm-tag">'+esc(p.reviewStatus)+'</span></div>'+
'<div class="pm-detail-grid">'+section('指标体系',p.system)+section('原文编码',p.sourceCode)+section('原始指标全文',p.originalText)+section('当前能力阶段',a.currentStage)+section('知识对象',a.knowledgeObject)+section('概念与边界',a.conceptBoundary)+section('类别或典型实例',a.categories)+section('具体前置认知',a.prerequisiteSpecific)+section('工具与任务选择条件',a.selectionDecision)+section('可观察评价任务',a.observableTask)+section('评价证据',a.evaluationEvidence)+section('原始评价行为',a.originalAction)+section('原始证据要求',a.originalEvidence)+section('质量风险与复核意见',a.reviewFlag)+' '+section('处理建议',a.suggestedDisposition)+section('数据分析版本',p.version.semanticAnalysis)+'</div>';
}
function renderTable(){const items=recs(),pages=Math.max(1,Math.ceil(items.length/PAGE));pageIndex=Math.min(Math.max(1,pageIndex),pages);const slice=items.slice((pageIndex-1)*PAGE,pageIndex*PAGE);const root=document.getElementById('pmResults');if(!root)return;
root.innerHTML='<div class="pm-resulttop"><b>主数据明细 · '+items.length+'条</b><span>第 '+pageIndex+' / '+pages+' 页 · 每页'+PAGE+'条</span></div><div class="pm-table-scroll"><table class="pm-table"><thead><tr><th>考评点编码</th><th>体系</th><th>对应原文</th><th>考评点名称</th><th>分析状态</th><th>操作</th></tr></thead><tbody>'+slice.map(p=>'<tr><td><b>'+esc(p.pointCode)+'</b></td><td>'+esc(p.system)+'</td><td>'+esc(p.sourceCode)+'</td><td>'+esc(p.pointName)+'</td><td><span class="pm-tag">'+esc(p.reviewStatus)+'</span></td><td><button class="secondary" type="button" data-pmcode="'+esc(p.pointCode)+'">查看主数据</button></td></tr>').join('')+'</tbody></table></div><div class="pm-pager"><button type="button" class="secondary" id="pmPrev" '+(pageIndex<=1?'disabled':'')+'>上一页</button><span>'+pageIndex+'/'+pages+'</span><button type="button" class="secondary" id="pmNext" '+(pageIndex>=pages?'disabled':'')+'>下一页</button></div>';
root.querySelectorAll('[data-pmcode]').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.pmcode;const p=data.records.find(x=>x.pointCode===selected);const d=document.getElementById('pmDetail');if(d){d.innerHTML=detail(p);d.scrollIntoView({behavior:'smooth',block:'nearest'});}}));root.querySelector('#pmPrev').addEventListener('click',()=>{--pageIndex;renderTable()});root.querySelector('#pmNext').addEventListener('click',()=>{++pageIndex;renderTable()});
}
function page(){const general=data.records.filter(x=>x.system==='通用数智能力').length,teacher=data.records.filter(x=>x.system==='教师素智素养').length;
return '<section class="panel"><div class="h"><div><h2>考评点主数据模型</h2><p class="pm-muted">统一管理考评点身份、指标原文、深度语义、评价任务与版本追溯的数据视图</p></div><span class="pm-tag">V21.2 · 只读汇聚</span></div><p class="pm-muted">当前为离线只读主数据目录，引用 V21.1 分析成果；原始考评点、题库和智能体尚未全部迁移到统一写入服务。</p></section>'+
'<div class="pm-kpis"><div><b>'+data.records.length+'</b><span>考评点主记录</span></div><div><b>'+general+'</b><span>通用数智能力</span></div><div><b>'+teacher+'</b><span>教师素智素养</span></div><div><b>'+data.meta.sourceCount+'</b><span>来源原文条目</span></div></div>'+
'<section class="panel"><div class="h"><h3>主数据结构与关联规则</h3><button type="button" class="secondary" id="pmSchemaBtn">'+(tab==='schema'?'收起字段说明':'查看字段定义')+'</button></div><div class="pm-chain">指标体系版本 <span>→</span> 末级指标原文 <span>→</span> 考评点永久编码 <span>→</span> 深度语义分析 <span>→</span> 行为与证据 <span>→</span> 后续命题引用</div><div id="pmSchema" style="display:'+(tab==='schema'?'block':'none')+'"><table class="pm-schema"><thead><tr><th>数据域</th><th>字段</th><th>含义</th></tr></thead><tbody>'+schema().map(s=>'<tr>'+s.map(v=>'<td>'+esc(v)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div></section>'+
'<section class="panel"><div class="pm-controls"><select id="pmSystem"><option value="all">全部指标体系</option><option value="通用数智能力">通用数智能力</option><option value="教师素智素养">教师素智素养</option></select><input id="pmSearch" placeholder="搜索编码、原文、考评点、任务或知识对象" value="'+esc(term)+'"><button type="button" class="secondary" id="pmExport">导出筛选主数据 JSON</button></div><div id="pmResults"></div></section><section class="panel"><div class="h"><h3>考评点完整主数据</h3><span class="pm-muted">点击列表中的「查看主数据」</span></div><div id="pmDetail">'+detail(data.records.find(x=>x.pointCode===selected))+'</div></section>';
}
function after(){const sel=document.getElementById('pmSystem'),search=document.getElementById('pmSearch'),schemaBtn=document.getElementById('pmSchemaBtn'),exportBtn=document.getElementById('pmExport');if(!sel)return;sel.value=system;sel.addEventListener('change',()=>{system=sel.value;pageIndex=1;renderTable()});search.addEventListener('input',()=>{term=search.value;pageIndex=1;renderTable()});schemaBtn.addEventListener('click',()=>{tab=tab==='schema'?'overview':'schema';document.getElementById('pmSchema').style.display=tab==='schema'?'block':'none';schemaBtn.textContent=tab==='schema'?'收起字段说明':'查看字段定义'});exportBtn.addEventListener('click',()=>download('考评点主数据_筛选导出_V21.2.json',JSON.stringify({meta:data.meta,records:recs()},null,2)));renderTable();}
return {page,after};
})();
