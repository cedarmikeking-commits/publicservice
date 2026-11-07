// 测评蓝图是当前浏览器管理配置；部署到不同设备需要同步该文件或服务端数据库。
window.ASSESSMENT_BLUEPRINT_DEFAULT = {
  name: "教师数智素养综合测评",
  count: 20,
  level: "",
  distribution: "balanced",
  interactivePercent: 40,
  minimumDomains: 5,
  updated: "初始配置",
};
window.AssessmentBlueprint = {
  key: "teacher_assessment_blueprint_v118",
  read() {
    try {
      return { ...window.ASSESSMENT_BLUEPRINT_DEFAULT, ...JSON.parse(localStorage.getItem(this.key) || "{}") };
    } catch (e) {
      return { ...window.ASSESSMENT_BLUEPRINT_DEFAULT };
    }
  },
  save(v) {
    localStorage.setItem(this.key, JSON.stringify(v));
  },
};
