// ============================================================
// Local Storage Adapter
// Provides async interface compatible with Supabase fallback
// ============================================================

const isArtifactStorage = typeof window !== "undefined" && window.storage;

const memCache = new Map();

export const storage = {
  async get(key) {
    try {
      if (isArtifactStorage) {
        const r = await window.storage.get(key);
        return r ? r.value : null;
      }
      if (typeof localStorage !== "undefined") {
        return localStorage.getItem(key);
      }
      return memCache.get(key) ?? null;
    } catch (e) {
      console.warn("[storage.get]", key, e);
      return memCache.get(key) ?? null;
    }
  },

  async set(key, value) {
    try {
      const v = typeof value === "string" ? value : JSON.stringify(value);
      if (isArtifactStorage) {
        await window.storage.set(key, v);
        return;
      }
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, v);
        return;
      }
      memCache.set(key, v);
    } catch (e) {
      console.warn("[storage.set]", key, e);
      memCache.set(key, value);
    }
  },

  async delete(key) {
    try {
      if (isArtifactStorage) {
        await window.storage.delete(key);
        return;
      }
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(key);
        return;
      }
      memCache.delete(key);
    } catch (e) {
      console.warn("[storage.delete]", key, e);
      memCache.delete(key);
    }
  },

  async getJSON(key, fallback = null) {
    const v = await this.get(key);
    if (!v) return fallback;
    try {
      return JSON.parse(v);
    } catch {
      return fallback;
    }
  },

  async setJSON(key, value) {
    return this.set(key, JSON.stringify(value));
  },
};
