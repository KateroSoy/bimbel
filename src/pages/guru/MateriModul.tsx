import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen, Plus, Trash2, PlayCircle, FileText, FileQuestion, PenSquare, Paperclip, Lock, Unlock, ChevronDown, ChevronUp, Search, Info, Eye, SquarePen, X,
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PageHead, Btn, Badge, Modal, Panel } from '../../components/portal/Kit';
import { api, ApiError } from '../../lib/api';
import { useAppStore } from '../../store/useAppStore';
import { attachments, exampleItems, notePoints, practiceItems, videoEmbed, type Attachment, type ExampleItem, type PracticeItem } from '../../lib/lessonContent';
import { RequestChangeDialog } from './KelasSaya';
import { cn } from '../../lib/utils';

type Kind = 'video' | 'catatan' | 'contoh' | 'latihan';
type Course = { id: string; title: string; category?: string; status?: string; instructor?: string; description?: string; level?: string };
type Lesson = { id: string; title: string; kind: Kind; duration?: string; videoUrl?: string; about?: string; notes?: unknown; files?: unknown };
type Module = { id: string; title: string; locked: boolean; lessons: Lesson[] };

const KINDS: { kind: Kind; label: string; icon: typeof PlayCircle; color: string }[] = [
  { kind: 'video', label: 'Video', icon: PlayCircle, color: '#1D4ED8' },
  { kind: 'catatan', label: 'Penjelasan', icon: FileText, color: '#16A34A' },
  { kind: 'contoh', label: 'Contoh Soal', icon: FileQuestion, color: '#F97316' },
  { kind: 'latihan', label: 'Soal Latihan', icon: PenSquare, color: '#7C3AED' },
];
const kindMeta = (k: Kind) => KINDS.find((x) => x.kind === k) ?? KINDS[0];

interface Draft {
  id?: string; moduleId: string; title: string; kind: Kind; duration: string; videoUrl: string; about: string;
  points: string[]; examples: ExampleItem[]; practice: PracticeItem[]; files: Attachment[];
}
const blank = (moduleId: string, kind: Kind = 'video'): Draft => ({
  moduleId, title: '', kind, duration: '', videoUrl: '', about: '', points: [''], examples: [{ question: '', answer: '' }],
  practice: [{ question: '', options: ['', '', '', ''], answer: 0 }], files: [],
});
const fromLesson = (moduleId: string, l: Lesson): Draft => ({
  id: l.id, moduleId, title: l.title, kind: l.kind, duration: l.duration ?? '', videoUrl: l.videoUrl ?? '', about: l.about ?? '',
  points: notePoints(l.notes).length ? notePoints(l.notes) : [''],
  examples: exampleItems(l.notes).length ? exampleItems(l.notes) : [{ question: '', answer: '' }],
  practice: practiceItems(l.notes).length ? practiceItems(l.notes).map((p) => ({ ...p, options: [...p.options, '', '', '', ''].slice(0, Math.max(4, p.options.length)) })) : [{ question: '', options: ['', '', '', ''], answer: 0 }],
  files: attachments(l.files),
});

const input = 'w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-800 outline-none focus:border-[#1D4ED8] bg-white';
const area = 'w-full px-3 py-2 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-800 outline-none focus:border-[#1D4ED8] bg-white resize-y';
const message = (e: unknown) => (e instanceof ApiError ? e.first : 'Permintaan gagal. Coba lagi.');

function LessonEditor({ draft, setDraft }: { draft: Draft; setDraft: (d: Draft) => void }) {
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft({ ...draft, [key]: value });
  const embed = videoEmbed(draft.videoUrl);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_160px] gap-3">
        <label className="block"><span className="block text-xs font-bold text-slate-700 mb-1">Judul Materi <span className="text-red-500">*</span></span>
          <input className={input} value={draft.title} onChange={(e) => set('title', e.target.value)} maxLength={191} placeholder="Contoh: Penjumlahan Pecahan" />
        </label>
        <label className="block"><span className="block text-xs font-bold text-slate-700 mb-1">Durasi</span>
          <input className={input} value={draft.duration} onChange={(e) => set('duration', e.target.value)} maxLength={40} placeholder="10 menit" />
        </label>
      </div>
      <div>
        <span className="block text-xs font-bold text-slate-700 mb-1">Jenis Materi</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {KINDS.map(({ kind, label, icon: Icon, color }) => (
            <button key={kind} type="button" onClick={() => set('kind', kind)} className={cn('flex items-center gap-2 h-10 px-3 rounded-lg border-2 text-[13px] font-bold', draft.kind === kind ? 'border-[#1D4ED8] bg-[#EAF1FF] text-[#1D4ED8]' : 'border-slate-200 text-slate-700')}>
              <Icon className="w-4 h-4" style={{ color }} /> {label}
            </button>
          ))}
        </div>
      </div>

      {draft.kind === 'video' && (
        <div className="space-y-2">
          <label className="block"><span className="block text-xs font-bold text-slate-700 mb-1">Link Video (YouTube / Google Drive)</span>
            <input className={input} type="url" value={draft.videoUrl} onChange={(e) => set('videoUrl', e.target.value)} placeholder="https://www.youtube.com/watch?v=…" />
          </label>
          {embed?.kind === 'iframe' && <div className="aspect-video rounded-xl overflow-hidden bg-black"><iframe src={embed.src} title="Pratinjau video" className="w-full h-full" allowFullScreen /></div>}
          {embed?.kind === 'video' && <video src={embed.src} controls className="w-full rounded-xl bg-black" />}
          {draft.videoUrl && !embed && <p className="text-xs font-semibold text-red-600">Link tidak dikenali. Gunakan link YouTube, Google Drive, atau file .mp4.</p>}
        </div>
      )}

      {draft.kind === 'catatan' && (
        <div className="space-y-2">
          <span className="block text-xs font-bold text-slate-700">Poin Penjelasan</span>
          {draft.points.map((p, i) => (
            <div key={i} className="flex gap-2">
              <span className="w-6 pt-2 text-xs font-extrabold text-slate-500 text-right">{i + 1}.</span>
              <textarea className={area} rows={2} value={p} onChange={(e) => set('points', draft.points.map((x, j) => (j === i ? e.target.value : x)))} placeholder="Tulis poin penjelasan materi…" />
              <button type="button" aria-label="Hapus poin" onClick={() => set('points', draft.points.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <Btn size="sm" icon={Plus} onClick={() => set('points', [...draft.points, ''])}>Tambah Poin</Btn>
        </div>
      )}

      {draft.kind === 'contoh' && (
        <div className="space-y-3">
          <span className="block text-xs font-bold text-slate-700">Contoh Soal & Pembahasan</span>
          {draft.examples.map((ex, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-3 space-y-2">
              <div className="flex items-center justify-between"><p className="text-xs font-extrabold text-[#F97316]">Contoh {i + 1}</p>
                <button type="button" aria-label="Hapus contoh" onClick={() => set('examples', draft.examples.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></div>
              <textarea className={area} rows={2} value={ex.question} onChange={(e) => set('examples', draft.examples.map((x, j) => (j === i ? { ...x, question: e.target.value } : x)))} placeholder="Soal" />
              <textarea className={area} rows={3} value={ex.answer} onChange={(e) => set('examples', draft.examples.map((x, j) => (j === i ? { ...x, answer: e.target.value } : x)))} placeholder="Langkah pembahasan" />
            </div>
          ))}
          <Btn size="sm" icon={Plus} onClick={() => set('examples', [...draft.examples, { question: '', answer: '' }])}>Tambah Contoh</Btn>
        </div>
      )}

      {draft.kind === 'latihan' && (
        <div className="space-y-3">
          <span className="block text-xs font-bold text-slate-700">Soal Latihan (pilihan ganda, dinilai otomatis)</span>
          {draft.practice.map((q, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-3 space-y-2">
              <div className="flex items-center justify-between"><p className="text-xs font-extrabold text-violet-700">Soal {i + 1}</p>
                <button type="button" aria-label="Hapus soal" onClick={() => set('practice', draft.practice.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></div>
              <textarea className={area} rows={2} value={q.question} onChange={(e) => set('practice', draft.practice.map((x, j) => (j === i ? { ...x, question: e.target.value } : x)))} placeholder="Pertanyaan" />
              <div className="grid sm:grid-cols-2 gap-2">
                {q.options.map((opt, oi) => (
                  <label key={oi} className={cn('flex items-center gap-2 rounded-lg border px-2', q.answer === oi ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200')}>
                    <input type="radio" name={`ans-${i}`} checked={q.answer === oi} onChange={() => set('practice', draft.practice.map((x, j) => (j === i ? { ...x, answer: oi } : x)))} className="accent-emerald-600" title="Jawaban benar" />
                    <span className="text-xs font-extrabold text-slate-500">{String.fromCharCode(65 + oi)}</span>
                    <input className="flex-1 h-9 bg-transparent text-[13px] font-medium outline-none" value={opt} onChange={(e) => set('practice', draft.practice.map((x, j) => (j === i ? { ...x, options: x.options.map((o, k) => (k === oi ? e.target.value : o)) } : x)))} placeholder={`Pilihan ${String.fromCharCode(65 + oi)}`} />
                  </label>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Tandai bulatan pada jawaban yang benar.</p>
            </div>
          ))}
          <Btn size="sm" icon={Plus} onClick={() => set('practice', [...draft.practice, { question: '', options: ['', '', '', ''], answer: 0 }])}>Tambah Soal</Btn>
        </div>
      )}

      <label className="block"><span className="block text-xs font-bold text-slate-700 mb-1">Ringkasan / Tentang Materi</span>
        <textarea className={area} rows={3} maxLength={5000} value={draft.about} onChange={(e) => set('about', e.target.value)} placeholder="Penjelasan singkat yang tampil di bawah materi." />
      </label>

      <div className="space-y-2">
        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700"><Paperclip className="w-3.5 h-3.5" /> Lampiran (link Google Drive / PDF)</span>
        {draft.files.map((f, i) => (
          <div key={i} className="grid grid-cols-[1fr_1.4fr_auto] gap-2">
            <input className={input} value={f.name} onChange={(e) => set('files', draft.files.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} placeholder="Nama berkas" />
            <input className={input} type="url" value={f.url ?? ''} onChange={(e) => set('files', draft.files.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))} placeholder="https://drive.google.com/…" />
            <button type="button" aria-label="Hapus lampiran" onClick={() => set('files', draft.files.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-600 px-1"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        <Btn size="sm" icon={Plus} onClick={() => set('files', [...draft.files, { name: '', url: '' }])}>Tambah Lampiran</Btn>
      </div>
    </div>
  );
}

/** Payload for /lessons: only the content of the chosen kind goes into `notes`. */
function toPayload(d: Draft) {
  const notes = d.kind === 'catatan' ? d.points.map((p) => p.trim()).filter(Boolean)
    : d.kind === 'contoh' ? d.examples.filter((e) => e.question.trim()).map((e) => ({ question: e.question.trim(), answer: e.answer.trim() }))
      : d.kind === 'latihan' ? d.practice.filter((q) => q.question.trim()).map((q) => {
        const options = q.options.map((o) => o.trim());
        const kept = options.map((o, i) => [o, i] as const).filter(([o]) => o);
        return { question: q.question.trim(), options: kept.map(([o]) => o), answer: Math.max(0, kept.findIndex(([, i]) => i === q.answer)) };
      }) : [];
  return {
    title: d.title.trim(), kind: d.kind, duration: d.duration.trim() || null, about: d.about.trim() || null,
    videoUrl: d.kind === 'video' && d.videoUrl.trim() ? d.videoUrl.trim() : null,
    notes, files: d.files.filter((f) => f.name.trim() && f.url?.trim()).map((f) => ({ name: f.name.trim(), url: f.url!.trim() })),
  };
}

export default function MateriModul() {
  const user = useAppStore((s) => s.user);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selected, setSelected] = useState('');
  const [modules, setModules] = useState<Module[]>([]);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [moduleForm, setModuleForm] = useState<{ id?: string; title: string; locked: boolean } | null>(null);
  const [requesting, setRequesting] = useState(false);

  // Courses the admin assigned to this tutor (instructor = tutor name); all courses until any are assigned
  const mine = useMemo(() => {
    const name = (user?.name ?? '').split(',')[0].trim().toLowerCase();
    const assigned = courses.filter((c) => name && (c.instructor ?? '').toLowerCase().includes(name));
    return assigned.length ? assigned : courses;
  }, [courses, user?.name]);
  const list = mine.filter((c) => !q || `${c.title} ${c.category}`.toLowerCase().includes(q.toLowerCase()));
  const course = mine.find((c) => c.id === selected);

  useEffect(() => {
    api.get<{ data: Course[] }>('/r/courses').then((r) => setCourses(r.data)).catch((e) => toast.error(message(e)));
  }, []);
  useEffect(() => { if (!selected && mine[0]) setSelected(mine[0].id); }, [mine, selected]);

  const loadModules = async (courseId = selected) => {
    if (!courseId) return;
    const r = await api.get<{ data: Module[] }>(`/courses/${encodeURIComponent(courseId)}/modules`);
    setModules(r.data);
    setOpen((s) => (s.size ? s : new Set(r.data.slice(0, 1).map((m) => m.id))));
  };
  useEffect(() => { setModules([]); setOpen(new Set()); void loadModules().catch((e) => toast.error(message(e))); }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  const run = async (action: () => Promise<unknown>, success: string) => {
    setBusy(true);
    try { await action(); await loadModules(); toast.success(success); return true; } catch (e) { toast.error(message(e)); return false; } finally { setBusy(false); }
  };

  const saveLesson = async () => {
    if (!draft) return;
    if (!draft.title.trim()) { toast.error('Judul materi wajib diisi'); return; }
    const body = toPayload(draft);
    const ok = await run(() => (draft.id ? api.put(`/lessons/${encodeURIComponent(draft.id)}`, body) : api.post(`/modules/${encodeURIComponent(draft.moduleId)}/lessons`, body)), draft.id ? 'Materi diperbarui' : 'Materi ditambahkan');
    if (ok) setDraft(null);
  };
  const saveModule = async () => {
    if (!moduleForm || !moduleForm.title.trim()) return;
    const ok = await run(() => (moduleForm.id ? api.put(`/modules/${encodeURIComponent(moduleForm.id)}`, moduleForm) : api.post(`/courses/${encodeURIComponent(selected)}/modules`, moduleForm)), moduleForm.id ? 'Bab diperbarui' : 'Bab ditambahkan');
    if (ok) setModuleForm(null);
  };
  const togglePublish = async () => {
    if (!course) return;
    const status = course.status === 'Published' ? 'Draft' : 'Published';
    try {
      const r = await api.put<{ data: Course }>(`/r/courses/${encodeURIComponent(course.id)}`, { status });
      setCourses((cs) => cs.map((c) => (c.id === course.id ? { ...c, ...r.data } : c)));
      toast.success(status === 'Published' ? 'Kursus tampil di akun siswa' : 'Kursus disembunyikan dari siswa');
    } catch (e) { toast.error(message(e)); }
  };

  const lessonCount = modules.reduce((n, m) => n + m.lessons.length, 0);
  const countKind = (k: Kind) => modules.reduce((n, m) => n + m.lessons.filter((l) => l.kind === k).length, 0);

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1400px]">
        <PageHead
          title="Materi & Modul"
          subtitle="Siapkan isi Kursus & Materi yang dipelajari siswa: video, penjelasan, contoh soal, soal latihan, dan lampiran."
          actions={<Btn onClick={() => setRequesting(true)}>Ajukan Kursus Baru ke Admin</Btn>}
        />
        <div className="rounded-xl bg-[#F4F8FF] border border-blue-100 px-4 py-2.5 flex items-center gap-2 text-[13px] font-medium text-slate-700">
          <Info className="w-4 h-4 text-[#1D4ED8] shrink-0" /> Kursus baru ditambahkan oleh Admin ke akun Anda. Di halaman ini Anda mengisi dan mengubah isinya.
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[290px_minmax(0,1fr)] gap-4">
          <Panel className="!p-3 h-fit">
            <div className="relative mb-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari kursus…" className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 text-[13px]" />
            </div>
            <p className="px-1 py-1 text-xs font-extrabold text-slate-500 uppercase">Kursus Saya ({mine.length})</p>
            <div className="space-y-1">
              {list.map((c) => (
                <button key={c.id} onClick={() => setSelected(c.id)} className={cn('w-full text-left rounded-xl px-3 py-2.5', selected === c.id ? 'bg-[#EAF1FF] ring-1 ring-blue-200' : 'hover:bg-slate-50')}>
                  <span className="block text-[13.5px] font-extrabold text-[#0F1E4A]">{c.title}</span>
                  <span className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500 font-semibold">{c.category || 'Umum'} · <Badge tone={c.status === 'Published' ? 'green' : 'orange'}>{c.status || 'Draft'}</Badge></span>
                </button>
              ))}
              {list.length === 0 && <p className="px-2 py-4 text-sm text-slate-500">Belum ada kursus. Admin akan menambahkan kursus ke akun Anda.</p>}
            </div>
          </Panel>

          {course ? (
            <div className="space-y-3 min-w-0">
              <Panel>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-xl font-extrabold text-[#0F1E4A]">{course.title}</h2>
                    <p className="text-[13px] text-slate-600 font-medium">{course.category || 'Umum'} · {modules.length} bab · {lessonCount} materi</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {KINDS.map((k) => <span key={k.kind} className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-2 py-0.5"><k.icon className="w-3.5 h-3.5" style={{ color: k.color }} /> {countKind(k.kind)} {k.label}</span>)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Btn icon={Eye} variant={course.status === 'Published' ? 'ghost' : 'soft'} onClick={() => void togglePublish()}>{course.status === 'Published' ? 'Sembunyikan dari Siswa' : 'Tampilkan ke Siswa'}</Btn>
                    <Btn variant="primary" icon={Plus} onClick={() => setModuleForm({ title: '', locked: false })}>Tambah Bab</Btn>
                  </div>
                </div>
              </Panel>

              {modules.length === 0 && <Panel><p className="text-sm text-slate-500 font-medium">Belum ada bab. Tambahkan bab lalu isi materinya.</p></Panel>}
              {modules.map((m, mi) => {
                const isOpen = open.has(m.id);
                return (
                  <Panel key={m.id} className="!p-0 overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50/70 border-b border-slate-100">
                      <button onClick={() => setOpen((s) => { const n = new Set(s); if (n.has(m.id)) n.delete(m.id); else n.add(m.id); return n; })} className="flex-1 flex items-center gap-2 text-left min-w-0">
                        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                        <span className="text-[15px] font-extrabold text-[#0F1E4A] truncate">Bab {mi + 1}: {m.title}</span>
                        <span className="text-xs text-slate-500 font-semibold shrink-0">{m.lessons.length} materi</span>
                        {m.locked && <Badge tone="slate"><Lock className="w-3 h-3" /> Terkunci</Badge>}
                      </button>
                      <Btn size="sm" variant="soft" icon={Plus} onClick={() => setDraft(blank(m.id))}>Materi</Btn>
                      <button aria-label="Ubah bab" onClick={() => setModuleForm({ id: m.id, title: m.title, locked: m.locked })} className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 flex items-center justify-center"><SquarePen className="w-4 h-4" /></button>
                      <button aria-label={m.locked ? 'Buka bab' : 'Kunci bab'} onClick={() => void run(() => api.put(`/modules/${encodeURIComponent(m.id)}`, { locked: !m.locked }), m.locked ? 'Bab dibuka untuk siswa' : 'Bab dikunci')} className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 flex items-center justify-center">{m.locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}</button>
                      <button aria-label="Hapus bab" onClick={() => { if (window.confirm(`Hapus bab "${m.title}" beserta seluruh materinya?`)) void run(() => api.del(`/modules/${encodeURIComponent(m.id)}`), 'Bab dihapus'); }} className="w-8 h-8 rounded-lg border border-red-200 bg-white text-red-600 flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    {isOpen && (
                      <ul className="divide-y divide-slate-100">
                        {m.lessons.length === 0 && <li className="px-4 py-4 text-sm text-slate-500">Belum ada materi di bab ini.</li>}
                        {m.lessons.map((l) => {
                          const meta = kindMeta(l.kind);
                          const filled = l.kind === 'video' ? !!l.videoUrl : l.kind === 'catatan' ? notePoints(l.notes).length > 0 : l.kind === 'contoh' ? exampleItems(l.notes).length > 0 : practiceItems(l.notes).length > 0;
                          return (
                            <li key={l.id} className="flex items-center gap-3 px-4 py-2.5">
                              <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${meta.color}14`, color: meta.color }}><meta.icon className="w-5 h-5" /></span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-[#0F1E4A] truncate">{l.title}</p>
                                <p className="text-xs text-slate-500 font-medium">{meta.label}{l.duration ? ` · ${l.duration}` : ''}{attachments(l.files).length ? ` · ${attachments(l.files).length} lampiran` : ''}</p>
                              </div>
                              {filled ? <Badge tone="green">Siap</Badge> : <Badge tone="orange">Belum diisi</Badge>}
                              <Btn size="sm" onClick={() => setDraft(fromLesson(m.id, l))}>Edit Isi</Btn>
                              <button aria-label={`Hapus ${l.title}`} onClick={() => { if (window.confirm(`Hapus materi "${l.title}"?`)) void run(() => api.del(`/lessons/${encodeURIComponent(l.id)}`), 'Materi dihapus'); }} className="text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </Panel>
                );
              })}
            </div>
          ) : (
            <Panel><p className="text-sm text-slate-500 font-medium flex items-center gap-2"><BookOpen className="w-4 h-4" /> Pilih kursus di sebelah kiri.</p></Panel>
          )}
        </div>

        <Modal open={!!draft} wide title={draft?.id ? 'Edit Isi Materi' : 'Materi Baru'} onClose={() => setDraft(null)} footer={<>
          <Btn variant="ghost" icon={X} onClick={() => setDraft(null)}>Batal</Btn>
          <Btn variant="primary" onClick={() => void saveLesson()}>{busy ? 'Menyimpan…' : 'Simpan Materi'}</Btn>
        </>}>
          {draft && <LessonEditor draft={draft} setDraft={setDraft} />}
        </Modal>

        <Modal open={!!moduleForm} title={moduleForm?.id ? 'Ubah Bab' : 'Bab Baru'} onClose={() => setModuleForm(null)} footer={<>
          <Btn variant="ghost" onClick={() => setModuleForm(null)}>Batal</Btn>
          <Btn variant="primary" onClick={() => void saveModule()}>Simpan</Btn>
        </>}>
          {moduleForm && (
            <div className="space-y-3">
              <label className="block"><span className="block text-xs font-bold text-slate-700 mb-1">Judul Bab</span>
                <input className={input} value={moduleForm.title} onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })} maxLength={191} placeholder="Contoh: Bab 2 — Pecahan" />
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={moduleForm.locked} onChange={(e) => setModuleForm({ ...moduleForm, locked: e.target.checked })} className="accent-[#1D4ED8]" /> Kunci untuk siswa (belum dibuka)</label>
            </div>
          )}
        </Modal>
        <RequestChangeDialog open={requesting} onClose={() => setRequesting(false)} />
      </div>
    </DashboardLayout>
  );
}
