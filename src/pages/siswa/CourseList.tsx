import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CalendarDays, ArrowRight, Layers, PlayCircle, Clock, CheckCircle2, Info, X, Search } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, PageTitle, Pill, ProgressBar } from '../../components/siswa/PortalUI';
import { cn } from '../../lib/utils';
import { COURSES, STUDENT, courseStats, subjectById, type PortalCourse } from '../../data/siswaPortal';

type Status = 'Sedang Berjalan' | 'Belum Dimulai' | 'Selesai';

const statusOf = (c: PortalCourse): Status => {
  const { done, total } = courseStats(c);
  return done === 0 ? 'Belum Dimulai' : done === total ? 'Selesai' : 'Sedang Berjalan';
};

const LEVEL_TONE = { Mudah: 'orange', Sedang: 'blue', Sulit: 'purple' } as const;

export default function CourseList() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'Semua' | Status>('Semua');
  const [category, setCategory] = useState('Semua Kategori');
  const [sort, setSort] = useState<'progress' | 'az'>('progress');
  const [query, setQuery] = useState('');
  const [showTips, setShowTips] = useState(true);

  // Hanya mapel dari program yang diambil siswa
  const courses = COURSES;
  const counts = {
    'Sedang Berjalan': courses.filter((c) => statusOf(c) === 'Sedang Berjalan').length,
    'Belum Dimulai': courses.filter((c) => statusOf(c) === 'Belum Dimulai').length,
    'Selesai': courses.filter((c) => statusOf(c) === 'Selesai').length,
  };

  const categories = ['Semua Kategori', ...Array.from(new Set(courses.map((c) => c.category)))];
  const list = courses
    .filter((c) => tab === 'Semua' || statusOf(c) === tab)
    .filter((c) => category === 'Semua Kategori' || c.category === category)
    .filter((c) => !query || `${c.title} ${subjectById(c.subjectId).tutor}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => sort === 'az' ? a.title.localeCompare(b.title) : courseStats(b).percent - courseStats(a).percent);

  // Course terakhir dipelajari
  const current = courses.find((c) => c.lastStudied && statusOf(c) === 'Sedang Berjalan') ?? courses[0];
  const cs = courseStats(current);
  const nextLesson = current.chapters.flatMap((ch) => ch.lessons).find((l) => !l.done);

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] space-y-3">
        <PageTitle
          title="Course Saya"
          subtitle={`Belajar mandiri lewat modul dan video. Mata pelajaran mengikuti program kamu: ${STUDENT.program}.`}
        />

        {/* Sedang belajar */}
        <Card className="p-4 bg-[#F1FAF4] border-emerald-100">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <span className="w-20 h-20 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <BookOpen className="w-10 h-10" />
            </span>
            <div className="flex-1 min-w-0">
              <Pill tone="green">Sedang Belajar</Pill>
              <h2 className="text-lg font-extrabold text-[#0F1E4A] mt-1">{current.title}</h2>
              <p className="text-xs text-slate-500 font-medium">Materi berikutnya</p>
              <p className="text-sm font-bold text-[#0F1E4A]">{nextLesson?.title ?? 'Semua materi selesai'}</p>
              <p className="text-xs text-slate-600 font-medium mt-1">{cs.done} dari {cs.total} materi · {cs.percent}% selesai</p>
              <ProgressBar value={cs.percent} color="#16A34A" className="mt-1.5 max-w-sm" />
            </div>
            <div className="lg:border-l lg:border-emerald-100 lg:pl-6 flex items-start gap-2">
              <CalendarDays className="w-4 h-4 text-slate-500 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Terakhir dipelajari</p>
                <p className="text-sm font-bold text-[#0F1E4A]">{current.chapters[0].title}</p>
                <p className="text-xs text-slate-600 font-medium">{current.lastStudied}</p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/siswa/course/${current.id}${nextLesson ? `?materi=${nextLesson.id}` : ''}`)}
              className="flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold"
            >
              Lanjutkan Belajar <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Card>

        {/* Stats */}
        <Card className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-100 py-3">
          {[
            { v: `${courses.length} Course`, l: 'Total yang kamu ikuti', icon: Layers, c: '#1D4ED8' },
            { v: counts['Sedang Berjalan'], l: 'Sedang Berjalan', icon: PlayCircle, c: '#1D4ED8' },
            { v: counts['Belum Dimulai'], l: 'Belum Dimulai', icon: Clock, c: '#F97316' },
            { v: counts['Selesai'], l: 'Selesai', icon: CheckCircle2, c: '#16A34A' },
          ].map(({ v, l, icon: Icon, c }) => (
            <div key={l} className="flex items-center gap-3 px-5 py-1">
              <Icon className="w-8 h-8" style={{ color: c }} strokeWidth={1.6} />
              <div>
                <p className="text-lg font-extrabold text-[#0F1E4A] leading-tight">{v}</p>
                <p className="text-xs text-slate-500 font-medium">{l}</p>
              </div>
            </div>
          ))}
        </Card>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 px-3 pr-8 rounded-xl bg-white border border-slate-200 text-sm font-bold text-[#0F1E4A] min-w-[180px]">
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari course atau pengajar..." className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-slate-200 text-sm font-medium" />
          </div>
          <div className="flex-1" />
          <select value={sort} onChange={(e) => setSort(e.target.value as 'progress' | 'az')} className="h-10 px-3 pr-8 rounded-xl bg-white border border-slate-200 text-sm font-bold text-[#0F1E4A]">
            <option value="progress">Progress tertinggi</option>
            <option value="az">Nama A–Z</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['Semua', 'Sedang Berjalan', 'Belum Dimulai', 'Selesai'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={cn('h-8 px-4 rounded-full text-sm font-bold', tab === t ? 'bg-[#1D4ED8] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')}>
              {t} ({t === 'Semua' ? courses.length : counts[t]})
            </button>
          ))}
        </div>

        {/* Cards */}
        {list.length === 0 ? (
          <Card className="p-8 text-center text-sm text-slate-500 font-medium">Tidak ada course yang cocok.</Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {list.map((c) => {
              const s = subjectById(c.subjectId);
              const st = courseStats(c);
              const status = statusOf(c);
              const first = c.chapters.flatMap((ch) => ch.lessons).find((l) => !l.done);
              return (
                <Card key={c.id} className="p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-700">{c.category}</span>
                    <Pill tone={LEVEL_TONE[c.level]}>● {c.level}</Pill>
                  </div>
                  <span className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: s.soft, color: s.color }}>
                    <BookOpen className="w-7 h-7" />
                  </span>
                  <h3 className="font-extrabold text-[#0F1E4A] leading-snug min-h-[44px]">{c.title}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    <span className="font-bold" style={{ color: st.percent === 100 ? '#DC2626' : s.color }}>{st.percent}% selesai</span> · {st.done}/{st.total} materi
                  </p>
                  <ProgressBar value={st.percent} color={s.color} className="mt-1.5" />
                  {status === 'Selesai' && <Pill tone="green" className="mt-2 self-start">Selesai / Sertifikat tersedia</Pill>}
                  <div className="flex items-center gap-2 mt-4">
                    <img src={s.tutorAvatar} alt="" className="w-8 h-8 rounded-full object-cover bg-slate-100" />
                    <div>
                      <p className="text-[11px] text-slate-500 font-medium">Pengajar</p>
                      <p className="text-xs font-bold text-[#0F1E4A]">{s.tutor}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(status === 'Selesai' ? '/siswa/sertifikat' : `/siswa/course/${c.id}${first ? `?materi=${first.id}` : ''}`)}
                    className={cn('mt-4 h-9 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors border',
                      status === 'Belum Dimulai' ? 'bg-white' : 'text-white')}
                    style={status === 'Belum Dimulai' ? { borderColor: s.color, color: s.color } : { backgroundColor: s.color, borderColor: s.color }}
                  >
                    {status === 'Belum Dimulai' ? 'Mulai Belajar' : status === 'Selesai' ? 'Lihat Sertifikat' : 'Lanjutkan Belajar'} <ArrowRight className="w-4 h-4" />
                  </button>
                </Card>
              );
            })}
          </div>
        )}

        {showTips && (
          <Card className="px-4 py-3 bg-[#F5F8FF] border-blue-100 flex items-start gap-3">
            <span className="w-8 h-8 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center shrink-0"><Info className="w-4 h-4" /></span>
            <div className="flex-1">
              <p className="text-sm font-extrabold text-[#1D4ED8]">Tips Belajar</p>
              <p className="text-sm text-slate-700 font-medium">Tonton video, baca catatan, lalu kerjakan latihan soal di setiap bab untuk mengukur pemahamanmu!</p>
            </div>
            <button onClick={() => setShowTips(false)} aria-label="Tutup tips" className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
