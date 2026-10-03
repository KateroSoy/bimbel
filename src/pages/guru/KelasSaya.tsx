import { useState } from 'react';
import { Users, BookOpen, Plus, CalendarDays, Play, GraduationCap, MessageSquareText, CalendarRange, Info, ArrowRight, type LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PageHead, Tabs, SearchInput, Select, DataTable, Btn, RowMenu, FormDialog, TONE_HEX, type Col } from '../../components/portal/Kit';
import { CLASSES, type TutorClass } from '../../data/guruPortal';

const ICONS: LucideIcon[] = [GraduationCap, BookOpen, MessageSquareText, CalendarRange];
const SORTS = ['Urutkan: Nama A-Z', 'Urutkan: Siswa Terbanyak'];

/** Form "Ajukan Perubahan": tutor tidak mengubah jadwal/ruang/daftar siswa langsung, permintaan ditinjau Admin */
export function RequestChangeDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <FormDialog
      open={open}
      title="Ajukan Perubahan"
      submitLabel="Kirim ke Admin"
      fields={[
        { key: 'kelas', label: 'Kelas', type: 'select', options: CLASSES.map((c) => c.name) },
        { key: 'type', label: 'Jenis Perubahan', type: 'select', options: ['Jadwal', 'Ruang', 'Daftar Siswa', 'Materi / Topik', 'Lainnya'] },
        { key: 'detail', label: 'Detail Permintaan', type: 'textarea', required: true, placeholder: 'Jelaskan perubahan yang diajukan...' },
      ]}
      onClose={onClose}
      onSubmit={(v) => toast.success('Permintaan dikirim ke Admin', { description: `${v.type} · ${v.kelas}` })}
    />
  );
}

export function RequestChangeBanner({ title, text, onClick }: { title?: string; text: string; onClick: () => void }) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-[#F4F8FF] px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <Info className="w-6 h-6 text-[#1D4ED8] shrink-0" />
      <div className="flex-1">
        {title && <p className="text-sm font-extrabold text-[#0F1E4A]">{title}</p>}
        <p className="text-[13px] text-slate-600 font-medium">{text}</p>
      </div>
      <Btn onClick={onClick}>Ajukan Perubahan <ArrowRight className="w-4 h-4" /></Btn>
    </div>
  );
}

export default function KelasSaya() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Aktif');
  const [q, setQ] = useState('');
  const [subject, setSubject] = useState('');
  const [sort, setSort] = useState(SORTS[0]);
  const [requesting, setRequesting] = useState(false);

  const count = (s: TutorClass['status']) => CLASSES.filter((c) => c.status === s).length;
  const active = CLASSES.filter((c) => c.status === 'Aktif');
  const rows = CLASSES
    .filter((c) => c.status === tab && (!q || `${c.name} ${c.code}`.toLowerCase().includes(q.toLowerCase())) && (!subject || c.subject === subject))
    .sort((a, b) => (sort === SORTS[0] ? a.name.localeCompare(b.name) : b.students - a.students));

  const columns: Col<TutorClass>[] = [
    {
      header: 'Kelas',
      cell: (c) => {
        const Icon = ICONS[(Number(c.id) - 1) % ICONS.length];
        return (
          <div className="flex items-center gap-3 py-1">
            <span className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${TONE_HEX[c.tone]}1A`, color: TONE_HEX[c.tone] }}><Icon className="w-6 h-6" /></span>
            <div><p className="text-[15px] font-extrabold text-[#0F1E4A]">{c.name}</p><p className="text-xs text-slate-500 font-medium">{c.code}</p></div>
          </div>
        );
      },
    },
    { header: 'Mata Pelajaran', cell: (c) => c.subject },
    { header: 'Jadwal', cell: (c) => <span className="flex items-center gap-2 whitespace-nowrap"><CalendarDays className="w-4 h-4 text-slate-500" /><span><b className="text-[#0F1E4A]">{c.days}</b><br />{c.time}</span></span> },
    { header: 'Siswa', cell: (c) => <span className="flex items-center gap-2 whitespace-nowrap"><Users className="w-4 h-4 text-slate-500" /> {c.students} siswa</span> },
    { header: 'Status', cell: (c) => <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${c.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}><span className={`w-2 h-2 rounded-full ${c.status === 'Aktif' ? 'bg-emerald-500' : 'bg-slate-400'}`} />{c.status}</span> },
    {
      header: 'Aksi', align: 'center',
      cell: (c) => (
        <div className="inline-flex items-center gap-2">
          <Btn variant="primary" icon={Play} to={`/guru/kelas/${c.id}`}>Buka Kelas</Btn>
          <RowMenu items={[
            { label: 'Presensi Kelas', onClick: () => navigate('/guru/absensi') },
            { label: 'Ajukan Perubahan', onClick: () => setRequesting(true) },
          ]} />
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1300px]">
        <PageHead title="Kelas Saya" subtitle="Lihat dan kelola kelas yang Anda ajar." actions={<Btn variant="primary" icon={Plus} onClick={() => setRequesting(true)}>Ajukan Perubahan</Btn>} />

        <div className="rounded-2xl bg-[#F4F8FF] border border-blue-100 px-5 py-3.5 flex flex-wrap items-center gap-x-8 gap-y-2">
          <span className="flex items-center gap-2.5 text-sm font-semibold text-slate-700"><span className="w-9 h-9 rounded-lg bg-[#EAF1FF] text-[#1D4ED8] flex items-center justify-center"><Users className="w-5 h-5" /></span><b className="text-lg font-extrabold text-[#0F1E4A]">{active.length}</b> Kelas Aktif</span>
          <span className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 sm:pl-8 sm:border-l sm:border-blue-100"><span className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><BookOpen className="w-5 h-5" /></span><b className="text-lg font-extrabold text-[#0F1E4A]">{active.reduce((a, c) => a + c.students, 0)}</b> Siswa</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
          <Tabs className="flex-1" tabs={[{ label: `Aktif (${count('Aktif')})`, value: 'Aktif' }, 'Akan Datang', 'Selesai']} value={tab} onChange={setTab} />
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput value={q} onChange={setQ} placeholder="Cari kelas..." className="!flex-none w-56" />
            <Select value={subject} onChange={setSubject} all="Semua Program" options={[...new Set(CLASSES.map((c) => c.subject))]} />
            <Select value={sort} onChange={setSort} options={SORTS} />
          </div>
        </div>

        <DataTable columns={columns} rows={rows} rowKey={(c) => c.id} unit="kelas" empty={`Belum ada kelas ${tab.toLowerCase()}.`} />
        <RequestChangeBanner title="Butuh perubahan jadwal, ruang, atau daftar siswa?" text="Gunakan fitur Ajukan Perubahan. Permintaan Anda akan ditinjau dan disetujui oleh Admin." onClick={() => setRequesting(true)} />
        <RequestChangeDialog open={requesting} onClose={() => setRequesting(false)} />
      </div>
    </DashboardLayout>
  );
}
