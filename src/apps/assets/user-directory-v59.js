/* V59 shared offline user directory; demonstration only, not server authorization */
(function () {
  "use strict";
  const KEY = "mveri_user_directory_v59";
  const defaultUsers = [
    {
      id: "HU001",
      account: "admin",
      name: "总部平台管理员",
      group: "hq",
      unit: "HQ",
      role: "平台管理员",
      status: "启用",
      password: "123456",
    },
    {
      id: "HU002",
      account: "reviewer",
      name: "认证审核员",
      group: "hq",
      unit: "HQ",
      role: "认证审核员",
      status: "启用",
      password: "123456",
    },
    {
      id: "RU001",
      account: "region01",
      name: "华北区域负责人",
      group: "region",
      unit: "R001",
      role: "区域负责人",
      status: "启用",
      password: "123456",
    },
    {
      id: "RU002",
      account: "region02",
      name: "华东区域负责人",
      group: "region",
      unit: "R002",
      role: "区域负责人",
      status: "启用",
      password: "123456",
    },
  ];
  const clone = (o) => JSON.parse(JSON.stringify(o));
  function get() {
    let data;
    try {
      data = JSON.parse(localStorage.getItem(KEY));
    } catch (_) {}
    if (!data || !Array.isArray(data.users)) {
      data = { users: clone(defaultUsers) };
      localStorage.setItem(KEY, JSON.stringify(data));
    }
    return data;
  }
  function all() {
    const regs = window.MVERI_REGISTERED?.get() || [];
    const users = get().users.map((u) => ({ ...u, source: "directory" }));
    const lic = window.MVERI_SCHOOL_LICENSE;
    return [
      ...users,
      ...(lic
        ? lic.get().users.map((u) => ({ ...u, group: "school", unit: u.school, role: u.type, source: "license" }))
        : []),
      ...regs.map((u) => ({
        id: u.account,
        account: u.account,
        name: u.name,
        group: "personal",
        unit: u.org || "independent",
        role: "个人注册用户",
        status: u.status || "启用",
        createdAt: u.createdAt || "",
        sourceLabel: u.sourceLabel || "公共服务平台注册",
        person: u.person,
        source: "registered",
      })),
    ];
  }
  function validate(u, id) {
    if (!/^[A-Za-z][A-Za-z0-9_.-]{3,31}$/.test(String(u.account || "")))
      throw Error("账号须为4～32位英文开头的字母、数字、下划线等字符");
    if (!String(u.name || "").trim()) throw Error("姓名不能为空");
    if (!["hq", "region"].includes(u.group)) throw Error("该组织类型请通过院校席位管理开通");
    if (u.group === "hq" && u.unit !== "HQ") throw Error("研究院用户的所属组织必须为总部");
    if (u.group === "region" && !["R001", "R002", "R003"].includes(u.unit)) throw Error("请选择有效的区域服务中心");
    if (!["启用", "停用"].includes(u.status)) throw Error("账号状态无效");
    if (
      all().some(
        (x) => x.account.toLowerCase() === u.account.toLowerCase() && !(x.source === "directory" && x.id === id),
      )
    )
      throw Error("账号已被其他组织使用");
    if (u.group === "hq" && !["平台管理员", "标准管理员", "认证审核员", "运营人员"].includes(u.role))
      throw Error("无效总部岗位");
    if (u.group === "region" && !["区域负责人", "项目经理", "区域业务人员"].includes(u.role))
      throw Error("无效区域岗位");
  }
  function save(input, id) {
    const d = get(),
      old = id ? d.users.find((x) => x.id === id) : null;
    if (id && !old) throw Error("账号不存在");
    const v = {
      ...old,
      ...input,
      name: String(input.name || "").trim(),
      account: String(input.account || "").trim(),
      status: input.status || "启用",
    };
    validate(v, id);
    if (!old) {
      if (String(input.password || "").length < 6) throw Error("初始密码至少6位");
      v.id = (v.group === "hq" ? "HU" : "RU") + String(Date.now()).slice(-9);
      v.password = input.password;
      d.users.push(v);
    } else {
      if (input.password) {
        if (String(input.password).length < 6) throw Error("密码至少6位");
        v.password = input.password;
      } else v.password = old.password;
      Object.assign(old, v);
    }
    localStorage.setItem(KEY, JSON.stringify(d));
    return v.id;
  }
  function toggle(id) {
    const u = get().users.find((x) => x.id === id);
    if (!u) throw Error("账号不存在");
    if (u.account === "admin" && u.status === "启用") throw Error("不能停用默认平台管理员");
    return save({ ...u, status: u.status === "启用" ? "停用" : "启用", password: "" }, id);
  }
  window.MVERI_USERS = { KEY, get, all, save, toggle };
})();
