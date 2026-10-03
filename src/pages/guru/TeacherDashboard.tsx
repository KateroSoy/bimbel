import { Link } from 'react-router-dom';
import { CalendarDays, ClipboardCheck, Users, ArrowRight, BookOpen, FileText, Clock, Megaphone, Activity, ArrowDown, ArrowUp, User } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Panel, Avatar, Btn, Badge } from '../../components/portal/Kit';
import { useAppStore } from '../../store/useAppStore';
import { useDataStore } from '../../store/useDataStore';
import { TUTOR, TODAY_CLASSES, ATTENTION, ANNOUNCEMENTS, MATERIALS, MY_STUDENTS } from '../../data/guruPortal';
import { cn } from '../../lib/utils';

const More = ({ to, children }: { to: string; children: string }) => (
  <Link to={to} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1D4ED8] hover:underline whitespace-nowrap">{children} <ArrowRight className="w-4 h-4" /></Link>
);
const DOT: Record<string, string> = { Berlangsung: 'bg-emerald-500', '30 menit lagi': 'bg-orange-400' };

export default function TeacherDashboard() {
  const { user } = useAppStore();
  const { assignments, submissions } = useDataStore();
  const firstName = (user?.name || TUTOR.name).split(/[ ,]/)[0];

  const toGrade = submissions.filter((s) => s.status === 'Perlu Dinilai').length;
  const active = assignments.filter((a) => a.status === 'Aktif').sort((a, b) => a.deadline.localeCompare(b.deadline));
  const risky = ATTENTION.filter((a) => a.risk.startsWith('Risiko'));
  const drafts = MATERIALS.filter((m) => m.status === 'Draft').length;
  const avgScore = Math.round(MY_STUDENTS.reduce((a, s) => a + s.score, 0) / MY_STUDENTS.length);
  const avgAttendance = Math.round(MY_STUDENTS.reduce((a, s) => a + s.attendance, 0) / MY_STUDENTS.length);

  const top = [
    { icon: CalendarDays, bg: '#EAF1FF', fg: '#1D4ED8', value: TODAY_CLASSES.length, label: 'Kelas Hari Ini', link: 'Lihat Jadwal', to: '/guru/jadwal' },
    { icon: ClipboardCheck, bg: '#E7F8EE', fg: '#16A34A', value: toGrade, label: 'Tugas Perlu Dinilai', link: 'Nilai Sekarang', to: '/guru/tugas' },
    { icon: Users, bg: '#FFF1E6', fg: '#F97316', value: risky.length, label: 'Siswa Perlu Perhatian', link: 'Lihat Siswa', to: '/guru/progress-siswa' },
  ];
  const todo = [
    { icon: CalendarDays, color: '#1D4ED8', value: toGrade, label: 'Tugas belum dinilai', to: '/guru/tugas' },
    { icon: Users, color: '#F97316', value: risky.length, label: 'Siswa perlu perhatian', to: '/guru/progress-siswa' },
    { icon: BookOpen, color: '#1D4ED8', value: 2, label: 'Kelas belum disiapkan', to: '/guru/kelas' },
    { icon: FileText, color: '#16A34A', value: drafts, label: 'Materi belum siap', to: '/guru/course' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1300px]">
        <div>
          <h1 className="text-2xl md:text-[26px] font-extrabold text-[#0F1E4A] tracking-tight">Selamat pagi, {firstName} 👋</h1>
          <p className="text-sm text-slate-600 font-medium mt-0.5">{TUTOR.today}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {top.map((c) => (
            <Panel key={c.label} className="!p-5">
              <div className="flex items-start gap-4">
                <span className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: c.bg, color: c.fg }}><c.icon className="w-7 h-7" /></span>
                <div>
                  <p className="text-[28px] font-extrabold text-[#0F1E4A] leading-none">{c.value}</p>
                  <p className="text-sm text-slate-700 font-semibold mt-1.5 mb-2">{c.label}</p>
                  <More to={c.to}>{c.link}</More>
                </div>
              </div>
            </Panel>
          ))}
        </div>

        <div className="rounded-2xl border border-blue-100 bg-[#F4F8FF] px-5 py-3.5 flex flex-col lg:flex-row lg:items-center gap-3">
          <p className="text-sm font-extrabold text-[#0F1E4A] lg:w-36 shrink-0">Perlu tindakan</p>
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {todo.map((t, i) => (
              <Link key={t.label} to={t.to} className={cn('flex items-center gap-2.5 group', i > 0 && 'lg:pl-4 lg:border-l lg:border-blue-100')}>
                <t.icon className="w-6 h-6 shrink-0" style={{ color: t.color }} />
                <span className="flex-1 min-w-0"><span className="block text-base font-extrabold text-[#0F1E4A] leading-tight">{t.value}</span><span className="block text-xs text-slate-600 font-medium truncate">{t.label}</span></span>
                <ArrowRight className="w-4 h-4 text-[#1D4ED8] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,5fr)_minmax(0,4fr)] gap-4">
          <Panel title={<span className="flex items-center gap-2"><CalendarDays className="w-5 h-5 text-[#1D4ED8]" /> Kelas Hari Ini</span>} action={<More to="/guru/jadwal">Lihat Semua Jadwal</More>}>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px] min-w-[520px]">
                <thead><tr className="text-xs text-slate-600 font-bold border-b border-slate-100">{['Waktu', 'Kelas', 'Mata Pelajaran', 'Status', 'Aksi'].map((h) => <th key={h} className="text-left py-2 px-1.5">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {TODAY_CLASSES.map((c) => (
                    <tr key={c.time}>
                      <td className="py-2.5 px-1.5 font-bold text-[#0F1E4A] whitespace-nowrap">{c.time}</td>
                      <td className="px-1.5 font-bold text-[#0F1E4A]">{c.kelas}</td>
                      <td className="px-1.5 text-slate-600 font-medium">{c.subject}</td>
                      <td className="px-1.5">
                        <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 whitespace-nowrap">
                          <span className={cn('w-2 h-2 rounded-full', DOT[c.status] ?? 'bg-slate-400')} />
                          {DOT[c.status] ? <Badge tone={c.status === 'Berlangsung' ? 'green' : 'orange'}>{c.status}</Badge> : c.status}
                        </span>
                      </td>
                      <td className="px-1.5"><Btn size="sm" variant={c.action === 'Buka Kelas' ? 'primary' : 'outline'} to={c.action === 'Detail' ? `/guru/kelas/${c.classId}` : '/guru/absensi'} className="w-[92px]">{c.action}</Btn></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title={<span className="flex items-center gap-2"><User className="w-5 h-5 text-[#1D4ED8]" /> Siswa Perlu Perhatian</span>} action={<More to="/guru/progress-siswa">Lihat Semua</More>}>
            <ul className="divide-y divide-slate-100">
              {risky.slice(0, 3).map((s) => (
                <li key={s.id} className="flex items-center gap-3 py-2.5">
                  <Avatar name={s.name} size={40} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-[#0F1E4A] truncate">{s.name}</p>
                    <p className="text-xs text-slate-600 font-medium truncate">{s.stats[0][0]}: {s.stats[0][1]} · {s.note}</p>
                  </div>
                  <span className={cn('flex items-center gap-1 text-xs font-bold', s.trend < 0 ? 'text-red-600' : 'text-emerald-600')}>{s.trend}% {s.trend < 0 ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Panel title={<span className="flex items-center gap-2"><Clock className="w-5 h-5 text-orange-500" /> Deadline Terdekat</span>} action={<More to="/guru/tugas">Lihat Semua</More>}>
            {active.length === 0 && <p className="text-xs text-slate-500 font-medium">Tidak ada tugas aktif.</p>}
            <ul className="space-y-2">
              {active.slice(0, 4).map((a) => (
                <li key={a.id}>
                  <Link to={`/guru/tugas/${a.id}`} className="flex items-center justify-between gap-3 text-[13px] hover:text-[#1D4ED8]">
                    <span className="font-bold text-[#0F1E4A] truncate">• {a.title}</span>
                    <span className="text-slate-600 font-medium whitespace-nowrap">{new Date(a.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title={<span className="flex items-center gap-2"><Megaphone className="w-5 h-5 text-[#1D4ED8]" /> Pengumuman Terbaru</span>} action={<More to="/guru/pengumuman">Lihat Semua</More>}>
            <ul className="space-y-2.5">
              {ANNOUNCEMENTS.slice(0, 3).map((a, i) => (
                <li key={a.id} className="flex gap-2.5">
                  <span className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', ['bg-[#1D4ED8]', 'bg-emerald-500', 'bg-orange-400'][i])} />
                  <div className="min-w-0"><p className="text-[13px] font-bold text-[#0F1E4A] truncate">{a.title}</p><p className="text-[11px] text-slate-500 font-medium">{a.date} · {a.author}</p></div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title={<span className="flex items-center gap-2"><Activity className="w-5 h-5 text-[#1D4ED8]" /> Ringkasan</span>}>
            <div className="grid grid-cols-2 divide-x divide-slate-100 text-center">
              <div><p className="text-xs text-slate-600 font-semibold">Rata-rata Nilai</p><p className="text-3xl font-extrabold text-[#0F1E4A] my-1">{avgScore}<span className="text-sm font-bold text-slate-600"> /100</span></p><p className="text-xs text-slate-600 font-medium">Kelas Anda</p></div>
              <div><p className="text-xs text-slate-600 font-semibold">Kehadiran</p><p className="text-3xl font-extrabold text-[#0F1E4A] my-1">{avgAttendance}<span className="text-sm font-bold">%</span></p><p className="text-xs text-slate-600 font-medium">Rata-rata</p></div>
            </div>
          </Panel>
        </div>
      </div>
    </DashboardLayout>
  );
}
