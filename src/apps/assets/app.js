(() => {
  "use strict";
  const KEY = "mveri_demo_20261031_v1";
  const clone = (x) => JSON.parse(JSON.stringify(x));
  let db;
  try {
    db = JSON.parse(localStorage.getItem(KEY)) || clone(window.MVERI_SEED);
  } catch {
    db = clone(window.MVERI_SEED);
  }
  let role = "public",
    page = "home",
    person = "P001",
    org = "SCH-001",
    query = "",
    modal = false;
  const AUTH_KEY = "mveri_offline_session_v3";
  const REGISTER_KEY = "mveri_registered_users_v13";
  const registeredUsers = () => {
    try {
      return JSON.parse(localStorage.getItem(REGISTER_KEY)) || [];
    } catch {
      return [];
    }
  };
  const ENTRY = document.body.dataset.portal || "public";
  const PORTAL_URL = {
    public: "../site/index.html",
    personal: "../personal/index.html",
    institution: "../institution/index.html",
    operations: "../operations/index.html",
    login: "../auth/access.html",
    personalLogin: "../auth/login.html",
    institutionLogin: "../auth/institution.html",
    operationsLogin: "../auth/operations.html",
    register: "../auth/register.html",
  };
  function goPortal(r) {
    window.location.href = PORTAL_URL[r] || PORTAL_URL.public;
  }

  const DEMO_ACCOUNTS = [
    {
      account: "li",
      password: "123456",
      name: "李文博",
      role: "personal",
      person: "P002",
      label: "教师 · 北京信息职业技术学院",
    },
    {
      account: "zhang",
      password: "123456",
      name: "张晓宁",
      role: "personal",
      person: "P001",
      label: "教师 · 北京信息职业技术学院",
    },
    {
      account: "bj_school",
      password: "123456",
      name: "陈主任",
      role: "institution",
      org: "SCH-001",
      label: "院校管理员 · 北京信息职业技术学院",
    },
    {
      account: "hb_school",
      password: "123456",
      name: "李主任",
      role: "institution",
      org: "SCH-002",
      label: "院校管理员 · 河北工业职业技术大学",
    },
    {
      account: "bj_region",
      password: "123456",
      name: "周明",
      role: "institution",
      org: "ORG-BJ",
      label: "区域负责人 · 北京区域",
    },
    {
      account: "hb_region",
      password: "123456",
      name: "赵宁",
      role: "institution",
      org: "ORG-HB",
      label: "区域负责人 · 河北区域",
    },
    {
      account: "sx_region",
      password: "123456",
      name: "王健",
      role: "institution",
      org: "ORG-SX",
      label: "区域负责人 · 山西区域",
    },
    {
      account: "sx_school",
      password: "123456",
      name: "孙主任",
      role: "institution",
      org: "SCH-003",
      label: "院校管理员 · 山西职业技术学院",
    },
    { account: "admin", password: "123456", name: "平台管理员", role: "operations", label: "研究院总部 · 运营管理员" },
    {
      account: "reviewer",
      password: "123456",
      name: "认证审核员",
      role: "operations",
      permissions: ["dashboard", "reviews", "certificates", "audits"],
      label: "研究院总部 · 认证审核",
    },
  ];
  let session = null;
  try {
    let old = JSON.parse(sessionStorage.getItem(AUTH_KEY));
    if (
      old &&
      (DEMO_ACCOUNTS.some((a) => a.account === old.account) ||
        registeredUsers().some((a) => a.account === old.account && a.status !== "停用"))
    ) {
      session = [...DEMO_ACCOUNTS, ...registeredUsers().filter((a) => a.status !== "停用")].find(
        (a) => a.account === old.account,
      );
      role = session.role;
      person = session.person || person;
      org = session.org || org;
      page = "dashboard";
    }
  } catch {}
  if (ENTRY === "public") {
    role = "public";
    page = "home";
  } else if (!session || session.role !== ENTRY) {
    role = "public";
    page = "home";
  } else {
    role = ENTRY;
    page = "dashboard";
  }
  for (const u of registeredUsers()) {
    if (u.person && !db.people.some((p) => p.id === u.person)) {
      db.people.push({
        id: u.person,
        name: u.name,
        org: u.org || "SCH-001",
        title: "个人注册用户",
        account: u.account,
      });
      localStorage.setItem(KEY, JSON.stringify(db));
    }
  }
  const authorizedPage = (k) =>
    role === "public" || !session ? role === "public" : !session.permissions || session.permissions.includes(k);
  const $ = (s) => document.querySelector(s);
  const find = (k, id) => db[k].find((x) => x.id === id),
    name = (k, id) => find(k, id)?.name || id,
    personOrg = (p) => find("people", p)?.org,
    byOrg = (p, o) => {
      let po = personOrg(p);
      return po === o || find("orgs", po)?.parent === o;
    },
    date = () => new Date().toISOString().slice(0, 10),
    esc = (x) =>
      String(x ?? "").replace(
        /[&<>"']/g,
        (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
      ),
    save = () => localStorage.setItem(KEY, JSON.stringify(db));
  let toastTimer;
  function toast(t) {
    document.querySelector(".alert")?.remove();
    let x = document.createElement("div");
    x.className = "alert";
    x.textContent = t;
    document.body.append(x);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => x.remove(), 3500);
  }
  const btn = (label, action, style = "outline", extra = "") =>
    `<button class="${style}" data-act="${action}" ${extra}>${label}</button>`;
  const tag = (x) =>
    `<span class="tag ${/已发证|已完成|有效|通过|已发布|实施中/.test(x) ? "green" : /待|报名/.test(x) ? "amber" : ""}">${esc(x)}</span>`;
  const stat = (t, v, h) =>
    `<div class="stat"><div class="metric">${t}</div><div class="num">${v}</div><div class="hint">${h}</div></div>`;
  const table = (headers, rows) =>
    `<div class="table-scroll"><table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.length ? rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${headers.length}" class="empty">暂无符合条件的数据</td></tr>`}</tbody></table></div>`;
  const panel = (title, body) => `<section class="panel"><h2>${title}</h2>${body}</section>`;
  const header = (title, desc, actions = "") =>
    `<div class="titleline"><div><div class="eyebrow">MVERI / ${role === "public" ? "公共服务" : role === "personal" ? "个人服务" : role === "institution" ? "机构服务" : "运营管理"}</div><h1>${title}</h1><div class="muted">${desc}</div></div><div class="actions">${actions}</div></div>`;
  const content = (s) => (document.getElementById("content").innerHTML = s);
  const myEnroll = () => db.enrollments.filter((x) => x.person === person),
    myAssess = () => db.assessments.filter((x) => x.person === person),
    myApps = () => db.applications.filter((x) => x.person === person),
    myCert = () => db.certificates.filter((x) => x.person === person),
    groupPeople = () => db.people.filter((p) => byOrg(p.id, org)),
    groupProjects = () => db.projects.filter((p) => p.org === org || p.region === org),
    groupEnrollment = () => db.enrollments.filter((e) => byOrg(e.person, org));
  const eligible = (p) => {
    let e = db.enrollments.find((x) => x.person === p && x.completed),
      a =
        e &&
        db.assessments.find(
          (x) => x.person === p && x.framework === find("projects", e.project).framework && x.score >= 70,
        ),
      x = e && db.exams.find((t) => t.person === p && t.project === e.project && t.passed);
    return { e, a, x, ok: !!(e && a && x) };
  };
  function navItems() {
    if (role === "public")
      return [
        ["home", "⌂", "公共服务首页"],
        ["services", "▦", "服务体系"],
        ["news", "▤", "资讯动态"],
        ["standards", "◈", "标准体系"],
        ["verify", "✓", "证书核验"],
        ["ecology", "♧", "生态合作"],
      ];
    if (role === "personal")
      return [
        ["dashboard", "▣", "我的首页"],
        ["plan", "◎", "职业发展规划"],
        ["assessment", "◇", "能力测评"],
        ["learning", "▤", "学习与提升"],
        ["certification", "◈", "评价认证"],
        ["portfolio", "▧", "成长档案"],
        ["verify", "✓", "证书核验"],
      ];
    if (role === "institution")
      return [
        ["dashboard", "▣", "机构总览"],
        ["members", "♙", "人员档案"],
        ["projects", "▤", "培训项目"],
        ["reports", "▥", "测评与认证"],
        ["verify", "✓", "证书核验"],
      ];
    return [
      ["dashboard", "▣", "运营总览"],
      ["organizations", "♧", "组织与区域"],
      ["standards", "◈", "标准体系"],
      ["projects", "▤", "培训项目"],
      ["assessments", "◇", "测评与成绩"],
      ["reviews", "◎", "认证审核"],
      ["certificates", "✓", "证书管理"],
      ["audits", "≡", "操作审计"],
    ];
  }
  function shell() {
    if (ENTRY !== "public" && (!session || session.role !== ENTRY)) {
      document.body.classList.remove("public-mode");
      document.getElementById("app").innerHTML =
        `<main class="access-guard"><div class="guard-card"><div class="guard-logo"><img src="../assets/mveri-logo.png" alt="现代职业教育研究院徽标"></div><h1>需要登录后访问工作台</h1><p>此页面属于${ENTRY === "personal" ? "个人服务端" : ENTRY === "institution" ? "机构服务端" : "运营管理端"}，请先通过公共服务门户登录相应账号。</p><a class="primary" href="../auth/${ENTRY === "personal" ? "login" : ENTRY === "institution" ? "institution" : "operations"}.html" style="display:inline-block;padding:12px 20px;text-decoration:none">前往登录页面</a></div></main>`;
      return;
    }
    const user =
      role === "personal"
        ? name("people", person)
        : role === "institution"
          ? name("orgs", org)
          : role === "operations"
            ? "研究院总部"
            : "访客";
    if (role === "public") {
      document.body.classList.add("public-mode");
      $("#app").innerHTML =
        `<div class="site-utility"><div class="site-wrap">现代职业教育研究院 · 公共服务平台 <span>研究 · 标准 · 评价 · 发展</span></div></div><header class="site-header"><div class="site-wrap site-head-inner"><button class="site-identity" data-page="home" aria-label="返回官网首页"><span class="site-emblem"><img src="../assets/mveri-logo.png" alt="现代职业教育研究院徽标"></span><span><b>现代职业教育公共服务平台</b><small>MODERN VOCATIONAL EDUCATION · PUBLIC SERVICE</small></span></button><nav class="site-nav" aria-label="网站主导航">${[
          ["home", "首页"],
          ["services", "公共服务"],
          ["news", "资讯动态"],
          ["standards", "标准体系"],
          ["verify", "证书核验"],
          ["ecology", "生态合作"],
        ]
          .map(([k, t]) => `<button class="${page === k ? "selected" : ""}" data-page="${k}">${t}</button>`)
          .join(
            "",
          )}</nav><button class="site-login" data-act="login">登录 <span>↗</span></button></div></header><main id="content" class="site-main"></main><footer class="site-footer"><div class="site-wrap"><div><strong>现代职业教育研究院</strong><p>以标准为基础，以能力发展为导向，推动职业教育数字化公共服务。</p></div><div><b>公共服务</b><span>标准体系　能力测评　培训发展　评价认证　证书核验</span></div><div class="site-mini-program" aria-label="微信小程序二维码"><img src="../assets/wechat-mini-program-code.png" alt="微信小程序码，使用微信扫一扫进入" width="132" height="132" loading="lazy"></div><div class="site-disclaimer"><span>培训、认证等业务演示数据为虚构，不构成真实认证结果；全国院校名录以已核验来源和覆盖范围为准。</span><a class="site-icp" href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank" rel="noopener noreferrer">京ICP备18024731号-1</a></div></div></footer>`;
    } else {
      document.body.classList.remove("public-mode");
      $("#app").innerHTML =
        `<header class="topbar"><div class="brand"><div class="logo"><img src="../assets/mveri-logo.png" alt="现代职业教育研究院徽标"></div><div>现代职业教育公共服务平台<div class="sub">MVERI · ${role === "personal" ? "个人服务" : role === "institution" ? "机构服务" : "运营管理"}工作台</div></div></div><div class="right">${role === "personal" ? `<span class="account-name">${esc(session?.name || user)}</span>${btn("退出登录", "logout", "ghost")}` : `<div class="portal-account-menu" id="portalAccountMenu"><button type="button" class="portal-account-trigger" data-portal-account-toggle aria-expanded="false" aria-haspopup="menu"><span class="portal-account-avatar">${String(session?.name || user).slice(0, 1)}</span><span class="portal-account-meta"><span class="portal-account-org" title="${esc(role === "institution" ? name("orgs", org) : "总部运营平台")}">${esc(role === "institution" ? name("orgs", org) : "总部运营平台")}</span><span class="portal-account-label">${esc(window.MVERI_PORTAL_ACCOUNT?.displayName(session?.account, session?.name || user) || session?.name || user)}</span></span><span class="portal-account-arrow" aria-hidden="true">⌄</span></button><div class="portal-account-popover" id="portalAccountPopover" role="menu" hidden><div class="portal-account-identity"><strong>${esc(window.MVERI_PORTAL_ACCOUNT?.displayName(session?.account, session?.name || user) || session?.name || user)}</strong><small>${esc(role === "institution" ? name("orgs", org) : "总部运营平台")} · ${esc(session?.account || "")} · ${role === "institution" ? "机构服务权限" : "运营服务权限"}</small></div><button type="button" role="menuitem" data-portal-account-action="profile">⚙ &nbsp;个人设置</button><button type="button" role="menuitem" data-portal-account-action="password">▣ &nbsp;修改密码</button><div class="portal-account-divider"></div><button type="button" role="menuitem" data-portal-account-action="home">⌂ &nbsp;返回官网</button><button type="button" role="menuitem" data-portal-account-action="logout">⇥ &nbsp;退出／切换角色</button></div></div>`}</div></header><div class="shell"><aside class="sidebar"><div class="navhead">服务导航</div>${navItems()
          .filter(([key]) => authorizedPage(key))
          .map(
            ([key, icon, t]) =>
              `<button data-page="${key}" class="nav ${page === key ? "active" : ""}"><span class="ico">${icon}</span>${t}</button>`,
          )
          .join(
            "",
          )}<div class="sidefoot">所有工作台共用同一套组织、学员、项目和认证业务数据。<div style="margin-top:12px">${role === "operations" && session?.account === "admin" ? btn("重置体验数据", "reset", "ghost") : ""}</div></div></aside><main id="content" class="content"></main></div>`;
    }
    renderPage();
  }
  function home() {
    const latest = (window.MVERI_NEWS || []).slice(0, 3);
    content(`<section class="site-hero home-v22-hero"><div class="site-wrap site-hero-grid"><div class="home-v22-intro"><div class="site-kicker"><span></span> MODERN VOCATIONAL EDUCATION · PUBLIC SERVICE</div><h1>构建开放、专业、可信赖的<br><em>职业教育公共服务体系</em></h1><p>聚焦能力标准、测评评价、人才培养与评价认证，面向院校、教师、学生和行业企业，提供贯通能力发展全过程的数字化服务。</p><div class="site-hero-actions"><button class="site-primary" data-page="services">探索公共服务 <span>→</span></button><button type="button" class="home-v22-outline" data-personal-modal="true">进入个人服务中心 <span aria-hidden="true">↗</span></button></div><div class="home-v22-hero-meta"><span>开放标准查询</span><span>公益互动体验</span><span>证书公开核验</span></div></div><div class="hero-graphic" aria-label="MVERI 标准、评价、培养、认证、合作公共服务生态"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="orbit-system"><span class="orbit-node node-a"><span>标准</span></span><span class="orbit-node node-b"><span>评价</span></span><span class="orbit-node node-c"><span>培养</span></span><span class="orbit-node node-d"><span>认证</span></span><span class="orbit-node node-e"><span>合作</span></span></div><div class="orbit-center">MVERI<small>公共服务生态</small></div></div></div></section>
<section class="home-v22-quick site-wrap" aria-label="常用服务快捷入口"><button data-page="standards"><span class="qicon">◈</span><span><b>查看能力标准</b><small>通用能力与教师素智素养框架</small></span><span class="quick-arrow">↗</span></button><a href="eight-questions.html"><span class="qicon">◇</span><span><b>快速8题体验</b><small>无需登录，交互任务与结果解析</small></span><span class="quick-arrow">↗</span></a><button data-page="verify"><span class="qicon">✓</span><span><b>证书核验</b><small>根据证书编号查询记录</small></span><span class="quick-arrow">↗</span></button></section>
<section class="site-section site-wrap home-v22-services" id="public-services"><div class="site-section-header"><div><span class="site-eyebrow">PUBLIC SERVICES</span><h2>公共服务，覆盖能力发展全过程</h2><p>按服务目的进入业务，而不是先选择复杂的管理系统。</p></div><button class="text-action" data-page="services">全部公共服务 →</button></div><div class="service-grid">${[
      ["01", "标准体系", "查询能力标准、版本与指标结构，了解测评依据。", "◈", "standards"],
      ["02", "能力测评", "通过真实任务了解个人数智能力与发展方向。", "◇", "services"],
      ["03", "能力发展", "了解课程培训、学习路径和教师发展服务。", "▤", "services"],
      ["04", "评价认证", "查看考试、认证申请及证书管理流程。", "◎", "services"],
      ["05", "资源智库", "获取研究资料、课程与相关资源。", "▧", "services"],
      ["06", "生态合作", "了解区域、院校、企业及专家合作方式。", "♧", "ecology"],
    ]
      .map(
        (x) =>
          `<article class="service-tile"><span class="service-index">${x[0]}</span><div class="service-symbol">${x[3]}</div><h3>${x[1]}</h3><p>${x[2]}</p><button class="service-link" data-page="${x[4]}">了解服务 <span aria-hidden="true">→</span></button></article>`,
      )
      .join("")}</div></section>
<section class="home-v22-demo"><div class="site-wrap home-v22-demo-grid"><div><span class="home-v22-kicker">FREE INTERACTIVE EXPERIENCE</span><h2>8道互动任务<br>让数字能力看得见</h2><p>围绕信息检索、邮件处理、文件管理、文档与网页操作，在独立任务空间中完成操作，并获得逐题反馈与解析。</p><a href="eight-questions.html" class="home-v22-demo-btn">立即体验8道题 <span>↗</span></a><div class="home-v22-demo-note">无需登录 · 支持本地进度保存 · 不作为正式认证成绩</div></div><div class="home-v22-demo-visual"><div class="home-v22-demo-count">08<small>REAL-WORLD TASKS</small></div><div class="home-v22-demo-flow"><span>任务操作</span><span>即时反馈</span><span>复盘提升</span></div></div></div></section>
<section class="site-section site-wrap home-v22-news"><div class="site-section-header"><div><span class="site-eyebrow">POLICY & NEWS</span><h2>政策资讯与行业动态</h2><p>精选有来源的政策、职业教育新闻与研究动态，详情可查看官方原文。</p></div><button class="text-action" data-page="news">进入资讯动态 →</button></div><div class="home-v22-news-grid">${latest.map((n, i) => `<article class="home-v22-news-card"><div class="home-v22-news-image"><img src="../assets/news-images/${esc(n.art)}" alt="${esc(n.category)}专题配图" loading="lazy"></div><div class="home-v22-news-body"><div class="home-v22-news-meta"><span>${esc(n.category)}</span><time>${esc(n.date)}</time></div><h3>${esc(n.title)}</h3><p>${esc(n.lead)}</p><button class="service-link" data-news-id="${esc(n.id)}">阅读详情 →</button></div></article>`).join("")}</div></section>
<section class="site-band home-v22-process"><div class="site-wrap band-inner"><div><span class="site-eyebrow">SERVICE JOURNEY</span><h2>从标准依据到能力发展</h2><p>个人的测评、培训、考试和认证形成关联记录；标准与认证规则由平台统一管理。</p><button class="text-action" data-page="services">了解业务流程 →</button></div><div class="band-steps">${["标准依据", "能力测评", "学习发展", "考试评价", "认证核验"].map((x, i) => `<div><strong>0${i + 1}</strong><span>${x}</span></div>`).join("")}</div></div></section>
<section class="site-section site-wrap home-v22-audience"><div class="site-section-header"><div><span class="site-eyebrow">SERVICE ENTRANCE</span><h2>面向不同用户的统一服务入口</h2><p>官网内容开放浏览，办理个人或机构业务时使用统一账号登录。</p></div></div><div class="audience-grid"><article><span>PERSONAL SERVICE</span><h3>教师、学生与社会学习者</h3><p>进行能力测评、课程学习、考试与认证申请，查看个人记录和证书。</p><button class="home-v22-audience-btn" data-personal-modal="true">进入个人服务 →</button></article><article><span>INSTITUTIONAL SERVICE</span><h3>院校、企业与区域服务中心</h3><p>开展成员管理、培训项目与测评组织，查看授权范围内的业务成果。</p><button class="home-v22-audience-btn" data-act="institution-login">进入机构服务 →</button></article></div></section>
<section class="site-verify-band home-v22-verify"><div class="site-wrap"><div><span class="site-eyebrow">CERTIFICATE VERIFICATION</span><h2>证书信息公开核验</h2><p>输入证书编号，查询平台已有的证书记录与状态。</p></div><button class="home-v22-verify-btn" data-page="verify">前往证书核验 →</button></div></section>`);
  }
  function news(category = "全部资讯", term = "") {
    const list = window.MVERI_NEWS || [],
      cats = ["全部资讯", "政策法规", "行业新闻", "政策解读", "研究动态", "通知公告"],
      featured = list[0],
      filtered = list.filter(
        (x) =>
          (category === "全部资讯" || x.category === category) &&
          (!term || (x.title + x.lead + x.agency).toLowerCase().includes(term.toLowerCase())),
      );
    content(
      `<section class="news-landing"><div class="news-titleband site-wrap"><div><span class="site-eyebrow">POLICY & NEWS</span><h1>资讯动态</h1><p>聚焦职业教育政策法规、行业新闻及研究进展，提供有来源、可核验的图文资讯。</p></div><div class="news-title-mark">NEWS<small>政策 · 资讯 · 研究</small></div></div><div class="site-wrap"><div class="news-tabs" role="group" aria-label="资讯分类">${cats.map((c) => `<button type="button" class="${category === c ? "active" : ""}" data-news-category="${esc(c)}">${esc(c)}</button>`).join("")}</div><div class="news-search-row"><div class="news-result-info">${category === "全部资讯" ? "政策与行业精选" : esc(category)} <span>· ${filtered.length} 条内容</span></div><form id="news-search-form"><input id="news-search-input" type="search" value="${esc(term)}" placeholder="搜索政策、新闻关键词" aria-label="搜索资讯"><button type="submit">搜索</button></form></div>${category === "全部资讯" && !term && featured ? `<article class="news-feature"><img src="../assets/news-images/${featured.art}" alt="政策专题图文封面"><div class="news-feature-copy"><span class="news-chip">焦点政策</span><div class="news-meta">${esc(featured.date)} · ${esc(featured.agency)}</div><h2>${esc(featured.title)}</h2><p>${esc(featured.lead)}</p><button type="button" class="news-button" data-news-open="${featured.id}">阅读政策详情 →</button></div></article>` : ""}<div class="news-content-layout"><div><div class="news-section-title"><h2>资讯列表</h2><span>按发布时间整理</span></div><div class="news-card-grid">${filtered.length ? filtered.map((x) => `<article class="news-card"><button type="button" class="news-image-action" data-news-open="${x.id}" aria-label="阅读${esc(x.title)}"><img src="../assets/news-images/${x.art}" alt="${esc(x.category)}专题配图" loading="lazy"></button><div class="news-card-body"><span class="news-chip">${esc(x.category)}</span><div class="news-meta">${esc(x.date)} · ${esc(x.agency)}</div><h3><button type="button" data-news-open="${x.id}">${esc(x.title)}</button></h3><p>${esc(x.lead)}</p><button type="button" class="news-read" data-news-open="${x.id}">阅读全文 →</button></div></article>`).join("") : '<div class="news-empty">当前分类暂无已核验的资讯。后续可通过资讯数据文件补充。</div>'}</div></div><aside class="news-side"><div class="news-aside-box"><h3>政策信息来源</h3><p>政策及行业资讯优先采用教育部等官方公开渠道，记录发布时间、发布机构和原文链接。</p><a href="https://www.moe.gov.cn/" target="_blank" rel="noopener noreferrer">教育部官网 ↗</a></div><div class="news-aside-box"><h3>专题关注</h3><button data-news-category="政策法规">职业教育政策</button><button data-news-category="行业新闻">行业发展动态</button><button data-news-category="政策解读">政策要点解读</button></div><div class="news-aside-box news-aside-note"><h3>信息说明</h3><p>本站对公开政策与新闻进行简要摘编，不代表原发布机关的官方解释。配图为平台自制专题插画，不是新闻现场照片。</p></div></aside></div></div></section>`,
    );
  }
  function newsDetail(id) {
    const x = (window.MVERI_NEWS || []).find((v) => v.id === id);
    if (!x) {
      news();
      return;
    }
    content(
      `<section class="news-article site-wrap"><button class="news-back" type="button" data-news-back="1">← 返回资讯动态</button><div class="news-article-head"><span class="news-chip">${esc(x.category)}</span><h1>${esc(x.title)}</h1><div class="news-meta">发布时间：${esc(x.date)}　发布来源：${esc(x.agency)}${x.number ? "　文号：" + esc(x.number) : ""}</div></div><figure><img src="../assets/news-images/${x.art}" alt="${esc(x.category)}专题配图"><figcaption>平台制作的专题配图，非新闻现场照片</figcaption></figure><div class="news-article-body"><p class="news-lead">${esc(x.lead)}</p>${x.body.map((p) => `<p>${esc(p)}</p>`).join("")}<div class="news-source"><strong>信息来源与核验</strong><p>本站为公开信息摘要，具体表述、政策效力和执行要求以原发布单位公布的原文为准。</p><a href="${esc(x.source)}" target="_blank" rel="noopener noreferrer">查看官方原文 ↗</a></div></div><div class="news-article-bottom"><button type="button" class="news-button" data-news-back="1">返回资讯列表</button></div></section>`,
    );
  }
  function ecology() {
    const partnerGroups = [
      ["科技企业", ["华为技术", "阿里云智能", "腾讯教育", "百度智能云", "科大讯飞", "联想方案服务"]],
      [
        "院校",
        [
          "深圳职业技术大学",
          "北京电子科技职业学院",
          "天津职业技术师范大学",
          "南京工业职业技术大学",
          "金华职业技术大学",
          "广州番禺职业技术学院",
        ],
      ],
      ["央企合作", ["中国电信", "中国联通", "中国移动", "国家电网", "中国中车", "中国中铁"]],
    ];
    content(
      `<section class="site-section site-wrap ecology-page"><div class="site-section-header"><div><span class="site-eyebrow">ECOSYSTEM PARTNERSHIP</span><h2>生态合作</h2><p>协同院校、行业企业、专家和区域服务伙伴，共建职业教育公共服务生态。</p></div></div><div class="ecology-intro"><div class="ecology-copy"><span class="site-eyebrow">OPEN COLLABORATION</span><h2>携手共建，共享能力发展服务</h2><p>围绕标准研究、能力测评、教师发展、课程资源和评价认证等公共服务开展协作。合作申请及授权须经研究院审核，体验版不接受真实申请。</p><button class="site-primary" data-act="institution-login">进入机构服务 <span>→</span></button></div><div class="ecology-globe" aria-hidden="true">MVERI<small>研究 · 协作 · 发展</small></div></div><div class="service-grid ecology-grid">${[
        ["区域合作", "区域服务中心建设、院校服务拓展与项目协同。", "01"],
        ["院校合作", "教师能力发展、组织测评、培训项目与成果应用。", "02"],
        ["企业合作", "数字技术、产业资源、实践场景与人才培养合作。", "03"],
        ["专家合作", "参与能力标准研究、题目审查、课程与评价研究。", "04"],
        ["学习资源合作", "课程、工具、案例等资源共建与合规共享。", "05"],
        ["教育科技合作", "测评工具、AI技术与数字平台能力集成。", "06"],
      ]
        .map(
          (x) =>
            `<article class="service-tile"><span class="service-index">${x[2]}</span><div class="service-symbol">♧</div><h3>${x[0]}</h3><p>${x[1]}</p></article>`,
        )
        .join(
          "",
        )}</div><div class="partner-showcase"><div class="partner-showcase-head"><div><span class="site-eyebrow">PARTNER NETWORK</span><h3>生态合作网络</h3><p>按科技企业、院校与央企分类展示潜在生态合作方向；以下机构为界面示例，不代表已建立合作关系。</p></div><span class="partner-note">示例机构 · 非已确认合作名单 · 可替换授权 Logo</span></div>${partnerGroups.map((group, gIndex) => `<div class="partner-lane"><div class="partner-lane-label"><strong>${group[0]}</strong><span>${group[1].length} 家/所</span></div><div class="partner-track-wrap"><div class="partner-track ${gIndex % 2 === 1 ? "reverse" : ""}">${[...group[1], ...group[1]].map((name, index) => `<div class="partner-logo-card"><span class="partner-logo-mark">${name.slice(0, 2)}</span><span class="partner-logo-name">${name}</span></div>`).join("")}</div></div></div>`).join("")}</div><div class="ep-ecology-apply"><div><span class="site-eyebrow">PARTNER ACCESS</span><h3>成为生态合作伙伴</h3><p>面向科技企业、职业院校、培训机构与行业组织。合作申请先登记审核，再配置合作范围与工作台账号。未批准不代表已建立合作关系。</p></div><div class="ep-ecology-actions"><a href="../partner/apply.html" class="site-primary">申请生态合作 →</a><a href="../auth/partner.html" class="site-primary ep-outline">合作伙伴登录 →</a></div></div><div class="ecology-bottom"><div><h3>合作服务流程</h3><p>合作咨询 → 需求沟通 → 资质审核 → 方案确认 → 协议签署 → 项目实施与评价</p></div><button class="site-primary" data-act="institution-login">登录机构工作台 →</button></div></section>`,
    );
  }
  function services() {
    const serviceItems = [
      {
        no: "01",
        icon: "◈",
        name: "能力标准查询",
        kind: "标准依据",
        summary: "浏览通用数智能力与教师素智素养体系，了解能力领域、单元和应用边界。",
        audience: "all personal institution",
        tags: ["标准查询", "能力框架", "版本信息"],
        action: "查看标准体系",
        page: "standards",
      },
      {
        no: "02",
        icon: "◇",
        name: "能力测评",
        kind: "能力诊断",
        summary: "通过快速8题了解测评方式，识别发展方向；完整测评及个人能力档案由个人服务中心承接。",
        audience: "all personal",
        tags: ["快速体验", "能力诊断", "发展建议"],
        action: "快速8题体验",
        href: "eight-questions.html",
      },
      {
        no: "03",
        icon: "▤",
        name: "能力发展与培训",
        kind: "能力提升",
        summary: "为在职教师、在校学生、社会人员和在职人员提供学习培训入口，衔接能力诊断、课程与成果记录。",
        audience: "all personal institution",
        tags: ["培训项目", "学习记录", "能力提升"],
        action: "进入个人服务",
        personal: true,
      },
      {
        no: "04",
        icon: "▥",
        name: "组织测评与培训管理",
        kind: "组织能力发展",
        summary: "支持院校与企业组织教师、学生及员工的能力提升培训、能力测评和项目管理。",
        audience: "all institution",
        tags: ["组织管理", "培训实施", "授权范围"],
        action: "进入机构服务",
        actionKey: "institution-login",
      },
      {
        no: "05",
        icon: "◎",
        name: "评价认证服务",
        kind: "成果评价",
        summary: "了解能力评价与成果认定的衔接方式；具体认证申请和审核须符合相应项目规则。",
        audience: "all personal institution",
        tags: ["认证申请", "业务审核", "证书记录"],
        action: "进入个人服务",
        personal: true,
      },
      {
        no: "06",
        icon: "✓",
        name: "数字证书核验",
        kind: "结果查询",
        summary: "使用证书编号查询平台保存的发证记录、当前状态和关联信息；演示数据不构成正式认证。",
        audience: "all personal institution",
        tags: ["编号查询", "状态核验", "记录说明"],
        action: "查询证书",
        page: "verify",
      },
      {
        no: "07",
        icon: "▧",
        name: "资讯与资源智库",
        kind: "学习资源",
        summary: "获取职业教育政策、能力发展研究与实践资讯，支持自主学习和职业成长。",
        audience: "all personal institution",
        tags: ["政策法规", "研究资讯", "实践参考"],
        action: "浏览资讯动态",
        page: "news",
      },
      {
        no: "08",
        icon: "♧",
        name: "生态合作与服务网络",
        kind: "发展支持",
        summary: "了解区域、院校、企业与专家如何协同提供职业能力提升资源及服务。",
        audience: "all institution",
        tags: ["区域合作", "院校合作", "企业协作"],
        action: "了解生态合作",
        page: "ecology",
      },
    ];
    const actionHtml = (item) =>
      item.href
        ? `<a class="mps30-card-link" href="${item.href}">${item.action}<span aria-hidden="true">↗</span></a>`
        : item.personal
          ? `<button type="button" class="mps30-card-link" data-personal-modal="true">${item.action}<span aria-hidden="true">↗</span></button>`
          : item.actionKey
            ? `<button type="button" class="mps30-card-link" data-act="${item.actionKey}">${item.action}<span aria-hidden="true">↗</span></button>`
            : `<button type="button" class="mps30-card-link" data-page="${item.page}">${item.action}<span aria-hidden="true">↗</span></button>`;
    content(`<section class="mps30 mps35 site-wrap" aria-label="职业能力发展公共服务">
  <header class="mps35-pagehead">
    <div><div class="mps35-breadcrumb">公共服务 / 职业能力发展</div><div class="mps35-overline">CAREER COMPETENCY DEVELOPMENT</div><h1>职业能力发展公共服务</h1><p>面向在职院校教师、在校学生、社会人员及在职人员，提供能力标准、能力测评、学习培训、评价认证与发展支持服务，助力职业能力提升与持续发展。</p></div>
    <div class="mps35-head-info"><span>8 <small>项能力发展服务</small></span><div>服务教师、学生、社会人员及在职人员</div></div>
  </header>
  <div class="mps35-notice"><span class="mps35-notice-dot" aria-hidden="true"></span><strong>服务提示</strong><span>能力标准、资讯和快速测评体验可直接访问；个人测评记录、学习培训与认证申请等服务，请登录相应的个人或机构工作台。</span></div>
  <div class="mps35-layout">
    <aside class="mps35-sidebar" aria-label="服务分类导航"><div class="mps35-side-title">能力发展服务导航</div><div class="mps35-side-link is-current"><span>▦</span> 全部服务 <b>08</b></div><a href="#mps35-catalog"><span>◈</span> 标准与测评</a><a href="#mps35-catalog"><span>▤</span> 培训与认证</a><a href="#mps35-guide"><span>≡</span> 办理流程</a><a href="#mps35-roles"><span>♙</span> 按身份办理</a><div class="mps35-side-hint">按职业能力发展需求选择服务，进入对应功能。</div></aside>
    <div class="mps35-main">
      <div class="mps35-catalog-head" id="mps35-catalog"><div><span class="mps35-overline">SERVICE CATALOG</span><h2>职业能力发展服务</h2><p>围绕能力认知、测评诊断、学习提升、成果评价和持续发展，选择适合自己的服务。</p></div><span class="mps35-catalog-total">共 08 项</span></div>
      <div class="mps30-filters mps35-filters" role="group" aria-label="按服务对象筛选"><button type="button" data-service-filter="all" aria-pressed="true" class="is-active">全部服务</button><button type="button" data-service-filter="personal" aria-pressed="false">教师、学生与社会人员</button><button type="button" data-service-filter="institution" aria-pressed="false">组织培训与管理</button><span class="mps30-filter-count" aria-live="polite">显示 8 项服务</span></div>
      <div class="mps35-service-list">${serviceItems.map((item) => `<article class="mps35-item" data-service-audience="${item.audience}"><div class="mps35-item-icon" aria-hidden="true">${item.icon}</div><div class="mps35-item-body"><div class="mps35-item-top"><span class="mps35-item-type">${item.kind}</span><span class="mps35-item-id">${item.no} / 08</span></div><h3>${item.name}</h3><p>${item.summary}</p><div class="mps35-item-tags">${item.tags.map((t) => `<span>${t}</span>`).join("")}</div></div><div class="mps35-item-action">${actionHtml(item)}</div></article>`).join("")}</div>
    </div>
    <aside class="mps35-rail" aria-label="常用办理入口"><section class="mps35-rail-panel"><div class="mps35-rail-kicker">QUICK ACCESS</div><h3>常用服务</h3><button type="button" data-page="standards"><span>◈</span><b>能力标准查询</b><em>↗</em></button><a href="eight-questions.html"><span>◇</span><b>快速能力测评</b><em>↗</em></a><button type="button" data-page="verify"><span>✓</span><b>证书信息核验</b><em>↗</em></button></section><section class="mps35-rail-support"><strong>面向院校与培训组织者</strong><p>开展教师、学生及员工培训与组织测评，可从机构工作台进入。</p><button type="button" data-act="institution-login">进入机构服务 →</button></section></aside>
  </div>
  <section class="mps35-guide" id="mps35-guide"><div class="mps35-guide-head"><span class="mps35-overline">SERVICE PROCEDURE</span><h2>职业能力发展路径</h2><p>了解能力要求、诊断能力现状、参与学习实践、评价发展成果，并持续改进；测评结果不等同于职业资格认定。</p></div><div class="mps35-guide-steps">${[
    ["01", "明确能力目标", "了解能力要求"],
    ["02", "开展能力测评", "识别能力现状"],
    ["03", "学习与实践", "提升岗位能力"],
    ["04", "评价与反馈", "检验学习成效"],
    ["05", "持续发展", "完善能力档案"],
  ]
    .map((x) => `<div><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></div>`)
    .join("")}</div></section>
  <section class="mps35-roles" id="mps35-roles"><div class="mps35-guide-head"><span class="mps35-overline">ROLE ENTRANCE</span><h2>按服务对象进入工作台</h2><p>个人开展能力测评与学习提升，院校和机构组织培训、测评及成果管理。</p></div><div class="mps35-role-grid"><article><div class="mps35-role-number">01 / 个人服务</div><h3>在职教师、在校学生、社会人员及在职人员</h3><p>开展职业能力测评、学习实践和培训，查看个人能力档案与发展成果。</p><button type="button" data-personal-modal="true">进入个人服务 <span>↗</span></button></article><article><div class="mps35-role-number">02 / 机构服务</div><h3>院校、企业及培训服务机构</h3><p>面向教师、学生与员工组织职业能力提升项目，在授权范围内管理培训及测评业务。</p><button type="button" data-act="institution-login">进入机构服务 <span>↗</span></button></article></div></section>
  <div class="mps35-disclaimer"><strong>服务说明：</strong>本平台以职业能力发展为导向，提供学习、测评与评价相关服务；各类认证按独立规则办理。离线演示记录不具备职业资格或正式证书核验效力。</div>
 </section>`);
  }
  function standards() {
    let fw = [...db.frameworks]
      .map((f) =>
        f.id === "STD-G" ? { ...f, name: "通用数智能力框架", version: "2026-11修订稿", status: "报审稿" } : f,
      )
      .sort((a, b) => (({ "STD-G": 0, "STD-T": 1 })[a.id] ?? 99) - ({ "STD-G": 0, "STD-T": 1 }[b.id] ?? 99));
    content(
      `<section class="standard-wrap"><div class="standard-intro"><div class="site-eyebrow">COMPETENCY STANDARDS</div><h1>能力标准体系</h1><p>按标准查看适用对象、能力结构、观察点与业务应用。标准版本与培训、测评、认证项目使用统一编号关联。</p><div class="standard-disclaimer">说明：当前能力结构和考评观察点为业务展示示例，不代表正式标准原文。完整指标及条文须以经确认的研究院标准文件为准。</div></div><div class="standard-catalog">${fw
        .map((f, i) => {
          let d = window.MVERI_STANDARD_DETAILS?.[f.id];
          return `<article class="standard-card"><div class="standard-card-top"><span class="standard-number">${String(i + 1).padStart(2, "0")}</span><span class="standard-version">${esc(f.version)}</span></div><h2>${esc(f.name)}</h2><p>${esc(d?.summary || "标准详情待维护")}</p><div class="standard-facts"><span>${f.domains} 个能力维度</span><span>${db.projects.filter((p) => p.framework === f.id).length} 个关联项目</span><span>${esc(f.status)}</span></div><button class="standard-open" data-standard="${esc(f.id)}">查看标准详细内容 <span>→</span></button></article>`;
        })
        .join("")}</div></section>`,
    );
  }
  function standardDetail(id) {
    let f = db.frameworks.find((x) => x.id === id),
      d = window.MVERI_STANDARD_DETAILS?.[id];
    if (!f || !d) {
      standards();
      return;
    }
    let projects = db.projects.filter((p) => p.framework === id);
    content(
      `<section class="standard-wrap standard-detail"><button class="standard-back" data-standard-back="1">← 返回标准体系</button><div class="standard-detail-head"><div><div class="site-eyebrow">STANDARD / ${esc(f.id)}</div><h1>${esc(f.name)}</h1><p>${esc(d.summary)}</p><div class="standard-meta"><span>标准编号：${esc(f.id)}</span><span>版本：${esc(f.version)}</span><span>目录状态：${esc(f.status)}</span></div></div><div class="standard-head-badge">${f.domains}<small>能力维度</small></div></div><div class="standard-disclaimer"><strong>资料属性：</strong>${esc(d.basis)} 请勿将以下示例指标作为正式认证依据。</div><div class="standard-detail-grid"><div><section class="standard-info"><h2>标准概述</h2><dl><dt>适用对象</dt><dd>${esc(d.audience)}</dd><dt>应用范围</dt><dd>${esc(d.scope)}</dd><dt>标准版本</dt><dd>${esc(f.version)} · ${esc(f.id)}</dd></dl></section><section class="standard-info"><div class="standard-section-title"><h2>能力结构与观察点</h2><span>${d.domains.length} 个维度 · ${d.domains.reduce((n, x) => n + x.items.length, 0)} 项示例观察点</span></div><div class="standard-dimensions">${d.domains.map((v, i) => `<details class="standard-dimension" ${i === 0 ? "open" : ""}><summary><span class="dimension-index">D${String(i + 1).padStart(2, "0")}</span><span class="dimension-heading"><strong>${esc(v.name)}</strong><small>${esc(v.description)}</small></span><span class="dimension-count">${v.items.length} 项</span><span class="dimension-arrow">⌄</span></summary><div class="dimension-table"><div class="dimension-table-header"><span>观察点</span><span>可观察的能力表现（示例）</span></div>${v.items.map((item, j) => `<div class="dimension-item"><div><small>${esc(f.id)}-D${i + 1}-${j + 1}</small><strong>${esc(item[0])}</strong></div><p>${esc(item[1])}</p></div>`).join("")}</div></details>`).join("")}</div></section></div><aside class="standard-aside"><section class="standard-info"><h3>应用与评价说明</h3><p>建议将各观察点映射为具体任务、评分量规和证据要求。正式测评的分值、权重、及格线和认证条件需由授权规则另行确定。</p><div class="standard-flow"><span>标准</span>↓<span>考评点</span>↓<span>测评任务与证据</span>↓<span>报告与能力发展</span></div></section><section class="standard-info"><h3>关联培训项目</h3>${projects.length ? projects.map((p) => `<div class="standard-related"><b>${esc(p.name)}</b><small>${esc(p.id)} · ${esc(name("orgs", p.org))}</small></div>`).join("") : "<p>暂无关联培训项目</p>"}</section><section class="standard-info"><h3>版本与使用提示</h3><p>当前标准目录编号及版本来源于平台演示数据；正式发布状态、标准文本和指标体系应经研究院审核确认。</p><button class="standard-open" data-standard-back="1">查看其他标准 →</button></section></aside></div></section>`,
    );
  }
  const CAREER_GROUPS = [
    {
      id: "jobseeker",
      name: "待就业劳动者",
      goals: ["提升就业能力", "掌握数字化职业技能", "增强职业适应能力"],
      focus: "能力诊断、就业准备与岗位基础能力训练",
    },
    {
      id: "university",
      name: "大学生",
      goals: ["提升职业适应能力", "加强职场数智能力", "做好实习与就业准备"],
      focus: "就业能力、项目实践与学习发展",
    },
    {
      id: "vocational",
      name: "职业院校学生",
      goals: ["提升专业及通用能力", "强化数智能力", "积累学习与认证成果"],
      focus: "专业学习、职业训练与通用数智能力",
    },
    {
      id: "employee",
      name: "企业职工",
      goals: ["提升岗位胜任能力", "提高数字化工作效率", "拓展职业发展机会"],
      focus: "岗位能力诊断、专项学习与持续提升",
    },
    {
      id: "transition",
      name: "转岗人员",
      goals: ["分析转岗能力差距", "完成新岗位训练", "形成能力转换证明"],
      focus: "能力差距分析、转岗培训与复测",
    },
    {
      id: "flexible",
      name: "灵活就业人员",
      goals: ["提升可迁移能力", "拓展服务能力", "建立可信的能力档案"],
      focus: "通用能力、数字工具与能力成果积累",
    },
    {
      id: "frontline",
      name: "普通岗位从业者",
      goals: ["提升工作效率", "掌握实用数字工具", "增强岗位竞争力"],
      focus: "数字工具应用、岗位任务与工作实践",
    },
    {
      id: "teacher",
      name: "职业院校教师",
      goals: ["提升教师数智素养", "改进数字化教学能力", "支持教学与专业发展"],
      focus: "通用数智能力与教师素智素养双体系",
    },
  ];
  const CAREER_KEY = "mveri_personal_career_v7243";
  function getCareerProfile() {
    try {
      const map = JSON.parse(localStorage.getItem(CAREER_KEY) || "{}");
      return map[session?.account || person] || { group: "", goal: "", notes: "" };
    } catch {
      return { group: "", goal: "", notes: "" };
    }
  }
  function careerPlan() {
    const p = getCareerProfile(),
      group = CAREER_GROUPS.find((g) => g.id === p.group);
    const targets = group?.goals || [];
    content(
      `<div class="cp-page-title"><span class="cp-kicker">CAREER DEVELOPMENT PLAN</span><h1>我的职业发展规划</h1><p>根据当前职业阶段和发展需求选择服务路径，后续可随职业变化调整，不影响已有测评、学习和认证记录。</p></div><div class="cp-columns cp-plan-columns"><section class="cp-panel"><div class="cp-section-title"><div><span>01 / USER GROUP</span><h2>选择当前服务身份</h2></div></div><p class="cp-muted">身份用于个性化服务推荐，不直接决定能否参加测评或认证。</p><div class="cp-audience-grid">${CAREER_GROUPS.map((g) => `<button type="button" data-career-group="${g.id}" class="${g.id === p.group ? "selected" : ""}" aria-pressed="${g.id === p.group}"><span class="cp-group-mark">${g.id === "teacher" ? "✦" : "◇"}</span><b>${g.name}</b><small>${g.focus}</small></button>`).join("")}</div></section><section class="cp-panel"><div class="cp-section-title"><div><span>02 / DEVELOPMENT GOAL</span><h2>设定能力发展目标</h2></div></div><form id="careerForm"><input type="hidden" name="group" id="careerGroup" value="${esc(p.group)}"><label class="cp-field">主要发展目标<select id="careerGoal" name="goal" required><option value="">请先选择服务身份</option>${targets.map((t) => `<option value="${esc(t)}" ${p.goal === t ? "selected" : ""}>${esc(t)}</option>`).join("")}</select></label><label class="cp-field">个人发展说明（选填）<textarea name="notes" rows="4" maxlength="350" placeholder="如：希望提高工作中使用数智工具的能力">${esc(p.notes || "")}</textarea></label><button type="submit" class="primary cp-save">保存职业发展规划</button></form><div class="cp-guidance"><b>适用标准与服务提示</b><p id="careerFocus">${esc(group?.focus || "选择身份后显示适用服务重点")}</p><p>通用数智能力面向各类用户；职业院校教师可按需选择教师素智素养专项服务。认证仍执行对应项目的独立申请规则。</p></div></section></div><section class="cp-panel"><div class="cp-section-title"><div><span>03 / SERVICE MAP</span><h2>从目标到持续发展的服务路径</h2></div></div><div class="cp-path">${[
        ["01", "能力测评", "to-assessment"],
        ["02", "能力画像", "to-portfolio"],
        ["03", "学习与提升", "to-learning"],
        ["04", "评价认证", "to-certification"],
        ["05", "成长档案", "to-portfolio"],
      ]
        .map(
          ([n, t, link]) =>
            `<button type="button" data-act="${link}"><em>${n}</em><strong>${t}</strong><small>进入服务 ↗</small></button>`,
        )
        .join(
          "",
        )}</div></section><div class="cp-panel cp-disclaimer">说明：本页面是演示版的个人职业规划，身份与目标仅在当前浏览器保存；实际专业方向、课程和认证服务以对应项目的标准及规则为准。</div>`,
    );
  }
  function dashboard() {
    if (role === "personal") {
      const profile = getCareerProfile(),
        e = myEnroll(),
        a = myAssess(),
        c = myCert(),
        group = CAREER_GROUPS.find((g) => g.id === profile.group),
        label = group?.name || "尚未选择服务身份";
      const next = !profile.group
        ? "设置您的服务身份与职业目标"
        : !a.length
          ? "完成首次能力测评，建立能力基线"
          : !e.length
            ? "根据能力报告选择学习或培训项目"
            : e.some((v) => !v.completed)
              ? "继续当前学习项目并完成训练"
              : "查看能力画像，规划下一阶段提升";
      content(`<section class="cp-hero"><div><div class="cp-kicker">PERSONAL CAREER DEVELOPMENT</div><h1>个人职业能力发展服务中心</h1><p>面向学生、劳动者、各类岗位从业人员及职业院校教师，提供测评、学习、培训、评价与持续发展支持。</p><div class="cp-hero-badges"><span>${esc(label)}</span><span>${esc(profile.goal || "待设定发展目标")}</span></div></div><div class="cp-hero-action">${btn(profile.group ? "完善发展规划 →" : "开始职业发展规划 →", "to-plan", "primary")}</div></section>
 <div class="cp-summary"><div><span>已完成测评</span><strong>${a.length}</strong><small>对应原有测评记录</small></div><div><span>学习项目</span><strong>${e.length}</strong><small>已有报名与进度</small></div><div><span>认证申请</span><strong>${myApps().length}</strong><small>审核状态可追溯</small></div><div><span>能力证书</span><strong>${c.length}</strong><small>以已有记录为准</small></div></div>
 <section class="cp-panel"><div class="cp-section-title"><div><span>YOUR DEVELOPMENT PATH</span><h2>我的职业能力发展路径</h2></div>${btn("调整路径", "to-plan", "outline")}</div><div class="cp-path">${[
   ["01", "明确目标", "to-plan"],
   ["02", "能力测评", "to-assessment"],
   ["03", "能力画像", "to-portfolio"],
   ["04", "学习提升", "to-learning"],
   ["05", "评价认证", "to-certification"],
   ["06", "持续复测", "to-assessment"],
 ]
   .map(
     ([n, t, link]) =>
       `<button type="button" data-act="${link}"><em>${n}</em><strong>${t}</strong><small>查看服务 ↗</small></button>`,
   )
   .join("")}</div></section>
 <div class="cp-columns"><section class="cp-panel"><div class="cp-section-title"><div><span>NEXT ACTION</span><h2>建议下一步</h2></div></div><div class="cp-next"><div class="cp-next-icon">↗</div><div><strong>${esc(next)}</strong><p>根据当前身份、已有测评和学习记录进行规则化提示。仅作为职业能力发展参考。</p></div></div>${btn("查看我的发展规划 →", "to-plan", "primary")}</section><section class="cp-panel"><div class="cp-section-title"><div><span>STANDARD MATCHING</span><h2>适用能力标准</h2></div></div><div class="cp-standards"><div><b>通用数智能力框架</b><small>面向各类学习者与劳动者的基础能力发展</small></div>${profile.group === "teacher" ? "<div><b>教师素智素养框架</b><small>面向职业院校教师的专项专业发展测评</small></div>" : "<div><b>按需扩展专业方向能力</b><small>以实际已发布标准和服务项目为准</small></div>"}</div><p class="cp-muted">通用框架当前依据 2026-11 修订报审稿，不代表正式发布。</p></section></div>
 <section class="cp-panel"><div class="cp-section-title"><div><span>MY RECORDS</span><h2>最近的职业发展记录</h2></div>${btn("进入成长档案", "to-portfolio", "outline")}</div>${table(
   ["类型", "业务事项", "状态", "操作"],
   [
     ...e
       .slice(-4)
       .map((t) => [
         "学习",
         esc(name("projects", t.project)),
         `${Number(t.progress || 0)}%`,
         btn("查看学习", "to-learning", "ghost"),
       ]),
     ...myApps()
       .slice(-3)
       .map((t) => ["认证", esc(t.id), tag(t.status), btn("查看认证", "to-certification", "ghost")]),
   ],
 )}</section>`);
    } else if (role === "institution") {
      let ps = groupPeople(),
        projs = groupProjects(),
        en = groupEnrollment(),
        ass = db.assessments.filter((x) => byOrg(x.person, org));
      content(
        header(
          "机构业务总览",
          `${name("orgs", org)} · ${find("orgs", org)?.type === "region" ? "区域服务中心" : "合作院校"}`,
          btn("切换机构", "login"),
        ) +
          `<div class="cards">${stat("覆盖成员", ps.length, "关联院校与人员")}${stat("培训项目", projs.length, "含区域下属院校")}${stat("培训报名", en.length, "去重报名记录")}${stat("完成测评", ass.length, "本机构关联成绩")}</div>` +
          panel(
            "项目执行进度",
            table(
              ["项目编号", "培训项目", "责任院校", "报名人数", "完成学习", "状态"],
              projs.map((x) => {
                let es = db.enrollments.filter((e) => e.project === x.id);
                return [
                  x.id,
                  x.name,
                  name("orgs", x.org),
                  es.length,
                  es.filter((e) => e.completed).length,
                  tag(x.stage),
                ];
              }),
            ),
          ) +
          panel(
            "机构权限说明",
            `<div class="notice">区域中心仅查看自己负责区域内的院校和人员；院校仅查看自己的成员、培训与成绩。这里的机构数据全部来自统一人员、项目和学习记录。</div>`,
          ),
      );
    } else {
      let pending = db.applications.filter((x) => x.status === "待审核");
      content(
        header("研究院总部运营总览", "面向总部管理、质量监管、认证审核与证据追溯") +
          `<div class="cards">${stat("区域中心", db.orgs.filter((x) => x.type === "region").length, "统一授权组织")}${stat("合作院校", db.orgs.filter((x) => x.type === "school").length, "挂靠区域服务中心")}${stat("待审核认证", pending.length, "需人工审核")}${stat("已发证", db.certificates.length, "持证可公开核验")}</div>` +
          panel(
            "待处理认证任务",
            table(
              ["申请编号", "申请人", "所属院校", "关联培训", "资料状态", "操作"],
              pending.map((c) => [
                c.id,
                name("people", c.person),
                name("orgs", personOrg(c.person)),
                name("projects", c.project),
                tag(eligible(c.person).ok ? "证据完整" : "资料不齐"),
                btn("进入审核", "go-review-" + c.id, "primary"),
              ]),
            ),
          ) +
          panel(
            "跨机构数据统计",
            table(
              ["区域中心", "下属院校", "培训项目", "报名记录", "认证申请"],
              db.orgs
                .filter((x) => x.type === "region")
                .map((r) => {
                  let schools = db.orgs.filter((x) => x.parent === r.id);
                  return [
                    r.name,
                    schools.length,
                    db.projects.filter((p) => p.region === r.id).length,
                    db.enrollments.filter((e) => byOrg(e.person, r.id)).length,
                    db.applications.filter((a) => byOrg(a.person, r.id)).length,
                  ];
                }),
            ),
          ),
      );
    }
  }
  function portfolio() {
    const member = find("people", person) || {},
      en = myEnroll(),
      ass = myAssess()
        .slice()
        .sort((a, b) => (a.date || "").localeCompare(b.date || "")),
      ex = db.exams
        .filter((x) => x.person === person)
        .slice()
        .sort((a, b) => (a.date || "").localeCompare(b.date || "")),
      apps = myApps(),
      certs = myCert();
    const completed = en.filter((x) => x.completed).length,
      latest = ass[ass.length - 1],
      latestExam = ex[ex.length - 1],
      mean = en.length ? Math.round(en.reduce((sum, x) => sum + Number(x.progress || 0), 0) / en.length) : 0;
    const tab = window.__mveriPortfolioTab || "overview";
    const tabLabels = [
      ["overview", "档案总览"],
      ["assess", "测评档案"],
      ["learning", "学习档案"],
      ["portrait", "能力画像"],
      ["credentials", "认证成果"],
    ];
    const frameworkId = (latest && latest.framework) || find("projects", en[0]?.project)?.framework || "STD-G";
    const detail = (window.MVERI_STANDARD_DETAILS && window.MVERI_STANDARD_DETAILS[frameworkId]) || null;
    const domains = (detail?.domains || []).map((d) => d.name);
    const levelByScore = (s) => (s >= 90 ? "卓越" : s >= 80 ? "良好" : s >= 70 ? "达标" : s > 0 ? "发展中" : "待建立");
    const nextActions = [];
    if (!en.length) nextActions.push("报名一个与当前标准匹配的培训项目，形成学习记录。");
    if (en.length && completed < en.length) nextActions.push("优先完成当前培训课程，提升学习进度和能力画像完整度。");
    if (!latest) nextActions.push("完成一次正式能力测评，形成初始能力基线。");
    if (en.some((v) => v.completed) && !latestExam) nextActions.push("参加结业考试，补齐认证所需的关键证据。");
    if (eligible(person).ok && !apps.length) nextActions.push("你已具备申请条件，可提交认证申请。");
    if (apps.some((a) => a.status === "待审核")) nextActions.push("认证已提交，关注总部审核结果。");
    if (!nextActions.length) nextActions.push("保持学习与测评更新，持续完善个人能力档案。");
    const levelScore = Math.round(
      (latest?.score || 0) * 0.45 +
        mean * 0.2 +
        (latestExam?.score || 0) * 0.15 +
        (certs.filter((x) => x.status === "有效").length ? 12 : 0) +
        (apps.length ? 8 : 0),
    );
    const overallLevel = levelByScore(levelScore);
    function portfolioDomainScores() {
      if (!detail?.domains?.length) return [];
      const base = Number(latest?.score || 0),
        progress = mean,
        exam = Number(latestExam?.score || 0),
        certBoost = certs.filter((x) => x.status === "有效").length ? 6 : apps.length ? 3 : 0;
      const variantMap = {
        "STD-T": [
          [0.58, 0.14, 0.06, 1],
          [0.66, 0.18, 0.08, 2],
          [0.62, 0.15, 0.05, -1],
          [0.6, 0.12, 0.13, 0],
          [0.56, 0.18, 0.08, 3],
        ],
        "STD-G": [
          [0.62, 0.1, 0.08, 1],
          [0.58, 0.12, 0.07, 0],
          [0.6, 0.16, 0.08, 2],
          [0.55, 0.08, 0.1, 3],
          [0.59, 0.15, 0.12, -1],
          [0.57, 0.14, 0.1, 2],
        ],
      };
      const weights = variantMap[frameworkId] || detail.domains.map((_, i) => [0.6, 0.14, 0.08, i % 2 ? 2 : -1]);
      return detail.domains.map((d, i) => {
        const w = weights[i] || [0.6, 0.14, 0.08, 0];
        let score = Math.round(base * w[0] + progress * w[1] + exam * w[2] + certBoost + w[3]);
        if (!base && !progress && !exam) score = 0;
        else score = Math.max(0, Math.min(96, score));
        return { name: d.name, score, desc: d.description, items: d.items || [] };
      });
    }
    const portraitData = portfolioDomainScores();
    function radarSVG(items) {
      if (!items.length || items.every((x) => x.score === 0))
        return '<div class="portfolio-radar-empty">暂无足够测评与学习证据，完成至少一次测评后生成能力画像。</div>';
      const size = 330,
        cx = 165,
        cy = 165,
        r = 110,
        levels = 4;
      const pts = (radius) =>
        items.map((_, i) => {
          const ang = -Math.PI / 2 + (Math.PI * 2 * i) / items.length;
          return [cx + Math.cos(ang) * radius, cy + Math.sin(ang) * radius];
        });
      const polygon = pts(r)
        .map((p, i) => `${p[0]},${p[1]}`)
        .join(" ");
      const dataPts = items.map((it, i) => {
        const ang = -Math.PI / 2 + (Math.PI * 2 * i) / items.length;
        const rr = r * (it.score / 100);
        return [cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr];
      });
      const dataPoly = dataPts.map((p) => `${p[0]},${p[1]}`).join(" ");
      const rings = Array.from({ length: levels }, (_, i) => {
        const rr = r * ((i + 1) / levels);
        return `<polygon points="${pts(rr)
          .map((p) => `${p[0]},${p[1]}`)
          .join(" ")}" class="portfolio-radar-ring" />`;
      }).join("");
      const axes = pts(r)
        .map((p) => `<line x1="${cx}" y1="${cy}" x2="${p[0]}" y2="${p[1]}" class="portfolio-radar-axis" />`)
        .join("");
      const labels = pts(r + 24)
        .map((p, i) => `<text x="${p[0]}" y="${p[1]}" class="portfolio-radar-label">${esc(items[i].name)}</text>`)
        .join("");
      const dots = dataPts
        .map(
          (p, i) =>
            `<g><circle cx="${p[0]}" cy="${p[1]}" r="4.5" class="portfolio-radar-dot" /><text x="${p[0]}" y="${p[1] - 10}" class="portfolio-radar-value">${items[i].score}</text></g>`,
        )
        .join("");
      return `<svg class="portfolio-radar" viewBox="0 0 ${size} ${size}" aria-label="能力画像雷达图">${rings}${axes}<polygon points="${dataPoly}" class="portfolio-radar-fill"/><polyline points="${dataPoly}" class="portfolio-radar-line"/>${dots}${labels}<circle cx="${cx}" cy="${cy}" r="4" class="portfolio-radar-center"/></svg>`;
    }
    function strengthSummary(items) {
      if (!items.length) return { strengths: [], weaknesses: [] };
      const sorted = [...items].filter((x) => x.score > 0).sort((a, b) => b.score - a.score);
      return { strengths: sorted.slice(0, 2), weaknesses: sorted.slice(-2).sort((a, b) => a.score - b.score) };
    }
    const sw = strengthSummary(portraitData);
    function trendDelta() {
      if (ass.length < 2) return null;
      return Number(ass[ass.length - 1].score) - Number(ass[ass.length - 2].score);
    }
    const delta = trendDelta();
    const bodyOverview = `
 <div class="portfolio-grid portfolio-grid-hero">${[
   ["成长参与指数（体验）", levelScore, `当前判定：${overallLevel}`],
   ["测评记录", ass.length, latest ? `最近得分 ${latest.score} 分` : "尚未测评"],
   ["学习完成度", mean + "%", completed ? `已完成 ${completed} 个项目` : "暂无完成项目"],
   [
     "有效证书",
     certs.filter((x) => x.status === "有效").length,
     apps.length ? `认证申请 ${apps.length} 项` : "尚无认证申请",
   ],
 ]
   .map(
     ([k, n, d]) =>
       `<div class="portfolio-stat highlight"><small>${k}</small><strong>${n}</strong><span>${d}</span></div>`,
   )
   .join("")}</div>
 <div class="portfolio-two portfolio-overview-main">
   <section class="portfolio-surface portfolio-surface-hero">
     <div class="portfolio-section-head"><div><h3>当前成长画像摘要</h3><p>基于最近测评、学习进度、考试和认证结果生成综合判断。</p></div><span class="portfolio-badge">${overallLevel}</span></div>
     <div class="portfolio-kv">
       <div class="portfolio-kv-row"><span>当前主标准</span><strong>${esc(name("frameworks", frameworkId))}</strong></div>
       <div class="portfolio-kv-row"><span>最近一次测评</span><strong>${latest ? `${latest.score} 分（${latest.date}）` : "暂无记录"}</strong></div>
       <div class="portfolio-kv-row"><span>学习项目进度</span><strong>${mean}%</strong></div>
       <div class="portfolio-kv-row"><span>认证状态</span><strong>${certs.length ? "已获得电子证书" : apps.some((a) => a.status === "待审核") ? "认证待审核" : "尚未完成认证"}</strong></div>
     </div>
     <div class="portfolio-summary-boxes">
       <div class="portfolio-summary-card"><b>优势方向</b><span>${sw.strengths.length ? sw.strengths.map((x) => `${x.name}（${x.score}）`).join("、") : "需形成测评记录后生成"}</span></div>
       <div class="portfolio-summary-card warn"><b>优先提升</b><span>${sw.weaknesses.length ? sw.weaknesses.map((x) => `${x.name}（${x.score}）`).join("、") : "暂无"}</span></div>
     </div>
   </section>
   <section class="portfolio-surface">
     <div class="portfolio-section-head"><div><h3>下一步建议</h3><p>根据当前证据自动生成的学习与认证行动建议。</p></div></div>
     <div class="portfolio-advice-list">${nextActions.map((x, i) => `<div class="portfolio-advice"><span>${i + 1}</span><div>${esc(x)}</div></div>`).join("")}</div>
   </section>
 </div>
 <div class="portfolio-two">
   <section class="portfolio-surface"><div class="portfolio-section-head"><div><h3>成长时间线</h3><p>按时间追溯测评、考试、认证和证书关键节点。</p></div></div>${
     [
       ...ass.map((x) => ({
         date: x.date,
         label: "完成测评 · " + name("frameworks", x.framework),
         detail: x.score + " 分",
       })),
       ...ex.map((x) => ({
         date: x.date,
         label: "结业考试 · " + name("projects", x.project),
         detail: x.score + " 分",
       })),
       ...apps.map((x) => ({ date: x.date, label: "认证申请 · " + x.id, detail: x.status })),
       ...certs.map((x) => ({ date: x.issued, label: "证书核发 · " + x.id, detail: x.status })),
     ]
       .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
       .map(
         (x) =>
           `<div class="portfolio-event"><time>${esc(x.date)}</time><div><strong>${esc(x.label)}</strong><small>${esc(x.detail)}</small></div></div>`,
       )
       .join("") || '<p class="portfolio-note">暂无成长记录，完成测评或学习后将自动出现。</p>'
   }</section>
   <section class="portfolio-surface"><div class="portfolio-section-head"><div><h3>业务证据链</h3><p>用于支撑能力画像、认证判断和学习建议的关键数据。</p></div></div>
     <div class="portfolio-evidence"><span>测评证据</span><b>${ass.length} 条</b></div>
     <div class="portfolio-evidence"><span>培训学习记录</span><b>${en.length} 项</b></div>
     <div class="portfolio-evidence"><span>考试记录</span><b>${ex.length} 次</b></div>
     <div class="portfolio-evidence"><span>认证申请</span><b>${apps.length} 项</b></div>
     <div class="portfolio-evidence"><span>电子证书</span><b>${certs.length} 张</b></div>
     <p class="portfolio-note">所有内容由当前登录账号关联的业务数据自动汇总，形成完整的个人能力档案。</p>
   </section>
 </div>`;
    const assessBody =
      panel(
        "测评成绩与标准关联",
        table(
          ["测评编号", "关联能力标准", "测评日期", "成绩", "状态"],
          ass.map((a) => [
            esc(a.id),
            esc(name("frameworks", a.framework)),
            esc(a.date),
            `<strong>${Number(a.score)} / 100</strong>`,
            tag(a.status),
          ]),
        ),
      ) +
      `<div class="portfolio-two"><section class="portfolio-surface"><div class="portfolio-section-head"><div><h3>成绩变化趋势</h3><p>展示历次测评得分及变化幅度。</p></div>${delta === null ? "" : `<span class="portfolio-trend ${delta >= 0 ? "up" : "down"}">${delta >= 0 ? "+" : ""}${delta} 分</span>`}</div>${ass.length ? ass.map((a) => `<div class="portfolio-score"><span>${esc(a.date)} · ${esc(name("frameworks", a.framework))}</span><div class="portfolio-track"><i style="width:${Math.max(0, Math.min(100, Number(a.score) || 0))}%"></i></div><strong>${Number(a.score)}分</strong></div>`).join("") : '<p class="portfolio-note">暂无测评记录。</p>'}<p class="portfolio-note">不同标准的成绩不直接等价比较；该趋势用于观察个人历次测评变化。</p></section>
 <section class="portfolio-surface"><div class="portfolio-section-head"><div><h3>测评分析结论</h3><p>根据当前测评和学习状态形成阶段性判断。</p></div></div>
 <div class="portfolio-conclusion-grid">
   <div class="portfolio-conclusion"><small>当前标准</small><strong>${esc(name("frameworks", frameworkId))}</strong></div>
   <div class="portfolio-conclusion"><small>能力水平</small><strong>${levelByScore(latest?.score || 0)}</strong></div>
   <div class="portfolio-conclusion"><small>是否达标</small><strong>${latest && latest.score >= 70 ? "已达标" : "需继续提升"}</strong></div>
   <div class="portfolio-conclusion"><small>建议动作</small><strong>${nextActions[0] || "保持更新"}</strong></div>
 </div></section></div>`;
    const learningBody =
      panel(
        "培训学习明细",
        table(
          ["培训项目", "能力标准", "进度", "学习状态", "关联编号"],
          en.map((e) => {
            let proj = find("projects", e.project);
            return [
              esc(name("projects", e.project)),
              esc(name("frameworks", proj?.framework)),
              `<div class="portfolio-track narrow"><i style="width:${Math.min(100, Number(e.progress) || 0)}%"></i></div>${Number(e.progress) || 0}%`,
              tag(e.completed ? "已完成" : "学习中"),
              esc(e.id),
            ];
          }),
        ),
      ) +
      `<div class="portfolio-two"><section class="portfolio-surface"><div class="portfolio-section-head"><div><h3>学习投入分析</h3><p>从项目参与、完成度和结业考试三个维度查看学习状态。</p></div></div>
 <div class="portfolio-learning-metrics">
   <div class="portfolio-line"><span>培训平均完成度</span><strong>${mean}%</strong></div><div class="portfolio-track"><i style="width:${mean}%"></i></div>
   <div class="portfolio-line"><span>已完成项目</span><strong>${completed} / ${en.length || 0}</strong></div>
   <div class="portfolio-line"><span>结业考试通过率</span><strong>${ex.length ? Math.round((ex.filter((x) => x.passed).length / ex.length) * 100) : 0}%</strong></div>
 </div></section>
 <section class="portfolio-surface"><div class="portfolio-section-head"><div><h3>结业考试记录</h3><p>结业考试与培训项目一一对应。</p></div></div>${table(
   ["考试编号", "关联培训项目", "考试日期", "得分", "考试结果"],
   ex.map((x) => [
     esc(x.id),
     esc(name("projects", x.project)),
     esc(x.date),
     Number(x.score) + " / 100",
     tag(x.passed ? "通过" : "未通过"),
   ]),
 )}</section></div>`;
    const portraitBody = `<div class="portfolio-two portrait-layout"><section class="portfolio-surface"><div class="portfolio-section-head"><div><h3>综合能力画像雷达图</h3><p>演示性维度估计（非正式分维度评分），支持点击查看证据。</p></div><span class="portfolio-badge soft">${esc(name("frameworks", frameworkId))}</span></div>${radarSVG(portraitData)}<p class="portfolio-note">说明：此图是基于总体测评、学习、考试和认证数据计算的演示性维度估计，并非正式分维度测评分数；点击维度可查看估计依据。</p></section>
 <section class="portfolio-surface"><div class="portfolio-section-head"><div><h3>维度分析</h3><p>查看各能力维度的表现、定义与发展建议。</p></div></div>${
   portraitData.length
     ? portraitData
         .map(
           (x) =>
             `<button type="button" class="portfolio-dimension portfolio-dimension-button" data-dimension="${esc(x.name)}" aria-label="查看${esc(x.name)}的分析依据"><div class="portfolio-line"><strong>${esc(x.name)} ↗</strong><span>${x.score} / 100</span></div><div class="portfolio-track"><i style="width:${x.score}%"></i></div><p>${esc(x.desc)}</p><small>建议关注：${esc(
               (x.items || [])
                 .slice(0, 2)
                 .map((i) => i[0])
                 .join("、") || "暂无",
             )}</small></button>`,
         )
         .join("")
     : '<p class="portfolio-note">尚无测评证据，先进入“能力测评”完成测评。</p>'
 }</section></div>
 <div class="portfolio-two"><section class="portfolio-surface"><div class="portfolio-section-head"><div><h3>优势项与短板项</h3><p>帮助学员识别优先保持和重点提升的方向。</p></div></div>
 <div class="portfolio-strength-wrap">
  <div class="portfolio-strength positive"><h4>优势项</h4>${sw.strengths.length ? sw.strengths.map((x) => `<div><b>${esc(x.name)}</b><span>${x.score} 分</span></div>`).join("") : "<p>暂无</p>"}</div>
  <div class="portfolio-strength caution"><h4>待提升项</h4>${sw.weaknesses.length ? sw.weaknesses.map((x) => `<div><b>${esc(x.name)}</b><span>${x.score} 分</span></div>`).join("") : "<p>暂无</p>"}</div>
 </div></section>
 <section class="portfolio-surface"><div class="portfolio-section-head"><div><h3>个性化提升建议</h3><p>围绕短板项提供下一步行动建议。</p></div></div>
 <div class="portfolio-recommend-list">${(sw.weaknesses.length
   ? sw.weaknesses
   : [
       { name: "建立基础测评证据", score: 0 },
       { name: "完善学习与认证链路", score: 0 },
     ]
 )
   .map(
     (x, i) =>
       `<div class="portfolio-advice"><span>${i + 1}</span><div>围绕 <b>${esc(x.name)}</b> 进行专项训练，建议先完成相关课程学习，再针对该能力参加一次复测并观察提升效果。</div></div>`,
   )
   .join("")}</div></section></div>`;
    const credBody =
      panel(
        "认证申请记录",
        table(
          ["申请编号", "关联项目", "关联测评", "关联考试", "状态"],
          apps.map((x) => [
            esc(x.id),
            esc(name("projects", x.project)),
            esc(x.assessment || "—"),
            esc(x.exam || "—"),
            tag(x.status),
          ]),
        ),
      ) +
      `<div class="portfolio-two"><section class="portfolio-surface"><div class="portfolio-section-head"><div><h3>认证成果总览</h3><p>展示认证申请、证书和当前完成情况。</p></div></div>
  <div class="portfolio-conclusion-grid">
    <div class="portfolio-conclusion"><small>认证申请数</small><strong>${apps.length}</strong></div>
    <div class="portfolio-conclusion"><small>待审核</small><strong>${apps.filter((a) => a.status === "待审核").length}</strong></div>
    <div class="portfolio-conclusion"><small>已发证</small><strong>${apps.filter((a) => a.status === "已发证").length}</strong></div>
    <div class="portfolio-conclusion"><small>有效证书</small><strong>${certs.filter((c) => c.status === "有效").length}</strong></div>
  </div></section>
  <section class="portfolio-surface"><div class="portfolio-section-head"><div><h3>我的数字证书</h3><p>已核发证书支持在公共服务官网进行公开核验。</p></div></div>${certs.length ? certs.map((c) => certCard(c)).join("") : '<div class="empty">尚无已核发证书；通过审核后将自动出现在此处。</div>'}</section></div>`;
    const bodies = {
      overview: bodyOverview,
      assess: assessBody,
      learning: learningBody,
      portrait: portraitBody,
      credentials: credBody,
    };
    content(
      header(
        "个人能力档案袋",
        "汇集测评、培训、考试、认证及能力发展记录，形成可追溯、可分析、可展示的个人成长档案",
        '<a class="primary portfolio-report-btn" href="report.html" target="_blank" rel="noopener">导出能力报告 ↗</a>',
      ) +
        `<section class="portfolio-head"><div class="portfolio-avatar">${esc((member.name || "学").slice(0, 1))}</div><div><h2>${esc(member.name || "个人用户")}</h2><p>${esc(member.title || "个人学习者")} · ${esc(name("orgs", member.org))}</p><small>档案编号：${esc(person)} · 数据随业务操作实时更新</small></div><span class="portfolio-identity">${overallLevel} · 成长档案</span></section><nav class="portfolio-tabs" aria-label="档案袋分类">${tabLabels.map(([id, label]) => `<button type="button" data-portfolio-tab="${id}" class="${tab === id ? "active" : ""}" aria-current="${tab === id ? "page" : "false"}">${label}</button>`).join("")}</nav><div class="portfolio-body">${bodies[tab] || bodyOverview}</div>`,
    );
  }
  function assessment() {
    let done = myAssess();
    content(
      header("个人能力测评", "测评结果与标准、学员身份及培训认证规则关联") +
        panel(
          "测评记录",
          table(
            ["测评编号", "能力标准", "得分", "日期", "状态"],
            done.map((a) => [a.id, name("frameworks", a.framework), `<b>${a.score}</b> / 100`, a.date, tag(a.status)]),
          ),
        ) +
        panel(
          "发起体验测评",
          `<div class="notice">以下为离线规则化体验测评：5道题各20分，按所选能力标准计分，并写入该学员正式的体验记录。不是AI随机生成测评。</div><div class="formrow"><label class="field">能力标准<select id="test-framework">${db.frameworks.map((x) => `<option value="${x.id}">${x.name}</option>`).join("")}</select></label>${btn("开始测评（5题）", "start-test", "primary")}</div><div id="test-zone"></div>`,
        ),
    );
  }
  const questions = [
    ["数字化教学资源共享最应优先考虑哪项？", ["只追求访问量", "版权许可与学习需求", "尽可能公开学生隐私"], "1"],
    ["利用AI辅助教学前，首先应当做什么？", ["明确教学目标与数据边界", "直接替代全部教学", "上传所有学生原始资料"], "0"],
    ["分析学习数据时，应优先使用？", ["个体敏感信息明文", "匿名或最小必要数据", "未经授权的外部数据"], "1"],
    ["对于生成式AI的课堂内容，教师应？", ["不作审核直接使用", "核实内容准确性与适切性", "让学生承担所有审核"], "1"],
    ["评价数字能力提升效果，应优先依据？", ["单一工具的使用次数", "可观察的能力表现及证据", "社交媒体热度"], "1"],
  ];
  function testZone() {
    let box = $("#test-zone");
    if (!box) return;
    box.innerHTML = `<div class="panel" style="margin-top:18px"><h2>能力测评作答</h2>${questions.map((q, i) => `<div style="padding:12px 0;border-bottom:1px solid #edf1f5"><b>${i + 1}. ${q[0]}</b>${q[1].map((o, j) => `<label style="display:block;margin-top:10px;font-size:12px"><input type="radio" name="q${i}" value="${j}"> ${o}</label>`).join("")}</div>`).join("")}<div style="margin-top:18px">${btn("提交并计算成绩", "submit-test", "primary")}</div></div>`;
  }
  function learning() {
    let x = myEnroll();
    content(
      header("培训学习", "培训报名、进度、考试与认证均按照同一培训项目编号关联") +
        panel(
          "我的培训项目",
          table(
            ["项目编号", "项目名称", "所属机构", "学习进度", "结业状态", "操作"],
            x.map((e) => [
              e.project,
              name("projects", e.project),
              name("orgs", find("projects", e.project)?.org),
              `<span class="progress"><i style="width:${e.progress}%"></i></span>${e.progress}%`,
              tag(e.completed ? "已完成" : "学习中"),
              e.completed ? "已结业" : btn("完成剩余课程", "finish-" + e.id, "primary"),
            ]),
          ),
        ) +
        panel(
          "可报名培训项目",
          table(
            ["项目编号", "项目名称", "能力标准", "状态", "操作"],
            db.projects.map((p) => [
              p.id,
              p.name,
              name("frameworks", p.framework),
              tag(p.stage),
              myEnroll().some((e) => e.project === p.id) ? "已报名" : btn("报名此项目", "enroll-" + p.id, "outline"),
            ]),
          ),
        ) +
        panel(
          "结业考试",
          `<div class="notice">学习完成后可以参加基于所报项目的离线结业测验。试卷为3道选择题；至少答对2题视为通过。成绩保存并可追溯到项目。</div>${
            x
              .filter((e) => e.completed)
              .map(
                (e) =>
                  `<div class="sequence"><span>${name("projects", e.project)}</span>${db.exams.some((ex) => ex.person === person && ex.project === e.project) ? tag("已参加考试") : btn("参加结业考试", "exam-" + e.project, "primary")}</div>`,
              )
              .join("") || '<div class="muted">请先完成培训课程，再参加结业考试。</div>'
          }<div id="exam-zone"></div>`,
        ),
    );
  }
  function certification() {
    let elig = eligible(person),
      apps = myApps(),
      cert = myCert();
    content(
      header("认证与数字证书", "申请依据来自真实关联的培训、测评和考试记录") +
        panel(
          "认证条件校验",
          `<div class="stepper"><span class="step ${elig.e ? "ok" : ""}">① 已完成培训 ${elig.e ? "✓" : "—"}</span><span class="step ${elig.a ? "ok" : ""}">② 同标准测评达标 ${elig.a ? "✓" : "—"}</span><span class="step ${elig.x ? "ok" : ""}">③ 结业考试通过 ${elig.x ? "✓" : "—"}</span></div><div class="notice">系统根据已完成培训项目匹配对应的测评标准、成绩和考试记录；缺少任一要件则不允许提交认证申请。</div>${elig.ok && !apps.some((c) => c.project === elig.e.project) ? btn("提交认证申请", "apply", "primary") : elig.ok ? tag("该项目已提交申请") : '<span class="tag amber">尚未满足申请条件</span>'}`,
        ) +
        panel(
          "我的认证申请",
          table(
            ["申请编号", "关联项目", "提交日期", "审核状态", "审核备注"],
            apps.map((x) => [x.id, name("projects", x.project), x.date, tag(x.status), x.note || "—"]),
          ),
        ) +
        panel(
          "我的电子证书",
          cert.length
            ? cert.map((c) => certCard(c)).join("")
            : '<div class="empty">尚无已核发证书；通过审核后将自动出现在此处。</div>',
        ),
    );
  }
  function certCard(c) {
    return `<div class="cert"><div style="font-size:12px;letter-spacing:.2em;color:#a37d3d">MODERN VOCATIONAL EDUCATION RESEARCH INSTITUTE</div><h2>素智能力认证电子证书</h2><div class="certname">${esc(name("people", c.person))}</div><p>完成「${esc(name("projects", c.project))}」相关能力评价与认证程序</p><p>证书编号：<b>${esc(c.id)}</b></p><p>颁发日期：${esc(c.issued)}　状态：${esc(c.status)}</p><div class="sr-note">体验证书 · 非真实认证文件，不具有实际证明效力</div></div>`;
  }
  let verifySessionHistory = [];
  function verify() {
    const publicView = role === "public";
    const result = `<div id="verify-result" class="verification-result" aria-live="polite"></div>`;
    const view = `<section class="verification-page ${publicView ? "verification-public" : ""}"><div class="verification-head"><span class="verification-kicker">CERTIFICATE VERIFICATION · MVERI</span><h1>数字证书核验</h1><p>查询证书编号、核对发证记录与当前状态。核验结果仅代表当前平台存储记录，不公开个人测评和考试明细。</p><div class="verification-warning"><b>演示环境说明</b>：当前核验数据保存在浏览器本地，示例证书不具有正式认证效力，也无法跨设备保证记录一致。正式上线须对接服务器端证书数据库和签名核验服务。</div></div><div class="verification-layout"><div class="verification-main"><section class="verification-panel"><div class="verification-panel-heading"><div><span class="verification-step">01 · 查询</span><h2>证书信息查询</h2></div><span class="verification-secure">编号精确匹配</span></div><form id="mveri-verify-form" class="verification-form"><label for="verify-id">证书编号</label><div class="verification-search"><input id="verify-id" name="certificateNumber" autocomplete="off" maxlength="80" placeholder="请输入证书编号，例如 MVERI-2026-0001" value="${esc(query)}" required><button type="submit">查询证书</button></div><p>支持复制粘贴编号。核验不要求身份证号、手机号或其他敏感信息。</p></form>${result}</section><section class="verification-panel"><div class="verification-panel-heading"><div><span class="verification-step">02 · 记录</span><h2>本次访问的核验记录</h2></div><button type="button" class="verification-clear" data-verify-clear="true">清空记录</button></div><div id="verification-history"></div></section></div><aside class="verification-aside"><section class="verification-panel"><h2>核验说明</h2><ol><li>在证书上找到唯一编号并准确输入。</li><li>查看系统是否存在对应的发证记录。</li><li>核对证书状态、发证日期和认证项目。</li><li>出现不一致或无法查询时联系发证机构核实。</li></ol></section><section class="verification-panel"><h2>常见问题</h2><details><summary>查不到证书怎么办？</summary><p>检查编号是否正确；只有已写入当前数据库的证书才能查询。未通过审核、尚未发证的申请不会出现在此处。</p></details><details><summary>“有效”意味着什么？</summary><p>代表当前平台记录的证书状态。演示版不能独立证明证书真实性或现实世界中的法律效力。</p></details><details><summary>可以使用截图作为证明吗？</summary><p>截图无法证明证书实时状态。正式业务应使用官方服务器核验地址或数字签名核验。</p></details></section></aside></div></section>`;
    if (publicView) content(view);
    else content(header("电子证书核验", "证书核验服务，演示数据仅在当前浏览器有效") + view);
    verifyResult();
    renderVerifyHistory();
  }
  function verifyMaskedName(raw) {
    const str = String(raw || "");
    return str.length <= 1 ? "*" : str.slice(0, 1) + "*".repeat(Math.min(3, str.length - 1));
  }
  function renderVerifyHistory() {
    const el = document.getElementById("verification-history");
    if (!el) return;
    el.innerHTML = verifySessionHistory.length
      ? `<div class="verification-history-list">${verifySessionHistory.map((r, i) => `<div><span>${esc(r.at)}</span><strong>${esc(r.id)}</strong><em class="${r.found ? "good" : "unknown"}">${r.found ? "找到记录" : "未查到"}</em></div>`).join("")}</div>`
      : '<p class="verification-empty">当前页面会话暂无查询记录。不会向浏览器永久存储查询历史。</p>';
  }
  function verifyResult() {
    const el = document.getElementById("verify-result");
    if (!el) return;
    const id = String(query || "").trim();
    if (!id) {
      el.innerHTML = '<div class="verification-empty">请输入证书编号开始核验。</div>';
      return;
    }
    const c = db.certificates.find(
      (x) =>
        String(x.id || "")
          .trim()
          .toUpperCase() === id.toUpperCase(),
    );
    if (!c) {
      el.innerHTML = `<div class="verification-outcome no-match" role="status"><div class="verification-symbol">!</div><div><h3>未查到匹配证书</h3><p>本地证书记录中没有编号 <b>${esc(id)}</b>。请检查编号是否正确；未查到不等于已认定为伪造证书。</p></div></div>`;
      return;
    }
    const status = String(c.status || "状态未记录"),
      valid = status === "有效";
    const personRecord = db.people.find((p) => p.id === c.person);
    const projectRecord = db.projects.find((p) => p.id === c.project);
    const appRecord = db.applications.find((a) => a.id === c.application);
    el.innerHTML = `<div class="verification-outcome ${valid ? "matched" : "review"}" role="status"><div class="verification-symbol">${valid ? "✓" : "!"}</div><div><h3>${valid ? "查询到有效状态记录" : "查询到证书记录，需核对状态"}</h3><p>${valid ? "该证书编号存在于当前浏览器的演示数据中。" : "该编号存在，但状态并非“有效”，请联系发证机构核实。"} 不代表官方联网核验。</p></div><span class="verification-state">${esc(status)}</span></div><div class="verification-certificate"><div class="verification-certificate-heading"><img src="../assets/mveri-logo.png" alt="研究院标识"><div><b>现代职业教育研究院</b><span>数字证书核验记录 · DEMO</span></div></div><div class="verification-facts"><div><span>证书编号</span><strong>${esc(c.id)}</strong></div><div><span>持证人（脱敏）</span><strong>${esc(verifyMaskedName(personRecord?.name))}</strong></div><div><span>认证项目</span><strong>${esc(projectRecord?.name || "关联项目未找到")}</strong></div><div><span>发证日期</span><strong>${esc(c.issued || "未记录")}</strong></div><div><span>当前状态</span><strong>${esc(status)}</strong></div><div><span>关联审核</span><strong>${esc(appRecord?.status || "未提供审核记录")}</strong></div></div><div class="verification-demo-mark">演示数据 · 非正式证明文件</div><div class="verification-actions"><button type="button" data-verify-print="true">打印核验记录</button><button type="button" data-verify-copy="true" data-copy-id="${esc(c.id)}">复制证书编号</button></div></div>`;
  }
  function members() {
    content(
      header("人员档案", "仅展示当前机构权限范围内的人员记录") +
        panel(
          "成员目录",
          table(
            ["人员编号", "姓名", "所在院校", "职务", "培训报名", "完成测评", "认证状态"],
            groupPeople().map((p) => [
              p.id,
              p.name,
              name("orgs", p.org),
              p.title,
              db.enrollments.filter((e) => e.person === p.id).length,
              db.assessments.filter((a) => a.person === p.id).length,
              db.applications.find((c) => c.person === p.id)?.status || "未申请",
            ]),
          ),
        ),
    );
  }
  function projects() {
    let ps = role === "institution" ? groupProjects() : db.projects;
    content(
      header("培训项目", "项目以唯一编号绑定区域、院校、学员和能力标准") +
        panel(
          "项目台账",
          table(
            ["项目编号", "项目名称", "责任院校", "能力标准", "报名/容量", "完成", "起止日期", "项目状态"],
            ps.map((p) => {
              let en = db.enrollments.filter((e) => e.project === p.id);
              return [
                p.id,
                p.name,
                name("orgs", p.org),
                name("frameworks", p.framework),
                `${en.length}/${p.capacity}`,
                en.filter((e) => e.completed).length,
                `${p.start} ~ ${p.end}`,
                tag(p.stage),
              ];
            }),
          ),
        ),
    );
  }
  function reports() {
    let pe = groupPeople(),
      ids = new Set(pe.map((x) => x.id));
    content(
      header("机构测评与认证报告", "基于机构真实关联数据计算汇总结果") +
        `<div class="cards">${stat("在册人员", pe.length, "组织权限内")}${stat("已完成测评", db.assessments.filter((a) => ids.has(a.person)).length, "按测评记录统计")}${stat("认证申请", db.applications.filter((a) => ids.has(a.person)).length, "所有审核状态")}${stat("已发证", db.certificates.filter((a) => ids.has(a.person)).length, "证书可核验")}</div>` +
        panel(
          "个人综合记录",
          table(
            ["姓名", "院校", "最近测评成绩", "培训进度", "认证状态"],
            pe.map((p) => {
              let a = db.assessments.filter((a) => a.person === p.id).at(-1),
                e = db.enrollments.find((e) => e.person === p.id),
                c = db.applications.find((a) => a.person === p.id);
              return [
                p.name,
                name("orgs", p.org),
                a ? `${a.score}分` : "尚未测评",
                e ? `${e.progress}%` : "未报名",
                c ? tag(c.status) : "未申请",
              ];
            }),
          ),
        ),
    );
  }
  function organizations() {
    content(
      header("组织与区域管理", "区域中心与所属院校形成树状关系，人员和项目按组织归属计算") +
        panel(
          "组织目录",
          table(
            ["组织编码", "组织名称", "类型", "上级区域", "负责人", "关联人员", "状态"],
            db.orgs.map((o) => [
              o.id,
              o.name,
              o.type === "region" ? "区域服务中心" : "院校",
              o.parent ? name("orgs", o.parent) : "研究院总部",
              o.manager,
              db.people.filter((p) => byOrg(p.id, o.id)).length,
              tag(o.status === "active" ? "启用" : "停用"),
            ]),
          ),
        ),
    );
  }
  function assessments() {
    content(
      header("测评数据管理", "所有成绩记录对应唯一学员和标准版本") +
        panel(
          "测评成绩明细",
          table(
            ["记录编号", "姓名", "所在院校", "适用标准", "成绩", "完成日期"],
            db.assessments.map((a) => [
              a.id,
              name("people", a.person),
              name("orgs", personOrg(a.person)),
              name("frameworks", a.framework),
              `${a.score}分`,
              a.date,
            ]),
          ),
        ),
    );
  }
  function reviews() {
    content(
      header("认证审核工作台", "三项自动规则校验 + 总部人工审核 + 操作审计") +
        panel(
          "待审核任务",
          table(
            ["申请编号", "姓名", "所在院校", "项目", "培训进度", "测评", "考试", "操作"],
            db.applications
              .filter((a) => a.status === "待审核")
              .map((a) => {
                let ev = eligible(a.person);
                return [
                  a.id,
                  name("people", a.person),
                  name("orgs", personOrg(a.person)),
                  name("projects", a.project),
                  ev.e ? `${ev.e.progress}%` : "缺失",
                  ev.a ? `${ev.a.score}分` : "缺失",
                  ev.x ? `${ev.x.score}分` : "缺失",
                  `<div class="actions">${btn("通过发证", "approve-" + a.id, "primary")}${btn("驳回", "reject-" + a.id, "outline")}</div>`,
                ];
              }),
          ),
        ) +
        panel(
          "认证申请全量记录",
          table(
            ["申请编号", "申请人", "日期", "状态", "审核意见"],
            db.applications.map((a) => [a.id, name("people", a.person), a.date, tag(a.status), a.note || "—"]),
          ),
        ),
    );
  }
  function certificates() {
    content(
      header("证书管理中心", "证书以认证申请为来源；每张证书都能回溯到人员、项目、审核意见") +
        panel(
          "已核发证书",
          table(
            ["证书编号", "持证人", "院校", "培训项目", "发证日期", "状态", "操作"],
            db.certificates.map((c) => [
              c.id,
              name("people", c.person),
              name("orgs", personOrg(c.person)),
              name("projects", c.project),
              c.issued,
              tag(c.status),
              btn("公开核验", "lookup-" + c.id, "ghost"),
            ]),
          ),
        ),
    );
  }
  function audits() {
    content(
      header("操作审计与证据链", "业务操作留存时间、操作者、关联对象和动作说明") +
        panel(
          "最近操作记录",
          table(
            ["时间", "操作者", "动作", "关联记录", "详情"],
            db.audits.map((a) => [a.at, a.actor, a.event, a.target, a.detail]),
          ),
        ),
    );
  }
  function renderPage() {
    if (role !== "public" && (!session || session.role !== role)) {
      role = "public";
      page = "home";
      shell();
      return;
    }
    if (!authorizedPage(page)) {
      page = "dashboard";
    }
    (
      ({
        home,
        services,
        news,
        standards,
        ecology,
        dashboard,
        plan: careerPlan,
        assessment,
        learning,
        certification,
        portfolio,
        verify,
        members,
        projects,
        reports,
        organizations,
        assessments,
        reviews,
        certificates,
        audits,
      })[page] || home
    )();
    if (page === "verify") verifyResult();
  }
  function addAudit(actor, event, target, detail) {
    db.audits.unshift({
      id: "L" + String(Date.now()),
      at: new Date().toLocaleString("sv-SE"),
      actor,
      event,
      target,
      detail,
    });
  }
  function loginHtml() {
    return `<div class="login-overlay" role="dialog" aria-modal="true" aria-label="统一身份登录"><div class="loginbox authbox"><div class="authhead"><div class="authmark">M</div><div><span>现代职业教育研究院</span><h2>公共服务平台 · 统一登录</h2><p>一套账号，按权限进入对应业务工作台</p></div><button type="button" class="closeauth" data-act="close-login" aria-label="关闭">×</button></div><form id="login-form" class="authform"><label class="field">登录账号<input id="login-account" name="account" autocomplete="username" required placeholder="请输入登录账号"></label><label class="field">登录密码<input id="login-password" name="password" type="password" autocomplete="current-password" required placeholder="请输入登录密码"></label><div class="authoptions"><label><input type="checkbox" id="show-password"> 显示密码</label><span>离线体验账号，无线上找回密码</span></div><div id="login-error" class="autherror" role="alert" hidden></div><button type="submit" class="authsubmit">登录工作台 →</button></form><div class="authsamples"><h3>示例账号 <small>点击自动填入</small></h3><div class="sample-grid">${DEMO_ACCOUNTS.map((a) => `<button type="button" class="sample-account" data-account="${a.account}"><b>${a.name}</b><span>${a.label}</span><small>${a.account} / ${a.password}</small></button>`).join("")}</div></div><p class="sr-note">本版本仅供离线业务体验；账号与密码为示例凭据，权限控制仅在浏览器端，不能用作正式用户认证或存储真实个人信息。正式版需使用后端身份认证、会话和接口级权限控制。</p></div></div>`;
  }
  function openPersonalLogin() {
    if (ENTRY !== "public") {
      goPortal("public");
      return;
    }
    document.getElementById("mveri-personal-dialog")?.remove();
    const overlay = document.createElement("div");
    overlay.id = "mveri-personal-dialog";
    overlay.className = "mveri-personal-overlay career-login-modal";
    overlay.innerHTML = `<section class="mveri-personal-card career-login-card" role="dialog" aria-modal="true" aria-labelledby="mveri-personal-title">
 <button type="button" class="mveri-personal-close" aria-label="关闭个人登录">×</button>
 <div class="career-login-story"><div class="career-login-brand"><img src="../assets/mveri-logo.png" alt="研究院徽标"><span><strong>个人职业能力发展服务中心</strong><small>PERSONAL CAREER DEVELOPMENT</small></span></div>
 <span class="career-login-eyebrow">一个账号 · 持续成长</span><h2>让每一种职业阶段，<br>都有清晰的<span>能力发展路径</span></h2><p>从能力测评、能力画像到学习提升与评价认证，为不同职业阶段的个人提供适用的服务。</p>
 <div class="career-login-steps"><span>能力测评</span><i>→</i><span>学习发展</span><i>→</i><span>评价认证</span></div>
 <div class="career-login-group-title">服务对象</div><div class="career-login-groups">${CAREER_GROUPS.map((g) => `<span title="${esc(g.focus)}">${esc(g.name)}</span>`).join("")}</div><div class="career-login-story-note">职业身份不限制登录；可在个人中心随时调整发展规划。</div></div>
 <div class="career-login-formside"><div class="mveri-personal-heading"><span>PERSONAL SIGN IN</span><h2 id="mveri-personal-title">个人账号登录</h2><p>登录后查看自己的能力发展规划、测评、学习和认证记录。</p></div>
 <form id="mveri-personal-form"><label>个人登录账号<input id="mveri-personal-account" autocomplete="username" placeholder="请输入账号" required></label>
 <label>登录密码<input id="mveri-personal-password" type="password" autocomplete="current-password" placeholder="请输入密码" required></label>
 <label class="mveri-personal-check"><input id="mveri-personal-show" type="checkbox"> 显示密码</label>
 <p class="mveri-personal-error" id="mveri-personal-error" role="alert" hidden></p>
 <button class="mveri-personal-submit" type="submit">进入个人服务中心 →</button></form>
 <div class="mveri-personal-samples"><div class="mveri-demo-heading"><b>八类用户演示账号</b><span>点击直接填入</span></div><div class="mveri-personal-sample-list">${(window.MVERI_PERSONAL_DEMO_ACCOUNTS || []).map((u) => `<button type="button" data-personal-sample="${esc(u.account)}" aria-label="选择${esc(u.identity)}演示账号"><strong>${esc(u.identity)}</strong><small>${esc(u.account)}</small></button>`).join("")}</div><small>统一演示密码：<code>Demo@123456</code> · 仅用于本地功能体验</small></div>
 <p class="mveri-personal-register">首次使用？<a href="../auth/register.html">创建个人账号并设置职业身份 →</a></p><a class="career-login-full" href="../auth/login.html">使用完整登录页面</a></div>
 </section>`;
    document.body.appendChild(overlay);
    document.body.classList.add("mveri-modal-open");
    const close = () => {
      overlay.remove();
      document.body.classList.remove("mveri-modal-open");
      document.removeEventListener("keydown", onKey);
    };
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay || e.target.closest(".mveri-personal-close")) close();
      const b = e.target.closest("[data-personal-sample]");
      if (b) {
        overlay.querySelector("#mveri-personal-account").value = b.dataset.personalSample;
        overlay.querySelector("#mveri-personal-password").value =
          (window.MVERI_PERSONAL_DEMO_ACCOUNTS || []).find((u) => u.account === b.dataset.personalSample)?.password ||
          "123456";
        overlay.querySelector("#mveri-personal-error").hidden = true;
        overlay.querySelector("#mveri-personal-password").focus();
      }
    });
    overlay.querySelector("#mveri-personal-show").addEventListener("change", (e) => {
      overlay.querySelector("#mveri-personal-password").type = e.target.checked ? "text" : "password";
    });
    overlay.querySelector("#mveri-personal-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const account = overlay.querySelector("#mveri-personal-account").value.trim();
      const password = overlay.querySelector("#mveri-personal-password").value;
      const found = [...DEMO_ACCOUNTS, ...registeredUsers()].find(
        (u) => u.account === account && u.password === password && u.role === "personal" && u.status !== "停用",
      );
      if (!found) {
        const err = overlay.querySelector("#mveri-personal-error");
        err.textContent = "账号或密码错误，或该账号不属于个人服务。";
        err.hidden = false;
        return;
      }
      sessionStorage.setItem(AUTH_KEY, JSON.stringify({ account: found.account }));
      window.location.href = PORTAL_URL.personal;
    });
    overlay.querySelector("#mveri-personal-account").focus();
  }
  document.addEventListener("click", (e) => {
    const choice = e.target.closest("[data-career-group]");
    if (!choice || role !== "personal") return;
    const id = choice.dataset.careerGroup;
    const group = CAREER_GROUPS.find((x) => x.id === id);
    if (!group) return;
    document.querySelectorAll("[data-career-group]").forEach((el) => {
      const selected = el.dataset.careerGroup === id;
      el.classList.toggle("selected", selected);
      el.setAttribute("aria-pressed", String(selected));
    });
    const input = document.getElementById("careerGroup"),
      select = document.getElementById("careerGoal"),
      focus = document.getElementById("careerFocus");
    if (input) input.value = id;
    if (select) {
      select.innerHTML =
        '<option value="">请选择发展目标</option>' +
        group.goals.map((goal) => `<option value="${esc(goal)}">${esc(goal)}</option>`).join("");
    }
    if (focus) focus.textContent = group.focus;
  });
  document.addEventListener("submit", (e) => {
    if (e.target.id !== "careerForm" || role !== "personal") return;
    e.preventDefault();
    const form = new FormData(e.target),
      group = String(form.get("group") || ""),
      goal = String(form.get("goal") || "").trim(),
      notes = String(form.get("notes") || "").trim();
    const g = CAREER_GROUPS.find((v) => v.id === group);
    if (!g || !g.goals.includes(goal)) {
      toast("请选择当前身份及对应的发展目标");
      return;
    }
    try {
      const map = JSON.parse(localStorage.getItem(CAREER_KEY) || "{}");
      map[session?.account || person] = { group, goal, notes, updated: date() };
      localStorage.setItem(CAREER_KEY, JSON.stringify(map));
    } catch {
      toast("无法保存，请检查浏览器存储权限");
      return;
    }
    page = "dashboard";
    shell();
    toast("职业发展规划已保存，原有业务记录保持不变");
  });
  function toRole(v) {
    if (v !== "public" && (!session || session.role !== v)) {
      modal = true;
      shell();
      return;
    }
    role = v;
    page = role === "public" ? "home" : "dashboard";
    query = "";
    modal = false;
    shell();
  }
  function handle(action) {
    if (action === "login") {
      goPortal("login");
      return;
    }
    if (action === "personal-login" || action === "go-personal") {
      openPersonalLogin();
      return;
    }
    if (action === "institution-login" || action === "go-institution") {
      goPortal("institutionLogin");
      return;
    }
    if (action === "operations-login") {
      goPortal("operationsLogin");
      return;
    }
    if (action === "close-login") {
      goPortal("public");
      return;
    }
    if (action === "logout") {
      session = null;
      sessionStorage.removeItem(AUTH_KEY);
      goPortal("public");
      return;
    }
    if (action === "confirm-login") {
      toast("请使用账号密码登录");
      return;
    }
    if (role !== "public" && !session) {
      goPortal("public");
      return;
    }
    if (action === "reset") {
      if (session?.account !== "admin") {
        toast("仅平台管理员可重置数据");
        return;
      }
      if (!confirm("确定恢复所有初始体验数据？新增测评、报名、审批、证书会被清空。")) return;
      db = clone(window.MVERI_SEED);
      save();
      query = "";
      modal = false;
      shell();
      toast("已恢复完整初始业务数据");
      return;
    }
    if (action === "go-personal") {
      toRole("personal");
      return;
    }
    if (action === "go-institution") {
      toRole("institution");
      return;
    }
    if (action === "to-public") {
      goPortal("public");
      return;
    }
    if (action === "go-services") {
      page = "services";
      shell();
      return;
    }
    if (action.startsWith("to-")) {
      page = action.slice(3);
      shell();
      return;
    }
    if (action === "start-test") {
      testZone();
      return;
    }
    if (action === "submit-test") {
      let selected = questions.map((q, i) => document.querySelector(`input[name=q${i}]:checked`)?.value);
      if (selected.some((v) => v === undefined)) {
        toast("请先完成全部5道题");
        return;
      }
      let score = selected.filter((v, i) => v === questions[i][2]).length * 20;
      let fw = $("#test-framework").value;
      let id = "A" + Date.now().toString().slice(-9);
      db.assessments.push({ id, person, framework: fw, score, date: date(), status: "已完成", source: "interactive" });
      addAudit(name("people", person), "完成能力测评", id, `${fw}，得分${score}`);
      save();
      shell();
      toast(`测评完成，得分 ${score} 分，已写入关联业务记录`);
      return;
    }
    if (action.startsWith("finish-")) {
      let e = find("enrollments", action.slice(7));
      if (!e || e.person !== person) return;
      e.progress = 100;
      e.completed = true;
      addAudit(name("people", person), "完成培训学习", e.id, e.project);
      save();
      shell();
      toast("学习完成，可参加结业考试");
      return;
    }
    if (action.startsWith("enroll-")) {
      let pid = action.slice(7),
        p = find("projects", pid);
      if (!p || db.enrollments.some((e) => e.person === person && e.project === pid)) return;
      let existing = db.enrollments.filter((e) => e.project === pid).length;
      if (existing >= p.capacity) {
        toast("项目已满员");
        return;
      }
      let e = { id: "E" + Date.now().toString().slice(-9), person, project: pid, progress: 0, completed: false };
      db.enrollments.push(e);
      addAudit(name("people", person), "报名培训项目", e.id, pid);
      save();
      shell();
      toast("报名成功，已建立项目学习记录");
      return;
    }
    if (action.startsWith("exam-")) {
      let project = action.slice(5);
      let zone = $("#exam-zone");
      if (!zone) return;
      zone.innerHTML = `<section class="panel" style="margin-top:17px"><h2>结业测验 · ${esc(name("projects", project))}</h2>${[
        ["AI生成内容用于教学前应？", "核验准确性", "无需审核"],
        ["教学数据处理优先原则？", "最小必要", "尽可能收集"],
        ["能力评价最可靠的依据？", "过程证据与表现", "只看点击次数"],
      ]
        .map(
          (q, i) =>
            `<div style="margin:12px 0"><b>${q[0]}</b><label style="display:block;font-size:12px;margin:7px 0"><input type="radio" name="examq${i}" value="0"> ${q[1]}</label><label style="font-size:12px"><input type="radio" name="examq${i}" value="1"> ${q[2]}</label></div>`,
        )
        .join("")}${btn("交卷并记录结果", "submit-exam-" + project, "primary")}</section>`;
      return;
    }
    if (action.startsWith("submit-exam-")) {
      let p = action.slice(12),
        ans = [0, 1, 2].map((i) => document.querySelector(`input[name=examq${i}]:checked`)?.value);
      if (ans.some((x) => x === undefined)) {
        toast("请回答全部3题");
        return;
      }
      let n = ans.filter((x) => x === "0").length,
        score = Math.round((n / 3) * 100);
      let id = "X" + Date.now().toString().slice(-9);
      db.exams.push({ id, person, project: p, score, passed: n >= 2, date: date() });
      addAudit(name("people", person), "完成结业考试", id, `${p}；${score}分；${n >= 2 ? "通过" : "未通过"}`);
      save();
      shell();
      toast(`考试得分${score}，${n >= 2 ? "通过" : "未通过"}，成绩已保存`);
      return;
    }
    if (action === "apply") {
      let ev = eligible(person);
      if (!ev.ok) {
        toast("尚未满足认证要求");
        return;
      }
      let id = "C" + Date.now().toString().slice(-9);
      db.applications.push({
        id,
        person,
        project: ev.e.project,
        assessment: ev.a.id,
        exam: ev.x.id,
        status: "待审核",
        date: date(),
        reviewer: "",
        note: "",
      });
      addAudit(name("people", person), "提交认证申请", id, `依据 ${ev.e.id}、${ev.a.id}、${ev.x.id}`);
      save();
      shell();
      toast("已提交总部审核，认证证据已关联");
      return;
    }
    if (action.startsWith("go-review-")) {
      page = "reviews";
      shell();
      return;
    }
    if (action.startsWith("approve-") || action.startsWith("reject-")) {
      if (role !== "operations") return;
      let ok = action.startsWith("approve-"),
        id = action.slice(ok ? 8 : 7),
        app = find("applications", id);
      if (!app || app.status !== "待审核") return;
      let ev = eligible(app.person);
      if (ok && (!ev.ok || ev.e.project !== app.project)) {
        toast("证据未满足规则，不能核准");
        return;
      }
      app.status = ok ? "已发证" : "已驳回";
      app.reviewer = "研究院总部审核员";
      app.note = ok ? "培训、同标准测评和结业考试核验通过" : "人工审核驳回（体验操作）";
      if (ok) {
        let certId = "MVERI-" + date().slice(0, 4) + "-" + String(db.certificates.length + 1).padStart(4, "0");
        db.certificates.push({
          id: certId,
          application: app.id,
          person: app.person,
          project: app.project,
          issued: date(),
          status: "有效",
        });
        addAudit(
          "研究院总部审核员",
          "认证核准并发证",
          id,
          `关联证书 ${certId}；测评 ${app.assessment}；考试 ${app.exam}`,
        );
      } else addAudit("研究院总部审核员", "驳回认证申请", id, app.note);
      save();
      shell();
      toast(ok ? "审核通过，电子证书已核发并可查询" : "申请已驳回");
      return;
    }
    if (action.startsWith("lookup-")) {
      query = action.slice(7);
      page = "verify";
      shell();
      return;
    }
    if (action === "verify-search") {
      query = ($("#verify-id")?.value || "").trim();
      verifyResult();
      if (query) {
        verifySessionHistory.unshift({
          id: query,
          at: new Date().toLocaleString("zh-CN"),
          found: db.certificates.some((c) => String(c.id).toUpperCase() === query.toUpperCase()),
        });
        verifySessionHistory = verifySessionHistory.slice(0, 8);
        renderVerifyHistory();
      }
      return;
    }
  }
  document.addEventListener("submit", (e) => {
    if (e.target.id === "mveri-verify-form") {
      e.preventDefault();
      handle("verify-search");
    }
  });
  document.addEventListener("click", (e) => {
    const clear = e.target.closest("[data-verify-clear]");
    if (clear) {
      verifySessionHistory = [];
      renderVerifyHistory();
      return;
    }
    if (e.target.closest("[data-verify-print]")) {
      window.print();
      return;
    }
    const copy = e.target.closest("[data-verify-copy]");
    if (copy) {
      const id = copy.dataset.copyId || "";
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard
          .writeText(id)
          .then(() => toast("证书编号已复制"))
          .catch(() => toast("复制失败，请手动选择编号"));
      } else {
        toast("请手动选择并复制证书编号");
      }
      return;
    }
  });
  document.addEventListener("submit", (e) => {
    if (e.target.id === "news-search-form") {
      e.preventDefault();
      news("全部资讯", document.getElementById("news-search-input")?.value.trim() || "");
    }
  });
  document.addEventListener("click", (e) => {
    const open = e.target.closest("[data-news-open]");
    if (open) {
      newsDetail(open.dataset.newsOpen);
      window.scrollTo(0, 0);
      return;
    }
    if (e.target.closest("[data-news-back]")) {
      news();
      window.scrollTo(0, 0);
      return;
    }
    const cat = e.target.closest("[data-news-category]");
    if (cat) {
      news(cat.dataset.newsCategory);
      window.scrollTo(0, 0);
      return;
    }
  });
  document.addEventListener(
    "click",
    (e) => {
      const trigger = e.target.closest("[data-personal-modal]");
      if (!trigger) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      openPersonalLogin();
    },
    true,
  );
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-dimension]");
    if (!t || role !== "personal") return;
    const label = t.dataset.dimension;
    const aas = myAssess()
      .slice()
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    const a = aas[0],
      en = myEnroll(),
      ex = db.exams.filter((x) => x.person === person),
      cert = myCert();
    let box = document.getElementById("portfolio-evidence-dialog");
    if (!box) {
      box = document.createElement("dialog");
      box.id = "portfolio-evidence-dialog";
      box.className = "portfolio-dialog";
      document.body.append(box);
    }
    box.innerHTML =
      '<div class="portfolio-dialog-inner"><button type="button" class="portfolio-dialog-close" data-close-dimension aria-label="关闭">×</button><p class="portfolio-dialog-kicker">维度估计与证据追溯</p><h2>' +
      esc(label) +
      "</h2><p>本维度数值来自示例权重模型，对总体测评成绩、学习进度、结业考试和认证状态进行组合，<strong>没有独立的考评点测量结果</strong>，不得作为正式能力水平证明。</p><dl><dt>最近测评</dt><dd>" +
      (a ? esc(a.id + " · " + a.score + "分 · " + a.date) : "无") +
      "</dd><dt>培训进度</dt><dd>" +
      (en.length ? Math.round(en.reduce((n, x) => n + Number(x.progress || 0), 0) / en.length) + "%" : "无") +
      "</dd><dt>结业考试</dt><dd>" +
      (ex.length ? esc(ex[ex.length - 1].id + " · " + ex[ex.length - 1].score + "分") : "无") +
      "</dd><dt>认证证书</dt><dd>" +
      cert.length +
      '张</dd></dl><div class="portfolio-dialog-note">升级正式画像需要将题目、考评点、评分量规及维度权重一一关联，并保存每个维度的真实得分及版本。</div></div>';
    box.showModal();
  });
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-close-dimension]")) document.getElementById("portfolio-evidence-dialog")?.close();
  });
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-portfolio-tab]");
    if (t && role === "personal") {
      window.__mveriPortfolioTab = t.dataset.portfolioTab;
      portfolio();
      return;
    }
  });
  document.addEventListener("click", (e) => {
    const filter = e.target.closest("[data-service-filter]");
    if (!filter) return;
    const root = filter.closest(".mps30");
    if (!root) return;
    const type = filter.dataset.serviceFilter;
    let count = 0;
    root.querySelectorAll("[data-service-audience]").forEach((card) => {
      const show = type === "all" || card.dataset.serviceAudience.split(" ").includes(type);
      card.hidden = !show;
      if (show) count++;
    });
    root.querySelectorAll("[data-service-filter]").forEach((btn) => {
      const active = btn === filter;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    const info = root.querySelector(".mps30-filter-count");
    if (info) info.textContent = "显示 " + count + " 项服务";
  });
  document.addEventListener("click", (e) => {
    let sd = e.target.closest("[data-standard]");
    if (sd) {
      standardDetail(sd.dataset.standard);
      return;
    }
    if (e.target.closest("[data-standard-back]")) {
      standards();
      return;
    }
    let p = e.target.closest("[data-page]");
    if (p) {
      let requested = p.dataset.page;
      if (role !== "public" && !authorizedPage(requested)) {
        toast("当前账号无权访问该功能");
        return;
      }
      page = requested;
      shell();
      return;
    }
    let b = e.target.closest("[data-act]");
    if (b) handle(b.dataset.act);
  });
  document.addEventListener("click", (e) => {
    let b = e.target.closest("[data-account]");
    if (b) {
      let a = DEMO_ACCOUNTS.find((v) => v.account === b.dataset.account);
      if (a) {
        $("#login-account").value = a.account;
        $("#login-password").value = a.password;
        $("#login-error").hidden = true;
        $("#login-account").focus();
      }
    }
  });
  document.addEventListener("change", (e) => {
    if (e.target.id === "show-password") $("#login-password").type = e.target.checked ? "text" : "password";
  });
  document.addEventListener("submit", (e) => {
    if (e.target.id !== "login-form") return;
    e.preventDefault();
    let a = DEMO_ACCOUNTS.find(
      (v) => v.account === $("#login-account").value.trim() && v.password === $("#login-password").value,
    );
    if (!a) {
      let error = $("#login-error");
      error.hidden = false;
      error.textContent = "账号或密码不正确，请重新输入或选择下方示例账号。";
      return;
    }
    session = a;
    sessionStorage.setItem(AUTH_KEY, JSON.stringify({ account: a.account }));
    role = a.role;
    person = a.person || person;
    org = a.org || org;
    page = "dashboard";
    query = "";
    modal = false;
    goPortal(a.role);
  });
  shell();
})();
