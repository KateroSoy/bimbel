import { Link } from 'react-router-dom';
import {
  Star, ClipboardList, CalendarDays, BookOpen, CheckCircle2, MapPin, Video, Diamond, ArrowUp, ArrowDown,
  BarChart3, CircleCheck, Wallet, HelpCircle, Megaphone, School, Trophy, Medal, ArrowRight, Lock,
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardHeader, Pill, ProgressBar, SubjectBadge, statusTone } from '../../components/siswa/PortalUI';
import { useAppStore } from '../../store/useAppStore';
import { useDataStore } from '../../store/useDataStore';
import {
  STUDENT, SUBJECTS, LIVE_CLASSES, COURSES, BILLS, ANNOUNCEMENTS, ACHIEVEMENTS, ATTENDANCE,
  subjectById, canJoinLive, courseStats, rupiah,
} from '../../data/siswaPortal';

const QUICK_LINKS = [
  { label: 'Jadwal Live Tutor', to: '/siswa/jadwal', icon: CalendarDays, color: '#7C3AED' },
  { label: 'Tugas Terdekat', to: '/siswa/tugas', icon: ClipboardList, color: '#F97316' },
  { label: 'Hasil Belajar', to: '/siswa/nilai', icon: BarChart3, color: '#16A34A' },
  { label: 'Kehadiran', to: '/siswa/absensi', icon: CircleCheck, color: '#DC2626' },
  { label: 'Pembayaran', to: '/siswa/spp', icon: Wallet, color: '#0EA5E9' },
  { label: 'Bantuan', to: '/siswa/pengaturan', icon: HelpCircle, color: '#2563EB' },
];

export default function StudentDashboard() {
  const { user } = useAppStore();
  const { assignments, submissions } = useDataStore();
  const firstName = (user?.name || STUDENT.name).split(' ')[0];

  // Tugas terdekat = tugas aktif yang belum dikumpulkan, deadline paling dekat
  const pending = assignments
    .filter((a) => a.status === 'Aktif' && !submissions.some((s) => s.assignmentId === a.id && s.studentId === '1001'))
    .sort((a, b) => a.deadline.localeCompare(b.deadline));
  const nextTask = pending[0];

  const todayClasses = LIVE_CLASSES.filter((c) => c.dayName === 'Kamis');
  const nextLive = todayClasses.find((c) => c.status !== 'Selesai') ?? todayClasses[0];
  const nextLiveSubject = subjectById(nextLive.subjectId);
  const joinable = canJoinLive(nextLive);

  const currentCourse = COURSES[1];
  const currentStats = courseStats(currentCourse);
  const currentChapter = currentCourse.chapters.find((ch) => ch.lessons.some((l) => !l.done)) ?? currentCourse.chapters[0];

  const attended = ATTENDANCE.filter((a) => a.status === 'Hadir' || a.status === 'Terlambat').length;
  const attendancePct = Math.round((attended / ATTENDANCE.length) * 100);

  const currentBill = BILLS.find((b) => b.status === 'Lunas')!;

  const joinClass = () => {
    if (!joinable) {
      toast.info('Kelas belum dibuka', { description: 'Tombol aktif otomatis saat tutor membuka kelas.' });
      return;
    }
    window.open(nextLive.meetUrl, '_blank', 'noopener');
  };

  return (
    <DashboardLayout>
      <div className="space-y-2.5 max-w-[1400px]">
        {/* Welcome */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-extrabold text-[#0F1E4A] tracking-tight">Selamat datang kembali, {firstName}! 👋</h1>
            <p className="text-sm text-slate-700 font-medium">Semangat belajar hari ini, kamu pasti bisa!</p>
          </div>
          <div className="flex items-center gap-3 bg-[#FFF3EA] border border-orange-100 rounded-2xl pl-4 pr-2 py-1 lg:min-w-[400px] overflow-hidden">
            <Star className="w-6 h-6 text-orange-500 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-extrabold text-[#0F1E4A]">Ayo terus belajar!</p>
              <p className="text-xs text-slate-600 font-medium">Kamu punya {pending.length} tugas yang harus diselesaikan.</p>
            </div>
            <img src="/assets/portal/mascot-wave.png" alt="" className="h-11 w-auto mix-blend-multiply hidden sm:block" />
          </div>
        </div>

        {/* Top cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <Card className="p-3.5 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center"><ClipboardList className="w-4 h-4" /></span>
              <span className="text-[13px] font-bold text-orange-600">Tugas Terdekat</span>
            </div>
            {nextTask ? (
              <>
                <h3 className="font-extrabold text-[#0F1E4A] text-[15px] leading-snug line-clamp-1" title={nextTask.title}>{nextTask.title}</h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Deadline: {new Date(nextTask.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <Pill tone="red" className="mt-2 self-start">{nextTask.subject}</Pill>
                <Link to={`/siswa/tugas/${nextTask.id}`} className="mt-auto pt-2">
                  <span className="flex items-center justify-center gap-2 h-8 rounded-lg border border-orange-300 text-orange-600 text-sm font-bold hover:bg-orange-50 transition-colors">
                    <Diamond className="w-3.5 h-3.5 fill-current" /> Kerjakan Tugas
                  </span>
                </Link>
              </>
            ) : (
              <p className="text-sm text-slate-500 font-medium">Semua tugas sudah dikumpulkan. Hebat!</p>
            )}
          </Card>

          <Card className="p-3.5 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-lg bg-[#1D4ED8] text-white flex items-center justify-center"><CalendarDays className="w-4 h-4" /></span>
              <span className="text-[13px] font-bold text-[#1D4ED8]">Live Tutor Berikutnya</span>
            </div>
            <h3 className="font-extrabold text-[#0F1E4A] text-[15px]">{nextLiveSubject.className}</h3>
            <p className="text-xs text-slate-600 font-medium mt-1">{nextLive.dayName}, {nextLive.dateShort} · {nextLive.start} – {nextLive.end}</p>
            <p className="text-xs text-slate-600 font-medium mt-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {nextLive.room}</p>
            <button
              onClick={joinClass}
              className={`mt-auto pt-0 h-8 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${joinable ? 'bg-[#1D4ED8] hover:bg-blue-800 text-white' : 'bg-slate-100 text-slate-400'}`}
              style={{ marginTop: 'auto' }}
            >
              {joinable ? <Video className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              {joinable ? 'Masuk Kelas' : 'Menunggu Tutor'}
            </button>
          </Card>

          <Card className="p-3.5 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-lg bg-violet-600 text-white flex items-center justify-center"><BookOpen className="w-4 h-4" /></span>
              <span className="text-[13px] font-bold text-violet-700">Belajar Sekarang</span>
            </div>
            <h3 className="font-extrabold text-[#0F1E4A] text-[15px]">{currentChapter.title}</h3>
            <p className="text-xs text-slate-600 font-medium mt-1">{currentCourse.title}</p>
            <div className="flex items-center gap-2 mt-3">
              <ProgressBar value={currentStats.percent} color="#6D28D9" className="flex-1" />
              <span className="text-xs font-bold text-slate-700">{currentStats.percent}%</span>
            </div>
            <Link to={`/siswa/course/${currentCourse.id}`} className="mt-auto pt-2">
              <span className="flex items-center justify-center gap-2 h-8 rounded-lg bg-violet-700 hover:bg-violet-800 text-white text-sm font-bold transition-colors">
                <BookOpen className="w-4 h-4" /> Lanjutkan Belajar
              </span>
            </Link>
          </Card>

          <Card className="p-3.5 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle2 className="w-5 h-5" /></span>
                <span className="text-[13px] font-bold text-[#0F1E4A]">Kehadiran</span>
              </div>
              <Link to="/siswa/absensi" className="text-xs font-bold text-[#1D4ED8] hover:underline">Lihat Semua</Link>
            </div>
            <p className="text-[28px] font-extrabold text-[#0F1E4A] leading-none">{attendancePct}%</p>
            <p className="text-xs text-slate-600 font-medium mt-1">Kehadiran Bulan Ini</p>
            <Pill tone="green" className="mt-2 self-start"><ArrowUp className="w-3 h-3" /> 4%</Pill>
            <Link to="/siswa/absensi" className="mt-auto pt-2">
              <span className="flex items-center justify-center h-8 rounded-lg border border-emerald-300 text-emerald-700 text-sm font-bold hover:bg-emerald-50 transition-colors">
                Lihat Kehadiran
              </span>
            </Link>
          </Card>
        </div>

        {/* Middle */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-3">
          <div className="space-y-3 min-w-0">
            <Card className="p-3.5">
              <CardHeader title="Perkembangan Belajarmu" action={<Link to="/siswa/nilai" className="text-xs font-bold text-[#1D4ED8] hover:underline">Lihat Detail</Link>} />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {SUBJECTS.map((s) => (
                  <div key={s.id} className="rounded-xl border border-slate-200 px-3 py-2.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <SubjectBadge subject={s} size="sm" />
                      <span className="text-xs font-bold text-slate-800 truncate">{s.name}</span>
                    </div>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-xl font-extrabold text-[#0F1E4A]">{s.progress}%</span>
                      <span className={`text-[11px] font-bold flex items-center ${s.trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {s.trend >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}{Math.abs(s.trend)}%
                      </span>
                    </div>
                    <ProgressBar value={s.progress} color={s.color} />
                    <Pill tone={statusTone(s.status)} className="mt-1.5">{s.status}</Pill>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="px-3.5 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <CardHeader title="Akses Cepat" className="mb-0" />
              <div className="flex flex-wrap gap-1.5">
                {QUICK_LINKS.map(({ label, to, icon: Icon, color }) => (
                  <Link key={label} to={to} className="flex items-center gap-1.5 px-2.5 h-8 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition-colors">
                    <Icon className="w-4 h-4" style={{ color }} /> {label}
                  </Link>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-3.5 flex flex-col">
            <CardHeader title="Jadwal Live Tutor Hari Ini" action={<Link to="/siswa/jadwal" className="text-xs font-bold text-[#1D4ED8] hover:underline">Lihat Semua</Link>} />
            <div className="space-y-2.5 flex-1">
              {todayClasses.map((c) => {
                const s = subjectById(c.subjectId);
                return (
                  <div key={c.id} className="flex items-start gap-2.5">
                    <CalendarDays className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-700">{c.start} – {c.end}</p>
                      <p className="text-sm font-extrabold text-[#0F1E4A] truncate">{s.className}</p>
                    </div>
                    <Pill tone={statusTone(c.status)} className="mt-2">{c.status === 'Berlangsung' ? 'Berlangsung' : c.status}</Pill>
                  </div>
                );
              })}
            </div>
            <Link to="/siswa/jadwal" className="mt-2 flex items-center justify-center gap-2 h-8 rounded-lg bg-[#EAF1FF] text-[#1D4ED8] text-sm font-bold hover:bg-blue-100 transition-colors">
              <CalendarDays className="w-4 h-4" /> Lihat Jadwal Lengkap
            </Link>
          </Card>
        </div>

        {/* Bottom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="p-3.5">
            <CardHeader title="Pengumuman Terbaru" action={<Link to="/siswa/pengumuman" className="text-xs font-bold text-[#1D4ED8] hover:underline">Lihat Semua</Link>} />
            <div className="space-y-2.5">
              {ANNOUNCEMENTS.map((a, i) => (
                <div key={a.title} className="flex gap-2.5">
                  {i === 0 ? <Megaphone className="w-5 h-5 text-orange-500 shrink-0" /> : <School className="w-5 h-5 text-[#1D4ED8] shrink-0" />}
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-[#0F1E4A] truncate" title={a.desc}>{a.title}</p>
                    <p className="text-[11px] text-slate-500 font-medium truncate">{a.date} · {a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-3.5">
            <CardHeader title="Pencapaian Terbaru" action={<Link to="/siswa/nilai" className="text-xs font-bold text-[#1D4ED8] hover:underline">Lihat Semua</Link>} />
            <div className="grid grid-cols-2 gap-2">
              {ACHIEVEMENTS.map((a, i) => (
                <div key={a.title} className="flex items-center gap-2 rounded-xl bg-slate-50 px-2.5 py-1.5 min-w-0">
                  {i === 0 ? <Trophy className="w-5 h-5 text-orange-500" /> : <Medal className="w-5 h-5 text-[#1D4ED8]" />}
                  <div>
                    <p className="text-[13px] font-bold text-[#0F1E4A] truncate">{a.title}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-3.5 bg-gradient-to-br from-white to-[#F2F6FF]">
            <CardHeader title="Status Pembayaran SPP" />
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-[#0F1E4A]">{currentBill.title}</p>
              <Pill tone="green"><CheckCircle2 className="w-3 h-3" /> Lunas</Pill>
            </div>
            <p className="text-xl font-extrabold text-[#0F1E4A] mt-0.5">{rupiah(currentBill.amount)} <span className="text-xs text-slate-600 font-medium">· dibayar {currentBill.paidAt?.split(',')[0]}</span></p>
            <Link to="/siswa/spp" className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-[#1D4ED8] hover:underline">
              Lihat Riwayat Pembayaran <ArrowRight className="w-4 h-4" />
            </Link>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
