import { create } from 'zustand';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: string;
  unread: boolean;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'unread'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  triggerDeadlineAlert: (taskName: string, daysLeft: number) => void;
  triggerGradePosted: (courseName: string, score: number) => void;
  triggerAnnouncement: (title: string, message: string) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  // Diisi oleh aksi di aplikasi (mis. nilai masuk, pengumuman); tidak ada notifikasi bawaan.
  notifications: [],
  
  addNotification: (notification) => {
    // Show toast
    switch (notification.type) {
      case 'success':
        toast.success(notification.title, { description: notification.description });
        break;
      case 'error':
        toast.error(notification.title, { description: notification.description });
        break;
      case 'warning':
        toast.warning(notification.title, { description: notification.description });
        break;
      default:
        toast.info(notification.title, { description: notification.description });
        break;
    }
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: Math.random().toString(36).substring(2, 9),
          time: 'Baru saja',
          unread: true,
        },
        ...state.notifications,
      ],
    }));
  },
  
  triggerDeadlineAlert: (taskName, daysLeft) => {
    get().addNotification({
      title: `Batas Waktu: ${taskName}`,
      description: `Tugas ini harus dikumpulkan dalam ${daysLeft} hari lagi!`,
      type: daysLeft <= 1 ? 'error' : 'warning'
    });
  },

  triggerGradePosted: (courseName, score) => {
    get().addNotification({
      title: `Nilai Baru: ${courseName}`,
      description: `Nilai Anda untuk tugas ini adalah ${score}.`,
      type: score >= 80 ? 'success' : 'info'
    });
  },

  triggerAnnouncement: (title, message) => {
    get().addNotification({
      title: `Pengumuman: ${title}`,
      description: message,
      type: 'info'
    });
  },

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, unread: false } : n
      ),
    })),
    
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, unread: false })),
    })),
    
  clearAll: () => set({ notifications: [] }),
}));
