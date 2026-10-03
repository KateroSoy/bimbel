import React, { ReactNode, useState } from 'react';
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
  Package,
  Home,
  CalendarDays,
  ClipboardList,
  BarChart3,
  CircleCheck,
  Wallet,
  UserCircle,
  ChevronDown,
  Smartphone,
  Bell,
  FileQuestion,
  Sparkles,
  TriangleAlert,
  DoorOpen,
  Scale,
  Receipt,
  HandCoins,
  LineChart,
} from 'lucide-react';
import { toast } from 'sonner';
import { STUDENT } from '../../data/siswaPortal';
import { TUTOR } from '../../data/guruPortal';
import { cn } from '../../lib/utils';
import { useAppStore } from '../../store/useAppStore';

import { Logo } from '../ui/Logo';
import { CommandPalette } from './CommandPalette';
import { NotificationDropdown } from './NotificationDropdown';

interface SidebarItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

interface SidebarSection {
  heading?: string;
  items: SidebarItem[];
}

const getSidebarItems = (role: string): SidebarSection[] => {
  switch (role) {
    case 'siswa':
      return [
        {
          items: [
            { title: 'Dashboard', path: '/siswa/dashboard', icon: <Home className="w-5 h-5" /> },
          ]
        },
        {
          heading: 'BELAJAR',
          items: [
            { title: 'Jadwal Live Tutor', path: '/siswa/jadwal', icon: <CalendarDays className="w-5 h-5" /> },
            { title: 'Course & Materi', path: '/siswa/course', icon: <BookOpen className="w-5 h-5" /> },
            { title: 'Tugas & Assessment', path: '/siswa/tugas', icon: <ClipboardList className="w-5 h-5" /> },
          ]
        },
        {
          heading: 'PERKEMBANGAN',
          items: [
            { title: 'Hasil Belajar', path: '/siswa/nilai', icon: <BarChart3 className="w-5 h-5" /> },
            { title: 'Kehadiran', path: '/siswa/absensi', icon: <CircleCheck className="w-5 h-5" /> },
          ]
        },
        {
          heading: 'ADMINISTRASI',
          items: [
            { title: 'Pembayaran', path: '/siswa/spp', icon: <Wallet className="w-5 h-5" /> },
          ]
        },
        {
          heading: 'AKUN',
          items: [
            { title: 'Profil Saya', path: '/siswa/profil', icon: <UserCircle className="w-5 h-5" /> },
            { title: 'Pengaturan', path: '/siswa/pengaturan', icon: <Settings className="w-5 h-5" /> },
          ]
        }
      ];
    case 'guru':
      return [
        {
          heading: 'UTAMA',
          items: [
            { title: 'Dashboard', path: '/guru/dashboard', icon: <Home className="w-5 h-5" /> },
          ]
        },
        {
          heading: 'MENGAJAR',
          items: [
            { title: 'Kelas Saya', path: '/guru/kelas', icon: <UsersRound className="w-5 h-5" /> },
            { title: 'Jadwal Mengajar', path: '/guru/jadwal', icon: <Calendar className="w-5 h-5" /> },
            { title: 'Materi & Modul', path: '/guru/course', icon: <BookOpen className="w-5 h-5" /> },
            { title: 'Tugas & Assessment', path: '/guru/tugas', icon: <PenTool className="w-5 h-5" /> },
            { title: 'Presensi', path: '/guru/absensi', icon: <UserCheck className="w-5 h-5" /> },
          ]
        },
        {
          heading: 'SISWA',
          items: [
            { title: 'Siswa Saya', path: '/guru/siswa', icon: <Users className="w-5 h-5" /> },
            { title: 'Nilai & Progress', path: '/guru/nilai', icon: <BarChart3 className="w-5 h-5" /> },
            { title: 'Siswa Perlu Perhatian', path: '/guru/progress-siswa', icon: <TriangleAlert className="w-5 h-5" /> },
          ]
        },
        {
          heading: 'KONTEN',
          items: [
            { title: 'Bank Soal', path: '/guru/bank-soal', icon: <FileQuestion className="w-5 h-5" /> },
            { title: 'AI Pembuat Bahan Ajar', path: '/guru/ai-bahan-ajar', icon: <Sparkles className="w-5 h-5" /> },
          ]
        },
        {
          heading: 'KOMUNIKASI',
          items: [
            { title: 'Pengumuman', path: '/guru/pengumuman', icon: <Megaphone className="w-5 h-5" /> },
            { title: 'Pesan', path: '/guru/pesan', icon: <MessageSquare className="w-5 h-5" /> },
          ]
        },
        {
          heading: 'AKUN',
          items: [
            { title: 'Profil Saya', path: '/guru/profil', icon: <UserCircle className="w-5 h-5" /> },
            { title: 'Pengaturan', path: '/guru/pengaturan', icon: <Settings className="w-5 h-5" /> },
          ]
        },
      ];
    case 'admin':
      return [
        {
          heading: 'UTAMA',
          items: [
            { title: 'Dashboard', path: '/admin/dashboard', icon: <LayoutTemplate className="w-5 h-5" /> },
            { title: 'Notifikasi', path: '/admin/notifikasi', icon: <Bell className="w-5 h-5" />, badge: 8 },
          ]
        },
        {
          heading: 'SISWA',
          items: [
            { title: 'Data Siswa', path: '/admin/siswa', icon: <Users className="w-5 h-5" /> },
            { title: 'Pendaftaran Siswa Baru', path: '/admin/pendaftaran', icon: <UserCheck className="w-5 h-5" />, badge: 7 },
            { title: 'Orang Tua / Wali', path: '/admin/ortu', icon: <UsersRound className="w-5 h-5" /> },
          ]
        },
        {
          heading: 'TUTOR & STAFF',
          items: [
            { title: 'Data Tutor & Staff', path: '/admin/guru', icon: <GraduationCap className="w-5 h-5" /> },
            { title: 'Jadwal Tutor', path: '/admin/jadwal-tutor', icon: <Calendar className="w-5 h-5" /> },
            { title: 'Kehadiran Tutor', path: '/admin/kehadiran-tutor', icon: <Fingerprint className="w-5 h-5" /> },
            { title: 'Beban Mengajar', path: '/admin/beban', icon: <Scale className="w-5 h-5" /> },
          ]
        },
        {
          heading: 'PROGRAM & KELAS',
          items: [
            { title: 'Program Bimbel', path: '/admin/course', icon: <BookOpen className="w-5 h-5" /> },
            { title: 'Kelas & Rombel', path: '/admin/kelas', icon: <UsersRound className="w-5 h-5" /> },
            { title: 'Jadwal Kelas', path: '/admin/jadwal-kelas', icon: <CalendarDays className="w-5 h-5" /> },
            { title: 'Ruang & Kapasitas', path: '/admin/ruang', icon: <DoorOpen className="w-5 h-5" /> },
          ]
        },
        {
          heading: 'KEUANGAN',
          items: [
            { title: 'SPP & Tagihan', path: '/admin/keuangan', icon: <Landmark className="w-5 h-5" /> },
            { title: 'Pembayaran', path: '/admin/pembayaran', icon: <CreditCard className="w-5 h-5" /> },
            { title: 'Piutang', path: '/admin/piutang', icon: <Receipt className="w-5 h-5" />, badge: 23 },
            { title: 'Pengeluaran', path: '/admin/pengeluaran', icon: <Wallet className="w-5 h-5" /> },
            { title: 'Honor Tutor', path: '/admin/honor', icon: <HandCoins className="w-5 h-5" /> },
          ]
        },
        {
          heading: 'OPERASIONAL',
          items: [
            { title: 'Inventaris', path: '/admin/inventaris', icon: <Package className="w-5 h-5" /> },
            { title: 'Buku & Produk', path: '/admin/buku', icon: <Library className="w-5 h-5" /> },
            { title: 'CBT / Ujian (Admin)', path: '/admin/cbt', icon: <ScrollText className="w-5 h-5" /> },
            { title: 'Alumni', path: '/admin/alumni', icon: <Users className="w-5 h-5" /> },
          ]
        },
        {
          heading: 'KOMUNIKASI',
          items: [
            { title: 'WhatsApp Wali Murid', path: '/admin/whatsapp', icon: <MessageSquare className="w-5 h-5" />, badge: 12 },
            { title: 'Broadcast', path: '/admin/broadcast', icon: <Megaphone className="w-5 h-5" /> },
            { title: 'Pengumuman', path: '/admin/pengumuman', icon: <ScrollText className="w-5 h-5" /> },
            { title: 'Template Pesan', path: '/admin/template', icon: <PenTool className="w-5 h-5" /> },
          ]
        },
        {
          heading: 'LAPORAN',
          items: [
            { title: 'Laporan Siswa', path: '/admin/laporan-siswa', icon: <BarChart className="w-5 h-5" /> },
            { title: 'Laporan Kelas', path: '/admin/laporan-kelas', icon: <BarChart className="w-5 h-5" /> },
            { title: 'Laporan Tutor', path: '/admin/laporan-tutor', icon: <BarChart className="w-5 h-5" /> },
            { title: 'Laporan Keuangan', path: '/admin/laporan-keuangan', icon: <LineChart className="w-5 h-5" /> },
            { title: 'Laporan Operasional', path: '/admin/laporan-operasional', icon: <BarChart className="w-5 h-5" /> },
            { title: 'Laporan Akademik (Read Only)', path: '/admin/laporan', icon: <ScrollText className="w-5 h-5" /> },
          ]
        },
        {
          heading: 'SISTEM',
          items: [
            { title: 'Role & Permission', path: '/admin/role', icon: <Settings className="w-5 h-5" /> },
            { title: 'Tahun Ajaran', path: '/admin/tahun-ajaran', icon: <Calendar className="w-5 h-5" /> },
            { title: 'Data Master', path: '/admin/data-master', icon: <Settings className="w-5 h-5" /> },
            { title: 'Audit Log', path: '/admin/audit', icon: <ScrollText className="w-5 h-5" /> },
          ]
        },
      ];
    default:
      return [];
  }
};

const isItemActive = (pathname: string, path: string) => pathname === path || pathname.startsWith(`${path}/`);

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const currentRole = user?.role || 'siswa';
  
  const sections = getSidebarItems(currentRole);
  const allItems = sections.flatMap(s => s.items);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const isSiswa = currentRole === 'siswa';
  const profilePath = `/${currentRole}/profil`;
  const settingsPath = `/${currentRole}/pengaturan`;
  const displayName = user?.name || (isSiswa ? STUDENT.name : 'Pengguna');
  const isGuru = currentRole === 'guru';
  const displaySub = isSiswa ? STUDENT.level : isGuru ? 'Guru' : 'Administrator';
  const avatarSrc = isSiswa ? STUDENT.avatar : isGuru ? TUTOR.avatar : undefined;
  const termLabel = isGuru ? TUTOR.term : 'Tahun Ajaran 2024/2025';
  const handleLogout = () => { logout(); navigate('/login'); };

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
      const currentIndex = allItems.findIndex(item => isItemActive(location.pathname, item.path));
      if (currentIndex !== -1) {
        if (isLeftSwipe && currentIndex < allItems.length - 1) {
          navigate(allItems[currentIndex + 1].path);
        } else if (isRightSwipe && currentIndex > 0) {
          navigate(allItems[currentIndex - 1].path);
        }
      }
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#F7F9FD] flex flex-col md:flex-row pb-16 md:pb-0 portal-font"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Sidebar (Desktop) */}
      <aside className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 z-40 bg-white border-r border-slate-200/70 transition-[width] duration-200 shrink-0",
        isCollapsed ? "w-[76px]" : "w-[280px]"
      )}>
        <div className={cn("h-16 flex items-center shrink-0 mt-2 mb-2", isCollapsed ? "justify-center px-2" : "px-5")}>
          <Link to={isSiswa ? '/siswa/dashboard' : '/'} className="flex items-center" title="LearnSpace+ by StudyHack">
            <Logo size={isCollapsed ? "md" : "xl"} showText={!isCollapsed} />
          </Link>
        </div>

        <div className="flex-1 py-2 px-3 flex flex-col overflow-y-auto custom-scrollbar">
          {sections.map((section, idx) => (
            <div key={idx} className="mb-3 last:mb-0">
              {section.heading && !isCollapsed && (
                <p className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wide px-3 mt-1 mb-1.5">
                  {section.heading}
                </p>
              )}
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const isActive = isItemActive(location.pathname, item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      title={isCollapsed ? item.title : undefined}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-[13.5px]",
                        isCollapsed && "justify-center",
                        isActive
                          ? (isSiswa ? "bg-[#EAF1FF] text-[#1D4ED8] font-bold" : "bg-[#1D4ED8] text-white font-bold")
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-semibold"
                      )}
                    >
                      <span className={cn("relative", isActive ? (isSiswa ? "text-[#1D4ED8]" : "text-white") : "text-slate-600")}>
                        {item.icon}
                        {isCollapsed && item.badge !== undefined && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />}
                      </span>
                      {!isCollapsed && <span className="truncate flex-1">{item.title}</span>}
                      {!isCollapsed && item.badge !== undefined && (
                        <span className="min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{item.badge}</span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 shrink-0">
          {isSiswa && !isCollapsed && (
            <div className="rounded-2xl border border-slate-200 bg-white p-3 mb-3 flex items-end gap-2 overflow-hidden">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-extrabold text-[#1D4ED8] mb-1">Belajar di mana saja!</p>
                <p className="text-[11px] text-slate-600 font-medium leading-snug mb-2.5">Akses semua materi lewat aplikasi LearnSpace+</p>
                <button
                  onClick={() => toast.info('Aplikasi LearnSpace+', { description: 'Segera tersedia di Google Play & App Store.' })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1D4ED8] hover:bg-blue-800 text-white text-[11px] font-bold transition-colors"
                >
                  <Smartphone className="w-3.5 h-3.5" /> Download App
                </button>
              </div>
              <img src="/assets/portal/app-phone.png" alt="" className="w-14 h-auto shrink-0 -mb-1" />
            </div>
          )}
          {currentRole === 'admin' && !isCollapsed && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 mb-2 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-extrabold flex items-center justify-center shrink-0">{displayName[0]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-extrabold text-[#0F1E4A] truncate">{displayName}</p>
                <p className="text-[11px] text-slate-500 font-medium">Administrator</p>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Online</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            title="Keluar"
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-[13.5px] font-bold",
              isCollapsed && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/40 z-50 flex items-center justify-around px-2 py-2 h-16 safe-area-bottom">
        {allItems.slice(0, 4).map((item) => {
          const isActive = isItemActive(location.pathname, item.path);
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
              {allItems.slice(4).map((item) => {
                const isActive = isItemActive(location.pathname, item.path);
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
        <header className="h-16 bg-[#F7F9FD]/90 backdrop-blur sticky top-0 z-30 flex items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Link to="/" className="md:hidden flex items-center">
              <Logo size="sm" showText={false} />
            </Link>
            <button
              onClick={() => setIsCollapsed((v) => !v)}
              aria-label="Ciutkan menu"
              className="hidden md:flex w-10 h-10 items-center justify-center rounded-xl text-slate-700 hover:bg-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
              className="flex-1 max-w-[520px] flex items-center gap-3 px-4 h-10 rounded-full bg-white hover:bg-slate-50 text-slate-400 transition-colors border border-slate-200"
            >
              <Search className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium truncate text-left flex-1">{currentRole === 'admin' ? 'Cari siswa, tutor, kelas, atau transaksi...' : 'Cari materi, tugas, kelas, atau topik...'}</span>
              <kbd className="hidden sm:inline-flex px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded text-[10px] font-bold border border-slate-200">
                Ctrl K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {!isSiswa && (
              <button
                onClick={() => toast.info(termLabel, { description: 'Periode aktif. Periode lain dapat dipilih setelah diatur Admin.' })}
                className="hidden lg:flex items-center gap-2 h-10 px-3.5 rounded-xl bg-white border border-slate-200 text-[13px] font-bold text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                <CalendarDays className="w-4 h-4 text-[#1D4ED8]" /> {termLabel} <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>
            )}
            <NotificationDropdown />
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen((v) => !v)}
                className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-full hover:bg-white transition-colors"
              >
                {avatarSrc ? (
                  <img src={avatarSrc} alt="" className="w-10 h-10 rounded-full object-cover bg-blue-50" />
                ) : (
                  <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">{displayName[0]}</span>
                )}
                <span className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-sm font-bold text-slate-900">{displayName}</span>
                  <span className="text-xs text-slate-500 font-medium">{displaySub}</span>
                </span>
                <ChevronDown className="w-4 h-4 text-slate-500 hidden sm:block" />
              </button>
              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 z-50">
                    <Link to={profilePath} onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2.5 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                      <UserCircle className="w-4 h-4" /> Profil Saya
                    </Link>
                    <Link to={settingsPath} onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2.5 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                      <Settings className="w-4 h-4" /> Pengaturan
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4" /> Keluar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 pb-6 md:px-6 pt-1">
          {children}
        </div>
      </main>
    </div>
  );
}
