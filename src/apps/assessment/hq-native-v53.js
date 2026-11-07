(() => {
  "use strict";
  const root = document.body;
  if (root.classList.contains("hq53-mounted")) return;
  // The business DOM is moved, not duplicated: original event listeners, node IDs, and data stores survive.
  const auth = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("mveri_offline_session_v3") || "null");
    } catch {
      return null;
    }
  })();
  if (!auth || auth.account !== "admin") {
    location.replace("../auth/access.html");
    return;
  }
  const moduleType = document.documentElement.dataset.hq53Module || "report";
  const titles = { report: "能力报告构建", quality: "考评点核验", practice: "综合测评与实训" };
  const contentNodes = [...root.children].filter((n) => !["SCRIPT", "LINK", "STYLE"].includes(n.tagName));
  const originalHeader = contentNodes.find((n) => n.tagName === "HEADER");
  const actions = originalHeader?.querySelector(".head-actions");
  const businessNodes = contentNodes.filter((n) => n !== originalHeader);
  const shell = document.createElement("div");
  shell.className = "hq52-shell hq53-shell";
  shell.innerHTML =
    '<aside class="hq52-sidebar" id="hq52sidebar"><div class="hq52-brand"><img alt="研究院徽标" src="../assets/mveri-logo.png"/><b>全国区域服务协作平台</b><button aria-label="收起导航" id="hq52toggle" title="收起导航" type="button">☰</button></div><div class="hq52-identity">总部运营管理</div><div class="hq52-menu" id="hq52menu"><div class="hq52-group"><div class="hq52-label">工作空间</div><a data-hq52-path="../area/dashboard.html" href="../area/dashboard.html">经营驾驶舱</a><a data-hq52-path="../area/journey.html" href="../area/journey.html">业务贯通中心</a></div><div class="hq52-group"><div class="hq52-label">能力评价体系</div><a data-hq52-path="admin-hq.html#home" href="admin-hq.html#home">运营总览</a><a data-hq52-path="admin-hq.html#indicators" href="admin-hq.html#indicators">指标体系</a><a data-hq52-path="admin-hq.html#masterdata" href="admin-hq.html#masterdata">主数据模型</a><a data-hq52-path="admin-hq.html#points" href="admin-hq.html#points">考评点管理</a><a data-hq52-path="admin-hq.html#types" href="admin-hq.html#types">题型管理</a><a data-hq52-path="admin-hq.html#plans" href="admin-hq.html#plans">命题计划</a><a data-hq52-path="admin-hq.html#bank" href="admin-hq.html#bank">试题维护</a><a data-hq52-path="admin-hq.html#blueprint" href="admin-hq.html#blueprint">测评蓝图</a><a data-hq52-path="admin-hq.html#agents" href="admin-hq.html#agents">专项智能体</a><a data-hq52-path="admin-hq.html#data" href="admin-hq.html#data">数据管理</a><a data-hq52-path="report-builder.html" href="report-builder.html">能力报告构建</a><a data-hq52-path="考评点3710题_核验中心.html" href="考评点3710题_核验中心.html">考评点核验</a><a data-hq52-path="index.html" href="index.html">综合测评与实训</a></div><div class="hq52-group"><div class="hq52-label">合作经营</div><a data-hq52-path="../area/partners.html" href="../area/partners.html">区域合作管理</a><a data-hq52-path="../area/agreements.html" href="../area/agreements.html">合作协议与授权</a><a data-hq52-path="../area/targets.html" href="../area/targets.html">年度任务管理</a></div><div class="hq52-group"><div class="hq52-label">培训业务</div><a data-hq52-path="../area/colleges.html" href="../area/colleges.html">院校客户管理</a><a data-hq52-path="../area/programs.html" href="../area/programs.html">培训项目管理</a><a data-hq52-path="../area/delivery.html" href="../area/delivery.html">培训交付中心</a></div><div class="hq52-group"><div class="hq52-label">认证与结算</div><a data-hq52-path="../area/certificates.html" href="../area/certificates.html">认证与证书</a><a data-hq52-path="../area/settlement.html" href="../area/settlement.html">认证结算中心</a><a data-hq52-path="../area/finance.html" href="../area/finance.html">费用与绩效</a></div><div class="hq52-group"><div class="hq52-label">系统管理</div><a data-hq52-path="../area/audit.html" href="../area/audit.html">操作日志</a></div></div><div class="hq52-bottom"><div>总部管理员</div><a href="../auth/access.html" id="hq52logout">退出 / 切换身份</a></div></aside>' +
    `<section class="hq52-main"><div class="hq52-top"><div class="hq52-breadcrumb">总部运营 / 能力评价体系</div><h2 id="hq52title">${titles[moduleType]}</h2><span class="hq52-status">研究院总部管理员</span></div><div class="hq52-content hq53-business"><div id="hq53actionbar" class="hq53-actionbar"></div><div id="hq53business"></div></div></section>`;
  root.classList.add("hq52-body", "hq53-mounted", "hq53-" + moduleType);
  root.prepend(shell);
  const dest = shell.querySelector("#hq53business");
  for (const node of businessNodes) dest.appendChild(node);
  if (actions) {
    const bar = shell.querySelector("#hq53actionbar");
    bar.appendChild(actions);
    bar.hidden = false;
  } else shell.querySelector("#hq53actionbar").hidden = true;
  originalHeader?.remove();
  const menu = shell.querySelector("#hq52menu");
  const current = decodeURIComponent(location.pathname.split("/").pop());
  menu.querySelectorAll("a").forEach((link) => {
    const same = decodeURIComponent(new URL(link.href, location.href).pathname.split("/").pop()) === current;
    if (same) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
  const toggle = shell.querySelector("#hq52toggle");
  toggle?.addEventListener("click", () => root.classList.toggle("hq52-collapsed"));
  const logout = shell.querySelector("#hq52logout");
  logout?.addEventListener("click", () => {
    sessionStorage.removeItem("mveriRole");
    sessionStorage.removeItem("mveriRegion");
    sessionStorage.removeItem("mveri_offline_session_v3");
  });
  // Old text links pointing to the legacy management layout should open its native counterpart.
  dest.querySelectorAll('a[href="admin.html"]').forEach((link) => link.setAttribute("href", "admin-hq.html#home"));
})();
