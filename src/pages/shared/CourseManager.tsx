import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { api, ApiError } from '../../lib/api';
import { useAppStore } from '../../store/useAppStore';

type Course = { id: string; title: string; category?: string; subjectId?: string; description?: string; status?: string };
type Lesson = { id: string; title: string; kind: string; duration?: string; videoUrl?: string; about?: string };
type Module = { id: string; title: string; locked: boolean; lessons: Lesson[] };
type Enrollment = { studentId: string; name: string };
type Student = { id: string; name: string };
type CourseForm = { id?: string; title: string; category: string; subjectId: string; description: string; status: string };
type ModuleForm = { id?: string; title: string; locked: boolean };
type LessonForm = { id?: string; moduleId: string; title: string; kind: string; duration: string; videoUrl: string; about: string };

const emptyCourse = (): CourseForm => ({ title: '', category: '', subjectId: '', description: '', status: 'Draft' });
const emptyModule = (): ModuleForm => ({ title: '', locked: false });
const emptyLesson = (moduleId: string): LessonForm => ({ moduleId, title: '', kind: 'video', duration: '', videoUrl: '', about: '' });
const input = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none';
const button = 'rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-50';

export default function CourseManager() {
  const role = useAppStore((state) => state.user?.role);
  const isAdmin = role === 'admin';
  const [courses, setCourses] = useState<Course[]>([]);
  const [selected, setSelected] = useState('');
  const [modules, setModules] = useState<Module[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentId, setStudentId] = useState('');
  const [courseForm, setCourseForm] = useState<CourseForm | null>(null);
  const [moduleForm, setModuleForm] = useState<ModuleForm | null>(null);
  const [lessonForm, setLessonForm] = useState<LessonForm | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadCourses = async () => {
    const result = await api.get<{ data: Course[] }>('/r/courses');
    setCourses(result.data);
    setSelected((current) => result.data.some((course) => course.id === current) ? current : result.data[0]?.id ?? '');
  };
  const loadDetail = async (courseId: string) => {
    const [moduleResult, enrollmentResult] = await Promise.all([
      api.get<{ data: Module[] }>(`/courses/${encodeURIComponent(courseId)}/modules`),
      api.get<{ data: Enrollment[] }>(`/courses/${encodeURIComponent(courseId)}/enrollments`),
    ]);
    setModules(moduleResult.data);
    setEnrollments(enrollmentResult.data);
  };
  const message = (cause: unknown) => cause instanceof ApiError ? cause.first : 'Permintaan gagal. Coba lagi.';
  const run = async (action: () => Promise<unknown>, success: string, refreshDetail = true) => {
    setBusy(true);
    try {
      await action();
      await loadCourses();
      if (refreshDetail && selected) await loadDetail(selected);
      toast.success(success);
      return true;
    } catch (cause) {
      toast.error(message(cause));
      return false;
    } finally { setBusy(false); }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [courseResult, studentResult] = await Promise.all([
          api.get<{ data: Course[] }>('/r/courses'),
          isAdmin ? api.get<{ data: Student[] }>('/r/students') : Promise.resolve({ data: [] as Student[] }),
        ]);
        if (!active) return;
        setCourses(courseResult.data);
        setStudents(studentResult.data);
        setSelected(courseResult.data[0]?.id ?? '');
      } catch (cause) { if (active) setError(message(cause)); }
    };
    void load();
    return () => { active = false; };
  }, [isAdmin]);

  useEffect(() => {
    let active = true;
    if (!selected) { setModules([]); setEnrollments([]); return; }
    Promise.all([
      api.get<{ data: Module[] }>(`/courses/${encodeURIComponent(selected)}/modules`),
      api.get<{ data: Enrollment[] }>(`/courses/${encodeURIComponent(selected)}/enrollments`),
    ]).then(([m, e]) => { if (active) { setModules(m.data); setEnrollments(e.data); setError(''); } })
      .catch((cause) => { if (active) setError(message(cause)); });
    return () => { active = false; };
  }, [selected]);

  useEffect(() => {
    const target = courseForm ? 'course-editor' : moduleForm ? 'module-editor' : lessonForm ? 'lesson-editor' : null;
    if (target) requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }, [Boolean(courseForm), Boolean(moduleForm), Boolean(lessonForm)]);

  const activeCourse = courses.find((course) => course.id === selected);
  const availableStudents = students.filter((student) => !enrollments.some((entry) => entry.studentId === student.id));

  const saveCourse = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!courseForm) return;
    const { id, ...data } = courseForm;
    let savedId = id;
    const saved = await run(async () => {
      const result = id ? await api.put<{ data: Course }>(`/r/courses/${encodeURIComponent(id)}`, data) : await api.post<{ data: Course }>('/r/courses', data);
      savedId = result.data.id;
    }, id ? 'Course diperbarui.' : 'Course dibuat.', false);
    if (saved) { setCourseForm(null); if (savedId) setSelected(savedId); }
  };
  const saveModule = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!moduleForm || !selected) return;
    const { id, ...data } = moduleForm;
    const saved = await run(() => id ? api.put(`/modules/${encodeURIComponent(id)}`, data) : api.post(`/courses/${encodeURIComponent(selected)}/modules`, data), id ? 'Modul diperbarui.' : 'Modul dibuat.');
    if (saved) setModuleForm(null);
  };
  const saveLesson = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!lessonForm) return;
    const { id, moduleId, ...data } = lessonForm;
    const saved = await run(() => id ? api.put(`/lessons/${encodeURIComponent(id)}`, data) : api.post(`/modules/${encodeURIComponent(moduleId)}/lessons`, data), id ? 'Materi diperbarui.' : 'Materi dibuat.');
    if (saved) setLessonForm(null);
  };

  return <DashboardLayout>
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><h1 className="text-3xl font-display font-bold text-slate-900">Course Digital</h1><p className="mt-1 text-sm text-slate-600">Kelola course, modul, materi, dan peserta dari database.</p></div>
        <button type="button" data-testid="add-course" className={button} onClick={() => setCourseForm(emptyCourse())}><Plus className="mr-1 inline h-4 w-4" />Tambah Course</button>
      </div>
      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error} <button type="button" className="ml-2 font-bold underline" onClick={() => { setError(''); void loadCourses().then(() => selected && loadDetail(selected)).catch((cause) => setError(message(cause))); }}>Coba lagi</button></div>}

      <div className="grid gap-5 lg:grid-cols-[270px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <h2 className="px-2 py-2 text-sm font-bold text-slate-700">Daftar Course ({courses.length})</h2>
          <div className="space-y-1">{courses.map((course) => <button key={course.id} type="button" onClick={() => { setSelected(course.id); setModuleForm(null); setLessonForm(null); }} className={`w-full rounded-xl px-3 py-3 text-left text-sm ${selected === course.id ? 'bg-blue-50 text-blue-800 ring-1 ring-blue-200' : 'text-slate-700 hover:bg-slate-50'}`}><span className="block font-bold">{course.title}</span><span className="text-xs">{course.status || 'Draft'}</span></button>)}</div>
          {courses.length === 0 && <p className="px-2 py-4 text-sm text-slate-500">Belum ada course.</p>}
        </aside>

        <div className="min-w-0 space-y-5">
          {activeCourse && <>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><h2 className="text-xl font-bold text-slate-900">{activeCourse.title}</h2><p className="mt-1 text-sm text-slate-600">{activeCourse.category || 'Tanpa kategori'} · {activeCourse.status || 'Draft'} · {enrollments.length} peserta</p><p className="mt-2 text-sm text-slate-600">{activeCourse.description}</p></div>
                <div className="flex gap-2"><button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700" onClick={() => setCourseForm({ id: activeCourse.id, title: activeCourse.title, category: activeCourse.category ?? '', subjectId: activeCourse.subjectId ?? '', description: activeCourse.description ?? '', status: activeCourse.status ?? 'Draft' })}>Ubah</button><button type="button" className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700" onClick={() => { if (confirm(`Hapus course ${activeCourse.title} beserta seluruh modul dan progresnya?`)) void run(() => api.del(`/r/courses/${encodeURIComponent(activeCourse.id)}`), 'Course dihapus.', false); }}>Hapus</button></div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-2"><h2 className="text-lg font-bold text-slate-900">Modul & Materi</h2><button type="button" data-testid="add-module" className={button} onClick={() => setModuleForm(emptyModule())}><Plus className="mr-1 inline h-4 w-4" />Modul</button></div>
              {modules.length === 0 && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Belum ada modul. Tambahkan modul sebelum membuat materi.</p>}
              <div className="space-y-4">{modules.map((module) => <div key={module.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2"><div><h3 className="font-bold text-slate-900">{module.title}</h3><p className="text-xs text-slate-500">{module.locked ? 'Terkunci untuk siswa' : 'Terbuka'} · {module.lessons.length} materi</p></div><div className="flex flex-wrap gap-2"><button type="button" data-testid={`add-lesson-${module.id}`} className="text-xs font-bold text-blue-700" onClick={() => setLessonForm(emptyLesson(module.id))}>+ Materi</button><button type="button" className="text-xs font-bold text-slate-700" onClick={() => setModuleForm({ id: module.id, title: module.title, locked: module.locked })}>Ubah</button><button type="button" className="text-xs font-bold text-red-700" onClick={() => { if (confirm(`Hapus modul ${module.title} dan seluruh materinya?`)) void run(() => api.del(`/modules/${encodeURIComponent(module.id)}`), 'Modul dihapus.'); }}>Hapus</button></div></div>
                <ul className="mt-3 divide-y divide-slate-100">{module.lessons.map((lesson) => <li key={lesson.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm"><span className="inline-flex items-center gap-2 text-slate-700"><BookOpen className="h-4 w-4 text-blue-600" />{lesson.title} <span className="text-xs text-slate-500">({lesson.kind})</span></span><span className="flex gap-3"><button type="button" className="text-xs font-bold text-blue-700" onClick={() => setLessonForm({ id: lesson.id, moduleId: module.id, title: lesson.title, kind: lesson.kind, duration: lesson.duration ?? '', videoUrl: lesson.videoUrl ?? '', about: lesson.about ?? '' })}>Ubah</button><button type="button" aria-label={`Hapus ${lesson.title}`} className="text-red-700" onClick={() => { if (confirm(`Hapus materi ${lesson.title}?`)) void run(() => api.del(`/lessons/${encodeURIComponent(lesson.id)}`), 'Materi dihapus.'); }}><Trash2 className="h-4 w-4" /></button></span></li>)}</ul>
              </div>)}</div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Peserta ({enrollments.length})</h2>
              {isAdmin && <form data-testid="enrollment-form" className="mt-3 flex flex-wrap gap-2" onSubmit={(event) => { event.preventDefault(); if (!studentId) return; void run(() => api.post(`/courses/${encodeURIComponent(selected)}/enrollments`, { studentId }), 'Siswa didaftarkan.').then((ok) => { if (ok) setStudentId(''); }); }}><label className="sr-only" htmlFor="enroll-student">Pilih siswa</label><select id="enroll-student" value={studentId} onChange={(event) => setStudentId(event.target.value)} className={`${input} min-w-48 flex-1`} required><option value="">Pilih siswa</option>{availableStudents.map((student) => <option key={student.id} value={student.id}>{student.name} ({student.id})</option>)}</select><button type="submit" className={button} disabled={busy || !availableStudents.length}>Daftarkan</button></form>}
              <ul className="mt-3 divide-y divide-slate-100">{enrollments.map((entry) => <li key={entry.studentId} className="flex items-center justify-between gap-2 py-2 text-sm"><span>{entry.name} <span className="text-slate-500">({entry.studentId})</span></span>{isAdmin && <button type="button" className="text-xs font-bold text-red-700" onClick={() => { if (confirm(`Keluarkan ${entry.name} dari course?`)) void run(() => api.del(`/courses/${encodeURIComponent(selected)}/enrollments`, { studentId: entry.studentId }), 'Siswa dikeluarkan.'); }}>Keluarkan</button>}</li>)}</ul>
              {enrollments.length === 0 && <p className="mt-3 text-sm text-slate-600">Belum ada peserta.</p>}
            </section>
          </>}
          {!activeCourse && <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">Pilih course di daftar atau buat course baru. <Link to={isAdmin ? '/admin/course' : '/guru/course'} className="font-bold text-blue-700">Kembali</Link></div>}
        </div>
      </div>

      {courseForm && <section id="course-editor" className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm"><h2 className="mb-3 text-lg font-bold text-slate-900">{courseForm.id ? 'Ubah Course' : 'Course Baru'}</h2><form data-testid="course-form" className="grid gap-3 md:grid-cols-2" onSubmit={saveCourse}><label className="text-sm font-semibold">Judul<input className={input} value={courseForm.title} onChange={(event) => setCourseForm({ ...courseForm, title: event.target.value })} required maxLength={191} /></label><label className="text-sm font-semibold">Kategori<input className={input} value={courseForm.category} onChange={(event) => setCourseForm({ ...courseForm, category: event.target.value })} maxLength={191} /></label><label className="text-sm font-semibold">ID Mata Pelajaran<input className={input} value={courseForm.subjectId} onChange={(event) => setCourseForm({ ...courseForm, subjectId: event.target.value })} maxLength={191} /></label><label className="text-sm font-semibold">Status<select className={input} value={courseForm.status} onChange={(event) => setCourseForm({ ...courseForm, status: event.target.value })}><option>Draft</option><option>Published</option></select></label><label className="text-sm font-semibold md:col-span-2">Deskripsi<textarea className={input} rows={3} value={courseForm.description} onChange={(event) => setCourseForm({ ...courseForm, description: event.target.value })} /></label><div className="flex gap-2 md:col-span-2"><button type="submit" disabled={busy} className={button}>Simpan</button><button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold" onClick={() => setCourseForm(null)}>Batal</button></div></form></section>}
      {moduleForm && <section id="module-editor" className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm"><h2 className="mb-3 text-lg font-bold">{moduleForm.id ? 'Ubah Modul' : 'Modul Baru'}</h2><form data-testid="module-form" className="space-y-3" onSubmit={saveModule}><label className="block text-sm font-semibold">Judul<input className={input} value={moduleForm.title} onChange={(event) => setModuleForm({ ...moduleForm, title: event.target.value })} required maxLength={191} /></label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={moduleForm.locked} onChange={(event) => setModuleForm({ ...moduleForm, locked: event.target.checked })} />Kunci untuk siswa</label><div className="flex gap-2"><button type="submit" disabled={busy} className={button}>Simpan</button><button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold" onClick={() => setModuleForm(null)}>Batal</button></div></form></section>}
      {lessonForm && <section id="lesson-editor" className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm"><h2 className="mb-3 text-lg font-bold">{lessonForm.id ? 'Ubah Materi' : 'Materi Baru'}</h2><form data-testid="lesson-form" className="grid gap-3 md:grid-cols-2" onSubmit={saveLesson}><label className="text-sm font-semibold">Judul<input className={input} value={lessonForm.title} onChange={(event) => setLessonForm({ ...lessonForm, title: event.target.value })} required maxLength={191} /></label><label className="text-sm font-semibold">Jenis<select className={input} value={lessonForm.kind} onChange={(event) => setLessonForm({ ...lessonForm, kind: event.target.value })}>{['video', 'catatan', 'contoh', 'latihan'].map((kind) => <option key={kind} value={kind}>{kind}</option>)}</select></label><label className="text-sm font-semibold">Durasi<input className={input} value={lessonForm.duration} onChange={(event) => setLessonForm({ ...lessonForm, duration: event.target.value })} maxLength={40} /></label><label className="text-sm font-semibold">URL Video<input type="url" className={input} value={lessonForm.videoUrl} onChange={(event) => setLessonForm({ ...lessonForm, videoUrl: event.target.value })} /></label><label className="text-sm font-semibold md:col-span-2">Isi / ringkasan<textarea className={input} rows={4} value={lessonForm.about} onChange={(event) => setLessonForm({ ...lessonForm, about: event.target.value })} /></label><div className="flex gap-2 md:col-span-2"><button type="submit" disabled={busy} className={button}>Simpan</button><button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold" onClick={() => setLessonForm(null)}>Batal</button></div></form></section>}
    </div>
  </DashboardLayout>;
}
