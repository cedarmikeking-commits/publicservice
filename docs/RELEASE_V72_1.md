# V72.1 首页直接渲染修复

基于 V72.0，根 index.html 直接加载原官网内容，不再使用 meta refresh 或 location.replace。
采用 base href="./src/apps/site/" 保留原官网相对路径解析；原业务文件与逻辑未改。
请完整部署到 publicservice 目录，确保 index.html 与 src 目录同级。
