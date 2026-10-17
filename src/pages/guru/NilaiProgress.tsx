import { useState } from 'react';
import { Users, BadgeCheck, TrendingUp, AlertTriangle, ArrowRight, PencilLine } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PageHead, StatStrip, Tabs, SearchInput, Select, DataTable, Person, Badge, Btn, RowMenu, Meter, Panel, Modal, exportCsv, type Col } from '../../components/portal/Kit';
import { gradeStatus, type TutorStudent } from '../../data/guruPortal';
import { useResource } from '../../store/useRemote';
import { StudentProfileModal } from './SiswaSaya';
import { cn } from '../../lib/utils';

const fmt = (n: number) => n.toFixed(1).replace('.', ',');
const avg = (list: TutorStudent[], f: (s: TutorStudent) => number) => (list.length ? list.reduce((a, s) => a + f(s), 0) / list.length : 0);
const CLASS_COLORS = ['#1D4ED8', '#16A34A', '#7C3AED', '#F97316'];
const barColor = (v: number) => (v >= 80 ? '#16A34A' : v >= 60 ? '#F97316' : '#EF4444');

interface GradeRow {
  id: string; studentId: string; studentName: string; studentNis: string; class: string; subject: string;
  tugas: number; uts: number; uas: number; finalScore: number; letterGrade: string;
}
const WEIGHTS = { tugas: 0.3, uts: 0.3, uas: 0.4 };
const finalOf = (t: number, u: number, a: number) => Math.round((t * WEIGHTS.tugas + u * WEIGHTS.uts + a * WEIGHTS.uas) * 10) / 10;
const letterOf = (n: number) => (n >= 90 ? 'A' : n >= 80 ? 'B' : n >= 70 ? 'C' : n >= 60 ? 'D' : 'E');
const clamp = (v: string) => Math.max(0, Math.min(100, Number(v) || 0));

/** Per-student grade entry: component scores → final score + letter, stored in `grades`; the student's average follows. */
function GradeInput({ open, initial, students, grades, onClose }: {
  open: boolean; initial: TutorStudent | null; students: TutorStudent[];
  grades: ReturnType<typeof useResource<GradeRow>>; onClose: () => void;
}) {
  const studentRes = useResource<TutorStudent>('class-students');
  const [studentId, setStudentId] = useState('');
  const [subject, setSubject] = useState('');
  // Opened from a student's row: start from that student's saved scores (the dialog is keyed per student)
  const [vals, setVals] = useState(() => {
    const g = initial && grades.rows.find((x) => x.studentNis === initial.id && x.subject === initial.subject);
    return g ? { tugas: String(g.tugas), uts: String(g.uts), uas: String(g.uas) } : { tugas: '', uts: '', uas: '' };
  });
  const student = students.find((s) => s.id === (studentId || initial?.id)) ?? null;
  const existing = student ? grades.rows.find((g) => g.studentNis === student.id && g.subject === (subject || student.subject)) : undefined;

  const pick = (id: string) => {
    setStudentId(id);
    const st = students.find((s) => s.id === id);
    const g = st && grades.rows.find((x) => x.studentNis === st.id && x.subject === st.subject);
    setSubject(st?.subject ?? '');
    setVals(g ? { tugas: String(g.tugas), uts: String(g.uts), uas: String(g.uas) } : { tugas: '', uts: '', uas: '' });
  };
  const close = () => { setStudentId(''); setSubject(''); setVals({ tugas: '', uts: '', uas: '' }); onClose(); };
  const final = finalOf(clamp(vals.tugas), clamp(vals.uts), clamp(vals.uas));

  const save = async () => {
    if (!student) { toast.error('Pilih siswa terlebih dahulu'); return; }
    const row = {
      studentId: student.id, studentName: student.name, studentNis: student.id, class: student.kelas, subject: subject || student.subject,
      tugas: clamp(vals.tugas), uts: clamp(vals.uts), uas: clamp(vals.uas), finalScore: final, letterGrade: letterOf(final),
    };
    const saved = existing ? await grades.update(existing.id, row) : await grades.create(row);
    if (!saved) return;
    // Rata-rata siswa = rata-rata nilai akhir semua mapel yang sudah dinilai
    const mine = [...grades.rows.filter((g) => g.studentNis === student.id && g.id !== saved.id), saved];
    const average = Math.round((mine.reduce((a, g) => a + Number(g.finalScore), 0) / mine.length) * 10) / 10;
    await studentRes.update(student.id, { score: average });
    toast.success('Nilai tersimpan', { description: `${student.name} · ${row.subject}: ${final} (${row.letterGrade})` });
    close();
  };

  const field = 'w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-800 outline-none focus:border-[#1D4ED8] bg-white';
  return (
    <Modal open={open} title="Input Nilai Siswa" onClose={close} footer={<>
      <Btn variant="ghost" onClick={close}>Batal</Btn>
      <Btn variant="primary" onClick={() => void save()}>{existing ? 'Perbarui Nilai' : 'Simpan Nilai'}</Btn>
    </>}>
      <div className="space-y-3">
        <label className="block"><span className="block text-xs font-bold text-slate-700 mb-1">Siswa</span>
          <select className={field} value={studentId || initial?.id || ''} onChange={(e) => pick(e.target.value)}>
            <option value="">Pilih siswa…</option>
            {students.map((s) => <option key={s.id} value={s.id}>{s.name} · {s.kelas}</option>)}
          </select>
        </label>
        <label className="block"><span className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</span>
          <input className={field} value={subject || student?.subject || ''} onChange={(e) => setSubject(e.target.value)} />
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['tugas', 'uts', 'uas'] as const).map((k) => (
            <label key={k} className="block"><span className="block text-xs font-bold text-slate-700 mb-1">{k === 'tugas' ? 'Tugas (30%)' : k === 'uts' ? 'UTS (30%)' : 'UAS (40%)'}</span>
              <input type="number" min={0} max={100} className={field} value={vals[k]} onChange={(e) => setVals({ ...vals, [k]: e.target.value })} placeholder="0–100" />
            </label>
          ))}
        </div>
        <div className="rounded-xl bg-[#F4F8FF] border border-blue-100 px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-700">Nilai Akhir</span>
          <span className="text-2xl font-extrabold text-[#1D4ED8]">{final} <Badge tone={final >= 80 ? 'green' : final >= 70 ? 'blue' : 'red'}>{letterOf(final)}</Badge></span>
        </div>
        {existing && <p className="text-xs text-slate-500 font-medium">Siswa ini sudah punya nilai untuk mapel tersebut; menyimpan akan memperbaruinya.</p>}
      </div>
    </Modal>
  );
}

export default function NilaiProgress() {
  const MY_STUDENTS = useResource<TutorStudent>('class-students').rows;
  const grades = useResource<GradeRow>('grades');
  const [grading, setGrading] = useState<{ student: TutorStudent | null } | null>(null);
  const finalFor = (s: TutorStudent) => grades.rows.find((g) => g.studentNis === s.id && g.subject === s.subject);
  const [tab, setTab] = useState('Ringkasan');
  const [q, setQ] = useState('');
  const [kelas, setKelas] = useState('');
  const [chip, setChip] = useState('Semua');
  const [viewing, setViewing] = useState<TutorStudent | null>(null);

  const classNames = [...new Set(MY_STUDENTS.map((s) => s.kelas))];
  const need = MY_STUDENTS.filter((s) => gradeStatus(s) === 'Perlu Perhatian');
  const best = MY_STUDENTS.filter((s) => gradeStatus(s) === 'Sangat Baik');
  const rows = MY_STUDENTS.filter((s) =>
    (!q || `${s.name} ${s.kelas}`.toLowerCase().includes(q.toLowerCase())) && (!kelas || s.kelas === kelas) &&
    (chip === 'Semua' || (chip === 'Perlu Perhatian' ? need.includes(s) : best.includes(s))));
  const doExport = () => exportCsv('nilai-progress', ['NIS', 'Nama', 'Kelas', 'Kehadiran', 'Rata-rata Nilai', 'Progress', 'Status'], rows.map((s) => [s.id, s.name, s.kelas, `${s.attendance}%`, fmt(s.score), `${s.progress}%`, gradeStatus(s)]));

  const columns: Col<TutorStudent>[] = [
    { header: 'No.', cell: (_, i) => `${i + 1}.`, align: 'center' },
    { header: 'Siswa', cell: (s) => <Person name={s.name} sub={`NIS: ${s.id}`} /> },
    { header: 'Kelas', cell: (s) => <><span className="font-bold text-[#0F1E4A]">{s.kelas}</span><span className="block text-xs text-slate-500">{s.subject}</span></> },
    { header: 'Kehadiran', cell: (s) => <div className="flex items-center gap-2 w-32"><span className="font-bold text-[#0F1E4A] w-9">{s.attendance}%</span><Meter value={s.attendance} color={barColor(s.attendance)} className="flex-1" /></div> },
    { header: 'Rata-rata Nilai', align: 'center', cell: (s) => <span className="font-extrabold text-[#0F1E4A]">{fmt(s.score)}</span> },
    { header: 'Nilai Rapor', align: 'center', cell: (s) => { const g = finalFor(s); return g ? <span className="font-extrabold text-[#1D4ED8]">{g.finalScore} <Badge tone="blue">{g.letterGrade}</Badge></span> : <button onClick={() => setGrading({ student: s })} className="text-xs font-bold text-orange-600 hover:underline">Belum diinput</button>; } },
    { header: 'Progress', cell: (s) => <div className="flex items-center gap-2 w-32"><span className="font-bold text-[#0F1E4A] w-9">{s.progress}%</span><Meter value={s.progress} color={barColor(s.progress)} className="flex-1" /></div> },
    { header: 'Status', cell: (s) => <Badge>{gradeStatus(s)}</Badge> },
    { header: 'Aksi', align: 'center', cell: (s) => <div className="inline-flex items-center gap-2"><Btn size="sm" onClick={() => setViewing(s)}>Profil</Btn><RowMenu items={[{ label: 'Input / Ubah Nilai', onClick: () => setGrading({ student: s }) }]} /></div> },
  ];

  const perClass = (
    <Panel title="Rata-rata Nilai per Kelas" action={<button onClick={() => setTab('Analisis')} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1D4ED8] hover:underline">Lihat Analisis Kelas <ArrowRight className="w-4 h-4" /></button>}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {classNames.map((c, i) => {
          const v = avg(MY_STUDENTS.filter((s) => s.kelas === c), (s) => s.score);
          return <div key={c}><p className="text-[13px] font-bold text-[#0F1E4A] mb-1.5">{c}</p><div className="flex items-center gap-3"><Meter value={v} color={CLASS_COLORS[i % 4]} className="flex-1" /><span className="text-sm font-extrabold text-[#0F1E4A]">{fmt(v)}</span></div></div>;
        })}
      </div>
    </Panel>
  );

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1300px]">
        <PageHead title="Nilai & Progress" subtitle="Pantau capaian belajar siswa dan analisis perkembangan kelas." />
        <StatStrip
          items={[
            { icon: Users, value: MY_STUDENTS.length, label: 'Siswa', color: '#1D4ED8' },
            { icon: BadgeCheck, value: fmt(avg(MY_STUDENTS, (s) => s.score)), label: 'Rata-rata Nilai', color: '#16A34A' },
            { icon: TrendingUp, value: `${Math.round(avg(MY_STUDENTS, (s) => s.progress))}%`, label: 'Rata-rata Progress', color: '#7C3AED' },
            { icon: AlertTriangle, value: need.length, label: 'Perlu Perhatian', color: '#F97316' },
          ]}
          action={<div className="flex gap-2"><Btn onClick={doExport}>Export Nilai</Btn><Btn variant="primary" icon={PencilLine} onClick={() => setGrading({ student: null })}>Input Nilai</Btn></div>}
        />
        <Tabs tabs={['Ringkasan', 'Siswa', 'Analisis']} value={tab} onChange={setTab} />

        {tab !== 'Analisis' && (
          <>
            <div className="flex flex-wrap gap-2">
              <SearchInput value={q} onChange={setQ} placeholder="Cari siswa atau kelas..." />
              <Select value={kelas} onChange={setKelas} all="Semua Kelas" options={classNames} />
              <span className="inline-flex items-center h-10 px-3 rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-slate-800">Periode: Agustus 2026</span>
            </div>
            {tab === 'Ringkasan' && perClass}
            <div className="flex flex-wrap gap-2">
              {([['Semua', MY_STUDENTS.length, 'border-[#1D4ED8] text-[#1D4ED8] bg-[#F4F8FF]'], ['Perlu Perhatian', need.length, 'border-orange-300 text-orange-600 bg-orange-50'], ['Berprestasi', best.length, 'border-emerald-300 text-emerald-700 bg-emerald-50']] as const).map(([l, c, cls]) => (
                <button key={l} onClick={() => setChip(l)} className={cn('h-9 px-3.5 rounded-lg border text-[13px] font-bold', chip === l ? cls : 'border-slate-200 text-slate-600 bg-white')}>{l} ({c})</button>
              ))}
            </div>
            <DataTable columns={columns} rows={rows} rowKey={(s) => s.id} unit="siswa" />
          </>
        )}

        {tab === 'Analisis' && (
          <>
            {perClass}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classNames.map((c) => {
                const list = MY_STUDENTS.filter((s) => s.kelas === c);
                return (
                  <Panel key={c} title={c} action={<Badge tone="blue">{list.length} siswa</Badge>}>
                    <ul className="space-y-2.5">
                      {([['Rata-rata Nilai', avg(list, (s) => s.score)], ['Kehadiran', avg(list, (s) => s.attendance)], ['Progress', avg(list, (s) => s.progress)]] as const).map(([l, v]) => (
                        <li key={l}><div className="flex justify-between text-xs font-bold text-slate-700 mb-1"><span>{l}</span><span>{fmt(v)}</span></div><Meter value={v} color={barColor(v)} /></li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-slate-600 font-medium">Tertinggi: <b>{[...list].sort((a, b) => b.score - a.score)[0]?.name}</b> · Perlu perhatian: <b>{list.filter((s) => gradeStatus(s) === 'Perlu Perhatian').length} siswa</b></p>
                  </Panel>
                );
              })}
            </div>
          </>
        )}
        <StudentProfileModal student={viewing} onClose={() => setViewing(null)} />
        <GradeInput key={grading?.student?.id ?? 'new'} open={!!grading} initial={grading?.student ?? null} students={MY_STUDENTS} grades={grades} onClose={() => setGrading(null)} />
      </div>
    </DashboardLayout>
  );
}
