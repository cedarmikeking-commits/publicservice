(() => {
  "use strict";
  const AUTH = "mveri_offline_session_v3",
    USERS = "mveri_registered_users_v13",
    DATA = "mveri_demo_20261031_v1";
  const demo = [
    ["li", "李文博", "个人 · 教师", "personal"],
    ["zhang", "张晓宁", "个人 · 教师", "personal"],
    ["bj_school", "陈主任", "机构 · 北京院校", "institution"],
    ["hb_school", "李主任", "机构 · 河北院校", "institution"],
    ["bj_region", "周明", "机构 · 北京区域", "institution"],
    ["hb_region", "赵宁", "机构 · 河北区域", "institution"],
    ["admin", "平台管理员", "总部 · 管理员", "operations"],
    ["reviewer", "认证审核员", "总部 · 审核员", "operations"],
  ].map(([account, name, label, role]) => ({ account, name, label, role, password: "123456" }));
  const $ = (s) => document.querySelector(s);
  const read = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
      return fallback;
    }
  };
  const error = (msg) => {
    const e = $("#error");
    e.textContent = msg;
    e.hidden = false;
  };
  const destination = (role) => "../" + role + "/index.html";
  const login = (account) => {
    sessionStorage.setItem(AUTH, JSON.stringify({ account }));
    location.href = destination(account.role);
  };
  if ($("#samples")) {
    $("#samples").innerHTML = demo
      .map(
        (x) =>
          '<button type="button" class="sample" data-account="' +
          x.account +
          '"><strong>' +
          x.name +
          "</strong><small>" +
          x.label +
          " · " +
          x.account +
          "</small></button>",
      )
      .join("");
    $("#samples").addEventListener("click", (e) => {
      const b = e.target.closest("[data-account]");
      if (!b) return;
      $("#account").value = b.dataset.account;
      $("#password").value = "123456";
      $("#error").hidden = true;
      $("#password").focus();
    });
    $("#show").addEventListener("change", (e) => ($("#password").type = e.target.checked ? "text" : "password"));
    $("#login").addEventListener("submit", (e) => {
      e.preventDefault();
      let account = $("#account").value.trim(),
        pass = $("#password").value;
      let found =
        demo.find((x) => x.account === account && x.password === pass) ||
        read(USERS, []).find((x) => x.account === account && x.password === pass);
      if (!found || found.status === "停用") {
        error("账号或密码错误，或账号已被停用。");
        return;
      }
      login(found);
    });
  }
  if ($("#register")) {
    const groups = {
      jobseeker: ["提升就业能力", "掌握数字化职业技能", "增强职业适应能力"],
      university: ["提升职业适应能力", "加强职场数智能力", "做好实习与就业准备"],
      vocational: ["提升专业及通用能力", "强化数智能力", "积累学习与认证成果"],
      employee: ["提升岗位胜任能力", "提高数字化工作效率", "拓展职业发展机会"],
      transition: ["分析转岗能力差距", "完成新岗位训练", "形成能力转换证明"],
      flexible: ["提升可迁移能力", "拓展服务能力", "建立可信的能力档案"],
      frontline: ["提升工作效率", "掌握实用数字工具", "增强岗位竞争力"],
      teacher: ["提升教师数智素养", "改进数字化教学能力", "支持教学与专业发展"],
    };
    $("#careerGroup").addEventListener("change", () => {
      const group = $("#careerGroup").value,
        goal = $("#careerGoal");
      goal.innerHTML =
        '<option value="">请选择主要发展目标</option>' +
        (groups[group] || []).map((x) => '<option value="' + x + '">' + x + "</option>").join("");
      goal.disabled = !groups[group];
      $("#orgWrap").hidden = !["vocational", "teacher", "university"].includes(group);
      if ($("#orgWrap").hidden) $("#org").value = "";
    });
    const fromQuery = new URLSearchParams(location.search).get("group");
    if (fromQuery && groups[fromQuery]) {
      $("#careerGroup").value = fromQuery;
      $("#careerGroup").dispatchEvent(new Event("change"));
    }
    $("#register").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#name").value.trim(),
        account = $("#account").value.trim(),
        password = $("#password").value,
        confirm = $("#confirm").value,
        group = $("#careerGroup").value,
        goal = $("#careerGoal").value,
        org = $("#org").value;
      if (name.length < 2) {
        error("请填写至少2个字符的姓名");
        return;
      }
      if (!/^[A-Za-z][A-Za-z0-9_]{3,23}$/.test(account)) {
        error("账号应为4-24位，字母开头，可含数字和下划线");
        return;
      }
      if ([...demo, ...read(USERS, [])].some((x) => x.account.toLowerCase() === account.toLowerCase())) {
        error("该账号已存在，请更换");
        return;
      }
      if (!groups[group] || !groups[group].includes(goal)) {
        error("请选择职业身份及适用的发展目标");
        return;
      }
      if (password.length < 8) {
        error("密码至少8位");
        return;
      }
      if (password !== confirm) {
        error("两次输入的密码不一致");
        return;
      }
      if (!$("#agree").checked) {
        error("请确认体验数据说明");
        return;
      }
      const users = read(USERS, []),
        person = "PR" + Date.now().toString(36).toUpperCase();
      const u = {
        account,
        password,
        name,
        role: "personal",
        person,
        org,
        label: "个人注册用户",
        status: "启用",
        createdAt: new Date().toISOString(),
        sourceLabel: "公共服务平台注册",
        careerGroup: group,
      };
      try {
        users.push(u);
        localStorage.setItem(USERS, JSON.stringify(users));
        const career = read("mveri_personal_career_v7243", {});
        career[account] = { group, goal, notes: "", updated: new Date().toISOString().slice(0, 10) };
        localStorage.setItem("mveri_personal_career_v7243", JSON.stringify(career));
        let db = read(DATA, null);
        if (db && Array.isArray(db.people)) {
          db.people.push({ id: person, name, org: org || "", title: "个人注册用户", account });
          localStorage.setItem(DATA, JSON.stringify(db));
        }
      } catch (err) {
        error("浏览器无法保存账号，请检查存储权限或剩余空间。");
        return;
      }
      login(u);
    });
  }
})();
