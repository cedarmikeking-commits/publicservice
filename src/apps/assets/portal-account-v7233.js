(() => {
  "use strict";
  const KEY = "mveri_portal_profile_v7233_";
  const read = (account) => {
    try {
      return JSON.parse(localStorage.getItem(KEY + account) || "{}") || {};
    } catch {
      return {};
    }
  };
  const sess = () => {
    try {
      return JSON.parse(sessionStorage.getItem("mveri_offline_session_v3") || "null");
    } catch {
      return null;
    }
  };
  const name = (account, fallback) => read(account).name || fallback || "用户";
  const escapeHtml = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
  const getPasswords = () => {
    try {
      return JSON.parse(localStorage.getItem("mveriDemoPasswords") || "{}") || {};
    } catch {
      return {};
    }
  };
  window.MVERI_PORTAL_ACCOUNT = { displayName: name };
  function setOpen(open) {
    const p = document.getElementById("portalAccountPopover"),
      t = document.querySelector("[data-portal-account-toggle]");
    if (p) p.hidden = !open;
    if (t) t.setAttribute("aria-expanded", String(open));
  }
  function closeDialog() {
    document.getElementById("portalAccountShade")?.remove();
  }
  function dialog(title, inner, onSave) {
    closeDialog();
    setOpen(false);
    const shade = document.createElement("div");
    shade.id = "portalAccountShade";
    shade.className = "portal-account-shade";
    shade.innerHTML = `<div class="portal-account-dialog" role="dialog" aria-modal="true" aria-labelledby="portalAccountDialogTitle"><div class="portal-account-dialog-head"><h2 id="portalAccountDialogTitle">${escapeHtml(title)}</h2><button type="button" data-close-account-dialog aria-label="关闭">×</button></div><form id="portalAccountForm">${inner}<div class="portal-account-error" id="portalAccountError" role="alert" hidden></div><div class="portal-account-actions"><button type="button" class="portal-secondary" data-close-account-dialog>取消</button><button type="submit" class="portal-primary">保存</button></div></form></div>`;
    document.body.appendChild(shade);
    shade.addEventListener("click", (e) => {
      if (e.target === shade || e.target.closest("[data-close-account-dialog]")) closeDialog();
    });
    shade.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();
      try {
        onSave(new FormData(e.target));
        closeDialog();
      } catch (err) {
        const error = shade.querySelector("#portalAccountError");
        error.textContent = err.message || "保存失败";
        error.hidden = false;
      }
    });
    shade.querySelector("input:not([disabled])")?.focus();
  }
  function profile() {
    const s = sess();
    if (!s) return;
    const p = read(s.account);
    dialog(
      "个人设置",
      `<p class="portal-muted">当前为离线体验，个人资料仅保存在此浏览器。</p><label>显示名称<input name="name" maxlength="32" minlength="2" required value="${escapeHtml(name(s.account, document.querySelector(".portal-account-label")?.textContent || "机构管理员"))}"></label><label>登录账号<input value="${escapeHtml(s.account)}" disabled></label><label>界面偏好<select name="density"><option value="normal" ${p.density !== "compact" ? "selected" : ""}>标准间距</option><option value="compact" ${p.density === "compact" ? "selected" : ""}>紧凑间距</option></select></label>`,
      (data) => {
        const v = String(data.get("name") || "").trim();
        if (v.length < 2 || v.length > 32) throw Error("显示名称应为2至32个字符");
        const density = data.get("density") === "compact" ? "compact" : "normal";
        localStorage.setItem(KEY + s.account, JSON.stringify({ name: v, density }));
        document
          .querySelectorAll(".portal-account-label,.portal-account-identity strong")
          .forEach((el) => (el.textContent = v));
        document.body.classList.toggle("portal-density-compact", density === "compact");
      },
    );
  }
  function password() {
    const s = sess();
    if (!s) return;
    dialog(
      "修改密码",
      `<p class="portal-muted">修改当前账号 <strong>${escapeHtml(s.account)}</strong> 的本机演示密码。</p><label>原密码<input name="old" type="password" autocomplete="current-password" required></label><label>新密码<input name="new" type="password" autocomplete="new-password" minlength="8" required placeholder="至少8位"></label><label>确认新密码<input name="confirm" type="password" autocomplete="new-password" minlength="8" required></label><p class="portal-muted">演示密码保存在当前浏览器，不能代替生产环境的服务器认证。</p>`,
      (data) => {
        const values = getPasswords(),
          old = String(data.get("old") || ""),
          next = String(data.get("new") || ""),
          confirm = String(data.get("confirm") || "");
        let initial = "123456";
        try {
          const schools = window.MVERI_SCHOOL_LICENSE?.get()?.users || [];
          initial = schools.find((x) => x.account === s.account)?.password || initial;
          const all = window.MVERI_USERS?.get()?.users || [];
          initial = all.find((x) => x.account === s.account)?.password || initial;
        } catch {}
        if (old !== (values[s.account] || initial)) throw Error("原密码不正确");
        if (next.length < 8) throw Error("新密码至少8位");
        if (next !== confirm) throw Error("两次输入的新密码不一致");
        if (next === old) throw Error("新密码不能与原密码相同");
        values[s.account] = next;
        localStorage.setItem("mveriDemoPasswords", JSON.stringify(values));
        alert("密码已修改，下次登录需要使用新密码。");
      },
    );
  }
  document.addEventListener("click", (e) => {
    const toggle = e.target.closest("[data-portal-account-toggle]");
    if (toggle) {
      e.stopPropagation();
      setOpen(document.getElementById("portalAccountPopover")?.hidden === true);
      return;
    }
    const act = e.target.closest("[data-portal-account-action]");
    if (act) {
      const type = act.dataset.portalAccountAction;
      setOpen(false);
      if (type === "profile") profile();
      else if (type === "password") password();
      else if (type === "home") location.href = "../site/index.html";
      else if (type === "logout") {
        sessionStorage.removeItem("mveri_offline_session_v3");
        location.href = "../auth/access.html";
      }
      return;
    }
    if (!e.target.closest("#portalAccountMenu")) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      setOpen(false);
      closeDialog();
    }
  });
  const s = sess();
  if (s && read(s.account).density === "compact") document.body.classList.add("portal-density-compact");
})();
