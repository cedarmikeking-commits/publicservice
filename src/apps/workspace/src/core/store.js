const key = "mveri_rebuild_v70";
export class Store {
  constructor(seed) {
    this.data = seed;
    try {
      const d = JSON.parse(localStorage.getItem(key));
      if (d && d.version === 70) this.data = { ...seed, ...d.data };
    } catch {}
    this.data.logs ??= [];
    this.data.schools ??= [];
    this.data.users ??= [];
    this.data.plans ??= [];
    this.data.blueprints ??= [];
    this.data.reports ??= [];
    this.data.agreements ??= [];
    this.data.delivery ??= [];
    this.data.settlements ??= [];
    this.data.settings ??= {};
  }
  get(collection) {
    return this.data[collection] || [];
  }
  persist() {
    localStorage.setItem(key, JSON.stringify({ version: 70, data: this.data }));
  }
  log(actor, action) {
    this.data.logs.unshift({ time: new Date().toLocaleString("zh-CN"), role: actor, action });
    this.persist();
  }
  create(type, item, actor) {
    if (!Array.isArray(this.data[type])) this.data[type] = [];
    const id = item.id || `${type.slice(0, 2).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    this.data[type].unshift({ ...item, id });
    this.persist();
    this.log(actor, `创建 ${type} ${id}`);
    return id;
  }
  update(type, id, patch, actor) {
    let row = this.get(type).find((x) => x.id === id);
    if (!row) throw Error("记录不存在");
    Object.assign(row, patch);
    this.persist();
    this.log(actor, `更新 ${type} ${id}`);
  }
  reset(seed) {
    this.data = seed;
    this.persist();
  }
}
export function activeSeats(store, schoolId) {
  return store.get("users").filter((x) => x.schoolId === schoolId && x.status === "启用" && x.type === "school").length;
}
export function validateSeat(store, schoolId, exceptId) {
  let sch = store.get("schools").find((x) => x.id === schoolId);
  if (!sch) throw Error("请选择已开通的院校");
  let count = store
    .get("users")
    .filter((x) => x.schoolId === schoolId && x.type === "school" && x.status === "启用" && x.id !== exceptId).length;
  if (count >= Number(sch.seats || 0)) throw Error("院校授权席位已满，无法启用账号");
}
