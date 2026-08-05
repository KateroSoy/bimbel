import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutTemplate, 
  Fingerprint, 
  Library, 
  LogOut,
  Search,
  ScrollText,
  Menu,
  Landmark,
  Calendar,
  PenTool,
  Award,
  Megaphone,
  Users,
  BarChart,
  Settings,
  BookOpen,
  UsersRound,
  GraduationCap,
  UserCheck,
  CreditCard,
  MessageSquare,
  Package
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppStore } from '../../store/useAppStore';

import { Logo } from '../ui/Logo';
import { CommandPalette } from './CommandPalette';
import { NotificationDropdown } from './NotificationDropdown';

interface SidebarItem {
  title: string;
  path: string;
  icon: ReactNode;
}

const getSidebarItems = (role: string): SidebarItem[] => {
  switch (role) {
    case 'siswa':
      return [
        { title: 'Dashboard', path: '/siswa/dashboard', icon: <LayoutTemplate className="w-5 h-5" /> },
        { title: 'Profil Siswa', path: '/siswa/profil', icon: <Fingerprint className="w-5 h-5" /> },
        { title: 'Course & Materi', path: '/siswa/course', icon: <Library className="w-5 h-5" /> },
        { title: 'Jadwal Bimbel', path: '/siswa/jadwal', icon: <Calendar className="w-5 h-5" /> },
        { title: 'Absensi Kelas', path: '/siswa/absensi', icon: <UserCheck className="w-5 h-5" /> },
        { title: 'Pembayaran SPP', path: '/siswa/spp', icon: <CreditCard className="w-5 h-5" /> },
        { title: 'Tugas & PR', path: '/siswa/tugas', icon: <PenTool className="w-5 h-5" /> },
        { title: 'Quiz & Tryout', path: '/siswa/quiz', icon: <ScrollText className="w-5 h-5" /> },
        { title: 'Nilai & Evaluasi', path: '/siswa/nilai', icon: <BarChart className="w-5 h-5" /> },
        { title: 'Sertifikat', path: '/siswa/sertifikat', icon: <Award className="w-5 h-5" /> },
        { title: 'Pengumuman', path: '/siswa/pengumuman', icon: <Megaphone className="w-5 h-5" /> },
      ];
    case 'guru':
      return [
        { title: 'Dashboard', path: '/guru/dashboard', icon: <LayoutTemplate className="w-5 h-5" /> },
        { title: 'Presensi Kelas', path: '/guru/absensi', icon: <UserCheck className="w-5 h-5" /> },
        { title: 'AI Pembuatan Bahan Ajar', path: '/guru/rpp-generator', icon: <ScrollText className="w-5 h-5" /> },
        { title: 'Bank Soal & Tryout', path: '/guru/bank-soal', icon: <Library className="w-5 h-5" /> },
        { title: 'Kelas & Batch Bimbel', path: '/guru/kelas', icon: <UsersRound className="w-5 h-5" /> },
        { title: 'Course & Materi', path: '/guru/course', icon: <BookOpen className="w-5 h-5" /> },
        { title: 'Tugas & Latihan', path: '/guru/tugas', icon: <PenTool className="w-5 h-5" /> },
        { title: 'Quiz & Tryout', path: '/guru/quiz', icon: <ScrollText className="w-5 h-5" /> },
        { title: 'Nilai Siswa', path: '/guru/nilai', icon: <Award className="w-5 h-5" /> },
        { title: 'Progress Siswa', path: '/guru/progress-siswa', icon: <BarChart className="w-5 h-5" /> },
        { title: 'Pengumuman', path: '/guru/pengumuman', icon: <Megaphone className="w-5 h-5" /> },
      ];
    case 'admin':
      return [
        { title: 'Dashboard', path: '/admin/dashboard', icon: <LayoutTemplate className="w-5 h-5" /> },
        { title: 'WhatsApp Wali Murid', path: '/admin/whatsapp', icon: <MessageSquare className="w-5 h-5" /> },
        { title: 'Data Siswa Bimbel', path: '/admin/siswa', icon: <Users className="w-5 h-5" /> },
        { title: 'Data Tentor / Tutor', path: '/admin/guru', icon: <GraduationCap className="w-5 h-5" /> },
        { title: 'Manajemen Keuangan & SPP', path: '/admin/keuangan', icon: <Landmark className="w-5 h-5" /> },
        { title: 'Inventaris Bimbel', path: '/admin/inventaris', icon: <Package className="w-5 h-5" /> },
        { title: 'Batch & Rombel Bimbel', path: '/admin/kelas', icon: <UsersRound className="w-5 h-5" /> },
        { title: 'Data Course & Modul', path: '/admin/course', icon: <BookOpen className="w-5 h-5" /> },
        { title: 'Monitoring Progress', path: '/admin/progress', icon: <BarChart className="w-5 h-5" /> },
        { title: 'Laporan Akademik', path: '/admin/laporan', icon: <ScrollText className="w-5 h-5" /> },
        { title: 'Pengumuman', path: '/admin/pengumuman', icon: <Megaphone className="w-5 h-5" /> },
        { title: 'Pengaturan Bimbel', path: '/admin/pengaturan', icon: <Settings className="w-5 h-5" /> },
      ];
    default:
      return [];
  }
};

const getExternalUrl = (path: string) => {
  if (typeof window === 'undefined') return path;
  return `${window.location.origin}${path.startsWith('/') ? path : '/' + path}`;
};

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const currentRole = user?.role || 'siswa';
  
  const items = getSidebarItems(currentRole);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Swipe-to-navigate logic
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
      const currentIndex = items.findIndex(item => location.pathname.startsWith(item.path));
      if (currentIndex !== -1) {
        if (isLeftSwipe && currentIndex < items.length - 1) {
          navigate(items[currentIndex + 1].path);
        } else if (isRightSwipe && currentIndex > 0) {
          navigate(items[currentIndex - 1].path);
        }
      }
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#F8FBFF] flex flex-col md:flex-row pb-16 md:pb-0"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Sidebar (Desktop) */}
      <aside className="w-64 glass border-r border-white/40 hidden md:flex flex-col h-screen sticky top-0 z-40">
        <div className="h-20 flex items-center px-6 border-b border-white/40">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="font-display font-bold text-xl tracking-tight text-slate-900">
              BIMBEL<span className="text-gradient">VERSE</span>
            </span>
          </Link>
        </div>
        
        <div className="flex-1 py-6 px-4 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">
          {items.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-sm",
                  isActive 
                    ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
                )}
              >
                <div className={cn(isActive ? "text-white" : "text-slate-500")}>
                  {item.icon}
                </div>
                <span>{item.title}</span>
              </Link>
            )
          })}
        </div>

        {/* Ekosistem Bimbel - External App Links */}
        <div className="px-4 py-3 border-t border-slate-100">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-4 mb-2">Ekosistem Bimbel</p>
          <a href={getExternalUrl('/cbt-eschool/')} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-slate-600 hover:bg-amber-50 hover:text-amber-700 transition-colors text-xs font-semibold">
            <span className="text-base">📝</span>
            <span>CBT / Ujian Online</span>
          </a>
          <a href={getExternalUrl('/tahfidz/')} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-slate-600 hover:bg-green-50 hover:text-green-700 transition-colors text-xs font-semibold">
            <span className="text-base">📖</span>
            <span>Setoran Hafalan</span>
          </a>
          <a href={getExternalUrl('/bimbingan-alumni/')} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-colors text-xs font-semibold">
            <span className="text-base">🤝</span>
            <span>Bimbingan Alumni</span>
          </a>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Peserta Bimbel'}</p>
              <p className="text-[11px] text-slate-500 capitalize">{user?.role === 'guru' ? 'Tentor Master' : user?.role || 'Siswa'}</p>
            </div>
          </div>
          
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-xs font-bold"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/40 z-50 flex items-center justify-around px-2 py-2 h-16 safe-area-bottom">
        {items.slice(0, 4).map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 rounded-xl transition-colors",
                isActive ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <div className={cn("p-1 rounded-full", isActive && "bg-blue-50")}>
                {item.icon}
              </div>
              <span className="text-[10px] font-medium truncate max-w-[64px]">{item.title}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full gap-1 rounded-xl transition-colors text-slate-500 hover:text-slate-900"
          )}
        >
          <div className="p-1 rounded-full">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium truncate max-w-[64px]">Lainnya</span>
        </button>
      </nav>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60] flex flex-col justify-end bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-white rounded-t-3xl p-6 w-full max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom-full duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-xl text-slate-900">Menu Pembelajaran Bimbel</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-600">
                <Menu className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col gap-2 mb-6">
              {items.slice(4).map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200",
                      isActive 
                        ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                    )}
                  >
                    {item.icon}
                    <span className="font-medium">{item.title}</span>
                  </Link>
                )
              })}
            </div>

            {/* Ekosistem Bimbel di Mobile Drawer */}
            <div className="border-t border-slate-100 pt-4 mb-4">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-4 mb-2">Ekosistem Bimbel</p>
              <a href={getExternalUrl('/cbt-eschool/')} target="_blank" rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-600 hover:bg-amber-50 hover:text-amber-700 transition-colors text-sm">
                <span className="text-xl">📝</span>
                <span className="font-medium">CBT / Ujian Online</span>
              </a>
              <a href={getExternalUrl('/tahfidz/')} target="_blank" rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-600 hover:bg-green-50 hover:text-green-700 transition-colors text-sm">
                <span className="text-xl">📖</span>
                <span className="font-medium">Setoran Hafalan</span>
              </a>
              <a href={getExternalUrl('/bimbingan-alumni/')} target="_blank" rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-colors text-sm">
                <span className="text-xl">🤝</span>
                <span className="font-medium">Bimbingan Alumni</span>
              </a>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-slate-50">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {user?.name?.[0] || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role || 'Siswa'}</p>
                </div>
              </div>
              <button 
                onClick={() => { logout(); navigate('/login'); }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-colors font-bold text-sm"
              >
                <LogOut className="w-5 h-5" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <CommandPalette />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-300/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-300/10 blur-[100px] rounded-full pointer-events-none"></div>

        <header className="h-20 glass border-b border-white/40 sticky top-0 z-30 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="md:hidden flex items-center gap-2 mr-2">
              <Logo size="sm" />
            </Link>
            <h1 className="font-display font-bold text-xl text-slate-900 hidden sm:block">
              {items.find(i => location.pathname.startsWith(i.path))?.title || 'Dashboard Bimbel'}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-slate-100/80 hover:bg-slate-200/80 text-slate-500 transition-colors border border-slate-200/50"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm font-medium hidden sm:block w-32 text-left">Pencarian...</span>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 bg-white text-slate-400 rounded text-[10px] font-bold border border-slate-200 shadow-sm ml-2">
                Cmd K
              </kbd>
            </button>
            <NotificationDropdown />
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
