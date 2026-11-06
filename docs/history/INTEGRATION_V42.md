# 现代职业教育公共服务平台 V42 · 总部及区域源码整合

## 入口
- 官网：`site/index.html`（原首页和个人弹窗登录不变）
- 右上角登录：`auth/access.html`
- 院校：`auth/school.html` → 原平台 `institution/index.html`
- 区域：`auth/region.html` → 新移植的 `area/dashboard.html`
- 总部管理员：`auth/operations.html` → 新移植的 `area/dashboard.html`
- 认证审核员 reviewer：继续进入原平台 `operations/index.html`，避免错误授予附件总部管理员的全部权限

## 新移植源码及业务
`area/` 文件夹保留附件的 `app.js`、`data.js`、`styles.css`、各独立模块 HTML 和业务功能，含经营驾驶舱、合作与授权、年度任务、院校客户、培训项目、交付、认证、结算、日志和业务贯通中心。

## 体验账号
- 总部 `admin / 123456`
- 华北 `region01 / 123456`（选择华北区域）
- 华东 `region02 / 123456`（选择华东区域）
- 院校原有 `bj_school` / `hb_school` / `sx_school`，密码 `123456`
- 原运营认证审核员 `reviewer / 123456` 仍进入原运营工作台

## 数据边界
附件原系统使用 `localStorage.mveriData`，公共服务原平台使用另一个独立 localStorage 数据对象。两者**未做主数据映射或双向同步**。因此本次是源码与登录入口移植，不是跨系统数据融合；禁止将两边同名业务统计直接合并。附件区域模型（华北/华东/华中）与原平台（北京/河北/山西）不同，已让区域登录匹配附件有效演示账号与区域编号；华中区域尚无演示授权账号。

本版本是离线 HTML 产品集成，不具备生产级服务端鉴权。区域/总部源业务代码保留原始功能，但仍需浏览器端到端验收。


## V43 区域/总部白屏修复
- 根因：V42 在内联脚本字符串中插入 `</script>`，HTML 解析器提前关闭标签，导致顶部出现 `)}` 并使脚本中断。
- 修复：所有 `area/*.html` 页面改为安全的外部脚本加载器 `area/portal-loader-v43.js`，在 `portal-bridge.js` 会话检查通过后依次加载 `data.js`、`app.js`。
- 错误反馈：脚本资源加载失败时显示明确的资源缺失提示，不再无提示白屏。
- 保留原业务 `data.js`、`app.js`、`styles.css` 功能及登录授权映射。
- 部署时须**完整覆盖旧 area 目录**，包含全部 HTML 和新 loader，避免缓存旧页。
