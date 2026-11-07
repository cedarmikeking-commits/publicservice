/* 阶段一：具有状态反馈、部分评分的三步骤情境实训 */
(function(){
const originalRender=renderQ,originalGrade=grade;
renderQ=function(){
 if(!session)return;
 const q=session.paper[session.idx];if(q.type!=='gscenario')return originalRender();
 const ans=session.answers[q.id]||{}, done=q.decisions.filter((d,i)=>ans[i]!==undefined).length;
 const html=`<div class="panel"><div class="hint">第一阶段 · 通用数智能力 / ${session.idx+1} of ${session.paper.length} · ${esc(q.indicator)} · ${esc(q.pointCode)}</div><div class="progress"><div style="width:${done/3*100}%"></div></div><div class="question-palette">${session.paper.map((item,i)=>`<button class="${i===session.idx?'current':session.answers[item.id]!==undefined?'answered':''}" onclick="jump(${i})">${i+1}</button>`).join('')}</div><h2>${esc(q.stem)}</h2><p class="hint">${esc(q.scenario)}</p>${q.decisions.map((d,i)=>`<section class="gx-step"><b>${i+1}. ${esc(d.label)}</b><div>${d.options.map((opt,j)=>`<label class="check"><input type="radio" name="gx${i}" ${ans[i]===j?'checked':''} onchange="setGeneralDecision(${i},${j})">${esc(opt)}</label>`).join('')}</div></section>`).join('')}<div class="status">本题已完成 ${done}/3 项决策，交卷时按照每项决策分别计算。实际场景仍须人工与真实操作核验。</div><div class="actions"><button class="outline" onclick="move(-1)">上一题</button><button class="outline" onclick="move(1)">下一题</button><button onclick="finish()">${window.dualStage?.phase===1?'完成第一阶段':'提交测评'}</button></div></div>`;
 ($('examhost')||$('view')).innerHTML=html;
};
window.setGeneralDecision=function(i,j){let q=session.paper[session.idx],x=session.answers[q.id]||{};x[i]=j;session.answers[q.id]=x;renderQ()};
grade=function(q,a){if(q.type!=='gscenario')return originalGrade(q,a);let n=q.decisions.filter((d,i)=>a&&Number(a[i])===d.answer).length;return {score:Math.round(n/3*100),note:`三项操作决策正确 ${n}/3；本题仅为模拟情境，不代表真实操作能力已核验`}};
})();
