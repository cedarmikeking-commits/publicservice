/* 考评点列表更多操作菜单：适用于教师和通用两个体系 */
(function () {
  let menu = null,
    trigger = null,
    items = [];
  function close() {
    if (menu) {
      menu.remove();
      menu = null;
    }
    if (trigger) {
      trigger.setAttribute("aria-expanded", "false");
      trigger = null;
    }
  }
  function position() {
    if (!menu || !trigger || !trigger.isConnected) {
      close();
      return;
    }
    const r = trigger.getBoundingClientRect();
    let x = Math.max(8, Math.min(window.innerWidth - menu.offsetWidth - 8, r.right - menu.offsetWidth));
    let y = r.bottom + 5;
    if (y + menu.offsetHeight > window.innerHeight - 8) y = r.top - menu.offsetHeight - 5;
    menu.style.left = x + "px";
    menu.style.top = Math.max(8, y) + "px";
  }
  window.WBZYPointMenu = {
    open(e, actions) {
      e.preventDefault();
      e.stopPropagation();
      const btn = e.currentTarget;
      if (trigger === btn) {
        close();
        return;
      }
      close();
      trigger = btn;
      items = actions;
      btn.setAttribute("aria-expanded", "true");
      menu = document.createElement("div");
      menu.className = "wbzy-point-menu";
      menu.setAttribute("role", "menu");
      actions.forEach((item, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("role", "menuitem");
        b.textContent = item.label;
        if (item.danger) b.classList.add("danger");
        b.addEventListener("click", (ev) => {
          ev.stopPropagation();
          close();
          item.action();
        });
        menu.appendChild(b);
      });
      document.body.appendChild(menu);
      position();
    },
  };
  document.addEventListener("pointerdown", (e) => {
    if (menu && !menu.contains(e.target) && e.target !== trigger) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
  document.addEventListener("scroll", close, true);
  window.addEventListener("resize", close);
})();
