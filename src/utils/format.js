export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function fmtMoney(n) {
  const v = Number.isFinite(n) ? n : 0;
  return v.toLocaleString("es-UY", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function fmtShort(n) {
  const v = Number.isFinite(n) ? n : 0;
  if (Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(Math.abs(v) >= 10000 ? 0 : 1)}k`;
  return `$${Math.round(v)}`;
}

export function fmtPct(n) {
  const v = Number.isFinite(n) ? n : 0;
  return `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
}

export function fmtQty(n) {
  if (!Number.isFinite(n)) return "0";
  return parseFloat(n.toFixed(6)).toString();
}

export function fmtDateShort(iso) {
  const parts = String(iso).split("-");
  if (parts.length !== 3) return iso;
  return `${parts[2]}/${parts[1]}`;
}

export function fmtDateTime(iso) {
  if (!iso) return "Nunca";
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm} ${hh}:${mi}`;
}

export function valueOf(h) {
  return h.quantity * h.currentPrice;
}

export function gainPct(h) {
  return h.avgCost > 0 ? ((h.currentPrice - h.avgCost) / h.avgCost) * 100 : 0;
}

export function sparkFor(snapshots, key) {
  if (snapshots.length === 0) return [{ value: 0 }, { value: 0 }];
  if (snapshots.length === 1) return [{ value: snapshots[0][key] }, { value: snapshots[0][key] }];
  return snapshots.map((s) => ({ value: s[key] }));
}
