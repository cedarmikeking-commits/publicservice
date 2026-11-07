(() => {
  "use strict";
  const role = document.body.dataset.loginRole,
    AUTH = "mveri_offline_session_v3";
  const $ = (id) => document.getElementById(id);
  const accounts = [
    { account: "bj_school", label: "北京信息职业技术学院", name: "北京院校管理员", role: "school", org: "SCH-001" },
    { account: "hb_school", label: "河北工业职业技术大学", name: "河北院校管理员", role: "school", org: "SCH-002" },
    { account: "sx_school", label: "山西职业技术学院", name: "山西院校管理员", role: "school", org: "SCH-003" },
    { account: "region01", label: "华北区域服务中心", name: "华北区域负责人", role: "region", region: "R001" },
    { account: "region02", label: "华东区域服务中心", name: "华东区域负责人", role: "region", region: "R002" },
    { account: "admin", label: "平台管理员", name: "总部平台管理员", role: "operations" },
    { account: "reviewer", label: "认证审核", name: "认证审核员", role: "operations" },
  ];
  if (window.MVERI_USERS) {
    const extra = window.MVERI_USERS.get().users.filter(
      (u) => u.group === (role === "operations" ? "hq" : role) && u.status === "启用",
    );
    accounts.splice(
      0,
      accounts.length,
      ...(role === "school"
        ? accounts
        : extra.map((u) => ({
            account: u.account,
            label:
              u.unit === "HQ"
                ? "研究院总部"
                : { R001: "华北区域服务中心", R002: "华东区域服务中心", R003: "华中区域服务中心" }[u.unit] || u.unit,
            name: u.name,
            role: role,
            region: u.group === "region" ? u.unit : undefined,
            password: u.password,
          }))),
    );
  }
  if (role === "school" && window.MVERI_SCHOOL_LICENSE) {
    const d = window.MVERI_SCHOOL_LICENSE.get();
    const schoolSel = $("school");
    schoolSel.innerHTML =
      '<option value="">请选择所属院校</option>' +
      d.schools
        .filter((s) => s.status === "启用")
        .map((s) => `<option value="${s.id}">${s.name.replace(/</g, "&lt;")}</option>`)
        .join("");
    accounts.splice(
      0,
      accounts.length,
      ...d.users
        .filter((u) => u.status === "启用")
        .map((u) => ({
          account: u.account,
          label: d.schools.find((s) => s.id === u.school)?.name || "",
          name: u.name,
          role: "school",
          org: u.school,
          password: u.password,
        }))
        .filter((u) => d.schools.some((s) => s.id === u.org && s.status === "启用")),
    );
  }
  const localPassword = (a) => {
    try {
      return JSON.parse(localStorage.getItem("mveriDemoPasswords") || "{}")[a] || "";
    } catch {
      return "";
    }
  };
  const selector = role === "school" ? $("school") : role === "region" ? $("region") : null;
  const mine = accounts.filter((x) => x.role === role);
  const error = $("error"),
    sampleWrap = $("samples");
  function showError(message) {
    error.textContent = message;
    error.hidden = false;
  }
  function renderSamples() {
    const data =
      selector && selector.value ? mine.filter((x) => x.org === selector.value || x.region === selector.value) : mine;
    sampleWrap.innerHTML =
      data
        .map(
          (x) =>
            `<button type="button" class="v39-sample" data-account="${x.account}"><b>${x.name}</b><small>${x.account}</small></button>`,
        )
        .join("") || '<div class="v39-sample-empty">此组织暂无示例账号</div>';
  }
  renderSamples();
  selector?.addEventListener("change", () => {
    error.hidden = true;
    renderSamples();
  });
  sampleWrap.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-account]");
    if (!btn) return;
    const a = mine.find((x) => x.account === btn.dataset.account);
    if (!a) return;
    if (selector) selector.value = a.org || a.region;
    $("account").value = a.account;
    $("password").value = localPassword(a.account) ? "" : a.password || "123456";
    error.hidden = true;
    $("password").focus();
    renderSamples();
  });
  $("toggle-password").addEventListener("click", (e) => {
    const i = $("password");
    const showing = i.type === "password";
    i.type = showing ? "text" : "password";
    e.currentTarget.textContent = showing ? "隐藏" : "显示";
    e.currentTarget.setAttribute("aria-label", showing ? "隐藏密码" : "显示密码");
  });
  $("login").addEventListener("submit", (e) => {
    e.preventDefault();
    error.hidden = true;
    const account = $("account").value.trim(),
      password = $("password").value,
      found = accounts.find((x) => x.account === account && x.role === role);
    if (selector && !selector.value) {
      showError(role === "school" ? "请选择所属院校。" : "请选择所属区域。");
      selector.focus();
      return;
    }
    if (!found || password !== (localPassword(found?.account) || found?.password || "123456")) {
      showError("账号或密码错误，或当前入口与账号身份不匹配。");
      return;
    }
    if (selector && (found.org || found.region) !== selector.value) {
      showError(role === "school" ? "所选院校与账号所属院校不一致。" : "所选区域与账号授权区域不一致。");
      return;
    }
    sessionStorage.setItem(
      AUTH,
      JSON.stringify({
        account: found.account,
        org: found.org || null,
        region: found.region || null,
        role: found.role,
      }),
    );
    location.href =
      role === "region" || (role === "operations" && found.role === "operations" && found.name !== "认证审核员")
        ? "../area/dashboard.html"
        : "../" + (role === "operations" ? "operations" : "institution") + "/index.html";
  });
})();
