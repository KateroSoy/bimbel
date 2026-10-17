import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator, Puzzle, Users, Trophy, ClipboardCheck, Play, Clock, ChevronLeft, ChevronRight, Send, Printer, UserPlus, CheckCircle2, XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  PageHead, StatCards, FilterBar, SearchInput, Select, DataTable, Person, Badge, RowActions, Btn, Panel, InfoBox, Modal, KeyValues, WithRail,
  exportCsv, type Col,
} from '../../components/portal/Kit';
import { useResource } from '../../store/useRemote';
import { PLACEMENT_TESTS, testBySubject, type PlacementTest } from '../../data/placementTests';
import { type Registration } from '../../data/adminPortal';
import { cn } from '../../lib/utils';

export interface PlacementResult {
  id: string; name: string; age: number; grade: string; school: string; parent: string; phone: string;
  subject: string; correct: number; total: number; score: number; level: string; answers: Record<string, number>;
  date: string; status: string; note: string;
}

type Candidate = { name: string; age: string; grade: string; school: string; parent: string; phone: string };
const EMPTY_CANDIDATE: Candidate = { name: '', age: '', grade: 'Kelas 1', school: '', parent: '', phone: '' };
const GRADES = ['TK', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'];
const ICONS = { matematika: Calculator, logika: Puzzle } as const;

const levelTone = (level: string) => (level === 'Lanjutan' ? 'green' : level === 'Menengah' ? 'blue' : 'orange');
const today = () => new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });

/** Test runner: one question at a time with a countdown; returns the chosen option per question id. */
function TestRunner({ test, candidate, onCancel, onFinish }: {
  test: PlacementTest; candidate: Candidate; onCancel: () => void; onFinish: (answers: Record<string, number>) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [left, setLeft] = useState(test.minutes * 60);
  const q = test.questions[idx];
  const answered = Object.keys(answers).length;

  useEffect(() => {
    const t = window.setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(t);
  }, []);
  useEffect(() => {
    if (left === 0) {
      toast.info('Waktu habis', { description: 'Jawaban otomatis dikumpulkan.' });
      onFinish(answers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  const finish = () => {
    if (answered < test.questions.length && !window.confirm(`${test.questions.length - answered} soal belum dijawab. Kumpulkan sekarang?`)) return;
    onFinish(answers);
  };

  return (
    <div className="space-y-4 max-w-[1100px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tes Kemampuan Dasar · {test.title}</p>
          <h1 className="text-2xl font-extrabold text-[#0F1E4A]">{candidate.name} <span className="text-base font-semibold text-slate-500">({candidate.grade})</span></h1>
        </div>
        <div className={cn('flex items-center gap-2 px-4 h-10 rounded-xl border font-extrabold tabular-nums', left < 60 ? 'border-red-200 bg-red-50 text-red-600' : 'border-slate-200 bg-white text-[#0F1E4A]')}>
          <Clock className="w-4 h-4" /> {String(Math.floor(left / 60)).padStart(2, '0')}:{String(left % 60).padStart(2, '0')}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4">
        <Panel>
          <div className="flex items-center justify-between mb-4">
            <Badge tone="blue">Soal {idx + 1} dari {test.questions.length}</Badge>
            <span className="text-xs font-bold text-slate-500">{q.skill}</span>
          </div>
          <p className="text-lg font-bold text-[#0F1E4A] leading-relaxed mb-5">{q.text}</p>
          <div className="space-y-2.5">
            {q.options.map((opt, i) => (
              <button
                key={opt}
                onClick={() => setAnswers({ ...answers, [q.id]: i })}
                className={cn('w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl border-2 text-[15px] font-semibold transition-colors',
                  answers[q.id] === i ? 'border-[#1D4ED8] bg-[#EAF1FF] text-[#1D4ED8]' : 'border-slate-200 hover:border-slate-300 text-slate-700')}
              >
                <span className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-sm font-extrabold shrink-0', answers[q.id] === i ? 'bg-[#1D4ED8] text-white' : 'bg-slate-100 text-slate-600')}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            ))}
          </div>
          <div className="flex justify-between gap-2 mt-6">
            <Btn icon={ChevronLeft} onClick={() => setIdx(idx - 1)} className={idx === 0 ? 'invisible' : ''}>Sebelumnya</Btn>
            {idx < test.questions.length - 1
              ? <Btn variant="primary" onClick={() => setIdx(idx + 1)}>Berikutnya <ChevronRight className="w-4 h-4" /></Btn>
              : <Btn variant="primary" icon={Send} onClick={finish}>Kumpulkan</Btn>}
          </div>
        </Panel>

        <div className="space-y-3">
          <Panel title="Navigasi Soal">
            <div className="grid grid-cols-5 gap-2">
              {test.questions.map((qq, i) => (
                <button key={qq.id} onClick={() => setIdx(i)} aria-label={`Soal ${i + 1}`}
                  className={cn('h-9 rounded-lg text-xs font-extrabold border',
                    i === idx ? 'border-[#1D4ED8] text-[#1D4ED8] bg-white ring-2 ring-[#1D4ED8]/20' : answers[qq.id] !== undefined ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]' : 'bg-white border-slate-200 text-slate-600')}>
                  {i + 1}
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-3">{answered} dari {test.questions.length} soal terjawab</p>
          </Panel>
          <Btn variant="primary" icon={Send} onClick={finish} className="w-full">Kumpulkan Jawaban</Btn>
          <Btn variant="ghost" onClick={() => window.confirm('Batalkan tes? Jawaban tidak disimpan.') && onCancel()} className="w-full">Batalkan Tes</Btn>
        </div>
      </div>
    </div>
  );
}

function ResultSheet({ result }: { result: PlacementResult }) {
  const test = testBySubject(result.subject);
  const rec = test?.recommend(result.score);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 rounded-2xl bg-[#EAF1FF] p-4">
        <div className="w-20 h-20 rounded-2xl bg-white flex flex-col items-center justify-center shadow-sm">
          <span className="text-3xl font-extrabold text-[#1D4ED8] leading-none">{result.score}</span>
          <span className="text-[10px] font-bold text-slate-500">/ 100</span>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-600">{result.subject} · {result.correct}/{result.total} benar</p>
          <p className="text-lg font-extrabold text-[#0F1E4A]">Level {result.level}</p>
          {rec && <p className="text-sm font-semibold text-slate-600">Rekomendasi: <strong className="text-[#1D4ED8]">{rec.program}</strong></p>}
        </div>
      </div>
      <KeyValues rows={[
        ['Calon Siswa', result.name], ['Kelas / Usia', `${result.grade} · ${result.age || '-'} th`], ['Sekolah', result.school || '-'],
        ['Orang Tua', `${result.parent || '-'} (${result.phone || '-'})`], ['Tanggal Tes', result.date], ['No. Tes', result.id],
      ]} />
      {test && (
        <div>
          <p className="text-xs font-extrabold text-slate-700 mb-2">Rincian Jawaban</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {test.questions.map((q, i) => {
              const ok = result.answers?.[q.id] === q.answer;
              return (
                <div key={q.id} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  {ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                  <span className="truncate">{i + 1}. {q.skill}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TesKemampuanDasar() {
  const remote = useResource<PlacementResult>('placement-tests');
  const registrations = useResource<Registration>('registrations');
  const [q, setQ] = useState('');
  const [subject, setSubject] = useState('');
  const [starting, setStarting] = useState<PlacementTest | null>(null);
  const [candidate, setCandidate] = useState<Candidate>(EMPTY_CANDIDATE);
  const [running, setRunning] = useState<{ test: PlacementTest; candidate: Candidate } | null>(null);
  const [viewing, setViewing] = useState<PlacementResult | null>(null);
  const [deleting, setDeleting] = useState<PlacementResult | null>(null);

  const pending = registrations.rows.filter((r) => r.status === 'Menunggu Verifikasi' || r.status === 'Dalam Proses');
  const rows = remote.rows.filter((r) =>
    (!q || `${r.name} ${r.school} ${r.parent}`.toLowerCase().includes(q.toLowerCase())) && (!subject || r.subject === subject));
  const avg = (s: string) => {
    const list = remote.rows.filter((r) => r.subject === s);
    return list.length ? Math.round(list.reduce((n, r) => n + r.score, 0) / list.length) : 0;
  };
  const advanced = remote.rows.filter((r) => r.level === 'Lanjutan').length;

  const finish = async (answers: Record<string, number>) => {
    if (!running) return;
    const { test, candidate: c } = running;
    const correct = test.questions.filter((qq) => answers[qq.id] === qq.answer).length;
    const score = Math.round((correct / test.questions.length) * 100);
    const row = await remote.create({
      name: c.name, age: Number(c.age) || 0, grade: c.grade, school: c.school, parent: c.parent, phone: c.phone,
      subject: test.subject, correct, total: test.questions.length, score, level: test.recommend(score).level,
      answers, date: today(), status: 'Selesai', note: '',
    });
    setRunning(null);
    if (row) {
      toast.success('Hasil tes tersimpan');
      setViewing(row);
    }
  };

  const fillFrom = (id: string) => {
    const r = registrations.rows.find((x) => x.id === id);
    if (r) setCandidate({ ...candidate, name: r.name, age: String(r.age || ''), parent: r.parentName ?? '', phone: r.phone ?? '', school: r.school ?? '' });
  };

  const stats = useMemo(() => [
    { label: 'Total Peserta Tes', value: remote.rows.length, sub: 'Calon siswa dites', icon: Users, tone: 'blue' as const },
    { label: 'Rata-rata Matematika', value: avg('Matematika'), sub: 'Skor 0–100', icon: Calculator, tone: 'purple' as const },
    { label: 'Rata-rata Logika / Coding', value: avg('Logika / Coding'), sub: 'Skor 0–100', icon: Puzzle, tone: 'teal' as const },
    { label: 'Level Lanjutan', value: advanced, sub: 'Skor ≥ 85', icon: Trophy, tone: 'green' as const },
    { label: 'Pendaftar Belum Dites', value: pending.length, sub: 'Menunggu tes', icon: ClipboardCheck, tone: 'orange' as const, to: '/admin/pendaftaran' },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [remote.rows, pending.length]);

  const columns: Col<PlacementResult>[] = [
    { header: 'No.', cell: (_, i) => i + 1, align: 'center' },
    { header: 'Calon Siswa', cell: (r) => <Person name={r.name} sub={`${r.grade}${r.school ? ` · ${r.school}` : ''}`} /> },
    { header: 'Tes', cell: (r) => r.subject },
    { header: 'Skor', align: 'center', cell: (r) => <span className="font-extrabold text-[#0F1E4A]">{r.score}</span> },
    { header: 'Benar', align: 'center', cell: (r) => `${r.correct}/${r.total}` },
    { header: 'Level', cell: (r) => <Badge tone={levelTone(r.level)}>{r.level}</Badge> },
    { header: 'Rekomendasi', cell: (r) => <span className="text-xs font-semibold">{testBySubject(r.subject)?.recommend(r.score).program ?? '-'}</span> },
    { header: 'Tanggal', cell: (r) => r.date },
    {
      header: 'Aksi', align: 'center',
      cell: (r) => <RowActions onView={() => setViewing(r)} menu={[{ label: 'Hapus', onClick: () => setDeleting(r), danger: true }]} />,
    },
  ];

  if (running) {
    return (
      <DashboardLayout>
        <TestRunner test={running.test} candidate={running.candidate} onCancel={() => setRunning(null)} onFinish={(a) => void finish(a)} />
      </DashboardLayout>
    );
  }

  const input = 'w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-800 outline-none focus:border-[#1D4ED8] bg-white';

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1500px]">
        <PageHead
          title="Tes Kemampuan Dasar"
          subtitle="Tes diagnostik untuk calon siswa: Matematika dan Logika / Coding SD. Hasil dipakai untuk penempatan kelas."
          actions={<Btn icon={Printer} onClick={() => exportCsv('tes-kemampuan-dasar', ['No Tes', 'Nama', 'Kelas', 'Sekolah', 'Tes', 'Skor', 'Benar', 'Level', 'Tanggal'], rows.map((r) => [r.id, r.name, r.grade, r.school, r.subject, r.score, `${r.correct}/${r.total}`, r.level, r.date]))}>Export Hasil</Btn>}
        />
        <StatCards items={stats} />

        <WithRail rail={<>
          <Panel title="Pendaftar Menunggu Tes" action={<Link to="/admin/pendaftaran" className="text-xs font-bold text-[#1D4ED8] hover:underline">Lihat semua</Link>}>
            {pending.length === 0 ? <p className="text-sm text-slate-500 font-medium">Tidak ada pendaftar yang menunggu.</p> : (
              <ul className="space-y-2.5">
                {pending.slice(0, 6).map((r) => (
                  <li key={r.id} className="flex items-center gap-2">
                    <span className="flex-1 min-w-0"><span className="block text-[13px] font-bold text-slate-800 truncate">{r.name}</span><span className="block text-[11px] text-slate-500 truncate">{r.program}</span></span>
                    <Btn size="sm" variant="soft" onClick={() => { setCandidate({ ...EMPTY_CANDIDATE, name: r.name, age: String(r.age || ''), parent: r.parentName ?? '', phone: r.phone ?? '', school: r.school ?? '' }); setStarting(PLACEMENT_TESTS[0]); }}>Tes</Btn>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <InfoBox title="Cara Penilaian" items={['Skor = jumlah benar ÷ jumlah soal × 100.', 'Level Lanjutan ≥ 85, Menengah 60–84, Dasar < 60.', 'Rekomendasi program muncul otomatis di hasil tes.']} />
        </>}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PLACEMENT_TESTS.map((t) => {
              const Icon = ICONS[t.key];
              return (
                <Panel key={t.key} className="flex flex-col">
                  <div className="flex items-start gap-3 mb-3">
                    <span className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0', t.key === 'matematika' ? 'bg-violet-600' : 'bg-teal-600')}><Icon className="w-6 h-6" /></span>
                    <div>
                      <h2 className="text-base font-extrabold text-[#0F1E4A]">{t.title}</h2>
                      <p className="text-[13px] text-slate-600 font-medium">{t.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-600 mb-4">
                    <span>{t.questions.length} soal pilihan ganda</span><span>·</span><span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {t.minutes} menit</span>
                  </div>
                  <Btn variant="primary" icon={Play} className="mt-auto" onClick={() => { setCandidate(EMPTY_CANDIDATE); setStarting(t); }}>Mulai Tes {t.title}</Btn>
                </Panel>
              );
            })}
          </div>

          <FilterBar onReset={() => { setQ(''); setSubject(''); }} more={false}>
            <SearchInput value={q} onChange={setQ} placeholder="Cari nama calon siswa, sekolah, orang tua..." />
            <Select value={subject} onChange={setSubject} all="Semua Tes" options={PLACEMENT_TESTS.map((t) => t.subject)} />
          </FilterBar>
          <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} unit="hasil tes" empty={remote.loading ? 'Memuat…' : 'Belum ada hasil tes.'} />
        </WithRail>

        <Modal open={!!starting} title={`Data Calon Siswa · ${starting?.title ?? ''}`} onClose={() => setStarting(null)} wide>
          <form
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!starting) return;
              setRunning({ test: starting, candidate });
              setStarting(null);
            }}
          >
            {pending.length > 0 && (
              <label className="sm:col-span-2 block">
                <span className="block text-xs font-bold text-slate-700 mb-1">Ambil dari pendaftar (opsional)</span>
                <select className={input} defaultValue="" onChange={(e) => fillFrom(e.target.value)}>
                  <option value="">— Isi manual —</option>
                  {pending.map((r) => <option key={r.id} value={r.id}>{r.name} · {r.program}</option>)}
                </select>
              </label>
            )}
            {starting && (
              <label className="sm:col-span-2 block">
                <span className="block text-xs font-bold text-slate-700 mb-1">Jenis Tes</span>
                <select className={input} value={starting.key} onChange={(e) => setStarting(PLACEMENT_TESTS.find((t) => t.key === e.target.value) ?? starting)}>
                  {PLACEMENT_TESTS.map((t) => <option key={t.key} value={t.key}>{t.title}</option>)}
                </select>
              </label>
            )}
            {([
              ['name', 'Nama Calon Siswa', true], ['age', 'Usia (tahun)', false], ['school', 'Asal Sekolah', false], ['parent', 'Nama Orang Tua', false], ['phone', 'No. WhatsApp Orang Tua', false],
            ] as const).map(([key, label, required]) => (
              <label key={key} className="block">
                <span className="block text-xs font-bold text-slate-700 mb-1">{label}{required && <span className="text-red-500"> *</span>}</span>
                <input className={input} type={key === 'age' ? 'number' : 'text'} min={key === 'age' ? 3 : undefined} required={required} value={candidate[key]} onChange={(e) => setCandidate({ ...candidate, [key]: e.target.value })} />
              </label>
            ))}
            <label className="block">
              <span className="block text-xs font-bold text-slate-700 mb-1">Kelas</span>
              <select className={input} value={candidate.grade} onChange={(e) => setCandidate({ ...candidate, grade: e.target.value })}>
                {GRADES.map((g) => <option key={g}>{g}</option>)}
              </select>
            </label>
            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <Btn variant="ghost" onClick={() => setStarting(null)}>Batal</Btn>
              <Btn variant="primary" type="submit" icon={Play}>Mulai Tes</Btn>
            </div>
          </form>
        </Modal>

        <Modal open={!!viewing} title="Hasil Tes Kemampuan Dasar" onClose={() => setViewing(null)} wide footer={<>
          <Btn icon={Printer} onClick={() => window.print()}>Cetak</Btn>
          <Btn variant="primary" icon={UserPlus} to="/admin/pendaftaran">Proses Pendaftaran</Btn>
        </>}>
          {viewing && <ResultSheet result={viewing} />}
        </Modal>

        <Modal open={!!deleting} title="Hapus Hasil Tes" onClose={() => setDeleting(null)} footer={<>
          <Btn variant="ghost" onClick={() => setDeleting(null)}>Batal</Btn>
          <Btn variant="danger" onClick={async () => { const r = deleting!; setDeleting(null); if (await remote.remove(r.id)) toast.success('Hasil tes dihapus'); }}>Hapus</Btn>
        </>}>
          <p className="text-sm text-slate-600 font-medium">Hasil tes {deleting?.name} akan dihapus permanen. Lanjutkan?</p>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
