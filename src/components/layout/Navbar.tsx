import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, Wand2, Compass, Landmark, ScanFace, Gem } from 'lucide-react';
import { cn } from '../../lib/utils';

import { Logo } from '../ui/Logo';

import { GlobalSearch } from './GlobalSearch';

const NAV_LINKS = [
  { id: 'beranda', label: 'Beranda', path: '/', icon: Compass },
  { id: 'kelas', label: 'Kelas', path: '/#kategori', icon: ScanFace },
  { id: 'program', label: 'Program', path: '/#fitur', icon: Wand2 },
  { id: 'instruktur', label: 'Instruktur', path: '/#instruktur', icon: Landmark },
  { id: 'artikel', label: 'Artikel', path: '/#blog', icon: Gem },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 w-full z-50 py-6 pointer-events-none"
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between pointer-events-auto">
          <Link to="/" className="flex items-center gap-2 group">
            <Logo size="md" className="group-hover:scale-105 transition-transform duration-300" />
            <span className="font-display font-bold text-xl tracking-tight text-slate-900 drop-shadow-sm">
              SEKOLAH<span className="text-blue-600">VERSE</span>
            </span>
          </Link>

          <div 
            className="hidden lg:flex items-center gap-1 px-1.5 py-1.5 bg-white/40 backdrop-blur-3xl border border-white/60 rounded-full shadow-[0_8px_32px_rgba(37,99,235,0.06)] relative"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {NAV_LINKS.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link 
                  key={link.id}
                  to={link.path}
                  onMouseEnter={() => setHoveredIndex(index)}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-colors z-10 flex items-center gap-1.5",
                    hoveredIndex === index ? "text-blue-700" : "text-slate-600"
                  )}
                >
                  {hoveredIndex === index && (
                    <motion.div
                      layoutId="navbar-hover"
                      className="absolute inset-0 bg-white shadow-[0_2px_12px_rgba(37,99,235,0.12)] border border-white/80 rounded-full -z-10 overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/60 to-transparent -translate-x-[100%] animate-shimmer skew-x-12 mix-blend-overlay"></div>
                    </motion.div>
                  )}
                  {link.label}
                  {Icon && <Icon className={cn("w-3.5 h-3.5 transition-colors", hoveredIndex === index ? "text-blue-500" : "text-slate-400")} />}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <GlobalSearch />
            <Link to="/login" className="hidden md:flex items-center justify-center px-5 py-2.5 rounded-full text-slate-700 text-sm font-bold hover:bg-white/60 backdrop-blur-md transition-colors relative overflow-hidden group">
              <span className="relative z-10">Masuk</span>
              <div className="absolute inset-0 bg-slate-100/50 -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            </Link>
            <Link to="/login" className="hidden md:flex items-center justify-center px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 duration-300 relative overflow-hidden group">
              <span className="relative z-10 flex items-center gap-2">
                Mulai Belajar <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:animate-shimmer skew-x-12 mix-blend-overlay"></div>
            </Link>
            <button 
              onClick={() => setIsOpen(true)}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-white/60 backdrop-blur-xl border border-white/80 hover:bg-white/80 transition-all duration-300 shadow-sm text-slate-700 hover:text-blue-600"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="absolute top-0 right-0 w-full max-w-md h-full bg-white/80 backdrop-blur-3xl border-l border-white/50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/50">
                <span className="font-display font-bold text-xl tracking-tight text-slate-900">
                  SEKOLAH<span className="text-gradient">VERSE</span>
                </span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-900" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-4">
                {[
                  { title: 'Beranda', path: '/' },
                  { title: 'Kelas', path: '/#kategori' },
                  { title: 'Program', path: '/#fitur' },
                  { title: 'Instruktur', path: '/#instruktur' },
                  { title: 'Artikel', path: '/#blog' },
                  { title: 'Tentang', path: '/#tentang' },
                  { title: 'Kontak', path: '/#kontak' },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link 
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className="text-2xl font-display font-bold text-slate-900 hover:text-blue-600 transition-colors flex items-center justify-between group py-2"
                    >
                      {item.title}
                      <ArrowRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="p-6 border-t border-white/50 flex flex-col gap-4 bg-white/50">
                <Link to="/login" className="w-full flex items-center justify-center h-14 rounded-full bg-white text-slate-900 font-medium hover:bg-slate-50 transition-colors shadow-sm">
                  Masuk ke Akun
                </Link>
                <Link to="/login" className="w-full flex items-center justify-center h-14 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                  Mulai Belajar
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
