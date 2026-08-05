import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Book, User, FileText, ChevronRight, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

// Mock data for search
const SEARCH_DATA = [
  { id: 'c1', type: 'course', title: 'Pengalaman Belajar Digital yang Efektif', category: 'Teknologi', url: '/#kelas' },
  { id: 'c2', type: 'course', title: 'Dasar Desain Web Modern', category: 'Desain', url: '/#kelas' },
  { id: 'c3', type: 'course', title: 'Membangun Masa Depan dengan Skill Digital', category: 'Pengembangan', url: '/#kelas' },
  { id: 'i1', type: 'instructor', title: 'Coralina Cloud', category: 'Tech Lead', url: '/#instruktur' },
  { id: 'i2', type: 'instructor', title: 'Donald Rose', category: 'Senior Designer', url: '/#instruktur' },
  { id: 'a1', type: 'article', title: 'Cara Cepat Memahami ReactJS', category: 'Frontend', url: '/#blog' },
  { id: 'a2', type: 'article', title: 'Masa Depan UI/UX Design di 2024', category: 'Desain', url: '/#blog' },
];

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const filteredResults = query
    ? SEARCH_DATA.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const groupedResults = {
    course: filteredResults.filter(item => item.type === 'course'),
    instructor: filteredResults.filter(item => item.type === 'instructor'),
    article: filteredResults.filter(item => item.type === 'article'),
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'course': return <Book className="w-4 h-4 text-blue-500" />;
      case 'instructor': return <User className="w-4 h-4 text-emerald-500" />;
      case 'article': return <FileText className="w-4 h-4 text-purple-500" />;
      default: return <Compass className="w-4 h-4 text-slate-500" />;
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case 'course': return 'Kelas';
      case 'instructor': return 'Instruktur';
      case 'article': return 'Artikel';
      default: return 'Lainnya';
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-slate-500 hover:bg-white/60 hover:text-slate-700 transition-all shadow-sm"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm font-medium">Cari sesuatu...</span>
        <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100/50 text-[10px] font-bold text-slate-400 border border-slate-200/50">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <button
        onClick={() => setIsOpen(true)}
        className="flex md:hidden items-center justify-center w-11 h-11 rounded-full bg-white/60 backdrop-blur-xl border border-white/80 hover:bg-white/80 transition-all shadow-sm text-slate-700"
      >
        <Search className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-2xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/60 flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center px-6 py-4 border-b border-slate-200/50 bg-white/50">
                <Search className="w-5 h-5 text-slate-400 mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari kelas, instruktur, atau artikel..."
                  className="flex-1 bg-transparent border-none outline-none text-slate-700 text-lg placeholder:text-slate-400 font-medium"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-4 no-scrollbar">
                {!query && (
                  <div className="px-2 py-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Pencarian Populer</p>
                    <div className="flex flex-wrap gap-2">
                      {['UI/UX Design', 'ReactJS', 'Digital Marketing', 'Data Science'].map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 hover:text-slate-800 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {query && filteredResults.length === 0 && (
                  <div className="px-6 py-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-900 font-medium text-lg">Tidak ada hasil ditemukan</p>
                    <p className="text-slate-500 text-sm mt-1">Coba gunakan kata kunci lain untuk mencari.</p>
                  </div>
                )}

                {query && filteredResults.length > 0 && (
                  <div className="space-y-6 px-2 pb-4">
                    {Object.entries(groupedResults).map(([type, items]) => {
                      if (items.length === 0) return null;
                      return (
                        <div key={type}>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">
                            {getLabel(type)}
                          </p>
                          <div className="space-y-1">
                            {items.map((item) => (
                              <Link
                                key={item.id}
                                to={item.url}
                                onClick={() => setIsOpen(false)}
                                className="group flex items-center justify-between p-3 rounded-2xl hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-sm transition-all cursor-pointer"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    {getIcon(item.type)}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                      {item.title}
                                    </p>
                                    <p className="text-sm text-slate-500 font-medium">
                                      {item.category}
                                    </p>
                                  </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div className="px-6 py-3 border-t border-slate-200/50 bg-slate-50/50 text-xs font-medium text-slate-500 flex justify-between items-center">
                <span>Gunakan panah untuk navigasi</span>
                <span className="flex gap-2">
                  <span><kbd className="px-1.5 py-0.5 rounded bg-white border shadow-sm">esc</kbd> tutup</span>
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
