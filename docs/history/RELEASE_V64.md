# V64 用户与院校管理加载修复

问题根因：V63 portal-loader-v63.js 漏载 V58/V59/V60 的院校授权、用户目录和注册用户脚本，导致院校管理、用户管理空白。

依赖顺序：school-licenses-v58.js → registered-users-v60.js → user-directory-v59.js → nav-policy-v63.js → data.js → app.js。

脚本加载成功后检查共享 API 是否已挂载；资源加载失败显示具体文件名。

业务算法、业务模型、授权规则、导航样式均未修改。所有 area HTML 页面统一指向 portal-loader-v64.js。

注意：部署时必须同时完整上传 area/ 和 assets/。缓存可使用带 v=64 的地址刷新。
