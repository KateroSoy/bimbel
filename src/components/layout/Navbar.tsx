import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, LogIn } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { cn } from '../../lib/utils';

// targetId = section on the landing page; route = standalone page
const NAV_LINKS: { id: string; label: string; path: string; targetId?: string; route?: string; highlight?: boolean }[] = [
  { id: 'beranda', label: 'Beranda', targetId: 'beranda', path: '/' },
  { id: 'promo', label: 'PROMO SPESIAL!!', targetId: 'promo', path: '/#promo', highlight: true },
  { id: 'program', label: 'Program Belajar', targetId: 'program', path: '/#program' },
  { id: 'produk-digital', label: 'Produk Digital', targetId: 'produk-digital', path: '/#produk-digital' },
  { id: 'karir', label: 'Karir', route: '/karir', path: '/karir' },
  { id: 'tentang', label: 'Tentang Kami', targetId: 'tentang', path: '/#tentang' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToTarget = (targetId: string) => {
    if (targetId === 'beranda') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/');
      return;
    }

    const el = document.getElementById(targetId);
    if (el) {
      const navbarOffset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - navbarOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      window.history.pushState(null, '', `/#${targetId}`);
    }
  };

  const handleNavClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    setIsOpen(false);

    if (location.pathname === '/' || location.pathname === '') {
      scrollToTarget(targetId);
    } else {
      // LandingPage scrolls to the hash once it has mounted
      navigate(targetId === 'beranda' ? '/' : `/#${targetId}`);
    }
  };

  const handleLinkClick = (e: React.MouseEvent, link: typeof NAV_LINKS[number]) => {
    if (link.route) {
      e.preventDefault();
      setIsOpen(false);
      navigate(link.route);
      window.scrollTo({ top: 0 });
      return;
    }
    handleNavClick(e, link.targetId!);
  };

  const isActive = (link: typeof NAV_LINKS[number]) => !!link.route && location.pathname === link.route;

  return (
    <>
      <div className="fixed top-0 w-full z-50 transition-all font-sans">
        {/* Utility Strip */}
        <div className="bg-[#062564] text-white py-2 px-6 hidden md:block">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-sm font-medium">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-300" /> 0823-2456-7906
              </span>
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-300" /> info@studyhack.co.id
              </span>
            </div>
            <Link
              to="/login"
              className="bg-[#F16710] hover:bg-[#d95b0e] text-white px-5 py-1.5 rounded-full text-xs font-extrabold transition-colors shadow-sm flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" /> Masuk LearnSpace+
            </Link>
          </div>
        </div>

        {/* Main Navbar */}
        <nav className="w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 h-[76px] flex items-center justify-between">
            <a 
              href="/" 
              onClick={(e) => handleNavClick(e, 'beranda')}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <Logo variant="studyhack" size="lg" showText={true} />
            </a>

            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {NAV_LINKS.map((link) => (
                <a 
                  key={link.id}
                  href={link.path}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={cn(
                    "px-3 xl:px-4 py-2 rounded-full font-bold text-[14px] transition-colors cursor-pointer whitespace-nowrap",
                    link.highlight
                      ? "text-[#E52833] hover:bg-red-50"
                      : isActive(link)
                        ? "text-[#062564] bg-slate-100"
                        : "text-slate-800 hover:text-[#062564] hover:bg-slate-50"
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="lg:hidden flex items-center gap-2">
              <button 
                onClick={() => setIsOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700 cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </nav>
      </div>

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
              className="absolute top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <Logo variant="studyhack" size="sm" showText={true} />
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-slate-900" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-2">
                {NAV_LINKS.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <a 
                      href={item.path}
                      onClick={(e) => handleLinkClick(e, item)}
                      className={cn(
                        "text-lg font-bold transition-colors block py-3 border-b border-slate-50 cursor-pointer",
                        item.highlight ? "text-[#E52833]" : "text-slate-900 hover:text-[#062564]"
                      )}
                    >
                      {item.label}
                    </a>
                  </motion.div>
                ))}
              </div>

              <div className="p-6 border-t border-slate-100 flex flex-col gap-3 bg-slate-50">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3.5 rounded-xl bg-[#062564] text-white text-center font-bold text-sm shadow-md hover:bg-blue-900 transition-colors"
                >
                  Masuk LearnSpace+
                </Link>
                <a
                  href="/#konsultasi"
                  onClick={(e) => handleNavClick(e, 'konsultasi')}
                  className="w-full py-3 rounded-xl bg-[#F16710] text-white text-center font-bold text-sm shadow-sm hover:bg-[#d95b0e] transition-colors cursor-pointer"
                >
                  Konsultasi Program
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
