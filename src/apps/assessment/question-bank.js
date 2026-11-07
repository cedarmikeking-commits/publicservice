/* 教师素智素养试题库，编辑此文件即可修改题目；与 index.html 同目录。 */
const BANK=[
  {
    "id": "QS-001",
    "category": "基础认知",
    "type": "single",
    "indicator": "1.1.1",
    "indicatorName": "基础知识",
    "level": "初级",
    "stem": "云计算服务的典型特点是什么？",
    "options": [
      "只能在个人电脑离线运行",
      "不允许多人共享",
      "必须购买本地服务器",
      "按需通过网络获取计算资源"
    ],
    "answer": 3,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-002",
    "category": "基础认知",
    "type": "single",
    "indicator": "1.1.1",
    "indicatorName": "基础知识",
    "level": "中级",
    "stem": "机器学习最核心的技术路径是什么？",
    "options": [
      "从数据中学习规律并用于预测",
      "由教师手工编写全部答案",
      "只存储图片文件",
      "只提供网络接入"
    ],
    "answer": 0,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-003",
    "category": "基础认知",
    "type": "single",
    "indicator": "1.1.1",
    "indicatorName": "基础知识",
    "level": "高级",
    "stem": "AR用于技能教学时主要体现什么特征？",
    "options": [
      "代替所有实际操作",
      "把数字信息叠加到真实环境",
      "完全隔离现实场景",
      "仅用于文字编辑"
    ],
    "answer": 1,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-004",
    "category": "基础认知",
    "type": "single",
    "indicator": "1.1.1",
    "indicatorName": "基础知识",
    "level": "初级",
    "stem": "数字孪生与普通三维模型的重要区别是什么？",
    "options": [
      "必须使用纸质模型",
      "不支持更新",
      "可关联真实对象数据并映射运行状态",
      "只有静态外观"
    ],
    "answer": 2,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-005",
    "category": "基础认知",
    "type": "single",
    "indicator": "1.1.1",
    "indicatorName": "基础知识",
    "level": "中级",
    "stem": "数据可视化最主要的教学价值是什么？",
    "options": [
      "自动保证结论正确",
      "取代数据清洗",
      "消除样本偏差",
      "帮助识别学习趋势与差异"
    ],
    "answer": 3,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-006",
    "category": "基础认知",
    "type": "single",
    "indicator": "1.1.1",
    "indicatorName": "基础知识",
    "level": "高级",
    "stem": "生成式AI生成的教学文字应如何理解？",
    "options": [
      "是待核验的候选内容",
      "一定是权威事实",
      "完全没有版权风险",
      "无需教师审查"
    ],
    "answer": 0,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-007",
    "category": "基础认知",
    "type": "single",
    "indicator": "1.1.1",
    "indicatorName": "基础知识",
    "level": "初级",
    "stem": "物联网智慧教室的典型能力是？",
    "options": [
      "完全无需安全管理",
      "设备联网感知与联动控制",
      "只制作纸质试卷",
      "仅存储离线视频"
    ],
    "answer": 1,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-008",
    "category": "基础认知",
    "type": "single",
    "indicator": "1.1.1",
    "indicatorName": "基础知识",
    "level": "中级",
    "stem": "LMS在职业教育中的主要用途是？",
    "options": [
      "替代实训设备安全操作",
      "生产数控零件",
      "管理课程、学习活动与进度",
      "直接维修投影仪"
    ],
    "answer": 2,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-009",
    "category": "基础认知",
    "type": "single",
    "indicator": "1.1.1",
    "indicatorName": "基础知识",
    "level": "高级",
    "stem": "学习分析的合理目标是？",
    "options": [
      "对学生贴永久标签",
      "仅依赖一次成绩",
      "公开个人排名",
      "利用合规数据改进学习支持"
    ],
    "answer": 3,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-010",
    "category": "基础认知",
    "type": "single",
    "indicator": "1.1.1",
    "indicatorName": "基础知识",
    "level": "初级",
    "stem": "VR仿真更适合哪类情形？",
    "options": [
      "高风险或高成本操作的预训练",
      "替代全部真实岗位实践",
      "保证技能自动熟练",
      "无需教学目标"
    ],
    "answer": 0,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-011",
    "category": "基础认知",
    "type": "single",
    "indicator": "1.2.1",
    "indicatorName": "价值理解",
    "level": "中级",
    "stem": "数字技术支持教育公平的合理做法是？",
    "options": [
      "按家庭收入限制访问",
      "提供可及且无障碍的优质学习资源",
      "只照顾高分学生",
      "取消线下支持"
    ],
    "answer": 1,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-012",
    "category": "基础认知",
    "type": "single",
    "indicator": "1.2.1",
    "indicatorName": "价值理解",
    "level": "高级",
    "stem": "针对听障学生提升学习包容性可采取什么措施？",
    "options": [
      "取消课堂互动",
      "忽略差异",
      "提供实时字幕与文本材料",
      "强制仅听音频"
    ],
    "answer": 2,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-013",
    "category": "基础认知",
    "type": "single",
    "indicator": "1.2.1",
    "indicatorName": "价值理解",
    "level": "初级",
    "stem": "数字化传播工匠精神的合理方法是？",
    "options": [
      "只展示技术宣传口号",
      "完全省略劳动过程",
      "仅追求观看量",
      "利用工艺视频与实训案例展现质量标准"
    ],
    "answer": 3,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-014",
    "category": "基础认知",
    "type": "single",
    "indicator": "1.2.2",
    "indicatorName": "变革意愿",
    "level": "中级",
    "stem": "新教学平台上线后教师首先应？",
    "options": [
      "评估教学需要并主动学习试用",
      "永久拒绝使用",
      "不告知学生直接强制迁移",
      "删除原有资料"
    ],
    "answer": 0,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-015",
    "category": "基础认知",
    "type": "single",
    "indicator": "1.2.2",
    "indicatorName": "变革意愿",
    "level": "高级",
    "stem": "面对数智工具学习难点，合理行动是？",
    "options": [
      "跳过安全培训",
      "分阶段练习并借助同行互助",
      "立即停止所有创新",
      "只依赖厂商宣传"
    ],
    "answer": 1,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-016",
    "category": "基础认知",
    "type": "single",
    "indicator": "3.1.1",
    "indicatorName": "与人沟通",
    "level": "初级",
    "stem": "在线教研沟通的高效做法是？",
    "options": [
      "所有信息私聊且不记录",
      "不反馈结论",
      "明确议题、共享材料并总结行动项",
      "仅发送无主题语音"
    ],
    "answer": 2,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-017",
    "category": "基础认知",
    "type": "single",
    "indicator": "3.1.2",
    "indicatorName": "团队合作",
    "level": "中级",
    "stem": "线上共同备课更应强调？",
    "options": [
      "多人同时覆盖文件",
      "不确定负责人",
      "只靠口头记忆",
      "角色分工、版本管理和协作审阅"
    ],
    "answer": 3,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-018",
    "category": "基础认知",
    "type": "single",
    "indicator": "3.2.1",
    "indicatorName": "平台选用",
    "level": "高级",
    "stem": "选择教学平台前优先核实什么？",
    "options": [
      "教学需求、可访问性与隐私安全",
      "界面颜色是否流行",
      "广告数量",
      "是否必须付费"
    ],
    "answer": 0,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-019",
    "category": "基础认知",
    "type": "single",
    "indicator": "5.1.1",
    "indicatorName": "数字职业",
    "level": "初级",
    "stem": "专业教学对接数字职业标准的合理流程是？",
    "options": [
      "只更换专业名称",
      "分析岗位能力并映射课程目标",
      "直接复制企业广告",
      "不更新课程标准"
    ],
    "answer": 1,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-020",
    "category": "基础认知",
    "type": "single",
    "indicator": "5.1.2",
    "indicatorName": "数字技能",
    "level": "中级",
    "stem": "将数字技能融入人才培养应首先？",
    "options": [
      "取消技能考核",
      "只要求学生背术语",
      "识别岗位所需软件与真实任务",
      "仅购买更多设备"
    ],
    "answer": 2,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-021",
    "category": "伦理安全",
    "type": "single",
    "indicator": "2.1.1",
    "indicatorName": "伦理道德",
    "level": "初级",
    "stem": "AI给出有偏见的学生评价，教师应？",
    "options": [
      "直接发布",
      "删除所有异议",
      "只看算法分数",
      "核验证据、纠正偏差并保留人工判断"
    ],
    "answer": 3,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-022",
    "category": "伦理安全",
    "type": "single",
    "indicator": "2.1.2",
    "indicatorName": "行为规范",
    "level": "中级",
    "stem": "引用网络教学图片的规范方式是？",
    "options": [
      "核实授权或许可并规范署名",
      "随意去掉水印",
      "默认公开即可商用",
      "直接声称原创"
    ],
    "answer": 0,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-023",
    "category": "伦理安全",
    "type": "single",
    "indicator": "2.1.2",
    "indicatorName": "行为规范",
    "level": "高级",
    "stem": "向外部AI上传学生数据前应？",
    "options": [
      "把密码附在文件中",
      "依制度检查授权、必要性并去标识化",
      "上传全部身份证号",
      "忽略平台条款"
    ],
    "answer": 1,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-024",
    "category": "伦理安全",
    "type": "single",
    "indicator": "2.2.1",
    "indicatorName": "安全意识",
    "level": "初级",
    "stem": "收到要求点击链接重置密码的陌生短信，应？",
    "options": [
      "转发给全班",
      "关闭安全提醒",
      "核实来源并从官方入口操作",
      "立即输入密码"
    ],
    "answer": 2,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-025",
    "category": "伦理安全",
    "type": "single",
    "indicator": "2.2.2",
    "indicatorName": "防护能力",
    "level": "中级",
    "stem": "公开教学链接含有学生成绩，最合理设置是？",
    "options": [
      "永久公开",
      "取消登录",
      "把链接发到社交媒体",
      "限制授权人员访问并最小化共享"
    ],
    "answer": 3,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-026",
    "category": "伦理安全",
    "type": "single",
    "indicator": "2.2.2",
    "indicatorName": "防护能力",
    "level": "高级",
    "stem": "用于教学的账号出现异地登录提醒应？",
    "options": [
      "更改密码、退出异常会话并启用多因素认证",
      "忽略提醒",
      "把密码发给同事",
      "关闭日志"
    ],
    "answer": 0,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-027",
    "category": "伦理安全",
    "type": "single",
    "indicator": "2.2.1",
    "indicatorName": "安全意识",
    "level": "初级",
    "stem": "识别网络谣言的正确方法是？",
    "options": [
      "先传播再核实",
      "追溯权威来源并交叉核实",
      "只看转发量",
      "以标题情绪判断"
    ],
    "answer": 1,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-028",
    "category": "伦理安全",
    "type": "single",
    "indicator": "2.1.1",
    "indicatorName": "伦理道德",
    "level": "中级",
    "stem": "AI自动批改结果与教师判断冲突，应？",
    "options": [
      "偷偷更换分数",
      "删除原始作业",
      "复核评分依据并提供申诉渠道",
      "永远服从AI"
    ],
    "answer": 2,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-029",
    "category": "伦理安全",
    "type": "single",
    "indicator": "2.1.2",
    "indicatorName": "行为规范",
    "level": "高级",
    "stem": "培训课件包含企业保密工艺图纸，应？",
    "options": [
      "直接公开上传",
      "去掉企业名称就全部公开",
      "作为营销素材出售",
      "核查保密范围并获得必要授权"
    ],
    "answer": 3,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-030",
    "category": "伦理安全",
    "type": "single",
    "indicator": "2.2.2",
    "indicatorName": "防护能力",
    "level": "初级",
    "stem": "电脑感染勒索软件的首要处置是？",
    "options": [
      "按预案隔离设备并报告信息部门",
      "继续连接公共网络",
      "直接支付赎金",
      "自行删除全部日志"
    ],
    "answer": 0,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-031",
    "category": "伦理安全",
    "type": "single",
    "indicator": "2.2.2",
    "indicatorName": "防护能力",
    "level": "中级",
    "stem": "备份教学数据库较稳妥的做法是？",
    "options": [
      "管理员密码写在文件里",
      "定期备份并验证恢复能力",
      "只存一个U盘",
      "备份从不测试"
    ],
    "answer": 1,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-032",
    "category": "伦理安全",
    "type": "single",
    "indicator": "2.2.1",
    "indicatorName": "安全意识",
    "level": "高级",
    "stem": "给学生演示外部AI时应强调？",
    "options": [
      "AI可以独立决定成绩",
      "任何网站都安全",
      "输出可能出错且不可输入敏感信息",
      "AI从不幻觉"
    ],
    "answer": 2,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-033",
    "category": "伦理安全",
    "type": "single",
    "indicator": "2.1.1",
    "indicatorName": "伦理道德",
    "level": "初级",
    "stem": "使用学习画像进行分层指导应避免？",
    "options": [
      "动态更新证据",
      "说明数据局限",
      "允许人工复核",
      "把画像当作固定能力标签"
    ],
    "answer": 3,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-034",
    "category": "伦理安全",
    "type": "single",
    "indicator": "2.1.2",
    "indicatorName": "行为规范",
    "level": "中级",
    "stem": "发现他人上传的盗版教材，教师应？",
    "options": [
      "停止传播并选择合法来源",
      "分享到所有班级",
      "破解更多文件",
      "删去作者姓名"
    ],
    "answer": 0,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-035",
    "category": "伦理安全",
    "type": "single",
    "indicator": "2.2.2",
    "indicatorName": "防护能力",
    "level": "高级",
    "stem": "多人协作文件的安全权限原则是？",
    "options": [
      "关闭操作历史",
      "按角色授予完成工作所需最小权限",
      "所有人管理员",
      "匿名全网编辑"
    ],
    "answer": 1,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-036",
    "category": "伦理安全",
    "type": "single",
    "indicator": "2.2.1",
    "indicatorName": "安全意识",
    "level": "初级",
    "stem": "学校公共Wi-Fi用于成绩处理时应？",
    "options": [
      "关闭系统更新",
      "忽视网络身份",
      "使用可信连接与合规安全措施",
      "自动共享文件夹"
    ],
    "answer": 2,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-037",
    "category": "伦理安全",
    "type": "single",
    "indicator": "2.1.1",
    "indicatorName": "伦理道德",
    "level": "中级",
    "stem": "使用AI生成教师形象视频前，应？",
    "options": [
      "未经同意制作",
      "伪造专家推荐",
      "冒用同事身份",
      "核实本人授权并清楚标注合成用途"
    ],
    "answer": 3,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-038",
    "category": "伦理安全",
    "type": "single",
    "indicator": "2.1.2",
    "indicatorName": "行为规范",
    "level": "高级",
    "stem": "发布学生实践成果照片前应？",
    "options": [
      "遵守授权和隐私规则并去除敏感信息",
      "显示完整学号和家庭住址",
      "默认无须审批",
      "公开定位轨迹"
    ],
    "answer": 0,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-039",
    "category": "伦理安全",
    "type": "single",
    "indicator": "2.2.2",
    "indicatorName": "防护能力",
    "level": "初级",
    "stem": "离职项目成员仍有资源库编辑权限，应？",
    "options": [
      "删除审计日志",
      "按流程及时撤销其访问权限",
      "保留永久权限",
      "共享超级管理员账户"
    ],
    "answer": 1,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-040",
    "category": "伦理安全",
    "type": "single",
    "indicator": "2.2.1",
    "indicatorName": "安全意识",
    "level": "中级",
    "stem": "遭遇信息过载与线上压力时合理做法是？",
    "options": [
      "关闭所有沟通",
      "向学生转移压力",
      "设定使用边界并寻求适当支持",
      "持续24小时在线"
    ],
    "answer": 2,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-041",
    "category": "数字工具操作",
    "type": "config",
    "indicator": "1.1.2",
    "indicatorName": "常规操作",
    "level": "初级",
    "stem": "云文档需要让教研组共同修改，但不向全网开放。应设置什么权限？",
    "options": [
      "任何人可编辑",
      "所有人仅下载",
      "取消访问控制",
      "指定成员可编辑"
    ],
    "answer": 3,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-042",
    "category": "数字工具操作",
    "type": "config",
    "indicator": "1.1.2",
    "indicatorName": "常规操作",
    "level": "中级",
    "stem": "电子表格要计算B2到B6的平均值，应输入哪条公式？",
    "options": [
      "=AVERAGE(B2:B6)",
      "=SUM(B2:B6)",
      "=MAX(B2:B6)",
      "=COUNT(B2:B6)"
    ],
    "answer": 0,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-043",
    "category": "数字工具操作",
    "type": "config",
    "indicator": "1.1.2",
    "indicatorName": "常规操作",
    "level": "高级",
    "stem": "收集课堂反馈希望自动汇总，应使用哪项功能？",
    "options": [
      "音频降噪",
      "在线问卷及响应统计",
      "图片压缩",
      "投影亮度调节"
    ],
    "answer": 1,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-044",
    "category": "数字工具操作",
    "type": "config",
    "indicator": "3.1.1",
    "indicatorName": "与人沟通",
    "level": "初级",
    "stem": "在线研讨时需要展示操作流程，应启用？",
    "options": [
      "退出音频设备",
      "删除会议记录",
      "屏幕共享并确认共享范围",
      "公开会议密码"
    ],
    "answer": 2,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-045",
    "category": "数字工具操作",
    "type": "config",
    "indicator": "3.1.2",
    "indicatorName": "团队合作",
    "level": "中级",
    "stem": "多人共同编写教案，应该开启？",
    "options": [
      "完全覆盖历史",
      "匿名管理员",
      "只读且不可评论",
      "版本历史与修订建议"
    ],
    "answer": 3,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-046",
    "category": "数字工具操作",
    "type": "config",
    "indicator": "3.2.1",
    "indicatorName": "平台选用",
    "level": "高级",
    "stem": "给学生开通线上课程，优先进行哪项检查？",
    "options": [
      "账号可用与课程访问权限",
      "打印全部网页",
      "关闭身份验证",
      "只考虑配色"
    ],
    "answer": 0,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-047",
    "category": "数字工具操作",
    "type": "config",
    "indicator": "3.2.2",
    "indicatorName": "在线指导",
    "level": "初级",
    "stem": "学生无法找到提交入口，教师应？",
    "options": [
      "公开学生账号",
      "提供任务路径及截图指引",
      "让学生猜测",
      "直接记零分"
    ],
    "answer": 1,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-048",
    "category": "数字工具操作",
    "type": "config",
    "indicator": "3.2.3",
    "indicatorName": "跟踪反思",
    "level": "中级",
    "stem": "平台使用率下降，首先查看哪类数据？",
    "options": [
      "页面背景颜色",
      "学生头像风格",
      "登录、参与和任务完成趋势",
      "教师手机型号"
    ],
    "answer": 2,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-049",
    "category": "数字工具操作",
    "type": "config",
    "indicator": "4.2.1",
    "indicatorName": "资源转化",
    "level": "高级",
    "stem": "将讲义转成可检索可编辑的文本，宜使用？",
    "options": [
      "仅压缩图像",
      "提高屏幕亮度",
      "关闭字体嵌入",
      "文档识别并人工校对"
    ],
    "answer": 3,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-050",
    "category": "数字工具操作",
    "type": "config",
    "indicator": "4.2.2",
    "indicatorName": "资源甄选",
    "level": "初级",
    "stem": "查找职业教育教学资源，宜先选？",
    "options": [
      "来源可靠且许可清晰的专业资源库",
      "无来源网盘",
      "广告弹窗",
      "匿名盗版站"
    ],
    "answer": 0,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-051",
    "category": "数字工具操作",
    "type": "config",
    "indicator": "4.2.3",
    "indicatorName": "资源制作",
    "level": "中级",
    "stem": "AI辅助生成教案，优质输入应包括？",
    "options": [
      "上传全部学生隐私",
      "课程目标、学生特点、约束与输出格式",
      "只输入“写一下”",
      "仅写教师姓名"
    ],
    "answer": 1,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-052",
    "category": "数字工具操作",
    "type": "config",
    "indicator": "4.2.3",
    "indicatorName": "资源制作",
    "level": "高级",
    "stem": "制作教学视频字幕后应进行？",
    "options": [
      "删除全部标点",
      "统一静音",
      "时间轴与专业术语人工校验",
      "直接发布不检查"
    ],
    "answer": 2,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-053",
    "category": "数字工具操作",
    "type": "config",
    "indicator": "4.2.4",
    "indicatorName": "教材开发",
    "level": "初级",
    "stem": "开发数字教材时，资源目录宜采用？",
    "options": [
      "文件名全部相同",
      "无索引混放",
      "只能由作者访问",
      "模块化章节与可追溯版本"
    ],
    "answer": 3,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-054",
    "category": "数字工具操作",
    "type": "config",
    "indicator": "4.3.1",
    "indicatorName": "教学准备",
    "level": "中级",
    "stem": "线上教学前技术准备优先确认？",
    "options": [
      "平台登录、音视频、材料与备份",
      "只选壁纸",
      "关掉摄像头权限检查",
      "删掉课程资料"
    ],
    "answer": 0,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-055",
    "category": "数字工具操作",
    "type": "config",
    "indicator": "4.3.2",
    "indicatorName": "教学组织",
    "level": "高级",
    "stem": "组织线上小组讨论时，可用？",
    "options": [
      "禁止提交成果",
      "分组讨论与共享协作文档",
      "仅教师单向广播",
      "永久静音全部学生"
    ],
    "answer": 1,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-056",
    "category": "数字工具操作",
    "type": "config",
    "indicator": "4.3.3",
    "indicatorName": "学习支持",
    "level": "初级",
    "stem": "指导学生自主学习宜设置？",
    "options": [
      "只看最终考试",
      "公开互评隐私",
      "里程碑任务及进度提醒",
      "无限期不检查"
    ],
    "answer": 2,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-057",
    "category": "数字工具操作",
    "type": "config",
    "indicator": "4.4.1",
    "indicatorName": "数据采集",
    "level": "中级",
    "stem": "采集课堂活动数据前应首先？",
    "options": [
      "采集所有摄像头画面",
      "开放给任何供应商",
      "永久保留原始数据",
      "明确目的、最小采集与授权范围"
    ],
    "answer": 3,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-058",
    "category": "数字工具操作",
    "type": "config",
    "indicator": "4.4.2",
    "indicatorName": "分析研判",
    "level": "高级",
    "stem": "比较各班级目标达成率，宜使用？",
    "options": [
      "透视汇总和可视化图表",
      "手工修改成绩",
      "直接删除低分",
      "只看一名学生"
    ],
    "answer": 0,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-059",
    "category": "数字工具操作",
    "type": "config",
    "indicator": "5.2.1",
    "indicatorName": "供需对接",
    "level": "初级",
    "stem": "展示课程与岗位能力对应关系，宜用？",
    "options": [
      "无标签图片",
      "映射矩阵或关系图",
      "随意排列截图",
      "纯装饰动画"
    ],
    "answer": 1,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-060",
    "category": "数字工具操作",
    "type": "config",
    "indicator": "5.2.3",
    "indicatorName": "社会服务",
    "level": "中级",
    "stem": "发布社会培训课程资源，宜设置？",
    "options": [
      "关闭辅助功能",
      "所有内容只限校园局域网",
      "分层学习路径与无障碍入口",
      "仅提供模糊图片"
    ],
    "answer": 2,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-061",
    "category": "教学硬件排障",
    "type": "order",
    "indicator": "1.1.2",
    "indicatorName": "常规操作",
    "level": "初级",
    "stem": "交互屏无画面，按合理顺序完成排查。",
    "options": [
      "核对输入信号源",
      "检查显示设备电源",
      "检查电脑投屏模式",
      "检查连接线与接口"
    ],
    "answer": [
      1,
      3,
      0,
      2
    ],
    "explain": "正确流程应先进行基础安全/连接检查，再定位问题、验证效果。"
  },
  {
    "id": "QS-062",
    "category": "教学硬件排障",
    "type": "order",
    "indicator": "1.1.2",
    "indicatorName": "常规操作",
    "level": "中级",
    "stem": "电子白板触控无响应，按合理顺序处理。",
    "options": [
      "检查触控接口或连接",
      "按说明校准或报修",
      "确认设备供电",
      "测试手指触控与笔状态"
    ],
    "answer": [
      2,
      0,
      3,
      1
    ],
    "explain": "正确流程应先进行基础安全/连接检查，再定位问题、验证效果。"
  },
  {
    "id": "QS-063",
    "category": "教学硬件排障",
    "type": "order",
    "indicator": "1.1.2",
    "indicatorName": "常规操作",
    "level": "高级",
    "stem": "投影画面模糊，按合理顺序排查。",
    "options": [
      "校对分辨率",
      "检查镜头遮挡与清洁",
      "必要时联系设备管理员",
      "检查投影距离与对焦"
    ],
    "answer": [
      1,
      3,
      0,
      2
    ],
    "explain": "正确流程应先进行基础安全/连接检查，再定位问题、验证效果。"
  },
  {
    "id": "QS-064",
    "category": "教学硬件排障",
    "type": "order",
    "indicator": "1.1.2",
    "indicatorName": "常规操作",
    "level": "初级",
    "stem": "教室扩声系统没有声音，按顺序排查。",
    "options": [
      "检查音量及静音",
      "测试音频连接与播放",
      "确认音响设备上电",
      "核对音频输出设备"
    ],
    "answer": [
      2,
      0,
      3,
      1
    ],
    "explain": "正确流程应先进行基础安全/连接检查，再定位问题、验证效果。"
  },
  {
    "id": "QS-065",
    "category": "教学硬件排障",
    "type": "order",
    "indicator": "4.3.1",
    "indicatorName": "教学准备",
    "level": "中级",
    "stem": "开课前智慧教室检查应按哪种顺序？",
    "options": [
      "测试教学音视频",
      "确认供电与环境安全",
      "准备备用教学方案",
      "检查网络与设备连接"
    ],
    "answer": [
      1,
      3,
      0,
      2
    ],
    "explain": "正确流程应先进行基础安全/连接检查，再定位问题、验证效果。"
  },
  {
    "id": "QS-066",
    "category": "教学硬件排障",
    "type": "order",
    "indicator": "1.1.2",
    "indicatorName": "常规操作",
    "level": "高级",
    "stem": "无线投屏失败后按顺序处理。",
    "options": [
      "确认投屏接收端已开启",
      "测试画面与延迟",
      "确认双方在允许的网络环境",
      "重新选择正确接收设备"
    ],
    "answer": [
      2,
      0,
      3,
      1
    ],
    "explain": "正确流程应先进行基础安全/连接检查，再定位问题、验证效果。"
  },
  {
    "id": "QS-067",
    "category": "教学硬件排障",
    "type": "order",
    "indicator": "1.1.2",
    "indicatorName": "常规操作",
    "level": "初级",
    "stem": "视频会议摄像头黑屏，按顺序处理。",
    "options": [
      "核对会议软件设备选择",
      "检查摄像头硬件连接",
      "测试预览画面",
      "核对系统摄像头权限"
    ],
    "answer": [
      1,
      3,
      0,
      2
    ],
    "explain": "正确流程应先进行基础安全/连接检查，再定位问题、验证效果。"
  },
  {
    "id": "QS-068",
    "category": "教学硬件排障",
    "type": "order",
    "indicator": "1.1.2",
    "indicatorName": "常规操作",
    "level": "中级",
    "stem": "实物展台无法显示图像，按顺序排查。",
    "options": [
      "检查输入设备选择",
      "测试或报修",
      "确认展台电源及连接",
      "调节镜头和照明"
    ],
    "answer": [
      2,
      0,
      3,
      1
    ],
    "explain": "正确流程应先进行基础安全/连接检查，再定位问题、验证效果。"
  },
  {
    "id": "QS-069",
    "category": "教学硬件排障",
    "type": "order",
    "indicator": "4.3.1",
    "indicatorName": "教学准备",
    "level": "高级",
    "stem": "智慧教室网络中断时，按处置顺序。",
    "options": [
      "切换合规备用网络或离线材料",
      "识别网络故障范围",
      "记录故障并通知运维",
      "检查本地连接状态"
    ],
    "answer": [
      1,
      3,
      0,
      2
    ],
    "explain": "正确流程应先进行基础安全/连接检查，再定位问题、验证效果。"
  },
  {
    "id": "QS-070",
    "category": "教学硬件排障",
    "type": "order",
    "indicator": "2.2.2",
    "indicatorName": "防护能力",
    "level": "初级",
    "stem": "教学电脑发现疑似恶意程序时，依次处理。",
    "options": [
      "隔离受影响网络连接",
      "按预案检测恢复",
      "停止可疑操作",
      "报告信息安全负责人"
    ],
    "answer": [
      2,
      0,
      3,
      1
    ],
    "explain": "正确流程应先进行基础安全/连接检查，再定位问题、验证效果。"
  },
  {
    "id": "QS-071",
    "category": "教学硬件排障",
    "type": "order",
    "indicator": "1.1.2",
    "indicatorName": "常规操作",
    "level": "中级",
    "stem": "打印机离线导致讲义无法打印，按顺序处理。",
    "options": [
      "核对打印队列和驱动",
      "检查电源和纸张状态",
      "测试打印或联系维护",
      "确认连接与设备在线"
    ],
    "answer": [
      1,
      3,
      0,
      2
    ],
    "explain": "正确流程应先进行基础安全/连接检查，再定位问题、验证效果。"
  },
  {
    "id": "QS-072",
    "category": "教学硬件排障",
    "type": "order",
    "indicator": "1.1.2",
    "indicatorName": "常规操作",
    "level": "高级",
    "stem": "扫描文件内容偏斜模糊，按顺序改进。",
    "options": [
      "放正纸张并设置分辨率",
      "重新扫描并核查内容",
      "清洁扫描玻璃或镜头",
      "预览扫描质量"
    ],
    "answer": [
      2,
      0,
      3,
      1
    ],
    "explain": "正确流程应先进行基础安全/连接检查，再定位问题、验证效果。"
  },
  {
    "id": "QS-073",
    "category": "教学硬件排障",
    "type": "order",
    "indicator": "4.3.1",
    "indicatorName": "教学准备",
    "level": "初级",
    "stem": "教学麦克风产生啸叫，按顺序处理。",
    "options": [
      "检查音频增益配置",
      "降低音量避免啸叫",
      "测试后恢复合理音量",
      "调整麦克风与音箱位置"
    ],
    "answer": [
      1,
      3,
      0,
      2
    ],
    "explain": "正确流程应先进行基础安全/连接检查，再定位问题、验证效果。"
  },
  {
    "id": "QS-074",
    "category": "教学硬件排障",
    "type": "order",
    "indicator": "4.3.1",
    "indicatorName": "教学准备",
    "level": "中级",
    "stem": "智慧教室触控屏卡顿，按顺序处理。",
    "options": [
      "保存教学内容",
      "验证功能或报修",
      "确认是否正在更新或高负载",
      "按规范重启相关应用或设备"
    ],
    "answer": [
      2,
      0,
      3,
      1
    ],
    "explain": "正确流程应先进行基础安全/连接检查，再定位问题、验证效果。"
  },
  {
    "id": "QS-075",
    "category": "教学硬件排障",
    "type": "order",
    "indicator": "1.1.2",
    "indicatorName": "常规操作",
    "level": "高级",
    "stem": "蓝牙扩音器连接不上，按顺序检查。",
    "options": [
      "从正确设备列表选择",
      "检查设备电量与电源",
      "测试输出并调整音量",
      "开启允许的配对模式"
    ],
    "answer": [
      1,
      3,
      0,
      2
    ],
    "explain": "正确流程应先进行基础安全/连接检查，再定位问题、验证效果。"
  },
  {
    "id": "QS-076",
    "category": "教学硬件排障",
    "type": "order",
    "indicator": "1.1.2",
    "indicatorName": "常规操作",
    "level": "初级",
    "stem": "交互屏显示电脑画面但无声音，按顺序处理。",
    "options": [
      "查看系统声音输出选项",
      "播放测试音频",
      "检查扩声设备静音及音量",
      "选择正确HDMI或音频输出"
    ],
    "answer": [
      2,
      0,
      3,
      1
    ],
    "explain": "正确流程应先进行基础安全/连接检查，再定位问题、验证效果。"
  },
  {
    "id": "QS-077",
    "category": "教学硬件排障",
    "type": "order",
    "indicator": "4.3.1",
    "indicatorName": "教学准备",
    "level": "中级",
    "stem": "实训设备开机前，正确安全流程是？",
    "options": [
      "按厂家规程执行启动",
      "检查设备及场地安全状况",
      "确认运行状态再开始教学",
      "确认操作规程和防护措施"
    ],
    "answer": [
      1,
      3,
      0,
      2
    ],
    "explain": "正确流程应先进行基础安全/连接检查，再定位问题、验证效果。"
  },
  {
    "id": "QS-078",
    "category": "教学硬件排障",
    "type": "order",
    "indicator": "2.2.2",
    "indicatorName": "防护能力",
    "level": "高级",
    "stem": "教学设备USB来源不明，应按顺序处理。",
    "options": [
      "核实来源和使用必要性",
      "仅在授权环境中使用",
      "停止接入未知存储设备",
      "依单位制度开展安全检查"
    ],
    "answer": [
      2,
      0,
      3,
      1
    ],
    "explain": "正确流程应先进行基础安全/连接检查，再定位问题、验证效果。"
  },
  {
    "id": "QS-079",
    "category": "教学硬件排障",
    "type": "order",
    "indicator": "1.1.2",
    "indicatorName": "常规操作",
    "level": "初级",
    "stem": "互动屏无法识别手写笔，按顺序排查。",
    "options": [
      "检查配对及驱动设置",
      "确认屏幕触控功能正常",
      "校准或寻求技术支持",
      "检查手写笔电量与适配性"
    ],
    "answer": [
      1,
      3,
      0,
      2
    ],
    "explain": "正确流程应先进行基础安全/连接检查，再定位问题、验证效果。"
  },
  {
    "id": "QS-080",
    "category": "教学硬件排障",
    "type": "order",
    "indicator": "4.3.1",
    "indicatorName": "教学准备",
    "level": "中级",
    "stem": "远程实训直播发生持续延迟，按顺序处理。",
    "options": [
      "关闭无关占用并核查画质",
      "测试延迟并准备异步回看",
      "确认网络与编码负载情况",
      "在教学允许范围内调整码率"
    ],
    "answer": [
      2,
      0,
      3,
      1
    ],
    "explain": "正确流程应先进行基础安全/连接检查，再定位问题、验证效果。"
  },
  {
    "id": "QS-081",
    "category": "教学应用情境",
    "type": "multi",
    "indicator": "4.1.1",
    "indicatorName": "目标确定",
    "level": "初级",
    "stem": "设计“数控加工安全”课程目标，哪些做法合理？",
    "options": [
      "使用可观察的操作动词",
      "明确安全与职业规范要求",
      "对齐岗位能力标准",
      "仅写“了解一下即可”"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-082",
    "category": "教学应用情境",
    "type": "multi",
    "indicator": "4.1.2",
    "indicatorName": "方案制订",
    "level": "中级",
    "stem": "班级学生基础差异明显，哪些教学措施合理？",
    "options": [
      "依据学情设计分层任务",
      "提供差异化学习资源",
      "设置共同底线目标",
      "永久固定学生能力标签"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-083",
    "category": "教学应用情境",
    "type": "multi",
    "indicator": "4.1.3",
    "indicatorName": "模式运用",
    "level": "高级",
    "stem": "实训前采用翻转课堂，哪些安排合适？",
    "options": [
      "课前微课与预习测验",
      "课堂聚焦操作与纠错",
      "课后反思与补救",
      "取消所有现场指导"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-084",
    "category": "教学应用情境",
    "type": "multi",
    "indicator": "4.2.1",
    "indicatorName": "资源转化",
    "level": "初级",
    "stem": "准备课程资源池时，哪些处理符合规范？",
    "options": [
      "统一命名与分类",
      "记录来源和使用许可",
      "设置访问与备份策略",
      "把未经授权资源公开"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-085",
    "category": "教学应用情境",
    "type": "multi",
    "indicator": "4.2.2",
    "indicatorName": "资源甄选",
    "level": "中级",
    "stem": "筛选技能教学视频时，哪些标准重要？",
    "options": [
      "与课程目标相关",
      "技能规范可靠",
      "字幕及可访问性良好",
      "点赞量越多必然越准确"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-086",
    "category": "教学应用情境",
    "type": "multi",
    "indicator": "4.2.3",
    "indicatorName": "资源制作",
    "level": "高级",
    "stem": "AI生成实训案例后应做哪些处理？",
    "options": [
      "核验技术参数与事实",
      "核查适用教材和标准",
      "检查版权隐私风险",
      "直接作为安全操作规程发布"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-087",
    "category": "教学应用情境",
    "type": "multi",
    "indicator": "4.2.4",
    "indicatorName": "教材开发",
    "level": "初级",
    "stem": "编制数字教材时应考虑什么？",
    "options": [
      "模块化组织与导航",
      "可访问性与兼容性",
      "版本审核和更新机制",
      "只允许一种终端访问"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-088",
    "category": "教学应用情境",
    "type": "multi",
    "indicator": "4.3.1",
    "indicatorName": "教学准备",
    "level": "中级",
    "stem": "虚拟仿真实训开课前，哪些事项必要？",
    "options": [
      "确认账号与终端",
      "测试操作流程",
      "准备技术故障备用方案",
      "忽略设备安全提醒"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-089",
    "category": "教学应用情境",
    "type": "multi",
    "indicator": "4.3.2",
    "indicatorName": "教学组织",
    "level": "高级",
    "stem": "组织跨校线上技能研讨，哪些策略有效？",
    "options": [
      "设置研讨角色",
      "明确共享产出",
      "形成讨论纪要与反馈",
      "只允许教师单向讲述"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-090",
    "category": "教学应用情境",
    "type": "multi",
    "indicator": "4.3.3",
    "indicatorName": "学习支持",
    "level": "初级",
    "stem": "学生自学进度落后，哪些做法合适？",
    "options": [
      "查看过程证据",
      "提供针对性辅导",
      "合理调整任务计划",
      "公开羞辱落后学生"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-091",
    "category": "教学应用情境",
    "type": "multi",
    "indicator": "4.4.1",
    "indicatorName": "数据采集",
    "level": "中级",
    "stem": "课堂数据采集应满足哪些要求？",
    "options": [
      "明确教学目的",
      "收集必要数据",
      "限制访问和保存期限",
      "无限制记录家庭隐私"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-092",
    "category": "教学应用情境",
    "type": "multi",
    "indicator": "4.4.2",
    "indicatorName": "分析研判",
    "level": "高级",
    "stem": "发现班级练习正确率下降，哪些分析合理？",
    "options": [
      "比较题目知识点分布",
      "核查难度和教学条件",
      "结合访谈与过程数据",
      "直接判定学生不用功"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-093",
    "category": "教学应用情境",
    "type": "multi",
    "indicator": "4.4.3",
    "indicatorName": "持续改进",
    "level": "初级",
    "stem": "技能考核表现不佳，哪些改进措施有价值？",
    "options": [
      "开展错误类型诊断",
      "针对薄弱点补训",
      "跟踪再次测评结果",
      "仅调高成绩掩盖问题"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-094",
    "category": "教学应用情境",
    "type": "multi",
    "indicator": "3.2.2",
    "indicatorName": "在线指导",
    "level": "中级",
    "stem": "学生线上实训系统无法登录，教师可采取？",
    "options": [
      "确认账号状态",
      "提供合规重置路径",
      "联系平台支持",
      "要求学生公开密码"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-095",
    "category": "教学应用情境",
    "type": "multi",
    "indicator": "3.2.3",
    "indicatorName": "跟踪反思",
    "level": "高级",
    "stem": "新平台在试点班效果一般，哪些反思措施合理？",
    "options": [
      "收集学生体验",
      "分析完成率与质量",
      "调整教学活动设计",
      "只看供应商宣传数据"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-096",
    "category": "教学应用情境",
    "type": "multi",
    "indicator": "5.2.1",
    "indicatorName": "供需对接",
    "level": "初级",
    "stem": "开发校企岗位能力图谱，哪些信息要对接？",
    "options": [
      "行业岗位与任务",
      "课程与能力指标",
      "企业评价证据",
      "只采用专业宣传文案"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-097",
    "category": "教学应用情境",
    "type": "multi",
    "indicator": "5.2.2",
    "indicatorName": "协同育人",
    "level": "中级",
    "stem": "校企协同开设项目课程，哪些措施必要？",
    "options": [
      "共定任务与成果标准",
      "明确企业导师职责",
      "建立反馈沟通机制",
      "忽略学生数据保护"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-098",
    "category": "教学应用情境",
    "type": "multi",
    "indicator": "5.2.3",
    "indicatorName": "社会服务",
    "level": "高级",
    "stem": "面向社会人员开设在线精品课，应考虑？",
    "options": [
      "灵活学习时间",
      "无障碍与移动端",
      "不同基础学习路径",
      "禁止学习进度反馈"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-099",
    "category": "教学应用情境",
    "type": "multi",
    "indicator": "5.3.1",
    "indicatorName": "科技创新",
    "level": "初级",
    "stem": "教师参与企业技术改进，合理工作包括？",
    "options": [
      "明确工艺问题与目标",
      "合规开展数据分析",
      "验证改进效果",
      "直接跳过安全验证"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-100",
    "category": "教学应用情境",
    "type": "multi",
    "indicator": "5.3.2",
    "indicatorName": "成果转化",
    "level": "中级",
    "stem": "教学科研成果转化项目，合理步骤包括？",
    "options": [
      "评估应用场景与价值",
      "检查知识产权归属",
      "开展试点与成果反馈",
      "未经授权公开企业资料"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-101",
    "category": "创新评价与改进",
    "type": "match",
    "indicator": "4.4.2",
    "indicatorName": "分析研判",
    "level": "初级",
    "stem": "学习数据中学生提交次数增加但正确率下降，应重点核验哪一关联？",
    "options": [
      "教师头像与课件色彩",
      "电脑品牌与教师职称",
      "教室朝向与打印数量",
      "提交频率与正确率趋势"
    ],
    "answer": 3,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-102",
    "category": "创新评价与改进",
    "type": "match",
    "indicator": "4.4.3",
    "indicatorName": "持续改进",
    "level": "中级",
    "stem": "补训后学生表现改善，最有效的证据是？",
    "options": [
      "相同能力目标的前后测对比",
      "课件页数增加",
      "签到界面颜色变化",
      "教师总发言时长"
    ],
    "answer": 0,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-103",
    "category": "创新评价与改进",
    "type": "match",
    "indicator": "4.1.2",
    "indicatorName": "方案制订",
    "level": "高级",
    "stem": "评价分层教学方案是否公平，应观察？",
    "options": [
      "只听部分学生意见",
      "不同基础群体的进步与参与",
      "只看高分学生的成绩",
      "仅统计资源数量"
    ],
    "answer": 1,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-104",
    "category": "创新评价与改进",
    "type": "match",
    "indicator": "4.1.3",
    "indicatorName": "模式运用",
    "level": "初级",
    "stem": "判断混合式教学效果，应组合哪些证据？",
    "options": [
      "只看课堂照片",
      "只看技术采购费用",
      "在线参与、实操表现与反馈",
      "只看在线时长"
    ],
    "answer": 2,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-105",
    "category": "创新评价与改进",
    "type": "match",
    "indicator": "3.2.3",
    "indicatorName": "跟踪反思",
    "level": "中级",
    "stem": "工具使用率高但学习收益不明显，应优先？",
    "options": [
      "增加弹窗数量",
      "延长全体在线时间",
      "停止分析数据",
      "检验活动是否支持教学目标"
    ],
    "answer": 3,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-106",
    "category": "创新评价与改进",
    "type": "match",
    "indicator": "5.1.1",
    "indicatorName": "数字职业",
    "level": "高级",
    "stem": "新数字职业出现时，课程更新的关键证据是？",
    "options": [
      "岗位任务与职业标准变化",
      "宣传海报数量",
      "教师办公面积",
      "软件图标颜色"
    ],
    "answer": 0,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-107",
    "category": "创新评价与改进",
    "type": "match",
    "indicator": "5.1.2",
    "indicatorName": "数字技能",
    "level": "初级",
    "stem": "判断数字技能证书是否真正有用，应核验？",
    "options": [
      "只看报名人数",
      "岗位适配性和实际能力证据",
      "证书封面设计",
      "发证速度越快越好"
    ],
    "answer": 1,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-108",
    "category": "创新评价与改进",
    "type": "match",
    "indicator": "5.2.1",
    "indicatorName": "供需对接",
    "level": "中级",
    "stem": "行业岗位变化使原专业课程滞后，应首先？",
    "options": [
      "删除所有评价标准",
      "暂停校企沟通",
      "更新岗位—能力—课程映射",
      "仅重命名课程"
    ],
    "answer": 2,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-109",
    "category": "创新评价与改进",
    "type": "match",
    "indicator": "5.2.2",
    "indicatorName": "协同育人",
    "level": "高级",
    "stem": "企业导师反映学生项目执行弱，应优先？",
    "options": [
      "只更换课程封面",
      "只要求增加签到",
      "忽略反馈",
      "分析任务证据并联合调整训练"
    ],
    "answer": 3,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-110",
    "category": "创新评价与改进",
    "type": "match",
    "indicator": "5.2.3",
    "indicatorName": "社会服务",
    "level": "初级",
    "stem": "社会培训学员完成率低，优先诊断？",
    "options": [
      "设备可及性、时间安排与内容难度",
      "网页主题色",
      "教师姓名字数",
      "证书纸张大小"
    ],
    "answer": 0,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-111",
    "category": "创新评价与改进",
    "type": "match",
    "indicator": "5.3.1",
    "indicatorName": "科技创新",
    "level": "中级",
    "stem": "工艺改进试点完成后应重点验证？",
    "options": [
      "只展示技术概念",
      "质量、效率、安全与成本指标",
      "仅看汇报PPT页数",
      "只听供应商口头赞扬"
    ],
    "answer": 1,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-112",
    "category": "创新评价与改进",
    "type": "match",
    "indicator": "5.3.2",
    "indicatorName": "成果转化",
    "level": "高级",
    "stem": "科研成果进入应用试点前应优先明确？",
    "options": [
      "仅考虑传播速度",
      "取消验证流程",
      "技术成熟度、许可与责任边界",
      "是否有好看的Logo"
    ],
    "answer": 2,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-113",
    "category": "创新评价与改进",
    "type": "match",
    "indicator": "4.2.2",
    "indicatorName": "资源甄选",
    "level": "初级",
    "stem": "两个资源内容矛盾时，教师应优先？",
    "options": [
      "选浏览量最高的",
      "任选一份不说明",
      "只看封面",
      "核查权威标准、来源与更新时间"
    ],
    "answer": 3,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-114",
    "category": "创新评价与改进",
    "type": "match",
    "indicator": "4.2.3",
    "indicatorName": "资源制作",
    "level": "中级",
    "stem": "AI生成课程实验数据时最应强调？",
    "options": [
      "明确合成标识且不得伪造实测证据",
      "直接称作真实实验结果",
      "删除数据来源说明",
      "只保留好看的曲线"
    ],
    "answer": 0,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-115",
    "category": "创新评价与改进",
    "type": "match",
    "indicator": "4.4.1",
    "indicatorName": "数据采集",
    "level": "高级",
    "stem": "评价数据出现大量缺失时，应先？",
    "options": [
      "默认为学习失败",
      "检查采集机制并说明缺失限制",
      "直接用零分填充",
      "不经核查删除学生"
    ],
    "answer": 1,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-116",
    "category": "创新评价与改进",
    "type": "match",
    "indicator": "4.4.2",
    "indicatorName": "分析研判",
    "level": "初级",
    "stem": "两个班成绩差异可能受什么影响？",
    "options": [
      "只有课件页数",
      "只有会议次数",
      "起点差异、样本规模及教学条件",
      "只有平台品牌"
    ],
    "answer": 2,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-117",
    "category": "创新评价与改进",
    "type": "match",
    "indicator": "4.4.3",
    "indicatorName": "持续改进",
    "level": "中级",
    "stem": "实施教学改进的闭环顺序应为？",
    "options": [
      "发布成绩—结束",
      "采购设备—结束",
      "打分—删除记录",
      "诊断问题—制定策略—实施—复核"
    ],
    "answer": 3,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-118",
    "category": "创新评价与改进",
    "type": "match",
    "indicator": "3.1.2",
    "indicatorName": "团队合作",
    "level": "高级",
    "stem": "跨学科教研共创资源的质量保障机制应？",
    "options": [
      "版本审阅、责任分工与共同验收",
      "全部匿名覆盖",
      "取消审核",
      "只由一人决定且不反馈"
    ],
    "answer": 0,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-119",
    "category": "创新评价与改进",
    "type": "match",
    "indicator": "2.1.1",
    "indicatorName": "伦理道德",
    "level": "初级",
    "stem": "学校准备扩大AI自动评分时，需要优先建立？",
    "options": [
      "只展示AI总分",
      "人工复核、申诉与偏差监测机制",
      "直接取消教师审批",
      "禁止学生质疑"
    ],
    "answer": 1,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  },
  {
    "id": "QS-120",
    "category": "创新评价与改进",
    "type": "match",
    "indicator": "1.2.2",
    "indicatorName": "变革意愿",
    "level": "中级",
    "stem": "教师推动创新试点的合理策略是？",
    "options": [
      "拒绝反馈",
      "只看演示视频",
      "小范围验证、收集证据并迭代",
      "未测试直接全校强制上线"
    ],
    "answer": 2,
    "explain": "按课程目标、规范操作及证据可核查原则判断。"
  }
];
const IND={
  "1.1.1": {
    "name": "基础知识",
    "desc": "能够掌握有关数字化、智能化的基本知识及常用术语，通过自主学习或参加培训及时了解数字化、智能化技术发展现状和趋势。"
  },
  "1.1.2": {
    "name": "常规操作",
    "desc": "能够掌握常见的数字化、智能化通用工具的应用操作技能，正确使用有关硬件设备。"
  },
  "1.2.1": {
    "name": "价值理解",
    "desc": "能够认识数字化、智能化技术在促进教育公平、增强教育包容性的重要价值，以及在传承劳模精神、劳动精神、工匠精神、科学精神、红色文化和优秀传统文化的重要作用。"
  },
  "1.2.2": {
    "name": "变革意愿",
    "desc": "能够接受教育数智化对教育教学带来的变化，具有主动应用数字化、智能化技术进行教学改革创新的意愿；建立教育数智化思维方式，具备迎接挑战、克服困难的信心与毅力。"
  },
  "2.1.1": {
    "name": "伦理道德",
    "desc": "能够认识教师在教育数智化发展中的关键角色、主要责任和权利义务，自觉践行教育数智化伦理道德要求。"
  },
  "2.1.2": {
    "name": "行为规范",
    "desc": "能够遵守《文明上网自律公约》和相关法律法规，示范和指导学生合法合规、安全负责地使用数字化、智能化产品和服务，自觉保护知识产权和数据隐私。"
  },
  "2.2.1": {
    "name": "安全意识",
    "desc": "能够树立网络主权意识、网络法制意识、意识形态安全意识、个人信息安全意识；掌握网络安全的基本原则、风险防范和数据保护知识；认识网络对人的心理活动的影响，能自我调节心理状态。"
  },
  "2.2.2": {
    "name": "防护能力",
    "desc": "能够采取必要措施防范网络受到攻击、侵入、干扰、破坏和被非法使用，使网络处于稳定可靠运行状态，保障网络数据的完整性、保密性、可用性。"
  },
  "3.1.1": {
    "name": "与人沟通",
    "desc": "能够利用常用数字化、智能化技术工具，在专业学习社区中与他人交流信息、分享观点，开展有效沟通。"
  },
  "3.1.2": {
    "name": "团队合作",
    "desc": "能够参与线上研讨、教研活动，参加数字课程或人工智能课程的备课或讲授；能在数字化学习、研究等共同体中完成工作任务、开展团队协作。"
  },
  "3.2.1": {
    "name": "平台选用",
    "desc": "能够选择网络教学平台及其他教学应用软件，指导学生完成平台安装、注册、登录等在线学习准备，解决在平台选用中遇到的技术问题。"
  },
  "3.2.2": {
    "name": "在线指导",
    "desc": "能够指导学生制定在线学习计划，使用数字教学资源，解决各类在线学习问题；在职责范围内解决学生在学习、实习、科研、创业、就业等方面的问题，建立教育教学问题台账。"
  },
  "3.2.3": {
    "name": "跟踪反思",
    "desc": "能够跟踪教育数智化平台、工具的应用情况，反思应用中存在的问题，及时进行优化调整。"
  },
  "4.1.1": {
    "name": "目标确定",
    "desc": "能够落实立德树人根本任务，运用教育目标分类法或职业教育目标分类法设计教学目标，确定教学标准，并应用知识图谱、能力图谱、思维导图等方式予以呈现。"
  },
  "4.1.2": {
    "name": "方案制订",
    "desc": "能够运用教育数智化工具进行学情分析，了解学生需求差异，设计分众化、个性化教学方案；在方案中体现大中小学思政教育一体建设、知识体系连贯构筑、技术技能持续提升、职前职后接续培养、职教普教纵横相通等理念。"
  },
  "4.1.3": {
    "name": "模式运用",
    "desc": "能够依据教学目标选择数字化、智能化教学模式，如线上线下混合式教学、翻转课堂、虚拟仿真、数字人辅助教学等，设计数智化教学技术路线；能够在教学实践中推陈出新，探索建立个性化的数智教学模式。"
  },
  "4.2.1": {
    "name": "资源转化",
    "desc": "能够根据教学需要搜集线上数字资源，转换数据格式，建立储存本地或云端的多模态、专业化教学“资源池”。"
  },
  "4.2.2": {
    "name": "资源甄选",
    "desc": "能够使用国家智慧教育公共服务平台、职业教育专业教学资源库等国内外资源库或信息平台，从中甄别选取优质的在线教学资源，纳入教学计划、融入课程教学、列入学习菜单。"
  },
  "4.2.3": {
    "name": "资源制作",
    "desc": "能够制作符合教学目标要求的课件、图表、动画、视频、虚拟仿真等教学资源；能使用生成式人工智能软件准备教学资料，辅助编制教案（大纲）；建设在线考试测评题库，制作电子试卷。"
  },
  "4.2.4": {
    "name": "教材开发",
    "desc": "能够依据教学目标整合相关数字资源，开发数字教材；在数字教材开发中落实思政课程、课程思政、网络思政等要求，促进思政教育、通识教育、专业教育深度融合。"
  },
  "4.3.1": {
    "name": "教学准备",
    "desc": "能够以教学目标和计划为依据，进行真实的、虚拟的或混合式的教学环境准备，包括且不限于教学平台、教学软件、多媒体教室或其他数字化教学环境的准备工作；与授课对象进行沟通，安排课前课后学习任务等。"
  },
  "4.3.2": {
    "name": "教学组织",
    "desc": "能够运用选定的数字化、智能化教学模式开展理论教学或实践教学（包括实验、实习、实训）；能够组织在线学习、在线讨论、在线考评，确保信度、效度与公平。"
  },
  "4.3.3": {
    "name": "学习支持",
    "desc": "能够指导和组织学生在课内外利用数字化、智能化技术工具开展自主学习，指导学生自主管理学习进度，在线监测学生自主学习情况，将自主学习纳入教学计划、成果纳入考评范围。"
  },
  "4.4.1": {
    "name": "数据采集",
    "desc": "能够合理选择与使用平台或数字化测评工具采集教学过程中形成的多模态行为数据，并进行分类、储存和管理。"
  },
  "4.4.2": {
    "name": "分析研判",
    "desc": "能够选择和应用数据分析模型开展教学数据分析评价，对学生学习行为、教师教学行为、课程目标达成度等进行研判、解读，可视化呈现教学进程中的学生画像、教师画像和课程画像。"
  },
  "4.4.3": {
    "name": "持续改进",
    "desc": "能够在分析研判基础上对学生进行个性化反馈和指导；能够及时优化调整教学内容、方案和环境等，解决教学问题，更新教学理念，改进教学方法，保障教学目标达成。"
  },
  "5.1.1": {
    "name": "数字职业",
    "desc": "能够了解本专业相关行业数智化发展趋势，及时将相关数字职业标准转化为专业教学标准、课程标准；能够基于数字化工作岗位开展教学，创新育人方式。"
  },
  "5.1.2": {
    "name": "数字技能",
    "desc": "能够了解本专业相关行业对数字技能的具体要求，将专业化软件或平台的应用能力纳入培养目标、数字技能证书纳入教学评价；培养学生在生产或工作现场的数据信息、系统应用、过程控制及解决问题等相关能力。"
  },
  "5.2.1": {
    "name": "供需对接",
    "desc": "能够借助数字工具绘制专业对接产业的谱系图，反映专业（群）、课程与行业企业用人结构、岗位要求的逻辑关系；能结合专业开展就业创业教育，鼓励和支持学生在数字化工作岗位就业。"
  },
  "5.2.2": {
    "name": "协同育人",
    "desc": "能够使用数字化、智能化技术或平台与企业共同开发课程、合作教学，能够与企业导师、学生家长等进行常态化沟通，促进家、校、社会协同育人。"
  },
  "5.2.3": {
    "name": "社会服务",
    "desc": "能够通过大型开放式课程、在线精品课、公开课等扩大优质教育资源覆盖面；能够发挥教育数智化优势，针对社会人群的不同需求开展职业培训、职业指导等在线服务；能够参与行业新标准、职业新标准、专业新标准研发。"
  },
  "5.3.1": {
    "name": "科技创新",
    "desc": "能够承接企业技术或工艺改进、生产流程优化再造、新产品新型号论证研发和中试服务等；应用数字化、智能化技术在行业数据分析、生产或科研过程仿真、“大模型”应用等方面解决实际问题，融入行业企业创新生态。"
  },
  "5.3.2": {
    "name": "成果转化",
    "desc": "能够运用数字化、智能化工具调查科技成果的市场前景，实施专利申请保护，推动科技成果转化和产业化；促进科研反哺教学，探索将科技创新成果转化为教学资源，更新课程内容，提高学生的数字技能和创新应用能力。"
  }
};
const CATS=[["基础认知", "single"], ["伦理安全", "single"], ["数字工具操作", "config"], ["教学硬件排障", "order"], ["教学应用情境", "multi"], ["创新评价与改进", "match"]];
