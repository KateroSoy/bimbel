import { useState, useEffect, useRef } from 'react';
import { Search, Command, BookOpen, PenTool, LayoutTemplate, X, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAppStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentRole = user?.role || 'siswa';

  const defaultActions = [
    { id: 'dashboard', title: 'Pergi ke Dashboard', icon: <LayoutTemplate className="w-4 h-4" />, path: `/${currentRole}/dashboard` },
    ...(currentRole === 'siswa' ? [
      { id: 'courses', title: 'Lihat Semua Kelas', icon: <BookOpen className="w-4 h-4" />, path: '/siswa/course' },
      { id: 'tasks', title: 'Tugas Saya', icon: <PenTool className="w-4 h-4" />, path: '/siswa/tugas' }
    ] : []),
    ...(currentRole === 'guru' ? [
      { id: 'classes', title: 'Manajemen Kelas', icon: <BookOpen className="w-4 h-4" />, path: '/guru/kelas' }
    ] : []),
  ];

  const filteredActions = query === '' 
    ? defaultActions 
    : defaultActions.filter((action) => action.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4">
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      />
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center px-4 py-3 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent outline-none text-slate-900 placeholder:text-slate-400 text-sm sm:text-base"
            placeholder="Cari kelas, tugas, atau menu (Ketik untuk mencari...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-bold border border-slate-200">
              <Command className="w-3 h-3" /> K
            </kbd>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filteredActions.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              Tidak ada hasil yang ditemukan untuk "{query}"
            </div>
          ) : (
            <div className="space-y-1">
              {filteredActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => {
                    navigate(action.path);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 text-left transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                    {action.title}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 text-[10px] sm:text-xs text-slate-500 flex justify-between items-center">
          <span>Tekan <kbd className="font-sans px-1 rounded bg-slate-200 border border-slate-300">↑↓</kbd> untuk navigasi</span>
          <span>Tekan <kbd className="font-sans px-1 rounded bg-slate-200 border border-slate-300">Enter</kbd> untuk memilih</span>
        </div>
      </div>
    </div>
  );
}
