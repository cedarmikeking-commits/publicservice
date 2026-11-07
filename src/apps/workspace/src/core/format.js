export const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
export const yuan = (n) => "¥" + Number(n || 0).toLocaleString("zh-CN");
export const field = (name, label, val = "", type = "text") =>
  `<label class="field">${esc(label)}<input name="${esc(name)}" type="${esc(type)}" value="${esc(val)}" ${name === "id" ? "readonly" : ""} required></label>`;
export const select = (name, label, options, val = "") =>
  `<label class="field">${esc(label)}<select name="${esc(name)}" required>${options.map(([k, v]) => `<option value="${esc(k)}" ${k == val ? "selected" : ""}>${esc(v)}</option>`).join("")}</select></label>`;
export const heading = (title, desc = "", action = "") =>
  `<div class="section-head"><div><h2>${esc(title)}</h2><p>${esc(desc)}</p></div>${action}</div>`;
export const table = (cols, rows) =>
  `<div class="table-scroller"><table><thead><tr>${cols.map((x) => `<th>${esc(x)}</th>`).join("")}</tr></thead><tbody>${rows.length ? rows.map((r) => `<tr>${r.map((x) => `<td>${x ?? "—"}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${cols.length}" class="empty">暂无记录，可通过新增操作建立数据</td></tr>`}</tbody></table></div>`;
export const badge = (x) => `<span class="badge">${esc(x)}</span>`;
