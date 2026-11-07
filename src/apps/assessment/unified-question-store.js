/* 双体系统一试题管理数据层：离线模式使用 localStorage；可导出 JS 部署快照。 */
(function (w) {
  "use strict";
  const KEY = "dual_framework_unified_q_v15",
    HISTORY = "dual_framework_unified_history_v15",
    DRAFT_EDIT_KEY = "wbzy_v181_draft_edits";
  const clone = (x) => JSON.parse(JSON.stringify(x));
  function seed() {
    let all = [...(w.GENERAL_BANK || []), ...(w.GENERAL_INTERACTIONS || []), ...(w.GENERAL_TASK_BANK || [])];
    const general = all.map((q) => ({
      ...clone(q),
      framework: "general",
      status: "训练样例",
      version: 1,
      source: "原始通用样例",
      assessmentPointCode: q.pointCode || q.assessmentPointCode || "",
      versions: [],
    }));
    const st = w.PlatformStore?.read?.() || {};
    const teacher = [...(st.bank || []), ...(w.PRACTICAL_BANK || [])].map((q) => ({
      ...clone(q),
      framework: "teacher",
      status: q.status || "已发布",
      version: q.version || 1,
      assessmentPointCode: q.assessmentPointCode || "",
      versions: [],
    }));
    return [...general, ...teacher.filter((q) => !general.some((x) => x.id === q.id))];
  }
  let memo = null;
  function get() {
    if (memo) return memo;
    let raw,
      base,
      edits = [];
    try {
      raw = localStorage.getItem(KEY);
      edits = JSON.parse(localStorage.getItem(DRAFT_EDIT_KEY) || "[]");
    } catch {}
    try {
      base = raw ? JSON.parse(raw) : seed();
    } catch {
      base = seed();
    }
    const byId = new Map(base.map((q) => [q.id, q]));
    for (const q of w.WBZY_DRAFT_QUESTIONS || []) if (!byId.has(q.id)) byId.set(q.id, q);
    for (const q of edits) byId.set(q.id, q);
    // 示例与历史本地缓存并存；固定编码去重，绝不覆盖用户已编辑的数据。
    for (const q of w.WBZY_TYPE_EXAMPLES || []) if (!byId.has(q.id)) byId.set(q.id, clone(q));
    memo = [...byId.values()];
    return memo;
  }
  function write(x) {
    memo = null;
    const draftIds = new Set((w.WBZY_DRAFT_QUESTIONS || []).map((q) => q.id));
    const original = new Map((w.WBZY_DRAFT_QUESTIONS || []).map((q) => [q.id, q]));
    const edited = x.filter((q) => draftIds.has(q.id) && JSON.stringify(q) !== JSON.stringify(original.get(q.id)));
    const regular = x.filter((q) => !draftIds.has(q.id));
    localStorage.setItem(KEY, JSON.stringify(regular));
    localStorage.setItem(DRAFT_EDIT_KEY, JSON.stringify(edited));
    window.dispatchEvent(new Event("dual-bank-updated"));
  }
  function audit() {
    try {
      return JSON.parse(localStorage.getItem(HISTORY) || "[]");
    } catch {
      return [];
    }
  }
  function addAudit(action, q, before) {
    let rows = audit();
    rows.unshift({
      date: new Date().toISOString(),
      action,
      id: q.id,
      framework: q.framework,
      status: q.status,
      version: q.version,
      before: before ? clone(before) : null,
    });
    localStorage.setItem(HISTORY, JSON.stringify(rows.slice(0, 2000)));
  }
  function upsert(q) {
    let rows = get(),
      i = rows.findIndex((x) => x.id === q.id),
      before = i >= 0 ? rows[i] : null;
    let data = {
      ...q,
      version: before ? (before.version || 1) + 1 : 1,
      updated: new Date().toISOString(),
      versions: before
        ? [
            ...(before.versions || []),
            {
              version: before.version || 1,
              snapshot: clone({ ...before, versions: undefined }),
              date: before.updated || "",
            },
          ]
        : [],
    };
    if (i >= 0) rows[i] = data;
    else rows.unshift(data);
    write(rows);
    addAudit(before ? "编辑" : "新增", data, before);
    return data;
  }
  function status(id, next, remark) {
    let rows = get(),
      q = rows.find((x) => x.id === id);
    if (!q) throw Error("找不到试题");
    const allowed = {
      训练样例: ["草稿"],
      草稿: ["待审定", "已停用"],
      退回修订: ["草稿", "待审定"],
      待审定: ["退回修订", "已通过"],
      已通过: ["已发布", "退回修订"],
      已发布: ["已停用"],
      已停用: ["草稿", "已发布"],
    };
    if (!(allowed[q.status] || []).includes(next)) throw Error("不允许直接从“" + q.status + "”转为“" + next + "”");
    if (next === "已发布" && !supported(q)) throw Error("此题型尚无匹配的前端交互/评分组件，不能发布");
    const before = clone(q);
    q.status = next;
    q.reviewNote = remark || "";
    q.version = (q.version || 1) + 1;
    q.updated = new Date().toISOString();
    q.versions = [
      ...(q.versions || []),
      { version: before.version, snapshot: { ...before, versions: undefined }, date: before.updated || "" },
    ];
    write(rows);
    addAudit("状态变更：" + next, q, before);
    return q;
  }
  function supported(q) {
    return q.framework === "general"
      ? ["single", "multiple", "judge", "order", "config", "gtask", "gscenario"].includes(q.type)
      : ["single", "multiple", "order", "config", "practice"].includes(q.type);
  }
  function published(framework) {
    return get().filter((q) => q.framework === framework && q.status === "已发布" && supported(q));
  }
  function exportJS() {
    return (
      "window.UNIFIED_PUBLISHED_QUESTIONS = " +
      JSON.stringify({ general: published("general"), teacher: published("teacher") }, null, 2) +
      ";\n"
    );
  }
  w.UnifiedQuestionStore = { get, upsert, status, audit, published, supported, exportJS };
})(window);
