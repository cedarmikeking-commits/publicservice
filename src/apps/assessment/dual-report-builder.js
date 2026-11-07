/* Report Builder 双体系独立配置、报告与导出，沿用既有教师轮盘 */
(function () {
  const originalRefresh = refresh,
    originalConfig = config,
    originalApply = apply;
  const safe = escapeHTML;
  function generalPanel() {
    const fw = window.GENERAL_FRAMEWORK;
    if (!fw) return "";
    const demo = $("source").value === "demo",
      record = demo ? null : getRecord(),
      entries = record?.items?.filter((x) => x.q?.framework === "general") || [];
    let rows = fw.level1
      .map((root, i) => {
        let children = fw.level2.filter((u) => u.parent === root.code);
        let get = (u) => entries.filter((x) => x.q?.indicator === u.code),
          score = (a) => (a.length ? Math.round(a.reduce((s, x) => s + Number(x.score || 0), 0) / a.length) : null);
        let items = children.flatMap(get),
          value = demo ? 70 + i * 4 : score(items);
        let color = ["#0a8275", "#357db5", "#9673c4", "#d49b48", "#cd7087", "#70859b"][i];
        let line = `<div class="legend-row"><i style="background:${color}"></i><span>${safe(root.code + " " + root.name)}</span><b>${value === null ? "未测量" : value + "分"}</b></div><div class="bar" style="--accent:${color}"><i style="width:${value ?? 0}%"></i></div>`;
        if ($("showGeneralDetails").checked)
          line += children
            .map((u, j) => {
              let sub = demo ? Math.min(97, 62 + ((i * 9 + j * 7) % 35)) : score(get(u));
              return `<div style="padding:6px 12px 6px 22px;display:flex;justify-content:space-between;border-bottom:1px solid #eef1f2"><span>${safe(u.code + " " + u.name)}</span><b>${sub === null ? "未测量" : sub + "分"}</b></div>`;
            })
            .join("");
        return `<div style="padding:12px;border:1px solid #e4e9e9;border-radius:12px;margin:8px 0">${line}</div>`;
      })
      .join("");
    const note = demo
      ? "模拟示例结果，仅供报告展示"
      : !record
        ? "尚无真实测评记录"
        : `真实记录共 ${entries.length} 道通用能力试题`;
    return `<section class="report-section"><div class="section-head"><h2>第一部分 · 通用数智能力</h2></div><p>${note}。独立分析6个能力领域、22个能力单元。没有被抽取的能力单元不推断得分。</p>${rows}<p class="muted">依据《通用数智能力框架》3.3报审稿；示例/训练题未经专家审定。评分为本次样本表现，不构成能力认证。</p></section>`;
  }
  refresh = function () {
    originalRefresh();
    let report = $("report");
    let body = report.querySelector(".report-body");
    if (!body) return;
    const existing = body.querySelector(".general-report-v13");
    if (existing) existing.remove();
    const showGeneral = $("showGeneral").checked,
      showTeacher = $("showTeacher").checked;
    if (showGeneral) {
      let section = document.createElement("div");
      section.className = "general-report-v13";
      section.innerHTML = generalPanel();
      body.prepend(section);
    }
    body.querySelectorAll(":scope > .report-section").forEach((e) => {
      e.hidden = !showTeacher;
    });
    let tags = report.querySelector(".cover .tags");
    if (tags) {
      tags.innerHTML =
        (showGeneral ? '<span class="tag">通用：6领域 · 22单元</span>' : "") +
        (showTeacher ? '<span class="tag">教师：5一级 · 13二级 · 33三级</span>' : "") +
        ($("source").value === "demo" ? '<span class="tag">演示数据</span>' : "");
    }
  };
  config = function () {
    let v = originalConfig();
    v.showGeneral = $("showGeneral").checked;
    v.showTeacher = $("showTeacher").checked;
    v.showGeneralDetails = $("showGeneralDetails").checked;
    return v;
  };
  apply = function (v) {
    for (let id of ["showGeneral", "showTeacher", "showGeneralDetails"]) if (v[id] != null) $(id).checked = !!v[id];
    originalApply(v);
  };
  refresh();
})();
