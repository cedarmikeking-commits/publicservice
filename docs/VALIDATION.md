# V72 迁移验证记录

- 来源：V71 完整公共服务平台目录（原业务主体来自 V68，附 V70 workspace）。
- 保留业务文件数：253，SHA-256 逐项校验全部一致。
- 新目录：`src/apps/{site,auth,personal,institution,area,assessment,operations,assets,workspace}`。
- `node tests/verify.mjs`：通过，核心模块入口均存在。
- Node.js 脚本语法：`server.mjs`、原 `area/app.js` 检查通过。
- 新 HTTP 服务 4873 端口：根首页、官网入口、官网 JS、登录、总部与区域、测评后台、实验工作台均 HTTP 200。
- 历史链接兼容：`/site/index.html` 与 `/area/colleges.html` HTTP 200。
- 浏览器 E2E：Playwright Chromium 启动成功，但容器安全规则拦截 localhost 和 file:// URL，因此浏览器点击测试**未执行成功**。
- 本次未修改任何旧业务文件，不能声称修复历史遗留的业务 Bug，也不能声称完成单运行时统一改造。
