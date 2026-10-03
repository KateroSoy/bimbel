import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { toast } from 'sonner';
import { api, ApiError } from '../lib/api';

/** Client cache of /api/r/{resource} lists. Rows are whatever the server returned; mutations go to the server first. */
interface Entry { rows: any[]; status: 'idle' | 'loading' | 'ready' | 'error' }

interface RemoteState {
  entries: Record<string, Entry>;
  load: (resource: string, force?: boolean) => Promise<void>;
  create: (resource: string, data: object) => Promise<any | null>;
  update: (resource: string, id: string, changes: object) => Promise<any | null>;
  remove: (resource: string, id: string) => Promise<boolean>;
  reset: () => void;
}

const EMPTY: Entry = { rows: [], status: 'idle' };
const fail = (e: unknown) => { toast.error(e instanceof ApiError ? e.first : 'Terjadi kesalahan.'); };

export const useRemote = create<RemoteState>()((set, get) => {
  const patch = (resource: string, entry: Partial<Entry>) =>
    set((s) => ({ entries: { ...s.entries, [resource]: { ...(s.entries[resource] ?? EMPTY), ...entry } } }));
  const rows = (resource: string) => get().entries[resource]?.rows ?? [];

  return {
    entries: {},
    load: async (resource, force = false) => {
      const status = get().entries[resource]?.status ?? 'idle';
      if (status === 'loading' || (status === 'ready' && !force)) return;
      patch(resource, { status: 'loading' });
      try {
        const { data } = await api.get<{ data: any[] }>(`/r/${resource}`);
        patch(resource, { rows: data, status: 'ready' });
      } catch (e) {
        patch(resource, { status: 'error' });
        if (!(e instanceof ApiError && e.status === 401)) fail(e);
      }
    },
    create: async (resource, data) => {
      try {
        const { data: row } = await api.post<{ data: any }>(`/r/${resource}`, data);
        // a re-submit returns the same id: replace instead of duplicating
        patch(resource, { rows: [row, ...rows(resource).filter((r) => r.id !== row.id)] });
        return row;
      } catch (e) { fail(e); return null; }
    },
    update: async (resource, id, changes) => {
      try {
        const { data: row } = await api.put<{ data: any }>(`/r/${resource}/${encodeURIComponent(id)}`, changes);
        patch(resource, { rows: rows(resource).map((r) => (r.id === id ? row : r)) });
        return row;
      } catch (e) { fail(e); return null; }
    },
    remove: async (resource, id) => {
      try {
        await api.del(`/r/${resource}/${encodeURIComponent(id)}`);
        patch(resource, { rows: rows(resource).filter((r) => r.id !== id) });
        return true;
      } catch (e) { fail(e); return false; }
    },
    reset: () => set({ entries: {} }),
  };
});

/** Rows of a resource (loaded on first use) plus mutations bound to it. */
export function useResource<T extends { id: string }>(resource: string) {
  const entry = useRemote((s) => s.entries[resource]) ?? EMPTY;
  const { load, create, update, remove } = useRemote.getState();
  useEffect(() => { void load(resource); }, [resource, load]);

  return {
    rows: entry.rows as T[],
    loading: entry.status === 'idle' || entry.status === 'loading',
    create: (data: Partial<T>) => create(resource, data) as Promise<T | null>,
    update: (id: string, changes: Partial<T>) => update(resource, id, changes) as Promise<T | null>,
    remove: (id: string) => remove(resource, id),
    reload: () => load(resource, true),
  };
}

/** One-off GET for endpoints that are not list resources (e.g. /admin/dashboard). */
export function useFetch<T>(path: string): T | null {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    let alive = true;
    api.get<T>(path).then((d) => { if (alive) setData(d); }).catch(fail);
    return () => { alive = false; };
  }, [path]);
  return data;
}
