import { Link } from 'react-router-dom';
import {
  Users, TrendingUp, Wallet, BookOpen, UserCheck, UserPlus, Zap, CalendarDays, Receipt, ClipboardCheck, MessageCircle,
  Megaphone, Mail, ChevronRight, Check, ShieldCheck, Package, FileText, CalendarPlus, Send, Info, LineChart as LineIcon,
  PieChart, Building2, GraduationCap, ArrowUp, ArrowDown,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PageHead, StatCards, Panel, LinkAction, Badge, Btn, Donut, KeyValues, soon, rupiah, TONE_HEX, type Stat, type Tone } from '../../components/portal/Kit';
import { TIME_SLOTS, todayIndex, type ScheduleEntry, type Workload, type RombelRow } from '../../data/adminPortal';
import { useFetch, useResource } from '../../store/useRemote';

interface Dash {
  students: { total: number; active: number; inactive: number; graduated: number; byProgram: Record<string, number> };
  registrations: { total: number; byStatus: Record<string, number> };
  staff: { tutors: number; absentToday: number };
  classes: { active: number; sessions: number; full: number };
  finance: { income: number; expense: number; billed: number; collected: number; outstanding: number; unpaidStudents: number; pendingVerification: number };
  notifications: { unread: number };
  growth: { m: string; baru: number; keluar: number }[];
}
const jt = (n: number) => (n >= 1e6 ? `Rp ${(n / 1e6).toFixed(1).replace('.', ',')} jt` : rupiah(n));
const PALETTE = ['#1D4ED8', '#16A34A', '#F59E0B', '#10B981', '#7C3AED', '#EC4899', '#0EA5B7'];

const QUICK = [
  { label: 'Tambah Siswa Baru', icon: UserPlus, tone: 'blue' as Tone, to: '/admin/siswa' }, { label: 'Buat Kelas Baru', icon: CalendarPlus, tone: 'green' as Tone, to: '/admin/kelas' },
  { label: 'Tagih SPP', icon: Receipt, tone: 'orange' as Tone, to: '/admin/keuangan' }, { label: 'Broadcast Wali Murid', icon: Send, tone: 'green' as Tone, to: '/admin/broadcast' },
  { label: 'Laporan Bulanan', icon: FileText, tone: 'purple' as Tone, to: '/admin/laporan-keuangan' }, { label: 'Inventaris', icon: Package, tone: 'teal' as Tone, to: '/admin/inventaris' },
];

const loadLabel = (pct: number) => (pct >= 85 ? 'Tinggi' : pct >= 60 ? 'Normal' : 'Rendah');

export default function AdminDashboard() {
  const d = useFetch<Dash>('/admin/dashboard');
  const schedule = useResource<ScheduleEntry>('schedules').rows;
  const workloads = useResource<Workload>('workloads').rows;
  const rombels = useResource<RombelRow>('rombels').rows.filter((r) => r.status === 'Aktif');
  const waLogs = useResource<{ id: string; status: string }>('whatsapp-logs').rows;

  const reg = d?.registrations.byStatus ?? {};
  const fin = d?.finance;
  const waiting = (reg['Dalam Proses'] ?? 0) + (reg['Menunggu Verifikasi'] ?? 0);
  const today = schedule.filter((s) => s.day === todayIndex()).sort((x, y) => x.slot - y.slot);
  const tutors = workloads.filter((w) => w.classCount > 0).slice(0, 5);
  const growth = d?.growth ?? [];
  const last = growth[growth.length - 1];
  const pct = (n: number, total: number) => `${n} (${((n / (total || 1)) * 100).toFixed(1).replace('.', ',')}%)`;

  const STATS: Stat[] = [
    { label: 'Siswa Aktif', value: d?.students.active ?? '–', sub: `${d?.students.total ?? 0} siswa terdaftar`, subTone: 'up', icon: Users, tone: 'blue', to: '/admin/siswa' },
    { label: 'Pendapatan Tercatat', value: jt(fin?.income ?? 0), sub: 'Pembayaran berhasil', subTone: 'up', icon: TrendingUp, tone: 'green', to: '/admin/laporan-keuangan' },
    { label: 'Belum Terbayar (Piutang)', value: jt(fin?.outstanding ?? 0), sub: `${fin?.unpaidStudents ?? 0} tagihan`, subTone: 'down', icon: Wallet, tone: 'orange', to: '/admin/keuangan' },
    { label: 'Kelas Aktif', value: d?.classes.active ?? '–', sub: `${d?.classes.sessions ?? 0} sesi / minggu`, icon: BookOpen, tone: 'purple', to: '/admin/kelas' },
    { label: 'Tutor Aktif', value: d?.staff.tutors ?? '–', sub: `${d?.staff.absentToday ?? 0} tidak hadir`, icon: UserCheck, tone: 'teal', to: '/admin/guru' },
    { label: 'Pendaftaran Siswa Baru', value: d?.registrations.total ?? '–', sub: `${reg.Diterima ?? 0} diterima`, subTone: 'up', icon: UserPlus, tone: 'red', to: '/admin/pendaftaran' },
  ];
  const ACTIONS: { icon: typeof Users; tone: Tone; text: string; sub: string; btn: string; to: string }[] = [
    { icon: Receipt, tone: 'red', text: `${fin?.unpaidStudents ?? 0} tagihan belum lunas`, sub: `Total ${rupiah(fin?.outstanding ?? 0)}`, btn: 'Lihat Tagihan', to: '/admin/keuangan' },
    { icon: ClipboardCheck, tone: 'orange', text: `${d?.staff.absentToday ?? 0} tutor / staff tidak hadir`, sub: 'Periksa kehadiran dan atur pengganti', btn: 'Periksa Absensi', to: '/admin/kehadiran-tutor' },
    { icon: UserPlus, tone: 'amber', text: `${waiting} pendaftaran menunggu proses`, sub: 'Verifikasi dan selesaikan pendaftaran', btn: 'Proses Pendaftaran', to: '/admin/pendaftaran' },
    { icon: Users, tone: 'blue', text: `${fin?.pendingVerification ?? 0} pembayaran menunggu verifikasi`, sub: 'Dilaporkan siswa, belum dikonfirmasi', btn: 'Verifikasi', to: '/admin/keuangan' },
    { icon: MessageCircle, tone: 'green', text: `${d?.notifications.unread ?? 0} notifikasi belum dibaca`, sub: 'Pembaruan terbaru dari sistem', btn: 'Buka Notifikasi', to: '/admin/notifikasi' },
  ];
  const FLOW: { count: number; label: string; tone: Tone }[] = [
    { count: d?.registrations.total ?? 0, label: 'Data Masuk', tone: 'green' }, { count: reg['Menunggu Verifikasi'] ?? 0, label: 'Verifikasi', tone: 'blue' },
    { count: reg['Dalam Proses'] ?? 0, label: 'Dalam Proses', tone: 'orange' }, { count: reg.Ditolak ?? 0, label: 'Ditolak / Batal', tone: 'purple' },
    { count: reg.Diterima ?? 0, label: 'Diterima', tone: 'green' },
  ];
  const PROGRAM_DIST = Object.entries(d?.students.byProgram ?? {}).map(([label, value], i) => (
    { label: label || 'Tanpa program', value, color: PALETTE[i % PALETTE.length], note: pct(value, d?.students.total ?? 0) }
  ));
  const fill = (r: RombelRow) => (r.capacity ? (r.students / r.capacity) * 100 : 0);
  const bucket = (f: (p: number) => boolean) => rombels.filter((r) => f(fill(r))).length;
  const CAPACITY = [
    { label: 'Penuh (100%)', value: bucket((v) => v >= 100), color: '#EF4444' }, { label: 'Hampir Penuh (80-99%)', value: bucket((v) => v >= 80 && v < 100), color: '#F97316' },
    { label: 'Normal (50-79%)', value: bucket((v) => v >= 50 && v < 80), color: '#1D4ED8' }, { label: 'Kurang Siswa (<50%)', value: bucket((v) => v < 50), color: '#10B981' },
  ].map((c) => ({ ...c, note: `${c.value} kelas` }));
  const waCount = (st: string) => waLogs.filter((l) => l.status === st).length;

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1500px]">
        <PageHead
          title="Selamat datang, Admin! 👋"
          subtitle="Kelola bimbel lebih mudah, semua informasi penting ada di sini."
          actions={<span className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-slate-800"><CalendarDays className="w-4 h-4 text-[#1D4ED8]" /> {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>}
        />
        <StatCards items={STATS} />

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <Panel title={<span className="flex items-center gap-2"><Zap className="w-4 h-4 text-orange-500" /> PERLU TINDAKAN</span>} action={<LinkAction to="/admin/notifikasi">Lihat Semua</LinkAction>}>
            <div className="space-y-2">
              {ACTIONS.map((a) => (
                <div key={a.text} className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5">
                  <span className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0" style={{ backgroundColor: TONE_HEX[a.tone] }}><a.icon className="w-4 h-4" /></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#0F1E4A] leading-snug">{a.text}</p>
                    <p className="text-[11px] text-slate-500 font-medium truncate">{a.sub}</p>
                  </div>
                  <Link to={a.to}><Badge tone={a.tone} className="py-1.5 px-2.5 hover:opacity-80">{a.btn}</Badge></Link>
                </div>
              ))}
            </div>
            <Link to="/admin/notifikasi" className="mt-3 flex items-center justify-center gap-1 text-[13px] font-bold text-[#1D4ED8] hover:underline">Lihat semua notifikasi <ChevronRight className="w-4 h-4" /></Link>
          </Panel>

          <Panel title={<span className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-[#1D4ED8]" /> JADWAL HARI INI</span>} action={<LinkAction to="/admin/jadwal-kelas">Lihat Semua</LinkAction>}>
            <div className="space-y-2">
              {today.length === 0 && <p className="text-xs text-slate-500 font-medium py-6 text-center">Tidak ada kelas terjadwal hari ini.</p>}
              {today.map((s) => {
                const [start, end] = TIME_SLOTS[s.slot].split(' - ');
                const [filled, cap] = s.fill.split('/').map(Number);
                return (
                  <div key={s.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5">
                    <div className="text-xs font-extrabold text-[#1D4ED8] leading-relaxed w-11 shrink-0">{start}<br />{end}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-extrabold text-[#0F1E4A] truncate">{s.kelas}</p>
                      <p className="text-[11px] text-slate-500 font-medium truncate">Tutor: {s.tutor} · {s.room}</p>
                    </div>
                    <Badge tone={filled >= cap ? 'orange' : 'green'}>{s.fill} siswa</Badge>
                  </div>
                );
              })}
            </div>
            <Link to="/admin/jadwal-kelas" className="mt-3 flex items-center justify-center gap-1 text-[13px] font-bold text-[#1D4ED8] hover:underline">Lihat jadwal lengkap <ChevronRight className="w-4 h-4" /></Link>
          </Panel>

          <div className="space-y-4 lg:col-span-2 xl:col-span-1">
            <Panel title={<span className="flex items-center gap-2"><Zap className="w-4 h-4 text-orange-500" /> ALUR PENDAFTARAN SISWA BARU</span>} action={<LinkAction to="/admin/pendaftaran">Lihat Semua</LinkAction>}>
              <div className="relative flex justify-between">
                <div className="absolute left-[8%] right-[8%] top-4 h-0.5 bg-slate-200" />
                {FLOW.map((f, i) => (
                  <Link to="/admin/pendaftaran" key={f.label} className="relative flex flex-col items-center gap-1 flex-1 min-w-0 px-0.5">
                    <span
                      className="w-8 h-8 rounded-full border-2 bg-white flex items-center justify-center"
                      style={i === FLOW.length - 1 ? { backgroundColor: TONE_HEX.green, borderColor: TONE_HEX.green, color: '#fff' } : { borderColor: TONE_HEX[f.tone], color: TONE_HEX[f.tone] }}
                    >
                      {i === FLOW.length - 1 ? <Check className="w-4 h-4" /> : <span className="w-2 h-2 rounded-full bg-current" />}
                    </span>
                    <span className="text-base font-extrabold text-[#0F1E4A]">{f.count}</span>
                    <span className="text-[10px] font-semibold text-slate-600 text-center leading-tight">{f.label}</span>
                  </Link>
                ))}
              </div>
              <div className="mt-3 flex justify-between rounded-xl border border-slate-100 px-3 py-2">
                <div><p className="text-[11px] text-slate-500 font-semibold">Total Pendaftar</p><p className="text-base font-extrabold text-[#0F1E4A]">{d?.registrations.total ?? 0}</p></div>
                <div className="text-right"><p className="text-[11px] text-slate-500 font-semibold">Diterima</p><p className="text-base font-extrabold text-emerald-600">{reg.Diterima ?? 0} siswa</p></div>
              </div>
            </Panel>

            <Panel title={<span className="flex items-center gap-2"><Users className="w-4 h-4 text-[#1D4ED8]" /> KOMUNIKASI</span>} action={<LinkAction to="/admin/whatsapp">Lihat Semua</LinkAction>}>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: MessageCircle, tone: 'green' as Tone, label: 'Pesan Terkirim', value: waCount('Terkirim'), sub: 'Ke wali murid' },
                  { icon: Mail, tone: 'orange' as Tone, label: 'Pesan Tertunda', value: waCount('Pending'), sub: 'Belum terkirim' },
                  { icon: Megaphone, tone: 'purple' as Tone, label: 'Pesan Gagal', value: waCount('Gagal'), sub: 'Perlu dikirim ulang' },
                  { icon: MessageCircle, tone: 'blue' as Tone, label: 'Total Pesan', value: waLogs.length, sub: 'Tercatat' },
                ].map((c) => (
                  <div key={c.label} className="rounded-xl border border-slate-100 p-2">
                    <p className="flex items-center gap-1 text-[10px] font-bold text-slate-600"><c.icon className="w-3.5 h-3.5 shrink-0" style={{ color: TONE_HEX[c.tone] }} /><span className="truncate">{c.label}</span></p>
                    <p className="text-base font-extrabold text-[#0F1E4A]">{c.value}</p>
                    <p className="text-[10px] text-slate-500 font-medium truncate">{c.sub}</p>
                  </div>
                ))}
              </div>
              <Link to="/admin/whatsapp" className="mt-3 flex items-center justify-center gap-2 h-9 rounded-lg bg-[#F4F8FF] text-[13px] font-bold text-[#1D4ED8] hover:bg-blue-100 transition-colors">
                <MessageCircle className="w-4 h-4 text-emerald-600" /> Buka WhatsApp Wali Murid
              </Link>
            </Panel>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Panel title={<span className="flex items-center gap-2"><LineIcon className="w-4 h-4 text-[#1D4ED8]" /> PERTUMBUHAN SISWA</span>}>
            <div className="flex gap-4 text-[11px] font-bold text-slate-600 mb-1">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-600" /> Siswa Baru</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-500" /> Siswa Keluar</span>
            </div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growth} margin={{ top: 6, right: 6, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="baru" name="Siswa Baru" stroke="#16A34A" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="keluar" name="Siswa Keluar" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {([[`Siswa Baru (${last?.m ?? '-'})`, last?.baru ?? 0, 'bulan ini', true], [`Siswa Keluar (${last?.m ?? '-'})`, last?.keluar ?? 0, 'bulan ini', false], ['Total Siswa Aktif', d?.students.active ?? 0, 'saat ini', true]] as const).map(([l, v, p, up]) => (
                <div key={l} className="rounded-xl border border-slate-100 p-2">
                  <p className="text-[10px] font-semibold text-slate-500 truncate">{l}</p>
                  <p className="text-base font-extrabold text-[#0F1E4A]">{v}</p>
                  <p className={`text-[11px] font-bold flex items-center ${up ? 'text-emerald-600' : 'text-red-600'}`}>{up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}{p}</p>
                </div>
              ))}
            </div>
          </Panel>

          {[
            { title: 'DISTRIBUSI SISWA PER PROGRAM', icon: PieChart, data: PROGRAM_DIST, total: ['Total Siswa', d?.students.total ?? 0] },
            { title: 'KAPASITAS KELAS', icon: Building2, data: CAPACITY, total: ['Total Rombel', rombels.length] },
          ].map((p) => (
            <Panel key={p.title} title={<span className="flex items-center gap-2"><p.icon className="w-4 h-4 text-[#1D4ED8]" /> {p.title}</span>}>
              <div className="flex items-center gap-3">
                <Donut data={p.data} center="" size={116} thickness={24} />
                <ul className="flex-1 space-y-1.5 min-w-0">
                  {p.data.map((d) => (
                    <li key={d.label} className="flex items-start gap-1.5 text-[11px]">
                      <span className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="min-w-0"><span className="font-bold text-slate-800 block truncate">{d.label}</span><span className="text-slate-500 font-medium">{d.note}</span></span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-3 flex justify-between rounded-xl border border-slate-100 px-3 py-2 text-[13px] font-extrabold text-[#0F1E4A]"><span>{p.total[0]}</span><span>{p.total[1]}</span></div>
            </Panel>
          ))}

          <Panel title={<span className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-[#1D4ED8]" /> BEBAN TUTOR</span>}>
            <table className="w-full text-xs">
              <thead><tr className="text-slate-500 font-bold"><th className="text-left py-1.5">Tutor</th><th>Kelas</th><th>Jam</th><th className="text-right">Beban</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {tutors.map((t) => (
                  <tr key={t.id}>
                    <td className="py-2 font-bold text-[#0F1E4A]">{t.name.split(',')[0]}</td>
                    <td className="text-center font-bold text-slate-700">{t.classCount}</td>
                    <td className="text-center font-bold text-slate-700">{t.hours}</td>
                    <td className="text-right"><Badge>{loadLabel(t.pct)}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link to="/admin/beban" className="mt-3 flex items-center justify-center gap-1 text-[13px] font-bold text-[#1D4ED8] hover:underline">Lihat semua tutor <ChevronRight className="w-4 h-4" /></Link>
          </Panel>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4">
          <Panel title="AKSES CEPAT">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {QUICK.map((q) => (
                <Link key={q.label} to={q.to} className="rounded-xl border border-slate-100 hover:border-blue-300 p-2.5 flex flex-col items-center gap-1.5 text-center transition-colors">
                  <q.icon className="w-6 h-6" style={{ color: TONE_HEX[q.tone] }} />
                  <span className="text-[11px] font-bold text-slate-700 leading-tight">{q.label}</span>
                </Link>
              ))}
            </div>
          </Panel>
          <Panel title={<span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#1D4ED8]" /> HAK AKSES</span>}>
            <div className="flex items-center justify-between gap-2">
              <div><p className="text-[13px] font-extrabold text-[#0F1E4A]">Admin Sekolah</p><p className="text-xs text-slate-500 font-medium">Akses penuh ke semua modul</p></div>
              <Btn variant="soft" size="sm" to="/admin/role">Kelola Role</Btn>
            </div>
          </Panel>
          <Panel title="INFORMASI SISTEM">
            <KeyValues rows={[['Aplikasi', 'LearnSpace+'], ['Data per', new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })], ['Status Server', d ? <span className="text-emerald-600">● Online</span> : <span className="text-slate-500">Menghubungkan…</span>]]} />
          </Panel>
        </div>

        <button onClick={() => soon('Panduan Admin')} className="w-full flex items-center gap-2 rounded-xl border border-blue-100 bg-[#F4F8FF] px-4 py-2.5 text-xs text-slate-700 font-medium text-left">
          <Info className="w-4 h-4 text-[#1D4ED8] shrink-0" /> <span><b>Tips:</b> Gunakan menu di sidebar untuk mengelola bimbel Anda dengan lebih detail dan efisien.</span>
        </button>
      </div>
    </DashboardLayout>
  );
}
