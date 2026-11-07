/* WBZY V19.6 — shared offline interaction engine, used in both administration and learner experience. */
(function () {
  "use strict";
  const safe = (x) =>
    String(x ?? "").replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
  const special = new Set(["device", "hotspot", "spreadsheet", "practice"]);
  const demo = {
    device: {
      id: "WBZY-DEMO-07",
      type: "device",
      stem: "模拟会议室投影设备无法显示画面的故障排查，完成供电、连接、信号源和画面验证。",
    },
    hotspot: { id: "WBZY-DEMO-17", type: "hotspot", stem: "在模拟的邮件页面中识别具有风险的区域。" },
    spreadsheet: {
      id: "WBZY-DEMO-08",
      type: "spreadsheet",
      stem: "某课程报名120人、完成96人，请在电子表格内计算完成率。",
    },
    practice: {
      id: "WBZY-DEMO-06",
      type: "practice",
      stem: "模拟处理用户账号被锁定的工单，完成身份核验、故障诊断、处理及回访。",
    },
  };
  const css = `.wi-root{font-family:inherit;color:#1f414c}.wi-info{font-size:12px;color:#56747c;padding:9px 12px;background:#f1f8f8;border-radius:8px;margin-bottom:12px}.wi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(195px,1fr));gap:12px}.wi-box{border:1px solid #dce9e9;border-radius:12px;padding:14px;background:#fff}.wi-box strong{display:block;margin-bottom:8px}.wi-root select,.wi-root input,.wi-root textarea{border:1px solid #bfd5d9;border-radius:8px;padding:9px;width:100%;font:inherit;color:#24444b;background:#fff;box-sizing:border-box}.wi-root button{cursor:pointer;border:1px solid #90c2bb;border-radius:8px;background:#eaf6f3;color:#0b776a;padding:8px 12px;font:inherit}.wi-root button:disabled{opacity:.45;cursor:not-allowed}.wi-status{padding:11px;border-radius:8px;background:#edf6f5;line-height:1.7;margin-top:12px}.wi-screen{background:#183441;color:#fff;border-radius:12px;padding:24px;min-height:105px;display:grid;place-items:center;text-align:center}.wi-target{position:relative;width:100%;max-width:760px;margin:auto;border-radius:12px;overflow:hidden;border:1px solid #d5e6e7;background:#fff}.wi-target svg{display:block;width:100%;height:auto}.wi-target button{position:absolute;background:transparent;border:2px solid transparent;border-radius:6px;color:transparent;padding:0}.wi-target button:hover,.wi-target button:focus{border-color:#009c87;background:#16a38f20;color:#00685c}.wi-target button.wi-marked{border:3px solid #c86a14;background:#ffa5002d;color:#71420b}.wi-sheet{border-collapse:collapse;width:100%;font-size:14px}.wi-sheet th,.wi-sheet td{border:1px solid #cedde0;padding:9px;min-width:70px;text-align:center}.wi-sheet th{background:#e6f2f2}.wi-sheet .wi-entry{background:#fffde8}.wi-sheet input{min-width:90px}.wi-step{display:flex;gap:8px;align-items:center;padding:11px;border:1px solid #dce9e9;border-radius:10px;margin:8px 0}.wi-step span{flex:1}.wi-step b{border-radius:50%;background:#d7eee8;padding:6px 10px}.wi-mini{font-size:12px;color:#657e88}.wi-response{margin-top:12px;padding:12px;border-radius:9px;background:#edf8f2;border:1px solid #bde2d0}.wi-response.warn{background:#fff6e8;border-color:#e6c796}@media(max-width:600px){.wi-step{flex-wrap:wrap}.wi-grid{grid-template-columns:1fr}.wi-root{font-size:14px}}`;
  function scene(q) {
    const t = q.type;
    return (
      q.id === demo[t]?.id ||
      (!q.interaction?.device && !q.interaction?.regions && !q.interaction?.cells && !q.interaction?.steps)
    );
  }
  function mount(host, q) {
    if (typeof host === "string") host = document.querySelector(host);
    if (!host) return null;
    const t = q.type;
    if (!special.has(t)) return null;
    let state = {},
      finished = false;
    const sample = scene(q),
      startHTML =
        '<div class="wi-info">' +
        (sample
          ? "交互演练场景：本题未提供专用结构化素材，使用内置模拟环境；仅验证操作流程，不代表该题已完成专属素材配置。"
          : "按试题配置的交互素材操作。") +
        "</div>";
    let html = startHTML;
    if (t === "device")
      html += `<div class="wi-grid"><div class="wi-box"><strong>电脑与投影设备</strong><label>设备供电<select data-f="power"><option value="">请选择</option><option value="off">未通电</option><option value="on">已通电</option></select></label><label>视频线缆<select data-f="cable"><option value="">请选择</option><option value="loose">未连接</option><option value="hdmi">HDMI 已连接</option></select></label><label>投影信号源<select data-f="source"><option value="">请选择</option><option value="vga">VGA</option><option value="hdmi">HDMI</option></select></label><button data-do="verify">检查画面</button></div><div class="wi-box"><strong>投影画面（模拟）</strong><div class="wi-screen" data-screen>⚠ 无信号</div><div class="wi-mini">验证应在调整连接和信号源后进行。</div></div></div>`;
    if (t === "hotspot")
      html += `<div class="wi-box"><strong>邮件页面风险识别（模拟示意图）</strong><p class="wi-mini">点击可疑的位置进行标注；再次点击可取消。黄色边框表示已标记。</p><div class="wi-target"><svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" aria-label="模拟邮件页面"><rect width="760" height="340" fill="#f8fbfc"/><rect x="18" y="17" width="724" height="306" rx="10" fill="white" stroke="#cbdfe3"/><rect x="18" y="17" width="724" height="48" rx="10" fill="#e5f1f3"/><text x="38" y="46" font-size="18" fill="#254a53">邮箱 · 收件详情</text><text x="38" y="101" font-size="17" fill="#273e4a">主题：账户异常，请立即核验</text><text x="38" y="144" font-size="15" fill="#3f5762">发件人：service@security-verify.example</text><text x="38" y="186" font-size="16" fill="#273e4a">您的账户将于2小时内停用，请立即登录验证。</text><rect x="38" y="215" rx="7" width="295" height="45" fill="#dff1ed"/><text x="52" y="243" font-size="16" fill="#0a7469">https://verify-login.example</text><text x="38" y="298" font-size="13" fill="#74868c">此页面为完全离线的虚构邮件样例，不包含真实外链。</text></svg><button data-region="sender" style="left:4%;top:36%;width:58%;height:11%" aria-label="标注发件人">发件人</button><button data-region="urgency" style="left:4%;top:49%;width:84%;height:12%" aria-label="标注紧急催促">紧急措辞</button><button data-region="link" style="left:4%;top:63%;width:40%;height:15%" aria-label="标注可疑链接">可疑链接</button></div><p data-marked class="wi-status">已标注 0 处</p></div>`;
    if (t === "spreadsheet")
      html += `<div class="wi-box"><strong>电子表格计算台（离线公式模拟）</strong><table class="wi-sheet"><thead><tr><th>行</th><th>A · 指标</th><th>B · 人数/计算</th></tr></thead><tbody><tr><th>2</th><td>报名人数</td><td>120</td></tr><tr><th>3</th><td>完成人数</td><td>96</td></tr><tr><th>4</th><td>完成率</td><td class="wi-entry"><input data-f="formula" placeholder="=B3/B2" aria-label="完成率公式"></td></tr></tbody></table><p>请选择显示格式：<select data-f="format"><option value="decimal">小数</option><option value="percent">百分比</option></select></p><button data-do="calculate">运行公式</button><p data-calc class="wi-status">等待计算</p><p class="wi-mini">支持 =B3/B2、=96/120 等四则运算表达式；不执行任意 JavaScript。</p></div>`;
    if (t === "practice")
      html += `<div class="wi-box"><strong>账号锁定工单 · 流程操作台</strong><div data-steps></div><label>身份核验依据<select data-f="identity"><option value="">请选择</option><option value="verified">已核对员工编号与授权方式</option><option value="unverified">未经核对直接解锁</option></select></label><label>排查结论<select data-f="diagnosis"><option value="">请选择</option><option value="lock">连续失败触发锁定</option><option value="unknown">未排查原因</option></select></label><label>处置方案<select data-f="resolution"><option value="">请选择</option><option value="safe">按照授权流程解锁并建议改密</option><option value="unsafe">直接共享管理员密码</option></select></label><label>回访与证据<textarea data-f="evidence" rows="2" placeholder="记录回访结果与工单处理证据"></textarea></label></div>`;
    host.innerHTML =
      '<div class="wi-root"><style>' +
      css +
      "</style>" +
      html +
      '<div class="wi-response" data-result hidden></div></div>';
    const root = host.querySelector(".wi-root"),
      inputs = () => {
        root.querySelectorAll("[data-f]").forEach((el) => (state[el.dataset.f] = el.value));
      };
    if (t === "practice") {
      const names = ["身份核验", "故障原因排查", "安全处置", "结果回访"],
        steps = q.interaction?.steps?.length === 4 ? q.interaction.steps : names;
      state.order = [2, 0, 3, 1];
      const draw = () => {
        root.querySelector("[data-steps]").innerHTML = state.order
          .map(
            (v, i) =>
              `<div class="wi-step"><b>${i + 1}</b><span>${safe(steps[v])}</span><button data-move="${i}:-1" ${i === 0 ? "disabled" : ""} aria-label="上移">↑</button><button data-move="${i}:1" ${i === 3 ? "disabled" : ""} aria-label="下移">↓</button></div>`,
          )
          .join("");
      };
      draw();
    }
    root.addEventListener("input", inputs);
    root.addEventListener("change", inputs);
    root.addEventListener("click", (e) => {
      const region = e.target.closest("[data-region]");
      if (region) {
        region.classList.toggle("wi-marked");
        state.regions = [...root.querySelectorAll(".wi-marked[data-region]")].map((el) => el.dataset.region);
        root.querySelector("[data-marked]").textContent =
          "已标注 " + state.regions.length + " 处：" + state.regions.join("、");
      }
      const moving = e.target.closest("[data-move]");
      if (moving) {
        let [i, d] = moving.dataset.move.split(":").map(Number),
          j = i + d;
        [state.order[i], state.order[j]] = [state.order[j], state.order[i]];
        const box = root.querySelector("[data-steps]");
        box.innerHTML = state.order
          .map(
            (v, k) =>
              `<div class="wi-step"><b>${k + 1}</b><span>${safe((q.interaction?.steps?.length === 4 ? q.interaction.steps : ["身份核验", "故障原因排查", "安全处置", "结果回访"])[v])}</span><button data-move="${k}:-1" ${k === 0 ? "disabled" : ""}>↑</button><button data-move="${k}:1" ${k === 3 ? "disabled" : ""}>↓</button></div>`,
          )
          .join("");
      }
      if (e.target.closest('[data-do="verify"]')) {
        inputs();
        let ok = state.power === "on" && state.cable === "hdmi" && state.source === "hdmi";
        state.verified = ok;
        root.querySelector("[data-screen]").textContent = ok ? "✓ 投影画面正常" : "⚠ 供电／线缆／信号源尚未正确配置";
        root.querySelector("[data-screen]").style.background = ok ? "#176b5a" : "#183441";
      }
      if (e.target.closest('[data-do="calculate"]')) {
        inputs();
        const value = calculate(state.formula);
        state.value = value;
        root.querySelector("[data-calc]").textContent =
          value === null
            ? "公式不支持或输入错误"
            : "计算结果：" + (state.format === "percent" ? (value * 100).toFixed(2) + "%" : String(+value.toFixed(6)));
      }
    });
    return {
      root,
      getAnswer() {
        inputs();
        return JSON.parse(JSON.stringify(state));
      },
      reset() {
        return mount(host, q);
      },
      submit() {
        const ans = this.getAnswer();
        const result = evaluate(q, ans);
        let box = root.querySelector("[data-result]");
        box.hidden = false;
        box.classList.toggle("warn", result.status === "manual" || result.score < 100);
        box.innerHTML =
          "<strong>" +
          safe(result.title) +
          "</strong><p>" +
          safe(result.details) +
          '</p><p class="wi-mini">离线互动仅为训练反馈；需要人工审核的证据不自动计入正式成绩。</p>';
        return result;
      },
    };
  }
  function calculate(formula) {
    let f = String(formula || "")
      .trim()
      .toUpperCase();
    if (!f.startsWith("=")) return null;
    f = f
      .slice(1)
      .replace(/\bB2\b/g, "120")
      .replace(/\bB3\b/g, "96");
    if (!/^[0-9\s.+*/()-]+$/.test(f)) return null;
    let tokens = f.match(/(?:\d*\.\d+|\d+|[()+*/-])/g) || [];
    if (tokens.join("") !== f.replace(/\s+/g, "")) return null;
    let pos = 0;
    function factor() {
      const t = tokens[pos++];
      if (t === "(") {
        let n = expr();
        if (tokens[pos++] !== ")") throw Error();
        return n;
      }
      if (t === "-") return -factor();
      if (t === "+") return factor();
      if (!/^\d+(?:\.\d+)?$/.test(t || "")) throw Error();
      return Number(t);
    }
    function term() {
      let n = factor();
      while (["*", "/"].includes(tokens[pos])) {
        let op = tokens[pos++],
          b = factor();
        n = op === "*" ? n * b : n / b;
      }
      return n;
    }
    function expr() {
      let n = term();
      while (["+", "-"].includes(tokens[pos])) {
        let op = tokens[pos++],
          b = term();
        n = op === "+" ? n + b : n - b;
      }
      return n;
    }
    try {
      let value = expr();
      return pos === tokens.length && Number.isFinite(value) ? value : null;
    } catch {
      return null;
    }
  }
  function evaluate(q, a) {
    if (q.type === "device") {
      let ok = a.power === "on" && a.cable === "hdmi" && a.source === "hdmi" && a.verified;
      return {
        score: ok ? 100 : 0,
        status: "demo",
        title: ok ? "模拟设备联调完成" : "模拟设备联调未完成",
        details: ok ? "供电、连接、信号源与画面验证完成。" : "请核实电源、HDMI 线缆、信号源，并点击检查画面。",
      };
    }
    if (q.type === "hotspot") {
      let marked = a.regions || [],
        target = ["sender", "urgency", "link"];
      let hits = target.filter((t) => marked.includes(t)).length;
      return {
        score: Math.round((hits / 3) * 100),
        status: "demo",
        title: "已标注 " + hits + "/3 处风险提示",
        details: "参考关注点：可疑发件人、紧急施压措辞、不可信核验链接。实际页面需要配置对应的图片热点数据。",
      };
    }
    if (q.type === "spreadsheet") {
      let ok = Math.abs((a.value ?? -10) - 0.8) < 0.000001 && a.format === "percent";
      return {
        score: ok ? 100 : 0,
        status: "demo",
        title: ok ? "计算及格式正确" : "请检查公式及百分比格式",
        details: "示例数据 96÷120 = 80%；可输入 =B3/B2，格式选择“百分比”。",
      };
    }
    if (q.type === "practice") {
      let ordered = (a.order || []).every((v, i) => v === i),
        safe = a.identity === "verified" && a.diagnosis === "lock" && a.resolution === "safe",
        evidence = String(a.evidence || "").trim();
      return {
        score: null,
        status: "manual",
        title: "工单流程操作记录已提交",
        details:
          "步骤顺序：" +
          (ordered ? "符合示例" : "待调整") +
          "；关键操作：" +
          (safe ? "符合示例" : "需核验") +
          "；回访记录：" +
          (evidence ? "已填写" : "缺失") +
          "。文字证据的真实性与质量必须人工审核。",
      };
    }
    return { score: null, status: "manual", title: "提交成功", details: "需要人工复核。" };
  }
  window.WBZY_INTERACTIVE = { mount, evaluate, demo, types: [...special] };
})();
