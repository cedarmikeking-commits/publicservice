# 现代职业教育公共服务平台 V72.19 · 工作台加载修复版

基于用户提交的 V72.17 完整工程增量更新。全部原业务文件、官网、区域/院校端、双体系题库、报告构建器和资源保留。基于 V72.18 已核验数据交付修复院校名录资源失败会阻断整个工作台的问题，数据内容及覆盖边界不变。

已内置 **4,203条官方来源已核验记录**：职教本科124、高职1540、中职2539。中职涉及20省区市，**全国中职未全量完成**；详见 `data/national-directory/COVERAGE_REPORT.html`。中职记录含附设办学单位，不等同独立法人学校数。

## 启动与部署

- 本地：安装 Node.js 后运行 `npm start`，打开 `http://localhost:4173/`。无需安装第三方 npm 依赖。
- 静态部署：将本工程根目录的 `index.html`、`src/`、`data/` 等完整文件上传到现有 Nginx/Apache 网站目录。无需 Node.js 或 PHP，原静态页面即可运行；保持目录层级不变。
- 总部入口：`src/apps/auth/access.html` → 研究院总部 → 体验账号“总部平台管理员” → 组织与授权 → 院校管理。
- 原始体验账号、入驻授权、区域关系、用户与席位逻辑沿用 V72.17；业务数据仍按原工程方式保存在原浏览器本地存储。同域同路径升级保留原存储，新域名/新浏览器不会自动迁移本地业务台账。
- 不要删除浏览器存储或重新初始化台账。名录已直接内置，无需先导入CSV。

## 从 V72.18 覆盖升级

1. 解压 ZIP，进入包含 `index.html`、`src/`、`data/` 的工程目录。
2. 将其中 `src/` 覆盖到原站点的 `src/`，`data/` 覆盖到原站点的 `data/`，并更新根目录文件；不要把版本目录再套到原 `src/` 内。目录层级保持一致，不需要修改 Nginx/Apache 配置。
3. 强制刷新页面（Windows：Ctrl+F5；Mac：Cmd+Shift+R）。不要清除浏览器站点数据。

V72.19 的入口使用新文件名 `src/apps/area/portal-loader-v7219.js`，不会依赖旧缓存中的 V72.8/V72.18 加载器。全国名录使用 `src/apps/assets/national-school-loader-v7219.js` 及其同级 `national-school-parts-v7219/` 内23个分块，单块小于190 KiB。进入院校管理才读取逐校数据，其他业务不等候名录。失败时在院校目录内提示并支持重试，已有院校、账号和席位管理继续工作。只有4203条记录全部加载并通过数量/唯一标识校验后才发布目录。

## 交付数据

- `data/national-directory/schools.json`：主数据对象，逐校数组位于 `schools`，统计及边界位于 `meta`。
- `sources.json`：32项来源，含原件/网页URL、发布日、数据年度、采集方式、原文范围、附件SHA-256。
- `coverage-report.json` / `COVERAGE_REPORT.html` / `COVERAGE_REPORT.md`：31省区市覆盖明细及11个未覆盖中职省份。
- `directory-tree.json`：层次 → 省份 → 院校三级树；`schools.csv` 为便利副本。
- `raw/`：14个原始附件和2个浏览器实时表格快照；`evidence/`：官方网页/PDF正文证据与待采来源研究。
- `cleaning-audit.json`、`intermediate/*audit.json`：重复归并、排除项、字段冲突及逐源解析审计。

## 核验与重建

运行 `npm run verify` 检查名录缺失/内容异常、嵌套路径、恢复重试及 V72.17 基线文件保留、来源证据、数据一致性、同名跨层次、原业务台账和席位约束。

仅重新生成分块：`python tools/build_catalog_chunks.py`。

只用已核验中间数据重建：`python tools/build_verified_directory.py`；重新生成报告：`python tools/render_coverage_report.py`。

原件重解析需要 `pip install -r tools/requirements-directory.txt`，运行 `python tools/reparse_official_sources.py`，再运行上述构建与报告命令。全流程不需要联网，不会生成虚构学校。

`collect_public_school_directory.py` 为 V72.17 保留的第三方候选采集工具，不属于本版已核验数据生产链；未经官方逐校核验的产物不得覆盖内置正式名录。

## 核验边界

职教本科和高职为教育部截至2026-06-17原始名单。中职来源的年份、招生资格/学校目录/办事名录范围不同，全部明确标注；未取得统一同年全国分母，不计算全国中职学校覆盖百分比。名录收录不会自动建立入驻、账号或占用席位。


## V72.24
- 公共门户生态合作页视觉修复与合作 Logo 展示带增强。
