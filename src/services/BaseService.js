// ============================================================
// Base Service — generic CRUD with Supabase + local fallback
// ============================================================

import { supabase, USE_SUPABASE } from "../config/supabase";
import { storage } from "../utils/storage";
import { uid } from "../utils/format";

/**
 * Base service class. Each entity extends this and provides:
 *   - table: Supabase table name
 *   - storageKey: local cache key
 *   - mapFromDb(row): transform snake_case DB → camelCase app
 *   - mapToDb(item): transform camelCase app → snake_case DB
 *   - seed: default data when nothing available
 */
export class BaseService {
  constructor({ table, storageKey, seed = [], mapFromDb, mapToDb }) {
    this.table = table;
    this.storageKey = storageKey;
    this.seed = seed;
    this.mapFromDb = mapFromDb || ((r) => r);
    this.mapToDb = mapToDb || ((r) => r);
  }

  async list() {
    if (USE_SUPABASE) {
      try {
        const { data, error } = await supabase
          .from(this.table)
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        const mapped = (data || []).map(this.mapFromDb);
        // Cache locally for offline resilience
        await storage.setJSON(this.storageKey, mapped);
        return mapped;
      } catch (e) {
        console.warn(`[${this.table}] Supabase list failed, using cache:`, e.message);
        return (await storage.getJSON(this.storageKey)) || this.seed;
      }
    }
    // Local mode
    const cached = await storage.getJSON(this.storageKey);
    if (cached && Array.isArray(cached)) return cached;
    await storage.setJSON(this.storageKey, this.seed);
    return this.seed;
  }

  async create(item) {
    const withId = { ...item, id: item.id || uid() };

    if (USE_SUPABASE) {
      try {
        const payload = this.mapToDb(withId);
        delete payload.id; // let Supabase generate UUID
        const { data, error } = await supabase.from(this.table).insert(payload).select().single();
        if (error) throw error;
        return this.mapFromDb(data);
      } catch (e) {
        console.warn(`[${this.table}] Supabase create failed:`, e.message);
        // Fall through to local
      }
    }
    // Local fallback
    const list = await this.list();
    const next = [withId, ...list];
    await storage.setJSON(this.storageKey, next);
    return withId;
  }

  async update(id, patch) {
    if (USE_SUPABASE) {
      try {
        const payload = this.mapToDb(patch);
        delete payload.id;
        const { data, error } = await supabase
          .from(this.table)
          .update(payload)
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        return this.mapFromDb(data);
      } catch (e) {
        console.warn(`[${this.table}] Supabase update failed:`, e.message);
      }
    }
    const list = await this.list();
    const next = list.map((x) => (x.id === id ? { ...x, ...patch } : x));
    await storage.setJSON(this.storageKey, next);
    return next.find((x) => x.id === id);
  }

  async remove(id) {
    if (USE_SUPABASE) {
      try {
        const { error } = await supabase.from(this.table).delete().eq("id", id);
        if (error) throw error;
        return true;
      } catch (e) {
        console.warn(`[${this.table}] Supabase remove failed:`, e.message);
      }
    }
    const list = await this.list();
    const next = list.filter((x) => x.id !== id);
    await storage.setJSON(this.storageKey, next);
    return true;
  }
}
