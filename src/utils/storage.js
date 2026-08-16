// Simple localStorage wrapper. Runs client-side only.
export const KEYS = {
  HOLDINGS: "mi-cartera:holdings",
  SNAPSHOTS: "mi-cartera:snapshots",
  LAST_UPDATED: "mi-cartera:lastUpdated",
};

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}
