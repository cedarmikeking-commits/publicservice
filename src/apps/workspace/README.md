# MVERI 统一工程 V70 · 全新基础框架

这是重新搭建的新工程，不复用 V1–V69 中的双侧栏、iframe、多个 portal-loader、重复 SPA 拦截器和全局页面装配代码。

## 启动

要求 Node.js 20+。不需要安装第三方依赖。在项目根目录运行：

```bash
npm run dev
```

访问终端输出的地址。通过 `node server.mjs` 启动内置静态服务器。架构/席位测试：`npm test`。部署到 Nginx 等静态服务器时，将项目根目录作为站点根目录，并确保 `public/data`、`public/assets` 映射到 `/data`、`/assets`。

## 登录

本地开发测试账号：admin、region01、school01、reviewer；初始密码 123456。**本地演示账号，不可作为真实生产身份认证。**

## 架构

- `src/core/catalog.js`：唯一导航目录 + 功能编码 + 前端角色许可清单
- `src/core/router.js`：唯一 History API 路由，不重新加载外壳
- `src/core/store.js`：统一数据仓储 + 变更记录 + 院校席位规则
- `src/modules/business.js`：经营、培训、组织、用户与结算模块
- `src/modules/assessment.js`：标准、考评点、试题审核与能力评价模块
- `src/main.js`：单工作台入口，统一侧栏/顶部栏/模块挂载
- `src/styles/app.css`：唯一公共工作台设计系统
- `public/data`：迁移的原始业务种子数据（经营、考评点、3710 候选题）
- `docs`：数据迁移清单、验收与尚缺能力

## 数据约束

所有业务数据暂存在同源浏览器 localStorage。候选题保留原文件的“禁止直接作为正式试题发布”限制。考评点/试题专家结论单独保存，保留原数据证据。

**交付边界：** 此版本完成全新统一前端框架与可运行的主要业务管理、审核流程；旧系统内复杂的 AI 自动命题、报告可视编辑、交互测评环境和跨端实时同步尚未全部移植，详见 `docs/MIGRATION.md`。它们不能通过保留旧页面/iframe 假装迁移成功。
