import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Role = 'guest' | 'siswa' | 'guru' | 'admin';

interface User {
  id: string;
  name: string;
  role: Role;
  schoolName?: string;
  avatar?: string;
}

interface AppState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'sekolahverse-storage',
    }
  )
);
