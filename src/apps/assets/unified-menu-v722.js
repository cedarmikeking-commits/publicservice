/* V72.9: Unified menu icons refined for clearer differentiation in the evaluation menu. */
(function (global) {
  "use strict";
  const GROUPS = [
    [
      "工作空间",
      "▦",
      [
        ["dashboard", "经营驾驶舱", "▦"],
        ["journey", "业务贯通中心", "↗"],
      ],
    ],
    [
      "能力评价体系",
      "◇",
      [
        ["eval-home", "运营总览", "◫"],
        ["eval-indicators", "指标体系", "◪"],
        ["eval-masterdata", "主数据模型", "▤"],
        ["eval-points", "考评点管理", "◎"],
        ["eval-types", "题型管理", "◧"],
        ["eval-plans", "命题计划", "✎"],
        ["eval-bank", "试题维护", "▣"],
        ["eval-blueprint", "测评蓝图", "⌘"],
        ["eval-agents", "专项智能体", "✦"],
        ["eval-data", "数据管理", "▥"],
      ],
    ],
    [
      "合作经营",
      "♧",
      [
        ["ecosystem-partners", "合作伙伴管理", "♧"],
        ["partners", "区域合作管理", "♧"],
        ["agreements", "合作协议与授权", "▤"],
        ["targets", "年度任务管理", "◎"],
      ],
    ],
    [
      "培训业务",
      "▣",
      [
        ["colleges", "院校客户管理", "▥"],
        ["programs", "培训项目管理", "▣"],
        ["delivery", "培训交付中心", "▧"],
      ],
    ],
    [
      "认证与结算",
      "◈",
      [
        ["certificates", "认证与证书", "◇"],
        ["settlement", "认证结算中心", "◈"],
        ["finance", "费用与绩效", "¥"],
      ],
    ],
    [
      "组织与授权",
      "▥",
      [
        ["school-admin", "院校管理", "▥"],
        ["user-admin", "用户管理", "♙"],
        ["permissions", "权限分配", "▧"],
      ],
    ],
    ["系统管理", "⚙", [["audit", "操作日志", "≡"]]],
  ];
  const EVAL = {
    "eval-home": "home",
    "eval-indicators": "indicators",
    "eval-masterdata": "masterdata",
    "eval-points": "points",
    "eval-types": "types",
    "eval-plans": "plans",
    "eval-bank": "bank",
    "eval-blueprint": "blueprint",
    "eval-agents": "agents",
    "eval-data": "data",
  };
  const baseAllowed = (id, role) =>
    role === "hq" ||
    (!id.startsWith("eval-") &&
      !["school-admin", "user-admin", "permissions", "audit", "ecosystem-partners"].includes(id) &&
      (role === "region"
        ? !["partners", "agreements"].includes(id)
        : ["dashboard", "colleges", "programs", "delivery", "certificates"].includes(id)));
  // Apply stored module VIEW grants to the four actual demo login identities only.
  // This does not enforce edit/review operations, which need a server-side authorization service.
  const allowed = (id, role) => {
    if (!baseAllowed(id, role)) return false;
    const account = sessionStorage.getItem("mveriActiveAccount") || "";
    if (!account || account === "admin") return true;
    try {
      const user = global.MVERI_USERS?.all()?.find((u) => u.account === account);
      if (!user) return true;
      const records = JSON.parse(localStorage.getItem("mveri_module_grants_v7231") || "{}");
      const grant = records[user.group + "::" + user.id];
      if (!grant || grant.account !== account || !grant.modules) return true;
      return Array.isArray(grant.modules[id]) && grant.modules[id].includes("view");
    } catch {
      return true;
    }
  };
  const href = (id, context) => {
    const base = context === "assessment" ? "../area/" : "";
    if (id.startsWith("eval-") && context === "area") return id + ".html";
    if (id.startsWith("eval-")) {
      const p =
        id === "eval-report"
          ? "report-builder.html"
          : id === "eval-quality"
            ? "考评点3710题_核验中心.html"
            : id === "eval-practice"
              ? "index.html"
              : "admin-hq.html#" + EVAL[id];
      return (context === "area" ? "../assessment/" : "") + p;
    }
    return base + id + ".html";
  };
  const key = (r) => "mveri_unified_menu_open_" + r;
  function render(current, role, context) {
    return GROUPS.map((g, i) => {
      const ids = g[2].filter((x) => allowed(x[0], role));
      if (!ids.length) return "";
      const open = ids.some((x) => x[0] === current);
      return `<section class="nav-group nav-accordion-group ${open ? "is-open" : ""}" data-group="${g[0]}"><button class="nav-label nav-accordion-trigger" type="button" aria-expanded="${open}" aria-controls="unified-panel-${i}" title="${g[0]}"><span class="nav-group-icon" aria-hidden="true">${g[1]}</span><span class="nav-group-title">${g[0]}</span><span class="nav-accordion-chevron" aria-hidden="true">⌄</span></button><div class="nav-accordion-panel" id="unified-panel-${i}" ${open ? "" : "hidden"}>${ids.map((x) => `<a href="${href(x[0], context)}" data-route="${x[0]}" class="${x[0] === current ? "active" : ""}" ${x[0] === current ? 'aria-current="page"' : ""}><i aria-hidden="true">${x[2]}</i><span>${x[1]}</span>${x[0] === current ? '<b class="nav-current"></b>' : ""}</a>`).join("")}</div></section>`;
    }).join("");
  }
  function mount(el, role, current, context) {
    if (!el) return;
    if (context !== "area") el.innerHTML = render(current, role, context);
    el.classList.add("mveri-unified-nav");
    let active = el.querySelector(".nav-accordion-group.is-open");
    const saved = sessionStorage.getItem(key(role));
    if (!active && saved)
      active = [...el.querySelectorAll(".nav-accordion-group")].find((g) => g.dataset.group === saved);
    function expand(group) {
      el.querySelectorAll(".nav-accordion-group").forEach((g) => {
        let on = g === group;
        g.classList.toggle("is-open", on);
        g.querySelector(".nav-accordion-trigger")?.setAttribute("aria-expanded", String(on));
        g.querySelector(".nav-accordion-panel").hidden = !on;
      });
      sessionStorage.setItem(key(role), group?.dataset.group || "");
    }
    if (active) expand(active);
    el.addEventListener("click", (e) => {
      const btn = e.target.closest(".nav-accordion-trigger");
      if (btn && el.contains(btn)) {
        e.preventDefault();
        const group = btn.closest(".nav-accordion-group");
        if (context === "assessment" && document.body.classList.contains("hq52-collapsed"))
          document.getElementById("hq52toggle")?.click();
        else if (context === "area" && document.querySelector(".shell")?.classList.contains("sidebar-collapsed"))
          window.toggleSidebar?.();
        expand(group.classList.contains("is-open") ? null : group);
      }
    });
    return {
      active: (id) => {
        const a = el.querySelector('a[data-route="' + id + '"]');
        if (!a) return;
        el.querySelectorAll("a").forEach((n) => {
          const on = n === a;
          n.classList.toggle("active", on);
          if (on) n.setAttribute("aria-current", "page");
          else n.removeAttribute("aria-current");
        });
        expand(a.closest(".nav-accordion-group"));
      },
    };
  }
  global.MVERI_UNIFIED_MENU = { GROUPS, href, render, mount, allowed };
})(window);
