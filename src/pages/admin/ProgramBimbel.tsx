import { useState } from 'react';
import { BookOpen, Users, UserRound, BarChart3, Banknote, FileSpreadsheet, Plus, Tags, LayoutTemplate, FileText, ListOrdered, School } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  PageHead, StatCards, Tabs, FilterBar, SearchInput, Select, DataTable, Badge, RowActions, Btn, InfoBox, LegendBox, Panel, DonutPanel, QuickList,
  WithRail, useCrud, exportCsv, rupiah, TONE_HEX, type Col, type Field,
} from '../../components/portal/Kit';
import { PROGRAMS, CATEGORY_TONE, type ProgramRow } from '../../data/adminPortal';

const LEVELS = ['Pra-Sekolah', 'Pra-SD & SD', 'SD', 'SD (Kelas 1-6)', 'SMP', 'SMA', 'SMP & SMA'];
const CATEGORIES = Object.keys(CATEGORY_TONE);
const TABS = ['Semua Program', 'Program Aktif', 'Program Nonaktif', 'Arsip'];
const TAB_STATUS: Record<string, string> = { 'Program Aktif': 'Aktif', 'Program Nonaktif': 'Nonaktif', Arsip: 'Arsip' };
const FIELDS: Field[] = [
  { key: 'name', label: 'Nama Program', required: true },
  { key: 'level', label: 'Jenjang', type: 'select', options: LEVELS },
  { key: 'category', label: 'Kategori', type: 'select', options: CATEGORIES },
  { key: 'status', label: 'Status', type: 'select', options: ['Aktif', 'Nonaktif', 'Arsip'] },
  { key: 'sessions', label: 'Jumlah Sesi / Bulan', type: 'number', required: true },
  { key: 'minutes', label: 'Durasi per Sesi (menit)', type: 'number', required: true },
  { key: 'fee', label: 'Biaya / Bulan (Rp)', type: 'number', required: true },
  { key: 'desc', label: 'Deskripsi Singkat', type: 'textarea' },
];

export default function ProgramBimbel() {
  const [tab, setTab] = useState(TABS[0]);
  const [q, setQ] = useState('');
  const [level, setLevel] = useState('');
  const [category, setCategory] = useState('');

  const crud = useCrud<ProgramRow>(PROGRAMS, {
    label: 'Program',
    fields: FIELDS,
    create: (v, rows) => ({
      id: `PRG-${String(rows.length + 1).padStart(2, '0')}`, name: v.name, level: v.level, category: v.category, desc: v.desc || '-', sessions: Number(v.sessions) || 0,
      minutes: Number(v.minutes) || 0, fee: Number(v.fee) || 0, classes: 0, students: 0, status: v.status as ProgramRow['status'],
    }),
    detail: (p) => [['Program', p.name], ['Jenjang', p.level], ['Kategori', p.category], ['Deskripsi', <span className="font-medium text-slate-700">{p.desc}</span>], ['Durasi / Sesi', `${p.sessions}x / ${p.minutes} mnt`], ['Biaya / Bulan', rupiah(p.fee)], ['Kelas', p.classes], ['Siswa', p.students], ['Status', <Badge>{p.status}</Badge>]],
  });

  const rows = crud.rows.filter((p) =>
    (!TAB_STATUS[tab] || p.status === TAB_STATUS[tab]) && (!q || p.name.toLowerCase().includes(q.toLowerCase())) && (!level || p.level === level) && (!category || p.category === category));
  const active = crud.rows.filter((p) => p.status === 'Aktif');
  const sum = (f: (p: ProgramRow) => number) => active.reduce((a, p) => a + f(p), 0);
  const catCount = (c: string) => active.filter((p) => p.category === c).length;
  const levelGroups = ['Pra-Sekolah', 'SD', 'SMP', 'SMA', 'Pra-SD & SD'].map((l) => ({ label: l, count: active.filter((p) => (l === 'SD' ? p.level.startsWith('SD') : l === 'Pra-SD & SD' ? p.level === l : p.level.includes(l))).length }));

  const columns: Col<ProgramRow>[] = [
    { header: 'No.', cell: (_, i) => i + 1, align: 'center' },
    { header: 'Program', cell: (p) => <span className="font-bold text-[#0F1E4A] block max-w-[170px]">{p.name}</span> },
    { header: 'Jenjang', cell: (p) => <Badge tone="blue">{p.level}</Badge> },
    { header: 'Kategori', cell: (p) => <Badge tone={CATEGORY_TONE[p.category]}>{p.category}</Badge> },
    { header: 'Deskripsi Singkat', cell: (p) => <span className="block max-w-[220px] text-xs leading-snug">{p.desc}</span> },
    { header: 'Durasi / Sesi', cell: (p) => <span className="whitespace-nowrap">{p.sessions}x / {p.minutes} mnt</span> },
    { header: 'Biaya / Bulan', cell: (p) => <span className="whitespace-nowrap">{rupiah(p.fee)}</span> },
    { header: 'Kelas', align: 'center', cell: (p) => p.classes || '-' },
    { header: 'Siswa', align: 'center', cell: (p) => p.students },
    { header: 'Status', cell: (p) => <Badge>{p.status}</Badge> },
    {
      header: 'Aksi', align: 'center',
      cell: (p) => <RowActions onView={() => crud.view(p)} onEdit={() => crud.edit(p)} menu={[
        { label: p.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan', onClick: () => crud.patch(p.id, { status: p.status === 'Aktif' ? 'Nonaktif' : 'Aktif' }) },
        { label: 'Arsipkan', onClick: () => crud.patch(p.id, { status: 'Arsip' }) },
        { label: 'Hapus', onClick: () => crud.remove(p), danger: true },
      ]} />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1500px]">
        <PageHead
          title="Program Bimbel"
          subtitle="Kelola seluruh program pembelajaran yang tersedia di bimbel."
          actions={<>
            <Btn icon={FileSpreadsheet} className="!text-emerald-700" onClick={() => exportCsv('program-bimbel', ['Program', 'Jenjang', 'Kategori', 'Sesi', 'Menit', 'Biaya', 'Kelas', 'Siswa', 'Status'], rows.map((p) => [p.name, p.level, p.category, p.sessions, p.minutes, p.fee, p.classes, p.students, p.status]))}>Export ke Excel</Btn>
            <Btn variant="primary" icon={Plus} onClick={crud.add}>Tambah Program</Btn>
          </>}
        />
        <StatCards items={[
          { label: 'Total Program', value: active.length, sub: 'Program aktif', icon: BookOpen, tone: 'blue' },
          { label: 'Total Kelas', value: sum((p) => p.classes), sub: 'Kelas/Rombel', icon: Users, tone: 'green' },
          { label: 'Total Siswa', value: sum((p) => p.students), sub: 'Siswa terdaftar', icon: UserRound, tone: 'orange' },
          { label: 'Rata-rata Kapasitas', value: '74%', sub: 'Dari total kapasitas', icon: BarChart3, tone: 'purple' },
          { label: 'Rata-rata Biaya', value: rupiah(Math.round(sum((p) => p.fee) / (active.length || 1) / 500) * 500), sub: 'Per program / bulan', icon: Banknote, tone: 'teal' },
        ]} />

        <WithRail
          rail={<>
            <DonutPanel title="Distribusi Program Aktif" center={active.length} sub="Program Aktif" data={CATEGORIES.map((c) => ({ label: c, value: catCount(c), color: TONE_HEX[CATEGORY_TONE[c]], note: `${catCount(c)} program` }))} />
            <Panel title="Jenjang Program">
              <ul className="space-y-2.5">
                {levelGroups.map((l) => (
                  <li key={l.label} className="flex items-center gap-2.5 text-[13px] font-bold text-slate-800"><School className="w-4 h-4 text-[#1D4ED8]" /><span className="flex-1">{l.label}</span><span className="text-slate-600">{l.count} Program</span></li>
                ))}
              </ul>
            </Panel>
            <QuickList items={[
              { label: 'Tambah Program Baru', icon: Plus, onClick: crud.add },
              { label: 'Kategori Program', icon: Tags },
              { label: 'Template Program', icon: LayoutTemplate },
              { label: 'Laporan Program', icon: FileText },
              { label: 'Atur Urutan Program', icon: ListOrdered },
            ]} />
          </>}
        >
          <Tabs tabs={TABS} value={tab} onChange={setTab} />
          <FilterBar onReset={() => { setQ(''); setLevel(''); setCategory(''); }}>
            <SearchInput value={q} onChange={setQ} placeholder="Cari program..." />
            <Select value={level} onChange={setLevel} all="Semua Jenjang" options={LEVELS} />
            <Select value={category} onChange={setCategory} all="Semua Kategori" options={CATEGORIES} />
          </FilterBar>
          <DataTable columns={columns} rows={rows} rowKey={(p) => p.id} unit="program" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <InfoBox items={['Program aktif akan ditampilkan ke publik (website / pendaftaran).', 'Nonaktifkan program jika tidak dibuka sementara waktu.', 'Arsipkan program jika sudah tidak digunakan.']} />
            <LegendBox title="Kategori Program" rows={[
              [<Badge tone="purple">Early Learning</Badge>, 'Program untuk perkembangan anak usia dini.'], [<Badge tone="pink">Calistung</Badge>, 'Program membaca, menulis, berhitung.'],
              [<Badge tone="green">Akademik</Badge>, 'Program mata pelajaran sekolah.'], [<Badge tone="blue">Bahasa</Badge>, 'Program penguatan Bahasa (Inggris, Arab, dll).'],
              [<Badge tone="orange">Paket</Badge>, 'Kombinasi beberapa program dalam satu paket.'],
            ]} />
            <LegendBox title="Status Program" rows={[['Aktif', 'Program berjalan dan bisa diikuti siswa.'], ['Nonaktif', 'Program dihentikan sementara.'], ['Arsip', 'Program tidak digunakan lagi.']]} />
          </div>
        </WithRail>
        {crud.dialogs}
      </div>
    </DashboardLayout>
  );
}
