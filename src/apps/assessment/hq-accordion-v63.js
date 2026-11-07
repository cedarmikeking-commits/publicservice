(() => {
  "use strict";
  function start() {
    const menu = document.getElementById("hq52menu");
    if (!menu || menu.dataset.v63Prepared) return;
    menu.dataset.v63Prepared = "1";
    [...menu.querySelectorAll(".hq52-group")].forEach((g, i) => {
      const label = g.querySelector(".hq52-label");
      if (!label) return;
      const name = label.textContent.trim();
      g.dataset.group = name;
      const panel = document.createElement("div");
      panel.className = "hq56-panel";
      panel.id = "hq63panel" + i;
      for (const a of [...g.querySelectorAll(":scope > a")]) panel.appendChild(a);
      const b = document.createElement("button");
      b.className = "hq56-trigger";
      b.type = "button";
      b.setAttribute("aria-controls", panel.id);
      b.innerHTML =
        '<span class="hq65-group-icon" aria-hidden="true"></span><span class="hq56-name"></span><span class="hq56-chevron" aria-hidden="true">⌄</span>';
      b.querySelector(".hq65-group-icon").textContent =
        {
          工作空间: "▦",
          能力评价体系: "◇",
          合作经营: "♧",
          培训业务: "▣",
          认证与结算: "◈",
          组织与授权: "▥",
          系统管理: "⚙",
        }[name] || "▤";
      for (const a of panel.querySelectorAll("a")) {
        let i = document.createElement("span");
        i.className = "hq65-link-icon";
        i.setAttribute("aria-hidden", "true");
        i.textContent = "◇";
        a.prepend(i);
      }
      b.querySelector(".hq56-name").textContent = name;
      label.replaceWith(b);
      g.appendChild(panel);
    });
    window.MVERI_NAV_V63?.mount({
      menu: "#hq52menu",
      group: ".hq52-group",
      button: ".hq56-trigger",
      panel: ".hq56-panel",
      role: "hq",
      name: (g) => g.dataset.group,
      collapsed: () => document.body.classList.contains("hq52-collapsed"),
      expand: () => document.getElementById("hq52toggle")?.click(),
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
