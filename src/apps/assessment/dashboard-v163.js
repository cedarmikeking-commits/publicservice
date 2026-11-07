/* V16.4 运营总览：只读数据与业务闭环说明，业务操作使用导航菜单 */
(function () {
  "use strict";
  const style = document.createElement("style");
  style.textContent = `
.v163-home .panel{margin-bottom:18px}.v163-home .overview-systems{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin:18px 0}.v163-home .overview-system{border:1px solid #dce6ee;border-radius:16px;padding:20px;background:#fff;min-width:0}.v163-home .overview-system h3{margin:0 0 7px;font-size:17px;color:#1c3041}.v163-home .overview-summary{color:#536778;font-size:13px;margin:0 0 14px}.v163-home .overview-counts{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0 17px}.v163-home .overview-count{border-radius:11px;padding:13px;background:#f4f7fb}.v163-home .overview-count strong{display:block;color:#162e44;font-size:28px;line-height:1.25;letter-spacing:-.5px}.v163-home .overview-count small{display:block;color:#536778;font-size:12px;line-height:1.5;margin-top:5px}.v163-home .overview-count.important{background:#e8f6f2}.v163-home .overview-count.important strong{color:#087e70}.v163-home .overview-actions{display:flex;flex-wrap:wrap;gap:8px}.v163-home .overview-actions button{border-radius:9px!important;padding:9px 12px!important;min-height:37px!important;background:#fff!important;color:#14668a!important;border:1px solid #b9d3e0!important;font-weight:600!important}.v163-home .overview-actions button:first-child{background:#eaf3ff!important;color:#095eac!important}.v163-home .overview-actions button:hover{border-color:#0873ed!important;background:#edf5ff!important}.v163-home .overview-quick{display:flex;gap:10px;flex-wrap:wrap;margin-top:13px}.v163-home .overview-quick button{background:#fff!important;color:#1f4867!important;border:1px solid #cbdbe6!important;padding:10px 14px!important;border-radius:10px!important}.v163-home .overview-quick button:hover{background:#eef6fd!important}.v163-home .overview-note{font-size:12px;color:#637789;margin-top:13px;line-height:1.7}.v163-home .overview-eyebrow{display:inline-block;font-weight:650;font-size:12px;color:#138477;background:#eaf8f5;padding:5px 9px;border-radius:7px;margin-bottom:9px}.v163-home .overview-steps{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:9px;margin:12px 0 24px}.v163-home .overview-step{display:flex;flex-direction:column;text-align:left;align-items:flex-start;gap:7px;background:white!important;color:#193448!important;border:1px solid #dce6ee!important;padding:14px!important;border-radius:12px!important;min-width:0;min-height:112px;box-shadow:none!important;cursor:default!important}.v163-home .overview-step .step-num{font-size:11px;background:#e5f5f2;color:#00786b;border-radius:6px;padding:4px 6px}.v163-home .overview-step strong{font-size:14px;color:#193448}.v163-home .overview-step small{font-size:11px;color:#6a7c8b;line-height:1.5}.v163-home .overview-section-title{font-weight:700;color:#193448;margin:19px 0 3px}.v163-home .overview-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.v163-home .overview-metrics .overview-stat{background:#fff!important;text-align:left!important;color:#1b354a!important;border:1px solid #d9e5ef!important;border-radius:12px!important;padding:16px!important}.v163-home .overview-metrics span{display:block;color:#687c8d;font-size:12px}.v163-home .overview-metrics strong{display:block;font-size:26px;color:#1b354a;margin-top:7px}.v163-home .overview-coverage{overflow-x:auto}@media(max-width:1100px){.v163-home .overview-steps{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:760px){.v163-home .overview-systems{grid-template-columns:1fr}.v163-home .overview-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.v163-home .overview-steps{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:400px){.v163-home .overview-steps{grid-template-columns:1fr 1fr}.v163-home .overview-counts{gap:7px}}`;
  document.head.appendChild(style);
  function safeNum(x) {
    return Number.isFinite(+x) ? +x : 0;
  }
  function gp() {
    try {
      let a = JSON.parse(localStorage.getItem("digital_assessment_general_point_records_v152"));
      if (Array.isArray(a) && a.length) return a;
    } catch (e) {}
    return window.EXTRACTED_GENERAL_POINTS || [];
  }
  function tp() {
    try {
      let a = JSON.parse(localStorage.getItem("teacher_assessment_points_v11"));
      if (Array.isArray(a) && a.length) return a;
    } catch (e) {}
    return window.ASSESSMENT_POINTS || [];
  }
  function navTo(section) {
    switchView(section);
  }
  window.overviewGo = function (system, destination) {
    if (destination === "indicators") {
      if (typeof selectIndicatorFramework === "function") selectIndicatorFramework(system);
      navTo("indicators");
      return;
    }
    if (destination === "points") {
      navTo("points");
      if (typeof unifiedPointFilter === "function") unifiedPointFilter("framework", system);
      return;
    }
    if (destination === "plans") {
      navTo("plans");
      return;
    }
    if (destination === "bank") {
      navTo("bank");
      return;
    }
    if (destination === "blueprint") {
      navTo("blueprint");
      return;
    }
    navTo(destination);
  };
  const mkCard = (name, system, desc, levels, sourceLabel, sourceCount, pointCount) =>
    `<section class="overview-system"><div class="overview-eyebrow">${name === "通用数智能力" ? "通用能力框架" : "教师职业能力框架"}</div><h3>${name}</h3><p class="overview-summary">${desc}</p><div class="overview-counts"><div class="overview-count"><strong>${sourceCount}</strong><small>${sourceLabel}</small></div><div class="overview-count important"><strong>${pointCount}</strong><small>已萃取候选考评点</small></div></div><p class="overview-summary">指标层级：${levels}</p></section>`;
  /* V20.8 product architecture: read-only, static business layers; rendered by actual dashboard override */
  function productArchitecture() {
    const tile = (title, sub, tag) =>
      `<div class="pa-tile"><div class="pa-tile-title">${title}</div><div class="pa-tile-sub">${sub}</div>${tag ? `<span class="pa-tile-tag">${tag}</span>` : ""}</div>`;
    const lane = (name, note, inner, code) =>
      `<div class="pa-lane pa-${code}"><div class="pa-lane-label"><span class="pa-layer-no">${code}</span><strong>${name}</strong><small>${note}</small></div><div class="pa-lane-body">${inner}</div></div>`;
    const arrow = (label) => `<div class="pa-flow"><span>↑</span><small>${label}</small></div>`;
    return `<section class="panel pa-panel" aria-label="产品架构图"><div class="pa-heading"><div><div class="pa-kicker">PRODUCT ARCHITECTURE · V20.9</div><h2>多体系数智能力测评平台 · 产品架构图</h2><p class="muted">以标准体系为源头、考评点为评价依据、试题为测评载体、数据与报告为反馈闭环；专项智能体贯穿生产与分析流程。</p></div><span class="pa-chip">业务与功能架构</span></div>
 <div class="pa-board" role="img" aria-label="平台六层业务架构，顶部平台支撑与治理，底部标准与依据，业务由下向上推进">
 <div class="pa-foundation"><div class="pa-foundation-heading"><span class="pa-layer-no">06</span><strong>平台支撑与治理</strong></div><div class="pa-foundation-items"><span>智能体协同中心：编排 · 跟踪 · 交接 · 质量闸门</span><span>标准与试题版本追溯</span><span>本地数据存储 / 导出备份</span><span>权限与审定机制（持续完善）</span></div></div>
 ${lane("分析报告层", "结果反馈 / 持续提升", tile("报告智能体", "个人画像 · 团队汇总 · 薄弱项分析", "专项智能体") + tile("报告构建与展示", "能力维度 · 评价依据 · 改进建议", "个人 / 团队") + tile("补训与复测", "针对性学习 · 复测验证 · 闭环追踪", "持续提升"), "05")}
 ${arrow("测评结果 / 可审计证据")}
 ${lane("测评执行层", "前端用户实际操作", tile("测评蓝图与随机抽题", "指标覆盖 · 难度约束 · 组卷", "测评组织") + tile("在线答题与交互实训", "选择 · 排序 · 设备仿真 · 标注 · 表格 · 流程", "学生/教师端") + tile("评分与证据记录", "客观判分 · 任务证据 · 人工核验", "测评记录"), "04")}
 ${arrow("发布题池 / 测评蓝图")}
 ${lane("命题与题库层", "试题生产 / 审定流转", tile("命题智能体", "题干 · 选项 · 参考答案 · 规则检查", "草案") + tile("命题计划 / 题型管理", "任务安排 · 题型组件 · 交互规范", "生产管理") + tile("试题维护 / 审核发布", "查看作答 · 编辑 · 质量审核 · 发布", "题库资产"), "03")}
 ${arrow("考评点与题型方案 / 人工复核")}
 ${lane("能力建模层", "从原文到可测能力", tile("考评点拆解智能体", "语义拆解 · 行为 · 证据 · 质量核验", "专项智能体") + tile("考评点管理", "归属 · 顺序 · 难度 · 原文追溯", "候选与复核") + tile("题型生成智能体", "题型结构 · 交互方式 · 评分方案", "专项智能体"), "02")}
 ${arrow("末级指标原文 / 指标版本")}
 ${lane("标准与依据层", "标准管理 / 版本控制", tile("多指标体系管理", "新增与导入 · 层级维护 · 启停用 · 独立发布", "标准基线") + tile("通用数智能力", "6领域 · 22能力单元 · 78条原文", "现有体系") + tile("教师素智素养", "5一级 · 13二级 · 33三级", "现有体系"), "01")}
 </div><div class="pa-footer"><span><b>蓝绿色：</b>当前已有功能或数据入口</span><span><b>注意：</b>智能体为离线规则辅助，部分题型和跨设备协同尚未实现完整生产能力；架构图表达产品结构，不代表全部功能已验收。</span></div></section>`;
  }
  function loop(title, subtitle, items) {
    return `<h3 class="overview-section-title">${title}</h3><p class="muted tiny">${subtitle}</p><div class="overview-steps">${items.map((x, i) => `<div class="overview-step" aria-label="${x[0]}"><span class="step-num">${String(i + 1).padStart(2, "0")}</span><strong>${x[0]}</strong><small>${x[2]}</small></div>`).join("")}</div>`;
  }
  home = function () {
    const general = gp(),
      teacher = tp();
    const source = (window.GENERAL_FRAMEWORK?.points || []).length;
    const teacherSources = (window.INDICATOR_TREE?.level3 || []).length;
    const qs = state.questions || [];
    const stats = [
      ["试题总量", qs.length, "bank"],
      ["已发布", qs.filter((q) => q.status === "已发布").length, "bank"],
      ["待审定", qs.filter((q) => q.status === "待审定").length, "bank"],
      ["草稿及退回", qs.filter((q) => ["草稿", "退回修订"].includes(q.status)).length, "plans"],
    ];
    return `<div class="v163-home">${productArchitecture()}<section class="panel"><div class="h"><div><h2>多体系测评运营总览</h2><p class="muted">两套指标体系独立保留来源，考评点统一萃取、统一命题与评价。</p></div><span class="pill">当前为本地运营数据</span></div><div class="overview-systems">${mkCard("通用数智能力", "general", "6个领域 · 22个能力单元", "6级领域 / 22个能力单元", "能力要求原文（非考评点）", source, general.length)}${mkCard("教师素智素养", "teacher", "5个一级 · 13个二级 · 33个三级指标", "5个一级 / 13个二级 / 33个三级", "三级指标原文（非考评点）", teacherSources, teacher.length)}</div><p class="overview-note">统计口径：78为通用框架能力要求原文数量；33为教师体系三级指标数量。考评点为依据原文拆解的独立可评价行为，目前均为候选内容，需专家审定。编辑后的本地考评点数量优先于初始 JS 数据。</p></section><section class="panel"><h2>双闭环业务操作中心</h2><p class="muted">展示两个业务闭环的流程及职责；具体业务操作请使用左侧导航或右上角快捷入口。</p>${loop(
      "后台生产闭环",
      "指标 → 考评点 → 题型 → 命题 → 审核 → 试题库",
      [
        ["指标", "indicators", "标准与原文"],
        ["考评点", "points", "萃取与审定"],
        ["题型", "types", "交互与评分"],
        ["命题", "plans", "人工/智能体"],
        ["审核", "bank", "审定与发布"],
        ["试题库", "bank", "维护与追溯"],
      ],
    )}${loop("前台评价闭环", "测评蓝图 → 随机抽题 → 在线实训 → 评价 → 能力报告 → 补训与复测", [
      ["测评蓝图", "blueprint", "组卷约束"],
      ["随机抽题", "front", "联合测评"],
      ["在线实训", "practicefront", "任务操作"],
      ["评价", "frontreports", "评分与证据"],
      ["能力报告", "report", "报告构建"],
      ["补训与复测", "retrainfront", "专项训练"],
    ])}</section><section class="panel"><h2>题库运营数据</h2><p class="muted">以下仅展示当前后台管理数据，不等同于两套示例题库总量。</p><div class="overview-metrics">${stats.map((a) => `<div class="overview-stat"><span>${a[0]}</span><strong>${a[1]}</strong></div>`).join("")}</div></section></div>`;
  };
  if (view === "home") render();
})();
