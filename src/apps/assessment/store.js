/* 前后台共用数据访问层。修改写入当前浏览器 localStorage；导入/导出 JS 支持人工发布快照。 */
const STORAGE_KEY = "teacher_platform_v12";
const PlatformStore = (() => {
  const initial = () => ({
    bank: JSON.parse(JSON.stringify(BANK)),
    settings: JSON.parse(JSON.stringify(PLATFORM_DATA.settings)),
    records: JSON.parse(JSON.stringify(PLATFORM_DATA.records)),
  });
  let memory = null;
  function read() {
    if (memory) return memory;
    try {
      let v = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (v && Array.isArray(v.bank) && Array.isArray(v.records)) {
        memory = v;
        return v;
      }
    } catch (e) {}
    memory = initial();
    return memory;
  }
  function write(next) {
    memory = next;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return true;
    } catch (e) {
      alert("当前浏览器无法持久化保存，请使用“导出数据快照”备份。");
      return false;
    }
  }
  function download(name, body) {
    let u = URL.createObjectURL(new Blob([body], { type: "text/javascript;charset=utf-8" }));
    let a = document.createElement("a");
    a.href = u;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(u), 1000);
  }
  function exportData() {
    let s = read();
    download(
      "data.js",
      "window.PLATFORM_DATA=" +
        JSON.stringify(
          { version: "1.2", settings: s.settings, records: s.records, updatedAt: new Date().toISOString() },
          null,
          2,
        ) +
        ";\n",
    );
  }
  function exportBank() {
    let s = read();
    download(
      "question-bank.js",
      "const BANK=" +
        JSON.stringify(s.bank, null, 2) +
        ";\nconst IND=" +
        JSON.stringify(IND, null, 2) +
        ";\nconst CATS=" +
        JSON.stringify(CATS, null, 2) +
        ";\n",
    );
  }
  function reset() {
    memory = initial();
    write(memory);
  }
  return { read, write, exportData, exportBank, reset, download };
})();
