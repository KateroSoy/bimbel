import { useEffect, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { create } from 'zustand';
import { LoaderCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { useAppStore, type Role } from '../../store/useAppStore';
import { useDataStore } from '../../store/useDataStore';
import { useRemote } from '../../store/useRemote';
import { hydrateStudentPortal, resetStudentPortal, type StudentPortalPayload } from '../../data/siswaPortal';

/** Whether the student portal payload (profile, courses, bills, …) has been loaded for this session. */
const usePortal = create<{ ready: boolean; loading: boolean; load: () => Promise<void> }>()((set, get) => ({
  ready: false,
  loading: false,
  load: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      hydrateStudentPortal(await api.get<StudentPortalPayload>('/student/portal'));
      set({ ready: true });
    } finally {
      set({ loading: false });
    }
  },
}));

// A different or ended session must never see the previous user's cached data.
useAppStore.subscribe((state, previous) => {
  if (state.token !== previous.token) {
    useRemote.getState().reset();
    useDataStore.setState({ loadedFor: null });
    usePortal.setState({ ready: false });
    resetStudentPortal();
  }
});

/**
 * Wraps every role page: requires a session, sends other roles to their own dashboard, and loads the
 * role's data before rendering. The server enforces the same rules; this only decides what to show.
 */
export function Guard({ role, children }: { role: Role; children: ReactNode }) {
  const { user, token } = useAppStore();
  const loadedFor = useDataStore((s) => s.loadedFor);
  const portalReady = usePortal((s) => s.ready);
  const allowed = !!token && user?.role === role;
  const ready = loadedFor === role && (role !== 'siswa' || portalReady);

  useEffect(() => {
    if (!allowed) return;
    if (useDataStore.getState().loadedFor !== role) void useDataStore.getState().hydrate(role);
    if (role === 'siswa' && !usePortal.getState().ready) void usePortal.getState().load().catch(() => undefined);
  }, [allowed, role]);

  if (!token || !user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={`/${user.role}/dashboard`} replace />;
  if (!ready) {
    return (
      <div className="min-h-screen bg-[#F7F9FD] flex items-center justify-center text-slate-500" role="status">
        <LoaderCircle className="w-6 h-6 animate-spin mr-2" /> <span className="text-sm font-semibold">Memuat data…</span>
      </div>
    );
  }
  return <>{children}</>;
}
