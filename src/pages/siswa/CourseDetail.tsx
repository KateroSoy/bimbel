import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ChevronRight, ArrowLeft, ArrowRight, Play, Pause, Maximize, Captions, FileText, FileQuestion, PenSquare,
  PlayCircle, Download, Lock, ChevronDown, CheckCircle2, BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, ProgressBar } from '../../components/siswa/PortalUI';
import { cn } from '../../lib/utils';
import { COURSES, subjectById, type CourseLesson, type LessonKind } from '../../data/siswaPortal';

const KIND_META: Record<LessonKind, { label: string; icon: typeof PlayCircle; color: string; bg: string }> = {
  video: { label: 'Video', icon: PlayCircle, color: '#1D4ED8', bg: '#EAF1FF' },
  catatan: { label: 'Catatan', icon: FileText, color: '#16A34A', bg: '#E9F8EF' },
  contoh: { label: 'Contoh', icon: FileQuestion, color: '#F97316', bg: '#FFF1E7' },
  latihan: { label: 'Latihan', icon: PenSquare, color: '#7C3AED', bg: '#F3EDFF' },
};

const TABS: { kind: LessonKind; label: string }[] = [
  { kind: 'video', label: 'Video' },
  { kind: 'catatan', label: 'Catatan' },
  { kind: 'contoh', label: 'Contoh Soal' },
  { kind: 'latihan', label: 'Latihan Soal' },
];

const VIDEO_SECONDS = 600;
const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const course = COURSES.find((c) => c.id === id) ?? COURSES[0];
  const subject = subjectById(course.subjectId);

  const allLessons = useMemo(() => course.chapters.flatMap((ch) => ch.lessons.map((l) => ({ ...l, chapterId: ch.id, locked: !!ch.locked }))), [course]);
  const [done, setDone] = useState<Set<string>>(() => new Set(allLessons.filter((l) => l.done).map((l) => l.id)));
  const firstOpen = allLessons.find((l) => !l.done && !l.locked) ?? allLessons[0];
  const lesson = allLessons.find((l) => l.id === params.get('materi')) ?? firstOpen;
  const chapter = course.chapters.find((ch) => ch.id === lesson.chapterId)!;
  const chapterLessons = allLessons.filter((l) => l.chapterId === chapter.id);
  const idx = allLessons.findIndex((l) => l.id === lesson.id);
  const prev = allLessons[idx - 1];
  const next = allLessons[idx + 1];

  const [openChapters, setOpenChapters] = useState<Set<string>>(new Set([chapter.id]));
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => { setPlaying(false); setTime(0); setOpenChapters((s) => new Set(s).add(chapter.id)); }, [lesson.id, chapter.id]);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setTime((v) => Math.min(VIDEO_SECONDS, v + 5)), 250); // demo: diputar dipercepat
    return () => clearInterval(t);
  }, [playing]);

  useEffect(() => {
    if (time >= VIDEO_SECONDS) { setPlaying(false); markDone(lesson.id); }
  }, [time]); // eslint-disable-line react-hooks/exhaustive-deps

  const markDone = (lessonId: string) => {
    if (done.has(lessonId)) return;
    setDone((s) => new Set(s).add(lessonId));
    toast.success('Materi ditandai selesai');
  };

  const goTo = (l: (typeof allLessons)[number] | undefined) => {
    if (!l) return;
    if (l.locked) { toast.info('Bab ini akan terbuka setelah bab sebelumnya selesai.'); return; }
    setParams({ materi: l.id });
  };

  const totalDone = allLessons.filter((l) => done.has(l.id)).length;
  const chapterDone = chapterLessons.filter((l) => done.has(l.id)).length;
  const chapterPct = Math.round((chapterDone / chapterLessons.length) * 100);
  const hasPoster = course.subjectId === 'math' && lesson.kind === 'video';

  const tabLesson = (kind: LessonKind): CourseLesson | undefined => chapterLessons.find((l) => l.kind === kind);

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
        <div className="min-w-0 space-y-3">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-600">
            <Link to="/siswa/course" className="hover:text-[#1D4ED8]">Course Saya</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1D4ED8]">{course.title}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0F1E4A]">{chapter.title}</span>
          </nav>

          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-[22px] font-extrabold text-[#0F1E4A]">{lesson.title}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm font-semibold text-slate-700">
                <span className="px-2 py-0.5 rounded-md text-xs font-bold" style={{ backgroundColor: KIND_META[lesson.kind].bg, color: KIND_META[lesson.kind].color }}>{KIND_META[lesson.kind].label}</span>
                <span>{lesson.duration}</span>
                <span className="text-slate-400">•</span>
                <span>Materi {chapterLessons.findIndex((l) => l.id === lesson.id) + 1} dari {chapterLessons.length}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">{chapterPct}% Selesai</span>
              <ProgressBar value={chapterPct} className="w-24" />
              <button onClick={() => goTo(prev)} disabled={!prev} aria-label="Materi sebelumnya" className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-[#1D4ED8] disabled:opacity-40"><ArrowLeft className="w-4 h-4" /></button>
              <button onClick={() => goTo(next)} disabled={!next} aria-label="Materi berikutnya" className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-[#1D4ED8] disabled:opacity-40"><ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Player / content area */}
          <Card className="overflow-hidden">
            {lesson.kind === 'video' ? (
              <div className="relative bg-slate-900 aspect-[16/7.2]">
                {hasPoster ? (
                  <img src="/assets/portal/video-poster.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6" style={{ background: `linear-gradient(135deg, ${subject.color}, #0F1E4A)` }}>
                    <BookOpen className="w-12 h-12 text-white/80 mb-3" />
                    <p className="text-white text-xl font-extrabold">{lesson.title}</p>
                    <p className="text-white/70 text-sm font-medium mt-1">{subject.tutor} · {course.title}</p>
                  </div>
                )}
                {!playing && time === 0 && (
                  <button onClick={() => setPlaying(true)} aria-label="Putar video" className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-xl">
                    <Play className="w-7 h-7 text-[#1D4ED8] ml-1" fill="currentColor" />
                  </button>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-4 pt-6 pb-3 flex items-center gap-3 text-white">
                  <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Jeda' : 'Putar'}>{playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
                  <input
                    type="range" min={0} max={VIDEO_SECONDS} value={time}
                    onChange={(e) => setTime(Number(e.target.value))}
                    className="flex-1 accent-[#3B82F6] h-1"
                    aria-label="Posisi video"
                  />
                  <span className="text-xs font-bold tabular-nums">{fmt(time)} / {fmt(VIDEO_SECONDS)}</span>
                  <Captions className="w-5 h-5 opacity-80" />
                  <span className="text-xs font-bold border border-white/60 rounded px-1">1x</span>
                  <Maximize className="w-4 h-4 opacity-80" />
                </div>
              </div>
            ) : lesson.kind === 'catatan' ? (
              <div className="p-6 min-h-[260px]">
                <h3 className="font-extrabold text-[#0F1E4A] mb-3">Catatan Penting</h3>
                <ul className="space-y-2">
                  {(lesson.notes ?? []).map((n) => (
                    <li key={n} className="flex gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" /> {n}</li>
                  ))}
                </ul>
              </div>
            ) : lesson.kind === 'contoh' ? (
              <div className="p-6 min-h-[260px] space-y-3">
                <h3 className="font-extrabold text-[#0F1E4A]">Contoh Soal dan Pembahasan</h3>
                {[1, 2, 3].map((n) => (
                  <div key={n} className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                    <p className="text-sm font-bold text-[#0F1E4A]">Contoh {n}</p>
                    <p className="text-sm text-slate-600 font-medium mt-1">Soal dan langkah pembahasan dari tutor untuk materi “{chapter.title}”.</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 min-h-[260px] flex flex-col items-center justify-center text-center">
                <PenSquare className="w-12 h-12 text-violet-600 mb-3" />
                <h3 className="font-extrabold text-[#0F1E4A] text-lg">{lesson.title}</h3>
                <p className="text-sm text-slate-600 font-medium mt-1 max-w-md">{lesson.about}</p>
                <button onClick={() => { markDone(lesson.id); navigate('/siswa/quiz'); }} className="mt-4 h-11 px-6 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold">
                  Mulai Latihan
                </button>
              </div>
            )}
          </Card>

          {/* Tabs */}
          <Card className="px-2 flex overflow-x-auto">
            {TABS.map((t) => {
              const target = tabLesson(t.kind);
              const Icon = KIND_META[t.kind].icon;
              return (
                <button key={t.kind} onClick={() => goTo(target && allLessons.find((l) => l.id === target.id))}
                  className={cn('flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap', lesson.kind === t.kind ? 'border-[#1D4ED8] text-[#1D4ED8]' : 'border-transparent text-slate-600 hover:text-[#0F1E4A]')}>
                  <Icon className="w-4 h-4" /> {t.label}
                </button>
              );
            })}
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-3">
            <Card className="p-4">
              <h3 className="font-extrabold text-[#0F1E4A] text-sm mb-2">Tentang Materi Ini</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">{lesson.about}</p>
              {!done.has(lesson.id) ? (
                <button onClick={() => markDone(lesson.id)} className="mt-3 text-sm font-bold text-[#1D4ED8] hover:underline">Tandai sebagai selesai</button>
              ) : (
                <p className="mt-3 text-sm font-bold text-emerald-600 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Materi selesai</p>
              )}
            </Card>
            <Card className="p-4 bg-slate-50/60">
              <h3 className="font-extrabold text-[#0F1E4A] text-sm mb-2">Materi Pendukung</h3>
              <div className="space-y-2">
                {(chapterLessons[0].files ?? []).map((f) => (
                  <div key={f.name} className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><FileText className="w-5 h-5" /></span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#0F1E4A]">{f.name}</p>
                      <p className="text-xs text-slate-500">{f.size}</p>
                    </div>
                    <button onClick={() => toast.success(`Mengunduh ${f.name}`)} aria-label={`Unduh ${f.name}`} className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-[#1D4ED8] hover:bg-blue-50"><Download className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="flex justify-between gap-3">
            <button onClick={() => goTo(prev)} disabled={!prev} className="flex items-center gap-2 h-11 px-5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-[#1D4ED8] disabled:opacity-40">
              <ArrowLeft className="w-4 h-4" /> Materi Sebelumnya
            </button>
            <button onClick={() => { markDone(lesson.id); goTo(next); }} disabled={!next} className="flex items-center gap-2 h-11 px-6 rounded-xl bg-[#1D4ED8] hover:bg-blue-800 text-white text-sm font-bold disabled:opacity-40">
              Materi Selanjutnya <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Urutan materi */}
        <Card className="p-4 self-start xl:sticky xl:top-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-extrabold text-[#0F1E4A] text-sm">Urutan Materi</h2>
            <span className="text-xs font-bold text-slate-700">{totalDone} / {allLessons.length} selesai</span>
          </div>
          <ProgressBar value={(totalDone / allLessons.length) * 100} className="mb-3" />
          <div className="divide-y divide-slate-100">
            {course.chapters.map((ch) => {
              const isOpen = openChapters.has(ch.id);
              const chLessons = allLessons.filter((l) => l.chapterId === ch.id);
              const chDone = chLessons.filter((l) => done.has(l.id)).length;
              return (
                <div key={ch.id} className="py-2">
                  <button
                    onClick={() => ch.locked ? toast.info('Bab ini masih terkunci.') : setOpenChapters((s) => { const n = new Set(s); n.has(ch.id) ? n.delete(ch.id) : n.add(ch.id); return n; })}
                    className="w-full flex items-center gap-2.5 text-left py-1"
                  >
                    {ch.locked && <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><Lock className="w-4 h-4" /></span>}
                    <div className="flex-1">
                      <p className={cn('text-sm font-bold', ch.locked ? 'text-slate-500' : 'text-[#0F1E4A]')}>{ch.title}</p>
                      {ch.locked && <p className="text-xs text-slate-400">{chDone} / {chLessons.length} selesai</p>}
                    </div>
                    <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform', isOpen && !ch.locked && 'rotate-180')} />
                  </button>
                  {isOpen && !ch.locked && (
                    <div className="mt-1.5 space-y-1">
                      {chLessons.map((l, i) => {
                        const meta = KIND_META[l.kind];
                        const Icon = meta.icon;
                        const active = l.id === lesson.id;
                        return (
                          <button key={l.id} onClick={() => goTo(l)} className={cn('w-full flex items-start gap-2.5 p-2 rounded-xl text-left', active ? 'bg-[#EAF1FF]' : 'hover:bg-slate-50')}>
                            <span className={cn('w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center mt-2 shrink-0', active ? 'bg-[#1D4ED8] text-white' : done.has(l.id) ? 'bg-emerald-500 text-white' : 'border border-slate-300 text-slate-500')}>
                              {done.has(l.id) && !active ? '✓' : i + 1}
                            </span>
                            <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: meta.bg, color: meta.color }}><Icon className="w-5 h-5" /></span>
                            <span className="min-w-0">
                              <span className={cn('block text-[13px] font-bold leading-snug', active ? 'text-[#1D4ED8]' : 'text-[#0F1E4A]')}>{l.title}</span>
                              <span className="block text-[11px] text-slate-500 font-medium">{meta.label} • {l.duration}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
