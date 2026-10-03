import { useState } from 'react';
import { Folder, FileText, RefreshCw, Plus, Sigma, FlaskConical, Languages, SquareRadical, type LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PageHead, StatStrip, Tabs, SearchInput, Select, DataTable, Badge, Btn, RowMenu, Meter, FormDialog, soon, type Col } from '../../components/portal/Kit';
import { useDataStore } from '../../store/useDataStore';
import { MATERIALS, MODULES, CLASS_NAMES, type MaterialRow } from '../../data/guruPortal';
import { RequestChangeBanner, RequestChangeDialog } from './KelasSaya';

const ICONS: LucideIcon[] = [Sigma, FlaskConical, Languages, SquareRadical];

export default function MateriModul() {
  const { courses } = useDataStore();
  const [rows, setRows] = useState(MATERIALS);
  const [modules, setModules] = useState(MODULES);
  const [tab, setTab] = useState('Materi Kelas');
  const [q, setQ] = useState('');
  const [kelas, setKelas] = useState('');
  const [adding, setAdding] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const filtered = rows.filter((m) => (!q || `${m.kelas} ${m.last} ${m.subject}`.toLowerCase().includes(q.toLowerCase())) && (!kelas || m.kelas === kelas));
  const setStatus = (id: string, status: MaterialRow['status']) => { setRows((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m))); toast.success(status === 'Published' ? 'Materi dipublikasikan' : 'Materi dikembalikan ke draft'); };

  const columns: Col<MaterialRow>[] = [
    {
      header: 'KELAS',
      cell: (m) => {
        const Icon = ICONS[(Number(m.id.slice(1)) - 1) % ICONS.length];
        return (
          <div className="flex items-center gap-3 py-1.5">
            <span className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${m.color}1F`, color: m.color }}><Icon className="w-6 h-6" /></span>
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-[15px] font-extrabold text-[#0F1E4A]">{m.kelas} <Badge>{m.status}</Badge></p>
              <p className="text-xs text-slate-600 font-medium">{m.subject} · {m.students} siswa</p>
            </div>
          </div>
        );
      },
    },
    { header: 'MATERI TERAKHIR', cell: (m) => <div className="flex items-center gap-2.5"><FileText className="w-5 h-5 shrink-0" style={{ color: m.color }} /><div><p className="text-sm font-bold text-[#0F1E4A]">{m.last}</p><p className="text-xs text-slate-500">{m.date}</p></div></div> },
    { header: 'PROGRESS', cell: (m) => <div className="w-44"><p className="text-sm font-extrabold text-[#0F1E4A]">{m.progress}%</p><Meter value={m.progress} color={m.color} className="my-1" /><p className="text-[11px] text-slate-500">{m.done} dari {m.planned} materi minggu ini</p></div> },
    {
      header: 'AKSI', align: 'center',
      cell: (m) => (
        <div className="inline-flex items-center gap-2">
          <Btn to="/guru/course/kelola">Buka Materi</Btn>
          <RowMenu items={[
            m.status === 'Draft' ? { label: 'Publikasikan', onClick: () => setStatus(m.id, 'Published') } : { label: 'Jadikan Draft', onClick: () => setStatus(m.id, 'Draft') },
            { label: 'Ajukan Perubahan Topik', onClick: () => setRequesting(true) },
          ]} />
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1300px]">
        <PageHead title="Materi & Modul" subtitle="Kelola materi pembelajaran untuk kelas yang Anda ajar." />
        <StatStrip
          items={[
            { icon: Folder, value: 42, label: 'materi aktif', color: '#1D4ED8' },
            { icon: FileText, value: rows.filter((m) => m.status === 'Draft').length + modules.filter((m) => m.status === 'Draft').length, label: 'draft', color: '#7C3AED' },
            { icon: RefreshCw, value: 6, label: 'perlu diperbarui', color: '#EF4444' },
          ]}
          action={<Btn variant="primary" icon={Plus} onClick={() => setAdding(true)}>Tambah Materi</Btn>}
        />
        <Tabs tabs={['Materi Kelas', 'Modul', 'Bank Materi']} value={tab} onChange={setTab} />

        {tab === 'Materi Kelas' && (
          <>
            <div className="flex flex-wrap gap-2">
              <SearchInput value={q} onChange={setQ} placeholder="Cari materi atau topik..." />
              <Select value={kelas} onChange={setKelas} all="Semua Kelas" options={rows.map((m) => m.kelas)} className="w-52" />
            </div>
            <DataTable columns={columns} rows={filtered} rowKey={(m) => m.id} unit="kelas" />
          </>
        )}

        {tab === 'Modul' && (
          <DataTable
            unit="modul"
            rows={modules}
            rowKey={(m) => m.id}
            columns={[
              { header: 'MODUL', cell: (m) => <div className="py-1"><p className="text-sm font-extrabold text-[#0F1E4A]">{m.title}</p><p className="text-xs text-slate-500">{m.kelas}</p></div> },
              { header: 'TOPIK', align: 'center', cell: (m) => `${m.topics} topik` },
              { header: 'DIPERBARUI', cell: (m) => m.updated },
              { header: 'STATUS', cell: (m) => <Badge>{m.status}</Badge> },
              { header: 'AKSI', align: 'center', cell: (m) => <div className="inline-flex gap-2"><Btn size="sm" to="/guru/course/kelola">Buka</Btn><RowMenu items={[{ label: 'Hapus', danger: true, onClick: () => { setModules((prev) => prev.filter((x) => x.id !== m.id)); toast.success('Modul dihapus'); } }]} /></div> },
            ]}
          />
        )}

        {tab === 'Bank Materi' && (
          <DataTable
            unit="materi"
            rows={courses}
            rowKey={(c) => c.id}
            empty="Belum ada course master."
            columns={[
              { header: 'COURSE MASTER', cell: (c) => <div className="py-1"><p className="text-sm font-extrabold text-[#0F1E4A]">{c.title}</p><p className="text-xs text-slate-500">{c.category} · {c.instructor}</p></div> },
              { header: 'MATERI', align: 'center', cell: (c) => `${c.lessons ?? 0} materi` },
              { header: 'SISWA', align: 'center', cell: (c) => c.students },
              { header: 'STATUS', cell: (c) => <Badge>{c.status}</Badge> },
              { header: 'AKSI', align: 'center', cell: () => <Btn size="sm" onClick={() => soon('Gunakan materi dari Bank Materi')}>Gunakan</Btn> },
            ]}
          />
        )}

        <RequestChangeBanner text="Struktur Course Master (unit & topik) dikelola oleh Admin. Jika ada topik yang perlu ditambahkan atau perubahan, ajukan permintaan melalui Ajukan Perubahan." onClick={() => setRequesting(true)} />

        <FormDialog
          open={adding}
          title="Tambah Materi"
          fields={[
            { key: 'title', label: 'Judul Materi / Modul', required: true },
            { key: 'kelas', label: 'Kelas', type: 'select', options: CLASS_NAMES },
            { key: 'topics', label: 'Jumlah Topik', type: 'number' },
            { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Published'] },
          ]}
          onClose={() => setAdding(false)}
          onSubmit={(v) => {
            setModules((prev) => [{ id: `MD${Date.now()}`, title: v.title, kelas: v.kelas, topics: Number(v.topics) || 1, updated: 'Hari ini', status: v.status }, ...prev]);
            setTab('Modul');
            toast.success('Materi ditambahkan', { description: `${v.title} · ${v.kelas}` });
          }}
        />
        <RequestChangeDialog open={requesting} onClose={() => setRequesting(false)} />
      </div>
    </DashboardLayout>
  );
}
