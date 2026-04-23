// ============================================================
// useCollection — reactive wrapper over an entity service
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";

export function useCollection(service, { auto = true } = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await service.list();
      if (mountedRef.current) setData(list || []);
    } catch (e) {
      if (mountedRef.current) setError(e.message || "Gagal memuat data");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    mountedRef.current = true;
    if (auto) refresh();
    return () => {
      mountedRef.current = false;
    };
  }, [auto, refresh]);

  const create = useCallback(
    async (item) => {
      const created = await service.create(item);
      if (mountedRef.current) {
        setData((prev) => [created, ...prev.filter((x) => x.id !== created.id)]);
      }
      return created;
    },
    [service]
  );

  const update = useCallback(
    async (id, patch) => {
      const updated = await service.update(id, patch);
      if (mountedRef.current) {
        setData((prev) => prev.map((x) => (x.id === id ? { ...x, ...updated } : x)));
      }
      return updated;
    },
    [service]
  );

  const remove = useCallback(
    async (id) => {
      await service.remove(id);
      if (mountedRef.current) {
        setData((prev) => prev.filter((x) => x.id !== id));
      }
    },
    [service]
  );

  return { data, loading, error, refresh, create, update, remove, setData };
}
