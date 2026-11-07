/* 通用能力任务实训：选择、排序、配置、核验与成果表达；不代表真实外部软件操作 */
(function(){
const previousRender=renderQ, previousGrade=grade;
const safe=x=>esc(String(x??''));
const modes={gmatch:'工作任务与措施匹配',gsequence:'工作流程排序',gsettings:'数字平台权限配置',gscenario2:'分阶段任务处置',gcompose:'成果草案及核验'};
window.taskAnswer=function(k,v){const q=session.paper[session.idx];let a=session.answers[q.id]||{};a[k]=v;session.answers[q.id]=a;renderQ()};
renderQ=function(){if(!session)return;let q=session.paper[session.idx];if(q.type!=='gtask')return previousRender();let a=session.answers[q.id]||{};
let body='';
if(q.mode==='gsequence')body=q.steps.map((s,i)=>`<label class="field">${safe(s)}<select onchange="taskAnswer('s${i}',this.value)"><option value="">选择执行顺序</option>${q.steps.map((_,j)=>`<option value="${j}" ${a['s'+i]===String(j)?'selected':''}>第${j+1}步</option>`).join('')}</select></label>`).join('');
else if(q.mode==='gsettings')body=q.settings.map((s,i)=>`<label class="field">${safe(s.label)}<select onchange="taskAnswer('c${i}',this.value)"><option value="">请选择</option>${s.choices.map((c,j)=>`<option value="${j}" ${a['c'+i]===String(j)?'selected':''}>${safe(c)}</option>`).join('')}</select></label>`).join('');
else if(q.mode==='gcompose')body=`<label class="field">用自己的话写出针对任务的处理方案（含目标、操作、核验与安全）<textarea rows="5" oninput="taskAnswerDraft(this.value)">${safe(a.draft||'')}</textarea></label><p class="hint">本题仅记录完整性特征；内容质量须人工评价，自动分数不代表能力达标。</p>`;
else body=q.choices.map((c,i)=>`<label class="check"><input type="checkbox" ${a['c'+i]?'checked':''} onchange="taskAnswer('c${i}',this.checked)">${safe(c)}</label>`).join('');
const html=`<div class="panel"><div class="hint">第一阶段 · 通用能力 / ${session.idx+1} / ${session.paper.length} · ${safe(q.pointCode)} · ${safe(modes[q.mode])}</div><div class="question-palette">${session.paper.map((v,i)=>`<button class="${i===session.idx?'current':session.answers[v.id]!==undefined?'answered':''}" onclick="jump(${i})">${i+1}</button>`).join('')}</div><h2>${safe(q.stem)}</h2><p class="hint">任务背景：${safe(q.scenario)}</p><div class="workspace"><p><b>目标：</b>${safe(q.goal)}</p>${body}</div><p class="hint">评价依据：${q.rubric.map(safe).join(' · ')}</p><div class="actions"><button class="outline" onclick="move(-1)">上一题</button><button class="outline" onclick="move(1)">下一题</button><button onclick="finish()">${window.dualStage?.phase===1?'完成通用能力阶段':'提交测评'}</button></div></div>`;
($('examhost')||$('view')).innerHTML=html;
};
window.taskAnswerDraft=function(v){const q=session.paper[session.idx];let a=session.answers[q.id]||{};a.draft=v;session.answers[q.id]=a};
grade=function(q,a){if(q.type!=='gtask')return previousGrade(q,a);a=a||{};
if(q.mode==='gcompose'){let words=(a.draft||'').trim();return {score:null,note:words?'已提交成果草案，须人工评价；不计入自动分数':'未提交成果，待完成'};}
if(q.mode==='gsequence'){let got=q.steps.reduce((n,_,i)=>n+(a['s'+i]===String(i)?1:0),0);return{score:Math.round(got/q.steps.length*100),note:`操作流程正确 ${got}/${q.steps.length}；属于步骤模拟`};}
if(q.mode==='gsettings'){let got=q.settings.reduce((n,s,i)=>n+(a['c'+i]===String(s.correct)?1:0),0);return{score:Math.round(got/q.settings.length*100),note:`配置选择正确 ${got}/${q.settings.length}；未连接真实平台`};}
let got=q.choices.reduce((n,_,i)=>n+(!!a['c'+i]===(i<3)?1:0),0);return{score:Math.round(got/q.choices.length*100),note:`任务措施选择正确 ${got}/${q.choices.length}；仅作模拟决策`};
};
})();
