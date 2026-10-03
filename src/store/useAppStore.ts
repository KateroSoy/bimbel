import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, setUnauthorizedHandler } from '../lib/api';

export type Role = 'siswa' | 'guru' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
  avatar?: string | null;
  profile?: Record<string, any>;
  /** Public student id of a siswa account */
  studentId?: string | null;
}

interface Session { token: string; user: User }

interface AppState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { name: string; email: string; phone?: string; password: string; password_confirmation: string }) => Promise<User>;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: async (email, password) => {
        const session = await api.post<Session>('/auth/login', { email, password });
        set(session);
        return session.user;
      },
      register: async (data) => {
        const session = await api.post<Session>('/auth/register', data);
        set(session);
        return session.user;
      },
      setUser: (user) => set({ user }),
      logout: async () => {
        if (get().token) await api.post('/auth/logout').catch(() => undefined);
        set({ user: null, token: null });
      },
    }),
    {
      name: 'LearnSpace+-storage',
    }
  )
);

setUnauthorizedHandler(() => useAppStore.setState({ user: null, token: null }));
