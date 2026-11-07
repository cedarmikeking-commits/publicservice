export const groups = [
  {
    id: "workspace",
    label: "工作空间",
    icon: "▦",
    items: [
      ["dashboard", "经营驾驶舱"],
      ["journey", "业务贯通中心"],
    ],
  },
  {
    id: "assessment",
    label: "能力评价体系",
    icon: "◇",
    items: [
      ["standards", "指标体系"],
      ["master", "考评点主数据"],
      ["points", "考评点核验"],
      ["questions", "试题维护"],
      ["plans", "命题计划"],
      ["blueprint", "测评蓝图"],
      ["agents", "专项智能体"],
      ["reports", "能力报告管理"],
    ],
  },
  {
    id: "cooperation",
    label: "合作经营",
    icon: "♧",
    items: [
      ["partners", "区域合作管理"],
      ["agreements", "合作协议与授权"],
      ["targets", "年度任务管理"],
    ],
  },
  {
    id: "training",
    label: "培训业务",
    icon: "▣",
    items: [
      ["colleges", "院校客户管理"],
      ["programs", "培训项目管理"],
      ["delivery", "培训交付中心"],
    ],
  },
  {
    id: "cert",
    label: "认证与结算",
    icon: "◇",
    items: [
      ["certificates", "认证与证书"],
      ["settlement", "认证结算中心"],
      ["finance", "费用与绩效"],
    ],
  },
  {
    id: "org",
    label: "组织与授权",
    icon: "▤",
    items: [
      ["school-admin", "院校管理"],
      ["users", "用户管理"],
    ],
  },
  {
    id: "system",
    label: "系统管理",
    icon: "⚙",
    items: [
      ["audit", "操作日志"],
      ["settings", "平台配置"],
    ],
  },
];
export const registry = Object.fromEntries(
  groups.flatMap((g) => g.items.map(([id, label]) => [id, { id, label, group: g.id }])),
);
export const roleRights = {
  hq: groups.flatMap((g) => g.items.map((x) => x[0])),
  region: [
    "dashboard",
    "journey",
    "partners",
    "targets",
    "colleges",
    "programs",
    "delivery",
    "certificates",
    "finance",
    "audit",
  ],
  school: ["dashboard", "programs", "delivery", "certificates"],
  reviewer: [
    "dashboard",
    "standards",
    "master",
    "points",
    "questions",
    "blueprint",
    "reports",
    "certificates",
    "audit",
  ],
};
export function can(role, id) {
  return (roleRights[role] || []).includes(id);
}
