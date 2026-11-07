import { registry, can } from "./catalog.js";
export class Router {
  constructor(onChange, getRole) {
    this.onChange = onChange;
    this.getRole = getRole;
    window.addEventListener("popstate", () => this.render());
  }
  current() {
    let name = new URLSearchParams(location.search).get("view") || "dashboard";
    return registry[name] ? name : "dashboard";
  }
  open(id, replace = false) {
    if (!registry[id] || !can(this.getRole(), id)) throw Error("无权访问此功能");
    const u = new URL(location.href);
    u.searchParams.set("view", id);
    history[replace ? "replaceState" : "pushState"]({ view: id }, "", u);
    this.render();
  }
  render() {
    let id = this.current();
    if (!can(this.getRole(), id)) id = "dashboard";
    this.onChange(id);
  }
}
