import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2, AlertCircle, Info, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { useNotificationStore } from '../../store/useNotificationStore';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { notifications, markAllAsRead, markAsRead } = useNotificationStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBg = (type: string) => {
    switch(type) {
      case 'success': return 'bg-emerald-50';
      case 'warning': return 'bg-amber-50';
      case 'error': return 'bg-red-50';
      default: return 'bg-blue-50';
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors relative shrink-0"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white shadow-sm"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900">Notifikasi</h3>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs font-medium text-blue-600 hover:text-blue-700">Tandai semua dibaca</button>
              )}
            </div>
            
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                 <div className="p-8 text-center text-slate-500 text-sm">Tidak ada notifikasi</div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={cn(
                      "px-5 py-4 border-b border-slate-50 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer group",
                      notif.unread ? "bg-blue-50/30" : ""
                    )}
                  >
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", getBg(notif.type))}>
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={cn("font-semibold text-sm truncate", notif.unread ? "text-slate-900" : "text-slate-700")}>
                          {notif.title}
                        </h4>
                        {notif.unread && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mb-2 line-clamp-2 leading-snug">{notif.description}</p>
                      <span className="text-xs font-medium text-slate-400">{notif.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-3 border-t border-slate-100 bg-slate-50 text-center flex flex-col gap-2">
              <button className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                Lihat Semua Notifikasi
              </button>
              <div className="flex gap-2 justify-center mt-2 border-t border-slate-200 pt-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    useNotificationStore.getState().triggerDeadlineAlert('Tugas Akhir Sejarah', 1);
                  }}
                  className="px-2 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-lg hover:bg-rose-200 transition-colors"
                >
                  Deadline
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    useNotificationStore.getState().triggerGradePosted('Ulangan Fisika', 92);
                  }}
                  className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-200 transition-colors"
                >
                  Nilai
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    useNotificationStore.getState().triggerAnnouncement('Libur Nasional', 'Sekolah libur mulai besok.');
                  }}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Info
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
