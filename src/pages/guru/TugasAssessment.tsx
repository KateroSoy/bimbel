import { useState } from 'react';
import { ClipboardList, ClipboardPen, Clock, CircleCheck, Plus, CalendarDays, FileText, BookOpenCheck } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PageHead, StatStrip, Tabs, SearchInput, Select, DataTable, Badge, Btn, RowMenu, Meter, Modal, type Col } from '../../components/portal/Kit';
import { AssignmentFormDialog } from '../../components/common/AssignmentFormDialog';
import { useDataStore, type Assignment } from '../../store/useDataStore';

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
  const [tab, setTab] = useState('Semua');
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
        <PageHead title="Tugas & Assessment" subtitle="Kelola tugas, assessment, quiz, dan penilaian untuk kelas yang Anda ajar." />
        <StatStrip
          items={[
            { icon: ClipboardList, value: assignments.filter((a) => a.status === 'Aktif').length, label: 'Tugas Aktif', color: '#1D4ED8' },
            { icon: ClipboardPen, value: submissions.filter((s) => s.status === 'Perlu Dinilai').length, label: 'Perlu Dinilai', color: '#EF4444' },
            { icon: Clock, value: assignments.filter((a) => a.status === 'Aktif' && daysLeft(a.deadline) <= 1).length, label: 'Deadline ≤ 24 jam', color: '#F97316' },
            { icon: CircleCheck, value: assignments.filter((a) => a.status === 'Selesai').length, label: 'Selesai', color: '#16A34A' },
          ]}
          action={<Btn variant="primary" icon={Plus} onClick={() => setForm({ item: null })}>Buat Tugas</Btn>}
        />
        <Tabs tabs={['Semua', 'Aktif', 'Akan Datang', 'Selesai']} value={tab} onChange={setTab} />
        <div className="flex flex-wrap gap-2">
          <SearchInput value={q} onChange={setQ} placeholder="Cari tugas atau assessment..." />
          <Select value={kelas} onChange={setKelas} all="Semua Kelas" options={[...new Set(assignments.map((a) => a.kelas))].sort()} />
          <Select value={status} onChange={setStatus} all="Semua Status" options={['Aktif', 'Perlu Dinilai', 'Selesai']} />
        </div>
        <DataTable columns={columns} rows={rows} rowKey={(a) => a.id} unit="tugas" empty="Belum ada tugas pada filter ini." />

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
