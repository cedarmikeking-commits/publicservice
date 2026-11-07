import { esc, heading, table, field, select, badge, yuan } from "../core/format.js";
import { activeSeats, validateSeat } from "../core/store.js";
export const specs = {
  partners: {
    title: "区域合作管理",
    key: "partners",
    columns: [
      ["name", "区域中心名称"],
      ["area", "覆盖区域"],
      ["owner", "负责人"],
      ["quota", "年度任务指标"],
      ["status", "状态"],
    ],
    edit: true,
  },
  colleges: {
    title: "院校客户管理",
    key: "colleges",
    columns: [
      ["name", "院校名称"],
      ["region", "区域编号"],
      ["contact", "联系人"],
      ["phone", "联系电话"],
      ["status", "合作状态"],
    ],
    edit: true,
  },
  programs: {
    title: "培训项目管理",
    key: "programs",
    columns: [
      ["name", "培训项目"],
      ["college", "院校编号"],
      ["planned", "计划人数"],
      ["enrolled", "报名人数"],
      ["completed", "结业人数"],
      ["status", "项目状态"],
    ],
    edit: true,
  },
  targets: {
    title: "年度任务管理",
    key: "targets",
    columns: [
      ["region", "区域"],
      ["year", "年度"],
      ["students", "培训人数指标"],
      ["colleges", "院校指标"],
      ["certificates", "认证指标"],
    ],
    edit: true,
  },
  certificates: {
    title: "认证与证书",
    key: "certificates",
    columns: [
      ["program", "项目"],
      ["count", "申请人数"],
      ["pass", "合格人数"],
      ["status", "认证状态"],
      ["date", "申请日期"],
    ],
    edit: true,
  },
  agreements: {
    title: "合作协议与授权",
    key: "agreements",
    columns: [
      ["name", "协议名称"],
      ["region", "所属区域"],
      ["start", "生效日期"],
      ["end", "失效日期"],
      ["status", "协议状态"],
    ],
    edit: true,
  },
  delivery: {
    title: "培训交付中心",
    key: "delivery",
    columns: [
      ["name", "交付任务"],
      ["program", "培训项目"],
      ["owner", "责任人"],
      ["start", "开始日期"],
      ["status", "交付状态"],
    ],
    edit: true,
  },
  settlements: {
    title: "认证结算中心",
    key: "settlements",
    columns: [
      ["application", "认证申请"],
      ["region", "区域"],
      ["amount", "应收金额"],
      ["paid", "已收金额"],
      ["status", "结算状态"],
    ],
    edit: true,
  },
  payments: {
    title: "费用与绩效",
    key: "payments",
    columns: [
      ["region", "区域"],
      ["amount", "金额"],
      ["date", "日期"],
      ["status", "状态"],
    ],
    edit: true,
  },
  plans: {
    title: "命题计划",
    key: "plans",
    columns: [
      ["name", "计划名称"],
      ["standard", "标准体系"],
      ["count", "计划题量"],
      ["owner", "负责人"],
      ["status", "状态"],
    ],
    edit: true,
  },
  blueprints: {
    title: "测评蓝图",
    key: "blueprints",
    columns: [
      ["name", "蓝图名称"],
      ["standard", "对应标准"],
      ["count", "题量"],
      ["duration", "时长（分钟）"],
      ["status", "状态"],
    ],
    edit: true,
  },
  reports: {
    title: "能力报告管理",
    key: "reports",
    columns: [
      ["name", "报告名称"],
      ["standard", "能力标准"],
      ["person", "关联用户"],
      ["date", "生成日期"],
      ["status", "状态"],
    ],
    edit: true,
  },
};
export function genericPage(store, view, notify, actor) {
  const spec = specs[view];
  if (!spec) return "";
  const rows = store.get(spec.key);
  const cols = spec.columns;
  const action = `<button class="primary" data-action="new-record" data-collection="${spec.key}">+ 新增${spec.title.replace("管理", "")}</button>`;
  return `${heading(spec.title, `业务数据与现有经营数据源关联 · ${rows.length} 条记录`, action)}<section class="panel"><div class="toolbar"><input data-search placeholder="搜索当前列表的任意字段"><span class="hint">可新增、修改和查看记录</span></div><div class="table-slot">${renderTable(rows)}</div></section>`;
  function renderTable(data) {
    return table(
      [...cols.map((c) => c[1]), "操作"],
      data.map((row) => [
        ...cols.map(([k]) => badgeIf(k, row[k])),
        `<button class="link" data-action="edit-record" data-collection="${spec.key}" data-id="${esc(row.id)}">编辑</button>`,
      ]),
    );
  }
  function badgeIf(key, value) {
    return key === "status" ? badge(value) : esc(value);
  }
}
export function recordDialog(store, collection, id, actor, update) {
  let spec = specs[collection],
    old = id ? store.get(collection).find((x) => x.id === id) : null;
  if (!spec) return;
  let inputs = spec.columns
    .map(([k, l]) =>
      field(
        k,
        l,
        old?.[k] ?? "",
        [
          "quota",
          "planned",
          "enrolled",
          "completed",
          "count",
          "pass",
          "students",
          "colleges",
          "certificates",
          "year",
          "amount",
          "paid",
          "duration",
        ].includes(k)
          ? "number"
          : k === "date" || k === "start" || k === "end"
            ? "date"
            : "text",
      ),
    )
    .join("");
  openDialog(
    `${old ? "编辑" : "新增"} · ${spec.title}`,
    `<form id="entityForm" class="form-grid">${inputs}<div class="form-actions"><button type="button" data-close>取消</button><button class="primary" type="submit">保存</button></div></form>`,
    (el) =>
      (el.querySelector("form").onsubmit = (e) => {
        e.preventDefault();
        let v = Object.fromEntries(new FormData(e.target));
        for (let k of Object.keys(v))
          if (
            [
              "quota",
              "planned",
              "enrolled",
              "completed",
              "count",
              "pass",
              "students",
              "colleges",
              "certificates",
              "year",
              "amount",
              "paid",
              "duration",
            ].includes(k)
          )
            v[k] = Number(v[k]);
        if (old) store.update(collection, id, v, actor);
        else store.create(collection, v, actor);
        closeDialog();
        update();
      }),
  );
}
export function openDialog(title, html, onReady) {
  const d = document.getElementById("dialog");
  d.innerHTML = `<div class="dialog-content"><div class="dialog-title"><h3>${esc(title)}</h3><button data-close aria-label="关闭">×</button></div>${html}</div>`;
  d.showModal();
  d.querySelectorAll("[data-close]").forEach((b) => (b.onclick = closeDialog));
  onReady?.(d);
}
export function closeDialog() {
  document.getElementById("dialog")?.close();
}
export function dashboard(store, role) {
  let regions = store.get("partners"),
    colleges = store.get("colleges"),
    projects = store.get("programs"),
    certs = store.get("certificates");
  const kpis = [
    ["合作区域", regions.length, "已建立的区域服务中心"],
    ["合作院校", colleges.length, "按授权区域管理"],
    ["培训计划", projects.reduce((n, x) => n + Number(x.planned || 0), 0).toLocaleString(), "所有培训项目计划人数"],
    ["认证申请", certs.length, "待审核 " + certs.filter((x) => /待/.test(x.status)).length],
  ];
  return `${heading("经营驾驶舱", "全国服务业务全景 · 合作授权 → 年度任务 → 院校拓展 → 培训实施 → 认证签发 → 经营考核")}<div class="kpis">${kpis.map(([l, v, s]) => `<div class="kpi"><span>${l}</span><strong>${v}</strong><small>${s}</small></div>`).join("")}</div><section class="panel"><h3>六阶段业务闭环</h3><div class="stages">${["区域合作", "年度任务", "院校开发", "培训实施", "认证发证", "经营考核"].map((x, i) => `<div><strong>0${i + 1}</strong><span>${x}</span></div>`).join("")}</div></section><div class="two"><section class="panel"><h3>区域任务达成</h3>${regions
    .map((r) => {
      const target = store.get("targets").find((x) => x.region === r.id);
      let completed = projects.filter((p) => p.region === r.id).reduce((s, p) => s + Number(p.completed || 0), 0),
        goal = Number(target?.students || r.quota || 0),
        pct = goal ? Math.min(100, (completed / goal) * 100) : 0;
      return `<div class="progress-item"><div><span>${esc(r.name)}</span><b>${completed}/${goal}人</b></div><progress max="100" value="${pct}"></progress></div>`;
    })
    .join("")}</section><section class="panel"><h3>近期业务待办</h3>${
    certs
      .filter((x) => /待/.test(x.status))
      .map((x) => `<div class="todo">认证申请 ${esc(x.id)} · ${esc(x.status)} · ${esc(x.count)} 人</div>`)
      .join("") || '<p class="hint">当前没有待审核申请</p>'
  }<h3 class="subheading">最近操作</h3>${store
    .get("logs")
    .slice(0, 4)
    .map((x) => `<div class="todo">${esc(x.time)} · ${esc(x.action)}</div>`)
    .join("")}</section></div>`;
}
export function journey(store) {
  let p = store.get("programs");
  return `${heading("业务贯通中心", "以项目为主线，检查院校、区域、培训、认证的关联数据")}<section class="panel">${table(
    ["项目编号", "项目名称", "所属院校", "所属区域", "结业人数", "认证申请"],
    p.map((x) => [
      esc(x.id),
      esc(x.name),
      esc(store.get("colleges").find((y) => y.id === x.college)?.name || x.college),
      esc(store.get("partners").find((y) => y.id === x.region)?.name || x.region),
      esc(x.completed),
      esc(store.get("certificates").filter((c) => c.program === x.id).length),
    ]),
  )}</section>`;
}
export function auditPage(store) {
  return `${heading("操作日志", "总部和业务人员的记录变更与操作审计")}<section class="panel">${table(
    ["时间", "身份", "操作内容"],
    store.get("logs").map((x) => [esc(x.time), esc(x.role), esc(x.action)]),
  )}</section>`;
}
export function schoolPage(store) {
  let schools = store.get("schools");
  return `${heading("院校管理", "院校入驻、账号开通及授权席位控制", '<button class="primary" data-action="new-school">+ 新增院校</button>')}<div class="kpis">${[
    ["已入驻院校", schools.length],
    ["授权席位", schools.reduce((s, x) => s + Number(x.seats || 0), 0)],
    ["已使用席位", schools.reduce((s, x) => s + activeSeats(store, x.id), 0)],
  ]
    .map(([a, b]) => `<div class="kpi"><span>${a}</span><strong>${b}</strong></div>`)
    .join("")}</div><section class="panel">${table(
    ["院校名称", "所属区域", "席位总数", "已使用", "剩余", "状态", "操作"],
    schools.map((x) => [
      esc(x.name),
      esc(x.region),
      x.seats,
      activeSeats(store, x.id),
      Number(x.seats || 0) - activeSeats(store, x.id),
      badge(x.status),
      `<button class="link" data-action="edit-school" data-id="${esc(x.id)}">编辑</button>`,
    ]),
  )}</section>`;
}
export function schoolDialog(store, id, actor, update) {
  let old = store.get("schools").find((x) => x.id === id);
  openDialog(
    old ? "编辑院校" : "新增院校",
    `<form class="form-grid">${field("name", "院校全称", old?.name)}${select(
      "region",
      "所属区域",
      store.get("partners").map((x) => [x.id, x.name]),
      old?.region,
    )}${field("seats", "授权席位数", old?.seats ?? 20, "number")}${select(
      "status",
      "院校状态",
      [
        ["启用", "启用"],
        ["停用", "停用"],
      ],
      old?.status || "启用",
    )}<div class="form-actions"><button type="button" data-close>取消</button><button class="primary">保存</button></div></form>`,
    (el) =>
      (el.querySelector("form").onsubmit = (e) => {
        e.preventDefault();
        let data = Object.fromEntries(new FormData(e.target)),
          seats = Number(data.seats);
        if (!Number.isInteger(seats) || seats < 0) {
          alert("席位数必须为非负整数");
          return;
        }
        if (old && seats < activeSeats(store, id)) {
          alert("授权席位不可低于已启用账号数");
          return;
        }
        data.seats = seats;
        if (old) store.update("schools", id, data, actor);
        else store.create("schools", data, actor);
        closeDialog();
        update();
      }),
  );
}
export function usersPage(store) {
  let users = store.get("users");
  return `${heading("统一用户管理", "研究院人员 · 院校人员与教师 · 区域中心人员 · 个人注册用户", '<button class="primary" data-action="new-user">+ 开通账号</button>')}<div class="kpis">${["hq", "school", "region", "registered"].map((x, i) => `<div class="kpi"><span>${["研究院用户", "院校用户", "区域人员", "注册用户"][i]}</span><strong>${users.filter((u) => u.type === x).length}</strong></div>`).join("")}</div><section class="panel"><div class="toolbar"><input data-search placeholder="搜索姓名、账号、组织"><select data-user-filter><option value="">全部类别</option><option value="hq">研究院用户</option><option value="school">院校用户</option><option value="region">区域用户</option><option value="registered">注册用户</option></select></div><div class="table-slot">${usersTable(users)}</div></section>`;
}
export function usersTable(users) {
  return table(
    ["姓名", "账号", "类别", "所属组织", "角色", "状态", "操作"],
    users.map((u) => [
      esc(u.name),
      esc(u.account),
      esc({ hq: "研究院", school: "院校", region: "区域", registered: "注册用户" }[u.type]),
      esc(u.schoolId || u.region || "总部"),
      esc(u.role || "—"),
      badge(u.status || "启用"),
      `<button class="link" data-action="edit-user" data-id="${esc(u.id)}">编辑</button>`,
    ]),
  );
}
export function userDialog(store, id, actor, update) {
  let old = store.get("users").find((x) => x.id === id);
  openDialog(
    old ? "编辑用户" : "开通用户",
    `<form class="form-grid">${field("name", "真实姓名", old?.name)}${field("account", "登录账号", old?.account)}${select(
      "type",
      "用户类别",
      [
        ["hq", "研究院人员"],
        ["school", "院校人员/教师"],
        ["region", "区域人员"],
        ["registered", "个人注册用户"],
      ],
      old?.type || "school",
    )}${select("schoolId", "所属院校", [["", "不适用"], ...store.get("schools").map((x) => [x.id, x.name])], old?.schoolId || "")}${select("region", "所属区域", [["", "不适用"], ...store.get("partners").map((x) => [x.id, x.name])], old?.region || "")}${field("role", "岗位角色", old?.role || "教师")}${field("password", "账号密码（本地开发模式）", old?.password || "123456")}${select(
      "status",
      "账号状态",
      [
        ["启用", "启用"],
        ["停用", "停用"],
      ],
      old?.status || "启用",
    )}<div class="form-actions"><button type="button" data-close>取消</button><button class="primary">保存</button></div></form>`,
    (el) =>
      (el.querySelector("form").onsubmit = (e) => {
        e.preventDefault();
        let data = Object.fromEntries(new FormData(e.target));
        if (store.get("users").some((u) => u.account === data.account && u.id !== id)) {
          alert("登录账号已存在");
          return;
        }
        if (data.type === "school" && data.status === "启用") {
          try {
            validateSeat(store, data.schoolId, id);
          } catch (err) {
            alert(err.message);
            return;
          }
        }
        if (data.type === "region" && !data.region) {
          alert("区域人员必须指定所属区域");
          return;
        }
        if (old) store.update("users", id, data, actor);
        else store.create("users", data, actor);
        closeDialog();
        update();
      }),
  );
}
