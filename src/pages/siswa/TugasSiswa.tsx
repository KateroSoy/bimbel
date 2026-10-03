import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, CalendarDays, CheckCircle2, Star, Search, Clock, ChevronRight, Info, Headphones, Lightbulb,
  Atom, Calculator, BookOpen, Trophy, ArrowRight, MessageCircle, ListChecks, PencilLine, Upload,
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, PageTitle, Pill } from '../../components/siswa/PortalUI';
import { cn } from '../../lib/utils';
import { useDataStore, type Assignment } from '../../store/useDataStore';
import { ADMIN_WA, TASK_MODE_LABEL, taskContentFor, type TaskMode } from '../../data/siswaPortal';

const NOW = new Date('2024-11-26T09:00'); // tanggal demo agar sisa waktu konsisten

const MODE_ICON: Record<TaskMode, typeof ListChecks> = { 'pilihan-ganda': ListChecks, isian: PencilLine, file: Upload };

const subjectVisual = (subject: string) => {
  const s = subject.toLowerCase();
  if (s.includes('fisika') || s.includes('science')) return { icon: Atom, fg: '#2563EB', bg: '#EAF1FF', tag: 'text-emerald-600' };
  if (s.includes('inggris') || s.includes('english')) return { icon: Headphones, fg: '#16A34A', bg: '#E9F8EF', tag: 'text-emerald-600' };
  if (s.includes('matematika') || s.includes('math')) return { icon: Calculator, fg: '#DC2626', bg: '#FDECEC', tag: 'text-emerald-600' };
  return { icon: BookOpen, fg: '#7C3AED', bg: '#F3EDFF', tag: 'text-emerald-600' };
};

const fmtDeadline = (iso: string) => {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':'),
    daysLeft: Math.ceil((d.getTime() - NOW.getTime()) / 86400000),
  };
};

export default function TugasSiswa() {
  const { assignments, submissions } = useDataStore();
  const [tab, setTab] = useState<'todo' | 'all' | 'done'>('todo');
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('Semua Mapel');

  const subOf = (a: Assignment) => submissions.find((s) => s.assignmentId === a.id); // server hanya mengirim pengumpulan milik siswa ini
  const todo = assignments.filter((a) => !subOf(a)?.submittedAt).sort((a, b) => a.deadline.localeCompare(b.deadline));
  const doneList = assignments.filter((a) => !!subOf(a)?.submittedAt);
  const graded = doneList.map((a) => subOf(a)?.score).filter((v): v is number => typeof v === 'number');
  const avg = graded.length ? Math.round(graded.reduce((x, y) => x + y, 0) / graded.length) : null;
  const nearest = todo[0] ? fmtDeadline(todo[0].deadline) : null;

  const subjects = ['Semua Mapel', ...Array.from(new Set(assignments.map((a) => a.subject)))];
  const matches = (a: Assignment) =>
    (subject === 'Semua Mapel' || a.subject === subject) &&
    (!query || `${a.title} ${a.subject}`.toLowerCase().includes(query.toLowerCase()));

  const showTodo = tab !== 'done' ? todo.filter(matches) : [];
  const showDone = tab !== 'todo' ? doneList.filter(matches) : [];

  const stats = [
    { label: 'PERLU DIKERJAKAN', value: `${todo.length}`, unit: 'tugas', note: 'Ayo selesaikan!', noteClass: 'text-[#1D4ED8]', icon: FileText, fg: '#1D4ED8', bg: '#EAF1FF' },
    { label: 'DEADLINE TERDEKAT', value: nearest ? `${nearest.date.replace(/ \d{4}$/, '')} · ${nearest.time}` : '-', unit: '', note: nearest ? `${Math.max(nearest.daysLeft, 0)} hari lagi` : 'Tidak ada', noteClass: 'text-red-600', icon: CalendarDays, fg: '#16A34A', bg: '#E9F8EF' },
    { label: 'SELESAI / DINILAI', value: `${doneList.length}`, unit: 'tugas', note: 'Terus pertahankan!', noteClass: 'text-slate-600', icon: CheckCircle2, fg: '#7C3AED', bg: '#F3EDFF' },
    { label: 'RATA-RATA NILAI', value: avg !== null ? `${avg} / 100` : '-', unit: '', note: avg !== null && avg >= 85 ? 'Sangat baik' : 'Belum ada nilai', noteClass: 'text-orange-600', icon: Star, fg: '#F97316', bg: '#FFF1E7' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
        <div className="min-w-0 space-y-3">
          <PageTitle title="Tugas & Asesmen" subtitle="Kerjakan tugas tepat waktu dan pantau hasil penilaian guru." />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map(({ label, value, unit, note, noteClass, icon: Icon, fg, bg }) => (
              <Card key={label} className="p-4 flex items-start gap-3">
                <span className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: bg, color: fg }}><Icon className="w-6 h-6" /></span>
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold text-[#0F1E4A] tracking-wide">{label}</p>
                  <p className="text-lg font-extrabold text-[#0F1E4A] leading-tight">{value} <span className="text-sm font-semibold">{unit}</span></p>
                  <p className={cn('text-xs font-bold mt-0.5', noteClass)}>{note}</p>
                </div>
              </Card>
            ))}
          </div>

          <Card>
            <div className="flex flex-wrap items-center gap-2 px-3 border-b border-slate-100">
              {([['todo', `Perlu Dikerjakan (${todo.length})`], ['all', `Semua (${assignments.length})`], ['done', `Selesai / Dinilai (${doneList.length})`]] as const).map(([k, l]) => (
                <button key={k} onClick={() => setTab(k)} className={cn('px-4 py-3.5 text-sm font-bold border-b-2 -mb-px', tab === k ? 'border-[#1D4ED8] text-[#1D4ED8]' : 'border-transparent text-slate-700')}>{l}</button>
              ))}
              <div className="flex-1" />
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari tugas..." className="h-9 w-44 pl-9 pr-3 rounded-lg border border-slate-200 text-sm" />
              </div>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="h-9 px-2 rounded-lg border border-slate-200 text-sm font-bold text-[#0F1E4A] my-2">
                {subjects.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="p-3 space-y-3">
              {showTodo.length > 0 && <p className="text-xs font-extrabold text-[#0F1E4A] px-1 pt-1">PRIORITAS - SEGERA DIKERJAKAN</p>}
              {showTodo.map((a, i) => {
                const v = subjectVisual(a.subject);
                const dl = fmtDeadline(a.deadline);
                const mode = taskContentFor(a.id, a.type).mode;
                const ModeIcon = MODE_ICON[mode];
                return (
                  <div key={a.id} className="rounded-xl border border-slate-200 p-3 flex flex-col md:flex-row md:items-center gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="w-6 h-6 rounded-md bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0 self-start">{i + 1}</span>
                      <span className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: v.bg, color: v.fg }}><v.icon className="w-7 h-7" /></span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-emerald-600">{a.subject}</p>
                        <p className="font-extrabold text-[#0F1E4A] leading-snug">{a.title}</p>
                        <p className="text-xs text-slate-500 font-medium">{a.kelas}</p>
                        <p className="text-xs text-slate-600 font-semibold flex items-center gap-1 mt-0.5"><ModeIcon className="w-3.5 h-3.5" /> {TASK_MODE_LABEL[mode]}</p>
                      </div>
                    </div>
                    <div className="md:border-l md:border-slate-100 md:px-5 md:w-48">
                      <p className="text-[11px] font-bold text-slate-500">DEADLINE</p>
                      <p className="text-sm font-extrabold text-[#0F1E4A]">{dl.date} · {dl.time}</p>
                      <p className="text-xs font-bold text-red-600 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {dl.daysLeft > 0 ? `${dl.daysLeft} hari lagi` : 'Lewat deadline'}</p>
                    </div>
                    <div className="md:border-l md:border-slate-100 md:pl-5 md:w-44 flex flex-col items-center gap-1.5">
                      <Pill tone="red">Belum Dimulai</Pill>
                      <Link to={`/siswa/tugas/${a.id}`} className="w-full h-9 rounded-lg bg-[#1D4ED8] hover:bg-blue-800 text-white text-sm font-bold flex items-center justify-center gap-1">
                        Kerjakan Tugas <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}

              {showDone.length > 0 && <p className="text-xs font-extrabold text-[#0F1E4A] px-1 pt-2">SELESAI / DINILAI</p>}
              {showDone.map((a) => {
                const v = subjectVisual(a.subject);
                const sub = subOf(a)!;
                return (
                  <div key={a.id} className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 flex flex-col md:flex-row md:items-center gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 self-start" />
                      <span className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: v.bg, color: v.fg }}><v.icon className="w-7 h-7" /></span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-emerald-600">{a.subject}</p>
                        <p className="font-extrabold text-[#0F1E4A] leading-snug">{a.title}</p>
                        <p className="text-xs text-slate-500 font-medium">{a.kelas}</p>
                      </div>
                    </div>
                    <div className="md:border-l md:border-emerald-100 md:px-5 md:w-48">
                      <p className="text-[11px] font-bold text-slate-500">DIKUMPULKAN</p>
                      <p className="text-sm font-extrabold text-[#0F1E4A]">{sub.submittedAt}</p>
                      <p className="text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Tepat Waktu</p>
                    </div>
                    <div className="md:border-l md:border-emerald-100 md:pl-5 md:w-44 flex flex-col items-center gap-1">
                      <Pill tone={sub.score !== null ? 'green' : 'blue'}>{sub.score !== null ? 'Selesai · Dinilai' : 'Menunggu Penilaian'}</Pill>
                      {sub.score !== null && <p className="text-2xl font-extrabold text-emerald-600">{sub.score} <span className="text-sm text-slate-500">/ 100</span></p>}
                      <Link to={`/siswa/tugas/${a.id}`} className="w-full h-8 rounded-lg border border-slate-200 bg-white text-xs font-bold text-[#1D4ED8] flex items-center justify-center gap-1">
                        Lihat Hasil & Feedback <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}

              {showTodo.length === 0 && showDone.length === 0 && (
                <p className="text-center text-sm text-slate-500 py-8">Tidak ada tugas pada filter ini.</p>
              )}

              <div className="rounded-xl bg-[#F5F8FF] px-3 py-2.5 flex items-center gap-2 text-sm text-slate-700 font-medium">
                <Info className="w-4 h-4 text-[#1D4ED8]" /> Tugas bisa berupa pilihan ganda, isian, atau upload file. Kumpulkan sebelum deadline untuk menghindari pengurangan nilai.
              </div>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-3">
          <Card className="p-4">
            <h2 className="font-extrabold text-[#0F1E4A] flex items-center gap-2"><CalendarDays className="w-5 h-5 text-[#1D4ED8]" /> Kalender Deadline</h2>
            <p className="text-xs text-slate-600 font-medium mb-3">Tugas aktif yang perlu dikerjakan.</p>
            <div className="border-l-2 border-red-200 ml-1.5 space-y-4">
              {todo.slice(0, 3).map((a) => {
                const dl = fmtDeadline(a.deadline);
                return (
                  <div key={a.id} className="relative pl-4">
                    <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-red-500 ring-2 ring-red-100" />
                    <div className="flex justify-between text-xs font-bold"><span className="text-red-600">{dl.date.replace(/ \d{4}$/, '')} · {dl.time}</span><span className="text-red-500">{Math.max(dl.daysLeft, 0)} hari lagi</span></div>
                    <p className="text-sm font-extrabold text-[#0F1E4A] mt-0.5">{a.title}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{a.subject} · {a.kelas}</p>
                  </div>
                );
              })}
              {todo.length === 0 && <p className="pl-4 text-sm text-slate-500">Tidak ada deadline aktif.</p>}
            </div>
            <button onClick={() => setTab('all')} className="w-full mt-3 text-sm font-bold text-[#1D4ED8] flex items-center justify-center gap-1 hover:underline">Lihat semua deadline <ArrowRight className="w-4 h-4" /></button>
          </Card>

          <Card className="p-4">
            <h2 className="font-extrabold text-[#0F1E4A] flex items-center gap-2"><Headphones className="w-5 h-5 text-[#1D4ED8]" /> Butuh Bantuan?</h2>
            <p className="text-sm text-slate-600 font-medium mt-1 mb-3">Jika ada pertanyaan terkait tugas, hubungi tutor.</p>
            <a href={`https://wa.me/${ADMIN_WA}?text=${encodeURIComponent('Halo, saya ingin bertanya tentang tugas.')}`} target="_blank" rel="noreferrer"
              className="h-10 rounded-xl border border-blue-200 bg-[#F5F8FF] text-sm font-bold text-[#1D4ED8] flex items-center justify-center gap-2 hover:bg-blue-50">
              <MessageCircle className="w-4 h-4" /> Hubungi Tutor
            </a>
          </Card>

          <Card className="p-4">
            <h2 className="font-extrabold text-[#0F1E4A] flex items-center gap-2 mb-2"><Lightbulb className="w-5 h-5 text-[#1D4ED8]" /> Tips Mengerjakan Tugas</h2>
            <ul className="space-y-1.5 text-sm text-slate-700 font-medium list-disc pl-5">
              <li>Kerjakan tugas lebih awal sebelum deadline.</li>
              <li>Baca instruksi dengan teliti.</li>
              <li>Pastikan file yang dikumpulkan benar.</li>
              <li>Periksa kembali sebelum submit.</li>
            </ul>
            {avg !== null && <p className="mt-3 text-xs font-bold text-orange-600 flex items-center gap-1"><Trophy className="w-4 h-4" /> Rata-rata nilaimu {avg} — pertahankan!</p>}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
