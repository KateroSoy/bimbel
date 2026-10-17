import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ClipboardList, ClipboardPen, Clock, CircleCheck, Plus, CalendarDays, FileText, BookOpenCheck, Download, FileDown } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PageHead, StatStrip, Tabs, SearchInput, Select, DataTable, Badge, Btn, RowMenu, Meter, Modal, Panel, exportCsv, type Col } from '../../components/portal/Kit';
import { downloadReport } from '../../lib/pdfReport';
import { useAppStore } from '../../store/useAppStore';
import { AssignmentFormDialog } from '../../components/common/AssignmentFormDialog';
import { useDataStore, type Assignment, type Submission } from '../../store/useDataStore';

const predikat = (n: number) => (n >= 90 ? 'A' : n >= 80 ? 'B' : n >= 70 ? 'C' : 'D');

/** Rekap nilai: one row per student, one column per graded assignment of the chosen class. */
function RekapNilai({ assignments, submissions }: { assignments: Assignment[]; submissions: Submission[] }) {
  const tutor = useAppStore((st) => st.user?.name ?? '');
  const classes = [...new Set(assignments.map((a) => a.kelas))].sort();
  const [picked, setKelas] = useState('');
  // Default to the first class that already has submissions
  const kelas = picked || classes.find((c) => submissions.some((sub) => assignments.find((a) => a.id === sub.assignmentId)?.kelas === c)) || classes[0] || '';
  const tasks = assignments.filter((a) => a.kelas === kelas);
  const rows = useMemo(() => {
    const byStudent = new Map<string, { name: string; nis: string; scores: Record<string, number | null> }>();
    for (const sub of submissions) {
      if (!tasks.some((t) => t.id === sub.assignmentId)) continue;
      const key = sub.studentId || sub.studentName;
      const row = byStudent.get(key) ?? { name: sub.studentName, nis: sub.studentNis ?? '', scores: {} };
      row.scores[sub.assignmentId] = sub.status === 'Dinilai' && sub.score !== null ? Number(sub.score) : null;
      byStudent.set(key, row);
    }
    return [...byStudent.values()].map((r) => {
      const graded = Object.values(r.scores).filter((v): v is number => v !== null);
      const avg = graded.length ? Math.round(graded.reduce((a, b) => a + b, 0) / graded.length) : null;
      return { ...r, avg, ungraded: Object.values(r.scores).filter((v) => v === null).length };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [submissions, kelas]); // eslint-disable-line react-hooks/exhaustive-deps
  const queue = submissions.filter((sub) => sub.status === 'Perlu Dinilai');

  const header = ['No', 'Siswa', 'NIS', ...tasks.map((t) => t.title), 'Rata-rata', 'Predikat'];
  const body = rows.map((r, i) => [i + 1, r.name, r.nis, ...tasks.map((t) => (r.scores[t.id] ?? (t.id in r.scores ? 'Belum dinilai' : '-'))), r.avg ?? '-', r.avg === null ? '-' : predikat(r.avg)]);

  const pdf = () => downloadReport({
    filename: `rekap-nilai-${kelas.toLowerCase().replace(/\s+/g, '-')}`,
    title: 'REKAP NILAI TUGAS & ASSESSMENT',
    subtitle: `Kelas ${kelas}`,
    identity: [['Kelas', kelas], ['Tutor', tutor || '-'], ['Jumlah Siswa', String(rows.length)], ['Jumlah Tugas', String(tasks.length)]],
    sections: [{ head: header, body, align: header.map((_, i) => (i === 1 ? 'left' : 'center')) }],
  }).then(() => toast.success('Rekap nilai (PDF) diunduh')).catch(() => toast.error('Gagal membuat PDF'));

  return (
    <div className="space-y-3">
      {queue.length > 0 && (
        <Panel title={<span className="flex items-center gap-2"><ClipboardPen className="w-5 h-5 text-red-500" /> Perlu Diperiksa ({queue.length})</span>}>
          <ul className="divide-y divide-slate-100">
            {queue.slice(0, 6).map((sub) => {
              const task = assignments.find((a) => a.id === sub.assignmentId);
              return (
                <li key={sub.id} className="flex items-center gap-3 py-2">
                  <span className="flex-1 min-w-0"><span className="block text-sm font-bold text-[#0F1E4A] truncate">{sub.studentName}</span><span className="block text-xs text-slate-500 truncate">{task?.title ?? sub.assignmentId} · {sub.submittedAt ?? ''}</span></span>
                  <Btn size="sm" variant="primary" to={`/guru/tugas/${sub.assignmentId}`}>Periksa & Nilai</Btn>
                </li>
              );
            })}
          </ul>
        </Panel>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Select value={kelas} onChange={setKelas} options={classes} />
        <span className="flex-1" />
        <Btn icon={Download} onClick={() => exportCsv(`rekap-nilai-${kelas}`, header, body)}>Export Excel (CSV)</Btn>
        <Btn variant="primary" icon={FileDown} onClick={() => void pdf()}>Unduh PDF</Btn>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-700">
              <th className="px-3 py-3 text-left font-bold">Siswa</th>
              {tasks.map((t) => <th key={t.id} className="px-3 py-3 font-bold text-center max-w-[160px]" title={t.title}><span className="block truncate">{t.title}</span><span className="block text-[10px] font-semibold text-slate-500">{t.type === 'quiz' ? 'Quiz' : 'Tugas'}</span></th>)}
              <th className="px-3 py-3 font-bold text-center">Rata-rata</th>
              <th className="px-3 py-3 font-bold text-center">Predikat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && <tr><td colSpan={tasks.length + 3} className="px-4 py-10 text-center text-sm text-slate-500">Belum ada pengumpulan untuk kelas ini.</td></tr>}
            {rows.map((r) => (
              <tr key={r.name + r.nis} className="hover:bg-slate-50/60">
                <td className="px-3 py-2.5"><p className="font-bold text-[#0F1E4A]">{r.name}</p><p className="text-[11px] text-slate-500">{r.nis}</p></td>
                {tasks.map((t) => {
                  const v = r.scores[t.id];
                  return <td key={t.id} className="px-3 py-2.5 text-center">{v === undefined ? <span className="text-slate-300">–</span> : v === null ? <Badge tone="orange">Belum dinilai</Badge> : <span className={v < 70 ? 'font-extrabold text-red-600' : 'font-extrabold text-[#0F1E4A]'}>{v}</span>}</td>;
                })}
                <td className="px-3 py-2.5 text-center font-extrabold text-[#1D4ED8]">{r.avg ?? '-'}</td>
                <td className="px-3 py-2.5 text-center">{r.avg === null ? '-' : <Badge tone={r.avg >= 80 ? 'green' : r.avg >= 70 ? 'blue' : 'red'}>{predikat(r.avg)}</Badge>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const DAY = 86400000;
const daysLeft = (deadline: string) => Math.ceil((new Date(deadline).setHours(23, 59, 59) - Date.now()) / DAY);
const dueLabel = (deadline: string) => {
  const d = daysLeft(deadline);
  if (d < 1) return { text: d < 0 ? 'Lewat tenggat' : 'Hari ini', urgent: true };
  if (d === 1) return { text: 'Besok', urgent: true };
  return { text: d <= 7 ? `${d} hari lagi` : new Date(deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }), urgent: false };
};

export default function TugasAssessment() {
  const { assignments, submissions, addAssignment, updateAssignment, deleteAssignment } = useDataStore();
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('tab') === 'rekap' ? 'Rekap Nilai' : 'Semua');
  const [q, setQ] = useState('');
  const [kelas, setKelas] = useState('');
  const [status, setStatus] = useState('');
  const [form, setForm] = useState<{ item: Assignment | null } | null>(null);
  const [deleting, setDeleting] = useState<Assignment | null>(null);

  const pending = (a: Assignment) => submissions.filter((s) => s.assignmentId === a.id && s.status === 'Perlu Dinilai').length;
  // Status tampilan: tugas aktif dengan pengumpulan yang belum dinilai ditandai "Perlu Dinilai"
  const statusOf = (a: Assignment) => (a.status === 'Selesai' ? 'Selesai' : pending(a) > 0 ? 'Perlu Dinilai' : 'Aktif');
  const rows = assignments.filter((a) =>
    (tab === 'Semua' || (tab === 'Aktif' ? a.status === 'Aktif' : tab === 'Selesai' ? a.status === 'Selesai' : a.status === 'Aktif' && daysLeft(a.deadline) > 7)) &&
    (!q || `${a.title} ${a.subject}`.toLowerCase().includes(q.toLowerCase())) && (!kelas || a.kelas === kelas) && (!status || statusOf(a) === status));

  const submit = (data: Omit<Assignment, 'id'>) => {
    if (form?.item) { updateAssignment(form.item.id, data); toast.success('Tugas diperbarui'); }
    else { addAssignment(data); toast.success('Tugas baru dibuat & diterbitkan'); }
  };

  const columns: Col<Assignment>[] = [
    {
      header: 'TUGAS / ASSESSMENT',
      cell: (a) => (
        <div className="flex items-center gap-3 py-1.5">
          <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${a.type === 'quiz' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>{a.type === 'quiz' ? <BookOpenCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}</span>
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-[#0F1E4A] truncate max-w-[280px]" title={a.title}>{a.title}</p>
            <p className="flex items-center gap-2 text-xs text-slate-600 font-medium mt-0.5"><Badge tone={a.type === 'quiz' ? 'blue' : 'purple'}>{a.type === 'quiz' ? 'Quiz' : 'Tugas'}</Badge> · {a.subject}</p>
          </div>
        </div>
      ),
    },
    { header: 'KELAS', cell: (a) => <><span className="font-bold text-[#0F1E4A]">{a.kelas}</span><span className="block text-xs text-slate-500">{a.total} siswa</span></> },
    {
      header: 'DEADLINE',
      cell: (a) => {
        const due = dueLabel(a.deadline);
        return <span className="flex items-center gap-2 whitespace-nowrap"><CalendarDays className={`w-4 h-4 ${due.urgent ? 'text-red-500' : 'text-slate-500'}`} /><span><b className={due.urgent ? 'text-red-600' : 'text-[#0F1E4A]'}>{due.text}</b><br /><span className="text-xs text-slate-500">23.59 WIB</span></span></span>;
      },
    },
    {
      header: 'PENGUMPULAN',
      cell: (a) => {
        const pct = a.total ? Math.round((a.submitted / a.total) * 100) : 0;
        return <div className="w-36"><p className="font-bold text-[#0F1E4A]">{a.submitted} / {a.total}</p><div className="flex items-center gap-2"><span className="text-xs font-bold">{pct}%</span><Meter value={pct} className="flex-1" /></div></div>;
      },
    },
    { header: 'STATUS', cell: (a) => <Badge>{statusOf(a)}</Badge> },
    {
      header: 'AKSI', align: 'center',
      cell: (a) => (
        <div className="inline-flex items-center gap-2">
          <Btn variant={statusOf(a) === 'Selesai' ? 'outline' : 'primary'} to={`/guru/tugas/${a.id}`} className="w-[96px]">{statusOf(a) === 'Selesai' ? 'Lihat Hasil' : 'Nilai'}</Btn>
          <RowMenu items={[
            { label: 'Ubah', onClick: () => setForm({ item: a }) },
            { label: a.status === 'Aktif' ? 'Tandai Selesai' : 'Aktifkan Kembali', onClick: () => { updateAssignment(a.id, { status: a.status === 'Aktif' ? 'Selesai' : 'Aktif' }); toast.success('Status tugas diperbarui'); } },
            { label: 'Hapus', onClick: () => setDeleting(a), danger: true },
          ]} />
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1300px]">
        <PageHead title="Tugas & Assessment" subtitle="Siapkan latihan dan tugas yang tampil di halaman Latihan dan Tugas siswa, periksa jawaban, beri nilai, dan lihat rekap nilai." />
        <StatStrip
          items={[
            { icon: ClipboardList, value: assignments.filter((a) => a.status === 'Aktif').length, label: 'Tugas Aktif', color: '#1D4ED8' },
            { icon: ClipboardPen, value: submissions.filter((s) => s.status === 'Perlu Dinilai').length, label: 'Perlu Dinilai', color: '#EF4444' },
            { icon: Clock, value: assignments.filter((a) => a.status === 'Aktif' && daysLeft(a.deadline) <= 1).length, label: 'Deadline ≤ 24 jam', color: '#F97316' },
            { icon: CircleCheck, value: assignments.filter((a) => a.status === 'Selesai').length, label: 'Selesai', color: '#16A34A' },
          ]}
          action={<Btn variant="primary" icon={Plus} onClick={() => setForm({ item: null })}>Buat Tugas</Btn>}
        />
        <Tabs tabs={['Semua', 'Aktif', 'Akan Datang', 'Selesai', { label: 'Rekap Nilai', value: 'Rekap Nilai' }]} value={tab} onChange={setTab} />
        {tab === 'Rekap Nilai' ? <RekapNilai assignments={assignments} submissions={submissions} /> : <>
        <div className="flex flex-wrap gap-2">
          <SearchInput value={q} onChange={setQ} placeholder="Cari tugas atau assessment..." />
          <Select value={kelas} onChange={setKelas} all="Semua Kelas" options={[...new Set(assignments.map((a) => a.kelas))].sort()} />
          <Select value={status} onChange={setStatus} all="Semua Status" options={['Aktif', 'Perlu Dinilai', 'Selesai']} />
        </div>
        <DataTable columns={columns} rows={rows} rowKey={(a) => a.id} unit="tugas" empty="Belum ada tugas pada filter ini." />
        </>}

        <AssignmentFormDialog isOpen={!!form} onClose={() => setForm(null)} onSubmit={submit} initialData={form?.item ?? null} />
        <Modal
          open={!!deleting}
          title="Hapus Tugas"
          onClose={() => setDeleting(null)}
          footer={<>
            <Btn variant="ghost" onClick={() => setDeleting(null)}>Batal</Btn>
            <Btn variant="danger" onClick={() => { deleteAssignment(deleting!.id); setDeleting(null); toast.success('Tugas dihapus'); }}>Hapus</Btn>
          </>}
        >
          <p className="text-sm text-slate-600 font-medium">Tugas <b>{deleting?.title}</b> akan dihapus dan tidak lagi tampil di portal siswa. Lanjutkan?</p>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
